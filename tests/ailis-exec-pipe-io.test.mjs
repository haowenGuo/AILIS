import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { EventEmitter } from 'node:events';
import { PassThrough, Writable } from 'node:stream';
import { performance } from 'node:perf_hooks';
import { createRequire } from 'node:module';
import test from 'node:test';

const require = createRequire(import.meta.url);
// The override runs these same assertions against an untouched baseline.
const source = process.env.AILIS_IO_TEST_ROOT || path.resolve(import.meta.dirname, '..');
const { ComputerRuntime } = require(path.join(source, 'electron/ailis-computer-tool.cjs'));
const { AILISCodeModeRuntime } = require(path.join(source, 'electron/ailis-code-mode-runtime.cjs'));
const { AILISOutputStore } = require(path.join(source, 'electron/ailis-output-store.cjs'));
const { CODEX_EXEC_RESULT_SCHEMA, createExecToolSpec } = require(path.join(source, 'electron/codex-code-mode-protocol.cjs'));
const { toolOutputToModelInputItems } = require(path.join(source, 'electron/ailis-model-input-builder.cjs'));
const { responseItemsToWireItems } = require(path.join(source, 'electron/ailis-response-model.cjs'));
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

function fakeSession(t, { stdin = new Writable({ write(chunk, encoding, cb) { cb(); } }), capture } = {}) {
    const child = new EventEmitter();
    child.stdin = stdin;
    child.stdout = new PassThrough();
    child.stderr = new PassThrough();
    const runtime = new ComputerRuntime();
    const record = runtime.createSessionRecord({ command: 'test-owned-streams', workdir: process.cwd(),
        child, timeoutMs: 0, outputCapture: capture });
    t.after(() => {
        if (record.status === 'running') child.emit('exit', 0, null);
        if (!record.closed) child.emit('close', 0, null);
    });
    return { child, runtime, record };
}

function ownedChild(t, code) {
    const runtime = new ComputerRuntime();
    const child = spawn(process.execPath, ['-e', code], { stdio: ['pipe', 'pipe', 'pipe'], windowsHide: true });
    const closed = new Promise(resolve => child.once('close', resolve));
    const record = runtime.createSessionRecord({ command: 'test-owned-node', workdir: process.cwd(), child, timeoutMs: 0 });
    t.after(async () => {
        if (child.exitCode === null && child.signalCode === null && record.status === 'running') child.kill('SIGTERM');
        await closed;
        await runtime.shutdown();
    });
    return { runtime, record, closed };
}

async function ready(record) {
    const deadline = performance.now() + 4000;
    while (!record.stdout.includes('READY\n') && performance.now() < deadline) await delay(10);
    assert.ok(record.stdout.includes('READY\n'), 'owned child did not become ready');
}

test('exit with open output pipes keeps a readable session and native exit state', async t => {
    const { runtime, record, child } = fakeSession(t);
    child.stdout.write('FIRST\n');
    child.emit('exit', 0, null);
    const first = await runtime.waitForProcessSnapshot(record, 50);
    assert.equal(first.process_status, 'exited');
    assert.equal(first.running, false);
    assert.equal(first.exit_code, 0);
    assert.equal(first.output_complete, false);
    assert.equal(first.session_id, record.id);
    assert.ok(first.wall_time_seconds >= 0.04);

    child.stdout.write('LATE\n');
    child.emit('close', 0, null);
    const final = await runtime.writeStdin({ session_id: first.session_id, chars: '', yield_time_ms: 50 }, {});
    assert.equal(final.details.output, 'FIRST\nLATE\n');
    assert.equal(final.details.output_complete, true);
    assert.equal(final.details.session_id, undefined);
    assert.equal(final.details.exit_code, 0);
});

test('signal exit is not converted to success while its pipes drain', async t => {
    const { runtime, record, child } = fakeSession(t);
    child.emit('exit', null, 'SIGTERM');
    const result = await runtime.waitForProcessSnapshot(record, 50);
    assert.equal(result.exit_code, null);
    assert.equal(result.signal, 'SIGTERM');
    assert.equal(result.process_status, 'exited');
    assert.equal(result.running, false);
    assert.equal(result.session_id, record.id);
    assert.equal(result.output_complete, false);
});

