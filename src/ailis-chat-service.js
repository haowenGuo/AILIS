import { normalizeMarkdownSource } from './markdown-renderer.js';
import {
    splitChatAttachments,
    summarizeChatAttachmentsForGateway
} from './chat-attachments.js';
import {
    PROGRESS_MAX_FRAMES,
    createPersonaProgressFrame,
    renderPersonaProgressSurface
} from './ailis-progress-surface.js';
import { extractTtsSpeechTextFromDisplay, normalizeTtsSpeechText } from './tts-speech-text.js';

const CONTROL_TAG_PATTERN = /\[\s*(action|expression)\s*[:=：＝]\s*([^\]]*)\]/gi;
const LEADING_INCOMPLETE_CONTROL_TAG_PATTERN = /^(?:\s*\[\s*(?:action|expression)\s*[:=：＝][^\]]*)+/i;
const LEGACY_EXPRESSION_ALIASES = Object.freeze({
    curious: 'surprised',
    thinking: 'surprised',
    focused: 'relaxed',
    calm: 'relaxed',
    neutral: 'relaxed',
    soft: 'relaxed',
    comforting: 'relaxed',
    comfort: 'relaxed',
    smile: 'happy',
    joy: 'happy',
    cheerful: 'happy',
    blinkright: 'blinkRight',
    shy: 'blinkRight',
    blush: 'blinkRight',
    embarrassed: 'blinkRight'
});
const LEGACY_ALLOWED_EXPRESSIONS = new Set(['happy', 'angry', 'sad', 'surprised', 'relaxed', 'blinkRight']);
const PROACTIVE_LLM_TIMEOUT_MS = 30000;
const PROGRESS_MIN_INTERVAL_MS = 1200;
const EMBODIED_COMMAND_TASK_WORD_PATTERN = /写|代码|脚本|文件|邮件|查|搜索|整理|生成|测试|运行|打开|读取|分析|修复|优化|提交|commit|debug|report|文档/i;

function normalizeText(value) {
    if (typeof value !== 'string') {
        return '';
    }
    return value.replace(/[ \t]+/g, ' ').trim();
}

function normalizeLegacyControlValue(kind = '', value = '') {
    const normalized = normalizeText(value);
    if (String(kind).toLowerCase() !== 'expression') {
        return normalized;
    }
    if (LEGACY_ALLOWED_EXPRESSIONS.has(normalized)) {
        return normalized;
    }
    const alias = LEGACY_EXPRESSION_ALIASES[normalized.toLowerCase()];
    return LEGACY_ALLOWED_EXPRESSIONS.has(alias) ? alias : '';
}

function eventBelongsToRun(payload = {}, runId = '') {
    const activeRunId = normalizeText(runId);
    if (!activeRunId) {
        return false;
    }
    const eventRunId = normalizeText(payload.runId);
    const parentRunId = normalizeText(payload.parentRunId || payload.parent_run_id);
    return eventRunId === activeRunId || parentRunId === activeRunId;
}

function getLatestUserEntry(messageHistory = []) {
    for (let index = messageHistory.length - 1; index >= 0; index -= 1) {
        if (messageHistory[index]?.role === 'user') {
            return messageHistory[index];
        }
    }
    return null;
}

function compactConversationTurns(messageHistory = [], limit = 10) {
    const turns = messageHistory
        .filter((message) => ['user', 'assistant'].includes(message?.role))
        .map((message) => ({
            role: normalizeText(message.role),
            text: normalizeText(message.content || message.text).slice(0, 900),
            source: normalizeText(message.source),
            createdAt: normalizeText(message.createdAt)
        }))
        .filter((message) => message.text);
    if (turns.length <= limit) {
        return turns;
    }

    const selected = new Set();
    for (let index = turns.length - 1; index >= 0 && selected.size < limit; index -= 1) {
        selected.add(index);
    }
    const anchors = [
        turns.findLastIndex((message) => message.role === 'user'),
        turns.findLastIndex((message) =>
            message.role === 'assistant' && message.source !== 'proactive_companion'
        )
    ];
    const anchorSet = new Set(anchors.filter((index) => index >= 0));
    for (const anchorIndex of anchors) {
        if (anchorIndex < 0 || selected.has(anchorIndex)) {
            continue;
        }
        const earliestReplaceable = [...selected]
            .sort((left, right) => left - right)
            .find((index) => !anchorSet.has(index));
        if (earliestReplaceable !== undefined) {
            selected.delete(earliestReplaceable);
        }
        selected.add(anchorIndex);
    }
    return [...selected]
        .sort((left, right) => left - right)
        .map((index) => turns[index]);
}

function extractJsonObjectFromText(value) {
    if (!value || typeof value !== 'string') {
        return null;
    }
    const text = value.trim();
    const candidates = [text];
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start >= 0 && end > start) {
        candidates.push(text.slice(start, end + 1));
    }
    for (const candidate of candidates) {
        try {
            const parsed = JSON.parse(candidate);
            if (parsed && typeof parsed === 'object') {
                return parsed;
            }
        } catch {}
    }
    return null;
}

