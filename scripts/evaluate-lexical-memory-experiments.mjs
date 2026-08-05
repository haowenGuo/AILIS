import crypto from 'node:crypto';
import fs from 'node:fs';
import fsPromises from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
    buildChronologicalSessions,
    pairLongMemEvalSession
} from './ailis-longmemeval-runtime.mjs';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPT_DIR, '..');
const DEFAULT_LONGMEM_RUN = path.join(
    REPO_ROOT,
    'eval-results',
    'longmemeval-ailis',
    'self-runtime-full500-parallel10-codex-gpt55-20260729-v1'
);
const DEFAULT_LOCOMO_RUN = path.join(
    REPO_ROOT,
    'eval-results',
    'locomo-ailis',
    'hybrid-rrf-ledger-v3-sharedstate-v2-20260804'
);
const DEFAULT_BASELINE_DIAGNOSTICS = path.join(
    'retrieval-bm25-phrase-v1-retrieval-request-20260804',
    'diagnostics.jsonl'
);
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
const KS = [1, 5, 8, 20];

function parseArgs(argv) {
    const args = {
        suite: 'longmem',
        runDir: '',
        outputDir: '',
        limit: 0,
        parityOnly: false,
        configPattern: ''
    };
    for (let index = 0; index < argv.length; index += 1) {
        const token = argv[index];
        const next = argv[index + 1];
        if (token === '--suite' && next) {
            args.suite = next.toLowerCase();
            index += 1;
        } else if (token === '--run-dir' && next) {
            args.runDir = path.resolve(next);
            index += 1;
        } else if (token === '--output-dir' && next) {
            args.outputDir = path.resolve(next);
            index += 1;
        } else if (token === '--limit' && next) {
            args.limit = Math.max(0, Math.trunc(Number(next) || 0));
            index += 1;
        } else if (token === '--parity-only') {
            args.parityOnly = true;
        } else if (token === '--config-pattern' && next) {
            args.configPattern = next;
            index += 1;
        } else {
            throw new Error(`Unknown argument: ${token}`);
        }
    }
    if (!['longmem', 'locomo'].includes(args.suite)) {
        throw new Error(`Unsupported suite: ${args.suite}`);
    }
    return args;
}

function normalizeText(value, fallback = '') {
    if (typeof value !== 'string') return fallback;
    const normalized = value.replace(/\s+/g, ' ').trim();
    return normalized || fallback;
}

function stemToken(value = '') {
    const token = normalizeText(value).toLowerCase();
    if (token.length <= 3 || /^\d+$/.test(token)) return token;
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
    if (token.length > 4 && token.endsWith('s')) return token.slice(0, -1);
    return token;
}

function tokenize(text, { includeStopWords = false } = {}) {
    const normalized = normalizeText(text).toLowerCase();
    const tokens = [];
    for (const rawToken of normalized.match(/[a-z0-9]+/g) || []) {
        const token = stemToken(rawToken);
        if (token.length >= 2 && (includeStopWords || !STOP_WORDS.has(token))) {
            tokens.push(token);
        }
    }
    const chineseOnly = normalized.replace(/[^\u4e00-\u9fff]/g, '');
    for (let index = 0; index < chineseOnly.length - 1; index += 1) {
        tokens.push(chineseOnly.slice(index, index + 2));
    }
    return tokens;
}

function frequencies(tokens) {
    const result = new Map();
    for (const token of tokens) result.set(token, (result.get(token) || 0) + 1);
    return result;
}

function phrases(tokens) {
    const result = [];
    for (const size of [3, 2]) {
        for (let index = 0; index <= tokens.length - size; index += 1) {
            const phrase = tokens.slice(index, index + size).join(' ');
            if (!result.includes(phrase)) result.push(phrase);
        }
    }
    return result.slice(0, 24);
}

function parseJsonl(raw) {
    return String(raw || '')
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => JSON.parse(line));
}

async function findStateRoots(shardsRoot) {
    const roots = new Map();
    const workers = (await fsPromises.readdir(shardsRoot, { withFileTypes: true }))
        .filter((entry) => entry.isDirectory() && entry.name.startsWith('worker-'));
    for (const worker of workers) {
        const stateRoot = path.join(shardsRoot, worker.name, 'state');
        const questionDirs = await fsPromises.readdir(stateRoot, { withFileTypes: true });
        for (const questionDir of questionDirs) {
            if (questionDir.isDirectory()) {
                roots.set(questionDir.name, path.join(stateRoot, questionDir.name));
            }
        }
    }
    return roots;
}

function splitFor(questionId) {
    const byte = crypto.createHash('sha256').update(questionId).digest()[0];
    return byte < 153 ? 'development' : 'holdout';
}

