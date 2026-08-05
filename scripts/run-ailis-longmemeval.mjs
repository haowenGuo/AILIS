import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import {
    answerLongMemEvalQuestion,
    buildRetrievalDiagnosticsAsync,
    ingestLongMemEvalHistory,
    isolateLongMemEvalSyntheticUser,
    parseLongMemEvalTimestamp,
    prepareLongMemEvalQuestionState,
    readJsonArrayEntries,
    runLongMemEvalCognitionCuration,
    runLongMemEvalProfileCuration,
    summarizeCognitionCuration,
    summarizeProfileCuration,
    validateLongMemEvalEntry,
    writeLongMemEvalIngestionCheckpoint
} from './ailis-longmemeval-runtime.mjs';

const require = createRequire(import.meta.url);
const { AILISGateway } = require('../electron/ailis-gateway.cjs');
const { callDesktopLlmProvider } = require('../electron/desktop-llm-provider.cjs');
const {
    MEMORY_STRATEGIES,
    resolveMemoryStrategy
} = require('../electron/ailis-memory-strategies.cjs');
const {
    DEFAULT_EMBEDDING_MODEL,
    DEFAULT_EMBEDDING_REVISION,
    DEFAULT_RERANKER_MODEL,
    DEFAULT_RERANKER_REVISION
} = require('../electron/ailis-memory-hybrid-full.cjs');
const {
    purgeHindsightOfficialBankForState
} = require('../electron/ailis-memory-hindsight-official.cjs');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const BENCHMARK_ROOT = path.join(
    PROJECT_ROOT,
    '.local',
    'benchmarks',
    'LongMemEval'
);
const DATASET_PATHS = Object.freeze({
    s: path.join(BENCHMARK_ROOT, 'data', 'longmemeval_s_cleaned.json'),
    oracle: path.join(BENCHMARK_ROOT, 'data', 'longmemeval_oracle.json')
});

