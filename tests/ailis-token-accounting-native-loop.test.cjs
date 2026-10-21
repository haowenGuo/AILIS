const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const http = require('node:http');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const bridge = require('../electron/codex-model-bridge.cjs');

test('native Gateway loop anchors usage through the real Responses serializer and SSE parser', { timeout: 20000 }, async t => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-native-token-accounting-'));
    const ciphertext = 'x'.repeat(1600000);
    const requests = [];
    let rejectRequest = false;
    const server = http.createServer(async (req, res) => {
        let text = ''; for await (const chunk of req) text += chunk;
        const body = JSON.parse(text);
        requests.push(body);
        if (rejectRequest) {
            res.writeHead(503, { 'content-type': 'application/json' });
            res.end(JSON.stringify({ error: { message: 'Synthetic transport interruption.' } }));
            return;
        }
        const output = requests.length === 1 ? [
            { type: 'reasoning', id: 'meter-reasoning', summary: [], encrypted_content: ciphertext },
            { type: 'custom_tool_call', call_id: 'meter-call', name: 'exec', input: 'text("measured-feedback");' }
        ] : [{ type: 'message', role: 'assistant', content: [{ type: 'output_text', text: 'Measurement verified.' }] }];
        const response = { id: `meter-${requests.length}`, status: 'completed', output,
            usage: { input_tokens: 50000, output_tokens: 2000, total_tokens: 52000 } };
        res.writeHead(200, { 'content-type': 'text/event-stream' });
        res.end(`data: ${JSON.stringify({ type: 'response.completed', response })}\n\n`);
    });
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    const url = `http://127.0.0.1:${server.address().port}/responses`;

    // Replace authentication/TLS to the external service only. Serialization,
    // SSE parsing, canonical items, Gateway execution and checkpointing stay real.
    t.mock.method(bridge, 'callCodexModelBridge', async (settings, payload, messages) => {
        const body = bridge.buildCodexResponsesRequest(settings, payload, messages);
        const result = await bridge.runCodexResponsesInference(settings,
            { accessToken: 'local-test-only', accountId: 'local-test-account' }, body, {
                timeoutMs: 10000,
                createAgent: async () => ({ agent: null }),
                requestImpl: (options, callback) => http.request(url, { method: 'POST', headers: options.headers }, callback)
            });
        if (!result.ok) return result;
        const items = bridge.codexResponsesCanonicalItems(result.outputItems);
        const toolCalls = bridge.normalizeBridgeToolCalls(items.filter(item =>
            item.type === 'function_call' || item.type === 'custom_tool_call').map(item => ({
                id: item.call_id, type: item.type === 'custom_tool_call' ? 'custom' : 'function',
                name: item.name, arguments: item.type === 'custom_tool_call' ? { input: item.input } : item.arguments
            })));
        return { ok: true, provider: 'codex-model-bridge', model: body.model,
            content: bridge.codexResponsesOutputText(items), toolCalls, nativeToolCalls: toolCalls.length > 0,
            usage: bridge.normalizeCodexUsage(result.usage), providerMessage: { responseItems: items } };
    });
    // Load after the transport boundary is installed, in this test's isolated worker.
    const { AILISGateway } = require('../electron/ailis-gateway.cjs');
    const gateway = new AILISGateway({ port: 0, workspaceRoot: root, projectRoot: path.resolve('.'),
        auditDir: path.join(root, '.audit'), emberHarnessEnabled: false, profileCurationEnabled: false });
    t.after(async () => {
        await new Promise(resolve => { server.close(resolve); server.closeAllConnections(); });
        await gateway.stop();
        assert.equal(path.dirname(path.resolve(root)), path.resolve(os.tmpdir()));
        assert.ok(path.basename(root).startsWith('ailis-native-token-accounting-'));
        await fs.rm(root, { recursive: true, force: true });
    });
    const sessionId = 'native-token-accounting-integration';
    const result = await gateway.runAgent({ message: 'Print measured-feedback, then finish.', sessionId,
        context: { agentRole: 'unified_agent', agentLoop: 'llm', directToolExecutor: true, maxSteps: 4,
            permissionProfile: 'danger-full-access', approvalPolicy: 'auto', confirmationPolicy: 'auto',
            executeExternal: true, allowOutsideWorkspace: true, allowComputerWideAccess: true, allowSystemMutation: false,
            contextSoftTokenLimit: 220000, contextHardTokenLimit: 244800, contextStopTokenLimit: 258400,
            llmSettings: { provider: 'codex-model-bridge', model: 'gpt-6-luna', reasoningEffort: 'xhigh', timeoutMs: 10000 } } });
    assert.equal(result.status, 'completed', result.displayText);
    assert.equal(requests.length, 2, 'an inflated ciphertext estimate must not add a summary request');
    assert.equal(requests[1].input.find(item => item.type === 'reasoning').encrypted_content, ciphertext);
    assert.deepEqual(requests[1].input.slice(0, requests[0].input.length), requests[0].input);
    for (const key of ['model', 'instructions', 'tools', 'reasoning', 'parallel_tool_calls', 'prompt_cache_key'])
        assert.deepEqual(requests[1][key], requests[0][key]);
    const transcript = await gateway.runtime.readTranscript(result.runId, 2000);
    const snapshots = transcript.items.filter(item => item.type === 'agent.context_snapshot');
    assert.equal(snapshots.length, 2);
    const report = snapshots[1].payload.context_package.budgetReport;
    assert.equal(report.measurement.mode, 'provider_usage_anchor');
    assert.equal(report.measurement.unit, 'tokens');
    assert.equal(report.measurement.anchor, 52000, 'numeric meter values must survive audit sanitization');
    assert.ok(report.measurement.inputEstimate > 52000);
    assert.equal(report.measurement.reserve, 8192);
    assert.equal(report.shouldCompact, false);
    assert.equal(transcript.items.some(item => item.type === 'agent.context_compaction'), false);
    const checkpoint = gateway.sessionContextStore.getCheckpoint(sessionId);
    assert.equal(checkpoint.token_usage_anchor.tokens, 52000);
    rejectRequest = true;
    const interrupted = await gateway.runAgent({ message: 'Continue checking.', sessionId,
        modelTransportRetryAttempts: 0,
        context: { agentRole: 'unified_agent', agentLoop: 'llm', directToolExecutor: true, maxSteps: 1,
            permissionProfile: 'danger-full-access', approvalPolicy: 'auto', confirmationPolicy: 'auto',
            contextSoftTokenLimit: 220000, contextHardTokenLimit: 244800, contextStopTokenLimit: 258400,
            llmSettings: { provider: 'codex-model-bridge', model: 'gpt-6-luna', reasoningEffort: 'xhigh', timeoutMs: 10000 } } });
    assert.equal(interrupted.ok, false);
    assert.deepEqual(gateway.sessionContextStore.getCheckpoint(sessionId).token_usage_anchor,
        checkpoint.token_usage_anchor, 'a failed model request must retain the last successful measurement');
});