function buildEvidence(entry) {
    const sessionIds = new Set(
        Array.isArray(entry.answer_session_ids)
            ? entry.answer_session_ids.map((value) => normalizeText(value)).filter(Boolean)
            : []
    );
    const turnKeys = new Set();
    for (const session of buildChronologicalSessions(entry)) {
        pairLongMemEvalSession(session.messages).forEach((pair, pairIndex) => {
            const hasAnswer = pair.messageIndexes.some(
                (messageIndex) => session.messages[messageIndex]?.has_answer === true
            );
            if (hasAnswer) {
                const occurredAt = new Date(session.timestamp + pairIndex * 1000).toISOString();
                turnKeys.add(`${session.sessionId}\u0000${occurredAt}`);
            }
        });
    }
    return {
        sessionIds,
        turnKeys,
        answerable: sessionIds.size > 0 && !normalizeText(entry.question_id).includes('_abs')
    };
}

function buildIndex(events, query) {
    const documents = events.map((event, index) => {
        const userTokens = tokenize(event.userText);
        const assistantTokens = tokenize(event.assistantText);
        const tagTokens = tokenize(Array.isArray(event.tags) ? event.tags.join(' ') : '');
        const orderedTokens = [...userTokens, ...assistantTokens, ...tagTokens];
        return {
            event,
            index,
            sessionId: normalizeText(event.sessionId, `event:${index}`),
            userTf: frequencies(userTokens),
            assistantTf: frequencies(assistantTokens),
            tagTf: frequencies(tagTokens),
            userSet: new Set(userTokens),
            assistantSet: new Set(assistantTokens),
            tokenSet: new Set(orderedTokens),
            orderedTokenText: ` ${orderedTokens.join(' ')} `,
            userLength: Math.max(1, userTokens.length),
            assistantLength: Math.max(1, assistantTokens.length),
            tagLength: Math.max(1, tagTokens.length),
            length: Math.max(1, orderedTokens.length),
            prefixes: new Set(orderedTokens.filter((token) => token.length >= 5).map((token) => token.slice(0, 4)))
        };
    });
    const documentFrequency = new Map();
    const prefixFrequency = new Map();
    for (const document of documents) {
        for (const token of document.tokenSet) {
            documentFrequency.set(token, (documentFrequency.get(token) || 0) + 1);
        }
        for (const prefix of document.prefixes) {
            prefixFrequency.set(prefix, (prefixFrequency.get(prefix) || 0) + 1);
        }
    }
    const sessionMembers = new Map();
    for (const document of documents) {
        if (!sessionMembers.has(document.sessionId)) sessionMembers.set(document.sessionId, []);
        sessionMembers.get(document.sessionId).push(document.index);
    }
    const neighbors = new Map();
    for (const indexes of sessionMembers.values()) {
        indexes.forEach((documentIndex, position) => {
            neighbors.set(documentIndex, [indexes[position - 1], indexes[position + 1]].filter(Number.isFinite));
        });
    }
    const queryTokens = [...new Set(tokenize(query))];
    return {
        documents,
        documentFrequency,
        prefixFrequency,
        neighbors,
        queryTokens,
        queryPhrases: phrases(tokenize(query)),
        averageUserLength: documents.length
            ? documents.reduce((sum, document) => sum + document.userLength, 0) / documents.length
            : 1,
        averageAssistantLength: documents.length
            ? documents.reduce((sum, document) => sum + document.assistantLength, 0) / documents.length
            : 1,
        averageTagLength: documents.length
            ? documents.reduce((sum, document) => sum + document.tagLength, 0) / documents.length
            : 1,
        averageLength: documents.length
            ? documents.reduce((sum, document) => sum + document.length, 0) / documents.length
            : 1,
        corpusSize: Math.max(1, documents.length)
    };
}

const BASE = Object.freeze({
    k1: 1.2,
    b: 0.72,
    userWeight: 1.15,
    assistantWeight: 1,
    tagWeight: 1.4,
    phraseBoost: 0.28,
    numericBoost: 0.45,
    recencyWeight: 0.08,
    importanceWeight: 0.02,
    maxPerSession: 2,
    prefixWeight: 0,
    neighborWeight: 0,
    sessionWeight: 0
});

