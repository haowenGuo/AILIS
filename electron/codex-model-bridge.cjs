const fs = require('node:fs');
const fsPromises = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { spawn } = require('node:child_process');

const CODEX_MODEL_BRIDGE_PROVIDER = 'codex-model-bridge';
const DEFAULT_CODEX_MODEL = 'gpt-5.5';
const DEFAULT_CODEX_REASONING_EFFORT = 'medium';
const CODEX_BRIDGE_PROTOCOL_VERSION = 2;
const CODEX_HTTP_MODEL_PROVIDER = 'ailis-chatgpt-http';
const CODEX_CHATGPT_BACKEND_URL = 'https://chatgpt.com/backend-api/codex';
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
        parameters
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
    return schema?.type === 'null'
        ? schema
        : {
              anyOf: [
                  schema,
                  {
                      type: 'null',
                      description: 'Use null to omit this optional field. Prefer null unless the current task specifically needs this option.'
                  }
              ]
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
        compiled.items = compileCodexOutputSchema(schema.items, { fallbackType: 'string' });
        return compiled;
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
            try {
                child.kill();
            } catch {}
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

async function callCodexModelBridge(settings = {}, payload = {}, messages = []) {
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

module.exports = {
    CODEX_BRIDGE_PROTOCOL_VERSION,
    CODEX_MODEL_BRIDGE_PROVIDER,
    DEFAULT_CODEX_MODEL,
    DEFAULT_CODEX_REASONING_EFFORT,
    buildCodexBridgeDecisionSchema,
    buildCodexBridgePrompt,
    buildCodexBridgeTurnInput,
    callCodexModelBridge,
    collectCodexBridgeImageInputs,
    normalizeBridgeToolCalls,
    normalizeCodexUsage,
    parseCodexAppServerNotifications,
    parseCodexJsonlEvents,
    resolveCodexEntrypoint
};
