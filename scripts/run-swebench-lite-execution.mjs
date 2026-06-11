import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { execFile } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { prepareSweBenchLiteSample } from './prepare-swebench-lite-sample.mjs';
import {
    DEFAULT_WHEELHOUSE_DIR,
    buildSweBenchSetupCommand,
    getSweBenchSetupRecipe
} from './swebench-setup-recipes.mjs';

const execFileAsync = promisify(execFile);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const DEFAULT_WSL_DISTRO = 'Ubuntu-22.04';
const DEFAULT_COMMAND_TIMEOUT_MS = 10 * 60 * 1000;
const DEFAULT_CHECKOUT_TIMEOUT_MS = 3 * 60 * 1000;
const DEFAULT_TEST_TIMEOUT_MS = 15 * 60 * 1000;
const DEFAULT_ARCHIVE_TIMEOUT_MS = 15 * 60 * 1000;

function parseArgs(argv = process.argv.slice(2)) {
    const args = {
        split: 'test',
        offset: 0,
        limit: 1,
        datasetPath: '',
        instanceId: '',
        outputDir: path.join(projectRoot, 'eval-results', 'engineering', 'swebench-execution'),
        runner: 'auto',
        wslDistro: DEFAULT_WSL_DISTRO,
        setupMode: 'auto',
        setupRecipe: 'auto',
        setupCommand: '',
        wheelhouseDir: DEFAULT_WHEELHOUSE_DIR,
        agentMode: 'none',
        candidatePatch: '',
        agentCommand: '',
        passToPassLimit: 5,
        archiveFallback: true,
        archiveCacheDir: path.join(projectRoot, 'build-cache', 'github-archives'),
        archiveTimeoutMs: DEFAULT_ARCHIVE_TIMEOUT_MS,
        checkoutTimeoutMs: DEFAULT_CHECKOUT_TIMEOUT_MS,
        setupTimeoutMs: DEFAULT_COMMAND_TIMEOUT_MS,
        testTimeoutMs: DEFAULT_TEST_TIMEOUT_MS,
        strict: false
    };
    for (let index = 0; index < argv.length; index += 1) {
        const arg = argv[index];
        if (arg === '--dataset') args.datasetPath = path.resolve(argv[++index] || '');
        else if (arg === '--instance') args.instanceId = argv[++index] || '';
        else if (arg === '--split') args.split = argv[++index] || args.split;
        else if (arg === '--offset') args.offset = Number(argv[++index] || args.offset);
        else if (arg === '--limit') args.limit = Number(argv[++index] || args.limit);
        else if (arg === '--output-dir') args.outputDir = path.resolve(argv[++index] || args.outputDir);
        else if (arg === '--runner') args.runner = argv[++index] || args.runner;
        else if (arg === '--wsl-distro') args.wslDistro = argv[++index] || args.wslDistro;
        else if (arg === '--setup-mode') args.setupMode = argv[++index] || args.setupMode;
        else if (arg === '--setup-recipe') args.setupRecipe = argv[++index] || args.setupRecipe;
        else if (arg === '--setup-command') args.setupCommand = argv[++index] || '';
        else if (arg === '--wheelhouse-dir') args.wheelhouseDir = path.resolve(argv[++index] || args.wheelhouseDir);
        else if (arg === '--agent-mode') args.agentMode = argv[++index] || args.agentMode;
        else if (arg === '--candidate-patch') args.candidatePatch = path.resolve(argv[++index] || '');
        else if (arg === '--agent-command') args.agentCommand = argv[++index] || '';
        else if (arg === '--pass-to-pass-limit') args.passToPassLimit = Number(argv[++index] || args.passToPassLimit);
        else if (arg === '--no-archive-fallback') args.archiveFallback = false;
        else if (arg === '--archive-cache-dir') args.archiveCacheDir = path.resolve(argv[++index] || args.archiveCacheDir);
        else if (arg === '--archive-timeout-ms') args.archiveTimeoutMs = Number(argv[++index] || args.archiveTimeoutMs);
        else if (arg === '--checkout-timeout-ms') args.checkoutTimeoutMs = Number(argv[++index] || args.checkoutTimeoutMs);
        else if (arg === '--setup-timeout-ms') args.setupTimeoutMs = Number(argv[++index] || args.setupTimeoutMs);
        else if (arg === '--test-timeout-ms') args.testTimeoutMs = Number(argv[++index] || args.testTimeoutMs);
        else if (arg === '--strict') args.strict = true;
    }
    args.limit = Math.max(1, Math.min(Number.isFinite(args.limit) ? args.limit : 1, 100));
    args.offset = Math.max(0, Number.isFinite(args.offset) ? args.offset : 0);
    args.passToPassLimit = Math.max(0, Math.min(Number.isFinite(args.passToPassLimit) ? args.passToPassLimit : 5, 50));
    return args;
}

async function pathExists(filePath) {
    try {
        await fs.access(filePath);
        return true;
    } catch {
        return false;
    }
}

async function readJsonl(filePath) {
    const text = await fs.readFile(filePath, 'utf8');
    return text
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => JSON.parse(line));
}

function safeJson(value, fallback = []) {
    if (Array.isArray(value)) return value;
    if (typeof value !== 'string') return fallback;
    try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : fallback;
    } catch {
        return fallback;
    }
}

function normalizeRow(row = {}) {
    return {
        ...row,
        instance_id: row.instance_id || row.instanceId || '',
        repo: row.repo || '',
        repo_url: row.repo_url || row.repoUrl || '',
        base_commit: row.base_commit || row.baseCommit || '',
        problem_statement: row.problem_statement || row.problemStatement || '',
        test_patch: row.test_patch || row.testPatch || '',
        patch: row.patch || '',
        fail_to_pass: safeJson(row.fail_to_pass || row.FAIL_TO_PASS, row.fail_to_pass || []),
        pass_to_pass: safeJson(row.pass_to_pass || row.PASS_TO_PASS, row.pass_to_pass || [])
    };
}

