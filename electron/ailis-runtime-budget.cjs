const DEFAULT_SCHEMA_BUDGET_BYTES = 4000;
const DEFAULT_SCHEMA_DEPTH = 2;
const DEFAULT_TEXT_BUDGET_CHARS = 6000;
const DEFAULT_JSON_STRING_BUDGET_CHARS = 1200;
const DEFAULT_JSON_ARRAY_ITEMS = 24;
const DEFAULT_JSON_OBJECT_KEYS = 80;

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

const MODEL_GUIDANCE_KEYS = new Set([
    'nextActions',
    'next_actions',
    'suggestedNext',
    'suggested_next',
    'suggestedNextCalls',
    'suggested_next_calls',
    'suggestedActions',
    'suggested_actions',
    'recoveryHint',
    'recovery_hint',
    'recommended_next_action',
    'requiredNextStep',
    'required_next_step',
    'instruction',
    'instructions',
    'repairInstruction',
    'repair_instruction',
    'continuation',
    'queryHints',
    'alternatives',
    'readingGuide'
]);

function stripModelGuidance(value, options = {}) {
    const preserveGuidanceKeys = new Set(Array.isArray(options.preserveGuidanceKeys) ? options.preserveGuidanceKeys : []);
    if (Array.isArray(value)) {
        return value.map((entry) => stripModelGuidance(entry, options));
    }
    if (!value || typeof value !== 'object') {
        return value;
    }
    const out = {};
    for (const [key, entry] of Object.entries(value)) {
        if (MODEL_GUIDANCE_KEYS.has(key) && !preserveGuidanceKeys.has(key)) {
            continue;
        }
        out[key] = stripModelGuidance(entry, options);
    }
    return out;
}

function shouldStripJsonTextGuidance(value) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
        return false;
    }
    const schema = normalizeString(value.schema);
    return schema.startsWith('ailis.artifact_tools.') ||
        schema.startsWith('ailis.active_artifact_observation.') ||
        value?.protocol?.tool === 'artifact_tools';
}

function stripGuidanceFromModelText(text = '') {
    const source = normalizeString(text);
    if (!/^\s*[\[{]/.test(source)) {
        return source;
    }
    try {
        const parsed = JSON.parse(source);
        if (!shouldStripJsonTextGuidance(parsed)) {
            return source;
        }
        return JSON.stringify(stripModelGuidance(parsed), null, 2);
    } catch {
        return source;
    }
}

function approxTokenCount(value = '') {
    const text = typeof value === 'string' ? value : JSON.stringify(value || '');
    return Math.ceil(Buffer.byteLength(text || '', 'utf8') / 4);
}

function compactJsonByteLength(value) {
    try {
        return Buffer.byteLength(JSON.stringify(value), 'utf8');
    } catch {
        return Infinity;
    }
}

function truncateMiddleText(value, maxChars = DEFAULT_TEXT_BUDGET_CHARS) {
    const text = normalizeString(value);
    const budget = Math.max(0, Number(maxChars) || 0);
    if (!budget || text.length <= budget) {
        return text;
    }
    if (budget <= 16) {
        return `${text.slice(0, Math.max(0, budget - 3))}...`;
    }
    const marker = '\n... [truncated for model budget] ...\n';
    const remaining = Math.max(0, budget - marker.length);
    const head = Math.ceil(remaining * 0.6);
    const tail = Math.max(0, remaining - head);
    return `${text.slice(0, head)}${marker}${tail ? text.slice(-tail) : ''}`;
}

function buildModelVisibleTruncationNotice({
    originalTextChars = 0,
    visibleTextChars = 0
} = {}) {
    return [
        'MODEL_VISIBLE_CONTENT_TRUNCATED:',
        `originalTextChars=${Number(originalTextChars) || 'unknown'}; visibleTextChars<=${Number(visibleTextChars) || 'unknown'}; truncationScope=model_visible_tool_result_text;`
    ].join('\n');
}

function stripSchemaDescriptions(value) {
    if (Array.isArray(value)) {
        for (const entry of value) {
            stripSchemaDescriptions(entry);
        }
        return value;
    }
    if (!value || typeof value !== 'object') {
        return value;
    }
    delete value.description;
    delete value.examples;
    for (const entry of Object.values(value)) {
        stripSchemaDescriptions(entry);
    }
    return value;
}

function dropSchemaDefinitions(value) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
        return value;
    }
    delete value.$defs;
    delete value.definitions;
    for (const entry of Object.values(value)) {
        dropSchemaDefinitions(entry);
    }
    return value;
}

