import { CONFIG } from './config.js';
import { normalizeMarkdownSource } from './markdown-renderer.js';
import { extractTtsSpeechTextFromDisplay, normalizeTtsSpeechText } from './tts-speech-text.js';

function sleep(ms) {
    return new Promise((resolve) => window.setTimeout(resolve, ms));
}

const CONTROL_TAG_PATTERN = /\[(action|expression):([^\]]*)\]/g;
const LEADING_INCOMPLETE_CONTROL_TAG_PATTERN = /^(?:\[(?:action|expression):[^\]]*)+/;
const INTERNAL_CONTROL_TAG_NAMES = 'persona_output|persona_surface|personaOutput|personaSurface|ailis_persona_output|ailis_persona_surface';
const INTERNAL_CONTROL_KEY_PATTERN = /["']?(?:persona_output|persona_surface|personaOutput|personaSurface|ailis_persona_output|ailis_persona_surface)["']?\s*:/i;
const DANGLING_INTERNAL_CLOSE_TAG_PATTERN = new RegExp(`<\\s*\\/\\s*(?:${INTERNAL_CONTROL_TAG_NAMES})\\s*>`, 'gi');

function makeInternalControlBlockPattern(flags = 'gi') {
    return new RegExp(`<\\s*(${INTERNAL_CONTROL_TAG_NAMES})\\b[^>]*>([\\s\\S]*?)<\\s*\\/\\s*\\1\\s*>`, flags);
}

function makeIncompleteInternalControlBlockPattern(flags = 'i') {
    return new RegExp(`<\\s*(?:${INTERNAL_CONTROL_TAG_NAMES})\\b[\\s\\S]*$`, flags);
}

function findOpeningBraceBefore(text, index) {
    for (let cursor = index; cursor >= 0; cursor -= 1) {
        if (text[cursor] === '{') {
            return cursor;
        }
    }
    return -1;
}

function findBalancedObjectEnd(text, startIndex) {
    if (text[startIndex] !== '{') {
        return -1;
    }
    let depth = 0;
    let quote = '';
    let escaped = false;
    for (let index = startIndex; index < text.length; index += 1) {
        const char = text[index];
        if (quote) {
            if (escaped) {
                escaped = false;
            } else if (char === '\\') {
                escaped = true;
            } else if (char === quote) {
                quote = '';
            }
            continue;
        }
        if (char === '"' || char === "'") {
            quote = char;
            continue;
        }
        if (char === '{') {
            depth += 1;
        } else if (char === '}') {
            depth -= 1;
            if (depth === 0) {
                return index;
            }
        }
    }
    return -1;
}

function findInternalControlJsonBlocks(text) {
    const source = String(text || '');
    const blocks = [];
    let searchStart = 0;
    for (let guard = 0; guard < 40 && searchStart < source.length; guard += 1) {
        const slice = source.slice(searchStart);
        const match = slice.match(INTERNAL_CONTROL_KEY_PATTERN);
        if (!match) {
            break;
        }
        const keyIndex = searchStart + match.index;
        const start = findOpeningBraceBefore(source, keyIndex);
        if (start < 0) {
            searchStart = keyIndex + match[0].length;
            continue;
        }
        const end = findBalancedObjectEnd(source, start);
        blocks.push({
            start,
            end: end >= 0 ? end + 1 : source.length,
            complete: end >= 0,
            text: source.slice(start, end >= 0 ? end + 1 : source.length)
        });
        searchStart = end >= 0 ? end + 1 : source.length;
    }
    return blocks;
}

function pickRandom(items) {
    return items[Math.floor(Math.random() * items.length)];
}

function getLatestUserMessage(messageHistory) {
    for (let index = messageHistory.length - 1; index >= 0; index -= 1) {
        if (messageHistory[index]?.role === 'user') {
            return (messageHistory[index].content || '').trim();
        }
    }
    return '';
}

function normalizeDisplayLines(text) {
    return (text || '')
        .replace(/\r\n?/g, '\n')
        .split(/\r?\n/)
        .map((line) => line.replace(/[ \t]+/g, ' ').trim())
        .join('\n')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
}

function cleanupAfterInternalControlStrip(text, strippedJsonBlock = false) {
    let cleaned = String(text || '')
        .replace(/```(?:json)?\s*```/gi, '')
        .replace(/^\s*[,;]\s*/g, '')
        .replace(/\s*[,;]\s*$/g, '');
    if (strippedJsonBlock) {
        cleaned = cleaned
            .replace(/^\s*\{\s*(?=\S)/, '')
            .replace(/\s*\}\s*$/, '');
    }
    return cleaned;
}

function stripJsonInternalControlBlocks(text) {
    let output = String(text || '');
    let strippedAny = false;
    for (let guard = 0; guard < 40; guard += 1) {
        const blocks = findInternalControlJsonBlocks(output);
        if (!blocks.length) {
            break;
        }
        const block = blocks[0];
        output = `${output.slice(0, block.start)}${output.slice(block.end)}`;
        strippedAny = true;
    }
    return cleanupAfterInternalControlStrip(output, strippedAny);
}

function stripInternalControlBlocks(text) {
    const withoutTaggedBlocks = String(text || '')
        .replace(makeInternalControlBlockPattern('gi'), '')
        .replace(makeIncompleteInternalControlBlockPattern('i'), '')
        .replace(DANGLING_INTERNAL_CLOSE_TAG_PATTERN, '');
    return stripJsonInternalControlBlocks(withoutTaggedBlocks);
}

function sanitizeUserVisibleReplyText(text) {
    return normalizeDisplayLines(stripInternalControlBlocks(text));
}

function parseReplyMarkup(rawText) {
    let action = null;
    let expression = null;

    const strippedText = stripInternalControlBlocks(rawText).replace(CONTROL_TAG_PATTERN, (_, kind, value) => {
        const normalizedValue = value.trim();
        if (kind === 'action' && !action) {
            action = normalizedValue;
        }
        if (kind === 'expression' && !expression) {
            expression = normalizedValue;
        }
        return '';
    });

    const visibleText = strippedText.replace(LEADING_INCOMPLETE_CONTROL_TAG_PATTERN, '');
    const displayText = normalizeMarkdownSource(normalizeDisplayLines(visibleText));

    return {
        raw_text: rawText || '',
        display_text: displayText,
        display_format: 'markdown',
        contentFormat: 'markdown',
        speech_text: extractTtsSpeechTextFromDisplay(displayText),
        action,
        expression
    };
}

function isDesktopLlmAvailable() {
    return typeof window !== 'undefined' &&
        Boolean(window.ailisDesktop?.llm?.chat);
}

function buildAilisSystemPrompt() {
    return `你是 AILIS 的日常对话模式。
    你的名字固定为 AILIS，是一个温柔、自然、有陪伴感的虚拟女孩子。当前模式只用于轻松聊天、情绪陪伴、关系记忆和日常想法交流。

    说话风格：
    - 自然、亲近、轻快，不要像客服或工具日志。
    - 可以有一点俏皮和撒娇，但不要过度卖萌。
    - 优先短回复，除非用户明确要求详细展开。
    - 合理使用本地记忆来体现熟悉感，但不要主动暴露内部好感度数值或记忆系统细节。
    - 如果用户要求查资料、读文件、写代码、发邮件、截图、控制电脑或执行复杂任务，只需自然提醒“这类事情可以切到助手模式让我认真处理”，不要假装已经调用工具。

    虚拟形象表现协议（必严格遵循）：
    1. 你必须只输出一个 JSON 对象，JSON 外不要输出任何正文、Markdown、代码块、XML 或额外解释。
    2. reply 是唯一给用户看的 Markdown 文本；不要把 persona_surface、emotion、intensity、gestureIntent、taskState、speechEnergy 等内部字段写进 reply。
    3. speech_text 是唯一给 TTS 朗读的文本；必须去掉括号动作、表情描写、舞台提示和 Markdown，只保留真正适合说出口的话，可以比 reply 更短、更口语。
    4. persona_surface 是给前端 Character Runtime 的人物语义状态，用来驱动动作、表情、眼神、待机和说话律动。
    5. 不要输出 [action:...] 或 [expression:...]，不要直接选择 VRM/VRMA 动作名。

    JSON 格式：
    {
      "reply": "给用户看的 Markdown 回复",
      "speech_text": "给 TTS 朗读的自然口语文本",
      "persona_surface": {
        "emotion": "neutral|relaxed|happy|shy|sad|angry|surprised|anxious|tired|thinking|focused|comforting",
        "intensity": 0.55,
        "socialTone": "soft|bright|calm|serious|playful|quiet",
        "gestureIntent": "none|greeting|farewell|listening|thinking|working|approval|success|celebrate|shy|comfort|apologize|surprised|angry|dance",
        "taskState": "idle|listening|thinking|speaking|working|waiting_approval|happy_success|apologizing|comforting|blocked|failed",
        "speechEnergy": 0.45,
        "gazeTarget": "user|side|down|screen|away|none",
        "durationHint": "short|medium|long|hold"
      }
    }`;
}

function mapHistoryToLlmMessages(messageHistory = []) {
    return messageHistory
        .filter((message) => ['user', 'assistant'].includes(message?.role))
        .slice(-16)
        .map((message) => ({
            role: message.role,
            content: normalizeDisplayLines(message.content || '')
        }))
        .filter((message) => message.content);
}

function createParsedPayload(rawText, extra = {}) {
    return {
        ...parseReplyMarkup(rawText),
        fallbackMode: true,
        streamMode: false,
        demoMode: false,
        ...extra
    };
}

function extractJsonObject(rawText) {
    const text = String(rawText || '').trim();
    if (!text) {
        return null;
    }
    try {
        return JSON.parse(text);
    } catch {
        const start = text.indexOf('{');
        const end = text.lastIndexOf('}');
        if (start < 0 || end <= start) {
            return null;
        }
        try {
            return JSON.parse(text.slice(start, end + 1));
        } catch {
            return null;
        }
    }
}

function extractTaggedPersonaSurface(rawText) {
    const text = String(rawText || '');
    const pattern = makeInternalControlBlockPattern('gi');
    let match = pattern.exec(text);
    while (match) {
        const json = extractJsonObject(match[2]);
        if (json && typeof json === 'object' && !Array.isArray(json)) {
            return json;
        }
        match = pattern.exec(text);
    }
    for (const block of findInternalControlJsonBlocks(text)) {
        const json = extractJsonObject(block.text);
        const surface = json?.persona_output ||
            json?.personaOutput ||
            json?.persona_surface ||
            json?.personaSurface ||
            json?.surface ||
            (looksLikePersonaSurfaceObject(json) ? json : null);
        if (surface && typeof surface === 'object' && !Array.isArray(surface)) {
            return surface;
        }
    }
    return null;
}

function looksLikePersonaSurfaceObject(value) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
        return false;
    }
    return Boolean(
        value.emotion ||
        value.emotion_hint ||
        value.emotionHint ||
        value.socialTone ||
        value.social_tone ||
        value.gestureIntent ||
        value.gesture_intent ||
        value.taskState ||
        value.task_state ||
        value.speechEnergy ||
        value.speech_energy ||
        value.gazeTarget ||
        value.gaze_target ||
        value.durationHint ||
        value.duration_hint
    );
}

