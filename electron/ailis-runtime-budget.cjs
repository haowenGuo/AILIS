const DEFAULT_SCHEMA_BUDGET_BYTES = 4000;
const DEFAULT_SCHEMA_DEPTH = 2;
const DEFAULT_TEXT_BUDGET_CHARS = 6000;
const DEFAULT_JSON_STRING_BUDGET_CHARS = 1200;
const DEFAULT_JSON_ARRAY_ITEMS = 24;
const DEFAULT_JSON_OBJECT_KEYS = 80;
const MAX_SOURCE_VIEWPORT_LINES = 256;
const MAX_SOURCE_VIEWPORT_TEXT_CHARS = 24000;
const DEFAULT_CONTEXT_INPUT_LIMIT_TOKENS = 128000;
const DEFAULT_CONTEXT_RESERVED_OUTPUT_TOKENS = 4096;
const DEFAULT_CONTEXT_SYSTEM_RESERVE_TOKENS = 8192;
const DEFAULT_CONTEXT_SOFT_RATIO = 0.5;
const DEFAULT_CONTEXT_HARD_RATIO = 0.7;
const DEFAULT_CONTEXT_STOP_RATIO = 0.8;

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

function isSourceViewportLine(value) {
    if (!value || typeof value !== 'object' || Array.isArray(value) || typeof value.text !== 'string') {
        return false;
    }
    return Number.isFinite(Number(value.lineno ?? value.line_number ?? value.lineNumber));
}

function compactSourceViewportLinesForModel(lines, options = {}) {
    const maxStringChars = Math.max(64, Number(options.maxStringChars || DEFAULT_JSON_STRING_BUDGET_CHARS));
    const perLineTextChars = Math.max(
        64,
        Math.min(maxStringChars, Math.floor(MAX_SOURCE_VIEWPORT_TEXT_CHARS / Math.max(1, lines.length)))
    );
    return lines.map((line) => {
        const compacted = {};
        for (const [key, value] of Object.entries(line)) {
            compacted[key] = typeof value === 'string'
                ? truncateMiddleText(value, perLineTextChars)
                : cloneJson(value);
        }
        return compacted;
    });
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
    const text = typeof value === 'string' ? value : '';
    const budget = Math.max(0, Number(maxChars) || 0);
    if (!budget || text.length <= budget) {
        return text;
    }
    const marker = '\n... [truncated for model budget] ...\n';
    if (budget < marker.length) {
        return `${text.slice(0, Math.max(0, budget - 3))}${'.'.repeat(Math.min(3, budget))}`;
    }
    const remaining = Math.max(0, budget - marker.length);
    const head = Math.ceil(remaining * 0.6);
    const tail = Math.max(0, remaining - head);
    return `${text.slice(0, head)}${marker}${tail ? text.slice(-tail) : ''}`;
}

function makeHeadTailPreview(value, maxChars = DEFAULT_TEXT_BUDGET_CHARS, options = {}) {
    const text = typeof value === 'string' ? value : '';
    const budget = Math.max(0, Number(maxChars) || 0);
    const headRatio = Math.min(0.85, Math.max(0.15, Number(options.headRatio || 0.6)));
    if (!budget || text.length <= budget) {
        return {
            text,
            strategy: 'complete',
            truncated: false,
            originalTextChars: text.length,
            visibleTextChars: text.length,
            omittedTextChars: 0
        };
    }
    const marker = '\n... [middle omitted for model budget; use output refs for exact slices when available] ...\n';
    if (budget < marker.length) {
        const preview = `${text.slice(0, Math.max(0, budget - 3))}${'.'.repeat(Math.min(3, budget))}`;
        return {
            text: preview,
            strategy: 'head_tail',
            truncated: true,
            originalTextChars: text.length,
            visibleTextChars: preview.length,
            omittedTextChars: Math.max(0, text.length - preview.length)
        };
    }
    const remaining = Math.max(0, budget - marker.length);
    const head = Math.ceil(remaining * headRatio);
    const tail = Math.max(0, remaining - head);
    const preview = `${text.slice(0, head)}${marker}${tail ? text.slice(-tail) : ''}`;
    return {
        text: preview,
        strategy: 'head_tail',
        truncated: true,
        originalTextChars: text.length,
        visibleTextChars: preview.length,
        omittedTextChars: Math.max(0, text.length - preview.length)
    };
}

function normalizeBudgetParts(parts = {}) {
    if (Array.isArray(parts)) {
        return parts
            .map((part, index) => ({
                name: normalizeString(part?.name, `part_${index}`),
                value: Object.prototype.hasOwnProperty.call(part || {}, 'value') ? part.value : part
            }))
            .filter((part) => part.name);
    }
    if (!parts || typeof parts !== 'object') {
        return [{ name: 'value', value: parts }];
    }
    return Object.entries(parts).map(([name, value]) => ({ name, value }));
}

function measureBudgetPart(name, value) {
    let text = '';
    try {
        text = typeof value === 'string' ? value : JSON.stringify(value || '');
    } catch {
        text = String(value || '');
    }
    return {
        name,
        chars: text.length,
        bytes: Buffer.byteLength(text, 'utf8'),
        approxTokens: approxTokenCount(text)
    };
}

