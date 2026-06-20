import assert from 'node:assert/strict';
import test from 'node:test';
import {
    buildCodexLikeTurnItems,
    buildTurnItemsPromptObject
} from '../electron/ailis-turn-items.cjs';

test('Turn items map tool calls and results into Codex-like chronological items', () => {
    const promptObject = buildTurnItemsPromptObject({
        events: [
            {
                type: 'tool_call',
                id: 'step-1',
                title: 'Read paper notes',
                tool: 'computer',
                args: { action: 'read', path: 'paper.md' },
                iteration: 0
            },
            {
                type: 'tool_result',
                id: 'step-1',
                title: 'Read paper notes',
                tool: 'computer',
                status: 'completed',
                ok: true,
                preview: 'memory stream, reflection, planning',
                iteration: 0
            }
        ]
    });

    assert.equal(promptObject.model, 'codex_like_turn_items');
    assert.match(promptObject.note, /Tool failures are observations/);
    assert.equal(promptObject.items[0].type, 'tool_call');
    assert.equal(promptObject.items[0].status, 'started');
    assert.equal(promptObject.items[1].type, 'tool_result');
    assert.equal(promptObject.items[1].status, 'completed');
    assert.match(promptObject.items[1].preview, /reflection/);
});

test('Turn items compact older observations while keeping recent observations detailed', () => {
    const events = Array.from({ length: 18 }, (_, index) => ({
        type: 'tool_result',
        id: `step-${index}`,
        title: `Tool ${index}`,
        tool: 'computer',
        status: 'completed',
        ok: true,
        preview: `observation-${index} ${'x'.repeat(500)}`,
        iteration: index
    }));
    const promptObject = buildTurnItemsPromptObject({
        events,
        maxItems: 8,
        recentFullItems: 2,
        olderPreviewChars: 80
    });

    assert.equal(promptObject.items.length, 8);
    assert.equal(promptObject.retention.omitted_items, 10);
    assert.equal(promptObject.retention.strategy, 'codex_like_recent_observation_window');
    assert.equal(promptObject.items[0].compacted, true);
    assert.ok(promptObject.items[0].preview.length < 160);
    assert.equal(promptObject.items[7].compacted, undefined);
    assert.match(promptObject.items[7].preview, /observation-17/);
    assert.match(promptObject.latest_observation.preview, /observation-17/);
});

test('Turn items keep failed tool observations available for the next model decision', () => {
    const items = buildCodexLikeTurnItems({
        stepResults: [
            {
                id: 'step-failed',
                title: 'Parse HTML',
                tool: 'computer',
                args: { action: 'exec', command: 'pup ".title text{}"' },
                iteration: 1,
                response: {
                    ok: false,
                    status: 'tool_failed',
                    error: "'pup' is not recognized as an internal or external command"
                }
            }
        ]
    });

    assert.equal(items.length, 1);
    assert.equal(items[0].type, 'tool_result');
    assert.equal(items[0].status, 'failed');
    assert.equal(items[0].result_status, 'tool_failed');
    assert.match(items[0].preview, /pup/);
});

test('Turn items classify Windows command-not-found failures with recovery hints', () => {
    const items = buildCodexLikeTurnItems({
        stepResults: [
            {
                id: 'step-python3',
                title: 'Parse arXiv page',
                tool: 'computer',
                args: {
                    action: 'exec',
                    command: 'python3 -c "print(1)" > paper_metadata.txt'
                },
                iteration: 1,
                response: {
                    ok: false,
                    status: 'error',
                    result: {
                        content: [{ type: 'text', text: 'exitCode=9009' }],
                        details: {
                            action: 'exec',
                            command: 'python3 -c "print(1)" > paper_metadata.txt',
                            exitCode: 9009,
                            stdout: '',
                            stderr: ''
                        }
                    }
                }
            }
        ]
    });

    assert.equal(items.length, 1);
    assert.equal(items[0].status, 'failed');
    assert.equal(items[0].error_type, 'missing_dependency');
    assert.match(items[0].preview, /python3/);
    assert.match(items[0].recovery_hint, /PowerShell|Node\.js|web_fetch/);
    assert.ok(items[0].alternatives.includes('node'));
});

test('Turn items classify web_search discovery output as needing web_fetch evidence', () => {
    const items = buildCodexLikeTurnItems({
        stepResults: [
            {
                id: 'step-search',
                title: 'Search Kaggle strategy',
                tool: 'mcp__ailis_research__web_search',
                args: { query: 'Kaggle AI攻防 competition latest 攻略' },
                iteration: 1,
                response: {
                    ok: true,
                    status: 'completed',
                    result: {
                        content: [{
                            type: 'text',
                            text: [
                                'Evidence gap: Search results are discovery only. Open a result before answering.',
                                'Suggested next calls:',
                                '1. web_fetch {"url":"https://www.kaggle.com/"}',
                                'High-signal links:',
                                'URL: https://www.kaggle.com/'
                            ].join('\n')
                        }]
                    }
                }
            }
        ]
    });

    assert.equal(items.length, 1);
    assert.equal(items[0].status, 'completed');
    assert.equal(items[0].evidence_gap, 'search_results_need_fetch');
    assert.match(items[0].recovery_hint, /mcp__ailis_research__web_fetch/);
    assert.ok(items[0].alternatives.includes('mcp__ailis_research__web_fetch'));
});

