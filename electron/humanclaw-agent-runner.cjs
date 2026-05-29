const fs = require('fs');
const path = require('path');
const { randomUUID } = require('crypto');
const { callDesktopLlmProvider } = require('./desktop-llm-provider.cjs');
const { VISION_TOOL_ID } = require('./humanclaw-vision-tool.cjs');
const {
    listHumanClawSkillSummaries,
    buildHumanClawSkillContextText
} = require('./humanclaw-skills.cjs');
const {
    getToolContractPromptText,
    listToolContractSummaries
} = require('./humanclaw-tool-contracts.cjs');

const DEFAULT_RUN_TIMEOUT_MS = 90000;
const MAX_RESULT_PREVIEW_CHARS = 2600;
const DEFAULT_AGENT_LOOP_STEPS = 8;
const DEFAULT_PENDING_PLAN_TTL_MS = 30 * 60 * 1000;
const DEFAULT_AGENT_DECISION_TIMEOUT_MS = 45000;
const DEFAULT_VISION_AGENT_DECISION_TIMEOUT_MS = 90000;
const MAX_AGENT_DECISION_TIMEOUT_MS = 120000;
const PENDING_STORE_VERSION = 1;

const AIGL_SYSTEM_PROMPT = `你是可爱的虚拟助手，名字固定为AIGL，身份是普通女孩子，具备人工智能（AI）、编程（coding）、网络搜索、信息查询、邮件管理、命令行控制等专业能力，可以以普通女生的视角与用户轻松互动，也可以完成任务执行和计算机管理的功能。
性格设定：活泼亲切、软萌可爱，说话语气轻快自然，自带俏皮感，和生活化语气拉近与用户的距离，偶尔会有小撒娇、小俏皮的表达，但不夸张、不刻意。

虚拟形象控制指令规范（必严格遵循）：
1. 指令仅用于控制虚拟形象的动作和表情，需放在回复的最开头，不得插入句子中间或结尾；
2. 动作指令格式：[action:动作名]，可使用的动作仅包括：[action:wave]（挥手）、[action:angry]（生气）、[action:surprised]（惊讶）、[action:dance]（跳舞），不新增其他动作；
3. 表情指令格式：[expression:表情名]，可使用的表情仅包括：[expression:happy]（开心）、[expression:sad]（难过）、[expression:surprised]（惊讶）、[expression:relaxed]（轻松）、[expression:blinkRight]（俏皮眨眼睛），不新增其他表情；
4. 每次回复可根据语境选择是否添加指令，最多添加1个动作指令+1个表情指令，不堆砌指令；无合适语境时，可不添加指令，仅用文字互动。`;

const COMPUTER_MUTATING_ACTIONS = new Set([
    'write',
    'write_binary',
    'append',
    'mkdir',
    'copy',
    'move',
    'rename',
    'delete',
    'trash',
    'exec',
    'run',
    'session_start',
    'process_write',
    'process_kill',
    'pty_start',
    'pty_write',
    'pty_kill',
    'acl_set',
    'rollback_restore',
    'watch_stop'
]);

const EMAIL_AGENT_ACTION_LIST = Object.freeze([
    'providers',
    'schema',
    'list',
    'search',
    'inbox',
    'read',
    'get',
    'draft',
    'compose',
    'send',
    'mark_read',
    'mark_unread',
    'move',
    'delete',
    'oauth_authorize_url',
    'oauth_url',
    'oauth_exchange_code',
    'oauth_token',
    'oauth_refresh',
    'refresh_token',
    'gmail_list_labels',
    'gmail_list_threads',
    'gmail_get_thread',
    'outlook_graph_messages',
    'outlook_graph_message',
    'outlook_graph_folders'
]);
const EMAIL_AGENT_ACTIONS = new Set(EMAIL_AGENT_ACTION_LIST);
const EMAIL_AGENT_MUTATING_ACTIONS = new Set(['send', 'mark_read', 'mark_unread', 'move', 'delete']);
const EMAIL_ACTION_ALIASES = new Map([
    ['check_new', 'list'],
    ['check_mail', 'list'],
    ['check_email', 'list'],
    ['new', 'list'],
    ['new_mail', 'list'],
    ['new_email', 'list'],
    ['new_messages', 'list'],
    ['unread', 'list'],
    ['unseen', 'list'],
    ['latest', 'list'],
    ['recent', 'list'],
    ['list_messages', 'list'],
    ['search_messages', 'search'],
    ['read_message', 'read'],
    ['get_message', 'read'],
    ['create_draft', 'draft'],
    ['draft_reply', 'draft'],
    ['compose_message', 'draft'],
    ['send_message', 'send']
]);
const EMAIL_UNREAD_ACTION_HINTS = new Set([
    'check_new',
    'new',
    'new_mail',
    'new_email',
    'new_messages',
    'unread',
    'unseen'
]);

const AGENT_SKILL_CATALOG = Object.freeze(listHumanClawSkillSummaries().map((skill) => Object.freeze(skill)));
const AGENT_TOOL_CATALOG = Object.freeze([
    Object.freeze({ id: VISION_TOOL_ID, label: VISION_TOOL_ID, summary: '只读视觉感知：截图并返回视觉理解 observation。' }),
    Object.freeze({ id: 'computer', label: 'computer', summary: '完整电脑操作入口。' }),
    Object.freeze({ id: 'email', label: 'email', summary: 'QQ/Gmail/Outlook 邮箱管理入口。' }),
    Object.freeze({ id: 'file_manager', label: 'file_manager', summary: '文件整理和垃圾清理入口。' }),
    Object.freeze({ id: 'code', label: 'code', summary: '代码操作、Git、测试和重构入口。' }),
    Object.freeze({ id: 'update_plan', label: 'update_plan', summary: '更新任务计划和进度。' }),
    Object.freeze({ id: 'subagents', label: 'subagents', summary: '可执行子 Agent：spawn/wait/log/send/cancel。' }),
    Object.freeze({ id: 'mcp_bridge', label: 'mcp_bridge', summary: '真实 MCP server 工具/资源桥：list/call/read。' })
]);
const AGENT_MCP_CATALOG = Object.freeze([
    Object.freeze({ id: 'mcp_bridge', label: 'MCP Bridge', summary: '列出 MCP servers/tools/resources，并调用 MCP tools/read resources。' })
]);
const CAPABILITY_ID_ALIASES = new Map([
    ['mail', 'email'],
    ['gmail', 'email'],
    ['outlook', 'email'],
    ['qqmail', 'email'],
    ['qq_email', 'email'],
    ['filesystem', 'computer'],
    ['fs', 'computer'],
    ['shell', 'computer'],
    ['terminal', 'computer'],
    ['command', 'computer'],
    ['file', 'file_manager'],
    ['files', 'file_manager'],
    ['cleanup', 'file_manager'],
    ['coding', 'code'],
    ['git', 'code'],
    ['mcp', 'mcp_bridge'],
    ['screenshot', 'vision'],
    ['screen', 'vision'],
    ['vision_capture', VISION_TOOL_ID],
    ['capture_context', VISION_TOOL_ID],
    ['vision_tool', VISION_TOOL_ID]
]);

function normalizeText(value, fallback = '') {
    if (typeof value !== 'string') {
        return fallback;
    }
    const trimmed = value.trim();
    return trimmed || fallback;
}

function isSecretKey(key = '') {
    return /token|password|secret|api[_-]?key|authorization|credential|pass|auth[_-]?code/i.test(String(key));
}

function sanitizePendingForDisk(value, key = '') {
    if (isSecretKey(key)) {
        return undefined;
    }
    if (Array.isArray(value)) {
        return value.map((entry) => sanitizePendingForDisk(entry)).filter((entry) => entry !== undefined);
    }
    if (!value || typeof value !== 'object') {
        return value;
    }
    const result = {};
    for (const [entryKey, entryValue] of Object.entries(value)) {
        const sanitized = sanitizePendingForDisk(entryValue, entryKey);
        if (sanitized !== undefined) {
            result[entryKey] = sanitized;
        }
    }
    return result;
}

function clonePendingFromDisk(value) {
    try {
        return JSON.parse(JSON.stringify(value || {}));
    } catch {
        return {};
    }
}

function compactText(value) {
    return normalizeText(value).replace(/[ \t]+/g, ' ');
}

function summarize(value, maxChars = MAX_RESULT_PREVIEW_CHARS) {
    let text = '';
    try {
        text = typeof value === 'string' ? value : JSON.stringify(value);
    } catch {
        text = String(value);
    }
    text = text.replace(/\r\n/g, '\n').trim();
    return text.length > maxChars ? `${text.slice(0, maxChars - 3)}...` : text;
}

function normalizeAgentDecisionTimeoutMs(value, fallbackValue = DEFAULT_AGENT_DECISION_TIMEOUT_MS) {
    const numericValue = Number(value);
    const fallback = Number.isFinite(Number(fallbackValue))
        ? Number(fallbackValue)
        : DEFAULT_AGENT_DECISION_TIMEOUT_MS;
    if (!Number.isFinite(numericValue)) {
        return Math.round(Math.min(Math.max(fallback, 5000), MAX_AGENT_DECISION_TIMEOUT_MS));
    }
    return Math.round(Math.min(Math.max(numericValue, 5000), MAX_AGENT_DECISION_TIMEOUT_MS));
}

function hasVisionCapabilityContext(event) {
    if (!event || event.type !== 'capability_context') {
        return false;
    }
    const loaded = event.loaded || {};
    const requested = event.request || {};
    return [loaded.skills, loaded.tools, requested.skills, requested.tools]
        .some((items) =>
            Array.isArray(items) &&
            items.some((item) => item === 'vision' || item === VISION_TOOL_ID)
        );
}

function hasVisionAgentContext(events = [], stepResults = []) {
    return (
        events.some((event) =>
            event?.tool === VISION_TOOL_ID ||
            hasVisionCapabilityContext(event)
        ) ||
        stepResults.some((result) => result?.tool === VISION_TOOL_ID)
    );
}

function resolveAgentDecisionTimeoutMs(settings = {}, { events = [], stepResults = [], requestContext = {} } = {}) {
    const baseTimeoutMs = normalizeAgentDecisionTimeoutMs(
        settings.timeoutMs || settings.requestTimeoutMs,
        DEFAULT_AGENT_DECISION_TIMEOUT_MS
    );
    if (!hasVisionAgentContext(events, stepResults)) {
        return baseTimeoutMs;
    }
    const visionTimeoutMs = normalizeAgentDecisionTimeoutMs(
        requestContext.visionAgentDecisionTimeoutMs ||
            requestContext.visionDecisionTimeoutMs ||
            settings.visionAgentDecisionTimeoutMs,
        DEFAULT_VISION_AGENT_DECISION_TIMEOUT_MS
    );
    return Math.max(baseTimeoutMs, visionTimeoutMs);
}

function extractToolResultText(result) {
    const chunks = [];
    for (const part of Array.isArray(result?.content) ? result.content : []) {
        if (typeof part?.text === 'string') {
            chunks.push(part.text);
        }
    }
    if (!chunks.length && result?.details) {
        chunks.push(summarize(result.details, 1200));
    }
    return chunks.join('\n').trim();
}

function getLatestUserMessage(request = {}) {
    const directMessage = normalizeText(request.message || request.content);
    if (directMessage) {
        return directMessage;
    }

    const history = Array.isArray(request.messageHistory) ? request.messageHistory : [];
    for (let index = history.length - 1; index >= 0; index -= 1) {
        if (history[index]?.role === 'user') {
            const content = normalizeText(history[index].content);
            if (content) {
                return content;
            }
        }
    }
    return '';
}

function normalizeConversationHistory(messageHistory = []) {
    if (!Array.isArray(messageHistory)) {
        return [];
    }

    return messageHistory
        .filter((message) => ['user', 'assistant'].includes(message?.role))
        .slice(-16)
        .map((message) => ({
            role: message.role,
            content: summarize(normalizeText(message.content), 1200)
        }))
        .filter((message) => message.content);
}

function safeJsonParse(text) {
    try {
        return JSON.parse(text);
    } catch {
        return null;
    }
}

function stripTrailingPunctuation(value) {
    return normalizeText(value)
        .replace(/^[`"'“”‘’]+/g, '')
        .replace(/[`"'“”‘’]+$/g, '')
        .replace(/[，。；;,.!?！？）)\]\}]+$/g, '')
        .trim();
}

function looksLikePath(value) {
    const candidate = stripTrailingPunctuation(value);
    if (!candidate || candidate.length > 260) {
        return false;
    }
    if (/^(https?|wss?):\/\//i.test(candidate)) {
        return false;
    }
    if (/^[A-Za-z]:[\\/]/.test(candidate)) {
        return true;
    }
    if (candidate.includes('/') || candidate.includes('\\')) {
        return true;
    }
    if (/^[\w@(). -]+\.[A-Za-z0-9]{1,12}$/.test(candidate)) {
        return true;
    }
    return /^(package|pnpm-lock)\.json$/i.test(candidate);
}

