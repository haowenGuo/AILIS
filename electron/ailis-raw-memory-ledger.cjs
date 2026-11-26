const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');
const { randomUUID } = require('crypto');
const { SerialWriteQueue } = require('./ailis-async-writes.cjs');

const RAW_MEMORY_LEDGER_VERSION = 1;
const INDEX_CHECKPOINT_VERSION = 1;
const INDEX_READ_CHUNK = 64 * 1024;
const DEFAULT_REPLAY_LIMIT = 200;
const MAX_REPLAY_LIMIT = 5000;
const REDACTED = '__REDACTED__';
const journalWrites = new SerialWriteQueue();

function nowIso() {
    return new Date().toISOString();
}

function normalizeString(value, fallback = '') {
    if (typeof value !== 'string') {
        return fallback;
    }
    const trimmed = value.trim();
    return trimmed || fallback;
}

function safeSegment(value, fallback = 'unknown') {
    return normalizeString(value, fallback)
        .replace(/[^a-zA-Z0-9._-]+/g, '_')
        .replace(/^_+|_+$/g, '')
        .slice(0, 120) || fallback;
}

function isSafeTokenMetricKey(key = '') {
    return /^(prompt|completion|input|output|total|reasoning|cached|candidates)Tokens$/i.test(key) ||
        /^(prompt|completion|input|output|total|reasoning|cached)_tokens$/i.test(key) ||
        /^(prompt|completion|total|candidates)TokenCount$/i.test(key) ||
        /(^|_)token_count$|^max_output_tokens$/i.test(key);
}

function shouldRedactKey(key = '') {
    return !isSafeTokenMetricKey(key) &&
        /token|password|secret|api[_-]?key|authorization|credential|pass|auth[_-]?code/i.test(key);
}

function toJsonSafe(value, seen = new WeakSet()) {
    if (typeof Buffer !== 'undefined' && Buffer.isBuffer(value)) {
        return {
            __type: 'Buffer',
            encoding: 'base64',
            byteLength: value.byteLength,
            data: value.toString('base64')
        };
    }
    if (value instanceof Date) {
        return value.toISOString();
    }
    if (typeof value === 'bigint') {
        return value.toString();
    }
    if (Array.isArray(value)) {
        return value.map((entry) => toJsonSafe(entry, seen));
    }
    if (!value || typeof value !== 'object') {
        return value;
    }
    if (seen.has(value)) {
        return '[Circular]';
    }
    seen.add(value);
    const output = {};
    for (const [key, entry] of Object.entries(value)) {
        output[key] = shouldRedactKey(key) ? REDACTED : toJsonSafe(entry, seen);
    }
    seen.delete(value);
    return output;
}

function atomicWriteJsonSync(filePath, value) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    const tmpPath = `${filePath}.${process.pid}.${randomUUID()}.tmp`;
    try {
        fs.writeFileSync(tmpPath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
        fs.renameSync(tmpPath, filePath);
    } catch (error) {
        try { fs.unlinkSync(tmpPath); } catch {}
        throw error;
    }
}

