import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

export const SWE_BENCH_PRO_HARNESS_REPO = 'https://github.com/scaleapi/SWE-bench_Pro-os.git';
export const SWE_BENCH_PRO_HARNESS_REF = 'ca10a60a5fcae51e6948ffe1485d4153d421e6c5';
export const DEFAULT_SWE_BENCH_PRO_HARNESS_DIR = path.join(
    projectRoot,
    'build-cache',
    'benchmarks',
    'swebench-pro-official'
);
export const DEFAULT_SWE_BENCH_PRO_DATA_DIR = path.join(
    projectRoot,
    'build-cache',
    'benchmarks',
    'swebench-pro',
    'data'
);

const REQUIRED_HARNESS_PATHS = [
    'swe_bench_pro_eval.py',
    'requirements.txt',
    'run_scripts',
    'dockerfiles',
    'helper_code'
];

function parseArgs(argv = process.argv.slice(2)) {
    const first = argv[0] && !argv[0].startsWith('--') ? argv[0] : 'doctor';
    const startIndex = first === 'doctor' && argv[0]?.startsWith('--') ? 0 : 1;
    const args = {
        action: first,
        harnessDir: DEFAULT_SWE_BENCH_PRO_HARNESS_DIR,
        ref: SWE_BENCH_PRO_HARNESS_REF,
        mode: 'local-docker',
        wslDistro: process.env.AILIS_SWEBENCH_PRO_WSL_DISTRO || 'Ubuntu-22.04',
        python: process.env.AILIS_SWEBENCH_PRO_PYTHON || 'python',
        pythonExplicit: Boolean(process.env.AILIS_SWEBENCH_PRO_PYTHON),
        rawSamplePath: path.join(DEFAULT_SWE_BENCH_PRO_DATA_DIR, 'swebench-pro.test.sample.leaderboard.official.jsonl'),
        patchPath: path.join(projectRoot, 'eval-results', 'engineering', 'swebench-pro', 'predictions.json'),
        outputDir: path.join(projectRoot, 'eval-results', 'engineering', 'swebench-pro', 'official'),
        workers: 1,
        dockerhubUsername: 'jefzda',
        blockNetwork: false,
        redo: false,
        dryRun: false,
        update: false
    };
    for (let index = startIndex; index < argv.length; index += 1) {
        const token = argv[index];
        const next = () => argv[++index] || '';
        if (token === '--harness-dir') args.harnessDir = path.resolve(next() || args.harnessDir);
        else if (token === '--ref') args.ref = next() || args.ref;
        else if (token === '--mode') args.mode = next() || args.mode;
        else if (token === '--wsl-distro') args.wslDistro = next() || args.wslDistro;
        else if (token === '--python') {
            args.python = next() || args.python;
            args.pythonExplicit = true;
        }
        else if (token === '--raw-sample-path' || token === '--dataset') args.rawSamplePath = path.resolve(next());
        else if (token === '--patch-path' || token === '--patches') args.patchPath = path.resolve(next());
        else if (token === '--output-dir') args.outputDir = path.resolve(next() || args.outputDir);
        else if (token === '--workers') args.workers = Number(next() || args.workers);
        else if (token === '--dockerhub-username') args.dockerhubUsername = next() || args.dockerhubUsername;
        else if (token === '--block-network') args.blockNetwork = true;
        else if (token === '--redo') args.redo = true;
        else if (token === '--dry-run') args.dryRun = true;
        else if (token === '--update') args.update = true;
    }
    args.workers = Math.max(1, Math.min(Number.isFinite(args.workers) ? args.workers : 1, 100));
    if (!['local-docker', 'wsl-docker', 'modal'].includes(args.mode)) {
        throw new Error(`Unsupported SWE-bench Pro mode: ${args.mode}. Expected local-docker, wsl-docker, or modal.`);
    }
    if (args.mode === 'wsl-docker' && !args.pythonExplicit) {
        args.python = '/root/.cache/ailis/swebench-pro-venv/bin/python';
    }
    return args;
}

