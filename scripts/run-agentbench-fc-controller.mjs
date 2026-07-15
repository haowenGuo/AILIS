import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import net from 'node:net';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import {
    assertAgentBenchFcIntegrity,
    readAgentBenchFcManifest,
    verifyAgentBenchFcCheckout
} from '../evals/agentbench_fc/benchmark-integrity.mjs';
import { parseAgentBenchFcStageArgs } from '../evals/agentbench_fc/stage-options.mjs';
import {
    AGENTBENCH_FC_STAGE_POLICY,
    evaluateAgentBenchFcStageGate
} from '../evals/agentbench_fc/stage-policy.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const CACHE_ROOT = path.join(ROOT, 'build-cache', 'benchmarks');
const BENCHMARK_ROOT = path.join(CACHE_ROOT, 'agentbench-fc');
const LOCAL_SEED_ROOT = path.join(CACHE_ROOT, 'agentbench-main');
const WSL = process.env.WINDIR
    ? path.join(process.env.WINDIR, 'System32', 'wsl.exe')
    : 'wsl.exe';
const BRIDGE_PORT = 5128;
const PINNED_RUNTIME_FILES = Object.freeze([
    'extra/worker-entrypoint.sh'
]);
let resolvedWslDistro = '';

function runProcess(command, args, options = {}) {
    return new Promise((resolve) => {
        const child = spawn(command, args, {
            cwd: options.cwd || ROOT,
            env: { ...process.env, ...(options.env || {}) },
            windowsHide: true,
            stdio: options.stdio || ['ignore', 'pipe', 'pipe']
        });
        let stdout = '';
        let stderr = '';
        child.stdout?.on('data', (chunk) => {
            stdout = `${stdout}${chunk}`.slice(-100_000);
            options.onStdout?.(chunk);
        });
        child.stderr?.on('data', (chunk) => {
            stderr = `${stderr}${chunk}`.slice(-100_000);
            options.onStderr?.(chunk);
        });
        child.once('error', (error) => resolve({ code: -1, stdout, stderr, error: error.message }));
        child.once('close', (code) => resolve({ code, stdout, stderr }));
    });
}

async function pathExists(target) {
    try {
        await fsp.access(target);
        return true;
    } catch {
        return false;
    }
}

function toWslPath(target) {
    const resolved = path.resolve(target);
    const match = resolved.match(/^([A-Za-z]):\\(.*)$/);
    if (!match) return resolved.replaceAll('\\', '/');
    return `/mnt/${match[1].toLowerCase()}/${match[2].replaceAll('\\', '/')}`;
}

async function runGit(args, cwd = ROOT) {
    const result = await runProcess('git', args, { cwd });
    if (result.code !== 0) {
        throw new Error(`git ${args.join(' ')} failed: ${result.stderr || result.stdout || result.error}`);
    }
    return result.stdout.trim();
}

async function checkoutRevision(repoRoot, manifest) {
    const local = await runProcess('git', ['cat-file', '-e', `${manifest.revision}^{commit}`], { cwd: repoRoot });
    if (local.code !== 0) {
        await runGit(['fetch', '--depth', '1', 'origin', manifest.revision], repoRoot);
    }
    await runGit(['checkout', '--detach', manifest.revision], repoRoot);
}

async function materializePinnedRuntimeFiles(repoRoot, manifest) {
    for (const relativePath of PINNED_RUNTIME_FILES) {
        const source = await runProcess(
            'git',
            ['show', `${manifest.revision}:${relativePath}`],
            { cwd: repoRoot }
        );
        if (source.code !== 0) {
            throw new Error(
                `Unable to materialize ${relativePath} from ${manifest.revision}: `
                + `${source.stderr || source.stdout || source.error}`
            );
        }
        await fsp.writeFile(path.join(repoRoot, relativePath), source.stdout, 'utf8');
    }
}

