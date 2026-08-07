import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { EventEmitter } from 'node:events';
import http from 'node:http';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const {
    AILISHostedRuntimeManager,
    sanitizeAgentRequest,
    tenantKey
} = require('../electron/ailis-hosted-runtime.cjs');

class FakeGateway extends EventEmitter {
    constructor(options) {
        super();
        this.options = options;
        this.requests = [];
        this.stopped = false;
    }

    startProfileCurationScheduler() {}

    async runAgent(request) {
        this.requests.push(request);
        this.emit('event', {
            type: 'agent.run.started',
            payload: { runId: `run-${this.requests.length}`, sessionId: request.sessionId }
        });
        await request.onTextStreamEvent?.({
            type: 'response.output_text.started',
            streamId: `stream-${this.requests.length}`
        });
        await request.onTextDelta?.('done', { provider: 'fake' });
        await request.onTextStreamEvent?.({
            type: 'response.output_text.committed',
            streamId: `stream-${this.requests.length}`
        });
        return {
            ok: true,
            status: 'completed',
            runId: `run-${this.requests.length}`,
            displayText: 'done'
        };
    }

    async interruptAgentRun(payload) {
        return { ok: true, status: 'interrupted', ...payload };
    }

    getStatus() {
        return { running: true };
    }

    async stop() {
        this.stopped = true;
    }
}

test('hosted runtime isolates memory and workspace roots per signed tenant', async () => {
    const dataRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-hosted-runtime-'));
    const projectRoot = path.resolve('.');
    const gateways = [];
    const manager = new AILISHostedRuntimeManager({
        dataRoot,
        projectRoot,
        llmSettings: {
            provider: 'openai-compatible',
            baseUrl: 'https://example.test',
            apiKey: 'test-key',
            model: 'test-model'
        },
        gatewayFactory: (options) => {
            const gateway = new FakeGateway(options);
            gateways.push(gateway);
            return gateway;
        }
    });

    await manager.runAgent('web:alice', { sessionId: 'main', message: 'hello' });
    await manager.runAgent('web:bob', { sessionId: 'main', message: 'hello' });

    assert.equal(gateways.length, 2);
    assert.notEqual(gateways[0].options.auditDir, gateways[1].options.auditDir);
    assert.notEqual(gateways[0].options.workspaceRoot, gateways[1].options.workspaceRoot);
    assert.equal(gateways[0].options.projectRoot, projectRoot);
    assert.equal(gateways[0].options.getDefaultContext().taskAgentRoutingOwned, true);
    assert.match(gateways[0].options.auditDir, new RegExp(tenantKey('web:alice')));
    assert.match(gateways[1].options.auditDir, new RegExp(tenantKey('web:bob')));
    assert.equal(gateways[0].requests[0].llmSettings.apiKey, 'test-key');

    const aliceEvents = manager.getEvents('web:alice');
    const bobEvents = manager.getEvents('web:bob');
    assert.equal(aliceEvents.events.length, 1);
    assert.equal(bobEvents.events.length, 1);
    assert.equal(aliceEvents.events[0].payload.sessionId, 'main');

    await manager.close();
    assert.ok(gateways.every((gateway) => gateway.stopped));
});

test('hosted runtime replaces browser-supplied paths, credentials, and approvals', () => {
    const record = {
        workspaceRoot: '/srv/ailis/tenant/workspace',
        projectRoot: '/srv/ailis/source',
        llmSettings: {
            provider: 'openai-compatible',
            baseUrl: 'https://example.test',
            apiKey: 'server-key',
            model: 'server-model'
        }
    };
    const request = sanitizeAgentRequest({
        sessionId: 'web-session',
        maxAgentSteps: 999,
        workspace: '/etc',
        projectRoot: '/',
        approved: true,
        llmSettings: { apiKey: 'browser-key' },
        context: {
            workspace: '/etc',
            projectRoot: '/',
            approved: true,
            autoConfirm: true,
            llmSettings: { apiKey: 'browser-key' }
        }
    }, record);

    assert.equal(request.maxAgentSteps, 12);
    assert.equal(request.llmSettings.apiKey, 'server-key');
    assert.equal(request.context.workspace, record.workspaceRoot);
    assert.equal(request.context.projectRoot, record.projectRoot);
    assert.equal(request.context.taskAgentRoutingOwned, true);
    assert.equal(request.context.approved, undefined);
    assert.equal(request.context.autoConfirm, undefined);
    assert.equal(request.workspace, undefined);
    assert.equal(request.projectRoot, undefined);
    assert.equal(request.approved, undefined);
    assert.equal(request.agentRole, 'persona_orchestrator');
    assert.equal(request.context.agentRole, 'persona_orchestrator');
});

