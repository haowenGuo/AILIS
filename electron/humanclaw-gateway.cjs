const http = require('http');
const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');
const { EventEmitter } = require('events');
const { randomUUID } = require('crypto');
const { pathToFileURL } = require('url');

const {
    OPENCLAW_CORE_TOOL_DEFINITIONS,
    OPENCLAW_OPTIONAL_RUNTIME_TOOL_DEFINITIONS,
    OPENCLAW_CHANNEL_MCP_TOOL_DEFINITIONS,
    getOpenClawToolSurfaceSummary,
    validateOpenClawToolSurface
} = require('./openclaw-tool-surface.cjs');
const { OpenClawRuntimeSupervisor } = require('./openclaw-runtime.cjs');
const { HumanClawRuntime, RUNTIME_TOOL_IDS } = require('./humanclaw-runtime.cjs');
const { HumanClawAgentRunner } = require('./humanclaw-agent-runner.cjs');
const { HumanClawMemoryRuntime } = require('./humanclaw-memory-store.cjs');
const {
    listToolContracts,
    validateToolContract
} = require('./humanclaw-tool-contracts.cjs');
const { EMAIL_TOOL_ID, executeEmailTool, listProviderDetails } = require('./humanclaw-email-tool.cjs');
const { FILE_MANAGER_TOOL_ID, executeFileManagerTool } = require('./humanclaw-file-manager-tool.cjs');
const { COMPUTER_TOOL_ID, HumanClawComputerTool } = require('./humanclaw-computer-tool.cjs');
const { CODE_TOOL_ID, executeCodeTool } = require('./humanclaw-code-tool.cjs');
const {
    HUMANCLAW_VISION_TOOL_DEFINITION,
    VISION_TOOL_ID,
    executeVisionTool
} = require('./humanclaw-vision-tool.cjs');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const DEFAULT_PORT = Number(process.env.HUMANCLAW_GATEWAY_PORT || 19777);
const DEFAULT_TOOL_GATEWAY_URL =
    process.env.HUMANCLAW_TOOL_OPENCLAW_GATEWAY_URL || 'ws://127.0.0.1:18789';
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
const LOCAL_CORE_TOOL_IDS = new Set(['read', 'write', 'exec']);
const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);
const LOSSLESS_EVENT_TYPES = new Set([
    'gateway.started',
    'gateway.stopped',
    'runtime.item',
    'tool.call.started',
    'tool.call.finished',
    'agent.run.started',
    'agent.run.finished',
    'agent.step.started',
    'agent.step.finished',
    'agent.plan.updated',
    'subagent.event',
    'mcp.tool.call.begin',
    'mcp.tool.call.end',
    'mcp.resource.read.begin',
    'mcp.resource.read.end'
]);
const LOSSLESS_EVENT_PREFIXES = ['approval.', 'subagent.', 'mcp.', 'agent.'];
const HUMANCLAW_LOCAL_TOOL_DEFINITIONS = Object.freeze([
    Object.freeze({
        id: EMAIL_TOOL_ID,
        label: 'email',
        description: 'Manage QQ Mail, Gmail, and Outlook mailboxes through IMAP/SMTP.',
        sectionId: 'email',
        route: 'humanclaw-local',
        materialized: true,
        status: 'available',
        needsApprovalActions: Object.freeze(['send', 'mark_read', 'mark_unread', 'move', 'delete'])
    }),
    Object.freeze({
        id: FILE_MANAGER_TOOL_ID,
        label: 'file_manager',
        description: 'Scan, organize, and safely clean junk files with dry-run and quarantine-first execution.',
        sectionId: 'file-management',
        route: 'humanclaw-local',
        materialized: true,
        status: 'available',
        needsApprovalActions: Object.freeze(['clean', 'organize'])
    }),
    Object.freeze({
        id: COMPUTER_TOOL_ID,
        label: 'computer',
        description: 'Full local computer operation layer: filesystem, binary streams, watchers, rollback, shell sessions, and optional PTY.',
        sectionId: 'computer',
        route: 'humanclaw-local',
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
            'session_start',
            'pty_start',
            'pty_write',
            'pty_kill',
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
        route: 'humanclaw-local',
        materialized: true,
        status: 'available',
        needsApprovalActions: Object.freeze(['git_commit', 'rename_symbol', 'test', 'pr_create'])
    }),
    HUMANCLAW_VISION_TOOL_DEFINITION
]);

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
    const root = path.resolve(rootPath);
    const target = path.resolve(targetPath);
    const rootComparable = process.platform === 'win32' ? root.toLowerCase() : root;
    const targetComparable = process.platform === 'win32' ? target.toLowerCase() : target;
    return (
        targetComparable === rootComparable ||
        targetComparable.startsWith(`${rootComparable}${path.sep}`)
    );
}