function normalizeText(value, fallback = '') {
    if (typeof value !== 'string') {
        return fallback;
    }
    const text = value.trim();
    return text || fallback;
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

function parseArgs(argv = process.argv.slice(2)) {
    const runId = new Date().toISOString().replace(/[:.]/g, '-');
    const args = {
        dataset: 's',
        dataPath: '',
        outputDir: '',
        runId,
        limit: 0,
        offset: 0,
        questionId: '',
        questionIds: [],
        validateOnly: false,
        refreshDiagnosticsOnly: false,
        profileCuration: 'drain',
        cognitionCuration: 'auto',
        memoryStrategy:
            process.env.AILIS_MEMORY_STRATEGY ||
            'bm25_phrase_v1',
        localMemoryEmbeddings: 'auto',
        memoryEmbeddingModel:
            process.env.AILIS_MEMORY_EMBEDDING_MODEL ||
            '',
        memoryEmbeddingRevision:
            process.env.AILIS_MEMORY_EMBEDDING_REVISION ||
            '',
        memoryRerankerModel:
            process.env.AILIS_MEMORY_RERANKER_MODEL ||
            '',
        memoryRerankerRevision:
            process.env.AILIS_MEMORY_RERANKER_REVISION ||
            '',
        memoryModelEndpoint:
            process.env.AILIS_MEMORY_MODEL_ENDPOINT ||
            process.env.HF_ENDPOINT ||
            '',
        memoryModelCacheDir:
            process.env.AILIS_MEMORY_MODEL_CACHE ||
            process.env.TRANSFORMERS_CACHE ||
            '',
        memoryModelsOffline: environmentFlag('AILIS_MEMORY_MODELS_OFFLINE'),
        restartBeforeQuestion: true,
        resumeQuestionState: true,
        keepState: true,
        progressEvery: 1,
        transientRetries: 2,
        timeoutMs: Number(process.env.AILIS_LONGMEMEVAL_TIMEOUT_MS || 120000),
        provider:
            process.env.AILIS_LONGMEMEVAL_PROVIDER ||
            process.env.AILIS_CANDIDATE_LLM_PROVIDER ||
            process.env.AILIS_LLM_PROVIDER ||
            '',
        baseUrl:
            process.env.AILIS_LONGMEMEVAL_BASE_URL ||
            process.env.AILIS_CANDIDATE_LLM_BASE_URL ||
            process.env.AILIS_LLM_BASE_URL ||
            process.env.OPENAI_BASE_URL ||
            '',
        model:
            process.env.AILIS_LONGMEMEVAL_MODEL ||
            process.env.AILIS_CANDIDATE_LLM_MODEL ||
            process.env.AILIS_LLM_MODEL ||
            process.env.OPENAI_MODEL ||
            '',
        temperature: Number(process.env.AILIS_LONGMEMEVAL_TEMPERATURE ?? 0.1),
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
        )
    };
    for (let index = 0; index < argv.length; index += 1) {
        const token = argv[index];
        const next = () => argv[++index] || '';
        if (token === '--dataset') args.dataset = normalizeText(next(), 's').toLowerCase();
        else if (token === '--data-path') args.dataPath = path.resolve(next());
        else if (token === '--output-dir') args.outputDir = path.resolve(next());
        else if (token === '--run-id') args.runId = safeSegment(next(), runId);
        else if (token === '--limit') args.limit = Math.max(0, Number(next()) || 0);
        else if (token === '--offset') args.offset = Math.max(0, Number(next()) || 0);
        else if (token === '--question-id') args.questionId = normalizeText(next());
        else if (token === '--question-ids') {
            args.questionIds = next().split(',').map((entry) => normalizeText(entry)).filter(Boolean);
        }
        else if (token === '--validate-only') args.validateOnly = true;
        else if (token === '--refresh-diagnostics-only') args.refreshDiagnosticsOnly = true;
        else if (token === '--profile-curation') {
            args.profileCuration = normalizeText(next(), 'drain').toLowerCase();
        } else if (token === '--no-profile-curation') args.profileCuration = 'off';
        else if (token === '--cognition-curation') {
            args.cognitionCuration = normalizeText(next(), 'auto').toLowerCase();
        } else if (token === '--no-cognition-curation') args.cognitionCuration = 'off';
        else if (token === '--memory-strategy') args.memoryStrategy = normalizeText(next());
        else if (token === '--memory-local-embeddings') args.localMemoryEmbeddings = 'on';
        else if (token === '--no-memory-local-embeddings') args.localMemoryEmbeddings = 'off';
        else if (token === '--memory-embedding-model') {
            args.memoryEmbeddingModel = normalizeText(next());
        }
        else if (token === '--memory-embedding-revision') {
            args.memoryEmbeddingRevision = normalizeText(next());
        }
        else if (token === '--memory-reranker-model') {
            args.memoryRerankerModel = normalizeText(next());
        }
        else if (token === '--memory-reranker-revision') {
            args.memoryRerankerRevision = normalizeText(next());
        }
        else if (token === '--memory-model-endpoint') {
            args.memoryModelEndpoint = normalizeText(next());
        }
        else if (token === '--memory-model-cache-dir') {
            args.memoryModelCacheDir = path.resolve(next());
        }
        else if (token === '--memory-models-offline') args.memoryModelsOffline = true;
        else if (token === '--memory-models-online') args.memoryModelsOffline = false;
        else if (token === '--no-restart') args.restartBeforeQuestion = false;
        else if (token === '--restart') args.restartBeforeQuestion = true;
        else if (token === '--resume-question-state') args.resumeQuestionState = true;
        else if (token === '--restart-question-state') args.resumeQuestionState = false;
        else if (token === '--discard-state') args.keepState = false;
        else if (token === '--keep-state') args.keepState = true;
        else if (token === '--progress-every') {
            args.progressEvery = Math.max(1, Number(next()) || 1);
        } else if (token === '--transient-retries') {
            args.transientRetries = Math.max(0, Math.min(Number(next()) || 0, 10));
        } else if (token === '--timeout-ms') {
            args.timeoutMs = Math.max(1000, Number(next()) || args.timeoutMs);
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
        else if (token === '--help' || token === '-h') args.help = true;
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
    const memoryProfile = MEMORY_STRATEGIES[args.memoryStrategy];
    if (args.cognitionCuration === 'auto') {
        args.cognitionCuration = memoryProfile.requiresCognition ? 'drain' : 'off';
    }
    args.localMemoryEmbeddings = args.localMemoryEmbeddings === 'auto'
        ? memoryProfile.requiresDense
        : args.localMemoryEmbeddings === 'on';
    args.dataPath ||= DATASET_PATHS[args.dataset];
    if (args.questionId) {
        args.questionIds = [args.questionId];
    }
    args.questionIds = [...new Set(args.questionIds)];
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
        'AILIS native LongMemEval runner',
        '',
        'Usage:',
        '  node scripts/run-ailis-longmemeval.mjs [options]',
        '',
        'Options:',
        '  --dataset s|oracle          Dataset alias (default: s)',
        '  --data-path PATH            Custom LongMemEval JSON array',
        '  --limit N                   Evaluate at most N selected questions',
        '  --offset N                  Skip N dataset questions',
        '  --question-id ID            Evaluate one question',
        '  --question-ids ID1,ID2      Evaluate a comma-separated question set',
        '  --validate-only             Validate without memory ingestion or LLM calls',
        '  --refresh-diagnostics-only  Recompute retrieval metrics from an existing run state',
        '  --profile-curation MODE     off, end (one pass), or drain (default; native passes until caught up)',
        '  --memory-strategy ID        Select a verified, full, or explicitly named prototype strategy',
        '  --cognition-curation MODE   auto (default), off, end, or drain',
        '  --memory-local-embeddings   Enable local multilingual dense retrieval',
        '  --no-memory-local-embeddings Disable dense model loading',
        '  --memory-embedding-model ID Override the local embedding model',
        '  --memory-embedding-revision SHA Pin the embedding model revision',
        '  --memory-reranker-model ID  Override the cross-encoder model',
        '  --memory-reranker-revision SHA Pin the cross-encoder revision',
        '  --memory-model-endpoint URL Hugging Face-compatible model host',
        '  --memory-model-cache-dir PATH Persistent transformers model cache',
        '  --memory-models-offline     Require all models to load from cache',
        '  --memory-models-online      Permit model downloads (default)',
        '  --no-restart                Do not reconstruct AILIS before the question',
        '  --resume-question-state     Resume an incomplete isolated question state (default)',
        '  --restart-question-state    Delete incomplete state before retrying a question',
        '  --discard-state             Delete per-question native memory after recording results',
        '  --transient-retries N       Retry isolated state on Windows file-lock errors (default: 2)',
        '  --provider NAME             Override the saved desktop LLM provider',
        '  --base-url URL              Override the saved desktop LLM endpoint',
        '  --model NAME                Override the saved desktop LLM model',
        '  --timeout-ms N              Per-question AILIS timeout',
        '  --memory-llm-provider NAME  Optional dedicated provider for memory extraction/planning',
        '  --memory-llm-base-url URL   Optional dedicated memory-model endpoint',
        '  --memory-llm-model NAME     Optional dedicated memory-model id',
        '  --memory-llm-timeout-ms N   Memory extraction/planning timeout',
        '',
        'API keys are read from the AILIS desktop state or environment variables, never from CLI flags.'
    ].join('\n'));
}