test('capture is finalized once at pipe close, after all late chunks', async t => {
    const chunks = [], finals = [];
    const capture = { append(channel, chunk) { chunks.push([channel, String(chunk)]); },
        summary() { return { outputId: 'owned-capture', status: finals.length ? 'completed' : 'running' }; },
        async finalize(metadata) { finals.push({ metadata, chunks: structuredClone(chunks) }); return this.summary(); } };
    const { runtime, child, record } = fakeSession(t, { capture });
    child.stdout.write('FIRST\n');
    child.emit('exit', 0, null);
    await runtime.waitForProcessSnapshot(record, 50);
    assert.equal(finals.length, 0);
    child.stderr.write('LAST_ERROR\n');
    child.emit('close', 0, null);
    await record.outputFinalization;
    assert.equal(finals.length, 1);
    assert.deepEqual(finals[0].chunks, [['stdout', 'FIRST\n'], ['stderr', 'LAST_ERROR\n']]);
});

test('real Linux exec_command drains inherited stdout and finalizes the complete stored log',
    { skip: process.platform !== 'linux' }, async t => {
        const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-owned-pipe-'));
        const runtime = new ComputerRuntime({ workspaceRoot });
        const store = new AILISOutputStore({ rootDir: path.join(workspaceRoot, 'output-store') });
        const captureStore = { async createCapture(options) {
            const capture = await store.createCapture(options);
            const finalize = capture.finalize.bind(capture);
            capture.finalize = async metadata => { await delay(120); return finalize(metadata); };
            return capture;
        } };
        t.after(async () => { await runtime.shutdown(); await fs.rm(workspaceRoot, { recursive: true, force: true }); });
        const lateCode = 'setTimeout(()=>console.log("LATE_PIPE_OUTPUT"),400)';
        const code = `const {spawn}=require('node:child_process');console.log('FIRST_PIPE_OUTPUT');
            const sub=spawn(process.execPath,['-e',${JSON.stringify(lateCode)}],
            {stdio:['ignore',process.stdout,process.stderr]});sub.unref();process.exit(0);`;
        const cmd = `'${process.execPath}' -e 'eval(Buffer.from("${Buffer.from(code).toString('base64')}","base64").toString())'`;
        const result = await runtime.execCommand({ cmd, workdir: workspaceRoot, yield_time_ms: 2000, max_output_tokens: 1000 },
            { approved: true }, { workspaceRoot, workspaceDir: workspaceRoot, outputStore: captureStore });
        assert.equal(result.details.output, 'FIRST_PIPE_OUTPUT\nLATE_PIPE_OUTPUT\n');
        assert.equal(result.details.exit_code, 0);
        assert.equal(result.details.output_complete, true);
        assert.equal(result.details.session_id, undefined);
        assert.equal(result.details.outputStore.status, 'completed');
        const log = await fs.readFile(result.details.outputStore.path, 'utf8');
        assert.equal(log, result.details.output);
        assert.equal(result.details.outputStore.bytes, Buffer.byteLength(log));
        assert.equal(result.details.session.outputStore.status, 'completed');
        assert.equal(result.details.session.outputStore.bytes, Buffer.byteLength(log));
    });

for (const action of ['write_stdin', 'process_write']) {
    test(`${action} reports a failed stream write without poisoning process state`, async t => {
        const nativeError = Object.assign(new Error('write EPIPE'), { code: 'EPIPE' });
        const stdin = new Writable({ write(chunk, encoding, cb) { cb(nativeError); } });
        const { runtime, child, record } = fakeSession(t, { stdin });
        child.stdout.write('READY\n');
        const result = action === 'write_stdin'
            ? await runtime.writeStdin({ session_id: record.id, chars: 'x', yield_time_ms: 50 }, { approved: true })
            : await runtime.processWrite({ sessionId: record.id, input: 'x' }, { approved: true });
        assert.equal(result.isError, true);
        assert.equal(result.details.status, 'error');
        assert.equal(result.details.errorCode, 'EPIPE');
        assert.equal(result.details.error, 'write EPIPE');
        assert.equal(result.details.bytes_written, 0);
        assert.equal(result.details.process_status, 'running');
        assert.equal(result.details.running, true);
        assert.equal(result.details.exit_code, null);
        assert.equal(result.details.output, 'READY\n');
        const poll = await runtime.writeStdin({ session_id: record.id, chars: '', yield_time_ms: 50 }, {});
        assert.equal(poll.isError, undefined);
        assert.equal(poll.details.status, 'completed');
        assert.equal(poll.details.running, true);
    });
}

