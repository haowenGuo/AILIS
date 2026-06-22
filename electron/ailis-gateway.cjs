const http = require('http');
const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');
const { EventEmitter } = require('events');
const { randomUUID } = require('crypto');
const { pathToFileURL } = require('url');
const { approxTokenCount } = require('./ailis-runtime-budget.cjs');

const {
    OPENCLAW_CORE_TOOL_DEFINITIONS,
    OPENCLAW_OPTIONAL_RUNTIME_TOOL_DEFINITIONS,
    OPENCLAW_CHANNEL_MCP_TOOL_DEFINITIONS,
    getOpenClawToolSurfaceSummary,
    validateOpenClawToolSurface
} = require('./openclaw-tool-surface.cjs');
const { OpenClawRuntimeSupervisor } = require('./openclaw-runtime.cjs');
const { AILISRuntime } = require('./ailis-runtime.cjs');
const {
    TOOL_EXPOSURE,
    AILISRuntimeTool,
    AILISToolRuntimeRegistry
} = require('./ailis-tool-runtime.cjs');
const { createAILISPlatformAdapter } = require('./ailis-platform-adapter.cjs');
const { AILISAgentRunner } = require('./ailis-agent-runner.cjs');
const { AILISMemoryRuntime } = require('./ailis-memory-store.cjs');
const { AilisSelfEvolutionRuntime } = require('./ailis-self-evolution-runtime.cjs');
const {
    listToolContracts,
    validateToolContract
} = require('./ailis-tool-contracts.cjs');
const EMAIL_TOOL_ID = 'email';
const { FILE_MANAGER_TOOL_ID, executeFileManagerTool } = require('./ailis-file-manager-tool.cjs');
const { COMPUTER_TOOL_ID, AILISComputerTool } = require('./ailis-computer-tool.cjs');
const { CODE_TOOL_ID, executeCodeTool } = require('./ailis-code-tool.cjs');
const { ARTIFACT_VERIFIER_TOOL_ID, executeArtifactVerifierTool } = require('./ailis-artifact-verifier-tool.cjs');
const { GITHUB_PAGES_TOOL_ID, executeGitHubPagesTool } = require('./ailis-github-pages-tool.cjs');
const {
    READ_XLSX_WORKBOOK_TOOL_ID,
    executeReadXlsxWorkbookTool
} = require('./ailis-xlsx-workbook-tool.cjs');
const {
    AILIS_VISION_TOOL_DEFINITION,
    VISION_TOOL_ID,
    executeVisionTool
} = require('./ailis-vision-tool.cjs');
const {
    isExternalVirtualToolId
} = require('./ailis-tool-acquisition-gateway.cjs');
const {
    buildToolRoutingAdvice,
    rankToolSearchResults,
    toolMatchesRoutingProfile
} = require('./ailis-tool-routing.cjs');
const {
    createAilisDirectMcpToolSpec
} = require('./ailis-mcp-adapter.cjs');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const DEFAULT_PORT = Number(process.env.AILIS_GATEWAY_PORT || 19777);
const DEFAULT_TOOL_GATEWAY_URL =
    process.env.AILIS_TOOL_OPENCLAW_GATEWAY_URL || 'ws://127.0.0.1:18789';
const MAX_BODY_BYTES = 1024 * 1024;
const TOOL_CALL_TIMEOUT_MS = 45000;
const DEFAULT_EVENT_REPLAY_LIMIT = 2000;
const MAX_EVENT_REPLAY_LIMIT = 10000;
const MAX_SSE_WRITABLE_BYTES = 1024 * 1024;

const GATEWAY_BACKED_TOOL_IDS = new Set(['sessions_list', 'gateway', 'cron', 'nodes']);
const SESSION_BOUND_TOOL_IDS = new Set([
    'session_status',
    'sessions_history',
    'sessions_send',
    'sessions_spawn',
    'sessions_yield'
]);
const EXTERNAL_SIDE_EFFECT_TOOL_IDS = new Set([
    'browser',
    'canvas',
    'image',
    'image_generate',
    'music_generate',
    'video_generate',
    'pdf',
    'memory_search',
    'memory_get'
]);
const PLUGIN_OR_TRIGGER_TOOL_IDS = new Set(['code_execution', 'x_search', 'heartbeat_respond']);
const FILE_TOOL_IDS = new Set(['read', 'write', 'edit']);
const LOCAL_CORE_TOOL_IDS = new Set(['read', 'write', 'exec', 'apply_patch']);
const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);
const LOSSLESS_EVENT_TYPES = new Set([
    'gateway.started',
    'gateway.stopped',
    'runtime.item',
    'tool.call.begin',
    'tool.call.success',
    'tool.call.failure',
    'tool.call.started',
    'tool.call.finished',
    'agent.run.started',
    'agent.run.finished',
    'agent.step.started',
    'agent.step.finished',
    'agent.progress.note',
    'agent.plan.updated',
    'context_artifact.created',
    'subagent.event',
    'mcp.tool.call.begin',
    'mcp.tool.call.end',
    'mcp.resource.read.begin',
    'mcp.resource.read.end'
]);
const LOSSLESS_EVENT_PREFIXES = ['approval.', 'subagent.', 'mcp.', 'agent.'];
const CODEX_STYLE_DIRECT_LOCAL_TOOL_IDS = new Set([
    COMPUTER_TOOL_ID,
    'read',
    'write',
    'exec',
    'apply_patch'
]);
const AILIS_LOCAL_TOOL_DEFINITIONS = Object.freeze([
    Object.freeze({
        id: EMAIL_TOOL_ID,
        label: 'email',
        description: 'Manage QQ Mail, Gmail, and Outlook mailboxes through IMAP/SMTP.',
        sectionId: 'email',
        route: 'ailis-local',
        materialized: true,
        status: 'available',
        needsApprovalActions: Object.freeze(['send', 'mark_read', 'mark_unread', 'move', 'delete'])
    }),
    Object.freeze({
        id: FILE_MANAGER_TOOL_ID,
        label: 'file_manager',
        description: 'Scan, organize, and safely clean junk files with dry-run and quarantine-first execution.',
        sectionId: 'file-management',
        route: 'ailis-local',
        materialized: true,
        status: 'available',
        needsApprovalActions: Object.freeze(['clean', 'organize'])
    }),
    Object.freeze({
        id: COMPUTER_TOOL_ID,
        label: 'computer',
        description: 'Full local computer operation layer: filesystem, binary streams, watchers, rollback, shell sessions, and optional PTY.',
        sectionId: 'computer',
        route: 'ailis-local',
        materialized: true,
        status: 'available',
        needsApprovalActions: Object.freeze([
            'write',
            'write_binary',
            'append',
            'mkdir',
            'copy',
            'move',
            'rename',
            'delete',
            'acl_set',
            'exec',
            'exec_command',
            'session_start',
            'pty_start',
            'pty_write',
            'pty_kill',
            'write_stdin',
            'process_write',
            'process_kill',
            'rollback_restore'
        ])
    }),
    Object.freeze({
        id: CODE_TOOL_ID,
        label: 'code',
        description: 'Code operation layer: Git, code search, symbol index, AST refactor, TypeScript diagnostics, PR and CI hooks.',
        sectionId: 'code',
        route: 'ailis-local',
        materialized: true,
        status: 'available',
        needsApprovalActions: Object.freeze(['git_commit', 'rename_symbol', 'test', 'pr_create'])
    }),
    Object.freeze({
        id: ARTIFACT_VERIFIER_TOOL_ID,
        label: 'artifact_verifier',
        description: 'Read-only structured artifact verification for JSON/JSONL/CSV/TSV/YAML/TOML/Markdown/log/text files.',
        sectionId: 'artifact-verification',
        route: 'ailis-local',
        materialized: true,
        status: 'available',
        needsApprovalActions: Object.freeze([])
    }),
    Object.freeze({
        id: READ_XLSX_WORKBOOK_TOOL_ID,
        label: 'read_xlsx_workbook',
        description: 'Read local XLSX/XLSM workbooks as structured sheets, cells, formulas, merged ranges, fill colors, and compact grids. Use for Excel attachments before ad hoc Python or raw binary reads.',
        sectionId: 'spreadsheet-reading',
        route: 'ailis-local',
        materialized: true,
        status: 'available',
        needsApprovalActions: Object.freeze([])
    }),
    Object.freeze({
        id: GITHUB_PAGES_TOOL_ID,
        label: 'github_pages',
        description: 'Read-only GitHub Pages and gh-pages deployment diagnostics with blockers and verification evidence.',
        sectionId: 'github-pages',
        route: 'ailis-local',
        materialized: true,
        status: 'available',
        needsApprovalActions: Object.freeze([])
    }),
    AILIS_VISION_TOOL_DEFINITION
]);

let emailToolModule = null;
let emailToolLoadError = null;

function loadEmailToolModule() {
    if (emailToolModule) {
        return emailToolModule;
    }
    if (emailToolLoadError) {
        throw emailToolLoadError;
    }
    try {
        emailToolModule = require('./ailis-email-tool.cjs');
        return emailToolModule;
    } catch (error) {
        emailToolLoadError = error;
        throw error;
    }
}

function shouldIncludeDirectToolInSearch(entry, query, includeDirect) {
    if (includeDirect || entry.exposure !== TOOL_EXPOSURE.DIRECT) {
        return true;
    }
    return toolMatchesRoutingProfile(entry, query);
}

function safeListEmailProviderDetails() {
    try {
        return loadEmailToolModule().listProviderDetails();
    } catch (error) {
        return {
            error: error?.message || String(error),
            providers: {}
        };
    }
}

class GatewayHttpError extends Error {
    constructor(statusCode, code, message, details = undefined) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.details = details;
    }
}

function normalizeString(value, fallback = '') {
    if (typeof value !== 'string') {
        return fallback;
    }
    const trimmed = value.trim();
    return trimmed || fallback;
}

function parseEventCursor(value, fallback = 0) {
    const text = Array.isArray(value) ? value[0] : value;
    const raw = normalizeString(String(text || ''), '');
    const match = raw.match(/(\d+)$/);
    const seq = match ? Number(match[1]) : Number(raw);
    return Number.isFinite(seq) && seq >= 0 ? seq : fallback;
}

function isLosslessGatewayEvent(type) {
    const eventType = normalizeString(type);
    return LOSSLESS_EVENT_TYPES.has(eventType) || LOSSLESS_EVENT_PREFIXES.some((prefix) => eventType.startsWith(prefix));
}

function formatSseEvent(event) {
    return [
        `id: ${event.seq}`,
        `event: ${event.type}`,
        `data: ${JSON.stringify(event)}`,
        '',
        ''
    ].join('\n');
}

function isPathInside(rootPath, targetPath) {
    return createAILISPlatformAdapter().isPathInside(rootPath, targetPath);
}

function summarize(value, maxChars = 600) {
    let text = '';
    try {
        text = typeof value === 'string' ? value : JSON.stringify(value);
    } catch {
        text = String(value);
    }
    if (text === undefined || text === null) {
        text = '';
    }
    text = text.replace(/\s+/g, ' ').trim();
    return text.length > maxChars ? `${text.slice(0, maxChars - 3)}...` : text;
}

function isSafeTokenMetricKey(key = '') {
    return /^(prompt|completion|input|output|total|reasoning|cached|candidates)Tokens$/i.test(key) ||
        /^(prompt|completion|input|output|total|reasoning|cached)_tokens$/i.test(key) ||
        /^(prompt|completion|total|candidates)TokenCount$/i.test(key) ||
        /(^|_)token_count$|^max_output_tokens$/i.test(key);
}

function redactObject(value) {
    if (Array.isArray(value)) {
        return value.map((entry) => redactObject(entry));
    }
    if (!value || typeof value !== 'object') {
        return value;
    }

    const redacted = {};
    for (const [key, entry] of Object.entries(value)) {
        const isSafeTokenMetric = isSafeTokenMetricKey(key);
        if (!isSafeTokenMetric && /token|password|secret|api[_-]?key|authorization|credential|pass|auth[_-]?code/i.test(key)) {
            redacted[key] = '__REDACTED__';
        } else {
            redacted[key] = redactObject(entry);
        }
    }
    return redacted;
}

function createTimeoutError(ms) {
    const error = new Error(`tool call timeout after ${ms}ms`);
    error.code = 'AILIS_GATEWAY_TIMEOUT';
    return error;
}

async function withTimeout(ms, action) {
    let timer = null;
    try {
        return await Promise.race([
            action(),
            new Promise((_, reject) => {
                timer = setTimeout(() => reject(createTimeoutError(ms)), ms);
            })
        ]);
    } finally {
        if (timer) {
            clearTimeout(timer);
        }
    }
}

function extractToolResultText(result) {
    const chunks = [];
    for (const part of Array.isArray(result?.content) ? result.content : []) {
        if (typeof part?.text === 'string') {
            chunks.push(part.text);
        }
    }
    if (result?.details) {
        chunks.push(summarize(result.details, 1200));
    }
    return chunks.join('\n');
}

