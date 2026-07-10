import test from 'node:test';
import assert from 'node:assert/strict';

import budgetRuntime from '../electron/ailis-runtime-budget.cjs';
import toolResultRuntime from '../electron/ailis-tool-result.cjs';
import contextRuntime from '../electron/ailis-context-manager.cjs';

const {
    buildContextBudgetReport,
    makeHeadTailPreview
} = budgetRuntime;
const { normalizeAilisToolOutput } = toolResultRuntime;
const { ContextManager } = contextRuntime;

test('makeHeadTailPreview keeps head and tail while marking omitted middle text', () => {
    const source = `HEAD-${'a'.repeat(1000)}-TAIL`;
    const preview = makeHeadTailPreview(source, 220);

    assert.equal(preview.truncated, true);
    assert.equal(preview.strategy, 'head_tail');
    assert.equal(preview.originalTextChars, source.length);
    assert.ok(preview.text.startsWith('HEAD-'));
    assert.ok(preview.text.endsWith('-TAIL'));
    assert.match(preview.text, /middle omitted for model budget/);
    assert.ok(preview.text.length <= 220);
});

test('buildContextBudgetReport classifies hard budget pressure deterministically', () => {
    const report = buildContextBudgetReport({
        staticPrefix: 'system',
        recentResponseItems: 'x'.repeat(3000)
    }, {
        effectiveInputLimitTokens: 1000,
        reservedOutputTokens: 0,
        systemReserveTokens: 0,
        softRatio: 0.5,
        hardRatio: 0.7,
        stopRatio: 0.9
    });

    assert.equal(report.schema, 'ailis.context_budget_report.v1');
    assert.equal(report.level, 'hard');
    assert.equal(report.shouldCompact, true);
    assert.equal(report.mustStopAndCheckpoint, false);
    assert.ok(report.largestParts[0].approxTokens >= report.largestParts.at(-1).approxTokens);
});

test('buildContextBudgetReport treats provider input usage as authoritative', () => {
    const report = buildContextBudgetReport({
        staticPrefix: 'small',
        tokenInfo: { promptTokens: 760 }
    }, {
        effectiveInputLimitTokens: 1000,
        reservedOutputTokens: 0,
        systemReserveTokens: 0,
        softRatio: 0.5,
        hardRatio: 0.7,
        stopRatio: 0.9
    });

    assert.equal(report.level, 'hard');
    assert.equal(report.providerInputTokens, 760);
    assert.equal(report.effectivePromptTokens, 760);
    assert.ok(report.estimatedPromptTokens < report.providerInputTokens);
});

test('normalizeAilisToolOutput turns large text into a model-visible preview with output ref metadata', () => {
    const result = normalizeAilisToolOutput({
        content: [{
            type: 'text',
            text: `outputId=fetch-123\nHEAD\n${'body\n'.repeat(2200)}TAIL`
        }],
        details: {
            status: 'completed'
        }
    }, {
        toolId: 'web_fetch',
        maxTextChars: 1800
    });

    assert.equal(result.modelBudget.truncated, true);
    assert.ok(result.modelBudget.omittedApproxTokens > 0);
    assert.equal(result.details.outputRef.outputId, 'fetch-123');
    assert.ok(result.content[0].text.length <= 1800);
    assert.match(result.content[0].text, /<truncated omitted_approx_tokens="\d+" \/>/);
    const deprecatedPreviewFields = new RegExp([
        ['output', 'Complete'].join(''),
        ['output', 'TruncatedForModel'].join('')
    ].join('|'));
    assert.doesNotMatch(result.content[0].text, deprecatedPreviewFields);
});

test('ContextManager can build an auditable context package and compact stale tool outputs', () => {
    const items = [];
    for (let index = 0; index < 8; index += 1) {
        const callId = `call-${index}`;
        items.push({
            type: 'function_call',
            call_id: callId,
            name: 'web_fetch',
            arguments: JSON.stringify({ url: `https://example.test/${index}` })
        });
        items.push({
            type: 'function_call_output',
            call_id: callId,
            output: [
                'Status: completed',
                `outputId=ref-${index}`,
                `Output:\n${'large observation\n'.repeat(400)}`
            ].join('\n')
        });
    }

    const manager = new ContextManager({
        items,
        toolOutputChars: 50000
    });
    const pkg = manager.forPromptPackage({
        goal: 'answer with cited evidence',
        budgetConfig: {
            effectiveInputLimitTokens: 1500,
            reservedOutputTokens: 0,
            systemReserveTokens: 0,
            softRatio: 0.1,
            hardRatio: 0.2,
            stopRatio: 0.95
        }
    });

    assert.equal(pkg.schema, 'ailis.context_package.v1');
    assert.equal(pkg.budgetReport.schema, 'ailis.context_budget_report.v1');
    assert.ok(pkg.budgetReport.shouldCompact);
    assert.ok(pkg.droppedItemsManifest.compactedToolObservations > 0);
    assert.ok(pkg.availableOutputRefs.some((ref) => ref.outputId === 'ref-0'));
    assert.equal(pkg.recentResponseItems.filter((item) => item.type === 'function_call_output').length, 8);
});

