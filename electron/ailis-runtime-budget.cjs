const { createHash } = require('node:crypto');
const { imageDimensions } = require('./ailis-image-content.cjs');

const DEFAULT_SCHEMA_BUDGET_BYTES = 4000;
const DEFAULT_SCHEMA_DEPTH = 2;
const DEFAULT_TEXT_BUDGET_CHARS = 6000;
const DEFAULT_JSON_STRING_BUDGET_CHARS = 1200;
const DEFAULT_JSON_ARRAY_ITEMS = 24;
const DEFAULT_JSON_OBJECT_KEYS = 80;
const MAX_SOURCE_VIEWPORT_LINES = 256;
const MAX_SOURCE_VIEWPORT_TEXT_CHARS = 24000;
// Used only when no explicit or built-in model window is available.
const DEFAULT_CONTEXT_INPUT_LIMIT_TOKENS = 512000;
const DEFAULT_CONTEXT_RESERVED_OUTPUT_TOKENS = 4096;
const DEFAULT_CONTEXT_SYSTEM_RESERVE_TOKENS = 8192;
const DEFAULT_CONTEXT_SOFT_RATIO = 400000 / DEFAULT_CONTEXT_INPUT_LIMIT_TOKENS;
const DEFAULT_CONTEXT_HARD_RATIO = 0.9;
const DEFAULT_CONTEXT_STOP_RATIO = 0.95;

// Preserve budget configuration across desktop and headless normalization.
function pickContextBudgetSettings(settings = {}) {
    const keys = [
        'contextWindowTokens', 'context_window_tokens', 'modelContextWindowTokens',
        'model_context_window', 'maxContextTokens', 'maxContextWindowTokens',
        'contextSoftTokenLimit', 'context_soft_token_limit', 'contextSoftRatio',
        'contextHardTokenLimit', 'context_hard_token_limit', 'contextHardRatio',
        'autoCompactTokenLimit', 'contextStopTokenLimit', 'context_stop_token_limit',
        'emergencyContextTokenLimit', 'contextStopRatio', 'reservedOutputTokens',
        'reserved_output_tokens', 'maxOutputTokens', 'max_tokens',
        'modelCapabilities', 'capabilities'
    ];
    return Object.fromEntries(keys.filter(key => settings[key] !== undefined)
        .map(key => [key, settings[key]]));
}

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

// Match Codex history.rs: resized images use a fixed estimate; original images
// use capped 32px patches. These are context estimates, not billing telemetry.
const RESIZED_IMAGE_BYTES_ESTIMATE = 7373;
const originalImageEstimates = new Map();

function originalImageBytes(payload) {
    const key = createHash('sha256').update(payload).digest('hex');
    let estimate = originalImageEstimates.get(key);
    if (estimate === undefined) {
        const dimensions = imageDimensions(Buffer.from(payload, 'base64'));
        estimate = dimensions?.width > 0 && dimensions?.height > 0
            ? Math.min(10000, Math.ceil(dimensions.width / 32) * Math.ceil(dimensions.height / 32)) * 4
            : RESIZED_IMAGE_BYTES_ESTIMATE;
    }
    originalImageEstimates.delete(key);
    originalImageEstimates.set(key, estimate);
    if (originalImageEstimates.size > 32) originalImageEstimates.delete(originalImageEstimates.keys().next().value);
    return estimate;
}

function imageByteAdjustment(value) {
    if (!value || typeof value !== 'object') return 0;
    let url;
    let detail = value.detail;
    if (value.type === 'input_image') url = value.image_url;
    else if (value.type === 'image_url') {
        url = value.image_url?.url;
        detail = value.image_url?.detail ?? detail;
    } else if (value.type === 'image' && typeof value.data === 'string' && /^image\//i.test(value.mimeType || '')) {
        url = `data:${value.mimeType};base64,${value.data}`;
        detail = value._meta?.['codex/imageDetail'] ?? detail;
    }
    const match = typeof url === 'string' && /^data:image\/[^;,]+((?:;[^,]*)?),([\s\S]*)$/i.exec(url);
    if (match && match[1].split(';').some(parameter => parameter.toLowerCase() === 'base64')) {
        const payload = match[2];
        const estimate = detail === 'original' ? originalImageBytes(payload) : RESIZED_IMAGE_BYTES_ESTIMATE;
        return Buffer.byteLength(JSON.stringify(payload), 'utf8') - 2 - estimate;
    }
    return Object.values(value).reduce((total, child) => total + imageByteAdjustment(child), 0);
}

