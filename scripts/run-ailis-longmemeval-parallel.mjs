import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import net from 'node:net';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { readJsonArrayEntries } from './ailis-longmemeval-runtime.mjs';

const require = createRequire(import.meta.url);
const {
    LocalEmbeddingRuntime,
    MEMORY_STRATEGIES,
    resolveMemoryStrategy
} = require('../electron/ailis-memory-strategies.cjs');
const {
    DEFAULT_EMBEDDING_MODEL,
    DEFAULT_EMBEDDING_REVISION,
    DEFAULT_RERANKER_MODEL,
    DEFAULT_RERANKER_REVISION,
    StrictCrossEncoderRuntime,
    StrictDenseRuntime
} = require('../electron/ailis-memory-hybrid-full.cjs');
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const BENCHMARK_ROOT = path.join(PROJECT_ROOT, '.local', 'benchmarks', 'LongMemEval');
const DATASET_PATHS = Object.freeze({
    s: path.join(BENCHMARK_ROOT, 'data', 'longmemeval_s_cleaned.json'),
    oracle: path.join(BENCHMARK_ROOT, 'data', 'longmemeval_oracle.json')
});
const WORKER_RUNNER_PATH = path.join(__dirname, 'run-ailis-longmemeval.mjs');

function normalizeText(value, fallback = '') {
    if (typeof value !== 'string') return fallback;
    return value.trim() || fallback;
}

function environmentFlag(name, fallback = false) {
    const value = normalizeText(process.env[name]).toLowerCase();
    if (!value) return fallback;
    return ['1', 'true', 'yes', 'on'].includes(value);
}

function safeSegment(value, fallback = 'item') {
    return normalizeText(value, fallback)
        .replace(/[^a-zA-Z0-9._-]+/g, '_')
        .replace(/^_+|_+$/g, '')
        .slice(0, 120) || fallback;
}

function workerName(index) {
    return `worker-${String(index).padStart(2, '0')}`;
}

export function parseParallelArgs(argv = process.argv.slice(2)) {
    const generatedRunId = `parallel10-${new Date().toISOString().replace(/[:.]/g, '-')}`;
    const args = {
        dataset: 's',
        dataPath: '',
        outputDir: '',
        runId: generatedRunId,
        workers: 10,
        limit: 0,
        offset: 0,
        questionIds: [],
        maxWorkerRetries: 2,
        profileCuration: 'drain',
        cognitionCuration: 'auto',
        memoryStrategy: process.env.AILIS_MEMORY_STRATEGY || 'bm25_phrase_v1',
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
        allowDenseFallback: false,
        resumeQuestionState: true,
        timeoutMs: 0,
        provider: '',
        baseUrl: '',
        model: '',
        temperature: null,
        memoryLlmProvider: process.env.AILIS_MEMORY_LLM_PROVIDER || '',
        memoryLlmBaseUrl: process.env.AILIS_MEMORY_LLM_BASE_URL || '',
        memoryLlmModel: process.env.AILIS_MEMORY_LLM_MODEL || '',
        memoryLlmTemperature: process.env.AILIS_MEMORY_LLM_TEMPERATURE !== undefined &&
            Number.isFinite(Number(process.env.AILIS_MEMORY_LLM_TEMPERATURE))
            ? Number(process.env.AILIS_MEMORY_LLM_TEMPERATURE)
            : null,
        memoryLlmTimeoutMs: Math.max(
            0,
            Number(process.env.AILIS_MEMORY_LLM_TIMEOUT_MS) || 0
        ),
        hindsightReadyTimeoutMs: Math.max(
            180_000,
            Number(process.env.AILIS_HINDSIGHT_READY_TIMEOUT_MS) || 900_000
        ),
        keepState: true,
        prepareOnly: false,
        progressIntervalMs: 15000,
        workerStartStaggerMs: 0
    };
    for (let index = 0; index < argv.length; index += 1) {
        const token = argv[index];
        const next = () => argv[++index] || '';
        if (token === '--dataset') args.dataset = normalizeText(next(), 's').toLowerCase();
        else if (token === '--data-path') args.dataPath = path.resolve(next());
        else if (token === '--output-dir') args.outputDir = path.resolve(next());
        else if (token === '--run-id') args.runId = safeSegment(next(), generatedRunId);
        else if (token === '--workers') args.workers = Math.max(1, Number(next()) || 10);
        else if (token === '--limit') args.limit = Math.max(0, Number(next()) || 0);
        else if (token === '--offset') args.offset = Math.max(0, Number(next()) || 0);
        else if (token === '--question-ids') {
            args.questionIds = next().split(',')
                .map((entry) => normalizeText(entry))
                .filter(Boolean);
        }
        else if (token === '--max-worker-retries') {
            args.maxWorkerRetries = Math.max(0, Number(next()) || 0);
        } else if (token === '--profile-curation') {
            args.profileCuration = normalizeText(next(), 'drain').toLowerCase();
        } else if (token === '--cognition-curation') {
            args.cognitionCuration = normalizeText(next(), 'auto').toLowerCase();
        } else if (token === '--memory-strategy') {
            args.memoryStrategy = normalizeText(next(), 'bm25_phrase_v1');
        } else if (token === '--memory-local-embeddings') {
            args.localMemoryEmbeddings = 'on';
        } else if (token === '--no-memory-local-embeddings') {
            args.localMemoryEmbeddings = 'off';
        } else if (token === '--memory-embedding-model') {
            args.memoryEmbeddingModel = normalizeText(next());
        } else if (token === '--memory-embedding-revision') {
            args.memoryEmbeddingRevision = normalizeText(next());
        } else if (token === '--memory-reranker-model') {
            args.memoryRerankerModel = normalizeText(next());
        } else if (token === '--memory-reranker-revision') {
            args.memoryRerankerRevision = normalizeText(next());
        } else if (token === '--memory-model-endpoint') {
            args.memoryModelEndpoint = normalizeText(next());
        } else if (token === '--memory-model-cache-dir') {
            args.memoryModelCacheDir = path.resolve(next());
        } else if (token === '--memory-models-offline') {
            args.memoryModelsOffline = true;
        } else if (token === '--memory-models-online') {
            args.memoryModelsOffline = false;
        } else if (token === '--allow-dense-fallback') {
            args.allowDenseFallback = true;
        } else if (token === '--resume-question-state') {
            args.resumeQuestionState = true;
        } else if (token === '--restart-question-state') {
            args.resumeQuestionState = false;
        } else if (token === '--timeout-ms') {
            args.timeoutMs = Math.max(1000, Number(next()) || 0);
        } else if (token === '--hindsight-ready-timeout-ms') {
            args.hindsightReadyTimeoutMs = Math.max(
                180_000,
                Number(next()) || 900_000
            );
        } else if (token === '--provider') args.provider = normalizeText(next());
        else if (token === '--base-url') args.baseUrl = normalizeText(next());
        else if (token === '--model') args.model = normalizeText(next());
        else if (token === '--temperature') args.temperature = Number(next());
        else if (token === '--memory-llm-provider') args.memoryLlmProvider = normalizeText(next());
        else if (token === '--memory-llm-base-url') args.memoryLlmBaseUrl = normalizeText(next());
        else if (token === '--memory-llm-model') args.memoryLlmModel = normalizeText(next());
        else if (token === '--memory-llm-temperature') args.memoryLlmTemperature = Number(next());
        else if (token === '--memory-llm-timeout-ms') {
            args.memoryLlmTimeoutMs = Math.max(1000, Number(next()) || 0);
        }
        else if (token === '--discard-state') args.keepState = false;
        else if (token === '--keep-state') args.keepState = true;
        else if (token === '--prepare-only') args.prepareOnly = true;
        else if (token === '--progress-interval-ms') {
            args.progressIntervalMs = Math.max(1000, Number(next()) || 15000);
        } else if (token === '--worker-start-stagger-ms') {
            args.workerStartStaggerMs = Math.max(0, Number(next()) || 0);
        } else if (token === '--help' || token === '-h') args.help = true;
        else throw new Error(`Unknown argument: ${token}`);
    }
    if (!Object.hasOwn(DATASET_PATHS, args.dataset) && !args.dataPath) {
        throw new Error(`Unsupported dataset "${args.dataset}". Use s, oracle, or --data-path.`);
    }
    if (!['off', 'end', 'drain'].includes(args.profileCuration)) {
        throw new Error('--profile-curation must be "off", "end", or "drain"');
    }
    if (!['auto', 'off', 'end', 'drain'].includes(args.cognitionCuration)) {
        throw new Error('--cognition-curation must be "auto", "off", "end", or "drain"');
    }
    args.memoryStrategy = resolveMemoryStrategy(args.memoryStrategy, '');
    if (!args.memoryStrategy) {
        throw new Error('Unknown --memory-strategy value');
    }
    args.workers = Math.min(Math.floor(args.workers), 64);
    args.questionIds = [...new Set(args.questionIds)];
    args.dataPath ||= DATASET_PATHS[args.dataset];
    args.outputDir ||= path.join(
        PROJECT_ROOT,
        'eval-results',
        'longmemeval-ailis',
        args.runId
    );
    return args;
}

