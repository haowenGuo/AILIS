'use strict';

const fs = require('fs');
const path = require('path');
const { createHash, randomUUID } = require('crypto');
const { AILISGateway } = require('./ailis-gateway.cjs');
const { callDesktopLlmProvider } = require('./desktop-llm-provider.cjs');

const DEFAULT_MAX_ACTIVE_TENANTS = 6;
const DEFAULT_IDLE_TTL_MS = 30 * 60 * 1000;
const DEFAULT_EVENT_LOG_LIMIT = 1000;
const DEFAULT_MAX_ATTACHMENT_BYTES = 25 * 1024 * 1024;
const DEFAULT_MAX_TENANT_ATTACHMENT_BYTES = 128 * 1024 * 1024;
const DEFAULT_ATTACHMENT_TTL_MS = 7 * 24 * 60 * 60 * 1000;

function normalizeString(value, fallback = '') {
    const text = typeof value === 'string' ? value.trim() : '';
    return text || fallback;
}

function boundedInteger(value, fallback, minimum, maximum) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) {
        return fallback;
    }
    return Math.max(minimum, Math.min(Math.trunc(numeric), maximum));
}

function tenantKey(tenantId = '') {
    const normalized = normalizeString(tenantId);
    if (!normalized || normalized.length > 512) {
        throw new Error('tenant_id_invalid');
    }
    return createHash('sha256').update(normalized).digest('hex');
}