async function ensureAgentBenchFcCheckout(manifest) {
    if (!await pathExists(path.join(BENCHMARK_ROOT, '.git'))) {
        await fsp.mkdir(CACHE_ROOT, { recursive: true });
        if (await pathExists(path.join(LOCAL_SEED_ROOT, '.git'))) {
            await runGit(['clone', '--local', '--no-hardlinks', '--no-checkout', LOCAL_SEED_ROOT, BENCHMARK_ROOT]);
            await runGit(['remote', 'set-url', 'origin', manifest.repository], BENCHMARK_ROOT);
        } else {
            await runGit(['clone', '--filter=blob:none', '--no-checkout', manifest.repository, BENCHMARK_ROOT]);
        }
        await runGit(['config', 'core.autocrlf', 'false'], BENCHMARK_ROOT);
        await checkoutRevision(BENCHMARK_ROOT, manifest);
    }
    await runGit(['config', 'core.autocrlf', 'false'], BENCHMARK_ROOT);
    // Runtime scripts must match the pinned Git blobs; CRLF breaks Linux shebang resolution.
    await materializePinnedRuntimeFiles(BENCHMARK_ROOT, manifest);
    let integrity = await verifyAgentBenchFcCheckout({ root: BENCHMARK_ROOT, manifest });
    if (!integrity.ok && integrity.failures.every((failure) => failure.kind === 'revision_mismatch')) {
        await checkoutRevision(BENCHMARK_ROOT, manifest);
        integrity = await verifyAgentBenchFcCheckout({ root: BENCHMARK_ROOT, manifest });
    }
    return assertAgentBenchFcIntegrity(integrity);
}

export function parseWslDistributionList(output = '') {
    return String(output)
        .replaceAll('\0', '')
        .split(/\r?\n/)
        .map((value) => value.trim())
        .filter(Boolean);
}

async function resolveWslDistro() {
    if (process.env.AILIS_AGENTBENCH_WSL_DISTRO) return process.env.AILIS_AGENTBENCH_WSL_DISTRO;
    if (resolvedWslDistro) return resolvedWslDistro;
    const result = await runProcess(WSL, ['--list', '--quiet']);
    if (result.code !== 0) {
        throw new Error(`Unable to list WSL distributions: ${result.stderr || result.error}`);
    }
    const distributions = parseWslDistributionList(result.stdout);
    resolvedWslDistro = distributions.find((value) => /^ubuntu(?:-|$)/i.test(value)) || distributions[0] || '';
    if (!resolvedWslDistro) throw new Error('No WSL distribution is installed');
    return resolvedWslDistro;
}

async function runWsl(args, options = {}) {
    const distro = await resolveWslDistro();
    return runProcess(WSL, [
        '-d', distro,
        '--cd', toWslPath(BENCHMARK_ROOT),
        '--', ...args
    ], options);
}

async function runWslChecked(args, label, options = {}) {
    const result = await runWsl(args, options);
    if (result.code !== 0) {
        throw new Error(`${label} failed: ${result.stderr || result.stdout || result.error}`);
    }
    return result;
}

async function hasDockerImage(image) {
    const result = await runWsl(['docker', 'image', 'inspect', image]);
    return result.code === 0;
}

async function ensureDockerImage(image) {
    if (await hasDockerImage(image)) return;
    const pullTimeoutSeconds = Math.max(
        30,
        Number(process.env.AILIS_DOCKER_PULL_TIMEOUT_SECONDS) || 300
    );
    const pull = (target) => runWsl([
        'timeout', String(pullTimeoutSeconds), 'docker', 'pull', target
    ]);
    const mirror = String(process.env.AILIS_DOCKER_MIRROR || '').replace(/\/+$/, '');
    if (mirror) {
        const repository = image.includes('/') ? image : `library/${image}`;
        const mirroredImage = `${mirror}/${repository}`;
        const mirrored = await pull(mirroredImage);
        if (mirrored.code === 0) {
            await runWslChecked(['docker', 'tag', mirroredImage, image], `Docker image tag ${image}`);
            return;
        }
    }
    const primary = await pull(image);
    if (primary.code !== 0) {
        throw new Error(`Docker image ${image} failed: ${primary.stderr || primary.stdout || primary.error}`);
    }
}

async function ensureEnvironmentPrerequisites(task) {
    if (task === 'dbbench-std') {
        await ensureDockerImage('mysql:8');
    }
    if (task === 'os-std') {
        for (const variant of ['default', 'packages', 'ubuntu']) {
            if (await hasDockerImage(`local-os/${variant}`)) continue;
            await runWslChecked([
                'env', 'DOCKER_BUILDKIT=1', 'docker', 'build',
                '-t', `local-os/${variant}`,
                '-f', `data/os_interaction/res/dockerfiles/${variant}`,
                'data/os_interaction/res/dockerfiles'
            ], `OS image local-os/${variant}`, {
                onStdout: (chunk) => process.stdout.write(chunk),
                onStderr: (chunk) => process.stderr.write(chunk)
            });
        }
    }
}

