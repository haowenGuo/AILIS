'use strict';

const { createHash } = require('crypto');
const path = require('path');

const DEFAULT_EMBEDDING_MODEL = 'Xenova/multilingual-e5-small';
const DEFAULT_EMBEDDING_REVISION = '761b726dd34fb83930e26aab4e9ac3899aa1fa78';
const DEFAULT_DENSE_BATCH_SIZE = 4;
const DEFAULT_DENSE_MAX_LENGTH = 512;
const DEFAULT_DENSE_MAX_TEXT_CHARS = 1_800;
const DEFAULT_RERANKER_MODEL = 'Xenova/ms-marco-MiniLM-L-6-v2';
const DEFAULT_RERANKER_REVISION = 'a09144355adeed5f58c8ed011d209bf8ee5a1fec';
const DEFAULT_RRF_K = 60;
const DEFAULT_RERANKER_BATCH_SIZE = 4;
const DEFAULT_RERANKER_MAX_LENGTH = 512;
const DEFAULT_RERANKER_MAX_DOCUMENT_CHARS = 2_400;

function normalizeText(value, fallback = '') {
    if (typeof value !== 'string') {
        return fallback;
    }
    const normalized = value.replace(/\s+/g, ' ').trim();
    return normalized || fallback;
}

function normalizeRemoteHost(value) {
    const remoteHost = normalizeText(value);
    return remoteHost ? `${remoteHost.replace(/\/+$/, '')}/` : '';
}

function modelRuntimeOptions(options = {}) {
    return {
        remoteHost: normalizeRemoteHost(
            options.remoteHost ||
            options.modelRemoteHost ||
            process.env.AILIS_MEMORY_MODEL_ENDPOINT ||
            process.env.HF_ENDPOINT
        ),
        cacheDir: normalizeText(
            options.cacheDir ||
            options.modelCacheDir ||
            process.env.AILIS_MEMORY_MODEL_CACHE ||
            process.env.TRANSFORMERS_CACHE
        )
    };
}

function configureTransformersEnvironment(transformers, options = {}) {
    if (!transformers?.env) {
        return;
    }
    const runtimeOptions = modelRuntimeOptions(options);
    transformers.env.allowRemoteModels = options.allowRemoteModels !== false;
    if (runtimeOptions.remoteHost) {
        transformers.env.remoteHost = runtimeOptions.remoteHost;
    }
    if (runtimeOptions.cacheDir) {
        transformers.env.cacheDir = path.resolve(runtimeOptions.cacheDir);
    }
}

function errorWithCause(error) {
    const messages = [];
    let cursor = error;
    while (cursor && messages.length < 4) {
        const message = normalizeText(cursor?.message || String(cursor));
        if (message && !messages.includes(message)) {
            messages.push(message);
        }
        cursor = cursor?.cause;
    }
    return messages.join(' <- ') || 'unknown model runtime error';
}

function normalizeArray(value) {
    if (!value) {
        return [];
    }
    return Array.isArray(value) ? value : [value];
}

function safeIso(value, fallback = '') {
    const parsed = Date.parse(normalizeText(value));
    return Number.isFinite(parsed) ? new Date(parsed).toISOString() : fallback;
}

function tokens(value = '') {
    const text = normalizeText(value).toLowerCase();
    const result = text.match(/[a-z0-9]+/g) || [];
    const chinese = text.replace(/[^\u4e00-\u9fff]/g, '');
    for (let index = 0; index < chinese.length - 1; index += 1) {
        result.push(chinese.slice(index, index + 2));
    }
    return result.filter((entry) => entry.length > 1);
}

function frequencies(items) {
    const result = new Map();
    for (const item of items) {
        result.set(item, (result.get(item) || 0) + 1);
    }
    return result;
}

