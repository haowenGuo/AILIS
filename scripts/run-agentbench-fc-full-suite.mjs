import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import { readAgentBenchFcManifest } from '../evals/agentbench_fc/benchmark-integrity.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const TASK_ORDER = Object.freeze([
    'dbbench-std',
    'os-std',
    'kg-std',
    'alfworld-std',
    'webshop-std'
]);
const MONITOR_INTERVAL_MS = 15_000;

function dateStamp() {
    const now = new Date();
    return [now.getFullYear(), now.getMonth() + 1, now.getDate()]
        .map((value, index) => index === 0 ? String(value) : String(value).padStart(2, '0'))
        .join('');
}

export function parseAgentBenchFcSuiteArgs(argv) {
    const options = {
        approved: false,
        runId: '',
        dockerMirror: process.env.AILIS_DOCKER_MIRROR || 'docker.m.daocloud.io',
        dockerPullTimeoutSeconds: Number(process.env.AILIS_DOCKER_PULL_TIMEOUT_SECONDS) || 180
    };
    for (let index = 0; index < argv.length; index += 1) {
        const argument = argv[index];
        if (argument === '--approve-large-stage') options.approved = true;
        else if (argument === '--run-id') options.runId = argv[++index] || '';
        else if (argument === '--docker-mirror') options.dockerMirror = argv[++index] || '';
        else if (argument === '--docker-pull-timeout-seconds') {
            options.dockerPullTimeoutSeconds = Math.max(30, Number(argv[++index]) || 180);
        } else {
            throw new Error(`Unknown AgentBench FC suite option: ${argument}`);
        }
    }
    if (!options.approved) throw new Error('full suite requires --approve-large-stage');
    return options;
}

export function buildAgentBenchFcSuitePlan(manifest, suiteRunId) {
    const tasks = TASK_ORDER.map((task) => {
        const definition = manifest.tasks?.[task];
        if (!definition) throw new Error(`AgentBench FC manifest is missing ${task}`);
        const expectedSamples = Number(definition.expectedSamples || 0);
        if (!Number.isInteger(expectedSamples) || expectedSamples <= 0) {
            throw new Error(`AgentBench FC manifest has no valid expectedSamples for ${task}`);
        }
        const runId = `${suiteRunId}-${task}`;
        const outputDir = path.join(ROOT, 'eval-results', 'agentbench-fc', runId);
        return {
            task,
            environment: definition.environment,
            expectedSamples,
            runId,
            outputDir,
            progressPath: path.join(outputDir, `${runId}.${task}.progress.jsonl`),
            summaryPath: path.join(outputDir, `${runId}.${task}.summary.json`),
            stageReportPath: path.join(outputDir, `${runId}.${task}.stage-report.json`)
        };
    });
    return {
        tasks,
        expectedSamples: tasks.reduce((sum, item) => sum + item.expectedSamples, 0)
    };
}

function normalizedUsage(record) {
    const total = { calls: 0, promptTokens: 0, completionTokens: 0, totalTokens: 0 };
    for (const call of record?.agent_calls || []) {
        total.calls += 1;
        const usage = call?.usage || {};
        total.promptTokens += Number(usage.prompt_tokens || 0);
        total.completionTokens += Number(usage.completion_tokens || 0);
        total.totalTokens += Number(usage.total_tokens || 0);
    }
    return total;
}

export function summarizeAgentBenchFcProgressLines(content = '') {
    const latest = new Map();
    for (const line of String(content).split(/\r?\n/)) {
        if (!line.trim()) continue;
        const record = JSON.parse(line);
        latest.set(JSON.stringify(record.index), record);
    }
    const result = {
        samples: latest.size,
        completed: 0,
        successes: 0,
        infrastructureErrors: 0,
        durationMs: 0,
        calls: 0,
        promptTokens: 0,
        completionTokens: 0,
        totalTokens: 0
    };
    for (const record of latest.values()) {
        if (record.status === 'completed') result.completed += 1;
        if (Number(record.reward || 0) > 0) result.successes += 1;
        if (record.status === 'infrastructure_error' || record.error) result.infrastructureErrors += 1;
        result.durationMs += Number(record.duration_ms || 0);
        const usage = normalizedUsage(record);
        result.calls += usage.calls;
        result.promptTokens += usage.promptTokens;
        result.completionTokens += usage.completionTokens;
        result.totalTokens += usage.totalTokens;
    }
    return result;
}

