import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { EventEmitter } from 'node:events';
import { createRequire } from 'node:module';
import { Writable } from 'node:stream';
import test from 'node:test';

const require = createRequire(import.meta.url);
const runtimePath = require.resolve('../electron/ailis-computer-tool.cjs');

for (const action of ['write_stdin', 'process_write']) {
    test(`${action} reports a real closed input pipe without killing the Agent`, {
        skip: process.platform === 'win32' && 'Linux pipe-close reproduction; Windows uses named-pipe handles'
    }, () => {
        // A separate parent process makes an unhandled Socket error observable as
        // a nonzero exit instead of hiding it behind the test runner's listeners.
        const source = `
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const { once } = require('node:events');
const { ComputerRuntime } = require(${JSON.stringify(runtimePath)});
const runtime = new ComputerRuntime();
const children = [];
function start(code) {
    const child = spawn(process.execPath, ['-e', code], { stdio: ['pipe', 'pipe', 'pipe'] });
    children.push(child);
    return runtime.createSessionRecord({ command: 'pipe regression', workdir: process.cwd(), child, timeoutMs: 0 });
}
async function ready(record, marker) {
    const until = Date.now() + 4000;
    while (!record.stdout.includes(marker)) {
        assert.equal(record.status, 'running', record.stderr);
        if (Date.now() > until) throw new Error('Child readiness deadline');
        await new Promise(resolve => setTimeout(resolve, 10));
    }
}
(async () => {
    try {
        const broken = start("require('node:fs').closeSync(0); console.log('INPUT_CLOSED'); setInterval(() => {}, 1000)");
        await ready(broken, 'INPUT_CLOSED');
        const result = ${action === 'write_stdin'
            ? "await runtime.writeStdin({ session_id: broken.id, chars: 'hello', yield_time_ms: 100 }, { approved: true })"
            : "await runtime.processWrite({ sessionId: broken.id, input: 'hello', submit: true }, { approved: true })"};
        assert.equal(result.isError, true, JSON.stringify(result));
        assert.match(result.details.errorCode, /EPIPE|ECONNRESET|ERR_STREAM_DESTROYED|ERR_STREAM_WRITE_AFTER_END/);
        assert.equal(broken.status, 'running');
        const poll = await runtime.writeStdin({ session_id: broken.id, chars: '', yield_time_ms: 100 }, {});
        assert.match(poll.details.stdout, /INPUT_CLOSED/);
        assert.equal(poll.details.exit_code, null);
        const good = start("process.stdin.on('data', d => console.log('ECHO:' + d.toString().trim())); console.log('READY')");
        await ready(good, 'READY');
        const echo = await runtime.processWrite({ sessionId: good.id, input: 'still alive', submit: true }, { approved: true });
        assert.equal(echo.isError, undefined);
        await ready(good, 'ECHO:still alive');
        console.log('PIPE_ERROR_REPORTED_AND_AGENT_ALIVE');
    } finally {
        await Promise.all(children.map(async child => {
            if (child.exitCode === null && child.signalCode === null) {
                const closed = once(child, 'close');
                child.kill();
                await closed;
            }
        }));
    }
})().catch(error => { console.error(error); process.exitCode = 1; });
`;
        const probe = spawnSync(process.execPath, ['-e', source], {
            encoding: 'utf8', timeout: 12000, windowsHide: true
        });
        assert.equal(probe.error, undefined, probe.error?.message);
        assert.equal(probe.status, 0, probe.stderr);
        assert.match(probe.stdout, /PIPE_ERROR_REPORTED_AND_AGENT_ALIVE/);
    });

    test(`${action} handles asynchronous stream errors and reports failed writes`, async () => {
        const { ComputerRuntime } = require(runtimePath);
        const runtime = new ComputerRuntime();
        const child = new EventEmitter();
        child.stdin = new Writable({
            write(chunk, encoding, callback) {
                setImmediate(() => callback(Object.assign(new Error('write EPIPE'), { code: 'EPIPE' })));
            }
        });
        const record = runtime.createSessionRecord({ command: 'async pipe', workdir: process.cwd(), child, timeoutMs: 0 });
        const result = action === 'write_stdin'
            ? await runtime.writeStdin({ session_id: record.id, chars: 'hello' }, { approved: true })
            : await runtime.processWrite({ sessionId: record.id, input: 'hello' }, { approved: true });
        assert.equal(result.isError, true);
        assert.equal(result.details.errorCode, 'EPIPE');
        assert.equal(record.status, 'running');
        await new Promise(resolve => setImmediate(resolve));
        const again = await runtime.writeStdin({ session_id: record.id, chars: 'again' }, { approved: true });
        assert.equal(again.isError, true);
        assert.equal(again.details.errorCode, 'EPIPE');
    });
}

test('missing process input is not reported as a successful write', async () => {
    const { ComputerRuntime } = require(runtimePath);
    const runtime = new ComputerRuntime();
    runtime.sessions.set('no-input', { id: 'no-input', status: 'running', child: { stdin: null } });
    const result = await runtime.processWrite({ sessionId: 'no-input', input: 'test' }, { approved: true });
    assert.equal(result.isError, true);
    assert.equal(result.details.errorCode, 'ERR_STREAM_DESTROYED');
});
