'use strict';

const fs = require('fs');
const path = require('path');
const { randomUUID } = require('crypto');

const STATE_VERSION = 1;
const STATE_FILE = 'mastra-observational-full-v1.json';
const DEFAULT_MESSAGE_TOKENS = 30_000;
const DEFAULT_OBSERVATION_TOKENS = 40_000;
const DEFAULT_BATCH_TOKENS = 10_000;
const DEFAULT_PREVIOUS_OBSERVER_TOKENS = 2_000;
const DEFAULT_RAW_TAIL_TOKENS = 6_000;

const REFLECTOR_SYSTEM_PROMPT = `You are the memory consciousness of an AI assistant.
Your reflected observations will be the ONLY durable information the assistant has
about past interactions with this user.

The Observer created dated, priority-marked observations from raw conversations.
Reorganize and compress those observations while preserving information needed for
future continuity: user assertions, exact names and identifiers, dates, quantities,
preferences, state changes, commitments, decisions, assistant-provided results,
unresolved work, and explicit completion outcomes.

Rules:
- User assertions about their own life are authoritative.
- Prefer newer dated state when facts conflict, but retain historical state when it
  may answer a past-tense or before/after question.
- Merge repetition and procedural traces; preserve concrete outcomes.
- Keep unusual user wording when it may be needed verbatim.
- Keep the dated observation format and priority emojis.
- Preserve observation-group XML ranges whenever their source observation survives.
- Do not invent, infer, or repair facts absent from the supplied observations.
- Output an <observations> block. Optionally output <suggested-response>.

The output replaces the entire previous observation memory, so omissions are
destructive.`;

const COMPRESSION_GUIDANCE = Object.freeze([
    '',
    'Compress gently. Merge repeated observations and repeated tool activity while preserving names, dates, quantities, preferences, state changes, and completion outcomes.',
    'Compress aggressively. Consolidate older related observations into fewer dated lines, retain greater detail for recent information, and remove redundant process details.',
    'Use critical compression. Summarize the oldest 50-70% into high-level outcomes, preserve recent facts and unresolved state, and collapse all procedural sequences.',
    'Use extreme compression. Keep only durable user facts, preferences, changes, key decisions, exact identifiers, final outcomes, and unresolved commitments. Preserve the standard dated observation format.'
]);

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

function defaultState() {
    const now = new Date().toISOString();
    return {
        version: STATE_VERSION,
        upstream: {
            package: '@mastra/memory',
            version: '1.24.0',
            alignment: 'official_source_aligned_reproduction'
        },
        createdAt: now,
        updatedAt: now,
        config: {
            messageTokens: DEFAULT_MESSAGE_TOKENS,
            observationTokens: DEFAULT_OBSERVATION_TOKENS,
            maxTokensPerBatch: DEFAULT_BATCH_TOKENS,
            previousObserverTokens: DEFAULT_PREVIOUS_OBSERVER_TOKENS,
            rawTailTokens: DEFAULT_RAW_TAIL_TOKENS,
            bufferTokens: Math.round(DEFAULT_MESSAGE_TOKENS * 0.2),
            bufferActivation: 0.8
        },
        observedEventIds: [],
        bufferedEventIds: [],
        bufferedChunks: [],
        observations: '',
        currentTask: '',
        suggestedResponse: '',
        reflectionCount: 0,
        observerCallCount: 0,
        lastObservedAt: '',
        groups: [],
        diagnostics: {
            observationTokenCount: 0,
            pendingMessageTokenCount: 0,
            lastError: ''
        }
    };
}

function normalizeState(raw, config = {}) {
    const fallback = defaultState();
    const source = raw && typeof raw === 'object' ? raw : {};
    return {
        ...fallback,
        ...source,
        version: STATE_VERSION,
        upstream: { ...fallback.upstream, ...(source.upstream || {}) },
        config: {
            ...fallback.config,
            ...(source.config || {}),
            ...config
        },
        observedEventIds: Array.isArray(source.observedEventIds)
            ? [...new Set(source.observedEventIds.map((entry) => normalizeText(entry)).filter(Boolean))]
            : [],
        bufferedEventIds: Array.isArray(source.bufferedEventIds)
            ? [...new Set(source.bufferedEventIds.map((entry) => normalizeText(entry)).filter(Boolean))]
            : [],
        bufferedChunks: Array.isArray(source.bufferedChunks)
            ? source.bufferedChunks.filter((entry) => entry && typeof entry === 'object')
            : [],
        observations: normalizeText(source.observations),
        currentTask: normalizeText(source.currentTask),
        suggestedResponse: normalizeText(source.suggestedResponse),
        groups: Array.isArray(source.groups)
            ? source.groups.filter((entry) => entry && typeof entry === 'object')
            : [],
        diagnostics: { ...fallback.diagnostics, ...(source.diagnostics || {}) }
    };
}

