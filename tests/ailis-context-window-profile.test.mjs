import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import vm from 'node:vm';
import { Readable } from 'node:stream';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const budget = require('../electron/ailis-runtime-budget.cjs');
const { buildAgentContextBudgetConfig, resolveAgentLlmSettings } = require('../electron/agent-loop/index.cjs');
const { AILISGateway } = require('../electron/ailis-gateway.cjs');
const environment = [
    'AILIS_LLM_CONTEXT_WINDOW_TOKENS', 'AILIS_AGENT_CONTEXT_WINDOW_TOKENS',
    'AILIS_LLM_CONTEXT_SOFT_TOKEN_LIMIT', 'AILIS_AGENT_CONTEXT_SOFT_TOKEN_LIMIT',
    'AILIS_LLM_AUTO_COMPACT_TOKEN_LIMIT', 'AILIS_AGENT_AUTO_COMPACT_TOKEN_LIMIT',
    'AILIS_LLM_EMERGENCY_CONTEXT_TOKEN_LIMIT', 'AILIS_AGENT_EMERGENCY_CONTEXT_TOKEN_LIMIT'
];

test.beforeEach(t => {
    const previous = Object.fromEntries(environment.map(name => [name, process.env[name]]));
    environment.forEach(name => delete process.env[name]);
    t.after(() => {
        for (const [name, value] of Object.entries(previous)) {
            if (value === undefined) delete process.env[name]; else process.env[name] = value;
        }
    });
});

const report = (settings = {}, context = {}, previous = null) =>
    budget.buildContextBudgetReport({}, buildAgentContextBudgetConfig(settings, context, previous));

test('generic ContextManager and runner use identical 512k thresholds for every default model', () => {
    const generic = budget.buildContextBudgetReport();
    for (const model of ['gpt-5.6-luna', 'gpt-6-luna', 'gpt-6-astra', 'unknown-model', '']) {
        const result = report({ model });
        assert.equal(result.inputLimitTokens, 512000);
        assert.deepEqual(result.thresholdTokens, generic.thresholdTokens);
        assert.deepEqual(result.thresholdTokens, { soft: 400000, hard: 460800, stop: 486400 });
    }
});

test('window-only overrides scale all thresholds instead of retaining old Luna limits', () => {
    for (const window of [64000, 128000, 272000, 300000, 512000, 768000, 1000000]) {
        const result = report({ model: 'gpt-6-luna', contextWindowTokens: window });
        assert.equal(result.inputLimitTokens, window);
        assert.equal(result.thresholdTokens.soft, Math.ceil(window * budget.DEFAULT_CONTEXT_SOFT_RATIO));
        assert.equal(result.thresholdTokens.hard, Math.ceil(window * 0.9));
        assert.equal(result.thresholdTokens.stop, Math.min(window - 4096, Math.ceil(window * 0.95)));
        assert.ok(result.thresholdTokens.soft <= result.thresholdTokens.hard);
        assert.ok(result.thresholdTokens.hard <= result.thresholdTokens.stop);
        assert.ok(result.thresholdTokens.stop <= result.effectiveInputLimitTokens);
    }
});

test('request, settings, provider metadata, environment and model defaults retain precedence', () => {
    process.env.AILIS_LLM_CONTEXT_WINDOW_TOKENS = '768000';
    assert.equal(report({ contextWindowTokens: 128000 }, { contextWindowTokens: 64000 }).inputLimitTokens, 64000);
    assert.equal(report({ contextWindowTokens: 128000 }).inputLimitTokens, 128000);
    assert.equal(report({ modelCapabilities: { context_window: 64000 } }).inputLimitTokens, 64000);
    assert.equal(report({ capabilities: { contextWindowTokens: 128000 } }).inputLimitTokens, 128000);
    assert.equal(report({ model: 'gpt-6-luna' }).inputLimitTokens, 768000);
    delete process.env.AILIS_LLM_CONTEXT_WINDOW_TOKENS;
    assert.equal(report({ model: 'gpt-6-luna' }).inputLimitTokens, 512000);
    assert.equal(report({ model_context_window: 128000 }).inputLimitTokens, 128000);
});

test('provider-declared maximum caps both model defaults and explicit larger windows', () => {
    assert.equal(report({ model: 'small-model', capabilities: { max_context_window: 64000 } }).inputLimitTokens, 64000);
    const capped = buildAgentContextBudgetConfig({ model: 'gpt-6-luna', contextWindowTokens: 1000000,
        modelCapabilities: { max_context_window: 872000 } });
    assert.equal(capped.inputLimitTokens, 872000);
    assert.equal(capped.contextWindowSource, 'provider_context_window_cap');
    assert.equal(report({ contextWindowTokens: 128000, capabilities: { max_context_window: 872000 } }).inputLimitTokens, 128000);
});

