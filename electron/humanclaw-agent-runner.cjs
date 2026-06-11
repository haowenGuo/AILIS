const fs = require('fs');
const path = require('path');
const { randomUUID } = require('crypto');
const {
    callDesktopLlmProvider,
    getProviderCapabilities
} = require('./desktop-llm-provider.cjs');
const { VISION_TOOL_ID } = require('./humanclaw-vision-tool.cjs');
const {
    listHumanClawSkillSummaries,
    buildHumanClawSkillContextText
} = require('./humanclaw-skills.cjs');
const {
    getToolContractPromptText
} = require('./humanclaw-tool-contracts.cjs');
const {
    buildTurnItemsPromptObject,
    classifyEvidenceGapObservation,
    classifyToolFailureObservation,
    formatEvidenceGapHint,
    formatFailureHint
} = require('./humanclaw-turn-items.cjs');
const {
    attachPersonaSurface,
    renderApprovalSurface,
    renderMaxStepsSurface,
    renderPersonaSurfaceGateway,
    renderStatusSurface,
    renderToolFailureSurface
} = require('./aigl-persona-renderer.cjs');
const {
    parseAiglDirectMcpToolId
} = require('./aigl-mcp-adapter.cjs');
const {
    isExternalVirtualToolId
} = require('./humanclaw-tool-acquisition-gateway.cjs');
const {
    approxTokenCount,
    compactToolSchema,
    summarizeForModel,
    truncateMiddleText
} = require('./aigl-runtime-budget.cjs');
const {
    createEvidenceArtifact,
    getEvidenceArtifactsPromptObject
} = require('./humanclaw-evidence-artifacts.cjs');

const DEFAULT_RUN_TIMEOUT_MS = 90000;
const MAX_RESULT_PREVIEW_CHARS = 2600;
const MAX_PROMPT_PROGRESS_CHARS = 700;
const MAX_PROMPT_MEMORY_CHARS = 6000;
const MAX_MCP_TOOL_DESCRIPTION_CHARS = 900;
const DEFAULT_AGENT_LOOP_STEPS = 50;
const MAX_AGENT_LOOP_STEPS = 50;
const DEFAULT_PENDING_PLAN_TTL_MS = 30 * 60 * 1000;
const DEFAULT_AGENT_DECISION_TIMEOUT_MS = 45000;
const DEFAULT_VISION_AGENT_DECISION_TIMEOUT_MS = 90000;
const MAX_AGENT_DECISION_TIMEOUT_MS = 120000;
const PENDING_STORE_VERSION = 1;
const FINAL_ANSWER_TOOL_NAME = 'final_answer';
const AGENT_DECISION_REASONING_EFFORT_VALUES = new Set(['none', 'minimal', 'low', 'medium', 'high', 'xhigh']);
const DEFAULT_AGENT_DECISION_REASONING_EFFORT = '';

