const fsp = require('fs/promises');
const fsSync = require('fs');
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
const { makeHeadTailPreview } = require('./ailis-runtime-budget.cjs');
const { normalizeAilisToolOutput } = require('./ailis-tool-result.cjs');
const { TOOL_INLINE_MEDIA_BYTES, toolInlineByteLimit } = require('./ailis-tool-output-limits.cjs');
const {
    RolloutItem
} = require('./ailis-prompt-model.cjs');
const {
    AgentControl,
    InputQueue
} = require('./ailis-agent-control.cjs');

const DEFAULT_MAX_TRANSCRIPT_ITEMS = 500;
const DEFAULT_SUBAGENT_RUN_TIMEOUT_MS = 15 * 60 * 1000;

const FILE_MUTATING_TOOLS = new Set(['write', 'edit', 'apply_patch']);
const FILE_READONLY_TOOLS = new Set(['read', 'web_fetch']);
const EXEC_TOOLS = new Set(['exec', 'exec_command']);
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

function asarUnpackedPath(filePath = '') {
    return normalizeString(filePath).replace(/\.asar(?=$|[/\\])/, '.asar.unpacked');
}

function firstExistingPath(paths = []) {
    for (const candidate of paths) {
        const normalized = normalizeString(candidate);
        if (normalized && fsSync.existsSync(normalized)) {
            return normalized;
        }
    }
    return '';
}