function classifyToolResult(result) {
    if (typeof result?.details?.status === 'string') {
        return result.details.status;
    }
    const text = extractToolResultText(result);
    if (/missing_.*key|api key|not configured|no provider registered|TTS conversion failed/i.test(text)) {
        return 'needs_config';
    }
    if (/pairing required/i.test(text)) {
        return 'needs_pairing';
    }
    if (/No session context|Unknown sessionKey|sessionKey required/i.test(text)) {
        return 'needs_session';
    }
    if (result?.isError) {
        return 'error';
    }
    return 'completed';
}

function makeExternalVirtualToolResult(result = {}, { toolId = '' } = {}) {
    const status = normalizeString(result.status, result.ok === false ? 'error' : 'completed');
    return {
        isError: result.ok === false || status !== 'completed',
        content: [
            {
                type: 'text',
                text: summarize(result, 6000)
            }
        ],
        details: {
            ...result,
            status,
            toolId: result.toolId || toolId
        },
        structuredContent: result
    };
}

function classifyError(error) {
    const message = error instanceof Error ? error.message : String(error);
    if (error?.code === 'AILIS_GATEWAY_APPROVAL_REQUIRED') {
        return 'needs_approval';
    }
    if (error?.code === 'AILIS_GATEWAY_BLOCKED') {
        return 'blocked';
    }
    if (/missing_.*key|api key|not configured|no provider registered/i.test(message)) {
        return 'needs_config';
    }
    if (/sessionKey required|Unknown sessionKey|No session context|task required/i.test(message)) {
        return 'needs_session';
    }
    if (/pairing required/i.test(message)) {
        return 'needs_pairing';
    }
    if (/gateway.*(closed|timeout|ECONNREFUSED|not connected)|Not connected/i.test(message)) {
        return 'needs_gateway';
    }
    return 'error';
}

function analysisTimestamp(value = {}) {
    const numericTs = Number(value.ts || value.startedAt || value.completedAt || 0);
    if (Number.isFinite(numericTs) && numericTs > 0) {
        return numericTs;
    }
    const parsed = Date.parse(value.iso || value.createdAt || value.updatedAt || '');
    return Number.isFinite(parsed) ? parsed : 0;
}

function analysisIso(value = {}) {
    const ts = analysisTimestamp(value);
    return ts ? new Date(ts).toISOString() : '';
}

function usageMetric(usage = {}, keys = []) {
    if (!usage || typeof usage !== 'object') {
        return null;
    }
    for (const key of keys) {
        const value = key.split('.').reduce((current, part) => current?.[part], usage);
        const numericValue = Number(value);
        if (Number.isFinite(numericValue)) {
            return numericValue;
        }
    }
    return null;
}

function normalizeUsageForAnalysis(usage = {}) {
    if (!usage || typeof usage !== 'object') {
        return null;
    }
    const promptTokens = usageMetric(usage, ['promptTokens', 'prompt_tokens', 'input_tokens', 'promptTokenCount']);
    const completionTokens = usageMetric(usage, ['completionTokens', 'completion_tokens', 'output_tokens', 'candidatesTokenCount']);
    const totalTokens = usageMetric(usage, ['totalTokens', 'total_tokens', 'totalTokenCount']);
    const reasoningTokens = usageMetric(usage, [
        'reasoningTokens',
        'completion_tokens_details.reasoning_tokens',
        'output_tokens_details.reasoning_tokens'
    ]);
    const cachedTokens = usageMetric(usage, [
        'cachedTokens',
        'prompt_tokens_details.cached_tokens',
        'input_tokens_details.cached_tokens'
    ]);
    return {
        promptTokens,
        completionTokens,
        totalTokens: totalTokens ?? (
            Number.isFinite(promptTokens) || Number.isFinite(completionTokens)
                ? Number(promptTokens || 0) + Number(completionTokens || 0)
                : null
        ),
        reasoningTokens,
        cachedTokens
    };
}

function addUsageTotals(total, usage = {}) {
    const normalized = normalizeUsageForAnalysis(usage);
    if (!normalized) {
        return total;
    }
    for (const key of ['promptTokens', 'completionTokens', 'totalTokens', 'reasoningTokens', 'cachedTokens']) {
        const numericValue = Number(normalized[key]);
        if (Number.isFinite(numericValue)) {
            total[key] += numericValue;
        }
    }
    return total;
}

function getPayloadIteration(payload = {}) {
    const value = Number(payload.iteration ?? payload.context?.iteration ?? payload.args?.iteration);
    return Number.isFinite(value) ? value : null;
}

function summarizeForAnalysis(value, maxChars = 1800) {
    return summarize(value, maxChars);
}

function timelineKind(type = '') {
    if (/context_snapshot|prompt_budget|context_artifact/.test(type)) {
        return 'context';
    }
    if (/llm_call|token_usage/.test(type)) {
        return 'llm';
    }
    if (/tool\./.test(type)) {
        return 'tool';
    }
    if (/decision|reasoning|capability/.test(type)) {
        return 'agent';
    }
    if (/final|blocked|completed/.test(type)) {
        return 'result';
    }
    return 'runtime';
}

function timelineTitle(type = '', payload = {}) {
    const iteration = getPayloadIteration(payload);
    const prefix = Number.isFinite(iteration) ? `轮次 ${iteration + 1} · ` : '';
    if (type === 'agent.context_snapshot') {
        return `${prefix}完整上下文`;
    }
    if (type === 'agent.llm_call') {
        return `${prefix}LLM 决策 ${payload.model || payload.provider || ''}`.trim();
    }
    if (type === 'agent.decision') {
        return `${prefix}Agent 决策 ${payload.action || payload.status || ''}`.trim();
    }
    if (type === 'tool.call') {
        return `${prefix}工具开始 ${payload.tool || ''}`.trim();
    }
    if (type === 'tool.result') {
        return `${prefix}工具结果 ${payload.tool || ''}`.trim();
    }
    if (type === 'agent.capability_context') {
        return `${prefix}能力上下文加载`;
    }
    if (type === 'context_artifact.created') {
        return `${prefix}上下文产物 ${payload.artifactId || ''}`.trim();
    }
    if (type === 'agent.progress_note') {
        return `${prefix}公开进展`;
    }
    if (type === 'agent.reasoning') {
        return `${prefix}推理摘要`;
    }
    if (type === 'agent.final') {
        return '最终答复';
    }
    if (type === 'agent.blocked') {
        return '运行阻塞';
    }
    return payload.title || payload.stage || type || 'runtime item';
}

function isRunAuditEntry(entry = {}, runId = '') {
    if (!entry || typeof entry !== 'object') {
        return false;
    }
    return entry.runId === runId ||
        entry.args?.runId === runId ||
        entry.context?.runId === runId ||
        entry.result?.runId === runId;
}

function isRunGatewayEvent(event = {}, runId = '') {
    const payload = event?.payload || {};
    return payload.runId === runId ||
        payload.context?.runId === runId ||
        payload.result?.runId === runId ||
        payload.args?.runId === runId;
}

function throwBlocked(message, details = undefined) {
    const error = new Error(message);
    error.code = 'AILIS_GATEWAY_BLOCKED';
    error.details = details;
    throw error;
}

function throwApprovalRequired(message, details = undefined) {
    const error = new Error(message);
    error.code = 'AILIS_GATEWAY_APPROVAL_REQUIRED';
    error.details = details;
    throw error;
}

function buildSmokeStatusMap(reportPath) {
    try {
        const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
        const map = new Map();
        for (const result of Array.isArray(report.results) ? report.results : []) {
            if (result?.id && !String(result.id).includes(':')) {
                map.set(result.id, {
                    status: result.status || 'unknown',
                    check: result.check || '',
                    materialized: Boolean(result.materialized)
                });
            }
        }
        return {
            ok: Boolean(report.summary?.ok),
            generatedAt: report.generatedAt || '',
            path: reportPath,
            map
        };
    } catch {
        return {
            ok: false,
            generatedAt: '',
            path: reportPath,
            map: new Map()
        };
    }
}

function buildGatewayConfig() {
    return {
        browser: { enabled: true },
        plugins: {
            entries: {
                browser: { enabled: true }
            }
        },
        tools: {
            profile: 'full',
            experimental: {
                planTool: true
            }
        },
        agents: {
            defaults: {
                imageModel: { primary: 'openai/gpt-5.4' },
                imageGenerationModel: { primary: 'openai/gpt-image-1' },
                videoGenerationModel: { primary: 'openai/sora-2' },
                musicGenerationModel: { primary: 'suno/default' },
                pdfModel: { primary: 'anthropic/claude-sonnet-4-6' }
            }
        }
    };
}

class AILISGateway extends EventEmitter {
    constructor(options = {}) {
        super();
        this.app = options.app;
        this.projectRoot = path.resolve(options.projectRoot || PROJECT_ROOT);
        this.workspaceRoot = path.resolve(options.workspaceRoot || this.projectRoot);
        this.port = options.port === undefined ? DEFAULT_PORT : Number(options.port);
        this.host = normalizeString(options.host, '127.0.0.1');
        this.toolGatewayUrl = normalizeString(options.toolGatewayUrl, DEFAULT_TOOL_GATEWAY_URL);
        this.auditDir = path.resolve(
            options.auditDir ||
                (this.app?.getPath?.('userData')
                    ? path.join(this.app.getPath('userData'), 'ailis-gateway')
                    : path.join(this.projectRoot, 'tmp', 'ailis-gateway'))
        );
        this.auditLogPath = path.join(this.auditDir, 'audit.jsonl');
        this.smokeReportPath = path.join(this.projectRoot, 'tmp', 'openclaw-tool-smoke', 'last-report.json');
        this.platformAdapter = createAILISPlatformAdapter(options.platformAdapter || options.platform || {});
        this.runtime = new AILISRuntime({
            auditDir: this.auditDir,
            workspaceRoot: this.workspaceRoot,
            projectRoot: this.projectRoot,
            platformAdapter: this.platformAdapter,
            emitGatewayEvent: (type, payload) => this.emitGatewayEvent(type, payload),
            mcpServers: options.mcpServers,
            mcpConfigPath: options.mcpConfigPath || path.join(this.auditDir, 'mcp-servers.json'),
            subagentExecutor: (payload) => this.executeSubagentTask(payload)
        });
        this.server = null;
        this.startedAt = 0;
        this.sseClients = new Set();
        this.eventSeq = 0;
        this.eventLog = [];
        this.eventLogLimit = Math.max(
            100,
            Math.min(Number(options.eventLogLimit || DEFAULT_EVENT_REPLAY_LIMIT), MAX_EVENT_REPLAY_LIMIT)
        );
        this.toolRuntimeModulePromise = null;
        this.toolSets = new Map();
        this.toolRuntimeSupervisor = null;
        this.computerTool = new AILISComputerTool({
            workspaceRoot: this.workspaceRoot,
            platformAdapter: this.platformAdapter
        });
        this.getEmailProfiles = typeof options.getEmailProfiles === 'function'
            ? options.getEmailProfiles
            : () => options.emailProfiles || {};
        this.getDefaultToolContext = typeof options.getDefaultContext === 'function'
            ? options.getDefaultContext
            : () => options.defaultContext || {};
        this.visionServices = options.visionServices || {};
        this.memoryRuntime = options.memoryRuntime || new AILISMemoryRuntime({
            rootDir: path.join(this.auditDir, 'memory'),
            workspaceRoot: this.workspaceRoot
        });
        this.selfEvolutionRuntime = options.selfEvolutionRuntime || new AilisSelfEvolutionRuntime({
            auditDir: this.auditDir,
            workspaceRoot: this.workspaceRoot,
            projectRoot: this.projectRoot,
            runtime: this.runtime,
            memoryRuntime: this.memoryRuntime,
            emitGatewayEvent: (type, payload) => this.emitGatewayEvent(type, payload)
        });
        this.runtime.setSelfEvolutionRuntime?.(this.selfEvolutionRuntime);
        this.gatewayToolRuntimeRegistry = this.createGatewayToolRuntimeRegistry();
        this.agentRunner = null;
    }