function winToWslPath(filePath) {
    const resolved = path.resolve(filePath);
    const match = resolved.match(/^([A-Za-z]):\\(.*)$/);
    if (!match) {
        return resolved.replace(/\\/g, '/');
    }
    return `/mnt/${match[1].toLowerCase()}/${match[2].replace(/\\/g, '/')}`;
}

function quoteBash(value) {
    return `'${String(value).replace(/'/g, `'\\''`)}'`;
}

function truncateText(text = '', maxChars = 12000) {
    const normalized = String(text || '').replace(/\r\n/g, '\n');
    return normalized.length > maxChars ? `${normalized.slice(0, maxChars - 3)}...` : normalized;
}

async function runHostCommand(command, args = [], { cwd, timeoutMs = DEFAULT_COMMAND_TIMEOUT_MS } = {}) {
    const startedAt = Date.now();
    try {
        const result = await execFileAsync(command, args, {
            cwd,
            timeout: timeoutMs,
            maxBuffer: 30 * 1024 * 1024,
            windowsHide: true
        });
        return {
            ok: true,
            command: [command, ...args].join(' '),
            cwd,
            exitCode: 0,
            durationMs: Date.now() - startedAt,
            stdout: truncateText(result.stdout),
            stderr: truncateText(result.stderr)
        };
    } catch (error) {
        return {
            ok: false,
            command: [command, ...args].join(' '),
            cwd,
            exitCode: typeof error.code === 'number' ? error.code : null,
            signal: error.signal || '',
            durationMs: Date.now() - startedAt,
            stdout: truncateText(error.stdout || ''),
            stderr: truncateText(error.stderr || error.message || ''),
            error: error.message || String(error)
        };
    }
}

async function runShell(runner, script, { cwd = '', timeoutMs = DEFAULT_COMMAND_TIMEOUT_MS } = {}) {
    if (runner.kind === 'wsl') {
        const wslCwd = cwd ? winToWslPath(cwd) : '';
        const wrapped = [
            'set -o pipefail',
            wslCwd ? `cd ${quoteBash(wslCwd)}` : '',
            script
        ].filter(Boolean).join('\n');
        return await runHostCommand(
            'wsl.exe',
            ['-d', runner.distro, '--', 'bash', '-lc', wrapped],
            { cwd: projectRoot, timeoutMs }
        );
    }
    if (runner.kind === 'host') {
        return await runHostCommand(
            'powershell',
            ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-Command', script],
            { cwd: cwd || projectRoot, timeoutMs }
        );
    }
    if (runner.kind === 'docker') {
        const mountRoot = path.resolve(cwd || projectRoot);
        return await runHostCommand(
            'docker',
            ['run', '--rm', '-v', `${mountRoot}:/workspace`, '-w', '/workspace', 'python:3.11', 'bash', '-lc', script],
            { cwd: projectRoot, timeoutMs }
        );
    }
    return {
        ok: false,
        command: script,
        cwd,
        exitCode: null,
        stdout: '',
        stderr: `unsupported runner: ${runner.kind}`,
        error: `unsupported runner: ${runner.kind}`
    };
}

async function resolveRunner(args) {
    if (args.runner === 'wsl' || args.runner === 'auto') {
        const status = await runHostCommand('wsl.exe', ['-d', args.wslDistro, '--', 'bash', '-lc', 'git --version && python3 --version'], {
            cwd: projectRoot,
            timeoutMs: 30000
        });
        if (status.ok) {
            return {
                kind: 'wsl',
                distro: args.wslDistro,
                status
            };
        }
        if (args.runner === 'wsl') {
            return {
                kind: 'unavailable',
                reason: `WSL distro unavailable: ${args.wslDistro}`,
                status
            };
        }
    }
    if (args.runner === 'docker' || args.runner === 'auto') {
        const status = await runHostCommand('docker', ['--version'], { cwd: projectRoot, timeoutMs: 30000 });
        if (status.ok) {
            return {
                kind: 'docker',
                status
            };
        }
        if (args.runner === 'docker') {
            return {
                kind: 'unavailable',
                reason: 'Docker CLI unavailable',
                status
            };
        }
    }
    if (args.runner === 'host' || args.runner === 'auto') {
        const status = await runHostCommand('git', ['--version'], { cwd: projectRoot, timeoutMs: 30000 });
        if (status.ok) {
            return {
                kind: 'host',
                status
            };
        }
    }
    return {
        kind: 'unavailable',
        reason: 'No supported runner found. Install Docker, enable WSL, or choose --runner host.',
        status: null
    };
}

function shellPath(runner, filePath) {
    if (runner.kind === 'wsl') return winToWslPath(filePath);
    if (runner.kind === 'docker') return `/workspace/${path.relative(filePath, filePath).replace(/\\/g, '/')}`;
    return filePath;
}

async function writeInstanceFiles(runDir, row) {
    const patchDir = path.join(runDir, 'patches');
    await fs.mkdir(patchDir, { recursive: true });
    const testPatchPath = path.join(patchDir, 'test.patch');
    const goldPatchPath = path.join(patchDir, 'gold.patch');
    const problemPath = path.join(runDir, 'problem.md');
    const metadataPath = path.join(runDir, 'metadata.json');
    await fs.writeFile(testPatchPath, row.test_patch || '', 'utf8');
    await fs.writeFile(goldPatchPath, row.patch || '', 'utf8');
    await fs.writeFile(problemPath, row.problem_statement || '', 'utf8');
    await fs.writeFile(metadataPath, `${JSON.stringify(row, null, 2)}\n`, 'utf8');
    await fs.writeFile(path.join(runDir, 'FAIL_TO_PASS.txt'), `${(row.fail_to_pass || []).join('\n')}\n`, 'utf8');
    await fs.writeFile(path.join(runDir, 'PASS_TO_PASS.txt'), `${(row.pass_to_pass || []).join('\n')}\n`, 'utf8');
    return {
        patchDir,
        testPatchPath,
        goldPatchPath,
        problemPath,
        metadataPath
    };
}

function repoUrlForRow(row) {
    if (row.repo_url) return row.repo_url;
    return `https://github.com/${row.repo}.git`;
}

