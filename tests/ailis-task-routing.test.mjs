import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { AILISGateway } = require('../electron/ailis-gateway.cjs');

async function createGateway({ intake, running = false, taskResult = null } = {}) {
    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-task-routing-'));
    const calls = { intake: [], handoff: [], persona: [] };
    const taskAgentHarness = {
        getSessionSnapshot: (sessionId) => ({
            schema: 'ailis.task_agent_session_snapshot.v1',
            session_id: sessionId,
            running,
            active_goal: null
        }),
        isRunning: () => running,
        handoff: async (args, context) => {
            calls.handoff.push({ args, context });
            return taskResult || {
                schema: 'ailis.task_result.v1',
                status: 'completed',
                final_answer: '已完成木偶攻略。',
                source_refs: [],
                output_refs: [],
                unresolved_fields: []
            };
        },
        getStatus: () => ({ ok: true, running })
    };
    const gateway = new AILISGateway({
        projectRoot: rootDir,
        workspaceRoot: rootDir,
        auditDir: path.join(rootDir, 'audit'),
        emberHarnessEnabled: false,
        profileCurationEnabled: false,
        taskAgentHarness,
        taskIntakeDecider: async (payload) => {
            calls.intake.push(payload);
            return intake || {
                ok: true,
                status: 'decided',
                action: 'observe',
                executionRequired: false
            };
        }
    });
    gateway.agentRunner = {
        runMessage: async (request) => {
            calls.persona.push(request);
            return {
                ok: true,
                status: 'completed',
                runId: request.runId,
                sessionId: request.sessionId,
                displayText: request.context?.personaTaskResultRender
                    ? '好啦，木偶攻略已经整理完了。'
                    : '今天也要开心。',
                speechText: ''
            };
        },
        getStatus: () => ({ enabled: true })
    };
    return { gateway, calls };
}

test('TaskAgent observes every turn while Persona remains the only chat output', async () => {
    const { gateway, calls } = await createGateway();
    const result = await gateway.runAgent({
        message: '你好',
        messageHistory: [{ role: 'user', content: '你好' }],
        sessionId: 'routing-chat',
        llmSettings: { model: 'mock' },
        context: { taskAgentOwnsExecution: true, agentRole: 'persona_orchestrator' }
    });

    assert.equal(calls.intake.length, 1);
    assert.equal(calls.intake[0].message, '你好');
    assert.equal(calls.handoff.length, 0);
    assert.equal(calls.persona.length, 1);
    assert.equal(calls.persona[0].context.taskAgentOwnsExecution, true);
    assert.equal(result.displayText, '今天也要开心。');
});

test('TaskAgent execution decision bypasses Persona handoff and returns through render-only Persona', async () => {
    const { gateway, calls } = await createGateway({
        intake: {
            ok: true,
            status: 'decided',
            action: 'execute',
            executionRequired: true
        }
    });
    const history = [
        { role: 'user', content: '写木偶攻略' },
        { role: 'assistant', content: '我来处理。' },
        { role: 'user', content: '还没好吗' }
    ];
    const result = await gateway.runAgent({
        message: '还没好吗',
        messageHistory: history,
        sessionId: 'routing-task',
        llmSettings: { model: 'mock' },
        context: { taskAgentOwnsExecution: true, agentRole: 'persona_orchestrator' }
    });

    assert.equal(calls.intake.length, 1);
    assert.equal(calls.handoff.length, 1);
    assert.deepEqual(calls.handoff[0].context.taskAgentVisibleHistory, history);
    assert.equal(calls.persona.length, 1);
    assert.equal(calls.persona[0].context.personaTaskResultRender, true);
    assert.equal(calls.persona[0].suppressCurrentUserMessage, true);
    assert.deepEqual(calls.persona[0].messageHistory, history.slice(0, 2));
    assert.match(calls.persona[0].ephemeralDeveloperMessage, /"current_user_message":"还没好吗"/);
    assert.match(calls.persona[0].ephemeralDeveloperMessage, /已完成木偶攻略/);
    assert.equal(result.executionRequired, true);
    assert.equal(result.displayText, '好啦，木偶攻略已经整理完了。');
});

test('a user steer during an active TaskAgent run is accepted immediately without a second intake decision', async () => {
    const { gateway, calls } = await createGateway({
        running: true,
        taskResult: {
            schema: 'ailis.task_steer.v1',
            status: 'accepted',
            final_answer: '已收到你的补充。'
        }
    });
    const result = await gateway.runAgent({
        message: '只看官方资料',
        messageHistory: [{ role: 'user', content: '只看官方资料' }],
        sessionId: 'routing-steer',
        llmSettings: { model: 'mock' },
        context: { taskAgentOwnsExecution: true, agentRole: 'persona_orchestrator' }
    });

    assert.equal(calls.intake.length, 0);
    assert.equal(calls.handoff.length, 1);
    assert.equal(calls.handoff[0].context.returnAfterSteer, true);
    assert.equal(calls.persona[0].context.personaTaskResultRender, true);
    assert.deepEqual(calls.persona[0].messageHistory, []);
    assert.equal(calls.persona[0].suppressCurrentUserMessage, true);
    assert.equal(result.executionRequired, true);
});