export function buildProactiveOpportunitySystemPrompt() {
    return [
        '你是 AILIS 工作模式的反馈机会判断器，不是任务执行 Agent。',
        '你只判断此刻是否值得让 AILIS 主动汇报、提醒或恢复共同任务；不要撰写最终用户可见回复，回复会在 AILIS 的同一主会话中生成。',
        '工作模式按较长周期检查，优先关注刚完成、暂停、遇到阻塞或值得恢复的共同任务；普通闲聊场景保持克制。',
        '优先根据 recentContext 判断：刚刚聊了什么、是否有自然延续、是否有未完成情绪或问题、任务是否刚结束。',
        'recentContext 中 source=proactive_companion 的内容是 AILIS 之前的主动消息。若用户没有回应，不要仅因时间经过而重复同类搭话。',
        'interactionState.appVisible 只是当前界面可见性信息，不是必须沉默的规则。',
        '长期记忆和用户画像只用于语气、分寸和称呼，不用于凭空开启新话题。',
        '不要调用工具，不要联网，不要读文件，不要执行任务；如果需要行动，只能温柔询问用户是否要继续。',
        '不要暴露内部记忆、好感度数值、系统状态、JSON、token、runId、工具名或隐藏推理。',
        '如果没有明确价值，shouldSpeak 必须为 false。',
        '只返回 JSON：{"shouldSpeak":boolean,"intent":"soft_checkin|topic_followup|task_resume_offer|celebrate|comfort|quiet_presence","emotion":"relaxed|happy|soft|comforting|curious","cooldownSec":number,"reasonType":"recent_context_followup|task_state|not_enough_reason|cooldown"}'
    ].join('\n');
}

export function buildProactiveCompanionHeartbeatDeveloperMessage(messageHistory = []) {
    const turns = messageHistory.filter((message) => ['user', 'assistant'].includes(message?.role));
    const latestUserIndex = turns.findLastIndex((message) => message.role === 'user');
    const latestAssistantIndex = turns.findLastIndex((message) => message.role === 'assistant');
    const assistantTurnsSinceUser = latestUserIndex < 0
        ? turns.filter((message) => message.role === 'assistant').length
        : turns.slice(latestUserIndex + 1).filter((message) => message.role === 'assistant').length;
    const userSpokeAfterAssistant = latestUserIndex > latestAssistantIndex;
    return [
        'Companion mode heartbeat. This is a runtime event, not a user message.',
        'Use the same AILIS persona, memory, and conversation context as an ordinary chat turn.',
        userSpokeAfterAssistant
            ? 'The latest visible turn is a real user message.'
            : `The user has not sent a new message since the latest assistant response. There are ${assistantTurnsSinceUser} assistant response(s) since the latest real user message.`,
        'Take the initiative and continue the conversation naturally.',
        'Do not pretend the user replied, restart the old request, or merely rephrase the latest assistant response.',
        'Return only the natural user-visible reply.'
    ].join('\n');
}

function buildProactiveWorkReplySystemPrompt(decision = {}) {
    return [
        '你是 AILIS，正在对共同工作的进展进行一次主动反馈。',
        '最近的 user/assistant 消息是真实对话历史；保持其中已经形成的人格、称呼、语气和关系分寸。',
        '这是工作模式机会判断器批准的反馈，不是用户刚刚发送了新消息。',
        `本次反馈意图：${normalizeText(decision.intent || 'task_resume_offer')}；触发原因：${normalizeText(decision.reasonType || 'task_state')}。`,
        '围绕当前任务状态、进展、阻塞或下一步自然表达，不要虚构没有发生的工作。',
        '不要提到机会判断器、工作模式、JSON、记忆注入或任何内部机制。',
        '只输出要展示给用户的自然回复，不要输出 JSON、标签、解释或候选答案。'
    ].join('\n');
}

function normalizeProactiveDecision(rawDecision = {}) {
    const shouldSpeak = rawDecision.shouldSpeak === true;
    const intent = normalizeText(rawDecision.intent || 'quiet_presence') || 'quiet_presence';
    const emotion = normalizeText(rawDecision.emotion || 'relaxed') || 'relaxed';
    const cooldownSec = Math.round(Math.min(Math.max(Number(rawDecision.cooldownSec) || 900, 180), 24 * 60 * 60));
    if (!shouldSpeak) {
        return {
            shouldSpeak: false,
            intent,
            emotion,
            cooldownSec,
            reasonType: normalizeText(rawDecision.reasonType || rawDecision.reason || 'not_enough_reason')
        };
    }
    return {
        shouldSpeak: true,
        intent,
        emotion,
        cooldownSec,
        reasonType: normalizeText(rawDecision.reasonType || 'recent_context_followup')
    };
}

function proactiveEmotionToSurface(decision = {}, text = '') {
    const emotion = normalizeText(decision.emotion || 'relaxed');
    const expression = /happy|celebrate/.test(emotion) ? 'happy' :
        /comfort|soft/.test(emotion) ? 'relaxed' : 'relaxed';
    const taskState = /comfort/.test(emotion) ? 'comforting' : 'idle';
    return {
        text,
        speechText: text,
        bubbleText: text,
        action: null,
        expression,
        emotion,
        intensity: 0.34,
        socialTone: 'soft',
        gestureIntent: /curious/.test(emotion) ? 'thinking' : 'comfort',
        taskState,
        speechEnergy: 0.24,
        gazeTarget: 'user',
        durationHint: 'short',
        source: 'proactive_companion'
    };
}