function bm25Rank(documents, query, {
    k1 = 1.2,
    b = 0.72,
    textSelector = (document) => document.text
} = {}) {
    const queryTokens = [...new Set(tokens(query))];
    if (!documents.length) {
        return [];
    }
    const prepared = documents.map((document) => {
        const documentTokens = tokens(textSelector(document));
        return {
            document,
            frequencies: frequencies(documentTokens),
            tokenSet: new Set(documentTokens),
            length: Math.max(1, documentTokens.length)
        };
    });
    const documentFrequency = new Map();
    for (const entry of prepared) {
        for (const token of entry.tokenSet) {
            documentFrequency.set(token, (documentFrequency.get(token) || 0) + 1);
        }
    }
    const averageLength = prepared.reduce((sum, entry) => sum + entry.length, 0) /
        Math.max(1, prepared.length);
    return prepared.map((entry) => {
        let score = 0;
        for (const token of queryTokens) {
            const frequency = entry.frequencies.get(token) || 0;
            if (!frequency) {
                continue;
            }
            const containing = documentFrequency.get(token) || 0;
            const idf = Math.log(
                1 + (prepared.length - containing + 0.5) / (containing + 0.5)
            );
            const normalization = k1 * (
                1 - b + b * entry.length / Math.max(1, averageLength)
            );
            score += idf * (frequency * (k1 + 1)) / (frequency + normalization);
        }
        return { document: entry.document, score };
    }).sort((left, right) =>
        right.score - left.score ||
        String(right.document.time || '').localeCompare(String(left.document.time || '')) ||
        String(left.document.id || '').localeCompare(String(right.document.id || ''))
    ).map((entry, index) => ({ ...entry, rank: index + 1 }));
}

function reciprocalRankFusion(channels, weights = [], k = DEFAULT_RRF_K) {
    const combined = new Map();
    channels.forEach((channel, channelIndex) => {
        const weight = Number.isFinite(weights[channelIndex]) ? weights[channelIndex] : 1;
        channel.forEach((entry, index) => {
            const document = entry.document || entry;
            const id = normalizeText(document.id);
            if (!id) {
                return;
            }
            const current = combined.get(id) || {
                document,
                score: 0,
                bestRank: Number.POSITIVE_INFINITY,
                components: {}
            };
            const rank = Number(entry.rank) || index + 1;
            current.score += weight / (k + rank);
            current.bestRank = Math.min(current.bestRank, rank);
            current.components[`channel${channelIndex}`] = {
                rank,
                score: Number(entry.score) || 0,
                weight
            };
            combined.set(id, current);
        });
    });
    return [...combined.values()].sort((left, right) =>
        right.score - left.score ||
        left.bestRank - right.bestRank ||
        String(left.document.id).localeCompare(String(right.document.id))
    );
}

function cosineSimilarity(left, right) {
    if (!left?.length || left.length !== right?.length) {
        return 0;
    }
    let dot = 0;
    let leftMagnitude = 0;
    let rightMagnitude = 0;
    for (let index = 0; index < left.length; index += 1) {
        const leftValue = Number(left[index]) || 0;
        const rightValue = Number(right[index]) || 0;
        dot += leftValue * rightValue;
        leftMagnitude += leftValue * leftValue;
        rightMagnitude += rightValue * rightValue;
    }
    const denominator = Math.sqrt(leftMagnitude) * Math.sqrt(rightMagnitude);
    return denominator ? dot / denominator : 0;
}

function normalizeEmbeddingOutput(output, expectedCount) {
    if (Array.isArray(output) && Array.isArray(output[0])) {
        return output.map((entry) => Array.from(entry, Number));
    }
    if (Array.isArray(output) && expectedCount === 1 && output.every(Number.isFinite)) {
        return [output.map(Number)];
    }
    if (output?.data && output?.dims) {
        const data = Array.from(output.data, Number);
        const dimensions = Number(output.dims.at(-1)) || 0;
        const rows = [];
        for (let offset = 0; dimensions && offset < data.length; offset += dimensions) {
            rows.push(data.slice(offset, offset + dimensions));
        }
        return rows.slice(0, expectedCount);
    }
    if (typeof output?.tolist === 'function') {
        const listed = output.tolist();
        return Array.isArray(listed?.[0]) ? listed : [listed];
    }
    return [];
}

function parseJson(value) {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
        return value;
    }
    const text = normalizeText(value);
    if (!text) {
        return null;
    }
    try {
        return JSON.parse(text);
    } catch {}
    const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
    try {
        return fenced?.[1] ? JSON.parse(fenced[1]) : null;
    } catch {
        return null;
    }
}

