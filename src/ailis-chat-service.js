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
const VISION_LLM_TIMEOUT_MS = 90000;
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
        '你只判断此刻是否值得让 AILIS 主动汇报、提醒或恢复共同任务；不要撰写最终用户可见回复，回复会由独立的 AILIS Persona 生成。',
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

function normalizeVisionAttachments(attachments = []) {
    if (!Array.isArray(attachments)) {
        return [];
    }

    return attachments
        .filter((attachment) => {
            if (!attachment?.dataUrl) {
                return false;
            }
            const mimeType = String(attachment.mimeType || 'image/png');
            return mimeType.startsWith('image/');
        })
        .map((attachment) => ({
            type: 'vision',
            id: String(attachment.id || ''),
            source: String(attachment.source || ''),
            label: String(attachment.label || '截图'),
            dataUrl: String(attachment.dataUrl || ''),
            thumbnailDataUrl: String(attachment.thumbnailDataUrl || attachment.dataUrl || ''),
            mimeType: String(attachment.mimeType || 'image/png'),
            width: Number(attachment.width) || 0,
            height: Number(attachment.height) || 0,
            createdAt: String(attachment.createdAt || '')
        }))
        .slice(0, 3);
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

function buildVisionSystemPrompt() {
    return [
        '你是 AILIS 的视觉理解能力，负责看用户给出的屏幕或窗口截图。',
        '你只能基于截图和用户文字做理解、解释、归纳和建议，不要声称自己已经点击、输入、拖动或操作了屏幕。',
        '回答要像正在陪用户一起看屏幕的角色，语气自然温和，不要写成工具报告。',
        '优先说明你看到了什么、用户可能想解决什么、下一步可以怎么做；看不清或不确定时直接说明。'
    ].join('\n');
}

function buildVisionUserContent(message, attachments) {
    const labels = attachments.map((attachment) => attachment.label || '截图').join('、');
    const text = [
        `用户的话：${message || '请你看一下这张截图。'}`,
        labels ? `截图来源：${labels}` : '',
        '请结合截图回答用户，不要编造截图里没有的信息。'
    ].filter(Boolean).join('\n');

    return [
        { type: 'text', text },
        ...attachments.map((attachment) => ({
            type: 'image_url',
            image_url: {
                url: attachment.dataUrl
            }
        }))
    ];
}

function summarizeVisionAttachments(attachments) {
    return attachments.map((attachment) => ({
        type: attachment.type,
        id: attachment.id,
        source: attachment.source,
        label: attachment.label,
        mimeType: attachment.mimeType,
        width: attachment.width,
        height: attachment.height,
        createdAt: attachment.createdAt
    }));
}

function getVisionErrorText(result) {
    if (result?.code === 'needs_config') {
        return '我已经拿到截图了，不过还需要先在控制面板配置支持视觉输入的大模型 API，之后我就能直接看图回答。';
    }
    if (result?.code === 'timeout') {
        return '我已经拿到截图了，但视觉模型这次看图超时了。可以先用矩形截图框小一点的区域，或者在控制面板把大模型超时时间调高后再试。';
    }
    if (result?.code === 'provider_error') {
        return `截图已经准备好了，但当前模型接口没有成功理解这张图：${result.error || '接口返回错误'}。可以换成支持视觉的模型再试。`;
    }
    return `截图已经准备好了，但视觉理解暂时失败：${result?.error || '模型没有返回内容'}。`;
}

function getVisionCue(message) {
    if (/报错|错误|异常|卡住|不对|问题/.test(message)) {
        return {
            action: 'thinking',
            expression: 'surprised'
        };
    }
    return {
        action: 'thinking',
        expression: 'relaxed'
    };
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

async function fetchVisionAssistantTurn(messageEntry, { sessionId = 'main', messageHistory = [] } = {}) {
    if (typeof window.ailisDesktop?.llm?.chat !== 'function') {
        throw new Error('当前桌面宿主不支持视觉大模型调用');
    }

    const message = normalizeText(messageEntry?.content);
    const attachments = normalizeVisionAttachments(messageEntry?.attachments);
    const result = await window.ailisDesktop.llm.chat({
        includeAilisMemory: true,
        memorySource: 'vision_direct_llm',
        memoryUserMessage: message,
        memoryAttachments: summarizeVisionAttachments(attachments),
        sessionId,
        messageHistory: sanitizeMessageHistoryForGateway(messageHistory),
        messages: [
            {
                role: 'system',
                content: buildVisionSystemPrompt()
            },
            {
                role: 'user',
                content: buildVisionUserContent(message, attachments)
            }
        ],
        temperature: 0.45,
        timeoutMs: VISION_LLM_TIMEOUT_MS
    });
    const cue = getVisionCue(message);
    const replyText = result?.ok
        ? (result.content || '我看到了截图，但模型没有给出更多内容。')
        : getVisionErrorText(result);

    return toAssistantPayload(replyText, {
        ...cue,
        desktopVision: {
            ok: Boolean(result?.ok),
            provider: result?.provider || '',
            model: result?.model || '',
            code: result?.code || '',
            attachments: summarizeVisionAttachments(attachments)
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
    const cue = getAvatarCue(result);
    const surface = result?.surface && typeof result.surface === 'object' ? result.surface : null;
    const surfaceText = normalizeMarkdownSource(surface?.text || '');
    const fallbackText = normalizeMarkdownSource(result?.displayText || result?.finalAnswer || result?.error || 'AILIS 没有返回可显示内容。');
    return toAssistantPayload(surfaceText || fallbackText, {
        ...cue,
        approvalId: normalizeText(result?.approvalId),
        action: surface ? surface.action : cue.action,
        expression: surface ? surface.expression : cue.expression,
        speechText: surface?.speechText || result?.speechText || surfaceText || '',
        bubbleText: surface?.bubbleText || result?.bubbleText || '',
        surface,
        ailis: result
    });
}

function isExplicitApprovalConfirmation(message = '') {
    return /^(确认|确认执行|批准|同意|允许|可以执行|开始执行|执行吧|approve|approved|confirm)$/i.test(
        normalizeText(message).replace(/[\s。！!,.，]+/g, '')
    );
}

function isExplicitApprovalCancellation(message = '') {
    return /^(取消|不要执行|停止执行|不同意|拒绝|cancel|reject|deny)$/i.test(
        normalizeText(message).replace(/[\s。！!,.，]+/g, '')
    );
}

function latestApprovalIdFromHistory(messageHistory = []) {
    for (const entry of [...(Array.isArray(messageHistory) ? messageHistory : [])].reverse()) {
        if (entry?.role !== 'assistant') {
            continue;
        }
        return normalizeText(entry.approvalId || entry.approval_id);
    }
    return '';
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
        this.pendingApprovalIds = new Map();
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
        if (
            this.runtimeKind === 'desktop' &&
            visionAttachments.length &&
            !splitAttachments.files.length
        ) {
            const payload = await fetchVisionAssistantTurn(latestUserEntry, {
                sessionId,
                messageHistory
            });
            return attachServerTtsIfRequested(payload, replyMode);
        }

        const status = await this.ensureReady();
        const pendingApprovalId = this.pendingApprovalIds.get(sessionId) ||
            latestApprovalIdFromHistory(messageHistory);
        if (pendingApprovalId) {
            this.pendingApprovalIds.set(sessionId, pendingApprovalId);
        }
        const confirmsPendingApproval = Boolean(pendingApprovalId && isExplicitApprovalConfirmation(message));
        const cancelsPendingApproval = Boolean(pendingApprovalId && isExplicitApprovalCancellation(message));
        if (pendingApprovalId && !confirmsPendingApproval && !cancelsPendingApproval) {
            this.pendingApprovalIds.delete(sessionId);
        }
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
                    agentLoop: 'llm',
                    directToolExecutor: true,
                    maxAgentSteps: 4,
                    ...((confirmsPendingApproval || cancelsPendingApproval) ? {
                        confirmApprovalId: pendingApprovalId,
                        ...(confirmsPendingApproval ? { confirmed: true } : {})
                    } : {}),
                    context: {
                        workspace: status.workspaceRoot,
                        runtimeKind: this.runtimeKind,
                        agentLoop: 'llm',
                        directToolExecutor: true,
                        maxAgentSteps: 4,
                        agentRole: 'persona_orchestrator',
                        ...((confirmsPendingApproval || cancelsPendingApproval) ? {
                            confirmApprovalId: pendingApprovalId,
                            approvalId: pendingApprovalId,
                            ...(confirmsPendingApproval ? { approved: true } : {})
                        } : {})
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
        if (result?.status === 'needs_approval' && normalizeText(result?.approvalId)) {
            this.pendingApprovalIds.set(sessionId, normalizeText(result.approvalId));
        } else if (confirmsPendingApproval || cancelsPendingApproval) {
            this.pendingApprovalIds.delete(sessionId);
        }

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
        const latestUser = [...messageHistory].reverse().find((message) => message?.role === 'user');
        const isWorkMode = mode === 'cowork';
        if (!isWorkMode) {
            try {
                const status = await this.ensureReady();
                const latestUserText = normalizeText(latestUser?.content || latestUser?.text) || '日常陪伴';
                const result = await this.gateway.runAgent({
                    sessionId,
                    message: latestUserText,
                    messageHistory: sanitizeMessageHistoryForGateway(messageHistory),
                    agentLoop: 'llm',
                    directToolExecutor: true,
                    maxAgentSteps: 1,
                    suppressCurrentUserMessage: true,
                    ephemeralDeveloperMessage: buildProactiveCompanionHeartbeatDeveloperMessage(messageHistory),
                    context: {
                        workspace: status.workspaceRoot,
                        agentLoop: 'llm',
                        directToolExecutor: true,
                        maxAgentSteps: 1,
                        agentRole: 'persona_orchestrator',
                        suppressCurrentUserMessage: true,
                        ephemeralDeveloperMessage: buildProactiveCompanionHeartbeatDeveloperMessage(messageHistory)
                    }
                });
                const payload = toAILISPayload(result);
                const text = normalizeMarkdownSource(payload.display_text || '');
                if (!text) {
                    return {
                        ok: false,
                        reasonType: 'empty_reply'
                    };
                }
                return {
                    ok: true,
                    text,
                    model: result?.model || result?.llm?.model || ''
                };
            } catch (error) {
                return {
                    ok: false,
                    reasonType: error?.code || 'reply_generation_failed',
                    error: error?.message || String(error)
                };
            }
        }
        const conversationMessages = messageHistory
            .filter((message) => ['user', 'assistant'].includes(message?.role))
            .map((message) => ({
                role: message.role,
                content: normalizeMarkdownSource(message.content || message.text || '')
            }))
            .filter((message) => message.content);
        const result = await window.ailisDesktop.llm.chat({
            includeAilisMemory: true,
            recordMemory: false,
            memorySource: 'proactive_work_reply',
            memoryUserMessage: normalizeText(latestUser?.content || latestUser?.text) ||
                '工作模式主动反馈',
            messageHistory,
            sessionId,
            messages: [
                {
                    role: 'system',
                    content: buildProactiveWorkReplySystemPrompt(decision)
                },
                ...conversationMessages
            ],
            jsonMode: false,
            expectJson: false,
            outputFormat: 'text',
            temperature: 0.82,
            maxTokens: 700,
            timeoutMs: PROACTIVE_LLM_TIMEOUT_MS
        });
        if (!result?.ok) {
            return {
                ok: false,
                reasonType: result?.code || 'reply_generation_failed',
                error: result?.error || ''
            };
        }
        const text = normalizeMarkdownSource(result.content || '');
        if (!text) {
            return {
                ok: false,
                reasonType: 'empty_reply'
            };
        }
        return {
            ok: true,
            text,
            model: result.model || ''
        };
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