test('Turn items preserve complete structured document table previews for reasoning', () => {
    const tableRows = Array.from({ length: 90 }, (_, index) => `Person ${index + 1} | Recipient ${index + 1} | ${'profile clue '.repeat(3)}`).join('\n');
    const documentText = [
        '# DOCUMENT_READ_COMPLETE',
        '',
        'paragraph_count: 8',
        'table_count: 1',
        'truncated: false',
        '',
        '## Paragraphs',
        '[0] Employees',
        '[1] Gift Assignments',
        '',
        '## Tables',
        'Table 1 rows=29',
        'Giver | Recipient',
        tableRows,
        'Final Sender | Final Recipient'
    ].join('\n');

    const items = buildCodexLikeTurnItems({
        stepResults: [{
            id: 'step-doc',
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
                        status: 'completed',
                        complete: true,
                        truncated: false,
                        reasoningReady: true,
                        paragraphCount: 8,
                        tableCount: 1,
                        observationContract: {
                            complete: true,
                            truncated: false,
                            reasoning_ready: true
                        }
                    }
                }
            }
        }]
    });

    assert.equal(items.length, 1);
    assert.match(items[0].preview, /Final Sender \| Final Recipient/);
    assert.doesNotMatch(items[0].preview, /truncated for model budget/);
});

test('Turn items classify nested low-confidence web_search as requiring user clarification', () => {
    const items = buildCodexLikeTurnItems({
        stepResults: [
            {
                id: 'step-ambiguous-search',
                title: 'Search short game nickname',
                tool: 'mcp__ailis_research__web_search',
                args: { query: '做一个小光的攻略' },
                iteration: 1,
                response: {
                    ok: true,
                    status: 'completed',
                    result: {
                        content: [{
                            type: 'text',
                            text: 'Evidence gap: Search confidence is low; the query appears ambiguous and should be clarified before following any result.'
                        }],
                        structuredContent: {
                            result: {
                                structuredContent: {
                                    status: 'completed',
                                    query: '做一个小光的攻略',
                                    clarificationRequired: true,
                                    searchConfidence: {
                                        level: 'low',
                                        shouldAskUser: true,
                                        clarificationRequired: true,
                                        clarificationQuestion: '你说的“小光”具体指哪一个？请补充游戏名或角色全名。',
                                        candidateChoices: [
                                            { label: '绝区零 / 叶瞬光', url: 'https://www.bilibili.com/video/BV1rXBoBoEv1/' },
                                            { label: '光遇 / 小光', url: 'https://example.com/sky/xiaoguang-guide' }
                                        ]
                                    },
                                    suggestedNextCalls: []
                                }
                            }
                        }
                    }
                }
            }
        ]
    });

    assert.equal(items.length, 1);
    assert.equal(items[0].status, 'completed');
    assert.equal(items[0].evidence_gap, 'ambiguous_search_requires_clarification');
    assert.match(items[0].recovery_hint, /具体指哪一个|补充游戏名/);
    assert.ok(items[0].alternatives.includes('ask_user_clarification'));
});

test('Turn items classify web_fetch JavaScript shells as unusable evidence', () => {
    const items = buildCodexLikeTurnItems({
        stepResults: [
            {
                id: 'step-js-shell',
                title: 'Fetch Miyoushe guide',
                tool: 'mcp__ailis_research__web_fetch',
                args: { url: 'https://www.miyoushe.com/zzz/article/59714036' },
                iteration: 2,
                response: {
                    ok: true,
                    status: 'completed',
                    result: {
                        content: [{ type: 'text', text: 'Evidence gap: The fetched page is only a JavaScript loading shell.\n\nContent excerpt:\n米游社 Loading...' }],
                        details: {
                            status: 'completed',
                            evidenceQuality: 'js_shell',
                            isEvidence: false,
                            observationContract: {
                                complete: false,
                                truncated: false,
                                reasoning_ready: false,
                                is_evidence: false,
                                evidence_quality: 'js_shell'
                            }
                        }
                    }
                }
            }
        ]
    });

    assert.equal(items.length, 1);
    assert.equal(items[0].evidence_gap, 'js_shell_no_content');
    assert.match(items[0].recovery_hint, /Do not refetch/);
    assert.ok(items[0].alternatives.includes('different web_fetch URL'));
});

test('Turn items do not add an evidence gap for sufficient web_fetch evidence', () => {
    const items = buildCodexLikeTurnItems({
        stepResults: [
            {
                id: 'step-ready-page',
                title: 'Fetch BWiki guide',
                tool: 'mcp__ailis_research__web_fetch',
                args: { url: 'https://wiki.biligame.com/zzz/%E8%8E%B1%E7%89%B9' },
                iteration: 4,
                response: {
                    ok: true,
                    status: 'completed',
                    result: {
                        content: [{ type: 'text', text: 'Content excerpt:\n莱特 - 绝区零WIKI_BWIKI 技能加点 配队 驱动盘' }],
                        details: {
                            status: 'completed',
                            evidenceQuality: 'sufficient_evidence',
                            isEvidence: true,
                            complete: true,
                            truncated: false,
                            reasoningReady: true,
                            observationContract: {
                                complete: true,
                                truncated: false,
                                reasoning_ready: true,
                                is_evidence: true,
                                evidence_quality: 'sufficient_evidence'
                            }
                        }
                    }
                }
            }
        ]
    });

    assert.equal(items.length, 1);
    assert.equal(items[0].evidence_gap, null);
    assert.equal(items[0].recovery_hint, null);
});
