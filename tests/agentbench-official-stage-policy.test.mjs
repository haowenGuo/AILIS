import assert from 'node:assert/strict';
import test from 'node:test';

import { evaluateStageGate } from '../evals/agentbench_official/stage-policy.mjs';

function summary(overrides = {}) {
    return {
        selected: 3,
        completed_records: 3,
        error_records: 0,
        valid: true,
        quality: { completion_rate: 1, infrastructure_errors: 0 },
        usage: { calls: 6, total_tokens: 20_000 },
        duration_ms: 30_000,
        official_score: { total: 3 },
        ...overrides
    };
}

test('smoke gate accepts a complete bounded official run', () => {
    assert.deepEqual(evaluateStageGate(summary(), 'smoke'), {
        passed: true,
        reasons: []
    });
});

test('an official zero score is still a valid measured result', () => {
    const result = evaluateStageGate(summary({ official_score: 0 }), 'smoke');
    assert.equal(result.passed, true);
});

test('smoke gate rejects infrastructure failures even when an official score exists', () => {
    const result = evaluateStageGate(summary({
        valid: false,
        error_records: 1,
        quality: { completion_rate: 2 / 3, infrastructure_errors: 1 }
    }), 'smoke');
    assert.equal(result.passed, false);
    assert.ok(result.reasons.includes('summary_not_valid'));
    assert.ok(result.reasons.includes('infrastructure_errors_present'));
});

test('smoke gate rejects token budget overruns', () => {
    const result = evaluateStageGate(summary({
        usage: { calls: 6, total_tokens: 150_001 }
    }), 'smoke');
    assert.equal(result.passed, false);
    assert.ok(result.reasons.includes('token_budget_exceeded'));
});

test('test gate measures accuracy without imposing a score threshold', () => {
    const result = evaluateStageGate(summary({
        selected: 300,
        completed_records: 300,
        quality: { completion_rate: 0.05, infrastructure_errors: 0 },
        usage: { calls: 300, total_tokens: 900_000 },
        duration_ms: 600_000,
        official_score: { custom: { overall_cat_accuracy: 0.01 } }
    }), 'test');
    assert.equal(result.passed, true);
});
