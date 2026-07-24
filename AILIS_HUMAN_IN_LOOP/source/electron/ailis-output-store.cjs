const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');
const readline = require('readline');
const { randomUUID } = require('crypto');

const DEFAULT_PREVIEW_CHARS = 6000;
const DEFAULT_READ_BYTES = 6000;
const MAX_READ_BYTES = 512 * 1024;

function normalizeString(value, fallback = '') {
    if (typeof value !== 'string') {
        return fallback;
    }
    const trimmed = value.trim();
    return trimmed || fallback;
}

function safeSegment(value = '', fallback = 'output') {
    const normalized = normalizeString(value, fallback)
        .replace(/[^a-zA-Z0-9._-]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 160);
    return normalized || fallback;
}

function normalizeNumber(value, fallback, min, max) {
    const number = Number(value);
    if (!Number.isFinite(number)) {
        return fallback;
    }
    return Math.max(min, Math.min(max, number));
}

function countLineBreaks(text = '') {
    return (String(text).match(/\r\n|\n|\r/g) || []).length;
}

function isNewlineChar(value = '') {
    return value === '\n' || value === '\r';
}

function buildTextPreview(text = '', maxChars = DEFAULT_PREVIEW_CHARS) {
    const source = String(text || '');
    const budget = Math.max(256, Number(maxChars) || DEFAULT_PREVIEW_CHARS);
    if (source.length <= budget) {
        return {
            preview: source,
            previewTruncated: false,
            previewChars: source.length
        };
    }
    const marker = '\n... [output preview truncated; full output is stored for Agent Lab. Narrow the command or write needed data to a normal file.] ...\n';
    const remaining = Math.max(0, budget - marker.length);
    const head = Math.ceil(remaining * 0.55);
    const tail = Math.max(0, remaining - head);
    const preview = `${source.slice(0, head)}${marker}${tail ? source.slice(-tail) : ''}`;
    return {
        preview,
        previewTruncated: true,
        previewChars: preview.length
    };
}

async function pathExists(target) {
    try {
        await fsp.access(target);
        return true;
    } catch {
        return false;
    }
}

function channelPath(basePath, channel = 'combined') {
    if (channel === 'stdout') {
        return basePath.replace(/\.log$/i, '.stdout.log');
    }
    if (channel === 'stderr') {
        return basePath.replace(/\.log$/i, '.stderr.log');
    }
    return basePath;
}

class ExecOutputCapture {
    constructor({ store, outputId, metadata = {}, previewChars = DEFAULT_PREVIEW_CHARS } = {}) {
        this.store = store;
        this.outputId = outputId;
        this.metadata = { ...metadata, outputId };
        this.previewChars = Math.max(256, Number(previewChars) || DEFAULT_PREVIEW_CHARS);
        this.logPath = this.store.resolveLogPath(outputId);
        this.stdoutPath = channelPath(this.logPath, 'stdout');
        this.stderrPath = channelPath(this.logPath, 'stderr');
        this.metaPath = this.logPath.replace(/\.log$/i, '.json');
        this.queue = Promise.resolve();
        this.finalized = false;
        this.stats = {
            outputId,
            path: this.logPath,
            stdoutPath: this.stdoutPath,
            stderrPath: this.stderrPath,
            combinedBytes: 0,
            stdoutBytes: 0,
            stderrBytes: 0,
            combinedLineBreaks: 0,
            stdoutLineBreaks: 0,
            stderrLineBreaks: 0,
            combinedEndsWithNewline: false,
            stdoutEndsWithNewline: false,
            stderrEndsWithNewline: false,
            chunkCount: 0,
            startedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            status: 'running'
        };
        this.previewSource = '';
    }

    async init() {
        await fsp.mkdir(this.store.rootDir, { recursive: true });
        await Promise.all([
            fsp.writeFile(this.logPath, '', 'utf8'),
            fsp.writeFile(this.stdoutPath, '', 'utf8'),
            fsp.writeFile(this.stderrPath, '', 'utf8')
        ]);
        await this.writeMetadata();
        return this;
    }

    append(channel = 'stdout', chunk = '') {
        const text = Buffer.isBuffer(chunk) ? chunk.toString('utf8') : String(chunk ?? '');
        if (!text) {
            return;
        }
        const bytes = Buffer.byteLength(text, 'utf8');
        const lineBreaks = countLineBreaks(text);
        const lastChar = text.slice(-1);
        this.stats.chunkCount += 1;
        this.stats.updatedAt = new Date().toISOString();
        this.stats.combinedBytes += bytes;
        this.stats.combinedLineBreaks += lineBreaks;
        this.stats.combinedEndsWithNewline = isNewlineChar(lastChar);
        if (channel === 'stderr') {
            this.stats.stderrBytes += bytes;
            this.stats.stderrLineBreaks += lineBreaks;
            this.stats.stderrEndsWithNewline = isNewlineChar(lastChar);
        } else {
            this.stats.stdoutBytes += bytes;
            this.stats.stdoutLineBreaks += lineBreaks;
            this.stats.stdoutEndsWithNewline = isNewlineChar(lastChar);
        }
        this.previewSource += text;
        if (this.previewSource.length > this.previewChars * 3) {
            this.previewSource = `${this.previewSource.slice(0, this.previewChars)}${this.previewSource.slice(-this.previewChars)}`;
        }
        const target = channel === 'stderr' ? this.stderrPath : this.stdoutPath;
        this.queue = this.queue
            .then(async () => {
                await fsp.appendFile(this.logPath, text, 'utf8');
                await fsp.appendFile(target, text, 'utf8');
            })
            .catch(() => {});
    }

