const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const http = require('node:http');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const bridge = require('../electron/codex-model-bridge.cjs');

test('native Responses recovery preserves history, pixels and usage without replaying tools', { timeout: 20000 }, async t => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-native-recovery-'));
    const requests = [], events = [], checkpoints = [], tools = [];
    const ciphertext = 'fixture-encrypted-reasoning';
    let failures = 0;
    const server = http.createServer(async (req, res) => {
        req.setEncoding('utf8');
        let raw = ''; for await (const chunk of req) raw += chunk;
        const body = JSON.parse(raw);
        requests.push({ raw, body });
        if (requests.length > 1 && failures++ < 2) {
            if (failures === 1) {
                // A truncated tool call must never enter canonical history.
                res.writeHead(200, { 'content-type': 'text/event-stream' });
                res.write(`data: ${JSON.stringify({ type: 'response.output_item.added', output_index: 0,
                    item: { type: 'custom_tool_call', call_id: 'partial-must-not-run', name: 'exec', input: '' } })}\n\n`);
                setTimeout(() => res.destroy(), 20);
            } else {
                res.writeHead(503, { 'content-type': 'application/json' });
                res.end(JSON.stringify({ error: { message: 'Synthetic outage.' } }));
            }
            return;
        }
        const output = requests.length === 1 ? [
            { type: 'reasoning', id: 'recovery-reasoning', summary: [], encrypted_content: ciphertext },
            { type: 'custom_tool_call', call_id: 'executed-once', name: 'exec',
                input: 'text("EXISTING_ARTIFACT_FROM_TOOL"); image("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=");' }
        ] : [{ type: 'message', role: 'assistant', content: [{ type: 'output_text', text: 'Recovery verified.' }] }];
        const response = { id: `recovery-${requests.length}`, status: 'completed', output,
            usage: { input_tokens: 50000, output_tokens: 2000, total_tokens: 52000 } };
        res.writeHead(200, { 'content-type': 'text/event-stream' });
        res.end(`data: ${JSON.stringify({ type: 'response.completed', response })}\n\n`);
    });
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    const url = `http://127.0.0.1:${server.address().port}/responses`;
    // Substitute only external auth/TLS; retain the serializer and SSE parser.
    t.mock.method(bridge, 'callCodexModelBridge', async (settings, payload, messages) => {
        const body = bridge.buildCodexResponsesRequest(settings, payload, messages);
        const result = await bridge.runCodexResponsesInference(settings,
            { accessToken: 'fixture-only', accountId: 'fixture-account' }, body, {
                timeoutMs: payload.timeoutMs,
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
    const { AILISGateway } = require('../electron/ailis-gateway.cjs');
    const gateway = new AILISGateway({ port: 0, workspaceRoot: root, projectRoot: path.resolve('.'),
        auditDir: path.join(root, '.audit'), emberHarnessEnabled: false, profileCurationEnabled: false });
    const emit = gateway.emitGatewayEvent.bind(gateway);
    gateway.emitGatewayEvent = (name, data) => {
        if (name === 'agent.llm_request') events.push(data);
        if (name === 'tool.call.success') tools.push(data);
        return emit(name, data);
    };
    t.after(async () => {
        await new Promise(resolve => { server.close(resolve); server.closeAllConnections(); });
        await gateway.stop();
        assert.equal(path.dirname(path.resolve(root)), path.resolve(os.tmpdir()));
        assert.ok(path.basename(root).startsWith('ailis-native-recovery-'));
        await fs.rm(root, { recursive: true, force: true });
    });
    const result = await gateway.runAgent({ message: 'Produce fixture feedback and inspect its image, then finish.',
        sessionId: 'native-recovery-integration', modelTransportRecoveryDeadlineMs: Date.now() + 15000,
        onModelInputContextCheckpoint: checkpoint => checkpoints.push(JSON.stringify(checkpoint)),
        context: { agentRole: 'unified_agent', agentLoop: 'llm', directToolExecutor: true, maxSteps: 4,
            permissionProfile: 'workspace-write', approvalPolicy: 'auto', confirmationPolicy: 'auto',
            executeExternal: true, allowOutsideWorkspace: false, allowComputerWideAccess: false,
            llmSettings: { provider: 'codex-model-bridge', model: 'gpt-6-luna', reasoningEffort: 'xhigh', timeoutMs: 10000 } } });
    assert.equal(result.status, 'completed', result.displayText);
    assert.equal(requests.length, 4, 'two model turns, with two failed transport attempts');
    assert.equal(requests[2].raw, requests[1].raw);
    assert.equal(requests[3].raw, requests[1].raw);
    assert.match(requests[3].raw, /EXISTING_ARTIFACT_FROM_TOOL/);
    assert.match(requests[3].raw, /input_image/);
    assert.match(requests[3].raw, /fixture-encrypted-reasoning/);
    assert.doesNotMatch(requests[3].raw, /partial-must-not-run/);
    assert.ok(checkpoints.some(cp => cp.includes('EXISTING_ARTIFACT_FROM_TOOL')));
    assert.equal(events.filter(event => event.diagnostic?.event === 'retry_scheduled').length, 2);
    assert.ok(events.some(event => event.diagnostic?.event === 'recovery_succeeded'));
    const transcript = await gateway.runtime.readTranscript(result.runId, 2000);
    assert.equal(tools.filter(item => item.tool === 'exec').length, 1);
    assert.equal(transcript.items.some(item => item.type === 'agent.context_compaction'), false);
    assert.equal(result.cost.own.llm.calls, 2, 'transport retries must not consume agent steps');
});
