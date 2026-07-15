import assert from 'node:assert/strict';
import test from 'node:test';

import {
    buildAgentBenchFcSuitePlan,
    parseAgentBenchFcSuiteArgs,
    summarizeAgentBenchFcProgressLines
} from '../scripts/run-agentbench-fc-full-suite.mjs';

const tasks = {
    'dbbench-std': { environment: 'DB', expectedSamples: 300 },
    'os-std': { environment: 'OS', expectedSamples: 144 },
    'kg-std': { environment: 'KG', expectedSamples: 150 },
    'alfworld-std': { environment: 'ALFWorld', expectedSamples: 109 },
    'webshop-std': { environment: 'WebShop', expectedSamples: 200 }
};

test('FC full suite requires explicit approval', () => {
    assert.throws(() => parseAgentBenchFcSuiteArgs([]), /requires --approve-large-stage/);
    assert.equal(parseAgentBenchFcSuiteArgs(['--approve-large-stage']).approved, true);
});

test('FC full suite plans all 903 official samples in a stable order', () => {
    const plan = buildAgentBenchFcSuitePlan({ tasks }, 'fc-full-test');
    assert.equal(plan.expectedSamples, 903);
    assert.deepEqual(plan.tasks.map((item) => item.task), Object.keys(tasks));
    assert.equal(plan.tasks[0].runId, 'fc-full-test-dbbench-std');
});

test('FC full suite progress deduplicates resumed records and sums actual usage', () => {
    const lines = [
        {
            index: 0,
            status: 'infrastructure_error',
            error: { kind: 'controller_transport' },
            duration_ms: 10,
            agent_calls: []
        },
        {
            index: 0,
            status: 'completed',
            reward: 1,
            duration_ms: 20,
            agent_calls: [{ usage: { prompt_tokens: 3, completion_tokens: 2, total_tokens: 5 } }]
        },
        {
            index: 1,
            status: 'completed',
            reward: 0,
            duration_ms: 30,
            agent_calls: [{ usage: { prompt_tokens: 7, completion_tokens: 1, total_tokens: 8 } }]
        }
    ].map((item) => JSON.stringify(item)).join('\n');
    assert.deepEqual(summarizeAgentBenchFcProgressLines(lines), {
        samples: 2,
        completed: 2,
        successes: 1,
        infrastructureErrors: 0,
        durationMs: 50,
        calls: 2,
        promptTokens: 10,
        completionTokens: 3,
        totalTokens: 13
    });
});