test('hosted runtime forwards provider text deltas outside the serialized request', async () => {
    const dataRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-hosted-stream-'));
    const manager = new AILISHostedRuntimeManager({
        dataRoot,
        llmSettings: {
            provider: 'openai-compatible',
            baseUrl: 'https://example.test',
            apiKey: 'test-key',
            model: 'test-model'
        },
        gatewayFactory: (options) => new FakeGateway(options)
    });
    const deltas = [];
    const streamEvents = [];

    try {
        const result = await manager.runAgent(
            'web:stream',
            { sessionId: 'main', message: 'hello' },
            {
                onTextDelta: (delta, metadata) => deltas.push({ delta, metadata }),
                onTextStreamEvent: (event) => streamEvents.push(event.type)
            }
        );
        assert.equal(result.ok, true);
        assert.deepEqual(deltas, [{ delta: 'done', metadata: { provider: 'fake' } }]);
        assert.deepEqual(streamEvents, [
            'response.output_text.started',
            'response.output_text.committed'
        ]);
    } finally {
        await manager.close();
    }
});

test('real hosted Persona streams its fast lane while TaskAgent routes chat', async () => {
    const modelRequests = [];
    const modelServer = http.createServer(async (req, res) => {
        const chunks = [];
        for await (const chunk of req) chunks.push(chunk);
        const request = JSON.parse(Buffer.concat(chunks).toString('utf8'));
        modelRequests.push(request);
        const toolNames = (request.tools || []).map((tool) => tool?.function?.name || tool?.name || '');
        if (toolNames.includes('task_route')) {
            const response = Buffer.from(JSON.stringify({
                choices: [{
                    message: {
                        role: 'assistant',
                        content: null,
                        tool_calls: [{
                            id: 'call-hosted-chat-route',
                            type: 'function',
                            function: { name: 'task_route', arguments: '{"mode":"chat"}' }
                        }]
                    }
                }]
            }));
            res.writeHead(200, {
                'content-type': 'application/json',
                'content-length': response.length
            });
            res.end(response);
            return;
        }
        if (request.stream === true) {
            res.writeHead(200, {
                'content-type': 'text/event-stream; charset=utf-8',
                'cache-control': 'no-cache'
            });
            res.write(`data: ${JSON.stringify({
                choices: [{ index: 0, delta: { role: 'assistant', content: '你好，我在这里。' }, finish_reason: null }]
            })}\n\n`);
            res.write(`data: ${JSON.stringify({
                choices: [{ index: 0, delta: {}, finish_reason: 'stop' }],
                usage: { prompt_tokens: 20, completion_tokens: 6, total_tokens: 26 }
            })}\n\n`);
            res.end('data: [DONE]\n\n');
            return;
        }
        const response = Buffer.from(JSON.stringify({
            choices: [{
                message: { role: 'assistant', content: '你好，我在这里。' },
                finish_reason: 'stop'
            }],
            usage: { prompt_tokens: 20, completion_tokens: 6, total_tokens: 26 }
        }));
        res.writeHead(200, {
            'content-type': 'application/json',
            'content-length': response.length
        });
        res.end(response);
    });
    await new Promise((resolve) => modelServer.listen(0, '127.0.0.1', resolve));
    const address = modelServer.address();
    const dataRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-hosted-real-stream-'));
    const manager = new AILISHostedRuntimeManager({
        dataRoot,
        llmSettings: {
            provider: 'deepseek',
            baseUrl: `http://127.0.0.1:${address.port}/v1`,
            apiKey: 'test-key',
            model: 'deepseek-chat',
            timeoutMs: 10000
        }
    });
    const deltas = [];
    const streamEvents = [];

    try {
        const result = await manager.runAgent(
            'web:real-stream',
            {
                sessionId: 'main',
                message: '你好',
                messageHistory: [{ role: 'user', content: '你好' }],
                maxAgentSteps: 2
            },
            {
                onTextDelta: (delta) => deltas.push(delta),
                onTextStreamEvent: (event) => streamEvents.push(event.type)
            }
        );

        assert.equal(result.ok, true);
        assert.equal(result.displayText, '你好，我在这里。');
        assert.deepEqual(deltas, ['你好，我在这里。']);
        assert.deepEqual(streamEvents, [
            'response.output_text.started',
            'response.output_text.committed'
        ]);
        assert.ok(modelRequests.some((request) => request.stream === true));
        assert.ok(modelRequests.some((request) => (request.tools || []).some((tool) =>
            (tool?.function?.name || tool?.name) === 'task_route'
        )));
    } finally {
        await manager.close();
        await new Promise((resolve) => modelServer.close(resolve));
    }
});

