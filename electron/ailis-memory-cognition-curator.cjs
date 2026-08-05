'use strict';

const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');
const { createHash, randomUUID } = require('crypto');
const {
    MEMORY_COGNITION_FILE,
    MEMORY_COGNITION_VERSION,
    defaultCognitionState,
    normalizeCognitionState
} = require('./ailis-memory-strategies.cjs');
const { redactSecretLikeText } = require('./ailis-memory-store.cjs');

const DEFAULT_BATCH_ENTRY_LIMIT = 28;
const DEFAULT_BATCH_MAX_CHARS = 24000;
const DEFAULT_MAX_BATCHES = 12;
const MAX_UNITS = 20000;
const MAX_OBSERVATIONS = 10000;
const MAX_MENTAL_MODELS = 2000;
const ALLOWED_LANES = new Set([
    'event',
    'world',
    'experience',
    'observation',
    'opinion',
    'preference'
]);

function nowIso() {
    return new Date().toISOString();
}

function normalizeText(value, fallback = '') {
    if (typeof value !== 'string') {
        return fallback;
    }
    const text = value.replace(/\s+/g, ' ').trim();
    return text || fallback;
}

function normalizeArray(value) {
    if (!value) {
        return [];
    }
    return Array.isArray(value) ? value : [value];
}

function clampNumber(value, min, max, fallback = 0) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) {
        return fallback;
    }
    return Math.max(min, Math.min(max, numeric));
}

function safeIso(value, fallback = '') {
    const text = normalizeText(value);
    if (!text) {
        return fallback;
    }
    const parsed = Date.parse(text);
    return Number.isFinite(parsed) ? new Date(parsed).toISOString() : fallback;
}

function stableId(prefix, ...parts) {
    return `${prefix}-${createHash('sha256')
        .update(parts.map((part) => String(part || '')).join('\n'))
        .digest('hex')
        .slice(0, 18)}`;
}

