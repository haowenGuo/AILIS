const DEFAULT_PROVIDER = 'openai-compatible';
const OPENAI_COMPATIBLE_PROVIDER = 'openai-compatible';
const OPENAI_RESPONSES_PROVIDER = 'openai-responses';
const ANTHROPIC_PROVIDER = 'anthropic';
const GEMINI_PROVIDER = 'gemini';
const VLLM_PROVIDER = 'vllm';
const OLLAMA_PROVIDER = 'ollama';

const PROVIDER_OPTIONS = Object.freeze([
    OPENAI_COMPATIBLE_PROVIDER,
    OPENAI_RESPONSES_PROVIDER,
    ANTHROPIC_PROVIDER,
    GEMINI_PROVIDER,
    VLLM_PROVIDER,
    OLLAMA_PROVIDER
]);

const DEFAULT_PROVIDER_BASE_URLS = Object.freeze({
    [OPENAI_COMPATIBLE_PROVIDER]: 'https://ark.cn-beijing.volces.com/api/v3',
    [OPENAI_RESPONSES_PROVIDER]: 'https://api.openai.com/v1',
    [ANTHROPIC_PROVIDER]: 'https://api.anthropic.com',
    [GEMINI_PROVIDER]: 'https://generativelanguage.googleapis.com/v1beta',
    [VLLM_PROVIDER]: 'http://127.0.0.1:8000/v1',
    [OLLAMA_PROVIDER]: 'http://127.0.0.1:11434'
});

const DEFAULT_PROVIDER_MODELS = Object.freeze({
    [OPENAI_COMPATIBLE_PROVIDER]: 'doubao-seed-2-0-mini-260215',
    [OPENAI_RESPONSES_PROVIDER]: 'gpt-4.1-mini',
    [ANTHROPIC_PROVIDER]: 'claude-3-5-haiku-latest',
    [GEMINI_PROVIDER]: 'gemini-2.0-flash',
    [VLLM_PROVIDER]: 'Qwen/Qwen2.5-7B-Instruct',
    [OLLAMA_PROVIDER]: 'llama3.2'
});

const PROVIDER_CAPABILITY_TABLE = Object.freeze({
    [OPENAI_COMPATIBLE_PROVIDER]: Object.freeze({
        provider: OPENAI_COMPATIBLE_PROVIDER,
        label: 'OpenAI-compatible Chat Completions',
        transport: 'chat-completions',
        chat: true,
        nativeToolCalling: true,
        nativeToolCallingDefault: false,
        jsonMode: true,
        jsonSchema: true,
        vision: 'model-dependent',
        longContext: 'model-dependent',
        lowLatency: 'model-dependent',
        notes: '兼容接口差异很大，tool_call/json_schema/vision 需要通过 health check 实测。'
    }),
    [OPENAI_RESPONSES_PROVIDER]: Object.freeze({
        provider: OPENAI_RESPONSES_PROVIDER,
        label: 'OpenAI Responses API',
        transport: 'responses',
        chat: true,
        nativeToolCalling: true,
        nativeToolCallingDefault: true,
        jsonMode: true,
        jsonSchema: true,
        vision: true,
        longContext: true,
        lowLatency: 'model-dependent',
        notes: 'OpenAI 原生 Responses 路线，优先用于 OpenAI 第一方模型。'
    }),
    [ANTHROPIC_PROVIDER]: Object.freeze({
        provider: ANTHROPIC_PROVIDER,
        label: 'Anthropic Messages API',
        transport: 'anthropic-messages',
        chat: true,
        nativeToolCalling: true,
        nativeToolCallingDefault: true,
        jsonMode: false,
        jsonSchema: false,
        vision: true,
        longContext: true,
        lowLatency: 'model-dependent',
        notes: 'Claude 没有通用 response_format；结构化输出优先走 tool use，JSON fallback 走提示约束。'
    }),
    [GEMINI_PROVIDER]: Object.freeze({
        provider: GEMINI_PROVIDER,
        label: 'Gemini GenerateContent API',
        transport: 'gemini-generate-content',
        chat: true,
        nativeToolCalling: true,
        nativeToolCallingDefault: true,
        jsonMode: true,
        jsonSchema: true,
        vision: true,
        longContext: true,
        lowLatency: 'model-dependent',
        notes: 'Gemini 原生支持 function calling 和 responseMimeType=application/json。'
    }),
    [VLLM_PROVIDER]: Object.freeze({
        provider: VLLM_PROVIDER,
        label: 'vLLM OpenAI-compatible Local Server',
        transport: 'chat-completions',
        chat: true,
        nativeToolCalling: false,
        nativeToolCallingDefault: false,
        jsonMode: true,
        jsonSchema: false,
        vision: 'model-dependent',
        longContext: 'model-dependent',
        lowLatency: 'model-dependent',
        notes: '本地 vLLM 使用 OpenAI-compatible /v1/chat/completions；API Key 可留空。工具调用能力取决于模型和 chat template，默认不强测。'
    }),
    [OLLAMA_PROVIDER]: Object.freeze({
        provider: OLLAMA_PROVIDER,
        label: 'Ollama Local Chat API',
        transport: 'ollama-api-chat',
        chat: true,
        nativeToolCalling: false,
        nativeToolCallingDefault: false,
        jsonMode: true,
        jsonSchema: false,
        vision: 'model-dependent',
        longContext: 'model-dependent',
        lowLatency: 'model-dependent',
        notes: '本地 Ollama 使用 /api/chat；API Key 留空。多模态能力取决于本地模型。'
    })
});

const ONE_PIXEL_PNG_DATA_URL =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p9sAAAAASUVORK5CYII=';

function normalizeString(value) {
    return String(value || '').trim();
}

function normalizeProvider(value) {
    const normalized = normalizeString(value).toLowerCase();
    return PROVIDER_OPTIONS.includes(normalized) ? normalized : DEFAULT_PROVIDER;
}

function normalizeBaseUrl(value) {
    return normalizeString(value).replace(/\/+$/, '');
}

function getDefaultProviderBaseUrl(provider = DEFAULT_PROVIDER) {
    return DEFAULT_PROVIDER_BASE_URLS[normalizeProvider(provider)] || DEFAULT_PROVIDER_BASE_URLS[DEFAULT_PROVIDER];
}

