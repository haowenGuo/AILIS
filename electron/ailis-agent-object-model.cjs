'use strict';

const { summarizeForModel } = require('./ailis-runtime-budget.cjs');
const {
    ContentItem,
    FunctionCallOutputPayload,
    ResponseItem,
    normalizeText,
    safeJsonStringify
} = require('./ailis-response-model.cjs');
const {
    RUNTIME_LAYER,
    normalizeRuntimeEvent
} = require('./ailis-agent-runtime-protocol.cjs');

const DEFAULT_TOOL_OUTPUT_CHARS = 24000;
const DEFAULT_THREAD_ITEM_PREVIEW_CHARS = 1200;
const TOOL_SEARCH_OUTPUT_DESCRIPTION_CHARS = 220;
const TOOL_SEARCH_OUTPUT_PROPERTIES_LIMIT = 32;

function cloneJson(value) {
    if (value == null || typeof value !== 'object') {
        return value;
    }
    return JSON.parse(JSON.stringify(value));
}

function extractText(value) {
    if (value == null) {
        return '';
    }
    if (typeof value === 'string') {
        return value;
    }
    if (typeof value.text === 'string') {
        return value.text;
    }
    if (typeof value.content === 'string') {
        return value.content;
    }
    if (Array.isArray(value.content)) {
        const text = value.content
            .map((part) => (typeof part?.text === 'string' ? part.text : ''))
            .filter(Boolean)
            .join('\n');
        if (text.trim()) {
            return text;
        }
    }
    if (typeof value.stdout === 'string') {
        return value.stdout;
    }
    if (typeof value.preview === 'string') {
        return value.preview;
    }
    return safeJsonStringify(value, '');
}

function mergeObjects(...values) {
    return values
        .filter((value) => value && typeof value === 'object' && !Array.isArray(value))
        .reduce((merged, value) => ({ ...merged, ...cloneJson(value) }), {});
}

function canonicalCallId(input = {}, index = 0) {
    return normalizeText(
        input.callId ||
            input.call_id ||
            input.nativeToolCall?.call_id ||
            input.nativeToolCall?.id ||
            input.id ||
            `call_${index + 1}`
    ).replace(/[^A-Za-z0-9_-]/g, '_');
}

function normalizeProviderMetadata(input = {}) {
    const providerMetadata =
        input.providerMetadata ||
        input.provider_metadata ||
        input.nativeToolCall?.providerMetadata ||
        input.nativeToolCall?.provider_metadata ||
        null;
    return providerMetadata && typeof providerMetadata === 'object' && !Array.isArray(providerMetadata)
        ? cloneJson(providerMetadata)
        : null;
}

const WEB_MODEL_ADJUDICATION_KEYS = new Set([
    'complete',
    'outputComplete',
    'output_complete',
    'outputTruncatedForModel',
    'output_truncated_for_model',
    'sourceRetrievalComplete',
    'source_retrieval_complete',
    'sourceWindowCoversTask',
    'source_window_covers_task',
    'observationContract',
    'observation_contract',
    'readiness',
    'reasoningReady',
    'reasoning_ready',
    'modelJudgesEvidence',
    'model_judges_evidence',
    'isEvidence',
    'is_evidence',
    'answerReadiness',
    'answer_readiness',
    'retrievalReadiness',
    'retrieval_readiness',
    'readinessAuthority',
    'readiness_authority',
    'evidenceDecision',
    'evidence_decision',
    'requiresEvidenceAudit',
    'requires_evidence_audit',
    'evidenceGap',
    'evidence_gap',
    'evidenceQuality',
    'evidence_quality',
    'evidenceScore',
    'evidence_score',
    'evidenceScoreBreakdown',
    'evidence_score_breakdown',
    'contentQuality',
    'content_quality',
    'recoveryHint',
    'recovery_hint',
    'suggestedNextCalls',
    'suggested_next_calls',
    'outputPolicy',
    'output_policy',
    'retrievalNote',
    'retrieval_note',
    'pageType',
    'page_type',
    'pageStatus',
    'page_status'
]);

