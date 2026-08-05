import test from 'node:test';
import assert from 'node:assert/strict';

import {
    buildDesktopRealPayload,
    configureResearchMcpLlmEnvironment,
    isIncompleteStatus,
    parseArgs,
    scoreVisibleAnswer,
    summarizeEvents
} from '../scripts/run-ailis-desktop-real-gaia-eval.mjs';

test('desktop-real GAIA defaults to the Luna Codex bridge without a round cap', () => {
    const previousBridge = process.env.AILIS_EVAL_CODEX_MODEL_BRIDGE;
    const previousModel = process.env.AILIS_CODEX_MODEL;
    delete process.env.AILIS_EVAL_CODEX_MODEL_BRIDGE;
    delete process.env.AILIS_CODEX_MODEL;
    try {
        const args = parseArgs([
            '--run-id', 'luna-default-test',
            '--output-dir', 'eval-results/luna-default-test'
        ]);

        assert.equal(args.codexModelBridge, true);
        assert.equal(args.codexModel, 'gpt-5.6-luna');
        assert.equal(Object.hasOwn(args, 'maxAgentSteps'), false);

        const explicitFallback = parseArgs([
            '--run-id', 'provider-fallback-test',
            '--output-dir', 'eval-results/provider-fallback-test',
            '--no-codex-model-bridge'
        ]);
        assert.equal(explicitFallback.codexModelBridge, false);
    } finally {
        if (previousBridge === undefined) delete process.env.AILIS_EVAL_CODEX_MODEL_BRIDGE;
        else process.env.AILIS_EVAL_CODEX_MODEL_BRIDGE = previousBridge;
        if (previousModel === undefined) delete process.env.AILIS_CODEX_MODEL;
        else process.env.AILIS_CODEX_MODEL = previousModel;
    }
});

test('desktop-real GAIA payload disables persistent memory for independent tasks', () => {
    const payload = buildDesktopRealPayload({
        args: {
            runId: 'isolated-run',
            workspaceRoot: 'F:/workspace',
            maxAgentSteps: 12,
            directToolExecutor: true,
            debugBreakAfterRound: 0,
            agentRole: 'task_agent',
            workspaceMode: 'isolated'
        },
        task: {
            task_id: 'task-1',
            question: 'Independent benchmark question.'
        },
        llmSettings: {
            provider: 'codex-model-bridge',
            model: 'gpt-5.6-luna'
        }
    });

    assert.equal(payload.memoryPolicy, 'disabled');
    assert.equal(payload.context.memoryPolicy, 'disabled');
    assert.equal(Object.hasOwn(payload, 'maxAgentSteps'), false);
    assert.equal(Object.hasOwn(payload.context, 'maxAgentSteps'), false);
});

test('desktop-real eval forwards its active LLM provider to research MCP subprocesses', () => {
    const names = [
        'AILIS_TOOL_LLM_PROVIDER',
        'AILIS_TOOL_LLM_BASE_URL',
        'AILIS_TOOL_LLM_MODEL',
        'AILIS_TOOL_LLM_API_KEY',
        'AILIS_TOOL_LLM_REASONING_EFFORT'
    ];
    const previous = Object.fromEntries(names.map((name) => [name, process.env[name]]));
    try {
        configureResearchMcpLlmEnvironment({
            provider: 'codex-model-bridge',
            baseUrl: 'codex://chatgpt-oauth',
            model: 'gpt-5.6-luna',
            apiKey: '',
            reasoningEffort: 'medium'
        });
        assert.equal(process.env.AILIS_TOOL_LLM_PROVIDER, 'codex-model-bridge');
        assert.equal(process.env.AILIS_TOOL_LLM_BASE_URL, 'codex://chatgpt-oauth');
        assert.equal(process.env.AILIS_TOOL_LLM_MODEL, 'gpt-5.6-luna');
        assert.equal(process.env.AILIS_TOOL_LLM_API_KEY, undefined);
        assert.equal(process.env.AILIS_TOOL_LLM_REASONING_EFFORT, 'medium');
    } finally {
        for (const name of names) {
            if (previous[name] === undefined) {
                delete process.env[name];
            } else {
                process.env[name] = previous[name];
            }
        }
    }
});

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

test('desktop-real visible scorer prefers the TaskAgent exact answer over explanatory prose', () => {
    const score = scoreVisibleAnswer({
        response: {
            ok: true,
            status: 'completed',
            displayText: 'I found several plausible values, including 41 and 43.',
            taskResult: {
                exact_answer: '42',
                final_answer: 'The verified count is 42.'
            }
        },
        gold: '42'
    });

    assert.equal(score.ok, true);
    assert.equal(score.source, 'task_result_exact_answer');
    assert.equal(score.answer, '42');
});