function getDefaultProviderModel(provider = DEFAULT_PROVIDER) {
    return DEFAULT_PROVIDER_MODELS[normalizeProvider(provider)] || DEFAULT_PROVIDER_MODELS[DEFAULT_PROVIDER];
}

function normalizeTimeoutMs(value, fallbackValue = 25000) {
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue)) {
        return fallbackValue;
    }
    return Math.round(Math.min(Math.max(numericValue, 5000), 120000));
}

function classifyFetchFailure(error) {
    const name = normalizeString(error?.name);
    const code = normalizeString(error?.code || error?.cause?.code).toUpperCase();
    const message = normalizeString(error?.message || String(error));
    const causeMessage = normalizeString(error?.cause?.message || '');
    const combined = `${name} ${code} ${message} ${causeMessage}`;
    const transient = /fetch failed|network|socket|timeout|timedout|econnreset|econnrefused|econnaborted|enotfound|eai_again|etimedout|und_err/i.test(combined);
    return {
        code: transient ? 'transient_network_error' : 'network_error',
        error: message || causeMessage || '模型接口网络请求失败。',
        details: {
            name,
            code,
            causeCode: normalizeString(error?.cause?.code),
            causeMessage
        }
    };
}

function normalizeTemperature(value, fallbackValue = 0.8) {
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue)) {
        return fallbackValue;
    }
    return Number(Math.min(Math.max(numericValue, 0), 2).toFixed(2));
}

const REASONING_EFFORT_VALUES = new Set(['none', 'minimal', 'low', 'medium', 'high', 'xhigh']);

function normalizeReasoningEffort(value) {
    const normalized = normalizeString(value).toLowerCase();
    return REASONING_EFFORT_VALUES.has(normalized) ? normalized : '';
}

function normalizePositiveInteger(value, { min = 1, max = 128000 } = {}) {
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue)) {
        return null;
    }
    return Math.round(Math.min(Math.max(numericValue, min), max));
}

function resolvePayloadReasoningEffort(payload = {}) {
    return normalizeReasoningEffort(payload.reasoning_effort || payload.reasoningEffort);
}

function applyOpenAiCompatibleRequestControls(body, payload = {}) {
    const reasoningEffort = resolvePayloadReasoningEffort(payload);
    if (reasoningEffort) {
        body.reasoning_effort = reasoningEffort;
    }
    if (payload.thinking && typeof payload.thinking === 'object' && !Array.isArray(payload.thinking)) {
        body.thinking = payload.thinking;
    }
    const maxTokens = normalizePositiveInteger(payload.max_tokens ?? payload.maxTokens, {
        min: 1,
        max: 128000
    });
    if (maxTokens !== null) {
        body.max_tokens = maxTokens;
    }
    const maxCompletionTokens = normalizePositiveInteger(
        payload.max_completion_tokens ?? payload.maxCompletionTokens,
        {
            min: 1,
            max: 128000
        }
    );
    if (maxCompletionTokens !== null) {
        body.max_completion_tokens = maxCompletionTokens;
    }
    if (typeof payload.parallel_tool_calls === 'boolean') {
        body.parallel_tool_calls = payload.parallel_tool_calls;
    }
    const serviceTier = normalizeString(payload.service_tier || payload.serviceTier);
    if (serviceTier) {
        body.service_tier = serviceTier;
    }
}

function applyOpenAiResponsesRequestControls(body, payload = {}) {
    const reasoningEffort = resolvePayloadReasoningEffort(payload);
    if (reasoningEffort) {
        body.reasoning = {
            ...(payload.reasoning && typeof payload.reasoning === 'object' ? payload.reasoning : {}),
            effort: reasoningEffort
        };
    } else if (payload.reasoning && typeof payload.reasoning === 'object' && !Array.isArray(payload.reasoning)) {
        body.reasoning = payload.reasoning;
    }
    const maxOutputTokens = normalizePositiveInteger(
        payload.max_output_tokens ?? payload.maxOutputTokens ?? payload.max_tokens ?? payload.maxTokens,
        {
            min: 1,
            max: 128000
        }
    );
    if (maxOutputTokens !== null) {
        body.max_output_tokens = maxOutputTokens;
    }
    if (typeof payload.parallel_tool_calls === 'boolean') {
        body.parallel_tool_calls = payload.parallel_tool_calls;
    }
    const serviceTier = normalizeString(payload.service_tier || payload.serviceTier);
    if (serviceTier) {
        body.service_tier = serviceTier;
    }
}

function buildChatCompletionsUrl(baseUrl) {
    const normalizedBaseUrl = normalizeBaseUrl(baseUrl);
    if (!normalizedBaseUrl) {
        return '';
    }
    if (/\/chat\/completions$/i.test(normalizedBaseUrl)) {
        return normalizedBaseUrl;
    }
    return `${normalizedBaseUrl}/chat/completions`;
}

function buildResponsesUrl(baseUrl) {
    const normalizedBaseUrl = normalizeBaseUrl(baseUrl);
    if (!normalizedBaseUrl) {
        return '';
    }
    if (/\/responses$/i.test(normalizedBaseUrl)) {
        return normalizedBaseUrl;
    }
    return `${normalizedBaseUrl}/responses`;
}

function buildAnthropicMessagesUrl(baseUrl) {
    const normalizedBaseUrl = normalizeBaseUrl(baseUrl);
    if (!normalizedBaseUrl) {
        return '';
    }
    if (/\/v1\/messages$/i.test(normalizedBaseUrl)) {
        return normalizedBaseUrl;
    }
    if (/\/v1$/i.test(normalizedBaseUrl)) {
        return `${normalizedBaseUrl}/messages`;
    }
    return `${normalizedBaseUrl}/v1/messages`;
}

function buildGeminiGenerateContentUrl(baseUrl, model, apiKey) {
    const normalizedBaseUrl = normalizeBaseUrl(baseUrl);
    const normalizedModel = encodeURIComponent(normalizeString(model));
    const cleanKey = encodeURIComponent(normalizeString(apiKey));
    if (!normalizedBaseUrl || !normalizedModel) {
        return '';
    }
    if (/:(generateContent|streamGenerateContent)(\?.*)?$/i.test(normalizedBaseUrl)) {
        return cleanKey && !/[?&]key=/i.test(normalizedBaseUrl)
            ? `${normalizedBaseUrl}${normalizedBaseUrl.includes('?') ? '&' : '?'}key=${cleanKey}`
            : normalizedBaseUrl;
    }
    const root = /\/models\/[^/]+$/i.test(normalizedBaseUrl)
        ? normalizedBaseUrl
        : `${normalizedBaseUrl}/models/${normalizedModel}`;
    return `${root}:generateContent?key=${cleanKey}`;
}

