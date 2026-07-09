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