function githubArchiveInfo(row) {
    if (!row.repo || !row.base_commit) return null;
    if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(row.repo)) return null;
    const [owner, repoName] = row.repo.split('/');
    return {
        owner,
        repoName,
        url: `https://codeload.github.com/${owner}/${repoName}/zip/${row.base_commit}`,
        cacheName: `${owner}__${repoName}__${row.base_commit}.zip`
    };
}

async function safeRemoveGeneratedRepoDir(repoDir) {
    const resolved = path.resolve(repoDir);
    if (path.basename(resolved) !== 'repo') {
        throw new Error(`Refusing to remove non-repo checkout directory: ${resolved}`);
    }
    await fs.rm(resolved, { recursive: true, force: true });
    await fs.mkdir(resolved, { recursive: true });
}

async function hasZipEndOfCentralDirectory(filePath) {
    try {
        const stat = await fs.stat(filePath);
        if (stat.size < 22) return false;
        const handle = await fs.open(filePath, 'r');
        try {
            const length = Math.min(stat.size, 65557);
            const buffer = Buffer.alloc(length);
            await handle.read(buffer, 0, length, stat.size - length);
            for (let index = length - 22; index >= 0; index -= 1) {
                if (
                    buffer[index] === 0x50 &&
                    buffer[index + 1] === 0x4b &&
                    buffer[index + 2] === 0x05 &&
                    buffer[index + 3] === 0x06
                ) {
                    return true;
                }
            }
            return false;
        } finally {
            await handle.close();
        }
    } catch {
        return false;
    }
}

async function downloadGitHubArchive({ row, args, timeoutMs }) {
    const archive = githubArchiveInfo(row);
    if (!archive) {
        return {
            ok: false,
            status: 'archive_unavailable',
            command: 'github archive fallback',
            stdout: '',
            stderr: 'SWE-bench row is not a GitHub repo with a base_commit.'
        };
    }
    await fs.mkdir(args.archiveCacheDir, { recursive: true });
    const archivePath = path.join(args.archiveCacheDir, archive.cacheName);
    let existingSize = 0;
    if (await pathExists(archivePath)) {
        const stat = await fs.stat(archivePath);
        existingSize = stat.size;
        if (stat.size > 0 && await hasZipEndOfCentralDirectory(archivePath)) {
            return {
                ok: true,
                status: 'archive_cache_hit',
                command: 'github archive cache',
                stdout: archivePath,
                stderr: '',
                archivePath,
                url: archive.url
            };
        }
        await fs.rm(archivePath, { force: true });
        existingSize = 0;
    }
    const archiveTimeoutMs = Math.max(args.archiveTimeoutMs || DEFAULT_ARCHIVE_TIMEOUT_MS, timeoutMs, 180000);
    const curlArgs = [
        '-L',
        '--fail',
        '--retry',
        '2',
        '--retry-delay',
        '3',
        '--connect-timeout',
        '20',
        '--max-time',
        String(Math.ceil(archiveTimeoutMs / 1000)),
        '-o',
        archivePath,
        archive.url
    ];
    const result = await runHostCommand('curl.exe', curlArgs, {
        cwd: projectRoot,
        timeoutMs: archiveTimeoutMs + 10000
    });
    const complete = await hasZipEndOfCentralDirectory(archivePath);
    return {
        ...result,
        ok: complete,
        status: complete ? 'archive_downloaded' : 'archive_download_failed',
        archivePath,
        url: archive.url,
        existingSize
    };
}

async function extractGitHubArchive({ archivePath, repoDir, timeoutMs = 180000 }) {
    const extractDir = path.join(path.dirname(repoDir), 'archive-extract');
    await fs.rm(extractDir, { recursive: true, force: true });
    await fs.mkdir(extractDir, { recursive: true });
    const result = await runHostCommand('powershell', [
        '-NoProfile',
        '-ExecutionPolicy',
        'Bypass',
        '-Command',
        [
            `$ErrorActionPreference='Stop'`,
            `Expand-Archive -LiteralPath ${JSON.stringify(archivePath)} -DestinationPath ${JSON.stringify(extractDir)} -Force`
        ].join('\n')
    ], {
        cwd: projectRoot,
        timeoutMs: Math.max(timeoutMs, 180000)
    });
    if (!result.ok) return { ...result, status: 'archive_extract_failed', extractDir };
    const entries = await fs.readdir(extractDir, { withFileTypes: true });
    const rootEntry = entries.find((entry) => entry.isDirectory());
    if (!rootEntry) {
        return {
            ok: false,
            status: 'archive_extract_failed',
            command: 'Expand-Archive',
            stdout: result.stdout,
            stderr: 'GitHub archive did not contain a source directory.',
            extractDir
        };
    }
    await safeRemoveGeneratedRepoDir(repoDir);
    await fs.cp(path.join(extractDir, rootEntry.name), repoDir, { recursive: true });
    await fs.rm(extractDir, { recursive: true, force: true });
    return {
        ...result,
        ok: true,
        status: 'archive_extracted',
        extractDir,
        archiveRoot: rootEntry.name
    };
}