export function windowsPathToWslPath(targetPath) {
    const resolved = path.resolve(targetPath);
    const drive = resolved.match(/^([a-zA-Z]):[\\/](.*)$/);
    if (drive) {
        return `/mnt/${drive[1].toLowerCase()}/${drive[2].replace(/\\/g, '/')}`;
    }
    if (resolved.startsWith('/')) return resolved;
    throw new Error(`Cannot map path into WSL: ${targetPath}`);
}

async function pathExists(targetPath) {
    try {
        await fs.access(targetPath);
        return true;
    } catch {
        return false;
    }
}

async function runCommand(command, args = [], options = {}) {
    const startedAt = Date.now();
    try {
        const result = await execFileAsync(command, args, {
            cwd: options.cwd || projectRoot,
            env: { ...process.env, ...(options.env || {}) },
            timeout: options.timeoutMs || 120000,
            maxBuffer: 20 * 1024 * 1024,
            windowsHide: true
        });
        return {
            ok: true,
            command,
            args,
            exitCode: 0,
            durationMs: Date.now() - startedAt,
            stdout: String(result.stdout || '').trim(),
            stderr: String(result.stderr || '').trim()
        };
    } catch (error) {
        return {
            ok: false,
            command,
            args,
            exitCode: typeof error.code === 'number' ? error.code : null,
            durationMs: Date.now() - startedAt,
            stdout: String(error.stdout || '').trim(),
            stderr: String(error.stderr || error.message || '').trim(),
            error: error.message || String(error)
        };
    }
}

export async function inspectSweBenchProHarness(harnessDir = DEFAULT_SWE_BENCH_PRO_HARNESS_DIR) {
    const missing = [];
    for (const relativePath of REQUIRED_HARNESS_PATHS) {
        if (!await pathExists(path.join(harnessDir, relativePath))) missing.push(relativePath);
    }
    let commit = '';
    if (await pathExists(path.join(harnessDir, '.git'))) {
        const result = await runCommand('git', ['rev-parse', 'HEAD'], { cwd: harnessDir, timeoutMs: 30000 });
        if (result.ok) commit = result.stdout;
    }
    return {
        ready: missing.length === 0,
        harnessDir,
        gitCheckout: await pathExists(path.join(harnessDir, '.git')),
        commit,
        missing
    };
}

export async function inspectSweBenchProDatasetCoverage(rawSamplePath, harnessDir = DEFAULT_SWE_BENCH_PRO_HARNESS_DIR) {
    if (!await pathExists(rawSamplePath)) {
        return {
            ready: false,
            exists: false,
            rawSamplePath,
            rowCount: 0,
            errors: ['dataset file is missing'],
            missingFiles: []
        };
    }
    if (!rawSamplePath.toLowerCase().endsWith('.jsonl')) {
        return {
            ready: true,
            exists: true,
            rawSamplePath,
            rowCount: null,
            coverageChecked: false,
            errors: [],
            missingFiles: []
        };
    }
    const rows = (await fs.readFile(rawSamplePath, 'utf8'))
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => JSON.parse(line));
    const requiredFields = [
        'instance_id',
        'repo',
        'base_commit',
        'before_repo_set_cmd',
        'selected_test_files_to_run',
        'fail_to_pass',
        'pass_to_pass'
    ];
    const errors = [];
    const missingFiles = [];
    const emptyFailToPass = [];
    const emptySelectedTestFiles = [];
    const serializedListHasItems = (value) => {
        if (Array.isArray(value)) return value.length > 0;
        if (typeof value !== 'string') return false;
        const normalized = value.trim();
        return normalized.startsWith('[') && normalized.endsWith(']') && !/^\[\s*\]$/.test(normalized);
    };
    for (const [index, row] of rows.entries()) {
        const absent = requiredFields.filter((field) => !Object.hasOwn(row, field));
        if (absent.length) errors.push(`row ${index}: missing fields ${absent.join(', ')}`);
        const instanceId = String(row.instance_id || '').trim();
        if (!instanceId) continue;
        if (!serializedListHasItems(row.fail_to_pass)) emptyFailToPass.push(instanceId);
        if (!serializedListHasItems(row.selected_test_files_to_run)) emptySelectedTestFiles.push(instanceId);
        const requiredFiles = [
            path.join('run_scripts', instanceId, 'run_script.sh'),
            path.join('run_scripts', instanceId, 'parser.py'),
            path.join('dockerfiles', 'base_dockerfile', instanceId, 'Dockerfile'),
            path.join('dockerfiles', 'instance_dockerfile', instanceId, 'Dockerfile')
        ];
        for (const relativePath of requiredFiles) {
            if (!await pathExists(path.join(harnessDir, relativePath))) {
                missingFiles.push({ instance_id: instanceId, path: relativePath });
            }
        }
    }
    if (emptyFailToPass.length) {
        errors.push(`${emptyFailToPass.length} rows have empty fail_to_pass`);
    }
    if (emptySelectedTestFiles.length) {
        errors.push(`${emptySelectedTestFiles.length} rows have empty selected_test_files_to_run`);
    }
    return {
        ready: errors.length === 0 && missingFiles.length === 0,
        exists: true,
        rawSamplePath,
        rowCount: rows.length,
        coverageChecked: true,
        integrity: {
            failToPassNonEmptyRows: rows.length - emptyFailToPass.length,
            selectedTestFilesNonEmptyRows: rows.length - emptySelectedTestFiles.length,
            emptyFailToPass,
            emptySelectedTestFiles
        },
        errors,
        missingFiles
    };
}