function bm25Scores(index, settings = BASE, queryWeights = null) {
    const config = { ...BASE, ...settings };
    const tokenWeights = queryWeights || new Map(index.queryTokens.map((token) => [token, 1]));
    const scores = index.documents.map((document) => {
        let relevance = 0;
        for (const [token, queryWeight] of tokenWeights) {
            const frequency =
                (document.userTf.get(token) || 0) * config.userWeight +
                (document.assistantTf.get(token) || 0) * config.assistantWeight +
                (document.tagTf.get(token) || 0) * config.tagWeight;
            if (!frequency) continue;
            const containingDocuments = index.documentFrequency.get(token) || 0;
            const idf = Math.log(
                1 + (index.corpusSize - containingDocuments + 0.5) /
                    (containingDocuments + 0.5)
            );
            const normalization = config.k1 * (
                1 - config.b + config.b * document.length / Math.max(1, index.averageLength)
            );
            relevance += queryWeight * idf *
                (frequency * (config.k1 + 1)) /
                (frequency + normalization);
            if (/^\d+$/.test(token)) relevance += queryWeight * idf * config.numericBoost;
        }
        if (config.prefixWeight > 0) {
            for (const token of index.queryTokens) {
                if (token.length < 5 || document.tokenSet.has(token)) continue;
                const prefix = token.slice(0, 4);
                if (!document.prefixes.has(prefix)) continue;
                const containingDocuments = index.prefixFrequency.get(prefix) || 0;
                const idf = Math.log(
                    1 + (index.corpusSize - containingDocuments + 0.5) /
                        (containingDocuments + 0.5)
                );
                relevance += idf * config.prefixWeight;
            }
        }
        for (const phrase of index.queryPhrases) {
            if (document.orderedTokenText.includes(` ${phrase} `)) {
                relevance += phrase.split(' ').length * config.phraseBoost;
            }
        }
        return {
            document,
            relevance,
            score: relevance +
                document.index / Math.max(1, index.documents.length - 1) * config.recencyWeight +
                Math.max(0, Number(document.event.importance) || 0) * config.importanceWeight
        };
    });
    if (config.neighborWeight > 0) {
        const raw = scores.map((entry) => entry.relevance);
        for (const entry of scores) {
            const nearby = index.neighbors.get(entry.document.index) || [];
            const neighborScore = nearby.length ? Math.max(...nearby.map((neighbor) => raw[neighbor])) : 0;
            entry.relevance += neighborScore * config.neighborWeight;
            entry.score += neighborScore * config.neighborWeight;
        }
    }
    if (config.sessionWeight > 0) {
        const maxima = new Map();
        for (const entry of scores) {
            maxima.set(
                entry.document.sessionId,
                Math.max(maxima.get(entry.document.sessionId) || 0, entry.relevance)
            );
        }
        for (const entry of scores) {
            const prior = maxima.get(entry.document.sessionId) || 0;
            entry.relevance += prior * config.sessionWeight;
            entry.score += prior * config.sessionWeight;
        }
    }
    return scores;
}

function bm25fScores(index, settings = {}, queryWeights = null) {
    const config = {
        ...BASE,
        userB: 0.72,
        assistantB: 0.72,
        tagB: 0.2,
        ...settings
    };
    const tokenWeights = queryWeights || new Map(index.queryTokens.map((token) => [token, 1]));
    const scores = index.documents.map((document) => {
        let relevance = 0;
        for (const [token, queryWeight] of tokenWeights) {
            const userTf = (document.userTf.get(token) || 0) /
                (1 - config.userB + config.userB * document.userLength / index.averageUserLength);
            const assistantTf = (document.assistantTf.get(token) || 0) /
                (1 - config.assistantB + config.assistantB * document.assistantLength / index.averageAssistantLength);
            const tagTf = (document.tagTf.get(token) || 0) /
                (1 - config.tagB + config.tagB * document.tagLength / index.averageTagLength);
            const frequency = userTf * config.userWeight +
                assistantTf * config.assistantWeight +
                tagTf * config.tagWeight;
            if (!frequency) continue;
            const containingDocuments = index.documentFrequency.get(token) || 0;
            const idf = Math.log(
                1 + (index.corpusSize - containingDocuments + 0.5) /
                    (containingDocuments + 0.5)
            );
            relevance += queryWeight * idf *
                (frequency * (config.k1 + 1)) /
                (frequency + config.k1);
            if (/^\d+$/.test(token)) relevance += queryWeight * idf * config.numericBoost;
        }
        if (config.prefixWeight > 0) {
            for (const token of index.queryTokens) {
                if (token.length < 5 || document.tokenSet.has(token)) continue;
                const prefix = token.slice(0, 4);
                if (!document.prefixes.has(prefix)) continue;
                const containingDocuments = index.prefixFrequency.get(prefix) || 0;
                const idf = Math.log(
                    1 + (index.corpusSize - containingDocuments + 0.5) /
                        (containingDocuments + 0.5)
                );
                relevance += idf * config.prefixWeight;
            }
        }
        for (const phrase of index.queryPhrases) {
            if (document.orderedTokenText.includes(` ${phrase} `)) {
                relevance += phrase.split(' ').length * config.phraseBoost;
            }
        }
        return {
            document,
            relevance,
            score: relevance +
                document.index / Math.max(1, index.documents.length - 1) * config.recencyWeight +
                Math.max(0, Number(document.event.importance) || 0) * config.importanceWeight
        };
    });
    return scores;
}

function selectScores(scores, limit, maxPerSession) {
    const ranked = [...scores]
        .filter((entry) => entry.relevance > 0)
        .sort((left, right) => right.score - left.score || right.document.index - left.document.index);
    const selected = [];
    const deferred = [];
    const sessionCounts = new Map();
    for (const entry of ranked) {
        const count = sessionCounts.get(entry.document.sessionId) || 0;
        if (count >= maxPerSession) {
            deferred.push(entry);
            continue;
        }
        selected.push(entry);
        sessionCounts.set(entry.document.sessionId, count + 1);
        if (selected.length >= limit) break;
    }
    if (selected.length < limit) {
        const selectedIndexes = new Set(selected.map((entry) => entry.document.index));
        for (const entry of deferred) {
            if (selectedIndexes.has(entry.document.index)) continue;
            selected.push(entry);
            if (selected.length >= limit) break;
        }
    }
    return selected;
}

