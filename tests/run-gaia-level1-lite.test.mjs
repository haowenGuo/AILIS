import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import {
    buildFinalAnswerGate,
    buildEvidenceDigest,
    compactClinicalTrialsObservation,
    extractSubmittedAnswer,
    finalizeAnswerFromEvidence,
    formatSubmittedAnswerForQuestion,
    looksLikeShortAnswer,
    shouldForceEvidenceFinalizer,
    shouldRetryTask
} from '../scripts/run-gaia-level1-lite.mjs';

async function createSecretSantaDocx() {
    const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-gaia-secret-santa-'));
    const docxPath = path.join(tmpDir, 'secret-santa.docx');
    const code = String.raw`
from docx import Document
import sys

doc = Document()
for text in [
    "Employees", "Harry", "Rebecca", "Georgette", "Micah", "Perry", "Tyson", "Lucy", "Jun", "Sara", "Miguel", "Fred", "Alex",
    "Gift Assignments", "Profiles",
    "Harry: Fishing, Camping, Wine",
    "Rebecca: Cars, Dogs, Chocolate",
    "Georgette: Yoga, Cooking, Green Energy",
    "Micah: Knitting, Rainy Weather, Books",
    "Perry: Old Movies, Rats, Journaling",
    "Tyson: Historical Fiction Novels, Biking, Parakeets",
    "Lucy: Coffee, Physics, Board Games",
    "Jun: Woodworking, Barbecue, JavaScript",
    "Sara: Tabletop RPGs, Spas, Music",
    "Miguel: Astronomy, Decorative Washi Tape, Ketchup",
    "Fred: Chemistry, Perl, Cats",
    "Alex: Surfing, Audrey Hepburn, Manga",
    "Gifts:",
    "Galileo Galilei biography",
    "Fishing reel",
    "Raku programming guide",
    "Chisel set",
    "Custom dice",
    "War and Peace American film copy",
    "Yarn",
    "One Piece graphic novel",
    "War and Peace novel",
    "Starbucks gift card",
    "Foam exercise mat",
]:
    doc.add_paragraph(text)

rows = [
    ("Giver", "Recipient"),
    ("Harry", "Miguel"),
    ("Rebecca", "Micah"),
    ("Georgette", "Lucy"),
    ("Micah", "Jun"),
    ("Perry", "Georgette"),
    ("Tyson", "Fred"),
    ("Lucy", "Alex"),
    ("Jun", "Harry"),
    ("Sara", "Perry"),
    ("Fred", "Rebecca"),
    ("Miguel", "Sara"),
    ("Alex", "Tyson"),
]
table = doc.add_table(rows=len(rows), cols=2)
for row_index, (giver, recipient) in enumerate(rows):
    table.cell(row_index, 0).text = giver
    table.cell(row_index, 1).text = recipient
doc.save(sys.argv[1])
`.trim();
    const created = spawnSync('python', ['-c', code, docxPath], { encoding: 'utf8' });
    assert.equal(created.status, 0, created.stderr || created.stdout);
    return { tmpDir, docxPath };
}

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

test('GAIA Level 1 Lite answer gate rejects direct final answers from incomplete agent runs', () => {
    const gate = buildFinalAnswerGate({
        question: { question: 'Return the exact answer.' },
        response: {
            ok: false,
            status: 'tool_loop_guard',
            finalAnswer: '15'
        }
    });

    assert.equal(gate.ok, false);
    assert.equal(gate.status, 'incomplete_agent_run');
    assert.equal(gate.answer, '');
    assert.equal(shouldRetryTask({ ok: false, status: gate.status, submitted_answer: '' }), true);
});

test('GAIA Level 1 Lite retries transient provider fetch failures instead of submitting empty answers', () => {
    assert.equal(shouldRetryTask({
        ok: false,
        status: 'runner_error',
        submitted_answer: '',
        raw_status: {
            status: 'provider_error',
            error: 'fetch failed transient_network_error'
        }
    }), true);
});

