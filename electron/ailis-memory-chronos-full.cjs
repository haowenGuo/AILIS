'use strict';

const fs = require('fs');
const path = require('path');
const { createHash, randomUUID } = require('crypto');
const {
    StrictCrossEncoderRuntime,
    StrictDenseRuntime,
    cosineSimilarity,
    rawDocuments
} = require('./ailis-memory-hybrid-full.cjs');

const STATE_VERSION = 1;
const STATE_FILE = 'chronos-full-v1.json';
const EXTRACTION_BATCH_SIZE = 25;
const EXTRACTION_BATCH_OVERLAP = 5;
const INITIAL_DENSE_K = 100;
const INITIAL_RERANK_K = 15;
const DEFAULT_AGENT_STEPS = 6;
const EXTRACTION_SCHEMA_ATTEMPTS = 2;

const TOOL_NAMES = new Set([
    'search_turns',
    'search_events',
    'grep_turns',
    'grep_events',
    'finish'
]);

function normalizeText(value, fallback = '') {
    if (typeof value !== 'string') {
        return fallback;
    }
    const normalized = value.replace(/\s+/g, ' ').trim();
    return normalized || fallback;
}

function normalizeArray(value) {
    if (!value) {
        return [];
    }
    return Array.isArray(value) ? value : [value];
}

function safeIso(value, fallback = '') {
    const parsed = Date.parse(normalizeText(value));
    return Number.isFinite(parsed) ? new Date(parsed).toISOString() : fallback;
}

function stableHash(...parts) {
    return createHash('sha256')
        .update(parts.map((part) => String(part || '')).join('\n'))
        .digest('hex');
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

function parseJson(value) {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
        return value;
    }
    const text = normalizeText(value);
    if (!text) {
        return null;
    }
    try {
        return JSON.parse(text);
    } catch {}
    const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (fenced?.[1]) {
        try {
            return JSON.parse(fenced[1]);
        } catch {}
    }
    return null;
}

function llmObject(result) {
    return [
        result?.structuredContent,
        result?.content,
        result?.text,
        result?.output_text,
        result?.output,
        result?.message?.content,
        result?.choices?.[0]?.message?.content
    ].flatMap((entry) => Array.isArray(entry)
        ? entry.map((item) => item?.text || item?.content || item)
        : [entry]
    ).map(parseJson).find(Boolean) || null;
}

function isPersonaEvent(event = {}) {
    const source = normalizeText(event.source).toLowerCase();
    const sessionId = normalizeText(event.sessionId).toLowerCase();
    return !source.includes('task-agent') &&
        !source.includes('task_agent') &&
        !sessionId.includes(':task-agent:') &&
        !sessionId.includes(':task_agent:');
}

function defaultState() {
    const now = new Date().toISOString();
    return {
        version: STATE_VERSION,
        upstream: {
            paper: 'arXiv:2603.16862v1',
            fidelity: 'paper_equivalent_reproduction'
        },
        createdAt: now,
        updatedAt: now,
        processedChunkDigests: [],
        eventCalendar: [],
        extractionRuns: [],
        diagnostics: {
            extractedEventCount: 0,
            processedChunkCount: 0,
            lastError: ''
        }
    };
}