function selectDiverse(scores, limit, uniqueSlots) {
    const ranked = [...scores]
        .filter((entry) => entry.relevance > 0)
        .sort((left, right) => right.score - left.score || right.document.index - left.document.index);
    const bestBySession = new Map();
    for (const entry of ranked) {
        if (!bestBySession.has(entry.document.sessionId)) {
            bestBySession.set(entry.document.sessionId, entry);
        }
    }
    const selected = [...bestBySession.values()].slice(0, uniqueSlots);
    const selectedIndexes = new Set(selected.map((entry) => entry.document.index));
    for (const entry of ranked) {
        if (selectedIndexes.has(entry.document.index)) continue;
        selected.push(entry);
        selectedIndexes.add(entry.document.index);
        if (selected.length >= limit) break;
    }
    return selected
        .sort((left, right) => right.score - left.score || right.document.index - left.document.index)
        .slice(0, limit);
}

function selectMmr(scores, limit, sessionPenalty, preserveTop = 0) {
    const candidates = [...scores]
        .filter((entry) => entry.relevance > 0)
        .sort((left, right) => right.score - left.score || right.document.index - left.document.index);
    const selected = candidates.slice(0, Math.max(0, Math.min(preserveTop, limit)));
    const selectedIndexes = new Set(selected.map((entry) => entry.document.index));
    const sessionCounts = new Map();
    for (const entry of selected) {
        sessionCounts.set(entry.document.sessionId, (sessionCounts.get(entry.document.sessionId) || 0) + 1);
    }
    while (selected.length < limit && selected.length < candidates.length) {
        let best = null;
        let bestAdjusted = Number.NEGATIVE_INFINITY;
        for (const entry of candidates) {
            if (selectedIndexes.has(entry.document.index)) continue;
            const count = sessionCounts.get(entry.document.sessionId) || 0;
            const adjusted = entry.score / (1 + count * sessionPenalty);
            if (
                adjusted > bestAdjusted ||
                (adjusted === bestAdjusted && entry.document.index > (best?.document.index ?? -1))
            ) {
                best = entry;
                bestAdjusted = adjusted;
            }
        }
        if (!best) break;
        selected.push(best);
        selectedIndexes.add(best.document.index);
        sessionCounts.set(best.document.sessionId, (sessionCounts.get(best.document.sessionId) || 0) + 1);
    }
    return selected;
}

function expandQuery(index, firstStage, config) {
    const querySet = new Set(index.queryTokens);
    const feedback = firstStage.slice(0, config.feedbackDocs);
    const candidates = new Map();
    for (const entry of feedback) {
        const feedbackTokens = config.feedbackField === 'user'
            ? entry.document.userSet
            : config.feedbackField === 'assistant'
                ? entry.document.assistantSet
                : entry.document.tokenSet;
        for (const token of feedbackTokens) {
            if (querySet.has(token) || token.length < 3) continue;
            const corpusDf = index.documentFrequency.get(token) || 0;
            if (corpusDf > index.corpusSize * config.maxDocumentFraction) continue;
            const candidate = candidates.get(token) || { documentCount: 0, totalFrequency: 0 };
            candidate.documentCount += 1;
            const weightedFrequency = config.feedbackField === 'user'
                ? (entry.document.userTf.get(token) || 0)
                : config.feedbackField === 'assistant'
                    ? (entry.document.assistantTf.get(token) || 0)
                    : (entry.document.userTf.get(token) || 0) * BASE.userWeight +
                        (entry.document.assistantTf.get(token) || 0) * BASE.assistantWeight +
                        (entry.document.tagTf.get(token) || 0) * BASE.tagWeight;
            candidate.totalFrequency += weightedFrequency;
            candidates.set(token, candidate);
        }
    }
    const selected = [...candidates.entries()]
        .filter(([, value]) => value.documentCount >= config.minFeedbackDocuments)
        .map(([token, value]) => {
            const corpusDf = index.documentFrequency.get(token) || 0;
            const idf = Math.log(1 + (index.corpusSize - corpusDf + 0.5) / (corpusDf + 0.5));
            return { token, score: idf * value.documentCount * Math.log1p(value.totalFrequency) };
        })
        .sort((left, right) => right.score - left.score || left.token.localeCompare(right.token))
        .slice(0, config.expansionTerms);
    const weights = new Map(index.queryTokens.map((token) => [token, 1]));
    for (const entry of selected) weights.set(entry.token, config.expansionWeight);
    return weights;
}

function rrfRanking(rankings, weights, limit = 20, k = 60) {
    const scores = new Map();
    const documents = new Map();
    rankings.forEach((ranking, channelIndex) => {
        ranking.forEach((entry, rankIndex) => {
            const id = entry.document.index;
            scores.set(id, (scores.get(id) || 0) + weights[channelIndex] / (k + rankIndex + 1));
            documents.set(id, entry.document);
        });
    });
    return [...scores.entries()]
        .map(([id, score]) => ({ document: documents.get(id), relevance: score, score }))
        .sort((left, right) => right.score - left.score || right.document.index - left.document.index)
        .slice(0, limit);
}

