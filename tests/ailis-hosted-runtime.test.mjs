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
    const gateways = [];
    const manager = new AILISHostedRuntimeManager({
        dataRoot,
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
    assert.equal(request.context.projectRoot, record.workspaceRoot);
    assert.equal(request.context.approved, undefined);
    assert.equal(request.context.autoConfirm, undefined);
    assert.equal(request.workspace, undefined);
    assert.equal(request.projectRoot, undefined);
    assert.equal(request.approved, undefined);
    assert.equal(request.agentRole, 'persona_orchestrator');
    assert.equal(request.context.agentRole, 'persona_orchestrator');
});

test('hosted runtime executes the real Persona Agent and restores memory after restart', async () => {
    const requests = [];
    const modelServer = http.createServer(async (req, res) => {
        const chunks = [];
        for await (const chunk of req) chunks.push(chunk);
        requests.push(JSON.parse(Buffer.concat(chunks).toString('utf8')));
        const response = Buffer.from(JSON.stringify({
            id: 'chatcmpl-hosted-test',
            object: 'chat.completion',
            choices: [{
                index: 0,
                message: {
                    role: 'assistant',
                    content: '你好，我在这里。'
                },
                finish_reason: 'stop'
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
            personaToolNames.includes('handoff_task'),
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

test('hosted Persona can hand a web request to the real persistent TaskAgent harness', async () => {
    const requests = [];
    const modelServer = http.createServer(async (req, res) => {
        const chunks = [];
        for await (const chunk of req) chunks.push(chunk);
        const request = JSON.parse(Buffer.concat(chunks).toString('utf8'));
        requests.push(request);
        const toolNames = (request.tools || []).map((tool) =>
            tool?.function?.name || tool?.name || ''
        );
        const message = toolNames.includes('handoff_task')
            ? {
                  role: 'assistant',
                  content: null,
                  tool_calls: [{
                      id: 'call-hosted-handoff',
                      type: 'function',
                      function: { name: 'handoff_task', arguments: '{}' }
                  }]
              }
            : {
                  role: 'assistant',
                  content: '网页 TaskAgent 已经完成任务。'
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
        assert.match(result.displayText || result.finalAnswer, /TaskAgent/);
        const allToolSurfaces = requests.map((request) =>
            (request.tools || []).map((tool) => tool?.function?.name || tool?.name || '')
        );
        assert.ok(allToolSurfaces.some((tools) => tools.includes('handoff_task')));
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
