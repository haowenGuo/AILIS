import assert from 'node:assert/strict';
import test from 'node:test';
import { createRequire } from 'node:module';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { EventEmitter } from 'node:events';

const require = createRequire(import.meta.url);
const { AILISCodeModeRuntime } = require('../electron/ailis-code-mode-runtime.cjs');
const { ComputerRuntime, AILISComputerTool } = require('../electron/ailis-computer-tool.cjs');
const { createExecToolSpec } = require('../electron/codex-code-mode-protocol.cjs');
const { normalizeToolOutput, toolOutputToResponseItems } = require('../electron/ailis-agent-object-model.cjs');
const { responseItemsToWireItems } = require('../electron/ailis-response-model.cjs');
const { responseItemsToChatMessages } = require('../electron/ailis-model-input-builder.cjs');
const { buildCodexResponsesRequest } = require('../electron/codex-model-bridge.cjs');
const { ContextManager } = require('../electron/ailis-context-manager.cjs');
const { imageToolResult } = require('../electron/ailis-image-content.cjs');
const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=', 'base64');
const imageUrl = `data:image/png;base64,${png.toString('base64')}`;
const spec = (name) => ({ type: 'function', name, description: name, parameters: { type: 'object', properties: {} } });

test('exec image helper preserves multiple pixels and detail through canonical checkpoint and model wire', async () => {
    const profile = createExecToolSpec([spec('view_image')]);
    const runtime = new AILISCodeModeRuntime({ dispatchTool: async () => imageToolResult(png) });
    try {
        const result = await runtime.execute({ profileId: profile.x_ailis_code_mode_profile,
            input: 'image(await tools.view_image({path:"chart.png"}), "original"); image({type:"image",data:"' + png.toString('base64') + '",mimeType:"image/png"}); text("pixels retained");' });
        assert.equal(result.ok, true, result.text);
        assert.equal(result.content.filter((part) => part.type === 'image').length, 2);
        assert.doesNotMatch(result.text, /base64|image output/);
        for (const callType of ['custom', 'function']) {
            const normalized = normalizeToolOutput({ tool: 'exec', callType, callId: 'call_pixels',
                args: { input: 'image(...)' }, response: { ok: true, result } });
            const items = toolOutputToResponseItems(normalized);
            const manager = new ContextManager();
            manager.recordItems(items);
            const restored = ContextManager.fromCheckpoint(manager.toCheckpoint());
            const wire = responseItemsToWireItems(restored.rawItems());
            const output = wire.find((item) => item.call_id === 'call_pixels' && item.type.endsWith('_output'));
            assert.equal(output.output.filter((part) => part.type === 'input_image').length, 2);
            assert.equal(output.output.find((part) => part.type === 'input_image').detail, 'original');
            const request = buildCodexResponsesRequest({ model: 'gpt-6-luna' }, { input: wire, tools: [profile] });
            assert.ok(JSON.stringify(request.input).includes(imageUrl));
            const chat = responseItemsToChatMessages({ input: restored.rawItems() });
            assert.equal(chat.find((item) => item.role === 'tool').tool_call_id, 'call_pixels');
            assert.equal(chat.find((item) => item.role === 'user').content.filter((part) => part.type === 'image_url').length, 2);
        }
    } finally { runtime.shutdown(); }
});

test('exec yields images once and later wait does not drop or duplicate them', async () => {
    const profile = createExecToolSpec([spec('noop')]);
    let release;
    const pending = new Promise(resolve => { release = resolve; });
    const runtime = new AILISCodeModeRuntime({ dispatchTool: async () => { await pending; return {}; } });
    try {
        const first = await runtime.execute({ profileId: profile.x_ailis_code_mode_profile,
            input: 'image("' + imageUrl + '"); await yield_control(); await tools.noop({}); text("after");' });
        assert.equal(first.content.filter((part) => part.type === 'image').length, 1);
        assert.equal(first.details.running, true);
        release();
        const last = await runtime.wait({ cell_id: first.details.cell_id, yield_time_ms: 1000 });
        assert.equal(last.content.filter((part) => part.type === 'image').length, 0);
        assert.match(last.text, /after/);
    } finally { runtime.shutdown(); }
});