function createProgressPayload(frames = []) {
    const surface = renderPersonaProgressSurface(frames);
    return toAssistantPayload(surface.text, {
        speechText: surface.speechText,
        bubbleText: surface.bubbleText,
        surface
    });
}

export function createGatewayProgressBridge({ gateway, sessionId, onProgress, onRunStarted, onRunFinished }) {
    if (typeof onProgress !== 'function' || typeof gateway?.onEvent !== 'function') {
        return () => {};
    }
    const state = {
        runId: '',
        frames: [],
        visibleStepCount: 0,
        totalSteps: 0,
        lastText: '',
        lastEmitAt: 0
    };
    const pushFrame = (frame, { force = false } = {}) => {
        if (!frame?.text || state.frames.at(-1)?.text === frame.text) {
            return;
        }
        state.frames.push(frame);
        state.frames = state.frames.slice(-PROGRESS_MAX_FRAMES);
        const nextText = renderPersonaProgressSurface(state.frames).text;
        const now = Date.now();
        if (!force && nextText === state.lastText) {
            return;
        }
        if (!force && now - state.lastEmitAt < PROGRESS_MIN_INTERVAL_MS) {
            return;
        }
        state.lastText = nextText;
        state.lastEmitAt = now;
        onProgress(createProgressPayload(state.frames));
    };

    const unsubscribe = gateway.onEvent((event = {}) => {
        const type = normalizeText(event.type);
        const payload = event.payload && typeof event.payload === 'object' ? event.payload : {};
        if (type === 'agent.run.started') {
            if (normalizeText(payload.sessionId) !== normalizeText(sessionId)) {
                return;
            }
            state.runId = normalizeText(payload.runId);
            onRunStarted?.({
                runId: state.runId,
                sessionId: normalizeText(payload.sessionId),
                payload
            });
            state.totalSteps = Number(payload.stepCount || 0) || 0;
            pushFrame(createPersonaProgressFrame(event), { force: true });
            return;
        }
        const payloadRunId = normalizeText(payload.runId || payload.parentRunId || payload.parent_run_id);
        const isFinalForActiveRunWithoutRunId = type === 'agent.final' && state.runId && !payloadRunId;
        if (!state.runId || (!eventBelongsToRun(payload, state.runId) && !isFinalForActiveRunWithoutRunId)) {
            return;
        }
        if (type === 'agent.run.finished' || type === 'agent.run.interrupted' || type === 'agent.final') {
            const finalText = normalizeMarkdownSource(payload.displayText || payload.text || payload.summary || payload.error || '');
            if (finalText) {
                onProgress(toAssistantPayload(finalText, {
                    speechText: payload.speechText || payload.speech_text || finalText,
                    bubbleText: payload.bubbleText || payload.bubble_text || '',
                    surface: payload.surface || null,
                    agentProgressFinal: true
                }));
            }
            onRunFinished?.({
                runId: state.runId,
                sessionId: normalizeText(payload.sessionId),
                payload
            });
            return;
        }
        if (type === 'agent.message.completed') {
            if (normalizeText(payload.delivery).toLowerCase() === 'background') {
                return;
            }
            const finalText = normalizeMarkdownSource(payload.text || payload.displayText || payload.summary || '');
            if (finalText) {
                onProgress(toAssistantPayload(finalText, {
                    speechText: payload.speechText || payload.speech_text || finalText,
                    bubbleText: payload.bubbleText || payload.bubble_text || '',
                    surface: payload.surface || null,
                    agentProgressFinal: true
                }));
            }
            return;
        }
        if (type === 'agent.step.started') {
            const frame = createPersonaProgressFrame(event, {
                index: state.visibleStepCount + 1,
                total: state.totalSteps
            });
            if (frame) {
                state.visibleStepCount += 1;
                pushFrame(frame);
            }
            return;
        }
        if (type === 'agent.reasoning.delta' || type === 'agent.progress.note' || type === 'agent.message.delta' || type === 'subagent.event') {
            pushFrame(createPersonaProgressFrame(event), { force: type === 'agent.reasoning.delta' || type === 'agent.progress.note' });
            return;
        }
        if (type === 'agent.step.finished') {
            pushFrame(createPersonaProgressFrame(event));
        }
    });

    return typeof unsubscribe === 'function' ? unsubscribe : () => {};
}

function sanitizeMessageHistoryForGateway(messageHistory = []) {
    return messageHistory.map((message) => {
        if (!Array.isArray(message?.attachments) || !message.attachments.length) {
            return message;
        }

        return {
            ...message,
            attachments: summarizeChatAttachmentsForGateway(message.attachments)
        };
    });
}

function normalizeEmbodiedCommandText(value) {
    return normalizeText(value)
        .replace(/[，。！？!?,.;；：:\s~～…]+/g, '')
        .toLowerCase();
}