test('ContextManager semantic compaction replaces active history while preserving task state and refs', () => {
    const originalTask = 'Research the release and answer with exact dates. Do not omit the source.';
    const items = [
        {
            type: 'message',
            role: 'user',
            content: [{ type: 'input_text', text: JSON.stringify({ type: 'context', attached_files: [{ path: 'fixture.pdf' }] }) }]
        },
        {
            type: 'message',
            role: 'user',
            content: [{ type: 'input_text', text: originalTask }]
        }
    ];
    for (let index = 0; index < 10; index += 1) {
        items.push({
            type: 'function_call',
            call_id: `semantic-call-${index}`,
            name: 'web_fetch',
            arguments: JSON.stringify({ url: `https://example.test/${index}` })
        });
        items.push({
            type: 'function_call_output',
            call_id: `semantic-call-${index}`,
            output: `Status: completed\noutputId=semantic-ref-${index}\n${'evidence '.repeat(800)}`
        });
    }
    const manager = new ContextManager({ items, toolOutputChars: 50000 });
    const compacted = manager.semanticCompact({
        force: true,
        goal: originalTask,
        constraints: ['Do not omit the source.'],
        currentPlan: { items: [{ step: 'verify dates', status: 'in_progress' }] },
        unresolvedFields: ['official publication date'],
        taskState: { progress: { toolCalls: 10 } },
        pinnedEvidenceManifest: [{ id: 'artifact-date', summary: 'Official date evidence' }],
        budgetConfig: {
            effectiveInputLimitTokens: 2000,
            reservedOutputTokens: 0,
            systemReserveTokens: 0
        }
    });

    assert.equal(compacted.compacted, true);
    assert.equal(manager.historyVersion(), 1);
    assert.ok(manager.rawItems().length < items.length);
    const serialized = JSON.stringify(manager.rawItems());
    assert.match(serialized, /Research the release and answer with exact dates/);
    assert.match(serialized, /fixture\.pdf/);
    assert.match(serialized, /official publication date/);
    assert.match(serialized, /artifact-date/);
    assert.match(serialized, /semantic-ref-9/);
    assert.equal(compacted.checkpoint.originalGoalPreservedVerbatim, true);
    assert.equal(compacted.checkpoint.originalGoal, originalTask);
});

test('Persona semantic compaction keeps recent visible user and assistant turns plus active task context', () => {
    const items = [{
        type: 'message',
        role: 'user',
        content: [{
            type: 'input_text',
            text: JSON.stringify({
                type: 'context',
                memory_context: '【当前活动任务状态】\ntask: 完成木偶攻略\nstatus: max_loop'
            })
        }]
    }];
    for (let index = 0; index < 20; index += 1) {
        items.push({
            type: 'message',
            role: 'user',
            content: [{ type: 'input_text', text: `用户消息 ${index} ${'x'.repeat(500)}` }]
        });
        items.push({
            type: 'message',
            role: 'assistant',
            content: [{ type: 'output_text', text: `AILIS 回复 ${index} ${'y'.repeat(500)}` }]
        });
    }
    const manager = new ContextManager({ items, toolOutputChars: 50000 });
    const compacted = manager.semanticCompact({
        force: true,
        contextMode: 'persona',
        goal: '跑完',
        taskState: { task: '完成木偶攻略', status: 'max_loop' },
        personaVisibleHistoryChars: 5000,
        budgetConfig: {
            effectiveInputLimitTokens: 2000,
            reservedOutputTokens: 0,
            systemReserveTokens: 0
        }
    });

    const serialized = JSON.stringify(manager.rawItems());
    assert.equal(compacted.compacted, true);
    assert.match(serialized, /当前活动任务状态/);
    assert.match(serialized, /用户消息 19/);
    assert.match(serialized, /AILIS 回复 19/);
    assert.doesNotMatch(serialized, /用户消息 0/);
    assert.equal(compacted.checkpoint.contextMode, 'persona');
});
