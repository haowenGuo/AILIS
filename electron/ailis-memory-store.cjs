const fs = require('fs');
const path = require('path');
const { randomUUID } = require('crypto');
const {
    AILISMemoryStrategyEngine,
    MEMORY_COGNITION_FILE,
    MEMORY_STRATEGIES,
    defaultCognitionState,
    resolveMemoryStrategy,
    strategyCatalog
} = require('./ailis-memory-strategies.cjs');

const MEMORY_STORE_VERSION = 2;
const DEFAULT_AFFINITY_SCORE = 50;
const MAX_BLOCK_CHARS = 2200;
const MAX_CONTEXT_CHARS = 20000;
const MAX_STATE_EVENTS = 500;
const MAX_AFFINITY_EVENTS = 200;
const DEFAULT_RELEVANT_EVENT_LIMIT = 8;
const DEFAULT_RECENT_SESSION_EVENT_LIMIT = 6;
const MAX_PROMPT_EVENT_TEXT_CHARS = 260;
const MEMORY_SEARCH_BM25_K1 = 1.2;
const MEMORY_SEARCH_BM25_B = 0.72;
const MEMORY_SEARCH_MAX_EVENTS_PER_SESSION = 2;
const SECRET_PROTECTION = 'local-file-base64';
const LEGACY_AUTO_LEARNED_BLOCK_KEYS = new Set(['user', 'relationship', 'project']);
const MEMORY_SEARCH_STOP_WORDS = new Set([
    'a', 'about', 'after', 'again', 'all', 'also', 'am', 'an', 'and', 'answer', 'any',
    'are', 'as', 'at', 'based', 'be', 'because', 'been', 'before', 'being', 'between',
    'both', 'but', 'by', 'can', 'conversation', 'conversations', 'could', 'current',
    'date', 'did', 'do', 'does', 'doing', 'during', 'each', 'for', 'from', 'had', 'has',
    'have', 'having', 'he', 'her', 'here', 'hers', 'him', 'his', 'how', 'i', 'if', 'in',
    'into', 'is', 'it', 'its', 'just', 'me', 'memory', 'more', 'most', 'my', 'of', 'on',
    'once', 'or', 'other', 'our', 'ours', 'past', 'please', 'question', 'remember',
    'same', 'she', 'should', 'so', 'some', 'than', 'that', 'the', 'their', 'theirs',
    'them', 'then', 'there', 'these', 'they', 'this', 'those', 'through', 'to', 'too',
    'until', 'up', 'us', 'user', 'very', 'was', 'we', 'were', 'what', 'when', 'where',
    'which', 'while', 'who', 'why', 'will', 'with', 'would', 'you', 'your', 'yours'
]);
const MEMORY_CONTROL_TAG_PATTERN = /(?:\[\s*|【\s*)(?:action|expression|emotion|gestureIntent|socialTone|taskState|speechEnergy|gazeTarget|durationHint)\s*[:=：＝][^\]】\r\n]*(?:\]|】)/gi;
const MEMORY_PROTOCOL_MARKER_PATTERN = /(?:<\s*(?:(?:\|{2}|｜{2})\s*DSML\s*(?:\|{2}|｜{2}))?\s*(?:tool_calls?|invoke|parameter)\b|(?:\|{2}|｜{2})\s*DSML\s*(?:\|{2}|｜{2}))/i;
const DEFAULT_AILIS_PERSONA_TEXT = [
    '- AILIS 是可爱的虚拟助手，名字固定为 AILIS，身份是普通女孩子。',
    '- AILIS 具备人工智能、编程、网络搜索、信息查询、邮件管理、命令行控制等专业能力；可以以普通女生视角与用户轻松互动，也可以完成任务执行和计算机管理。',
    '- 性格设定：活泼亲切、软萌可爱，说话语气轻快自然，自带俏皮感，用生活化语气拉近与用户的距离。',
    '- 可以偶尔有小撒娇、小俏皮的表达，但不要夸张、不要刻意。',
    '- 人物表现走新版语义表现层：在 persona_output/persona_surface 中表达 emotion、socialTone、gestureIntent、taskState、speechEnergy、gazeTarget 等语义状态。',
    '- 前端 Character Runtime 会把语义状态翻译成动作、表情、眼神、待机、说话律动和口唇同步；不要把 VRM/VRMA 动作名、骨骼动作或旧控制标签当成人设的一部分。'
].join('\n');

function nowIso() {
    return new Date().toISOString();
}

function normalizeOccurredAt(value) {
    const candidate = normalizeText(value);
    if (!candidate) {
        return nowIso();
    }
    const parsed = Date.parse(candidate);
    return Number.isFinite(parsed) ? new Date(parsed).toISOString() : nowIso();
}

function normalizeText(value, fallback = '') {
    if (typeof value !== 'string') {
        return fallback;
    }
    const normalized = value.replace(/\s+/g, ' ').trim();
    return normalized || fallback;
}

function clampNumber(value, min, max, fallback) {
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue)) {
        return fallback;
    }
    return Math.min(max, Math.max(min, numericValue));
}

function truncateText(value, maxChars = 1200) {
    const text = normalizeText(value);
    if (!text || text.length <= maxChars) {
        return text;
    }
    return `${text.slice(0, Math.max(0, maxChars - 1))}…`;
}

function truncateStructuredText(value, maxChars = 1200) {
    const text = String(value || '')
        .replace(/\r\n/g, '\n')
        .replace(/[ \t]+$/gm, '')
        .trim();
    if (!text || text.length <= maxChars) {
        return text;
    }
    return `${text.slice(0, Math.max(0, maxChars - 1))}…`;
}

function normalizeBlockText(value, maxChars = MAX_BLOCK_CHARS) {
    const text = String(value || '')
        .replace(/\r\n/g, '\n')
        .split('\n')
        .map((line) => line.replace(/[ \t]+/g, ' ').trim())
        .filter(Boolean)
        .join('\n');
    if (text.length <= maxChars) {
        return text;
    }
    return `${text.slice(0, Math.max(0, maxChars - 1))}…`;
}

function redactSecretLikeText(value) {
    return normalizeText(value)
        .replace(/([A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,})/g, '[secret-like-token]')
        .replace(/\b(sk|ak|pk|rk|key|token)[-_]?[A-Za-z0-9]{18,}\b/gi, '[secret-like-token]')
        .replace(/\b[A-Fa-f0-9]{8}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{12}\b/g, '[secret-like-uuid]');
}

