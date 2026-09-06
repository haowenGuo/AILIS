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
const { buildAgentDirectToolSpecs } = require('../electron/agent-loop/index.cjs');
const { getCodeModeProfile } = require('../electron/codex-code-mode-protocol.cjs');
const { getToolContract, validateToolContract } = require('../electron/ailis-tool-contracts.cjs');

function completedResult({ runId, answer, checkpoint, sourceUrl = '', cost = null }) {
    return {
        ok: true,
        status: 'completed',
        runId,
        displayText: answer,
        ...(cost ? { cost } : {}),
        steps: [{ private: 'must not enter Persona context' }],
        taskRunHandoff: {
            status: 'completed',
            finalAnswer: answer,
            partialAnswer: '',
            sourceRefs: sourceUrl ? [{ ref_id: 'source-1', title: 'Source', url: sourceUrl }] : [],
            collectedData: [{
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

test('Persona handoff contract exposes no TaskAgent lifecycle controls', () => {
    const contract = getToolContract('handoff_task');

    assert.deepEqual(contract.schema.properties, {});
    assert.equal(validateToolContract('handoff_task', {}).ok, true);
    assert.equal(validateToolContract('handoff_task', { continuation: 'new' }).ok, false);

    const routeContract = getToolContract('task_route');
    assert.deepEqual(routeContract.schema.properties.mode.enum, ['chat', 'execute']);
    assert.equal(validateToolContract('task_route', { mode: 'chat' }).ok, true);
    assert.equal(validateToolContract('task_route', { mode: 'other' }).ok, false);

    const goalContract = getToolContract('task_goal');
    assert.deepEqual(goalContract.schema.properties.action.enum, ['get', 'set', 'complete', 'clear']);
    assert.equal(validateToolContract('task_goal', { action: 'set' }).ok, false);
    assert.equal(validateToolContract('task_goal', {
        action: 'set',
        objective: '完成长期任务'
    }).ok, true);
});

test('TaskAgent owns the first Turn route and both views share one immutable TurnEnvelope', async () => {
    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-task-route-ledger-'));
    const calls = [];
    const harness = new AILISSystemTaskAgentHarness({
        rootDir,
        executeTaskAgent: async (payload) => {
            calls.push(payload);
            return {
                ok: true,
                status: 'completed',
                runId: payload.agent.childRunId,
                taskRoute: 'chat',
                displayText: '',
                steps: [{
                    tool: 'task_route',
                    args: { mode: 'chat' },
                    response: { ok: true, status: 'completed' }
                }]
            };
        }
    });
    const packet = await harness.dispatchTurn({
        currentUserMessage: '今天心情怎么样？',
        sessionId: 'shared-session',
        turnEnvelope: {
            userMessage: '今天心情怎么样？',
            visibleHistory: [
                { role: 'user', content: '你好' },
                { role: 'assistant', content: '你好呀' }
            ]
        }
    });

    assert.equal(packet.route, 'chat');
    assert.equal(calls.length, 1);
    assert.equal(calls[0].context.taskAgentRoutePending, true);
    assert.equal(calls[0].context.taskAgentRoutingOwned, true);
    assert.deepEqual(
        calls[0].args.sharedSessionHistory.map(({ role, content }) => ({ role, content })),
        [
            { role: 'user', content: '你好' },
            { role: 'assistant', content: '你好呀' }
        ]
    );
    assert.equal(calls[0].context.sessionLedgerProjection, undefined);
    const thread = harness.getThread('shared-session');
    assert.deepEqual(thread.ledger.map((entry) => entry.type), [
        'user.turn',
        'task.route',
        'task.result'
    ]);
    harness.recordPersonaOutput('shared-session', packet.turn_id, '今天也很高兴见到你。', 'chat');
    assert.equal(thread.ledger.at(-1).type, 'persona.output');
    assert.equal(thread.ledger.at(-1).payload.authority, 'display_only');
});

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
                sourceUrl: 'https://example.test/source',
                cost: {
                    schema: 'ailis.run_cost.v1',
                    run_id: payload.agent.childRunId,
                    total: {
                        runs: 1,
                        llm: {
                            calls: 2,
                            duration_ms: 50,
                            usage: { totalTokens: 321 },
                            by_model: []
                        },
                        tools: { calls: 1, duration_ms: 10 }
                    }
                }
            });
        }
    });
    const message = '请核对原始资料，只回答其中的类名。';
    const packet = await harness.handoff({}, {
        currentUserMessage: message,
        sessionId: 'persona-session',
        runId: 'persona-run',
        desktopRealEval: true,
        benchmarkName: 'Apple ToolSandbox',
        benchmarkScenario: 'toolsandbox-scenario-1',
        runtimeEnvironmentOverride: {
            source: 'toolsandbox_benchmark_clock',
            current_date: '2026-07-17'
        },
        directToolLimit: 35,
        llmSettings: { model: 'mock-model' }
    });

    assert.equal(calls.length, 1);
    assert.equal(calls[0].agent.task, message);
    assert.equal(calls[0].agent.originalTask, message);
    assert.equal(calls[0].context.originalUserGoal, undefined);
    assert.equal(calls[0].context.currentTaskRequest, message);
    assert.ok(calls[0].context.taskAgentThreadId);
    assert.ok(calls[0].context.taskAgentTurnId);
    assert.equal(calls[0].context.taskAgentActiveGoal, null);
    assert.equal(calls[0].context.desktopRealEval, true);
    assert.equal(calls[0].context.benchmarkName, 'Apple ToolSandbox');
    assert.equal(calls[0].context.benchmarkScenario, 'toolsandbox-scenario-1');
    assert.deepEqual(calls[0].context.runtimeEnvironmentOverride, {
        source: 'toolsandbox_benchmark_clock',
        current_date: '2026-07-17'
    });
    assert.equal(calls[0].context.directToolLimit, 35);
    assert.equal(calls[0].args.inheritanceMode, 'clean');
    assert.equal(Object.hasOwn(calls[0].args, 'maxAgentSteps'), false);
    assert.equal(Object.hasOwn(calls[0].context, 'maxAgentSteps'), false);
    assert.equal(packet.schema, TASK_RESULT_SCHEMA);
    assert.equal(packet.final_answer, 'Verified answer');
    assert.deepEqual(packet.output_refs, ['output-1']);
    assert.deepEqual(packet.source_refs, [{
        ref_id: 'source-1',
        title: 'Source',
        url: 'https://example.test/source'
    }]);
    assert.equal(Object.hasOwn(packet, 'evidence_refs'), false);
    assert.equal(Object.hasOwn(packet, 'exact_answer'), false);
    assert.equal(Object.hasOwn(packet, 'answer_candidates'), false);
    assert.equal(packet.checkpoint_available, true);
    assert.equal(packet.cost.schema, 'ailis.run_cost.v1');
    assert.equal(packet.cost.total.llm.usage.totalTokens, 321);
    assert.equal(Object.hasOwn(packet, 'steps'), false);
    assert.equal(Object.hasOwn(packet, 'checkpoint'), false);
    assert.equal(JSON.stringify(packet).includes('private'), false);
});