function isLikelyStandaloneEmbodiedCommand(message) {
    const normalized = normalizeEmbodiedCommandText(message);
    return normalized.length > 0 &&
        normalized.length <= 28 &&
        !EMBODIED_COMMAND_TASK_WORD_PATTERN.test(message);
}

export function createEmbodiedCommandPayload(message = '') {
    if (!isLikelyStandaloneEmbodiedCommand(message)) {
        return null;
    }

    const normalized = normalizeEmbodiedCommandText(message);
    if (!/(跳舞|跳个舞|跳一段|舞蹈|dance|dancing)/i.test(normalized)) {
        return null;
    }

    const text = '好呀，我给你跳一段。';
    return toAssistantPayload(text, {
        action: 'dance',
        expression: 'happy',
        speechText: text,
        bubbleText: '跳舞模式，启动。',
        surface: {
            text,
            speechText: text,
            bubbleText: '跳舞模式，启动。',
            action: 'dance',
            expression: 'happy',
            emotion: 'happy',
            intensity: 0.78,
            socialTone: 'playful',
            gestureIntent: 'dance',
            taskState: 'happy_success',
            speechEnergy: 0.72,
            gazeTarget: 'user',
            durationHint: 'long',
            source: 'assistant_embodied_command'
        },
        embodiedCommand: {
            type: 'dance',
            source: 'assistant_mode_short_command'
        }
    });
}

async function attachServerTtsIfRequested(payload, replyMode) {
    if (replyMode !== 'server_tts') {
        return payload;
    }

    try {
        const ttsPayload = await synthesizeElevenLabsSpeech(payload.speech_text);
        if (!ttsPayload?.audio_base64) {
            return payload;
        }

        return {
            ...payload,
            ...ttsPayload,
            fallbackMode: false,
            streamMode: false,
            demoMode: false
        };
    } catch (error) {
        console.warn('ElevenLabs 桌面语音合成失败，保留 Agent 文本结果：', error);
        return {
            ...payload,
            ttsError: error?.message || String(error),
            fallbackMode: true
        };
    }
}

function toAILISPayload(result) {
    if (result?.deferAssistantCommit === true) {
        return {
            raw_text: '',
            display_text: '',
            display_format: 'markdown',
            contentFormat: 'markdown',
            speech_text: '',
            bubble_text: '',
            action: null,
            expression: null,
            surface: null,
            fallbackMode: false,
            streamMode: false,
            demoMode: false,
            deferAssistantCommit: true,
            messagePhase: normalizeText(result.messagePhase, 'commentary'),
            backgroundTask: result.backgroundTask || null,
            ailis: result
        };
    }
    const cue = getAvatarCue(result);
    const surface = result?.surface && typeof result.surface === 'object' ? result.surface : null;
    const surfaceText = normalizeMarkdownSource(surface?.text || '');
    const fallbackText = normalizeMarkdownSource(result?.displayText || result?.finalAnswer || result?.error || '');
    if (!surfaceText && !fallbackText) {
        return {
            raw_text: '',
            display_text: '',
            display_format: 'markdown',
            contentFormat: 'markdown',
            speech_text: '',
            bubble_text: '',
            action: null,
            expression: null,
            surface: null,
            fallbackMode: false,
            streamMode: false,
            demoMode: false,
            deferAssistantCommit: true,
            messagePhase: 'final_answer',
            ailis: result
        };
    }
    return toAssistantPayload(surfaceText || fallbackText, {
        ...cue,
        action: surface ? surface.action : cue.action,
        expression: surface ? surface.expression : cue.expression,
        speechText: surface?.speechText || result?.speechText || surfaceText || '',
        bubbleText: surface?.bubbleText || result?.bubbleText || '',
        surface,
        ailis: result
    });
}

function parseAssistantReply(rawText) {
    let action = null;
    let expression = null;
    const raw = typeof rawText === 'string' ? rawText : '';
    const stripped = raw.replace(CONTROL_TAG_PATTERN, (_, kind, value) => {
        const normalizedKind = String(kind || '').toLowerCase();
        const normalizedValue = normalizeLegacyControlValue(normalizedKind, value);
        if (normalizedKind === 'action' && !action && normalizedValue) {
            action = normalizedValue;
        }
        if (normalizedKind === 'expression' && !expression && normalizedValue) {
            expression = normalizedValue;
        }
        return '';
    });
    const visibleText = stripped.replace(LEADING_INCOMPLETE_CONTROL_TAG_PATTERN, '');
    const displayText = normalizeMarkdownSource(visibleText, '任务执行完成。');
    return {
        rawText: raw,
        displayText,
        speechText: extractTtsSpeechTextFromDisplay(displayText),
        action,
        expression
    };
}