function readDesktopPreferences() {
    const statePath = path.join(process.env.APPDATA || '', 'ailis', 'desktop-state.json');
    if (!statePath || !fsSync.existsSync(statePath)) {
        return {};
    }
    try {
        const state = JSON.parse(fsSync.readFileSync(statePath, 'utf8'));
        return state?.preferences && typeof state.preferences === 'object'
            ? state.preferences
            : {};
    } catch {
        return {};
    }
}

function activeSavedApiKey(preferences, provider) {
    const profiles = preferences?.llmApiKeyProfiles;
    const profile = profiles && typeof profiles === 'object' ? profiles[provider] : null;
    const keys = Array.isArray(profile?.keys) ? profile.keys : [];
    const active = keys.find((entry) => entry?.id === profile?.activeKeyId) || keys[0];
    return normalizeText(active?.value || preferences?.llmApiKey);
}

function environmentApiKey(provider) {
    const providerKey = normalizeText(provider).toLowerCase();
    const candidates = [
        process.env.AILIS_LONGMEMEVAL_API_KEY,
        process.env.AILIS_CANDIDATE_LLM_API_KEY,
        process.env.AILIS_LLM_API_KEY,
        providerKey === 'doubao' ? process.env.DOUBAO_API_KEY : '',
        providerKey === 'qwen' ? process.env.DASHSCOPE_API_KEY : '',
        providerKey === 'deepseek' ? process.env.DEEPSEEK_API_KEY : '',
        providerKey === 'anthropic' ? process.env.ANTHROPIC_API_KEY : '',
        providerKey === 'gemini' ? process.env.GEMINI_API_KEY : '',
        process.env.OPENAI_COMPATIBLE_API_KEY,
        process.env.OPENAI_API_KEY
    ];
    return candidates.map((value) => normalizeText(value)).find(Boolean) || '';
}

function resolveLlmSettings(args) {
    const preferences = readDesktopPreferences();
    const provider = normalizeText(args.provider || preferences.llmProvider, 'openai-compatible');
    return {
        provider,
        baseUrl: normalizeText(args.baseUrl || preferences.llmBaseUrl),
        model: normalizeText(args.model || preferences.llmModel),
        apiKey: environmentApiKey(provider) || activeSavedApiKey(preferences, provider),
        temperature: Number.isFinite(args.temperature) ? args.temperature : 0.1,
        timeoutMs: args.timeoutMs,
        reasoningEffort: normalizeText(preferences.llmReasoningEffort)
    };
}

function resolveMemoryLlmSettings(args, answerSettings) {
    const hasOverride = Boolean(
        args.memoryLlmProvider ||
        args.memoryLlmBaseUrl ||
        args.memoryLlmModel ||
        args.memoryLlmTimeoutMs ||
        Number.isFinite(args.memoryLlmTemperature)
    );
    if (!hasOverride) return answerSettings;

    const preferences = readDesktopPreferences();
    const provider = normalizeText(args.memoryLlmProvider, answerSettings.provider);
    const sameProvider = provider.toLowerCase() ===
        normalizeText(answerSettings.provider).toLowerCase();
    const apiKey = ['ollama', 'vllm', 'codex-model-bridge'].includes(provider.toLowerCase())
        ? ''
        : environmentApiKey(provider) || activeSavedApiKey(preferences, provider);
    return {
        provider,
        baseUrl: normalizeText(
            args.memoryLlmBaseUrl || (sameProvider ? answerSettings.baseUrl : '')
        ),
        model: normalizeText(
            args.memoryLlmModel || (sameProvider ? answerSettings.model : '')
        ),
        apiKey,
        temperature: Number.isFinite(args.memoryLlmTemperature)
            ? args.memoryLlmTemperature
            : 0,
        timeoutMs: args.memoryLlmTimeoutMs || answerSettings.timeoutMs,
        reasoningEffort: ''
    };
}

function publicLlmSettings(settings) {
    return {
        provider: settings.provider,
        model: settings.model,
        temperature: settings.temperature,
        timeoutMs: settings.timeoutMs,
        credentialConfigured: Boolean(settings.apiKey) ||
            ['ollama', 'vllm', 'codex-model-bridge'].includes(settings.provider)
    };
}

