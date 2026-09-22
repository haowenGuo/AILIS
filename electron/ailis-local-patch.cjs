'use strict';
const fsp = require('node:fs/promises');
const { constants } = require('node:fs');
const path = require('node:path');
const { randomUUID } = require('node:crypto');

function normalizeString(value, fallback = '') {
    if (typeof value !== 'string') return fallback;
    return value.trim() || fallback;
}

function throwBlocked(message) {
    const error = new Error(message);
    error.code = 'AILIS_GATEWAY_BLOCKED';
    error.details = undefined;
    throw error;
}

function parseLocalPatch(input = '') {
    const patch = normalizeString(input);
    if (!patch.startsWith('*** Begin Patch') || !patch.includes('*** End Patch')) {
        throwBlocked('apply_patch input must start with *** Begin Patch and end with *** End Patch');
    }
    const lines = patch.split(/\r?\n/);
    const operations = [];
    let index = 1;
    const readBody = () => {
        const body = [];
        while (index < lines.length && !/^\*\*\* (?:Add File|Update File|Delete File|End Patch)/.test(lines[index])) {
            body.push(lines[index]);
            index += 1;
        }
        return body;
    };
    while (index < lines.length) {
        const line = lines[index];
        if (/^\*\*\* End Patch\s*$/.test(line)) {
            break;
        }
        let match = line.match(/^\*\*\* Add File:\s+(.+)$/);
        if (match) {
            index += 1;
            operations.push({ type: 'add', path: match[1].trim(), body: readBody() });
            continue;
        }
        match = line.match(/^\*\*\* Update File:\s+(.+)$/);
        if (match) {
            index += 1;
            operations.push({ type: 'update', path: match[1].trim(), body: readBody() });
            continue;
        }
        match = line.match(/^\*\*\* Delete File:\s+(.+)$/);
        if (match) {
            index += 1;
            operations.push({ type: 'delete', path: match[1].trim(), body: [] });
            continue;
        }
        if (normalizeString(line)) {
            throwBlocked(`unsupported apply_patch line: ${line}`);
        }
        index += 1;
    }
    if (!operations.length) {
        throwBlocked('apply_patch contains no file operations');
    }
    return operations;
}

function patchBodyToText(body = []) {
    const content = [];
    for (const line of body) {
        if (line.startsWith('+')) {
            content.push(line.slice(1));
        } else if (line.startsWith('***')) {
            break;
        } else if (normalizeString(line)) {
            throwBlocked(`add file patch lines must start with +: ${line}`);
        }
    }
    return content.length ? `${content.join('\n')}\n` : '';
}

function applyUpdatePatchText(source = '', body = []) {
    let text = source.replace(/\r\n/g, '\n');
    let oldLines = [];
    let newLines = [];
    const flush = () => {
        if (!oldLines.length && !newLines.length) {
            return;
        }
        const oldBlock = oldLines.length ? `${oldLines.join('\n')}\n` : '';
        const newBlock = newLines.length ? `${newLines.join('\n')}\n` : '';
        const variants = oldBlock.endsWith('\n') ? [oldBlock, oldBlock.slice(0, -1)] : [oldBlock];
        const found = variants.find((variant) => variant && text.includes(variant));
        if (!found) {
            throwBlocked('apply_patch update hunk did not match target file');
        }
        text = text.replace(found, found.endsWith('\n') ? newBlock : newBlock.replace(/\n$/, ''));
        oldLines = [];
        newLines = [];
    };
    for (const line of body) {
        if (line.startsWith('@@')) {
            flush();
            continue;
        }
        if (line.startsWith(' ')) {
            oldLines.push(line.slice(1));
            newLines.push(line.slice(1));
            continue;
        }
        if (line.startsWith('-')) {
            oldLines.push(line.slice(1));
            continue;
        }
        if (line.startsWith('+')) {
            newLines.push(line.slice(1));
            continue;
        }
        if (/^\\ No newline/.test(line) || !normalizeString(line)) {
            continue;
        }
        throwBlocked(`unsupported update patch line: ${line}`);
    }
    flush();
    return text;
}