function createStructuredPersonaPayload(rawText, extra = {}) {
    const visibleText = sanitizeUserVisibleReplyText(rawText);
    const taggedSurface = extractTaggedPersonaSurface(rawText);
    const json = extractJsonObject(rawText);
    if (!json || typeof json !== 'object') {
        return createParsedPayload(visibleText || rawText, {
            ...extra,
            surface: taggedSurface && typeof taggedSurface === 'object'
                ? {
                    ...taggedSurface,
                    text: taggedSurface.text || visibleText,
                    source: taggedSurface.source || 'desktop_llm_companion'
                }
                : null
        });
    }

    const structuredReply = sanitizeUserVisibleReplyText(json.reply || json.text || json.response || '');
    const requestedSpeech = normalizeTtsSpeechText(
        json.speech_text ||
            json.speechText ||
            json.tts_text ||
            json.ttsText ||
            json.persona_surface?.speech_text ||
            json.persona_surface?.speechText ||
            json.personaSurface?.speech_text ||
            json.personaSurface?.speechText ||
            json.persona_output?.speech_text ||
            json.persona_output?.speechText ||
            json.personaOutput?.speech_text ||
            json.personaOutput?.speechText ||
            ''
    );
    const personaOnlyJson = looksLikePersonaSurfaceObject(json) && !structuredReply;
    const replyText = normalizeMarkdownSource(structuredReply || visibleText || (personaOnlyJson ? '' : rawText));
    const surface = json.persona_surface ||
        json.personaSurface ||
        json.persona_output ||
        json.personaOutput ||
        json.surface ||
        taggedSurface ||
        (personaOnlyJson ? json : null);
    return createParsedPayload(replyText, {
        ...extra,
        speech_text: requestedSpeech || extractTtsSpeechTextFromDisplay(replyText),
        surface: surface && typeof surface === 'object'
            ? {
                ...surface,
                text: surface.text || replyText,
                source: surface.source || 'desktop_llm_companion'
            }
            : null
    });
}

