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
    buildSourceQuestionEvidenceArtifact,
    buildToolResultEvent,
    buildLosslessToolObservationDigest,
    isExactAnswerExecutionMode,
    looksLikeSelfContainedExactAnswerQuestion,
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
    assert.match(spec.description, /QuestionEvidence\/source_question/);
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
    assert.equal(sufficiency.status, 'audit_required');
    assert.equal(sufficiency.ready, false);
    assert.equal(sufficiency.ready_evidence_count, 0);
    assert.equal(sufficiency.audit_required, true);
    assert.equal(sufficiency.evidence_audit_candidates.length, 1);
    assert.equal(sufficiency.evidence_audit_candidates[0].tool, 'mcp__ailis_research__web_fetch');
    assert.equal(sufficiency.evidence_audit_contract.required, true);
    assert.match(sufficiency.evidence_audit_contract.final_answer_rule, /supported_claims/);
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

test('Agent exact-answer mode exposes source_question evidence for self-contained reasoning tasks', () => {
    const question = [
        'In the fictional language of Tizin, basic sentences are arranged with the Verb first, followed by the direct object, followed by the subject of the sentence.',
        'The word that indicates oneself is "Pa" is the nominative form, "Mato" is the accusative form, and "Sing" is the genitive form.',
        'The root verb that indicates an intense like for something is "Maktay".',
        'The word for apples is "Apple" is the nominative form, "Zapple" is the accusative form, and "Izapple" is the genitive form.',
        'Please translate "I like apples" to Tizin.'
    ].join('\n');

    assert.equal(looksLikeSelfContainedExactAnswerQuestion(question), true);
    const sourceArtifact = buildSourceQuestionEvidenceArtifact(question, { exactAnswerMode: true });
    assert.equal(sourceArtifact.type, 'QuestionEvidence');

    const promptArtifacts = buildAgentEvidenceArtifactsPromptObject([], {
        message: question,
        exactAnswerMode: true
    });
    assert.equal(promptArtifacts.length, 1);
    assert.equal(promptArtifacts[0].id, sourceArtifact.id);
    assert.equal(promptArtifacts[0].evidenceId, 'source_question');

    const sufficiency = buildEvidenceSufficiencyPromptObject([], {
        message: question,
        exactAnswerMode: true
    });
    assert.equal(sufficiency.status, 'source_question_ready_for_reasoning');
    assert.equal(sufficiency.ready, true);
    assert.equal(sufficiency.ready_evidence[0].evidenceId, sourceArtifact.id);

    const accepted = validateExactAnswerSubmission({
        message: question,
        decision: {
            exactAnswerSubmission: {
                answer: 'Maktay Mato Apple',
                confidence: 'high',
                evidence_refs: [sourceArtifact.id],
                reason: 'The source question defines present Maktay, accusative Mato for the liker, nominative Apple for apples, and verb-object-subject order.'
            }
        },
        stepResults: []
    });
    assert.equal(accepted.ok, true);
});