function buildOllamaChatUrl(baseUrl) {
    const normalizedBaseUrl = normalizeBaseUrl(baseUrl);
    if (!normalizedBaseUrl) {
        return '';
    }
    if (/\/api\/chat$/i.test(normalizedBaseUrl)) {
        return normalizedBaseUrl;
    }
    if (/\/api$/i.test(normalizedBaseUrl)) {
        return `${normalizedBaseUrl}/chat`;
    }
    return `${normalizedBaseUrl}/api/chat`;
}

function normalizeMessages(messages) {
    if (!Array.isArray(messages)) {
        return [];
    }

    return messages
        .map((message) => {
            const role = ['system', 'developer', 'user', 'assistant', 'tool'].includes(message?.role)
                ? message.role
                : 'user';
            const content = normalizeMessageContent(message?.content);
            return {
                role,
                content,
                toolCallId: normalizeString(message?.tool_call_id || message?.toolCallId),
                name: normalizeString(message?.name)
            };
        })
        .filter((message) => hasMessageContent(message.content));
}

function normalizeMessageContent(content) {
    if (Array.isArray(content)) {
        return content
            .map(normalizeContentPart)
            .filter(Boolean);
    }

    return normalizeString(content);
}

function normalizeContentPart(part) {
    if (!part || typeof part !== 'object') {
        const text = normalizeString(part);
        return text ? { type: 'text', text } : null;
    }

    const type = normalizeString(part.type).toLowerCase();
    if (type === 'text' || type === 'input_text' || type === 'output_text') {
        const text = normalizeString(part.text || part.content);
        return text ? { type: 'text', text } : null;
    }

    if (type === 'image_url') {
        const url = normalizeString(part.image_url?.url || part.url);
        return url ? { type: 'image_url', image_url: { url } } : null;
    }

    if (type === 'input_image' || type === 'image') {
        const url = normalizeString(part.image_url || part.url || part.source?.data || part.data);
        return url ? { type: 'image_url', image_url: { url } } : null;
    }

    return null;
}

function hasMessageContent(content) {
    if (typeof content === 'string') {
        return Boolean(content);
    }
    if (Array.isArray(content)) {
        return content.length > 0;
    }
    return false;
}

function contentToText(content) {
    if (typeof content === 'string') {
        return content;
    }
    if (!Array.isArray(content)) {
        return '';
    }
    return content
        .map((part) => {
            if (typeof part === 'string') {
                return part;
            }
            if (part?.type === 'text' || part?.type === 'input_text' || part?.type === 'output_text') {
                return normalizeString(part.text || part.content);
            }
            return '';
        })
        .filter(Boolean)
        .join('\n');
}

function getErrorTextFromPayload(payload) {
    if (!payload || typeof payload !== 'object') {
        return '';
    }

    return payload.error?.message ||
        payload.error?.error ||
        payload.error ||
        payload.message ||
        payload.detail ||
        '';
}

async function readErrorBody(response) {
    const text = await response.text().catch(() => '');
    if (!text) {
        return '';
    }

    try {
        return getErrorTextFromPayload(JSON.parse(text)) || text;
    } catch {
        return text;
    }
}

function safeJsonParse(text) {
    try {
        return JSON.parse(text);
    } catch {
        return null;
    }
}

function parseDataUrl(value = '') {
    const match = normalizeString(value).match(/^data:([^;,]+);base64,([\s\S]+)$/i);
    if (!match) {
        return null;
    }
    return {
        mediaType: match[1],
        data: match[2]
    };
}

function normalizeJsonSchema(payload = {}) {
    const schema = payload.jsonSchema || payload.schema || payload.responseSchema;
    if (!schema || typeof schema !== 'object') {
        return null;
    }
    return {
        name: normalizeString(payload.jsonSchemaName || payload.schemaName || 'ailis_response'),
        strict: payload.strictJsonSchema !== false,
        schema
    };
}

function shouldRequestJson(payload = {}) {
    return Boolean(
        payload.jsonMode ||
            payload.expectJson ||
            payload.outputFormat === 'json' ||
            payload.responseFormat ||
            payload.jsonSchema ||
            payload.schema ||
            payload.responseSchema
    );
}

function resolveChatResponseFormat(payload = {}) {
    if (payload.responseFormat && typeof payload.responseFormat === 'object') {
        return payload.responseFormat;
    }
    const jsonSchema = normalizeJsonSchema(payload);
    if (jsonSchema) {
        return {
            type: 'json_schema',
            json_schema: jsonSchema
        };
    }
    if (shouldRequestJson(payload)) {
        return { type: 'json_object' };
    }
    return null;
}

function resolveResponsesTextFormat(payload = {}) {
    if (payload.responseFormat && typeof payload.responseFormat === 'object') {
        const format = payload.responseFormat;
        if (format.type === 'json_schema' && format.json_schema) {
            return {
                format: {
                    type: 'json_schema',
                    name: normalizeString(format.json_schema.name || 'ailis_response'),
                    schema: format.json_schema.schema || {},
                    strict: format.json_schema.strict !== false
                }
            };
        }
        if (format.type === 'json_object') {
            return {
                format: {
                    type: 'json_object'
                }
            };
        }
        return { format };
    }
    const jsonSchema = normalizeJsonSchema(payload);
    if (jsonSchema) {
        return {
            format: {
                type: 'json_schema',
                name: jsonSchema.name,
                schema: jsonSchema.schema,
                strict: jsonSchema.strict
            }
        };
    }
    if (shouldRequestJson(payload)) {
        return {
            format: {
                type: 'json_object'
            }
        };
    }
    return null;
}

function normalizeToolSpec(tool = {}) {
    const source = tool.type === 'function' && tool.function ? tool.function : tool;
    const name = normalizeString(source.name || tool.name);
    if (!name) {
        return null;
    }
    return {
        name,
        description: normalizeString(source.description || tool.description),
        parameters: source.parameters || source.input_schema || source.inputSchema || {
            type: 'object',
            properties: {}
        },
        strict: source.strict === true || tool.strict === true
    };
}