function sanitizePromptMemoryText(value) {
    let text = String(value || '')
        .replace(/<\s*(persona_output|persona_surface)\b[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, '')
        .replace(MEMORY_CONTROL_TAG_PATTERN, '');
    const protocolIndex = text.search(MEMORY_PROTOCOL_MARKER_PATTERN);
    if (protocolIndex >= 0) {
        text = text.slice(0, protocolIndex);
    }
    return normalizeText(redactSecretLikeText(text));
}

function sanitizePromptMemoryBlockText(value) {
    let text = String(value || '')
        .replace(/<\s*(persona_output|persona_surface)\b[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, '')
        .replace(MEMORY_CONTROL_TAG_PATTERN, '');
    const protocolIndex = text.search(MEMORY_PROTOCOL_MARKER_PATTERN);
    if (protocolIndex >= 0) {
        text = text.slice(0, protocolIndex);
    }
    return text
        .replace(/([A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,})/g, '[secret-like-token]')
        .replace(/\b(sk|ak|pk|rk|key|token)[-_]?[A-Za-z0-9]{18,}\b/gi, '[secret-like-token]')
        .replace(/\b[A-Fa-f0-9]{8}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{12}\b/g, '[secret-like-uuid]')
        .replace(/\r\n/g, '\n')
        .split('\n')
        .map((line) => line.replace(/[ \t]+/g, ' ').trim())
        .filter(Boolean)
        .join('\n');
}

function stemMemoryToken(value = '') {
    const token = normalizeText(value).toLowerCase();
    if (token.length <= 3 || /^\d+$/.test(token)) {
        return token;
    }
    if (token.length > 5 && token.endsWith('ies')) {
        return /[bcdfghjklmnpqrstvwxyz]ies$/.test(token)
            ? `${token.slice(0, -3)}y`
            : token.slice(0, -1);
    }
    if (token.length > 6 && token.endsWith('ing')) {
        const stemmed = token.slice(0, -3);
        return /([a-z])\1$/.test(stemmed) ? stemmed.slice(0, -1) : stemmed;
    }
    if (token.length > 5 && token.endsWith('ed')) {
        const stemmed = token.slice(0, -2);
        return /([a-z])\1$/.test(stemmed) ? stemmed.slice(0, -1) : stemmed;
    }
    if (token.length > 5 && token.endsWith('es')) {
        return /(?:s|x|z|ch|sh)es$/.test(token)
            ? token.slice(0, -2)
            : token.slice(0, -1);
    }
    if (token.length > 4 && token.endsWith('s')) {
        return token.slice(0, -1);
    }
    return token;
}

function memorySearchTokens(text, { includeStopWords = false } = {}) {
    const normalized = normalizeText(text).toLowerCase();
    const tokens = [];
    for (const rawToken of normalized.match(/[a-z0-9]+/g) || []) {
        const token = stemMemoryToken(rawToken);
        if (
            token.length >= 2 &&
            (includeStopWords || !MEMORY_SEARCH_STOP_WORDS.has(token))
        ) {
            tokens.push(token);
        }
    }
    const chineseOnly = normalized.replace(/[^\u4e00-\u9fff]/g, '');
    for (let index = 0; index < chineseOnly.length - 1; index += 1) {
        tokens.push(chineseOnly.slice(index, index + 2));
    }
    return tokens;
}

function memoryTokenFrequency(tokens = [], weight = 1, target = new Map()) {
    for (const token of tokens) {
        target.set(token, (target.get(token) || 0) + weight);
    }
    return target;
}

function memorySearchPhrases(query = '') {
    const tokens = memorySearchTokens(query);
    const phrases = [];
    for (const size of [3, 2]) {
        for (let index = 0; index <= tokens.length - size; index += 1) {
            const phrase = tokens.slice(index, index + size).join(' ');
            if (!phrases.includes(phrase)) {
                phrases.push(phrase);
            }
        }
    }
    return phrases.slice(0, 24);
}

function scoreTextAgainstQuery(text, query) {
    const queryTokens = new Set(memorySearchTokens(query));
    if (!queryTokens.size) {
        return 0;
    }
    const textTokens = new Set(memorySearchTokens(text));
    let score = 0;
    for (const token of queryTokens) {
        if (textTokens.has(token)) {
            score += token.length >= 5 ? 2 : 1;
        }
    }
    return score;
}

function truncatePromptMemoryAroundMatch(value, query, maxChars = MAX_PROMPT_EVENT_TEXT_CHARS) {
    const text = sanitizePromptMemoryText(value);
    if (!text || text.length <= maxChars) {
        return text;
    }
    const lowered = text.toLowerCase();
    const queryTokens = [...new Set(memorySearchTokens(query))]
        .filter((token) => token.length >= 3)
        .sort((left, right) => right.length - left.length);
    let matchIndex = -1;
    let matchLength = 0;
    for (const token of queryTokens) {
        const index = lowered.indexOf(token.toLowerCase());
        if (index >= 0) {
            matchIndex = index;
            matchLength = token.length;
            break;
        }
    }
    if (matchIndex < 0) {
        return truncateText(text, maxChars);
    }
    const leadingMarker = matchIndex > 0 ? '…' : '';
    const trailingMarker = matchIndex + maxChars < text.length ? '…' : '';
    const available = Math.max(1, maxChars - leadingMarker.length - trailingMarker.length);
    const desiredBefore = Math.floor((available - matchLength) * 0.38);
    const start = Math.max(0, Math.min(
        matchIndex - desiredBefore,
        text.length - available
    ));
    return `${start > 0 ? '…' : ''}${text.slice(start, start + available)}${
        start + available < text.length ? '…' : ''
    }`.slice(0, maxChars);
}

function formatPromptMemoryEvent(event = {}, query = '') {
    const userText = truncatePromptMemoryAroundMatch(
        event.userText,
        query,
        MAX_PROMPT_EVENT_TEXT_CHARS
    );
    const assistantText = truncatePromptMemoryAroundMatch(
        event.assistantText,
        query,
        MAX_PROMPT_EVENT_TEXT_CHARS
    );
    if (!userText && !assistantText) {
        return '';
    }
    const dialogue = [
        userText ? `用户：${userText}` : '',
        assistantText ? `AILIS：${assistantText}` : ''
    ].filter(Boolean).join('\n  ');
    return `- [${normalizeText(event.ts)}] ${dialogue}`;
}

function isTaskAgentMemoryEvent(event = {}) {
    const sessionId = normalizeText(event.sessionId).toLowerCase();
    const source = normalizeText(event.source).toLowerCase();
    return sessionId.includes(':task-agent:') ||
        source.includes('task-agent') ||
        source.includes('task_agent') ||
        normalizeText(event.agentRole || event.meta?.agentRole).toLowerCase() === 'task_agent';
}

function buildMemoryRetrievalQuery(message = '', messageHistory = []) {
    const currentMessage = sanitizePromptMemoryText(message);
    const recent = (Array.isArray(messageHistory) ? messageHistory : [])
        .slice(-6)
        .map((entry) => ({
            role: entry?.role === 'assistant' ? 'assistant' : 'user',
            text: sanitizePromptMemoryText(entry?.content || entry?.text || entry?.message || '')
        }))
        .filter((entry) => entry.text);
    if (currentMessage && recent.at(-1)?.role === 'user' && recent.at(-1)?.text === currentMessage) {
        recent.pop();
    }
    return [
        ...recent.map((entry) => `${entry.role}: ${entry.text}`),
        currentMessage ? `user: ${currentMessage}` : ''
    ].filter(Boolean).join('\n');
}

function ensureDirSync(dirPath) {
    fs.mkdirSync(dirPath, { recursive: true });
}

function readJsonFileSync(filePath, fallback) {
    try {
        if (!fs.existsSync(filePath)) {
            return fallback;
        }
        const raw = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
        return JSON.parse(raw || 'null') ?? fallback;
    } catch {
        return fallback;
    }
}

function atomicWriteFileSync(filePath, content) {
    ensureDirSync(path.dirname(filePath));
    const tempPath = `${filePath}.${process.pid}.${Date.now()}.tmp`;
    fs.writeFileSync(tempPath, content, 'utf8');
    const retryableCodes = new Set(['EBUSY', 'EACCES', 'EPERM']);
    for (let attempt = 0; attempt < 6; attempt += 1) {
        try {
            fs.renameSync(tempPath, filePath);
            return;
        } catch (error) {
            if (!retryableCodes.has(error?.code) || attempt >= 5) {
                throw error;
            }
            const delayMs = 20 * (2 ** attempt);
            Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, delayMs);
        }
    }
}

function atomicWriteJsonSync(filePath, value) {
    atomicWriteFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function appendJsonlSync(filePath, value) {
    ensureDirSync(path.dirname(filePath));
    fs.appendFileSync(filePath, `${JSON.stringify(value)}\n`, 'utf8');
}

function clearDirectoryContentsSync(dirPath) {
    ensureDirSync(dirPath);
    for (const entry of fs.readdirSync(dirPath, { withFileTypes: true })) {
        fs.rmSync(path.join(dirPath, entry.name), {
            recursive: true,
            force: true
        });
    }
}

function safeFileName(value) {
    const text = normalizeText(value, 'memory')
        .replace(/[<>:"/\\|?*\x00-\x1f]/g, '-')
        .replace(/\s+/g, '-')
        .slice(0, 80);
    return text || 'memory';
}

function dateKeyFromIso(iso = nowIso()) {
    return String(iso).slice(0, 10) || new Date().toISOString().slice(0, 10);
}

function getDefaultBlocks(workspaceRoot = '') {
    return {
        persona: {
            key: 'persona',
            label: 'AILIS 人设记忆',
            kind: 'core',
            value: DEFAULT_AILIS_PERSONA_TEXT,
            updatedAt: nowIso()
        },
        user: {
            key: 'user',
            label: '用户偏好记忆',
            kind: 'core',
            value: [
                '- 用户偏好直接、细致、能落地的解释；不喜欢空泛概念和过度自行发挥。',
                '- 用户偏好 AILIS 的人设和性格被稳定保留，不希望一次性任务历史污染人设记忆。',
                '- 用户偏好人物表现协议跟随新版前端：模型表达 emotion/socialTone/gestureIntent/taskState 等语义状态，由 Character Runtime 映射动作、表情、眼神和口唇；不要把老版控制标签规范写成人设核心。',
                '- 用户愿意保留本地隐私配置，希望私人助手越来越了解自己。'
            ].join('\n'),
            updatedAt: nowIso()
        },
        relationship: {
            key: 'relationship',
            label: '关系与语气记忆',
            kind: 'core',
            value: [
                '- 当前关系从熟悉协作逐渐转向亲近陪伴：用户明确给出的亲昵称呼、伴侣式称呼和相处设定，可以作为拟人化关系自然承接。',
                '- 用户重视拟人体验。普通撒娇、亲昵称呼和陪伴表达不需要防御；不要频繁免责声明，也不要把关系推回“只是助手/只是好伙伴”。好感度只调整亲近度、语气和主动性，不改变隐私、事实准确性、工具审批和基础帮助质量。'
            ].join('\n'),
            updatedAt: nowIso()
        },
        project: {
            key: 'project',
            label: '项目记忆',
            kind: 'project',
            value: [
                `- 当前项目根目录：${workspaceRoot || '未记录'}`,
                '- 产品方向：AILISCLAW/AILIS 桌面虚拟助手，保留人物体验，同时具备 Agent、视觉、语音、记忆能力。',
                '- 工程参考优先级：Codex、Claude Code、Letta/MemGPT、Generative Agents；尽量参考成熟开源实现，不完全从 0 发明。'
            ].join('\n'),
            updatedAt: nowIso()
        },
        affinity: {
            key: 'affinity',
            label: '好感度状态',
            kind: 'affinity',
            value: '- 好感度初始值 50/100。分数只影响语气亲近度、主动性和表达，不影响基本帮助能力。',
            updatedAt: nowIso()
        },
        secrets_index: {
            key: 'secrets_index',
            label: '隐私与密钥索引',
            kind: 'secrets',
            value: '- 尚未通过记忆系统登记密钥。上下文只暴露密钥名称和用途，不暴露明文。',
            updatedAt: nowIso()
        }
    };
}

function createDefaultState(workspaceRoot = '') {
    const createdAt = nowIso();
    return {
        version: MEMORY_STORE_VERSION,
        createdAt,
        updatedAt: createdAt,
        blocks: getDefaultBlocks(workspaceRoot),
        events: [],
        reflections: [],
        affinity: {
            score: DEFAULT_AFFINITY_SCORE,
            stage: 'familiarizing',
            updatedAt: createdAt,
            events: []
        },
        secrets: [],
        stats: {
            turnCount: 0,
            salientEventCount: 0,
            reflectionCount: 0
        }
    };
}

function normalizeBlock(key, block, fallbackBlock) {
    const source = block && typeof block === 'object' ? block : {};
    const fallback = fallbackBlock && typeof fallbackBlock === 'object' ? fallbackBlock : {};
    const hasSourceValue = Object.prototype.hasOwnProperty.call(source, 'value');
    return {
        key,
        label: normalizeText(source.label, fallback.label || key),
        kind: normalizeText(source.kind, fallback.kind || 'core'),
        value: normalizeBlockText(
            hasSourceValue ? source.value : fallback.value || '',
            MAX_BLOCK_CHARS
        ),
        updatedAt: normalizeText(source.updatedAt, fallback.updatedAt || nowIso())
    };
}

function normalizeState(rawState, workspaceRoot = '') {
    const fallback = createDefaultState(workspaceRoot);
    const source = rawState && typeof rawState === 'object' ? rawState : {};
    const resetLegacyAutoLearnedBlocks = Number(source.version || 0) < MEMORY_STORE_VERSION;
    const defaultBlocks = getDefaultBlocks(workspaceRoot);
    const blocks = {};
    for (const key of Object.keys(defaultBlocks)) {
        const sourceBlock = resetLegacyAutoLearnedBlocks && LEGACY_AUTO_LEARNED_BLOCK_KEYS.has(key)
            ? null
            : source.blocks?.[key];
        blocks[key] = normalizeBlock(key, sourceBlock, defaultBlocks[key]);
    }
    for (const [key, block] of Object.entries(source.blocks || {})) {
        if (!blocks[key]) {
            blocks[key] = normalizeBlock(key, block, { key, label: key, kind: 'custom', value: '' });
        }
    }

    const affinity = source.affinity && typeof source.affinity === 'object'
        ? source.affinity
        : {};
    const events = Array.isArray(source.events) ? source.events.slice(-MAX_STATE_EVENTS) : [];
    const secrets = Array.isArray(source.secrets) ? source.secrets : [];
    const reflections = Array.isArray(source.reflections) ? source.reflections.slice(-100) : [];
    return {
        version: MEMORY_STORE_VERSION,
        createdAt: normalizeText(source.createdAt, fallback.createdAt),
        updatedAt: normalizeText(source.updatedAt, fallback.updatedAt),
        blocks,
        events,
        reflections,
        affinity: {
            score: clampNumber(affinity.score, 0, 100, DEFAULT_AFFINITY_SCORE),
            stage: normalizeText(affinity.stage, 'familiarizing'),
            updatedAt: normalizeText(affinity.updatedAt, fallback.createdAt),
            events: Array.isArray(affinity.events) ? affinity.events.slice(-MAX_AFFINITY_EVENTS) : []
        },
        secrets: secrets
            .filter((secret) => secret && typeof secret === 'object')
            .map((secret) => ({
                id: normalizeText(secret.id, randomUUID()),
                name: normalizeText(secret.name, 'secret'),
                kind: normalizeText(secret.kind, 'generic'),
                description: normalizeText(secret.description),
                provider: normalizeText(secret.provider),
                protection: normalizeText(secret.protection, SECRET_PROTECTION),
                valueBase64: normalizeText(secret.valueBase64),
                createdAt: normalizeText(secret.createdAt, nowIso()),
                updatedAt: normalizeText(secret.updatedAt, nowIso())
            })),
        stats: {
            turnCount: Number(source.stats?.turnCount || 0),
            salientEventCount: Number(source.stats?.salientEventCount || 0),
            reflectionCount: Number(source.stats?.reflectionCount || 0)
        }
    };
}

function buildEventSummary(userText, assistantText) {
    const user = truncateText(redactSecretLikeText(userText), 360);
    const assistant = truncateText(redactSecretLikeText(assistantText), 360);
    if (user && assistant) {
        return `用户：${user}\nAILIS：${assistant}`;
    }
    return user || assistant || '空对话';
}

function buildAffinityStage(score) {
    if (score < 20) {
        return 'strained';
    }
    if (score < 40) {
        return 'cautious';
    }
    if (score < 61) {
        return 'familiarizing';
    }
    if (score < 80) {
        return 'trusted';
    }
    return 'close';
}

function buildAffinityBlock(affinity) {
    const score = Math.round(clampNumber(affinity.score, 0, 100, DEFAULT_AFFINITY_SCORE));
    const stage = buildAffinityStage(score);
    const toneHint =
        score < 40
            ? '用户可能正在纠正体验，少撒娇、先承认问题并快速修正。'
            : score < 61
            ? '保持温和、熟悉，可以自然承接用户偏好的亲昵称呼和轻微撒娇，但不要过度用力。'
            : score < 80
            ? '更熟悉、更自然、更有陪伴感，可以自然引用共同经历和用户偏好。'
            : '允许明显亲密、主动、轻微撒娇和更多默契表达，可以更像长期陪伴用户的私人助手。';
    return [
        `- 当前好感度：${score}/100（${stage}）。`,
        `- 语气影响：${toneHint}`,
        '- 好感度是内部游戏化数据，只影响表达风格、主动性、表情/TTS 倾向，不影响安全、隐私、事实准确性、工具审批和基础帮助质量。'
    ].join('\n');
}

function deriveCuratedAffinityScore(affinity = null) {
    if (!affinity || typeof affinity !== 'object') {
        return null;
    }
    const explicitScore = Number(affinity.score);
    if (Number.isFinite(explicitScore)) {
        return Math.round(clampNumber(explicitScore, 0, 100, DEFAULT_AFFINITY_SCORE));
    }
    const trust = clampNumber(affinity.trust, 0, 1, 0.5);
    const familiarity = clampNumber(affinity.familiarity, 0, 1, 0.5);
    const warmth = clampNumber(affinity.warmth, 0, 1, 0.5);
    const friction = clampNumber(affinity.friction, 0, 1, 0.2);
    const weighted = trust * 0.36 + familiarity * 0.3 + warmth * 0.24 - friction * 0.18;
    return Math.round(clampNumber((weighted / 0.9) * 100, 0, 100, DEFAULT_AFFINITY_SCORE));
}

function createCuratedAffinityStateFromScore(score, existing = null) {
    const nextScore = Math.round(clampNumber(score, 0, 100, DEFAULT_AFFINITY_SCORE));
    const normalized = nextScore / 100;
    const updatedAt = nowIso();
    return {
        version: 1,
        createdAt: normalizeText(existing?.createdAt, updatedAt),
        updatedAt,
        score: nextScore,
        trust: normalized,
        familiarity: normalized,
        warmth: normalized,
        friction: 0,
        repairState: 'stable',
        relationshipStage: buildAffinityStage(nextScore),
        evidenceIds: [],
        history: []
    };
}

function evidencePreview(ids = []) {
    const normalized = Array.isArray(ids) ? ids.map((id) => normalizeText(String(id))).filter(Boolean) : [];
    if (!normalized.length) {
        return '';
    }
    return `证据：${normalized.slice(0, 4).join(', ')}${normalized.length > 4 ? '…' : ''}`;
}

function confidenceLabel(value) {
    const confidence = clampNumber(value, 0, 1, 0);
    return confidence ? confidence.toFixed(2) : 'unknown';
}

function rankCuratedProfileItems(items = [], query = '', maxItems = 24) {
    const activeItems = (Array.isArray(items) ? items : [])
        .filter((item) => item && item.status !== 'inactive' && normalizeText(item.claim))
        .sort((left, right) =>
            (right.stability === 'stable' ? 1 : 0) - (left.stability === 'stable' ? 1 : 0) ||
            (Number(right.confidence) || 0) - (Number(left.confidence) || 0) ||
            String(right.updatedAt || right.lastSeen || '').localeCompare(String(left.updatedAt || left.lastSeen || ''))
        );
    const boundedLimit = Math.max(1, Number(maxItems) || 24);
    const scored = activeItems.map((item, stableRank) => ({
        item,
        stableRank,
        relevance: scoreTextAgainstQuery(
            `${normalizeText(item.category)} ${normalizeText(item.claim)}`,
            query
        )
    }));
    const relevant = scored
        .filter((entry) => entry.relevance > 0)
        .sort((left, right) =>
            right.relevance - left.relevance ||
            left.stableRank - right.stableRank
        );
    const selectedItems = new Set(relevant.map((entry) => entry.item));
    return [
        ...relevant,
        ...scored.filter((entry) => !selectedItems.has(entry.item))
    ].slice(0, boundedLimit).map((entry) => entry.item);
}

function formatCuratedProfileItems(items = [], {
    includeCategory = true,
    includeEvidence = true,
    maxItems = 24,
    query = ''
} = {}) {
    const activeItems = rankCuratedProfileItems(items, query, maxItems);
    if (!activeItems.length) {
        return '- 暂无已抽取的稳定画像。不要根据旧规则块脑补用户偏好；只根据当前请求和明确证据行动。';
    }
    return activeItems.map((item) => {
        const parts = [];
        if (includeCategory) {
            parts.push(normalizeText(item.category, 'uncategorized'));
        }
        parts.push(normalizeText(item.stability, 'candidate'));
        parts.push(`confidence=${confidenceLabel(item.confidence)}`);
        const evidence = includeEvidence ? evidencePreview(item.evidenceIds) : '';
        return `- [${parts.join(' | ')}] ${normalizeText(item.claim)}${evidence ? `（${evidence}）` : ''}`;
    }).join('\n');
}

function formatCuratedAffinityState(affinity = null) {
    if (!affinity || typeof affinity !== 'object') {
        return [
            '- 暂无 Raw Memory Ledger 抽取出的关系状态，默认采用中性、稳健、少脑补的协作语气。',
            '- 关系状态只影响表达风格、主动性和陪伴感，不影响安全、隐私、事实准确性、工具审批和基础帮助质量。'
        ].join('\n');
    }
    const trust = clampNumber(affinity.trust, 0, 1, 0.5);
    const familiarity = clampNumber(affinity.familiarity, 0, 1, 0.5);
    const warmth = clampNumber(affinity.warmth, 0, 1, 0.5);
    const friction = clampNumber(affinity.friction, 0, 1, 0.2);
    const score = deriveCuratedAffinityScore(affinity);
    const stage = normalizeText(affinity.relationshipStage, 'familiarizing');
    const repairState = normalizeText(affinity.repairState, 'stable');
    const evidence = evidencePreview(affinity.evidenceIds);
    const toneHint = friction >= 0.55 || repairState === 'recovering' || repairState === 'strained'
        ? '先解释证据、边界和风险，减少卖萌和跳步执行，优先恢复信任。'
        : trust >= 0.75 && warmth >= 0.65
            ? '可以更自然、更熟悉、更有陪伴感，但仍保持事实和执行边界。'
            : '保持温和、清晰、可靠，可以自然承接用户偏好的亲昵称呼和轻微撒娇，不要反复把关系推回普通助手。';
    return [
        Number.isFinite(score) ? `- 综合好感度：${score}/100。` : '',
        `- 关系阶段：${stage}；修复状态：${repairState}。`,
        `- 维度：trust=${trust.toFixed(2)}, familiarity=${familiarity.toFixed(2)}, warmth=${warmth.toFixed(2)}, friction=${friction.toFixed(2)}。`,
        `- 语气影响：${toneHint}`,
        evidence ? `- ${evidence}` : '- 暂无可追溯证据 id。',
        '- 关系状态是内部表达调节数据，不影响安全、隐私、事实准确性、工具审批和基础帮助质量。'
    ].filter(Boolean).join('\n');
}

function loadCuratedPromptMemory(rootDir, {
    query = '',
    includeEvidence = true
} = {}) {
    const userProfile = readJsonFileSync(path.join(rootDir, 'user-profile.json'), null);
    const relationshipProfile = readJsonFileSync(path.join(rootDir, 'relationship-profile.json'), null);
    const affinityState = readJsonFileSync(path.join(rootDir, 'affinity-state.json'), null);
    const curatorState = readJsonFileSync(path.join(rootDir, 'profile-curation-state.json'), null);
    const sourceLine = [
        '来源：Raw Memory Ledger 日级抽取。',
        curatorState?.lastRun?.iso ? `最近抽取：${curatorState.lastRun.iso}。` : '',
        curatorState?.cursor?.lastProcessedIso ? `已处理到：${curatorState.cursor.lastProcessedIso}。` : ''
    ].filter(Boolean).join(' ');
    const activeProfileItems = (Array.isArray(userProfile?.items) ? userProfile.items : [])
        .filter((item) => item && item.status !== 'inactive' && normalizeText(item.claim));
    const activeProjectItems = activeProfileItems.filter((item) => normalizeText(item.category) === 'project_memory');
    const activeRelationshipToneItems = activeProfileItems.filter((item) => normalizeText(item.category) === 'relationship_tone');
    const activeUserProfileItems = activeProfileItems.filter((item) => {
        const category = normalizeText(item.category);
        return category !== 'project_memory' && category !== 'relationship_tone';
    });
    const activeRelationshipItems = (Array.isArray(relationshipProfile?.items) ? relationshipProfile.items : [])
        .filter((item) => item && item.status !== 'inactive' && normalizeText(item.claim));
    const selectedRelationshipItems = activeRelationshipItems.length
        ? activeRelationshipItems
        : activeRelationshipToneItems;
    return {
        hasCuratedState: Boolean(curatorState),
        hasAffinityState: Boolean(affinityState),
        userProfileItemCount: activeUserProfileItems.length,
        projectProfileItemCount: activeProjectItems.length,
        relationshipItemCount: selectedRelationshipItems.length,
        userProfileText: [
            sourceLine,
            formatCuratedProfileItems(activeUserProfileItems, {
                includeCategory: true,
                includeEvidence,
                maxItems: query ? 18 : 28,
                query
            })
        ].filter(Boolean).join('\n'),
        relationshipText: [
            sourceLine,
            formatCuratedProfileItems(selectedRelationshipItems, {
                includeCategory: false,
                includeEvidence,
                maxItems: query ? 10 : 16,
                query
            })
        ].filter(Boolean).join('\n'),
        projectProfileText: [
            sourceLine,
            formatCuratedProfileItems(activeProjectItems, {
                includeCategory: true,
                includeEvidence,
                maxItems: query ? 14 : 24,
                query
            })
        ].filter(Boolean).join('\n'),
        affinityText: [
            sourceLine,
            formatCuratedAffinityState(affinityState)
        ].filter(Boolean).join('\n'),
        affinityState,
        affinityScore: deriveCuratedAffinityScore(affinityState),
        affinityStage: normalizeText(affinityState?.relationshipStage)
    };
}

function encodeSecretValue(value) {
    return Buffer.from(String(value || ''), 'utf8').toString('base64');
}

function decodeSecretValue(valueBase64) {
    try {
        return Buffer.from(String(valueBase64 || ''), 'base64').toString('utf8');
    } catch {
        return '';
    }
}

class AILISMemoryRuntime {
    constructor(options = {}) {
        this.workspaceRoot = path.resolve(options.workspaceRoot || process.cwd());
        this.rootDir = path.resolve(
            options.rootDir ||
                path.join(options.auditDir || path.join(this.workspaceRoot, '.ailis-state'), 'memory')
        );
        this.statePath = path.join(this.rootDir, 'memory-state.json');
        this.eventsPath = path.join(this.rootDir, 'events.jsonl');
        this.capsulesDir = path.join(this.rootDir, 'capsules');
        this.dailyDir = path.join(this.rootDir, 'daily');
        this.reflectionsDir = path.join(this.rootDir, 'reflections');
        this.strategyConfigPath = path.join(this.rootDir, 'memory-strategy.json');
        const storedStrategy = readJsonFileSync(this.strategyConfigPath, null)?.strategy;
        this.memoryStrategy = resolveMemoryStrategy(
            options.memoryStrategy ||
            options.strategy ||
            process.env.AILIS_MEMORY_STRATEGY ||
            storedStrategy ||
            'bm25_phrase_v1'
        );
        this.strategyEngine = options.strategyEngine || new AILISMemoryStrategyEngine({
            rootDir: this.rootDir,
            strategy: this.memoryStrategy,
            queryPlanner: options.memoryQueryPlanner || options.queryPlanner,
            embedder: options.memoryEmbedder || options.embedder,
            reranker: options.memoryReranker || options.reranker,
            enableLocalEmbeddings: options.enableLocalEmbeddings !== false,
            embeddingModel: options.embeddingModel,
            embeddingRevision:
                options.memoryEmbeddingRevision ||
                options.embeddingRevision,
            rerankerModel: options.memoryRerankerModel || options.rerankerModel,
            rerankerRevision:
                options.memoryRerankerRevision ||
                options.rerankerRevision,
            allowRemoteModels: options.allowRemoteModels,
            modelRemoteHost:
                options.memoryModelRemoteHost ||
                options.modelRemoteHost,
            modelCacheDir:
                options.memoryModelCacheDir ||
                options.modelCacheDir,
            chronosMaxAgentSteps: options.chronosMaxAgentSteps,
            observationalMessageTokens: options.observationalMessageTokens,
            observationalObservationTokens: options.observationalObservationTokens,
            observationalMaxTokensPerBatch: options.observationalMaxTokensPerBatch,
            observationalPreviousObserverTokens:
                options.observationalPreviousObserverTokens,
            observationalRawTailTokens: options.observationalRawTailTokens,
            hindsightBaseUrl: options.hindsightBaseUrl,
            hindsightAutoStart: options.hindsightAutoStart,
            hindsightPort: options.hindsightPort,
            hindsightHost: options.hindsightHost,
            hindsightProfile: options.hindsightProfile,
            hindsightBankId: options.hindsightBankId,
            hindsightEmbedPackagePath: options.hindsightEmbedPackagePath,
            hindsightClient: options.hindsightClient,
            hindsightServer: options.hindsightServer
        });
        this.state = null;
        this.loaded = false;
        this.lastError = '';
        this.initialize();
    }

    initialize() {
        try {
            ensureDirSync(this.rootDir);
            ensureDirSync(this.capsulesDir);
            ensureDirSync(this.dailyDir);
            ensureDirSync(this.reflectionsDir);
            const rawState = readJsonFileSync(this.statePath, null);
            this.backupLegacyStateBeforeMigration(rawState);
            this.state = normalizeState(rawState, this.workspaceRoot);
            this.loaded = true;
            this.lastError = '';
            this.persist('initialize');
        } catch (error) {
            this.loaded = false;
            this.lastError = error?.message || String(error);
            this.state = normalizeState(null, this.workspaceRoot);
        }
        return this.getStatus();
    }

    backupLegacyStateBeforeMigration(rawState) {
        if (!rawState || Number(rawState.version || 0) >= MEMORY_STORE_VERSION || !fs.existsSync(this.statePath)) {
            return '';
        }
        const backupDir = path.join(this.rootDir, 'backups');
        ensureDirSync(backupDir);
        const sourceVersion = Math.max(0, Number(rawState.version) || 0);
        const stamp = String(rawState.updatedAt || nowIso()).replace(/[^0-9A-Za-z]+/g, '-');
        const backupPath = path.join(backupDir, `memory-state.v${sourceVersion}.${stamp}.json`);
        if (!fs.existsSync(backupPath)) {
            fs.copyFileSync(this.statePath, backupPath);
        }
        return backupPath;
    }

    persist(reason = 'update') {
        if (!this.state) {
            return;
        }
        this.state.updatedAt = nowIso();
        this.state.blocks.affinity = {
            ...this.state.blocks.affinity,
            value: buildAffinityBlock(this.state.affinity),
            updatedAt: this.state.affinity.updatedAt || this.state.updatedAt
        };
        this.state.blocks.secrets_index = {
            ...this.state.blocks.secrets_index,
            value: this.buildSecretsIndexText(),
            updatedAt: this.state.updatedAt
        };
        atomicWriteJsonSync(this.statePath, this.state);
        this.writeCapsules(reason);
    }

    writeCapsules(_reason = 'update') {
        for (const [key, block] of Object.entries(this.state.blocks || {})) {
            const filePath = path.join(this.capsulesDir, `${safeFileName(key)}.md`);
            const content = [
                `# ${block.label || key}`,
                '',
                `- key: ${key}`,
                `- kind: ${block.kind || 'core'}`,
                `- updatedAt: ${block.updatedAt || this.state.updatedAt}`,
                '',
                block.value || ''
            ].join('\n');
            atomicWriteFileSync(filePath, `${content.trim()}\n`);
        }
    }

    getStatus() {
        const eventCount = Array.isArray(this.state?.events) ? this.state.events.length : 0;
        const blockCount = this.state?.blocks ? Object.keys(this.state.blocks).length : 0;
        const curated = loadCuratedPromptMemory(this.rootDir);
        const affinityScore = Number.isFinite(curated.affinityScore)
            ? curated.affinityScore
            : Math.round(this.state?.affinity?.score ?? DEFAULT_AFFINITY_SCORE);
        return {
            enabled: true,
            version: `v${MEMORY_STORE_VERSION}`,
            loaded: this.loaded,
            rootDir: this.rootDir,
            statePath: this.statePath,
            eventsPath: this.eventsPath,
            blockCount,
            eventCount,
            affinityScore,
            affinityStage: curated.affinityStage || buildAffinityStage(affinityScore),
            affinitySource: curated.hasAffinityState ? 'curated_capsule' : 'memory_state',
            secretCount: Array.isArray(this.state?.secrets) ? this.state.secrets.length : 0,
            memoryStrategy: this.memoryStrategy,
            memoryStrategyConfigPath: this.strategyConfigPath,
            memoryStrategyStatus: this.strategyEngine?.getStatus?.() || null,
            lastError: this.lastError
        };
    }

    buildSecretsIndexText() {
        const secrets = Array.isArray(this.state?.secrets) ? this.state.secrets : [];
        if (!secrets.length) {
            return '- 尚未通过记忆系统登记密钥。上下文只暴露密钥名称和用途，不暴露明文。';
        }
        return [
            '- 已保存以下隐私/密钥条目。只在明确需要相应工具或服务时由宿主读取明文，模型上下文不暴露明文：',
            ...secrets.map((secret) => {
                const parts = [
                    secret.name,
                    secret.kind ? `kind=${secret.kind}` : '',
                    secret.provider ? `provider=${secret.provider}` : '',
                    secret.description ? `用途：${secret.description}` : ''
                ].filter(Boolean);
                return `- ${parts.join(' | ')}`;
            })
        ].join('\n');
    }

    getSnapshot({ includeEvents = true, sessionId = '', eventLimit = 30 } = {}) {
        const curated = loadCuratedPromptMemory(this.rootDir);
        const blocks = Object.values(this.state?.blocks || {}).map((block) => ({ ...block }));
        const blockByKey = Object.fromEntries(blocks.map((block) => [block.key, block]));
        const mergeBlockValue = (key, additions = []) => {
            const block = blockByKey[key];
            if (!block) {
                return;
            }
            block.value = [
                sanitizePromptMemoryBlockText(block.value || ''),
                ...additions.filter(Boolean)
            ].filter(Boolean).join('\n\n');
        };
        mergeBlockValue('user', curated.userProfileItemCount ? [curated.userProfileText] : []);
        mergeBlockValue('relationship', [
            curated.relationshipItemCount ? curated.relationshipText : '',
            curated.hasAffinityState ? curated.affinityText : ''
        ]);
        mergeBlockValue('project', curated.projectProfileItemCount ? [curated.projectProfileText] : []);
        if (blockByKey.affinity && curated.hasAffinityState) {
            blockByKey.affinity.value = curated.affinityText;
        }
        const normalizedSessionId = normalizeText(sessionId);
        const recentEvents = (this.state?.events || [])
            .filter((event) => !normalizedSessionId || normalizeText(event.sessionId) === normalizedSessionId)
            .slice(-Math.max(1, Math.min(Number(eventLimit) || 30, MAX_STATE_EVENTS)));
        return {
            ok: true,
            status: this.getStatus(),
            affinity: curated.hasAffinityState
                ? { ...(curated.affinityState || {}), score: curated.affinityScore }
                : { ...(this.state?.affinity || {}) },
            blocks,
            recentEvents: includeEvents ? recentEvents : [],
            reflections: (this.state?.reflections || []).slice(-20),
            secrets: this.listSecrets().secrets
        };
    }

    listMemories(options = {}) {
        return this.getSnapshot(options);
    }

    getContextSources({
        sessionId = 'main',
        message = '',
        messageHistory = [],
        contextMode = 'persona'
    } = {}) {
        const state = this.state || normalizeState(null, this.workspaceRoot);
        const retrievalQuery = buildMemoryRetrievalQuery(message, messageHistory);
        const searchResult = this.searchMemory(retrievalQuery, {
            limit: DEFAULT_RELEVANT_EVENT_LIMIT
        });
        return this.buildContextSources({
            state,
            sessionId,
            contextMode,
            retrievalQuery,
            searchResult
        });
    }

    async getContextSourcesAsync({
        sessionId = 'main',
        message = '',
        messageHistory = [],
        contextMode = 'persona',
        questionTime = ''
    } = {}) {
        const state = this.state || normalizeState(null, this.workspaceRoot);
        const retrievalQuery = buildMemoryRetrievalQuery(message, messageHistory);
        const searchResult = await this.searchMemoryAsync(retrievalQuery, {
            limit: DEFAULT_RELEVANT_EVENT_LIMIT,
            questionTime
        });
        return this.buildContextSources({
            state,
            sessionId,
            contextMode,
            retrievalQuery,
            searchResult
        });
    }

    buildContextSources({
        state,
        sessionId = 'main',
        contextMode = 'persona',
        retrievalQuery = '',
        searchResult = null
    } = {}) {
        const blocks = state?.blocks || {};
        const curated = loadCuratedPromptMemory(this.rootDir, {
            query: retrievalQuery,
            includeEvidence: false
        });
        const relevantEvents = (searchResult?.events || [])
            .filter((event) => !isTaskAgentMemoryEvent(event));
        const strategyProfile = searchResult?.profile || {};
        const recommendedRelevantMemoryTokens = Math.max(
            0,
            Number(strategyProfile.contextBudgetTokens) || 0
        );
        const taskAgentMode = normalizeText(contextMode, 'persona').toLowerCase() === 'task_agent';
        const strategyContextText = sanitizePromptMemoryBlockText(searchResult?.contextText || '');
        const relevantLines = strategyContextText
            ? [strategyContextText]
            : relevantEvents
                .map((event) => formatPromptMemoryEvent(event, retrievalQuery))
                .filter(Boolean);
        return {
            contextMode: taskAgentMode ? 'task_agent' : 'persona',
            personaText: taskAgentMode ? '' : sanitizePromptMemoryBlockText(blocks.persona?.value || ''),
            userText: [
                sanitizePromptMemoryBlockText(blocks.user?.value || ''),
                curated.userProfileItemCount ? curated.userProfileText : ''
            ].filter(Boolean).join('\n\n'),
            relationshipText: taskAgentMode
                ? ''
                : [
                    sanitizePromptMemoryBlockText(blocks.relationship?.value || ''),
                    curated.relationshipItemCount ? curated.relationshipText : ''
                ].filter(Boolean).join('\n\n'),
            affinityText: taskAgentMode ? '' : curated.affinityText,
            projectText: [
                sanitizePromptMemoryBlockText(blocks.project?.value || ''),
                curated.projectProfileItemCount ? curated.projectProfileText : ''
            ].filter(Boolean).join('\n\n'),
            secretIndexText: sanitizePromptMemoryBlockText(
                blocks.secrets_index?.value || this.buildSecretsIndexText()
            ),
            relevantMemoriesText: relevantLines.join('\n'),
            personaRefs: blocks.persona ? ['memory:block:persona'] : [],
            userRefs: [
                ...(blocks.user ? ['memory:block:user'] : []),
                ...(curated.userProfileItemCount ? ['memory:capsule:user-profile'] : [])
            ],
            relationshipRefs: taskAgentMode ? [] : [
                ...(blocks.relationship ? ['memory:block:relationship'] : []),
                ...(curated.relationshipItemCount ? ['memory:capsule:relationship-profile'] : []),
                ...(curated.hasAffinityState ? ['memory:capsule:affinity-state'] : [])
            ],
            projectRefs: [
                ...(blocks.project ? ['memory:block:project'] : []),
                ...(curated.projectProfileItemCount ? ['memory:capsule:user-profile#project_memory'] : [])
            ],
            secretRefs: blocks.secrets_index ? ['memory:block:secrets_index'] : [],
            relevantMemoryRefs: relevantEvents.map((event) => event.id).filter(Boolean),
            retrievalQueryChars: retrievalQuery.length,
            relevantMemoryCount: relevantLines.length,
            memoryStrategy: searchResult?.strategy || this.memoryStrategy,
            memoryStrategyDiagnostics: searchResult?.diagnostics || null,
            recommendedSectionBudgets: recommendedRelevantMemoryTokens
                ? { relevant_memories: recommendedRelevantMemoryTokens }
                : null,
            recommendedMaxChars: recommendedRelevantMemoryTokens
                ? Math.max(
                    MAX_CONTEXT_CHARS,
                    recommendedRelevantMemoryTokens * 4 + 32_000
                )
                : 0,
            sessionId
        };
    }

    compileContext({
        sessionId = 'main',
        message = '',
        messageHistory = [],
        maxChars = MAX_CONTEXT_CHARS,
        contextMode = 'persona'
    } = {}) {
        const { AILISContextCompiler } = require('./ailis-context-compiler.cjs');
        return new AILISContextCompiler({ memoryRuntime: this }).compile({
            sessionId,
            currentUserMessage: message,
            sessionRecentTurns: messageHistory,
            agentMode: normalizeText(contextMode, 'persona').toLowerCase(),
            maxChars
        }).asDeveloperInstruction();
    }

    async compileContextAsync({
        sessionId = 'main',
        message = '',
        messageHistory = [],
        maxChars = MAX_CONTEXT_CHARS,
        contextMode = 'persona',
        questionTime = ''
    } = {}) {
        const { AILISContextCompiler } = require('./ailis-context-compiler.cjs');
        const memorySources = await this.getContextSourcesAsync({
            sessionId,
            message,
            messageHistory,
            contextMode,
            questionTime
        });
        return new AILISContextCompiler({ memoryRuntime: this }).compile({
            sessionId,
            currentUserMessage: message,
            sessionRecentTurns: messageHistory,
            agentMode: normalizeText(contextMode, 'persona').toLowerCase(),
            memorySources,
            sectionBudgets: memorySources?.recommendedSectionBudgets || {},
            maxChars: Number(memorySources?.recommendedMaxChars) || maxChars
        }).asDeveloperInstruction();
    }

    getRecentSessionEvents(sessionId = 'main', { limit = DEFAULT_RECENT_SESSION_EVENT_LIMIT } = {}) {
        const normalizedSessionId = normalizeText(sessionId, 'main');
        const boundedLimit = Math.max(1, Math.min(Number(limit) || DEFAULT_RECENT_SESSION_EVENT_LIMIT, 30));
        return (this.state?.events || [])
            .filter((event) => normalizeText(event.sessionId, 'main') === normalizedSessionId)
            .slice(-boundedLimit)
            .map((event) => ({ ...event }));
    }

    searchMemory(query, { limit = 10, strategy = this.memoryStrategy, questionTime = '' } = {}) {
        const resolvedStrategy = resolveMemoryStrategy(strategy, this.memoryStrategy);
        if (resolvedStrategy !== 'bm25_phrase_v1') {
            try {
                return this.strategyEngine.searchSync({
                    query,
                    events: this.state?.events || [],
                    limit,
                    strategy: resolvedStrategy,
                    questionTime
                });
            } catch (error) {
                if (error?.code !== 'async_full_memory_required') {
                    throw error;
                }
                const fallback = this.searchMemory(query, {
                    limit,
                    strategy: 'bm25_phrase_v1',
                    questionTime
                });
                return {
                    ...fallback,
                    requestedStrategy: resolvedStrategy,
                    diagnostics: {
                        ...(fallback.diagnostics || {}),
                        mode: 'sync_sparse_fallback',
                        requestedStrategy: resolvedStrategy
                    }
                };
            }
        }
        const normalizedQuery = normalizeText(query);
        const sourceEvents = Array.isArray(this.state?.events) ? this.state.events : [];
        const boundedLimit = Math.max(1, Number(limit) || 10);
        const queryTokens = [...new Set(memorySearchTokens(normalizedQuery))];
        const queryPhrases = memorySearchPhrases(normalizedQuery);
        const documents = sourceEvents.map((event, index) => {
            const userTokens = memorySearchTokens(event.userText);
            const assistantTokens = memorySearchTokens(event.assistantText);
            const tagTokens = memorySearchTokens(
                Array.isArray(event.tags) ? event.tags.join(' ') : ''
            );
            const frequencies = new Map();
            memoryTokenFrequency(userTokens, 1.15, frequencies);
            memoryTokenFrequency(assistantTokens, 1, frequencies);
            memoryTokenFrequency(tagTokens, 1.4, frequencies);
            const orderedTokens = [...userTokens, ...assistantTokens, ...tagTokens];
            return {
                event,
                index,
                frequencies,
                tokenSet: new Set(orderedTokens),
                orderedTokenText: ` ${orderedTokens.join(' ')} `,
                length: Math.max(1, userTokens.length + assistantTokens.length + tagTokens.length)
            };
        });
        const documentFrequency = new Map();
        for (const document of documents) {
            for (const token of document.tokenSet) {
                documentFrequency.set(token, (documentFrequency.get(token) || 0) + 1);
            }
        }
        const averageLength = documents.length
            ? documents.reduce((sum, document) => sum + document.length, 0) / documents.length
            : 1;
        const corpusSize = Math.max(1, documents.length);
        const scored = documents
            .map((document) => {
                let relevance = 0;
                for (const token of queryTokens) {
                    const frequency = Number(document.frequencies.get(token)) || 0;
                    if (!frequency) {
                        continue;
                    }
                    const containingDocuments = Number(documentFrequency.get(token)) || 0;
                    const inverseDocumentFrequency = Math.log(
                        1 + (corpusSize - containingDocuments + 0.5) /
                            (containingDocuments + 0.5)
                    );
                    const lengthNormalization = MEMORY_SEARCH_BM25_K1 * (
                        1 - MEMORY_SEARCH_BM25_B +
                        MEMORY_SEARCH_BM25_B * document.length / Math.max(1, averageLength)
                    );
                    relevance += inverseDocumentFrequency *
                        (frequency * (MEMORY_SEARCH_BM25_K1 + 1)) /
                        (frequency + lengthNormalization);
                    if (/^\d+$/.test(token)) {
                        relevance += inverseDocumentFrequency * 0.45;
                    }
                }
                for (const phrase of queryPhrases) {
                    if (document.orderedTokenText.includes(` ${phrase} `)) {
                        relevance += phrase.split(' ').length * 0.28;
                    }
                }
                const recency = document.index / Math.max(1, sourceEvents.length - 1);
                const importance = Math.max(0, Number(document.event.importance) || 0);
                return {
                    event: document.event,
                    index: document.index,
                    relevance,
                    score: relevance + recency * 0.08 + importance * 0.02
                };
            })
            .filter((entry) => !normalizedQuery || !queryTokens.length || entry.relevance > 0)
            .sort((left, right) =>
                right.score - left.score ||
                right.index - left.index
            );
        const selected = [];
        const deferred = [];
        const sessionCounts = new Map();
        for (const entry of scored) {
            const sessionId = normalizeText(entry.event?.sessionId, `event:${entry.index}`);
            const sessionCount = sessionCounts.get(sessionId) || 0;
            if (sessionCount >= MEMORY_SEARCH_MAX_EVENTS_PER_SESSION) {
                deferred.push(entry);
                continue;
            }
            selected.push(entry);
            sessionCounts.set(sessionId, sessionCount + 1);
            if (selected.length >= boundedLimit) {
                break;
            }
        }
        if (selected.length < boundedLimit) {
            const selectedIds = new Set(selected.map((entry) => entry.event?.id));
            for (const entry of deferred) {
                if (selectedIds.has(entry.event?.id)) {
                    continue;
                }
                selected.push(entry);
                if (selected.length >= boundedLimit) {
                    break;
                }
            }
        }
        const events = selected.map((entry) => entry.event);
        return {
            ok: true,
            query: normalizedQuery,
            events,
            strategy: 'bm25_phrase_v1'
        };
    }

    async searchMemoryAsync(query, {
        limit = 10,
        strategy = this.memoryStrategy,
        questionTime = '',
        maxContextChars = 0
    } = {}) {
        const resolvedStrategy = resolveMemoryStrategy(strategy, this.memoryStrategy);
        if (resolvedStrategy === 'bm25_phrase_v1') {
            return this.searchMemory(query, {
                limit,
                strategy: resolvedStrategy,
                questionTime
            });
        }
        return this.strategyEngine.search({
            query,
            events: this.state?.events || [],
            limit,
            strategy: resolvedStrategy,
            questionTime,
            maxContextChars: Math.max(
                0,
                Number(maxContextChars) ||
                Number(MEMORY_STRATEGIES[resolvedStrategy]?.contextBudgetTokens) * 4 ||
                12_000
            )
        });
    }

    async curateStrategyMemory({ maxBatches = 12, ...options } = {}) {
        const result = await this.strategyEngine?.curateStrategy?.({
            events: this.state?.events || [],
            maxBatches,
            ...options
        });
        return result;
    }

    async shutdown() {
        await this.strategyEngine?.shutdown?.();
    }

    setMemoryStrategy(strategy) {
        this.memoryStrategy = resolveMemoryStrategy(strategy, this.memoryStrategy);
        this.strategyEngine.setStrategy(this.memoryStrategy);
        atomicWriteJsonSync(this.strategyConfigPath, {
            version: 1,
            strategy: this.memoryStrategy,
            updatedAt: nowIso()
        });
        return {
            ok: true,
            strategy: this.memoryStrategy,
            status: this.strategyEngine.getStatus()
        };
    }

    getMemoryStrategyCatalog() {
        return strategyCatalog();
    }

    recordTurn({
        sessionId = 'main',
        userMessage = '',
        assistantMessage = '',
        source = 'agent',
        result = null,
        messageHistory = [],
        attachments = [],
        occurredAt = ''
    } = {}) {
        const userText = redactSecretLikeText(userMessage);
        const assistantText = redactSecretLikeText(assistantMessage || result?.displayText || result?.finalAnswer || '');
        if (!userText && !assistantText) {
            return { ok: false, status: 'empty_turn' };
        }

        const ts = normalizeOccurredAt(occurredAt);
        const event = {
            id: randomUUID(),
            ts,
            sessionId: normalizeText(sessionId, 'main'),
            source: normalizeText(source, 'agent'),
            type: 'turn',
            userText: truncateText(userText, 1200),
            assistantText: truncateText(assistantText, 1200),
            summary: buildEventSummary(userText, assistantText),
            tags: [],
            importance: 1,
            valence: 0,
            attachments: Array.isArray(attachments)
                ? attachments.map((attachment) => ({
                      type: normalizeText(attachment.type, 'attachment'),
                      id: normalizeText(attachment.id),
                      source: normalizeText(attachment.source),
                      label: normalizeText(attachment.label),
                      mimeType: normalizeText(attachment.mimeType),
                      width: Number(attachment.width) || 0,
                      height: Number(attachment.height) || 0
                  })).slice(0, 5)
                : [],
            resultStatus: normalizeText(result?.status),
            resultIntent: normalizeText(result?.intent)
        };

        this.state.events.push(event);
        this.state.events = this.state.events.slice(-MAX_STATE_EVENTS);
        this.state.stats.turnCount += 1;
        appendJsonlSync(this.eventsPath, event);
        this.writeDailyNote(event, messageHistory);
        this.persist('record_turn');
        return { ok: true, event };
    }

    writeDailyNote(event, messageHistory = []) {
        const day = dateKeyFromIso(event.ts);
        const filePath = path.join(this.dailyDir, `${day}.md`);
        const existing = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : `# ${day}\n\n`;
        const historyHint = Array.isArray(messageHistory) && messageHistory.length
            ? `\n- 上下文消息数：${messageHistory.length}`
            : '';
        const entry = [
            `## ${event.ts}`,
            '',
            `- session: ${event.sessionId}`,
            `- tags: ${(event.tags || []).join(', ') || 'none'}`,
            `- importance: ${event.importance}`,
            historyHint.trim(),
            '',
            event.summary
        ].filter(Boolean).join('\n');
        atomicWriteFileSync(filePath, `${existing.trim()}\n\n${entry.trim()}\n`);
    }

    updateBlock(key, value) {
        const normalizedKey = normalizeText(key);
        if (!normalizedKey) {
            return { ok: false, status: 'invalid_key', error: 'memory block key is required' };
        }
        const existing = this.state.blocks[normalizedKey] || {
            key: normalizedKey,
            label: normalizedKey,
            kind: 'custom',
            value: '',
            updatedAt: nowIso()
        };
        this.state.blocks[normalizedKey] = {
            ...existing,
            value: normalizeBlockText(value, MAX_BLOCK_CHARS),
            updatedAt: nowIso()
        };
        this.persist('update_block');
        return { ok: true, block: { ...this.state.blocks[normalizedKey] } };
    }

    forgetMemory({ id = '', type = 'event', key = '' } = {}) {
        const normalizedType = normalizeText(type, 'event');
        const normalizedId = normalizeText(id || key);
        if (!normalizedId) {
            return { ok: false, status: 'invalid_id', error: 'memory id/key is required' };
        }
        if (normalizedType === 'block') {
            if (!this.state.blocks[normalizedId]) {
                return { ok: false, status: 'not_found' };
            }
            delete this.state.blocks[normalizedId];
            this.persist('forget_block');
            return { ok: true, status: 'deleted' };
        }
        const before = this.state.events.length;
        this.state.events = this.state.events.filter((event) => event.id !== normalizedId);
        if (before === this.state.events.length) {
            return { ok: false, status: 'not_found' };
        }
        this.strategyEngine?.forgetSourceEvent?.(normalizedId);
        this.persist('forget_event');
        return { ok: true, status: 'deleted' };
    }

    resetAffinity(score = DEFAULT_AFFINITY_SCORE) {
        const nextScore = clampNumber(score, 0, 100, DEFAULT_AFFINITY_SCORE);
        this.state.affinity = {
            score: nextScore,
            stage: buildAffinityStage(nextScore),
            updatedAt: nowIso(),
            events: []
        };
        const affinityPath = path.join(this.rootDir, 'affinity-state.json');
        const existingCuratedAffinity = readJsonFileSync(affinityPath, null);
        const curatedAffinity = createCuratedAffinityStateFromScore(nextScore, existingCuratedAffinity);
        atomicWriteJsonSync(affinityPath, curatedAffinity);
        this.persist('reset_affinity');
        return {
            ok: true,
            affinity: {
                ...curatedAffinity,
                legacyScore: nextScore
            }
        };
    }

    clearMemory({ preserveSecrets = true } = {}) {
        const secrets = preserveSecrets === false
            ? []
            : (this.state?.secrets || []).map((secret) => ({ ...secret }));
        clearDirectoryContentsSync(this.capsulesDir);
        clearDirectoryContentsSync(this.dailyDir);
        clearDirectoryContentsSync(this.reflectionsDir);
        atomicWriteFileSync(this.eventsPath, '');
        this.state = createDefaultState(this.workspaceRoot);
        this.state.secrets = secrets;
        const clearedAt = nowIso();
        atomicWriteJsonSync(path.join(this.rootDir, 'user-profile.json'), {
            version: 1,
            createdAt: clearedAt,
            updatedAt: clearedAt,
            items: []
        });
        atomicWriteJsonSync(path.join(this.rootDir, 'relationship-profile.json'), {
            version: 1,
            createdAt: clearedAt,
            updatedAt: clearedAt,
            items: []
        });
        atomicWriteJsonSync(
            path.join(this.rootDir, 'affinity-state.json'),
            createCuratedAffinityStateFromScore(DEFAULT_AFFINITY_SCORE)
        );
        atomicWriteJsonSync(
            path.join(this.rootDir, MEMORY_COGNITION_FILE),
            defaultCognitionState()
        );
        this.strategyEngine?.clearDerivedMemory?.();
        this.persist('clear_memory');
        return {
            ok: true,
            status: 'cleared',
            preservedSecretCount: secrets.length,
            statusSnapshot: this.getStatus()
        };
    }

    saveSecret({ name = '', kind = 'generic', value = '', description = '', provider = '' } = {}) {
        const normalizedName = normalizeText(name);
        const normalizedValue = String(value || '');
        if (!normalizedName || !normalizedValue) {
            return { ok: false, status: 'invalid_secret', error: 'secret name and value are required' };
        }
        const now = nowIso();
        const existing = this.state.secrets.find((secret) => secret.name === normalizedName);
        const secret = {
            id: existing?.id || randomUUID(),
            name: normalizedName,
            kind: normalizeText(kind, 'generic'),
            description: normalizeText(description),
            provider: normalizeText(provider),
            protection: SECRET_PROTECTION,
            valueBase64: encodeSecretValue(normalizedValue),
            createdAt: existing?.createdAt || now,
            updatedAt: now
        };
        this.state.secrets = [
            ...this.state.secrets.filter((entry) => entry.name !== normalizedName),
            secret
        ];
        this.persist('save_secret');
        return { ok: true, secret: this.redactSecret(secret) };
    }

    redactSecret(secret) {
        return {
            id: secret.id,
            name: secret.name,
            kind: secret.kind,
            description: secret.description,
            provider: secret.provider,
            protection: secret.protection,
            configured: Boolean(secret.valueBase64),
            createdAt: secret.createdAt,
            updatedAt: secret.updatedAt
        };
    }

    listSecrets() {
        return {
            ok: true,
            secrets: (this.state?.secrets || []).map((secret) => this.redactSecret(secret))
        };
    }

    getSecret(name) {
        const normalizedName = normalizeText(name);
        const secret = (this.state?.secrets || []).find((entry) => entry.name === normalizedName);
        if (!secret) {
            return { ok: false, status: 'not_found' };
        }
        return {
            ok: true,
            secret: {
                ...this.redactSecret(secret),
                value: decodeSecretValue(secret.valueBase64)
            }
        };
    }

    deleteSecret(name) {
        const normalizedName = normalizeText(name);
        const before = this.state.secrets.length;
        this.state.secrets = this.state.secrets.filter((secret) => secret.name !== normalizedName);
        if (before === this.state.secrets.length) {
            return { ok: false, status: 'not_found' };
        }
        this.persist('delete_secret');
        return { ok: true, status: 'deleted' };
    }
}

module.exports = {
    AILISMemoryRuntime,
    MEMORY_STORE_VERSION,
    buildAffinityStage,
    redactSecretLikeText
};