function sanitizeAttachmentFilename(value = '') {
    const normalized = normalizeString(value, 'attachment.bin')
        .normalize('NFKC')
        .replace(/[<>:"/\\|?*\u0000-\u001f]/g, '_')
        .replace(/\s+/g, ' ')
        .replace(/^\.+|\.+$/g, '')
        .slice(0, 140);
    return normalized || 'attachment.bin';
}

function attachmentSessionKey(sessionId = 'main') {
    return createHash('sha256')
        .update(normalizeString(sessionId, 'main'))
        .digest('hex')
        .slice(0, 16);
}

async function listRegularFiles(rootDir) {
    const entries = await fs.promises.readdir(rootDir, { withFileTypes: true }).catch(() => []);
    const files = [];
    for (const entry of entries) {
        const entryPath = path.join(rootDir, entry.name);
        if (entry.isDirectory()) {
            files.push(...await listRegularFiles(entryPath));
            continue;
        }
        if (!entry.isFile()) {
            continue;
        }
        const stat = await fs.promises.stat(entryPath).catch(() => null);
        if (stat) {
            files.push({ path: entryPath, stat });
        }
    }
    return files;
}

function resolveHostedLlmSettings(env = process.env) {
    return {
        provider: normalizeString(env.AILIS_AGENT_LLM_PROVIDER, 'openai-compatible'),
        baseUrl: normalizeString(
            env.AILIS_LLM_BASE_URL || env.AILIS_AGENT_LLM_BASE_URL || env.LLM_API_BASE,
            'https://api.deepseek.com'
        ),
        apiKey: normalizeString(env.AILIS_LLM_API_KEY || env.AILIS_AGENT_LLM_API_KEY || env.LLM_API_KEY),
        model: normalizeString(
            env.AILIS_LLM_MODEL || env.AILIS_AGENT_LLM_MODEL || env.LLM_MODEL_NAME,
            'deepseek-chat'
        ),
        timeoutMs: boundedInteger(
            env.AILIS_AGENT_LLM_TIMEOUT_MS,
            300000,
            10000,
            900000
        )
    };
}

function sanitizeHostedLlmRequest(payload = {}) {
    const input = payload && typeof payload === 'object' ? payload : {};
    const sourceMessages = Array.isArray(input.messages) ? input.messages : [];
    const pinnedMessages = sourceMessages
        .filter((message) => ['system', 'developer'].includes(String(message?.role || '').toLowerCase()))
        .slice(0, 8);
    const recentMessages = sourceMessages.slice(-312);
    const messages = [...pinnedMessages, ...recentMessages]
        .filter((message, index, all) => all.indexOf(message) === index)
        .slice(-320);
    if (!messages.length) {
        throw Object.assign(new Error('llm_messages_required'), { statusCode: 400 });
    }

    const temperature = Number(input.temperature);
    const maxTokens = Number(input.max_tokens ?? input.max_completion_tokens);
    const reasoningEffort = normalizeString(input.reasoning_effort).toLowerCase();
    const allowedReasoningEffort = new Set(['none', 'minimal', 'low', 'medium', 'high', 'xhigh']);
    const thinkingType = normalizeString(input.thinking?.type).toLowerCase();
    const allowedThinkingTypes = new Set(['enabled', 'disabled', 'auto']);

    return {
        messages,
        tools: Array.isArray(input.tools) ? input.tools.slice(0, 128) : [],
        tool_choice: input.tool_choice,
        responseFormat: input.response_format,
        temperature: Number.isFinite(temperature) ? Math.max(0, Math.min(temperature, 2)) : undefined,
        max_tokens: Number.isFinite(maxTokens) ? Math.max(1, Math.min(Math.trunc(maxTokens), 32768)) : undefined,
        parallel_tool_calls: typeof input.parallel_tool_calls === 'boolean'
            ? input.parallel_tool_calls
            : undefined,
        reasoning_effort: allowedReasoningEffort.has(reasoningEffort) ? reasoningEffort : undefined,
        thinking: allowedThinkingTypes.has(thinkingType) ? { type: thinkingType } : undefined
    };
}

function sanitizeAgentRequest(payload = {}, record) {
    const input = payload && typeof payload === 'object' ? payload : {};
    const sanitizedInput = { ...input };
    const context = input.context && typeof input.context === 'object'
        ? { ...input.context }
        : {};
    for (const key of [
        'workspace',
        'workspaceDir',
        'workspaceRoot',
        'projectRoot',
        'llm',
        'llmSettings',
        'approved',
        'autoConfirm',
        'fullControl'
    ]) {
        delete sanitizedInput[key];
        delete context[key];
    }

    const maxAgentSteps = boundedInteger(
        input.maxAgentSteps ?? context.maxAgentSteps,
        4,
        1,
        12
    );
    const messageHistory = Array.isArray(input.messageHistory)
        ? input.messageHistory.slice(-240)
        : [];
    const sessionId = normalizeString(input.sessionId || input.sessionKey, 'main').slice(0, 160);
    const agentRole = normalizeString(
        input.agentRole ||
        input.agent_role ||
        context.agentRole ||
        context.agent_role,
        'persona_orchestrator'
    ).slice(0, 80);

    return {
        ...sanitizedInput,
        runId: normalizeString(input.runId).slice(0, 160),
        sessionId,
        sessionKey: sessionId,
        messageHistory,
        attachments: Array.isArray(input.attachments) ? input.attachments.slice(0, 12) : [],
        agentLoop: 'llm',
        planner: 'llm',
        directToolExecutor: true,
        maxAgentSteps,
        agentRole,
        llmSettings: { ...record.llmSettings },
        context: {
            ...context,
            hostedRuntime: true,
            agentLoop: 'llm',
            planner: 'llm',
            directToolExecutor: true,
            maxAgentSteps,
            agentRole,
            workspace: record.workspaceRoot,
            workspaceDir: record.workspaceRoot,
            workspaceRoot: record.workspaceRoot,
            projectRoot: record.projectRoot,
            taskAgentRoutingOwned: true,
            deferTaskHandoff: false,
            llmSettings: { ...record.llmSettings }
        }
    };
}

class AILISHostedRuntimeManager {
    constructor(options = {}) {
        this.dataRoot = path.resolve(
            options.dataRoot ||
            process.env.AILIS_HOSTED_DATA_ROOT ||
            path.join(process.cwd(), '.ailis-state', 'hosted')
        );
        this.projectRoot = path.resolve(options.projectRoot || path.join(__dirname, '..'));
        this.maxActiveTenants = boundedInteger(
            options.maxActiveTenants ?? process.env.AILIS_HOSTED_MAX_ACTIVE_TENANTS,
            DEFAULT_MAX_ACTIVE_TENANTS,
            1,
            64
        );
        this.idleTtlMs = boundedInteger(
            options.idleTtlMs ?? process.env.AILIS_HOSTED_IDLE_TTL_MS,
            DEFAULT_IDLE_TTL_MS,
            60000,
            24 * 60 * 60 * 1000
        );
        this.eventLogLimit = boundedInteger(
            options.eventLogLimit,
            DEFAULT_EVENT_LOG_LIMIT,
            100,
            10000
        );
        this.maxAttachmentBytes = boundedInteger(
            options.maxAttachmentBytes ?? process.env.AILIS_HOSTED_ATTACHMENT_MAX_BYTES,
            DEFAULT_MAX_ATTACHMENT_BYTES,
            1024,
            100 * 1024 * 1024
        );
        this.maxTenantAttachmentBytes = boundedInteger(
            options.maxTenantAttachmentBytes ?? process.env.AILIS_HOSTED_TENANT_ATTACHMENT_MAX_BYTES,
            DEFAULT_MAX_TENANT_ATTACHMENT_BYTES,
            this.maxAttachmentBytes,
            1024 * 1024 * 1024
        );
        this.attachmentTtlMs = boundedInteger(
            options.attachmentTtlMs ?? process.env.AILIS_HOSTED_ATTACHMENT_TTL_MS,
            DEFAULT_ATTACHMENT_TTL_MS,
            60 * 60 * 1000,
            90 * 24 * 60 * 60 * 1000
        );
        this.llmSettings = options.llmSettings || resolveHostedLlmSettings(options.env || process.env);
        this.gatewayFactory = typeof options.gatewayFactory === 'function'
            ? options.gatewayFactory
            : (gatewayOptions) => new AILISGateway(gatewayOptions);
        this.runtimes = new Map();
        this.eventLogs = new Map();
        this.eventSeq = new Map();
        this.attachmentWriteChains = new Map();
        fs.mkdirSync(this.dataRoot, { recursive: true });
    }

    createRuntimeRecord(tenantId) {
        const key = tenantKey(tenantId);
        const tenantRoot = path.join(this.dataRoot, 'tenants', key);
        const stateRoot = path.join(tenantRoot, 'state');
        const workspaceRoot = path.join(tenantRoot, 'workspace');
        fs.mkdirSync(stateRoot, { recursive: true });
        fs.mkdirSync(workspaceRoot, { recursive: true });

        const record = {
            key,
            tenantId,
            tenantRoot,
            stateRoot,
            workspaceRoot,
            projectRoot: this.projectRoot,
            llmSettings: { ...this.llmSettings },
            createdAt: Date.now(),
            lastUsedAt: Date.now(),
            activeRuns: 0,
            gateway: null,
            unsubscribe: null
        };
        const gateway = this.gatewayFactory({
            host: '127.0.0.1',
            port: 0,
            projectRoot: record.projectRoot,
            workspaceRoot,
            auditDir: stateRoot,
            emberHarnessEnabled: process.env.AILIS_HOSTED_EMBER_ENABLED === 'true',
            profileCurationEnabled: true,
            profileCurationLlm: (payload) => callDesktopLlmProvider(record.llmSettings, payload || {}),
            getDefaultContext: () => ({
                hostedRuntime: true,
                workspace: workspaceRoot,
                workspaceDir: workspaceRoot,
                workspaceRoot,
                projectRoot: record.projectRoot,
                taskAgentRoutingOwned: true,
                deferTaskHandoff: false,
                llmSettings: { ...record.llmSettings }
            })
        });
        record.gateway = gateway;
        const onEvent = (event) => {
            record.lastUsedAt = Date.now();
            this.recordEvent(key, event);
        };
        gateway.on?.('event', onEvent);
        record.unsubscribe = () => gateway.off?.('event', onEvent);
        gateway.startProfileCurationScheduler?.();
        return record;
    }

    async getRuntime(tenantId) {
        const key = tenantKey(tenantId);
        let record = this.runtimes.get(key);
        if (!record) {
            await this.evictIdleRuntimes({ reserveSlots: 1 });
            record = this.createRuntimeRecord(tenantId);
            this.runtimes.set(key, record);
        }
        record.lastUsedAt = Date.now();
        return record;
    }

    async storeAttachment(tenantId, payload = {}) {
        const key = tenantKey(tenantId);
        const previous = this.attachmentWriteChains.get(key) || Promise.resolve();
        const current = previous
            .catch(() => {})
            .then(() => this.storeAttachmentUnlocked(tenantId, payload));
        this.attachmentWriteChains.set(key, current);
        try {
            return await current;
        } finally {
            if (this.attachmentWriteChains.get(key) === current) {
                this.attachmentWriteChains.delete(key);
            }
        }
    }

    async storeAttachmentUnlocked(tenantId, payload = {}) {
        const record = await this.getRuntime(tenantId);
        const bytes = Buffer.isBuffer(payload.bytes)
            ? payload.bytes
            : Buffer.from(payload.bytes || []);
        if (!bytes.length) {
            throw Object.assign(new Error('attachment_empty'), { statusCode: 400 });
        }
        if (bytes.length > this.maxAttachmentBytes) {
            throw Object.assign(new Error('attachment_too_large'), {
                statusCode: 413,
                maxBytes: this.maxAttachmentBytes
            });
        }

        const sessionId = normalizeString(payload.sessionId, 'main').slice(0, 160);
        const uploadRoot = path.join(
            record.workspaceRoot,
            '.ailis-runtime',
            'uploads',
            attachmentSessionKey(sessionId)
        );
        await fs.promises.mkdir(uploadRoot, { recursive: true });

        const now = Date.now();
        const tenantUploadRoot = path.join(record.workspaceRoot, '.ailis-runtime', 'uploads');
        const existingFiles = await listRegularFiles(tenantUploadRoot);
        let retainedBytes = 0;
        for (const file of existingFiles) {
            if (now - file.stat.mtimeMs > this.attachmentTtlMs) {
                await fs.promises.rm(file.path, { force: true }).catch(() => {});
                continue;
            }
            retainedBytes += file.stat.size;
        }
        if (retainedBytes + bytes.length > this.maxTenantAttachmentBytes) {
            throw Object.assign(new Error('tenant_attachment_storage_full'), {
                statusCode: 413,
                maxBytes: this.maxTenantAttachmentBytes
            });
        }

        const originalName = sanitizeAttachmentFilename(payload.name);
        const storedName = `${Date.now()}-${randomUUID().slice(0, 12)}-${originalName}`;
        const targetPath = path.join(uploadRoot, storedName);
        await fs.promises.writeFile(targetPath, bytes, { flag: 'wx', mode: 0o600 });
        const storedPath = await fs.promises.realpath(targetPath);
        const stat = await fs.promises.stat(storedPath);
        const mimeType = normalizeString(payload.mimeType, 'application/octet-stream').slice(0, 160);
        const createdAt = new Date(stat.mtimeMs).toISOString();
        record.lastUsedAt = Date.now();

        return {
            ok: true,
            attachment: {
                type: 'file',
                id: `hosted-upload-${path.basename(storedName, path.extname(storedName))}`,
                source: 'hosted-upload',
                label: originalName,
                name: originalName,
                path: storedPath,
                mimeType,
                extension: path.extname(originalName).toLowerCase(),
                kind: 'file',
                size: stat.size,
                createdAt,
                modifiedAt: createdAt,
                staged: false,
                stageStatus: 'already_in_workspace'
            },
            limits: {
                maxFileBytes: this.maxAttachmentBytes,
                maxTenantBytes: this.maxTenantAttachmentBytes
            }
        };
    }

    recordEvent(key, event = {}) {
        const nextSeq = (this.eventSeq.get(key) || 0) + 1;
        this.eventSeq.set(key, nextSeq);
        const events = this.eventLogs.get(key) || [];
        events.push({
            ...event,
            seq: nextSeq,
            hostedSeq: nextSeq
        });
        this.eventLogs.set(key, events.slice(-this.eventLogLimit));
    }

    getEvents(tenantId, { cursor = 0, limit = 100 } = {}) {
        const key = tenantKey(tenantId);
        const boundedLimit = boundedInteger(limit, 100, 1, 500);
        const normalizedCursor = Math.max(0, Number(cursor) || 0);
        const events = (this.eventLogs.get(key) || [])
            .filter((event) => Number(event.hostedSeq || event.seq) > normalizedCursor)
            .slice(0, boundedLimit);
        return {
            ok: true,
            cursor: normalizedCursor,
            latestSeq: this.eventSeq.get(key) || 0,
            events
        };
    }

    async runAgent(tenantId, payload = {}, options = {}) {
        const record = await this.getRuntime(tenantId);
        record.activeRuns += 1;
        record.lastUsedAt = Date.now();
        try {
            const request = sanitizeAgentRequest(payload, record);
            if (typeof options.onTextDelta === 'function') {
                request.onTextDelta = options.onTextDelta;
            }
            if (typeof options.onTextStreamEvent === 'function') {
                request.onTextStreamEvent = options.onTextStreamEvent;
            }
            if (typeof options.onTaskRoute === 'function') {
                request.onTaskRoute = options.onTaskRoute;
            }
            return await record.gateway.runAgent(request);
        } finally {
            record.activeRuns = Math.max(0, record.activeRuns - 1);
            record.lastUsedAt = Date.now();
        }
    }

    async runAgentEventStream(tenantId, payload = {}, options = {}) {
        const record = await this.getRuntime(tenantId);
        const sessionId = normalizeString(
            payload.sessionId || payload.sessionKey,
            'main'
        ).slice(0, 160);
        const routeTimeoutMs = boundedInteger(
            options.routeTimeoutMs,
            180000,
            1000,
            10 * 60 * 1000
        );
        const chatTimeoutMs = boundedInteger(
            options.chatTimeoutMs,
            180000,
            1000,
            10 * 60 * 1000
        );
        let routeMode = '';
        let outerRunId = '';
        const finishedRunIds = new Set();
        let resolveRoute;
        let resolveFinished;
        const routePromise = new Promise((resolve) => {
            resolveRoute = resolve;
        });
        const finishedPromise = new Promise((resolve) => {
            resolveFinished = resolve;
        });
        const onEvent = (event = {}) => {
            const eventSessionId = normalizeString(
                event.payload?.sessionId || event.sessionId
            );
            if (eventSessionId && eventSessionId !== sessionId) {
                return;
            }
            if (event.type === 'task_agent.route.decided') {
                const mode = normalizeString(event.payload?.mode).toLowerCase();
                if (['chat', 'execute'].includes(mode) && !routeMode) {
                    routeMode = mode;
                    resolveRoute(mode);
                }
                return;
            }
            if (event.type === 'task.background.finished') {
                const eventRunId = normalizeString(event.payload?.runId);
                if (eventRunId) {
                    finishedRunIds.add(eventRunId);
                }
                if (outerRunId && eventRunId === outerRunId) {
                    resolveFinished(event);
                }
            }
        };
        const waitFor = (promise, timeoutMs) => new Promise((resolve) => {
            const timer = setTimeout(() => resolve(null), timeoutMs);
            timer.unref?.();
            promise.then((value) => {
                clearTimeout(timer);
                resolve(value);
            }, () => {
                clearTimeout(timer);
                resolve(null);
            });
        });

        record.gateway.on?.('event', onEvent);
        try {
            const result = await this.runAgent(tenantId, payload, {
                ...options,
                onTaskRoute: (mode) => {
                    const normalizedMode = normalizeString(mode).toLowerCase();
                    if (['chat', 'execute'].includes(normalizedMode) && !routeMode) {
                        routeMode = normalizedMode;
                        resolveRoute(normalizedMode);
                    }
                }
            });
            if (result?.deferAssistantCommit !== true || result?.backgroundTask?.status !== 'running') {
                return result;
            }
            outerRunId = normalizeString(result.runId || result.backgroundTask?.runId);
            const decidedRoute = routeMode || await waitFor(routePromise, routeTimeoutMs);
            if (decidedRoute !== 'chat') {
                return {
                    ...result,
                    ...(decidedRoute ? { taskRoute: decidedRoute } : {})
                };
            }
            if (!finishedRunIds.has(outerRunId)) {
                await waitFor(finishedPromise, chatTimeoutMs);
            }
            return {
                ...result,
                taskRoute: 'chat'
            };
        } finally {
            record.gateway.off?.('event', onEvent);
        }
    }

    async interruptAgentRun(tenantId, payload = {}) {
        const record = await this.getRuntime(tenantId);
        return await record.gateway.interruptAgentRun({
            runId: normalizeString(payload.runId).slice(0, 160),
            sessionId: normalizeString(payload.sessionId || payload.sessionKey, 'main').slice(0, 160),
            reason: normalizeString(payload.reason, 'hosted_user_interrupt').slice(0, 240)
        });
    }

    async getTenantStatus(tenantId) {
        const record = await this.getRuntime(tenantId);
        return {
            ok: true,
            running: true,
            runtime: 'ailis-hosted',
            workspaceRoot: record.workspaceRoot,
            memoryRoot: path.join(record.stateRoot, 'memory'),
            taskAgentHarnessRoot: path.join(record.stateRoot, 'task-agent-harness'),
            gateway: record.gateway.getStatus?.({ includeAgentRunner: false }) || null
        };
    }

    async waitForBackgroundTasks(tenantId) {
        const record = await this.getRuntime(tenantId);
        await record.gateway?.waitForBackgroundTaskRuns?.();
    }

    async closeRecord(record) {
        if (!record) {
            return;
        }
        record.unsubscribe?.();
        await record.gateway?.stop?.().catch(() => {});
        this.runtimes.delete(record.key);
    }

    async evictIdleRuntimes({ reserveSlots = 0, now = Date.now() } = {}) {
        const candidates = [...this.runtimes.values()]
            .filter((record) => (
                record.activeRuns === 0 &&
                record.gateway?.hasBackgroundTaskRuns?.() !== true
            ))
            .sort((left, right) => left.lastUsedAt - right.lastUsedAt);
        for (const record of candidates) {
            const overCapacity = this.runtimes.size + reserveSlots > this.maxActiveTenants;
            const expired = now - record.lastUsedAt >= this.idleTtlMs;
            if (!overCapacity && !expired) {
                continue;
            }
            await this.closeRecord(record);
        }
    }

    async runLlmChatCompletion(payload = {}, options = {}) {
        const request = sanitizeHostedLlmRequest(payload);
        const result = await callDesktopLlmProvider(this.llmSettings, {
            ...request,
            timeoutMs: this.llmSettings.timeoutMs,
            ...(typeof options.onTextDelta === 'function'
                ? { onTextDelta: options.onTextDelta }
                : {})
        });
        if (!result?.ok) {
            const statusCode = Number(result?.status) >= 400 && Number(result?.status) < 600
                ? Number(result.status)
                : result?.code === 'timeout'
                ? 504
                : 502;
            throw Object.assign(
                new Error(result?.error || result?.code || 'hosted_llm_error'),
                { statusCode }
            );
        }
        return result;
    }

    getStatus() {
        return {
            ok: true,
            runtime: 'ailis-hosted',
            dataRoot: this.dataRoot,
            activeTenantCount: this.runtimes.size,
            maxActiveTenants: this.maxActiveTenants,
            tenantsWithEvents: this.eventLogs.size,
            llm: {
                provider: this.llmSettings.provider,
                baseUrl: this.llmSettings.baseUrl,
                model: this.llmSettings.model,
                configured: Boolean(this.llmSettings.apiKey)
            },
            attachments: {
                maxFileBytes: this.maxAttachmentBytes,
                maxTenantBytes: this.maxTenantAttachmentBytes,
                ttlMs: this.attachmentTtlMs
            }
        };
    }

    async close() {
        for (const record of [...this.runtimes.values()]) {
            await this.closeRecord(record);
        }
    }
}

module.exports = {
    AILISHostedRuntimeManager,
    resolveHostedLlmSettings,
    sanitizeAgentRequest,
    sanitizeAttachmentFilename,
    sanitizeHostedLlmRequest,
    tenantKey
};
