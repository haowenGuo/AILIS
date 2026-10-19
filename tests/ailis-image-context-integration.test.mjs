import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { AILISGateway } = require('../electron/ailis-gateway.cjs');

test('exec view_image preserves pixels in the second HTTP request without compacting', { timeout: 20000 }, async t => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-image-context-'));
    const sessionId = 'view-image-context-test';
    const gateway = new AILISGateway({ port: 0, workspaceRoot: root, projectRoot: path.resolve('.'),
        auditDir: path.join(root, '.audit'), emberHarnessEnabled: false, profileCurationEnabled: false });
    const bytes = Buffer.concat([
        Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=', 'base64'),
        Buffer.alloc(1100000)
    ]);
    const imagePath = path.join(root, 'image.png');
    await fs.writeFile(imagePath, bytes);
    const source = `image(await tools.view_image({path: ${JSON.stringify(imagePath)}, detail: "original"}));`;
    const requests = [];
    const server = http.createServer(async (request, response) => {
        let raw = ''; for await (const chunk of request) raw += chunk;
        const body = JSON.parse(raw);
        requests.push({ body, checkpoint: gateway.sessionContextStore.getCheckpoint(sessionId) });
        const message = requests.length === 1
            ? { role: 'assistant', tool_calls: [{ id: 'inspect-image', type: 'function',
                function: { name: 'exec', arguments: JSON.stringify({ input: source }) } }] }
            : { role: 'assistant', content: 'Inspection complete.' };
        response.writeHead(200, { 'content-type': 'application/json' });
        response.end(JSON.stringify({ choices: [{ message, finish_reason: 'stop' }],
            usage: { prompt_tokens: 200, completion_tokens: 50, total_tokens: 250 } }));
    });
    t.after(async () => {
        await new Promise(resolve => { server.close(resolve); server.closeAllConnections(); });
        await gateway.stop();
        assert.equal(path.dirname(path.resolve(root)), path.resolve(os.tmpdir()));
        assert.ok(path.basename(root).startsWith('ailis-image-context-'));
        await fs.rm(root, { recursive: true, force: true });
    });
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    const result = await gateway.runAgent({ message: 'Inspect image.png.', sessionId, context: {
        agentRole: 'unified_agent', agentLoop: 'llm', directToolExecutor: true, maxSteps: 4,
        permissionProfile: 'workspace-write', approvalPolicy: 'auto', confirmationPolicy: 'auto',
        executeExternal: true, allowOutsideWorkspace: false, allowComputerWideAccess: false,
        contextSoftTokenLimit: 10000, contextHardTokenLimit: 20000, contextStopTokenLimit: 100000,
        llmSettings: { provider: 'openai-compatible', baseUrl: `http://127.0.0.1:${server.address().port}/v1`,
            apiKey: 'local-test-only', model: 'test-model', temperature: 0, timeoutMs: 10000 }
    } });
    assert.equal(result.status, 'completed', result.displayText);
    assert.equal(requests.length, 2, 'no extra model call for a premature compaction');
    assert.equal(result.cost.own.llm.calls, 2);
    const image = requests[1].body.messages.flatMap(message =>
        Array.isArray(message.content) ? message.content : []).find(part => part.type === 'image_url');
    assert.ok(image, 'the second HTTP request must carry pixels: ' + JSON.stringify({
        steps: result.steps?.map(step => ({ tool: step.tool, status: step.response?.status,
            error: step.response?.error, text: step.response?.result?.text?.slice(0, 1000) })),
        messageTypes: requests[1].body.messages.map(message => ({ role: message.role,
            types: Array.isArray(message.content) ? message.content.map(part => part.type) : typeof message.content }))
    }));
    assert.equal(image.image_url.url, `data:image/png;base64,${bytes.toString('base64')}`);
    const canonicalImage = requests[1].checkpoint.items.flatMap(item => item.output?.body?.value || [])
        .find(part => part.type === 'input_image');
    assert.equal(canonicalImage.image_url, image.image_url.url);
    assert.equal(canonicalImage.detail, 'original');
    const transcript = await gateway.runtime.readTranscript(result.runId, 2000);
    assert.equal(transcript.items.some(event => event.type === 'agent.context_compaction'), false);
});