const WEB_MODEL_ADJUDICATION_LINE = /^\s*(?:complete|output[_ ]?(?:complete|truncated[_ ]?for[_ ]?model|policy)|source[_ ]?retrieval[_ ]?complete|source[_ ]?window[_ ]?covers[_ ]?task|observation[_ ]?contract|reasoning[_ ]?ready|model[_ ]?judges[_ ]?evidence|is[_ ]?evidence|(?:answer|retrieval)?[_ ]?readiness|readiness[_ ]?authority|evidence[_ ]?(?:decision|gap|quality|score)|content[_ ]?quality|requires[_ ]?evidence[_ ]?audit|recovery[_ ]?hint|retrieval[_ ]?note|suggested[_ ]?next[_ ]?calls|page[_ ]?(?:type|status))\s*[:=]/i;

function isWebToolName(toolName = '') {
    const normalized = normalizeText(toolName).toLowerCase();
    return /(?:^|__|:|\.)(web_run|web_search|web_fetch|web_research|web_extract_links|open_page|find_in_page)$/.test(normalized) ||
        ['web_run', 'web_search', 'web_fetch', 'web_research', 'web_extract_links', 'open_page', 'find_in_page'].includes(normalized);
}

function sanitizeWebToolDetailsForModel(value, depth = 0) {
    if (depth > 8 || value === null || value === undefined) {
        return value;
    }
    if (Array.isArray(value)) {
        return value.map((item) => sanitizeWebToolDetailsForModel(item, depth + 1));
    }
    if (typeof value !== 'object') {
        return value;
    }
    return Object.fromEntries(Object.entries(value)
        .filter(([key]) => !WEB_MODEL_ADJUDICATION_KEYS.has(key))
        .map(([key, item]) => [key, sanitizeWebToolDetailsForModel(item, depth + 1)]));
}

function sanitizeWebToolTextForModel(value = '') {
    const text = normalizeText(value);
    if (!text) {
        return '';
    }
    if ((text.startsWith('{') && text.endsWith('}')) || (text.startsWith('[') && text.endsWith(']'))) {
        try {
            return safeJsonStringify(sanitizeWebToolDetailsForModel(JSON.parse(text)), text);
        } catch {
            // Fall through to the line-oriented representation used by MCP text output.
        }
    }
    return text
        .split(/\r?\n/)
        .filter((line) => !WEB_MODEL_ADJUDICATION_LINE.test(line))
        .join('\n')
        .trim();
}

function normalizeToolOutput(input = {}, index = 0, options = {}) {
    const response = input.response || input.result || {};
    const result = response.result ?? input.output ?? response.output ?? null;
    const details = mergeObjects(
        response.result?.structuredContent,
        response.result?.details,
        response.structuredContent,
        response.structured_content,
        response.details
    );
    const ok = response.ok === true || input.ok === true;
    const errorSummary = normalizeText(
        response.error ||
            input.error ||
            details.errorSummary ||
            details.error ||
            ''
    );
    const toolName = normalizeText(input.tool || input.name || input.nativeToolCall?.name);
    const rawText = extractText(result) || errorSummary || extractText(response);
    const outputText = isWebToolName(toolName)
        ? sanitizeWebToolTextForModel(rawText)
        : rawText;
    const modelDetails = isWebToolName(toolName)
        ? sanitizeWebToolDetailsForModel(details || {})
        : cloneJson(details || {});
    const startedAt = Number(input.startedAt ?? input.started_at ?? 0) || null;
    const finishedAt = Number(input.finishedAt ?? input.finished_at ?? 0) || null;
    const durationMs = Number(
        input.durationMs ??
            input.duration_ms ??
            response.durationMs ??
            response.duration_ms ??
            details.durationMs ??
            details.duration_ms
    );

    return {
        schema: 'ailis.tool_output.v1',
        callId: canonicalCallId(input, index),
        sourceId: input.id || null,
        toolName,
        title: normalizeText(input.title || input.tool || input.name || 'tool'),
        args: cloneJson(input.modelArgs || input.args || input.nativeToolCall?.arguments || {}),
        status: normalizeText(response.status || input.status || (ok ? 'completed' : 'failed')),
        ok,
        outputText,
        outputPreview: summarizeForModel(outputText, options.previewChars || DEFAULT_THREAD_ITEM_PREVIEW_CHARS),
        errorSummary,
        evidenceRefs: Array.isArray(input.evidenceRefs) ? input.evidenceRefs.slice() : [],
        evidenceArtifacts: Array.isArray(input.evidenceArtifacts) ? cloneJson(input.evidenceArtifacts) : [],
        providerMetadata: normalizeProviderMetadata(input),
        details: modelDetails,
        startedAt,
        finishedAt,
        durationMs: Number.isFinite(durationMs) ? durationMs : null,
        original: options.keepOriginal === true ? cloneJson(input) : undefined
    };
}

