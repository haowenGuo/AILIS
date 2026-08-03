'use strict';

const fs = require('fs');
const path = require('path');
const { createHash } = require('crypto');
const {
    AILISEventActionLedger,
    EVENT_ACTION_EXTRACTION_VERSION
} = require('./ailis-event-action-ledger.cjs');

const MEMORY_COGNITION_VERSION = 1;
const MEMORY_COGNITION_FILE = 'memory-cognition.json';
const DEFAULT_RRF_K = 60;
const DEFAULT_DENSE_MODEL = 'Xenova/multilingual-e5-small';
const DEFAULT_DENSE_REVISION = '761b726dd34fb83930e26aab4e9ac3899aa1fa78';
const DEFAULT_DENSE_BATCH_SIZE = 4;
const DEFAULT_DENSE_MAX_LENGTH = 512;
const DEFAULT_DENSE_MAX_TEXT_CHARS = 1_800;

const MEMORY_STRATEGIES = Object.freeze({
    bm25_phrase_v1: Object.freeze({
        id: 'bm25_phrase_v1',
        label: 'BM25 Phrase Baseline',
        family: 'baseline',
        description: 'Existing AILIS raw-turn BM25, phrase boost, and session diversity baseline.',
        fidelity: 'native_ailis_baseline',
        maturity: 'verified',
        requiresCognition: false,
        requiresDense: false,
        stableContext: false
    }),
    hybrid_rrf_v1: Object.freeze({
        id: 'hybrid_rrf_v1',
        label: '[Prototype] Hybrid Sparse + Dense RRF',
        family: 'hybrid',
        description: 'Prototype only: raw-turn BM25 and multilingual dense retrieval fused with RRF; no mandatory cross-encoder.',
        fidelity: 'prototype',
        maturity: 'prototype',
        requiresCognition: false,
        requiresDense: true,
        stableContext: false
    }),
    hybrid_rrf_ledger_v3: Object.freeze({
        id: 'hybrid_rrf_ledger_v3',
        label: 'AILIS Memory v3: Hybrid RRF + Event/Action Ledger',
        family: 'hybrid_ledger',
        description: 'Native AILIS BM25, multilingual E5, temporal, and entity retrieval channels fused with RRF over immutable raw turns plus a provenance-preserving Event/Action Ledger.',
        fidelity: 'native_ailis_full_implementation',
        maturity: 'full',
        requiresCognition: true,
        requiresDense: true,
        contextBudgetTokens: 4_800,
        stableContext: false
    }),
    chronos_dual_calendar_v1: Object.freeze({
        id: 'chronos_dual_calendar_v1',
        label: '[Prototype] Chronos-like Dual Calendar',
        family: 'chronos',
        description: 'Prototype only: dual-corpus retrieval without the complete Chronos extraction and iterative tool loop.',
        fidelity: 'prototype',
        maturity: 'prototype',
        requiresCognition: true,
        requiresDense: true,
        stableContext: false
    }),
    observational_memory_v1: Object.freeze({
        id: 'observational_memory_v1',
        label: '[Prototype] Observational Memory',
        family: 'observational',
        description: 'Prototype only: stable observations without the complete Mastra Observer/Reflector lifecycle.',
        fidelity: 'prototype',
        maturity: 'prototype',
        requiresCognition: true,
        requiresDense: false,
        stableContext: true
    }),
    hindsight_cognitive_v1: Object.freeze({
        id: 'hindsight_cognitive_v1',
        label: '[Prototype] Hindsight-like Cognitive Memory',
        family: 'hindsight',
        description: 'Prototype only: local cognitive lanes; this is not the official Hindsight Retain/Recall/Reflect runtime.',
        fidelity: 'prototype',
        maturity: 'prototype',
        requiresCognition: true,
        requiresDense: true,
        stableContext: false
    }),
    hybrid_crossencoder_v2: Object.freeze({
        id: 'hybrid_crossencoder_v2',
        label: 'AILIS Hybrid Cascade (Full)',
        family: 'hybrid_full',
        description: 'Native AILIS fielded BM25, dense retrieval, entity/temporal channels, RRF, and mandatory real cross-encoder reranking.',
        fidelity: 'native_ailis_full_implementation',
        maturity: 'full',
        requiresCognition: false,
        requiresDense: true,
        requiresReranker: true,
        contextBudgetTokens: 2_400,
        stableContext: false
    }),
    chronos_full_v1: Object.freeze({
        id: 'chronos_full_v1',
        label: 'Chronos Paper Reproduction (Full)',
        family: 'chronos_full',
        description: 'Paper-equivalent temporal event extraction, dual calendars, dynamic guidance, initial reranking, context expansion, and iterative retrieval tools.',
        fidelity: 'paper_equivalent_reproduction',
        maturity: 'full',
        requiresCognition: true,
        requiresDense: true,
        requiresReranker: true,
        contextBudgetTokens: 8_000,
        stableContext: false
    }),
    mastra_observational_full_v1: Object.freeze({
        id: 'mastra_observational_full_v1',
        label: 'Mastra Observational Memory (Official Runtime)',
        family: 'mastra_observational_official',
        description: 'Direct @mastra/memory ObservationalMemory runtime with official LibSQL storage, resource-scoped Actor/Observer/Reflector lifecycle, synchronous threshold observation/reflection, durable raw messages, observation groups, and an AILIS model/context adapter.',
        fidelity: 'official_runtime_integration',
        maturity: 'full',
        requiresCognition: true,
        requiresDense: false,
        contextBudgetTokens: 70_000,
        stableContext: true
    }),
    mastra_observational_adapter_v1: Object.freeze({
        id: 'mastra_observational_adapter_v1',
        label: '[Adapter] Mastra Observational Memory at AILIS Boundary',
        family: 'mastra_observational_adapter',
        description: 'Source-aligned AILIS storage/model-boundary adaptation retained for ablation; it is not the complete upstream Mastra processor runtime.',
        fidelity: 'official_source_aligned_reproduction',
        maturity: 'experimental',
        requiresCognition: true,
        requiresDense: false,
        contextBudgetTokens: 70_000,
        stableContext: true
    }),
    hindsight_official_v1: Object.freeze({
        id: 'hindsight_official_v1',
        label: 'Hindsight Official Backend',
        family: 'hindsight_official',
        description: 'Direct integration with the official MIT Hindsight daemon and client for Retain, Recall, Reflect, graph retrieval, and cross-encoder reranking.',
        fidelity: 'official_backend_integration',
        maturity: 'full',
        requiresCognition: true,
        requiresDense: false,
        contextBudgetTokens: 16_000,
        stableContext: false
    })
});

const MEMORY_STRATEGY_ALIASES = Object.freeze({
    baseline: 'bm25_phrase_v1',
    bm25: 'bm25_phrase_v1',
    hybrid: 'hybrid_crossencoder_v2',
    rrf: 'hybrid_rrf_v1',
    'memory-v3': 'hybrid_rrf_ledger_v3',
    'hybrid-ledger': 'hybrid_rrf_ledger_v3',
    ledger: 'hybrid_rrf_ledger_v3',
    chronos: 'chronos_full_v1',
    observational: 'mastra_observational_full_v1',
    mastra: 'mastra_observational_full_v1',
    'observational-adapter': 'mastra_observational_adapter_v1',
    'mastra-adapter': 'mastra_observational_adapter_v1',
    hindsight: 'hindsight_official_v1',
    'hybrid-prototype': 'hybrid_rrf_v1',
    'chronos-prototype': 'chronos_dual_calendar_v1',
    'observational-prototype': 'observational_memory_v1',
    'hindsight-prototype': 'hindsight_cognitive_v1'
});