test('Persona handoff attaches the complete visible Session instead of only the latest cue', async () => {
    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-task-shared-session-'));
    const calls = [];
    const harness = new AILISSystemTaskAgentHarness({
        rootDir,
        executeTaskAgent: async (payload) => {
            calls.push(payload);
            return completedResult({
                runId: payload.agent.childRunId,
                answer: '木偶攻略完成。',
                checkpoint: null
            });
        }
    });
    const visibleHistory = [
        { role: 'user', content: '帮我查木偶攻略' },
        { role: 'assistant', content: '好，我来看看。' },
        { role: 'user', content: '速度' }
    ];

    await harness.handoff({}, {
        currentUserMessage: '速度',
        sessionId: 'shared-persona-session',
        runId: 'persona-speed-run',
        turnEnvelope: {
            userMessage: '速度',
            visibleHistory
        }
    });

    assert.equal(calls.length, 1);
    assert.equal(calls[0].agent.task, '速度');
    assert.deepEqual(
        calls[0].args.sharedSessionHistory.map(({ role, content }) => ({ role, content })),
        visibleHistory
    );
    assert.deepEqual(
        calls[0].context.sharedSessionHistory.map(({ role, content }) => ({ role, content })),
        visibleHistory
    );
    assert.equal(calls[0].context.sessionLedgerProjection, undefined);
});