function isPersonaEvent(event = {}) {
    const source = normalizeText(event.source).toLowerCase();
    const sessionId = normalizeText(event.sessionId).toLowerCase();
    return !source.includes('task-agent') &&
        !source.includes('task_agent') &&
        !sessionId.includes(':task-agent:') &&
        !sessionId.includes(':task_agent:');
}

function eventMessages(event = {}) {
    const createdAt = new Date(safeIso(event.ts, new Date().toISOString()));
    const userText = normalizeText(event.userText);
    const assistantText = normalizeText(event.assistantText);
    const messages = [];
    if (userText) {
        messages.push({
            id: `${normalizeText(event.id, randomUUID())}:user`,
            role: 'user',
            createdAt,
            content: {
                format: 2,
                parts: [{ type: 'text', text: userText }]
            }
        });
    }
    if (assistantText) {
        messages.push({
            id: `${normalizeText(event.id, randomUUID())}:assistant`,
            role: 'assistant',
            createdAt: new Date(createdAt.getTime() + 1),
            content: {
                format: 2,
                parts: [{ type: 'text', text: assistantText }]
            }
        });
    }
    return messages;
}

function llmText(result) {
    const candidates = [
        result?.text,
        result?.output_text,
        result?.output,
        result?.content,
        result?.message?.content,
        result?.choices?.[0]?.message?.content
    ].flatMap((entry) => Array.isArray(entry)
        ? entry.map((item) => item?.text || item?.content || item)
        : [entry]);
    return candidates.map((entry) => normalizeText(
        typeof entry === 'string' ? entry : JSON.stringify(entry || '')
    )).find(Boolean) || '';
}

function takeTextTailByTokens(text, maxTokens, counter) {
    const normalized = normalizeText(text);
    if (!normalized || counter.countString(normalized) <= maxTokens) {
        return normalized;
    }
    const lines = normalized.split(/\r?\n/);
    const selected = [];
    let tokens = 0;
    for (let index = lines.length - 1; index >= 0; index -= 1) {
        const lineTokens = counter.countString(lines[index]);
        if (selected.length && tokens + lineTokens > maxTokens) {
            break;
        }
        selected.unshift(lines[index]);
        tokens += lineTokens;
    }
    return selected.join('\n').trim();
}

function selectOldestBatch(events, {
    maxBatchTokens,
    retainTailTokens,
    counter
}) {
    const eventTokens = events.map((event) => ({
        event,
        tokens: counter.countMessages(eventMessages(event))
    }));
    const totalTokens = eventTokens.reduce((sum, entry) => sum + entry.tokens, 0);
    const removableTokens = Math.max(0, totalTokens - retainTailTokens);
    const targetTokens = Math.min(maxBatchTokens, removableTokens);
    if (targetTokens <= 0) {
        return { events: [], tokens: 0, totalTokens };
    }
    const selected = [];
    let selectedTokens = 0;
    for (const entry of eventTokens) {
        if (selected.length && selectedTokens + entry.tokens > targetTokens) {
            break;
        }
        selected.push(entry.event);
        selectedTokens += entry.tokens;
        if (selectedTokens >= targetTokens) {
            break;
        }
    }
    return { events: selected, tokens: selectedTokens, totalTokens };
}

function groupRange(events) {
    const ids = events.map((event) => normalizeText(event.id)).filter(Boolean);
    return ids.length ? `${ids[0]}:${ids.at(-1)}` : '';
}

function wrapObservationGroup(observations, range) {
    const text = normalizeText(observations);
    if (!text) {
        return '';
    }
    return range
        ? `<observation-group range="${range}">\n${text}\n</observation-group>`
        : text;
}