const WORKER_DOCKERFILES = Object.freeze({
    'dbbench-std': 'src/server/tasks/dbbench/Dockerfile',
    'os-std': 'src/server/tasks/os_interaction/Dockerfile',
    'kg-std': 'src/server/tasks/knowledgegraph/Dockerfile',
    'alfworld-std': 'src/server/tasks/alfworld/Dockerfile',
    'webshop-std': 'src/server/tasks/webshop/Dockerfile'
});

const WORKER_BASE_IMAGES = Object.freeze({
    'dbbench-std': ['python:3.10'],
    'os-std': ['python:3.10'],
    'kg-std': ['python:3.10'],
    'alfworld-std': ['alpine:3.22.0', 'python:3.9-bookworm'],
    'webshop-std': ['python:slim', 'python:3.9-bullseye']
});

function ownedWorkerContainer(task) {
    return `ailis-agentbench-fc-${task}`;
}

export function buildPlainDockerWorkerRunArgs(task, image) {
    const args = [
        'docker', 'run', '-d',
        '--name', ownedWorkerContainer(task),
        '--network', 'agentbench-fc_default'
    ];
    if (task === 'dbbench-std' || task === 'os-std') {
        args.push('-v', '/var/run/docker.sock:/var/run/docker.sock');
    }
    if (task === 'dbbench-std') {
        args.push('-e', 'DBBENCH_STD_PARAMETERS_ENV_OPTIONS_NETWORK_NAME=agentbench-fc_default');
    } else if (task === 'os-std') {
        args.push('-e', 'OS_STD_PARAMETERS_ENV_OPTIONS_NETWORK_NAME=agentbench-fc_default');
    } else if (task === 'kg-std') {
        args.push('-e', 'KG_STD_PARAMETERS_ENV_OPTIONS_URLS_KG=http://freebase:3001/sparql');
    }
    args.push(image, '--controller', 'http://172.17.0.1:5020/api', task);
    return args;
}

async function removeOwnedContainer(name) {
    await runWsl(['docker', 'rm', '-f', name]);
}

async function ensurePlainRuntimeContainer(name, image, extraArgs = []) {
    const running = await runWsl(['docker', 'inspect', '-f', '{{.State.Running}}', name]);
    if (running.code === 0 && running.stdout.replaceAll('\0', '').trim() === 'true') return;
    if (running.code === 0) await removeOwnedContainer(name);
    await ensureDockerImage(image);
    await runWslChecked([
        'docker', 'run', '-d', '--name', name, '--network', 'host', image, ...extraArgs
    ], `Docker container ${name}`);
    await new Promise((resolve) => setTimeout(resolve, 1_000));
    const ready = await runWsl(['docker', 'inspect', '-f', '{{.State.Running}}', name]);
    if (ready.code !== 0 || ready.stdout.replaceAll('\0', '').trim() !== 'true') {
        const logs = await runWsl(['docker', 'logs', '--tail', '80', name]);
        throw new Error(`Docker container ${name} exited during startup: ${logs.stderr || logs.stdout}`);
    }
}

function isTcpPortOpen(host, port, timeoutMs = 1_000) {
    return new Promise((resolve) => {
        const socket = net.createConnection({ host, port });
        const finish = (value) => {
            socket.destroy();
            resolve(value);
        };
        socket.setTimeout(timeoutMs);
        socket.once('connect', () => finish(true));
        socket.once('timeout', () => finish(false));
        socket.once('error', () => finish(false));
    });
}

async function ensurePlainDockerNetwork() {
    const found = await runWsl(['docker', 'network', 'inspect', 'agentbench-fc_default']);
    if (found.code !== 0) {
        await runWslChecked(
            ['docker', 'network', 'create', 'agentbench-fc_default'],
            'AgentBench FC Docker network'
        );
    }
}

