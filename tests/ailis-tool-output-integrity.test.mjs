import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { AILISRuntime } = require('../electron/ailis-runtime.cjs');
const { AILISCodeModeRuntime } = require('../electron/ailis-code-mode-runtime.cjs');
const { createExecToolSpec } = require('../electron/codex-code-mode-protocol.cjs');
const { makeAilisToolResult, normalizeAilisToolOutput } = require('../electron/ailis-tool-result.cjs');
const { toolInlineByteLimit } = require('../electron/ailis-tool-output-limits.cjs');
const { AILISToolRuntimeRegistry, AILISRuntimeTool } = require('../electron/ailis-tool-runtime.cjs');
const fixtures = JSON.parse(await fs.readFile(new URL('./fixtures/tool-output-history-20260903.json', import.meta.url), 'utf8'));

async function makeRuntime(t) {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-output-integrity-'));
    t.after(() => fs.rm(workspaceRoot, { recursive: true, force: true }));
    return new AILISRuntime({ workspaceRoot, projectRoot: path.resolve('.'), auditDir: path.join(workspaceRoot, '.audit') });
}

function execResult(raw) {
    return makeAilisToolResult({ text: raw, details: {
        status: 'completed', output: raw, stdout: raw, exit_code: 0,
        original_token_count: Math.ceil(raw.length / 4), wall_time_seconds: 0.01
    } });
}

for (const fixture of fixtures) {
    test(`historical ${fixture.callId}: body survives normalization, guard and real exec isolate`, async (t) => {
        const runtime = await makeRuntime(t);
        const guarded = runtime.guardToolResult(normalizeAilisToolOutput(execResult(fixture.raw), { toolId: 'exec_command' }), { toolId: 'exec_command' });
        assert.equal(createHash('sha256').update(fixture.raw).digest('hex'), fixture.sha256);
        for (const value of [guarded.content[0].text, guarded.details.output, guarded.details.stdout, guarded.structuredContent.output]) {
            assert.equal(value, fixture.raw);
        }
        assert.ok(fixture.raw.length > fixture.oldReturnedChars);
        const spec = createExecToolSpec([{ type: 'function', name: 'exec_command', description: 'Fixture replay.',
            parameters: { type: 'object', properties: { cmd: { type: 'string' } }, additionalProperties: false } }]);
        const codeMode = new AILISCodeModeRuntime({ dispatchTool: async () => guarded });
        const response = await codeMode.execute({ input: 'const r = await tools.exec_command({cmd:"fixture"}); text(r.output);',
            profileId: spec.x_ailis_code_mode_profile, context: { sessionId: fixture.callId } });
        assert.equal(response.ok, true);
        assert.ok(response.text.includes(fixture.raw), 'model-facing exec output must include byte-identical tool text');
    });
}

test('shared envelope preserves whitespace, arrays, nested schema, binary and error metadata', async (t) => {
    const runtime = await makeRuntime(t);
    const payload = { output: ' \n' + 'x'.repeat(24000) + '\n\n',
        rows: Array.from({ length: 80 }, (_, i) => ({ i, text: ' '.repeat(i) + 'row\n' })),
        schema: { type: 'object', properties: { nested: { properties: { query: { description: 'd'.repeat(2200) } } } } },
        instructions: 'literal tool data', apiKey: 'test-private-value', input_tokens: 15000 };
    const media = { type: 'image', mimeType: 'image/png', data: 'AA=='.repeat(2000) };
    const guarded = runtime.guardToolResult(makeAilisToolResult({
        content: [{ type: 'text', text: payload.output }, media, { type: 'text', text: ' \n\t' }, { type: 'text', text: '' }], details: payload
    }), { toolId: 'read' });
    assert.equal(guarded.content[0].text, payload.output);
    assert.deepEqual(guarded.content[1], media);
    assert.equal(guarded.content[2].text, ' \n\t');
    assert.equal(guarded.content[3].text, '');
    assert.deepEqual(guarded.details.rows, payload.rows);
    assert.deepEqual(guarded.structuredContent.schema, payload.schema);
    assert.equal(guarded.details.instructions, payload.instructions);
    assert.equal(guarded.details.apiKey, '__REDACTED__');
    assert.equal(guarded.details.input_tokens, 15000);
    assert.equal(guarded.details.observationContract.complete, true);
    const error = normalizeAilisToolOutput(makeAilisToolResult({ isError: true, status: 'failed', text: '  failed\n', details: { errorCode: 'test_failure' } }));
    assert.equal(error.isError, true);
    assert.equal(error.content[0].text, '  failed\n');
    assert.equal(error.details.observationContract.complete, false);
    for (const value of [0, false, '', '  literal\n']) {
        assert.equal(runtime.guardToolResult(value).content[0].text, String(value));
    }
});

