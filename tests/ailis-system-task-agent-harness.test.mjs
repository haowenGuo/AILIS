import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const {
    AILISSystemTaskAgentHarness,
    TASK_RESULT_SCHEMA
} = require('../electron/ailis-task-agent-harness.cjs');
const { buildAgentDirectToolSpecs } = require('../electron/ailis-agent-runner.cjs');

function completedResult({ runId, answer, checkpoint, sourceUrl = '' }) {
    return {
        ok: true,
        status: 'completed',
        runId,
        displayText: answer,
        steps: [{ private: 'must not enter Persona context' }],
        taskRunHandoff: {
            status: 'completed',
            finalAnswer: answer,
            partialAnswer: '',
            sourceRefs: sourceUrl ? [{ ref_id: 'source-1', title: 'Source', url: sourceUrl }] : [],
            collectedData: [{
                evidenceRefs: ['evidence-1'],
                outputId: 'output-1'
            }],
            traceRef: runId,
            resume: {
                contextManagerCheckpoint: checkpoint,
                checkpointAvailable: Boolean(checkpoint)
            }
        }
    };
}

test('system TaskAgent handoff preserves the exact request and returns a compact result packet', async () => {
    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-task-harness-'));
    const calls = [];
    const harness = new AILISSystemTaskAgentHarness({
        rootDir,
        executeTaskAgent: async (payload) => {
            calls.push(payload);
            return completedResult({
                runId: payload.agent.childRunId,
                answer: 'Verified answer',
                checkpoint: { items: [{ type: 'message', role: 'assistant', content: 'private' }] },
                sourceUrl: 'https://example.test/source'
            });
        }
    });
    const message = '请核对原始资料，只回答其中的类名。';
    const packet = await harness.handoff({}, {
        currentUserMessage: message,
        sessionId: 'persona-session',
        runId: 'persona-run',
        llmSettings: { model: 'mock-model' }
    });

    assert.equal(calls.length, 1);
    assert.equal(calls[0].agent.task, message);
    assert.equal(calls[0].agent.originalTask, message);
    assert.equal(calls[0].context.originalUserGoal, message);
    assert.equal(calls[0].args.inheritanceMode, 'clean');
    assert.equal(calls[0].args.maxAgentSteps, 7);
    assert.equal(packet.schema, TASK_RESULT_SCHEMA);
    assert.equal(packet.final_answer, 'Verified answer');
    assert.deepEqual(packet.evidence_refs, ['evidence-1']);
    assert.deepEqual(packet.output_refs, ['output-1']);
    assert.equal(packet.checkpoint_available, true);
    assert.equal(Object.hasOwn(packet, 'steps'), false);
    assert.equal(Object.hasOwn(packet, 'checkpoint'), false);
    assert.equal(JSON.stringify(packet).includes('private'), false);
});

test('explicit continuation resumes the latest TaskAgent checkpoint without replacing the original goal', async () => {
    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-task-harness-resume-'));
    const calls = [];
    const harness = new AILISSystemTaskAgentHarness({
        rootDir,
        executeTaskAgent: async (payload) => {
            calls.push(payload);
            return completedResult({
                runId: payload.agent.childRunId,
                answer: calls.length === 1 ? 'First result' : 'Supplemented result',
                checkpoint: { version: calls.length }
            });
        }
    });

    await harness.handoff({}, {
        currentUserMessage: '分析这个仓库的长期任务架构。',
        sessionId: 'session-a'
    });
    const packet = await harness.handoff({
        continuation: 'continue'
    }, {
        currentUserMessage: '继续补充失败恢复部分。',
        sessionId: 'session-a'
    });

    assert.equal(calls.length, 2);
    assert.equal(calls[1].args.inheritanceMode, 'checkpoint');
    assert.deepEqual(calls[1].args.contextManagerCheckpoint, { version: 1 });
    assert.equal(calls[1].context.originalUserGoal, '分析这个仓库的长期任务架构。');
    assert.equal(calls[1].agent.task, '继续补充失败恢复部分。');
    assert.equal(packet.original_goal, '分析这个仓库的长期任务架构。');
    assert.equal(packet.current_request, '继续补充失败恢复部分。');
});

test('concurrent follow-up input joins the running system TaskAgent instead of spawning another one', async () => {
    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-task-harness-queue-'));
    const receivedInputs = [];
    let releaseExecution;
    const executionGate = new Promise((resolve) => {
        releaseExecution = resolve;
    });
    let executionCount = 0;
    const harness = new AILISSystemTaskAgentHarness({
        rootDir,
        executeTaskAgent: async (payload) => {
            executionCount += 1;
            payload.registerInputHandler(async (message) => {
                receivedInputs.push(message);
            });
            await executionGate;
            return completedResult({
                runId: payload.agent.childRunId,
                answer: 'Merged result',
                checkpoint: { version: 1 }
            });
        }
    });

    const first = harness.handoff({}, {
        currentUserMessage: '分析这个项目。',
        sessionId: 'session-queue'
    });
    await new Promise((resolve) => setImmediate(resolve));
    const second = harness.handoff({
        continuation: 'continue'
    }, {
        currentUserMessage: '补充检查测试覆盖率。',
        sessionId: 'session-queue'
    });
    await new Promise((resolve) => setImmediate(resolve));
    releaseExecution();
    const [firstPacket, secondPacket] = await Promise.all([first, second]);

    assert.equal(executionCount, 1);
    assert.deepEqual(receivedInputs, ['补充检查测试覆盖率。']);
    assert.equal(firstPacket.task_id, secondPacket.task_id);
    assert.equal(secondPacket.current_request, '补充检查测试覆盖率。');
});

test('Persona and TaskAgent receive disjoint orchestration tool surfaces', () => {
    const specs = {
        handoff_task: {
            name: 'handoff_task',
            description: 'System TaskAgent handoff.',
            parameters: {
                type: 'object',
                required: [],
                properties: { continuation: { type: 'string' } },
                additionalProperties: false
            }
        },
        spawn_agent: {
            name: 'spawn_agent',
            description: 'Legacy spawn.',
            parameters: { type: 'object', properties: {}, additionalProperties: false }
        },
        read: {
            name: 'read',
            description: 'Read a file.',
            parameters: { type: 'object', properties: { path: { type: 'string' } } }
        }
    };
    const gateway = {
        gatewayToolRuntimeRegistry: {
            definition: (id) => specs[id] ? { spec: specs[id] } : null,
            modelVisibleSpecs: () => [specs.handoff_task, specs.spawn_agent, specs.read]
        }
    };

    const persona = buildAgentDirectToolSpecs(gateway, {
        requestContext: { agentRole: 'persona_orchestrator' }
    });
    const taskAgent = buildAgentDirectToolSpecs(gateway, {
        requestContext: { agentRole: 'task_agent' }
    });

    assert.deepEqual(persona.map((spec) => spec.name), ['handoff_task']);
    assert.deepEqual(taskAgent.map((spec) => spec.name), ['read']);
});
