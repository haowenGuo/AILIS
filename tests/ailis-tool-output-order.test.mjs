import assert from 'node:assert/strict';
import test from 'node:test';
import { EventEmitter } from 'node:events';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { ComputerRuntime, AILISComputerTool } = require('../electron/ailis-computer-tool.cjs');

function processFixture(t) {
    const runtime = new ComputerRuntime();
    t.after(() => runtime.shutdown());
    const child = new EventEmitter();
    child.stdout = new EventEmitter();
    child.stderr = new EventEmitter();
    child.kill = () => child.emit('exit', null, 'SIGTERM');
    const record = runtime.createSessionRecord({ command: 'fixture', workdir: '.', child });
    return { runtime, child, record };
}

test('arrival order changes, but reads remain cumulative and streams remain separate', async t => {
    const { runtime, child, record } = processFixture(t);
    child.stdout.emit('data', Buffer.from('A\n'));
    assert.equal(runtime.buildUnifiedExecDetails(record).output, 'A\n');
    child.stderr.emit('data', Buffer.from('B\n'));
    child.stdout.emit('data', Buffer.from('C\n'));
    child.emit('exit', 7, null);
    for (let i = 0; i < 2; i++) {
        const result = await runtime.writeStdin({ session_id: record.id, yield_time_ms: 50 }, {});
        assert.equal(result.details.output, 'A\nB\nC\n');
        assert.equal(result.content[0].text, result.details.output);
        assert.equal(result.details.stdout, 'A\nC\n');
        assert.equal(result.details.stderr, 'B\n');
        assert.equal(result.details.exit_code, 7);
        assert.equal(result.details.process_status, 'exited');
        assert.equal(result.details.max_output_tokens, 6000);
    }
    assert.equal(record.timeout, null);
});

test('ordered output preserves the original independent retention limits', t => {
    const { runtime, child, record } = processFixture(t);
    const limit = 256 * 1024;
    const chunks = [
        ['stdout', 'a'.repeat(limit - 10)], ['stderr', 'b'.repeat(limit - 20)],
        ['stdout', 'c'.repeat(50)], ['stderr', 'd'.repeat(60)],
        ['stdout', 'e'.repeat(limit + 100)], ['stderr', 'f'.repeat(100)]
    ];
    let events = [];
    const streams = { stdout: '', stderr: '' };
    for (const [stream, text] of chunks) {
        child[stream].emit('data', Buffer.from(text));
        streams[stream] = (streams[stream] + text).slice(-limit);
        events.push({ stream, text });
        let excess = events.filter(e => e.stream === stream).reduce((n, e) => n + e.text.length, 0) - limit;
        for (const event of events) {
            if (event.stream !== stream || excess <= 0) continue;
            const trim = Math.min(excess, event.text.length);
            event.text = event.text.slice(trim);
            excess -= trim;
        }
        events = events.filter(e => e.text.length);
        assert.equal(record.stdout, streams.stdout);
        assert.equal(record.stderr, streams.stderr);
        // 大预算只用于读完整保留区，不改变生产默认预算。
        const details = runtime.buildUnifiedExecDetails(record, { maxOutputTokens: 100000 });
        const retained = events.map(e => e.text).join('');
        if (retained.length <= 400000) assert.equal(details.output, retained);
        else assert.ok(details.output.startsWith(retained.slice(0, 100)));
        const offsets = { stdout: 0, stderr: 0 };
        assert.equal(record.outputRuns.map(({ stream, length }) => {
            const start = offsets[stream];
            offsets[stream] += length;
            return record[stream].slice(start, offsets[stream]);
        }).join(''), retained);
        assert.deepEqual(record.outputRuns.map(run => run.stream), events.map(e => e.stream));
        assert.equal(record.outputRuns.reduce((n, run) => n + run.length, 0),
            record.stdout.length + record.stderr.length);
    }
    child.emit('exit', 0, null);
});

test('non-ASCII and partial stream eviction preserve the old stream buffers exactly', t => {
    const { runtime, child, record } = processFixture(t);
    const streams = { stdout: '', stderr: '' };
    for (const [stream, text] of [['stdout', '\u4e2d'.repeat(100000)], ['stderr', 'err'],
        ['stdout', '\u6587'.repeat(100000)], ['stderr', '\nend\n']]) {
        const merged = streams[stream] + text;
        streams[stream] = Buffer.byteLength(merged, 'utf8') <= 256 * 1024
            ? merged : merged.slice(Math.max(0, merged.length - 256 * 1024));
        child[stream].emit('data', Buffer.from(text));
        assert.equal(record.stdout, streams.stdout);
        assert.equal(record.stderr, streams.stderr);
        assert.equal(record.outputRuns.reduce((n, run) => n + run.length, 0),
            record.stdout.length + record.stderr.length);
    }
    const output = runtime.buildUnifiedExecDetails(record, { maxOutputTokens: 100000 }).output;
    assert.ok(output.includes('\u4e2derr\u6587'));
    assert.ok(output.endsWith('\nend\n'));
    child.emit('exit', 0, null);
});

test('spawn errors stay at their observed output position', t => {
    const { runtime, child, record } = processFixture(t);
    child.stdout.emit('data', Buffer.from('before'));
    child.emit('error', Object.assign(new Error('SPAWN_ERROR'), { code: 'ENOENT' }));
    const details = runtime.buildUnifiedExecDetails(record);
    assert.equal(details.output, 'before\nSPAWN_ERROR');
    assert.equal(details.errorCode, 'ENOENT');
});

test('real exec and exec_command preserve interleaving without adding separators', async t => {
    const dir = mkdtempSync(path.join(tmpdir(), 'ailis-output-order-'));
    const computer = new AILISComputerTool({ workspaceRoot: dir });
    t.after(async () => { await computer.shutdown(); rmSync(dir, { recursive: true, force: true }); });
    const script = 'process.stdout.write("A"); setTimeout(() => { process.stderr.write("B"); setTimeout(() => process.stdout.write("C"), 150); }, 150);';
    for (const action of ['exec', 'exec_command']) {
        const result = await computer.execute({ action, command: process.execPath,
            args: ['-e', script], yield_time_ms: 3000, storeOutput: false },
        { approved: true, workspace: dir }, { workspaceRoot: dir, workspaceDir: dir });
        assert.equal(result.details.output, 'ABC');
        assert.equal(result.content[0].text, 'ABC');
        assert.equal(result.details.stdout, 'AC');
        assert.equal(result.details.stderr, 'B');
    }
});