function normalizeChronosEvent(raw, evidenceById) {
    const source = raw && typeof raw === 'object' ? raw : {};
    const subject = normalizeText(source.subject);
    const verb = normalizeText(source.verb);
    const object = normalizeText(source.object);
    const aliases = normalizeArray(
        source.aliases || source.lexicalAliases || source.lexical_aliases
    )
        .map((entry) => normalizeText(entry))
        .filter(Boolean);
    const sourceEventIds = [...new Set(normalizeArray(
        source.sourceEventIds ||
        source.source_event_ids ||
        source.sourceEventId ||
        source.source_event_id
    ).map((entry) => normalizeText(entry)).filter((id) => evidenceById.has(id)))];
    const start = safeIso(
        source.startDatetime ||
        source.start_datetime ||
        source.startDateTime ||
        source.startTime ||
        source.start_time
    );
    const end = safeIso(
        source.endDatetime ||
        source.end_datetime ||
        source.endDateTime ||
        source.endTime ||
        source.end_time
    );
    if (!subject || !verb || !object || !start || !end ||
        Date.parse(start) > Date.parse(end) ||
        aliases.length < 2 || aliases.length > 4 ||
        !sourceEventIds.length) {
        return null;
    }
    const firstEvidence = evidenceById.get(sourceEventIds[0]);
    const statement = `${subject} ${verb} ${object}`;
    return {
        id: normalizeText(source.id) || `chronos-${stableHash(
            statement,
            start,
            end,
            sourceEventIds.join(',')
        ).slice(0, 24)}`,
        subject,
        verb,
        object,
        statement,
        aliases,
        startDatetime: start,
        endDatetime: end,
        mentionedAt: safeIso(firstEvidence?.ts),
        sourceEventIds,
        sourceRefs: sourceEventIds.map((eventId) => {
            const event = evidenceById.get(eventId);
            return {
                eventId,
                sessionId: normalizeText(event?.sessionId),
                occurredAt: safeIso(event?.ts)
            };
        }),
        sessionId: normalizeText(firstEvidence?.sessionId),
        confidence: Math.max(0, Math.min(1, Number(source.confidence) || 0.8))
    };
}

function chronosCandidateDiagnostics(raw, evidenceById) {
    const source = raw && typeof raw === 'object' ? raw : {};
    const aliases = normalizeArray(
        source.aliases || source.lexicalAliases || source.lexical_aliases
    ).map((entry) => normalizeText(entry)).filter(Boolean);
    const suppliedSourceEventIds = normalizeArray(
        source.sourceEventIds ||
        source.source_event_ids ||
        source.sourceEventId ||
        source.source_event_id
    ).map((entry) => normalizeText(entry)).filter(Boolean);
    const start = safeIso(
        source.startDatetime ||
        source.start_datetime ||
        source.startDateTime ||
        source.startTime ||
        source.start_time
    );
    const end = safeIso(
        source.endDatetime ||
        source.end_datetime ||
        source.endDateTime ||
        source.endTime ||
        source.end_time
    );
    return {
        keys: Object.keys(source).sort(),
        hasSubject: Boolean(normalizeText(source.subject)),
        hasVerb: Boolean(normalizeText(source.verb)),
        hasObject: Boolean(normalizeText(source.object)),
        aliasCount: aliases.length,
        suppliedSourceEventIdCount: suppliedSourceEventIds.length,
        matchedSourceEventIdCount: suppliedSourceEventIds.filter((id) =>
            evidenceById.has(id)
        ).length,
        validStart: Boolean(start),
        validEnd: Boolean(end),
        orderedRange: Boolean(start && end && Date.parse(start) <= Date.parse(end))
    };
}

function normalizeState(raw) {
    const fallback = defaultState();
    const source = raw && typeof raw === 'object' ? raw : {};
    return {
        ...fallback,
        ...source,
        version: STATE_VERSION,
        upstream: { ...fallback.upstream, ...(source.upstream || {}) },
        processedChunkDigests: Array.isArray(source.processedChunkDigests)
            ? [...new Set(source.processedChunkDigests.map((entry) => normalizeText(entry)).filter(Boolean))]
            : [],
        eventCalendar: Array.isArray(source.eventCalendar)
            ? source.eventCalendar.filter((entry) => entry && typeof entry === 'object')
            : [],
        extractionRuns: Array.isArray(source.extractionRuns)
            ? source.extractionRuns.filter((entry) => entry && typeof entry === 'object').slice(-200)
            : [],
        diagnostics: { ...fallback.diagnostics, ...(source.diagnostics || {}) }
    };
}