    lineCount(channel = 'combined') {
        const prefix = channel === 'stdout' ? 'stdout' : channel === 'stderr' ? 'stderr' : 'combined';
        const bytes = this.stats[`${prefix}Bytes`] || 0;
        const breaks = this.stats[`${prefix}LineBreaks`] || 0;
        const endsWithNewline = this.stats[`${prefix}EndsWithNewline`] === true;
        return bytes > 0 ? breaks + (endsWithNewline ? 0 : 1) : 0;
    }

    summary() {
        const preview = buildTextPreview(this.previewSource, this.previewChars);
        return {
            outputId: this.outputId,
            path: this.logPath,
            stdoutPath: this.stdoutPath,
            stderrPath: this.stderrPath,
            status: this.stats.status,
            bytes: this.stats.combinedBytes,
            stdoutBytes: this.stats.stdoutBytes,
            stderrBytes: this.stats.stderrBytes,
            lineCount: this.lineCount('combined'),
            stdoutLineCount: this.lineCount('stdout'),
            stderrLineCount: this.lineCount('stderr'),
            chunkCount: this.stats.chunkCount,
            startedAt: this.stats.startedAt,
            updatedAt: this.stats.updatedAt,
            ...preview,
            read: {
                tool: 'output_read',
                args: { outputId: this.outputId }
            },
            tail: {
                tool: 'output_tail',
                args: { outputId: this.outputId }
            },
            search: {
                tool: 'output_search',
                args: { outputId: this.outputId, query: '<text>' }
            }
        };
    }

    async writeMetadata(extra = {}) {
        const metadata = {
            ...this.metadata,
            ...extra,
            ...this.summary()
        };
        await fsp.writeFile(this.metaPath, `${JSON.stringify(metadata, null, 2)}\n`, 'utf8');
        return metadata;
    }

    async finalize(extra = {}) {
        if (this.finalized) {
            return this.summary();
        }
        this.finalized = true;
        this.stats.status = normalizeString(extra.status, this.stats.status === 'running' ? 'completed' : this.stats.status);
        this.stats.updatedAt = new Date().toISOString();
        await this.queue;
        await this.writeMetadata(extra);
        return this.summary();
    }
}

class AILISOutputStore {
    constructor({ rootDir } = {}) {
        this.rootDir = path.resolve(rootDir || path.join(process.cwd(), '.ailis-state', 'output-store'));
    }

    resolveOutputId(outputId = '') {
        return safeSegment(outputId, randomUUID());
    }

    resolveLogPath(outputId = '') {
        return path.join(this.rootDir, `${this.resolveOutputId(outputId)}.log`);
    }

    async createCapture({ outputId = '', callId = '', metadata = {}, previewChars = DEFAULT_PREVIEW_CHARS } = {}) {
        const id = this.resolveOutputId(outputId || callId || randomUUID());
        return await new ExecOutputCapture({
            store: this,
            outputId: id,
            previewChars,
            metadata: {
                callId: callId || id,
                createdAt: new Date().toISOString(),
                ...metadata
            }
        }).init();
    }

    async loadMetadata(outputId = '') {
        const id = this.resolveOutputId(outputId);
        const metaPath = this.resolveLogPath(id).replace(/\.log$/i, '.json');
        if (!(await pathExists(metaPath))) {
            return null;
        }
        try {
            return JSON.parse(await fsp.readFile(metaPath, 'utf8'));
        } catch {
            return null;
        }
    }

    async read({ outputId = '', channel = 'combined', offset = 0, limit = DEFAULT_READ_BYTES } = {}) {
        const id = this.resolveOutputId(outputId);
        const logPath = channelPath(this.resolveLogPath(id), channel);
        if (!(await pathExists(logPath))) {
            return {
                ok: false,
                status: 'not_found',
                outputId: id,
                error: `output not found: ${id}`
            };
        }
        const stat = await fsp.stat(logPath);
        const start = normalizeNumber(offset, 0, 0, Math.max(0, stat.size));
        const size = normalizeNumber(limit, DEFAULT_READ_BYTES, 1, MAX_READ_BYTES);
        const handle = await fsp.open(logPath, 'r');
        try {
            const buffer = Buffer.alloc(Math.min(size, Math.max(0, stat.size - start)));
            const { bytesRead } = await handle.read(buffer, 0, buffer.length, start);
            const text = buffer.subarray(0, bytesRead).toString('utf8');
            return {
                ok: true,
                status: 'completed',
                outputId: id,
                channel,
                path: logPath,
                offset: start,
                returnedBytes: bytesRead,
                totalBytes: stat.size,
                nextOffset: start + bytesRead,
                hasMore: start + bytesRead < stat.size,
                text,
                metadata: await this.loadMetadata(id)
            };
        } finally {
            await handle.close();
        }
    }

