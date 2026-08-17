// Clean SWE-bench Pro transport: AILIS TaskAgent edits an isolated repository and emits an official patch record.
import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

import {
    configureResearchMcpLlmEnvironment,
    loadDesktopStateSettings
} from './ailis-eval-runtime-config.mjs';
import { windowsPathToWslPath } from './swebench-pro-runtime.mjs';

const require = createRequire(import.meta.url);
const { AILISGateway } = require('../electron/ailis-gateway.cjs');
const execFileAsync = promisify(execFile);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const DATA_ROOT = path.join(PROJECT_ROOT, 'build-cache', 'benchmarks', 'swebench-pro', 'data');
const DEFAULT_TASKS = path.join(DATA_ROOT, 'swebench-pro.test.sample.smoke-11.tasks.jsonl');
const DEFAULT_WORKSPACES = path.join(PROJECT_ROOT, 'build-cache', 'benchmarks', 'swebench-pro', 'workspaces');
const DEFAULT_OUTPUT = path.join(PROJECT_ROOT, 'eval-results', 'engineering', 'swebench-pro', 'ailis');
const MIN_CONTAINER_VERIFICATION_TIMEOUT_MS = 120000;

function normalizeText(value, fallback = '') {
    return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

export function normalizeUnifiedDiff(value) {
    if (typeof value !== 'string' || !value.trim()) return '';
    return value.endsWith('\n') ? value : `${value}\n`;
}

export function resolveContainerVerificationTimeoutMs(requestedTimeoutMs, hostTimeoutMs = 0) {
    const requested = Number(requestedTimeoutMs) || 0;
    const host = Number(hostTimeoutMs) || 0;
    return Math.max(MIN_CONTAINER_VERIFICATION_TIMEOUT_MS, requested, host);
}

function safeSegment(value, fallback = 'task') {
    return normalizeText(value, fallback).replace(/[^a-z0-9_.-]+/gi, '-').replace(/^-+|-+$/g, '') || fallback;
}

function parseNumber(value, fallback, minimum = 0, maximum = Number.MAX_SAFE_INTEGER) {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) return fallback;
    return Math.max(minimum, Math.min(maximum, Math.floor(parsed)));
}

export function parseArgs(argv = process.argv.slice(2)) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const args = {
        tasksPath: DEFAULT_TASKS,
        workspaceRoot: DEFAULT_WORKSPACES,
        outputDir: DEFAULT_OUTPUT,
        runId: `ailis-swebench-pro-${timestamp}`,
        instanceIds: [],
        offset: 0,
        limit: 0,
        maxTurns: 250,
        requestTimeoutMs: 0,
        llmTimeoutMs: 600000,
        workspaceSource: 'git',
        gitProxy: normalizeText(process.env.AILIS_SWEBENCH_PRO_GIT_PROXY),
        containerBackend: 'auto',
        wslDistro: normalizeText(process.env.AILIS_SWEBENCH_PRO_WSL_DISTRO, 'Ubuntu-22.04'),
        planOnly: false,
        preflightOnly: false,
        provisionOnly: false,
        resume: true,
        codexModelBridge: false,
        codexModel: normalizeText(process.env.AILIS_CODEX_MODEL, 'gpt-5.6-luna'),
        codexReasoningEffort: normalizeText(process.env.AILIS_CODEX_REASONING_EFFORT, 'medium'),
        provider: '',
        baseUrl: '',
        model: '',
        apiKeyEnv: '',
        temperature: 0
    };
    for (let index = 0; index < argv.length; index += 1) {
        const token = argv[index];
        const next = () => argv[++index] || '';
        if (token === '--tasks') args.tasksPath = path.resolve(next());
        else if (token === '--workspace-root') args.workspaceRoot = path.resolve(next());
        else if (token === '--output-dir') args.outputDir = path.resolve(next());
        else if (token === '--run-id') args.runId = safeSegment(next(), args.runId);
        else if (token === '--instance') args.instanceIds.push(normalizeText(next()));
        else if (token === '--offset') args.offset = parseNumber(next(), 0);
        else if (token === '--limit') args.limit = parseNumber(next(), 0);
        else if (token === '--max-turns') args.maxTurns = parseNumber(next(), 250, 1, 250);
        else if (token === '--request-timeout-ms') args.requestTimeoutMs = parseNumber(next(), 0);
        else if (token === '--llm-timeout-ms') args.llmTimeoutMs = parseNumber(next(), 600000, 30000);
        else if (token === '--workspace-source') args.workspaceSource = normalizeText(next(), args.workspaceSource).toLowerCase();
        else if (token === '--git-proxy') args.gitProxy = normalizeText(next());
        else if (token === '--container-backend') args.containerBackend = normalizeText(next(), args.containerBackend).toLowerCase();
        else if (token === '--wsl-distro') args.wslDistro = normalizeText(next(), args.wslDistro);
        else if (token === '--plan-only') args.planOnly = true;
        else if (token === '--preflight-only') args.preflightOnly = true;
        else if (token === '--provision-only') args.provisionOnly = true;
        else if (token === '--resume') args.resume = true;
        else if (token === '--no-resume') args.resume = false;
        else if (token === '--codex-model-bridge') args.codexModelBridge = true;
        else if (token === '--no-codex-model-bridge') args.codexModelBridge = false;
        else if (token === '--codex-model') args.codexModel = normalizeText(next(), args.codexModel);
        else if (token === '--codex-reasoning-effort') args.codexReasoningEffort = normalizeText(next(), args.codexReasoningEffort);
        else if (token === '--provider') args.provider = normalizeText(next());
        else if (token === '--base-url') args.baseUrl = normalizeText(next());
        else if (token === '--model') args.model = normalizeText(next());
        else if (token === '--api-key-env') args.apiKeyEnv = normalizeText(next());
        else if (token === '--temperature') args.temperature = Math.max(0, Math.min(2, Number(next()) || 0));
    }
    args.tasksPath = path.resolve(args.tasksPath);
    args.workspaceRoot = path.resolve(args.workspaceRoot);
    args.outputDir = path.resolve(args.outputDir);
    args.runDir = path.join(args.outputDir, args.runId);
    args.rawDir = path.join(args.runDir, 'raw');
    args.predictionsPath = path.join(args.runDir, 'predictions.json');
    args.summaryPath = path.join(args.runDir, 'summary.json');
    args.planPath = path.join(args.runDir, 'plan.json');
    if (!['git', 'image'].includes(args.workspaceSource)) {
        throw new Error(`Unsupported workspace source: ${args.workspaceSource}. Expected git or image.`);
    }
    if (!['auto', 'native', 'wsl'].includes(args.containerBackend)) {
        throw new Error(`Unsupported container backend: ${args.containerBackend}. Expected auto, native, or wsl.`);
    }
    return args;
}

