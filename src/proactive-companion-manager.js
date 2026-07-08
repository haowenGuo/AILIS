const STORAGE_KEY = 'ailis_proactive_companion_state_v1';
const DEFAULT_IDLE_CHECK_MIN_MS = 15 * 60 * 1000;
const DEFAULT_IDLE_CHECK_MAX_MS = 45 * 60 * 1000;
const DEFAULT_AFTER_TURN_MIN_MS = 90 * 1000;
const DEFAULT_AFTER_TURN_MAX_MS = 180 * 1000;
const DEFAULT_BUSY_RECHECK_MS = 30 * 1000;
const DEFAULT_MAX_SPEAKS_PER_DAY = 5;
const DEFAULT_MAX_CHECKS_PER_DAY = 30;

function clampNumber(value, minimum, maximum, fallback) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) {
        return fallback;
    }
    return Math.min(Math.max(numeric, minimum), maximum);
}

function randomBetween(minimum, maximum) {
    const min = Math.min(minimum, maximum);
    const max = Math.max(minimum, maximum);
    return min + Math.random() * (max - min);
}

function todayKey(now = Date.now()) {
    return new Date(now).toISOString().slice(0, 10);
}

function normalizeText(value) {
    return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : '';
}

function compactMessage(message = {}) {
    return {
        role: normalizeText(message.role),
        text: normalizeText(message.content || message.text).slice(0, 900)
    };
}

function readState() {
    try {
        const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        return parsed && typeof parsed === 'object' ? parsed : {};
    } catch {
        return {};
    }
}

function writeState(state = {}) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
}

export class ProactiveCompanionManager {
    constructor({
        getConfig,
        getChatState,
        requestOpportunity,
        onSpeak,
        logger = console
    } = {}) {
        this.getConfig = getConfig;
        this.getChatState = getChatState;
        this.requestOpportunity = requestOpportunity;
        this.onSpeak = onSpeak;
        this.logger = logger;
        this.timer = null;
        this.running = false;
        this.state = {
            day: todayKey(),
            checksToday: 0,
            speaksToday: 0,
            lastUserTurnAt: 0,
            lastAssistantTurnAt: 0,
            lastProactiveAt: 0,
            lastDecision: null,
            ...readState()
        };
        this.normalizeDailyState();
    }

    normalizeDailyState(now = Date.now()) {
        const day = todayKey(now);
        if (this.state.day !== day) {
            this.state = {
                ...this.state,
                day,
                checksToday: 0,
                speaksToday: 0
            };
            this.persist();
        }
    }

    persist() {
        writeState(this.state);
    }

    isEnabled() {
        return Boolean(this.getConfig?.().AUTO_CHAT_ENABLED);
    }

    start(reason = 'start') {
        this.schedule(reason);
    }

    stop() {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
    }

    noteUserTurn(now = Date.now()) {
        this.state.lastUserTurnAt = now;
        this.persist();
    }

    noteAssistantTurn({ proactive = false } = {}, now = Date.now()) {
        this.state.lastAssistantTurnAt = now;
        if (proactive) {
            this.state.lastProactiveAt = now;
            this.state.speaksToday = Number(this.state.speaksToday || 0) + 1;
        }
        this.persist();
    }

    getIntervalConfig() {
        const config = this.getConfig?.() || {};
        const minimum = clampNumber(
            config.AUTO_CHAT_MIN_INTERVAL,
            15 * 1000,
            60 * 60 * 1000,
            DEFAULT_IDLE_CHECK_MIN_MS
        );
        const maximum = clampNumber(
            config.AUTO_CHAT_MAX_INTERVAL,
            minimum,
            60 * 60 * 1000,
            DEFAULT_IDLE_CHECK_MAX_MS
        );
        return {
            minimum,
            maximum: Math.max(minimum, maximum)
        };
    }

    buildDecisionContext(now = Date.now()) {
        const chat = this.getChatState?.() || {};
        const messages = Array.isArray(chat.messageHistory) ? chat.messageHistory : [];
        const lastVisibleTurns = messages
            .filter((message) => ['user', 'assistant'].includes(message?.role))
            .slice(-10)
            .map(compactMessage)
            .filter((message) => message.text);
        const latestUser = [...lastVisibleTurns].reverse().find((message) => message.role === 'user');
        const latestAssistant = [...lastVisibleTurns].reverse().find((message) => message.role === 'assistant');
        return {
            nowIso: new Date(now).toISOString(),
            recentContext: {
                lastVisibleTurns,
                latestUserText: latestUser?.text || '',
                latestAssistantText: latestAssistant?.text || ''
            },
            interactionState: {
                appFocused: !document.hidden,
                userTyping: Boolean(chat.userTyping),
                inputDisabled: Boolean(chat.inputDisabled),
                assistantBusy: Boolean(chat.isBusy),
                voicePlaying: Boolean(chat.voicePlaying),
                lastUserMessageAgeMs: this.state.lastUserTurnAt ? now - this.state.lastUserTurnAt : null,
                lastAssistantMessageAgeMs: this.state.lastAssistantTurnAt ? now - this.state.lastAssistantTurnAt : null,
                lastProactiveAgeMs: this.state.lastProactiveAt ? now - this.state.lastProactiveAt : null
            },
            proactiveHistory: {
                checksToday: Number(this.state.checksToday || 0),
                speaksToday: Number(this.state.speaksToday || 0),
                lastDecision: this.state.lastDecision || null
            }
        };
    }

