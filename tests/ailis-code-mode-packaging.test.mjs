import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { EventEmitter } from 'node:events';
import { PassThrough } from 'node:stream';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { AILISCodeModeRuntime, resolveCodeModeWorkerLaunch } = require('../electron/ailis-code-mode-runtime.cjs');
const { createExecToolSpec } = require('../electron/codex-code-mode-protocol.cjs');
const { renderUnifiedAgentSurface } = require('../electron/ailis-persona-renderer.cjs');

const profile = () => createExecToolSpec([{ type: 'function', name: 'probe', description: 'Local test',
    parameters: { type: 'object', properties: {} } }]).x_ailis_code_mode_profile;

async function packagedWorker(t) {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis packaged worker '));
    t.after(() => fs.rm(root, { recursive: true, force: true, maxRetries: 10, retryDelay: 50 }));
    const physical = path.join(root, 'app.asar.unpacked', 'electron');
    await fs.mkdir(physical, { recursive: true });
    await fs.copyFile(path.resolve('electron/ailis-code-mode-worker.cjs'), path.join(physical, 'ailis-code-mode-worker.cjs'));
    return { virtual: path.join(root, 'app.asar', 'electron'), physical };
}

test('packaged worker paths and permission allowlist point to the same real file', async (t) => {
    const { virtual, physical } = await packagedWorker(t);
    const env = { PROBE: 'preserved' };
    const { workerPath, options } = resolveCodeModeWorkerLaunch({ moduleDir: virtual, electron: '41', env });
    assert.equal(workerPath, path.join(physical, 'ailis-code-mode-worker.cjs'));
    assert.equal(options.cwd, physical);
    assert.deepEqual(options.execArgv, ['--permission', '--experimental-vm-modules', `--allow-fs-read=${workerPath}`]);
    assert.deepEqual(options.env, { PROBE: 'preserved', ELECTRON_RUN_AS_NODE: '1' });
    assert.deepEqual(env, { PROBE: 'preserved' });
    assert.equal(options.windowsHide, true);
    const unchanged = resolveCodeModeWorkerLaunch({ moduleDir: physical, electron: '', env });
    assert.equal(unchanged.workerPath, workerPath);
    assert.deepEqual(unchanged.options.env, env);
});

test('packaged-layout worker executes and calls its enabled tool with spaces in paths', async (t) => {
    const { virtual } = await packagedWorker(t);
    const calls = [];
    const runtime = new AILISCodeModeRuntime({ workerModuleDir: virtual,
        dispatchTool: async (call) => { calls.push(call); return { answer: 42 }; } });
    const result = await runtime.execute({ input: 'text(await tools.probe({}))', profileId: profile() });
    assert.equal(result.status, 'completed', result.text);
    assert.match(result.text, /"answer":42/);
    assert.equal(calls.length, 1);
    assert.equal(calls[0].tool, 'probe');
});

test('missing packaged worker fails before spawning, without a virtual-path fallback', async (t) => {
    const { virtual, physical } = await packagedWorker(t);
    await fs.unlink(path.join(physical, 'ailis-code-mode-worker.cjs'));
    let spawned = false;
    const runtime = new AILISCodeModeRuntime({ workerModuleDir: virtual,
        forkWorker: () => { spawned = true; }, dispatchTool: async () => {} });
    await assert.rejects(runtime.execute({ input: 'text(42)', profileId: profile() }), { code: 'ENOENT' });
    assert.equal(spawned, false);
    assert.equal(runtime.cells.size, 0);
});

function fakeChild() {
    const child = new EventEmitter();
    Object.assign(child, { connected: true, stderr: new PassThrough(), sent: [],
        send(message, callback) { this.sent.push(message); callback?.(null); },
        kill() { this.killed = true; }, disconnect() { this.connected = false; } });
    return child;
}

test('spawn failure retains ENOENT and sends no IPC start message', async () => {
    const child = fakeChild();
    const runtime = new AILISCodeModeRuntime({ dispatchTool: async () => {}, forkWorker: () => {
        queueMicrotask(() => {
            child.emit('error', Object.assign(new Error('spawn failed'), { code: 'ENOENT' }));
            child.emit('error', Object.assign(new Error('write EPIPE'), { code: 'EPIPE' }));
        });
        return child;
    } });
    const result = await runtime.execute({ input: 'text(42)', profileId: profile() });
    assert.equal(result.ok, false);
    assert.match(result.text, /ENOENT/);
    assert.doesNotMatch(result.text, /EPIPE/);
    assert.deepEqual(child.sent, []);
    assert.equal(runtime.cells.size, 0);
});

test('IPC callback failure closes the cell and late messages cannot overwrite it', async () => {
    const child = fakeChild();
    child.send = function (message, callback) {
        this.sent.push(message);
        callback(Object.assign(new Error('write EPIPE'), { code: 'EPIPE' }));
    };
    const runtime = new AILISCodeModeRuntime({ dispatchTool: async () => {}, forkWorker: () => {
        queueMicrotask(() => child.emit('spawn')); return child;
    } });
    const cell = runtime.spawnCell({ code: 'text(42)', profileId: profile() });
    assert.equal(child.sent.length, 0);
    await runtime.waitForSignal(cell, 1000);
    await runtime.handleWorkerMessage(cell, { type: 'complete', error: '' });
    const result = runtime.formatResponse(cell);
    assert.equal(result.ok, false);
    assert.match(result.text, /IPC failed: EPIPE/);
    assert.equal(child.killed, true);
    assert.equal(child.sent.length, 1);
});

test('late nested tool results after worker exit are not sent to a closed IPC channel', async () => {
    const child = fakeChild();
    let resolveTool;
    const runtime = new AILISCodeModeRuntime({ dispatchTool: () => new Promise(r => { resolveTool = r; }), forkWorker: () => child });
    const cell = runtime.spawnCell({ code: '', profileId: profile() });
    const pending = runtime.handleWorkerMessage(cell, { type: 'tool_call', id: 'late', name: 'probe', input: {} });
    child.emit('exit', 1, null);
    child.connected = false;
    resolveTool({ answer: 42 });
    await pending;
    assert.equal(child.sent.length, 0);
    assert.equal(runtime.formatResponse(cell).ok, false);
});

test('unified display preserves code, inline code, paths and indentation in every delivery state', () => {
    const text = ['JSON / exec / mkdir / AILIS_PROJECT_ROOT / tool_call',
        'See `F:\\AILIS\\package.json` and `exec`.', '```powershell',
        "$exts = '*.cjs', '*.mjs', '*.json';", 'if ($true) {', '    Write-Output "json"', '}', '```',
        '```python', 'def f():', '    return {"json": "exec"}', '```'].join('\n');
    for (const task_state of ['completed', 'failed', 'uncertain', 'needs_approval']) {
        const result = renderUnifiedAgentSurface({ text, task_state, reason: 'raw observation', error_code: 'EPIPE' });
        assert.equal(result.text, text);
        assert.equal(result.speechText, text);
        assert.equal(result.bubbleText, text);
        assert.equal(result.renderer, 'ailis-unified-surface');
        assert.ok(result.expression);
    }
});
