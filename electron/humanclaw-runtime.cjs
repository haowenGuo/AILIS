const fsp = require('fs/promises');
const path = require('path');
const { randomUUID } = require('crypto');
const { HumanClawMcpManager } = require('./humanclaw-mcp-session.cjs');
const { getToolContractPromptText } = require('./humanclaw-tool-contracts.cjs');

const DEFAULT_MAX_RESULT_TEXT_CHARS = 12000;
const DEFAULT_MAX_TRANSCRIPT_ITEMS = 500;
const DEFAULT_SUBAGENT_WAIT_TIMEOUT_MS = 30000;
const DEFAULT_SUBAGENT_RUN_TIMEOUT_MS = 15 * 60 * 1000;

const RUNTIME_TOOL_DEFINITIONS = Object.freeze([
    Object.freeze({
        id: 'update_plan',
        label: 'update_plan',
        description: 'Update the visible agent plan as a first-class runtime tool.',
        sectionId: 'runtime',
        route: 'humanclaw-runtime',
        materialized: true,
        status: 'available',
        needsApproval: false
    }),
    Object.freeze({
        id: 'subagents',
        label: 'subagents',
        description: 'Spawn, wait, cancel, and inspect child Agent runs through the HumanClaw runtime transcript.',
        sectionId: 'runtime',
        route: 'humanclaw-runtime',
        materialized: true,
        status: 'available',
        needsApprovalActions: Object.freeze(['spawn', 'create', 'send', 'close'])
    }),
    Object.freeze({
        id: 'mcp_bridge',
        label: 'mcp_bridge',
        description: 'Manage configured MCP servers and execute tools/resources/prompts through stdio or HTTP MCP sessions.',
        sectionId: 'runtime',
        route: 'humanclaw-runtime',
        materialized: true,
        status: 'available',
        needsApprovalActions: Object.freeze(['tool_call'])
    })
]);

