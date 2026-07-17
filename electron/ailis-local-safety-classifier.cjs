const path = require('path');
const fsp = require('fs/promises');

const DEFAULT_MODEL_ID = 'onnx-community/distilbert-multilingual-toxicity-classifier-ONNX';
const DEFAULT_DTYPE = 'q8';
const DEFAULT_REVIEW_THRESHOLD = 0.65;
const DEFAULT_BLOCK_THRESHOLD = 0.85;
const DEFAULT_CHUNK_CHARS = 420;
const DEFAULT_CHUNK_OVERLAP = 64;
const DEFAULT_MAX_CHUNKS = 64;
const DEFAULT_BATCH_SIZE = 8;

function clampProbability(value, fallback) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) {
        return fallback;
    }
    return Math.min(1, Math.max(0, numeric));
}

function normalizeLabel(value = '') {
    return String(value || '')
        .trim()
        .toLowerCase()
        .replace(/[\s_]+/g, '-');
}

function normalizeClassifierRows(value, expectedCount = 1) {
    if (!Array.isArray(value)) {
        return [[]];
    }
    if (!value.length) {
        return Array.from({ length: expectedCount }, () => []);
    }
    if (Array.isArray(value[0])) {
        return value;
    }
    return expectedCount === 1 ? [value] : value.map((item) => [item]);
}

function getToxicityScore(predictions = []) {
    const positiveLabels = new Set(['toxic', 'toxicity', 'label-1', '1']);
    const negativeLabels = new Set(['not-toxic', 'non-toxic', 'safe', 'label-0', '0']);
    let positiveScore = null;
    let negativeScore = null;

    for (const prediction of predictions) {
        const label = normalizeLabel(prediction?.label);
        const score = clampProbability(prediction?.score, null);
        if (score === null) {
            continue;
        }
        if (positiveLabels.has(label)) {
            positiveScore = positiveScore === null ? score : Math.max(positiveScore, score);
        } else if (negativeLabels.has(label)) {
            negativeScore = negativeScore === null ? score : Math.max(negativeScore, score);
        }
    }

    if (positiveScore !== null) {
        return positiveScore;
    }
    if (negativeScore !== null) {
        return 1 - negativeScore;
    }
    throw new Error('safety_classifier_label_schema_unsupported');
}

function selectEvenly(items, limit) {
    if (items.length <= limit) {
        return items;
    }
    const selected = [];
    const seen = new Set();
    for (let index = 0; index < limit; index += 1) {
        const sourceIndex = Math.round(index * (items.length - 1) / Math.max(1, limit - 1));
        if (!seen.has(sourceIndex)) {
            seen.add(sourceIndex);
            selected.push(items[sourceIndex]);
        }
    }
    return selected;
}

function buildTextChunks(value, {
    chunkChars = DEFAULT_CHUNK_CHARS,
    overlapChars = DEFAULT_CHUNK_OVERLAP,
    maxChunks = DEFAULT_MAX_CHUNKS
} = {}) {
    const text = String(value || '').replace(/\u0000/g, ' ').trim();
    if (!text) {
        return {
            chunks: [],
            totalChunks: 0,
            coverageComplete: true,
            textChars: 0
        };
    }

    const boundedChunkChars = Math.max(128, Number(chunkChars) || DEFAULT_CHUNK_CHARS);
    const boundedOverlap = Math.min(
        boundedChunkChars - 1,
        Math.max(0, Number(overlapChars) || DEFAULT_CHUNK_OVERLAP)
    );
    const stride = Math.max(1, boundedChunkChars - boundedOverlap);
    const chunks = [];
    for (let start = 0; start < text.length; start += stride) {
        chunks.push({
            index: chunks.length,
            start,
            end: Math.min(text.length, start + boundedChunkChars),
            text: text.slice(start, start + boundedChunkChars)
        });
        if (start + boundedChunkChars >= text.length) {
            break;
        }
    }

    const boundedMaxChunks = Math.max(1, Number(maxChunks) || DEFAULT_MAX_CHUNKS);
    const selected = selectEvenly(chunks, boundedMaxChunks);
    return {
        chunks: selected,
        totalChunks: chunks.length,
        coverageComplete: selected.length === chunks.length,
        textChars: text.length
    };
}

async function selectReachableRemoteHost(modelId, timeoutMs = 8000) {
    if (typeof fetch !== 'function') {
        return '';
    }
    const hosts = ['https://huggingface.co/', 'https://hf-mirror.com/'];
    const suffix = `${String(modelId || '').replace(/^\/+/, '')}/resolve/main/config.json`;
    try {
        return await Promise.any(hosts.map(async (host) => {
            const response = await fetch(`${host}${suffix}`, {
                signal: AbortSignal.timeout(timeoutMs)
            });
            if (!response.ok) {
                throw new Error(`model_host_http_${response.status}`);
            }
            await response.body?.cancel?.();
            return host;
        }));
    } catch {
        return '';
    }
}

