import assert from 'node:assert/strict';
import test from 'node:test';
import {
    buildAilisThreadItems,
    buildObservationLedgerPromptObject
} from '../electron/ailis-turn-items.cjs';

test('Observation ledger maps tool calls and results into chronological AILIS thread items', () => {
    const promptObject = buildObservationLedgerPromptObject({
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

    assert.equal(promptObject.model, 'ailis_observation_ledger');
    assert.equal(promptObject.schema, 'ailis.observation_ledger.v1');
    assert.match(promptObject.note, /canonical AILIS tool outputs/);
    assert.equal(promptObject.items[0].type, 'tool_call');
    assert.equal(promptObject.items[0].status, 'started');
    assert.equal(promptObject.items[1].type, 'tool_result');
    assert.equal(promptObject.items[1].status, 'completed');
    assert.match(promptObject.items[1].preview, /reflection/);
});

test('Observation ledger summarizes large tool call args before they enter the prompt', () => {
    const script = [
        'from openpyxl import load_workbook',
        'wb = load_workbook("task.xlsx")',
        'print("answer", "F478A7")'
    ].join('\n') + '\n' + 'print("padding")\n'.repeat(900);

    const promptObject = buildObservationLedgerPromptObject({
        events: [{
            type: 'tool_call',
            id: 'step-write',
            title: 'Write solver script',
            tool: 'write',
            args: {
                path: 'solve_puzzle.py',
                content: script,
                api_token: 'secret-value'
            },
            iteration: 4
        }]
    });

    const item = promptObject.items[0];
    assert.equal(item.type, 'tool_call');
    assert.equal(item.args.path, 'solve_puzzle.py');
    assert.equal(item.args.api_token, '__REDACTED__');
    assert.equal(item.args.content.omitted, true);
    assert.equal(item.args.content.kind, 'large_text_arg');
    assert.equal(item.args.content.chars, script.length);
    assert.match(item.args.content.sha1, /^[a-f0-9]{12}$/);
    assert.ok(JSON.stringify(promptObject).length < 2000);
    assert.doesNotMatch(JSON.stringify(promptObject), /padding"\)\nprint\("padding"\)\nprint\("padding/);
});

test('Observation ledger compacts older observations while keeping recent observations detailed', () => {
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
    const promptObject = buildObservationLedgerPromptObject({
        events,
        maxItems: 8,
        recentFullItems: 2,
        olderPreviewChars: 80
    });

    assert.equal(promptObject.items.length, 8);
    assert.equal(promptObject.retention.omitted_items, 10);
    assert.equal(promptObject.retention.strategy, 'ailis_recent_observation_window');
    assert.equal(promptObject.items[0].compacted, true);
    assert.ok(promptObject.items[0].preview.length < 160);
    assert.equal(promptObject.items[7].compacted, undefined);
    assert.match(promptObject.items[7].preview, /observation-17/);
    assert.match(promptObject.latest_observation.preview, /observation-17/);
});

test('AILIS thread items keep failed tool observations available for the next model decision', () => {
    const items = buildAilisThreadItems({
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

test('AILIS thread items classify Windows command-not-found failures without recovery hints', () => {
    const items = buildAilisThreadItems({
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
    assert.equal(items[0].recovery_hint, undefined);
    assert.equal(items[0].alternatives, undefined);
});

test('AILIS thread items keep web_search snippets neutral instead of adding evidence-gap follow-up hints', () => {
    const items = buildAilisThreadItems({
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
                                'Candidate snippets from search results:',
                                '1. Kaggle AI strategy guide',
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
    assert.equal(Object.hasOwn(items[0], 'evidence_gap'), false);
    assert.equal(items[0].recovery_hint, undefined);
    assert.equal(items[0].alternatives, undefined);
});

test('AILIS thread items preserve complete structured document table previews for reasoning', () => {
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

    const items = buildAilisThreadItems({
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

test('Observation ledger preserves artifact_tools preview-only query observations for reasoning', () => {
    const rows = Array.from({ length: 20 }, (_, index) => ({
        rowNumber: index + 1,
        cells: index === 0
            ? 'START | #0099FF | #0099FF | #0099FF'
            : (index === 19
                ? '#0099FF | #92D050 | #F478A7 | END'
                : `#F478A7 | #0099FF | #92D050 | row-${index + 1}`)
    }));
    const artifactPreview = JSON.stringify({
        schema: 'ailis.artifact_tools.tool_api_result.v1',
        ok: true,
        status: 'completed',
        action: 'query',
        adapterId: 'xlsx',
        observation: {
            schema: 'ailis.artifact_tools.compact_observation.v1',
            format: 'xlsx',
            action: 'query',
            sheetName: 'Sheet1',
            range: 'Sheet1!A1:D20',
            rowCount: 20,
            columnCount: 4,
            truncated: false,
            columns: ['A', 'B', 'C', 'D'],
            compactRows: rows,
            candidateCount: rows.length,
            diagnostics: []
        }
    }, null, 2);
    assert.ok(artifactPreview.length > 1000);

    const promptObject = buildObservationLedgerPromptObject({
        events: [{
            type: 'tool_result',
            id: 'step-artifact-query',
            title: 'artifact_tools',
            tool: 'artifact_tools',
            status: 'completed',
            ok: true,
            preview: artifactPreview,
            iteration: 4
        }]
    });

    assert.equal(promptObject.items.length, 1);
    assert.match(promptObject.items[0].preview, /START/);
    assert.match(promptObject.items[0].preview, /rowNumber": 11/);
    assert.match(promptObject.items[0].preview, /END/);
    assert.doesNotMatch(promptObject.items[0].preview, /truncated for model budget/);
});
