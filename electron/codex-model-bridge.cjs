const fs = require('node:fs');
const fsPromises = require('node:fs/promises');
const http = require('node:http');
const https = require('node:https');
const os = require('node:os');
const path = require('node:path');
const tls = require('node:tls');
const { spawn, spawnSync } = require('node:child_process');
const { createHash, randomUUID } = require('node:crypto');
const {
    responseItemsToWireItems
} = require('./ailis-response-model.cjs');

const CODEX_MODEL_BRIDGE_PROVIDER = 'codex-model-bridge';
const DEFAULT_CODEX_MODEL = 'gpt-5.6-luna';
const DEFAULT_CODEX_REASONING_EFFORT = 'medium';
const CODEX_BRIDGE_PROTOCOL_VERSION = 2;
const CODEX_HTTP_MODEL_PROVIDER = 'ailis-chatgpt-http';
const CODEX_CHATGPT_BACKEND_URL = 'https://chatgpt.com/backend-api/codex';
const CODEX_RESPONSES_PATH = '/backend-api/codex/responses';
const CODEX_RESPONSES_MAX_BYTES = 64 * 1024 * 1024;
const CODEX_APP_SERVER_BASE_INSTRUCTIONS = [
    'You are a stateless language-model backend for the AILIS agent harness.',
    'Perform exactly one inference over the input supplied by AILIS.',
    'You have no tools, workspace task, memory, or independent agent lifecycle.',
    'Return only the response required by the supplied output schema.'
].join(' ');
const CODEX_APP_SERVER_DEVELOPER_INSTRUCTIONS = [
    'AILIS owns all context, tool selection contracts, tool execution, retries, evidence, and finalization.',
    'Never perform or simulate Codex harness actions. Decide only the next AILIS assistant response.'
].join(' ');
const CODEX_ENTRYPOINT_RELATIVE_PATH = path.join(
    'npm',
    'node_modules',
    '@openai',
    'codex',
    'bin',
    'codex.js'
);
const MAX_CODEX_BRIDGE_IMAGES = 8;
const MAX_CODEX_BRIDGE_IMAGE_BYTES = 20 * 1024 * 1024;
const MAX_CODEX_BRIDGE_TOTAL_IMAGE_BYTES = 40 * 1024 * 1024;

function normalizeText(value, fallback = '') {
    if (typeof value !== 'string') {
        return fallback;
    }
    const normalized = value.trim();
    return normalized || fallback;
}

function normalizeToolSpec(tool = {}) {
    const source = tool?.type === 'function' && tool.function ? tool.function : tool;
    const name = normalizeText(source?.name || tool?.name);
    if (!name) {
        return null;
    }
    const parameters = source?.parameters && typeof source.parameters === 'object'
        ? source.parameters
        : { type: 'object', properties: {} };
    return {
        name,
        description: normalizeText(source?.description || tool?.description),
        parameters,
        strict: source?.strict === true || tool?.strict === true
    };
}

function normalizeToolSpecs(tools = []) {
    return (Array.isArray(tools) ? tools : []).map(normalizeToolSpec).filter(Boolean);
}

function codexBridgeImageSource(part = {}) {
    if (!part || typeof part !== 'object' || Array.isArray(part)) {
        return '';
    }
    const type = normalizeText(part.type).toLowerCase();
    if (!['image_url', 'input_image', 'image', 'localimage', 'local_image'].includes(type)) {
        return '';
    }
    return normalizeText(
        typeof part.image_url === 'string'
            ? part.image_url
            : part.image_url?.url ||
              part.imageUrl ||
              part.url ||
              part.path
    );
}

function sanitizeCodexBridgeMessageContent(content) {
    if (!Array.isArray(content)) {
        return content;
    }
    return content.map((part) => {
        const imageSource = codexBridgeImageSource(part);
        if (!imageSource) {
            return part;
        }
        return {
            type: 'image_attachment',
            transport: imageSource.startsWith('data:')
                ? 'embedded_data'
                : /^https?:\/\//i.test(imageSource)
                ? 'remote_url'
                : 'local_file',
            detail: normalizeText(part.detail || part.image_url?.detail, 'auto'),
            note: 'Image bytes are supplied separately through Codex app-server turn input.'
        };
    });
}

function collectCodexBridgeImageInputs(messages = []) {
    const images = [];
    for (const message of Array.isArray(messages) ? messages : []) {
        for (const part of Array.isArray(message?.content) ? message.content : []) {
            const source = codexBridgeImageSource(part);
            if (!source) {
                continue;
            }
            images.push({
                source,
                detail: normalizeText(part.detail || part.image_url?.detail, 'auto').toLowerCase()
            });
            if (images.length >= MAX_CODEX_BRIDGE_IMAGES) {
                return images;
            }
        }
    }
    return images;
}

function imageExtensionForMimeType(mimeType = '') {
    const normalized = normalizeText(mimeType).toLowerCase();
    if (normalized === 'image/jpeg') return '.jpg';
    if (normalized === 'image/webp') return '.webp';
    if (normalized === 'image/gif') return '.gif';
    return '.png';
}

function normalizeCodexImageDetail(value = '') {
    const detail = normalizeText(value, 'auto').toLowerCase();
    return ['auto', 'low', 'high', 'original'].includes(detail) ? detail : 'auto';
}

async function buildCodexBridgeTurnInput({ prompt = '', messages = [], workspace = '' } = {}) {
    const input = [{ type: 'text', text: prompt, text_elements: [] }];
    let totalBytes = 0;
    const images = collectCodexBridgeImageInputs(messages);
    for (let index = 0; index < images.length; index += 1) {
        const image = images[index];
        const detail = normalizeCodexImageDetail(image.detail);
        if (/^https?:\/\//i.test(image.source)) {
            input.push({ type: 'image', url: image.source, detail });
            continue;
        }
        let sourcePath = image.source;
        let extension = path.extname(sourcePath).toLowerCase();
        const dataMatch = image.source.match(/^data:([^;,]+);base64,([A-Za-z0-9+/=\s]+)$/i);
        if (dataMatch) {
            const bytes = Buffer.from(dataMatch[2].replace(/\s+/g, ''), 'base64');
            if (!bytes.length || bytes.length > MAX_CODEX_BRIDGE_IMAGE_BYTES) {
                throw new Error('Codex bridge image data is empty or exceeds the per-image limit.');
            }
            totalBytes += bytes.length;
            if (totalBytes > MAX_CODEX_BRIDGE_TOTAL_IMAGE_BYTES) {
                throw new Error('Codex bridge image inputs exceed the total image limit.');
            }
            extension = imageExtensionForMimeType(dataMatch[1]);
            sourcePath = path.join(workspace, `input-image-${index + 1}${extension}`);
            await fsPromises.writeFile(sourcePath, bytes);
        } else {
            if (sourcePath.startsWith('file://')) {
                sourcePath = decodeURIComponent(new URL(sourcePath).pathname.replace(/^\/([A-Za-z]:)/, '$1'));
            }
            sourcePath = path.resolve(sourcePath);
            const stat = await fsPromises.stat(sourcePath).catch(() => null);
            if (!stat?.isFile() || stat.size > MAX_CODEX_BRIDGE_IMAGE_BYTES) {
                throw new Error(`Codex bridge local image is missing or too large: ${sourcePath}`);
            }
            totalBytes += stat.size;
            if (totalBytes > MAX_CODEX_BRIDGE_TOTAL_IMAGE_BYTES) {
                throw new Error('Codex bridge image inputs exceed the total image limit.');
            }
            const stagedPath = path.join(workspace, `input-image-${index + 1}${extension || '.png'}`);
            await fsPromises.copyFile(sourcePath, stagedPath);
            sourcePath = stagedPath;
        }
        input.push({ type: 'localImage', path: sourcePath, detail });
    }
    return input;
}

function resolveToolChoice(payload = {}) {
    const choice = payload.toolChoice || payload.tool_choice;
    if (!choice) {
        return { mode: 'auto', name: '' };
    }
    if (typeof choice === 'string') {
        return { mode: choice.toLowerCase(), name: '' };
    }
    const name = normalizeText(choice.name || choice.toolName || choice.tool_name || choice.function?.name);
    return {
        mode: normalizeText(choice.mode || choice.type, name ? 'required' : 'auto').toLowerCase(),
        name
    };
}

function codexNativeToolSpecs(tools = []) {
    return normalizeToolSpecs(tools).map((tool) => ({
        type: 'function',
        name: tool.name,
        description: tool.description,
        parameters: tool.strict
            ? compileCodexOutputSchema(tool.parameters, { fallbackType: 'object' })
            : tool.parameters,
        ...(tool.strict ? { strict: true } : {})
    }));
}

function codexNativeToolChoice(payload = {}) {
    const choice = resolveToolChoice(payload);
    if (choice.name) {
        return {
            type: 'function',
            name: choice.name
        };
    }
    return ['auto', 'none', 'required'].includes(choice.mode) ? choice.mode : 'auto';
}

