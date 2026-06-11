const {
    summarizeForModel
} = require('./aigl-runtime-budget.cjs');

const DEFAULT_MAX_TURN_ITEMS = 16;
const DEFAULT_PREVIEW_CHARS = 1000;
const DEFAULT_RECENT_FULL_ITEMS = 6;
const DEFAULT_OLDER_PREVIEW_CHARS = 280;

function normalizeText(value = '') {
    return String(value || '').trim();
}

function summarizeValue(value, maxChars = DEFAULT_PREVIEW_CHARS) {
    if (value == null) {
        return '';
    }
    const text = typeof value === 'string' ? value : JSON.stringify(value);
    if (!text) {
        return '';
    }
    return summarizeForModel(text, maxChars);
}

function itemSummaryForPrompt(item = {}, maxChars = 360) {
    if (!item || typeof item !== 'object') {
        return null;
    }
    return {
        type: item.type || null,
        status: item.status || null,
        tool: item.tool || null,
        title: item.title || null,
        ok: item.ok,
        result_status: item.result_status || null,
        error_type: item.error_type || item.errorType || null,
        evidence_gap: item.evidence_gap || item.evidenceGap || null,
        recovery_hint: item.recovery_hint || item.recoveryHint || null,
        preview: item.preview ? summarizeValue(item.preview, maxChars) : undefined,
        compacted: item.compacted === true
    };
}

function compactOlderTurnItem(item = {}, olderPreviewChars = DEFAULT_OLDER_PREVIEW_CHARS) {
    if (!item || typeof item !== 'object') {
        return item;
    }
    const compacted = { ...item, compacted: true };
    if (compacted.preview) {
        compacted.preview = summarizeValue(compacted.preview, olderPreviewChars);
    }
    if (compacted.args != null) {
        compacted.args_summary = summarizeValue(compacted.args, olderPreviewChars);
        delete compacted.args;
    }
    return compacted;
}

function compactRetainedTurnItems({
    items = [],
    recentFullItems = DEFAULT_RECENT_FULL_ITEMS,
    olderPreviewChars = DEFAULT_OLDER_PREVIEW_CHARS
} = {}) {
    const fullCount = Math.max(1, Number(recentFullItems) || DEFAULT_RECENT_FULL_ITEMS);
    const compactBeforeIndex = Math.max(0, items.length - fullCount);
    return items.map((item, index) => {
        if (index >= compactBeforeIndex) {
            return item;
        }
        return compactOlderTurnItem(item, olderPreviewChars);
    });
}

function extractToolResultText(result) {
    if (result == null) {
        return '';
    }
    if (typeof result === 'string') {
        return result;
    }
    if (typeof result.text === 'string') {
        return result.text;
    }
    if (typeof result.content === 'string') {
        return result.content;
    }
    if (typeof result.stdout === 'string') {
        return result.stdout;
    }
    if (typeof result.preview === 'string') {
        return result.preview;
    }
    return summarizeValue(result);
}

function getResponseDetails(response = {}) {
    if (response?.result?.details && typeof response.result.details === 'object') {
        return response.result.details;
    }
    if (response?.details && typeof response.details === 'object') {
        return response.details;
    }
    return {};
}

function getCommandProgram(command = '') {
    const text = normalizeText(command);
    if (!text) {
        return '';
    }
    const match = text.match(/^\s*(?:"([^"]+)"|'([^']+)'|([^\s|&<>]+))/);
    return normalizeText(match?.[1] || match?.[2] || match?.[3]);
}