async function initializeArchiveGitRepo({ runner, row, repoDir, timeoutMs }) {
    const repoShell = runner.kind === 'wsl' ? winToWslPath(repoDir) : repoDir;
    const script = runner.kind === 'host'
        ? [
              `$ErrorActionPreference='Stop'`,
              `Set-Location ${JSON.stringify(repoDir)}`,
              `git init .`,
              `git config user.email "swebench-archive@example.local"`,
              `git config user.name "SWE-bench archive checkout"`,
              `git add -A`,
              `git commit -m ${JSON.stringify(`archive checkout ${row.base_commit}`)}`,
              `git status --short`
          ].join('\n')
        : [
              `set -e`,
              `cd ${quoteBash(repoShell)}`,
              `git init .`,
              `git config user.email 'swebench-archive@example.local'`,
              `git config user.name 'SWE-bench archive checkout'`,
              `git add -A`,
              `git commit -m ${quoteBash(`archive checkout ${row.base_commit}`)}`,
              `git status --short`
          ].join('\n');
    const result = await runShell(runner, script, { timeoutMs: Math.max(timeoutMs, 180000) });
    return {
        ...result,
        status: result.ok ? 'archive_git_initialized' : 'archive_git_init_failed'
    };
}

async function checkoutRepoFromGitHubArchive({ runner, row, repoDir, args, timeoutMs, gitAttempt }) {
    const download = await downloadGitHubArchive({ row, args, timeoutMs });
    if (!download.ok) {
        return {
            ...download,
            ok: false,
            status: 'checkout_failed',
            gitAttempt,
            archiveDownload: download
        };
    }
    const extract = await extractGitHubArchive({ archivePath: download.archivePath, repoDir, timeoutMs });
    if (!extract.ok) {
        return {
            ...extract,
            ok: false,
            status: 'checkout_failed',
            gitAttempt,
            archiveDownload: download,
            archiveExtract: extract
        };
    }
    const init = await initializeArchiveGitRepo({ runner, row, repoDir, timeoutMs });
    return {
        ...init,
        ok: init.ok,
        status: init.ok ? 'completed_archive_fallback' : 'checkout_failed',
        gitAttempt,
        archiveDownload: download,
        archiveExtract: extract,
        stdout: [
            'Git checkout failed; used GitHub codeload archive fallback.',
            `archive=${download.archivePath}`,
            download.stdout,
            extract.stdout,
            init.stdout
        ].filter(Boolean).join('\n'),
        stderr: [
            gitAttempt?.stderr,
            download.stderr,
            extract.stderr,
            init.stderr
        ].filter(Boolean).join('\n')
    };
}

async function checkoutRepo({ runner, row, repoDir, timeoutMs, args }) {
    const repoUrl = repoUrlForRow(row);
    const repoDirShell = runner.kind === 'wsl' ? winToWslPath(repoDir) : repoDir;
    const baseCommit = row.base_commit;
    if (!baseCommit && !row.repo_url) {
        return {
            ok: false,
            status: 'missing_base_commit',
            command: 'checkout',
            stdout: '',
            stderr: 'SWE-bench row is missing base_commit.'
        };
    }
    const script = runner.kind === 'host'
        ? [
              `$ErrorActionPreference='Stop'`,
              `if (!(Test-Path ${JSON.stringify(repoDir)})) { New-Item -ItemType Directory -Force -Path ${JSON.stringify(repoDir)} | Out-Null }`,
              `if (!(Test-Path (Join-Path ${JSON.stringify(repoDir)} '.git'))) { git init ${JSON.stringify(repoDir)} }`,
              `Set-Location ${JSON.stringify(repoDir)}`,
              `if ((git remote) -contains 'origin') { git remote remove origin; if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE } }`,
              `git remote add origin ${JSON.stringify(repoUrl)}`,
              `if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }`,
              baseCommit ? `git fetch --depth 1 origin ${JSON.stringify(baseCommit)}` : `git fetch --depth 1 origin HEAD`,
              `if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }`,
              baseCommit ? `git checkout -f FETCH_HEAD` : `git checkout -f FETCH_HEAD`,
              `if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }`,
              `git clean -fdx`,
              `if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }`,
              `git status --short`
          ].join('\n')
        : [
              `set -e`,
              `mkdir -p ${quoteBash(repoDirShell)}`,
              `if [ ! -d ${quoteBash(path.posix.join(repoDirShell, '.git'))} ]; then git init ${quoteBash(repoDirShell)}; fi`,
              `cd ${quoteBash(repoDirShell)}`,
              `git remote remove origin >/dev/null 2>&1 || true`,
              `git remote add origin ${quoteBash(repoUrl)}`,
              baseCommit ? `git fetch --depth 1 origin ${quoteBash(baseCommit)}` : `git fetch --depth 1 origin HEAD`,
              `git checkout -f FETCH_HEAD`,
              `git clean -fdx`,
              `git status --short`
          ].join('\n');
    const result = await runShell(runner, script, { timeoutMs });
    if (result.ok || !args.archiveFallback) return result;
    return await checkoutRepoFromGitHubArchive({
        runner,
        row,
        repoDir,
        args,
        timeoutMs,
        gitAttempt: result
    });
}

