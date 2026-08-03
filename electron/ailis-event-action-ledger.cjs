'use strict';

const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');
const { createHash, randomUUID } = require('crypto');

const EVENT_ACTION_LEDGER_VERSION = 3;
const EVENT_ACTION_LEDGER_FILE = 'event-action-ledger.v3.json';
const EVENT_ACTION_LEDGER_RUNS_FILE = 'event-action-ledger-runs.v3.jsonl';
const EVENT_ACTION_EXTRACTION_VERSION = 'ailis-event-action-extractor-v3';
const DEFAULT_BATCH_EVENT_LIMIT = 24;
const DEFAULT_BATCH_MAX_CHARS = 64_000;
const DEFAULT_MAX_BATCHES = 12;
const MAX_RECORDS = 30_000;
const MAX_PROCESSED_EVENT_IDS = 50_000;
const ALLOWED_RECORD_KINDS = new Set([
    'event',
    'action',
    'state',
    'mapping',
    'measurement'
]);
const ALLOWED_ACTION_STATES = new Set([
    'pending',
    'completed',
    'cancelled',
    'superseded',
    'unknown'
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
        .slice(0, 20)}`;
}

function isObject(value) {
    return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

function uniqueStrings(value, limit = 100) {
    return [...new Set(
        normalizeArray(value)
            .map((entry) => normalizeText(entry))
            .filter(Boolean)
    )].slice(0, limit);
}

function redactSecretLikeText(value) {
    return normalizeText(value)
        .replace(
            /([A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,})/g,
            '[secret-like-token]'
        )
        .replace(
            /\b(sk|ak|pk|rk|key|token)[-_]?[A-Za-z0-9]{18,}\b/gi,
            '[secret-like-token]'
        );
}

function safeMemoryText(value, maxChars = 2_000) {
    const protectedText = redactSecretLikeText(value);
    if (!protectedText || protectedText.includes('[secret-like-')) {
        return '';
    }
    return protectedText.slice(0, Math.max(1, Number(maxChars) || 2_000));
}

function defaultEventActionLedgerState() {
    const iso = nowIso();
    return {
        version: EVENT_ACTION_LEDGER_VERSION,
        extractionVersion: EVENT_ACTION_EXTRACTION_VERSION,
        createdAt: iso,
        updatedAt: iso,
        processedEventIds: [],
        records: [],
        checkpoint: null,
        stats: {
            curationRunCount: 0,
            processedEventCount: 0,
            extractedRecordCount: 0,
            rejectedRecordCount: 0,
            supersededRecordCount: 0
        }
    };
}

function normalizeSourceRef(source = {}) {
    if (!isObject(source)) {
        return null;
    }
    const eventId = normalizeText(source.eventId || source.id);
    if (!eventId) {
        return null;
    }
    return {
        eventId,
        sessionId: normalizeText(source.sessionId),
        occurredAt: safeIso(source.occurredAt || source.ts),
        messageIds: uniqueStrings(source.messageIds, 20)
    };
}

function normalizeStoredRecord(record = {}) {
    if (!isObject(record)) {
        return null;
    }
    const sourceRefs = normalizeArray(record.sourceRefs)
        .map(normalizeSourceRef)
        .filter(Boolean);
    const summary = safeMemoryText(record.summary || record.statement);
    if (!normalizeText(record.id) || !summary || !sourceRefs.length) {
        return null;
    }
    const kind = normalizeText(record.kind, 'event').toLowerCase();
    const status = normalizeText(record.status, 'unknown').toLowerCase();
    return {
        ...record,
        id: normalizeText(record.id),
        kind: ALLOWED_RECORD_KINDS.has(kind) ? kind : 'event',
        canonicalKey: normalizeText(record.canonicalKey).toLowerCase(),
        entity: safeMemoryText(record.entity, 500),
        entityType: normalizeText(record.entityType).toLowerCase(),
        actionType: normalizeText(record.actionType).toLowerCase(),
        status: ALLOWED_ACTION_STATES.has(status) ? status : 'unknown',
        summary,
        occurredAt: safeIso(record.occurredAt),
        targetAt: safeIso(record.targetAt),
        completedAt: safeIso(record.completedAt),
        sourceRefs,
        sourceEventIds: uniqueStrings(
            sourceRefs.map((source) => source.eventId),
            100
        ),
        sourceSessionIds: uniqueStrings(
            sourceRefs.map((source) => source.sessionId),
            100
        ),
        sourceMessageIds: uniqueStrings(
            sourceRefs.flatMap((source) => source.messageIds),
            100
        ),
        temporalAnchors: normalizeArray(record.temporalAnchors)
            .filter(isObject)
            .slice(0, 12),
        supersedes: uniqueStrings(record.supersedes, 100),
        supersededBy: normalizeText(record.supersededBy),
        aliases: uniqueStrings(record.aliases, 30),
        keywords: uniqueStrings(record.keywords, 30),
        quantities: normalizeArray(record.quantities).filter(isObject).slice(0, 30),
        nameMappings: normalizeArray(record.nameMappings).filter(isObject).slice(0, 30),
        stateChanges: normalizeArray(record.stateChanges).filter(isObject).slice(0, 30),
        confidence: clampNumber(record.confidence, 0, 1, 0.7),
        extractionVersion: normalizeText(
            record.extractionVersion,
            EVENT_ACTION_EXTRACTION_VERSION
        ),
        extractedAt: safeIso(record.extractedAt, nowIso()),
        createdAt: safeIso(record.createdAt, nowIso()),
        updatedAt: safeIso(record.updatedAt, nowIso())
    };
}

function normalizeEventActionLedgerState(raw) {
    const fallback = defaultEventActionLedgerState();
    const source = isObject(raw) ? raw : {};
    return {
        ...fallback,
        ...source,
        version: EVENT_ACTION_LEDGER_VERSION,
        extractionVersion: EVENT_ACTION_EXTRACTION_VERSION,
        processedEventIds: uniqueStrings(source.processedEventIds, MAX_PROCESSED_EVENT_IDS),
        records: normalizeArray(source.records)
            .map(normalizeStoredRecord)
            .filter(Boolean)
            .slice(-MAX_RECORDS),
        stats: {
            ...fallback.stats,
            ...(isObject(source.stats) ? source.stats : {})
        }
    };
}

async function readJson(filePath, fallback) {
    try {
        const raw = (await fsp.readFile(filePath, 'utf8')).replace(/^\uFEFF/, '');
        return JSON.parse(raw) ?? fallback;
    } catch {
        return fallback;
    }
}

function readJsonSync(filePath, fallback) {
    try {
        const raw = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
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

function writeJsonAtomicSync(filePath, value) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    const temporaryPath = `${filePath}.${process.pid}.${Date.now()}.tmp`;
    fs.writeFileSync(temporaryPath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
    fs.renameSync(temporaryPath, filePath);
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

function isTaskAgentEvent(event = {}) {
    const sessionId = normalizeText(event.sessionId).toLowerCase();
    const source = normalizeText(event.source).toLowerCase();
    const role = normalizeText(
        event.agentRole ||
        event.meta?.agentRole ||
        event.context?.agentRole
    ).toLowerCase();
    return sessionId.includes(':task-agent:') ||
        source.includes('task-agent') ||
        source.includes('task_agent') ||
        ['task_agent', 'taskagent', 'subagent'].includes(role);
}

function renderEvidenceEvent(event = {}) {
    if (!normalizeText(event.id) || isTaskAgentEvent(event)) {
        return null;
    }
    const userText = safeMemoryText(event.userText, 1_800);
    const assistantText = safeMemoryText(event.assistantText, 1_800);
    if (!userText && !assistantText) {
        return null;
    }
    return {
        eventId: normalizeText(event.id),
        sessionId: normalizeText(event.sessionId, 'main'),
        occurredAt: safeIso(event.ts),
        messageIds: uniqueStrings(event.messageIds, 20),
        userText,
        assistantText
    };
}

function buildEvidenceBatch(events = [], options = {}) {
    const eventLimit = Math.max(
        1,
        Math.min(Number(options.eventLimit) || DEFAULT_BATCH_EVENT_LIMIT, 100)
    );
    const maxChars = Math.max(
        2_000,
        Math.min(Number(options.maxChars) || DEFAULT_BATCH_MAX_CHARS, 100_000)
    );
    const evidence = [];
    let sourceEventCount = 0;
    let usedChars = 0;
    for (const event of events) {
        if (evidence.length >= eventLimit) {
            break;
        }
        sourceEventCount += 1;
        const rendered = renderEvidenceEvent(event);
        if (!rendered) {
            continue;
        }
        const size = JSON.stringify(rendered).length;
        if (evidence.length && usedChars + size > maxChars) {
            sourceEventCount -= 1;
            break;
        }
        evidence.push(rendered);
        usedChars += size;
    }
    return {
        evidence,
        sourceEventCount,
        usedChars
    };
}

function activeRecordSummary(state) {
    return state.records
        .filter((record) => !record.supersededBy && record.status !== 'superseded')
        .slice(-250)
        .map((record) => ({
            id: record.id,
            kind: record.kind,
            canonicalKey: record.canonicalKey,
            entity: record.entity,
            actionType: record.actionType,
            status: record.status,
            occurredAt: record.occurredAt,
            targetAt: record.targetAt,
            summary: record.summary
        }));
}

function extractionSystemPrompt() {
    return [
        'You are the AILIS evidence-bound Event/Action Ledger curator.',
        'Convert chronological conversation evidence into auditable structured records.',
        'Do not answer a future question and do not optimize for any benchmark.',
        'The same local user can appear in multiple session IDs.',
        'Semantic interpretation belongs to you; the host will only validate your schema and provenance.',
        'Return valid JSON only.'
    ].join('\n');
}

function extractionUserPrompt({ evidence, activeRecords }) {
    const schema = {
        records: [{
            kind: 'event|action|state|mapping|measurement',
            canonicalKey: 'stable snake_case identity for the same real-world record',
            sameAsRecordId: 'existing record id when this evidence repeats the same fact',
            entity: 'specific person, object, place, project, or subject',
            entityType: 'person|object|place|project|organization|other',
            actionType: 'normalized action such as pickup, return, visit, buy, complete, update, or empty',
            status: 'pending|completed|cancelled|superseded|unknown',
            summary: 'self-contained exact evidence-grounded statement',
            occurredAt: 'ISO datetime when the event/action occurred, or empty',
            targetAt: 'ISO datetime when a pending action is due/planned, or empty',
            completedAt: 'ISO datetime when completed, or empty',
            temporalAnchors: [{
                field: 'occurredAt|targetAt|completedAt',
                value: 'the same resolved ISO datetime stored in that field',
                rawText: 'verbatim source phrase that supports the resolution'
            }],
            aliases: ['alternative entity or event wording'],
            keywords: ['searchable exact terms'],
            quantities: [{
                kind: 'count|duration|distance|money|score|measurement|other',
                value: 'exact number as stated',
                unit: 'unit as stated',
                rawText: 'verbatim short source fragment containing the value'
            }],
            nameMappings: [{
                name: 'exact name',
                role: 'exact role, label, slot, or alias',
                relation: 'relationship between name and role',
                rawText: 'verbatim short source fragment'
            }],
            stateChanges: [{
                field: 'state field',
                from: 'previous value or empty',
                to: 'new exact value',
                rawText: 'verbatim short source fragment'
            }],
            supersedesRecordIds: ['existing record id explicitly invalidated by this evidence'],
            evidenceEventIds: ['supplied eventId'],
            confidence: 0.0
        }],
        rejectedEvidenceEventIds: ['supplied eventId with no durable structured record']
    };
    return [
        'Extract durable event, action, state, name/role mapping, date, and exact-value records.',
        '',
        'Hard rules:',
        '- Raw conversation remains the source of truth; these records are a derived index only.',
        '- Every record must cite one or more evidenceEventIds supplied below.',
        '- Preserve exact names, numbers, dates, times, units, mappings, and state changes.',
        '- Every non-empty occurredAt, targetAt, or completedAt must have a temporalAnchors entry with the verbatim supporting phrase, unless it is exactly the evidence occurredAt timestamp.',
        '- Never merge distinct entities or distinct actions merely because their wording is similar.',
        '- An exchange can create separate lifecycle actions, such as returning the old item and picking up the replacement; represent each explicit action separately.',
        '- Repeated mentions of the same real-world action should use the same canonicalKey or sameAsRecordId instead of creating duplicates.',
        '- Use supersedesRecordIds only when evidence explicitly changes, cancels, completes, or invalidates an earlier record.',
        '- Use pending only for an action the user still needs/plans/intends to do.',
        '- Use completed only when the evidence says it happened; do not infer completion from advice.',
        '- Preserve ambiguity with status=unknown or an empty date instead of inventing facts.',
        '- Prefer user statements as user-world facts. Advice from the assistant is not proof that the user acted.',
        '- Do not retain secrets, credentials, hidden tool traces, sexual details, or unsupported sensitive attributes.',
        '- Return JSON only.',
        '',
        'Output schema:',
        JSON.stringify(schema, null, 2),
        '',
        'Existing active records (for identity and explicit lifecycle updates only):',
        JSON.stringify(activeRecords, null, 2),
        '',
        'Chronological evidence:',
        JSON.stringify(evidence, null, 2)
    ].join('\n');
}

function sourceContainsLiteral(sourceCorpus, value) {
    const literal = normalizeText(value).toLowerCase();
    return Boolean(literal) &&
        normalizeText(sourceCorpus).toLowerCase().includes(literal);
}

function normalizeStructuredFragments(
    value,
    fields,
    sourceCorpus = '',
    requiredLiteralFields = []
) {
    return normalizeArray(value)
        .filter(isObject)
        .map((entry) => {
            const normalized = Object.fromEntries(
                fields.map((field) => [
                    field,
                    safeMemoryText(entry[field], field === 'rawText' ? 500 : 200)
                ])
            );
            const rawTextVerified = sourceContainsLiteral(
                sourceCorpus,
                normalized.rawText
            );
            if (normalized.rawText && !rawTextVerified) {
                normalized.rawText = '';
            }
            return {
                ...normalized,
                rawTextVerified
            };
        })
        .filter((entry) => Object.values(entry).some(Boolean))
        .filter((entry) => requiredLiteralFields.every(
            (field) =>
                !normalizeText(entry[field]) ||
                sourceContainsLiteral(sourceCorpus, entry[field])
        ))
        .slice(0, 30);
}

function sourceRefsForEvidence(evidenceEventIds, evidenceById) {
    return uniqueStrings(evidenceEventIds, 100)
        .map((eventId) => {
            const evidence = evidenceById.get(eventId);
            if (!evidence) {
                return null;
            }
            return {
                eventId: evidence.eventId,
                sessionId: evidence.sessionId,
                occurredAt: evidence.occurredAt,
                messageIds: uniqueStrings(evidence.messageIds, 20)
            };
        })
        .filter(Boolean);
}

function normalizeTemporalAnchors(value, sourceCorpus) {
    const allowedFields = new Set(['occurredAt', 'targetAt', 'completedAt']);
    return normalizeArray(value)
        .filter(isObject)
        .map((entry) => {
            const field = normalizeText(entry.field);
            const resolvedValue = safeIso(entry.value);
            const rawText = safeMemoryText(entry.rawText, 500);
            if (
                !allowedFields.has(field) ||
                !resolvedValue ||
                !sourceContainsLiteral(sourceCorpus, rawText)
            ) {
                return null;
            }
            return {
                field,
                value: resolvedValue,
                rawText,
                rawTextVerified: true
            };
        })
        .filter(Boolean)
        .slice(0, 12);
}

function normalizeExtractedRecord(raw, {
    evidenceById,
    existingById,
    existingByCanonicalKey,
    extractedAt
}) {
    if (!isObject(raw)) {
        return null;
    }
    const summary = safeMemoryText(raw.summary || raw.statement);
    const sourceRefs = sourceRefsForEvidence(
        raw.evidenceEventIds || raw.sourceEventIds,
        evidenceById
    );
    if (!summary || !sourceRefs.length) {
        return null;
    }
    const rawKind = normalizeText(raw.kind, 'event').toLowerCase();
    const kind = ALLOWED_RECORD_KINDS.has(rawKind) ? rawKind : 'event';
    const rawStatus = normalizeText(raw.status, 'unknown').toLowerCase();
    const status = ALLOWED_ACTION_STATES.has(rawStatus) ? rawStatus : 'unknown';
    const canonicalKey = normalizeText(raw.canonicalKey).toLowerCase();
    const requestedExistingId = normalizeText(raw.sameAsRecordId);
    const matchedExisting = existingById.get(requestedExistingId) ||
        (canonicalKey ? existingByCanonicalKey.get(canonicalKey) : null);
    const entity = safeMemoryText(raw.entity, 500);
    const actionType = normalizeText(raw.actionType).toLowerCase();
    const sourceEventIds = sourceRefs.map((source) => source.eventId);
    const sourceCorpus = sourceEventIds
        .map((eventId) => evidenceById.get(eventId))
        .filter(Boolean)
        .flatMap((evidence) => [
            normalizeText(evidence.userText),
            normalizeText(evidence.assistantText)
        ])
        .join('\n');
    const temporalAnchors = normalizeTemporalAnchors(
        raw.temporalAnchors,
        sourceCorpus
    );
    const sourceOccurredAt = new Set(
        sourceRefs.map((source) => safeIso(source.occurredAt)).filter(Boolean)
    );
    const validatedTime = (field, value) => {
        const resolved = safeIso(value);
        if (!resolved) {
            return '';
        }
        if (sourceOccurredAt.has(resolved)) {
            return resolved;
        }
        return temporalAnchors.some(
            (anchor) => anchor.field === field && anchor.value === resolved
        ) ? resolved : '';
    };
    const id = matchedExisting?.id || stableId(
        'ledger',
        canonicalKey,
        kind,
        entity.toLowerCase(),
        actionType,
        sourceEventIds.slice().sort().join('|')
    );
    const supersedes = uniqueStrings(raw.supersedesRecordIds, 100)
        .filter((recordId) => existingById.has(recordId) && recordId !== id);
    return {
        id,
        kind,
        canonicalKey,
        entity,
        entityType: normalizeText(raw.entityType).toLowerCase(),
        actionType,
        status,
        summary,
        occurredAt: validatedTime('occurredAt', raw.occurredAt),
        targetAt: validatedTime('targetAt', raw.targetAt),
        completedAt: validatedTime('completedAt', raw.completedAt),
        temporalAnchors,
        aliases: uniqueStrings(raw.aliases, 30),
        keywords: uniqueStrings(raw.keywords, 30),
        quantities: normalizeStructuredFragments(
            raw.quantities,
            ['kind', 'value', 'unit', 'rawText'],
            sourceCorpus,
            ['value']
        ),
        nameMappings: normalizeStructuredFragments(
            raw.nameMappings,
            ['name', 'role', 'relation', 'rawText'],
            sourceCorpus,
            ['name', 'role']
        ),
        stateChanges: normalizeStructuredFragments(
            raw.stateChanges,
            ['field', 'from', 'to', 'rawText'],
            sourceCorpus,
            ['to']
        ),
        sourceRefs,
        sourceEventIds,
        sourceSessionIds: uniqueStrings(
            sourceRefs.map((source) => source.sessionId),
            100
        ),
        sourceMessageIds: uniqueStrings(
            sourceRefs.flatMap((source) => source.messageIds),
            100
        ),
        supersedes,
        supersededBy: '',
        confidence: clampNumber(raw.confidence, 0, 1, 0.7),
        extractionVersion: EVENT_ACTION_EXTRACTION_VERSION,
        extractedAt,
        createdAt: matchedExisting?.createdAt || extractedAt,
        updatedAt: extractedAt
    };
}

function mergeSourceRefs(left, right) {
    return [...new Map(
        [...normalizeArray(left), ...normalizeArray(right)]
            .map(normalizeSourceRef)
            .filter(Boolean)
            .map((source) => [
                `${source.eventId}\u0000${source.sessionId}\u0000${source.occurredAt}`,
                source
            ])
    ).values()].slice(-100);
}

function applyRecords(state, records, extractedAt) {
    const byId = new Map(state.records.map((record) => [record.id, record]));
    let added = 0;
    let merged = 0;
    let superseded = 0;
    for (const record of records) {
        const existing = byId.get(record.id);
        if (existing) {
            existing.sourceRefs = mergeSourceRefs(existing.sourceRefs, record.sourceRefs);
            existing.sourceEventIds = uniqueStrings(
                existing.sourceRefs.map((source) => source.eventId),
                100
            );
            existing.sourceSessionIds = uniqueStrings(
                existing.sourceRefs.map((source) => source.sessionId),
                100
            );
            existing.sourceMessageIds = uniqueStrings(
                existing.sourceRefs.flatMap((source) => source.messageIds),
                100
            );
            existing.aliases = uniqueStrings([...existing.aliases, ...record.aliases], 30);
            existing.keywords = uniqueStrings([...existing.keywords, ...record.keywords], 30);
            existing.quantities = [
                ...existing.quantities,
                ...record.quantities
            ].slice(-30);
            existing.nameMappings = [
                ...existing.nameMappings,
                ...record.nameMappings
            ].slice(-30);
            existing.stateChanges = [
                ...existing.stateChanges,
                ...record.stateChanges
            ].slice(-30);
            existing.temporalAnchors = [
                ...normalizeArray(existing.temporalAnchors),
                ...normalizeArray(record.temporalAnchors)
            ].slice(-12);
            existing.confidence = Math.max(existing.confidence, record.confidence);
            existing.updatedAt = extractedAt;
            if (record.status !== 'unknown') {
                existing.status = record.status;
            }
            for (const field of ['summary', 'entity', 'entityType', 'actionType']) {
                if (record[field]) {
                    existing[field] = record[field];
                }
            }
            for (const field of ['occurredAt', 'targetAt', 'completedAt']) {
                if (record[field]) {
                    existing[field] = record[field];
                }
            }
            existing.supersedes = uniqueStrings(
                [...existing.supersedes, ...record.supersedes],
                100
            );
            merged += 1;
        } else {
            state.records.push(record);
            byId.set(record.id, record);
            added += 1;
        }
        const active = byId.get(record.id);
        for (const priorId of active.supersedes) {
            const prior = byId.get(priorId);
            if (!prior || prior.supersededBy === active.id) {
                continue;
            }
            prior.status = 'superseded';
            prior.supersededBy = active.id;
            prior.updatedAt = extractedAt;
            superseded += 1;
        }
    }
    state.records = state.records.slice(-MAX_RECORDS);
    return { added, merged, superseded };
}

class AILISEventActionLedger {
    constructor(options = {}) {
        this.rootDir = path.resolve(options.rootDir || process.cwd());
        this.statePath = path.join(this.rootDir, EVENT_ACTION_LEDGER_FILE);
        this.runsPath = path.join(this.rootDir, EVENT_ACTION_LEDGER_RUNS_FILE);
        this.llmClient = typeof options.llmClient === 'function' ? options.llmClient : null;
        this.running = false;
        this.lastError = '';
    }

    loadStateSync() {
        return normalizeEventActionLedgerState(
            readJsonSync(this.statePath, defaultEventActionLedgerState())
        );
    }

    async loadState() {
        return normalizeEventActionLedgerState(
            await readJson(this.statePath, defaultEventActionLedgerState())
        );
    }

    getStatus() {
        const state = this.loadStateSync();
        return {
            enabled: Boolean(this.llmClient),
            running: this.running,
            version: `v${EVENT_ACTION_LEDGER_VERSION}`,
            extractionVersion: EVENT_ACTION_EXTRACTION_VERSION,
            statePath: this.statePath,
            recordCount: state.records.length,
            activeRecordCount: state.records.filter(
                (record) => !record.supersededBy && record.status !== 'superseded'
            ).length,
            processedEventCount: state.processedEventIds.length,
            lastError: this.lastError
        };
    }

    listRecords({ includeSuperseded = true } = {}) {
        const records = this.loadStateSync().records;
        return records
            .filter((record) =>
                includeSuperseded ||
                (!record.supersededBy && record.status !== 'superseded')
            )
            .map((record) => ({ ...record }));
    }

    async callModel(evidence, state, options = {}) {
        if (!this.llmClient) {
            return {
                ok: false,
                status: 'llm_client_not_configured',
                error: 'Event/Action Ledger requires an LLM client'
            };
        }
        const payload = {
            messages: [
                { role: 'system', content: extractionSystemPrompt() },
                {
                    role: 'user',
                    content: extractionUserPrompt({
                        evidence,
                        activeRecords: activeRecordSummary(state)
                    })
                }
            ],
            jsonMode: true,
            expectJson: true,
            outputFormat: 'json',
            temperature: 0,
            max_tokens: Math.max(2_000, Number(options.maxTokens) || 10_000),
            timeoutMs: Math.max(10_000, Number(options.timeoutMs) || 120_000)
        };
        const maxAttempts = Math.max(
            1,
            Math.min(Number(options.modelAttempts) || 2, 4)
        );
        let lastFailure = null;
        for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
            let result;
            try {
                result = await this.llmClient(payload);
            } catch (error) {
                lastFailure = {
                    ok: false,
                    status: 'llm_failed',
                    error: error?.message || String(error),
                    attempt
                };
                continue;
            }
            if (result?.ok === false) {
                lastFailure = {
                    ok: false,
                    status: 'llm_failed',
                    error:
                        result.error ||
                        result.message ||
                        'Event/Action Ledger LLM failed',
                    attempt
                };
                continue;
            }
            const parsed = collectLlmCandidates(result)
                .map(parseJsonCandidate)
                .find(isObject);
            if (parsed) {
                return { ok: true, parsed, attempt };
            }
            lastFailure = {
                ok: false,
                status: 'invalid_llm_json',
                error: 'Event/Action Ledger expected a JSON object',
                attempt
            };
        }
        return lastFailure;
    }

    normalizeModelOutput(parsed, evidence, state, extractedAt) {
        const evidenceById = new Map(
            evidence.map((entry) => [entry.eventId, entry])
        );
        const existingById = new Map(
            state.records.map((record) => [record.id, record])
        );
        const existingByCanonicalKey = new Map(
            state.records
                .filter((record) => record.canonicalKey)
                .map((record) => [record.canonicalKey, record])
        );
        const submittedRecords = normalizeArray(parsed.records);
        const records = submittedRecords
            .map((record) => normalizeExtractedRecord(record, {
                evidenceById,
                existingById,
                existingByCanonicalKey,
                extractedAt
            }))
            .filter(Boolean);
        return {
            records,
            rejectedRecordCount: Math.max(0, submittedRecords.length - records.length),
            rejectedEvidenceEventIds: uniqueStrings(
                parsed.rejectedEvidenceEventIds,
                200
            ).filter((eventId) => evidenceById.has(eventId))
        };
    }

    async curate({ events = [], ...options } = {}) {
        if (this.running) {
            return { ok: false, status: 'ledger_curation_already_running' };
        }
        this.running = true;
        const extractedAt = safeIso(options.nowIso, nowIso());
        try {
            const state = await this.loadState();
            const processed = new Set(state.processedEventIds);
            const candidates = normalizeArray(events)
                .filter((event) => normalizeText(event?.id) && !processed.has(event.id))
                .sort((left, right) =>
                    String(left.ts || '').localeCompare(String(right.ts || '')) ||
                    String(left.id || '').localeCompare(String(right.id || ''))
                );
            if (!candidates.length) {
                return {
                    ok: true,
                    status: 'no_new_raw_memory',
                    run: {
                        iso: extractedAt,
                        processedEntryCount: 0,
                        processedEventCount: 0,
                        evidenceCount: 0,
                        batchCount: 0,
                        unitCount: 0,
                        recordCount: 0,
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
            let processedEventCount = 0;
            let evidenceCount = 0;
            let recordCount = 0;
            let mergedRecordCount = 0;
            let rejectedRecordCount = 0;
            let supersededCount = 0;
            const batches = [];
            while (offset < candidates.length && batchCount < maxBatches) {
                const batch = buildEvidenceBatch(candidates.slice(offset), options);
                if (!batch.sourceEventCount) {
                    break;
                }
                const batchEvents = candidates.slice(
                    offset,
                    offset + batch.sourceEventCount
                );
                if (batch.evidence.length) {
                    const extraction = await this.callModel(
                        batch.evidence,
                        state,
                        options
                    );
                    if (!extraction.ok) {
                        this.lastError = extraction.error || extraction.status;
                        if (!processedEventCount) {
                            return extraction;
                        }
                        break;
                    }
                    const normalized = this.normalizeModelOutput(
                        extraction.parsed,
                        batch.evidence,
                        state,
                        extractedAt
                    );
                    const applied = applyRecords(
                        state,
                        normalized.records,
                        extractedAt
                    );
                    evidenceCount += batch.evidence.length;
                    recordCount += applied.added;
                    mergedRecordCount += applied.merged;
                    rejectedRecordCount += normalized.rejectedRecordCount;
                    supersededCount += applied.superseded;
                    batches.push({
                        batchIndex: batchCount + 1,
                        sourceEventCount: batchEvents.length,
                        evidenceCount: batch.evidence.length,
                        addedRecordCount: applied.added,
                        mergedRecordCount: applied.merged,
                        rejectedRecordCount: normalized.rejectedRecordCount,
                        supersededRecordCount: applied.superseded,
                        rejectedEvidenceEventCount:
                            normalized.rejectedEvidenceEventIds.length
                    });
                } else {
                    batches.push({
                        batchIndex: batchCount + 1,
                        sourceEventCount: batchEvents.length,
                        evidenceCount: 0,
                        status: 'skipped_no_persona_dialogue'
                    });
                }
                for (const event of batchEvents) {
                    processed.add(event.id);
                }
                processedEventCount += batchEvents.length;
                offset += batchEvents.length;
                batchCount += 1;
                state.processedEventIds = [...processed].slice(
                    -MAX_PROCESSED_EVENT_IDS
                );
                state.updatedAt = extractedAt;
                state.checkpoint = {
                    status: 'running',
                    extractedAt,
                    processedEventCount,
                    evidenceCount,
                    batchCount,
                    addedRecordCount: recordCount,
                    mergedRecordCount,
                    rejectedRecordCount,
                    supersededCount,
                    remainingEntryCount: Math.max(0, candidates.length - offset)
                };
                await writeJsonAtomic(this.statePath, state);
            }
            state.processedEventIds = [...processed].slice(-MAX_PROCESSED_EVENT_IDS);
            state.updatedAt = extractedAt;
            state.stats = {
                ...(state.stats || {}),
                curationRunCount: Number(state.stats?.curationRunCount || 0) + 1,
                processedEventCount:
                    Number(state.stats?.processedEventCount || 0) + processedEventCount,
                extractedRecordCount:
                    Number(state.stats?.extractedRecordCount || 0) + recordCount,
                rejectedRecordCount:
                    Number(state.stats?.rejectedRecordCount || 0) + rejectedRecordCount,
                supersededRecordCount:
                    Number(state.stats?.supersededRecordCount || 0) + supersededCount
            };
            state.checkpoint = null;
            const remainingEntryCount = Math.max(0, candidates.length - offset);
            const status = remainingEntryCount ? 'partial_completed' : 'completed';
            const run = {
                id: randomUUID(),
                iso: extractedAt,
                status,
                processedEntryCount: processedEventCount,
                processedEventCount,
                evidenceCount,
                batchCount,
                unitCount: recordCount,
                recordCount,
                mergedRecordCount,
                rejectedRecordCount,
                supersededCount,
                remainingEntryCount,
                batches
            };
            await Promise.all([
                writeJsonAtomic(this.statePath, state),
                appendJsonl(this.runsPath, run)
            ]);
            this.lastError = '';
            return {
                ok: true,
                status,
                run,
                stateSummary: {
                    recordCount: state.records.length,
                    activeRecordCount: state.records.filter(
                        (record) =>
                            !record.supersededBy &&
                            record.status !== 'superseded'
                    ).length,
                    processedEventCount: state.processedEventIds.length
                }
            };
        } catch (error) {
            this.lastError = error?.message || String(error);
            return {
                ok: false,
                status: 'ledger_curation_error',
                error: this.lastError
            };
        } finally {
            this.running = false;
        }
    }

    forgetSourceEvent(eventId) {
        const normalizedEventId = normalizeText(eventId);
        if (!normalizedEventId) {
            return { ok: false, status: 'invalid_event_id' };
        }
        const state = this.loadStateSync();
        state.processedEventIds = state.processedEventIds.filter(
            (id) => id !== normalizedEventId
        );
        const removedRecordIds = new Set();
        const retainedRecords = state.records
            .map((record) => {
                const sourceRefs = record.sourceRefs.filter(
                    (source) => source.eventId !== normalizedEventId
                );
                if (!sourceRefs.length) {
                    removedRecordIds.add(record.id);
                    return null;
                }
                return normalizeStoredRecord({
                    ...record,
                    sourceRefs,
                    updatedAt: nowIso()
                });
            })
            .filter(Boolean);
        state.records = retainedRecords.map((record) => ({
            ...record,
            status: removedRecordIds.has(record.supersededBy)
                ? 'unknown'
                : record.status,
            supersededBy: removedRecordIds.has(record.supersededBy)
                ? ''
                : record.supersededBy,
            supersedes: record.supersedes.filter(
                (recordId) => !removedRecordIds.has(recordId)
            )
        }));
        state.updatedAt = nowIso();
        writeJsonAtomicSync(this.statePath, state);
        return { ok: true, status: 'source_forgotten' };
    }

    clearSync() {
        writeJsonAtomicSync(this.statePath, defaultEventActionLedgerState());
        try {
            fs.writeFileSync(this.runsPath, '', 'utf8');
        } catch {}
        this.lastError = '';
        return { ok: true, status: 'cleared' };
    }
}

module.exports = {
    AILISEventActionLedger,
    ALLOWED_ACTION_STATES,
    ALLOWED_RECORD_KINDS,
    EVENT_ACTION_EXTRACTION_VERSION,
    EVENT_ACTION_LEDGER_FILE,
    EVENT_ACTION_LEDGER_RUNS_FILE,
    EVENT_ACTION_LEDGER_VERSION,
    defaultEventActionLedgerState,
    isTaskAgentEvent,
    normalizeEventActionLedgerState
};
