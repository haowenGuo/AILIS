import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import test from 'node:test';

const require = createRequire(import.meta.url);

const {
    attachAgentEvidenceArtifacts,
    buildAgentDirectToolSpecs,
    buildAgentEvidenceArtifactsPromptObject,
    buildToolResultEvent,
    buildLosslessToolObservationDigest,
    isExactAnswerExecutionMode,
    normalizeExactAnswerSubmission,
    validateExactAnswerSubmission
} = require('../electron/humanclaw-agent-runner.cjs');

test('Agent execution flow detects exact-answer evaluation mode', () => {
    assert.equal(isExactAnswerExecutionMode({}, { answerOnly: true }), true);
    assert.equal(isExactAnswerExecutionMode({}, { executionProfile: { kind: 'exact_answer_eval' } }), true);
    assert.equal(isExactAnswerExecutionMode({}, { evaluationTaskId: 'gaia-task' }), true);
    assert.equal(isExactAnswerExecutionMode({}, {}), false);
});

test('Agent direct tool specs inject native final_answer only for exact-answer mode', () => {
    const gateway = {
        gatewayToolRuntimeRegistry: {
            modelVisibleSpecs: () => [{
                name: 'tool_search',
                description: 'Search for tools',
                parameters: {
                    type: 'object',
                    properties: { query: { type: 'string' } },
                    required: ['query']
                }
            }]
        }
    };

    const exactSpecs = buildAgentDirectToolSpecs(gateway, {
        requestContext: {},
        exactAnswerMode: true
    });
    assert.equal(exactSpecs[0].name, 'final_answer');
    assert.ok(exactSpecs.some((spec) => spec.name === 'tool_search'));

    const ordinarySpecs = buildAgentDirectToolSpecs(gateway, {
        requestContext: {},
        exactAnswerMode: false
    });
    assert.equal(ordinarySpecs.some((spec) => spec.name === 'final_answer'), false);
});

test('Agent tool observations become evidence artifacts and turn refs', () => {
    const stepResult = attachAgentEvidenceArtifacts({
        id: 'step-1',
        title: 'Read spreadsheet',
        tool: 'mcp__aigl_research__read_spreadsheet',
        args: { path: 'scores.xlsx', action: 'read_spreadsheet' },
        iteration: 1,
        response: {
            ok: true,
            status: 'completed',
            result: {
                content: [{
                    type: 'text',
                    text: JSON.stringify({
                        shape: [10, 3],
                        numeric_sums: { score: 90 },
                        total_numeric_sum: 90
                    })
                }]
            }
        }
    }, {
        taskType: 'exact_answer_eval'
    });

    assert.equal(stepResult.evidenceArtifacts.length, 1);
    const refs = stepResult.evidenceArtifacts.map((artifact) => artifact.id);
    const promptArtifacts = buildAgentEvidenceArtifactsPromptObject([stepResult]);
    assert.deepEqual(promptArtifacts.map((artifact) => artifact.id), refs);

    const event = buildToolResultEvent(stepResult);
    assert.deepEqual(event.evidenceRefs, refs);
    assert.equal(event.evidenceArtifacts.length, 1);
});

test('Agent model-facing observation digest stays compact and artifact-backed', () => {
    const longSearchText = Array.from({ length: 80 }, (_, index) =>
        `${index + 1}. Result ${index}\nURL: https://example.test/${index}\nSnippet: ${'long snippet '.repeat(40)}`
    ).join('\n\n');
    const stepResult = attachAgentEvidenceArtifacts({
        id: 'step-long',
        title: 'Search noisy web results',
        tool: 'mcp__aigl_research__web_search',
        args: { query: 'noisy query' },
        iteration: 3,
        response: {
            ok: true,
            status: 'completed',
            result: {
                content: [{ type: 'text', text: longSearchText }],
                details: {
                    rows: Array.from({ length: 200 }, (_, index) => ({
                        index,
                        text: `${longSearchText} ${index}`
                    }))
                }
            }
        }
    });

    const digest = buildLosslessToolObservationDigest([stepResult]);
    assert.equal(digest.length, 1);
    assert.ok(digest[0].text.length <= 1200);
    assert.ok(JSON.stringify(digest[0].details).length < 1800);
    assert.deepEqual(digest[0].evidenceRefs, stepResult.evidenceArtifacts.map((artifact) => artifact.id));
    assert.equal(stepResult.evidenceArtifacts[0].type, 'ResearchSourceEvidence');
});

test('Agent exact-answer gate requires confident known evidence refs', () => {
    const stepResult = attachAgentEvidenceArtifacts({
        id: 'step-2',
        title: 'Fetch source',
        tool: 'mcp__aigl_research__web_fetch',
        args: { url: 'https://example.test/report' },
        iteration: 2,
        response: {
            ok: true,
            status: 'completed',
            result: {
                content: [{ type: 'text', text: 'The named algorithm is BaseLabelPropagation.' }]
            }
        }
    });
    const evidenceRef = stepResult.evidenceArtifacts[0].id;

    const accepted = validateExactAnswerSubmission({
        decision: {
            exactAnswerSubmission: normalizeExactAnswerSubmission({
                answer: 'BaseLabelPropagation',
                confidence: 'high',
                evidence_refs: [evidenceRef]
            })
        },
        stepResults: [stepResult]
    });
    assert.equal(accepted.ok, true);

    const rejected = validateExactAnswerSubmission({
        decision: {
            exactAnswerSubmission: normalizeExactAnswerSubmission({
                answer: 'BaseLabelPropagation',
                confidence: 'low',
                evidence_refs: ['artifact-missing']
            })
        },
        stepResults: [stepResult]
    });
    assert.equal(rejected.ok, false);
    assert.ok(rejected.errors.includes('confidence_below_gate'));
    assert.ok(rejected.errors.includes('evidence_refs_unknown'));
});