async function warmMemoryEmbeddingIfNeeded(args) {
    const profile = MEMORY_STRATEGIES[args.memoryStrategy];
    if (
        profile?.requiresDense !== true ||
        args.localMemoryEmbeddings === 'off'
    ) {
        return {
            attempted: false,
            required: profile?.requiresDense === true,
            status: 'not_required'
        };
    }
    console.log(
        `[LongMemEval] warming local embedding model before ${args.workers} workers: ` +
        `${args.memoryEmbeddingModel || DEFAULT_EMBEDDING_MODEL}`
    );
    if (profile?.maturity === 'full') {
        const dense = new StrictDenseRuntime({
            enabled: true,
            model: args.memoryEmbeddingModel,
            revision: args.memoryEmbeddingRevision,
            allowRemoteModels: !args.memoryModelsOffline,
            remoteHost: args.memoryModelEndpoint,
            cacheDir: args.memoryModelCacheDir
        });
        await dense.embed([
            'query: AILIS memory embedding cache warmup',
            'passage: AILIS memory embedding cache warmup'
        ]);
        const status = {
            dense: dense.getStatus(),
            crossEncoder: null
        };
        if (profile.requiresReranker) {
            const crossEncoder = new StrictCrossEncoderRuntime({
                model: args.memoryRerankerModel,
                revision: args.memoryRerankerRevision,
                allowRemoteModels: !args.memoryModelsOffline,
                remoteHost: args.memoryModelEndpoint,
                cacheDir: args.memoryModelCacheDir
            });
            await crossEncoder.rerank(
                'AILIS memory reranker warmup',
                [{
                    document: {
                        id: 'warmup',
                        text: 'AILIS memory reranker warmup'
                    },
                    score: 1
                }],
                1
            );
            status.crossEncoder = crossEncoder.getStatus();
        }
        return {
            attempted: true,
            required: true,
            status: 'ready',
            runtime: status
        };
    }
    const runtime = new LocalEmbeddingRuntime({
        enabled: true,
        model: args.memoryEmbeddingModel,
        revision: args.memoryEmbeddingRevision,
        allowRemoteModels: !args.memoryModelsOffline,
        remoteHost: args.memoryModelEndpoint,
        cacheDir: args.memoryModelCacheDir
    });
    await runtime.embed([
        'query: AILIS memory embedding cache warmup',
        'passage: AILIS memory embedding cache warmup'
    ]);
    const status = runtime.getStatus();
    return {
        attempted: true,
        required: true,
        status: status.runtime === 'hashed_fallback' ? 'fallback' : 'ready',
        runtime: status
    };
}

export function assertDenseWarmup(profile, embeddingWarmup, {
    allowDenseFallback = false
} = {}) {
    if (
        profile?.requiresDense === true &&
        embeddingWarmup?.status !== 'ready' &&
        allowDenseFallback !== true
    ) {
        throw new Error(
            `Dense-memory fidelity gate failed for ${profile.id || 'unknown strategy'}: ` +
            `warmup status is ${embeddingWarmup?.status || 'missing'}. ` +
            `Use --allow-dense-fallback only for an explicit degraded ablation.`
        );
    }
    return true;
}

async function availablePort() {
    const server = net.createServer();
    server.unref();
    await new Promise((resolve, reject) => {
        server.once('error', reject);
        server.listen(0, '127.0.0.1', resolve);
    });
    const address = server.address();
    const port = typeof address === 'object' && address
        ? address.port
        : 0;
    await new Promise((resolve) => server.close(resolve));
    if (!port) {
        throw new Error('Could not reserve a port for the shared Hindsight daemon');
    }
    return port;
}