function isObject(value) {
    return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

async function readJson(filePath, fallback) {
    try {
        const raw = (await fsp.readFile(filePath, 'utf8')).replace(/^\uFEFF/, '');
        return JSON.parse(raw) ?? fallback;
    } catch {
        return fallback;
    }
}

async function writeJsonAtomic(filePath, value) {
    await fsp.mkdir(path.dirname(filePath), { recursive: true });
    const temporaryPath = `${filePath}.${process.pid}.${Date.now()}.tmp`;
    await fsp.writeFile(temporaryPath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
    await fsp.rename(temporaryPath, filePath);
}

async function appendJsonl(filePath, value) {
    await fsp.mkdir(path.dirname(filePath), { recursive: true });
    await fsp.appendFile(filePath, `${JSON.stringify(value)}\n`, 'utf8');
}

function parseJsonCandidate(value) {
    if (isObject(value)) {
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
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start >= 0 && end > start) {
        try {
            return JSON.parse(text.slice(start, end + 1));
        } catch {}
    }
    return null;
}

function collectLlmCandidates(result = {}) {
    return [
        result?.structuredContent,
        result?.content,
        result?.text,
        result?.output,
        result?.output_text,
        result?.message?.content,
        result?.choices?.[0]?.message?.content
    ].flatMap((entry) => Array.isArray(entry)
        ? entry.map((item) => item?.text || item?.content || item)
        : [entry]
    ).filter(Boolean);
}

function rawEntryDialogue(entry = {}) {
    const payload = entry.payload || {};
    const requestPayload = payload.requestPayload || {};
    const result = payload.result || {};
    const userText = normalizeText(
        requestPayload.memoryUserMessage ||
        requestPayload.message ||
        payload.userMessage
    );
    const assistantText = normalizeText(
        result.content ||
        result.displayText ||
        result.finalAnswer ||
        payload.assistantMessage
    );
    return { userText, assistantText };
}

function isTaskAgentEntry(entry = {}) {
    const sessionId = normalizeText(entry.sessionId).toLowerCase();
    const source = normalizeText(entry.source).toLowerCase();
    const role = normalizeText(
        entry.meta?.agentRole ||
        entry.payload?.agentRole ||
        entry.payload?.context?.agentRole
    ).toLowerCase();
    return sessionId.includes(':task-agent:') ||
        source.includes('task-agent') ||
        source.includes('task_agent') ||
        ['task_agent', 'taskagent', 'subagent'].includes(role);
}

function renderEvidence(entry = {}) {
    if (isTaskAgentEntry(entry)) {
        return null;
    }
    const { userText, assistantText } = rawEntryDialogue(entry);
    if (!userText && !assistantText) {
        return null;
    }
    return {
        id: normalizeText(entry.id),
        occurredAt: safeIso(entry.iso, nowIso()),
        sessionId: normalizeText(entry.sessionId, 'main'),
        source: normalizeText(entry.source),
        userText,
        assistantText
    };
}

function buildEvidenceBatch(entries = [], options = {}) {
    const entryLimit = Math.max(
        1,
        Math.min(Number(options.entryLimit) || DEFAULT_BATCH_ENTRY_LIMIT, 100)
    );
    const maxChars = Math.max(
        2000,
        Math.min(Number(options.maxChars) || DEFAULT_BATCH_MAX_CHARS, 100000)
    );
    const evidence = [];
    let sourceEntryCount = 0;
    let usedChars = 0;
    for (const entry of entries) {
        if (evidence.length >= entryLimit) {
            break;
        }
        sourceEntryCount += 1;
        const rendered = renderEvidence(entry);
        if (!rendered) {
            continue;
        }
        const size = JSON.stringify(rendered).length;
        if (evidence.length && usedChars + size > maxChars) {
            sourceEntryCount -= 1;
            break;
        }
        evidence.push(rendered);
        usedChars += size;
    }
    return {
        evidence,
        sourceEntryCount,
        usedChars
    };
}

function cognitionSystemPrompt() {
    return [
        'You are the AILIS evidence-bound cognition memory curator.',
        'Transform chronological raw conversations into auditable memory representations.',
        'Do not answer a future question and do not optimize for a benchmark.',
        'The same local user may appear under many session IDs.',
        'Every memory must cite source evidence IDs and remain traceable to original dialogue.',
        'Return valid JSON only.'
    ].join('\n');
}

function cognitionUserPrompt({ evidence, currentStateSummary }) {
    const outputSchema = {
        units: [{
            lane: 'event|world|experience|observation|opinion|preference',
            semanticKey: 'stable snake_case slot shared by updates of the same attribute',
            statement: 'self-contained evidence-grounded memory',
            subject: 'entity',
            predicate: 'relationship or action',
            object: 'value or object',
            aliases: ['alternative wording'],
            mentionAt: 'ISO datetime when learned',
            eventStart: 'ISO datetime or empty',
            eventEnd: 'ISO datetime or empty',
            validFrom: 'ISO datetime or empty',
            validUntil: 'ISO datetime or empty',
            replacesPrior: false,
            confidence: 0.0,
            importance: 0.0,
            evidenceIds: ['evidence id']
        }],
        observations: [{
            semanticKey: 'topic or continuity slot',
            text: 'dense dated observation preserving concrete details',
            priority: 0.0,
            confidence: 0.0,
            observedAt: 'ISO datetime',
            referencedAt: 'ISO datetime or empty',
            relativeAt: 'resolved ISO datetime or empty',
            evidenceIds: ['evidence id']
        }],
        mentalModels: [{
            lane: 'observation|opinion|preference|world',
            semanticKey: 'stable reusable model slot',
            text: 'cross-evidence synthesis that does not invent facts',
            confidence: 0.0,
            importance: 0.0,
            replacesPrior: false,
            evidenceIds: ['evidence id']
        }],
        rejectedEvidence: [{
            evidenceId: 'evidence id',
            reason: 'why no durable memory was extracted'
        }]
    };
    return [
        'Extract memory representations from this chronological evidence batch.',
        '',
        'Rules:',
        '- Preserve granular facts needed for exact later recall; do not replace raw dialogue.',
        '- event: a time-grounded occurrence or state transition.',
        '- world: objective facts about the user or external world.',
        '- experience: something AILIS previously said, recommended, or did.',
        '- observation: a neutral synthesis supported by evidence.',
        '- opinion: AILIS subjective belief only; never label a user fact as an opinion.',
        '- preference: an explicit or strongly evidenced user preference, including negative preferences.',
        '- Use the same semanticKey when a later statement updates the same attribute.',
        '- Set replacesPrior=true only when newer evidence changes or invalidates an older value.',
        '- Distinguish mentionAt from when an event happened. Resolve relative dates against evidence.occurredAt when supportable.',
        '- Keep ambiguous event times as ranges or empty rather than inventing precision.',
        '- Generate lexical aliases with genuinely different wording when useful.',
        '- An observation should be dense and readable, with concrete names, values, dates, and polarity preserved.',
        '- A mental model requires multiple supporting evidence items or a direct durable user statement.',
        '- Every evidenceIds item must exist in the supplied evidence.',
        '- Never retain secrets, credentials, sexual details, hidden tool traces, or unsupported sensitive attributes.',
        '- Return JSON only.',
        '',
        'Output schema:',
        JSON.stringify(outputSchema, null, 2),
        '',
        'Existing active semantic slots:',
        JSON.stringify(currentStateSummary, null, 2),
        '',
        'Evidence:',
        JSON.stringify(evidence, null, 2)
    ].join('\n');
}

function sourceRefsForEvidence(evidenceIds, evidenceById) {
    return normalizeArray(evidenceIds).map((id) => {
        const evidence = evidenceById.get(normalizeText(id));
        if (!evidence) {
            return null;
        }
        return {
            evidenceId: evidence.id,
            sessionId: evidence.sessionId,
            occurredAt: evidence.occurredAt
        };
    }).filter(Boolean).slice(0, 40);
}

function normalizeLane(value, fallback = 'world') {
    const lane = normalizeText(value, fallback).toLowerCase();
    return ALLOWED_LANES.has(lane) ? lane : fallback;
}

function safeMemoryText(value) {
    const text = normalizeText(value);
    const protectedText = redactSecretLikeText(text);
    return protectedText.includes('[secret-like-') ? '' : protectedText;
}

function normalizeUnit(raw, evidenceById, runIso) {
    if (!isObject(raw)) {
        return null;
    }
    const statement = safeMemoryText(raw.statement || raw.text);
    const semanticKey = normalizeText(raw.semanticKey).toLowerCase();
    const sources = sourceRefsForEvidence(raw.evidenceIds, evidenceById);
    if (!statement || !sources.length) {
        return null;
    }
    const mentionAt = safeIso(
        raw.mentionAt,
        sources.map((source) => source.occurredAt).sort().at(-1) || runIso
    );
    const lane = normalizeLane(raw.lane);
    const id = stableId(
        'cognition-unit',
        semanticKey || statement.toLowerCase(),
        sources.map((source) => source.evidenceId).sort().join('|'),
        lane
    );
    return {
        id,
        lane,
        semanticKey,
        statement,
        subject: safeMemoryText(raw.subject),
        predicate: safeMemoryText(raw.predicate),
        object: safeMemoryText(raw.object),
        aliases: normalizeArray(raw.aliases)
            .map((entry) => safeMemoryText(entry))
            .filter(Boolean)
            .slice(0, 12),
        mentionAt,
        eventStart: safeIso(raw.eventStart),
        eventEnd: safeIso(raw.eventEnd),
        validFrom: safeIso(raw.validFrom, mentionAt),
        validUntil: safeIso(raw.validUntil),
        replacesPrior: raw.replacesPrior === true,
        supersededBy: '',
        confidence: clampNumber(raw.confidence, 0, 1, 0.7),
        importance: clampNumber(raw.importance, 0, 1, 0.5),
        sources,
        status: 'active',
        createdAt: runIso,
        updatedAt: runIso
    };
}

function normalizeObservation(raw, evidenceById, runIso) {
    if (!isObject(raw)) {
        return null;
    }
    const text = safeMemoryText(raw.text || raw.statement);
    const semanticKey = normalizeText(raw.semanticKey).toLowerCase();
    const sources = sourceRefsForEvidence(raw.evidenceIds, evidenceById);
    if (!text || !sources.length) {
        return null;
    }
    const observedAt = safeIso(
        raw.observedAt,
        sources.map((source) => source.occurredAt).sort().at(-1) || runIso
    );
    return {
        id: stableId(
            'cognition-observation',
            semanticKey || text.toLowerCase(),
            sources.map((source) => source.evidenceId).sort().join('|')
        ),
        semanticKey,
        text,
        priority: clampNumber(raw.priority, 0, 1, 0.5),
        confidence: clampNumber(raw.confidence, 0, 1, 0.75),
        observedAt,
        referencedAt: safeIso(raw.referencedAt),
        relativeAt: safeIso(raw.relativeAt),
        sources,
        status: 'active',
        createdAt: runIso,
        updatedAt: runIso
    };
}

function normalizeMentalModel(raw, evidenceById, runIso) {
    if (!isObject(raw)) {
        return null;
    }
    const text = safeMemoryText(raw.text || raw.statement);
    const semanticKey = normalizeText(raw.semanticKey).toLowerCase();
    const sources = sourceRefsForEvidence(raw.evidenceIds, evidenceById);
    if (!text || !semanticKey || !sources.length) {
        return null;
    }
    return {
        id: stableId(
            'cognition-mental',
            semanticKey,
            sources.map((source) => source.evidenceId).sort().join('|'),
            text.toLowerCase()
        ),
        lane: normalizeLane(raw.lane, 'observation'),
        semanticKey,
        text,
        confidence: clampNumber(raw.confidence, 0, 1, 0.7),
        importance: clampNumber(raw.importance, 0, 1, 0.6),
        replacesPrior: raw.replacesPrior === true,
        sources,
        status: 'active',
        createdAt: runIso,
        updatedAt: runIso
    };
}

function applyUnits(state, units, runIso) {
    const byId = new Map(state.units.map((unit) => [unit.id, unit]));
    let added = 0;
    let superseded = 0;
    for (const unit of units) {
        const existing = byId.get(unit.id);
        if (existing) {
            existing.updatedAt = runIso;
            existing.confidence = Math.max(
                Number(existing.confidence) || 0,
                Number(unit.confidence) || 0
            );
            existing.sources = Array.from(new Map(
                [...normalizeArray(existing.sources), ...unit.sources]
                    .map((source) => [
                        `${source.evidenceId}\u0000${source.sessionId}\u0000${source.occurredAt}`,
                        source
                    ])
            ).values()).slice(-40);
            continue;
        }
        if (unit.replacesPrior && unit.semanticKey) {
            for (const prior of state.units) {
                if (
                    prior.status === 'active' &&
                    prior.semanticKey === unit.semanticKey &&
                    prior.id !== unit.id
                ) {
                    prior.status = 'superseded';
                    prior.supersededBy = unit.id;
                    prior.validUntil = unit.validFrom || unit.mentionAt;
                    prior.updatedAt = runIso;
                    superseded += 1;
                }
            }
        }
        state.units.push(unit);
        byId.set(unit.id, unit);
        added += 1;
    }
    state.units = state.units.slice(-MAX_UNITS);
    return { added, superseded };
}

function applyObservations(state, observations, runIso) {
    const byId = new Map(state.observations.map((entry) => [entry.id, entry]));
    let added = 0;
    for (const observation of observations) {
        const existing = byId.get(observation.id);
        if (existing) {
            existing.updatedAt = runIso;
            existing.priority = Math.max(
                Number(existing.priority) || 0,
                Number(observation.priority) || 0
            );
            continue;
        }
        state.observations.push(observation);
        byId.set(observation.id, observation);
        added += 1;
    }
    state.observations = state.observations.slice(-MAX_OBSERVATIONS);
    return { added };
}

function applyMentalModels(state, mentalModels, runIso) {
    const byId = new Map(state.mentalModels.map((entry) => [entry.id, entry]));
    let added = 0;
    let superseded = 0;
    for (const model of mentalModels) {
        const existing = byId.get(model.id);
        if (existing) {
            existing.updatedAt = runIso;
            existing.confidence = Math.max(
                Number(existing.confidence) || 0,
                Number(model.confidence) || 0
            );
            continue;
        }
        if (model.replacesPrior) {
            for (const prior of state.mentalModels) {
                if (
                    prior.status === 'active' &&
                    prior.semanticKey === model.semanticKey &&
                    prior.id !== model.id
                ) {
                    prior.status = 'superseded';
                    prior.supersededBy = model.id;
                    prior.updatedAt = runIso;
                    superseded += 1;
                }
            }
        }
        state.mentalModels.push(model);
        byId.set(model.id, model);
        added += 1;
    }
    state.mentalModels = state.mentalModels.slice(-MAX_MENTAL_MODELS);
    return { added, superseded };
}

function stateSummary(state) {
    return {
        unitSlots: state.units
            .filter((entry) => entry.status === 'active' && entry.semanticKey)
            .slice(-200)
            .map((entry) => ({
                id: entry.id,
                lane: entry.lane,
                semanticKey: entry.semanticKey,
                statement: entry.statement,
                validFrom: entry.validFrom
            })),
        mentalModels: state.mentalModels
            .filter((entry) => entry.status === 'active')
            .slice(-80)
            .map((entry) => ({
                id: entry.id,
                lane: entry.lane,
                semanticKey: entry.semanticKey,
                text: entry.text
            }))
    };
}

class AILISMemoryCognitionCurator {
    constructor(options = {}) {
        this.rootDir = path.resolve(options.rootDir || process.cwd());
        this.statePath = path.join(this.rootDir, MEMORY_COGNITION_FILE);
        this.runsPath = path.join(this.rootDir, 'memory-cognition-runs.jsonl');
        this.rawMemoryLedger = options.rawMemoryLedger || null;
        this.llmClient = typeof options.llmClient === 'function' ? options.llmClient : null;
        this.emitGatewayEvent = typeof options.emitGatewayEvent === 'function'
            ? options.emitGatewayEvent
            : null;
        this.running = false;
        this.lastError = '';
    }

    getStatus() {
        let state = defaultCognitionState();
        try {
            if (fs.existsSync(this.statePath)) {
                state = normalizeCognitionState(JSON.parse(fs.readFileSync(this.statePath, 'utf8')));
            }
        } catch (error) {
            this.lastError = error?.message || String(error);
        }
        return {
            enabled: Boolean(this.llmClient),
            running: this.running,
            statePath: this.statePath,
            version: `v${MEMORY_COGNITION_VERSION}`,
            unitCount: state.units.length,
            activeUnitCount: state.units.filter((entry) => entry.status === 'active').length,
            observationCount: state.observations.length,
            mentalModelCount: state.mentalModels.length,
            cursor: { ...(state.cursor || {}) },
            lastError: this.lastError
        };
    }

    async loadState() {
        return normalizeCognitionState(await readJson(this.statePath, defaultCognitionState()));
    }

    async callModel(evidence, state, options = {}) {
        if (!this.llmClient) {
            return {
                ok: false,
                status: 'llm_client_not_configured',
                error: 'memory cognition curator requires an LLM client'
            };
        }
        const result = await this.llmClient({
            messages: [
                { role: 'system', content: cognitionSystemPrompt() },
                {
                    role: 'user',
                    content: cognitionUserPrompt({
                        evidence,
                        currentStateSummary: stateSummary(state)
                    })
                }
            ],
            jsonMode: true,
            expectJson: true,
            outputFormat: 'json',
            temperature: 0,
            max_tokens: Math.max(2000, Number(options.maxTokens) || 10000),
            timeoutMs: Math.max(10000, Number(options.timeoutMs) || 120000)
        });
        if (result?.ok === false) {
            return {
                ok: false,
                status: 'llm_failed',
                error: result.error || result.message || 'memory cognition LLM failed',
                result
            };
        }
        const parsed = collectLlmCandidates(result)
            .map(parseJsonCandidate)
            .find(isObject);
        if (!parsed) {
            return {
                ok: false,
                status: 'invalid_llm_json',
                error: 'memory cognition curator expected a JSON object',
                result
            };
        }
        return { ok: true, parsed, result };
    }

    normalizeModelOutput(parsed, evidence, runIso) {
        const evidenceById = new Map(evidence.map((entry) => [entry.id, entry]));
        return {
            units: normalizeArray(parsed.units)
                .map((entry) => normalizeUnit(entry, evidenceById, runIso))
                .filter(Boolean),
            observations: normalizeArray(parsed.observations)
                .map((entry) => normalizeObservation(entry, evidenceById, runIso))
                .filter(Boolean),
            mentalModels: normalizeArray(parsed.mentalModels)
                .map((entry) => normalizeMentalModel(entry, evidenceById, runIso))
                .filter(Boolean),
            rejectedEvidence: normalizeArray(parsed.rejectedEvidence)
                .filter(isObject)
                .map((entry) => ({
                    evidenceId: normalizeText(entry.evidenceId),
                    reason: normalizeText(entry.reason)
                }))
                .filter((entry) => evidenceById.has(entry.evidenceId))
                .slice(0, 100)
        };
    }

    async curate(options = {}) {
        if (this.running) {
            return { ok: false, status: 'cognition_curation_already_running' };
        }
        if (!this.rawMemoryLedger?.replay) {
            return { ok: false, status: 'raw_memory_ledger_not_configured' };
        }
        this.running = true;
        const runIso = safeIso(options.nowIso, nowIso());
        try {
            const state = await this.loadState();
            const replay = this.rawMemoryLedger.replay({
                since: state.cursor?.lastProcessedIso || '',
                sinceExclusive: true,
                afterId: state.cursor?.lastProcessedEntryId || '',
                includePayload: true,
                limit: Math.max(1, Number(options.rawLimit) || 10000),
                tail: false
            });
            const entries = normalizeArray(replay?.entries)
                .sort((left, right) =>
                    String(left.iso || '').localeCompare(String(right.iso || '')) ||
                    String(left.id || '').localeCompare(String(right.id || ''))
                );
            if (!entries.length) {
                return {
                    ok: true,
                    status: 'no_new_raw_memory',
                    run: {
                        iso: runIso,
                        processedEntryCount: 0,
                        batchCount: 0,
                        remainingEntryCount: 0
                    }
                };
            }
            const maxBatches = Math.max(
                1,
                Math.min(Number(options.maxBatches) || DEFAULT_MAX_BATCHES, 100)
            );
            let offset = 0;
            let batchCount = 0;
            let processedEntryCount = 0;
            let evidenceCount = 0;
            let unitCount = 0;
            let observationCount = 0;
            let mentalModelCount = 0;
            let supersededCount = 0;
            const batchSummaries = [];

            while (offset < entries.length && batchCount < maxBatches) {
                const batch = buildEvidenceBatch(entries.slice(offset), options);
                if (!batch.sourceEntryCount) {
                    break;
                }
                const batchEntries = entries.slice(offset, offset + batch.sourceEntryCount);
                const lastEntry = batchEntries.at(-1);
                if (batch.evidence.length) {
                    const extraction = await this.callModel(batch.evidence, state, options);
                    if (!extraction.ok) {
                        this.lastError = extraction.error || extraction.status;
                        if (!processedEntryCount) {
                            return extraction;
                        }
                        break;
                    }
                    const normalized = this.normalizeModelOutput(
                        extraction.parsed,
                        batch.evidence,
                        runIso
                    );
                    const unitResult = applyUnits(state, normalized.units, runIso);
                    const observationResult = applyObservations(
                        state,
                        normalized.observations,
                        runIso
                    );
                    const mentalResult = applyMentalModels(
                        state,
                        normalized.mentalModels,
                        runIso
                    );
                    unitCount += unitResult.added;
                    observationCount += observationResult.added;
                    mentalModelCount += mentalResult.added;
                    supersededCount += unitResult.superseded + mentalResult.superseded;
                    evidenceCount += batch.evidence.length;
                    batchSummaries.push({
                        batchIndex: batchCount + 1,
                        sourceEntryCount: batchEntries.length,
                        evidenceCount: batch.evidence.length,
                        unitCount: normalized.units.length,
                        observationCount: normalized.observations.length,
                        mentalModelCount: normalized.mentalModels.length,
                        rejectedEvidenceCount: normalized.rejectedEvidence.length
                    });
                } else {
                    batchSummaries.push({
                        batchIndex: batchCount + 1,
                        sourceEntryCount: batchEntries.length,
                        evidenceCount: 0,
                        status: 'skipped_no_dialogue'
                    });
                }
                state.cursor = {
                    lastProcessedIso: safeIso(lastEntry?.iso, runIso),
                    lastProcessedEntryId: normalizeText(lastEntry?.id)
                };
                processedEntryCount += batchEntries.length;
                offset += batchEntries.length;
                batchCount += 1;
            }

            state.updatedAt = runIso;
            state.stats = {
                ...(state.stats || {}),
                processedEvidenceCount:
                    Number(state.stats?.processedEvidenceCount || 0) + evidenceCount,
                curationRunCount:
                    Number(state.stats?.curationRunCount || 0) + 1
            };
            const remainingEntryCount = Math.max(0, entries.length - offset);
            const status = remainingEntryCount ? 'partial_completed' : 'completed';
            const run = {
                id: randomUUID(),
                iso: runIso,
                status,
                processedEntryCount,
                evidenceCount,
                batchCount,
                unitCount,
                observationCount,
                mentalModelCount,
                supersededCount,
                remainingEntryCount,
                batches: batchSummaries
            };
            await Promise.all([
                writeJsonAtomic(this.statePath, state),
                appendJsonl(this.runsPath, run)
            ]);
            this.lastError = '';
            this.emitGatewayEvent?.('memory.cognition.curated', {
                status,
                processedEntryCount,
                unitCount,
                observationCount,
                mentalModelCount,
                remainingEntryCount
            });
            return {
                ok: true,
                status,
                run,
                stateSummary: {
                    unitCount: state.units.length,
                    activeUnitCount: state.units.filter((entry) => entry.status === 'active').length,
                    observationCount: state.observations.length,
                    mentalModelCount: state.mentalModels.length
                }
            };
        } catch (error) {
            this.lastError = error?.message || String(error);
            this.emitGatewayEvent?.('memory.cognition.error', {
                error: this.lastError
            });
            return {
                ok: false,
                status: 'cognition_curation_error',
                error: this.lastError
            };
        } finally {
            this.running = false;
        }
    }

    async clear() {
        await writeJsonAtomic(this.statePath, defaultCognitionState());
        await fsp.writeFile(this.runsPath, '', 'utf8').catch(() => {});
        this.lastError = '';
        return { ok: true, status: 'cleared' };
    }
}

module.exports = {
    AILISMemoryCognitionCurator,
    ALLOWED_LANES,
    buildEvidenceBatch,
    cognitionSystemPrompt,
    cognitionUserPrompt,
    renderEvidence
};