async function inspectDisk(targetPath) {
    try {
        const stats = await fs.statfs(targetPath);
        const freeBytes = Number(stats.bavail) * Number(stats.bsize);
        return { ok: true, freeBytes, freeGiB: Math.round((freeBytes / (1024 ** 3)) * 10) / 10 };
    } catch (error) {
        return { ok: false, freeBytes: null, freeGiB: null, error: error.message || String(error) };
    }
}

async function inspectPython(python, mode, wslDistro = 'Ubuntu-22.04') {
    const inWsl = mode === 'wsl-docker';
    const invoke = (args) => inWsl
        ? runCommand('wsl', ['-d', wslDistro, '--', python, ...args], { timeoutMs: 30000 })
        : runCommand(python, args, { timeoutMs: 30000 });
    const version = await invoke(['--version']);
    const modules = mode === 'local-docker' || mode === 'wsl-docker'
        ? ['pandas', 'tqdm', 'docker']
        : ['pandas', 'tqdm', 'modal'];
    const dependencies = version.ok
        ? await invoke([
            '-c',
            `import importlib.util, json; print(json.dumps({m: bool(importlib.util.find_spec(m)) for m in ${JSON.stringify(modules)}}))`
        ])
        : { ok: false, error: 'python_unavailable', stdout: '', stderr: '' };
    let moduleStatus = Object.fromEntries(modules.map((name) => [name, false]));
    if (dependencies.ok) {
        try {
            moduleStatus = JSON.parse(dependencies.stdout);
        } catch {
            moduleStatus = Object.fromEntries(modules.map((name) => [name, false]));
        }
    }
    const missingModules = modules.filter((name) => !moduleStatus[name]);
    return {
        ok: version.ok,
        command: python,
        version: version.stdout || version.stderr,
        dependenciesReady: dependencies.ok && missingModules.length === 0,
        requiredModules: modules,
        moduleStatus,
        missingModules,
        dependencyError: dependencies.ok ? '' : (dependencies.stderr || dependencies.error || '')
    };
}

async function inspectDocker() {
    const cli = await runCommand('docker', ['--version'], { timeoutMs: 30000 });
    const daemon = cli.ok
        ? await runCommand('docker', ['version', '--format', '{{.Server.Version}}'], { timeoutMs: 30000 })
        : { ok: false, stdout: '', stderr: cli.stderr, error: cli.error };
    return {
        cliReady: cli.ok,
        daemonReady: daemon.ok && Boolean(daemon.stdout),
        cliVersion: cli.stdout || '',
        serverVersion: daemon.stdout || '',
        error: daemon.ok ? '' : (daemon.stderr || daemon.error || '')
    };
}

