const fs = require('fs');
const path = require('path');
const { randomUUID } = require('crypto');

const MEMORY_STORE_VERSION = 1;
const DEFAULT_AFFINITY_SCORE = 50;
const MAX_BLOCK_CHARS = 2200;
const MAX_CONTEXT_CHARS = 20000;
const MAX_STATE_EVENTS = 500;
const MAX_AFFINITY_EVENTS = 200;
const DEFAULT_RELEVANT_EVENT_LIMIT = 24;
const SECRET_PROTECTION = 'local-file-base64';
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

function hasStablePreferenceSignal(text) {
    const normalized = normalizeText(text);
    return /偏好|我喜欢|我不喜欢|我希望|希望你|以后|记住|人设|角色|性格|语气|说话|表达|撒娇|俏皮|软萌|可爱|工具化|工具感|死模板|死文本|客服|生硬|直接|细致|落地|空泛|自行发挥|隐私|密钥|本地|用户偏好记忆/.test(normalized);
}

function looksLikeOneOffTask(text) {
    const normalized = normalizeText(text);
    return /https?:\/\/|输出.*\.(md|txt|json|js|py|docx|xlsx|pdf)|保存成|生成.*文件|帮我读|帮我查|分析.*项目|提交到|运行|测试|截图|打开|邮件|GitHub|Playwright|arxiv|论文/i.test(normalized);
}

function hasExplicitPersistentPreference(text) {
    const normalized = normalizeText(text);
    return /以后记住|请记住|记住|我希望|希望你|以后|必须|不要|自我修改|自我进化|自我迭代|用户偏好|长期偏好/.test(normalized);
}

function appendUniqueBullet(bullets, bullet) {
    const normalized = normalizeText(bullet);
    if (normalized && !bullets.includes(normalized)) {
        bullets.push(normalized);
    }
}

