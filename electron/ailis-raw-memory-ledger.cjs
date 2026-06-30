const fs = require('fs');
const path = require('path');
const { randomUUID } = require('crypto');

const RAW_MEMORY_LEDGER_VERSION = 1;
const DEFAULT_REPLAY_LIMIT = 200;
const MAX_REPLAY_LIMIT = 5000;
const REDACTED = '__REDACTED__';

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
    const tmpPath = `${filePath}.${process.pid}.${Date.now()}.tmp`;
    fs.writeFileSync(tmpPath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
    fs.renameSync(tmpPath, filePath);
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

class AILISRawMemoryLedger {
    constructor(options = {}) {
        this.workspaceRoot = path.resolve(options.workspaceRoot || process.cwd());
        this.rootDir = path.resolve(options.rootDir || path.join(this.workspaceRoot, '.ailis-state', 'raw-memory'));
        this.entriesDir = path.join(this.rootDir, 'entries');
        this.indexPath = path.join(this.rootDir, 'index.json');
        this.lastError = '';
        this.initialize();
    }

    initialize() {
        try {
            fs.mkdirSync(this.entriesDir, { recursive: true });
            if (!fs.existsSync(this.indexPath)) {
                atomicWriteJsonSync(this.indexPath, createDefaultIndex(this.rootDir));
            }
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
        const index = readJsonSync(this.indexPath, createDefaultIndex(this.rootDir));
        return {
            ...createDefaultIndex(this.rootDir),
            ...index,
            days: index.days && typeof index.days === 'object' ? index.days : {},
            sessions: index.sessions && typeof index.sessions === 'object' ? index.sessions : {},
            runs: index.runs && typeof index.runs === 'object' ? index.runs : {}
        };
    }

    persistIndex(index) {
        atomicWriteJsonSync(this.indexPath, {
            ...index,
            version: RAW_MEMORY_LEDGER_VERSION,
            rootDir: this.rootDir,
            updatedAt: nowIso()
        });
    }

    updateIndex(entry, day, entryPath) {
        const index = this.readIndex();
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
        index.lastEntry = {
            id: entry.id,
            iso: entry.iso,
            type: entry.type,
            source: entry.source,
            sessionId: entry.sessionId,
            runId: entry.runId,
            path: entryPath
        };
        this.persistIndex(index);
    }

    appendEntry(entry = {}) {
        if (!this.loaded) {
            return { ok: false, status: 'not_loaded', error: this.lastError };
        }
        const iso = normalizeString(entry.iso || entry.ts, nowIso());
        const day = iso.slice(0, 10);
        const entryPath = this.getDayFile(day);
        const normalized = {
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
        try {
            fs.mkdirSync(path.dirname(entryPath), { recursive: true });
            fs.appendFileSync(entryPath, `${JSON.stringify(normalized)}\n`, 'utf8');
            this.updateIndex(normalized, day, entryPath);
            return { ok: true, entry: normalized, path: entryPath };
        } catch (error) {
            this.lastError = error?.message || String(error);
            return { ok: false, status: 'append_failed', error: this.lastError };
        }
    }

    recordChatTurn({
        sessionId = 'main',
        source = 'direct_llm',
        requestPayload = {},
        enrichedPayload = {},
        result = {},
        durationMs = null
    } = {}) {
        return this.appendEntry({
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
        });
    }

    recordRuntimeItem(transcriptItem = {}) {
        return this.appendEntry({
            type: 'agent.transcript.item',
            source: 'agent_runtime',
            sessionId: transcriptItem.sessionId || 'main',
            runId: transcriptItem.runId || '',
            category: 'agent',
            payload: transcriptItem
        });
    }

    listEntryFiles() {
        try {
            return fs.readdirSync(this.entriesDir, { withFileTypes: true })
                .filter((entry) => entry.isFile() && /\.jsonl$/i.test(entry.name))
                .map((entry) => path.join(this.entriesDir, entry.name))
                .sort();
        } catch {
            return [];
        }
    }

    replay(options = {}) {
        const sessionId = normalizeString(options.sessionId);
        const runId = normalizeString(options.runId);
        const type = normalizeString(options.type);
        const source = normalizeString(options.source);
        const since = normalizeString(options.since);
        const until = normalizeString(options.until);
        const includePayload = options.includePayload !== false;
        const limit = Math.min(
            Math.max(Number(options.limit) || DEFAULT_REPLAY_LIMIT, 1),
            MAX_REPLAY_LIMIT
        );
        const entries = [];
        for (const filePath of this.listEntryFiles()) {
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
                if (since && String(entry.iso || '') < since) {
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
        return {
            ok: true,
            status: 'ok',
            rootDir: this.rootDir,
            count: entries.length,
            limit,
            entries: entries.slice(-limit)
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
            lastError: this.lastError
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
