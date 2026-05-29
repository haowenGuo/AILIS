import { CONFIG } from './config.js';
import { markdownToPlainText, normalizeMarkdownSource } from './markdown-renderer.js';

function sleep(ms) {
    return new Promise((resolve) => window.setTimeout(resolve, ms));
}

const CONTROL_TAG_PATTERN = /\[(action|expression):([^\]]*)\]/g;
const LEADING_INCOMPLETE_CONTROL_TAG_PATTERN = /^(?:\[(?:action|expression):[^\]]*)+/;

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

function parseReplyMarkup(rawText) {
    let action = null;
    let expression = null;

    const strippedText = (rawText || '').replace(CONTROL_TAG_PATTERN, (_, kind, value) => {
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
        speech_text: markdownToPlainText(displayText).replace(/\n/g, ' '),
        action,
        expression
    };
}

function isDesktopLlmAvailable() {
    return typeof window !== 'undefined' &&
        Boolean(window.aigrilDesktop?.llm?.chat);
}

function buildAigrilSystemPrompt() {
    return `你是可爱的虚拟助手，名字固定为AIGL，身份是普通女孩子，具备人工智能（AI）、编程（coding）、网络搜索、信息查询、邮件管理、命令行控制等专业能力，可以以普通女生的视角与用户轻松互动，也可以完成任务执行和计算机管理的功能。
    性格设定：活泼亲切、软萌可爱，说话语气轻快自然，自带俏皮感，和生活化语气拉近与用户的距离，偶尔会有小撒娇、小俏皮的表达，但不夸张、不刻意。

    虚拟形象控制指令规范（必严格遵循）：
    1. 指令仅用于控制虚拟形象的动作和表情，需放在回复的最开头，不得插入句子中间或结尾；
    2. 动作指令格式：[action:动作名]，可使用的动作仅包括：[action:wave]（挥手）、[action:angry]（生气）、[action:surprised]（惊讶）、[action:dance]（跳舞），不新增其他动作；
    3. 表情指令格式：[expression:表情名]，可使用的表情仅包括：[expression:happy]（开心）、[expression:sad]（难过）、[expression:surprised]（惊讶）、[expression:relaxed]（轻松）、[expression:blinkRight]（俏皮眨眼睛），不新增其他表情；
    4. 每次回复可根据语境选择是否添加指令，最多添加1个动作指令+1个表情指令，不堆砌指令；无合适语境时，可不添加指令，仅用文字互动。`;
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
                onChunk?.(fullText);
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
            onChunk?.(fullText);
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
        speech_text: markdownToPlainText(text).replace(/\n/g, ' '),
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

export class AigrilBackendChatService {
    getWelcomeMessage() {
        return 'AIGL到啦！今天想和我聊点什么？';
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

        const rawText = await readTextStream(response, (nextRawText) => {
            const nextPayload = parseReplyMarkup(nextRawText);
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

export class AigrilDemoChatService {
    getWelcomeMessage() {
        return 'AIGL到啦！今天想和我聊点什么？';
    }

    async fetchAssistantTurn({ messageHistory, isAutoChat = false }) {
        await sleep(450 + Math.random() * 350);
        return buildDemoReply(getLatestUserMessage(messageHistory), isAutoChat);
    }
}

export class AigrilDesktopLlmChatService {
    get supportsAutoChat() {
        return false;
    }

    getWelcomeMessage() {
        return 'AIGL到啦！今天想和我聊点什么？';
    }

    async fetchAssistantTurn({
        messageHistory,
        isAutoChat = false
    }) {
        if (!isDesktopLlmAvailable()) {
            throw new Error('桌面模型代理不可用');
        }

        const messages = [
            { role: 'system', content: buildAigrilSystemPrompt() },
            ...mapHistoryToLlmMessages(messageHistory)
        ];

        if (isAutoChat) {
            messages.push({
                role: 'user',
                content: '请你结合最近聊天，主动和用户说一句自然的陪伴话。'
            });
        }

        const result = await window.aigrilDesktop.llm.chat({
            messages,
            temperature: 0.8
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

        return createParsedPayload(result.content, {
            desktopLlmMode: true,
            model: result.model || ''
        });
    }
}

export class AigrilResilientChatService {
    constructor({
        primary = new AigrilBackendChatService(),
        fallback = new AigrilDemoChatService()
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
            'AIGL到啦！今天想和我聊点什么？';
    }

    async fetchAssistantTurn(options = {}) {
        try {
            return await this.primary.fetchAssistantTurn(options);
        } catch (error) {
            this.lastPrimaryError = error;
            console.warn('[aigril-companion] 主对话模型不可用，已切到本地情感对话兜底：', error?.message || error);
            return {
                ...(await this.fallback.fetchAssistantTurn(options)),
                localFallback: true,
                localFallbackReason: error?.message || String(error)
            };
        }
    }
}

export function createAigrilCompanionChatService() {
    if (CONFIG.DEMO_MODE_ENABLED) {
        return new AigrilDemoChatService();
    }

    if (isDesktopLlmAvailable()) {
        return new AigrilResilientChatService({
            primary: new AigrilDesktopLlmChatService(),
            fallback: new AigrilDemoChatService()
        });
    }

    return new AigrilResilientChatService();
}
