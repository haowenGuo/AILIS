import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const BENCHMARK_ROOT = path.join(PROJECT_ROOT, 'build-cache', 'benchmarks');
const HF_DATASET_ROOT = path.join(PROJECT_ROOT, 'build-cache', 'hf-datasets');
const OUTPUT_DIR = path.join(PROJECT_ROOT, 'eval-results', 'benchmark-sources');
const OUTPUT_PATH = path.join(OUTPUT_DIR, 'core-benchmark-sources.json');

const REPOS = [
    {
        id: 'agentbench',
        name: 'agentbench-fc',
        url: 'https://github.com/THUDM/AgentBench.git',
        revision: 'd1e4a10db08c87075c78972e48ecc182be03e2d5'
    },
    {
        id: 'locomo',
        name: 'locomo',
        url: 'https://github.com/snap-research/locomo.git',
        branch: 'main'
    },
    {
        id: 'terminal-bench',
        name: 'terminal-bench',
        url: 'https://github.com/laude-institute/terminal-bench.git',
        branch: 'main'
    }
];

function parseArgs(argv = process.argv.slice(2)) {
    return {
        inventoryOnly: argv.includes('--inventory-only'),
        skipGaiaDownload: argv.includes('--skip-gaia-download'),
        refresh: argv.includes('--refresh')
    };
}

function normalizeText(value, fallback = '') {
    if (typeof value !== 'string') {
        return fallback;
    }
    const trimmed = value.trim();
    return trimmed || fallback;
}

function runProcess(command, args, options = {}) {
    return new Promise((resolve) => {
        const child = spawn(command, args, {
            cwd: options.cwd || PROJECT_ROOT,
            env: { ...process.env, ...(options.env || {}) },
            stdio: ['ignore', 'pipe', 'pipe'],
            windowsHide: true
        });
        let stdout = '';
        let stderr = '';
        const limit = options.captureLimit || 20000;
        const append = (current, chunk) => {
            const next = current + chunk.toString();
            return next.length > limit ? next.slice(-limit) : next;
        };
        child.stdout?.on('data', (chunk) => {
            stdout = append(stdout, chunk);
            options.onStdout?.(chunk);
        });
        child.stderr?.on('data', (chunk) => {
            stderr = append(stderr, chunk);
            options.onStderr?.(chunk);
        });
        child.on('error', (error) => {
            resolve({ code: -1, stdout, stderr, error: error.message });
        });
        child.on('close', (code) => {
            resolve({ code, stdout, stderr });
        });
    });
}

async function pathExists(target) {
    try {
        await fs.access(target);
        return true;
    } catch {
        return false;
    }
}

async function readJsonFile(target, fallback = null) {
    try {
        return JSON.parse(await fs.readFile(target, 'utf8'));
    } catch {
        return fallback;
    }
}

async function countFiles(target, predicate = () => true) {
    if (!await pathExists(target)) {
        return 0;
    }
    let total = 0;
    const stack = [target];
    while (stack.length) {
        const current = stack.pop();
        const entries = await fs.readdir(current, { withFileTypes: true }).catch(() => []);
        for (const entry of entries) {
            const fullPath = path.join(current, entry.name);
            if (entry.isDirectory()) {
                stack.push(fullPath);
            } else if (predicate(fullPath)) {
                total += 1;
            }
        }
    }
    return total;
}

async function listSubdirectories(target) {
    const entries = await fs.readdir(target, { withFileTypes: true }).catch(() => []);
    return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort();
}

async function gitShortHead(repoPath) {
    const result = await runProcess('git', ['-C', repoPath, 'rev-parse', '--short', 'HEAD']);
    return result.code === 0 ? normalizeText(result.stdout) : '';
}

async function gitHead(repoPath) {
    const result = await runProcess('git', ['-C', repoPath, 'rev-parse', 'HEAD']);
    return result.code === 0 ? normalizeText(result.stdout) : '';
}

async function checkoutPinnedRevision(repoPath, repo) {
    const fetch = await runProcess('git', [
        '-C', repoPath, 'fetch', '--depth', '1', 'origin', repo.revision
    ], { captureLimit: 12000 });
    if (fetch.code !== 0) return fetch;
    return runProcess('git', [
        '-C', repoPath, 'checkout', '--detach', repo.revision
    ], { captureLimit: 12000 });
}

