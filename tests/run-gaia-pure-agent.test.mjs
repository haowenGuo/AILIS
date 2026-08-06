import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
    buildPureAgentPayload,
    extractAgentFinalAnswer,
    parseArgs,
    prepareTaskWorkspace,
    runWithConfiguredDeadline,
    shouldRetryTask
} from '../scripts/run-gaia-pure-agent.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const RUNNER_PATH = path.join(PROJECT_ROOT, 'scripts', 'run-gaia-pure-agent.mjs');
const OFFICIAL_RUNNER_PATH = path.join(PROJECT_ROOT, 'scripts', 'run-gaia-official.mjs');

test('clean adapter defaults to production GPT-5.6 Luna and natural TaskAgent termination', () => {
    const args = parseArgs(['--run-id', 'clean-defaults']);
    assert.equal(args.codexModelBridge, true);
    assert.equal(args.codexModel, 'gpt-5.6-luna');
    assert.equal(args.codexReasoningEffort, 'medium');
    assert.equal(args.agentRole, 'task_agent');
    assert.equal(args.directToolExecutor, true);
    assert.equal(args.isolatedWorkspace, true);
    assert.equal(args.requestTimeoutMs, 0);
    assert.match(args.workspaceRoot, /ailis-agent-runtime/i);
});

test('clean adapter retains old transport settings and exposes production runtime overrides', () => {
    const workspaceRoot = path.join(os.tmpdir(), 'ailis-clean-config-test');
    const args = parseArgs([
        '--run-id', 'clean-cli',
        '--limit', '4',
        '--offset', '2',
        '--task-retries', '0',
        '--max-agent-steps', '57',
        '--request-timeout-ms', '45000',
        '--download-timeout-ms', '5000',
        '--llm-timeout-ms', '60000',
        '--temperature', '0.4',
        '--submit-timeout-ms', '7000',
        '--no-direct-tool-executor',
        '--agent-role', 'persona_orchestrator',
        '--no-codex-model-bridge',
        '--codex-model', 'configured-model',
        '--codex-reasoning-effort', 'high',
        '--desktop-workspace',
        '--workspace-root', workspaceRoot,
        '--submit'
    ]);
    assert.equal(args.limit, 4);
    assert.equal(args.offset, 2);
    assert.equal(args.taskRetries, 0);
    assert.equal(args.maxAgentSteps, 57);
    assert.equal(args.requestTimeoutMs, 45000);
    assert.equal(args.downloadTimeoutMs, 5000);
    assert.equal(args.llmTimeoutMs, 60000);
    assert.equal(args.temperature, 0.4);
    assert.equal(args.submitTimeoutMs, 7000);
    assert.equal(args.directToolExecutor, false);
    assert.equal(args.agentRole, 'persona_orchestrator');
    assert.equal(args.codexModelBridge, false);
    assert.equal(args.codexModel, 'configured-model');
    assert.equal(args.codexReasoningEffort, 'high');
    assert.equal(args.isolatedWorkspace, false);
    assert.equal(args.workspaceRoot, path.resolve(workspaceRoot));
    assert.equal(args.submit, true);
    for (const key of Object.keys(args)) {
        assert.doesNotMatch(key, /finalizer|solver|repair|evidenceGate/i);
    }
});