async function readJsonl(filePath) {
    return (await fs.readFile(filePath, 'utf8'))
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => JSON.parse(line));
}

export function validateAgentTask(task = {}) {
    const errors = [];
    for (const field of ['instance_id', 'repo', 'base_commit', 'problem_statement', 'dockerhub_tag']) {
        if (!normalizeText(task[field])) errors.push(`missing ${field}`);
    }
    for (const forbidden of ['patch', 'test_patch', 'fail_to_pass', 'pass_to_pass']) {
        if (Object.hasOwn(task, forbidden)) errors.push(`agent task leaks ${forbidden}`);
    }
    return { ok: errors.length === 0, errors };
}

export function buildTaskPrompt(task = {}) {
    return [
        `SWE-bench Pro repository repair task (${task.instance_id})`,
        '',
        'Work directly in the current repository. Inspect the codebase, reproduce or understand the issue, edit the implementation, and run relevant tests when the environment permits.',
        'Do not merely describe a solution. Finish with the repository working tree containing the complete solution. Do not search for benchmark gold patches or hidden tests.',
        '',
        'Problem statement:',
        normalizeText(task.problem_statement),
        normalizeText(task.requirements) ? `\nRequirements:\n${normalizeText(task.requirements)}` : '',
        normalizeText(task.interface) ? `\nNew or changed interfaces:\n${normalizeText(task.interface)}` : ''
    ].filter(Boolean).join('\n');
}

function workspaceForTask(args, task) {
    return path.join(args.workspaceRoot, safeSegment(task.instance_id), 'repo');
}

async function runCommand(command, commandArgs = [], options = {}) {
    try {
        const result = await execFileAsync(command, commandArgs, {
            cwd: options.cwd || PROJECT_ROOT,
            env: options.env ? { ...process.env, ...options.env } : process.env,
            windowsHide: true,
            timeout: options.timeoutMs || 120000,
            maxBuffer: options.maxBuffer || 64 * 1024 * 1024,
            encoding: 'utf8'
        });
        return { ok: true, stdout: normalizeText(result.stdout), stderr: normalizeText(result.stderr), error: '' };
    } catch (error) {
        return {
            ok: false,
            stdout: normalizeText(error.stdout),
            stderr: normalizeText(error.stderr),
            error: error?.message || String(error),
            code: error?.code ?? null
        };
    }
}

