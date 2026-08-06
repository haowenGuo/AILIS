const RAGFLOW_LITE_VERSION = 1;

const RAGFLOW_CHUNK_FIELDS = Object.freeze([
    'id',
    'docnm_kwd',
    'doc_type_kwd',
    'chunk_type_kwd',
    'chunk_order_int',
    'page_num_int',
    'top_int',
    'position_int',
    'title_tks',
    'content_ltks',
    'content_sm_ltks',
    'important_kwd',
    'content_with_weight',
    'chunk_data'
]);

function normalizeString(value, fallback = '') {
    if (typeof value !== 'string') {
        return fallback;
    }
    const trimmed = value.trim();
    return trimmed || fallback;
}

function normalizeNumber(value, fallback, min, max) {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) {
        return fallback;
    }
    return Math.min(Math.max(Math.round(parsed), min), max);
}

function normalizeChunk(chunk = {}, index = 0, artifactId = '') {
    if (!chunk || typeof chunk !== 'object') {
        return null;
    }
    const content = normalizeString(chunk.content_with_weight || chunk.content || chunk.text);
    if (!content) {
        return null;
    }
    return {
        id: normalizeString(chunk.id, `ragflow-chunk-${index + 1}`),
        artifact_id: normalizeString(chunk.artifact_id || chunk.artifactId, artifactId),
        parser_id: normalizeString(chunk.parser_id || chunk.parserId || chunk.parser, ''),
        doc_type_kwd: normalizeString(chunk.doc_type_kwd || chunk.docType || chunk.kind, ''),
        docnm_kwd: normalizeString(chunk.docnm_kwd || chunk.docName || chunk.sourceName, ''),
        chunk_type_kwd: normalizeString(chunk.chunk_type_kwd || chunk.chunkType || chunk.type, 'ragflow_chunk'),
        chunk_order_int: Number.isFinite(Number(chunk.chunk_order_int)) ? Number(chunk.chunk_order_int) : index,
        page_num_int: Number.isFinite(Number(chunk.page_num_int)) ? Number(chunk.page_num_int) : 0,
        top_int: Number.isFinite(Number(chunk.top_int)) ? Number(chunk.top_int) : 0,
        position_int: Array.isArray(chunk.position_int || chunk.positions) ? (chunk.position_int || chunk.positions) : [],
        title_tks: normalizeString(chunk.title_tks || chunk.title || ''),
        content_with_weight: content,
        content_ltks: normalizeString(chunk.content_ltks || ''),
        content_sm_ltks: normalizeString(chunk.content_sm_ltks || ''),
        important_kwd: Array.isArray(chunk.important_kwd) ? chunk.important_kwd : [],
        chunk_data: chunk.chunk_data && typeof chunk.chunk_data === 'object' ? chunk.chunk_data : {}
    };
}

function extractProvidedRuntime(payload = {}) {
    if (!payload || typeof payload !== 'object') {
        return null;
    }
    return payload.ragflowLiteRuntime ||
        payload.ragflow_lite_runtime ||
        payload.ragflowRuntime ||
        payload.ragflow_runtime ||
        payload.artifactRuntime ||
        null;
}

function normalizeProvidedRuntime(runtime = {}, input = {}) {
    if (!runtime || typeof runtime !== 'object') {
        return null;
    }
    const artifactId = normalizeString(input.artifactId || runtime.artifactId || runtime.artifact_id);
    const rawChunks = Array.isArray(runtime.chunks) ? runtime.chunks : [];
    const chunks = rawChunks
        .map((chunk, index) => normalizeChunk(chunk, index, artifactId))
        .filter(Boolean);
    const parserType = normalizeString(runtime.parserType || runtime.parser_id || runtime.parser || input.parserType);
    return {
        version: Number(runtime.version || RAGFLOW_LITE_VERSION),
        runtime: 'ragflow_lite_bridge',
        source: normalizeString(runtime.source || runtime.generatedBy || runtime.generated_by, 'ragflow_extractor'),
        status: chunks.length ? 'ready' : normalizeString(runtime.status, 'empty'),
        parserType,
        kind: normalizeString(runtime.kind || input.kind),
        fields: Array.isArray(runtime.fields) && runtime.fields.length ? runtime.fields : [...RAGFLOW_CHUNK_FIELDS],
        chunks,
        indexes: runtime.indexes && typeof runtime.indexes === 'object' ? runtime.indexes : {},
        upstream: runtime.upstream && typeof runtime.upstream === 'object' ? runtime.upstream : {}
    };
}