test('only explicitly requested text budgets apply, with truthful truncation metadata', () => {
    const original = makeAilisToolResult({ content: [{ type: 'text', text: '  first\n' }, { type: 'text', text: 'x'.repeat(1000) }], details: { stdout: 'x'.repeat(3000) } });
    for (const budget of [0, 1, 2, 8, 18, 50, 100, 512]) {
        const result = normalizeAilisToolOutput(original, { maxTextChars: budget });
        assert.ok(result.content.reduce((n, p) => n + p.text.length, 0) <= budget, `budget ${budget}`);
        assert.equal(result.details.stdout, original.details.stdout);
        assert.equal(result.details.observationContract.truncated, true);
        assert.equal(result.details.observationContract.complete, false);
    }
    for (const maxTextChars of [undefined, null, NaN, -1]) {
        const result = normalizeAilisToolOutput(original, { maxTextChars });
        assert.deepEqual(result.content, original.content);
        assert.equal(result.details.observationContract.complete, true);
    }
    assert.equal(normalizeAilisToolOutput(makeAilisToolResult({ text: '' })).content[0].text, '');
});

test('MCP overflow archives the complete response, preserves errors/media, and is readable in pages', async (t) => {
    const runtime = await makeRuntime(t);
    for (const isError of [false, true]) {
        const original = makeAilisToolResult({ isError, status: isError ? 'failed' : 'completed', text: '  中🙂\n'.repeat(24000),
            details: { apiKey: 'hidden', rows: Array.from({ length: 50 }, (_, n) => n) },
            content: [{ type: 'text', text: '  中🙂\n'.repeat(24000) }, { type: 'image', mimeType: 'image/png', data: 'AA==' }] });
        const bounded = await runtime.boundToolOutput(original, { toolId: 'mcp__fixture__large' });
        assert.equal(bounded.isError, isError);
        assert.equal(bounded.details.status, original.details.status);
        assert.equal(bounded.details.outputDelivery, 'artifact');
        assert.ok(Buffer.byteLength(JSON.stringify(bounded)) < 256 * 1024);
        assert.deepEqual(bounded.content[1], original.content[1]);
        const read = await runtime.outputStore.read({ outputId: bounded.details.outputId, limit: 512 * 1024 });
        assert.equal(read.hasMore, false);
        const saved = JSON.parse(read.text);
        assert.equal(saved.content[0].text, original.content[0].text);
        assert.equal(saved.details.apiKey, '__REDACTED__');
        assert.deepEqual(saved.details.rows, original.details.rows);
        const view = runtime.guardToolResult(bounded, { toolId: 'mcp__fixture__large' });
        assert.equal(view.details.observationContract.complete, false);
        assert.equal(view.details.observationContract.truncated, true);
    }
    const small = execResult('  small\n');
    assert.equal(await runtime.boundToolOutput(small, { toolId: 'mcp__fixture__small' }), small);
    assert.equal(toolInlineByteLimit('exec_command'), null);
    assert.equal(toolInlineByteLimit('read'), null);
    assert.equal(toolInlineByteLimit('tool_doctor'), 128 * 1024);
    assert.equal(toolInlineByteLimit('external__fixture__large'), 256 * 1024);
});

test('registry applies missing-producer budgets after exactly one execution', async (t) => {
    const runtime = await makeRuntime(t);
    const registry = new AILISToolRuntimeRegistry({ runtime });
    let executions = 0;
    registry.register(new AILISRuntimeTool({ definition: { id: 'tool_doctor' }, handle: async () => {
        executions += 1;
        return makeAilisToolResult({ text: 'x'.repeat(150000) });
    } }));
    const result = await registry.dispatch('tool_doctor', { action: 'health_check' });
    assert.equal(executions, 1);
    assert.equal(result.details.outputDelivery, 'artifact');
    runtime.executeMcpBridge = async () => makeAilisToolResult({ text: 'y'.repeat(300000) });
    const direct = await registry.dispatch('mcp__fixture__large', {});
    assert.equal(direct.details.outputDelivery, 'artifact');
});