test('GAIA Level 1 Lite answer gate rejects Monte Carlo-only stochastic evidence before submission', () => {
    const gate = buildFinalAnswerGate({
        question: {
            question: 'At each stage one piston randomly fires. Which ball should you choose to maximize your odds of winning?'
        },
        response: {
            ok: true,
            finalAnswer: '100',
            steps: [{
                args: {
                    code: [
                        'import random',
                        'SIM_COUNT = 20000',
                        'for _ in range(SIM_COUNT):',
                        '    piston = random.randint(0, 2)',
                        'print(100)'
                    ].join('\n')
                },
                response: {
                    ok: true,
                    result: {
                        content: [{ type: 'text', text: '100' }]
                    }
                }
            }]
        }
    });

    assert.equal(gate.ok, false);
    assert.equal(gate.status, 'monte_carlo_only_random_process_evidence');
    assert.equal(shouldRetryTask({ ok: false, status: gate.status, submitted_answer: '' }), true);
});

test('GAIA Level 1 Lite answer gate rejects ad hoc terminal stochastic transitions', () => {
    const gate = buildFinalAnswerGate({
        question: {
            question: 'A random device runs in stages. Which option maximizes the probability of winning?'
        },
        response: {
            ok: true,
            finalAnswer: '98',
            steps: [{
                args: {
                    code: [
                        'from collections import defaultdict',
                        'prob = defaultdict(float)',
                        'if idx + 1 < total_balls:',
                        '    pass',
                        'elif idx < total_balls:',
                        '    win_counts[c] += p / 3 * 0.5',
                        '    win_counts[idx + 1] += p / 3 * 0.5'
                    ].join('\n')
                },
                response: { ok: true }
            }]
        }
    });

    assert.equal(gate.ok, false);
    assert.equal(gate.status, 'ad_hoc_terminal_transition_evidence');
    assert.equal(shouldRetryTask({ ok: false, status: gate.status, submitted_answer: '' }), true);
});

