import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { EventEmitter } from 'node:events';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { AILISTaskInteraction } = require('../electron/ailis-task-interaction.cjs');
const tick = () => new Promise(resolve => setImmediate(resolve));
class Gateway extends EventEmitter {
    constructor() { super(); this.calls = []; this.activeUnifiedTurns = new Map(); this.workspaceRoot = os.tmpdir(); }
    async runAgent(input) {
        this.calls.push(input);
        if (input.expectedRunId) return { steerAccepted: !this.rejectAppend, ok: !this.rejectAppend };
        this.request = input;
        this.activeUnifiedTurns.set(input.sessionId, { runId: input.runId });
        this.emit('event', { type: 'agent.run.started', payload: { runId: input.runId, sessionId: input.sessionId } });
        return new Promise(resolve => { this.finish = result => { this.activeUnifiedTurns.delete(input.sessionId); resolve(result); }; });
    }
    async interruptAgentRun(input) { this.interrupted = input; return { ok: true }; }
    resolveToolPath(target) { return target; }
}
function setup(t) {
    const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ailis-interaction-'));
    const gateway = new Gateway();
    const host = new AILISTaskInteraction({ rootDir, gateway });
    t.after(() => { host.dispose(); fs.rmSync(rootDir, { recursive: true, force: true }); });
    const send = (extra = {}) => host.submit({ sessionId: 'test', text: '检查文件', clientMessageId: 'message-0001', ...extra });
    return { rootDir, gateway, host, send };
}
test('receipt precedes execution; same message ID executes once', async t => {
    const { host, gateway, send } = setup(t);
    const [a, b] = await Promise.all([send(), send()]); await tick();
    assert.equal(a.ok, true); assert.deepEqual(a, b); assert.equal(gateway.calls.length, 1);
    assert.equal(host.receipt({ sessionId: 'test', clientMessageId: 'message-0001' }).ok, true);
    assert.equal((await send({ text: '不同内容' })).status, 'message_id_conflict');
    gateway.finish({ ok: true, status: 'completed', displayText: '完成' }); await tick();
    assert.equal(host.snapshot('test').runs[0].status, 'completed');
});
test('queued input does not claim inclusion until the request boundary', async t => {
    const { host, gateway, send } = setup(t); const first = await send(); await tick();
    const added = await send({ expectedRunId: first.runId, clientMessageId: 'message-0002', text: '只读，不要改文件' });
    assert.equal(added.status, 'queued');
    let run = host.snapshot('test').runs[0]; assert.equal(run.items.at(-1).status, 'queued');
    gateway.emit('event', { type: 'agent.input.included', payload: { runId: first.runId, clientMessageIds: ['message-0002'] } });
    run = host.snapshot('test').runs[0]; assert.equal(run.items.at(-1).status, 'included');
    gateway.finish({ ok: true, status: 'completed' }); await tick();
});
test('stale run and running attachments are rejected without rerouting', async t => {
    const { gateway, send } = setup(t); const first = await send(); await tick();
    assert.equal((await send({ clientMessageId: 'message-0002', expectedRunId: 'wrong' })).status, 'run_conflict');
    assert.equal((await send({ clientMessageId: 'message-0003', expectedRunId: first.runId, attachments: [{ name: 'x' }] })).status, 'attachments_while_running');
    assert.equal(gateway.calls.length, 1); gateway.finish({ ok: true, status: 'completed' }); await tick();
});
test('append gate rejection stays visible and does not start another run', async t => {
    const { host, gateway, send } = setup(t); const first = await send(); await tick(); gateway.rejectAppend = true;
    const result = await send({ clientMessageId: 'message-0002', expectedRunId: first.runId });
    assert.equal(result.ok, false); assert.equal(host.snapshot('test').runs[0].items.at(-1).status, 'rejected');
    assert.equal(host.snapshot('test').runs.length, 1); gateway.finish({ ok: true, status: 'completed' }); await tick();
});
test('stop waits for actual task and pending tool completion; closes input', async t => {
    const { host, gateway, send } = setup(t); const first = await send(); await tick();
    let finishTool; const operation = host.trackTool({ runId: first.runId }, () => new Promise(resolve => { finishTool = resolve; })); await tick();
    assert.equal((await host.stop({ sessionId: 'test', expectedRunId: 'wrong' })).ok, false);
    await host.stop({ sessionId: 'test', expectedRunId: first.runId });
    assert.equal(host.snapshot('test').runs[0].status, 'stopping');
    assert.equal((await send({ clientMessageId: 'message-0002', expectedRunId: first.runId })).ok, false);
    assert.throws(() => host.trackTool({ runId: first.runId }, () => {}), /停止/);
    gateway.finish({ ok: true, status: 'completed', displayText: '迟到的成功答复' }); await tick();
    assert.equal(host.snapshot('test').runs[0].status, 'stopping');
    finishTool(); await operation; await tick();
    assert.equal(host.snapshot('test').runs[0].status, 'stopped');
    assert.equal(host.snapshot('test').runs[0].items.some(item => item.kind === 'assistant'), false);
});
test('unconfirmed process exit is unknown, never success', async t => {
    const { host, gateway, send } = setup(t);
    gateway.computerTool = { runtime: { stopOwnedRun: async () => false } };
    const first = await send(); await tick(); await host.stop({ sessionId: 'test', expectedRunId: first.runId });
    gateway.finish({ status: 'interrupted' }); await tick();
    assert.equal(host.snapshot('test').runs[0].status, 'unknown');
    assert.equal((await send({ clientMessageId: 'message-0002' })).status, 'recovery_required');
});
test('finished-turn race creates an explicitly identified new run', async t => {
    const { gateway, send } = setup(t); const first = await send(); await tick(); gateway.finish({ ok: true, status: 'completed' }); await tick();
    const next = await send({ clientMessageId: 'message-0002', expectedRunId: first.runId }); await tick();
    assert.equal(next.followedEndedRun, true); assert.notEqual(next.runId, first.runId);
    gateway.finish({ ok: true, status: 'completed' }); await tick();
});
test('restart preserves full text and pending input without auto-replay', async t => {
    const { rootDir, host, gateway, send } = setup(t);
    const text = '很长的原文'.repeat(10000); const first = await send({ text }); await tick();
    await send({ clientMessageId: 'message-0002', expectedRunId: first.runId, text: '稍后补充' });
    host.dispose(); const restoredGateway = new Gateway(); const restored = new AILISTaskInteraction({ rootDir, gateway: restoredGateway });
    const snapshot = restored.snapshot('test');
    assert.equal(snapshot.runs[0].items[0].text, text); assert.equal(snapshot.runs[0].status, 'unknown');
    assert.equal(restoredGateway.calls.length, 0); restored.dispose();
    // Leave the old simulated promise unresolved; it must not replay after recovery.
});
test('raw tool errors persist; unrelated run events do not leak', async t => {
    const { host, gateway, send } = setup(t); const first = await send(); await tick();
    gateway.emit('event', { type: 'tool.call.finished', payload: { runId: 'foreign', callId: 'foreign', ok: false } });
    gateway.emit('event', { type: 'tool.call.finished', payload: { runId: first.runId, callId: 'call-1', tool: 'exec_command', ok: false,
        error: { message: '无法创建进程，错误 267：目录名称无效。' } } });
    const item = host.snapshot('test').runs[0].items.find(item => item.kind === 'tool');
    assert.match(item.error, /267/);
    const resource = host.readResource({ sessionId: 'test', runId: first.runId, resourceId: item.outputRef.id });
    assert.match(resource.text, /267/); assert.doesNotMatch(resource.text, /输出为空/);
    gateway.finish({ status: 'failed', error: '失败' }); await tick();
    assert.equal(host.snapshot('test').runs[0].status, 'failed');
});
test('controlled file evidence is immutable and resource access is scoped', async t => {
    const { host, gateway, send } = setup(t); const first = await send(); await tick();
    host.fileChange({ runId: first.runId }, { target: path.join(os.tmpdir(), 'example.txt'), before: Buffer.from('用户已有的修改'), after: Buffer.from('用户已有的修改\n新增一行') });
    const item = host.snapshot('test').runs[0].items.find(item => item.kind === 'file');
    assert.equal(host.readResource({ sessionId: 'test', runId: first.runId, resourceId: item.beforeRef.id }).text, '用户已有的修改');
    assert.throws(() => host.readResource({ sessionId: 'test', runId: 'other-run', resourceId: item.beforeRef.id }), /不属于/);
    assert.throws(() => host.readResource({ sessionId: 'test', runId: first.runId, resourceId: '../secret' }), /无效/);
    gateway.finish({ ok: true, status: 'completed' }); await tick();
});
test('malformed images reject before receipt and HTML is not an image', async t => {
    const { host, gateway, send } = setup(t);
    assert.equal((await send({ attachments: [{ dataUrl: 'data:image/png;base64,PGh0bWw+' }] })).status, 'invalid_attachment');
    assert.equal(host.snapshot('test').runs.length, 0); assert.equal(gateway.calls.length, 0);
});
test('valid raster image persists across reload with hash verification', async t => {
    const { host, gateway, send } = setup(t);
    const dataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aDAAAAABJRU5ErkJggg==';
    const first = await send({ attachments: [{ dataUrl, name: '截图' }] }); await tick();
    const ref = host.snapshot('test').runs[0].items[0].attachments[0].imageRef;
    assert.equal(host.readResource({ sessionId: 'test', runId: first.runId, resourceId: ref.id }).dataUrl, dataUrl);
    assert.equal(gateway.request.attachments[0].dataUrl, undefined);
    assert.equal(gateway.request.modelImageAttachments[0].image_url, dataUrl);
    gateway.finish({ ok: true, status: 'completed' }); await tick();
});
test('public stream is promoted in place, not discarded or duplicated by the completed note', async t => {
    const { host, gateway, send } = setup(t); const receipt = await send(); await tick();
    gateway.request.onTextDelta('已找到入口', { streamId: 'progress-stream' });
    host.flush(host.active.get('test'));
    assert.equal(host.snapshot('test').runs[0].items.find(i => i.id === 'progress-stream').text, '已找到入口');
    gateway.request.onTextStreamEvent({ type: 'response.output_text.progress', streamId: 'progress-stream', text: '已找到入口，继续检查。' });
    gateway.emit('event', { type: 'agent.progress.note', payload: { runId: receipt.runId, streamId: 'progress-stream', text: '已找到入口，继续检查。' } });
    const items = host.snapshot('test').runs[0].items.filter(i => i.id === 'progress-stream');
    assert.equal(items.length, 1); assert.equal(items[0].kind, 'progress'); assert.equal(items[0].status, 'observed');
    assert.equal(items[0].text, '已找到入口，继续检查。');
    gateway.finish({ ok: true, status: 'completed', displayText: '完成' }); await tick();
    assert.equal(host.snapshot('test').runs[0].items.filter(i => i.kind === 'assistant').length, 1);
});

