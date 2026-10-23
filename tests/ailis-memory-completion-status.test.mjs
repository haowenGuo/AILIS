import assert from 'node:assert/strict';
import http from 'node:http';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { callDesktopLlmProvider } = require('../electron/desktop-llm-provider.cjs');
const { AILISHierarchicalUserMemory } = require('../electron/ailis-hierarchical-user-memory.cjs');

const cases = [
    ['openai-compatible', 'length', { choices: [{ message: { content: 'Partial summary.' }, finish_reason: 'length' }] }],
    ['openai-compatible', 'content_filter', { choices: [{ message: { content: 'Filtered partial.' }, finish_reason: 'content_filter' }] }],
    ['openai-responses', 'max_output_tokens', { output_text: 'Partial summary.', status: 'incomplete', incomplete_details: { reason: 'max_output_tokens' } }],
    ['anthropic', 'max_tokens', { content: [{ type: 'text', text: 'Partial summary.' }], stop_reason: 'max_tokens' }],
    ['gemini', 'MAX_TOKENS', { candidates: [{ content: { parts: [{ text: 'Partial summary.' }] }, finishReason: 'MAX_TOKENS' }] }],
    ['ollama', 'length', { message: { content: 'Partial summary.' }, done: true, done_reason: 'length' }],
    ['openai-compatible', 'length', null]
];

for (const [provider, reason, body] of cases) {
    const stream = body === null;
    test(`memory retains children after actual ${provider} adapter reports ${reason}${stream ? ' (SSE)' : ''}`, async t => {
        const root = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-memory-status-'));
        const server = http.createServer(async (request, response) => {
            for await (const _ of request) { /* Consume the local synthetic request. */ }
            if (stream) {
                response.writeHead(200, { 'content-type': 'text/event-stream' });
                response.write('data: {"choices":[{"delta":{"content":"Partial summary."},"finish_reason":"length"}]}\n\n');
                response.end('data: [DONE]\n\n');
            } else {
                response.writeHead(200, { 'content-type': 'application/json' });
                response.end(JSON.stringify(body));
            }
        });
        await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
        t.after(async () => {
            server.closeAllConnections();
            await new Promise(resolve => server.close(resolve));
            await fs.rm(root, { recursive: true, force: true });
        });
        const baseUrl = `http://127.0.0.1:${server.address().port}`;
        let observed;
        const store = new AILISHierarchicalUserMemory({ rootDir: root, mergeInputTokens: 100,
            maxPromptChars: 2000,
            llmClient: async payload => {
                observed = await callDesktopLlmProvider({ provider, baseUrl, model: 'synthetic-model',
                    apiKey: 'synthetic-key', timeoutMs: 5000 },
                { ...payload, ...(stream ? { onTextDelta: () => {} } : {}) });
                return observed;
            } });
        for (let i = 0; i < 2; i++) store.appendCompaction({ sessionId: 'synthetic', sourceId: String(i),
            summary: 'Synthetic previous conversation material. '.repeat(16) });
        const originalIds = store.state.frontier.map(node => node.id);
        const result = await store.consolidate();
        assert.equal(observed.ok, true);
        assert.equal(observed.finishReason, reason);
        assert.equal(result.ok, false);
        assert.equal(store.getStatus().mergeCount, 0);
        assert.deepEqual(store.state.frontier.map(node => node.id), originalIds);
    });
}