const STOP_WORDS = new Set([
    'a', 'about', 'after', 'all', 'also', 'am', 'an', 'and', 'answer', 'any', 'are',
    'as', 'at', 'be', 'because', 'been', 'before', 'between', 'both', 'but', 'by',
    'can', 'conversation', 'conversations', 'could', 'current', 'date', 'did', 'do',
    'does', 'during', 'each', 'for', 'from', 'had', 'has', 'have', 'he', 'her',
    'here', 'him', 'his', 'how', 'i', 'if', 'in', 'into', 'is', 'it', 'its',
    'me', 'memory', 'more', 'most', 'my', 'of', 'on', 'or', 'our', 'past',
    'please', 'question', 'remember', 'same', 'she', 'should', 'so', 'some', 'than',
    'that', 'the', 'their', 'them', 'then', 'there', 'these', 'they', 'this',
    'those', 'through', 'to', 'up', 'us', 'user', 'was', 'we', 'were', 'what',
    'when', 'where', 'which', 'while', 'who', 'why', 'will', 'with', 'would',
    'you', 'your'
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

function stableHash(...parts) {
    return createHash('sha256')
        .update(parts.map((part) => String(part || '')).join('\n'))
        .digest('hex');
}

function stemToken(value = '') {
    const token = normalizeText(value).toLowerCase();
    if (token.length <= 3 || /^\d+$/.test(token)) {
        return token;
    }
    if (token.length > 5 && token.endsWith('ies')) {
        return /[bcdfghjklmnpqrstvwxyz]ies$/.test(token)
            ? `${token.slice(0, -3)}y`
            : token.slice(0, -1);
    }
    if (token.length > 6 && token.endsWith('ing')) {
        const reduced = token.slice(0, -3);
        return /([a-z])\1$/.test(reduced) ? reduced.slice(0, -1) : reduced;
    }
    if (token.length > 5 && token.endsWith('ed')) {
        const reduced = token.slice(0, -2);
        return /([a-z])\1$/.test(reduced) ? reduced.slice(0, -1) : reduced;
    }
    if (token.length > 5 && token.endsWith('es')) {
        return /(?:s|x|z|ch|sh)es$/.test(token)
            ? token.slice(0, -2)
            : token.slice(0, -1);
    }
    if (token.length > 4 && token.endsWith('s')) {
        return token.slice(0, -1);
    }
    return token;
}

function searchTokens(value = '') {
    const normalized = normalizeText(value).toLowerCase();
    const tokens = [];
    for (const raw of normalized.match(/[a-z0-9]+/g) || []) {
        const token = stemToken(raw);
        if (token.length >= 2 && !STOP_WORDS.has(token)) {
            tokens.push(token);
        }
    }
    const chinese = normalized.replace(/[^\u4e00-\u9fff]/g, '');
    for (let index = 0; index < chinese.length - 1; index += 1) {
        tokens.push(chinese.slice(index, index + 2));
    }
    return tokens;
}

function tokenFrequency(tokens = []) {
    const result = new Map();
    for (const token of tokens) {
        result.set(token, (result.get(token) || 0) + 1);
    }
    return result;
}

function bm25Rank(documents = [], query = '', { k1 = 1.2, b = 0.72 } = {}) {
    const queryTokens = [...new Set(searchTokens(query))];
    if (!documents.length) {
        return [];
    }
    if (!queryTokens.length) {
        return documents.map((document, index) => ({
            document,
            score: 0,
            rank: index + 1
        }));
    }
    const prepared = documents.map((document) => {
        const tokens = searchTokens([
            document.text,
            ...normalizeArray(document.aliases)
        ].join(' '));
        return {
            document,
            tokens,
            frequencies: tokenFrequency(tokens),
            tokenSet: new Set(tokens),
            length: Math.max(1, tokens.length)
        };
    });
    const documentFrequency = new Map();
    for (const entry of prepared) {
        for (const token of entry.tokenSet) {
            documentFrequency.set(token, (documentFrequency.get(token) || 0) + 1);
        }
    }
    const averageLength = prepared.reduce((sum, entry) => sum + entry.length, 0) /
        Math.max(1, prepared.length);
    const scored = prepared.map((entry) => {
        let score = 0;
        for (const token of queryTokens) {
            const frequency = entry.frequencies.get(token) || 0;
            if (!frequency) {
                continue;
            }
            const containing = documentFrequency.get(token) || 0;
            const idf = Math.log(
                1 + (prepared.length - containing + 0.5) / (containing + 0.5)
            );
            const normalization = k1 * (1 - b + b * entry.length / Math.max(1, averageLength));
            score += idf * (frequency * (k1 + 1)) / (frequency + normalization);
        }
        return { document: entry.document, score };
    }).sort((left, right) =>
        right.score - left.score ||
        String(right.document.time || '').localeCompare(String(left.document.time || '')) ||
        String(left.document.id || '').localeCompare(String(right.document.id || ''))
    );
    return scored.map((entry, index) => ({ ...entry, rank: index + 1 }));
}

function hashedEmbedding(value = '', dimensions = 384) {
    const vector = new Float32Array(dimensions);
    const tokens = searchTokens(value);
    for (const token of tokens) {
        const digest = createHash('sha256').update(token).digest();
        for (let offset = 0; offset < 4; offset += 1) {
            const index = digest.readUInt16LE(offset * 2) % dimensions;
            vector[index] += (digest[8 + offset] & 1) === 0 ? 1 : -1;
        }
    }
    let magnitude = 0;
    for (const valueAtIndex of vector) {
        magnitude += valueAtIndex * valueAtIndex;
    }
    magnitude = Math.sqrt(magnitude) || 1;
    for (let index = 0; index < vector.length; index += 1) {
        vector[index] /= magnitude;
    }
    return Array.from(vector);
}

function cosineSimilarity(left = [], right = []) {
    if (!left.length || left.length !== right.length) {
        return 0;
    }
    let dot = 0;
    let leftMagnitude = 0;
    let rightMagnitude = 0;
    for (let index = 0; index < left.length; index += 1) {
        const leftValue = Number(left[index]) || 0;
        const rightValue = Number(right[index]) || 0;
        dot += leftValue * rightValue;
        leftMagnitude += leftValue * leftValue;
        rightMagnitude += rightValue * rightValue;
    }
    const denominator = Math.sqrt(leftMagnitude) * Math.sqrt(rightMagnitude);
    return denominator ? dot / denominator : 0;
}

function normalizeEmbeddingOutput(output, expectedCount) {
    if (!output) {
        return [];
    }
    if (Array.isArray(output) && Array.isArray(output[0])) {
        return output.map((entry) => Array.from(entry, Number));
    }
    if (Array.isArray(output) && expectedCount === 1 && output.every(Number.isFinite)) {
        return [output.map(Number)];
    }
    if (output.data && output.dims) {
        const data = Array.from(output.data, Number);
        const dimensions = Number(output.dims.at(-1)) || 0;
        if (!dimensions) {
            return [];
        }
        const rows = [];
        for (let offset = 0; offset < data.length; offset += dimensions) {
            rows.push(data.slice(offset, offset + dimensions));
        }
        return rows.slice(0, expectedCount);
    }
    if (typeof output.tolist === 'function') {
        const listed = output.tolist();
        return Array.isArray(listed?.[0]) ? listed : [listed];
    }
    return [];
}

function reciprocalRankFusion(channels = [], {
    k = DEFAULT_RRF_K,
    weights = [],
    names = []
} = {}) {
    const byId = new Map();
    channels.forEach((channel, channelIndex) => {
        const weight = clampNumber(weights[channelIndex], 0, 100, 1);
        channel.forEach((entry, index) => {
            const document = entry.document || entry;
            const id = normalizeText(document.id);
            if (!id) {
                return;
            }
            const current = byId.get(id) || {
                document,
                score: 0,
                components: {},
                bestRank: Number.POSITIVE_INFINITY
            };
            const rank = Number(entry.rank) || index + 1;
            current.score += weight / (k + rank);
            current.bestRank = Math.min(current.bestRank, rank);
            const channelName = normalizeText(
                names[channelIndex],
                `channel${channelIndex}`
            );
            current.components[channelName] = {
                rank,
                score: Number(entry.score) || 0,
                weight
            };
            byId.set(id, current);
        });
    });
    return [...byId.values()].sort((left, right) =>
        right.score - left.score ||
        left.bestRank - right.bestRank ||
        String(left.document.id).localeCompare(String(right.document.id))
    );
}

function parseJsonCandidate(value) {
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
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start >= 0 && end > start) {
        try {
            return JSON.parse(text.slice(start, end + 1));
        } catch {}
    }
    return null;
}

function llmTextCandidates(result = {}) {
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
    ).filter(Boolean);
}

function normalizeQueryPlan(raw, originalQuery) {
    const plan = raw && typeof raw === 'object' ? raw : {};
    const searchQueries = normalizeArray(plan.searchQueries)
        .map((entry) => normalizeText(entry))
        .filter(Boolean)
        .slice(0, 6);
    if (!searchQueries.includes(originalQuery)) {
        searchQueries.unshift(originalQuery);
    }
    const start = safeIso(plan.timeRange?.start || plan.timeStart);
    const end = safeIso(plan.timeRange?.end || plan.timeEnd);
    return {
        searchQueries: searchQueries.slice(0, 6),
        targetEntities: normalizeArray(plan.targetEntities)
            .map((entry) => normalizeText(entry))
            .filter(Boolean)
            .slice(0, 16),
        targetActionTypes: normalizeArray(plan.targetActionTypes)
            .map((entry) => normalizeText(entry).toLowerCase())
            .filter(Boolean)
            .slice(0, 16),
        targetStates: normalizeArray(plan.targetStates)
            .map((entry) => normalizeText(entry).toLowerCase())
            .filter(Boolean)
            .slice(0, 8),
        targetRecordKinds: normalizeArray(plan.targetRecordKinds)
            .map((entry) => normalizeText(entry).toLowerCase())
            .filter(Boolean)
            .slice(0, 8),
        semanticKeys: normalizeArray(plan.semanticKeys)
            .map((entry) => normalizeText(entry))
            .filter(Boolean)
            .slice(0, 16),
        includeLanes: normalizeArray(plan.includeLanes)
            .map((entry) => normalizeText(entry).toLowerCase())
            .filter(Boolean)
            .slice(0, 8),
        timeRange: start || end ? { start, end } : null,
        needsCoverage: plan.needsCoverage === true,
        needsLatestState: plan.needsLatestState === true,
        reasoningHint: normalizeText(plan.reasoningHint)
    };
}

function defaultCognitionState() {
    const now = new Date().toISOString();
    return {
        version: MEMORY_COGNITION_VERSION,
        createdAt: now,
        updatedAt: now,
        cursor: {
            lastProcessedIso: '',
            lastProcessedEntryId: ''
        },
        units: [],
        observations: [],
        mentalModels: [],
        stats: {
            processedEvidenceCount: 0,
            curationRunCount: 0
        }
    };
}

function normalizeSourceRefs(value) {
    return normalizeArray(value).map((source) => {
        if (typeof source === 'string') {
            return { evidenceId: source };
        }
        if (!source || typeof source !== 'object') {
            return null;
        }
        return {
            evidenceId: normalizeText(source.evidenceId || source.id),
            eventId: normalizeText(source.eventId),
            sessionId: normalizeText(source.sessionId),
            occurredAt: safeIso(source.occurredAt || source.iso)
        };
    }).filter(Boolean).slice(0, 40);
}

