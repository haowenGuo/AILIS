import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { AILISGateway } = require('../electron/ailis-gateway.cjs');
const item = (role, text) => ({ type: 'message', role,
    content: [{ type: role === 'assistant' ? 'output_text' : 'input_text', text }] });
const sessionId = 'unified-compaction-regression';
const currentRequest = 'Continue the inspection. Keep all files read-only; verify evidence-ref-42.';
const oldMarker = 'OLD_UNCOMPACTED_TRACE';
const memory = [
    '<ailis_semantic_task_memory>',
    'Objective: finish the repository inspection; the latest request requires read-only work.',
    'Completed: inspected the first file. Evidence: evidence-ref-42; output reference: output-ref-42.',
    'Pending: verify the remaining result. Do not repeat completed work or modify files.',
    '</ailis_semantic_task_memory>'
].join('\n');

async function fixture(t, { compactionFailure = '', longHistory = true } = {}) {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-unified-compaction-'));
    const options = { port: 0, workspaceRoot: root, projectRoot: path.resolve('.'),
        auditDir: path.join(root, '.audit'), emberHarnessEnabled: false, profileCurationEnabled: false };
    const gateways = [];
    const makeGateway = () => { const instance = new AILISGateway(options); gateways.push(instance); return instance; };
    let gateway = makeGateway();
    const requests = [];
    const server = http.createServer(async (request, response) => {
        let body = ''; for await (const chunk of request) body += chunk;
        const data = JSON.parse(body);
        const compact = JSON.stringify(data.messages.at(-1)).includes('<ailis_semantic_compaction_request>');
        requests.push({ body: data, compact, checkpoint: gateway.sessionContextStore.getCheckpoint(sessionId) });
        if (compact && compactionFailure === 'http') {
            response.writeHead(400, { 'content-type': 'application/json' });
            response.end(JSON.stringify({ error: { message: 'Synthetic compaction rejection' } }));
            return;
        }
        response.writeHead(200, { 'content-type': 'application/json' });
        response.end(JSON.stringify({ choices: [{ message: { role: 'assistant',
            content: compact ? (compactionFailure === 'invalid' ? 'Invalid short summary' : memory) : 'Inspection complete.' },
            finish_reason: 'stop' }], usage: { prompt_tokens: 200, completion_tokens: 50, total_tokens: 250 } }));
    });
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    t.after(async () => {
        await new Promise(resolve => { server.close(resolve); server.closeAllConnections(); });
        for (const instance of gateways) await instance.stop();
        // Delete only the specific synthetic workspace created by this test.
        assert.equal(path.dirname(path.resolve(root)), path.resolve(os.tmpdir()));
        assert.ok(path.basename(root).startsWith('ailis-unified-compaction-'));
        await fs.rm(root, { recursive: true, force: true });
    });
    if (longHistory) {
        const items = [item('user', 'Inspect the repository without changing files.'),
            item('assistant', `${oldMarker}\n${'historical trace '.repeat(12000)}`),
            { type: 'function_call', name: 'exec', call_id: 'old-call', arguments: 'text("already inspected");' },
            { type: 'function_call_output', call_id: 'old-call', output: 'Evidence: evidence-ref-42; output reference: output-ref-42.' },
            item('assistant', 'The first file is inspected; one verification remains.')];
        gateway.sessionContextStore.commitCheckpoint(sessionId, { history_version: items.length, items });
    }
    const context = { agentRole: 'unified_agent', agentLoop: 'llm', directToolExecutor: true,
        contextSoftTokenLimit: 10000, contextHardTokenLimit: 20000, contextStopTokenLimit: 100000,
        llmSettings: { provider: 'openai-compatible', baseUrl: `http://127.0.0.1:${server.address().port}/v1`,
            apiKey: 'local-test-only', model: 'test-model', temperature: 0, timeoutMs: 10000 } };
    return { get gateway() { return gateway; }, requests, context,
        restart: async () => { await gateway.stop(); gateway = makeGateway(); return gateway; } };
}