async function inspectContainerBackend(args) {
    if (args.containerBackend !== 'wsl') {
        const native = await runCommand('docker', ['version', '--format', '{{.Server.Version}}'], { timeoutMs: 30000 });
        if (native.ok) {
            return { ok: true, backend: 'native', serverVersion: native.stdout, error: '' };
        }
        if (args.containerBackend === 'native') {
            return { ok: false, backend: 'native', serverVersion: '', error: native.stderr || native.error };
        }
    }
    const wsl = await runCommand('wsl', [
        '-d', args.wslDistro, '--', 'docker', 'version', '--format', '{{.Server.Version}}'
    ], { timeoutMs: 30000 });
    return {
        ok: wsl.ok,
        backend: 'wsl',
        distro: args.wslDistro,
        serverVersion: wsl.stdout,
        error: wsl.ok ? '' : (wsl.stderr || wsl.error)
    };
}

async function runDocker(args, backend, dockerArgs, options = {}) {
    if (backend.backend === 'wsl') {
        return runCommand('wsl', ['-d', args.wslDistro, '--', 'docker', ...dockerArgs], options);
    }
    return runCommand('docker', dockerArgs, options);
}

export function createSWEProVerificationExecutor({
    args,
    tasks = [],
    resolveContainerBackend = inspectContainerBackend,
    runContainer = runDocker,
    resolveContainerWorkspacePath = resolveWslPath
} = {}) {
    const tasksByWorkspace = new Map(
        tasks.map((task) => [path.resolve(workspaceForTask(args, task)).toLowerCase(), task])
    );
    let backendPromise = null;
    const resolveBackend = () => {
        if (!backendPromise) backendPromise = resolveContainerBackend(args);
        return backendPromise;
    };

    return async ({ args: verificationArgs = {}, workspaceDir = '' } = {}) => {
        const startedAt = Date.now();
        const workspace = path.resolve(workspaceDir);
        const task = tasksByWorkspace.get(workspace.toLowerCase());
        const environment = {
            schema: 'ailis.verification_environment.v1',
            kind: 'container',
            name: 'swe-bench-pro-official-image',
            platform: 'linux',
            shell: '/bin/bash',
            workspace: '/app',
            image: task ? `jefzda/sweap-images:${task.dockerhub_tag}` : '',
            backend: args.containerBackend
        };
        if (!task) {
            return {
                content: [{ type: 'text', text: 'No SWE-bench Pro task is bound to this workspace.' }],
                isError: true,
                details: {
                    status: 'verification_environment_unavailable',
                    error: 'No SWE-bench Pro task is bound to this workspace.',
                    exitCode: null,
                    environment
                }
            };
        }

        const workdir = resolveSWEProVerificationWorkdir({
            workspace,
            requestedWorkdir: verificationArgs.workdir,
            containerWorkspace: environment.workspace
        });
        if (!workdir.ok) {
            return {
                content: [{ type: 'text', text: 'Verification workdir is outside the task workspace.' }],
                isError: true,
                details: {
                    status: 'verification_workdir_blocked',
                    error: 'Verification workdir is outside the task workspace.',
                    exitCode: null,
                    environment
                }
            };
        }

        const backend = await resolveBackend();
        environment.backend = backend.backend || environment.backend;
        if (!backend.ok) {
            return {
                content: [{ type: 'text', text: backend.error || 'Container backend unavailable.' }],
                isError: true,
                details: {
                    status: 'verification_environment_unavailable',
                    error: backend.error || 'Container backend unavailable.',
                    exitCode: null,
                    environment
                }
            };
        }

        const mountSource = backend.backend === 'wsl'
            ? await resolveContainerWorkspacePath(args, workspace)
            : workspace;
        const containerWorkdir = workdir.containerWorkdir;
        const dockerArgs = [
            'run', '--rm',
            '--entrypoint', environment.shell,
            '-v', `${mountSource}:/app`,
            '-w', containerWorkdir
        ];
        for (const [key, value] of Object.entries(verificationArgs.env || {})) {
            if (/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) {
                dockerArgs.push('--env', `${key}=${String(value)}`);
            }
        }
        dockerArgs.push(environment.image, '-lc', normalizeText(verificationArgs.command));
        const maxOutputBytes = Math.max(
            1024 * 1024,
            Math.min(128 * 1024 * 1024, Number(verificationArgs.maxOutputBytes) || 64 * 1024 * 1024)
        );
        const result = await runContainer(args, backend, dockerArgs, {
            timeoutMs: resolveContainerVerificationTimeoutMs(
                verificationArgs.timeoutMs,
                args.requestTimeoutMs
            ),
            maxBuffer: maxOutputBytes
        });
        const exitCode = result.ok
            ? 0
            : (Number.isFinite(Number(result.code)) ? Number(result.code) : null);
        return {
            content: [{ type: 'text', text: result.ok ? result.stdout : (result.stderr || result.error) }],
            isError: !result.ok,
            details: {
                status: result.ok ? 'completed' : 'verification_failed',
                exitCode,
                durationMs: Date.now() - startedAt,
                stdout: result.stdout || '',
                stderr: result.stderr || '',
                error: result.ok ? '' : (result.stderr || result.error || 'Verification command failed.'),
                environment
            }
        };
    };
}