async function applyPatch({ runner, repoDir, patchPath, title, timeoutMs }) {
    if (!(await pathExists(patchPath)) || !(await fs.readFile(patchPath, 'utf8')).trim()) {
        return {
            ok: true,
            status: 'skipped_empty_patch',
            command: title,
            stdout: '',
            stderr: ''
        };
    }
    const repoShell = runner.kind === 'wsl' ? winToWslPath(repoDir) : repoDir;
    const patchShell = runner.kind === 'wsl' ? winToWslPath(patchPath) : patchPath;
    const script = runner.kind === 'host'
        ? [
              `$ErrorActionPreference='Stop'`,
              `Set-Location ${JSON.stringify(repoDir)}`,
              `git apply --check ${JSON.stringify(patchPath)}`,
              `git apply ${JSON.stringify(patchPath)}`
          ].join('\n')
        : [
              `cd ${quoteBash(repoShell)}`,
              `git apply --check ${quoteBash(patchShell)}`,
              `git apply ${quoteBash(patchShell)}`
          ].join('\n');
    const result = await runShell(runner, script, { timeoutMs });
    return {
        ...result,
        status: result.ok ? 'completed' : 'patch_failed',
        title
    };
}

function buildVenvPrefix(runner, runDir) {
    if (runner.kind === 'host') {
        return {
            create: `python -m venv ${JSON.stringify(path.join(runDir, '.venv'))}`,
            activate: `& ${JSON.stringify(path.join(runDir, '.venv', 'Scripts', 'Activate.ps1'))}`
        };
    }
    const venvDir = runner.kind === 'wsl' ? winToWslPath(path.join(runDir, '.venv')) : '/workspace/.venv';
    return {
        create: `python3 -m venv ${quoteBash(venvDir)}`,
        activate: `. ${quoteBash(path.posix.join(venvDir, 'bin', 'activate'))}`
    };
}

function wheelhousePathForRunner(runner, args) {
    if (runner.kind === 'wsl') return winToWslPath(args.wheelhouseDir);
    if (runner.kind === 'docker') {
        const relative = path.relative(projectRoot, args.wheelhouseDir).replace(/\\/g, '/');
        return `/workspace/${relative}`;
    }
    return args.wheelhouseDir;
}

function addPowerShellExitChecks(commandText = '') {
    return String(commandText)
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
        .flatMap((line) => [line, 'if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }'])
        .join('\n');
}

async function setupEnvironment({ runner, repoDir, runDir, row, args }) {
    if (args.setupMode === 'skip') {
        return {
            ok: true,
            status: 'skipped',
            command: 'setup skipped',
            stdout: '',
            stderr: ''
        };
    }
    const venvDir = path.join(runDir, '.venv');
    if (runner.kind === 'wsl') {
        const cleanup = await runShell(runner, `rm -rf ${quoteBash(winToWslPath(venvDir))}`, {
            timeoutMs: 60000
        });
        if (!cleanup.ok) {
            return {
                ...cleanup,
                status: 'setup_failed',
                stderr: cleanup.stderr || `Failed to remove existing venv: ${venvDir}`
            };
        }
    } else {
        await fs.rm(venvDir, { recursive: true, force: true });
    }
    const repoShell = runner.kind === 'wsl' ? winToWslPath(repoDir) : repoDir;
    const venv = buildVenvPrefix(runner, runDir);
    const recipe = args.setupCommand ? null : getSweBenchSetupRecipe(row?.repo || '', args.setupRecipe);
    const recipeCommand = recipe
        ? buildSweBenchSetupCommand(recipe, { wheelhouseDir: wheelhousePathForRunner(runner, args) })
        : '';
    const fallbackSetupCommands = [
        'python -m pip install -U pip setuptools wheel',
        'python -m pip install -e .',
        'python -m pip install pytest'
    ].join('\n');
    const generatedCommand = recipeCommand || fallbackSetupCommands;
    const defaultCommand = args.setupCommand || (
        runner.kind === 'host' ? addPowerShellExitChecks(generatedCommand) : generatedCommand
    );
    const script = runner.kind === 'host'
        ? [
              `$ErrorActionPreference='Stop'`,
              venv.create,
              venv.activate,
              `Set-Location ${JSON.stringify(repoDir)}`,
              defaultCommand
          ].join('\n')
        : [
              `set -e`,
              `cd ${quoteBash(repoShell)}`,
              venv.create,
              venv.activate,
              defaultCommand
          ].join('\n');
    const result = await runShell(runner, script, { timeoutMs: args.setupTimeoutMs });
    return {
        ...result,
        status: result.ok ? 'completed' : 'setup_failed',
        setupRecipe: recipe?.id || (args.setupCommand ? 'custom' : 'fallback')
    };
}

function djangoTestLabel(selector = '') {
    const match = String(selector).match(/^(.+?)\s+\((.+?)\)$/);
    if (!match) return selector;
    return `${match[2]}.${match[1]}`;
}

function modifiedPythonTestFilesFromPatch(patch = '') {
    const files = [];
    const pattern = /^diff --git a\/(.+?) b\/(.+?)$/gm;
    let match = pattern.exec(patch);
    while (match) {
        const filePath = match[2] || match[1];
        if (
            filePath.endsWith('.py') &&
            (filePath.startsWith('tests/') || filePath.includes('/tests/') || path.basename(filePath).startsWith('test_'))
        ) {
            files.push(filePath);
        }
        match = pattern.exec(patch);
    }
    return [...new Set(files)];
}

function pytestTestLabel(row, selector = '') {
    const normalized = String(selector || '').trim();
    if (!normalized) return normalized;
    if (normalized.includes('/') || normalized.includes('\\') || normalized.includes('::') || normalized.endsWith('.py')) {
        return normalized.replace(/\\/g, '/');
    }
    const modifiedTestFiles = modifiedPythonTestFilesFromPatch(row.test_patch || '');
    if (/^test[A-Za-z0-9_]*$/.test(normalized) && modifiedTestFiles.length === 1) {
        return `${modifiedTestFiles[0]}::${normalized}`;
    }
    return normalized;
}