test('plan updates replace the same durable item without completing the task', async t => {
    const { host, gateway, send } = setup(t); const receipt = await send(); await tick();
    for (const status of ['pending', 'in_progress', 'completed']) gateway.emit('event', { type: 'agent.plan.updated', payload: {
        runId: receipt.runId, plan: [{ step: '检查代码', status }], explanation: '模型的说明'
    } });
    const run = host.snapshot('test').runs[0];
    assert.equal(run.status, 'running'); assert.equal(run.items.filter(i => i.kind === 'plan').length, 1);
    assert.deepEqual(run.items.find(i => i.kind === 'plan').plan, [{ step: '检查代码', status: 'completed' }]);
    gateway.finish({ ok: true, status: 'completed' }); await tick();
});

test('discarded stream text never becomes a committed answer', async t => {
    const { host, gateway, send } = setup(t); await send(); await tick();
    gateway.request.onTextDelta('待验证的草稿', { streamId: 'stream-1' });
    gateway.request.onTextStreamEvent({ type: 'response.output_text.discarded', streamId: 'stream-1' });
    gateway.finish({ ok: true, status: 'completed', displayText: '正式答复' }); await tick();
    const items = host.snapshot('test').runs[0].items;
    assert.equal(items.find(item => item.id === 'stream-1').text, '');
    assert.equal(items.find(item => item.kind === 'assistant').text, '正式答复');
});