export function resolveSWEProVerificationWorkdir({
    workspace = '',
    requestedWorkdir = '.',
    containerWorkspace = '/app'
} = {}) {
    const resolvedWorkspace = path.resolve(workspace);
    const containerRoot = normalizeText(containerWorkspace, '/app')
        .replace(/\\/g, '/')
        .replace(/\/+$/g, '') || '/';
    const requested = normalizeText(requestedWorkdir, '.');
    const requestedPosix = requested.replace(/\\/g, '/');
    let hostWorkdir;

    if (requestedPosix === containerRoot) {
        hostWorkdir = resolvedWorkspace;
    } else if (requestedPosix.startsWith(`${containerRoot}/`)) {
        const containerRelative = requestedPosix.slice(containerRoot.length + 1);
        hostWorkdir = path.resolve(resolvedWorkspace, ...containerRelative.split('/').filter(Boolean));
    } else {
        hostWorkdir = path.resolve(resolvedWorkspace, requested);
    }

    const relativeWorkdir = path.relative(resolvedWorkspace, hostWorkdir);
    if (relativeWorkdir.startsWith('..') || path.isAbsolute(relativeWorkdir)) {
        return {
            ok: false,
            hostWorkdir,
            relativeWorkdir,
            containerWorkdir: ''
        };
    }
    return {
        ok: true,
        hostWorkdir,
        relativeWorkdir,
        containerWorkdir: relativeWorkdir
            ? path.posix.join(containerRoot, relativeWorkdir.split(path.sep).join('/'))
            : containerRoot
    };
}

async function resolveWslPath(args, windowsPath) {
    void args;
    return windowsPathToWslPath(windowsPath);
}

async function inspectWorkspace(args, task) {
    const workspace = workspaceForTask(args, task);
    if (!fsSync.existsSync(path.join(workspace, '.git'))) {
        return { ready: false, workspace, status: 'workspace_missing', head: '', dirty: false };
    }
    const [head, status] = await Promise.all([
        runCommand('git', ['rev-parse', 'HEAD'], { cwd: workspace }),
        runCommand('git', ['status', '--porcelain=v1'], { cwd: workspace })
    ]);
    const currentHead = normalizeText(head.stdout);
    const dirty = Boolean(normalizeText(status.stdout));
    const errors = [];
    if (!head.ok) errors.push(head.stderr || head.error || 'cannot read HEAD');
    if (currentHead !== normalizeText(task.base_commit)) {
        errors.push(`HEAD ${currentHead || '(unknown)'} does not equal base_commit ${task.base_commit}`);
    }
    if (dirty) errors.push('workspace is not clean');
    return { ready: errors.length === 0, workspace, status: errors.length ? 'workspace_invalid' : 'ready', head: currentHead, dirty, errors };
}

async function provisionFromOfficialImage(args, task) {
    const workspace = workspaceForTask(args, task);
    if (fsSync.existsSync(workspace) && (await fs.readdir(workspace)).length) {
        return { ok: false, status: 'workspace_not_empty', workspace };
    }
    const backend = await inspectContainerBackend(args);
    if (!backend.ok) return { ok: false, status: 'docker_unavailable', workspace, backend, error: backend.error };
    const image = `jefzda/sweap-images:${task.dockerhub_tag}`;
    const pull = await runDocker(args, backend, ['pull', image], { timeoutMs: 60 * 60 * 1000, maxBuffer: 128 * 1024 * 1024 });
    if (!pull.ok) return { ok: false, status: 'image_pull_failed', workspace, image, backend, error: pull.stderr || pull.error };
    await fs.mkdir(workspace, { recursive: true });
    const containerName = `ailis-swepro-${safeSegment(task.instance_id).slice(-48)}-${randomUUID().slice(0, 8)}`;
    const created = await runDocker(args, backend, ['create', '--name', containerName, image], { timeoutMs: 120000 });
    if (!created.ok) return { ok: false, status: 'container_create_failed', workspace, image, backend, error: created.stderr || created.error };
    try {
        const copyTarget = backend.backend === 'wsl' ? await resolveWslPath(args, workspace) : workspace;
        const copied = await runDocker(args, backend, ['cp', `${containerName}:/app/.`, copyTarget], {
            timeoutMs: 30 * 60 * 1000,
            maxBuffer: 128 * 1024 * 1024
        });
        if (!copied.ok) return { ok: false, status: 'workspace_copy_failed', workspace, image, backend, error: copied.stderr || copied.error };
        const checkout = await runCommand('git', ['checkout', '--detach', task.base_commit], { cwd: workspace, timeoutMs: 180000 });
        if (!checkout.ok) return { ok: false, status: 'base_checkout_failed', workspace, image, backend, error: checkout.stderr || checkout.error };
        return { ok: true, status: 'provisioned', workspace, image, backend };
    } finally {
        await runDocker(args, backend, ['rm', '-f', containerName], { timeoutMs: 120000 });
    }
}

