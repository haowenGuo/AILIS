import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import test from 'node:test';

const require = createRequire(import.meta.url);

const {
    attachAgentEvidenceArtifacts,
    buildAgentDirectToolSpecs,
    buildAgentEvidenceArtifactsPromptObject,
    buildEvidenceSufficiencyPromptObject,
    buildFinalAnswerNativeToolSpec,
    buildToolResultEvent,
    buildLosslessToolObservationDigest,
    isExactAnswerExecutionMode,
    normalizeExactAnswerSubmission,
    sanitizeAgentToolCall,
    validateExactAnswerSubmission
} = require('../electron/ailis-agent-runner.cjs');

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

test('final_answer contract reminds relation tasks to verify answer role alignment', () => {
    const spec = buildFinalAnswerNativeToolSpec();
    assert.match(spec.description, /role alignment/);
    assert.match(spec.parameters.properties.reason.description, /target role/);
    assert.match(spec.parameters.properties.reason.description, /relation table direction/);
});

test('Agent tool-call sanitizer does not maintain a hardcoded runtime tool whitelist', () => {
    const xlsxCall = sanitizeAgentToolCall({
        tool_call: {
            tool: 'read_xlsx_workbook',
            title: 'Read workbook',
            args: {
                path: 'task.xlsx',
                includeStyles: true
            }
        }
    }, 0);

    assert.equal(xlsxCall.tool, 'read_xlsx_workbook');
    assert.equal(xlsxCall.args.path, 'task.xlsx');

    const githubPagesCall = sanitizeAgentToolCall({
        tool: 'github_pages',
        args: {
            action: 'diagnose_publish',
            path: '.'
        }
    }, 1);

    assert.equal(githubPagesCall.tool, 'github_pages');

    const futureToolCall = sanitizeAgentToolCall({
        tool: 'future_runtime_tool',
        args: {
            example: true
        }
    }, 2);

    assert.equal(futureToolCall.tool, 'future_runtime_tool');
    assert.equal(sanitizeAgentToolCall({ args: {} }, 3), null);
});

