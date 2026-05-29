const fs = require('fs');
const fsp = require('fs/promises');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const { execFile, spawn } = require('child_process');
const { randomUUID } = require('crypto');

const COMPUTER_TOOL_ID = 'computer';
const DEFAULT_MAX_BYTES = 128 * 1024;
const DEFAULT_SEARCH_LIMIT = 200;
const DEFAULT_TREE_LIMIT = 500;
const DEFAULT_PROCESS_BUFFER_BYTES = 256 * 1024;
const DEFAULT_EXEC_TIMEOUT_MS = 30000;
const DEFAULT_SESSION_TIMEOUT_MS = 12 * 60 * 60 * 1000;
const DEFAULT_BINARY_CHUNK_BYTES = 256 * 1024;
const DEFAULT_WATCH_BUFFER_EVENTS = 500;
const DEFAULT_ROLLBACK_LIMIT = 200;

const WRITE_ACTIONS = new Set([
    'write',
    'append',
    'mkdir',
    'copy',
    'move',
    'rename',
    'delete',
    'trash',
    'exec',
    'run',
    'session_start',
    'pty_start',
    'pty_write',
    'pty_kill',
    'process_write',
    'process_kill',
    'watch_stop',
    'write_binary',
    'acl_set',
    'rollback_restore'
]);

const READ_ONLY_ACTIONS = new Set([
    'schema',
    'ls',
    'list',
    'tree',
    'stat',
    'read',
    'read_binary',
    'search',
    'find',
    'hash',
    'du',
    'acl_get',
    'watch_start',
    'watch_poll',
    'watch_list',
    'pty_status',
    'pty_read',
    'pty_resize',
    'rollback_list',
    'process_list',
    'process_read'
]);

let nodePtyLoadResult = null;

function loadNodePty() {
    if (nodePtyLoadResult) {
        return nodePtyLoadResult;
    }
    try {
        // node-pty is a native optional dependency. pnpm may require build-script approval,
        // so every PTY action must degrade cleanly when it cannot be loaded.
        nodePtyLoadResult = { ok: true, pty: require('node-pty') };
    } catch (error) {
        nodePtyLoadResult = { ok: false, error: error?.message || String(error) };
    }
    return nodePtyLoadResult;
}

function normalizeString(value, fallback = '') {
    if (typeof value !== 'string') {
        return fallback;
    }
    const trimmed = value.trim();
    return trimmed || fallback;
}

function normalizeBoolean(value, fallback = false) {
    if (typeof value === 'boolean') {
        return value;
    }
    if (typeof value === 'string') {
        if (/^(true|1|yes|on)$/i.test(value.trim())) {
            return true;
        }
        if (/^(false|0|no|off)$/i.test(value.trim())) {
            return false;
        }
    }
    return fallback;
}

function normalizeNumber(value, fallback, min, max) {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) {
        return fallback;
    }
    return Math.min(Math.max(parsed, min), max);
}

function isPathInside(rootPath, targetPath) {
    const root = path.resolve(rootPath);
    const target = path.resolve(targetPath);
    const rootComparable = process.platform === 'win32' ? root.toLowerCase() : root;
    const targetComparable = process.platform === 'win32' ? target.toLowerCase() : target;
    return targetComparable === rootComparable || targetComparable.startsWith(`${rootComparable}${path.sep}`);
}

function uniquePaths(paths) {
    const seen = new Set();
    const result = [];
    for (const entry of paths) {
        const normalized = normalizeString(entry);
        if (!normalized) {
            continue;
        }
        const resolved = path.resolve(normalized);
        const key = process.platform === 'win32' ? resolved.toLowerCase() : resolved;
        if (!seen.has(key)) {
            seen.add(key);
            result.push(resolved);
        }
    }
    return result;
}

function maybePath(...parts) {
    if (parts.some((part) => !normalizeString(part))) {
        return '';
    }
    return path.join(...parts);
}

function commonUserRoots(runtime = {}) {
    const home = os.homedir();
    return uniquePaths([
        runtime.workspaceRoot,
        runtime.workspaceDir,
        runtime.projectRoot,
        home,
        os.tmpdir(),
        process.env.TEMP,
        process.env.TMP,
        maybePath(process.env.LOCALAPPDATA, 'Temp'),
        maybePath(home, 'Desktop'),
        maybePath(home, 'Documents'),
        maybePath(home, 'Downloads'),
        maybePath(home, 'Pictures'),
        maybePath(home, 'Videos'),
        maybePath(home, 'Music')
    ]);
}

function protectedRoots() {
    if (process.platform !== 'win32') {
        return ['/', '/bin', '/boot', '/dev', '/etc', '/lib', '/proc', '/root', '/sbin', '/sys', '/usr'];
    }
    const systemDrive = process.env.SystemDrive || 'C:';
    const windir = process.env.WINDIR || `${systemDrive}\\Windows`;
    return uniquePaths([
        `${systemDrive}\\`,
        windir,
        `${systemDrive}\\Program Files`,
        `${systemDrive}\\Program Files (x86)`,
        `${systemDrive}\\ProgramData`
    ]);
}

function resolveTargetPath(rawPath, runtime = {}) {
    const value = normalizeString(rawPath);
    if (!value) {
        return '';
    }
    if (value === '~') {
        return os.homedir();
    }
    if (value.startsWith(`~${path.sep}`) || value.startsWith('~/')) {
        return path.resolve(os.homedir(), value.slice(2));
    }
    if (path.isAbsolute(value)) {
        return path.resolve(value);
    }
    return path.resolve(runtime.workspaceDir || runtime.workspaceRoot || process.cwd(), value);
}

function guardPath(targetPath, action, context = {}, runtime = {}) {
    if (!targetPath) {
        return createErrorResult('needs_config', 'computer 工具需要 path/source/target/workdir 参数。');
    }
    const readOnly = READ_ONLY_ACTIONS.has(action);
    const commonRoots = commonUserRoots(runtime);
    const insideCommon = commonRoots.some((root) => isPathInside(root, targetPath));
    if (insideCommon) {
        return null;
    }
    const outsideAllowed = context.allowOutsideWorkspace === true || context.allowComputerWideAccess === true;
    if (!outsideAllowed) {
        return createErrorResult(
            'blocked',
            'computer 默认只访问工作区、用户目录和临时目录。访问其他路径需要 context.allowOutsideWorkspace=true。',
            {
                path: targetPath,
                action,
                commonRoots
            }
        );
    }
    const protectedHit = protectedRoots().find((root) => isPathInside(root, targetPath));
    if (protectedHit && !readOnly && context.allowSystemMutation !== true) {
        return createErrorResult(
            'blocked',
            '拒绝修改系统保护目录。若确实需要系统级修改，必须显式设置 context.allowSystemMutation=true 且通过审批。',
            {
                path: targetPath,
                protectedRoot: protectedHit,
                action
            }
        );
    }
    return null;
}

function createTextResult(text, details = {}) {
    return {
        content: text ? [{ type: 'text', text }] : [],
        details
    };
}

function createErrorResult(status, message, details = {}) {
    return {
        content: [{ type: 'text', text: message }],
        isError: true,
        details: {
            status,
            error: message,
            ...details
        }
    };
}

