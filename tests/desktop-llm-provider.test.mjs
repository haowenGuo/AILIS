import assert from 'node:assert/strict';
import http from 'node:http';
import { after, before, describe, it } from 'node:test';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const {
    buildChatCompletionsUrl,
    callDesktopLlmProvider
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
            receivedRequest = {
                method: request.method,
                url: request.url,
                authorization: request.headers.authorization,
                contentType: request.headers['content-type'],
                body: JSON.parse(body)
            };

            response.writeHead(200, {
                'content-type': 'application/json'
            });
            response.end(JSON.stringify({
                choices: [
                    {
                        message: {
                            content: '[action:wave][expression:happy]你好呀'
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
});