test('payload passes the original question unchanged without benchmark identity or a step cap', () => {
    const questionText = 'What is the exact answer? Preserve this wording verbatim.';
    const workspaceDir = path.join(os.tmpdir(), 'ailis-agent-runtime', 'opaque-workspace');
    const payload = buildPureAgentPayload({
        args: {
            directToolExecutor: true,
            agentRole: 'task_agent',
            isolatedWorkspace: true,
            maxAgentSteps: 20,
            benchmarkName: 'forbidden-benchmark-name',
            runId: 'forbidden-evaluation-run'
        },
        question: {
            task_id: 'forbidden-task-id',
            question: questionText
        },
        workspaceDir,
        runId: '44cb08e1-33d1-4e57-a9c1-91b0bb5b47d8',
        sessionId: '8471feaa-89f9-446c-b83c-5f06c903d364',
        llmSettings: {
            provider: 'codex-model-bridge',
            baseUrl: 'codex://chatgpt-oauth',
            model: 'gpt-5.6-luna',
            apiKey: '',
            timeoutMs: 120000
        }
    });

    assert.equal(payload.message, questionText);
    assert.deepEqual(payload.messageHistory, []);
    assert.deepEqual(payload.attachments, []);
    assert.equal(payload.memoryPolicy, 'disabled');
    assert.equal('answerOnly' in payload, false);
    assert.equal('exactAnswerMode' in payload, false);
    assert.equal('executionProfile' in payload, false);
    assert.equal(payload.context.agentRole, 'task_agent');
    assert.equal(payload.context.workspace, workspaceDir);
    assert.equal(payload.context.allowOutsideWorkspace, false);
    assert.equal(payload.context.allowComputerWideAccess, false);
    assert.equal(payload.context.approvalPolicy, 'never');
    assert.equal('maxSteps' in payload, false);
    assert.equal('maxAgentSteps' in payload, false);
    assert.equal('evaluationName' in payload.context, false);
    assert.equal('evaluationTaskId' in payload.context, false);
    const serialized = JSON.stringify(payload);
    assert.doesNotMatch(serialized, /forbidden-benchmark-name|forbidden-evaluation-run|forbidden-task-id/i);
});

test('isolated workspace uses an anonymous directory and generic attachment name', async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-clean-runner-test-'));
    const sourcePath = path.join(root, 'source-with-task-name.txt');
    await fs.writeFile(sourcePath, 'attachment data', 'utf8');
    try {
        const staged = await prepareTaskWorkspace({
            isolatedWorkspace: true,
            workspaceRoot: path.join(root, 'runtime')
        }, {
            task_id: 'public-task-identity',
            file_name: 'gold-bearing-name.txt'
        }, sourcePath);
        assert.equal(staged.displayName, 'attachment.txt');
        assert.equal(path.basename(staged.filePath), 'attachment.txt');
        assert.doesNotMatch(staged.workspaceDir, /public-task-identity|gold-bearing-name/i);
        assert.equal(await fs.readFile(staged.filePath, 'utf8'), 'attachment data');
    } finally {
        await fs.rm(root, { recursive: true, force: true });
    }
});

test('natural termination waits for AILIS and never sends an interrupt', async () => {
    let interruptCalls = 0;
    const gateway = {
        async runAgent() {
            return { ok: true, finalAnswer: 'The result is 3.' };
        },
        async interruptAgentRun() {
            interruptCalls += 1;
        }
    };
    const result = await runWithConfiguredDeadline({
        gateway,
        payload: { runId: 'run', sessionId: 'session' },
        timeoutMs: 0
    });
    assert.equal(result.deadlineTriggered, false);
    assert.equal(interruptCalls, 0);
    assert.equal(result.response.finalAnswer, 'The result is 3.');
});

test('an explicit outer deadline interrupts the same Agent run and awaits shutdown', async () => {
    let resolveRun;
    let interruptRequest = null;
    const gateway = {
        runAgent() {
            return new Promise((resolve) => {
                resolveRun = resolve;
            });
        },
        async interruptAgentRun(request) {
            interruptRequest = request;
            resolveRun({ ok: false, status: 'interrupted' });
            return { ok: true, status: 'interrupt_requested' };
        }
    };
    const result = await runWithConfiguredDeadline({
        gateway,
        payload: { runId: 'run-123', sessionId: 'session-456' },
        timeoutMs: 5
    });
    assert.equal(result.deadlineTriggered, true);
    assert.equal(result.response.status, 'interrupted');
    assert.deepEqual(interruptRequest, {
        runId: 'run-123',
        sessionId: 'session-456',
        reason: 'configured_run_deadline',
        source: 'dataset_transport_adapter'
    });
});