    async tail({ outputId = '', channel = 'combined', bytes = DEFAULT_READ_BYTES, lines = 0 } = {}) {
        const id = this.resolveOutputId(outputId);
        const logPath = channelPath(this.resolveLogPath(id), channel);
        if (!(await pathExists(logPath))) {
            return {
                ok: false,
                status: 'not_found',
                outputId: id,
                error: `output not found: ${id}`
            };
        }
        const stat = await fsp.stat(logPath);
        const size = normalizeNumber(bytes, DEFAULT_READ_BYTES, 1, MAX_READ_BYTES);
        const read = await this.read({
            outputId: id,
            channel,
            offset: Math.max(0, stat.size - size),
            limit: size
        });
        if (!read.ok) {
            return read;
        }
        const lineLimit = Number(lines);
        const text = Number.isFinite(lineLimit) && lineLimit > 0
            ? read.text.split(/\r\n|\n|\r/).slice(-lineLimit).join('\n')
            : read.text;
        return {
            ...read,
            action: 'output_tail',
            lines: Number.isFinite(lineLimit) && lineLimit > 0 ? lineLimit : undefined,
            text
        };
    }

    async search({ outputId = '', channel = 'combined', query = '', regex = false, caseSensitive = false, maxResults = 20, contextLines = 1 } = {}) {
        const id = this.resolveOutputId(outputId);
        const needle = normalizeString(query);
        if (!needle) {
            return {
                ok: false,
                status: 'invalid_args',
                outputId: id,
                error: 'output_search requires query'
            };
        }
        let matcher = null;
        try {
            matcher = regex
                ? new RegExp(needle, caseSensitive ? '' : 'i')
                : null;
        } catch (error) {
            return {
                ok: false,
                status: 'invalid_regex',
                outputId: id,
                error: error?.message || String(error)
            };
        }
        const logPath = channelPath(this.resolveLogPath(id), channel);
        if (!(await pathExists(logPath))) {
            return {
                ok: false,
                status: 'not_found',
                outputId: id,
                error: `output not found: ${id}`
            };
        }
        const stat = await fsp.stat(logPath);
        const limit = normalizeNumber(maxResults, 20, 1, 200);
        const context = normalizeNumber(contextLines, 1, 0, 5);
        const normalizedNeedle = caseSensitive ? needle : needle.toLowerCase();
        const matches = [];
        const beforeBuffer = [];
        const pendingAfter = [];
        let lineNumber = 0;
        const stream = fs.createReadStream(logPath, { encoding: 'utf8' });
        const reader = readline.createInterface({ input: stream, crlfDelay: Infinity });
        for await (const line of reader) {
            lineNumber += 1;
            for (let index = pendingAfter.length - 1; index >= 0; index -= 1) {
                const pending = pendingAfter[index];
                if (pending.remaining > 0) {
                    pending.match.after.push(line);
                    pending.remaining -= 1;
                }
                if (pending.remaining <= 0) {
                    pendingAfter.splice(index, 1);
                }
            }
            const hit = matcher ? matcher.test(line) : (caseSensitive ? line : line.toLowerCase()).includes(normalizedNeedle);
            if (hit && matches.length < limit) {
                const match = {
                    lineNumber,
                    text: line,
                    before: context ? [...beforeBuffer] : [],
                    after: []
                };
                matches.push(match);
                if (context) {
                    pendingAfter.push({ match, remaining: context });
                }
            }
            if (context) {
                beforeBuffer.push(line);
                if (beforeBuffer.length > context) {
                    beforeBuffer.shift();
                }
            }
            if (matches.length >= limit && pendingAfter.length === 0) {
                stream.destroy();
                break;
            }
        }
        return {
            ok: true,
            status: 'completed',
            outputId: id,
            channel,
            query: needle,
            regex: Boolean(regex),
            caseSensitive: Boolean(caseSensitive),
            matchCount: matches.length,
            matches,
            totalBytes: stat.size,
            searchedLines: lineNumber,
            truncated: matches.length >= limit,
            metadata: await this.loadMetadata(id)
        };
    }
}

module.exports = {
    DEFAULT_PREVIEW_CHARS,
    AILISOutputStore,
    buildTextPreview,
    safeSegment
};