test('TaskAgent keeps model-authored progress in the Turn ledger without hardcoded Persona messages', async () => {
    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-task-persona-mailbox-'));
    const progressEvent = {
        type: 'agent.progress.note',
        status: 'running',
        message: '我已经确认对应游戏，正在核对最新版本。',
        payload: {
            iteration: 2,
            text: '我已经确认对应游戏，正在核对最新版本。'
        }
    };
    const harness = new AILISSystemTaskAgentHarness({
        rootDir,
        executeTaskAgent: async (payload) => {
            await payload.onEvent(progressEvent);
            await payload.onEvent(progressEvent);
            return completedResult({
                runId: payload.agent.childRunId,
                answer: '木偶攻略最终结果。',
                checkpoint: null
            });
        }
    });

    const packet = await harness.handoff({}, {
        currentUserMessage: '帮我查木偶攻略',
        sessionId: 'persona-mailbox-session',
        runId: 'persona-mailbox-run'
    });

    const thread = harness.getThread('persona-mailbox-session');
    const progress = thread.ledger.filter((entry) => (
        entry.type === 'task.event' && entry.payload?.type === 'agent.progress.note'
    ));
    assert.equal(progress.length, 2);
    assert.ok(progress.every((entry) => entry.turnId === packet.turn_id));
    assert.equal(thread.ledger.some((entry) => entry.type === 'task.persona_message'), false);
    const restored = new AILISSystemTaskAgentHarness({ rootDir });
    assert.equal(
        restored.getThread('persona-mailbox-session').ledger.some((entry) => entry.type === 'task.persona_message'),
        false
    );
});

test('TaskAgent results remain bound to their original Turn without a second message ledger', async () => {
    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-task-persona-turn-binding-'));
    const harness = new AILISSystemTaskAgentHarness({
        rootDir,
        executeTaskAgent: async (payload) => completedResult({
            runId: payload.agent.childRunId,
            answer: payload.agent.task === '第一个任务' ? '第一个结果' : '第二个结果',
            checkpoint: null
        })
    });

    const first = await harness.handoff({}, {
        currentUserMessage: '第一个任务',
        sessionId: 'persona-turn-binding',
        runId: 'persona-turn-binding-1'
    });
    const second = await harness.handoff({}, {
        currentUserMessage: '第二个任务',
        sessionId: 'persona-turn-binding',
        runId: 'persona-turn-binding-2'
    });

    const thread = harness.getThread('persona-turn-binding');
    const firstTurn = thread.turns.find((turn) => turn.turnId === first.turn_id);
    const secondTurn = thread.turns.find((turn) => turn.turnId === second.turn_id);
    assert.equal(firstTurn.finalAnswer, '第一个结果');
    assert.equal(secondTurn.finalAnswer, '第二个结果');
    assert.equal(thread.ledger.some((entry) => entry.type === 'task.persona_message'), false);
});

test('system TaskAgent result packet uses the natural final response and ignores legacy exact-answer metadata', async () => {
    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-task-harness-exact-answer-'));
    const harness = new AILISSystemTaskAgentHarness({
        rootDir,
        executeTaskAgent: async (payload) => ({
            ok: true,
            status: 'completed',
            runId: payload.agent.childRunId,
            displayText: '最终计数是 42。',
            exactAnswerSubmission: { answer: '42' },
            taskRunHandoff: {
                status: 'completed',
                finalAnswer: '最终计数是 42。',
                sourceRefs: [],
                collectedData: [],
                traceRef: payload.agent.childRunId
            }
        })
    });

    const packet = await harness.handoff({}, {
        currentUserMessage: '只返回最终计数。',
        sessionId: 'persona-exact-answer'
    });

    assert.equal(Object.hasOwn(packet, 'exact_answer'), false);
    assert.equal(packet.final_answer, '最终计数是 42。');
    assert.equal(packet.display_text, '最终计数是 42。');
});