test('recovery requires exact task and explicit confirmation', async t => {
    const { host, gateway, send } = setup(t); const first = await send(); await tick();
    gateway.computerTool = { runtime: { stopOwnedRun: async () => false } };
    await host.stop({ sessionId: 'test', expectedRunId: first.runId }); gateway.finish({ status: 'interrupted' }); await tick();
    assert.equal((await host.confirmRecovery({ sessionId: 'test', expectedRunId: first.runId })).ok, false);
    assert.equal((await host.confirmRecovery({ sessionId: 'test', expectedRunId: 'other', confirmedExited: true })).ok, false);
    assert.equal(host.snapshot('test').runs[0].status, 'unknown');
    assert.equal((await host.confirmRecovery({ sessionId: 'test', expectedRunId: first.runId, confirmedExited: true })).ok, true);
    assert.equal(gateway.calls.length, 1);
});
test('legacy transcript import is read-only and occurs once', t => {
    const { host, rootDir } = setup(t); let reads = 0;
    host.getLegacyHistory = () => { reads++; return { messages: [{ role: 'user', content: '旧问题' }, { role: 'assistant', content: '旧回答' }] }; };
    assert.equal(host.snapshot('legacy').runs[0].items.length, 2); assert.equal(reads, 1);
    host.dispose(); const restored = new AILISTaskInteraction({ rootDir, gateway: new Gateway(), getLegacyHistory: () => { throw new Error('must not reimport'); } });
    assert.equal(restored.snapshot('legacy').runs[0].items[1].text, '旧回答'); restored.dispose();
});
test('full output is paged only when its metadata proves run ownership', async t => {
    const { host, gateway, send } = setup(t); const first = await send(); await tick();
    gateway.emit('event', { type: 'tool.call.finished', payload: { runId: first.runId, callId: 'call-a', tool: 'exec_command', ok: true, result: { details: { outputId: 'output-a' } } } });
    let owner = 'foreign';
    gateway.runtime = { outputStore: { loadMetadata: async () => ({ runId: owner }), read: async args => ({ ok: true, text: 'page', offset: args.offset, nextOffset: args.offset + 4, totalBytes: 100, hasMore: true }) } };
    const request = { sessionId: 'test', runId: first.runId, itemId: 'call-a', offset: 16 };
    await assert.rejects(host.readToolOutput(request), /归属/); owner = first.runId;
    const page = await host.readToolOutput(request); assert.equal(page.offset, 16); assert.equal(page.text, 'page'); assert.equal(page.hasMore, true);
    gateway.finish({ ok: true, status: 'completed' }); await tick();
});
test('a durable receipt write failure does not launch execution', async t => {
    const { host, gateway, send } = setup(t); const record = host.record.bind(host);
    host.record = (sessionId, event) => { if (event.type === 'input') throw new Error('disk full'); return record(sessionId, event); };
    await assert.rejects(send(), /disk full/); assert.equal(gateway.calls.length, 0);
});