function normalizeToolSpecs(tools = []) {
    if (!Array.isArray(tools)) {
        return [];
    }
    return tools.map(normalizeToolSpec).filter(Boolean);
}

function resolveToolChoice(payload = {}) {
    const choice = payload.toolChoice || payload.tool_choice;
    if (!choice) {
        return null;
    }
    if (typeof choice === 'string') {
        const normalized = normalizeString(choice);
        if (normalized === 'auto' || normalized === 'none') {
            return { mode: normalized, required: false };
        }
        return { name: normalized, required: true };
    }
    if (choice.type === 'function' && choice.function?.name) {
        return {
            name: normalizeString(choice.function.name),
            required: true
        };
    }
    if (choice.name || choice.toolName || choice.tool_name) {
        return {
            name: normalizeString(choice.name || choice.toolName || choice.tool_name),
            required: choice.required !== false
        };
    }
    return null;
}

function mapToolsForChatCompletions(tools = []) {
    return normalizeToolSpecs(tools).map((tool) => ({
        type: 'function',
        function: {
            name: tool.name,
            description: tool.description,
            parameters: tool.parameters,
            ...(tool.strict ? { strict: true } : {})
        }
    }));
}

function mapToolsForResponses(tools = []) {
    return normalizeToolSpecs(tools).map((tool) => ({
        type: 'function',
        name: tool.name,
        description: tool.description,
        parameters: tool.parameters,
        ...(tool.strict ? { strict: true } : {})
    }));
}

function mapToolsForAnthropic(tools = []) {
    return normalizeToolSpecs(tools).map((tool) => ({
        name: tool.name,
        description: tool.description,
        input_schema: tool.parameters
    }));
}

function mapToolsForGemini(tools = []) {
    const declarations = normalizeToolSpecs(tools).map((tool) => ({
        name: tool.name,
        description: tool.description,
        parameters: tool.parameters
    }));
    return declarations.length ? [{ functionDeclarations: declarations }] : [];
}

function normalizeToolCallArguments(rawArguments) {
    if (!rawArguments) {
        return {};
    }
    if (typeof rawArguments === 'string') {
        return safeJsonParse(rawArguments) || {};
    }
    if (typeof rawArguments === 'object') {
        return rawArguments;
    }
    return {};
}

function normalizeToolCall({ id = '', name = '', arguments: rawArguments = {}, provider = '' } = {}) {
    const normalizedName = normalizeString(name);
    if (!normalizedName) {
        return null;
    }
    return {
        id: normalizeString(id),
        name: normalizedName,
        arguments: normalizeToolCallArguments(rawArguments),
        rawArguments,
        provider
    };
}

function extractChatToolCalls(message = {}, provider = OPENAI_COMPATIBLE_PROVIDER) {
    return (Array.isArray(message.tool_calls) ? message.tool_calls : [])
        .map((call) => normalizeToolCall({
            id: call.id,
            name: call.function?.name || call.name,
            arguments: call.function?.arguments || call.arguments,
            provider
        }))
        .filter(Boolean);
}

function extractContentTextFromOpenAiMessage(message = {}) {
    const content = message?.content;
    if (typeof content === 'string') {
        return normalizeString(content);
    }
    if (Array.isArray(content)) {
        return content
            .map((part) => normalizeString(part?.text || part?.content))
            .filter(Boolean)
            .join('\n');
    }
    return '';
}

function getModelCapabilityHeuristics(provider, model) {
    const normalizedProvider = normalizeProvider(provider);
    const normalizedModel = normalizeString(model).toLowerCase();
    const visionModel =
        /(vision|vl|omni|gpt-4o|gpt-4\.1|gpt-5|o3|o4|claude-3|gemini|qwen.*vl|glm-4v|doubao.*vision|seed.*vision|kimi.*vision|llava|bakllava|moondream)/i
            .test(normalizedModel);
    const longContextModel =
        /(128k|200k|1m|long|gemini|claude|gpt-4\.1|gpt-5|qwen|doubao|deepseek|llama3\.1|llama3\.2|llama3\.3|mistral|mixtral)/i
            .test(normalizedModel);
    const lowLatencyModel =
        /(mini|flash|haiku|turbo|lite|fast|speed|doubao|deepseek-chat|llama3\.2|phi|gemma|qwen.*0\.5b|qwen.*1\.5b|qwen.*3b|qwen.*7b)/i
            .test(normalizedModel);

    return {
        vision: normalizedProvider === OPENAI_COMPATIBLE_PROVIDER ||
            normalizedProvider === VLLM_PROVIDER ||
            normalizedProvider === OLLAMA_PROVIDER
            ? visionModel
            : PROVIDER_CAPABILITY_TABLE[normalizedProvider]?.vision === true && visionModel !== false,
        longContext: normalizedProvider === OPENAI_COMPATIBLE_PROVIDER ||
            normalizedProvider === VLLM_PROVIDER ||
            normalizedProvider === OLLAMA_PROVIDER
            ? longContextModel
            : PROVIDER_CAPABILITY_TABLE[normalizedProvider]?.longContext === true,
        lowLatency: lowLatencyModel
    };
}

function getProviderCapabilities(settings = {}) {
    const provider = normalizeProvider(settings.provider);
    const base = PROVIDER_CAPABILITY_TABLE[provider] || PROVIDER_CAPABILITY_TABLE[DEFAULT_PROVIDER];
    const modelHints = getModelCapabilityHeuristics(provider, settings.model);
    return {
        ...base,
        provider,
        model: normalizeString(settings.model),
        vision: base.vision === 'model-dependent' ? modelHints.vision : Boolean(base.vision && modelHints.vision !== false),
        longContext: base.longContext === 'model-dependent' ? modelHints.longContext : Boolean(base.longContext),
        lowLatency: base.lowLatency === 'model-dependent' ? modelHints.lowLatency : Boolean(base.lowLatency),
        source: 'static-provider-table+model-name-heuristics'
    };
}

function getResolvedSettings(settings = {}) {
    const provider = normalizeProvider(settings.provider);
    return {
        provider,
        baseUrl: normalizeBaseUrl(settings.baseUrl || getDefaultProviderBaseUrl(provider)),
        apiKey: normalizeString(settings.apiKey),
        model: normalizeString(settings.model || getDefaultProviderModel(provider)),
        timeoutMs: normalizeTimeoutMs(settings.timeoutMs),
        temperature: normalizeTemperature(settings.temperature)
    };
}