test('system TaskAgent does not persist legacy answer-candidate metadata across handoffs', async () => {
    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-task-harness-candidates-'));
    const calls = [];
    const harness = new AILISSystemTaskAgentHarness({
        rootDir,
        executeTaskAgent: async (payload) => {
            calls.push(payload);
            if (calls.length === 1) {
                return {
                    ok: true,
                    status: 'completed_with_warnings',
                    runId: payload.agent.childRunId,
                    displayText: '4',
                    taskRunHandoff: {
                        status: 'completed_with_warnings',
                        finalAnswer: '4',
                        answerCandidates: [{ answer: 'legacy candidate' }],
                        bestAnswerCandidate: { answer: 'legacy candidate' },
                        resume: { contextManagerCheckpoint: { version: 1 } }
                    }
                };
            }
            return completedResult({
                runId: payload.agent.childRunId,
                answer: '4',
                checkpoint: { version: 2 }
            });
        }
    });

    const first = await harness.handoff({}, {
        currentUserMessage: '统计幻灯片数量。',
        sessionId: 'candidate-session',
        runId: 'candidate-parent-1'
    });
    assert.equal(first.status, 'completed_with_warnings');
    assert.equal(first.final_answer, '4');
    assert.equal(Object.hasOwn(first, 'best_answer_candidate'), false);
    assert.equal(Object.hasOwn(first, 'answer_candidates'), false);

    await harness.handoff({}, {
        currentUserMessage: '继续核对。',
        sessionId: 'candidate-session',
        runId: 'candidate-parent-2'
    });
    assert.equal(Object.hasOwn(calls[1].context, 'priorBestAnswerCandidate'), false);
    assert.equal(Object.hasOwn(calls[1].context, 'priorAnswerCandidates'), false);
});

test('repeated handoff in the same parent run reuses the first TaskAgent result', async () => {
    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-task-harness-idempotent-'));
    const calls = [];
    const harness = new AILISSystemTaskAgentHarness({
        rootDir,
        executeTaskAgent: async (payload) => {
            calls.push(payload);
            return completedResult({
                runId: payload.agent.childRunId,
                answer: 'Single result',
                checkpoint: { version: 1 }
            });
        }
    });
    const context = {
        currentUserMessage: '同一回合只移交一次。',
        sessionId: 'session-idempotent',
        runId: 'parent-run-idempotent'
    };

    const first = await harness.handoff({}, context);
    const second = await harness.handoff({}, context);

    assert.equal(calls.length, 1);
    assert.deepEqual(second, first);
    assert.equal(harness.getStatus().parentRunHandoffCount, 1);
});

test('a later handoff starts a new Turn in the same persistent Session without an implicit fixed Goal', async () => {
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
    const packet = await harness.handoff({}, {
        currentUserMessage: '继续补充失败恢复部分。',
        sessionId: 'session-a'
    });

    assert.equal(calls.length, 2);
    assert.equal(calls[1].args.inheritanceMode, 'checkpoint');
    assert.equal(calls[1].args.contextManagerCheckpoint.version, 1);
    assert.equal(calls[1].args.contextManagerCheckpoint.turn_index.length, 1);
    assert.equal(calls[1].context.originalUserGoal, undefined);
    assert.equal(calls[1].context.taskAgentActiveGoal, null);
    assert.equal(calls[1].context.taskAgentThreadId, calls[0].context.taskAgentThreadId);
    assert.notEqual(calls[1].context.taskAgentTurnId, calls[0].context.taskAgentTurnId);
    assert.equal(calls[1].agent.task, '继续补充失败恢复部分。');
    assert.equal(packet.original_goal, '');
    assert.equal(packet.current_request, '继续补充失败恢复部分。');
});