function classifyToolFailureObservation({ tool = '', args = {}, response = {}, preview = '' } = {}) {
    const details = getResponseDetails(response);
    const action = normalizeText(args.action || details.action).toLowerCase();
    const exitCode = Number(details.exitCode ?? response.exitCode);
    const command = normalizeText(details.command || args.command);
    const program = getCommandProgram(command);
    const text = `${preview}\n${response.error || ''}\n${extractToolResultText(response.result)}`.toLowerCase();

    if (tool === 'computer' && action === 'exec' && (exitCode === 9009 || /not recognized|not found|无法将/.test(text))) {
        return {
            error_type: 'missing_dependency',
            summary: program
                ? `Command not found on this Windows machine: ${program}.`
                : 'Command not found on this Windows machine.',
            recovery_hint: 'Treat this as a failed tool observation and try an available cross-platform path, such as PowerShell, Node.js, curl, built-in read/web_fetch, artifact_verifier, or an installed Python launcher.',
            alternatives: ['powershell', 'node', 'curl', 'read', 'web_fetch', 'artifact_verifier']
        };
    }

    if (tool === 'computer' && action === 'exec' && Number.isFinite(exitCode) && exitCode !== 0) {
        return {
            error_type: 'command_failed',
            summary: `Command exited with code ${exitCode}.`,
            recovery_hint: 'Inspect the tool output and choose a different command, parser, or built-in tool before stopping.',
            alternatives: ['inspect_output', 'retry_with_simpler_command', 'use_builtin_tool']
        };
    }

    if (/timeout|timed out|超时/.test(text)) {
        return {
            error_type: 'timeout',
            summary: 'Tool call timed out.',
            recovery_hint: 'Retry with a smaller operation, narrower input, or a more direct tool.',
            alternatives: ['narrow_input', 'retry', 'use_direct_tool']
        };
    }

    return null;
}

