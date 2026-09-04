import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';
import { AILISDesktopChatService } from '../src/ailis-chat-service.js';
import { createChatService } from '../src/chat-service.js';

const require = createRequire(import.meta.url);
const { AILISGateway } = require('../electron/ailis-gateway.cjs');
const { AILISSessionContextStore } = require('../electron/ailis-session-context-store.cjs');
const { AILISContextCompiler } = require('../electron/ailis-context-compiler.cjs');
const { AILISAgentRunner, buildLlmAgentDirectToolPrompt } = require('../electron/agent-loop/runner.cjs');
const { restoreModelInputContextManagerFromCheckpoint } = require('../electron/ailis-model-input-builder.cjs');

const messageItem = (role, text) => ({ type: 'message', role, content: [{ type: role === 'assistant' ? 'output_text' : 'input_text', text }] });
const checkpoint = (...items) => ({ history_version: items.length, items });
const completed = (request, text, state) => ({ ok: true, status: 'completed', runId: request.runId,
    sessionId: request.sessionId, displayText: text, speechText: text,
    ...(state ? { taskRunHandoff: { resume: { contextManagerCheckpoint: state } } } : {}) });
const deferred = () => { let resolve; const promise = new Promise((r) => { resolve = r; }); return { promise, resolve }; };

async function fixture(t) {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-unified-test-'));
    const options = { port: 0, workspaceRoot: root, projectRoot: path.resolve('.'),
        auditDir: path.join(root, '.audit'), emberHarnessEnabled: false, profileCurationEnabled: false };
    const gateway = new AILISGateway(options);
    t.after(async () => { await gateway.stop(); await fs.rm(root, { recursive: true, force: true }); });
    return { root, gateway, options };
}

test('unified main calls one runner and preserves its answer, streaming, permissions and one final delivery', async (t) => {
    const { gateway } = await fixture(t);
    const calls = [], memory = [], deltas = [];
    const answer = '结果是 42。来源：https://example.test/evidence';
    gateway.runPrivatePersonaTurn = () => { throw new Error('No Persona actor'); };
    gateway.taskAgentHarness.dispatchTurn = () => { throw new Error('No routing actor'); };
    gateway.ensureAgentRunner = () => ({
        runMessage: async (request) => {
            calls.push(request);
            await request.onTextDelta(answer);
            gateway.emitGatewayEvent('agent.run.finished', { runId: request.runId, sessionId: request.sessionId, displayText: 'pre-gate' });
            return completed(request, answer, checkpoint(messageItem('user', request.message), messageItem('assistant', answer)));
        }, recordMemoryTurn: (entry) => memory.push(entry)
    });
    const result = await gateway.runAgent({ message: '核对结果', runId: 'one', sessionId: 's',
        onTextDelta: (text) => deltas.push(text),
        context: { agentRole: 'persona_orchestrator', taskAgentRoutingOwned: true,
            personaDraft: true, personaRenderOnly: true, computerControlMode: 'confirm', approved: false } });
    assert.equal(calls.length, 1);
    assert.equal(calls[0].context.agentRole, 'unified_agent');
    assert.equal(calls[0].context.taskAgentRoutingOwned, false);
    assert.equal(calls[0].context.personaRenderOnly, false);
    assert.equal(calls[0].context.approved, false);
    assert.equal(calls[0].context.computerControlMode, 'confirm');
    assert.equal(result.displayText, answer);
    assert.deepEqual(deltas, [answer]);
    assert.equal(memory.length, 1);
    assert.equal(gateway.eventLog.filter((e) => e.type === 'agent.run.finished').length, 1);
    assert.equal(gateway.eventLog.filter((e) => e.type === 'agent.message.completed').length, 1);
    assert.equal(gateway.eventLog.some((e) => e.type === 'persona.background.message'), false);
});