test('v1 fixed-goal state migrates into historical Session context without retaining goal authority', async () => {
    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-task-harness-v1-migration-'));
    const statePath = path.join(rootDir, 'state.json');
    const legacyCheckpoint = {
        items: [{
            type: 'message',
            role: 'user',
            content: [{
                type: 'input_text',
                text: `<ailis_context_checkpoint>\n${JSON.stringify({
                    schema: 'ailis.semantic_context_checkpoint.v1',
                    originalGoalPreservedVerbatim: true,
                    originalGoal: '查北京天气',
                    taskState: {
                        original_user_goal: '查北京天气',
                        current_request: '继续天气任务',
                        progress: { toolCalls: 1 }
                    }
                })}\n</ailis_context_checkpoint>`
            }]
        }]
    };
    await fs.writeFile(statePath, JSON.stringify({
        version: 1,
        sessions: {
            'legacy-session': {
                taskId: 'legacy-task',
                sessionId: 'legacy-session',
                originalGoal: '查北京天气',
                latestRequest: '改成木偶攻略',
                status: 'completed',
                checkpoint: legacyCheckpoint
            }
        }
    }), 'utf8');
    const calls = [];
    const harness = new AILISSystemTaskAgentHarness({
        rootDir,
        statePath,
        executeTaskAgent: async (payload) => {
            calls.push(payload);
            return completedResult({
                runId: payload.agent.childRunId,
                answer: '继续木偶攻略',
                checkpoint: payload.args.contextManagerCheckpoint
            });
        }
    });

    const migrated = harness.getThread('legacy-session');
    assert.equal(migrated.activeGoal, null);
    assert.equal(migrated.turns[0].request, '改成木偶攻略');
    assert.match(JSON.stringify(migrated.contextCheckpoint), /ailis_session_checkpoint/);
    assert.doesNotMatch(JSON.stringify(migrated.contextCheckpoint), /查北京天气|originalGoal/);

    const packet = await harness.handoff({}, {
        currentUserMessage: '继续',
        sessionId: 'legacy-session'
    });
    assert.equal(calls[0].context.taskAgentActiveGoal, null);
    assert.equal(calls[0].context.currentTaskRequest, '继续');
    assert.doesNotMatch(JSON.stringify(calls[0].args.contextManagerCheckpoint), /查北京天气|originalGoal/);
    assert.equal(packet.original_goal, '');
});

test('incomplete TaskAgent results preserve unresolved fields across checkpoint resume', async () => {
    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-task-harness-incomplete-'));
    const calls = [];
    const harness = new AILISSystemTaskAgentHarness({
        rootDir,
        executeTaskAgent: async (payload) => {
            calls.push(payload);
            if (calls.length === 1) {
                return {
                    ok: false,
                    status: 'incomplete',
                    runId: payload.agent.childRunId,
                    displayText: 'The reminder was not created.',
                    taskRunHandoff: {
                        status: 'incomplete',
                        reason: 'prerequisite_missing',
                        finalAnswer: 'The reminder was not created.',
                        unresolvedFields: [
                            'No successful task-execution tool call was recorded.',
                            'datetime_info_to_timestamp requires year and month.'
                        ],
                        collectedData: [],
                        traceRef: payload.agent.childRunId,
                        resume: {
                            contextManagerCheckpoint: { version: 1, marker: 'invalid-datetime-call' }
                        }
                    }
                };
            }
            return completedResult({
                runId: payload.agent.childRunId,
                answer: 'The reminder was created.',
                checkpoint: { version: 2 }
            });
        }
    });

    const first = await harness.handoff({}, {
        currentUserMessage: 'Remind me tomorrow at 5 PM.',
        sessionId: 'session-incomplete'
    });
    await harness.handoff({}, {
        currentUserMessage: 'Try again using the missing fields.',
        sessionId: 'session-incomplete'
    });

    assert.equal(first.status, 'incomplete');
    assert.deepEqual(first.unresolved_fields, [
        'No successful task-execution tool call was recorded.',
        'datetime_info_to_timestamp requires year and month.',
        'prerequisite_missing'
    ]);
    assert.equal(calls[1].args.contextManagerCheckpoint.version, 1);
    assert.equal(calls[1].args.contextManagerCheckpoint.marker, 'invalid-datetime-call');
    assert.equal(calls[1].args.contextManagerCheckpoint.turn_index.length, 1);
    assert.deepEqual(calls[1].context.priorUnresolvedFields, []);
});