function createGateway({ stateDir, llmSettings, memoryLlmSettings, args }) {
    const memoryLlm = (payload) => callDesktopLlmProvider(memoryLlmSettings, payload || {});
    return new AILISGateway({
        host: '127.0.0.1',
        port: 0,
        projectRoot: PROJECT_ROOT,
        workspaceRoot: PROJECT_ROOT,
        auditDir: stateDir,
        profileCurationEnabled: false,
        profileCurationLlm: memoryLlm,
        memoryCognitionLlm: memoryLlm,
        memoryQueryPlannerLlm: memoryLlm,
        memoryStrategy: args.memoryStrategy,
        enableLocalMemoryEmbeddings: args.localMemoryEmbeddings,
        memoryEmbeddingModel: args.memoryEmbeddingModel,
        memoryEmbeddingRevision: args.memoryEmbeddingRevision,
        memoryRerankerModel: args.memoryRerankerModel,
        memoryRerankerRevision: args.memoryRerankerRevision,
        allowRemoteMemoryModels: !args.memoryModelsOffline,
        memoryModelRemoteHost: args.memoryModelEndpoint,
        memoryModelCacheDir: args.memoryModelCacheDir,
        getDefaultContext: () => ({
            llmSettings
        })
    });
}

async function readExistingResults(resultPath) {
    if (!fsSync.existsSync(resultPath)) {
        return new Map();
    }
    const text = await fs.readFile(resultPath, 'utf8');
    const byQuestionId = new Map();
    for (const line of text.split(/\r?\n/).map((entry) => entry.trim()).filter(Boolean)) {
        try {
            const entry = JSON.parse(line);
            if (entry?.question_id) {
                byQuestionId.set(entry.question_id, entry);
            }
        } catch {}
    }
    return byQuestionId;
}

async function appendJsonLine(filePath, value) {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.appendFile(filePath, `${JSON.stringify(value)}\n`, 'utf8');
}

function isTransientInfrastructureError(error) {
    return ['EPERM', 'EBUSY', 'EACCES'].includes(normalizeText(error?.code).toUpperCase());
}

async function waitForTransientRetry(attempt) {
    await new Promise((resolve) => setTimeout(resolve, Math.min(1000, 150 * attempt)));
}

function createAggregate() {
    return {
        selected: 0,
        completed: 0,
        failed: 0,
        answerable: 0,
        abstention: 0,
        profileCurationAttempted: 0,
        profileCurationSucceeded: 0,
        cognitionCurationAttempted: 0,
        cognitionCurationSucceeded: 0,
        taskAgentViolationCount: 0,
        readOnlyViolationCount: 0,
        retrievalAnswerableCount: 0,
        retrievalRecallAt8Sum: 0,
        retrievalTurnAnswerableCount: 0,
        retrievalTurnRecallAt8Sum: 0,
        byQuestionType: {}
    };
}

function updateAggregate(aggregate, result) {
    aggregate.selected += 1;
    aggregate.completed += result.completed ? 1 : 0;
    aggregate.failed += result.completed ? 0 : 1;
    aggregate.answerable += result.retrieval?.answerable ? 1 : 0;
    aggregate.abstention += result.retrieval?.answerable ? 0 : 1;
    aggregate.profileCurationAttempted += result.profileCuration?.attempted ? 1 : 0;
    aggregate.profileCurationSucceeded += result.profileCuration?.ok === true ? 1 : 0;
    aggregate.cognitionCurationAttempted += result.cognitionCuration?.attempted ? 1 : 0;
    aggregate.cognitionCurationSucceeded += result.cognitionCuration?.ok === true ? 1 : 0;
    aggregate.taskAgentViolationCount += result.invariants?.taskAgentStepCount === 0 ? 0 : 1;
    aggregate.readOnlyViolationCount += result.invariants?.questionTurnRecorded === false ? 0 : 1;
    if (Number.isFinite(result.retrieval?.evidenceSessionRecallAt8)) {
        aggregate.retrievalAnswerableCount += 1;
        aggregate.retrievalRecallAt8Sum += result.retrieval.evidenceSessionRecallAt8;
    }
    if (Number.isFinite(result.retrieval?.evidenceTurnRecallAt8)) {
        aggregate.retrievalTurnAnswerableCount += 1;
        aggregate.retrievalTurnRecallAt8Sum += result.retrieval.evidenceTurnRecallAt8;
    }
    const questionType = normalizeText(result.question_type, 'unknown');
    aggregate.byQuestionType[questionType] ||= {
        selected: 0,
        completed: 0,
        retrievalAnswerableCount: 0,
        retrievalRecallAt8Sum: 0,
        retrievalTurnAnswerableCount: 0,
        retrievalTurnRecallAt8Sum: 0
    };
    const bucket = aggregate.byQuestionType[questionType];
    bucket.selected += 1;
    bucket.completed += result.completed ? 1 : 0;
    if (Number.isFinite(result.retrieval?.evidenceSessionRecallAt8)) {
        bucket.retrievalAnswerableCount += 1;
        bucket.retrievalRecallAt8Sum += result.retrieval.evidenceSessionRecallAt8;
    }
    if (Number.isFinite(result.retrieval?.evidenceTurnRecallAt8)) {
        bucket.retrievalTurnAnswerableCount += 1;
        bucket.retrievalTurnRecallAt8Sum += result.retrieval.evidenceTurnRecallAt8;
    }
}