function summarize(value, maxChars = 600) {
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

function createTimeoutError(ms) {
    const error = new Error(`tool call timeout after ${ms}ms`);
    error.code = 'HUMANCLAW_GATEWAY_TIMEOUT';
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

function classifyError(error) {
    const message = error instanceof Error ? error.message : String(error);
    if (error?.code === 'HUMANCLAW_GATEWAY_APPROVAL_REQUIRED') {
        return 'needs_approval';
    }
    if (error?.code === 'HUMANCLAW_GATEWAY_BLOCKED') {
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

function throwBlocked(message, details = undefined) {
    const error = new Error(message);
    error.code = 'HUMANCLAW_GATEWAY_BLOCKED';
    error.details = details;
    throw error;
}

function throwApprovalRequired(message, details = undefined) {
    const error = new Error(message);
    error.code = 'HUMANCLAW_GATEWAY_APPROVAL_REQUIRED';
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

class HumanClawGateway extends EventEmitter {
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
                    ? path.join(this.app.getPath('userData'), 'humanclaw-gateway')
                    : path.join(this.projectRoot, 'tmp', 'humanclaw-gateway'))
        );
        this.auditLogPath = path.join(this.auditDir, 'audit.jsonl');
        this.smokeReportPath = path.join(this.projectRoot, 'tmp', 'openclaw-tool-smoke', 'last-report.json');
        this.runtime = new HumanClawRuntime({
            auditDir: this.auditDir,
            workspaceRoot: this.workspaceRoot,
            projectRoot: this.projectRoot,
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
        this.computerTool = new HumanClawComputerTool({
            workspaceRoot: this.workspaceRoot
        });
        this.getEmailProfiles = typeof options.getEmailProfiles === 'function'
            ? options.getEmailProfiles
            : () => options.emailProfiles || {};
        this.getDefaultToolContext = typeof options.getDefaultContext === 'function'
            ? options.getDefaultContext
            : () => options.defaultContext || {};
        this.visionServices = options.visionServices || {};
        this.memoryRuntime = options.memoryRuntime || new HumanClawMemoryRuntime({
            rootDir: path.join(this.auditDir, 'memory'),
            workspaceRoot: this.workspaceRoot
        });
        this.agentRunner = null;
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
        return {
            enabled: true,
            running: Boolean(this.server),
            startedAt: this.startedAt,
            host: address.host,
            port: address.port,
            url: address.url,
            workspaceRoot: this.workspaceRoot,
            auditLogPath: this.auditLogPath,
            toolGatewayUrl: this.toolGatewayUrl,
            openClawToolSurface: getOpenClawToolSurfaceSummary(),
            openClawToolSurfaceValidation: validateOpenClawToolSurface().summary,
            toolContracts: {
                version: 1,
                count: listToolContracts().length
            },
            defaultContext: redactObject(this.resolveDefaultContext()),
            runtime: this.runtime.getStatus(),
            memory: this.memoryRuntime?.getStatus?.() || null,
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
            this.agentRunner = new HumanClawAgentRunner({
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
                req.headers['x-humanclaw-event-cursor'],
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
        const materialized = shouldMaterialize
            ? await this.listMaterializedToolIds().catch(() => [])
            : [...RUNTIME_TOOL_IDS];
        const materializedSet = new Set(materialized);
        const coreTools = OPENCLAW_CORE_TOOL_DEFINITIONS.map((tool) => ({
            id: tool.id,
            label: tool.label,
            description: tool.description,
            sectionId: tool.sectionId,
            route: this.resolveToolRoute(tool.id),
            status: RUNTIME_TOOL_IDS.has(tool.id)
                ? 'available'
                : smoke.map.get(tool.id)?.status || this.defaultToolStatus(tool.id, materializedSet),
            materialized:
                RUNTIME_TOOL_IDS.has(tool.id) ||
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
        const runtimeTools = this.runtime.getRuntimeToolDefinitions();
        const localTools = HUMANCLAW_LOCAL_TOOL_DEFINITIONS.map((tool) => ({
            ...tool,
            providers: tool.id === EMAIL_TOOL_ID ? listProviderDetails() : undefined
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
        if (this.runtime.canExecuteTool(toolId)) {
            return 'humanclaw-runtime';
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
        return [...new Set([...tools.keys(), ...RUNTIME_TOOL_IDS])];
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
            const contractValidation = validateToolContract(toolId, args);
            if (!contractValidation.ok) {
                throw new GatewayHttpError(400, 'invalid_tool_args', 'tool arguments failed contract validation', {
                    tool: toolId,
                    contract: contractValidation.contract,
                    errors: contractValidation.errors
                });
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
            const policyDecision = this.runtime.evaluateToolCall({ toolId, args, context, workspaceDir });
            if (policyDecision.denied) {
                throwBlocked(`tool call blocked by HumanClaw runtime policy: ${policyDecision.reason}`, {
                    tool: toolId,
                    reason: policyDecision.reason,
                    policy: policyDecision.policy,
                    classification: policyDecision.classification
                });
            }
            if (policyDecision.needsApproval) {
                throwApprovalRequired(`tool call requires approval by HumanClaw runtime policy: ${policyDecision.reason}`, {
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
            }
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
            }
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
            maxAgentSteps: Number(args.maxAgentSteps || context.maxAgentSteps || 6),
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
                maxAgentSteps: Number(args.maxAgentSteps || context.maxAgentSteps || 6)
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

    async callOpenClawTool({ toolId, args, context, workspaceDir }) {
        if (toolId === EMAIL_TOOL_ID) {
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
            return await this.computerTool.execute(args, context, {
                workspaceDir,
                workspaceRoot: this.workspaceRoot,
                projectRoot: this.projectRoot
            });
        }
        if (toolId === CODE_TOOL_ID) {
            return await executeCodeTool(args, context, {
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
        if (this.runtime.canExecuteTool(toolId)) {
            return await this.runtime.executeTool(toolId, args, {
                ...context,
                workspace: workspaceDir
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
            return await this.withDefaultOpenClawGatewayEnv(() => tool.execute(`humanclaw-${toolId}`, finalArgs));
        }
        return await tool.execute(`humanclaw-${toolId}`, finalArgs);
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

    async executeLocalCoreTool({ toolId, args, context, workspaceDir }) {
        if (toolId === 'read') {
            const target = this.resolveToolPath(args.path, workspaceDir, 'path');
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

        if (toolId === 'exec') {
            const finalArgs = this.prepareToolArgs({ toolId, args, context, workspaceDir });
            return await this.computerTool.execute(
                {
                    action: 'exec',
                    command: finalArgs.command || finalArgs.cmd,
                    workdir: finalArgs.workdir,
                    timeoutMs: finalArgs.timeoutMs || finalArgs.timeout,
                    maxOutputBytes: finalArgs.maxOutputBytes,
                    env: finalArgs.env
                },
                context,
                {
                    workspaceDir,
                    workspaceRoot: this.workspaceRoot,
                    projectRoot: this.projectRoot
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
                throwApprovalRequired('exec requires context.approved=true in HumanClaw Gateway v0', {
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
            throwBlocked('workspace must stay inside the configured HumanClaw workspace root', {
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
        const priorAigrilOpenClawGatewayUrl = process.env.AIGRIL_OPENCLAW_GATEWAY_URL;
        try {
            delete process.env.OPENCLAW_GATEWAY_URL;
            delete process.env.AIGRIL_OPENCLAW_GATEWAY_URL;
            return await action();
        } finally {
            if (priorOpenClawGatewayUrl === undefined) {
                delete process.env.OPENCLAW_GATEWAY_URL;
            } else {
                process.env.OPENCLAW_GATEWAY_URL = priorOpenClawGatewayUrl;
            }
            if (priorAigrilOpenClawGatewayUrl === undefined) {
                delete process.env.AIGRIL_OPENCLAW_GATEWAY_URL;
            } else {
                process.env.AIGRIL_OPENCLAW_GATEWAY_URL = priorAigrilOpenClawGatewayUrl;
            }
        }
    }

    async appendAudit(entry) {
        await fsp.mkdir(this.auditDir, { recursive: true });
        const line = JSON.stringify({
            ts: Date.now(),
            iso: new Date().toISOString(),
            ...entry,
            argsPreview: summarize(entry.args),
            contextPreview: summarize(entry.context)
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
}

module.exports = {
    DEFAULT_PORT,
    HumanClawGateway
};