test('incomplete TaskAgent handoffs merge unresolved prerequisites until completion', async () => {
    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-task-harness-monotonic-unresolved-'));
    const calls = [];
    const harness = new AILISSystemTaskAgentHarness({
        rootDir,
        executeTaskAgent: async (payload) => {
            calls.push(payload);
            if (calls.length < 3) {
                const unresolvedField = calls.length === 1
                    ? 'missing_current_time_observation'
                    : 'latest_stateful_tool_call_rejected';
                return {
                    ok: false,
                    status: 'incomplete',
                    runId: payload.agent.childRunId,
                    displayText: 'An execution prerequisite is still missing.',
                    taskRunHandoff: {
                        status: 'incomplete',
                        finalAnswer: 'An execution prerequisite is still missing.',
                        unresolvedFields: [unresolvedField],
                        collectedData: [],
                        traceRef: payload.agent.childRunId,
                        resume: {
                            contextManagerCheckpoint: { version: calls.length }
                        }
                    }
                };
            }
            return completedResult({
                runId: payload.agent.childRunId,
                answer: 'Completed successfully.',
                checkpoint: { version: 3 }
            });
        }
    });

    await harness.handoff({}, {
        currentUserMessage: 'Find the reminder from yesterday.',
        sessionId: 'session-monotonic-unresolved'
    });
    const second = await harness.handoff({}, {
        currentUserMessage: 'Use the available tools.',
        sessionId: 'session-monotonic-unresolved'
    });
    const third = await harness.handoff({}, {
        currentUserMessage: 'Use this verified absolute timestamp.',
        sessionId: 'session-monotonic-unresolved'
    });

    assert.deepEqual(second.unresolved_fields, ['latest_stateful_tool_call_rejected']);
    assert.deepEqual(calls[2].context.priorUnresolvedFields, []);
    assert.equal(third.status, 'completed');
    assert.deepEqual(harness.getTask('session-monotonic-unresolved').unresolvedFields, []);
});

test('the session TaskAgent remains long-lived across later requests', async () => {
    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-task-harness-long-lived-'));
    const calls = [];
    const harness = new AILISSystemTaskAgentHarness({
        rootDir,
        executeTaskAgent: async (payload) => {
            calls.push(payload);
            return completedResult({
                runId: payload.agent.childRunId,
                answer: calls.length === 1
                    ? 'Script was written but still needs execution.'
                    : 'Continued from the existing Excel task.',
                checkpoint: { version: calls.length, marker: 'excel-map-task' }
            });
        }
    });

    await harness.handoff({}, {
        currentUserMessage: '读取这个 Excel 地图并求第 11 步颜色。',
        sessionId: 'session-long-lived'
    });
    const packet = await harness.handoff({}, {
        currentUserMessage: '你自己找',
        sessionId: 'session-long-lived'
    });

    assert.equal(calls.length, 2);
    assert.equal(calls[1].args.inheritanceMode, 'checkpoint');
    assert.equal(calls[1].args.contextManagerCheckpoint.version, 1);
    assert.equal(calls[1].args.contextManagerCheckpoint.marker, 'excel-map-task');
    assert.equal(calls[1].context.originalUserGoal, undefined);
    assert.equal(calls[1].context.currentTaskRequest, '你自己找');
    assert.equal(calls[1].context.taskAgentThreadId, calls[0].context.taskAgentThreadId);
    assert.notEqual(calls[1].context.taskAgentTurnId, calls[0].context.taskAgentTurnId);
    assert.equal(calls[1].agent.originalTask, '你自己找');
    assert.equal(calls[1].agent.task, '你自己找');
    assert.equal(packet.original_goal, '');
    assert.equal(packet.current_request, '你自己找');
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
    const second = harness.handoff({}, {
        currentUserMessage: '补充检查测试覆盖率。',
        sessionId: 'session-queue'
    });
    await new Promise((resolve) => setImmediate(resolve));
    releaseExecution();
    const [firstPacket, secondPacket] = await Promise.all([first, second]);

    assert.equal(executionCount, 1);
    assert.deepEqual(receivedInputs, ['补充检查测试覆盖率。']);
    assert.equal(firstPacket.task_id, secondPacket.task_id);
    assert.equal(firstPacket.turn_id, secondPacket.turn_id);
    assert.equal(secondPacket.current_request, '补充检查测试覆盖率。');
    const activeTurn = harness.getThread('session-queue').turns.find((turn) => turn.turnId === firstPacket.turn_id);
    assert.deepEqual(activeTurn.inputs.map((input) => input.message), [
        '分析这个项目。',
        '补充检查测试覆盖率。'
    ]);
});