function messageContentToResponsesParts(content) {
    if (typeof content === 'string') {
        const text = normalizeText(content);
        return text ? [{ type: 'input_text', text }] : [];
    }
    return (Array.isArray(content) ? content : []).map((part) => {
        const imageSource = codexBridgeImageSource(part);
        if (imageSource) {
            return {
                type: 'input_image',
                image_url: imageSource,
                detail: normalizeCodexImageDetail(part.detail || part.image_url?.detail)
            };
        }
        const text = normalizeText(part?.text || part?.content);
        return text ? { type: 'input_text', text } : null;
    }).filter(Boolean);
}

function chatMessagesToResponsesInput(messages = []) {
    const instructions = [];
    const input = [];
    for (const message of Array.isArray(messages) ? messages : []) {
        const role = normalizeText(message?.role, 'user').toLowerCase();
        if (role === 'system' || role === 'developer') {
            const text = typeof message?.content === 'string'
                ? normalizeText(message.content)
                : messageContentToResponsesParts(message?.content)
                    .map((part) => part.type === 'input_text' ? part.text : '')
                    .filter(Boolean)
                    .join('\n');
            if (text) {
                instructions.push(text);
            }
            continue;
        }
        const toolCalls = Array.isArray(message?.toolCalls || message?.tool_calls)
            ? message.toolCalls || message.tool_calls
            : [];
        for (const toolCall of toolCalls) {
            const source = toolCall?.function && typeof toolCall.function === 'object'
                ? toolCall.function
                : toolCall;
            const name = normalizeText(source?.name);
            const callId = normalizeText(toolCall?.id || toolCall?.call_id);
            if (!name || !callId) {
                continue;
            }
            const rawArguments = source?.arguments ?? source?.arguments_json ?? {};
            input.push({
                type: 'function_call',
                call_id: callId,
                name,
                arguments: typeof rawArguments === 'string'
                    ? rawArguments
                    : JSON.stringify(rawArguments || {})
            });
        }
        if (role === 'tool') {
            const callId = normalizeText(message?.toolCallId || message?.tool_call_id);
            if (callId) {
                input.push({
                    type: 'function_call_output',
                    call_id: callId,
                    output: typeof message?.content === 'string'
                        ? message.content
                        : JSON.stringify(message?.content ?? '')
                });
            }
            continue;
        }
        const content = messageContentToResponsesParts(message?.content);
        if (content.length) {
            input.push({
                type: 'message',
                role: role === 'assistant' ? 'assistant' : 'user',
                content: content.map((part) => (
                    role === 'assistant' && part.type === 'input_text'
                        ? { type: 'output_text', text: part.text }
                        : part
                ))
            });
        }
    }
    return {
        instructions: instructions.join('\n\n'),
        input
    };
}

function codexResponsesInputItems(items = [], nativeTools = []) {
    const nativeToolByName = new Map(
        (Array.isArray(nativeTools) ? nativeTools : [])
            .filter((tool) => tool?.type === 'function' && normalizeText(tool.name))
            .map((tool) => [tool.name, tool])
    );
    return responseItemsToWireItems(items).map((item) => {
        if (!item || typeof item !== 'object') {
            return item;
        }
        const sanitized = { ...item };
        if (normalizeText(sanitized.id)) {
            delete sanitized.id;
        }
        if (sanitized.type === 'tool_search_output' && Array.isArray(sanitized.tools)) {
            sanitized.tools = sanitized.tools
                .map((tool) => nativeToolByName.get(normalizeText(tool?.name || tool?.tool || tool?.id)))
                .filter(Boolean)
                .map((tool) => ({ ...tool }));
        }
        if (sanitized.type === 'web_search_call' && sanitized.action) {
            const actionType = normalizeText(sanitized.action.type);
            if (actionType === 'search') {
                sanitized.action = {
                    type: 'search',
                    query: normalizeText(sanitized.action.query)
                };
            } else if (actionType === 'open_page') {
                sanitized.action = {
                    type: 'open_page',
                    url: normalizeText(sanitized.action.url)
                };
            } else if (actionType === 'find_in_page') {
                sanitized.action = {
                    type: 'find_in_page',
                    url: normalizeText(sanitized.action.url),
                    pattern: normalizeText(sanitized.action.pattern)
                };
            }
        }
        return sanitized;
    });
}

function stableCodexPromptCacheKey(instructions = '', tools = []) {
    const digest = createHash('sha256')
        .update(String(instructions || ''))
        .update('\0')
        .update(JSON.stringify(codexNativeToolSpecs(tools)))
        .digest('hex');
    return `ailis-${digest.slice(0, 48)}`;
}

function buildCodexResponsesRequest(settings = {}, payload = {}, messages = []) {
    const tools = codexNativeToolSpecs(payload.tools);
    const directInput = Array.isArray(payload.input)
        ? codexResponsesInputItems(payload.input, tools)
        : null;
    const converted = directInput
        ? {
              instructions: normalizeText(payload.instructions),
              input: directInput
          }
        : chatMessagesToResponsesInput(messages);
    const reasoningEffort = normalizeText(
        payload.reasoning_effort ||
            payload.reasoningEffort ||
            payload.reasoning?.effort ||
            settings.reasoningEffort ||
            process.env.AILIS_CODEX_REASONING_EFFORT,
        DEFAULT_CODEX_REASONING_EFFORT
    ).toLowerCase();
    const request = {
        model: normalizeText(settings.model, DEFAULT_CODEX_MODEL),
        instructions: converted.instructions,
        input: converted.input,
        tools,
        tool_choice: codexNativeToolChoice(payload),
        parallel_tool_calls: payload.parallel_tool_calls !== false,
        reasoning: {
            effort: reasoningEffort,
            summary: normalizeText(payload.reasoning?.summary, 'auto')
        },
        store: false,
        stream: true,
        include: ['reasoning.encrypted_content'],
        prompt_cache_key: normalizeText(
            payload.prompt_cache_key || payload.promptCacheKey,
            stableCodexPromptCacheKey(converted.instructions, payload.tools)
        )
    };
    const maxOutputTokens = Number(
        payload.max_output_tokens ??
            payload.maxOutputTokens ??
            payload.max_tokens ??
            payload.maxTokens
    );
    if (Number.isFinite(maxOutputTokens) && maxOutputTokens > 0) {
        request.max_output_tokens = Math.max(1, Math.min(128000, Math.trunc(maxOutputTokens)));
    }
    return request;
}

function imageMimeTypeForPath(filePath = '') {
    const extension = path.extname(String(filePath || '')).toLowerCase();
    if (extension === '.jpg' || extension === '.jpeg') return 'image/jpeg';
    if (extension === '.webp') return 'image/webp';
    if (extension === '.gif') return 'image/gif';
    return 'image/png';
}

async function materializeCodexResponsesImage(source = '') {
    const normalized = normalizeText(source);
    if (!normalized || /^https?:\/\//i.test(normalized) || normalized.startsWith('data:')) {
        return normalized;
    }
    let filePath = normalized;
    if (filePath.startsWith('file://')) {
        filePath = decodeURIComponent(new URL(filePath).pathname.replace(/^\/([A-Za-z]:)/, '$1'));
    }
    filePath = path.resolve(filePath);
    const stat = await fsPromises.stat(filePath).catch(() => null);
    if (!stat?.isFile()) {
        throw new Error(`Codex bridge local image is missing: ${filePath}`);
    }
    if (stat.size > MAX_CODEX_BRIDGE_IMAGE_BYTES) {
        throw new Error(`Codex bridge local image exceeds the per-image limit: ${filePath}`);
    }
    const bytes = await fsPromises.readFile(filePath);
    return `data:${imageMimeTypeForPath(filePath)};base64,${bytes.toString('base64')}`;
}

async function materializeCodexResponsesImages(request = {}) {
    const nextRequest = JSON.parse(JSON.stringify(request));
    let imageCount = 0;
    let totalBytes = 0;
    const visitContentItems = async (items = []) => {
        for (const item of Array.isArray(items) ? items : []) {
            if (!item || typeof item !== 'object') {
                continue;
            }
            const source = normalizeText(item.image_url || item.imageUrl || item.url);
            if (item.type === 'input_image' && source) {
                imageCount += 1;
                if (imageCount > MAX_CODEX_BRIDGE_IMAGES) {
                    throw new Error(`Codex bridge image inputs exceed the ${MAX_CODEX_BRIDGE_IMAGES}-image limit.`);
                }
                const materialized = await materializeCodexResponsesImage(source);
                if (materialized.startsWith('data:')) {
                    const base64 = materialized.split(',', 2)[1] || '';
                    totalBytes += Math.ceil(base64.length * 0.75);
                    if (totalBytes > MAX_CODEX_BRIDGE_TOTAL_IMAGE_BYTES) {
                        throw new Error('Codex bridge image inputs exceed the total image limit.');
                    }
                }
                item.image_url = materialized;
                delete item.imageUrl;
                delete item.url;
            }
        }
    };
    for (const item of Array.isArray(nextRequest.input) ? nextRequest.input : []) {
        await visitContentItems(item?.content);
        if (
            (item?.type === 'function_call_output' || item?.type === 'custom_tool_call_output') &&
            Array.isArray(item.output)
        ) {
            await visitContentItems(item.output);
        }
    }
    return nextRequest;
}