function chronologicalEvents(events) {
    return events.filter(isPersonaEvent).slice().sort((left, right) =>
        String(left.ts || '').localeCompare(String(right.ts || '')) ||
        String(left.id || '').localeCompare(String(right.id || ''))
    );
}

function extractionTasks(events) {
    const bySession = new Map();
    for (const event of chronologicalEvents(events)) {
        const sessionId = normalizeText(event.sessionId, 'main');
        const current = bySession.get(sessionId) || [];
        current.push(event);
        bySession.set(sessionId, current);
    }
    const step = EXTRACTION_BATCH_SIZE - EXTRACTION_BATCH_OVERLAP;
    const tasks = [];
    for (const [sessionId, sessionEvents] of bySession) {
        for (let offset = 0; offset < sessionEvents.length; offset += step) {
            const chunk = sessionEvents.slice(offset, offset + EXTRACTION_BATCH_SIZE);
            if (!chunk.length) {
                continue;
            }
            tasks.push({
                sessionId,
                offset,
                events: chunk,
                digest: stableHash(
                    sessionId,
                    ...chunk.map((event) => `${event.id}:${event.ts}`)
                )
            });
            if (offset + EXTRACTION_BATCH_SIZE >= sessionEvents.length) {
                break;
            }
        }
    }
    return tasks;
}

function eventCalendarDocuments(events) {
    return events.map((event) => ({
        id: `chronos-event:${event.id}`,
        kind: 'event',
        lane: 'event',
        text: [
            event.statement,
            `start=${event.startDatetime}`,
            `end=${event.endDatetime}`,
            `aliases=${event.aliases.join(' | ')}`
        ].join('\n'),
        aliases: event.aliases,
        time: event.startDatetime,
        eventStart: event.startDatetime,
        eventEnd: event.endDatetime,
        sessionId: event.sessionId,
        sourceEventIds: event.sourceEventIds,
        sourceRefs: event.sourceRefs,
        structured: event
    }));
}

function eventOverlapsRange(document, range) {
    if (!range) {
        return true;
    }
    const documentStart = Date.parse(document.eventStart || document.time || '');
    const documentEnd = Date.parse(document.eventEnd || document.time || '');
    const rangeStart = Date.parse(range.start || '');
    const rangeEnd = Date.parse(range.end || '');
    if (!Number.isFinite(documentStart) || !Number.isFinite(documentEnd)) {
        return false;
    }
    return (!Number.isFinite(rangeStart) || documentEnd >= rangeStart) &&
        (!Number.isFinite(rangeEnd) || documentStart <= rangeEnd);
}

function normalizeRange(raw) {
    const start = safeIso(raw?.start);
    const end = safeIso(raw?.end);
    if (start && end && Date.parse(start) > Date.parse(end)) {
        return null;
    }
    return start || end ? { start, end } : null;
}

function normalizeGuidance(raw) {
    const source = raw && typeof raw === 'object' ? raw : {};
    const bullets = normalizeArray(source.guidance || source.bullets)
        .map((entry) => normalizeText(entry))
        .filter(Boolean)
        .slice(0, 5);
    return {
        targets: {
            entities: normalizeArray(source.targets?.entities)
                .map((entry) => normalizeText(entry))
                .filter(Boolean)
                .slice(0, 20),
            attributes: normalizeArray(source.targets?.attributes)
                .map((entry) => normalizeText(entry))
                .filter(Boolean)
                .slice(0, 20),
            operations: normalizeArray(source.targets?.operations)
                .map((entry) => normalizeText(entry))
                .filter(Boolean)
                .slice(0, 10),
            timeRange: normalizeRange(source.targets?.timeRange)
        },
        bullets,
        source: 'model'
    };
}

