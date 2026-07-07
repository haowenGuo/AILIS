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