function experimentConfigs() {
    const configs = [{ id: 'baseline', family: 'bm25', settings: {} }];
    for (const k1 of [0.8, 1.6]) {
        for (const b of [0.4, 0.9]) {
            configs.push({ id: `bm25-k${k1}-b${b}`, family: 'bm25', settings: { k1, b } });
        }
    }
    configs.push(
        { id: 'fields-balanced', family: 'bm25', settings: { userWeight: 1, assistantWeight: 1, tagWeight: 1 } },
        { id: 'fields-user-heavy', family: 'bm25', settings: { userWeight: 1.35, assistantWeight: 0.9 } },
        { id: 'fields-assistant-heavy', family: 'bm25', settings: { userWeight: 1, assistantWeight: 1.25 } },
        { id: 'fields-tags-light', family: 'bm25', settings: { tagWeight: 0.7 } }
    );
    for (const phraseBoost of [0, 0.15, 0.45, 0.7]) {
        configs.push({ id: `phrase-${phraseBoost}`, family: 'bm25', settings: { phraseBoost } });
    }
    for (const maxPerSession of [1, 3, 4, Number.POSITIVE_INFINITY]) {
        configs.push({
            id: `session-cap-${Number.isFinite(maxPerSession) ? maxPerSession : 'none'}`,
            family: 'bm25',
            settings: { maxPerSession }
        });
    }
    configs.push(
        { id: 'prior-none', family: 'bm25', settings: { recencyWeight: 0, importanceWeight: 0 } },
        { id: 'recency-0.03', family: 'bm25', settings: { recencyWeight: 0.03 } },
        { id: 'recency-0.12', family: 'bm25', settings: { recencyWeight: 0.12 } },
        { id: 'importance-0.04', family: 'bm25', settings: { importanceWeight: 0.04 } }
    );
    for (const prefixWeight of [0.08, 0.16, 0.28]) {
        configs.push({ id: `prefix-${prefixWeight}`, family: 'bm25', settings: { prefixWeight } });
    }
    for (const neighborWeight of [0.03, 0.06, 0.1, 0.15]) {
        configs.push({ id: `neighbor-${neighborWeight}`, family: 'bm25', settings: { neighborWeight } });
    }
    for (const sessionWeight of [0.02, 0.04, 0.08]) {
        configs.push({ id: `session-prior-${sessionWeight}`, family: 'bm25', settings: { sessionWeight } });
    }
    const prfVariants = [
        [3, 4, 0.1], [3, 6, 0.15], [3, 8, 0.2],
        [5, 4, 0.1], [5, 6, 0.15], [5, 8, 0.2]
    ];
    for (const [feedbackDocs, expansionTerms, expansionWeight] of prfVariants) {
        const id = `prf-d${feedbackDocs}-t${expansionTerms}-w${expansionWeight}`;
        configs.push({
            id,
            family: 'prf',
            feedbackDocs,
            expansionTerms,
            expansionWeight,
            minFeedbackDocuments: 2,
            maxDocumentFraction: 0.25
        });
        configs.push({ id: `rrf-${id}`, family: 'rrf', source: id, sourceWeight: 0.35 });
    }
    for (const source of ['neighbor-0.06', 'neighbor-0.1', 'prefix-0.16', 'session-prior-0.04']) {
        configs.push({ id: `rrf-${source}`, family: 'rrf', source, sourceWeight: 0.35 });
    }
    for (const uniqueSlots of [4, 5, 6, 7]) {
        configs.push({ id: `diverse-unique-${uniqueSlots}`, family: 'selector', selector: 'diverse', uniqueSlots });
    }
    for (const sessionPenalty of [0.05, 0.1, 0.2, 0.4]) {
        configs.push({ id: `mmr-session-${sessionPenalty}`, family: 'selector', selector: 'mmr', sessionPenalty });
    }
    for (const sessionPenalty of [0.125, 0.15, 0.175, 0.225, 0.25, 0.3]) {
        configs.push({ id: `mmr-session-${sessionPenalty}`, family: 'selector', selector: 'mmr', sessionPenalty });
    }
    for (const preserveTop of [1, 2, 3, 4]) {
        for (const sessionPenalty of [0.1, 0.2, 0.3]) {
            configs.push({
                id: `mmr-lock${preserveTop}-p${sessionPenalty}`,
                family: 'selector',
                selector: 'mmr',
                sessionPenalty,
                preserveTop
            });
        }
    }
    configs.push(
        { id: 'bm25f-current', family: 'bm25f', settings: {} },
        { id: 'bm25f-balanced', family: 'bm25f', settings: { userWeight: 1, assistantWeight: 1, tagWeight: 1 } },
        { id: 'bm25f-user-heavy', family: 'bm25f', settings: { userWeight: 1.35, assistantWeight: 0.9 } },
        { id: 'bm25f-b0.4', family: 'bm25f', settings: { userB: 0.4, assistantB: 0.4 } },
        { id: 'bm25f-b0.9', family: 'bm25f', settings: { userB: 0.9, assistantB: 0.9 } },
        { id: 'bm25f-prefix-0.16', family: 'bm25f', settings: { prefixWeight: 0.16 } },
        { id: 'bm25f-prefix-0.28', family: 'bm25f', settings: { prefixWeight: 0.28 } },
        { id: 'prefix-0.16-user-heavy', family: 'bm25', settings: { prefixWeight: 0.16, userWeight: 1.35, assistantWeight: 0.9 } },
        { id: 'prefix-0.28-user-heavy', family: 'bm25', settings: { prefixWeight: 0.28, userWeight: 1.35, assistantWeight: 0.9 } },
        { id: 'prefix-0.16-session-prior', family: 'bm25', settings: { prefixWeight: 0.16, sessionWeight: 0.02 } },
        { id: 'prefix-0.28-session-prior', family: 'bm25', settings: { prefixWeight: 0.28, sessionWeight: 0.02 } }
    );
    for (const sessionPenalty of [0.15, 0.2, 0.25]) {
        configs.push(
            {
                id: `mmr-prefix-0.16-p${sessionPenalty}`,
                family: 'bm25_mmr',
                settings: { prefixWeight: 0.16 },
                sessionPenalty
            },
            {
                id: `mmr-prefix-0.28-p${sessionPenalty}`,
                family: 'bm25_mmr',
                settings: { prefixWeight: 0.28 },
                sessionPenalty
            },
            {
                id: `mmr-bm25f-user-p${sessionPenalty}`,
                family: 'bm25f_mmr',
                settings: { userWeight: 1.35, assistantWeight: 0.9 },
                sessionPenalty
            },
            {
                id: `mmr-prf-d5-t8-p${sessionPenalty}`,
                family: 'prf_mmr',
                feedbackDocs: 5,
                expansionTerms: 8,
                expansionWeight: 0.2,
                minFeedbackDocuments: 2,
                maxDocumentFraction: 0.25,
                sessionPenalty
            }
        );
    }
    for (const feedbackField of ['user', 'all']) {
        for (const expansionWeight of [0.1, 0.15]) {
            for (const sessionPenalty of [0.175, 0.2]) {
                configs.push({
                    id: `safe-prf-${feedbackField}-w${expansionWeight}-p${sessionPenalty}`,
                    family: 'prf_mmr',
                    feedbackDocs: 5,
                    feedbackField,
                    expansionTerms: 6,
                    expansionWeight,
                    minFeedbackDocuments: 3,
                    maxDocumentFraction: 0.15,
                    sessionPenalty
                });
            }
        }
    }
    return configs;
}