function buildArtifactRuntimeEnvelope(input = {}) {
    const provided = normalizeProvidedRuntime(extractProvidedRuntime(input.payload || {}), input);
    const runtime = provided || {
        version: RAGFLOW_LITE_VERSION,
        runtime: 'ragflow_lite_bridge',
        source: 'pending_ragflow_extractor',
        status: 'awaiting_ragflow_extraction',
        parserType: normalizeString(input.parserType),
        kind: normalizeString(input.kind),
        fields: [...RAGFLOW_CHUNK_FIELDS],
        chunks: [],
        indexes: {},
        upstream: {
            note: 'AILIS did not synthesize chunks. Attach chunks from the extracted RAGFlow-lite layer.'
        }
    };
    const modelSummary = [
        'ARTIFACT_RUNTIME_BRIDGE_READY',
        'runtime=ragflow_lite_bridge',
        `status=${runtime.status}`,
        `source=${runtime.source}`,
        `parserType=${runtime.parserType || '(pending)'}`,
        `artifactKind=${runtime.kind || input.kind || '(unknown)'}`,
        `chunks=${runtime.chunks.length}`,
        'queryWith=artifact_query actions runtime_schema/chunk_search after RAGFlow-lite extraction',
        'boundary=AILIS stores/contextualizes extracted RAGFlow artifact output; it does not replace RAGFlow chunkers'
    ].join('\n');
    return {
        payload: runtime,
        metadata: {
            version: runtime.version,
            runtime: runtime.runtime,
            source: runtime.source,
            status: runtime.status,
            parserType: runtime.parserType,
            chunkCount: runtime.chunks.length,
            fields: runtime.fields,
            upstream: runtime.upstream
        },
        modelView: {
            runtime: runtime.runtime,
            source: runtime.source,
            status: runtime.status,
            parserType: runtime.parserType,
            chunkCount: runtime.chunks.length,
            summary: modelSummary
        },
        queryHints: ['runtime_schema', 'chunk_search', 'runtime_search']
    };
}

function getRuntimeIndex(payload = {}, record = {}) {
    const provided = normalizeProvidedRuntime(extractProvidedRuntime(payload), {
        artifactId: record.id,
        kind: record.kind
    });
    return provided || buildArtifactRuntimeEnvelope({
        artifactId: record.id || '',
        kind: record.kind || '',
        type: record.type || '',
        sourcePath: record.sourcePath || '',
        summary: record.summary || '',
        payload
    }).payload;
}

function buildArtifactRuntimeSchema(record = {}, payload = {}) {
    const runtime = getRuntimeIndex(payload, record);
    return {
        artifactId: record.id,
        runtime: runtime.runtime,
        source: runtime.source,
        status: runtime.status,
        version: runtime.version,
        parserType: runtime.parserType,
        kind: runtime.kind || record.kind,
        chunkCount: runtime.chunks?.length || 0,
        fields: runtime.fields || [...RAGFLOW_CHUNK_FIELDS],
        indexes: runtime.indexes || {},
        actions: ['runtime_schema', 'chunk_search', 'runtime_search'],
        boundary: {
            ailIsRole: 'context bridge, storage, tool exposure',
            ragflowRole: 'artifact parsing, chunking, indexing semantics',
            note: 'If chunkCount is zero, the RAGFlow-lite extractor has not produced artifact chunks yet.'
        }
    };
}

