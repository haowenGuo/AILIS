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
    buildToolObservationDigest,
    buildLosslessToolObservationDigest,
    buildTaskRunHandoffPackage,
    buildAgentDecisionLowLatencyPayload,
    buildTaskAgentFinalizationContext,
    collectExplicitAnswerCandidatesFromStepResult,
    mergeAnswerCandidateLedger,
    selectBestAnswerCandidate,
    hasCompleteToolObservationForFinalization,
    resolvePostToolFinalizationDecisionTimeoutMs,
    buildExactAnswerRecoveryToolAffordanceNote,
    canStartExactAnswerAuditRecovery,
    isExactAnswerExecutionMode,
    isAgentDecisionDeepThinkingMode,
    isDeepThinkingAgentDecisionModel,
    looksLikeSelfContainedExactAnswerQuestion,
    normalizeExactAnswerSubmission,
    resolveExactAnswerAuditFinalizationIteration,
    resolveAgentDirectToolChoice,
    resolveAgentDecisionSettings,
    resolveAgentDecisionTimeoutMs,
    resolveParallelToolCalls,
    prioritizeExactAnswerRecoveryToolSpecs,
    sanitizeAgentToolCall,
    selectExactAnswerAuditRecoveryGap,
    detectNestedSelectorSelectionGap,
    detectSelectorMetricEvidenceGap,
    detectSelectorTerminalRelationEvidenceGap,
    detectSelectorTerminalRelationAnswerMismatch,
    detectVisualEnumerationEvidenceGap,
    detectAnswerSpecificityEvidenceGap,
    detectCompleteTitleEvidenceGap,
    detectRecordSelectorConjunctionEvidenceGap,
    detectStructuredAttachmentSemanticEvidenceGap,
    detectStructuredRelationRecoveryCallGap,
    detectVacuousDistributionConstraintGap,
    detectRecommendedRecoveryActionGap,
    validateExactAnswerSubmission,
    validateNativeDirectToolCall
} = require('../electron/ailis-agent-runner.cjs');

test('Agent execution flow detects exact-answer evaluation mode', () => {
    assert.equal(isExactAnswerExecutionMode({}, { answerOnly: true }), true);
    assert.equal(isExactAnswerExecutionMode({}, { exactAnswerMode: true }), true);
    assert.equal(isExactAnswerExecutionMode({ exact_answer_mode: true }, {}), true);
    assert.equal(isExactAnswerExecutionMode({}, { executionProfile: { kind: 'exact_answer_eval' } }), true);
    assert.equal(isExactAnswerExecutionMode({}, { evaluationTaskId: 'gaia-task' }), true);
    assert.equal(isExactAnswerExecutionMode({}, {}), false);
});

test('Agent direct tool specs inject native final_answer for exact-answer mode but not ordinary tasks', () => {
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
    assert.equal(exactSpecs.at(-1).name, 'final_answer');
    assert.ok(exactSpecs.some((spec) => spec.name === 'tool_search'));

    const ordinarySpecs = buildAgentDirectToolSpecs(gateway, {
        requestContext: {},
        exactAnswerMode: false
    });
    assert.equal(ordinarySpecs.some((spec) => spec.name === 'final_answer'), false);

    const recoverySpecs = buildAgentDirectToolSpecs(gateway, {
        requestContext: {},
        exactAnswerMode: true,
        suppressFinalAnswer: true
    });
    assert.equal(recoverySpecs.some((spec) => spec.name === 'final_answer'), false);
    assert.ok(recoverySpecs.some((spec) => spec.name === 'tool_search'));
    assert.equal(resolveAgentDirectToolChoice({
        directToolSpecs: recoverySpecs,
        requireToolAction: true
    }), 'required');
});

test('Agent direct tool specs expose registered tools consistently for artifact tasks', () => {
    const spec = (name) => ({
        name,
        description: `${name} spec`,
        parameters: {
            type: 'object',
            additionalProperties: true,
            properties: {}
        }
    });
    const gateway = {
        gatewayToolRuntimeRegistry: {
            modelVisibleSpecs: () => [
                spec('artifact_tools'),
                spec('tool_search'),
                spec('update_plan'),
                spec('request_permissions'),
                spec('artifact_query'),
                spec('artifact_import'),
                spec('mcp__ailis_research__read_spreadsheet')
            ],
            definition: (toolId) => (toolId === 'artifact_tools' ? { spec: spec('artifact_tools') } : null)
        }
    };

    const specs = buildAgentDirectToolSpecs(gateway, {
        requestContext: { taskCompactPrompt: true },
        exactAnswerMode: false
    });
    const names = specs.map((entry) => entry.name);

    assert.ok(names.includes('artifact_tools'));
    assert.equal(names.includes('final_answer'), false);
    assert.ok(names.includes('request_permissions'));
    assert.ok(names.includes('tool_search'));
    assert.ok(names.includes('update_plan'));
    assert.ok(names.includes('artifact_query'));
    assert.ok(names.includes('artifact_import'));
    assert.equal(names.includes('artifact_compute'), false);
    assert.ok(names.includes('mcp__ailis_research__read_spreadsheet'));
});

test('Agent direct tool specs keep artifact tools available without forcing final_answer after query evidence', () => {
    const spec = (name) => ({
        name,
        description: `${name} spec`,
        parameters: {
            type: 'object',
            additionalProperties: true,
            properties: {}
        }
    });
    const gateway = {
        gatewayToolRuntimeRegistry: {
            modelVisibleSpecs: () => [
                spec('artifact_tools'),
                spec('exec'),
                spec('read'),
                spec('write'),
                spec('apply_patch'),
                spec('request_permissions')
            ],
            definition: (toolId) => (toolId === 'artifact_tools' ? { spec: spec('artifact_tools') } : null)
        }
    };
    const stepResults = [{
        id: 'query-grid',
        tool: 'artifact_tools',
        args: { action: 'query', sessionId: 'arts_fixture', sheet: 'Sheet1', range: 'A1:I20' },
        response: {
            ok: true,
            status: 'completed',
            result: {
                content: [{
                    type: 'text',
                    text: JSON.stringify({
                        ok: true,
                        status: 'completed',
                        action: 'query',
                        observation: {
                            action: 'query',
                            sheetName: 'Sheet1',
                            range: 'Sheet1!A1:I20',
                            rowCount: 2,
                            columnCount: 2,
                            truncated: false,
                            compactRows: [
                                { rowNumber: 1, cells: 'START | #0099FF' },
                                { rowNumber: 2, cells: '#92D050 | END' }
                            ]
                        }
                    })
                }]
            }
        }
    }];

    const specs = buildAgentDirectToolSpecs(gateway, {
        stepResults,
        requestContext: { taskCompactPrompt: true },
        exactAnswerMode: false
    });
    const names = specs.map((entry) => entry.name);

    assert.equal(names.includes('final_answer'), false);
    assert.ok(names.includes('artifact_tools'));
    assert.ok(names.includes('exec'));
});

test('Agent direct tool specs keep artifact tools available without forcing final_answer after range inspect evidence', () => {
    const spec = (name) => ({
        name,
        description: `${name} spec`,
        parameters: {
            type: 'object',
            additionalProperties: true,
            properties: {}
        }
    });
    const gateway = {
        gatewayToolRuntimeRegistry: {
            modelVisibleSpecs: () => [
                spec('artifact_tools'),
                spec('exec'),
                spec('read'),
                spec('write'),
                spec('apply_patch'),
                spec('request_permissions')
            ],
            definition: (toolId) => (toolId === 'artifact_tools' ? { spec: spec('artifact_tools') } : null)
        }
    };
    const stepResults = [{
        id: 'inspect-grid',
        tool: 'artifact_tools',
        args: { action: 'inspect', sessionId: 'arts_fixture', sheet: 'Sheet1', range: 'A1:I20' },
        response: {
            ok: true,
            status: 'completed',
            result: {
                content: [{
                    type: 'text',
                    text: JSON.stringify({
                        ok: true,
                        status: 'completed',
                        action: 'inspect',
                        observation: {
                            action: 'inspect',
                            kind: 'range',
                            sheetName: 'Sheet1',
                            range: 'Sheet1!A1:I20',
                            rowCount: 2,
                            columnCount: 2,
                            truncated: false,
                            matrixRows: [
                                { rowNumber: 1, values: ['START', ''], fills: ['', '0099FF'] },
                                { rowNumber: 2, values: ['', 'END'], fills: ['92D050', ''] }
                            ]
                        }
                    })
                }]
            }
        }
    }];

    const specs = buildAgentDirectToolSpecs(gateway, {
        stepResults,
        requestContext: { taskCompactPrompt: true },
        exactAnswerMode: false
    });
    const names = specs.map((entry) => entry.name);

    assert.equal(names.includes('final_answer'), false);
    assert.ok(names.includes('artifact_tools'));
    assert.ok(names.includes('exec'));
});

