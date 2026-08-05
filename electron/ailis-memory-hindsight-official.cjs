'use strict';

const fs = require('fs');
const path = require('path');
const { createHash } = require('crypto');

const STATE_VERSION = 1;
const STATE_FILE = 'hindsight-official-v1.json';
const UPSTREAM_VERSION = '0.8.6';
const DEFAULT_RETAIN_BATCH_SIZE = 10;

function normalizeText(value, fallback = '') {
    if (typeof value !== 'string') {
        return fallback;
    }
    const normalized = value.trim();
    return normalized || fallback;
}

function safeIso(value, fallback = '') {
    const parsed = Date.parse(normalizeText(value));
    return Number.isFinite(parsed) ? new Date(parsed).toISOString() : fallback;
}

function stableHash(value) {
    return createHash('sha256').update(String(value || '')).digest('hex');
}

function ensureDirectory(directory) {
    fs.mkdirSync(directory, { recursive: true });
}

function atomicWriteJson(filePath, value) {
    ensureDirectory(path.dirname(filePath));
    const temporaryPath = `${filePath}.${process.pid}.${Date.now()}.tmp`;
    fs.writeFileSync(temporaryPath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
    fs.renameSync(temporaryPath, filePath);
}

function readJson(filePath, fallback) {
    try {
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch {
        return fallback;
    }
}

function delay(milliseconds) {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function isTransientHindsightError(error) {
    return [
        error?.code,
        error?.cause?.code,
        error?.message,
        error?.cause?.message
    ].filter(Boolean).some((value) =>
        /connect|network|econn|eai_again|fetch failed|socket|429|502|503|504|rate limit|temporar/i
            .test(String(value))
    );
}

async function withTransientHindsightRetries(operation, {
    attempts = 3,
    delayMs = 1_000
} = {}) {
    const attemptLimit = Math.max(1, Math.min(Number(attempts) || 3, 6));
    const baseDelayMs = Math.max(0, Math.min(Number(delayMs) || 0, 10_000));
    let lastError = null;
    for (let attempt = 1; attempt <= attemptLimit; attempt += 1) {
        try {
            return await operation(attempt);
        } catch (error) {
            lastError = error;
            if (attempt >= attemptLimit || !isTransientHindsightError(error)) {
                throw error;
            }
            if (baseDelayMs) {
                await delay(baseDelayMs * attempt);
            }
        }
    }
    throw lastError;
}

async function purgeHindsightOfficialBankForState({
    rootDir,
    baseUrl = '',
    client = null,
    quietPasses = 5,
    pollMs = 2_000,
    maxWaitMs = 60_000
} = {}) {
    const statePath = path.join(path.resolve(rootDir || '.'), STATE_FILE);
    const state = readJson(statePath, null);
    const bankId = normalizeText(state?.bankId);
    if (!bankId) {
        return {
            ok: true,
            status: 'no_persisted_bank',
            bankId: '',
            deleteAttempts: 0,
            lastTotal: 0
        };
    }

    let resolvedClient = client;
    if (!resolvedClient) {
        const resolvedBaseUrl = normalizeText(baseUrl || state?.baseUrl);
        if (!resolvedBaseUrl) {
            throw new Error(`Cannot purge Hindsight bank ${bankId}: base URL is missing`);
        }
        const clientModule = await import('@vectorize-io/hindsight-client');
        resolvedClient = new clientModule.HindsightClient({ baseUrl: resolvedBaseUrl });
    }

    const targetQuietPasses = Math.max(1, Math.min(Number(quietPasses) || 5, 30));
    const intervalMs = Math.max(0, Math.min(Number(pollMs) || 0, 10_000));
    const deadline = Date.now() + Math.max(
        targetQuietPasses * intervalMs,
        Number(maxWaitMs) || 60_000
    );
    let consecutiveEmptyPasses = 0;
    let deleteAttempts = 0;
    let lastTotal = null;

    const deleteBank = async () => {
        try {
            await resolvedClient.deleteBank(bankId);
            deleteAttempts += 1;
        } catch (error) {
            if (!/404|not[\s_-]*found/i.test(error?.message || String(error))) {
                throw error;
            }
        }
    };

    await deleteBank();
    while (Date.now() <= deadline) {
        if (intervalMs) {
            await delay(intervalMs);
        }
        try {
            const memories = await resolvedClient.listMemories(bankId, { limit: 1 });
            lastTotal = Math.max(0, Number(memories?.total) || 0);
        } catch (error) {
            if (/404|not[\s_-]*found/i.test(error?.message || String(error))) {
                lastTotal = 0;
            } else {
                throw error;
            }
        }
        if (lastTotal === 0) {
            consecutiveEmptyPasses += 1;
            if (consecutiveEmptyPasses >= targetQuietPasses) {
                return {
                    ok: true,
                    status: 'purged',
                    bankId,
                    deleteAttempts,
                    lastTotal
                };
            }
            continue;
        }
        consecutiveEmptyPasses = 0;
        await deleteBank();
    }

    throw new Error(
        `Hindsight bank ${bankId} did not remain empty for ` +
        `${targetQuietPasses} verification pass(es); last total=${lastTotal}`
    );
}

function isPersonaEvent(event = {}) {
    const source = normalizeText(event.source).toLowerCase();
    const sessionId = normalizeText(event.sessionId).toLowerCase();
    return !source.includes('task-agent') &&
        !source.includes('task_agent') &&
        !sessionId.includes(':task-agent:') &&
        !sessionId.includes(':task_agent:');
}

function safeProfile(value) {
    return normalizeText(value, 'ailis')
        .replace(/[^a-zA-Z0-9_-]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 64) || 'ailis';
}

function derivedPort(rootDir) {
    const digest = createHash('sha256').update(path.resolve(rootDir)).digest();
    return 18_000 + (digest.readUInt16BE(0) % 10_000);
}

function defaultState(rootDir, options = {}) {
    const identity = stableHash(path.resolve(rootDir)).slice(0, 20);
    const now = new Date().toISOString();
    return {
        version: STATE_VERSION,
        upstream: {
            repository: 'vectorize-io/hindsight',
            packageVersion: UPSTREAM_VERSION,
            fidelity: 'official_backend_integration'
        },
        createdAt: now,
        updatedAt: now,
        profile: safeProfile(options.profile || `ailis-${identity}`),
        bankId: normalizeText(options.bankId, `ailis-${identity}`),
        baseUrl: normalizeText(options.baseUrl),
        retainedEventIds: [],
        bankCreated: false,
        serverVersion: '',
        diagnostics: {
            ready: false,
            ownedDaemon: false,
            retainedEventCount: 0,
            lastRetainAt: '',
            lastRecallAt: '',
            lastReflectAt: '',
            lastReflectError: '',
            lastError: ''
        }
    };
}

function normalizeState(raw, rootDir, options = {}) {
    const fallback = defaultState(rootDir, options);
    const source = raw && typeof raw === 'object' ? raw : {};
    const requestedProfile = options.profile
        ? safeProfile(options.profile)
        : '';
    const requestedBankId = normalizeText(options.bankId);
    const persistedProfile = safeProfile(source.profile || fallback.profile);
    const persistedBankId = normalizeText(source.bankId, fallback.bankId);
    const identityChanged =
        (requestedProfile && requestedProfile !== persistedProfile) ||
        (requestedBankId && requestedBankId !== persistedBankId);
    if (identityChanged) {
        return fallback;
    }
    return {
        ...fallback,
        ...source,
        version: STATE_VERSION,
        upstream: { ...fallback.upstream, ...(source.upstream || {}) },
        profile: safeProfile(options.profile || source.profile || fallback.profile),
        bankId: normalizeText(options.bankId || source.bankId, fallback.bankId),
        baseUrl: normalizeText(options.baseUrl || source.baseUrl),
        retainedEventIds: Array.isArray(source.retainedEventIds)
            ? [...new Set(source.retainedEventIds.map((entry) => normalizeText(entry)).filter(Boolean))]
            : [],
        diagnostics: { ...fallback.diagnostics, ...(source.diagnostics || {}) }
    };
}

function eventContent(event = {}) {
    return [
        `Conversation timestamp: ${safeIso(event.ts, 'unknown')}`,
        `Session: ${normalizeText(event.sessionId, 'main')}`,
        normalizeText(event.userText) ? `User: ${normalizeText(event.userText)}` : '',
        normalizeText(event.assistantText) ? `AILIS: ${normalizeText(event.assistantText)}` : ''
    ].filter(Boolean).join('\n');
}

function eventItem(event = {}) {
    const eventId = normalizeText(event.id);
    const sessionId = normalizeText(event.sessionId, 'main');
    return {
        content: eventContent(event),
        timestamp: safeIso(event.ts),
        context: `AILIS Persona conversation in session ${sessionId}`,
        document_id: `ailis-turn-${eventId}`,
        metadata: {
            ailis_event_id: eventId,
            ailis_session_id: sessionId,
            ailis_source: normalizeText(event.source, 'conversation')
        },
        tags: ['ailis', 'persona', `session:${sessionId}`],
        observation_scopes: 'shared',
        update_mode: 'replace'
    };
}

function chunks(items, size) {
    const result = [];
    for (let index = 0; index < items.length; index += size) {
        result.push(items.slice(index, index + size));
    }
    return result;
}

class AILISHindsightOfficialMemory {
    constructor(options = {}) {
        this.rootDir = path.resolve(options.rootDir || process.cwd());
        this.statePath = path.join(this.rootDir, STATE_FILE);
        this.baseUrl = normalizeText(
            options.baseUrl ||
            process.env.AILIS_HINDSIGHT_URL ||
            process.env.HINDSIGHT_API_URL
        );
        this.autoStart = options.autoStart !== false &&
            normalizeText(process.env.AILIS_HINDSIGHT_AUTOSTART, 'true').toLowerCase() !== 'false';
        this.port = Math.max(1, Math.min(
            65_535,
            Number(options.port || process.env.AILIS_HINDSIGHT_PORT) || derivedPort(this.rootDir)
        ));
        this.host = normalizeText(options.host, '127.0.0.1');
        this.embedPackagePath = normalizeText(options.embedPackagePath);
        this.injectedClient = options.client || null;
        this.injectedServer = options.server || null;
        this.retainBatchSize = Math.max(
            1,
            Math.min(
                50,
                Number(
                    options.retainBatchSize ||
                    process.env.AILIS_HINDSIGHT_RETAIN_BATCH_SIZE
                ) || DEFAULT_RETAIN_BATCH_SIZE
            )
        );
        this.transientRetryAttempts = Math.max(
            1,
            Math.min(
                6,
                Number(
                    options.transientRetryAttempts ||
                    process.env.AILIS_HINDSIGHT_TRANSIENT_RETRY_ATTEMPTS
                ) || 3
            )
        );
        const configuredTransientRetryDelayMs = Number(
            options.transientRetryDelayMs ??
            process.env.AILIS_HINDSIGHT_TRANSIENT_RETRY_DELAY_MS ??
            1_000
        );
        this.transientRetryDelayMs = Math.max(
            0,
            Math.min(
                10_000,
                Number.isFinite(configuredTransientRetryDelayMs)
                    ? configuredTransientRetryDelayMs
                    : 1_000
            )
        );
        this.state = normalizeState(
            readJson(this.statePath, null),
            this.rootDir,
            {
                profile: options.profile,
                bankId: options.bankId,
                baseUrl: this.baseUrl
            }
        );
        this.client = this.injectedClient;
        this.server = this.injectedServer;
        this.clientModule = null;
        this.readyPromise = null;
        this.bankEnsuredThisProcess = false;
        this.operation = Promise.resolve();
        this.persist();
    }

    persist() {
        this.state.updatedAt = new Date().toISOString();
        this.state.diagnostics.retainedEventCount = this.state.retainedEventIds.length;
        atomicWriteJson(this.statePath, this.state);
    }

    withLock(callback) {
        const run = this.operation.then(callback, callback);
        this.operation = run.catch(() => {});
        return run;
    }

    daemonEnvironment() {
        const fromProcess = (key, fallback = '') =>
            normalizeText(process.env[key], fallback);
        const passThrough = Object.fromEntries(
            Object.entries(process.env).filter(([key, value]) =>
                (/^(?:HINDSIGHT_|HF_|UV_)/.test(key) || key === 'CODEX_HOME') &&
                normalizeText(value)
            )
        );
        const environment = {
            ...passThrough,
            UV_PYTHON: fromProcess(
                'UV_PYTHON',
                process.env.AILIS_HINDSIGHT_PYTHON || '3.12'
            ),
            UV_INDEX_URL: fromProcess(
                'UV_INDEX_URL',
                process.env.AILIS_HINDSIGHT_PYPI_INDEX
            ),
            CODEX_HOME: fromProcess('CODEX_HOME'),
            HF_ENDPOINT: fromProcess(
                'HF_ENDPOINT',
                process.env.AILIS_MEMORY_MODEL_ENDPOINT
            ),
            HF_HOME: fromProcess('HF_HOME'),
            TRANSFORMERS_CACHE: fromProcess('TRANSFORMERS_CACHE'),
            HF_HUB_DISABLE_XET: fromProcess(
                'HF_HUB_DISABLE_XET',
                process.env.HF_ENDPOINT ? '1' : ''
            ),
            HINDSIGHT_API_LLM_PROVIDER: fromProcess(
                'HINDSIGHT_API_LLM_PROVIDER',
                'openai-codex'
            ),
            HINDSIGHT_API_LLM_MODEL: fromProcess(
                'HINDSIGHT_API_LLM_MODEL',
                process.env.AILIS_HINDSIGHT_MODEL || 'gpt-5.4-mini'
            ),
            HINDSIGHT_API_LLM_API_KEY: fromProcess('HINDSIGHT_API_LLM_API_KEY'),
            HINDSIGHT_API_LLM_BASE_URL: fromProcess('HINDSIGHT_API_LLM_BASE_URL'),
            HINDSIGHT_API_EMBEDDINGS_PROVIDER: fromProcess(
                'HINDSIGHT_API_EMBEDDINGS_PROVIDER',
                'local'
            ),
            HINDSIGHT_API_RERANKER_PROVIDER: fromProcess(
                'HINDSIGHT_API_RERANKER_PROVIDER',
                'local'
            ),
            HINDSIGHT_EMBED_DAEMON_IDLE_TIMEOUT: fromProcess(
                'HINDSIGHT_EMBED_DAEMON_IDLE_TIMEOUT',
                '0'
            )
        };
        return Object.fromEntries(
            Object.entries(environment).filter(([, value]) => normalizeText(value))
        );
    }

    async probe(baseUrl) {
        try {
            const response = await fetch(`${baseUrl.replace(/\/+$/, '')}/health`, {
                signal: AbortSignal.timeout(5_000)
            });
            return response.ok;
        } catch {
            return false;
        }
    }

    async ensureReady() {
        if (this.readyPromise) {
            return this.readyPromise;
        }
        this.readyPromise = (async () => {
            try {
                this.clientModule ||= await import('@vectorize-io/hindsight-client');
                if (this.injectedClient) {
                    this.client = this.injectedClient;
                    this.state.diagnostics.ready = true;
                    this.state.diagnostics.lastError = '';
                    this.persist();
                    return this.client;
                }
                let baseUrl = this.baseUrl || this.state.baseUrl;
                if (baseUrl && await this.probe(baseUrl)) {
                    this.client = new this.clientModule.HindsightClient({ baseUrl });
                    this.state.baseUrl = baseUrl;
                    this.state.diagnostics.ready = true;
                    this.state.diagnostics.ownedDaemon = false;
                } else {
                    if (baseUrl && !this.autoStart) {
                        throw new Error(`configured Hindsight API is unhealthy: ${baseUrl}`);
                    }
                    if (!this.autoStart) {
                        throw new Error(
                            'Hindsight official backend requires AILIS_HINDSIGHT_URL or autostart'
                        );
                    }
                    if (!this.server) {
                        const serverModule = await import('@vectorize-io/hindsight-all');
                        this.server = new serverModule.HindsightServer({
                            profile: this.state.profile,
                            host: this.host,
                            port: this.port,
                            embedVersion: UPSTREAM_VERSION,
                            ...(this.embedPackagePath
                                ? { embedPackagePath: this.embedPackagePath }
                                : {}),
                            env: this.daemonEnvironment(),
                            readyTimeoutMs: 180_000,
                            readyPollIntervalMs: 1_000
                        });
                    }
                    await this.server.start();
                    baseUrl = this.server.getBaseUrl();
                    if (!await this.probe(baseUrl)) {
                        throw new Error(`started Hindsight daemon is unhealthy: ${baseUrl}`);
                    }
                    this.client = new this.clientModule.HindsightClient({ baseUrl });
                    this.state.baseUrl = baseUrl;
                    this.state.diagnostics.ready = true;
                    this.state.diagnostics.ownedDaemon = true;
                }
                const version = await this.client.getVersion();
                this.state.serverVersion = normalizeText(
                    version?.api_version || version?.version
                );
                this.state.diagnostics.lastError = '';
                this.persist();
                return this.client;
            } catch (error) {
                this.state.diagnostics.ready = false;
                this.state.diagnostics.lastError = error?.message || String(error);
                this.persist();
                throw Object.assign(
                    new Error(
                        `Hindsight official backend unavailable: ${this.state.diagnostics.lastError}`
                    ),
                    { code: 'official_backend_unavailable' }
                );
            }
        })();
        try {
            return await this.readyPromise;
        } catch (error) {
            this.readyPromise = null;
            throw error;
        }
    }

    async ensureBank(client) {
        if (this.bankEnsuredThisProcess) {
            return;
        }
        await client.createBank(this.state.bankId, {
            name: 'AILIS Persona Memory',
            background: [
                'Persistent conversational memory for AILIS, an embodied companion.',
                'Retain user facts, experiences, preferences, changes over time,',
                'relationship continuity, and assistant-provided outcomes.',
                'TaskAgent execution traces are outside this bank.'
            ].join(' '),
            retainMission: [
                'Extract evidence-grounded world facts and experiences from Persona',
                'conversation. Preserve exact names, dates, quantities, preferences,',
                'state updates, temporal ranges, and the distinction between user',
                'assertions and questions. Never invent unsupported memories.'
            ].join(' '),
            reflectMission: [
                'Reason over the complete conversational history to support natural',
                'companionship, preference continuity, temporal questions, knowledge',
                'updates, and uncertainty-aware answers.'
            ].join(' '),
            enableObservations: true
        });
        this.state.bankCreated = true;
        this.bankEnsuredThisProcess = true;
        this.persist();
    }

    curate({ events = [], maxBatches = 12 } = {}) {
        return this.withLock(async () => {
            let pending = [];
            let completedBatches = 0;
            try {
                const client = await this.ensureReady();
                await this.ensureBank(client);
                const retained = new Set(this.state.retainedEventIds);
                pending = events
                    .filter(isPersonaEvent)
                    .filter((event) => normalizeText(event.id) && !retained.has(event.id))
                    .sort((left, right) =>
                        String(left.ts || '').localeCompare(String(right.ts || '')) ||
                        String(left.id || '').localeCompare(String(right.id || ''))
                    );
                const passLimit = Math.max(1, Math.min(Number(maxBatches) || 12, 128));
                const batches = chunks(pending, this.retainBatchSize)
                    .slice(0, passLimit);
                for (const batch of batches) {
                    await withTransientHindsightRetries(
                        () => client.retainBatch(
                            this.state.bankId,
                            batch.map(eventItem),
                            {
                                async: false,
                                documentTags: ['ailis', 'persona']
                            }
                        ),
                        {
                            attempts: this.transientRetryAttempts,
                            delayMs: this.transientRetryDelayMs
                        }
                    );
                    this.state.retainedEventIds.push(...batch.map((event) => event.id));
                    this.state.retainedEventIds = [...new Set(this.state.retainedEventIds)];
                    this.state.diagnostics.lastRetainAt = new Date().toISOString();
                    completedBatches += 1;
                    this.persist();
                }
                const processedEntryCount = batches
                    .reduce((sum, batch) => sum + batch.length, 0);
                const remainingEntryCount = Math.max(0, pending.length - processedEntryCount);
                return {
                    ok: true,
                    status: remainingEntryCount ? 'partial_completed' : 'completed',
                    run: {
                        processedEntryCount,
                        evidenceCount: processedEntryCount,
                        batchCount: completedBatches,
                        unitCount: processedEntryCount,
                        observationCount: 0,
                        mentalModelCount: 0,
                        supersededCount: 0,
                        remainingEntryCount
                    },
                    backend: this.publicStatus()
                };
            } catch (error) {
                this.state.diagnostics.lastError = error?.message || String(error);
                this.persist();
                return {
                    ok: false,
                    status: error?.code || 'official_backend_unavailable',
                    error: this.state.diagnostics.lastError,
                    run: {
                        processedEntryCount: 0,
                        evidenceCount: 0,
                        batchCount: completedBatches,
                        unitCount: 0,
                        observationCount: 0,
                        mentalModelCount: 0,
                        supersededCount: 0,
                        remainingEntryCount: pending.length
                    },
                    backend: this.publicStatus()
                };
            }
        });
    }

    async search({
        query = '',
        questionTime = '',
        maxTokens = 16_000,
        reflect = true
    } = {}) {
        return this.withLock(async () => {
            const client = await this.ensureReady();
            await this.ensureBank(client);
            const recall = await withTransientHindsightRetries(
                () => client.recall(this.state.bankId, normalizeText(query), {
                    types: ['world', 'experience', 'observation'],
                    preferObservations: true,
                    maxTokens,
                    budget: 'high',
                    trace: true,
                    queryTimestamp: safeIso(questionTime) || undefined,
                    includeEntities: true,
                    includeChunks: true,
                    includeSourceFacts: true
                }),
                {
                    attempts: this.transientRetryAttempts,
                    delayMs: this.transientRetryDelayMs
                }
            );
            this.state.diagnostics.lastRecallAt = new Date().toISOString();
            let reflection = null;
            let reflectError = '';
            if (reflect) {
                try {
                    reflection = await client.reflect(this.state.bankId, normalizeText(query), {
                        budget: 'high',
                        context: safeIso(questionTime)
                            ? `The current question time is ${safeIso(questionTime)}.`
                            : undefined,
                        factTypes: ['world', 'experience', 'observation'],
                        includeFacts: true,
                        includeToolCalls: true,
                        includeToolCallOutput: true
                    });
                    this.state.diagnostics.lastReflectAt = new Date().toISOString();
                    this.state.diagnostics.lastReflectError = '';
                } catch (error) {
                    reflectError = error?.message || String(error);
                    this.state.diagnostics.lastReflectError = reflectError;
                }
            }
            this.state.diagnostics.lastError = '';
            this.persist();

            const promptFacts = this.clientModule.recallResponseToPromptString(recall);
            const contextText = [
                '### Hindsight official Recall evidence',
                promptFacts,
                reflection?.text
                    ? `\n### Hindsight official Reflect synthesis\n${reflection.text}`
                    : ''
            ].filter(Boolean).join('\n\n');
            const results = Array.isArray(recall?.results) ? recall.results : [];
            const documents = results.map((result, index) => {
                const eventId = normalizeText(result?.metadata?.ailis_event_id);
                const sessionId = normalizeText(result?.metadata?.ailis_session_id);
                return {
                    id: `hindsight:${normalizeText(result.id, index)}`,
                    kind: normalizeText(result.type, 'memory'),
                    lane: normalizeText(result.type, 'world'),
                    text: normalizeText(result.text),
                    time: safeIso(
                        result.occurred_start ||
                        result.mentioned_at
                    ),
                    sourceEventIds: eventId ? [eventId] : [],
                    sourceRefs: eventId ? [{
                        eventId,
                        sessionId,
                        occurredAt: safeIso(
                            result.occurred_start ||
                            result.mentioned_at
                        )
                    }] : [],
                    structured: result
                };
            });
            return {
                ok: true,
                contextText,
                documents,
                sourceEventIds: documents.flatMap((document) => document.sourceEventIds),
                recall,
                reflection,
                diagnostics: {
                    upstream: this.state.upstream,
                    serverVersion: this.state.serverVersion,
                    bankId: this.state.bankId,
                    resultCount: documents.length,
                    reflectToolCallCount: reflection?.trace?.tool_calls?.length || 0,
                    reflectStatus: !reflect
                        ? 'disabled'
                        : reflection
                            ? 'completed'
                            : 'failed',
                    reflectError
                }
            };
        });
    }

    async shutdown() {
        if (this.server && this.state.diagnostics.ownedDaemon) {
            await this.server.stop().catch(() => {});
        }
        this.state.diagnostics.ready = false;
        this.persist();
    }

    publicStatus() {
        return {
            upstream: this.state.upstream,
            statePath: this.statePath,
            profile: this.state.profile,
            bankId: this.state.bankId,
            baseUrl: this.state.baseUrl,
            serverVersion: this.state.serverVersion,
            retainBatchSize: this.retainBatchSize,
            retainedEventCount: this.state.retainedEventIds.length,
            bankCreated: this.state.bankCreated,
            diagnostics: { ...this.state.diagnostics }
        };
    }

    getStatus() {
        return this.publicStatus();
    }
}

module.exports = {
    AILISHindsightOfficialMemory,
    DEFAULT_RETAIN_BATCH_SIZE,
    purgeHindsightOfficialBankForState,
    STATE_FILE,
    UPSTREAM_VERSION
};
