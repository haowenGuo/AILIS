'use strict';

const fs = require('fs');
const path = require('path');
const { createHash } = require('crypto');

const STATE_VERSION = 1;
const STATE_FILE = 'mastra-observational-official-v1.json';
const DATABASE_FILE = 'mastra-observational-official-v1.db';
const UPSTREAM_MEMORY_VERSION = '1.24.0';
const UPSTREAM_LIBSQL_VERSION = '1.18.0';
const DEFAULT_MESSAGE_TOKENS = 30_000;
const DEFAULT_OBSERVATION_TOKENS = 40_000;
const DEFAULT_BATCH_TOKENS = 10_000;
const DEFAULT_PREVIOUS_OBSERVER_TOKENS = 2_000;
const DEFAULT_RAW_TAIL_TOKENS = 6_000;

function normalizeText(value, fallback = '') {
    if (typeof value !== 'string') {
        return fallback;
    }
    return value.trim() || fallback;
}

function normalizeArray(value) {
    return Array.isArray(value) ? value : [];
}

function safeIso(value, fallback = '') {
    const parsed = Date.parse(normalizeText(value));
    return Number.isFinite(parsed) ? new Date(parsed).toISOString() : fallback;
}

function stableHash(...values) {
    return createHash('sha256')
        .update(values.map((value) => String(value || '')).join('\u0000'))
        .digest('hex');
}

function safeIdentifier(value, fallback = 'ailis') {
    return normalizeText(value, fallback)
        .replace(/[^a-zA-Z0-9_-]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 72) || fallback;
}

function ensureDirectory(directory) {
    fs.mkdirSync(directory, { recursive: true });
}