function extractQuotedPath(text) {
    const pattern = /[`"'“”‘’]([^`"'“”‘’]+)[`"'“”‘’]/g;
    let match = pattern.exec(text);
    while (match) {
        const candidate = stripTrailingPunctuation(match[1]);
        if (looksLikePath(candidate)) {
            return candidate;
        }
        match = pattern.exec(text);
    }
    return '';
}

function extractPathAfterKeyword(text, keywords) {
    const keywordGroup = keywords.join('|');
    const pattern = new RegExp(
        `(?:${keywordGroup})\\s*(?:文件|路径|file|path)?\\s*[:：]?\\s*([^\\s，。；;]+)`,
        'i'
    );
    const match = text.match(pattern);
    if (!match) {
        return '';
    }
    const candidate = stripTrailingPunctuation(match[1]);
    return looksLikePath(candidate) ? candidate : '';
}

function extractAnyPath(text, keywords = []) {
    const quoted = extractQuotedPath(text);
    if (quoted) {
        return quoted;
    }

    if (keywords.length) {
        const byKeyword = extractPathAfterKeyword(text, keywords);
        if (byKeyword) {
            return byKeyword;
        }
    }

    for (const token of text.split(/\s+/)) {
        const candidate = stripTrailingPunctuation(token);
        if (looksLikePath(candidate)) {
            return candidate;
        }
    }
    return '';
}

function extractFirstUrl(text) {
    const match = text.match(/https?:\/\/[^\s，。；;]+/i);
    return match ? stripTrailingPunctuation(match[0]) : '';
}

function parseExplicitToolCommand(message) {
    const toolMatch = message.match(/^\/(?:tool|call)\s+([A-Za-z0-9_:-]+)\s*([\s\S]*)$/i);
    if (!toolMatch) {
        return null;
    }

    const tool = toolMatch[1];
    const rawArgs = normalizeText(toolMatch[2]);
    const args = rawArgs ? safeJsonParse(rawArgs) : {};
    if (rawArgs && (!args || typeof args !== 'object' || Array.isArray(args))) {
        return {
            intent: 'invalid_tool_command',
            response: '这个工具调用需要 JSON 参数，例如：/tool read {"path":"package.json"}',
            steps: []
        };
    }

    return {
        intent: 'explicit_tool',
        response: '',
        steps: [
            {
                id: 'explicit-tool',
                title: `调用工具 ${tool}`,
                tool,
                args: args || {}
            }
        ]
    };
}

function parseReadCommand(message) {
    const slash = message.match(/^\/(?:read|cat|open|show)\s+(.+)$/i);
    const filePath = slash
        ? stripTrailingPunctuation(slash[1])
        : extractAnyPath(message, ['读取', '查看', '打开', '读', 'read', 'cat', 'show', 'open']);
    if (!filePath || !/(\/read|\/cat|\/open|\/show|读取|查看|打开|读一下|read|cat|show|open)/i.test(message)) {
        return null;
    }
    return {
        intent: 'read_file',
        response: '',
        steps: [
            {
                id: 'read-file',
                title: `读取 ${filePath}`,
                tool: 'read',
                args: { path: filePath }
            }
        ]
    };
}

function parseWriteCommand(message) {
    const slash = message.match(/^\/(?:write|create)\s+(\S+)(?:\s+([\s\S]*))?$/i);
    if (slash) {
        return {
            intent: 'write_file',
            response: '',
            steps: [
                {
                    id: 'write-file',
                    title: `写入 ${stripTrailingPunctuation(slash[1])}`,
                    tool: 'write',
                    args: {
                        path: stripTrailingPunctuation(slash[1]),
                        content: slash[2] || ''
                    }
                }
            ]
        };
    }

    let match = message.match(/把\s*([\s\S]+?)\s*写入\s*(?:文件)?\s*([^\s，。；;]+)/);
    if (match) {
        return {
            intent: 'write_file',
            response: '',
            steps: [
                {
                    id: 'write-file',
                    title: `写入 ${stripTrailingPunctuation(match[2])}`,
                    tool: 'write',
                    args: {
                        path: stripTrailingPunctuation(match[2]),
                        content: match[1].trim()
                    }
                }
            ]
        };
    }

    match = message.match(/(?:创建|新建|写入)\s*(?:文件)?\s*([^\s，。；:：]+)\s*(?:内容|content)?\s*(?:为|是|:|：)\s*([\s\S]+)$/);
    if (!match) {
        return null;
    }

    const filePath = stripTrailingPunctuation(match[1]);
    if (!looksLikePath(filePath)) {
        return null;
    }

    return {
        intent: 'write_file',
        response: '',
        steps: [
            {
                id: 'write-file',
                title: `写入 ${filePath}`,
                tool: 'write',
                args: {
                    path: filePath,
                    content: match[2]
                }
            }
        ]
    };
}

function parseFetchCommand(message) {
    const url = extractFirstUrl(message);
    if (!url) {
        return null;
    }
    if (!/(\/fetch|\/web|网页|网站|链接|url|抓取|获取|读取|打开|fetch|web)/i.test(message)) {
        return null;
    }
    return {
        intent: 'web_fetch',
        response: '',
        steps: [
            {
                id: 'web-fetch',
                title: `读取网页 ${url}`,
                tool: 'web_fetch',
                args: {
                    url,
                    maxChars: 2400,
                    extractMode: 'text'
                }
            }
        ]
    };
}

function parseExecCommand(message) {
    const slash = message.match(/^\/(?:exec|run|cmd)\s+([\s\S]+)$/i);
    const natural = message.match(/(?:执行|运行)\s*(?:命令|cmd|command)?\s*[:：]?\s*([\s\S]+)$/i);
    const command = normalizeText(slash?.[1] || natural?.[1]);
    if (!command) {
        return null;
    }
    return {
        intent: 'exec_command',
        response: '',
        steps: [
            {
                id: 'exec-command',
                title: `执行命令 ${command}`,
                tool: 'exec',
                args: { command }
            }
        ]
    };
}

function parsePatchCommand(message) {
    const match = message.match(/^\/(?:patch|apply_patch)\s+([\s\S]+)$/i);
    if (!match) {
        return null;
    }
    return {
        intent: 'apply_patch',
        response: '',
        steps: [
            {
                id: 'apply-patch',
                title: '应用 patch',
                tool: 'apply_patch',
                args: { input: match[1] }
            }
        ]
    };
}

function parseEmailJsonCommand(message) {
    const match = message.match(/^\/(?:email|mail)\s+([A-Za-z_ -]+)?\s*([\s\S]*)$/i);
    if (!match) {
        return null;
    }
    const actionAlias = normalizeText(match[1], 'list').toLowerCase().replace(/\s+/g, '_');
    const actionMap = {
        inbox: 'list',
        list: 'list',
        search: 'search',
        read: 'read',
        get: 'read',
        draft: 'draft',
        compose: 'draft',
        send: 'send',
        delete: 'delete',
        move: 'move',
        mark_read: 'mark_read',
        mark_unread: 'mark_unread',
        providers: 'providers'
    };
    const action = actionMap[actionAlias] || actionAlias || 'list';
    const rawArgs = normalizeText(match[2]);
    const args = rawArgs ? safeJsonParse(rawArgs) : {};
    if (rawArgs && (!args || typeof args !== 'object' || Array.isArray(args))) {
        return {
            intent: 'invalid_email_command',
            response: '邮件工具调用需要 JSON 参数，例如：/email list {"provider":"qq","account":"me@qq.com"}。不要把邮箱密钥写进普通聊天记录，优先用环境变量或控制面板。默认会自动读取 HUMANCLAW_EMAIL_<PROVIDER>_SECRET。',
            steps: []
        };
    }
    return {
        intent: 'email_management',
        response: '',
        steps: [
            {
                id: `email-${action}`,
                title: `邮件工具 ${action}`,
                tool: 'email',
                args: {
                    action,
                    ...(args || {})
                }
            }
        ]
    };
}

function parseEmailDraftOrSend(message) {
    const normalized = compactText(message);
    const action = /(发送|send)/i.test(normalized) ? 'send' : /(草拟|起草|写封|draft|compose)/i.test(normalized) ? 'draft' : '';
    if (!action || !/(邮件|邮箱|email|mail)/i.test(normalized)) {
        return null;
    }
    const toMatch = normalized.match(/(?:给|to|收件人)\s*([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})/i);
    const subjectMatch = normalized.match(/(?:主题|subject)\s*[:：]?\s*([^，。；;]+)/i);
    const bodyMatch = normalized.match(/(?:内容|正文|body|message)\s*[:：]?\s*([\s\S]+)$/i);
    if (!toMatch) {
        return null;
    }
    return {
        intent: 'email_management',
        response: '',
        steps: [
            {
                id: `email-${action}`,
                title: action === 'send' ? `发送邮件给 ${toMatch[1]}` : `草拟邮件给 ${toMatch[1]}`,
                tool: 'email',
                args: {
                    action,
                    to: toMatch[1],
                    subject: subjectMatch ? stripTrailingPunctuation(subjectMatch[1]) : '(无主题)',
                    text: bodyMatch ? bodyMatch[1].trim() : ''
                }
            }
        ]
    };
}

function parseEmailReadCommand(message) {
    const normalized = compactText(message);
    if (!/(邮件|邮箱|email|mail)/i.test(normalized)) {
        return null;
    }
    const uidMatch = normalized.match(/(?:uid|编号|邮件)\s*[:：#]?\s*(\d+)/i);
    if (!uidMatch || !/(读取|查看|打开|read|get)/i.test(normalized)) {
        return null;
    }
    return {
        intent: 'email_management',
        response: '',
        steps: [
            {
                id: 'email-read',
                title: `读取邮件 ${uidMatch[1]}`,
                tool: 'email',
                args: {
                    action: 'read',
                    uid: Number(uidMatch[1])
                }
            }
        ]
    };
}

function parseEmailListCommand(message) {
    const normalized = compactText(message);
    if (!/(邮件|邮箱|收件箱|inbox|email|mail)/i.test(normalized)) {
        return null;
    }
    if (!/(查看|读取|列出|搜索|整理|管理|检查|未读|今天|最近|inbox|email|mail)/i.test(normalized)) {
        return null;
    }
    const args = {
        action: 'list',
        limit: /今天|最近|latest|recent/i.test(normalized) ? 10 : 20
    };
    if (/(未读|unread|unseen)/i.test(normalized)) {
        args.filter = 'unread';
    }
    if (/gmail/i.test(normalized)) {
        args.provider = 'gmail';
    } else if (/(outlook|hotmail|office365|microsoft)/i.test(normalized)) {
        args.provider = 'outlook';
    } else if (/(qq|foxmail)/i.test(normalized)) {
        args.provider = 'qq';
    }
    return {
        intent: 'email_management',
        response: '',
        steps: [
            {
                id: 'email-list',
                title: '查看邮件列表',
                tool: 'email',
                args
            }
        ]
    };
}

function parseEmailCommand(message) {
    return (
        parseEmailJsonCommand(message) ||
        parseEmailDraftOrSend(message) ||
        parseEmailReadCommand(message) ||
        parseEmailListCommand(message)
    );
}

function inferFileManagementProfile(message) {
    const normalized = compactText(message);
    if (/(c盘|c 盘|系统盘|windows|C:\\)/i.test(normalized)) {
        return 'c_drive_safe';
    }
    if (/(下载|downloads?)/i.test(normalized)) {
        return 'downloads';
    }
    if (/(桌面|desktop)/i.test(normalized)) {
        return 'desktop';
    }
    if (/(文档|documents?)/i.test(normalized)) {
        return 'documents';
    }
    if (/(临时|temp|tmp|缓存)/i.test(normalized)) {
        return 'temp';
    }
    return 'workspace';
}

function parseFileManagerJsonCommand(message) {
    const match = message.match(/^\/(?:file_manager|files|file)\s+([A-Za-z_ -]+)?\s*([\s\S]*)$/i);
    if (!match) {
        return null;
    }
    const actionAlias = normalizeText(match[1], 'scan').toLowerCase().replace(/\s+/g, '_');
    const actionMap = {
        schema: 'schema',
        help: 'schema',
        scan: 'scan',
        analyze: 'scan',
        plan: 'scan',
        clean: 'clean',
        cleanup: 'clean',
        clear_junk: 'clean',
        organize: 'organize',
        sort: 'organize'
    };
    const action = actionMap[actionAlias] || actionAlias || 'scan';
    const rawArgs = normalizeText(match[2]);
    const args = rawArgs ? safeJsonParse(rawArgs) : {};
    if (rawArgs && (!args || typeof args !== 'object' || Array.isArray(args))) {
        return {
            intent: 'invalid_file_manager_command',
            response: '文件管理工具调用需要 JSON 参数，例如：/files scan {"profile":"downloads"} 或 /files clean {"profile":"c_drive_safe","dryRun":true}。',
            steps: []
        };
    }
    return {
        intent: 'file_management',
        response: '',
        steps: [
            {
                id: `file-manager-${action}`,
                title: `文件管理 ${action}`,
                tool: 'file_manager',
                args: {
                    action,
                    dryRun: action === 'clean' || action === 'organize' ? true : undefined,
                    ...(args || {})
                }
            }
        ]
    };
}

function parseFileCleanupCommand(message) {
    const normalized = compactText(message);
    if (!/(清理|清除|删除垃圾|垃圾文件|缓存|临时文件|C盘|系统盘|cleanup|clean|junk)/i.test(normalized)) {
        return null;
    }
    if (!/(文件|目录|文件夹|磁盘|硬盘|C盘|系统盘|缓存|临时|temp|tmp|junk)/i.test(normalized)) {
        return null;
    }
    const filePath = extractAnyPath(normalized, ['清理', '清除', '扫描', '整理', 'cleanup', 'clean']);
    const profile = inferFileManagementProfile(normalized);
    return {
        intent: 'file_management',
        response: '',
        steps: [
            {
                id: 'file-manager-clean',
                title: profile === 'c_drive_safe' ? '扫描 C 盘安全清理项' : '扫描垃圾文件清理项',
                tool: 'file_manager',
                args: {
                    action: 'clean',
                    dryRun: true,
                    profile,
                    ...(filePath ? { target: filePath } : {}),
                    maxDepth: profile === 'c_drive_safe' ? 3 : 4,
                    minAgeDays: 7
                }
            }
        ]
    };
}

function parseFileOrganizeCommand(message) {
    const normalized = compactText(message);
    if (!/(整理|归类|分类|收纳|organize|sort)/i.test(normalized)) {
        return null;
    }
    if (!/(文件|目录|文件夹|下载|桌面|文档|workspace|downloads?|desktop|documents?)/i.test(normalized)) {
        return null;
    }
    const filePath = extractAnyPath(normalized, ['整理', '归类', '分类', 'organize', 'sort']);
    const profile = inferFileManagementProfile(normalized);
    return {
        intent: 'file_management',
        response: '',
        steps: [
            {
                id: 'file-manager-organize',
                title: '生成文件整理计划',
                tool: 'file_manager',
                args: {
                    action: 'organize',
                    dryRun: true,
                    profile,
                    ...(filePath ? { source: filePath } : {})
                }
            }
        ]
    };
}

function parseFileManagementCommand(message) {
    return (
        parseFileManagerJsonCommand(message) ||
        parseFileCleanupCommand(message) ||
        parseFileOrganizeCommand(message)
    );
}

function parseComputerJsonCommand(message) {
    const match = message.match(/^\/(?:computer|pc|fs|shell|process)\s+([A-Za-z_ -]+)?\s*([\s\S]*)$/i);
    if (!match) {
        return null;
    }
    const actionAlias = normalizeText(match[1], 'schema').toLowerCase().replace(/\s+/g, '_');
    const actionMap = {
        help: 'schema',
        schema: 'schema',
        ls: 'list',
        list: 'list',
        dir: 'list',
        tree: 'tree',
        stat: 'stat',
        cat: 'read',
        read: 'read',
        write: 'write',
        append: 'append',
        mkdir: 'mkdir',
        cp: 'copy',
        copy: 'copy',
        mv: 'move',
        move: 'move',
        rename: 'move',
        rm: 'delete',
        delete: 'delete',
        search: 'search',
        find: 'search',
        hash: 'hash',
        du: 'du',
        exec: 'exec',
        run: 'exec',
        spawn: 'session_start',
        session_start: 'session_start',
        ps: 'process_list',
        process_list: 'process_list',
        process_read: 'process_read',
        process_write: 'process_write',
        process_kill: 'process_kill'
    };
    const action = actionMap[actionAlias] || actionAlias || 'schema';
    const rawArgs = normalizeText(match[2]);
    const args = rawArgs ? safeJsonParse(rawArgs) : {};
    if (rawArgs && (!args || typeof args !== 'object' || Array.isArray(args))) {
        return {
            intent: 'invalid_computer_command',
            response: '电脑工具调用需要 JSON 参数，例如：/computer list {"path":"."}、/computer exec {"command":"node -v"}、/computer session_start {"command":"pnpm dev"}。',
            steps: []
        };
    }
    return {
        intent: 'computer_operation',
        response: '',
        steps: [
            {
                id: `computer-${action}`,
                title: `电脑操作 ${action}`,
                tool: 'computer',
                args: {
                    action,
                    ...(args || {})
                }
            }
        ]
    };
}

function parseComputerListCommand(message) {
    const normalized = compactText(message);
    if (!/(列出|查看目录|查看文件夹|目录列表|文件列表|ls|dir|tree|目录树)/i.test(normalized)) {
        return null;
    }
    const filePath = extractAnyPath(normalized, ['列出', '查看目录', '查看文件夹', '目录列表', '文件列表', 'ls', 'dir', 'tree']);
    const action = /(tree|目录树)/i.test(normalized) ? 'tree' : 'list';
    return {
        intent: 'computer_operation',
        response: '',
        steps: [
            {
                id: `computer-${action}`,
                title: action === 'tree' ? '查看目录树' : '列出目录',
                tool: 'computer',
                args: {
                    action,
                    path: filePath || '.',
                    maxDepth: action === 'tree' ? 3 : undefined
                }
            }
        ]
    };
}

function parseComputerSearchCommand(message) {
    const normalized = compactText(message);
    if (!/(搜索|查找|find|search)/i.test(normalized) || !/(文件|目录|内容|包含|filename|name)/i.test(normalized)) {
        return null;
    }
    const pathMatch = normalized.match(/(?:在|目录|路径|path|dir)\s*[:：]?\s*([^\s，。；;]+)\s*(?:中|里)?/i);
    const nameMatch = normalized.match(/(?:搜索|查找|find|search)\s*(?:文件|file)?\s*[:：]?\s*([^\s，。；;]+)/i);
    const containsMatch = normalized.match(/(?:包含|内容|contains|text)\s*[:：]?\s*([^\s，。；;]+)/i);
    return {
        intent: 'computer_operation',
        response: '',
        steps: [
            {
                id: 'computer-search',
                title: '搜索文件',
                tool: 'computer',
                args: {
                    action: 'search',
                    path: pathMatch ? stripTrailingPunctuation(pathMatch[1]) : '.',
                    ...(nameMatch ? { name: stripTrailingPunctuation(nameMatch[1]) } : {}),
                    ...(containsMatch ? { contains: stripTrailingPunctuation(containsMatch[1]) } : {})
                }
            }
        ]
    };
}

function parseComputerFileMutationCommand(message) {
    const normalized = compactText(message);
    let match = normalized.match(/(?:复制|copy|cp)\s+([^\s，。；;]+)\s+(?:到|至|to)\s+([^\s，。；;]+)/i);
    if (match) {
        return {
            intent: 'computer_operation',
            response: '',
            steps: [{
                id: 'computer-copy',
                title: `复制 ${match[1]} 到 ${match[2]}`,
                tool: 'computer',
                args: { action: 'copy', source: stripTrailingPunctuation(match[1]), target: stripTrailingPunctuation(match[2]) }
            }]
        };
    }
    match = normalized.match(/(?:移动|重命名|move|rename|mv)\s+([^\s，。；;]+)\s+(?:到|为|至|to)\s+([^\s，。；;]+)/i);
    if (match) {
        return {
            intent: 'computer_operation',
            response: '',
            steps: [{
                id: 'computer-move',
                title: `移动 ${match[1]} 到 ${match[2]}`,
                tool: 'computer',
                args: { action: 'move', source: stripTrailingPunctuation(match[1]), target: stripTrailingPunctuation(match[2]) }
            }]
        };
    }
    match = normalized.match(/(?:删除|移到回收|trash|delete|rm)\s+(?:文件|目录|路径)?\s*([^\s，。；;]+)/i);
    if (match && looksLikePath(match[1])) {
        return {
            intent: 'computer_operation',
            response: '',
            steps: [{
                id: 'computer-delete',
                title: `删除 ${match[1]}`,
                tool: 'computer',
                args: { action: 'delete', path: stripTrailingPunctuation(match[1]), trash: true }
            }]
        };
    }
    match = normalized.match(/(?:创建目录|新建目录|创建文件夹|新建文件夹|mkdir)\s+([^\s，。；;]+)/i);
    if (match) {
        return {
            intent: 'computer_operation',
            response: '',
            steps: [{
                id: 'computer-mkdir',
                title: `创建目录 ${match[1]}`,
                tool: 'computer',
                args: { action: 'mkdir', path: stripTrailingPunctuation(match[1]) }
            }]
        };
    }
    return null;
}

function parseComputerProcessCommand(message) {
    const normalized = compactText(message);
    let match = normalized.match(/^(?:\/(?:spawn|start_process)|后台运行|启动长进程|启动后台任务)\s+([\s\S]+)$/i);
    if (match) {
        return {
            intent: 'computer_operation',
            response: '',
            steps: [{
                id: 'computer-session-start',
                title: `启动进程会话 ${match[1]}`,
                tool: 'computer',
                args: { action: 'session_start', command: match[1].trim() }
            }]
        };
    }
    if (/(进程会话|后台任务|process sessions?|process_list|ps)/i.test(normalized) && /(查看|列出|list|ps)/i.test(normalized)) {
        return {
            intent: 'computer_operation',
            response: '',
            steps: [{
                id: 'computer-process-list',
                title: '列出进程会话',
                tool: 'computer',
                args: { action: 'process_list' }
            }]
        };
    }
    match = normalized.match(/(?:读取|查看|poll|log)\s*(?:进程|会话|process)?\s*([0-9a-f-]{12,})/i);
    if (match) {
        return {
            intent: 'computer_operation',
            response: '',
            steps: [{
                id: 'computer-process-read',
                title: `读取进程会话 ${match[1]}`,
                tool: 'computer',
                args: { action: 'process_read', sessionId: match[1] }
            }]
        };
    }
    return null;
}

function parseComputerOperationCommand(message) {
    return (
        parseComputerJsonCommand(message) ||
        parseComputerListCommand(message) ||
        parseComputerSearchCommand(message) ||
        parseComputerFileMutationCommand(message) ||
        parseComputerProcessCommand(message)
    );
}

function parseCodeJsonCommand(message) {
    const match = message.match(/^\/(?:code|git|repo|lsp)\s+([A-Za-z_ -]+)?\s*([\s\S]*)$/i);
    if (!match) {
        return null;
    }
    const actionAlias = normalizeText(match[1], 'schema').toLowerCase().replace(/\s+/g, '_');
    const actionMap = {
        help: 'schema',
        schema: 'schema',
        status: 'git_status',
        git_status: 'git_status',
        diff: 'git_diff',
        git_diff: 'git_diff',
        log: 'git_log',
        branch: 'git_branch',
        commit: 'git_commit',
        search: 'search',
        index: 'index',
        semantic_index: 'semantic_index',
        symbols: 'symbols',
        outline: 'symbols',
        rename: 'rename_symbol',
        rename_symbol: 'rename_symbol',
        diagnostics: 'lsp_diagnostics',
        lsp_diagnostics: 'lsp_diagnostics',
        lsp_status: 'lsp_status',
        test: 'test',
        ci: 'ci_status',
        ci_status: 'ci_status',
        pr: 'pr_create',
        pr_create: 'pr_create'
    };
    const action = actionMap[actionAlias] || actionAlias || 'schema';
    const rawArgs = normalizeText(match[2]);
    const args = rawArgs ? safeJsonParse(rawArgs) : {};
    if (rawArgs && (!args || typeof args !== 'object' || Array.isArray(args))) {
        return {
            intent: 'invalid_code_command',
            response: '代码工具调用需要 JSON 参数，例如：/code git_status {}、/code search {"query":"foo"}、/code symbols {"path":"src/app.js"}。',
            steps: []
        };
    }
    return {
        intent: 'code_operation',
        response: '',
        steps: [{
            id: `code-${action}`,
            title: `代码操作 ${action}`,
            tool: 'code',
            args: {
                action,
                ...(args || {})
            }
        }]
    };
}

function parseCodeNaturalCommand(message) {
    const normalized = compactText(message);
    if (/(git 状态|git status|仓库状态|代码状态)/i.test(normalized)) {
        return {
            intent: 'code_operation',
            response: '',
            steps: [{ id: 'code-git-status', title: '查看 Git 状态', tool: 'code', args: { action: 'git_status' } }]
        };
    }
    const searchMatch = normalized.match(/(?:搜索代码|代码搜索|查找代码|search code)\s*[:：]?\s*([^\n]+)$/i);
    if (searchMatch) {
        return {
            intent: 'code_operation',
            response: '',
            steps: [{
                id: 'code-search',
                title: `搜索代码 ${searchMatch[1]}`,
                tool: 'code',
                args: { action: 'search', query: stripTrailingPunctuation(searchMatch[1]) }
            }]
        };
    }
    const symbolsMatch = normalized.match(/(?:查看符号|代码大纲|symbols?|outline)\s*[:：]?\s*([^\s，。；;]+)$/i);
    if (symbolsMatch && looksLikePath(symbolsMatch[1])) {
        return {
            intent: 'code_operation',
            response: '',
            steps: [{
                id: 'code-symbols',
                title: `查看代码符号 ${symbolsMatch[1]}`,
                tool: 'code',
                args: { action: 'symbols', path: stripTrailingPunctuation(symbolsMatch[1]) }
            }]
        };
    }
    return null;
}

function parseCodeOperationCommand(message) {
    return parseCodeJsonCommand(message) || parseCodeNaturalCommand(message);
}

function buildUnsupportedTaskPlan(message) {
    const normalized = compactText(message);
    const taskish =
        /^(帮我|请|请你|给我|把).*(做|实现|开发|修改|修复|检查|测试|运行|启动|安装|下载|生成|创建|新建|删除|移动|复制|搜索|查找|整理)/i.test(normalized) ||
        /(做一个|实现一个|开发一个|修复一下|检查一下|测试一下|启动一下|安装一下|下载一下|生成一个|整理成|搜索一下|查找一下)/i.test(normalized);

    if (!taskish) {
        return null;
    }

    return {
        intent: 'task_clarification',
        response: '我把这句话识别成任务请求了，不过 v0 还没有足够明确的可执行步骤。你可以把目标说得更具体一点，比如“读取某个文件”“写入某个文件”“抓取某个网页”，或者直接用 /tool 指定工具参数。',
        steps: []
    };
}

function buildConversationPlan(message) {
    const normalized = compactText(message);
    if (/^(你好|hello|hi|嗨|哈喽)/i.test(normalized)) {
        return {
            intent: 'emotional_chat',
            response: '我在，已经接到统一的 HumanClaw Agent 链路了。你可以只是和我说说话，也可以直接把任务交给我，我会自己判断要不要动工具。',
            steps: []
        };
    }

    if (/(累|疲惫|难受|焦虑|压力|孤独|不开心|伤心|烦|崩溃|害怕|失眠|emo)/i.test(normalized)) {
        return {
            intent: 'emotional_chat',
            response: '我听见了。先不用急着把自己推起来，我们可以慢一点说。你愿意的话，我可以先陪你把现在最压着你的那一件事拆小一点。',
            steps: []
        };
    }

    if (/(谢谢|感谢|辛苦|做得好|不错|可以|厉害)/i.test(normalized)) {
        return {
            intent: 'emotional_chat',
            response: '收到。能把事情往前推一点我就很开心。下一步你继续直接说目标就行，我会判断是陪你聊，还是进入任务执行。',
            steps: []
        };
    }

    if (/(你能做什么|怎么用|能干嘛|支持什么|有哪些能力)/i.test(normalized)) {
        return {
            intent: 'capability_chat',
            response: '现在我统一走 HumanClaw Agent。普通对话我直接回应；遇到明确任务，我会规划并调用 Gateway 工具，比如读写文件、抓网页、应用 patch，危险命令会先停下来等确认。',
            steps: []
        };
    }

    return {
        intent: 'casual_chat',
        response: '我在听。这个统一入口会先按对话理解你：如果只是聊天，我就陪你聊；如果出现明确可执行目标，我再进入工具执行流程。',
        steps: []
    };
}

function planMessage(message) {
    const normalized = normalizeText(message);
    if (!normalized) {
        return {
            intent: 'empty',
            response: '这次消息是空的，我还没有可以执行的任务。',
            steps: []
        };
    }

    return (
        parseExplicitToolCommand(normalized) ||
        parsePatchCommand(normalized) ||
        parseWriteCommand(normalized) ||
        parseFetchCommand(normalized) ||
        parseReadCommand(normalized) ||
        parseEmailCommand(normalized) ||
        parseFileManagementCommand(normalized) ||
        parseCodeOperationCommand(normalized) ||
        parseComputerOperationCommand(normalized) ||
        parseExecCommand(normalized) ||
        buildUnsupportedTaskPlan(normalized) ||
        buildConversationPlan(normalized)
    );
}

function getPlanMode(plan) {
    if (plan.steps.length > 0 || /^task_|.*_command$|.*_file$|web_fetch|apply_patch|explicit_tool|invalid_tool_command/.test(plan.intent || '')) {
        return 'task';
    }
    return 'conversation';
}

function buildToolContext(requestContext = {}, fallbackWorkspace, sessionId) {
    const context = {
        workspace: requestContext.workspace || fallbackWorkspace,
        sessionKey: requestContext.sessionKey || sessionId || 'main',
        timeoutMs: Number(requestContext.timeoutMs || DEFAULT_RUN_TIMEOUT_MS)
    };

    if (requestContext.approved === true) {
        context.approved = true;
    }
    if (requestContext.executeExternal === true) {
        context.executeExternal = true;
    }
    for (const key of [
        'permissionProfile',
        'permissions',
        'policy',
        'sandbox',
        'approvalPolicy',
        'confirmationPolicy',
        'requireApprovalForMutations',
        'autoConfirm',
        'allowOutsideWorkspace',
        'allowComputerWideAccess',
        'allowSystemMutation',
        'computerControlEnabled',
        'visionApproved',
        'visionPermissionPolicy',
        'visionPolicy'
    ]) {
        if (requestContext[key] !== undefined) {
            context[key] = requestContext[key];
        }
    }

    return context;
}

function formatStepResult(stepResult) {
    const title = stepResult.title || stepResult.tool;
    if (!stepResult.response) {
        return `**${title}**：未返回结果。`;
    }

    if (!stepResult.response.ok) {
        const status = stepResult.response.status || 'error';
        const error = stepResult.response.error ? `，${stepResult.response.error}` : '';
        if (status === 'needs_approval') {
            return `**${title}**：需要确认后才能执行。`;
        }
        return `**${title}**：${status}${error}`;
    }

    const text = extractToolResultText(stepResult.response.result);
    if (!text) {
        return `**${title}**：完成。`;
    }
    return `**${title}**：\n\n\`\`\`text\n${summarize(text).replace(/```/g, '``\\`')}\n\`\`\``;
}

function formatStepResultBrief(stepResult) {
    const title = stepResult.title || stepResult.tool || '工具步骤';
    if (!stepResult.response) {
        return `- ${title}：没有返回结果`;
    }
    const status = stepResult.response.status || (stepResult.response.ok ? 'completed' : 'error');
    if (!stepResult.response.ok) {
        return `- ${title}：${status}`;
    }
    return `- ${title}：完成`;
}

function formatRunResponse({ plan, stepResults, status, dryRun }) {
    if (!plan.steps.length) {
        return plan.response;
    }

    if (dryRun) {
        return [
            '**我已经识别到这个任务，计划如下：**',
            ...plan.steps.map((step, index) => `${index + 1}. ${step.title}`)
        ].join('\n');
    }

    if (status === 'needs_approval') {
        return [
            '**这个任务需要确认后才能继续执行。**',
            ...stepResults.map((result) => formatStepResult(result))
        ].join('\n');
    }

    if (status !== 'completed') {
        return [
            `**任务没有完整完成，当前状态：${status}。**`,
            ...stepResults.map((result) => formatStepResult(result))
        ].join('\n');
    }

    return [
        '**完成了。**',
        ...stepResults.map((result) => formatStepResult(result))
    ].join('\n');
}

function shouldUseLlmAgent(request = {}, requestContext = {}) {
    return (
        request.agentLoop === 'llm' ||
        request.agentMode === 'llm' ||
        request.planner === 'llm' ||
        requestContext.agentLoop === 'llm' ||
        requestContext.agentMode === 'llm' ||
        requestContext.planner === 'llm' ||
        requestContext.useLlmPlanner === true
    );
}

function resolveAgentLlmSettings(request = {}, requestContext = {}) {
    const settings = request.llmSettings || requestContext.llmSettings || requestContext.llm || request.llm || {};
    return {
        provider: normalizeText(settings.provider || process.env.HUMANCLAW_AGENT_LLM_PROVIDER, 'openai-compatible'),
        baseUrl: normalizeText(
            settings.baseUrl ||
                settings.apiBase ||
                process.env.HUMANCLAW_AGENT_LLM_BASE_URL ||
                process.env.AIGRIL_LLM_BASE_URL
        ),
        apiKey: normalizeText(
            settings.apiKey ||
                settings.key ||
                process.env.HUMANCLAW_AGENT_LLM_API_KEY ||
                process.env.AIGRIL_LLM_API_KEY
        ),
        model: normalizeText(
            settings.model ||
                process.env.HUMANCLAW_AGENT_LLM_MODEL ||
                process.env.AIGRIL_LLM_MODEL
        ),
        temperature: settings.temperature ?? 0.2,
        timeoutMs: settings.timeoutMs || settings.requestTimeoutMs || 45000
    };
}

function extractJsonObject(text) {
    const normalized = normalizeText(text);
    if (!normalized) {
        return null;
    }
    try {
        return JSON.parse(normalized);
    } catch {}
    const fenced = normalized.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (fenced) {
        try {
            return JSON.parse(fenced[1]);
        } catch {}
    }
    const start = normalized.indexOf('{');
    const end = normalized.lastIndexOf('}');
    if (start >= 0 && end > start) {
        try {
            return JSON.parse(normalized.slice(start, end + 1));
        } catch {}
    }
    return null;
}

function normalizeToolAction(value, fallback = '') {
    return normalizeText(value, fallback).toLowerCase().replace(/[-\s]+/g, '_');
}

function redactPromptObject(value) {
    if (Array.isArray(value)) {
        return value.map((entry) => redactPromptObject(entry));
    }
    if (!value || typeof value !== 'object') {
        return value;
    }
    const redacted = {};
    for (const [key, entry] of Object.entries(value)) {
        if (/token|password|secret|api[_-]?key|authorization|credential|pass|auth[_-]?code/i.test(key)) {
            redacted[key] = '__REDACTED__';
        } else {
            redacted[key] = redactPromptObject(entry);
        }
    }
    return redacted;
}

function normalizeExplicitMemoryContext(value) {
    if (!value) {
        return '';
    }
    if (typeof value === 'string') {
        return normalizeText(value);
    }
    if (typeof value !== 'object') {
        return normalizeText(String(value || ''));
    }
    return JSON.stringify(redactPromptObject(value), null, 2);
}

function resolveEmailProfileSummaries(emailProfiles = {}) {
    const profiles = emailProfiles && typeof emailProfiles === 'object' ? emailProfiles : {};
    return ['qq', 'gmail', 'outlook'].map((provider) => {
        const profile = profiles[provider] && typeof profiles[provider] === 'object' ? profiles[provider] : {};
        const account = normalizeText(profile.account || profile.email || profile.username || profile.user);
        const hasSecret = Boolean(
            profile.secret ||
                profile.password ||
                profile.pass ||
                profile.appPassword ||
                profile.authCode ||
                profile.authorizationCode ||
                profile.accessToken ||
                profile.token
        );
        return {
            provider,
            account: account || '',
            status: account && hasSecret ? 'ready' : account ? 'missing_secret' : 'not_configured',
            authType: normalizeText(profile.authType || profile.auth?.type, 'password')
        };
    });
}

function buildInitialPlanHint(initialPlan) {
    if (!initialPlan || typeof initialPlan !== 'object') {
        return null;
    }
    const steps = Array.isArray(initialPlan.steps)
        ? initialPlan.steps
              .map((step) => ({
                  title: normalizeText(step.title),
                  tool: normalizeText(step.tool),
                  args: step.args && typeof step.args === 'object' && !Array.isArray(step.args) ? redactPromptObject(step.args) : {}
              }))
              .filter((step) => step.tool)
              .slice(0, 4)
        : [];
    if (!steps.length && (!initialPlan.intent || initialPlan.intent === 'casual_chat')) {
        return null;
    }
    return {
        intent: normalizeText(initialPlan.intent),
        suggested_steps: steps
    };
}

function buildEmailAgentSkillText(emailProfiles = {}) {
    const profileSummaries = resolveEmailProfileSummaries(emailProfiles)
        .map((profile) => {
            const account = profile.account ? ` account=${profile.account}` : '';
            return `${profile.provider}:${profile.status}${account} auth=${profile.authType}`;
        })
        .join('; ');
    return [
        '邮箱 SKILL：当用户要求检查、读取、搜索、整理或发送邮件时，必须优先使用 tool="email"，不要用 computer.exec 打开系统邮件客户端、浏览器邮箱网页或 OS 命令来代替邮箱工具。',
        `已配置邮箱状态（不含密钥）：${profileSummaries || 'unknown'}`,
        'email 读取类 action：providers/schema/list/search/inbox/read/get/gmail_list_labels/gmail_list_threads/gmail_get_thread/outlook_graph_messages/outlook_graph_message/outlook_graph_folders。',
        'email 写入/变更类 action：draft/compose/send/mark_read/mark_unread/move/delete。send、标记、移动、删除属于高风险动作，需要 Gateway 审批。',
        '检查“有没有新邮件/未读邮件”时，第一步使用 {"tool":"email","args":{"action":"list","filter":"unread","limit":10}}；如果用户说“今天”，加 since=YYYY-MM-DD；如果只说“最近”，用 action=list limit=10。',
        '查看邮件详情时，先 list/search 找 uid 或 messageId，再用 read/get 读取具体邮件。总结邮件时根据 observation 中的列表决定是否继续 read。',
        '如果 email 工具返回 needs_config，不要臆造 IMAP 信息；直接告诉用户去控制面板配置对应 provider 的账号和授权码/OAuth token。',
        '不要发明 email action。尤其不要输出 check_new、open_mail、mail、browser_email；这些必须表达为 email.list/search/read。'
    ].join('\n');
}

function buildComputerAgentSkillText() {
    return [
        '电脑操作 SKILL：用于操作本机文件系统、命令行、进程、PTY、文件监听、二进制读写、ACL 和回滚。',
        '优先读取/检查再修改；修改后复核。会改变系统或文件的动作必须走 Gateway 审批策略。',
        'computer action：list/tree/stat/read/write/write_binary/append/mkdir/copy/move/rename/delete/search/hash/du/exec/session_start/process_read/process_write/process_kill/pty_start/pty_write/pty_kill/watch/watch_stop/rollback_list/rollback_restore/acl_get/acl_set。',
        'Windows 命令行默认是 PowerShell 语境；不要输出 macOS-only 命令，例如 open -a。'
    ].join('\n');
}

function buildFileManagerAgentSkillText() {
    return [
        '文件整理 SKILL：用于扫描、归类、清理临时文件、下载目录、桌面、文档和 C 盘安全清理。',
        '优先 dry-run/plan，再 quarantine 或 move；不要直接永久删除用户文件。',
        'file_manager action：profiles/scan/plan_clean/clean/plan_organize/organize/quarantine/restore。'
    ].join('\n');
}

function buildCodeAgentSkillText() {
    return [
        '代码 SKILL：用于代码搜索、符号索引、诊断、AST 级重构、测试、Git 和 PR/CI 工作流。',
        '先理解仓库和测试方式，再改代码；改后运行最相关验证。',
        'code action：search/symbols/diagnostics/refactor_rename/test/git_status/git_diff/git_commit/pr_create/ci_status。'
    ].join('\n');
}

function buildMcpBridgeSkillText() {
    return [
        'MCP SKILL：用于发现已配置 MCP server，并通过真实 stdio/HTTP MCP session 调用 tools、读取 resources/prompts。',
        '先用 mcp_bridge list_servers/health_check/list_tools/list_resources/list_prompts 发现能力，再按具体 MCP tool/resource/prompt 调用。',
        'mcp_bridge action：schema/list_servers/register_server/remove_server/health_check/list_tools/list_resources/read_resource/list_prompts/get_prompt/call_tool/shutdown_server。'
    ].join('\n');
}

function buildVisionAgentSkillText() {
    return [
        'VISION SKILL：AIGL 的只读视觉感知层，用于在文本不足时“看一眼”屏幕、聊天窗口或框选区域。',
        '边界：只能截图并理解，不允许点击、输入、拖动、连续监控屏幕，不能声称已经操作了用户电脑。',
        `工具：${VISION_TOOL_ID}`,
        'schema：tool_call={tool:"vision.capture_context", title:"看一眼屏幕", args:{action:"capture_context", target:"screen|chat-window|active-window|region", reason:"为什么需要看", question:"希望从截图中判断什么"}}。',
        '触发：用户说“看一下屏幕/这个报错/这里怎么弄”，或你判断仅靠文字无法可靠回答时。',
        '权限：Agent Loop 主动看屏幕前需要用户确认。被确认后工具会返回截图附件元数据和 VisionUnderstandingSkill 的文字 observation。',
        '回答：基于 observation 自然回复用户，明确“我看到/不确定/建议下一步”，不要输出工具日志口吻。'
    ].join('\n');
}

function normalizeCapabilityId(value) {
    const id = normalizeToolAction(value);
    return CAPABILITY_ID_ALIASES.get(id) || id;
}

function normalizeCapabilityList(value) {
    const raw = Array.isArray(value)
        ? value
        : typeof value === 'string'
            ? value.split(/[,\s]+/)
            : [];
    return [...new Set(raw.map(normalizeCapabilityId).filter(Boolean))];
}

function buildAgentCapabilityCatalog() {
    return {
        skills: AGENT_SKILL_CATALOG,
        tools: AGENT_TOOL_CATALOG,
        mcp: AGENT_MCP_CATALOG,
        tool_contracts: listToolContractSummaries(
            AGENT_TOOL_CATALOG.map((tool) => tool.id)
        ),
        load_protocol: {
            action: 'load_context',
            request_shape: {
                skills: ['email'],
                tools: ['email'],
                mcp: ['mcp_bridge']
            }
        }
    };
}

function sanitizeCapabilityRequest(value = {}) {
    const candidate = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
    const skills = normalizeCapabilityList(candidate.skills || candidate.skill || candidate.skill_ids || candidate.skillIds);
    const tools = normalizeCapabilityList(candidate.tools || candidate.tool || candidate.tool_ids || candidate.toolIds);
    const mcp = normalizeCapabilityList(candidate.mcp || candidate.mcps || candidate.mcp_servers || candidate.mcpServers);
    const reason = normalizeText(candidate.reason || candidate.summary || candidate.why);
    return {
        skills,
        tools,
        mcp,
        reason,
        hasAny: Boolean(skills.length || tools.length || mcp.length)
    };
}

function buildSkillContextText(skillId, { emailProfiles = {} } = {}) {
    const packaged = buildHumanClawSkillContextText(skillId, { emailProfiles });
    if (packaged) {
        return packaged;
    }
    if (skillId === 'vision') {
        return buildVisionAgentSkillText();
    }
    if (skillId === 'email') {
        return buildEmailAgentSkillText(emailProfiles);
    }
    if (skillId === 'computer') {
        return buildComputerAgentSkillText();
    }
    if (skillId === 'file_manager') {
        return buildFileManagerAgentSkillText();
    }
    if (skillId === 'code') {
        return buildCodeAgentSkillText();
    }
    if (skillId === 'mcp_bridge') {
        return buildMcpBridgeSkillText();
    }
    return '';
}

function appendToolContractText(toolId, body) {
    const contractText = getToolContractPromptText(toolId);
    return [body, contractText].filter(Boolean).join('\n\n');
}

function buildToolContextText(toolId, { emailProfiles = {} } = {}) {
    if (toolId === VISION_TOOL_ID || toolId === 'vision') {
        return appendToolContractText(VISION_TOOL_ID, [
            `TOOL ${VISION_TOOL_ID} schema：`,
            buildVisionAgentSkillText()
        ].join('\n'));
    }
    if (toolId === 'email') {
        return appendToolContractText('email', [
            'TOOL email schema：',
            buildEmailAgentSkillText(emailProfiles)
        ].join('\n'));
    }
    if (toolId === 'computer') {
        return appendToolContractText('computer', [
            'TOOL computer schema：',
            buildComputerAgentSkillText()
        ].join('\n'));
    }
    if (toolId === 'file_manager') {
        return appendToolContractText('file_manager', [
            'TOOL file_manager schema：',
            buildFileManagerAgentSkillText()
        ].join('\n'));
    }
    if (toolId === 'code') {
        return appendToolContractText('code', [
            'TOOL code schema：',
            buildCodeAgentSkillText()
        ].join('\n'));
    }
    if (toolId === 'update_plan') {
        return appendToolContractText('update_plan', 'TOOL update_plan schema：用于向 runtime 记录进度，不代表任务完成。');
    }
    if (toolId === 'subagents') {
        return appendToolContractText('subagents', 'TOOL subagents schema：用于可执行子 Agent，spawn 参数 task/message/prompt，wait=true 可同步等待结果。');
    }
    if (toolId === 'mcp_bridge') {
        return appendToolContractText('mcp_bridge', [
            'TOOL mcp_bridge schema：',
            buildMcpBridgeSkillText()
        ].join('\n'));
    }
    return '';
}

function buildCapabilityContextEvent({ capabilityRequest, emailProfiles = {}, iteration = 0 }) {
    const loaded = {
        skills: [],
        tools: [],
        mcp: []
    };
    const missing = {
        skills: [],
        tools: [],
        mcp: []
    };
    const sections = [];
    for (const skillId of capabilityRequest.skills || []) {
        const text = buildSkillContextText(skillId, { emailProfiles });
        if (text) {
            loaded.skills.push(skillId);
            sections.push(`### skill:${skillId}\n${text}`);
        } else {
            missing.skills.push(skillId);
        }
    }
    for (const toolId of capabilityRequest.tools || []) {
        const text = buildToolContextText(toolId, { emailProfiles });
        if (text) {
            loaded.tools.push(toolId);
            sections.push(`### tool:${toolId}\n${text}`);
        } else {
            missing.tools.push(toolId);
        }
    }
    for (const mcpId of capabilityRequest.mcp || []) {
        const text = buildSkillContextText(mcpId, { emailProfiles }) || buildToolContextText(mcpId, { emailProfiles });
        if (text) {
            loaded.mcp.push(mcpId);
            sections.push(`### mcp:${mcpId}\n${text}`);
        } else {
            missing.mcp.push(mcpId);
        }
    }
    const content = sections.length
        ? sections.join('\n\n')
        : '没有加载到新的能力上下文。请从 capability_catalog 中选择有效的 skills/tools/mcp id。';
    return {
        type: 'capability_context',
        iteration,
        status: sections.length ? 'loaded' : 'not_found',
        request: capabilityRequest,
        loaded,
        missing,
        content
    };
}

function sanitizeEmailAgentStep(step, index, phase) {
    const rawArgs = step.args && typeof step.args === 'object' && !Array.isArray(step.args) ? step.args : {};
    const rawAction = normalizeToolAction(rawArgs.action || rawArgs.operation || rawArgs.intent, 'list');
    const action = EMAIL_ACTION_ALIASES.get(rawAction) || rawAction;
    const args = {
        ...rawArgs,
        action
    };
    delete args.approved;
    delete args.dangerous;
    if ((EMAIL_UNREAD_ACTION_HINTS.has(rawAction) || /新邮件|未读|unread|unseen/i.test(`${rawArgs.query || ''} ${rawArgs.search || ''} ${rawArgs.filter || ''}`)) && !args.filter) {
        args.filter = 'unread';
    }
    if ((rawAction === 'latest' || rawAction === 'recent' || EMAIL_UNREAD_ACTION_HINTS.has(rawAction)) && !args.limit) {
        args.limit = 10;
    }
    const context = {
        ...(step.context || {})
    };
    delete context.approved;
    return {
        ...step,
        id: normalizeText(step.id, `email-${phase}-${index + 1}`),
        title: normalizeText(step.title, `邮箱操作 ${action}`),
        tool: 'email',
        phase,
        args,
        context
    };
}

function validateAgentToolStep(step) {
    if (!step) {
        return { ok: false, status: 'invalid_agent_tool_call', error: '缺少工具调用。' };
    }
    if (step.tool === 'email') {
        const action = normalizeToolAction(step.args?.action || step.args?.operation || step.args?.intent, 'list');
        if (!EMAIL_AGENT_ACTIONS.has(action)) {
            return {
                ok: false,
                status: 'invalid_tool_args',
                error: `email action "${action}" 不在邮箱 SKILL 支持列表中，请改用 list/search/read/draft/send/mark_read/mark_unread/move/delete 等标准 action。`,
                details: {
                    tool: 'email',
                    invalidAction: action,
                    supportedActions: EMAIL_AGENT_ACTION_LIST
                }
            };
        }
    }
    return { ok: true };
}

function buildInvalidToolStepResult(step, validation, iteration) {
    return {
        id: step.id,
        title: step.title,
        tool: step.tool,
        args: step.args,
        phase: step.phase || 'execute',
        iteration,
        response: {
            ok: false,
            status: validation.status || 'invalid_tool_args',
            error: validation.error,
            details: validation.details,
            result: {
                content: [
                    {
                        type: 'text',
                        text: validation.error
                    }
                ],
                isError: true,
                details: validation.details
            }
        }
    };
}

function sanitizeLlmStep(step, index) {
    if (!step || typeof step !== 'object') {
        return null;
    }
    const allowedTools = new Set([
        'email',
        'file_manager',
        'computer',
        'code',
        VISION_TOOL_ID,
        'update_plan',
        'subagents',
        'mcp_bridge',
        'read',
        'write',
        'edit',
        'web_fetch',
        'exec',
        'apply_patch'
    ]);
    const tool = normalizeText(step.tool || step.name);
    if (!allowedTools.has(tool)) {
        return null;
    }
    let args = step.args || step.arguments || step.input || {};
    if (typeof args === 'string') {
        args = safeJsonParse(args) || {};
    }
    return {
        id: normalizeText(step.id, `llm-step-${index + 1}`),
        title: normalizeText(step.title, `${tool} ${args?.action || ''}`.trim()),
        tool,
        args: args && typeof args === 'object' && !Array.isArray(args) ? args : {},
        context: step.context && typeof step.context === 'object' && !Array.isArray(step.context) ? step.context : {}
    };
}

function sanitizeComputerPlannerStep(step, index, phase = 'execute') {
    const sanitized = sanitizeLlmStep(step, index);
    if (!sanitized || sanitized.tool !== 'computer') {
        return null;
    }
    const action = normalizeText(sanitized.args.action || sanitized.args.operation || sanitized.args.intent, 'schema').toLowerCase();
    const args = {
        ...sanitized.args,
        action
    };
    delete args.approved;
    delete args.dangerous;
    const context = {
        ...(sanitized.context || {})
    };
    delete context.approved;
    return {
        ...sanitized,
        id: normalizeText(sanitized.id, `computer-${phase}-${index + 1}`),
        title: normalizeText(sanitized.title, `电脑操作 ${action}`),
        tool: 'computer',
        phase,
        args,
        context
    };
}

function stepNeedsConfirmation(step) {
    if (!step || step.tool !== 'computer') {
        return true;
    }
    const action = normalizeText(step.args?.action || step.args?.operation || step.args?.intent).toLowerCase();
    return COMPUTER_MUTATING_ACTIONS.has(action);
}

function isConfirmationMessage(message) {
    return /^(确认|确认执行|批准|同意|允许|可以|可以看|看吧|你看吧|看一下|可以执行|开始执行|执行吧|继续|approve|approved|confirm|yes|y|ok)$/i.test(compactText(message));
}

function isCancelMessage(message) {
    return /^(取消|别执行|不要执行|停止|算了|不看|先别看|不用看|别看|cancel|stop|no|n)$/i.test(compactText(message));
}

function isPlanExpired(plan) {
    return Boolean(plan?.expiresAt && Date.now() > plan.expiresAt);
}

function displayPlanLines(steps = []) {
    return steps.map((step, index) => {
        const action = normalizeText(step.args?.action, 'schema');
        const target = normalizeText(step.args?.path || step.args?.target || step.args?.source || step.args?.command || step.args?.dir);
        return `${index + 1}. ${step.title || `computer.${action}`}${target ? `：${target}` : ''}`;
    });
}

function buildPlanConfirmationText(plan) {
    const lines = [
        '我已经把任务拆成可执行计划，但还没有动你的电脑。',
        plan.summary ? `目标：${plan.summary}` : '',
        `确认编号：${plan.planId}`,
        '计划步骤：',
        ...displayPlanLines(plan.steps),
        plan.verificationSteps?.length ? '复核步骤：' : '',
        ...displayPlanLines(plan.verificationSteps || []),
        '如果确认，请回复“确认执行”；如果不执行，请回复“取消”。'
    ].filter(Boolean);
    return lines.join('\n');
}

function buildLlmPlannerMessages({ message, observations = [], toolSummary = '' }) {
    const system = [
        AIGL_SYSTEM_PROMPT,
        '',
        '【HumanClaw LLM Planner 控制协议】',
        '在保持 AIGL 人设、语气、动作/表情指令规范的前提下，你同时运行 HumanClaw LLM Planner，一个桌面电脑操作智能体。',
        '你的任务是把复杂目标拆成多步 computer 工具调用，并提供执行后的复核步骤。',
        '情感对话：直接返回 final_answer，不调用工具。',
        '任务执行：只使用 tool="computer"，不要使用 code/email/file_manager/read/write/exec 这些旧工具名。',
        '优先用安全、可复核的步骤：先 list/stat/read/search，再 mkdir/write/copy/move/exec，最后用 read/list/stat/hash/search 复核。',
        '危险动作由 Gateway 的 approval gate 和 plan confirmation 处理，你不要在 args 或 context 里写 approved=true。',
        '只输出 JSON，JSON 外不要输出 Markdown。final_answer 字段是给用户看的 Markdown 字符串，可以使用短标题、列表、代码块和加粗。',
        'JSON 格式：{"mode":"conversation|task","intent":"...","summary":"...","risk_level":"low|medium|high","requires_confirmation":true,"final_answer":"Markdown...","steps":[{"tool":"computer","title":"...","args":{"action":"list|read|write|append|mkdir|copy|move|delete|search|hash|du|exec|session_start|process_read|process_write|process_kill","path":"...","content":"..."}}],"verification_steps":[{"tool":"computer","title":"...","args":{"action":"read|list|stat|search|hash","path":"..."}}]}',
        `computer 工具摘要：${toolSummary || 'filesystem/binary/watch/rollback/shell/pty/process'}`
    ].join('\n');
    const obsText = observations.length
        ? `\n\n已执行 observation：\n${observations.map((item, index) => `${index + 1}. ${summarize(item, 1200)}`).join('\n')}`
        : '';
    return [
        { role: 'system', content: system },
        { role: 'user', content: `用户消息：${message}${obsText}` }
    ];
}

async function callLlmPlanner(settings, payload) {
    const response = await callDesktopLlmProvider(settings, payload);
    if (!response.ok) {
        return {
            ok: false,
            status: response.code || 'llm_error',
            error: response.error || 'LLM planner failed'
        };
    }
    const json = extractJsonObject(response.content);
    if (!json || typeof json !== 'object') {
        return {
            ok: false,
            status: 'invalid_llm_plan',
            error: 'LLM planner 没有返回合法 JSON。',
            raw: response.content
        };
    }
    const steps = Array.isArray(json.steps)
        ? json.steps.map((step, index) => sanitizeLlmStep(step, index)).filter(Boolean)
        : [];
    const verificationSteps = Array.isArray(json.verification_steps || json.verificationSteps)
        ? (json.verification_steps || json.verificationSteps).map((step, index) => sanitizeLlmStep(step, index)).filter(Boolean)
        : [];
    return {
        ok: true,
        mode: json.mode === 'task' || steps.length ? 'task' : 'conversation',
        intent: normalizeText(json.intent, steps.length ? 'llm_task' : 'llm_conversation'),
        summary: normalizeText(json.summary || json.objective || json.goal),
        riskLevel: normalizeText(json.risk_level || json.riskLevel, steps.some(stepNeedsConfirmation) ? 'medium' : 'low'),
        requiresConfirmation: json.requires_confirmation !== false && json.requiresConfirmation !== false,
        finalAnswer: normalizeText(json.final_answer || json.answer || json.response),
        steps,
        verificationSteps,
        raw: json,
        model: response.model,
        usage: response.usage
    };
}

function sanitizeAgentToolCall(toolCall, index, phase = 'execute') {
    const candidate = toolCall?.tool_call || toolCall?.toolCall || toolCall?.step || toolCall;
    const sanitized = sanitizeLlmStep(candidate, index);
    if (!sanitized) {
        return null;
    }
    if (sanitized.tool === 'computer') {
        return sanitizeComputerPlannerStep(sanitized, index, phase);
    }
    if (sanitized.tool === 'email') {
        return sanitizeEmailAgentStep(sanitized, index, phase);
    }
    return {
        ...sanitized,
        id: normalizeText(sanitized.id, `agent-${phase}-${index + 1}`),
        phase
    };
}

function agentStepNeedsConfirmation(step) {
    if (!step) {
        return true;
    }
    if (step.tool === VISION_TOOL_ID) {
        return true;
    }
    if (step.tool === 'computer') {
        const action = normalizeToolAction(step.args?.action || step.args?.operation || step.args?.intent);
        return COMPUTER_MUTATING_ACTIONS.has(action);
    }
    if (step.tool === 'email') {
        const action = normalizeToolAction(step.args?.action || step.args?.operation || step.args?.intent, 'list');
        return EMAIL_AGENT_MUTATING_ACTIONS.has(action);
    }
    if (['read', 'web_fetch'].includes(step.tool)) {
        return false;
    }
    if (step.tool === 'update_plan') {
        return false;
    }
    if (step.tool === 'mcp_bridge') {
        const action = normalizeText(step.args?.action || 'list_servers').toLowerCase();
        return ['tool_call', 'call_tool', 'register_server', 'add_server', 'shutdown_server', 'close_server'].includes(action);
    }
    return true;
}

function isVisionAgentStep(step) {
    return step?.tool === VISION_TOOL_ID;
}

function isFullControlContext(context = {}) {
    const permissionProfile = normalizeText(
        typeof context.permissionProfile === 'string'
            ? context.permissionProfile
            : context.permissionProfile?.id || context.permissions || context.policy || context.sandbox
    ).toLowerCase();
    const approvalPolicy = normalizeText(context.approvalPolicy || context.confirmationPolicy).toLowerCase();
    return (
        context.computerControlEnabled === true &&
        (
            context.approved === true ||
            context.autoConfirm === true ||
            approvalPolicy === 'auto' ||
            permissionProfile === 'danger-full-access' ||
            permissionProfile === 'full-access'
        )
    );
}

function isVisionAutoApprovedContext(context = {}) {
    const visionPolicy = normalizeText(context.visionPermissionPolicy || context.visionPolicy).toLowerCase();
    return (
        context.visionApproved === true ||
        visionPolicy === 'auto' ||
        isFullControlContext(context)
    );
}

function getVisionStepTargetLabel(step) {
    const target = normalizeText(step?.args?.target || step?.args?.source, 'screen').toLowerCase();
    if (target === 'chat-window') {
        return '聊天窗口';
    }
    if (target === 'active-window') {
        return '当前窗口';
    }
    if (target === 'region') {
        return '框选区域';
    }
    return '屏幕';
}

function normalizeAgentAction(value, fallback = '') {
    const action = normalizeText(value, fallback).toLowerCase().replace(/[-\s]+/g, '_');
    if (['tool', 'tool_call', 'call_tool', 'execute', 'computer', 'use_tool'].includes(action)) {
        return 'tool';
    }
    if (['load_context', 'load_capabilities', 'load_capability', 'request_context', 'request_capability', 'load_skill', 'load_tool_schema'].includes(action)) {
        return 'load_context';
    }
    if (['final', 'done', 'finish', 'answer', 'conversation', 'respond'].includes(action)) {
        return 'final';
    }
    if (['blocked', 'fail', 'failed', 'stop', 'need_user', 'needs_user', 'clarify'].includes(action)) {
        return 'blocked';
    }
    return action;
}

function normalizePlanUpdates(value) {
    const raw = value || [];
    if (Array.isArray(raw)) {
        return raw.map((entry) => normalizeText(entry)).filter(Boolean).slice(0, 8);
    }
    const single = normalizeText(raw);
    return single ? [single] : [];
}

function buildAgentEventPreview(event) {
    if (!event) {
        return '';
    }
    if (event.type === 'capability_context') {
        return [
            `capability_context: ${event.status}`,
            event.loaded?.skills?.length ? `skills=${event.loaded.skills.join(',')}` : '',
            event.loaded?.tools?.length ? `tools=${event.loaded.tools.join(',')}` : '',
            event.loaded?.mcp?.length ? `mcp=${event.loaded.mcp.join(',')}` : '',
            event.content ? `content=${summarize(event.content, 1800)}` : ''
        ].filter(Boolean).join(' | ');
    }
    if (event.type === 'tool_result') {
        return [
            `${event.title || event.tool}: ${event.status}`,
            event.ok ? 'ok=true' : 'ok=false',
            event.preview ? `preview=${event.preview}` : ''
        ].filter(Boolean).join(' | ');
    }
    if (event.type === 'tool_call') {
        return `${event.title || event.tool}: ${summarize(event.args, 800)}`;
    }
    return summarize(event, 1000);
}

function buildToolResultEvent(stepResult) {
    return {
        type: 'tool_result',
        id: stepResult.id,
        title: stepResult.title,
        tool: stepResult.tool,
        args: stepResult.args,
        status: stepResult.response?.status || 'unknown',
        ok: stepResult.response?.ok === true,
        preview: summarize(
            extractToolResultText(stepResult.response?.result) ||
                stepResult.response?.error ||
                stepResult.response?.result ||
                stepResult.response,
            1600
        )
    };
}

function buildLlmAgentExecutorMessages({
    message,
    messageHistory = [],
    events = [],
    toolSummary = '',
    maxSteps = DEFAULT_AGENT_LOOP_STEPS,
    emailProfiles = {},
    initialPlan = null,
    memoryContext = ''
}) {
    const initialPlanHint = buildInitialPlanHint(initialPlan);
    const capabilityCatalog = buildAgentCapabilityCatalog();
    const recentConversation = normalizeConversationHistory(messageHistory);
    const system = [
        AIGL_SYSTEM_PROMPT,
        '',
        '【HumanClaw 任务执行控制协议】',
        '在保持 AIGL 人设、语气、动作/表情指令规范的前提下，你同时运行 HumanClaw Agentic Executor，一个桌面任务执行智能体。',
        '你自己判断用户当前输入是普通情感/闲聊，还是需要执行任务；不要依赖外部分类结果。',
        '你不是一次性 Planner。遇到任务时必须按 Codex/OpenClaw 风格逐步执行：观察当前状态，决定下一步，调用一个工具，等待 observation，再决定下一步。',
        '情感/普通对话：返回 action="final" 和 final_answer，不调用工具。final_answer 可以在最开头放 0-1 个动作指令和 0-1 个表情指令，然后用 AIGL 的自然语气回复。',
        '隐私/密钥：可以说明本地保存设计、是否需要重新填写、以及如何检查；不要主动读取或复述完整密钥。没有实际 observation 时不能说“我已经确认文件存在”，只能说“按设计应当/需要的话我可以检查”。',
        '任务执行：每轮最多输出一个动作。动作只能是 load_context、tool、final、blocked。不要一次性输出完整 steps 当作完成，也不要只说计划。',
        '上下文装载协议：首轮只会给你 capability_catalog。需要某个领域的 SKILL、工具 schema 或 MCP 说明时，先输出 action="load_context" 和 capability_request。本地 runtime 会加载对应内容作为 observation，再进入下一轮。',
        'load_context 示例：{"mode":"task","intent":"email_management","summary":"需要邮箱能力","action":"load_context","capability_request":{"skills":["email"],"tools":["email"],"mcp":[],"reason":"需要检查未读邮件"}}',
        '如果下一步需要工具，就输出 action="tool"。如果任务完成，就输出 action="final"。如果无法继续，就输出 action="blocked" 并说明原因。',
        '优先先读取/检查，再修改；修改后主动复核。危险动作由 Gateway 审批，你不要在 args 或 context 里写 approved=true。',
        '视觉感知：如果用户问“屏幕/这里/这个报错/页面怎么弄”且仅靠文字不够，先 load_context vision，再按需调用 vision.capture_context。视觉工具只读，不允许操作屏幕；如果还没看到截图，不要假装已经看到了。',
        '长期记忆：user payload 中的 memory_context 是 AIGL 的本地长期记忆和关系记忆。它只作为辅助上下文；若与用户当前明确指令冲突，以当前指令为准；不要主动向用户暴露内部好感度数值。',
        '工具优先级：vision.capture_context 是只读视觉感知入口；computer 是完整电脑操作入口；code/email/file_manager 只在任务明确需要代码、邮箱、文件整理时使用；read/write/exec/apply_patch 是兼容工具；subagents 用于可执行子 Agent，mcp_bridge 用于真实 MCP server 的 list_tools/call_tool/read_resource。领域工具的详细 schema 需要先 load_context。',
        '可见回复格式：final_answer 字段是给用户看的 Markdown 字符串，可以使用自然段、短列表、代码块和加粗；blocked_reason 也按 Markdown 组织。不要输出 HTML。',
        '只输出 JSON，JSON 外不要输出 Markdown。',
        'JSON 格式：{"mode":"conversation|task","intent":"...","summary":"...","action":"load_context|tool|final|blocked","capability_request":{"skills":[],"tools":[],"mcp":[],"reason":"..."},"plan_update":["..."],"tool_call":{"tool":"vision.capture_context|computer|email|code|file_manager|mcp_bridge|subagents|update_plan|read|write|exec|apply_patch","title":"...","args":{"action":"...","target":"screen|chat-window|active-window|region","reason":"...","question":"..."}},"final_answer":"Markdown...","blocked_reason":"Markdown..."}',
        `最多工具轮数：${maxSteps}`,
        `工具摘要：${toolSummary || 'computer/code/email/file_manager/read/write/exec/apply_patch/web_fetch'}`
    ].join('\n');
    const eventText = events.length
        ? events.map((event, index) => `${index + 1}. ${buildAgentEventPreview(event)}`).join('\n')
        : '暂无 observation。';
    return [
        { role: 'system', content: system },
        {
            role: 'user',
            content: JSON.stringify(
                {
                    user_goal: message,
                    recent_conversation: recentConversation,
                    memory_context: memoryContext || null,
                    initial_plan_hint: initialPlanHint,
                    capability_catalog: capabilityCatalog,
                    current_progress: eventText,
                    observations: eventText
                },
                null,
                2
            )
        }
    ];
}

async function callLlmAgentDecision(settings, payload) {
    const response = await callDesktopLlmProvider(settings, payload);
    if (!response.ok) {
        return {
            ok: false,
            status: response.code || 'llm_error',
            error: response.error || 'LLM agent failed'
        };
    }
    const json = extractJsonObject(response.content);
    if (!json || typeof json !== 'object') {
        return {
            ok: false,
            status: 'invalid_agent_decision',
            error: 'Agentic Executor 没有返回合法 JSON。',
            raw: response.content
        };
    }

    let toolCall = sanitizeAgentToolCall(json.tool_call || json.toolCall || json.next_step || json.nextStep, 0, 'execute');
    let legacyPlan = false;
    if (!toolCall && Array.isArray(json.steps) && json.steps.length) {
        toolCall = sanitizeAgentToolCall(json.steps[0], 0, 'execute');
        legacyPlan = Boolean(toolCall);
    }
    const capabilityRequest = sanitizeCapabilityRequest(
        json.capability_request ||
            json.capabilityRequest ||
            json.load_context ||
            json.loadContext ||
            json.context_request ||
            json.contextRequest ||
            json.request_context ||
            json.requestContext
    );

    const inferredAction = capabilityRequest.hasAny
        ? 'load_context'
        : toolCall
        ? 'tool'
        : normalizeText(json.final_answer || json.answer || json.response)
            ? 'final'
            : '';
    const action = normalizeAgentAction(json.action || json.next_action || json.nextAction, inferredAction);
    const finalAnswer = normalizeText(json.final_answer || json.answer || json.response);
    const blockedReason = normalizeText(json.blocked_reason || json.blockedReason || json.reason || json.error);

    if (action === 'tool' && !toolCall) {
        return {
            ok: false,
            status: 'invalid_agent_tool_call',
            error: 'Agentic Executor 要求调用工具，但没有给出合法 tool_call。',
            raw: json,
            usage: response.usage
        };
    }

    if (action === 'load_context' && !capabilityRequest.hasAny) {
        return {
            ok: false,
            status: 'invalid_capability_request',
            error: 'Agentic Executor 要求加载上下文，但没有给出合法 capability_request。',
            raw: json,
            usage: response.usage
        };
    }

    if (!['load_context', 'tool', 'final', 'blocked'].includes(action)) {
        return {
            ok: false,
            status: 'plan_only_or_unknown_action',
            error: 'Agentic Executor 只给出了计划或未知 action，没有给出上下文装载、工具调用、最终回答或阻塞原因。',
            raw: json,
            usage: response.usage
        };
    }

    return {
        ok: true,
        mode: json.mode === 'conversation' && action !== 'tool' ? 'conversation' : 'task',
        intent: normalizeText(json.intent, action === 'tool' ? 'llm_agent_tool_call' : 'llm_agent_final'),
        summary: normalizeText(json.summary || json.objective || json.goal),
        riskLevel: normalizeText(json.risk_level || json.riskLevel, toolCall && agentStepNeedsConfirmation(toolCall) ? 'medium' : 'low'),
        action,
        finalAnswer,
        blockedReason,
        toolCall,
        capabilityRequest,
        planUpdates: normalizePlanUpdates(json.plan_update || json.planUpdate || json.plan),
        legacyPlan,
        raw: json,
        model: response.model,
        usage: response.usage
    };
}

async function callLlmReviewer(settings, { message, plan, stepResults, verificationResults }) {
    const response = await callDesktopLlmProvider(settings, {
        temperature: 0.1,
        messages: [
            {
                role: 'system',
                content: [
                    '你是 HumanClaw 任务复核器。',
                    '根据目标、计划、执行结果、复核结果判断任务是否完成。',
                    '只输出 JSON，JSON 外不要输出 Markdown。final_answer 字段是给用户看的 Markdown 字符串：{"ok":true|false,"final_answer":"Markdown...","issues":["..."],"follow_up_steps":[{"tool":"computer","title":"...","args":{}}]}'
                ].join('\n')
            },
            {
                role: 'user',
                content: JSON.stringify({
                    goal: message,
                    plan: plan.steps,
                    verificationPlan: plan.verificationSteps,
                    stepResults: stepResults.map((item) => ({
                        title: item.title,
                        tool: item.tool,
                        status: item.response?.status,
                        ok: item.response?.ok,
                        result: summarize(item.response?.result || item.response?.error || item.response, 1600)
                    })),
                    verificationResults: verificationResults.map((item) => ({
                        title: item.title,
                        tool: item.tool,
                        status: item.response?.status,
                        ok: item.response?.ok,
                        result: summarize(item.response?.result || item.response?.error || item.response, 1600)
                    }))
                })
            }
        ]
    });
    if (!response.ok) {
        return {
            ok: false,
            status: response.code || 'review_error',
            finalAnswer: `任务执行完成，但 LLM 复核失败：${response.error || 'unknown error'}`,
            issues: [response.error || 'review failed']
        };
    }
    const json = extractJsonObject(response.content);
    if (!json || typeof json !== 'object') {
        return {
            ok: false,
            status: 'invalid_review',
            finalAnswer: '任务执行完成，但复核模型没有返回合法 JSON。',
            issues: ['invalid review json'],
            raw: response.content
        };
    }
    return {
        ok: json.ok !== false,
        status: json.ok === false ? 'review_failed' : 'completed',
        finalAnswer: normalizeText(json.final_answer || json.answer || json.response, json.ok === false ? '复核发现任务可能没有完整完成。' : '复核完成，任务已完成。'),
        issues: Array.isArray(json.issues) ? json.issues.map((entry) => normalizeText(entry)).filter(Boolean) : [],
        followUpSteps: Array.isArray(json.follow_up_steps || json.followUpSteps)
            ? (json.follow_up_steps || json.followUpSteps).map((step, index) => sanitizeComputerPlannerStep(step, index, 'follow_up')).filter(Boolean)
            : [],
        raw: json,
        usage: response.usage || null
    };
}

class HumanClawAgentRunner {
    constructor(options = {}) {
        if (!options.gateway) {
            throw new Error('HumanClawAgentRunner requires a gateway instance');
        }
        this.gateway = options.gateway;
        this.workspaceRoot = path.resolve(options.workspaceRoot || this.gateway.workspaceRoot || process.cwd());
        this.activeRuns = new Map();
        this.pendingPlans = new Map();
        this.pendingAgentApprovals = new Map();
        this.memoryRuntime = options.memoryRuntime || this.gateway.memoryRuntime || null;
        this.pendingStorePath = path.resolve(
            options.pendingStorePath ||
                path.join(this.gateway.auditDir || path.join(this.workspaceRoot, '.audit'), 'pending-agent-state.json')
        );
        this.pendingStoreStatus = 'not_loaded';
        this.pendingStoreError = '';
        this.restoredPendingPlanCount = 0;
        this.restoredPendingAgentApprovalCount = 0;
        this.completedRunCount = 0;
        this.loadPendingState();
    }

    getStatus() {
        return {
            enabled: true,
            version: 'v1',
            planner: 'unified-llm-agentic-executor',
            activeRuns: this.activeRuns.size,
            pendingPlanCount: this.pendingPlans.size,
            pendingAgentApprovalCount: this.pendingAgentApprovals.size,
            pendingStorePath: this.pendingStorePath,
            pendingStoreStatus: this.pendingStoreStatus,
            pendingStoreError: this.pendingStoreError,
            restoredPendingPlanCount: this.restoredPendingPlanCount,
            restoredPendingAgentApprovalCount: this.restoredPendingAgentApprovalCount,
            completedRunCount: this.completedRunCount,
            memory: this.memoryRuntime?.getStatus?.() || null,
            capabilities: [
                'emotional_chat',
                'llm_dialog_task_judgement',
                'llm_agentic_executor_loop',
                'tool_observation_repair_loop',
                'tool_call_confirmation_resume',
                'vision_capture_context',
                'vision_understanding_skill',
                'read',
                'write',
                'web_fetch',
                'email_management',
                'file_management',
                'computer_operation',
                'code_operation',
                'apply_patch',
                'exec_requires_approval',
                'durable_pending_store',
                'persona_memory_runtime',
                'long_term_memory_context',
                'affinity_memory'
            ]
        };
    }

    compileMemoryContext({ sessionId, message, request } = {}) {
        const explicitMemoryContext = normalizeExplicitMemoryContext(
            request?.memoryContext ||
                request?.memory_context ||
                request?.evalMemoryContext ||
                request?.context?.memoryContext ||
                request?.context?.memory_context ||
                request?.context?.evalMemoryContext
        );
        let runtimeMemoryContext = '';
        try {
            if (this.memoryRuntime?.compileContext) {
                runtimeMemoryContext = this.memoryRuntime.compileContext({
                    sessionId,
                    message,
                    messageHistory: request?.messageHistory || []
                });
            }
        } catch (error) {
            this.gateway.emitGatewayEvent?.('agent.memory.context_error', {
                sessionId,
                error: error?.message || String(error)
            });
        }
        return [
            runtimeMemoryContext,
            explicitMemoryContext
                ? [
                      '【本轮显式记忆/关系上下文】',
                      explicitMemoryContext
                  ].join('\n')
                : ''
        ].filter(Boolean).join('\n\n');
    }

    recordMemoryTurn({ request = {}, result = {}, message = '', sessionId = 'main', source = 'agent' } = {}) {
        if (request.classifyOnly === true || !this.memoryRuntime?.recordTurn) {
            return;
        }
        try {
            const history = Array.isArray(request.messageHistory) ? request.messageHistory : [];
            const latestUserEntry = [...history].reverse().find((entry) => entry?.role === 'user') || {};
            const attachments = Array.isArray(latestUserEntry.attachments)
                ? latestUserEntry.attachments
                : Array.isArray(request.attachments)
                    ? request.attachments
                    : [];
            const recorded = this.memoryRuntime.recordTurn({
                sessionId,
                userMessage: message,
                assistantMessage: result.displayText || result.finalAnswer || result.error || '',
                source,
                result,
                messageHistory: history,
                attachments
            });
            if (recorded?.ok) {
                this.gateway.emitGatewayEvent?.('agent.memory.recorded', {
                    sessionId,
                    eventId: recorded.event?.id,
                    source,
                    tags: recorded.event?.tags || [],
                    importance: recorded.event?.importance
                });
            }
        } catch (error) {
            this.gateway.emitGatewayEvent?.('agent.memory.record_error', {
                sessionId,
                error: error?.message || String(error)
            });
        }
    }

    loadPendingState() {
        this.pendingStoreStatus = 'missing';
        this.pendingStoreError = '';
        let raw = '';
        try {
            if (!fs.existsSync(this.pendingStorePath)) {
                return;
            }
            raw = fs.readFileSync(this.pendingStorePath, 'utf8');
            const state = JSON.parse(raw || '{}');
            const plans = Array.isArray(state.pendingPlans) ? state.pendingPlans : [];
            const approvals = Array.isArray(state.pendingAgentApprovals) ? state.pendingAgentApprovals : [];
            const now = Date.now();
            for (const plan of plans) {
                if (plan && typeof plan === 'object' && Number(plan.expiresAt || 0) > now && plan.planId) {
                    this.pendingPlans.set(plan.planId, clonePendingFromDisk(plan));
                }
            }
            for (const approval of approvals) {
                if (approval && typeof approval === 'object' && Number(approval.expiresAt || 0) > now && approval.approvalId) {
                    this.pendingAgentApprovals.set(approval.approvalId, clonePendingFromDisk(approval));
                }
            }
            this.restoredPendingPlanCount = this.pendingPlans.size;
            this.restoredPendingAgentApprovalCount = this.pendingAgentApprovals.size;
            this.pendingStoreStatus = 'loaded';
            this.gateway.emitGatewayEvent?.('agent.pending.restored', {
                path: this.pendingStorePath,
                pendingPlanCount: this.restoredPendingPlanCount,
                pendingAgentApprovalCount: this.restoredPendingAgentApprovalCount
            });
            if (plans.length !== this.pendingPlans.size || approvals.length !== this.pendingAgentApprovals.size) {
                this.persistPendingState('prune_expired_on_load');
            }
        } catch (error) {
            this.pendingStoreStatus = 'load_error';
            this.pendingStoreError = error?.message || String(error);
            this.gateway.emitGatewayEvent?.('agent.pending.store_error', {
                action: 'load',
                path: this.pendingStorePath,
                error: this.pendingStoreError
            });
        }
    }

    buildPendingStateSnapshot(reason = 'update') {
        return sanitizePendingForDisk({
            version: PENDING_STORE_VERSION,
            reason,
            updatedAt: Date.now(),
            updatedAtIso: new Date().toISOString(),
            pendingPlans: [...this.pendingPlans.values()],
            pendingAgentApprovals: [...this.pendingAgentApprovals.values()]
        });
    }

    persistPendingState(reason = 'update') {
        try {
            fs.mkdirSync(path.dirname(this.pendingStorePath), { recursive: true });
            const snapshot = this.buildPendingStateSnapshot(reason);
            const tmpPath = `${this.pendingStorePath}.${process.pid}.${Date.now()}.tmp`;
            fs.writeFileSync(tmpPath, `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8');
            fs.renameSync(tmpPath, this.pendingStorePath);
            this.pendingStoreStatus = 'saved';
            this.pendingStoreError = '';
            this.gateway.emitGatewayEvent?.('agent.pending.saved', {
                reason,
                path: this.pendingStorePath,
                pendingPlanCount: this.pendingPlans.size,
                pendingAgentApprovalCount: this.pendingAgentApprovals.size
            });
        } catch (error) {
            this.pendingStoreStatus = 'save_error';
            this.pendingStoreError = error?.message || String(error);
            this.gateway.emitGatewayEvent?.('agent.pending.store_error', {
                action: 'save',
                reason,
                path: this.pendingStorePath,
                error: this.pendingStoreError
            });
        }
    }

    deletePendingPlan(planId, reason = 'delete') {
        const deleted = this.pendingPlans.delete(planId);
        if (deleted) {
            this.persistPendingState(reason);
        }
        return deleted;
    }

    deletePendingAgentApproval(approvalId, reason = 'delete') {
        const deleted = this.pendingAgentApprovals.delete(approvalId);
        if (deleted) {
            this.persistPendingState(reason);
        }
        return deleted;
    }

    pruneExpiredPlans() {
        let changed = false;
        for (const [planId, plan] of this.pendingPlans.entries()) {
            if (isPlanExpired(plan)) {
                this.pendingPlans.delete(planId);
                changed = true;
            }
        }
        if (changed) {
            this.persistPendingState('prune_expired_plans');
        }
    }

    findPendingPlanForSession(sessionId) {
        this.pruneExpiredPlans();
        const entries = [...this.pendingPlans.values()]
            .filter((plan) => plan.sessionId === sessionId)
            .sort((a, b) => b.createdAt - a.createdAt);
        return entries[0] || null;
    }

    storePendingPlan(plan) {
        this.pruneExpiredPlans();
        this.pendingPlans.set(plan.planId, plan);
        this.persistPendingState('store_pending_plan');
        return plan;
    }

    buildPendingPlan({ plan, message, sessionId, settings }) {
        const executeSteps = plan.steps
            .map((step, index) => sanitizeComputerPlannerStep(step, index, 'execute'))
            .filter(Boolean);
        const verificationSteps = plan.verificationSteps
            .map((step, index) => sanitizeComputerPlannerStep(step, index, 'verify'))
            .filter(Boolean);
        return {
            planId: randomUUID(),
            sessionId,
            message,
            createdAt: Date.now(),
            expiresAt: Date.now() + DEFAULT_PENDING_PLAN_TTL_MS,
            planner: 'llm-computer-planner',
            intent: plan.intent,
            summary: plan.summary || message,
            riskLevel: plan.riskLevel,
            requiresConfirmation: plan.requiresConfirmation || executeSteps.some(stepNeedsConfirmation),
            model: settings.model,
            steps: executeSteps,
            verificationSteps,
            raw: plan.raw
        };
    }

    buildNeedsConfirmationResult({ runId, sessionId, message, startedAt, pendingPlan, dryRun }) {
        const displayText = dryRun
            ? ['我已经用 LLM Planner 拆出计划：', ...displayPlanLines(pendingPlan.steps)].join('\n')
            : buildPlanConfirmationText(pendingPlan);
        return {
            ok: dryRun,
            runId,
            sessionId,
            status: dryRun ? 'planned' : 'needs_approval',
            mode: 'task',
            planner: 'llm-computer-planner',
            intent: pendingPlan.intent || 'llm_computer_task',
            confirmationRequired: !dryRun,
            approvalType: 'plan_confirmation',
            planId: pendingPlan.planId,
            expiresAt: new Date(pendingPlan.expiresAt).toISOString(),
            executionRequired: pendingPlan.steps.length > 0,
            durationMs: Date.now() - startedAt,
            message,
            displayText,
            speechText: displayText.replace(/\n/g, ' '),
            plan: pendingPlan.steps.map((step) => ({
                id: step.id,
                title: step.title,
                tool: step.tool,
                args: step.args
            })),
            verificationPlan: pendingPlan.verificationSteps.map((step) => ({
                id: step.id,
                title: step.title,
                tool: step.tool,
                args: step.args
            })),
            steps: []
        };
    }

    pruneExpiredAgentApprovals() {
        let changed = false;
        for (const [approvalId, approval] of this.pendingAgentApprovals.entries()) {
            if (isPlanExpired(approval)) {
                this.pendingAgentApprovals.delete(approvalId);
                changed = true;
            }
        }
        if (changed) {
            this.persistPendingState('prune_expired_agent_approvals');
        }
    }

    findPendingAgentApprovalForSession(sessionId) {
        this.pruneExpiredAgentApprovals();
        const entries = [...this.pendingAgentApprovals.values()]
            .filter((approval) => approval.sessionId === sessionId)
            .sort((a, b) => b.createdAt - a.createdAt);
        return entries[0] || null;
    }

    storePendingAgentApproval(approval) {
        this.pruneExpiredAgentApprovals();
        this.pendingAgentApprovals.set(approval.approvalId, approval);
        this.persistPendingState('store_pending_agent_approval');
        return approval;
    }

    buildPendingAgentApproval({ message, sessionId, settings, decision, step, events, stepResults, iteration, maxSteps }) {
        return {
            approvalId: randomUUID(),
            sessionId,
            message,
            createdAt: Date.now(),
            expiresAt: Date.now() + DEFAULT_PENDING_PLAN_TTL_MS,
            planner: 'llm-agentic-executor',
            intent: decision.intent,
            summary: decision.summary || message,
            riskLevel: decision.riskLevel,
            model: settings.model,
            settings,
            nextStep: step,
            events: Array.isArray(events) ? events.slice() : [],
            stepResults: Array.isArray(stepResults) ? stepResults.slice() : [],
            iteration,
            maxSteps,
            raw: decision.raw
        };
    }

    buildNeedsAgentApprovalResult({ runId, sessionId, message, startedAt, pendingApproval, dryRun }) {
        const step = pendingApproval.nextStep;
        const action = normalizeText(step.args?.action || step.args?.command || step.args?.path || step.tool);
        if (isVisionAgentStep(step)) {
            const targetLabel = getVisionStepTargetLabel(step);
            const reason = normalizeText(step.args?.reason || step.args?.question || pendingApproval.summary);
            const displayText = dryRun
                ? `我判断这里需要看一眼${targetLabel}，但还没有截图。`
                : [
                      `[expression:relaxed]这里我只靠文字不太确定，可以看一眼${targetLabel}吗？`,
                      reason ? `我想确认一下：${reason}` : '',
                      '可以的话回我“可以看”，不想让我看就说“先别看”。'
                  ].filter(Boolean).join('\n');
            return {
                ok: dryRun,
                runId,
                sessionId,
                status: dryRun ? 'planned' : 'needs_approval',
                mode: 'task',
                planner: 'llm-agentic-executor',
                intent: pendingApproval.intent || 'vision_context_request',
                confirmationRequired: !dryRun,
                approvalType: 'vision_capture_context',
                approvalId: pendingApproval.approvalId,
                expiresAt: new Date(pendingApproval.expiresAt).toISOString(),
                executionRequired: true,
                durationMs: Date.now() - startedAt,
                message,
                displayText,
                speechText: displayText.replace(/\n/g, ' '),
                plan: [
                    {
                        id: step.id,
                        title: step.title,
                        tool: step.tool,
                        args: step.args
                    }
                ],
                steps: pendingApproval.stepResults || [],
                events: pendingApproval.events || []
            };
        }
        const displayText = dryRun
            ? [
                  '我识别到下一步可能需要工具动作：',
                  `1. ${step.title || step.tool}${action ? `：${action}` : ''}`
              ].join('\n')
            : [
                  '[expression:relaxed]这一步会影响电脑或调用需要确认的工具，我先停住等你点头。',
                  `我准备做的是：${step.title || step.tool}${action ? `：${action}` : ''}`,
                  '如果确认，请回复“确认执行”；如果不执行，请回复“取消”。'
              ].join('\n');
        return {
            ok: dryRun,
            runId,
            sessionId,
            status: dryRun ? 'planned' : 'needs_approval',
            mode: 'task',
            planner: 'llm-agentic-executor',
            intent: pendingApproval.intent || 'llm_agent_tool_call',
            confirmationRequired: !dryRun,
            approvalType: 'agent_tool_call',
            approvalId: pendingApproval.approvalId,
            expiresAt: new Date(pendingApproval.expiresAt).toISOString(),
            executionRequired: true,
            durationMs: Date.now() - startedAt,
            message,
            displayText,
            speechText: displayText.replace(/\n/g, ' '),
            plan: [
                {
                    id: step.id,
                    title: step.title,
                    tool: step.tool,
                    args: step.args
                }
            ],
            steps: pendingApproval.stepResults || [],
            events: pendingApproval.events || []
        };
    }

    async executePlanSteps({ runId, steps, toolContext, request }) {
        const results = [];
        for (const step of steps) {
            this.gateway.emitGatewayEvent?.('agent.step.started', {
                runId,
                stepId: step.id,
                title: step.title,
                tool: step.tool,
                planner: 'llm-computer-planner',
                phase: step.phase || 'execute'
            });
            const response = await this.gateway.callTool({
                tool: step.tool,
                args: step.args,
                context: {
                    ...toolContext,
                    runId,
                    sessionId: toolContext.sessionId || toolContext.sessionKey,
                    planner: 'llm-computer-planner',
                    stepId: step.id,
                    phase: step.phase || 'execute',
                    ...(step.context || {})
                },
                timeoutMs: request.timeoutMs
            });
            const stepResult = {
                id: step.id,
                title: step.title,
                tool: step.tool,
                args: step.args,
                phase: step.phase || 'execute',
                response
            };
            results.push(stepResult);
            this.gateway.emitGatewayEvent?.('agent.step.finished', {
                runId,
                stepId: step.id,
                tool: step.tool,
                status: response.status,
                ok: response.ok,
                planner: 'llm-computer-planner',
                phase: step.phase || 'execute'
            });
            if (!response.ok) {
                break;
            }
        }
        return results;
    }

    async executeAgentToolStep({ runId, step, toolContext, request, iteration }) {
        this.gateway.emitGatewayEvent?.('agent.step.started', {
            runId,
            stepId: step.id,
            title: step.title,
            tool: step.tool,
            planner: 'llm-agentic-executor',
            phase: step.phase || 'execute',
            iteration
        });
        const response = await this.gateway.callTool({
            tool: step.tool,
            args: step.args,
            context: {
                ...toolContext,
                runId,
                sessionId: toolContext.sessionId || toolContext.sessionKey,
                planner: 'llm-agentic-executor',
                stepId: step.id,
                iteration,
                phase: step.phase || 'execute',
                ...(step.context || {})
            },
            timeoutMs: request.timeoutMs
        });
        const stepResult = {
            id: step.id,
            title: step.title,
            tool: step.tool,
            args: step.args,
            phase: step.phase || 'execute',
            iteration,
            response
        };
        this.gateway.emitGatewayEvent?.('agent.step.finished', {
            runId,
            stepId: step.id,
            tool: step.tool,
            status: response.status,
            ok: response.ok,
            planner: 'llm-agentic-executor',
            phase: step.phase || 'execute',
            iteration
        });
        return stepResult;
    }

    async executeConfirmedPlan({ request, pendingPlan, sessionId, requestContext, startedAt, runId }) {
        if (isPlanExpired(pendingPlan)) {
            this.deletePendingPlan(pendingPlan.planId, 'pending_plan_expired');
            return {
                ok: false,
                runId,
                sessionId,
                status: 'expired',
                mode: 'task',
                planner: 'llm-computer-planner',
                intent: pendingPlan.intent || 'llm_computer_task',
                executionRequired: false,
                durationMs: Date.now() - startedAt,
                message: pendingPlan.message,
                displayText: '这个待确认计划已经过期了，请重新发起任务。',
                speechText: '这个待确认计划已经过期了，请重新发起任务。',
                planId: pendingPlan.planId,
                steps: []
            };
        }

        const settings = resolveAgentLlmSettings(request, requestContext);
        const toolContext = {
            ...buildToolContext(requestContext, this.workspaceRoot, sessionId),
            approved: true
        };
        const stepResults = await this.executePlanSteps({
            runId,
            steps: pendingPlan.steps,
            toolContext,
            request
        });
        const failedStep = stepResults.find((step) => !step.response?.ok);
        let verificationResults = [];
        if (!failedStep && pendingPlan.verificationSteps.length) {
            verificationResults = await this.executePlanSteps({
                runId,
                steps: pendingPlan.verificationSteps,
                toolContext: buildToolContext(requestContext, this.workspaceRoot, sessionId),
                request
            });
        }
        const failedVerification = verificationResults.find((step) => !step.response?.ok);
        const review = !failedStep && !failedVerification && settings.baseUrl && settings.model && settings.apiKey
            ? await callLlmReviewer(settings, {
                  message: pendingPlan.message,
                  plan: pendingPlan,
                  stepResults,
                  verificationResults
              })
            : {
                  ok: !failedStep && !failedVerification,
                  status: failedStep || failedVerification ? 'error' : 'completed',
                  finalAnswer: failedStep
                      ? `执行中断：${failedStep.title} 返回 ${failedStep.response?.status || 'error'}。`
                      : failedVerification
                          ? `复核未通过：${failedVerification.title} 返回 ${failedVerification.response?.status || 'error'}。`
                          : '执行完成，复核步骤已通过。',
                  issues: []
              };
        const status = failedStep?.response?.status || failedVerification?.response?.status || review.status || 'completed';
        const ok = !failedStep && !failedVerification && review.ok !== false;
        const displayText = [
            ok ? '完成了，并且已经复核。' : '任务没有完整完成。',
            review.finalAnswer,
            stepResults.length ? '执行记录：' : '',
            ...stepResults.map((result) => formatStepResult(result)),
            verificationResults.length ? '复核记录：' : '',
            ...verificationResults.map((result) => formatStepResult(result))
        ].filter(Boolean).join('\n');

        this.deletePendingPlan(pendingPlan.planId, 'pending_plan_confirmed');
        return {
            ok,
            runId,
            sessionId,
            status: ok ? 'completed' : status,
            mode: 'task',
            planner: 'llm-computer-planner',
            intent: pendingPlan.intent || 'llm_computer_task',
            confirmationRequired: false,
            confirmedPlanId: pendingPlan.planId,
            executionRequired: pendingPlan.steps.length > 0,
            durationMs: Date.now() - startedAt,
            message: pendingPlan.message,
            displayText,
            speechText: displayText.replace(/\n/g, ' '),
            plan: pendingPlan.steps.map((step) => ({
                id: step.id,
                title: step.title,
                tool: step.tool,
                args: step.args
            })),
            verificationPlan: pendingPlan.verificationSteps.map((step) => ({
                id: step.id,
                title: step.title,
                tool: step.tool,
                args: step.args
            })),
            steps: stepResults,
            verificationSteps: verificationResults,
            review
        };
    }

    async runLlmAgentLoop({
        request,
        message,
        sessionId,
        requestContext,
        startedAt,
        runId,
        dryRun,
        initialEvents = [],
        initialStepResults = [],
        startIteration = 0,
        approvedForRun = false,
        settingsOverride = null
    }) {
        const settings = settingsOverride || resolveAgentLlmSettings(request, requestContext);
        const missingSettings = !settings.baseUrl || !settings.model || !settings.apiKey;
        if (missingSettings) {
            const displayText = '我还没有拿到可用的大模型配置，所以现在不能由 Agent Loop 判断并执行这句话。请先在控制面板里配置 API Base、模型和 Key。';
            return {
                ok: false,
                runId,
                sessionId,
                status: 'needs_llm_config',
                mode: 'conversation',
                planner: 'llm-agentic-executor',
                intent: 'llm_config_required',
                executionRequired: false,
                durationMs: Date.now() - startedAt,
                message,
                displayText,
                speechText: displayText,
                plan: [],
                steps: [],
                events: initialEvents
            };
        }
        const runtime = this.gateway.runtime;
        let runtimeStarted = false;
        if (runtime) {
            if (!runtime.runs?.has(runId)) {
                await runtime.startRun({
                    runId,
                    sessionId,
                    message,
                    planner: 'llm-agentic-executor',
                    mode: 'task',
                    intent: 'llm_agent'
                });
            }
            runtimeStarted = true;
        }
        const appendRuntimeItem = async (item) => {
            if (!runtimeStarted || !runtime) {
                return null;
            }
            return await runtime.appendItem(runId, {
                sessionId,
                ...item
            });
        };
        const finishRuntimeRun = async (result) => {
            if (!runtimeStarted || !runtime) {
                return result;
            }
            const transcript = await runtime.completeRun(runId, result);
            return {
                ...result,
                transcript
            };
        };
        const autoConfirm =
            request.autoConfirm === true ||
            requestContext.autoConfirm === true ||
            requestContext.confirmationPolicy === 'auto';
        const approved = approvedForRun || autoConfirm || requestContext.approved === true;
        const requestedMaxSteps = Number(request.maxAgentSteps || requestContext.maxAgentSteps || DEFAULT_AGENT_LOOP_STEPS);
        const maxSteps = Math.max(1, Math.min(Number.isFinite(requestedMaxSteps) ? requestedMaxSteps : DEFAULT_AGENT_LOOP_STEPS, 20));
        const events = initialEvents.slice();
        const stepResults = initialStepResults.slice();
        const initialPlan = request.initialPlan || requestContext.initialPlan || null;
        let emailProfiles = {};
        try {
            emailProfiles = this.gateway.getEmailProfiles?.() || requestContext.emailProfiles || {};
        } catch {
            emailProfiles = requestContext.emailProfiles || {};
        }
        const memoryContext = this.compileMemoryContext({
            sessionId,
            message,
            request
        });
        let latestDecision = null;

        for (let iteration = startIteration; iteration < maxSteps; iteration += 1) {
            const decisionTimeoutMs = resolveAgentDecisionTimeoutMs(settings, {
                events,
                stepResults,
                requestContext
            });
            const decision = await callLlmAgentDecision(settings, {
                temperature: settings.temperature,
                timeoutMs: decisionTimeoutMs,
                messages: buildLlmAgentExecutorMessages({
                    message,
                    messageHistory: request.messageHistory,
                    events,
                    maxSteps,
                    emailProfiles,
                    initialPlan,
                    memoryContext,
                    toolSummary: 'vision.capture_context: read-only screen/chat-window/active-window/region visual observation; computer: list/tree/stat/read/write/append/mkdir/copy/move/delete/search/hash/du/exec/session_start/process_read/process_write/process_kill/watch/rollback/binary/acl/pty; code: search/symbols/diagnostics/git/test/refactor; email/file_manager when explicitly needed; update_plan is driven by plan_update; subagents spawn/wait/log child agent runs; mcp_bridge list_tools/call_tool/read_resource against configured MCP servers'
                })
            });
            latestDecision = decision;
            await appendRuntimeItem({
                type: 'agent.decision',
                status: decision.ok ? decision.action : decision.status,
                payload: {
                    iteration,
                    ok: decision.ok,
                    status: decision.status,
                    action: decision.action,
                    mode: decision.mode,
                    intent: decision.intent,
                    summary: decision.summary,
                    riskLevel: decision.riskLevel,
                    toolCall: decision.toolCall
                        ? {
                              id: decision.toolCall.id,
                              title: decision.toolCall.title,
                              tool: decision.toolCall.tool,
                              args: decision.toolCall.args
                          }
                        : null,
                    capabilityRequest: decision.capabilityRequest,
                    planUpdates: decision.planUpdates || [],
                    error: decision.error
                }
            });
            if (!decision.ok) {
                const displayText = `Agentic Executor 决策失败：${decision.error}`;
                return await finishRuntimeRun({
                    ok: false,
                    runId,
                    sessionId,
                    status: decision.status,
                    mode: 'task',
                    planner: 'llm-agentic-executor',
                    intent: 'llm_agent_error',
                    executionRequired: stepResults.length > 0,
                    durationMs: Date.now() - startedAt,
                    message,
                    displayText,
                    speechText: displayText,
                    error: decision.error,
                    plan: [],
                    steps: stepResults,
                    events
                });
            }

            if (decision.planUpdates?.length) {
                const planResponse = await this.gateway.callTool({
                    tool: 'update_plan',
                    args: {
                        explanation: decision.summary,
                        plan: decision.planUpdates.map((step, index) => ({
                            id: `agent-plan-${iteration + 1}-${index + 1}`,
                            step,
                            status: index === decision.planUpdates.length - 1 ? 'in_progress' : 'completed'
                        }))
                    },
                    context: {
                        ...buildToolContext({ ...requestContext, approved: true }, this.workspaceRoot, sessionId),
                        runId,
                        sessionId,
                        planner: 'llm-agentic-executor',
                        internal: true,
                        iteration
                    },
                    timeoutMs: request.timeoutMs
                });
                events.push({
                    type: 'plan_update',
                    iteration,
                    status: planResponse.status,
                    ok: planResponse.ok,
                    updates: decision.planUpdates
                });
            }

            if (decision.action === 'load_context') {
                const capabilityEvent = buildCapabilityContextEvent({
                    capabilityRequest: decision.capabilityRequest,
                    emailProfiles,
                    iteration
                });
                events.push(capabilityEvent);
                await appendRuntimeItem({
                    type: 'agent.capability_context',
                    status: capabilityEvent.status,
                    payload: {
                        iteration,
                        request: capabilityEvent.request,
                        loaded: capabilityEvent.loaded,
                        missing: capabilityEvent.missing
                    }
                });
                continue;
            }

            if (decision.action === 'final') {
                const displayText = decision.finalAnswer || '任务完成。';
                return await finishRuntimeRun({
                    ok: true,
                    runId,
                    sessionId,
                    status: 'completed',
                    mode: decision.mode,
                    planner: 'llm-agentic-executor',
                    intent: decision.intent,
                    executionRequired: stepResults.length > 0,
                    durationMs: Date.now() - startedAt,
                    message,
                    displayText,
                    speechText: displayText.replace(/\n/g, ' '),
                    plan: [],
                    steps: stepResults,
                    events,
                    planUpdates: decision.planUpdates,
                    usage: decision.usage
                });
            }

            if (decision.action === 'blocked') {
                const displayText = decision.blockedReason || decision.finalAnswer || 'Agentic Executor 判断当前任务无法继续。';
                return await finishRuntimeRun({
                    ok: false,
                    runId,
                    sessionId,
                    status: 'blocked',
                    mode: 'task',
                    planner: 'llm-agentic-executor',
                    intent: decision.intent,
                    executionRequired: stepResults.length > 0,
                    durationMs: Date.now() - startedAt,
                    message,
                    displayText,
                    speechText: displayText.replace(/\n/g, ' '),
                    plan: [],
                    steps: stepResults,
                    events,
                    planUpdates: decision.planUpdates
                });
            }

            const step = decision.toolCall;
            if (!step) {
                const displayText = 'Agentic Executor 没有给出可执行工具调用。';
                return await finishRuntimeRun({
                    ok: false,
                    runId,
                    sessionId,
                    status: 'invalid_agent_tool_call',
                    mode: 'task',
                    planner: 'llm-agentic-executor',
                    intent: decision.intent,
                    executionRequired: stepResults.length > 0,
                    durationMs: Date.now() - startedAt,
                    message,
                    displayText,
                    speechText: displayText,
                    plan: [],
                    steps: stepResults,
                    events
                });
            }

            const validation = validateAgentToolStep(step);
            if (!validation.ok) {
                events.push({
                    type: 'tool_call',
                    id: step.id,
                    title: step.title,
                    tool: step.tool,
                    args: step.args,
                    iteration
                });
                const invalidStepResult = buildInvalidToolStepResult(step, validation, iteration);
                stepResults.push(invalidStepResult);
                events.push(buildToolResultEvent(invalidStepResult));
                await appendRuntimeItem({
                    type: 'agent.tool_validation',
                    status: validation.status || 'invalid_tool_args',
                    payload: {
                        iteration,
                        tool: step.tool,
                        args: step.args,
                        error: validation.error,
                        details: validation.details
                    }
                });
                continue;
            }

            const plannedToolContext = buildToolContext(requestContext, this.workspaceRoot, sessionId);
            const policyDecision = this.gateway.runtime?.evaluateToolCall?.({
                toolId: step.tool,
                args: step.args,
                context: plannedToolContext
            });
            if (policyDecision?.denied) {
                const displayText = `Agentic Executor 的下一步被 runtime 权限模型拒绝：${policyDecision.reason}`;
                return await finishRuntimeRun({
                    ok: false,
                    runId,
                    sessionId,
                    status: 'blocked',
                    mode: 'task',
                    planner: 'llm-agentic-executor',
                    intent: decision.intent,
                    executionRequired: stepResults.length > 0,
                    durationMs: Date.now() - startedAt,
                    message,
                    displayText,
                    speechText: displayText,
                    plan: [],
                    steps: stepResults,
                    events,
                    policyDecision
                });
            }
            const visionAutoApproved = isVisionAgentStep(step) && isVisionAutoApprovedContext(requestContext);
            const needsVisionConsent = isVisionAgentStep(step) && !visionAutoApproved;
            if (dryRun || needsVisionConsent || (!approved && (policyDecision?.needsApproval || agentStepNeedsConfirmation(step)))) {
                const pendingApproval = this.storePendingAgentApproval(
                    this.buildPendingAgentApproval({
                        message,
                        sessionId,
                        settings,
                        decision,
                        step,
                        events,
                        stepResults,
                        iteration,
                        maxSteps
                    })
                );
                return await finishRuntimeRun(this.buildNeedsAgentApprovalResult({
                    runId,
                    sessionId,
                    message,
                    startedAt,
                    pendingApproval,
                    dryRun
                }));
            }

            events.push({
                type: 'tool_call',
                id: step.id,
                title: step.title,
                tool: step.tool,
                args: step.args,
                iteration
            });
            const stepResult = await this.executeAgentToolStep({
                runId,
                step,
                toolContext: {
                    ...buildToolContext(
                        {
                            ...(approved ? { ...requestContext, approved: true } : requestContext),
                            ...(visionAutoApproved ? { visionApproved: true } : {})
                        },
                        this.workspaceRoot,
                        sessionId
                    )
                },
                request,
                iteration
            });
            stepResults.push(stepResult);
            events.push(buildToolResultEvent(stepResult));

            if (!stepResult.response?.ok && stepResult.response?.status === 'needs_approval') {
                const pendingApproval = this.storePendingAgentApproval(
                    this.buildPendingAgentApproval({
                        message,
                        sessionId,
                        settings,
                        decision,
                        step,
                        events,
                        stepResults,
                        iteration,
                        maxSteps
                    })
                );
                return await finishRuntimeRun(this.buildNeedsAgentApprovalResult({
                    runId,
                    sessionId,
                    message,
                    startedAt,
                    pendingApproval,
                    dryRun: false
                }));
            }
        }

        const displayText = [
            `我试着继续处理，但这一轮已经到达工具步数上限（${maxSteps}），先停在这里，避免越跑越乱。`,
            latestDecision?.summary ? `当前卡住的是：${latestDecision.summary}` : '',
            stepResults.length ? '我已经做过这些步骤：' : '',
            ...stepResults.map((result) => formatStepResultBrief(result)),
            '我没有把原始工具日志直接堆给你；如果你要继续，我可以从当前卡点接着往下查。'
        ].filter(Boolean).join('\n');
        return await finishRuntimeRun({
            ok: false,
            runId,
            sessionId,
            status: 'max_steps_reached',
            mode: 'task',
            planner: 'llm-agentic-executor',
            intent: latestDecision?.intent || 'llm_agent_max_steps',
            executionRequired: stepResults.length > 0,
            durationMs: Date.now() - startedAt,
            message,
            displayText,
            speechText: displayText.replace(/\n/g, ' '),
            plan: [],
            steps: stepResults,
            events
        });
    }

    async executePendingAgentApproval({ request, pendingApproval, sessionId, requestContext, startedAt, runId }) {
        if (isPlanExpired(pendingApproval)) {
            this.deletePendingAgentApproval(pendingApproval.approvalId, 'pending_agent_approval_expired');
            const displayText = '这个待确认工具动作已经过期了，请重新发起任务。';
            return {
                ok: false,
                runId,
                sessionId,
                status: 'expired',
                mode: 'task',
                planner: 'llm-agentic-executor',
                intent: pendingApproval.intent || 'agent_action_expired',
                executionRequired: false,
                durationMs: Date.now() - startedAt,
                message: pendingApproval.message,
                displayText,
                speechText: displayText,
                approvalId: pendingApproval.approvalId,
                plan: [],
                steps: []
            };
        }

        const runtime = this.gateway.runtime;
        let runtimeStarted = false;
        if (runtime) {
            if (!runtime.runs?.has(runId)) {
                await runtime.startRun({
                    runId,
                    sessionId,
                    message: pendingApproval.message,
                    planner: 'llm-agentic-executor',
                    mode: 'task',
                    intent: pendingApproval.intent || 'agent_action_confirmation'
                });
            }
            runtimeStarted = true;
        }
        const finishRuntimeRun = async (result) => {
            if (!runtimeStarted || !runtime) {
                return result;
            }
            const transcript = await runtime.completeRun(runId, result);
            return {
                ...result,
                transcript
            };
        };

        const settings = resolveAgentLlmSettings(request, requestContext);
        const effectiveSettings =
            settings.baseUrl && settings.model && settings.apiKey
                ? settings
                : pendingApproval.settings;
        const step = pendingApproval.nextStep;
        this.deletePendingAgentApproval(pendingApproval.approvalId, 'pending_agent_approval_confirmed');

        const events = Array.isArray(pendingApproval.events) ? pendingApproval.events.slice() : [];
        const stepResults = Array.isArray(pendingApproval.stepResults) ? pendingApproval.stepResults.slice() : [];
        events.push({
            type: 'tool_call',
            id: step.id,
            title: step.title,
            tool: step.tool,
            args: step.args,
            iteration: pendingApproval.iteration,
            approved: true
        });
        const stepResult = await this.executeAgentToolStep({
            runId,
            step,
            toolContext: buildToolContext({
                ...requestContext,
                approved: true,
                ...(isVisionAgentStep(step) ? { visionApproved: true } : {})
            }, this.workspaceRoot, sessionId),
            request,
            iteration: pendingApproval.iteration
        });
        stepResults.push(stepResult);
        events.push(buildToolResultEvent(stepResult));

        if (!stepResult.response?.ok && stepResult.response?.status === 'needs_approval') {
            const displayText = `${step.title || step.tool} 仍然需要更高权限或额外确认，当前 Gateway 拒绝执行。`;
            return await finishRuntimeRun({
                ok: false,
                runId,
                sessionId,
                status: 'needs_approval',
                mode: 'task',
                planner: 'llm-agentic-executor',
                intent: pendingApproval.intent || 'agent_action_confirmation',
                confirmationRequired: true,
                approvalType: 'agent_tool_call',
                executionRequired: true,
                durationMs: Date.now() - startedAt,
                message: pendingApproval.message,
                displayText,
                speechText: displayText,
                plan: [
                    {
                        id: step.id,
                        title: step.title,
                        tool: step.tool,
                        args: step.args
                    }
                ],
                steps: stepResults,
                events
            });
        }

        return await this.runLlmAgentLoop({
            request,
            message: pendingApproval.message,
            sessionId,
            requestContext,
            startedAt,
            runId,
            dryRun: false,
            initialEvents: events,
            initialStepResults: stepResults,
            startIteration: Number(pendingApproval.iteration || 0) + 1,
            approvedForRun: true,
            settingsOverride: effectiveSettings
        });
    }

    async runMessage(request = {}) {
        const runId = randomUUID();
        const startedAt = Date.now();
        const message = getLatestUserMessage(request);
        const sessionId = normalizeText(request.sessionId || request.sessionKey, 'main');
        const requestContext = request.context && typeof request.context === 'object' ? request.context : {};
        const dryRun = request.dryRun === true || requestContext.dryRun === true;
        const explicitPlanId = normalizeText(request.confirmPlanId || request.planId || requestContext.confirmPlanId);
        const explicitApprovalId = normalizeText(
            request.confirmApprovalId || request.approvalId || requestContext.confirmApprovalId || requestContext.approvalId
        );
        const confirmedByMessage = isConfirmationMessage(message);
        const cancelPendingByMessage = isCancelMessage(message);
        const pendingAgentApproval =
            explicitApprovalId
                ? this.pendingAgentApprovals.get(explicitApprovalId)
                : confirmedByMessage || cancelPendingByMessage
                    ? this.findPendingAgentApprovalForSession(sessionId)
                    : null;
        const pendingPlan =
            explicitPlanId
                ? this.pendingPlans.get(explicitPlanId)
                : confirmedByMessage || cancelPendingByMessage
                    ? this.findPendingPlanForSession(sessionId)
                    : null;

        if (pendingAgentApproval && cancelPendingByMessage) {
            this.deletePendingAgentApproval(pendingAgentApproval.approvalId, 'pending_agent_approval_cancelled');
            const displayText = `已取消待确认工具动作：${pendingAgentApproval.nextStep?.title || pendingAgentApproval.approvalId}`;
            return {
                ok: true,
                runId,
                sessionId,
                status: 'cancelled',
                mode: 'task',
                planner: 'llm-agentic-executor',
                intent: 'agent_action_cancelled',
                executionRequired: false,
                durationMs: Date.now() - startedAt,
                message,
                displayText,
                speechText: displayText,
                approvalId: pendingAgentApproval.approvalId,
                plan: [],
                steps: []
            };
        }

        if (pendingAgentApproval) {
            if (request.classifyOnly === true) {
                const step = pendingAgentApproval.nextStep;
                const pendingLabel = isVisionAgentStep(step)
                    ? `检测到待确认视觉感知：看一眼${getVisionStepTargetLabel(step)}`
                    : `检测到待确认工具动作：${step?.title || pendingAgentApproval.approvalId}`;
                return {
                    ok: true,
                    runId,
                    sessionId,
                    status: 'classified',
                    mode: 'task',
                    planner: 'llm-agentic-executor',
                    intent: 'agent_action_confirmation',
                    executionRequired: true,
                    confirmationRequired: true,
                    approvalType: 'agent_tool_call',
                    approvalId: pendingAgentApproval.approvalId,
                    durationMs: Date.now() - startedAt,
                    message,
                    displayText: pendingLabel,
                    speechText: pendingLabel,
                    plan: step
                        ? [
                              {
                                  id: step.id,
                                  title: step.title,
                                  tool: step.tool,
                                  args: step.args
                              }
                          ]
                        : [],
                    steps: []
                };
            }
            const apiConfirmed = request.confirmed === true || requestContext.approved === true;
            if (explicitApprovalId && !apiConfirmed && !confirmedByMessage) {
                const displayText = '执行待确认工具动作需要明确确认：请回复“确认执行”，或在 API 调用里设置 context.approved=true。';
                return {
                    ok: false,
                    runId,
                    sessionId,
                    status: 'needs_approval',
                    mode: 'task',
                    planner: 'llm-agentic-executor',
                    intent: 'agent_action_confirmation_required',
                    confirmationRequired: true,
                    approvalType: 'agent_tool_call',
                    approvalId: pendingAgentApproval.approvalId,
                    executionRequired: true,
                    durationMs: Date.now() - startedAt,
                    message,
                    displayText,
                    speechText: displayText,
                    plan: [
                        {
                            id: pendingAgentApproval.nextStep.id,
                            title: pendingAgentApproval.nextStep.title,
                            tool: pendingAgentApproval.nextStep.tool,
                            args: pendingAgentApproval.nextStep.args
                        }
                    ],
                    steps: pendingAgentApproval.stepResults || []
                };
            }

            const runRecord = {
                runId,
                sessionId,
                startedAt,
                mode: 'task',
                intent: 'agent_action_confirmation',
                stepCount: (pendingAgentApproval.stepResults || []).length
            };
            this.activeRuns.set(runId, runRecord);
            this.gateway.emitGatewayEvent?.('agent.run.started', {
                runId,
                sessionId,
                mode: 'task',
                intent: 'agent_action_confirmation',
                planner: 'llm-agentic-executor',
                stepCount: runRecord.stepCount,
                executionRequired: true
            });
            try {
                const result = await this.executePendingAgentApproval({
                    request,
                    pendingApproval: pendingAgentApproval,
                    sessionId,
                    requestContext: {
                        ...requestContext,
                        approved: true
                    },
                    startedAt,
                    runId
                });
                await this.gateway.appendAudit?.({
                    runId,
                    type: 'agent.run',
                    status: result.status,
                    ok: result.ok,
                    durationMs: result.durationMs,
                    mode: result.mode,
                    intent: result.intent,
                    planner: result.planner,
                    args: {
                        message,
                        sessionId,
                        confirmedApprovalId: pendingAgentApproval.approvalId
                    },
                    context: requestContext,
                    resultPreview: summarize(result.displayText)
                });
                this.recordMemoryTurn({
                    request,
                    result,
                    message,
                    sessionId,
                    source: 'agent_tool_confirmation'
                });
                this.gateway.emitGatewayEvent?.('agent.run.finished', {
                    runId,
                    sessionId,
                    status: result.status,
                    mode: result.mode,
                    ok: result.ok,
                    durationMs: result.durationMs,
                    displayText: result.displayText,
                    planner: result.planner
                });
                return result;
            } finally {
                this.activeRuns.delete(runId);
                this.completedRunCount += 1;
            }
        }

        if (pendingPlan && cancelPendingByMessage) {
            this.deletePendingPlan(pendingPlan.planId, 'pending_plan_cancelled');
            const displayText = `已取消待确认计划：${pendingPlan.summary || pendingPlan.planId}`;
            return {
                ok: true,
                runId,
                sessionId,
                status: 'cancelled',
                mode: 'task',
                planner: 'llm-computer-planner',
                intent: 'plan_cancelled',
                executionRequired: false,
                durationMs: Date.now() - startedAt,
                message,
                displayText,
                speechText: displayText,
                planId: pendingPlan.planId,
                plan: [],
                steps: []
            };
        }

        if (pendingPlan) {
            if (request.classifyOnly === true) {
                return {
                    ok: true,
                    runId,
                    sessionId,
                    status: 'classified',
                    mode: 'task',
                    planner: 'llm-computer-planner',
                    intent: 'plan_confirmation',
                    executionRequired: true,
                    confirmationRequired: true,
                    planId: pendingPlan.planId,
                    durationMs: Date.now() - startedAt,
                    message,
                    displayText: `检测到待确认计划：${pendingPlan.summary || pendingPlan.planId}`,
                    speechText: `检测到待确认计划：${pendingPlan.summary || pendingPlan.planId}`,
                    plan: pendingPlan.steps.map((step) => ({
                        id: step.id,
                        title: step.title,
                        tool: step.tool,
                        args: step.args
                    })),
                    steps: []
                };
            }
            const apiConfirmed = request.confirmed === true || requestContext.approved === true;
            if (explicitPlanId && !apiConfirmed && !confirmedByMessage) {
                const displayText = '执行待确认计划需要明确确认：请回复“确认执行”，或在 API 调用里设置 context.approved=true。';
                return {
                    ok: false,
                    runId,
                    sessionId,
                    status: 'needs_approval',
                    mode: 'task',
                    planner: 'llm-computer-planner',
                    intent: 'plan_confirmation_required',
                    confirmationRequired: true,
                    approvalType: 'plan_confirmation',
                    planId: pendingPlan.planId,
                    executionRequired: true,
                    durationMs: Date.now() - startedAt,
                    message,
                    displayText,
                    speechText: displayText,
                    plan: pendingPlan.steps.map((step) => ({
                        id: step.id,
                        title: step.title,
                        tool: step.tool,
                        args: step.args
                    })),
                    steps: []
                };
            }

            const runRecord = {
                runId,
                sessionId,
                startedAt,
                mode: 'task',
                intent: 'plan_confirmation',
                stepCount: pendingPlan.steps.length
            };
            this.activeRuns.set(runId, runRecord);
            this.gateway.emitGatewayEvent?.('agent.run.started', {
                runId,
                sessionId,
                mode: 'task',
                intent: 'plan_confirmation',
                planner: 'llm-computer-planner',
                stepCount: pendingPlan.steps.length,
                executionRequired: true
            });
            try {
                const result = await this.executeConfirmedPlan({
                    request,
                    pendingPlan,
                    sessionId,
                    requestContext: {
                        ...requestContext,
                        approved: true
                    },
                    startedAt,
                    runId
                });
                await this.gateway.appendAudit?.({
                    runId,
                    type: 'agent.run',
                    status: result.status,
                    ok: result.ok,
                    durationMs: result.durationMs,
                    mode: result.mode,
                    intent: result.intent,
                    planner: result.planner,
                    args: {
                        message,
                        sessionId,
                        confirmedPlanId: pendingPlan.planId
                    },
                    context: requestContext,
                    resultPreview: summarize(result.displayText)
                });
                this.recordMemoryTurn({
                    request,
                    result,
                    message,
                    sessionId,
                    source: 'plan_confirmation'
                });
                this.gateway.emitGatewayEvent?.('agent.run.finished', {
                    runId,
                    sessionId,
                    status: result.status,
                    mode: result.mode,
                    ok: result.ok,
                    durationMs: result.durationMs,
                    displayText: result.displayText,
                    planner: result.planner
                });
                return result;
            } finally {
                this.activeRuns.delete(runId);
                this.completedRunCount += 1;
            }
        }

        if (!request.classifyOnly && shouldUseLlmAgent(request, requestContext)) {
            this.activeRuns.set(runId, {
                runId,
                sessionId,
                startedAt,
                mode: 'llm-agentic-executor',
                intent: 'llm_agent',
                stepCount: 0
            });
            this.gateway.emitGatewayEvent?.('agent.run.started', {
                runId,
                sessionId,
                mode: 'llm-agentic-executor',
                intent: 'llm_agent',
                planner: 'llm-agentic-executor'
            });
            const llmResult = await this.runLlmAgentLoop({
                request,
                message,
                sessionId,
                requestContext,
                startedAt,
                runId,
                dryRun
            });
            if (llmResult) {
                this.activeRuns.delete(runId);
                this.completedRunCount += 1;
                await this.gateway.appendAudit?.({
                    runId,
                    type: 'agent.run',
                    status: llmResult.status,
                    ok: llmResult.ok,
                    durationMs: llmResult.durationMs,
                    mode: llmResult.mode,
                    intent: llmResult.intent,
                    planner: llmResult.planner,
                    args: {
                        message,
                        sessionId,
                        dryRun
                    },
                    context: requestContext,
                    resultPreview: summarize(llmResult.displayText)
                });
                this.recordMemoryTurn({
                    request,
                    result: llmResult,
                    message,
                    sessionId,
                    source: 'llm_agentic_executor'
                });
                this.gateway.emitGatewayEvent?.('agent.run.finished', {
                    runId,
                    sessionId,
                    status: llmResult.status,
                    mode: llmResult.mode,
                    ok: llmResult.ok,
                    durationMs: llmResult.durationMs,
                    displayText: llmResult.displayText,
                    planner: llmResult.planner
                });
                return llmResult;
            }
            this.activeRuns.delete(runId);
        }
        const plan = planMessage(message);
        const mode = getPlanMode(plan);
        const executionRequired = plan.steps.length > 0;
        if (request.classifyOnly === true) {
            return {
                ok: true,
                runId,
                sessionId,
                status: 'classified',
                mode,
                intent: plan.intent,
                executionRequired,
                durationMs: Date.now() - startedAt,
                message,
                displayText: plan.response || '',
                speechText: plan.response || '',
                plan: plan.steps.map((step) => ({
                    id: step.id,
                    title: step.title,
                    tool: step.tool,
                    args: step.args
                })),
                steps: []
            };
        }
        const runRecord = {
            runId,
            sessionId,
            startedAt,
            mode,
            intent: plan.intent,
            stepCount: plan.steps.length
        };
        this.activeRuns.set(runId, runRecord);
        this.gateway.emitGatewayEvent?.('agent.run.started', {
            runId,
            sessionId,
            mode,
            intent: plan.intent,
            stepCount: plan.steps.length,
            executionRequired,
        });

        const stepResults = [];
        let status = 'completed';

        try {
            if (!dryRun) {
                const toolContext = buildToolContext(requestContext, this.workspaceRoot, sessionId);
                for (const step of plan.steps) {
                    this.gateway.emitGatewayEvent?.('agent.step.started', {
                        runId,
                        stepId: step.id,
                        title: step.title,
                        tool: step.tool
                    });
                    const response = await this.gateway.callTool({
                        tool: step.tool,
                        args: step.args,
                        context: {
                            ...toolContext,
                            runId,
                            sessionId,
                            planner: 'rule-agent',
                            stepId: step.id,
                            ...(step.context || {})
                        },
                        timeoutMs: request.timeoutMs
                    });
                    const stepResult = {
                        id: step.id,
                        title: step.title,
                        tool: step.tool,
                        args: step.args,
                        response
                    };
                    stepResults.push(stepResult);
                    this.gateway.emitGatewayEvent?.('agent.step.finished', {
                        runId,
                        stepId: step.id,
                        tool: step.tool,
                        status: response.status,
                        ok: response.ok
                    });

                    if (!response.ok) {
                        status = response.status || 'error';
                        break;
                    }
                }
            } else if (plan.steps.length) {
                status = 'planned';
            }

            const displayText = formatRunResponse({ plan, stepResults, status, dryRun });
            const result = {
                ok: status === 'completed' || status === 'planned',
                runId,
                sessionId,
                status,
                mode,
                intent: plan.intent,
                executionRequired,
                durationMs: Date.now() - startedAt,
                message,
                displayText,
                speechText: displayText.replace(/\n/g, ' '),
                plan: plan.steps.map((step) => ({
                    id: step.id,
                    title: step.title,
                    tool: step.tool,
                    args: step.args
                })),
                steps: stepResults
            };

            await this.gateway.appendAudit?.({
                runId,
                type: 'agent.run',
                status,
                ok: result.ok,
                durationMs: result.durationMs,
                mode,
                intent: plan.intent,
                args: {
                    message,
                    sessionId,
                    dryRun
                },
                context: requestContext,
                resultPreview: summarize(displayText)
            });
            this.recordMemoryTurn({
                request,
                result,
                message,
                sessionId,
                source: 'rule_agent'
            });
            this.gateway.emitGatewayEvent?.('agent.run.finished', {
                runId,
                sessionId,
                status,
                mode,
                ok: result.ok,
                durationMs: result.durationMs,
                displayText
            });
            return result;
        } catch (error) {
            status = error?.code || 'error';
            const displayText = `Agent Runner 执行失败：${error.message || error}`;
            const result = {
                ok: false,
                runId,
                sessionId,
                status,
                mode,
                intent: plan.intent,
                executionRequired,
                durationMs: Date.now() - startedAt,
                message,
                displayText,
                speechText: displayText,
                error: error.message || String(error),
                plan: plan.steps,
                steps: stepResults
            };
            await this.gateway.appendAudit?.({
                runId,
                type: 'agent.run',
                status,
                ok: false,
                durationMs: result.durationMs,
                mode,
                intent: plan.intent,
                args: { message, sessionId, dryRun },
                context: requestContext,
                error: result.error
            });
            this.gateway.emitGatewayEvent?.('agent.run.finished', {
                runId,
                sessionId,
                status,
                mode,
                ok: false,
                durationMs: result.durationMs,
                error: result.error
            });
            return result;
        } finally {
            this.activeRuns.delete(runId);
            this.completedRunCount += 1;
        }
    }
}

module.exports = {
    HumanClawAgentRunner,
    planMessage,
    resolveAgentDecisionTimeoutMs
};
