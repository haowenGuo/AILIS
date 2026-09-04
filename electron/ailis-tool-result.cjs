const {
    compactToolResultForModel
} = require('./ailis-runtime-budget.cjs');
const {
    attachObservationContract
} = require('./ailis-observation-contract.cjs');

// Tool implementations own output limits. The shared envelope must not impose
// another per-string budget or normalize whitespace in tool data.

function normalizeString(value, fallback = '') {
    if (typeof value !== 'string') {
        return fallback;
    }
    const trimmed = value.trim();
    return trimmed || fallback;
}

function cloneJson(value) {
    try {
        return JSON.parse(JSON.stringify(value));
    } catch {
        return value;
    }
}

function normalizeContentItem(item) {
    if (!item || typeof item !== 'object' || Array.isArray(item)) {
        return typeof item === 'string' ? { type: 'text', text: item } : null;
    }
    const type = normalizeString(item.type, 'text');
    if (type === 'text') {
        return {
            type: 'text',
            text: typeof item.text === 'string' ? item.text : JSON.stringify(item, null, 2),
            ...Object.fromEntries(Object.entries(item).filter(([key]) => !['type', 'text'].includes(key)))
        };
    }
    return { ...item, type };
}

function collectStructuredToolActionKeys(value, keys = new Set(), seen = new Set(), depth = 0) {
    if (!value || typeof value !== 'object' || seen.has(value) || depth > 8) {
        return keys;
    }
    seen.add(value);
    if (Array.isArray(value)) {
        value.slice(0, 64).forEach((entry) => collectStructuredToolActionKeys(entry, keys, seen, depth + 1));
        return keys;
    }
    for (const [key, entry] of Object.entries(value)) {
        if (
            ['suggestedNextCalls', 'suggested_next_calls'].includes(key) &&
            Array.isArray(entry) &&
            entry.some((call) => (
                call &&
                typeof call === 'object' &&
                typeof call.tool === 'string' &&
                call.tool.trim() &&
                call.args &&
                typeof call.args === 'object' &&
                !Array.isArray(call.args)
            ))
        ) {
            keys.add(key);
        }
        collectStructuredToolActionKeys(entry, keys, seen, depth + 1);
    }
    return keys;
}


function makeAilisToolResult({ status = 'completed', text = '', content = null, details = {}, structuredContent = null, isError = false } = {}) {
    const normalizedDetails = details && typeof details === 'object' && !Array.isArray(details)
        ? cloneJson(details)
        : {};
    const outputContent = Array.isArray(content)
        ? content.map(normalizeContentItem).filter(Boolean)
        : [{
            type: 'text',
            text: typeof text === 'string' ? text : JSON.stringify({ status, ...normalizedDetails }, null, 2)
        }];
    const normalizedStructuredContent = structuredContent && typeof structuredContent === 'object' && !Array.isArray(structuredContent)
        ? cloneJson(structuredContent)
        : {
            status,
            ...cloneJson(normalizedDetails)
        };
    return {
        content: outputContent,
        isError: Boolean(isError),
        details: {
            status,
            ...normalizedDetails
        },
        structuredContent: normalizedStructuredContent
    };
}

function makeAilisToolError({
    status = 'error',
    errorCode = 'tool_error',
    message = '',
    details = {},
    retryable = false,
    suggestedNext = ''
} = {}) {
    const normalizedMessage = normalizeString(message, errorCode);
    return makeAilisToolResult({
        status,
        text: normalizedMessage,
        isError: true,
        details: {
            ...details,
            status,
            errorCode,
            error: normalizedMessage,
            retryable: Boolean(retryable),
            ...(suggestedNext ? { suggestedNext } : {})
        },
        structuredContent: {
            ok: false,
            status,
            errorCode,
            error: normalizedMessage,
            retryable: Boolean(retryable),
            ...details,
            ...(suggestedNext ? { suggestedNext } : {})
        }
    });
}

function normalizeAilisToolOutput(result = {}, {
    toolId = '',
    status = 'completed',
    maxTextChars
} = {}) {
    const output = result && typeof result === 'object' && !Array.isArray(result)
        ? cloneJson(result)
        : makeAilisToolResult({ status, text: String(result ?? ''), details: { tool: toolId } });
    if (!Array.isArray(output.content)) {
        output.content = [];
    }
    output.content = output.content.map(normalizeContentItem).filter(Boolean);
    if (!output.content.length && output.details) {
        output.content.push({
            type: 'text',
            text: JSON.stringify(output.details, null, 2)
        });
    }
    if (!output.details || typeof output.details !== 'object' || Array.isArray(output.details)) {
        output.details = {};
    }
    if (!output.structuredContent || typeof output.structuredContent !== 'object' || Array.isArray(output.structuredContent)) {
        output.structuredContent = cloneJson(output.details);
    }
    output.details.toolRuntime = {
        ...(output.details.toolRuntime || {}),
        status: 'normalized',
        tool: toolId
    };
    const normalized = compactToolResultForModel(output, { maxTextChars });
    attachObservationContract(normalized, { toolId });
    return normalized;
}

module.exports = {
    collectStructuredToolActionKeys,
    makeAilisToolError,
    makeAilisToolResult,
    normalizeAilisToolOutput
};