test('unified Session restores the same conversation and execution checkpoint after restart', async (t) => {
    const { gateway, options } = await fixture(t);
    const calls = [];
    const install = (instance) => { instance.ensureAgentRunner = () => ({ runMessage: async (request) => {
        calls.push(request);
        const items = [...(request.initialContextManagerCheckpoint?.items || []), messageItem('user', request.message)];
        await request.onModelInputContextCheckpoint(checkpoint(...items));
        assert.deepEqual(instance.sessionContextStore.getCheckpoint('s').items, items);
        return completed(request, '答复', checkpoint(...items, messageItem('assistant', '答复')));
    } }); };
    install(gateway);
    await gateway.runAgent({ message: '聊一聊', sessionId: 's', agentRole: 'unified_agent' });
    await gateway.runAgent({ message: '执行下一步', sessionId: 's', agentRole: 'unified_agent' });
    const restarted = new AILISGateway(options);
    t.after(() => restarted.stop());
    install(restarted);
    await restarted.runAgent({ message: '继续', sessionId: 's', agentRole: 'unified_agent' });
    assert.deepEqual(calls[2].initialContextManagerCheckpoint.items.filter((i) => i.role === 'user')
        .map((i) => i.content[0].text), ['聊一聊', '执行下一步']);
});

test('compaction replaces canonical history and Sessions do not overwrite each other', async (t) => {
    const { root } = await fixture(t);
    const store = new AILISSessionContextStore({ rootDir: path.join(root, 'contexts') });
    store.commitCheckpoint('a', checkpoint(messageItem('user', 'old'), messageItem('assistant', 'old output')));
    store.commitCheckpoint('b', checkpoint(messageItem('user', 'other session')));
    const compacted = checkpoint(messageItem('developer', 'compacted state + output refs'));
    store.commitCheckpoint('a', compacted);
    const restarted = new AILISSessionContextStore({ rootDir: path.join(root, 'contexts') });
    assert.deepEqual(restarted.getCheckpoint('a'), compacted);
    assert.match(JSON.stringify(restarted.getCheckpoint('b')), /other session/);
    assert.equal(restarted.getStatus().sessionCount, 2);
    const release = store.acquireSession('a');
    assert.throws(() => restarted.acquireSession('a'), { code: 'AILIS_SESSION_BUSY' });
    release();
    restarted.acquireSession('a')();
    const exited = spawnSync(process.execPath, ['-e', ''], { windowsHide: true });
    assert.equal(exited.status, 0);
    await fs.writeFile(`${store.sessionPath('a')}.lock`, JSON.stringify({ pid: exited.pid, token: 'dead-test-owner' }));
    restarted.acquireSession('a')();
    await fs.writeFile(store.sessionPath('bad'), '{invalid');
    assert.throws(() => restarted.getCheckpoint('bad'), SyntaxError);
});

test('legacy migration imports one checkpoint once and never writes a legacy actor store', async (t) => {
    const { gateway } = await fixture(t);
    const execution = checkpoint(messageItem('user', '任务'), { type: 'function_call_output', call_id: 'c1', output: 'evidence' });
    gateway.taskAgentHarness = { getThread: () => ({ contextCheckpoint: execution }) };
    let personaReads = 0;
    gateway.getPersonaContextCheckpoint = () => { personaReads++; return checkpoint(messageItem('assistant', 'rewritten draft')); };
    gateway.commitPrivatePersonaResult = () => { throw new Error('legacy write'); };
    let first = true;
    gateway.ensureAgentRunner = () => ({ runMessage: async (request) => {
        if (first) assert.deepEqual(request.initialContextManagerCheckpoint, execution);
        else assert.match(JSON.stringify(request.initialContextManagerCheckpoint), /new answer/);
        first = false;
        return completed(request, 'new answer', checkpoint(...request.initialContextManagerCheckpoint.items, messageItem('assistant', 'new answer')));
    } });
    await gateway.runAgent({ message: '继续', sessionId: 's', agentRole: 'main' });
    gateway.taskAgentHarness.getThread = () => { throw new Error('must not import twice'); };
    await gateway.runAgent({ message: '再继续', sessionId: 's', agentRole: 'main' });
    assert.equal(personaReads, 0);
    assert.equal(execution.items.length, 2);
});