const RUNTIME_TOOL_IDS = new Set(RUNTIME_TOOL_DEFINITIONS.map((tool) => tool.id));
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
    'process_read'
]);
const COMPUTER_EXEC_ACTIONS = new Set([
    'exec',
    'run',
    'session_start',
    'pty_start',
    'pty_write',
    'pty_kill',
    'process_write',
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
    text = text.replace(/\s+/g, ' ').trim();
    return text.length > maxChars ? `${text.slice(0, maxChars - 3)}...` : text;
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
        if (/token|password|secret|api[_-]?key|authorization|credential|pass|auth[_-]?code/i.test(key)) {
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

class HumanClawRuntime {
    constructor(options = {}) {
        this.workspaceRoot = path.resolve(options.workspaceRoot || process.cwd());
        this.projectRoot = path.resolve(options.projectRoot || this.workspaceRoot);
        this.auditDir = path.resolve(options.auditDir || path.join(this.projectRoot, 'tmp', 'humanclaw-gateway'));
        this.transcriptDir = path.join(this.auditDir, 'transcripts');
        this.emitGatewayEvent = typeof options.emitGatewayEvent === 'function' ? options.emitGatewayEvent : () => {};
        this.subagentExecutor = typeof options.subagentExecutor === 'function' ? options.subagentExecutor : null;
        this.runs = new Map();
        this.planState = new Map();
        this.subagents = new Map();
        this.subagentRuns = new Map();
        this.subagentControllers = new Map();
        this.mcpManager = new HumanClawMcpManager({
            workspaceRoot: this.workspaceRoot,
            projectRoot: this.projectRoot,
            emitGatewayEvent: (type, payload) => this.emitGatewayEvent(type, payload),
            defaultServers: options.mcpServers,
            configPath: options.mcpConfigPath
        });
    }

    getStatus() {
        return {
            enabled: true,
            version: 'v1',
            transcriptDir: this.transcriptDir,
            activeTranscriptRuns: this.runs.size,
            planStateCount: this.planState.size,
            subagentCount: this.subagents.size,
            mcpServerCount: this.mcpManager.getStatus().serverCount,
            mcp: this.mcpManager.getStatus(),
            runtimeTools: RUNTIME_TOOL_DEFINITIONS.map((tool) => tool.id),
            permissionDefaults: {
                fileSystem: 'workspace-write',
                shell: 'approval-required',
                approvalPolicy: 'on-request'
            },
            capabilities: [
                'formal_item_transcript',
                'update_plan_tool',
                'permission_policy_evaluation',
                'tool_result_guard',
                'tool_result_repair',
                'subagent_child_runner',
                'mcp_stdio_session_manager',
                'mcp_http_session_manager',
                'mcp_config_store',
                'mcp_health_check',
                'mcp_prompt_calls',
                'mcp_input_schema_validation',
                'mcp_tool_and_resource_calls'
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
        return RUNTIME_TOOL_DEFINITIONS.map((tool) => ({ ...tool }));
    }

    canExecuteTool(toolId) {
        return RUNTIME_TOOL_IDS.has(toolId);
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
                                text: 'Tool result was missing from transcript; HumanClaw runtime inserted a repair item.'
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
        guarded.details.guard = {
            status: 'guarded',
            tool: toolId,
            callId,
            maxTextChars
        };
        return guarded;
    }

    classifyToolCall({ toolId, args = {} } = {}) {
        const action = normalizeAction(args.action || args.operation || args.intent || args.command);
        if (RUNTIME_TOOL_IDS.has(toolId)) {
            if (toolId === 'update_plan') {
                return {
                    class: 'control_plane',
                    mutates: false,
                    requiresApprovalCapable: false,
                    action
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
        if (EXEC_TOOLS.has(toolId)) {
            return { class: 'exec_capable', mutates: true, requiresApprovalCapable: true, action };
        }
        if (toolId === 'computer') {
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

    evaluateToolCall({ toolId, args = {}, context = {} } = {}) {
        const policy = normalizePermissionProfile(context);
        const classification = this.classifyToolCall({ toolId, args, context });
        const deniedReasons = [];
        if (isReadOnlyProfile(policy) && classification.mutates) {
            deniedReasons.push('permission_profile_read_only');
        }
        if (policy.shell === 'none' && classification.class === 'exec_capable') {
            deniedReasons.push('shell_access_disabled');
        }
        if (policy.network === 'none' && ['external', 'mcp'].includes(classification.class)) {
            deniedReasons.push('network_access_disabled');
        }
        if (
            policy.approvalPolicy === 'never' &&
            context.approved !== true &&
            classification.requiresApprovalCapable === true
        ) {
            deniedReasons.push('approval_not_allowed_by_policy');
        }
        const base = {
            ok: deniedReasons.length === 0,
            denied: deniedReasons.length > 0,
            needsApproval: false,
            reason: deniedReasons[0] || '',
            policy,
            classification
        };
        if (base.denied) {
            return base;
        }
        const requiresApproval = needsApprovalByPolicy(
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

    async executeTool(toolId, args = {}, context = {}) {
        if (toolId === 'update_plan') {
            return await this.updatePlan({
                runId: context.runId || args.runId,
                sessionId: context.sessionId || context.sessionKey || args.sessionId || 'main',
                plan: args.plan || args.items || args.steps || args.todos || [],
                explanation: args.explanation || args.summary || ''
            });
        }
        if (toolId === 'subagents') {
            return await this.executeSubagentRelay(args, context);
        }
        if (toolId === 'mcp_bridge') {
            return await this.executeMcpBridge(args, context);
        }
        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify({ status: 'not_materialized', tool: toolId }, null, 2)
                }
            ],
            isError: true,
            details: {
                status: 'not_materialized',
                tool: toolId
            }
        };
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
            maxAgentSteps: Number(args.maxAgentSteps || context.maxAgentSteps || 6)
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
            const tool = normalizeString(args.tool || args.name);
            await this.appendItem(runId, {
                type: 'mcp.tool.call.begin',
                sessionId,
                status: 'started',
                payload: {
                    server,
                    tool,
                    args: args.args || args.arguments || {}
                }
            });
            try {
                const result = await this.mcpManager.callTool({
                    server,
                    tool,
                    args: args.args || args.arguments || {},
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
    HumanClawRuntime,
    RUNTIME_TOOL_DEFINITIONS,
    RUNTIME_TOOL_IDS
};