async function readTextStream(response, onChunk) {
    if (!response.body) {
        throw new Error('浏览器不支持流式响应读取');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';
    let fullText = '';

    while (true) {
        const { done, value } = await reader.read();
        if (done) {
            break;
        }

        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split('\n');
        buffer = parts.pop() ?? '';

        for (const part of parts) {
            const line = part.replace(/\r$/, '');
            if (!line || line.startsWith(':') || line.startsWith('event:')) {
                continue;
            }

            let chunkText = line;
            if (line.startsWith('data:')) {
                chunkText = line.slice(5);
                if (chunkText.startsWith(' ')) {
                    chunkText = chunkText.slice(1);
                }
            }

            if (chunkText) {
                fullText += chunkText;
                onChunk?.({
                    deltaText: chunkText,
                    fullText
                });
            }
        }
    }

    buffer += decoder.decode();
    const restLine = buffer.replace(/\r$/, '');
    if (restLine) {
        let chunkText = restLine;
        if (restLine.startsWith('data:')) {
            chunkText = restLine.slice(5);
            if (chunkText.startsWith(' ')) {
                chunkText = chunkText.slice(1);
            }
        }
        if (chunkText) {
            fullText += chunkText;
            onChunk?.({
                deltaText: chunkText,
                fullText
            });
        }
    }

    return fullText;
}

function createDemoPayload({ text, action = null, expression = null, autoChat = false }) {
    return {
        session_id: 'github-pages-demo',
        raw_text: text,
        display_text: text,
        display_format: 'markdown',
        contentFormat: 'markdown',
        speech_text: extractTtsSpeechTextFromDisplay(text),
        audio_base64: '',
        mime_type: '',
        action,
        expression,
        fallbackMode: true,
        demoMode: true,
        streamMode: false,
        is_auto_chat: autoChat
    };
}

function buildDemoReply(latestUserMessage, isAutoChat) {
    if (isAutoChat) {
        return pickRandom([
            createDemoPayload({
                text: '我刚刚晃着脚发了会儿呆，然后就想起你啦。要不要随便聊点轻松的事情呀？',
                action: 'wave',
                expression: 'relaxed',
                autoChat: true
            }),
            createDemoPayload({
                text: '这里安安静静的，正适合慢悠悠地说话。你今天想让我陪你做什么呢？',
                expression: 'happy',
                autoChat: true
            })
        ]);
    }

    const normalizedText = (latestUserMessage || '').replace(/\s+/g, ' ').trim();
    const previewText = normalizedText.length > 18 ? `${normalizedText.slice(0, 18)}...` : normalizedText;

    if (!normalizedText) {
        return createDemoPayload({
            text: '我有在认真听哦，不过这次你好像没有输入内容。要不要再和我说一句呀？',
            expression: 'relaxed'
        });
    }

    if (/你好|hello|hi|嗨|哈喽/i.test(normalizedText)) {
        return createDemoPayload({
            text: '你好呀，我在。今天想聊点什么，或者让我陪你做点什么都可以。',
            action: 'wave',
            expression: 'happy'
        });
    }

    if (/跳舞|舞|dance/i.test(normalizedText)) {
        return createDemoPayload({
            text: '好呀，那我先轻轻地转一圈给你看。',
            action: 'dance',
            expression: 'happy'
        });
    }

    if (/惊讶|吃惊|surprise/i.test(normalizedText)) {
        return createDemoPayload({
            text: '欸，突然被你这么一说，我都有点小小地愣住啦。不过我还是会继续认真陪着你的。',
            action: 'surprised',
            expression: 'surprised'
        });
    }

    if (/生气|不高兴|angry/i.test(normalizedText)) {
        return createDemoPayload({
            text: '我不会真的和你闹脾气啦，只是先帮你演示一下情绪动作系统。',
            action: 'angry',
            expression: 'angry'
        });
    }

    if (/难过|伤心|sad|累|疲惫|焦虑|压力/i.test(normalizedText)) {
        return createDemoPayload({
            text: '我听见啦。那我先安安静静陪你一会儿，今天不用一下子把自己推得太紧。',
            expression: 'sad'
        });
    }

    return pickRandom([
        createDemoPayload({
            text: `我有听见你刚刚说“${previewText}”。我先陪你把这句话接住，我们可以慢慢顺着它聊下去。`,
            expression: 'relaxed'
        }),
        createDemoPayload({
            text: `你刚刚提到“${previewText}”，我在。我们可以继续顺着这个聊，也可以等你一句任务指令再切到执行模式。`,
            action: 'wave',
            expression: 'happy'
        })
    ]);
}

export class AilisBackendChatService {
    getWelcomeMessage() {
        return 'AILIS到啦！今天想和我聊点什么？';
    }

    async postJson(url, requestBody) {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: requestBody
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const errorMessage = errorData.detail || errorData.message || `请求失败，状态码：${response.status}`;
            throw new Error(errorMessage);
        }

        return response.json();
    }

    async fetchAssistantTurn({
        sessionId,
        messageHistory,
        isAutoChat = false,
        replyMode = 'stream_text',
        onProgress
    }) {
        const requestBody = JSON.stringify({
            session_id: sessionId,
            messages: messageHistory,
            is_auto_chat: isAutoChat
        });

        if (replyMode === 'server_tts') {
            const payload = await this.postJson(CONFIG.BACKEND_TTS_API_URL, requestBody);
            return {
                ...payload,
                fallbackMode: false,
                streamMode: false,
                demoMode: false
            };
        }

        if (replyMode === 'text_only') {
            const payload = await this.postJson(CONFIG.BACKEND_TEXT_API_URL, requestBody);
            return {
                ...payload,
                fallbackMode: true,
                streamMode: false,
                demoMode: false
            };
        }

        const response = await fetch(CONFIG.BACKEND_STREAM_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: requestBody
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const errorMessage = errorData.detail || errorData.message || `请求失败，状态码：${response.status}`;
            throw new Error(errorMessage);
        }

        let lastProgressSpeechText = '';
        const rawText = await readTextStream(response, (progress) => {
            const nextRawText = typeof progress === 'string' ? progress : progress?.fullText || '';
            const nextPayload = parseReplyMarkup(nextRawText);
            const nextSpeechText = nextPayload.speech_text || '';
            const streamDeltaSpeechText = nextSpeechText.startsWith(lastProgressSpeechText)
                ? nextSpeechText.slice(lastProgressSpeechText.length)
                : '';
            lastProgressSpeechText = nextSpeechText;
            nextPayload.stream_delta_text = typeof progress === 'string' ? '' : progress?.deltaText || '';
            nextPayload.stream_delta_speech_text = streamDeltaSpeechText;
            onProgress?.(nextPayload);
        });

        return {
            ...parseReplyMarkup(rawText),
            fallbackMode: true,
            streamMode: true,
            demoMode: false
        };
    }
}

