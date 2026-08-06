const {
    summarizeForModel
} = require('./ailis-runtime-budget.cjs');
const { createHash } = require('node:crypto');
const {
    normalizeToolOutput,
    toolOutputToThreadItem
} = require('./ailis-agent-object-model.cjs');

const DEFAULT_MAX_TURN_ITEMS = 16;
const DEFAULT_PREVIEW_CHARS = 1000;
const STRUCTURED_ARTIFACT_PREVIEW_CHARS = 12000;
const DEFAULT_RECENT_FULL_ITEMS = 6;
const DEFAULT_OLDER_PREVIEW_CHARS = 280;
const DEFAULT_ARG_STRING_CHARS = 900;
const LARGE_TEXT_ARG_PREVIEW_CHARS = 260;
const COMMAND_ARG_CHARS = 700;
const MAX_ARG_OBJECT_KEYS = 40;
const MAX_ARG_ARRAY_ITEMS = 16;
const MAX_ARG_DEPTH = 5;
const LARGE_TEXT_ARG_KEYS = new Set([
    'content',
    'text',
    'body',
    'script',
    'code',
    'patch',
    'stdin',
    'input',
    'markdown',
    'html',
    'xml',
    'csv',
    'data'
]);
const COMMAND_ARG_KEYS = new Set(['command', 'cmd']);
const SECRET_ARG_KEY_RE = /(^|[_-])(api[_-]?key|token|secret|password|passwd|authorization|cookie|credential|private[_-]?key)([_-]|$)/i;

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

function hashTextForPrompt(text = '') {
    return createHash('sha1').update(String(text)).digest('hex').slice(0, 12);
}

function summarizeLargeArgString(value = '', key = '', maxPreviewChars = LARGE_TEXT_ARG_PREVIEW_CHARS) {
    const text = String(value || '');
    return {
        omitted: true,
        kind: 'large_text_arg',
        key,
        chars: text.length,
        sha1: hashTextForPrompt(text),
        preview: summarizeForModel(text, maxPreviewChars)
    };
}

function sanitizeArgValueForPrompt(value, key = '', depth = 0) {
    const normalizedKey = normalizeText(key).toLowerCase();
    if (SECRET_ARG_KEY_RE.test(normalizedKey)) {
        return '__REDACTED__';
    }
    if (typeof value === 'string') {
        const isLargeTextField = LARGE_TEXT_ARG_KEYS.has(normalizedKey);
        const maxChars = COMMAND_ARG_KEYS.has(normalizedKey)
            ? COMMAND_ARG_CHARS
            : (isLargeTextField ? LARGE_TEXT_ARG_PREVIEW_CHARS : DEFAULT_ARG_STRING_CHARS);
        if (value.length > maxChars) {
            return summarizeLargeArgString(value, normalizedKey || key, isLargeTextField ? LARGE_TEXT_ARG_PREVIEW_CHARS : maxChars);
        }
        return value;
    }
    if (value == null || typeof value !== 'object') {
        return value;
    }
    if (depth >= MAX_ARG_DEPTH) {
        return summarizeLargeArgString(JSON.stringify(value), normalizedKey || key, LARGE_TEXT_ARG_PREVIEW_CHARS);
    }
    if (Array.isArray(value)) {
        const items = value.slice(0, MAX_ARG_ARRAY_ITEMS).map((entry) =>
            sanitizeArgValueForPrompt(entry, key, depth + 1)
        );
        if (value.length > MAX_ARG_ARRAY_ITEMS) {
            items.push({ omitted_items: value.length - MAX_ARG_ARRAY_ITEMS });
        }
        return items;
    }
    const out = {};
    const entries = Object.entries(value);
    for (const [entryKey, entryValue] of entries.slice(0, MAX_ARG_OBJECT_KEYS)) {
        out[entryKey] = sanitizeArgValueForPrompt(entryValue, entryKey, depth + 1);
    }
    if (entries.length > MAX_ARG_OBJECT_KEYS) {
        out.__omitted_keys = entries.length - MAX_ARG_OBJECT_KEYS;
    }
    return out;
}

function sanitizeToolArgsForPrompt(args = null) {
    if (args == null) {
        return null;
    }
    return sanitizeArgValueForPrompt(args);
}