function finalizeAggregate(aggregate) {
    const byQuestionType = Object.fromEntries(
        Object.entries(aggregate.byQuestionType).map(([key, value]) => [
            key,
            {
                selected: value.selected,
                completed: value.completed,
                completionRate: value.selected ? value.completed / value.selected : null,
                nativeRetrievalSessionRecallAt8: value.retrievalAnswerableCount
                    ? value.retrievalRecallAt8Sum / value.retrievalAnswerableCount
                    : null,
                retrievalAnswerableCount: value.retrievalAnswerableCount,
                nativeRetrievalTurnRecallAt8: value.retrievalTurnAnswerableCount
                    ? value.retrievalTurnRecallAt8Sum / value.retrievalTurnAnswerableCount
                    : null,
                retrievalTurnAnswerableCount: value.retrievalTurnAnswerableCount
            }
        ])
    );
    return {
        selected: aggregate.selected,
        completed: aggregate.completed,
        failed: aggregate.failed,
        completionRate: aggregate.selected ? aggregate.completed / aggregate.selected : null,
        answerable: aggregate.answerable,
        abstention: aggregate.abstention,
        profileCurationAttempted: aggregate.profileCurationAttempted,
        profileCurationSucceeded: aggregate.profileCurationSucceeded,
        cognitionCurationAttempted: aggregate.cognitionCurationAttempted,
        cognitionCurationSucceeded: aggregate.cognitionCurationSucceeded,
        taskAgentViolationCount: aggregate.taskAgentViolationCount,
        readOnlyViolationCount: aggregate.readOnlyViolationCount,
        nativeRetrievalSessionRecallAt8: aggregate.retrievalAnswerableCount
            ? aggregate.retrievalRecallAt8Sum / aggregate.retrievalAnswerableCount
            : null,
        retrievalAnswerableCount: aggregate.retrievalAnswerableCount,
        nativeRetrievalTurnRecallAt8: aggregate.retrievalTurnAnswerableCount
            ? aggregate.retrievalTurnRecallAt8Sum / aggregate.retrievalTurnAnswerableCount
            : null,
        retrievalTurnAnswerableCount: aggregate.retrievalTurnAnswerableCount,
        byQuestionType,
        officialQaAccuracy: null,
        officialQaAccuracyNote:
            'Run LongMemEval official evaluate_qa.py on hypotheses.jsonl; reference answers were not used during generation.'
    };
}

function aggregateResults(resultsByQuestionId) {
    const aggregate = createAggregate();
    for (const result of resultsByQuestionId.values()) {
        updateAggregate(aggregate, result);
    }
    return aggregate;
}

async function writeOfficialHypotheses(filePath, resultsByQuestionId) {
    const lines = [...resultsByQuestionId.values()].map((result) => JSON.stringify({
        question_id: result.question_id,
        hypothesis: result.hypothesis || ''
    }));
    await fs.writeFile(filePath, lines.length ? `${lines.join('\n')}\n` : '', 'utf8');
}

async function validateDataset(args) {
    let count = 0;
    let selected = 0;
    let invalid = 0;
    let sessionCount = 0;
    let messageCount = 0;
    const questionTypes = {};
    const firstErrors = [];
    const requestedIds = new Set(args.questionIds);
    for await (const entry of readJsonArrayEntries(args.dataPath)) {
        const currentIndex = count;
        count += 1;
        if (requestedIds.size && !requestedIds.has(entry.question_id)) continue;
        if (!requestedIds.size && currentIndex < args.offset) continue;
        if (args.limit && selected >= args.limit) continue;
        selected += 1;
        const errors = validateLongMemEvalEntry(entry, currentIndex);
        if (errors.length) {
            invalid += 1;
            firstErrors.push(...errors.slice(0, Math.max(0, 20 - firstErrors.length)));
        }
        questionTypes[entry.question_type] = (questionTypes[entry.question_type] || 0) + 1;
        sessionCount += Array.isArray(entry.haystack_sessions) ? entry.haystack_sessions.length : 0;
        messageCount += Array.isArray(entry.haystack_sessions)
            ? entry.haystack_sessions.reduce(
                  (sum, session) => sum + (Array.isArray(session) ? session.length : 0),
                  0
              )
            : 0;
    }
    return {
        ok: invalid === 0 && (!requestedIds.size || selected === requestedIds.size),
        datasetPath: args.dataPath,
        totalDatasetEntries: count,
        selectedEntries: selected,
        invalidEntries: invalid,
        sessionCount,
        messageCount,
        averageSessions: selected ? sessionCount / selected : 0,
        averageMessages: selected ? messageCount / selected : 0,
        questionTypes,
        firstErrors
    };
}