function isComplexSchemaObject(value) {
    return Boolean(
        value &&
            typeof value === 'object' &&
            !Array.isArray(value) &&
            (
                (value.properties && typeof value.properties === 'object') ||
                Array.isArray(value.oneOf) ||
                Array.isArray(value.anyOf) ||
                Array.isArray(value.allOf)
            )
    );
}

function collapseDeepSchemaObjects(value, depth = 0, maxDepth = DEFAULT_SCHEMA_DEPTH) {
    if (Array.isArray(value)) {
        for (const entry of value) {
            collapseDeepSchemaObjects(entry, depth + 1, maxDepth);
        }
        return value;
    }
    if (!value || typeof value !== 'object') {
        return value;
    }
    if (depth >= maxDepth && isComplexSchemaObject(value)) {
        const type = value.type || 'object';
        const required = Array.isArray(value.required) ? value.required.slice(0, 12) : undefined;
        for (const key of Object.keys(value)) {
            delete value[key];
        }
        value.type = type;
        value.additionalProperties = true;
        if (required?.length) {
            value.required = required;
        }
        value.description = 'Nested schema compacted for model budget; pass the top-level fields shown by the tool contract.';
        return value;
    }
    for (const entry of Object.values(value)) {
        collapseDeepSchemaObjects(entry, depth + 1, maxDepth);
    }
    return value;
}

function compactToolSchema(inputSchema = {}, options = {}) {
    const maxBytes = Math.max(512, Number(options.maxBytes || DEFAULT_SCHEMA_BUDGET_BYTES));
    const maxDepth = Math.max(1, Number(options.maxDepth || DEFAULT_SCHEMA_DEPTH));
    const schema = cloneJson(inputSchema || {});
    if (!schema || typeof schema !== 'object') {
        return { type: 'object', additionalProperties: true, properties: {} };
    }
    if (compactJsonByteLength(schema) <= maxBytes) {
        return schema;
    }
    stripSchemaDescriptions(schema);
    if (compactJsonByteLength(schema) <= maxBytes) {
        return schema;
    }
    dropSchemaDefinitions(schema);
    if (compactJsonByteLength(schema) <= maxBytes) {
        return schema;
    }
    collapseDeepSchemaObjects(schema, 0, maxDepth);
    return schema;
}

function isPrimitiveJsonValue(value) {
    return value == null || ['string', 'number', 'boolean'].includes(typeof value);
}

function isSchemaLikeObject(value) {
    return Boolean(
        value &&
            typeof value === 'object' &&
            !Array.isArray(value) &&
            (
                typeof value.type === 'string' ||
                value.properties ||
                Array.isArray(value.required) ||
                value.items ||
                typeof value.additionalProperties === 'boolean'
            )
    );
}

function compactSchemaPropertiesForModel(properties = {}, options = {}, schemaDepth = 0) {
    const maxStringChars = Math.max(64, Number(options.maxStringChars || DEFAULT_JSON_STRING_BUDGET_CHARS));
    const maxObjectKeys = Math.max(1, Number(options.maxObjectKeys || DEFAULT_JSON_OBJECT_KEYS));
    const entries = Object.entries(properties && typeof properties === 'object' && !Array.isArray(properties) ? properties : {});
    const out = {};
    for (const [key, value] of entries.slice(0, maxObjectKeys)) {
        out[key] = isSchemaLikeObject(value)
            ? compactSchemaNodeForModel(value, options, schemaDepth + 1)
            : summarizeForModel(value, maxStringChars);
    }
    if (entries.length > maxObjectKeys) {
        out.__omitted_keys = entries.length - maxObjectKeys;
    }
    return out;
}

function compactSchemaNodeForModel(value = {}, options = {}, schemaDepth = 0) {
    const maxStringChars = Math.max(64, Number(options.maxStringChars || DEFAULT_JSON_STRING_BUDGET_CHARS));
    const maxArrayItems = Math.max(1, Number(options.maxArrayItems || DEFAULT_JSON_ARRAY_ITEMS));
    const out = {};
    for (const key of ['type', 'format', 'pattern', 'minLength', 'maxLength', 'minimum', 'maximum', 'default']) {
        if (Object.prototype.hasOwnProperty.call(value, key)) {
            out[key] = cloneJson(value[key]);
        }
    }
    if (typeof value.description === 'string') {
        out.description = truncateMiddleText(value.description, maxStringChars);
    }
    if (Array.isArray(value.required)) {
        out.required = value.required.filter((entry) => typeof entry === 'string').slice(0, 24);
    }
    if (Array.isArray(value.enum)) {
        out.enum = value.enum.slice(0, maxArrayItems).map((entry) =>
            isPrimitiveJsonValue(entry) ? entry : summarizeForModel(entry, maxStringChars)
        );
        if (value.enum.length > maxArrayItems) {
            out.enum.push(`... ${value.enum.length - maxArrayItems} more`);
        }
    }
    if (typeof value.additionalProperties === 'boolean') {
        out.additionalProperties = value.additionalProperties;
    }
    if (value.items && typeof value.items === 'object' && !Array.isArray(value.items)) {
        out.items = schemaDepth >= 2
            ? summarizeForModel(value.items, maxStringChars)
            : compactSchemaNodeForModel(value.items, options, schemaDepth + 1);
    }
    if (value.properties && typeof value.properties === 'object' && !Array.isArray(value.properties)) {
        out.properties = schemaDepth >= 2
            ? Object.fromEntries(Object.keys(value.properties).slice(0, 24).map((key) => [key, '<schema compacted>']))
            : compactSchemaPropertiesForModel(value.properties, options, schemaDepth + 1);
    }
    return Object.keys(out).length ? out : summarizeForModel(value, maxStringChars);
}