test('Agent tool observations become evidence artifacts and turn refs', () => {
    const stepResult = attachAgentEvidenceArtifacts({
        id: 'step-1',
        title: 'Read spreadsheet',
        tool: 'mcp__ailis_research__read_spreadsheet',
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

test('Agent tool result events preserve complete structured document table previews', () => {
    const documentText = [
        '# DOCUMENT_READ_COMPLETE',
        '',
        'paragraph_count: 40',
        'table_count: 1',
        'truncated: false',
        '',
        '## Paragraphs',
        '[0] Employees',
        ...Array.from({ length: 120 }, (_, index) => `[${index + 1}] ${'profile '.repeat(6)}${index}`),
        '',
        '## Tables',
        'Table 1 rows=13',
        'Giftee | Recipient',
        'Harry | Miguel',
        'Fred | Rebecca',
        'Alex | Tyson'
    ].join('\n');

    const event = buildToolResultEvent({
        id: 'step-docx',
        title: 'Read DOCX',
        tool: 'mcp__ailis_research__read_document',
        args: { path: 'task.docx' },
        iteration: 1,
        response: {
            ok: true,
            status: 'completed',
            result: {
                content: [{ type: 'text', text: documentText }],
                details: {
                    complete: true,
                    truncated: false,
                    reasoningReady: true,
                    paragraphCount: 40,
                    tableCount: 1
                }
            }
        }
    });

    assert.match(event.preview, /Alex \| Tyson/);
    assert.doesNotMatch(event.preview, /Alex \| T\.\.\./);
});

test('Agent evidence artifacts preserve context artifact coverage metadata', () => {
    const stepResult = attachAgentEvidenceArtifacts({
        id: 'step-artifact-range',
        title: 'Query workbook range',
        tool: 'artifact_query',
        args: {
            action: 'range',
            artifactId: 'ctx-spreadsheet-demo',
            sheet: 'Map',
            range: 'A1:I20'
        },
        iteration: 2,
        response: {
            ok: true,
            status: 'completed',
            result: {
                content: [{
                    type: 'text',
                    text: 'SPREADSHEET_RANGE sheet="Map" range=A1:I20\ntruncated=false; complete=true; reasoning_ready=true'
                }],
                details: {
                    action: 'range',
                    artifactId: 'ctx-spreadsheet-demo',
                    sheet: 'Map',
                    range: 'A1:I20',
                    complete: true,
                    truncated: false,
                    reasoningReady: true,
                    pinnedEvidenceId: 'ev-demo',
                    coverage: {
                        kind: 'spreadsheet_range_coverage',
                        queryAction: 'range',
                        sheet: 'Map',
                        range: 'A1:I20',
                        complete: true,
                        truncated: false
                    }
                }
            }
        }
    }, {
        taskType: 'exact_answer_eval'
    });

    assert.equal(stepResult.evidenceArtifacts.length, 1);
    const promptArtifacts = buildAgentEvidenceArtifactsPromptObject([stepResult]);
    assert.equal(promptArtifacts[0].payload.artifactId, 'ctx-spreadsheet-demo');
    assert.equal(promptArtifacts[0].payload.sheet, 'Map');
    assert.equal(promptArtifacts[0].payload.range, 'A1:I20');
    assert.equal(promptArtifacts[0].payload.complete, true);
    assert.equal(promptArtifacts[0].payload.truncated, false);
    assert.equal(promptArtifacts[0].payload.reasoningReady, true);
    assert.equal(promptArtifacts[0].payload.pinnedEvidenceId, 'ev-demo');
    assert.equal(promptArtifacts[0].payload.coverage.range, 'A1:I20');
});

test('Agent evidence sufficiency gate summarizes ready artifact and compute evidence', () => {
    const stepResults = [{
        id: 'step-range',
        title: 'Query workbook range',
        tool: 'artifact_query',
        args: {
            action: 'range',
            artifactId: 'ctx-spreadsheet-demo',
            sheet: 'Map',
            range: 'A1:I20'
        },
        response: {
            ok: true,
            status: 'completed',
            result: {
                content: [{ type: 'text', text: 'complete range evidence' }],
                details: {
                    action: 'range',
                    artifactId: 'ctx-spreadsheet-demo',
                    sheet: 'Map',
                    range: 'A1:I20',
                    complete: true,
                    truncated: false,
                    reasoningReady: true,
                    pinnedEvidenceId: 'ev-range',
                    coverage: {
                        kind: 'spreadsheet_range_coverage',
                        queryAction: 'range',
                        sheet: 'Map',
                        range: 'A1:I20',
                        complete: true,
                        truncated: false
                    }
                }
            }
        }
    }, {
        id: 'step-covered',
        title: 'Query covered subrange',
        tool: 'artifact_query',
        args: {
            action: 'range',
            artifactId: 'ctx-spreadsheet-demo',
            sheet: 'Map',
            range: 'B2:C3'
        },
        response: {
            ok: true,
            status: 'completed',
            result: {
                content: [{ type: 'text', text: 'covered subrange evidence' }],
                details: {
                    action: 'range',
                    artifactId: 'ctx-spreadsheet-demo',
                    sheet: 'Map',
                    range: 'B2:C3',
                    complete: true,
                    truncated: false,
                    reasoningReady: true,
                    coveredByEvidence: {
                        evidenceId: 'ev-range',
                        sheet: 'Map',
                        range: 'A1:I20',
                        complete: true,
                        truncated: false,
                        reasoningReady: true
                    },
                    coverage: {
                        kind: 'spreadsheet_range_coverage',
                        queryAction: 'range',
                        sheet: 'Map',
                        range: 'B2:C3',
                        complete: true,
                        truncated: false
                    }
                }
            }
        }
    }, {
        id: 'step-compute',
        title: 'Compute path',
        tool: 'artifact_compute',
        args: {
            action: 'find_path',
            artifactId: 'ctx-spreadsheet-demo',
            sheet: 'Map'
        },
        response: {
            ok: true,
            status: 'completed',
            result: {
                content: [{ type: 'text', text: 'pathFound=true steps=12' }],
                details: {
                    action: 'find_path',
                    artifactId: 'ctx-spreadsheet-demo',
                    sheet: 'Map',
                    range: 'A1:I20',
                    complete: true,
                    truncated: false,
                    reasoningReady: true,
                    result: {
                        pathFound: true,
                        steps: 12,
                        visited: 35,
                        pathTruncated: false
                    }
                }
            }
        }
    }];

    const sufficiency = buildEvidenceSufficiencyPromptObject(stepResults, { exactAnswerMode: true });
    assert.equal(sufficiency.status, 'ready_for_reasoning');
    assert.equal(sufficiency.ready, true);
    assert.equal(sufficiency.exact_answer_mode, true);
    assert.equal(sufficiency.ready_evidence_count, 3);
    assert.equal(sufficiency.has_compute_evidence, true);
    assert.equal(sufficiency.repeated_covered_reads[0].coveredByEvidence.evidenceId, 'ev-range');
    assert.equal(sufficiency.latest_ready_evidence.resultSummary.pathFound, true);
    assert.equal(sufficiency.latest_ready_evidence.resultSummary.steps, 12);
});

test('Agent evidence sufficiency treats complete parsed documents as reasoning-ready evidence', () => {
    const stepResults = [{
        id: 'step-docx',
        title: 'Read DOCX',
        tool: 'mcp__ailis_research__read_document',
        args: { path: 'task.docx' },
        response: {
            ok: true,
            status: 'completed',
            result: {
                content: [{
                    type: 'text',
                    text: [
                        '# DOCUMENT_READ_COMPLETE',
                        'paragraph_count: 3',
                        'table_count: 1',
                        'truncated: false',
                        '',
                        '## Tables',
                        'Table 1 rows=2',
                        'Giver | Recipient',
                        'Fred | Rebecca'
                    ].join('\n')
                }]
            }
        }
    }];

    const sufficiency = buildEvidenceSufficiencyPromptObject(stepResults, { exactAnswerMode: true });
    assert.equal(sufficiency.status, 'ready_for_reasoning');
    assert.equal(sufficiency.ready, true);
    assert.equal(sufficiency.ready_evidence[0].tool, 'mcp__ailis_research__read_document');
});

test('Agent evidence sufficiency unwraps nested MCP structuredContent readiness', () => {
    const stepResults = [{
        id: 'step-web-fetch',
        title: 'Fetch evidence page',
        tool: 'mcp__ailis_research__web_fetch',
        args: { url: 'https://example.test/evidence' },
        response: {
            ok: true,
            status: 'completed',
            result: {
                structuredContent: {
                    status: 'completed',
                    server: 'ailis_research',
                    tool: 'web_fetch',
                    result: {
                        structuredContent: {
                            status: 'completed',
                            url: 'https://example.test/evidence',
                            complete: true,
                            truncated: false,
                            reasoningReady: true,
                            evidenceQuality: 'sufficient_evidence',
                            observationContract: {
                                complete: true,
                                truncated: false,
                                reasoning_ready: true,
                                evidence_quality: 'sufficient_evidence'
                            }
                        }
                    }
                },
                content: [{ type: 'text', text: 'ready web evidence' }]
            }
        }
    }];

    const sufficiency = buildEvidenceSufficiencyPromptObject(stepResults, { exactAnswerMode: true });
    assert.equal(sufficiency.status, 'ready_for_reasoning');
    assert.equal(sufficiency.ready_evidence_count, 1);
    assert.equal(sufficiency.ready_evidence[0].tool, 'mcp__ailis_research__web_fetch');
});

test('Agent model-facing observation digest stays compact and artifact-backed', () => {
    const longSearchText = Array.from({ length: 80 }, (_, index) =>
        `${index + 1}. Result ${index}\nURL: https://example.test/${index}\nSnippet: ${'long snippet '.repeat(40)}`
    ).join('\n\n');
    const stepResult = attachAgentEvidenceArtifacts({
        id: 'step-long',
        title: 'Search noisy web results',
        tool: 'mcp__ailis_research__web_search',
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
        tool: 'mcp__ailis_research__web_fetch',
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

test('Agent exact-answer gate rejects raw rounded units for scaled-unit questions', () => {
    const stepResult = attachAgentEvidenceArtifacts({
        id: 'step-web',
        title: 'Fetch source',
        tool: 'mcp__ailis_research__web_fetch',
        args: { url: 'https://example.test/moon' },
        iteration: 1,
        response: {
            ok: true,
            status: 'completed',
            result: {
                content: [{ type: 'text', text: 'periapsis: 362600 km; marathon pace evidence available.' }]
            }
        }
    });
    const evidenceRef = stepResult.evidenceArtifacts[0].id;
    const message = [
        'If a runner maintained marathon pace indefinitely, how many thousand hours would it take?',
        'Round your result to the nearest 1000 hours.'
    ].join(' ');

    const rejected = validateExactAnswerSubmission({
        decision: {
            exactAnswerSubmission: normalizeExactAnswerSubmission({
                answer: '1000',
                confidence: 'high',
                evidence_refs: [evidenceRef],
                reason: 'rounded to nearest 1000 hours'
            })
        },
        stepResults: [stepResult],
        message
    });
    assert.equal(rejected.ok, false);
    assert.ok(rejected.errors.includes('scaled_unit_answer_mismatch'));
    assert.match(rejected.scaledUnitMismatch.instruction, /divide by 1000/i);

    const accepted = validateExactAnswerSubmission({
        decision: {
            exactAnswerSubmission: normalizeExactAnswerSubmission({
                answer: '17',
                confidence: 'high',
                evidence_refs: [evidenceRef],
                reason: 'raw hours rounded to 17000, then reported as 17 thousand hours'
            })
        },
        stepResults: [stepResult],
        message
    });
    assert.equal(accepted.ok, true);
});

test('Agent exact-answer gate rejects numeric answer when reason states a different final number', () => {
    const stepResult = attachAgentEvidenceArtifacts({
        id: 'step-calc',
        title: 'Fetch and calculate',
        tool: 'mcp__ailis_research__web_fetch',
        args: { url: 'https://example.test/evidence' },
        iteration: 1,
        response: {
            ok: true,
            status: 'completed',
            result: {
                content: [{ type: 'text', text: 'The calculation gives 17 thousand hours.' }]
            }
        }
    });
    const evidenceRef = stepResult.evidenceArtifacts[0].id;

    const rejected = validateExactAnswerSubmission({
        decision: {
            exactAnswerSubmission: normalizeExactAnswerSubmission({
                answer: '40',
                confidence: 'high',
                evidence_refs: [evidenceRef],
                reason: '356400 / 20.897 ≈ 17054 hours, rounded to 17000 hours, so the correct answer is 17.'
            })
        },
        stepResults: [stepResult],
        message: 'How many thousand hours?'
    });

    assert.equal(rejected.ok, false);
    assert.ok(rejected.errors.includes('answer_reason_conflict'));
    assert.equal(rejected.reasonConflict.answer, '40');
    assert.deepEqual(rejected.reasonConflict.reasonFinalNumbers, ['17']);
});
