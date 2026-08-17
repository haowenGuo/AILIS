import { createReadStream } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';
import readline from 'node:readline';

const OFFICIAL_QUERY_TEMPLATE = `You are a deep research agent. You need to answer the given question by interacting with a search engine, using the search and get_document tools provided. Please perform reasoning and use the tools step by step, in an interleaved manner. You may use the search and get_document tools multiple times.

Question: {Question}
Your response should be in the following format:
Explanation: {your explanation for your final answer. For this explanation section only, you should cite your evidence documents inline by enclosing their docids in square brackets [] at the end of sentences. For example, [20].}
Exact Answer: {your succinct, final answer}
Confidence: {your confidence score between 0% and 100% for your answer}`;

const OFFICIAL_QUERY_TEMPLATE_SEARCH_ONLY = `You are a deep research agent. You need to answer the given question by interacting with a search engine, using the search tool provided. Please perform reasoning and use the tool step by step, in an interleaved manner. You may use the search tool multiple times.

Question: {Question}
Your response should be in the following format:
Explanation: {your explanation for your final answer. For this explanation section only, you should cite your evidence documents inline by enclosing their docids in square brackets [] at the end of sentences. For example, [20].}
Exact Answer: {your succinct, final answer}
Confidence: {your confidence score between 0% and 100% for your answer}`;

const ALLOWED_BENCHMARK_TOOLS = new Set([
    'tool_search',
    'update_plan',
    'mcp_bridge',
    'mcp__browsecomp_plus__search',
    'mcp__browsecomp_plus__get_document'
]);

function normalizeText(value, fallback = '') {
    if (typeof value === 'number' && Number.isFinite(value)) return String(value);
    if (typeof value !== 'string') return fallback;
    return value.trim() || fallback;
}

function safeFileSegment(value, fallback = 'query') {
    return normalizeText(value, fallback).replace(/[^A-Za-z0-9_.-]+/g, '_').slice(0, 180) || fallback;
}

function buildBrowseCompPrompt(question, { withGetDocument = true } = {}) {
    const template = withGetDocument ? OFFICIAL_QUERY_TEMPLATE : OFFICIAL_QUERY_TEMPLATE_SEARCH_ONLY;
    return template.replace('{Question}', normalizeText(question));
}

function normalizeDocId(value) {
    if (typeof value === 'number' && Number.isFinite(value)) return String(value);
    return normalizeText(value);
}

function collectDocIds(value, target = new Set(), seen = new Set()) {
    if (typeof value === 'string') {
        const parsed = parseJsonCandidate(value);
        if (parsed) collectDocIds(parsed, target, seen);
        return target;
    }
    if (!value || typeof value !== 'object' || seen.has(value)) return target;
    seen.add(value);
    if (Array.isArray(value)) {
        for (const item of value) collectDocIds(item, target, seen);
        return target;
    }
    for (const [key, item] of Object.entries(value)) {
        const normalizedKey = key.toLowerCase().replace(/[-_]/g, '');
        if (normalizedKey === 'docid' || normalizedKey === 'documentid') {
            const id = normalizeDocId(item);
            if (id) target.add(id);
        } else if (normalizedKey === 'docids' || normalizedKey === 'documentids') {
            for (const entry of Array.isArray(item) ? item : [item]) {
                const id = normalizeDocId(entry);
                if (id) target.add(id);
            }
        } else if (item !== null && (typeof item === 'object' || typeof item === 'string')) {
            collectDocIds(item, target, seen);
        }
    }
    return target;
}

function parseJsonCandidate(value) {
    if (value && typeof value === 'object') return value;
    const text = normalizeText(value);
    if (!text || (!text.startsWith('{') && !text.startsWith('['))) return null;
    try {
        return JSON.parse(text);
    } catch {
        return null;
    }
}

function canonicalToolName(value) {
    return normalizeText(value).toLowerCase();
}

function auditToolCalls(toolCalls = []) {
    const counts = {};
    const retrievedDocIds = new Set();
    const violations = [];
    const normalizedCalls = [];
    for (const rawCall of Array.isArray(toolCalls) ? toolCalls : []) {
        const tool = canonicalToolName(rawCall?.tool || rawCall?.toolName || rawCall?.name);
        if (!tool) continue;
        counts[tool] = (counts[tool] || 0) + 1;
        const parsedResult = parseJsonCandidate(rawCall?.result) ||
            parseJsonCandidate(rawCall?.resultPreview) ||
            parseJsonCandidate(rawCall?.outputPreview);
        if (tool === 'mcp__browsecomp_plus__search' || tool === 'mcp__browsecomp_plus__get_document') {
            collectDocIds(parsedResult || rawCall, retrievedDocIds);
        }
        if (!ALLOWED_BENCHMARK_TOOLS.has(tool)) {
            violations.push({
                callId: normalizeText(rawCall?.callId),
                tool,
                status: normalizeText(rawCall?.status)
            });
        }
        normalizedCalls.push({
            callId: normalizeText(rawCall?.callId),
            tool,
            args: rawCall?.args || null,
            status: normalizeText(rawCall?.status),
            ok: rawCall?.ok === true,
            durationMs: Number(rawCall?.durationMs) || 0,
            resultPreview: normalizeText(rawCall?.resultPreview || rawCall?.outputPreview)
        });
    }
    return {
        counts,
        retrievedDocIds: [...retrievedDocIds].sort((left, right) => left.localeCompare(right, 'en', { numeric: true })),
        violations,
        fixedCorpusValid: violations.length === 0,
        calls: normalizedCalls
    };
}

