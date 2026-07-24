import assert from 'node:assert/strict';
import test from 'node:test';

import {
    buildPracticeTasks,
    classifyGaiaResult,
    enrichTaskFromGaiaResult,
    ensureSafetyState,
    evaluateSafetyGate,
    extractExecutionChain,
    isEmptyAnswerVerdict,
    normalizeAnswer,
    parseArgs,
    recordSafetyOutcome,
    resolveSafetyPolicy,
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

test('GAIA auto optimizer routes rejected web-derived answers to retrieval repair', () => {
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
    assert.equal(verdict.failureCategory, 'web_retrieval_mcp');
    assert.equal(verdict.optimizationFocus, 'web_search_web_fetch_mcp');
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

test('GAIA auto optimizer classifies rejected describe_image answers as tool extraction work', () => {
    const task = { taskId: 'official-validation-l1-offset-21', source: 'official', title: 'image fractions' };
    const result = {
        ok: true,
        status: 'completed',
        submitted_answer: '3/4,1/4,6/8,4/60',
        steps: [{
            tool: 'mcp__ailis_research__describe_image',
            title: 'Extract ordered fractions from image',
            args: { image_path: 'fraction-page.png' },
            response: {
                ok: true,
                status: 'completed',
                result: {
                    content: [{ type: 'text', text: '3/4,1/4,6/8,4/60' }],
                    structuredContent: {
                        ok: true,
                        status: 'completed',
                        path: 'fraction-page.png'
                    }
                }
            }
        }]
    };
    const summary = {
        score: {
            per_task: [{
                task_id: 'official-gaia-image-task',
                correct: false,
                submitted_answer: result.submitted_answer,
                final_answer: '3/4,1/4,3/4,1/15'
            }]
        }
    };
    const chain = extractExecutionChain({ task, result, processResult: { ok: true }, summary });
    const verdict = classifyGaiaResult({ task, result, chain, processResult: { ok: true }, summary });
    assert.equal(verdict.failureCategory, 'tools_mcp');
    assert.equal(verdict.optimizationFocus, 'vision_artifact_extraction_mcp');
    assert.equal(verdict.generalizedCapability, 'robust_image_ocr_and_visual_extraction');
});

test('GAIA auto optimizer enriches official task shells from runner result evidence', () => {
    const task = {
        source: 'official',
        taskId: 'official-validation-l1-offset-21',
        offset: 21,
        title: 'Official GAIA validation level 1 offset 21'
    };
    const result = {
        task_id: '9318445f-fe6a-4e1b-acbf-c68228c9906a',
        question: 'Using the provided image provide all fractions and sample answers.',
        file_name: '9318445f-fe6a-4e1b-acbf-c68228c9906a.png',
        file_path: '2023/validation/9318445f-fe6a-4e1b-acbf-c68228c9906a.png',
        answer_gate: { source: 'agent_final_answer', status: 'accepted' },
        finalizer: { ok: false, status: 'missing_evidence' }
    };
    const enriched = enrichTaskFromGaiaResult(task, result);
    assert.equal(enriched.gaiaTaskId, result.task_id);
    assert.equal(enriched.question, result.question);
    assert.equal(enriched.fileName, result.file_name);
    assert.equal(enriched.filePath, result.file_path);
    assert.deepEqual(enriched.lastAnswerGate, result.answer_gate);
    assert.deepEqual(enriched.lastFinalizer, result.finalizer);
});

test('GAIA auto optimizer resolves conservative spend-safety defaults', () => {
    const safety = resolveSafetyPolicy({});
    assert.equal(safety.enabled, true);
    assert.equal(safety.maxRepairBacklog, 5);
    assert.equal(safety.maxConsecutiveFailures, 3);
    assert.equal(safety.maxEmptyAnswerStreak, 2);
    assert.equal(safety.maxSameTaskAttempts, 2);
    assert.equal(safety.stopOnEnvironmentFailure, true);
});

test('GAIA auto optimizer blocks when repair backlog grows beyond safety limit', () => {
    const state = {
        repairBacklog: Array.from({ length: 5 }, (_, index) => ({ taskId: `task-${index}` }))
    };
    const gate = evaluateSafetyGate({}, state);
    assert.equal(gate.block, true);
    assert.equal(gate.reason, 'max_repair_backlog');
});

test('GAIA auto optimizer tracks empty answers and blocks repeated paid failures', () => {
    const state = {};
    const policy = { safety: { maxEmptyAnswerStreak: 2, maxRepairBacklog: 0 } };
    const task = { taskId: 'official-validation-l1-offset-1' };
    const emptyVerdict = {
        ok: false,
        failureCategory: 'harness_finalization',
        summary: 'Local GAIA scorer rejected the submitted answer ((empty)); expected Fred.',
        emptyAnswer: true
    };

    ensureSafetyState(state, policy);
    recordSafetyOutcome(state, { task, verdict: emptyVerdict, policy });
    assert.equal(isEmptyAnswerVerdict(emptyVerdict), true);
    assert.equal(evaluateSafetyGate(policy, state, { task, verdict: emptyVerdict }).block, false);

    recordSafetyOutcome(state, { task: { taskId: 'official-validation-l1-offset-2' }, verdict: emptyVerdict, policy });
    const gate = evaluateSafetyGate(policy, state, { task, verdict: emptyVerdict });
    assert.equal(gate.block, true);
    assert.equal(gate.reason, 'max_empty_answer_streak');
});

test('GAIA auto optimizer blocks repeated attempts of the same task', () => {
    const state = {};
    const policy = { safety: { maxSameTaskAttempts: 2, maxRepairBacklog: 0, maxEmptyAnswerStreak: 0 } };
    const task = { taskId: 'same-task' };
    const verdict = {
        ok: false,
        failureCategory: 'model_reasoning',
        summary: 'Wrong answer.',
        emptyAnswer: false
    };

    recordSafetyOutcome(state, { task, verdict, policy });
    assert.equal(evaluateSafetyGate(policy, state, { task, verdict }).block, false);
    recordSafetyOutcome(state, { task, verdict, policy });
    const gate = evaluateSafetyGate(policy, state, { task, verdict });
    assert.equal(gate.block, true);
    assert.equal(gate.reason, 'max_same_task_attempts');
});

test('GAIA auto optimizer blocks low recent pass rate before spending another batch', () => {
    const state = {};
    const policy = {
        safety: {
            maxRepairBacklog: 0,
            maxConsecutiveFailures: 0,
            maxEmptyAnswerStreak: 0,
            maxSameTaskAttempts: 0,
            recentWindow: 4,
            minRecentSample: 4,
            minRecentPassRate: 0.5
        }
    };
    for (let index = 0; index < 4; index += 1) {
        recordSafetyOutcome(state, {
            task: { taskId: `task-${index}` },
            verdict: {
                ok: index === 0,
                failureCategory: index === 0 ? '' : 'harness_finalization',
                summary: index === 0 ? 'Task passed.' : 'Wrong answer.',
                emptyAnswer: false
            },
            policy
        });
    }
    const gate = evaluateSafetyGate(policy, state);
    assert.equal(gate.block, true);
    assert.equal(gate.reason, 'low_recent_pass_rate');
});