function buildTestCommand(row, tests = [], pythonCommand = 'python') {
    const selected = tests.filter(Boolean);
    if (!selected.length) {
        return '';
    }
    if (row.repo === 'django/django') {
        return `${pythonCommand} tests/runtests.py ${selected.map(djangoTestLabel).map(quoteBash).join(' ')} --verbosity=2`;
    }
    return `${pythonCommand} -m pytest ${selected.map((selector) => pytestTestLabel(row, selector)).map(quoteBash).join(' ')} -q`;
}

async function runTests({ runner, repoDir, runDir, row, tests, label, timeoutMs, useVenv = true }) {
    const pythonCommand = runner.kind !== 'host' && !useVenv ? 'python3' : 'python';
    const command = buildTestCommand(row, tests, pythonCommand);
    if (!command) {
        return {
            ok: false,
            status: 'no_tests',
            command: '',
            stdout: '',
            stderr: `No tests for ${label}`
        };
    }
    const repoShell = runner.kind === 'wsl' ? winToWslPath(repoDir) : repoDir;
    const venv = buildVenvPrefix(runner, runDir);
    const script = runner.kind === 'host'
        ? [
              `$ErrorActionPreference='Continue'`,
              useVenv ? venv.activate : '',
              `Set-Location ${JSON.stringify(repoDir)}`,
              command
          ].filter(Boolean).join('\n')
        : [
              `cd ${quoteBash(repoShell)}`,
              useVenv ? venv.activate : '',
              command
          ].filter(Boolean).join('\n');
    const result = await runShell(runner, script, { timeoutMs });
    return {
        ...result,
        status: result.ok ? 'tests_passed' : 'tests_failed',
        label,
        testCount: tests.length
    };
}

async function runAgentPatch({ runner, repoDir, runDir, row, args, goldPatchPath }) {
    if (args.agentMode === 'none') {
        return {
            ok: true,
            status: 'skipped_no_agent',
            command: 'agent skipped',
            stdout: 'Agent modification skipped. Use --agent-mode gold, --candidate-patch, or --agent-command.',
            stderr: ''
        };
    }
    if (args.agentMode === 'gold') {
        return await applyPatch({
            runner,
            repoDir,
            patchPath: goldPatchPath,
            title: 'apply SWE-bench reference patch',
            timeoutMs: args.checkoutTimeoutMs
        });
    }
    if (args.candidatePatch || args.agentMode === 'candidate-patch') {
        if (!args.candidatePatch) {
            return {
                ok: false,
                status: 'missing_candidate_patch',
                command: 'agent candidate-patch',
                stdout: '',
                stderr: '--candidate-patch is required when --agent-mode candidate-patch is used.'
            };
        }
        return await applyPatch({
            runner,
            repoDir,
            patchPath: args.candidatePatch,
            title: 'apply candidate patch',
            timeoutMs: args.checkoutTimeoutMs
        });
    }
    if (args.agentMode === 'agent-command' || args.agentCommand) {
        if (!args.agentCommand) {
            return {
                ok: false,
                status: 'missing_agent_command',
                command: 'agent command',
                stdout: '',
                stderr: '--agent-command is required when --agent-mode agent-command is used.'
            };
        }
        const taskPath = path.join(runDir, 'agent-task.json');
        await fs.writeFile(taskPath, `${JSON.stringify({
            instance_id: row.instance_id,
            repo: row.repo,
            repoDir,
            problem_statement: row.problem_statement,
            fail_to_pass: row.fail_to_pass,
            pass_to_pass: row.pass_to_pass,
            expected_output: 'Modify files in repoDir. Leave final diff in git working tree.'
        }, null, 2)}\n`, 'utf8');
        const repoShell = runner.kind === 'wsl' ? winToWslPath(repoDir) : repoDir;
        const taskShell = runner.kind === 'wsl' ? winToWslPath(taskPath) : taskPath;
        const script = runner.kind === 'host'
            ? [
                  `$env:SWE_BENCH_TASK=${JSON.stringify(taskPath)}`,
                  `$env:SWE_BENCH_REPO=${JSON.stringify(repoDir)}`,
                  `Set-Location ${JSON.stringify(repoDir)}`,
                  args.agentCommand
              ].join('\n')
            : [
                  `export SWE_BENCH_TASK=${quoteBash(taskShell)}`,
                  `export SWE_BENCH_REPO=${quoteBash(repoShell)}`,
                  `cd ${quoteBash(repoShell)}`,
                  args.agentCommand
              ].join('\n');
        const result = await runShell(runner, script, { timeoutMs: args.testTimeoutMs });
        return {
            ...result,
            status: result.ok ? 'agent_completed' : 'agent_failed',
            taskPath
        };
    }
    return {
        ok: false,
        status: 'invalid_agent_mode',
        command: 'agent',
        stdout: '',
        stderr: `Unsupported agent mode: ${args.agentMode}`
    };
}

async function captureDiff({ runner, repoDir }) {
    const repoShell = runner.kind === 'wsl' ? winToWslPath(repoDir) : repoDir;
    const script = runner.kind === 'host'
        ? [`Set-Location ${JSON.stringify(repoDir)}`, 'git diff -- .'].join('\n')
        : [`cd ${quoteBash(repoShell)}`, 'git diff -- .'].join('\n');
    const result = await runShell(runner, script, { timeoutMs: 60000 });
    return {
        ...result,
        diff: result.stdout || ''
    };
}