function llmObject(result) {
    return [
        result?.structuredContent,
        result?.content,
        result?.text,
        result?.output_text,
        result?.output,
        result?.message?.content,
        result?.choices?.[0]?.message?.content
    ].flatMap((entry) => Array.isArray(entry)
        ? entry.map((item) => item?.text || item?.content || item)
        : [entry]
    ).map(parseJson).find(Boolean) || null;
}

function normalizePlan(raw, query) {
    const source = raw && typeof raw === 'object' ? raw : {};
    const searchQueries = normalizeArray(source.searchQueries)
        .map((entry) => normalizeText(entry))
        .filter(Boolean)
        .slice(0, 6);
    if (!searchQueries.includes(query)) {
        searchQueries.unshift(query);
    }
    const start = safeIso(source.timeRange?.start);
    const end = safeIso(source.timeRange?.end);
    return {
        searchQueries,
        targetEntities: normalizeArray(source.targetEntities)
            .map((entry) => normalizeText(entry))
            .filter(Boolean)
            .slice(0, 20),
        timeRange: start || end ? { start, end } : null,
        retrievalGuidance: normalizeText(source.retrievalGuidance),
        source: raw ? 'model' : 'direct'
    };
}

function rawDocuments(events = []) {
    return events.map((event, index) => ({
        id: `turn:${normalizeText(event.id, index)}`,
        kind: 'turn',
        lane: 'conversation',
        userText: normalizeText(event.userText),
        assistantText: normalizeText(event.assistantText),
        text: [
            normalizeText(event.userText) ? `User: ${normalizeText(event.userText)}` : '',
            normalizeText(event.assistantText) ? `AILIS: ${normalizeText(event.assistantText)}` : ''
        ].filter(Boolean).join('\n'),
        aliases: normalizeArray(event.tags),
        time: safeIso(event.ts),
        sessionId: normalizeText(event.sessionId),
        sourceRefs: [{
            eventId: normalizeText(event.id),
            sessionId: normalizeText(event.sessionId),
            occurredAt: safeIso(event.ts)
        }],
        rawEvent: event,
        stableOrder: index
    })).filter((document) => document.text);
}

function inTimeRange(document, range) {
    if (!range) {
        return true;
    }
    const value = Date.parse(document.time || '');
    if (!Number.isFinite(value)) {
        return false;
    }
    const start = Date.parse(range.start || '');
    const end = Date.parse(range.end || '');
    return (!Number.isFinite(start) || value >= start) &&
        (!Number.isFinite(end) || value <= end);
}

function denseEmbeddingText(
    value,
    maxChars = DEFAULT_DENSE_MAX_TEXT_CHARS
) {
    const text = normalizeText(value);
    const boundedMaxChars = Math.max(256, Number(maxChars) || 0);
    if (text.length <= boundedMaxChars) {
        return text;
    }
    const side = Math.floor((boundedMaxChars - 3) / 2);
    return `${text.slice(0, side)} … ${text.slice(-side)}`;
}

class StrictDenseRuntime {
    constructor(options = {}) {
        this.model = normalizeText(options.model, DEFAULT_EMBEDDING_MODEL);
        this.revision = normalizeText(
            options.revision ||
            process.env.AILIS_MEMORY_EMBEDDING_REVISION,
            this.model === DEFAULT_EMBEDDING_MODEL
                ? DEFAULT_EMBEDDING_REVISION
                : 'main'
        );
        this.enabled = options.enabled !== false;
        this.allowRemoteModels = options.allowRemoteModels !== false;
        const runtimeOptions = modelRuntimeOptions(options);
        this.remoteHost = runtimeOptions.remoteHost;
        this.cacheDir = runtimeOptions.cacheDir;
        this.injected = typeof options.embedder === 'function' ? options.embedder : null;
        this.progressCallback = typeof options.progressCallback === 'function'
            ? options.progressCallback
            : null;
        this.batchSize = Math.max(
            1,
            Math.min(
                32,
                Number(
                    options.batchSize ||
                    process.env.AILIS_MEMORY_EMBEDDING_BATCH_SIZE
                ) || DEFAULT_DENSE_BATCH_SIZE
            )
        );
        this.maxLength = Math.max(
            64,
            Math.min(
                512,
                Number(options.maxLength) || DEFAULT_DENSE_MAX_LENGTH
            )
        );
        this.maxTextChars = Math.max(
            256,
            Number(options.maxTextChars) || DEFAULT_DENSE_MAX_TEXT_CHARS
        );
        this.pipelinePromise = null;
        this.cache = new Map();
        this.runtime = this.injected ? 'injected' : 'not_loaded';
        this.lastError = '';
    }

