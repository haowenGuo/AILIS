'use strict';

const MEMORY_RETRIEVAL_STRATEGY_ID = 'bm25_phrase_v2';
const BM25_K1 = 1.2;
const BM25_B = 0.72;
const PHRASE_BOOST = 0.28;
const NUMERIC_BOOST = 0.45;
const RECENCY_BOOST = 0.08;
const IMPORTANCE_BOOST = 0.02;
const SESSION_REPEAT_PENALTY = 0.2;
const DEFAULT_LIMIT = 8;

const STOP_WORDS = new Set([
    'a', 'about', 'after', 'again', 'all', 'also', 'am', 'an', 'and', 'answer', 'any',
    'are', 'as', 'at', 'based', 'be', 'because', 'been', 'before', 'being', 'between',
    'both', 'but', 'by', 'can', 'conversation', 'conversations', 'could', 'current',
    'date', 'did', 'do', 'does', 'doing', 'during', 'each', 'for', 'from', 'had', 'has',
    'have', 'having', 'he', 'her', 'here', 'hers', 'him', 'his', 'how', 'i', 'if', 'in',
    'into', 'is', 'it', 'its', 'just', 'me', 'memory', 'more', 'most', 'my', 'of', 'on',
    'once', 'or', 'other', 'our', 'ours', 'past', 'please', 'question', 'remember',
    'same', 'she', 'should', 'so', 'some', 'than', 'that', 'the', 'their', 'theirs',
    'them', 'then', 'there', 'these', 'they', 'this', 'those', 'through', 'to', 'too',
    'until', 'up', 'us', 'user', 'very', 'was', 'we', 'were', 'what', 'when', 'where',
    'which', 'while', 'who', 'why', 'will', 'with', 'would', 'you', 'your', 'yours'
]);

function normalizeText(value, fallback = '') {
    if (typeof value !== 'string') {
        return fallback;
    }
    const normalized = value.normalize('NFKC').replace(/\s+/g, ' ').trim();
    return normalized || fallback;
}

function stemToken(value = '') {
    const token = normalizeText(value).toLowerCase();
    if (token.length <= 3 || /^\d+$/.test(token)) {
        return token;
    }
    if (token.length > 5 && token.endsWith('ies')) {
        return /[bcdfghjklmnpqrstvwxyz]ies$/.test(token)
            ? `${token.slice(0, -3)}y`
            : token.slice(0, -1);
    }
    if (token.length > 6 && token.endsWith('ing')) {
        const stemmed = token.slice(0, -3);
        return /([a-z])\1$/.test(stemmed) ? stemmed.slice(0, -1) : stemmed;
    }
    if (token.length > 5 && token.endsWith('ed')) {
        const stemmed = token.slice(0, -2);
        return /([a-z])\1$/.test(stemmed) ? stemmed.slice(0, -1) : stemmed;
    }
    if (token.length > 5 && token.endsWith('es')) {
        return /(?:s|x|z|ch|sh)es$/.test(token)
            ? token.slice(0, -2)
            : token.slice(0, -1);
    }
    if (token.length > 4 && token.endsWith('s')) {
        return token.slice(0, -1);
    }
    return token;
}

function memorySearchTokens(text, { includeStopWords = false } = {}) {
    const normalized = normalizeText(text).toLowerCase();
    const tokens = [];
    for (const rawToken of normalized.match(/[a-z0-9]+/g) || []) {
        const token = stemToken(rawToken);
        if (token.length >= 2 && (includeStopWords || !STOP_WORDS.has(token))) {
            tokens.push(token);
        }
    }
    const cjkRuns = normalized.match(/[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]+/gu) || [];
    for (const run of cjkRuns) {
        const characters = [...run];
        if (characters.length === 1) {
            tokens.push(characters[0]);
            continue;
        }
        for (let index = 0; index < characters.length - 1; index += 1) {
            tokens.push(characters.slice(index, index + 2).join(''));
        }
    }
    return tokens;
}

function memorySearchPhrases(query = '') {
    const tokens = memorySearchTokens(query);
    const phrases = [];
    for (const size of [3, 2]) {
        for (let index = 0; index <= tokens.length - size; index += 1) {
            const phrase = tokens.slice(index, index + size).join(' ');
            if (!phrases.includes(phrase)) {
                phrases.push(phrase);
            }
        }
    }
    return phrases.slice(0, 24);
}