function normalizeToolAction(raw) {
    const source = raw && typeof raw === 'object' ? raw : {};
    const action = normalizeText(source.action).toLowerCase();
    if (!TOOL_NAMES.has(action)) {
        return null;
    }
    return {
        action,
        query: normalizeText(source.query),
        topK: Math.max(1, Math.min(Number(source.topK) || 10, 50)),
        timeRange: normalizeRange(source.timeRange),
        selectedIds: normalizeArray(source.selectedIds)
            .map((entry) => normalizeText(entry))
            .filter(Boolean)
            .slice(0, 60),
        evidenceGap: normalizeText(source.evidenceGap),
        rationale: normalizeText(source.rationale)
    };
}

function literalGrep(documents, query, timeRange) {
    const needle = normalizeText(query).toLocaleLowerCase();
    if (!needle) {
        return [];
    }
    return documents.filter((document) =>
        eventOverlapsRange(document, timeRange) &&
        [document.text, ...normalizeArray(document.aliases)]
            .join('\n')
            .toLocaleLowerCase()
            .includes(needle)
    );
}

function renderEvidence(documents, maxChars = 16_000) {
    const lines = [];
    const grouped = new Map();
    for (const document of documents) {
        const date = (document.eventStart || document.time || 'time unknown').slice(0, 10);
        const sessionId = normalizeText(document.sessionId, 'unknown session');
        const key = `${date}|${sessionId}`;
        const current = grouped.get(key) || [];
        current.push(document);
        grouped.set(key, current);
    }
    let sessionNumber = 0;
    for (const [key, group] of grouped) {
        sessionNumber += 1;
        const [date, sessionId] = key.split('|');
        lines.push(`### Session ${sessionNumber} (${date}; ${sessionId})`);
        for (const document of group) {
            lines.push(
                `- [${document.id}] ${document.text.replace(/\n+/g, ' | ')}`
            );
        }
    }
    return lines.join('\n').slice(0, Math.max(1_000, Number(maxChars) || 16_000));
}

class AILISChronosFullMemory {
    constructor(options = {}) {
        this.rootDir = path.resolve(options.rootDir || process.cwd());
        this.statePath = path.join(this.rootDir, STATE_FILE);
        this.llmClient = typeof options.llmClient === 'function' ? options.llmClient : null;
        this.maxAgentSteps = Math.max(
            1,
            Math.min(Number(options.maxAgentSteps) || DEFAULT_AGENT_STEPS, 20)
        );
        this.dense = new StrictDenseRuntime({
            enabled: options.enableLocalEmbeddings !== false,
            allowRemoteModels: options.allowRemoteModels,
            model: options.embeddingModel,
            revision: options.embeddingRevision,
            remoteHost: options.modelRemoteHost,
            cacheDir: options.modelCacheDir,
            embedder: options.embedder
        });
        this.crossEncoder = new StrictCrossEncoderRuntime({
            allowRemoteModels: options.allowRemoteModels,
            model: options.rerankerModel,
            revision: options.rerankerRevision,
            remoteHost: options.modelRemoteHost,
            cacheDir: options.modelCacheDir,
            reranker: options.reranker
        });
        this.state = normalizeState(readJson(this.statePath, null));
        this.operation = Promise.resolve();
        this.persist();
    }

    persist() {
        this.state.updatedAt = new Date().toISOString();
        this.state.diagnostics.extractedEventCount = this.state.eventCalendar.length;
        this.state.diagnostics.processedChunkCount = this.state.processedChunkDigests.length;
        atomicWriteJson(this.statePath, this.state);
    }

    withLock(callback) {
        const run = this.operation.then(callback, callback);
        this.operation = run.catch(() => {});
        return run;
    }