function classifyCompactionLevel(ratio = 0, thresholds = {}) {
    const soft = Number(thresholds.soft ?? DEFAULT_CONTEXT_SOFT_RATIO);
    const hard = Number(thresholds.hard ?? DEFAULT_CONTEXT_HARD_RATIO);
    const stop = Number(thresholds.stop ?? DEFAULT_CONTEXT_STOP_RATIO);
    if (ratio >= stop) {
        return 'stop';
    }
    if (ratio >= hard) {
        return 'hard';
    }
    if (ratio >= soft) {
        return 'soft';
    }
    return 'ok';
}

function buildContextBudgetReport(parts = {}, config = {}) {
    const inputLimitTokens = Math.max(1, Number(
        config.effectiveInputLimitTokens ||
        config.inputLimitTokens ||
        DEFAULT_CONTEXT_INPUT_LIMIT_TOKENS
    ));
    const reservedOutputTokens = Math.max(0, Number(config.reservedOutputTokens ?? DEFAULT_CONTEXT_RESERVED_OUTPUT_TOKENS));
    const systemReserveTokens = Math.max(0, Number(config.systemReserveTokens ?? DEFAULT_CONTEXT_SYSTEM_RESERVE_TOKENS));
    const effectiveInputLimitTokens = Math.max(1, Number(config.effectiveInputLimitTokens || (
        inputLimitTokens - reservedOutputTokens - systemReserveTokens
    )));
    const configuredThresholds = {
        soft: Number(config.softRatio ?? DEFAULT_CONTEXT_SOFT_RATIO),
        hard: Number(config.hardRatio ?? DEFAULT_CONTEXT_HARD_RATIO),
        stop: Number(config.stopRatio ?? DEFAULT_CONTEXT_STOP_RATIO)
    };
    const configuredSoftTokenLimit = Number(config.softTokenLimit || 0);
    const configuredHardTokenLimit = Number(config.hardTokenLimit || 0);
    const configuredStopTokenLimit = Number(config.stopTokenLimit || 0);
    const hardTokenLimit = Math.min(
        effectiveInputLimitTokens,
        Number.isFinite(configuredHardTokenLimit) && configuredHardTokenLimit > 0
            ? Math.round(configuredHardTokenLimit)
            : Math.ceil(effectiveInputLimitTokens * configuredThresholds.hard)
    );
    const stopTokenLimit = Math.min(
        effectiveInputLimitTokens,
        Math.max(
            hardTokenLimit,
            Number.isFinite(configuredStopTokenLimit) && configuredStopTokenLimit > 0
                ? Math.round(configuredStopTokenLimit)
                : Math.ceil(effectiveInputLimitTokens * configuredThresholds.stop)
        )
    );
    const softTokenLimit = Math.min(
        hardTokenLimit,
        Number.isFinite(configuredSoftTokenLimit) && configuredSoftTokenLimit > 0
            ? Math.round(configuredSoftTokenLimit)
            : Math.ceil(effectiveInputLimitTokens * configuredThresholds.soft)
    );
    const thresholdTokens = {
        soft: softTokenLimit,
        hard: hardTokenLimit,
        stop: stopTokenLimit
    };
    const thresholds = {
        soft: softTokenLimit / effectiveInputLimitTokens,
        hard: hardTokenLimit / effectiveInputLimitTokens,
        stop: stopTokenLimit / effectiveInputLimitTokens
    };
    const measuredParts = normalizeBudgetParts(parts).map((part) => measureBudgetPart(part.name, part.value));
    const estimatedPromptTokens = measuredParts.reduce((sum, part) => sum + part.approxTokens, 0);
    const tokenInfo = parts.tokenInfo && typeof parts.tokenInfo === 'object'
        ? parts.tokenInfo
        : {};
    const providerInputTokens = [
        config.providerInputTokens,
        config.actualInputTokens,
        tokenInfo.promptTokens,
        tokenInfo.prompt_tokens,
        tokenInfo.inputTokens,
        tokenInfo.input_tokens
    ]
        .map((value) => Number(value))
        .find((value) => Number.isFinite(value) && value > 0) || 0;
    // Provider usage is authoritative for the previous request. The local estimate
    // still protects the next request after new tool outputs have been appended.
    const effectivePromptTokens = Math.max(estimatedPromptTokens, providerInputTokens);
    const ratio = effectivePromptTokens / effectiveInputLimitTokens;
    const level = classifyCompactionLevel(ratio, thresholds);
    const largestParts = measuredParts
        .slice()
        .sort((a, b) => b.approxTokens - a.approxTokens)
        .slice(0, 8);
    return {
        schema: 'ailis.context_budget_report.v1',
        inputLimitTokens,
        reservedOutputTokens,
        systemReserveTokens,
        effectiveInputLimitTokens,
        totalPromptTokens: effectivePromptTokens,
        estimatedPromptTokens,
        providerInputTokens,
        effectivePromptTokens,
        ratio,
        level,
        shouldCompact: level === 'hard' || level === 'stop',
        approachingCompaction: level === 'soft' || level === 'hard' || level === 'stop',
        mustStopAndCheckpoint: level === 'stop',
        thresholds,
        configuredThresholds,
        thresholdTokens,
        thresholdSources: {
            soft: Number.isFinite(configuredSoftTokenLimit) && configuredSoftTokenLimit > 0
                ? 'absolute_tokens'
                : 'ratio',
            hard: Number.isFinite(configuredHardTokenLimit) && configuredHardTokenLimit > 0
                ? 'absolute_tokens'
                : 'ratio',
            stop: Number.isFinite(configuredStopTokenLimit) && configuredStopTokenLimit > 0
                ? 'absolute_tokens'
                : 'ratio'
        },
        parts: measuredParts,
        largestParts,
        action: level === 'stop'
            ? 'checkpoint_or_drop_nonessential_context_before_next_model_call'
            : level === 'hard'
                ? 'semantic_compaction_checkpoint'
                : level === 'soft'
                    ? 'continue_while_monitoring_absolute_context_budget'
                    : 'continue'
    };
}

