import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const {
    AILISHindsightOfficialMemory
} = require('../electron/ailis-memory-hindsight-official.cjs');

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(SCRIPT_DIR, '..');

function normalizeText(value, fallback = '') {
    if (typeof value !== 'string') {
        return fallback;
    }
    return value.trim() || fallback;
}

function parseArgs(argv = process.argv.slice(2)) {
    const args = {
        rootDir: path.join(PROJECT_ROOT, '.local', 'hindsight-official-smoke'),
        endpoint: normalizeText(
            process.env.AILIS_MEMORY_MODEL_ENDPOINT ||
            process.env.HF_ENDPOINT
        ),
        pypiIndex: normalizeText(
            process.env.AILIS_HINDSIGHT_PYPI_INDEX ||
            process.env.UV_INDEX_URL
        ),
        provider: normalizeText(
            process.env.HINDSIGHT_API_LLM_PROVIDER,
            'none'
        ),
        embeddingsProvider: normalizeText(
            process.env.HINDSIGHT_API_EMBEDDINGS_PROVIDER,
            'local'
        ),
        rerankerProvider: normalizeText(
            process.env.HINDSIGHT_API_RERANKER_PROVIDER,
            'local'
        ),
        embeddingModel: normalizeText(
            process.env.HINDSIGHT_API_EMBEDDINGS_LOCAL_MODEL
        ),
        rerankerModel: normalizeText(
            process.env.HINDSIGHT_API_RERANKER_LOCAL_MODEL
        ),
        lifecycleOnly: false
    };
    for (let index = 0; index < argv.length; index += 1) {
        const token = argv[index];
        const next = () => argv[++index] || '';
        if (token === '--root-dir') args.rootDir = path.resolve(next());
        else if (token === '--endpoint') args.endpoint = normalizeText(next());
        else if (token === '--pypi-index') args.pypiIndex = normalizeText(next());
        else if (token === '--provider') args.provider = normalizeText(next(), 'none');
        else if (token === '--embeddings-provider') {
            args.embeddingsProvider = normalizeText(next(), 'local');
        } else if (token === '--reranker-provider') {
            args.rerankerProvider = normalizeText(next(), 'local');
        } else if (token === '--embedding-model') {
            args.embeddingModel = path.resolve(next());
        } else if (token === '--reranker-model') {
            args.rerankerModel = path.resolve(next());
        } else if (token === '--lifecycle-only') args.lifecycleOnly = true;
        else if (token === '--help' || token === '-h') args.help = true;
        else throw new Error(`Unknown argument: ${token}`);
    }
    return args;
}

function printHelp() {
    console.log([
        'Smoke-test the exact official Hindsight daemon used by AILIS.',
        '',
        'Usage:',
        '  node scripts/smoke-ailis-hindsight-official.mjs [options]',
        '',
        'Options:',
        '  --root-dir PATH             Isolated smoke-test state',
        '  --endpoint URL              Hugging Face-compatible model host',
        '  --pypi-index URL            Python package index for the official daemon',
        '  --provider NAME             Hindsight LLM provider (default: none)',
        '  --embeddings-provider NAME  Hindsight embedding provider (default: local)',
        '  --reranker-provider NAME    Hindsight reranker provider (default: local)',
        '  --embedding-model PATH      Pre-downloaded local embedding model directory',
        '  --reranker-model PATH       Pre-downloaded local reranker model directory',
        '  --lifecycle-only            Verify daemon and API version without Retain/Recall'
    ].join('\n'));
}

async function main() {
    const args = parseArgs();
    if (args.help) {
        printHelp();
        return;
    }
    process.env.UV_PYTHON ||= '3.12';
    process.env.HINDSIGHT_API_LLM_PROVIDER = args.provider;
    process.env.HINDSIGHT_API_EMBEDDINGS_PROVIDER = args.embeddingsProvider;
    process.env.HINDSIGHT_API_RERANKER_PROVIDER = args.rerankerProvider;
    if (args.embeddingModel) {
        process.env.HINDSIGHT_API_EMBEDDINGS_LOCAL_MODEL = args.embeddingModel;
    }
    if (args.rerankerModel) {
        process.env.HINDSIGHT_API_RERANKER_LOCAL_MODEL = args.rerankerModel;
    }
    if (args.pypiIndex) {
        process.env.UV_INDEX_URL = args.pypiIndex;
    }
    if (args.endpoint) {
        process.env.HF_ENDPOINT = args.endpoint;
    }
    const profile = `ailis-official-smoke-${process.pid}`;
    const isolatedRootDir = path.join(args.rootDir, profile);
    await fs.mkdir(isolatedRootDir, { recursive: true });
    const runtime = new AILISHindsightOfficialMemory({
        rootDir: isolatedRootDir,
        profile,
        bankId: profile,
        autoStart: true
    });
    const startedAt = new Date().toISOString();
    try {
        await runtime.ensureReady();
        let curation = null;
        let recall = null;
        if (!args.lifecycleOnly) {
            curation = await runtime.curate({
                events: [
                    {
                        id: `official-smoke-${process.pid}`,
                        sessionId: 'smoke-session',
                        ts: '2026-07-30T07:00:00.000Z',
                        userText: 'Miso ramen is my favorite Japanese soup.',
                        assistantText: 'I will remember that you like miso ramen.',
                        source: 'conversation'
                    }
                ],
                maxBatches: 1
            });
            if (!curation.ok) {
                throw new Error(`official Retain failed: ${curation.error || curation.status}`);
            }
            recall = await runtime.search({
                query: 'Which Japanese soup does the user like?',
                questionTime: '2026-07-30T08:00:00.000Z',
                reflect: args.provider !== 'none'
            });
            if (!recall.ok || !recall.contextText) {
                throw new Error('official Recall returned no evidence context');
            }
            if (!recall.documents?.some((document) =>
                document.sourceEventIds?.includes(`official-smoke-${process.pid}`)
            )) {
                throw new Error('official Recall did not return the retained AILIS source event');
            }
            if (args.provider !== 'none' && !recall.reflection?.text) {
                throw new Error('official Reflect returned no synthesis text');
            }
        }
        const result = {
            ok: true,
            fidelityGate: args.lifecycleOnly
                ? 'official_daemon_lifecycle_and_version'
                : args.provider === 'none'
                    ? 'official_daemon_retain_recall'
                    : 'official_daemon_retain_recall_reflect',
            startedAt,
            completedAt: new Date().toISOString(),
            provider: args.provider,
            embeddingsProvider: args.embeddingsProvider,
            rerankerProvider: args.rerankerProvider,
            backend: runtime.publicStatus(),
            curation: curation
                ? {
                    status: curation.status,
                    processedEntryCount: curation.run?.processedEntryCount
                }
                : null,
            recall: recall
                ? {
                    documentCount: recall.documents?.length || 0,
                    hasContext: Boolean(recall.contextText),
                    hasReflection: Boolean(recall.reflection?.text),
                    sourceEventRecovered: recall.documents.some((document) =>
                        document.sourceEventIds?.includes(`official-smoke-${process.pid}`)
                    )
                }
                : null
        };
        await fs.writeFile(
            path.join(isolatedRootDir, 'smoke-result.json'),
            `${JSON.stringify(result, null, 2)}\n`,
            'utf8'
        );
        console.log(JSON.stringify(result, null, 2));
    } finally {
        await runtime.shutdown();
    }
}

main().catch((error) => {
    console.error(JSON.stringify({
        ok: false,
        code: error?.code || '',
        error: error?.message || String(error)
    }, null, 2));
    process.exitCode = 1;
});

export {
    parseArgs
};