function toAssistantPayload(text, extra = {}) {
    const parsed = parseAssistantReply(normalizeMarkdownSource(text, '任务执行完成。'));
    return {
        ...extra,
        raw_text: parsed.rawText,
        display_text: parsed.displayText,
        display_format: 'markdown',
        contentFormat: 'markdown',
        speech_text: normalizeTtsSpeechText(extra.speechText || extra.speech_text) || parsed.speechText,
        bubble_text: normalizeText(extra.bubbleText || extra.bubble_text) || parsed.displayText,
        action: parsed.action || extra.action || null,
        expression: parsed.expression || extra.expression || null,
        surface: extra.surface || null,
        fallbackMode: true,
        streamMode: extra.streamMode === true,
        demoMode: false
    };
}

async function synthesizeElevenLabsSpeech(speechText) {
    const cleanText = normalizeTtsSpeechText(speechText);
    if (!cleanText) {
        return null;
    }
    if (!window.ailisDesktop?.tts?.synthesize) {
        throw new Error('当前桌面宿主不支持 ElevenLabs 本地语音合成');
    }

    const payload = await window.ailisDesktop.tts.synthesize({
        text: cleanText
    });
    if (!payload?.ok) {
        throw new Error(payload?.error || 'ElevenLabs 本地语音合成失败');
    }
    return payload;
}

function getAvatarCue(result = {}) {
    if (result.mode === 'conversation') {
        return {
            action: null,
            expression: result.intent === 'emotional_chat' ? 'relaxed' : 'happy'
        };
    }

    if (result.status === 'needs_approval') {
        return {
            action: 'thinking',
            expression: 'surprised'
        };
    }

    if (result.ok) {
        return {
            action: 'wave',
            expression: 'happy'
        };
    }

    return {
        action: 'thinking',
        expression: 'surprised'
    };
}

export class AILISDesktopChatService {
    constructor({ gateway = window.ailisDesktop?.gateway || null, runtimeKind = 'desktop' } = {}) {
        this.gateway = gateway;
        this.runtimeKind = runtimeKind === 'hosted' ? 'hosted' : 'desktop';
        this.supportsAutoChat = true;
        this.prefersThinkingState = true;
        this.activeRunId = '';
        this.activeSessionId = '';
        this.backgroundMessageListeners = new Set();
        this.systemNoticeListeners = new Set();
        this.backgroundRunSessions = new Map();
        this.pendingBackgroundMessages = new Map();
        this.completedBackgroundRuns = new Set();
        this.backgroundGatewayUnsubscribe = typeof this.gateway?.onEvent === 'function'
            ? this.gateway.onEvent((event) => this.handleBackgroundGatewayEvent(event))
            : null;
    }

    handleBackgroundGatewayEvent(event = {}) {
        const type = normalizeText(event.type);
        const eventPayload = event.payload && typeof event.payload === 'object' ? event.payload : {};
        const runId = normalizeText(eventPayload.runId || eventPayload.parentRunId);
        if (type === 'agent.system.notice') {
            const notice = {
                message: normalizeText(eventPayload.message || eventPayload.text),
                level: normalizeText(eventPayload.level, 'warning'),
                code: normalizeText(eventPayload.code),
                source: normalizeText(eventPayload.source, 'task_agent_runtime')
            };
            if (notice.message) {
                for (const listener of [...this.systemNoticeListeners]) {
                    try {
                        listener(notice);
                    } catch {}
                }
            }
            return;
        }
        if (!runId) {
            return;
        }
        if (type === 'task.background.finished') {
            this.completedBackgroundRuns.add(runId);
            this.backgroundRunSessions.delete(runId);
            if (this.completedBackgroundRuns.size > 160) {
                this.completedBackgroundRuns.delete(this.completedBackgroundRuns.values().next().value);
            }
            return;
        }
        if (type !== 'persona.background.message') {
            return;
        }
        const backgroundTaskKind = normalizeText(eventPayload.kind, 'progress');
        const commonMessageFields = {
            backgroundTaskMessage: true,
            backgroundTaskKind,
            backgroundRunId: runId,
            backgroundEventId: normalizeText(event.id || eventPayload.eventId),
            backgroundStatus: normalizeText(eventPayload.status),
            backgroundStreamId: normalizeText(eventPayload.streamId),
            backgroundStreamState: normalizeText(eventPayload.streamState),
            source: normalizeText(eventPayload.source, 'task_result_persona_actor'),
            taskResult: eventPayload.taskResult || null
        };
        let message;
        if (backgroundTaskKind === 'stream') {
            const streamText = normalizeMarkdownSource(eventPayload.text || eventPayload.displayText || '');
            const streamDeltaText = typeof eventPayload.deltaText === 'string'
                ? eventPayload.deltaText
                : '';
            message = streamText
                ? toAssistantPayload(streamText, {
                      ...commonMessageFields,
                      speechText: '',
                      bubbleText: streamText,
                      streamMode: true,
                      stream_delta_text: streamDeltaText,
                      stream_delta_speech_text: '',
                      answerStream: true
                  })
                : {
                      ...commonMessageFields,
                      raw_text: '',
                      display_text: '',
                      display_format: 'markdown',
                      contentFormat: 'markdown',
                      speech_text: '',
                      bubble_text: '',
                      action: null,
                      expression: null,
                      surface: null,
                      fallbackMode: false,
                      streamMode: true,
                      streamReset: commonMessageFields.backgroundStreamState === 'discarded',
                      stream_delta_text: streamDeltaText,
                      stream_delta_speech_text: '',
                      answerStream: true,
                      demoMode: false
                  };
        } else {
            message = toAssistantPayload(
                normalizeMarkdownSource(eventPayload.text || eventPayload.displayText || ''),
                {
                    ...commonMessageFields,
                    speechText: eventPayload.speechText || eventPayload.speech_text || '',
                    bubbleText: eventPayload.bubbleText || eventPayload.bubble_text || '',
                    surface: eventPayload.surface || null
                }
            );
        }
        const expectedSessionId = this.backgroundRunSessions.get(runId);
        if (!expectedSessionId) {
            const pending = this.pendingBackgroundMessages.get(runId) || [];
            pending.push({ message, sessionId: normalizeText(eventPayload.sessionId) });
            this.pendingBackgroundMessages.set(runId, pending.slice(-6));
            if (this.pendingBackgroundMessages.size > 160) {
                this.pendingBackgroundMessages.delete(this.pendingBackgroundMessages.keys().next().value);
            }
            return;
        }
        if (normalizeText(eventPayload.sessionId) !== normalizeText(expectedSessionId)) {
            return;
        }
        this.emitBackgroundAssistantMessage(message);
        if (message.backgroundTaskKind === 'result') {
            this.backgroundRunSessions.delete(runId);
        }
    }