test('Agent decision timeout gives artifact and exact-answer tasks a 300s budget', () => {
    assert.equal(resolveAgentDecisionTimeoutMs({}, {}), 120000);
    assert.equal(resolveAgentDecisionTimeoutMs({}, {
        requestContext: { taskCompactPrompt: true }
    }), 300000);
    assert.equal(resolveAgentDecisionTimeoutMs({}, {
        requestContext: { exactAnswerMode: true }
    }), 300000);
    assert.equal(resolveAgentDecisionTimeoutMs({}, {
        stepResults: [{ tool: 'artifact_tools', response: { ok: true } }]
    }), 300000);
});

test('Answer candidate ledger preserves only explicit structured tool candidates', () => {
    const stepResult = {
        id: 'presentation-result',
        iteration: 3,
        tool: 'mcp__ailis_research__read_presentation',
        response: {
            ok: true,
            status: 'completed',
            result: {
                content: [{
                    type: 'text',
                    text: JSON.stringify({ answerCandidates: [{ answer: 'text-only-decoy' }] })
                }],
                structuredContent: {
                    answerCandidates: [{ answer: 'alternate candidate', score: 61 }],
                    bestAnswerCandidate: {
                        answer: '4',
                        finalizable: true,
                        confidence: 0.94,
                        evidenceRefs: ['artifact-presentation']
                    },
                    unrelated: { answer: 'must-not-be-collected' }
                }
            }
        }
    };

    const candidates = collectExplicitAnswerCandidatesFromStepResult(stepResult);
    assert.deepEqual(candidates.map((candidate) => candidate.answer).sort(), ['4', 'alternate candidate']);
    assert.equal(candidates.some((candidate) => candidate.answer === 'text-only-decoy'), false);
    assert.equal(candidates.some((candidate) => candidate.answer === 'must-not-be-collected'), false);
    const best = selectBestAnswerCandidate(candidates, { requireFinalizable: true });
    assert.equal(best.answer, '4');
    assert.equal(best.selected, true);
    assert.equal(best.finalizable, true);
    assert.deepEqual(best.evidenceRefs, ['artifact-presentation']);

    const tentative = collectExplicitAnswerCandidatesFromStepResult({
        ...stepResult,
        response: {
            ...stepResult.response,
            result: { structuredContent: { bestAnswerCandidate: { answer: 'tentative' } } }
        }
    });
    assert.equal(selectBestAnswerCandidate(tentative)?.answer, 'tentative');
    assert.equal(selectBestAnswerCandidate(tentative, { requireFinalizable: true }), null);
});

test('Answer candidate ledger keeps model decisions authoritative over tool rankings', () => {
    const ledger = mergeAnswerCandidateLedger([], [{
        answer: 'tool candidate',
        source: 'tool_explicit_candidate',
        kind: 'best',
        selected: true,
        finalizable: true,
        iteration: 4
    }, {
        answer: 'model candidate',
        source: 'model_submission',
        kind: 'model_final',
        selected: true,
        finalizable: true,
        iteration: 2
    }]);

    assert.equal(selectBestAnswerCandidate(ledger).answer, 'model candidate');
});

test('Answer candidate ledger retains an early final answer when later tentative candidates exceed its limit', () => {
    const ledger = mergeAnswerCandidateLedger([], [{
        answer: 'preserved final answer',
        source: 'model_submission',
        kind: 'model_final',
        selected: true,
        finalizable: true,
        iteration: 1
    }, ...Array.from({ length: 40 }, (_, index) => ({
        answer: `tentative candidate ${index + 1}`,
        source: 'tool_explicit_candidate',
        sourceTool: 'example_tool',
        kind: 'ranked',
        iteration: index + 2
    }))]);

    assert.equal(ledger.length, 32);
    assert.equal(ledger.some((candidate) => candidate.answer === 'preserved final answer'), true);
    assert.equal(selectBestAnswerCandidate(ledger, { requireFinalizable: true }).answer, 'preserved final answer');
});

test('Completed-with-warnings handoff returns a preserved answer instead of failure prose', () => {
    const candidate = {
        answer: '4',
        source: 'model_submission',
        kind: 'model_final',
        selected: true,
        finalizable: true,
        evidenceRefs: ['artifact-presentation']
    };
    const handoff = buildTaskRunHandoffPackage({
        status: 'completed_with_warnings',
        reason: 'provider_timeout_after_candidate',
        finalAnswer: '4',
        answerCandidates: [candidate],
        bestAnswerCandidate: candidate
    });

    assert.equal(handoff.ok, true);
    assert.equal(handoff.userVisibleSummary, '4');
    assert.equal(handoff.bestAnswerCandidate.answer, '4');
});

test('Complete untruncated tool observations reserve a bounded exact-answer finalization window', () => {
    const stepResults = [{
        id: 'read-presentation',
        tool: 'mcp__ailis_research__read_presentation',
        response: {
            ok: true,
            status: 'completed',
            result: {
                structuredContent: {
                    observationContract: {
                        complete: true,
                        truncated: false,
                        coverage: { totalSlides: 8, returnedSlides: 8 }
                    }
                }
            }
        }
    }];

    assert.equal(hasCompleteToolObservationForFinalization(stepResults), true);
    assert.equal(resolvePostToolFinalizationDecisionTimeoutMs(300000, {
        exactAnswerMode: true,
        stepResults,
        requestContext: {}
    }), 120000);
    assert.equal(resolvePostToolFinalizationDecisionTimeoutMs(300000, {
        exactAnswerMode: true,
        stepResults,
        requestContext: { postToolFinalizationTimeoutMs: 45000 }
    }), 45000);
    assert.equal(resolvePostToolFinalizationDecisionTimeoutMs(300000, {
        exactAnswerMode: false,
        stepResults,
        requestContext: {}
    }), 300000);
    assert.equal(resolvePostToolFinalizationDecisionTimeoutMs(300000, {
        exactAnswerMode: true,
        stepResults: [{
            ...stepResults[0],
            response: {
                ...stepResults[0].response,
                result: { structuredContent: { observationContract: { complete: false } } }
            }
        }],
        requestContext: {}
    }), 300000);
});

test('Agent decision model routing avoids deep-thinking models unless explicit or unavoidable', () => {
    assert.equal(isDeepThinkingAgentDecisionModel('deepseek-reasoner'), true);
    assert.equal(isDeepThinkingAgentDecisionModel('doubao-seed-1-6-thinking-250715'), true);
    assert.equal(isDeepThinkingAgentDecisionModel('openai/o4-mini'), true);
    assert.equal(isDeepThinkingAgentDecisionModel('kimi-k2.7-code'), true);
    assert.equal(isDeepThinkingAgentDecisionModel('deepseek-chat'), false);

    assert.deepEqual(
        {
            model: resolveAgentDecisionSettings({
                model: 'deepseek-reasoner',
                lowLatencyModel: 'deepseek-chat'
            }).model,
            source: resolveAgentDecisionSettings({
                model: 'deepseek-reasoner',
                lowLatencyModel: 'deepseek-chat'
            })._agentDecisionModelSource
        },
        { model: 'deepseek-chat', source: 'settings.lowLatencyModel' }
    );

    const explicitReasoner = resolveAgentDecisionSettings({
        model: 'deepseek-chat',
        agentDecisionModel: 'o4-mini'
    });
    assert.equal(explicitReasoner.model, 'o4-mini');
    assert.equal(explicitReasoner._agentDecisionModelExplicit, true);
    assert.equal(explicitReasoner._agentDecisionDeepThinkingModel, true);
});

