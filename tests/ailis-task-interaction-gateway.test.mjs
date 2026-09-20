import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { AILISGateway } = require('../electron/ailis-gateway.cjs');
const { AILISAgentRunner } = require('../electron/agent-loop/runner.cjs');
const { AILISTaskInteraction } = require('../electron/ailis-task-interaction.cjs');
const deferred = () => { let resolve; const promise = new Promise(r => { resolve = r; }); return { promise, resolve }; };

test('desktop proactive reply forwards the existing context to host ownership without a second gateway call', async t => {
    const previousWindow = globalThis.window;
    const requests = [];
    globalThis.window = { ailisDesktop: { tasks: { proactive: async request => {
        requests.push(request); return { ok: true, status: 'completed', text: '同一个最终回复', displayText: '同一个最终回复', hostOwned: true };
    } } } };
    t.after(() => { globalThis.window = previousWindow; });
    const { AILISDesktopChatService, buildProactiveCompanionHeartbeatDeveloperMessage } = await import('../src/ailis-chat-service.js');
    const service = Object.create(AILISDesktopChatService.prototype);
    service.ensureReady = async () => ({ workspaceRoot: os.tmpdir() });
    service.gateway = { runAgent: () => { throw new Error('must not launch a second actor'); } };
    const history = [{ role: 'user', content: '原来的用户消息' }];
    const reply = await service.generateProactiveCompanionReply({ sessionId: 'test-host-proactive', messageHistory: history, mode: 'companion' });
    assert.equal(reply.ok, true); assert.equal(reply.hostOwned, true); assert.equal(requests.length, 1);
    assert.equal(requests[0].ephemeralDeveloperMessage, buildProactiveCompanionHeartbeatDeveloperMessage(history));
    assert.equal(requests[0].suppressCurrentUserMessage, true);
});

test('exact runner targeting never falls back to another run or session', async () => {
    const runner = Object.create(AILISAgentRunner.prototype);
    runner.activeRuns = new Map([['r', { runId: 'r', sessionId: 's', acceptingInput: true, pendingInputs: [] }]]);
    assert.equal(runner.enqueueRunInput({ runId: 'gone', sessionId: 's', message: 'lost' }), false);
    assert.equal(runner.enqueueRunInput({ runId: 'r', sessionId: 'other', message: 'wrong' }), false);
    assert.equal((await runner.requestInterruptRun({ runId: 'gone', sessionId: 's' })).ok, false);
    assert.equal(runner.enqueueRunInput({ runId: 'r', sessionId: 's', message: 'right', clientMessageId: 'client-123' }), true);
    assert.equal(runner.drainRunInputs('r')[0].clientMessageId, 'client-123');
});