    hardGate(context = {}) {
        const state = context.interactionState || {};
        if (!this.isEnabled()) {
            return { ok: false, reason: 'disabled', delayMs: null };
        }
        if (!state.appFocused) {
            return { ok: false, reason: 'window_hidden', delayMs: this.getIntervalConfig().minimum };
        }
        if (state.inputDisabled || state.userTyping || state.assistantBusy || state.voicePlaying) {
            return { ok: false, reason: 'busy', delayMs: DEFAULT_BUSY_RECHECK_MS };
        }
        if (Number(state.lastUserMessageAgeMs || 0) > 0 && state.lastUserMessageAgeMs < DEFAULT_AFTER_TURN_MIN_MS) {
            return { ok: false, reason: 'after_user_turn_cooldown', delayMs: DEFAULT_AFTER_TURN_MIN_MS };
        }
        if (Number(state.lastAssistantMessageAgeMs || 0) > 0 && state.lastAssistantMessageAgeMs < DEFAULT_AFTER_TURN_MIN_MS) {
            return { ok: false, reason: 'after_assistant_turn_cooldown', delayMs: DEFAULT_AFTER_TURN_MIN_MS };
        }
        if (Number(this.state.checksToday || 0) >= DEFAULT_MAX_CHECKS_PER_DAY) {
            return { ok: false, reason: 'daily_check_budget_exhausted', delayMs: this.msUntilTomorrow() };
        }
        if (Number(this.state.speaksToday || 0) >= DEFAULT_MAX_SPEAKS_PER_DAY) {
            return { ok: false, reason: 'daily_speak_budget_exhausted', delayMs: this.msUntilTomorrow() };
        }
        return { ok: true, reason: 'eligible' };
    }

    msUntilTomorrow(now = Date.now()) {
        const date = new Date(now);
        const tomorrow = new Date(date);
        tomorrow.setHours(24, 5, 0, 0);
        return Math.max(DEFAULT_IDLE_CHECK_MIN_MS, tomorrow.getTime() - now);
    }

    getNextDelay(reason = 'idle', decision = null) {
        const { minimum, maximum } = this.getIntervalConfig();
        if (decision?.cooldownSec) {
            return clampNumber(Number(decision.cooldownSec) * 1000, minimum, 24 * 60 * 60 * 1000, minimum);
        }
        if (/turn|assistant|user/.test(reason)) {
            return randomBetween(DEFAULT_AFTER_TURN_MIN_MS, DEFAULT_AFTER_TURN_MAX_MS);
        }
        if (/busy|typing|voice/.test(reason)) {
            return DEFAULT_BUSY_RECHECK_MS;
        }
        return randomBetween(minimum, maximum);
    }

    schedule(reason = 'idle', delayMs = null) {
        this.stop();
        if (!this.isEnabled()) {
            this.logger?.log?.('⏸️ 主动陪伴已关闭');
            return;
        }
        const nextDelay = Number.isFinite(Number(delayMs))
            ? Math.max(1000, Number(delayMs))
            : this.getNextDelay(reason, this.state.lastDecision);
        this.timer = setTimeout(() => this.tick(reason), nextDelay);
        this.logger?.log?.(`⏱️ 下一次主动陪伴判断将在 ${(nextDelay / 1000).toFixed(1)} 秒后`);
    }

    async tick(reason = 'timer') {
        if (this.running) {
            this.schedule('busy', DEFAULT_BUSY_RECHECK_MS);
            return;
        }
        this.running = true;
        try {
            this.normalizeDailyState();
            const context = this.buildDecisionContext();
            const gate = this.hardGate(context);
            if (!gate.ok) {
                this.state.lastDecision = { shouldSpeak: false, reason: gate.reason, at: Date.now() };
                this.persist();
                if (gate.delayMs !== null) {
                    this.schedule(gate.reason, gate.delayMs);
                }
                return;
            }
            this.state.checksToday = Number(this.state.checksToday || 0) + 1;
            this.persist();
            const decision = await this.requestOpportunity?.({ context, reason });
            const normalizedDecision = decision && typeof decision === 'object' ? decision : { shouldSpeak: false };
            this.state.lastDecision = {
                shouldSpeak: normalizedDecision.shouldSpeak === true,
                intent: normalizeText(normalizedDecision.intent),
                reason: normalizeText(normalizedDecision.reason || normalizedDecision.reasonType),
                cooldownSec: Number(normalizedDecision.cooldownSec) || 0,
                at: Date.now()
            };
            this.persist();
            if (normalizedDecision.shouldSpeak === true && normalizedDecision.payload) {
                await this.onSpeak?.(normalizedDecision);
                this.noteAssistantTurn({ proactive: true });
                this.schedule('spoke', this.getNextDelay('spoke', normalizedDecision));
                return;
            }
            this.schedule('not_enough_reason', this.getNextDelay('not_enough_reason', normalizedDecision));
        } catch (error) {
            this.logger?.warn?.('主动陪伴判断失败：', error);
            this.schedule('error', this.getIntervalConfig().minimum);
        } finally {
            this.running = false;
        }
    }
}