function patchFilesFromRow(row) {
    const files = new Set();
    for (const patch of [row.patch, row.test_patch]) {
        for (const match of String(patch || '').matchAll(/^diff --git a\/(.+?) b\/(.+)$/gm)) {
            files.add(match[2] || match[1]);
        }
    }
    return [...files].filter(Boolean);
}

function buildExecutionTrace(row, execution) {
    return {
        instanceId: row.instance_id,
        repo: row.repo,
        baseCommit: row.base_commit,
        targetFiles: patchFilesFromRow(row),
        failToPass: row.fail_to_pass || [],
        passToPassSample: row.pass_to_pass || [],
        phases: {
            checkout: execution.checkout?.status || (execution.checkout?.ok ? 'completed' : 'failed'),
            testPatch: execution.testPatch?.status || '',
            setup: execution.setup?.status || '',
            preTest: execution.preTest?.status || '',
            agent: execution.agent?.status || '',
            verify: execution.verify?.status || ''
        },
        observations: [
            {
                id: 'problem_statement',
                ok: Boolean(row.problem_statement),
                preview: truncateText(row.problem_statement, 1200)
            },
            {
                id: 'checkout',
                ok: execution.checkout?.ok === true,
                preview: truncateText([execution.checkout?.stdout, execution.checkout?.stderr].filter(Boolean).join('\n'), 1200)
            },
            {
                id: 'pre_test',
                ok: execution.preTest?.ok === true,
                preview: truncateText([execution.preTest?.stdout, execution.preTest?.stderr].filter(Boolean).join('\n'), 1200)
            },
            {
                id: 'candidate_diff',
                ok: Boolean(execution.diff?.diff?.trim()),
                preview: truncateText(execution.diff?.diff || '', 1200)
            },
            {
                id: 'verification',
                ok: execution.verify?.ok === true,
                preview: truncateText([execution.verify?.stdout, execution.verify?.stderr].filter(Boolean).join('\n'), 1200)
            }
        ]
    };
}

async function executeInstance(rowInput, args, runner) {
    const row = normalizeRow(rowInput);
    const instanceDirName = row.instance_id || `${row.repo.replace(/[^\w.-]+/g, '__')}-${Date.now()}`;
    const runDir = path.join(args.outputDir, instanceDirName);
    const repoDir = path.join(runDir, 'repo');
    const logsDir = path.join(runDir, 'logs');
    await fs.mkdir(logsDir, { recursive: true });
    const files = await writeInstanceFiles(runDir, row);
    const execution = {
        instance_id: row.instance_id,
        repo: row.repo,
        runner,
        runDir,
        repoDir,
        files,
        status: 'started',
        checkout: null,
        testPatch: null,
        setup: null,
        preTest: null,
        agent: null,
        diff: null,
        verify: null
    };

    if (runner.kind === 'unavailable') {
        execution.status = 'environment_unavailable';
        execution.checkout = { ok: false, status: 'environment_unavailable', stderr: runner.reason };
        execution.preTest = { ok: false, status: 'not_run', stdout: '', stderr: runner.reason };
        execution.agent = { ok: false, status: 'not_run', stdout: '', stderr: runner.reason };
        execution.diff = { ok: false, status: 'not_run', diff: '' };
        execution.verify = { ok: false, status: 'not_run', stdout: '', stderr: runner.reason };
        return finalizeExecution(row, execution);
    }

    execution.checkout = await checkoutRepo({ runner, row, repoDir, timeoutMs: args.checkoutTimeoutMs, args });
    if (!execution.checkout.ok) {
        execution.status = 'checkout_failed';
        execution.testPatch = { ok: false, status: 'not_run', stdout: '', stderr: 'checkout failed' };
        execution.setup = { ok: false, status: 'not_run', stdout: '', stderr: 'checkout failed' };
        execution.preTest = { ok: false, status: 'not_run', stdout: '', stderr: 'checkout failed' };
        execution.agent = { ok: false, status: 'not_run', stdout: '', stderr: 'checkout failed' };
        execution.diff = { ok: false, status: 'not_run', diff: '' };
        execution.verify = { ok: false, status: 'not_run', stdout: '', stderr: 'checkout failed' };
        return finalizeExecution(row, execution);
    }

    execution.testPatch = await applyPatch({
        runner,
        repoDir,
        patchPath: files.testPatchPath,
        title: 'apply SWE-bench test patch',
        timeoutMs: args.checkoutTimeoutMs
    });
    if (!execution.testPatch.ok) {
        execution.status = 'test_patch_failed';
        execution.setup = { ok: false, status: 'not_run', stdout: '', stderr: 'test patch failed' };
        execution.preTest = { ok: false, status: 'not_run', stdout: '', stderr: 'test patch failed' };
        execution.agent = { ok: false, status: 'not_run', stdout: '', stderr: 'test patch failed' };
        execution.diff = await captureDiff({ runner, repoDir });
        execution.verify = { ok: false, status: 'not_run', stdout: '', stderr: 'test patch failed' };
        return finalizeExecution(row, execution);
    }

    execution.setup = await setupEnvironment({ runner, repoDir, runDir, row, args });
    if (!execution.setup.ok) {
        execution.status = 'setup_failed';
        execution.preTest = { ok: false, status: 'not_run', stdout: '', stderr: 'setup failed' };
        execution.agent = { ok: false, status: 'not_run', stdout: '', stderr: 'setup failed' };
        execution.diff = await captureDiff({ runner, repoDir });
        execution.verify = { ok: false, status: 'not_run', stdout: '', stderr: 'setup failed' };
        return finalizeExecution(row, execution);
    }

    execution.preTest = await runTests({
        runner,
        repoDir,
        runDir,
        row,
        tests: row.fail_to_pass || [],
        label: 'FAIL_TO_PASS baseline',
        timeoutMs: args.testTimeoutMs,
        useVenv: args.setupMode !== 'skip'
    });

    execution.agent = await runAgentPatch({
        runner,
        repoDir,
        runDir,
        row,
        args,
        goldPatchPath: files.goldPatchPath
    });
    execution.diff = await captureDiff({ runner, repoDir });

    if (!execution.agent.ok) {
        execution.status = execution.agent.status || 'agent_failed';
        execution.verify = { ok: false, status: 'not_run', stdout: '', stderr: 'agent failed' };
        return finalizeExecution(row, execution);
    }

    execution.verify = await runTests({
        runner,
        repoDir,
        runDir,
        row,
        tests: [
            ...(row.fail_to_pass || []),
            ...(row.pass_to_pass || []).slice(0, args.passToPassLimit)
        ],
        label: 'verification',
        timeoutMs: args.testTimeoutMs,
        useVenv: args.setupMode !== 'skip'
    });
    execution.status = execution.verify.ok ? 'verified' : 'verification_failed';
    return finalizeExecution(row, execution);
}