test('same-session text steers the active run; attachments and proactive packets serialize', async (t) => {
    const { gateway } = await fixture(t);
    const entered = deferred(), release = deferred();
    const calls = [], steers = [];
    gateway.ensureAgentRunner = () => ({
        enqueueRunInput: (value) => { steers.push(value); return true; },
        runMessage: async (request) => {
            calls.push(request); entered.resolve();
            if (calls.length === 1) await release.promise;
            return completed(request, 'done', checkpoint(messageItem('assistant', 'done')));
        }
    });
    const initial = gateway.runAgent({ message: '开始', runId: 'active', sessionId: 's', agentRole: 'main' });
    await entered.promise;
    const steer = await gateway.runAgent({ message: '补充限制', sessionId: 's', agentRole: 'main' });
    assert.equal(steer.steerAccepted, true);
    assert.equal(steer.runId, 'active');
    const attached = gateway.runAgent({ message: '读附件', sessionId: 's', agentRole: 'main', context: { fileAttachments: [{ path: 'sample.txt' }] } });
    const proactive = gateway.runAgent({ message: 'previous user message', sessionId: 's', agentRole: 'main',
        context: { suppressCurrentUserMessage: true, ephemeralDeveloperMessage: 'proactive context' } });
    await new Promise(setImmediate);
    assert.equal(calls.length, 1);
    release.resolve();
    await Promise.all([initial, attached, proactive]);
    assert.equal(calls.length, 3);
    assert.deepEqual(steers.map((s) => s.message), ['补充限制']);
    assert.equal(gateway.activeUnifiedTurns.size, 0);
});

test('failure releases ownership but preserves the last durable checkpoint', async (t) => {
    const { gateway } = await fixture(t);
    gateway.ensureAgentRunner = () => ({ runMessage: async (request) => {
        await request.onModelInputContextCheckpoint(checkpoint(messageItem('user', 'durable input')));
        throw new Error('provider offline');
    } });
    await assert.rejects(gateway.runAgent({ message: '开始', sessionId: 's', agentRole: 'main' }), /provider offline/);
    assert.equal(gateway.activeUnifiedTurns.size, 0);
    assert.match(JSON.stringify(gateway.sessionContextStore.getCheckpoint('s')), /durable input/);
    gateway.sessionContextStore.acquireSession('s')();
});

test('checkpoint storage failure stops before a model call and clears runner ownership', async (t) => {
    const { gateway } = await fixture(t);
    const runner = gateway.ensureAgentRunner();
    gateway.sessionContextStore.commitCheckpoint = () => { throw new Error('storage unavailable'); };
    await assert.rejects(gateway.runAgent({ message: 'test', sessionId: 's', agentRole: 'unified_agent',
        llmSettings: { provider: 'openai-compatible', baseUrl: 'http://127.0.0.1:9/v1', apiKey: 'local-test', model: 'test-model' }
    }), /storage unavailable/);
    assert.equal(runner.activeRuns.size, 0);
    assert.equal(gateway.activeUnifiedTurns.size, 0);
    assert.equal(gateway.eventLog.some((e) => e.type === 'agent.llm_call.started'), false);
});

test('input gate stops before creating a unified writer or invoking an agent', async (t) => {
    const { gateway } = await fixture(t);
    gateway.runEmberHarnessCheck = async () => ({ blocked: true });
    gateway.ensureAgentRunner = () => { throw new Error('must not execute'); };
    const result = await gateway.runAgent({ message: 'blocked input', sessionId: 's', agentRole: 'main' });
    assert.equal(result.status, 'blocked');
    assert.equal(gateway.sessionContextStore.getCheckpoint('s'), null);
});

