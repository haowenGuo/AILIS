'use strict';

const fs = require('fs');
const path = require('path');
const { createHash } = require('crypto');
const { AILISGateway } = require('./ailis-gateway.cjs');
const { callDesktopLlmProvider } = require('./desktop-llm-provider.cjs');

const DEFAULT_MAX_ACTIVE_TENANTS = 6;
const DEFAULT_IDLE_TTL_MS = 30 * 60 * 1000;
const DEFAULT_EVENT_LOG_LIMIT = 1000;

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
        this.llmSettings = options.llmSettings || resolveHostedLlmSettings(options.env || process.env);
        this.gatewayFactory = typeof options.gatewayFactory === 'function'
            ? options.gatewayFactory
            : (gatewayOptions) => new AILISGateway(gatewayOptions);
        this.runtimes = new Map();
        this.eventLogs = new Map();
        this.eventSeq = new Map();
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
                llmSettings: { ...record.llmSettings }
            })
        });
        record.gateway = gateway;
        const onEvent = (event) => this.recordEvent(key, event);
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
            return await record.gateway.runAgent(request);
        } finally {
            record.activeRuns = Math.max(0, record.activeRuns - 1);
            record.lastUsedAt = Date.now();
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
            .filter((record) => record.activeRuns === 0)
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
    tenantKey
};