function normalizeCognitionState(raw) {
    const fallback = defaultCognitionState();
    const source = raw && typeof raw === 'object' ? raw : {};
    return {
        ...fallback,
        ...source,
        version: MEMORY_COGNITION_VERSION,
        cursor: {
            ...fallback.cursor,
            ...(source.cursor || {})
        },
        units: normalizeArray(source.units).filter((entry) => entry && typeof entry === 'object'),
        observations: normalizeArray(source.observations).filter((entry) => entry && typeof entry === 'object'),
        mentalModels: normalizeArray(source.mentalModels).filter((entry) => entry && typeof entry === 'object'),
        stats: {
            ...fallback.stats,
            ...(source.stats || {})
        }
    };
}

function loadMemoryCognition(rootDir) {
    const filePath = path.join(path.resolve(rootDir), MEMORY_COGNITION_FILE);
    try {
        if (!fs.existsSync(filePath)) {
            return defaultCognitionState();
        }
        return normalizeCognitionState(JSON.parse(fs.readFileSync(filePath, 'utf8')));
    } catch {
        return defaultCognitionState();
    }
}

function resolveMemoryStrategy(value, fallback = 'bm25_phrase_v1') {
    const normalized = normalizeText(value, fallback).toLowerCase();
    const resolved = MEMORY_STRATEGY_ALIASES[normalized] || normalized;
    return MEMORY_STRATEGIES[resolved] ? resolved : fallback;
}

function strategyCatalog() {
    return Object.values(MEMORY_STRATEGIES).map((entry) => ({ ...entry }));
}

function rawTurnDocuments(events = []) {
    return normalizeArray(events).map((event, index) => ({
        id: `turn:${normalizeText(event.id, index)}`,
        kind: 'turn',
        lane: event.source === 'assistant' ? 'experience' : 'world',
        text: [
            normalizeText(event.userText) ? `User: ${normalizeText(event.userText)}` : '',
            normalizeText(event.assistantText) ? `AILIS: ${normalizeText(event.assistantText)}` : '',
            normalizeText(event.summary)
        ].filter(Boolean).join('\n'),
        aliases: normalizeArray(event.tags),
        time: safeIso(event.ts),
        mentionAt: safeIso(event.ts),
        eventStart: safeIso(event.ts),
        eventEnd: safeIso(event.ts),
        importance: clampNumber(event.importance, 0, 10, 1),
        confidence: 1,
        sourceRefs: [{
            eventId: normalizeText(event.id),
            sessionId: normalizeText(event.sessionId),
            occurredAt: safeIso(event.ts)
        }],
        rawEvent: event,
        stableOrder: index
    }));
}

function renderStructuredFragments(items = [], fields = []) {
    return normalizeArray(items)
        .map((item) => {
            if (!item || typeof item !== 'object') {
                return '';
            }
            return fields
                .map((field) => normalizeText(item[field]))
                .filter(Boolean)
                .join(' | ');
        })
        .filter(Boolean);
}

function ledgerDocuments(records = []) {
    return normalizeArray(records)
        .filter((record) =>
            record &&
            typeof record === 'object' &&
            record.status !== 'superseded' &&
            !normalizeText(record.supersededBy)
        )
        .map((record, index) => {
            const quantities = renderStructuredFragments(
                record.quantities,
                ['kind', 'value', 'unit', 'rawText']
            );
            const nameMappings = renderStructuredFragments(
                record.nameMappings,
                ['name', 'role', 'relation', 'rawText']
            );
            const stateChanges = renderStructuredFragments(
                record.stateChanges,
                ['field', 'from', 'to', 'rawText']
            );
            const entity = normalizeText(record.entity);
            const actionType = normalizeText(record.actionType);
            const status = normalizeText(record.status, 'unknown');
            const text = [
                normalizeText(record.summary),
                entity ? `Entity: ${entity}` : '',
                normalizeText(record.entityType)
                    ? `Entity type: ${normalizeText(record.entityType)}`
                    : '',
                actionType ? `Action: ${actionType}` : '',
                `State: ${status}`,
                safeIso(record.occurredAt)
                    ? `Occurred: ${safeIso(record.occurredAt)}`
                    : '',
                safeIso(record.targetAt)
                    ? `Target: ${safeIso(record.targetAt)}`
                    : '',
                safeIso(record.completedAt)
                    ? `Completed: ${safeIso(record.completedAt)}`
                    : '',
                ...quantities.map((value) => `Exact value: ${value}`),
                ...nameMappings.map((value) => `Name mapping: ${value}`),
                ...stateChanges.map((value) => `State change: ${value}`)
            ].filter(Boolean).join('\n');
            return {
                id: `ledger:${normalizeText(record.id, index)}`,
                kind: 'ledger_record',
                lane: record.kind === 'action' ? 'event' : normalizeText(record.kind, 'world'),
                semanticKey: normalizeText(record.canonicalKey),
                text,
                aliases: [
                    entity,
                    actionType,
                    status,
                    ...normalizeArray(record.aliases),
                    ...normalizeArray(record.keywords),
                    ...quantities,
                    ...nameMappings,
                    ...stateChanges
                ].filter(Boolean),
                entities: [
                    entity,
                    ...normalizeArray(record.aliases),
                    ...normalizeArray(record.nameMappings)
                        .flatMap((mapping) => [
                            normalizeText(mapping?.name),
                            normalizeText(mapping?.role)
                        ])
                ].filter(Boolean),
                temporalValues: [
                    safeIso(record.occurredAt),
                    safeIso(record.targetAt),
                    safeIso(record.completedAt)
                ].filter(Boolean),
                time: safeIso(
                    record.occurredAt ||
                    record.targetAt ||
                    record.extractedAt
                ),
                mentionAt: normalizeArray(record.sourceRefs)
                    .map((source) => safeIso(source?.occurredAt))
                    .filter(Boolean)
                    .sort()
                    .at(-1) || '',
                eventStart: safeIso(record.occurredAt || record.targetAt),
                eventEnd: safeIso(record.completedAt),
                importance: record.kind === 'action' ? 1 : 0.8,
                confidence: clampNumber(record.confidence, 0, 1, 0.7),
                sourceRefs: normalizeArray(record.sourceRefs),
                structured: record,
                stableOrder: index
            };
        })
        .filter((document) => document.text && document.sourceRefs.length);
}

function cognitionDocuments(cognition = defaultCognitionState()) {
    const unitDocuments = normalizeArray(cognition.units)
        .filter((unit) => unit.status !== 'inactive')
        .map((unit, index) => ({
            id: `unit:${normalizeText(unit.id, index)}`,
            kind: 'unit',
            lane: normalizeText(unit.lane, 'world').toLowerCase(),
            semanticKey: normalizeText(unit.semanticKey),
            text: normalizeText(unit.statement || unit.text),
            aliases: [
                ...normalizeArray(unit.aliases),
                normalizeText(unit.subject),
                normalizeText(unit.predicate),
                normalizeText(unit.object)
            ].filter(Boolean),
            time: safeIso(unit.eventStart || unit.mentionAt || unit.createdAt),
            mentionAt: safeIso(unit.mentionAt || unit.createdAt),
            eventStart: safeIso(unit.eventStart),
            eventEnd: safeIso(unit.eventEnd),
            validFrom: safeIso(unit.validFrom),
            validUntil: safeIso(unit.validUntil),
            importance: clampNumber(unit.importance, 0, 1, 0.5),
            confidence: clampNumber(unit.confidence, 0, 1, 0.7),
            supersededBy: normalizeText(unit.supersededBy),
            sourceRefs: normalizeSourceRefs(unit.sources || unit.sourceRefs),
            structured: unit,
            stableOrder: index
        }))
        .filter((document) => document.text);
    const observationDocuments = normalizeArray(cognition.observations)
        .filter((observation) => observation.status !== 'inactive')
        .map((observation, index) => ({
            id: `observation:${normalizeText(observation.id, index)}`,
            kind: 'observation',
            lane: 'observation',
            semanticKey: normalizeText(observation.semanticKey),
            text: normalizeText(observation.text || observation.statement),
            aliases: normalizeArray(observation.aliases),
            time: safeIso(
                observation.referencedAt ||
                observation.relativeAt ||
                observation.observedAt ||
                observation.createdAt
            ),
            mentionAt: safeIso(observation.observedAt || observation.createdAt),
            eventStart: safeIso(observation.referencedAt || observation.relativeAt),
            importance: clampNumber(observation.priority, 0, 1, 0.5),
            confidence: clampNumber(observation.confidence, 0, 1, 0.75),
            supersededBy: normalizeText(observation.supersededBy),
            sourceRefs: normalizeSourceRefs(observation.sources || observation.sourceRefs),
            structured: observation,
            stableOrder: index
        }))
        .filter((document) => document.text);
    const mentalModelDocuments = normalizeArray(cognition.mentalModels)
        .filter((model) => model.status !== 'inactive')
        .map((model, index) => ({
            id: `mental:${normalizeText(model.id, index)}`,
            kind: 'mental_model',
            lane: normalizeText(model.lane, 'observation').toLowerCase(),
            semanticKey: normalizeText(model.semanticKey),
            text: normalizeText(model.text || model.statement),
            aliases: normalizeArray(model.aliases),
            time: safeIso(model.updatedAt || model.createdAt),
            mentionAt: safeIso(model.updatedAt || model.createdAt),
            importance: clampNumber(model.importance, 0, 1, 0.7),
            confidence: clampNumber(model.confidence, 0, 1, 0.7),
            sourceRefs: normalizeSourceRefs(model.sources || model.sourceRefs),
            structured: model,
            stableOrder: index
        }))
        .filter((document) => document.text);
    return { unitDocuments, observationDocuments, mentalModelDocuments };
}

function inTimeRange(document, timeRange) {
    if (!timeRange) {
        return true;
    }
    const value = Date.parse(document.eventStart || document.time || document.mentionAt || '');
    if (!Number.isFinite(value)) {
        return true;
    }
    const start = Date.parse(timeRange.start || '');
    const end = Date.parse(timeRange.end || '');
    return (!Number.isFinite(start) || value >= start) &&
        (!Number.isFinite(end) || value <= end);
}