async function inspectWslDocker(wslDistro) {
    const cli = await runCommand('wsl', ['-d', wslDistro, '--', 'docker', '--version'], { timeoutMs: 30000 });
    const daemon = cli.ok
        ? await runCommand('wsl', ['-d', wslDistro, '--', 'docker', 'version', '--format', '{{.Server.Version}}'], { timeoutMs: 30000 })
        : { ok: false, stdout: '', stderr: cli.stderr, error: cli.error };
    return {
        cliReady: cli.ok,
        daemonReady: daemon.ok && Boolean(daemon.stdout),
        cliVersion: cli.stdout || '',
        serverVersion: daemon.stdout || '',
        distro: wslDistro,
        error: daemon.ok ? '' : (daemon.stderr || daemon.error || '')
    };
}

async function inspectModal(python) {
    const module = await runCommand(python, ['-c', 'import modal; print(modal.__version__)'], { timeoutMs: 30000 });
    const configPath = path.join(os.homedir(), '.modal.toml');
    return {
        moduleReady: module.ok,
        version: module.stdout || '',
        configPath,
        configured: await pathExists(configPath),
        error: module.ok ? '' : (module.stderr || module.error || '')
    };
}

export async function doctorSweBenchPro(options = {}) {
    const args = { ...parseArgs([]), ...options };
    const [harness, git, python, disk, dataset] = await Promise.all([
        inspectSweBenchProHarness(args.harnessDir),
        runCommand('git', ['--version'], { timeoutMs: 30000 }),
        inspectPython(args.python, args.mode, args.wslDistro),
        inspectDisk(projectRoot),
        inspectSweBenchProDatasetCoverage(args.rawSamplePath, args.harnessDir)
    ]);
    const runtime = args.mode === 'local-docker'
        ? await inspectDocker()
        : args.mode === 'wsl-docker'
            ? await inspectWslDocker(args.wslDistro)
            : await inspectModal(args.python);
    const blockers = [];
    const warnings = [];
    if (!harness.ready) blockers.push({ code: 'official_harness_missing', detail: harness.missing.join(', ') });
    if (!dataset.ready) {
        blockers.push({
            code: dataset.exists ? 'dataset_harness_mismatch' : 'dataset_missing',
            detail: [...dataset.errors, ...dataset.missingFiles.map((item) => item.path)].join(', ')
        });
    } else if (dataset.coverageChecked === false) {
        warnings.push({ code: 'dataset_coverage_not_checked', detail: 'Only JSONL inputs receive per-instance harness coverage checks.' });
    }
    if (!git.ok) blockers.push({ code: 'git_unavailable', detail: git.stderr || git.error || '' });
    if (!python.ok) blockers.push({ code: 'python_unavailable', detail: python.version || '' });
    else if (!python.dependenciesReady) blockers.push({ code: 'python_dependencies_missing', detail: python.missingModules.join(', ') });
    if (args.mode === 'local-docker' || args.mode === 'wsl-docker') {
        if (!runtime.cliReady) blockers.push({ code: 'docker_cli_missing', detail: runtime.error || '' });
        else if (!runtime.daemonReady) blockers.push({ code: 'docker_daemon_unavailable', detail: runtime.error || '' });
    } else {
        if (!runtime.moduleReady) blockers.push({ code: 'modal_module_missing', detail: runtime.error || '' });
        if (!runtime.configured) blockers.push({ code: 'modal_not_configured', detail: runtime.configPath });
    }
    if (disk.ok && disk.freeGiB < 30) {
        warnings.push({
            code: 'low_disk_for_benchmark_images',
            detail: `${disk.freeGiB} GiB free; use one instance at a time and prune Docker images after scoring.`
        });
    }
    return {
        ok: blockers.length === 0,
        status: blockers.length ? 'blocked' : 'ready',
        generatedAt: new Date().toISOString(),
        mode: args.mode,
        official: {
            repository: SWE_BENCH_PRO_HARNESS_REPO,
            ref: args.ref || SWE_BENCH_PRO_HARNESS_REF,
            dataset: 'ScaleAI/SWE-bench_Pro',
            dockerRepository: 'jefzda/sweap-images'
        },
        harness,
        dataset,
        git: { ok: git.ok, version: git.stdout || '', error: git.stderr || git.error || '' },
        python,
        runtime,
        disk,
        blockers,
        warnings
    };
}