test('hosted runtime executes the real Persona Agent and restores memory after restart', async () => {
    const requests = [];
    const modelServer = http.createServer(async (req, res) => {
        const chunks = [];
        for await (const chunk of req) chunks.push(chunk);
        const request = JSON.parse(Buffer.concat(chunks).toString('utf8'));
        requests.push(request);
        const toolNames = (request.tools || []).map((tool) => tool?.function?.name || tool?.name || '');
        const message = toolNames.includes('task_route')
            ? {
                  role: 'assistant',
                  content: null,
                  tool_calls: [{
                      id: 'call-hosted-memory-chat-route',
                      type: 'function',
                      function: { name: 'task_route', arguments: '{"mode":"chat"}' }
                  }]
              }
            : {
                  role: 'assistant',
                  content: '你好，我在这里。'
              };
        const response = Buffer.from(JSON.stringify({
            id: 'chatcmpl-hosted-test',
            object: 'chat.completion',
            choices: [{
                index: 0,
                message,
                finish_reason: message.tool_calls ? 'tool_calls' : 'stop'
            }],
            usage: { prompt_tokens: 20, completion_tokens: 8, total_tokens: 28 }
        }));
        res.writeHead(200, {
            'content-type': 'application/json',
            'content-length': response.length
        });
        res.end(response);
    });
    await new Promise((resolve) => modelServer.listen(0, '127.0.0.1', resolve));
    const address = modelServer.address();
    const dataRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-hosted-real-'));
    const managerOptions = {
        dataRoot,
        llmSettings: {
            provider: 'openai-compatible',
            baseUrl: `http://127.0.0.1:${address.port}/v1`,
            apiKey: 'test-key',
            model: 'test-model',
            timeoutMs: 10000
        }
    };
    let manager = new AILISHostedRuntimeManager(managerOptions);

    try {
        const result = await manager.runAgent('web:integration', {
            sessionId: 'main',
            message: '请记住，我叫云辛。',
            messageHistory: [{ role: 'user', content: '请记住，我叫云辛。' }],
            maxAgentSteps: 2
        });
        assert.equal(result.ok, true);
        assert.match(result.displayText || result.finalAnswer, /你好/);
        assert.ok(requests.length >= 1);
        const personaToolNames = requests.flatMap((request) =>
            (request.tools || []).map((tool) => tool?.function?.name || tool?.name || '')
        );
        assert.ok(
            personaToolNames.includes('task_route'),
            JSON.stringify(requests.map((request) => ({
                keys: Object.keys(request),
                toolNames: (request.tools || []).map((tool) => tool?.function?.name || tool?.name || '')
            })))
        );

        const key = tenantKey('web:integration');
        const memoryStatePath = path.join(
            dataRoot,
            'tenants',
            key,
            'state',
            'memory',
            'memory-state.json'
        );
        const memoryState = JSON.parse(await fs.readFile(memoryStatePath, 'utf8'));
        assert.ok(memoryState.events.some((event) => event.userText.includes('云辛')));

        await manager.close();
        manager = new AILISHostedRuntimeManager(managerOptions);
        const requestCountBeforeRestore = requests.length;
        const restoredResult = await manager.runAgent('web:integration', {
            sessionId: 'main',
            message: '我叫什么名字？',
            messageHistory: [{ role: 'user', content: '我叫什么名字？' }],
            maxAgentSteps: 2
        });
        assert.equal(restoredResult.ok, true);
        const restoredModelCalls = requests.slice(requestCountBeforeRestore);
        assert.ok(restoredModelCalls.length >= 1);
        assert.match(JSON.stringify(restoredModelCalls), /云辛/);
    } finally {
        await manager.close();
        await new Promise((resolve) => modelServer.close(resolve));
    }
});

