import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';

const projectRoot = path.resolve(import.meta.dirname, '..');
const defaultJobId = 'ailis-toolsandbox-codex-full-20260717';
const argv = process.argv.slice(2);

function argValue(name, fallback = '') {
    const index = argv.indexOf(name);
    return index >= 0 && argv[index + 1] ? argv[index + 1] : fallback;
}

function readJson(filePath, fallback = {}) {
    try {
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch {
        return fallback;
    }
}

function writeJson(filePath, value) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    const tempPath = `${filePath}.${process.pid}.tmp`;
    fs.writeFileSync(tempPath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
    fs.renameSync(tempPath, filePath);
}

function appendEvent(filePath, event) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.appendFileSync(filePath, `${JSON.stringify(event)}\n`, 'utf8');
}

function isoNow() {
    return new Date().toISOString();
}

function isPidAlive(pid) {
    if (!Number.isInteger(pid) || pid <= 0) return false;
    try {
        process.kill(pid, 0);
        return true;
    } catch {
        return false;
    }
}

const jobId = argValue('--job-id', defaultJobId);
const runId = argValue('--run-id', jobId);
const model = argValue('--model', process.env.AILIS_CODEX_MODEL || 'gpt-5.5');
const reasoningEffort = argValue(
    '--reasoning-effort',
    process.env.AILIS_CODEX_REASONING_EFFORT || 'low'
);
const jobRoot = path.join(projectRoot, 'longrun', 'jobs', jobId);
const resultsRoot = path.join(jobRoot, 'results');
const runnerRoot = path.join(resultsRoot, runId);
const statePath = path.join(jobRoot, 'state.json');
const progressPath = path.join(jobRoot, 'progress.json');
const eventPath = path.join(jobRoot, 'event-log.jsonl');
const stopPath = path.join(jobRoot, 'stop.flag');
const logsRoot = path.join(jobRoot, 'logs');
const stdoutPath = path.join(logsRoot, 'controller-worker.stdout.log');
const stderrPath = path.join(logsRoot, 'controller-worker.stderr.log');
const runnerStatePath = path.join(runnerRoot, 'state.json');
const runnerSummaryPath = path.join(runnerRoot, 'summary.json');
const pythonExe = argValue(
    '--python',
    'F:\\AILIS_benchmarks\\.venvs\\toolsandbox\\Scripts\\python.exe'
);

fs.mkdirSync(logsRoot, { recursive: true });
const previousState = readJson(statePath, {});
if (
    (isPidAlive(Number(previousState.controllerPid)) || isPidAlive(Number(previousState.childPid))) &&
    previousState.status === 'running'
) {
    throw new Error(
        `ToolSandbox controller is already running (controller=${previousState.controllerPid}, child=${previousState.childPid}).`
    );
}

const stdout = fs.openSync(stdoutPath, 'a');
const stderr = fs.openSync(stderrPath, 'a');
const runnerArgs = [
    path.join(projectRoot, 'scripts', 'toolsandbox', 'run_ailis_toolsandbox.py'),
    '--all',
    '--resume',
    '--retry-errors',
    '--provider',
    'codex-model-bridge',
    '--codex-model',
    model,
    '--codex-reasoning-effort',
    reasoningEffort,
    '--max-agent-steps',
    '7',
    '--llm-timeout-ms',
    '180000',
    '--run-id',
    runId,
    '--output-dir',
    resultsRoot
];
const child = spawn(pythonExe, runnerArgs, {
    cwd: projectRoot,
    env: { ...process.env },
    windowsHide: true,
    detached: false,
    stdio: ['ignore', stdout, stderr]
});

const startedAt = isoNow();
appendEvent(eventPath, {
    at: startedAt,
    type: 'controller.started',
    controllerPid: process.pid,
    childPid: child.pid,
    runId,
    provider: 'codex-model-bridge',
    model,
    reasoningEffort
});

function mirrorState(extra = {}) {
    const runnerState = readJson(runnerStatePath, {});
    const summary = readJson(runnerSummaryPath, {});
    const state = {
        jobId,
        runId,
        status: runnerState.status || 'running',
        provider: 'codex-model-bridge',
        model,
        reasoningEffort,
        officialScenarioCount: 1032,
        localRunnableScenarioCount: 728,
        rapidApiBlockedScenarioCount: 304,
        controllerPid: process.pid,
        childPid: child.pid,
        startedAt,
        lastUpdateAt: isoNow(),
        completed: Number(runnerState.completed ?? summary.completed ?? 0),
        errors: Number(runnerState.errors ?? summary.errors ?? 0),
        blockedEnvironment: Number(
            runnerState.blockedEnvironment ?? summary.blockedEnvironment ?? 0
        ),
        currentScenario: runnerState.currentScenario || null,
        totalTokens: Number(summary.usage?.totalTokens || 0),
        ...extra
    };
    writeJson(statePath, state);
    writeJson(progressPath, {
        ...state,
        averageSimilarity: Number(summary.averageSimilarity || 0),
        perfect: Number(summary.perfect || 0),
        nextAction:
            state.status === 'running'
                ? 'Continue the single Codex ToolSandbox worker from the official scenario registry.'
                : state.status === 'provider_blocked'
                ? 'Resume with the same run-id after Codex OAuth usage becomes available.'
                : state.blockedEnvironment
                ? 'Configure RAPID_API_KEY, then resume the same run-id for the remaining official scenarios.'
                : 'Review the final summary and category report.'
    });
}

mirrorState({ status: 'running' });
const interval = setInterval(() => {
    if (fs.existsSync(stopPath) && !child.killed) {
        appendEvent(eventPath, { at: isoNow(), type: 'controller.stop_requested' });
        child.kill();
    }
    mirrorState();
}, 30000);

function stopChild() {
    if (!child.killed && child.exitCode === null) child.kill();
}
process.once('SIGINT', stopChild);
process.once('SIGTERM', stopChild);

child.on('error', (error) => {
    clearInterval(interval);
    mirrorState({
        status: 'controller_error',
        controllerError: error?.message || String(error),
        finishedAt: isoNow()
    });
    appendEvent(eventPath, {
        at: isoNow(),
        type: 'controller.error',
        error: error?.stack || String(error)
    });
    process.exitCode = 1;
});

child.on('close', (code, signal) => {
    clearInterval(interval);
    const runnerState = readJson(runnerStatePath, {});
    const status = runnerState.status || (code === 0 ? 'completed' : 'worker_exited');
    mirrorState({
        status,
        exitCode: code,
        signal: signal || null,
        controllerPid: null,
        childPid: null,
        finishedAt: isoNow()
    });
    appendEvent(eventPath, {
        at: isoNow(),
        type: 'controller.finished',
        status,
        exitCode: code,
        signal: signal || null
    });
    fs.closeSync(stdout);
    fs.closeSync(stderr);
    process.exitCode = code === 0 || code === 2 || code === 3 ? 0 : 1;
});
