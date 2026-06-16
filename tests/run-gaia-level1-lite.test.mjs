import assert from 'node:assert/strict';
import test from 'node:test';

import {
    buildFinalAnswerGate,
    buildEvidenceDigest,
    compactClinicalTrialsObservation,
    extractSubmittedAnswer,
    finalizeAnswerFromEvidence,
    formatSubmittedAnswerForQuestion,
    looksLikeShortAnswer
} from '../scripts/run-gaia-level1-lite.mjs';

test('GAIA Level 1 Lite answer gate accepts compact exact answers', () => {
    for (const answer of ['Extremely', 'rockhopper penguin', 'b, e', '90', 'BaseLabelPropagation']) {
        assert.equal(looksLikeShortAnswer(answer), true, answer);
        const gate = buildFinalAnswerGate({
            question: { question: 'Return the exact answer.' },
            response: { ok: true, finalAnswer: answer }
        });
        assert.equal(gate.ok, true);
        assert.equal(gate.answer, answer);
        assert.equal(gate.source, 'agent_final_answer');
    }
});

test('GAIA Level 1 Lite answer gate rejects visible persona prose as submitted answer', () => {
    const visibleProse = '已完成分析啦！我写了脚本检查文件，但总幻灯片数不拿不稳，所以答案是 0～ 0';
    assert.equal(looksLikeShortAnswer(visibleProse), false);
    assert.equal(
        extractSubmittedAnswer({ ok: true, displayText: '90', message: '90' }, { answerOnly: true }),
        ''
    );

    const gate = buildFinalAnswerGate({
        question: { question: 'How many slides are in the deck?' },
        response: { ok: true, displayText: visibleProse, message: visibleProse }
    });
    assert.equal(gate.ok, false);
    assert.equal(gate.status, 'missing_exact_answer');
    assert.equal(gate.answer, '');
});

test('GAIA Level 1 Lite answer gate rejects explanatory finalAnswer text', () => {
    const gate = buildFinalAnswerGate({
        question: { question: 'What is the value?' },
        response: {
            ok: true,
            finalAnswer: '根据工具证据，我确认最终答案是 90。'
        }
    });
    assert.equal(gate.ok, false);
    assert.equal(gate.status, 'rejected_visible_prose');
});

test('GAIA Level 1 Lite answer gate submits low-confidence finalizer answers with evidence status', () => {
    const response = {
        ok: true,
        displayText: 'I found the answer in the tool output.',
        steps: [{ response: { ok: true } }]
    };
    const accepted = buildFinalAnswerGate({
        question: { question: 'Which algorithm is named?' },
        response,
        finalizer: {
            ok: true,
            answer: 'BaseLabelPropagation',
            confidence: 'high',
            reason: 'present in evidence'
        }
    });
    assert.equal(accepted.ok, true);
    assert.equal(accepted.source, 'finalizer');
    assert.equal(accepted.answer, 'BaseLabelPropagation');

    const lowConfidence = buildFinalAnswerGate({
        question: { question: 'Which algorithm is named?' },
        response,
        finalizer: {
            ok: true,
            answer: 'BaseLabelPropagation',
            confidence: 'low',
            reason: 'missing evidence'
        }
    });
    assert.equal(lowConfidence.ok, true);
    assert.equal(lowConfidence.source, 'finalizer');
    assert.equal(lowConfidence.answer, 'BaseLabelPropagation');
    assert.equal(lowConfidence.status, 'accepted_low_confidence');
    assert.equal(lowConfidence.evidence_status, 'low_confidence');
});