class AILISLocalSafetyClassifier {
    constructor(options = {}) {
        this.modelId = String(
            options.modelId ||
            process.env.AILIS_EMBER_SAFETY_MODEL ||
            DEFAULT_MODEL_ID
        ).trim();
        this.dtype = String(options.dtype || DEFAULT_DTYPE).trim() || DEFAULT_DTYPE;
        this.cacheDir = path.resolve(
            options.cacheDir ||
            path.join(process.cwd(), '.ailis-state', 'models', 'safety-classifier')
        );
        this.reviewThreshold = clampProbability(
            options.reviewThreshold ?? process.env.AILIS_EMBER_REVIEW_THRESHOLD,
            DEFAULT_REVIEW_THRESHOLD
        );
        this.blockThreshold = Math.max(
            this.reviewThreshold,
            clampProbability(
                options.blockThreshold ?? process.env.AILIS_EMBER_BLOCK_THRESHOLD,
                DEFAULT_BLOCK_THRESHOLD
            )
        );
        this.chunkChars = Math.max(128, Number(options.chunkChars || DEFAULT_CHUNK_CHARS));
        this.chunkOverlap = Math.max(0, Number(options.chunkOverlap || DEFAULT_CHUNK_OVERLAP));
        this.maxChunks = Math.max(1, Number(options.maxChunks || DEFAULT_MAX_CHUNKS));
        this.batchSize = Math.max(1, Number(options.batchSize || DEFAULT_BATCH_SIZE));
        this.pipelineFactory = typeof options.pipelineFactory === 'function'
            ? options.pipelineFactory
            : null;
        this.transformersRuntime = '';
        this.remoteHost = '';
        this.pipeline = null;
        this.preparePromise = null;
        this.status = 'idle';
        this.progress = null;
        this.lastError = '';
        this.loadedAt = 0;
        this.lastCheckedAt = 0;
        this.checkCount = 0;
        this.lifecycleVersion = 0;
    }

    getStatus() {
        return {
            engine: 'transformers.js_onnx',
            runtime: this.transformersRuntime || 'not_loaded',
            remoteHost: this.remoteHost,
            profile: 'multilingual_toxicity',
            modelId: this.modelId,
            dtype: this.dtype,
            cacheDir: this.cacheDir,
            status: this.status,
            ready: Boolean(this.pipeline),
            progress: this.progress,
            lastError: this.lastError,
            loadedAt: this.loadedAt,
            lastCheckedAt: this.lastCheckedAt,
            checkCount: this.checkCount,
            reviewThreshold: this.reviewThreshold,
            blockThreshold: this.blockThreshold,
            estimatedDownloadBytes: 136000000,
            languageCoverage: ['en', 'ja', 'zh', 'multilingual'],
            capability: 'overt_toxicity_and_hate_risk',
            limitation: 'not_a_complete_implicit_bias_or_stereotype_reasoner'
        };
    }

    async prepare() {
        if (this.pipeline) {
            return this.pipeline;
        }
        if (this.preparePromise) {
            return this.preparePromise;
        }

        this.status = 'loading';
        this.lastError = '';
        const lifecycleVersion = ++this.lifecycleVersion;
        const loadPromise = (async () => {
            await fsp.mkdir(this.cacheDir, { recursive: true });
            let pipelineFactory = this.pipelineFactory;
            let transformersEnv = null;
            let pipelineOptions = {
                dtype: this.dtype,
                cache_dir: this.cacheDir
            };
            if (!pipelineFactory) {
                try {
                    const transformers = await import('@huggingface/transformers');
                    pipelineFactory = transformers.pipeline;
                    transformersEnv = transformers.env;
                    this.transformersRuntime = '@huggingface/transformers';
                } catch {
                    const transformers = await import('@xenova/transformers');
                    pipelineFactory = transformers.pipeline;
                    transformersEnv = transformers.env;
                    this.transformersRuntime = '@xenova/transformers';
                    pipelineOptions = {
                        quantized: true,
                        cache_dir: this.cacheDir
                    };
                }
            } else {
                this.transformersRuntime = 'injected';
            }
            const configuredRemoteHost = String(
                process.env.AILIS_HF_ENDPOINT ||
                process.env.HF_ENDPOINT ||
                ''
            ).trim();
            if (configuredRemoteHost && transformersEnv) {
                transformersEnv.remoteHost = `${configuredRemoteHost.replace(/\/+$/, '')}/`;
                this.remoteHost = transformersEnv.remoteHost;
            } else if (transformersEnv && !this.pipelineFactory) {
                const cachedConfigPath = path.join(this.cacheDir, this.modelId, 'config.json');
                try {
                    await fsp.access(cachedConfigPath);
                } catch {
                    const reachableHost = await selectReachableRemoteHost(this.modelId);
                    if (reachableHost) {
                        transformersEnv.remoteHost = reachableHost;
                        this.remoteHost = reachableHost;
                    }
                }
            }
            const loadPipeline = () => pipelineFactory(
                'text-classification',
                this.modelId,
                {
                    ...pipelineOptions,
                    progress_callback: (progress = {}) => {
                        this.progress = {
                            status: String(progress.status || ''),
                            file: String(progress.file || ''),
                            progress: Number.isFinite(Number(progress.progress))
                                ? Number(progress.progress)
                                : null,
                            loaded: Number.isFinite(Number(progress.loaded))
                                ? Number(progress.loaded)
                                : null,
                            total: Number.isFinite(Number(progress.total))
                                ? Number(progress.total)
                                : null
                        };
                    }
                }
            );
            let loadedPipeline;
            try {
                loadedPipeline = await loadPipeline();
            } catch (primaryError) {
                if (!transformersEnv || configuredRemoteHost) {
                    throw primaryError;
                }
                transformersEnv.remoteHost = 'https://hf-mirror.com/';
                this.remoteHost = transformersEnv.remoteHost;
                loadedPipeline = await loadPipeline();
            }
            if (lifecycleVersion !== this.lifecycleVersion) {
                await loadedPipeline?.dispose?.();
                const cancelledError = new Error('safety_classifier_load_cancelled');
                cancelledError.code = 'SAFETY_CLASSIFIER_LOAD_CANCELLED';
                throw cancelledError;
            }
            this.pipeline = loadedPipeline;
            this.status = 'ready';
            this.progress = null;
            this.loadedAt = Date.now();
            return loadedPipeline;
        })().catch((error) => {
            if (error?.code === 'SAFETY_CLASSIFIER_LOAD_CANCELLED') {
                throw error;
            }
            this.status = 'error';
            this.lastError = error?.message || String(error);
            this.progress = null;
            throw error;
        });
        this.preparePromise = loadPromise;
        void loadPromise.finally(() => {
            if (this.preparePromise === loadPromise) {
                this.preparePromise = null;
            }
        }).catch(() => {});
        return loadPromise;
    }