export async function installSweBenchProHarness(options = {}) {
    const args = { ...parseArgs([]), ...options };
    const current = await inspectSweBenchProHarness(args.harnessDir);
    if (current.ready && !args.update) {
        return { ok: true, status: 'already_ready', ...current };
    }
    if (current.gitCheckout) {
        const fetch = await runCommand('git', ['fetch', '--depth', '1', 'origin', args.ref], {
            cwd: args.harnessDir,
            timeoutMs: 300000
        });
        if (!fetch.ok) return { ok: false, status: 'update_fetch_failed', harnessDir: args.harnessDir, fetch };
        const checkout = await runCommand('git', ['checkout', '--detach', 'FETCH_HEAD'], {
            cwd: args.harnessDir,
            timeoutMs: 120000
        });
        if (!checkout.ok) return { ok: false, status: 'update_checkout_failed', checkout };
        const harness = await inspectSweBenchProHarness(args.harnessDir);
        return {
            ok: harness.ready,
            status: harness.ready ? (args.update ? 'updated' : 'recovered') : 'checkout_incomplete',
            fetch,
            checkout,
            ...harness
        };
    }
    if (await pathExists(args.harnessDir)) {
        const entries = await fs.readdir(args.harnessDir).catch(() => []);
        if (entries.length) {
            return {
                ok: false,
                status: 'incomplete_harness_directory',
                harnessDir: args.harnessDir,
                detail: 'The directory exists but is not a complete official checkout. Move or clear it before retrying.'
            };
        }
    }
    await fs.mkdir(path.dirname(args.harnessDir), { recursive: true });
    const attempts = [];
    for (let attempt = 1; attempt <= 3; attempt += 1) {
        const installSteps = [
            ['git', ['init', args.harnessDir], projectRoot],
            ['git', ['config', 'remote.origin.url', SWE_BENCH_PRO_HARNESS_REPO], args.harnessDir],
            ['git', ['config', 'remote.origin.fetch', '+refs/heads/*:refs/remotes/origin/*'], args.harnessDir],
            ['git', ['fetch', '--filter=blob:none', '--depth', '1', 'origin', args.ref], args.harnessDir],
            ['git', ['checkout', '--detach', 'FETCH_HEAD'], args.harnessDir]
        ];
        const stepResults = [];
        for (const [command, commandArgs, cwd] of installSteps) {
            const result = await runCommand(command, commandArgs, { cwd, timeoutMs: 300000 });
            stepResults.push(result);
            if (!result.ok) break;
        }
        attempts.push(stepResults);
        if (stepResults.every((result) => result.ok)) {
            const harness = await inspectSweBenchProHarness(args.harnessDir);
            return { ok: harness.ready, status: harness.ready ? 'installed' : 'installed_incomplete', attempts, ...harness };
        }
        await new Promise((resolve) => setTimeout(resolve, attempt * 2000));
    }
    return { ok: false, status: 'clone_failed', harnessDir: args.harnessDir, attempts };
}

export function buildOfficialSweBenchProEvalCommand(options = {}) {
    const harnessDir = path.resolve(options.harnessDir || DEFAULT_SWE_BENCH_PRO_HARNESS_DIR);
    const mode = options.mode || 'local-docker';
    const rawSamplePath = path.resolve(options.rawSamplePath || path.join(DEFAULT_SWE_BENCH_PRO_DATA_DIR, 'swebench-pro.test.sample.leaderboard.official.jsonl'));
    const patchPath = path.resolve(options.patchPath || path.join(projectRoot, 'eval-results', 'engineering', 'swebench-pro', 'predictions.json'));
    const outputDir = path.resolve(options.outputDir || path.join(projectRoot, 'eval-results', 'engineering', 'swebench-pro', 'official'));
    const pathForRuntime = mode === 'wsl-docker' ? windowsPathToWslPath : (value) => value;
    const evaluatorArgs = [
        pathForRuntime(path.join(harnessDir, 'swe_bench_pro_eval.py')),
        `--raw_sample_path=${pathForRuntime(rawSamplePath)}`,
        `--patch_path=${pathForRuntime(patchPath)}`,
        `--output_dir=${pathForRuntime(outputDir)}`,
        `--scripts_dir=${pathForRuntime(path.join(harnessDir, 'run_scripts'))}`,
        `--num_workers=${Math.max(1, Math.min(Number(options.workers) || 1, 100))}`,
        `--dockerhub_username=${options.dockerhubUsername || 'jefzda'}`
    ];
    if (mode === 'local-docker' || mode === 'wsl-docker') evaluatorArgs.push('--use_local_docker');
    if (options.blockNetwork) evaluatorArgs.push('--block_network');
    if (options.redo) evaluatorArgs.push('--redo');
    const command = mode === 'wsl-docker' ? 'wsl' : (options.python || 'python');
    const commandArgs = mode === 'wsl-docker'
        ? ['-d', options.wslDistro || 'Ubuntu-22.04', '--', options.python || '/root/.cache/ailis/swebench-pro-venv/bin/python', ...evaluatorArgs]
        : evaluatorArgs;
    return {
        command,
        args: commandArgs,
        cwd: harnessDir,
        mode
    };
}