function rankExperiments(index, configs, limit = 20) {
    const rankings = new Map();
    const baselineScores = bm25Scores(index, BASE);
    const baseline = selectScores(baselineScores, limit, BASE.maxPerSession);
    rankings.set('baseline', baseline);
    for (const config of configs.slice(1)) {
        if (config.family === 'bm25') {
            const settings = { ...BASE, ...config.settings };
            rankings.set(
                config.id,
                selectScores(bm25Scores(index, settings), limit, settings.maxPerSession)
            );
        } else if (config.family === 'bm25f') {
            const settings = { ...BASE, ...config.settings };
            rankings.set(
                config.id,
                selectScores(bm25fScores(index, settings), limit, settings.maxPerSession)
            );
        } else if (config.family === 'bm25_mmr') {
            rankings.set(
                config.id,
                selectMmr(
                    bm25Scores(index, { ...BASE, ...config.settings }),
                    limit,
                    config.sessionPenalty,
                    config.preserveTop
                )
            );
        } else if (config.family === 'bm25f_mmr') {
            rankings.set(
                config.id,
                selectMmr(
                    bm25fScores(index, { ...BASE, ...config.settings }),
                    limit,
                    config.sessionPenalty,
                    config.preserveTop
                )
            );
        } else if (config.family === 'prf_mmr') {
            const weights = expandQuery(index, baseline, config);
            rankings.set(
                config.id,
                selectMmr(
                    bm25Scores(index, BASE, weights),
                    limit,
                    config.sessionPenalty,
                    config.preserveTop
                )
            );
        } else if (config.family === 'selector') {
            rankings.set(
                config.id,
                config.selector === 'diverse'
                    ? selectDiverse(baselineScores, limit, config.uniqueSlots)
                    : selectMmr(
                        baselineScores,
                        limit,
                        config.sessionPenalty,
                        config.preserveTop
                    )
            );
        } else if (config.family === 'prf') {
            const weights = expandQuery(index, baseline, config);
            rankings.set(
                config.id,
                selectScores(bm25Scores(index, BASE, weights), limit, BASE.maxPerSession)
            );
        } else if (config.family === 'rrf') {
            rankings.set(
                config.id,
                rrfRanking([baseline, rankings.get(config.source) || []], [1, config.sourceWeight], limit)
            );
        }
    }
    return rankings;
}