async function fetchJsonWithTimeout(url, requestOptions, timeoutMs, externalSignal = null) {
    const controller = new AbortController();
    let abortedByExternalSignal = false;
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    const onExternalAbort = () => {
        abortedByExternalSignal = true;
        controller.abort();
    };
    if (externalSignal?.aborted) {
        onExternalAbort();
    } else if (typeof externalSignal?.addEventListener === 'function') {
        externalSignal.addEventListener('abort', onExternalAbort, { once: true });
    }
    try {
        const response = await fetch(url, {
            ...requestOptions,
            signal: controller.signal
        });
        if (!response.ok) {
            const errorText = await readErrorBody(response);
            return {
                ok: false,
                status: response.status,
                error: errorText || `模型接口请求失败，状态码：${response.status}`
            };
        }
        return {
            ok: true,
            data: await response.json()
        };
    } catch (error) {
        const aborted = error?.name === 'AbortError';
        const failure = aborted ? null : classifyFetchFailure(error);
        return {
            ok: false,
            code: aborted ? (abortedByExternalSignal ? 'aborted' : 'timeout') : failure.code,
            error: aborted
                ? abortedByExternalSignal
                    ? '模型请求已被用户中断。'
                    : `模型请求超时（${timeoutMs}ms）`
                : failure.error,
            details: failure?.details
        };
    } finally {
        clearTimeout(timeoutId);
        if (typeof externalSignal?.removeEventListener === 'function') {
            externalSignal.removeEventListener('abort', onExternalAbort);
        }
    }
}

function validateProviderInput(settings, messages) {
    if (!settings.model || !settings.baseUrl || (providerRequiresApiKey(settings.provider) && !settings.apiKey)) {
        return {
            ok: false,
            code: 'needs_config',
            error: providerRequiresApiKey(settings.provider)
                ? '请先在控制面板配置 API Base、模型和 API Key。'
                : '请先在控制面板配置本地模型服务地址和模型名。'
        };
    }

    if (!messages.length) {
        return {
            ok: false,
            code: 'empty_messages',
            error: '消息内容为空。'
        };
    }

    return null;
}

function providerRequiresApiKey(provider = DEFAULT_PROVIDER) {
    const normalizedProvider = normalizeProvider(provider);
    return normalizedProvider !== VLLM_PROVIDER && normalizedProvider !== OLLAMA_PROVIDER;
}

function buildJsonHeaders({ apiKey = '', bearer = true, extra = {} } = {}) {
    const headers = {
        'Content-Type': 'application/json',
        ...extra
    };
    const normalizedApiKey = normalizeString(apiKey);
    if (normalizedApiKey) {
        if (bearer) {
            headers.Authorization = `Bearer ${normalizedApiKey}`;
        } else {
            headers['x-api-key'] = normalizedApiKey;
        }
    }
    return headers;
}

function buildProviderResult(settings, data, content, toolCalls = []) {
    return {
        ok: true,
        provider: settings.provider,
        model: settings.model,
        content: normalizeString(content),
        toolCalls,
        nativeToolCalls: toolCalls.length > 0,
        usage: data?.usage || data?.usageMetadata || null,
        capabilities: getProviderCapabilities(settings)
    };
}

async function callOpenAiCompatible(settings, payload, messages) {
    const invalid = validateProviderInput(settings, messages);
    if (invalid) {
        return invalid;
    }

    const tools = mapToolsForChatCompletions(payload.tools);
    const toolChoice = resolveToolChoice(payload);
    const responseFormat = resolveChatResponseFormat(payload);
    const body = {
        model: settings.model,
        messages: messages.map((message) => ({
            role: message.role === 'developer' ? 'system' : message.role,
            content: message.content,
            ...(message.toolCallId ? { tool_call_id: message.toolCallId } : {}),
            ...(message.name ? { name: message.name } : {})
        })),
        temperature: normalizeTemperature(payload.temperature ?? settings.temperature),
        stream: false
    };
    applyOpenAiCompatibleRequestControls(body, payload);

    if (responseFormat) {
        body.response_format = responseFormat;
    }
    if (tools.length) {
        body.tools = tools;
    }
    if (toolChoice?.name) {
        body.tool_choice = {
            type: 'function',
            function: { name: toolChoice.name }
        };
    } else if (payload.toolChoice === 'auto' || payload.tool_choice === 'auto') {
        body.tool_choice = 'auto';
    }

    const result = await fetchJsonWithTimeout(
        buildChatCompletionsUrl(settings.baseUrl),
        {
            method: 'POST',
            headers: buildJsonHeaders({ apiKey: settings.apiKey }),
            body: JSON.stringify(body)
        },
        normalizeTimeoutMs(payload.timeoutMs ?? settings.timeoutMs),
        payload.abortSignal || payload.signal || null
    );

    if (!result.ok) {
        return {
            ok: false,
            code: result.code || 'provider_error',
            status: result.status,
            error: result.error
        };
    }

    const message = result.data?.choices?.[0]?.message || {};
    const content = extractContentTextFromOpenAiMessage(message) ||
        normalizeString(result.data?.choices?.[0]?.text || '');
    const toolCalls = extractChatToolCalls(message, settings.provider);

    if (!content && !toolCalls.length) {
        return {
            ok: false,
            code: 'empty_response',
            error: '模型接口返回为空。'
        };
    }

    return buildProviderResult(settings, result.data, content, toolCalls);
}

function convertMessagesForOllama(messages = [], payload = {}) {
    const out = [];
    if (shouldRequestJson(payload)) {
        out.push({
            role: 'system',
            content: 'Return valid JSON only. Do not include Markdown fences or extra prose.'
        });
    }
    for (const message of messages) {
        const role = message.role === 'assistant'
            ? 'assistant'
            : message.role === 'system' || message.role === 'developer'
            ? 'system'
            : 'user';
        const content = contentToText(message.content);
        if (!content) {
            continue;
        }
        out.push({ role, content });
    }
    return out;
}

function extractOllamaOutput(data = {}) {
    return normalizeString(data.message?.content || data.response || '');
}

