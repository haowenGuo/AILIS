import assert from 'node:assert/strict';
import test from 'node:test';

import { buildAgentBenchRunRequest } from '../scripts/serve-ailis-agentbench.mjs';

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