async function provisionPlainDockerTask(task, manifest) {
    await ensurePlainDockerNetwork();
    if (!await isTcpPortOpen('127.0.0.1', 5020)) {
        await ensurePlainRuntimeContainer(
            'ailis-agentbench-fc-controller',
            'jingbh/agentrl-controller:latest',
            ['controller']
        );
    }
    if (!await isTcpPortOpen('127.0.0.1', 6379)) {
        await ensurePlainRuntimeContainer('ailis-agentbench-fc-redis', 'redis:7');
    }
    for (const baseImage of WORKER_BASE_IMAGES[task] || []) await ensureDockerImage(baseImage);

    if (task === 'kg-std') {
        const freebaseImage = `ailis-agentbench-fc-freebase:${manifest.revision.slice(0, 12)}`;
        if (!await hasDockerImage(freebaseImage)) {
            await runWslChecked([
                'env', 'DOCKER_BUILDKIT=1', 'docker', 'build',
                '-t', freebaseImage, '-f', 'extra/freebase.Dockerfile', '.'
            ], 'AgentBench FC Freebase image', {
                onStdout: (chunk) => process.stdout.write(chunk),
                onStderr: (chunk) => process.stderr.write(chunk)
            });
        }
        await removeOwnedContainer('ailis-agentbench-fc-freebase');
        await runWslChecked([
            'docker', 'run', '-d',
            '--name', 'ailis-agentbench-fc-freebase',
            '--network', 'agentbench-fc_default',
            '--network-alias', 'freebase',
            '-v', `${toWslPath(path.join(BENCHMARK_ROOT, 'extra', 'virtuoso_db', 'virtuoso.db'))}:/database/virtuoso.db`,
            freebaseImage
        ], 'AgentBench FC Freebase container');
    }

    const workerImage = `ailis-agentbench-fc-${task}:${manifest.revision.slice(0, 12)}`;
    if (!await hasDockerImage(workerImage)) {
        await runWslChecked([
            'env', 'DOCKER_BUILDKIT=1', 'docker', 'build', '-t', workerImage,
            '-f', WORKER_DOCKERFILES[task], '.'
        ], `AgentBench FC worker image ${task}`, {
            onStdout: (chunk) => process.stdout.write(chunk),
            onStderr: (chunk) => process.stderr.write(chunk)
        });
    }
    await removeOwnedContainer(ownedWorkerContainer(task));
    await runWslChecked(
        buildPlainDockerWorkerRunArgs(task, workerImage),
        `AgentBench FC worker ${task}`
    );
    return { mode: 'plain_docker', workerContainer: ownedWorkerContainer(task) };
}

async function provisionTaskEnvironment(task, definition, manifest) {
    const compose = await runWsl(['docker', 'compose', 'version']);
    if (compose.code !== 0) return provisionPlainDockerTask(task, manifest);
    const services = ['controller', 'redis', definition.composeService];
    if (task === 'kg-std') services.push('freebase');
    await runWslChecked([
        'docker', 'compose', '-f', 'extra/docker-compose.yml',
        'up', '-d', '--build', ...services
    ], 'AgentBench FC Docker Compose', {
        onStdout: (chunk) => process.stdout.write(chunk),
        onStderr: (chunk) => process.stderr.write(chunk)
    });
    return { mode: 'docker_compose', workerContainer: definition.composeService };
}

async function stopTaskEnvironment(environment, definition, task) {
    if (environment?.mode === 'plain_docker') {
        await removeOwnedContainer(environment.workerContainer);
        if (task === 'kg-std') await removeOwnedContainer('ailis-agentbench-fc-freebase');
        return;
    }
    await runWsl([
        'docker', 'compose', '-f', 'extra/docker-compose.yml',
        'stop', definition.composeService
    ]);
}

async function waitForJson(url, timeoutMs, predicate = (value) => Boolean(value)) {
    const deadline = Date.now() + timeoutMs;
    let lastError = '';
    while (Date.now() < deadline) {
        try {
            const response = await fetch(url, { signal: AbortSignal.timeout(10_000) });
            const data = await response.json();
            if (response.ok && predicate(data)) return data;
            lastError = `${response.status}: ${JSON.stringify(data)}`;
        } catch (error) {
            lastError = error?.message || String(error);
        }
        await new Promise((resolve) => setTimeout(resolve, 3_000));
    }
    throw new Error(`Timed out waiting for ${url}: ${lastError}`);
}

function startBridge(outputDir) {
    const stdout = fs.openSync(path.join(outputDir, 'bridge.stdout.log'), 'a');
    const stderr = fs.openSync(path.join(outputDir, 'bridge.stderr.log'), 'a');
    return spawn(process.execPath, [
        path.join(ROOT, 'scripts', 'serve-ailis-agentbench-fc.mjs'),
        '--port', String(BRIDGE_PORT),
        '--audit-dir', path.join(outputDir, 'bridge-audit')
    ], {
        cwd: ROOT,
        env: process.env,
        windowsHide: true,
        stdio: ['ignore', stdout, stderr]
    });
}