    emitBackgroundAssistantMessage(message) {
        for (const listener of [...this.backgroundMessageListeners]) {
            try {
                listener(message);
            } catch {}
        }
    }

    registerBackgroundTask(backgroundTask = {}, sessionId = '') {
        const runId = normalizeText(backgroundTask.runId);
        if (!runId) {
            return;
        }
        const normalizedSessionId = normalizeText(backgroundTask.sessionId || sessionId);
        if (!this.completedBackgroundRuns.has(runId)) {
            this.backgroundRunSessions.set(runId, normalizedSessionId);
        }
        const pending = this.pendingBackgroundMessages.get(runId) || [];
        this.pendingBackgroundMessages.delete(runId);
        for (const item of pending) {
            if (!item.sessionId || item.sessionId === normalizedSessionId) {
                this.emitBackgroundAssistantMessage(item.message);
            }
            if (item.message?.backgroundTaskKind === 'result') {
                this.backgroundRunSessions.delete(runId);
            }
        }
    }

    onBackgroundAssistantMessage(listener) {
        if (typeof listener !== 'function') {
            return () => {};
        }
        this.backgroundMessageListeners.add(listener);
        return () => this.backgroundMessageListeners.delete(listener);
    }

    onSystemNotice(listener) {
        if (typeof listener !== 'function') {
            return () => {};
        }
        this.systemNoticeListeners.add(listener);
        return () => this.systemNoticeListeners.delete(listener);
    }

    getWelcomeMessage() {
        return 'AILIS到啦！今天想和我聊点什么，或者直接把任务交给我都可以。';
    }

    async ensureReady() {
        if (!this.gateway?.isSupported || !this.gateway?.runAgent) {
            throw new Error('当前桌面宿主不支持 AILIS Agent Runner');
        }

        const status = await this.gateway.getStatus();
        if (!status?.running) {
            if (status?.startError) {
                throw new Error(`AILIS Gateway 启动失败：${status.startError}`);
            }
            throw new Error('AILIS Gateway 尚未启动');
        }
        return status;
    }