async function probeHindsight(baseUrl) {
    try {
        const response = await fetch(`${baseUrl.replace(/\/+$/, '')}/health`, {
            signal: AbortSignal.timeout(5_000)
        });
        return response.ok;
    } catch {
        return false;
    }
}

async function waitForHindsightHealth(baseUrl, timeoutMs) {
    const deadline = Date.now() + Math.max(1_000, Number(timeoutMs) || 0);
    while (Date.now() < deadline) {
        if (await probeHindsight(baseUrl)) {
            return true;
        }
        await new Promise((resolve) => setTimeout(resolve, 2_000));
    }
    return false;
}

async function prewarmOfficialHindsight(args) {
    const timeoutMs = args.hindsightReadyTimeoutMs;
    console.log(
        `[LongMemEval] prewarming official Hindsight Python environment ` +
        `(timeout ${timeoutMs}ms)`
    );
    const child = spawn(
        'uvx',
        ['hindsight-embed@0.8.6', '--help'],
        {
            cwd: PROJECT_ROOT,
            env: {
                ...process.env,
                ...officialHindsightEnvironment(args)
            },
            windowsHide: true,
            stdio: ['ignore', 'pipe', 'pipe']
        }
    );
    let output = '';
    const capture = (chunk) => {
        output = `${output}${chunk}`.slice(-20_000);
    };
    child.stdout?.on('data', capture);
    child.stderr?.on('data', capture);
    let timedOut = false;
    const timer = setTimeout(() => {
        timedOut = true;
        child.kill();
    }, timeoutMs);
    const [code, signal] = await once(child, 'exit');
    clearTimeout(timer);
    if (timedOut) {
        throw new Error(
            `Official Hindsight environment prewarm exceeded ${timeoutMs}ms`
        );
    }
    if (code !== 0) {
        throw new Error(
            `Official Hindsight environment prewarm failed ` +
            `(code=${code}, signal=${signal || 'none'}): ${output.trim()}`
        );
    }
}

export function officialHindsightEnvironment(args) {
    const passThrough = Object.fromEntries(
        Object.entries(process.env).filter(([key, value]) =>
            (/^(?:HINDSIGHT_|HF_|UV_)/.test(key) || key === 'CODEX_HOME') &&
            normalizeText(value)
        )
    );
    const environment = {
        ...passThrough,
        UV_PYTHON:
            normalizeText(process.env.UV_PYTHON) ||
            normalizeText(process.env.AILIS_HINDSIGHT_PYTHON) ||
            '3.12',
        UV_INDEX_URL:
            normalizeText(process.env.UV_INDEX_URL) ||
            normalizeText(process.env.AILIS_HINDSIGHT_PYPI_INDEX),
        CODEX_HOME: normalizeText(process.env.CODEX_HOME),
        HF_ENDPOINT:
            normalizeText(process.env.HF_ENDPOINT) ||
            normalizeText(args.memoryModelEndpoint),
        HF_HUB_DISABLE_XET:
            normalizeText(process.env.HF_HUB_DISABLE_XET) ||
            (
                normalizeText(process.env.HF_ENDPOINT) ||
                normalizeText(args.memoryModelEndpoint)
                    ? '1'
                    : ''
            ),
        HINDSIGHT_API_LLM_PROVIDER:
            normalizeText(process.env.HINDSIGHT_API_LLM_PROVIDER) ||
            'openai-codex',
        HINDSIGHT_API_LLM_MODEL:
            normalizeText(process.env.HINDSIGHT_API_LLM_MODEL) ||
            normalizeText(process.env.AILIS_HINDSIGHT_MODEL) ||
            'gpt-5.4-mini',
        HINDSIGHT_API_EMBEDDINGS_PROVIDER:
            normalizeText(process.env.HINDSIGHT_API_EMBEDDINGS_PROVIDER) ||
            'local',
        HINDSIGHT_API_RERANKER_PROVIDER:
            normalizeText(process.env.HINDSIGHT_API_RERANKER_PROVIDER) ||
            'local',
        HINDSIGHT_EMBED_DAEMON_IDLE_TIMEOUT: '0'
    };
    return Object.fromEntries(
        Object.entries(environment).filter(([, value]) => normalizeText(value))
    );
}

async function startSharedHindsightIfNeeded(args) {
    if (args.prepareOnly || args.memoryStrategy !== 'hindsight_official_v1') {
        return null;
    }
    const configuredUrl = normalizeText(
        process.env.AILIS_HINDSIGHT_URL ||
        process.env.HINDSIGHT_API_URL
    );
    if (configuredUrl) {
        if (!await probeHindsight(configuredUrl)) {
            throw new Error(
                `Configured shared Hindsight backend is unhealthy: ${configuredUrl}`
            );
        }
        args.workerEnvironment = {
            ...(args.workerEnvironment || {}),
            AILIS_HINDSIGHT_URL: configuredUrl,
            AILIS_HINDSIGHT_AUTOSTART: 'false'
        };
        return {
            owned: false,
            baseUrl: configuredUrl,
            profile: 'external',
            async stop() {}
        };
    }
    await prewarmOfficialHindsight(args);
    const { HindsightServer } = await import('@vectorize-io/hindsight-all');
    const port = await availablePort();
    const profile = safeSegment(`ailis-lme-${args.runId}`, 'ailis-longmemeval');
    const server = new HindsightServer({
        profile,
        host: '127.0.0.1',
        port,
        embedVersion: '0.8.6',
        env: officialHindsightEnvironment(args),
        readyTimeoutMs: args.hindsightReadyTimeoutMs,
        readyPollIntervalMs: 1_000
    });
    console.log(
        `[LongMemEval] starting one shared official Hindsight daemon for ` +
        `${args.workers} workers on port ${port}`
    );
    const baseUrl = server.getBaseUrl();
    let startError = null;
    try {
        await server.start();
    } catch (error) {
        startError = error;
        console.warn(
            `[LongMemEval] Hindsight CLI start returned before stable health; ` +
            `continuing health probes at ${baseUrl}`
        );
    }
    if (!await waitForHindsightHealth(
        baseUrl,
        startError ? args.hindsightReadyTimeoutMs : 10_000
    )) {
        await server.stop().catch(() => {});
        throw startError || new Error(
            `Shared Hindsight daemon is unhealthy after start: ${baseUrl}`
        );
    }
    args.workerEnvironment = {
        ...(args.workerEnvironment || {}),
        AILIS_HINDSIGHT_URL: baseUrl,
        AILIS_HINDSIGHT_AUTOSTART: 'false'
    };
    return {
        owned: true,
        baseUrl,
        profile,
        async stop() {
            await server.stop();
        }
    };
}