test('GAIA Level 1 Lite answer gate falls back to structured answerCandidates when evidence is incomplete', () => {
    const gate = buildFinalAnswerGate({
        question: { question: 'What adjective did both critics use?' },
        response: {
            ok: true,
            displayText: 'I found a candidate in the PDF evidence.',
            steps: [{
                response: {
                    ok: true,
                    result: {
                        structuredContent: {
                            ok: true,
                            status: 'completed',
                            answerCandidates: [{
                                answer: 'fluffy',
                                score: 74,
                                context: 'Both cited critics complain about increasingly fluffy dragons.'
                            }]
                        }
                    }
                }
            }]
        },
        finalizer: {
            ok: false,
            status: 'missing_evidence',
            answer: '',
            confidence: 'low',
            reason: 'missing evidence'
        }
    });
    assert.equal(gate.ok, true);
    assert.equal(gate.source, 'evidence_answer_candidate');
    assert.equal(gate.answer, 'fluffy');
    assert.equal(gate.status, 'accepted_missing_evidence');
    assert.equal(gate.evidence_status, 'missing_evidence');
});

test('GAIA Level 1 Lite answer formatting removes units already specified by the question', () => {
    assert.equal(
        formatSubmittedAnswerForQuestion('123 kg', { question: 'What is the mass in kg?' }),
        '123'
    );
});

test('GAIA evidence digest preserves ClinicalTrials enrollment from structured body', () => {
    const structuredStudy = {
        protocolSection: {
            identificationModule: {
                nctId: 'NCT03411733',
                briefTitle: 'Prevalence of H.Pylori in Patients With Acne Vulgaris'
            },
            statusModule: {
                overallStatus: 'COMPLETED'
            },
            designModule: {
                studyType: 'OBSERVATIONAL',
                enrollmentInfo: {
                    count: 90,
                    type: 'ACTUAL'
                }
            }
        }
    };
    const response = {
        steps: [
            {
                id: 'step-clinical',
                title: 'ClinicalTrials.gov structured lookup',
                tool: 'external__clinicaltrials__get_study',
                args: { nctId: 'NCT03411733' },
                response: {
                    ok: true,
                    status: 'completed',
                    result: {
                        content: [{
                            type: 'text',
                            text: '{"status":"completed","url":"https://clinicaltrials.gov/api/v2/studies/NCT03411733"}'
                        }],
                        details: {
                            body: structuredStudy
                        }
                    }
                }
            }
        ]
    };

    const compact = compactClinicalTrialsObservation({ body: structuredStudy });
    assert.match(compact, /"count": 90/);
    assert.match(compact, /"type": "ACTUAL"/);

    const digest = buildEvidenceDigest(response);
    assert.match(digest, /NCT03411733/);
    assert.match(digest, /"count": 90/);
    assert.doesNotMatch(digest, /missing evidence/i);
});

test('GAIA evidence digest prefers structured read_document payload over truncated preview text', () => {
    const digest = buildEvidenceDigest({
        steps: [
            {
                id: 'step-docx',
                title: 'Read Secret Santa document',
                tool: 'mcp__ailis_research__read_document',
                args: { path: 'secret-santa.docx' },
                response: {
                    ok: true,
                    status: 'completed',
                    result: {
                        content: [{
                            type: 'text',
                            text: '{"path":"secret-santa.docx","paragraphs":[{"index":0,"text":"Employees"}],"tables":[{"index":0,"rows":[["Giver","Recipient"]]}]'
                        }],
                        structuredContent: {
                            ok: true,
                            status: 'completed',
                            path: 'secret-santa.docx',
                            document: {
                                path: 'secret-santa.docx',
                                paragraph_count: 3,
                                table_count: 1,
                                paragraphs: [
                                    { index: 0, text: 'Employees' },
                                    { index: 1, text: 'Profiles' },
                                    { index: 2, text: 'Gift list' }
                                ],
                                tables: [
                                    { index: 0, rows: [['Giver', 'Recipient'], ['Fred', 'Rebecca']] }
                                ]
                            }
                        }
                    }
                }
            }
        ]
    });

    assert.match(digest, /"Gift list"/);
    assert.match(digest, /Fred/);
    assert.doesNotMatch(digest, /undefined/);
});

