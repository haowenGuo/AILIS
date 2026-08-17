import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

function listen(server, port = 0) {
    return new Promise((resolve, reject) => {
        server.once('error', reject);
        server.listen(port, '127.0.0.1', () => resolve(server.address()));
    });
}

function closeServer(server) {
    return new Promise((resolve) => server.close(resolve));
}

async function reservePort() {
    const server = http.createServer();
    const address = await listen(server);
    await closeServer(server);
    return address.port;
}

async function waitForHealth(url, child) {
    const deadline = Date.now() + 10_000;
    while (Date.now() < deadline) {
        if (child.exitCode !== null) {
            throw new Error(`hosted runtime exited early with code ${child.exitCode}`);
        }
        try {
            const response = await fetch(`${url}/health`);
            if (response.ok) {
                return;
            }
        } catch {
            // Runtime is still starting.
        }
        await new Promise((resolve) => setTimeout(resolve, 50));
    }
    throw new Error('hosted runtime did not become healthy');
}

test('hosted runtime relays JSON and streaming completions with server-owned credentials', async () => {
    const upstreamRequests = [];
    const upstream = http.createServer(async (request, response) => {
        const chunks = [];
        for await (const chunk of request) {
            chunks.push(chunk);
        }
        const body = JSON.parse(Buffer.concat(chunks).toString('utf8'));
        upstreamRequests.push({
            authorization: request.headers.authorization,
            body
        });
        if (body.stream) {
            response.writeHead(200, { 'content-type': 'text/event-stream; charset=utf-8' });
            response.write('data: {"choices":[{"delta":{"role":"assistant","content":"relay "}}]}\n\n');
            response.write('data: {"choices":[{"delta":{"content":"ok"},"finish_reason":"stop"}],"usage":{"total_tokens":7}}\n\n');
            response.end('data: [DONE]\n\n');
            return;
        }
        response.writeHead(200, { 'content-type': 'application/json' });
        response.end(JSON.stringify({
            choices: [{ message: { role: 'assistant', content: 'relay ok' }, finish_reason: 'stop' }],
            usage: { total_tokens: 7 }
        }));
    });
    const upstreamAddress = await listen(upstream);
    const runtimePort = await reservePort();
    const dataRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-hosted-llm-relay-'));
    const runtime = spawn(process.execPath, ['scripts/start-ailis-hosted-runtime.cjs'], {
        cwd: path.resolve('.'),
        env: {
            ...process.env,
            AILIS_HOSTED_RUNTIME_HOST: '127.0.0.1',
            AILIS_HOSTED_RUNTIME_PORT: String(runtimePort),
            AILIS_HOSTED_RUNTIME_INTERNAL_TOKEN: 'internal-test-token',
            AILIS_HOSTED_DATA_ROOT: dataRoot,
            AILIS_AGENT_LLM_PROVIDER: 'openai-compatible',
            AILIS_LLM_BASE_URL: `http://127.0.0.1:${upstreamAddress.port}/v1`,
            AILIS_LLM_API_KEY: 'server-owned-key',
            AILIS_LLM_MODEL: 'server-owned-model'
        },
        stdio: ['ignore', 'pipe', 'pipe']
    });
    const runtimeUrl = `http://127.0.0.1:${runtimePort}`;

    try {
        await waitForHealth(runtimeUrl, runtime);
        const headers = {
            'content-type': 'application/json',
            'x-ailis-internal-token': 'internal-test-token'
        };
        const jsonResponse = await fetch(`${runtimeUrl}/llm/chat/completions`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                model: 'client-must-not-control-this',
                apiKey: 'client-must-not-send-this',
                messages: [{ role: 'user', content: 'hello' }]
            })
        });
        assert.equal(jsonResponse.status, 200);
        const json = await jsonResponse.json();
        assert.equal(json.model, 'ailis-cloud');
        assert.equal(json.choices[0].message.content, 'relay ok');

        const streamResponse = await fetch(`${runtimeUrl}/llm/chat/completions`, {
            method: 'POST',
            headers: { ...headers, accept: 'text/event-stream' },
            body: JSON.stringify({
                stream: true,
                messages: [{ role: 'user', content: 'stream hello' }]
            })
        });
        assert.equal(streamResponse.status, 200);
        const stream = await streamResponse.text();
        assert.match(stream, /"content":"relay "/);
        assert.match(stream, /"content":"ok"/);
        assert.match(stream, /data: \[DONE\]/);

        assert.equal(upstreamRequests.length, 2);
        assert.equal(upstreamRequests[0].authorization, 'Bearer server-owned-key');
        assert.equal(upstreamRequests[0].body.model, 'server-owned-model');
        assert.equal(upstreamRequests[0].body.apiKey, undefined);
        assert.equal(upstreamRequests[1].body.model, 'server-owned-model');
        assert.equal(upstreamRequests[1].body.stream, true);
    } finally {
        runtime.kill();
        await Promise.race([
            new Promise((resolve) => runtime.once('exit', resolve)),
            new Promise((resolve) => setTimeout(resolve, 3000))
        ]);
        await closeServer(upstream);
        await fs.rm(dataRoot, { recursive: true, force: true });
    }
});