async function evaluateEntry({ args, entry, llmSettings, memoryLlmSettings, stateDir }) {
    let gateway = null;
    try {
        const questionState = await prepareLongMemEvalQuestionState({
            stateDir,
            resume: args.resumeQuestionState,
            checkpointIdentity: {
                questionId: entry.question_id,
                datasetPath: args.dataPath,
                sessionIds: entry.haystack_session_ids
            },
            beforeReset: args.memoryStrategy === 'hindsight_official_v1'
                ? ({ stateDir: resetStateDir }) =>
                    purgeHindsightOfficialBankForState({
                        rootDir: path.join(resetStateDir, 'memory'),
                        baseUrl: process.env.AILIS_HINDSIGHT_URL
                    })
                : null
        });
        gateway = createGateway({ stateDir, llmSettings, memoryLlmSettings, args });
        let syntheticUserIsolation;
        if (questionState.ingestionCheckpoint) {
            syntheticUserIsolation = {
                ...questionState.ingestionCheckpoint.syntheticUserIsolation,
                resumedFromCheckpoint: true
            };
        } else {
            syntheticUserIsolation = isolateLongMemEvalSyntheticUser(gateway);
            if (!syntheticUserIsolation.ok) {
                throw new Error(
                    `LongMemEval synthetic-user isolation failed: ` +
                    `${syntheticUserIsolation.status}`
                );
            }
        }
        let ingestion;
        if (questionState.ingestionCheckpoint) {
            ingestion = {
                ...questionState.ingestionCheckpoint.ingestion,
                resumedFromCheckpoint: true
            };
        } else {
            ingestion = await ingestLongMemEvalHistory({ gateway, entry });
            await writeLongMemEvalIngestionCheckpoint({
                stateDir,
                identity: {
                    questionId: entry.question_id,
                    datasetPath: args.dataPath,
                    sessionIds: entry.haystack_session_ids
                },
                syntheticUserIsolation,
                ingestion
            });
        }
        const beforeCuration = gateway.getMemorySnapshot({ includeEvents: false })?.status || {};
        const profileCuration = await runLongMemEvalProfileCuration({
            gateway,
            mode: args.profileCuration,
            nowIso: parseLongMemEvalTimestamp(entry.question_date)
        });
        if (args.profileCuration === 'drain' && !profileCuration.drained) {
            throw new Error(
                `Native AILIS profile curation did not catch up: ` +
                `${profileCuration.status} after ${profileCuration.passCount} pass(es)`
            );
        }
        const cognitionCuration = await runLongMemEvalCognitionCuration({
            gateway,
            mode: args.cognitionCuration,
            nowIso: parseLongMemEvalTimestamp(entry.question_date),
            timeoutMs: args.memoryLlmTimeoutMs || memoryLlmSettings.timeoutMs
        });
        if (args.cognitionCuration === 'drain' && !cognitionCuration.drained) {
            throw new Error(
                `AILIS cognition curation did not catch up: ` +
                `${cognitionCuration.status} after ${cognitionCuration.passCount} pass(es)`
            );
        }

        if (args.restartBeforeQuestion) {
            await gateway.stop();
            gateway = createGateway({ stateDir, llmSettings, memoryLlmSettings, args });
        }

        const memoryBeforeQuestion = gateway.getMemorySnapshot({ includeEvents: false })?.status || {};
        const rawMemoryBeforeQuestion = gateway.getRawMemoryStatus();
        const retrieval = await buildRetrievalDiagnosticsAsync(gateway, entry);
        const answer = await answerLongMemEvalQuestion({
            gateway,
            entry,
            llmSettings,
            timeoutMs: args.timeoutMs
        });
        const memoryAfterQuestion = gateway.getMemorySnapshot({ includeEvents: false })?.status || {};
        const questionTurnRecorded =
            Number(memoryAfterQuestion.eventCount || 0) !== Number(memoryBeforeQuestion.eventCount || 0);
        const completed = answer.ok && Boolean(answer.hypothesis);

        return {
            question_id: entry.question_id,
            question_type: entry.question_type,
            completed,
            status: answer.status,
            hypothesis: answer.hypothesis,
            durationMs: answer.durationMs,
            syntheticUserIsolation,
            ingestion,
            profileCuration,
            cognitionCuration,
            memory: {
                beforeCurationEventCount: Number(beforeCuration.eventCount || 0),
                beforeQuestionEventCount: Number(memoryBeforeQuestion.eventCount || 0),
                afterQuestionEventCount: Number(memoryAfterQuestion.eventCount || 0),
                nativeMemoryVersion: normalizeText(memoryBeforeQuestion.version),
                strategy: normalizeText(memoryBeforeQuestion.memoryStrategy, args.memoryStrategy),
                strategyStatus: memoryBeforeQuestion.memoryStrategyStatus || null,
                rawEntryCount: Number(rawMemoryBeforeQuestion?.entryCount || 0),
                restartedBeforeQuestion: args.restartBeforeQuestion,
                resumedQuestionState: questionState.resumed,
                resumedIngestion: Boolean(questionState.ingestionCheckpoint)
            },
            retrieval,
            invariants: {
                shortTermMessageCount: 0,
                memoryPolicy: 'read_only',
                taskAgentDisabled: true,
                taskAgentStepCount: answer.taskAgentStepCount,
                questionTurnRecorded
            },
            model: {
                provider: answer.provider || llmSettings.provider,
                model: answer.model || llmSettings.model
            }
        };
    } finally {
        await gateway?.stop?.().catch(() => {});
    }
}

