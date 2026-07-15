import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import process from 'node:process';
import { randomUUID } from 'node:crypto';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { callDesktopLlmProvider } = require('../electron/desktop-llm-provider.cjs');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');

function normalizeText(value, fallback = '') {
    return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

function parseArgs(argv = process.argv.slice(2)) {
    const options = {
        host: '0.0.0.0',
        port: 5128,
        auditDir: path.join(PROJECT_ROOT, 'eval-results', 'agentbench-fc', 'bridge-audit')
    };
    for (let index = 0; index < argv.length; index += 1) {
        const argument = argv[index];
        if (argument === '--host') options.host = argv[++index] || options.host;
        else if (argument === '--port') options.port = Math.max(1, Number(argv[++index]) || options.port);
        else if (argument === '--audit-dir') options.auditDir = path.resolve(argv[++index] || options.auditDir);
        else throw new Error(`Unknown AgentBench FC bridge option: ${argument}`);
    }
    return options;
}

export function readDesktopLlmSettings(env = process.env) {
    const appData = env.APPDATA || path.join(env.USERPROFILE || '', 'AppData', 'Roaming');
    const statePath = normalizeText(env.AILIS_AGENTBENCH_DESKTOP_STATE) ||
        path.join(appData, 'ailis', 'desktop-state.json');
    const preferences = fs.existsSync(statePath)
        ? JSON.parse(fs.readFileSync(statePath, 'utf8')).preferences || {}
        : {};
    const settings = {
        provider: normalizeText(env.AILIS_AGENTBENCH_PROVIDER || preferences.llmProvider, 'openai-compatible'),
        baseUrl: normalizeText(env.AILIS_AGENTBENCH_BASE_URL || preferences.llmBaseUrl),
        model: normalizeText(env.AILIS_AGENTBENCH_MODEL || preferences.llmModel),
        apiKey: normalizeText(env.AILIS_AGENTBENCH_API_KEY || preferences.llmApiKey),
        temperature: 0.8,
        timeoutMs: Math.max(5_000, Number(env.AILIS_AGENTBENCH_TIMEOUT_MS) || 180_000)
    };
    const localProvider = settings.provider === 'ollama' || settings.provider === 'vllm';
    if (!settings.baseUrl || !settings.model || (!localProvider && !settings.apiKey)) {
        throw new Error(`AILIS desktop LLM settings are incomplete: ${statePath}`);
    }
    return settings;
}

function readJsonRequest(request, maxBytes = 8 * 1024 * 1024) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        let size = 0;
        request.on('data', (chunk) => {
            size += chunk.length;
            if (size > maxBytes) {
                reject(Object.assign(new Error('request body too large'), { statusCode: 413 }));
                request.destroy();
                return;
            }
            chunks.push(chunk);
        });
        request.on('end', () => {
            try {
                resolve(JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}'));
            } catch (error) {
                reject(Object.assign(error, { statusCode: 400 }));
            }
        });
        request.on('error', reject);
    });
}

function writeJson(response, statusCode, payload) {
    response.writeHead(statusCode, { 'content-type': 'application/json; charset=utf-8' });
    response.end(`${JSON.stringify(payload)}\n`);
}

function normalizeUsage(usage = {}) {
    const promptTokens = Number(usage.prompt_tokens ?? usage.promptTokens ?? usage.input_tokens ?? 0);
    const completionTokens = Number(
        usage.completion_tokens ?? usage.completionTokens ?? usage.output_tokens ?? 0
    );
    return {
        prompt_tokens: promptTokens,
        completion_tokens: completionTokens,
        total_tokens: Number(usage.total_tokens ?? usage.totalTokens ?? promptTokens + completionTokens)
    };
}

function serializeArguments(call = {}) {
    if (typeof call.rawArguments === 'string') return call.rawArguments;
    if (typeof call.arguments === 'string') return call.arguments;
    return JSON.stringify(call.arguments && typeof call.arguments === 'object' ? call.arguments : {});
}

export function buildOpenAiAssistantMessage(result = {}, idFactory = randomUUID) {
    const toolCalls = (Array.isArray(result.toolCalls) ? result.toolCalls : []).map((call, index) => ({
        id: normalizeText(call?.id, `call_${idFactory()}_${index}`),
        type: 'function',
        function: {
            name: normalizeText(call?.name),
            arguments: serializeArguments(call)
        }
    })).filter((call) => call.function.name);
    const content = normalizeText(result.content);
    const message = {
        role: 'assistant',
        content,
        ...(toolCalls.length ? { tool_calls: toolCalls } : {})
    };
    const reasoningContent = normalizeText(
        result?.providerMessage?.reasoning_content || result?.providerMessage?.reasoningContent
    );
    if (reasoningContent) message.reasoning_content = reasoningContent;
    return message;
}

