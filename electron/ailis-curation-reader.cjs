'use strict';

// Curation reads pages, not whole archives. Every read yields to the main loop;
// only a bounded JSON record is parsed at once. Diagnostic payloads stay on disk.
const fs = require('node:fs/promises');
const path = require('node:path');
const CHUNK = 64 * 1024;
const MAX_LINE = 256 * 1024;
const MAX_PAGE = 2 * 1024 * 1024;

async function readCurationPage(entriesDir, options = {}) {
    const limit = Math.min(5000, Math.max(1, Number(options.limit) || 5000));
    const budget = Math.min(64 * 1024 * 1024, Math.max(MAX_LINE * 2, Number(options.maxScanBytes) || 16 * 1024 * 1024));
    const files = (await fs.readdir(entriesDir)).filter(n => /^\d{4}-\d{2}-\d{2}\.jsonl$/.test(n)).sort();
    const since = String(options.since || '');
    const saved = options.scanCursor;
    if (saved && (!files.includes(saved.file) || !Number.isSafeInteger(saved.offset) || saved.offset < 0)) {
        throw new Error('curation_cursor_invalid: archive missing or cursor invalid; history not advanced');
    }
    const entries = [];
    let bytesRead = 0;
    let outputBytes = 0;
    let nextCursor = saved || null;
    let afterFound = saved?.afterFound ?? !options.afterId;
    const cursors = [];
    const finish = (hasMore, awaitingAppend = false) => ({
        ok: true, entries, count: entries.length, entryCursors: cursors,
        nextCursor, hasMore, awaitingAppend, bytesRead, countExact: !hasMore
    });
    for (const file of files) {
        if (saved && file < saved.file) continue;
        if (!saved && since && file.slice(0, 10) < since.slice(0, 10)) continue;
        const handle = await fs.open(path.join(entriesDir, file), 'r');
        try {
            const stat = await handle.stat();
            let position = saved?.file === file ? saved.offset : 0;
            if (position > stat.size || (saved?.file === file && saved.ino !== undefined && String(stat.ino) !== saved.ino)) {
                throw new Error('curation_cursor_invalid: archive replaced or truncated; history not advanced');
            }
            const cursor = (offset, skipHeader = null) => ({ file, offset, ino: String(stat.ino), afterFound, ...(skipHeader ? { skipHeader } : {}) });
            let header = saved?.file === file ? saved.skipHeader || null : null;
            let startHeader = header;
            let pending = Buffer.alloc(0);
            let lineStart = position;
            const buffer = Buffer.alloc(CHUNK);
            nextCursor = cursor(position, header);
            while (position < stat.size) {
                if (bytesRead >= budget) {
                    nextCursor = header ? cursor(position, header) : cursor(lineStart);
                    return finish(true);
                }
                const length = Math.min(CHUNK, stat.size - position, budget - bytesRead);
                const { bytesRead: n } = await handle.read(buffer, 0, length, position);
                if (!n) break;
                bytesRead += n;
                let offset = 0;
                while (offset < n) {
                    const found = buffer.indexOf(10, offset);
                    const end = found >= 0 && found < n ? found : n;
                    const segment = buffer.subarray(offset, end);
                    if (!header) {
                        pending = Buffer.concat([pending, segment]);
                        // appendEntry writes the envelope before payload. Parse that
                        // envelope structurally, never infer record type from content.
                        const marker = pending.indexOf(',"payload":');
                        if (marker >= 0) {
                            try {
                                const candidate = JSON.parse(pending.subarray(0, marker).toString('utf8') + '}');
                                if (candidate.type && candidate.type !== 'chat.llm_turn') {
                                    header = candidate;
                                    pending = Buffer.alloc(0);
                                }
                            } catch {}
                        }
                        if (pending.length > MAX_LINE) {
                            throw new Error(`curation_record_too_large: ${file}:${lineStart}; source preserved`);
                        }
                    }
                    if (end === n) { offset = n; continue; }
                    const endPosition = position + end + 1;
                    let entry = header;
                    if (!entry && pending.toString('utf8').trim()) {
                        try { entry = JSON.parse(pending.toString('utf8')); }
                        catch { throw new Error(`curation_invalid_json: ${file}:${lineStart}; source preserved`); }
                    }
                    header = null;
                    pending = Buffer.alloc(0);
                    const entryStart = lineStart;
                    const entryStartHeader = startHeader;
                    lineStart = endPosition;
                    startHeader = null;
                    let eligible = Boolean(entry);
                    // Migration may take several pages to reach the old semantic
                    // cursor. Preserve its tie-break state across those pages.
                    if (eligible && since) {
                        if (entry.iso < since) eligible = false;
                        else if (entry.iso === since) {
                            if (entry.id === options.afterId) { afterFound = true; eligible = false; }
                            else if (!options.afterId || !afterFound) eligible = false;
                        } else afterFound = true;
                    }
                    nextCursor = cursor(endPosition);
                    if (eligible) {
                        const size = Buffer.byteLength(JSON.stringify(entry));
                        if (entries.length && outputBytes + size > MAX_PAGE) {
                            nextCursor = cursor(entryStart, entryStartHeader);
                            return finish(true);
                        }
                        entries.push(entry);
                        cursors.push(nextCursor);
                        outputBytes += size;
                        if (entries.length >= limit) return finish(endPosition < stat.size || file !== files.at(-1));
                    }
                    offset = end + 1;
                }
                position += n;
            }
            // Never commit a half-written record. appendEntry terminates records
            // with LF, so the next invocation will safely reread this fragment.
            if (pending.length || header) {
                nextCursor = cursor(lineStart, saved?.file === file && saved.skipHeader && lineStart === saved.offset ? saved.skipHeader : null);
                return finish(false, true);
            }
            nextCursor = cursor(position);
        } finally { await handle.close(); }
    }
    return finish(false);
}

module.exports = { readCurationPage };