test('the TaskAgent model can replace and retain a dynamic Goal across ordinary Session Turns', async () => {
    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-task-harness-dynamic-goal-'));
    const calls = [];
    let harness;
    harness = new AILISSystemTaskAgentHarness({
        rootDir,
        executeTaskAgent: async (payload) => {
            calls.push(payload);
            if (payload.agent.task === '查北京天气') {
                const result = harness.applyGoalAction({
                    action: 'set',
                    objective: '查清北京天气'
                }, payload.context);
                assert.equal(result.ok, true);
            }
            if (payload.agent.task === '改成木偶攻略') {
                assert.doesNotMatch(
                    JSON.stringify(payload.args.contextManagerCheckpoint),
                    /查清北京天气/
                );
                const result = harness.applyGoalAction({
                    action: 'set',
                    objective: '完成木偶攻略'
                }, payload.context);
                assert.equal(result.ok, true);
            }
            if (payload.agent.task === '攻略已经完成') {
                const result = harness.applyGoalAction({
                    action: 'complete',
                    expected_goal_id: payload.context.taskAgentActiveGoal.goalId
                }, payload.context);
                assert.equal(result.ok, true);
            }
            return completedResult({
                runId: payload.agent.childRunId,
                answer: `完成：${payload.agent.task}`,
                checkpoint: payload.agent.task === '查北京天气'
                    ? {
                          version: calls.length,
                          items: [{
                              type: 'message',
                              role: 'developer',
                              content: [{
                                  type: 'input_text',
                                  text: `<ailis_session_checkpoint>\n${JSON.stringify({
                                      schema: 'ailis.session_context_checkpoint.v2',
                                      activeGoal: { objective: '查清北京天气' },
                                      currentRequest: '查北京天气',
                                      taskState: {
                                          active_goal: { objective: '查清北京天气' },
                                          current_request: '查北京天气'
                                      }
                                  })}\n</ailis_session_checkpoint>`
                              }]
                          }]
                      }
                    : { version: calls.length }
            });
        }
    });

    await harness.handoff({}, { currentUserMessage: '哈哈', sessionId: 'dynamic-goal-session' });
    const weather = await harness.handoff({}, {
        currentUserMessage: '查北京天气',
        sessionId: 'dynamic-goal-session'
    });
    const puppet = await harness.handoff({}, {
        currentUserMessage: '改成木偶攻略',
        sessionId: 'dynamic-goal-session'
    });
    const continued = await harness.handoff({}, {
        currentUserMessage: '继续',
        sessionId: 'dynamic-goal-session'
    });
    const completed = await harness.handoff({}, {
        currentUserMessage: '攻略已经完成',
        sessionId: 'dynamic-goal-session'
    });

    assert.equal(new Set(calls.map((call) => call.context.taskAgentThreadId)).size, 1);
    assert.equal(new Set(calls.map((call) => call.context.taskAgentTurnId)).size, 5);
    assert.equal(calls[0].context.taskAgentActiveGoal, null);
    assert.equal(calls[1].context.taskAgentActiveGoal, null);
    assert.equal(calls[2].context.taskAgentActiveGoal.objective, '查清北京天气');
    assert.equal(calls[3].context.taskAgentActiveGoal.objective, '完成木偶攻略');
    assert.equal(calls[4].context.taskAgentActiveGoal.objective, '完成木偶攻略');
    assert.equal(weather.original_goal, '查清北京天气');
    assert.equal(puppet.original_goal, '完成木偶攻略');
    assert.equal(continued.original_goal, '完成木偶攻略');
    assert.equal(completed.original_goal, '');
    const thread = harness.getThread('dynamic-goal-session');
    assert.equal(thread.activeGoal, null);
    assert.equal(thread.goalHistory[0].objective, '查清北京天气');
    assert.equal(thread.goalHistory[0].status, 'replaced');
    assert.equal(thread.goalHistory.at(-1).objective, '完成木偶攻略');
    assert.equal(thread.goalHistory.at(-1).status, 'completed');
});