function addTokenFrequency(tokens = [], weight = 1, target = new Map()) {
    for (const token of tokens) {
        target.set(token, (target.get(token) || 0) + weight);
    }
    return target;
}

function selectWithSoftSessionDiversity(
    scored = [],
    limit = DEFAULT_LIMIT,
    sessionRepeatPenalty = SESSION_REPEAT_PENALTY
) {
    const pool = [...scored];
    const selected = [];
    const sessionCounts = new Map();
    const boundedLimit = Math.max(1, Number(limit) || DEFAULT_LIMIT);
    while (selected.length < boundedLimit && pool.length) {
        let bestIndex = -1;
        let bestAdjustedScore = Number.NEGATIVE_INFINITY;
        for (let index = 0; index < pool.length; index += 1) {
            const sessionId = normalizeText(pool[index].event?.sessionId, 'main');
            const repeatCount = sessionCounts.get(sessionId) || 0;
            const adjustedScore = pool[index].score /
                (1 + repeatCount * sessionRepeatPenalty);
            if (
                adjustedScore > bestAdjustedScore ||
                (
                    adjustedScore === bestAdjustedScore &&
                    pool[index].index > (pool[bestIndex]?.index ?? -1)
                )
            ) {
                bestIndex = index;
                bestAdjustedScore = adjustedScore;
            }
        }
        const [best] = pool.splice(bestIndex, 1);
        const sessionId = normalizeText(best.event?.sessionId, 'main');
        sessionCounts.set(sessionId, (sessionCounts.get(sessionId) || 0) + 1);
        selected.push({ ...best, adjustedScore: bestAdjustedScore });
    }
    return selected;
}

function rankMemoryEvents(events = [], query = '', { limit = DEFAULT_LIMIT } = {}) {
    const startedAt = process.hrtime.bigint();
    const normalizedQuery = normalizeText(query);
    const sourceEvents = Array.isArray(events) ? events : [];
    const boundedLimit = Math.max(1, Number(limit) || DEFAULT_LIMIT);
    const queryTokens = [...new Set(memorySearchTokens(normalizedQuery))];
    const queryPhrases = memorySearchPhrases(normalizedQuery);
    const documents = sourceEvents.map((event, index) => {
        const userTokens = memorySearchTokens(event.userText);
        const assistantTokens = memorySearchTokens(event.assistantText);
        const tagTokens = memorySearchTokens(
            Array.isArray(event.tags) ? event.tags.join(' ') : ''
        );
        const frequencies = new Map();
        addTokenFrequency(userTokens, 1.15, frequencies);
        addTokenFrequency(assistantTokens, 1, frequencies);
        addTokenFrequency(tagTokens, 1.4, frequencies);
        const orderedTokens = [...userTokens, ...assistantTokens, ...tagTokens];
        return {
            event,
            index,
            frequencies,
            tokenSet: new Set(orderedTokens),
            orderedTokenText: ` ${orderedTokens.join(' ')} `,
            length: Math.max(1, orderedTokens.length)
        };
    });
    const documentFrequency = new Map();
    for (const document of documents) {
        for (const token of document.tokenSet) {
            documentFrequency.set(token, (documentFrequency.get(token) || 0) + 1);
        }
    }
    const averageLength = documents.length
        ? documents.reduce((sum, document) => sum + document.length, 0) / documents.length
        : 1;
    const corpusSize = Math.max(1, documents.length);
    const scored = documents
        .map((document) => {
            let relevance = 0;
            for (const token of queryTokens) {
                const frequency = Number(document.frequencies.get(token)) || 0;
                if (!frequency) {
                    continue;
                }
                const containingDocuments = Number(documentFrequency.get(token)) || 0;
                const inverseDocumentFrequency = Math.log(
                    1 + (corpusSize - containingDocuments + 0.5) /
                        (containingDocuments + 0.5)
                );
                const lengthNormalization = BM25_K1 * (
                    1 - BM25_B + BM25_B * document.length / Math.max(1, averageLength)
                );
                relevance += inverseDocumentFrequency *
                    (frequency * (BM25_K1 + 1)) /
                    (frequency + lengthNormalization);
                if (/^\d+$/.test(token)) {
                    relevance += inverseDocumentFrequency * NUMERIC_BOOST;
                }
            }
            for (const phrase of queryPhrases) {
                if (document.orderedTokenText.includes(` ${phrase} `)) {
                    relevance += phrase.split(' ').length * PHRASE_BOOST;
                }
            }
            const recency = document.index / Math.max(1, sourceEvents.length - 1);
            const importance = Math.max(0, Number(document.event.importance) || 0);
            return {
                event: document.event,
                index: document.index,
                relevance,
                score: relevance + recency * RECENCY_BOOST + importance * IMPORTANCE_BOOST
            };
        })
        .filter((entry) => !normalizedQuery || !queryTokens.length || entry.relevance > 0)
        .sort((left, right) => right.score - left.score || right.index - left.index);
    const selected = selectWithSoftSessionDiversity(scored, boundedLimit);
    const elapsedMs = Number(process.hrtime.bigint() - startedAt) / 1e6;
    return {
        ok: true,
        strategy: MEMORY_RETRIEVAL_STRATEGY_ID,
        query: normalizedQuery,
        events: selected.map((entry) => ({
            ...entry.event,
            retrieval: {
                relevance: entry.relevance,
                score: entry.score,
                adjustedScore: entry.adjustedScore
            }
        })),
        diagnostics: {
            implementationVersion: 'adaptive_lexical_v2',
            indexBackend: 'in_memory_bm25_mmr_v2',
            corpusEventCount: sourceEvents.length,
            candidateCount: scored.length,
            queryTokenCount: queryTokens.length,
            queryPhraseCount: queryPhrases.length,
            sessionRepeatPenalty: SESSION_REPEAT_PENALTY,
            elapsedMs
        }
    };
}

