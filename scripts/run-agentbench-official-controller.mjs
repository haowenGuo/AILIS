import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import process from 'node:process';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const JOB_ID = 'ailis-agentbench-v02-full-20260714';
const JOB_DIR = path.join(ROOT, 'longrun', 'jobs', JOB_ID);
const RESULTS_DIR = path.join(JOB_DIR, 'results');
const BENCHMARK_ROOT = path.join(ROOT, 'build-cache', 'benchmarks', 'agentbench-v0.2');
const WSL = 'C:\\Windows\\System32\\wsl.exe';
const DISTRO = 'Ubuntu-22.04';
const WSL_ROOT = '/mnt/f/AILIS_self_evolution_runtime';
const WSL_BENCHMARK_ROOT = `${WSL_ROOT}/build-cache/benchmarks/agentbench-v0.2`;
const WSL_PYTHON = '/root/.local/share/ailis-agentbench-v02/venv/bin/python';
const CONTROLLER_URL = 'http://127.0.0.1:5000/api';
const BRIDGE_WINDOWS_URL = 'http://127.0.0.1:5128';
const WORKER_PORT = 5001;
const OFFICIAL_TASK_CONFIG = `${WSL_ROOT}/evals/agentbench_official/configs/task-assembly.yaml`;

const TASKS = [
    { task: 'dbbench-dev', environment: 'DB', worker: 'host', image: 'mysql:latest' },
    { task: 'dbbench-std', environment: 'DB', worker: 'host', image: 'mysql:latest' },
    { task: 'os-dev', environment: 'OS', worker: 'host', provision: 'os' },
    { task: 'os-std', environment: 'OS', worker: 'host', provision: 'os' },
    { task: 'ltp-dev', environment: 'LTP', worker: 'docker', image: 'longinyu/agentbench-ltp' },
    { task: 'ltp-std', environment: 'LTP', worker: 'docker', image: 'longinyu/agentbench-ltp' },
    { task: 'cg-dev', environment: 'DCG', worker: 'docker', image: 'longinyu/agentbench-card_game' },
    { task: 'cg-std', environment: 'DCG', worker: 'docker', image: 'longinyu/agentbench-card_game' },
    { task: 'alfworld-dev', environment: 'ALFWorld', worker: 'docker', image: 'longinyu/agentbench-alfworld' },
    { task: 'alfworld-std', environment: 'ALFWorld', worker: 'docker', image: 'longinyu/agentbench-alfworld' },
    { task: 'webshop-dev', environment: 'WebShop', worker: 'docker', image: 'longinyu/agentbench-webshop' },
    { task: 'webshop-std', environment: 'WebShop', worker: 'docker', image: 'longinyu/agentbench-webshop' },
    { task: 'm2w-dev', environment: 'Mind2Web', worker: 'docker', image: 'longinyu/agentbench-mind2web' },
    { task: 'm2w-std', environment: 'Mind2Web', worker: 'docker', image: 'longinyu/agentbench-mind2web' },
    { task: 'kg-dev', environment: 'KG', worker: 'host', provision: 'kg' },
    { task: 'kg-std', environment: 'KG', worker: 'host', provision: 'kg' }
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const now = () => new Date().toISOString();
const safeName = (value) => String(value).replace(/[^a-zA-Z0-9_.-]+/g, '-');

fs.mkdirSync(RESULTS_DIR, { recursive: true });

function readJson(file, fallback = null) {
    try {
        return JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch {
        return fallback;
    }
}

function writeJson(file, value) {
    const temporary = `${file}.tmp`;
    fs.writeFileSync(temporary, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
    fs.renameSync(temporary, file);
}

function appendEvent(type, summary, details = {}) {
    fs.appendFileSync(path.join(JOB_DIR, 'event-log.jsonl'), `${JSON.stringify({
        at: now(),
        type,
        jobId: JOB_ID,
        summary,
        artifactPaths: details.artifactPaths || [],
        failureCategory: details.failureCategory || null,
        ...details
    })}\n`, 'utf8');
}

function updateProjection(patch = {}) {
    const statePath = path.join(JOB_DIR, 'state.json');
    const progressPath = path.join(JOB_DIR, 'progress.json');
    const state = readJson(statePath, { jobId: JOB_ID, targetSamples: 1360 });
    const progress = readJson(progressPath, { jobId: JOB_ID, targetSamples: 1360 });
    const updatedAt = now();
    writeJson(statePath, { ...state, ...patch, lastUpdateAt: updatedAt });
    writeJson(progressPath, {
        ...progress,
        ...patch,
        lastUpdateAt: updatedAt,
        lastUpdateAgeSeconds: 0
    });
}

function isProcessAlive(pid) {
    if (!Number.isInteger(Number(pid)) || Number(pid) <= 0) return false;
    try {
        process.kill(Number(pid), 0);
        return true;
    } catch {
        return false;
    }
}

function readPid(file) {
    try {
        return Number(fs.readFileSync(file, 'utf8').trim());
    } catch {
        return 0;
    }
}

function startLogged(command, args, name, { cwd = ROOT, detached = true } = {}) {
    const stdout = fs.openSync(path.join(JOB_DIR, `${name}.stdout.log`), 'a');
    const stderr = fs.openSync(path.join(JOB_DIR, `${name}.stderr.log`), 'a');
    const child = spawn(command, args, {
        cwd,
        detached,
        windowsHide: true,
        stdio: ['ignore', stdout, stderr]
    });
    fs.closeSync(stdout);
    fs.closeSync(stderr);
    if (detached) child.unref();
    fs.writeFileSync(path.join(JOB_DIR, `${name}.windows.pid`), `${child.pid}\n`, 'ascii');
    return child;
}

function runLogged(command, args, name, { cwd = ROOT } = {}) {
    return new Promise((resolve, reject) => {
        const child = startLogged(command, args, name, { cwd, detached: false });
        child.once('error', reject);
        child.once('exit', (code, signal) => resolve({ code, signal, pid: child.pid }));
    });
}

function runWsl(args, name) {
    return runLogged(WSL, ['-d', DISTRO, '--', ...args], name);
}

function httpJson(url, options = {}, timeoutMs = 5000) {
    return new Promise((resolve, reject) => {
        const target = new URL(url);
        const body = options.body ? Buffer.from(JSON.stringify(options.body)) : null;
        const request = http.request(target, {
            method: options.method || 'GET',
            headers: body ? {
                'content-type': 'application/json',
                'content-length': body.length
            } : {}
        }, (response) => {
            const chunks = [];
            response.on('data', (chunk) => chunks.push(chunk));
            response.on('end', () => {
                const text = Buffer.concat(chunks).toString('utf8');
                if ((response.statusCode || 500) >= 400) {
                    reject(new Error(`${response.statusCode}: ${text}`));
                    return;
                }
                try {
                    resolve(JSON.parse(text || '{}'));
                } catch (error) {
                    reject(error);
                }
            });
        });
        request.setTimeout(timeoutMs, () => request.destroy(new Error(`HTTP timeout: ${url}`)));
        request.once('error', reject);
        if (body) request.write(body);
        request.end();
    });
}

async function waitForHttp(url, timeoutMs, description) {
    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
        try {
            return await httpJson(url);
        } catch {
            await sleep(3000);
        }
    }
    throw new Error(`${description} did not become ready: ${url}`);
}

async function ensureController() {
    try {
        return await httpJson(`${CONTROLLER_URL}/list_workers`);
    } catch {}
    startLogged(WSL, [
        '-d', DISTRO,
        '--cd', WSL_BENCHMARK_ROOT,
        '--', WSL_PYTHON, '-m', 'src.server.task_controller', '--port', '5000'
    ], 'controller');
    appendEvent('CONTROLLER_STARTED', 'Started the official AgentBench task controller.');
    return await waitForHttp(`${CONTROLLER_URL}/list_workers`, 60_000, 'AgentBench controller');
}

async function ensureBridge() {
    try {
        return await httpJson(`${BRIDGE_WINDOWS_URL}/health`);
    } catch {}
    startLogged(process.execPath, [
        path.join(ROOT, 'scripts', 'serve-ailis-agentbench.mjs'),
        '--port', '5128',
        '--audit-dir', path.join(JOB_DIR, 'bridge-audit')
    ], 'bridge');
    appendEvent('BRIDGE_STARTED', 'Started the AILIS AgentBench protocol bridge.');
    return await waitForHttp(`${BRIDGE_WINDOWS_URL}/health`, 60_000, 'AILIS protocol bridge');
}

async function wslHostIp() {
    const name = 'resolve-wsl-host';
    const result = await runWsl(['ip', 'route', 'show', 'default'], name);
    if (result.code !== 0) throw new Error('Unable to resolve the Windows host address from WSL.');
    const output = fs.readFileSync(path.join(JOB_DIR, `${name}.stdout.log`), 'utf8');
    const matches = [...output.matchAll(/default\s+via\s+(\d{1,3}(?:\.\d{1,3}){3})/g)];
    const address = matches.at(-1)?.[1] || '';
    if (!address) throw new Error('WSL host address is empty.');
    return address;
}

async function dockerImageExists(image) {
    const result = await runWsl(['docker', 'image', 'inspect', image], `inspect-${safeName(image)}`);
    return result.code === 0;
}

async function ensureDockerImage(image) {
    if (await dockerImageExists(image)) return;
    const mirror = image.startsWith('mysql')
        ? `docker.1ms.run/library/${image}`
        : image.startsWith('ubuntu')
            ? `docker.1ms.run/library/${image}`
            : `docker.1ms.run/${image}`;
    if (!(await dockerImageExists(mirror))) {
        const externalPidFile = path.join(JOB_DIR, `pull-${safeName(image.replace(/^longinyu\//, ''))}.windows.pid`);
        const externalPid = readPid(externalPidFile);
        if (isProcessAlive(externalPid)) {
            updateProjection({ status: 'provisioning', currentAction: `Waiting for image pull: ${image}`, activeAgentRuns: 1 });
            while (isProcessAlive(externalPid) && !fs.existsSync(path.join(JOB_DIR, 'stop.flag'))) {
                await sleep(15_000);
            }
        }
    }
    if (!(await dockerImageExists(mirror))) {
        appendEvent('ENVIRONMENT_PROVISION_STARTED', `Pulling ${image} from the configured mirror.`);
        const result = await runWsl(['docker', 'pull', mirror], `pull-${safeName(image)}`);
        if (result.code !== 0) throw new Error(`Docker pull failed for ${image}`);
    }
    const tagResult = await runWsl(['docker', 'tag', mirror, image], `tag-${safeName(image)}`);
    if (tagResult.code !== 0) throw new Error(`Docker tag failed for ${image}`);
    appendEvent('ENVIRONMENT_PROVISION_FINISHED', `Docker image ready: ${image}.`);
}

async function ensureOsImages() {
    const targets = ['local-os/default', 'local-os/packages', 'local-os/ubuntu'];
    if ((await Promise.all(targets.map(dockerImageExists))).every(Boolean)) return;
    await ensureDockerImage('ubuntu:latest');
    const dockerfiles = `${WSL_BENCHMARK_ROOT}/data/os_interaction/res/dockerfiles`;
    for (const target of targets) {
        if (await dockerImageExists(target)) continue;
        const variant = target.split('/')[1];
        appendEvent('ENVIRONMENT_PROVISION_STARTED', `Building official OS image ${target}.`);
        const result = await runWsl([
            'docker', 'build', '--tag', target,
            '-f', `${dockerfiles}/${variant}`,
            dockerfiles
        ], `build-${safeName(target)}`);
        if (result.code !== 0) throw new Error(`Docker build failed for ${target}`);
        appendEvent('ENVIRONMENT_PROVISION_FINISHED', `Built official OS image ${target}.`);
    }
}

async function ensureKgService() {
    const probe = await runWsl([
        'curl', '-fsS', '--max-time', '15',
        'http://127.0.0.1:3093/sparql?query=ASK%7B%3Fs%20%3Fp%20%3Fo%7D&format=json'
    ], 'probe-freebase');
    if (probe.code !== 0) {
        throw new Error('Local Freebase SPARQL is not ready on WSL port 3093. Provision the official-compatible database before KG.');
    }
}

async function provisionTask(definition) {
    if (definition.image) await ensureDockerImage(definition.image);
    if (definition.provision === 'os') await ensureOsImages();
    if (definition.provision === 'kg') await ensureKgService();
}

async function workerList() {
    return await httpJson(`${CONTROLLER_URL}/list_workers`);
}

function workerReady(workers, task) {
    const item = workers?.[task];
    if (!item?.workers) return false;
    return Object.values(item.workers).some((worker) => Number(worker.status) === 0);
}

async function stopOwnedWorker() {
    await httpJson(`${CONTROLLER_URL}/cancel_all`, { method: 'POST', body: {} }, 15_000).catch(() => {});
    await runWsl(['docker', 'rm', '-f', 'ailis-agentbench-worker'], 'stop-docker-worker').catch(() => {});
    await runWsl(['pkill', '-f', 'src.server.task_worker'], 'stop-host-workers').catch(() => {});
    await sleep(5000);
}

async function ensureWorker(definition) {
    const existing = await workerList();
    if (workerReady(existing, definition.task)) return;
    await stopOwnedWorker();
    const workerName = `${definition.task}-worker`;
    if (definition.worker === 'host') {
        startLogged(WSL, [
            '-d', DISTRO,
            '--cd', WSL_BENCHMARK_ROOT,
            '--', '/usr/bin/env', `PYTHONPATH=${WSL_BENCHMARK_ROOT}`,
            WSL_PYTHON, '-m', 'src.server.task_worker', definition.task,
            '--self', `http://localhost:${WORKER_PORT}/api`,
            '--port', String(WORKER_PORT),
            '--config', OFFICIAL_TASK_CONFIG,
            '--controller', CONTROLLER_URL
        ], workerName);
    } else {
        const setup = definition.task.startsWith('webshop-')
            ? 'umask 0; [ -f /root/.setup.sh ] && bash /root/.setup.sh; ln -s /root/webshop /root/workspace/src/server/tasks/webshop_docker; cp /root/workspace/src/server/tasks/webshop/__init__.py /root/webshop/__init__.py;'
            : 'umask 0; [ -f /root/.setup.sh ] && bash /root/.setup.sh;';
        const workerCommand = `${setup} python -m src.server.task_worker ${definition.task} --self http://localhost:${WORKER_PORT}/api --port ${WORKER_PORT} --config ${OFFICIAL_TASK_CONFIG} --controller http://host.docker.internal:5000/api`;
        startLogged(WSL, [
            '-d', DISTRO, '--', 'docker', 'run', '--rm',
            '--name', 'ailis-agentbench-worker',
            '-p', `${WORKER_PORT}:${WORKER_PORT}`,
            '--add-host', 'host.docker.internal:host-gateway',
            '-v', `${WSL_BENCHMARK_ROOT}:/root/workspace`,
            '-v', `${WSL_ROOT}:${WSL_ROOT}`,
            '-w', '/root/workspace',
            definition.image,
            'bash', '-lc', workerCommand
        ], workerName);
    }
    appendEvent('WORKER_STARTED', `Started official worker ${definition.task}.`);
    const deadline = Date.now() + 15 * 60_000;
    while (Date.now() < deadline) {
        const workers = await workerList().catch(() => ({}));
        if (workerReady(workers, definition.task)) return;
        await sleep(5000);
    }
    throw new Error(`Worker did not become ready: ${definition.task}`);
}

function progressFile(task) {
    return path.join(RESULTS_DIR, `${JOB_ID}.${task}.progress.jsonl`);
}

function summaryFile(task) {
    return path.join(RESULTS_DIR, `${JOB_ID}.${task}.summary.json`);
}

function readRecords(task) {
    const file = progressFile(task);
    if (!fs.existsSync(file)) return [];
    return fs.readFileSync(file, 'utf8').split(/\r?\n/).filter(Boolean).map((line) => JSON.parse(line));
}

function usageFor(records) {
    const usage = { calls: 0, prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 };
    for (const record of records) {
        for (const call of record.agent_calls || []) {
            usage.calls += 1;
            const item = call?.bridge?.usage || {};
            usage.prompt_tokens += Number(item.prompt_tokens || 0);
            usage.completion_tokens += Number(item.completion_tokens || 0);
            usage.total_tokens += Number(item.total_tokens || 0);
        }
    }
    return usage;
}

async function taskTarget(task) {
    const workers = await workerList();
    return Array.isArray(workers?.[task]?.indices) ? workers[task].indices.length : 0;
}

async function waitForExistingRunner(task) {
    const candidates = [
        path.join(JOB_DIR, `${task}.runner.windows.pid`),
        path.join(JOB_DIR, `${task}-full.windows.pid`)
    ];
    const pid = candidates.map(readPid).find(isProcessAlive) || 0;
    if (!pid) return false;
    while (isProcessAlive(pid) && !fs.existsSync(path.join(JOB_DIR, 'stop.flag'))) {
        const records = readRecords(task);
        const usage = usageFor(records);
        updateProjection({
            status: 'running_evaluation',
            currentEnvironment: task,
            currentAction: `Running official ${task}`,
            activeAgentRuns: 1,
            environmentCompletedSamples: records.length,
            usage,
            latestEvidence: `${task}: ${records.length} durable samples, ${usage.total_tokens} tokens`,
            nextAction: `Continue ${task} from the official environment`
        });
        await sleep(15_000);
    }
    return true;
}

async function runTask(definition) {
    const existingSummary = readJson(summaryFile(definition.task));
    if (existingSummary?.completed_records === existingSummary?.selected && existingSummary?.official_score) return existingSummary;
    await waitForExistingRunner(definition.task);
    let summary = readJson(summaryFile(definition.task));
    if (summary?.completed_records === summary?.selected && summary?.official_score) return summary;
    const hostIp = await wslHostIp();
    const arguments_ = [
        '-d', DISTRO,
        '--cd', WSL_BENCHMARK_ROOT,
        '--', '/usr/bin/env', `PYTHONPATH=${WSL_ROOT}:${WSL_BENCHMARK_ROOT}`,
        WSL_PYTHON, `${WSL_ROOT}/evals/agentbench_official/run_official.py`,
        '--task', definition.task,
        '--controller', CONTROLLER_URL,
        '--bridge', `http://${hostIp}:5128/inference`,
        '--output-dir', `${WSL_ROOT}/longrun/jobs/${JOB_ID}/results`,
        '--run-id', JOB_ID,
        '--timeout-seconds', '180',
        '--retry-errors'
    ];
    for (let attempt = 1; attempt <= 3; attempt += 1) {
        appendEvent('EVALUATION_STARTED', `Running ${definition.task}, attempt ${attempt}.`);
        const child = startLogged(WSL, arguments_, `${definition.task}.runner`);
        while (isProcessAlive(child.pid) && !fs.existsSync(path.join(JOB_DIR, 'stop.flag'))) {
            const records = readRecords(definition.task);
            const usage = usageFor(records);
            updateProjection({
                status: 'running_evaluation',
                currentEnvironment: definition.task,
                currentAction: `Running official ${definition.task}`,
                activeAgentRuns: 1,
                environmentCompletedSamples: records.length,
                environmentTargetSamples: await taskTarget(definition.task),
                usage,
                latestArtifactPath: progressFile(definition.task),
                latestEvidence: `${definition.task}: ${records.length} durable samples, ${usage.total_tokens} tokens`,
                nextAction: `Continue ${definition.task}`
            });
            await sleep(15_000);
        }
        await sleep(3000);
        summary = readJson(summaryFile(definition.task));
        if (summary?.completed_records === summary?.selected && summary?.official_score) {
            appendEvent('EVALUATION_FINISHED', `Completed official ${definition.task}.`, {
                artifactPaths: [summaryFile(definition.task)]
            });
            return summary;
        }
        appendEvent('EVALUATION_RETRY', `${definition.task} did not produce a complete summary on attempt ${attempt}.`, {
            failureCategory: 'runtime_failed',
            artifactPaths: [progressFile(definition.task)]
        });
    }
    throw new Error(`${definition.task} failed after three resumable attempts.`);
}

function buildReport(summaries) {
    const lines = [
        '# AILIS Official AgentBench v0.2 Full Evaluation',
        '',
        `Generated: ${now()}`,
        '',
        '| Environment task | Samples | Errors | Model calls | Total tokens | Duration (s) |',
        '|---|---:|---:|---:|---:|---:|'
    ];
    let samples = 0;
    let errors = 0;
    let calls = 0;
    let tokens = 0;
    let duration = 0;
    for (const summary of summaries) {
        samples += Number(summary.selected || 0);
        errors += Number(summary.error_records || 0);
        calls += Number(summary.usage?.calls || 0);
        tokens += Number(summary.usage?.total_tokens || 0);
        duration += Number(summary.duration_ms || 0);
        lines.push(`| ${summary.task} | ${summary.selected} | ${summary.error_records} | ${summary.usage?.calls || 0} | ${summary.usage?.total_tokens || 0} | ${(Number(summary.duration_ms || 0) / 1000).toFixed(1)} |`);
    }
    lines.push('', `Completed samples: ${samples}/1360`, `Errors: ${errors}`, `Model calls: ${calls}`, `Total tokens: ${tokens}`, `Cumulative sample time: ${(duration / 1000).toFixed(1)} seconds`, '');
    for (const summary of summaries) {
        lines.push(`## ${summary.task}`, '', '```json', JSON.stringify(summary.official_score, null, 2), '```', '');
    }
    fs.writeFileSync(path.join(JOB_DIR, 'report.md'), `${lines.join('\n')}\n`, 'utf8');
}

async function main() {
    if (fs.existsSync(path.join(JOB_DIR, 'controller.lock'))) {
        const prior = readPid(path.join(JOB_DIR, 'controller.lock'));
        if (prior !== process.pid && isProcessAlive(prior)) {
            throw new Error(`Controller already running with PID ${prior}`);
        }
    }
    fs.writeFileSync(path.join(JOB_DIR, 'controller.lock'), `${process.pid}\n`, 'ascii');
    appendEvent('CONTROLLER_STARTED', `Long-run controller started with PID ${process.pid}.`);
    await ensureController();
    await ensureBridge();
    const summaries = [];
    try {
        for (const definition of TASKS) {
            if (fs.existsSync(path.join(JOB_DIR, 'stop.flag'))) break;
            updateProjection({
                status: 'provisioning',
                currentEnvironment: definition.task,
                currentAction: `Provisioning ${definition.environment} for ${definition.task}`,
                activeAgentRuns: 0,
                nextAction: `Start official worker ${definition.task}`
            });
            await provisionTask(definition);
            await ensureWorker(definition);
            const summary = await runTask(definition);
            summaries.push(summary);
            await stopOwnedWorker();
        }
        if (summaries.length === TASKS.length) {
            buildReport(summaries);
            updateProjection({
                status: 'completed',
                completedSamples: summaries.reduce((sum, item) => sum + Number(item.selected || 0), 0),
                activeAgentRuns: 0,
                currentAction: 'Official AgentBench v0.2 full evaluation completed',
                latestArtifactPath: path.join(JOB_DIR, 'report.md'),
                latestEvidence: 'All official environment summaries are present',
                nextAction: 'Review and publish the final report',
                risk: 'none'
            });
            appendEvent('JOB_COMPLETED', 'Completed all official AgentBench v0.2 environments.', {
                artifactPaths: [path.join(JOB_DIR, 'report.md')]
            });
        }
    } catch (error) {
        updateProjection({
            status: 'repair_required',
            activeAgentRuns: 0,
            latestEvidence: error.message,
            nextAction: 'Inspect the latest environment logs and resume after repairing infrastructure',
            risk: error.message
        });
        appendEvent('FAILURE_CLASSIFIED', error.message, {
            failureCategory: /Freebase|Docker|Worker|ready/i.test(error.message) ? 'environment_failed' : 'runtime_failed'
        });
        throw error;
    } finally {
        try { fs.unlinkSync(path.join(JOB_DIR, 'controller.lock')); } catch {}
    }
}

main().catch((error) => {
    console.error(error?.stack || error?.message || String(error));
    process.exitCode = 1;
});