test('Agent decision parallel tool calls follow provider capability with explicit overrides', () => {
    assert.equal(resolveParallelToolCalls({ provider: 'deepseek', model: 'deepseek-chat' }, {}), true);
    assert.equal(resolveParallelToolCalls({ provider: 'doubao', model: 'doubao-seed-1-6' }, {}), true);
    assert.equal(resolveParallelToolCalls({ provider: 'ollama', model: 'llama3.2' }, {}), false);
    assert.equal(resolveParallelToolCalls({ provider: 'ollama', model: 'llama3.2' }, { parallelToolCalls: true }), true);
    assert.equal(resolveParallelToolCalls({ provider: 'deepseek', model: 'deepseek-chat' }, { disableParallelToolCalls: true }), false);

    const payload = buildAgentDecisionLowLatencyPayload(
        { messages: [] },
        {
            settings: { provider: 'deepseek', model: 'deepseek-chat' },
            requestContext: {}
        }
    );
    assert.equal(payload.parallel_tool_calls, true);
});

test('Agent decision thinking controls are explicit and deep-thinking mode gets a 10 minute timeout', () => {
    const ordinaryPayload = buildAgentDecisionLowLatencyPayload(
        { messages: [] },
        {
            settings: {
                model: 'deepseek-chat',
                reasoningEffort: 'high',
                thinking: { type: 'enabled' }
            },
            requestContext: {}
        }
    );
    assert.equal(Object.hasOwn(ordinaryPayload, 'reasoning_effort'), false);
    assert.equal(Object.hasOwn(ordinaryPayload, 'thinking'), false);
    assert.equal(isAgentDecisionDeepThinkingMode({ model: 'deepseek-chat' }, {}), false);

    const explicitPayload = buildAgentDecisionLowLatencyPayload(
        { messages: [] },
        {
            settings: {
                model: 'deepseek-chat',
                agentDecisionReasoningEffort: 'high',
                agentDecisionThinking: { type: 'enabled' }
            },
            requestContext: {}
        }
    );
    assert.equal(explicitPayload.reasoning_effort, 'high');
    assert.deepEqual(explicitPayload.thinking, { type: 'enabled' });
    assert.equal(
        resolveAgentDecisionTimeoutMs({
            model: 'deepseek-chat',
            agentDecisionReasoningEffort: 'high'
        }, {}),
        600000
    );
    assert.equal(resolveAgentDecisionTimeoutMs({ model: 'o3' }, {}), 600000);
});

test('final_answer contract reminds relation tasks to verify answer role alignment', () => {
    const spec = buildFinalAnswerNativeToolSpec();
    assert.match(spec.description, /role alignment/);
    assert.match(spec.description, /QuestionEvidence\/source_question/);
    assert.match(spec.description, /candidate set/);
    assert.match(spec.description, /partial viewport/);
    assert.match(spec.parameters.properties.reason.description, /target role/);
    assert.match(spec.parameters.properties.reason.description, /relation table direction/);
    assert.match(spec.parameters.properties.reason.description, /candidate-set boundary/);
});

test('final_answer native tool contract keeps answer required but does not hard-gate audit metadata', () => {
    const spec = buildFinalAnswerNativeToolSpec();
    assert.deepEqual(spec.parameters.required, ['answer']);
    assert.equal(spec.parameters.additionalProperties, true);
    assert.equal(Object.hasOwn(spec.parameters.properties.confidence, 'enum'), false);
    assert.equal(Object.hasOwn(spec.parameters.properties.evidence_refs, 'minItems'), false);

    const lowConfidenceToolCall = {
        name: 'final_answer',
        arguments: {
            answer: 'I need to first inspect the Excel file to understand the map layout.',
            confidence: 'low',
            evidence_refs: [],
            repair_instruction: 'Need to inspect the Excel file first.'
        }
    };
    const validation = validateNativeDirectToolCall(lowConfidenceToolCall, [spec]);

    assert.equal(validation.ok, true);
    assert.deepEqual(validation.errors, []);
});

