import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { spawn, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(SCRIPT_DIR, '..');
const DEFAULT_JOB_DIR = path.join(
    PROJECT_ROOT,
    'longrun',
    'jobs',
    'ailis-memory-v3-longmemeval-full-20260731'
);

function argValue(name, fallback = '') {
    const index = process.argv.indexOf(name);
    return index >= 0 ? String(process.argv[index + 1] || fallback) : fallback;
}

const JOB_DIR = path.resolve(argValue('--job-dir', DEFAULT_JOB_DIR));
const STATE_PATH = path.join(JOB_DIR, 'state.json');
const PROGRESS_PATH = path.join(JOB_DIR, 'progress.json');
const POLICY_PATH = path.join(JOB_DIR, 'loop-policy.json');
const CONTROL_PATH = path.join(JOB_DIR, 'control-queue.jsonl');
const EVENT_LOG_PATH = path.join(JOB_DIR, 'event-log.jsonl');
const LOCK_PATH = path.join(JOB_DIR, 'controller.lock.json');
const STOP_PATH = path.join(JOB_DIR, 'stop.flag');
const CONTROLLER_STDOUT = path.join(JOB_DIR, 'controller.stdout.log');
const CONTROLLER_STDERR = path.join(JOB_DIR, 'controller.stderr.log');
const GENERATION_STDOUT = path.join(JOB_DIR, 'generation.stdout.log');
const GENERATION_STDERR = path.join(JOB_DIR, 'generation.stderr.log');
const JUDGE_STDOUT = path.join(JOB_DIR, 'judge.stdout.log');
const JUDGE_STDERR = path.join(JOB_DIR, 'judge.stderr.log');

function readJson(filePath, fallback = {}) {
    try {
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch {
        return fallback;
    }
}

function writeJsonAtomic(filePath, value) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    const temporary = `${filePath}.tmp-${process.pid}`;
    fs.writeFileSync(temporary, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
    let lastError = null;
    for (let attempt = 0; attempt < 5; attempt += 1) {
        try {
            fs.renameSync(temporary, filePath);
            return;
        } catch (error) {
            lastError = error;
            if (!['EBUSY', 'EACCES', 'EPERM'].includes(error?.code)) break;
            Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 25 * (attempt + 1));
        }
    }
    try { fs.unlinkSync(temporary); } catch {}
    throw lastError;
}

function appendEvent(type, summary, extra = {}) {
    const state = readJson(STATE_PATH, {});
    const event = {
        at: new Date().toISOString(),
        type,
        jobId: state.jobId || path.basename(JOB_DIR),
        iteration: Number(state.iteration) || 0,
        summary,
        artifactPaths: [],
        failureCategory: null,
        ...extra
    };
    fs.appendFileSync(EVENT_LOG_PATH, `${JSON.stringify(event)}\n`, 'utf8');
}

function isPidAlive(pid) {
    const normalized = Math.trunc(Number(pid));
    if (!Number.isFinite(normalized) || normalized <= 0) return false;
    try {
        process.kill(normalized, 0);
        return true;
    } catch {
        return false;
    }
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function lineCount(filePath) {
    if (!fs.existsSync(filePath)) return 0;
    const text = fs.readFileSync(filePath, 'utf8').trim();
    return text ? text.split(/\r?\n/).length : 0;
}

function tailText(filePath, maxBytes = 131072) {
    if (!fs.existsSync(filePath)) return '';
    const stat = fs.statSync(filePath);
    const length = Math.min(stat.size, maxBytes);
    const descriptor = fs.openSync(filePath, 'r');
    try {
        const buffer = Buffer.alloc(length);
        fs.readSync(descriptor, buffer, 0, length, stat.size - length);
        return buffer.toString('utf8');
    } finally {
        fs.closeSync(descriptor);
    }
}

function terminateTree(pid) {
    if (!isPidAlive(pid)) return;
    if (process.platform === 'win32') {
        spawnSync('taskkill.exe', ['/PID', String(pid), '/T', '/F'], {
            windowsHide: true,
            stdio: 'ignore'
        });
    } else {
        try { process.kill(pid, 'SIGTERM'); } catch {}
    }
}

function acquireLease() {
    fs.mkdirSync(JOB_DIR, { recursive: true });
    if (fs.existsSync(LOCK_PATH)) {
        const existing = readJson(LOCK_PATH, {});
        if (isPidAlive(existing.pid)) {
            throw new Error(`controller already running with PID ${existing.pid}`);
        }
        fs.unlinkSync(LOCK_PATH);
    }
    const descriptor = fs.openSync(LOCK_PATH, 'wx');
    fs.writeFileSync(descriptor, `${JSON.stringify({
        pid: process.pid,
        acquiredAt: new Date().toISOString()
    }, null, 2)}\n`);
    fs.closeSync(descriptor);
}

function releaseLease() {
    try {
        const lock = readJson(LOCK_PATH, {});
        if (Number(lock.pid) === process.pid) fs.unlinkSync(LOCK_PATH);
    } catch {}
}

function updateState(patch) {
    const next = {
        ...readJson(STATE_PATH, {}),
        ...patch,
        controllerPid: process.pid,
        updatedAt: new Date().toISOString()
    };
    writeJsonAtomic(STATE_PATH, next);
    return next;
}

function updateProgress(patch) {
    const previous = readJson(PROGRESS_PATH, {});
    const next = {
        ...previous,
        ...patch,
        jobId: previous.jobId || path.basename(JOB_DIR),
        controllerPid: process.pid,
        lastUpdateAt: new Date().toISOString()
    };
    writeJsonAtomic(PROGRESS_PATH, next);
    return next;
}

function generationPaths(state) {
    const outputDir = path.join(
        PROJECT_ROOT,
        'eval-results',
        'longmemeval-ailis',
        state.generationRunId
    );
    return {
        outputDir,
        statusPath: path.join(outputDir, 'parallel-status.json'),
        resultsPath: path.join(outputDir, 'results.jsonl'),
        shardManifestPath: path.join(outputDir, 'shards', 'manifest.json'),
        hypothesesPath: path.join(outputDir, 'hypotheses.jsonl'),
        judgeDir: path.join(outputDir, state.judgeRunId),
        judgeSummaryPath: path.join(outputDir, state.judgeRunId, 'summary.json')
    };
}

function generationSnapshot(state, policy) {
    const paths = generationPaths(state);
    const status = readJson(paths.statusPath, {});
    const progress = status.progress || {};
    return {
        paths,
        phase: status.phase || 'not_started',
        assigned: Number(progress.assigned) || Number(policy.datasetQuestionCount) || 500,
        completed: Number(progress.completed) || 0,
        failed: Number(progress.failed) || 0,
        pending: Number.isFinite(Number(progress.pending))
            ? Number(progress.pending)
            : Number(policy.datasetQuestionCount) || 500,
        updatedAt: status.updatedAt || status.startedAt || null,
        resultLines: lineCount(paths.resultsPath)
    };
}

function judgeSnapshot(state) {
    const { judgeSummaryPath, judgeDir } = generationPaths(state);
    const summary = readJson(judgeSummaryPath, {});
    const status = readJson(path.join(judgeDir, 'status.json'), {});
    return {
        summary,
        status,
        completed: Number(summary.completed || status.completed) || 0,
        failed: Number(summary.failed || status.failed) || 0,
        expected: Number(summary.expected || status.expected) || 500,
        accuracy: Number.isFinite(Number(summary.accuracy))
            ? Number(summary.accuracy)
            : null
    };
}

function classifyFailure() {
    const text = [
        tailText(GENERATION_STDERR),
        tailText(GENERATION_STDOUT),
        tailText(JUDGE_STDERR),
        tailText(JUDGE_STDOUT)
    ].join('\n').toLowerCase();
    if (/usage.?limit|quota|credits?|purchase more/.test(text)) {
        return 'usage_limited';
    }
    if (/timeout|timed out|econnreset|socket|disconnect|network/.test(text)) {
        return 'runtime_failed';
    }
    return 'runner_failed';
}

function consumeControls(state) {
    const lines = fs.existsSync(CONTROL_PATH)
        ? fs.readFileSync(CONTROL_PATH, 'utf8').split(/\r?\n/).filter(Boolean)
        : [];
    let paused = state.paused === true;
    let stop = false;
    for (let index = Number(state.consumedControlLines) || 0; index < lines.length; index += 1) {
        let command = null;
        try { command = JSON.parse(lines[index]); } catch {}
        if (!command?.type) continue;
        if (command.type === 'STOP') stop = true;
        if (command.type === 'PAUSE') paused = true;
        if (command.type === 'CONTINUE') paused = false;
        appendEvent('CONTROL_CONSUMED', `Consumed ${command.type} command.`, {
            artifactPaths: [CONTROL_PATH]
        });
    }
    return updateState({
        paused,
        consumedControlLines: lines.length,
        stopRequested: stop || state.stopRequested === true
    });
}

function spawnLogged(kind, args, stdoutPath, stderrPath, environment = {}) {
    const stdout = fs.openSync(stdoutPath, 'a');
    const stderr = fs.openSync(stderrPath, 'a');
    const child = spawn(process.execPath, args, {
        cwd: PROJECT_ROOT,
        env: {
            ...process.env,
            AILIS_CODEX_REASONING_EFFORT: 'medium',
            ...environment
        },
        windowsHide: true,
        stdio: ['ignore', stdout, stderr]
    });
    fs.closeSync(stdout);
    fs.closeSync(stderr);
    appendEvent('AGENT_RUN_STARTED', `Started ${kind} process ${child.pid}.`, {
        artifactPaths: [stdoutPath, stderrPath]
    });
    updateState({
        activeChild: {
            kind,
            pid: child.pid,
            startedAt: new Date().toISOString()
        }
    });
    return child.pid;
}

function generationArgs(state, policy) {
    const { outputDir } = generationPaths(state);
    return [
        path.join(PROJECT_ROOT, 'scripts', 'run-ailis-longmemeval-parallel.mjs'),
        '--dataset', 's',
        '--workers', String(policy.generationWorkers || 1),
        '--run-id', state.generationRunId,
        '--output-dir', outputDir,
        '--memory-strategy', 'hybrid_rrf_ledger_v3',
        '--memory-local-embeddings',
        '--memory-embedding-revision', '761b726dd34fb83930e26aab4e9ac3899aa1fa78',
        '--memory-model-cache-dir', 'D:\\RelocatedCaches\\huggingface\\transformers',
        '--memory-models-offline',
        '--provider', 'codex-model-bridge',
        '--base-url', 'codex://chatgpt-oauth',
        '--model', policy.candidateModel || 'gpt-5.6-sol',
        '--timeout-ms', String(policy.timeoutMs || 600000),
        '--max-worker-retries', String(policy.maxWorkerRetries ?? 2),
        '--worker-start-stagger-ms', String(policy.workerStartStaggerMs || 0),
        '--resume-question-state',
        '--progress-interval-ms', '10000'
    ];
}

function judgeArgs(state, policy) {
    return [
        path.join(PROJECT_ROOT, 'scripts', 'run-longmemeval-codex-judge.mjs'),
        '--source-run-id', state.generationRunId,
        '--judge-run-id', state.judgeRunId,
        '--model', policy.judgeModel || 'gpt-5.6-sol',
        '--reasoning-effort', policy.judgeReasoningEffort || 'medium',
        '--workers', String(policy.judgeWorkers || 1)
    ];
}

function latestResults(resultsPath) {
    const latest = new Map();
    if (!fs.existsSync(resultsPath)) return latest;
    for (const line of fs.readFileSync(resultsPath, 'utf8').split(/\r?\n/)) {
        if (!line.trim()) continue;
        try {
            const row = JSON.parse(line);
            if (row.question_id) latest.set(row.question_id, row);
        } catch {}
    }
    return latest;
}

function finalize(state, policy) {
    const paths = generationPaths(state);
    const results = [...latestResults(paths.resultsPath).values()]
        .filter((row) => row.completed === true);
    const judge = readJson(paths.judgeSummaryPath, {});
    const shardManifest = readJson(paths.shardManifestPath, {});
    const workerByQuestionId = new Map(
        (Array.isArray(shardManifest.entries) ? shardManifest.entries : [])
            .map((entry) => [entry.question_id, Number(entry.worker)])
    );
    const macro = (field) => results.length
        ? results.reduce((sum, row) => sum + Number(row.retrieval?.[field] || 0), 0) / results.length
        : 0;
    const weighted = (recallField, countField) => {
        const denominator = results.reduce(
            (sum, row) => sum + Number(row.retrieval?.[countField] || 0),
            0
        );
        const numerator = results.reduce(
            (sum, row) => sum +
                Number(row.retrieval?.[recallField] || 0) *
                Number(row.retrieval?.[countField] || 0),
            0
        );
        return denominator ? numerator / denominator : 0;
    };
    let ledgerRecords = 0;
    let emptySources = 0;
    let missingSources = 0;
    let taskSources = 0;
    let danglingSupersession = 0;
    let processedEvents = 0;
    let missingLedgerFiles = 0;
    for (const row of results) {
        const worker = workerByQuestionId.get(row.question_id);
        if (!Number.isInteger(worker) || worker < 0) {
            missingLedgerFiles += 1;
            continue;
        }
        const memoryDir = path.join(
            paths.outputDir,
            'shards',
            `worker-${String(worker).padStart(2, '0')}`,
            'state',
            row.question_id,
            'memory'
        );
        const ledgerPath = path.join(memoryDir, 'event-action-ledger.v3.json');
        if (!fs.existsSync(ledgerPath)) {
            missingLedgerFiles += 1;
            continue;
        }
        const ledger = readJson(ledgerPath, {});
        const events = new Map();
        const eventPath = path.join(memoryDir, 'events.jsonl');
        if (fs.existsSync(eventPath)) {
            for (const line of fs.readFileSync(eventPath, 'utf8').split(/\r?\n/)) {
                if (!line.trim()) continue;
                try {
                    const event = JSON.parse(line);
                    events.set(event.id, event);
                } catch {}
            }
        }
        const records = Array.isArray(ledger.records) ? ledger.records : [];
        const recordIds = new Set(records.map((record) => record.id));
        processedEvents += Array.isArray(ledger.processedEventIds)
            ? ledger.processedEventIds.length
            : 0;
        ledgerRecords += records.length;
        for (const record of records) {
            const sourceIds = Array.isArray(record.sourceEventIds)
                ? record.sourceEventIds
                : [];
            if (!sourceIds.length) emptySources += 1;
            for (const sourceId of sourceIds) {
                const event = events.get(sourceId);
                if (!event) {
                    missingSources += 1;
                    continue;
                }
                if (/task.?agent/i.test(`${event.source || ''} ${event.sessionId || ''}`)) {
                    taskSources += 1;
                }
            }
            for (const reference of [
                ...(record.supersedes || []),
                ...(record.supersededBy || [])
            ]) {
                if (reference && !recordIds.has(reference)) danglingSupersession += 1;
            }
        }
    }
    const taskAgentSteps = results.reduce(
        (sum, row) => sum + Number(row.invariants?.taskAgentStepCount || 0),
        0
    );
    const shortTermMessages = results.reduce(
        (sum, row) => sum + Number(row.invariants?.shortTermMessageCount || 0),
        0
    );
    const denseFallbackRows = results.filter(
        (row) => row.retrieval?.memoryStrategyDiagnostics?.embedding?.lastError
    ).length;
    const verdict = {
        jobId: state.jobId,
        completedAt: new Date().toISOString(),
        candidateModel: policy.candidateModel || 'gpt-5.6-sol',
        generation: {
            completed: results.length,
            failed: 500 - results.length
        },
        judge: {
            completed: Number(judge.completed) || 0,
            failed: Number(judge.failed) || 0,
            correct: Number(judge.correct) || 0,
            accuracy: Number(judge.accuracy) || 0,
            leaderboardComparable: judge.leaderboardComparable === true,
            byQuestionType: judge.byQuestionType || {}
        },
        retrieval: {
            macroSessionR8: macro('evidenceSessionRecallAt8'),
            macroTurnR8: macro('evidenceTurnRecallAt8'),
            microSessionR8: weighted('evidenceSessionRecallAt8', 'evidenceSessionCount'),
            microTurnR8: weighted('evidenceTurnRecallAt8', 'evidenceTurnCount')
        },
        invariants: {
            taskAgentSteps,
            shortTermMessages,
            denseFallbackRows
        },
        provenance: {
            processedEvents,
            ledgerRecords,
            missingLedgerFiles,
            emptySources,
            missingSources,
            taskSources,
            danglingSupersession
        }
    };
    verdict.accepted =
        verdict.generation.completed === 500 &&
        verdict.judge.completed === 500 &&
        verdict.judge.failed === 0 &&
        taskAgentSteps === 0 &&
        shortTermMessages === 0 &&
        denseFallbackRows === 0 &&
        missingLedgerFiles === 0 &&
        emptySources === 0 &&
        missingSources === 0 &&
        taskSources === 0 &&
        danglingSupersession === 0;
    writeJsonAtomic(path.join(JOB_DIR, 'verdict.json'), verdict);
    const report = [
        '# AILIS Memory v3 — Full LongMemEval Report',
        '',
        `Completed at: ${verdict.completedAt}`,
        '',
        `- Generation: ${verdict.generation.completed}/500`,
        `- Candidate model: ${verdict.candidateModel}`,
        `- Official-prompt Codex Judge: ${verdict.judge.correct}/${verdict.judge.completed} (${(verdict.judge.accuracy * 100).toFixed(2)}%)`,
        ...Object.entries(verdict.judge.byQuestionType).map(([type, metrics]) =>
            `  - ${type}: ${Number(metrics.correct) || 0}/${Number(metrics.total) || 0} (${(Number(metrics.accuracy) * 100).toFixed(2)}%)`
        ),
        `- Macro Session R@8: ${verdict.retrieval.macroSessionR8.toFixed(4)}`,
        `- Macro Turn R@8: ${verdict.retrieval.macroTurnR8.toFixed(4)}`,
        `- Micro Session R@8: ${verdict.retrieval.microSessionR8.toFixed(4)}`,
        `- Micro Turn R@8: ${verdict.retrieval.microTurnR8.toFixed(4)}`,
        `- Ledger records: ${verdict.provenance.ledgerRecords}`,
        `- Missing Ledger files: ${verdict.provenance.missingLedgerFiles}`,
        `- Missing/empty/TaskAgent sources: ${missingSources}/${emptySources}/${taskSources}`,
        `- TaskAgent steps: ${taskAgentSteps}`,
        `- Dense fallback rows: ${denseFallbackRows}`,
        `- Acceptance: ${verdict.accepted ? 'passed' : 'failed'}`,
        '',
        'The official QA prompt and aggregation are preserved, but the judge is',
        'Codex rather than the leaderboard GPT-4o judge; this score is not directly',
        'leaderboard comparable.',
        ''
    ].join('\n');
    fs.writeFileSync(path.join(JOB_DIR, 'final-report.md'), report, 'utf8');
    fs.writeFileSync(
        path.join(paths.outputDir, 'MEMORY_V3_FULL_REPORT.md'),
        report,
        'utf8'
    );
    return verdict;
}

async function main() {
    acquireLease();
    let policy = readJson(POLICY_PATH, {});
    if (lineCount(EVENT_LOG_PATH) === 0) {
        appendEvent('JOB_STARTED', 'Full 500-question native AILIS evaluation job started.', {
            artifactPaths: [
                path.join(JOB_DIR, 'mission.md'),
                path.join(JOB_DIR, 'acceptance.md'),
                POLICY_PATH
            ]
        });
    }
    let state = updateState({
        status: 'running',
        startedAt: readJson(STATE_PATH, {}).startedAt || new Date().toISOString()
    });
    appendEvent('CONTROLLER_STARTED', `Controller PID ${process.pid} started.`, {
        artifactPaths: [STATE_PATH, PROGRESS_PATH]
    });
    const deadline = Date.parse(state.startedAt) +
        Number(policy.durationHours || 720) * 60 * 60 * 1000;

    while (true) {
        policy = readJson(POLICY_PATH, policy);
        state = consumeControls(readJson(STATE_PATH, state));
        if (fs.existsSync(STOP_PATH) || state.stopRequested) {
            terminateTree(state.activeChild?.pid);
            updateState({ status: 'stopped', activeChild: null });
            updateProgress({
                status: 'stopped',
                currentAction: 'stopped by user control',
                activeAgentRuns: 0,
                nextAction: 'append CONTINUE and remove stop.flag before restart',
                risk: 'user_stop'
            });
            appendEvent('JOB_STOPPED', 'Stopped by user control.');
            break;
        }
        if (Date.now() >= deadline) {
            terminateTree(state.activeChild?.pid);
            updateState({ status: 'stopped', activeChild: null });
            updateProgress({
                status: 'stopped',
                currentAction: 'duration expired',
                activeAgentRuns: 0,
                nextAction: 'extend loop policy and restart controller',
                risk: 'duration_expired'
            });
            appendEvent('JOB_STOPPED', 'Configured duration expired.');
            break;
        }
        if (state.paused) {
            terminateTree(state.activeChild?.pid);
            state = updateState({ status: 'sleeping', activeChild: null });
            updateProgress({
                status: 'sleeping',
                currentAction: 'paused by control queue',
                activeAgentRuns: 0,
                nextAction: 'wait for CONTINUE',
                risk: 'paused'
            });
            await sleep(30000);
            continue;
        }

        const generation = generationSnapshot(state, policy);
        if (generation.completed >= Number(policy.datasetQuestionCount || 500)) {
            const judge = judgeSnapshot(state);
            if (judge.completed >= Number(policy.datasetQuestionCount || 500) && judge.failed === 0) {
                const verdict = finalize(state, policy);
                updateState({
                    status: verdict.accepted ? 'completed' : 'failed',
                    activeChild: null,
                    completedAt: new Date().toISOString()
                });
                updateProgress({
                    status: verdict.accepted ? 'completed' : 'failed',
                    currentAction: 'final report generated',
                    activeAgentRuns: 0,
                    completedSteps: 1000,
                    failedSteps: verdict.accepted ? 0 : 1,
                    latestArtifactPath: path.join(JOB_DIR, 'verdict.json'),
                    latestEvidence: `judge ${verdict.judge.correct}/${verdict.judge.completed}`,
                    nextAction: verdict.accepted ? 'none' : 'inspect verdict',
                    risk: verdict.accepted ? 'none' : 'verifier_failed'
                });
                appendEvent(
                    verdict.accepted ? 'JOB_COMPLETED' : 'ITERATION_FAILED',
                    verdict.accepted
                        ? 'Full benchmark and audits completed.'
                        : 'Full benchmark completed but acceptance audit failed.',
                    {
                        artifactPaths: [
                            path.join(JOB_DIR, 'verdict.json'),
                            path.join(JOB_DIR, 'final-report.md')
                        ],
                        failureCategory: verdict.accepted ? null : 'verifier_failed'
                    }
                );
                break;
            }
            if (state.activeChild?.kind === 'generation') {
                if (isPidAlive(state.activeChild.pid)) {
                    updateProgress({
                        status: 'running',
                        currentAction: `generation PID ${state.activeChild.pid} is finalizing artifacts`,
                        activeAgentRuns: 1,
                        completedSteps: generation.completed,
                        failedSteps: generation.failed,
                        latestArtifactPath: generation.paths.statusPath,
                        latestEvidence: `generation ${generation.completed}/500`,
                        nextAction: 'wait for clean generation exit, then start judge',
                        risk: 'none'
                    });
                    await sleep(Number(policy.pollSeconds || 30) * 1000);
                    continue;
                }
                state = updateState({ activeChild: null, consecutiveFailures: 0 });
            }
            if (state.activeChild?.kind === 'judge' && !isPidAlive(state.activeChild.pid)) {
                const failure = classifyFailure();
                const failures = Number(state.consecutiveFailures || 0) + 1;
                const backoffMinutes = failure === 'usage_limited'
                    ? Number(policy.usageLimitBackoffMinutes || 360)
                    : failures >= Number(policy.maxRepairAttemptsPerIssue || 3)
                        ? Number(policy.runtimeFailureBackoffMinutes || 5) * 3
                        : Number(policy.runtimeFailureBackoffMinutes || 5);
                appendEvent('FAILURE_CLASSIFIED', 'Judge process ended before all judgments completed.', {
                    failureCategory: failure === 'usage_limited' ? 'runtime_failed' : failure,
                    artifactPaths: [JUDGE_STDERR, JUDGE_STDOUT]
                });
                state = updateState({
                    activeChild: null,
                    consecutiveFailures: failures,
                    lastFailureCategory: failure
                });
                updateProgress({
                    status: 'sleeping',
                    currentAction: `backing off after judge ${failure}`,
                    activeAgentRuns: 0,
                    completedSteps: generation.completed + judge.completed,
                    failedSteps: judge.failed,
                    latestArtifactPath: JUDGE_STDERR,
                    latestEvidence: `judge ${judge.completed}/${judge.expected}`,
                    nextAction: `resume judge in ${backoffMinutes} minutes`,
                    risk: failure
                });
                await sleep(backoffMinutes * 60 * 1000);
                continue;
            }
            if (!isPidAlive(state.activeChild?.pid)) {
                const pid = spawnLogged(
                    'judge',
                    judgeArgs(state, policy),
                    JUDGE_STDOUT,
                    JUDGE_STDERR
                );
                state = readJson(STATE_PATH, state);
                updateProgress({
                    status: 'verifying',
                    currentAction: `judging 500 hypotheses with PID ${pid}`,
                    activeAgentRuns: 1,
                    completedSteps: generation.completed + judge.completed,
                    failedSteps: judge.failed,
                    latestArtifactPath: generation.paths.judgeSummaryPath,
                    latestEvidence: `generation ${generation.completed}/500`,
                    nextAction: 'resume pending judgments or finalize audit',
                    risk: 'none'
                });
            } else {
                updateProgress({
                    status: 'verifying',
                    currentAction: `judge PID ${state.activeChild.pid} running`,
                    activeAgentRuns: 1,
                    completedSteps: generation.completed + judge.completed,
                    failedSteps: judge.failed,
                    latestArtifactPath: generation.paths.judgeSummaryPath,
                    latestEvidence: `judge ${judge.completed}/${judge.expected}`,
                    nextAction: 'continue judge',
                    risk: 'none'
                });
            }
            await sleep(Number(policy.pollSeconds || 30) * 1000);
            continue;
        }

        if (isPidAlive(state.activeChild?.pid)) {
            updateProgress({
                status: 'running',
                currentAction: `generation PID ${state.activeChild.pid} running`,
                activeAgentRuns: 1,
                completedSteps: generation.completed,
                failedSteps: generation.failed,
                latestArtifactPath: generation.paths.statusPath,
                latestEvidence: `${generation.completed}/500 completed; ${generation.failed} failed; ${generation.pending} pending`,
                nextAction: 'continue native AILIS generation',
                risk: generation.failed ? 'runtime_retrying' : 'none'
            });
            await sleep(Number(policy.pollSeconds || 30) * 1000);
            continue;
        }

        if (state.activeChild?.pid) {
            const failure = classifyFailure();
            const failures = Number(state.consecutiveFailures || 0) + 1;
            appendEvent('FAILURE_CLASSIFIED', `${state.activeChild.kind} process ended before acceptance.`, {
                failureCategory: failure === 'usage_limited' ? 'runtime_failed' : failure,
                artifactPaths: [GENERATION_STDERR, GENERATION_STDOUT]
            });
            state = updateState({
                activeChild: null,
                consecutiveFailures: failures,
                lastFailureCategory: failure
            });
            const backoffMinutes = failure === 'usage_limited'
                ? Number(policy.usageLimitBackoffMinutes || 360)
                : failures >= Number(policy.maxRepairAttemptsPerIssue || 3)
                    ? Number(policy.runtimeFailureBackoffMinutes || 5) * 3
                    : Number(policy.runtimeFailureBackoffMinutes || 5);
            updateProgress({
                status: 'sleeping',
                currentAction: `backing off after ${failure}`,
                activeAgentRuns: 0,
                completedSteps: generation.completed,
                failedSteps: generation.failed,
                latestArtifactPath: GENERATION_STDERR,
                latestEvidence: `${generation.completed}/500 completed`,
                nextAction: `resume in ${backoffMinutes} minutes`,
                risk: failure
            });
            await sleep(backoffMinutes * 60 * 1000);
            continue;
        }

        const pid = spawnLogged(
            'generation',
            generationArgs(state, policy),
            GENERATION_STDOUT,
            GENERATION_STDERR,
            {
                AILIS_MEMORY_EMBEDDING_BATCH_SIZE: String(
                    policy.memoryEmbeddingBatchSize || 4
                ),
                OMP_NUM_THREADS: String(policy.nativeInferenceThreadsPerWorker || 1),
                ORT_NUM_THREADS: String(policy.nativeInferenceThreadsPerWorker || 1),
                OPENBLAS_NUM_THREADS: String(policy.nativeInferenceThreadsPerWorker || 1),
                MKL_NUM_THREADS: String(policy.nativeInferenceThreadsPerWorker || 1),
                OMP_WAIT_POLICY: 'PASSIVE',
                KMP_BLOCKTIME: '0'
            }
        );
        state = updateState({
            status: 'running',
            iteration: Number(state.iteration || 0) + 1,
            consecutiveFailures: 0
        });
        updateProgress({
            status: 'running',
            iteration: state.iteration,
            currentAction: `full generation PID ${pid} started`,
            activeAgentRuns: 1,
            completedSteps: generation.completed,
            failedSteps: generation.failed,
            latestArtifactPath: generation.paths.statusPath,
            latestEvidence: `${generation.completed}/500 completed before launch`,
            nextAction: 'monitor native AILIS generation',
            risk: 'none'
        });
        await sleep(Number(policy.pollSeconds || 30) * 1000);
    }
}

process.on('exit', releaseLease);
process.on('SIGINT', () => {
    appendEvent('CONTROLLER_STOPPED', 'Controller received SIGINT.');
    releaseLease();
    process.exit(130);
});
process.on('SIGTERM', () => {
    appendEvent('CONTROLLER_STOPPED', 'Controller received SIGTERM.');
    releaseLease();
    process.exit(143);
});

main().catch((error) => {
    try {
        appendEvent('JOB_BLOCKED', error?.stack || String(error), {
            failureCategory: 'orchestration_failed',
            artifactPaths: [CONTROLLER_STDERR]
        });
        updateState({ status: 'failed', lastError: error?.stack || String(error) });
        updateProgress({
            status: 'failed',
            currentAction: 'controller crashed',
            activeAgentRuns: 0,
            latestArtifactPath: CONTROLLER_STDERR,
            latestEvidence: error?.message || String(error),
            nextAction: 'restart controller after inspection',
            risk: 'orchestration_failed'
        });
    } finally {
        releaseLease();
    }
    console.error(error?.stack || error);
    process.exit(1);
});
