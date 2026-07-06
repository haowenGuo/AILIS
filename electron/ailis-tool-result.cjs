const {
    approxTokenCount,
    makeHeadTailPreview,
    compactToolResultForModel
} = require('./ailis-runtime-budget.cjs');

const DEFAULT_MODEL_VISIBLE_TEXT_CHARS = 6000;
const DEFAULT_STRUCTURED_STRING_CHARS = 1200;

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

function collectModelVisibleText(content = []) {
    return (Array.isArray(content) ? content : [])
        .filter((part) => part && typeof part === 'object' && typeof part.text === 'string')
        .map((part) => part.text)
        .join('\n\n');
}

function countLines(text = '') {
    if (!text) {
        return 0;
    }
    return String(text).split(/\r?\n/).length;
}

function extractOutputRef(output = {}, text = '') {
    const details = output.details && typeof output.details === 'object' ? output.details : {};
    const candidates = [
        details.outputId,
        details.output_id,
        details.outputRef?.outputId,
        details.outputRef?.output_id,
        details.artifactId,
        details.artifact_id
    ].filter(Boolean);
    const match = String(text || '').match(/\b(?:outputId|output_id|OutputArtifact|artifactId)\s*[:=]\s*([A-Za-z0-9._:-]+)/);
    if (match?.[1]) {
        candidates.push(match[1]);
    }
    const outputId = candidates.map((entry) => String(entry || '').trim()).find(Boolean);
    if (!outputId) {
        return null;
    }
    return {
        outputId,
        readTools: ['output_read', 'output_tail', 'output_search']
    };
}

function applyModelVisiblePreview(output = {}, {
    toolId = '',
    maxTextChars = DEFAULT_MODEL_VISIBLE_TEXT_CHARS
} = {}) {
    const text = collectModelVisibleText(output.content);
    if (!text) {
        return {
            output,
            budget: {
                status: 'complete',
                tool: toolId,
                originalTextChars: 0,
                visibleTextChars: 0,
                originalLines: 0,
                approxOriginalTokens: 0,
                outputComplete: true,
                outputTruncatedForModel: false
            }
        };
    }
    const previewBudget = Math.max(512, Number(maxTextChars || DEFAULT_MODEL_VISIBLE_TEXT_CHARS) - 512);
    const preview = makeHeadTailPreview(text, previewBudget);
    const outputRef = extractOutputRef(output, text);
    const budget = {
        status: preview.truncated ? 'previewed' : 'complete',
        tool: toolId,
        strategy: preview.strategy,
        originalTextChars: preview.originalTextChars,
        visibleTextChars: preview.visibleTextChars,
        omittedTextChars: preview.omittedTextChars,
        originalLines: countLines(text),
        approxOriginalTokens: approxTokenCount(text),
        outputComplete: !preview.truncated,
        outputTruncatedForModel: Boolean(preview.truncated),
        ...(outputRef ? { outputRef } : {})
    };
    if (!preview.truncated) {
        return { output, budget };
    }
    output.content = [{
        type: 'text',
        text: [
            'TOOL_OUTPUT_MODEL_PREVIEW:',
            `tool=${toolId || 'unknown'}`,
            `originalTextChars=${budget.originalTextChars}`,
            `visibleTextChars<=${budget.visibleTextChars}`,
            `originalLines=${budget.originalLines}`,
            'outputComplete=false',
            'outputTruncatedForModel=true',
            outputRef ? `outputId=${outputRef.outputId}` : '',
            outputRef ? `readTools=${outputRef.readTools.join(',')}` : '',
            '--- preview ---',
            preview.text
        ].filter(Boolean).join('\n')
    }];
    return { output, budget };
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

function normalizeAilisToolOutput(result = {}, {
    toolId = '',
    status = 'completed',
    maxTextChars = DEFAULT_MODEL_VISIBLE_TEXT_CHARS,
    maxStructuredStringChars = DEFAULT_STRUCTURED_STRING_CHARS
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
    const previewed = applyModelVisiblePreview(output, { toolId, maxTextChars });
    output.details.modelBudget = previewed.budget;
    if (previewed.budget.outputRef) {
        output.details.outputRef = previewed.budget.outputRef;
    }
    const resultStatus = String(output.details?.status || '').trim().toLowerCase();
    const preserveControlGuidance = output.isError === true ||
        output.details?.ok === false ||
        !['completed', 'success'].includes(resultStatus);
    const compacted = compactToolResultForModel(previewed.output, {
        maxTextChars,
        maxStructuredStringChars,
        preserveGuidanceKeys: preserveControlGuidance
            ? ['suggestedNext', 'suggested_next']
            : []
    });
    compacted.modelBudget = {
        ...(compacted.modelBudget || {}),
        ...previewed.budget,
        status: previewed.budget.outputTruncatedForModel ? 'previewed_and_compacted' : 'compacted'
    };
    compacted.details = {
        ...(compacted.details || {}),
        modelBudget: compacted.modelBudget,
        ...(previewed.budget.outputRef ? { outputRef: previewed.budget.outputRef } : {})
    };
    return compacted;
}

module.exports = {
    makeAilisToolError,
    makeAilisToolResult,
    normalizeAilisToolOutput
};