test('submit reports only writes actually confirmed before a newline failure', async t => {
    let calls = 0;
    const stdin = new Writable({ write(chunk, encoding, cb) {
        cb(++calls === 1 ? null : Object.assign(new Error('newline EPIPE'), { code: 'EPIPE' }));
    } });
    const { runtime, record } = fakeSession(t, { stdin });
    const result = await runtime.writeStdin({ session_id: record.id, chars: 'abc', submit: true, yield_time_ms: 50 }, { approved: true });
    assert.equal(result.details.bytes_written, 3);
    assert.equal(result.isError, true);
    assert.equal(result.details.errorCode, 'EPIPE');
});

test('successful writes await callbacks and count UTF-8 plus submitted newline bytes', async t => {
    const chunks = [];
    const stdin = new Writable({ write(chunk, encoding, cb) { setTimeout(() => { chunks.push(String(chunk)); cb(); }, 25); } });
    const { runtime, record } = fakeSession(t, { stdin });
    const input = '\u4f60\u597d';
    const result = await runtime.writeStdin({ session_id: record.id, chars: input, submit: true, yield_time_ms: 50 }, { approved: true });
    assert.deepEqual(chunks, [input, os.EOL]);
    assert.equal(result.details.bytes_written, Buffer.byteLength(input + os.EOL));
    assert.ok(result.details.wall_time_seconds >= 0.09);
    assert.equal(result.isError, undefined);
});

test('a missing stdin returns an error and zero bytes with existing output preserved', async t => {
    const { runtime, record, child } = fakeSession(t, { stdin: null });
    child.stdout.write('original\n');
    const result = await runtime.writeStdin({ session_id: record.id, chars: 'x' }, { approved: true });
    assert.equal(result.isError, true);
    assert.equal(result.details.bytes_written, 0);
    assert.equal(result.details.output, 'original\n');
    assert.match(result.details.error, /stdin is unavailable/);
});

test('a synchronous stdin failure remains a tool error with its original code', async t => {
    const stdin = new EventEmitter();
    stdin.write = () => { throw Object.assign(new Error('write after end'), { code: 'ERR_STREAM_WRITE_AFTER_END' }); };
    const { runtime, record } = fakeSession(t, { stdin });
    const result = await runtime.writeStdin({ session_id: record.id, chars: 'x' }, { approved: true });
    assert.equal(result.isError, true);
    assert.equal(result.details.errorCode, 'ERR_STREAM_WRITE_AFTER_END');
    assert.equal(result.details.bytes_written, 0);
    assert.equal(record.status, 'running');
});

test('writing to an exited session preserves its nonzero exit and existing output', async t => {
    const { runtime, record, child } = fakeSession(t);
    child.stdout.write('original failure\n');
    child.emit('exit', 7, null);
    child.emit('close', 7, null);
    const result = await runtime.writeStdin({ session_id: record.id, chars: 'x' }, { approved: true });
    assert.equal(result.isError, true);
    assert.equal(result.details.exit_code, 7);
    assert.equal(result.details.process_status, 'exited');
    assert.equal(result.details.output_complete, true);
    assert.equal(result.details.output, 'original failure\n');
    assert.equal(result.details.bytes_written, 0);
});

test('process_write approval still prevents input from reaching a running process', async t => {
    let writes = 0;
    const stdin = new Writable({ write(chunk, encoding, cb) { writes++; cb(); } });
    const { runtime, record } = fakeSession(t, { stdin });
    const result = await runtime.processWrite({ sessionId: record.id, input: 'x' }, {});
    assert.equal(result.details.status, 'needs_approval');
    assert.equal(writes, 0);
});

test('real Linux closed stdin yields structured EPIPE, not an uncaught exception or fake success',
    { skip: process.platform !== 'linux' }, async t => {
        const { runtime, record, closed } = ownedChild(t,
            "require('node:fs').closeSync(0);console.log('READY');setTimeout(()=>console.log('DONE'),700)");
        await ready(record);
        const result = await runtime.writeStdin({ session_id: record.id, chars: 'x', yield_time_ms: 50 }, { approved: true });
        assert.equal(result.isError, true);
        assert.equal(result.details.errorCode, 'EPIPE');
        assert.equal(result.details.bytes_written, 0);
        assert.equal(result.details.running, true);
        assert.equal(result.details.output, 'READY\n');
        await closed;
        const poll = await runtime.writeStdin({ session_id: record.id, chars: '', yield_time_ms: 50 }, {});
        assert.equal(poll.details.output, 'READY\nDONE\n');
        assert.equal(poll.details.exit_code, 0);
    });