function normalizeOutputStoreDetails(details = {}) {
    const outputStore = details && typeof details.outputStore === 'object' ? details.outputStore : {};
    const outputId = normalizeText(details.outputId || outputStore.outputId);
    if (!outputId) {
        return null;
    }
    const bytes = details.outputBytes ?? outputStore.bytes ?? outputStore.combinedBytes ?? null;
    const lineCount = details.outputLineCount ?? outputStore.lineCount ?? null;
    const previewTruncated = details.outputPreviewTruncated === true || outputStore.previewTruncated === true;
    return {
        outputId,
        bytes: Number.isFinite(Number(bytes)) ? Number(bytes) : null,
        lineCount: Number.isFinite(Number(lineCount)) ? Number(lineCount) : null,
        previewTruncated
    };
}

function buildModelVisibleToolMetadata(toolOutput = {}) {
    const outputStore = normalizeOutputStoreDetails(toolOutput.details || {});
    if (!outputStore) {
        return [];
    }
    const readArgs = { outputId: outputStore.outputId };
    const tailArgs = { outputId: outputStore.outputId };
    const searchArgs = { outputId: outputStore.outputId, query: '<text>' };
    return [
        [
            `OutputArtifact: outputId=${outputStore.outputId}`,
            outputStore.bytes != null ? `bytes=${outputStore.bytes}` : '',
            outputStore.lineCount != null ? `lines=${outputStore.lineCount}` : '',
            `previewTruncated=${outputStore.previewTruncated ? 'true' : 'false'}`
        ].filter(Boolean).join(' '),
        outputStore.previewTruncated
            ? `OutputArtifactTools: output_read ${safeJsonStringify(readArgs, '{}')} | output_tail ${safeJsonStringify(tailArgs, '{}')} | output_search ${safeJsonStringify(searchArgs, '{}')}`
            : '',
        outputStore.previewTruncated
            ? 'OutputArtifactHint: full stdout/stderr is stored by outputId; inspect only the needed slice instead of rerunning the same command to recover truncated text.'
            : ''
    ].filter(Boolean);
}

function firstObject(...values) {
    return values.find((value) => value && typeof value === 'object' && !Array.isArray(value)) || {};
}

function toolResultDetailViews(toolOutput = {}) {
    const queue = [firstObject(toolOutput.details)];
    const views = [];
    const seen = new Set();
    while (queue.length && views.length < 16) {
        const view = queue.shift();
        if (!view || typeof view !== 'object' || Array.isArray(view) || seen.has(view)) {
            continue;
        }
        seen.add(view);
        views.push(view);
        for (const key of ['structuredContent', 'structured_content', 'details', 'result']) {
            const nested = view[key];
            if (nested && typeof nested === 'object' && !Array.isArray(nested)) {
                queue.push(nested);
            }
        }
    }
    return views;
}

function normalizeStringList(values = [], limit = TOOL_SEARCH_OUTPUT_PROPERTIES_LIMIT) {
    return (Array.isArray(values) ? values : [])
        .map((entry) => {
            if (entry && typeof entry === 'object' && !Array.isArray(entry)) {
                return normalizeText(entry.name || entry.id || entry.key || entry.property || entry.path);
            }
            return normalizeText(entry);
        })
        .filter((entry) => entry !== '[object Object]')
        .filter(Boolean)
        .slice(0, limit);
}