async function callOllama(settings, payload, messages) {
    const invalid = validateProviderInput(settings, messages);
    if (invalid) {
        return invalid;
    }

    const body = {
        model: settings.model,
        messages: convertMessagesForOllama(messages, payload),
        stream: false,
        options: {
            temperature: normalizeTemperature(payload.temperature ?? settings.temperature)
        }
    };
    if (shouldRequestJson(payload)) {
        body.format = 'json';
    }

    const result = await fetchJsonWithTimeout(
        buildOllamaChatUrl(settings.baseUrl),
        {
            method: 'POST',
            headers: buildJsonHeaders(),
            body: JSON.stringify(body)
        },
        normalizeTimeoutMs(payload.timeoutMs ?? settings.timeoutMs),
        payload.abortSignal || payload.signal || null
    );

    if (!result.ok) {
        return {
            ok: false,
            code: result.code || 'provider_error',
            status: result.status,
            error: result.error
        };
    }

    const content = extractOllamaOutput(result.data);
    if (!content) {
        return {
            ok: false,
            code: 'empty_response',
            error: '模型接口返回为空。'
        };
    }
    return buildProviderResult(settings, result.data, content, []);
}

function convertMessagesForResponses(messages = []) {
    const instructions = [];
    const input = [];
    for (const message of messages) {
        if (message.role === 'system' || message.role === 'developer') {
            instructions.push(contentToText(message.content));
            continue;
        }
        input.push({
            role: message.role === 'assistant' ? 'assistant' : 'user',
            content: convertContentForResponses(message.content)
        });
    }
    return {
        instructions: instructions.filter(Boolean).join('\n\n'),
        input
    };
}

function convertContentForResponses(content) {
    if (typeof content === 'string') {
        return content;
    }
    return (Array.isArray(content) ? content : [])
        .map((part) => {
            if (part.type === 'image_url') {
                return {
                    type: 'input_image',
                    image_url: part.image_url?.url || part.url || ''
                };
            }
            return {
                type: 'input_text',
                text: normalizeString(part.text || part.content)
            };
        })
        .filter((part) => part.image_url || part.text);
}

function extractResponsesOutput(data = {}) {
    const texts = [];
    const toolCalls = [];
    if (data.output_text) {
        texts.push(data.output_text);
    }
    for (const item of Array.isArray(data.output) ? data.output : []) {
        if (item?.type === 'function_call') {
            const call = normalizeToolCall({
                id: item.call_id || item.id,
                name: item.name,
                arguments: item.arguments,
                provider: OPENAI_RESPONSES_PROVIDER
            });
            if (call) {
                toolCalls.push(call);
            }
            continue;
        }
        for (const part of Array.isArray(item?.content) ? item.content : []) {
            const text = normalizeString(part?.text || part?.content || part?.value);
            if (text) {
                texts.push(text);
            }
        }
    }
    return {
        content: texts.join('\n').trim(),
        toolCalls
    };
}

async function callOpenAiResponses(settings, payload, messages) {
    const invalid = validateProviderInput(settings, messages);
    if (invalid) {
        return invalid;
    }

    const converted = convertMessagesForResponses(messages);
    const tools = mapToolsForResponses(payload.tools);
    const toolChoice = resolveToolChoice(payload);
    const text = resolveResponsesTextFormat(payload);
    const body = {
        model: settings.model,
        input: converted.input,
        temperature: normalizeTemperature(payload.temperature ?? settings.temperature)
    };
    applyOpenAiResponsesRequestControls(body, payload);

    if (converted.instructions) {
        body.instructions = converted.instructions;
    }
    if (text) {
        body.text = text;
    }
    if (tools.length) {
        body.tools = tools;
    }
    if (toolChoice?.name) {
        body.tool_choice = {
            type: 'function',
            name: toolChoice.name
        };
    }

    const result = await fetchJsonWithTimeout(
        buildResponsesUrl(settings.baseUrl),
        {
            method: 'POST',
            headers: {
                ...buildJsonHeaders({ apiKey: settings.apiKey })
            },
            body: JSON.stringify(body)
        },
        normalizeTimeoutMs(payload.timeoutMs ?? settings.timeoutMs),
        payload.abortSignal || payload.signal || null
    );

    if (!result.ok) {
        return {
            ok: false,
            code: result.code || 'provider_error',
            status: result.status,
            error: result.error
        };
    }

    const output = extractResponsesOutput(result.data);
    if (!output.content && !output.toolCalls.length) {
        return {
            ok: false,
            code: 'empty_response',
            error: '模型接口返回为空。'
        };
    }
    return buildProviderResult(settings, result.data, output.content, output.toolCalls);
}

function convertMessagesForAnthropic(messages = [], payload = {}) {
    const system = [];
    const out = [];
    if (shouldRequestJson(payload)) {
        system.push('Return valid JSON only. Do not include Markdown fences or extra prose.');
    }
    for (const message of messages) {
        if (message.role === 'system' || message.role === 'developer') {
            system.push(contentToText(message.content));
            continue;
        }
        out.push({
            role: message.role === 'assistant' ? 'assistant' : 'user',
            content: convertContentForAnthropic(message.content)
        });
    }
    return {
        system: system.filter(Boolean).join('\n\n'),
        messages: out
    };
}

function convertContentForAnthropic(content) {
    if (typeof content === 'string') {
        return content;
    }
    return (Array.isArray(content) ? content : [])
        .map((part) => {
            if (part.type === 'image_url') {
                const dataUrl = parseDataUrl(part.image_url?.url || part.url);
                if (!dataUrl) {
                    return {
                        type: 'text',
                        text: '[Unsupported non-data image URL omitted for Anthropic adapter]'
                    };
                }
                return {
                    type: 'image',
                    source: {
                        type: 'base64',
                        media_type: dataUrl.mediaType,
                        data: dataUrl.data
                    }
                };
            }
            return {
                type: 'text',
                text: normalizeString(part.text || part.content)
            };
        })
        .filter((part) => part.text || part.source);
}

function extractAnthropicOutput(data = {}) {
    const texts = [];
    const toolCalls = [];
    for (const part of Array.isArray(data.content) ? data.content : []) {
        if (part?.type === 'text' && part.text) {
            texts.push(part.text);
        }
        if (part?.type === 'tool_use') {
            const call = normalizeToolCall({
                id: part.id,
                name: part.name,
                arguments: part.input || {},
                provider: ANTHROPIC_PROVIDER
            });
            if (call) {
                toolCalls.push(call);
            }
        }
    }
    return {
        content: texts.join('\n').trim(),
        toolCalls
    };
}