function readJson(filePath, fallback) {
    try {
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch {
        return fallback;
    }
}

function atomicWriteJson(filePath, value) {
    ensureDirectory(path.dirname(filePath));
    const temporaryPath = `${filePath}.${process.pid}.${Date.now()}.tmp`;
    fs.writeFileSync(temporaryPath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
    fs.renameSync(temporaryPath, filePath);
}

function isPersonaEvent(event = {}) {
    const source = normalizeText(event.source).toLowerCase();
    const sessionId = normalizeText(event.sessionId).toLowerCase();
    return !source.includes('task-agent') &&
        !source.includes('task_agent') &&
        !sessionId.includes(':task-agent:') &&
        !sessionId.includes(':task_agent:');
}

function llmText(result) {
    const candidates = [
        result?.text,
        result?.output_text,
        result?.content,
        result?.message?.content,
        result?.choices?.[0]?.message?.content
    ];
    return candidates.map((value) => {
        if (typeof value === 'string') return value;
        if (Array.isArray(value)) {
            return value
                .map((part) => normalizeText(part?.text || part?.content))
                .filter(Boolean)
                .join('\n');
        }
        return '';
    }).find(Boolean) || '';
}

function stringifyContent(value) {
    if (typeof value === 'string') return value;
    if (value === undefined) return '';
    try {
        return JSON.stringify(value);
    } catch {
        return String(value);
    }
}

function promptPartText(part = {}) {
    if (part.type === 'text' || part.type === 'reasoning') {
        return normalizeText(part.text);
    }
    if (part.type === 'file') {
        return `[File: ${normalizeText(part.filename, part.mediaType || 'attachment')}]`;
    }
    if (part.type === 'tool-call') {
        return `[Tool call ${normalizeText(part.toolName)}] ${stringifyContent(part.input)}`;
    }
    if (part.type === 'tool-result') {
        return `[Tool result ${normalizeText(part.toolName)}] ${stringifyContent(part.output)}`;
    }
    return '';
}

function promptMessages(prompt = []) {
    return normalizeArray(prompt).map((message) => {
        if (message.role === 'system') {
            return { role: 'system', content: normalizeText(message.content) };
        }
        const content = normalizeArray(message.content)
            .map(promptPartText)
            .filter(Boolean)
            .join('\n');
        return {
            role: ['assistant', 'tool'].includes(message.role)
                ? message.role
                : 'user',
            content
        };
    }).filter((message) => message.content);
}

function emptyUsage(result = {}, estimates = {}) {
    const input = Number(
        result?.usage?.input_tokens ??
        result?.usage?.prompt_tokens ??
        result?.usage?.inputTokens
    );
    const output = Number(
        result?.usage?.output_tokens ??
        result?.usage?.completion_tokens ??
        result?.usage?.outputTokens
    );
    return {
        inputTokens: {
            total: Number.isFinite(input)
                ? input
                : Math.max(1, Number(estimates.input) || 1),
            noCache: Number.isFinite(input)
                ? input
                : Math.max(1, Number(estimates.input) || 1),
            cacheRead: 0,
            cacheWrite: 0
        },
        outputTokens: {
            total: Number.isFinite(output)
                ? output
                : Math.max(1, Number(estimates.output) || 1),
            text: Number.isFinite(output)
                ? output
                : Math.max(1, Number(estimates.output) || 1),
            reasoning: 0
        }
    };
}

function createAilisLanguageModel(llmClient, {
    modelId = 'ailis-observational-memory',
    onCall = null
} = {}) {
    if (typeof llmClient !== 'function') {
        throw Object.assign(
            new Error('official Mastra ObservationalMemory requires an AILIS LLM client'),
            { code: 'official_mastra_model_unavailable' }
        );
    }
    const run = async (options = {}) => {
        if (normalizeArray(options.tools).length) {
            throw Object.assign(
                new Error('AILIS Mastra model adapter does not support model tool calls'),
                { code: 'official_mastra_model_tools_unsupported' }
            );
        }
        const result = await llmClient({
            messages: promptMessages(options.prompt),
            temperature: options.temperature,
            max_tokens: options.maxOutputTokens,
            timeoutMs: 180_000
        });
        if (result?.ok === false) {
            throw new Error(
                result.error ||
                result.message ||
                'AILIS model call for official Mastra memory failed'
            );
        }
        const text = llmText(result);
        if (!text) {
            throw new Error('AILIS model returned empty official Mastra memory output');
        }
        onCall?.({ options, result, text });
        return {
            text,
            usage: emptyUsage(result, {
                input: Math.ceil(
                    stringifyContent(options.prompt).length / 4
                ),
                output: Math.ceil(text.length / 4)
            })
        };
    };
    return {
        specificationVersion: 'v3',
        provider: 'ailis',
        modelId: normalizeText(modelId, 'ailis-observational-memory'),
        supportedUrls: {},
        async doGenerate(options) {
            const generated = await run(options);
            return {
                content: [{ type: 'text', text: generated.text }],
                finishReason: { unified: 'stop', raw: 'stop' },
                usage: generated.usage,
                warnings: []
            };
        },
        async doStream(options) {
            const generated = await run(options);
            const finishReason = { unified: 'stop', raw: 'stop' };
            const stream = new ReadableStream({
                start(controller) {
                    controller.enqueue({ type: 'stream-start', warnings: [] });
                    controller.enqueue({
                        type: 'response-metadata',
                        id: `ailis-mastra-${Date.now()}`,
                        timestamp: new Date(),
                        modelId
                    });
                    controller.enqueue({ type: 'text-start', id: 'text-1' });
                    controller.enqueue({
                        type: 'text-delta',
                        id: 'text-1',
                        delta: generated.text
                    });
                    controller.enqueue({ type: 'text-end', id: 'text-1' });
                    controller.enqueue({
                        type: 'finish',
                        usage: generated.usage,
                        finishReason
                    });
                    controller.close();
                }
            });
            return { stream };
        }
    };
}

function defaultState(rootDir, options = {}) {
    const identity = stableHash(path.resolve(rootDir)).slice(0, 20);
    const now = new Date().toISOString();
    return {
        version: STATE_VERSION,
        upstream: {
            package: '@mastra/memory',
            packageVersion: UPSTREAM_MEMORY_VERSION,
            storagePackage: '@mastra/libsql',
            storagePackageVersion: UPSTREAM_LIBSQL_VERSION,
            fidelity: 'official_runtime_integration'
        },
        createdAt: now,
        updatedAt: now,
        resourceId: normalizeText(options.resourceId, `ailis-${identity}`),
        ingestedEventIds: [],
        observedEventIds: [],
        groups: [],
        diagnostics: {
            ready: false,
            modelCallCount: 0,
            observationPassCount: 0,
            reflectionCount: 0,
            lastObservedAt: '',
            lastError: ''
        }
    };
}

function normalizeState(raw, rootDir, options = {}) {
    const fallback = defaultState(rootDir, options);
    const source = raw && typeof raw === 'object' ? raw : {};
    return {
        ...fallback,
        ...source,
        version: STATE_VERSION,
        upstream: { ...fallback.upstream, ...(source.upstream || {}) },
        resourceId: normalizeText(options.resourceId || source.resourceId, fallback.resourceId),
        ingestedEventIds: [...new Set(
            normalizeArray(source.ingestedEventIds || source.observedEventIds)
                .map((entry) => normalizeText(entry))
                .filter(Boolean)
        )],
        observedEventIds: [...new Set(
            normalizeArray(source.observedEventIds)
                .map((entry) => normalizeText(entry))
                .filter(Boolean)
        )],
        groups: normalizeArray(source.groups)
            .filter((entry) => entry && typeof entry === 'object'),
        diagnostics: {
            ...fallback.diagnostics,
            ...(source.diagnostics || {}),
            modelCallCount: Number(
                source.diagnostics?.modelCallCount ??
                source.diagnostics?.observerModelCallCount
            ) || 0,
            ready: false
        }
    };
}

function threadIdForSession(sessionId) {
    const normalized = normalizeText(sessionId, 'main');
    return `ailis-${safeIdentifier(normalized, 'main')}-${stableHash(normalized).slice(0, 10)}`;
}

function eventMessages(event, resourceId) {
    const eventId = normalizeText(event.id);
    const sessionId = normalizeText(event.sessionId, 'main');
    const threadId = threadIdForSession(sessionId);
    const baseTime = new Date(safeIso(event.ts, new Date().toISOString()));
    const shared = {
        threadId,
        resourceId,
        metadata: {
            ailisEventId: eventId,
            ailisSessionId: sessionId,
            ailisSource: normalizeText(event.source, 'conversation')
        }
    };
    const messages = [];
    if (normalizeText(event.userText)) {
        messages.push({
            ...shared,
            id: `${eventId}:user`,
            role: 'user',
            createdAt: baseTime,
            content: {
                format: 2,
                parts: [{ type: 'text', text: normalizeText(event.userText) }]
            }
        });
    }
    if (normalizeText(event.assistantText)) {
        messages.push({
            ...shared,
            id: `${eventId}:assistant`,
            role: 'assistant',
            createdAt: new Date(baseTime.getTime() + 1),
            content: {
                format: 2,
                parts: [{ type: 'text', text: normalizeText(event.assistantText) }]
            }
        });
    }
    return messages;
}

function batchEvents(events, counter, resourceId, maxTokens) {
    if (!events.length) return [];
    const selected = [];
    for (const event of events) {
        const candidate = [...selected, event];
        const tokens = counter.countMessages(
            candidate.flatMap((entry) => eventMessages(entry, resourceId))
        );
        if (selected.length && tokens > maxTokens) {
            break;
        }
        selected.push(event);
    }
    return selected;
}

function rawTail(events, counter, resourceId, maxTokens) {
    const selected = [];
    for (let index = events.length - 1; index >= 0; index -= 1) {
        const candidate = [events[index], ...selected];
        const tokens = counter.countMessages(
            candidate.flatMap((event) => eventMessages(event, resourceId))
        );
        if (selected.length && tokens > maxTokens) {
            break;
        }
        selected.unshift(events[index]);
    }
    return selected;
}

function rawTailText(events) {
    return events.map((event) => [
        `Session ${normalizeText(event.sessionId, 'main')} | ${safeIso(event.ts, 'time unknown')}`,
        normalizeText(event.userText) ? `User: ${normalizeText(event.userText)}` : '',
        normalizeText(event.assistantText) ? `AILIS: ${normalizeText(event.assistantText)}` : ''
    ].filter(Boolean).join('\n')).join('\n\n');
}

function messageEventId(message = {}) {
    const metadataId = normalizeText(
        message?.metadata?.ailisEventId ||
        message?.metadata?.ailis_event_id
    );
    if (metadataId) {
        return metadataId;
    }
    return normalizeText(message?.id).replace(/:(?:user|assistant)$/i, '');
}

class AILISMastraOfficialMemory {
    constructor(options = {}) {
        this.rootDir = path.resolve(options.rootDir || process.cwd());
        ensureDirectory(this.rootDir);
        this.statePath = path.join(this.rootDir, STATE_FILE);
        this.databasePath = path.resolve(
            options.databasePath ||
            path.join(this.rootDir, DATABASE_FILE)
        );
        this.llmClient = options.llmClient || options.queryPlanner || null;
        this.config = {
            messageTokens: Math.max(
                1_000,
                Number(options.messageTokens) || DEFAULT_MESSAGE_TOKENS
            ),
            observationTokens: Math.max(
                2_000,
                Number(options.observationTokens) || DEFAULT_OBSERVATION_TOKENS
            ),
            maxTokensPerBatch: Math.max(
                1_000,
                Number(options.maxTokensPerBatch) || DEFAULT_BATCH_TOKENS
            ),
            previousObserverTokens:
                options.previousObserverTokens === false
                    ? false
                    : Math.max(
                        0,
                        Number(options.previousObserverTokens) ||
                        DEFAULT_PREVIOUS_OBSERVER_TOKENS
                    ),
            rawTailTokens: Math.max(
                250,
                Number(options.rawTailTokens) || DEFAULT_RAW_TAIL_TOKENS
            ),
            // Mastra 1.24 does not support async buffering with resource scope.
            // Resource scope is required for AILIS cross-session continuity, so
            // sub-threshold messages remain losslessly available in rawTail.
            bufferTokens: false,
            bufferActivation: false,
            bufferingMode: 'synchronous_resource_scope'
        };
        this.state = normalizeState(
            readJson(this.statePath, null),
            this.rootDir,
            { resourceId: options.resourceId }
        );
        this.injectedEngine = options.engine || null;
        this.injectedStore = options.store || null;
        this.engine = this.injectedEngine;
        this.store = this.injectedStore;
        this.readyPromise = null;
        this.operation = Promise.resolve();
        this.activeSourceEventIds = [];
        this.activeSessionIds = [];
        this.activeMessageSources = [];
        this.persist();
    }

    persist() {
        this.state.updatedAt = new Date().toISOString();
        atomicWriteJson(this.statePath, this.state);
    }

    withLock(callback) {
        const run = this.operation.then(callback, callback);
        this.operation = run.catch(() => {});
        return run;
    }

    recordObservationGroup(observation = {}) {
        const range = normalizeText(observation.range);
        let matchedSources = [];
        for (let start = 0; start < this.activeMessageSources.length; start += 1) {
            for (let end = start; end < this.activeMessageSources.length; end += 1) {
                if (
                    `${this.activeMessageSources[start].messageId}:` +
                    `${this.activeMessageSources[end].messageId}` === range
                ) {
                    matchedSources = this.activeMessageSources.slice(start, end + 1);
                    break;
                }
            }
            if (matchedSources.length) break;
        }
        if (!matchedSources.length && normalizeText(observation.threadId)) {
            matchedSources = this.activeMessageSources.filter((entry) =>
                entry.threadId === observation.threadId
            );
        }
        const sourceEventIds = [...new Set(
            (matchedSources.length
                ? matchedSources.map((entry) => entry.eventId)
                : this.activeSourceEventIds
            ).filter(Boolean)
        )];
        const sessionIds = [...new Set(
            (matchedSources.length
                ? matchedSources.map((entry) => entry.sessionId)
                : this.activeSessionIds
            ).filter(Boolean)
        )];
        const groupId = normalizeText(observation.groupId);
        const group = {
            id: groupId || stableHash(
                observation.text,
                observation.range,
                this.activeSourceEventIds.join(',')
            ).slice(0, 24),
            text: normalizeText(observation.text),
            range,
            threadId: normalizeText(observation.threadId),
            resourceId: normalizeText(observation.resourceId, this.state.resourceId),
            observedAt: safeIso(observation.observedAt, new Date().toISOString()),
            sourceEventIds,
            sessionIds
        };
        const index = this.state.groups.findIndex((entry) => entry.id === group.id);
        if (index >= 0) this.state.groups[index] = group;
        else this.state.groups.push(group);
    }

    async ensureReady() {
        if (this.engine) {
            this.state.diagnostics.ready = true;
            this.persist();
            return this.engine;
        }
        if (!this.readyPromise) {
            this.readyPromise = (async () => {
                try {
                    const [
                        { ObservationalMemory },
                        { LibSQLStore }
                    ] = await Promise.all([
                        import('@mastra/memory/processors'),
                        import('@mastra/libsql')
                    ]);
                    this.store = new LibSQLStore({
                        id: safeIdentifier(
                            `ailis-mastra-${stableHash(this.rootDir).slice(0, 16)}`
                        ),
                        url: `file:${this.databasePath.replace(/\\/g, '/')}`
                    });
                    await this.store.init();
                    const model = createAilisLanguageModel(this.llmClient, {
                        onCall: () => {
                            this.state.diagnostics.modelCallCount += 1;
                        }
                    });
                    this.engine = new ObservationalMemory({
                        storage: this.store.stores.memory,
                        model,
                        scope: 'resource',
                        retrieval: { vector: false, scope: 'resource' },
                        onIndexObservations: async (observation) => {
                            this.recordObservationGroup(observation);
                        },
                        shareTokenBudget: true,
                        observation: {
                            messageTokens: this.config.messageTokens,
                            maxTokensPerBatch: this.config.maxTokensPerBatch,
                             previousObserverTokens:
                                 this.config.previousObserverTokens,
                            bufferTokens: false
                        },
                        reflection: {
                            observationTokens: this.config.observationTokens
                        }
                    });
                    this.state.diagnostics.ready = true;
                    this.state.diagnostics.lastError = '';
                    this.persist();
                    return this.engine;
                } catch (error) {
                    this.state.diagnostics.ready = false;
                    this.state.diagnostics.lastError =
                        error?.message || String(error);
                    this.persist();
                    throw Object.assign(
                        new Error(
                            `official Mastra ObservationalMemory unavailable: ` +
                            `${this.state.diagnostics.lastError}`
                        ),
                        { code: 'official_mastra_runtime_unavailable' }
                    );
                }
            })();
        }
        return this.readyPromise;
    }

    async persistOfficialMessages(messages = []) {
        const memoryStore = this.store?.stores?.memory;
        if (!memoryStore || !messages.length) {
            return;
        }
        const byThread = new Map();
        for (const message of messages) {
            if (!byThread.has(message.threadId)) {
                byThread.set(message.threadId, []);
            }
            byThread.get(message.threadId).push(message);
        }
        for (const [threadId, threadMessages] of byThread) {
            const existing = await memoryStore.getThreadById({
                threadId,
                resourceId: this.state.resourceId
            });
            if (!existing) {
                const createdAt = threadMessages
                    .map((message) => new Date(message.createdAt))
                    .sort((left, right) => left - right)[0] || new Date();
                await memoryStore.saveThread({
                    thread: {
                        id: threadId,
                        title: `AILIS conversation ${threadId}`,
                        resourceId: this.state.resourceId,
                        createdAt,
                        updatedAt: new Date(
                            threadMessages.at(-1)?.createdAt || createdAt
                        ),
                        metadata: {
                            ailisPersonaMemory: true
                        }
                    }
                });
            }
        }
        await memoryStore.saveMessages({ messages });
    }

    curate({ events = [], maxBatches = 12 } = {}) {
        return this.withLock(async () => {
            const engine = await this.ensureReady();
            const counter = engine.getTokenCounter();
            const personaEvents = normalizeArray(events)
                .filter(isPersonaEvent)
                .filter((event) => normalizeText(event.id))
                .sort((left, right) =>
                    String(left.ts || '').localeCompare(String(right.ts || '')) ||
                    String(left.id || '').localeCompare(String(right.id || ''))
                );
            const ingested = new Set(this.state.ingestedEventIds);
            let pending = personaEvents
                .filter((event) =>
                    !ingested.has(normalizeText(event.id))
                );
            const batchLimit = Math.max(1, Math.min(Number(maxBatches) || 12, 128));
            const batches = [];
            this.activeSourceEventIds = personaEvents
                .map((event) => normalizeText(event.id))
                .filter(Boolean);
            this.activeSessionIds = [...new Set(
                personaEvents.map((event) =>
                    normalizeText(event.sessionId, 'main')
                )
            )];
            this.activeMessageSources = personaEvents.flatMap((event) =>
                eventMessages(event, this.state.resourceId).map((message) => ({
                    messageId: message.id,
                    eventId: normalizeText(event.id),
                    sessionId: normalizeText(event.sessionId, 'main'),
                    threadId: message.threadId
                }))
            );
            try {
                while (pending.length && batches.length < batchLimit) {
                    const selected = batchEvents(
                        pending,
                        counter,
                        this.state.resourceId,
                        this.config.maxTokensPerBatch
                    );
                    if (!selected.length) break;
                    const sessionId = normalizeText(selected[0].sessionId, 'main');
                    const threadId = threadIdForSession(sessionId);
                    const messages = selected.flatMap((event) =>
                        eventMessages(event, this.state.resourceId)
                    );
                    await this.persistOfficialMessages(messages);
                    const result = await engine.observe({
                        threadId,
                        resourceId: this.state.resourceId
                    });
                    const processedEventCount = selected.length;
                    batches.push({
                        eventCount: selected.length,
                        processedEventCount,
                        messageCount: messages.length,
                        observed: result.observed,
                        reflected: result.reflected
                    });
                    this.state.ingestedEventIds.push(
                        ...selected.map((event) => normalizeText(event.id))
                    );
                    this.state.ingestedEventIds = [...new Set(
                        this.state.ingestedEventIds
                    )];
                    if (result.observed) {
                        this.state.diagnostics.observationPassCount += 1;
                    }
                    if (result.reflected) {
                        this.state.diagnostics.reflectionCount += 1;
                    }
                    const unobservedMessages = await engine.loadUnobservedMessages({
                        threadId,
                        resourceId: this.state.resourceId
                    });
                    const unobservedEventIds = new Set(
                        normalizeArray(unobservedMessages)
                            .map(messageEventId)
                            .filter(Boolean)
                    );
                    this.state.observedEventIds =
                        this.state.ingestedEventIds.filter((eventId) =>
                            !unobservedEventIds.has(eventId)
                        );
                    if (result.observed) {
                        this.state.diagnostics.lastObservedAt = safeIso(
                            selected.at(-1)?.ts,
                            new Date().toISOString()
                        );
                    }
                    pending = pending.slice(selected.length);
                    this.persist();
                }
                const observed = new Set(this.state.observedEventIds);
                const unobservedEvents = personaEvents.filter((event) =>
                    !observed.has(normalizeText(event.id))
                );
                const retainedRawTail = rawTail(
                    unobservedEvents,
                    counter,
                    this.state.resourceId,
                    this.config.rawTailTokens
                );
                const remainingEntryCount = pending.length;
                const status = remainingEntryCount
                    ? 'partial_completed'
                    : 'completed';
                return {
                    ok: true,
                    status,
                    run: {
                        status,
                        processedEntryCount: batches.reduce(
                            (sum, batch) => sum + batch.processedEventCount,
                            0
                        ),
                        batchCount: batches.length,
                        remainingEntryCount,
                        pendingEntryCount: unobservedEvents.length,
                        rawTailEntryCount: retainedRawTail.length,
                        batches
                    },
                    statusDetail: this.publicStatus()
                };
            } catch (error) {
                this.state.diagnostics.lastError =
                    error?.message || String(error);
                this.persist();
                return {
                    ok: false,
                    status: 'failed',
                    error: this.state.diagnostics.lastError,
                    run: {
                        processedEntryCount: batches.reduce(
                            (sum, batch) => sum + batch.processedEventCount,
                            0
                        ),
                        batchCount: batches.length,
                        remainingEntryCount: pending.length,
                        pendingEntryCount: pending.length,
                        rawTailEntryCount: 0,
                        batches
                    },
                    statusDetail: this.publicStatus()
                };
            } finally {
                this.activeSourceEventIds = [];
                this.activeSessionIds = [];
                this.activeMessageSources = [];
            }
        });
    }

    async buildContext({ events = [], maxChars = 280_000 } = {}) {
        const engine = await this.ensureReady();
        const counter = engine.getTokenCounter();
        const observations = normalizeText(
            await engine.getObservations(
                threadIdForSession('main'),
                this.state.resourceId
            )
        );
        const observed = new Set(this.state.observedEventIds);
        const pending = normalizeArray(events)
            .filter(isPersonaEvent)
            .filter((event) => !observed.has(normalizeText(event.id)))
            .sort((left, right) =>
                String(left.ts || '').localeCompare(String(right.ts || '')) ||
                String(left.id || '').localeCompare(String(right.id || ''))
            );
        const tail = rawTail(
            pending,
            counter,
            this.state.resourceId,
            this.config.rawTailTokens
        );
        const sections = [];
        if (observations) {
            sections.push([
                '### Official Mastra Observational Memory',
                observations
            ].join('\n'));
        }
        if (tail.length) {
            sections.push([
                '### Recent unobserved AILIS conversation',
                rawTailText(tail)
            ].join('\n'));
        }
        const groupDocuments = this.state.groups
            .filter((group) => normalizeText(group.text))
            .map((group) => ({
                id: `mastra-observation:${group.id}`,
                kind: 'observation',
                lane: 'observation',
                text: group.text,
                time: group.observedAt,
                sessionId: group.sessionIds?.[0] || '',
                sourceEventIds: [...normalizeArray(group.sourceEventIds)],
                sourceRefs: normalizeArray(group.sourceEventIds).map(
                    (eventId) => ({ eventId })
                ),
                structured: group
            }));
        const rawDocuments = tail.map((event) => ({
            id: `mastra-raw:${normalizeText(event.id)}`,
            kind: 'turn',
            lane: 'conversation',
            text: rawTailText([event]),
            time: safeIso(event.ts),
            sessionId: normalizeText(event.sessionId),
            sourceEventIds: [normalizeText(event.id)],
            sourceRefs: [{
                eventId: normalizeText(event.id),
                sessionId: normalizeText(event.sessionId),
                occurredAt: safeIso(event.ts)
            }]
        }));
        const documents = groupDocuments.length
            ? [...groupDocuments, ...rawDocuments]
            : observations
                ? [{
                    id: 'mastra-observations:active',
                    kind: 'observation',
                    lane: 'observation',
                    text: observations,
                    sourceEventIds: [...this.state.observedEventIds],
                    sourceRefs: this.state.observedEventIds.map(
                        (eventId) => ({ eventId })
                    )
                }, ...rawDocuments]
                : rawDocuments;
        return {
            ok: true,
            contextText: sections.join('\n\n').slice(
                0,
                Math.max(500, Number(maxChars) || 280_000)
            ),
            documents,
            sourceEventIds: [...new Set(
                documents.flatMap((document) =>
                    normalizeArray(document.sourceEventIds)
                )
            )],
            diagnostics: {
                upstream: this.state.upstream,
                officialEngine: 'ObservationalMemory',
                officialStorage: 'LibSQLStore.stores.memory',
                scope: 'resource',
                observationChars: observations.length,
                ingestedEventCount: this.state.ingestedEventIds.length,
                observedEventCount: this.state.observedEventIds.length,
                rawTailEventCount: tail.length,
                rawTailTokens: counter.countMessages(
                    tail.flatMap((event) =>
                        eventMessages(event, this.state.resourceId)
                    )
                ),
                groupCount: this.state.groups.length
            }
        };
    }

    publicStatus() {
        return {
            upstream: this.state.upstream,
            statePath: this.statePath,
            databasePath: this.databasePath,
            resourceId: this.state.resourceId,
            ingestedEventCount: this.state.ingestedEventIds.length,
            observedEventCount: this.state.observedEventIds.length,
            groupCount: this.state.groups.length,
            config: { ...this.config },
            diagnostics: { ...this.state.diagnostics }
        };
    }

    getStatus() {
        return this.publicStatus();
    }

    async shutdown() {
        await this.store?.close?.();
        this.state.diagnostics.ready = false;
        this.persist();
    }
}

module.exports = {
    AILISMastraOfficialMemory,
    DATABASE_FILE,
    STATE_FILE,
    UPSTREAM_LIBSQL_VERSION,
    UPSTREAM_MEMORY_VERSION,
    createAilisLanguageModel,
    eventMessages,
    isPersonaEvent,
    promptMessages,
    threadIdForSession
};
