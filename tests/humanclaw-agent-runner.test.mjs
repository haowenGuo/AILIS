import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { HumanClawGateway } = require('../electron/humanclaw-gateway.cjs');

async function jsonFetch(url, options = {}) {
    const response = await fetch(url, {
        ...options,
        headers: {
            'content-type': 'application/json',
            ...(options.headers || {})
        }
    });
    const body = await response.json();
    return { response, body };
}

async function runAgent(baseUrl, payload) {
    return await jsonFetch(`${baseUrl}/agent/run`, {
        method: 'POST',
        body: JSON.stringify(payload)
    });
}

test('HumanClaw Agent Runner plans chat and executes file tasks through the Gateway', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'humanclaw-agent-test-'));
    const gateway = new HumanClawGateway({
        port: 0,
        workspaceRoot,
        projectRoot: path.resolve('.'),
        auditDir: path.join(workspaceRoot, '.audit')
    });

    try {
        const status = await gateway.start();
        const baseUrl = status.url;

        const chat = await runAgent(baseUrl, {
            sessionId: 'agent-test',
            message: '你好'
        });
        assert.equal(chat.response.status, 200);
        assert.equal(chat.body.ok, true);
        assert.equal(chat.body.mode, 'conversation');
        assert.equal(chat.body.intent, 'emotional_chat');
        assert.equal(chat.body.executionRequired, false);
        assert.equal(chat.body.steps.length, 0);
        assert.match(chat.body.displayText, /统一的 HumanClaw Agent 链路/);

        const classifyConversation = await runAgent(baseUrl, {
            sessionId: 'agent-test',
            message: '我今天有点累',
            classifyOnly: true
        });
        assert.equal(classifyConversation.body.ok, true);
        assert.equal(classifyConversation.body.status, 'classified');
        assert.equal(classifyConversation.body.mode, 'conversation');
        assert.equal(classifyConversation.body.executionRequired, false);

        const classifyTask = await runAgent(baseUrl, {
            sessionId: 'agent-test',
            message: '/read note.txt',
            classifyOnly: true
        });
        assert.equal(classifyTask.body.ok, true);
        assert.equal(classifyTask.body.status, 'classified');
        assert.equal(classifyTask.body.mode, 'task');
        assert.equal(classifyTask.body.executionRequired, true);
        assert.equal(classifyTask.body.plan[0].tool, 'read');

        const emotional = await runAgent(baseUrl, {
            sessionId: 'agent-test',
            message: '我今天有点累'
        });
        assert.equal(emotional.body.ok, true);
        assert.equal(emotional.body.mode, 'conversation');
        assert.equal(emotional.body.intent, 'emotional_chat');
        assert.equal(emotional.body.steps.length, 0);
        assert.match(emotional.body.displayText, /慢一点/);

        const taskClarification = await runAgent(baseUrl, {
            sessionId: 'agent-test',
            message: '帮我开发一个网站'
        });
        assert.equal(taskClarification.body.ok, true);
        assert.equal(taskClarification.body.mode, 'task');
        assert.equal(taskClarification.body.intent, 'task_clarification');
        assert.equal(taskClarification.body.executionRequired, false);
        assert.equal(taskClarification.body.steps.length, 0);
        assert.match(taskClarification.body.displayText, /识别成任务请求/);

        const write = await runAgent(baseUrl, {
            sessionId: 'agent-test',
            message: '/write note.txt hello runner'
        });
        assert.equal(write.body.ok, true, write.body.displayText);
        assert.equal(write.body.status, 'completed');
        assert.equal(write.body.mode, 'task');
        assert.equal(write.body.executionRequired, true);
        assert.equal(write.body.intent, 'write_file');
        assert.equal(write.body.steps[0].tool, 'write');

        const read = await runAgent(baseUrl, {
            sessionId: 'agent-test',
            message: '请读取 note.txt'
        });
        assert.equal(read.body.ok, true, read.body.displayText);
        assert.equal(read.body.intent, 'read_file');
        assert.equal(read.body.steps[0].tool, 'read');
        assert.match(read.body.displayText, /hello runner/);

        const approval = await runAgent(baseUrl, {
            sessionId: 'agent-test',
            message: '/exec node -e "console.log(1)"'
        });
        assert.equal(approval.body.ok, false);
        assert.equal(approval.body.status, 'needs_approval');
        assert.match(approval.body.displayText, /需要.*确认/);

        const rpc = await jsonFetch(`${baseUrl}/rpc`, {
            method: 'POST',
            body: JSON.stringify({
                method: 'agent.run',
                params: {
                    sessionId: 'agent-test',
                    message: '/read note.txt'
                }
            })
        });
        assert.equal(rpc.body.ok, true, rpc.body.displayText);
        assert.match(rpc.body.displayText, /hello runner/);

        const audit = await jsonFetch(`${baseUrl}/audit?limit=20`);
        assert.equal(audit.body.ok, true);
        assert.ok(audit.body.entries.some((entry) => entry.type === 'agent.run'));
    } finally {
        await gateway.stop();
    }
});

test('HumanClaw Agent Runner restores durable pending plans after Gateway restart', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'humanclaw-pending-plan-test-'));
    const auditDir = path.join(workspaceRoot, '.audit');
    let gateway = new HumanClawGateway({
        port: 0,
        workspaceRoot,
        projectRoot: path.resolve('.'),
        auditDir
    });

    try {
        await gateway.start();
        const runner = gateway.ensureAgentRunner();
        runner.storePendingPlan({
            planId: 'plan-restore',
            sessionId: 'durable-plan-session',
            message: '需要确认的计划',
            createdAt: Date.now(),
            expiresAt: Date.now() + 60000,
            planner: 'llm-computer-planner',
            intent: 'durable_plan_test',
            summary: '持久化计划',
            riskLevel: 'medium',
            model: 'mock',
            steps: [],
            verificationSteps: [],
            raw: {}
        });
        assert.equal(runner.getStatus().pendingPlanCount, 1);

        await gateway.stop();

        gateway = new HumanClawGateway({
            port: 0,
            workspaceRoot,
            projectRoot: path.resolve('.'),
            auditDir
        });
        await gateway.start();
        const restoredRunner = gateway.ensureAgentRunner();
        assert.equal(restoredRunner.getStatus().restoredPendingPlanCount, 1);
        const restored = restoredRunner.findPendingPlanForSession('durable-plan-session');
        assert.equal(restored.planId, 'plan-restore');
    } finally {
        await gateway.stop().catch(() => {});
    }
});