test('old checkpoint budgets never pin upgraded defaults or leak across model switches', () => {
    for (const previous of [
        { model: 'gpt-6-luna', contextWindowTokens: 272000, contextWindowSource: 'builtin_model_profile:gpt-6-luna' },
        { model: 'previous-model', context_window_tokens: 1000000 },
        { contextWindowTokens: 256000, contextWindowSource: 'conservative_runtime_fallback' }
    ]) {
        assert.equal(report({ model: 'gpt-6-luna' }, {}, previous).inputLimitTokens, 512000);
        assert.equal(report({ model: 'small-model', capabilities: { context_window: 64000 } }, {}, previous).inputLimitTokens, 64000);
    }
});

test('explicit ratios, absolute thresholds, output reserves and legacy environment overrides still work', () => {
    const ratios = report({ contextWindowTokens: 512000, contextSoftRatio: 0.6,
        contextHardRatio: 0.8, contextStopRatio: 0.9 });
    assert.deepEqual(ratios.thresholdTokens, { soft: 307200, hard: 409600, stop: 460800 });
    const absolute = report({ contextWindowTokens: 512000, contextHardRatio: 0.5,
        contextSoftTokenLimit: 220000, contextHardTokenLimit: 244800, contextStopTokenLimit: 258400 });
    assert.deepEqual(absolute.thresholdTokens, { soft: 220000, hard: 244800, stop: 258400 });
    process.env.AILIS_AGENT_CONTEXT_WINDOW_TOKENS = '272000';
    process.env.AILIS_AGENT_AUTO_COMPACT_TOKEN_LIMIT = '244800';
    assert.equal(report().thresholdTokens.hard, 244800);
    assert.equal(report().inputLimitTokens, 272000);
    const reserved = report({ contextWindowTokens: 512000, reservedOutputTokens: 128000 });
    assert.equal(reserved.effectiveInputLimitTokens, 384000);
    assert.ok(reserved.thresholdTokens.stop <= 384000);
    assert.equal(report({ contextWindowTokens: 512000, reserved_output_tokens: 128000 })
        .effectiveInputLimitTokens, 384000);
});

test('headless settings normalization preserves windows, capabilities and threshold overrides', () => {
    const source = { provider: 'openai-responses', baseUrl: 'http://localhost/v1', apiKey: 'test-only',
        model: 'small-model', context_window_tokens: 64000, contextHardRatio: 0.8,
        capabilities: { context_window: 64000, max_context_window: 128000 } };
    const resolved = resolveAgentLlmSettings({ llmSettings: source });
    assert.deepEqual(budget.pickContextBudgetSettings(resolved), budget.pickContextBudgetSettings(source));
    assert.equal(report(resolved).inputLimitTokens, 64000);
    assert.equal(report(resolved).thresholdTokens.hard, 51200);
});

test('desktop direct and managed-server entry points preserve explicit budget settings', async () => {
    const source = await fs.readFile(new URL('../electron/main.cjs', import.meta.url), 'utf8');
    const start = source.indexOf('function buildTemporaryLlmSettings(');
    const end = source.indexOf('function getPersistedEmailProfiles(', start);
    const resolve = vm.runInNewContext(`${source.slice(start,end)}; resolveAgentRunLlmSettings`, {
        pickContextBudgetSettings: budget.pickContextBudgetSettings,
        getResolvedLlmSettings: () => ({ provider: 'ailis-cloud' }),
        normalizeLlmProvider: value => value, normalizeLlmBaseUrl: value => value,
        normalizeLlmModel: value => value, normalizeLlmApiKey: value => value,
        normalizeLlmTemperature: value => value, normalizeLlmRequestTimeoutMs: value => value,
        getDefaultProviderBaseUrl: () => 'https://example.test/v1',
        getDefaultProviderModel: () => 'managed-model', getPersistedLlmApiKeyForProvider: () => '',
        getEnvironmentLlmApiKey: () => '', DEFAULT_LLM_TEMPERATURE: 0.2, DEFAULT_LLM_REQUEST_TIMEOUT_MS: 45000
    });
    for (const provider of ['openai-responses', 'ailis-cloud']) {
        const result = resolve({ provider, contextWindowTokens: 128000, contextHardTokenLimit: 110000 });
        assert.equal(result.contextWindowTokens, 128000);
        assert.equal(result.contextHardTokenLimit, 110000);
    }
});