async function refreshExistingDiagnostics({
    args,
    llmSettings,
    memoryLlmSettings,
    resultsByQuestionId,
    resultPath,
    hypothesisPath,
    summaryPath,
    manifestPath,
    stateRoot,
    startedAt
}) {
    if (!resultsByQuestionId.size) {
        throw new Error(`No existing LongMemEval results found in ${args.outputDir}`);
    }
    const requestedIds = new Set(
        args.questionIds.length ? args.questionIds : [...resultsByQuestionId.keys()]
    );
    const refreshedIds = new Set();
    for await (const entry of readJsonArrayEntries(args.dataPath)) {
        if (!requestedIds.has(entry.question_id) || !resultsByQuestionId.has(entry.question_id)) {
            continue;
        }
        const stateDir = path.join(stateRoot, safeSegment(entry.question_id));
        if (!fsSync.existsSync(stateDir)) {
            throw new Error(`Missing native AILIS state for ${entry.question_id}: ${stateDir}`);
        }
        const gateway = createGateway({ stateDir, llmSettings, memoryLlmSettings, args });
        let retrieval;
        try {
            retrieval = await buildRetrievalDiagnosticsAsync(gateway, entry);
        } finally {
            await gateway.stop().catch(() => {});
        }
        const refreshed = {
            ...resultsByQuestionId.get(entry.question_id),
            retrieval,
            diagnosticsRefreshedAt: new Date().toISOString()
        };
        await appendJsonLine(resultPath, refreshed);
        resultsByQuestionId.set(entry.question_id, refreshed);
        refreshedIds.add(entry.question_id);
        if (refreshedIds.size === requestedIds.size) {
            break;
        }
    }
    const missingIds = [...requestedIds].filter((id) => !refreshedIds.has(id));
    if (missingIds.length) {
        throw new Error(`Could not refresh diagnostics for: ${missingIds.join(', ')}`);
    }
    await writeOfficialHypotheses(hypothesisPath, resultsByQuestionId);
    const finishedAt = new Date().toISOString();
    let existingManifest = {};
    try {
        existingManifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
    } catch {}
    await fs.writeFile(manifestPath, `${JSON.stringify({
        ...existingManifest,
        lastDiagnosticsRefreshAt: finishedAt
    }, null, 2)}\n`, 'utf8');
    const finalSummary = {
        benchmark: 'LongMemEval',
        dataset: args.dataset,
        datasetPath: args.dataPath,
        runId: args.runId,
        startedAt,
        finishedAt,
        diagnosticsOnly: true,
        diagnosticsRefreshed: refreshedIds.size,
        results: finalizeAggregate(aggregateResults(resultsByQuestionId)),
        artifacts: {
            manifestPath,
            resultPath,
            hypothesisPath,
            summaryPath,
            stateRoot
        }
    };
    await fs.writeFile(summaryPath, `${JSON.stringify(finalSummary, null, 2)}\n`, 'utf8');
    console.log(JSON.stringify(finalSummary, null, 2));
}