function parseCodexResponsesSse(raw = '') {
    const events = [];
    const outputItems = [];
    let completedResponse = null;
    let failure = null;
    for (const line of String(raw || '').split(/\r?\n/)) {
        if (!line.startsWith('data:')) {
            continue;
        }
        const data = line.slice(5).trim();
        if (!data || data === '[DONE]') {
            continue;
        }
        let event;
        try {
            event = JSON.parse(data);
        } catch {
            continue;
        }
        events.push(event);
        if (event.type === 'response.output_item.done' && event.item) {
            outputItems.push(event.item);
        } else if (event.type === 'response.completed') {
            completedResponse = event.response || null;
        } else if (event.type === 'response.failed' || event.type === 'error') {
            failure = event.response?.error || event.error || event;
        }
    }
    if (!outputItems.length && Array.isArray(completedResponse?.output)) {
        outputItems.push(...completedResponse.output);
    }
    return {
        events,
        outputItems,
        usage: completedResponse?.usage || null,
        responseId: normalizeText(completedResponse?.id),
        failure
    };
}

function codexResponsesOutputText(items = []) {
    return (Array.isArray(items) ? items : [])
        .filter((item) => item?.type === 'message' && item?.role === 'assistant')
        .flatMap((item) => Array.isArray(item.content) ? item.content : [])
        .map((part) => normalizeText(part?.text || part?.content))
        .filter(Boolean)
        .join('\n')
        .trim();
}

function codexResponsesCanonicalItems(items = []) {
    return (Array.isArray(items) ? items : [])
        .filter((item) => ['reasoning', 'message', 'function_call'].includes(item?.type))
        .map((item) => JSON.parse(JSON.stringify(item)));
}

function toolInputAllowsEmptyObject(schema = {}) {
    if (!schema || typeof schema !== 'object' || Array.isArray(schema)) {
        return true;
    }
    if (Number(schema.minProperties) > 0) {
        return false;
    }
    if (Array.isArray(schema.required) && schema.required.length > 0) {
        return false;
    }
    if (Array.isArray(schema.allOf)) {
        return schema.allOf.every((entry) => toolInputAllowsEmptyObject(entry));
    }
    if (Array.isArray(schema.anyOf)) {
        return schema.anyOf.some((entry) => toolInputAllowsEmptyObject(entry));
    }
    if (Array.isArray(schema.oneOf)) {
        return schema.oneOf.filter((entry) => toolInputAllowsEmptyObject(entry)).length === 1;
    }
    return true;
}

const CODEX_OUTPUT_SCHEMA_SCALAR_KEYS = Object.freeze([
    'type', 'description', 'enum', 'const', 'format', 'minLength', 'maxLength',
    'pattern', 'minimum', 'maximum', 'exclusiveMinimum', 'exclusiveMaximum',
    'multipleOf', 'minItems', 'maxItems', 'uniqueItems'
]);

function nullableCodexOutputSchema(schema = {}) {
    if (schema?.type === 'null') {
        return schema;
    }
    const nullBranch = {
        type: 'null',
        description: 'Use null to omit this optional field. Prefer null unless the user supplied this exact field or a prior tool returned it for this call; runtime context and plausible defaults are not evidence.'
    };
    if (Array.isArray(schema?.anyOf)) {
        const {
            anyOf,
            ...shared
        } = schema;
        return {
            ...shared,
            anyOf: [...anyOf, nullBranch]
        };
    }
    return {
        anyOf: [schema, nullBranch]
    };
}

function inferCodexOutputSchemaType(schema = {}, fallbackType = 'string') {
    const explicitType = normalizeText(schema?.type);
    if (explicitType) {
        return explicitType;
    }
    const sample = schema?.const !== undefined
        ? schema.const
        : Array.isArray(schema?.enum)
        ? schema.enum.find((entry) => entry !== null && entry !== undefined)
        : undefined;
    if (Array.isArray(sample)) {
        return 'array';
    }
    if (sample && typeof sample === 'object') {
        return 'object';
    }
    if (Number.isInteger(sample)) {
        return 'integer';
    }
    if (typeof sample === 'number') {
        return 'number';
    }
    if (typeof sample === 'boolean') {
        return 'boolean';
    }
    if (typeof sample === 'string') {
        return 'string';
    }
    return fallbackType;
}

function fallbackCodexOutputSchema(type = 'string', description = '') {
    if (type === 'object') {
        return {
            type: 'object',
            ...(description ? { description } : {}),
            properties: {},
            required: [],
            additionalProperties: false
        };
    }
    if (type === 'array') {
        return {
            type: 'array',
            ...(description ? { description } : {}),
            items: { type: 'string' }
        };
    }
    return {
        type,
        ...(description ? { description } : {})
    };
}

function mergeCodexOutputObjectSchema(base = {}, branch = {}) {
    const {
        anyOf: _baseAnyOf,
        oneOf: _baseOneOf,
        ...baseSchema
    } = base;
    const {
        anyOf: _branchAnyOf,
        oneOf: _branchOneOf,
        ...branchSchema
    } = branch;
    return {
        ...baseSchema,
        ...branchSchema,
        type: 'object',
        properties: {
            ...(base.properties && typeof base.properties === 'object' ? base.properties : {}),
            ...(branch.properties && typeof branch.properties === 'object' ? branch.properties : {})
        },
        required: [...new Set([
            ...(Array.isArray(base.required) ? base.required : []),
            ...(Array.isArray(branch.required) ? branch.required : [])
        ])],
        additionalProperties: false
    };
}

function isRequiredOnlyObjectAlternative(branch = {}) {
    if (!branch || typeof branch !== 'object' || Array.isArray(branch)) {
        return false;
    }
    const semanticKeys = Object.keys(branch).filter((key) => !['required', 'description', 'title'].includes(key));
    return semanticKeys.length === 0 && Array.isArray(branch.required) && branch.required.length > 0;
}

function compileCodexOutputObjectSchema(schema = {}) {
    const properties = schema.properties && typeof schema.properties === 'object'
        ? schema.properties
        : {};
    const propertyEntries = Object.entries(properties);
    const propertyNames = propertyEntries.map(([name]) => name);
    const required = new Set(Array.isArray(schema.required) ? schema.required : []);
    const description = normalizeText(schema.description);
    const buildObject = (activeRequired = required) => ({
        type: 'object',
        ...(description ? { description } : {}),
        properties: Object.fromEntries(propertyEntries.map(([name, childSchema]) => {
            const compiled = compileCodexOutputSchema(childSchema);
            const mustHaveValue = activeRequired.has(name);
            return [name, mustHaveValue ? compiled : nullableCodexOutputSchema(compiled)];
        })),
        required: propertyNames,
        additionalProperties: false
    });
    const alternatives = Array.isArray(schema.anyOf)
        ? schema.anyOf
        : Array.isArray(schema.oneOf)
        ? schema.oneOf
        : [];
    if (alternatives.length) {
        if (alternatives.every(isRequiredOnlyObjectAlternative)) {
            return buildObject(required);
        }
        return {
            ...(description ? { description } : {}),
            anyOf: alternatives.map((branch) => compileCodexOutputObjectSchema(
                mergeCodexOutputObjectSchema(schema, branch)
            ))
        };
    }
    if (Number(schema.minProperties) > 0 && required.size === 0 && propertyNames.length > 0) {
        return {
            ...(description ? { description } : {}),
            anyOf: propertyNames.map((name) => buildObject(new Set([name])))
        };
    }
    return buildObject(required);
}

function compileCodexOutputSchema(schema = {}, options = {}) {
    const fallbackType = normalizeText(options.fallbackType, 'string');
    const allowUnknownScalar = options.allowUnknownScalar !== false;
    if (!schema || typeof schema !== 'object' || Array.isArray(schema)) {
        return fallbackCodexOutputSchema(fallbackType);
    }
    const description = normalizeText(schema.description);
    if (schema.type === 'object' || schema.properties) {
        return compileCodexOutputObjectSchema(schema);
    }
    const alternatives = Array.isArray(schema.anyOf)
        ? schema.anyOf
        : Array.isArray(schema.oneOf)
        ? schema.oneOf
        : null;
    if (alternatives) {
        return {
            ...(description ? { description } : {}),
            anyOf: alternatives.map((entry) => compileCodexOutputSchema(entry, { fallbackType }))
        };
    }
    if (schema.type === 'array' || schema.items) {
        const compiled = {};
        for (const key of CODEX_OUTPUT_SCHEMA_SCALAR_KEYS) {
            if (schema[key] !== undefined) {
                compiled[key] = schema[key];
            }
        }
        compiled.type = 'array';
        compiled.items = compileCodexOutputSchema(schema.items, {
            fallbackType: 'string',
            allowUnknownScalar: false
        });
        return compiled;
    }
    const hasExplicitScalarSignal = Boolean(
        normalizeText(schema.type) ||
        schema.const !== undefined ||
        (Array.isArray(schema.enum) && schema.enum.some((entry) => entry !== null && entry !== undefined)) ||
        schema.format ||
        schema.pattern ||
        schema.minLength !== undefined ||
        schema.maxLength !== undefined ||
        schema.minimum !== undefined ||
        schema.maximum !== undefined
    );
    if (!hasExplicitScalarSignal && allowUnknownScalar) {
        return {
            ...(description ? { description } : {}),
            anyOf: [
                { type: 'string' },
                { type: 'number' },
                { type: 'boolean' }
            ]
        };
    }
    const compiled = Object.fromEntries(CODEX_OUTPUT_SCHEMA_SCALAR_KEYS
        .filter((key) => schema[key] !== undefined)
        .map((key) => [key, schema[key]]));
    if (!compiled.type) {
        compiled.type = inferCodexOutputSchemaType(schema, fallbackType);
    }
    if (description) {
        compiled.description = description;
    }
    return compiled;
}