    async ensurePipeline() {
        if (this.injected) {
            return null;
        }
        if (!this.enabled) {
            throw Object.assign(
                new Error('full hybrid retrieval requires dense embeddings'),
                { code: 'required_dense_model_unavailable' }
            );
        }
        if (!this.pipelinePromise) {
            this.pipelinePromise = (async () => {
                try {
                    let transformers;
                    try {
                        transformers = await import('@huggingface/transformers');
                        this.runtime = '@huggingface/transformers';
                    } catch {
                        transformers = await import('@xenova/transformers');
                        this.runtime = '@xenova/transformers';
                    }
                    configureTransformersEnvironment(transformers, {
                        allowRemoteModels: this.allowRemoteModels,
                        remoteHost: this.remoteHost,
                        cacheDir: this.cacheDir
                    });
                    return await transformers.pipeline(
                        'feature-extraction',
                        this.model,
                        {
                            revision: this.revision,
                            ...(this.progressCallback
                                ? { progress_callback: this.progressCallback }
                                : {})
                        }
                    );
                } catch (error) {
                    this.lastError = errorWithCause(error);
                    this.runtime = 'unavailable';
                    throw Object.assign(
                        new Error(`dense model unavailable: ${this.lastError}`),
                        { code: 'required_dense_model_unavailable' }
                    );
                }
            })();
        }
        return this.pipelinePromise;
    }

    async embed(textsToEmbed) {
        const inputs = normalizeArray(textsToEmbed).map((entry) => normalizeText(entry));
        const missing = [];
        const result = new Array(inputs.length);
        inputs.forEach((text, index) => {
            const key = createHash('sha256').update(
                `${this.model}\n${this.revision}\n${this.maxLength}\n` +
                `${this.maxTextChars}\n${text}`
            ).digest('hex');
            if (this.cache.has(key)) {
                result[index] = this.cache.get(key);
            } else {
                missing.push({ text, index, key });
            }
        });
        if (missing.length) {
            let vectors;
            if (this.injected) {
                vectors = normalizeEmbeddingOutput(
                    await this.injected(missing.map((entry) => entry.text)),
                    missing.length
                );
                this.runtime = 'injected';
            } else {
                const pipeline = await this.ensurePipeline();
                vectors = [];
                for (
                    let offset = 0;
                    offset < missing.length;
                    offset += this.batchSize
                ) {
                    const batch = missing.slice(offset, offset + this.batchSize);
                    const output = await pipeline(
                        batch.map((entry) =>
                            denseEmbeddingText(entry.text, this.maxTextChars)
                        ),
                        {
                            pooling: 'mean',
                            normalize: true,
                            truncation: true,
                            max_length: this.maxLength
                        }
                    );
                    const batchVectors = normalizeEmbeddingOutput(
                        output,
                        batch.length
                    );
                    if (
                        batchVectors.length !== batch.length ||
                        batchVectors.some((entry) => !entry?.length)
                    ) {
                        throw Object.assign(
                            new Error('dense model returned invalid batch rows'),
                            { code: 'required_dense_model_unavailable' }
                        );
                    }
                    vectors.push(...batchVectors);
                }
            }
            if (vectors.length !== missing.length || vectors.some((entry) => !entry?.length)) {
                throw Object.assign(
                    new Error('dense model returned invalid embedding rows'),
                    { code: 'required_dense_model_unavailable' }
                );
            }
            missing.forEach((entry, vectorIndex) => {
                result[entry.index] = vectors[vectorIndex];
                this.cache.set(entry.key, vectors[vectorIndex]);
            });
        }
        return result;
    }