test('desktop-real visible scorer ignores case and ordinary title punctuation differences', () => {
    const score = scoreVisibleAnswer({
        response: {
            ok: true,
            status: 'completed',
            finalAnswer: 'Mapping human-oriented information to software agents for online systems usage',
            displayText: 'Mapping human-oriented information to software agents for online systems usage'
        },
        gold: 'Mapping Human Oriented Information to Software Agents for Online Systems Usage'
    });

    assert.equal(score.ok, true);
    assert.equal(score.status, 'visible_answer_match');
    assert.equal(score.answer, 'Mapping human-oriented information to software agents for online systems usage');
});

test('desktop-real visible scorer still rejects materially different titles', () => {
    const score = scoreVisibleAnswer({
        response: {
            ok: true,
            status: 'completed',
            finalAnswer: "A New Software Agent 'Learning' Algorithm"
        },
        gold: 'Mapping Human Oriented Information to Software Agents for Online Systems Usage'
    });

    assert.equal(score.ok, false);
});

test('desktop-real visible scorer treats Saint and St. as the same city name', () => {
    const score = scoreVisibleAnswer({
        response: {
            ok: true,
            status: 'completed',
            finalAnswer: 'St. Petersburg',
            displayText: 'St. Petersburg'
        },
        gold: 'Saint Petersburg',
        question: 'Where were the specimens deposited? Just give me the city name.'
    });

    assert.equal(score.ok, true);
    assert.equal(score.status, 'visible_answer_match');
});

test('desktop-real visible scorer preserves duplicate multiplicity in ordered lists', () => {
    const gold = '3/4,30/5,30/5,1/3';
    const question = 'Return every fraction in the order in which it appears.';

    const missingDuplicate = scoreVisibleAnswer({
        response: {
            ok: true,
            status: 'completed',
            finalAnswer: '3/4,30/5,1/3',
            displayText: '3/4,30/5,1/3'
        },
        gold,
        question
    });
    assert.equal(missingDuplicate.ok, false);

    const complete = scoreVisibleAnswer({
        response: {
            ok: true,
            status: 'completed',
            finalAnswer: '3/4,30/5,30/5,1/3',
            displayText: '3/4,30/5,30/5,1/3'
        },
        gold,
        question
    });
    assert.equal(complete.ok, true);
});

test('desktop-real visible scorer rejects reordered parts for order-sensitive lists', () => {
    const score = scoreVisibleAnswer({
        response: {
            ok: true,
            status: 'completed',
            displayText: 'Observed values: 1/3,30/5,3/4.'
        },
        gold: '3/4,30/5,1/3',
        question: 'Return every fraction in the order in which it appears.'
    });

    assert.equal(score.ok, false);
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
        status: 'running',
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

test('desktop-real visible scorer extracts an English rounded scaled-unit result from a real answer shape', () => {
    const response = {
        ok: true,
        status: 'completed',
        finalAnswer: 'Using source values, the calculation is approximately 17053 hours. Rounded to the nearest 1000 hours: 17000',
        displayText: [
            'Using source values, the calculation is approximately 17053 hours.',
            'Rounded to the nearest 1000 hours: **17000**'
        ].join('\n')
    };
    const question = 'How many thousand hours would it take? Round your result to the nearest 1000 hours.';

    const score = scoreVisibleAnswer({ response, gold: '17', question });
    assert.equal(score.ok, true);
    assert.equal(score.source, 'visible_scaled_result');
    assert.equal(score.answer, '17000');
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

test('desktop-real visible scorer accepts one formatted currency number as a numeric gold answer', () => {
    const response = {
        ok: true,
        status: 'completed',
        finalAnswer: 'The food-only sales total is $89,706.00 USD.',
        displayText: 'The food-only sales total is **$89,706.00 USD**.'
    };

    const score = scoreVisibleAnswer({
        response,
        gold: '89706.00',
        question: 'What were the total sales from food, not including drinks?'
    });
    assert.equal(score.ok, true);
    assert.equal(score.status, 'visible_answer_match');
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

test('desktop-real eval classifies still-running Agent work as incomplete, not true failures', () => {
    assert.equal(isIncompleteStatus('running'), true);
    assert.equal(isIncompleteStatus('completed'), false);
    assert.equal(isIncompleteStatus('answer_candidate_mismatch'), false);
});