function printHelp() {
    console.log([
        'AILIS LongMemEval isolated multi-process orchestrator',
        '',
        'Usage:',
        '  node scripts/run-ailis-longmemeval-parallel.mjs [options]',
        '',
        'Options:',
        '  --dataset s|oracle          Dataset alias (default: s)',
        '  --data-path PATH            Custom LongMemEval JSON array',
        '  --workers N                 Independent worker processes (default: 10)',
        '  --run-id ID                 Evaluation run id',
        '  --output-dir PATH           Root output directory',
        '  --limit N                   Select at most N questions',
        '  --offset N                  Skip N source questions before sharding',
        '  --question-ids IDS          Select explicit comma-separated question IDs',
        '  --max-worker-retries N      Retry rounds for incomplete shards (default: 2)',
        '  --worker-start-stagger-ms N Delay worker starts to reduce synchronized memory peaks',
        '  --profile-curation MODE     off, end, or drain (default: drain)',
        '  --memory-strategy ID        Select an AILIS memory strategy for every worker',
        '  --cognition-curation MODE   auto (default), off, end, or drain',
        '  --memory-local-embeddings   Enable local multilingual dense retrieval',
        '  --no-memory-local-embeddings Disable dense model loading',
        '  --memory-embedding-model ID Override the local embedding model',
        '  --memory-embedding-revision SHA Pin the embedding model revision',
        '  --memory-reranker-model ID  Override the cross-encoder model',
        '  --memory-reranker-revision SHA Pin the cross-encoder revision',
        '  --memory-model-endpoint URL Hugging Face-compatible model host',
        '  --memory-model-cache-dir PATH Persistent transformers model cache',
        '  --memory-models-offline     Require all worker models to load from cache',
        '  --memory-models-online      Permit model downloads (default)',
        '  --allow-dense-fallback      Explicitly permit a degraded dense ablation',
        '  --resume-question-state     Resume incomplete per-question state (default)',
        '  --restart-question-state    Delete incomplete state before worker retry',
        '  --hindsight-ready-timeout-ms N  Official environment/readiness timeout (default: 900000)',
        '  --memory-llm-provider NAME  Dedicated provider for memory extraction/planning',
        '  --memory-llm-base-url URL   Dedicated memory-model endpoint',
        '  --memory-llm-model NAME     Dedicated memory-model id',
        '  --memory-llm-timeout-ms N   Memory extraction/planning timeout',
        '  --prepare-only              Build immutable shards without starting workers',
        '  --discard-state             Remove per-question native AILIS state',
        '',
        'Each process has a separate shard, result log, hypothesis file, and native AILIS state.'
    ].join('\n'));
}

async function writeJsonAtomic(filePath, value) {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    const temporaryPath = `${filePath}.${process.pid}.tmp`;
    await fs.writeFile(temporaryPath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
    try {
        await fs.rename(temporaryPath, filePath);
    } catch (error) {
        if (!['EEXIST', 'EPERM'].includes(error?.code)) throw error;
        await fs.rm(filePath, { force: true });
        await fs.rename(temporaryPath, filePath);
    }
}

async function writeStreamChunk(stream, chunk) {
    if (stream.write(chunk)) return;
    await once(stream, 'drain');
}

async function closeWriteStream(stream, suffix = '') {
    await new Promise((resolve, reject) => {
        stream.once('error', reject);
        stream.end(suffix, 'utf8', resolve);
    });
}

function shardPaths(outputDir, workerCount) {
    const dataRoot = path.join(outputDir, 'shards', 'data');
    return Array.from({ length: workerCount }, (_, index) => (
        path.join(dataRoot, `${workerName(index)}.json`)
    ));
}

function shardManifestMatches(manifest, args, sourceStat, paths) {
    return manifest?.version === 1 &&
        path.resolve(manifest.source?.path || '') === path.resolve(args.dataPath) &&
        Number(manifest.source?.size) === Number(sourceStat.size) &&
        Number(manifest.source?.mtimeMs) === Number(sourceStat.mtimeMs) &&
        manifest.workerCount === args.workers &&
        manifest.limit === args.limit &&
        manifest.offset === args.offset &&
        JSON.stringify(manifest.questionIds || []) ===
            JSON.stringify(args.questionIds || []) &&
        Array.isArray(manifest.entries) &&
        paths.every((filePath) => fsSync.existsSync(filePath));
}

export async function prepareLongMemEvalShards(args) {
    const manifestPath = path.join(args.outputDir, 'shards', 'manifest.json');
    const paths = shardPaths(args.outputDir, args.workers);
    const sourceStat = await fs.stat(args.dataPath);
    try {
        const existing = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
        if (shardManifestMatches(existing, args, sourceStat, paths)) {
            return { ...existing, manifestPath, reused: true };
        }
    } catch {}

    await fs.mkdir(path.dirname(paths[0]), { recursive: true });
    const streams = paths.map((filePath) => fsSync.createWriteStream(filePath, {
        encoding: 'utf8',
        flags: 'w'
    }));
    await Promise.all(streams.map((stream) => writeStreamChunk(stream, '[\n')));
    const counts = Array(args.workers).fill(0);
    const entries = [];
    const requestedQuestionIds = [...new Set(args.questionIds || [])];
    const requestedQuestionIdSet = new Set(requestedQuestionIds);
    const matchedQuestionIds = new Set();
    let sourceIndex = 0;
    let candidateIndex = 0;
    let selectedIndex = 0;
    try {
        for await (const entry of readJsonArrayEntries(args.dataPath)) {
            const currentSourceIndex = sourceIndex;
            sourceIndex += 1;
            const questionId = normalizeText(entry?.question_id);
            if (
                requestedQuestionIdSet.size &&
                !requestedQuestionIdSet.has(questionId)
            ) {
                continue;
            }
            if (requestedQuestionIdSet.size) {
                matchedQuestionIds.add(questionId);
            }
            const currentCandidateIndex = candidateIndex;
            candidateIndex += 1;
            if (currentCandidateIndex < args.offset) continue;
            if (args.limit && selectedIndex >= args.limit) break;
            const index = selectedIndex % args.workers;
            const prefix = counts[index] ? ',\n' : '';
            await writeStreamChunk(streams[index], `${prefix}${JSON.stringify(entry)}`);
            counts[index] += 1;
            entries.push({
                order: selectedIndex,
                sourceIndex: currentSourceIndex,
                question_id: questionId,
                question_type: entry.question_type,
                worker: index
            });
            selectedIndex += 1;
        }
        await Promise.all(streams.map((stream) => closeWriteStream(stream, '\n]\n')));
    } catch (error) {
        streams.forEach((stream) => stream.destroy());
        throw error;
    }
    const missingQuestionIds = requestedQuestionIds.filter(
        (questionId) => !matchedQuestionIds.has(questionId)
    );
    if (missingQuestionIds.length) {
        throw new Error(
            `LongMemEval question IDs not found: ${missingQuestionIds.join(', ')}`
        );
    }
    if (!entries.length) {
        throw new Error('No LongMemEval entries were selected for sharding');
    }
    if (entries.length < args.workers) {
        throw new Error(
            `Selected ${entries.length} questions, fewer than requested workers (${args.workers})`
        );
    }
    const manifest = {
        version: 1,
        benchmark: 'LongMemEval',
        createdAt: new Date().toISOString(),
        source: {
            path: args.dataPath,
            size: sourceStat.size,
            mtimeMs: sourceStat.mtimeMs
        },
        workerCount: args.workers,
        limit: args.limit,
        offset: args.offset,
        questionIds: requestedQuestionIds,
        selectedCount: entries.length,
        counts,
        shardPaths: paths,
        entries
    };
    await writeJsonAtomic(manifestPath, manifest);
    return { ...manifest, manifestPath, reused: false };
}

export async function readLatestJsonLines(filePath, key = 'question_id') {
    const latest = new Map();
    if (!fsSync.existsSync(filePath)) return latest;
    const text = await fs.readFile(filePath, 'utf8');
    for (const line of text.split(/\r?\n/)) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        try {
            const value = JSON.parse(trimmed);
            if (normalizeText(value?.[key])) {
                latest.set(value[key], value);
            }
        } catch {}
    }
    return latest;
}