    async dispose() {
        this.lifecycleVersion += 1;
        const activePipeline = this.pipeline;
        this.pipeline = null;
        this.preparePromise = null;
        this.status = 'idle';
        this.progress = null;
        this.lastError = '';
        if (typeof activePipeline?.dispose === 'function') {
            await activePipeline.dispose();
        }
    }

    async evaluate({ text = '' } = {}) {
        const chunkSet = buildTextChunks(text, {
            chunkChars: this.chunkChars,
            overlapChars: this.chunkOverlap,
            maxChunks: this.maxChunks
        });
        if (!chunkSet.chunks.length) {
            return {
                decision: 'allow',
                riskLevel: 'none',
                riskTypes: [],
                summary: '没有需要检查的文本。',
                details: {
                    modelId: this.modelId,
                    maxToxicityScore: 0,
                    checkedChunks: 0,
                    totalChunks: 0,
                    coverageComplete: true
                }
            };
        }

        const classifier = await this.prepare();
        let maxScore = 0;
        let highestRiskChunk = null;
        for (let offset = 0; offset < chunkSet.chunks.length; offset += this.batchSize) {
            const batch = chunkSet.chunks.slice(offset, offset + this.batchSize);
            const output = await classifier(batch.map((item) => item.text), { topk: null });
            const rows = normalizeClassifierRows(output, batch.length);
            for (let index = 0; index < batch.length; index += 1) {
                const score = getToxicityScore(rows[index] || []);
                if (score > maxScore) {
                    maxScore = score;
                    highestRiskChunk = batch[index];
                }
            }
        }

        this.lastCheckedAt = Date.now();
        this.checkCount += 1;
        const decision = maxScore >= this.blockThreshold
            ? 'block'
            : maxScore >= this.reviewThreshold
                ? 'review'
                : 'allow';
        const riskLevel = decision === 'block'
            ? 'high'
            : decision === 'review'
                ? 'medium'
                : 'none';
        const roundedScore = Number(maxScore.toFixed(4));
        return {
            decision,
            riskLevel,
            riskTypes: decision === 'allow' ? [] : ['toxicity'],
            summary: decision === 'allow'
                ? `本地安全分类器未发现超过阈值的显性毒性风险（${roundedScore}）。`
                : `本地安全分类器检测到显性毒性风险（${roundedScore}）。`,
            suggestion: decision === 'block' ? 'block_or_rewrite' : '',
            details: {
                engine: 'transformers.js_onnx',
                profile: 'multilingual_toxicity',
                modelId: this.modelId,
                dtype: this.dtype,
                maxToxicityScore: roundedScore,
                reviewThreshold: this.reviewThreshold,
                blockThreshold: this.blockThreshold,
                checkedChunks: chunkSet.chunks.length,
                totalChunks: chunkSet.totalChunks,
                coverageComplete: chunkSet.coverageComplete,
                textChars: chunkSet.textChars,
                highestRiskSpan: highestRiskChunk
                    ? {
                        chunkIndex: highestRiskChunk.index,
                        start: highestRiskChunk.start,
                        end: highestRiskChunk.end
                    }
                    : null
            }
        };
    }
}

module.exports = {
    AILISLocalSafetyClassifier,
    DEFAULT_MODEL_ID,
    buildTextChunks,
    getToxicityScore,
    normalizeClassifierRows
};