function compactJsonForModel(value, options = {}, depth = 0, parentKey = '') {
    const maxStringChars = Math.max(64, Number(options.maxStringChars || DEFAULT_JSON_STRING_BUDGET_CHARS));
    const maxArrayItems = Math.max(1, Number(options.maxArrayItems || DEFAULT_JSON_ARRAY_ITEMS));
    const maxObjectKeys = Math.max(1, Number(options.maxObjectKeys || DEFAULT_JSON_OBJECT_KEYS));
    const maxDepth = Math.max(1, Number(options.maxDepth || 5));
    if (typeof value === 'string') {
        return truncateMiddleText(value, maxStringChars);
    }
    if (value == null || typeof value !== 'object') {
        return value;
    }
    if (depth >= maxDepth) {
        try {
            const serialized = JSON.stringify(value);
            const smallArray = Array.isArray(value) && value.length <= maxArrayItems;
            const smallObject = !Array.isArray(value) && Object.keys(value).length <= Math.min(maxObjectKeys, 12);
            if ((smallArray || smallObject) && serialized.length <= maxStringChars) {
                return cloneJson(value);
            }
        } catch {
            // Fall through to the normal summarizer.
        }
        if (Array.isArray(value) && (
            parentKey === 'required' ||
            parentKey === 'enum' ||
            value.every(isPrimitiveJsonValue)
        )) {
            const items = value.slice(0, maxArrayItems).map((entry) =>
                isPrimitiveJsonValue(entry) ? entry : summarizeForModel(entry, maxStringChars)
            );
            if (value.length > maxArrayItems) {
                items.push(`... ${value.length - maxArrayItems} more`);
            }
            return items;
        }
        if (
            parentKey === 'properties' &&
            value &&
            typeof value === 'object' &&
            !Array.isArray(value)
        ) {
            return compactSchemaPropertiesForModel(value, options);
        }
        if (isSchemaLikeObject(value)) {
            return compactSchemaNodeForModel(value, options);
        }
        return summarizeForModel(value, maxStringChars);
    }
    if (Array.isArray(value)) {
        const items = value.slice(0, maxArrayItems).map((entry) => compactJsonForModel(entry, options, depth + 1, parentKey));
        if (value.length > maxArrayItems) {
            items.push({ omitted_items: value.length - maxArrayItems });
        }
        return items;
    }
    const out = {};
    const entries = Object.entries(value);
    for (const [key, entry] of entries.slice(0, maxObjectKeys)) {
        out[key] = compactJsonForModel(entry, options, depth + 1, key);
    }
    if (entries.length > maxObjectKeys) {
        out.__omitted_keys = entries.length - maxObjectKeys;
    }
    return out;
}

function summarizeForModel(value, maxChars = DEFAULT_TEXT_BUDGET_CHARS) {
    let text = '';
    try {
        text = typeof value === 'string' ? value : JSON.stringify(value);
    } catch {
        text = String(value);
    }
    return truncateMiddleText(text.replace(/\r\n/g, '\n').trim(), maxChars);
}