class AILISMastraObservationalMemory {
    constructor(options = {}) {
        this.rootDir = path.resolve(options.rootDir || process.cwd());
        this.statePath = path.join(this.rootDir, STATE_FILE);
        this.llmClient = typeof options.llmClient === 'function' ? options.llmClient : null;
        this.config = {
            messageTokens: Math.max(1_000, Number(options.messageTokens) || DEFAULT_MESSAGE_TOKENS),
            observationTokens: Math.max(2_000, Number(options.observationTokens) || DEFAULT_OBSERVATION_TOKENS),
            maxTokensPerBatch: Math.max(1_000, Number(options.maxTokensPerBatch) || DEFAULT_BATCH_TOKENS),
            previousObserverTokens: Math.max(
                0,
                Number(options.previousObserverTokens ?? DEFAULT_PREVIOUS_OBSERVER_TOKENS)
            ),
            rawTailTokens: Math.max(
                0,
                Number(options.rawTailTokens ?? DEFAULT_RAW_TAIL_TOKENS)
            ),
            bufferTokens: Math.max(
                1_000,
                Number(options.bufferTokens) ||
                Math.round(
                    (Number(options.messageTokens) || DEFAULT_MESSAGE_TOKENS) * 0.2
                )
            ),
            bufferActivation: Math.max(
                0,
                Math.min(1, Number(options.bufferActivation ?? 0.8))
            )
        };
        this.state = normalizeState(readJson(this.statePath, null), this.config);
        this.upstream = null;
        this.operation = Promise.resolve();
        this.persist();
    }