function stripNullishObjectValues(value) {
    if (Array.isArray(value)) {
        return value
            .map(stripNullishObjectValues)
            .filter((entry) => entry !== null && entry !== undefined);
    }
    if (!value || typeof value !== 'object') {
        return value;
    }
    return Object.fromEntries(Object.entries(value)
        .map(([key, entry]) => [key, stripNullishObjectValues(entry)])
        .filter(([, entry]) => {
            if (entry === null || entry === undefined) {
                return false;
            }
            if (Array.isArray(entry)) {
                return entry.length > 0;
            }
            if (typeof entry === 'object') {
                return Object.keys(entry).length > 0;
            }
            return true;
        }));
}

function buildCodexBridgeToolCallSchema(tool = {}) {
    const parameters = tool.parameters && typeof tool.parameters === 'object'
        ? tool.parameters
        : { type: 'object', properties: {} };
    const allowsEmptyObject = toolInputAllowsEmptyObject(parameters);
    return {
        type: 'object',
        properties: {
            id: { type: 'string' },
            name: {
                type: 'string',
                enum: [tool.name]
            },
            arguments: {
                ...compileCodexOutputSchema(parameters, { fallbackType: 'object' }),
                description: [
                    normalizeText(parameters.description),
                    `AILIS input object for ${tool.name}.`,
                    allowsEmptyObject
                        ? 'An empty object is allowed by this tool contract.'
                        : 'Supply the required non-empty input; do not emit an empty object.'
                ].filter(Boolean).join(' ')
            }
        },
        required: ['id', 'name', 'arguments'],
        additionalProperties: false
    };
}

function buildCodexBridgeDecisionSchema(tools = [], payload = {}) {
    const normalizedTools = normalizeToolSpecs(tools);
    const choice = resolveToolChoice(payload);
    const allowedTools = choice.name
        ? normalizedTools.filter((tool) => tool.name === choice.name)
        : normalizedTools;
    const toolCalls = {
        type: 'array',
        items: allowedTools.length
            ? allowedTools.length === 1
                ? buildCodexBridgeToolCallSchema(allowedTools[0])
                : { anyOf: allowedTools.map(buildCodexBridgeToolCallSchema) }
            : {
                  type: 'object',
                  properties: {},
                  additionalProperties: false
              },
        maxItems: allowedTools.length ? 8 : 0
    };
    if (allowedTools.length && (choice.mode === 'required' || Boolean(choice.name))) {
        toolCalls.minItems = 1;
    }
    if (choice.mode === 'none') {
        toolCalls.maxItems = 0;
    }
    return {
        type: 'object',
        properties: {
            content: { type: 'string' },
            finish_reason: {
                type: 'string',
                enum: ['stop', 'tool_calls']
            },
            tool_calls: toolCalls
        },
        required: ['content', 'finish_reason', 'tool_calls'],
        additionalProperties: false
    };
}

function buildCodexBridgePrompt(messages = [], tools = [], payload = {}) {
    const normalizedTools = normalizeToolSpecs(tools);
    const choice = resolveToolChoice(payload);
    const modelInput = (Array.isArray(messages) ? messages : []).map((message, index) => ({
        index,
        role: normalizeText(message?.role, 'user'),
        content: sanitizeCodexBridgeMessageContent(message?.content ?? ''),
        ...(message?.toolCallId || message?.tool_call_id
            ? { tool_call_id: message.toolCallId || message.tool_call_id }
            : {}),
        ...(Array.isArray(message?.toolCalls || message?.tool_calls)
            ? { tool_calls: message.toolCalls || message.tool_calls }
            : {})
    }));
    return [
        'You are the stateless model backend for the AILIS agent harness.',
        'Perform exactly one model inference over the supplied messages and visible tool contracts.',
        'AILIS, not Codex, owns context, memory, tool execution, retries, evidence, and finalization.',
        'Do not call or simulate any Codex tool. Do not inspect files, browse, run commands, plan extra work, or continue the task yourself.',
        'Choose the next assistant response only. The final response must satisfy the provided JSON Schema.',
        'When selecting a tool, emit it in tool_calls, put its input object in arguments, and leave execution to AILIS.',
        'The arguments object must satisfy the selected tool contract. Never emit an empty object unless that tool schema explicitly permits it.',
        'For optional argument fields, use null unless the user supplied that exact field or a prior tool returned it for this call. Do not fill optional fields from runtime dates, plausible defaults, or inferred context.',
        'For user-supplied names, titles, labels, and identifiers, copy the exact literal text into the first lookup. Do not expand, canonicalize, or append words unless a prior tool result or a visible enum authorizes the changed value.',
        'When no tool is needed, return finish_reason="stop" and put the assistant response in content.',
        '',
        `AILIS bridge protocol version: ${CODEX_BRIDGE_PROTOCOL_VERSION}`,
        `Tool choice: ${JSON.stringify(choice)}`,
        `Visible tools: ${JSON.stringify(normalizedTools)}`,
        `Model messages: ${JSON.stringify(modelInput)}`
    ].join('\n');
}

function parseCodexJsonlEvents(stdout = '') {
    const events = [];
    const contamination = [];
    let usage = null;
    for (const line of String(stdout || '').split(/\r?\n/)) {
        const trimmed = line.trim();
        if (!trimmed) {
            continue;
        }
        let event;
        try {
            event = JSON.parse(trimmed);
        } catch {
            continue;
        }
        events.push(event);
        if (event?.usage && typeof event.usage === 'object') {
            usage = event.usage;
        }
        const item = event?.item && typeof event.item === 'object' ? event.item : null;
        const itemType = normalizeText(item?.type).toLowerCase();
        if (itemType && !['reasoning', 'agent_message'].includes(itemType)) {
            contamination.push({
                eventType: normalizeText(event?.type),
                itemType,
                itemId: normalizeText(item?.id)
            });
        }
    }
    return { events, contamination, usage };
}

function parseCodexAppServerNotifications(notifications = [], serverRequests = []) {
    const items = [];
    const contamination = [];
    const transportErrors = [];
    let usage = null;
    for (const message of Array.isArray(notifications) ? notifications : []) {
        const method = normalizeText(message?.method);
        const params = message?.params || {};
        if (method === 'thread/tokenUsage/updated' && params.tokenUsage?.last) {
            usage = params.tokenUsage.last;
        }
        if (method === 'error') {
            transportErrors.push({
                message: normalizeText(params.error?.message),
                willRetry: params.willRetry === true
            });
            continue;
        }
        if (method !== 'item/completed') {
            continue;
        }
        const item = params.item && typeof params.item === 'object' ? params.item : null;
        const itemType = normalizeText(item?.type);
        if (!itemType) {
            continue;
        }
        items.push(item);
        if (!['userMessage', 'reasoning', 'agentMessage'].includes(itemType)) {
            contamination.push({
                method,
                itemType,
                itemId: normalizeText(item?.id)
            });
        }
    }
    for (const request of Array.isArray(serverRequests) ? serverRequests : []) {
        contamination.push({
            method: normalizeText(request?.method),
            requestId: request?.id ?? null,
            itemType: 'server_request'
        });
    }
    const agentMessages = items
        .filter((item) => item.type === 'agentMessage')
        .map((item) => normalizeText(item.text))
        .filter(Boolean);
    return {
        items,
        contamination,
        transportErrors,
        usage,
        agentText: agentMessages.at(-1) || ''
    };
}

function normalizeCodexUsage(usage = null) {
    if (!usage || typeof usage !== 'object') {
        return null;
    }
    const inputTokens = Number(usage.inputTokens ?? usage.input_tokens) || 0;
    const outputTokens = Number(usage.outputTokens ?? usage.output_tokens) || 0;
    const totalTokens = Number(usage.totalTokens ?? usage.total_tokens) || inputTokens + outputTokens;
    const cachedTokens = Number(usage.cachedInputTokens ?? usage.cached_input_tokens) || 0;
    const reasoningTokens = Number(usage.reasoningOutputTokens ?? usage.reasoning_output_tokens) || 0;
    return {
        prompt_tokens: inputTokens,
        completion_tokens: outputTokens,
        total_tokens: totalTokens,
        prompt_tokens_details: {
            cached_tokens: cachedTokens
        },
        completion_tokens_details: {
            reasoning_tokens: reasoningTokens
        }
    };
}

