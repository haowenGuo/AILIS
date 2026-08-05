'use strict';

const fs = require('fs');
const path = require('path');

const LEXICAL_INDEX_VERSION = 1;
const DEFAULT_CANDIDATE_LIMIT = 96;
const MAX_QUERY_TERMS = 48;
const CONTEXT_QUERY_WEIGHT = 0.14;
const SESSION_REPEAT_PENALTY = 0.2;

let DatabaseSync = null;
try {
    ({ DatabaseSync } = require('node:sqlite'));
} catch {
    DatabaseSync = null;
}

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

function stemLatinToken(value = '') {
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

function segmentWords(text = '') {
    const normalized = normalizeText(text).toLowerCase();
    if (!normalized) {
        return [];
    }
    if (typeof Intl?.Segmenter === 'function') {
        const segmenter = new Intl.Segmenter(undefined, { granularity: 'word' });
        return [...segmenter.segment(normalized)]
            .filter((entry) => entry.isWordLike)
            .map((entry) => normalizeText(entry.segment).toLowerCase())
            .filter(Boolean);
    }
    return normalized.match(/[\p{L}\p{N}]+/gu) || [];
}

function cjkNgrams(text = '') {
    const runs = normalizeText(text).match(/[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]+/gu) || [];
    const grams = [];
    for (const run of runs) {
        const chars = [...run];
        if (chars.length === 1) {
            grams.push(chars[0]);
            continue;
        }
        for (const size of [2, 3]) {
            for (let index = 0; index <= chars.length - size; index += 1) {
                grams.push(chars.slice(index, index + size).join(''));
            }
        }
    }
    return grams;
}

function tokenizeMemoryText(text = '', { includeStopWords = false } = {}) {
    const exact = [];
    const stems = [];
    for (const token of segmentWords(text)) {
        if (/^[a-z0-9]+$/i.test(token)) {
            const lowered = token.toLowerCase();
            if (lowered.length < 2 || (!includeStopWords && STOP_WORDS.has(lowered))) {
                continue;
            }
            exact.push(lowered);
            const stemmed = stemLatinToken(lowered);
            if (stemmed && stemmed !== lowered) {
                stems.push(stemmed);
            }
        } else if (token.length >= 1) {
            exact.push(token);
        }
    }
    const ngrams = cjkNgrams(text);
    return {
        exact: [...new Set(exact)],
        stems: [...new Set(stems)],
        ngrams: [...new Set(ngrams)],
        all: [...new Set([...exact, ...stems, ...ngrams])]
    };
}

function splitQuery(query = '') {
    const lines = String(query || '').split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
    let primary = normalizeText(query);
    const context = [];
    let primaryIndex = -1;
    let primaryLabel = '';
    for (let index = 0; index < lines.length; index += 1) {
        const match = lines[index].match(/^(user|question|query|request)\s*:/i);
        if (match) {
            primaryIndex = index;
            primaryLabel = match[1].toLowerCase();
        }
    }
    if (primaryIndex >= 0) {
        primary = normalizeText(
            lines[primaryIndex].replace(/^(?:user|question|query|request)\s*:/i, '')
        );
        if (primaryLabel === 'user') {
            for (let index = 0; index < lines.length; index += 1) {
                if (index === primaryIndex) {
                    continue;
                }
                if (/^(?:user|assistant)\s*:/i.test(lines[index])) {
                    context.push(lines[index].replace(/^(?:user|assistant)\s*:/i, ''));
                }
            }
        }
    }
    return {
        primary,
        context: normalizeText(context.join(' '))
    };
}

function quoteFtsTerm(term = '') {
    return `"${String(term).replace(/"/g, '""')}"`;
}

function buildFtsQuery(text = '') {
    const tokens = tokenizeMemoryText(text).all.slice(0, MAX_QUERY_TERMS);
    return {
        tokens,
        expression: tokens.map(quoteFtsTerm).join(' OR ')
    };
}

function safeJsonParse(value, fallback = null) {
    try {
        return JSON.parse(String(value || '')) ?? fallback;
    } catch {
        return fallback;
    }
}

function eventTextFields(event = {}) {
    const userText = normalizeText(event.userText);
    const assistantText = normalizeText(event.assistantText);
    const summary = normalizeText(event.summary);
    const tags = Array.isArray(event.tags) ? event.tags.map(normalizeText).filter(Boolean) : [];
    const lexical = tokenizeMemoryText(`${userText}\n${assistantText}\n${summary}\n${tags.join(' ')}`).all;
    return {
        userText,
        assistantText,
        summary,
        tags: tags.join(' '),
        lexicalTerms: lexical.join(' ')
    };
}

function sentenceSegments(text = '') {
    const normalized = normalizeText(text);
    if (!normalized) {
        return [];
    }
    if (typeof Intl?.Segmenter === 'function') {
        const segmenter = new Intl.Segmenter(undefined, { granularity: 'sentence' });
        const values = [...segmenter.segment(normalized)]
            .map((entry) => normalizeText(entry.segment))
            .filter(Boolean);
        if (values.length) {
            return values;
        }
    }
    return normalized.split(/(?<=[.!?。！？])\s*/u).map(normalizeText).filter(Boolean);
}

function scoreSentence(sentence, queryTerms) {
    const sentenceTerms = new Set(tokenizeMemoryText(sentence).all);
    let matched = 0;
    let lengthScore = 0;
    for (const term of queryTerms) {
        if (sentenceTerms.has(term)) {
            matched += 1;
            lengthScore += Math.min(8, [...term].length);
        }
    }
    return matched * 10 + lengthScore;
}

function selectDenseTermWindow(text, queryTerms, maxChars) {
    if (text.length <= maxChars) {
        return text;
    }
    const lowered = text.toLowerCase();
    const matches = [];
    for (const term of queryTerms) {
        const needle = normalizeText(term).toLowerCase();
        if (needle.length < 2) {
            continue;
        }
        let from = 0;
        let occurrences = 0;
        while (from < lowered.length && occurrences < 32 && matches.length < 512) {
            const index = lowered.indexOf(needle, from);
            if (index < 0) {
                break;
            }
            matches.push({ index, end: index + needle.length, term: needle });
            occurrences += 1;
            from = index + Math.max(1, needle.length);
        }
    }
    if (!matches.length) {
        return `${text.slice(0, Math.max(1, maxChars - 1))}…`;
    }
    let bestStart = 0;
    let bestScore = -Infinity;
    for (const match of matches) {
        const start = Math.max(0, Math.min(
            match.index - Math.floor(maxChars * 0.38),
            text.length - maxChars
        ));
        const end = start + maxChars;
        const covered = matches.filter((entry) => entry.index < end && entry.end > start);
        const distinctTerms = new Set(covered.map((entry) => entry.term));
        const score = distinctTerms.size * 100 +
            [...distinctTerms].reduce((sum, term) => sum + Math.min(12, [...term].length), 0) +
            covered.length * 0.05;
        if (score > bestScore || (score === bestScore && start > bestStart)) {
            bestStart = start;
            bestScore = score;
        }
    }
    const initiallyHasLeading = bestStart > 0;
    const initiallyHasTrailing = bestStart + maxChars < text.length;
    const available = Math.max(
        1,
        maxChars - Number(initiallyHasLeading) - Number(initiallyHasTrailing)
    );
    const sliceStart = initiallyHasLeading && !initiallyHasTrailing
        ? Math.max(0, text.length - available)
        : bestStart;
    const leadingMarker = sliceStart > 0 ? '…' : '';
    const trailingMarker = sliceStart + available < text.length ? '…' : '';
    return `${leadingMarker}${text.slice(sliceStart, sliceStart + available)}${trailingMarker}`;
}

function selectRelevantMemoryExcerpt(value, query, maxChars = 260) {
    const text = normalizeText(value);
    if (!text || text.length <= maxChars) {
        return text;
    }
    const queryTerms = tokenizeMemoryText(query).all;
    if (!queryTerms.length) {
        return `${text.slice(0, Math.max(0, maxChars - 1))}…`;
    }
    const sentences = sentenceSegments(text).map((sentence, index) => ({
        sentence,
        index,
        score: scoreSentence(sentence, queryTerms)
    }));
    const ranked = sentences
        .filter((entry) => entry.score > 0)
        .sort((left, right) => right.score - left.score || left.index - right.index);
    if (!ranked.length) {
        return `${text.slice(0, Math.max(0, maxChars - 1))}…`;
    }
    const selected = [];
    let used = 0;
    for (const entry of ranked) {
        const remaining = maxChars - used - (selected.length ? 2 : 0);
        if (remaining <= 12) {
            break;
        }
        const sentence = entry.sentence.length > remaining
            ? selectDenseTermWindow(entry.sentence, queryTerms, remaining)
            : entry.sentence;
        selected.push({ ...entry, sentence });
        used += sentence.length + (selected.length > 1 ? 2 : 0);
    }
    return selected
        .sort((left, right) => left.index - right.index)
        .map((entry) => entry.sentence)
        .join(' … ')
        .slice(0, maxChars);
}

class AILISLexicalMemoryIndex {
    constructor(options = {}) {
        this.rootDir = path.resolve(options.rootDir || process.cwd());
        this.eventsPath = path.resolve(options.eventsPath || path.join(this.rootDir, 'events.jsonl'));
        this.dbPath = path.resolve(options.dbPath || path.join(this.rootDir, 'memory-lexical-index.sqlite'));
        this.lastError = '';
        this.available = Boolean(DatabaseSync);
    }

    open() {
        if (!DatabaseSync) {
            throw new Error('node:sqlite is unavailable in this runtime');
        }
        fs.mkdirSync(this.rootDir, { recursive: true });
        const db = new DatabaseSync(this.dbPath);
        db.exec('PRAGMA journal_mode = DELETE; PRAGMA synchronous = NORMAL;');
        db.exec(`
            CREATE TABLE IF NOT EXISTS memory_index_meta (
                key TEXT PRIMARY KEY,
                value TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS memory_documents (
                rowid INTEGER PRIMARY KEY,
                event_id TEXT NOT NULL UNIQUE,
                ts TEXT NOT NULL,
                session_id TEXT NOT NULL,
                event_json TEXT NOT NULL
            );
            CREATE VIRTUAL TABLE IF NOT EXISTS memory_fts USING fts5(
                event_id UNINDEXED,
                user_text,
                assistant_text,
                summary,
                tags,
                lexical_terms,
                tokenize = 'unicode61 remove_diacritics 2'
            );
        `);
        const version = Number(db.prepare(
            "SELECT value FROM memory_index_meta WHERE key = 'version'"
        ).get()?.value || 0);
        if (version !== LEXICAL_INDEX_VERSION) {
            db.exec(`
                DELETE FROM memory_fts;
                DELETE FROM memory_documents;
                DELETE FROM memory_index_meta;
            `);
            db.exec(`
                DROP TABLE IF EXISTS memory_session_fts;
                DROP TABLE IF EXISTS memory_sessions;
                DROP TABLE IF EXISTS memory_vocab;
            `);
            db.prepare('INSERT INTO memory_index_meta(key, value) VALUES (?, ?)').run(
                'version',
                String(LEXICAL_INDEX_VERSION)
            );
            db.prepare('INSERT INTO memory_index_meta(key, value) VALUES (?, ?)').run('events_offset', '0');
        }
        return db;
    }

    readOffset(db) {
        return Math.max(0, Number(db.prepare(
            "SELECT value FROM memory_index_meta WHERE key = 'events_offset'"
        ).get()?.value) || 0);
    }

    writeOffset(db, offset) {
        db.prepare(`
            INSERT INTO memory_index_meta(key, value) VALUES ('events_offset', ?)
            ON CONFLICT(key) DO UPDATE SET value = excluded.value
        `).run(String(Math.max(0, Number(offset) || 0)));
    }

    reset(db) {
        db.exec(`
            DELETE FROM memory_fts;
            DELETE FROM memory_documents;
        `);
        this.writeOffset(db, 0);
    }

    insertEvent(db, event = {}) {
        const eventId = normalizeText(event.id);
        if (!eventId || normalizeText(event.type, 'turn') !== 'turn') {
            return false;
        }
        if (db.prepare('SELECT 1 FROM memory_documents WHERE event_id = ?').get(eventId)) {
            return false;
        }
        const fields = eventTextFields(event);
        const document = db.prepare(`
            INSERT INTO memory_documents(event_id, ts, session_id, event_json)
            VALUES (?, ?, ?, ?)
        `).run(
            eventId,
            normalizeText(event.ts),
            normalizeText(event.sessionId, 'main'),
            JSON.stringify(event)
        );
        db.prepare(`
            INSERT INTO memory_fts(
                rowid, event_id, user_text, assistant_text, summary, tags, lexical_terms
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `).run(
            Number(document.lastInsertRowid),
            eventId,
            fields.userText,
            fields.assistantText,
            fields.summary,
            fields.tags,
            fields.lexicalTerms
        );
        return true;
    }

    sync(db) {
        let size = 0;
        try {
            size = fs.statSync(this.eventsPath).size;
        } catch {
            if (this.readOffset(db) > 0) {
                this.reset(db);
            }
            return { indexed: 0, offset: 0, size: 0 };
        }
        let offset = this.readOffset(db);
        if (size < offset) {
            this.reset(db);
            offset = 0;
        }
        if (size === offset) {
            return { indexed: 0, offset, size };
        }
        const handle = fs.openSync(this.eventsPath, 'r');
        let buffer;
        try {
            buffer = Buffer.allocUnsafe(size - offset);
            fs.readSync(handle, buffer, 0, buffer.length, offset);
        } finally {
            fs.closeSync(handle);
        }
        const lastNewline = buffer.lastIndexOf(0x0a);
        if (lastNewline < 0) {
            return { indexed: 0, offset, size };
        }
        const completeBuffer = buffer.subarray(0, lastNewline + 1);
        const lines = completeBuffer.toString('utf8').split(/\r?\n/).filter(Boolean);
        let indexed = 0;
        db.exec('BEGIN IMMEDIATE;');
        try {
            for (const line of lines) {
                const event = safeJsonParse(line, null);
                if (event && this.insertEvent(db, event)) {
                    indexed += 1;
                }
            }
            offset += completeBuffer.length;
            this.writeOffset(db, offset);
            db.exec('COMMIT;');
        } catch (error) {
            db.exec('ROLLBACK;');
            throw error;
        }
        return { indexed, offset, size };
    }

    queryRows(db, text, limit) {
        const query = buildFtsQuery(text);
        if (!query.expression) {
            return [];
        }
        const rows = db.prepare(`
            SELECT d.rowid, d.event_json,
                bm25(memory_fts, 0.0, 2.2, 1.5, 1.1, 2.8, 1.0) AS rank_score
            FROM memory_fts
            JOIN memory_documents d ON d.rowid = memory_fts.rowid
            WHERE memory_fts MATCH ?
            ORDER BY rank_score ASC, d.rowid DESC
            LIMIT ?
        `).all(query.expression, Math.max(1, Number(limit) || DEFAULT_CANDIDATE_LIMIT));
        return rows.map((row, index) => ({
            rowid: Number(row.rowid),
            event: safeJsonParse(row.event_json, null),
            rank: index + 1,
            rankScore: Number(row.rank_score) || 0,
            queryTokens: query.tokens
        })).filter((entry) => entry.event);
    }

    search(query, { limit = 8 } = {}) {
        if (!this.available) {
            return { ok: false, status: 'unavailable', error: 'node:sqlite is unavailable' };
        }
        const startedAt = process.hrtime.bigint();
        let db = null;
        try {
            db = this.open();
            const sync = this.sync(db);
            const parts = splitQuery(query);
            const candidateLimit = Math.max(DEFAULT_CANDIDATE_LIMIT, Number(limit) * 12);
            const primaryRows = this.queryRows(db, parts.primary, candidateLimit);
            const contextRows = parts.context
                ? this.queryRows(db, parts.context, Math.ceil(candidateLimit / 2))
                : [];
            const candidates = new Map();
            const mergeRows = (rows, weight, channel) => {
                for (const row of rows) {
                    const id = normalizeText(row.event?.id);
                    if (!id) {
                        continue;
                    }
                    const entry = candidates.get(id) || {
                        event: row.event,
                        rowid: row.rowid,
                        score: 0,
                        channels: {}
                    };
                    const rankContribution = weight / (8 + row.rank);
                    entry.score += rankContribution;
                    entry.channels[channel] = {
                        rank: row.rank,
                        rankScore: row.rankScore,
                        contribution: rankContribution
                    };
                    candidates.set(id, entry);
                }
            };
            mergeRows(primaryRows, 1, 'current_message');
            mergeRows(contextRows, CONTEXT_QUERY_WEIGHT, 'recent_context');

            const primaryTerms = tokenizeMemoryText(parts.primary).all;
            for (const entry of candidates.values()) {
                const text = `${entry.event.userText || ''}\n${entry.event.assistantText || ''}`;
                const documentTerms = new Set(tokenizeMemoryText(text).all);
                const matched = primaryTerms.filter((term) => documentTerms.has(term)).length;
                const coverage = primaryTerms.length ? matched / primaryTerms.length : 0;
                entry.coverage = coverage;
                entry.score += coverage * 0.035;
                const normalizedDocument = normalizeText(text).toLowerCase();
                const normalizedPrimary = normalizeText(parts.primary).toLowerCase();
                if (normalizedPrimary.length >= 6 && normalizedDocument.includes(normalizedPrimary)) {
                    entry.score += 0.05;
                    entry.exactPhrase = true;
                }
            }

            const pool = [...candidates.values()];
            const selected = [];
            const sessionCounts = new Map();
            while (selected.length < Math.max(1, Number(limit) || 8) && pool.length) {
                let bestIndex = -1;
                let bestAdjustedScore = -Infinity;
                for (let index = 0; index < pool.length; index += 1) {
                    const sessionId = normalizeText(pool[index].event?.sessionId, 'main');
                    const repeatCount = sessionCounts.get(sessionId) || 0;
                    const adjustedScore = pool[index].score /
                        (1 + repeatCount * SESSION_REPEAT_PENALTY);
                    if (
                        adjustedScore > bestAdjustedScore ||
                        (adjustedScore === bestAdjustedScore && pool[index].rowid > (pool[bestIndex]?.rowid || 0))
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
            const elapsedMs = Number(process.hrtime.bigint() - startedAt) / 1e6;
            const indexedEventCount = Number(db.prepare('SELECT COUNT(*) count FROM memory_documents').get()?.count) || 0;
            this.lastError = '';
            return {
                ok: true,
                strategy: 'bm25_phrase_v2',
                query: normalizeText(query),
                events: selected.map((entry) => ({
                    ...entry.event,
                    retrieval: {
                        score: entry.score,
                        adjustedScore: entry.adjustedScore,
                        coverage: entry.coverage,
                        exactPhrase: entry.exactPhrase === true,
                        channels: entry.channels
                    }
                })),
                diagnostics: {
                    implementationVersion: 'lexical_full_history_v2',
                    indexBackend: 'sqlite_fts5',
                    indexedEventCount,
                    newlyIndexedEventCount: sync.indexed,
                    primaryCandidateCount: primaryRows.length,
                    contextCandidateCount: contextRows.length,
                    primaryQueryTermCount: primaryTerms.length,
                    sessionRepeatPenalty: SESSION_REPEAT_PENALTY,
                    elapsedMs
                }
            };
        } catch (error) {
            this.lastError = error?.message || String(error);
            return { ok: false, status: 'search_failed', error: this.lastError };
        } finally {
            try {
                db?.close?.();
            } catch {
                // The next query can reopen the durable index.
            }
        }
    }

    clear() {
        if (!this.available) {
            return { ok: true, status: 'unavailable' };
        }
        let db = null;
        try {
            db = this.open();
            this.reset(db);
            return { ok: true, status: 'cleared' };
        } catch (error) {
            this.lastError = error?.message || String(error);
            return { ok: false, status: 'clear_failed', error: this.lastError };
        } finally {
            try {
                db?.close?.();
            } catch {
                // Ignore close errors after a best-effort clear.
            }
        }
    }

    getStatus() {
        return {
            available: this.available,
            version: LEXICAL_INDEX_VERSION,
            backend: this.available ? 'sqlite_fts5' : 'unavailable',
            dbPath: this.dbPath,
            eventsPath: this.eventsPath,
            lastError: this.lastError
        };
    }
}

module.exports = {
    AILISLexicalMemoryIndex,
    LEXICAL_INDEX_VERSION,
    selectRelevantMemoryExcerpt,
    tokenizeMemoryText
};