function classifyEvidenceGapObservation({ tool = '', args = {}, response = {}, preview = '' } = {}) {
    if (response?.ok !== true) {
        return null;
    }
    const toolId = normalizeText(tool);
    const action = normalizeText(args.action || args.operation || args.intent).toLowerCase();
    const url = normalizeText(args.url || args.href || response.result?.details?.url || response.result?.url);
    const text = `${url}\n${preview}\n${extractToolResultText(response.result)}`.toLowerCase();
    const isWebFetch = toolId === 'web_fetch' ||
        toolId === 'mcp__aigl_research__web_fetch' ||
        /web_fetch$/.test(toolId) ||
        action === 'web_fetch' ||
        action === 'fetch';
    if (!isWebFetch) {
        return null;
    }
    if (/clinicaltrials\.gov|nct\d{8}/i.test(text)) {
        return {
            evidence_gap: 'structured_api_preferred',
            summary: 'Web fetch returned page text, but this task likely needs a structured ClinicalTrials.gov study field.',
            recovery_hint: 'try tool_search: ClinicalTrials API NCT enrollment OpenAPI; if a callable external__clinicaltrials__... tool appears, call it directly with the NCT id.',
            alternatives: ['tool_search: ClinicalTrials API NCT enrollment OpenAPI', 'external__clinicaltrials__get_study', 'ClinicalTrials.gov v2 studies API']
        };
    }
    if (/youtube\.com|youtu\.be/.test(text)) {
        return {
            evidence_gap: 'video_evidence_required',
            summary: 'A fetched YouTube page is not enough for visual counting or frame-level questions.',
            recovery_hint: 'try tool_search: video frame sampling, youtube transcript, download video, or vision frame analysis.',
            alternatives: ['tool_search: youtube transcript', 'tool_search: video frame sampling', 'vision frame analysis']
        };
    }
    if (/\.pdf(\?|#|$)|application\/pdf|pdf/.test(text)) {
        return {
            evidence_gap: 'document_parser_preferred',
            summary: 'The target appears to be a PDF or paper; page fetch alone may miss the answer-bearing text.',
            recovery_hint: 'try mcp__aigl_research__pdf_find_and_extract for unknown PDF links, or pdf_extract_text for a direct PDF URL/path.',
            alternatives: ['mcp__aigl_research__pdf_find_and_extract', 'mcp__aigl_research__pdf_extract_text', 'download_file']
        };
    }
    if (/\.docx(\?|#|$)|wordprocessingml|secret santa/.test(text)) {
        return {
            evidence_gap: 'document_parser_preferred',
            summary: 'The target appears to be a DOCX/document task; raw web or zip text is not reliable evidence.',
            recovery_hint: 'try tool_search: DOCX parser, office document text extraction, or document reader before final answer.',
            alternatives: ['tool_search: DOCX parser', 'document text extraction', 'read attached document']
        };
    }
    return null;
}

function formatFailureHint(failure = null) {
    if (!failure) {
        return '';
    }
    return [
        `error_type=${failure.error_type}`,
        failure.summary,
        failure.recovery_hint,
        failure.alternatives?.length ? `available_alternatives=${failure.alternatives.join(', ')}` : ''
    ].filter(Boolean).join(' | ');
}

function formatEvidenceGapHint(gap = null) {
    if (!gap) {
        return '';
    }
    return [
        `evidence_gap=${gap.evidence_gap}`,
        gap.summary,
        gap.recovery_hint,
        gap.alternatives?.length ? `available_alternatives=${gap.alternatives.join(', ')}` : ''
    ].filter(Boolean).join(' | ');
}

function buildToolCallItem(event = {}) {
    return {
        type: 'tool_call',
        status: 'started',
        id: event.id || null,
        title: event.title || event.tool || 'tool call',
        tool: event.tool || null,
        args: event.args || null,
        iteration: Number.isFinite(event.iteration) ? event.iteration : null
    };
}

function buildToolResultItem(event = {}) {
    const failure = event.ok ? null : classifyToolFailureObservation({
        tool: event.tool,
        args: event.args,
        response: event.response || event.result || {},
        preview: event.preview || event.error || ''
    });
    const evidenceGap = event.ok ? (
        event.evidenceGap && typeof event.evidenceGap === 'object'
            ? event.evidenceGap
            : null
    ) : null;
    const preview = summarizeValue(event.preview || event.error || event.result || '', DEFAULT_PREVIEW_CHARS);
    return {
        type: 'tool_result',
        status: event.ok ? 'completed' : 'failed',
        id: event.id || null,
        title: event.title || event.tool || 'tool result',
        tool: event.tool || null,
        ok: event.ok === true,
        result_status: event.status || 'unknown',
        preview: summarizeValue([preview, formatFailureHint(failure), formatEvidenceGapHint(evidenceGap)].filter(Boolean).join('\n'), DEFAULT_PREVIEW_CHARS),
        error_type: failure?.error_type || null,
        evidence_gap: evidenceGap?.evidence_gap || null,
        recovery_hint: failure?.recovery_hint || evidenceGap?.recovery_hint || null,
        alternatives: failure?.alternatives || evidenceGap?.alternatives || [],
        iteration: Number.isFinite(event.iteration) ? event.iteration : null
    };
}

function buildToolResultItemFromStep(stepResult = {}) {
    const response = stepResult.response || {};
    const basePreview = summarizeValue(
        extractToolResultText(response.result) || response.error || response.result || response,
        DEFAULT_PREVIEW_CHARS
    );
    const failure = response.ok === true ? null : classifyToolFailureObservation({
        tool: stepResult.tool,
        args: stepResult.args,
        response,
        preview: basePreview
    });
    const evidenceGap = response.ok === true ? classifyEvidenceGapObservation({
        tool: stepResult.tool,
        args: stepResult.args,
        response,
        preview: basePreview
    }) : null;
    return {
        type: 'tool_result',
        status: response.ok === true ? 'completed' : 'failed',
        id: stepResult.id || null,
        title: stepResult.title || stepResult.tool || 'tool result',
        tool: stepResult.tool || null,
        ok: response.ok === true,
        result_status: response.status || 'unknown',
        preview: summarizeValue([basePreview, formatFailureHint(failure), formatEvidenceGapHint(evidenceGap)].filter(Boolean).join('\n'), DEFAULT_PREVIEW_CHARS),
        error_type: failure?.error_type || null,
        evidence_gap: evidenceGap?.evidence_gap || null,
        recovery_hint: failure?.recovery_hint || evidenceGap?.recovery_hint || null,
        alternatives: failure?.alternatives || evidenceGap?.alternatives || [],
        iteration: Number.isFinite(stepResult.iteration) ? stepResult.iteration : null
    };
}

function buildContextItem(event = {}) {
    return {
        type: 'context',
        status: event.status || 'loaded',
        title: 'capability context',
        loaded: event.loaded || null,
        missing: event.missing || null,
        preview: summarizeValue(event.content || event.request || '', DEFAULT_PREVIEW_CHARS),
        iteration: Number.isFinite(event.iteration) ? event.iteration : null
    };
}

function buildNoteItem(event = {}) {
    return {
        type: 'runtime_note',
        status: event.status || event.type || 'note',
        title: event.type || 'runtime note',
        preview: summarizeValue(event, DEFAULT_PREVIEW_CHARS),
        iteration: Number.isFinite(event.iteration) ? event.iteration : null
    };
}

function eventToTurnItem(event = {}) {
    if (!event || typeof event !== 'object') {
        return null;
    }
    if (event.type === 'tool_call') {
        return buildToolCallItem(event);
    }
    if (event.type === 'tool_result') {
        return buildToolResultItem(event);
    }
    if (event.type === 'capability_context') {
        return buildContextItem(event);
    }
    return buildNoteItem(event);
}

function collectCodexLikeTurnItems({
    events = [],
    stepResults = []
} = {}) {
    const items = [];
    for (const event of Array.isArray(events) ? events : []) {
        const item = eventToTurnItem(event);
        if (item) {
            items.push(item);
        }
    }
    const knownResultIds = new Set(
        items
            .filter((item) => item.type === 'tool_result' && item.id)
            .map((item) => item.id)
    );
    for (const stepResult of Array.isArray(stepResults) ? stepResults : []) {
        if (!stepResult?.id || knownResultIds.has(stepResult.id)) {
            continue;
        }
        items.push(buildToolResultItemFromStep(stepResult));
    }
    return items;
}

function buildCodexLikeTurnItems({
    events = [],
    stepResults = [],
    maxItems = DEFAULT_MAX_TURN_ITEMS,
    recentFullItems = DEFAULT_RECENT_FULL_ITEMS,
    olderPreviewChars = DEFAULT_OLDER_PREVIEW_CHARS
} = {}) {
    const items = collectCodexLikeTurnItems({ events, stepResults });
    const retained = items.slice(-Math.max(1, maxItems));
    return compactRetainedTurnItems({
        items: retained,
        recentFullItems,
        olderPreviewChars
    });
}

function buildTurnItemsPromptObject(input = {}) {
    const maxItems = Math.max(1, input.maxItems || DEFAULT_MAX_TURN_ITEMS);
    const allItems = collectCodexLikeTurnItems(input);
    const retainedItems = allItems.slice(-maxItems);
    const items = compactRetainedTurnItems({
        items: retainedItems,
        recentFullItems: input.recentFullItems || DEFAULT_RECENT_FULL_ITEMS,
        olderPreviewChars: input.olderPreviewChars || DEFAULT_OLDER_PREVIEW_CHARS
    });
    const latestObservation = [...items].reverse().find((item) => item.type === 'tool_result') || null;
    const latestFailedObservation = [...items].reverse().find((item) =>
        item.type === 'tool_result' && item.status === 'failed'
    ) || null;
    return {
        model: 'codex_like_turn_items',
        note: 'These are chronological runtime items. Recent observations stay detailed; older observations are compacted. Tool failures are observations for the next decision, not final blockers.',
        retention: {
            strategy: 'codex_like_recent_observation_window',
            max_items: maxItems,
            retained_items: items.length,
            omitted_items: Math.max(0, allItems.length - retainedItems.length),
            recent_full_items: Math.max(1, input.recentFullItems || DEFAULT_RECENT_FULL_ITEMS),
            older_preview_chars: input.olderPreviewChars || DEFAULT_OLDER_PREVIEW_CHARS
        },
        latest_observation: itemSummaryForPrompt(latestObservation),
        latest_failed_observation: itemSummaryForPrompt(latestFailedObservation),
        items
    };
}

module.exports = {
    buildCodexLikeTurnItems,
    buildTurnItemsPromptObject,
    classifyEvidenceGapObservation,
    classifyToolFailureObservation,
    formatEvidenceGapHint,
    formatFailureHint
};