function formatBytes(bytes) {
    if (!Number.isFinite(bytes)) {
        return 'unknown';
    }
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let value = bytes;
    let unitIndex = 0;
    while (value >= 1024 && unitIndex < units.length - 1) {
        value /= 1024;
        unitIndex += 1;
    }
    return `${value.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

async function safeStat(targetPath) {
    try {
        return await fsp.lstat(targetPath);
    } catch {
        return null;
    }
}

function statDetails(targetPath, stat) {
    return {
        path: targetPath,
        type: stat.isDirectory()
            ? 'directory'
            : stat.isFile()
                ? 'file'
                : stat.isSymbolicLink()
                    ? 'symlink'
                    : 'other',
        size: stat.size,
        sizeText: formatBytes(stat.size),
        mode: stat.mode,
        createdAt: stat.birthtime.toISOString(),
        modifiedAt: stat.mtime.toISOString(),
        accessedAt: stat.atime.toISOString()
    };
}

function getWorkspaceRoot(runtime = {}) {
    return path.resolve(runtime.workspaceRoot || runtime.workspaceDir || process.cwd());
}

function getRollbackRoot(runtime = {}) {
    return path.join(getWorkspaceRoot(runtime), '.humanclaw-rollback');
}

function sanitizePathComponent(value) {
    return normalizeString(value, 'path').replace(/[^a-zA-Z0-9._-]+/g, '_').slice(0, 80) || 'path';
}

function rollbackJournalPath(runtime = {}) {
    return path.join(getRollbackRoot(runtime), 'journal.jsonl');
}

async function appendJsonLine(filePath, entry) {
    await fsp.mkdir(path.dirname(filePath), { recursive: true });
    await fsp.appendFile(filePath, `${JSON.stringify(entry)}\n`, 'utf8');
}

function rollbackSnapshotPath(root, targetPath) {
    const digest = crypto.createHash('sha256').update(path.resolve(targetPath)).digest('hex').slice(0, 16);
    return path.join(root, 'objects', digest, sanitizePathComponent(path.basename(targetPath) || 'root'));
}

async function removeIfExists(targetPath) {
    await fsp.rm(targetPath, { recursive: true, force: true }).catch(() => {});
}

async function createRollbackSnapshot(action, targets, args = {}, runtime = {}) {
    if (args.rollback === false || args.skipRollback === true || args.dryRun === true) {
        return null;
    }
    const rollbackRoot = getRollbackRoot(runtime);
    const maxBytes = normalizeNumber(args.rollbackMaxBytes, 100 * 1024 * 1024, 1024, 2 * 1024 * 1024 * 1024);
    const entry = {
        id: randomUUID(),
        action,
        createdAt: new Date().toISOString(),
        maxBytes,
        snapshots: []
    };
    for (const target of uniquePaths(targets)) {
        const stat = await safeStat(target);
        const snapshot = {
            path: target,
            existed: Boolean(stat),
            type: stat
                ? stat.isDirectory()
                    ? 'directory'
                    : stat.isFile()
                        ? 'file'
                        : stat.isSymbolicLink()
                            ? 'symlink'
                            : 'other'
                : 'missing',
            size: stat?.size ?? 0,
            snapshotPath: ''
        };
        if (stat && (stat.isFile() || stat.isDirectory()) && !stat.isSymbolicLink()) {
            const size = stat.isDirectory() ? (await directorySize(target, { maxDepth: 40 })).total : stat.size;
            snapshot.size = size;
            if (size <= maxBytes) {
                snapshot.snapshotPath = rollbackSnapshotPath(rollbackRoot, target);
                await removeIfExists(snapshot.snapshotPath);
                await copyRecursive(target, snapshot.snapshotPath);
            } else {
                snapshot.skipped = true;
                snapshot.reason = `snapshot_too_large:${formatBytes(size)}`;
            }
        } else if (stat) {
            snapshot.skipped = true;
            snapshot.reason = 'unsupported_file_type';
        }
        entry.snapshots.push(snapshot);
    }
    await appendJsonLine(rollbackJournalPath(runtime), entry);
    return entry;
}

async function readRollbackJournal(runtime = {}) {
    const journal = rollbackJournalPath(runtime);
    const text = await fsp.readFile(journal, 'utf8').catch(() => '');
    if (!text) {
        return [];
    }
    return text
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
            try {
                return JSON.parse(line);
            } catch (error) {
                return {
                    id: '',
                    parseError: error?.message || String(error),
                    raw: line
                };
            }
        })
        .filter((entry) => entry.id);
}

async function runExecFile(command, args = [], options = {}) {
    return await new Promise((resolve) => {
        execFile(command, args, { windowsHide: true, timeout: 15000, ...options }, (error, stdout, stderr) => {
            resolve({
                ok: !error,
                exitCode: error?.code ?? 0,
                stdout: normalizeString(stdout),
                stderr: normalizeString(stderr),
                error: error ? error.message || String(error) : ''
            });
        });
    });
}

async function actionList(args, context, runtime) {
    const target = resolveTargetPath(args.path || args.dir || '.', runtime);
    const guard = guardPath(target, 'list', context, runtime);
    if (guard) {
        return guard;
    }
    const entries = await fsp.readdir(target, { withFileTypes: true });
    const includeHidden = normalizeBoolean(args.includeHidden, true);
    const limit = normalizeNumber(args.limit, 200, 1, 2000);
    const rows = [];
    for (const entry of entries) {
        if (!includeHidden && entry.name.startsWith('.')) {
            continue;
        }
        const fullPath = path.join(target, entry.name);
        const stat = await safeStat(fullPath);
        rows.push({
            name: entry.name,
            path: fullPath,
            type: entry.isDirectory() ? 'directory' : entry.isFile() ? 'file' : entry.isSymbolicLink() ? 'symlink' : 'other',
            size: stat?.size ?? null,
            sizeText: stat ? formatBytes(stat.size) : 'unknown',
            modifiedAt: stat?.mtime ? stat.mtime.toISOString() : ''
        });
        if (rows.length >= limit) {
            break;
        }
    }
    rows.sort((a, b) => (a.type === b.type ? a.name.localeCompare(b.name) : a.type.localeCompare(b.type)));
    return createTextResult(JSON.stringify({ action: 'list', path: target, entries: rows }, null, 2), {
        status: 'completed',
        action: 'list',
        path: target,
        count: rows.length,
        entries: rows
    });
}

async function walkTree(root, args, runtime) {
    const maxDepth = normalizeNumber(args.maxDepth, 3, 0, 12);
    const limit = normalizeNumber(args.limit, DEFAULT_TREE_LIMIT, 1, 5000);
    const includeFiles = args.includeFiles !== false;
    const nodes = [];
    let visited = 0;

    async function visit(current, depth) {
        if (visited >= limit) {
            return;
        }
        const stat = await safeStat(current);
        if (!stat) {
            return;
        }
        visited += 1;
        const relativePath = path.relative(root, current) || '.';
        if (stat.isDirectory() || includeFiles) {
            nodes.push({
                path: current,
                relativePath,
                type: stat.isDirectory() ? 'directory' : stat.isFile() ? 'file' : 'other',
                size: stat.isFile() ? stat.size : null,
                sizeText: stat.isFile() ? formatBytes(stat.size) : ''
            });
        }
        if (!stat.isDirectory() || depth >= maxDepth || stat.isSymbolicLink()) {
            return;
        }
        const entries = await fsp.readdir(current);
        for (const entry of entries) {
            await visit(path.join(current, entry), depth + 1);
            if (visited >= limit) {
                break;
            }
        }
    }

    await visit(root, 0);
    return nodes;
}

async function actionTree(args, context, runtime) {
    const target = resolveTargetPath(args.path || args.dir || '.', runtime);
    const guard = guardPath(target, 'tree', context, runtime);
    if (guard) {
        return guard;
    }
    const nodes = await walkTree(target, args, runtime);
    return createTextResult(JSON.stringify({ action: 'tree', path: target, nodes }, null, 2), {
        status: 'completed',
        action: 'tree',
        path: target,
        count: nodes.length,
        nodes
    });
}

async function actionStat(args, context, runtime) {
    const target = resolveTargetPath(args.path, runtime);
    const guard = guardPath(target, 'stat', context, runtime);
    if (guard) {
        return guard;
    }
    const stat = await safeStat(target);
    if (!stat) {
        return createErrorResult('not_found', `路径不存在：${target}`, { path: target });
    }
    const details = statDetails(target, stat);
    return createTextResult(JSON.stringify(details, null, 2), {
        status: 'completed',
        action: 'stat',
        ...details
    });
}

async function actionRead(args, context, runtime) {
    const target = resolveTargetPath(args.path, runtime);
    const guard = guardPath(target, 'read', context, runtime);
    if (guard) {
        return guard;
    }
    const stat = await safeStat(target);
    if (!stat || !stat.isFile()) {
        return createErrorResult('not_found', `文件不存在：${target}`, { path: target });
    }
    const maxBytes = normalizeNumber(args.maxBytes, DEFAULT_MAX_BYTES, 1, 5 * 1024 * 1024);
    const handle = await fsp.open(target, 'r');
    try {
        const buffer = Buffer.alloc(Math.min(stat.size, maxBytes));
        const { bytesRead } = await handle.read(buffer, 0, buffer.length, 0);
        const text = buffer.subarray(0, bytesRead).toString(args.encoding || 'utf8');
        return createTextResult(text, {
            status: 'completed',
            action: 'read',
            path: target,
            bytesRead,
            truncated: stat.size > maxBytes,
            size: stat.size,
            sizeText: formatBytes(stat.size)
        });
    } finally {
        await handle.close();
    }
}

async function actionReadBinary(args, context, runtime) {
    const target = resolveTargetPath(args.path, runtime);
    const guard = guardPath(target, 'read_binary', context, runtime);
    if (guard) {
        return guard;
    }
    const stat = await safeStat(target);
    if (!stat || !stat.isFile()) {
        return createErrorResult('not_found', `文件不存在：${target}`, { path: target });
    }
    const offset = normalizeNumber(args.offset, 0, 0, Number.MAX_SAFE_INTEGER);
    const length = normalizeNumber(args.length || args.maxBytes, DEFAULT_BINARY_CHUNK_BYTES, 1, 8 * 1024 * 1024);
    const handle = await fsp.open(target, 'r');
    try {
        const buffer = Buffer.alloc(Math.min(length, Math.max(0, stat.size - offset)));
        const { bytesRead } = await handle.read(buffer, 0, buffer.length, offset);
        const nextOffset = offset + bytesRead;
        const details = {
            status: 'completed',
            action: 'read_binary',
            path: target,
            offset,
            bytesRead,
            nextOffset,
            eof: nextOffset >= stat.size,
            size: stat.size,
            sizeText: formatBytes(stat.size),
            encoding: 'base64',
            dataBase64: buffer.subarray(0, bytesRead).toString('base64')
        };
        return createTextResult(JSON.stringify(details, null, 2), details);
    } finally {
        await handle.close();
    }
}

function approvalRequired(action, args, context) {
    if (!WRITE_ACTIONS.has(action)) {
        return null;
    }
    if (args.dryRun === true) {
        return null;
    }
    if (context.approved === true || args.approved === true) {
        return null;
    }
    return createErrorResult('needs_approval', `${action} 会修改电脑状态，需要用户确认：context.approved=true。`, {
        action,
        approval: 'required'
    });
}

async function actionWrite(args, context, runtime, append = false) {
    const action = append ? 'append' : 'write';
    const target = resolveTargetPath(args.path, runtime);
    const guard = guardPath(target, action, context, runtime) || approvalRequired(action, args, context);
    if (guard) {
        return guard;
    }
    if (args.dryRun === true) {
        return createTextResult(JSON.stringify({ action, dryRun: true, path: target }, null, 2), {
            status: 'completed',
            action,
            dryRun: true,
            path: target
        });
    }
    await fsp.mkdir(path.dirname(target), { recursive: true });
    const content = typeof args.content === 'string' ? args.content : '';
    const rollback = await createRollbackSnapshot(action, [target], args, runtime);
    if (append) {
        await fsp.appendFile(target, content, args.encoding || 'utf8');
    } else {
        await fsp.writeFile(target, content, args.encoding || 'utf8');
    }
    return createTextResult(`${action} completed: ${target}`, {
        status: 'completed',
        action,
        path: target,
        bytes: Buffer.byteLength(content, args.encoding || 'utf8'),
        rollback
    });
}

async function actionWriteBinary(args, context, runtime) {
    const target = resolveTargetPath(args.path, runtime);
    const guard = guardPath(target, 'write_binary', context, runtime) || approvalRequired('write_binary', args, context);
    if (guard) {
        return guard;
    }
    const dataBase64 = normalizeString(args.dataBase64 || args.contentBase64 || args.base64);
    if (!dataBase64) {
        return createErrorResult('needs_config', 'write_binary 需要 dataBase64/contentBase64 参数。', { path: target });
    }
    let buffer = null;
    try {
        buffer = Buffer.from(dataBase64, 'base64');
    } catch {
        return createErrorResult('needs_config', 'write_binary 的 dataBase64 不是合法 base64。', { path: target });
    }
    if (args.dryRun === true) {
        return createTextResult(JSON.stringify({ action: 'write_binary', dryRun: true, path: target, bytes: buffer.length }, null, 2), {
            status: 'completed',
            action: 'write_binary',
            dryRun: true,
            path: target,
            bytes: buffer.length
        });
    }
    await fsp.mkdir(path.dirname(target), { recursive: true });
    const rollback = await createRollbackSnapshot('write_binary', [target], args, runtime);
    const mode = normalizeString(args.mode, args.append === true ? 'append' : 'overwrite').toLowerCase();
    if (mode === 'append') {
        await fsp.appendFile(target, buffer);
    } else if (Number.isFinite(Number(args.offset))) {
        const handle = await fsp.open(target, 'a+');
        try {
            await handle.write(buffer, 0, buffer.length, Number(args.offset));
        } finally {
            await handle.close();
        }
    } else {
        await fsp.writeFile(target, buffer);
    }
    return createTextResult(`write_binary completed: ${target}`, {
        status: 'completed',
        action: 'write_binary',
        path: target,
        bytes: buffer.length,
        rollback
    });
}

async function actionMkdir(args, context, runtime) {
    const target = resolveTargetPath(args.path || args.dir, runtime);
    const guard = guardPath(target, 'mkdir', context, runtime) || approvalRequired('mkdir', args, context);
    if (guard) {
        return guard;
    }
    if (args.dryRun === true) {
        return createTextResult(JSON.stringify({ action: 'mkdir', dryRun: true, path: target }, null, 2), {
            status: 'completed',
            action: 'mkdir',
            dryRun: true,
            path: target
        });
    }
    const rollback = await createRollbackSnapshot('mkdir', [target], args, runtime);
    await fsp.mkdir(target, { recursive: args.recursive !== false });
    return createTextResult(`mkdir completed: ${target}`, {
        status: 'completed',
        action: 'mkdir',
        path: target,
        rollback
    });
}

async function copyRecursive(source, target) {
    const stat = await fsp.lstat(source);
    if (stat.isDirectory()) {
        await fsp.mkdir(target, { recursive: true });
        const entries = await fsp.readdir(source);
        for (const entry of entries) {
            await copyRecursive(path.join(source, entry), path.join(target, entry));
        }
    } else {
        await fsp.mkdir(path.dirname(target), { recursive: true });
        await fsp.copyFile(source, target);
    }
}

async function actionCopyMove(args, context, runtime, move = false) {
    const action = move ? 'move' : 'copy';
    const source = resolveTargetPath(args.source || args.from || args.path, runtime);
    const target = resolveTargetPath(args.target || args.to || args.destination, runtime);
    const guard =
        guardPath(source, 'read', context, runtime) ||
        guardPath(target, action, context, runtime) ||
        approvalRequired(action, args, context);
    if (guard) {
        return guard;
    }
    if (args.dryRun === true) {
        return createTextResult(JSON.stringify({ action, dryRun: true, source, target }, null, 2), {
            status: 'completed',
            action,
            dryRun: true,
            source,
            target
        });
    }
    if (move) {
        const rollback = await createRollbackSnapshot(action, [source, target], args, runtime);
        await fsp.mkdir(path.dirname(target), { recursive: true });
        await fsp.rename(source, target);
        return createTextResult(`${action} completed: ${source} -> ${target}`, {
            status: 'completed',
            action,
            source,
            target,
            rollback
        });
    } else {
        const rollback = await createRollbackSnapshot(action, [target], args, runtime);
        await copyRecursive(source, target);
        return createTextResult(`${action} completed: ${source} -> ${target}`, {
            status: 'completed',
            action,
            source,
            target,
            rollback
        });
    }
}

async function uniquePath(targetPath) {
    try {
        await fsp.access(targetPath);
    } catch {
        return targetPath;
    }
    const dir = path.dirname(targetPath);
    const ext = path.extname(targetPath);
    const base = path.basename(targetPath, ext);
    for (let index = 1; index <= 9999; index += 1) {
        const candidate = path.join(dir, `${base} (${index})${ext}`);
        try {
            await fsp.access(candidate);
        } catch {
            return candidate;
        }
    }
    throw new Error(`无法创建唯一目标路径：${targetPath}`);
}

async function actionDelete(args, context, runtime) {
    const target = resolveTargetPath(args.path || args.target, runtime);
    const action = normalizeBoolean(args.trash, true) || args.action === 'trash' ? 'trash' : 'delete';
    const guard = guardPath(target, 'delete', context, runtime) || approvalRequired('delete', args, context);
    if (guard) {
        return guard;
    }
    if (args.dryRun === true) {
        return createTextResult(JSON.stringify({ action, dryRun: true, path: target }, null, 2), {
            status: 'completed',
            action,
            dryRun: true,
            path: target
        });
    }
    if (action === 'trash') {
        const quarantineRoot = resolveTargetPath(
            args.trashDir || path.join(runtime.workspaceRoot || runtime.workspaceDir || process.cwd(), 'tmp', 'humanclaw-computer-trash'),
            runtime
        );
        const trashGuard = guardPath(quarantineRoot, 'mkdir', context, runtime);
        if (trashGuard) {
            return trashGuard;
        }
        const destination = await uniquePath(path.join(quarantineRoot, path.basename(target)));
        const rollback = await createRollbackSnapshot('trash', [target, destination], args, runtime);
        await fsp.mkdir(path.dirname(destination), { recursive: true });
        await fsp.rename(target, destination);
        return createTextResult(`moved to trash: ${destination}`, {
            status: 'completed',
            action: 'trash',
            path: target,
            destination,
            rollback
        });
    }
    if (!(args.allowPermanentDelete === true && args.dangerous === true)) {
        return createErrorResult('blocked', '永久删除需要 allowPermanentDelete=true 和 dangerous=true。默认请使用 trash/quarantine。', {
            path: target
        });
    }
    const rollback = await createRollbackSnapshot('delete', [target], args, runtime);
    await fsp.rm(target, { recursive: args.recursive === true, force: args.force === true });
    return createTextResult(`deleted: ${target}`, {
        status: 'completed',
        action: 'delete',
        path: target,
        rollback
    });
}

async function actionSearch(args, context, runtime) {
    const root = resolveTargetPath(args.path || args.dir || '.', runtime);
    const guard = guardPath(root, 'search', context, runtime);
    if (guard) {
        return guard;
    }
    const namePattern = normalizeString(args.name || args.glob || args.pattern);
    const contains = normalizeString(args.contains || args.text);
    const limit = normalizeNumber(args.limit, DEFAULT_SEARCH_LIMIT, 1, 5000);
    const maxDepth = normalizeNumber(args.maxDepth, 6, 0, 20);
    const results = [];
    const errors = [];
    const nameRegex = namePattern
        ? new RegExp(namePattern.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*'), 'i')
        : null;

    async function visit(current, depth) {
        if (results.length >= limit) {
            return;
        }
        const stat = await safeStat(current);
        if (!stat || stat.isSymbolicLink()) {
            return;
        }
        const base = path.basename(current);
        let matched = !nameRegex || nameRegex.test(base);
        if (matched && contains && stat.isFile()) {
            try {
                const sample = await fsp.readFile(current, 'utf8');
                matched = sample.includes(contains);
            } catch {
                matched = false;
            }
        } else if (contains && stat.isDirectory()) {
            matched = false;
        }
        if (matched) {
            results.push({
                path: current,
                relativePath: path.relative(root, current) || '.',
                type: stat.isDirectory() ? 'directory' : stat.isFile() ? 'file' : 'other',
                size: stat.isFile() ? stat.size : null,
                sizeText: stat.isFile() ? formatBytes(stat.size) : ''
            });
        }
        if (stat.isDirectory() && depth < maxDepth) {
            let entries = [];
            try {
                entries = await fsp.readdir(current);
            } catch (error) {
                errors.push({ path: current, error: error.message || String(error) });
                return;
            }
            for (const entry of entries) {
                await visit(path.join(current, entry), depth + 1);
                if (results.length >= limit) {
                    break;
                }
            }
        }
    }

    await visit(root, 0);
    return createTextResult(JSON.stringify({ action: 'search', root, results, errors }, null, 2), {
        status: 'completed',
        action: 'search',
        root,
        count: results.length,
        results,
        errors
    });
}

async function actionHash(args, context, runtime) {
    const target = resolveTargetPath(args.path, runtime);
    const guard = guardPath(target, 'hash', context, runtime);
    if (guard) {
        return guard;
    }
    const algorithm = normalizeString(args.algorithm, 'sha256');
    const hash = crypto.createHash(algorithm);
    await new Promise((resolve, reject) => {
        const stream = fs.createReadStream(target);
        stream.on('data', (chunk) => hash.update(chunk));
        stream.on('error', reject);
        stream.on('end', resolve);
    });
    const digest = hash.digest('hex');
    return createTextResult(digest, {
        status: 'completed',
        action: 'hash',
        path: target,
        algorithm,
        digest
    });
}

async function directorySize(target, args) {
    const maxDepth = normalizeNumber(args.maxDepth, 8, 0, 30);
    let total = 0;
    let files = 0;
    let dirs = 0;
    async function visit(current, depth) {
        const stat = await safeStat(current);
        if (!stat || stat.isSymbolicLink()) {
            return;
        }
        if (stat.isFile()) {
            total += stat.size;
            files += 1;
            return;
        }
        if (stat.isDirectory()) {
            dirs += 1;
            if (depth >= maxDepth) {
                return;
            }
            const entries = await fsp.readdir(current).catch(() => []);
            for (const entry of entries) {
                await visit(path.join(current, entry), depth + 1);
            }
        }
    }
    await visit(target, 0);
    return { total, files, dirs };
}

async function actionDu(args, context, runtime) {
    const target = resolveTargetPath(args.path || args.dir || '.', runtime);
    const guard = guardPath(target, 'du', context, runtime);
    if (guard) {
        return guard;
    }
    const result = await directorySize(target, args);
    return createTextResult(JSON.stringify({ action: 'du', path: target, ...result, sizeText: formatBytes(result.total) }, null, 2), {
        status: 'completed',
        action: 'du',
        path: target,
        size: result.total,
        sizeText: formatBytes(result.total),
        files: result.files,
        dirs: result.dirs
    });
}

async function actionAclGet(args, context, runtime) {
    const target = resolveTargetPath(args.path, runtime);
    const guard = guardPath(target, 'acl_get', context, runtime);
    if (guard) {
        return guard;
    }
    const stat = await safeStat(target);
    if (!stat) {
        return createErrorResult('not_found', `路径不存在：${target}`, { path: target });
    }
    const result = process.platform === 'win32'
        ? await runExecFile('icacls.exe', [target])
        : await runExecFile('ls', ['-ld', target]);
    if (!result.ok) {
        return createErrorResult('error', result.stderr || result.error || '读取 ACL 失败。', {
            action: 'acl_get',
            path: target,
            exitCode: result.exitCode
        });
    }
    return createTextResult(result.stdout, {
        status: 'completed',
        action: 'acl_get',
        path: target,
        platform: process.platform,
        stdout: result.stdout
    });
}

async function actionAclSet(args, context, runtime) {
    const target = resolveTargetPath(args.path, runtime);
    const guard = guardPath(target, 'acl_set', context, runtime) || approvalRequired('acl_set', args, context);
    if (guard) {
        return guard;
    }
    if (process.platform !== 'win32') {
        return createErrorResult('not_supported', 'acl_set 当前只实现了 Windows icacls 安全封装。', {
            action: 'acl_set',
            platform: process.platform
        });
    }
    const icaclsArgs = Array.isArray(args.icaclsArgs)
        ? args.icaclsArgs.map((entry) => normalizeString(entry)).filter(Boolean)
        : [];
    if (!icaclsArgs.length) {
        return createErrorResult('needs_config', 'acl_set 需要 icaclsArgs，例如 ["/grant", "User:(R)"]。', {
            action: 'acl_set',
            path: target
        });
    }
    if (args.dryRun === true) {
        return createTextResult(JSON.stringify({ action: 'acl_set', dryRun: true, path: target, icaclsArgs }, null, 2), {
            status: 'completed',
            action: 'acl_set',
            dryRun: true,
            path: target,
            icaclsArgs
        });
    }
    const before = await actionAclGet({ path: target }, context, runtime);
    const rollback = await createRollbackSnapshot('acl_set', [target], args, runtime);
    const result = await runExecFile('icacls.exe', [target, ...icaclsArgs]);
    if (!result.ok) {
        return createErrorResult('error', result.stderr || result.error || '设置 ACL 失败。', {
            action: 'acl_set',
            path: target,
            exitCode: result.exitCode,
            before: before.details?.stdout || '',
            rollback
        });
    }
    return createTextResult(result.stdout, {
        status: 'completed',
        action: 'acl_set',
        path: target,
        stdout: result.stdout,
        before: before.details?.stdout || '',
        rollback
    });
}

async function actionRollbackList(args, context, runtime) {
    const guard = guardPath(getRollbackRoot(runtime), 'rollback_list', context, runtime);
    if (guard) {
        return guard;
    }
    const limit = normalizeNumber(args.limit, DEFAULT_ROLLBACK_LIMIT, 1, 1000);
    const entries = (await readRollbackJournal(runtime)).slice(-limit).reverse();
    return createTextResult(JSON.stringify({ action: 'rollback_list', count: entries.length, entries }, null, 2), {
        status: 'completed',
        action: 'rollback_list',
        count: entries.length,
        entries
    });
}

async function actionRollbackRestore(args, context, runtime) {
    const id = normalizeString(args.id || args.rollbackId);
    if (!id) {
        return createErrorResult('needs_config', 'rollback_restore 需要 id/rollbackId 参数。');
    }
    const approval = approvalRequired('rollback_restore', args, context);
    if (approval) {
        return approval;
    }
    const entries = await readRollbackJournal(runtime);
    const entry = entries.find((candidate) => candidate.id === id);
    if (!entry) {
        return createErrorResult('not_found', `没有找到 rollback：${id}`, { id });
    }
    const restored = [];
    for (const snapshot of entry.snapshots || []) {
        const target = resolveTargetPath(snapshot.path, runtime);
        const guard = guardPath(target, 'write', context, runtime);
        if (guard) {
            return guard;
        }
        if (args.dryRun === true) {
            restored.push({ path: target, dryRun: true, existed: snapshot.existed });
            continue;
        }
        if (!snapshot.existed) {
            await removeIfExists(target);
            restored.push({ path: target, restored: 'removed_new_path' });
            continue;
        }
        if (!snapshot.snapshotPath || snapshot.skipped) {
            restored.push({ path: target, skipped: true, reason: snapshot.reason || 'snapshot_missing' });
            continue;
        }
        await removeIfExists(target);
        await copyRecursive(snapshot.snapshotPath, target);
        restored.push({ path: target, restored: true, type: snapshot.type });
    }
    return createTextResult(JSON.stringify({ action: 'rollback_restore', id, restored }, null, 2), {
        status: 'completed',
        action: 'rollback_restore',
        id,
        restored
    });
}

function commandNeedsApproval(args, context) {
    if (context.approved === true || args.approved === true) {
        return null;
    }
    if (args.dryRun === true) {
        return null;
    }
    return createErrorResult('needs_approval', '命令行执行需要用户确认：context.approved=true。', {
        action: args.action || 'exec',
        command: args.command,
        approval: 'required'
    });
}

function resolveWorkdir(args, context, runtime) {
    return resolveTargetPath(args.workdir || args.cwd || runtime.workspaceDir || runtime.workspaceRoot || '.', runtime);
}

function appendBounded(buffer, chunk, maxBytes = DEFAULT_PROCESS_BUFFER_BYTES) {
    const text = Buffer.isBuffer(chunk) ? chunk.toString('utf8') : String(chunk);
    const merged = buffer + text;
    if (Buffer.byteLength(merged, 'utf8') <= maxBytes) {
        return merged;
    }
    return merged.slice(Math.max(0, merged.length - maxBytes));
}

class ComputerRuntime {
    constructor(options = {}) {
        this.sessions = new Map();
        this.ptySessions = new Map();
        this.watchers = new Map();
        this.workspaceRoot = options.workspaceRoot || process.cwd();
    }

    createWatchRecord(target, args = {}) {
        const id = randomUUID();
        const recursive = normalizeBoolean(args.recursive, false);
        const maxEvents = normalizeNumber(args.maxEvents, DEFAULT_WATCH_BUFFER_EVENTS, 10, 5000);
        const record = {
            id,
            path: target,
            recursive,
            maxEvents,
            startedAt: Date.now(),
            updatedAt: Date.now(),
            status: 'running',
            events: [],
            watcher: null,
            error: ''
        };
        const pushEvent = (event) => {
            record.events.push({
                seq: record.events.length + 1,
                at: new Date().toISOString(),
                ...event
            });
            if (record.events.length > record.maxEvents) {
                record.events.splice(0, record.events.length - record.maxEvents);
            }
            record.updatedAt = Date.now();
        };
        try {
            record.watcher = fs.watch(target, { recursive }, (eventType, filename) => {
                pushEvent({
                    eventType,
                    filename: filename ? String(filename) : '',
                    path: filename ? path.join(target, String(filename)) : target
                });
            });
            record.watcher.on('error', (error) => {
                record.status = 'error';
                record.error = error?.message || String(error);
                pushEvent({ eventType: 'error', error: record.error, path: target });
            });
        } catch (error) {
            record.status = 'error';
            record.error = error?.message || String(error);
        }
        this.watchers.set(id, record);
        return record;
    }

    publicWatch(record, includeEvents = true) {
        return {
            id: record.id,
            path: record.path,
            recursive: record.recursive,
            status: record.status,
            startedAt: new Date(record.startedAt).toISOString(),
            updatedAt: new Date(record.updatedAt).toISOString(),
            error: record.error,
            ...(includeEvents ? { events: [...record.events] } : { eventCount: record.events.length })
        };
    }

    watchStart(args, context, runtime) {
        const target = resolveTargetPath(args.path || args.dir || '.', runtime);
        const guard = guardPath(target, 'watch_start', context, runtime);
        if (guard) {
            return guard;
        }
        const record = this.createWatchRecord(target, args);
        if (record.status === 'error') {
            return createErrorResult('error', record.error || '文件监听启动失败。', {
                action: 'watch_start',
                watcher: this.publicWatch(record, false)
            });
        }
        return createTextResult(JSON.stringify(this.publicWatch(record), null, 2), {
            status: 'completed',
            action: 'watch_start',
            watcher: this.publicWatch(record)
        });
    }

    watchList() {
        const watchers = [...this.watchers.values()].map((record) => this.publicWatch(record, false));
        return createTextResult(JSON.stringify({ action: 'watch_list', watchers }, null, 2), {
            status: 'completed',
            action: 'watch_list',
            watchers
        });
    }

    watchPoll(args) {
        const id = normalizeString(args.watchId || args.id);
        const record = this.watchers.get(id);
        if (!record) {
            return createErrorResult('not_found', `没有找到文件监听：${id}`, { watchId: id });
        }
        const sinceSeq = normalizeNumber(args.sinceSeq || args.afterSeq, 0, 0, Number.MAX_SAFE_INTEGER);
        const events = record.events.filter((event) => Number(event.seq || 0) > sinceSeq);
        if (args.clear === true) {
            record.events = [];
        }
        return createTextResult(JSON.stringify({ action: 'watch_poll', watcher: this.publicWatch(record, false), events }, null, 2), {
            status: 'completed',
            action: 'watch_poll',
            watcher: this.publicWatch(record, false),
            events
        });
    }

    watchStop(args, context) {
        const id = normalizeString(args.watchId || args.id);
        const record = this.watchers.get(id);
        if (!record) {
            return createErrorResult('not_found', `没有找到文件监听：${id}`, { watchId: id });
        }
        const approval = approvalRequired('watch_stop', args, context);
        if (approval) {
            return approval;
        }
        record.watcher?.close();
        record.status = 'stopped';
        record.updatedAt = Date.now();
        this.watchers.delete(id);
        return createTextResult(`watch stopped: ${id}`, {
            status: 'completed',
            action: 'watch_stop',
            watchId: id
        });
    }

    createSessionRecord({ command, workdir, child, timeoutMs }) {
        const id = randomUUID();
        const record = {
            id,
            command,
            workdir,
            pid: child.pid,
            startedAt: Date.now(),
            updatedAt: Date.now(),
            status: 'running',
            exitCode: null,
            signal: null,
            stdout: '',
            stderr: '',
            child,
            timeout: null
        };
        child.stdout?.on('data', (chunk) => {
            record.stdout = appendBounded(record.stdout, chunk);
            record.updatedAt = Date.now();
        });
        child.stderr?.on('data', (chunk) => {
            record.stderr = appendBounded(record.stderr, chunk);
            record.updatedAt = Date.now();
        });
        child.on('exit', (code, signal) => {
            record.status = 'exited';
            record.exitCode = code;
            record.signal = signal;
            record.updatedAt = Date.now();
            if (record.timeout) {
                clearTimeout(record.timeout);
                record.timeout = null;
            }
        });
        child.on('error', (error) => {
            record.status = 'error';
            record.stderr = appendBounded(record.stderr, `\n${error.message || error}`);
            record.updatedAt = Date.now();
        });
        record.timeout = setTimeout(() => {
            if (record.status === 'running') {
                record.status = 'timeout';
                child.kill('SIGTERM');
            }
        }, timeoutMs);
        this.sessions.set(id, record);
        return record;
    }

    publicPty(record, includeOutput = true) {
        return {
            id: record.id,
            command: record.command,
            executable: record.executable,
            args: record.args,
            workdir: record.workdir,
            pid: record.pid,
            status: record.status,
            exitCode: record.exitCode,
            signal: record.signal,
            cols: record.cols,
            rows: record.rows,
            startedAt: new Date(record.startedAt).toISOString(),
            updatedAt: new Date(record.updatedAt).toISOString(),
            ...(includeOutput ? { output: record.output } : { outputBytes: Buffer.byteLength(record.output || '', 'utf8') })
        };
    }

    async ptyStart(args, context, runtime) {
        const ptyLoad = loadNodePty();
        if (!ptyLoad.ok) {
            return createErrorResult('not_available', 'PTY 需要 node-pty 原生模块可用；当前依赖未构建或加载失败。', {
                action: 'pty_start',
                package: 'node-pty',
                error: ptyLoad.error,
                fallback: '可先使用 computer.session_start/process_read/process_write；若要启用 PTY，需要本机允许 node-pty 构建。'
            });
        }
        const command = normalizeString(args.command || args.cmd);
        const workdir = resolveWorkdir(args, context, runtime);
        const guard = guardPath(workdir, 'read', context, runtime) || commandNeedsApproval({ ...args, action: 'pty_start' }, context);
        if (guard) {
            return guard;
        }
        if (args.dryRun === true) {
            return createTextResult(JSON.stringify({ action: 'pty_start', dryRun: true, command, workdir }, null, 2), {
                status: 'completed',
                action: 'pty_start',
                dryRun: true,
                command,
                workdir
            });
        }
        const executable = normalizeString(
            args.executable || args.shell,
            process.platform === 'win32' ? process.env.ComSpec || 'cmd.exe' : process.env.SHELL || 'bash'
        );
        const ptyArgs = Array.isArray(args.args)
            ? args.args.map((entry) => String(entry))
            : command
                ? process.platform === 'win32'
                    ? ['/d', '/s', '/c', command]
                    : ['-lc', command]
                : [];
        const cols = normalizeNumber(args.cols, 100, 20, 400);
        const rows = normalizeNumber(args.rows, 30, 5, 200);
        const terminal = ptyLoad.pty.spawn(executable, ptyArgs, {
            name: normalizeString(args.term, 'xterm-256color'),
            cols,
            rows,
            cwd: workdir,
            ...(process.platform === 'win32'
                ? {
                      useConpty: args.useConpty === undefined ? true : normalizeBoolean(args.useConpty, true),
                      useConptyDll: normalizeBoolean(args.useConptyDll, false)
                  }
                : {}),
            env: {
                ...process.env,
                ...(args.env && typeof args.env === 'object' ? args.env : {})
            }
        });
        const record = {
            id: randomUUID(),
            command,
            executable,
            args: ptyArgs,
            workdir,
            pid: terminal.pid,
            status: 'running',
            exitCode: null,
            signal: null,
            output: '',
            terminal,
            cols,
            rows,
            startedAt: Date.now(),
            updatedAt: Date.now()
        };
        terminal.onData((chunk) => {
            record.output = appendBounded(record.output, chunk, normalizeNumber(args.maxOutputBytes, DEFAULT_PROCESS_BUFFER_BYTES, 1024, 5 * 1024 * 1024));
            record.updatedAt = Date.now();
        });
        terminal.onExit(({ exitCode, signal }) => {
            record.status = 'exited';
            record.exitCode = exitCode;
            record.signal = signal;
            record.updatedAt = Date.now();
        });
        this.ptySessions.set(record.id, record);
        return createTextResult(JSON.stringify(this.publicPty(record), null, 2), {
            status: 'completed',
            action: 'pty_start',
            session: this.publicPty(record)
        });
    }

    ptyRead(args) {
        const id = normalizeString(args.sessionId || args.ptyId || args.id);
        const record = this.ptySessions.get(id);
        if (!record) {
            return createErrorResult('not_found', `没有找到 PTY 会话：${id}`, { sessionId: id });
        }
        const session = this.publicPty(record);
        if (args.clear === true) {
            record.output = '';
        }
        return createTextResult(JSON.stringify(session, null, 2), {
            status: 'completed',
            action: 'pty_read',
            session
        });
    }

    ptyStatus() {
        const sessions = [...this.ptySessions.values()].map((record) => this.publicPty(record, false));
        const ptyLoad = loadNodePty();
        return createTextResult(JSON.stringify({ action: 'pty_status', available: ptyLoad.ok, sessions }, null, 2), {
            status: 'completed',
            action: 'pty_status',
            available: ptyLoad.ok,
            error: ptyLoad.ok ? '' : ptyLoad.error,
            sessions
        });
    }

    ptyWrite(args, context) {
        const id = normalizeString(args.sessionId || args.ptyId || args.id);
        const input = typeof args.input === 'string' ? args.input : '';
        const record = this.ptySessions.get(id);
        if (!record) {
            return createErrorResult('not_found', `没有找到 PTY 会话：${id}`, { sessionId: id });
        }
        const approval = approvalRequired('pty_write', args, context);
        if (approval) {
            return approval;
        }
        if (record.status !== 'running') {
            return createErrorResult('error', `PTY 会话不是 running：${record.status}`, { sessionId: id, status: record.status });
        }
        record.terminal.write(input);
        if (args.submit === true || args.enter === true) {
            record.terminal.write(os.EOL);
        }
        record.updatedAt = Date.now();
        return createTextResult('pty input written', {
            status: 'completed',
            action: 'pty_write',
            sessionId: id,
            bytes: Buffer.byteLength(input)
        });
    }

    ptyResize(args) {
        const id = normalizeString(args.sessionId || args.ptyId || args.id);
        const record = this.ptySessions.get(id);
        if (!record) {
            return createErrorResult('not_found', `没有找到 PTY 会话：${id}`, { sessionId: id });
        }
        const cols = normalizeNumber(args.cols, record.cols, 20, 400);
        const rows = normalizeNumber(args.rows, record.rows, 5, 200);
        record.terminal.resize(cols, rows);
        record.cols = cols;
        record.rows = rows;
        record.updatedAt = Date.now();
        return createTextResult(`pty resized: ${id}`, {
            status: 'completed',
            action: 'pty_resize',
            sessionId: id,
            cols,
            rows
        });
    }

    ptyKill(args, context) {
        const id = normalizeString(args.sessionId || args.ptyId || args.id);
        const record = this.ptySessions.get(id);
        if (!record) {
            return createErrorResult('not_found', `没有找到 PTY 会话：${id}`, { sessionId: id });
        }
        const approval = approvalRequired('pty_kill', args, context);
        if (approval) {
            return approval;
        }
        try {
            record.terminal.kill();
        } catch {}
        record.status = record.status === 'running' ? 'killed' : record.status;
        record.updatedAt = Date.now();
        return createTextResult(`pty killed: ${id}`, {
            status: 'completed',
            action: 'pty_kill',
            sessionId: id
        });
    }

    listSessions() {
        return [...this.sessions.values()].map((record) => this.publicSession(record, false));
    }

    publicSession(record, includeOutput = true) {
        return {
            id: record.id,
            command: record.command,
            workdir: record.workdir,
            pid: record.pid,
            status: record.status,
            exitCode: record.exitCode,
            signal: record.signal,
            startedAt: new Date(record.startedAt).toISOString(),
            updatedAt: new Date(record.updatedAt).toISOString(),
            ...(includeOutput
                ? {
                      stdout: record.stdout,
                      stderr: record.stderr
                  }
                : {})
        };
    }

    async exec(args, context, runtime) {
        const command = normalizeString(args.command || args.cmd);
        if (!command) {
            return createErrorResult('needs_config', 'exec 需要 command 参数。');
        }
        const workdir = resolveWorkdir(args, context, runtime);
        const guard = guardPath(workdir, 'read', context, runtime) || commandNeedsApproval({ ...args, action: 'exec' }, context);
        if (guard) {
            return guard;
        }
        if (args.dryRun === true) {
            return createTextResult(JSON.stringify({ action: 'exec', dryRun: true, command, workdir }, null, 2), {
                status: 'completed',
                action: 'exec',
                dryRun: true,
                command,
                workdir
            });
        }
        const timeoutMs = normalizeNumber(args.timeoutMs || args.timeout, DEFAULT_EXEC_TIMEOUT_MS, 1000, 10 * 60 * 1000);
        const startedAt = Date.now();
        return await new Promise((resolve) => {
            const child = spawn(command, {
                cwd: workdir,
                shell: true,
                windowsHide: true,
                env: {
                    ...process.env,
                    ...(args.env && typeof args.env === 'object' ? args.env : {})
                }
            });
            let stdout = '';
            let stderr = '';
            const timer = setTimeout(() => {
                child.kill('SIGTERM');
                resolve(createErrorResult('timeout', `命令超时：${command}`, {
                    action: 'exec',
                    command,
                    workdir,
                    stdout,
                    stderr,
                    durationMs: Date.now() - startedAt
                }));
            }, timeoutMs);
            child.stdout?.on('data', (chunk) => {
                stdout = appendBounded(stdout, chunk, normalizeNumber(args.maxOutputBytes, DEFAULT_PROCESS_BUFFER_BYTES, 1024, 5 * 1024 * 1024));
            });
            child.stderr?.on('data', (chunk) => {
                stderr = appendBounded(stderr, chunk, normalizeNumber(args.maxOutputBytes, DEFAULT_PROCESS_BUFFER_BYTES, 1024, 5 * 1024 * 1024));
            });
            child.on('error', (error) => {
                clearTimeout(timer);
                resolve(createErrorResult('error', error.message || String(error), {
                    action: 'exec',
                    command,
                    workdir
                }));
            });
            child.on('exit', (exitCode, signal) => {
                clearTimeout(timer);
                const details = {
                    status: exitCode === 0 ? 'completed' : 'error',
                    action: 'exec',
                    command,
                    workdir,
                    exitCode,
                    signal,
                    stdout,
                    stderr,
                    durationMs: Date.now() - startedAt
                };
                resolve({
                    content: [{ type: 'text', text: stdout || stderr || `exitCode=${exitCode}` }],
                    isError: exitCode !== 0,
                    details
                });
            });
        });
    }

    async sessionStart(args, context, runtime) {
        const command = normalizeString(args.command || args.cmd);
        if (!command) {
            return createErrorResult('needs_config', 'session_start 需要 command 参数。');
        }
        const workdir = resolveWorkdir(args, context, runtime);
        const guard = guardPath(workdir, 'read', context, runtime) || commandNeedsApproval({ ...args, action: 'session_start' }, context);
        if (guard) {
            return guard;
        }
        if (args.dryRun === true) {
            return createTextResult(JSON.stringify({ action: 'session_start', dryRun: true, command, workdir }, null, 2), {
                status: 'completed',
                action: 'session_start',
                dryRun: true,
                command,
                workdir
            });
        }
        const timeoutMs = normalizeNumber(args.timeoutMs || args.timeout, DEFAULT_SESSION_TIMEOUT_MS, 1000, 24 * 60 * 60 * 1000);
        const child = spawn(command, {
            cwd: workdir,
            shell: true,
            windowsHide: true,
            env: {
                ...process.env,
                ...(args.env && typeof args.env === 'object' ? args.env : {})
            }
        });
        const record = this.createSessionRecord({ command, workdir, child, timeoutMs });
        return createTextResult(JSON.stringify(this.publicSession(record), null, 2), {
            status: 'completed',
            action: 'session_start',
            session: this.publicSession(record)
        });
    }

    processRead(args) {
        const id = normalizeString(args.sessionId || args.id);
        const record = this.sessions.get(id);
        if (!record) {
            return createErrorResult('not_found', `没有找到进程会话：${id}`, { sessionId: id });
        }
        return createTextResult(JSON.stringify(this.publicSession(record), null, 2), {
            status: 'completed',
            action: 'process_read',
            session: this.publicSession(record)
        });
    }

    processWrite(args, context) {
        const id = normalizeString(args.sessionId || args.id);
        const input = typeof args.input === 'string' ? args.input : '';
        const record = this.sessions.get(id);
        if (!record) {
            return createErrorResult('not_found', `没有找到进程会话：${id}`, { sessionId: id });
        }
        const approval = approvalRequired('process_write', args, context);
        if (approval) {
            return approval;
        }
        if (record.status !== 'running') {
            return createErrorResult('error', `进程会话不是 running：${record.status}`, { sessionId: id, status: record.status });
        }
        record.child.stdin?.write(input);
        if (args.submit === true || args.enter === true) {
            record.child.stdin?.write(os.EOL);
        }
        return createTextResult('input written', {
            status: 'completed',
            action: 'process_write',
            sessionId: id,
            bytes: Buffer.byteLength(input)
        });
    }

    processKill(args, context) {
        const id = normalizeString(args.sessionId || args.id);
        const record = this.sessions.get(id);
        if (!record) {
            return createErrorResult('not_found', `没有找到进程会话：${id}`, { sessionId: id });
        }
        const approval = approvalRequired('process_kill', args, context);
        if (approval) {
            return approval;
        }
        const signal = normalizeString(args.signal, 'SIGTERM');
        record.child.kill(signal);
        record.status = record.status === 'running' ? 'killed' : record.status;
        record.updatedAt = Date.now();
        return createTextResult(`killed ${id}`, {
            status: 'completed',
            action: 'process_kill',
            sessionId: id,
            signal
        });
    }

    async shutdown() {
        for (const record of this.watchers.values()) {
            try {
                record.watcher?.close();
            } catch {}
            record.status = 'stopped';
        }
        this.watchers.clear();
        for (const record of this.ptySessions.values()) {
            if (record.status === 'running') {
                try {
                    record.terminal.kill();
                } catch {}
            }
        }
        this.ptySessions.clear();
        for (const record of this.sessions.values()) {
            if (record.status === 'running') {
                try {
                    record.child.kill('SIGTERM');
                } catch {}
            }
            if (record.timeout) {
                clearTimeout(record.timeout);
                record.timeout = null;
            }
        }
    }
}

function schemaResult(runtime) {
    const schema = {
        tool: COMPUTER_TOOL_ID,
        actions: [
            'schema',
            'list',
            'tree',
            'stat',
            'read',
            'read_binary',
            'write',
            'write_binary',
            'append',
            'mkdir',
            'copy',
            'move',
            'delete',
            'search',
            'hash',
            'du',
            'acl_get',
            'acl_set',
            'watch_start',
            'watch_poll',
            'watch_list',
            'watch_stop',
            'exec',
            'session_start',
            'pty_status',
            'pty_start',
            'pty_read',
            'pty_write',
            'pty_resize',
            'pty_kill',
            'process_list',
            'process_read',
            'process_write',
            'process_kill',
            'rollback_list',
            'rollback_restore'
        ],
        safety: {
            readDefaultRoots: commonUserRoots(runtime),
            protectedRoots: protectedRoots(),
            mutationsRequireApproval: true,
            outsideWorkspaceRequires: 'context.allowOutsideWorkspace=true',
            protectedMutationRequires: 'context.allowSystemMutation=true plus approval',
            deleteDefault: 'trash/quarantine; permanent delete requires allowPermanentDelete=true and dangerous=true',
            rollbackJournal: rollbackJournalPath(runtime),
            ptyOptional: loadNodePty().ok
        }
    };
    return createTextResult(JSON.stringify(schema, null, 2), {
        status: 'completed',
        action: 'schema',
        schema
    });
}

class HumanClawComputerTool {
    constructor(options = {}) {
        this.runtime = new ComputerRuntime(options);
    }

    async shutdown() {
        await this.runtime.shutdown();
    }

    async execute(args = {}, context = {}, runtime = {}) {
        const action = normalizeString(args.action || args.operation || args.intent, 'schema').toLowerCase();
        if (action === 'schema' || action === 'help') {
            return schemaResult(runtime);
        }
        if (action === 'ls' || action === 'list') {
            return await actionList(args, context, runtime);
        }
        if (action === 'tree') {
            return await actionTree(args, context, runtime);
        }
        if (action === 'stat') {
            return await actionStat(args, context, runtime);
        }
        if (action === 'read' || action === 'cat') {
            return await actionRead(args, context, runtime);
        }
        if (action === 'read_binary') {
            return await actionReadBinary(args, context, runtime);
        }
        if (action === 'write') {
            return await actionWrite(args, context, runtime, false);
        }
        if (action === 'write_binary') {
            return await actionWriteBinary(args, context, runtime);
        }
        if (action === 'append') {
            return await actionWrite(args, context, runtime, true);
        }
        if (action === 'mkdir') {
            return await actionMkdir(args, context, runtime);
        }
        if (action === 'copy' || action === 'cp') {
            return await actionCopyMove(args, context, runtime, false);
        }
        if (action === 'move' || action === 'rename' || action === 'mv') {
            return await actionCopyMove(args, context, runtime, true);
        }
        if (action === 'delete' || action === 'rm' || action === 'trash') {
            return await actionDelete(args, context, runtime);
        }
        if (action === 'search' || action === 'find') {
            return await actionSearch(args, context, runtime);
        }
        if (action === 'hash' || action === 'checksum') {
            return await actionHash(args, context, runtime);
        }
        if (action === 'du' || action === 'disk_usage') {
            return await actionDu(args, context, runtime);
        }
        if (action === 'acl_get') {
            return await actionAclGet(args, context, runtime);
        }
        if (action === 'acl_set') {
            return await actionAclSet(args, context, runtime);
        }
        if (action === 'watch_start') {
            return this.runtime.watchStart(args, context, runtime);
        }
        if (action === 'watch_list') {
            return this.runtime.watchList();
        }
        if (action === 'watch_poll') {
            return this.runtime.watchPoll(args);
        }
        if (action === 'watch_stop') {
            return this.runtime.watchStop(args, context);
        }
        if (action === 'rollback_list') {
            return await actionRollbackList(args, context, runtime);
        }
        if (action === 'rollback_restore') {
            return await actionRollbackRestore(args, context, runtime);
        }
        if (action === 'exec' || action === 'run') {
            return await this.runtime.exec({ ...args, action }, context, runtime);
        }
        if (action === 'session_start' || action === 'spawn') {
            return await this.runtime.sessionStart({ ...args, action }, context, runtime);
        }
        if (action === 'pty_status') {
            return this.runtime.ptyStatus();
        }
        if (action === 'pty_start') {
            return await this.runtime.ptyStart({ ...args, action }, context, runtime);
        }
        if (action === 'pty_read') {
            return this.runtime.ptyRead(args);
        }
        if (action === 'pty_write') {
            return this.runtime.ptyWrite(args, context);
        }
        if (action === 'pty_resize') {
            return this.runtime.ptyResize(args);
        }
        if (action === 'pty_kill') {
            return this.runtime.ptyKill(args, context);
        }
        if (action === 'process_list') {
            const sessions = this.runtime.listSessions();
            return createTextResult(JSON.stringify({ action, sessions }, null, 2), {
                status: 'completed',
                action,
                sessions
            });
        }
        if (action === 'process_read' || action === 'process_poll' || action === 'process_log') {
            return this.runtime.processRead(args);
        }
        if (action === 'process_write' || action === 'process_input') {
            return this.runtime.processWrite(args, context);
        }
        if (action === 'process_kill') {
            return this.runtime.processKill(args, context);
        }
        return createErrorResult('needs_config', `不支持的 computer action：${action}`, {
            supportedActions: schemaResult(runtime).details.schema.actions
        });
    }
}

module.exports = {
    COMPUTER_TOOL_ID,
    HumanClawComputerTool,
    ComputerRuntime,
    commonUserRoots,
    protectedRoots,
    resolveTargetPath
};