async function hasHfAuth() {
    if (process.env.HF_TOKEN || process.env.HUGGINGFACE_HUB_TOKEN) {
        return true;
    }
    const result = await runProcess('hf', ['auth', 'whoami'], { captureLimit: 4000 });
    return result.code === 0;
}

async function ensureRepo(repo, args) {
    const repoPath = path.join(BENCHMARK_ROOT, repo.name);
    const gitDir = path.join(repoPath, '.git');
    if (await pathExists(gitDir)) {
        const currentRevision = await gitHead(repoPath);
        if (!args.inventoryOnly && repo.revision && (args.refresh || currentRevision !== repo.revision)) {
            const checkout = await checkoutPinnedRevision(repoPath, repo);
            if (checkout.code !== 0) {
                return {
                    id: repo.id,
                    status: 'checkout_failed',
                    path: repoPath,
                    source: repo.url,
                    expectedRevision: repo.revision,
                    error: normalizeText(checkout.stderr || checkout.stdout || checkout.error)
                };
            }
        }
        const resolvedRevision = await gitHead(repoPath);
        return {
            id: repo.id,
            status: repo.revision && resolvedRevision !== repo.revision ? 'revision_mismatch' : 'available',
            path: repoPath,
            commit: await gitShortHead(repoPath),
            expectedRevision: repo.revision || null,
            revisionMatches: !repo.revision || resolvedRevision === repo.revision,
            source: repo.url
        };
    }
    if (args.inventoryOnly) {
        return {
            id: repo.id,
            status: 'missing',
            path: repoPath,
            source: repo.url
        };
    }
    await fs.mkdir(BENCHMARK_ROOT, { recursive: true });
    const result = await runProcess('git', [
        'clone',
        '--filter=blob:none',
        '--no-checkout',
        repo.url,
        repoPath
    ], { captureLimit: 16000 });
    if (result.code !== 0) {
        return {
            id: repo.id,
            status: 'download_failed',
            path: repoPath,
            source: repo.url,
            error: normalizeText(result.stderr || result.stdout || result.error, 'git clone failed')
        };
    }
    if (repo.revision) {
        const checkout = await checkoutPinnedRevision(repoPath, repo);
        if (checkout.code !== 0) {
            return {
                id: repo.id,
                status: 'checkout_failed',
                path: repoPath,
                source: repo.url,
                expectedRevision: repo.revision,
                error: normalizeText(checkout.stderr || checkout.stdout || checkout.error)
            };
        }
    }
    return {
        id: repo.id,
        status: 'available',
        path: repoPath,
        commit: await gitShortHead(repoPath),
        expectedRevision: repo.revision || null,
        revisionMatches: true,
        source: repo.url
    };
}

async function inventoryAgentBench(base) {
    const repoPath = base.path;
    const dataRoot = path.join(repoPath, 'data');
    const configRoot = path.join(repoPath, 'configs', 'tasks');
    const taskYamlCount = await countFiles(path.join(repoPath, 'tasks'), (filePath) => /task\.ya?ml$/i.test(filePath));
    const environments = await listSubdirectories(dataRoot);
    return {
        ...base,
        dataRoot,
        environments,
        taskConfigCount: await countFiles(configRoot, (filePath) => /\.ya?ml$/i.test(filePath)),
        dataFileCount: await countFiles(dataRoot),
        ailisRunnerCompatibility: 'official_fc_controller',
        note: 'Pinned AgentBench FC checkout. Run through the official five-environment controller and OpenAI function-calling bridge.'
    };
}

async function inventoryLoCoMo(base) {
    const repoPath = base.path;
    const locomoPath = path.join(repoPath, 'data', 'locomo10.json');
    const locomo = await readJsonFile(locomoPath, []);
    const sampleCount = Array.isArray(locomo) ? locomo.length : Object.keys(locomo || {}).length;
    return {
        ...base,
        dataRoot: path.join(repoPath, 'data'),
        sampleFile: locomoPath,
        sampleCount,
        hasTaskEval: await pathExists(path.join(repoPath, 'task_eval', 'evaluate_qa.py')),
        recommendedAilisUse: 'Evaluate Raw Memory Ledger replay, profile extraction, relationship state, and long-session QA.'
    };
}