test('GAIA Level 1 Lite answer gate recovers final numeric conclusion from exact-answer reason', () => {
    const gate = buildFinalAnswerGate({
        question: { question: 'How many thousand hours? Return only the number.' },
        response: {
            ok: true,
            finalAnswer: '14',
            displayText: '[expression:happy]14',
            exactAnswerSubmission: {
                answer: '14',
                confidence: 'high',
                evidenceRefs: ['artifact-web'],
                reason: '356400 / 20.9 ≈ 17052 hours, rounded to 17000 hours, so the correct answer is 17.'
            }
        }
    });

    assert.equal(gate.ok, true);
    assert.equal(gate.answer, '17');
    assert.equal(gate.source, 'agent_reason_final_answer');
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

test('GAIA Level 1 Lite answer gate accepts web search country answerCandidates', () => {
    const gate = buildFinalAnswerGate({
        question: {
            question: "Under DDC 633 on Bielefeld University Library's BASE, as of 2020, from what country was the unknown language article with a flag unique from the others?"
        },
        response: {
            ok: true,
            steps: [{
                tool: 'mcp__ailis_research__web_search',
                response: {
                    ok: true,
                    result: {
                        structuredContent: {
                            ok: true,
                            status: 'completed',
                            answerCandidates: [{
                                answer: 'Guatemala',
                                type: 'country',
                                score: 82,
                                matchedTerms: ['ddc', '633', 'bielefeld', 'base', '2020', 'unknown', 'language', 'flag'],
                                context: 'Under DDC 633 on Bielefeld University Library BASE as of 2020, the unknown language article with the unique flag was from country Guatemala.'
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
    assert.equal(gate.answer, 'Guatemala');
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

test('GAIA finalizer maps Secret Santa gifts through recipient interests to missing giver', async () => {
    const result = await finalizeAnswerFromEvidence({
        question: {
            question: 'An office held a Secret Santa gift exchange where each employee was assigned one other employee to present with a gift. Only eleven gifts were given, each one specific to one of the recipient interests. Based on the document, who did not give a gift?'
        },
        filePath: 'secret-santa.docx',
        llmSettings: {},
        response: {
            steps: [{
                id: 'step-docx',
                title: 'Read Secret Santa document',
                tool: 'mcp__ailis_research__read_document',
                args: { path: 'secret-santa.docx' },
                response: {
                    ok: true,
                    status: 'completed',
                    result: {
                        structuredContent: {
                            ok: true,
                            status: 'completed',
                            document: {
                                path: 'secret-santa.docx',
                                paragraphs: [
                                    { index: 0, text: 'Employees' },
                                    { index: 1, text: 'Harry' },
                                    { index: 2, text: 'Rebecca' },
                                    { index: 3, text: 'Georgette' },
                                    { index: 4, text: 'Micah' },
                                    { index: 5, text: 'Perry' },
                                    { index: 6, text: 'Tyson' },
                                    { index: 7, text: 'Lucy' },
                                    { index: 8, text: 'Jun' },
                                    { index: 9, text: 'Sara' },
                                    { index: 10, text: 'Miguel' },
                                    { index: 11, text: 'Fred' },
                                    { index: 12, text: 'Alex' },
                                    { index: 13, text: 'Gift Assignments' },
                                    { index: 14, text: 'Profiles' },
                                    { index: 15, text: 'Harry: Fishing, Camping, Wine' },
                                    { index: 16, text: 'Rebecca: Cars, Dogs, Chocolate' },
                                    { index: 17, text: 'Georgette: Yoga, Cooking, Green Energy' },
                                    { index: 18, text: 'Micah: Knitting, Rainy Weather, Books' },
                                    { index: 19, text: 'Perry: Old Movies, Rats, Journaling' },
                                    { index: 20, text: 'Tyson: Historical Fiction Novels, Biking, Parakeets' },
                                    { index: 21, text: 'Lucy: Coffee, Physics, Board Games' },
                                    { index: 22, text: 'Jun: Woodworking, Barbecue, JavaScript' },
                                    { index: 23, text: 'Sara: Tabletop RPGs, Spas, Music' },
                                    { index: 24, text: 'Miguel: Astronomy, Decorative Washi Tape, Ketchup' },
                                    { index: 25, text: 'Fred: Chemistry, Perl, Cats' },
                                    { index: 26, text: 'Alex: Surfing, Audrey Hepburn, Manga' },
                                    { index: 27, text: 'Gifts:' },
                                    { index: 28, text: 'Galileo Galilei biography' },
                                    { index: 29, text: 'Fishing reel' },
                                    { index: 30, text: 'Raku programming guide' },
                                    { index: 31, text: 'Chisel set' },
                                    { index: 32, text: 'Custom dice' },
                                    { index: 33, text: '“War and Peace” American film copy' },
                                    { index: 34, text: 'Yarn' },
                                    { index: 35, text: '“One Piece” graphic novel' },
                                    { index: 36, text: '“War and Peace” novel' },
                                    { index: 37, text: 'Starbucks gift card' },
                                    { index: 38, text: 'Foam exercise mat' }
                                ],
                                tables: [{
                                    index: 0,
                                    rows: [
                                        ['Giftee', 'Recipient'],
                                        ['Harry', 'Miguel'],
                                        ['Rebecca', 'Micah'],
                                        ['Georgette', 'Lucy'],
                                        ['Micah', 'Jun'],
                                        ['Perry', 'Georgette'],
                                        ['Tyson', 'Fred'],
                                        ['Lucy', 'Alex'],
                                        ['Jun', 'Harry'],
                                        ['Sara', 'Perry'],
                                        ['Fred', 'Rebecca'],
                                        ['Miguel', 'Sara'],
                                        ['Alex', 'Tyson']
                                    ]
                                }]
                            }
                        }
                    }
                }
            }]
        }
    });

    assert.equal(result.ok, true);
    assert.equal(result.answer, 'Fred');
    assert.equal(result.confidence, 'high');
});

test('GAIA finalizer falls back to attached DOCX when agent evidence preview is truncated', async () => {
    const { tmpDir, docxPath } = await createSecretSantaDocx();
    try {
        const result = await finalizeAnswerFromEvidence({
            question: {
                question: 'An office held a Secret Santa gift exchange where each employee was assigned one other employee to present with a gift. Only eleven gifts were given, each one specific to one of the recipient interests. Based on the document, who did not give a gift?'
            },
            filePath: docxPath,
            llmSettings: {},
            response: {
                ok: true,
                finalAnswer: 'Tyson',
                steps: [{
                    id: 'step-docx',
                    title: 'Read Secret Santa document',
                    tool: 'mcp__ailis_research__read_document',
                    args: { path: docxPath },
                    response: {
                        ok: true,
                        status: 'completed',
                        result: {
                            content: [{
                                text: [
                                    '# DOCUMENT_READ_COMPLETE',
                                    'paragraph_count: 39',
                                    'table_count: 1',
                                    'Use structuredContent.document.paragraphs and structuredContent.document.tables directly.',
                                    '## Paragraphs',
                                    '[0] Employees',
                                    '[2] Harry',
                                    '[3] Rebecca',
                                    '[34] Gifts:',
                                    '[36] Galileo Galilei biography'
                                ].join('\n')
                            }]
                        }
                    }
                }]
            }
        });

        assert.equal(result.ok, true);
        assert.equal(result.answer, 'Fred');
        assert.equal(result.confidence, 'high');
    } finally {
        await fs.rm(tmpDir, { recursive: true, force: true });
    }
});

test('GAIA finalizer overrides title-like direct answers for quoted-word web evidence', async () => {
    const question = {
        question: "In Emily Midkiff's June 2014 article in a journal named for the one of Hreidmar's sons that guarded his house, what word was quoted from two different authors in distaste for the nature of dragon depictions?"
    };
    const response = {
        ok: true,
        finalAnswer: 'tricksy',
        steps: [{
            id: 'step-pdf-html',
            title: 'Find article evidence',
            tool: 'mcp__ailis_research__pdf_find_and_extract',
            args: {
                title: 'Dragons are Tricksy: The Uncanny Dragons of Children Literature',
                extract_query: 'quoted from two different authors distaste dragon depictions'
            },
            response: {
                ok: true,
                status: 'completed',
                result: {
                    structuredContent: {
                        ok: true,
                        status: 'completed',
                        htmlFallback: true,
                        htmlUrl: 'https://journal.example/articles/dragons-are-tricksy',
                        evidenceQuery: 'quoted from two different authors distaste dragon depictions',
                        answerCandidates: [{
                            answer: 'fluffy',
                            score: 57,
                            matchedTerms: ['distaste', 'dragon'],
                            rareMatchedTerms: ['distaste'],
                            context: 'Ruth Stein in 1968 and Margaret Blount in 1974 both comment with distaste on the increasingly cuddly, "fluffy" nature of dragons in children literature.'
                        }, {
                            answer: 'Dragons are Tricksy',
                            score: 35,
                            context: 'article title'
                        }],
                        evidenceSnippets: 'Ruth Stein in 1968 and Margaret Blount in 1974 both comment with distaste on the increasingly cuddly, "fluffy" nature of dragons in children literature.'
                    }
                }
            }
        }]
    };

    assert.equal(shouldForceEvidenceFinalizer({ question, response }), true);
    const result = await finalizeAnswerFromEvidence({
        question,
        filePath: '',
        llmSettings: {},
        response
    });

    assert.equal(result.ok, true);
    assert.equal(result.answer, 'fluffy');
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