export async function validateSweBenchProPredictions(patchPath) {
    try {
        const parsed = JSON.parse(await fs.readFile(patchPath, 'utf8'));
        if (!Array.isArray(parsed)) throw new Error('Prediction file must contain a JSON array.');
        const errors = [];
        const warnings = [];
        const ids = new Set();
        for (const [index, row] of parsed.entries()) {
            if (!row || typeof row !== 'object') {
                errors.push(`row ${index}: expected object`);
                continue;
            }
            if (!String(row.instance_id || '').trim()) errors.push(`row ${index}: instance_id is required`);
            if (typeof (row.patch ?? row.model_patch) !== 'string') errors.push(`row ${index}: patch must be a string`);
            else if (!(row.patch ?? row.model_patch).trim()) warnings.push(`row ${index}: empty patch will score as unresolved`);
            else if (!(row.patch ?? row.model_patch).endsWith('\n')) {
                errors.push(`row ${index}: patch must end with a newline so git apply receives a complete unified diff`);
            }
            if (ids.has(row.instance_id)) errors.push(`row ${index}: duplicate instance_id ${row.instance_id}`);
            ids.add(row.instance_id);
        }
        return { ok: errors.length === 0, count: parsed.length, errors, warnings };
    } catch (error) {
        return { ok: false, count: 0, errors: [error.message || String(error)], warnings: [] };
    }
}

async function evaluateSweBenchPro(args) {
    const command = buildOfficialSweBenchProEvalCommand(args);
    if (args.dryRun) return { ok: true, status: 'planned', command };
    const [doctor, predictions, datasetExists] = await Promise.all([
        doctorSweBenchPro(args),
        validateSweBenchProPredictions(args.patchPath),
        pathExists(args.rawSamplePath)
    ]);
    if (!datasetExists) return { ok: false, status: 'dataset_missing', path: args.rawSamplePath, command };
    if (!predictions.ok) return { ok: false, status: 'predictions_invalid', predictions, command };
    if (!doctor.ok) return { ok: false, status: 'environment_blocked', doctor, predictions, command };
    await fs.mkdir(args.outputDir, { recursive: true });
    const execution = await runCommand(command.command, command.args, {
        cwd: command.cwd,
        timeoutMs: 24 * 60 * 60 * 1000
    });
    return { ok: execution.ok, status: execution.ok ? 'completed' : 'failed', command, execution, predictions };
}

async function main() {
    const args = parseArgs();
    let report;
    if (args.action === 'doctor') report = await doctorSweBenchPro(args);
    else if (args.action === 'install') report = await installSweBenchProHarness(args);
    else if (args.action === 'plan') report = { ok: true, status: 'planned', command: buildOfficialSweBenchProEvalCommand(args) };
    else if (args.action === 'evaluate') report = await evaluateSweBenchPro(args);
    else throw new Error(`Unknown SWE-bench Pro action: ${args.action}`);
    console.log(JSON.stringify(report, null, 2));
    if (!report.ok) process.exitCode = 1;
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
    main().catch((error) => {
        console.error(error?.stack || error?.message || String(error));
        process.exitCode = 1;
    });
}