// Preflight every operation before committing any file. Per-file replacement
// is atomic; a commit failure restores completed replacements when unchanged.
// This is not an OS transaction or protection against a hostile concurrent
// process: conflicting changes are preserved and explicitly reported.
async function applyLocalPatch({ operations, resolveTarget, addText, updateText, io = fsp, onCommitted }) {
    const files = new Map();
    const changedFiles = [];
    async function readFile(target) {
        try {
            const stat = await io.lstat(target);
            if (!stat.isFile() || stat.isSymbolicLink()) throw new Error(`apply_patch target must be a regular file: ${target}`);
            return { data: await io.readFile(target), mode: stat.mode };
        } catch (error) { if (error.code === 'ENOENT') return { data: null, mode: undefined }; throw error; }
    }
    const equal = (a, b) => a === null ? b === null : b !== null && a.equals(b);
    for (const operation of operations) {
        const target = resolveTarget(operation.path);
        let file = files.get(target);
        if (!file) {
            const before = await readFile(target);
            file = { target, rawPath: operation.path, before: before.data, mode: before.mode, after: before.data };
            files.set(target, file);
        }
        if (operation.type === 'add') file.after = Buffer.from(addText(operation.body), 'utf8');
        else if (operation.type === 'delete') file.after = null;
        else {
            if (file.after === null) throw new Error(`apply_patch update target not found: ${operation.path}`);
            file.after = Buffer.from(updateText(file.after.toString('utf8'), operation.body), 'utf8');
        }
        changedFiles.push({ action: operation.type, path: target, ...(file.after ? { bytes: file.after.length } : {}) });
    }
    // Renaming a new inode over a file can bypass its read-only mode on POSIX.
    // Preserve the original in-place writer's access requirement as well as
    // the parent directory permissions enforced by the eventual rename.
    for (const file of files.values()) {
        if (file.before !== null && file.after !== null) await io.access(file.target, constants.W_OK);
    }
    async function replace(file, data) {
        resolveTarget(file.rawPath);
        if (data === null) { await io.rm(file.target, { force: true }); return; }
        await io.mkdir(path.dirname(file.target), { recursive: true });
        resolveTarget(file.rawPath);
        const temporary = path.join(path.dirname(file.target), `.ailis-patch-${randomUUID()}.tmp`);
        let renamed = false;
        try {
            await io.writeFile(temporary, data, { flag: 'wx', mode: file.mode });
            await io.rename(temporary, file.target);
            renamed = true;
        } finally { if (!renamed) await io.rm(temporary, { force: true }); }
    }
    const committed = [];
    try {
        for (const file of files.values()) {
            resolveTarget(file.rawPath);
            if (!equal((await readFile(file.target)).data, file.before)) throw new Error(`apply_patch target changed during preflight: ${file.target}`);
            if (file.before !== null && file.after !== null) await io.access(file.target, constants.W_OK);
            await replace(file, file.after);
            committed.push(file);
        }
    } catch (cause) {
        const restored = [], rollbackFailed = [];
        for (const file of committed.reverse()) {
            try {
                resolveTarget(file.rawPath);
                if (!equal((await readFile(file.target)).data, file.after)) throw new Error('concurrent change preserved');
                await replace(file, file.before); restored.push(file.target);
            } catch (error) { rollbackFailed.push({ path: file.target, error: error.message }); }
        }
        const error = new Error(`apply_patch commit failed: ${cause.message}; restored ${restored.length} file(s); unresolved ${rollbackFailed.length}`);
        error.code = 'patch_commit_failed';
        error.details = { restored, rollbackFailed };
        throw error;
    }
    // Publish evidence only after the complete patch commits. An observer
    // failure cannot turn a successful disk write into an apparent rollback.
    const observationErrors = [];
    for (const file of files.values()) {
        try { await onCommitted?.({ target: file.target, before: file.before, after: file.after }); }
        catch (error) { observationErrors.push({ path: file.target, error: error.message }); }
    }
    return { content: [{ type: 'text', text: `apply_patch completed: ${changedFiles.length} file(s)` }],
        details: { status: 'completed', action: 'apply_patch', changedFiles,
            ...(observationErrors.length ? { observationErrors } : {}) } };
}
module.exports = { applyLocalPatch, parseLocalPatch, patchBodyToText, applyUpdatePatchText };