function normalizeProxyUrl(value = '') {
    const normalized = normalizeText(value);
    if (!normalized) {
        return '';
    }
    const withProtocol = /^[a-z][a-z0-9+.-]*:\/\//i.test(normalized)
        ? normalized
        : `http://${normalized}`;
    try {
        const proxy = new URL(withProtocol);
        return ['http:', 'https:'].includes(proxy.protocol) ? proxy.toString() : '';
    } catch {
        return '';
    }
}

function parseWindowsProxyServer(value = '') {
    const normalized = normalizeText(value);
    if (!normalized) {
        return '';
    }
    if (!normalized.includes('=')) {
        return normalizeProxyUrl(normalized);
    }
    const entries = Object.fromEntries(
        normalized.split(';')
            .map((entry) => entry.split('=', 2))
            .filter(([name, target]) => normalizeText(name) && normalizeText(target))
            .map(([name, target]) => [normalizeText(name).toLowerCase(), normalizeText(target)])
    );
    return normalizeProxyUrl(entries.https || entries.http || '');
}

function resolveWindowsSystemProxy(spawnSyncImpl = spawnSync) {
    if (process.platform !== 'win32') {
        return '';
    }
    try {
        const result = spawnSyncImpl(
            'reg.exe',
            ['query', 'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings'],
            {
                encoding: 'utf8',
                windowsHide: true,
                timeout: 5000
            }
        );
        const output = String(result?.stdout || '');
        const enabledMatch = output.match(/^\s*ProxyEnable\s+REG_DWORD\s+0x([0-9a-f]+)\s*$/im);
        if (!enabledMatch || Number.parseInt(enabledMatch[1], 16) !== 1) {
            return '';
        }
        const serverMatch = output.match(/^\s*ProxyServer\s+REG_SZ\s+(.+?)\s*$/im);
        return parseWindowsProxyServer(serverMatch?.[1] || '');
    } catch {
        return '';
    }
}

function resolveCodexProxyUrl(settings = {}) {
    const explicit = normalizeProxyUrl(
        settings.proxyUrl ||
            settings.proxyURL ||
            settings.httpsProxy ||
            settings.proxy ||
            process.env.HTTPS_PROXY ||
            process.env.https_proxy ||
            process.env.ALL_PROXY ||
            process.env.all_proxy ||
            process.env.HTTP_PROXY ||
            process.env.http_proxy
    );
    return explicit || resolveWindowsSystemProxy();
}

function proxyAuthorizationHeader(proxyUrl) {
    if (!proxyUrl?.username) {
        return '';
    }
    const credentials = `${decodeURIComponent(proxyUrl.username)}:${decodeURIComponent(proxyUrl.password || '')}`;
    return `Basic ${Buffer.from(credentials).toString('base64')}`;
}

function connectCodexProxy(proxyUrl, targetHost, targetPort, timeoutMs) {
    return new Promise((resolve, reject) => {
        const proxy = new URL(proxyUrl);
        const requestModule = proxy.protocol === 'https:' ? https : http;
        const headers = {
            Host: `${targetHost}:${targetPort}`
        };
        const proxyAuthorization = proxyAuthorizationHeader(proxy);
        if (proxyAuthorization) {
            headers['Proxy-Authorization'] = proxyAuthorization;
        }
        const request = requestModule.request({
            host: proxy.hostname,
            port: Number(proxy.port) || (proxy.protocol === 'https:' ? 443 : 80),
            method: 'CONNECT',
            path: `${targetHost}:${targetPort}`,
            headers,
            rejectUnauthorized: true
        });
        request.setTimeout(timeoutMs, () => {
            request.destroy(new Error(`Codex proxy CONNECT timed out after ${timeoutMs}ms.`));
        });
        request.once('connect', (response, socket, head) => {
            if (response.statusCode !== 200) {
                socket.destroy();
                reject(new Error(`Codex proxy CONNECT failed with status ${response.statusCode}.`));
                return;
            }
            if (head?.length) {
                socket.unshift(head);
            }
            const secureSocket = tls.connect({
                socket,
                servername: targetHost
            });
            secureSocket.once('secureConnect', () => resolve(secureSocket));
            secureSocket.once('error', reject);
        });
        request.once('error', reject);
        request.end();
    });
}

async function createCodexResponsesAgent(settings = {}, timeoutMs = 120000) {
    const proxyUrl = resolveCodexProxyUrl(settings);
    if (!proxyUrl) {
        return {
            agent: new https.Agent({ keepAlive: false }),
            proxy: ''
        };
    }
    const endpoint = new URL(CODEX_CHATGPT_BACKEND_URL);
    const socket = await connectCodexProxy(proxyUrl, endpoint.hostname, 443, timeoutMs);
    const agent = new https.Agent({ keepAlive: false });
    agent.createConnection = () => socket;
    return {
        agent,
        proxy: proxyUrl
    };
}

async function resolveCodexAuthSnapshot(settings = {}) {
    const codexHome = normalizeText(
        settings.codexHome ||
            process.env.CODEX_HOME ||
            (process.env.USERPROFILE ? path.join(process.env.USERPROFILE, '.codex') : '')
    );
    const authPath = codexHome ? path.join(codexHome, 'auth.json') : '';
    if (!authPath) {
        return {
            ok: false,
            code: 'codex_auth_required',
            error: 'Codex ChatGPT OAuth credentials were not found.'
        };
    }
    let auth;
    try {
        auth = JSON.parse(await fsPromises.readFile(authPath, 'utf8'));
    } catch {
        return {
            ok: false,
            code: 'codex_auth_required',
            error: 'Codex ChatGPT OAuth credentials were not found in CODEX_HOME/auth.json.'
        };
    }
    const accessToken = normalizeText(auth?.tokens?.access_token);
    const accountId = normalizeText(auth?.tokens?.account_id);
    if (!accessToken || !accountId) {
        return {
            ok: false,
            code: 'codex_auth_required',
            error: 'Codex ChatGPT OAuth credentials are incomplete.'
        };
    }
    return {
        ok: true,
        accessToken,
        accountId,
        codexHome,
        authPath
    };
}

function runCodexResponsesInference(settings = {}, auth = {}, requestBody = {}, {
    timeoutMs = 120000,
    signal = null,
    createAgent = createCodexResponsesAgent,
    requestImpl = https.request
} = {}) {
    const effectiveTimeoutMs = Math.max(1, Number(timeoutMs) || 120000);
    return new Promise((resolve) => {
        let agentInfo = null;
        let settled = false;
        let clientRequest = null;
        let hardTimeout = null;
        const finish = (result) => {
            if (settled) {
                return;
            }
            settled = true;
            clearTimeout(hardTimeout);
            if (typeof signal?.removeEventListener === 'function') {
                signal.removeEventListener('abort', onAbort);
            }
            agentInfo?.agent?.destroy?.();
            resolve({
                ...result,
                proxyUsed: Boolean(agentInfo?.proxy)
            });
        };
        const onAbort = () => {
            clientRequest?.destroy(new Error('Codex model request was aborted.'));
            finish({
                ok: false,
                code: 'aborted',
                error: 'Codex model request was aborted.'
            });
        };
        const onHardTimeout = () => {
            const error = new Error(
                `Codex model request exceeded the absolute deadline of ${effectiveTimeoutMs}ms.`
            );
            clientRequest?.destroy(error);
            finish({
                ok: false,
                code: 'timeout',
                error: error.message
            });
        };
        hardTimeout = setTimeout(onHardTimeout, effectiveTimeoutMs);
        if (signal?.aborted) {
            onAbort();
            return;
        }
        if (typeof signal?.addEventListener === 'function') {
            signal.addEventListener('abort', onAbort, { once: true });
        }
        (async () => {
            try {
                agentInfo = await createAgent(settings, effectiveTimeoutMs);
            } catch (error) {
                finish({
                    ok: false,
                    code: 'codex_network_error',
                    error: error?.message || String(error)
                });
                return;
            }
            if (settled) {
                agentInfo?.agent?.destroy?.();
                return;
            }
            const body = JSON.stringify(requestBody);
            const endpoint = new URL(CODEX_CHATGPT_BACKEND_URL);
            clientRequest = requestImpl({
                host: endpoint.hostname,
                port: 443,
                path: CODEX_RESPONSES_PATH,
                method: 'POST',
                agent: agentInfo.agent,
                headers: {
                    Authorization: `Bearer ${auth.accessToken}`,
                    'ChatGPT-Account-Id': auth.accountId,
                    'Content-Type': 'application/json',
                    Accept: 'text/event-stream',
                    'User-Agent': 'codex_cli_rs/ailis-model-bridge',
                    'x-client-request-id': randomUUID(),
                    'Content-Length': Buffer.byteLength(body)
                }
            }, (response) => {
                let raw = '';
                response.setEncoding('utf8');
                response.on('data', (chunk) => {
                    raw += chunk;
                    if (Buffer.byteLength(raw) > CODEX_RESPONSES_MAX_BYTES) {
                        clientRequest.destroy(new Error('Codex Responses stream exceeded the bridge size limit.'));
                    }
                });
                response.on('end', () => {
                    const status = Number(response.statusCode) || 0;
                    if (status < 200 || status >= 300) {
                        let message = '';
                        try {
                            const parsed = JSON.parse(raw);
                            message = normalizeText(parsed?.error?.message || parsed?.message);
                        } catch {}
                        const authFailure = status === 401 || status === 403;
                        const usageFailure = status === 429;
                        finish({
                            ok: false,
                            code: authFailure
                                ? 'codex_auth_required'
                                : usageFailure
                                    ? 'codex_usage_limited'
                                    : status >= 500
                                        ? 'codex_server_error'
                                        : 'codex_responses_error',
                            status,
                            error: message || `Codex Responses request failed with status ${status}.`
                        });
                        return;
                    }
                    const parsed = parseCodexResponsesSse(raw);
                    if (parsed.failure) {
                        finish({
                            ok: false,
                            code: 'codex_responses_failed',
                            error: normalizeText(
                                parsed.failure?.message,
                                'Codex Responses stream reported a failed response.'
                            ),
                            details: parsed.failure
                        });
                        return;
                    }
                    finish({
                        ok: true,
                        ...parsed
                    });
                });
            });
            clientRequest.setTimeout(effectiveTimeoutMs, () => {
                clientRequest.destroy(
                    new Error(`Codex model request was idle for ${effectiveTimeoutMs}ms.`)
                );
            });
            clientRequest.once('error', (error) => {
                if (settled) {
                    return;
                }
                const aborted = signal?.aborted || /aborted/i.test(error?.message || '');
                finish({
                    ok: false,
                    code: aborted
                        ? 'aborted'
                        : /timed out|timeout|deadline|idle/i.test(error?.message || '')
                            ? 'timeout'
                            : 'codex_network_error',
                    error: error?.message || String(error)
                });
            });
            clientRequest.end(body);
        })().catch((error) => finish({
            ok: false,
            code: 'codex_network_error',
            error: error?.message || String(error)
        }));
    });
}

