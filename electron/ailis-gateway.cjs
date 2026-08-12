const http = require('http');
const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');
const { EventEmitter } = require('events');
const { randomUUID } = require('crypto');
const { pathToFileURL } = require('url');
const { approxTokenCount, summarizeForModel } = require('./ailis-runtime-budget.cjs');
const {
    normalizeToolOutput,
    toolOutputToThreadItem
} = require('./ailis-agent-object-model.cjs');
const {
    attachObservationContract
} = require('./ailis-observation-contract.cjs');
const {
    runtimeEventMetadata
} = require('./ailis-agent-runtime-protocol.cjs');

const {
    OPENCLAW_CORE_TOOL_DEFINITIONS,
    OPENCLAW_OPTIONAL_RUNTIME_TOOL_DEFINITIONS,
    OPENCLAW_CHANNEL_MCP_TOOL_DEFINITIONS,
    getOpenClawToolSurfaceSummary,
    validateOpenClawToolSurface
} = require('./openclaw-tool-surface.cjs');
const { AILISAgentRuntimeSupervisor } = require('./openclaw-runtime.cjs');
const { AILISRuntime } = require('./ailis-runtime.cjs');
const {
    TOOL_EXPOSURE,
    AILISRuntimeTool,
    AILISToolRuntimeRegistry
} = require('./ailis-tool-runtime.cjs');
const { createAILISPlatformAdapter } = require('./ailis-platform-adapter.cjs');
const { AILISAgentRunner } = require('./ailis-agent-runner.cjs');
const { AILISMemoryRuntime } = require('./ailis-memory-store.cjs');
const { AILISRawMemoryLedger } = require('./ailis-raw-memory-ledger.cjs');
const { AILISUserProfileCurator } = require('./ailis-user-profile-curator.cjs');
const { AILISPreferenceState } = require('./ailis-preference-state.cjs');
const { AILISTaskResultCapsuleStore } = require('./ailis-task-result-capsules.cjs');
const { AILISSystemTaskAgentHarness } = require('./ailis-task-agent-harness.cjs');
const { AilisSelfEvolutionRuntime } = require('./ailis-self-evolution-runtime.cjs');
const { AILISEmberHarness } = require('./ailis-ember-harness.cjs');
const { AILISSensitiveWordClassifier } = require('./ailis-sensitive-word-classifier.cjs');
const {
    listToolContracts,
    validateToolContract
} = require('./ailis-tool-contracts.cjs');
const EMAIL_TOOL_ID = 'email';
const TASK_RESULTS_TOOL_ID = 'task_results';
const HANDOFF_TASK_TOOL_ID = 'handoff_task';
const TASK_ROUTE_TOOL_ID = 'task_route';
const TASK_GOAL_TOOL_ID = 'task_goal';
const WEB_RUN_TOOL_ID = 'web_run';
const WEB_SEARCH_TOOL_ID = 'web_search';
const { FILE_MANAGER_TOOL_ID, executeFileManagerTool } = require('./ailis-file-manager-tool.cjs');
const { COMPUTER_TOOL_ID, AILISComputerTool } = require('./ailis-computer-tool.cjs');
const { CODE_TOOL_ID, executeCodeTool } = require('./ailis-code-tool.cjs');
const { ARTIFACT_VERIFIER_TOOL_ID, executeArtifactVerifierTool } = require('./ailis-artifact-verifier-tool.cjs');
const { ARTIFACT_IMPORT_TOOL_ID, executeArtifactImportTool } = require('./ailis-artifact-import-tool.cjs');
const { GITHUB_PAGES_TOOL_ID, executeGitHubPagesTool } = require('./ailis-github-pages-tool.cjs');
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
    rankToolSearchResults
} = require('./ailis-tool-routing.cjs');
const {
    createAilisDirectMcpToolSpec,
    parseAilisDirectMcpToolId
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
const DEFAULT_HTTP_REQUEST_TIMEOUT_MS = Math.max(0, Number(process.env.AILIS_GATEWAY_HTTP_REQUEST_TIMEOUT_MS || 0) || 0);
const DEFAULT_PROFILE_CURATION_START_DELAY_MS = Number(process.env.AILIS_PROFILE_CURATION_START_DELAY_MS || 60 * 1000);
const DEFAULT_PROFILE_CURATION_CHECK_INTERVAL_MS = Number(process.env.AILIS_PROFILE_CURATION_CHECK_INTERVAL_MS || 6 * 60 * 60 * 1000);
const DEFAULT_PROFILE_CURATION_DEBOUNCE_MS = Number(process.env.AILIS_PROFILE_CURATION_DEBOUNCE_MS || 2 * 60 * 1000);
const PERSONA_TASK_PROGRESS_MIN_INTERVAL_MS = Math.max(
    15000,
    Number(process.env.AILIS_PERSONA_TASK_PROGRESS_MIN_INTERVAL_MS || 45000) || 45000
);
const PERSONA_STREAM_FLUSH_INTERVAL_MS = Math.max(
    16,
    Number(process.env.AILIS_PERSONA_STREAM_FLUSH_INTERVAL_MS || 40) || 40
);
const PERSONA_DRAFT_DEVELOPER_PACKET = [
    'Prepare one private candidate FinalAnswer for this user Turn while TaskAgent independently decides whether the Turn is conversation or execution.',
    'Your candidate is published only if TaskAgent chooses chat. Do not acknowledge, promise, or narrate task execution, because TaskAgent owns Commentary and task results.',
    'Answer ordinary conversation naturally and completely from the visible Session context.',
    'The latest user message and visible Session history are authoritative, including any correction or steer that replaced an earlier instruction in the same Turn.',
    'Do not describe the internal actors, routing, event channel, or orchestration.'
].join('\n');
const TASK_AGENT_PUBLIC_EVENT_TYPES = new Set([
    'task_agent.route.decided',
    'agent.progress.note'
]);

const GATEWAY_BACKED_TOOL_IDS = new Set(['sessions_list', 'gateway', 'cron', 'nodes']);
const SESSION_BOUND_TOOL_IDS = new Set([
    'session_status',
    'sessions_history',
    'sessions_send'
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
    'persona.background.message',
    'task.background.started',
    'task.background.finished',
    'agent.plan.updated',
    'context_artifact.created',
    'subagent.event',
    'mcp.tool.call.begin',
    'mcp.tool.call.end',
    'mcp.resource.read.begin',
    'mcp.resource.read.end'
]);
const LOSSLESS_EVENT_PREFIXES = ['approval.', 'subagent.', 'mcp.', 'agent.', 'ember.'];
const CODEX_STYLE_DIRECT_LOCAL_TOOL_IDS = new Set([
    'write',
    'exec',
    'apply_patch',
    WEB_RUN_TOOL_ID,
    HANDOFF_TASK_TOOL_ID,
    TASK_ROUTE_TOOL_ID,
    TASK_GOAL_TOOL_ID
]);
// Extended tools stay out of the first-turn tool surface, but remain discoverable
// through tool_search. The Registry is the source of truth for their full specs.
const EXTENDED_LOCAL_TOOL_EXPOSURE = TOOL_EXPOSURE.DEFERRED;

const WEB_RUN_DESCRIPTION = fs.readFileSync(
    path.join(__dirname, 'ailis-web-run-description.md'),
    'utf8'
).replace(/\r\n/g, '\n').trim();

function collectSuggestedMcpToolNames(value, maxDepth = 8) {
    const names = new Set();
    const seen = new Set();
    const visit = (entry, depth = 0) => {
        if (!entry || depth > maxDepth || typeof entry !== 'object' || seen.has(entry)) {
            return;
        }
        seen.add(entry);
        if (Array.isArray(entry)) {
            entry.slice(0, 64).forEach((item) => visit(item, depth + 1));
            return;
        }
        const tool = normalizeString(entry.tool || entry.tool_name || entry.toolName);
        const args = entry.args || entry.arguments;
        if (tool && args && typeof args === 'object' && !Array.isArray(args)) {
            names.add(tool);
        }
        Object.values(entry).forEach((item) => visit(item, depth + 1));
    };
    visit(value);
    return [...names];
}

async function attachSuggestedMcpToolsForDirectExposure(result, sourceToolId, mcpManager, timeoutMs = 8000) {
    if (!result || typeof result !== 'object' || !mcpManager) {
        return [];
    }
    const source = parseAilisDirectMcpToolId(sourceToolId);
    if (!source?.server) {
        return [];
    }
    const suggestedNames = collectSuggestedMcpToolNames(result);
    if (!suggestedNames.length) {
        return [];
    }
    const wanted = new Set(suggestedNames.map((name) => normalizeString(name).toLowerCase()));
    const specs = await mcpManager.listToolSpecs(source.server, timeoutMs).catch(() => []);
    const directTools = specs
        .filter((spec) => wanted.has(normalizeString(spec.tool || spec.name).toLowerCase()))
        .map((spec) => createAilisDirectMcpToolSpec({
            id: spec.id,
            server: spec.server || source.server,
            tool: spec.tool || spec.name,
            name: spec.name,
            title: spec.title,
            description: spec.description || spec.title || '',
            inputSchema: spec.inputSchema || spec.input_schema || spec.parameters || {},
            schemaProperties: spec.schemaProperties || spec.schema_properties,
            callPattern: spec.callPattern || spec.call_pattern
        }))
        .filter((spec) => spec.callable !== false && spec.modelFacing !== false);
    if (directTools.length) {
        Object.defineProperty(result, '__ailisSuggestedMcpTools', {
            value: directTools,
            enumerable: false,
            configurable: true
        });
    }
    return directTools;
}

const AILIS_LOCAL_TOOL_DEFINITIONS = Object.freeze([
    Object.freeze({
        id: WEB_RUN_TOOL_ID,
        label: 'web.run',
        description: WEB_RUN_DESCRIPTION,
        modelDescriptionChars: 9000,
        parseToolInputSchemaWithoutCompaction: true,
        // The mutually exclusive operation fields are runtime-validated.
        // Provider strict mode cannot represent this optional-field union portably.
        strict: false,
        sectionId: 'web',
        route: 'ailis-research-mcp',
        materialized: true,
        status: 'available',
        needsApprovalActions: Object.freeze([])
    }),
    Object.freeze({
        id: WEB_SEARCH_TOOL_ID,
        label: 'web_search',
        description: 'Legacy single-query public web search kept for compatibility. New model turns use web_run.',
        sectionId: 'web',
        route: 'ailis-research-mcp',
        materialized: true,
        status: 'available',
        needsApprovalActions: Object.freeze([])
    }),
    Object.freeze({
        id: HANDOFF_TASK_TOOL_ID,
        label: 'handoff_task',
        description: 'Transfer execution control to the session\'s persistent system TaskAgent. The tool accepts no task text: TaskAgent reads the same canonical visible Session conversation as Persona, so the latest message may be only a continuation such as "继续" or "速度". The Harness owns context attachment, thread identity, checkpointing, execution, and result transport.',
        sectionId: 'persona-runtime',
        route: 'ailis-system-task-agent',
        materialized: true,
        status: 'available',
        needsApprovalActions: Object.freeze([])
    }),
    Object.freeze({
        id: TASK_ROUTE_TOOL_ID,
        label: 'task_route',
        description: 'Internal first-step control for the persistent TaskAgent. Choose chat when Persona can answer the current Turn without task execution; choose execute to continue immediately in the same TaskAgent run. Do not summarize or rewrite the user request.',
        sectionId: 'task-agent-runtime',
        route: 'ailis-system-task-agent',
        materialized: true,
        status: 'available',
        needsApprovalActions: Object.freeze([])
    }),
    Object.freeze({
        id: TASK_GOAL_TOOL_ID,
        label: 'task_goal',
        description: 'Read or update the optional persistent Goal for the current TaskAgent Session. The TaskAgent model owns Goal semantics; the runtime only validates and persists set, complete, clear, and get operations bound to the active Turn.',
        sectionId: 'task-agent-runtime',
        route: 'ailis-system-task-agent',
        materialized: true,
        status: 'available',
        needsApprovalActions: Object.freeze([])
    }),
    Object.freeze({
        id: TASK_RESULTS_TOOL_ID,
        label: 'task_results',
        description: 'Read-only access to AILIS public results from earlier completed work. Search relevant results or retrieve one result by id; this never reruns the task.',
        sectionId: 'persona-context',
        route: 'ailis-local',
        materialized: true,
        status: 'available',
        needsApprovalActions: Object.freeze([])
    }),
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
        id: ARTIFACT_IMPORT_TOOL_ID,
        label: 'artifact_import',
        description: 'Import local files through extracted RAGFlow-lite artifact workers and register queryable AILIS context artifacts.',
        sectionId: 'context-artifacts',
        route: 'ailis-local',
        materialized: true,
        status: 'available',
        needsApprovalActions: Object.freeze([])
    }),
    Object.freeze({
        id: GITHUB_PAGES_TOOL_ID,
        label: 'github_pages',
        description: 'Read-only GitHub Pages and gh-pages deployment diagnostics with blockers and verification records.',
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
    return includeDirect === true || entry.exposure !== TOOL_EXPOSURE.DIRECT;
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

function formatGatewayToolError(error) {
    const message = normalizeString(error?.message || String(error), 'tool call failed');
    const validationErrors = Array.isArray(error?.details?.errors)
        ? error.details.errors.map((entry) => normalizeString(entry)).filter(Boolean)
        : [];
    return validationErrors.length
        ? `${message}: ${validationErrors.join('; ')}`
        : message;
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

function normalizedSearchTokens(value = '') {
    return [...new Set(
        normalizeString(value)
            .toLowerCase()
            .match(/[\p{L}\p{N}]{2,}/gu) || []
    )];
}

function looksLikeHistoricalWebStateQuestion(value = '') {
    const text = normalizeString(value);
    const hasPastAnchor =
        /\b(?:as[- ]of|historical(?:ly)?|past state|at (?:the )?(?:time|end|start)|before|during)\b/i.test(text) ||
        /\b(?:in|on|from)\s+(?:19|20)\d{2}\b/i.test(text) ||
        /\b(?:19|20)\d{2}\s+(?:version|listing|record|result|state|catalog)\b/i.test(text);
    const namesWebState =
        /\b(?:website|webpage|site|database|catalog|registry|index|api|oai|search results?|listed|listing|record)\b/i.test(text);
    return hasPastAnchor && namesWebState;
}

function historicalArchiveUrlFromQueries(queries = []) {
    for (const query of Array.isArray(queries) ? queries : []) {
        const text = normalizeString(query?.q);
        const directUrl = text.match(/https?:\/\/[^\s"'<>]+/i)?.[0]
            ?.replace(/[),.;:!?]+$/, '');
        if (directUrl) {
            return directUrl;
        }
        const siteMatch = text.match(/\bsite:([a-z0-9.-]+)(\/[^\s"'<>]*)?/i);
        if (siteMatch?.[1]) {
            const pathPart = normalizeString(siteMatch[2]).replace(/[),.;:!?]+$/, '');
            return `https://${siteMatch[1]}${pathPart || ''}`;
        }
        const domain = (Array.isArray(query?.domains) ? query.domains : [])
            .map((entry) => normalizeString(entry))
            .find(Boolean);
        if (domain) {
            return /^https?:\/\//i.test(domain) ? domain : `https://${domain}`;
        }
    }
    return '';
}

function isEvaluationAnswerLeak(sourceQuestion = '', result = {}) {
    const questionTokens = normalizedSearchTokens(sourceQuestion);
    if (questionTokens.length < 5) {
        return false;
    }
    const text = [
        result?.title,
        result?.snippet,
        result?.content
    ].map((value) => normalizeString(value)).filter(Boolean).join(' ');
    if (!/\b(?:ground truth|reference answer|expected answer|gold answer|correct answer)\s*[:=-]/i.test(text)) {
        return false;
    }
    const resultTokens = new Set(normalizedSearchTokens(text));
    const matched = questionTokens.filter((token) => resultTokens.has(token)).length;
    return matched / questionTokens.length >= 0.65;
}

function isEvaluationTaskMirror(sourceQuestion = '', result = {}) {
    const questionTokens = normalizedSearchTokens(sourceQuestion);
    if (questionTokens.length < 5) {
        return false;
    }
    const url = normalizeString(result?.url).toLowerCase();
    const text = [
        result?.title,
        result?.snippet,
        result?.content
    ].map((value) => normalizeString(value)).filter(Boolean).join(' ');
    const resultTokens = new Set(normalizedSearchTokens(text));
    const matched = questionTokens.filter((token) => resultTokens.has(token)).length;
    const repeatsQuestion = matched / questionTokens.length >= 0.72;
    const looksLikeEvaluationCorpus =
        /(?:^|[./_-])(?:gaia|benchmark|benchmarks|magentic_dataset|agent.?rx|harbor-datasets)(?:[./_-]|$)/i.test(url) ||
        /\b(?:gaia task|benchmark task|evaluation task|output requirements|write only the final answer)\b/i.test(text);
    return repeatsQuestion && looksLikeEvaluationCorpus;
}

function cloneJson(value) {
    try {
        return JSON.parse(JSON.stringify(value));
    } catch {
        return value;
    }
}

function firstObject(...values) {
    return values.find((value) => value && typeof value === 'object' && !Array.isArray(value)) || {};
}

function bridgeStructuredContent(result = {}) {
    return firstObject(
        result.structuredContent?.result?.structuredContent,
        result.structured_content?.result?.structured_content,
        result.details?.result?.structuredContent,
        result.details?.result?.structured_content,
        result.details?.result?.details,
        result.result?.structuredContent,
        result.result?.structured_content,
        result.result?.details?.result?.structuredContent,
        result.result?.details?.result?.structured_content,
        result.structuredContent,
        result.structured_content,
        result.result?.details,
        result.details
    );
}

function bridgeTextContent(result = {}) {
    const content = Array.isArray(result.content)
        ? result.content
        : Array.isArray(result.result?.content)
        ? result.result.content
        : Array.isArray(result.details?.result?.content)
        ? result.details.result.content
        : [];
    return content.map((item) => normalizeString(item?.text)).filter(Boolean).join('\n');
}

function sourceViewportSectionLinks(sourceViews = [], pageUrl = '') {
    let page;
    try {
        page = new URL(pageUrl);
        page.hash = '';
    } catch {
        return [];
    }
    const links = [];
    const seen = new Set();
    const pattern = /\[([^\]\n]{1,200})\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
    for (const sourceView of sourceViews) {
        const lines = Array.isArray(sourceView?.lines) ? sourceView.lines : [];
        for (const line of lines) {
            const text = normalizeString(line?.text || line?.rendered);
            pattern.lastIndex = 0;
            let match;
            while ((match = pattern.exec(text))) {
                const label = normalizeString(match[1]).replace(/\s+/g, ' ');
                if (!label || /^(?:jump to content|\(?top\)?)$/i.test(label)) {
                    continue;
                }
                let target;
                try {
                    target = new URL(match[2], pageUrl);
                } catch {
                    continue;
                }
                if (!target.hash) {
                    continue;
                }
                const targetDocument = new URL(target.toString());
                targetDocument.hash = '';
                if (targetDocument.toString() !== page.toString() || seen.has(target.toString())) {
                    continue;
                }
                seen.add(target.toString());
                let fragment = target.hash.slice(1);
                try {
                    fragment = decodeURIComponent(fragment);
                } catch {
                    // Keep the raw fragment when percent-decoding is invalid.
                }
                links.push({
                    kind: 'section',
                    text: label,
                    url: target.toString(),
                    pattern: normalizeString(fragment.replace(/_/g, ' '), label),
                    navigationMode: 'find',
                    navigation_mode: 'find'
                });
            }
        }
    }
    return links.slice(0, 12);
}

function isFullControlContext(context = {}) {
    const rawProfile = typeof context.permissionProfile === 'string'
        ? context.permissionProfile
        : context.permissionProfile?.id || context.permissions || context.policy || context.sandbox;
    const profile = normalizeString(rawProfile).toLowerCase();
    return (
        profile === 'danger-full-access' ||
        profile === 'full-access' ||
        context.allowComputerWideAccess === true ||
        (context.computerControlEnabled === true && context.allowOutsideWorkspace === true)
    );
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
    const sourceStatus = normalizeString(result?.details?.status).toLowerCase();
    const genericStatuses = new Set([
        '',
        'completed',
        'success',
        'ok',
        'partial',
        'degraded',
        'blocked',
        'failed',
        'error'
    ]);
    const observationContract =
        result?.details?.observationContract ||
        result?.details?.observation_contract ||
        result?.structuredContent?.observationContract ||
        result?.structuredContent?.observation_contract ||
        {};
    if (sourceStatus && !genericStatuses.has(sourceStatus)) {
        return sourceStatus;
    }
    if (typeof observationContract.status === 'string') {
        return observationContract.status;
    }
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

function extractToolSearchToolsForDirectExposure(result = {}) {
    const tools =
        result?.__ailisRawToolSearchTools ||
        result?.structuredContent?.tools ||
        result?.details?.tools ||
        [];
    return Array.isArray(tools) ? tools : [];
}

function compactToolSearchSchemaForModel(schema = {}) {
    const source = schema && typeof schema === 'object' && !Array.isArray(schema) ? schema : {};
    const properties = source.properties && typeof source.properties === 'object' && !Array.isArray(source.properties)
        ? source.properties
        : {};
    const compactProperties = Object.fromEntries(Object.entries(properties).slice(0, 16).map(([name, property]) => {
        const value = property && typeof property === 'object' && !Array.isArray(property) ? property : {};
        return [name, {
            ...(value.type ? { type: value.type } : {}),
            ...(Array.isArray(value.enum) ? { enum: value.enum.slice(0, 16) } : {}),
            ...(value.description ? { description: summarizeForModel(value.description, 240) } : {})
        }];
    }));
    return {
        type: 'object',
        properties: compactProperties,
        required: (Array.isArray(source.required) ? source.required : []).filter((name) => name in compactProperties),
        additionalProperties: source.additionalProperties === true
    };
}

function compactToolSearchEntryForModel(entry = {}) {
    const spec = entry.spec && typeof entry.spec === 'object' ? entry.spec : {};
    const schema = entry.input_schema || entry.inputSchema || entry.parameters || spec.parameters || {};
    const id = normalizeString(entry.id || entry.name || spec.name);
    const searchError = normalizeString(entry.type).endsWith('_search_error');
    const callable = Boolean(id) &&
        !searchError &&
        entry.callable !== false &&
        spec.callable !== false;
    const availability = normalizeString(
        entry.availability ||
        entry.health ||
        entry.status ||
        spec.availability ||
        spec.health ||
        spec.status,
        callable ? 'available' : 'unavailable'
    );
    return {
        id,
        name: id === VISION_TOOL_ID
            ? 'vision_capture_context'
            : normalizeString(entry.name || spec.name || id),
        description: summarizeForModel(
            entry.description || spec.description || entry.summary || entry.title || id,
            420
        ),
        input_schema: compactToolSearchSchemaForModel(schema),
        strict: entry.strict === true || spec.strict === true || schema.additionalProperties === false,
        callable,
        availability,
        spec_ref: `tool_registry:${id}`
    };
}

function attachRawToolSearchToolsForDirectExposure(guardedResult, rawResult) {
    if (!guardedResult || typeof guardedResult !== 'object') {
        return;
    }
    const tools = extractToolSearchToolsForDirectExposure(rawResult);
    if (!tools.length) {
        return;
    }
    Object.defineProperty(guardedResult, '__ailisRawToolSearchTools', {
        value: tools,
        enumerable: false,
        configurable: true
    });
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
    if (error instanceof GatewayHttpError && normalizeString(error.code)) {
        return normalizeString(error.code);
    }
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

function summarizeEmberHarnessRecord(record = {}) {
    if (!record || typeof record !== 'object') {
        return record;
    }
    const snapshot = record.snapshot && typeof record.snapshot === 'object'
        ? {
            snapshotId: record.snapshot.snapshotId,
            stage: record.snapshot.stage,
            boundary: record.snapshot.boundary,
            textHash: record.snapshot.textHash,
            textChars: record.snapshot.textChars,
            approxTokens: record.snapshot.approxTokens
        }
        : null;
    const rollbackTo = record.rollbackTo && typeof record.rollbackTo === 'object'
        ? {
            snapshotId: record.rollbackTo.snapshotId,
            stage: record.rollbackTo.stage,
            boundary: record.rollbackTo.boundary,
            textHash: record.rollbackTo.textHash
        }
        : null;
    return {
        schema: record.schema,
        checkId: record.checkId,
        runId: record.runId,
        sessionId: record.sessionId,
        stage: record.stage,
        boundary: record.boundary,
        mode: record.mode,
        status: record.status,
        decision: record.decision,
        blocked: record.blocked,
        riskLevel: record.riskLevel,
        riskTypes: record.riskTypes,
        summary: record.summary,
        suggestion: record.suggestion,
        evaluatorConfigured: record.evaluatorConfigured,
        snapshot,
        rollbackTo
    };
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
        this.rawMemoryLedger = options.rawMemoryLedger || new AILISRawMemoryLedger({
            rootDir: path.join(this.auditDir, 'raw-memory'),
            workspaceRoot: this.workspaceRoot
        });
        this.runtime = new AILISRuntime({
            auditDir: this.auditDir,
            workspaceRoot: this.workspaceRoot,
            projectRoot: this.projectRoot,
            platformAdapter: this.platformAdapter,
            rawMemoryLedger: this.rawMemoryLedger,
            emitGatewayEvent: (type, payload) => this.emitGatewayEvent(type, payload),
            mcpServers: options.mcpServers,
            mcpConfigPath: options.mcpConfigPath || path.join(this.auditDir, 'mcp-servers.json'),
            disableBuiltinAilisResearchMcp: options.disableBuiltinAilisResearchMcp,
            agentExecutor: (payload) => this.executeTaskAgent(payload)
        });
        this.server = null;
        this.startedAt = 0;
        this.sseClients = new Set();
        this.eventSeq = 0;
        this.eventLog = [];
        this.privateRunIds = new Set();
        this.backgroundTaskRuns = new Set();
        this.activePersonaTurns = new Map();
        this.eventLogLimit = Math.max(
            100,
            Math.min(Number(options.eventLogLimit || DEFAULT_EVENT_REPLAY_LIMIT), MAX_EVENT_REPLAY_LIMIT)
        );
        this.httpRequestTimeoutMs = Math.max(
            0,
            Number(options.httpRequestTimeoutMs ?? options.requestTimeoutMs ?? DEFAULT_HTTP_REQUEST_TIMEOUT_MS) || 0
        );
        this.toolRuntimeModulePromise = null;
        this.toolSets = new Map();
        this.webRunSessions = new Map();
        this.toolRuntimeSupervisor = null;
        this.profileCurationEnabled = options.profileCurationEnabled !== false;
        this.profileCurationStartDelayMs = Math.max(1000, Number(options.profileCurationStartDelayMs) || DEFAULT_PROFILE_CURATION_START_DELAY_MS);
        this.profileCurationCheckIntervalMs = Math.max(60 * 1000, Number(options.profileCurationCheckIntervalMs) || DEFAULT_PROFILE_CURATION_CHECK_INTERVAL_MS);
        this.profileCurationStartTimer = null;
        this.profileCurationIntervalTimer = null;
        this.profileCurationDebounceTimer = null;
        this.profileCurationDebounceMs = Math.max(5000, Number(options.profileCurationDebounceMs) || DEFAULT_PROFILE_CURATION_DEBOUNCE_MS);
        this.profileCurationRunning = false;
        this.computerTool = options.computerTool || new AILISComputerTool({
            workspaceRoot: this.workspaceRoot,
            platformAdapter: this.platformAdapter
        });
        this.directLocalToolIds = Array.isArray(options.directLocalToolIds)
            ? new Set(options.directLocalToolIds.map((id) => normalizeString(id)).filter(Boolean))
            : null;
        this.toolAllowlist = Array.isArray(options.toolAllowlist)
            ? new Set(options.toolAllowlist.map((id) => normalizeString(id)).filter(Boolean))
            : null;
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
        this.preferenceState = options.preferenceState || new AILISPreferenceState({
            rootDir: path.join(this.auditDir, 'memory')
        });
        this.taskResultCapsules = options.taskResultCapsules || new AILISTaskResultCapsuleStore({
            rootDir: path.join(this.auditDir, 'task-results')
        });
        this.taskAgentHarness = options.taskAgentHarness || new AILISSystemTaskAgentHarness({
            rootDir: path.join(this.auditDir, 'task-agent-harness'),
            taskResultCapsules: this.taskResultCapsules,
            executeTaskAgent: (payload) => this.executeTaskAgent(payload),
            emitEvent: (type, payload) => this.emitGatewayEvent(type, payload)
        });
        this.taskResultBackfill = { ok: true, imported: 0, capsuleCount: this.taskResultCapsules?.getStatus?.().capsuleCount || 0 };
        try {
            const memoryEvents = this.memoryRuntime?.searchMemory?.('', { limit: 500 })?.events || [];
            this.taskResultBackfill = this.taskResultCapsules?.backfillFromMemoryEvents?.(memoryEvents) || this.taskResultBackfill;
        } catch (error) {
            this.taskResultBackfill = {
                ok: false,
                imported: 0,
                error: error?.message || String(error)
            };
        }
        const configuredEmberEvaluator = typeof options.emberHarnessEvaluator === 'function'
            ? options.emberHarnessEvaluator
            : null;
        this.localSafetyEvaluator = options.localSafetyEvaluator || options.localSafetyClassifier || (
            !options.emberHarness && !configuredEmberEvaluator
                ? new AILISSensitiveWordClassifier({
                    customLexiconPath: options.emberHarnessLexiconPath ||
                        path.join(this.auditDir, 'safety', 'sensitive-words.json')
                })
                : null
        );
        const activeEmberEvaluator = configuredEmberEvaluator || (
            this.localSafetyEvaluator
                ? (payload) => this.localSafetyEvaluator.evaluate(payload)
                : null
        );
        this.emberHarness = options.emberHarness || new AILISEmberHarness({
            enabled: options.emberHarnessEnabled,
            mode: options.emberHarnessMode,
            evaluator: activeEmberEvaluator,
            evaluatorStatus: this.localSafetyEvaluator
                ? () => this.localSafetyEvaluator.getStatus()
                : null,
            maxRunRecords: options.emberHarnessMaxRunRecords,
            maxTotalRecords: options.emberHarnessMaxTotalRecords
        });
        this.userProfileCurator = options.userProfileCurator || new AILISUserProfileCurator({
            rootDir: path.join(this.auditDir, 'memory'),
            workspaceRoot: this.workspaceRoot,
            rawMemoryLedger: this.rawMemoryLedger,
            preferenceState: this.preferenceState,
            llmClient: typeof options.profileCurationLlm === 'function' ? options.profileCurationLlm : null,
            emitGatewayEvent: (type, payload) => this.emitGatewayEvent(type, payload)
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

    configureEmberHarness(options = {}) {
        const enabled = options.enabled !== undefined
            ? options.enabled !== false
            : this.emberHarness?.enabled !== false;
        const harnessPatch = { enabled };
        if ('mode' in options) {
            harnessPatch.mode = options.mode;
        }
        const status = this.emberHarness?.configure?.(harnessPatch) || null;
        if (this.localSafetyEvaluator) {
            if (enabled) {
                void this.prepareLocalSafetyEvaluator('configuration_changed');
            } else {
                void this.localSafetyEvaluator.dispose().catch(() => {});
            }
        }
        this.emitGatewayEvent('ember.harness.configured', {
            enabled,
            mode: status?.mode || options.mode || 'observe',
            status
        });
        return this.emberHarness?.getStatus?.() || status;
    }

    async prepareLocalSafetyEvaluator(reason = 'manual') {
        if (!this.localSafetyEvaluator || this.emberHarness?.enabled === false) {
            return this.emberHarness?.getStatus?.() || null;
        }
        this.emitGatewayEvent('ember.harness.evaluator', {
            reason,
            status: this.localSafetyEvaluator.getStatus()
        });
        try {
            await this.localSafetyEvaluator.prepare();
        } catch {}
        const status = this.emberHarness?.getStatus?.() || null;
        this.emitGatewayEvent('ember.harness.evaluator', {
            reason,
            status: status?.evaluatorRuntime || null
        });
        return status;
    }

    createGatewayToolRuntimeRegistry() {
        const registry = new AILISToolRuntimeRegistry({ runtime: this.runtime });
        const directLocalToolIds = this.directLocalToolIds || CODEX_STYLE_DIRECT_LOCAL_TOOL_IDS;
        const toolAllowed = (id) => !this.toolAllowlist || this.toolAllowlist.has(id);
        const localDefinitions = [
            ...AILIS_LOCAL_TOOL_DEFINITIONS.map((definition) => ({
                ...definition,
                exposure: directLocalToolIds.has(definition.id)
                    ? TOOL_EXPOSURE.DIRECT
                    : EXTENDED_LOCAL_TOOL_EXPOSURE
            })),
            ...['read', 'write', 'exec', 'apply_patch'].map((id) => {
                const toolSurfaceDefinition = OPENCLAW_CORE_TOOL_DEFINITIONS.find((tool) => tool.id === id) || {};
                return {
                    id,
                    label: toolSurfaceDefinition.label || id,
                    description: toolSurfaceDefinition.description || `Local core ${id} tool.`,
                    sectionId: toolSurfaceDefinition.sectionId || 'local-core',
                    route: 'ailis-local-core',
                    materialized: true,
                    status: 'available',
                    needsApprovalActions: id === 'exec' ? Object.freeze(['exec']) : id === 'apply_patch' ? Object.freeze(['apply_patch']) : Object.freeze([]),
                    exposure: directLocalToolIds.has(id)
                        ? TOOL_EXPOSURE.DIRECT
                        : EXTENDED_LOCAL_TOOL_EXPOSURE
                };
            })
        ].filter((definition) => toolAllowed(definition.id));
        for (const definition of localDefinitions) {
            registry.register(new AILISRuntimeTool({
                definition,
                handle: async (args, context) => this.executeGatewayLocalTool(definition.id, args, context)
            }));
        }
        for (const definition of this.runtime.getRuntimeToolDefinitions().filter((entry) => toolAllowed(entry.id))) {
            if (definition.id === 'tool_search') {
                registry.register(new AILISRuntimeTool({
                    definition: {
                        ...definition,
                        route: 'ailis-gateway',
                        description: 'Tool discovery. Searches deferred tool metadata and exposes matching tools for the next Agent step. Use it as soon as the visible direct tools are a poor semantic fit or would require manually reconstructing structured facts, cross-record ordering, entity resolution, document parsing, transcripts, APIs, or artifact data. When a user names an authoritative database, registry, service, or file type and asks for structured fields, call tool_search before broad web_run discovery; use web_run only to discover a connector prerequisite, then return to the connector.',
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
        const retrievalLimit = Math.max(limit, Math.min(50, Math.max(12, limit * 4)));
        const includeDirect = args.includeDirect === true;
        const local = this.gatewayToolRuntimeRegistry.search(query, retrievalLimit)
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
                    limit: retrievalLimit,
                    timeoutMs: args.timeoutMs
                }))
                    .map((spec) => createAilisDirectMcpToolSpec({
                        id: spec.id,
                        server: spec.server,
                        tool: spec.tool || spec.name,
                        name: spec.name,
                        title: spec.title,
                        description: spec.description || spec.title || '',
                        inputSchema: spec.inputSchema || spec.input_schema || spec.parameters || {},
                        schemaProperties: spec.schemaProperties || spec.schema_properties,
                        callPattern: spec.callPattern || spec.call_pattern
                    }))
                    .filter((spec) => spec.callable !== false && spec.modelFacing !== false);
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
                    limit: retrievalLimit,
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
        const publicTools = tools.map(compactToolSearchEntryForModel);
        const recommendedTool = publicTools.find((entry) => entry.callable) || null;
        const routingAdvice = recommendedTool ? buildToolRoutingAdvice(query, tools) : '';
        const discovery = {
            status: 'completed',
            query,
            routing_advice: routingAdvice,
            recommended_tool: recommendedTool
                ? {
                      id: recommendedTool.id,
                      name: recommendedTool.name,
                      callable: true,
                      availability: recommendedTool.availability
                  }
                : null,
            tools: publicTools
        };
        const result = {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify(discovery, null, 2)
                }
            ],
            details: {
                ...discovery
            },
            structuredContent: {
                ...discovery
            }
        };
        Object.defineProperty(result, '__ailisRawToolSearchTools', {
            value: tools,
            enumerable: false,
            configurable: true
        });
        return result;
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
            return this.getStatus({ includeAgentRunner: false });
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
        this.server.requestTimeout = this.httpRequestTimeoutMs;
        this.server.timeout = this.httpRequestTimeoutMs;

        await new Promise((resolve, reject) => {
            this.server.once('error', reject);
            this.server.listen(this.port, this.host, () => {
                this.server.off('error', reject);
                this.startedAt = Date.now();
                resolve();
            });
        });

        this.emitGatewayEvent('gateway.started', this.getStatus({ includeAgentRunner: false }));
        this.startProfileCurationScheduler();
        if (this.emberHarness?.enabled !== false) {
            void this.prepareLocalSafetyEvaluator('gateway_started');
        }
        return this.getStatus({ includeAgentRunner: false });
    }

    async stop() {
        this.stopProfileCurationScheduler();
        this.activePersonaTurns.clear();
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
        if (this.localSafetyEvaluator) {
            await this.localSafetyEvaluator.dispose().catch(() => {});
        }

        if (!this.server) {
            return this.getStatus({ includeAgentRunner: false });
        }

        const server = this.server;
        this.server = null;
        await new Promise((resolve) => server.close(resolve));
        this.emitGatewayEvent('gateway.stopped', {});
        return this.getStatus({ includeAgentRunner: false });
    }

    startProfileCurationScheduler() {
        if (!this.profileCurationEnabled || !this.userProfileCurator) {
            return;
        }
        this.stopProfileCurationScheduler();
        this.profileCurationStartTimer = setTimeout(() => {
            void this.runScheduledProfileCuration('startup');
        }, this.profileCurationStartDelayMs);
        this.profileCurationStartTimer.unref?.();
        this.profileCurationIntervalTimer = setInterval(() => {
            void this.runScheduledProfileCuration('interval');
        }, this.profileCurationCheckIntervalMs);
        this.profileCurationIntervalTimer.unref?.();
    }

    stopProfileCurationScheduler() {
        if (this.profileCurationStartTimer) {
            clearTimeout(this.profileCurationStartTimer);
            this.profileCurationStartTimer = null;
        }
        if (this.profileCurationIntervalTimer) {
            clearInterval(this.profileCurationIntervalTimer);
            this.profileCurationIntervalTimer = null;
        }
        if (this.profileCurationDebounceTimer) {
            clearTimeout(this.profileCurationDebounceTimer);
            this.profileCurationDebounceTimer = null;
        }
    }

    scheduleProfileCurationSoon(trigger = 'conversation_idle') {
        if (!this.profileCurationEnabled || !this.userProfileCurator) {
            return false;
        }
        if (this.profileCurationDebounceTimer) {
            clearTimeout(this.profileCurationDebounceTimer);
        }
        this.profileCurationDebounceTimer = setTimeout(() => {
            this.profileCurationDebounceTimer = null;
            void this.runScheduledProfileCuration(trigger, { force: true });
        }, this.profileCurationDebounceMs);
        this.profileCurationDebounceTimer.unref?.();
        return true;
    }

    async runScheduledProfileCuration(trigger = 'scheduled', options = {}) {
        if (this.profileCurationRunning) {
            this.scheduleProfileCurationSoon(trigger);
            return { ok: false, status: 'profile_curation_already_running' };
        }
        if (!this.profileCurationEnabled || !this.userProfileCurator) {
            return { ok: false, status: 'profile_curation_not_started' };
        }
        this.profileCurationRunning = true;
        try {
            const [profileState, rawStatus] = await Promise.all([
                this.getUserProfileCurationState(),
                Promise.resolve(this.getRawMemoryStatus())
            ]);
            const rebuild = profileState?.rebuild || null;
            const activeRebuild = ['running', 'paused', 'partial_completed', 'failed', 'promoting'].includes(rebuild?.status);
            const capsuleCount = Number(profileState?.userProfile?.items?.length || 0) +
                Number(profileState?.relationshipProfile?.items?.length || 0);
            const shouldRebuild = Number(rawStatus?.entryCount) > 0 && (
                activeRebuild || (!rebuild && capsuleCount === 0)
            );
            const result = shouldRebuild
                ? await this.rebuildUserProfile({
                      trigger,
                      maxPasses: 1,
                      maxBatches: 4,
                      ...options
                  })
                : await this.curateUserProfile({ trigger, ...options });
            this.emitGatewayEvent('memory.profile_curation.scheduled', {
                trigger,
                ok: result?.ok === true,
                status: result?.status || '',
                rebuildId: result?.rebuild?.id || '',
                processedEntryCount: result?.run?.processedEntryCount || result?.rebuild?.processedEntryCount || 0,
                profileUpdateCount: result?.run?.profileUpdateCount || result?.rebuild?.profileUpdateCount || 0,
                relationshipUpdateCount: result?.run?.relationshipUpdateCount || result?.rebuild?.relationshipUpdateCount || 0,
                preferenceEventCount: result?.run?.preferenceEventCount || 0,
                affinityChanged: result?.run?.affinityChanged === true
            });
            if (result?.status === 'rebuild_partial') {
                this.scheduleProfileCurationSoon('profile_rebuild_resume');
            }
            return result;
        } catch (error) {
            this.emitGatewayEvent('memory.profile_curation.error', {
                trigger,
                error: error?.message || String(error)
            });
            return { ok: false, status: 'profile_curation_error', error: error?.message || String(error) };
        } finally {
            this.profileCurationRunning = false;
        }
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

    getStatus(options = {}) {
        const includeAgentRunner = options.includeAgentRunner !== false;
        const address = this.getAddress();
        const gatewayToolDefinitions = this.gatewayToolRuntimeRegistry?.listDefinitions?.() || [];
        const directGatewayTools = this.gatewayToolRuntimeRegistry?.modelVisibleSpecs?.() || [];
        const agentToolSurface = getOpenClawToolSurfaceSummary();
        const agentToolSurfaceValidation = validateOpenClawToolSurface().summary;
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
            agentToolSurface,
            agentToolSurfaceValidation,
            openClawToolSurface: agentToolSurface,
            openClawToolSurfaceValidation: agentToolSurfaceValidation,
            toolContracts: {
                version: 1,
                count: listToolContracts().length
            },
            toolRuntime: {
                model: 'ailis_gateway_tool_registry.v1',
                registeredToolCount: gatewayToolDefinitions.length,
                directToolCount: directGatewayTools.length,
                deferredToolCount: gatewayToolDefinitions.filter((tool) => tool.exposure === TOOL_EXPOSURE.DEFERRED).length
            },
            defaultContext: redactObject(this.resolveDefaultContext()),
            runtime: this.runtime.getStatus(),
            memory: this.memoryRuntime?.getStatus?.() || null,
            emberHarness: this.emberHarness?.getStatus?.() || null,
            rawMemory: this.rawMemoryLedger?.getStatus?.() || null,
            interactionPreferences: this.preferenceState?.getStatus?.() || null,
            taskResultCapsules: this.taskResultCapsules?.getStatus?.() || null,
            taskAgentHarness: this.taskAgentHarness?.getStatus?.() || null,
            taskResultBackfill: this.taskResultBackfill,
            userProfileCuration: this.userProfileCurator?.getStatus?.() || null,
            userProfileCurationScheduler: {
                enabled: this.profileCurationEnabled,
                running: this.profileCurationRunning,
                startDelayMs: this.profileCurationStartDelayMs,
                checkIntervalMs: this.profileCurationCheckIntervalMs,
                debounceMs: this.profileCurationDebounceMs,
                scheduled: Boolean(this.profileCurationStartTimer || this.profileCurationIntervalTimer || this.profileCurationDebounceTimer)
            },
            selfEvolution: this.selfEvolutionRuntime?.getStatus?.() || null,
            toolRuntimeGateway: this.toolRuntimeSupervisor?.getStatus?.() || null,
            agentRunner: includeAgentRunner
                ? this.ensureAgentRunner().getStatus()
                : (this.agentRunner?.getStatus?.() || {
                    enabled: false,
                    status: 'not_loaded'
                }),
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
                memoryRuntime: this.memoryRuntime,
                preferenceState: this.preferenceState,
                taskResultCapsules: this.taskResultCapsules
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

    getRawMemoryStatus() {
        return this.rawMemoryLedger?.getStatus?.() || {
            ok: false,
            status: 'raw_memory_not_configured'
        };
    }

    replayRawMemory(options = {}) {
        return this.rawMemoryLedger?.replay?.(options || {}) || {
            ok: false,
            status: 'raw_memory_not_configured',
            entries: []
        };
    }

    listRawMemorySessions(limit = 100) {
        return this.rawMemoryLedger?.listSessions?.(limit) || {
            ok: false,
            status: 'raw_memory_not_configured',
            sessions: []
        };
    }

    async curateUserProfile(options = {}) {
        return await this.userProfileCurator?.runDailyCuration?.(options || {}) || {
            ok: false,
            status: 'user_profile_curator_not_configured'
        };
    }

    async rebuildUserProfile(options = {}) {
        return await this.userProfileCurator?.rebuildFromRawMemory?.(options || {}) || {
            ok: false,
            status: 'user_profile_curator_not_configured'
        };
    }

    async getUserProfileCurationState() {
        return await this.userProfileCurator?.getState?.() || {
            ok: false,
            status: 'user_profile_curator_not_configured'
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
        const eventRunId = normalizeString(
            payload.runId || payload.childRunId || payload.payload?.runId
        );
        if (eventRunId && this.privateRunIds.has(eventRunId)) {
            this.emit('private-event', { type, payload });
            return;
        }
        if (type === 'subagent.event' && payload.type === 'subagent.completed') {
            try {
                this.taskResultCapsules?.recordExecution?.({
                    sessionId: payload.parentSessionId,
                    parentRunId: payload.parentRunId,
                    action: 'resume',
                    task: payload.task,
                    ok: payload.payload?.ok === true,
                    status: payload.status,
                    subagent: {
                        id: payload.subagentId,
                        childRunId: payload.childRunId,
                        sessionId: payload.parentSessionId,
                        task: payload.task,
                        status: payload.status
                    },
                    childResult: payload.payload?.result || {}
                });
            } catch (error) {
                payload = {
                    ...payload,
                    taskStateError: error?.message || String(error)
                };
            }
        }
        this.eventSeq += 1;
        const protocolMetadata = runtimeEventMetadata({ type, payload });
        const event = {
            id: `evt-${this.eventSeq}`,
            seq: this.eventSeq,
            ts: Date.now(),
            type,
            ...protocolMetadata,
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

    hasBackgroundTaskRuns() {
        return this.backgroundTaskRuns.size > 0;
    }

    async waitForBackgroundTaskRuns() {
        while (this.backgroundTaskRuns.size > 0) {
            await Promise.allSettled([...this.backgroundTaskRuns]);
        }
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

        if (url.pathname === '/ember-harness/status' && req.method === 'GET') {
            const runId = url.searchParams.get('runId') || '';
            this.sendJson(res, 200, {
                ok: true,
                status: this.emberHarness?.getStatus?.() || null,
                records: runId ? this.emberHarness?.listRunRecords?.(runId, Number(url.searchParams.get('limit') || 50)) || [] : []
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

        if (url.pathname === '/raw-memory/status' && req.method === 'GET') {
            this.sendJson(res, 200, this.getRawMemoryStatus());
            return;
        }

        if (url.pathname === '/raw-memory/sessions' && req.method === 'GET') {
            this.sendJson(res, 200, this.listRawMemorySessions(Number(url.searchParams.get('limit') || 100)));
            return;
        }

        if (url.pathname === '/raw-memory/replay' && req.method === 'GET') {
            this.sendJson(res, 200, this.replayRawMemory({
                sessionId: url.searchParams.get('sessionId') || '',
                runId: url.searchParams.get('runId') || '',
                type: url.searchParams.get('type') || '',
                source: url.searchParams.get('source') || '',
                since: url.searchParams.get('since') || '',
                until: url.searchParams.get('until') || '',
                includePayload: url.searchParams.get('includePayload') !== 'false',
                limit: Number(url.searchParams.get('limit') || 200)
            }));
            return;
        }

        if (url.pathname === '/memory/profile/state' && req.method === 'GET') {
            this.sendJson(res, 200, await this.getUserProfileCurationState());
            return;
        }

        if (url.pathname === '/memory/profile/curate' && (req.method === 'GET' || req.method === 'POST')) {
            const body = req.method === 'POST' ? await this.readJsonBody(req) : {};
            this.sendJson(res, 200, await this.curateUserProfile({
                ...(body || {}),
                force: body.force === true || url.searchParams.get('force') === 'true',
                rawLimit: body.rawLimit || Number(url.searchParams.get('rawLimit') || 5000),
                evidenceLimit: body.evidenceLimit || Number(url.searchParams.get('evidenceLimit') || 120)
            }));
            return;
        }

        if (url.pathname === '/memory/profile/rebuild' && req.method === 'POST') {
            const body = await this.readJsonBody(req);
            this.sendJson(res, 200, await this.rebuildUserProfile(body || {}));
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
            needsApproval: tool.id === 'exec',
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

    shouldRunEmberHarness(context = {}) {
        return this.emberHarness?.enabled !== false &&
            context.emberHarness !== false &&
            context.disableEmberHarness !== true;
    }

    async runEmberHarnessCheck({
        stage = 'unknown',
        boundary = 'unknown',
        text = '',
        context = {},
        metadata = {},
        runId = '',
        sessionId = ''
    } = {}) {
        const finalRunId = normalizeString(
            runId || context.runId || context.parentRunId || context.sessionRunId,
            'global'
        );
        const finalSessionId = normalizeString(
            sessionId || context.sessionId || context.sessionKey || context.parentSessionId,
            'main'
        );
        if (!this.shouldRunEmberHarness(context)) {
            return {
                ok: true,
                status: 'disabled',
                decision: 'allow',
                blocked: false,
                runId: finalRunId,
                sessionId: finalSessionId,
                stage,
                boundary
            };
        }
        const result = await this.emberHarness.check({
            runId: finalRunId,
            sessionId: finalSessionId,
            stage,
            boundary,
            text,
            metadata: redactObject(metadata),
            evaluator: typeof context.emberHarnessEvaluator === 'function' ? context.emberHarnessEvaluator : null
        });
        const eventPayload = {
            schema: result.schema,
            checkId: result.checkId,
            runId: result.runId,
            sessionId: result.sessionId,
            stage: result.stage,
            boundary: result.boundary,
            mode: result.mode,
            status: result.status,
            decision: result.decision,
            blocked: result.blocked,
            riskLevel: result.riskLevel,
            riskTypes: result.riskTypes,
            summary: result.summary,
            suggestion: result.suggestion,
            evaluatorDetails: result.evaluatorDetails,
            evaluatorConfigured: result.evaluatorConfigured,
            snapshot: result.snapshot,
            rollbackTo: result.rollbackTo
        };
        this.emitGatewayEvent('ember.harness.check', eventPayload);
        await this.appendAudit({
            type: 'ember.harness.check',
            runId: result.runId,
            sessionId: result.sessionId,
            status: result.status,
            ok: result.blocked !== true,
            args: {
                stage: result.stage,
                boundary: result.boundary
            },
            context: {
                workspace: context.workspace || context.workspaceDir,
                planner: context.planner,
                iteration: context.iteration
            },
            result: eventPayload
        }).catch(() => {});
        if (result.runId && result.runId !== 'global') {
            await this.runtime.appendItem(result.runId, {
                type: 'ember.harness.check',
                sessionId: result.sessionId,
                status: result.status,
                payload: eventPayload
            }).catch(() => {});
        }
        return result;
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
            const workspaceDir = this.resolveWorkspace(context.workspace, context);
            if (transcriptRunId) {
                await this.runtime.appendItem(transcriptRunId, {
                    type: 'tool.call',
                    sessionId: transcriptSessionId,
                    status: 'started',
                    payload: {
                        schema: 'ailis.tool_call.v1',
                        callId,
                        toolName: toolId,
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
            const preToolGate = await this.runEmberHarnessCheck({
                stage: policyDecision.classification?.mutates ? 'pre_side_effect' : 'tool_call',
                boundary: 'tool_call_before_execution',
                text: {
                    tool: toolId,
                    args,
                    policy: policyDecision.policy,
                    classification: policyDecision.classification
                },
                context,
                runId: transcriptRunId,
                sessionId: transcriptSessionId,
                metadata: {
                    callId,
                    tool: toolId,
                    workspace: workspaceDir,
                    mutates: policyDecision.classification?.mutates === true,
                    needsApproval: policyDecision.needsApproval === true
                }
            });
            if (preToolGate.blocked) {
                throwBlocked('tool call blocked by EMBER-Harness stage gate before execution', {
                    tool: toolId,
                    callId,
                    emberHarness: summarizeEmberHarnessRecord(preToolGate)
                });
            }
            const result = await withTimeout(
                Number(request.timeoutMs || context.timeoutMs || TOOL_CALL_TIMEOUT_MS),
                () => this.callAgentRuntimeTool({ callId, toolId, args, context, workspaceDir })
            );
            const guardedResult = this.runtime.guardToolResult(result, { toolId, callId });
            attachObservationContract(guardedResult, { toolId });
            const postToolGate = await this.runEmberHarnessCheck({
                stage: 'tool_result',
                boundary: 'tool_result_enter_context',
                text: guardedResult,
                context,
                runId: transcriptRunId,
                sessionId: transcriptSessionId,
                metadata: {
                    callId,
                    tool: toolId,
                    workspace: workspaceDir
                }
            });
            if (postToolGate.blocked) {
                throwBlocked('tool result blocked by EMBER-Harness before entering model context', {
                    tool: toolId,
                    callId,
                    emberHarness: summarizeEmberHarnessRecord(postToolGate)
                });
            }
            if (toolId === 'tool_search') {
                attachRawToolSearchToolsForDirectExposure(guardedResult, result);
            } else if (
                parseAilisDirectMcpToolId(toolId) ||
                toolId === WEB_SEARCH_TOOL_ID ||
                toolId === WEB_RUN_TOOL_ID
            ) {
                await attachSuggestedMcpToolsForDirectExposure(
                    guardedResult,
                    toolId === WEB_SEARCH_TOOL_ID
                        ? 'mcp__ailis_research__web_search'
                        : toolId === WEB_RUN_TOOL_ID
                        ? 'mcp__ailis_research__web_fetch'
                        : toolId,
                    this.runtime?.mcpManager,
                    Number(request.timeoutMs || context.timeoutMs || 8000)
                );
            }
            const status = classifyToolResult(guardedResult);
            const semanticFailure = ['blocked', 'failed'].includes(status);
            const response = {
                ok: !semanticFailure && guardedResult?.isError !== true,
                callId,
                tool: toolId,
                status,
                durationMs: Date.now() - startedAt,
                result: guardedResult
            };
            const canonicalToolOutput = normalizeToolOutput({
                id: callId,
                callId,
                tool: toolId,
                args,
                response
            });
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
                        schema: canonicalToolOutput.schema,
                        callId,
                        toolName: canonicalToolOutput.toolName,
                        tool: toolId,
                        ok: response.ok,
                        status,
                        durationMs: response.durationMs,
                        outputPreview: canonicalToolOutput.outputPreview,
                        errorSummary: canonicalToolOutput.errorSummary,
                        threadItem: toolOutputToThreadItem(canonicalToolOutput),
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
            const errorMessage = formatGatewayToolError(error);
            const response = {
                ok: false,
                callId,
                tool: toolId,
                status,
                durationMs: Date.now() - startedAt,
                error: errorMessage,
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
                const canonicalToolOutput = normalizeToolOutput({
                    id: callId,
                    callId,
                    tool: toolId,
                    args,
                    response: {
                        ...response,
                        result: guardedError
                    }
                });
                await this.runtime.appendItem(transcriptRunId, {
                    type: 'tool.result',
                    sessionId: transcriptSessionId,
                    status,
                    payload: {
                        schema: canonicalToolOutput.schema,
                        callId,
                        toolName: canonicalToolOutput.toolName,
                        tool: toolId,
                        ok: false,
                        status,
                        durationMs: response.durationMs,
                        outputPreview: canonicalToolOutput.outputPreview,
                        errorSummary: canonicalToolOutput.errorSummary,
                        threadItem: toolOutputToThreadItem(canonicalToolOutput),
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

    async runPrivatePersonaTurn({
        input = {},
        context = {},
        sessionId = 'main',
        runId = '',
        purpose = 'draft',
        developerPacket = '',
        onTextDelta = null,
        onTextStreamEvent = null
    } = {}) {
        const privateRunId = normalizeString(runId, `persona_${purpose}_${randomUUID()}`);
        this.privateRunIds.add(privateRunId);
        try {
            return await this.ensureAgentRunner().runMessage({
                ...input,
                runId: privateRunId,
                sessionId,
                memoryPolicy: 'read_only',
                messageHistory: Array.isArray(input.messageHistory)
                    ? input.messageHistory
                    : [],
                ephemeralDeveloperMessage: normalizeString(developerPacket),
                onTextDelta: typeof onTextDelta === 'function' ? onTextDelta : undefined,
                onTextStreamEvent: typeof onTextStreamEvent === 'function'
                    ? onTextStreamEvent
                    : undefined,
                context: {
                    ...context,
                    runId: privateRunId,
                    sessionId,
                    sessionKey: sessionId,
                    agentLoop: 'llm',
                    planner: 'llm',
                    directToolExecutor: true,
                    agentRole: 'persona_orchestrator',
                    contextMode: 'persona',
                    taskAgentRoutingOwned: true,
                    personaDraft: purpose === 'draft',
                    personaRenderOnly: purpose !== 'draft',
                    memoryPolicy: 'read_only'
                }
            });
        } finally {
            this.privateRunIds.delete(privateRunId);
        }
    }

    async renderTaskPacket({
        input = {},
        context = {},
        sessionId = 'main',
        outerRunId = '',
        turnEnvelope = {},
        packet = {},
        purpose = 'result'
    } = {}) {
        const packetStatus = normalizeString(packet.status, 'unknown');
        const authoritativeAnswer = normalizeString(
            packet.final_answer || packet.partial_answer || packet.summary || packet.message
        );
        const developerPacket = [
            'Render the following authoritative TaskEvent/TaskResult for the user.',
            `The TaskAgent packet status is ${packetStatus}. This packet reports work that has already reached that status; do not treat the current user request as a new task.`,
            authoritativeAnswer
                ? `Authoritative answer to deliver:\n${authoritativeAnswer}`
                : 'The packet contains no final or partial answer. State its actual status and unresolved fields without inventing a result.',
            'Use only this packet and the current user request as factual input. Preserve status, failure, uncertainty, sources, artifacts, and unresolved fields. For a completed packet, deliver the substance of the authoritative answer now; never replace it with an acknowledgment, a promise to start, or a request to wait.',
            'You may improve tone and presentation, but do not discard the concrete answer, numbered items, source attribution, or failure details.',
            'Full structured packet:',
            JSON.stringify(packet)
        ].join('\n');
        const rendered = await this.runPrivatePersonaTurn({
            input: {
                ...input,
                message: normalizeString(turnEnvelope.userMessage || input.message || input.prompt || input.task),
                attachments: [],
                messageHistory: Array.isArray(input.messageHistory) ? input.messageHistory : []
            },
            context: { ...context, turnEnvelope },
            sessionId,
            runId: `persona_${purpose}_${outerRunId || randomUUID()}`,
            purpose,
            developerPacket
        }).catch(() => null);
        const renderedText = normalizeString(
            rendered?.displayText || rendered?.finalAnswer || rendered?.speechText,
            authoritativeAnswer || (packet.status ? `任务状态：${packet.status}` : '')
        );
        const completedPacket = ['completed', 'completed_with_warnings', 'success', 'succeeded']
            .includes(packetStatus.toLowerCase());
        const minimumFaithfulLength = Math.min(
            240,
            Math.max(80, Math.floor(authoritativeAnswer.length * 0.15))
        );
        if (
            completedPacket &&
            authoritativeAnswer.length >= 160 &&
            renderedText.length < minimumFaithfulLength
        ) {
            return authoritativeAnswer;
        }
        return renderedText;
    }

    startPrivatePersonaDraft({
        input = {},
        context = {},
        sessionId = 'main',
        outerRunId = '',
        revision = 0,
        turnEnvelope = {},
        llmSettings = null,
        onTextDelta = null,
        onTextStreamEvent = null
    } = {}) {
        const revisionSuffix = revision > 0 ? `_r${revision}` : '';
        return this.runPrivatePersonaTurn({
            input: {
                ...input,
                runId: `persona_actor_${outerRunId}${revisionSuffix}`,
                ...(llmSettings ? { llmSettings } : {})
            },
            context: { ...context, turnEnvelope },
            sessionId,
            runId: `persona_actor_${outerRunId}${revisionSuffix}`,
            purpose: 'draft',
            developerPacket: PERSONA_DRAFT_DEVELOPER_PACKET,
            onTextDelta,
            onTextStreamEvent
        }).catch(() => null);
    }

    async runTaskAgentControlledPersonaTurn({
        input = {},
        context = {},
        sessionId = 'main',
        runId = '',
        llmSettings = null
    } = {}) {
        const message = normalizeString(input.message || input.prompt || input.task);
        const activePersonaTurn = this.activePersonaTurns.get(sessionId);
        const activeThread = this.taskAgentHarness?.getThread?.(sessionId);
        const activeTurnId = activeThread
            ? normalizeString(activeThread.activeTurnId || activeThread.active_turn_id)
            : normalizeString(activePersonaTurn?.turnId);

        if (activePersonaTurn && activeTurnId) {
            const steerTurnEnvelope = Object.freeze({
                sessionId,
                turnId: activeTurnId,
                userMessage: message,
                attachments: Object.freeze(Array.isArray(input.attachments) ? cloneJson(input.attachments) || [] : []),
                visibleHistory: Object.freeze((Array.isArray(input.messageHistory) ? input.messageHistory : [])
                    .filter((entry) => entry && ['user', 'assistant'].includes(entry.role))
                    .map((entry) => Object.freeze({ role: entry.role, content: normalizeString(entry.content) }))
                    .filter((entry) => entry.content)
                    .slice(-120)),
                createdAt: new Date().toISOString()
            });
            activePersonaTurn.revision = Math.max(0, Number(activePersonaTurn.revision) || 0) + 1;
            activePersonaTurn.latestInput = input;
            activePersonaTurn.latestContext = context;
            activePersonaTurn.latestMessage = message;
            activePersonaTurn.latestTurnEnvelope = steerTurnEnvelope;
            if (activePersonaTurn.taskRoute !== 'execute') {
                const draftRequest = {
                    input,
                    context,
                    sessionId,
                    outerRunId: activePersonaTurn.runId,
                    revision: activePersonaTurn.revision,
                    turnEnvelope: steerTurnEnvelope,
                    llmSettings
                };
                activePersonaTurn.personaPromise = typeof activePersonaTurn.startPersonaDraft === 'function'
                    ? activePersonaTurn.startPersonaDraft(draftRequest)
                    : this.startPrivatePersonaDraft(draftRequest);
            }
            const steered = await this.taskAgentHarness.dispatchTurn({
                ...context,
                runId: normalizeString(runId, `steer_${randomUUID()}`),
                parentRunId: activePersonaTurn.runId,
                sessionId,
                sessionKey: sessionId,
                currentUserMessage: message,
                expectedTaskAgentTurnId: activeTurnId,
                turnEnvelope: steerTurnEnvelope,
                attachments: Array.isArray(input.attachments) ? cloneJson(input.attachments) || [] : [],
                fileAttachments: Array.isArray(input.attachments) ? cloneJson(input.attachments) || [] : [],
                llmSettings: llmSettings || context.llmSettings || null,
                returnAfterSteer: true
            });
            this.emitGatewayEvent('agent.turn.steered', {
                runId: activePersonaTurn.runId,
                sessionId,
                turnId: activeTurnId,
                status: 'accepted',
                source: 'user_input'
            });
            return {
                ok: true,
                status: 'running',
                mode: 'persistent-task-agent-turn',
                intent: 'turn_steered',
                runId: activePersonaTurn.runId,
                sessionId,
                turnId: activeTurnId,
                taskRoute: 'execute',
                displayText: '',
                speechText: '',
                deferAssistantCommit: true,
                messagePhase: 'commentary',
                steerAccepted: steered?.steer_accepted === true,
                backgroundTask: {
                    runId: activePersonaTurn.runId,
                    sessionId,
                    turnId: activeTurnId,
                    status: 'running'
                }
            };
        }

        const outerRunId = normalizeString(runId, randomUUID());
        const turnEnvelope = Object.freeze({
            sessionId,
            turnId: '',
            userMessage: message,
            attachments: Object.freeze(Array.isArray(input.attachments) ? cloneJson(input.attachments) || [] : []),
            visibleHistory: Object.freeze((Array.isArray(input.messageHistory) ? input.messageHistory : [])
                .filter((entry) => entry && ['user', 'assistant'].includes(entry.role))
                .map((entry) => Object.freeze({ role: entry.role, content: normalizeString(entry.content) }))
                .filter((entry) => entry.content)
                .slice(-120)),
            createdAt: new Date().toISOString()
        });
        this.emitGatewayEvent('agent.run.started', {
            runId: outerRunId,
            sessionId,
            status: 'running',
            mode: 'persistent-task-agent-turn',
            source: 'task_agent'
        });
        const activeState = {
            runId: outerRunId,
            sessionId,
            turnId: '',
            startedAt: Date.now(),
            revision: 0,
            taskRoute: 'pending',
            latestInput: input,
            latestContext: context,
            latestMessage: message,
            latestTurnEnvelope: turnEnvelope,
            personaPromise: null,
            personaStream: null,
            startPersonaDraft: null,
            openPersonaStream: null,
            discardPersonaStream: null
        };
        const requestedPersonaTextDelta = typeof input.onTextDelta === 'function'
            ? input.onTextDelta
            : null;
        const requestedPersonaStreamEvent = typeof input.onTextStreamEvent === 'function'
            ? input.onTextStreamEvent
            : null;
        const publishPersonaStreamEvent = (stream, streamState, deltaText = '', reason = '') => {
            if (!stream || activeState.personaStream !== stream) {
                return;
            }
            if (streamState === 'started') {
                if (stream.publishedStarted) {
                    return;
                }
                stream.publishedStarted = true;
            } else if (streamState === 'delta') {
                if (!deltaText) {
                    return;
                }
            } else if (streamState === 'committed') {
                if (stream.publishedCommitted) {
                    return;
                }
                stream.publishedCommitted = true;
            } else if (streamState === 'discarded') {
                if (stream.publishedDiscarded || !stream.publishedStarted) {
                    return;
                }
                stream.publishedDiscarded = true;
            }
            const eventType = `response.output_text.${streamState}`;
            const eventPayload = {
                runId: outerRunId,
                sessionId,
                turnId: activeState.turnId,
                status: streamState === 'discarded' ? 'cancelled' : 'streaming',
                text: streamState === 'discarded' ? '' : stream.text,
                speechText: '',
                deltaText: streamState === 'delta' ? deltaText : '',
                kind: 'stream',
                phase: 'final_answer_stream',
                messagePhase: 'final_answer_stream',
                streamState,
                streamId: stream.streamId,
                revision: stream.revision,
                source: 'persona_actor',
                ...(reason ? { reason } : {})
            };
            this.emitGatewayEvent('persona.background.message', eventPayload);
            try {
                if (streamState === 'delta') {
                    const pending = requestedPersonaTextDelta?.(deltaText, {
                        runId: outerRunId,
                        sessionId,
                        streamId: stream.streamId,
                        phase: 'final_answer_stream',
                        source: 'persona_actor'
                    });
                    pending?.catch?.(() => {});
                } else {
                    const pending = requestedPersonaStreamEvent?.({
                        type: eventType,
                        runId: outerRunId,
                        sessionId,
                        streamId: stream.streamId,
                        phase: 'final_answer_stream',
                        source: 'persona_actor',
                        ...(reason ? { reason } : {})
                    });
                    pending?.catch?.(() => {});
                }
            } catch {}
        };
        const flushPersonaStreamDelta = (stream) => {
            if (!stream) {
                return;
            }
            if (stream.flushTimer) {
                clearTimeout(stream.flushTimer);
                stream.flushTimer = null;
            }
            const deltaText = stream.pendingDelta;
            stream.pendingDelta = '';
            if (deltaText && stream.opened) {
                publishPersonaStreamEvent(stream, 'delta', deltaText);
            }
        };
        const schedulePersonaStreamDelta = (stream, deltaText) => {
            if (!stream || !deltaText || !stream.opened) {
                return;
            }
            stream.pendingDelta += deltaText;
            if (stream.flushTimer) {
                return;
            }
            stream.flushTimer = setTimeout(() => {
                flushPersonaStreamDelta(stream);
            }, PERSONA_STREAM_FLUSH_INTERVAL_MS);
            stream.flushTimer.unref?.();
        };
        activeState.openPersonaStream = () => {
            const stream = activeState.personaStream;
            if (!stream || stream.opened || activeState.taskRoute !== 'chat') {
                return;
            }
            stream.opened = true;
            publishPersonaStreamEvent(stream, 'started');
            if (stream.text) {
                publishPersonaStreamEvent(stream, 'delta', stream.text);
            }
            if (stream.sourceState === 'committed') {
                publishPersonaStreamEvent(stream, 'committed');
            } else if (stream.sourceState === 'discarded') {
                publishPersonaStreamEvent(stream, 'discarded', '', 'persona_source_discarded');
            }
        };
        activeState.discardPersonaStream = (reason = 'persona_stream_discarded') => {
            const stream = activeState.personaStream;
            if (!stream) {
                return;
            }
            if (stream.flushTimer) {
                clearTimeout(stream.flushTimer);
                stream.flushTimer = null;
            }
            stream.pendingDelta = '';
            stream.opened = false;
            publishPersonaStreamEvent(stream, 'discarded', '', reason);
        };
        activeState.startPersonaDraft = (draftRequest = {}) => {
            activeState.discardPersonaStream?.('persona_revision_superseded');
            const revision = Math.max(0, Number(draftRequest.revision) || 0);
            const stream = {
                revision,
                streamId: `${outerRunId}:persona:${revision}`,
                text: '',
                sourceState: 'pending',
                opened: false,
                publishedStarted: false,
                publishedCommitted: false,
                publishedDiscarded: false,
                pendingDelta: '',
                flushTimer: null
            };
            activeState.personaStream = stream;
            return this.startPrivatePersonaDraft({
                ...draftRequest,
                onTextDelta: (delta) => {
                    if (activeState.personaStream !== stream || typeof delta !== 'string' || !delta) {
                        return;
                    }
                    stream.text += delta;
                    if (stream.opened) {
                        schedulePersonaStreamDelta(stream, delta);
                    }
                },
                onTextStreamEvent: (event = {}) => {
                    if (activeState.personaStream !== stream) {
                        return;
                    }
                    const type = normalizeString(event.type);
                    if (type === 'response.output_text.started') {
                        stream.sourceState = 'started';
                        if (stream.opened) {
                            publishPersonaStreamEvent(stream, 'started');
                        }
                        return;
                    }
                    if (type === 'response.output_text.committed') {
                        stream.sourceState = 'committed';
                        if (stream.opened) {
                            flushPersonaStreamDelta(stream);
                            publishPersonaStreamEvent(stream, 'committed');
                        }
                        return;
                    }
                    if (type === 'response.output_text.discarded') {
                        stream.sourceState = 'discarded';
                        if (stream.opened) {
                            if (stream.flushTimer) {
                                clearTimeout(stream.flushTimer);
                                stream.flushTimer = null;
                            }
                            stream.pendingDelta = '';
                            publishPersonaStreamEvent(stream, 'discarded', '', 'persona_source_discarded');
                        }
                    }
                }
            });
        };
        activeState.personaPromise = activeState.startPersonaDraft({
            input,
            context,
            sessionId,
            outerRunId,
            revision: activeState.revision,
            turnEnvelope,
            llmSettings
        });
        this.activePersonaTurns.set(sessionId, activeState);

        let lastProgressRenderAt = 0;
        let progressRenderInFlight = null;
        const onTaskEvent = (event = {}) => {
            const type = normalizeString(event.type);
            const messageText = normalizeString(event.message || event.payload?.text || event.payload?.summary);
            const eventTurnId = normalizeString(event.turnId || event.turn_id);
            if (eventTurnId) {
                activeState.turnId = eventTurnId;
            }
            if (type === 'task_agent.route.decided') {
                activeState.taskRoute = normalizeString(event.payload?.mode, activeState.taskRoute).toLowerCase();
                try {
                    const pending = input.onTaskRoute?.(activeState.taskRoute, {
                        runId: outerRunId,
                        sessionId,
                        turnId: activeState.turnId
                    });
                    pending?.catch?.(() => {});
                } catch {}
                if (activeState.taskRoute === 'chat') {
                    activeState.openPersonaStream?.();
                } else if (activeState.taskRoute === 'execute') {
                    activeState.discardPersonaStream?.('task_agent_route_execute');
                }
            }
            const isProgress = type === 'agent.progress.note' && messageText;
            const now = Date.now();
            if (
                !isProgress ||
                progressRenderInFlight ||
                now - lastProgressRenderAt < PERSONA_TASK_PROGRESS_MIN_INTERVAL_MS
            ) {
                return;
            }
            lastProgressRenderAt = now;
            const packet = {
                type: 'task.progress',
                status: normalizeString(event.status, 'running'),
                summary: messageText
            };
            progressRenderInFlight = (async () => {
                const text = messageText;
                if (text) {
                    this.emitGatewayEvent('persona.background.message', {
                        runId: outerRunId,
                        sessionId,
                        turnId: activeState.turnId,
                        status: packet.status,
                        text,
                        speechText: text,
                        kind: 'commentary',
                        phase: 'commentary',
                        messagePhase: 'commentary',
                        source: 'task_event_persona_actor'
                    });
                }
            })().catch(() => {}).finally(() => {
                progressRenderInFlight = null;
            });
        };

        let backgroundTaskStatus = 'completed';
        const commitFinalAnswer = (displayText, taskResult = null, source = 'task_result_persona_actor') => {
            const finalText = normalizeString(displayText);
            if (!finalText) {
                return;
            }
            const turnId = normalizeString(taskResult?.turn_id || activeState.turnId);
            this.taskAgentHarness.recordPersonaOutput?.(
                sessionId,
                turnId,
                finalText,
                taskResult?.route === 'chat' ? 'chat' : 'result'
            );
            this.ensureAgentRunner().recordMemoryTurn?.({
                request: {
                    ...(activeState.latestInput || input),
                    context: { ...(activeState.latestContext || context), memoryPolicy: 'read_write' },
                    memoryPolicy: 'read_write'
                },
                result: {
                    ok: taskResult?.ok !== false,
                    status: normalizeString(taskResult?.status, 'completed'),
                    displayText: finalText,
                    speechText: finalText
                },
                message: activeState.latestMessage || message,
                sessionId,
                source: 'persona_final_answer_committed'
            });
            this.emitGatewayEvent('persona.background.message', {
                runId: outerRunId,
                sessionId,
                turnId,
                status: normalizeString(taskResult?.status, 'completed'),
                text: finalText,
                speechText: finalText,
                kind: 'result',
                phase: 'final_answer',
                messagePhase: 'final_answer',
                source,
                ...(activeState.personaStream?.streamId
                    ? { streamId: activeState.personaStream.streamId, streamState: 'committed' }
                    : {}),
                ...(taskResult ? { taskResult } : {})
            });
            this.emitGatewayEvent('agent.message.completed', {
                runId: outerRunId,
                sessionId,
                turnId,
                status: normalizeString(taskResult?.status, 'completed'),
                ok: taskResult?.ok !== false,
                text: finalText,
                speechText: finalText,
                phase: 'final_answer',
                messagePhase: 'final_answer',
                delivery: 'background',
                source
            });
        };
        const taskPromise = (async () => {
            this.emitGatewayEvent('task.background.started', {
                runId: outerRunId,
                sessionId,
                status: 'running',
                currentRequest: message,
                source: 'task_agent_actor'
            });
            let taskResult;
            try {
                taskResult = await this.taskAgentHarness.dispatchTurn({
                    ...context,
                    runId: `task_${outerRunId}`,
                    parentRunId: outerRunId,
                    sessionId,
                    sessionKey: sessionId,
                    currentUserMessage: message,
                    turnEnvelope,
                    attachments: turnEnvelope.attachments,
                    fileAttachments: turnEnvelope.attachments,
                    llmSettings: llmSettings || context.llmSettings || null,
                    returnAfterSteer: true,
                    onTaskEvent
                });
            } catch (error) {
                backgroundTaskStatus = 'failed';
                activeState.discardPersonaStream?.('task_agent_failed');
                if (progressRenderInFlight) {
                    await progressRenderInFlight;
                }
                const failurePacket = {
                    type: 'task.failed',
                    status: 'failed',
                    error: error?.message || String(error),
                    current_request: message
                };
                const displayText = await this.renderTaskPacket({
                    input: activeState.latestInput || input,
                    context: activeState.latestContext || context,
                    sessionId,
                    outerRunId,
                    turnEnvelope: activeState.latestTurnEnvelope || turnEnvelope,
                    packet: failurePacket,
                    purpose: 'failure'
                });
                commitFinalAnswer(displayText, failurePacket);
                return failurePacket;
            }

            activeState.turnId = normalizeString(taskResult?.turn_id, activeState.turnId);
            activeState.taskRoute = normalizeString(taskResult?.route, activeState.taskRoute).toLowerCase();
            if (activeState.taskRoute === 'chat') {
                activeState.openPersonaStream?.();
            } else {
                activeState.discardPersonaStream?.('task_agent_route_not_chat');
            }
            const taskStatus = normalizeString(taskResult?.status, 'completed').toLowerCase();
            if (!['completed', 'completed_with_warnings', 'success', 'succeeded'].includes(taskStatus)) {
                backgroundTaskStatus = taskStatus || 'failed';
            }

            if (taskResult?.route === 'chat') {
                let persona = null;
                while (true) {
                    const revision = activeState.revision;
                    const currentPersonaPromise = activeState.personaPromise;
                    persona = await currentPersonaPromise;
                    if (
                        revision === activeState.revision &&
                        currentPersonaPromise === activeState.personaPromise
                    ) {
                        break;
                    }
                }
                const personaText = normalizeString(
                    persona?.displayText || persona?.finalAnswer || persona?.speechText
                );
                if (personaText) {
                    commitFinalAnswer(personaText, taskResult, 'persona_actor');
                } else {
                    backgroundTaskStatus = 'failed';
                    activeState.discardPersonaStream?.('persona_final_unavailable');
                    this.emitGatewayEvent('agent.system.notice', {
                        runId: outerRunId,
                        sessionId,
                        turnId: activeState.turnId,
                        status: 'failed',
                        level: 'error',
                        code: 'persona_final_unavailable',
                        message: '对话渲染暂时不可用，请重试这一轮。',
                        source: 'persona_actor'
                    });
                }
                return taskResult;
            }

            if (taskResult?.steer_accepted === true) {
                return taskResult;
            }

            if (progressRenderInFlight) {
                await progressRenderInFlight;
            }
            const displayText = await this.renderTaskPacket({
                input: activeState.latestInput || input,
                context: activeState.latestContext || context,
                sessionId,
                outerRunId,
                turnEnvelope: activeState.latestTurnEnvelope || turnEnvelope,
                packet: taskResult,
                purpose: 'result'
            });
            commitFinalAnswer(displayText, taskResult);
            return taskResult;
        })();
        let trackedTaskPromise;
        trackedTaskPromise = taskPromise.catch((error) => {
            backgroundTaskStatus = 'failed';
            this.emitGatewayEvent('agent.system.notice', {
                runId: outerRunId,
                sessionId,
                status: 'failed',
                level: 'error',
                code: 'task_turn_failed',
                message: error?.message || String(error),
                source: 'task_agent_runtime'
            });
        }).finally(() => {
            this.backgroundTaskRuns.delete(trackedTaskPromise);
            if (this.activePersonaTurns.get(sessionId)?.runId === outerRunId) {
                this.activePersonaTurns.delete(sessionId);
            }
            this.emitGatewayEvent('task.background.finished', {
                runId: outerRunId,
                sessionId,
                turnId: activeState.turnId,
                status: backgroundTaskStatus,
                source: 'task_agent_actor'
            });
            this.emitGatewayEvent('agent.run.finished', {
                runId: outerRunId,
                sessionId,
                turnId: activeState.turnId,
                status: backgroundTaskStatus,
                ok: backgroundTaskStatus !== 'failed',
                phase: 'final_answer',
                source: 'task_agent'
            });
        });
        this.backgroundTaskRuns.add(trackedTaskPromise);
        return {
            ok: true,
            runId: outerRunId,
            sessionId,
            status: 'running',
            mode: 'persistent-task-agent-turn',
            intent: 'turn_started',
            taskRoute: 'pending',
            displayText: '',
            speechText: '',
            deferAssistantCommit: true,
            messagePhase: 'commentary',
            backgroundTask: {
                runId: outerRunId,
                sessionId,
                status: 'running'
            }
        };
    }

    async runAgent(request = {}) {
        const input = request && typeof request === 'object' ? request : {};
        const context = this.mergeDefaultContext(
            input.context && typeof input.context === 'object' ? input.context : {}
        );
        const requestedTextDelta = typeof input.onTextDelta === 'function'
            ? input.onTextDelta
            : null;
        const streamBeforeFinalGate = Boolean(
            requestedTextDelta && !this.shouldRunEmberHarness(context)
        );
        const sessionId = normalizeString(input.sessionId || input.sessionKey || context.sessionId || context.sessionKey, 'main');
        const runId = normalizeString(input.runId || context.runId);
        const inputGate = await this.runEmberHarnessCheck({
            stage: 'user_input',
            boundary: 'untrusted_input_enter_context',
            text: {
                message: input.message || input.prompt || input.task || '',
                attachments: Array.isArray(input.attachments) ? input.attachments : [],
                messageHistoryCount: Array.isArray(input.messageHistory) ? input.messageHistory.length : 0
            },
            context,
            runId,
            sessionId,
            metadata: {
                source: 'agent.run',
                agentLoop: input.agentLoop || context.agentLoop,
                planner: input.planner || context.planner
            }
        });
        if (inputGate.blocked) {
            return {
                ok: false,
                status: 'blocked',
                mode: 'agent',
                intent: 'blocked_by_ember_harness',
                displayText: '本次请求已被 EMBER-Harness 阶段门控阻断，未进入智能体执行链路。',
                speechText: '本次请求已被安全门控阻断。',
                emberHarness: summarizeEmberHarnessRecord(inputGate)
            };
        }
        const agentRole = normalizeString(input.agentRole || context.agentRole).toLowerCase();
        const taskAgentOwnsTurn = context.taskAgentRoutingOwned === true &&
            !['task', 'task_agent', 'worker', 'subagent', 'child_agent'].includes(agentRole) &&
            context.personaRenderOnly !== true &&
            input.personaRenderOnly !== true;
        const streamedDuringRun = streamBeforeFinalGate;
        const effectiveLlmSettings = (
            input.llmSettings && typeof input.llmSettings === 'object' ? input.llmSettings :
            input.llm && typeof input.llm === 'object' ? input.llm :
            context.llmSettings && typeof context.llmSettings === 'object' ? context.llmSettings :
            context.llm && typeof context.llm === 'object' ? context.llm :
            null
        );
        const result = taskAgentOwnsTurn
            ? await this.runTaskAgentControlledPersonaTurn({
                  input: {
                      ...input,
                      onTextDelta: streamBeforeFinalGate ? input.onTextDelta : undefined,
                      onTextStreamEvent: streamBeforeFinalGate ? input.onTextStreamEvent : undefined
                  },
                  context,
                  sessionId,
                  runId,
                  llmSettings: effectiveLlmSettings
              })
            : await this.ensureAgentRunner().runMessage({
                  ...input,
                  onTextDelta: streamedDuringRun ? requestedTextDelta : undefined,
                  context
              });
        const emitControlledRunFinished = (payload = {}) => {
            if (!taskAgentOwnsTurn || result?.deferAssistantCommit === true) {
                return;
            }
            this.emitGatewayEvent('agent.run.finished', {
                runId: normalizeString(payload.runId || result?.runId || runId),
                sessionId: normalizeString(payload.sessionId || result?.sessionId || sessionId, sessionId),
                status: normalizeString(payload.status || result?.status, 'completed'),
                ok: payload.ok === true,
                displayText: normalizeString(payload.displayText || payload.text),
                speechText: normalizeString(payload.speechText),
                source: 'persona_actor'
            });
        };
        const finalText = normalizeString(
            result?.displayText ||
            result?.speechText ||
            result?.finalAnswer ||
            result?.answer ||
            result?.message
        );
        if (!finalText) {
            emitControlledRunFinished(result || {});
            return {
                ...result,
                emberHarness: {
                    input: summarizeEmberHarnessRecord(inputGate)
                }
            };
        }
        const finalGate = await this.runEmberHarnessCheck({
            stage: 'final_output',
            boundary: 'final_output_before_user',
            text: finalText,
            context,
            runId: result?.runId || runId,
            sessionId: result?.sessionId || sessionId,
            metadata: {
                source: 'agent.run',
                status: result?.status,
                ok: result?.ok === true
            }
        });
        if (finalGate.blocked) {
            const blockedResult = {
                ok: false,
                status: 'blocked',
                runId: result?.runId,
                sessionId: result?.sessionId || sessionId,
                displayText: '最终回答已被 EMBER-Harness 阶段门控阻断，系统已回退到最近稳定阶段快照。',
                speechText: '最终回答已被安全门控阻断。'
            };
            emitControlledRunFinished(blockedResult);
            return {
                ...blockedResult,
                mode: result?.mode || 'agent',
                intent: 'blocked_by_ember_harness',
                durationMs: result?.durationMs,
                emberHarness: {
                    input: summarizeEmberHarnessRecord(inputGate),
                    final: summarizeEmberHarnessRecord(finalGate)
                }
            };
        }
        if (requestedTextDelta && !streamedDuringRun) {
            await requestedTextDelta(finalText, {
                runId: result?.runId || runId,
                sessionId: result?.sessionId || sessionId,
                bufferedBy: 'ember_final_output_gate'
            });
        }
        emitControlledRunFinished({
            ...result,
            displayText: finalText,
            speechText: result?.speechText || finalText
        });
        return {
            ...result,
            emberHarness: {
                input: summarizeEmberHarnessRecord(inputGate),
                final: summarizeEmberHarnessRecord(finalGate)
            }
        };
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

    async executeTaskAgent({ agent, args = {}, context = {}, signal, onEvent, registerInputHandler } = {}) {
        const task = normalizeString(agent?.task || args.task || args.prompt || args.message);
        if (!task) {
            return {
                ok: false,
                status: 'failed',
                displayText: 'Subagent task is empty.'
            };
        }
        const parentLlmSettings = (
            args.llmSettings && typeof args.llmSettings === 'object' ? args.llmSettings :
            args.llm && typeof args.llm === 'object' ? args.llm :
            context.llmSettings && typeof context.llmSettings === 'object' ? context.llmSettings :
            context.llm && typeof context.llm === 'object' ? context.llm :
            null
        );
        const inheritanceMode = ['clean', 'recent', 'checkpoint'].includes(normalizeString(
            args.inheritanceMode || context.taskAgentInheritanceMode,
            'clean'
        ).toLowerCase())
            ? normalizeString(args.inheritanceMode || context.taskAgentInheritanceMode, 'clean').toLowerCase()
            : 'clean';
        const inheritedCheckpoint = inheritanceMode === 'checkpoint'
            ? args.contextManagerCheckpoint || context.initialContextManagerCheckpoint || null
            : null;
        const sharedSessionHistory = (
            Array.isArray(args.sharedSessionHistory) ? args.sharedSessionHistory :
            Array.isArray(context.sharedSessionHistory) ? context.sharedSessionHistory :
            Array.isArray(context.shared_session_history) ? context.shared_session_history :
            inheritanceMode === 'recent' && Array.isArray(args.recentMessages) ? args.recentMessages :
            inheritanceMode === 'recent' && Array.isArray(context.recentMessages) ? context.recentMessages :
            []
        )
            .filter((entry) => entry && ['user', 'assistant'].includes(entry.role))
            .map((entry) => ({
                role: entry.role,
                content: normalizeString(entry.content),
                ...(Array.isArray(entry.attachments) && entry.attachments.length
                    ? { attachments: cloneJson(entry.attachments) || [] }
                    : {})
            }))
            .filter((entry) => entry.content)
            .slice(-240);
        const sharedSessionDeveloperMessage = inheritanceMode === 'checkpoint' && sharedSessionHistory.length
            ? [
                  '<shared_session_context>',
                  JSON.stringify({
                      schema: 'ailis.shared_session_context.v1',
                      session_id: normalizeString(agent?.sessionId || context.parentSessionId),
                      visible_history: sharedSessionHistory,
                      current_user_message: task,
                      instruction: 'This is the canonical visible Session conversation shared with Persona. The current user message may be a continuation such as 继续 or 速度, so determine the requested task from the whole conversation. Handoff transferred execution control only and did not supply a rewritten task.'
                  }),
                  '</shared_session_context>'
              ].join('\n')
            : '';
        const attachments = Array.isArray(context.attachments)
            ? context.attachments
            : Array.isArray(context.fileAttachments)
                ? context.fileAttachments
                : [];
        const childContext = this.mergeDefaultContext({
            ...context,
            ...(parentLlmSettings ? { llmSettings: parentLlmSettings } : {}),
            taskAgentPermissionMode: 'unrestricted',
            permissionProfile: 'danger-full-access',
            approvalPolicy: 'never',
            confirmationPolicy: 'never',
            approved: true,
            autoConfirm: false,
            requireApprovalForMutations: false,
            computerControlEnabled: true,
            visionPermissionPolicy: 'auto',
            executeExternal: true,
            allowOutsideWorkspace: true,
            allowComputerWideAccess: true,
            allowSystemMutation: true,
            parentRunId: agent?.runId,
            parentSessionId: agent?.sessionId,
            agentId: agent?.id,
            agentLabel: agent?.label,
            agentPath: agent?.agent_path,
            runId: agent?.childRunId || context.runId,
            sessionId: agent?.childSessionId || context.sessionId,
            sessionKey: agent?.childSessionId || context.sessionKey,
            agentLoop: 'llm',
            planner: 'llm',
            agentRole: 'task_agent',
            contextMode: 'task_agent',
            cleanContext: inheritanceMode === 'clean',
            taskAgentInheritanceMode: inheritanceMode,
            initialContextManagerCheckpoint: inheritedCheckpoint,
            sharedSessionHistory,
            shared_session_history: sharedSessionHistory,
            attachments,
            fileAttachments: attachments
        });
        await onEvent?.({
            type: 'subagent.runner.started',
            status: 'running',
            message: task,
            payload: {
                agentId: agent?.id,
                sessionId: agent?.childSessionId
            }
        });
        const agentRunner = this.ensureAgentRunner();
        const childRunId = normalizeString(agent?.childRunId || context.runId);
        const forwardChildEvent = (event = {}) => {
            const eventType = normalizeString(event.type);
            const eventPayload = event.payload && typeof event.payload === 'object' ? event.payload : {};
            if (
                !TASK_AGENT_PUBLIC_EVENT_TYPES.has(eventType) ||
                normalizeString(eventPayload.runId) !== childRunId
            ) {
                return;
            }
            void onEvent?.({
                type: eventType,
                status: normalizeString(eventPayload.status, 'running'),
                message: normalizeString(eventPayload.text || eventPayload.summary || eventPayload.progressNote),
                payload: eventPayload
            });
        };
        this.privateRunIds.add(childRunId);
        this.on('private-event', forwardChildEvent);
        const runPromise = agentRunner.runMessage({
            runId: agent?.childRunId,
            message: task,
            messageHistory: sharedSessionHistory,
            attachments,
            sessionId: agent?.childSessionId || context.sessionId || context.sessionKey,
            agentLoop: 'llm',
            planner: 'llm',
            agentRole: 'task_agent',
            ...(parentLlmSettings ? { llmSettings: parentLlmSettings } : {}),
            ...(sharedSessionDeveloperMessage
                ? { ephemeralDeveloperMessage: sharedSessionDeveloperMessage }
                : {}),
            taskAgentInheritanceMode: inheritanceMode,
            initialContextManagerCheckpoint: inheritedCheckpoint,
            initialStepResults: Array.isArray(args.initialStepResults) ? args.initialStepResults : [],
            context: childContext
        });
        const unregisterInputHandler = typeof registerInputHandler === 'function'
            ? registerInputHandler((message) => {
                  const delivered = agentRunner.enqueueRunInput({
                      runId: agent?.childRunId,
                      sessionId: agent?.childSessionId || context.sessionId || context.sessionKey,
                      message
                  });
                  if (!delivered) {
                      throw new Error('TaskAgent input queue is not available for this run.');
                  }
              })
            : () => {};
        let result;
        try {
            result = signal
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
        } finally {
            this.off('private-event', forwardChildEvent);
            this.privateRunIds.delete(childRunId);
            unregisterInputHandler?.();
        }
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
        const taskRunHandoff = result?.taskRunHandoff ||
            result?.task_run_handoff ||
            result?.handoff ||
            null;
        return {
            ok: result?.ok === true,
            status: result?.status || (result?.ok === false ? 'failed' : 'completed'),
            runId: result?.runId,
            mode: result?.mode,
            intent: result?.intent,
            displayText: taskRunHandoff?.userVisibleSummary || result?.displayText || result?.speechText || '',
            speechText: result?.speechText || taskRunHandoff?.userVisibleSummary || result?.displayText || '',
            durationMs: result?.durationMs,
            taskRunHandoff,
            steps: result?.steps || [],
            plan: result?.plan || []
        };
    }

    async callAgentRuntimeTool({ callId = '', toolId, args, context, workspaceDir }) {
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
            ...context,
            workspace: workspaceDir,
            sessionKey: context.sessionKey || args.sessionKey || 'main'
        });
        const tool = tools.get(toolId);
        if (!tool?.execute) {
            return this.notAvailableResult(toolId, 'not-materialized');
        }

        const finalArgs = this.prepareToolArgs({ toolId, args, context, workspaceDir });
        if (GATEWAY_BACKED_TOOL_IDS.has(toolId) || SESSION_BOUND_TOOL_IDS.has(toolId)) {
            return await this.withDefaultAgentRuntimeGatewayEnv(() => tool.execute(`ailis-${toolId}`, finalArgs));
        }
        return await tool.execute(`ailis-${toolId}`, finalArgs);
    }

    getWebRunSession(context = {}) {
        const key = normalizeString(
            context.runId || context.sessionId || context.sessionKey,
            'main'
        );
        let state = this.webRunSessions.get(key);
        if (!state) {
            state = {
                refs: new Map(),
                countersByTurn: new Map()
            };
            this.webRunSessions.set(key, state);
            while (this.webRunSessions.size > 64) {
                this.webRunSessions.delete(this.webRunSessions.keys().next().value);
            }
        }
        return state;
    }

    registerWebRunRef(context = {}, kind = 'search', url = '', metadata = {}) {
        const state = this.getWebRunSession(context);
        const iteration = Math.max(0, Number(context.iteration) || 0);
        const turnCounters = state.countersByTurn.get(iteration) || { search: 0, view: 0 };
        const counterKey = kind === 'view' ? 'view' : 'search';
        const refId = `turn${iteration}${counterKey}${turnCounters[counterKey]}`;
        turnCounters[counterKey] += 1;
        state.countersByTurn.set(iteration, turnCounters);
        state.refs.set(refId, {
            ref_id: refId,
            url: normalizeString(url),
            ...cloneJson(metadata)
        });
        return refId;
    }

    resolveWebRunRef(context = {}, refId = '') {
        const normalized = normalizeString(refId);
        if (/^https?:\/\//i.test(normalized)) {
            return { ref_id: normalized, url: normalized };
        }
        return this.getWebRunSession(context).refs.get(normalized) || null;
    }

    executeWebRunCachedFind(resolved = {}, operation = {}, context = {}) {
        const extractedText = String(resolved.extractedText || resolved.extracted_text || '');
        const pattern = normalizeString(operation.pattern);
        if (!extractedText || !pattern) {
            return null;
        }
        const allLines = extractedText.split(/\r?\n/);
        const normalizedPattern = pattern.toLowerCase();
        const matchIndexes = [];
        for (let index = 0; index < allLines.length; index += 1) {
            if (allLines[index].toLowerCase().includes(normalizedPattern)) {
                matchIndexes.push(index);
            }
        }
        const selectedIndexes = new Set();
        for (const matchIndex of matchIndexes.slice(0, 8)) {
            for (
                let index = Math.max(0, matchIndex - 3);
                index <= Math.min(allLines.length - 1, matchIndex + 3);
                index += 1
            ) {
                selectedIndexes.add(index);
            }
        }
        const viewRef = this.registerWebRunRef(context, 'view', resolved.url, {
            parent_ref_id: normalizeString(operation.ref_id),
            mode: 'find',
            extractedText,
            contentType: normalizeString(
                resolved.contentType || resolved.content_type,
                'application/pdf'
            )
        });
        const sourceLines = [...selectedIndexes]
            .sort((left, right) => left - right)
            .map((index) => ({
                lineNumber: index + 1,
                line_number: index + 1,
                lineno: index + 1,
                text: allLines[index],
                rendered: `L${index + 1}: ${allLines[index]}`
            }));
        const lineStart = sourceLines[0]?.lineno || 1;
        const lineEnd = sourceLines.at(-1)?.lineno || lineStart;
        const sourceWindow = {
            type: 'source_viewport',
            action: {
                type: 'find_in_page',
                url: normalizeString(resolved.url),
                pattern
            },
            url: normalizeString(resolved.url),
            ref_id: viewRef,
            contentType: normalizeString(
                resolved.contentType || resolved.content_type,
                'application/pdf'
            ),
            content_type: normalizeString(
                resolved.contentType || resolved.content_type,
                'application/pdf'
            ),
            totalLines: allLines.length,
            total_lines: allLines.length,
            lineno: lineStart,
            lineStart,
            line_start: lineStart,
            lineEnd,
            line_end: lineEnd,
            hasMoreBefore: lineStart > 1,
            has_more_before: lineStart > 1,
            hasMoreAfter: lineEnd < allLines.length,
            has_more_after: lineEnd < allLines.length,
            lines: sourceLines
        };
        const text = matchIndexes.length
            ? [
                  `Find results in cached extracted source for pattern: ${pattern}`,
                  `Matches: ${matchIndexes.length}`,
                  ...sourceLines.map((line) => line.rendered)
              ].join('\n')
            : `No matches in cached extracted source for pattern: ${pattern}`;
        const structuredContent = {
            status: 'completed',
            cached: true,
            url: normalizeString(resolved.url),
            ref_id: viewRef,
            pattern,
            matchCount: matchIndexes.length,
            match_count: matchIndexes.length,
            source: sourceWindow,
            source_window: sourceWindow,
            sourceWindow,
            sourceViewport: sourceWindow,
            source_viewport: sourceWindow
        };
        return {
            content: [{ type: 'text', text }],
            isError: false,
            details: structuredContent,
            structuredContent
        };
    }

    async executeWebRunSearch(args = {}, context = {}) {
        const queries = (Array.isArray(args.search_query) ? args.search_query : [])
            .slice(0, 4)
            .map((entry) => ({
                q: normalizeString(entry?.q),
                recency: entry?.recency,
                domains: Array.isArray(entry?.domains) ? entry.domains.map((domain) => normalizeString(domain)).filter(Boolean) : []
            }))
            .filter((entry) => entry.q);
        if (!queries.length) {
            return {
                content: [{ type: 'text', text: 'web_run search_query requires at least one non-empty q.' }],
                isError: true,
                structuredContent: { status: 'invalid_tool_args', error: 'empty search_query' }
            };
        }
        const sourceQuestion = normalizeString(
            context.currentUserMessage ||
            context.currentTaskRequest ||
            context.current_task_request
        );
        const maxResults = args.response_length === 'short' ? 4 : args.response_length === 'long' ? 12 : 8;
        const perQueryTimeoutMs = Math.max(
            25,
            Math.min(Number(context.webRunSearchTimeoutMs) || 45000, 120000)
        );
        const responses = await Promise.all(queries.map(async (query) => {
            try {
                return await withTimeout(perQueryTimeoutMs, () => this.runtime.executeMcpBridge({
                    action: 'call_tool',
                    server: 'ailis_research',
                    tool: 'web_search',
                    timeoutMs: perQueryTimeoutMs,
                    args: {
                        query: query.q,
                        maxResults,
                        ...(query.recency !== undefined ? { recency: query.recency } : {}),
                        ...(query.domains.length ? { domains: query.domains } : {})
                    }
                }, context));
            } catch (error) {
                const timedOut = error?.code === 'AILIS_GATEWAY_TIMEOUT';
                const status = timedOut ? 'search_timeout' : 'search_failed';
                const message = timedOut
                    ? `Search query exceeded its ${perQueryTimeoutMs}ms budget.`
                    : normalizeString(error?.message || String(error), 'The underlying search tool failed.');
                return {
                    content: [{ type: 'text', text: message }],
                    isError: true,
                    details: {
                        status,
                        error: message,
                        retryable: true,
                        timeoutMs: perQueryTimeoutMs
                    },
                    structuredContent: {
                        status,
                        error: message,
                        retryable: true,
                        timeoutMs: perQueryTimeoutMs
                    }
                };
            }
        }));
        const failures = responses.flatMap((response, queryIndex) => {
            const details = bridgeStructuredContent(response);
            const nestedDetails = firstObject(details.details, response?.details?.details);
            const failed = response?.isError === true
                || response?.details?.result?.isError === true
                || details.isError === true
                || details.status === 'error'
                || nestedDetails.status === 'invalid_mcp_tool_args';
            if (!failed) {
                return [];
            }
            return [{
                query_index: queryIndex,
                query: queries[queryIndex].q,
                status: normalizeString(nestedDetails.status || details.status, 'search_failed'),
                error: normalizeString(
                    nestedDetails.error
                    || details.error
                    || bridgeTextContent(response),
                    'The underlying search tool failed.'
                ),
                ...(Array.isArray(nestedDetails.errors) ? { errors: cloneJson(nestedDetails.errors) } : {})
            }];
        });
        const excludedEvaluationLeakResults = [];
        const evaluationMode = Boolean(
            normalizeString(context.evaluationName || context.evaluation_name) ||
            context.benchmarkEvaluation === true ||
            context.benchmark_evaluation === true
        );
        const queryResults = responses.map((response, queryIndex) => {
            const details = bridgeStructuredContent(response);
            const results = Array.isArray(details.results)
                ? details.results
                : Array.isArray(details.webSearchOutput?.search?.results)
                ? details.webSearchOutput.search.results
                : Array.isArray(details.search?.results)
                ? details.search.results
                : [];
            return results.flatMap((result) => {
                if (
                    evaluationMode &&
                    (
                        isEvaluationAnswerLeak(sourceQuestion, result) ||
                        isEvaluationTaskMirror(sourceQuestion, result)
                    )
                ) {
                    excludedEvaluationLeakResults.push({
                        query_index: queryIndex,
                        title: normalizeString(result?.title),
                        url: normalizeString(result?.url),
                        reason: isEvaluationAnswerLeak(sourceQuestion, result)
                            ? 'Search result repeats the evaluation question and exposes a labeled answer.'
                            : 'Search result is an evaluation-corpus mirror rather than an independent source.'
                    });
                    return [];
                }
                return [{ ...result, query_index: queryIndex }];
            });
        });
        const merged = [];
        const seenUrls = new Set();
        const longest = Math.max(0, ...queryResults.map((results) => results.length));
        for (let rank = 0; rank < longest && merged.length < maxResults; rank += 1) {
            for (const results of queryResults) {
                const result = results[rank];
                const url = normalizeString(result?.url);
                if (!url || seenUrls.has(url)) {
                    continue;
                }
                seenUrls.add(url);
                const refId = this.registerWebRunRef(context, 'search', url, {
                    title: result.title,
                    snippet: result.snippet,
                    query_index: result.query_index
                });
                merged.push({
                    id: refId,
                    ref_id: refId,
                    title: normalizeString(result.title || result.text || url),
                    url,
                    snippet: normalizeString(result.snippet || result.content),
                    source: normalizeString(result.source || result.sourceBackend),
                    rank: merged.length + 1,
                    query_index: result.query_index
                });
                if (merged.length >= maxResults) {
                    break;
                }
            }
        }
        const queryValues = queries.map((query) => query.q);
        const action = queryValues.length === 1
            ? { type: 'search', query: queryValues[0] }
            : { type: 'search', queries: queryValues };
        const webSearchCall = { type: 'web_search_call', status: 'completed', action };
        if (failures.length === responses.length) {
            const failedCall = { ...webSearchCall, status: 'failed' };
            const failedSearch = {
                status: 'search_failed',
                queries: queryValues,
                results: [],
                candidates: [],
                failures
            };
            const structuredContent = {
                type: 'function_call_output',
                status: 'failed',
                webSearchCall: failedCall,
                web_search_call: failedCall,
                search: failedSearch
            };
            return {
                content: [{
                    type: 'text',
                    text: [
                        'Web search failed before producing results.',
                        ...failures.map((failure) => `${failure.query}: ${failure.status}: ${failure.error}`)
                    ].join('\n')
                }],
                isError: true,
                details: structuredContent,
                structuredContent
            };
        }
        const webSearchOutput = {
            type: 'function_call_output',
            webSearchCall,
            web_search_call: webSearchCall,
            functionCallOutput: { type: 'function_call_output', status: 'completed', output_kind: 'web_search_results' },
            function_call_output: { type: 'function_call_output', status: 'completed', output_kind: 'web_search_results' },
            search: {
                status: merged.length ? 'completed' : 'empty',
                queries: queryValues,
                results: merged,
                candidates: merged,
                ...(failures.length ? { failures } : {})
            }
        };
        const text = [
            ...(excludedEvaluationLeakResults.length
                ? [`Excluded ${excludedEvaluationLeakResults.length} evaluation-answer leak candidate(s).`]
                : []),
            merged.length ? 'Search results:' : 'No search results.',
            ...merged.flatMap((result, index) => [
                `${index + 1}. [${result.ref_id}] ${result.title}`,
                `   URL: ${result.url}`,
                result.snippet ? `   Snippet: ${result.snippet}` : ''
            ].filter(Boolean))
        ].join('\n');
        const structuredContent = {
            type: 'function_call_output',
            status: 'completed',
            webSearchCall,
            web_search_call: webSearchCall,
            webSearchOutput,
            web_search_output: webSearchOutput,
            search: webSearchOutput.search
        };
        return {
            content: [{ type: 'text', text }],
            isError: false,
            details: structuredContent,
            structuredContent
        };
    }

    async executeWebRunNavigation(operation = {}, context = {}, mode = 'open') {
        const resolved = this.resolveWebRunRef(context, operation.ref_id);
        if (!resolved?.url) {
            return {
                content: [{ type: 'text', text: `Unknown web reference id: ${normalizeString(operation.ref_id)}` }],
                isError: true,
                structuredContent: { status: 'unknown_ref_id', ref_id: normalizeString(operation.ref_id) }
            };
        }
        const state = this.getWebRunSession(context);
        const sourceQuestion = normalizeString(
            context.currentUserMessage ||
            context.currentTaskRequest ||
            context.current_task_request
        );
        if (mode === 'find') {
            const cachedFind = this.executeWebRunCachedFind(resolved, operation, context);
            if (cachedFind) {
                return cachedFind;
            }
        }
        const resolvedFetchBackend = normalizeString(
            resolved.fetchBackend || resolved.fetch_backend
        ).toLowerCase();
        let tool = mode === 'find'
            ? 'web_find'
            : resolvedFetchBackend.startsWith('crawl4ai')
            ? 'render_page'
            : resolvedFetchBackend
            ? 'web_fetch'
            : 'render_page';
        const bridgeArgs = mode === 'find'
            ? { url: resolved.url, pattern: operation.pattern }
            : {
                url: resolved.url,
                ...(operation.lineno !== undefined ? { lineno: operation.lineno } : {}),
                ...(sourceQuestion ? { query: sourceQuestion } : {})
            };
        let response = await this.runtime.executeMcpBridge({
            action: 'call_tool',
            server: 'ailis_research',
            tool,
            args: bridgeArgs
        }, context);
        const renderedFailed = tool === 'render_page' && (
            response?.isError === true || response?.details?.result?.isError === true
        );
        if (renderedFailed) {
            tool = 'web_fetch';
            response = await this.runtime.executeMcpBridge({
                action: 'call_tool',
                server: 'ailis_research',
                tool,
                args: bridgeArgs
            }, context);
        }
        const cloned = cloneJson(response) || {};
        const details = bridgeStructuredContent(cloned);
        const contentType = normalizeString(details.contentType || details.content_type).toLowerCase();
        if (mode === 'open' && contentType.includes('application/pdf')) {
            const pdfResponse = await this.executeWebRunPdf(resolved.url, context, {
                parentRefId: normalizeString(operation.ref_id)
            });
            if (pdfResponse.isError !== true) {
                return pdfResponse;
            }
        }
        const viewRef = this.registerWebRunRef(context, 'view', resolved.url, {
            parent_ref_id: normalizeString(operation.ref_id),
            mode
        });
        const sourceViews = [
            details.source,
            details.source_viewport,
            details.sourceViewport,
            details.source_window,
            details.sourceWindow
        ].filter((value) => value && typeof value === 'object' && !Array.isArray(value));
        for (const sourceView of sourceViews) {
            sourceView.ref_id = viewRef;
        }
        const observedLinks = Array.isArray(details.observedRelevantLinks)
            ? details.observedRelevantLinks
            : Array.isArray(details.observed_relevant_links)
            ? details.observed_relevant_links
            : [];
        const sectionLinks = sourceViewportSectionLinks(sourceViews, resolved.url);
        const mergedLinks = [];
        const seenLinkUrls = new Set();
        for (const link of [...sectionLinks, ...observedLinks]) {
            const url = normalizeString(link?.url);
            if (!url || seenLinkUrls.has(url)) {
                continue;
            }
            seenLinkUrls.add(url);
            mergedLinks.push(link);
        }
        const numberedLinks = mergedLinks
            .map((link, index) => ({
                ...link,
                id: index + 1,
                url: normalizeString(link?.url)
            }))
            .filter((link) => link.url);
        if (numberedLinks.length) {
            const state = this.getWebRunSession(context);
            const view = state.refs.get(viewRef);
            if (view) {
                view.links = cloneJson(numberedLinks);
            }
            const openedRef = state.refs.get(normalizeString(operation.ref_id));
            if (openedRef) {
                openedRef.links = cloneJson(numberedLinks);
            }
            details.observedRelevantLinks = numberedLinks;
            details.observed_relevant_links = numberedLinks;
        }
        const fetchBackend = normalizeString(details.fetchBackend || details.fetch_backend);
        const view = state.refs.get(viewRef);
        if (view) {
            view.fetchBackend = fetchBackend;
        }
        const openedRef = state.refs.get(normalizeString(operation.ref_id));
        if (openedRef) {
            openedRef.fetchBackend = fetchBackend;
        }
        details.ref_id = viewRef;
        details.url = resolved.url;
        return {
            content: [{
                type: 'text',
                text: bridgeTextContent(cloned)
            }],
            isError: cloned.isError === true || cloned.details?.result?.isError === true,
            details,
            structuredContent: details
        };
    }

    async executeWebRunClick(operation = {}, context = {}) {
        const resolved = this.resolveWebRunRef(context, operation.ref_id);
        const linkId = Number(operation.id);
        const link = Array.isArray(resolved?.links)
            ? resolved.links.find((candidate) => Number(candidate.id) === linkId)
            : null;
        if (!link?.url) {
            return {
                content: [{
                    type: 'text',
                    text: `Unknown link id ${normalizeString(operation.id)} for web reference ${normalizeString(operation.ref_id)}.`
                }],
                isError: true,
                structuredContent: {
                    status: 'unknown_link_id',
                    ref_id: normalizeString(operation.ref_id),
                    id: linkId
                }
            };
        }
        const navigationMode = normalizeString(link.navigationMode || link.navigation_mode).toLowerCase();
        const sectionPattern = normalizeString(link.pattern || link.text || link.title);
        if (navigationMode === 'find' && sectionPattern) {
            return await this.executeWebRunNavigation({
                ref_id: operation.ref_id,
                pattern: sectionPattern
            }, context, 'find');
        }
        const navigation = await this.executeWebRunNavigation({ ref_id: link.url }, context, 'open');
        if (normalizeString(link.kind).toLowerCase() !== 'pdf') {
            return navigation;
        }
        const navigationDetails = firstObject(navigation.structuredContent, navigation.details);
        const contentType = normalizeString(
            navigationDetails.contentType || navigationDetails.content_type
        ).toLowerCase();
        if (contentType.includes('application/pdf')) {
            return navigation;
        }
        const observedLinks = Array.isArray(navigationDetails.observedRelevantLinks)
            ? navigationDetails.observedRelevantLinks
            : Array.isArray(navigationDetails.observed_relevant_links)
            ? navigationDetails.observed_relevant_links
            : [];
        const pdfCandidate = observedLinks.find((candidate) => (
            normalizeString(candidate?.kind).toLowerCase() === 'pdf' &&
            normalizeString(candidate?.url) &&
            normalizeString(candidate.url) !== normalizeString(link.url)
        ));
        if (!pdfCandidate?.url) {
            return navigation;
        }
        const pdfResponse = await this.executeWebRunPdf(pdfCandidate.url, context, {
            parentRefId: navigationDetails.ref_id || operation.ref_id
        });
        return pdfResponse.isError === true ? navigation : pdfResponse;
    }

    async executeWebRunScreenshot(operation = {}, context = {}) {
        const resolved = this.resolveWebRunRef(context, operation.ref_id);
        if (!resolved?.url) {
            return {
                content: [{ type: 'text', text: `Unknown web reference id: ${normalizeString(operation.ref_id)}` }],
                isError: true,
                structuredContent: {
                    status: 'unknown_ref_id',
                    ref_id: normalizeString(operation.ref_id)
                }
            };
        }
        const workspaceDir = this.resolveWorkspace(
            context.workspaceDir || context.workspace || this.workspaceRoot,
            context
        );
        const screenshotDir = path.join(workspaceDir, '.ailis-web-screenshots');
        await fsp.mkdir(screenshotDir, { recursive: true });
        const screenshotPath = path.join(screenshotDir, `${randomUUID()}.png`);
        const sourceQuestion = normalizeString(
            context.currentUserMessage ||
            context.currentTaskRequest ||
            context.current_task_request
        );
        const response = await this.runtime.executeMcpBridge({
            action: 'call_tool',
            server: 'ailis_research',
            tool: 'webpage_screenshot',
            args: {
                url: resolved.url,
                path: screenshotPath,
                detail: normalizeString(operation.detail, 'original'),
                ...(operation.waitFor ? { waitFor: operation.waitFor } : {}),
                ...(operation.delayMs !== undefined ? { delayMs: operation.delayMs } : {}),
                ...(operation.fullPage !== undefined ? { fullPage: operation.fullPage } : {}),
                ...(operation.full_page !== undefined ? { fullPage: operation.full_page } : {}),
                ...(operation.width !== undefined ? { width: operation.width } : {}),
                ...(operation.height !== undefined ? { height: operation.height } : {}),
                ...(sourceQuestion ? { query: sourceQuestion } : {})
            }
        }, context);
        const cloned = cloneJson(response) || {};
        const details = bridgeStructuredContent(cloned);
        const viewRef = this.registerWebRunRef(context, 'view', resolved.url, {
            parent_ref_id: normalizeString(operation.ref_id),
            mode: 'screenshot',
            screenshotPath: normalizeString(details.path || screenshotPath)
        });
        details.ref_id = viewRef;
        details.url = resolved.url;
        return {
            content: [{ type: 'text', text: bridgeTextContent(cloned) }],
            isError: cloned.isError === true || cloned.details?.result?.isError === true,
            details,
            structuredContent: details
        };
    }

    async executeWebRunPdf(url = '', context = {}, { parentRefId = '' } = {}) {
        const sourceQuestion = normalizeString(
            context.currentUserMessage ||
            context.currentTaskRequest ||
            context.current_task_request
        );
        const response = await this.runtime.executeMcpBridge({
            action: 'call_tool',
            server: 'ailis_research',
            tool: 'pdf_extract_text',
            args: {
                url: normalizeString(url),
                maxChars: 24000,
                maxPages: 24,
                ...(sourceQuestion ? { query: sourceQuestion } : {})
            }
        }, context);
        const cloned = cloneJson(response) || {};
        const details = bridgeStructuredContent(cloned);
        const text = bridgeTextContent(cloned);
        const isError = cloned.isError === true || cloned.details?.result?.isError === true || !normalizeString(text);
        if (isError) {
            return {
                content: [{ type: 'text', text }],
                isError: true,
                details,
                structuredContent: details
            };
        }
        const extractedText = String(
            details.extractedText ||
            details.extracted_text ||
            text
        );
        delete details.extractedText;
        delete details.extracted_text;
        const viewRef = this.registerWebRunRef(context, 'view', url, {
            parent_ref_id: normalizeString(parentRefId),
            mode: 'open',
            extractedText,
            contentType: normalizeString(
                details.contentType || details.content_type,
                'application/pdf'
            )
        });
        const sourceLines = extractedText
            .split(/\r?\n/)
            .map((line, index) => ({
                lineNumber: index + 1,
                line_number: index + 1,
                lineno: index + 1,
                text: line,
                rendered: `L${index + 1}: ${line}`
            }));
        const lineEnd = Math.max(1, sourceLines.length);
        const sourceWindow = {
            type: 'source_viewport',
            action: {
                type: 'open_page',
                url: normalizeString(url),
                lineno: 1
            },
            url: normalizeString(url),
            ref_id: viewRef,
            contentType: normalizeString(details.contentType || details.content_type, 'application/pdf'),
            content_type: normalizeString(details.contentType || details.content_type, 'application/pdf'),
            totalLines: lineEnd,
            total_lines: lineEnd,
            lineno: 1,
            lineStart: 1,
            line_start: 1,
            lineEnd,
            line_end: lineEnd,
            hasMoreBefore: false,
            has_more_before: false,
            hasMoreAfter: false,
            has_more_after: false,
            lines: sourceLines
        };
        const structuredContent = {
            ...details,
            status: 'completed',
            url: normalizeString(url),
            ref_id: viewRef,
            source: sourceWindow,
            source_window: sourceWindow,
            sourceWindow,
            sourceViewport: sourceWindow,
            source_viewport: sourceWindow
        };
        return {
            content: [{ type: 'text', text }],
            isError: false,
            details: structuredContent,
            structuredContent
        };
    }

    async executeWebRun(args = {}, context = {}) {
        if (Array.isArray(args.search_query) && args.search_query.length) {
            return await this.executeWebRunSearch(args, context);
        }
        if (Array.isArray(args.open) && args.open.length) {
            return await this.executeWebRunNavigation(args.open[0], context, 'open');
        }
        if (Array.isArray(args.click) && args.click.length) {
            return await this.executeWebRunClick(args.click[0], context);
        }
        if (Array.isArray(args.find) && args.find.length) {
            return await this.executeWebRunNavigation(args.find[0], context, 'find');
        }
        if (Array.isArray(args.screenshot) && args.screenshot.length) {
            return await this.executeWebRunScreenshot(args.screenshot[0], context);
        }
        if (Array.isArray(args.archive) && args.archive.length) {
            return await this.runtime.executeMcpBridge({
                action: 'call_tool',
                server: 'ailis_research',
                tool: 'web_archive_lookup',
                args: cloneJson(args.archive[0])
            }, context);
        }
        return {
            content: [{ type: 'text', text: 'This web_run backend currently executes search_query, open, click, find, screenshot, and archive commands.' }],
            isError: true,
            structuredContent: {
                status: 'unsupported_command',
                supported_commands: ['search_query', 'open', 'click', 'find', 'screenshot', 'archive']
            }
        };
    }

    startDeferredPersonaTaskHandoff(args = {}, context = {}) {
        const sessionId = normalizeString(context.sessionId || context.sessionKey, 'main');
        const runId = normalizeString(context.runId || context.parentRunId, randomUUID());
        const message = normalizeString(context.currentUserMessage);
        const sharedSessionHistory = (
            Array.isArray(context.sharedSessionHistory) ? context.sharedSessionHistory :
            Array.isArray(context.turnEnvelope?.visibleHistory) ? context.turnEnvelope.visibleHistory :
            []
        ).slice(-240);
        const turnEnvelope = {
            ...(context.turnEnvelope && typeof context.turnEnvelope === 'object'
                ? cloneJson(context.turnEnvelope) || {}
                : {}),
            sessionId,
            userMessage: message,
            visibleHistory: cloneJson(sharedSessionHistory) || [],
            attachments: cloneJson(
                context.turnEnvelope?.attachments ||
                context.attachments ||
                context.fileAttachments ||
                []
            ) || []
        };
        const renderInput = {
            message,
            messageHistory: cloneJson(sharedSessionHistory) || [],
            ...(context.llmSettings && typeof context.llmSettings === 'object'
                ? { llmSettings: context.llmSettings }
                : {})
        };
        let lastProgressRenderAt = Date.now();
        let progressRenderInFlight = null;
        const onTaskEvent = (event = {}) => {
            const type = normalizeString(event.type);
            const progressText = normalizeString(event.message || event.payload?.text || event.payload?.summary);
            const now = Date.now();
            if (
                type !== 'agent.progress.note' ||
                !progressText ||
                progressRenderInFlight ||
                now - lastProgressRenderAt < PERSONA_TASK_PROGRESS_MIN_INTERVAL_MS
            ) {
                return;
            }
            lastProgressRenderAt = now;
            const packet = {
                type: 'task.progress',
                status: normalizeString(event.status, 'running'),
                summary: progressText
            };
            progressRenderInFlight = this.renderTaskPacket({
                input: renderInput,
                context,
                sessionId,
                outerRunId: runId,
                turnEnvelope,
                packet,
                purpose: 'progress'
            }).then((text) => {
                if (text) {
                    this.emitGatewayEvent('persona.background.message', {
                        runId,
                        sessionId,
                        status: packet.status,
                        text,
                        speechText: text,
                        kind: 'progress',
                        phase: 'task_progress',
                        source: 'persona_handoff_task_event'
                    });
                }
            }).catch(() => {}).finally(() => {
                progressRenderInFlight = null;
            });
        };

        this.emitGatewayEvent('task.background.started', {
            runId,
            sessionId,
            status: 'running',
            currentRequest: message,
            source: 'persona_handoff'
        });
        const harnessPromise = this.taskAgentHarness.handoff(args, {
            ...context,
            deferTaskHandoff: false,
            sessionId,
            sessionKey: sessionId,
            currentUserMessage: message,
            sharedSessionHistory,
            turnEnvelope,
            returnAfterSteer: true,
            onTaskEvent
        });
        const activeThread = this.taskAgentHarness.getThread(sessionId);
        const activeTurn = activeThread?.turns?.find((turn) => turn.turnId === activeThread.activeTurnId) || null;
        let backgroundStatus = 'completed';
        let trackedTaskPromise;
        trackedTaskPromise = Promise.resolve(harnessPromise).then(async (taskResult) => {
            const taskStatus = normalizeString(taskResult?.status, 'completed').toLowerCase();
            if (!['accepted', 'completed', 'completed_with_warnings', 'success', 'succeeded'].includes(taskStatus)) {
                backgroundStatus = taskStatus || 'failed';
            }
            if (taskResult?.steer_accepted === true) {
                return taskResult;
            }
            if (progressRenderInFlight) {
                await progressRenderInFlight;
            }
            if (taskResult?.route === 'chat') {
                return taskResult;
            }
            const displayText = await this.renderTaskPacket({
                input: renderInput,
                context,
                sessionId,
                outerRunId: runId,
                turnEnvelope,
                packet: taskResult,
                purpose: 'result'
            });
            this.taskAgentHarness.recordPersonaOutput(
                sessionId,
                taskResult?.turn_id,
                displayText,
                'result'
            );
            this.emitGatewayEvent('persona.background.message', {
                runId,
                sessionId,
                status: normalizeString(taskResult?.status, 'completed'),
                text: displayText,
                speechText: displayText,
                kind: 'result',
                phase: 'task_result',
                source: 'persona_handoff_task_result',
                taskResult
            });
            return taskResult;
        }).catch(async (error) => {
            backgroundStatus = 'failed';
            if (progressRenderInFlight) {
                await progressRenderInFlight;
            }
            const failurePacket = {
                type: 'task.failed',
                status: 'failed',
                error: error?.message || String(error),
                current_request: message
            };
            const displayText = await this.renderTaskPacket({
                input: renderInput,
                context,
                sessionId,
                outerRunId: runId,
                turnEnvelope,
                packet: failurePacket,
                purpose: 'failure'
            });
            this.emitGatewayEvent('persona.background.message', {
                runId,
                sessionId,
                status: 'failed',
                text: displayText,
                speechText: displayText,
                kind: 'result',
                phase: 'task_failure',
                source: 'persona_handoff_task_result'
            });
            return failurePacket;
        }).finally(() => {
            this.backgroundTaskRuns.delete(trackedTaskPromise);
            this.emitGatewayEvent('task.background.finished', {
                runId,
                sessionId,
                status: backgroundStatus,
                source: 'persona_handoff'
            });
        });
        this.backgroundTaskRuns.add(trackedTaskPromise);

        return {
            schema: 'ailis.task_result.v1',
            optimization: '长程任务优化',
            thread_id: normalizeString(activeThread?.threadId),
            turn_id: normalizeString(activeTurn?.turnId),
            task_id: normalizeString(activeTurn?.turnId),
            status: 'accepted',
            route: 'execute',
            current_request: message,
            final_answer: '',
            display_text: '',
            partial_answer: '',
            source_refs: [],
            output_refs: [],
            unresolved_fields: [],
            trace_ref: normalizeString(activeTurn?.runId),
            checkpoint_available: Boolean(activeThread?.contextCheckpoint)
        };
    }

    async executeGatewayLocalTool(toolId, args, context = {}) {
        const workspaceDir = context.workspaceDir || this.resolveWorkspace(context.workspace, context);
        if (toolId === TASK_ROUTE_TOOL_ID) {
            const mode = normalizeString(args.mode).toLowerCase();
            const allowed = context.taskAgentRoutePending === true && ['chat', 'execute'].includes(mode);
            const routeResult = allowed
                ? {
                      ok: true,
                      status: 'completed',
                      mode,
                      turn_id: normalizeString(context.taskAgentTurnId || context.task_agent_turn_id)
                  }
                : {
                      ok: false,
                      status: 'invalid_task_route',
                      error: 'task_route is available only for the first decision of a new TaskAgent Turn.'
                  };
            return {
                content: [{ type: 'text', text: JSON.stringify(routeResult) }],
                isError: routeResult.ok === false,
                details: routeResult,
                structuredContent: routeResult
            };
        }
        if (toolId === TASK_GOAL_TOOL_ID) {
            const goalResult = this.taskAgentHarness.applyGoalAction(args, context);
            return {
                content: [{ type: 'text', text: JSON.stringify(goalResult, null, 2) }],
                isError: goalResult.ok === false,
                details: goalResult,
                structuredContent: goalResult
            };
        }
        if (toolId === HANDOFF_TASK_TOOL_ID) {
            const handoffContext = {
                ...context,
                workspace: context.workspace || workspaceDir,
                workspaceDir
            };
            const taskResult = context.deferTaskHandoff === true
                ? this.startDeferredPersonaTaskHandoff(args, handoffContext)
                : await this.taskAgentHarness.handoff(args, handoffContext);
            return {
                content: [{ type: 'text', text: JSON.stringify(taskResult, null, 2) }],
                isError: false,
                details: taskResult,
                structuredContent: taskResult
            };
        }
        if (toolId === WEB_RUN_TOOL_ID) {
            return await this.executeWebRun(args, context);
        }
        if (toolId === WEB_SEARCH_TOOL_ID) {
            return await this.runtime.executeMcpBridge({
                action: 'call_tool',
                server: 'ailis_research',
                tool: 'web_search',
                args: {
                    query: args.query,
                    ...(args.maxResults !== undefined ? { maxResults: args.maxResults } : {}),
                    ...(args.search_context_size ? { search_context_size: args.search_context_size } : {})
                }
            }, context);
        }
        if (toolId === TASK_RESULTS_TOOL_ID) {
            const action = normalizeString(args.action, 'search').toLowerCase();
            const limit = Math.max(1, Math.min(Number(args.limit) || 3, 8));
            const sessionId = normalizeString(args.sessionId || context.sessionId || context.sessionKey);
            if (action === 'get') {
                const capsule = this.taskResultCapsules?.get?.(args.id) || null;
                const payload = {
                    status: capsule ? 'completed' : 'not_found',
                    result: capsule
                };
                return {
                    content: [{ type: 'text', text: JSON.stringify(payload, null, 2) }],
                    isError: !capsule,
                    details: payload,
                    structuredContent: payload
                };
            }
            const results = this.taskResultCapsules?.search?.(args.query, { sessionId, limit }) || [];
            const payload = {
                status: 'completed',
                query: normalizeString(args.query),
                results
            };
            return {
                content: [{ type: 'text', text: JSON.stringify(payload, null, 2) }],
                isError: false,
                details: payload,
                structuredContent: payload
            };
        }
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
                    return await this.executeLocalApplyPatch(interceptedPatch, workspaceDir, context);
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
        if (toolId === ARTIFACT_IMPORT_TOOL_ID) {
            return await executeArtifactImportTool(args, context, {
                workspaceDir,
                workspaceRoot: this.workspaceRoot,
                projectRoot: this.projectRoot,
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

    async executeLocalApplyPatch(input, workspaceDir, context = {}) {
        this.assertPatchInsideWorkspace(input, workspaceDir, context);
        const operations = this.parseLocalPatch(input);
        const changedFiles = [];
        for (const operation of operations) {
            const target = this.resolveToolPath(operation.path, workspaceDir, 'patchPath', context);
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
            const target = this.resolveToolPath(args.path, workspaceDir, 'path', context);
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
            const target = this.resolveToolPath(args.path, workspaceDir, 'path', context);
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
            return await this.executeLocalApplyPatch(args.input || args.patch, workspaceDir, context);
        }

        if (toolId === 'exec') {
            const interceptedPatch = this.extractPatchFromCommand(args.command || args.cmd);
            if (interceptedPatch) {
                return await this.executeLocalApplyPatch(interceptedPatch, workspaceDir, context);
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
        if (
            /(?:^|__)pdf_extract_text$/i.test(toolId) &&
            !normalizeString(
                finalArgs.query ||
                finalArgs.q ||
                finalArgs.extractQuery ||
                finalArgs.extract_query
            )
        ) {
            const sourceQuestion = normalizeString(
                context.currentUserMessage ||
                context.currentTaskRequest ||
                context.current_task_request
            );
            if (sourceQuestion) {
                finalArgs.query = sourceQuestion;
            }
        }
        if (FILE_TOOL_IDS.has(toolId)) {
            this.assertToolPathInsideWorkspace(finalArgs.path, workspaceDir, 'path', context);
        }
        if (toolId === 'apply_patch') {
            this.assertPatchInsideWorkspace(finalArgs.input, workspaceDir, context);
        }
        if (toolId === 'exec') {
            if (context.approved !== true && finalArgs.approved !== true) {
                throwApprovalRequired('exec requires context.approved=true in AILIS Gateway v0', {
                    tool: toolId,
                    approval: 'required'
                });
            }
            const commandArgs = Array.isArray(finalArgs.args)
                ? finalArgs.args
                : Array.isArray(finalArgs.arguments)
                ? finalArgs.arguments
                : [];
            const wrapperExecutable = normalizeString(commandArgs[0]).toLowerCase();
            const wrapsExistingCommand = this.platformAdapter?.isWindows?.() === true
                && /^(?:powershell|powershell\.exe|pwsh|pwsh\.exe)$/.test(wrapperExecutable)
                && commandArgs.some((entry) => /^-(?:command|c)$/i.test(normalizeString(entry)))
                && normalizeString(finalArgs.command || finalArgs.cmd);
            if (wrapsExistingCommand) {
                finalArgs.args = [];
                delete finalArgs.arguments;
            }
            if (finalArgs.timeoutMs === undefined && finalArgs.timeout !== undefined) {
                const timeout = Number(finalArgs.timeout);
                if (Number.isFinite(timeout) && timeout > 0) {
                    finalArgs.timeoutMs = timeout < 1000 ? timeout * 1000 : timeout;
                }
            }
            finalArgs.workdir = this.resolveToolPath(finalArgs.workdir || workspaceDir, workspaceDir, 'workdir', context);
            finalArgs.host = finalArgs.host || 'gateway';
            finalArgs.security = finalArgs.security || 'full';
            finalArgs.ask = finalArgs.ask || 'off';
        }
        if (toolId === 'message' && context.approved !== true) {
            finalArgs.dryRun = true;
        }
        return finalArgs;
    }

    getProtectedPathRoot(targetPath) {
        const target = path.resolve(targetPath);
        return this.platformAdapter.protectedRoots().find((root) => this.platformAdapter.isPathInside(root, target)) || '';
    }

    assertFullControlPathAllowed(targetPath, context = {}, fieldName = 'path') {
        if (!isFullControlContext(context)) {
            return;
        }
        const protectedRoot = this.getProtectedPathRoot(targetPath);
        if (protectedRoot) {
            throwBlocked(`${fieldName} targets protected C drive system files`, {
                fieldName,
                target: path.resolve(targetPath),
                protectedRoot,
                permissionProfile: context.permissionProfile || context.policy || context.sandbox || 'full-control'
            });
        }
    }

    resolveWorkspace(rawWorkspace, context = {}) {
        const workspace = normalizeString(rawWorkspace)
            ? path.resolve(rawWorkspace)
            : this.workspaceRoot;
        if (isFullControlContext(context)) {
            this.assertFullControlPathAllowed(workspace, context, 'workspace');
            return workspace;
        }
        if (!isPathInside(this.workspaceRoot, workspace)) {
            throwBlocked('workspace must stay inside the configured AILIS workspace root', {
                workspace,
                workspaceRoot: this.workspaceRoot
            });
        }
        return workspace;
    }

    resolveToolPath(rawPath, workspaceDir, fieldName, context = {}) {
        const value = normalizeString(rawPath);
        if (!value) {
            throwBlocked(`${fieldName} is required`);
        }
        const target = path.isAbsolute(value) ? path.resolve(value) : path.resolve(workspaceDir, value);
        if (isFullControlContext(context)) {
            this.assertFullControlPathAllowed(target, context, fieldName);
            return target;
        }
        if (!isPathInside(workspaceDir, target)) {
            throwBlocked(`${fieldName} must stay inside workspace`, {
                fieldName,
                target,
                workspaceDir
            });
        }
        return target;
    }

    assertToolPathInsideWorkspace(rawPath, workspaceDir, fieldName, context = {}) {
        this.resolveToolPath(rawPath, workspaceDir, fieldName, context);
    }

    assertPatchInsideWorkspace(rawPatch, workspaceDir, context = {}) {
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
            this.resolveToolPath(patchPath, workspaceDir, 'patchPath', context);
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
        const workspaceDir = this.resolveWorkspace(context.workspace, context);
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
            this.toolRuntimeSupervisor = new AILISAgentRuntimeSupervisor({
                app: this.app,
                gatewayUrl: this.toolGatewayUrl
            });
        }
        return await this.toolRuntimeSupervisor.ensureReady();
    }

    async withDefaultAgentRuntimeGatewayEnv(action) {
        const priorAgentRuntimeGatewayUrl = process.env.OPENCLAW_GATEWAY_URL;
        const priorAilisAgentRuntimeGatewayUrl = process.env.AILIS_OPENCLAW_GATEWAY_URL;
        try {
            delete process.env.OPENCLAW_GATEWAY_URL;
            delete process.env.AILIS_OPENCLAW_GATEWAY_URL;
            return await action();
        } finally {
            if (priorAgentRuntimeGatewayUrl === undefined) {
                delete process.env.OPENCLAW_GATEWAY_URL;
            } else {
                process.env.OPENCLAW_GATEWAY_URL = priorAgentRuntimeGatewayUrl;
            }
            if (priorAilisAgentRuntimeGatewayUrl === undefined) {
                delete process.env.AILIS_OPENCLAW_GATEWAY_URL;
            } else {
                process.env.AILIS_OPENCLAW_GATEWAY_URL = priorAilisAgentRuntimeGatewayUrl;
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
                    tool: payload.toolName || payload.tool || '',
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
                        tool: payload.toolName || payload.tool || '',
                        status: payload.status || item.status || '',
                        ok: payload.ok === true,
                        durationMs: Number(payload.durationMs) || 0,
                        args: null,
                        resultPreview: payload.outputPreview || summarizeForAnalysis(payload.result || payload.error || '', 900),
                        outputStore: this.extractOutputStoreFromToolPayload(payload)
                    };
                    ensureRound(iteration).tools.push(tool);
                } else {
                    tool.status = payload.status || item.status || tool.status;
                    tool.ok = payload.ok === true;
                    tool.durationMs = Number(payload.durationMs) || tool.durationMs;
                    tool.resultPreview = payload.outputPreview || summarizeForAnalysis(payload.result || payload.error || '', 900);
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
                tool: payload.toolName || payload.tool || '',
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
                existing.tool = payload.toolName || payload.tool || existing.tool;
                existing.args = payload.args || existing.args;
                existing.iteration = getPayloadIteration(payload);
            } else {
                existing.completedAt = analysisTimestamp(item);
                existing.tool = payload.toolName || payload.tool || existing.tool;
                existing.status = payload.status || item.status || existing.status;
                existing.ok = payload.ok === true;
                existing.durationMs = Number(payload.durationMs) || existing.durationMs;
                existing.resultPreview = payload.outputPreview || summarizeForAnalysis(payload.result || payload.error || '', 900);
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
    AILISGateway,
    attachSuggestedMcpToolsForDirectExposure,
    collectSuggestedMcpToolNames
};