test('real successful input reaches its owned child and is observed before completion', async t => {
    const { runtime, record, closed } = ownedChild(t,
        "console.log('READY');process.stdin.once('data',d=>{console.log('GOT:'+d);process.exit(0)});setTimeout(()=>process.exit(2),3000)");
    await ready(record);
    const result = await runtime.writeStdin({ session_id: record.id, chars: 'hello', yield_time_ms: 1000 }, { approved: true });
    await closed;
    assert.equal(result.details.bytes_written, 5);
    assert.equal(result.details.exit_code, 0);
    assert.match(result.details.output, /GOT:hello/);
    assert.equal(result.details.output_complete, true);
});

test('per-call time excludes process age and idle time between polls', async t => {
    const { runtime, record, child } = fakeSession(t);
    record.startedAt -= 120000;
    const first = await runtime.writeStdin({ session_id: record.id, chars: '', yield_time_ms: 50 }, {});
    assert.ok(first.details.wall_time_seconds >= 0.04 && first.details.wall_time_seconds < 1);
    assert.ok(first.details.process_wall_time_seconds >= 120);
    await delay(60);
    child.emit('exit', 0, null);
    child.emit('close', 0, null);
    const last = await runtime.writeStdin({ session_id: record.id, chars: '', yield_time_ms: 50 }, {});
    assert.ok(last.details.wall_time_seconds < 1);
    assert.ok(last.details.process_wall_time_seconds >= first.details.process_wall_time_seconds);
    assert.equal(last.details.exit_code, 0);
});

test('PTY polling uses the same per-call clock without changing its native state', async () => {
    const runtime = new ComputerRuntime();
    const record = { id: 'test-pty', command: 'test', status: 'exited', startedAt: Date.now()-120000,
        updatedAt: Date.now(), output: 'pty-output', exitCode: 7, signal: null };
    const result = await runtime.waitForPtySnapshot(record, 50);
    assert.ok(result.wall_time_seconds < 1);
    assert.ok(result.process_wall_time_seconds >= 120);
    assert.equal(result.exit_code, 7);
    assert.equal(result.output, 'pty-output');
});

test('new native fields survive the worker, session alias and actual canonical wire projection', async () => {
    const spec = createExecToolSpec(['exec_command', 'write_stdin'].map(name => ({
        type: 'function', name, description: name, parameters: { type: 'object', properties: {} }
    })));
    const runtime = new AILISCodeModeRuntime({ dispatchTool: async () => ({ details: {
        status: 'error', process_status: 'exited', running: false, exit_code: 0, signal: null,
        output_complete: false, session_id: 'native-draining-session', bytes_written: 0,
        error: 'write EPIPE', errorCode: 'EPIPE', wall_time_seconds: 0.237,
        process_wall_time_seconds: 64.485, output: 'last native text'
    } }) });
    try {
        const result = await runtime.execute({ profileId: spec.x_ailis_code_mode_profile,
            context: { sessionId: 'pipe-io-wire' }, input: 'text(await tools.exec_command({cmd:"test"}));' });
        assert.equal(result.ok, true);
        const items = responseItemsToWireItems(toolOutputToModelInputItems({ tool: 'exec', callId: 'pipe-io-output',
            callType: 'custom', args: { input: 'test' }, response: { ok: true, status: 'completed', result } }));
        const wire = JSON.stringify(items);
        for (const text of ['output_complete', 'bytes_written', 'process_wall_time_seconds', 'EPIPE', '64.485', '0.237']) {
            assert.ok(wire.includes(text), text);
        }
        assert.match(result.text, /"session_id":1/);
        assert.match(result.text, /"output_complete":false/);
        for (const name of ['output_complete', 'bytes_written', 'process_wall_time_seconds']) assert.ok(CODEX_EXEC_RESULT_SCHEMA.properties[name]);
        assert.deepEqual(CODEX_EXEC_RESULT_SCHEMA.required, ['wall_time_seconds', 'output']);
    } finally { runtime.shutdown(); }
});
