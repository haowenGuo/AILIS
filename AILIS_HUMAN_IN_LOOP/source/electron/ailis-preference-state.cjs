const fs = require('fs');
const path = require('path');
const { randomUUID } = require('crypto');

const PREFERENCE_STATE_VERSION = 1;
const MAX_EVENTS = 4000;
const VALID_OPERATIONS = new Set(['set', 'avoid', 'clear', 'observe']);
const VALID_SCOPES = new Set(['turn', 'session', 'day', 'until_changed', 'persistent']);
const SCOPE_PRIORITY = Object.freeze({
    turn: 5,
    session: 4,
    day: 3,
    until_changed: 2,
    persistent: 1,
    implicit: 0
});

function normalizeString(value, fallback = '') {
    const text = typeof value === 'string' ? value.trim() : '';
    return text || fallback;
}

function clamp(value, min = 0, max = 1, fallback = 0) {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? Math.min(max, Math.max(min, numeric)) : fallback;
}

function dayKey(value = new Date()) {
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) {
        return '';
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function sanitizePreferenceValue(value) {
    return normalizeString(value)
        .replace(/(?:\[\s*|【\s*)(?:action|expression|emotion|gestureIntent|socialTone|taskState|speechEnergy|gazeTarget|durationHint)\s*[:=：＝][^\]】\r\n]*(?:\]|】)/gi, '')
        .replace(/(?:\|{2}|｜{2})\s*DSML\s*(?:\|{2}|｜{2})/gi, '')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 240);
}

function defaultState() {
    return {
        version: PREFERENCE_STATE_VERSION,
        updatedAt: new Date().toISOString(),
        events: []
    };
}