export function validateFcChatRequest(payload = {}) {
    if (!Array.isArray(payload.messages) || !payload.messages.length) {
        throw Object.assign(new Error('messages is required'), { statusCode: 400 });
    }
    if (!Array.isArray(payload.tools) || !payload.tools.length) {
        throw Object.assign(new Error('tools is required for AgentBench FC'), { statusCode: 400 });
    }
    for (const tool of payload.tools) {
        if (tool?.type !== 'function' || !normalizeText(tool?.function?.name)) {
            throw Object.assign(new Error('invalid OpenAI function tool schema'), { statusCode: 400 });
        }
    }
    return payload;
}

export function buildProviderPayload(payload = {}, settings = {}) {
    validateFcChatRequest(payload);
    return {
        messages: payload.messages,
        tools: payload.tools,
        tool_choice: payload.tool_choice || 'auto',
        temperature: Number.isFinite(Number(payload.temperature))
            ? Number(payload.temperature)
            : settings.temperature,
        max_completion_tokens: Number(payload.max_completion_tokens || 1024),
        ...(typeof payload.parallel_tool_calls === 'boolean'
            ? { parallel_tool_calls: payload.parallel_tool_calls }
            : {}),
        timeoutMs: settings.timeoutMs
    };
}

export function buildOpenAiChatResponse(result = {}, idFactory = randomUUID) {
    const message = buildOpenAiAssistantMessage(result, idFactory);
    if (!message.content && !message.tool_calls?.length) {
        throw Object.assign(new Error('configured model returned neither content nor tool_calls'), {
            statusCode: 502,
            code: 'empty_response'
        });
    }
    return {
        id: `chatcmpl-${idFactory()}`,
        object: 'chat.completion',
        created: Math.floor(Date.now() / 1000),
        model: result.model || 'ailis-desktop-configured-model',
        choices: [{
            index: 0,
            message,
            finish_reason: message.tool_calls?.length ? 'tool_calls' : 'stop'
        }],
        usage: normalizeUsage(result.usage)
    };
}

function appendAudit(filePath, value) {
    fs.appendFileSync(filePath, `${JSON.stringify(value)}\n`, 'utf8');
}

export function createAgentBenchFcBridge({ settings, auditDir }) {
    fs.mkdirSync(auditDir, { recursive: true });
    const auditPath = path.join(auditDir, 'provider-calls.jsonl');
    return http.createServer(async (request, response) => {
        if (request.method === 'GET' && request.url === '/health') {
            writeJson(response, 200, {
                ok: true,
                protocol: 'openai_function_calling',
                provider: settings.provider,
                model: settings.model
            });
            return;
        }
        if (request.method !== 'POST' || request.url !== '/v1/chat/completions') {
            writeJson(response, 404, { error: { message: 'not_found', type: 'invalid_request_error' } });
            return;
        }
        const startedAt = Date.now();
        try {
            const payload = await readJsonRequest(request);
            const result = await callDesktopLlmProvider(settings, buildProviderPayload(payload, settings));
            if (result?.ok !== true) {
                const error = Object.assign(
                    new Error(result?.error || 'configured model provider failed'),
                    { statusCode: 502, code: result?.code || 'provider_error' }
                );
                throw error;
            }
            const responsePayload = buildOpenAiChatResponse(result);
            appendAudit(auditPath, {
                at: new Date().toISOString(),
                ok: true,
                duration_ms: Date.now() - startedAt,
                provider: result.provider || settings.provider,
                model: result.model || settings.model,
                input_message_count: payload.messages.length,
                input_tool_count: payload.tools.length,
                output_tool_call_count: responsePayload.choices[0].message.tool_calls?.length || 0,
                usage: responsePayload.usage
            });
            writeJson(response, 200, responsePayload);
        } catch (error) {
            appendAudit(auditPath, {
                at: new Date().toISOString(),
                ok: false,
                duration_ms: Date.now() - startedAt,
                provider: settings.provider,
                model: settings.model,
                code: normalizeText(error?.code, 'bridge_error'),
                error: error?.message || String(error)
            });
            writeJson(response, error?.statusCode || 502, {
                error: {
                    message: error?.message || String(error),
                    type: error?.statusCode === 400 ? 'invalid_request_error' : 'provider_error',
                    code: normalizeText(error?.code, 'bridge_error')
                }
            });
        }
    });
}

async function main() {
    const options = parseArgs();
    const settings = readDesktopLlmSettings();
    const server = createAgentBenchFcBridge({ settings, auditDir: options.auditDir });
    await new Promise((resolve, reject) => {
        server.once('error', reject);
        server.listen(options.port, options.host, resolve);
    });
    console.log(JSON.stringify({
        ok: true,
        host: options.host,
        port: options.port,
        provider: settings.provider,
        model: settings.model,
        protocol: 'openai_function_calling'
    }));
    const stop = () => server.close(() => process.exit(0));
    process.once('SIGINT', stop);
    process.once('SIGTERM', stop);
}

if (path.resolve(process.argv[1] || '') === fileURLToPath(import.meta.url)) {
    main().catch((error) => {
        console.error(error?.stack || error);
        process.exitCode = 1;
    });
}