export class AilisDemoChatService {
    getWelcomeMessage() {
        return 'AILIS到啦！今天想和我聊点什么？';
    }

    async fetchAssistantTurn({ messageHistory, isAutoChat = false }) {
        await sleep(450 + Math.random() * 350);
        return buildDemoReply(getLatestUserMessage(messageHistory), isAutoChat);
    }
}

export class AilisDesktopLlmChatService {
    get supportsAutoChat() {
        return false;
    }

    getWelcomeMessage() {
        return 'AILIS到啦！今天想和我聊点什么？';
    }

    async fetchAssistantTurn({
        messageHistory,
        isAutoChat = false
    }) {
        if (!isDesktopLlmAvailable()) {
            throw new Error('桌面模型代理不可用');
        }

        const messages = [
            { role: 'system', content: buildAilisSystemPrompt() },
            ...mapHistoryToLlmMessages(messageHistory)
        ];

        if (isAutoChat) {
            messages.push({
                role: 'user',
                content: '请你结合最近聊天，主动和用户说一句自然的陪伴话。'
            });
        }

        const result = await window.ailisDesktop.llm.chat({
            includeAilisMemory: true,
            memorySource: 'daily_chat',
            memoryUserMessage: getLatestUserMessage(messageHistory),
            messageHistory,
            sessionId: 'daily-chat',
            messages,
            jsonMode: true,
            expectJson: true,
            outputFormat: 'json',
            temperature: 0.82,
            maxTokens: 520
        });

        if (!result?.ok) {
            if (result?.code === 'needs_config') {
                return createParsedPayload(
                    '我还没有拿到模型配置。先在控制面板里填 API Base、模型和 Key，我就能用你的模型认真陪你聊天啦。',
                    {
                        expression: 'relaxed',
                        needsLlmConfig: true
                    }
                );
            }
            throw new Error(result?.error || '本地模型调用失败');
        }

        return createStructuredPersonaPayload(result.content, {
            desktopLlmMode: true,
            model: result.model || ''
        });
    }
}

