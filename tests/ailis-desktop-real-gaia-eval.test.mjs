import test from 'node:test';
import assert from 'node:assert/strict';

import {
    buildSettledSubagentResponse,
    collectSubagentRefs,
    extractFinalResponseFromTranscriptItems,
    isIncompleteStatus,
    scoreVisibleAnswer,
    shouldSettleSubagentResponse,
    summarizeEvents,
    waitForSubagentSettlement
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

test('desktop-real visible scorer extracts Chinese conclusion answer line', () => {
    const response = {
        ok: true,
        status: 'completed',
        displayText: '四舍五入到最近千位：**17,000 小时**\n**结论：17000**'
    };
    const question = 'How many thousand hours would it take? Round your result to the nearest 1000 hours.';
    const score = scoreVisibleAnswer({ response, gold: '17', question });
    assert.equal(score.ok, true);
    assert.equal(score.answer, '17000');
});

test('desktop-real visible scorer accepts count answer with semantic unit suffix', () => {
    const response = {
        ok: true,
        status: 'completed',
        displayText: 'Mercedes Sosa released **3 studio albums** between 2000 and 2009. **Answer: 3 studio albums.**'
    };
    const question = 'How many studio albums were published by Mercedes Sosa between 2000 and 2009 (included)?';

    const score = scoreVisibleAnswer({ response, gold: '3', question });
    assert.equal(score.ok, true);
    assert.equal(score.status, 'visible_answer_match');
    assert.equal(score.answer, '3 studio albums');
});

test('desktop-real visible scorer prefers explicit total count over table years', () => {
    const response = {
        ok: true,
        status: 'completed',
        displayText: [
            'According to the Wikipedia discography section for Mercedes Sosa, the studio albums published between 2000 and 2009 inclusive are:',
            '| Year | Album | Notes |',
            '| 2005 | Corazón Libre | Label: Edge |',
            '| 2009 | Cantora 1 | Label: RCA |',
            '| 2009 | Cantora 2 | Label: RCA |',
            'Total: 3 studio albums.'
        ].join('\n')
    };
    const question = 'How many studio albums were published by Mercedes Sosa between 2000 and 2009 (included)?';

    const score = scoreVisibleAnswer({ response, gold: '3', question });
    assert.equal(score.ok, true);
    assert.equal(score.status, 'visible_answer_match');
    assert.equal(score.answer, '3 studio albums');
    assert.equal(score.source, 'visible_count_total');
});

test('desktop-real eval classifies still-running subagents as incomplete, not true failures', () => {
    assert.equal(isIncompleteStatus('subagent_running'), true);
    assert.equal(isIncompleteStatus('running'), true);
    assert.equal(isIncompleteStatus('completed'), false);
    assert.equal(isIncompleteStatus('answer_candidate_mismatch'), false);
});

test('desktop-real eval settles subagent handoff with child final answer', () => {
    const parentResponse = {
        ok: false,
        status: 'subagent_running',
        displayText: '{"status":"running","subagent":{"id":"subagent-a","childRunId":"child-a"}}',
        subagent: {
            id: 'subagent-a',
            childRunId: 'child-a',
            status: 'running'
        }
    };
    const refs = collectSubagentRefs(parentResponse, []);
    assert.deepEqual(refs.map((ref) => [ref.subagentId, ref.childRunId]), [['subagent-a', 'child-a']]);
    assert.equal(shouldSettleSubagentResponse(parentResponse), true);

    const transcriptFinal = extractFinalResponseFromTranscriptItems([
        {
            type: 'agent.final',
            status: 'completed',
            payload: {
                ok: true,
                displayText: 'Rounded to nearest 1000 hours: **17000**. Answer: 17000'
            }
        }
    ]);
    const settled = buildSettledSubagentResponse(parentResponse, {
        status: 'completed',
        subagent: {
            id: 'subagent-a',
            childRunId: 'child-a',
            status: 'completed',
            ok: true
        }
    }, transcriptFinal);
    assert.equal(settled.ok, true);
    assert.equal(settled.status, 'completed');

    const score = scoreVisibleAnswer({
        response: settled,
        gold: '17',
        question: 'How many thousand hours would it take? Round your result to the nearest 1000 hours.'
    });
    assert.equal(score.ok, true);
    assert.equal(score.answer, '17000');
});

test('desktop-real subagent settlement waits for runtime child transcript', async () => {
    const parentResponse = {
        ok: false,
        status: 'subagent_running',
        displayText: 'TaskAgent is still running.',
        subagent: {
            id: 'subagent-b',
            childRunId: 'child-b',
            status: 'running'
        }
    };
    const gateway = {
        runtime: {
            async waitForSubagent(subagentId) {
                assert.equal(subagentId, 'subagent-b');
                return {
                    status: 'completed',
                    subagent: {
                        id: 'subagent-b',
                        childRunId: 'child-b',
                        status: 'completed',
                        ok: true,
                        result: {
                            ok: true,
                            status: 'completed',
                            displayText: 'Answer: 3'
                        }
                    }
                };
            },
            async readTranscript(childRunId) {
                assert.equal(childRunId, 'child-b');
                return {
                    items: [
                        {
                            type: 'agent.final',
                            status: 'completed',
                            payload: {
                                ok: true,
                                displayText: 'The answer is **3**. Answer: 3'
                            }
                        }
                    ]
                };
            }
        }
    };
    const settlement = await waitForSubagentSettlement({
        args: { subagentSettleTimeoutMs: 1000 },
        gateway,
        response: parentResponse,
        taskEvents: []
    });
    assert.equal(settlement.settled, true);
    assert.equal(settlement.response.status, 'completed');
    assert.equal(settlement.response.ok, true);

    const score = scoreVisibleAnswer({
        response: settlement.response,
        gold: '3',
        question: 'Which ball should you choose? Please provide your answer as the number.'
    });
    assert.equal(score.ok, true);
    assert.equal(score.answer, '3');
});