test('real gateway + EXEC + local patch + queued input + final share one durable task', { timeout: 30000 }, async t => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-task-chain-'));
    const requests = [], firstRequest = deferred(), releaseFirst = deferred();
    const server = http.createServer(async (req, res) => {
        let raw = ''; for await (const chunk of req) raw += chunk;
        requests.push(JSON.parse(raw));
        const first = requests.length === 1;
        if (first) {
            res.writeHead(200, { 'content-type': 'text/event-stream' });
            const emit = value => res.write(`data: ${JSON.stringify(value)}\n\n`);
            emit({ choices: [{ delta: { content: '先创建证据文件，再核对补充要求。' } }] });
            firstRequest.resolve(); await releaseFirst.promise;
            emit({ choices: [{ delta: { tool_calls: [{ index: 0, id: 'patch-one', type: 'function', function: {
                name: 'exec', arguments: JSON.stringify({ input: 'text(await tools.update_plan({plan:[{step:"创建证据文件",status:"in_progress"}]})); text(await tools.apply_patch("*** Begin Patch\\n*** Add File: evidence.txt\\n+verified\\n*** End Patch"));' })
            } }] }, finish_reason: 'tool_calls' }], usage: { prompt_tokens: 100, completion_tokens: 20, total_tokens: 120 } });
            res.end('data: [DONE]\n\n'); return;
        }
        res.writeHead(200, { 'content-type': 'application/json' });
        res.end(JSON.stringify({ choices: [{ message: first ? { role: 'assistant', content: '先创建证据文件，再核对补充要求。', tool_calls: [{ id: 'patch-one', type: 'function', function: {
            name: 'exec', arguments: JSON.stringify({ input: 'text(await tools.apply_patch("*** Begin Patch\\n*** Add File: evidence.txt\\n+verified\\n*** End Patch"));' })
        } }] } : { role: 'assistant', content: '完成，新增 evidence.txt；已看到追加要求。' }, finish_reason: first ? 'tool_calls' : 'stop' }],
            usage: { prompt_tokens: 100, completion_tokens: 20, total_tokens: 120 } }));
    });
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    const gateway = new AILISGateway({ port: 0, workspaceRoot: root, projectRoot: path.resolve('.'), auditDir: path.join(root, '.audit'),
        emberHarnessEnabled: false, profileCurationEnabled: false, getDefaultContext: () => ({ approved: true }) });
    const host = new AILISTaskInteraction({ rootDir: path.join(root, '.interaction'), gateway,
        getSettings: () => ({ provider: 'openai-compatible', baseUrl: `http://127.0.0.1:${server.address().port}/v1`, apiKey: 'local-fixture-only',
            model: 'test-model', temperature: 0, timeoutMs: 10000 }) });
    t.after(async () => { releaseFirst.resolve(); host.dispose(); await gateway.stop(); server.closeAllConnections(); await new Promise(r => server.close(r)); await fs.rm(root, { recursive: true, force: true }); });
    const receipt = await host.submit({ sessionId: 'integration', clientMessageId: 'input-first', text: '创建一个证据文件' });
    await firstRequest.promise;
    await new Promise(resolve => setTimeout(resolve, 180));
    const streamingRun = host.snapshot('integration').runs[0];
    assert.ok(streamingRun.items.some(item => item.kind === 'draft' && item.text === '先创建证据文件，再核对补充要求。'), 'text arrives before the model response and tool call finish');
    assert.equal(streamingRun.items.filter(item => item.kind === 'tool').length, 0);
    const extra = await host.submit({ sessionId: 'integration', expectedRunId: receipt.runId, clientMessageId: 'input-extra', text: '完成后说明文件名' });
    assert.equal(extra.status, 'queued');
    assert.equal(host.snapshot('integration').runs[0].items.find(item => item.id === 'input-extra').status, 'queued');
    releaseFirst.resolve(); await host.active.get('integration').promise;
    const run = host.snapshot('integration').runs[0];
    assert.equal(run.status, 'completed', JSON.stringify(run));
    assert.equal(await fs.readFile(path.join(root, 'evidence.txt'), 'utf8').catch(error => `${error.message}\n${JSON.stringify(requests[1]?.messages.filter(m => m.role === 'tool'))}`), 'verified\n');
    assert.equal(run.items.find(item => item.id === 'input-extra').status, 'included');
    assert.ok(requests[1].messages.some(message => message.role === 'user' && message.content.includes('完成后说明文件名')));
    const artifact = run.items.find(item => item.kind === 'file');
    assert.ok(artifact, JSON.stringify(run));
    assert.equal(host.readResource({ sessionId: 'integration', runId: run.id, resourceId: artifact.afterRef.id }).text, 'verified\n');
    assert.ok(run.items.some(item => item.kind === 'tool' && item.tool === 'exec'));
    const progressIndex = run.items.findIndex(item => item.kind === 'progress' && item.text === '先创建证据文件，再核对补充要求。');
    assert.ok(progressIndex >= 0, 'existing model public progress reaches the host without an extra model call');
    assert.equal(run.items.filter(item => item.text === '先创建证据文件，再核对补充要求。').length, 1, 'stream and completed progress are one message');
    assert.ok(run.items.some(item => item.kind === 'plan' && item.plan[0].step === '创建证据文件'), 'EXEC update_plan reaches presentation');
    assert.ok(progressIndex < run.items.findIndex(item => item.kind === 'tool' && item.tool === 'exec'), 'public progress precedes its tool execution');
    assert.equal(host.snapshot('integration').runs.length, 1, 'human correction does not create a second run');
    assert.equal(requests.length, 2, 'feedback rendering needs no extra model request');
    assert.ok(run.items.some(item => item.kind === 'tool' && item.tool === 'apply_patch'));
    assert.equal(run.items.filter(item => item.kind === 'assistant').length, 1);
    assert.equal(gateway.activeUnifiedTurns.size, 0);
});
