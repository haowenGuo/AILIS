import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const {
    TASK_INTAKE_TOOL_NAME,
    buildTaskIntakeMessages,
    decideTaskAgentIntake,
    normalizeVisibleTranscript,
    parseTaskIntakeDecision
} = require('../electron/ailis-task-intake.cjs');

test('TaskAgent intake receives the exact visible transcript and current user turn', () => {
    const transcript = normalizeVisibleTranscript([
        { role: 'user', content: '写木偶攻略' },
        { role: 'assistant', content: '我来处理。' },
        { role: 'user', content: '还没好吗' }
    ], '还没好吗');

    assert.deepEqual(transcript, [
        { role: 'user', content: '写木偶攻略' },
        { role: 'assistant', content: '我来处理。' },
        { role: 'user', content: '还没好吗' }
    ]);
    const messages = buildTaskIntakeMessages({
        message: '还没好吗',
        messageHistory: transcript,
        taskState: { active_goal: null }
    });
    const payload = JSON.parse(messages.at(-1).content);
    assert.equal(payload.current_user_message, '还没好吗');
    assert.equal(payload.visible_transcript[0].content, '写木偶攻略');
    assert.deepEqual(payload.task_state, { active_goal: null });
});

test('TaskAgent intake uses a required native decision without rewriting the task', async () => {
    const calls = [];
    const decision = await decideTaskAgentIntake({
        message: '查询北京天气',
        messageHistory: [{ role: 'user', content: '查询北京天气' }],
        taskState: null,
        llmSettings: { model: 'mock-model' },
        llmClient: async (settings, payload) => {
            calls.push({ settings, payload });
            return {
                ok: true,
                toolCalls: [{
                    name: TASK_INTAKE_TOOL_NAME,
                    arguments: { action: 'execute', reason: '需要实时查询' }
                }]
            };
        }
    });

    assert.equal(calls.length, 1);
    assert.deepEqual(calls[0].payload.toolChoice, {
        name: TASK_INTAKE_TOOL_NAME,
        required: true
    });
    assert.equal(decision.action, 'execute');
    assert.equal(decision.executionRequired, true);
    assert.equal(decision.transcript[0].content, '查询北京天气');
    assert.equal('task' in decision, false);
});

test('TaskAgent intake distinguishes Persona-only conversation and rejects prose-only routing', () => {
    assert.deepEqual(
        parseTaskIntakeDecision({
            ok: true,
            toolCalls: [{
                name: TASK_INTAKE_TOOL_NAME,
                arguments: { action: 'observe' }
            }]
        }),
        {
            ok: true,
            status: 'decided',
            action: 'observe',
            executionRequired: false,
            reason: '',
            usage: null
        }
    );
    const invalid = parseTaskIntakeDecision({ ok: true, content: '应该执行' });
    assert.equal(invalid.ok, false);
    assert.equal(invalid.status, 'invalid_task_intake_decision');
});
