import assert from 'node:assert/strict';
import test from 'node:test';
import { EventEmitter } from 'node:events';
import { createRequire } from 'node:module';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

const require = createRequire(import.meta.url);
const { ComputerRuntime, AILISComputerTool } = require('../electron/ailis-computer-tool.cjs');
const { AILISCodeModeRuntime } = require('../electron/ailis-code-mode-runtime.cjs');
const { createExecToolSpec } = require('../electron/codex-code-mode-protocol.cjs');
const { normalizeToolOutput, toolOutputToResponseItems } = require('../electron/ailis-agent-object-model.cjs');
const { responseItemsToWireItems } = require('../electron/ailis-response-model.cjs');
const { ContextManager } = require('../electron/ailis-context-manager.cjs');

test('explicit small budgets preserve the beginning and final error without consuming retained output', async t => {
    const runtime = new ComputerRuntime();
    t.after(() => runtime.shutdown());
    const child = new EventEmitter();
    child.stdout = new EventEmitter();
    child.kill = () => child.emit('exit', null, 'SIGTERM');
    const record = runtime.createSessionRecord({ command: 'fixture', workdir: '.', child });
    const source = `HEAD_EVIDENCE\n${'x'.repeat(30000)}\nTAIL_ASSERTION_FAILED\n`;
    child.stdout.emit('data', Buffer.from(source));
    child.emit('exit', 1, null);
    for (const budget of [256, 500, 6000]) {
        const result = await runtime.writeStdin({ session_id: record.id, max_output_tokens: budget }, {});
        assert.ok(result.details.output.startsWith('HEAD_EVIDENCE\n'));
        assert.ok(result.details.output.endsWith('TAIL_ASSERTION_FAILED\n'));
        assert.match(result.details.output, /truncated: original_token_count=/);
        assert.ok(result.details.output.length <= budget * 4);
        assert.equal(result.details.max_output_tokens, budget);
        assert.equal(result.details.original_token_count, Math.ceil(source.length / 4));
        assert.equal(result.details.exit_code, 1);
        assert.equal(result.content[0].text, result.details.output);
    }
    assert.equal(runtime.buildUnifiedExecDetails(record).max_output_tokens, 6000);
    assert.equal(runtime.buildUnifiedExecDetails(record, { maxOutputTokens: 10000 }).output, source);
    assert.equal(record.stdout, source);
});

test('head-tail output does not introduce lone surrogate halves', t => {
    const runtime = new ComputerRuntime();
    t.after(() => runtime.shutdown());
    const child = new EventEmitter();
    child.stdout = new EventEmitter();
    child.kill = () => child.emit('exit', null, 'SIGTERM');
    const record = runtime.createSessionRecord({ command: 'unicode', workdir: '.', child });
    child.stdout.emit('data', Buffer.from('\u{1F642}'.repeat(30000)));
    child.emit('exit', 0, null);
    for (let maxOutputTokens = 256; maxOutputTokens < 270; maxOutputTokens++) {
        const { output } = runtime.buildUnifiedExecDetails(record, { maxOutputTokens });
        assert.equal(output.isWellFormed(), true);
        assert.ok(output.length <= maxOutputTokens * 4);
    }
});

test('real terminal error survives nested exec, canonical checkpoint and model wire', async t => {
    const dir = mkdtempSync(path.join(tmpdir(), 'ailis-head-tail-wire-'));
    const computer = new AILISComputerTool({ workspaceRoot: dir });
    const profile = createExecToolSpec([{ type: 'function', name: 'exec_command', description: 'exec',
        parameters: { type: 'object', properties: {} } }]);
    const runtime = new AILISCodeModeRuntime({ dispatchTool: async ({ args }) => computer.execute(
        { action: 'exec_command', ...args }, { approved: true, workspace: dir },
        { workspaceRoot: dir, workspaceDir: dir }) });
    t.after(async () => { runtime.shutdown(); await computer.shutdown(); rmSync(dir, { recursive: true, force: true }); });
    const args = { command: process.execPath,
        args: ['-e', 'process.stdout.write("HEAD_EVIDENCE\\n" + "x".repeat(30000) + "\\nTAIL_ASSERTION_FAILED\\n"); process.exitCode = 7;'],
        yield_time_ms: 3000, max_output_tokens: 500, storeOutput: false };
    const result = await runtime.execute({ profileId: profile.x_ailis_code_mode_profile,
        input: `text(await tools.exec_command(${JSON.stringify(args)}));` });
    const normalized = normalizeToolOutput({ tool: 'exec', callType: 'custom', callId: 'call_tail',
        response: { ok: true, result } });
    const manager = new ContextManager();
    manager.recordItems(toolOutputToResponseItems(normalized));
    const restored = ContextManager.fromCheckpoint(manager.toCheckpoint());
    const wire = responseItemsToWireItems(restored.rawItems());
    const output = wire.find(item => item.type.endsWith('_output')).output;
    assert.match(output, /HEAD_EVIDENCE/);
    assert.match(output, /TAIL_ASSERTION_FAILED/);
    assert.match(output, /"exit_code":7/);
    assert.match(output, /max_output_tokens=500/);
});