test('Turn steer requires the currently active Turn id and never opens a replacement Turn', async () => {
    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-task-harness-steer-id-'));
    let releaseExecution;
    const executionGate = new Promise((resolve) => {
        releaseExecution = resolve;
    });
    let activeTurnId = '';
    const harness = new AILISSystemTaskAgentHarness({
        rootDir,
        executeTaskAgent: async (payload) => {
            activeTurnId = payload.context.taskAgentTurnId;
            payload.registerInputHandler(() => {});
            await executionGate;
            return completedResult({
                runId: payload.agent.childRunId,
                answer: 'done',
                checkpoint: { version: 1 }
            });
        }
    });

    const running = harness.handoff({}, {
        currentUserMessage: '开始分析',
        sessionId: 'steer-id-session'
    });
    await new Promise((resolve) => setImmediate(resolve));
    await assert.rejects(
        harness.handoff({}, {
            currentUserMessage: '错误地转向另一个 Turn',
            sessionId: 'steer-id-session',
            expectedTaskAgentTurnId: 'turn_stale'
        }),
        /Turn mismatch/
    );
    const steered = harness.handoff({}, {
        currentUserMessage: '补充当前分析',
        sessionId: 'steer-id-session',
        expectedTaskAgentTurnId: activeTurnId
    });
    releaseExecution();
    const [firstPacket, steeredPacket] = await Promise.all([running, steered]);

    assert.equal(firstPacket.turn_id, activeTurnId);
    assert.equal(steeredPacket.turn_id, activeTurnId);
    assert.equal(harness.getThread('steer-id-session').turns.length, 1);
    assert.deepEqual(
        harness.getThread('steer-id-session').turns[0].inputs.map((input) => input.message),
        ['开始分析', '补充当前分析']
    );
});

test('explicit compatibility Persona and TaskAgent keep disjoint code-mode tool surfaces', () => {
    const specs = {
        handoff_task: {
            name: 'handoff_task',
            description: 'System TaskAgent handoff.',
            parameters: {
                type: 'object',
                required: [],
                properties: {},
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
        },
        task_goal: {
            name: 'task_goal',
            description: 'Manage the optional active Goal.',
            parameters: {
                type: 'object',
                required: ['action'],
                properties: { action: { type: 'string' } }
            }
        }
    };
    const gateway = {
        gatewayToolRuntimeRegistry: {
            definition: (id) => specs[id] ? { spec: specs[id] } : null,
            modelVisibleSpecs: () => [specs.handoff_task, specs.spawn_agent, specs.read, specs.task_goal]
        }
    };

    const persona = buildAgentDirectToolSpecs(gateway, {
        requestContext: { agentRole: 'persona_orchestrator' }
    });
    const taskAgent = buildAgentDirectToolSpecs(gateway, {
        requestContext: {
            agentRole: 'task_agent',
            taskAgentThreadId: 'thread-test',
            taskAgentTurnId: 'turn-test'
        }
    });
    const standaloneTaskAgent = buildAgentDirectToolSpecs(gateway, {
        requestContext: { agentRole: 'task_agent' }
    });
    const persistentGoalTaskAgent = buildAgentDirectToolSpecs(gateway, {
        requestContext: {
            agentRole: 'task_agent',
            taskAgentThreadId: 'thread-test',
            taskAgentTurnId: 'turn-test',
            enableTaskGoalTool: true
        }
    });

    assert.deepEqual(persona.map((spec) => spec.name), ['handoff_task']);
    const personaAfterHandoff = buildAgentDirectToolSpecs(gateway, {
        stepResults: [{ tool: 'handoff_task', response: { ok: true, status: 'completed' } }],
        requestContext: { agentRole: 'persona_orchestrator' }
    });
    assert.deepEqual(personaAfterHandoff, []);
    for (const surface of [taskAgent, standaloneTaskAgent, persistentGoalTaskAgent]) {
        assert.deepEqual(surface.map((spec) => spec.name), ['exec', 'exec_wait']);
    }
    const nestedNames = (surface) => getCodeModeProfile(surface[0].x_ailis_code_mode_profile).map((spec) => spec.name);
    assert.deepEqual(nestedNames(taskAgent), ['read']);
    assert.deepEqual(nestedNames(standaloneTaskAgent), ['read']);
    assert.deepEqual(nestedNames(persistentGoalTaskAgent), ['task_goal', 'read']);
});