    async fetchAssistantTurn({
        sessionId,
        messageHistory,
        isAutoChat = false,
        replyMode = 'stream_text',
        onProgress,
        proactiveContext = null
    }) {
        if (isAutoChat) {
            const proactiveMode = normalizeText(proactiveContext?.proactivity?.mode).toLowerCase();
            const opportunity = proactiveMode === 'companion'
                ? await this.createProactiveCompanionTurn({
                    sessionId,
                    messageHistory,
                    context: proactiveContext || {}
                })
                : await this.evaluateProactiveOpportunity({
                sessionId,
                messageHistory,
                context: proactiveContext || {}
            });
            if (!opportunity.shouldSpeak || !opportunity.payload) {
                throw new Error('proactive_companion_no_opportunity');
            }
            return attachServerTtsIfRequested(opportunity.payload, replyMode);
        }

        const latestUserEntry = getLatestUserEntry(messageHistory);
        const message = normalizeText(latestUserEntry?.content);
        if (!message) {
            throw new Error('消息不能为空');
        }

        const embodiedPayload = createEmbodiedCommandPayload(message);
        if (embodiedPayload) {
            return attachServerTtsIfRequested(embodiedPayload, replyMode);
        }

        const splitAttachments = splitChatAttachments(latestUserEntry?.attachments);
        const visionAttachments = splitAttachments.vision;

        const status = await this.ensureReady();
        let streamedAnswerText = '';
        let activeAnswerStreamId = '';
        let answerStreamVisible = false;
        let answerStreamCommitted = false;
        let bridgedRunId = '';
        let bridgedSessionId = '';
        const unsubscribeProgress = createGatewayProgressBridge({
            gateway: this.gateway,
            sessionId,
            onProgress: (payload) => {
                if (!answerStreamVisible) {
                    onProgress?.(payload);
                }
            },
            onRunStarted: ({ runId, sessionId: startedSessionId }) => {
                bridgedRunId = runId;
                bridgedSessionId = startedSessionId || sessionId;
                this.activeRunId = runId;
                this.activeSessionId = bridgedSessionId;
            },
            onRunFinished: ({ runId }) => {
                if (this.activeRunId === runId) {
                    this.activeRunId = '';
                    this.activeSessionId = '';
                }
            }
        });
        let result;
        try {
            result = await this.gateway.runAgent(
                {
                    sessionId,
                    message,
                    messageHistory: sanitizeMessageHistoryForGateway(messageHistory),
                    attachments: summarizeChatAttachmentsForGateway(latestUserEntry?.attachments),
                    modelImageAttachments: visionAttachments.map((attachment) => ({
                        image_url: attachment.dataUrl, detail: 'original'
                    })),
                    agentLoop: 'llm',
                    directToolExecutor: true,
                    context: {
                        workspace: status.workspaceRoot,
                        runtimeKind: this.runtimeKind,
                        agentLoop: 'llm',
                        directToolExecutor: true,
                        agentRole: 'unified_agent',
                        unifiedAgent: true,
                        taskAgentRoutingOwned: false
                    }
                },
                {
                    onTextDelta: (delta, streamPayload = {}) => {
                        if (typeof delta !== 'string' || !delta) {
                            return;
                        }
                        const streamId = normalizeText(
                            streamPayload.metadata?.streamId || streamPayload.streamId
                        ) || 'hosted-answer-stream';
                        if (activeAnswerStreamId !== streamId) {
                            activeAnswerStreamId = streamId;
                            streamedAnswerText = '';
                            answerStreamCommitted = false;
                        }
                        answerStreamVisible = true;
                        streamedAnswerText += delta;
                        onProgress?.(toAssistantPayload(streamedAnswerText, {
                            speechText: streamedAnswerText,
                            bubbleText: streamedAnswerText,
                            streamMode: true,
                            stream_delta_text: delta,
                            stream_delta_speech_text: '',
                            answerStream: true
                        }));
                    },
                    onTextStreamEvent: (eventType, streamPayload = {}) => {
                        const streamId = normalizeText(streamPayload.streamId) ||
                            activeAnswerStreamId ||
                            'hosted-answer-stream';
                        if (eventType === 'response.output_text.started') {
                            if (activeAnswerStreamId !== streamId) {
                                activeAnswerStreamId = streamId;
                                streamedAnswerText = '';
                                answerStreamVisible = false;
                                answerStreamCommitted = false;
                            }
                            return;
                        }
                        if (streamId !== activeAnswerStreamId) {
                            return;
                        }
                        if (eventType === 'response.output_text.committed') {
                            answerStreamCommitted = Boolean(streamedAnswerText);
                            answerStreamVisible = answerStreamCommitted;
                            return;
                        }
                        if (eventType === 'response.output_text.discarded') {
                            const hadVisibleText = answerStreamVisible && Boolean(streamedAnswerText);
                            streamedAnswerText = '';
                            answerStreamVisible = false;
                            answerStreamCommitted = false;
                            if (hadVisibleText) {
                                onProgress?.({
                                    raw_text: '',
                                    display_text: '',
                                    display_format: 'markdown',
                                    contentFormat: 'markdown',
                                    speech_text: '',
                                    bubble_text: '',
                                    streamMode: true,
                                    streamReset: true,
                                    fallbackMode: true,
                                    demoMode: false
                                });
                            }
                        }
                    }
                }
            );
            this.registerBackgroundTask(result?.backgroundTask, sessionId);
        } finally {
            unsubscribeProgress();
            if (bridgedRunId && this.activeRunId === bridgedRunId) {
                this.activeRunId = '';
                this.activeSessionId = '';
            } else if (!this.activeRunId && bridgedSessionId && this.activeSessionId === bridgedSessionId) {
                this.activeSessionId = '';
            }
        }

        const payload = {
            ...toAILISPayload(result),
            streamMode: answerStreamCommitted
        };

        return attachServerTtsIfRequested(payload, replyMode);
    }

    async createProactiveCompanionTurn({
        sessionId = 'main',
        messageHistory = [],
        context = {}
    } = {}) {
        if (!this.gateway?.isSupported || !this.gateway?.runAgent) {
            return {
                shouldSpeak: false,
                reasonType: 'gateway_unavailable'
            };
        }
        const turn = {
            shouldSpeak: true,
            cooldownSec: 20,
            reasonType: 'companion_cycle'
        };
        const reply = await this.generateProactiveCompanionReply({
            sessionId,
            messageHistory,
            context,
            mode: 'companion'
        });
        if (!reply.ok) {
            return {
                ...turn,
                shouldSpeak: false,
                reasonType: reply.reasonType,
                error: reply.error || ''
            };
        }
        return {
            ...turn,
            context,
            payload: toAssistantPayload(reply.text, {
                speechText: reply.text,
                bubbleText: reply.text,
                proactiveCompanion: {
                    mode: 'companion',
                    reasonType: turn.reasonType,
                    replyModel: reply.model || ''
                }
            })
        };
    }

