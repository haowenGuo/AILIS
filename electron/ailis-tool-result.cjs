const {
    compactToolResultForModel
} = require('./ailis-runtime-budget.cjs');

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
        const text = normalizeString(item);
        return text ? { type: 'text', text } : null;
    }
    const type = normalizeString(item.type, 'text');
    if (type === 'text') {
        return {
            type: 'text',
            text: normalizeString(item.text, JSON.stringify(item, null, 2)),
            ...Object.fromEntries(Object.entries(item).filter(([key]) => !['type', 'text'].includes(key)))
        };
    }
    return { ...item, type };
}

function makeAilisToolResult({ status = 'completed', text = '', content = null, details = {}, structuredContent = null, isError = false } = {}) {
    const normalizedDetails = details && typeof details === 'object' && !Array.isArray(details)
        ? cloneJson(details)
        : {};
    const outputContent = Array.isArray(content)
        ? content.map(normalizeContentItem).filter(Boolean)
        : [{
            type: 'text',
            text: normalizeString(text, JSON.stringify({ status, ...normalizedDetails }, null, 2))
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

function normalizeAilisToolOutput(result = {}, { toolId = '', status = 'completed' } = {}) {
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
    return compactToolResultForModel(output, {
        maxTextChars: 6000,
        maxStructuredStringChars: 1200
    });
}

module.exports = {
    makeAilisToolError,
    makeAilisToolResult,
    normalizeAilisToolOutput
};