async function inspectWorkerProgress(args, shardManifest, workerIndex) {
    const name = workerName(workerIndex);
    const outputDir = path.join(args.outputDir, 'shards', name);
    const assignedIds = shardManifest.entries
        .filter((entry) => entry.worker === workerIndex)
        .map((entry) => entry.question_id);
    const latest = await readLatestJsonLines(path.join(outputDir, 'results.jsonl'));
    const completed = assignedIds.filter((id) => latest.get(id)?.completed === true);
    const pending = assignedIds.filter((id) => latest.get(id)?.completed !== true);
    const failed = pending.filter((id) => latest.has(id));
    return {
        worker: workerIndex,
        name,
        outputDir,
        assigned: assignedIds.length,
        recorded: assignedIds.filter((id) => latest.has(id)).length,
        completed: completed.length,
        failed: failed.length,
        pending: pending.length,
        pendingQuestionIds: pending
    };
}

function buildWorkerArgs(args, shardManifest, workerIndex) {
    const name = workerName(workerIndex);
    const outputDir = path.join(args.outputDir, 'shards', name);
    const workerArgs = [
        WORKER_RUNNER_PATH,
        '--dataset', args.dataset,
        '--data-path', shardManifest.shardPaths[workerIndex],
        '--output-dir', outputDir,
        '--run-id', `${args.runId}-${name}`,
        '--profile-curation', args.profileCuration,
        '--cognition-curation', args.cognitionCuration,
        '--memory-strategy', args.memoryStrategy,
        '--progress-every', '1',
        args.keepState ? '--keep-state' : '--discard-state'
    ];
    if (args.localMemoryEmbeddings === 'on') workerArgs.push('--memory-local-embeddings');
    if (args.localMemoryEmbeddings === 'off') workerArgs.push('--no-memory-local-embeddings');
    if (args.memoryEmbeddingModel) {
        workerArgs.push('--memory-embedding-model', args.memoryEmbeddingModel);
    }
    if (args.memoryEmbeddingRevision) {
        workerArgs.push('--memory-embedding-revision', args.memoryEmbeddingRevision);
    }
    if (args.memoryRerankerModel) {
        workerArgs.push('--memory-reranker-model', args.memoryRerankerModel);
    }
    if (args.memoryRerankerRevision) {
        workerArgs.push('--memory-reranker-revision', args.memoryRerankerRevision);
    }
    if (args.memoryModelEndpoint) {
        workerArgs.push('--memory-model-endpoint', args.memoryModelEndpoint);
    }
    if (args.memoryModelCacheDir) {
        workerArgs.push('--memory-model-cache-dir', args.memoryModelCacheDir);
    }
    workerArgs.push(args.memoryModelsOffline
        ? '--memory-models-offline'
        : '--memory-models-online');
    workerArgs.push(args.resumeQuestionState
        ? '--resume-question-state'
        : '--restart-question-state');
    if (args.timeoutMs) workerArgs.push('--timeout-ms', String(args.timeoutMs));
    if (args.provider) workerArgs.push('--provider', args.provider);
    if (args.baseUrl) workerArgs.push('--base-url', args.baseUrl);
    if (args.model) workerArgs.push('--model', args.model);
    if (Number.isFinite(args.temperature)) {
        workerArgs.push('--temperature', String(args.temperature));
    }
    if (args.memoryLlmProvider) {
        workerArgs.push('--memory-llm-provider', args.memoryLlmProvider);
    }
    if (args.memoryLlmBaseUrl) {
        workerArgs.push('--memory-llm-base-url', args.memoryLlmBaseUrl);
    }
    if (args.memoryLlmModel) {
        workerArgs.push('--memory-llm-model', args.memoryLlmModel);
    }
    if (Number.isFinite(args.memoryLlmTemperature)) {
        workerArgs.push('--memory-llm-temperature', String(args.memoryLlmTemperature));
    }
    if (args.memoryLlmTimeoutMs) {
        workerArgs.push('--memory-llm-timeout-ms', String(args.memoryLlmTimeoutMs));
    }
    return { name, outputDir, workerArgs };
}