async function writeStepLogs(runDir, execution) {
    const logsDir = path.join(runDir, 'logs');
    await fs.mkdir(logsDir, { recursive: true });
    for (const [name, result] of Object.entries({
        checkout: execution.checkout,
        test_patch: execution.testPatch,
        setup: execution.setup,
        pre_test: execution.preTest,
        agent: execution.agent,
        diff: execution.diff,
        verify: execution.verify
    })) {
        if (!result) continue;
        await fs.writeFile(path.join(logsDir, `${name}.json`), `${JSON.stringify(result, null, 2)}\n`, 'utf8');
        if (result.stdout) await fs.writeFile(path.join(logsDir, `${name}.stdout.txt`), result.stdout, 'utf8');
        if (result.stderr) await fs.writeFile(path.join(logsDir, `${name}.stderr.txt`), result.stderr, 'utf8');
    }
    if (execution.diff?.diff) {
        await fs.writeFile(path.join(runDir, 'candidate.diff'), execution.diff.diff, 'utf8');
    }
}

async function finalizeExecution(row, execution) {
    await writeStepLogs(execution.runDir, execution);
    const executionTrace = buildExecutionTrace(row, execution);
    const result = {
        ok: execution.status === 'verified',
        status: execution.status,
        instance_id: row.instance_id,
        repo: row.repo,
        runDir: execution.runDir,
        repoDir: execution.repoDir,
        runner: execution.runner,
        executionTrace,
        phases: {
            checkout: execution.checkout?.status || (execution.checkout?.ok ? 'completed' : 'failed'),
            testPatch: execution.testPatch?.status || '',
            setup: execution.setup?.status || '',
            preTest: execution.preTest?.status || '',
            agent: execution.agent?.status || '',
            verify: execution.verify?.status || ''
        },
        candidateDiffPath: execution.diff?.diff ? path.join(execution.runDir, 'candidate.diff') : '',
        logDir: path.join(execution.runDir, 'logs')
    };
    await fs.writeFile(path.join(execution.runDir, 'execution.report.json'), `${JSON.stringify(result, null, 2)}\n`, 'utf8');
    return result;
}

async function loadRows(args) {
    let datasetPath = args.datasetPath;
    let prepared = null;
    if (!datasetPath) {
        prepared = await prepareSweBenchLiteSample({
            split: args.split,
            offset: args.offset,
            limit: args.limit
        });
        datasetPath = prepared.output;
    }
    let rows = (await readJsonl(datasetPath)).map(normalizeRow);
    if (args.instanceId) {
        rows = rows.filter((row) => row.instance_id === args.instanceId);
    }
    rows = rows.slice(0, args.limit);
    return { datasetPath, prepared, rows };
}

export async function runSweBenchLiteExecution(options = {}) {
    const args = {
        ...parseArgs([]),
        ...options
    };
    await fs.mkdir(args.outputDir, { recursive: true });
    const runner = await resolveRunner(args);
    const { datasetPath, prepared, rows } = await loadRows(args);
    const cases = [];
    for (const row of rows) {
        cases.push(await executeInstance(row, args, runner));
    }
    const report = {
        ok: cases.every((entry) => entry.ok),
        generatedAt: new Date().toISOString(),
        datasetPath,
        prepared,
        runner,
        summary: {
            total: cases.length,
            verified: cases.filter((entry) => entry.status === 'verified').length,
            checkoutFailed: cases.filter((entry) => entry.status === 'checkout_failed').length,
            setupFailed: cases.filter((entry) => entry.status === 'setup_failed').length,
            verificationFailed: cases.filter((entry) => entry.status === 'verification_failed').length,
            environmentUnavailable: cases.filter((entry) => entry.status === 'environment_unavailable').length,
            statuses: cases.reduce((acc, entry) => {
                acc[entry.status] = (acc[entry.status] || 0) + 1;
                return acc;
            }, {})
        },
        cases
    };
    const reportPath = path.join(args.outputDir, 'swebench-lite-execution.report.json');
    await fs.writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    report.output = reportPath;
    return report;
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
    const args = parseArgs();
    const report = await runSweBenchLiteExecution(args);
    console.log(JSON.stringify({
        ok: report.ok,
        output: report.output,
        runner: report.runner,
        summary: report.summary,
        cases: report.cases.map((entry) => ({
            instance_id: entry.instance_id,
            repo: entry.repo,
            status: entry.status,
            phases: entry.phases,
            missingEvidence: entry.missingEvidence,
            runDir: entry.runDir
        }))
    }, null, 2));
    if (args.strict && !report.ok) {
        process.exitCode = 1;
    }
}