test('stream journal writes only new deltas and replays the full text', async t => {
    const { host, rootDir, gateway, send } = setup(t); await send(); await tick();
    const running = host.active.get('test');
    const chunk = '增量片段'.repeat(200);
    for (let index = 0; index < 30; index++) {
        gateway.request.onTextDelta(chunk, { streamId: 'stream-linear' }); host.flush(running);
    }
    const journal = fs.readFileSync(host.load('test').file, 'utf8').trim().split('\n').map(JSON.parse);
    const deltas = journal.filter(event => event.type === 'draft.delta');
    assert.equal(deltas.length, 30);
    assert.equal(deltas.reduce((sum, event) => sum + event.delta.length, 0), chunk.length * 30);
    assert.equal(host.snapshot('test').runs[0].items.find(item => item.id === 'stream-linear').text, chunk.repeat(30));
    host.dispose(); const restored = new AILISTaskInteraction({ rootDir, gateway: new Gateway() });
    assert.equal(restored.snapshot('test').runs[0].items.find(item => item.id === 'stream-linear').text, chunk.repeat(30));
    restored.dispose();
});

test('discarding an older stream does not erase a newer stream or resurrect late deltas', async t => {
    const { host, gateway, send } = setup(t); await send(); await tick();
    gateway.request.onTextDelta('旧内容', { streamId: 'old-stream' });
    gateway.request.onTextDelta('新内容', { streamId: 'new-stream' });
    gateway.request.onTextStreamEvent({ type: 'response.output_text.discarded', streamId: 'old-stream' });
    gateway.request.onTextDelta('不应复活', { streamId: 'old-stream' });
    gateway.finish({ ok: true, status: 'completed' }); await tick();
    const items = host.snapshot('test').runs[0].items;
    assert.equal(items.find(item => item.id === 'old-stream').status, 'discarded');
    assert.equal(items.find(item => item.id === 'old-stream').text, '');
    assert.equal(items.find(item => item.id === 'new-stream').text, '新内容');
});