    getStatus() {
        return {
            model: this.model,
            revision: this.revision,
            runtime: this.runtime,
            enabled: this.enabled,
            batchSize: this.batchSize,
            maxLength: this.maxLength,
            maxTextChars: this.maxTextChars,
            allowRemoteModels: this.allowRemoteModels,
            remoteHost: this.remoteHost || 'library_default',
            cacheDir: this.cacheDir || 'library_default',
            cacheSize: this.cache.size,
            lastError: this.lastError
        };
    }
}

function sigmoid(value) {
    if (value >= 0) {
        return 1 / (1 + Math.exp(-value));
    }
    const exponential = Math.exp(value);
    return exponential / (1 + exponential);
}

function softmax(values) {
    const maximum = Math.max(...values);
    const exponentials = values.map((value) => Math.exp(value - maximum));
    const denominator = exponentials.reduce((sum, value) => sum + value, 0);
    return exponentials.map((value) => value / denominator);
}

function relevantLabelIndex(config = {}, logitCount = 0) {
    const labels = config.id2label && typeof config.id2label === 'object'
        ? config.id2label
        : {};
    const entries = Object.entries(labels);
    const preferred = entries.find(([, label]) =>
        /(?:label_?1|relevant|positive|entailment)/i.test(normalizeText(label))
    );
    if (preferred && Number.isInteger(Number(preferred[0]))) {
        return Number(preferred[0]);
    }
    if (logitCount === 2) {
        return 1;
    }
    return -1;
}

function relevanceProbability(logits, config = {}) {
    const values = Array.from(logits || [], Number);
    if (values.length === 1 && Number.isFinite(values[0])) {
        return sigmoid(values[0]);
    }
    if (!values.length || values.some((value) => !Number.isFinite(value))) {
        return Number.NaN;
    }
    const relevantIndex = relevantLabelIndex(config, values.length);
    if (relevantIndex < 0 || relevantIndex >= values.length) {
        return Number.NaN;
    }
    return softmax(values)[relevantIndex];
}

function sequenceClassificationScores(output, config, expectedCount) {
    const logits = output?.logits;
    if (!logits?.data || !Array.isArray(logits?.dims)) {
        return [];
    }
    const rowCount = Number(logits.dims[0]) || 0;
    const columnCount = Number(logits.dims.at(-1)) || 0;
    if (rowCount !== expectedCount || !columnCount) {
        return [];
    }
    const data = Array.from(logits.data, Number);
    const scores = [];
    for (let row = 0; row < rowCount; row += 1) {
        scores.push(relevanceProbability(
            data.slice(row * columnCount, (row + 1) * columnCount),
            config
        ));
    }
    return scores;
}

function rerankerExcerpt(
    query,
    documentText,
    maxChars = DEFAULT_RERANKER_MAX_DOCUMENT_CHARS
) {
    const text = normalizeText(documentText);
    const boundedMaxChars = Math.max(256, Number(maxChars) || 0);
    if (text.length <= boundedMaxChars) {
        return text;
    }
    const queryTerms = [...new Set(tokens(query))]
        .filter((term) => term.length >= 3)
        .sort((left, right) => right.length - left.length);
    const lowerText = text.toLowerCase();
    const positions = queryTerms
        .map((term) => lowerText.indexOf(term.toLowerCase()))
        .filter((position) => position >= 0);
    if (!positions.length) {
        const side = Math.floor((boundedMaxChars - 3) / 2);
        return `${text.slice(0, side)} … ${text.slice(-side)}`;
    }
    const anchor = positions.sort((left, right) => {
        const leftMatches = positions.filter(
            (position) => Math.abs(position - left) <= boundedMaxChars / 2
        ).length;
        const rightMatches = positions.filter(
            (position) => Math.abs(position - right) <= boundedMaxChars / 2
        ).length;
        return rightMatches - leftMatches || left - right;
    })[0];
    const prefixChars = Math.min(320, Math.floor(boundedMaxChars * 0.15));
    const windowChars = boundedMaxChars - prefixChars - 3;
    const windowStart = Math.max(
        0,
        Math.min(
            text.length - windowChars,
            anchor - Math.floor(windowChars / 2)
        )
    );
    const window = text.slice(windowStart, windowStart + windowChars);
    if (windowStart <= prefixChars) {
        return text.slice(0, boundedMaxChars);
    }
    return `${text.slice(0, prefixChars)} … ${window}`;
}