function compactToolResultForModel(result = {}, options = {}) {
    const maxTextChars = Math.max(256, Number(options.maxTextChars || DEFAULT_TEXT_BUDGET_CHARS));
    const maxStructuredStringChars = Math.max(128, Number(options.maxStructuredStringChars || DEFAULT_JSON_STRING_BUDGET_CHARS));
    const output = stripModelGuidance(cloneJson(result || {}), {
        preserveGuidanceKeys: options.preserveGuidanceKeys
    });
    if (!output || typeof output !== 'object') {
        return {
            content: [{ type: 'text', text: summarizeForModel(output, maxTextChars) }],
            isError: false,
            details: {}
        };
    }
    if (Array.isArray(output.content)) {
        let remaining = maxTextChars;
        output.content = output.content.map((part) => {
            if (!part || typeof part !== 'object') {
                const text = truncateMiddleText(String(part ?? ''), remaining);
                remaining = Math.max(0, remaining - text.length);
                return { type: 'text', text };
            }
            if (typeof part.text === 'string') {
                const metadata = { ...part };
                delete metadata.text;
                const next = compactJsonForModel(metadata, {
                    maxStringChars: maxStructuredStringChars,
                    maxArrayItems: 16,
                    maxObjectKeys: 48,
                    maxDepth: 5
                });
                const sourceText = stripGuidanceFromModelText(part.text);
                const originalTextChars = Number.isFinite(Number(part.originalTextChars))
                    ? Number(part.originalTextChars)
                    : sourceText.length;
                const jsonLikeText = /^\s*[\[{]/.test(sourceText);
                let modelText = sourceText;
                let structurallyCompacted = false;
                if (jsonLikeText && sourceText.length > maxTextChars) {
                    try {
                        modelText = JSON.stringify(compactJsonForModel(JSON.parse(sourceText), {
                            maxStringChars: maxStructuredStringChars,
                            maxArrayItems: 32,
                            maxObjectKeys: 80,
                            maxDepth: 8
                        }), null, 2);
                        structurallyCompacted = modelText.length < sourceText.length;
                    } catch {
                        modelText = sourceText;
                    }
                }
                next.text = jsonLikeText ? modelText : truncateMiddleText(modelText, remaining || 128);
                next.originalTextChars = originalTextChars;
                const modelViewShortened = structurallyCompacted || next.text.length < sourceText.length || originalTextChars > next.text.length;
                next.truncated = Boolean(part.truncated) || modelViewShortened;
                if (modelViewShortened) {
                    const notice = buildModelVisibleTruncationNotice({
                        originalTextChars,
                        visibleTextChars: next.text.length
                    });
                    next.modelVisibleTruncation = {
                        originalTextChars,
                        visibleTextChars: next.text.length,
                        truncationScope: 'model_visible_tool_result_text'
                    };
                    if (!jsonLikeText) {
                        const noticeBudget = remaining || 128;
                        next.text = truncateMiddleText(`${notice}\n\n${next.text}`, noticeBudget);
                    }
                }
                remaining = Math.max(0, remaining - next.text.length);
                return next;
            }
            const next = compactJsonForModel(part, {
                maxStringChars: Math.min(maxStructuredStringChars, Math.max(128, remaining || maxStructuredStringChars)),
                maxArrayItems: 16,
                maxObjectKeys: 48,
                maxDepth: 5
            });
            if (typeof next.text === 'string') {
                next.originalTextChars = part.text.length;
                next.text = truncateMiddleText(next.text, remaining || 128);
                const modelViewShortened = next.text.length < part.text.length;
                next.truncated = next.truncated || modelViewShortened;
                if (modelViewShortened) {
                    const notice = buildModelVisibleTruncationNotice({
                        originalTextChars: next.originalTextChars,
                        visibleTextChars: next.text.length
                    });
                    next.modelVisibleTruncation = {
                        originalTextChars: next.originalTextChars,
                        visibleTextChars: next.text.length,
                        truncationScope: 'model_visible_tool_result_text'
                    };
                    if (!/^\s*[\[{]/.test(part.text)) {
                        next.text = truncateMiddleText(`${notice}\n\n${next.text}`, remaining || 128);
                    }
                }
                remaining = Math.max(0, remaining - next.text.length);
            }
            return next;
        });
    }
    if (output.details && typeof output.details === 'object') {
        output.details = compactJsonForModel(output.details, {
            maxStringChars: maxStructuredStringChars,
            maxArrayItems: 20,
            maxObjectKeys: 64,
            maxDepth: 5
        });
    }
    if (output.structuredContent && typeof output.structuredContent === 'object') {
        output.structuredContent = compactJsonForModel(output.structuredContent, {
            maxStringChars: maxStructuredStringChars,
            maxArrayItems: 20,
            maxObjectKeys: 64,
            maxDepth: 5
        });
    }
    output.modelBudget = {
        status: 'compacted',
        maxTextChars,
        approxTokens: approxTokenCount(output)
    };
    return output;
}

module.exports = {
    DEFAULT_JSON_STRING_BUDGET_CHARS,
    DEFAULT_SCHEMA_BUDGET_BYTES,
    DEFAULT_SCHEMA_DEPTH,
    DEFAULT_TEXT_BUDGET_CHARS,
    approxTokenCount,
    compactJsonForModel,
    compactToolResultForModel,
    compactToolSchema,
    summarizeForModel,
    truncateMiddleText,
    stripModelGuidance
};