    async callModel(system, user, {
        temperature = 0,
        maxTokens = 8_000
    } = {}) {
        if (!this.llmClient) {
            throw Object.assign(
                new Error('Chronos full reproduction requires an LLM'),
                { code: 'chronos_model_unavailable' }
            );
        }
        const result = await this.llmClient({
            messages: [
                { role: 'system', content: system },
                { role: 'user', content: user }
            ],
            jsonMode: true,
            expectJson: true,
            outputFormat: 'json',
            temperature,
            max_tokens: maxTokens,
            timeoutMs: 180_000
        });
        if (result?.ok === false) {
            throw new Error(result.error || result.message || 'Chronos model call failed');
        }
        const parsed = llmObject(result);
        if (!parsed) {
            throw new Error('Chronos model returned invalid JSON');
        }
        return parsed;
    }

    async extractChunk(task) {
        const evidenceById = new Map(task.events.map((event) => [event.id, event]));
        const payload = task.events.map((event) => ({
            sourceEventId: event.id,
            conversationTimestamp: safeIso(event.ts),
            user: normalizeText(event.userText),
            assistant: normalizeText(event.assistantText)
        }));
        let previousCandidates = [];
        for (let attempt = 0; attempt < EXTRACTION_SCHEMA_ATTEMPTS; attempt += 1) {
            const repairing = attempt > 0;
            const result = await this.callModel(
                repairing
                    ? [
                        'You repair Chronos temporal events that failed strict schema validation.',
                        'Return corrected events only; do not explain the repair.',
                        'Every event must have non-empty subject, verb, object, startDatetime,',
                        'endDatetime, 2-4 lexical aliases, confidence, and sourceEventIds.',
                        'startDatetime/endDatetime must be valid ISO 8601 and start must not exceed end.',
                        'Every sourceEventId must be copied verbatim from allowedSourceEventIds.',
                        'Drop unsupported events. Return JSON: {"events":[...]}'
                    ].join('\n')
                    : [
                        'You are the Chronos temporal event extractor.',
                        'Extract only temporally grounded occurrences and state transitions.',
                        'Every event must have subject, verb, object, startDatetime, endDatetime,',
                        '2-4 lexical aliases using substantially different vocabulary, confidence,',
                        'and sourceEventIds drawn verbatim from the supplied batch.',
                        'Resolve relative time against each source conversationTimestamp.',
                        'Use ISO 8601 ranges that cover ambiguity rather than unjustified point dates.',
                        'Do not build a general knowledge graph and do not extract unsupported facts.',
                        'Return JSON: {"events":[...]}'
                    ].join('\n'),
                JSON.stringify({
                    sessionId: task.sessionId,
                    extractionBatchSize: EXTRACTION_BATCH_SIZE,
                    extractionBatchOverlap: EXTRACTION_BATCH_OVERLAP,
                    allowedSourceEventIds: payload.map((turn) => turn.sourceEventId),
                    turns: payload,
                    ...(repairing ? { invalidEvents: previousCandidates } : {})
                }, null, 2),
                { maxTokens: 16_000 }
            );
            const candidates = normalizeArray(result.events);
            const normalized = candidates
                .map((entry) => normalizeChronosEvent(entry, evidenceById))
                .filter(Boolean);
            if (!candidates.length || normalized.length) {
                return normalized;
            }
            previousCandidates = candidates;
        }
        throw Object.assign(
            new Error(
                `Chronos extractor produced ${previousCandidates.length} event(s), ` +
                `but none passed the full schema after ${EXTRACTION_SCHEMA_ATTEMPTS} attempts: ` +
                JSON.stringify(previousCandidates.map((candidate) =>
                    chronosCandidateDiagnostics(candidate, evidenceById)
                ))
            ),
            { code: 'chronos_schema_validation_failed' }
        );
    }

