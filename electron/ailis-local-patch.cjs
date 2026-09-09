'use strict';
const fsp = require('node:fs/promises');
const { constants } = require('node:fs');
const path = require('node:path');
const { randomUUID } = require('node:crypto');

// Preflight every operation before committing any file. Per-file replacement
// is atomic; a commit failure restores completed replacements when unchanged.
// This is not an OS transaction or protection against a hostile concurrent
// process: conflicting changes are preserved and explicitly reported.
async function applyLocalPatch({ operations, resolveTarget, addText, updateText, io = fsp }) {
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
    return { content: [{ type: 'text', text: `apply_patch completed: ${changedFiles.length} file(s)` }],
        details: { status: 'completed', action: 'apply_patch', changedFiles } };
}
module.exports = { applyLocalPatch };