function schemaForToolSearchResult(tool = {}) {
    return firstObject(
        tool.input_schema,
        tool.inputSchema,
        tool.parameters,
        tool.schema,
        tool.spec?.parameters,
        tool.function?.parameters,
        tool.modelFacing?.parameters,
        tool.model_facing?.parameters,
        tool.contract?.schema,
        tool.contract?.inputSchema,
        tool.contract?.input_schema
    );
}

function compactToolSearchResultForHistory(tool = {}) {
    const schema = schemaForToolSearchResult(tool);
    const id = normalizeText(tool.id || tool.name || tool.spec?.name || tool.function?.name);
    const name = normalizeText(tool.name || tool.spec?.name || tool.function?.name || id);
    const properties = normalizeStringList(
        Array.isArray(tool.schema_properties)
            ? tool.schema_properties
            : Object.keys(firstObject(schema.properties))
                .filter((property) => property && property !== '[object Object]')
    );
    return {
        id,
        name,
        server: normalizeText(tool.server || tool.provider || tool.namespace),
        tool: normalizeText(tool.tool || tool.callable_name || name),
        description: summarizeForModel(
            normalizeText(
                tool.description ||
                    tool.spec?.description ||
                    tool.modelFacing?.description ||
                    tool.model_facing?.description ||
                    tool.contract?.purpose ||
                    tool.contract?.description ||
                    tool.summary ||
                    tool.title ||
                    name
            ),
            TOOL_SEARCH_OUTPUT_DESCRIPTION_CHARS
        ),
        required: normalizeStringList(schema.required),
        properties,
        spec_ref: normalizeText(tool.spec_ref || tool.specRef || (id ? `tool_registry:${id}` : 'tool_registry:unknown'))
    };
}

function webSearchOutputFromToolOutput(toolOutput = {}) {
    const candidates = toolResultDetailViews(toolOutput).flatMap((details) => [
        details.webSearchOutput,
        details.web_search_output,
        details
    ]);
    return candidates.find((candidate) => {
        const value = firstObject(candidate);
        return normalizeText(value.webSearchCall?.type || value.web_search_call?.type) === 'web_search_call' ||
            normalizeText(value.type) === 'web_search_call';
    }) || null;
}

function normalizeWebSearchCall(webSearchOutput = {}, callId = '') {
    const sourceCall = firstObject(
        webSearchOutput.webSearchCall,
        webSearchOutput.web_search_call,
        normalizeText(webSearchOutput.type) === 'web_search_call' ? webSearchOutput : null
    );
    const action = firstObject(sourceCall.action, webSearchOutput.action);
    return ResponseItem.webSearchCall({
        id: sourceCall.id || (callId ? `${callId}_web_search` : null),
        status: sourceCall.status || webSearchOutput.status || 'completed',
        action
    });
}

function formatWebRunOpenPage({ refId = '', url = '', lineno = 1 } = {}) {
    const target = normalizeText(refId || url);
    if (!target) {
        return '';
    }
    return `Open page: web_run ${safeJsonStringify({
        open: [{ ref_id: target, lineno: Number(lineno || 1) || 1 }]
    }, '{}')}`;
}

function formatWebSearchCandidates(webSearchOutput = {}, toolName = '') {
    const candidates = Array.isArray(webSearchOutput.search?.results)
        ? webSearchOutput.search.results
        : Array.isArray(webSearchOutput.search?.candidates)
        ? webSearchOutput.search.candidates
        : [];
    if (!candidates.length) {
        return '';
    }
    const lines = ['Search results:'];
    candidates.slice(0, 8).forEach((candidate, index) => {
        const refId = normalizeText(candidate.ref_id || candidate.refId || candidate.id || `candidate_${index + 1}`);
        lines.push(`${index + 1}. [${refId}] ${candidate.title || candidate.url || '(untitled)'}`);
        if (candidate.url) {
            lines.push(`   URL: ${candidate.url}`);
            lines.push(`   ${toolName === 'web_run'
                ? formatWebRunOpenPage({ refId, url: candidate.url })
                : `Open page: web_fetch ${safeJsonStringify({ url: candidate.url, lineno: 1 }, '{}')}`}`);
        }
        if (candidate.snippet) {
            lines.push(`   Snippet: ${candidate.snippet}`);
        }
    });
    return lines.join('\n');
}