    curate({ events = [], maxBatches = 12 } = {}) {
        return this.withLock(async () => {
            const allTasks = extractionTasks(events);
            const processed = new Set(this.state.processedChunkDigests);
            const pending = allTasks.filter((task) => !processed.has(task.digest));
            const passLimit = Math.max(1, Math.min(Number(maxBatches) || 12, 128));
            const selectedTasks = pending.slice(0, passLimit);
            let processedEntryCount = 0;
            let extractedCount = 0;
            try {
                for (const task of selectedTasks) {
                    const extracted = await this.extractChunk(task);
                    const byIdentity = new Map(this.state.eventCalendar.map((event) => [
                        stableHash(
                            event.subject,
                            event.verb,
                            event.object,
                            event.startDatetime,
                            event.endDatetime,
                            normalizeArray(event.sourceEventIds).join(',')
                        ),
                        event
                    ]));
                    for (const event of extracted) {
                        const identity = stableHash(
                            event.subject,
                            event.verb,
                            event.object,
                            event.startDatetime,
                            event.endDatetime,
                            event.sourceEventIds.join(',')
                        );
                        byIdentity.set(identity, event);
                    }
                    this.state.eventCalendar = [...byIdentity.values()];
                    this.state.processedChunkDigests.push(task.digest);
                    this.state.processedChunkDigests = [
                        ...new Set(this.state.processedChunkDigests)
                    ];
                    this.state.extractionRuns.push({
                        id: randomUUID(),
                        occurredAt: new Date().toISOString(),
                        sessionId: task.sessionId,
                        chunkDigest: task.digest,
                        sourceEventCount: task.events.length,
                        extractedEventCount: extracted.length
                    });
                    processedEntryCount += task.events.length;
                    extractedCount += extracted.length;
                    this.persist();
                }
                const remainingEntryCount = Math.max(
                    0,
                    pending.length - selectedTasks.length
                );
                this.state.diagnostics.lastError = '';
                this.persist();
                return {
                    ok: true,
                    status: remainingEntryCount ? 'partial_completed' : 'completed',
                    run: {
                        processedEntryCount,
                        evidenceCount: processedEntryCount,
                        batchCount: selectedTasks.length,
                        unitCount: extractedCount,
                        observationCount: 0,
                        mentalModelCount: 0,
                        supersededCount: 0,
                        remainingEntryCount
                    }
                };
            } catch (error) {
                this.state.diagnostics.lastError = error?.message || String(error);
                this.persist();
                return {
                    ok: false,
                    status: error?.code || 'chronos_extraction_failed',
                    error: this.state.diagnostics.lastError,
                    run: {
                        processedEntryCount,
                        evidenceCount: processedEntryCount,
                        batchCount: selectedTasks.length,
                        unitCount: extractedCount,
                        observationCount: 0,
                        mentalModelCount: 0,
                        supersededCount: 0,
                        remainingEntryCount: pending.length
                    }
                };
            }
        });
    }

    async dynamicGuidance(query, questionTime) {
        const result = await this.callModel(
            [
                'You generate dynamic retrieval guidance for a Chronos memory agent.',
                'Do not answer the question and do not rewrite it into a single query.',
                'Identify entities, attributes, temporal constraints, and required operations.',
                'Return 1-5 concrete retrieval bullets.',
                'Return JSON: {"targets":{"entities":[],"attributes":[],"operations":[],',
                '"timeRange":{"start":"","end":""}},"bullets":[]}'
            ].join('\n'),
            JSON.stringify({
                question: normalizeText(query),
                referenceTime: safeIso(questionTime)
            }, null, 2),
            { maxTokens: 2_000 }
        );
        const guidance = normalizeGuidance(result);
        if (!guidance.bullets.length) {
            throw new Error('Chronos dynamic guidance returned no retrieval bullets');
        }
        return guidance;
    }

    async denseRank(documents, query) {
        if (!documents.length) {
            return [];
        }
        const [queryVector] = await this.dense.embed([`query: ${query}`]);
        const documentVectors = await this.dense.embed(
            documents.map((document) => `passage: ${document.text}`)
        );
        return documents.map((document, index) => ({
            document,
            score: cosineSimilarity(queryVector, documentVectors[index])
        })).sort((left, right) => right.score - left.score)
            .map((entry, index) => ({ ...entry, rank: index + 1 }));
    }