test('explicit child role does not inherit main Session ownership', async (t) => {
    const { gateway } = await fixture(t);
    gateway.runUnifiedAgentTurn = () => { throw new Error('not a main turn'); };
    gateway.ensureAgentRunner = () => ({ runMessage: async (request) => completed(request, 'child result') });
    const result = await gateway.runAgent({ message: 'explicit child work', agentRole: 'task_agent',
        context: { unifiedAgent: true, taskAgentRoutingOwned: true } });
    assert.equal(result.displayText, 'child result');
});

test('output gate blocks delivery and memory write before releasing the single writer', async (t) => {
    const { gateway } = await fixture(t);
    const gateEntered = deferred(), releaseGate = deferred();
    const deltas = [], memories = [], calls = [];
    gateway.shouldRunEmberHarness = () => true;
    gateway.runEmberHarnessCheck = async ({ stage }) => {
        if (stage !== 'final_output') return { blocked: false };
        gateEntered.resolve(); await releaseGate.promise;
        return { blocked: true };
    };
    gateway.ensureAgentRunner = () => ({ runMessage: async (request) => {
        calls.push(request);
        assert.equal(request.onTextDelta, undefined);
        gateway.emitGatewayEvent('agent.message.completed', { sessionId: request.sessionId, runId: request.runId, text: 'unsafe text' });
        return completed(request, 'unsafe text', checkpoint(messageItem('assistant', 'unsafe text')));
    }, recordMemoryTurn: (entry) => memories.push(entry), enqueueRunInput: () => { throw new Error('must not steer during finalization'); } });
    const first = gateway.runAgent({ message: 'test', sessionId: 's', agentRole: 'main', onTextDelta: (x) => deltas.push(x) });
    await gateEntered.promise;
    const second = gateway.runAgent({ message: 'next', sessionId: 's', agentRole: 'main' });
    await new Promise(setImmediate);
    assert.equal(calls.length, 1);
    releaseGate.resolve();
    const results = await Promise.all([first, second]);
    assert.equal(results[0].status, 'blocked');
    assert.deepEqual(deltas, []);
    assert.deepEqual(memories, []);
    assert.equal(gateway.eventLog.some((e) => JSON.stringify(e).includes('unsafe text')), false);
    assert.match(JSON.stringify(gateway.sessionContextStore.getCheckpoint('s')), /was not delivered/);
});

test('unified context includes personality, user preferences and execution, without stale task capsules', () => {
    const compiler = new AILISContextCompiler({ memoryRuntime: { getContextSources: () => ({
        personaText: '温暖直率', userText: '喜欢简洁', relationshipText: '长期伙伴', projectText: '当前项目', relevantMemoriesText: '可靠证据'
    }) } });
    const memory = compiler.compile({ agentMode: 'unified', interactionPreferences: '用中文', activeTaskState: 'stale task capsule' });
    assert.equal(memory.contextMode, 'unified');
    assert.match(memory.toString(), /温暖直率/);
    assert.match(memory.toString(), /用中文/);
    assert.doesNotMatch(memory.toString(), /stale task capsule/);
    const prompt = buildLlmAgentDirectToolPrompt({ contextMode: 'unified', model: 'gpt-5.6-luna', message: '执行',
        messageHistory: Array.from({ length: 10 }, (_, i) => ({ role: 'user', content: `history-${i}` })), memoryContext: memory });
    assert.match(prompt.instructions, /AILIS.*爱丽丝/);
    assert.match(prompt.instructions, /You own this whole conversation/);
    assert.doesNotMatch(prompt.instructions, /ask TaskAgent|call handoff_task exactly once|persona_output/);
    assert.equal(prompt.input.filter((i) => i.role === 'user').length, 11);
    assert.equal(prompt.stats.task_agent_prompt_projection, 'unified-agent');
});