function formatWebSearchSources(webSearchOutput = {}, toolName = '') {
    const sources = Array.isArray(webSearchOutput.fetch?.sources)
        ? webSearchOutput.fetch.sources
        : [];
    if (!sources.length) {
        return '';
    }
    const lines = ['Sources:'];
    sources.slice(0, 8).forEach((source, index) => {
        const refId = normalizeText(source.ref_id || source.refId || source.id || `source_${index + 1}`);
        lines.push(`[${refId}] ${source.title || source.url || '(untitled)'}`);
        if (source.url) {
            lines.push(`URL: ${source.url}`);
            const openPage = firstObject(source.open_page, source.openPage);
            lines.push(toolName === 'web_run'
                ? formatWebRunOpenPage({
                    refId,
                    url: normalizeText(openPage.url || source.url),
                    lineno: Number(openPage.lineno || 1) || 1
                })
                : `Open page: web_fetch ${safeJsonStringify({
                    url: normalizeText(openPage.url || source.url),
                    lineno: Number(openPage.lineno || 1) || 1
                }, '{}')}`);
        }
        const meta = [
            source.host ? `host=${source.host}` : '',
            source.status ? `status=${source.status}` : ''
        ].filter(Boolean).join('; ');
        if (meta) {
            lines.push(meta);
        }
        const excerpt = normalizeText(source.excerpt || source.fetched_excerpt || source.fetchedExcerpt);
        if (excerpt) {
            lines.push('Fetched excerpt:');
            lines.push(summarizeForModel(excerpt, 2400));
        } else if (Array.isArray(source.evidenceSnippets) && source.evidenceSnippets.length) {
            lines.push('Evidence snippets:');
            source.evidenceSnippets.slice(0, 3).forEach((snippet) => lines.push(`- ${snippet}`));
        } else if (source.searchSnippet) {
            lines.push(`Search snippet: ${source.searchSnippet}`);
        }
    });
    return lines.join('\n');
}

function formatWebSearchDiagnostics(webSearchOutput = {}) {
    const execution = firstObject(webSearchOutput.execution);
    const diagnostics = firstObject(webSearchOutput.retrievalDiagnostics, webSearchOutput.retrieval_diagnostics);
    const lines = ['Retrieval diagnostics:'];
    if (execution.mode) {
        lines.push(`mode=${execution.mode}`);
    }
    if (execution.durationMs != null) {
        lines.push(`duration_ms=${execution.durationMs}`);
    }
    if (diagnostics.fetchedPageCount != null) {
        lines.push(`fetched_page_count=${diagnostics.fetchedPageCount}`);
    }
    if (diagnostics.blockedPageCount != null) {
        lines.push(`blocked_page_count=${diagnostics.blockedPageCount}`);
    }
    const pipeline = Array.isArray(execution.pipeline) ? execution.pipeline : [];
    if (pipeline.length) {
        lines.push('Pipeline:');
        pipeline.slice(0, 10).forEach((step) => {
            lines.push(`- ${step.stage || 'step'}: ${step.status || 'unknown'}${step.note ? `; ${step.note}` : ''}`);
        });
    }
    return lines.length > 1 ? lines.join('\n') : '';
}