function startWorker(args, shardManifest, workerIndex, round) {
    const { name, outputDir, workerArgs } = buildWorkerArgs(args, shardManifest, workerIndex);
    fsSync.mkdirSync(path.join(args.outputDir, 'logs'), { recursive: true });
    fsSync.mkdirSync(outputDir, { recursive: true });
    const stdoutPath = path.join(args.outputDir, 'logs', `${name}.round-${round}.stdout.log`);
    const stderrPath = path.join(args.outputDir, 'logs', `${name}.round-${round}.stderr.log`);
    const stdoutFd = fsSync.openSync(stdoutPath, 'a');
    const stderrFd = fsSync.openSync(stderrPath, 'a');
    const child = spawn(process.execPath, workerArgs, {
        cwd: PROJECT_ROOT,
        windowsHide: true,
        env: {
            ...process.env,
            ...(args.workerEnvironment || {})
        },
        stdio: ['ignore', stdoutFd, stderrFd]
    });
    const completion = new Promise((resolve) => {
        child.once('error', (error) => resolve({
            worker: workerIndex,
            pid: child.pid || null,
            exitCode: null,
            signal: null,
            error: error?.message || String(error)
        }));
        child.once('exit', (exitCode, signal) => resolve({
            worker: workerIndex,
            pid: child.pid || null,
            exitCode,
            signal,
            error: ''
        }));
    }).finally(() => {
        fsSync.closeSync(stdoutFd);
        fsSync.closeSync(stderrFd);
    });
    return {
        worker: workerIndex,
        name,
        outputDir,
        pid: child.pid || null,
        child,
        completion,
        stdoutPath,
        stderrPath
    };
}

function createAggregate() {
    return {
        selected: 0,
        completed: 0,
        failed: 0,
        taskAgentViolationCount: 0,
        readOnlyViolationCount: 0,
        syntheticUserIsolationViolationCount: 0,
        profileDrainViolationCount: 0,
        cognitionDrainViolationCount: 0,
        retrievalAnswerableCount: 0,
        retrievalRecallAt8Sum: 0,
        retrievalTurnAnswerableCount: 0,
        retrievalTurnRecallAt8Sum: 0,
        byQuestionType: {}
    };
}

function updateAggregate(aggregate, result, profileCurationMode, cognitionCurationMode) {
    aggregate.selected += 1;
    aggregate.completed += result?.completed === true ? 1 : 0;
    aggregate.failed += result?.completed === true ? 0 : 1;
    aggregate.taskAgentViolationCount += result?.invariants?.taskAgentStepCount === 0 ? 0 : 1;
    aggregate.readOnlyViolationCount += result?.invariants?.questionTurnRecorded === false ? 0 : 1;
    aggregate.syntheticUserIsolationViolationCount += result?.syntheticUserIsolation?.ok === true ? 0 : 1;
    aggregate.profileDrainViolationCount += profileCurationMode !== 'drain' ||
        result?.profileCuration?.drained === true ? 0 : 1;
    aggregate.cognitionDrainViolationCount += cognitionCurationMode !== 'drain' ||
        result?.cognitionCuration?.drained === true ? 0 : 1;
    if (Number.isFinite(result?.retrieval?.evidenceSessionRecallAt8)) {
        aggregate.retrievalAnswerableCount += 1;
        aggregate.retrievalRecallAt8Sum += result.retrieval.evidenceSessionRecallAt8;
    }
    if (Number.isFinite(result?.retrieval?.evidenceTurnRecallAt8)) {
        aggregate.retrievalTurnAnswerableCount += 1;
        aggregate.retrievalTurnRecallAt8Sum += result.retrieval.evidenceTurnRecallAt8;
    }
    const type = normalizeText(result?.question_type, 'unknown');
    aggregate.byQuestionType[type] ||= { selected: 0, completed: 0 };
    aggregate.byQuestionType[type].selected += 1;
    aggregate.byQuestionType[type].completed += result?.completed === true ? 1 : 0;
}

function finalizeAggregate(aggregate, expectedCount) {
    return {
        expected: expectedCount,
        recorded: aggregate.selected,
        missing: Math.max(0, expectedCount - aggregate.selected),
        completed: aggregate.completed,
        failed: aggregate.failed,
        completionRate: expectedCount ? aggregate.completed / expectedCount : null,
        taskAgentViolationCount: aggregate.taskAgentViolationCount,
        readOnlyViolationCount: aggregate.readOnlyViolationCount,
        syntheticUserIsolationViolationCount: aggregate.syntheticUserIsolationViolationCount,
        profileDrainViolationCount: aggregate.profileDrainViolationCount,
        cognitionDrainViolationCount: aggregate.cognitionDrainViolationCount,
        nativeRetrievalSessionRecallAt8: aggregate.retrievalAnswerableCount
            ? aggregate.retrievalRecallAt8Sum / aggregate.retrievalAnswerableCount
            : null,
        retrievalAnswerableCount: aggregate.retrievalAnswerableCount,
        nativeRetrievalTurnRecallAt8: aggregate.retrievalTurnAnswerableCount
            ? aggregate.retrievalTurnRecallAt8Sum / aggregate.retrievalTurnAnswerableCount
            : null,
        retrievalTurnAnswerableCount: aggregate.retrievalTurnAnswerableCount,
        byQuestionType: aggregate.byQuestionType,
        officialQaAccuracy: null,
        officialQaAccuracyNote:
            'Run the official LongMemEval QA judge on hypotheses.jsonl after all questions complete.'
    };
}