function activeAtQuestion(document, questionTime, { latestStateOnly = false } = {}) {
    const at = Date.parse(questionTime || '');
    const mentionAt = Date.parse(document.mentionAt || document.time || '');
    if (Number.isFinite(at) && Number.isFinite(mentionAt) && mentionAt > at) {
        return false;
    }
    if (!latestStateOnly) {
        return true;
    }
    if (document.supersededBy) {
        return false;
    }
    const validFrom = Date.parse(document.validFrom || '');
    const validUntil = Date.parse(document.validUntil || '');
    return (!Number.isFinite(at) || !Number.isFinite(validFrom) || at >= validFrom) &&
        (!Number.isFinite(at) || !Number.isFinite(validUntil) || at <= validUntil);
}

function entityRank(documents = [], plan = {}) {
    const targets = normalizeArray(plan.targetEntities)
        .map((entry) => normalizeText(entry))
        .filter(Boolean);
    const query = targets.length
        ? targets.join(' ')
        : normalizeArray(plan.searchQueries).join(' ');
    if (!normalizeText(query)) {
        return [];
    }
    const entityDocuments = documents
        .map((document) => ({
            id: document.id,
            text: [
                ...normalizeArray(document.entities),
                ...normalizeArray(document.aliases),
                normalizeText(document.structured?.entity),
                ...normalizeArray(document.structured?.nameMappings)
                    .flatMap((mapping) => [
                        normalizeText(mapping?.name),
                        normalizeText(mapping?.role)
                    ])
            ].filter(Boolean).join(' '),
            time: document.time,
            original: document
        }))
        .filter((document) => document.text);
    return bm25Rank(entityDocuments, query)
        .filter((entry) => entry.score > 0)
        .map((entry, index) => ({
            document: entry.document.original,
            score: entry.score,
            rank: index + 1
        }));
}

function temporalRank(documents = [], plan = {}, questionTime = '') {
    const timeRange = plan.timeRange || null;
    const query = [
        ...normalizeArray(plan.searchQueries),
        normalizeText(timeRange?.start),
        normalizeText(timeRange?.end)
    ].filter(Boolean).join(' ');
    const queryTokens = new Set(
        searchTokens(query).filter((token) => Number.isFinite(Number(token)))
    );
    const rangeStart = Date.parse(timeRange?.start || '');
    const rangeEnd = Date.parse(timeRange?.end || '');
    const at = Date.parse(questionTime || '');
    const scored = [];
    for (const document of documents) {
        const temporalValues = [
            ...normalizeArray(document.temporalValues),
            document.eventStart,
            document.eventEnd,
            document.time,
            document.mentionAt
        ].map((value) => safeIso(value)).filter(Boolean);
        if (!temporalValues.length) {
            continue;
        }
        const temporalTokens = new Set(searchTokens(temporalValues.join(' ')));
        let score = [...queryTokens]
            .filter((token) => temporalTokens.has(token))
            .length;
        const documentTime = Date.parse(
            document.eventStart || document.time || document.mentionAt || ''
        );
        if (
            Number.isFinite(documentTime) &&
            (!Number.isFinite(rangeStart) || documentTime >= rangeStart) &&
            (!Number.isFinite(rangeEnd) || documentTime <= rangeEnd) &&
            (Number.isFinite(rangeStart) || Number.isFinite(rangeEnd))
        ) {
            score += 4;
        }
        if (
            plan.needsLatestState === true &&
            Number.isFinite(documentTime) &&
            (!Number.isFinite(at) || documentTime <= at)
        ) {
            score += 1 + documentTime / 1e15;
        }
        if (score > 0) {
            scored.push({ document, score });
        }
    }
    return scored
        .sort((left, right) =>
            right.score - left.score ||
            String(right.document.time || '').localeCompare(
                String(left.document.time || '')
            ) ||
            String(left.document.id || '').localeCompare(
                String(right.document.id || '')
            )
        )
        .map((entry, index) => ({ ...entry, rank: index + 1 }));
}

function retrievalMetadata(entry = {}) {
    const components = entry.components || {};
    return {
        fusedScore: Number(entry.score) || 0,
        matchedChannels: Object.keys(components),
        channelRanks: Object.fromEntries(
            Object.entries(components).map(([channel, component]) => [
                channel,
                Number(component?.rank) || 0
            ])
        ),
        channelScores: Object.fromEntries(
            Object.entries(components).map(([channel, component]) => [
                channel,
                Number(component?.score) || 0
            ])
        )
    };
}

function mergeRetrievalMetadata(primary, secondary) {
    if (!primary && !secondary) {
        return null;
    }
    if (!primary) {
        return secondary;
    }
    if (!secondary) {
        return primary;
    }
    const channelRanks = { ...primary.channelRanks };
    for (const [channel, rank] of Object.entries(secondary.channelRanks || {})) {
        channelRanks[channel] = channelRanks[channel]
            ? Math.min(channelRanks[channel], rank)
            : rank;
    }
    return {
        fusedScore: Math.max(
            Number(primary.fusedScore) || 0,
            Number(secondary.fusedScore) || 0
        ),
        matchedChannels: [...new Set([
            ...normalizeArray(primary.matchedChannels),
            ...normalizeArray(secondary.matchedChannels)
        ])],
        channelRanks,
        channelScores: {
            ...(primary.channelScores || {}),
            ...(secondary.channelScores || {})
        },
        rawAnchor: primary,
        derivedLedger: secondary
    };
}

function resolveSourceEvents(documents, events, limit) {
    const byId = new Map(events.map((event) => [normalizeText(event.id), event]));
    const byTurn = new Map(events.map((event) => [
        `${normalizeText(event.sessionId)}\u0000${safeIso(event.ts)}`,
        event
    ]));
    const selected = [];
    const selectedIds = new Set();
    for (const document of documents) {
        const refs = normalizeArray(document.sourceRefs);
        if (document.rawEvent) {
            refs.unshift({
                eventId: normalizeText(document.rawEvent.id),
                sessionId: normalizeText(document.rawEvent.sessionId),
                occurredAt: safeIso(document.rawEvent.ts)
            });
        }
        for (const ref of refs) {
            const event = byId.get(normalizeText(ref.eventId)) ||
                byTurn.get(`${normalizeText(ref.sessionId)}\u0000${safeIso(ref.occurredAt)}`);
            if (!event || selectedIds.has(event.id)) {
                continue;
            }
            selected.push(event);
            selectedIds.add(event.id);
            if (selected.length >= limit) {
                return selected;
            }
        }
    }
    return selected;
}

function renderDocumentContext(documents = [], {
    title = 'Retrieved memory evidence',
    maxChars = 12000
} = {}) {
    const lines = [`### ${title}`];
    for (const document of documents) {
        const time = document.eventStart || document.time || document.mentionAt || '';
        const lane = document.lane ? ` | ${document.lane}` : '';
        lines.push(`- [${time || 'time unknown'}${lane}] ${document.text}`);
        const source = normalizeArray(document.sourceRefs)[0];
        if (source?.sessionId) {
            lines.push(`  - source: session=${source.sessionId} occurredAt=${source.occurredAt || 'unknown'}`);
        }
    }
    return lines.join('\n').slice(0, Math.max(200, Number(maxChars) || 12000));
}

function renderHybridLedgerContext({
    ledger = [],
    rawDocuments = [],
    maxChars = 19_200
} = {}) {
    const lines = [
        '### AILIS structured Event/Action Ledger',
        'The ledger is a derived index. Treat the cited raw conversation below as the source of truth.',
        'Keep distinct entities and lifecycle actions separate. For counts, count the requested records after applying their explicit states; do not merge a return with a replacement pickup.'
    ];
    if (!ledger.length) {
        lines.push('- No query-relevant structured ledger record was retrieved.');
    }
    for (const document of ledger) {
        const record = document.structured || {};
        lines.push(
            `- [record=${normalizeText(record.id)} | kind=${normalizeText(record.kind)} | ` +
            `state=${normalizeText(record.status, 'unknown')}] ${normalizeText(record.summary)}`
        );
        const fields = [
            normalizeText(record.entity) ? `entity=${normalizeText(record.entity)}` : '',
            normalizeText(record.actionType)
                ? `action=${normalizeText(record.actionType)}`
                : '',
            safeIso(record.occurredAt)
                ? `occurredAt=${safeIso(record.occurredAt)}`
                : '',
            safeIso(record.targetAt)
                ? `targetAt=${safeIso(record.targetAt)}`
                : '',
            safeIso(record.completedAt)
                ? `completedAt=${safeIso(record.completedAt)}`
                : ''
        ].filter(Boolean);
        if (fields.length) {
            lines.push(`  - fields: ${fields.join(' | ')}`);
        }
        for (const value of renderStructuredFragments(
            record.quantities,
            ['kind', 'value', 'unit', 'rawText']
        )) {
            lines.push(`  - exact value: ${value}`);
        }
        for (const mapping of renderStructuredFragments(
            record.nameMappings,
            ['name', 'role', 'relation', 'rawText']
        )) {
            lines.push(`  - name mapping: ${mapping}`);
        }
        for (const change of renderStructuredFragments(
            record.stateChanges,
            ['field', 'from', 'to', 'rawText']
        )) {
            lines.push(`  - state change: ${change}`);
        }
        lines.push(
            `  - provenance: eventIds=${normalizeArray(record.sourceEventIds).join(',') || 'unknown'}; ` +
            `sessionIds=${normalizeArray(record.sourceSessionIds).join(',') || 'unknown'}; ` +
            `extraction=${normalizeText(record.extractionVersion, EVENT_ACTION_EXTRACTION_VERSION)}`
        );
    }
    lines.push('', '### Retrieved immutable raw conversation evidence');
    const seen = new Set();
    for (const document of rawDocuments) {
        const event = document.rawEvent;
        if (!event || seen.has(event.id)) {
            continue;
        }
        seen.add(event.id);
        lines.push(
            `- [event=${normalizeText(event.id)} | session=${normalizeText(event.sessionId)} | ` +
            `occurredAt=${safeIso(event.ts) || 'unknown'}]`
        );
        if (normalizeText(event.userText)) {
            lines.push(`  - User: ${normalizeText(event.userText)}`);
        }
        if (normalizeText(event.assistantText)) {
            lines.push(`  - AILIS: ${normalizeText(event.assistantText)}`);
        }
    }
    return lines.join('\n').slice(
        0,
        Math.max(500, Number(maxChars) || 19_200)
    );
}