function itemSummaryForPrompt(item = {}, maxChars = 360) {
    if (!item || typeof item !== 'object') {
        return null;
    }
    return {
        id: item.id || null,
        type: item.type || null,
        status: item.status || null,
        tool: item.tool || null,
        title: item.title || null,
        ok: item.ok,
        result_status: item.result_status || null,
        error_type: item.error_type || item.errorType || null,
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
    if (Array.isArray(result.content)) {
        const chunks = result.content
            .map((part) => (typeof part?.text === 'string' ? part.text : ''))
            .filter(Boolean);
        if (chunks.length) {
            return chunks.join('\n').trim();
        }
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
    const candidates = [
        response?.result?.structuredContent?.result?.structuredContent,
        response?.result?.structuredContent?.result?.details,
        response?.result?.details?.result?.structuredContent,
        response?.result?.details?.result?.details,
        response?.result?.structuredContent,
        response?.result?.details,
        response?.details?.result?.structuredContent,
        response?.details?.result?.details,
        response?.details
    ];
    for (const candidate of candidates) {
        if (candidate && typeof candidate === 'object' && !Array.isArray(candidate)) {
            return candidate;
        }
    }
    return {};
}

function previewBudgetForToolResult({ tool = '', response = {}, result = {}, preview = '' } = {}) {
    const normalizedTool = normalizeText(tool).toLowerCase();
    const details = getResponseDetails(response);
    const text = extractToolResultText(result || response?.result || response) || normalizeText(preview);
    const structuredDocument =
        details.document ||
        details.paragraphCount !== undefined ||
        details.tableCount !== undefined ||
        /document_read_complete|## tables|table \d+ rows=/i.test(text);
    const structuredSpreadsheet =
        details.workbook ||
        details.sheetCount !== undefined ||
        /spreadsheet|workbook|sheet=/i.test(`${normalizedTool}\n${text}`);
    const structuredArtifact =
        normalizedTool === 'artifact_tools' ||
        /ailis\.artifact_tools|compactRows|adapterId|structuredContent\/details/i.test(text);
    if (
        /read_document|read_spreadsheet|read_presentation/.test(normalizedTool) ||
        structuredArtifact ||
        structuredDocument ||
        structuredSpreadsheet
    ) {
        return STRUCTURED_ARTIFACT_PREVIEW_CHARS;
    }
    return DEFAULT_PREVIEW_CHARS;
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
                : 'Command not found on this Windows machine.'
        };
    }

    if (tool === 'computer' && action === 'exec' && Number.isFinite(exitCode) && exitCode !== 0) {
        return {
            error_type: 'command_failed',
            summary: `Command exited with code ${exitCode}.`
        };
    }

    if (/timeout|timed out|超时/.test(text)) {
        return {
            error_type: 'timeout',
            summary: 'Tool call timed out.'
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
        failure.summary
    ].filter(Boolean).join(' | ');
}

function buildToolCallItem(event = {}) {
    return {
        type: 'tool_call',
        status: 'started',
        id: event.id || null,
        title: event.title || event.tool || 'tool call',
        tool: event.tool || null,
        args: sanitizeToolArgsForPrompt(event.args || null),
        iteration: Number.isFinite(event.iteration) ? event.iteration : null
    };
}

function buildToolResultItem(event = {}) {
    const response = event.response || event.result || {};
    const previewBudget = previewBudgetForToolResult({
        tool: event.tool,
        response,
        result: event.result,
        preview: event.preview || event.error || ''
    });
    const failure = event.ok ? null : classifyToolFailureObservation({
        tool: event.tool,
        args: event.args,
        response,
        preview: event.preview || event.error || ''
    });
    const preview = summarizeValue(event.preview || event.error || event.result || '', previewBudget);
    return {
        type: 'tool_result',
        status: event.ok ? 'completed' : 'failed',
        id: event.id || null,
        title: event.title || event.tool || 'tool result',
        tool: event.tool || null,
        ok: event.ok === true,
        result_status: event.status || 'unknown',
        preview: summarizeValue([preview, formatFailureHint(failure)].filter(Boolean).join('\n'), previewBudget),
        error_type: failure?.error_type || null,
        iteration: Number.isFinite(event.iteration) ? event.iteration : null
    };
}

function buildToolResultItemFromStep(stepResult = {}) {
    const toolOutput = normalizeToolOutput(stepResult, 0);
    const response = stepResult.response || {};
    const previewBudget = previewBudgetForToolResult({
        tool: stepResult.tool,
        response,
        result: response.result
    });
    const basePreview = summarizeValue(
        extractToolResultText(response.result) || response.error || response.result || response,
        previewBudget
    );
    const failure = response.ok === true ? null : classifyToolFailureObservation({
        tool: stepResult.tool,
        args: stepResult.args,
        response,
        preview: basePreview
    });
    const baseItem = toolOutputToThreadItem(toolOutput);
    return {
        ...baseItem,
        status: response.ok === true ? 'completed' : 'failed',
        id: stepResult.id || null,
        title: stepResult.title || stepResult.tool || 'tool result',
        tool: stepResult.tool || null,
        ok: response.ok === true,
        result_status: response.status || 'unknown',
        preview: summarizeValue([basePreview, formatFailureHint(failure)].filter(Boolean).join('\n'), previewBudget),
        error_type: failure?.error_type || null,
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

function collectAilisThreadItems({
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

function buildCompactedAilisThreadItems({
    events = [],
    stepResults = [],
    maxItems = DEFAULT_MAX_TURN_ITEMS,
    recentFullItems = DEFAULT_RECENT_FULL_ITEMS,
    olderPreviewChars = DEFAULT_OLDER_PREVIEW_CHARS
} = {}) {
    const items = collectAilisThreadItems({ events, stepResults });
    const retained = items.slice(-Math.max(1, maxItems));
    return compactRetainedTurnItems({
        items: retained,
        recentFullItems,
        olderPreviewChars
    });
}

function buildAilisThreadItems(input = {}) {
    return buildCompactedAilisThreadItems(input);
}

function buildObservationLedgerPromptObject(input = {}) {
    const maxItems = Math.max(1, input.maxItems || DEFAULT_MAX_TURN_ITEMS);
    const allItems = collectAilisThreadItems(input);
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
        model: 'ailis_observation_ledger',
        schema: 'ailis.observation_ledger.v1',
        note: 'Chronological runtime observations derived from canonical AILIS tool outputs. Recent observations stay detailed; older observations are compacted. This is an observation ledger, not the model-visible ResponseItem history.',
        retention: {
            strategy: 'ailis_recent_observation_window',
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
    buildAilisThreadItems,
    buildObservationLedgerPromptObject,
    classifyToolFailureObservation,
    formatFailureHint,
    sanitizeToolArgsForPrompt
};