test('Agent tool-call sanitizer does not maintain a hardcoded runtime tool whitelist', () => {
    const futureToolCall = sanitizeAgentToolCall({
        tool_call: {
            tool: 'future_runtime_tool',
            title: 'Use future tool',
            args: {
                example: true
            }
        }
    }, 0);

    assert.equal(futureToolCall.tool, 'future_runtime_tool');
    assert.equal(futureToolCall.args.example, true);

    const githubPagesCall = sanitizeAgentToolCall({
        tool: 'github_pages',
        args: {
            action: 'diagnose_publish',
            path: '.'
        }
    }, 1);

    assert.equal(githubPagesCall.tool, 'github_pages');
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
    assert.equal(sufficiency.status, 'model_judges_evidence');
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
    assert.equal(sufficiency.status, 'model_judges_evidence');
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
    assert.equal(sufficiency.status, 'model_judges_evidence');
    assert.equal(sufficiency.ready, true);
    assert.equal(sufficiency.ready_evidence_count, 1);
    assert.equal(sufficiency.audit_required, false);
    assert.equal(sufficiency.evidence_audit_candidates.length, 1);
    assert.equal(sufficiency.evidence_audit_candidates[0].tool, 'mcp__ailis_research__web_fetch');
    assert.equal(sufficiency.evidence_audit_contract, null);
    assert.equal(sufficiency.ready_evidence[0].tool, 'mcp__ailis_research__web_fetch');
    assert.equal(sufficiency.ready_evidence[0].coverage.reasoningReady, true);
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

test('Agent registers deterministic table aggregation as ComputationEvidence without making it a finalization gate', () => {
    const stepResult = attachAgentEvidenceArtifacts({
        id: 'step-aggregate',
        title: 'Aggregate workbook revenue',
        tool: 'artifact_tools',
        args: {
            action: 'aggregate',
            path: 'sales.xlsx',
            table: 'SalesTable',
            aggregate: { op: 'sum', column: 'Revenue' }
        },
        response: {
            ok: true,
            status: 'completed',
            result: {
                content: [{ type: 'text', text: '{"aggregateResult":{"value":91}}' }],
                structuredContent: {
                    query: {
                        filter: null,
                        groupBy: '',
                        aggregateResult: {
                            op: 'sum',
                            column: 'Revenue',
                            value: 91,
                            rowCount: 3,
                            numericCount: 3
                        },
                        observation: {
                            semanticLevel: 'computation',
                            complete: true,
                            truncated: false,
                            computation: {
                                deterministic: true,
                                operation: 'sum',
                                column: 'Revenue',
                                value: 91,
                                rowCount: 3,
                                numericCount: 3,
                                source: {
                                    path: 'sales.xlsx',
                                    table: 'SalesTable',
                                    sheet: 'Data',
                                    range: 'A1:D4'
                                }
                            }
                        }
                    }
                },
                details: {
                    status: 'completed',
                    complete: true,
                    truncated: false,
                    observationContract: {
                        status: 'completed',
                        semantic_level: 'computation',
                        complete: true,
                        truncated: false
                    }
                }
            }
        }
    });

    assert.equal(stepResult.evidenceArtifacts.length, 1);
    assert.equal(stepResult.evidenceArtifacts[0].type, 'ComputationEvidence');
    assert.equal(stepResult.evidenceArtifacts[0].payload.deterministic, true);
    assert.equal(stepResult.evidenceArtifacts[0].payload.operation, 'sum');
    assert.equal(stepResult.evidenceArtifacts[0].payload.result, 91);
    assert.equal(stepResult.evidenceArtifacts[0].payload.source.table, 'SalesTable');

    const sufficiency = buildEvidenceSufficiencyPromptObject([stepResult], { exactAnswerMode: true });
    assert.equal(sufficiency.has_compute_evidence, true);
    assert.match(sufficiency.computation_guidance, /advisory/i);
    assert.match(sufficiency.computation_guidance, /must never suppress/i);
});

test('Research source evidence does not infer local paths from URL markup or prose', () => {
    const stepResult = attachAgentEvidenceArtifacts({
        id: 'step-web-source',
        title: 'Open research source',
        tool: 'web_run',
        args: {
            open: [{ ref_id: 'turn0search1' }]
        },
        iteration: 1,
        response: {
            ok: true,
            status: 'completed',
            result: {
                content: [{
                    type: 'text',
                    text: [
                        '<truncated omitted_approx_tokens="521" />',
                        'URL: https://journal.finfar.org/articles/dragons-are-tricksy/',
                        'Retry without optional recency/domain filters.'
                    ].join('\n')
                }]
            }
        }
    });

    const artifact = stepResult.evidenceArtifacts[0];
    assert.equal(artifact.type, 'ResearchSourceEvidence');
    assert.equal(artifact.payload.sourceKind, 'url');
    assert.equal(artifact.payload.url, 'https://journal.finfar.org/articles/dragons-are-tricksy/');
    assert.equal(artifact.payload.path, '');
});

test('Research source evidence does not infer a Windows path from escaped output text', () => {
    const stepResult = attachAgentEvidenceArtifacts({
        id: 'step-chess-analysis',
        title: 'mcp__ailis_research__chess_position_analyze',
        tool: 'mcp__ailis_research__chess_position_analyze',
        args: {
            fen: '3r2k1/pp3pp1/4b2p/7Q/3n4/PqBBR2P/5PP1/6K1 b - - 0 1'
        },
        iteration: 1,
        response: {
            ok: true,
            status: 'completed',
            result: {
                content: [{
                    type: 'text',
                    text: [
                        'Status: completed',
                        'Output:\\nbest_move_san=Rd5',
                        'board_echo:\\n   +------------------------+'
                    ].join('\n')
                }]
            }
        }
    });

    const artifact = stepResult.evidenceArtifacts[0];
    assert.equal(artifact.type, 'ResearchSourceEvidence');
    assert.equal(artifact.payload.sourceKind, 'observation');
    assert.equal(artifact.payload.path, '');
});

test('Agent tool observations keep small artifact query compactRows lossless', () => {
    const rows = Array.from({ length: 20 }, (_, index) => ({
        rowNumber: index + 1,
        cells: index === 0
            ? 'START | #0099FF | #0099FF | #0099FF | #0099FF | #0099FF | #0099FF | #0099FF | #0099FF'
            : (index === 19
                ? '#0099FF | #0099FF | #0099FF | #0099FF | #0099FF | #0099FF | #0099FF | #92D050 | END'
                : `#F478A7 | #0099FF | #0099FF | #0099FF | #F478A7 | #FFFF00 | #92D050 | #92D050 | #0099FF row-${index + 1}`)
    }));
    const artifactText = JSON.stringify({
        schema: 'ailis.artifact_tools.tool_api_result.v1',
        ok: true,
        status: 'completed',
        action: 'query',
        adapterId: 'xlsx',
        artifact: {
            sessionId: 'arts_fixture',
            artifactId: 'art_fixture',
            format: 'xlsx',
            kind: 'workbook'
        },
        observation: {
            schema: 'ailis.artifact_tools.compact_observation.v1',
            format: 'xlsx',
            action: 'query',
            sheetName: 'Sheet1',
            range: 'Sheet1!A1:I20',
            requestedRange: 'Sheet1!A1:I20',
            usedRange: 'Sheet1!A1:I20',
            returnedRange: 'Sheet1!A1:I20',
            rowCount: 20,
            columnCount: 9,
            truncated: false,
            columns: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'],
            compactRows: rows,
            candidateCount: rows.length,
            diagnostics: [],
            nextActions: []
        }
    }, null, 2);
    assert.ok(artifactText.length < 12000);

    const digest = buildToolObservationDigest([{
        id: 'artifact-query',
        title: 'artifact_tools',
        tool: 'artifact_tools',
        args: { action: 'query', sessionId: 'arts_fixture', include: ['values', 'fills'] },
        response: {
            ok: true,
            status: 'completed',
            result: {
                content: [{ type: 'text', text: artifactText }]
            }
        }
    }]);

    assert.equal(digest.length, 1);
    assert.equal(digest[0].lossless, true);
    assert.equal(digest[0].text, artifactText);
    assert.equal(digest[0].compression, null);
    assert.match(digest[0].text, /START/);
    assert.match(digest[0].text, /rowNumber": 11/);
    assert.match(digest[0].text, /END/);
    assert.doesNotMatch(digest[0].text, /truncated for model budget/);
});

test('Agent tool observations compress large artifact query results by row window without next-step hints', () => {
    const rows = Array.from({ length: 220 }, (_, index) => ({
        rowNumber: index + 1,
        cells: `R${index + 1}C1 | R${index + 1}C2 | R${index + 1}C3 | #${String(index).padStart(6, '0')}`
    }));
    const artifactText = JSON.stringify({
        schema: 'ailis.artifact_tools.tool_api_result.v1',
        ok: true,
        status: 'completed',
        action: 'query',
        adapterId: 'xlsx',
        artifact: {
            sessionId: 'arts_big',
            artifactId: 'art_big',
            format: 'xlsx',
            kind: 'workbook'
        },
        observation: {
            schema: 'ailis.artifact_tools.compact_observation.v1',
            format: 'xlsx',
            action: 'query',
            sheetName: 'Map',
            range: 'Map!A1:D220',
            requestedRange: 'Map!A1:D220',
            usedRange: 'Map!A1:D220',
            returnedRange: 'Map!A1:D220',
            rowCount: 220,
            columnCount: 4,
            truncated: false,
            columns: ['A', 'B', 'C', 'D'],
            compactRows: rows,
            candidateCount: rows.length,
            diagnostics: [],
            nextActions: []
        }
    }, null, 2);
    assert.ok(artifactText.length > 12000);

    const digest = buildToolObservationDigest([{
        id: 'artifact-query-big',
        title: 'artifact_tools',
        tool: 'artifact_tools',
        args: { action: 'query', sessionId: 'arts_big', include: ['values', 'fills'] },
        response: {
            ok: true,
            status: 'completed',
            result: {
                content: [{ type: 'text', text: artifactText }]
            }
        }
    }]);

    const parsed = JSON.parse(digest[0].text);
    assert.equal(digest[0].lossless, false);
    assert.equal(digest[0].compression.reason, 'artifact_tool_observation_exceeded_prompt_budget');
    assert.equal(parsed.observation.promptCompression.lossless, false);
    assert.equal(parsed.observation.promptCompression.visibleRowStrategy, 'head_tail_rows');
    assert.ok(parsed.observation.promptCompression.omittedCompactRowCount > 0);
    assert.equal(parsed.observation.continuation, undefined);
    assert.ok(parsed.observation.compactRows.every((row) => row.rowNumber && typeof row.cells === 'string'));
    assert.doesNotMatch(digest[0].text, /truncated for model budget/);
});

test('Agent model-facing observation digest summarizes large tool args', () => {
    const script = 'print("solver")\n'.repeat(1200);
    const stepResult = {
        id: 'step-write',
        title: 'Write solver script',
        tool: 'write',
        args: {
            path: 'solve_puzzle.py',
            content: script
        },
        response: {
            ok: true,
            status: 'completed',
            result: {
                content: [{ type: 'text', text: 'Wrote solve_puzzle.py' }]
            }
        }
    };

    const digest = buildLosslessToolObservationDigest([stepResult]);
    assert.equal(digest.length, 1);
    assert.equal(digest[0].args.path, 'solve_puzzle.py');
    assert.equal(digest[0].args.content.omitted, true);
    assert.equal(digest[0].args.content.chars, script.length);
    assert.match(digest[0].args.content.sha1, /^[a-f0-9]{12}$/);
    assert.ok(JSON.stringify(digest).length < 1800);
    assert.doesNotMatch(JSON.stringify(digest), /solver"\)\nprint\("solver"\)\nprint\("solver/);
});

test('TaskAgent finalization keeps recent observations high fidelity instead of flattening all work rounds', () => {
    const stepResults = Array.from({ length: 8 }, (_, index) => ({
        id: `step-${index + 1}`,
        title: `Evidence step ${index + 1}`,
        tool: index === 5
            ? 'mcp__ailis_research__open_page'
            : index === 7
                ? 'mcp__ailis_research__open_page'
                : 'web_fetch',
        args: {
            query: `evidence query ${index + 1}`,
            context: `argument filler ${index + 1} `.repeat(80)
        },
        response: {
            ok: true,
            status: 'completed',
            result: {
                content: [{
                    type: 'text',
                    text: index === 1
                        ? `stale_early_guess=2821\n${'early evidence filler '.repeat(200)}`
                        : index === 5
                            ? `${'authoritative source prefix '.repeat(20)}bounded_count=2732 cutoff=2023-06-30\n${'authoritative source suffix '.repeat(70)}`
                        : index === 7
                            ? `${'late verification '.repeat(40)}source_complete=true\n${'late suffix '.repeat(30)}`
                            : `intermediate evidence ${index + 1}\n${'observation filler '.repeat(220)}`
                }]
            }
        }
    }));

    const defaultDigest = buildToolObservationDigest(stepResults);
    assert.deepEqual(defaultDigest.map((item) => item.id), [
        'step-5',
        'step-6',
        'step-7',
        'step-8'
    ]);

    const context = buildTaskAgentFinalizationContext({
        message: 'How many edits were made through June 2023?',
        stepResults,
        exactAnswerMode: true
    });

    assert.doesNotMatch(context, /"id": "step-[1-4]"/);
    for (let index = 5; index <= 8; index += 1) {
        assert.match(context, new RegExp(`"id": "step-${index}"`));
    }
    assert.match(context, /bounded_count=2732 cutoff=2023-06-30/);
    assert.doesNotMatch(context, /stale_early_guess=2821/);
    assert.match(context, /source_complete=true/);
    assert.ok(context.length <= 18000);
});

test('Agent exact-answer audit flags unknown evidence refs when evidence exists', () => {
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

    const degraded = validateExactAnswerSubmission({
        decision: {
            exactAnswerSubmission: normalizeExactAnswerSubmission({
                answer: 'BaseLabelPropagation',
                confidence: 'low',
                evidence_refs: ['artifact-missing']
            })
        },
        stepResults: [stepResult]
    });
    assert.equal(degraded.ok, true);
    assert.deepEqual(degraded.errors, []);
    assert.ok(degraded.warnings.includes('evidence_refs_unknown'));
    assert.deepEqual(degraded.unknownRefs, ['artifact-missing']);
});

test('Agent exact-answer audit requests comparable metrics for geographic selectors without blocking submission', () => {
    const message = 'Which two birthplace cities are farthest apart from the westernmost to the easternmost?';
    const unsupported = detectSelectorMetricEvidenceGap({
        message,
        submission: {
            answer: 'Honolulu, Quincy',
            reason: 'The complete birthplace table contains both cities, so they are the extrema.'
        }
    });
    assert.equal(unsupported.error, 'selector_metric_evidence_missing');
    assert.match(unsupported.instruction, /best available answer instead of returning an empty answer/i);
    assert.match(unsupported.instruction, /tool_search first and then call the discovered evidence tool/i);

    const audited = validateExactAnswerSubmission({
        message,
        decision: {
            exactAnswerSubmission: {
                answer: 'Braintree, Honolulu',
                confidence: 'high',
                reason: 'Honolulu has longitude -157.857 and Braintree has longitude -71.005; John Adams place_of_birth resolves to Braintree.'
            }
        },
        stepResults: []
    });
    assert.equal(audited.ok, true);
    assert.equal(audited.selectorMetricGap, null);
    assert.equal(audited.selectorTerminalRelationGap, null);
    assert.ok(!audited.warnings.includes('selector_metric_evidence_missing'));
});

test('Agent exact-answer audit accepts shallow structured coordinate rows as comparable selector metrics', () => {
    const audited = validateExactAnswerSubmission({
        message: 'Which birthplace cities are westernmost and easternmost?',
        decision: {
            exactAnswerSubmission: {
                answer: 'Braintree, Honolulu',
                reason: 'The source-entity birthplace relations resolve the terminal cities.'
            }
        },
        stepResults: [{
            tool: 'mcp__ailis_research__wikidata_entity_lookup',
            args: { queries: ['Honolulu', 'Braintree'], properties: ['coordinates'] },
            response: {
                ok: true,
                result: {
                    structuredContent: {
                        property_rows: [{
                            source_query: 'Honolulu',
                            match_rank: 0,
                            property: 'coordinates',
                            latitude: 21.3047,
                            longitude: -157.8572
                        }, {
                            source_query: 'Braintree',
                            match_rank: 0,
                            property: 'coordinates',
                            latitude: 42.206,
                            longitude: -71.005
                        }]
                    }
                }
            }
        }]
    });
    assert.equal(audited.selectorMetricGap, null);
    assert.ok(!audited.warnings.includes('selector_metric_evidence_missing'));
});

test('Agent exact-answer audit does not count one coordinate pair as two selector candidates', () => {
    const gap = detectSelectorMetricEvidenceGap({
        message: 'Which birthplace cities are westernmost and easternmost?',
        submission: {
            answer: 'Braintree, Honolulu',
            reason: 'The source table contains both labels.'
        },
        stepResults: [{
            tool: 'mcp__ailis_research__wikidata_entity_lookup',
            response: {
                ok: true,
                result: {
                    structuredContent: {
                        property_rows: [{
                            source_query: 'Honolulu',
                            match_rank: 0,
                            property: 'coordinates',
                            latitude: 21.3047,
                            longitude: -157.8572
                        }]
                    }
                }
            }
        }]
    });
    assert.equal(gap.error, 'selector_metric_evidence_missing');
    assert.equal(gap.comparableValues.length, 1);
});

test('Agent exact-answer audit separates geographic metrics from terminal relation verification', () => {
    const message = 'Of the cities where presidents were born, which are westernmost and easternmost?';
    const coordinateOnly = detectSelectorTerminalRelationEvidenceGap({
        message,
        submission: {
            answer: 'Honolulu, Quincy',
            reason: 'Honolulu is at longitude -157.857 and Quincy is at longitude -71.'
        },
        stepResults: [{
            tool: 'mcp__ailis_research__wikidata_entity_lookup',
            args: { properties: ['coordinates'] },
            response: { ok: true }
        }]
    });
    assert.equal(coordinateOnly.error, 'selector_terminal_relation_evidence_missing');
    assert.equal(coordinateOnly.relationProperty, 'place_of_birth');
    assert.match(coordinateOnly.instruction, /best available answer instead of returning an empty answer/i);

    const relationVerified = detectSelectorTerminalRelationEvidenceGap({
        message,
        submission: {
            answer: 'Braintree, Honolulu',
            reason: 'Coordinates establish the extrema.'
        },
        stepResults: [{
            tool: 'mcp__ailis_research__wikidata_entity_lookup',
            args: { properties: ['coordinates', 'place_of_birth'] },
            response: {
                ok: true,
                result: {
                    structuredContent: {
                        results: [{
                            matches: [{
                                properties: {
                                    place_of_birth: [{ label: 'Braintree' }]
                                }
                            }]
                        }]
                    }
                }
            }
        }]
    });
    assert.equal(relationVerified, null);
});

test('Agent exact-answer relation audit reads shallow property rows after deep MCP results are compacted', () => {
    const gap = detectSelectorTerminalRelationEvidenceGap({
        message: 'Of the cities where presidents were born, which are westernmost and easternmost?',
        submission: {
            answer: 'Honolulu, Quincy',
            reason: 'Honolulu has longitude -157.857 and Quincy has longitude -71.002.'
        },
        stepResults: [{
            tool: 'mcp__ailis_research__wikidata_entity_lookup',
            args: { properties: ['place_of_birth'] },
            response: {
                ok: true,
                result: {
                    structuredContent: {
                        property_rows: [
                            {
                                source_query: 'Barack Obama',
                                source_entity: 'Barack Obama',
                                match_rank: 0,
                                property: 'place_of_birth',
                                value_label: 'Kapiolani Medical Center for Women and Children',
                                value_description: 'hospital in Honolulu, Hawaii'
                            },
                            {
                                source_query: 'John Adams',
                                source_entity: 'John Adams',
                                match_rank: 0,
                                property: 'place_of_birth',
                                value_label: 'Braintree',
                                value_description: 'city in Massachusetts'
                            }
                        ],
                        results: [{
                            query: 'John Adams',
                            matches: '[deep result compacted]'
                        }]
                    }
                }
            }
        }]
    });
    assert.equal(gap.error, 'selector_terminal_relation_answer_mismatch');
    assert.deepEqual(gap.unmatchedLabels, ['Quincy']);
    assert.ok(gap.relationCandidates.includes('Braintree'));
});

test('Agent exact-answer relation audit flags a submitted modern label contradicted by its own historical-label rationale', () => {
    const gap = detectSelectorTerminalRelationEvidenceGap({
        message: 'Which two presidential birthplace cities are westernmost and easternmost?',
        submission: {
            answer: 'Honolulu, Quincy',
            reason: 'Honolulu is westernmost; Quincy, Massachusetts (the Adams birthplace, formerly Braintree) is easternmost.'
        },
        stepResults: []
    });
    assert.equal(gap.error, 'selector_terminal_period_label_conflict');
    assert.equal(gap.periodLabelConflict, 'Quincy');
    assert.match(gap.instruction, /rationale itself/i);
    assert.match(gap.instruction, /self-contradiction/i);

    const reverseGap = detectSelectorTerminalRelationEvidenceGap({
        message: 'Which two presidential birthplace cities are westernmost and easternmost?',
        submission: {
            answer: 'Honolulu, Quincy',
            reason: 'The presidents were born in the north precinct of Braintree, now Quincy, Massachusetts.'
        },
        stepResults: []
    });
    assert.equal(reverseGap.periodLabelConflict, 'Quincy');
    assert.equal(reverseGap.error, 'selector_terminal_period_label_conflict');
    assert.match(reverseGap.instruction, /tool_search first/i);
});

test('Agent exact-answer relation recovery diagnoses structured lookups that omit the relation field', () => {
    const recoveryGap = {
        error: 'selector_terminal_relation_evidence_missing',
        relationProperty: 'place_of_birth'
    };
    const omitted = detectStructuredRelationRecoveryCallGap({
        recoveryGap,
        toolCalls: [{
            tool: 'mcp__ailis_research__wikidata_entity_lookup',
            args: {
                queries: ['Quincy Massachusetts'],
                properties: ['coordinates']
            }
        }]
    });
    assert.equal(omitted.error, 'structured_relation_property_omitted');
    assert.match(omitted.instruction, /source entities, not the candidate answer locations/i);

    assert.equal(detectStructuredRelationRecoveryCallGap({
        recoveryGap,
        toolCalls: [{
            tool: 'mcp__ailis_research__wikidata_entity_lookup',
            args: {
                queries: ['John Adams', 'Barack Obama'],
                properties: ['place_of_birth']
            }
        }]
    }), null);
});

test('Agent exact-answer audit reserves bounded recovery and final submission rounds', () => {
    assert.equal(resolveExactAnswerAuditFinalizationIteration({
        currentFinalizationIteration: 8,
        baseFinalizationIteration: 8,
        auditIteration: 3,
        recoveryToolCalls: 2
    }), 8);
    assert.equal(resolveExactAnswerAuditFinalizationIteration({
        currentFinalizationIteration: 8,
        baseFinalizationIteration: 8,
        auditIteration: 7,
        recoveryToolCalls: 2
    }), 11);
    assert.equal(resolveExactAnswerAuditFinalizationIteration({
        currentFinalizationIteration: 11,
        baseFinalizationIteration: 8,
        auditIteration: 10,
        recoveryToolCalls: 2
    }), 14);
    assert.equal(resolveExactAnswerAuditFinalizationIteration({
        currentFinalizationIteration: 14,
        baseFinalizationIteration: 8,
        auditIteration: 14,
        recoveryToolCalls: 2
    }), 15);
    assert.equal(resolveExactAnswerAuditFinalizationIteration({
        currentFinalizationIteration: 14,
        baseFinalizationIteration: 8,
        auditIteration: 14,
        recoveryToolCalls: 0
    }), 15);
    assert.equal(resolveExactAnswerAuditFinalizationIteration({
        currentFinalizationIteration: 14,
        baseFinalizationIteration: 8,
        auditIteration: 14,
        recoveryToolCalls: 0,
        finalSubmissionReserve: 0
    }), 14);
});

test('Agent exact-answer audit advances to the next unattempted recovery gap', () => {
    const validation = {
        selectorMetricGap: { error: 'selector_metric_evidence_missing' },
        selectorTerminalRelationGap: { error: 'selector_terminal_relation_evidence_missing' }
    };
    assert.equal(
        selectExactAnswerAuditRecoveryGap(validation, new Set()).error,
        'selector_terminal_relation_evidence_missing'
    );
    assert.equal(
        selectExactAnswerAuditRecoveryGap(
            validation,
            new Set(['selector_terminal_relation_evidence_missing'])
        ).error,
        'selector_metric_evidence_missing'
    );
    assert.equal(
        selectExactAnswerAuditRecoveryGap(
            validation,
            new Set([
                'selector_metric_evidence_missing',
                'selector_terminal_relation_evidence_missing'
            ])
        ),
        null
    );
});

test('Agent exact-answer audit asks for one visual enumeration cross-check without suppressing the answer', () => {
    const gap = detectVisualEnumerationEvidenceGap({
        message: 'Using the provided image, list all fractions that use / as the fraction line in order.',
        submission: {
            answer: '6/8=3/4,4/60=1/15'
        },
        stepResults: [],
        fileAttachments: [{
            type: 'file',
            path: 'C:\\tmp\\fractions.png',
            name: 'fractions.png'
        }]
    });
    assert.equal(gap.error, 'visual_enumeration_not_cross_checked');
    assert.match(gap.instruction, /return the best available answer/i);
    assert.match(gap.instruction, /top-left to bottom-right/i);
});

test('Agent exact-answer audit preserves a source-supported compound species name', () => {
    const gap = detectAnswerSpecificityEvidenceGap({
        message: 'What species of bird is featured?',
        submission: { answer: 'penguin' },
        stepResults: [{
            tool: 'web_run',
            response: {
                ok: true,
                result: {
                    content: [{
                        type: 'text',
                        text: 'The segment starts with rockhopper penguins scaling a steep cliff.'
                    }]
                }
            }
        }]
    });
    assert.equal(gap.error, 'answer_entity_specificity_missing');
    assert.deepEqual(gap.sourceCandidates, ['rockhopper penguin']);
});

test('Agent exact-answer audit verifies complete book titles against a full-title authority', () => {
    const gap = detectCompleteTitleEvidenceGap({
        message: 'What was the complete title of the book?',
        submission: { answer: 'Five Hundred Things to Eat Before It’s Too Late' },
        stepResults: [{
            tool: 'web_run',
            response: {
                ok: true,
                result: {
                    content: [{ type: 'text', text: 'A restaurant blog uses the short title.' }]
                }
            }
        }]
    });
    assert.equal(gap.error, 'complete_title_not_verified');
    assert.match(gap.instruction, /subtitle/i);
});

test('Agent exact-answer audit recovers when a nested selector parent index is still incomplete', () => {
    const gap = detectNestedSelectorSelectionGap({
        message: 'Which article has "witnesses" in the most titles, and what changed in its first rule?',
        submission: {
            answer: 'proceedings',
            reason: 'I followed Rule 601.'
        },
        stepResults: [{
            tool: 'web_run',
            response: {
                ok: true,
                result: {
                    structuredContent: {
                        selectionProtocol: {
                            parent_kind: 'article',
                            quoted_term: 'witnesses',
                            boundary_complete: false,
                            exact_title_match_counts: [
                                {
                                    group: 'ARTICLE VII',
                                    count: 3,
                                    matched_children: [
                                        { id: 'Rule 701' },
                                        { id: 'Rule 702' },
                                        { id: 'Rule 706' }
                                    ]
                                },
                                {
                                    group: 'ARTICLE VI',
                                    count: 2,
                                    matched_children: [
                                        { id: 'Rule 611' },
                                        { id: 'Rule 615' }
                                    ]
                                }
                            ]
                        }
                    }
                }
            }
        }]
    });
    assert.equal(gap.error, 'nested_selector_candidate_boundary_incomplete');
    assert.match(gap.instruction, /parent-index or continuation/i);
    assert.match(gap.instruction, /ARTICLE VII=3/);
});

test('Agent exact-answer audit recovers before the parent index has been opened', () => {
    const gap = detectNestedSelectorSelectionGap({
        message: 'Which article has "witnesses" in the most titles, and what changed in its first rule?',
        submission: {
            answer: 'civil',
            reason: 'I opened Rule 601 directly.'
        },
        stepResults: [{
            tool: 'web_run',
            response: {
                ok: true,
                result: {
                    structuredContent: {
                        search: {
                            selectionAudit: {
                                parent_kind: 'article',
                                quoted_term: 'witnesses',
                                candidate_set_coverage_sufficient: false,
                                candidates: [{
                                    ref_id: 'turn0search0',
                                    structured_anchor: 'ARTICLE VI',
                                    visible_snippet_occurrences: 2
                                }],
                                parent_index_candidates: ['turn0search2']
                            },
                            suggestedNextCalls: [{
                                tool: 'web_run',
                                args: {
                                    open: [{ ref_id: 'turn0search2' }]
                                },
                                reason: 'Open the nearest parent index before selecting a child.'
                            }]
                        }
                    }
                }
            }
        }]
    });
    assert.equal(gap.error, 'nested_selector_candidate_boundary_incomplete');
    assert.match(gap.instruction, /parent-index/i);
    assert.match(gap.instruction, /turn0search2/);
    assert.deepEqual(gap.recommendedActions[0].args, {
        open: [{ ref_id: 'turn0search2' }]
    });
});

test('Agent exact-answer audit preserves recovery budget when discovery skips a recommended navigation action', () => {
    const recoveryGap = {
        error: 'nested_selector_candidate_boundary_incomplete',
        recommendedActions: [{
            tool: 'web_run',
            args: {
                open: [{ ref_id: 'turn0search2' }]
            },
            reason: 'Open the nearest parent index before selecting a child.'
        }]
    };
    const skipped = detectRecommendedRecoveryActionGap({
        recoveryGap,
        toolCalls: [{
            tool: 'tool_search',
            args: { query: 'another connector' }
        }]
    });
    assert.equal(skipped.error, 'recommended_recovery_navigation_skipped');
    assert.match(skipped.instruction, /turn0search2/);
    assert.equal(detectRecommendedRecoveryActionGap({
        recoveryGap,
        toolCalls: [{
            tool: 'web_run',
            args: {
                open: [{ ref_id: 'turn0search2' }]
            }
        }]
    }), null);
});

test('Agent exact-answer audit catches a selected child that conflicts with the completed winning group', () => {
    const gap = detectNestedSelectorSelectionGap({
        message: 'Which article has "witnesses" in the most titles, and what changed in its first rule?',
        submission: {
            answer: 'proceedings',
            reason: 'The first rule is Rule 601 in Article VI.'
        },
        stepResults: [{
            tool: 'web_run',
            response: {
                ok: true,
                result: {
                    structuredContent: {
                        selection_protocol: {
                            parent_kind: 'article',
                            quoted_term: 'witnesses',
                            boundary_complete: true,
                            winning_group: 'ARTICLE VII',
                            exact_title_match_counts: [
                                {
                                    group: 'ARTICLE VII',
                                    count: 3,
                                    matched_children: [
                                        { id: 'Rule 701' },
                                        { id: 'Rule 702' },
                                        { id: 'Rule 706' }
                                    ]
                                },
                                {
                                    group: 'ARTICLE VI',
                                    count: 2,
                                    matched_children: [
                                        { id: 'Rule 611' },
                                        { id: 'Rule 615' }
                                    ]
                                }
                            ]
                        }
                    }
                }
            }
        }]
    });
    assert.equal(gap.error, 'nested_selector_selected_group_mismatch');
    assert.equal(gap.winningGroup, 'ARTICLE VII');
    assert.ok(gap.conflictingAnchors.includes('Rule 601'));
    assert.ok(gap.conflictingAnchors.includes('Article VI'));
});

test('Agent exact-answer relation audit catches submitted cities that disagree with primary person relations', () => {
    const gap = detectSelectorTerminalRelationAnswerMismatch({
        submission: { answer: 'Honolulu, Quincy' },
        relationProperty: 'place_of_birth',
        stepResults: [{
            tool: 'mcp__research__wikidata_entity_lookup',
            args: { properties: ['place_of_birth'] },
            response: {
                ok: true,
                result: {
                    structuredContent: {
                        results: [{
                            query: 'Barack Obama',
                            matches: [{
                                label: 'Barack Obama',
                                properties: {
                                    place_of_birth: [{
                                        label: 'Kapiolani Medical Center for Women and Children',
                                        description: 'hospital in Honolulu, Hawaii'
                                    }]
                                }
                            }]
                        }, {
                            query: 'John Adams',
                            matches: [{
                                label: 'John Adams',
                                properties: {
                                    place_of_birth: [{
                                        label: 'Braintree',
                                        description: 'city in Massachusetts'
                                    }]
                                }
                            }]
                        }]
                    }
                }
            }
        }]
    });
    assert.equal(gap.error, 'selector_terminal_relation_answer_mismatch');
    assert.deepEqual(gap.unmatchedLabels, ['Quincy']);
    assert.ok(gap.relationCandidates.includes('Braintree'));
});

test('Agent exact-answer audit can extend only the ordinary tool-round boundary', () => {
    assert.equal(canStartExactAnswerAuditRecovery({
        iteration: 8,
        finalizationIteration: 8,
        safetyFinalizationReason: 'maximum_tool_rounds'
    }), true);
    assert.equal(canStartExactAnswerAuditRecovery({
        iteration: 8,
        finalizationIteration: 8,
        safetyFinalizationReason: 'time_budget'
    }), false);
    assert.equal(canStartExactAnswerAuditRecovery({
        iteration: 9,
        finalizationIteration: 8
    }), false);
});

test('Agent exact-answer recovery promotes schema-matched relation tools without forcing a route', () => {
    const specs = [{
        name: 'web_run',
        description: 'Broad web search.',
        parameters: { type: 'object', properties: {} }
    }, {
        name: 'mcp__research__wikidata_entity_lookup',
        description: 'Structured entity facts and relations.',
        parameters: {
            type: 'object',
            properties: {
                queries: { type: 'array', items: { type: 'string' } },
                properties: {
                    type: 'array',
                    description: 'Supports place_of_birth and coordinates.',
                    items: { type: 'string' }
                }
            }
        }
    }];
    const gap = {
        error: 'selector_terminal_relation_evidence_missing',
        relationProperty: 'place_of_birth'
    };
    const prioritized = prioritizeExactAnswerRecoveryToolSpecs(specs, gap);
    assert.equal(prioritized[0].name, 'mcp__research__wikidata_entity_lookup');
    assert.equal(prioritized[1].name, 'web_run');
    const note = buildExactAnswerRecoveryToolAffordanceNote(prioritized, gap);
    assert.match(note, /wikidata_entity_lookup/);
    assert.match(note, /properties:\["place_of_birth"\]/);
    assert.match(note, /broad web search is a fallback/i);

    const discoveryNote = buildExactAnswerRecoveryToolAffordanceNote([
        specs[0],
        {
            name: 'tool_search',
            description: 'Discover deferred tools.',
            parameters: { type: 'object', properties: { query: { type: 'string' } } }
        }
    ], gap);
    assert.match(discoveryNote, /not visible yet/i);
    assert.match(discoveryNote, /use tool_search now/i);
    assert.match(discoveryNote, /then call the discovered tool/i);
});

test('Agent exact-answer audit accepts a plain final response as the answer candidate', () => {
    const validation = validateExactAnswerSubmission({
        decision: {
            finalAnswer: 'Braintree, Honolulu',
            publicReasoning: 'Plain final response after tool use.'
        },
        message: 'Give the city names only.'
    });
    assert.equal(validation.submission.answer, 'Braintree, Honolulu');
    assert.equal(validation.submission.reason, 'Plain final response after tool use.');
    assert.ok(!validation.warnings.includes('answer_missing'));
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
    assert.equal(sufficiency.status, 'model_judges_evidence');
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

    const audited = validateExactAnswerSubmission({
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
    assert.equal(audited.ok, true);
    assert.deepEqual(audited.errors, []);
    assert.ok(audited.warnings.includes('evidence_missing'));
    assert.ok(audited.warnings.includes('evidence_refs_unknown'));
});

test('Agent exact-answer audit flags raw rounded units for scaled-unit questions', () => {
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

    const audited = validateExactAnswerSubmission({
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
    assert.equal(audited.ok, true);
    assert.deepEqual(audited.errors, []);
    assert.ok(audited.warnings.includes('scaled_unit_answer_mismatch'));
    assert.match(audited.scaledUnitMismatch.instruction, /divide by 1000/i);

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

test('Agent exact-answer audit flags numeric answer when reason states a different final number', () => {
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

    const audited = validateExactAnswerSubmission({
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

    assert.equal(audited.ok, true);
    assert.deepEqual(audited.errors, []);
    assert.ok(audited.warnings.includes('answer_reason_conflict'));
    assert.equal(audited.reasonConflict.answer, '40');
    assert.deepEqual(audited.reasonConflict.reasonFinalNumbers, ['17']);
});

test('Agent exact-answer audit flags incomplete first-step simulations for multi-stage random processes', () => {
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

    const audited = validateExactAnswerSubmission({
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

    assert.equal(audited.ok, true);
    assert.deepEqual(audited.errors, []);
    assert.ok(audited.warnings.includes('incomplete_process_simulation_evidence'));
    assert.match(audited.incompleteSimulation.instruction, /full state transition loop/i);
});

test('Agent exact-answer audit flags Monte Carlo-only evidence for finite stochastic exact-answer tasks', () => {
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

    const audited = validateExactAnswerSubmission({
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

    assert.equal(audited.ok, true);
    assert.deepEqual(audited.errors, []);
    assert.ok(audited.warnings.includes('monte_carlo_only_random_process_evidence'));
    assert.match(audited.incompleteSimulation.instruction, /exact state transition/i);
});

test('Agent exact-answer audit flags ad hoc terminal probabilities in stochastic process code', () => {
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

    const audited = validateExactAnswerSubmission({
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

    assert.equal(audited.ok, true);
    assert.deepEqual(audited.errors, []);
    assert.ok(audited.warnings.includes('ad_hoc_terminal_transition_evidence'));
    assert.match(audited.incompleteSimulation.instruction, /terminal\/partial-state probabilities/i);
});

test('Agent exact-answer audit treats a guaranteed single-container threshold as vacuous', () => {
    const message = [
        'The host has thirty shiny prop coins and hides them in three different prize boxes.',
        'The only rule restricting placement is that one box must contain at least two coins.',
        'What is the minimum guaranteed value in this bounded optimization problem?'
    ].join(' ');
    const gap = detectVacuousDistributionConstraintGap({ message });

    assert.equal(gap.error, 'word_problem_quantifier_constraint_vacuous');
    assert.equal(gap.total, 30);
    assert.equal(gap.containerCount, 3);
    assert.equal(gap.threshold, 2);
    assert.equal(gap.guaranteedMaximumLowerBound, 10);
    assert.equal(gap.describedAsRestrictingRule, true);
    assert.match(gap.instruction, /prefer the smallest quantifier repair/i);

    const audited = validateExactAnswerSubmission({
        decision: {
            exactAnswerSubmission: normalizeExactAnswerSubmission({
                answer: '12',
                confidence: 'medium',
                reason: 'bounded enumeration'
            })
        },
        message
    });
    assert.ok(audited.warnings.includes('word_problem_quantifier_constraint_vacuous'));
    assert.equal(
        selectExactAnswerAuditRecoveryGap(audited)?.error,
        'word_problem_quantifier_constraint_vacuous'
    );

    assert.equal(detectVacuousDistributionConstraintGap({
        message: 'Ten balls are distributed among twenty boxes. One box must contain at least two balls. What is the minimum?'
    }), null);
});

test('Agent exact-answer audit rejects semantic zero from raw Office string search alone', () => {
    const fileAttachments = [{
        type: 'file',
        path: 'F:/workspace/slides.pptx',
        name: 'slides.pptx',
        extension: '.pptx'
    }];
    const gap = detectStructuredAttachmentSemanticEvidenceGap({
        message: 'How many slides mention crustaceans in the attached presentation?',
        submission: { answer: '0' },
        fileAttachments,
        stepResults: [{
            tool: 'exec',
            args: { command: 'search raw OOXML for the word crustaceans' },
            response: { ok: true, status: 'completed' }
        }]
    });

    assert.equal(gap.error, 'structured_attachment_semantic_zero_unverified');
    assert.deepEqual(gap.recommendedTools, ['read_presentation']);

    const audited = validateExactAnswerSubmission({
        decision: {
            exactAnswerSubmission: normalizeExactAnswerSubmission({
                answer: '0',
                confidence: 'medium',
                reason: 'raw XML had zero exact word matches'
            })
        },
        message: 'How many slides mention crustaceans in the attached presentation?',
        fileAttachments,
        stepResults: [{
            tool: 'exec',
            response: { ok: true, status: 'completed' }
        }]
    });
    assert.ok(audited.warnings.includes('structured_attachment_semantic_zero_unverified'));
    assert.equal(
        selectExactAnswerAuditRecoveryGap(audited)?.error,
        'structured_attachment_semantic_zero_unverified'
    );

    assert.equal(detectStructuredAttachmentSemanticEvidenceGap({
        message: 'How many slides mention crustaceans in the attached presentation?',
        submission: { answer: '0' },
        fileAttachments,
        stepResults: [{
            tool: 'read_presentation',
            response: { ok: true, status: 'completed' }
        }]
    }), null);
});

test('Agent exact-answer audit requires multi-field selectors to close on one record row', () => {
    const message = 'From what country was the unknown language article with a flag unique from the others?';
    const incompleteStep = {
        tool: 'web_archive_lookup',
        response: {
            ok: true,
            status: 'completed',
            result: {
                structuredContent: {
                    recordFieldProjections: [{
                        recordNumber: 1,
                        title: 'Candidate article',
                        fields: [
                            { label: 'Document Type', value: 'Article' },
                            { label: 'Country', value: 'de' }
                        ]
                    }]
                }
            }
        }
    };
    const gap = detectRecordSelectorConjunctionEvidenceGap({
        message,
        submission: { answer: 'Germany' },
        stepResults: [incompleteStep]
    });

    assert.equal(gap.error, 'record_selector_fields_not_correlated');
    assert.deepEqual(gap.requiredFields, ['language', 'document_type', 'country']);
    assert.deepEqual(gap.missingFields, ['language']);
    assert.match(gap.instruction, /do not prove a conjunction on one record/i);
    assert.match(gap.instruction, /not a hard route/i);

    const audited = validateExactAnswerSubmission({
        decision: {
            exactAnswerSubmission: normalizeExactAnswerSubmission({
                answer: 'Germany',
                confidence: 'medium',
                reason: 'Germany is the most frequent country facet.'
            })
        },
        message,
        stepResults: [incompleteStep]
    });
    assert.ok(audited.warnings.includes('record_selector_fields_not_correlated'));
    assert.equal(
        selectExactAnswerAuditRecoveryGap(audited)?.error,
        'record_selector_fields_not_correlated'
    );

    assert.equal(detectRecordSelectorConjunctionEvidenceGap({
        message,
        submission: { answer: 'Guatemala' },
        stepResults: [{
            ...incompleteStep,
            response: {
                ...incompleteStep.response,
                result: {
                    structuredContent: {
                        recordFieldProjections: [{
                            recordNumber: 1,
                            title: 'Matching article',
                            fields: [
                                { label: 'Language', value: 'Unknown' },
                                { label: 'Document Type', value: 'Article' },
                                { label: 'Country', value: 'gt' }
                            ]
                        }]
                    }
                }
            }
        }]
    }), null);
});