function buildModelVisibleTruncationNotice({
    originalTextChars = 0,
    visibleTextChars = 0
} = {}) {
    const omittedApproxTokens = Math.max(1, Math.ceil(Math.max(0, Number(originalTextChars) - Number(visibleTextChars)) / 4));
    return [
        'MODEL_VISIBLE_CONTENT_TRUNCATED:',
        `<truncated omitted_approx_tokens="${omittedApproxTokens}" />`,
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
        const hasProperties = value.properties && typeof value.properties === 'object';
        const hasSchemaUnion = (
            Array.isArray(value.oneOf) ||
            Array.isArray(value.anyOf) ||
            Array.isArray(value.allOf)
        );
        if (!hasProperties && hasSchemaUnion) {
            for (const entry of Object.values(value)) {
                collapseDeepSchemaObjects(entry, depth + 1, maxDepth);
            }
            return value;
        }
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
    // Source viewports are already bounded by the web tool. Preserve the full
    // line range so generic array compaction cannot discard evidence near the end.
    if (
        parentKey === 'lines' &&
        Array.isArray(value) &&
        value.length <= MAX_SOURCE_VIEWPORT_LINES &&
        value.every(isSourceViewportLine)
    ) {
        return compactSourceViewportLinesForModel(value, options);
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
    // This is an envelope boundary, not an implicit summary of every JSON
    // string/array. Tool-owned structured data and binary blocks stay intact.
    const output = cloneJson(result);
    if (!output || typeof output !== 'object') {
        return { content: [{ type: 'text', text: String(output ?? '') }], details: {} };
    }
    const explicitBudget = options.maxTextChars == null ? NaN : Number(options.maxTextChars);
    let truncated = false;
    if (Number.isFinite(explicitBudget) && explicitBudget >= 0 && Array.isArray(output.content)) {
        let remaining = Math.floor(explicitBudget);
        output.content = output.content.map((part) => {
            if (!part || typeof part.text !== 'string') return part;
            const source = part.text;
            if (source.length <= remaining) {
                remaining -= source.length;
                return part;
            }
            const preview = remaining > 0 ? makeHeadTailPreview(source, remaining).text : '';
            truncated = true;
            remaining = Math.max(0, remaining - preview.length);
            return {
                ...part,
                text: preview,
                truncated: true,
                originalTextChars: part.originalTextChars ?? source.length,
                modelVisibleTruncation: {
                    originalTextChars: source.length,
                    visibleTextChars: preview.length,
                    truncationScope: 'explicit_tool_text_budget'
                }
            };
        });
    }
    output.modelBudget = {
        ...(output.modelBudget || {}),
        status: 'tool_owned',
        ...(truncated ? { truncated: true, truncationScope: 'explicit_tool_text_budget' } : {}),
        ...(Number.isFinite(explicitBudget) && explicitBudget >= 0 ? { maxTextChars: explicitBudget } : {}),
        approxTokens: approxTokenCount(output)
    };
    return output;
}

module.exports = {
    DEFAULT_CONTEXT_HARD_RATIO,
    DEFAULT_CONTEXT_INPUT_LIMIT_TOKENS,
    DEFAULT_CONTEXT_RESERVED_OUTPUT_TOKENS,
    DEFAULT_CONTEXT_SOFT_RATIO,
    DEFAULT_CONTEXT_STOP_RATIO,
    DEFAULT_CONTEXT_SYSTEM_RESERVE_TOKENS,
    DEFAULT_JSON_STRING_BUDGET_CHARS,
    DEFAULT_SCHEMA_BUDGET_BYTES,
    DEFAULT_SCHEMA_DEPTH,
    DEFAULT_TEXT_BUDGET_CHARS,
    approxTokenCount,
    buildContextBudgetReport,
    classifyCompactionLevel,
    compactJsonForModel,
    compactToolResultForModel,
    compactToolSchema,
    makeHeadTailPreview,
    summarizeForModel,
    truncateMiddleText,
    stripModelGuidance
};