test('hosted TaskAgent owns web task routing and Persona renders its result', async () => {
    const requests = [];
    const modelServer = http.createServer(async (req, res) => {
        const chunks = [];
        for await (const chunk of req) chunks.push(chunk);
        const request = JSON.parse(Buffer.concat(chunks).toString('utf8'));
        requests.push(request);
        const toolNames = (request.tools || []).map((tool) =>
            tool?.function?.name || tool?.name || ''
        );
        const message = toolNames.includes('task_route')
            ? {
                  role: 'assistant',
                  content: null,
                  tool_calls: [{
                      id: 'call-hosted-task-route',
                      type: 'function',
                      function: { name: 'task_route', arguments: '{"mode":"execute"}' }
                  }]
              }
            : {
                  role: 'assistant',
                  content: '网页任务已经完成。'
              };
        const response = Buffer.from(JSON.stringify({
            id: 'chatcmpl-hosted-handoff',
            object: 'chat.completion',
            choices: [{ index: 0, message, finish_reason: message.tool_calls ? 'tool_calls' : 'stop' }],
            usage: { prompt_tokens: 40, completion_tokens: 12, total_tokens: 52 }
        }));
        res.writeHead(200, {
            'content-type': 'application/json',
            'content-length': response.length
        });
        res.end(response);
    });
    await new Promise((resolve) => modelServer.listen(0, '127.0.0.1', resolve));
    const address = modelServer.address();
    const dataRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-hosted-handoff-'));
    const manager = new AILISHostedRuntimeManager({
        dataRoot,
        llmSettings: {
            provider: 'openai-compatible',
            baseUrl: `http://127.0.0.1:${address.port}/v1`,
            apiKey: 'test-key',
            model: 'test-model',
            timeoutMs: 10000
        }
    });

    try {
        const result = await manager.runAgent('web:task-agent', {
            sessionId: 'main',
            message: '请执行一个需要工具的任务。',
            messageHistory: [{ role: 'user', content: '请执行一个需要工具的任务。' }],
            maxAgentSteps: 4,
            requireTaskExecution: true
        });
        assert.equal(result.ok, true);
        assert.match(result.displayText || result.finalAnswer, /网页任务已经完成/);
        const allToolSurfaces = requests.map((request) =>
            (request.tools || []).map((tool) => tool?.function?.name || tool?.name || '')
        );
        assert.ok(allToolSurfaces.some((tools) => tools.includes('task_route')));
        assert.equal(allToolSurfaces.some((tools) => tools.includes('handoff_task')), false);
        assert.ok(allToolSurfaces.some((tools) => tools.includes('tool_search')));

        const key = tenantKey('web:task-agent');
        const harnessRoot = path.join(
            dataRoot,
            'tenants',
            key,
            'state',
            'task-agent-harness'
        );
        assert.ok((await fs.readdir(harnessRoot)).length > 0);
    } finally {
        await manager.close();
        await new Promise((resolve) => modelServer.close(resolve));
    }
});