function buildWebSearchFunctionOutput(toolOutput = {}, webSearchOutput = {}) {
    const contentItems = [
        ContentItem.inputText([
            'Web search completed.',
            `Tool: ${toolOutput.toolName}`,
            toolOutput.durationMs != null ? `duration_ms=${toolOutput.durationMs}` : ''
        ].filter(Boolean).join('\n')),
        ContentItem.inputText(formatWebSearchCandidates(webSearchOutput, toolOutput.toolName)),
        ContentItem.inputText(formatWebSearchSources(webSearchOutput, toolOutput.toolName)),
        ContentItem.inputText(formatWebSearchDiagnostics(webSearchOutput))
    ].filter(Boolean);
    if (!contentItems.length) {
        contentItems.push(ContentItem.inputText('Web search completed. Structured results are available in the preceding web_search_call item.'));
    }
    return FunctionCallOutputPayload.fromContentItems(contentItems, {
        success: toolOutput.ok === true ? true : toolOutput.ok === false ? false : null
    });
}

function formatSourceViewportLinks(toolOutput = {}, details = {}) {
    if (normalizeText(toolOutput.toolName) !== 'web_run') {
        return '';
    }
    const links = Array.isArray(details.observedRelevantLinks)
        ? details.observedRelevantLinks
        : Array.isArray(details.observed_relevant_links)
        ? details.observed_relevant_links
        : [];
    if (!links.length) {
        return '';
    }
    const lines = ['Links:'];
    links.slice(0, 8).forEach((link, index) => {
        const url = normalizeText(link.url);
        if (!url) {
            return;
        }
        lines.push(`${index + 1}. ${link.text || link.title || url}`);
        lines.push(`   URL: ${url}`);
        lines.push(`   ${formatWebRunOpenPage({ url })}`);
    });
    return lines.length > 1 ? lines.join('\n') : '';
}

function sourceViewportFromToolOutput(toolOutput = {}) {
    for (const details of toolResultDetailViews(toolOutput)) {
        const sourceWindow = firstObject(
            details.sourceWindow,
            details.source_window,
            details.sourceViewport,
            details.source_viewport,
            details.source
        );
        if (normalizeText(sourceWindow.type) !== 'source_viewport') {
            continue;
        }
        const toolName = normalizeText(toolOutput.toolName);
        const action = firstObject(sourceWindow.action);
        const actionType = normalizeText(action.type);
        const normalizedActionType = actionType === 'find_in_page'
            ? 'find_in_page'
            : actionType === 'open_page'
            ? 'open_page'
            : /(?:^|__)web_find$/.test(toolName)
            ? 'find_in_page'
            : 'open_page';
        const url = normalizeText(sourceWindow.url || sourceWindow.ref_id || details.url);
        const lineStart = Number(
            sourceWindow.lineno ||
                sourceWindow.lineStart ||
                sourceWindow.line_start ||
                details.lineno ||
                details.lineStart ||
                details.line_start ||
                1
        ) || 1;
        return {
            sourceWindow,
            action: normalizedActionType === 'find_in_page'
                ? {
                    type: 'find_in_page',
                    ...(url ? { url } : {}),
                    ...(normalizeText(action.pattern || details.pattern)
                        ? { pattern: normalizeText(action.pattern || details.pattern) }
                        : {})
                }
                : {
                    type: 'open_page',
                    ...(url ? { url } : {}),
                    lineno: lineStart
                },
            details
        };
    }
    return null;
}

function normalizeSourceViewportWebSearchCall(sourceViewport = {}, callId = '') {
    const action = firstObject(sourceViewport.action);
    return ResponseItem.webSearchCall({
        id: callId ? `${callId}_${action.type || 'open_page'}` : null,
        status: 'completed',
        action
    });
}