test('Gateway default budget continues above the old compaction point through a real two-call HTTP loop', { timeout: 20000 }, async t => {
    const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-window-512k-'));
    const requests = [];
    const server = http.createServer(async (req, res) => {
        let text = ''; for await (const chunk of req) text += chunk;
        requests.push(JSON.parse(text));
        const output = requests.length === 1
            ? [{ type: 'function_call', call_id: 'window-check', name: 'exec',
                arguments: JSON.stringify({ input: 'text("window-check");' }) }]
            : [{ type: 'message', role: 'assistant', content: [{ type: 'output_text', text: 'Done.' }] }];
        res.setHeader('content-type', 'application/json');
        res.end(JSON.stringify({ id: `window-${requests.length}`, output,
            usage: { input_tokens: 300000, output_tokens: 1000, total_tokens: 301000 } }));
    });
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    const gateway = new AILISGateway({ port: 0, workspaceRoot: directory, projectRoot: path.resolve('.'),
        auditDir: path.join(directory, '.audit'), emberHarnessEnabled: false, profileCurationEnabled: false });
    t.after(async () => {
        await new Promise(resolve => { server.close(resolve); server.closeAllConnections(); });
        await gateway.stop();
        assert.equal(path.dirname(directory), path.resolve(os.tmpdir()));
        assert.ok(path.basename(directory).startsWith('ailis-window-512k-'));
        await fs.rm(directory, { recursive: true, force: true });
    });
    const result = await gateway.runAgent({ message: 'Print window-check, then finish.', sessionId: 'window-512k-test',
        context: { agentRole: 'unified_agent', agentLoop: 'llm', directToolExecutor: true, maxSteps: 4,
            permissionProfile: 'danger-full-access', approvalPolicy: 'auto', confirmationPolicy: 'auto',
            executeExternal: true, allowOutsideWorkspace: true, allowComputerWideAccess: true,
            llmSettings: { provider: 'openai-responses', baseUrl: `http://127.0.0.1:${server.address().port}/v1`,
                apiKey: 'local-test-only', model: 'gpt-6-luna', timeoutMs: 10000 } } });
    assert.equal(result.status, 'completed', result.displayText);
    assert.equal(requests.length, 2, 'no hidden summary at the old 244800 threshold');
    assert.deepEqual(requests[1].input.slice(0,requests[0].input.length), requests[0].input);
    const transcript = await gateway.runtime.readTranscript(result.runId, 2000);
    const snapshots = transcript.items.filter(item => item.type === 'agent.context_snapshot');
    assert.equal(snapshots.length, 2);
    const current = snapshots[1].payload.context_package.budgetReport;
    assert.equal(current.measurement.inputEstimate, 300000);
    assert.equal(current.shouldCompact, false);
    assert.equal(gateway.sessionContextStore.getCheckpoint('window-512k-test').token_info.contextWindowTokens, 512000);
    assert.equal(transcript.items.some(item => item.type === 'agent.context_compaction'), false);
});

test('Gateway HTTP entry accepts a context larger than the old byte limits', { timeout: 20000 }, async t => {
    const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-window-http-'));
    class EchoGateway extends AILISGateway {
        async runAgent(body) { return { ok: true, bytes: Buffer.byteLength(body.message) }; }
    }
    const gateway = new EchoGateway({ port: 0, workspaceRoot: directory, projectRoot: path.resolve('.'),
        auditDir: path.join(directory,'.audit'), emberHarnessEnabled: false, profileCurationEnabled: false });
    t.after(async () => {
        await gateway.stop();
        assert.equal(path.dirname(directory), path.resolve(os.tmpdir()));
        assert.ok(path.basename(directory).startsWith('ailis-window-http-'));
        await fs.rm(directory, { recursive: true, force: true });
    });
    await gateway.start();
    const message = 'x'.repeat(8 * 1024 * 1024);
    const response = await fetch(`http://127.0.0.1:${gateway.server.address().port}/agent/run`, {
        method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ message })
    });
    assert.equal(response.status, 200);
    assert.equal((await response.json()).bytes, message.length);
});

test('Gateway still rejects request bodies above 16 MiB', async () => {
    const stream = Readable.from([Buffer.alloc(16 * 1024 * 1024 + 1, 'x')]);
    await assert.rejects(AILISGateway.prototype.readJsonBody(stream),
        error => error.statusCode === 413 && error.code === 'payload_too_large');
});