async function provisionFromGit(args, task) {
    const workspace = workspaceForTask(args, task);
    const gitDir = path.join(workspace, '.git');
    if (fsSync.existsSync(workspace) && (await fs.readdir(workspace)).length && !fsSync.existsSync(gitDir)) {
        return { ok: false, status: 'workspace_not_empty', workspace, source: 'git' };
    }
    await fs.mkdir(workspace, { recursive: true });
    const repositoryUrl = `https://github.com/${normalizeText(task.repo)}.git`;
    const gitPrefix = args.gitProxy ? ['-c', `http.proxy=${args.gitProxy}`] : [];
    const git = (commandArgs, options = {}) => runCommand('git', [...gitPrefix, ...commandArgs], {
        timeoutMs: 30 * 60 * 1000,
        maxBuffer: 128 * 1024 * 1024,
        ...options
    });
    if (!fsSync.existsSync(gitDir)) {
        const initialized = await git(['init', '--quiet', workspace]);
        if (!initialized.ok) {
            return { ok: false, status: 'git_workspace_failed', workspace, source: 'git', repositoryUrl, error: initialized.stderr || initialized.error };
        }
    }
    const remote = await git(['-C', workspace, 'remote', 'get-url', 'origin']);
    const configuredRemote = remote.ok
        ? await git(['-C', workspace, 'remote', 'set-url', 'origin', repositoryUrl])
        : await git(['-C', workspace, 'remote', 'add', 'origin', repositoryUrl]);
    if (!configuredRemote.ok) {
        return { ok: false, status: 'git_workspace_failed', workspace, source: 'git', repositoryUrl, error: configuredRemote.stderr || configuredRemote.error };
    }
    // Recover old partial-clone attempts before fetching one complete shallow commit pack.
    await git(['-C', workspace, 'config', '--unset-all', 'remote.origin.promisor']);
    await git(['-C', workspace, 'config', '--unset-all', 'remote.origin.partialclonefilter']);
    let lastFailure = null;
    for (let attempt = 1; attempt <= 3; attempt += 1) {
        const fetched = await git([
            '-C', workspace, 'fetch', '--quiet', '--no-tags', '--depth', '1', 'origin', normalizeText(task.base_commit)
        ]);
        if (fetched.ok) {
            const checkout = await git(['-C', workspace, 'checkout', '--quiet', '--detach', 'FETCH_HEAD']);
            if (checkout.ok) {
                return { ok: true, status: 'provisioned', workspace, source: 'git', repositoryUrl, attempts: attempt };
            }
            lastFailure = checkout;
        } else {
            lastFailure = fetched;
        }
        if (attempt < 3) await new Promise((resolve) => setTimeout(resolve, attempt * 2000));
    }
    return {
        ok: false,
        status: 'git_workspace_failed',
        workspace,
        source: 'git',
        repositoryUrl,
        attempts: 3,
        error: lastFailure?.stderr || lastFailure?.error || 'git fetch/checkout failed'
    };
}

function resolveLlmSettings(args) {
    const runtime = loadDesktopStateSettings(args);
    const settings = { ...runtime.llmSettings };
    if (args.provider) settings.provider = args.provider;
    if (args.baseUrl) settings.baseUrl = args.baseUrl;
    if (args.model) settings.model = args.model;
    if (args.apiKeyEnv) settings.apiKey = normalizeText(process.env[args.apiKeyEnv]);
    settings.timeoutMs = args.llmTimeoutMs;
    settings.temperature = args.temperature;
    const keyless = new Set(['codex-model-bridge', 'ollama', 'vllm']);
    if (!normalizeText(settings.provider) || !normalizeText(settings.model)) {
        throw new Error('LLM provider and model are required. Configure them in AILIS or pass --provider/--model.');
    }
    if (!keyless.has(normalizeText(settings.provider).toLowerCase()) && !normalizeText(settings.baseUrl)) {
        throw new Error(`LLM base URL is missing for ${settings.provider}.`);
    }
    if (!keyless.has(normalizeText(settings.provider).toLowerCase()) && !normalizeText(settings.apiKey)) {
        throw new Error(`LLM API key is missing for ${settings.provider}.`);
    }
    return { runtime, settings };
}