function formatSourceViewportLines(sourceWindow = {}) {
    const lines = Array.isArray(sourceWindow.lines) ? sourceWindow.lines : [];
    const rendered = lines
        .map((line) => normalizeText(line.rendered) || `L${Number(line.lineno || line.lineNumber || line.line_number || 0)}: ${line.text || ''}`)
        .filter(Boolean)
        .join('\n');
    const lineStart = Number(sourceWindow.lineStart || sourceWindow.line_start || sourceWindow.lineno || 1) || 1;
    const lineEnd = Number(sourceWindow.lineEnd || sourceWindow.line_end || lineStart) || lineStart;
    return [
        'Source viewport:',
        `URL: ${sourceWindow.url || sourceWindow.ref_id || ''}`,
        `Content type: ${sourceWindow.contentType || sourceWindow.content_type || 'text/plain'}`,
        `Total lines: ${Number(sourceWindow.totalLines || sourceWindow.total_lines || 0) || 0}`,
        `Line range: L${lineStart}-L${lineEnd}`,
        `Has more before: ${(sourceWindow.hasMoreBefore ?? sourceWindow.has_more_before) ? 'true' : 'false'}`,
        `Has more after: ${(sourceWindow.hasMoreAfter ?? sourceWindow.has_more_after) ? 'true' : 'false'}`,
        '',
        rendered
    ].filter((line, index) => index === 7 || normalizeText(line)).join('\n');
}

function formatSourceViewportMatches(details = {}) {
    const matches = Array.isArray(details.matches) ? details.matches : [];
    if (!matches.length) {
        return '';
    }
    const lines = [
        `Find matches: ${matches.length}`
    ];
    matches.slice(0, 12).forEach((match) => {
        const lineno = Number(match.lineno || match.lineNumber || match.line_number || 0) || '?';
        lines.push(`L${lineno}: ${match.text || ''}`);
    });
    return lines.join('\n');
}

function buildSourceViewportFunctionOutput(toolOutput = {}, sourceViewport = {}) {
    const { sourceWindow, action, details } = sourceViewport;
    const header = action.type === 'find_in_page'
        ? 'Find in page completed.'
        : 'Opened page source viewport.';
    const contentItems = [
        ContentItem.inputText([
            header,
            `Tool: ${toolOutput.toolName}`,
            action.url ? `url=${action.url}` : '',
            action.type === 'find_in_page' && action.pattern ? `pattern=${action.pattern}` : '',
            action.type === 'open_page' && action.lineno ? `lineno=${action.lineno}` : '',
            toolOutput.durationMs != null ? `duration_ms=${toolOutput.durationMs}` : ''
        ].filter(Boolean).join('\n')),
        ContentItem.inputText(formatSourceViewportMatches(details)),
        ContentItem.inputText(formatSourceViewportLinks(toolOutput, details)),
        ContentItem.inputText(formatSourceViewportLines(sourceWindow))
    ].filter(Boolean);
    return FunctionCallOutputPayload.fromContentItems(contentItems, {
        success: toolOutput.ok === true ? true : toolOutput.ok === false ? false : null
    });
}