    createGatewayToolRuntimeRegistry() {
        const registry = new AILISToolRuntimeRegistry({ runtime: this.runtime });
        const localDefinitions = [
            ...AILIS_LOCAL_TOOL_DEFINITIONS.map((definition) => ({
                ...definition,
                exposure: CODEX_STYLE_DIRECT_LOCAL_TOOL_IDS.has(definition.id)
                    ? TOOL_EXPOSURE.DIRECT
                    : TOOL_EXPOSURE.DEFERRED
            })),
            ...['read', 'write', 'exec', 'apply_patch'].map((id) => {
                const openClawDefinition = OPENCLAW_CORE_TOOL_DEFINITIONS.find((tool) => tool.id === id) || {};
                return {
                    id,
                    label: openClawDefinition.label || id,
                    description: openClawDefinition.description || `Local core ${id} tool.`,
                    sectionId: openClawDefinition.sectionId || 'local-core',
                    route: 'ailis-local-core',
                    materialized: true,
                    status: 'available',
                    needsApprovalActions: id === 'exec' ? Object.freeze(['exec']) : id === 'apply_patch' ? Object.freeze(['apply_patch']) : Object.freeze([]),
                    exposure: TOOL_EXPOSURE.DIRECT
                };
            })
        ];
        for (const definition of localDefinitions) {
            registry.register(new AILISRuntimeTool({
                definition,
                handle: async (args, context) => this.executeGatewayLocalTool(definition.id, args, context)
            }));
        }
        for (const definition of this.runtime.getRuntimeToolDefinitions()) {
            if (definition.id === 'tool_search') {
                registry.register(new AILISRuntimeTool({
                    definition: {
                        ...definition,
                        route: 'ailis-gateway',
                        description: 'Tool discovery. Searches over deferred tool metadata with BM25 and exposes matching tools for the next Agent step.',
                        exposure: TOOL_EXPOSURE.DIRECT
                    },
                    handle: async (args) => this.executeGatewayToolSearch(args)
                }));
                continue;
            }
            registry.register(new AILISRuntimeTool({
                definition: {
                    ...definition,
                    route: definition.route || 'ailis-runtime'
                },
                handle: async (args, context) => this.runtime.executeTool(definition.id, args, context)
            }));
        }
        return registry;
    }