test('local view_image reads actual bytes without calling a second model', async () => {
    const dir = mkdtempSync(path.join(tmpdir(), 'ailis-image-feedback-'));
    const computer = new AILISComputerTool({ workspaceRoot: dir });
    try {
        const file = path.join(dir, 'chart.png');
        writeFileSync(file, png);
        const result = await computer.execute({ action: 'view_image', path: file, detail: 'original' },
            { approved: true, workspaceDir: dir }, { workspaceRoot: dir, workspaceDir: dir });
        assert.equal(result.structuredContent.image_url, imageUrl);
        assert.equal(result.content.find((part) => part.type === 'image').data, png.toString('base64'));
        assert.throws(() => imageToolResult(Buffer.from('not an image')), /supports PNG/);
    } finally { await computer.shutdown(); rmSync(dir, { recursive: true, force: true }); }
});

test('process sessions have no implicit kill timer; explicit process limits still work', async () => {
    const runtime = new ComputerRuntime();
    const child = new EventEmitter();
    child.kill = () => { child.killed = true; child.emit('exit', null, 'SIGTERM'); };
    const normal = runtime.createSessionRecord({ command: 'train', workdir: '.', child });
    assert.equal(normal.timeout, null);
    const timedChild = new EventEmitter();
    timedChild.kill = () => timedChild.emit('exit', null, 'SIGTERM');
    const timed = runtime.createSessionRecord({ command: 'limited', workdir: '.', child: timedChild, timeoutMs: 10 });
    await new Promise(resolve => setTimeout(resolve, 30));
    assert.equal(timed.status, 'timeout');
    assert.equal(normal.status, 'running');
    child.emit('exit', 0, null);
    await runtime.shutdown();
});

test('Gateway does not apply a tool-call deadline to legacy computer execution', async () => {
    const { AILISGateway } = require('../electron/ailis-gateway.cjs');
    const dir = mkdtempSync(path.join(tmpdir(), 'ailis-gateway-command-deadline-'));
    const gateway = new AILISGateway({ port: 0, workspaceRoot: dir,
        projectRoot: path.resolve(import.meta.dirname, '..'),
        profileCurationEnabled: false, emberHarnessEnabled: false,
        computerTool: { execute: async args => {
            assert.equal(args.action, 'exec');
            await new Promise(resolve => setTimeout(resolve, 40));
            return { content: [{ type: 'text', text: 'completed' }],
                details: { status: 'completed', stdout: 'completed', exitCode: 0 } };
        }, shutdown: async () => {} }
    });
    try {
        const result = await gateway.callTool({ tool: 'computer', args: { action: 'exec', command: 'fixture' },
            timeoutMs: 1, context: { workspace: dir, approved: true } });
        assert.equal(result.ok, true, JSON.stringify(result));
        assert.equal(result.result.details.stdout, 'completed');
    } finally { await gateway.stop(); rmSync(dir, { recursive: true, force: true }); }
});

test('real local command crosses the former 30s kill deadline', {
    skip: process.env.AILIS_LONG_TOOL_PROBE !== '1', timeout: 45000
}, async () => {
    const dir = mkdtempSync(path.join(tmpdir(), 'ailis-command-deadline-'));
    const computer = new AILISComputerTool({ workspaceRoot: dir });
    const started = Date.now();
    try {
        const result = await computer.execute({ action: 'exec', command: process.execPath,
            args: ['-e', 'setTimeout(() => { console.log("completed-after-30s"); process.exitCode = 7; }, 31000)'] },
            { approved: true, workspaceDir: dir }, { workspaceRoot: dir, workspaceDir: dir });
        assert.ok(Date.now() - started >= 31000);
        assert.match(result.details.stdout, /completed-after-30s/);
        assert.equal(result.details.exitCode, 7);
        assert.notEqual(result.details.status, 'timeout');
    } finally { await computer.shutdown(); rmSync(dir, { recursive: true, force: true }); }
});