class StrictCrossEncoderRuntime {
    constructor(options = {}) {
        this.model = normalizeText(options.model, DEFAULT_RERANKER_MODEL);
        this.revision = normalizeText(
            options.revision ||
            process.env.AILIS_MEMORY_RERANKER_REVISION,
            this.model === DEFAULT_RERANKER_MODEL
                ? DEFAULT_RERANKER_REVISION
                : 'main'
        );
        this.allowRemoteModels = options.allowRemoteModels !== false;
        const runtimeOptions = modelRuntimeOptions(options);
        this.remoteHost = runtimeOptions.remoteHost;
        this.cacheDir = runtimeOptions.cacheDir;
        this.injected = typeof options.reranker === 'function' ? options.reranker : null;
        this.progressCallback = typeof options.progressCallback === 'function'
            ? options.progressCallback
            : null;
        this.batchSize = Math.max(
            1,
            Math.min(
                32,
                Number(options.batchSize) || DEFAULT_RERANKER_BATCH_SIZE
            )
        );
        this.maxLength = Math.max(
            64,
            Math.min(
                512,
                Number(options.maxLength) || DEFAULT_RERANKER_MAX_LENGTH
            )
        );
        this.maxDocumentChars = Math.max(
            256,
            Number(options.maxDocumentChars) ||
                DEFAULT_RERANKER_MAX_DOCUMENT_CHARS
        );
        this.pipelinePromise = null;
        this.runtime = this.injected ? 'injected' : 'not_loaded';
        this.lastError = '';
    }

    async ensurePipeline() {
        if (this.injected) {
            return null;
        }
        if (!this.pipelinePromise) {
            this.pipelinePromise = (async () => {
                try {
                    let transformers;
                    try {
                        transformers = await import('@huggingface/transformers');
                        this.runtime = '@huggingface/transformers';
                    } catch {
                        transformers = await import('@xenova/transformers');
                        this.runtime = '@xenova/transformers';
                    }
                    configureTransformersEnvironment(transformers, {
                        allowRemoteModels: this.allowRemoteModels,
                        remoteHost: this.remoteHost,
                        cacheDir: this.cacheDir
                    });
                    return await transformers.pipeline(
                        'text-classification',
                        this.model,
                        {
                            revision: this.revision,
                            ...(this.progressCallback
                                ? { progress_callback: this.progressCallback }
                                : {})
                        }
                    );
                } catch (error) {
                    this.lastError = errorWithCause(error);
                    this.runtime = 'unavailable';
                    throw Object.assign(
                        new Error(`cross-encoder unavailable: ${this.lastError}`),
                        { code: 'required_cross_encoder_unavailable' }
                    );
                }
            })();
        }
        return this.pipelinePromise;
    }

    async rerank(query, entries, limit) {
        const candidates = entries.slice(0, 100);
        let scores = [];
        if (this.injected) {
            const output = await this.injected({
                query,
                documents: candidates.map((entry) => ({
                    id: entry.document.id,
                    text: entry.document.text
                }))
            });
            const byId = new Map(normalizeArray(output).map((entry, index) => [
                normalizeText(entry?.id || entry?.documentId, candidates[index]?.document.id),
                Number(entry?.score ?? entry)
            ]));
            scores = candidates.map((entry) => byId.get(entry.document.id));
            this.runtime = 'injected';
        } else {
            const pipeline = await this.ensurePipeline();
            for (let offset = 0; offset < candidates.length; offset += this.batchSize) {
                const batch = candidates.slice(offset, offset + this.batchSize);
                const modelInputs = pipeline.tokenizer(
                    batch.map(() => query),
                    {
                        text_pair: batch.map((entry) =>
                            rerankerExcerpt(
                                query,
                                entry.document.text,
                                this.maxDocumentChars
                            )
                        ),
                        padding: true,
                        truncation: true,
                        max_length: this.maxLength
                    }
                );
                const output = await pipeline.model(modelInputs);
                const batchScores = sequenceClassificationScores(
                    output,
                    pipeline.model?.config || {},
                    batch.length
                );
                if (
                    batchScores.length !== batch.length ||
                    batchScores.some((score) => !Number.isFinite(score))
                ) {
                    throw Object.assign(
                        new Error('cross-encoder returned invalid batch scores'),
                        { code: 'required_cross_encoder_unavailable' }
                    );
                }
                scores.push(...batchScores);
            }
        }
        if (scores.length !== candidates.length ||
            scores.some((score) => !Number.isFinite(score))) {
            throw Object.assign(
                new Error('cross-encoder returned invalid scores'),
                { code: 'required_cross_encoder_unavailable' }
            );
        }
        return candidates.map((entry, index) => ({
            ...entry,
            crossEncoderScore: scores[index]
        })).sort((left, right) =>
            right.crossEncoderScore - left.crossEncoderScore ||
            right.score - left.score
        ).slice(0, limit);
    }