    async executeGatewayToolSearch(args = {}) {
        const query = normalizeString(args.query || args.q);
        const limit = Math.max(1, Math.min(Number(args.limit || 12), 50));
        const includeDirect = args.includeDirect === true;
        const local = this.gatewayToolRuntimeRegistry.search(query, limit)
            .filter((entry) => shouldIncludeDirectToolInSearch(entry, query, includeDirect))
            .map((entry) => ({
                id: entry.id,
                type: 'gateway_or_runtime_tool',
                exposure: entry.exposure,
                spec: entry.spec
            }));
        let mcp = [];
        if (args.includeMcp !== false && this.runtime?.mcpManager?.searchToolSpecs) {
            try {
                mcp = (await this.runtime.mcpManager.searchToolSpecs({
                    query,
                    limit,
                    timeoutMs: args.timeoutMs
                })).map((spec) => createAilisDirectMcpToolSpec({
                    id: spec.id,
                    server: spec.server,
                    tool: spec.tool || spec.name,
                    name: spec.name,
                    title: spec.title,
                    description: spec.description || spec.title || '',
                    inputSchema: spec.inputSchema || spec.input_schema || spec.parameters || {},
                    schemaProperties: spec.schemaProperties || spec.schema_properties,
                    callPattern: spec.callPattern || spec.call_pattern
                }));
            } catch (error) {
                mcp = [{
                    type: 'mcp_tool_search_error',
                    error: error?.message || String(error)
                }];
            }
        }
        let external = [];
        if (args.includeExternal !== false && this.runtime?.capabilityManager?.searchExternalToolEntries) {
            try {
                const searched = await this.runtime.capabilityManager.searchExternalToolEntries({
                    query,
                    limit,
                    includeExposed: args.includeExposed !== false,
                    includeContracts: args.includeContracts !== false
                });
                external = Array.isArray(searched.tools) ? searched.tools : [];
            } catch (error) {
                external = [{
                    type: 'external_tool_search_error',
                    error: error?.message || String(error)
                }];
            }
        }
        const tools = rankToolSearchResults([...external, ...local, ...mcp], query, limit);
        const routingAdvice = buildToolRoutingAdvice(query, tools);
        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify({
                        status: 'completed',
                        query,
                        routing_advice: routingAdvice,
                        tools
                    }, null, 2)
                }
            ],
            details: {
                status: 'completed',
                query,
                routing_advice: routingAdvice,
                tools
            },
            structuredContent: {
                status: 'completed',
                query,
                routing_advice: routingAdvice,
                tools
            }
        };
    }

    resolveDefaultContext() {
        try {
            const context = this.getDefaultToolContext();
            return context && typeof context === 'object' ? context : {};
        } catch {
            return {};
        }
    }

    mergeDefaultContext(context = {}) {
        const requestContext = context && typeof context === 'object' ? context : {};
        return {
            ...this.resolveDefaultContext(),
            ...requestContext
        };
    }

    async start() {
        if (this.server) {
            return this.getStatus();
        }

        await fsp.mkdir(this.auditDir, { recursive: true });
        this.server = http.createServer((req, res) => {
            this.handleHttpRequest(req, res).catch((error) => {
                this.sendJson(res, error.statusCode || 500, {
                    ok: false,
                    status: error.code || 'internal_error',
                    error: error.message || String(error),
                    ...(error.details ? { details: error.details } : {})
                });
            });
        });

        await new Promise((resolve, reject) => {
            this.server.once('error', reject);
            this.server.listen(this.port, this.host, () => {
                this.server.off('error', reject);
                this.startedAt = Date.now();
                resolve();
            });
        });

        this.emitGatewayEvent('gateway.started', this.getStatus());
        return this.getStatus();
    }

    async stop() {
        for (const client of this.sseClients) {
            try {
                client.res?.end?.();
            } catch {}
        }
        this.sseClients.clear();

        if (this.toolRuntimeSupervisor) {
            await this.toolRuntimeSupervisor.shutdown().catch(() => {});
            this.toolRuntimeSupervisor = null;
        }

        if (this.computerTool) {
            await this.computerTool.shutdown().catch(() => {});
        }

        if (this.runtime) {
            await this.runtime.shutdown().catch(() => {});
        }

        if (!this.server) {
            return this.getStatus();
        }

        const server = this.server;
        this.server = null;
        await new Promise((resolve) => server.close(resolve));
        this.emitGatewayEvent('gateway.stopped', {});
        return this.getStatus();
    }

    getAddress() {
        const address = this.server?.address?.();
        if (address && typeof address === 'object') {
            return {
                host: address.address,
                port: address.port,
                url: `http://${address.address === '::' ? '127.0.0.1' : address.address}:${address.port}`
            };
        }
        return {
            host: this.host,
            port: this.port,
            url: `http://${this.host}:${this.port}`
        };
    }

    getStatus() {
        const address = this.getAddress();
        const gatewayToolDefinitions = this.gatewayToolRuntimeRegistry?.listDefinitions?.() || [];
        const directGatewayTools = this.gatewayToolRuntimeRegistry?.modelVisibleSpecs?.() || [];
        return {
            enabled: true,
            running: Boolean(this.server),
            startedAt: this.startedAt,
            host: address.host,
            port: address.port,
            url: address.url,
            workspaceRoot: this.workspaceRoot,
            platform: this.platformAdapter.getStatus(),
            auditLogPath: this.auditLogPath,
            toolGatewayUrl: this.toolGatewayUrl,
            openClawToolSurface: getOpenClawToolSurfaceSummary(),
            openClawToolSurfaceValidation: validateOpenClawToolSurface().summary,
            toolContracts: {
                version: 1,
                count: listToolContracts().length
            },
            toolRuntime: {
                model: 'codex_like_gateway_tool_registry',
                registeredToolCount: gatewayToolDefinitions.length,
                directToolCount: directGatewayTools.length,
                deferredToolCount: gatewayToolDefinitions.filter((tool) => tool.exposure === TOOL_EXPOSURE.DEFERRED).length
            },
            defaultContext: redactObject(this.resolveDefaultContext()),
            runtime: this.runtime.getStatus(),
            memory: this.memoryRuntime?.getStatus?.() || null,
            selfEvolution: this.selfEvolutionRuntime?.getStatus?.() || null,
            toolRuntimeGateway: this.toolRuntimeSupervisor?.getStatus?.() || null,
            agentRunner: this.ensureAgentRunner().getStatus(),
            events: {
                seq: this.eventSeq,
                buffered: this.eventLog.length,
                bufferLimit: this.eventLogLimit,
                clients: this.sseClients.size
            }
        };
    }

    ensureAgentRunner() {
        if (!this.agentRunner) {
            this.agentRunner = new AILISAgentRunner({
                gateway: this,
                workspaceRoot: this.workspaceRoot,
                memoryRuntime: this.memoryRuntime
            });
        }
        return this.agentRunner;
    }

    getMemorySnapshot(options = {}) {
        return this.memoryRuntime?.getSnapshot?.(options) || {
            ok: false,
            status: 'memory_not_configured'
        };
    }

    searchMemory(query, options = {}) {
        return this.memoryRuntime?.searchMemory?.(query, options) || {
            ok: false,
            status: 'memory_not_configured',
            events: []
        };
    }

    updateMemoryBlock(key, value) {
        return this.memoryRuntime?.updateBlock?.(key, value) || {
            ok: false,
            status: 'memory_not_configured'
        };
    }

    resetMemoryAffinity(score) {
        return this.memoryRuntime?.resetAffinity?.(score) || {
            ok: false,
            status: 'memory_not_configured'
        };
    }

    clearMemory(payload = {}) {
        return this.memoryRuntime?.clearMemory?.(payload) || {
            ok: false,
            status: 'memory_not_configured'
        };
    }

    forgetMemory(payload = {}) {
        return this.memoryRuntime?.forgetMemory?.(payload) || {
            ok: false,
            status: 'memory_not_configured'
        };
    }

    saveMemorySecret(payload = {}) {
        return this.memoryRuntime?.saveSecret?.(payload) || {
            ok: false,
            status: 'memory_not_configured'
        };
    }

    deleteMemorySecret(name) {
        return this.memoryRuntime?.deleteSecret?.(name) || {
            ok: false,
            status: 'memory_not_configured'
        };
    }

    async analyzeSelfEvolution(payload = {}) {
        await this.selfEvolutionRuntime?.ensureLoaded?.();
        return await this.selfEvolutionRuntime.analyze(payload || {});
    }

    async listSelfEvolutionProposals(payload = {}) {
        await this.selfEvolutionRuntime?.ensureLoaded?.();
        return await this.selfEvolutionRuntime.listProposals(payload || {});
    }

    async markSelfEvolutionProposal(payload = {}) {
        await this.selfEvolutionRuntime?.ensureLoaded?.();
        return await this.selfEvolutionRuntime.markProposal(payload || {});
    }

    async applySelfEvolutionProposal(payload = {}) {
        await this.selfEvolutionRuntime?.ensureLoaded?.();
        return await this.selfEvolutionRuntime.applyProposal(payload || {}, {
            approved: payload?.approved === true,
            source: payload?.source || 'gateway'
        });
    }

    emitGatewayEvent(type, payload = {}) {
        this.eventSeq += 1;
        const event = {
            id: `evt-${this.eventSeq}`,
            seq: this.eventSeq,
            ts: Date.now(),
            type,
            payload,
            delivery: isLosslessGatewayEvent(type) ? 'lossless' : 'best_effort'
        };
        this.eventLog.push(event);
        if (this.eventLog.length > this.eventLogLimit) {
            this.eventLog = this.eventLog.slice(-this.eventLogLimit);
        }
        this.emit('event', event);
        for (const client of this.sseClients) {
            this.writeGatewayEventToClient(client, event);
        }
    }

    getEventsAfter(cursor = 0, limit = this.eventLogLimit) {
        const boundedLimit = Math.max(1, Math.min(Number(limit) || this.eventLogLimit, this.eventLogLimit));
        return this.eventLog.filter((event) => event.seq > cursor).slice(-boundedLimit);
    }

    writeSseChunk(client, chunk) {
        if (!client || client.closed || !client.res?.writable) {
            return false;
        }
        if (client.res.writableLength > MAX_SSE_WRITABLE_BYTES) {
            client.closed = true;
            try {
                client.res.end();
            } catch {}
            this.sseClients.delete(client);
            return false;
        }
        const ok = client.res.write(chunk);
        if (!ok && !client.pendingDrain) {
            client.pendingDrain = true;
            client.res.once('drain', () => {
                client.pendingDrain = false;
                if (client.skipped > 0 && !client.closed) {
                    const skipped = client.skipped;
                    client.skipped = 0;
                    this.writeSseChunk(
                        client,
                        formatSseEvent({
                            id: `lag-${this.eventSeq}`,
                            seq: this.eventSeq,
                            ts: Date.now(),
                            type: 'gateway.lagged',
                            delivery: 'lossless',
                            payload: { skipped }
                        })
                    );
                }
            });
        }
        return ok;
    }

    writeGatewayEventToClient(client, event, options = {}) {
        if (!client || client.closed) {
            return;
        }
        const lossless = event.delivery === 'lossless' || isLosslessGatewayEvent(event.type);
        if (client.pendingDrain && !lossless && options.force !== true) {
            client.skipped += 1;
            return;
        }
        if (client.skipped > 0 && (lossless || options.force === true)) {
            const skipped = client.skipped;
            client.skipped = 0;
            this.writeSseChunk(
                client,
                formatSseEvent({
                    id: `lag-${event.seq}`,
                    seq: event.seq,
                    ts: Date.now(),
                    type: 'gateway.lagged',
                    delivery: 'lossless',
                    payload: { skipped }
                })
            );
        }
        this.writeSseChunk(client, formatSseEvent(event));
    }

    async handleHttpRequest(req, res) {
        this.applyCors(req, res);

        if (req.method === 'OPTIONS') {
            res.writeHead(204);
            res.end();
            return;
        }

        const url = new URL(req.url || '/', 'http://127.0.0.1');
        if (url.pathname === '/events' && req.method === 'GET') {
            this.handleEvents(req, res);
            return;
        }

        if (url.pathname === '/events/recent' && req.method === 'GET') {
            const cursor = parseEventCursor(url.searchParams.get('cursor') || url.searchParams.get('since'), 0);
            const limit = Math.max(1, Math.min(Number(url.searchParams.get('limit') || 100), this.eventLogLimit));
            this.sendJson(res, 200, {
                ok: true,
                cursor,
                latestSeq: this.eventSeq,
                events: this.getEventsAfter(cursor, limit)
            });
            return;
        }

        if (url.pathname === '/health' && req.method === 'GET') {
            this.sendJson(res, 200, {
                ok: true,
                status: this.getStatus()
            });
            return;
        }

        if ((url.pathname === '/tools' || url.pathname === '/tools/list') && req.method === 'GET') {
            this.sendJson(res, 200, await this.listTools());
            return;
        }

        if (url.pathname === '/tools/call' && req.method === 'POST') {
            const body = await this.readJsonBody(req);
            this.sendJson(res, 200, await this.callTool(body));
            return;
        }

        if (url.pathname === '/agent/run' && req.method === 'POST') {
            const body = await this.readJsonBody(req);
            this.sendJson(res, 200, await this.runAgent(body));
            return;
        }

        if (url.pathname === '/agent/interrupt' && req.method === 'POST') {
            const body = await this.readJsonBody(req);
            this.sendJson(res, 200, await this.interruptAgentRun(body));
            return;
        }

        if (url.pathname === '/agent/analysis/runs' && req.method === 'GET') {
            this.sendJson(
                res,
                200,
                await this.listAgentAnalysisRuns(Number(url.searchParams.get('limit') || 40))
            );
            return;
        }

        if (url.pathname === '/agent/analysis/run' && req.method === 'POST') {
            const body = await this.readJsonBody(req);
            this.sendJson(res, 200, await this.runAgentAnalysis(body));
            return;
        }

        if (url.pathname === '/agent/analysis/continue' && req.method === 'POST') {
            const body = await this.readJsonBody(req);
            this.sendJson(res, 200, await this.continueAgentAnalysis(body));
            return;
        }

        if (url.pathname === '/agent/analysis/interrupt' && req.method === 'POST') {
            const body = await this.readJsonBody(req);
            this.sendJson(res, 200, await this.interruptAgentRun(body));
            return;
        }

        if (url.pathname === '/agent/analysis' && req.method === 'GET') {
            this.sendJson(
                res,
                200,
                await this.analyzeAgentRun(
                    url.searchParams.get('runId') || '',
                    { transcriptLimit: Number(url.searchParams.get('limit') || 2000) }
                )
            );
            return;
        }

        if (url.pathname === '/self-evolution/analyze' && (req.method === 'GET' || req.method === 'POST')) {
            const body = req.method === 'POST' ? await this.readJsonBody(req) : {};
            this.sendJson(res, 200, await this.analyzeSelfEvolution({
                ...(body || {}),
                limit: body.limit || Number(url.searchParams.get('limit') || 80),
                taskText: body.taskText || url.searchParams.get('taskText') || url.searchParams.get('task') || ''
            }));
            return;
        }

        if (url.pathname === '/self-evolution/proposals' && req.method === 'GET') {
            this.sendJson(res, 200, await this.listSelfEvolutionProposals({
                limit: Number(url.searchParams.get('limit') || 80),
                status: url.searchParams.get('status') || '',
                type: url.searchParams.get('type') || ''
            }));
            return;
        }

        if (url.pathname === '/self-evolution/proposal/mark' && req.method === 'POST') {
            const body = await this.readJsonBody(req);
            this.sendJson(res, 200, await this.markSelfEvolutionProposal(body));
            return;
        }

        if (url.pathname === '/self-evolution/proposal/apply' && req.method === 'POST') {
            const body = await this.readJsonBody(req);
            this.sendJson(res, 200, await this.applySelfEvolutionProposal(body));
            return;
        }

        if (url.pathname === '/rpc' && req.method === 'POST') {
            const body = await this.readJsonBody(req);
            this.sendJson(res, 200, await this.handleRpc(body));
            return;
        }

        if (url.pathname === '/audit' && req.method === 'GET') {
            this.sendJson(res, 200, {
                ok: true,
                entries: await this.readAuditEntries(Number(url.searchParams.get('limit') || 100))
            });
            return;
        }

        if (url.pathname === '/transcript' && req.method === 'GET') {
            this.sendJson(
                res,
                200,
                await this.runtime.readTranscript(
                    url.searchParams.get('runId') || '',
                    Number(url.searchParams.get('limit') || 500)
                )
            );
            return;
        }

        throw new GatewayHttpError(404, 'not_found', `Unknown route: ${req.method} ${url.pathname}`);
    }

    applyCors(req, res) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'content-type, authorization');
        if (!SAFE_METHODS.has(req.method || 'GET')) {
            res.setHeader('Cache-Control', 'no-store');
        }
    }

    handleEvents(req, res) {
        const url = new URL(req.url || '/', 'http://127.0.0.1');
        const cursor = parseEventCursor(
            url.searchParams.get('cursor') ||
                url.searchParams.get('since') ||
                req.headers['last-event-id'] ||
                req.headers['x-ailis-event-cursor'],
            0
        );
        const replayLimit = Math.max(1, Math.min(Number(url.searchParams.get('limit') || this.eventLogLimit), this.eventLogLimit));
        const replay = cursor > 0 ? this.getEventsAfter(cursor, replayLimit) : [];
        res.writeHead(200, {
            'Content-Type': 'text/event-stream; charset=utf-8',
            'Cache-Control': 'no-cache, no-transform',
            Connection: 'keep-alive',
            'Access-Control-Allow-Origin': '*'
        });
        res.write(`event: gateway.hello\n`);
        res.write(
            `data: ${JSON.stringify({
                ts: Date.now(),
                cursor,
                latestSeq: this.eventSeq,
                replayed: replay.length,
                status: this.getStatus()
            })}\n\n`
        );
        const client = {
            id: randomUUID(),
            res,
            connectedAt: Date.now(),
            cursor,
            skipped: 0,
            pendingDrain: false,
            closed: false
        };
        for (const event of replay) {
            this.writeGatewayEventToClient(client, event, { force: true });
        }
        this.sseClients.add(client);
        req.on('close', () => {
            client.closed = true;
            this.sseClients.delete(client);
        });
    }

    async readJsonBody(req) {
        const chunks = [];
        let total = 0;
        for await (const chunk of req) {
            total += chunk.length;
            if (total > MAX_BODY_BYTES) {
                throw new GatewayHttpError(413, 'payload_too_large', 'Request body is too large');
            }
            chunks.push(chunk);
        }
        const raw = Buffer.concat(chunks).toString('utf8').trim();
        if (!raw) {
            return {};
        }
        try {
            return JSON.parse(raw);
        } catch (error) {
            throw new GatewayHttpError(400, 'invalid_json', error.message || 'Invalid JSON');
        }
    }

    sendJson(res, statusCode, payload) {
        if (res.headersSent) {
            return;
        }
        res.writeHead(statusCode, {
            'Content-Type': 'application/json; charset=utf-8'
        });
        res.end(JSON.stringify(payload, null, 2));
    }

    async handleRpc(body = {}) {
        const method = normalizeString(body.method);
        const params = body.params && typeof body.params === 'object' ? body.params : {};
        if (method === 'gateway.health') {
            return { ok: true, status: this.getStatus() };
        }
        if (method === 'tools.list') {
            return await this.listTools(params);
        }
        if (method === 'tools.call') {
            return await this.callTool(params);
        }
        if (method === 'agent.run') {
            return await this.runAgent(params);
        }
        if (method === 'audit.list') {
            return {
                ok: true,
                entries: await this.readAuditEntries(Number(params.limit || 100))
            };
        }
        if (method === 'runtime.status') {
            return {
                ok: true,
                status: this.runtime.getStatus()
            };
        }
        if (method === 'transcript.read') {
            return await this.runtime.readTranscript(params.runId || params.id || '', Number(params.limit || 500));
        }
        if (method === 'transcript.repair') {
            return await this.runtime.repairTranscript(params.runId || params.id || '');
        }
        return {
            ok: false,
            status: 'unknown_method',
            error: `Unknown RPC method: ${method}`
        };
    }

    async listTools(params = {}) {
        const context = this.mergeDefaultContext(
            params.context && typeof params.context === 'object' ? params.context : params
        );
        const smoke = buildSmokeStatusMap(this.smokeReportPath);
        const shouldMaterialize =
            params.materialize === true ||
            params.includeMaterialized === true ||
            context.materialize === true ||
            context.includeMaterialized === true;
        const registeredToolIds = new Set(this.gatewayToolRuntimeRegistry?.toolIds?.() || []);
        const materialized = shouldMaterialize
            ? await this.listMaterializedToolIds().catch(() => [])
            : [...registeredToolIds];
        const materializedSet = new Set(materialized);
        const coreTools = OPENCLAW_CORE_TOOL_DEFINITIONS.map((tool) => ({
            id: tool.id,
            label: tool.label,
            description: tool.description,
            sectionId: tool.sectionId,
            route: this.resolveToolRoute(tool.id),
            status: registeredToolIds.has(tool.id)
                ? 'available'
                : smoke.map.get(tool.id)?.status || this.defaultToolStatus(tool.id, materializedSet),
            materialized:
                registeredToolIds.has(tool.id) ||
                materializedSet.has(tool.id) ||
                Boolean(smoke.map.get(tool.id)?.materialized),
            needsApproval: tool.id === 'exec' || tool.id === 'subagents',
            externalSideEffect: EXTERNAL_SIDE_EFFECT_TOOL_IDS.has(tool.id)
        }));

        const optionalRuntimeTools = OPENCLAW_OPTIONAL_RUNTIME_TOOL_DEFINITIONS.map((tool) => ({
            ...tool,
            route: 'openclaw-runtime',
            status: smoke.map.get(tool.id)?.status || this.defaultToolStatus(tool.id, materializedSet),
            materialized: materializedSet.has(tool.id) || Boolean(smoke.map.get(tool.id)?.materialized),
            externalSideEffect: true
        }));

        const channelMcpTools = OPENCLAW_CHANNEL_MCP_TOOL_DEFINITIONS.map((tool) => ({
            ...tool,
            route: 'openclaw-channel-mcp',
            status: smoke.map.get(tool.id)?.status || 'needs_pairing',
            materialized: Boolean(smoke.map.get(tool.id)?.materialized)
        }));
        const gatewayDefinitions = this.gatewayToolRuntimeRegistry.listDefinitions();
        const runtimeTools = gatewayDefinitions
            .filter((tool) => ['ailis-runtime', 'ailis-gateway'].includes(tool.route))
            .map((tool) => ({
                ...tool,
                status: tool.status || 'available',
                materialized: true
            }));
        const localTools = this.gatewayToolRuntimeRegistry.listDefinitions()
            .filter((tool) => tool.route === 'ailis-local')
            .map((tool) => ({
            ...tool,
            providers: tool.id === EMAIL_TOOL_ID ? safeListEmailProviderDetails() : undefined
        }));
        const exposed = this.runtime.exposeToolGroups(
            {
                coreTools,
                optionalRuntimeTools,
                channelMcpTools,
                runtimeTools,
                localTools
            },
            context
        );

        return {
            ok: true,
            gateway: this.getStatus(),
            smoke: {
                ok: smoke.ok,
                generatedAt: smoke.generatedAt,
                path: smoke.path,
                materializedProbe: shouldMaterialize ? 'live' : 'skipped_fast_list'
            },
            ...exposed,
            contracts: listToolContracts()
        };
    }

    resolveToolRoute(toolId) {
        const gatewayTool = this.gatewayToolRuntimeRegistry?.definition(toolId);
        if (gatewayTool?.route) {
            return gatewayTool.route;
        }
        if (this.runtime.canExecuteTool(toolId)) {
            return 'ailis-runtime';
        }
        if (GATEWAY_BACKED_TOOL_IDS.has(toolId) || SESSION_BOUND_TOOL_IDS.has(toolId)) {
            return 'openclaw-gateway';
        }
        if (PLUGIN_OR_TRIGGER_TOOL_IDS.has(toolId)) {
            return 'provider-plugin-or-trigger';
        }
        return 'openclaw-runtime';
    }

    defaultToolStatus(toolId, materializedSet) {
        if (this.gatewayToolRuntimeRegistry?.has(toolId)) {
            return 'available';
        }
        if (this.runtime.canExecuteTool(toolId)) {
            return 'available';
        }
        if (PLUGIN_OR_TRIGGER_TOOL_IDS.has(toolId)) {
            return materializedSet.has(toolId) ? 'available' : 'not_materialized';
        }
        if (EXTERNAL_SIDE_EFFECT_TOOL_IDS.has(toolId)) {
            return materializedSet.has(toolId) ? 'skipped_external' : 'not_materialized';
        }
        if (SESSION_BOUND_TOOL_IDS.has(toolId)) {
            return materializedSet.has(toolId) ? 'needs_session' : 'not_materialized';
        }
        return materializedSet.has(toolId) ? 'available' : 'unknown';
    }

    async listMaterializedToolIds() {
        const tools = await this.getToolSet({ workspace: this.workspaceRoot });
        return [...new Set([
            ...tools.keys(),
            ...(this.gatewayToolRuntimeRegistry?.toolIds?.() || [])
        ])];
    }

    async callTool(request = {}) {
        const callId = randomUUID();
        const startedAt = Date.now();
        const toolId = normalizeString(request.tool || request.name);
        const args = request.args && typeof request.args === 'object' ? request.args : {};
        const context = this.mergeDefaultContext(
            request.context && typeof request.context === 'object' ? request.context : {}
        );
        const transcriptRunId = normalizeString(context.runId || request.runId);
        const transcriptSessionId = normalizeString(
            context.sessionId || context.sessionKey || request.sessionId || request.sessionKey,
            'main'
        );
        const auditBase = {
            callId,
            tool: toolId,
            args: redactObject(args),
            context: redactObject(context)
        };

        this.emitGatewayEvent('tool.call.started', {
            callId,
            tool: toolId
        });

        try {
            if (!toolId) {
                throw new GatewayHttpError(400, 'missing_tool', 'tools.call requires a tool name');
            }
            if (!isExternalVirtualToolId(toolId)) {
                const contractValidation = validateToolContract(toolId, args);
                if (!contractValidation.ok) {
                    throw new GatewayHttpError(400, 'invalid_tool_args', 'tool arguments failed contract validation', {
                        tool: toolId,
                        contract: contractValidation.contract,
                        errors: contractValidation.errors
                    });
                }
            }
            const workspaceDir = this.resolveWorkspace(context.workspace);
            if (transcriptRunId) {
                await this.runtime.appendItem(transcriptRunId, {
                    type: 'tool.call',
                    sessionId: transcriptSessionId,
                    status: 'started',
                    payload: {
                        callId,
                        tool: toolId,
                        args,
                        context: {
                            workspace: workspaceDir,
                            approved: context.approved === true,
                            planner: context.planner,
                            stepId: context.stepId,
                            iteration: context.iteration
                        }
                    }
                });
            }
            const beginEvent = {
                callId,
                tool: toolId,
                stage: 'begin',
                startedAt
            };
            this.emitGatewayEvent('tool.call.begin', beginEvent);
            if (transcriptRunId) {
                await this.runtime.appendItem(transcriptRunId, {
                    type: 'tool.event',
                    sessionId: transcriptSessionId,
                    status: 'begin',
                    payload: beginEvent
                });
            }
            const policyDecision = this.runtime.evaluateToolCall({ toolId, args, context, workspaceDir });
            if (policyDecision.denied) {
                throwBlocked(`tool call blocked by AILIS runtime policy: ${policyDecision.reason}`, {
                    tool: toolId,
                    reason: policyDecision.reason,
                    policy: policyDecision.policy,
                    classification: policyDecision.classification
                });
            }
            if (policyDecision.needsApproval) {
                throwApprovalRequired(`tool call requires approval by AILIS runtime policy: ${policyDecision.reason}`, {
                    tool: toolId,
                    approval: 'required',
                    reason: policyDecision.reason,
                    policy: policyDecision.policy,
                    classification: policyDecision.classification
                });
            }
            const result = await withTimeout(
                Number(context.timeoutMs || request.timeoutMs || TOOL_CALL_TIMEOUT_MS),
                () => this.callOpenClawTool({ callId, toolId, args, context, workspaceDir })
            );
            const guardedResult = this.runtime.guardToolResult(result, { toolId, callId });
            const status = classifyToolResult(guardedResult);
            const response = {
                ok: status === 'completed',
                callId,
                tool: toolId,
                status,
                durationMs: Date.now() - startedAt,
                result: guardedResult
            };
            await this.appendAudit({
                ...auditBase,
                status,
                ok: response.ok,
                durationMs: response.durationMs,
                resultPreview: summarize(guardedResult)
            });
            if (transcriptRunId) {
                await this.runtime.appendItem(transcriptRunId, {
                    type: 'tool.result',
                    sessionId: transcriptSessionId,
                    status,
                    payload: {
                        callId,
                        tool: toolId,
                        ok: response.ok,
                        status,
                        durationMs: response.durationMs,
                        result: guardedResult
                    }
                });
                await this.runtime.appendItem(transcriptRunId, {
                    type: 'tool.event',
                    sessionId: transcriptSessionId,
                    status: 'success',
                    payload: {
                        callId,
                        tool: toolId,
                        stage: 'success',
                        status,
                        durationMs: response.durationMs
                    }
                });
            }
            this.emitGatewayEvent('tool.call.success', {
                callId,
                tool: toolId,
                stage: 'success',
                status,
                durationMs: response.durationMs
            });
            this.emitGatewayEvent('tool.call.finished', response);
            return response;
        } catch (error) {
            const status = classifyError(error);
            const response = {
                ok: false,
                callId,
                tool: toolId,
                status,
                durationMs: Date.now() - startedAt,
                error: error.message || String(error),
                ...(error.details ? { details: error.details } : {})
            };
            await this.appendAudit({
                ...auditBase,
                status,
                ok: false,
                durationMs: response.durationMs,
                error: response.error
            });
            if (transcriptRunId) {
                const guardedError = this.runtime.guardToolResult(
                    {
                        content: [
                            {
                                type: 'text',
                                text: response.error
                            }
                        ],
                        isError: true,
                        details: {
                            status,
                            code: error?.code,
                            error: response.error,
                            ...(error.details ? { details: error.details } : {})
                        }
                    },
                    { toolId, callId }
                );
                await this.runtime.appendItem(transcriptRunId, {
                    type: 'tool.result',
                    sessionId: transcriptSessionId,
                    status,
                    payload: {
                        callId,
                        tool: toolId,
                        ok: false,
                        status,
                        durationMs: response.durationMs,
                        result: guardedError
                    }
                });
                await this.runtime.appendItem(transcriptRunId, {
                    type: 'tool.event',
                    sessionId: transcriptSessionId,
                    status: 'failure',
                    payload: {
                        callId,
                        tool: toolId,
                        stage: 'failure',
                        status,
                        error: response.error,
                        durationMs: response.durationMs
                    }
                });
            }
            this.emitGatewayEvent('tool.call.failure', {
                callId,
                tool: toolId,
                stage: 'failure',
                status,
                error: response.error,
                durationMs: response.durationMs
            });
            this.emitGatewayEvent('tool.call.finished', response);
            return response;
        }
    }

    async runAgent(request = {}) {
        const input = request && typeof request === 'object' ? request : {};
        return await this.ensureAgentRunner().runMessage({
            ...input,
            context: this.mergeDefaultContext(
                input.context && typeof input.context === 'object' ? input.context : {}
            )
        });
    }

    async interruptAgentRun(request = {}) {
        const input = request && typeof request === 'object' ? request : {};
        const context = input.context && typeof input.context === 'object' ? input.context : {};
        return await this.ensureAgentRunner().requestInterruptRun({
            runId: input.runId || context.runId || '',
            sessionId: input.sessionId || input.sessionKey || context.sessionId || context.sessionKey || '',
            reason: input.reason || context.reason || 'user_interrupt',
            source: input.source || context.source || 'gateway'
        });
    }

    async executeSubagentTask({ subagent, args = {}, context = {}, signal, onEvent } = {}) {
        const task = normalizeString(subagent?.task || args.task || args.prompt || args.message);
        if (!task) {
            return {
                ok: false,
                status: 'failed',
                displayText: 'Subagent task is empty.'
            };
        }
        await onEvent?.({
            type: 'subagent.runner.started',
            status: 'running',
            message: task,
            payload: {
                subagentId: subagent?.id,
                sessionId: subagent?.childSessionId
            }
        });
        const runPromise = this.ensureAgentRunner().runMessage({
            message: task,
            sessionId: subagent?.childSessionId || context.sessionId || context.sessionKey,
            agentLoop: 'llm',
            planner: 'llm',
            maxAgentSteps: Number(args.maxAgentSteps || context.maxAgentSteps || 50),
            context: this.mergeDefaultContext({
                ...context,
                parentRunId: subagent?.runId,
                parentSessionId: subagent?.sessionId,
                subagentId: subagent?.id,
                subagentLabel: subagent?.label,
                sessionId: subagent?.childSessionId || context.sessionId,
                sessionKey: subagent?.childSessionId || context.sessionKey,
                agentLoop: 'llm',
                planner: 'llm',
                maxAgentSteps: Number(args.maxAgentSteps || context.maxAgentSteps || 50)
            })
        });
        const result = signal
            ? await new Promise((resolve, reject) => {
                  if (signal.aborted) {
                      reject(new Error('subagent run aborted'));
                      return;
                  }
                  const onAbort = () => reject(new Error('subagent run aborted'));
                  signal.addEventListener('abort', onAbort, { once: true });
                  runPromise.then(
                      (value) => {
                          signal.removeEventListener('abort', onAbort);
                          resolve(value);
                      },
                      (error) => {
                          signal.removeEventListener('abort', onAbort);
                          reject(error);
                      }
                  );
              })
            : await runPromise;
        await onEvent?.({
            type: 'subagent.runner.finished',
            status: result?.status || 'completed',
            message: normalizeString(result?.displayText || result?.speechText, 'subagent runner finished'),
            payload: {
                runId: result?.runId,
                ok: result?.ok === true,
                durationMs: result?.durationMs
            }
        });
        return {
            ok: result?.ok === true,
            status: result?.status || (result?.ok === false ? 'failed' : 'completed'),
            runId: result?.runId,
            mode: result?.mode,
            intent: result?.intent,
            displayText: result?.displayText || result?.speechText || '',
            speechText: result?.speechText || result?.displayText || '',
            durationMs: result?.durationMs,
            steps: result?.steps || [],
            plan: result?.plan || []
        };
    }

    async callOpenClawTool({ callId = '', toolId, args, context, workspaceDir }) {
        if (isExternalVirtualToolId(toolId)) {
            const result = await this.runtime?.capabilityManager?.executeVirtualExternalTool?.(toolId, args, {
                ...context,
                callId,
                workspace: workspaceDir,
                workspaceDir
            });
            return makeExternalVirtualToolResult(result || {
                status: 'capability_manager_unavailable',
                ok: false,
                toolId,
                message: 'Capability Manager is not available for external virtual tool execution.'
            }, { toolId });
        }
        if (this.gatewayToolRuntimeRegistry?.has(toolId)) {
            return await this.gatewayToolRuntimeRegistry.dispatch(toolId, args, {
                ...context,
                callId,
                workspace: workspaceDir,
                workspaceDir
            });
        }
        if (PLUGIN_OR_TRIGGER_TOOL_IDS.has(toolId)) {
            return this.notAvailableResult(toolId, 'provider-plugin-or-trigger');
        }
        if (EXTERNAL_SIDE_EFFECT_TOOL_IDS.has(toolId) && context.executeExternal !== true) {
            return this.notAvailableResult(toolId, 'external-side-effect');
        }
        if (SESSION_BOUND_TOOL_IDS.has(toolId) && !context.sessionKey && !args.sessionKey) {
            return this.notAvailableResult(toolId, 'needs-session');
        }
        if (GATEWAY_BACKED_TOOL_IDS.has(toolId) || SESSION_BOUND_TOOL_IDS.has(toolId)) {
            await this.ensureToolGatewayReady();
        }

        const tools = await this.getToolSet({
            workspace: workspaceDir,
            sessionKey: context.sessionKey || args.sessionKey || 'main'
        });
        const tool = tools.get(toolId);
        if (!tool?.execute) {
            return this.notAvailableResult(toolId, 'not-materialized');
        }

        const finalArgs = this.prepareToolArgs({ toolId, args, context, workspaceDir });
        if (GATEWAY_BACKED_TOOL_IDS.has(toolId) || SESSION_BOUND_TOOL_IDS.has(toolId)) {
            return await this.withDefaultOpenClawGatewayEnv(() => tool.execute(`ailis-${toolId}`, finalArgs));
        }
        return await tool.execute(`ailis-${toolId}`, finalArgs);
    }

    async executeGatewayLocalTool(toolId, args, context = {}) {
        const workspaceDir = context.workspaceDir || this.resolveWorkspace(context.workspace);
        if (toolId === EMAIL_TOOL_ID) {
            const { executeEmailTool } = loadEmailToolModule();
            return await executeEmailTool(args, {
                ...context,
                emailProfiles: {
                    ...(this.getEmailProfiles() || {}),
                    ...(context.emailProfiles || context.emailAccounts || {})
                }
            });
        }
        if (toolId === FILE_MANAGER_TOOL_ID) {
            return await executeFileManagerTool(args, context, {
                workspaceDir,
                workspaceRoot: this.workspaceRoot,
                projectRoot: this.projectRoot
            });
        }
        if (toolId === COMPUTER_TOOL_ID) {
            const action = normalizeString(args.action || args.operation || args.intent).toLowerCase().replace(/[-\s]+/g, '_');
            if (['exec_command', 'exec', 'run'].includes(action)) {
                const interceptedPatch = this.extractPatchFromCommand(args.cmd || args.command);
                if (interceptedPatch) {
                    return await this.executeLocalApplyPatch(interceptedPatch, workspaceDir);
                }
            }
            return await this.computerTool.execute(args, context, {
                workspaceDir,
                workspaceRoot: this.workspaceRoot,
                projectRoot: this.projectRoot,
                platformAdapter: this.platformAdapter,
                outputStore: this.runtime.outputStore,
                contextArtifactStore: this.runtime.contextArtifactStore,
                auditDir: this.auditDir
            });
        }
        if (toolId === CODE_TOOL_ID) {
            return await executeCodeTool(args, context, {
                workspaceDir,
                workspaceRoot: this.workspaceRoot,
                projectRoot: this.projectRoot
            });
        }
        if (toolId === ARTIFACT_VERIFIER_TOOL_ID) {
            return await executeArtifactVerifierTool(args, context, {
                workspaceDir,
                workspaceRoot: this.workspaceRoot,
                projectRoot: this.projectRoot
            });
        }
        if (toolId === READ_XLSX_WORKBOOK_TOOL_ID) {
            return await executeReadXlsxWorkbookTool(args, context, {
                workspaceDir,
                workspaceRoot: this.workspaceRoot,
                projectRoot: this.projectRoot,
                auditDir: this.auditDir,
                contextArtifactStore: this.runtime.contextArtifactStore
            });
        }
        if (toolId === GITHUB_PAGES_TOOL_ID) {
            return await executeGitHubPagesTool(args, context, {
                workspaceDir,
                workspaceRoot: this.workspaceRoot,
                projectRoot: this.projectRoot
            });
        }
        if (toolId === VISION_TOOL_ID) {
            return await executeVisionTool(args, context, this.visionServices);
        }
        if (LOCAL_CORE_TOOL_IDS.has(toolId)) {
            return await this.executeLocalCoreTool({ toolId, args, context, workspaceDir });
        }
        return this.notAvailableResult(toolId, 'not-materialized');
    }

    notAvailableResult(toolId, reason) {
        const statusByReason = {
            'provider-plugin-or-trigger': 'not_materialized',
            'external-side-effect': 'skipped_external',
            'needs-session': 'needs_session',
            'not-materialized': 'not_materialized'
        };
        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify(
                        {
                            tool: toolId,
                            status: statusByReason[reason] || 'unavailable',
                            reason
                        },
                        null,
                        2
                    )
                }
            ],
            isError: reason !== 'external-side-effect',
            details: {
                tool: toolId,
                status: statusByReason[reason] || 'unavailable',
                reason
            }
        };
    }

    extractPatchFromCommand(command = '') {
        const text = normalizeString(command);
        const start = text.indexOf('*** Begin Patch');
        const end = text.indexOf('*** End Patch');
        if (start < 0 || end < start) {
            return '';
        }
        return text.slice(start, end + '*** End Patch'.length).trim();
    }

    parseLocalPatch(input = '') {
        const patch = normalizeString(input);
        if (!patch.startsWith('*** Begin Patch') || !patch.includes('*** End Patch')) {
            throwBlocked('apply_patch input must start with *** Begin Patch and end with *** End Patch');
        }
        const lines = patch.split(/\r?\n/);
        const operations = [];
        let index = 1;
        const readBody = () => {
            const body = [];
            while (index < lines.length && !/^\*\*\* (?:Add File|Update File|Delete File|End Patch)/.test(lines[index])) {
                body.push(lines[index]);
                index += 1;
            }
            return body;
        };
        while (index < lines.length) {
            const line = lines[index];
            if (/^\*\*\* End Patch\s*$/.test(line)) {
                break;
            }
            let match = line.match(/^\*\*\* Add File:\s+(.+)$/);
            if (match) {
                index += 1;
                operations.push({ type: 'add', path: match[1].trim(), body: readBody() });
                continue;
            }
            match = line.match(/^\*\*\* Update File:\s+(.+)$/);
            if (match) {
                index += 1;
                operations.push({ type: 'update', path: match[1].trim(), body: readBody() });
                continue;
            }
            match = line.match(/^\*\*\* Delete File:\s+(.+)$/);
            if (match) {
                index += 1;
                operations.push({ type: 'delete', path: match[1].trim(), body: [] });
                continue;
            }
            if (normalizeString(line)) {
                throwBlocked(`unsupported apply_patch line: ${line}`);
            }
            index += 1;
        }
        if (!operations.length) {
            throwBlocked('apply_patch contains no file operations');
        }
        return operations;
    }

    patchBodyToText(body = []) {
        const content = [];
        for (const line of body) {
            if (line.startsWith('+')) {
                content.push(line.slice(1));
            } else if (line.startsWith('***')) {
                break;
            } else if (normalizeString(line)) {
                throwBlocked(`add file patch lines must start with +: ${line}`);
            }
        }
        return content.length ? `${content.join('\n')}\n` : '';
    }

    applyUpdatePatchText(source = '', body = []) {
        let text = source.replace(/\r\n/g, '\n');
        let oldLines = [];
        let newLines = [];
        const flush = () => {
            if (!oldLines.length && !newLines.length) {
                return;
            }
            const oldBlock = oldLines.length ? `${oldLines.join('\n')}\n` : '';
            const newBlock = newLines.length ? `${newLines.join('\n')}\n` : '';
            const variants = oldBlock.endsWith('\n') ? [oldBlock, oldBlock.slice(0, -1)] : [oldBlock];
            const found = variants.find((variant) => variant && text.includes(variant));
            if (!found) {
                throwBlocked('apply_patch update hunk did not match target file');
            }
            text = text.replace(found, found.endsWith('\n') ? newBlock : newBlock.replace(/\n$/, ''));
            oldLines = [];
            newLines = [];
        };
        for (const line of body) {
            if (line.startsWith('@@')) {
                flush();
                continue;
            }
            if (line.startsWith(' ')) {
                oldLines.push(line.slice(1));
                newLines.push(line.slice(1));
                continue;
            }
            if (line.startsWith('-')) {
                oldLines.push(line.slice(1));
                continue;
            }
            if (line.startsWith('+')) {
                newLines.push(line.slice(1));
                continue;
            }
            if (/^\\ No newline/.test(line) || !normalizeString(line)) {
                continue;
            }
            throwBlocked(`unsupported update patch line: ${line}`);
        }
        flush();
        return text;
    }

    async executeLocalApplyPatch(input, workspaceDir) {
        this.assertPatchInsideWorkspace(input, workspaceDir);
        const operations = this.parseLocalPatch(input);
        const changedFiles = [];
        for (const operation of operations) {
            const target = this.resolveToolPath(operation.path, workspaceDir, 'patchPath');
            if (operation.type === 'add') {
                const content = this.patchBodyToText(operation.body);
                await fsp.mkdir(path.dirname(target), { recursive: true });
                await fsp.writeFile(target, content, 'utf8');
                changedFiles.push({ action: 'add', path: target, bytes: Buffer.byteLength(content, 'utf8') });
                continue;
            }
            if (operation.type === 'delete') {
                await fsp.rm(target, { force: true });
                changedFiles.push({ action: 'delete', path: target });
                continue;
            }
            const source = await fsp.readFile(target, 'utf8').catch((error) => {
                throwBlocked(`apply_patch update target not found: ${operation.path}`, { error: error?.message || String(error) });
            });
            const next = this.applyUpdatePatchText(source, operation.body);
            await fsp.writeFile(target, next, 'utf8');
            changedFiles.push({ action: 'update', path: target, bytes: Buffer.byteLength(next, 'utf8') });
        }
        return {
            content: [{ type: 'text', text: `apply_patch completed: ${changedFiles.length} file(s)` }],
            details: {
                status: 'completed',
                action: 'apply_patch',
                changedFiles
            }
        };
    }

    async executeLocalCoreTool({ toolId, args, context, workspaceDir }) {
        if (toolId === 'read') {
            const target = this.resolveToolPath(args.path, workspaceDir, 'path');
            const artifactRecord = await this.runtime.contextArtifactStore?.findByPath?.(target).catch(() => null);
            if (artifactRecord?.payloadPath && path.resolve(artifactRecord.payloadPath) === path.resolve(target)) {
                return this.runtime.contextArtifactStore.guardReadResult(artifactRecord, target);
            }
            let stat = null;
            try {
                stat = await fsp.stat(target);
            } catch {}
            if (!stat || !stat.isFile()) {
                return {
                    content: [{ type: 'text', text: `file not found: ${target}` }],
                    isError: true,
                    details: {
                        status: 'not_found',
                        path: target
                    }
                };
            }
            const maxBytes = Math.min(Math.max(Number(args.maxBytes || 128 * 1024), 1), 5 * 1024 * 1024);
            const handle = await fsp.open(target, 'r');
            try {
                const buffer = Buffer.alloc(Math.min(stat.size, maxBytes));
                const { bytesRead } = await handle.read(buffer, 0, buffer.length, 0);
                const text = buffer.subarray(0, bytesRead).toString(args.encoding || 'utf8');
                return {
                    content: [{ type: 'text', text }],
                    details: {
                        status: 'completed',
                        action: 'read',
                        path: target,
                        bytesRead,
                        size: stat.size,
                        truncated: stat.size > maxBytes
                    }
                };
            } finally {
                await handle.close();
            }
        }

        if (toolId === 'write') {
            const target = this.resolveToolPath(args.path, workspaceDir, 'path');
            const content = typeof args.content === 'string' ? args.content : '';
            await fsp.mkdir(path.dirname(target), { recursive: true });
            await fsp.writeFile(target, content, args.encoding || 'utf8');
            return {
                content: [{ type: 'text', text: `write completed: ${target}` }],
                details: {
                    status: 'completed',
                    action: 'write',
                    path: target,
                    bytes: Buffer.byteLength(content, args.encoding || 'utf8')
                }
            };
        }

        if (toolId === 'apply_patch') {
            return await this.executeLocalApplyPatch(args.input || args.patch, workspaceDir);
        }

        if (toolId === 'exec') {
            const interceptedPatch = this.extractPatchFromCommand(args.command || args.cmd);
            if (interceptedPatch) {
                return await this.executeLocalApplyPatch(interceptedPatch, workspaceDir);
            }
            const finalArgs = this.prepareToolArgs({ toolId, args, context, workspaceDir });
            return await this.computerTool.execute(
                {
                    action: 'exec',
                    command: finalArgs.command || finalArgs.cmd,
                    args: finalArgs.args || finalArgs.arguments,
                    workdir: finalArgs.workdir,
                    timeoutMs: finalArgs.timeoutMs || finalArgs.timeout,
                    maxOutputBytes: finalArgs.maxOutputBytes,
                    env: finalArgs.env
                },
                context,
                {
                    workspaceDir,
                    workspaceRoot: this.workspaceRoot,
                    projectRoot: this.projectRoot,
                    platformAdapter: this.platformAdapter,
                    outputStore: this.runtime.outputStore,
                    auditDir: this.auditDir
                }
            );
        }

        return this.notAvailableResult(toolId, 'not-materialized');
    }

    prepareToolArgs({ toolId, args, context, workspaceDir }) {
        const finalArgs = { ...args };
        if (FILE_TOOL_IDS.has(toolId)) {
            this.assertToolPathInsideWorkspace(finalArgs.path, workspaceDir, 'path');
        }
        if (toolId === 'apply_patch') {
            this.assertPatchInsideWorkspace(finalArgs.input, workspaceDir);
        }
        if (toolId === 'exec') {
            if (context.approved !== true && finalArgs.approved !== true) {
                throwApprovalRequired('exec requires context.approved=true in AILIS Gateway v0', {
                    tool: toolId,
                    approval: 'required'
                });
            }
            if (finalArgs.timeoutMs === undefined && finalArgs.timeout !== undefined) {
                const timeout = Number(finalArgs.timeout);
                if (Number.isFinite(timeout) && timeout > 0) {
                    finalArgs.timeoutMs = timeout < 1000 ? timeout * 1000 : timeout;
                }
            }
            finalArgs.workdir = this.resolveToolPath(finalArgs.workdir || workspaceDir, workspaceDir, 'workdir');
            finalArgs.host = finalArgs.host || 'gateway';
            finalArgs.security = finalArgs.security || 'full';
            finalArgs.ask = finalArgs.ask || 'off';
        }
        if (toolId === 'message' && context.approved !== true) {
            finalArgs.dryRun = true;
        }
        return finalArgs;
    }

    resolveWorkspace(rawWorkspace) {
        const workspace = normalizeString(rawWorkspace)
            ? path.resolve(rawWorkspace)
            : this.workspaceRoot;
        if (!isPathInside(this.workspaceRoot, workspace)) {
            throwBlocked('workspace must stay inside the configured AILIS workspace root', {
                workspace,
                workspaceRoot: this.workspaceRoot
            });
        }
        return workspace;
    }

    resolveToolPath(rawPath, workspaceDir, fieldName) {
        const value = normalizeString(rawPath);
        if (!value) {
            throwBlocked(`${fieldName} is required`);
        }
        const target = path.isAbsolute(value) ? path.resolve(value) : path.resolve(workspaceDir, value);
        if (!isPathInside(workspaceDir, target)) {
            throwBlocked(`${fieldName} must stay inside workspace`, {
                fieldName,
                target,
                workspaceDir
            });
        }
        return target;
    }

    assertToolPathInsideWorkspace(rawPath, workspaceDir, fieldName) {
        this.resolveToolPath(rawPath, workspaceDir, fieldName);
    }

    assertPatchInsideWorkspace(rawPatch, workspaceDir) {
        const patch = normalizeString(rawPatch);
        if (!patch) {
            throwBlocked('apply_patch input is required');
        }
        const pattern = /^\*\*\* (?:Add File|Update File|Delete File):\s+(.+)$/gm;
        let match = pattern.exec(patch);
        while (match) {
            const patchPath = match[1].trim();
            if (path.isAbsolute(patchPath) || patchPath.split(/[\\/]+/).includes('..')) {
                throwBlocked('apply_patch paths must be relative workspace paths', {
                    patchPath,
                    workspaceDir
                });
            }
            this.resolveToolPath(patchPath, workspaceDir, 'patchPath');
            match = pattern.exec(patch);
        }
    }

    async loadToolRuntimeModule() {
        if (!this.toolRuntimeModulePromise) {
            const harnessPath = path.join(
                this.projectRoot,
                'build-cache',
                'openclaw-runtime',
                'dist',
                'plugin-sdk',
                'agent-harness.js'
            );
            this.toolRuntimeModulePromise = import(pathToFileURL(harnessPath).href);
        }
        return await this.toolRuntimeModulePromise;
    }

    async getToolSet(context = {}) {
        const workspaceDir = this.resolveWorkspace(context.workspace);
        const sessionKey = normalizeString(context.sessionKey, 'main');
        const cacheKey = `${workspaceDir}|${sessionKey}`;
        if (this.toolSets.has(cacheKey)) {
            return this.toolSets.get(cacheKey);
        }
        const { createOpenClawCodingTools } = await this.loadToolRuntimeModule();
        const tools = createOpenClawCodingTools({
            workspaceDir,
            agentDir: workspaceDir,
            senderIsOwner: true,
            modelHasVision: true,
            modelProvider: 'openai',
            modelId: 'gpt-5.4',
            sessionKey,
            runSessionKey: sessionKey,
            onYield: async () => {},
            config: buildGatewayConfig()
        });
        const toolMap = new Map(tools.map((tool) => [tool.name, tool]));
        this.toolSets.set(cacheKey, toolMap);
        return toolMap;
    }

    async ensureToolGatewayReady() {
        if (!this.toolRuntimeSupervisor) {
            this.toolRuntimeSupervisor = new OpenClawRuntimeSupervisor({
                app: this.app,
                gatewayUrl: this.toolGatewayUrl
            });
        }
        return await this.toolRuntimeSupervisor.ensureReady();
    }

    async withDefaultOpenClawGatewayEnv(action) {
        const priorOpenClawGatewayUrl = process.env.OPENCLAW_GATEWAY_URL;
        const priorAilisOpenClawGatewayUrl = process.env.AILIS_OPENCLAW_GATEWAY_URL;
        try {
            delete process.env.OPENCLAW_GATEWAY_URL;
            delete process.env.AILIS_OPENCLAW_GATEWAY_URL;
            return await action();
        } finally {
            if (priorOpenClawGatewayUrl === undefined) {
                delete process.env.OPENCLAW_GATEWAY_URL;
            } else {
                process.env.OPENCLAW_GATEWAY_URL = priorOpenClawGatewayUrl;
            }
            if (priorAilisOpenClawGatewayUrl === undefined) {
                delete process.env.AILIS_OPENCLAW_GATEWAY_URL;
            } else {
                process.env.AILIS_OPENCLAW_GATEWAY_URL = priorAilisOpenClawGatewayUrl;
            }
        }
    }

    async appendAudit(entry) {
        await fsp.mkdir(this.auditDir, { recursive: true });
        const safeEntry = redactObject(entry);
        const line = JSON.stringify({
            ts: Date.now(),
            iso: new Date().toISOString(),
            ...safeEntry,
            argsPreview: summarize(safeEntry.args),
            contextPreview: summarize(safeEntry.context)
        });
        await fsp.appendFile(this.auditLogPath, `${line}\n`, 'utf8');
    }

    async readAuditEntries(limit = 100) {
        const boundedLimit = Math.min(Math.max(Number(limit) || 100, 1), 1000);
        try {
            const text = await fsp.readFile(this.auditLogPath, 'utf8');
            return text
                .split(/\r?\n/)
                .filter(Boolean)
                .slice(-boundedLimit)
                .map((line) => {
                    try {
                        return JSON.parse(line);
                    } catch {
                        return { raw: line };
                    }
                });
        } catch {
            return [];
        }
    }

    async listAgentAnalysisRuns(limit = 40) {
        const boundedLimit = Math.min(Math.max(Number(limit) || 40, 1), 200);
        const entries = await this.readAuditEntries(1000);
        const runs = new Map();
        for (const entry of entries) {
            const runId = normalizeString(entry.runId || entry.result?.runId || entry.args?.runId);
            if (!runId || (entry.type && entry.type !== 'agent.run')) {
                continue;
            }
            const ts = analysisTimestamp(entry);
            const prior = runs.get(runId);
            if (prior && prior.ts > ts) {
                continue;
            }
            runs.set(runId, {
                runId,
                sessionId: normalizeString(entry.args?.sessionId || entry.context?.sessionId || entry.sessionId, 'main'),
                ts,
                iso: analysisIso(entry),
                status: normalizeString(entry.status, 'unknown'),
                ok: entry.ok === true,
                durationMs: Number.isFinite(Number(entry.durationMs)) ? Number(entry.durationMs) : null,
                mode: normalizeString(entry.mode),
                intent: normalizeString(entry.intent),
                planner: normalizeString(entry.planner),
                message: normalizeString(entry.args?.message || entry.message),
                resultPreview: summarizeForAnalysis(entry.resultPreview || entry.displayText || entry.error || '', 360)
            });
        }

        const activeRuns = this.ensureAgentRunner()?.activeRuns;
        if (activeRuns?.size) {
            for (const run of activeRuns.values()) {
                if (!run?.runId) {
                    continue;
                }
                runs.set(run.runId, {
                    runId: run.runId,
                    sessionId: normalizeString(run.sessionId, 'main'),
                    ts: Number(run.startedAt) || Date.now(),
                    iso: new Date(Number(run.startedAt) || Date.now()).toISOString(),
                    status: 'running',
                    ok: false,
                    durationMs: Date.now() - (Number(run.startedAt) || Date.now()),
                    mode: normalizeString(run.mode),
                    intent: normalizeString(run.intent),
                    planner: normalizeString(run.planner),
                    message: normalizeString(run.message),
                    resultPreview: 'running'
                });
            }
        }

        const sortedRuns = [...runs.values()]
            .sort((a, b) => (b.ts || 0) - (a.ts || 0))
            .slice(0, boundedLimit);
        await Promise.all(sortedRuns.map(async (run) => {
            try {
                const transcript = await this.runtime.readTranscript(run.runId, 500);
                const transcriptItems = transcript.items || [];
                const finalItem = [...transcriptItems].reverse().find((item) =>
                    ['turn.completed', 'agent.final', 'agent.blocked', 'approval.requested'].includes(item.type)
                );
                const latestDebugPause = [...transcriptItems].reverse().find((item) => item.type === 'agent.debug.paused') || null;
                const latestDebugPauseActive = latestDebugPause &&
                    (!finalItem || analysisTimestamp(latestDebugPause) >= analysisTimestamp(finalItem));
                if (!latestDebugPauseActive) {
                    return;
                }
                run.status = 'debug_paused';
                run.debugPaused = true;
                run.debugSessionId = normalizeString(latestDebugPause.payload?.debugSessionId);
                run.pausedAtIteration = Number.isFinite(Number(latestDebugPause.payload?.iteration))
                    ? Number(latestDebugPause.payload.iteration)
                    : null;
                run.nextIteration = Number.isFinite(Number(latestDebugPause.payload?.nextIteration))
                    ? Number(latestDebugPause.payload.nextIteration)
                    : null;
            } catch {
                // The list should stay usable even if an old transcript was rotated or is malformed.
            }
        }));

        return {
            ok: true,
            status: 'completed',
            runs: sortedRuns,
            auditLogPath: this.auditLogPath,
            transcriptDir: this.runtime?.transcriptDir || ''
        };
    }

    buildRunTimeline({ transcriptItems = [], events = [], auditEntries = [] } = {}) {
        const timeline = [];
        for (const item of transcriptItems) {
            const payload = item.payload || {};
            timeline.push({
                source: 'transcript',
                id: item.id || `${item.runId}:${item.seq}`,
                seq: item.seq || null,
                ts: analysisTimestamp(item),
                iso: analysisIso(item),
                type: item.type,
                kind: timelineKind(item.type),
                status: item.status || payload.status || '',
                iteration: getPayloadIteration(payload),
                title: timelineTitle(item.type, payload),
                durationMs: Number.isFinite(Number(payload.durationMs)) ? Number(payload.durationMs) : null,
                ok: payload.ok,
                tool: payload.tool || payload.toolCall?.tool || '',
                preview: summarizeForAnalysis(payload.displayText || payload.text || payload.summary || payload.error || payload.result || payload, 900)
            });
        }
        for (const event of events) {
            const payload = event.payload || {};
            timeline.push({
                source: 'event',
                id: event.id,
                seq: event.seq || null,
                ts: analysisTimestamp(event),
                iso: analysisIso(event),
                type: event.type,
                kind: timelineKind(event.type),
                status: payload.status || '',
                iteration: getPayloadIteration(payload),
                title: timelineTitle(event.type, payload),
                durationMs: Number.isFinite(Number(payload.durationMs)) ? Number(payload.durationMs) : null,
                ok: payload.ok,
                tool: payload.tool || '',
                preview: summarizeForAnalysis(payload, 700)
            });
        }
        for (const entry of auditEntries) {
            timeline.push({
                source: 'audit',
                id: entry.callId || entry.runId || `${entry.ts || entry.iso}:audit`,
                seq: null,
                ts: analysisTimestamp(entry),
                iso: analysisIso(entry),
                type: entry.type || 'tool.audit',
                kind: entry.type === 'agent.run' ? 'result' : 'tool',
                status: entry.status || '',
                iteration: null,
                title: entry.type === 'agent.run'
                    ? `审计记录 ${entry.status || ''}`.trim()
                    : `工具审计 ${entry.tool || ''}`.trim(),
                durationMs: Number.isFinite(Number(entry.durationMs)) ? Number(entry.durationMs) : null,
                ok: entry.ok,
                tool: entry.tool || '',
                preview: summarizeForAnalysis(entry.resultPreview || entry.error || entry.argsPreview || entry, 700)
            });
        }
        return timeline
            .sort((a, b) => (a.ts || 0) - (b.ts || 0) || (a.seq || 0) - (b.seq || 0))
            .slice(-2000);
    }

    extractOutputStoreFromToolPayload(payload = {}) {
        const result = payload.result || {};
        const details = result.details || {};
        const structured = result.structuredContent || {};
        const candidates = [
            details.outputStore,
            structured.outputStore,
            result.outputStore,
            payload.outputStore
        ];
        return candidates.find((candidate) => candidate && typeof candidate === 'object' && candidate.outputId) || null;
    }

    buildRunRounds(transcriptItems = []) {
        const rounds = new Map();
        const ensureRound = (iteration) => {
            const index = Number.isFinite(Number(iteration)) ? Number(iteration) : 0;
            if (!rounds.has(index)) {
                rounds.set(index, {
                    iteration: index,
                    label: `第 ${index + 1} 轮`,
                    promptBudget: null,
                    approxInputTokens: 0,
                    messages: [],
                    decision: null,
                    llmCalls: [],
                    tools: [],
                    progressNotes: [],
                    notes: []
                });
            }
            return rounds.get(index);
        };

        const toolCalls = new Map();
        for (const item of transcriptItems) {
            const payload = item.payload || {};
            const iteration = getPayloadIteration(payload);
            if (item.type === 'agent.context_snapshot') {
                const round = ensureRound(iteration);
                round.promptBudget = payload.promptBudget || null;
                round.approxInputTokens = Number(payload.promptBudget?.approx_input_tokens) || approxTokenCount(JSON.stringify(payload.messages || []));
                round.messages = Array.isArray(payload.messages) ? payload.messages : [];
                continue;
            }
            if (item.type === 'agent.llm_call') {
                ensureRound(iteration).llmCalls.push({
                    callId: payload.callId || '',
                    provider: payload.provider || '',
                    model: payload.model || '',
                    status: payload.status || item.status || '',
                    action: payload.action || '',
                    ok: payload.ok === true,
                    durationMs: Number(payload.durationMs) || 0,
                    usage: normalizeUsageForAnalysis(payload.usage || {})
                });
                continue;
            }
            if (item.type === 'agent.decision') {
                ensureRound(iteration).decision = {
                    status: item.status || payload.status || '',
                    action: payload.action || '',
                    intent: payload.intent || '',
                    summary: payload.summary || '',
                    publicReasoning: payload.publicReasoning || '',
                    progressNoteSource: payload.progressNoteSource || '',
                    riskLevel: payload.riskLevel || '',
                    toolCall: payload.toolCall || null,
                    error: payload.error || ''
                };
                continue;
            }
            if (item.type === 'agent.progress_note') {
                ensureRound(iteration).progressNotes.push({
                    text: payload.text || '',
                    source: payload.source || '',
                    action: payload.action || '',
                    intent: payload.intent || '',
                    status: item.status || payload.status || ''
                });
                continue;
            }
            if (item.type === 'tool.call') {
                const callId = normalizeString(payload.callId || item.id);
                const tool = {
                    callId,
                    tool: payload.tool || '',
                    status: 'started',
                    ok: null,
                    durationMs: 0,
                    args: payload.args || null,
                    resultPreview: '',
                    outputStore: null
                };
                toolCalls.set(callId, tool);
                ensureRound(iteration).tools.push(tool);
                continue;
            }
            if (item.type === 'tool.result') {
                const callId = normalizeString(payload.callId || item.id);
                let tool = toolCalls.get(callId);
                if (!tool) {
                    tool = {
                        callId,
                        tool: payload.tool || '',
                        status: payload.status || item.status || '',
                        ok: payload.ok === true,
                        durationMs: Number(payload.durationMs) || 0,
                        args: null,
                        resultPreview: summarizeForAnalysis(payload.result || payload.error || '', 900),
                        outputStore: this.extractOutputStoreFromToolPayload(payload)
                    };
                    ensureRound(iteration).tools.push(tool);
                } else {
                    tool.status = payload.status || item.status || tool.status;
                    tool.ok = payload.ok === true;
                    tool.durationMs = Number(payload.durationMs) || tool.durationMs;
                    tool.resultPreview = summarizeForAnalysis(payload.result || payload.error || '', 900);
                    tool.outputStore = this.extractOutputStoreFromToolPayload(payload) || tool.outputStore;
                }
            }
        }

        return [...rounds.values()].sort((a, b) => a.iteration - b.iteration);
    }

    buildRunToolCalls(transcriptItems = []) {
        const calls = new Map();
        for (const item of transcriptItems) {
            const payload = item.payload || {};
            if (!['tool.call', 'tool.result'].includes(item.type)) {
                continue;
            }
            const callId = normalizeString(payload.callId || item.id);
            if (!callId) {
                continue;
            }
            const existing = calls.get(callId) || {
                callId,
                tool: payload.tool || '',
                startedAt: null,
                completedAt: null,
                status: 'started',
                ok: null,
                durationMs: 0,
                iteration: getPayloadIteration(payload),
                args: null,
                resultPreview: '',
                outputStore: null
            };
            if (item.type === 'tool.call') {
                existing.startedAt = analysisTimestamp(item);
                existing.tool = payload.tool || existing.tool;
                existing.args = payload.args || existing.args;
                existing.iteration = getPayloadIteration(payload);
            } else {
                existing.completedAt = analysisTimestamp(item);
                existing.tool = payload.tool || existing.tool;
                existing.status = payload.status || item.status || existing.status;
                existing.ok = payload.ok === true;
                existing.durationMs = Number(payload.durationMs) || existing.durationMs;
                existing.resultPreview = summarizeForAnalysis(payload.result || payload.error || '', 900);
                existing.outputStore = this.extractOutputStoreFromToolPayload(payload) || existing.outputStore;
            }
            calls.set(callId, existing);
        }
        return [...calls.values()].sort((a, b) => (a.startedAt || a.completedAt || 0) - (b.startedAt || b.completedAt || 0));
    }

    buildRunBottlenecks({ rounds = [], toolCalls = [], llmCalls = [], status = '' } = {}) {
        const candidates = [];
        for (const call of llmCalls) {
            candidates.push({
                kind: 'llm',
                label: `轮次 ${Number(call.iteration ?? 0) + 1} LLM ${call.model || call.provider || ''}`.trim(),
                durationMs: Number(call.durationMs) || 0,
                severity: call.ok === false ? 'high' : 'medium',
                detail: call.status || ''
            });
        }
        for (const tool of toolCalls) {
            candidates.push({
                kind: 'tool',
                label: `${tool.tool || 'tool'} ${tool.status || ''}`.trim(),
                durationMs: Number(tool.durationMs) || 0,
                severity: tool.ok === false ? 'high' : 'medium',
                detail: tool.resultPreview || ''
            });
        }
        for (const round of rounds) {
            candidates.push({
                kind: 'context',
                label: `${round.label} 输入上下文`,
                tokens: Number(round.approxInputTokens) || 0,
                severity: Number(round.approxInputTokens) > 24000 ? 'high' : 'low',
                detail: `${Number(round.approxInputTokens) || 0} approx tokens`
            });
        }
        const failedTool = toolCalls.find((tool) => tool.ok === false);
        const slowest = candidates
            .filter((entry) => Number(entry.durationMs) > 0 || Number(entry.tokens) > 0)
            .sort((a, b) => (b.durationMs || b.tokens || 0) - (a.durationMs || a.tokens || 0))
            .slice(0, 8);
        const primary = failedTool
            ? `首要问题可能在工具 ${failedTool.tool || failedTool.callId}：${failedTool.status || 'failed'}`
            : slowest[0]
                ? `最大开销来自 ${slowest[0].label}`
                : status && status !== 'completed'
                    ? `运行状态停在 ${status}`
                    : '未发现明显单点瓶颈';
        return {
            primary,
            items: slowest
        };
    }

    async analyzeAgentRun(runId, options = {}) {
        const id = normalizeString(runId);
        if (!id) {
            return {
                ok: false,
                status: 'missing_run_id',
                error: 'runId is required'
            };
        }
        const transcript = await this.runtime.readTranscript(id, Number(options.transcriptLimit || 2000));
        const transcriptItems = transcript.items || [];
        const auditEntries = (await this.readAuditEntries(1000)).filter((entry) => isRunAuditEntry(entry, id));
        const events = this.eventLog.filter((event) => isRunGatewayEvent(event, id));
        const timeline = this.buildRunTimeline({ transcriptItems, events, auditEntries });
        const rounds = this.buildRunRounds(transcriptItems);
        const toolCalls = this.buildRunToolCalls(transcriptItems);
        const llmCalls = rounds.flatMap((round) =>
            round.llmCalls.map((call) => ({
                ...call,
                iteration: round.iteration
            }))
        );
        const usageTotals = {
            promptTokens: 0,
            completionTokens: 0,
            totalTokens: 0,
            reasoningTokens: 0,
            cachedTokens: 0
        };
        for (const call of llmCalls) {
            addUsageTotals(usageTotals, call.usage || {});
        }
        const finalItem = [...transcriptItems].reverse().find((item) =>
            ['turn.completed', 'agent.final', 'agent.blocked', 'approval.requested'].includes(item.type)
        );
        const latestDebugPause = [...transcriptItems].reverse().find((item) => item.type === 'agent.debug.paused') || null;
        const latestDebugPauseActive = latestDebugPause &&
            (!finalItem || analysisTimestamp(latestDebugPause) >= analysisTimestamp(finalItem));
        const finalAudit = [...auditEntries].reverse().find((entry) => entry.type === 'agent.run') || null;
        const status = normalizeString(
            finalAudit?.status || finalItem?.status || finalItem?.payload?.status,
            transcript.ok ? 'running_or_partial' : transcript.status || 'not_found'
        );
        const ok = finalAudit ? finalAudit.ok === true : finalItem?.payload?.ok === true;
        const durationMs = Number(finalAudit?.durationMs ?? finalItem?.payload?.durationMs);
        const totalContextTokens = rounds.reduce((sum, round) => sum + (Number(round.approxInputTokens) || 0), 0);
        const bottlenecks = this.buildRunBottlenecks({ rounds, toolCalls, llmCalls, status });
        const outputArtifacts = toolCalls
            .filter((tool) => tool.outputStore?.outputId)
            .map((tool) => ({
                callId: tool.callId,
                tool: tool.tool,
                status: tool.status,
                iteration: tool.iteration,
                outputId: tool.outputStore.outputId,
                path: tool.outputStore.path || '',
                bytes: Number(tool.outputStore.bytes) || 0,
                lineCount: Number(tool.outputStore.lineCount) || 0,
                previewTruncated: tool.outputStore.previewTruncated === true
            }));
        return {
            ok: transcript.ok || auditEntries.length > 0 || events.length > 0,
            status,
            runId: id,
            sessionId: normalizeString(transcriptItems[0]?.sessionId || finalAudit?.args?.sessionId, 'main'),
            summary: {
                ok,
                status,
                durationMs: Number.isFinite(durationMs) ? durationMs : null,
                mode: finalAudit?.mode || finalItem?.payload?.mode || '',
                intent: finalAudit?.intent || finalItem?.payload?.intent || '',
                planner: finalAudit?.planner || finalItem?.payload?.planner || '',
                rounds: rounds.length,
                llmCalls: llmCalls.length,
                toolCalls: toolCalls.length,
                failedTools: toolCalls.filter((tool) => tool.ok === false).length,
                outputArtifacts: outputArtifacts.length,
                totalContextTokens,
                usage: usageTotals,
                primaryBottleneck: bottlenecks.primary,
                debugPaused: status === 'debug_paused' || Boolean(latestDebugPauseActive),
                debugSessionId: latestDebugPauseActive ? normalizeString(latestDebugPause?.payload?.debugSessionId) : '',
                pausedAtIteration: latestDebugPauseActive && Number.isFinite(Number(latestDebugPause?.payload?.iteration))
                    ? Number(latestDebugPause.payload.iteration)
                    : null,
                nextIteration: latestDebugPauseActive && Number.isFinite(Number(latestDebugPause?.payload?.nextIteration))
                    ? Number(latestDebugPause.payload.nextIteration)
                    : null
            },
            transcript: {
                ok: transcript.ok,
                status: transcript.status,
                path: transcript.transcriptPath || '',
                itemCount: transcriptItems.length
            },
            audit: {
                path: this.auditLogPath,
                entryCount: auditEntries.length
            },
            rounds,
            toolCalls,
            llmCalls,
            outputArtifacts,
            bottlenecks,
            timeline
        };
    }

    async runAgentAnalysis(request = {}) {
        const result = await this.runAgent(request || {});
        const runId = normalizeString(result?.runId || result?.result?.runId || result?.payload?.runId);
        const analysis = runId ? await this.analyzeAgentRun(runId, request.analysis || {}) : null;
        return {
            ok: result?.ok === true,
            status: result?.status || analysis?.status || 'completed',
            runId,
            result,
            analysis
        };
    }

    async continueAgentAnalysis(request = {}) {
        const debugSessionId = normalizeString(request.debugSessionId || request.context?.debugSessionId);
        const runId = normalizeString(request.runId || request.context?.runId);
        const result = await this.runAgent({
            ...(request || {}),
            debugSessionId,
            runId,
            agentLoop: 'llm',
            planner: 'llm',
            debugBreakAfterRound: request.debugBreakAfterRound !== false,
            context: {
                ...(request.context || {}),
                debugSessionId,
                runId,
                agentLoop: 'llm',
                planner: 'llm',
                debugBreakAfterRound: request.debugBreakAfterRound !== false
            }
        });
        const nextRunId = normalizeString(result?.runId || result?.result?.runId || result?.payload?.runId || runId);
        const analysis = nextRunId ? await this.analyzeAgentRun(nextRunId, request.analysis || {}) : null;
        return {
            ok: result?.ok === true,
            status: result?.status || analysis?.status || 'completed',
            runId: nextRunId,
            result,
            analysis
        };
    }
}

module.exports = {
    DEFAULT_PORT,
    AILISGateway
};