    async evaluateProactiveOpportunity({
        sessionId = 'main',
        messageHistory = [],
        context = {}
    } = {}) {
        if (typeof window.ailisDesktop?.llm?.chat !== 'function') {
            return {
                shouldSpeak: false,
                reasonType: 'llm_unavailable'
            };
        }
        const recentTurns = compactConversationTurns(messageHistory, 10);
        const latestUser = [...recentTurns].reverse().find((message) => message.role === 'user');
        const decisionContext = {
            ...context,
            recentContext: {
                ...(context.recentContext || {}),
                lastVisibleTurns: recentTurns,
                latestUserText: latestUser?.text || context.recentContext?.latestUserText || ''
            }
        };
        const result = await window.ailisDesktop.llm.chat({
            includeAilisMemory: true,
            recordMemory: false,
            memorySource: 'proactive_companion_opportunity',
            memoryUserMessage: latestUser?.text || '主动陪伴机会判断',
            messageHistory,
            sessionId,
            messages: [
                {
                    role: 'system',
                    content: buildProactiveOpportunitySystemPrompt()
                },
                {
                    role: 'user',
                    content: JSON.stringify(decisionContext, null, 2)
                }
            ],
            jsonMode: true,
            expectJson: true,
            outputFormat: 'json',
            temperature: 0.45,
            maxTokens: 520,
            timeoutMs: PROACTIVE_LLM_TIMEOUT_MS
        });
        if (!result?.ok) {
            return {
                shouldSpeak: false,
                reasonType: result?.code || 'llm_failed',
                error: result?.error || ''
            };
        }
        const parsed = extractJsonObjectFromText(result.content);
        const decision = normalizeProactiveDecision(parsed || {});
        if (!decision.shouldSpeak) {
            return decision;
        }
        const reply = await this.generateProactiveCompanionReply({
            sessionId,
            messageHistory,
            context: decisionContext,
            decision,
            mode: 'cowork'
        });
        if (!reply.ok) {
            return {
                ...decision,
                shouldSpeak: false,
                reasonType: reply.reasonType,
                error: reply.error || ''
            };
        }
        const surface = proactiveEmotionToSurface(decision, reply.text);
        return {
            ...decision,
            context: decisionContext,
            payload: toAssistantPayload(reply.text, {
                expression: surface.expression,
                action: surface.action,
                speechText: reply.text,
                bubbleText: reply.text,
                surface,
                proactiveCompanion: {
                    intent: decision.intent,
                    reasonType: decision.reasonType,
                    decisionModel: result.model || '',
                    replyModel: reply.model || ''
                }
            })
        };
    }

    async generateProactiveCompanionReply({
        sessionId = 'main',
        messageHistory = [],
        context = {},
        mode = 'companion',
        decision = {}
    } = {}) {
        const latestUser = [...messageHistory].reverse().find((entry) => entry?.role === 'user');
        const turnContext = mode === 'cowork'
            ? buildProactiveWorkReplySystemPrompt(decision)
            : buildProactiveCompanionHeartbeatDeveloperMessage(messageHistory);
        try {
            const status = await this.ensureReady();
            const result = await this.gateway.runAgent({
                sessionId,
                message: normalizeText(latestUser?.content || latestUser?.text) || '日常陪伴',
                messageHistory: sanitizeMessageHistoryForGateway(messageHistory),
                agentLoop: 'llm',
                directToolExecutor: true,
                suppressCurrentUserMessage: true,
                ephemeralDeveloperMessage: turnContext,
                context: {
                    workspace: status.workspaceRoot,
                    agentLoop: 'llm',
                    directToolExecutor: true,
                    agentRole: 'unified_agent',
                    unifiedAgent: true,
                    suppressCurrentUserMessage: true,
                    ephemeralDeveloperMessage: turnContext
                }
            });
            const text = normalizeMarkdownSource(toAILISPayload(result).display_text || '');
            if (!text) return { ok: false, reasonType: 'empty_reply' };
            return { ok: result.ok !== false, text, model: result.model || result.llm?.model || '' };
        } catch (error) {
            return { ok: false, reasonType: error?.code || 'reply_generation_failed', error: error?.message || String(error) };
        }
    }

    async abortCurrentTurn({ sessionId = '', reason = 'chat_user_interrupt' } = {}) {
        if (!this.gateway?.interruptAgentRun) {
            return {
                ok: false,
                status: 'unsupported',
                error: '当前桌面宿主不支持 AILIS 对话中断。'
            };
        }
        const targetSessionId = normalizeText(sessionId || this.activeSessionId);
        const result = await this.gateway.interruptAgentRun({
            runId: this.activeRunId,
            sessionId: targetSessionId,
            reason,
            source: 'chat-panel'
        });
        if (result?.ok) {
            this.activeRunId = result.runId || this.activeRunId;
            this.activeSessionId = result.sessionId || targetSessionId;
        }
        return result;
    }
}