function denseEmbeddingText(
    value,
    maxChars = DEFAULT_DENSE_MAX_TEXT_CHARS
) {
    const text = normalizeText(value);
    const boundedMaxChars = Math.max(256, Number(maxChars) || 0);
    if (text.length <= boundedMaxChars) {
        return text;
    }
    const side = Math.floor((boundedMaxChars - 3) / 2);
    return `${text.slice(0, side)} … ${text.slice(-side)}`;
}

class LocalEmbeddingRuntime {
    constructor(options = {}) {
        this.model = normalizeText(options.model, DEFAULT_DENSE_MODEL);
        this.revision = normalizeText(
            options.revision || options.embeddingRevision,
            DEFAULT_DENSE_REVISION
        );
        this.enabled = options.enabled === true;
        this.allowRemoteModels = options.allowRemoteModels !== false;
        this.remoteHost = normalizeText(
            options.remoteHost ||
            options.modelRemoteHost ||
            process.env.AILIS_MEMORY_MODEL_ENDPOINT ||
            process.env.HF_ENDPOINT
        ).replace(/\/+$/, '');
        this.cacheDir = normalizeText(
            options.cacheDir ||
            options.modelCacheDir ||
            process.env.AILIS_MEMORY_MODEL_CACHE ||
            process.env.TRANSFORMERS_CACHE
        );
        this.batchSize = Math.max(
            1,
            Math.min(
                32,
                Number(
                    options.batchSize ||
                    process.env.AILIS_MEMORY_EMBEDDING_BATCH_SIZE
                ) || DEFAULT_DENSE_BATCH_SIZE
            )
        );
        this.maxLength = Math.max(
            64,
            Math.min(512, Number(options.maxLength) || DEFAULT_DENSE_MAX_LENGTH)
        );
        this.maxTextChars = Math.max(
            256,
            Number(options.maxTextChars) || DEFAULT_DENSE_MAX_TEXT_CHARS
        );
        this.injectedEmbedder = typeof options.embedder === 'function' ? options.embedder : null;
        this.pipeline = null;
        this.pipelinePromise = null;
        this.cache = new Map();
        this.lastError = '';
        this.runtime = this.injectedEmbedder ? 'injected' : 'not_loaded';
    }

    async ensurePipeline() {
        if (this.injectedEmbedder || !this.enabled) {
            return null;
        }
        if (this.pipeline) {
            return this.pipeline;
        }
        if (this.pipelinePromise) {
            return this.pipelinePromise;
        }
        this.pipelinePromise = (async () => {
            try {
                let transformers;
                try {
                    transformers = await import('@huggingface/transformers');
                    this.runtime = '@huggingface/transformers';
                } catch {
                    transformers = await import('@xenova/transformers');
                    this.runtime = '@xenova/transformers';
                }
                if (transformers.env) {
                    transformers.env.allowRemoteModels = this.allowRemoteModels;
                    if (this.remoteHost) {
                        transformers.env.remoteHost = `${this.remoteHost}/`;
                    }
                    if (this.cacheDir) {
                        transformers.env.cacheDir = path.resolve(this.cacheDir);
                    }
                }
                this.pipeline = await transformers.pipeline(
                    'feature-extraction',
                    this.model,
                    { revision: this.revision }
                );
                return this.pipeline;
            } catch (error) {
                this.lastError = error?.message || String(error);
                this.runtime = 'hashed_fallback';
                return null;
            }
        })();
        return this.pipelinePromise;
    }

    async embed(texts = []) {
        const inputs = normalizeArray(texts).map((entry) => normalizeText(entry));
        const results = new Array(inputs.length);
        const missing = [];
        inputs.forEach((text, index) => {
            const cacheKey = stableHash(this.model, text);
            if (this.cache.has(cacheKey)) {
                results[index] = this.cache.get(cacheKey);
            } else {
                missing.push({ text, index, cacheKey });
            }
        });
        if (!missing.length) {
            return results;
        }
        let vectors = [];
        try {
            if (this.injectedEmbedder) {
                for (let offset = 0; offset < missing.length; offset += this.batchSize) {
                    const batch = missing.slice(offset, offset + this.batchSize);
                    const batchVectors = normalizeEmbeddingOutput(
                        await this.injectedEmbedder(
                            batch.map((entry) =>
                                denseEmbeddingText(entry.text, this.maxTextChars)
                            )
                        ),
                        batch.length
                    );
                    if (
                        batchVectors.length !== batch.length ||
                        batchVectors.some((entry) => !entry?.length)
                    ) {
                        throw new Error('prototype dense embedder returned invalid batch rows');
                    }
                    vectors.push(...batchVectors);
                }
                this.runtime = 'injected';
            } else {
                const pipeline = await this.ensurePipeline();
                if (pipeline) {
                    for (let offset = 0; offset < missing.length; offset += this.batchSize) {
                        const batch = missing.slice(offset, offset + this.batchSize);
                        const output = await pipeline(
                            batch.map((entry) =>
                                denseEmbeddingText(entry.text, this.maxTextChars)
                            ),
                            {
                                pooling: 'mean',
                                normalize: true,
                                truncation: true,
                                max_length: this.maxLength
                            }
                        );
                        const batchVectors = normalizeEmbeddingOutput(
                            output,
                            batch.length
                        );
                        if (
                            batchVectors.length !== batch.length ||
                            batchVectors.some((entry) => !entry?.length)
                        ) {
                            throw new Error(
                                'prototype dense model returned invalid batch rows'
                            );
                        }
                        vectors.push(...batchVectors);
                    }
                }
            }
        } catch (error) {
            this.lastError = error?.message || String(error);
            vectors = [];
            this.runtime = 'hashed_fallback';
        }
        missing.forEach((entry, vectorIndex) => {
            const vector = vectors[vectorIndex] || hashedEmbedding(entry.text);
            results[entry.index] = vector;
            this.cache.set(entry.cacheKey, vector);
        });
        if (!vectors.length) {
            this.runtime = 'hashed_fallback';
        }
        return results;
    }

    getStatus() {
        return {
            enabled: this.enabled,
            model: this.model,
            revision: this.revision,
            runtime: this.runtime,
            cacheSize: this.cache.size,
            remoteHost: this.remoteHost || 'library_default',
            cacheDir: this.cacheDir ? path.resolve(this.cacheDir) : 'library_default',
            allowRemoteModels: this.allowRemoteModels,
            batchSize: this.batchSize,
            maxLength: this.maxLength,
            maxTextChars: this.maxTextChars,
            lastError: this.lastError
        };
    }
}

class AILISMemoryStrategyEngine {
    constructor(options = {}) {
        this.rootDir = path.resolve(options.rootDir || process.cwd());
        this.strategy = resolveMemoryStrategy(
            options.strategy ||
            process.env.AILIS_MEMORY_STRATEGY ||
            'bm25_phrase_v1'
        );
        this.queryPlanner = typeof options.queryPlanner === 'function'
            ? options.queryPlanner
            : null;
        this.reranker = typeof options.reranker === 'function'
            ? options.reranker
            : null;
        this.embeddingRuntime = new LocalEmbeddingRuntime({
            enabled: options.enableLocalEmbeddings === true,
            allowRemoteModels: options.allowRemoteModels !== false,
            model: options.embeddingModel,
            revision: options.embeddingRevision,
            remoteHost: options.modelRemoteHost,
            cacheDir: options.modelCacheDir,
            embedder: options.embedder
        });
        this.eventActionLedger = options.eventActionLedger ||
            new AILISEventActionLedger({
                rootDir: this.rootDir,
                llmClient: this.queryPlanner
            });
        this.fullRuntimeOptions = {
            rootDir: this.rootDir,
            llmClient: this.queryPlanner,
            queryPlanner: this.queryPlanner,
            embedder: options.embedder,
            reranker: options.reranker,
            enableLocalEmbeddings: options.enableLocalEmbeddings === true,
            embeddingModel: options.embeddingModel,
            embeddingRevision: options.embeddingRevision,
            rerankerModel: options.rerankerModel,
            rerankerRevision: options.rerankerRevision,
            allowRemoteModels: options.allowRemoteModels !== false,
            modelRemoteHost: options.modelRemoteHost,
            modelCacheDir: options.modelCacheDir
        };
        this.fullRuntimeConfig = {
            chronosMaxAgentSteps: options.chronosMaxAgentSteps,
            observationalMessageTokens: options.observationalMessageTokens,
            observationalObservationTokens: options.observationalObservationTokens,
            observationalMaxTokensPerBatch: options.observationalMaxTokensPerBatch,
            observationalPreviousObserverTokens:
                options.observationalPreviousObserverTokens,
            observationalRawTailTokens: options.observationalRawTailTokens,
            hindsightBaseUrl: options.hindsightBaseUrl,
            hindsightAutoStart: options.hindsightAutoStart,
            hindsightPort: options.hindsightPort,
            hindsightHost: options.hindsightHost,
            hindsightProfile: options.hindsightProfile,
            hindsightBankId: options.hindsightBankId,
            hindsightEmbedPackagePath: options.hindsightEmbedPackagePath,
            hindsightClient: options.hindsightClient,
            hindsightServer: options.hindsightServer
        };
        this.fullRuntimeOverrides = {
            hybrid_crossencoder_v2: options.hybridFullRuntime,
            chronos_full_v1: options.chronosFullRuntime,
            mastra_observational_full_v1: options.mastraObservationalRuntime,
            mastra_observational_adapter_v1:
                options.mastraObservationalAdapterRuntime,
            hindsight_official_v1: options.hindsightOfficialRuntime
        };
        this.fullRuntimes = {};
        this.lastPlan = null;
        this.lastDiagnostics = null;
    }

