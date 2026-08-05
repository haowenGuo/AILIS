import fs from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const {
    MEMORY_STRATEGIES,
    resolveMemoryStrategy
} = require('../electron/ailis-memory-strategies.cjs');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const PARALLEL_RUNNER = path.join(__dirname, 'run-ailis-longmemeval-parallel.mjs');
const DEFAULT_QUALITY_STRATEGIES = Object.values(MEMORY_STRATEGIES)
    .filter((strategy) =>
        strategy.maturity === 'verified' ||
        strategy.maturity === 'full'
    )
    .map((strategy) => strategy.id);

function normalizeText(value, fallback = '') {
    return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

function environmentFlag(name, fallback = false) {
    const value = normalizeText(process.env[name]).toLowerCase();
    if (!value) return fallback;
    return ['1', 'true', 'yes', 'on'].includes(value);
}

function safeSegment(value, fallback = 'matrix') {
    return normalizeText(value, fallback)
        .replace(/[^a-zA-Z0-9._-]+/g, '_')
        .replace(/^_+|_+$/g, '')
        .slice(0, 120) || fallback;
}

function parseArgs(argv = process.argv.slice(2)) {
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    const args = {
        runId: `memory-matrix-${stamp}`,
        outputDir: '',
        strategies: DEFAULT_QUALITY_STRATEGIES,
        dataset: 's',
        dataPath: '',
        workers: 10,
        limit: 0,
        offset: 0,
        questionIds: [],
        profileCuration: 'drain',
        cognitionCuration: 'auto',
        localMemoryEmbeddings: 'auto',
        memoryEmbeddingModel: process.env.AILIS_MEMORY_EMBEDDING_MODEL || '',
        memoryEmbeddingRevision: process.env.AILIS_MEMORY_EMBEDDING_REVISION || '',
        memoryRerankerModel: process.env.AILIS_MEMORY_RERANKER_MODEL || '',
        memoryRerankerRevision: process.env.AILIS_MEMORY_RERANKER_REVISION || '',
        memoryModelEndpoint:
            process.env.AILIS_MEMORY_MODEL_ENDPOINT ||
            process.env.HF_ENDPOINT ||
            '',
        memoryModelCacheDir:
            process.env.AILIS_MEMORY_MODEL_CACHE ||
            process.env.TRANSFORMERS_CACHE ||
            '',
        memoryModelsOffline: environmentFlag('AILIS_MEMORY_MODELS_OFFLINE'),
        provider: '',
        baseUrl: '',
        model: '',
        timeoutMs: 0,
        prepareOnly: false,
        keepState: true,
        continueOnError: false
    };
    for (let index = 0; index < argv.length; index += 1) {
        const token = argv[index];
        const next = () => argv[++index] || '';
        if (token === '--run-id') args.runId = safeSegment(next(), args.runId);
        else if (token === '--output-dir') args.outputDir = path.resolve(next());
        else if (token === '--strategies') {
            args.strategies = next().split(',')
                .map((entry) => resolveMemoryStrategy(entry, ''))
                .filter(Boolean);
        } else if (token === '--dataset') args.dataset = normalizeText(next(), 's');
        else if (token === '--data-path') args.dataPath = path.resolve(next());
        else if (token === '--workers') args.workers = Math.max(1, Number(next()) || 10);
        else if (token === '--limit') args.limit = Math.max(0, Number(next()) || 0);
        else if (token === '--offset') args.offset = Math.max(0, Number(next()) || 0);
        else if (token === '--question-ids') {
            args.questionIds = next().split(',')
                .map((entry) => normalizeText(entry))
                .filter(Boolean);
        }
        else if (token === '--profile-curation') args.profileCuration = normalizeText(next(), 'drain');
        else if (token === '--cognition-curation') args.cognitionCuration = normalizeText(next(), 'auto');
        else if (token === '--memory-local-embeddings') args.localMemoryEmbeddings = 'on';
        else if (token === '--no-memory-local-embeddings') args.localMemoryEmbeddings = 'off';
        else if (token === '--memory-embedding-model') args.memoryEmbeddingModel = normalizeText(next());
        else if (token === '--memory-embedding-revision') args.memoryEmbeddingRevision = normalizeText(next());
        else if (token === '--memory-reranker-model') args.memoryRerankerModel = normalizeText(next());
        else if (token === '--memory-reranker-revision') args.memoryRerankerRevision = normalizeText(next());
        else if (token === '--memory-model-endpoint') args.memoryModelEndpoint = normalizeText(next());
        else if (token === '--memory-model-cache-dir') args.memoryModelCacheDir = path.resolve(next());
        else if (token === '--memory-models-offline') args.memoryModelsOffline = true;
        else if (token === '--memory-models-online') args.memoryModelsOffline = false;
        else if (token === '--provider') args.provider = normalizeText(next());
        else if (token === '--base-url') args.baseUrl = normalizeText(next());
        else if (token === '--model') args.model = normalizeText(next());
        else if (token === '--timeout-ms') args.timeoutMs = Math.max(1000, Number(next()) || 0);
        else if (token === '--prepare-only') args.prepareOnly = true;
        else if (token === '--discard-state') args.keepState = false;
        else if (token === '--keep-state') args.keepState = true;
        else if (token === '--continue-on-error') args.continueOnError = true;
        else if (token === '--help' || token === '-h') args.help = true;
        else throw new Error(`Unknown argument: ${token}`);
    }
    args.strategies = [...new Set(args.strategies)];
    args.questionIds = [...new Set(args.questionIds)];
    if (!args.strategies.length) {
        throw new Error('At least one memory strategy is required');
    }
    args.outputDir ||= path.join(
        PROJECT_ROOT,
        'eval-results',
        'longmemeval-ailis',
        args.runId
    );
    return args;
}

function printHelp() {
    console.log([
        'AILIS LongMemEval memory strategy matrix',
        '',
        'Runs each selected strategy sequentially; every strategy may use ten isolated workers.',
        '',
        'Usage:',
        '  node scripts/run-ailis-longmemeval-memory-matrix.mjs [options]',
        '',
        'Options:',
        '  --strategies IDS           Comma-separated IDs or aliases (default: baseline + full implementations)',
        '  --workers N                Worker processes per strategy (default: 10)',
        '  --limit N                  Questions per strategy (0 means all)',
        '  --question-ids IDS         Explicit comma-separated stratified sample',
        '  --output-dir PATH          Matrix artifact root',
        '  --dataset s|oracle         LongMemEval dataset',
        '  --data-path PATH           Custom dataset path',
        '  --provider/--model VALUE   Candidate and memory-curation LLM',
        '  --timeout-ms N             Per-question timeout',
        '  --no-memory-local-embeddings Disable local dense retrieval',
        '  --memory-embedding-model ID Embedding model used by every strategy',
        '  --memory-embedding-revision SHA Pin the embedding model revision',
        '  --memory-reranker-model ID  Cross-encoder used by every full strategy',
        '  --memory-reranker-revision SHA Pin the cross-encoder revision',
        '  --memory-model-endpoint URL Hugging Face-compatible model host',
        '  --memory-model-cache-dir PATH Shared persistent model cache',
        '  --memory-models-offline     Require cached models for every strategy',
        '  --prepare-only             Prepare each strategy shard without evaluation',
        '  --continue-on-error        Continue to later strategies after a failed run',
        '',
        `Default quality strategies: ${DEFAULT_QUALITY_STRATEGIES.join(', ')}`,
        `Prototype opt-ins: ${Object.values(MEMORY_STRATEGIES)
            .filter((strategy) => strategy.maturity === 'prototype')
            .map((strategy) => strategy.id)
            .join(', ')}`
    ].join('\n'));
}

function workerArgsFor(args, strategy) {
    const outputDir = path.join(args.outputDir, strategy);
    const childArgs = [
        PARALLEL_RUNNER,
        '--dataset', args.dataset,
        '--workers', String(args.workers),
        '--run-id', `${args.runId}-${strategy}`,
        '--output-dir', outputDir,
        '--memory-strategy', strategy,
        '--profile-curation', args.profileCuration,
        '--cognition-curation', args.cognitionCuration,
        args.keepState ? '--keep-state' : '--discard-state'
    ];
    if (args.dataPath) childArgs.push('--data-path', args.dataPath);
    if (args.limit) childArgs.push('--limit', String(args.limit));
    if (args.offset) childArgs.push('--offset', String(args.offset));
    if (args.questionIds.length) {
        childArgs.push('--question-ids', args.questionIds.join(','));
    }
    if (args.localMemoryEmbeddings === 'on') childArgs.push('--memory-local-embeddings');
    if (args.localMemoryEmbeddings === 'off') childArgs.push('--no-memory-local-embeddings');
    if (args.memoryEmbeddingModel) {
        childArgs.push('--memory-embedding-model', args.memoryEmbeddingModel);
    }
    if (args.memoryEmbeddingRevision) {
        childArgs.push('--memory-embedding-revision', args.memoryEmbeddingRevision);
    }
    if (args.memoryRerankerModel) {
        childArgs.push('--memory-reranker-model', args.memoryRerankerModel);
    }
    if (args.memoryRerankerRevision) {
        childArgs.push('--memory-reranker-revision', args.memoryRerankerRevision);
    }
    if (args.memoryModelEndpoint) {
        childArgs.push('--memory-model-endpoint', args.memoryModelEndpoint);
    }
    if (args.memoryModelCacheDir) {
        childArgs.push('--memory-model-cache-dir', args.memoryModelCacheDir);
    }
    childArgs.push(args.memoryModelsOffline
        ? '--memory-models-offline'
        : '--memory-models-online');
    if (args.provider) childArgs.push('--provider', args.provider);
    if (args.baseUrl) childArgs.push('--base-url', args.baseUrl);
    if (args.model) childArgs.push('--model', args.model);
    if (args.timeoutMs) childArgs.push('--timeout-ms', String(args.timeoutMs));
    if (args.prepareOnly) childArgs.push('--prepare-only');
    return { outputDir, childArgs };
}

async function runChild(childArgs) {
    const child = spawn(process.execPath, childArgs, {
        cwd: PROJECT_ROOT,
        stdio: 'inherit',
        windowsHide: true
    });
    const exit = await new Promise((resolve, reject) => {
        child.once('error', reject);
        child.once('exit', (exitCode, signal) => resolve({ exitCode, signal }));
    });
    return exit;
}

async function readJson(filePath) {
    try {
        return JSON.parse(await fs.readFile(filePath, 'utf8'));
    } catch {
        return null;
    }
}

function summaryRow(strategy, summary, exit) {
    const results = summary?.results || {};
    return {
        strategy,
        label: MEMORY_STRATEGIES[strategy]?.label || strategy,
        exitCode: exit.exitCode,
        signal: exit.signal || '',
        expected: Number(results.expected || 0),
        completed: Number(results.completed || 0),
        failed: Number(results.failed || 0),
        completionRate: results.completionRate ?? null,
        sessionRecallAt8: results.nativeRetrievalSessionRecallAt8 ?? null,
        turnRecallAt8: results.nativeRetrievalTurnRecallAt8 ?? null,
        officialQaAccuracy: results.officialQaAccuracy ?? null,
        taskAgentViolationCount: Number(results.taskAgentViolationCount || 0),
        readOnlyViolationCount: Number(results.readOnlyViolationCount || 0),
        cognitionDrainViolationCount: Number(results.cognitionDrainViolationCount || 0)
    };
}

async function main() {
    const args = parseArgs();
    if (args.help) {
        printHelp();
        return;
    }
    await fs.mkdir(args.outputDir, { recursive: true });
    const startedAt = new Date().toISOString();
    const rows = [];
    await fs.writeFile(path.join(args.outputDir, 'matrix-manifest.json'), `${JSON.stringify({
        benchmark: 'LongMemEval',
        startedAt,
        runId: args.runId,
        strategies: args.strategies,
        workersPerStrategy: args.workers,
        execution: 'strategies sequential; workers within each strategy parallel',
        args: {
            dataset: args.dataset,
            dataPath: args.dataPath,
            limit: args.limit,
            offset: args.offset,
            questionIds: args.questionIds,
            profileCuration: args.profileCuration,
            cognitionCuration: args.cognitionCuration,
            localMemoryEmbeddings: args.localMemoryEmbeddings,
            memoryEmbeddingModel: args.memoryEmbeddingModel,
            memoryEmbeddingRevision: args.memoryEmbeddingRevision,
            memoryRerankerModel: args.memoryRerankerModel,
            memoryRerankerRevision: args.memoryRerankerRevision,
            memoryModelEndpoint: args.memoryModelEndpoint,
            memoryModelCacheDir: args.memoryModelCacheDir,
            memoryModelsOffline: args.memoryModelsOffline
        }
    }, null, 2)}\n`, 'utf8');

    for (const strategy of args.strategies) {
        console.log(`\n[AILIS memory matrix] starting ${strategy}\n`);
        const { outputDir, childArgs } = workerArgsFor(args, strategy);
        const exit = await runChild(childArgs);
        const summary = await readJson(path.join(outputDir, 'summary.json'));
        rows.push(summaryRow(strategy, summary, exit));
        await fs.writeFile(path.join(args.outputDir, 'matrix-summary.json'), `${JSON.stringify({
            benchmark: 'LongMemEval',
            runId: args.runId,
            startedAt,
            updatedAt: new Date().toISOString(),
            completedStrategyCount: rows.length,
            strategyCount: args.strategies.length,
            rows
        }, null, 2)}\n`, 'utf8');
        if (exit.exitCode !== 0 && !args.continueOnError) {
            throw new Error(`${strategy} evaluation exited with code ${exit.exitCode}`);
        }
    }

    const result = {
        benchmark: 'LongMemEval',
        runId: args.runId,
        startedAt,
        finishedAt: new Date().toISOString(),
        strategyCount: args.strategies.length,
        rows,
        outputDir: args.outputDir
    };
    await fs.writeFile(
        path.join(args.outputDir, 'matrix-summary.json'),
        `${JSON.stringify(result, null, 2)}\n`,
        'utf8'
    );
    console.log(JSON.stringify(result, null, 2));
}

if (path.resolve(process.argv[1] || '') === fileURLToPath(import.meta.url)) {
    main().catch((error) => {
        console.error(error?.stack || error?.message || String(error));
        process.exitCode = 1;
    });
}
