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
    sanitizeHostedLlmRequest,
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

class DeferredPersonaGateway extends EventEmitter {
    constructor(options, route = 'chat') {
        super();
        this.options = options;
        this.route = route;
        this.backgroundRuns = new Set();
    }

    startProfileCurationScheduler() {}

    async runAgent(request) {
        const runId = `outer-${this.route}`;
        const background = (async () => {
            await new Promise((resolve) => setTimeout(resolve, 10));
            this.emit('event', {
                type: 'task_agent.route.decided',
                payload: { runId: `task-${runId}`, sessionId: request.sessionId, mode: this.route }
            });
            await request.onTaskRoute?.(this.route, {
                runId,
                sessionId: request.sessionId
            });
            if (this.route === 'chat') {
                await request.onTextStreamEvent?.({
                    type: 'response.output_text.started',
                    streamId: `${runId}:persona:0`
                });
                await request.onTextDelta?.('在线回复', { streamId: `${runId}:persona:0` });
                await request.onTextStreamEvent?.({
                    type: 'response.output_text.committed',
                    streamId: `${runId}:persona:0`
                });
            }
            this.emit('event', {
                type: 'task.background.finished',
                payload: { runId, sessionId: request.sessionId, status: 'completed' }
            });
        })();
        this.backgroundRuns.add(background);
        void background.finally(() => this.backgroundRuns.delete(background));
        return {
            ok: true,
            runId,
            sessionId: request.sessionId,
            status: 'running',
            taskRoute: 'pending',
            displayText: '',
            deferAssistantCommit: true,
            backgroundTask: { runId, status: 'running' }
        };
    }

    hasBackgroundTaskRuns() {
        return this.backgroundRuns.size > 0;
    }

    async waitForBackgroundTaskRuns() {
        await Promise.allSettled([...this.backgroundRuns]);
    }

    async stop() {
        await this.waitForBackgroundTaskRuns();
    }
}

test('hosted event stream stays open for chat Persona but releases execute routes', async () => {
    const dataRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-hosted-stream-lifecycle-'));
    const deltas = [];
    const streamEvents = [];
    let nextRoute = 'chat';
    const manager = new AILISHostedRuntimeManager({
        dataRoot,
        gatewayFactory: (options) => new DeferredPersonaGateway(options, nextRoute)
    });

    try {
        const chatResult = await manager.runAgentEventStream('web:stream-chat', {
            sessionId: 'chat-session',
            message: '陪我聊一句'
        }, {
            onTextDelta: (delta) => deltas.push(delta),
            onTextStreamEvent: (event) => streamEvents.push(event.type),
            routeTimeoutMs: 1000,
            chatTimeoutMs: 1000
        });
        assert.equal(chatResult.taskRoute, 'chat');
        assert.deepEqual(deltas, ['在线回复']);
        assert.deepEqual(streamEvents, [
            'response.output_text.started',
            'response.output_text.committed'
        ]);

        nextRoute = 'execute';
        const executeResult = await manager.runAgentEventStream('web:stream-execute', {
            sessionId: 'execute-session',
            message: '执行任务'
        }, {
            routeTimeoutMs: 1000,
            chatTimeoutMs: 1000
        });
        assert.equal(executeResult.taskRoute, 'execute');
    } finally {
        await manager.close();
    }
});

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
    assert.equal(gateways[0].options.getDefaultContext().deferTaskHandoff, false);
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

test('hosted runtime stores browser uploads inside the active tenant workspace', async () => {
    const dataRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-hosted-upload-'));
    const manager = new AILISHostedRuntimeManager({
        dataRoot,
        maxAttachmentBytes: 1024,
        maxTenantAttachmentBytes: 4096,
        gatewayFactory: (options) => new FakeGateway(options)
    });

    try {
        const result = await manager.storeAttachment('web:attachment-alice', {
            sessionId: 'main',
            name: '../论文测试.pdf',
            mimeType: 'application/pdf',
            bytes: Buffer.from('%PDF-1.4\nAILIS_ATTACHMENT_TOKEN')
        });
        const expectedWorkspace = path.join(
            dataRoot,
            'tenants',
            tenantKey('web:attachment-alice'),
            'workspace'
        );
        assert.equal(result.ok, true);
        assert.equal(result.attachment.source, 'hosted-upload');
        assert.equal(result.attachment.name, '_论文测试.pdf');
        assert.equal(path.relative(expectedWorkspace, result.attachment.path).startsWith('..'), false);
        assert.equal(await fs.readFile(result.attachment.path, 'utf8'), '%PDF-1.4\nAILIS_ATTACHMENT_TOKEN');
    } finally {
        await manager.close();
    }
});