function extractTranscriptToolCalls(transcriptItems = []) {
    const calls = new Map();
    for (const item of Array.isArray(transcriptItems) ? transcriptItems : []) {
        if (!['tool.call', 'tool.result'].includes(item?.type)) continue;
        const payload = item.payload || {};
        const callId = normalizeText(payload.callId || item.id);
        if (!callId) continue;
        const existing = calls.get(callId) || {
            callId,
            tool: normalizeText(payload.toolName || payload.tool),
            args: null,
            result: null,
            status: '',
            ok: false,
            durationMs: 0
        };
        existing.tool = normalizeText(payload.toolName || payload.tool, existing.tool);
        if (item.type === 'tool.call') {
            existing.args = payload.args ?? existing.args;
        } else {
            existing.result = payload.result ?? payload.output ?? existing.result;
            existing.status = normalizeText(payload.status || item.status, existing.status);
            existing.ok = payload.ok === true;
            existing.durationMs = Number(payload.durationMs) || existing.durationMs;
            existing.resultPreview = normalizeText(payload.outputPreview);
        }
        calls.set(callId, existing);
    }
    return [...calls.values()];
}

function normalizeQueryRecord(record = {}, index = 0) {
    const queryId = normalizeText(record.query_id ?? record.queryId ?? record.id, String(index + 1));
    const query = normalizeText(record.query ?? record.question);
    if (!query) throw new Error(`BrowseComp-Plus query ${queryId} has no query text.`);
    // Formal runs do not need embedded evidence text. Qrels are prepared into
    // separate files; only compact explicit docid arrays are retained here.
    const evidenceDocIds = Array.isArray(record.evidence_docids)
        ? record.evidence_docids.map(normalizeDocId).filter(Boolean)
        : [];
    const goldDocIds = Array.isArray(record.gold_docids)
        ? record.gold_docids.map(normalizeDocId).filter(Boolean)
        : [];
    return {
        query_id: queryId,
        query,
        answer: normalizeText(record.answer),
        evidence_docids: evidenceDocIds,
        gold_docids: goldDocIds
    };
}

async function* iterateJsonl(filePath) {
    const input = createReadStream(filePath, { encoding: 'utf8' });
    const lines = readline.createInterface({ input, crlfDelay: Infinity });
    let index = 0;
    try {
        for await (const line of lines) {
            index += 1;
            if (!line.trim()) continue;
            try {
                yield JSON.parse(line);
            } catch (error) {
                throw new Error(`Invalid JSONL at ${path.resolve(filePath)}:${index}: ${error.message}`);
            }
        }
    } finally {
        lines.close();
        input.destroy();
    }
}

async function loadJsonl(filePath) {
    const records = [];
    for await (const record of iterateJsonl(filePath)) records.push(record);
    return records;
}

function selectDeterministicSample(records, sampleSize, sampleSeed = 'ailis-browsecomp-plus-sample-v1') {
    const size = Number(sampleSize);
    if (!Number.isInteger(size) || size <= 0) {
        throw new Error('BrowseComp-Plus sample size must be a positive integer.');
    }
    if (size > records.length) {
        throw new Error(`BrowseComp-Plus sample size ${size} exceeds dataset size ${records.length}.`);
    }
    const seed = normalizeText(sampleSeed, 'ailis-browsecomp-plus-sample-v1');
    const selectedIndexes = new Set(records
        .map((record, index) => ({
            index,
            queryId: record.query_id,
            rank: createHash('sha256').update(`${seed}\0${record.query_id}`).digest('hex')
        }))
        .sort((left, right) => left.rank.localeCompare(right.rank) || left.queryId.localeCompare(right.queryId))
        .slice(0, size)
        .map((item) => item.index));
    return records.filter((_, index) => selectedIndexes.has(index));
}