function firstSpawnCwd(paths = []) {
    for (const candidate of paths) {
        const normalized = normalizeString(candidate);
        if (!normalized || /\.asar(?=$|[/\\])/.test(normalized)) {
            continue;
        }
        try {
            if (fsSync.statSync(normalized).isDirectory()) {
                return normalized;
            }
        } catch {
            // Try the next packaged/development candidate.
        }
    }
    return process.cwd();
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
    const defaultServerPath = path.join(projectRoot, 'scripts', 'mcp-ailis-research-server.cjs');
    const serverPath = firstExistingPath([
        asarUnpackedPath(defaultServerPath),
        process.resourcesPath
            ? path.join(process.resourcesPath, 'app.asar.unpacked', 'scripts', 'mcp-ailis-research-server.cjs')
            : '',
        defaultServerPath
    ]) || defaultServerPath;
    const serverRoot = path.resolve(path.dirname(serverPath), '..');
    const cwd = firstSpawnCwd([serverRoot, path.dirname(serverPath), projectRoot]);
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
            cwd,
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

function buildSubagentErrorHandoff({ subagent = {}, status = 'failed', error = '', durationMs = 0 } = {}) {
    const normalizedStatus = normalizeString(status, 'failed');
    const task = normalizeString(subagent.task);
    const reason = normalizeString(error, normalizedStatus);
    const statusText = normalizedStatus === 'timeout'
        ? 'TaskAgent 执行超时，运行时已经停止等待。'
        : normalizedStatus === 'cancelled'
            ? 'TaskAgent 已被取消。'
            : 'TaskAgent 执行失败。';
    const userVisibleSummary = [
        statusText,
        reason ? `失败原因：${summarize(reason, 360)}` : '',
        task ? `原任务：${summarize(task, 220)}` : '',
        '完整事件链路已保存在 Agent Lab，可以从这个子任务记录继续排查。'
    ].filter(Boolean).join('\n');
    return {
        version: 1,
        status: normalizedStatus,
        ok: false,
        runId: subagent.childRunId || '',
        sessionId: subagent.childSessionId || '',
        task,
        finalAnswer: '',
        partialAnswer: '',
        userVisibleSummary,
        failureAnalysis: {
            reason,
            bottleneck: reason,
            unresolvedQuestions: [],
            latestFailedStep: null,
            likelyCause: normalizedStatus === 'timeout'
                ? '子任务超过运行时等待时间。'
                : '子任务执行器抛出错误或被取消。',
            retryable: normalizedStatus !== 'cancelled'
        },
        executionTrace: {
            stepsUsed: 0,
            maxSteps: 0,
            elapsedMs: Number(durationMs) || 0,
            toolCalls: 0,
            successfulToolCount: 0,
            failedToolCount: 0,
            successfulTools: [],
            failedTools: []
        },
        collectedData: [],
        keyEvents: [],
        nextStep: {
            recommendation: normalizedStatus === 'timeout'
                ? '提高任务预算或先缩小任务范围后继续。'
                : '查看 Agent Lab 中的子任务事件，定位失败前最后一个动作。',
            resumeFrom: 0,
            suggestedTool: '',
            needsUserInput: false
        },
        resume: {
            runId: subagent.childRunId || '',
            sessionId: subagent.childSessionId || '',
            lastStepIndex: 0,
            contextManagerCheckpoint: null,
            checkpointAvailable: false
        },
        traceRef: subagent.childRunId || ''
    };
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
        this.rawMemoryLedger = options.rawMemoryLedger || null;
        this.agentExecutor = typeof options.agentExecutor === 'function' ? options.agentExecutor : null;
        this.platformAdapter = createAILISPlatformAdapter(options.platformAdapter || options.platform || {});
        this.runs = new Map();
        this.planState = new Map();
        this.permissionGrants = new Map();
        this.input_queue = new InputQueue();
        this.agent_control = new AgentControl({
            execute_agent: this.agentExecutor,
            input_queue: this.input_queue,
            max_threads_per_session: options.agentMaxThreads || 1,
            run_timeout_ms: options.agentRunTimeoutMs || DEFAULT_SUBAGENT_RUN_TIMEOUT_MS,
            build_agent_context: (agent, args, context) => this.buildAgentContext(agent, args, context),
            build_error_result: (agent, status, error, durationMs) => this.buildAgentErrorResult(agent, status, error, durationMs),
            emit_agent_event: (agent, event) => this.appendAgentTranscriptEvent(agent, event)
        });
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
            agentCount: this.agent_control.count_agents(),
            platform: this.platformAdapter.getStatus(),
            mcpServerCount: this.mcpManager.getStatus().serverCount,
            mcp: this.mcpManager.getStatus(),
            toolDoctor: this.toolDoctor.getStatus(),
            capabilityManager: this.capabilityManager.getStatus(),
            selfDebugger: this.selfDebugger.getStatus(),
            selfEvolution: this.selfEvolutionRuntime?.getStatus?.() || null,
            rawMemory: this.rawMemoryLedger?.getStatus?.() || null,
            runtimeTools: this.toolRuntimeRegistry.listDefinitions().map((tool) => tool.id),
            contextArtifacts: {
                rootDir: this.contextArtifactStore.rootDir,
                indexPath: this.contextArtifactStore.indexPath
            },
            toolRuntime: {
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
                'codex_agent_thread_tree',
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
        await this.agent_control.shutdown();
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
        try {
            this.rawMemoryLedger?.recordRuntimeItem?.(transcriptItem);
        } catch (error) {
            this.emitGatewayEvent('raw_memory.error', {
                runId: id,
                sessionId: transcriptItem.sessionId,
                error: error?.message || String(error)
            });
        }
        this.emitGatewayEvent('runtime.item', {
            runId: id,
            sessionId: transcriptItem.sessionId,
            type: transcriptItem.type,
            seq: transcriptItem.seq,
            itemId: transcriptItem.id
        });
        return transcriptItem;
    }

    async appendContextCompaction(runId, {
        sessionId = '',
        compactedItem = {},
        referenceContextItem = null,
        contextManagerCheckpoint = null,
        reason = ''
    } = {}) {
        const compacted = RolloutItem.compacted(compactedItem);
        const written = [];
        const compactionItem = await this.appendItem(runId, {
            type: 'agent.context_compaction',
            sessionId,
            status: 'installed',
            payload: {
                reason,
                rollout_item: compacted,
                compacted_item: compacted.payload,
                context_manager_checkpoint: contextManagerCheckpoint || null
            }
        });
        if (compactionItem) {
            written.push(compactionItem);
        }
        if (referenceContextItem) {
            const turnContext = RolloutItem.turnContext(referenceContextItem);
            const turnContextItem = await this.appendItem(runId, {
                type: 'agent.turn_context',
                sessionId,
                status: 'captured',
                payload: {
                    rollout_item: turnContext,
                    reference_context_item: turnContext.payload
                }
            });
            if (turnContextItem) {
                written.push(turnContextItem);
            }
        }
        return written;
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
                durationMs: result.durationMs,
                ...(result.cost && typeof result.cost === 'object'
                    ? { cost: cloneJson(result.cost) }
                    : {})
            }
        });
        await this.appendItem(id, {
            type: 'turn.completed',
            status: normalizeString(result.status, 'completed'),
            payload: {
                ok: result.ok,
                status: result.status,
                durationMs: result.durationMs,
                ...(result.cost && typeof result.cost === 'object'
                    ? { cost: cloneJson(result.cost) }
                    : {})
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

    async boundToolOutput(result, { toolId = '', callId = '' } = {}) {
        const limit = toolInlineByteLimit(toolId);
        if (limit === null) return result;
        const serialized = JSON.stringify(result);
        if (!serialized || Buffer.byteLength(serialized, 'utf8') <= limit) return result;

        // Store the complete redacted response before replacing its inline view.
        // Keep the original tool success/failure; delivery overflow isn't a reason
        // to execute a potentially side-effecting tool a second time.
        const safeResult = redactObject(cloneJson(result));
        const storedText = JSON.stringify(safeResult);
        let stored = null;
        try {
            const capture = await this.outputStore.createCapture({
                metadata: { tool: toolId, callId, kind: 'tool_response', inlineLimitBytes: limit }
            });
            capture.append('stdout', storedText);
            stored = await capture.finalize({ status: 'completed' });
            // Capture append errors can be swallowed by the existing log store.
            // Never advertise a complete archive without verifying its byte count.
            if ((await fsp.stat(stored.path)).size !== Buffer.byteLength(storedText, 'utf8')) {
                stored = null;
            }
        } catch {
            stored = null;
        }
        const content = Array.isArray(safeResult.content) ? safeResult.content : [];
        const text = content.filter((item) => typeof item?.text === 'string')
            .map((item) => item.text).join('\n\n');
        const preview = makeHeadTailPreview(text || 'Structured response saved as JSON.', 8000);
        let mediaBytes = 0;
        let archivedMediaBlocks = 0;
        const media = content.filter((item) => item && item.type !== 'text').filter((item) => {
            const bytes = Buffer.byteLength(JSON.stringify(item), 'utf8');
            if (mediaBytes + bytes > TOOL_INLINE_MEDIA_BYTES) {
                archivedMediaBlocks += 1;
                return false;
            }
            mediaBytes += bytes;
            return true;
        });
        const reference = {
            schema: 'ailis.tool_output_reference.v1',
            status: safeResult.details?.status || (safeResult.isError ? 'error' : 'completed'),
            tool: toolId,
            outputDelivery: stored ? 'artifact' : 'archive_failed',
            truncated: true,
            originalBytes: Buffer.byteLength(storedText, 'utf8'),
            inlineLimitBytes: limit,
            ...(archivedMediaBlocks ? { omittedMediaBlocks: archivedMediaBlocks, inlineMediaLimitBytes: TOOL_INLINE_MEDIA_BYTES } : {}),
            ...(stored ? {
                outputId: stored.outputId,
                outputRef: {
                    outputId: stored.outputId,
                    read: { tool: 'output_read', args: { outputId: stored.outputId, offset: 0, limit: 6000 } },
                    search: { tool: 'output_search', args: { outputId: stored.outputId, query: '<text>' } }
                }
            } : { outputDeliveryError: 'tool_output_archive_failed', fullOutputAvailable: false })
        };
        const bounded = {
            isError: safeResult.isError === true,
            content: [{
                type: 'text',
                text: `${stored
                    ? 'TOOL_OUTPUT_STORED: full response saved; this is only a preview.'
                    : 'TOOL_OUTPUT_ARCHIVE_FAILED: only a preview is available. The tool already executed; this delivery error does not mean the action failed.'}\n${JSON.stringify(reference)}\n\n${preview.text}`,
                truncated: true
            }, ...media],
            details: reference,
            structuredContent: { ...reference }
        };
        return bounded;
    }

    guardToolResult(result, { toolId = '', callId = '', maxTextChars } = {}) {
        // Permissions/EMBER remain at their existing call boundaries. Keep
        // field redaction here, but do not re-budget or trim tool-owned data.
        const guarded = normalizeAilisToolOutput(redactObject(cloneJson(result)), {
            toolId,
            maxTextChars
        });
        guarded.details.guard = {
            status: 'guarded',
            tool: toolId,
            callId,
            ...(maxTextChars !== undefined ? { maxTextChars } : {})
        };
        return guarded;
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
            if (['spawn_agent', 'followup_task', 'wait_agent', 'list_agents', 'close_agent'].includes(toolId)) {
                return {
                    class: 'agent_control',
                    mutates: false,
                    requiresApprovalCapable: false,
                    action: toolId
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
            if (typeof args.input === 'string') {
                return { class: 'readonly_scoped', mutates: false, requiresApprovalCapable: false, action: 'code_mode_orchestration' };
            }
            const command = normalizeString(args.cmd || args.command);
            if (command.includes('*** Begin Patch') && command.includes('*** End Patch')) {
                return { class: 'mutating', mutates: true, requiresApprovalCapable: false, action: 'apply_patch_intercept' };
            }
        }
        if (toolId === 'write_stdin') {
            const chars = typeof args.chars === 'string'
                ? args.chars
                : typeof args.input === 'string'
                ? args.input
                : '';
            return chars
                ? { class: 'exec_capable', mutates: true, requiresApprovalCapable: true, action }
                : { class: 'readonly_scoped', mutates: false, requiresApprovalCapable: false, action };
        }
        if (toolId === 'exec_wait') {
            return { class: 'readonly_scoped', mutates: false, requiresApprovalCapable: false, action: args.terminate === true ? 'terminate_code_mode_cell' : 'wait_code_mode_cell' };
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
            return { class: 'vision_readonly', mutates: false, requiresApprovalCapable: false, action };
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
        const modelView = { status: 'completed' };
        return {
            content: [{ type: 'text', text: 'Plan updated.' }],
            structuredContent: modelView,
            details: modelView
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

    drain_mailbox_input_items(context = {}) {
        return this.agent_control.get_pending_input(context);
    }

    async appendAgentTranscriptEvent(agent = {}, event = {}) {
        const payload = {
            parentRunId: agent.runId,
            parentSessionId: agent.sessionId,
            agentId: agent.id,
            agentPath: agent.agent_path,
            childRunId: agent.childRunId,
            childSessionId: agent.childSessionId,
            task: agent.originalTask || agent.task,
            message: normalizeString(event.message),
            ...(event.payload && typeof event.payload === 'object' ? event.payload : {})
        };
        this.emitGatewayEvent('subagent.event', {
            runId: agent.runId,
            parentRunId: agent.runId,
            parentSessionId: agent.sessionId,
            subagentId: agent.id,
            childRunId: agent.childRunId,
            sessionId: agent.childSessionId,
            childSessionId: agent.childSessionId,
            type: event.type,
            status: normalizeString(event.status, agent.status),
            message: normalizeString(event.message),
            task: agent.originalTask || agent.task,
            payload
        });
        if (!agent.runId) {
            return null;
        }
        return await this.appendItem(agent.runId, {
            type: normalizeString(event.type, 'agent.event'),
            sessionId: agent.sessionId,
            status: normalizeString(event.status, agent.status),
            payload
        });
    }

    buildAgentContext(agent = {}, args = {}, context = {}) {
        const parentAgentDepth = Math.max(0, Number(context.agentDepth || context.parentAgentDepth || 0) || 0);
        const inheritanceMode = ['clean', 'recent', 'checkpoint'].includes(normalizeString(
            args.inheritanceMode || agent.inheritanceMode,
            'clean'
        ).toLowerCase())
            ? normalizeString(args.inheritanceMode || agent.inheritanceMode, 'clean').toLowerCase()
            : 'clean';
        return {
            permissionProfile: context.permissionProfile || context.permissions || context.policy || context.sandbox,
            approvalPolicy: context.approvalPolicy || context.confirmationPolicy,
            toolPolicy: context.toolPolicy,
            workspace: context.workspace || this.workspaceRoot,
            llmSettings: context.llmSettings || context.llm,
            emailProfiles: context.emailProfiles || context.emailAccounts,
            visionPermissionPolicy: context.visionPermissionPolicy || context.visionPolicy,
            computerControlEnabled: context.computerControlEnabled,
            approved: context.approved === true,
            autoConfirm: context.autoConfirm === true,
            ...(args.context && typeof args.context === 'object' ? args.context : {}),
            parentRunId: agent.runId,
            parentSessionId: agent.sessionId,
            agentId: agent.id,
            agentLabel: agent.label,
            agentPath: agent.agent_path,
            sessionId: agent.childSessionId,
            sessionKey: agent.childSessionId,
            planner: normalizeString(args.planner || context.planner, 'llm'),
            agentLoop: normalizeString(args.agentLoop || context.agentLoop, 'llm'),
            agentMode: normalizeString(args.agentMode || context.agentMode, 'llm'),
            contextMode: 'task_agent',
            cleanContext: inheritanceMode === 'clean',
            taskAgentInheritanceMode: inheritanceMode,
            initialContextManagerCheckpoint: inheritanceMode === 'checkpoint'
                ? args.contextManagerCheckpoint || null
                : null,
            recentMessages: inheritanceMode === 'recent' && Array.isArray(args.recentMessages)
                ? args.recentMessages.slice(-Math.max(1, Math.min(Number(args.recentTurns || 4), 12)))
                : [],
            attachments: Array.isArray(context.attachments)
                ? cloneJson(context.attachments)
                : Array.isArray(context.fileAttachments)
                    ? cloneJson(context.fileAttachments)
                    : [],
            fileAttachments: Array.isArray(context.fileAttachments)
                ? cloneJson(context.fileAttachments)
                : Array.isArray(context.attachments)
                    ? cloneJson(context.attachments)
                    : [],
            parentUserGoal: normalizeString(
                context.parentUserGoal ||
                context.parent_user_goal ||
                args.parentUserGoal ||
                args.parent_user_goal
            ),
            parentAgentDepth,
            agentDepth: parentAgentDepth + 1
        };
    }

    buildAgentErrorResult(agent = {}, status = 'failed', error = '', durationMs = 0) {
        const taskRunHandoff = buildSubagentErrorHandoff({
            subagent: {
                task: agent.task,
                childRunId: agent.childRunId,
                childSessionId: agent.childSessionId
            },
            status,
            error,
            durationMs
        });
        return redactObject({
            ok: false,
            status,
            error,
            displayText: taskRunHandoff.userVisibleSummary,
            taskRunHandoff
        });
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