test('hosted runtime rejects browser uploads above the configured file limit', async () => {
    const dataRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-hosted-upload-limit-'));
    const manager = new AILISHostedRuntimeManager({
        dataRoot,
        maxAttachmentBytes: 1024,
        maxTenantAttachmentBytes: 2048,
        gatewayFactory: (options) => new FakeGateway(options)
    });

    try {
        await assert.rejects(
            manager.storeAttachment('web:attachment-limit', {
                name: 'large.bin',
                bytes: Buffer.alloc(1025)
            }),
            (error) => error?.message === 'attachment_too_large' && error?.statusCode === 413
        );
    } finally {
        await manager.close();
    }
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
    assert.equal(request.context.deferTaskHandoff, false);
    assert.equal(request.context.approved, undefined);
    assert.equal(request.context.autoConfirm, undefined);
    assert.equal(request.workspace, undefined);
    assert.equal(request.projectRoot, undefined);
    assert.equal(request.approved, undefined);
    assert.equal(request.agentRole, 'persona_orchestrator');
    assert.equal(request.context.agentRole, 'persona_orchestrator');
});

test('hosted LLM relay accepts only inference fields and clamps client controls', () => {
    const request = sanitizeHostedLlmRequest({
        model: 'attacker-model',
        baseUrl: 'https://attacker.test',
        apiKey: 'browser-key',
        messages: [{ role: 'user', content: 'hello' }],
        tools: Array.from({ length: 140 }, (_, index) => ({
            type: 'function',
            function: { name: `tool_${index}`, parameters: { type: 'object' } }
        })),
        temperature: 99,
        max_tokens: 999999,
        parallel_tool_calls: false,
        reasoning_effort: 'medium',
        thinking: { type: 'disabled', budget_tokens: 999999 }
    });

    assert.equal(request.model, undefined);
    assert.equal(request.baseUrl, undefined);
    assert.equal(request.apiKey, undefined);
    assert.equal(request.messages.length, 1);
    assert.equal(request.tools.length, 128);
    assert.equal(request.temperature, 2);
    assert.equal(request.max_tokens, 32768);
    assert.equal(request.parallel_tool_calls, false);
    assert.equal(request.reasoning_effort, 'medium');
    assert.deepEqual(request.thinking, { type: 'disabled' });
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

test('real hosted chat uses TaskAgent route and publishes exactly one background FinalAnswer', async () => {
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

        assert.equal(result.ok, true, JSON.stringify(result, null, 2));
        assert.equal(result.displayText, '');
        assert.equal(result.deferAssistantCommit, true);
        assert.deepEqual(deltas, []);
        assert.deepEqual(streamEvents, []);
        await manager.waitForBackgroundTasks('web:real-stream');
        const events = manager.getEvents('web:real-stream', { cursor: 0, limit: 500 }).events;
        const finalAnswers = events.filter((event) => (
            event.type === 'persona.background.message' && event.payload?.phase === 'final_answer'
        ));
        assert.equal(finalAnswers.length, 1);
        assert.equal(finalAnswers[0].payload.text, '你好，我在这里。');
        assert.equal(modelRequests.some((request) => (request.tools || []).some((tool) =>
            (tool?.function?.name || tool?.name) === 'handoff_task'
        )), false);
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
        assert.equal(result.deferAssistantCommit, true);
        await manager.waitForBackgroundTasks('web:integration');
        const firstEvents = manager.getEvents('web:integration', { cursor: 0, limit: 500 }).events;
        assert.ok(firstEvents.some((event) => (
            event.type === 'persona.background.message' && /你好/.test(event.payload?.text || '')
        )));
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
        assert.equal(restoredResult.deferAssistantCommit, true);
        await manager.waitForBackgroundTasks('web:integration');
        const restoredModelCalls = requests.slice(requestCountBeforeRestore);
        assert.ok(restoredModelCalls.length >= 1);
        assert.match(JSON.stringify(restoredModelCalls), /云辛/);
    } finally {
        await manager.close();
        await new Promise((resolve) => modelServer.close(resolve));
    }
});

test('hosted TaskAgent Turn receives the complete shared Session conversation', async () => {
    const requests = [];
    const modelServer = http.createServer(async (req, res) => {
        const chunks = [];
        for await (const chunk of req) chunks.push(chunk);
        const request = JSON.parse(Buffer.concat(chunks).toString('utf8'));
        requests.push(request);
        const toolNames = (request.tools || []).map((tool) =>
            tool?.function?.name || tool?.name || ''
        );
        const requestText = JSON.stringify(request);
        const isTaskResultRenderer = requestText.includes('Render the following authoritative TaskEvent/TaskResult');
        const taskRouteAlreadyCalled = (request.messages || []).at(-1)?.role === 'tool';
        const isTaskAgentTurn = toolNames.includes('task_route');
        const message = toolNames.includes('task_route') && !taskRouteAlreadyCalled
            ? {
                  role: 'assistant',
                  content: null,
                  tool_calls: [{
                      id: 'call-hosted-task-route',
                      type: 'function',
                      function: {
                          name: 'task_route',
                          arguments: '{"mode":"execute","progress_note":"我已经开始核对木偶攻略。"}'
                      }
                  }]
              }
            : {
                  role: 'assistant',
                  content: isTaskResultRenderer
                      ? '木偶攻略已经查好了。'
                      : isTaskAgentTurn
                          ? '已完成木偶攻略查询。'
                          : '好，我马上查。'
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
            message: '速度',
            messageHistory: [
                { role: 'user', content: '帮我查木偶攻略' },
                { role: 'assistant', content: '好，我来看看。' },
                { role: 'user', content: '速度' }
            ],
            maxAgentSteps: 4,
            requireTaskExecution: true
        });
        assert.equal(result.ok, true);
        assert.equal(result.displayText, '');
        assert.equal(result.deferAssistantCommit, true);
        assert.equal(result.backgroundTask?.status, 'running', JSON.stringify(result, null, 2));
        await manager.waitForBackgroundTasks('web:task-agent');
        const allToolSurfaces = requests.map((request) =>
            (request.tools || []).map((tool) => tool?.function?.name || tool?.name || '')
        );
        assert.equal(allToolSurfaces.some((tools) => tools.includes('handoff_task')), false);
        assert.ok(allToolSurfaces.some((tools) => tools.includes('task_route')));
        const taskAgentRequest = requests.find((request) =>
            (request.tools || []).some((tool) => (tool?.function?.name || tool?.name) === 'task_route')
        );
        assert.ok(taskAgentRequest, JSON.stringify(requests));
        assert.match(JSON.stringify(taskAgentRequest), /帮我查木偶攻略/);
        assert.match(JSON.stringify(taskAgentRequest), /速度/);
        const backgroundEvents = manager.getEvents('web:task-agent', { cursor: 0, limit: 500 }).events;
        assert.ok(backgroundEvents.some((event) => (
            event.type === 'persona.background.message' &&
            /木偶攻略已经查好了/.test(event.payload?.text || '')
        )), JSON.stringify(backgroundEvents, null, 2));

        const requestCountBeforeResume = requests.length;
        const resumed = await manager.runAgent('web:task-agent', {
            sessionId: 'main',
            message: '继续',
            messageHistory: [
                { role: 'user', content: '帮我查木偶攻略' },
                { role: 'assistant', content: '好，我来看看。' },
                { role: 'user', content: '速度' },
                { role: 'assistant', content: '木偶攻略已经查好了。' },
                { role: 'user', content: '继续' }
            ],
            maxAgentSteps: 4,
            requireTaskExecution: true
        });
        assert.equal(resumed.displayText, '');
        assert.equal(resumed.deferAssistantCommit, true);
        await manager.waitForBackgroundTasks('web:task-agent');
        const resumedTaskRequest = requests.slice(requestCountBeforeResume).find((request) =>
            (request.tools || []).some((tool) => (tool?.function?.name || tool?.name) === 'task_route')
        );
        assert.ok(resumedTaskRequest, JSON.stringify(requests.slice(requestCountBeforeResume)));
        assert.match(JSON.stringify(resumedTaskRequest), /ailis\.task_route_context\.v1/);
        assert.match(JSON.stringify(resumedTaskRequest), /visible_history/);
        assert.match(JSON.stringify(resumedTaskRequest), /帮我查木偶攻略/);
        assert.match(JSON.stringify(resumedTaskRequest), /继续/);

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
