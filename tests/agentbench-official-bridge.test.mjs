import assert from 'node:assert/strict';
import test from 'node:test';

import {
    assertSuccessfulAgentResult,
    buildFailedInferencePayload,
    buildAgentBenchRunRequest
} from '../scripts/serve-ailis-agentbench.mjs';

const llmSettings = {
    provider: 'openai-compatible',
    baseUrl: 'https://example.test/v1',
    model: 'test-model',
    apiKey: 'secret',
    temperature: 0.2,
    timeoutMs: 180000
};

test('official AgentBench bridge preserves authoritative history and exposes no native tools', () => {
    const request = buildAgentBenchRunRequest({
        session_id: 'official:db:1',
        turn: 2,
        history: [
            { role: 'user', content: 'Protocol: emit one SQL action.' },
            { role: 'agent', content: 'Action: Operation\n```sql\nSHOW TABLES;\n```' },
            { role: 'user', content: "[('items',)]" }
        ]
    }, llmSettings);

    assert.equal(request.runId, 'official:db:1:turn:2');
    assert.equal(request.sessionId, 'official:db:1');
    assert.equal(request.agentRole, undefined);
    assert.equal(request.context.agentRole, 'task_agent');
    assert.equal(request.context.contextMode, 'task_agent');
    assert.equal(request.context.cleanContext, true);
    assert.equal(request.context.nativeDirectTools, false);
    assert.equal(request.context.includeExternalToolExposureInPrompt, false);
    assert.equal(request.maxAgentSteps, 1);
    assert.deepEqual(request.messageHistory, []);
    assert.match(request.message, /USER:\nProtocol: emit one SQL action\./);
    assert.match(request.message, /AGENT:\nAction: Operation/);
    assert.match(request.message, /Produce exactly one environment action for this turn, then stop\./);
    assert.match(request.message, /Never invent, simulate, or append USER or environment feedback/);
    assert.match(request.message, /put both fences on their own lines/);
    assert.equal(request.message.match(/Protocol: emit one SQL action\./g)?.length, 1);
});

test('official AgentBench bridge rejects empty history', () => {
    assert.throws(
        () => buildAgentBenchRunRequest({ history: [] }, llmSettings),
        /history is required/
    );
});

test('official AgentBench bridge normalizes environment agent roles', () => {
    const request = buildAgentBenchRunRequest({
        history: [
            { role: 'assistant', content: 'previous action' },
            { role: 'environment', content: 'observation' }
        ]
    }, llmSettings);
    assert.match(request.message, /AGENT:\nprevious action/);
    assert.match(request.message, /USER:\nobservation/);
});

test('official AgentBench bridge rejects transient model failures as infrastructure errors', () => {
    assert.throws(
        () => assertSuccessfulAgentResult({ ok: false, status: 'transient_network_error' }),
        (error) => error.statusCode === 503 && error.code === 'transient_network_error'
    );
});

test('official AgentBench bridge accepts successful model results', () => {
    const result = { ok: true, status: 'completed', displayText: 'Action: Answer' };
    assert.equal(assertSuccessfulAgentResult(result), result);
});

test('official AgentBench bridge preserves failed-call usage for budget accounting', () => {
    const error = Object.assign(new Error('provider unavailable'), {
        code: 'transient_network_error'
    });
    assert.deepEqual(buildFailedInferencePayload(error, {
        prompt_tokens: 120,
        completion_tokens: 5,
        total_tokens: 125
    }, 900), {
        error: 'provider unavailable',
        metrics: { ok: false, status: 'transient_network_error', duration_ms: 900,
            usage: { prompt_tokens: 120, completion_tokens: 5, total_tokens: 125 } }
    });
});