async function callAnthropic(settings, payload, messages) {
    const invalid = validateProviderInput(settings, messages);
    if (invalid) {
        return invalid;
    }

    const converted = convertMessagesForAnthropic(messages, payload);
    const tools = mapToolsForAnthropic(payload.tools);
    const toolChoice = resolveToolChoice(payload);
    const body = {
        model: settings.model,
        max_tokens: Number(payload.maxTokens || payload.max_tokens || 4096),
        messages: converted.messages,
        temperature: normalizeTemperature(payload.temperature ?? settings.temperature)
    };

    if (converted.system) {
        body.system = converted.system;
    }
    if (tools.length) {
        body.tools = tools;
    }
    if (toolChoice?.name) {
        body.tool_choice = {
            type: 'tool',
            name: toolChoice.name
        };
    }

    const result = await fetchJsonWithTimeout(
        buildAnthropicMessagesUrl(settings.baseUrl),
        {
            method: 'POST',
            headers: {
                ...buildJsonHeaders({ apiKey: settings.apiKey, bearer: false }),
                'anthropic-version': '2023-06-01',
            },
            body: JSON.stringify(body)
        },
        normalizeTimeoutMs(payload.timeoutMs ?? settings.timeoutMs),
        payload.abortSignal || payload.signal || null
    );

    if (!result.ok) {
        return {
            ok: false,
            code: result.code || 'provider_error',
            status: result.status,
            error: result.error
        };
    }

    const output = extractAnthropicOutput(result.data);
    if (!output.content && !output.toolCalls.length) {
        return {
            ok: false,
            code: 'empty_response',
            error: '模型接口返回为空。'
        };
    }
    return buildProviderResult(settings, result.data, output.content, output.toolCalls);
}

function convertMessagesForGemini(messages = []) {
    const systemParts = [];
    const contents = [];
    for (const message of messages) {
        if (message.role === 'system' || message.role === 'developer') {
            const text = contentToText(message.content);
            if (text) {
                systemParts.push({ text });
            }
            continue;
        }
        contents.push({
            role: message.role === 'assistant' ? 'model' : 'user',
            parts: convertContentForGemini(message.content)
        });
    }
    return {
        systemInstruction: systemParts.length ? { parts: systemParts } : null,
        contents
    };
}

function convertContentForGemini(content) {
    if (typeof content === 'string') {
        return [{ text: content }];
    }
    return (Array.isArray(content) ? content : [])
        .map((part) => {
            if (part.type === 'image_url') {
                const dataUrl = parseDataUrl(part.image_url?.url || part.url);
                if (!dataUrl) {
                    return {
                        text: '[Unsupported non-data image URL omitted for Gemini adapter]'
                    };
                }
                return {
                    inlineData: {
                        mimeType: dataUrl.mediaType,
                        data: dataUrl.data
                    }
                };
            }
            return {
                text: normalizeString(part.text || part.content)
            };
        })
        .filter((part) => part.text || part.inlineData);
}

function extractGeminiOutput(data = {}) {
    const texts = [];
    const toolCalls = [];
    const candidate = Array.isArray(data.candidates) ? data.candidates[0] : null;
    for (const part of Array.isArray(candidate?.content?.parts) ? candidate.content.parts : []) {
        if (part.text) {
            texts.push(part.text);
        }
        if (part.functionCall?.name) {
            const call = normalizeToolCall({
                id: part.functionCall.id || '',
                name: part.functionCall.name,
                arguments: part.functionCall.args || {},
                provider: GEMINI_PROVIDER
            });
            if (call) {
                toolCalls.push(call);
            }
        }
    }
    return {
        content: texts.join('\n').trim(),
        toolCalls
    };
}

async function callGemini(settings, payload, messages) {
    const invalid = validateProviderInput(settings, messages);
    if (invalid) {
        return invalid;
    }

    const converted = convertMessagesForGemini(messages);
    const tools = mapToolsForGemini(payload.tools);
    const toolChoice = resolveToolChoice(payload);
    const generationConfig = {
        temperature: normalizeTemperature(payload.temperature ?? settings.temperature)
    };
    const jsonSchema = normalizeJsonSchema(payload);
    if (jsonSchema) {
        generationConfig.responseMimeType = 'application/json';
        generationConfig.responseSchema = jsonSchema.schema;
    } else if (shouldRequestJson(payload)) {
        generationConfig.responseMimeType = 'application/json';
    }

    const body = {
        contents: converted.contents,
        generationConfig
    };
    if (converted.systemInstruction) {
        body.systemInstruction = converted.systemInstruction;
    }
    if (tools.length) {
        body.tools = tools;
    }
    if (toolChoice?.name) {
        body.toolConfig = {
            functionCallingConfig: {
                mode: 'ANY',
                allowedFunctionNames: [toolChoice.name]
            }
        };
    }

    const result = await fetchJsonWithTimeout(
        buildGeminiGenerateContentUrl(settings.baseUrl, settings.model, settings.apiKey),
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        },
        normalizeTimeoutMs(payload.timeoutMs ?? settings.timeoutMs),
        payload.abortSignal || payload.signal || null
    );

    if (!result.ok) {
        return {
            ok: false,
            code: result.code || 'provider_error',
            status: result.status,
            error: result.error
        };
    }

    const output = extractGeminiOutput(result.data);
    if (!output.content && !output.toolCalls.length) {
        return {
            ok: false,
            code: 'empty_response',
            error: '模型接口返回为空。'
        };
    }
    return buildProviderResult(settings, result.data, output.content, output.toolCalls);
}

async function callDesktopLlmProvider(settings = {}, payload = {}) {
    const resolvedSettings = getResolvedSettings(settings);
    const messages = normalizeMessages(payload.messages);
    if (resolvedSettings.provider === OLLAMA_PROVIDER) {
        return callOllama(resolvedSettings, payload, messages);
    }
    if (resolvedSettings.provider === OPENAI_RESPONSES_PROVIDER) {
        return callOpenAiResponses(resolvedSettings, payload, messages);
    }
    if (resolvedSettings.provider === ANTHROPIC_PROVIDER) {
        return callAnthropic(resolvedSettings, payload, messages);
    }
    if (resolvedSettings.provider === GEMINI_PROVIDER) {
        return callGemini(resolvedSettings, payload, messages);
    }
    return callOpenAiCompatible(resolvedSettings, payload, messages);
}