export function buildAgentPayload({ args, task, workspace, llmSettings, runId, sessionId }) {
    const verificationEnvironment = {
        schema: 'ailis.verification_environment.v1',
        kind: 'container',
        name: 'swe-bench-pro-official-image',
        platform: 'linux',
        shell: '/bin/bash',
        workspace: '/app',
        image: `jefzda/sweap-images:${task.dockerhub_tag}`,
        backend: args.containerBackend
    };
    return {
        runId,
        sessionId,
        message: buildTaskPrompt(task),
        messageHistory: [],
        attachments: [],
        agentLoop: 'llm',
        planner: 'llm',
        memoryPolicy: 'disabled',
        llmSettings,
        directToolExecutor: true,
        nativeDirectTools: true,
        verificationEnvironment,
        deliveryProtocol: {
            schema: 'ailis.delivery_policy.v1',
            enabled: true,
            mode: 'engineering',
            requireVerification: true,
            allowUnverifiedDelivery: false
        },
        context: {
            runId,
            sessionId,
            workspace,
            memoryPolicy: 'disabled',
            agentLoop: 'llm',
            planner: 'llm',
            llmSettings,
            directToolExecutor: true,
            nativeDirectTools: true,
            verificationEnvironment,
            deliveryProtocol: {
                schema: 'ailis.delivery_policy.v1',
                enabled: true,
                mode: 'engineering',
                requireVerification: true,
                allowUnverifiedDelivery: false
            },
            agentRole: 'task_agent',
            permissionProfile: 'danger-full-access',
            approvalPolicy: 'never',
            confirmationPolicy: 'never',
            approved: true,
            executeExternal: true,
            allowOutsideWorkspace: false,
            allowComputerWideAccess: false,
            allowSystemMutation: true,
            benchmarkEnvironment: 'swe-bench-pro',
            benchmarkProtocol: 'official-patch-v1',
            benchmarkMaxTurns: args.maxTurns
        }
    };
}

async function runWithLimits(gateway, payload, { maxTurns, timeoutMs }) {
    let turns = 0;
    let limitReason = '';
    let interruptPromise = null;
    let timeoutId = null;
    const interrupt = (reason) => {
        if (interruptPromise) return interruptPromise;
        limitReason = reason;
        interruptPromise = gateway.interruptAgentRun({
            runId: payload.runId,
            sessionId: payload.sessionId,
            reason,
            source: 'swebench_pro_transport'
        }).catch((error) => ({ ok: false, status: 'interrupt_failed', error: error?.message || String(error) }));
        return interruptPromise;
    };
    const listener = (event) => {
        if (event?.type !== 'agent.llm_call.completed') return;
        if (normalizeText(event.payload?.runId) !== payload.runId) return;
        turns += 1;
        if (turns >= maxTurns) void interrupt('swebench_pro_max_turns');
    };
    gateway.on('event', listener);
    gateway.on('private-event', listener);
    if (timeoutMs > 0) timeoutId = setTimeout(() => void interrupt('swebench_pro_deadline'), timeoutMs);
    try {
        const response = await gateway.runAgent(payload);
        return { response, turns, limitReason, interruptResult: interruptPromise ? await interruptPromise : null };
    } finally {
        if (timeoutId) clearTimeout(timeoutId);
        gateway.off('event', listener);
        gateway.off('private-event', listener);
    }
}

export async function capturePatch(workspace) {
    const temporaryIndexDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-swe-index-'));
    const temporaryIndexPath = path.join(temporaryIndexDir, 'index');
    const gitEnvironment = { GIT_INDEX_FILE: temporaryIndexPath };
    try {
        const readTree = await runCommand('git', ['read-tree', 'HEAD'], {
            cwd: workspace,
            timeoutMs: 120000,
            env: gitEnvironment
        });
        if (!readTree.ok) return { ok: false, patch: '', error: readTree.stderr || readTree.error };
        const intent = await runCommand('git', ['add', '-N', '--', '.'], {
            cwd: workspace,
            timeoutMs: 120000,
            env: gitEnvironment
        });
        if (!intent.ok) return { ok: false, patch: '', error: intent.stderr || intent.error };
        const diff = await runCommand('git', ['diff', '--binary', '--no-ext-diff', '--', '.'], {
            cwd: workspace,
            timeoutMs: 120000,
            maxBuffer: 128 * 1024 * 1024,
            env: gitEnvironment
        });
        return {
            ok: diff.ok,
            patch: normalizeUnifiedDiff(diff.stdout),
            error: diff.ok ? '' : (diff.stderr || diff.error)
        };
    } finally {
        await fs.rm(temporaryIndexDir, { recursive: true, force: true });
    }
}