function dateStamp() {
    const now = new Date();
    return [now.getFullYear(), now.getMonth() + 1, now.getDate()]
        .map((value, index) => index === 0 ? String(value) : String(value).padStart(2, '0'))
        .join('');
}

function pythonCommand() {
    return process.env.AILIS_AGENTBENCH_PYTHON || 'python';
}

function numericArg(args, name, value) {
    if (Number.isFinite(value) && value > 0) args.push(name, String(Math.floor(value)));
}

async function main() {
    const manifest = await readAgentBenchFcManifest();
    const taskNames = Object.keys(manifest.tasks || {});
    const options = parseAgentBenchFcStageArgs(process.argv.slice(2), taskNames);
    const runId = options.runId || `agentbench-fc-${dateStamp()}-${options.stage}`;
    const outputDir = path.join(ROOT, 'eval-results', 'agentbench-fc', runId);
    await fsp.mkdir(outputDir, { recursive: true });
    await ensureAgentBenchFcCheckout(manifest);
    assertAgentBenchFcIntegrity(await verifyAgentBenchFcCheckout({
        root: BENCHMARK_ROOT,
        manifest,
        task: options.task
    }));

    const definition = manifest.tasks[options.task];
    console.log(`[AgentBench FC] provisioning ${options.task} at ${manifest.revision}`);
    await ensureEnvironmentPrerequisites(options.task);
    const environment = await provisionTaskEnvironment(options.task, definition, manifest);

    let bridge = null;
    try {
        const query = new URLSearchParams({ name: options.task });
        await waitForJson(
            `http://127.0.0.1:${manifest.controllerPort}/api/get_indices?${query}`,
            15 * 60_000,
            (value) => Array.isArray(value)
        );
        bridge = startBridge(outputDir);
        await waitForJson(
            `http://127.0.0.1:${BRIDGE_PORT}/health`,
            60_000,
            (value) => value?.ok === true && value?.protocol === 'openai_function_calling'
        );

        const policy = AGENTBENCH_FC_STAGE_POLICY[options.stage];
        const runnerArgs = [
            '-m', 'evals.agentbench_fc.run_fc',
            '--task', options.task,
            '--controller', `http://127.0.0.1:${manifest.controllerPort}/api`,
            '--bridge', `http://127.0.0.1:${BRIDGE_PORT}/v1`,
            '--output-dir', outputDir,
            '--run-id', runId,
            '--offset', String(options.offset),
            '--limit', String(options.limit),
            '--max-environment-turns', String(manifest.maxEnvironmentTurns),
            '--retry-errors'
        ];
        numericArg(runnerArgs, '--max-calls', policy.maxCalls);
        numericArg(runnerArgs, '--max-tokens', policy.maxTokens);
        numericArg(runnerArgs, '--max-duration-ms', policy.maxDurationMs);
        const runner = await runProcess(pythonCommand(), runnerArgs, {
            cwd: ROOT,
            onStdout: (chunk) => process.stdout.write(chunk),
            onStderr: (chunk) => process.stderr.write(chunk)
        });
        if (runner.code !== 0) {
            throw new Error(`AgentBench FC runner failed: ${runner.stderr || runner.stdout || runner.error}`);
        }
        const summaryPath = path.join(outputDir, `${runId}.${options.task}.summary.json`);
        const summary = JSON.parse(await fsp.readFile(summaryPath, 'utf8'));
        const gate = evaluateAgentBenchFcStageGate(summary, options.stage);
        const report = {
            schema: 'ailis.agentbench.fc.stage-report.v1',
            benchmark: {
                repository: manifest.repository,
                revision: manifest.revision,
                task: options.task,
                stage: options.stage
            },
            integrity: await verifyAgentBenchFcCheckout({ root: BENCHMARK_ROOT, manifest, task: options.task }),
            gate,
            summary
        };
        await fsp.writeFile(
            path.join(outputDir, `${runId}.${options.task}.stage-report.json`),
            `${JSON.stringify(report, null, 2)}\n`,
            'utf8'
        );
        console.log(JSON.stringify(report, null, 2));
        if (!gate.passed) process.exitCode = 2;
    } finally {
        if (bridge && !bridge.killed) bridge.kill();
        await stopTaskEnvironment(environment, definition, options.task).catch(() => {});
    }
}

if (path.resolve(process.argv[1] || '') === fileURLToPath(import.meta.url)) {
    main().catch((error) => {
        console.error(error?.stack || error);
        process.exitCode = 1;
    });
}