function buildHealthJsonMessages() {
    return [
        {
            role: 'system',
            content: 'You are a provider health checker. Return JSON only.'
        },
        {
            role: 'user',
            content: 'Return exactly {"ok":true,"kind":"json"} as JSON.'
        }
    ];
}

function buildHealthToolSpec() {
    return {
        name: 'ailis_health_echo',
        description: 'Echo a short health-check payload for tool-call verification.',
        parameters: {
            type: 'object',
            additionalProperties: false,
            properties: {
                ok: { type: 'boolean' },
                kind: { type: 'string' }
            },
            required: ['ok', 'kind']
        },
        strict: true
    };
}

function normalizeHealthCheck(ok, extra = {}) {
    return {
        ok: Boolean(ok),
        ...extra
    };
}

async function runHealthCheckStep(settings, payload) {
    const result = await callDesktopLlmProvider(settings, payload);
    if (!result.ok) {
        return normalizeHealthCheck(false, {
            code: result.code || 'provider_error',
            status: result.status,
            error: result.error || 'Provider check failed'
        });
    }
    return normalizeHealthCheck(true, {
        provider: result.provider,
        model: result.model,
        contentPreview: normalizeString(result.content).slice(0, 120),
        usage: result.usage || null,
        toolCalls: (result.toolCalls || []).map((call) => ({
            name: call.name,
            arguments: call.arguments
        }))
    });
}

async function checkDesktopLlmProvider(settings = {}, options = {}) {
    const resolvedSettings = getResolvedSettings(settings);
    const capabilities = getProviderCapabilities(resolvedSettings);
    const timeoutMs = normalizeTimeoutMs(options.timeoutMs || resolvedSettings.timeoutMs, 20000);
    const result = {
        ok: false,
        provider: resolvedSettings.provider,
        model: resolvedSettings.model,
        baseUrl: resolvedSettings.baseUrl,
        capabilities,
        checks: {}
    };

    result.checks.basic = await runHealthCheckStep(resolvedSettings, {
        timeoutMs,
        temperature: 0,
        messages: [
            { role: 'system', content: 'You are a health checker.' },
            { role: 'user', content: 'Reply with exactly OK.' }
        ]
    });

    result.checks.json = await runHealthCheckStep(resolvedSettings, {
        timeoutMs,
        temperature: 0,
        jsonMode: true,
        messages: buildHealthJsonMessages()
    });
    const parsedJson = safeJsonParse(result.checks.json.contentPreview || '');
    result.checks.json.parsed = Boolean(parsedJson?.ok === true);
    result.checks.json.ok = Boolean(result.checks.json.ok && result.checks.json.parsed);

    if (options.includeToolCall !== false && capabilities.nativeToolCalling) {
        result.checks.toolCalling = await runHealthCheckStep(resolvedSettings, {
            timeoutMs,
            temperature: 0,
            tools: [buildHealthToolSpec()],
            toolChoice: { name: 'ailis_health_echo', required: true },
            messages: [
                { role: 'system', content: 'Use the provided tool for this health check.' },
                { role: 'user', content: 'Call ailis_health_echo with {"ok":true,"kind":"tool"}.' }
            ]
        });
        result.checks.toolCalling.ok = Boolean(
            result.checks.toolCalling.ok &&
                result.checks.toolCalling.toolCalls?.some((call) => call.name === 'ailis_health_echo')
        );
    } else {
        result.checks.toolCalling = normalizeHealthCheck(false, {
            skipped: true,
            reason: 'provider_capability_table_marks_tool_calling_unavailable'
        });
    }

    if (options.includeVision !== false && capabilities.vision) {
        result.checks.vision = await runHealthCheckStep(resolvedSettings, {
            timeoutMs,
            temperature: 0,
            jsonMode: true,
            messages: [
                {
                    role: 'system',
                    content: 'You are a vision model health checker. Return JSON only.'
                },
                {
                    role: 'user',
                    content: [
                        { type: 'text', text: 'This is a tiny PNG. Return {"ok":true,"kind":"vision"} as JSON.' },
                        {
                            type: 'image_url',
                            image_url: { url: ONE_PIXEL_PNG_DATA_URL }
                        }
                    ]
                }
            ]
        });
        const parsedVision = safeJsonParse(result.checks.vision.contentPreview || '');
        result.checks.vision.parsed = Boolean(parsedVision?.ok === true);
        result.checks.vision.ok = Boolean(result.checks.vision.ok && result.checks.vision.parsed);
    } else {
        result.checks.vision = normalizeHealthCheck(false, {
            skipped: true,
            reason: 'provider_or_model_capability_table_marks_vision_unavailable'
        });
    }

    result.ok = Boolean(result.checks.basic.ok && result.checks.json.ok);
    result.summary = [
        result.ok ? '模型基础调用与 JSON 输出可用' : '模型基础调用或 JSON 输出未通过',
        result.checks.toolCalling?.ok ? '原生 tool calling 可用' : '原生 tool calling 未确认',
        result.checks.vision?.ok ? '视觉输入可用' : '视觉输入未确认'
    ].join('；');
    return result;
}

module.exports = {
    ANTHROPIC_PROVIDER,
    DEFAULT_PROVIDER,
    DEFAULT_PROVIDER_BASE_URLS,
    DEFAULT_PROVIDER_MODELS,
    GEMINI_PROVIDER,
    OLLAMA_PROVIDER,
    OPENAI_COMPATIBLE_PROVIDER,
    OPENAI_RESPONSES_PROVIDER,
    PROVIDER_CAPABILITY_TABLE,
    PROVIDER_OPTIONS,
    VLLM_PROVIDER,
    buildAnthropicMessagesUrl,
    buildChatCompletionsUrl,
    buildGeminiGenerateContentUrl,
    buildOllamaChatUrl,
    buildResponsesUrl,
    callDesktopLlmProvider,
    classifyFetchFailure,
    checkDesktopLlmProvider,
    getDefaultProviderBaseUrl,
    getDefaultProviderModel,
    getProviderCapabilities,
    normalizeBaseUrl,
    normalizeMessages,
    normalizeProvider,
    normalizeTemperature,
    normalizeTimeoutMs
};