async function readJson(target, fallback = null) {
    try {
        return JSON.parse(await fsp.readFile(target, 'utf8'));
    } catch {
        return fallback;
    }
}

async function summarizeProgressFile(target) {
    try {
        return summarizeAgentBenchFcProgressLines(await fsp.readFile(target, 'utf8'));
    } catch {
        return summarizeAgentBenchFcProgressLines('');
    }
}

async function writeJsonAtomic(target, value) {
    await fsp.mkdir(path.dirname(target), { recursive: true });
    const temporary = `${target}.${process.pid}.tmp`;
    await fsp.writeFile(temporary, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
    await fsp.rename(temporary, target);
}

async function appendEvent(jobDir, event, details = {}) {
    const payload = { at: new Date().toISOString(), event, ...details };
    await fsp.appendFile(
        path.join(jobDir, 'event-log.jsonl'),
        `${JSON.stringify(payload)}\n`,
        'utf8'
    );
}

function processIsAlive(pid) {
    if (!Number.isInteger(pid) || pid <= 0) return false;
    try {
        process.kill(pid, 0);
        return true;
    } catch {
        return false;
    }
}

async function acquireLock(jobDir, runId) {
    const lockPath = path.join(jobDir, 'controller.lock.json');
    const prior = await readJson(lockPath);
    if (prior && processIsAlive(Number(prior.pid))) {
        throw new Error(`AgentBench FC suite controller already runs as PID ${prior.pid}`);
    }
    await writeJsonAtomic(lockPath, {
        schema: 'ailis.agentbench.fc.suite-lock.v1',
        runId,
        pid: process.pid,
        acquiredAt: new Date().toISOString()
    });
    return lockPath;
}

async function initializeJob(jobDir, manifest, runId, plan) {
    await fsp.mkdir(path.join(jobDir, 'results'), { recursive: true });
    await fsp.mkdir(path.join(jobDir, 'workers'), { recursive: true });
    const files = {
        'mission.md': `# Mission\n\nRun the pinned official AgentBench FC five-environment full suite for AILIS.\n\n- Run ID: \`${runId}\`\n- Revision: \`${manifest.revision}\`\n- Environments: ${plan.tasks.map((item) => item.task).join(', ')}\n- Expected samples: ${plan.expectedSamples}\n- Protocol: official OpenAI function calling, pass@1, 20 environment turns\n`,
        'acceptance.md': `# Acceptance\n\n- All ${plan.expectedSamples} official samples have durable records.\n- Each environment has an official summary and stage report.\n- No infrastructure-error record is accepted as a benchmark answer.\n- Only one environment worker runs at a time.\n- Existing records are resumed rather than re-evaluated.\n- No answer rewriting, answer post-processing, mock environment, or task-specific answer rule is used.\n`,
        'loop-policy.json': `${JSON.stringify({
            schema: 'ailis.agentbench.fc.loop-policy.v1',
            oneHeavyWorker: true,
            resume: true,
            maxEnvironmentTurns: 20,
            stopAfterConsecutiveInfrastructureErrors: 3,
            stopFlag: 'stop.flag'
        }, null, 2)}\n`,
        'control-queue.jsonl': ''
    };
    for (const [name, content] of Object.entries(files)) {
        const target = path.join(jobDir, name);
        if (!fs.existsSync(target)) await fsp.writeFile(target, content, 'utf8');
    }
    if (!fs.existsSync(path.join(jobDir, 'event-log.jsonl'))) {
        await fsp.writeFile(path.join(jobDir, 'event-log.jsonl'), '', 'utf8');
    }
}

async function completedStage(taskPlan) {
    const report = await readJson(taskPlan.stageReportPath);
    return report?.gate?.passed === true
        && report?.summary?.valid === true
        && Number(report?.summary?.selected || 0) === taskPlan.expectedSamples;
}

async function collectSuiteProgress(plan, currentTask = '', childPid = null) {
    const environments = [];
    for (const taskPlan of plan.tasks) {
        const summary = await readJson(taskPlan.summaryPath);
        const measured = summary?.valid
            ? {
                samples: Number(summary.completed_records || 0),
                completed: Number(summary.quality?.completed_environment_records || 0),
                successes: Number(summary.quality?.successful_environment_records || 0),
                infrastructureErrors: Number(summary.quality?.infrastructure_errors || 0),
                durationMs: Number(summary.duration_ms || 0),
                calls: Number(summary.usage?.calls || 0),
                promptTokens: Number(summary.usage?.prompt_tokens || 0),
                completionTokens: Number(summary.usage?.completion_tokens || 0),
                totalTokens: Number(summary.usage?.total_tokens || 0)
            }
            : await summarizeProgressFile(taskPlan.progressPath);
        environments.push({
            task: taskPlan.task,
            environment: taskPlan.environment,
            expectedSamples: taskPlan.expectedSamples,
            officialScore: summary?.official_score?.average_reward ?? null,
            valid: summary?.valid === true,
            ...measured
        });
    }
    const totals = environments.reduce((total, item) => {
        for (const key of [
            'samples', 'completed', 'successes', 'infrastructureErrors', 'durationMs',
            'calls', 'promptTokens', 'completionTokens', 'totalTokens'
        ]) total[key] += Number(item[key] || 0);
        return total;
    }, {
        samples: 0,
        completed: 0,
        successes: 0,
        infrastructureErrors: 0,
        durationMs: 0,
        calls: 0,
        promptTokens: 0,
        completionTokens: 0,
        totalTokens: 0
    });
    return {
        schema: 'ailis.agentbench.fc.suite-progress.v1',
        updatedAt: new Date().toISOString(),
        currentTask,
        childPid,
        expectedSamples: plan.expectedSamples,
        totals,
        environments
    };
}

async function writeState(jobDir, state) {
    await writeJsonAtomic(path.join(jobDir, 'state.json'), {
        schema: 'ailis.agentbench.fc.suite-state.v1',
        updatedAt: new Date().toISOString(),
        controllerPid: process.pid,
        ...state
    });
}

async function runTask(taskPlan, options, jobDir, plan) {
    const stdoutPath = path.join(jobDir, 'workers', `${taskPlan.task}.stdout.log`);
    const stderrPath = path.join(jobDir, 'workers', `${taskPlan.task}.stderr.log`);
    const stdout = fs.openSync(stdoutPath, 'a');
    const stderr = fs.openSync(stderrPath, 'a');
    const args = [
        path.join(ROOT, 'scripts', 'run-agentbench-fc-controller.mjs'),
        '--stage', 'full',
        '--task', taskPlan.task,
        '--run-id', taskPlan.runId,
        '--approve-large-stage'
    ];
    const child = spawn(process.execPath, args, {
        cwd: ROOT,
        env: {
            ...process.env,
            AILIS_DOCKER_MIRROR: options.dockerMirror,
            AILIS_DOCKER_PULL_TIMEOUT_SECONDS: String(options.dockerPullTimeoutSeconds)
        },
        windowsHide: true,
        stdio: ['ignore', stdout, stderr]
    });
    await writeState(jobDir, { status: 'running', currentTask: taskPlan.task, childPid: child.pid });
    await appendEvent(jobDir, 'environment_started', { task: taskPlan.task, childPid: child.pid });

    let stopRequested = false;
    const monitor = setInterval(async () => {
        try {
            const progress = await collectSuiteProgress(plan, taskPlan.task, child.pid);
            await writeJsonAtomic(path.join(jobDir, 'progress.json'), progress);
            if (fs.existsSync(path.join(jobDir, 'stop.flag')) && !stopRequested) {
                stopRequested = true;
                child.kill();
            }
        } catch {
            // The child remains authoritative; a later monitor tick can repair telemetry.
        }
    }, MONITOR_INTERVAL_MS);

    const exit = await new Promise((resolve) => {
        child.once('error', (error) => resolve({ code: -1, error: error.message }));
        child.once('close', (code, signal) => resolve({ code, signal }));
    });
    clearInterval(monitor);
    fs.closeSync(stdout);
    fs.closeSync(stderr);
    await writeJsonAtomic(
        path.join(jobDir, 'progress.json'),
        await collectSuiteProgress(plan, taskPlan.task, null)
    );
    if (stopRequested) throw new Error('stop.flag requested');
    if (exit.code !== 0) {
        throw new Error(`AgentBench FC ${taskPlan.task} exited with code ${exit.code}: ${exit.error || exit.signal || ''}`);
    }
    if (!await completedStage(taskPlan)) {
        throw new Error(`AgentBench FC ${taskPlan.task} did not produce a valid complete stage report`);
    }
    await appendEvent(jobDir, 'environment_completed', { task: taskPlan.task });
}

async function writeFinalReports(jobDir, manifest, runId, plan) {
    const progress = await collectSuiteProgress(plan);
    const valid = progress.totals.samples === plan.expectedSamples
        && progress.totals.infrastructureErrors === 0
        && progress.environments.every((item) => item.valid);
    const summary = {
        schema: 'ailis.agentbench.fc.suite-summary.v1',
        runId,
        benchmark: { repository: manifest.repository, revision: manifest.revision },
        valid,
        ...progress
    };
    await writeJsonAtomic(path.join(jobDir, 'results', 'summary.json'), summary);
    const rows = progress.environments.map((item) => (
        `| ${item.environment} | ${item.samples}/${item.expectedSamples} | `
        + `${item.officialScore ?? 'n/a'} | ${item.calls} | ${item.totalTokens} |`
    ));
    const report = [
        '# AgentBench FC Full Evaluation',
        '',
        `- Run ID: \`${runId}\``,
        `- Revision: \`${manifest.revision}\``,
        `- Valid: ${valid}`,
        `- Samples: ${progress.totals.samples}/${plan.expectedSamples}`,
        `- Calls: ${progress.totals.calls}`,
        `- Tokens: ${progress.totals.totalTokens}`,
        '',
        '| Environment | Samples | Official average reward | Calls | Tokens |',
        '| --- | ---: | ---: | ---: | ---: |',
        ...rows,
        ''
    ].join('\n');
    await fsp.writeFile(path.join(jobDir, 'results', 'report.md'), report, 'utf8');
    return summary;
}

async function main() {
    const options = parseAgentBenchFcSuiteArgs(process.argv.slice(2));
    const manifest = await readAgentBenchFcManifest();
    const runId = options.runId || `ailis-agentbench-fc-full-${dateStamp()}`;
    const plan = buildAgentBenchFcSuitePlan(manifest, runId);
    const jobDir = path.join(ROOT, 'longrun', 'jobs', runId);
    await initializeJob(jobDir, manifest, runId, plan);
    const lockPath = await acquireLock(jobDir, runId);
    await appendEvent(jobDir, 'suite_started', {
        runId,
        controllerPid: process.pid,
        expectedSamples: plan.expectedSamples
    });
    try {
        await writeState(jobDir, { status: 'running', currentTask: '', childPid: null });
        await writeJsonAtomic(path.join(jobDir, 'progress.json'), await collectSuiteProgress(plan));
        for (const taskPlan of plan.tasks) {
            if (fs.existsSync(path.join(jobDir, 'stop.flag'))) throw new Error('stop.flag requested');
            if (await completedStage(taskPlan)) {
                await appendEvent(jobDir, 'environment_resume_skipped', { task: taskPlan.task });
                continue;
            }
            await runTask(taskPlan, options, jobDir, plan);
        }
        const summary = await writeFinalReports(jobDir, manifest, runId, plan);
        if (!summary.valid) throw new Error('AgentBench FC suite completed without a valid aggregate summary');
        await writeState(jobDir, { status: 'completed', currentTask: '', childPid: null });
        await writeJsonAtomic(path.join(jobDir, 'progress.json'), await collectSuiteProgress(plan));
        await appendEvent(jobDir, 'suite_completed', { runId });
    } catch (error) {
        const stopped = String(error?.message || error).includes('stop.flag');
        await writeState(jobDir, {
            status: stopped ? 'stopped' : 'failed',
            currentTask: (await readJson(path.join(jobDir, 'state.json')))?.currentTask || '',
            childPid: null,
            error: error?.message || String(error)
        });
        await appendEvent(jobDir, stopped ? 'suite_stopped' : 'suite_failed', {
            error: error?.message || String(error)
        });
        throw error;
    } finally {
        await fsp.rm(lockPath, { force: true });
    }
}

if (path.resolve(process.argv[1] || '') === fileURLToPath(import.meta.url)) {
    main().catch((error) => {
        console.error(error?.stack || error);
        process.exitCode = 1;
    });
}