test('timer disk failure is contained, blocks new effects and cannot claim durable completion', async t => {
    const { host, gateway, send } = setup(t); const first = await send(); await tick();
    const faults = []; host.on('storage-error', event => faults.push(event));
    const sync = fs.fsyncSync;
    try {
        fs.fsyncSync = () => { throw new Error('ENOSPC simulated'); };
        gateway.request.onTextDelta('正在生成', { streamId: 'failed-stream' });
        await new Promise(resolve => setTimeout(resolve, 160));
    } finally { fs.fsyncSync = sync; }
    assert.equal(faults.length, 1);
    assert.equal(host.snapshot('test').runs[0].status, 'unknown');
    assert.match(host.snapshot('test').storageError, /ENOSPC/);
    assert.equal(gateway.request.abortSignal.aborted, true);
    assert.equal(gateway.interrupted.runId, first.runId);
    assert.throws(() => host.trackTool({ runId: first.runId }, () => {}), /停止/);
    assert.equal((await send({ expectedRunId: first.runId, clientMessageId: 'message-0002' })).status, 'storage_error');
    assert.equal(host.receipt({ sessionId: 'test', clientMessageId: 'message-0001' }).ok, false);
    gateway.finish({ ok: true, status: 'completed', displayText: '不能误报成功' }); await tick();
    assert.equal(host.snapshot('test').runs[0].status, 'unknown');
    assert.equal(faults.length, 1, 'one persistent fault, not an event storm');
    assert.equal((await host.confirmRecovery({ sessionId: 'test', expectedRunId: first.runId, confirmedExited: true })).ok, false);
});

test('tool evidence storage failure never throws into the tool result emitter', async t => {
    const { host, gateway, send } = setup(t); const first = await send(); await tick();
    host.resource = () => { throw new Error('EACCES evidence'); };
    assert.doesNotThrow(() => gateway.emit('event', { type: 'tool.call.finished', payload: {
        runId: first.runId, callId: 'failed-evidence', tool: 'write', ok: true, result: { ok: true }
    } }));
    assert.match(host.snapshot('test').storageError, /EACCES/);
    gateway.finish({ ok: true, status: 'completed' }); await tick();
    assert.equal(host.snapshot('test').runs[0].status, 'unknown');
});

