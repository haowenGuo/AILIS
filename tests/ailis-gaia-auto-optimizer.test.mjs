import assert from 'node:assert/strict';
import test from 'node:test';

import {
    buildPracticeTasks,
    classifyGaiaResult,
    extractExecutionChain,
    normalizeAnswer,
    parseArgs,
    resolveTaskRetries,
    selectNextTask,
    shouldContinueAfterFailure,
    shouldContinueAfterVerdict
} from '../scripts/run-ailis-gaia-auto-optimizer.mjs';

test('GAIA auto optimizer exposes the two local practice tasks', () => {
    const tasks = buildPracticeTasks();
    assert.equal(tasks.length, 2);
    assert.equal(tasks[0].taskId, 'cffe0e32-c9a6-4c52-9877-78ceb4aaa9fb');
    assert.equal(tasks[0].expectedAnswer, 'Fred');
    assert.equal(tasks[1].taskId, '65afbc8a-89ca-4ad5-8d62-355bb401f61d');
    assert.equal(tasks[1].expectedAnswer, 'F478A7');
});

test('GAIA auto optimizer selects the next practice task from cursor state', () => {
    const first = selectNextTask({
        state: { practiceCursor: 0 },
        policy: { taskSource: 'practice' },
        args: {}
    });
    assert.equal(first.title, 'Secret Santa DOCX');

    const second = selectNextTask({
        state: { practiceCursor: 1 },
        policy: { taskSource: 'practice' },
        args: {}
    });
    assert.equal(second.title, 'Excel Map Path');

    const done = selectNextTask({
        state: { practiceCursor: 2 },
        policy: { taskSource: 'practice' },
        args: {}
    });
    assert.equal(done, null);
});

test('GAIA auto optimizer normalizes exact answers for local scoring', () => {
    assert.equal(normalizeAnswer('Final answer: Fred.'), 'fred.');
    assert.equal(normalizeAnswer('"F478A7"'), 'f478a7');
});

test('GAIA auto optimizer parses repair retry controls', () => {
    const args = parseArgs(['--once', '--clear-repair', '--task-id', 'task-1', '--task-retries', '2']);
    assert.equal(args.once, true);
    assert.equal(args.clearRepair, true);
    assert.equal(args.taskId, 'task-1');
    assert.equal(args.taskRetries, 2);
    assert.equal(resolveTaskRetries({ taskRetries: 0 }, args), 2);
    assert.equal(resolveTaskRetries({ taskRetries: 1 }, { taskRetries: null }), 1);
});

test('GAIA auto optimizer can continue after failed tasks when policy allows backlog repair', () => {
    assert.equal(shouldContinueAfterFailure({ continueAfterFailure: true, stopWhen: ['repair_required'] }), true);
    assert.equal(shouldContinueAfterFailure({ stopWhen: ['all_tasks_passed'] }), true);
    assert.equal(shouldContinueAfterFailure({ stopWhen: ['repair_required'] }), false);
    assert.equal(shouldContinueAfterVerdict({ continueAfterFailure: true, stopWhen: ['repair_required'] }, { failureCategory: 'web_retrieval_mcp' }), true);
    assert.equal(shouldContinueAfterVerdict({ continueAfterFailure: true, stopWhen: ['repair_required'] }, { failureCategory: 'environment' }), false);
});

test('GAIA auto optimizer classifies successful high-loop tasks as efficiency work', () => {
    const task = buildPracticeTasks()[0];
    const result = {
        ok: true,
        submitted_answer: 'Fred',
        step_count: 12,
        steps: Array.from({ length: 12 }, (_, index) => ({
            tool: index % 2 ? 'mcp__ailis_research__read_document' : 'tool_search',
            response: { ok: true, status: 'completed', result: { content: [{ text: 'ok' }] } }
        }))
    };
    const chain = extractExecutionChain({ task, result, processResult: { ok: true }, summary: null });
    const verdict = classifyGaiaResult({ task, result, chain, processResult: { ok: true }, summary: null });
    assert.equal(verdict.ok, true);
    assert.equal(verdict.status, 'passed_efficiency_review_needed');
    assert.equal(verdict.optimizationFocus, 'efficiency');
});