async function loadBrowseCompQueries(filePath, {
    offset = 0,
    limit = 0,
    queryIds = [],
    sampleSize = 0,
    sampleSeed = 'ailis-browsecomp-plus-sample-v1'
} = {}) {
    const wanted = new Set((Array.isArray(queryIds) ? queryIds : []).map(String));
    const normalizedOffset = Math.max(0, Number(offset) || 0);
    const normalizedLimit = Math.max(0, Number(limit) || 0);
    const normalizedSampleSize = Number(sampleSize) || 0;
    if (normalizedSampleSize && (wanted.size || normalizedOffset || normalizedLimit)) {
        throw new Error('BrowseComp-Plus deterministic sampling cannot be combined with query IDs, offset, or limit.');
    }
    const records = [];
    if (normalizedSampleSize) {
        for await (const rawRecord of iterateJsonl(filePath)) {
            records.push(normalizeQueryRecord(rawRecord, records.length));
        }
        return selectDeterministicSample(records, normalizedSampleSize, sampleSeed);
    }
    if (wanted.size) {
        for await (const rawRecord of iterateJsonl(filePath)) {
            const record = normalizeQueryRecord(rawRecord, records.length);
            if (wanted.has(record.query_id)) records.push(record);
        }
        const found = new Set(records.map((record) => record.query_id));
        const missing = [...wanted].filter((queryId) => !found.has(queryId));
        if (missing.length) throw new Error(`BrowseComp-Plus query IDs not found: ${missing.join(', ')}`);
        const sliced = records.slice(normalizedOffset);
        return normalizedLimit > 0 ? sliced.slice(0, normalizedLimit) : sliced;
    }
    let matched = 0;
    for await (const rawRecord of iterateJsonl(filePath)) {
        const record = normalizeQueryRecord(rawRecord, matched);
        if (matched < normalizedOffset) {
            matched += 1;
            continue;
        }
        records.push(record);
        matched += 1;
        if (normalizedLimit > 0 && records.length >= normalizedLimit) break;
    }
    return records;
}

function extractFinalResponse(response = {}) {
    const candidates = [
        response.taskRunHandoff?.finalAnswer,
        response.task_run_handoff?.final_answer,
        response.final_answer,
        response.finalAnswer
    ];
    return candidates.map((value) => normalizeText(value)).find(Boolean) || '';
}

function buildOfficialRunRecord({ query, responseText, response = {}, analysis = {}, model = '', reasoningEffort = '', retriever = '', withGetDocument = true } = {}) {
    const audit = auditToolCalls(analysis.toolCalls || []);
    const usage = analysis.summary?.usage || {};
    const completed = Boolean(responseText) && response?.ok !== false && audit.fixedCorpusValid;
    return {
        metadata: {
            model,
            reasoning_effort: reasoningEffort,
            retriever,
            query_template: withGetDocument ? 'QUERY_TEMPLATE' : 'QUERY_TEMPLATE_NO_GET_DOCUMENT',
            ailis_fixed_corpus_valid: audit.fixedCorpusValid,
            ailis_protocol: 'browsecomp_plus_fixed_corpus_v1'
        },
        query_id: query.query_id,
        tool_call_counts: {
            search: audit.counts.mcp__browsecomp_plus__search || 0,
            get_document: audit.counts.mcp__browsecomp_plus__get_document || 0
        },
        usage: {
            prompt_tokens: Number(usage.promptTokens) || 0,
            completion_tokens: Number(usage.completionTokens) || 0,
            total_tokens: Number(usage.totalTokens) || 0,
            reasoning_tokens: Number(usage.reasoningTokens) || 0,
            cached_tokens: Number(usage.cachedTokens) || 0
        },
        status: completed ? 'completed' : 'failed',
        retrieved_docids: audit.retrievedDocIds,
        result: responseText ? [{ type: 'output_text', output: responseText }] : [],
        ailis_audit: {
            fixed_corpus_valid: audit.fixedCorpusValid,
            violations: audit.violations,
            tool_calls: audit.calls,
            duration_ms: Number(analysis.summary?.durationMs) || null,
            rounds: Number(analysis.summary?.rounds) || 0,
            llm_calls: Number(analysis.summary?.llmCalls) || 0
        }
    };
}

export {
    ALLOWED_BENCHMARK_TOOLS,
    OFFICIAL_QUERY_TEMPLATE,
    OFFICIAL_QUERY_TEMPLATE_SEARCH_ONLY,
    auditToolCalls,
    buildBrowseCompPrompt,
    buildOfficialRunRecord,
    collectDocIds,
    extractTranscriptToolCalls,
    extractFinalResponse,
    iterateJsonl,
    loadBrowseCompQueries,
    loadJsonl,
    normalizeQueryRecord,
    normalizeText,
    safeFileSegment,
    selectDeterministicSample
};