    getFullRuntime(strategy) {
        const resolved = resolveMemoryStrategy(strategy, this.strategy);
        if (this.fullRuntimes[resolved]) {
            return this.fullRuntimes[resolved];
        }
        if (this.fullRuntimeOverrides[resolved]) {
            this.fullRuntimes[resolved] = this.fullRuntimeOverrides[resolved];
            return this.fullRuntimes[resolved];
        }
        if (resolved === 'hybrid_crossencoder_v2') {
            const { AILISHybridFullMemory } = require('./ailis-memory-hybrid-full.cjs');
            this.fullRuntimes[resolved] = new AILISHybridFullMemory(
                this.fullRuntimeOptions
            );
        } else if (resolved === 'chronos_full_v1') {
            const { AILISChronosFullMemory } = require('./ailis-memory-chronos-full.cjs');
            this.fullRuntimes[resolved] = new AILISChronosFullMemory({
                ...this.fullRuntimeOptions,
                maxAgentSteps: this.fullRuntimeConfig.chronosMaxAgentSteps
            });
        } else if (resolved === 'mastra_observational_full_v1') {
            const {
                AILISMastraOfficialMemory
            } = require('./ailis-memory-mastra-official.cjs');
            this.fullRuntimes[resolved] = new AILISMastraOfficialMemory({
                ...this.fullRuntimeOptions,
                messageTokens: this.fullRuntimeConfig.observationalMessageTokens,
                observationTokens:
                    this.fullRuntimeConfig.observationalObservationTokens,
                maxTokensPerBatch:
                    this.fullRuntimeConfig.observationalMaxTokensPerBatch,
                previousObserverTokens:
                    this.fullRuntimeConfig.observationalPreviousObserverTokens,
                rawTailTokens: this.fullRuntimeConfig.observationalRawTailTokens
            });
        } else if (resolved === 'mastra_observational_adapter_v1') {
            const {
                AILISMastraObservationalMemory
            } = require('./ailis-memory-observational-full.cjs');
            this.fullRuntimes[resolved] = new AILISMastraObservationalMemory({
                ...this.fullRuntimeOptions,
                messageTokens: this.fullRuntimeConfig.observationalMessageTokens,
                observationTokens:
                    this.fullRuntimeConfig.observationalObservationTokens,
                maxTokensPerBatch:
                    this.fullRuntimeConfig.observationalMaxTokensPerBatch,
                previousObserverTokens:
                    this.fullRuntimeConfig.observationalPreviousObserverTokens,
                rawTailTokens: this.fullRuntimeConfig.observationalRawTailTokens
            });
        } else if (resolved === 'hindsight_official_v1') {
            const {
                AILISHindsightOfficialMemory
            } = require('./ailis-memory-hindsight-official.cjs');
            this.fullRuntimes[resolved] = new AILISHindsightOfficialMemory({
                ...this.fullRuntimeOptions,
                baseUrl: this.fullRuntimeConfig.hindsightBaseUrl,
                autoStart: this.fullRuntimeConfig.hindsightAutoStart,
                port: this.fullRuntimeConfig.hindsightPort,
                host: this.fullRuntimeConfig.hindsightHost,
                profile: this.fullRuntimeConfig.hindsightProfile,
                bankId: this.fullRuntimeConfig.hindsightBankId,
                embedPackagePath:
                    this.fullRuntimeConfig.hindsightEmbedPackagePath,
                client: this.fullRuntimeConfig.hindsightClient,
                server: this.fullRuntimeConfig.hindsightServer
            });
        }
        return this.fullRuntimes[resolved] || null;
    }

    setStrategy(value) {
        this.strategy = resolveMemoryStrategy(value, this.strategy);
        return this.getStatus();
    }

    getStatus() {
        const runtimeFamily = MEMORY_STRATEGIES[this.strategy]?.family || '';
        const fullRuntime = [
            'hybrid_full',
            'chronos_full',
            'mastra_observational_official',
            'mastra_observational_adapter',
            'hindsight_official'
        ].includes(runtimeFamily)
            ? this.getFullRuntime(this.strategy)
            : null;
        return {
            strategy: this.strategy,
            profile: { ...MEMORY_STRATEGIES[this.strategy] },
            embedding: this.embeddingRuntime.getStatus(),
            eventActionLedger: this.eventActionLedger?.getStatus?.() || null,
            fullRuntime: fullRuntime?.getStatus?.() || null,
            lastPlan: this.lastPlan,
            lastDiagnostics: this.lastDiagnostics
        };
    }

    async curateStrategy({ events = [], maxBatches = 12, ...options } = {}) {
        if (MEMORY_STRATEGIES[this.strategy]?.family === 'hybrid_ledger') {
            return await this.eventActionLedger.curate({
                events,
                maxBatches,
                ...options
            });
        }
        const runtime = this.getFullRuntime(this.strategy);
        if (!runtime?.curate) {
            return null;
        }
        return await runtime.curate({ events, maxBatches });
    }

    clearDerivedMemory() {
        return this.eventActionLedger?.clearSync?.() || {
            ok: true,
            status: 'not_configured'
        };
    }

    forgetSourceEvent(eventId) {
        return this.eventActionLedger?.forgetSourceEvent?.(eventId) || {
            ok: true,
            status: 'not_configured'
        };
    }

    async shutdown() {
        await Promise.all(
            Object.values(this.fullRuntimes || {}).map((runtime) =>
                runtime?.shutdown?.()
            ).filter(Boolean)
        );
    }

    async planQuery(query, { questionTime = '' } = {}) {
        const originalQuery = normalizeText(query);
        if (!this.queryPlanner) {
            const plan = normalizeQueryPlan(null, originalQuery);
            this.lastPlan = { ...plan, source: 'original_query_fallback' };
            return this.lastPlan;
        }
        const schema = {
            searchQueries: ['self-contained search query'],
            targetEntities: ['entity or subject'],
            targetActionTypes: ['normalized action type such as pickup, return, visit, update'],
            targetStates: ['pending|completed|cancelled|superseded|unknown'],
            targetRecordKinds: ['event|action|state|mapping|measurement'],
            semanticKeys: ['stable attribute or event slot'],
            includeLanes: ['event|world|experience|observation|opinion|preference'],
            timeRange: { start: 'ISO datetime or empty', end: 'ISO datetime or empty' },
            needsCoverage: false,
            needsLatestState: false,
            reasoningHint: 'brief retrieval guidance'
        };
        try {
            const result = await this.queryPlanner({
                messages: [
                    {
                        role: 'system',
                        content: [
                            'You are the AILIS memory query planner.',
                            'Analyze the current user question without benchmark labels or hidden answers.',
                            'Create evidence-retrieval guidance only. Do not answer the question.',
                            'When the question targets lifecycle actions or states, fill targetActionTypes, targetStates, and targetRecordKinds so the structured ledger can scope candidates.',
                            'Return valid JSON matching the requested schema.',
                            'Resolve time expressions only when the reference time makes the range supportable.',
                            'Use multiple search queries when evidence may be distributed across conversations.'
                        ].join('\n')
                    },
                    {
                        role: 'user',
                        content: JSON.stringify({
                            currentQuestion: originalQuery,
                            referenceTime: safeIso(questionTime),
                            outputSchema: schema
                        }, null, 2)
                    }
                ],
                jsonMode: true,
                expectJson: true,
                outputFormat: 'json',
                temperature: 0,
                max_tokens: 1400,
                timeoutMs: 60000
            });
            if (result?.ok === false) {
                throw new Error(result.error || result.message || 'memory query planner failed');
            }
            const parsed = llmTextCandidates(result)
                .map(parseJsonCandidate)
                .find((entry) => entry && typeof entry === 'object');
            const plan = normalizeQueryPlan(parsed, originalQuery);
            this.lastPlan = { ...plan, source: 'model' };
            return this.lastPlan;
        } catch (error) {
            const plan = normalizeQueryPlan(null, originalQuery);
            this.lastPlan = {
                ...plan,
                source: 'original_query_fallback',
                error: error?.message || String(error)
            };
            return this.lastPlan;
        }
    }

    async denseRank(documents, queries) {
        if (!documents.length) {
            return [];
        }
        const queryTexts = normalizeArray(queries).filter(Boolean);
        const [queryVectors, documentVectors] = await Promise.all([
            this.embeddingRuntime.embed(queryTexts.map((query) => `query: ${query}`)),
            this.embeddingRuntime.embed(documents.map((document) =>
                `passage: ${document.text}\n${normalizeArray(document.aliases).join(' ')}`
            ))
        ]);
        const scored = documents.map((document, index) => {
            const score = queryVectors.reduce((best, vector) =>
                Math.max(best, cosineSimilarity(vector, documentVectors[index] || [])),
            -1);
            return { document, score };
        }).sort((left, right) =>
            right.score - left.score ||
            String(right.document.time || '').localeCompare(String(left.document.time || ''))
        );
        return scored.map((entry, index) => ({ ...entry, rank: index + 1 }));
    }

