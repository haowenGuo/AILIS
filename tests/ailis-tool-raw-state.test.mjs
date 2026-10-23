import assert from 'node:assert/strict';
import test from 'node:test';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { AILISCodeModeRuntime } = require('../electron/ailis-code-mode-runtime.cjs');
const { createExecToolSpec } = require('../electron/codex-code-mode-protocol.cjs');
const { normalizeToolOutput, toolOutputToResponseItems } = require('../electron/ailis-agent-object-model.cjs');
const { ContextManager } = require('../electron/ailis-context-manager.cjs');
const { responseItemsToWireItems, FunctionCallOutputPayload } = require('../electron/ailis-response-model.cjs');

function modelFeedback(result, { tool = 'exec', callType = 'custom', ok = true, ...options } = {}) {
    const normalized = normalizeToolOutput({ tool, callType, callId: 'call_state',
        durationMs: 123, response: { ok, status: ok ? 'completed' : 'failed', result } });
    const items = toolOutputToResponseItems(normalized, options);
    const projected = FunctionCallOutputPayload.toWireValue(items.find(item => item.type.endsWith('_output')).output);
    const manager = new ContextManager();
    manager.recordItems(items);
    const restored = ContextManager.fromCheckpoint(manager.toCheckpoint());
    const wire = responseItemsToWireItems(restored.rawItems());
    const output = wire.find(item => item.type.endsWith('_output')).output;
    return { normalized, output, projected };
}

test('raw executor states and open-ended metadata survive a completed Gateway envelope', () => {
    for (const tool of ['exec', 'exec_wait', 'exec_command', 'write_stdin']) {
        for (const status of ['running', 'completed', 'terminated', 'failed']) {
            const text = `Script ${status}\nWall time 0.0 seconds\nOutput:\n  literal\n\n`;
            const details = { cell_id: 'cell_raw', running: status === 'running',
                completed: status === 'completed', terminated: status === 'terminated',
                custom_future_field: { value: 0, enabled: false, missing: null },
                outputStore: { outputId: 'raw_output', bytes: 111, lineCount: 3, previewTruncated: true } };
            const { normalized, output, projected } = modelFeedback({ status, text, details },
                { tool, callType: tool === 'exec' ? 'custom' : 'function' });
            assert.equal(normalized.details.status, status);
            assert.doesNotMatch(output, /^Status:/m);
            assert.ok(projected.endsWith(text), 'tool projection must preserve the executor text');
            // 既有 ContextManager 会清理尾部空白；本候选不修改上下文层。
            assert.ok(output.endsWith(text.trimEnd()));
            const rawMetadata = JSON.parse(output.split('\n').find(line => line.startsWith('{')));
            assert.deepEqual(rawMetadata, { ...details, status });
            assert.match(output, /DurationMs: 123/);
            assert.match(output, /OutputArtifactTools:/);
            assert.doesNotMatch(output, /Execution:|publicExecution/);
        }
    }
});

test('process state is not collapsed into tool-call success or failure', () => {
    const details = { status: 'completed', process_status: 'running', running: true,
        session_id: 12, exit_code: null, signal: null, wall_time_seconds: 0,
        chunk_id: 'chunk_raw', output: 'before\n', stdout: 'before\n', stderr: '' };
    const { output } = modelFeedback({ content: [{ type: 'text', text: details.output }], details },
        { tool: 'exec_command', callType: 'function' });
    assert.doesNotMatch(output, /^Status:/m);
    const metadata = JSON.parse(output.split('\n').find(line => line.startsWith('{')));
    const { output: body, stdout, stderr, ...expected } = details;
    assert.deepEqual(metadata, expected);
    assert.ok(output.endsWith(body.trimEnd()));
    // 调用完成和子进程运行是不同层面的原始事实，不能自行把其中一个改掉。
    assert.equal(metadata.status, 'completed');
    assert.equal(metadata.process_status, 'running');
});

test('missing executor state stays missing and unrelated tools keep their existing wrapper', () => {
    const { output, normalized } = modelFeedback({ text: 'raw\n', details: { arbitrary: true } });
    assert.equal(normalized.details.status, undefined);
    assert.doesNotMatch(output, /Status:|"status":/);
    const other = modelFeedback({ text: 'other tool' }, { tool: 'other_tool', callType: 'function' });
    assert.match(other.output, /^Status: completed\n/);
    const conflicting = modelFeedback({ status: 'outer', text: 'raw', details: { status: 'inner' } });
    assert.equal(conflicting.normalized.details.status, 'inner', 'an existing raw field must not be overwritten');
});

test('real yielding exec and later exec_wait retain the executor output without an inferred status', async t => {
    const profile = createExecToolSpec([{ type: 'function', name: 'noop', description: 'noop',
        parameters: { type: 'object', properties: {} } }]);
    let release;
    const pending = new Promise(resolve => { release = resolve; });
    const runtime = new AILISCodeModeRuntime({ dispatchTool: async () => { await pending; return {}; } });
    t.after(() => runtime.shutdown());
    const first = await runtime.execute({ profileId: profile.x_ailis_code_mode_profile,
        input: '// @exec: {"yield_time_ms": 0}\nawait tools.noop({}); text("done");' });
    const firstWire = modelFeedback(first).output;
    assert.ok(firstWire.endsWith(first.text.trimEnd()));
    assert.match(firstWire, /"status":"running"/);
    assert.match(firstWire, /Script running with cell ID/);
    assert.doesNotMatch(firstWire, /^Status:/m);
    release();
    const last = await runtime.wait({ cell_id: first.details.cell_id, yield_time_ms: 1000 });
    const lastWire = modelFeedback(last, { tool: 'exec_wait', callType: 'function' }).output;
    assert.ok(lastWire.endsWith(last.text.trimEnd()));
    assert.match(lastWire, /"status":"completed"/);
    assert.match(lastWire, /"completed":true/);
    assert.doesNotMatch(lastWire, /^Status:/m);
});