test('GAIA auto optimizer does not accept official runner success when scorer rejects answer', () => {
    const task = {
        taskId: 'official-validation-l1-offset-0',
        source: 'official',
        title: 'Official GAIA validation level 1 offset 0'
    };
    const result = {
        ok: true,
        status: 'completed',
        task_id: 'e1fc63a2-da7a-432f-be78-7c4a95598703',
        submitted_answer: '1000',
        steps: [{
            tool: 'mcp__ailis_research__web_fetch',
            response: { ok: true, status: 'completed', result: { content: [{ text: 'ready evidence' }] } }
        }]
    };
    const summary = {
        score: {
            correct_count: 0,
            total_attempted: 1,
            per_task: [{
                task_id: 'e1fc63a2-da7a-432f-be78-7c4a95598703',
                correct: false,
                submitted_answer: '1000',
                final_answer: '17'
            }]
        }
    };
    const chain = extractExecutionChain({ task, result, processResult: { ok: true }, summary });
    const verdict = classifyGaiaResult({ task, result, chain, processResult: { ok: true }, summary });

    assert.equal(verdict.ok, false);
    assert.equal(verdict.failureCategory, 'harness_finalization');
    assert.match(verdict.summary, /1000/);
    assert.match(verdict.summary, /17/);
});

test('GAIA auto optimizer classifies provider failures before scorer empty-answer rejection', () => {
    const task = {
        taskId: 'official-validation-l1-offset-33',
        source: 'official',
        title: 'Official GAIA validation level 1 offset 33'
    };
    const result = {
        ok: false,
        status: 'provider_error',
        submitted_answer: '',
        raw_status: {
            ok: false,
            status: 'provider_error',
            error: 'The request failed because your account has an overdue balance.'
        }
    };
    const summary = {
        score: {
            correct_count: 0,
            total_attempted: 1,
            per_task: [{
                task_id: '0383a3ee-47a7-41a4-b493-519bdefe0488',
                correct: false,
                submitted_answer: '',
                final_answer: 'Rockhopper penguin'
            }]
        }
    };
    const chain = extractExecutionChain({ task, result, processResult: { ok: true }, summary });
    const verdict = classifyGaiaResult({ task, result, chain, processResult: { ok: true }, summary });

    assert.equal(verdict.ok, false);
    assert.equal(verdict.failureCategory, 'environment');
    assert.equal(verdict.optimizationFocus, 'configuration_and_provider_readiness');
});

test('GAIA auto optimizer classifies artifact tool failures before model reasoning', () => {
    const task = buildPracticeTasks()[1];
    const result = {
        ok: false,
        status: 'missing_exact_answer',
        submitted_answer: '',
        steps: [{
            tool: 'mcp__ailis_research__read_spreadsheet',
            response: {
                ok: false,
                status: 'error',
                error: 'cell fill colors missing from workbook evidence'
            }
        }]
    };
    const chain = extractExecutionChain({ task, result, processResult: { ok: true }, summary: null });
    const verdict = classifyGaiaResult({ task, result, chain, processResult: { ok: true }, summary: null });
    assert.equal(verdict.ok, false);
    assert.equal(verdict.failureCategory, 'tools_mcp');
    assert.equal(verdict.optimizationFocus, 'artifact_tools_mcp');
});

test('GAIA auto optimizer classifies web JS shell failures as web retrieval MCP work', () => {
    const task = { taskId: 'web-task', source: 'practice', title: 'web task' };
    const result = {
        ok: false,
        status: 'missing_exact_answer',
        submitted_answer: '',
        steps: [{
            tool: 'mcp__ailis_research__web_fetch',
            response: {
                ok: true,
                status: 'completed',
                result: {
                    structuredContent: {
                        evidenceQuality: 'js_shell',
                        evidenceGap: 'The fetched page is only a JavaScript loading shell.'
                    }
                }
            }
        }]
    };
    const chain = extractExecutionChain({ task, result, processResult: { ok: true }, summary: null });
    const verdict = classifyGaiaResult({ task, result, chain, processResult: { ok: true }, summary: null });
    assert.equal(verdict.failureCategory, 'web_retrieval_mcp');
});