async function main() {
    const args = parseArgs();
    if (args.help) {
        printHelp();
        return;
    }
    if (!fsSync.existsSync(args.dataPath)) {
        throw new Error(`LongMemEval dataset not found: ${args.dataPath}`);
    }
    if (args.validateOnly) {
        const validation = await validateDataset(args);
        console.log(JSON.stringify(validation, null, 2));
        if (!validation.ok) process.exitCode = 1;
        return;
    }

    const llmSettings = resolveLlmSettings(args);
    const memoryLlmSettings = resolveMemoryLlmSettings(args, llmSettings);
    const resultPath = path.join(args.outputDir, 'results.jsonl');
    const hypothesisPath = path.join(args.outputDir, 'hypotheses.jsonl');
    const summaryPath = path.join(args.outputDir, 'summary.json');
    const manifestPath = path.join(args.outputDir, 'manifest.json');
    const stateRoot = path.join(args.outputDir, 'state');
    await fs.mkdir(args.outputDir, { recursive: true });
    const resultsByQuestionId = await readExistingResults(resultPath);
    const completedIds = new Set(
        [...resultsByQuestionId.values()]
            .filter((entry) => entry?.completed === true)
            .map((entry) => entry.question_id)
    );
    const startedAt = new Date().toISOString();
    if (args.refreshDiagnosticsOnly) {
        await refreshExistingDiagnostics({
            args,
            llmSettings,
            memoryLlmSettings,
            resultsByQuestionId,
            resultPath,
            hypothesisPath,
            summaryPath,
            manifestPath,
            stateRoot,
            startedAt
        });
        return;
    }
    await fs.writeFile(manifestPath, `${JSON.stringify({
        benchmark: 'LongMemEval',
        dataset: args.dataset,
        datasetPath: args.dataPath,
        startedAt,
        generationIsolation: 'one isolated native AILIS memory state per question',
        syntheticUserIsolation: 'default user, relationship, and project blocks cleared; persona preserved',
        historyReplay: 'original user/assistant turns through MemoryRuntime and RawMemoryLedger',
        answerLeakagePolicy: 'answer, has_answer, and answer_session_ids are excluded from ingestion and prompt construction',
        shortTermMemoryAtQuestion: 'empty messageHistory',
        runtimeClockAtQuestion: 'LongMemEval question_date via native runtimeEnvironmentOverride',
        taskAgent: 'disabled',
        memoryPolicyAtQuestion: 'read_only',
        restartBeforeQuestion: args.restartBeforeQuestion,
        resumeQuestionState: args.resumeQuestionState,
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
        diagnosticsOnly: args.refreshDiagnosticsOnly,
        keepState: args.keepState,
        llm: publicLlmSettings(llmSettings),
        memoryLlm: publicLlmSettings(memoryLlmSettings)
    }, null, 2)}\n`, 'utf8');

    let datasetIndex = 0;
    let selected = 0;
    let executed = 0;
    const requestedIds = new Set(args.questionIds);
    const matchedQuestionIds = new Set();
    for await (const entry of readJsonArrayEntries(args.dataPath)) {
        const currentIndex = datasetIndex;
        datasetIndex += 1;
        if (requestedIds.size) {
            if (!requestedIds.has(entry.question_id)) continue;
            matchedQuestionIds.add(entry.question_id);
        } else if (currentIndex < args.offset) {
            continue;
        }
        if (args.limit && selected >= args.limit) {
            break;
        }
        selected += 1;
        if (completedIds.has(entry.question_id)) {
            if (requestedIds.size && matchedQuestionIds.size === requestedIds.size) {
                break;
            }
            continue;
        }
        executed += 1;
        const errors = validateLongMemEvalEntry(entry, currentIndex);
        let result;
        if (errors.length) {
            result = {
                question_id: entry.question_id,
                question_type: entry.question_type,
                completed: false,
                status: 'invalid_dataset_entry',
                hypothesis: '',
                error: errors.slice(0, 10).join('; '),
                retrieval: {
                    answerable: Array.isArray(entry.answer_session_ids) &&
                        entry.answer_session_ids.length > 0,
                    evidenceSessionRecallAt8: null
                },
                profileCuration: summarizeProfileCuration(null),
                cognitionCuration: summarizeCognitionCuration(null),
                invariants: {
                    shortTermMessageCount: 0,
                    memoryPolicy: 'read_only',
                    taskAgentDisabled: true,
                    taskAgentStepCount: 0,
                    questionTurnRecorded: false
                }
            };
        } else {
            const stateDir = path.join(stateRoot, safeSegment(entry.question_id));
            let lastError = null;
            let attemptCount = 0;
            for (
                let attempt = 1;
                attempt <= args.transientRetries + 1;
                attempt += 1
            ) {
                attemptCount = attempt;
                try {
                    result = await evaluateEntry({
                        args,
                        entry,
                        llmSettings,
                        memoryLlmSettings,
                        stateDir
                    });
                    result.infrastructureAttemptCount = attempt;
                    lastError = null;
                    break;
                } catch (error) {
                    lastError = error;
                    if (
                        attempt > args.transientRetries ||
                        !isTransientInfrastructureError(error)
                    ) {
                        break;
                    }
                    await waitForTransientRetry(attempt);
                }
            }
            if (lastError) {
                result = {
                    question_id: entry.question_id,
                    question_type: entry.question_type,
                    completed: false,
                    status: 'runner_error',
                    hypothesis: '',
                    error: lastError?.message || String(lastError),
                    infrastructureAttemptCount: attemptCount,
                    retrieval: {
                        answerable: Array.isArray(entry.answer_session_ids) &&
                            entry.answer_session_ids.length > 0,
                        evidenceSessionRecallAt8: null
                    },
                    profileCuration: summarizeProfileCuration(null),
                    cognitionCuration: summarizeCognitionCuration(null),
                    invariants: {
                        shortTermMessageCount: 0,
                        memoryPolicy: 'read_only',
                        taskAgentDisabled: true,
                        taskAgentStepCount: 0,
                        questionTurnRecorded: false
                    }
                };
            }
            if (!args.keepState) {
                await fs.rm(stateDir, { recursive: true, force: true });
            }
        }

        await appendJsonLine(resultPath, result);
        resultsByQuestionId.set(result.question_id, result);
        await writeOfficialHypotheses(hypothesisPath, resultsByQuestionId);
        const aggregate = aggregateResults(resultsByQuestionId);
        const summary = {
            benchmark: 'LongMemEval',
            dataset: args.dataset,
            datasetPath: args.dataPath,
            runId: args.runId,
            startedAt,
            updatedAt: new Date().toISOString(),
            finishedAt: null,
            results: finalizeAggregate(aggregate),
            artifacts: {
                manifestPath,
                resultPath,
                hypothesisPath,
                stateRoot: args.keepState ? stateRoot : null
            }
        };
        await fs.writeFile(summaryPath, `${JSON.stringify(summary, null, 2)}\n`, 'utf8');
        if (executed % args.progressEvery === 0) {
            console.log(
                `[LongMemEval] ${executed}/${args.limit || '?'} ` +
                `${result.question_id} status=${result.status} ` +
                `events=${result.memory?.beforeQuestionEventCount ?? 0} ` +
                `retrieval@8=${result.retrieval?.evidenceSessionRecallAt8 ?? 'n/a'}`
            );
        }
        if (requestedIds.size && matchedQuestionIds.size === requestedIds.size) {
            break;
        }
    }
    const missingQuestionIds = [...requestedIds].filter((id) => !matchedQuestionIds.has(id));
    if (missingQuestionIds.length) {
        throw new Error(`Question id(s) not found: ${missingQuestionIds.join(', ')}`);
    }
    const finishedAt = new Date().toISOString();
    const aggregate = aggregateResults(resultsByQuestionId);
    const finalSummary = {
        benchmark: 'LongMemEval',
        dataset: args.dataset,
        datasetPath: args.dataPath,
        runId: args.runId,
        startedAt,
        finishedAt,
        selectedThisInvocation: selected,
        executedThisInvocation: executed,
        skippedCompleted: selected - executed,
        results: finalizeAggregate(aggregate),
        artifacts: {
            manifestPath,
            resultPath,
            hypothesisPath,
            summaryPath,
            stateRoot: args.keepState ? stateRoot : null
        }
    };
    await fs.writeFile(summaryPath, `${JSON.stringify(finalSummary, null, 2)}\n`, 'utf8');
    console.log(JSON.stringify(finalSummary, null, 2));
}

main().catch((error) => {
    console.error(error?.stack || error?.message || String(error));
    process.exitCode = 1;
});
