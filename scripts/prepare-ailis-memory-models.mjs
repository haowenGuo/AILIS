import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const {
    DEFAULT_EMBEDDING_MODEL,
    DEFAULT_EMBEDDING_REVISION,
    DEFAULT_RERANKER_MODEL,
    DEFAULT_RERANKER_REVISION,
    StrictCrossEncoderRuntime,
    StrictDenseRuntime,
    cosineSimilarity
} = require('../electron/ailis-memory-hybrid-full.cjs');

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
        endpoint: normalizeText(
            process.env.AILIS_MEMORY_MODEL_ENDPOINT ||
            process.env.HF_ENDPOINT
        ),
        cacheDir: path.resolve(normalizeText(
            process.env.AILIS_MEMORY_MODEL_CACHE ||
            process.env.TRANSFORMERS_CACHE,
            path.join(PROJECT_ROOT, '.local', 'memory-model-cache')
        )),
        embeddingModel: normalizeText(
            process.env.AILIS_MEMORY_EMBEDDING_MODEL,
            DEFAULT_EMBEDDING_MODEL
        ),
        embeddingRevision: normalizeText(
            process.env.AILIS_MEMORY_EMBEDDING_REVISION,
            DEFAULT_EMBEDDING_REVISION
        ),
        rerankerModel: normalizeText(
            process.env.AILIS_MEMORY_RERANKER_MODEL,
            DEFAULT_RERANKER_MODEL
        ),
        rerankerRevision: normalizeText(
            process.env.AILIS_MEMORY_RERANKER_REVISION,
            DEFAULT_RERANKER_REVISION
        ),
        offline: false,
        verifyOffline: true,
        json: false
    };
    for (let index = 0; index < argv.length; index += 1) {
        const token = argv[index];
        const next = () => argv[++index] || '';
        if (token === '--endpoint') args.endpoint = normalizeText(next());
        else if (token === '--cache-dir') args.cacheDir = path.resolve(next());
        else if (token === '--embedding-model') args.embeddingModel = normalizeText(next());
        else if (token === '--embedding-revision') {
            args.embeddingRevision = normalizeText(next(), 'main');
        } else if (token === '--reranker-model') args.rerankerModel = normalizeText(next());
        else if (token === '--reranker-revision') {
            args.rerankerRevision = normalizeText(next(), 'main');
        } else if (token === '--offline') args.offline = true;
        else if (token === '--no-offline-verify') args.verifyOffline = false;
        else if (token === '--json') args.json = true;
        else if (token === '--help' || token === '-h') args.help = true;
        else throw new Error(`Unknown argument: ${token}`);
    }
    return args;
}

function printHelp() {
    console.log([
        'Prepare and verify the strict AILIS dense and cross-encoder models.',
        '',
        'Usage:',
        '  node scripts/prepare-ailis-memory-models.mjs [options]',
        '',
        'Options:',
        '  --endpoint URL              Hugging Face-compatible model host',
        '  --cache-dir PATH            Shared persistent Transformers.js cache',
        '  --embedding-model ID        Dense embedding model',
        '  --embedding-revision SHA    Immutable dense model revision',
        '  --reranker-model ID         Sequence-classification cross-encoder',
        '  --reranker-revision SHA     Immutable reranker revision',
        '  --offline                   Never contact a remote model host',
        '  --no-offline-verify         Skip the second cache-only load',
        '  --json                      Print the final report as JSON',
        '',
        'The default AILIS models are pinned to immutable upstream revisions.'
    ].join('\n'));
}

function progressLogger(jsonMode) {
    const completed = new Set();
    return (event = {}) => {
        const file = normalizeText(event.file);
        const key = `${normalizeText(event.name)}:${file}`;
        if (!file || event.status !== 'done' || completed.has(key)) {
            return;
        }
        completed.add(key);
        const line = `[AILIS memory models] cached ${event.name}/${file}`;
        if (jsonMode) {
            process.stderr.write(`${line}\n`);
        } else {
            console.log(line);
        }
    };
}