function resolveCodexEntrypoint(settings = {}) {
    const explicit = normalizeText(
        settings.codexEntrypoint ||
            process.env.AILIS_CODEX_ENTRYPOINT ||
            process.env.CODEX_JS_ENTRYPOINT
    );
    const appData = normalizeText(process.env.APPDATA);
    const candidates = [
        explicit,
        appData ? path.join(appData, CODEX_ENTRYPOINT_RELATIVE_PATH) : ''
    ].filter(Boolean);
    const entrypoint = candidates.find((candidate) => fs.existsSync(candidate));
    if (!entrypoint) {
        return {
            ok: false,
            code: 'codex_not_found',
            error: 'Codex CLI JavaScript entrypoint was not found. Install @openai/codex or set AILIS_CODEX_ENTRYPOINT.'
        };
    }
    return {
        ok: true,
        command: process.execPath,
        argsPrefix: [entrypoint],
        entrypoint
    };
}

async function prepareIsolatedCodexHome(tempRoot, settings = {}) {
    const sourceHome = normalizeText(
        settings.codexHome ||
            process.env.CODEX_HOME ||
            (process.env.USERPROFILE ? path.join(process.env.USERPROFILE, '.codex') : '')
    );
    const sourceAuthPath = sourceHome ? path.join(sourceHome, 'auth.json') : '';
    if (!sourceAuthPath || !fs.existsSync(sourceAuthPath)) {
        return {
            ok: false,
            code: 'codex_auth_required',
            error: 'Codex ChatGPT OAuth credentials were not found in CODEX_HOME/auth.json.'
        };
    }
    const isolatedHome = path.join(tempRoot, 'codex-home');
    await fsPromises.mkdir(isolatedHome, { recursive: true });
    await fsPromises.copyFile(sourceAuthPath, path.join(isolatedHome, 'auth.json'));
    return {
        ok: true,
        codexHome: isolatedHome,
        sourceHome
    };
}

function classifyCodexFailure(stderr = '', exitCode = null) {
    const rawText = normalizeText(stderr);
    const text = rawText.toLowerCase();
    if (/not logged in|login required|authentication|unauthorized/.test(text)) {
        return { code: 'codex_auth_required', error: 'Codex is not logged in with ChatGPT.' };
    }
    if (/rate.?limit|usage.?limit|quota|credits?/.test(text)) {
        return { code: 'codex_usage_limited', error: 'Codex usage or rate limit was reached.' };
    }
    const diagnostic = rawText.length > 5000
        ? `${rawText.slice(0, 800)}\n... [stderr middle omitted] ...\n${rawText.slice(-4000)}`
        : rawText;
    return {
        code: 'codex_process_failed',
        error: normalizeText(diagnostic, `Codex exited with code ${exitCode ?? 'unknown'}.`),
        details: {
            exitCode,
            stderrTail: rawText.slice(-2000)
        }
    };
}

function buildCodexAppServerArgs(launch) {
    return [
        ...launch.argsPrefix,
        'app-server',
        '--stdio',
        '-c',
        `model_provider="${CODEX_HTTP_MODEL_PROVIDER}"`,
        '-c',
        `model_providers.${CODEX_HTTP_MODEL_PROVIDER}.name="AILIS ChatGPT OAuth HTTPS"`,
        '-c',
        `model_providers.${CODEX_HTTP_MODEL_PROVIDER}.base_url="${CODEX_CHATGPT_BACKEND_URL}"`,
        '-c',
        `model_providers.${CODEX_HTTP_MODEL_PROVIDER}.wire_api="responses"`,
        '-c',
        `model_providers.${CODEX_HTTP_MODEL_PROVIDER}.requires_openai_auth=true`,
        '-c',
        `model_providers.${CODEX_HTTP_MODEL_PROVIDER}.supports_websockets=false`,
        '-c',
        'web_search="disabled"',
        '-c',
        'mcp_servers={}',
        '--disable',
        'shell_tool',
        '--disable',
        'shell_snapshot',
        '--disable',
        'browser_use',
        '--disable',
        'in_app_browser',
        '--disable',
        'computer_use',
        '--disable',
        'apps',
        '--disable',
        'plugins',
        '--disable',
        'image_generation',
        '--disable',
        'goals',
        '--disable',
        'multi_agent',
        '--disable',
        'workspace_dependencies'
    ];
}

function buildProcessTreeTerminationPlan(pid, platform = process.platform) {
    const normalizedPid = Math.trunc(Number(pid));
    if (!Number.isFinite(normalizedPid) || normalizedPid <= 0) {
        return null;
    }
    if (platform === 'win32') {
        return {
            command: 'taskkill.exe',
            args: ['/pid', String(normalizedPid), '/t', '/f']
        };
    }
    return {
        signalPid: -normalizedPid,
        signal: 'SIGTERM'
    };
}

function terminateChildProcessTree(child, {
    platform = process.platform,
    spawnImpl = spawn
} = {}) {
    if (!child) {
        return false;
    }
    const fallback = () => {
        try {
            child.kill();
        } catch {}
    };
    const plan = buildProcessTreeTerminationPlan(child.pid, platform);
    if (!plan) {
        fallback();
        return false;
    }
    if (platform !== 'win32') {
        try {
            process.kill(plan.signalPid, plan.signal);
            return true;
        } catch {
            fallback();
            return false;
        }
    }
    try {
        const killer = spawnImpl(plan.command, plan.args, {
            windowsHide: true,
            stdio: 'ignore'
        });
        killer.once?.('error', fallback);
        killer.once?.('close', (exitCode) => {
            if (exitCode !== 0 && child.exitCode === null) {
                fallback();
            }
        });
        return true;
    } catch {
        fallback();
        return false;
    }
}