    async denseThenRerank(documents, searchQuery, originalQuestion, topK, timeRange) {
        const eligible = documents.filter((document) =>
            eventOverlapsRange(document, timeRange)
        );
        const dense = (await this.denseRank(eligible, searchQuery))
            .slice(0, INITIAL_DENSE_K)
            .map((entry) => ({
                ...entry,
                components: {
                    dense: { rank: entry.rank, score: entry.score }
                }
            }));
        return (await this.crossEncoder.rerank(
            originalQuestion,
            dense,
            Math.max(1, Math.min(Number(topK) || 10, 50))
        )).map((entry) => entry.document);
    }

    expandTurnContext(selected, allTurns) {
        const bySession = new Map();
        for (const turn of allTurns) {
            const current = bySession.get(turn.sessionId) || [];
            current.push(turn);
            bySession.set(turn.sessionId, current);
        }
        const selectedIds = new Set(selected.map((document) => document.id));
        for (const document of selected) {
            const session = bySession.get(document.sessionId) || [];
            const index = session.findIndex((entry) => entry.id === document.id);
            for (const neighbor of session.slice(
                Math.max(0, index - 1),
                Math.min(session.length, index + 2)
            )) {
                selectedIds.add(neighbor.id);
            }
        }
        return allTurns.filter((document) => selectedIds.has(document.id));
    }

    async nextToolAction({
        query,
        questionTime,
        guidance,
        step,
        evidence,
        actionHistory
    }) {
        const result = await this.callModel(
            [
                'You are the Chronos retrieval agent in an iterative ReAct-style loop.',
                'You gather evidence only; the Persona actor will answer later.',
                'Choose exactly one action from:',
                '- search_turns: dense search raw turns; use a semantic query',
                '- search_events: dense search structured temporal events',
                '- grep_turns: literal case-insensitive search raw turns',
                '- grep_events: literal case-insensitive search event statements/aliases',
                '- finish: evidence is sufficient or the search budget is exhausted',
                'For search actions return query, topK, and optional ISO timeRange.',
                'For finish return selectedIds from the evidence list.',
                'Return strict JSON with action, query, topK, timeRange, selectedIds,',
                'evidenceGap, and rationale. Never answer the user question.'
            ].join('\n'),
            JSON.stringify({
                question: normalizeText(query),
                referenceTime: safeIso(questionTime),
                dynamicGuidance: guidance,
                step,
                maxSteps: this.maxAgentSteps,
                priorActions: actionHistory,
                accumulatedEvidence: evidence.slice(0, 60).map((document) => ({
                    id: document.id,
                    kind: document.kind,
                    time: document.eventStart || document.time,
                    text: document.text.slice(0, 800)
                }))
            }, null, 2),
            { maxTokens: 2_000 }
        );
        const action = normalizeToolAction(result);
        if (!action) {
            throw new Error('Chronos retrieval agent returned an invalid tool action');
        }
        return action;
    }

