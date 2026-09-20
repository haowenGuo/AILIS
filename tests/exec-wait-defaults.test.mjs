import assert from 'node:assert/strict';
import test from 'node:test';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { validateToolContract } = require('../electron/ailis-tool-contracts.cjs');
const { validateNativeDirectToolCall } = require('../electron/agent-loop/index.cjs');
const { createExecWaitToolSpec, createExecToolSpec } = require('../electron/codex-code-mode-protocol.cjs');
const { AILISCodeModeRuntime } = require('../electron/ailis-code-mode-runtime.cjs');

function native(args) {
    return validateNativeDirectToolCall({ name: 'exec_wait', arguments: args }, [createExecWaitToolSpec()]);
}

test('exec_wait accepts omitted, null, and valid options at both validation gates', () => {
    for (const options of [{}, { yield_time_ms: null, max_tokens: null, terminate: null },
        { yield_time_ms: 0, max_tokens: 1, terminate: false },
        { yield_time_ms: 300000, max_tokens: 50000, terminate: true }]) {
        const args = { cell_id: 'test-cell', ...options };
        assert.equal(native(args).ok, true);
        assert.equal(validateToolContract('exec_wait', args).ok, true);
    }
});

test('exec_wait still rejects incorrect types, bounds, extra fields and missing identity', async () => {
    const runtime = new AILISCodeModeRuntime({ dispatchTool: async () => ({}) });
    const invalid = [{}, { cell_id: null }, { cell_id: 42 },
        ...[{ yield_time_ms: '1000' }, { yield_time_ms: -1 }, { yield_time_ms: 300001 },
            { yield_time_ms: NaN }, { max_tokens: 0 }, { max_tokens: 50001 },
            { max_tokens: '10000' }, { terminate: 'false' }, { terminate: 1 },
            { unexpected: true }].map(options => ({ cell_id: 'test-cell', ...options }))];
    for (const args of invalid) {
        assert.equal(native(args).ok, false, JSON.stringify(args));
        assert.equal(validateToolContract('exec_wait', args).ok, false);
        await assert.rejects(runtime.wait(args), /Invalid exec_wait arguments/);
    }
});

test('exec_wait applies safe defaults and preserves explicit zero/false without terminating', async () => {
    for (const options of [{}, { yield_time_ms: null, max_tokens: null, terminate: null },
        { yield_time_ms: 0, max_tokens: 7, terminate: false }]) {
        const runtime = new AILISCodeModeRuntime({ dispatchTool: async () => ({}) });
        const cell = { completed: false, terminated: false };
        runtime.cells.set('test-cell', cell);
        let waited;
        runtime.waitForSignal = async (_cell, ms) => { waited = ms; };
        runtime.formatResponse = (_cell, opts) => opts;
        runtime.sendToWorker = () => assert.fail('default wait must not terminate');
        const result = await runtime.wait({ cell_id: 'test-cell', ...options });
        assert.equal(waited, options.yield_time_ms ?? 10000);
        assert.equal(result.maxTokens, options.max_tokens ?? 10000);
        assert.equal(cell.terminated, false);
    }
});

test('explicit terminate still stops only the selected cell', async () => {
    const runtime = new AILISCodeModeRuntime({ dispatchTool: async () => ({}) });
    const cell = { completed: false, terminated: false, child: { kill() {} } };
    runtime.cells.set('test-cell', cell);
    const other = { terminated: false };
    runtime.cells.set('other-cell', other);
    let sent;
    runtime.sendToWorker = (target, message) => { sent = { target, message }; };
    runtime.formatResponse = () => ({});
    runtime.waitForSignal = () => assert.fail('termination must not wait');
    await runtime.wait({ cell_id: 'test-cell', terminate: true });
    assert.equal(cell.terminated, true);
    assert.equal(other.terminated, false);
    assert.equal(sent.target, cell);
    assert.equal(sent.message.type, 'terminate');
});

test('real EXEC -> yielded cell -> native null arguments -> wait -> result', async () => {
    const runtime = new AILISCodeModeRuntime({ dispatchTool: async () => ({ text: 'wait-defaults-ok' }) });
    const spec = createExecToolSpec([{ type: 'function', name: 'echo', description: 'Test echo', parameters: { type: 'object', properties: {}, additionalProperties: false } }]);
    const first = await runtime.execute({
        input: '// @exec: {"yield_time_ms": 0}\nawait new Promise(resolve => setTimeout(resolve, 60)); text((await tools.echo({})).text);',
        profileId: spec.x_ailis_code_mode_profile
    });
    assert.equal(first.status, 'running');
    const checked = native({ cell_id: first.details.cell_id, yield_time_ms: null, max_tokens: null, terminate: null });
    assert.equal(checked.ok, true);
    const result = await runtime.wait(checked.args);
    assert.equal(result.status, 'completed');
    assert.match(result.text, /wait-defaults-ok/);
});