function reasoningByteAdjustment(value) {
    if (!value || typeof value !== 'object') return 0;
    let adjustment = 0;
    if (['reasoning', 'compaction', 'context_compaction'].includes(value.type) &&
        typeof value.encrypted_content === 'string') {
        // Codex estimates the decoded reasoning payload, not its base64 envelope.
        const encodedBytes = Buffer.byteLength(value.encrypted_content, 'utf8');
        const reasoningBytes = Math.max(0, Math.floor(encodedBytes * 3 / 4) - 650);
        adjustment = Buffer.byteLength(JSON.stringify(value.encrypted_content), 'utf8') - 2 - reasoningBytes;
    }
    return adjustment + Object.values(value).reduce((total, child) => total + reasoningByteAdjustment(child), 0);
}

function approxTokenCount(value = '') {
    const text = typeof value === 'string' ? value : JSON.stringify(value || '');
    // Never parse/discount text: a data URL printed as text really is text input.
    return Math.ceil(Math.max(0, Buffer.byteLength(text || '', 'utf8') -
        imageByteAdjustment(value) - reasoningByteAdjustment(value)) / 4);
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
    let payloadAdjustment = 0;
    try {
        text = typeof value === 'string' ? value : JSON.stringify(value || '');
        payloadAdjustment = imageByteAdjustment(value) + reasoningByteAdjustment(value);
    } catch {
        text = String(value || '');
    }
    return {
        name,
        chars: text.length,
        bytes: Buffer.byteLength(text, 'utf8'),
        approxTokens: Math.ceil(Math.max(0, Buffer.byteLength(text, 'utf8') - payloadAdjustment) / 4)
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
            : Math.ceil(inputLimitTokens * configuredThresholds.hard)
    );
    const stopTokenLimit = Math.min(
        effectiveInputLimitTokens,
        Math.max(
            hardTokenLimit,
            Number.isFinite(configuredStopTokenLimit) && configuredStopTokenLimit > 0
                ? Math.round(configuredStopTokenLimit)
                : Math.ceil(inputLimitTokens * configuredThresholds.stop)
        )
    );
    const softTokenLimit = Math.min(
        hardTokenLimit,
        Number.isFinite(configuredSoftTokenLimit) && configuredSoftTokenLimit > 0
            ? Math.round(configuredSoftTokenLimit)
            : Math.ceil(inputLimitTokens * configuredThresholds.soft)
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
    const modelInputParts = Array.isArray(config.modelInputParts) ? new Set(config.modelInputParts) : null;
    const measuredParts = normalizeBudgetParts(parts).map((part) => ({
        ...measureBudgetPart(part.name, part.value),
        counted: modelInputParts
            ? modelInputParts.has(part.name)
            : !(part.name === 'staticPrefix' && parts.instructions && part.value === parts.instructions)
    }));
    const estimatedPromptTokens = measuredParts.reduce((sum, part) => sum + (part.counted ? part.approxTokens : 0), 0);
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
    const usageEstimate = config.usageEstimate;
    const anchored = Number.isFinite(usageEstimate?.tokens) && usageEstimate.tokens > 0;
    // Bound estimation uncertainty without changing the configured compaction thresholds.
    const measurementReserveTokens = anchored
        ? Math.min(DEFAULT_CONTEXT_SYSTEM_RESERVE_TOKENS, Math.ceil(effectiveInputLimitTokens * 0.05))
        : 0;
    const applicableProviderInput = config.providerUsageApplicable === false ? 0 : providerInputTokens;
    const effectivePromptTokens = anchored
        ? Math.max(usageEstimate.tokens + measurementReserveTokens, applicableProviderInput)
        : Math.max(estimatedPromptTokens, applicableProviderInput);
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
        measurement: {
            unit: 'tokens',
            mode: anchored ? 'provider_usage_anchor' : 'structured_estimate',
            contextHash: config.measurementContextHash || null,
            fallbackReason: anchored ? null : (usageEstimate?.fallbackReason || 'no_usage_anchor'),
            // Numeric diagnostics use their declared unit, not credential-like field names.
            inputEstimate: effectivePromptTokens,
            structuredEstimate: estimatedPromptTokens,
            previousActualInput: providerInputTokens || null,
            anchor: anchored ? usageEstimate.anchorTokens : null,
            appendedItems: anchored ? usageEstimate.appendedItems : null,
            appendedEstimate: anchored ? usageEstimate.appendedEstimatedTokens : null,
            reserve: measurementReserveTokens,
            providerUsageApplicable: config.providerUsageApplicable !== false,
            previousEstimateError: tokenInfo.budgetEstimateErrorTokens ?? null
        },
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
    pickContextBudgetSettings,
    summarizeForModel,
    truncateMiddleText,
    stripModelGuidance
};