    getStatus() {
        return {
            model: this.model,
            revision: this.revision,
            runtime: this.runtime,
            batchSize: this.batchSize,
            maxLength: this.maxLength,
            maxDocumentChars: this.maxDocumentChars,
            allowRemoteModels: this.allowRemoteModels,
            remoteHost: this.remoteHost || 'library_default',
            cacheDir: this.cacheDir || 'library_default',
            lastError: this.lastError
        };
    }
}

class AILISHybridFullMemory {
    constructor(options = {}) {
        this.queryPlanner = typeof options.queryPlanner === 'function'
            ? options.queryPlanner
            : null;
        this.dense = new StrictDenseRuntime({
            enabled: options.enableLocalEmbeddings !== false,
            allowRemoteModels: options.allowRemoteModels,
            model: options.embeddingModel,
            revision: options.embeddingRevision,
            remoteHost: options.modelRemoteHost,
            cacheDir: options.modelCacheDir,
            embedder: options.embedder
        });
        this.crossEncoder = new StrictCrossEncoderRuntime({
            allowRemoteModels: options.allowRemoteModels,
            model: options.rerankerModel,
            revision: options.rerankerRevision,
            remoteHost: options.modelRemoteHost,
            cacheDir: options.modelCacheDir,
            reranker: options.reranker
        });
        this.lastDiagnostics = null;
    }

    async plan(query, questionTime) {
        const normalizedQuery = normalizeText(query);
        if (!this.queryPlanner) {
            return normalizePlan(null, normalizedQuery);
        }
        const result = await this.queryPlanner({
            messages: [
                {
                    role: 'system',
                    content: [
                        'Analyze a Persona-memory question and return retrieval guidance only.',
                        'Do not answer the question.',
                        'Return JSON with searchQueries, targetEntities, timeRange, and retrievalGuidance.',
                        'Use the reference time only to ground explicit temporal language.'
                    ].join('\n')
                },
                {
                    role: 'user',
                    content: JSON.stringify({
                        question: normalizedQuery,
                        referenceTime: safeIso(questionTime)
                    })
                }
            ],
            jsonMode: true,
            expectJson: true,
            temperature: 0,
            max_tokens: 1_500,
            timeoutMs: 60_000
        });
        if (result?.ok === false) {
            throw new Error(result.error || result.message || 'hybrid query planner failed');
        }
        const parsed = llmObject(result);
        if (!parsed) {
            throw new Error('hybrid query planner returned invalid JSON');
        }
        return normalizePlan(parsed, normalizedQuery);
    }

    async denseRank(documents, queries) {
        const queryVectors = await this.dense.embed(
            queries.map((query) => `query: ${query}`)
        );
        const documentVectors = await this.dense.embed(
            documents.map((document) => `passage: ${document.text}`)
        );
        return documents.map((document, index) => ({
            document,
            score: queryVectors.reduce(
                (best, vector) => Math.max(
                    best,
                    cosineSimilarity(vector, documentVectors[index])
                ),
                -1
            )
        })).sort((left, right) => right.score - left.score)
            .map((entry, index) => ({ ...entry, rank: index + 1 }));
    }