    async rerank(query, fused, limit) {
        if (!this.reranker || !fused.length) {
            return fused.slice(0, limit);
        }
        try {
            const result = await this.reranker({
                query,
                documents: fused.slice(0, Math.max(limit * 4, 24)).map((entry) => ({
                    id: entry.document.id,
                    text: entry.document.text
                }))
            });
            const order = new Map(normalizeArray(result).map((entry, index) => [
                normalizeText(entry.id || entry.documentId),
                {
                    rank: index,
                    score: Number(entry.score) || 0
                }
            ]));
            return fused.slice().sort((left, right) => {
                const leftRank = order.get(left.document.id);
                const rightRank = order.get(right.document.id);
                if (leftRank && rightRank) {
                    return leftRank.rank - rightRank.rank;
                }
                if (leftRank) {
                    return -1;
                }
                if (rightRank) {
                    return 1;
                }
                return right.score - left.score;
            }).slice(0, limit);
        } catch {
            return fused.slice(0, limit);
        }
    }

    async hybridSearch(documents, plan, {
        limit = 10,
        channelWeights = [1, 1],
        questionTime = ''
    } = {}) {
        const lanes = new Set(plan.includeLanes || []);
        const filtered = documents.filter((document) =>
            (!lanes.size || lanes.has(document.lane) || document.kind === 'turn') &&
            inTimeRange(document, plan.timeRange) &&
            activeAtQuestion(document, questionTime, {
                latestStateOnly: plan.needsLatestState === true
            })
        );
        const sparseChannels = plan.searchQueries.map((query) => bm25Rank(filtered, query));
        const sparse = reciprocalRankFusion(
            sparseChannels,
            { weights: sparseChannels.map(() => 1) }
        ).map((entry, index) => ({
            document: entry.document,
            score: entry.score,
            rank: index + 1
        }));
        const dense = await this.denseRank(filtered, plan.searchQueries);
        const fused = reciprocalRankFusion(
            [sparse, dense],
            { weights: channelWeights }
        );
        return this.rerank(plan.searchQueries[0], fused, limit);
    }

    async hybridLedgerSearch(documents, plan, {
        limit = 10,
        questionTime = ''
    } = {}) {
        const targetActionTypes = new Set(plan.targetActionTypes || []);
        const targetStates = new Set(plan.targetStates || []);
        const targetRecordKinds = new Set(plan.targetRecordKinds || []);
        const eligible = documents.filter((document) =>
            inTimeRange(document, plan.timeRange) &&
            activeAtQuestion(document, questionTime, {
                latestStateOnly: plan.needsLatestState === true
            }) &&
            (
                document.kind !== 'ledger_record' ||
                (
                    (
                        !targetActionTypes.size ||
                        targetActionTypes.has(
                            normalizeText(document.structured?.actionType).toLowerCase()
                        )
                    ) &&
                    (
                        !targetStates.size ||
                        targetStates.has(
                            normalizeText(document.structured?.status).toLowerCase()
                        )
                    ) &&
                    (
                        !targetRecordKinds.size ||
                        targetRecordKinds.has(
                            normalizeText(document.structured?.kind).toLowerCase()
                        )
                    )
                )
            )
        );
        const sparsePerQuery = plan.searchQueries.map(
            (searchQuery) => bm25Rank(eligible, searchQuery)
        );
        const sparse = reciprocalRankFusion(sparsePerQuery, {
            weights: sparsePerQuery.map(() => 1),
            names: sparsePerQuery.map((_, index) => `query${index + 1}`)
        }).map((entry, index) => ({
            document: entry.document,
            score: entry.score,
            rank: index + 1
        }));
        const dense = await this.denseRank(eligible, plan.searchQueries);
        const temporal = temporalRank(eligible, plan, questionTime);
        const entity = entityRank(eligible, plan);
        const fused = reciprocalRankFusion(
            [sparse, dense, temporal, entity],
            {
                weights: [1, 1, 0.9, 1.05],
                names: ['bm25', 'multilingual_e5', 'temporal', 'entity']
            }
        ).slice(0, Math.max(1, Number(limit) || 10));
        return {
            fused,
            channels: {
                bm25: sparse,
                multilingual_e5: dense,
                temporal,
                entity
            }
        };
    }