function runCodexAppServerInference(command, args, {
    cwd,
    codexHome,
    model,
    reasoningEffort,
    prompt,
    input,
    outputSchema,
    timeoutMs,
    signal
} = {}) {
    return new Promise((resolve) => {
        let child;
        try {
            child = spawn(command, args, {
                cwd,
                env: { ...process.env, CODEX_HOME: codexHome },
                windowsHide: true,
                detached: process.platform !== 'win32',
                stdio: ['pipe', 'pipe', 'pipe']
            });
        } catch (error) {
            resolve({
                ok: false,
                code: 'codex_spawn_failed',
                error: error?.message || String(error),
                stdout: '',
                stderr: ''
            });
            return;
        }

        let settled = false;
        let nextRequestId = 1;
        let stdout = '';
        let stderr = '';
        let lineBuffer = '';
        let activeThreadId = '';
        let activeTurnId = '';
        let threadStartResult = null;
        let resolved = false;
        const pendingRequests = new Map();
        const notifications = [];
        const serverRequests = [];

        const stop = () => {
            terminateChildProcessTree(child);
        };
        let timeout = null;
        const finish = (result) => {
            if (settled) {
                return;
            }
            settled = true;
            clearTimeout(timeout);
            if (typeof signal?.removeEventListener === 'function') {
                signal.removeEventListener('abort', onAbort);
            }
            const pendingError = new Error(
                result?.error || 'Codex app-server request finished before the pending RPC completed.'
            );
            for (const pending of pendingRequests.values()) {
                pending.reject(pendingError);
            }
            pendingRequests.clear();
            stop();
            const value = {
                ...result,
                stdout,
                stderr,
                notifications,
                serverRequests,
                threadStartResult
            };
            const resolveAfterClose = () => {
                if (resolved) {
                    return;
                }
                resolved = true;
                resolve(value);
            };
            if (child.exitCode !== null) {
                resolveAfterClose();
                return;
            }
            child.once('close', resolveAfterClose);
            setTimeout(resolveAfterClose, 5000).unref?.();
        };
        const onAbort = () => finish({
            ok: false,
            code: 'aborted',
            error: 'Codex model request was aborted.'
        });
        const send = (message) => {
            if (!settled && child.stdin.writable) {
                child.stdin.write(`${JSON.stringify(message)}\n`, 'utf8');
            }
        };
        const request = (method, params) => new Promise((requestResolve, requestReject) => {
            const id = nextRequestId++;
            pendingRequests.set(id, { resolve: requestResolve, reject: requestReject, method });
            send({ method, id, params });
        });
        const handleMessage = (message) => {
            if (message?.id !== undefined && !message?.method && pendingRequests.has(message.id)) {
                const pending = pendingRequests.get(message.id);
                pendingRequests.delete(message.id);
                if (message.error) {
                    const error = new Error(normalizeText(message.error?.message, `${pending.method} failed`));
                    error.code = message.error?.code;
                    error.data = message.error?.data;
                    pending.reject(error);
                } else {
                    pending.resolve(message.result);
                }
                return;
            }
            if (message?.id !== undefined && message?.method) {
                serverRequests.push(message);
                send({
                    id: message.id,
                    error: {
                        code: -32601,
                        message: 'AILIS model bridge does not expose Codex-side tools or callbacks.'
                    }
                });
                return;
            }
            if (!message?.method) {
                return;
            }
            notifications.push(message);
            if (message.method === 'turn/started' && message.params?.threadId === activeThreadId) {
                activeTurnId = normalizeText(message.params?.turn?.id);
            }
            if (message.method !== 'turn/completed' || message.params?.threadId !== activeThreadId) {
                return;
            }
            const completedTurn = message.params?.turn || {};
            const completedTurnId = normalizeText(completedTurn.id);
            if (activeTurnId && completedTurnId && completedTurnId !== activeTurnId) {
                return;
            }
            if (completedTurn.status !== 'completed') {
                finish({
                    ok: false,
                    code: 'codex_turn_failed',
                    error: normalizeText(
                        completedTurn.error?.message,
                        `Codex app-server turn ended with status ${completedTurn.status || 'unknown'}.`
                    ),
                    turn: completedTurn
                });
                return;
            }
            finish({ ok: true, turn: completedTurn });
        };
        const consumeLines = (chunk) => {
            stdout += chunk;
            lineBuffer += chunk;
            let newlineIndex = lineBuffer.indexOf('\n');
            while (newlineIndex >= 0) {
                const line = lineBuffer.slice(0, newlineIndex).trim();
                lineBuffer = lineBuffer.slice(newlineIndex + 1);
                if (line) {
                    try {
                        handleMessage(JSON.parse(line));
                    } catch {}
                }
                newlineIndex = lineBuffer.indexOf('\n');
            }
        };

        child.stdout.setEncoding('utf8');
        child.stderr.setEncoding('utf8');
        child.stdout.on('data', consumeLines);
        child.stderr.on('data', (chunk) => {
            stderr += chunk;
        });
        child.on('error', (error) => finish({
            ok: false,
            code: 'codex_spawn_failed',
            error: error?.message || String(error)
        }));
        child.on('close', (exitCode) => {
            if (!settled) {
                finish({
                    ok: false,
                    code: 'codex_app_server_exited',
                    error: `Codex app-server exited before completing the inference (code ${exitCode ?? 'unknown'}).`,
                    exitCode
                });
            }
        });

        timeout = setTimeout(() => finish({
            ok: false,
            code: 'timeout',
            error: `Codex model request timed out after ${timeoutMs}ms.`
        }), Math.max(5000, Number(timeoutMs) || 120000));
        if (signal?.aborted) {
            onAbort();
            return;
        }
        if (typeof signal?.addEventListener === 'function') {
            signal.addEventListener('abort', onAbort, { once: true });
        }

        (async () => {
            await request('initialize', {
                clientInfo: {
                    name: 'ailis-model-bridge',
                    title: 'AILIS Model Bridge',
                    version: String(CODEX_BRIDGE_PROTOCOL_VERSION)
                },
                capabilities: {
                    experimentalApi: true,
                    requestAttestation: false,
                    mcpServerOpenaiFormElicitation: false,
                    optOutNotificationMethods: []
                }
            });
            send({ method: 'initialized' });
            threadStartResult = await request('thread/start', {
                model,
                modelProvider: CODEX_HTTP_MODEL_PROVIDER,
                cwd,
                runtimeWorkspaceRoots: [cwd],
                approvalPolicy: 'never',
                sandbox: 'read-only',
                config: {
                    web_search: 'disabled',
                    mcp_servers: {}
                },
                baseInstructions: CODEX_APP_SERVER_BASE_INSTRUCTIONS,
                developerInstructions: CODEX_APP_SERVER_DEVELOPER_INSTRUCTIONS,
                ephemeral: true,
                environments: [],
                dynamicTools: [],
                selectedCapabilityRoots: [],
                experimentalRawEvents: false
            });
            activeThreadId = normalizeText(threadStartResult?.thread?.id);
            if (!activeThreadId) {
                throw new Error('Codex app-server did not return a thread id.');
            }
            await request('turn/start', {
                threadId: activeThreadId,
                input: Array.isArray(input) && input.length
                    ? input
                    : [{ type: 'text', text: prompt, text_elements: [] }],
                cwd,
                runtimeWorkspaceRoots: [cwd],
                approvalPolicy: 'never',
                model,
                effort: reasoningEffort,
                summary: 'none',
                outputSchema,
                environments: []
            });
        })().catch((error) => finish({
            ok: false,
            code: 'codex_app_server_protocol_error',
            error: error?.message || String(error),
            details: {
                rpcCode: error?.code,
                rpcData: error?.data
            }
        }));
    });
}

function isPathInside(candidatePath = '', rootPath = '') {
    const candidate = normalizeText(candidatePath);
    const root = normalizeText(rootPath);
    if (!candidate || !root || !path.isAbsolute(candidate) || !path.isAbsolute(root)) {
        return false;
    }
    const relative = path.relative(path.resolve(root), path.resolve(candidate));
    return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
}

function normalizeBridgeToolCalls(toolCalls = [], options = {}) {
    const ephemeralWorkspace = normalizeText(options.ephemeralWorkspace);
    return (Array.isArray(toolCalls) ? toolCalls : []).map((call, index) => {
        const rawArgs = call?.arguments_json ?? call?.arguments ?? '{}';
        let args = {};
        if (rawArgs && typeof rawArgs === 'object') {
            args = rawArgs;
        } else if (typeof rawArgs === 'string') {
            try {
                const parsed = JSON.parse(rawArgs);
                args = parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
            } catch {}
        }
        args = stripNullishObjectValues(args);
        for (const key of ['workdir', 'cwd']) {
            if (ephemeralWorkspace && isPathInside(args[key], ephemeralWorkspace)) {
                delete args[key];
            }
        }
        return {
            id: normalizeText(call?.id, `codex_bridge_call_${index + 1}`),
            type: 'function',
            name: normalizeText(call?.name),
            arguments: args,
            rawArguments: JSON.stringify(args),
            provider: CODEX_MODEL_BRIDGE_PROVIDER
        };
    }).filter((call) => call.name);
}