function recallAt(retrieved, evidence, k) {
    if (!evidence.size) return null;
    const found = new Set(retrieved.slice(0, k).filter((value) => evidence.has(value)));
    return found.size / evidence.size;
}

function measureRanking(ranking, evidence) {
    const sessions = ranking.map((entry) => entry.document.sessionId);
    const turns = ranking.map(
        (entry) => `${entry.document.sessionId}\u0000${normalizeText(entry.document.event.ts)}`
    );
    const result = { sessions, eventIds: ranking.map((entry) => entry.document.event.id) };
    for (const k of KS) {
        result[`sessionAt${k}`] = recallAt(sessions, evidence.sessionIds, k);
        result[`turnAt${k}`] = recallAt(turns, evidence.turnKeys, k);
    }
    return result;
}

function mean(values) {
    const finite = values.filter(Number.isFinite);
    return finite.length ? finite.reduce((sum, value) => sum + value, 0) / finite.length : null;
}

function percentile(values, fraction) {
    const finite = values.filter(Number.isFinite).sort((left, right) => left - right);
    if (!finite.length) return null;
    return finite[Math.min(finite.length - 1, Math.max(0, Math.ceil(finite.length * fraction) - 1))];
}

function summarizeRows(rows, configId, split = 'full') {
    const selected = rows.filter((row) =>
        row.answerable && (split === 'full' || row.split === split)
    );
    const output = { n: selected.length };
    for (const family of ['session', 'turn']) {
        output[family] = {};
        for (const k of KS) {
            output[family][`at${k}`] = mean(
                selected.map((row) => row.results[configId]?.[`${family}At${k}`])
            );
        }
    }
    const latency = selected.map((row) => row.latencyMs[configId]);
    output.latency = {
        meanMs: mean(latency),
        p50Ms: percentile(latency, 0.5),
        p95Ms: percentile(latency, 0.95),
        maxMs: latency.length ? Math.max(...latency) : null
    };
    return output;
}

function parityCheck(row, expected) {
    if (!expected) return ['missing_expected_diagnostics'];
    const actual = row.results.baseline;
    const failures = [];
    if (JSON.stringify(actual.sessions) !== JSON.stringify(expected.retrievedSessionIds || [])) {
        failures.push('retrieved_session_order');
    }
    for (const family of ['Session', 'Turn']) {
        for (const k of KS) {
            const actualValue = actual[`${family.toLowerCase()}At${k}`];
            const expectedValue = expected[`evidence${family}RecallAt${k}`];
            if (Math.abs(Number(actualValue) - Number(expectedValue)) > 1e-12) {
                failures.push(`${family.toLowerCase()}At${k}`);
            }
        }
    }
    return failures;
}

function renderReport(output) {
    const baseline = output.summaries.baseline;
    const pct = (value) => Number.isFinite(value) ? `${(value * 100).toFixed(2)}%` : 'n/a';
    const ms = (value) => Number.isFinite(value) ? value.toFixed(2) : 'n/a';
    const lines = [
        `# ${output.suite} lexical retrieval experiments`,
        '',
        `- Questions: ${output.questionCount} (${output.answerableCount} answerable)`,
        `- Split: deterministic SHA-256 development/holdout`,
        `- Baseline parity failures: ${output.parity.failureCount}`,
        `- Configurations: ${output.configCount}`,
        '',
        '| Configuration | Dev Session R@8 | Dev Turn R@8 | Holdout Session R@8 | Holdout Turn R@8 | Full Turn R@8 | p95 search ms |',
        '|---|---:|---:|---:|---:|---:|---:|'
    ];
    for (const entry of output.ranking.slice(0, 20)) {
        const summary = output.summaries[entry.id];
        lines.push(
            `| ${entry.id} | ${pct(summary.development.session.at8)} | ${pct(summary.development.turn.at8)} | ` +
            `${pct(summary.holdout.session.at8)} | ${pct(summary.holdout.turn.at8)} | ` +
            `${pct(summary.full.turn.at8)} | ${ms(summary.full.latency.p95Ms)} |`
        );
    }
    lines.push(
        '',
        '## Baseline',
        '',
        `- Full Session R@8: ${pct(baseline.full.session.at8)}`,
        `- Full Turn R@8: ${pct(baseline.full.turn.at8)}`,
        `- Experimental cached-index p95: ${ms(baseline.full.latency.p95Ms)} ms`,
        '',
        'Selection order uses development Turn R@8 first, then development Session R@8. Holdout and external-suite results must be checked before production adoption.'
    );
    return `${lines.join('\n')}\n`;
}

