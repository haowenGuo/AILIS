import test from 'node:test';
import assert from 'node:assert/strict';

import {
    scoreVisibleAnswer,
    summarizeEvents
} from '../scripts/run-ailis-desktop-real-gaia-eval.mjs';

test('desktop-real visible scorer accepts contextual best-item answer', () => {
    const response = {
        ok: true,
        status: 'completed',
        displayText: [
            '模拟运行完成！以下是结果汇总：',
            '### 1. 弹出概率最高的球',
            '| 球号 | 弹出概率 |',
            '| **#3** | **63.08%** |',
            '球 #3 的弹出概率最高，达到约 63.08%。'
        ].join('\n')
    };
    const score = scoreVisibleAnswer({ response, gold: '3' });
    assert.equal(score.ok, true);
    assert.equal(score.status, 'visible_answer_match');
    assert.equal(score.answer, '3');
});

test('desktop-real event summary does not double count token usage mirrors', () => {
    const events = [
        {
            type: 'agent.llm_call.completed',
            payload: {
                durationMs: 100,
                usage: { prompt_tokens: 10, completion_tokens: 5, total_tokens: 15 }
            }
        },
        {
            type: 'agent.token_usage',
            payload: {
                usage: { prompt_tokens: 10, completion_tokens: 5, total_tokens: 15 }
            }
        },
        {
            type: 'agent.llm_call.completed',
            payload: {
                durationMs: 200,
                usage: { prompt_tokens: 20, completion_tokens: 7, total_tokens: 27 }
            }
        },
        {
            type: 'agent.token_usage',
            payload: {
                usage: { prompt_tokens: 20, completion_tokens: 7, total_tokens: 27 }
            }
        }
    ];
    const summary = summarizeEvents(events);
    assert.equal(summary.llmCallCount, 2);
    assert.equal(summary.usage.promptTokens, 30);
    assert.equal(summary.usage.completionTokens, 12);
    assert.equal(summary.usage.totalTokens, 42);
});

test('desktop-real visible scorer ignores task-id shaped contextual noise', () => {
    const response = {
        ok: false,
        status: 'subagent_running',
        displayText: [
            'TOOL_OUTPUT_MODEL_PREVIEW:',
            'task_id: 8e867cd7-cff9-4e6c-867a-ff5ddc2550be',
            'task: Find out how many studio albums were published by Mercedes Sosa.'
        ].join('\n')
    };
    const score = scoreVisibleAnswer({ response, gold: '3' });
    assert.equal(score.ok, false);
    assert.equal(score.candidates.some((candidate) => candidate.answer.includes('8e867cd7')), false);
});

test('desktop-real visible scorer accepts scaled thousand-unit equivalent only with question context', () => {
    const response = {
        ok: true,
        status: 'completed',
        displayText: '最终结果：**17000**'
    };
    const question = 'How many thousand hours would it take? Round your result to the nearest 1000 hours.';

    const withoutQuestion = scoreVisibleAnswer({ response, gold: '17' });
    assert.equal(withoutQuestion.ok, false);

    const withQuestion = scoreVisibleAnswer({ response, gold: '17', question });
    assert.equal(withQuestion.ok, true);
    assert.equal(withQuestion.answer, '17000');
});

test('desktop-real visible scorer extracts inline final result after rendering', () => {
    const response = {
        ok: true,
        status: 'completed',
        displayText: '总小时数约为 17054.89 小时，四舍五入后，最终结果：**17000**'
    };
    const question = 'How many thousand hours would it take? Round your result to the nearest 1000 hours.';
    const score = scoreVisibleAnswer({ response, gold: '17', question });
    assert.equal(score.ok, true);
    assert.equal(score.answer, '17000');
});