async function callCodexAppServerBridgeOnce(settings = {}, payload = {}, messages = []) {
    const launch = resolveCodexEntrypoint(settings);
    if (!launch.ok) {
        return launch;
    }
    if (!Array.isArray(messages) || !messages.length) {
        return { ok: false, code: 'empty_messages', error: 'AILIS model messages are empty.' };
    }
    const model = normalizeText(settings.model, DEFAULT_CODEX_MODEL);
    const reasoningEffort = normalizeText(
        settings.reasoningEffort || process.env.AILIS_CODEX_REASONING_EFFORT,
        DEFAULT_CODEX_REASONING_EFFORT
    ).toLowerCase();
    const timeoutMs = Math.max(5000, Number(settings.timeoutMs) || 120000);
    const tempRoot = await fsPromises.mkdtemp(path.join(os.tmpdir(), 'ailis-codex-model-bridge-'));
    const workspace = path.join(tempRoot, 'workspace');
    await fsPromises.mkdir(workspace, { recursive: true });
    const isolatedHome = await prepareIsolatedCodexHome(tempRoot, settings);
    if (!isolatedHome.ok) {
        await fsPromises.rm(tempRoot, { recursive: true, force: true }).catch(() => {});
        return isolatedHome;
    }
    const schema = buildCodexBridgeDecisionSchema(payload.tools, payload);
    const prompt = buildCodexBridgePrompt(messages, payload.tools, payload);
    const args = buildCodexAppServerArgs(launch);
    try {
        const input = await buildCodexBridgeTurnInput({
            prompt,
            messages,
            workspace
        });
        const processResult = await runCodexAppServerInference(launch.command, args, {
            cwd: workspace,
            codexHome: isolatedHome.codexHome,
            model,
            reasoningEffort,
            prompt,
            input,
            outputSchema: schema,
            timeoutMs,
            signal: payload.signal
        });
        if (!processResult.ok) {
            const classified = processResult.code === 'codex_app_server_exited'
                ? classifyCodexFailure(processResult.stderr, processResult.exitCode)
                : null;
            return {
                ...processResult,
                ...(classified || {}),
                ok: false
            };
        }
        const eventAudit = parseCodexAppServerNotifications(
            processResult.notifications,
            processResult.serverRequests
        );
        const instructionSources = Array.isArray(processResult.threadStartResult?.instructionSources)
            ? processResult.threadStartResult.instructionSources
            : [];
        if (instructionSources.length) {
            eventAudit.contamination.push({
                itemType: 'instruction_sources',
                sources: instructionSources
            });
        }
        if (eventAudit.contamination.length) {
            return {
                ok: false,
                code: 'codex_backend_contamination',
                error: 'Codex attempted to use its own harness tools during a model-only AILIS inference.',
                contamination: eventAudit.contamination
            };
        }
        let decision;
        try {
            decision = JSON.parse(eventAudit.agentText);
        } catch (error) {
            return {
                ok: false,
                code: 'invalid_codex_bridge_output',
                error: `Codex did not return valid bridge JSON: ${error.message}`,
                outputPreview: eventAudit.agentText.slice(0, 2000),
                transportErrors: eventAudit.transportErrors
            };
        }
        const toolCalls = normalizeBridgeToolCalls(decision.tool_calls, {
            ephemeralWorkspace: workspace
        });
        const finishReason = toolCalls.length ? 'tool_calls' : 'stop';
        return {
            ok: true,
            provider: CODEX_MODEL_BRIDGE_PROVIDER,
            model,
            content: normalizeText(decision.content),
            toolCalls,
            nativeToolCalls: toolCalls.length > 0,
            usage: normalizeCodexUsage(eventAudit.usage),
            providerMessage: {
                bridge: 'codex_app_server_ephemeral',
                protocolVersion: CODEX_BRIDGE_PROTOCOL_VERSION,
                authMode: 'chatgpt_oauth',
                transport: 'https',
                ephemeralPerInference: true,
                baseInstructionsOverridden: true,
                instructionSourcesLoaded: 0,
                codexToolsUsed: false,
                reasoningEffort,
                finishReason,
                transportErrors: eventAudit.transportErrors
            }
        };
    } finally {
        await fsPromises.rm(tempRoot, {
            recursive: true,
            force: true,
            maxRetries: 5,
            retryDelay: 200
        }).catch(() => {});
    }
}

async function callCodexModelBridgeOnce(settings = {}, payload = {}, messages = []) {
    if (!Array.isArray(payload.input) && (!Array.isArray(messages) || !messages.length)) {
        return { ok: false, code: 'empty_messages', error: 'AILIS model input is empty.' };
    }
    const auth = await resolveCodexAuthSnapshot(settings);
    if (!auth.ok) {
        return auth;
    }
    const timeoutMs = Math.max(5000, Number(payload.timeoutMs ?? settings.timeoutMs) || 120000);
    let requestBody;
    try {
        requestBody = await materializeCodexResponsesImages(
            buildCodexResponsesRequest(settings, payload, messages)
        );
    } catch (error) {
        return {
            ok: false,
            code: 'invalid_codex_bridge_input',
            error: error?.message || String(error)
        };
    }
    const processResult = await runCodexResponsesInference(settings, auth, requestBody, {
        timeoutMs,
        signal: payload.abortSignal || payload.signal || null
    });
    if (!processResult.ok) {
        return processResult;
    }
    const outputItems = codexResponsesCanonicalItems(processResult.outputItems);
    const toolCalls = normalizeBridgeToolCalls(
        outputItems.filter((item) => item.type === 'function_call').map((item) => ({
            id: item.call_id || item.id,
            name: item.name,
            arguments: item.arguments
        }))
    );
    const content = codexResponsesOutputText(outputItems);
    if (!content && !toolCalls.length) {
        return {
            ok: false,
            code: 'empty_response',
            error: 'Codex Responses returned no assistant message or function call.'
        };
    }
    return {
        ok: true,
        provider: CODEX_MODEL_BRIDGE_PROVIDER,
        model: requestBody.model,
        content,
        toolCalls,
        nativeToolCalls: toolCalls.length > 0,
        usage: normalizeCodexUsage(processResult.usage),
        providerMessage: {
            bridge: 'codex_responses_native',
            protocolVersion: CODEX_BRIDGE_PROTOCOL_VERSION,
            authMode: 'chatgpt_oauth',
            transport: 'responses_sse',
            responseId: processResult.responseId,
            responseItems: outputItems,
            codexToolsUsed: false,
            ailisToolsNative: true,
            parallelToolCalls: requestBody.parallel_tool_calls === true,
            reasoningEffort: requestBody.reasoning?.effort || '',
            promptCacheKey: requestBody.prompt_cache_key,
            proxyUsed: processResult.proxyUsed === true,
            finishReason: toolCalls.length ? 'tool_calls' : 'stop'
        }
    };
}

function shouldRetryCodexBridgeFailure(result = {}) {
    const code = normalizeText(result?.code).toLowerCase();
    if (['timeout', 'codex_network_error', 'codex_server_error'].includes(code)) {
        return true;
    }
    if (code !== 'codex_process_failed' && code !== 'codex_app_server_exited') {
        return false;
    }
    const diagnostic = [
        result?.error,
        result?.details?.stderrTail,
        result?.stderr
    ].map((value) => normalizeText(value).toLowerCase()).filter(Boolean).join('\n');
    return !/(?:not logged in|login required|authentication|unauthorized|rate.?limit|usage.?limit|quota|credits?)/i.test(diagnostic);
}

function resolveCodexBridgeMaxAttempts(settings = {}) {
    const configured = Number(
        settings.codexBridgeMaxAttempts ??
        process.env.AILIS_CODEX_MODEL_BRIDGE_MAX_ATTEMPTS ??
        2
    );
    return Math.max(1, Math.min(2, Number.isFinite(configured) ? Math.trunc(configured) : 2));
}

async function callCodexModelBridge(settings = {}, payload = {}, messages = []) {
    const maxAttempts = resolveCodexBridgeMaxAttempts(settings);
    const failureCodes = [];
    let result = null;
    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
        result = await callCodexModelBridgeOnce(settings, payload, messages);
        if (result?.ok) {
            return {
                ...result,
                providerMessage: {
                    ...(result.providerMessage || {}),
                    bridgeAttempts: attempt,
                    retryCount: attempt - 1,
                    ...(failureCodes.length ? { retriedFailureCodes: failureCodes } : {})
                }
            };
        }
        if (
            attempt >= maxAttempts ||
            payload?.signal?.aborted ||
            payload?.abortSignal?.aborted ||
            !shouldRetryCodexBridgeFailure(result)
        ) {
            break;
        }
        failureCodes.push(normalizeText(result?.code, 'unknown'));
    }
    return {
        ...(result || {
            ok: false,
            code: 'codex_bridge_failed',
            error: 'Codex model bridge failed without a result.'
        }),
        bridgeAttempts: Math.max(1, failureCodes.length + 1),
        retryCount: failureCodes.length,
        ...(failureCodes.length ? { retriedFailureCodes: failureCodes } : {})
    };
}

module.exports = {
    CODEX_BRIDGE_PROTOCOL_VERSION,
    CODEX_MODEL_BRIDGE_PROVIDER,
    DEFAULT_CODEX_MODEL,
    DEFAULT_CODEX_REASONING_EFFORT,
    buildCodexBridgeDecisionSchema,
    buildCodexBridgePrompt,
    buildCodexBridgeTurnInput,
    buildCodexResponsesRequest,
    buildProcessTreeTerminationPlan,
    callCodexModelBridge,
    callCodexAppServerBridgeOnce,
    codexNativeToolSpecs,
    codexResponsesInputItems,
    codexResponsesCanonicalItems,
    codexResponsesOutputText,
    collectCodexBridgeImageInputs,
    materializeCodexResponsesImages,
    normalizeBridgeToolCalls,
    normalizeCodexUsage,
    parseCodexAppServerNotifications,
    parseCodexJsonlEvents,
    parseCodexResponsesSse,
    parseWindowsProxyServer,
    runCodexResponsesInference,
    resolveCodexBridgeMaxAttempts,
    resolveCodexEntrypoint,
    resolveCodexProxyUrl,
    shouldRetryCodexBridgeFailure
};