async function main() {
    const args = parseArgs(process.argv.slice(2));
    const runDir = args.runDir || (args.suite === 'longmem' ? DEFAULT_LONGMEM_RUN : DEFAULT_LOCOMO_RUN);
    const manifest = JSON.parse(await fsPromises.readFile(path.join(runDir, 'manifest.json'), 'utf8'));
    const dataset = JSON.parse(await fsPromises.readFile(manifest.datasetPath, 'utf8'));
    const selected = args.limit ? dataset.slice(0, args.limit) : dataset;
    const stateRoots = await findStateRoots(path.join(runDir, 'shards'));
    const expectedPath = path.join(runDir, DEFAULT_BASELINE_DIAGNOSTICS);
    const expectedById = fs.existsSync(expectedPath)
        ? new Map(parseJsonl(await fsPromises.readFile(expectedPath, 'utf8')).map((row) => [row.question_id, row.retrieval]))
        : new Map();
    let configs = args.parityOnly ? experimentConfigs().slice(0, 1) : experimentConfigs();
    if (args.configPattern) {
        const pattern = new RegExp(args.configPattern);
        configs = configs.filter((config) => config.id === 'baseline' || pattern.test(config.id));
    }
    const rows = [];
    const parityFailures = [];
    const startedAt = Date.now();
    for (let entryIndex = 0; entryIndex < selected.length; entryIndex += 1) {
        const entry = selected[entryIndex];
        const stateRoot = stateRoots.get(entry.question_id);
        if (!stateRoot) throw new Error(`Missing preserved state for ${entry.question_id}`);
        const events = parseJsonl(
            await fsPromises.readFile(path.join(stateRoot, 'memory', 'events.jsonl'), 'utf8')
        );
        const evidence = buildEvidence(entry);
        const index = buildIndex(events, normalizeText(entry.question));
        const latencyMs = {};
        const rankings = new Map();
        const resultStarted = process.hrtime.bigint();
        const allRankings = rankExperiments(index, configs, 20);
        const elapsed = Number(process.hrtime.bigint() - resultStarted) / 1e6;
        for (const config of configs) {
            rankings.set(config.id, allRankings.get(config.id));
            latencyMs[config.id] = elapsed / configs.length;
        }
        const row = {
            questionId: entry.question_id,
            questionType: entry.question_type,
            split: splitFor(entry.question_id),
            answerable: evidence.answerable,
            latencyMs,
            results: Object.fromEntries(
                configs.map((config) => [config.id, measureRanking(rankings.get(config.id), evidence)])
            )
        };
        const failures = parityCheck(row, expectedById.get(entry.question_id));
        if (failures.length) parityFailures.push({ questionId: entry.question_id, failures });
        rows.push(row);
        if ((entryIndex + 1) % 25 === 0 || entryIndex + 1 === selected.length) {
            console.log(`[${args.suite}] ${entryIndex + 1}/${selected.length}`);
        }
    }
    const summaries = {};
    for (const config of configs) {
        summaries[config.id] = {
            development: summarizeRows(rows, config.id, 'development'),
            holdout: summarizeRows(rows, config.id, 'holdout'),
            full: summarizeRows(rows, config.id, 'full')
        };
    }
    const ranking = configs
        .map((config) => ({ id: config.id, family: config.family, ...summaries[config.id].development }))
        .sort((left, right) =>
            right.turn.at8 - left.turn.at8 ||
            right.session.at8 - left.session.at8 ||
            left.latency.p95Ms - right.latency.p95Ms
        );
    const output = {
        schema: 'ailis.lexical_retrieval_experiments.v1',
        suite: args.suite,
        sourceRun: path.basename(runDir),
        generatedAt: new Date().toISOString(),
        durationMs: Date.now() - startedAt,
        questionCount: rows.length,
        answerableCount: rows.filter((row) => row.answerable).length,
        configCount: configs.length,
        parity: {
            expectedDiagnosticsAvailable: expectedById.size > 0,
            checkedCount: rows.length,
            failureCount: parityFailures.length,
            failures: parityFailures.slice(0, 20)
        },
        configs,
        summaries,
        ranking
    };
    const outputDir = args.outputDir || path.join(
        REPO_ROOT,
        'eval-results',
        'memory-retrieval-experiments',
        `${args.suite}-lexical-grid-v1-20260804`
    );
    await fsPromises.mkdir(outputDir, { recursive: true });
    await Promise.all([
        fsPromises.writeFile(path.join(outputDir, 'summary.json'), `${JSON.stringify(output, null, 2)}\n`),
        fsPromises.writeFile(path.join(outputDir, 'report.md'), renderReport(output)),
        fsPromises.writeFile(
            path.join(outputDir, 'per-question.jsonl'),
            `${rows.map((row) => JSON.stringify(row)).join('\n')}\n`
        )
    ]);
    console.log(JSON.stringify({
        outputDir,
        durationMs: output.durationMs,
        parity: output.parity,
        top: ranking.slice(0, 10).map((entry) => ({
            id: entry.id,
            developmentSessionAt8: entry.session.at8,
            developmentTurnAt8: entry.turn.at8,
            holdoutSessionAt8: summaries[entry.id].holdout.session.at8,
            holdoutTurnAt8: summaries[entry.id].holdout.turn.at8,
            fullTurnAt8: summaries[entry.id].full.turn.at8
        }))
    }, null, 2));
}

main().catch((error) => {
    console.error(error?.stack || error?.message || String(error));
    process.exitCode = 1;
});