    async search({
        query = '',
        events = [],
        limit = 10,
        questionTime = ''
    } = {}) {
        const documents = rawDocuments(events);
        const plan = await this.plan(query, questionTime);
        const eligible = documents.filter((document) => inTimeRange(document, plan.timeRange));
        const sparseQueries = plan.searchQueries.map((searchQuery) =>
            bm25Rank(eligible, searchQuery, {
                textSelector: (document) => [
                    document.userText,
                    document.userText,
                    document.assistantText,
                    normalizeArray(document.aliases).join(' '),
                    normalizeArray(document.aliases).join(' ')
                ].filter(Boolean).join(' ')
            })
        );
        const sparse = reciprocalRankFusion(
            sparseQueries,
            sparseQueries.map(() => 1)
        ).map((entry, index) => ({
            document: entry.document,
            score: entry.score,
            rank: index + 1
        }));
        const dense = await this.denseRank(eligible, plan.searchQueries);
        const entity = plan.targetEntities.length
            ? bm25Rank(eligible, plan.targetEntities.join(' '), {
                textSelector: (document) => [
                    document.text,
                    normalizeArray(document.aliases).join(' ')
                ].join(' ')
            })
            : [];
        const temporal = plan.timeRange
            ? eligible.slice().sort((left, right) =>
                String(right.time || '').localeCompare(String(left.time || ''))
            ).map((document, index) => ({
                document,
                score: 1 / (index + 1),
                rank: index + 1
            }))
            : [];
        const channels = [sparse, dense];
        const weights = [1, 1.15];
        if (entity.length) {
            channels.push(entity);
            weights.push(0.9);
        }
        if (temporal.length) {
            channels.push(temporal);
            weights.push(0.75);
        }
        const fused = reciprocalRankFusion(channels, weights);
        const boundedLimit = Math.max(1, Math.min(Number(limit) || 10, 200));
        const reranked = await this.crossEncoder.rerank(
            normalizeText(query),
            fused,
            boundedLimit
        );
        const selectedDocuments = reranked.map((entry) => ({
            ...entry.document,
            scores: {
                fused: entry.score,
                crossEncoder: entry.crossEncoderScore,
                channels: entry.components
            }
        }));
        this.lastDiagnostics = {
            fidelity: 'native_ailis_full_implementation',
            rawTurnCount: documents.length,
            eligibleTurnCount: eligible.length,
            channelCount: channels.length,
            fusedCandidateCount: fused.length,
            rerankedCandidateCount: reranked.length,
            dense: this.dense.getStatus(),
            crossEncoder: this.crossEncoder.getStatus()
        };
        return {
            ok: true,
            plan,
            documents: selectedDocuments,
            events: selectedDocuments.map((document) => document.rawEvent).filter(Boolean),
            contextText: '',
            diagnostics: this.lastDiagnostics
        };
    }

    getStatus() {
        return {
            fidelity: 'native_ailis_full_implementation',
            dense: this.dense.getStatus(),
            crossEncoder: this.crossEncoder.getStatus(),
            lastDiagnostics: this.lastDiagnostics
        };
    }
}

module.exports = {
    AILISHybridFullMemory,
    DEFAULT_DENSE_BATCH_SIZE,
    DEFAULT_DENSE_MAX_LENGTH,
    DEFAULT_DENSE_MAX_TEXT_CHARS,
    DEFAULT_EMBEDDING_MODEL,
    DEFAULT_EMBEDDING_REVISION,
    DEFAULT_RERANKER_BATCH_SIZE,
    DEFAULT_RERANKER_MAX_DOCUMENT_CHARS,
    DEFAULT_RERANKER_MAX_LENGTH,
    DEFAULT_RERANKER_MODEL,
    DEFAULT_RERANKER_REVISION,
    StrictCrossEncoderRuntime,
    StrictDenseRuntime,
    bm25Rank,
    configureTransformersEnvironment,
    cosineSimilarity,
    denseEmbeddingText,
    modelRuntimeOptions,
    rawDocuments,
    reciprocalRankFusion,
    relevanceProbability,
    rerankerExcerpt,
    sequenceClassificationScores
};