test('adapter submits the natural final answer emitted by AILIS', () => {
    assert.deepEqual(extractAgentFinalAnswer({
        displayText: 'visible text containing some other candidate',
        finalAnswer: 'AILIS natural final answer'
    }), {
        answer: 'AILIS natural final answer',
        source: 'finalAnswer'
    });

    assert.deepEqual(extractAgentFinalAnswer({
        taskRunHandoff: { finalAnswer: 'task result answer' },
        displayText: 'the visible text says gold answer'
    }), {
        answer: 'task result answer',
        source: 'task_result_final_answer'
    });

    assert.deepEqual(extractAgentFinalAnswer({
        finalAnswer: 'AILIS final response exactly as emitted'
    }), {
        answer: 'AILIS final response exactly as emitted',
        source: 'finalAnswer'
    });
});

test('adapter never mines visible persona text or tool evidence for an answer', () => {
    assert.deepEqual(extractAgentFinalAnswer({
        displayText: 'Final answer: 42',
        speechText: '42',
        steps: [{ response: { result: { answerCandidates: [{ answer: '42' }] } } }]
    }), { answer: '', source: '' });
});

test('adapter does not rewrite or normalize an AILIS answer', () => {
    assert.deepEqual(extractAgentFinalAnswer({
        finalAnswer: 'Using the calculation, the result is **17000 hours**.'
    }), {
        answer: 'Using the calculation, the result is **17000 hours**.',
        source: 'finalAnswer'
    });
});

test('adapter retries only transient failures that produced no Agent answer', () => {
    assert.equal(shouldRetryTask({ submitted_answer: '', status: 'provider_error' }), true);
    assert.equal(shouldRetryTask({ submitted_answer: '', status: 'configured_timeout_interrupted' }), true);
    assert.equal(shouldRetryTask({ submitted_answer: '', status: 'missing_agent_final_answer' }), false);
    assert.equal(shouldRetryTask({
        submitted_answer: 'wrong but Agent-authored answer',
        status: 'provider_error'
    }), false);
});

test('runner source contains no benchmark solver, second LLM, public-task recipe, or HTTP Agent wrapper', async () => {
    const source = await fs.readFile(RUNNER_PATH, 'utf8');
    const forbidden = [
        /callDesktopLlmProvider/,
        /finalizeAnswerFromEvidence/,
        /buildFinalAnswerGate/,
        /deterministicGiftAssignmentAnswer/,
        /deterministicPresentationAnswer/,
        /deterministicClinicalTrialsAnswer/,
        /CRUSTACEAN_TERMS/,
        /GIFT_INTEREST_HINTS/,
        /Emily Midkiff/i,
        /R\.\s*G\.\s*Arendt/i,
        /Secret Santa/i,
        /visibleContainsListParts/,
        /extractScaledUnitAnswerCandidates/,
        /collectEvidenceAnswerCandidateTexts/,
        /\/agent\/run/
    ];
    for (const pattern of forbidden) assert.doesNotMatch(source, pattern);
    assert.match(source, /message:\s*normalizeText\(question\.question\)/);
    assert.match(source, /gateway\.runAgent\(payload\)/);
    assert.match(source, /gateway\.interruptAgentRun/);
    assert.match(source, /loadDesktopStateSettings/);
    assert.match(source, /ailis-eval-runtime-config\.mjs/);
    assert.doesNotMatch(source, /run-ailis-desktop-real-gaia-eval\.mjs/);
    assert.match(source, /gpt-5\.6-luna/);
    assert.match(source, /protocol:\s*'clean_ailis_agent_v2'/);
});

test('official command invokes the clean adapter and forwards retained runtime configuration', async () => {
    const source = await fs.readFile(OFFICIAL_RUNNER_PATH, 'utf8');
    assert.match(source, /scripts\/run-gaia-pure-agent\.mjs/);
    assert.match(source, /gpt-5\.6-luna/);
    assert.match(source, /--codex-model-bridge/);
    assert.match(source, /--codex-model/);
    assert.match(source, /--codex-reasoning-effort/);
    assert.match(source, /--agent-role/);
    assert.match(source, /--isolated-workspace/);
    assert.doesNotMatch(source, /finalizer|deterministic solver|answer repair/i);
});
