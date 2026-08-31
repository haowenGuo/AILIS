import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import test from 'node:test';

const require = createRequire(import.meta.url);
const {
    buildAgentDirectToolSpecs,
    buildInvalidDecisionProgressRecord,
    buildLlmAgentDirectToolPrompt,
    buildToolObservationDigest,
    buildToolResultEvent,
    detectInvalidDecisionNoProgress,
    validateNativeDirectToolCall
} = require('../electron/ailis-agent-runner.cjs');

function createGateway(specs = []) {
    return {
        gatewayToolRuntimeRegistry: {
            modelVisibleSpecs: () => specs,
            definition: () => null
        }
    };
}

test('ordinary and legacy evaluation requests expose the same production tool surface', () => {
    const specs = [{
        name: 'exec',
        description: 'Run a shell command.',
        parameters: {
            type: 'object',
            properties: { command: { type: 'string' } },
            required: ['command'],
            additionalProperties: false
        }
    }];
    const gateway = createGateway(specs);
    const ordinary = buildAgentDirectToolSpecs(gateway, {
        requestContext: { agentRole: 'task_agent' }
    });
    const legacyFlags = buildAgentDirectToolSpecs(gateway, {
        requestContext: {
            agentRole: 'task_agent',
            exactAnswerMode: true,
            answerOnly: true,
            executionProfile: { kind: 'exact_answer_eval' }
        },
        exactAnswerMode: true
    });

    assert.deepEqual(legacyFlags, ordinary);
    assert.deepEqual(ordinary.map((spec) => spec.name), ['exec']);
    assert.equal(ordinary.some((spec) => spec.name === 'final_answer'), false);
});

test('native tool validation enforces only the exposed JSON schema', () => {
    const tools = [{
        name: 'exec',
        description: 'Run a shell command.',
        parameters: {
            type: 'object',
            properties: { command: { type: 'string' } },
            required: ['command'],
            additionalProperties: false
        }
    }];

    assert.equal(validateNativeDirectToolCall({
        name: 'exec',
        arguments: { command: 'curl https://example.com' }
    }, tools, {
        enforceEvidenceProvenance: true,
        originalUserGoal: 'Look up today on August 6, 2026.'
    }).ok, true);

    const missing = validateNativeDirectToolCall({
        name: 'exec',
        arguments: {}
    }, tools);
    assert.equal(missing.ok, false);
    assert.match(missing.errors.join(' '), /command is required/i);

    const hidden = validateNativeDirectToolCall({
        name: 'web_run',
        arguments: { search_query: [{ q: 'current weather' }] }
    }, tools);
    assert.equal(hidden.ok, false);
    assert.match(hidden.errors.join(' '), /not exposed/i);
});

test('invalid native calls stop after repeated or consecutive failures', () => {
    const invalid = (tool, args, iteration) => buildInvalidDecisionProgressRecord({
        status: 'invalid_native_tool_args',
        nativeToolCall: { name: tool, arguments: args },
        raw: { errors: ['invalid arguments'] }
    }, iteration);

    const first = invalid('exec', {}, 0);
    const repeated = invalid('exec', {}, 1);
    assert.equal(
        detectInvalidDecisionNoProgress([first, repeated]),
        'repeated_invalid_native_tool_call'
    );

    assert.equal(
        detectInvalidDecisionNoProgress([
            invalid('web_run', { search_query: [] }, 0),
            invalid('exec', { command: 3 }, 1),
            invalid('read', { path: 4 }, 2)
        ]),
        'consecutive_invalid_native_tool_calls'
    );
});

test('TaskAgent prompt leaves semantics and fallback strategy to the model', () => {
    const prompt = buildLlmAgentDirectToolPrompt({
        message: 'Look up today\'s weather for August 6, 2026.',
        contextMode: 'task_agent',
        tools: [{
            name: 'exec_command',
            description: 'Run a shell command.',
            parameters: {
                type: 'object',
                properties: { cmd: { type: 'string' } },
                required: ['cmd']
            }
        }]
    });

    assert.match(prompt.instructions, /^You are Codex/);
    assert.doesNotMatch(prompt.instructions, /read-only shell script or direct HTTP client is a valid fallback/i);
    assert.doesNotMatch(prompt.instructions, /execution-evidence contract|exact-answer mode|candidate-set boundary/i);
});

test('tool result events expose observations without an evidence verdict', () => {
    const event = buildToolResultEvent({
        id: 'step-1',
        title: 'Fetch weather',
        tool: 'exec',
        args: { command: 'curl https://example.com' },
        response: {
            ok: true,
            status: 'completed',
            result: {
                content: [{ type: 'text', text: 'temperature: 30C' }]
            }
        }
    });

    assert.equal(event.ok, true);
    assert.match(event.preview, /30C/);
    assert.equal('evidenceGap' in event, false);
    assert.equal('evidenceArtifacts' in event, false);
    assert.equal('evidenceRefs' in event, false);
});

test('model observation digest keeps useful output text', () => {
    const digest = buildToolObservationDigest([{
        id: 'step-1',
        title: 'Fetch weather',
        tool: 'exec',
        args: { command: 'curl https://example.com' },
        response: {
            ok: true,
            status: 'completed',
            result: {
                content: [{ type: 'text', text: 'temperature: 30C' }]
            }
        }
    }]);

    assert.match(JSON.stringify(digest), /30C/);
});