    async search({
        query = '',
        events = [],
        limit = 10,
        questionTime = '',
        maxContextChars = 16_000
    } = {}) {
        return this.withLock(async () => {
            const turns = rawDocuments(chronologicalEvents(events));
            const eventDocuments = eventCalendarDocuments(this.state.eventCalendar);
            const guidance = await this.dynamicGuidance(query, questionTime);
            const initial = await this.denseThenRerank(
                turns,
                normalizeText(query),
                normalizeText(query),
                INITIAL_RERANK_K,
                guidance.targets.timeRange
            );
            const expandedInitial = this.expandTurnContext(initial, turns);
            const accumulated = new Map(
                expandedInitial.map((document) => [document.id, document])
            );
            const actionHistory = [];
            let selectedIds = [];
            for (let step = 1; step <= this.maxAgentSteps; step += 1) {
                const action = await this.nextToolAction({
                    query,
                    questionTime,
                    guidance,
                    step,
                    evidence: [...accumulated.values()],
                    actionHistory
                });
                const historyEntry = {
                    step,
                    action: action.action,
                    query: action.query,
                    topK: action.topK,
                    timeRange: action.timeRange,
                    evidenceGap: action.evidenceGap,
                    rationale: action.rationale,
                    resultIds: []
                };
                if (action.action === 'finish') {
                    selectedIds = action.selectedIds;
                    actionHistory.push(historyEntry);
                    break;
                }
                let results = [];
                if (action.action === 'search_turns') {
                    results = await this.denseThenRerank(
                        turns,
                        action.query,
                        normalizeText(query),
                        action.topK,
                        action.timeRange
                    );
                    results = this.expandTurnContext(results, turns);
                } else if (action.action === 'search_events') {
                    results = await this.denseThenRerank(
                        eventDocuments,
                        action.query,
                        normalizeText(query),
                        action.topK,
                        action.timeRange
                    );
                } else if (action.action === 'grep_turns') {
                    results = literalGrep(turns, action.query, action.timeRange)
                        .slice(0, action.topK);
                    results = this.expandTurnContext(results, turns);
                } else if (action.action === 'grep_events') {
                    results = literalGrep(
                        eventDocuments,
                        action.query,
                        action.timeRange
                    ).slice(0, action.topK);
                }
                for (const document of results) {
                    accumulated.set(document.id, document);
                }
                historyEntry.resultIds = results.map((document) => document.id);
                actionHistory.push(historyEntry);
            }
            let selected = [...accumulated.values()];
            if (selectedIds.length) {
                const selectedSet = new Set(selectedIds);
                const explicitlySelected = selected.filter((document) =>
                    selectedSet.has(document.id)
                );
                if (explicitlySelected.length) {
                    selected = explicitlySelected;
                }
            }
            selected = selected.slice(0, Math.max(1, Math.min(Number(limit) || 10, 60)));
            const byEventId = new Map(events.map((event) => [event.id, event]));
            const sourceEventIds = [...new Set(selected.flatMap((document) =>
                document.kind === 'turn'
                    ? normalizeArray(document.sourceRefs).map((ref) => ref.eventId)
                    : normalizeArray(document.sourceEventIds)
            ).filter(Boolean))];
            const contextText = [
                '## Chronos dynamic retrieval guidance',
                ...guidance.bullets.map((bullet) => `- ${bullet}`),
                '',
                '## Chronos dual-calendar evidence',
                renderEvidence(selected, maxContextChars)
            ].join('\n');
            this.state.diagnostics.lastError = '';
            this.persist();
            return {
                ok: true,
                guidance,
                actionHistory,
                documents: selected,
                events: sourceEventIds.map((id) => byEventId.get(id)).filter(Boolean),
                contextText,
                diagnostics: {
                    fidelity: this.state.upstream.fidelity,
                    extractedEventCount: this.state.eventCalendar.length,
                    initialTurnCount: initial.length,
                    expandedInitialTurnCount: expandedInitial.length,
                    toolStepCount: actionHistory.length,
                    selectedDocumentCount: selected.length,
                    dense: this.dense.getStatus(),
                    crossEncoder: this.crossEncoder.getStatus()
                }
            };
        });
    }

    getStatus() {
        return {
            statePath: this.statePath,
            upstream: this.state.upstream,
            extractedEventCount: this.state.eventCalendar.length,
            processedChunkCount: this.state.processedChunkDigests.length,
            extractionRunCount: this.state.extractionRuns.length,
            dense: this.dense.getStatus(),
            crossEncoder: this.crossEncoder.getStatus(),
            diagnostics: { ...this.state.diagnostics }
        };
    }
}

module.exports = {
    AILISChronosFullMemory,
    EXTRACTION_BATCH_OVERLAP,
    EXTRACTION_BATCH_SIZE,
    INITIAL_DENSE_K,
    INITIAL_RERANK_K,
    STATE_FILE
};