    async ensureUpstream() {
        if (!this.upstream) {
            this.upstream = await import('@mastra/memory/processors');
        }
        return this.upstream;
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

    async callModel(system, prompt, { temperature = 0.3, maxTokens = 32_000 } = {}) {
        if (!this.llmClient) {
            throw new Error('Mastra Observational Memory requires an Observer/Reflector LLM client');
        }
        const result = await this.llmClient({
            messages: [
                { role: 'system', content: system },
                { role: 'user', content: prompt }
            ],
            temperature,
            max_tokens: maxTokens,
            timeoutMs: 180_000
        });
        if (result?.ok === false) {
            throw new Error(result.error || result.message || 'Observer/Reflector model call failed');
        }
        const text = llmText(result);
        if (!text) {
            throw new Error('Observer/Reflector returned empty output');
        }
        return text;
    }

    async observeBatch(events, upstream, counter, { buffered = false } = {}) {
        const messages = events.flatMap(eventMessages);
        const priorObservations = [
            this.state.observations,
            ...this.state.bufferedChunks.map((chunk) => chunk.observationText)
        ].filter(Boolean).join('\n\n');
        const previous = this.config.previousObserverTokens > 0
            ? takeTextTailByTokens(
                priorObservations,
                this.config.previousObserverTokens,
                counter
            )
            : '';
        const prompt = upstream.buildObserverPrompt(previous, messages, {
            skipContinuationHints: false
        });
        const output = await this.callModel(
            upstream.buildObserverSystemPrompt(),
            prompt,
            { temperature: 0.3 }
        );
        const parsed = upstream.parseObserverOutput(output);
        const observations = normalizeText(parsed?.observations);
        if (!observations || parsed?.degenerate) {
            throw new Error(parsed?.degenerate
                ? 'Observer produced degenerate repeated output'
                : 'Observer produced no observations');
        }
        const range = groupRange(events);
        const grouped = wrapObservationGroup(observations, range);
        const group = {
            id: randomUUID(),
            range,
            sourceEventIds: events.map((event) => normalizeText(event.id)).filter(Boolean),
            sessionIds: [...new Set(events.map((event) => normalizeText(event.sessionId)).filter(Boolean))],
            observedAt: new Date().toISOString(),
            observationText: observations
        };
        if (buffered) {
            this.state.bufferedChunks.push({
                ...group,
                groupedText: grouped,
                messageTokens: counter.countMessages(messages)
            });
            this.state.bufferedEventIds.push(...group.sourceEventIds);
            this.state.bufferedEventIds = [...new Set(this.state.bufferedEventIds)];
        } else {
            this.state.observations = [this.state.observations, grouped]
                .filter(Boolean)
                .join('\n\n');
            this.state.groups.push(group);
            this.state.observedEventIds.push(...group.sourceEventIds);
            this.state.observedEventIds = [...new Set(this.state.observedEventIds)];
        }
        this.state.currentTask = normalizeText(parsed.currentTask, this.state.currentTask);
        this.state.suggestedResponse = normalizeText(
            parsed.suggestedContinuation,
            this.state.suggestedResponse
        );
        this.state.lastObservedAt = safeIso(events.at(-1)?.ts, new Date().toISOString());
        this.state.observerCallCount += 1;
        return {
            sourceEventCount: events.length,
            observationChars: observations.length,
            range
        };
    }

    activateBufferedChunks(totalPendingTokens) {
        if (totalPendingTokens < this.config.messageTokens ||
            !this.state.bufferedChunks.length) {
            return {
                activatedChunkCount: 0,
                activatedMessageTokens: 0
            };
        }
        const retentionFloor = this.config.rawTailTokens;
        const targetRemoval = Math.max(0, totalPendingTokens - retentionFloor);
        const activated = [];
        let activatedMessageTokens = 0;
        for (const chunk of this.state.bufferedChunks) {
            activated.push(chunk);
            activatedMessageTokens += Number(chunk.messageTokens) || 0;
            if (activatedMessageTokens >= targetRemoval) {
                break;
            }
        }
        if (!activated.length) {
            return {
                activatedChunkCount: 0,
                activatedMessageTokens: 0
            };
        }
        const activatedIds = new Set(activated.map((chunk) => chunk.id));
        for (const chunk of activated) {
            this.state.observations = [
                this.state.observations,
                chunk.groupedText || wrapObservationGroup(
                    chunk.observationText,
                    chunk.range
                )
            ].filter(Boolean).join('\n\n');
            this.state.groups.push({
                id: chunk.id,
                range: chunk.range,
                sourceEventIds: chunk.sourceEventIds,
                sessionIds: chunk.sessionIds,
                observedAt: chunk.observedAt,
                observationText: chunk.observationText
            });
            this.state.observedEventIds.push(...(chunk.sourceEventIds || []));
        }
        this.state.observedEventIds = [...new Set(this.state.observedEventIds)];
        this.state.bufferedChunks = this.state.bufferedChunks.filter(
            (chunk) => !activatedIds.has(chunk.id)
        );
        const stillBuffered = new Set(
            this.state.bufferedChunks.flatMap((chunk) => chunk.sourceEventIds || [])
        );
        this.state.bufferedEventIds = [...stillBuffered];
        return {
            activatedChunkCount: activated.length,
            activatedMessageTokens
        };
    }

    async maybeReflect(upstream, counter) {
        const source = normalizeText(this.state.observations);
        const sourceTokens = counter.countObservations(source);
        if (sourceTokens < this.config.observationTokens) {
            return { reflected: false, sourceTokens, reflectedTokens: sourceTokens };
        }
        let lastError = '';
        for (let level = 0; level < COMPRESSION_GUIDANCE.length; level += 1) {
            const prompt = [
                '## OBSERVATIONS TO REFLECT ON',
                '',
                source,
                '',
                '---',
                '',
                'Produce a refined, condensed version that becomes the entire durable memory.',
                COMPRESSION_GUIDANCE[level]
                    ? `\n## COMPRESSION REQUIRED\n\n${COMPRESSION_GUIDANCE[level]}`
                    : '',
                '',
                'Output <observations> every time.'
            ].join('\n');
            try {
                const output = await this.callModel(
                    REFLECTOR_SYSTEM_PROMPT,
                    prompt,
                    { temperature: 0 }
                );
                const parsed = upstream.parseObserverOutput(output);
                if (parsed?.degenerate || !normalizeText(parsed?.observations)) {
                    throw new Error('Reflector produced invalid or degenerate output');
                }
                const reconciled = upstream.reconcileObservationGroupsFromReflection(
                    parsed.observations,
                    source
                ) || parsed.observations;
                const reflectedTokens = counter.countObservations(reconciled);
                if (reflectedTokens >= sourceTokens ||
                    reflectedTokens >= this.config.observationTokens) {
                    lastError = `compression level ${level} returned ${reflectedTokens} tokens`;
                    continue;
                }
                this.state.observations = reconciled;
                this.state.suggestedResponse = normalizeText(
                    parsed.suggestedContinuation,
                    this.state.suggestedResponse
                );
                this.state.reflectionCount += 1;
                return {
                    reflected: true,
                    compressionLevel: level,
                    sourceTokens,
                    reflectedTokens
                };
            } catch (error) {
                lastError = error?.message || String(error);
            }
        }
        throw new Error(
            `Mastra Reflector could not compress below ${this.config.observationTokens} tokens: ${lastError}`
        );
    }

    curate({ events = [], maxBatches = 12 } = {}) {
        return this.withLock(async () => {
            const upstream = await this.ensureUpstream();
            const counter = new upstream.TokenCounter();
            const observed = new Set(this.state.observedEventIds);
            const buffered = new Set(this.state.bufferedEventIds);
            let pending = events
                .filter(isPersonaEvent)
                .filter((event) => normalizeText(event.id) && !observed.has(event.id))
                .sort((left, right) =>
                    String(left.ts || '').localeCompare(String(right.ts || '')) ||
                    String(left.id || '').localeCompare(String(right.id || ''))
                );
            const passLimit = Math.max(1, Math.min(Number(maxBatches) || 12, 128));
            const batches = [];
            let pendingTokens = counter.countMessages(pending.flatMap(eventMessages));
            try {
                let unbuffered = pending.filter((event) => !buffered.has(event.id));
                let unbufferedTokens = counter.countMessages(
                    unbuffered.flatMap(eventMessages)
                );
                while (batches.length < passLimit) {
                    const bufferedTokens = this.state.bufferedChunks.reduce(
                        (sum, chunk) => sum + (Number(chunk.messageTokens) || 0),
                        0
                    );
                    const activationShortfall = Math.max(
                        0,
                        pendingTokens - this.config.rawTailTokens - bufferedTokens
                    );
                    if (
                        unbufferedTokens < this.config.bufferTokens &&
                        activationShortfall <= 0
                    ) {
                        break;
                    }
                    const batch = selectOldestBatch(unbuffered, {
                        maxBatchTokens: this.config.maxTokensPerBatch,
                        retainTailTokens: 0,
                        counter
                    });
                    if (!batch.events.length) {
                        break;
                    }
                    batches.push(await this.observeBatch(
                        batch.events,
                        upstream,
                        counter,
                        { buffered: true }
                    ));
                    const consumed = new Set(batch.events.map((event) => event.id));
                    unbuffered = unbuffered.filter(
                        (event) => !consumed.has(event.id)
                    );
                    unbufferedTokens = counter.countMessages(
                        unbuffered.flatMap(eventMessages)
                    );
                }
                const activation = this.activateBufferedChunks(pendingTokens);
                const activeObserved = new Set(this.state.observedEventIds);
                pending = pending.filter((event) => !activeObserved.has(event.id));
                pendingTokens = counter.countMessages(pending.flatMap(eventMessages));
                const reflection = await this.maybeReflect(upstream, counter);
                this.state.diagnostics = {
                    observationTokenCount: counter.countObservations(this.state.observations),
                    pendingMessageTokenCount: pendingTokens,
                    bufferedChunkCount: this.state.bufferedChunks.length,
                    bufferedMessageTokenCount: this.state.bufferedChunks.reduce(
                        (sum, chunk) => sum + (Number(chunk.messageTokens) || 0),
                        0
                    ),
                    lastError: ''
                };
                this.persist();
                const remainingEntryCount = pending.length;
                return {
                    ok: true,
                    status: pendingTokens >= this.config.messageTokens &&
                        activation.activatedChunkCount === 0
                        ? 'partial_completed'
                        : 'completed',
                    run: {
                        processedEntryCount: batches.reduce(
                            (sum, batch) => sum + batch.sourceEventCount,
                            0
                        ),
                        evidenceCount: batches.reduce(
                            (sum, batch) => sum + batch.sourceEventCount,
                            0
                        ),
                        batchCount: batches.length,
                        unitCount: 0,
                        observationCount: this.state.groups.length,
                        mentalModelCount: reflection.reflected ? 1 : 0,
                        supersededCount: 0,
                        remainingEntryCount
                    },
                    reflection,
                    activation
                };
            } catch (error) {
                this.state.diagnostics.lastError = error?.message || String(error);
                this.persist();
                return {
                    ok: false,
                    status: 'observational_memory_failed',
                    error: this.state.diagnostics.lastError,
                    run: {
                        processedEntryCount: batches.reduce(
                            (sum, batch) => sum + batch.sourceEventCount,
                            0
                        ),
                        evidenceCount: 0,
                        batchCount: batches.length,
                        unitCount: 0,
                        observationCount: this.state.groups.length,
                        mentalModelCount: 0,
                        supersededCount: 0,
                        remainingEntryCount: pending.length
                    }
                };
            }
        });
    }

    async buildContext({ events = [], maxChars = 24_000 } = {}) {
        const upstream = await this.ensureUpstream();
        const counter = new upstream.TokenCounter();
        const observed = new Set(this.state.observedEventIds);
        const rawTail = events
            .filter(isPersonaEvent)
            .filter((event) => !observed.has(normalizeText(event.id)))
            .sort((left, right) => String(left.ts || '').localeCompare(String(right.ts || '')));
        const optimized = upstream.optimizeObservationsForContext(this.state.observations);
        const rawText = upstream.formatMessagesForObserver(rawTail.flatMap(eventMessages));
        const context = [
            upstream.OBSERVATION_CONTEXT_PROMPT,
            '',
            '<observations>',
            optimized || '(No durable observations yet.)',
            '</observations>',
            '',
            upstream.OBSERVATION_CONTEXT_INSTRUCTIONS,
            '',
            this.state.suggestedResponse
                ? `<suggested-response>\n${this.state.suggestedResponse}\n</suggested-response>`
                : '',
            rawText
                ? `\n## Recent unobserved conversation\n\n${rawText}`
                : '',
            '',
            upstream.OBSERVATION_CONTINUATION_HINT
        ].filter((entry) => entry !== '').join('\n');
        const sourceEventIds = [
            ...this.state.groups.flatMap((group) => group.sourceEventIds || []),
            ...rawTail.map((event) => event.id)
        ];
        return {
            contextText: context.slice(0, Math.max(1_000, Number(maxChars) || 24_000)),
            sourceEventIds: [...new Set(sourceEventIds.filter(Boolean))],
            documents: [
                ...this.state.groups.map((group) => ({
                    id: `mastra-observation:${group.id}`,
                    kind: 'observation',
                    lane: 'observation',
                    text: group.observationText,
                    time: group.observedAt,
                    sourceEventIds: group.sourceEventIds || [],
                    sourceRefs: (group.sourceEventIds || []).map((eventId) => ({ eventId }))
                })),
                ...rawTail.map((event) => ({
                    id: `turn:${event.id}`,
                    kind: 'turn',
                    lane: 'raw_tail',
                    text: [
                        event.userText ? `User: ${event.userText}` : '',
                        event.assistantText ? `AILIS: ${event.assistantText}` : ''
                    ].filter(Boolean).join('\n'),
                    time: safeIso(event.ts),
                    sourceEventIds: [event.id],
                    sourceRefs: [{
                        eventId: event.id,
                        sessionId: event.sessionId,
                        occurredAt: safeIso(event.ts)
                    }]
                }))
            ],
            diagnostics: {
                upstream: this.state.upstream,
                observationTokens: counter.countObservations(this.state.observations),
                rawTailTokens: counter.countMessages(rawTail.flatMap(eventMessages)),
                observerCallCount: this.state.observerCallCount,
                reflectionCount: this.state.reflectionCount,
                groupCount: this.state.groups.length,
                bufferedChunkCount: this.state.bufferedChunks.length,
                bufferedEventCount: this.state.bufferedEventIds.length
            }
        };
    }

    getStatus() {
        return {
            statePath: this.statePath,
            upstream: this.state.upstream,
            config: { ...this.state.config },
            observedEventCount: this.state.observedEventIds.length,
            bufferedEventCount: this.state.bufferedEventIds.length,
            bufferedChunkCount: this.state.bufferedChunks.length,
            observationGroupCount: this.state.groups.length,
            observerCallCount: this.state.observerCallCount,
            reflectionCount: this.state.reflectionCount,
            diagnostics: { ...this.state.diagnostics }
        };
    }
}

module.exports = {
    AILISMastraObservationalMemory,
    DEFAULT_MESSAGE_TOKENS,
    DEFAULT_OBSERVATION_TOKENS,
    STATE_FILE
};
