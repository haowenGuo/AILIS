const fsp = require('fs/promises');
const path = require('path');
const { randomUUID } = require('crypto');
const { AILISMcpManager } = require('./ailis-mcp-session.cjs');
const { AILISToolDoctor } = require('./ailis-tool-doctor.cjs');
const { AILISCapabilityManager } = require('./ailis-capability-manager.cjs');
const { AILISSelfDebugger } = require('./ailis-self-debugger.cjs');
const { createAILISPlatformAdapter } = require('./ailis-platform-adapter.cjs');
const { AILISOutputStore } = require('./ailis-output-store.cjs');
const { AILISContextArtifactStore } = require('./ailis-context-artifact-store.cjs');
const { getToolContractPromptText } = require('./ailis-tool-contracts.cjs');
const {
    CORE_RUNTIME_TOOL_DEFINITIONS: RUNTIME_TOOL_DEFINITIONS,
    CORE_RUNTIME_TOOL_IDS: RUNTIME_TOOL_IDS,
    createAILISToolRuntimeRegistry,
    parseDirectMcpToolId
} = require('./ailis-tool-runtime.cjs');
const {
    compactJsonForModel,
    compactToolResultForModel
} = require('./ailis-runtime-budget.cjs');

const DEFAULT_MAX_RESULT_TEXT_CHARS = 6000;
const DEFAULT_MAX_TRANSCRIPT_ITEMS = 500;
const DEFAULT_SUBAGENT_WAIT_TIMEOUT_MS = 30000;
const DEFAULT_SUBAGENT_RUN_TIMEOUT_MS = 15 * 60 * 1000;

const FILE_MUTATING_TOOLS = new Set(['write', 'edit', 'apply_patch']);
const FILE_READONLY_TOOLS = new Set(['read', 'web_fetch']);
const EXEC_TOOLS = new Set(['exec']);
const COMPUTER_READONLY_ACTIONS = new Set([
    'schema',
    'ls',
    'list',
    'tree',
    'stat',
    'read',
    'read_binary',
    'search',
    'find',
    'hash',
    'du',
    'acl_get',
    'watch_start',
    'watch_poll',
    'watch_list',
    'pty_status',
    'pty_read',
    'pty_resize',
    'rollback_list',
    'process_list',
    'process_read',
    'write_stdin'
]);
const COMPUTER_EXEC_ACTIONS = new Set([
    'exec',
    'run',
    'exec_command',
    'session_start',
    'pty_start',
    'pty_write',
    'pty_kill',
    'process_write',
    'write_stdin',
    'process_kill'
]);
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
    'acl_set',
    'rollback_restore',
    'watch_stop'
]);
const EMAIL_EXTERNAL_ACTIONS = new Set(['send', 'mark_read', 'mark_unread', 'move', 'delete']);
const FILE_MANAGER_MUTATING_ACTIONS = new Set(['clean', 'organize']);
const CODE_MUTATING_ACTIONS = new Set([
    'apply_patch',
    'edit',
    'write',
    'rename_symbol',
    'git_commit',
    'git_checkout',
    'git_branch',
    'pr_create'
]);
const CODE_EXEC_ACTIONS = new Set(['test', 'diagnostics', 'exec']);
const VISION_TOOL_IDS = new Set(['vision.capture_context']);

function normalizeString(value, fallback = '') {
    if (typeof value !== 'string') {
        return fallback;
    }
    const trimmed = value.trim();
    return trimmed || fallback;
}

function normalizeAction(value, fallback = '') {
    return normalizeString(value, fallback).toLowerCase().replace(/[-\s]+/g, '_');
}

function createBuiltinAilisResearchMcpServers(options = {}) {
    if (
        options.disableBuiltinAilisResearchMcp === true ||
        options.builtinMcpServers === false ||
        /^(1|true|yes)$/i.test(normalizeString(process.env.AILIS_DISABLE_BUILTIN_RESEARCH_MCP))
    ) {
        return {};
    }
    const projectRoot = path.resolve(options.projectRoot || path.resolve(__dirname, '..'));
    const serverPath = path.join(projectRoot, 'scripts', 'mcp-ailis-research-server.cjs');
    const command = normalizeString(
        process.env.AILIS_MCP_NODE_PATH ||
            process.env.AILIS_MCP_NODE_PATH ||
            process.env.AILIS_OPENCLAW_NODE_PATH ||
            process.env.OPENCLAW_NODE_PATH,
        process.execPath
    );
    return {
        ailis_research: {
            transport: 'stdio',
            command,
            args: [serverPath],
            cwd: projectRoot,
            env: {
                ELECTRON_RUN_AS_NODE: '1',
                AILIS_RESEARCH_MCP_BUILTIN: '1'
            }
        }
    };
}

function safeSegment(value, fallback = 'unknown') {
    const text = normalizeString(value, fallback).replace(/[^A-Za-z0-9_.-]+/g, '_');
    return text.slice(0, 120) || fallback;
}

