import assert from 'node:assert/strict';
import test from 'node:test';

import { parseAgentBenchFcStageArgs } from '../evals/agentbench_fc/stage-options.mjs';
import { evaluateAgentBenchFcStageGate } from '../evals/agentbench_fc/stage-policy.mjs';

const tasks = ['dbbench-std', 'os-std', 'kg-std', 'alfworld-std', 'webshop-std'];

function validSummary(overrides = {}) {
    return {
        schema: 'ailis.agentbench.fc.environment.v1',
        selected: 3,
        error_records: 0,
        valid: true,
        protocol: { style: 'openai_function_calling' },
        quality: { completion_rate: 1, infrastructure_errors: 0 },
        usage: { calls: 6, total_tokens: 20_000 },
        duration_ms: 30_000,
        official_score: { average_reward: 0 },
        ...overrides
    };
}

test('FC stages require one of the five official tasks', () => {
    assert.throws(() => parseAgentBenchFcStageArgs([], tasks), /exactly one --task/);
    assert.throws(() => parseAgentBenchFcStageArgs(['--task', 'ltp-std'], tasks), /Unknown AgentBench FC task/);
    assert.equal(
        parseAgentBenchFcStageArgs(['--stage', 'smoke', '--task', 'dbbench-std'], tasks).limit,
        3
    );
    assert.equal(
        parseAgentBenchFcStageArgs(['--stage', 'pilot', '--task', 'dbbench-std'], tasks).limit,
        10
    );
});

test('FC full stage requires explicit approval', () => {
    assert.throws(
        () => parseAgentBenchFcStageArgs(['--stage', 'full', '--task', 'dbbench-std'], tasks),
        /requires --approve-large-stage/
    );
    assert.equal(parseAgentBenchFcStageArgs([
        '--stage', 'full', '--task', 'dbbench-std', '--approve-large-stage'
    ], tasks).limit, 0);
});

test('FC gate accepts a valid measured zero score', () => {
    assert.deepEqual(evaluateAgentBenchFcStageGate(validSummary(), 'smoke'), { passed: true, reasons: [] });
});

test('FC gate rejects old schemas and infrastructure failures', () => {
    const result = evaluateAgentBenchFcStageGate(validSummary({
        schema: 'ailis.agentbench.official.v0.2',
        valid: false,
        error_records: 1
    }), 'smoke');
    assert.equal(result.passed, false);
    assert.ok(result.reasons.includes('wrong_summary_schema'));
    assert.ok(result.reasons.includes('summary_not_valid'));
    assert.ok(result.reasons.includes('infrastructure_errors_present'));
});