for (const level of ['hard', 'stop']) {
    test(`unified ${level} budget compacts before decision, persists memory and restores it after restart`, async t => {
        const f = await fixture(t);
        if (level === 'stop') f.context.contextStopTokenLimit = 40000;
        const result = await f.gateway.runAgent({ message: currentRequest, sessionId, context: f.context });
        assert.equal(result.status, 'completed');
        assert.deepEqual(f.requests.map(x => x.compact), [true, false], 'must summarize before the next ordinary decision');
        assert.equal(result.cost.own.llm.calls, 2, 'include the compaction request in model cost accounting');
        const [summaryRequest, decision] = f.requests;
        assert.equal(summaryRequest.body.tool_choice, 'none');
        assert.ok(JSON.stringify(summaryRequest.body.messages).includes(oldMarker));
        const decisionText = JSON.stringify(decision.body.messages);
        assert.ok(!decisionText.includes(oldMarker), 'raw old trace must not be replayed after semantic replacement');
        assert.match(decisionText, /ailis_semantic_task_memory/);
        assert.match(decisionText, /evidence-ref-42/);
        assert.match(decisionText, /output-ref-42/);
        assert.equal(decision.body.messages.filter(x => x.role === 'user' && x.content === currentRequest).length, 1);
        assert.match(JSON.stringify(decision.checkpoint), /ailis_semantic_task_memory/,
            'canonical Session must be durably replaced before the ordinary request');
        const transcript = await f.gateway.runtime.readTranscript(result.runId, 2000);
        const compactions = transcript.items.filter(x => x.type === 'agent.context_compaction');
        assert.equal(compactions.length, 1);
        assert.equal(compactions[0].payload.mode, 'portable_semantic_summary');
        assert.equal(compactions[0].payload.reason, level);
        await f.restart();
        const resumed = await f.gateway.runAgent({ message: 'What remains?', sessionId, context: f.context });
        assert.equal(resumed.status, 'completed');
        assert.deepEqual(f.requests.map(x => x.compact), [true, false, false], 'small restored memory must not compact again');
        const resumedInput = JSON.stringify(f.requests.at(-1).body.messages);
        assert.match(resumedInput, /ailis_semantic_task_memory/);
        assert.ok(!resumedInput.includes(oldMarker));
        assert.ok(resumedInput.includes(currentRequest));
        assert.ok(resumedInput.includes('What remains?'));
    });
}

for (const compactionFailure of ['http', 'invalid']) {
    test(`unified compaction ${compactionFailure} failure uses the existing explicit local fallback`, async t => {
        const f = await fixture(t, { compactionFailure });
        const result = await f.gateway.runAgent({ message: currentRequest, sessionId, context: f.context });
        assert.equal(result.status, 'completed');
        assert.deepEqual(f.requests.map(x => x.compact), [true, false]);
        const transcript = await f.gateway.runtime.readTranscript(result.runId, 2000);
        const compactions = transcript.items.filter(x => x.type === 'agent.context_compaction');
        assert.equal(compactions.length, 1);
        assert.equal(compactions[0].payload.mode, 'local_rule_fallback');
        assert.ok(compactions[0].payload.providerFailure?.code);
        const nextInput = JSON.stringify(f.requests[1].body.messages);
        assert.match(nextInput, /ailis.session_context_checkpoint.v2/);
        assert.ok(nextInput.includes(currentRequest));
        assert.match(JSON.stringify(f.requests[1].checkpoint), /ailis.session_context_checkpoint.v2/);
        assert.equal(f.requests[1].body.messages.some(x => String(x.content).includes('<ailis_semantic_compaction_request>')), false);
    });
}

test('unified soft budget does not call the compaction model', async t => {
    const f = await fixture(t, { longHistory: false });
    const context = { ...f.context, contextSoftTokenLimit: 500,
        contextHardTokenLimit: 100000, contextStopTokenLimit: 110000 };
    const result = await f.gateway.runAgent({ message: currentRequest, sessionId, context });
    assert.equal(result.status, 'completed');
    assert.deepEqual(f.requests.map(x => x.compact), [false]);
    assert.equal(result.cost.own.llm.calls, 1);
    const transcript = await f.gateway.runtime.readTranscript(result.runId, 2000);
    assert.equal(transcript.items.some(x => x.type === 'agent.context_compaction'), false);
    assert.equal(transcript.items.find(x => x.type === 'agent.context_snapshot').payload.context_package.budgetReport.level, 'soft');
});
