import assert from 'node:assert/strict';
import http from 'node:http';
import { after, before, describe, it } from 'node:test';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const {
    buildAnthropicMessagesUrl,
    buildChatCompletionsUrl,
    buildGeminiGenerateContentUrl,
    buildOllamaChatUrl,
    buildResponsesUrl,
    callDesktopLlmProvider,
    classifyFetchFailure,
    checkDesktopLlmProvider,
    getProviderCapabilities
} = require('../electron/desktop-llm-provider.cjs');

let server;
let serverUrl;
let receivedRequest;

function readRequestBody(request) {
    return new Promise((resolve, reject) => {
        let body = '';
        request.setEncoding('utf8');
        request.on('data', (chunk) => {
            body += chunk;
        });
        request.on('end', () => resolve(body));
        request.on('error', reject);
    });
}

describe('desktop LLM provider', () => {
    before(async () => {
        server = http.createServer(async (request, response) => {
            const body = await readRequestBody(request);
            const parsedBody = body ? JSON.parse(body) : {};
            receivedRequest = {
                method: request.method,
                url: request.url,
                authorization: request.headers.authorization,
                xApiKey: request.headers['x-api-key'],
                contentType: request.headers['content-type'],
                body: parsedBody
            };

            response.writeHead(200, {
                'content-type': 'application/json'
            });

            if (request.url === '/v1/responses') {
                if (Array.isArray(parsedBody.tools) && parsedBody.tools.length) {
                    response.end(JSON.stringify({
                        output: [
                            {
                                type: 'function_call',
                                call_id: 'call-resp-1',
                                name: parsedBody.tools[0].name,
                                arguments: JSON.stringify({ ok: true, kind: 'tool' })
                            }
                        ],
                        usage: { total_tokens: 8 }
                    }));
                    return;
                }
                response.end(JSON.stringify({
                    output_text: parsedBody.text ? '{"ok":true,"kind":"json"}' : 'OK',
                    usage: { total_tokens: 6 }
                }));
                return;
            }

            if (request.url === '/v1/messages') {
                if (Array.isArray(parsedBody.tools) && parsedBody.tools.length) {
                    response.end(JSON.stringify({
                        content: [
                            {
                                type: 'tool_use',
                                id: 'toolu_1',
                                name: parsedBody.tools[0].name,
                                input: { ok: true, kind: 'tool' }
                            }
                        ],
                        usage: { input_tokens: 4, output_tokens: 4 }
                    }));
                    return;
                }
                response.end(JSON.stringify({
                    content: [
                        {
                            type: 'text',
                            text: parsedBody.system?.includes('JSON') ? '{"ok":true,"kind":"json"}' : 'OK'
                        }
                    ],
                    usage: { input_tokens: 4, output_tokens: 4 }
                }));
                return;
            }

            if (request.url.startsWith('/v1beta/models/gemini-demo:generateContent')) {
                if (Array.isArray(parsedBody.tools) && parsedBody.tools.length) {
                    response.end(JSON.stringify({
                        candidates: [
                            {
                                content: {
                                    parts: [
                                        {
                                            functionCall: {
                                                name: parsedBody.tools[0].functionDeclarations[0].name,
                                                args: { ok: true, kind: 'tool' }
                                            }
                                        }
                                    ]
                                }
                            }
                        ],
                        usageMetadata: { totalTokenCount: 8 }
                    }));
                    return;
                }
                response.end(JSON.stringify({
                    candidates: [
                        {
                            content: {
                                parts: [
                                    {
                                        text: parsedBody.generationConfig?.responseMimeType === 'application/json'
                                            ? '{"ok":true,"kind":"json"}'
                                            : 'OK'
                                    }
                                ]
                            }
                        }
                    ],
                    usageMetadata: { totalTokenCount: 6 }
                }));
                return;
            }

            if (request.url === '/api/chat') {
                response.end(JSON.stringify({
                    message: {
                        role: 'assistant',
                        content: parsedBody.format === 'json'
                            ? '{"ok":true,"kind":"json"}'
                            : '本地 Ollama OK'
                    },
                    prompt_eval_count: 3,
                    eval_count: 4,
                    done: true
                }));
                return;
            }

            if (Array.isArray(parsedBody.tools) && parsedBody.tools.length) {
                response.end(JSON.stringify({
                    choices: [
                        {
                            message: {
                                tool_calls: [
                                    {
                                        id: 'call-chat-1',
                                        type: 'function',
                                        function: {
                                            name: parsedBody.tools[0].function.name,
                                            arguments: JSON.stringify({ ok: true, kind: 'tool' })
                                        }
                                    }
                                ],
                                content: ''
                            }
                        }
                    ],
                    usage: { total_tokens: 9 }
                }));
                return;
            }

            response.end(JSON.stringify({
                choices: [
                    {
                        message: {
                            content: parsedBody.response_format
                                ? '{"ok":true,"kind":"json"}'
                                : '[action:wave][expression:happy]你好呀'
                        }
                    }
                ],
                usage: {
                    total_tokens: 12
                }
            }));
        });

        await new Promise((resolve) => {
            server.listen(0, '127.0.0.1', resolve);
        });
        const address = server.address();
        serverUrl = `http://127.0.0.1:${address.port}`;
    });

    after(async () => {
        await new Promise((resolve) => server.close(resolve));
    });

    it('calls an OpenAI-compatible chat completions endpoint', async () => {
        const result = await callDesktopLlmProvider({
            provider: 'openai-compatible',
            baseUrl: `${serverUrl}/v1`,
            apiKey: 'test-secret-key',
            model: 'demo-model',
            timeoutMs: 5000
        }, {
            messages: [
                { role: 'system', content: 'persona' },
                { role: 'user', content: '你好' }
            ],
            temperature: 0.7
        });

        assert.equal(result.ok, true);
        assert.equal(result.content, '[action:wave][expression:happy]你好呀');
        assert.equal(result.model, 'demo-model');
        assert.equal(receivedRequest.method, 'POST');
        assert.equal(receivedRequest.url, '/v1/chat/completions');
        assert.equal(receivedRequest.authorization, 'Bearer test-secret-key');
        assert.equal(receivedRequest.contentType, 'application/json');
        assert.equal(receivedRequest.body.model, 'demo-model');
        assert.equal(receivedRequest.body.temperature, 0.7);
        assert.deepEqual(receivedRequest.body.messages, [
            { role: 'system', content: 'persona' },
            { role: 'user', content: '你好' }
        ]);
        assert.equal(JSON.stringify(result).includes('test-secret-key'), false);
    });

    it('accepts a full chat completions URL without duplicating the path', () => {
        assert.equal(
            buildChatCompletionsUrl('https://example.test/v1/chat/completions'),
            'https://example.test/v1/chat/completions'
        );
    });

    it('returns a config error before any network call when settings are incomplete', async () => {
        const result = await callDesktopLlmProvider({
            provider: 'openai-compatible',
            baseUrl: `${serverUrl}/v1`,
            model: 'demo-model'
        }, {
            messages: [{ role: 'user', content: '你好' }]
        });

        assert.equal(result.ok, false);
        assert.equal(result.code, 'needs_config');
    });

    it('classifies low-level fetch failures as transient network errors', () => {
        const result = classifyFetchFailure(Object.assign(new Error('fetch failed'), {
            cause: { code: 'ECONNRESET', message: 'socket hang up' }
        }));

        assert.equal(result.code, 'transient_network_error');
        assert.equal(result.details.causeCode, 'ECONNRESET');
    });

    it('calls a vLLM OpenAI-compatible endpoint without requiring an API key', async () => {
        const result = await callDesktopLlmProvider({
            provider: 'vllm',
            baseUrl: `${serverUrl}/v1`,
            model: 'demo-local-model',
            timeoutMs: 5000
        }, {
            messages: [{ role: 'user', content: '你好' }],
            temperature: 0.2
        });

        assert.equal(result.ok, true);
        assert.equal(result.provider, 'vllm');
        assert.equal(result.content, '[action:wave][expression:happy]你好呀');
        assert.equal(receivedRequest.url, '/v1/chat/completions');
        assert.equal(receivedRequest.authorization, undefined);
        assert.equal(receivedRequest.body.model, 'demo-local-model');
        assert.equal(receivedRequest.body.temperature, 0.2);
    });

    it('calls an Ollama /api/chat endpoint without requiring an API key', async () => {
        assert.equal(
            buildOllamaChatUrl('http://127.0.0.1:11434'),
            'http://127.0.0.1:11434/api/chat'
        );
        assert.equal(
            buildOllamaChatUrl('http://127.0.0.1:11434/api'),
            'http://127.0.0.1:11434/api/chat'
        );
        const result = await callDesktopLlmProvider({
            provider: 'ollama',
            baseUrl: serverUrl,
            model: 'llama3.2',
            timeoutMs: 5000
        }, {
            messages: [
                { role: 'system', content: 'persona' },
                { role: 'user', content: '你好' }
            ],
            temperature: 0.3
        });

        assert.equal(result.ok, true);
        assert.equal(result.provider, 'ollama');
        assert.equal(result.content, '本地 Ollama OK');
        assert.equal(receivedRequest.url, '/api/chat');
        assert.equal(receivedRequest.authorization, undefined);
        assert.equal(receivedRequest.body.model, 'llama3.2');
        assert.equal(receivedRequest.body.stream, false);
        assert.deepEqual(receivedRequest.body.messages, [
            { role: 'system', content: 'persona' },
            { role: 'user', content: '你好' }
        ]);
        assert.equal(receivedRequest.body.options.temperature, 0.3);
    });

    it('passes image inputs through as OpenAI-compatible content parts', async () => {
        const result = await callDesktopLlmProvider({
            provider: 'openai-compatible',
            baseUrl: `${serverUrl}/v1`,
            apiKey: 'test-secret-key',
            model: 'demo-model',
            timeoutMs: 5000
        }, {
            messages: [
                {
                    role: 'user',
                    content: [
                        { type: 'text', text: '请看这张截图。' },
                        {
                            type: 'image_url',
                            image_url: {
                                url: 'data:image/png;base64,AAAA'
                            }
                        }
                    ]
                }
            ]
        });

        assert.equal(result.ok, true);
        assert.deepEqual(receivedRequest.body.messages, [
            {
                role: 'user',
                content: [
                    { type: 'text', text: '请看这张截图。' },
                    {
                        type: 'image_url',
                        image_url: {
                            url: 'data:image/png;base64,AAAA'
                        }
                    }
                ]
            }
        ]);
    });

    it('passes response_format for OpenAI-compatible JSON mode', async () => {
        const result = await callDesktopLlmProvider({
            provider: 'openai-compatible',
            baseUrl: `${serverUrl}/v1`,
            apiKey: 'test-secret-key',
            model: 'demo-model',
            timeoutMs: 5000
        }, {
            jsonMode: true,
            messages: [{ role: 'user', content: 'Return JSON.' }]
        });

        assert.equal(result.ok, true);
        assert.equal(result.content, '{"ok":true,"kind":"json"}');
        assert.deepEqual(receivedRequest.body.response_format, { type: 'json_object' });
    });

    it('passes low-latency reasoning controls for OpenAI-compatible requests when explicitly provided', async () => {
        const result = await callDesktopLlmProvider({
            provider: 'openai-compatible',
            baseUrl: `${serverUrl}/v1`,
            apiKey: 'test-secret-key',
            model: 'demo-model',
            timeoutMs: 5000
        }, {
            messages: [{ role: 'user', content: 'Return OK.' }],
            temperature: 0,
            reasoning_effort: 'minimal',
            thinking: { type: 'disabled' },
            max_tokens: 2048,
            parallel_tool_calls: true
        });

        assert.equal(result.ok, true);
        assert.equal(receivedRequest.body.temperature, 0);
        assert.equal(receivedRequest.body.reasoning_effort, 'minimal');
        assert.deepEqual(receivedRequest.body.thinking, { type: 'disabled' });
        assert.equal(receivedRequest.body.max_tokens, 2048);
        assert.equal(receivedRequest.body.parallel_tool_calls, true);
    });

    it('extracts OpenAI-compatible native tool calls', async () => {
        const result = await callDesktopLlmProvider({
            provider: 'openai-compatible',
            baseUrl: `${serverUrl}/v1`,
            apiKey: 'test-secret-key',
            model: 'demo-model',
            timeoutMs: 5000
        }, {
            tools: [
                {
                    name: 'demo_tool',
                    description: 'demo',
                    parameters: {
                        type: 'object',
                        properties: {
                            ok: { type: 'boolean' }
                        }
                    }
                }
            ],
            toolChoice: { name: 'demo_tool', required: true },
            messages: [{ role: 'user', content: 'Use tool.' }]
        });

        assert.equal(result.ok, true);
        assert.equal(result.nativeToolCalls, true);
        assert.equal(result.toolCalls[0].name, 'demo_tool');
        assert.deepEqual(result.toolCalls[0].arguments, { ok: true, kind: 'tool' });
    });

    it('supports OpenAI Responses adapter request and function-call extraction', async () => {
        assert.equal(buildResponsesUrl(`${serverUrl}/v1`), `${serverUrl}/v1/responses`);
        const result = await callDesktopLlmProvider({
            provider: 'openai-responses',
            baseUrl: `${serverUrl}/v1`,
            apiKey: 'openai-test-key',
            model: 'gpt-demo',
            timeoutMs: 5000
        }, {
            tools: [{ name: 'demo_tool', description: 'demo', parameters: { type: 'object' } }],
            toolChoice: { name: 'demo_tool', required: true },
            messages: [
                { role: 'system', content: 'system' },
                { role: 'user', content: 'Use tool.' }
            ]
        });

        assert.equal(result.ok, true);
        assert.equal(receivedRequest.url, '/v1/responses');
        assert.equal(receivedRequest.authorization, 'Bearer openai-test-key');
        assert.equal(receivedRequest.body.instructions, 'system');
        assert.equal(result.toolCalls[0].name, 'demo_tool');
    });

    it('supports Anthropic adapter request and tool-use extraction', async () => {
        assert.equal(buildAnthropicMessagesUrl(`${serverUrl}/v1`), `${serverUrl}/v1/messages`);
        const result = await callDesktopLlmProvider({
            provider: 'anthropic',
            baseUrl: serverUrl,
            apiKey: 'anthropic-test-key',
            model: 'claude-demo',
            timeoutMs: 5000
        }, {
            tools: [{ name: 'demo_tool', description: 'demo', parameters: { type: 'object' } }],
            toolChoice: { name: 'demo_tool', required: true },
            messages: [
                { role: 'system', content: 'system' },
                { role: 'user', content: 'Use tool.' }
            ]
        });

        assert.equal(result.ok, true);
        assert.equal(receivedRequest.url, '/v1/messages');
        assert.equal(receivedRequest.xApiKey, 'anthropic-test-key');
        assert.equal(receivedRequest.body.system, 'system');
        assert.equal(result.toolCalls[0].name, 'demo_tool');
    });

    it('supports Gemini adapter request and functionCall extraction', async () => {
        assert.equal(
            buildGeminiGenerateContentUrl(`${serverUrl}/v1beta`, 'gemini-demo', 'gemini-test-key'),
            `${serverUrl}/v1beta/models/gemini-demo:generateContent?key=gemini-test-key`
        );
        const result = await callDesktopLlmProvider({
            provider: 'gemini',
            baseUrl: `${serverUrl}/v1beta`,
            apiKey: 'gemini-test-key',
            model: 'gemini-demo',
            timeoutMs: 5000
        }, {
            tools: [{ name: 'demo_tool', description: 'demo', parameters: { type: 'object' } }],
            toolChoice: { name: 'demo_tool', required: true },
            messages: [
                { role: 'system', content: 'system' },
                { role: 'user', content: 'Use tool.' }
            ]
        });

        assert.equal(result.ok, true);
        assert.ok(receivedRequest.url.startsWith('/v1beta/models/gemini-demo:generateContent'));
        assert.deepEqual(receivedRequest.body.systemInstruction, { parts: [{ text: 'system' }] });
        assert.equal(result.toolCalls[0].name, 'demo_tool');
    });

    it('runs provider health checks without exposing API keys', async () => {
        const result = await checkDesktopLlmProvider({
            provider: 'openai-compatible',
            baseUrl: `${serverUrl}/v1`,
            apiKey: 'secret-health-key',
            model: 'demo-model',
            timeoutMs: 5000
        }, {
            includeVision: false
        });

        assert.equal(result.ok, true);
        assert.equal(result.checks.basic.ok, true);
        assert.equal(result.checks.json.ok, true);
        assert.equal(result.checks.toolCalling.ok, true);
        assert.equal(JSON.stringify(result).includes('secret-health-key'), false);
    });

    it('runs Ollama health checks while skipping unsupported native tool calling', async () => {
        const result = await checkDesktopLlmProvider({
            provider: 'ollama',
            baseUrl: serverUrl,
            model: 'llama3.2',
            timeoutMs: 5000
        }, {
            includeVision: false
        });

        assert.equal(result.ok, true);
        assert.equal(result.checks.basic.ok, true);
        assert.equal(result.checks.json.ok, true);
        assert.equal(result.checks.toolCalling.skipped, true);
    });

    it('reports model capability heuristics', () => {
        const caps = getProviderCapabilities({
            provider: 'gemini',
            model: 'gemini-2.0-flash'
        });
        assert.equal(caps.nativeToolCalling, true);
        assert.equal(caps.vision, true);
        assert.equal(caps.lowLatency, true);
    });

    it('reports local provider capabilities as model-dependent without native tool forcing', () => {
        const ollamaCaps = getProviderCapabilities({
            provider: 'ollama',
            model: 'llama3.2'
        });
        const vllmCaps = getProviderCapabilities({
            provider: 'vllm',
            model: 'Qwen/Qwen2.5-7B-Instruct'
        });

        assert.equal(ollamaCaps.chat, true);
        assert.equal(ollamaCaps.jsonMode, true);
        assert.equal(ollamaCaps.nativeToolCalling, false);
        assert.equal(vllmCaps.chat, true);
        assert.equal(vllmCaps.jsonMode, true);
        assert.equal(vllmCaps.nativeToolCalling, false);
    });
});