export async function mergeLongMemEvalWorkerResults({
    args,
    shardManifest,
    finishedAt = new Date().toISOString()
}) {
    const workerLatest = await Promise.all(
        Array.from({ length: args.workers }, (_, index) => (
            readLatestJsonLines(
                path.join(args.outputDir, 'shards', workerName(index), 'results.jsonl')
            )
        ))
    );
    const orderedResults = [];
    const missingQuestionIds = [];
    for (const entry of shardManifest.entries) {
        const result = workerLatest[entry.worker].get(entry.question_id);
        if (result) orderedResults.push(result);
        else missingQuestionIds.push(entry.question_id);
    }
    const resultPath = path.join(args.outputDir, 'results.jsonl');
    const hypothesisPath = path.join(args.outputDir, 'hypotheses.jsonl');
    const summaryPath = path.join(args.outputDir, 'summary.json');
    const manifestPath = path.join(args.outputDir, 'manifest.json');
    await fs.writeFile(
        resultPath,
        orderedResults.length
            ? `${orderedResults.map((result) => JSON.stringify(result)).join('\n')}\n`
            : '',
        'utf8'
    );
    await fs.writeFile(
        hypothesisPath,
        orderedResults.length
            ? `${orderedResults.map((result) => JSON.stringify({
                question_id: result.question_id,
                hypothesis: result.hypothesis || ''
            })).join('\n')}\n`
            : '',
        'utf8'
    );
    const aggregate = createAggregate();
    orderedResults.forEach((result) => updateAggregate(
        aggregate,
        result,
        args.profileCuration,
        args.cognitionCuration
    ));
    const summary = {
        benchmark: 'LongMemEval',
        dataset: args.dataset,
        datasetPath: args.dataPath,
        runId: args.runId,
        finishedAt,
        parallelism: {
            processCount: args.workers,
            isolation: 'one immutable data shard, output directory, and native AILIS state root per process',
            merge: 'single orchestrator, latest result per question_id, original dataset order'
        },
        results: finalizeAggregate(aggregate, shardManifest.selectedCount),
        missingQuestionIds,
        artifacts: {
            manifestPath,
            shardManifestPath: shardManifest.manifestPath,
            resultPath,
            hypothesisPath,
            summaryPath,
            parallelStatusPath: path.join(args.outputDir, 'parallel-status.json')
        }
    };
    await writeJsonAtomic(summaryPath, summary);
    await writeJsonAtomic(manifestPath, {
        benchmark: 'LongMemEval',
        dataset: args.dataset,
        datasetPath: args.dataPath,
        runId: args.runId,
        workerCount: args.workers,
        generationIsolation: 'one isolated native AILIS memory state per question',
        processIsolation: 'no worker shares result, hypothesis, summary, or state files',
        syntheticUserIsolation:
            'default user, relationship, and project blocks cleared; AILIS Persona preserved',
        historyReplay:
            'original user/assistant turns through native MemoryRuntime and RawMemoryLedger',
        answerLeakagePolicy:
            'answer, has_answer, and answer_session_ids excluded from memory ingestion and generation prompt',
        shortTermMemoryAtQuestion: 'empty messageHistory',
        runtimeClockAtQuestion: 'LongMemEval question_date',
        profileCuration: args.profileCuration,
        cognitionCuration: args.cognitionCuration,
        memoryStrategy: args.memoryStrategy,
        memoryStrategyProfile: MEMORY_STRATEGIES[args.memoryStrategy],
        localMemoryEmbeddings: args.localMemoryEmbeddings,
        memoryEmbeddingModel: args.memoryEmbeddingModel || DEFAULT_EMBEDDING_MODEL,
        memoryEmbeddingRevision:
            args.memoryEmbeddingRevision || DEFAULT_EMBEDDING_REVISION,
        memoryRerankerModel: args.memoryRerankerModel || DEFAULT_RERANKER_MODEL,
        memoryRerankerRevision:
            args.memoryRerankerRevision || DEFAULT_RERANKER_REVISION,
        memoryModelEndpoint: args.memoryModelEndpoint || 'library default',
        memoryModelCacheDir: args.memoryModelCacheDir || 'library default',
        memoryModelsOffline: args.memoryModelsOffline,
        workerStartStaggerMs: args.workerStartStaggerMs,
        allowDenseFallback: args.allowDenseFallback,
        resumeQuestionState: args.resumeQuestionState,
        embeddingWarmup: args.embeddingWarmup || null,
        hindsightBackend: args.hindsightBackend || null,
        llm: {
            provider: args.provider || 'saved AILIS desktop provider',
            baseUrl: args.baseUrl || 'saved AILIS desktop endpoint',
            model: args.model || 'saved AILIS desktop model',
            timeoutMs: args.timeoutMs || 120000
        },
        memoryLlm: {
            provider: args.memoryLlmProvider || args.provider || 'same as answer LLM',
            baseUrl: args.memoryLlmBaseUrl || 'same as answer LLM',
            model: args.memoryLlmModel || 'same as answer LLM',
            timeoutMs: args.memoryLlmTimeoutMs || args.timeoutMs || 120000
        },
        taskAgent: 'disabled',
        memoryPolicyAtQuestion: 'read_only',
        mergePolicy: 'latest JSONL row per question_id in original source order',
        shardManifestPath: shardManifest.manifestPath,
        finishedAt
    });
    return summary;
}

async function runRound({ args, shardManifest, workerIndexes, round, status, statusPath }) {
    const running = [];
    for (let index = 0; index < workerIndexes.length; index += 1) {
        running.push(startWorker(args, shardManifest, workerIndexes[index], round));
        if (args.workerStartStaggerMs > 0 && index < workerIndexes.length - 1) {
            await new Promise((resolve) => setTimeout(resolve, args.workerStartStaggerMs));
        }
    }
    const liveChildren = new Map(running.map((worker) => [worker.worker, worker.child]));
    const stopChildren = (signal = 'SIGTERM') => {
        for (const child of liveChildren.values()) {
            if (!child.killed) child.kill(signal);
        }
    };
    const onSigint = () => stopChildren('SIGINT');
    const onSigterm = () => stopChildren('SIGTERM');
    process.once('SIGINT', onSigint);
    process.once('SIGTERM', onSigterm);
    status.round = round;
    status.phase = 'running';
    status.activeWorkers = running.map((worker) => ({
        worker: worker.worker,
        name: worker.name,
        pid: worker.pid,
        stdoutPath: worker.stdoutPath,
        stderrPath: worker.stderrPath
    }));
    await writeJsonAtomic(statusPath, status);

    const refreshStatus = async () => {
        const progress = await Promise.all(
            Array.from({ length: args.workers }, (_, index) => (
                inspectWorkerProgress(args, shardManifest, index)
            ))
        );
        status.updatedAt = new Date().toISOString();
        status.progress = {
            assigned: progress.reduce((sum, item) => sum + item.assigned, 0),
            recorded: progress.reduce((sum, item) => sum + item.recorded, 0),
            completed: progress.reduce((sum, item) => sum + item.completed, 0),
            failed: progress.reduce((sum, item) => sum + item.failed, 0),
            pending: progress.reduce((sum, item) => sum + item.pending, 0)
        };
        status.workers = progress;
        await writeJsonAtomic(statusPath, status);
    };
    await refreshStatus();
    const monitor = setInterval(() => {
        refreshStatus().catch(() => {});
    }, args.progressIntervalMs);
    monitor.unref();
    const exits = await Promise.all(running.map(async (worker) => {
        const result = await worker.completion;
        liveChildren.delete(worker.worker);
        return result;
    }));
    clearInterval(monitor);
    process.removeListener('SIGINT', onSigint);
    process.removeListener('SIGTERM', onSigterm);
    status.rounds.push({
        round,
        startedWorkers: workerIndexes,
        finishedAt: new Date().toISOString(),
        exits
    });
    status.activeWorkers = [];
    await refreshStatus();
    return exits;
}