function sentenceSegments(text = '') {
    const normalized = normalizeText(text);
    if (!normalized) {
        return [];
    }
    if (typeof Intl?.Segmenter === 'function') {
        const values = [...new Intl.Segmenter(undefined, { granularity: 'sentence' }).segment(normalized)]
            .map((entry) => normalizeText(entry.segment))
            .filter(Boolean);
        if (values.length) {
            return values;
        }
    }
    return normalized.split(/(?<=[.!?。！？])\s*/u).map(normalizeText).filter(Boolean);
}

function selectRelevantMemoryExcerpt(value, query, maxChars = 260) {
    const text = normalizeText(value);
    if (!text || text.length <= maxChars) {
        return text;
    }
    const queryTerms = [...new Set(memorySearchTokens(query))];
    if (!queryTerms.length) {
        return `${text.slice(0, Math.max(0, maxChars - 1))}…`;
    }
    const ranked = sentenceSegments(text)
        .map((sentence, index) => {
            const terms = new Set(memorySearchTokens(sentence));
            const matched = queryTerms.filter((term) => terms.has(term));
            return {
                sentence,
                index,
                score: matched.length * 10 +
                    matched.reduce((sum, term) => sum + Math.min(8, [...term].length), 0)
            };
        })
        .filter((entry) => entry.score > 0)
        .sort((left, right) => right.score - left.score || left.index - right.index);
    if (!ranked.length) {
        return `${text.slice(0, Math.max(0, maxChars - 1))}…`;
    }
    const selected = [];
    let used = 0;
    for (const entry of ranked) {
        const remaining = maxChars - used - (selected.length ? 3 : 0);
        if (remaining <= 12) {
            break;
        }
        const sentence = entry.sentence.length > remaining
            ? `${entry.sentence.slice(0, Math.max(1, remaining - 1))}…`
            : entry.sentence;
        selected.push({ ...entry, sentence });
        used += sentence.length + (selected.length > 1 ? 3 : 0);
    }
    return selected
        .sort((left, right) => left.index - right.index)
        .map((entry) => entry.sentence)
        .join(' … ')
        .slice(0, maxChars);
}

module.exports = {
    MEMORY_RETRIEVAL_STRATEGY_ID,
    SESSION_REPEAT_PENALTY,
    memorySearchPhrases,
    memorySearchTokens,
    rankMemoryEvents,
    selectRelevantMemoryExcerpt,
    selectWithSoftSessionDiversity
};