function toolOutputToResponseItems(toolOutput = {}, options = {}) {
    const toolName = normalizeText(toolOutput.toolName);
    if (!toolName) {
        return [];
    }
    const callId = canonicalCallId(toolOutput);
    if (toolName === 'tool_search') {
        const tools = Array.isArray(toolOutput.details?.tools)
            ? toolOutput.details.tools.map(compactToolSearchResultForHistory)
            : [];
        return [
            ResponseItem.toolSearchCall({
                call_id: callId,
                status: 'completed',
                execution: 'client',
                provider_metadata: toolOutput.providerMetadata || null,
                arguments: toolOutput.args || {}
            }),
            ResponseItem.toolSearchOutput({
                call_id: callId,
                status: 'completed',
                execution: 'client',
                tools
            })
        ];
    }
    const sourceViewport = sourceViewportFromToolOutput(toolOutput);
    if (sourceViewport) {
        return [
            ResponseItem.functionCall({
                name: toolName,
                arguments: toolOutput.args || {},
                provider_metadata: toolOutput.providerMetadata || null,
                call_id: callId
            }),
            normalizeSourceViewportWebSearchCall(sourceViewport, callId),
            ResponseItem.functionCallOutput({
                call_id: callId,
                output: buildSourceViewportFunctionOutput(toolOutput, sourceViewport)
            })
        ].filter(Boolean);
    }
    const webSearchOutput = webSearchOutputFromToolOutput(toolOutput);
    if (webSearchOutput) {
        return [
            ResponseItem.functionCall({
                name: toolName,
                arguments: toolOutput.args || {},
                provider_metadata: toolOutput.providerMetadata || null,
                call_id: callId
            }),
            normalizeWebSearchCall(webSearchOutput, callId),
            ResponseItem.functionCallOutput({
                call_id: callId,
                output: buildWebSearchFunctionOutput(toolOutput, webSearchOutput)
            })
        ].filter(Boolean);
    }
    const metadataLines = buildModelVisibleToolMetadata(toolOutput);
    const output = [
        toolOutput.ok ? 'Status: completed' : `Status: ${toolOutput.status || 'failed'}`,
        toolOutput.errorSummary ? `Error: ${toolOutput.errorSummary}` : '',
        toolOutput.durationMs != null ? `DurationMs: ${toolOutput.durationMs}` : '',
        ...metadataLines,
        'Output:',
        summarizeForModel(toolOutput.outputText || '', options.toolOutputChars || DEFAULT_TOOL_OUTPUT_CHARS)
    ].filter(Boolean).join('\n');
    return [
        ResponseItem.functionCall({
            name: toolName,
            arguments: toolOutput.args || {},
            provider_metadata: toolOutput.providerMetadata || null,
            call_id: callId
        }),
        ResponseItem.functionCallOutput({
            call_id: callId,
            output: FunctionCallOutputPayload.normalize(output, {
                success: toolOutput.ok === true ? true : toolOutput.ok === false ? false : null
            })
        })
    ];
}

function toolOutputToRuntimeEvent(toolOutput = {}) {
    return normalizeRuntimeEvent({
        type: 'tool_result',
        id: toolOutput.sourceId || toolOutput.callId,
        callId: toolOutput.callId,
        title: toolOutput.title,
        tool: toolOutput.toolName,
        args: cloneJson(toolOutput.args || {}),
        status: toolOutput.status || 'unknown',
        ok: toolOutput.ok === true,
        preview: toolOutput.outputPreview || '',
        errorSummary: toolOutput.errorSummary || '',
        evidenceRefs: Array.isArray(toolOutput.evidenceRefs) ? toolOutput.evidenceRefs.slice() : [],
        evidenceArtifacts: Array.isArray(toolOutput.evidenceArtifacts) ? cloneJson(toolOutput.evidenceArtifacts) : [],
        durationMs: toolOutput.durationMs
    }, {
        layer: RUNTIME_LAYER.TOOL_EXECUTOR,
        status: toolOutput.status || 'unknown'
    });
}

function toolOutputToThreadItem(toolOutput = {}) {
    return {
        schema: 'ailis.thread_item.v1',
        type: 'tool_result',
        status: toolOutput.ok ? 'completed' : 'failed',
        id: toolOutput.sourceId || toolOutput.callId,
        callId: toolOutput.callId,
        title: toolOutput.title || toolOutput.toolName || 'tool result',
        tool: toolOutput.toolName || null,
        ok: toolOutput.ok === true,
        result_status: toolOutput.status || 'unknown',
        preview: toolOutput.outputPreview || '',
        error_summary: toolOutput.errorSummary || null,
        evidence_refs: Array.isArray(toolOutput.evidenceRefs) ? toolOutput.evidenceRefs.slice() : [],
        duration_ms: toolOutput.durationMs
    };
}

function makeRolloutItem(kind, payload = {}) {
    return {
        schema: 'ailis.rollout_item.v1',
        type: kind,
        payload: cloneJson(payload),
        recordedAt: new Date().toISOString()
    };
}

module.exports = {
    DEFAULT_THREAD_ITEM_PREVIEW_CHARS,
    DEFAULT_TOOL_OUTPUT_CHARS,
    extractText,
    makeRolloutItem,
    normalizeToolOutput,
    sanitizeWebToolDetailsForModel,
    sanitizeWebToolTextForModel,
    toolOutputToResponseItems,
    toolOutputToRuntimeEvent,
    toolOutputToThreadItem
};
