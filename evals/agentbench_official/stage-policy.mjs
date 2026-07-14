export const AGENTBENCH_STAGE_POLICY = Object.freeze({
    smoke: Object.freeze({
        maxSamples: 3,
        minCompletionRate: 2 / 3,
        maxCalls: 60,
        maxTokens: 150_000,
        maxDurationMs: 15 * 60_000
    }),
    pilot: Object.freeze({
        maxSamples: 10,
        minCompletionRate: 0.8,
        maxCalls: 250,
        maxTokens: 600_000,
        maxDurationMs: 60 * 60_000
    }),
    dev: Object.freeze({
        maxSamples: Infinity,
        minCompletionRate: 0,
        maxAverageCalls: 20,
        maxAverageTokens: 60_000,
        maxAverageDurationMs: 30 * 60_000
    }),
    test: Object.freeze({
        maxSamples: Infinity,
        minCompletionRate: 0,
        maxAverageCalls: 20,
        maxAverageTokens: 60_000,
        maxAverageDurationMs: 30 * 60_000
    })
});

export function evaluateStageGate(summary, stage) {
    const policy = AGENTBENCH_STAGE_POLICY[stage];
    if (!policy) return { passed: false, reasons: [`unknown_stage:${stage}`] };
    const reasons = [];
    const selected = Number(summary?.selected || 0);
    const calls = Number(summary?.usage?.calls || 0);
    const tokens = Number(summary?.usage?.total_tokens || 0);
    const durationMs = Number(summary?.duration_ms || 0);
    const completionRate = Number(summary?.quality?.completion_rate || 0);
    if (summary?.valid !== true) reasons.push('summary_not_valid');
    if (Number(summary?.error_records || 0) !== 0) reasons.push('infrastructure_errors_present');
    if (summary?.official_score == null) reasons.push('official_score_missing');
    if (selected <= 0) reasons.push('no_samples');
    if (selected > policy.maxSamples) reasons.push('sample_budget_exceeded');
    if (completionRate < policy.minCompletionRate) reasons.push('completion_rate_below_gate');
    if (policy.maxCalls && calls > policy.maxCalls) reasons.push('call_budget_exceeded');
    if (policy.maxTokens && tokens > policy.maxTokens) reasons.push('token_budget_exceeded');
    if (policy.maxDurationMs && durationMs > policy.maxDurationMs) reasons.push('duration_budget_exceeded');
    if (selected > 0 && policy.maxAverageCalls && calls / selected > policy.maxAverageCalls) {
        reasons.push('average_call_budget_exceeded');
    }
    if (selected > 0 && policy.maxAverageTokens && tokens / selected > policy.maxAverageTokens) {
        reasons.push('average_token_budget_exceeded');
    }
    if (selected > 0 && policy.maxAverageDurationMs && durationMs / selected > policy.maxAverageDurationMs) {
        reasons.push('average_duration_budget_exceeded');
    }
    return { passed: reasons.length === 0, reasons };
}