function runtimeOptions(args, progressCallback, allowRemoteModels) {
    return {
        allowRemoteModels,
        remoteHost: args.endpoint,
        cacheDir: args.cacheDir,
        progressCallback
    };
}

async function exerciseModels(args, { allowRemoteModels, progressCallback }) {
    const dense = new StrictDenseRuntime({
        enabled: true,
        model: args.embeddingModel,
        revision: args.embeddingRevision,
        ...runtimeOptions(args, progressCallback, allowRemoteModels)
    });
    const denseTexts = [
        'query: Which Japanese soup does the user enjoy?',
        'passage: The user loves miso ramen and orders it on rainy days.',
        'passage: The user keeps a blue notebook beside the window.',
        'passage: The assistant scheduled a dentist appointment.'
    ];
    const vectors = await dense.embed(denseTexts);
    const denseScores = vectors.slice(1).map((vector, index) => ({
        id: `dense-${index + 1}`,
        score: cosineSimilarity(vectors[0], vector)
    })).sort((left, right) => right.score - left.score);
    if (denseScores[0]?.id !== 'dense-1') {
        throw new Error(
            `dense semantic sanity check failed: expected dense-1, got ${denseScores[0]?.id || 'none'}`
        );
    }

    const crossEncoder = new StrictCrossEncoderRuntime({
        model: args.rerankerModel,
        revision: args.rerankerRevision,
        ...runtimeOptions(args, progressCallback, allowRemoteModels)
    });
    const reranked = await crossEncoder.rerank(
        'Which Japanese soup does the user enjoy?',
        [
            {
                document: {
                    id: 'relevant',
                    text: 'The user loves miso ramen and orders it on rainy days.'
                },
                score: 0.1
            },
            {
                document: {
                    id: 'notebook',
                    text: 'The user keeps a blue notebook beside the window.'
                },
                score: 0.9
            },
            {
                document: {
                    id: 'dentist',
                    text: 'The assistant scheduled a dentist appointment.'
                },
                score: 0.8
            }
        ],
        3
    );
    if (reranked[0]?.document?.id !== 'relevant') {
        throw new Error(
            `cross-encoder sanity check failed: expected relevant, got ` +
            `${reranked[0]?.document?.id || 'none'}`
        );
    }

    return {
        dense: {
            ...dense.getStatus(),
            dimensions: vectors[0]?.length || 0,
            ranking: denseScores
        },
        crossEncoder: {
            ...crossEncoder.getStatus(),
            ranking: reranked.map((entry) => ({
                id: entry.document.id,
                score: entry.crossEncoderScore
            }))
        }
    };
}

async function main() {
    const args = parseArgs();
    if (args.help) {
        printHelp();
        return;
    }
    await fs.mkdir(args.cacheDir, { recursive: true });
    const startedAt = new Date().toISOString();
    const progressCallback = progressLogger(args.json);
    const online = await exerciseModels(args, {
        allowRemoteModels: !args.offline,
        progressCallback
    });
    let offline = null;
    if (args.verifyOffline && !args.offline) {
        offline = await exerciseModels(args, {
            allowRemoteModels: false,
            progressCallback: null
        });
    }
    const report = {
        ok: true,
        fidelityGate: 'real_models_loaded_and_semantically_ranked',
        startedAt,
        completedAt: new Date().toISOString(),
        endpoint: args.endpoint || 'library_default',
        cacheDir: args.cacheDir,
        online,
        offlineVerification: offline
            ? {
                ok: true,
                denseRuntime: offline.dense.runtime,
                crossEncoderRuntime: offline.crossEncoder.runtime
            }
            : {
                ok: args.offline,
                skipped: !args.offline
            }
    };
    const manifestPath = path.join(args.cacheDir, 'ailis-memory-models.manifest.json');
    await fs.writeFile(manifestPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    report.manifestPath = manifestPath;
    console.log(args.json ? JSON.stringify(report) : JSON.stringify(report, null, 2));
}

main().catch((error) => {
    console.error(JSON.stringify({
        ok: false,
        error: error?.message || String(error),
        code: error?.code || ''
    }, null, 2));
    process.exitCode = 1;
});

export {
    exerciseModels,
    parseArgs
};