test('restored unified prompt appends changed memory and attachments without rewriting its prefix', () => {
    const initial = buildLlmAgentDirectToolPrompt({ contextMode: 'unified', message: '第一次', memoryContext: 'initial memory' });
    const contextManager = restoreModelInputContextManagerFromCheckpoint(initial.contextManager.toCheckpoint());
    const prefix = contextManager.rawItems();
    const args = { contextMode: 'unified', contextManager, message: '第二次', memoryContext: 'updated memory',
        fileAttachments: [{ path: '/workspace/new.txt', name: 'new.txt' }],
        modelImageAttachments: [{ image_url: 'data:image/png;base64,AAAA' }] };
    const updated = buildLlmAgentDirectToolPrompt(args);
    assert.deepEqual(updated.input.slice(0, prefix.length), prefix);
    assert.match(JSON.stringify(updated.input), /updated memory/);
    assert.match(JSON.stringify(updated.input), /new.txt/);
    assert.match(JSON.stringify(updated.input), /input_image/);
    const items = updated.contextManager.rawItems();
    const repeated = buildLlmAgentDirectToolPrompt(args);
    assert.deepEqual(repeated.contextManager.rawItems(), items);
});

test('steering overflow is rejected, not an acknowledged input silently discarded', () => {
    const runner = Object.create(AILISAgentRunner.prototype);
    runner.activeRuns = new Map([['r', { runId: 'r', sessionId: 's', acceptingInput: true, pendingInputs: [] }]]);
    for (let i = 0; i < 32; i++) assert.equal(runner.enqueueRunInput({ runId: 'r', message: `input ${i}` }), true);
    assert.equal(runner.enqueueRunInput({ runId: 'r', message: 'overflow' }), false);
    assert.equal(runner.drainRunInputs('r')[0].message, 'input 0');
});

test('desktop chat, screenshots and both proactive reply modes use the same main gateway', async (t) => {
    const previousWindow = globalThis.window;
    const requests = [];
    const dataUrl = 'data:image/png;base64,AAAA';
    globalThis.window = { ailisDesktop: { platform: 'electron', preferences: { conversationMode: 'daily' }, gateway: {
        isSupported: true, onEvent: () => () => {},
        getStatus: async () => ({ running: true, workspaceRoot: '/test-workspace' }),
        runAgent: async (request) => { requests.push(request); return { ok: true, displayText: '单一回复' }; }
    }, llm: { chat: () => { throw new Error('No separate reply model'); } } } };
    t.after(() => { if (previousWindow === undefined) delete globalThis.window; else globalThis.window = previousWindow; });
    const service = createChatService({ conversationMode: 'daily' });
    assert.ok(service instanceof AILISDesktopChatService);
    assert.equal(service.conversationMode, 'assistant');
    const history = [{ role: 'user', content: '看这张图片', attachments: [{ type: 'vision', dataUrl, mimeType: 'image/png' }] }];
    const reply = await service.fetchAssistantTurn({ sessionId: 'ui-session', messageHistory: history });
    assert.equal(reply.display_text, '单一回复');
    assert.equal(requests[0].modelImageAttachments[0].image_url, dataUrl);
    assert.equal(JSON.stringify(requests[0].messageHistory).includes('base64'), false);
    for (const mode of ['companion', 'cowork']) {
        const result = await service.generateProactiveCompanionReply({ sessionId: 'ui-session', messageHistory: history, mode });
        assert.equal(result.text, '单一回复');
    }
    assert.equal(requests.length, 3);
    assert.deepEqual(requests[1].tools, requests[0].tools);
    assert.deepEqual(requests[2].tools, requests[0].tools);
    assert.ok(requests.every((r) => r.context.agentRole === 'unified_agent' && r.sessionId === 'ui-session'));
    assert.ok(requests.slice(1).every((r) => r.suppressCurrentUserMessage && r.ephemeralDeveloperMessage));
});

test('legacy daily preference normalizes to the unified main agent', () => {
    const { normalizeConversationMode, CONVERSATION_MODE_OPTIONS } = require('../electron/store.cjs');
    assert.deepEqual(CONVERSATION_MODE_OPTIONS, ['assistant']);
    assert.equal(normalizeConversationMode('daily'), 'assistant');
});