async function inventoryTerminalBench(base) {
    const repoPath = base.path;
    const originalTasksRoot = path.join(repoPath, 'original-tasks');
    const tasksRoot = path.join(repoPath, 'tasks');
    const originalTasks = await listSubdirectories(originalTasksRoot);
    const tasks = await listSubdirectories(tasksRoot);
    const registry = await readJsonFile(path.join(repoPath, 'registry.json'), []);
    return {
        ...base,
        originalTasksRoot,
        tasksRoot: await pathExists(tasksRoot) ? tasksRoot : '',
        originalTaskCount: originalTasks.length,
        taskCount: tasks.length,
        sampleTasks: originalTasks.slice(0, 12),
        registryEntries: Array.isArray(registry) ? registry.length : 0,
        recommendedAilisUse: 'Start with 5-10 easy original-tasks and measure command correctness, recovery, stdout/stderr handling, and test pass.'
    };
}

async function ensureGaia(args) {
    const datasetDir = path.join(HF_DATASET_ROOT, 'gaia-benchmark-GAIA');
    const metadataPath = path.join(datasetDir, '2023', 'validation', 'metadata.level1.parquet');
    if (await pathExists(metadataPath)) {
        return {
            id: 'gaia',
            status: 'available',
            path: datasetDir,
            metadataFiles: await countFiles(datasetDir, (filePath) => /\.parquet$/i.test(filePath)),
            source: 'https://huggingface.co/datasets/gaia-benchmark/GAIA'
        };
    }
    if (args.skipGaiaDownload || args.inventoryOnly) {
        const authed = await hasHfAuth();
        return {
            id: 'gaia',
            status: authed ? 'missing_download_skipped' : 'blocked_auth_required',
            path: datasetDir,
            source: 'https://huggingface.co/datasets/gaia-benchmark/GAIA',
            note: authed
                ? 'GAIA metadata is not cached locally. Run pnpm bench:core:prepare without --skip-gaia-download to download it.'
                : 'GAIA is gated. Run hf auth login or set HF_TOKEN/HUGGINGFACE_HUB_TOKEN after accepting dataset terms.'
        };
    }
    const result = await runProcess('node', [
        'scripts/run-gaia-official.mjs',
        '--split',
        'validation',
        '--levels',
        '1',
        '--download-only'
    ], { captureLimit: 16000 });
    if (result.code === 0 && await pathExists(metadataPath)) {
        return {
            id: 'gaia',
            status: 'available',
            path: datasetDir,
            metadataFiles: await countFiles(datasetDir, (filePath) => /\.parquet$/i.test(filePath)),
            source: 'https://huggingface.co/datasets/gaia-benchmark/GAIA'
        };
    }
    const output = normalizeText(result.stderr || result.stdout || result.error, 'GAIA download failed');
    const gated = /gated|HF_TOKEN|HUGGINGFACE_HUB_TOKEN|logged in|authentication/i.test(output);
    const concise = output
        .split(/\r?\n/)
        .filter((line) => !/^\s+at\s+/i.test(line))
        .slice(0, 8)
        .join('\n');
    return {
        id: 'gaia',
        status: gated ? 'blocked_auth_required' : 'download_failed',
        path: datasetDir,
        source: 'https://huggingface.co/datasets/gaia-benchmark/GAIA',
        error: concise
    };
}

async function main() {
    const args = parseArgs();
    const repoStatuses = [];
    for (const repo of REPOS) {
        repoStatuses.push(await ensureRepo(repo, args));
    }
    const byId = Object.fromEntries(repoStatuses.map((item) => [item.id, item]));
    const report = {
        version: 1,
        updatedAt: new Date().toISOString(),
        projectRoot: PROJECT_ROOT,
        benchmarkRoot: BENCHMARK_ROOT,
        outputPath: OUTPUT_PATH,
        benchmarks: [
            await ensureGaia(args),
            await inventoryAgentBench(byId.agentbench),
            await inventoryLoCoMo(byId.locomo),
            await inventoryTerminalBench(byId['terminal-bench'])
        ]
    };
    await fs.mkdir(OUTPUT_DIR, { recursive: true });
    await fs.writeFile(OUTPUT_PATH, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    console.log(JSON.stringify({
        ok: true,
        outputPath: OUTPUT_PATH,
        statuses: report.benchmarks.map((item) => ({
            id: item.id,
            status: item.status,
            commit: item.commit,
            count: item.originalTaskCount ?? item.sampleCount ?? item.dataFileCount ?? item.metadataFiles ?? null,
            compatibility: item.ailisRunnerCompatibility || null
        }))
    }, null, 2));
}

main().catch((error) => {
    console.error(error?.stack || error?.message || String(error));
    process.exit(1);
});