function summarize(value, maxChars = 800) {
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

function cloneJson(value) {
    try {
        return JSON.parse(JSON.stringify(value));
    } catch {
        return { value: String(value) };
    }
}

function isAbortError(error) {
    return error?.name === 'AbortError' || /aborted|cancelled|canceled/i.test(error?.message || '');
}

function raceWithAbort(promise, signal) {
    if (!signal) {
        return promise;
    }
    if (signal.aborted) {
        const error = new Error('subagent run aborted');
        error.name = 'AbortError';
        return Promise.reject(error);
    }
    return new Promise((resolve, reject) => {
        const onAbort = () => {
            const error = new Error('subagent run aborted');
            error.name = 'AbortError';
            reject(error);
        };
        signal.addEventListener('abort', onAbort, { once: true });
        promise.then(
            (value) => {
                signal.removeEventListener('abort', onAbort);
                resolve(value);
            },
            (error) => {
                signal.removeEventListener('abort', onAbort);
                reject(error);
            }
        );
    });
}

function withTimeoutPromise(promise, timeoutMs, timeoutMessage) {
    const bounded = Math.max(1000, Math.min(Number(timeoutMs) || DEFAULT_SUBAGENT_WAIT_TIMEOUT_MS, 24 * 60 * 60 * 1000));
    let timer = null;
    return Promise.race([
        promise,
        new Promise((_, reject) => {
            timer = setTimeout(() => reject(new Error(timeoutMessage || `operation timed out after ${bounded}ms`)), bounded);
        })
    ]).finally(() => {
        if (timer) {
            clearTimeout(timer);
        }
    });
}

function normalizeMcpContent(result) {
    const content = Array.isArray(result?.content) ? result.content : [];
    if (content.length) {
        return content;
    }
    return [
        {
            type: 'text',
            text: JSON.stringify(result || {}, null, 2)
        }
    ];
}

function isPlainObject(value) {
    return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

const MCP_BRIDGE_ARG_KEYS = new Set([
    'action',
    'operation',
    'intent',
    'server',
    'serverId',
    'tool',
    'name',
    'toolName',
    'tool_name',
    'args',
    'arguments',
    'tool_args',
    'toolArgs',
    'parameters',
    'params',
    'serverConfig',
    'config',
    'servers',
    'persist',
    'timeoutMs',
    'runId',
    'sessionId',
    '_meta',
    'meta',
    'uri',
    'resourceUri',
    'resource',
    'prompt',
    'promptName'
]);

function normalizeMcpToolArgs(args = {}) {
    const explicitArgs =
        args.args ||
        args.arguments ||
        args.tool_args ||
        args.toolArgs ||
        args.parameters ||
        args.params;
    const normalized = isPlainObject(explicitArgs) ? { ...explicitArgs } : {};
    for (const [key, value] of Object.entries(args || {})) {
        if (!MCP_BRIDGE_ARG_KEYS.has(key) && normalized[key] === undefined) {
            normalized[key] = value;
        }
    }
    return normalized;
}

function parseJsonLine(line) {
    try {
        return JSON.parse(line);
    } catch {
        return { type: 'transcript.unparseable', raw: line };
    }
}

function normalizePlanItems(value) {
    const items = Array.isArray(value) ? value : value ? [value] : [];
    return items
        .map((item, index) => {
            if (typeof item === 'string') {
                return {
                    id: `plan-${index + 1}`,
                    step: item,
                    status: 'pending'
                };
            }
            if (!item || typeof item !== 'object') {
                return null;
            }
            return {
                id: normalizeString(item.id, `plan-${index + 1}`),
                step: normalizeString(item.step || item.title || item.text || item.summary, `step ${index + 1}`),
                status: normalizeString(item.status, 'pending')
            };
        })
        .filter(Boolean)
        .slice(0, 40);
}

function isReadOnlyProfile(profile) {
    const readOnlyIds = ['read-only', 'readonly', 'observe', 'viewer'];
    return readOnlyIds.includes(profile.id) || readOnlyIds.includes(profile.fileSystem);
}

function normalizePermissionProfile(context = {}) {
    const raw = context.permissionProfile || context.permissions || context.policy || context.sandbox || {};
    if (typeof raw === 'string') {
        const id = normalizeString(raw, 'workspace-write');
        if (isReadOnlyProfile({ id })) {
            return {
                id,
                fileSystem: 'read-only',
                shell: 'none',
                network: 'restricted',
                approvalPolicy: normalizeString(context.approvalPolicy || context.confirmationPolicy, 'on-request')
            };
        }
        if (id === 'danger-full-access' || id === 'full-access') {
            return {
                id,
                fileSystem: 'full',
                shell: 'full',
                network: 'full',
                approvalPolicy: normalizeString(context.approvalPolicy || context.confirmationPolicy, 'on-request')
            };
        }
        return {
            id,
            fileSystem: 'workspace-write',
            shell: 'approval-required',
            network: 'restricted',
            approvalPolicy: normalizeString(context.approvalPolicy || context.confirmationPolicy, 'on-request')
        };
    }

    return {
        id: normalizeString(raw.id || raw.name, 'workspace-write'),
        fileSystem: normalizeString(raw.fileSystem || raw.fs, 'workspace-write'),
        shell: normalizeString(raw.shell || raw.commandLine, 'approval-required'),
        network: normalizeString(raw.network, 'restricted'),
        approvalPolicy: normalizeString(
            raw.approvalPolicy || raw.approval || context.approvalPolicy || context.confirmationPolicy,
            'on-request'
        )
    };
}

function needsApprovalByPolicy(evaluation, context = {}) {
    if (context.approved === true) {
        return false;
    }
    const policy = evaluation.policy?.approvalPolicy || 'on-request';
    if (policy === 'auto' || policy === 'never') {
        return false;
    }
    if (policy === 'always') {
        return evaluation.requiresApprovalCapable === true || evaluation.mutates === true;
    }
    if (context.requireApprovalForMutations === true && evaluation.mutates === true) {
        return true;
    }
    return evaluation.requiresApprovalCapable === true;
}

function normalizePermissionPaths(paths = [], workspaceRoot = process.cwd()) {
    const values = Array.isArray(paths) ? paths : paths ? [paths] : [];
    return values
        .map((entry) => normalizeString(entry))
        .filter(Boolean)
        .map((entry) => entry === '*' ? '*' : path.resolve(path.isAbsolute(entry) ? entry : path.join(workspaceRoot, entry)));
}

function normalizePermissionRequest(permissions = {}, workspaceRoot = process.cwd()) {
    const fileSystem = permissions.file_system || permissions.fileSystem || permissions.filesystem || {};
    const request = {
        network: {
            enabled: permissions.network?.enabled === true
        },
        file_system: {
            read: normalizePermissionPaths(fileSystem.read, workspaceRoot),
            write: normalizePermissionPaths(fileSystem.write, workspaceRoot)
        }
    };
    return request;
}

function isEmptyPermissionRequest(permissions = {}) {
    return permissions.network?.enabled !== true
        && !(permissions.file_system?.read || []).length
        && !(permissions.file_system?.write || []).length;
}

function isInsideAnyPath(targetPath, roots = []) {
    const target = path.resolve(targetPath);
    return roots.some((root) => {
        if (root === '*') {
            return true;
        }
        const resolved = path.resolve(root);
        return target === resolved || target.startsWith(`${resolved}${path.sep}`);
    });
}

function extractPatchPaths(input = '') {
    const patch = normalizeString(input);
    const paths = [];
    const pattern = /^\*\*\* (?:Add File|Update File|Delete File):\s+(.+)$/gm;
    let match = pattern.exec(patch);
    while (match) {
        const patchPath = normalizeString(match[1]);
        if (patchPath) {
            paths.push(patchPath);
        }
        match = pattern.exec(patch);
    }
    return paths;
}

function collectToolWritePaths({ toolId, args = {}, workspaceRoot = process.cwd() } = {}) {
    const raw = [];
    const push = (...values) => {
        for (const value of values) {
            const text = normalizeString(value);
            if (text) {
                raw.push(text);
            }
        }
    };
    if (['write', 'edit'].includes(toolId)) {
        push(args.path);
    } else if (toolId === 'apply_patch') {
        for (const patchPath of extractPatchPaths(args.input || args.patch)) {
            push(patchPath);
        }
    } else if (toolId === 'computer') {
        const action = normalizeAction(args.action || args.operation || args.intent);
        if (['write', 'write_binary', 'append', 'mkdir', 'delete', 'trash', 'acl_set', 'rollback_restore'].includes(action)) {
            push(args.path, args.target);
        }
        if (['copy', 'move', 'rename'].includes(action)) {
            push(args.target, args.destination);
        }
    } else if (toolId === 'code') {
        push(args.path);
    }
    return normalizePermissionPaths(raw, workspaceRoot);
}

class AILISRuntime {
    constructor(options = {}) {
        this.workspaceRoot = path.resolve(options.workspaceRoot || process.cwd());
        this.projectRoot = path.resolve(options.projectRoot || this.workspaceRoot);
        this.auditDir = path.resolve(options.auditDir || path.join(this.projectRoot, 'tmp', 'ailis-gateway'));
        this.transcriptDir = path.join(this.auditDir, 'transcripts');
        this.outputStore = options.outputStore || new AILISOutputStore({
            rootDir: options.outputStoreDir || path.join(this.auditDir, 'output-store')
        });
        this.emitGatewayEvent = typeof options.emitGatewayEvent === 'function' ? options.emitGatewayEvent : () => {};
        this.contextArtifactStore = options.contextArtifactStore || new AILISContextArtifactStore({
            rootDir: options.contextArtifactStoreDir || path.join(this.auditDir, 'context-artifacts'),
            emitGatewayEvent: (type, payload) => this.emitGatewayEvent(type, payload)
        });
        this.subagentExecutor = typeof options.subagentExecutor === 'function' ? options.subagentExecutor : null;
        this.platformAdapter = createAILISPlatformAdapter(options.platformAdapter || options.platform || {});
        this.runs = new Map();
        this.planState = new Map();
        this.permissionGrants = new Map();
        this.subagents = new Map();
        this.subagentRuns = new Map();
        this.subagentControllers = new Map();
        this.mcpManager = new AILISMcpManager({
            workspaceRoot: this.workspaceRoot,
            projectRoot: this.projectRoot,
            emitGatewayEvent: (type, payload) => this.emitGatewayEvent(type, payload),
            builtinServers: createBuiltinAilisResearchMcpServers({
                projectRoot: this.projectRoot,
                disableBuiltinAilisResearchMcp: options.disableBuiltinAilisResearchMcp,
                builtinMcpServers: options.builtinMcpServers
            }),
            defaultServers: options.mcpServers,
            configPath: options.mcpConfigPath
        });
        this.toolDoctor = new AILISToolDoctor({
            workspaceRoot: this.workspaceRoot,
            projectRoot: this.projectRoot,
            auditDir: this.auditDir,
            mcpManager: this.mcpManager,
            emitGatewayEvent: (type, payload) => this.emitGatewayEvent(type, payload)
        });
        this.capabilityManager = new AILISCapabilityManager({
            workspaceRoot: this.workspaceRoot,
            projectRoot: this.projectRoot,
            auditDir: this.auditDir,
            mcpManager: this.mcpManager,
            toolDoctor: this.toolDoctor,
            emitGatewayEvent: (type, payload) => this.emitGatewayEvent(type, payload)
        });
        this.selfDebugger = new AILISSelfDebugger({
            workspaceRoot: this.workspaceRoot,
            projectRoot: this.projectRoot,
            auditDir: this.auditDir,
            toolDoctor: this.toolDoctor,
            capabilityManager: this.capabilityManager,
            emitGatewayEvent: (type, payload) => this.emitGatewayEvent(type, payload)
        });
        this.selfEvolutionRuntime = options.selfEvolutionRuntime || null;
        this.toolRuntimeRegistry = createAILISToolRuntimeRegistry(this);
    }

    async readExecOutput(args = {}) {
        const result = await this.outputStore.read(args);
        return this.formatOutputStoreResult('output_read', result);
    }

    async tailExecOutput(args = {}) {
        const result = await this.outputStore.tail(args);
        return this.formatOutputStoreResult('output_tail', result);
    }

    async searchExecOutput(args = {}) {
        const result = await this.outputStore.search(args);
        return this.formatOutputStoreResult('output_search', result);
    }

    async queryContextArtifact(args = {}) {
        return await this.contextArtifactStore.execute(args);
    }

    async computeContextArtifact(args = {}) {
        return await this.contextArtifactStore.compute(args);
    }

    formatOutputStoreResult(action, result = {}) {
        const ok = result.ok !== false;
        const text = action === 'output_search'
            ? JSON.stringify({
                  status: result.status,
                  outputId: result.outputId,
                  matchCount: result.matchCount || 0,
                  matches: result.matches || []
              }, null, 2)
            : result.text || result.error || '';
        return {
            content: [{ type: 'text', text }],
            isError: !ok,
            details: {
                action,
                ...result
            },
            structuredContent: {
                action,
                ...result
            }
        };
    }

    setSelfEvolutionRuntime(runtime) {
        this.selfEvolutionRuntime = runtime || null;
        return this.selfEvolutionRuntime;
    }

    formatSelfEvolutionProposal(proposal = {}, index = 0) {
        const title = normalizeString(proposal.title, proposal.id || '未命名提案');
        const type = normalizeString(proposal.type, 'unknown');
        const status = normalizeString(proposal.status, 'unknown');
        const risk = normalizeString(proposal.riskLabel || proposal.risk, 'unknown');
        const summary = normalizeString(proposal.summary, '暂无摘要。');
        const targetKind = normalizeString(proposal.target?.kind);
        const targetName = normalizeString(
            proposal.target?.tool ||
            proposal.target?.toolId ||
            proposal.target?.key ||
            proposal.target?.capability ||
            proposal.target?.name
        );
        const evidenceCount = Array.isArray(proposal.evidence) ? proposal.evidence.length : 0;
        const recommendedAction = normalizeString(proposal.recommendedAction);
        return [
            `${index + 1}. ${title}`,
            `类型：${type}；状态：${status}；风险：${risk}`,
            targetKind || targetName ? `目标：${[targetKind, targetName].filter(Boolean).join(' / ')}` : '',
            `原因：${summary}`,
            evidenceCount ? `证据：已汇总 ${evidenceCount} 条证据，完整明细保留在审计 details 中。` : '',
            recommendedAction ? `建议动作：${recommendedAction}` : ''
        ].filter(Boolean).join('\n');
    }

    formatSelfEvolutionResult(action = 'analyze', result = {}) {
        const status = normalizeString(result.status, result.ok === false ? 'failed' : 'completed');
        const proposals = Array.isArray(result.proposals)
            ? result.proposals
            : result.proposal
                ? [result.proposal]
                : [];
        if (action === 'schema') {
            return [
                '自我进化工具已可用。',
                '用 analyze 生成偏好、工具瓶颈和能力补齐提案；用 list_proposals/get_proposal 查看；用户确认后再用 mark_proposal/apply_proposal。'
            ].join('\n');
        }
        if (status === 'not_found') {
            return `没有找到自我进化提案：${normalizeString(result.id || result.proposalId, 'unknown')}`;
        }
        if (status === 'needs_approval') {
            const proposal = result.proposal || {};
            return [
                '这个自我进化提案需要用户确认后才能应用。',
                proposal.id ? `提案 ID：${proposal.id}` : '',
                proposal.title ? `提案：${proposal.title}` : '',
                result.approvalText ? `确认文案：${result.approvalText}` : '请向用户解释风险和变更内容，获得明确确认后再继续。'
            ].filter(Boolean).join('\n');
        }
        if (!proposals.length) {
            const headline = normalizeString(result.summary?.headline);
            return headline || `自我进化动作 ${action} 已完成，当前没有需要展示的提案。`;
        }
        const headline = normalizeString(result.summary?.headline, `自我进化动作 ${action} 已完成，返回 ${proposals.length} 个提案。`);
        return [
            headline,
            '',
            ...proposals.map((proposal, index) => this.formatSelfEvolutionProposal(proposal, index))
        ].join('\n\n');
    }

    getStatus() {
        return {
            enabled: true,
            version: 'v1',
            transcriptDir: this.transcriptDir,
            activeTranscriptRuns: this.runs.size,
            planStateCount: this.planState.size,
            subagentCount: this.subagents.size,
            platform: this.platformAdapter.getStatus(),
            mcpServerCount: this.mcpManager.getStatus().serverCount,
            mcp: this.mcpManager.getStatus(),
            toolDoctor: this.toolDoctor.getStatus(),
            capabilityManager: this.capabilityManager.getStatus(),
            selfDebugger: this.selfDebugger.getStatus(),
            selfEvolution: this.selfEvolutionRuntime?.getStatus?.() || null,
            runtimeTools: this.toolRuntimeRegistry.listDefinitions().map((tool) => tool.id),
            contextArtifacts: {
                rootDir: this.contextArtifactStore.rootDir,
                indexPath: this.contextArtifactStore.indexPath
            },
            toolRuntime: {
                model: 'codex_like_tool_runtime_registry',
                directToolCount: this.toolRuntimeRegistry.modelVisibleSpecs().length,
                registeredToolCount: this.toolRuntimeRegistry.listDefinitions().length
            },
            permissionDefaults: {
                fileSystem: 'workspace-write',
                shell: 'approval-required',
                approvalPolicy: 'on-request'
            },
            permissionGrantCount: this.permissionGrants.size,
            capabilities: [
                'formal_item_transcript',
                'update_plan_tool',
                'permission_policy_evaluation',
                'request_permissions_tool',
                'permission_grant_store',
                'tool_result_guard',
                'tool_result_repair',
                'subagent_child_runner',
                'mcp_stdio_session_manager',
                'mcp_http_session_manager',
                'mcp_config_store',
                'mcp_health_check',
                'mcp_prompt_calls',
                'mcp_input_schema_validation',
                'mcp_tool_and_resource_calls',
                'tool_doctor_health_checks',
                'tool_scorecard',
                'mcp_discovery',
                'self_repair_gate',
                'capability_registry',
                'capability_installer',
                'skill_auto_authoring',
                'repair_executor',
                'self_debug_loop',
                'self_debug_evidence_collection',
                'self_debug_repair_protocol',
                'self_evolution_loop',
                'self_evolution_preference_learning',
                'self_evolution_tool_bottleneck_analysis'
            ]
        };
    }

    async shutdown() {
        for (const controller of this.subagentControllers.values()) {
            try {
                controller.abort();
            } catch {}
        }
        this.subagentControllers.clear();
        await this.mcpManager.shutdown().catch(() => {});
    }

    getRuntimeToolDefinitions() {
        return this.toolRuntimeRegistry.listDefinitions();
    }

    canExecuteTool(toolId) {
        return this.toolRuntimeRegistry.has(toolId);
    }

    resolveRunPath(runId, sessionId = 'main') {
        return path.join(this.transcriptDir, safeSegment(sessionId, 'main'), `${safeSegment(runId, 'run')}.jsonl`);
    }

    async startRun({ runId, sessionId = 'main', message = '', planner = 'unknown', mode = 'task', intent = '' } = {}) {
        const id = normalizeString(runId, randomUUID());
        const sid = normalizeString(sessionId, 'main');
        const transcriptPath = this.resolveRunPath(id, sid);
        const run = {
            runId: id,
            sessionId: sid,
            transcriptPath,
            startedAt: Date.now(),
            seq: 0
        };
        this.runs.set(id, run);
        await fsp.mkdir(path.dirname(transcriptPath), { recursive: true });
        await this.appendItem(id, {
            type: 'thread.started',
            sessionId: sid,
            payload: {
                planner,
                mode,
                intent
            }
        });
        await this.appendItem(id, {
            type: 'turn.started',
            sessionId: sid,
            role: 'user',
            payload: {
                message,
                planner,
                mode,
                intent
            }
        });
        return run;
    }

    async appendItem(runId, item = {}) {
        const id = normalizeString(runId);
        if (!id) {
            return null;
        }
        let run = this.runs.get(id);
        if (!run) {
            const sessionId = normalizeString(item.sessionId || item.payload?.sessionId, 'main');
            run = {
                runId: id,
                sessionId,
                transcriptPath: this.resolveRunPath(id, sessionId),
                startedAt: Date.now(),
                seq: 0
            };
            this.runs.set(id, run);
        }
        run.seq += 1;
        const transcriptItem = {
            id: normalizeString(item.id, randomUUID()),
            seq: run.seq,
            ts: Date.now(),
            iso: new Date().toISOString(),
            runId: id,
            sessionId: normalizeString(item.sessionId, run.sessionId),
            type: normalizeString(item.type, 'runtime.item'),
            ...(item.role ? { role: item.role } : {}),
            ...(item.status ? { status: item.status } : {}),
            payload: redactObject(item.payload || {})
        };
        await fsp.mkdir(path.dirname(run.transcriptPath), { recursive: true });
        await fsp.appendFile(run.transcriptPath, `${JSON.stringify(transcriptItem)}\n`, 'utf8');
        this.emitGatewayEvent('runtime.item', {
            runId: id,
            sessionId: transcriptItem.sessionId,
            type: transcriptItem.type,
            seq: transcriptItem.seq,
            itemId: transcriptItem.id
        });
        return transcriptItem;
    }

    async completeRun(runId, result = {}) {
        const id = normalizeString(runId);
        if (!id) {
            return null;
        }
        const run = this.runs.get(id);
        await this.appendItem(id, {
            type: result.status === 'needs_approval'
                ? 'approval.requested'
                : result.ok === false
                    ? 'agent.blocked'
                    : 'agent.final',
            status: normalizeString(result.status, result.ok === false ? 'blocked' : 'completed'),
            payload: {
                ok: result.ok,
                status: result.status,
                mode: result.mode,
                intent: result.intent,
                planner: result.planner,
                displayText: result.displayText,
                durationMs: result.durationMs
            }
        });
        await this.appendItem(id, {
            type: 'turn.completed',
            status: normalizeString(result.status, 'completed'),
            payload: {
                ok: result.ok,
                status: result.status,
                durationMs: result.durationMs
            }
        });
        const repair = await this.repairTranscript(id);
        this.runs.delete(id);
        return {
            runId: id,
            transcriptPath: run?.transcriptPath || this.resolveRunPath(id),
            repair
        };
    }

    async readTranscript(runId, limit = DEFAULT_MAX_TRANSCRIPT_ITEMS) {
        const id = normalizeString(runId);
        if (!id) {
            return {
                ok: false,
                status: 'missing_run_id',
                items: []
            };
        }
        const run = this.runs.get(id);
        const candidatePaths = run
            ? [run.transcriptPath]
            : await this.findTranscriptPaths(id);
        const transcriptPath = candidatePaths[0];
        if (!transcriptPath) {
            return {
                ok: false,
                status: 'not_found',
                runId: id,
                items: []
            };
        }
        try {
            const boundedLimit = Math.min(Math.max(Number(limit) || DEFAULT_MAX_TRANSCRIPT_ITEMS, 1), 2000);
            const text = await fsp.readFile(transcriptPath, 'utf8');
            const items = text
                .split(/\r?\n/)
                .filter(Boolean)
                .map(parseJsonLine)
                .slice(-boundedLimit);
            return {
                ok: true,
                status: 'completed',
                runId: id,
                transcriptPath,
                items
            };
        } catch (error) {
            return {
                ok: false,
                status: 'error',
                runId: id,
                transcriptPath,
                error: error?.message || String(error),
                items: []
            };
        }
    }

    async findTranscriptPaths(runId) {
        const id = `${safeSegment(runId, 'run')}.jsonl`;
        const matches = [];
        async function walk(dir) {
            let entries = [];
            try {
                entries = await fsp.readdir(dir, { withFileTypes: true });
            } catch {
                return;
            }
            for (const entry of entries) {
                const target = path.join(dir, entry.name);
                if (entry.isDirectory()) {
                    await walk(target);
                } else if (entry.isFile() && entry.name === id) {
                    matches.push(target);
                }
            }
        }
        await walk(this.transcriptDir);
        return matches;
    }

    async repairTranscript(runId) {
        const transcript = await this.readTranscript(runId, 5000);
        if (!transcript.ok || !transcript.transcriptPath) {
            return {
                ok: false,
                repaired: 0,
                status: transcript.status
            };
        }
        const calls = new Map();
        const results = new Set();
        for (const item of transcript.items) {
            if (item.type === 'tool.call') {
                const callId = normalizeString(item.payload?.callId || item.payload?.toolCallId || item.id);
                if (callId) {
                    calls.set(callId, item);
                }
            }
            if (item.type === 'tool.result') {
                const callId = normalizeString(item.payload?.callId || item.payload?.toolCallId);
                if (callId) {
                    results.add(callId);
                }
            }
        }
        const missing = [...calls.entries()].filter(([callId]) => !results.has(callId));
        for (const [callId, callItem] of missing) {
            await this.appendItem(runId, {
                type: 'tool.result',
                status: 'repaired_missing_result',
                payload: {
                    callId,
                    tool: callItem.payload?.tool,
                    ok: false,
                    status: 'repaired_missing_result',
                    repaired: true,
                    result: {
                        content: [
                            {
                                type: 'text',
                                text: 'Tool result was missing from transcript; AILIS runtime inserted a repair item.'
                            }
                        ],
                        isError: true,
                        details: {
                            status: 'repaired_missing_result',
                            callId
                        }
                    }
                }
            });
        }
        if (missing.length) {
            await this.appendItem(runId, {
                type: 'transcript.repair',
                status: 'completed',
                payload: {
                    repairedToolResults: missing.map(([callId]) => callId)
                }
            });
        }
        return {
            ok: true,
            repaired: missing.length,
            status: 'completed'
        };
    }

    guardToolResult(result, { toolId = '', callId = '', maxTextChars = DEFAULT_MAX_RESULT_TEXT_CHARS } = {}) {
        const guarded = cloneJson(result || {});
        if (!Array.isArray(guarded.content)) {
            guarded.content = [];
        }
        guarded.content = guarded.content.map((part) => {
            if (!part || typeof part !== 'object') {
                return { type: 'text', text: summarize(part, maxTextChars) };
            }
            const next = redactObject(part);
            if (typeof next.text === 'string' && next.text.length > maxTextChars) {
                next.text = `${next.text.slice(0, maxTextChars - 3)}...`;
                next.truncated = true;
            }
            return next;
        });
        if (!guarded.content.length && guarded.details) {
            guarded.content.push({
                type: 'text',
                text: summarize(guarded.details, Math.min(maxTextChars, 1600))
            });
        }
        guarded.details = guarded.details && typeof guarded.details === 'object'
            ? redactObject(guarded.details)
            : guarded.details;
        if (!guarded.details || typeof guarded.details !== 'object') {
            guarded.details = {};
        }
        guarded.details = compactJsonForModel(guarded.details, {
            maxStringChars: 1200,
            maxArrayItems: 24,
            maxObjectKeys: 80,
            maxDepth: 5
        });
        if (guarded.structuredContent && typeof guarded.structuredContent === 'object') {
            guarded.structuredContent = compactJsonForModel(redactObject(guarded.structuredContent), {
                maxStringChars: 1200,
                maxArrayItems: 24,
                maxObjectKeys: 80,
                maxDepth: 5
            });
        }
        guarded.details.guard = {
            status: 'guarded',
            tool: toolId,
            callId,
            maxTextChars
        };
        return compactToolResultForModel(guarded, {
            maxTextChars,
            maxStructuredStringChars: 1200
        });
    }

    classifyToolCall({ toolId, args = {} } = {}) {
        const action = normalizeAction(args.action || args.operation || args.intent || args.command);
        const directMcp = parseDirectMcpToolId(toolId);
        if (directMcp) {
            return {
                class: 'mcp',
                mutates: false,
                requiresApprovalCapable: false,
                action: directMcp.tool,
                directMcpTool: directMcp.id
            };
        }
        if (RUNTIME_TOOL_IDS.has(toolId)) {
            if (toolId === 'update_plan') {
                return {
                    class: 'control_plane',
                    mutates: false,
                    requiresApprovalCapable: false,
                    action
                };
            }
            if (toolId === 'request_permissions') {
                return {
                    class: 'permission_request',
                    mutates: false,
                    requiresApprovalCapable: false,
                    action: 'request_permissions'
                };
            }
            if (toolId === 'subagents') {
                const subagentAction = normalizeAction(args.action, 'list');
                return {
                    class: 'subagent',
                    mutates: ['spawn', 'create', 'send', 'close'].includes(subagentAction),
                    requiresApprovalCapable: ['spawn', 'create', 'send', 'close'].includes(subagentAction),
                    action: subagentAction
                };
            }
            if (toolId === 'tool_doctor') {
                const doctorAction = normalizeAction(args.action, 'health_check');
                const mutates = ['record_observation', 'propose_repair', 'mark_repair'].includes(doctorAction)
                    || (doctorAction === 'discover_mcp' && (args.cloneGithub === true || args.allowNetwork === true));
                return {
                    class: 'tool_health',
                    mutates,
                    requiresApprovalCapable: false,
                    action: doctorAction
                };
            }
            if (toolId === 'capability_manager') {
                const capabilityAction = normalizeAction(args.action, 'registry');
                const mutates = [
                    'plan_install',
                    'plan_mcp_candidate',
                    'configure_external_auth_profile',
                    'install_capability',
                    'author_skill',
                    'rollback',
                    'execute_repair',
                    'bulk_expose_external_tools',
                    'refresh_registry',
                    'record_tool_outcome'
                ].includes(capabilityAction);
                return {
                    class: 'capability_lifecycle',
                    mutates,
                    requiresApprovalCapable: [
                        'configure_external_auth_profile',
                        'install_capability',
                        'author_skill',
                        'rollback',
                        'execute_repair',
                        'smoke_mcp_candidate',
                        'execute_exposed_external_tool',
                        'smoke_exposed_external_tool'
                    ].includes(capabilityAction),
                    action: capabilityAction
                };
            }
            if (toolId === 'self_debugger') {
                const debugAction = normalizeAction(args.action, 'open_case');
                const codeRepairActions = ['apply_patch'];
                const statefulActions = [
                    'open_case',
                    'create_case',
                    'collect_evidence',
                    'diagnose',
                    'propose_patch',
                    'validate_patch',
                    'apply_patch',
                    'run_loop',
                    'mark_case',
                    'close_case'
                ];
                return {
                    class: 'self_debug',
                    mutates: statefulActions.includes(debugAction),
                    requiresApprovalCapable: codeRepairActions.includes(debugAction),
                    action: debugAction
                };
            }
            if (toolId === 'self_evolution') {
                const evolutionAction = normalizeAction(args.action, 'analyze');
                const mutatingActions = ['analyze', 'mark_proposal', 'apply_proposal'];
                return {
                    class: 'self_evolution',
                    mutates: mutatingActions.includes(evolutionAction),
                    requiresApprovalCapable: evolutionAction === 'apply_proposal',
                    action: evolutionAction
                };
            }
            return {
                class: 'mcp',
                mutates:
                    [
                        'tool_call',
                        'call_tool',
                        'register_server',
                        'add_server',
                        'unregister_server',
                        'remove_server',
                        'shutdown_server'
                    ].includes(normalizeAction(args.action, 'list_servers')) && args.readOnly !== true,
                requiresApprovalCapable:
                    [
                        'tool_call',
                        'call_tool',
                        'register_server',
                        'add_server',
                        'unregister_server',
                        'remove_server',
                        'shutdown_server'
                    ].includes(normalizeAction(args.action, 'list_servers')) && args.readOnly !== true,
                action: normalizeAction(args.action, 'list_servers')
            };
        }
        if (FILE_READONLY_TOOLS.has(toolId)) {
            return { class: 'readonly_scoped', mutates: false, requiresApprovalCapable: false, action };
        }
        if (FILE_MUTATING_TOOLS.has(toolId)) {
            return { class: 'mutating', mutates: true, requiresApprovalCapable: false, action };
        }
        if (toolId === 'exec') {
            const command = normalizeString(args.cmd || args.command);
            if (command.includes('*** Begin Patch') && command.includes('*** End Patch')) {
                return { class: 'mutating', mutates: true, requiresApprovalCapable: false, action: 'apply_patch_intercept' };
            }
        }
        if (EXEC_TOOLS.has(toolId)) {
            return { class: 'exec_capable', mutates: true, requiresApprovalCapable: true, action };
        }
        if (toolId === 'computer') {
            if (['exec_command', 'exec', 'run'].includes(action)) {
                const command = normalizeString(args.cmd || args.command);
                if (command.includes('*** Begin Patch') && command.includes('*** End Patch')) {
                    return { class: 'mutating', mutates: true, requiresApprovalCapable: false, action: 'apply_patch_intercept' };
                }
            }
            if (action === 'write_stdin') {
                const chars = typeof args.chars === 'string'
                    ? args.chars
                    : typeof args.input === 'string'
                        ? args.input
                        : '';
                if (!chars) {
                    return { class: 'readonly_scoped', mutates: false, requiresApprovalCapable: false, action };
                }
                return { class: 'exec_capable', mutates: true, requiresApprovalCapable: true, action };
            }
            if (COMPUTER_READONLY_ACTIONS.has(action)) {
                return { class: 'readonly_scoped', mutates: false, requiresApprovalCapable: false, action };
            }
            if (COMPUTER_EXEC_ACTIONS.has(action)) {
                return { class: 'exec_capable', mutates: true, requiresApprovalCapable: true, action };
            }
            if (COMPUTER_MUTATING_ACTIONS.has(action)) {
                return { class: 'mutating', mutates: true, requiresApprovalCapable: false, action };
            }
        }
        if (toolId === 'email' && EMAIL_EXTERNAL_ACTIONS.has(action)) {
            return { class: 'external', mutates: true, requiresApprovalCapable: false, action };
        }
        if (toolId === 'file_manager' && FILE_MANAGER_MUTATING_ACTIONS.has(action) && args.dryRun !== true) {
            return { class: 'mutating', mutates: true, requiresApprovalCapable: false, action };
        }
        if (toolId === 'code') {
            if (CODE_EXEC_ACTIONS.has(action)) {
                return { class: 'exec_capable', mutates: true, requiresApprovalCapable: true, action };
            }
            if (CODE_MUTATING_ACTIONS.has(action)) {
                return { class: 'mutating', mutates: true, requiresApprovalCapable: false, action };
            }
        }
        if (VISION_TOOL_IDS.has(toolId)) {
            return { class: 'vision_readonly', mutates: false, requiresApprovalCapable: true, action };
        }
        return {
            class: 'unknown',
            mutates: false,
            requiresApprovalCapable: false,
            action
        };
    }

    evaluateToolCall({ toolId, args = {}, context = {}, workspaceDir = '' } = {}) {
        const policy = normalizePermissionProfile(context);
        const classification = this.classifyToolCall({ toolId, args, context });
        const permissionGrant = this.findPermissionGrantForToolCall({
            toolId,
            args,
            classification,
            context,
            workspaceDir
        });
        const deniedReasons = [];
        if (isReadOnlyProfile(policy) && classification.mutates && permissionGrant?.kind !== 'file_system.write') {
            deniedReasons.push('permission_profile_read_only');
        }
        if (policy.shell === 'none' && classification.class === 'exec_capable') {
            deniedReasons.push('shell_access_disabled');
        }
        if (policy.network === 'none' && ['external', 'mcp'].includes(classification.class) && permissionGrant?.kind !== 'network') {
            deniedReasons.push('network_access_disabled');
        }
        if (
            policy.approvalPolicy === 'never' &&
            context.approved !== true &&
            classification.requiresApprovalCapable === true &&
            !permissionGrant
        ) {
            deniedReasons.push('approval_not_allowed_by_policy');
        }
        const base = {
            ok: deniedReasons.length === 0,
            denied: deniedReasons.length > 0,
            needsApproval: false,
            reason: deniedReasons[0] || '',
            policy,
            classification,
            permissionGrant: permissionGrant ? {
                kind: permissionGrant.kind,
                grantId: permissionGrant.grant.id,
                scope: permissionGrant.grant.scope
            } : null
        };
        if (base.denied) {
            return base;
        }
        const requiresApproval = permissionGrant ? false : needsApprovalByPolicy(
            {
                ...classification,
                policy
            },
            context
        );
        if (requiresApproval) {
            return {
                ...base,
                ok: false,
                needsApproval: true,
                reason: `${classification.class}_requires_approval`
            };
        }
        return base;
    }

    exposeToolGroups(groups = {}, context = {}) {
        const allow = new Set(Array.isArray(context.toolPolicy?.allow) ? context.toolPolicy.allow : []);
        const deny = new Set(Array.isArray(context.toolPolicy?.deny) ? context.toolPolicy.deny : []);
        const profile = normalizeString(context.toolProfile || context.profile, 'full');
        const annotate = (tool) => {
            const id = tool.id || tool.name;
            const denied = deny.has(id) || (allow.size > 0 && !allow.has(id));
            return {
                ...tool,
                exposed: !denied,
                exposure: {
                    profile,
                    denied,
                    reason: denied ? 'filtered_by_tool_policy' : 'available'
                },
                policy: {
                    class: this.classifyToolCall({ toolId: id, args: {} }).class,
                    permissionProfile: normalizePermissionProfile(context).id
                }
            };
        };
        return Object.fromEntries(
            Object.entries(groups).map(([key, value]) => [
                key,
                Array.isArray(value) ? value.map(annotate).filter((tool) => tool.exposed !== false) : value
            ])
        );
    }

    permissionGrantScopeKey(context = {}, scope = 'session') {
        const sessionId = normalizeString(context.sessionId || context.sessionKey || context.session || 'main', 'main');
        if (scope === 'turn') {
            return `${sessionId}|${normalizeString(context.runId || context.turnId || context.callId, 'turn')}`;
        }
        return `${sessionId}|session`;
    }

    listPermissionGrantsForContext(context = {}) {
        const sessionKey = this.permissionGrantScopeKey(context, 'session');
        const turnKey = this.permissionGrantScopeKey(context, 'turn');
        return [...this.permissionGrants.values()].filter((grant) => grant.scopeKey === sessionKey || grant.scopeKey === turnKey);
    }

    findPermissionGrantForToolCall({ toolId, args = {}, classification = {}, context = {}, workspaceDir = '' } = {}) {
        const grants = this.listPermissionGrantsForContext(context);
        if (!grants.length) {
            return null;
        }
        if (['external', 'mcp'].includes(classification.class)) {
            const grant = grants.find((entry) => entry.permissions?.network?.enabled === true);
            return grant ? { kind: 'network', grant } : null;
        }
        if (!classification.mutates) {
            return null;
        }
        const roots = grants.flatMap((grant) => grant.permissions?.file_system?.write || []);
        if (!roots.length) {
            return null;
        }
        const targets = collectToolWritePaths({
            toolId,
            args,
            workspaceRoot: workspaceDir || context.workspace || this.workspaceRoot
        });
        if (!targets.length) {
            return null;
        }
        const ok = targets.every((target) => isInsideAnyPath(target, roots));
        if (!ok) {
            return null;
        }
        const grant = grants.find((entry) => {
            const writeRoots = entry.permissions?.file_system?.write || [];
            return targets.every((target) => isInsideAnyPath(target, writeRoots));
        });
        return grant ? { kind: 'file_system.write', grant, targets } : null;
    }

    async requestPermissions(args = {}, context = {}) {
        const permissions = normalizePermissionRequest(args.permissions || {}, context.workspace || this.workspaceRoot);
        if (isEmptyPermissionRequest(permissions)) {
            return {
                content: [{ type: 'text', text: 'request_permissions requires at least one permission' }],
                isError: true,
                details: {
                    status: 'empty_permission_request',
                    error: 'request_permissions requires at least one network or file_system permission'
                }
            };
        }
        const scope = normalizeString(args.scope, 'session') === 'turn' ? 'turn' : 'session';
        const request = {
            id: randomUUID(),
            status: context.approved === true || args.approved === true ? 'granted' : 'needs_approval',
            reason: normalizeString(args.reason, 'AILIS needs additional permissions to continue the task.'),
            scope,
            scopeKey: this.permissionGrantScopeKey(context, scope),
            permissions,
            createdAt: new Date().toISOString(),
            runId: normalizeString(context.runId),
            sessionId: normalizeString(context.sessionId || context.sessionKey || 'main', 'main')
        };
        if (request.status !== 'granted') {
            this.emitGatewayEvent('approval.requested', {
                type: 'request_permissions',
                requestId: request.id,
                reason: request.reason,
                permissions: request.permissions,
                scope: request.scope
            });
            return {
                content: [{ type: 'text', text: JSON.stringify(request, null, 2) }],
                isError: true,
                details: {
                    status: 'needs_approval',
                    permissionRequest: request
                }
            };
        }
        this.permissionGrants.set(request.id, request);
        this.emitGatewayEvent('approval.granted', {
            type: 'request_permissions',
            grantId: request.id,
            reason: request.reason,
            permissions: request.permissions,
            scope: request.scope
        });
        return {
            content: [{ type: 'text', text: JSON.stringify(request, null, 2) }],
            details: {
                status: 'completed',
                grant: request
            }
        };
    }

    async updatePlan({ runId, sessionId = 'main', plan = [], explanation = '' } = {}) {
        const id = normalizeString(runId, `plan-${safeSegment(sessionId, 'main')}`);
        const items = normalizePlanItems(plan);
        const state = {
            runId: id,
            sessionId,
            updatedAt: Date.now(),
            explanation: normalizeString(explanation),
            items
        };
        this.planState.set(id, state);
        await this.appendItem(id, {
            type: 'plan.updated',
            sessionId,
            status: 'completed',
            payload: state
        });
        this.emitGatewayEvent('agent.plan.updated', {
            runId: id,
            sessionId,
            explanation: state.explanation,
            plan: items
        });
        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify(
                        {
                            status: 'completed',
                            explanation: state.explanation,
                            plan: items
                        },
                        null,
                        2
                    )
                }
            ],
            details: {
                status: 'completed',
                explanation: state.explanation,
                plan: items
            }
        };
    }

    async executeSelfEvolution(args = {}, context = {}) {
        const action = normalizeAction(args.action || args.operation || args.intent, 'analyze');
        const runtime = this.selfEvolutionRuntime;
        if (!runtime) {
            return {
                content: [{
                    type: 'text',
                    text: '自我进化 runtime 还没有连接到当前 Agent 执行环境。'
                }],
                isError: true,
                details: {
                    status: 'self_evolution_runtime_not_available',
                    action
                }
            };
        }
        await runtime.ensureLoaded?.();
        let result = null;
        if (action === 'schema') {
            result = {
                ok: true,
                status: 'completed',
                contract: getToolContractPromptText('self_evolution')
            };
        } else if (action === 'analyze') {
            result = await runtime.analyze({
                ...args,
                taskText: normalizeString(args.taskText || args.task || args.query || context.message || context.userMessage)
            });
        } else if (action === 'list_proposals') {
            result = await runtime.listProposals(args);
        } else if (action === 'get_proposal') {
            const id = normalizeString(args.id || args.proposalId);
            const proposal = await runtime.getProposal(id);
            result = proposal
                ? { ok: true, status: 'completed', proposal }
                : { ok: false, status: 'not_found', id };
        } else if (action === 'mark_proposal') {
            result = await runtime.markProposal(args);
        } else if (action === 'apply_proposal') {
            result = await runtime.applyProposal(args, {
                ...context,
                approved: args.approved === true || context.approved === true,
                source: normalizeString(args.source || context.source, 'agent')
            });
        } else {
            result = {
                ok: false,
                status: 'invalid_tool_args',
                error: `Unsupported self_evolution action: ${action}`
            };
        }
        const status = normalizeString(result?.status, result?.ok === false ? 'failed' : 'completed');
        const text = this.formatSelfEvolutionResult(action, result || {});
        return {
            content: [{ type: 'text', text }],
            isError: result?.ok === false && status !== 'needs_approval',
            details: {
                status,
                action,
                ...(result && typeof result === 'object' ? result : { result })
            },
            structuredContent: {
                status,
                action,
                ...(result && typeof result === 'object' ? result : { result })
            }
        };
    }

    async executeTool(toolId, args = {}, context = {}) {
        return await this.toolRuntimeRegistry.dispatch(toolId, args, context);
    }

    publicSubagent(subagent = {}) {
        return cloneJson(subagent);
    }

    appendSubagentLocalEvent(subagent, event = {}) {
        const entry = {
            id: randomUUID(),
            ts: Date.now(),
            iso: new Date().toISOString(),
            type: normalizeString(event.type, 'subagent.event'),
            status: normalizeString(event.status),
            message: normalizeString(event.message),
            payload: redactObject(event.payload || {})
        };
        subagent.events = Array.isArray(subagent.events) ? subagent.events : [];
        subagent.events.push(entry);
        if (subagent.events.length > 200) {
            subagent.events = subagent.events.slice(-200);
        }
        this.emitGatewayEvent('subagent.event', {
            subagentId: subagent.id,
            childRunId: subagent.childRunId,
            sessionId: subagent.childSessionId,
            type: entry.type,
            status: entry.status,
            message: entry.message,
            payload: entry.payload
        });
        return entry;
    }

    async appendSubagentTranscriptEvent(subagent, event = {}) {
        this.appendSubagentLocalEvent(subagent, event);
        if (!subagent.runId) {
            return null;
        }
        return await this.appendItem(subagent.runId, {
            type: normalizeString(event.type, 'subagent.event'),
            sessionId: subagent.sessionId,
            status: normalizeString(event.status, subagent.status),
            payload: {
                subagentId: subagent.id,
                childRunId: subagent.childRunId,
                childSessionId: subagent.childSessionId,
                message: normalizeString(event.message),
                ...(event.payload && typeof event.payload === 'object' ? event.payload : {})
            }
        });
    }

    buildSubagentContext(subagent, args = {}, context = {}) {
        const inherited = {
            permissionProfile: context.permissionProfile || context.permissions || context.policy || context.sandbox,
            approvalPolicy: context.approvalPolicy || context.confirmationPolicy,
            toolPolicy: context.toolPolicy,
            workspace: context.workspace || this.workspaceRoot,
            llmSettings: context.llmSettings || context.llm,
            emailProfiles: context.emailProfiles || context.emailAccounts,
            visionPermissionPolicy: context.visionPermissionPolicy || context.visionPolicy,
            computerControlEnabled: context.computerControlEnabled,
            approved: context.approved === true,
            autoConfirm: context.autoConfirm === true
        };
        return {
            ...inherited,
            ...(args.context && typeof args.context === 'object' ? args.context : {}),
            parentRunId: subagent.runId,
            parentSessionId: subagent.sessionId,
            subagentId: subagent.id,
            subagentLabel: subagent.label,
            sessionId: subagent.childSessionId,
            sessionKey: subagent.childSessionId,
            planner: normalizeString(args.planner || context.planner, 'llm'),
            agentLoop: normalizeString(args.agentLoop || context.agentLoop, 'llm'),
            agentMode: normalizeString(args.agentMode || context.agentMode, 'llm'),
            maxAgentSteps: Number(args.maxAgentSteps || context.maxAgentSteps || 50)
        };
    }

    async runDefaultSubagentExecutor({ subagent, onEvent, signal }) {
        await onEvent({
            type: 'subagent.runner.notice',
            status: 'running',
            message: 'No custom subagent executor was configured; using deterministic local runner.'
        });
        await raceWithAbort(Promise.resolve(), signal);
        return {
            ok: true,
            status: 'completed',
            displayText: `Subagent accepted task: ${subagent.task}`,
            result: {
                task: subagent.task
            }
        };
    }

    startSubagentRun(subagent, args = {}, context = {}) {
        const controller = new AbortController();
        this.subagentControllers.set(subagent.id, controller);
        const runTimeoutMs = Math.max(
            1000,
            Math.min(Number(args.runTimeoutMs || args.timeoutMs || DEFAULT_SUBAGENT_RUN_TIMEOUT_MS), 24 * 60 * 60 * 1000)
        );
        const executor = this.subagentExecutor || ((payload) => this.runDefaultSubagentExecutor(payload));
        const runPromise = (async () => {
            subagent.status = 'running';
            subagent.startedAt = Date.now();
            await this.appendSubagentTranscriptEvent(subagent, {
                type: 'subagent.started',
                status: 'running',
                message: subagent.task,
                payload: this.publicSubagent(subagent)
            });
            try {
                const result = await withTimeoutPromise(
                    raceWithAbort(
                        Promise.resolve(
                            executor({
                                subagent: this.publicSubagent(subagent),
                                args: cloneJson(args),
                                context: this.buildSubagentContext(subagent, args, context),
                                signal: controller.signal,
                                onEvent: async (event) => {
                                    await this.appendSubagentTranscriptEvent(subagent, event);
                                }
                            })
                        ),
                        controller.signal
                    ),
                    runTimeoutMs,
                    `subagent ${subagent.id} timed out after ${runTimeoutMs}ms`
                );
                subagent.status = normalizeString(result?.status, 'completed');
                subagent.ok = result?.ok !== false && !['failed', 'error', 'cancelled', 'timeout'].includes(subagent.status);
                subagent.finishedAt = Date.now();
                subagent.durationMs = subagent.finishedAt - subagent.startedAt;
                subagent.result = redactObject(result || {});
                await this.appendSubagentTranscriptEvent(subagent, {
                    type: 'subagent.completed',
                    status: subagent.status,
                    message: normalizeString(result?.displayText || result?.summary, 'subagent completed'),
                    payload: {
                        ok: subagent.ok,
                        durationMs: subagent.durationMs,
                        result: subagent.result
                    }
                });
                return subagent.result;
            } catch (error) {
                subagent.status = isAbortError(error) ? 'cancelled' : /timed out/i.test(error?.message || '') ? 'timeout' : 'failed';
                subagent.ok = false;
                subagent.finishedAt = Date.now();
                subagent.durationMs = subagent.startedAt ? subagent.finishedAt - subagent.startedAt : 0;
                subagent.error = error?.message || String(error);
                await this.appendSubagentTranscriptEvent(subagent, {
                    type: 'subagent.completed',
                    status: subagent.status,
                    message: subagent.error,
                    payload: {
                        ok: false,
                        durationMs: subagent.durationMs,
                        error: subagent.error
                    }
                });
                return {
                    ok: false,
                    status: subagent.status,
                    error: subagent.error
                };
            } finally {
                this.subagentControllers.delete(subagent.id);
                this.subagentRuns.delete(subagent.id);
            }
        })();
        this.subagentRuns.set(subagent.id, runPromise);
        return runPromise;
    }

    async waitForSubagent(subagentId, timeoutMs = DEFAULT_SUBAGENT_WAIT_TIMEOUT_MS) {
        const subagent = this.subagents.get(subagentId);
        if (!subagent) {
            return {
                status: 'not_found',
                subagent: null
            };
        }
        const promise = this.subagentRuns.get(subagentId);
        if (!promise || ['completed', 'failed', 'cancelled', 'timeout'].includes(subagent.status)) {
            return {
                status: subagent.status || 'completed',
                subagent: this.publicSubagent(subagent)
            };
        }
        try {
            await withTimeoutPromise(promise, timeoutMs, `wait for subagent ${subagentId} timed out`);
        } catch (error) {
            if (/timed out/i.test(error?.message || '')) {
                return {
                    status: 'running',
                    timedOut: true,
                    subagent: this.publicSubagent(subagent)
                };
            }
            throw error;
        }
        return {
            status: subagent.status || 'completed',
            subagent: this.publicSubagent(subagent)
        };
    }

    async executeSubagentRelay(args = {}, context = {}) {
        const action = normalizeAction(args.action, 'list');
        const runId = normalizeString(context.runId || args.runId);
        const sessionId = normalizeString(context.sessionId || context.sessionKey || args.sessionId, 'main');
        if (action === 'list') {
            const subagents = [...this.subagents.values()].map((subagent) => this.publicSubagent(subagent));
            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify({ status: 'completed', subagents }, null, 2)
                    }
                ],
                details: {
                    status: 'completed',
                    subagents
                }
            };
        }
        if (['spawn', 'create'].includes(action)) {
            const subagentId = normalizeString(args.subagentId || args.id, `subagent-${randomUUID()}`);
            const task = normalizeString(args.task || args.prompt || args.message);
            const subagent = {
                id: subagentId,
                label: normalizeString(args.label || args.name, subagentId),
                runId,
                sessionId,
                childRunId: normalizeString(args.childRunId, `child-${randomUUID()}`),
                childSessionId: normalizeString(
                    args.childSessionId || args.childSessionKey,
                    `${sessionId}:subagent:${subagentId}`
                ),
                status: 'queued',
                task,
                createdAt: Date.now(),
                events: []
            };
            this.subagents.set(subagentId, subagent);
            await this.appendSubagentTranscriptEvent(subagent, {
                type: 'subagent.spawned',
                status: 'queued',
                message: task,
                payload: this.publicSubagent(subagent)
            });
            this.startSubagentRun(subagent, args, context);
            if (args.wait === true) {
                const waited = await this.waitForSubagent(subagentId, args.waitTimeoutMs || DEFAULT_SUBAGENT_WAIT_TIMEOUT_MS);
                const response = {
                    status: waited.status === 'completed' ? 'completed' : waited.status,
                    subagent: waited.subagent
                };
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(response, null, 2)
                        }
                    ],
                    details: response,
                    isError: !['completed', 'running'].includes(response.status)
                };
            }
            const publicRecord = this.publicSubagent(subagent);
            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify({ status: 'running', subagent: publicRecord }, null, 2)
                    }
                ],
                details: {
                    status: 'running',
                    subagent: publicRecord
                }
            };
        }
        if (['status', 'info'].includes(action)) {
            const subagent = this.subagents.get(normalizeString(args.subagentId || args.id));
            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify(
                            {
                                status: subagent ? 'completed' : 'not_found',
                                subagent: subagent ? this.publicSubagent(subagent) : null
                            },
                            null,
                            2
                        )
                    }
                ],
                details: {
                    status: subagent ? 'completed' : 'not_found',
                    subagent: subagent ? this.publicSubagent(subagent) : null
                },
                isError: !subagent
            };
        }
        if (action === 'wait') {
            const subagentId = normalizeString(args.subagentId || args.id);
            const waited = await this.waitForSubagent(subagentId, args.timeoutMs || args.waitTimeoutMs);
            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify(waited, null, 2)
                    }
                ],
                details: waited,
                isError: waited.status === 'not_found'
            };
        }
        if (action === 'log') {
            const subagent = this.subagents.get(normalizeString(args.subagentId || args.id));
            const limit = Math.max(1, Math.min(Number(args.limit || 50), 200));
            const events = subagent ? (subagent.events || []).slice(-limit) : [];
            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify({ status: subagent ? 'completed' : 'not_found', events }, null, 2)
                    }
                ],
                details: {
                    status: subagent ? 'completed' : 'not_found',
                    events
                },
                isError: !subagent
            };
        }
        if (['send', 'steer'].includes(action)) {
            const subagent = this.subagents.get(normalizeString(args.subagentId || args.id));
            if (subagent) {
                await this.appendSubagentTranscriptEvent(subagent, {
                    type: 'subagent.input',
                    status: 'queued',
                    message: normalizeString(args.message || args.input || args.text),
                    payload: {
                        action,
                        message: normalizeString(args.message || args.input || args.text)
                    }
                });
            }
            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify(
                            {
                                status: subagent ? 'queued' : 'not_found',
                                subagent: subagent ? this.publicSubagent(subagent) : null
                            },
                            null,
                            2
                        )
                    }
                ],
                details: {
                    status: subagent ? 'queued' : 'not_found',
                    subagent: subagent ? this.publicSubagent(subagent) : null
                },
                isError: !subagent
            };
        }
        if (['close', 'cancel', 'kill'].includes(action)) {
            const subagentId = normalizeString(args.subagentId || args.id);
            const subagent = this.subagents.get(subagentId);
            if (subagent) {
                const controller = this.subagentControllers.get(subagentId);
                if (controller) {
                    controller.abort();
                }
                subagent.status = ['completed', 'failed', 'cancelled', 'timeout'].includes(subagent.status)
                    ? subagent.status
                    : 'cancel_requested';
                subagent.closedAt = Date.now();
                await this.appendSubagentTranscriptEvent(subagent, {
                    type: 'subagent.closed',
                    status: subagent.status,
                    message: normalizeString(args.reason, 'subagent close requested'),
                    payload: {
                        subagentId,
                        reason: normalizeString(args.reason)
                    }
                });
            }
            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify(
                            {
                                status: subagent ? 'completed' : 'not_found',
                                subagent: subagent ? this.publicSubagent(subagent) : null
                            },
                            null,
                            2
                        )
                    }
                ],
                details: {
                    status: subagent ? 'completed' : 'not_found',
                    subagent: subagent ? this.publicSubagent(subagent) : null
                },
                isError: !subagent
            };
        }
        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify({ status: 'unsupported_action', action }, null, 2)
                }
            ],
            isError: true,
            details: {
                status: 'unsupported_action',
                action
            }
        };
    }

    async executeMcpBridge(args = {}, context = {}) {
        const action = normalizeAction(args.action, 'list_servers');
        const runId = normalizeString(context.runId || args.runId);
        const sessionId = normalizeString(context.sessionId || context.sessionKey || args.sessionId, 'main');
        this.mcpManager.registerRuntimeConfigs(args, context);
        if (action === 'schema') {
            const schemaText = getToolContractPromptText('mcp_bridge');
            return {
                content: [
                    {
                        type: 'text',
                        text: schemaText || JSON.stringify({ status: 'completed', tool: 'mcp_bridge' }, null, 2)
                    }
                ],
                details: {
                    status: 'completed',
                    tool: 'mcp_bridge'
                }
            };
        }
        if (action === 'list_servers') {
            const servers = this.mcpManager.listServers();
            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify({ status: 'completed', servers }, null, 2)
                    }
                ],
                details: {
                    status: 'completed',
                    servers
                }
            };
        }
        if (['register_server', 'add_server'].includes(action)) {
            const registered = this.mcpManager.registerServers(
                args.serverConfig || args.config || args.servers || {
                    [normalizeString(args.server || args.name, 'default')]: args
                },
                { persist: args.persist !== false }
            );
            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify({ status: 'completed', registered, servers: this.mcpManager.listServers() }, null, 2)
                    }
                ],
                details: {
                    status: 'completed',
                    registered,
                    servers: this.mcpManager.listServers()
                }
            };
        }
        if (['unregister_server', 'remove_server'].includes(action)) {
            const server = normalizeString(args.server || args.serverId || args.name);
            const removed = this.mcpManager.removeServer(server, { persist: args.persist !== false });
            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify({ status: removed ? 'completed' : 'not_found', server }, null, 2)
                    }
                ],
                details: {
                    status: removed ? 'completed' : 'not_found',
                    server,
                    removed
                },
                isError: !removed
            };
        }
        if (action === 'health_check') {
            const server = normalizeString(args.server || args.serverId);
            const health = await this.mcpManager.healthCheck(server, args.timeoutMs || context.timeoutMs || 5000);
            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify({ status: 'completed', health }, null, 2)
                    }
                ],
                details: {
                    status: 'completed',
                    health
                },
                isError: health.some((entry) => entry.ok === false)
            };
        }
        if (action === 'list_tools') {
            const server = normalizeString(args.server || args.serverId);
            const tools = await this.mcpManager.listTools(server, args.timeoutMs || context.timeoutMs);
            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify({ status: 'completed', tools }, null, 2)
                    }
                ],
                details: {
                    status: 'completed',
                    tools
                }
            };
        }
        if (action === 'list_tool_specs') {
            const server = normalizeString(args.server || args.serverId);
            const toolSpecs = await this.mcpManager.listToolSpecs(server, args.timeoutMs || context.timeoutMs);
            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify({ status: 'completed', toolSpecs }, null, 2)
                    }
                ],
                details: {
                    status: 'completed',
                    server,
                    toolSpecs
                }
            };
        }
        if (action === 'search_tools') {
            const server = normalizeString(args.server || args.serverId);
            const query = normalizeString(args.query || args.q || args.search);
            const toolSpecs = await this.mcpManager.searchToolSpecs({
                query,
                server,
                limit: args.limit,
                timeoutMs: args.timeoutMs || context.timeoutMs
            });
            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify({ status: 'completed', query, toolSpecs }, null, 2)
                    }
                ],
                details: {
                    status: 'completed',
                    query,
                    server,
                    toolSpecs
                }
            };
        }
        if (action === 'list_resources') {
            const server = normalizeString(args.server || args.serverId);
            const resources = await this.mcpManager.listResources(server, args.timeoutMs || context.timeoutMs);
            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify({ status: 'completed', resources }, null, 2)
                    }
                ],
                details: {
                    status: 'completed',
                    resources
                }
            };
        }
        if (action === 'list_prompts') {
            const server = normalizeString(args.server || args.serverId);
            const prompts = await this.mcpManager.listPrompts(server, args.timeoutMs || context.timeoutMs);
            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify({ status: 'completed', prompts }, null, 2)
                    }
                ],
                details: {
                    status: 'completed',
                    prompts
                }
            };
        }
        if (action === 'get_prompt') {
            const server = normalizeString(args.server || args.serverId);
            const prompt = normalizeString(args.prompt || args.promptName || args.name);
            const result = await this.mcpManager.getPrompt({
                server,
                prompt,
                args: args.args || args.arguments || {},
                timeoutMs: args.timeoutMs || context.timeoutMs
            });
            return {
                content: normalizeMcpContent(result),
                details: {
                    status: 'completed',
                    server,
                    prompt,
                    result
                }
            };
        }
        if (action === 'read_resource') {
            const server = normalizeString(args.server || args.serverId);
            const uri = normalizeString(args.uri || args.resourceUri || args.resource);
            await this.appendItem(runId, {
                type: 'mcp.resource.read.begin',
                sessionId,
                status: 'started',
                payload: { server, uri }
            });
            const result = await this.mcpManager.readResource({
                server,
                uri,
                timeoutMs: args.timeoutMs || context.timeoutMs
            });
            await this.appendItem(runId, {
                type: 'mcp.resource.read.end',
                sessionId,
                status: 'completed',
                payload: { server, uri }
            });
            return {
                content: normalizeMcpContent(result),
                details: {
                    status: 'completed',
                    server,
                    uri,
                    result
                }
            };
        }
        if (['tool_call', 'call_tool'].includes(action)) {
            const server = normalizeString(args.server || args.serverId);
            const tool = normalizeString(args.tool || args.name || args.toolName || args.tool_name);
            const toolArgs = normalizeMcpToolArgs(args);
            await this.appendItem(runId, {
                type: 'mcp.tool.call.begin',
                sessionId,
                status: 'started',
                payload: {
                    server,
                    tool,
                    args: toolArgs
                }
            });
            try {
                const result = await this.mcpManager.callTool({
                    server,
                    tool,
                    args: toolArgs,
                    meta: args._meta || args.meta,
                    timeoutMs: args.timeoutMs || context.timeoutMs
                });
                const status = result?.isError === true ? 'error' : 'completed';
                await this.appendItem(runId, {
                    type: 'mcp.tool.call.end',
                    sessionId,
                    status,
                    payload: {
                        server,
                        tool,
                        isError: result?.isError === true
                    }
                });
                return {
                    content: normalizeMcpContent(result),
                    isError: result?.isError === true,
                    details: {
                        status,
                        server,
                        tool,
                        result
                    }
                };
            } catch (error) {
                await this.appendItem(runId, {
                    type: 'mcp.tool.call.end',
                    sessionId,
                    status: 'error',
                    payload: {
                        server,
                        tool,
                        error: error?.message || String(error)
                    }
                });
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(
                                {
                                    status: 'error',
                                    server,
                                    tool,
                                    error: error?.message || String(error)
                                },
                                null,
                                2
                            )
                        }
                    ],
                    isError: true,
                    details: {
                        status: 'error',
                        server,
                        tool,
                        error: error?.message || String(error),
                        details: error?.details
                    }
                };
            }
        }
        if (['shutdown_server', 'close_server'].includes(action)) {
            const server = normalizeString(args.server || args.serverId);
            await this.mcpManager.shutdown(server);
            return {
                content: [
                    {
                        type: 'text',
                        text: JSON.stringify({ status: 'completed', server: server || 'all' }, null, 2)
                    }
                ],
                details: {
                    status: 'completed',
                    server: server || 'all'
                }
            };
        }
        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify({ status: 'unsupported_action', action }, null, 2)
                }
            ],
            isError: true,
            details: {
                status: 'unsupported_action',
                action
            }
        };
    }
}

module.exports = {
    AILISRuntime,
    RUNTIME_TOOL_DEFINITIONS,
    RUNTIME_TOOL_IDS
};