test('real unified runner executes tools and reuses evidence next turn without route or Persona calls', async (t) => {
    const { gateway } = await fixture(t);
    const requests = [];
    const firstAnswer = ['核验结果：42。JSON / exec / mkdir / AILIS_PROJECT_ROOT',
        '```powershell', "$exts = '*.cjs', '*.mjs', '*.json';", 'if ($true) {',
        '    Write-Output "exec JSON mkdir"', '}', '```'].join('\n');
    const server = http.createServer(async (request, response) => {
        let body = ''; for await (const chunk of request) body += chunk;
        const data = JSON.parse(body); requests.push(data);
        const first = requests.length === 1;
        response.writeHead(200, { 'content-type': 'application/json' });
        response.end(JSON.stringify({ choices: [{ message: first ? {
            role: 'assistant', content: '', tool_calls: [{ id: 'tool-42', type: 'function',
                function: { name: 'exec', arguments: JSON.stringify({ input: 'text(await tools.exec_command({cmd: \'node -e "console.log(42)"\', max_output_tokens: 128}));' }) } }]
        } : { role: 'assistant', content: requests.length === 2 ? firstAnswer : '上一轮的核验结果是 42。' },
        finish_reason: first ? 'tool_calls' : 'stop' }], usage: { prompt_tokens: 100, completion_tokens: 10, total_tokens: 110 } }));
    });
    await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
    t.after(() => new Promise((resolve) => { server.close(resolve); server.closeAllConnections(); }));
    const llmSettings = { provider: 'openai-compatible', baseUrl: `http://127.0.0.1:${server.address().port}/v1`,
        apiKey: 'local-test-only', model: 'test-model', temperature: 0, timeoutMs: 10000 };
    const context = { agentRole: 'unified_agent', agentLoop: 'llm', directToolExecutor: true, approved: true, llmSettings };
    const first = await gateway.runAgent({ message: '执行本地核验', sessionId: 'integration', context });
    assert.equal(first.status, 'completed', first.error || first.displayText);
    assert.equal(first.displayText, firstAnswer);
    assert.equal(first.surface.text, firstAnswer);
    assert.equal(first.surface.renderer, 'ailis-unified-surface');
    const second = await gateway.runAgent({ message: '刚才结果是什么', sessionId: 'integration', context });
    assert.equal(second.displayText, '上一轮的核验结果是 42。');
    assert.equal(requests.length, 3);
    assert.ok(requests[2].messages.some((m) => m.role === 'assistant' && m.content === firstAnswer));
    assert.ok(requests[2].messages.some((m) => m.role === 'tool' && m.content.includes('42')),
        JSON.stringify(requests[2].messages.filter((m) => m.role !== 'system')));
    for (const request of requests) {
        assert.equal(request.tool_choice, 'auto');
        assert.equal(request.tools.some((t) => ['task_route', 'handoff_task'].includes(t.function?.name || t.name)), false);
    }
    await gateway.runAgent({ message: '刚才结果是什么', sessionId: 'integration', context,
        suppressCurrentUserMessage: true, ephemeralDeveloperMessage: 'proactive trigger', runId: 'proactive-test' });
    assert.equal(requests[3].messages.filter((m) => m.role === 'user').length, 2);
    assert.ok(requests[3].messages.some((m) => String(m.content).includes('proactive trigger')));
    assert.match(JSON.stringify(gateway.sessionContextStore.getCheckpoint('integration')), /proactive trigger/);
    await gateway.runAgent({ message: '查看图片', sessionId: 'integration', context,
        modelImageAttachments: [{ image_url: 'data:image/png;base64,AAAA' }] });
    assert.ok(requests[4].messages.some((m) => Array.isArray(m.content) && m.content.some((p) => p.type === 'image_url')));
    assert.equal(gateway.eventLog.filter((e) => e.type === 'agent.run.finished').length, 4);
    assert.equal(gateway.eventLog.filter((e) => e.type === 'agent.memory.recorded').length, 4);
    assert.equal(gateway.activeUnifiedTurns.size, 0);
});