async function stopGateway(gateway) {
    let timer;
    try {
        return await Promise.race([
            gateway.stop().then(() => ({ ok: true, status: 'stopped' })),
            new Promise((resolve) => {
                timer = setTimeout(() => resolve({ ok: false, status: 'stop_timeout' }), 15000);
            })
        ]);
    } finally {
        if (timer) clearTimeout(timer);
    }
}

async function loadSelectedTasks(args) {
    let tasks = await readJsonl(args.tasksPath);
    const invalid = tasks.map((task) => ({ task, validation: validateAgentTask(task) })).filter((item) => !item.validation.ok);
    if (invalid.length) throw new Error(`Invalid agent task data: ${JSON.stringify(invalid.slice(0, 3))}`);
    if (args.instanceIds.length) {
        const selected = new Set(args.instanceIds);
        tasks = tasks.filter((task) => selected.has(task.instance_id));
    }
    tasks = tasks.slice(args.offset);
    if (args.limit) tasks = tasks.slice(0, args.limit);
    return tasks;
}

async function main() {
    const args = parseArgs();
    const tasks = await loadSelectedTasks(args);
    await fs.mkdir(args.runDir, { recursive: true });
    const workspaceChecks = await Promise.all(tasks.map((task) => inspectWorkspace(args, task)));
    const plan = {
        schema: 'ailis.swebench_pro.plan.v1',
        generatedAt: new Date().toISOString(),
        runId: args.runId,
        tasksPath: args.tasksPath,
        taskCount: tasks.length,
        maxTurns: args.maxTurns,
        requestTimeoutMs: args.requestTimeoutMs,
        workspaceSource: args.workspaceSource,
        gitProxyConfigured: Boolean(args.gitProxy),
        containerBackend: args.containerBackend,
        wslDistro: args.wslDistro,
        workspaceRoot: args.workspaceRoot,
        workspacesReady: workspaceChecks.filter((item) => item.ready).length,
        workspaces: tasks.map((task, index) => ({ instance_id: task.instance_id, repo: task.repo, ...workspaceChecks[index] }))
    };
    await fs.writeFile(args.planPath, `${JSON.stringify(plan, null, 2)}\n`, 'utf8');
    if (args.planOnly || args.preflightOnly) {
        process.stdout.write(`${JSON.stringify(plan, null, 2)}\n`);
        if (args.preflightOnly && plan.workspacesReady !== tasks.length) process.exitCode = 1;
        return;
    }
    if (args.provisionOnly) {
        const results = [];
        for (let index = 0; index < tasks.length; index += 1) {
            const task = tasks[index];
            if (workspaceChecks[index].ready) {
                results.push({ ok: true, status: 'already_ready', instance_id: task.instance_id, workspace: workspaceChecks[index].workspace });
                continue;
            }
            const provisioned = args.workspaceSource === 'image'
                ? await provisionFromOfficialImage(args, task)
                : await provisionFromGit(args, task);
            results.push({ instance_id: task.instance_id, ...provisioned });
        }
        const report = { ...plan, provisioned: results.filter((item) => item.ok).length, results };
        await fs.writeFile(args.summaryPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
        process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
        if (results.some((item) => !item.ok)) process.exitCode = 1;
        return;
    }
    if (workspaceChecks.some((item) => !item.ready)) {
        throw new Error('One or more task workspaces are not ready. Run --preflight-only, then --provision-only.');
    }

    const { runtime, settings: llmSettings } = resolveLlmSettings(args);
    configureResearchMcpLlmEnvironment(llmSettings);
    await fs.mkdir(args.rawDir, { recursive: true });
    const gateway = new AILISGateway({
        host: '127.0.0.1',
        port: 0,
        workspaceDir: args.workspaceRoot,
        workspaceRoot: args.workspaceRoot,
        auditDir: path.join(args.runDir, 'gateway-audit'),
        mcpConfigPath: runtime.mcpConfigPath || undefined,
        disableBuiltinAilisResearchMcp: true,
        emberHarnessEnabled: false,
        profileCurationEnabled: false,
        taskVerificationExecutor: createSWEProVerificationExecutor({ args, tasks }),
        mcpServers: runtime.mcpConfigPath ? undefined : {}
    });
    const results = [];
    let stopStatus = { ok: false, status: 'not_started' };
    try {
        await gateway.start();
        for (let index = 0; index < tasks.length; index += 1) {
            const task = tasks[index];
            const workspace = workspaceChecks[index].workspace;
            const rawPath = path.join(args.rawDir, `${safeSegment(task.instance_id)}.json`);
            if (args.resume && fsSync.existsSync(rawPath)) {
                const existing = JSON.parse(await fs.readFile(rawPath, 'utf8'));
                results.push(existing);
                process.stdout.write(`[${index + 1}/${tasks.length}] ${task.instance_id} resumed\n`);
                continue;
            }
            process.stdout.write(`[${index + 1}/${tasks.length}] ${task.instance_id} ... `);
            const runId = randomUUID();
            const sessionId = randomUUID();
            const startedAt = Date.now();
            let record;
            try {
                const execution = await runWithLimits(
                    gateway,
                    buildAgentPayload({ args, task, workspace, llmSettings, runId, sessionId }),
                    { maxTurns: args.maxTurns, timeoutMs: args.requestTimeoutMs }
                );
                const patch = await capturePatch(workspace);
                const analysis = await gateway.analyzeAgentRun(runId, { transcriptLimit: 4000 }).catch(() => null);
                const delivery = execution.response?.delivery ||
                    execution.response?.taskRunHandoff?.delivery ||
                    execution.response?.task_run_handoff?.delivery ||
                    null;
                const patchStatus = patch.patch ? 'patch_generated' : 'no_patch';
                const deliveryStatus = normalizeText(delivery?.status, execution.response?.status || '');
                const verifiedDelivery = patchStatus === 'patch_generated' && deliveryStatus === 'verified_delivery';
                record = {
                    schema: 'ailis.swebench_pro.task_result.v1',
                    instance_id: task.instance_id,
                    repo: task.repo,
                    base_commit: task.base_commit,
                    run_id: runId,
                    session_id: sessionId,
                    status: verifiedDelivery
                        ? 'verified_delivery'
                        : (patch.patch ? 'patch_generated' : (patch.ok ? 'no_patch' : 'patch_capture_failed')),
                    ok: Boolean(patch.ok && verifiedDelivery),
                    patch_status: patchStatus,
                    delivery_status: deliveryStatus,
                    delivery,
                    duration_ms: Date.now() - startedAt,
                    turns: execution.turns,
                    limit_reason: execution.limitReason,
                    patch: patch.patch,
                    patch_error: patch.error,
                    response_status: execution.response?.status || '',
                    analysis
                };
            } catch (error) {
                record = {
                    schema: 'ailis.swebench_pro.task_result.v1',
                    instance_id: task.instance_id,
                    repo: task.repo,
                    base_commit: task.base_commit,
                    run_id: runId,
                    session_id: sessionId,
                    status: 'runner_error',
                    ok: false,
                    duration_ms: Date.now() - startedAt,
                    turns: 0,
                    patch: '',
                    error: error?.message || String(error)
                };
            }
            await fs.writeFile(rawPath, `${JSON.stringify(record, null, 2)}\n`, 'utf8');
            results.push(record);
            process.stdout.write(`${record.status} | turns=${record.turns} | patch=${record.patch.length} chars\n`);
        }
    } finally {
        stopStatus = await stopGateway(gateway);
    }

    const predictions = results.map((result) => ({
        instance_id: result.instance_id,
        patch: normalizeUnifiedDiff(result.patch),
        prefix: 'ailis-taskagent'
    }));
    await fs.writeFile(args.predictionsPath, `${JSON.stringify(predictions, null, 2)}\n`, 'utf8');
    const summary = {
        ...plan,
        protocol: 'clean-production-task-agent-pass-at-1',
        model: {
            provider: llmSettings.provider,
            baseUrl: llmSettings.baseUrl,
            model: llmSettings.model,
            reasoningEffort: llmSettings.reasoningEffort || ''
        },
        completed: results.filter((item) => item.ok).length,
        verifiedDeliveries: results.filter((item) => item.ok && item.delivery_status === 'verified_delivery').length,
        patchesGenerated: results.filter((item) => item.patch_status === 'patch_generated').length,
        unverifiedPatches: results.filter((item) =>
            item.patch_status === 'patch_generated' && item.delivery_status !== 'verified_delivery'
        ).length,
        failed: results.filter((item) => !item.ok).length,
        turns: results.reduce((sum, item) => sum + (Number(item.turns) || 0), 0),
        predictionsPath: args.predictionsPath,
        gatewayStopStatus: stopStatus
    };
    await fs.writeFile(args.summaryPath, `${JSON.stringify(summary, null, 2)}\n`, 'utf8');
    process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    main().catch((error) => {
        console.error(error?.stack || error?.message || String(error));
        process.exitCode = 1;
    });
}