test('new conversation and switch back preserve old records and survive host restart', async t => {
    const { host, gateway, rootDir, send } = setup(t);
    assert.equal((await host.currentSession({ sessionId: 'test' })).sessionId, 'test');
    await send(); await tick(); gateway.finish({ ok: true, status: 'completed', displayText: '旧回答' }); await tick();
    const oldBytes = fs.readFileSync(host.load('test').file);
    const created = await host.switchSession({ expectedSessionId: 'test', createNew: true });
    assert.equal(created.ok, true); assert.notEqual(created.sessionId, 'test');
    assert.equal(host.snapshot(created.sessionId).runs.length, 0);
    assert.deepEqual(fs.readFileSync(host.load('test').file), oldBytes);
    assert.equal(host.sessionList().sessions.length, 2);
    assert.equal((await send({ clientMessageId: 'message-stale' })).status, 'session_conflict');
    host.dispose(); const restored = new AILISTaskInteraction({ rootDir, gateway: new Gateway() });
    assert.equal((await restored.currentSession({ sessionId: 'wrong-window-id' })).sessionId, created.sessionId);
    assert.equal((await restored.switchSession({ expectedSessionId: created.sessionId, targetSessionId: 'test' })).ok, true);
    assert.equal(restored.snapshot('test').runs[0].items.at(-1).text, '旧回答');
    assert.deepEqual(fs.readFileSync(host.load('test').file), oldBytes); restored.dispose();
});

test('session switching cannot hide a live task or accept a stale window target', async t => {
    const { host, gateway, send } = setup(t);
    const [a, b] = await Promise.all([host.currentSession({ sessionId: 'test' }), host.currentSession({ sessionId: 'other' })]);
    assert.equal(a.sessionId, b.sessionId);
    await send(); await tick();
    assert.equal((await host.switchSession({ expectedSessionId: 'test', createNew: true })).status, 'session_busy');
    gateway.finish({ ok: true, status: 'completed' }); await tick();
    const created = await host.switchSession({ expectedSessionId: 'test', createNew: true });
    assert.equal((await host.switchSession({ expectedSessionId: 'test', createNew: true })).status, 'session_conflict');
    assert.equal((await host.currentSession()).sessionId, created.sessionId);
});

test('proactive reply uses one owned run without injecting a fake user message', async t => {
    const { host, gateway } = setup(t);
    const pending = host.proactive({ sessionId: 'test', clientMessageId: 'proactive-001', message: '既有上下文', ephemeralDeveloperMessage: 'existing proactive context unchanged' });
    await tick();
    assert.equal(gateway.request.suppressCurrentUserMessage, true);
    assert.equal(gateway.request.ephemeralDeveloperMessage, 'existing proactive context unchanged');
    assert.equal(host.snapshot('test').runs[0].kind, 'proactive');
    assert.equal(host.snapshot('test').runs[0].items.some(item => item.kind === 'user'), false);
    gateway.finish({ ok: true, status: 'completed', displayText: '主动回复' });
    const result = await pending;
    assert.equal(result.hostOwned, true); assert.equal(result.displayText, '主动回复');
    assert.equal(host.snapshot('test').runs[0].items.filter(item => item.kind === 'assistant').length, 1);
});

test('proactive attempt is skipped while a user task is active, not appended or rerouted', async t => {
    const { host, gateway, send } = setup(t); await send(); await tick();
    const result = await host.proactive({ sessionId: 'test', clientMessageId: 'proactive-002', message: '自动机会' });
    assert.equal(result.status, 'session_busy'); assert.equal(gateway.calls.length, 1);
    gateway.finish({ ok: true, status: 'completed' }); await tick();
});