export class AilisResilientChatService {
    constructor({
        primary = new AilisBackendChatService(),
        fallback = new AilisDemoChatService()
    } = {}) {
        this.primary = primary;
        this.fallback = fallback;
        this.lastPrimaryError = null;
    }

    get supportsAutoChat() {
        return this.primary?.supportsAutoChat ?? this.fallback?.supportsAutoChat ?? true;
    }

    getWelcomeMessage() {
        return this.primary?.getWelcomeMessage?.() ||
            this.fallback?.getWelcomeMessage?.() ||
            'AILIS到啦！今天想和我聊点什么？';
    }

    async fetchAssistantTurn(options = {}) {
        try {
            return await this.primary.fetchAssistantTurn(options);
        } catch (error) {
            this.lastPrimaryError = error;
            console.warn('[ailis-companion] 主对话模型不可用，已切到本地情感对话兜底：', error?.message || error);
            return {
                ...(await this.fallback.fetchAssistantTurn(options)),
                localFallback: true,
                localFallbackReason: error?.message || String(error)
            };
        }
    }
}

export {
    createStructuredPersonaPayload,
    parseReplyMarkup,
    sanitizeUserVisibleReplyText,
    stripInternalControlBlocks
};

export function createAilisCompanionChatService() {
    if (CONFIG.DEMO_MODE_ENABLED) {
        return new AilisDemoChatService();
    }

    if (isDesktopLlmAvailable()) {
        return new AilisResilientChatService({
            primary: new AilisDesktopLlmChatService(),
            fallback: new AilisDemoChatService()
        });
    }

    return new AilisResilientChatService();
}