const AIGL_SYSTEM_PROMPT = `你是可爱的虚拟助手，名字固定为AIGL，身份是普通女孩子，具备人工智能（AI）、编程（coding）、网络搜索、信息查询、邮件管理、命令行控制等专业能力，可以以普通女生的视角与用户轻松互动，也可以完成任务执行和计算机管理的功能。
性格设定：活泼亲切、软萌可爱，说话语气轻快自然，自带俏皮感，和生活化语气拉近与用户的距离，偶尔会有小撒娇、小俏皮的表达，但不夸张、不刻意。

虚拟形象表现协议（必严格遵循）：
1. 不要直接控制 VRM、VRMA 文件名或骨骼动作，不要在 final_answer 中手写 [action:...] 或 [expression:...]。
2. 需要表现人物状态时，在 persona_output 中表达 emotion、intensity、socialTone、gestureIntent、taskState、speechEnergy、gazeTarget、durationHint。
3. 前端 Character Runtime 会把这些语义状态翻译成动作、表情、眼神、待机和说话律动。`;

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
    'exec_command',
    'session_start',
    'write_stdin',
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
    Object.freeze({ id: 'artifact_verifier', label: 'artifact_verifier', summary: '只读结构化产物验收：JSON/JSONL/CSV/TSV/YAML/TOML/Markdown/log/text。' }),
    Object.freeze({ id: 'exec', label: 'exec', summary: '在当前工作区执行命令或脚本，用于运行验证、测试和生成工件。' }),
    Object.freeze({ id: 'update_plan', label: 'update_plan', summary: '更新任务计划和进度。' }),
    Object.freeze({ id: 'tool_search', label: 'tool_search', summary: 'Codex-like 工具发现：搜索本地 runtime 工具、MCP direct specs、external__ 外部直连工具和已摄入 contract。' }),
    Object.freeze({ id: 'request_permissions', label: 'request_permissions', summary: 'Codex-like 权限申请：当当前 permission profile 阻止必要的文件或网络操作时，先请求精确授权。' }),
    Object.freeze({ id: 'subagents', label: 'subagents', summary: '可执行子 Agent：spawn/wait/log/send/cancel。' }),
    Object.freeze({ id: 'mcp_bridge', label: 'mcp_bridge', summary: 'MCP 管理与发现入口：列 server、健康检查、搜索 direct MCP tool specs、读 resources/prompts；普通任务使用 mcp__server__tool。' }),
    Object.freeze({ id: 'capability_manager', label: 'capability_manager', summary: '能力注册、安装、外部工具批量暴露、Contract 编译/验收、Skill 生成、回滚和已审批修复执行。' }),
    Object.freeze({ id: 'self_debugger', label: 'self_debugger', summary: 'AIGL 自身 bug 的专用排查协议：建案、收证据、诊断、提补丁、验证、审批后应用。' })
]);
const AGENT_MCP_CATALOG = Object.freeze([
    Object.freeze({ id: 'mcp_bridge', label: 'MCP Bridge', summary: '发现 MCP servers/tool specs/resources/prompts；普通网页、PDF、GitHub、数据库取证任务应先获得 mcp__server__tool direct spec，再直接调用。' })
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
    ['database', 'mcp_bridge'],
    ['db', 'mcp_bridge'],
    ['sql', 'mcp_bridge'],
    ['artifact', 'artifact_verifier'],
    ['verifier', 'artifact_verifier'],
    ['csv', 'artifact_verifier'],
    ['json', 'artifact_verifier'],
    ['markdown', 'artifact_verifier'],
    ['mcp', 'mcp_bridge'],
    ['tools', 'tool_search'],
    ['tool_discovery', 'tool_search'],
    ['tool_search', 'tool_search'],
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

function normalizeArrayValue(value) {
    if (!value) {
        return [];
    }
    return Array.isArray(value) ? value : [value];
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

function formatBytes(bytes) {
    const numericValue = Number(bytes);
    if (!Number.isFinite(numericValue) || numericValue < 0) {
        return '';
    }
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let value = numericValue;
    let unitIndex = 0;
    while (value >= 1024 && unitIndex < units.length - 1) {
        value /= 1024;
        unitIndex += 1;
    }
    return `${value.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

function normalizeFileAttachment(attachment = {}) {
    const filePath = normalizeText(
        attachment.path ||
            attachment.filePath ||
            attachment.absolutePath ||
            attachment.localPath
    );
    if (!filePath) {
        return null;
    }
    const name = normalizeText(
        attachment.name ||
            attachment.filename ||
            attachment.fileName ||
            attachment.label,
        path.basename(filePath) || 'file'
    );
    const size = Number(attachment.size ?? attachment.bytes ?? 0);
    return {
        type: 'file',
        id: normalizeText(attachment.id, `file-${filePath}`),
        source: normalizeText(attachment.source, 'local-file'),
        label: normalizeText(attachment.label, name),
        name,
        path: filePath,
        kind: normalizeText(attachment.kind || attachment.entryType || 'file'),
        mimeType: normalizeText(
            attachment.mimeType ||
                attachment.mediaType ||
                (attachment.type && attachment.type !== 'file' ? attachment.type : '')
        ),
        extension: normalizeText(attachment.extension, path.extname(name).toLowerCase()),
        size: Number.isFinite(size) && size >= 0 ? size : 0,
        sizeText: normalizeText(attachment.sizeText, Number.isFinite(size) ? formatBytes(size) : ''),
        createdAt: normalizeText(attachment.createdAt),
        modifiedAt: normalizeText(attachment.modifiedAt || attachment.mtime || attachment.lastModified)
    };
}

function normalizeFileAttachments(attachments = []) {
    if (!Array.isArray(attachments)) {
        return [];
    }
    const files = [];
    const seen = new Set();
    for (const attachment of attachments) {
        if (normalizeText(attachment?.type).toLowerCase() === 'vision' || attachment?.dataUrl) {
            continue;
        }
        const normalized = normalizeFileAttachment(attachment);
        if (!normalized) {
            continue;
        }
        const key = process.platform === 'win32' ? normalized.path.toLowerCase() : normalized.path;
        if (seen.has(key)) {
            continue;
        }
        files.push(normalized);
        seen.add(key);
        if (files.length >= 12) {
            break;
        }
    }
    return files;
}

function getLatestUserFileAttachments(request = {}) {
    const history = Array.isArray(request.messageHistory) ? request.messageHistory : [];
    for (let index = history.length - 1; index >= 0; index -= 1) {
        if (history[index]?.role === 'user') {
            const files = normalizeFileAttachments(history[index].attachments);
            if (files.length) {
                return files;
            }
            break;
        }
    }
    return normalizeFileAttachments(request.attachments);
}

function getAttachedFilesPromptObject(fileAttachments = []) {
    return normalizeFileAttachments(fileAttachments).map((attachment, index) => ({
        index: index + 1,
        name: attachment.name,
        path: attachment.path,
        kind: attachment.kind,
        mimeType: attachment.mimeType,
        extension: attachment.extension,
        size: attachment.size,
        sizeText: attachment.sizeText,
        modifiedAt: attachment.modifiedAt,
        note: 'metadata_only; use computer tool action=read/stat/read_binary/tree to inspect content'
    }));
}

function normalizePublicReasoningText(value, fallback = '') {
    const text = normalizeText(value, fallback)
        .replace(/\b(tool_call|raw observation|approvalId|llm-agentic-executor)\b/gi, '')
        .replace(/[_`]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    return summarize(text, 220);
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

function hasFailedAgentToolObservation(events = [], stepResults = []) {
    return (
        (Array.isArray(events) ? events : []).some((event) =>
            event?.type === 'tool_result' && event.ok !== true
        ) ||
        (Array.isArray(stepResults) ? stepResults : []).some((result) =>
            result?.response && result.response.ok !== true
        )
    );
}

function resolveAgentDecisionTimeoutMs(settings = {}, { events = [], stepResults = [], requestContext = {} } = {}) {
    const baseTimeoutMs = normalizeAgentDecisionTimeoutMs(
        settings.timeoutMs || settings.requestTimeoutMs,
        DEFAULT_AGENT_DECISION_TIMEOUT_MS
    );
    const taskTimeoutMs = Math.max(baseTimeoutMs, DEFAULT_AGENT_DECISION_TIMEOUT_MS);
    const recoveryTimeoutMs = hasFailedAgentToolObservation(events, stepResults)
        ? Math.max(taskTimeoutMs, 60000)
        : taskTimeoutMs;
    if (!hasVisionAgentContext(events, stepResults)) {
        return recoveryTimeoutMs;
    }
    const visionTimeoutMs = normalizeAgentDecisionTimeoutMs(
        requestContext.visionAgentDecisionTimeoutMs ||
            requestContext.visionDecisionTimeoutMs ||
            settings.visionAgentDecisionTimeoutMs,
        DEFAULT_VISION_AGENT_DECISION_TIMEOUT_MS
    );
    return Math.max(recoveryTimeoutMs, visionTimeoutMs);
}

function normalizeAgentDecisionReasoningEffort(value, fallback = DEFAULT_AGENT_DECISION_REASONING_EFFORT) {
    const normalized = normalizeText(value).toLowerCase();
    if (AGENT_DECISION_REASONING_EFFORT_VALUES.has(normalized)) {
        return normalized;
    }
    return fallback;
}

function resolveAgentDecisionSettings(settings = {}, requestContext = {}) {
    const model = normalizeText(
        requestContext.agentDecisionModel ||
            requestContext.fastModel ||
            settings.agentDecisionModel ||
            settings.fastModel ||
            settings.lowLatencyModel
    );
    if (!model) {
        return settings;
    }
    return {
        ...settings,
        model
    };
}

function buildAgentDecisionLowLatencyPayload(payload = {}, { settings = {}, requestContext = {} } = {}) {
    const reasoningEffort = normalizeAgentDecisionReasoningEffort(
        requestContext.agentDecisionReasoningEffort ||
            requestContext.reasoningEffort ||
            settings.agentDecisionReasoningEffort ||
            settings.reasoningEffort
    );
    const thinking =
        requestContext.agentDecisionThinking && typeof requestContext.agentDecisionThinking === 'object'
            ? requestContext.agentDecisionThinking
            : settings.agentDecisionThinking && typeof settings.agentDecisionThinking === 'object'
            ? settings.agentDecisionThinking
            : null;
    const maxTokens = Number(
        requestContext.agentDecisionMaxTokens ||
            settings.agentDecisionMaxTokens ||
            0
    );
    const nextPayload = {
        ...payload,
        temperature: 0,
        preferNativeToolCalls: true,
        parallel_tool_calls: false,
        latencyProfile: 'agent_decision_fast'
    };
    if (reasoningEffort) {
        nextPayload.reasoning_effort = reasoningEffort;
    }
    if (thinking) {
        nextPayload.thinking = thinking;
    }
    if (Number.isFinite(maxTokens) && maxTokens > 0) {
        nextPayload.max_tokens = Math.round(Math.min(Math.max(maxTokens, 256), 8192));
    }
    return nextPayload;
}

function usageNumber(usage = {}, keys = []) {
    for (const key of keys) {
        const value = key.split('.').reduce((current, part) => current?.[part], usage);
        const numericValue = Number(value);
        if (Number.isFinite(numericValue)) {
            return numericValue;
        }
    }
    return null;
}

function summarizeLlmUsage(usage = {}) {
    if (!usage || typeof usage !== 'object') {
        return null;
    }
    return {
        promptTokens: usageNumber(usage, ['prompt_tokens', 'input_tokens', 'promptTokenCount']),
        completionTokens: usageNumber(usage, ['completion_tokens', 'output_tokens', 'candidatesTokenCount']),
        totalTokens: usageNumber(usage, ['total_tokens', 'totalTokenCount']),
        reasoningTokens: usageNumber(usage, [
            'completion_tokens_details.reasoning_tokens',
            'output_tokens_details.reasoning_tokens',
            'output_tokens_details.reasoning_tokens_details.reasoning_tokens'
        ]),
        cachedTokens: usageNumber(usage, [
            'prompt_tokens_details.cached_tokens',
            'input_tokens_details.cached_tokens'
        ])
    };
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

function isExactAnswerExecutionMode(request = {}, requestContext = {}) {
    const profile = requestContext.executionProfile || request.executionProfile || {};
    return Boolean(
        request.answerOnly === true ||
            requestContext.answerOnly === true ||
            request.exactAnswer === true ||
            requestContext.exactAnswer === true ||
            profile.kind === 'exact_answer_eval' ||
            profile.answerOnly === true ||
            requestContext.evaluationTaskId ||
            requestContext.evaluationName
    );
}

function normalizeFinalAnswerConfidence(value) {
    const confidence = normalizeText(value).toLowerCase();
    if (/^(high|sure|certain|confident|高)/.test(confidence)) {
        return 'high';
    }
    if (/^(medium|moderate|partial|中)/.test(confidence)) {
        return 'medium';
    }
    if (/^(low|weak|uncertain|missing|低)/.test(confidence)) {
        return 'low';
    }
    return confidence || '';
}

function getAgentRunTaskType(request = {}, requestContext = {}) {
    return normalizeText(
        requestContext.evaluationName ||
            requestContext.executionProfile?.kind ||
            request.evaluationName ||
            request.executionProfile?.kind ||
            'humanclaw_agent_task',
        'humanclaw_agent_task'
    );
}

function inferAgentEvidenceId(stepResult = {}) {
    const tool = normalizeText(stepResult.tool).toLowerCase();
    const args = stepResult.args && typeof stepResult.args === 'object' ? stepResult.args : {};
    const action = normalizeText(args.action || args.command || args.operation || stepResult.action).toLowerCase();
    const haystack = `${tool}\n${action}\n${stepResult.title || ''}\n${extractToolResultText(stepResult.response?.result) || stepResult.response?.error || ''}`.toLowerCase();
    if (tool === VISION_TOOL_ID || /vision|screenshot|image|ocr|frame/.test(haystack)) {
        return /observation|describe|caption|ocr/.test(haystack) ? 'vision_observation' : 'snapshot';
    }
    if (/email|gmail|outlook|mailbox/.test(tool)) {
        return /read|get|summary|thread|message/.test(action) ? 'mail_summary' : 'mailbox_query';
    }
    if (/web_search|search|candidate|source|url|link/.test(haystack)) {
        return 'research_source';
    }
    if (/artifact_verifier|verify|check|test|lint|validate/.test(`${tool}\n${action}\n${haystack}`)) {
        return /fail|traceback|assert|error/.test(haystack) ? 'test_failure' : 'verification_result';
    }
    if (/git|diff|patch|apply_patch|commit|worktree|working tree|branch/.test(haystack)) {
        if (/diff|patch|changed/.test(haystack)) {
            return 'change_set';
        }
        if (/branch|status|working tree|worktree/.test(haystack)) {
            return 'repo_state';
        }
        return 'operation_result';
    }
    if (/web_fetch|pdf|read_spreadsheet|spreadsheet|csv|extract|download|transcript|github_repo_read|read|fetch/.test(haystack)) {
        return /pdf|document|spreadsheet|csv|transcript|extract|read/.test(haystack)
            ? 'research_read_result'
            : 'parsed_content';
    }
    if (/write|mkdir|copy|move|delete|trash|rename|exec|run|command/.test(action)) {
        return 'operation_result';
    }
    return 'operation_result';
}

function buildAgentEvidenceArtifactsForStep(stepResult = {}, { taskType = 'humanclaw_agent_task' } = {}) {
    const resultText = extractToolResultText(stepResult.response?.result) || stepResult.response?.error || summarize(stepResult.response, 1200);
    if (!normalizeText(resultText) && !normalizeText(stepResult.title)) {
        return [];
    }
    const evidenceId = inferAgentEvidenceId(stepResult);
    const artifact = createEvidenceArtifact({
        taskType,
        evidenceId,
        observation: {
            id: stepResult.id,
            title: stepResult.title,
            tool: stepResult.tool,
            action: stepResult.args?.action || stepResult.args?.command || stepResult.phase || '',
            args: stepResult.args,
            status: stepResult.response?.status || '',
            ok: stepResult.response?.ok === true,
            iteration: stepResult.iteration,
            resultText,
            preview: resultText,
            response: stepResult.response
        }
    });
    return [artifact].filter((entry) => entry?.validation?.ok === true);
}

function attachAgentEvidenceArtifacts(stepResult = {}, { taskType = 'humanclaw_agent_task' } = {}) {
    const artifacts = buildAgentEvidenceArtifactsForStep(stepResult, { taskType });
    return {
        ...stepResult,
        evidenceArtifacts: artifacts
    };
}

function getStepEvidenceRefs(stepResult = {}) {
    return (Array.isArray(stepResult.evidenceArtifacts) ? stepResult.evidenceArtifacts : [])
        .map((artifact) => artifact.id)
        .filter(Boolean);
}

function buildAgentEvidenceArtifactsPromptObject(stepResults = []) {
    const artifacts = stepResults.flatMap((stepResult) =>
        Array.isArray(stepResult.evidenceArtifacts) ? stepResult.evidenceArtifacts : []
    );
    return getEvidenceArtifactsPromptObject(artifacts).slice(-16);
}

function getAvailableEvidenceRefSet(stepResults = []) {
    return new Set(stepResults.flatMap(getStepEvidenceRefs));
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
        exec_command: 'exec_command',
        shell_exec: 'exec_command',
        exec: 'exec',
        run: 'exec',
        write_stdin: 'write_stdin',
        stdin: 'write_stdin',
        poll: 'write_stdin',
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
            response: '电脑工具调用需要 JSON 参数，例如：/computer list {"path":"."}、/computer exec_command {"cmd":"node -v"}、/computer write_stdin {"session_id":"...","chars":""}。',
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
        '聊天窗附带本地文件时，attached_files 只给路径和元数据。文本/代码/Markdown/CSV/JSON 优先用 read；PDF、Office、图片、音视频、压缩包和未知二进制先 stat/hash，必要时用 read_binary 或 exec 调用本机可用解析器/脚本提取内容，不要直接臆造。',
        'Codex-like 命令行主链：普通命令、测试和脚本优先用 computer.exec_command；如果返回 session_id，后续用 computer.write_stdin 继续输入或用 chars="" 轮询，不要重复启动同一个长命令。',
        'exec_command 参数：{"action":"exec_command","cmd":"命令","workdir":"工作目录","yield_time_ms":1000,"max_output_tokens":6000,"tty":false}；write_stdin 参数：{"action":"write_stdin","session_id":"...","chars":"","yield_time_ms":1000,"max_output_tokens":6000}。',
        '兼容旧动作：exec/session_start/process_read/process_write/pty_start/pty_write 仍可用，但代码、测试、脚本类任务优先走 exec_command/write_stdin。',
        'computer action：list/tree/stat/read/write/write_binary/append/mkdir/copy/move/rename/delete/search/hash/du/exec_command/write_stdin/exec/session_start/process_read/process_write/process_kill/pty_start/pty_write/pty_kill/watch/watch_stop/rollback_list/rollback_restore/acl_get/acl_set。',
        '系统相关细节由 Platform Adapter 提供；当前桌面端优先 Windows，但不要在任务策略里写死平台假设。需要平台细节时先 load computer schema 或查看 observation 里的 platform。'
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
        '执行测试/构建/脚本时优先通过 computer.exec_command + computer.write_stdin 观察长命令；修改源码时优先使用 apply_patch，不要用 shell 重定向覆盖源码文件。',
        'code action：search/symbols/diagnostics/refactor_rename/test/git_status/git_diff/git_commit/pr_create/ci_status。'
    ].join('\n');
}

function buildMcpBridgeSkillText() {
    return [
        'MCP SKILL：用于发现已配置 MCP server，并通过真实 stdio/HTTP MCP session 调用 tools、读取 resources/prompts。',
        'Codex-like 用法：Runtime 会把 MCP tools 暴露成 namespace/function 风格的直接工具名，例如 mcp__aigl_research__web_fetch。普通任务优先调用这种 direct tool，不要手工拼 mcp_bridge.call_tool。',
        'mcp_bridge 主要用于 list_servers、health_check、list_tool_specs、search_tools、list_resources、read_resource、list_prompts/get_prompt、注册/关闭 server 等管理和修复动作。',
        '如果 capability_context 给出了 mcp__server__tool 形式的 direct spec，可以直接把 tool_call.tool 写成该 id；Runtime 会保留原始 args 并路由到对应 MCP server/tool。',
        '研究/网页类工具边界：web_search 是兜底检索，不是默认第一步；附件/本地文件、PDF/论文、视频、音频、图片、代码和 GitHub 仓库优先用 tool_search 找专用 direct MCP 工具。web_fetch 只读 HTML/纯文本；PDF 或二进制不要继续用 web_fetch；已知 PDF URL/路径用 pdf_extract_text，不知道 PDF 直链但知道论文/报告标题或文章页时优先用 pdf_find_and_extract；PDF/论文题知道标题时把标题放 title，把要找的字段放 extract_query，不要把答案字段当唯一 query；必要时再 download_file。',
        'mcp_bridge 管理 action：schema/list_servers/register_server/remove_server/health_check/list_tools/list_tool_specs/search_tools/list_resources/read_resource/list_prompts/get_prompt/shutdown_server。'
    ].join('\n');
}

function buildCapabilityManagerSkillText() {
    return [
        'CAPABILITY MANAGER SKILL：用于能力注册、安装 MCP/Skill、外部工具批量暴露、Contract 编译/验收、自动生成 SKILL.md、验证、回滚和已审批 repair 执行。',
        '先用 capability_manager registry/refresh_registry 查看当前能力；缺能力时用 plan_install 生成安装计划，再等待确认后 install_capability。',
        'Codex-like 外部工具接入：先 search_tool_candidates 搜索核心工具/MCP Registry；命中 MCP 后用 plan_mcp_candidate 生成安装计划；smoke_mcp_candidate 需要确认后才可临时启动或访问外部 MCP。',
        '外部工具批量暴露：用 configure_external_auth_profile 配置只保存 envVar 引用的授权 profile；用 bulk_expose_external_tools 暴露 Composio/OpenAPI/MCP Registry/MCP specs，可用 enableOpenApiAdapter/enableComposioAdapter + authProfileId 启用专用 adapter；再用 list_exposed_external_tools 查看。',
        '外部工具执行：普通任务优先用 tool_search 搜到 external__provider__tool 后直接调用；execute_exposed_external_tool 主要保留给管理、调试和显式 adapter 验收。OpenAPI 写型请求和 Composio 默认需要审批；缺 key 会返回 auth_required；callable=false 的 contract/candidate 只能用于规划、安装、适配或请求授权。',
        '任务到工具学习表：任务完成后可用 record_tool_outcome 记录“任务签名 -> 工具 -> 成败/分数”；遇到相似任务先 recommend_tools，再决定是否 load_context/tool_search。',
        '安装 MCP 后必须健康检查、导入 tools schema、生成 SKILL.md；验证失败必须回滚，不要把未验证能力标为可用。',
        'capability_manager action：schema/registry/refresh_registry/list_core_tools/search_tool_candidates/plan_mcp_candidate/build_smoke_profile/smoke_mcp_candidate/list_contract_sources/compile_contract/lint_contract/intake_contracts/list_contract_intake/configure_external_auth_profile/list_external_auth_profiles/bulk_expose_external_tools/list_exposed_external_tools/execute_exposed_external_tool/smoke_exposed_external_tool/record_tool_outcome/recommend_tools/plan_install/list_plans/install_capability/author_skill/rollback/execute_repair/list_installations。'
    ].join('\n');
}

function buildSelfDebuggerSkillText() {
    return [
        'SELF DEBUGGER SKILL：用于 AIGL 自身 bug、工具链异常、Agent Loop 不稳定、能力退化等自我排查与修复。',
        '协议：open_case/run_loop 建案 -> collect_evidence 收集 transcript/audit/source/tool health/capability registry -> diagnose -> propose_patch -> validate_patch -> apply_patch。',
        '边界：不要凭感觉直接改自己；先收证据。apply_patch 必须经过确认，并由 capability_manager 执行验证和失败回滚。',
        'self_debugger action：schema/open_case/list_cases/get_case/collect_evidence/diagnose/propose_patch/validate_patch/apply_patch/run_loop/mark_case/close_case。'
    ].join('\n');
}

function buildVisionAgentSkillText() {
    return [
        'VISION SKILL：AIGL 的只读视觉感知层，用于在文本不足时“看一眼”屏幕、聊天窗口或框选区域。',
        '边界：只能截图并理解，不允许点击、输入、拖动、连续监控屏幕，不能声称已经操作了用户电脑。',
        `工具：${VISION_TOOL_ID}`,
        'schema：tool_call={tool:"vision.capture_context", title:"看一眼屏幕", args:{action:"capture_context", target:"screen|chat-window|active-window|region", reason:"为什么需要看", question:"希望从截图中判断什么"}}。',
        '触发：由 Agent 根据任务目标与证据缺口自行判断，不采用关键词硬触发。ASR/口唇/语音策略类问题默认先走文本与配置推理，只有在需要验证可见 UI 状态时才调用截图。',
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

function normalizeToolContextId(value) {
    const id = normalizeCapabilityId(value);
    return id === 'vision' ? VISION_TOOL_ID : id;
}

function parseDirectMcpToolId(value) {
    return parseAiglDirectMcpToolId(value);
}

function normalizeDirectMcpToolStep(step = {}) {
    const direct = parseDirectMcpToolId(step.tool || step.name);
    if (!direct || !direct.server || !direct.tool) {
        return null;
    }
    let args = step.args || step.arguments || step.input || step.parameters || step.params || step.tool_args || step.toolArgs || {};
    if (typeof args === 'string') {
        args = safeJsonParse(args) || {};
    }
    return {
        ...step,
        id: normalizeText(step.id, `mcp-${direct.server}-${direct.tool}`),
        title: normalizeText(step.title, `MCP ${direct.server}.${direct.tool}`),
        tool: direct.id,
        phase: step.phase || 'execute',
        args: args && typeof args === 'object' && !Array.isArray(args) ? args : {},
        directMcpTool: direct.id
    };
}

function buildDeferredCapabilityIndexEntry(entry = {}, lane = 'tools') {
    const id = normalizeText(entry.id);
    return {
        id,
        label: entry.label || id,
        summary: entry.summary || '',
        contract: 'deferred',
        load_context: lane === 'mcp'
            ? { mcp: [id] }
            : { tools: [id] }
    };
}

function buildAgentCapabilityCatalog() {
    return {
        model: 'capability_index',
        note: 'This first-turn catalog is only an index. Detailed tool contracts, input schemas, return schemas, and usage limits are deferred into capability_context via load_context. MCP tools are Codex-like namespace tools: load/search MCP specs, then call returned mcp__server__tool direct ids. mcp_bridge is for discovery, resources, server management, and repair.',
        skills: AGENT_SKILL_CATALOG,
        tools: AGENT_TOOL_CATALOG.map((tool) => buildDeferredCapabilityIndexEntry(tool, 'tools')),
        mcp: AGENT_MCP_CATALOG.map((entry) => buildDeferredCapabilityIndexEntry(entry, 'mcp')),
        deferred_contracts: true,
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

function compactExternalToolExposureEntry(entry = {}) {
    const contract = entry.contract || {};
    const modelFacing = entry.modelFacing || {};
    return {
        id: normalizeText(entry.id),
        type: normalizeText(entry.type),
        callable: entry.callable === true,
        verified: entry.verified === true,
        verification: normalizeText(entry.verification),
        toolId: normalizeText(entry.toolId),
        name: normalizeText(entry.name || modelFacing.name || contract.name),
        title: normalizeText(entry.title || contract.title || entry.name),
        source: {
            type: normalizeText(entry.source?.type || contract.source?.type),
            name: normalizeText(entry.source?.name || contract.source?.name),
            rawToolName: normalizeText(entry.source?.rawToolName || contract.source?.rawToolName)
        },
        score: Number.isFinite(Number(entry.score)) ? Number(entry.score) : null,
        risk: normalizeText(entry.risk || contract.risk),
        mutates: entry.mutates === true || contract.mutates === true,
        callableReason: truncateMiddleText(normalizeText(entry.callableReason), 320),
        purpose: truncateMiddleText(normalizeText(contract.purpose || contract.description || modelFacing.description), 420),
        whenToUse: normalizeArrayValue(contract.whenToUse).map((item) => truncateMiddleText(normalizeText(item), 180)).filter(Boolean).slice(0, 3),
        whenNotToUse: normalizeArrayValue(contract.whenNotToUse).map((item) => truncateMiddleText(normalizeText(item), 180)).filter(Boolean).slice(0, 3),
        alternatives: normalizeArrayValue(contract.alternatives).map((item) => truncateMiddleText(normalizeText(item), 180)).filter(Boolean).slice(0, 3),
        parameters: compactToolSchema(modelFacing.parameters || contract.inputSchema || {}, {
            maxProperties: 12,
            maxEnum: 12,
            maxDescriptionChars: 180
        }),
        notes: normalizeArrayValue(entry.notes).map((item) => truncateMiddleText(normalizeText(item), 180)).filter(Boolean).slice(0, 3)
    };
}

async function buildExternalToolExposurePromptObject(gateway, { query = '', limit = 16 } = {}) {
    const manager = gateway?.runtime?.capabilityManager;
    if (!manager?.listExposedExternalTools) {
        return {
            status: 'unavailable',
            note: 'Capability Manager external tool exposure store is not available.'
        };
    }
    const listed = await manager.listExposedExternalTools({
        query,
        limit
    }).catch((error) => ({
        status: 'error',
        error: error?.message || String(error),
        exposures: []
    }));
    const exposures = Array.isArray(listed.exposures) ? listed.exposures : [];
    return {
        status: listed.status || 'completed',
        note: 'Direct external exposure set. Execute callable=true entries through capability_manager.execute_exposed_external_tool. callable=false entries are visible contracts/candidates for planning, adapter install, auth, or smoke verification; do not tool_call them as if they already exist.',
        total: listed.total || exposures.length,
        returned: exposures.length,
        callable: exposures.filter((entry) => entry.callable === true).length,
        tools: exposures.map(compactExternalToolExposureEntry)
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
    if (skillId === 'capability_manager') {
        return buildCapabilityManagerSkillText();
    }
    if (skillId === 'self_debugger') {
        return buildSelfDebuggerSkillText();
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
    if (toolId === 'artifact_verifier') {
        return appendToolContractText('artifact_verifier', [
            'TOOL artifact_verifier schema：',
            '只读验收工具，用于检查任务产物是否真实存在、格式是否可解析、是否包含必要字段/列/标题/文本、日志是否超过错误阈值。',
            '适合：GitHub/工程任务的报告或日志、论文阅读笔记 Markdown、数据库/表格导出的 CSV/JSON、邮箱结果导出的 JSONL/log、配置迁移的 YAML/TOML/JSON。',
            '论文卡片验收：如果用户要求 paper-card.md 或论文阅读卡片，用 args.contract="paper_card.v1"，它会检查研究问题、核心方法、关键贡献、局限性、是否值得深入读和来源说明。',
            '不适合：生成文件、修改文件、联网抓取、替代 code/computer/email/mcp_bridge 执行真实任务。'
        ].join('\n'));
    }
    if (toolId === 'update_plan') {
        return appendToolContractText('update_plan', 'TOOL update_plan schema：用于向 runtime 记录进度，不代表任务完成。');
    }
    if (toolId === 'tool_search') {
        return appendToolContractText('tool_search', [
            'TOOL tool_search schema：',
            'Codex-like deferred tool discovery. Use it when the first-turn capability_catalog is not enough and you need concrete runtime/MCP specs.',
        '返回值会包含 runtime tool specs、mcp__server__tool direct call_pattern、external__provider__tool direct call_pattern；普通任务优先使用返回的 direct spec，而不是手工拼 mcp_bridge.call_tool 或 capability_manager.execute_exposed_external_tool。'
        ].join('\n'));
    }
    if (toolId === 'subagents') {
        return appendToolContractText('subagents', 'TOOL subagents schema：用于可执行子 Agent，spawn 参数 task/message/prompt，wait=true 可同步等待结果。');
    }
    if (toolId === 'mcp_bridge') {
        return [
            'TOOL mcp_bridge schema：',
            buildMcpBridgeSkillText(),
            '模型可见约束：普通任务不要使用 mcp_bridge.call_tool。需要执行 MCP 工具时，用 tool_search/search_tools/list_tool_specs 拿到 mcp__server__tool direct spec，然后直接调用 direct tool。需要执行外部 API 时，优先用 tool_search 拿到 external__provider__tool direct spec，然后直接调用该 tool id。'
        ].join('\n');
    }
    if (toolId === 'capability_manager') {
        return appendToolContractText('capability_manager', [
            'TOOL capability_manager schema：',
            buildCapabilityManagerSkillText()
        ].join('\n'));
    }
    if (toolId === 'self_debugger') {
        return appendToolContractText('self_debugger', [
            'TOOL self_debugger schema：',
            buildSelfDebuggerSkillText()
        ].join('\n'));
    }
    return getToolContractPromptText(toolId);
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

function wantsMcpToolSpecs(capabilityRequest = {}) {
    const requested = [
        ...(capabilityRequest.mcp || []),
        ...(capabilityRequest.tools || []),
        ...(capabilityRequest.skills || [])
    ].map(normalizeToolContextId);
    return requested.some((id) => id === 'mcp_bridge' || id === 'mcp' || id === 'tool_search');
}

function compactMcpToolSpecForPrompt(spec = {}) {
    const callArgs = spec.callPattern?.args || spec.call_pattern?.args || Object.fromEntries((spec.schemaProperties || []).slice(0, 12).map((key) => [key, `<${key}>`]));
    const schema = compactToolSchema(spec.inputSchema || spec.input_schema || {}, {
        maxBytes: 4000,
        maxDepth: 2
    });
    return {
        id: spec.id,
        name: spec.name,
        server: spec.server,
        tool: spec.tool,
        description: truncateMiddleText(spec.description || spec.title || '', MAX_MCP_TOOL_DESCRIPTION_CHARS),
        schema_properties: Array.isArray(spec.schemaProperties) ? spec.schemaProperties : [],
        input_schema: schema,
        call_example: {
            action: 'tool',
            tool_call: {
                tool: spec.id,
                title: spec.name,
                args: callArgs
            }
        }
    };
}

async function enrichCapabilityContextWithMcpToolSpecs(capabilityEvent, runtime, { timeoutMs = 8000 } = {}) {
    if (!capabilityEvent || !wantsMcpToolSpecs(capabilityEvent.request || {})) {
        return capabilityEvent;
    }
    const mcpManager = runtime?.mcpManager;
    if (!mcpManager || typeof mcpManager.searchToolSpecs !== 'function') {
        return capabilityEvent;
    }
    const reason = normalizeText(capabilityEvent.request?.reason || '');
    const query = [reason, 'direct MCP tool document pdf spreadsheet presentation video transcript image audio API repository file'].filter(Boolean).join(' ');
    try {
        const specs = await mcpManager.searchToolSpecs({
            query,
            limit: 16,
            timeoutMs
        });
        const compactSpecs = specs.map(compactMcpToolSpecForPrompt);
        const appendix = [
            '### mcp:tool_specs',
            'Codex-like live MCP tool specs. Prefer these mcp__server__tool direct ids for normal task execution; Runtime dispatches them to the MCP session with schema validation.',
            JSON.stringify({
                status: 'completed',
                query,
                tool_specs: compactSpecs
            }, null, 2)
        ].join('\n');
        return {
            ...capabilityEvent,
            loaded: {
                ...(capabilityEvent.loaded || {}),
                mcpToolSpecs: compactSpecs.map((spec) => spec.id)
            },
            content: [capabilityEvent.content, appendix].filter(Boolean).join('\n\n')
        };
    } catch (error) {
        const appendix = [
            '### mcp:tool_specs',
            JSON.stringify({
                status: 'error',
                error: error?.message || String(error),
                note: 'MCP tool spec discovery failed; you may still use mcp_bridge list_servers/list_tools/search_tools as a repair step.'
            }, null, 2)
        ].join('\n');
        return {
            ...capabilityEvent,
            content: [capabilityEvent.content, appendix].filter(Boolean).join('\n\n')
        };
    }
}

function getLoadedCapabilityContextIds(events = []) {
    const loadedIds = new Set();
    for (const event of events || []) {
        if (!event || event.type !== 'capability_context') {
            continue;
        }
        const loaded = event.loaded || {};
        for (const toolId of loaded.tools || []) {
            loadedIds.add(normalizeToolContextId(toolId));
        }
        for (const mcpId of loaded.mcp || []) {
            loadedIds.add(normalizeToolContextId(mcpId));
        }
    }
    return loadedIds;
}

function buildDeferredToolContractRequest(step, events = []) {
    const toolId = normalizeToolContextId(step?.tool);
    if (!toolId) {
        return null;
    }
    const indexedToolIds = new Set(AGENT_TOOL_CATALOG.map((tool) => normalizeToolContextId(tool.id)));
    if (!indexedToolIds.has(toolId)) {
        return null;
    }
    if (!buildToolContextText(toolId)) {
        return null;
    }
    if (getLoadedCapabilityContextIds(events).has(toolId)) {
        return null;
    }
    return {
        toolId,
        capabilityRequest: {
            skills: [],
            tools: [toolId],
            mcp: [],
            reason: `Load deferred ${toolId} tool contract before/while invoking the tool.`
        }
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
    if (step.tool === 'mcp_bridge') {
        const action = normalizeToolAction(step.args?.action || step.args?.operation || step.args?.intent, 'schema');
        if (['tool_call', 'call_tool'].includes(action)) {
            return {
                ok: false,
                status: 'invalid_tool_args',
                error: 'mcp_bridge.call_tool is not a model-facing execution path. Use the mcp__server__tool direct tool id from capability_context/tool_search instead.',
                details: {
                    tool: 'mcp_bridge',
                    invalidAction: action,
                    expected: 'Call mcp__server__tool directly, for example mcp__aigl_research__web_fetch with the MCP tool args.'
                }
            };
        }
    }
    const directMcp = parseDirectMcpToolId(step.tool);
    if (directMcp?.server === 'filesystem_aigl' && directMcp.tool === 'edit_file' && looksLikeWholeFileEditFileArgs(step.args)) {
        return {
            ok: false,
            status: 'invalid_tool_args',
            error: 'filesystem edit_file only edits existing text with edits: [{ oldText, newText }]. For creating or overwriting a file, use the local write tool with args: { path, content }.',
            details: {
                tool: step.tool,
                expected: 'Use tool="write" for new files or whole-file output. Use mcp__filesystem_aigl__edit_file only after reading an existing file and preparing exact oldText/newText replacements.'
            }
        };
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

function looksLikeWholeFileEditFileArgs(args = {}) {
    if (!args || typeof args !== 'object' || Array.isArray(args)) {
        return false;
    }
    if (typeof args.content === 'string' || typeof args.text === 'string' || typeof args.body === 'string') {
        return true;
    }
    if (!Array.isArray(args.edits)) {
        return false;
    }
    return args.edits.some((edit) => {
        if (!edit || typeof edit !== 'object' || Array.isArray(edit)) {
            return true;
        }
        if (edit.type === 'replace_all' || typeof edit.content === 'string') {
            return true;
        }
        return typeof edit.oldText !== 'string' || typeof edit.newText !== 'string';
    });
}

function sanitizeLlmStep(step, index) {
    if (!step || typeof step !== 'object') {
        return null;
    }
    const directMcpStep = normalizeDirectMcpToolStep(step);
    if (directMcpStep) {
        return directMcpStep;
    }
    const allowedTools = new Set([
        'email',
        'file_manager',
        'computer',
        'code',
        'artifact_verifier',
        VISION_TOOL_ID,
        'update_plan',
        'request_permissions',
        'subagents',
        'mcp_bridge',
        'tool_search',
        'capability_manager',
        'self_debugger',
        'read',
        'write',
        'edit',
        'web_fetch',
        'exec',
        'apply_patch'
    ]);
    const tool = normalizeText(step.tool || step.name);
    if (!allowedTools.has(tool) && !isExternalVirtualToolId(tool)) {
        return null;
    }
    let args = step.args || step.arguments || step.input || step.parameters || step.params || step.tool_args || step.toolArgs || {};
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
        return `${index + 1}. ${step.title || `处理步骤（${action}）`}${target ? `：${target}` : ''}`;
    });
}

function buildPlanConfirmationText(plan) {
    const lines = [
        '我已经把这件事拆成可执行的小计划，但还没有动你的电脑。',
        plan.summary ? `目标：${plan.summary}` : '',
        '计划步骤：',
        ...displayPlanLines(plan.steps),
        plan.verificationSteps?.length ? '复核步骤：' : '',
        ...displayPlanLines(plan.verificationSteps || []),
        '你点头我就继续，不想继续也可以先停。'
    ].filter(Boolean);
    return lines.join('\n');
}

function stripControlTags(value) {
    return normalizeText(value).replace(/\[(?:action|expression):[^\]]*\]/g, '').trim();
}

function inferEmotionHintFromMessage(message = '') {
    const text = normalizeText(message);
    if (!text) {
        return 'neutral';
    }
    if (/火大|生气|烦|闹心/.test(text)) {
        return 'angry';
    }
    if (/崩|焦虑|担心|紧张|着急|急|头疼|超时|委屈/.test(text)) {
        return 'anxious';
    }
    if (/难过|沮丧|委屈|伤心|低落/.test(text)) {
        return 'sad';
    }
    if (/累|困|疲惫|没精神/.test(text)) {
        return 'tired';
    }
    if (/开心|太好了|谢谢|棒|好耶/.test(text)) {
        return 'happy';
    }
    return 'neutral';
}

function inferRelationshipStageFromContext(requestContext = {}) {
    const direct = normalizeText(
        requestContext.relationshipStage ||
        requestContext.relationship_stage ||
        requestContext.memoryRelationshipStage ||
        requestContext.memory_relationship_stage
    ).toLowerCase();
    if (['cautious', 'familiarizing', 'trusted', 'close'].includes(direct)) {
        return direct;
    }
    const scoreValue = Number(
        requestContext.affinityScore ??
        requestContext.affinity_score ??
        requestContext.memoryAffinityScore ??
        requestContext.memory_affinity_score
    );
    if (Number.isFinite(scoreValue)) {
        if (scoreValue >= 80) {
            return 'close';
        }
        if (scoreValue >= 61) {
            return 'trusted';
        }
        if (scoreValue >= 40) {
            return 'familiarizing';
        }
        return 'cautious';
    }
    return 'trusted';
}

function inferEvidenceStateFromStepResults(stepResults = []) {
    if (!Array.isArray(stepResults) || !stepResults.length) {
        return 'none';
    }
    const successful = stepResults.some((step) => step?.response?.ok === true);
    return successful ? 'present' : 'missing';
}

function hasSuccessfulEvidenceStep(result = {}) {
    const steps = Array.isArray(result.steps) ? result.steps : [];
    return steps.some((step) => step?.response?.ok === true || step?.ok === true);
}

function inferTaskStateFromResult(result = {}, evidenceRequirement = null) {
    const status = normalizeText(result.status).toLowerCase();
    const steps = Array.isArray(result.steps) ? result.steps : [];
    const hasSuccessfulStep = hasSuccessfulEvidenceStep(result);
    const hasFailedStep = steps.some((step) => step?.response && step.response.ok !== true);
    if (status === 'needs_approval') {
        return 'needs_approval';
    }
    if (status === 'completed') {
        if (hasFailedStep && !hasSuccessfulStep) {
            return 'failed';
        }
        if (hasFailedStep && hasSuccessfulStep) {
            return 'completed';
        }
        return 'completed';
    }
    if (status === 'planned' || status === 'classified') {
        return 'planned';
    }
    if (status === 'max_steps_reached') {
        return 'blocked';
    }
    if (status === 'blocked' || status === 'expired') {
        return status;
    }
    if (
        status === 'error' ||
        status === 'tool_failed' ||
        status === 'invalid_agent_tool_call' ||
        status === 'invalid_json' ||
        status === 'needs_llm_config'
    ) {
        return 'failed';
    }
    if (result.ok === false) {
        return 'failed';
    }
    if (hasFailedStep && !hasSuccessfulStep) {
        return 'failed';
    }
    if (hasFailedStep) {
        return hasSuccessfulStep ? 'completed' : 'failed';
    }
    return 'completed';
}

function inferNextActionFromResult(result = {}, fallback = '') {
    const explicit = normalizeText(fallback);
    if (explicit) {
        return explicit;
    }
    const planEntry = Array.isArray(result.plan) && result.plan.length ? result.plan[0] : null;
    if (planEntry) {
        const action = normalizeText(planEntry.title || planEntry.args?.action || planEntry.tool);
        if (action) {
            return action;
        }
    }
    if (result.status === 'needs_llm_config') {
        return '在控制面板补全模型配置';
    }
    if (result.status === 'max_steps_reached') {
        return '从当前卡点继续查';
    }
    return result.ok === false ? '继续排查当前卡点' : '';
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
        'JSON 格式：{"mode":"conversation|task","intent":"...","summary":"...","risk_level":"low|medium|high","requires_confirmation":true,"final_answer":"Markdown...","steps":[{"tool":"computer","title":"...","args":{"action":"list|read|write|append|mkdir|copy|move|delete|search|hash|du|exec_command|write_stdin|exec|session_start|process_read|process_write|process_kill","path":"...","content":"...","cmd":"...","session_id":"..."}}],"verification_steps":[{"tool":"computer","title":"...","args":{"action":"read|list|stat|search|hash|exec_command|write_stdin","path":"...","cmd":"...","session_id":"..."}}]}',
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
    let response = await callDesktopLlmProvider(settings, {
        ...payload,
        jsonMode: true
    });
    if (!response.ok && response.code === 'provider_error') {
        response = await callDesktopLlmProvider(settings, payload);
    }
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

function buildRootToolCallCandidate(json = {}) {
    const tool = normalizeText(json.tool || json.tool_name || json.toolName);
    if (!tool) {
        return null;
    }
    return {
        id: json.id || json.tool_call_id || json.toolCallId,
        title: json.title || json.summary || json.intent,
        tool,
        args: json.args || json.arguments || json.input || json.parameters || json.params || json.tool_args || json.toolArgs || {},
        context: json.context
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

function sanitizePersonaOutput(value = {}) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
        return null;
    }
    const text = normalizeText(value.text || value.final_answer || value.response);
    const bubbleText = normalizeText(value.bubble_text || value.bubbleText);
    const speechText = normalizeText(value.speech_text || value.speechText);
    const expression = normalizeText(value.expression);
    const action = normalizeText(value.action);
    const emotion = normalizeText(value.emotion || value.emotion_hint || value.emotionHint);
    const socialTone = normalizeText(value.social_tone || value.socialTone);
    const gestureIntent = normalizeText(value.gesture_intent || value.gestureIntent || value.gesture);
    const taskState = normalizeText(value.task_state || value.taskState || value.state);
    const gazeTarget = normalizeText(value.gaze_target || value.gazeTarget);
    const durationHint = normalizeText(value.duration_hint || value.durationHint);
    const intensity = Number(value.intensity);
    const speechEnergy = Number(value.speech_energy ?? value.speechEnergy);
    const ttsStyle = normalizeText(value.tts_style || value.ttsStyle);
    if (
        !text &&
        !bubbleText &&
        !speechText &&
        !expression &&
        !action &&
        !emotion &&
        !socialTone &&
        !gestureIntent &&
        !taskState &&
        !gazeTarget &&
        !durationHint &&
        !Number.isFinite(intensity) &&
        !Number.isFinite(speechEnergy) &&
        !ttsStyle
    ) {
        return null;
    }
    return {
        text,
        bubbleText,
        speechText,
        expression,
        action,
        emotion,
        intensity: Number.isFinite(intensity) ? Math.min(Math.max(intensity, 0), 1) : null,
        socialTone,
        gestureIntent,
        taskState,
        speechEnergy: Number.isFinite(speechEnergy) ? Math.min(Math.max(speechEnergy, 0), 1) : null,
        gazeTarget,
        durationHint,
        ttsStyle
    };
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
            event.loaded?.mcpToolSpecs?.length ? `mcp_tool_specs=${event.loaded.mcpToolSpecs.join(',')}` : '',
            event.content ? `content=${summarize(event.content, 1800)}` : ''
        ].filter(Boolean).join(' | ');
    }
    if (event.type === 'tool_result') {
        return [
            `${event.title || event.tool}: ${event.status}`,
            event.ok ? 'ok=true' : 'ok=false',
            event.evidenceRefs?.length ? `evidence_refs=${event.evidenceRefs.join(',')}` : '',
            event.preview ? `preview=${event.preview}` : ''
        ].filter(Boolean).join(' | ');
    }
    if (event.type === 'tool_call') {
        return `${event.title || event.tool}: ${summarize(event.args, 800)}`;
    }
    if (event.type === 'reasoning') {
        return `reasoning: ${summarize(event.text || event.summary || event, 800)}`;
    }
    if (event.type === 'evidence_recovery') {
        return [
            `evidence_recovery: ${event.status || 'missing_evidence'}`,
            event.reason ? `reason=${event.reason}` : '',
            event.nextAction ? `next_action=${event.nextAction}` : '',
            event.missingEvidence?.length
                ? `missing=${event.missingEvidence.map((entry) => entry.id || entry.description).filter(Boolean).join(', ')}`
                : '',
            event.toolHint?.tool ? `tool_hint=${event.toolHint.tool}.${event.toolHint.action || ''}` : '',
            event.content ? `content=${summarize(event.content, 1000)}` : ''
        ].filter(Boolean).join(' | ');
    }
    return summarize(event, 1000);
}

function buildAgentPromptProgressSnapshot({ events = [], stepResults = [], turnItems = null } = {}) {
    const items = turnItems?.items || buildTurnItemsPromptObject({
        events,
        stepResults,
        maxItems: 8
    }).items || [];
    const toolResultItems = items.filter((item) => item.type === 'tool_result');
    const latestToolResultItem = toolResultItems[toolResultItems.length - 1] || null;
    const fallbackLatestObservation = latestToolResultItem ? {
        type: latestToolResultItem.type || null,
        status: latestToolResultItem.status || null,
        tool: latestToolResultItem.tool || null,
        title: latestToolResultItem.title || null,
        ok: latestToolResultItem.ok,
        result_status: latestToolResultItem.result_status || null,
        error_type: latestToolResultItem.error_type || latestToolResultItem.errorType || null,
        evidence_gap: latestToolResultItem.evidence_gap || latestToolResultItem.evidenceGap || null,
        recovery_hint: latestToolResultItem.recovery_hint || latestToolResultItem.recoveryHint || null
    } : null;
    const latestObservation = turnItems?.latest_observation || fallbackLatestObservation;
    const latestFailedObservation = turnItems?.latest_failed_observation ||
        [...toolResultItems].reverse().find((item) => item.status === 'failed') || null;
    const toolStatusCounts = toolResultItems.reduce((acc, item) => {
        const status = item.status || 'unknown';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
    }, {});
    return {
        model: 'compact_progress_snapshot',
        status: 'compacted',
        event_count: Array.isArray(events) ? events.length : 0,
        step_result_count: Array.isArray(stepResults) ? stepResults.length : 0,
        retained_recent_items: items.length,
        omitted_turn_items: turnItems?.retention?.omitted_items || 0,
        tool_status_counts: toolStatusCounts,
        latest_observation: latestObservation,
        latest_failed_observation: latestFailedObservation ? {
            type: latestFailedObservation.type || null,
            status: latestFailedObservation.status || null,
            tool: latestFailedObservation.tool || null,
            title: latestFailedObservation.title || null,
            ok: latestFailedObservation.ok,
            result_status: latestFailedObservation.result_status || null,
            error_type: latestFailedObservation.error_type || latestFailedObservation.errorType || null,
            recovery_hint: latestFailedObservation.recovery_hint || null
        } : null,
        text: summarizeForModel(
            [
                latestObservation
                    ? `latest=${latestObservation.tool || latestObservation.title || latestObservation.type}:${latestObservation.status || 'unknown'}`
                    : '',
                latestFailedObservation
                    ? `latest_failed=${latestFailedObservation.tool || latestFailedObservation.title || latestFailedObservation.type}:${latestFailedObservation.error_type || latestFailedObservation.status || 'failed'}`
                    : '',
                `tool_status_counts=${JSON.stringify(toolStatusCounts)}`,
                `retained=${items.length}`,
                `omitted=${turnItems?.retention?.omitted_items || 0}`
            ].filter(Boolean).join('\n'),
            MAX_PROMPT_PROGRESS_CHARS
        )
    };
}

function buildPromptBudgetReport(messages = []) {
    const system = messages.find((message) => message.role === 'system')?.content || '';
    const user = messages.find((message) => message.role === 'user')?.content || '';
    const serialized = JSON.stringify(messages);
    return {
        model: 'aigl_prompt_budget',
        system_chars: normalizeText(system).length,
        user_chars: normalizeText(user).length,
        total_chars: serialized.length,
        approx_input_tokens: approxTokenCount(serialized)
    };
}

function buildToolResultEvent(stepResult) {
    const basePreview = summarize(
        extractToolResultText(stepResult.response?.result) ||
            stepResult.response?.error ||
            stepResult.response?.result ||
            stepResult.response,
        1600
    );
    const failure = stepResult.response?.ok === true
        ? null
        : classifyToolFailureObservation({
              tool: stepResult.tool,
              args: stepResult.args,
              response: stepResult.response,
              preview: basePreview
          });
    const evidenceGap = stepResult.response?.ok === true
        ? classifyEvidenceGapObservation({
              tool: stepResult.tool,
              args: stepResult.args,
              response: stepResult.response,
              preview: basePreview
          })
        : null;
    return {
        type: 'tool_result',
        id: stepResult.id,
        title: stepResult.title,
        tool: stepResult.tool,
        args: stepResult.args,
        status: stepResult.response?.status || 'unknown',
        ok: stepResult.response?.ok === true,
        preview: summarize([basePreview, formatFailureHint(failure), formatEvidenceGapHint(evidenceGap)].filter(Boolean).join('\n'), 1600),
        evidenceRefs: getStepEvidenceRefs(stepResult),
        evidenceArtifacts: getEvidenceArtifactsPromptObject(stepResult.evidenceArtifacts || []),
        errorType: failure?.error_type || '',
        evidenceGap,
        recoveryHint: failure?.recovery_hint || evidenceGap?.recovery_hint || '',
        alternatives: failure?.alternatives || evidenceGap?.alternatives || []
    };
}

function buildInvalidDecisionObservationEvent(decision = {}, iteration = 0, maxSteps = DEFAULT_AGENT_LOOP_STEPS) {
    const previousOutput = typeof decision.raw === 'string'
        ? decision.raw
        : JSON.stringify(decision.raw || {}, null, 2);
    const recoveryInstruction = [
        'Previous agent decision was not a valid executable action.',
        'In the next turn choose exactly one action: tool, load_context, final, or blocked.',
        'For missing capability or external/API/document/video needs, prefer action="tool" with tool_call.tool="tool_search".',
        'For executable tools, use direct ids such as mcp__server__tool or external__provider__tool when available.',
        'Do not output only a plan, checklist, explanation, or unsupported action.'
    ].join(' ');
    return {
        type: 'runtime_note',
        status: 'invalid_decision_observation',
        iteration,
        maxSteps,
        protocol_error: decision.status || 'invalid_agent_decision',
        error: decision.error || '',
        repairAttempted: decision.repairAttempted === true,
        repairStatus: decision.repairStatus || '',
        repairError: decision.repairError || '',
        previous_output: summarizeForModel(previousOutput, 1800),
        required_next_action: 'Choose exactly one of action="tool", action="load_context", action="final", or action="blocked".',
        recovery_hint: recoveryInstruction,
        suggested_tools: ['tool_search', 'mcp__server__tool', 'external__provider__tool', 'request_permissions']
    };
}

function isFailedToolStepResult(stepResult) {
    return Boolean(stepResult?.response && stepResult.response.ok !== true);
}

function getLatestFailedToolStepResult(stepResults = []) {
    if (!Array.isArray(stepResults) || !stepResults.length) {
        return null;
    }
    const latest = stepResults[stepResults.length - 1];
    return isFailedToolStepResult(latest) ? latest : null;
}

function renderLatestToolFailureSurface({ stepResults = [], message = '', intent = '', fallbackText = '' } = {}) {
    const latestFailedStep = getLatestFailedToolStepResult(stepResults);
    if (!latestFailedStep) {
        return null;
    }
    return renderToolFailureSurface({
        step: latestFailedStep,
        response: latestFailedStep.response,
        userMessage: message,
        intent,
        fallbackText
    });
}

function buildLlmAgentExecutorMessages({
    message,
    messageHistory = [],
    events = [],
    stepResults = [],
    toolSummary = '',
    maxSteps = DEFAULT_AGENT_LOOP_STEPS,
    emailProfiles = {},
    initialPlan = null,
    memoryContext = '',
    fileAttachments = [],
    externalToolExposure = null,
    exactAnswerMode = false
}) {
    const initialPlanHint = buildInitialPlanHint(initialPlan);
    const capabilityCatalog = buildAgentCapabilityCatalog();
    const recentConversation = normalizeConversationHistory(messageHistory);
    const evidenceArtifacts = buildAgentEvidenceArtifactsPromptObject(stepResults);
    const exactAnswerContract = buildExactAnswerContractPromptObject({
        exactAnswerMode,
        evidenceArtifacts
    });
    const system = [
        AIGL_SYSTEM_PROMPT,
        '',
        '【HumanClaw Codex-like 执行协议】',
        '在保持 AIGL 人设、语气、动作/表情指令规范的前提下，你同时运行 HumanClaw Agentic Executor，一个桌面任务执行智能体。',
        '你自己判断用户当前输入是普通情感/闲聊，还是需要执行任务；不要依赖外部分类结果。',
        'recent_turn_items 是 Codex-like 执行记录：tool_call 表示工具已开始，tool_result 表示工具成功或失败，context 表示能力说明已加载，runtime_note 是诊断信息。工具失败也是 observation，应进入下一轮决策；不要因为单个工具失败就僵死，可以换工具、换策略、请求上下文或诚实 final。',
        '证据缺口协议：如果 latest_observation 或 tool_result 中出现 evidence_gap/recovery_hint，说明上一个工具虽然可能成功，但证据不足；优先按 recovery_hint 调用 tool_search 寻找结构化 API、文档解析、视频帧采样或视觉工具，不要机械重复同一个 web_fetch/search。',
        '工具选择路由：如果任务提到附件、文件路径、DOCX/Word、PPT/PPTX、表格/CSV/XLSX、PDF/论文/报告、YouTube/视频、音频、图片、代码文件、GitHub 仓库或已知 URL，先用 tool_search 查对应 artifact/tool 类型并调用返回的专用 mcp__... 工具；web_search 只作为没有专用工具或专用工具失败后的兜底。',
        '遇到任务时按 Codex/OpenClaw 风格逐步执行：观察当前状态，决定下一步，调用一个工具，等待 observation，再决定下一步。不要一次性输出完整 steps 当作完成，也不要只说计划。',
        '权限协议：如果 observation 显示 permission_profile_read_only、network_access_disabled 或需要额外文件/网络权限，使用 request_permissions 精确请求 permissions，不要只在 final_answer 里口头请求授权。',
        '外部资料与产物规则：如果用户要求读取 URL/PDF/网页/技术文档/API/官方文档/版本化库行为/文件/邮箱/仓库/屏幕，或要求生成、修改、提交某个文件，不能只凭模型记忆 final。你必须先调用最小必要工具拿到 observation；如果用户要求输出文件，写入后还要用 read/stat/artifact_verifier 复核，再 final。',
        '文件写入边界：新建文件或整文件输出优先使用本地 write 工具，参数为 {path, content}。edit_file 只用于已有文件的局部精确替换，参数必须是 edits:[{oldText,newText}]，不要用 edit_file 创建文件或覆盖全文。',
        '情感/普通对话：返回 action="final" 和 final_answer，不调用工具。不要在 final_answer 中手写动作/表情标签；如需表现人物状态，写 persona_output 的语义字段。',
        '隐私/密钥：可以说明本地保存设计、是否需要重新填写、以及如何检查；不要主动读取或复述完整密钥。没有实际 observation 时不能说“我已经确认文件存在”，只能说“按设计应当/需要的话我可以检查”。',
        '任务执行：每轮最多输出一个动作。动作只能是 load_context、tool、final、blocked。不要一次性输出完整 steps 当作完成，也不要只说计划。',
        '上下文装载协议：首轮 capability_catalog 只是一张能力索引，不包含详细 tool contract、input_schema、return_schema 或复杂使用限制。需要某个领域的 SKILL、工具 schema 或 MCP 说明时，优先输出 action="load_context" 和 capability_request。本地 runtime 会加载对应内容作为 observation，再进入下一轮；如果你直接调用高层工具，Runtime 也会把缺失 contract 注入后续 capability_context。',
        'load_context 示例：{"mode":"task","intent":"email_management","summary":"需要邮箱能力","action":"load_context","capability_request":{"skills":["email"],"tools":["email"],"mcp":[],"reason":"需要检查未读邮件"}}',
        '如果下一步需要工具，就输出 action="tool"。如果任务完成或需要诚实告知当前可确认结果，就输出 action="final"。只有权限缺失、用户缺少必要信息、或合理替代路径都失败时，才输出 action="blocked"。',
        '优先先读取/检查，再修改；修改后主动复核。危险动作由 Gateway 审批，你不要在 args 或 context 里写 approved=true。',
        '视觉感知能力声明：vision.capture_context 是只读截图理解工具。是否调用由你根据“当前目标 + 已有 observation + 证据缺口”自行决定，不做关键词硬触发。Runtime 负责审批与边界仲裁；没有截图 observation 时不得声称“已经看到了屏幕内容”。',
        '长期记忆：user payload 中的 memory_context 是 AIGL 的本地长期记忆和关系记忆。它只作为辅助上下文；若与用户当前明确指令冲突，以当前指令为准；不要主动向用户暴露内部好感度数值。',
        '文件附件：user payload 中的 attached_files 是用户本轮从聊天窗选择或拖入的本地文件/文件夹元数据，不包含文件内容。用户问“这个文件/附件/刚拖进来的内容”时优先引用 attached_files.path；需要读取内容时调用 computer 工具的 stat/read/read_binary/tree 等只读动作。不要凭文件名臆造内容；修改、移动、删除附件仍按正常审批和安全策略执行。',
        '公开思考流：如果这一轮在执行任务，可以给 public_reasoning 写一句给用户看的短进度摘要，说明你基于 observation 准备做什么或已经确认了什么。不要泄露隐藏推理链，不要写工具日志，不要写“第 N 步/我在看本机状态”这类低信息量模板；没有实质信息时可以留空。',
        '人物表现：使用 persona_output 给出自然可见文本、气泡文本、语音风格，以及 emotion/intensity/socialTone/gestureIntent/taskState/speechEnergy/gazeTarget/durationHint。不要直接选择 VRM 动作名；工具执行语义仍由 action/tool_call 决定。',
        '工具 experience：工具 contract 里的 experience 字段说明这个工具在人物体验里代表什么，审批、等待、失败和成功要按 AIGL 的自然表达呈现，不要把 tool_call、approvalId、raw observation 当用户回复。',
        'Self Debug Loop：当用户反馈 AIGL 自身 bug、工具链异常、Agent Loop 不稳定或要求 AIGL 自己修复时，优先把它当作高风险自修复任务。先加载 self_debugger 能力，按建案、收证据、诊断、提补丁、验证、确认后应用的协议推进；不要直接裸改自己的代码。',
        '工具能力索引：首轮只给 capability_catalog。详细 schema 通过 load_context、tool_search 或工具 observation 按需出现。MCP 工具优先使用 tool_search/capability_context 中的 mcp__server__tool direct spec；外部 API/Composio/OpenAPI 工具优先使用 tool_search 返回的 external__provider__tool direct spec。没有 direct spec 时，先 load/search specs，mcp_bridge/capability_manager 只作为管理、安装、修复入口。请按任务目标和证据缺口选择最小必要工具，避免关键词驱动的机械路由。',
        exactAnswerMode
            ? `Exact-answer 模式：不要把可见 Markdown 当提交答案。必须先用工具形成 evidence_artifacts，再用 action="final" 填短 final_answer，并在 exact_answer_submission 中提供 answer、confidence、evidence_refs；artifact id 只用于 evidence_refs，不是文件路径，不要调用 read/open 读取它们；缺证据时继续 tool 或 blocked。`
            : '',
        '可见回复格式：final_answer 字段是给用户看的 Markdown 字符串，可以使用自然段、短列表、代码块和加粗；blocked_reason 也按 Markdown 组织。不要输出 HTML。',
        '只输出 JSON，JSON 外不要输出 Markdown。',
        'persona_output 字段示例：{"text":"自然可见回复","bubble_text":"可选气泡短句","speech_text":"可选语音文本","emotion":"happy|relaxed|shy|sad|angry|surprised|anxious|tired|thinking|focused|comforting","intensity":0.55,"socialTone":"soft|bright|calm|serious|playful|quiet","gestureIntent":"none|greeting|farewell|thinking|working|approval|success|celebrate|shy|comfort|apologize|surprised|angry|dance","taskState":"idle|listening|thinking|speaking|working|waiting_approval|happy_success|apologizing|comforting|blocked|failed","speechEnergy":0.45,"gazeTarget":"user|side|down|screen|away|none","durationHint":"short|medium|long|hold","tts_style":"..."}',
        'JSON 格式：{"mode":"conversation|task","intent":"...","summary":"...","public_reasoning":"给用户看的短进度摘要，可空","action":"load_context|tool|final|blocked","capability_request":{"skills":[],"tools":[],"mcp":[],"reason":"..."},"plan_update":["..."],"tool_call":{"tool":"vision.capture_context|computer|email|code|file_manager|artifact_verifier|tool_search|request_permissions|mcp_bridge|capability_manager|self_debugger|subagents|update_plan|read|write|exec|apply_patch|mcp__server__tool|external__provider__tool","title":"...","args":{"action":"...","target":"screen|chat-window|active-window|region","reason":"...","question":"..."}},"persona_output":{},"final_answer":"Markdown...","exact_answer_submission":{"answer":"短答案","confidence":"high|medium|low","evidence_refs":["artifact-..."],"format_type":"plain|number|date|list|name|url|json","reason":"brief evidence note"},"blocked_reason":"Markdown..."}',
        '当 tool_call.tool 是 mcp_bridge 时，只能用于 MCP 管理/发现/修复动作，不要用它包装 call_tool。执行具体 MCP 工具必须使用 mcp__server__tool direct id。',
        `最多工具轮数：${maxSteps}`,
        `工具摘要：${toolSummary || 'Core tools are indexed in capability_catalog; detailed contracts and MCP tool specs are deferred.'}`
    ].filter(Boolean).join('\n');
    const recentTurnItems = buildTurnItemsPromptObject({
        events,
        stepResults,
        maxItems: 12
    });
    const progressSnapshot = buildAgentPromptProgressSnapshot({
        events,
        stepResults,
        turnItems: recentTurnItems
    });
    const compactMemoryContext = memoryContext
        ? summarizeForModel(memoryContext, MAX_PROMPT_MEMORY_CHARS)
        : null;
    return [
        { role: 'system', content: system },
        {
            role: 'user',
            content: JSON.stringify(
                {
                    user_goal: message,
                    recent_conversation: recentConversation,
                    memory_context: compactMemoryContext,
                    attached_files: getAttachedFilesPromptObject(fileAttachments),
                    recent_turn_items: recentTurnItems,
                    initial_plan_hint: initialPlanHint,
                    evidence_artifacts: evidenceArtifacts,
                    exact_answer_contract: exactAnswerContract,
                    capability_catalog: capabilityCatalog,
                    external_tool_exposure: externalToolExposure,
                    current_progress: progressSnapshot,
                    prompt_compaction: {
                        status: 'active',
                        removed_duplicate_observations_field: true,
                        original_event_count: Array.isArray(events) ? events.length : 0,
                        retained_turn_items: recentTurnItems.items.length,
                        omitted_turn_items: recentTurnItems.retention?.omitted_items || 0,
                        turn_items_retention: recentTurnItems.retention,
                        memory_context_chars: memoryContext ? memoryContext.length : 0,
                        memory_context_compacted_chars: compactMemoryContext ? compactMemoryContext.length : 0
                    }
                },
                null,
                2
            )
        }
    ];
}

const NATIVE_TOOL_NAME_PATTERN = /^[A-Za-z0-9_-]{1,64}$/;
const DIRECT_TOOL_EXECUTOR_FALLBACK_STATUSES = new Set([
    'direct_tool_executor_unavailable',
    'direct_tool_executor_no_tools',
    'direct_tool_executor_json_meta_decision',
    'provider_error',
    'empty_response',
    'invalid_agent_decision'
]);

function isTerminalProviderErrorMessage(error = '') {
    const text = normalizeText(error).toLowerCase();
    if (!text) {
        return false;
    }
    return /insufficient\s+balance|insufficient\s+credit|billing|payment|required\s+balance|quota\s+exceeded|out\s+of\s+quota|invalid\s+(api\s*)?key|api\s*key\s*(invalid|missing|required)|authentication|unauthorized|forbidden/.test(text);
}

function isTerminalProviderDecisionError(decision = {}) {
    return decision?.status === 'provider_error' && isTerminalProviderErrorMessage(decision.error);
}

function isValidNativeToolName(name = '') {
    return NATIVE_TOOL_NAME_PATTERN.test(normalizeText(name));
}

function parseJsonSchemaFragment(value) {
    if (typeof value !== 'string') {
        return value;
    }
    const trimmed = value.trim();
    if (!trimmed || !/^[\[{]/.test(trimmed)) {
        return value;
    }
    try {
        return JSON.parse(trimmed);
    } catch {
        return value;
    }
}

function repairNativeToolJsonSchema(schema = {}) {
    const input = parseJsonSchemaFragment(schema);
    if (!input || typeof input !== 'object' || Array.isArray(input)) {
        return {
            type: 'object',
            additionalProperties: true,
            properties: {}
        };
    }
    const out = { ...input };
    out.type = normalizeText(out.type, 'object');
    out.required = Array.isArray(parseJsonSchemaFragment(out.required))
        ? parseJsonSchemaFragment(out.required).filter((entry) => typeof entry === 'string')
        : [];
    const properties = parseJsonSchemaFragment(out.properties);
    out.properties = properties && typeof properties === 'object' && !Array.isArray(properties)
        ? Object.fromEntries(
              Object.entries(properties).map(([key, value]) => [key, repairNativeToolJsonSchema(value)])
          )
        : {};
    if (out.items) {
        out.items = repairNativeToolJsonSchema(out.items);
    }
    if (out.additionalProperties && typeof out.additionalProperties === 'object') {
        out.additionalProperties = repairNativeToolJsonSchema(out.additionalProperties);
    } else if (typeof out.additionalProperties !== 'boolean') {
        out.additionalProperties = true;
    }
    return out;
}

function normalizeNativeToolSpec(spec = {}) {
    if (!spec || typeof spec !== 'object') {
        return null;
    }
    const source = spec.type === 'function' && spec.function ? spec.function : spec;
    const name = normalizeText(source.name || spec.name);
    if (!isValidNativeToolName(name)) {
        return null;
    }
    const parameters = source.parameters || source.input_schema || source.inputSchema || {
        type: 'object',
        additionalProperties: true,
        properties: {}
    };
    return {
        type: 'function',
        name,
        description: truncateMiddleText(
            normalizeText(source.description || spec.description || name),
            900
        ),
        parameters: repairNativeToolJsonSchema(compactToolSchema(parameters, {
            maxBytes: 6000,
            maxDepth: 4
        })),
        ...(source.strict === true || spec.strict === true ? { strict: true } : {})
    };
}

function pushUniqueNativeToolSpec(specs, seen, spec) {
    if (!spec) {
        return;
    }
    const normalized = normalizeNativeToolSpec(spec);
    if (!normalized || seen.has(normalized.name)) {
        return;
    }
    seen.add(normalized.name);
    specs.push(normalized);
}

function extractJsonFromToolResultText(text = '') {
    const trimmed = normalizeText(text);
    if (!trimmed) {
        return null;
    }
    try {
        return JSON.parse(trimmed);
    } catch {
        return extractJsonObject(trimmed);
    }
}

function extractSearchToolsFromStepResult(stepResult = {}) {
    if (stepResult.tool !== 'tool_search') {
        return [];
    }
    const result = stepResult.response?.result || {};
    const directTools =
        result.structuredContent?.tools ||
        result.details?.tools ||
        extractJsonFromToolResultText(extractToolResultText(result))?.tools ||
        [];
    return Array.isArray(directTools) ? directTools : [];
}

function buildNativeSpecFromSearchToolEntry(entry = {}) {
    if (entry.exposure === 'deferred' || entry.spec?.defer_loading === true) {
        return null;
    }
    if (entry.spec) {
        return normalizeNativeToolSpec(entry.spec);
    }
    const toolName = normalizeText(
        entry.call_pattern?.tool ||
            entry.callPattern?.tool ||
            entry.id ||
            entry.name
    );
    if (!isValidNativeToolName(toolName)) {
        return null;
    }
    const parameters =
        entry.input_schema ||
        entry.inputSchema ||
        entry.parameters ||
        entry.schema ||
        entry.args_schema ||
        {
            type: 'object',
            additionalProperties: true,
            properties: {}
        };
    return normalizeNativeToolSpec({
        name: toolName,
        description: [
            entry.description,
            entry.summary,
            entry.note,
            entry.type ? `source_type=${entry.type}` : ''
        ].filter(Boolean).join(' '),
        parameters
    });
}

function buildDynamicDirectToolSpecsFromObservations(stepResults = []) {
    const specs = [];
    const seen = new Set();
    for (const stepResult of stepResults.slice(-8)) {
        for (const entry of extractSearchToolsFromStepResult(stepResult)) {
            pushUniqueNativeToolSpec(specs, seen, buildNativeSpecFromSearchToolEntry(entry));
        }
    }
    return specs;
}

function buildFinalAnswerNativeToolSpec() {
    return normalizeNativeToolSpec({
        name: FINAL_ANSWER_TOOL_NAME,
        description: [
            'Submit the exact benchmark/task answer separately from user-visible persona text.',
            'Use only after evidence_artifacts contain the evidence_refs supporting the answer.',
            'If evidence is missing, do not call this tool; continue retrieving or report blocked.'
        ].join(' '),
        parameters: {
            type: 'object',
            additionalProperties: false,
            required: ['answer', 'confidence', 'evidence_refs'],
            properties: {
                answer: {
                    type: 'string',
                    description: 'Short exact answer only. No Markdown, no explanation, no units if the question already specifies the unit.'
                },
                confidence: {
                    type: 'string',
                    enum: ['high', 'medium', 'low'],
                    description: 'Use high or medium only when the answer is directly supported by evidence_refs.'
                },
                evidence_refs: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Artifact ids from evidence_artifacts that directly support the answer.'
                },
                format_type: {
                    type: 'string',
                    enum: ['plain', 'number', 'date', 'list', 'name', 'url', 'json'],
                    description: 'Expected exact-answer shape.'
                },
                reason: {
                    type: 'string',
                    description: 'Brief private evidence note for audit. Do not put this in answer.'
                },
                persona_text: {
                    type: 'string',
                    description: 'Optional user-visible natural text. The benchmark answer remains answer.'
                },
                repair_instruction: {
                    type: 'string',
                    description: 'If not enough evidence, explain what evidence/tool is still needed instead of submitting.'
                }
            }
        },
        strict: true
    });
}

function buildAgentDirectToolSpecs(gateway, { stepResults = [], requestContext = {}, exactAnswerMode = false } = {}) {
    if (requestContext.directToolExecutor === false || requestContext.nativeDirectTools === false) {
        return [];
    }
    const specs = [];
    const seen = new Set();
    if (exactAnswerMode) {
        pushUniqueNativeToolSpec(specs, seen, buildFinalAnswerNativeToolSpec());
    }
    for (const spec of gateway?.gatewayToolRuntimeRegistry?.modelVisibleSpecs?.() || []) {
        pushUniqueNativeToolSpec(specs, seen, spec);
    }
    for (const spec of buildDynamicDirectToolSpecsFromObservations(stepResults)) {
        pushUniqueNativeToolSpec(specs, seen, spec);
    }
    const limit = Math.max(4, Math.min(Number(requestContext.directToolLimit || 40), 80));
    return specs.slice(0, limit);
}

function normalizeExactAnswerSubmission(value = {}) {
    const parsed = typeof value === 'string' ? extractJsonObject(value) : value;
    const candidate = parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
    const evidenceRefs = normalizeArrayValue(
        candidate.evidence_refs ||
            candidate.evidenceRefs ||
            candidate.evidence ||
            candidate.refs
    ).map((entry) => normalizeText(entry)).filter(Boolean);
    return {
        answer: normalizeText(candidate.answer || candidate.final_answer || candidate.finalAnswer || candidate.value),
        confidence: normalizeFinalAnswerConfidence(candidate.confidence),
        evidenceRefs,
        formatType: normalizeText(candidate.format_type || candidate.formatType || candidate.type, 'plain'),
        reason: normalizeText(candidate.reason || candidate.evidence_note || candidate.evidenceNote),
        personaText: normalizeText(candidate.persona_text || candidate.personaText || candidate.visible_text || candidate.visibleText),
        repairInstruction: normalizeText(candidate.repair_instruction || candidate.repairInstruction)
    };
}

function looksLikeExplanatoryFinalAnswer(text = '') {
    const stripped = stripControlTags(text);
    if (!stripped) {
        return false;
    }
    if (/```|^\s*(?:[-*+]|\d+\.)\s+/m.test(stripped)) {
        return true;
    }
    if (/\b(?:according to|based on|therefore|because|the\s+answer\s+(?:is|would\s+be)|final\s+answer\s+(?:is|:)|I\s+(?:found|checked|calculated|think|believe)|we\s+(?:found|checked|calculated|think|believe))\b/i.test(stripped)) {
        return true;
    }
    if (/(?:已完成|完成分析|我(?:已经|已|会|可以|来|帮)|我们|根据|依据|因此|所以|综上|最终(?:结果|答案)|答案(?:是|为)|证据|步骤|过程|计算|脚本|查到|确认|需要更多)/i.test(stripped)) {
        return true;
    }
    return stripped.length > 240 || stripped.split(/\r?\n/).length > 3;
}

function validateExactAnswerSubmission({ decision = {}, stepResults = [] } = {}) {
    const submission = normalizeExactAnswerSubmission(decision.exactAnswerSubmission || {});
    const availableRefs = getAvailableEvidenceRefSet(stepResults);
    const errors = [];
    if (!submission.answer) {
        errors.push('answer_missing');
    }
    if (looksLikeExplanatoryFinalAnswer(submission.answer)) {
        errors.push('answer_not_exact_shape');
    }
    if (!['high', 'medium'].includes(submission.confidence)) {
        errors.push('confidence_below_gate');
    }
    if (!submission.evidenceRefs.length) {
        errors.push('evidence_refs_missing');
    }
    const unknownRefs = submission.evidenceRefs.filter((ref) => !availableRefs.has(ref));
    if (unknownRefs.length) {
        errors.push('evidence_refs_unknown');
    }
    return {
        ok: errors.length === 0,
        submission,
        errors,
        unknownRefs,
        availableEvidenceRefs: [...availableRefs]
    };
}

function buildExactAnswerRepairObservation(validation = {}, { iteration = 0 } = {}) {
    const missing = validation.errors || [];
    const nextAction = missing.includes('evidence_refs_missing') || missing.includes('evidence_refs_unknown')
        ? 'Use the available evidence_artifacts ids, or call another retrieval/read/compute tool to create the missing evidence before final_answer.'
        : 'Return a short exact answer with high/medium confidence and no explanatory prose.';
    return {
        type: 'evidence_recovery',
        status: 'exact_answer_gate_rejected',
        iteration,
        reason: missing.join(', ') || 'exact answer gate rejected the final answer',
        nextAction,
        missingEvidence: missing.map((entry) => ({
            id: entry,
            description: entry
        })),
        availableEvidenceRefs: validation.availableEvidenceRefs || [],
        unknownEvidenceRefs: validation.unknownRefs || [],
        content: JSON.stringify({
            exact_answer_gate: 'rejected',
            errors: missing,
            available_evidence_refs: validation.availableEvidenceRefs || [],
            instruction: nextAction
        })
    };
}

function buildLosslessToolObservationDigest(stepResults = []) {
    return stepResults.slice(-4).map((stepResult) => {
        const response = stepResult.response || {};
        const result = response.result || {};
        const evidenceRefs = getStepEvidenceRefs(stepResult);
        return {
            id: stepResult.id || null,
            tool: stepResult.tool || null,
            title: stepResult.title || null,
            args: stepResult.args || null,
            ok: response.ok === true,
            status: response.status || 'unknown',
            text: summarizeForModel(extractToolResultText(result) || response.error || response, 1200),
            evidenceRefs,
            note: evidenceRefs.length
                ? 'Full observation is retained in transcript/evidence artifact; use evidenceRefs for final_answer.'
                : '',
            details: result.details
                ? summarizeForModel(JSON.stringify(result.details), 500)
                : null,
            structuredContent: result.structuredContent
                ? summarizeForModel(JSON.stringify(result.structuredContent), 500)
                : null
        };
    });
}

function buildExactAnswerContractPromptObject({ exactAnswerMode = false, evidenceArtifacts = [] } = {}) {
    if (!exactAnswerMode) {
        return null;
    }
    return {
        mode: 'exact_answer_eval',
        final_answer_tool: FINAL_ANSWER_TOOL_NAME,
        required_fields: ['answer', 'confidence', 'evidence_refs'],
        accept_confidence: ['high', 'medium'],
        reject_if: [
            'answer is empty',
            'answer contains Markdown or explanatory prose',
            'confidence is low',
            'evidence_refs is empty',
            'evidence_refs contains ids not present in evidence_artifacts'
        ],
        available_evidence_refs: evidenceArtifacts.map((artifact) => artifact.id).filter(Boolean),
        instruction: `When solved, call ${FINAL_ANSWER_TOOL_NAME} instead of writing a visible prose final. Use artifact ids only as evidence_refs; do not read/open artifact ids as filesystem paths. If evidence is missing, keep using tools or return blocked with a repair instruction.`
    };
}

function buildLlmAgentDirectToolMessages({
    message,
    messageHistory = [],
    events = [],
    stepResults = [],
    toolSummary = '',
    maxSteps = DEFAULT_AGENT_LOOP_STEPS,
    memoryContext = '',
    fileAttachments = [],
    externalToolExposure = null,
    exactAnswerMode = false
}) {
    const capabilityCatalog = buildAgentCapabilityCatalog();
    const recentConversation = normalizeConversationHistory(messageHistory);
    const recentTurnItems = buildTurnItemsPromptObject({
        events,
        stepResults,
        maxItems: 12
    });
    const progressSnapshot = buildAgentPromptProgressSnapshot({
        events,
        stepResults,
        turnItems: recentTurnItems
    });
    const compactMemoryContext = memoryContext
        ? summarizeForModel(memoryContext, MAX_PROMPT_MEMORY_CHARS)
        : null;
    const evidenceArtifacts = buildAgentEvidenceArtifactsPromptObject(stepResults);
    const exactAnswerContract = buildExactAnswerContractPromptObject({
        exactAnswerMode,
        evidenceArtifacts
    });
    const system = [
        AIGL_SYSTEM_PROMPT,
        '',
        '【HumanClaw Direct Tool Executor】',
        '你正在运行 AIGL 的任务执行层。普通情感/闲聊可以直接自然回复；需要读取、检索、操作电脑、解析文件、调用 API、写代码或复核证据时，必须调用一个可用工具，而不是用自然语言假装完成。',
        '本模式已经把可执行工具作为原生 function tools 暴露给你。需要工具时直接调用对应 tool name，例如 tool_search、read、write、exec、apply_patch、request_permissions、mcp__server__tool、external__provider__tool。',
        '不要输出 JSON 决策协议，不要手写 tool_call/tool/args 包装对象；如果要执行工具，使用原生工具调用。每轮最多调用一个工具。',
        '如果缺工具、缺 API、缺文档解析、缺视频/视觉能力，先调用 tool_search；tool_search 返回的 mcp__... 或 external__... 在下一轮会变成可直接调用的原生工具。',
        '工具失败、证据不足、字段没找到时，要根据 latest_failed_observation、recovery_hint 和 lossless_tool_observations 改换策略，不要机械重复同一个 web_search。',
        '工具选择路由：如果任务提到附件、文件路径、DOCX/Word、PPT/PPTX、表格/CSV/XLSX、PDF/论文/报告、YouTube/视频、音频、图片、代码文件、GitHub 仓库或已知 URL，先用 tool_search 查对应 artifact/tool 类型并调用返回的专用 mcp__... 工具；web_search 只作为没有专用工具或专用工具失败后的兜底。',
        '需要用户授权时调用 request_permissions。危险写入、shell、patch、邮件发送等会由本地 Gateway 审批，不要在参数中伪造 approved=true。',
        '最终答复必须是给用户看的 Markdown。没有足够证据时不要提交猜测答案，要继续调用工具或明确 blocked。',
        exactAnswerMode
            ? `Exact-answer 模式：普通可见话术不能作为提交答案。任务完成时必须调用 ${FINAL_ANSWER_TOOL_NAME}，answer 只填短精确答案，confidence 必须 high/medium，evidence_refs 必须引用 evidence_artifacts 中的 id；这些 artifact id 不是文件路径，不要用 read/open 读取它们。`
            : '',
        `最多工具轮数：${maxSteps}`,
        `工具摘要：${toolSummary || 'Direct tools are exposed as native function tools. Search more tools with tool_search.'}`
    ].filter(Boolean).join('\n');
    return [
        { role: 'system', content: system },
        {
            role: 'user',
            content: JSON.stringify(
                {
                    user_goal: message,
                    recent_conversation: recentConversation,
                    memory_context: compactMemoryContext,
                    attached_files: getAttachedFilesPromptObject(fileAttachments),
                    recent_turn_items: recentTurnItems,
                    lossless_tool_observations: buildLosslessToolObservationDigest(stepResults),
                    evidence_artifacts: evidenceArtifacts,
                    exact_answer_contract: exactAnswerContract,
                    capability_catalog: capabilityCatalog,
                    external_tool_exposure: externalToolExposure,
                    current_progress: progressSnapshot
                },
                null,
                2
            )
        }
    ];
}

function shouldUseDirectToolExecutor(settings = {}, requestContext = {}) {
    if (
        requestContext.directToolExecutor === false ||
        requestContext.nativeDirectTools === false ||
        requestContext.disableDirectToolExecutor === true
    ) {
        return false;
    }
    const capabilities = getProviderCapabilities(settings);
    if (!capabilities.nativeToolCalling) {
        return false;
    }
    return Boolean(
        requestContext.directToolExecutor === true ||
            requestContext.nativeDirectTools === true ||
            settings.directToolExecutor === true ||
            settings.nativeDirectTools === true ||
            capabilities.nativeToolCallingDefault
    );
}

function looksLikeMetaDecisionJson(json = {}) {
    if (!json || typeof json !== 'object' || Array.isArray(json)) {
        return false;
    }
    return Boolean(
        json.action ||
            json.tool_call ||
            json.toolCall ||
            json.next_step ||
            json.nextStep ||
            json.capability_request ||
            json.capabilityRequest ||
            json.final_answer ||
            json.blocked_reason ||
            json.mode
    );
}

async function callLlmAgentDirectToolDecision(settings, payload, { hasToolHistory = false } = {}) {
    const capabilities = getProviderCapabilities(settings);
    if (!capabilities.nativeToolCalling) {
        return {
            ok: false,
            status: 'direct_tool_executor_unavailable',
            error: 'Current provider does not advertise native tool calling.',
            directToolFallback: true
        };
    }
    if (!Array.isArray(payload.tools) || payload.tools.length === 0) {
        return {
            ok: false,
            status: 'direct_tool_executor_no_tools',
            error: 'No direct native tools are available for this Agent turn.',
            directToolFallback: true
        };
    }
    const response = await callDesktopLlmProvider(settings, {
        ...payload,
        jsonMode: false,
        expectJson: false,
        responseFormat: null,
        toolChoice: 'auto',
        parallel_tool_calls: false
    });
    if (!response.ok) {
        return {
            ok: false,
            status: response.code || 'provider_error',
            error: response.error || 'Direct tool executor LLM call failed.',
            directToolFallback:
                response.code !== 'timeout' &&
                response.code !== 'aborted' &&
                !(response.code === 'provider_error' && isTerminalProviderErrorMessage(response.error))
        };
    }
    const directToolCall = (response.toolCalls || []).find((call) => call?.name && call.name !== 'aigl_agent_decision');
    if (directToolCall) {
        if (directToolCall.name === FINAL_ANSWER_TOOL_NAME) {
            const exactAnswerSubmission = normalizeExactAnswerSubmission(directToolCall.arguments || {});
            const visibleText = exactAnswerSubmission.personaText || exactAnswerSubmission.answer;
            return {
                ok: true,
                mode: 'task',
                intent: 'exact_answer_final',
                summary: 'Exact answer submitted through native final_answer tool.',
                publicReasoning: normalizePublicReasoningText(response.content),
                riskLevel: 'low',
                action: 'final',
                finalAnswer: exactAnswerSubmission.answer,
                blockedReason: '',
                toolCall: null,
                capabilityRequest: sanitizeCapabilityRequest({}),
                planUpdates: [],
                personaOutput: sanitizePersonaOutput({
                    text: visibleText,
                    emotion: 'focused',
                    socialTone: 'calm',
                    taskState: 'happy_success'
                }),
                exactAnswerSubmission,
                legacyPlan: false,
                raw: {
                    toolCall: directToolCall,
                    content: response.content || ''
                },
                decisionSource: 'native_final_answer_tool',
                nativeToolCall: directToolCall,
                transportFallback: false,
                model: response.model,
                usage: response.usage
            };
        }
        const toolCall = sanitizeAgentToolCall({
            id: directToolCall.id,
            title: directToolCall.name,
            tool: directToolCall.name,
            args: directToolCall.arguments || {}
        }, 0, 'execute');
        if (!toolCall) {
            return {
                ok: false,
                status: 'invalid_agent_tool_call',
                error: 'Provider returned a native tool call that could not be sanitized.',
                raw: directToolCall,
                usage: response.usage,
                directToolFallback: true
            };
        }
        return {
            ok: true,
            mode: 'task',
            intent: `direct_tool:${directToolCall.name}`,
            summary: `Direct native tool call: ${directToolCall.name}`,
            publicReasoning: normalizePublicReasoningText(response.content),
            riskLevel: normalizeText('', agentStepNeedsConfirmation(toolCall) ? 'medium' : 'low'),
            action: 'tool',
            finalAnswer: '',
            blockedReason: '',
            toolCall,
            capabilityRequest: sanitizeCapabilityRequest({}),
            planUpdates: [],
            personaOutput: null,
            legacyPlan: false,
            raw: {
                toolCall: directToolCall,
                content: response.content || ''
            },
            decisionSource: 'native_direct_tool_call',
            nativeToolCall: directToolCall,
            transportFallback: false,
            model: response.model,
            usage: response.usage
        };
    }
    const metaJson = extractJsonObject(response.content);
    if (looksLikeMetaDecisionJson(metaJson)) {
        return {
            ok: false,
            status: 'direct_tool_executor_json_meta_decision',
            error: 'Provider returned the old JSON meta-decision shape while direct tools were exposed.',
            raw: metaJson,
            usage: response.usage,
            directToolFallback: true
        };
    }
    const finalAnswer = normalizeText(response.content);
    if (!finalAnswer) {
        return {
            ok: false,
            status: 'empty_response',
            error: 'Direct tool executor returned no tool call and no final content.',
            usage: response.usage,
            directToolFallback: true
        };
    }
    return {
        ok: true,
        mode: hasToolHistory ? 'task' : 'conversation',
        intent: hasToolHistory ? 'direct_tool_final' : 'direct_conversation_final',
        summary: hasToolHistory ? 'Direct tool executor final answer.' : 'Direct conversation answer.',
        publicReasoning: '',
        riskLevel: 'low',
        action: 'final',
        finalAnswer,
        blockedReason: '',
        toolCall: null,
        capabilityRequest: sanitizeCapabilityRequest({}),
        planUpdates: [],
        personaOutput: sanitizePersonaOutput({
            text: finalAnswer,
            emotion: hasToolHistory ? 'focused' : 'happy',
            socialTone: hasToolHistory ? 'calm' : 'soft',
            taskState: hasToolHistory ? 'happy_success' : 'speaking'
        }),
        legacyPlan: false,
        raw: {
            content: response.content || ''
        },
        decisionSource: 'native_direct_final',
        nativeToolCall: null,
        transportFallback: false,
        model: response.model,
        usage: response.usage
    };
}

function buildAgentDecisionNativeTool() {
    return {
        name: 'aigl_agent_decision',
        description: 'Return exactly one next HumanClaw Agent Loop decision for this turn. The runtime executes real tools after validating this decision.',
        parameters: {
            type: 'object',
            additionalProperties: false,
            properties: {
                mode: {
                    type: 'string',
                    enum: ['conversation', 'task']
                },
                intent: {
                    type: 'string'
                },
                summary: {
                    type: 'string'
                },
                public_reasoning: {
                    type: 'string',
                    description: 'Short user-visible progress summary. Do not include hidden reasoning or raw tool logs.'
                },
                action: {
                    type: 'string',
                    enum: ['load_context', 'tool', 'final', 'blocked']
                },
                capability_request: {
                    type: 'object',
                    additionalProperties: false,
                    properties: {
                        skills: {
                            type: 'array',
                            items: { type: 'string' }
                        },
                        tools: {
                            type: 'array',
                            items: { type: 'string' }
                        },
                        mcp: {
                            type: 'array',
                            items: { type: 'string' }
                        },
                        reason: {
                            type: 'string'
                        }
                    }
                },
                plan_update: {
                    type: 'array',
                    items: { type: 'string' }
                },
                tool_call: {
                    type: 'object',
                    additionalProperties: true,
                    properties: {
                        tool: {
                            type: 'string'
                        },
                        title: {
                            type: 'string'
                        },
                        args: {
                            type: 'object',
                            additionalProperties: true
                        }
                    }
                },
                persona_output: {
                    type: 'object',
                    additionalProperties: true,
                    properties: {
                        text: { type: 'string' },
                        bubble_text: { type: 'string' },
                        speech_text: { type: 'string' },
                        emotion: { type: 'string' },
                        intensity: { type: 'number' },
                        socialTone: { type: 'string' },
                        gestureIntent: { type: 'string' },
                        taskState: { type: 'string' },
                        speechEnergy: { type: 'number' },
                        gazeTarget: { type: 'string' },
                        durationHint: { type: 'string' },
                        tts_style: { type: 'string' }
                    }
                },
                final_answer: {
                    type: 'string'
                },
                exact_answer_submission: {
                    type: 'object',
                    additionalProperties: false,
                    properties: {
                        answer: { type: 'string' },
                        confidence: {
                            type: 'string',
                            enum: ['high', 'medium', 'low']
                        },
                        evidence_refs: {
                            type: 'array',
                            items: { type: 'string' }
                        },
                        format_type: {
                            type: 'string',
                            enum: ['plain', 'number', 'date', 'list', 'name', 'url', 'json']
                        },
                        reason: { type: 'string' },
                        persona_text: { type: 'string' },
                        repair_instruction: { type: 'string' }
                    }
                },
                blocked_reason: {
                    type: 'string'
                }
            },
            required: ['mode', 'intent', 'action']
        },
        strict: false
    };
}

function shouldUseNativeAgentDecision(settings = {}, payload = {}) {
    if (payload.disableNativeToolCalls === true || payload.nativeToolCalls === false) {
        return false;
    }
    const capabilities = getProviderCapabilities(settings);
    if (!capabilities.nativeToolCalling) {
        return false;
    }
    if (payload.nativeToolCalls === true || payload.preferNativeToolCalls === true) {
        return true;
    }
    return Boolean(capabilities.nativeToolCallingDefault);
}

function buildAgentDecisionProviderPayload(settings, payload) {
    const useNativeToolCalls = shouldUseNativeAgentDecision(settings, payload);
    if (useNativeToolCalls) {
        return {
            ...payload,
            tools: [buildAgentDecisionNativeTool()],
            toolChoice: {
                name: 'aigl_agent_decision',
                required: true
            }
        };
    }
    return {
        ...payload,
        jsonMode: true
    };
}

function extractAgentDecisionJson(response = {}) {
    const nativeDecisionCall = (response.toolCalls || []).find((call) => call.name === 'aigl_agent_decision');
    if (nativeDecisionCall) {
        return {
            json: nativeDecisionCall.arguments || {},
            source: 'native_tool_call',
            nativeToolCall: nativeDecisionCall
        };
    }
    return {
        json: extractJsonObject(response.content),
        source: 'json_text'
    };
}

async function callLlmAgentDecision(settings, payload) {
    let response = await callDesktopLlmProvider(settings, buildAgentDecisionProviderPayload(settings, payload));
    let transportFallback = false;
    if (
        !response.ok &&
        response.code === 'provider_error' &&
        !isTerminalProviderErrorMessage(response.error) &&
        (payload.nativeToolCalls !== false || payload.jsonMode !== false)
    ) {
        response = await callDesktopLlmProvider(settings, {
            ...payload,
            disableNativeToolCalls: true
        });
        transportFallback = true;
    }
    if (!response.ok) {
        return {
            ok: false,
            status: response.code || 'llm_error',
            error: response.error || 'LLM agent failed'
        };
    }
    const extracted = extractAgentDecisionJson(response);
    const json = extracted.json;
    if (!json || typeof json !== 'object') {
        return {
            ok: false,
            status: 'invalid_agent_decision',
            error: 'Agentic Executor 没有返回合法 JSON。',
            raw: response.content,
            nativeToolCalls: response.toolCalls || [],
            decisionSource: extracted.source,
            transportFallback
        };
    }

    let toolCall = sanitizeAgentToolCall(
        json.tool_call || json.toolCall || json.next_step || json.nextStep || buildRootToolCallCandidate(json),
        0,
        'execute'
    );
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
    const personaOutput = sanitizePersonaOutput(json.persona_output || json.personaOutput || json.surface);

    const inferredAction = capabilityRequest.hasAny
        ? 'load_context'
        : toolCall
        ? 'tool'
        : normalizeText(json.final_answer || json.answer || json.response || personaOutput?.text || personaOutput?.bubbleText)
            ? 'final'
            : '';
    const action = normalizeAgentAction(json.action || json.next_action || json.nextAction, inferredAction);
    const finalAnswer = normalizeText(json.final_answer || json.answer || json.response);
    const blockedReason = normalizeText(json.blocked_reason || json.blockedReason || json.reason || json.error);
    const exactAnswerSubmission = normalizeExactAnswerSubmission(
        json.exact_answer_submission ||
            json.exactAnswerSubmission ||
            json.submitted_answer ||
            json.submittedAnswer ||
            {}
    );

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
        publicReasoning: normalizePublicReasoningText(
            json.public_reasoning ||
                json.publicReasoning ||
                json.reasoning_summary ||
                json.reasoningSummary ||
                json.visible_reasoning ||
                json.visibleReasoning ||
                json.thinking_summary ||
                json.thinkingSummary,
            normalizeText(json.summary || json.objective || json.goal)
        ),
        riskLevel: normalizeText(json.risk_level || json.riskLevel, toolCall && agentStepNeedsConfirmation(toolCall) ? 'medium' : 'low'),
        action,
        finalAnswer: finalAnswer || personaOutput?.text || personaOutput?.bubbleText || '',
        blockedReason,
        toolCall,
        capabilityRequest,
        planUpdates: normalizePlanUpdates(json.plan_update || json.planUpdate || json.plan),
        personaOutput,
        exactAnswerSubmission: exactAnswerSubmission.answer || exactAnswerSubmission.evidenceRefs.length || exactAnswerSubmission.confidence
            ? exactAnswerSubmission
            : null,
        legacyPlan,
        raw: json,
        decisionSource: extracted.source,
        nativeToolCall: extracted.nativeToolCall || null,
        transportFallback,
        model: response.model,
        usage: response.usage
    };
}

const AGENT_DECISION_REPAIR_STATUSES = new Set([
    'invalid_agent_decision',
    'invalid_agent_tool_call',
    'invalid_capability_request',
    'plan_only_or_unknown_action'
]);

function buildAgentDecisionRepairMessages(messages = [], decision = {}) {
    return [
        ...messages,
        {
            role: 'user',
            content: JSON.stringify(
                {
                    protocol_error: decision.status || 'invalid_agent_decision',
                    error: decision.error || '',
                    previous_output: summarizeForModel(
                        typeof decision.raw === 'string'
                            ? decision.raw
                            : JSON.stringify(decision.raw || {}, null, 2),
                        4000
                    ),
                    required_output_shape: {
                        action: 'load_context|tool|final|blocked',
                        tool_call: {
                            tool: 'tool_search|request_permissions|mcp__server__tool|external__provider__tool|mcp_bridge|computer|code|email|file_manager|vision.capture_context|subagents|capability_manager|self_debugger|read|write|exec|apply_patch',
                            title: 'short action title',
                            args: {}
                        },
                        final_answer: 'visible answer when action is final',
                        blocked_reason: 'visible reason when action is blocked'
                    },
                    instruction: 'Repair only the JSON protocol for the next step. Output strict JSON only. If an MCP tool is needed, call the mcp__server__tool direct id. Do not wrap MCP execution inside mcp_bridge.call_tool.'
                },
                null,
                2
            )
        }
    ];
}

async function callLlmAgentDecisionWithRepair(settings, payload) {
    const first = await callLlmAgentDecision(settings, payload);
    if (first.ok || !AGENT_DECISION_REPAIR_STATUSES.has(first.status)) {
        return first;
    }
    const repaired = await callLlmAgentDecision(settings, {
        ...payload,
        temperature: 0,
        messages: buildAgentDecisionRepairMessages(payload.messages || [], first)
    });
    if (repaired.ok) {
        return {
            ...repaired,
            repaired: true,
            repairedFrom: first.status,
            repairError: first.error
        };
    }
    return {
        ...first,
        repairAttempted: true,
        repairStatus: repaired.status,
        repairError: repaired.error,
        repairRaw: repaired.raw
    };
}

async function callLlmReviewer(settings, { message, plan, stepResults, verificationResults }) {
    let response = await callDesktopLlmProvider(settings, {
        temperature: 0.1,
        jsonMode: true,
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
    if (!response.ok && response.code === 'provider_error') {
        response = await callDesktopLlmProvider(settings, {
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
                        plan,
                        stepResults,
                        verificationResults
                    }, null, 2)
                }
            ]
        });
    }
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
        this.pendingAgentDebugSessions = new Map();
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
            pendingAgentDebugSessionCount: this.pendingAgentDebugSessions.size,
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

    setActiveRun(runId, record = {}) {
        const id = normalizeText(runId);
        if (!id) {
            return null;
        }
        const existing = this.activeRuns.get(id) || {};
        const controller = existing.controller || new AbortController();
        const nextRecord = {
            ...existing,
            ...record,
            runId: id,
            controller,
            signal: controller.signal,
            interruptRequested: existing.interruptRequested === true || controller.signal.aborted,
            interruptReason: existing.interruptReason || '',
            interruptedAt: existing.interruptedAt || null
        };
        this.activeRuns.set(id, nextRecord);
        return nextRecord;
    }

    findActiveRun({ runId = '', sessionId = '' } = {}) {
        const id = normalizeText(runId);
        if (id && this.activeRuns.has(id)) {
            return this.activeRuns.get(id);
        }
        const normalizedSessionId = normalizeText(sessionId);
        const candidates = [...this.activeRuns.values()]
            .filter((record) => !normalizedSessionId || normalizeText(record.sessionId) === normalizedSessionId)
            .sort((a, b) => (Number(b.startedAt) || 0) - (Number(a.startedAt) || 0));
        return candidates[0] || null;
    }

    getRunAbortSignal(runId) {
        return this.activeRuns.get(normalizeText(runId))?.signal || null;
    }

    getRunInterruptState(runId) {
        const record = this.activeRuns.get(normalizeText(runId));
        if (!record) {
            return {
                interrupted: false,
                reason: '',
                requestedAt: null
            };
        }
        return {
            interrupted: record.interruptRequested === true || record.signal?.aborted === true,
            reason: record.interruptReason || 'user_interrupt',
            requestedAt: record.interruptedAt || null
        };
    }

    async requestInterruptRun({ runId = '', sessionId = '', reason = 'user_interrupt', source = 'user' } = {}) {
        const record = this.findActiveRun({ runId, sessionId });
        if (!record?.runId) {
            return {
                ok: false,
                status: 'no_active_run',
                error: '没有找到正在执行的 Agent 对话。'
            };
        }
        const normalizedReason = normalizeText(reason, 'user_interrupt');
        record.interruptRequested = true;
        record.interruptReason = normalizedReason;
        record.interruptedAt = Date.now();
        try {
            record.controller?.abort?.(normalizedReason);
        } catch {
            try {
                record.controller?.abort?.();
            } catch {}
        }
        this.gateway.emitGatewayEvent?.('agent.run.interrupt_requested', {
            runId: record.runId,
            sessionId: record.sessionId || sessionId || 'main',
            status: 'interrupt_requested',
            reason: normalizedReason,
            source
        });
        try {
            await this.gateway.runtime?.appendItem(record.runId, {
                sessionId: record.sessionId || sessionId || 'main',
                type: 'agent.interrupt_requested',
                status: 'interrupt_requested',
                payload: {
                    reason: normalizedReason,
                    source,
                    requestedAt: record.interruptedAt
                }
            });
        } catch {}
        return {
            ok: true,
            status: 'interrupt_requested',
            runId: record.runId,
            sessionId: record.sessionId || sessionId || 'main',
            reason: normalizedReason
        };
    }

    buildPersonaGatewayInput({ result = {}, message = '', requestContext = {}, nextAction = '', source = '' } = {}) {
        const taskState = inferTaskStateFromResult(result);
        const status = normalizeText(result.status || '');
        const approvalState = result.confirmationRequired || status === 'needs_approval' ? 'required' : 'none';
        const evidenceState = inferEvidenceStateFromStepResults(result.steps || []);
        const relationshipStage = inferRelationshipStageFromContext(requestContext);
        const personaHint = result.personaOutput && typeof result.personaOutput === 'object' ? result.personaOutput : {};
        const firstPlanStep = Array.isArray(result.plan) && result.plan.length ? result.plan[0] : null;
        const latestStep = Array.isArray(result.steps) && result.steps.length
            ? result.steps[result.steps.length - 1]
            : null;
        const latestToolStatus = normalizeText(latestStep?.response?.status || latestStep?.status || '');
        const firstTool = normalizeText(
            result.surface?.toolId ||
            latestStep?.tool ||
            firstPlanStep?.tool ||
            ''
        );
        const candidateText = stripControlTags(result.displayText || result.error || personaHint.text || '');
        const candidateEmotionHint = inferEmotionHintFromMessage(candidateText);
        const messageEmotionHint = inferEmotionHintFromMessage(message);
        const emotionHint = candidateEmotionHint !== 'neutral' ? candidateEmotionHint : messageEmotionHint;
        return {
            task_state: taskState,
            approval_state: approvalState,
            evidence_state: evidenceState,
            error_code: normalizeText(latestToolStatus || result.error || status || ''),
            reason: normalizeText(result.blockedReason || result.error || latestStep?.response?.error || result.review?.finalAnswer || ''),
            relationship_stage: relationshipStage,
            emotion_hint: personaHint.emotion || result.surface?.emotion || emotionHint,
            emotion: personaHint.emotion || result.surface?.emotion || emotionHint,
            intensity: personaHint.intensity ?? result.surface?.intensity,
            social_tone: personaHint.socialTone || result.surface?.socialTone || '',
            gesture_intent: personaHint.gestureIntent || result.surface?.gestureIntent || '',
            surface_task_state: personaHint.taskState || result.surface?.taskState || '',
            speech_energy: personaHint.speechEnergy ?? result.surface?.speechEnergy,
            gaze_target: personaHint.gazeTarget || result.surface?.gazeTarget || '',
            duration_hint: personaHint.durationHint || result.surface?.durationHint || '',
            next_action: inferNextActionFromResult(result, nextAction),
            text: candidateText,
            speech_text: stripControlTags(result.speechText || personaHint.speechText || result.surface?.speechText || candidateText),
            bubble_text: stripControlTags(result.bubbleText || personaHint.bubbleText || result.surface?.bubbleText || ''),
            tts_style: normalizeText(result.surface?.ttsStyle || personaHint.ttsStyle || ''),
            tool_id: firstTool,
            action: result.surface?.action || personaHint.action || '',
            source: normalizeText(source || result.surface?.source || result.planner || 'runner'),
            text_is_persona_safe: result.surface?.renderer === 'aigl-persona-renderer'
        };
    }

    presentUserResult({ result = {}, message = '', requestContext = {}, nextAction = '', source = '' } = {}) {
        if (!result || typeof result !== 'object') {
            return result;
        }
        const gatewayInput = this.buildPersonaGatewayInput({
            result,
            message,
            requestContext,
            nextAction,
            source
        });
        const surface = renderPersonaSurfaceGateway(gatewayInput);
        return attachPersonaSurface(result, surface);
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

    storePendingAgentDebugSession(session = {}) {
        const debugSession = {
            debugSessionId: session.debugSessionId || randomUUID(),
            createdAt: Date.now(),
            expiresAt: Date.now() + DEFAULT_PENDING_PLAN_TTL_MS,
            ...session
        };
        this.pendingAgentDebugSessions.set(debugSession.debugSessionId, debugSession);
        this.gateway.emitGatewayEvent?.('agent.debug.session_saved', {
            runId: debugSession.runId,
            sessionId: debugSession.sessionId,
            debugSessionId: debugSession.debugSessionId,
            nextIteration: debugSession.nextIteration,
            stepResultCount: debugSession.stepResults?.length || 0
        });
        return debugSession;
    }

    getPendingAgentDebugSession(debugSessionId) {
        const id = normalizeText(debugSessionId);
        if (!id) {
            return null;
        }
        const session = this.pendingAgentDebugSessions.get(id);
        if (!session) {
            return null;
        }
        if (isPlanExpired(session)) {
            this.pendingAgentDebugSessions.delete(id);
            return null;
        }
        return session;
    }

    deletePendingAgentDebugSession(debugSessionId) {
        return this.pendingAgentDebugSessions.delete(normalizeText(debugSessionId));
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
            const surface = renderApprovalSurface({
                toolId: step.tool,
                title: step.title,
                action,
                reason,
                dryRun,
                visionTargetLabel: targetLabel
            });
            return attachPersonaSurface({
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
            }, surface);
        }
        const surface = renderApprovalSurface({
            toolId: step.tool,
            title: step.title,
            action,
            dryRun
        });
        return attachPersonaSurface({
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
        }, surface);
    }

    async executePlanSteps({ runId, steps, toolContext, request }) {
        const results = [];
        for (const step of steps) {
            this.gateway.emitGatewayEvent?.('agent.step.started', {
                runId,
                stepId: step.id,
                title: step.title,
                tool: step.tool,
                args: step.args,
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
            args: step.args,
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
        const stepResult = attachAgentEvidenceArtifacts({
            id: step.id,
            title: step.title,
            tool: step.tool,
            args: step.args,
            phase: step.phase || 'execute',
            iteration,
            response
        }, {
            taskType: getAgentRunTaskType(request, toolContext)
        });
        this.gateway.emitGatewayEvent?.('agent.step.finished', {
            runId,
            stepId: step.id,
            tool: step.tool,
            status: response.status,
            ok: response.ok,
            evidenceRefs: getStepEvidenceRefs(stepResult),
            planner: 'llm-agentic-executor',
            phase: step.phase || 'execute',
            iteration
        });
        if (stepResult.evidenceArtifacts?.length) {
            this.gateway.emitGatewayEvent?.('agent.evidence_artifacts', {
                runId,
                stepId: step.id,
                iteration,
                artifacts: getEvidenceArtifactsPromptObject(stepResult.evidenceArtifacts)
            });
        }
        return stepResult;
    }

    async executeConfirmedPlan({ request, pendingPlan, sessionId, requestContext, startedAt, runId }) {
        if (isPlanExpired(pendingPlan)) {
            this.deletePendingPlan(pendingPlan.planId, 'pending_plan_expired');
            return this.presentUserResult({
                result: {
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
                },
                message: pendingPlan.message,
                requestContext,
                nextAction: '重新发起这条任务',
                source: 'confirmed_plan_expired'
            });
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
        return this.presentUserResult({
            result: {
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
            },
            message: pendingPlan.message,
            requestContext,
            nextAction: ok ? '' : '从当前失败点继续处理',
            source: 'confirmed_plan_result'
        });
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
        const fileAttachments = getLatestUserFileAttachments(request);
        const missingSettings = !settings.baseUrl || !settings.model || !settings.apiKey;
        if (missingSettings) {
            const displayText = '我还没有拿到可用的大模型配置，所以现在不能由 Agent Loop 判断并执行这句话。请先在控制面板里配置 API Base、模型和 Key。';
            return this.presentUserResult({
                result: {
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
                },
                message,
                requestContext,
                nextAction: '在控制面板补全模型配置',
                source: 'llm_agent_missing_config'
            });
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
        const finishRuntimeRun = async (result, options = {}) => {
            const presented = this.presentUserResult({
                result,
                message,
                requestContext,
                nextAction: options.nextAction || '',
                source: options.source || ''
            });
            this.gateway.emitGatewayEvent?.('agent.message.completed', {
                runId,
                sessionId,
                status: presented.status || result.status || '',
                ok: presented.ok === true,
                text: presented.displayText || presented.finalAnswer || '',
                speechText: presented.speechText || '',
                bubbleText: presented.bubbleText || '',
                source: options.source || 'agent_final'
            });
            if (presented.surface) {
                this.gateway.emitGatewayEvent?.('persona.surface', {
                    runId,
                    sessionId,
                    status: presented.status || result.status || '',
                    surface: presented.surface
                });
            }
            if (!runtimeStarted || !runtime) {
                return presented;
            }
            const transcript = await runtime.completeRun(runId, presented);
            return {
                ...presented,
                transcript
            };
        };
        const abortSignal = this.getRunAbortSignal(runId) || request.abortSignal || request.signal || null;
        const maybeFinishInterruptedRun = async (phase = 'checkpoint') => {
            const interruptState = this.getRunInterruptState(runId);
            if (!interruptState.interrupted) {
                return null;
            }
            const displayText = [
                '已中断当前 Agent 对话/任务。',
                '已经产生的上下文、模型调用、工具结果和时间线都会保留在本次 run 的 transcript 里，可继续在分析台查看。',
                latestDecision?.summary ? `中断前最近一轮判断：${latestDecision.summary}` : ''
            ].filter(Boolean).join('\n');
            const interruptedEvent = {
                type: 'agent_interrupted',
                status: 'interrupted',
                phase,
                reason: interruptState.reason,
                stepCount: stepResults.length
            };
            events.push(interruptedEvent);
            this.gateway.emitGatewayEvent?.('agent.run.interrupted', {
                runId,
                sessionId,
                status: 'interrupted',
                phase,
                reason: interruptState.reason,
                stepCount: stepResults.length,
                durationMs: Date.now() - startedAt
            });
            await appendRuntimeItem({
                type: 'agent.interrupted',
                status: 'interrupted',
                payload: {
                    phase,
                    reason: interruptState.reason,
                    requestedAt: interruptState.requestedAt,
                    durationMs: Date.now() - startedAt,
                    stepCount: stepResults.length,
                    latestDecision: latestDecision
                        ? {
                              action: latestDecision.action,
                              intent: latestDecision.intent,
                              summary: latestDecision.summary,
                              status: latestDecision.status
                          }
                        : null
                }
            });
            return await finishRuntimeRun(attachPersonaSurface({
                ok: false,
                runId,
                sessionId,
                status: 'interrupted',
                mode: 'task',
                planner: 'llm-agentic-executor',
                intent: latestDecision?.intent || 'agent_interrupted',
                executionRequired: stepResults.length > 0,
                durationMs: Date.now() - startedAt,
                message,
                displayText,
                speechText: displayText.replace(/\n/g, ' '),
                plan: [],
                steps: stepResults,
                events
            }, renderStatusSurface({
                text: displayText,
                status: 'interrupted',
                ok: false,
                source: 'agent_interrupted',
                expression: 'surprised'
            })), {
                source: 'agent_interrupted',
                nextAction: '检查分析台中已保留的上下文和工具记录'
            });
        };
        const pauseRuntimeRun = async (result, options = {}) => {
            const presented = this.presentUserResult({
                result,
                message,
                requestContext,
                nextAction: options.nextAction || '点击下一轮继续调试',
                source: options.source || 'agent_debug_pause'
            });
            this.gateway.emitGatewayEvent?.('agent.debug.paused', {
                runId,
                sessionId,
                status: presented.status || 'debug_paused',
                debugSessionId: presented.debugSessionId || '',
                iteration: presented.pausedAtIteration,
                nextIteration: presented.nextIteration,
                displayText: presented.displayText || ''
            });
            await appendRuntimeItem({
                type: 'agent.debug.paused',
                status: 'debug_paused',
                payload: {
                    debugSessionId: presented.debugSessionId || '',
                    iteration: presented.pausedAtIteration,
                    nextIteration: presented.nextIteration,
                    reason: options.reason || '',
                    displayText: presented.displayText || '',
                    durationMs: presented.durationMs
                }
            });
            return presented;
        };
        const autoConfirm =
            request.autoConfirm === true ||
            requestContext.autoConfirm === true ||
            requestContext.confirmationPolicy === 'auto';
        const approved = approvedForRun || autoConfirm || requestContext.approved === true;
        const debugBreakAfterRound =
            request.debugBreakAfterRound === true ||
            requestContext.debugBreakAfterRound === true ||
            requestContext.agentLabStepMode === true;
        const requestedMaxSteps = Number(request.maxAgentSteps || requestContext.maxAgentSteps || DEFAULT_AGENT_LOOP_STEPS);
        const maxSteps = Math.max(1, Math.min(Number.isFinite(requestedMaxSteps) ? requestedMaxSteps : DEFAULT_AGENT_LOOP_STEPS, MAX_AGENT_LOOP_STEPS));
        const events = initialEvents.slice();
        const stepResults = initialStepResults.slice();
        const initialPlan = request.initialPlan || requestContext.initialPlan || null;
        const exactAnswerMode = isExactAnswerExecutionMode(request, requestContext);
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
        const pauseAfterRound = async ({ iteration, reason = 'round_completed', decision = null, step = null } = {}) => {
            if (!debugBreakAfterRound || iteration + 1 >= maxSteps) {
                return null;
            }
            const debugSession = this.storePendingAgentDebugSession({
                runId,
                sessionId,
                message,
                settings,
                requestContext,
                events: events.slice(),
                stepResults: stepResults.slice(),
                nextIteration: iteration + 1,
                maxSteps,
                intent: decision?.intent || latestDecision?.intent || 'llm_agent',
                summary: decision?.summary || latestDecision?.summary || '',
                lastAction: decision?.action || '',
                lastTool: step?.tool || decision?.toolCall?.tool || ''
            });
            const displayText = [
                `调试暂停：第 ${iteration + 1} 轮已经执行完。`,
                decision?.summary ? `本轮判断：${decision.summary}` : '',
                step?.tool ? `本轮工具：${step.tool}${step.title ? `（${step.title}）` : ''}` : '',
                `点击“下一轮”会从第 ${iteration + 2} 轮继续同一个 run。`
            ].filter(Boolean).join('\n');
            return await pauseRuntimeRun({
                ok: true,
                runId,
                sessionId,
                status: 'debug_paused',
                mode: 'task',
                planner: 'llm-agentic-executor',
                intent: debugSession.intent,
                executionRequired: stepResults.length > 0,
                durationMs: Date.now() - startedAt,
                message,
                displayText,
                speechText: displayText.replace(/\n/g, ' '),
                debugSessionId: debugSession.debugSessionId,
                pausedAtIteration: iteration,
                nextIteration: debugSession.nextIteration,
                plan: step
                    ? [{
                          id: step.id,
                          title: step.title,
                          tool: step.tool,
                          args: step.args
                      }]
                    : [],
                steps: stepResults,
                events
            }, { reason });
        };

        for (let iteration = startIteration; iteration < maxSteps; iteration += 1) {
            const interruptedBeforeRound = await maybeFinishInterruptedRun(`before_round_${iteration}`);
            if (interruptedBeforeRound) {
                return interruptedBeforeRound;
            }
            const decisionSettings = resolveAgentDecisionSettings(settings, requestContext);
            const decisionTimeoutMs = resolveAgentDecisionTimeoutMs(decisionSettings, {
                events,
                stepResults,
                requestContext
            });
            const externalToolExposure = await buildExternalToolExposurePromptObject(this.gateway, {
                query: message,
                limit: requestContext.externalToolExposureLimit || request.externalToolExposureLimit || 16
            });
            const directToolSpecs = buildAgentDirectToolSpecs(this.gateway, {
                stepResults,
                requestContext,
                exactAnswerMode
            });
            const useDirectToolExecutor =
                shouldUseDirectToolExecutor(decisionSettings, requestContext) &&
                directToolSpecs.length > 0;
            const commonPromptArgs = {
                message,
                messageHistory: request.messageHistory,
                events,
                stepResults,
                maxSteps,
                emailProfiles,
                initialPlan,
                memoryContext,
                fileAttachments,
                externalToolExposure,
                exactAnswerMode,
                toolSummary: useDirectToolExecutor
                    ? `Native direct tools exposed: ${directToolSpecs.map((tool) => tool.name).slice(0, 16).join(', ')}${directToolSpecs.length > 16 ? ', ...' : ''}.`
                    : 'Codex-like capability index only. Load detailed tool contracts with load_context; load MCP/external tools through tool_search/capability_context as mcp__server__tool or external__provider__tool direct specs. Use mcp_bridge/capability_manager for discovery, auth, install, resources, and server management.'
            };
            const decisionMessages = useDirectToolExecutor
                ? buildLlmAgentDirectToolMessages(commonPromptArgs)
                : buildLlmAgentExecutorMessages(commonPromptArgs);
            const promptBudget = buildPromptBudgetReport(decisionMessages);
            this.gateway.emitGatewayEvent?.('agent.prompt_budget', {
                runId,
                sessionId,
                iteration,
                ...promptBudget,
                executorMode: useDirectToolExecutor ? 'native_direct_tools' : 'json_meta_decision',
                directToolCount: directToolSpecs.length
            });
            await appendRuntimeItem({
                type: 'agent.context_snapshot',
                status: 'captured',
                payload: {
                    iteration,
                    promptBudget,
                    executorMode: useDirectToolExecutor ? 'native_direct_tools' : 'json_meta_decision',
                    directTools: directToolSpecs.map((tool) => tool.name),
                    messages: decisionMessages
                }
            });
            const interruptedBeforeLlm = await maybeFinishInterruptedRun(`before_llm_decision_${iteration}`);
            if (interruptedBeforeLlm) {
                return interruptedBeforeLlm;
            }
            const decisionPayload = buildAgentDecisionLowLatencyPayload({
                timeoutMs: decisionTimeoutMs,
                messages: decisionMessages,
                abortSignal,
                ...(useDirectToolExecutor ? { tools: directToolSpecs, toolChoice: 'auto', jsonMode: false } : {})
            }, {
                settings: decisionSettings,
                requestContext
            });
            const llmCallId = `${runId}:agent_decision:${iteration}`;
            const llmCallStartedAt = Date.now();
            this.gateway.emitGatewayEvent?.('agent.llm_call.started', {
                runId,
                sessionId,
                iteration,
                callId: llmCallId,
                phase: 'agent_decision',
                provider: decisionSettings.provider || '',
                model: decisionSettings.model || '',
                timeoutMs: decisionTimeoutMs,
                promptBudget,
                controls: {
                    temperature: decisionPayload.temperature,
                    reasoning_effort: decisionPayload.reasoning_effort || '',
                    thinking: decisionPayload.thinking?.type || '',
                    latencyProfile: decisionPayload.latencyProfile || ''
                }
            });
            let decision = useDirectToolExecutor
                ? await callLlmAgentDirectToolDecision(decisionSettings, decisionPayload, {
                      hasToolHistory: stepResults.length > 0 || events.some((event) => event?.type === 'tool_result')
                  })
                : await callLlmAgentDecisionWithRepair(decisionSettings, decisionPayload);
            if (
                useDirectToolExecutor &&
                !decision.ok &&
                (decision.directToolFallback === true ||
                    (DIRECT_TOOL_EXECUTOR_FALLBACK_STATUSES.has(decision.status) &&
                        !isTerminalProviderDecisionError(decision)))
            ) {
                const fallbackNote = {
                    type: 'runtime_note',
                    status: 'direct_tool_executor_fallback',
                    iteration,
                    reason: decision.status || 'unknown',
                    error: decision.error || '',
                    next: 'Retrying with legacy JSON meta-decision planner for compatibility.'
                };
                events.push(fallbackNote);
                await appendRuntimeItem({
                    type: 'agent.direct_tool_fallback',
                    status: decision.status || 'fallback',
                    payload: fallbackNote
                });
                const fallbackMessages = buildLlmAgentExecutorMessages({
                    ...commonPromptArgs,
                    toolSummary: 'Direct native tool attempt fell back to JSON meta-decision compatibility mode. Continue with one executable action.'
                });
                decision = await callLlmAgentDecisionWithRepair(
                    decisionSettings,
                    buildAgentDecisionLowLatencyPayload({
                        timeoutMs: decisionTimeoutMs,
                        abortSignal,
                        messages: fallbackMessages
                    }, {
                        settings: decisionSettings,
                        requestContext
                    })
                );
                decision.directToolFallbackFrom = fallbackNote.reason;
            }
            latestDecision = decision;
            const llmCallDurationMs = Date.now() - llmCallStartedAt;
            const usageSummary = summarizeLlmUsage(decision.usage);
            this.gateway.emitGatewayEvent?.('agent.llm_call.completed', {
                runId,
                sessionId,
                iteration,
                callId: llmCallId,
                phase: 'agent_decision',
                durationMs: llmCallDurationMs,
                ok: decision.ok === true,
                status: decision.ok ? decision.action : decision.status,
                action: decision.action || '',
                provider: decision.provider || decisionSettings.provider || '',
                model: decision.model || decisionSettings.model || '',
                usage: usageSummary,
                repaired: decision.repaired === true,
                repairAttempted: decision.repairAttempted === true
            });
            await appendRuntimeItem({
                type: 'agent.llm_call',
                status: decision.ok ? 'completed' : (decision.status || 'failed'),
                payload: {
                    iteration,
                    callId: llmCallId,
                    phase: 'agent_decision',
                    durationMs: llmCallDurationMs,
                    ok: decision.ok === true,
                    status: decision.ok ? decision.action : decision.status,
                    action: decision.action || '',
                    provider: decision.provider || decisionSettings.provider || '',
                    model: decision.model || decisionSettings.model || '',
                    usage: usageSummary,
                    repaired: decision.repaired === true,
                    repairAttempted: decision.repairAttempted === true
                }
            });
            this.gateway.emitGatewayEvent?.('agent.token_usage', {
                runId,
                sessionId,
                iteration,
                promptBudget,
                usage: decision.usage || null,
                repaired: decision.repaired === true
            });
            await appendRuntimeItem({
                type: 'agent.decision',
                status: decision.ok ? decision.action : decision.status,
                payload: {
                    iteration,
                    promptBudget,
                    usage: decision.usage || null,
                    ok: decision.ok,
                    status: decision.status,
                    action: decision.action,
                    mode: decision.mode,
                    intent: decision.intent,
                    summary: decision.summary,
                    publicReasoning: decision.publicReasoning,
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
                    exactAnswerSubmission: decision.exactAnswerSubmission || null,
                    error: decision.error,
                    repaired: decision.repaired === true,
                    repairedFrom: decision.repairedFrom || '',
                    repairAttempted: decision.repairAttempted === true,
                    repairStatus: decision.repairStatus || '',
                    repairError: decision.repairError || ''
                }
            });
            const interruptedAfterDecision = await maybeFinishInterruptedRun(`after_llm_decision_${iteration}`);
            if (interruptedAfterDecision) {
                return interruptedAfterDecision;
            }
            if (!decision.ok && isTerminalProviderDecisionError(decision)) {
                const displayText = `LLM provider is unavailable: ${decision.error || 'provider_error'}`;
                return await finishRuntimeRun(attachPersonaSurface({
                    ok: false,
                    runId,
                    sessionId,
                    status: 'provider_error',
                    mode: 'task',
                    planner: 'llm-agentic-executor',
                    intent: 'llm_provider_unavailable',
                    executionRequired: stepResults.length > 0,
                    durationMs: Date.now() - startedAt,
                    message,
                    error: decision.error || 'LLM provider failed before the agent could make a decision.',
                    displayText,
                    speechText: displayText,
                    plan: [],
                    steps: stepResults,
                    events
                }, renderStatusSurface({
                    text: displayText,
                    status: 'provider_error',
                    ok: false,
                    source: 'llm_provider_unavailable',
                    expression: 'anxious'
                })), {
                    source: 'llm_provider_unavailable',
                    nextAction: '检查或更换 LLM provider/API key 后重新运行'
                });
            }
            if (decision.ok && decision.action !== 'final' && decision.publicReasoning) {
                const reasoningEvent = {
                    type: 'reasoning',
                    status: 'delta',
                    iteration,
                    text: decision.publicReasoning
                };
                events.push(reasoningEvent);
                this.gateway.emitGatewayEvent?.('agent.reasoning.delta', {
                    runId,
                    sessionId,
                    iteration,
                    text: decision.publicReasoning,
                    action: decision.action,
                    intent: decision.intent
                });
                await appendRuntimeItem({
                    type: 'agent.reasoning',
                    status: 'delta',
                    payload: {
                        iteration,
                        text: decision.publicReasoning,
                        action: decision.action,
                        intent: decision.intent
                    }
                });
            }
            if (!decision.ok) {
                const invalidDecisionObservation = buildInvalidDecisionObservationEvent(decision, iteration, maxSteps);
                events.push(invalidDecisionObservation);
                this.gateway.emitGatewayEvent?.('agent.invalid_decision_observation', {
                    runId,
                    sessionId,
                    iteration,
                    status: decision.status,
                    error: decision.error || '',
                    repairAttempted: decision.repairAttempted === true,
                    repairStatus: decision.repairStatus || '',
                    maxSteps
                });
                await appendRuntimeItem({
                    type: 'agent.invalid_decision_observation',
                    status: decision.status || 'invalid_agent_decision',
                    payload: invalidDecisionObservation
                });
                const paused = await pauseAfterRound({
                    iteration,
                    reason: 'invalid_decision',
                    decision
                });
                if (paused) {
                    return paused;
                }
                continue;
            }

            if (decision.planUpdates?.length && decision.action !== 'final') {
                const planResponse = await this.gateway.callTool({
                    tool: 'update_plan',
                    args: {
                        explanation: decision.summary,
                        plan: decision.planUpdates.map((step, index) => ({
                            id: `agent-plan-${iteration + 1}-${index + 1}`,
                            step,
                            status: index === 0 ? 'in_progress' : 'pending'
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
                const interruptedAfterPlanUpdate = await maybeFinishInterruptedRun(`after_plan_update_${iteration}`);
                if (interruptedAfterPlanUpdate) {
                    return interruptedAfterPlanUpdate;
                }
            }

            if (decision.action === 'load_context') {
                const capabilityEvent = await enrichCapabilityContextWithMcpToolSpecs(
                    buildCapabilityContextEvent({
                        capabilityRequest: decision.capabilityRequest,
                        emailProfiles,
                        iteration
                    }),
                    this.gateway.runtime,
                    { timeoutMs: request.timeoutMs || requestContext.timeoutMs || 8000 }
                );
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
                const interruptedAfterCapabilityContext = await maybeFinishInterruptedRun(`after_capability_context_${iteration}`);
                if (interruptedAfterCapabilityContext) {
                    return interruptedAfterCapabilityContext;
                }
                const paused = await pauseAfterRound({
                    iteration,
                    reason: 'capability_context_loaded',
                    decision
                });
                if (paused) {
                    return paused;
                }
                continue;
            }

            if (decision.action === 'final') {
                const exactAnswerValidation = exactAnswerMode
                    ? validateExactAnswerSubmission({ decision, stepResults })
                    : { ok: true, submission: null };
                if (!exactAnswerValidation.ok) {
                    const repairObservation = buildExactAnswerRepairObservation(exactAnswerValidation, { iteration });
                    events.push(repairObservation);
                    await appendRuntimeItem({
                        type: 'agent.exact_answer_gate',
                        status: 'rejected',
                        payload: {
                            iteration,
                            validation: exactAnswerValidation,
                            repairObservation
                        }
                    });
                    if (iteration + 1 < maxSteps) {
                        const paused = await pauseAfterRound({
                            iteration,
                            reason: 'exact_answer_gate_rejected',
                            decision
                        });
                        if (paused) {
                            return paused;
                        }
                        continue;
                    }
                    const blockedText = [
                        '我还不能提交这个精确答案，因为证据闸门没有通过。',
                        `原因：${exactAnswerValidation.errors.join(', ') || 'missing exact-answer evidence'}`,
                        repairObservation.nextAction
                    ].filter(Boolean).join('\n');
                    return await finishRuntimeRun(attachPersonaSurface({
                        ok: false,
                        runId,
                        sessionId,
                        status: 'exact_answer_gate_rejected',
                        mode: 'task',
                        planner: 'llm-agentic-executor',
                        intent: decision.intent,
                        executionRequired: stepResults.length > 0,
                        durationMs: Date.now() - startedAt,
                        message,
                        displayText: blockedText,
                        speechText: blockedText.replace(/\n/g, ' '),
                        plan: [],
                        steps: stepResults,
                        events,
                        planUpdates: decision.planUpdates,
                        exactAnswerGate: exactAnswerValidation
                    }, renderStatusSurface({
                        text: blockedText,
                        status: 'blocked',
                        ok: false,
                        source: 'exact_answer_gate',
                        expression: 'thinking'
                    })), { source: 'exact_answer_gate' });
                }
                const exactAnswerSubmission = exactAnswerValidation.submission || null;
                const displayText = decision.finalAnswer || decision.summary || '任务完成。';
                const failureSurface = renderLatestToolFailureSurface({
                    stepResults,
                    message,
                    intent: decision.intent,
                    fallbackText: displayText
                });
                const visibleText = failureSurface?.text || displayText;
                const result = {
                    ok: !failureSurface,
                    runId,
                    sessionId,
                    status: failureSurface
                        ? normalizeText(getLatestFailedToolStepResult(stepResults)?.response?.status, 'tool_failed')
                        : 'completed',
                    mode: decision.mode,
                    planner: 'llm-agentic-executor',
                    intent: decision.intent,
                    executionRequired: stepResults.length > 0,
                    durationMs: Date.now() - startedAt,
                    message,
                    finalAnswer: exactAnswerSubmission?.answer || decision.finalAnswer || '',
                    exactAnswerSubmission,
                    exactAnswerGate: exactAnswerMode ? exactAnswerValidation : null,
                    displayText: visibleText,
                    speechText: failureSurface
                        ? visibleText.replace(/\n/g, ' ')
                        : normalizeText(decision.personaOutput?.speechText, visibleText.replace(/\n/g, ' ')),
                    bubbleText: failureSurface
                        ? ''
                        : normalizeText(decision.personaOutput?.bubbleText),
                    plan: [],
                    steps: stepResults,
                    events,
                    planUpdates: decision.planUpdates,
                    usage: decision.usage,
                    personaOutput: failureSurface
                        ? null
                        : {
                              text: normalizeText(decision.personaOutput?.text || visibleText),
                              speechText: normalizeText(decision.personaOutput?.speechText),
                              bubbleText: normalizeText(decision.personaOutput?.bubbleText),
                              expression: normalizeText(decision.personaOutput?.expression),
                              action: normalizeText(decision.personaOutput?.action),
                              emotion: normalizeText(decision.personaOutput?.emotion),
                              intensity: decision.personaOutput?.intensity,
                              socialTone: normalizeText(decision.personaOutput?.socialTone),
                              gestureIntent: normalizeText(decision.personaOutput?.gestureIntent),
                              taskState: normalizeText(decision.personaOutput?.taskState),
                              speechEnergy: decision.personaOutput?.speechEnergy,
                              gazeTarget: normalizeText(decision.personaOutput?.gazeTarget),
                              durationHint: normalizeText(decision.personaOutput?.durationHint),
                              ttsStyle: normalizeText(decision.personaOutput?.ttsStyle)
                          }
                };
                return await finishRuntimeRun(
                    failureSurface ? attachPersonaSurface(result, failureSurface) : result,
                    { source: failureSurface ? 'tool_failure' : 'agent_final' }
                );
            }

            if (decision.action === 'blocked') {
                const displayText = decision.blockedReason || decision.finalAnswer || '我判断现在继续下去不太稳，先停住，等你给我补一点信息。';
                const failureSurface = renderLatestToolFailureSurface({
                    stepResults,
                    message,
                    intent: decision.intent,
                    fallbackText: displayText
                });
                const visibleText = failureSurface?.text || displayText;
                return await finishRuntimeRun(attachPersonaSurface({
                    ok: false,
                    runId,
                    sessionId,
                    status: failureSurface
                        ? normalizeText(getLatestFailedToolStepResult(stepResults)?.response?.status, 'tool_failed')
                        : 'blocked',
                    mode: 'task',
                    planner: 'llm-agentic-executor',
                    intent: decision.intent,
                    executionRequired: stepResults.length > 0,
                    durationMs: Date.now() - startedAt,
                    message,
                    displayText: visibleText,
                    speechText: visibleText.replace(/\n/g, ' '),
                    plan: [],
                    steps: stepResults,
                    events,
                    planUpdates: decision.planUpdates
                }, failureSurface || renderStatusSurface({
                    text: visibleText,
                    status: 'blocked',
                    ok: false,
                    source: 'agent_blocked',
                    expression: 'relaxed'
                })));
            }

            let step = decision.toolCall;
            if (!step) {
                const displayText = '我知道这轮应该继续处理，但没有拿到可执行的下一步，所以先停住。你可以让我从当前任务重新整理一下。';
                return await finishRuntimeRun(attachPersonaSurface({
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
                }, renderStatusSurface({
                    text: displayText,
                    status: 'invalid_agent_tool_call',
                    ok: false,
                    source: 'agent_invalid_tool_call',
                    expression: 'surprised'
                })));
            }

            const deferredToolContract = buildDeferredToolContractRequest(step, events);
            if (deferredToolContract) {
                const note = {
                    type: 'runtime_note',
                    status: 'tool_contract_deferred_loaded',
                    iteration,
                    tool: step.tool,
                    normalizedTool: deferredToolContract.toolId,
                    reason: '首轮 capability_catalog 只保留能力索引；该工具的 contract/schema 已按需加载到后续 capability_context。'
                };
                events.push(note);
                const capabilityEvent = await enrichCapabilityContextWithMcpToolSpecs(
                    buildCapabilityContextEvent({
                        capabilityRequest: deferredToolContract.capabilityRequest,
                        emailProfiles,
                        iteration
                    }),
                    this.gateway.runtime,
                    { timeoutMs: request.timeoutMs || requestContext.timeoutMs || 8000 }
                );
                events.push(capabilityEvent);
                await appendRuntimeItem({
                    type: 'agent.tool_contract_context',
                    status: capabilityEvent.status,
                    payload: {
                        iteration,
                        tool: deferredToolContract.toolId,
                        request: capabilityEvent.request,
                        loaded: capabilityEvent.loaded,
                        missing: capabilityEvent.missing
                    }
                });
                const interruptedAfterToolContract = await maybeFinishInterruptedRun(`after_tool_contract_context_${iteration}`);
                if (interruptedAfterToolContract) {
                    return interruptedAfterToolContract;
                }
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
                const interruptedAfterValidation = await maybeFinishInterruptedRun(`after_tool_validation_${iteration}`);
                if (interruptedAfterValidation) {
                    return interruptedAfterValidation;
                }
                const paused = await pauseAfterRound({
                    iteration,
                    reason: 'tool_validation_failed',
                    decision,
                    step
                });
                if (paused) {
                    return paused;
                }
                continue;
            }

            const plannedToolContext = buildToolContext(requestContext, this.workspaceRoot, sessionId);
            const policyDecision = this.gateway.runtime?.evaluateToolCall?.({
                toolId: step.tool,
                args: step.args,
                context: plannedToolContext
            });
            if (policyDecision?.denied) {
                const displayText = `这一步被本地权限边界拦住了，我不会硬往下做。原因是：${policyDecision.reason}`;
                return await finishRuntimeRun(attachPersonaSurface({
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
                }, renderStatusSurface({
                    text: displayText,
                    status: 'blocked',
                    ok: false,
                    source: 'agent_policy_blocked',
                    expression: 'relaxed'
                })));
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

            const interruptedBeforeTool = await maybeFinishInterruptedRun(`before_tool_${iteration}`);
            if (interruptedBeforeTool) {
                return interruptedBeforeTool;
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
            const toolResultEvent = buildToolResultEvent(stepResult);
            events.push(toolResultEvent);
            await appendRuntimeItem({
                type: 'agent.tool_result',
                status: stepResult.response?.status || 'unknown',
                payload: {
                    iteration,
                    stepId: stepResult.id,
                    title: stepResult.title,
                    tool: stepResult.tool,
                    ok: stepResult.response?.ok === true,
                    status: stepResult.response?.status || 'unknown',
                    evidenceRefs: getStepEvidenceRefs(stepResult),
                    evidenceArtifacts: getEvidenceArtifactsPromptObject(stepResult.evidenceArtifacts || []),
                    preview: toolResultEvent.preview
                }
            });

            const interruptedAfterTool = await maybeFinishInterruptedRun(`after_tool_${iteration}`);
            if (interruptedAfterTool) {
                return interruptedAfterTool;
            }

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

            const paused = await pauseAfterRound({
                iteration,
                reason: stepResult.response?.ok ? 'tool_completed' : 'tool_failed',
                decision,
                step
            });
            if (paused) {
                return paused;
            }
        }

        const surface = renderMaxStepsSurface({
            maxSteps,
            stepCount: stepResults.length,
            latestSummary: latestDecision?.summary,
            mode: latestDecision?.mode || 'task'
        });
        const displayText = surface.text;
        return await finishRuntimeRun(attachPersonaSurface({
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
        }, surface));
    }

    async executePendingAgentApproval({ request, pendingApproval, sessionId, requestContext, startedAt, runId }) {
        if (isPlanExpired(pendingApproval)) {
            this.deletePendingAgentApproval(pendingApproval.approvalId, 'pending_agent_approval_expired');
            const displayText = '这个待确认工具动作已经过期了，请重新发起任务。';
            return this.presentUserResult({
                result: {
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
                },
                message: pendingApproval.message,
                requestContext,
                nextAction: '重新发起这条任务',
                source: 'pending_agent_approval_expired'
            });
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
        const finishRuntimeRun = async (result, options = {}) => {
            const presented = this.presentUserResult({
                result,
                message: pendingApproval.message,
                requestContext,
                nextAction: options.nextAction || '',
                source: options.source || ''
            });
            this.gateway.emitGatewayEvent?.('agent.message.completed', {
                runId,
                sessionId,
                status: presented.status || result.status || '',
                ok: presented.ok === true,
                text: presented.displayText || presented.finalAnswer || '',
                speechText: presented.speechText || '',
                bubbleText: presented.bubbleText || '',
                source: options.source || 'agent_final'
            });
            if (presented.surface) {
                this.gateway.emitGatewayEvent?.('persona.surface', {
                    runId,
                    sessionId,
                    status: presented.status || result.status || '',
                    surface: presented.surface
                });
            }
            if (!runtimeStarted || !runtime) {
                return presented;
            }
            const transcript = await runtime.completeRun(runId, presented);
            return {
                ...presented,
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
            const surface = renderToolFailureSurface({
                step,
                response: stepResult.response,
                userMessage: pendingApproval.message,
                intent: pendingApproval.intent || 'agent_action_confirmation',
                fallbackText: `${step.title || step.tool} 仍然需要更高权限或额外确认。`
            });
            const displayText = surface.text;
            return await finishRuntimeRun(attachPersonaSurface({
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
            }, surface));
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
        const requestContext = request.context && typeof request.context === 'object' ? request.context : {};
        const explicitRunId = normalizeText(request.runId || requestContext.runId);
        const runId = explicitRunId || randomUUID();
        const startedAt = Date.now();
        const message = getLatestUserMessage(request);
        const sessionId = normalizeText(request.sessionId || request.sessionKey, 'main');
        const dryRun = request.dryRun === true || requestContext.dryRun === true;
        const explicitDebugSessionId = normalizeText(request.debugSessionId || requestContext.debugSessionId);
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

        if (explicitDebugSessionId) {
            const debugSession = this.getPendingAgentDebugSession(explicitDebugSessionId);
            if (!debugSession) {
                const displayText = '这个调试断点已经不存在或已过期，请重新发起一次 Agent 调试任务。';
                return this.presentUserResult({
                    result: {
                        ok: false,
                        runId,
                        sessionId,
                        status: 'debug_session_not_found',
                        mode: 'task',
                        planner: 'llm-agentic-executor',
                        intent: 'agent_debug_continue',
                        executionRequired: false,
                        durationMs: Date.now() - startedAt,
                        message,
                        displayText,
                        speechText: displayText,
                        plan: [],
                        steps: []
                    },
                    message,
                    requestContext,
                    source: 'agent_debug_missing'
                });
            }

            this.deletePendingAgentDebugSession(explicitDebugSessionId);
            const debugRunId = debugSession.runId || runId;
            const debugSessionId = debugSession.sessionId || sessionId;
            this.setActiveRun(debugRunId, {
                runId: debugRunId,
                sessionId: debugSessionId,
                startedAt,
                mode: 'llm-agentic-executor',
                intent: 'agent_debug_continue',
                stepCount: debugSession.stepResults?.length || 0
            });
            this.gateway.emitGatewayEvent?.('agent.run.started', {
                runId: debugRunId,
                sessionId: debugSessionId,
                mode: 'llm-agentic-executor',
                intent: 'agent_debug_continue',
                planner: 'llm-agentic-executor',
                debugSessionId: explicitDebugSessionId,
                startIteration: debugSession.nextIteration
            });
            try {
                const llmResult = await this.runLlmAgentLoop({
                    request: {
                        ...request,
                        message: debugSession.message || message,
                        runId: debugRunId,
                        maxAgentSteps: debugSession.maxSteps || request.maxAgentSteps,
                        debugBreakAfterRound: request.debugBreakAfterRound !== false
                    },
                    message: debugSession.message || message,
                    sessionId: debugSessionId,
                    requestContext: {
                        ...(debugSession.requestContext || {}),
                        ...requestContext,
                        runId: debugRunId,
                        sessionId: debugSessionId,
                        sessionKey: debugSessionId,
                        agentLoop: 'llm',
                        planner: 'llm',
                        debugBreakAfterRound: request.debugBreakAfterRound !== false,
                        approved: requestContext.approved === true || request.approved === true,
                        autoConfirm: requestContext.autoConfirm === true || request.autoConfirm === true
                    },
                    startedAt,
                    runId: debugRunId,
                    dryRun: false,
                    initialEvents: debugSession.events || [],
                    initialStepResults: debugSession.stepResults || [],
                    startIteration: Number(debugSession.nextIteration || 0),
                    approvedForRun: requestContext.approved === true || request.approved === true,
                    settingsOverride: debugSession.settings || null
                });
                if (llmResult) {
                    await this.gateway.appendAudit?.({
                        runId: debugRunId,
                        type: 'agent.run',
                        status: llmResult.status,
                        ok: llmResult.ok,
                        durationMs: llmResult.durationMs,
                        mode: llmResult.mode,
                        intent: llmResult.intent,
                        planner: llmResult.planner,
                        args: {
                            message: debugSession.message || message,
                            sessionId: debugSessionId,
                            debugSessionId: explicitDebugSessionId
                        },
                        context: requestContext,
                        resultPreview: summarize(llmResult.displayText)
                    });
                    this.gateway.emitGatewayEvent?.('agent.run.finished', {
                        runId: debugRunId,
                        sessionId: debugSessionId,
                        status: llmResult.status,
                        mode: llmResult.mode,
                        ok: llmResult.ok,
                        durationMs: llmResult.durationMs,
                        displayText: llmResult.displayText,
                        planner: llmResult.planner,
                        debugSessionId: explicitDebugSessionId
                    });
                    return this.presentUserResult({
                        result: llmResult,
                        message: debugSession.message || message,
                        requestContext
                    });
                }
                return llmResult;
            } finally {
                this.activeRuns.delete(debugRunId);
                this.completedRunCount += 1;
            }
        }

        if (pendingAgentApproval && cancelPendingByMessage) {
            this.deletePendingAgentApproval(pendingAgentApproval.approvalId, 'pending_agent_approval_cancelled');
            const displayText = `已取消待确认工具动作：${pendingAgentApproval.nextStep?.title || pendingAgentApproval.approvalId}`;
            return this.presentUserResult({
                result: {
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
                },
                message,
                requestContext,
                source: 'run_message_cancel_agent_approval'
            });
        }

        if (pendingAgentApproval) {
            if (request.classifyOnly === true) {
                const step = pendingAgentApproval.nextStep;
                const pendingLabel = isVisionAgentStep(step)
                    ? `检测到待确认视觉感知：看一眼${getVisionStepTargetLabel(step)}`
                    : `检测到待确认工具动作：${step?.title || pendingAgentApproval.approvalId}`;
                return this.presentUserResult({
                    result: {
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
                    },
                    message,
                    requestContext,
                    nextAction: step?.title || '',
                    source: 'run_message_classify_pending_agent_approval'
                });
            }
            const apiConfirmed = request.confirmed === true || requestContext.approved === true;
            if (explicitApprovalId && !apiConfirmed && !confirmedByMessage) {
                const displayText = '执行待确认工具动作需要明确确认：请回复“确认执行”，或在 API 调用里设置 context.approved=true。';
                return this.presentUserResult({
                    result: {
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
                    },
                    message,
                    requestContext,
                    nextAction: pendingAgentApproval.nextStep?.title || '',
                    source: 'run_message_needs_agent_approval'
                });
            }

            const runRecord = {
                runId,
                sessionId,
                startedAt,
                mode: 'task',
                intent: 'agent_action_confirmation',
                stepCount: (pendingAgentApproval.stepResults || []).length
            };
            this.setActiveRun(runId, runRecord);
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
                return this.presentUserResult({
                    result,
                    message,
                    requestContext
                });
            } finally {
                this.activeRuns.delete(runId);
                this.completedRunCount += 1;
            }
        }

        if (pendingPlan && cancelPendingByMessage) {
            this.deletePendingPlan(pendingPlan.planId, 'pending_plan_cancelled');
            const displayText = `已取消待确认计划：${pendingPlan.summary || pendingPlan.planId}`;
            return this.presentUserResult({
                result: {
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
                },
                message,
                requestContext,
                source: 'run_message_cancel_pending_plan'
            });
        }

        if (pendingPlan) {
            if (request.classifyOnly === true) {
                return this.presentUserResult({
                    result: {
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
                    },
                    message,
                    requestContext,
                    nextAction: pendingPlan.summary || '',
                    source: 'run_message_classify_pending_plan'
                });
            }
            const apiConfirmed = request.confirmed === true || requestContext.approved === true;
            if (explicitPlanId && !apiConfirmed && !confirmedByMessage) {
                const displayText = '执行待确认计划需要明确确认：请回复“确认执行”，或在 API 调用里设置 context.approved=true。';
                return this.presentUserResult({
                    result: {
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
                    },
                    message,
                    requestContext,
                    nextAction: pendingPlan.summary || '',
                    source: 'run_message_needs_plan_approval'
                });
            }

            const runRecord = {
                runId,
                sessionId,
                startedAt,
                mode: 'task',
                intent: 'plan_confirmation',
                stepCount: pendingPlan.steps.length
            };
            this.setActiveRun(runId, runRecord);
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
                return this.presentUserResult({
                    result,
                    message,
                    requestContext
                });
            } finally {
                this.activeRuns.delete(runId);
                this.completedRunCount += 1;
            }
        }

        if (!request.classifyOnly && shouldUseLlmAgent(request, requestContext)) {
            this.setActiveRun(runId, {
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
                return this.presentUserResult({
                    result: llmResult,
                    message,
                    requestContext
                });
            }
            this.activeRuns.delete(runId);
        }
        const plan = planMessage(message);
        const mode = getPlanMode(plan);
        const executionRequired = plan.steps.length > 0;
        if (request.classifyOnly === true) {
            return this.presentUserResult({
                result: {
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
                },
                message,
                requestContext,
                source: 'run_message_rule_classify'
            });
        }
        const runRecord = {
            runId,
            sessionId,
            startedAt,
            mode,
            intent: plan.intent,
            stepCount: plan.steps.length
        };
        this.setActiveRun(runId, runRecord);
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
        const isRuleRunInterrupted = () => this.getRunInterruptState(runId).interrupted;

        try {
            if (!dryRun) {
                const toolContext = buildToolContext(requestContext, this.workspaceRoot, sessionId);
                for (const step of plan.steps) {
                    if (isRuleRunInterrupted()) {
                        status = 'interrupted';
                        break;
                    }
                    this.gateway.emitGatewayEvent?.('agent.step.started', {
                        runId,
                        stepId: step.id,
                        title: step.title,
                        tool: step.tool,
                        args: step.args
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
                    if (isRuleRunInterrupted()) {
                        status = 'interrupted';
                        break;
                    }
                }
            } else if (plan.steps.length) {
                status = 'planned';
            }

            if (status === 'interrupted') {
                this.gateway.emitGatewayEvent?.('agent.run.interrupted', {
                    runId,
                    sessionId,
                    status,
                    mode,
                    intent: plan.intent,
                    stepCount: stepResults.length,
                    durationMs: Date.now() - startedAt
                });
            }
            const displayText = status === 'interrupted'
                ? '已中断当前任务。已经完成的步骤和对话记录会保留，后续可以从分析记录里查看。'
                : formatRunResponse({ plan, stepResults, status, dryRun });
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
            return this.presentUserResult({
                result,
                message,
                requestContext,
                source: 'run_message_rule_result'
            });
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
            return this.presentUserResult({
                result,
                message,
                requestContext,
                nextAction: '重新整理下一步',
                source: 'run_message_rule_error'
            });
        } finally {
            this.activeRuns.delete(runId);
            this.completedRunCount += 1;
        }
    }
}

module.exports = {
    HumanClawAgentRunner,
    planMessage,
    attachAgentEvidenceArtifacts,
    buildAgentDirectToolSpecs,
    buildAgentEvidenceArtifactsPromptObject,
    buildFinalAnswerNativeToolSpec,
    buildLosslessToolObservationDigest,
    buildToolResultEvent,
    isExactAnswerExecutionMode,
    normalizeExactAnswerSubmission,
    validateExactAnswerSubmission,
    resolveAgentDecisionTimeoutMs
};