    async search({
        query = '',
        events = [],
        limit = 10,
        strategy = this.strategy,
        questionTime = '',
        maxContextChars = 12000
    } = {}) {
        const resolved = resolveMemoryStrategy(strategy, this.strategy);
        const profile = MEMORY_STRATEGIES[resolved];
        const turns = rawTurnDocuments(events);
        const cognition = loadMemoryCognition(this.rootDir);
        const { unitDocuments, observationDocuments, mentalModelDocuments } =
            cognitionDocuments(cognition);
        const boundedLimit = Math.max(1, Math.min(Number(limit) || 10, 200));
        let selectedDocuments = [];
        let contextText = '';
        let plan = normalizeQueryPlan(null, normalizeText(query));

        if (profile.family === 'hybrid_full') {
            const result = await this.getFullRuntime(resolved).search({
                query,
                events,
                limit: boundedLimit,
                questionTime
            });
            this.lastDiagnostics = {
                strategy: resolved,
                family: profile.family,
                ...result.diagnostics
            };
            return {
                ...result,
                strategy: resolved,
                profile: { ...profile },
                query: normalizeText(query),
                diagnostics: this.lastDiagnostics
            };
        } else if (profile.family === 'chronos_full') {
            const result = await this.getFullRuntime(resolved).search({
                query,
                events,
                limit: boundedLimit,
                questionTime,
                maxContextChars
            });
            this.lastDiagnostics = {
                strategy: resolved,
                family: profile.family,
                ...result.diagnostics
            };
            return {
                ...result,
                strategy: resolved,
                profile: { ...profile },
                query: normalizeText(query),
                plan: result.guidance,
                diagnostics: this.lastDiagnostics
            };
        } else if (
            profile.family === 'mastra_observational_official' ||
            profile.family === 'mastra_observational_adapter'
        ) {
            const result = await this.getFullRuntime(resolved)
                .buildContext({ events, maxChars: maxContextChars });
            const selectedEvents = resolveSourceEvents(
                result.documents,
                events,
                Math.max(boundedLimit, 200)
            );
            this.lastDiagnostics = {
                strategy: resolved,
                family: profile.family,
                ...result.diagnostics
            };
            return {
                ok: true,
                strategy: resolved,
                profile: { ...profile },
                query: normalizeText(query),
                plan,
                documents: result.documents,
                events: selectedEvents,
                contextText: result.contextText,
                diagnostics: this.lastDiagnostics
            };
        } else if (profile.family === 'hindsight_official') {
            const result = await this.getFullRuntime(resolved).search({
                query,
                questionTime,
                maxTokens: Math.max(2_000, Math.ceil(maxContextChars / 4)),
                reflect: true
            });
            const selectedEvents = resolveSourceEvents(
                result.documents,
                events,
                boundedLimit
            );
            this.lastDiagnostics = {
                strategy: resolved,
                family: profile.family,
                ...result.diagnostics
            };
            return {
                ok: true,
                strategy: resolved,
                profile: { ...profile },
                query: normalizeText(query),
                plan,
                documents: result.documents,
                events: selectedEvents,
                contextText: result.contextText,
                recall: result.recall,
                reflection: result.reflection,
                diagnostics: this.lastDiagnostics
            };
        } else if (profile.family === 'hybrid_ledger') {
            plan = await this.planQuery(query, { questionTime });
            const ledgerState = this.eventActionLedger.loadStateSync();
            const derivedDocuments = ledgerDocuments(ledgerState.records);
            const combined = await this.hybridLedgerSearch(
                [...turns, ...derivedDocuments],
                plan,
                {
                    limit: Math.max(boundedLimit * 4, 32),
                    questionTime
                }
            );
            const ledgerOnly = await this.hybridLedgerSearch(
                derivedDocuments,
                plan,
                {
                    limit: Math.max(boundedLimit, 12),
                    questionTime
                }
            );
            const rawAnchorPlan = normalizeQueryPlan(null, normalizeText(query));
            const rawAnchors = await this.hybridSearch(turns, rawAnchorPlan, {
                limit: boundedLimit,
                questionTime
            });
            const selectedLedgerEntries = ledgerOnly.fused
                .filter((entry) => entry.document.kind === 'ledger_record')
                .slice(0, Math.max(4, Math.min(boundedLimit, 12)));
            const ledgerMetadataByEventId = new Map();
            for (const entry of selectedLedgerEntries) {
                const metadata = retrievalMetadata(entry);
                for (const source of normalizeArray(entry.document.sourceRefs)) {
                    const eventId = normalizeText(source?.eventId);
                    if (!eventId) {
                        continue;
                    }
                    ledgerMetadataByEventId.set(
                        eventId,
                        mergeRetrievalMetadata(
                            ledgerMetadataByEventId.get(eventId),
                            metadata
                        )
                    );
                }
            }
            const combinedRawEntries = combined.fused
                .filter((entry) => entry.document.kind === 'turn');
            const selectedRawById = new Map();
            for (const entry of [...rawAnchors, ...combinedRawEntries]) {
                if (!selectedRawById.has(entry.document.id)) {
                    selectedRawById.set(entry.document.id, {
                        ...entry,
                        document: {
                            ...entry.document,
                            retrieval: retrievalMetadata(entry)
                        }
                    });
                }
                if (selectedRawById.size >= Math.max(boundedLimit * 2, 16)) {
                    break;
                }
            }
            const sourceEventsForLedger = resolveSourceEvents(
                selectedLedgerEntries.map((entry) => entry.document),
                events,
                Math.max(boundedLimit * 2, 24)
            );
            const rawByEventId = new Map(
                turns.map((document) => [
                    normalizeText(document.rawEvent?.id),
                    document
                ])
            );
            for (const event of sourceEventsForLedger) {
                const sourceDocument = rawByEventId.get(normalizeText(event.id));
                if (
                    sourceDocument &&
                    !selectedRawById.has(sourceDocument.id)
                ) {
                    selectedRawById.set(sourceDocument.id, {
                        document: sourceDocument,
                        score: 0,
                        components: {}
                    });
                }
            }
            const selectedRawEntries = [...selectedRawById.values()];
            const annotatedLedgerDocuments = selectedLedgerEntries.map((entry) => ({
                ...entry.document,
                retrieval: retrievalMetadata(entry)
            }));
            selectedDocuments = [
                ...annotatedLedgerDocuments,
                ...selectedRawEntries.map((entry) => entry.document)
            ];
            const rawAnchorEvents = resolveSourceEvents(
                rawAnchors.map((entry) => entry.document),
                events,
                boundedLimit
            );
            const unionEvents = [];
            const seenEventIds = new Set();
            for (const event of [...rawAnchorEvents, ...sourceEventsForLedger]) {
                if (!event || seenEventIds.has(event.id)) {
                    continue;
                }
                seenEventIds.add(event.id);
                const matchingRawEntry = selectedRawEntries.find(
                    (entry) => entry.document.rawEvent?.id === event.id
                );
                const rawMetadata = matchingRawEntry
                    ? retrievalMetadata(matchingRawEntry)
                    : null;
                unionEvents.push({
                    ...event,
                    retrieval: mergeRetrievalMetadata(
                        rawMetadata,
                        ledgerMetadataByEventId.get(event.id)
                    )
                });
            }
            contextText = renderHybridLedgerContext({
                ledger: annotatedLedgerDocuments,
                rawDocuments: selectedRawEntries.map((entry) => entry.document),
                maxChars: maxContextChars
            });
            this.lastDiagnostics = {
                strategy: resolved,
                family: profile.family,
                queryPlanSource: plan.source || 'direct',
                rawTurnCount: turns.length,
                ledgerRecordCount: ledgerState.records.length,
                activeLedgerRecordCount: derivedDocuments.length,
                selectedLedgerRecordCount: annotatedLedgerDocuments.length,
                selectedRawTurnCount: selectedRawEntries.length,
                selectedEventCount: unionEvents.length,
                channels: Object.fromEntries(
                    Object.entries(combined.channels).map(([name, entries]) => [
                        name,
                        {
                            candidateCount: entries.length,
                            topDocumentIds: entries
                                .slice(0, boundedLimit)
                                .map((entry) => entry.document.id)
                        }
                    ])
                ),
                rawAnchorStrategy: 'hybrid_rrf_v1',
                rawAnchorCount: rawAnchors.length,
                embedding: this.embeddingRuntime.getStatus(),
                ledger: this.eventActionLedger.getStatus()
            };
            return {
                ok: true,
                strategy: resolved,
                profile: { ...profile },
                query: normalizeText(query),
                plan,
                documents: selectedDocuments,
                events: unionEvents,
                contextText,
                diagnostics: this.lastDiagnostics
            };
        } else if (profile.family === 'hybrid') {
            selectedDocuments = (await this.hybridSearch(turns, plan, {
                limit: boundedLimit,
                questionTime
            })).map((entry) => entry.document);
        } else if (profile.family === 'chronos') {
            plan = await this.planQuery(query, { questionTime });
            const temporalUnits = unitDocuments.filter((document) =>
                ['event', 'preference', 'world', 'experience'].includes(document.lane)
            );
            selectedDocuments = (await this.hybridSearch(
                [...turns, ...temporalUnits],
                plan,
                {
                    limit: boundedLimit,
                    channelWeights: [1, 1.15],
                    questionTime
                }
            )).map((entry) => entry.document);
            contextText = renderDocumentContext(selectedDocuments, {
                title: 'Chronos dual-calendar evidence',
                maxChars: maxContextChars
            });
        } else if (profile.family === 'observational') {
            const stableDocuments = [...mentalModelDocuments, ...observationDocuments]
                .filter((document) => activeAtQuestion(document, questionTime))
                .sort((left, right) =>
                    String(left.time || '').localeCompare(String(right.time || '')) ||
                    left.stableOrder - right.stableOrder
                );
            selectedDocuments = stableDocuments;
            contextText = renderDocumentContext(stableDocuments, {
                title: 'Stable observational memory',
                maxChars: maxContextChars
            });
        } else if (profile.family === 'hindsight') {
            plan = await this.planQuery(query, { questionTime });
            const hierarchy = [
                ...mentalModelDocuments,
                ...observationDocuments,
                ...unitDocuments,
                ...turns
            ];
            selectedDocuments = (await this.hybridSearch(hierarchy, plan, {
                limit: boundedLimit,
                channelWeights: [1, 1.2],
                questionTime
            })).map((entry) => entry.document);
            contextText = renderDocumentContext(selectedDocuments, {
                title: 'Hindsight cognitive evidence',
                maxChars: maxContextChars
            });
        } else {
            selectedDocuments = bm25Rank(turns, query)
                .slice(0, boundedLimit)
                .map((entry) => entry.document);
        }

        const sourceLimit = profile.stableContext
            ? Math.max(boundedLimit, 200)
            : boundedLimit;
        const selectedEvents = resolveSourceEvents(selectedDocuments, events, sourceLimit);
        this.lastDiagnostics = {
            strategy: resolved,
            family: profile.family,
            queryPlanSource: plan.source || 'direct',
            rawTurnCount: turns.length,
            cognitionUnitCount: unitDocuments.length,
            observationCount: observationDocuments.length,
            mentalModelCount: mentalModelDocuments.length,
            selectedDocumentCount: selectedDocuments.length,
            selectedEventCount: selectedEvents.length,
            embedding: this.embeddingRuntime.getStatus()
        };
        return {
            ok: true,
            strategy: resolved,
            profile: { ...profile },
            query: normalizeText(query),
            plan,
            documents: selectedDocuments,
            events: selectedEvents,
            contextText,
            diagnostics: this.lastDiagnostics
        };
    }

    searchSync({
        query = '',
        events = [],
        limit = 10,
        strategy = this.strategy,
        questionTime = '',
        maxContextChars = 12000
    } = {}) {
        const resolved = resolveMemoryStrategy(strategy, this.strategy);
        const profile = MEMORY_STRATEGIES[resolved];
        if ([
            'hybrid_ledger',
            'hybrid_full',
            'chronos_full',
            'mastra_observational_official',
            'mastra_observational_adapter',
            'hindsight_official'
        ].includes(profile.family)) {
            throw Object.assign(
                new Error(
                    `${resolved} requires the asynchronous full-fidelity memory path`
                ),
                { code: 'async_full_memory_required' }
            );
        }
        const turns = rawTurnDocuments(events);
        const cognition = loadMemoryCognition(this.rootDir);
        const { unitDocuments, observationDocuments, mentalModelDocuments } =
            cognitionDocuments(cognition);
        const boundedLimit = Math.max(1, Math.min(Number(limit) || 10, 200));
        let candidates = turns;
        if (profile.family === 'chronos') {
            candidates = [...turns, ...unitDocuments.filter((document) =>
                ['event', 'preference', 'world', 'experience'].includes(document.lane)
            )];
        } else if (profile.family === 'observational') {
            candidates = [...mentalModelDocuments, ...observationDocuments]
                .sort((left, right) =>
                    String(left.time || '').localeCompare(String(right.time || '')) ||
                    left.stableOrder - right.stableOrder
                );
        } else if (profile.family === 'hindsight') {
            candidates = [
                ...mentalModelDocuments,
                ...observationDocuments,
                ...unitDocuments,
                ...turns
            ];
        }
        candidates = candidates.filter((document) => activeAtQuestion(document, questionTime));
        const selectedDocuments = profile.stableContext
            ? candidates
            : bm25Rank(candidates, query).slice(0, boundedLimit).map((entry) => entry.document);
        const contextText = ['chronos', 'observational', 'hindsight'].includes(profile.family)
            ? renderDocumentContext(selectedDocuments, {
                title: `${profile.label} evidence`,
                maxChars: maxContextChars
            })
            : '';
        return {
            ok: true,
            strategy: resolved,
            profile: { ...profile },
            query: normalizeText(query),
            plan: normalizeQueryPlan(null, normalizeText(query)),
            documents: selectedDocuments,
            events: resolveSourceEvents(
                selectedDocuments,
                events,
                profile.stableContext ? Math.max(boundedLimit, 200) : boundedLimit
            ),
            contextText,
            diagnostics: {
                strategy: resolved,
                family: profile.family,
                mode: 'sync_sparse_fallback',
                rawTurnCount: turns.length,
                cognitionUnitCount: unitDocuments.length,
                observationCount: observationDocuments.length,
                mentalModelCount: mentalModelDocuments.length,
                selectedDocumentCount: selectedDocuments.length
            }
        };
    }
}

module.exports = {
    AILISMemoryStrategyEngine,
    DEFAULT_DENSE_MODEL,
    DEFAULT_DENSE_REVISION,
    MEMORY_COGNITION_FILE,
    MEMORY_COGNITION_VERSION,
    MEMORY_STRATEGIES,
    LocalEmbeddingRuntime,
    bm25Rank,
    cosineSimilarity,
    defaultCognitionState,
    loadMemoryCognition,
    ledgerDocuments,
    normalizeCognitionState,
    reciprocalRankFusion,
    resolveMemoryStrategy,
    strategyCatalog
};