function chunkMatches(chunk = {}, query = '') {
    const normalized = normalizeString(query).toLowerCase();
    if (!normalized) {
        return true;
    }
    const haystack = [
        chunk.id,
        chunk.docnm_kwd,
        chunk.chunk_type_kwd,
        chunk.title_tks,
        chunk.content_with_weight,
        JSON.stringify(chunk.position_int || []),
        JSON.stringify(chunk.chunk_data || {})
    ].join('\n').toLowerCase();
    return haystack.includes(normalized);
}

function searchArtifactRuntime(payload = {}, args = {}, record = {}) {
    const runtime = getRuntimeIndex(payload, record);
    const query = normalizeString(args.query || args.q || args.text || args.pattern);
    const limit = normalizeNumber(args.limit || args.topk || args.maxResults || args.max_results, 8, 1, 50);
    const sheet = normalizeString(args.sheet || args.sheetName || args.sheet_name || args.worksheet).toLowerCase();
    const chunks = runtime.chunks || [];
    const matches = [];
    for (const chunk of chunks) {
        if (sheet && normalizeString(chunk.chunk_data?.sheet || chunk.chunk_data?.sheetName).toLowerCase() !== sheet) {
            continue;
        }
        if (!chunkMatches(chunk, query)) {
            continue;
        }
        matches.push({
            id: chunk.id,
            title: chunk.title_tks || chunk.chunk_type_kwd,
            chunkType: chunk.chunk_type_kwd,
            order: chunk.chunk_order_int,
            docName: chunk.docnm_kwd,
            positions: chunk.position_int || [],
            content: chunk.content_with_weight,
            metadata: chunk.chunk_data || {}
        });
    }
    matches.sort((left, right) => Number(left.order || 0) - Number(right.order || 0));
    return {
        runtime: runtime.runtime,
        source: runtime.source,
        status: runtime.status,
        parserType: runtime.parserType,
        query,
        total: matches.length,
        matches: matches.slice(0, limit),
        truncated: matches.length > limit,
        fields: runtime.fields || [...RAGFLOW_CHUNK_FIELDS],
        extractionReady: runtime.status === 'ready'
    };
}

function truncateForObservation(text = '', maxChars = 1800) {
    const source = String(text || '');
    if (source.length <= maxChars) {
        return source;
    }
    return `${source.slice(0, maxChars - 42)}\n... [chunk observation truncated]`;
}

function formatArtifactRuntimeSearch(record = {}, result = {}) {
    const lines = [
        'ARTIFACT_CHUNK_SEARCH',
        `artifactId=${record.id || ''}`,
        `runtime=${result.runtime || 'ragflow_lite_bridge'} source=${result.source || ''} status=${result.status || ''} parserType=${result.parserType || ''}`,
        `query=${JSON.stringify(result.query || '')}`,
        `matches=${result.matches?.length || 0}/${result.total || 0} truncated=${result.truncated === true}`,
        'fields=content_with_weight, position_int, chunk_order_int, chunk_data'
    ];
    if (!result.extractionReady) {
        lines.push('ragflow_extraction_ready=false; AILIS has not received chunks from the extracted RAGFlow-lite layer yet.');
    }
    for (const match of result.matches || []) {
        lines.push(`--- chunk ${match.id} order=${match.order} type=${match.chunkType}`);
        if (match.positions?.length) {
            lines.push(`position_int=${JSON.stringify(match.positions)}`);
        }
        lines.push(truncateForObservation(match.content || ''));
    }
    lines.push('observation_contract=complete:true truncated:false reasoning_ready:true');
    return lines.join('\n');
}

module.exports = {
    RAGFLOW_LITE_VERSION,
    RAGFLOW_CHUNK_FIELDS,
    buildArtifactRuntimeEnvelope,
    buildArtifactRuntimeSchema,
    searchArtifactRuntime,
    formatArtifactRuntimeSearch
};