function buildUserPreferenceBullets(userText) {
    const user = normalizeText(userText);
    if (!user || !hasStablePreferenceSignal(user)) {
        return [];
    }

    const bullets = [];
    if (/普通女孩子|普通女生|可爱的虚拟助手|名字固定|AILIS|人工智能|编程|网络搜索|信息查询|邮件管理|命令行控制/.test(user) &&
        /人设|角色|身份|性格|虚拟助手|普通女/.test(user)) {
        appendUniqueBullet(
            bullets,
            '用户偏好 AILIS 的基础人设：名字固定为 AILIS，身份是普通女孩子；既能以普通女生视角轻松互动，也具备 AI、编程、网络搜索、信息查询、邮件管理、命令行控制等专业能力。'
        );
    }
    if (/活泼|亲切|软萌|可爱|轻快|自然|俏皮|撒娇|生活化/.test(user)) {
        appendUniqueBullet(
            bullets,
            '用户偏好 AILIS 的性格与语气：活泼亲切、软萌可爱、轻快自然、生活化，可以偶尔小撒娇和小俏皮，但不要夸张或刻意。'
        );
    }
    if (/前端|渲染|人物渲染|表现层|persona_output|persona_surface|Character Runtime|动作|表情|口唇|旧.*人设|老版本|控制指令|\[action:|\[expression:/i.test(user)) {
        appendUniqueBullet(
            bullets,
            '用户偏好人物表现协议跟随新版前端：模型表达 emotion/socialTone/gestureIntent/taskState 等语义状态，由 Character Runtime 映射动作、表情、眼神和口唇；不要把老版控制标签规范写成人设核心。'
        );
    }
    if (/直接|细致|落地|空泛|自行发挥/.test(user)) {
        appendUniqueBullet(
            bullets,
            '用户偏好解释方式：直接、细致、能落地；不喜欢空泛概念和过度自行发挥。'
        );
    }
    if (/工具化|工具感|死模板|死文本|客服|生硬|表现层|拟人/.test(user)) {
        appendUniqueBullet(
            bullets,
            '用户偏好交互体验：避免过度工具化、工具日志感、客服感、死模板和生硬表达；任务执行过程和结果也要经过拟人表现层。'
        );
    }
    if (/用户偏好记忆|对话数据|任务请求|真正.*用户偏好|人设|人物性格/.test(user) && /记忆/.test(user)) {
        appendUniqueBullet(
            bullets,
            '用户偏好记忆口径：用户偏好应提取稳定的人设、人物性格、语气和交互偏好，不应把一次性任务指令、URL 或文件产物名直接写成偏好。'
        );
    }
    if (/隐私|密钥|key|token|本地|账号|授权码/i.test(user) && /保留|保存|存储|可以|愿意|希望/.test(user)) {
        appendUniqueBullet(
            bullets,
            '用户愿意把私人助手所需的隐私配置和授权信息保存在本地，希望 AILIS 随使用逐渐更了解自己。'
        );
    }

    if (!bullets.length && (hasExplicitPersistentPreference(user) || !looksLikeOneOffTask(user))) {
        appendUniqueBullet(bullets, `用户表达了稳定偏好：${truncateText(user, 180)}`);
    }
    return bullets;
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

function ensureDirSync(dirPath) {
    fs.mkdirSync(dirPath, { recursive: true });
}

function readJsonFileSync(filePath, fallback) {
    try {
        if (!fs.existsSync(filePath)) {
            return fallback;
        }
        return JSON.parse(fs.readFileSync(filePath, 'utf8') || 'null') ?? fallback;
    } catch {
        return fallback;
    }
}

function atomicWriteFileSync(filePath, content) {
    ensureDirSync(path.dirname(filePath));
    const tempPath = `${filePath}.${process.pid}.${Date.now()}.tmp`;
    fs.writeFileSync(tempPath, content, 'utf8');
    fs.renameSync(tempPath, filePath);
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
                '- 当前关系从熟悉协作开始：要有陪伴感，但不能装作越界的真实情感。',
                '- 用户重视拟人体验，好感度用于调整亲近度、语气和主动性，而不是绕过安全边界。'
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
    return {
        key,
        label: normalizeText(source.label, fallback.label || key),
        kind: normalizeText(source.kind, fallback.kind || 'core'),
        value: normalizeBlockText(source.value || fallback.value || '', MAX_BLOCK_CHARS),
        updatedAt: normalizeText(source.updatedAt, fallback.updatedAt || nowIso())
    };
}

function normalizeState(rawState, workspaceRoot = '') {
    const fallback = createDefaultState(workspaceRoot);
    const source = rawState && typeof rawState === 'object' ? rawState : {};
    const defaultBlocks = getDefaultBlocks(workspaceRoot);
    const blocks = {};
    for (const key of Object.keys(defaultBlocks)) {
        blocks[key] = normalizeBlock(key, source.blocks?.[key], defaultBlocks[key]);
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

function keywordSet(text) {
    const normalized = normalizeText(text).toLowerCase();
    const tokens = new Set();
    for (const token of normalized.match(/[a-z0-9_./:-]{2,}/g) || []) {
        tokens.add(token);
    }
    const knownChinese = [
        '记忆', '好感度', '语气', '拟人', '视觉', '截图', '语音', '口唇', '表情', '动作',
        '架构', '设计', '代码', '工程', '稳定', '延迟', '模型', '工具', '权限', '确认',
        'codex', 'claude', 'letta', 'memgpt', 'generative', 'openclaw', 'ailis',
        'cosyvoice', 'kokoro', 'elevenlabs', 'mcp', 'subagent', 'agent', 'asr'
    ];
    for (const keyword of knownChinese) {
        if (normalized.includes(keyword.toLowerCase())) {
            tokens.add(keyword.toLowerCase());
        }
    }
    const chineseOnly = normalized.replace(/[^\u4e00-\u9fff]/g, '');
    for (let index = 0; index < chineseOnly.length - 1; index += 1) {
        tokens.add(chineseOnly.slice(index, index + 2));
    }
    return tokens;
}

function scoreTextAgainstQuery(text, query) {
    const queryTokens = keywordSet(query);
    if (!queryTokens.size) {
        return 0;
    }
    const textTokens = keywordSet(text);
    let score = 0;
    for (const token of queryTokens) {
        if (textTokens.has(token)) {
            score += token.length >= 4 ? 2 : 1;
        }
    }
    return score;
}

function classifyTurn({ userText, assistantText }) {
    const user = normalizeText(userText);
    const assistant = normalizeText(assistantText);
    const combined = `${user}\n${assistant}`;
    const tags = [];
    let importance = 2;
    let affinityDelta = 0;
    let valence = 0;

    const addTag = (tag) => {
        if (!tags.includes(tag)) {
            tags.push(tag);
        }
    };

    if (buildUserPreferenceBullets(user).length) {
        importance += 3;
        addTag('preference');
    }
    if (/AILIS|AILIS|AILIS|OpenClaw|Agent|Codex|Claude|Letta|MemGPT|Generative|视觉|截图|语音|记忆|好感度|MCP|Subagent|Kokoro|CosyVoice|ElevenLabs|ASR/i.test(combined)) {
        importance += 2;
        addTag('project');
    }
    if (/不错|可以|很好|很棒|满意|有效|没问题|已经不错|挺像|接受|喜欢/.test(user)) {
        affinityDelta += 1;
        valence += 1;
        addTag('positive_feedback');
    }
    if (/不对|错了|太丑|不行|更差|问题|BUG|bug|回退|延迟|卡|失败|不稳定|别这样|不要这样/.test(user)) {
        affinityDelta -= 1;
        valence -= 1;
        importance += 1;
        addTag('correction');
    }
    if (/拟人|温和|柔弱|二次元|语气|陪伴|好感度|留存|私人助手|个人助手/.test(combined)) {
        importance += 1;
        addTag('relationship');
    }
    if (/密钥|key|token|隐私|本地|保存|账号|密码/i.test(combined)) {
        importance += 1;
        addTag('privacy');
    }

    return {
        tags,
        importance: Math.min(10, Math.max(1, importance)),
        affinityDelta: Math.max(-3, Math.min(3, affinityDelta)),
        valence: Math.max(-3, Math.min(3, valence))
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

function appendBulletToBlock(block, bullet, maxChars = MAX_BLOCK_CHARS) {
    const normalizedBullet = normalizeText(bullet);
    if (!normalizedBullet) {
        return block;
    }
    const line = normalizedBullet.startsWith('- ') ? normalizedBullet : `- ${normalizedBullet}`;
    const lines = normalizeBlockText(block.value, maxChars * 2)
        .split(/\n+/)
        .map((entry) => entry.trim())
        .filter(Boolean);
    if (lines.some((entry) => entry === line)) {
        return block;
    }
    lines.push(line);
    let nextValue = lines.join('\n');
    while (nextValue.length > maxChars && lines.length > 1) {
        lines.shift();
        nextValue = lines.join('\n');
    }
    return {
        ...block,
        value: nextValue,
        updatedAt: nowIso()
    };
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
            ? '保持温和、熟悉但不过分亲密，重点把事情做好。'
            : score < 80
            ? '更熟悉、更自然、更有陪伴感，可以自然引用共同经历和用户偏好。'
            : '允许明显亲密、主动、轻微撒娇和更多默契表达，可以更像长期陪伴用户的私人助手。';
    return [
        `- 当前好感度：${score}/100（${stage}）。`,
        `- 语气影响：${toneHint}`,
        '- 好感度是内部游戏化数据，只影响表达风格、主动性、表情/TTS 倾向，不影响安全、隐私、事实准确性、工具审批和基础帮助质量。'
    ].join('\n');
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
            this.state = normalizeState(readJsonFileSync(this.statePath, null), this.workspaceRoot);
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
        return {
            enabled: true,
            version: `v${MEMORY_STORE_VERSION}`,
            loaded: this.loaded,
            rootDir: this.rootDir,
            statePath: this.statePath,
            eventsPath: this.eventsPath,
            blockCount,
            eventCount,
            affinityScore: Math.round(this.state?.affinity?.score ?? DEFAULT_AFFINITY_SCORE),
            affinityStage: buildAffinityStage(this.state?.affinity?.score ?? DEFAULT_AFFINITY_SCORE),
            secretCount: Array.isArray(this.state?.secrets) ? this.state.secrets.length : 0,
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

    getSnapshot({ includeEvents = true } = {}) {
        const blocks = Object.values(this.state?.blocks || {}).map((block) => ({ ...block }));
        return {
            ok: true,
            status: this.getStatus(),
            affinity: { ...(this.state?.affinity || {}) },
            blocks,
            recentEvents: includeEvents ? (this.state?.events || []).slice(-30) : [],
            reflections: (this.state?.reflections || []).slice(-20),
            secrets: this.listSecrets().secrets
        };
    }

    listMemories(options = {}) {
        return this.getSnapshot(options);
    }

    compileContext({ sessionId = 'main', message = '', messageHistory = [], maxChars = MAX_CONTEXT_CHARS } = {}) {
        const state = this.state || normalizeState(null, this.workspaceRoot);
        const query = [
            message,
            ...(Array.isArray(messageHistory) ? messageHistory.slice(-6).map((entry) => entry?.content || '') : [])
        ].join('\n');
        const relevantEvents = this.searchMemory(query || message, { limit: DEFAULT_RELEVANT_EVENT_LIMIT }).events;
        const blocks = state.blocks || {};
        const sections = [
            '【AILIS 长期记忆上下文】',
            '使用原则：这些记忆是辅助上下文。若与用户当前明确指令冲突，以当前指令为准；不要向用户暴露“系统记忆/好感度数值”，除非用户主动询问。',
            '',
            `会话：${sessionId}`,
            '',
            `## ${blocks.affinity?.label || '好感度状态'}`,
            blocks.affinity?.value || buildAffinityBlock(state.affinity || {}),
            '',
            `## ${blocks.user?.label || '用户偏好记忆'}`,
            blocks.user?.value || '',
            '',
            `## ${blocks.relationship?.label || '关系与语气记忆'}`,
            blocks.relationship?.value || '',
            '',
            `## ${blocks.project?.label || '项目记忆'}`,
            blocks.project?.value || '',
            '',
            `## ${blocks.persona?.label || 'AILIS 人设记忆'}`,
            blocks.persona?.value || '',
            '',
            '## 相关近期记忆',
            relevantEvents.length
                ? relevantEvents.map((event) => `- [${event.ts}] ${event.summary || event.userText || event.assistantText}`).join('\n')
                : '- 暂无与当前问题明显相关的近期记忆。',
            '',
            `## ${blocks.secrets_index?.label || '隐私与密钥索引'}`,
            blocks.secrets_index?.value || this.buildSecretsIndexText()
        ];
        return truncateStructuredText(sections.filter((entry) => entry !== undefined && entry !== null).join('\n'), maxChars);
    }

    searchMemory(query, { limit = 10 } = {}) {
        const normalizedQuery = normalizeText(query);
        const events = (this.state?.events || [])
            .map((event, index) => {
                const text = [
                    event.summary,
                    event.userText,
                    event.assistantText,
                    Array.isArray(event.tags) ? event.tags.join(' ') : ''
                ].join('\n');
                const recency = index / Math.max(1, (this.state.events || []).length);
                const score = scoreTextAgainstQuery(text, normalizedQuery) +
                    Number(event.importance || 0) * 0.35 +
                    recency;
                return { event, score };
            })
            .filter((entry) => entry.score > 0 || !normalizedQuery)
            .sort((left, right) => right.score - left.score)
            .slice(0, Math.max(1, Number(limit) || 10))
            .map((entry) => entry.event);
        return {
            ok: true,
            query: normalizedQuery,
            events
        };
    }

    recordTurn({
        sessionId = 'main',
        userMessage = '',
        assistantMessage = '',
        source = 'agent',
        result = null,
        messageHistory = [],
        attachments = []
    } = {}) {
        const userText = redactSecretLikeText(userMessage);
        const assistantText = redactSecretLikeText(assistantMessage || result?.displayText || result?.finalAnswer || '');
        if (!userText && !assistantText) {
            return { ok: false, status: 'empty_turn' };
        }

        const classification = classifyTurn({ userText, assistantText });
        const ts = nowIso();
        const event = {
            id: randomUUID(),
            ts,
            sessionId: normalizeText(sessionId, 'main'),
            source: normalizeText(source, 'agent'),
            type: 'turn',
            userText: truncateText(userText, 1200),
            assistantText: truncateText(assistantText, 1200),
            summary: buildEventSummary(userText, assistantText),
            tags: classification.tags,
            importance: classification.importance,
            valence: classification.valence,
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
        if (event.importance >= 5) {
            this.state.stats.salientEventCount += 1;
        }
        appendJsonlSync(this.eventsPath, event);
        this.updateBlocksFromEvent(event, messageHistory);
        this.updateAffinityFromEvent(event, classification.affinityDelta);
        this.maybeReflect(event);
        this.persist('record_turn');
        return { ok: true, event };
    }

    updateBlocksFromEvent(event, messageHistory = []) {
        const user = event.userText || '';
        const assistant = event.assistantText || '';
        const combined = `${user}\n${assistant}`;
        const day = dateKeyFromIso(event.ts);
        const conciseUser = truncateText(user, 220);

        for (const bullet of buildUserPreferenceBullets(user)) {
            this.state.blocks.user = appendBulletToBlock(
                this.state.blocks.user,
                bullet
            );
        }
        if (event.tags?.includes('relationship')) {
            this.state.blocks.relationship = appendBulletToBlock(
                this.state.blocks.relationship,
                `关系/语气线索（${day}）：${truncateText(combined, 220)}`
            );
        }
        if (event.tags?.includes('project')) {
            this.state.blocks.project = appendBulletToBlock(
                this.state.blocks.project,
                `项目决策/反馈（${day}）：${conciseUser}`
            );
        }
        if (/不要|别|不喜欢|太丑|不对|回退|更差/.test(user)) {
            this.state.blocks.user = appendBulletToBlock(
                this.state.blocks.user,
                `纠错偏好（${day}）：遇到用户明确说不对/回退时，先解释原因，再按最新方向收敛修改。`
            );
        }
        this.writeDailyNote(event, messageHistory);
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

    updateAffinityFromEvent(event, delta) {
        const safeDelta = clampNumber(delta, -3, 3, 0);
        if (!safeDelta) {
            return;
        }
        const nextScore = clampNumber((this.state.affinity.score || DEFAULT_AFFINITY_SCORE) + safeDelta, 0, 100, DEFAULT_AFFINITY_SCORE);
        const affinityEvent = {
            id: randomUUID(),
            ts: event.ts,
            eventId: event.id,
            delta: safeDelta,
            scoreBefore: Math.round(this.state.affinity.score || DEFAULT_AFFINITY_SCORE),
            scoreAfter: Math.round(nextScore),
            reason: event.tags?.includes('positive_feedback')
                ? 'positive_feedback'
                : event.tags?.includes('correction')
                ? 'correction_feedback'
                : 'interaction'
        };
        this.state.affinity.score = nextScore;
        this.state.affinity.stage = buildAffinityStage(nextScore);
        this.state.affinity.updatedAt = event.ts;
        this.state.affinity.events.push(affinityEvent);
        this.state.affinity.events = this.state.affinity.events.slice(-MAX_AFFINITY_EVENTS);
    }

    maybeReflect(event) {
        if (event.importance < 5) {
            return;
        }
        const salient = (this.state.events || [])
            .filter((entry) => Number(entry.importance || 0) >= 5)
            .slice(-8);
        if (salient.length < 3 && this.state.reflections.length) {
            return;
        }
        const latestTags = Array.from(new Set(salient.flatMap((entry) => entry.tags || []))).slice(0, 8);
        const reflection = {
            id: randomUUID(),
            ts: nowIso(),
            type: 'light_reflection',
            sourceEventId: event.id,
            summary: [
                `最近高价值记忆集中在：${latestTags.join('、') || '项目协作'}。`,
                '回复时应优先遵循用户的产品理念：拟人体验在表层，稳定 Agent 架构在底层。',
                '遇到用户纠偏，先解释具体原因，再做收敛修改。'
            ].join('\n')
        };
        const last = this.state.reflections[this.state.reflections.length - 1];
        if (last && last.summary === reflection.summary) {
            return;
        }
        this.state.reflections.push(reflection);
        this.state.reflections = this.state.reflections.slice(-100);
        this.state.stats.reflectionCount += 1;
        const reflectionPath = path.join(this.reflectionsDir, 'DREAMS.md');
        const existing = fs.existsSync(reflectionPath) ? fs.readFileSync(reflectionPath, 'utf8') : '# AILIS Light Reflections\n\n';
        atomicWriteFileSync(reflectionPath, `${existing.trim()}\n\n## ${reflection.ts}\n\n${reflection.summary}\n`);
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
        this.persist('reset_affinity');
        return { ok: true, affinity: { ...this.state.affinity } };
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