test('archive failure never claims full storage or changes a successful action into execution failure', async (t) => {
    const runtime = await makeRuntime(t);
    for (const mode of ['throw', 'short-write']) {
        runtime.outputStore.createCapture = async () => {
            if (mode === 'throw') throw new Error('disk unavailable');
            const shortPath = path.join(runtime.workspaceRoot, 'short-output');
            await fs.writeFile(shortPath, 'short');
            return { append() {}, finalize: async () => ({ path: shortPath, outputId: 'not-complete' }) };
        };
        const result = await runtime.boundToolOutput(makeAilisToolResult({ text: 'x'.repeat(300000) }), { toolId: 'mcp__fixture__large' });
        assert.equal(result.isError, false);
        assert.equal(result.details.status, 'completed');
        assert.equal(result.details.outputDelivery, 'archive_failed');
        assert.equal(result.details.outputRef, undefined);
        assert.match(result.content[0].text, /TOOL_OUTPUT_ARCHIVE_FAILED/);
        assert.ok(result.content[0].text.length < 10000);
    }
});

test('oversized media is stored whole rather than clipped or left unlimited inline', async (t) => {
    const runtime = await makeRuntime(t);
    const media = { type: 'image', mimeType: 'image/png', data: 'AA=='.repeat(2200000) };
    const original = makeAilisToolResult({ content: [media] });
    const result = await runtime.boundToolOutput(original, { toolId: 'mcp__fixture__image' });
    assert.equal(result.details.omittedMediaBlocks, 1);
    assert.equal(result.content.some((item) => item.type === 'image'), false);
    const saved = JSON.parse(await fs.readFile(runtime.outputStore.resolveLogPath(result.details.outputId), 'utf8'));
    assert.deepEqual(saved.content[0], media);
    assert.ok(Buffer.byteLength(JSON.stringify(result)) < 256 * 1024);
});

test('output_search keeps full long-line matches in the archive and output_read keeps its own paging cap', async (t) => {
    const runtime = await makeRuntime(t);
    const capture = await runtime.outputStore.createCapture();
    const raw = 'matching-line ' + 'z'.repeat(320000);
    capture.append('stdout', raw);
    const stored = await capture.finalize({ status: 'completed' });
    const registry = require('../electron/ailis-tool-runtime.cjs').createAILISToolRuntimeRegistry(runtime);
    const result = await registry.dispatch('output_search', { outputId: stored.outputId, query: 'matching-line' });
    assert.equal(result.details.outputDelivery, 'artifact');
    const saved = JSON.parse(await fs.readFile(runtime.outputStore.resolveLogPath(result.details.outputId), 'utf8'));
    assert.equal(saved.details.matches[0].text, raw);
    const page = await registry.dispatch('output_read', { outputId: stored.outputId, limit: 100 });
    assert.equal(page.details.returnedBytes, 100);
    assert.equal(page.details.hasMore, true);
    assert.equal(page.content[0].text, raw.slice(0, 100));
});

test('Gateway external adapters use the same explicit producer overflow path', async (t) => {
    const runtime = await makeRuntime(t);
    const { AILISGateway } = require('../electron/ailis-gateway.cjs');
    let calls = 0;
    runtime.capabilityManager.executeVirtualExternalTool = async () => {
        calls += 1;
        return { ok: true, status: 'completed', output: 'external-result\n'.repeat(30000) };
    };
    const result = await AILISGateway.prototype.callAgentRuntimeTool.call({ runtime }, {
        toolId: 'external__fixture__large', args: {}, context: {}, workspaceDir: runtime.workspaceRoot
    });
    assert.equal(calls, 1);
    assert.equal(result.details.outputDelivery, 'artifact');
    const saved = JSON.parse(await fs.readFile(runtime.outputStore.resolveLogPath(result.details.outputId), 'utf8'));
    assert.equal(saved.details.output, 'external-result\n'.repeat(30000));
});