function readJsonSync(filePath, fallback) {
    try {
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch {
        return fallback;
    }
}

function createDefaultIndex(rootDir) {
    return {
        version: RAW_MEMORY_LEDGER_VERSION,
        rootDir,
        createdAt: nowIso(),
        updatedAt: nowIso(),
        entryCount: 0,
        days: {},
        sessions: {},
        runs: {},
        lastEntry: null
    };
}

function parseJsonLine(line) {
    try {
        return JSON.parse(line);
    } catch {
        return null;
    }
}

function compareIso(a, b) {
    return String(a?.iso || a?.ts || '').localeCompare(String(b?.iso || b?.ts || ''));
}

function journalStamp(stat) {
    return { identity: `${stat.dev}:${stat.ino}`, size: Number(stat.size), mtime: String(stat.mtimeNs) };
}

function scanJournalTail(filePath, start, stamp, onEntry) {
    if (start === stamp.size) return start;
    const fd = fs.openSync(filePath, 'r');
    let position = start;
    let committed = start;
    let pieces = [];
    try {
        const opened = journalStamp(fs.fstatSync(fd, { bigint: true }));
        if (opened.identity !== stamp.identity || opened.size < stamp.size) {
            throw new Error('raw_memory_journal_changed_during_index_scan');
        }
        while (position < stamp.size) {
            const buffer = Buffer.allocUnsafe(Math.min(INDEX_READ_CHUNK, stamp.size - position));
            const length = fs.readSync(fd, buffer, 0, buffer.length, position);
            if (!length) throw new Error('raw_memory_journal_changed_during_index_scan');
            const bytes = buffer.subarray(0, length);
            let begin = 0;
            while (begin < length) {
                const newline = bytes.indexOf(10, begin);
                if (newline < 0) {
                    pieces.push(bytes.subarray(begin));
                    break;
                }
                const segment = bytes.subarray(begin, newline);
                const line = pieces.length ? Buffer.concat([...pieces, segment]) : segment;
                const entry = parseJsonLine(line.toString('utf8'));
                if (entry && typeof entry.id === 'string' && typeof entry.iso === 'string') onEntry(entry);
                pieces = [];
                committed = position + newline + 1;
                begin = newline + 1;
            }
            position += length;
        }
        return committed;
    } finally {
        fs.closeSync(fd);
    }
}

function recoverableIndex(index, rootDir) {
    const checkpoint = index?.indexCheckpoint;
    if (index?.rootDir !== rootDir || checkpoint?.version !== INDEX_CHECKPOINT_VERSION
            || checkpoint.entryCount !== index.entryCount || !checkpoint.files
            || !index.days || !index.sessions || !index.runs) return null;
    let entries = 0;
    for (const file of Object.values(checkpoint.files)) {
        if (!file || !Number.isSafeInteger(file.offset) || !Number.isSafeInteger(file.size)
                || !Number.isSafeInteger(file.entries) || file.offset < 0 || file.offset > file.size || file.entries < 0
                || typeof file.identity !== 'string' || typeof file.mtime !== 'string') return null;
        entries += file.entries;
    }
    return entries === index.entryCount ? index : null;
}

function mapCopy(value) {
    return Object.assign(Object.create(null), value);
}

class AILISRawMemoryLedger {
    constructor(options = {}) {
        this.workspaceRoot = path.resolve(options.workspaceRoot || process.cwd());
        this.rootDir = path.resolve(options.rootDir || path.join(this.workspaceRoot, '.ailis-state', 'raw-memory'));
        this.entriesDir = path.join(this.rootDir, 'entries');
        this.indexPath = path.join(this.rootDir, 'index.json');
        this.lastError = '';
        this.lastIndexError = '';
        this.index = null;
        this.initialize();
    }

    initialize() {
        try {
            fs.mkdirSync(this.entriesDir, { recursive: true });
            this.loaded = true;
        } catch (error) {
            this.loaded = false;
            this.lastError = error?.message || String(error);
        }
    }

    getDayFile(day) {
        return path.join(this.entriesDir, `${safeSegment(day, 'unknown-day')}.jsonl`);
    }

    readIndex() {
        if (!this.loaded) return createDefaultIndex(this.rootDir);
        try {
            return this.refreshIndex();
        } catch (error) {
            this.lastIndexError = error?.message || String(error);
            return this.index ?? createDefaultIndex(this.rootDir);
        }
    }

    persistIndex(index) {
        try {
            atomicWriteJsonSync(this.indexPath, index);
            this.lastIndexError = '';
        } catch (error) {
            this.lastIndexError = error?.message || String(error);
        }
    }

    refreshIndex() {
        // Only complete journal lines are authoritative. Older snapshots may be discarded and rebuilt.
        let saved = this.index ?? recoverableIndex(readJsonSync(this.indexPath, null), this.rootDir);
        const files = new Map(this.listEntryFiles(true).map(filePath => [path.basename(filePath), {
            filePath, ...journalStamp(fs.statSync(filePath, { bigint: true }))
        }]));
        let previous = saved?.indexCheckpoint.files ?? {};
        if (saved && Object.keys(previous).some(name => {
            const file = files.get(name);
            const old = previous[name];
            return !file || file.identity !== old.identity || file.size < old.size
                || (file.size === old.size && file.mtime !== old.mtime);
        })) {
            saved = null;
            previous = {};
        }
        if (saved && [...files].every(([name, file]) => previous[name]?.size === file.size)) {
            this.index = saved;
            if (this.lastIndexError) this.persistIndex(saved);
            return saved;
        }

        const index = { ...createDefaultIndex(this.rootDir), ...saved,
            days: mapCopy(saved?.days), sessions: mapCopy(saved?.sessions), runs: mapCopy(saved?.runs) };
        const positions = mapCopy(previous);
        for (const [name, stamp] of files) {
            const old = previous[name];
            if (old?.size === stamp.size) continue;
            let entries = old?.entries ?? 0;
            const offset = scanJournalTail(stamp.filePath, old?.offset ?? 0, stamp, entry => {
                this.updateIndex(index, entry, entry.iso.slice(0, 10), stamp.filePath);
                entries += 1;
            });
            const { identity, size, mtime } = stamp;
            positions[name] = { identity, size, mtime, offset, entries };
        }
        index.indexCheckpoint = { version: INDEX_CHECKPOINT_VERSION, entryCount: index.entryCount, files: positions };
        index.updatedAt = nowIso();
        this.index = index;
        this.persistIndex(index);
        return index;
    }

    updateIndex(index, entry, day, entryPath) {
        index.entryCount = Number(index.entryCount || 0) + 1;
        index.days[day] = {
            day,
            path: entryPath,
            count: Number(index.days[day]?.count || 0) + 1,
            firstIso: index.days[day]?.firstIso || entry.iso,
            lastIso: entry.iso
        };
        if (entry.sessionId) {
            index.sessions[entry.sessionId] = {
                sessionId: entry.sessionId,
                count: Number(index.sessions[entry.sessionId]?.count || 0) + 1,
                firstIso: index.sessions[entry.sessionId]?.firstIso || entry.iso,
                lastIso: entry.iso
            };
        }
        if (entry.runId) {
            index.runs[entry.runId] = {
                runId: entry.runId,
                sessionId: entry.sessionId || index.runs[entry.runId]?.sessionId || '',
                count: Number(index.runs[entry.runId]?.count || 0) + 1,
                firstIso: index.runs[entry.runId]?.firstIso || entry.iso,
                lastIso: entry.iso
            };
        }
        if (index.lastEntry && compareIso(entry, index.lastEntry) < 0) return;
        index.lastEntry = {
            id: entry.id,
            iso: entry.iso,
            type: entry.type,
            source: entry.source,
            sessionId: entry.sessionId,
            runId: entry.runId,
            path: entryPath
        };
    }

    normalizeEntry(entry) {
        const iso = normalizeString(entry.iso || entry.ts, nowIso());
        return {
            id: normalizeString(entry.id, randomUUID()),
            version: RAW_MEMORY_LEDGER_VERSION,
            iso,
            ts: Date.parse(iso) || Date.now(),
            type: normalizeString(entry.type, 'raw.event'),
            source: normalizeString(entry.source, 'ailis'),
            sessionId: normalizeString(entry.sessionId, 'main'),
            runId: normalizeString(entry.runId),
            category: normalizeString(entry.category, 'raw'),
            payload: toJsonSafe(entry.payload || {}),
            meta: toJsonSafe(entry.meta || {})
        };
    }

    appendEntry(entry = {}) {
        if (!this.loaded) {
            return { ok: false, status: 'not_loaded', error: this.lastError };
        }
        const normalized = this.normalizeEntry(entry);
        const entryPath = this.getDayFile(normalized.iso.slice(0, 10));
        try {
            const line = `${JSON.stringify(normalized)}\n`;
            try {
                fs.appendFileSync(entryPath, line, 'utf8');
            } catch (error) {
                if (error?.code !== 'ENOENT') throw error;
                fs.mkdirSync(this.entriesDir, { recursive: true });
                fs.appendFileSync(entryPath, line, 'utf8');
            }
            return { ok: true, entry: normalized, path: entryPath };
        } catch (error) {
            this.lastError = error?.message || String(error);
            return { ok: false, status: 'append_failed', error: this.lastError };
        }
    }

    async appendEntryAsync(entry = {}) {
        if (!this.loaded) {
            return { ok: false, status: 'not_loaded', error: this.lastError };
        }
        const normalized = this.normalizeEntry(entry);
        const entryPath = this.getDayFile(normalized.iso.slice(0, 10));
        const line = `${JSON.stringify(normalized)}\n`;
        return journalWrites.run(entryPath, async () => {
            try {
                try {
                    await fsp.appendFile(entryPath, line, 'utf8');
                } catch (error) {
                    if (error?.code !== 'ENOENT') throw error;
                    await fsp.mkdir(this.entriesDir, { recursive: true });
                    await fsp.appendFile(entryPath, line, 'utf8');
                }
                return { ok: true, entry: normalized, path: entryPath };
            } catch (error) {
                this.lastError = error?.message || String(error);
                return { ok: false, status: 'append_failed', error: this.lastError };
            }
        });
    }

    buildChatTurnEntry({
        sessionId = 'main',
        source = 'direct_llm',
        requestPayload = {},
        enrichedPayload = {},
        result = {},
        durationMs = null
    } = {}) {
        return {
            type: 'chat.llm_turn',
            source,
            sessionId,
            category: 'conversation',
            payload: {
                requestPayload,
                enrichedPayload,
                result
            },
            meta: {
                durationMs
            }
        };
    }

    recordChatTurn(turn) {
        return this.appendEntry(this.buildChatTurnEntry(turn));
    }

    recordChatTurnAsync(turn) {
        return this.appendEntryAsync(this.buildChatTurnEntry(turn));
    }

    buildRuntimeItemEntry(transcriptItem = {}) {
        return {
            type: 'agent.transcript.item',
            source: 'agent_runtime',
            sessionId: transcriptItem.sessionId || 'main',
            runId: transcriptItem.runId || '',
            category: 'agent',
            payload: transcriptItem
        };
    }

    recordRuntimeItem(transcriptItem) {
        return this.appendEntry(this.buildRuntimeItemEntry(transcriptItem));
    }

    recordRuntimeItemAsync(transcriptItem) {
        return this.appendEntryAsync(this.buildRuntimeItemEntry(transcriptItem));
    }

    listEntryFiles(strict = false) {
        try {
            return fs.readdirSync(this.entriesDir, { withFileTypes: true })
                .filter((entry) => entry.isFile() && /\.jsonl$/i.test(entry.name))
                .map((entry) => path.join(this.entriesDir, entry.name))
                .sort();
        } catch (error) {
            if (strict) throw error;
            return [];
        }
    }

    readCurationPage(options = {}) {
        return require('./ailis-curation-reader.cjs').readCurationPage(this.entriesDir, options);
    }

    replay(options = {}) {
        const sessionId = normalizeString(options.sessionId);
        const runId = normalizeString(options.runId);
        const type = normalizeString(options.type);
        const source = normalizeString(options.source);
        const since = normalizeString(options.since);
        const until = normalizeString(options.until);
        const includePayload = options.includePayload !== false;
        const tail = options.tail !== false;
        const sinceExclusive = options.sinceExclusive === true;
        const afterId = normalizeString(options.afterId || options.afterEntryId);
        const limit = Math.min(
            Math.max(Number(options.limit) || DEFAULT_REPLAY_LIMIT, 1),
            MAX_REPLAY_LIMIT
        );
        const entries = [];
        for (const filePath of this.listEntryFiles()) {
            // Legacy synchronous diagnostics must fail safely on large archives.
            // Background curation uses readCurationPage instead.
            if (fs.statSync(filePath).size > 8 * 1024 * 1024) {
                throw new Error('raw_replay_requires_paging: archive too large for synchronous replay');
            }
            const text = fs.readFileSync(filePath, 'utf8');
            for (const line of text.split(/\r?\n/)) {
                if (!line) {
                    continue;
                }
                const entry = parseJsonLine(line);
                if (!entry) {
                    continue;
                }
                if (sessionId && entry.sessionId !== sessionId) {
                    continue;
                }
                if (runId && entry.runId !== runId) {
                    continue;
                }
                if (type && entry.type !== type) {
                    continue;
                }
                if (source && entry.source !== source) {
                    continue;
                }
                if (since && (sinceExclusive && !afterId
                    ? String(entry.iso || '') <= since
                    : String(entry.iso || '') < since)) {
                    continue;
                }
                if (until && String(entry.iso || '') > until) {
                    continue;
                }
                entries.push(includePayload ? entry : {
                    id: entry.id,
                    iso: entry.iso,
                    type: entry.type,
                    source: entry.source,
                    sessionId: entry.sessionId,
                    runId: entry.runId,
                    category: entry.category
                });
            }
        }
        entries.sort(compareIso);
        let cursorFilteredEntries = entries;
        if (since && afterId) {
            const cursorIndex = entries.findIndex((entry) =>
                String(entry.iso || '') === since && String(entry.id || '') === afterId
            );
            cursorFilteredEntries = cursorIndex >= 0
                ? entries.slice(cursorIndex + 1)
                : entries.filter((entry) => String(entry.iso || '') > since);
        }
        const selectedEntries = tail
            ? cursorFilteredEntries.slice(-limit)
            : cursorFilteredEntries.slice(0, limit);
        return {
            ok: true,
            status: 'ok',
            rootDir: this.rootDir,
            count: cursorFilteredEntries.length,
            limit,
            tail,
            entries: selectedEntries
        };
    }

    getStatus() {
        const index = this.readIndex();
        return {
            ok: true,
            loaded: Boolean(this.loaded),
            version: RAW_MEMORY_LEDGER_VERSION,
            rootDir: this.rootDir,
            entriesDir: this.entriesDir,
            indexPath: this.indexPath,
            entryCount: Number(index.entryCount) || 0,
            dayCount: Object.keys(index.days || {}).length,
            sessionCount: Object.keys(index.sessions || {}).length,
            runCount: Object.keys(index.runs || {}).length,
            lastEntry: index.lastEntry || null,
            lastError: this.lastError,
            indexError: this.lastIndexError
        };
    }

    listSessions(limit = 100) {
        const index = this.readIndex();
        const sessions = Object.values(index.sessions || {})
            .sort((a, b) => String(b.lastIso || '').localeCompare(String(a.lastIso || '')))
            .slice(0, Math.max(1, Math.min(Number(limit) || 100, 1000)));
        return { ok: true, sessions };
    }
}

module.exports = {
    AILISRawMemoryLedger,
    RAW_MEMORY_LEDGER_VERSION
};