test('GAIA evidence digest preserves structured PDF answer candidates', () => {
    const digest = buildEvidenceDigest({
        steps: [
            {
                id: 'step-pdf',
                title: 'Find and extract PDF',
                tool: 'mcp__ailis_research__pdf_find_and_extract',
                args: {
                    title: '"Dragons are Tricksy": The Uncanny Dragons of Children Literature',
                    extract_query: 'quoted from two different authors distaste dragon depictions'
                },
                response: {
                    ok: true,
                    status: 'completed',
                    result: {
                        content: [{
                            type: 'text',
                            text: 'PDF focused evidence snippets: noisy preview that might otherwise be truncated'
                        }],
                        structuredContent: {
                            ok: true,
                            status: 'completed',
                            pdfUrl: 'https://example.org/article/download/164228/106850',
                            evidenceQuery: 'quoted from two different authors distaste dragon depictions',
                            answerCandidates: [{
                                answer: 'fluffy',
                                score: 74,
                                context: 'Ruth Stein and Margaret Blount both comment with distaste on the increasingly cuddly, "fluffy" nature of dragons.'
                            }],
                            evidenceSnippets: 'Ruth Stein and Margaret Blount both comment with distaste on the increasingly cuddly, "fluffy" nature of dragons.'
                        }
                    }
                }
            }
        ]
    });

    assert.match(digest, /"answerCandidates"/);
    assert.match(digest, /"fluffy"/);
    assert.match(digest, /distaste/);
});

test('GAIA finalizer deterministically extracts ClinicalTrials actual enrollment', async () => {
    const result = await finalizeAnswerFromEvidence({
        question: {
            question: 'What was the actual enrollment count of the clinical trial on H. pylori in acne vulgaris patients from Jan-May 2018 as listed on the NIH website?'
        },
        filePath: '',
        llmSettings: {},
        response: {
            steps: [{
                id: 'step-clinical',
                title: 'ClinicalTrials.gov structured lookup',
                tool: 'external__clinicaltrials__get_study',
                args: { nctId: 'NCT03411733' },
                response: {
                    ok: true,
                    status: 'completed',
                    result: {
                        content: [{ type: 'text', text: '{"status":"completed"}' }],
                        details: {
                            body: {
                                protocolSection: {
                                    designModule: {
                                        enrollmentInfo: {
                                            count: 90,
                                            type: 'ACTUAL'
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }]
        }
    });

    assert.equal(result.ok, true);
    assert.equal(result.answer, '90');
    assert.equal(result.confidence, 'high');
});

test('GAIA finalizer counts semantic crustacean slides from presentation text', async () => {
    const result = await finalizeAnswerFromEvidence({
        question: {
            question: 'How many slides in this PowerPoint presentation mention crustaceans?'
        },
        filePath: 'deck.pptx',
        llmSettings: {},
        response: {
            steps: [{
                id: 'step-ppt',
                title: 'Read presentation',
                tool: 'mcp__ailis_research__read_presentation',
                args: { path: 'deck.pptx' },
                response: {
                    ok: true,
                    status: 'completed',
                    result: {
                        content: [{
                            type: 'text',
                            text: JSON.stringify({
                                total_slides: 8,
                                slides: [
                                    { slide_number: 1, text: 'Animals' },
                                    { slide_number: 2, text: 'crayfish' },
                                    { slide_number: 3, text: 'nematodes' },
                                    { slide_number: 4, text: 'isopods' },
                                    { slide_number: 5, text: 'eels' },
                                    { slide_number: 6, text: 'Yeti crab' },
                                    { slide_number: 7, text: 'Spider crab' },
                                    { slide_number: 8, text: 'jellyfish' }
                                ]
                            })
                        }]
                    }
                }
            }]
        }
    });

    assert.equal(result.ok, true);
    assert.equal(result.answer, '4');
    assert.equal(result.confidence, 'high');
});