function readJson(filePath, fallback) {
    try {
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch {
        return fallback;
    }
}

function atomicWriteJson(filePath, value) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    const temporaryPath = `${filePath}.${process.pid}.${Date.now()}.tmp`;
    fs.writeFileSync(temporaryPath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
    fs.renameSync(temporaryPath, filePath);
}

function normalizeEvent(raw = {}, defaults = {}) {
    const slot = normalizeString(raw.slot).toLowerCase();
    const operation = normalizeString(raw.operation, 'observe').toLowerCase();
    const scope = normalizeString(raw.scope, 'session').toLowerCase();
    const value = sanitizePreferenceValue(raw.value);
    if (!/^[a-z][a-z0-9_.-]{2,79}$/.test(slot)) {
        return null;
    }
    if (!VALID_OPERATIONS.has(operation) || !VALID_SCOPES.has(scope)) {
        return null;
    }
    if (!value && !['clear'].includes(operation)) {
        return null;
    }
    const observedAt = normalizeString(raw.observedAt || raw.observed_at, defaults.observedAt || new Date().toISOString());
    const evidenceQuote = normalizeString(raw.evidence?.quote || raw.evidenceQuote || raw.evidence_quote);
    const evidenceMessage = normalizeString(defaults.userMessage);
    if (evidenceQuote && evidenceMessage && !evidenceMessage.includes(evidenceQuote)) {
        return null;
    }
    return {
        id: normalizeString(raw.id || raw.eventId || raw.event_id, `pref_${randomUUID()}`),
        slot,
        operation,
        value,
        scope,
        explicitness: normalizeString(raw.explicitness, operation === 'observe' ? 'implicit' : 'explicit').toLowerCase() === 'explicit'
            ? 'explicit'
            : 'implicit',
        confidence: clamp(raw.confidence, 0, 1, operation === 'observe' ? 0.5 : 0.9),
        observedAt,
        expiresAt: normalizeString(raw.expiresAt || raw.expires_at),
        turnId: normalizeString(raw.turnId || raw.turn_id, defaults.turnId),
        sessionId: normalizeString(raw.sessionId || raw.session_id, defaults.sessionId),
        day: normalizeString(raw.day, dayKey(observedAt)),
        evidence: {
            messageId: normalizeString(raw.evidence?.messageId || raw.evidence?.message_id, defaults.messageId),
            quote: evidenceQuote
        }
    };
}

function eventApplies(event, context) {
    const now = context.now instanceof Date ? context.now : new Date(context.now || Date.now());
    if (event.expiresAt && new Date(event.expiresAt).getTime() <= now.getTime()) {
        return false;
    }
    if (event.scope === 'turn') {
        return Boolean(context.turnId && event.turnId === context.turnId);
    }
    if (event.scope === 'session') {
        return Boolean(context.sessionId && event.sessionId === context.sessionId);
    }
    if (event.scope === 'day') {
        return event.day === dayKey(now);
    }
    return true;
}

function compareEvents(left, right) {
    const scopeDelta = (SCOPE_PRIORITY[right.scope] || 0) - (SCOPE_PRIORITY[left.scope] || 0);
    if (scopeDelta) {
        return scopeDelta;
    }
    const explicitDelta = Number(right.explicitness === 'explicit') - Number(left.explicitness === 'explicit');
    if (explicitDelta) {
        return explicitDelta;
    }
    return String(right.observedAt).localeCompare(String(left.observedAt));
}

function resolveImplicitObservation(events = [], context = {}) {
    const now = context.now instanceof Date ? context.now : new Date(context.now || Date.now());
    const grouped = new Map();
    for (const event of events.filter((entry) => {
        if (entry.operation !== 'observe') {
            return false;
        }
        return !entry.expiresAt || new Date(entry.expiresAt).getTime() > now.getTime();
    })) {
        const key = `${event.slot}\u0000${event.value}`;
        const record = grouped.get(key) || { slot: event.slot, value: event.value, events: [] };
        record.events.push(event);
        grouped.set(key, record);
    }
    const candidates = [];
    for (const group of grouped.values()) {
        const sessions = new Set(group.events.map((event) => event.sessionId).filter(Boolean));
        const days = new Set(group.events.map((event) => event.day).filter(Boolean));
        if (group.events.length < 4 || sessions.size < 3 || days.size < 3) {
            continue;
        }
        const confidence = Math.min(0.9, 1 - group.events.reduce((product, event) => product * (1 - event.confidence), 1));
        const latest = [...group.events].sort((left, right) => String(right.observedAt).localeCompare(String(left.observedAt)))[0];
        candidates.push({
            ...latest,
            operation: 'set',
            scope: 'implicit',
            explicitness: 'implicit',
            confidence
        });
    }
    return candidates;
}

function resolveSlot(events = [], context = {}) {
    const applicable = events.filter((event) => eventApplies(event, context));
    if (!events.length) {
        return null;
    }
    const latestClear = applicable
        .filter((event) => event.operation === 'clear')
        .sort((left, right) => String(right.observedAt).localeCompare(String(left.observedAt)))[0];
    const clearAt = latestClear?.observedAt || '';
    const avoids = applicable.filter((event) => event.operation === 'avoid');
    const explicitCandidates = applicable.filter((event) => {
        if (event.operation !== 'set') {
            return false;
        }
        if (clearAt && String(event.observedAt) <= clearAt) {
            return false;
        }
        return !avoids.some((avoid) => avoid.value === event.value && String(avoid.observedAt) >= String(event.observedAt));
    });
    const implicitSourceEvents = events.filter((event) => !clearAt || String(event.observedAt) > clearAt);
    const candidates = explicitCandidates.length
        ? explicitCandidates
        : resolveImplicitObservation(implicitSourceEvents, context).filter((candidate) =>
            !avoids.some((avoid) => avoid.value === candidate.value)
        );
    return [...candidates].sort(compareEvents)[0] || null;
}

class AILISPreferenceState {
    constructor(options = {}) {
        this.rootDir = path.resolve(options.rootDir || path.join(process.cwd(), '.ailis-state', 'memory'));
        this.statePath = path.resolve(options.statePath || path.join(this.rootDir, 'interaction-preferences.json'));
        const loaded = readJson(this.statePath, defaultState());
        this.state = {
            ...defaultState(),
            ...(loaded && typeof loaded === 'object' ? loaded : {}),
            version: PREFERENCE_STATE_VERSION,
            events: Array.isArray(loaded?.events)
                ? loaded.events.map((event) => normalizeEvent(event)).filter(Boolean).slice(-MAX_EVENTS)
                : []
        };
    }

    append(rawEvent, defaults = {}) {
        const event = normalizeEvent(rawEvent, defaults);
        if (!event) {
            return { ok: false, status: 'invalid_preference_event' };
        }
        if (this.state.events.some((entry) => entry.id === event.id)) {
            return { ok: true, status: 'duplicate', event };
        }
        this.state.events.push(event);
        this.state.events = this.state.events.slice(-MAX_EVENTS);
        this.state.updatedAt = new Date().toISOString();
        atomicWriteJson(this.statePath, this.state);
        return { ok: true, status: 'recorded', event };
    }

    appendMany(events = [], defaults = {}) {
        const results = [];
        let changed = false;
        for (const rawEvent of Array.isArray(events) ? events : []) {
            const event = normalizeEvent(rawEvent, defaults);
            if (!event) {
                results.push({ ok: false, status: 'invalid_preference_event' });
                continue;
            }
            if (this.state.events.some((entry) => entry.id === event.id)) {
                results.push({ ok: true, status: 'duplicate', event });
                continue;
            }
            this.state.events.push(event);
            results.push({ ok: true, status: 'recorded', event });
            changed = true;
        }
        if (changed) {
            this.state.events = this.state.events.slice(-MAX_EVENTS);
            this.state.updatedAt = new Date().toISOString();
            atomicWriteJson(this.statePath, this.state);
        }
        return {
            ok: results.every((result) => result.ok),
            recorded: results.filter((result) => result.status === 'recorded').length,
            results
        };
    }

    resolve(context = {}) {
        const bySlot = new Map();
        for (const event of this.state.events) {
            const entries = bySlot.get(event.slot) || [];
            entries.push(event);
            bySlot.set(event.slot, entries);
        }
        const active = {};
        for (const [slot, events] of bySlot.entries()) {
            const winner = resolveSlot(events, context);
            if (!winner) {
                continue;
            }
            active[slot] = {
                value: winner.value,
                scope: winner.scope,
                confidence: winner.confidence,
                eventId: winner.id
            };
        }
        return {
            version: PREFERENCE_STATE_VERSION,
            generatedAt: new Date().toISOString(),
            sessionId: normalizeString(context.sessionId),
            turnId: normalizeString(context.turnId),
            active
        };
    }

    buildPromptContext(context = {}) {
        const snapshot = this.resolve(context);
        const entries = Object.entries(snapshot.active);
        if (!entries.length) {
            return '';
        }
        return [
            '【当前有效交互偏好】',
            '以下内容由宿主根据用户偏好事件及时效规则解析；只应用当前有效值，不从名称推断未提供的互称关系。',
            ...entries.map(([slot, item]) => `- ${slot}: ${item.value}（scope=${item.scope}）`)
        ].join('\n');
    }

    getStatus() {
        return {
            ok: true,
            version: PREFERENCE_STATE_VERSION,
            statePath: this.statePath,
            eventCount: this.state.events.length,
            updatedAt: this.state.updatedAt
        };
    }
}

module.exports = {
    AILISPreferenceState,
    normalizePreferenceEvent: normalizeEvent,
    resolvePreferenceSlot: resolveSlot,
    sanitizePreferenceValue
};