export async function runParallelEvaluation(args, shardManifest) {
    const statusPath = path.join(args.outputDir, 'parallel-status.json');
    const startedAt = new Date().toISOString();
    const status = {
        benchmark: 'LongMemEval',
        runId: args.runId,
        orchestratorPid: process.pid,
        startedAt,
        updatedAt: startedAt,
        phase: 'starting',
        requestedProcessCount: args.workers,
        workerStartStaggerMs: args.workerStartStaggerMs,
        profileCuration: args.profileCuration,
        cognitionCuration: args.cognitionCuration,
        memoryStrategy: args.memoryStrategy,
        memoryStrategyProfile: MEMORY_STRATEGIES[args.memoryStrategy],
        embeddingWarmup: args.embeddingWarmup || null,
        hindsightBackend: args.hindsightBackend || null,
        rounds: [],
        activeWorkers: [],
        workers: []
    };
    await writeJsonAtomic(statusPath, status);

    let pendingWorkers = Array.from({ length: args.workers }, (_, index) => index);
    for (let round = 1; pendingWorkers.length && round <= args.maxWorkerRetries + 1; round += 1) {
        await runRound({
            args,
            shardManifest,
            workerIndexes: pendingWorkers,
            round,
            status,
            statusPath
        });
        const progress = await Promise.all(
            Array.from({ length: args.workers }, (_, index) => (
                inspectWorkerProgress(args, shardManifest, index)
            ))
        );
        pendingWorkers = progress
            .filter((worker) => worker.pending > 0)
            .map((worker) => worker.worker);
    }

    status.phase = 'merging';
    status.updatedAt = new Date().toISOString();
    await writeJsonAtomic(statusPath, status);
    const summary = await mergeLongMemEvalWorkerResults({
        args,
        shardManifest,
        finishedAt: new Date().toISOString()
    });
    status.phase = summary.results.missing === 0 && summary.results.failed === 0
        ? 'completed'
        : 'completed_with_failures';
    status.finishedAt = new Date().toISOString();
    status.updatedAt = status.finishedAt;
    status.summaryPath = summary.artifacts.summaryPath;
    status.results = summary.results;
    await writeJsonAtomic(statusPath, status);
    return summary;
}

async function main() {
    const args = parseParallelArgs();
    if (args.help) {
        printHelp();
        return;
    }
    if (!fsSync.existsSync(args.dataPath)) {
        throw new Error(`LongMemEval dataset not found: ${args.dataPath}`);
    }
    const embeddingWarmup = await warmMemoryEmbeddingIfNeeded(args);
    assertDenseWarmup(
        MEMORY_STRATEGIES[args.memoryStrategy],
        embeddingWarmup,
        { allowDenseFallback: args.allowDenseFallback }
    );
    args.embeddingWarmup = embeddingWarmup;
    await fs.mkdir(args.outputDir, { recursive: true });
    const preparationStatusPath = path.join(args.outputDir, 'parallel-status.json');
    await writeJsonAtomic(preparationStatusPath, {
        benchmark: 'LongMemEval',
        runId: args.runId,
        orchestratorPid: process.pid,
        phase: 'preparing_shards',
        requestedProcessCount: args.workers,
        memoryStrategy: args.memoryStrategy,
        embeddingWarmup,
        startedAt: new Date().toISOString()
    });
    const shardManifest = await prepareLongMemEvalShards(args);
    if (args.prepareOnly) {
        await writeJsonAtomic(preparationStatusPath, {
            benchmark: 'LongMemEval',
            runId: args.runId,
            orchestratorPid: process.pid,
            phase: 'prepared',
            requestedProcessCount: args.workers,
            memoryStrategy: args.memoryStrategy,
            memoryStrategyProfile: MEMORY_STRATEGIES[args.memoryStrategy],
            modelConfiguration: {
                embeddingModel:
                    args.memoryEmbeddingModel || DEFAULT_EMBEDDING_MODEL,
                embeddingRevision:
                    args.memoryEmbeddingRevision || DEFAULT_EMBEDDING_REVISION,
                rerankerModel:
                    args.memoryRerankerModel || DEFAULT_RERANKER_MODEL,
                rerankerRevision:
                    args.memoryRerankerRevision || DEFAULT_RERANKER_REVISION,
                endpoint: args.memoryModelEndpoint || 'library default',
                cacheDir: args.memoryModelCacheDir || 'library default',
                offline: args.memoryModelsOffline
            },
            embeddingWarmup,
            selectedCount: shardManifest.selectedCount,
            shardCounts: shardManifest.counts,
            shardManifestPath: shardManifest.manifestPath,
            reused: shardManifest.reused,
            finishedAt: new Date().toISOString()
        });
        console.log(JSON.stringify({
            ok: true,
            status: 'prepared',
            outputDir: args.outputDir,
            memoryStrategy: args.memoryStrategy,
            embeddingWarmup,
            selectedCount: shardManifest.selectedCount,
            shardCounts: shardManifest.counts,
            shardManifestPath: shardManifest.manifestPath,
            reused: shardManifest.reused
        }, null, 2));
        return;
    }
    const hindsight = await startSharedHindsightIfNeeded(args);
    if (hindsight) {
        args.hindsightBackend = {
            owned: hindsight.owned,
            baseUrl: hindsight.baseUrl,
            profile: hindsight.profile
        };
    }
    try {
        const summary = await runParallelEvaluation(args, shardManifest);
        console.log(JSON.stringify(summary, null, 2));
        if (summary.results.missing || summary.results.failed) {
            process.exitCode = 1;
        }
    } finally {
        await hindsight?.stop?.().catch((error) => {
            console.warn(
                `[LongMemEval] failed to stop shared Hindsight daemon: ` +
                `${error?.message || error}`
            );
        });
    }
}

if (path.resolve(process.argv[1] || '') === fileURLToPath(import.meta.url)) {
    main().catch((error) => {
        console.error(error?.stack || error?.message || String(error));
        process.exitCode = 1;
    });
}