test('Agent exact-answer mode does not expose source_question evidence for external retrieval tasks', () => {
    const question = 'Under DDC 633 on Bielefeld University Library BASE, as of 2020, from what country was the unknown language article with a flag unique from the others?';

    assert.equal(looksLikeSelfContainedExactAnswerQuestion(question), false);
    assert.equal(buildSourceQuestionEvidenceArtifact(question, { exactAnswerMode: true }), null);
    assert.deepEqual(buildAgentEvidenceArtifactsPromptObject([], {
        message: question,
        exactAnswerMode: true
    }), []);

    const rejected = validateExactAnswerSubmission({
        message: question,
        decision: {
            exactAnswerSubmission: {
                answer: 'Guatemala',
                confidence: 'high',
                evidence_refs: ['artifact-source-question'],
                reason: 'This should still require external retrieval evidence.'
            }
        },
        stepResults: []
    });
    assert.equal(rejected.ok, false);
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

test('Agent exact-answer gate rejects incomplete first-step simulations for multi-stage random processes', () => {
    const stepResult = attachAgentEvidenceArtifacts({
        id: 'step-sim',
        title: 'Run simulation',
        tool: 'mcp__ailis_research__run_python_file',
        args: {
            code: [
                'import random',
                'from collections import defaultdict',
                'def simulate_game(num_trials=100000):',
                '    win_counts = defaultdict(int)',
                '    for _ in range(num_trials):',
                '        ramp = list(range(1, 101))',
                '        platform = [ramp.pop(0), ramp.pop(0), ramp.pop(0)]',
                '        while True:',
                '            piston = random.randint(0, 2)',
                '            ejected = platform[piston]',
                '            win_counts[ejected] += 1',
                '            break',
                '    return max(win_counts, key=win_counts.get)'
            ].join('\n')
        },
        iteration: 1,
        response: {
            ok: true,
            status: 'completed',
            result: {
                content: [{ type: 'text', text: 'Best ball: 1' }]
            }
        }
    });
    const evidenceRef = stepResult.evidenceArtifacts[0].id;
    const message = [
        'At each stage of the game, one of three pistons will randomly fire.',
        'Balls advance on a platform and ramp after each firing.',
        'Which ball should you choose to maximize your odds of winning?'
    ].join(' ');

    const rejected = validateExactAnswerSubmission({
        decision: {
            exactAnswerSubmission: normalizeExactAnswerSubmission({
                answer: '1',
                confidence: 'high',
                evidence_refs: [evidenceRef],
                reason: 'simulation says ball 1 is best'
            })
        },
        stepResults: [stepResult],
        message
    });

    assert.equal(rejected.ok, false);
    assert.ok(rejected.errors.includes('incomplete_process_simulation_evidence'));
    assert.match(rejected.incompleteSimulation.instruction, /full state transition loop/i);
});

test('Agent exact-answer gate rejects Monte Carlo-only evidence for finite stochastic exact-answer tasks', () => {
    const stepResult = attachAgentEvidenceArtifacts({
        id: 'step-monte-carlo',
        title: 'Run stochastic simulation',
        tool: 'mcp__ailis_research__run_python_file',
        args: {
            code: [
                'import random',
                'from collections import defaultdict',
                'SIM_COUNT = 20000',
                'def simulate_one_game():',
                '    ramp = list(range(1, 101))',
                '    platform = ramp[:3]',
                '    ramp = ramp[3:]',
                '    ejected = []',
                '    while len(ejected) < 100 and len(platform) > 0:',
                '        piston = random.randint(0, 2)',
                '        ejected.append(platform[piston])',
                '        platform = platform[1:]',
                '        if ramp:',
                '            platform.append(ramp.pop(0))',
                '    return ejected',
                'counts = defaultdict(int)',
                'for _ in range(SIM_COUNT):',
                '    for num in simulate_one_game():',
                '        counts[num] += 1',
                'print(max(counts, key=counts.get))'
            ].join('\n')
        },
        iteration: 1,
        response: {
            ok: true,
            status: 'completed',
            result: {
                content: [{ type: 'text', text: '100' }]
            }
        }
    });
    const evidenceRef = stepResult.evidenceArtifacts[0].id;

    const rejected = validateExactAnswerSubmission({
        decision: {
            exactAnswerSubmission: normalizeExactAnswerSubmission({
                answer: '100',
                confidence: 'high',
                evidence_refs: [evidenceRef],
                reason: 'Monte Carlo simulation says 100 has the highest win probability.'
            })
        },
        stepResults: [stepResult],
        message: 'At each stage one piston randomly fires. Which ball should you choose to maximize your odds of winning?'
    });

    assert.equal(rejected.ok, false);
    assert.ok(rejected.errors.includes('monte_carlo_only_random_process_evidence'));
    assert.match(rejected.incompleteSimulation.instruction, /exact state transition/i);
});

test('Agent exact-answer gate rejects ad hoc terminal probabilities in stochastic process code', () => {
    const stepResult = attachAgentEvidenceArtifacts({
        id: 'step-ad-hoc-terminal',
        title: 'Run DP',
        tool: 'mcp__ailis_research__run_python_file',
        args: {
            code: [
                'from collections import defaultdict',
                'prob = defaultdict(float)',
                'if idx + 1 < total_balls:',
                '    new_prob[state] += p / 3',
                'elif idx < total_balls:',
                '    # guessed terminal split for remaining platform',
                '    win_counts[c] += p / 3 * 0.5',
                '    win_counts[idx + 1] += p / 3 * 0.5'
            ].join('\n')
        },
        iteration: 1,
        response: {
            ok: true,
            status: 'completed',
            result: {
                content: [{ type: 'text', text: '98' }]
            }
        }
    });
    const evidenceRef = stepResult.evidenceArtifacts[0].id;

    const rejected = validateExactAnswerSubmission({
        decision: {
            exactAnswerSubmission: normalizeExactAnswerSubmission({
                answer: '98',
                confidence: 'high',
                evidence_refs: [evidenceRef],
                reason: 'DP with terminal split says 98.'
            })
        },
        stepResults: [stepResult],
        message: 'At each stage one random piston fires. Which ball maximizes your odds of winning?'
    });

    assert.equal(rejected.ok, false);
    assert.ok(rejected.errors.includes('ad_hoc_terminal_transition_evidence'));
    assert.match(rejected.incompleteSimulation.instruction, /terminal\/partial-state probabilities/i);
});
