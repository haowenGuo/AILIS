const fs = require('node:fs');
const path = require('node:path');
const { fileURLToPath } = require('node:url');
const { randomUUID } = require('node:crypto');

const MAX_FILE_BYTES = 16 * 1024 * 1024;
const MAX_TOTAL_BYTES = 64 * 1024 * 1024;
const MAX_FILES = 20;
const TEXT_EXTENSIONS = new Set(['.txt', '.md', '.markdown', '.csv', '.tsv', '.json', '.yaml', '.yml', '.xml', '.log', '.js', '.mjs', '.cjs', '.ts', '.tsx', '.jsx', '.css', '.py', '.rs', '.go', '.java', '.c', '.cpp', '.h', '.sh', '.ps1', '.sql']);
const DOCUMENT_TYPES = { '.html': 'text/html', '.htm': 'text/html', '.pdf': 'application/pdf',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation', '.zip': 'application/zip' };
const within = (root, target) => { const relative = path.relative(root, target); return relative !== '' && !path.isAbsolute(relative) && relative !== '..' && !relative.startsWith(`..${path.sep}`); };

function resourceMime(target, data) {
    const ext = path.extname(target).toLowerCase();
    if (data.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) return 'image/png';
    if (data[0] === 255 && data[1] === 216 && data[2] === 255) return 'image/jpeg';
    if (data.subarray(0, 4).toString() === 'RIFF' && data.subarray(8, 12).toString() === 'WEBP') return 'image/webp';
    if (/^GIF8[79]a$/.test(data.subarray(0, 6).toString())) return 'image/gif';
    if (DOCUMENT_TYPES[ext]) return DOCUMENT_TYPES[ext];
    if (TEXT_EXTENSIONS.has(ext) && !data.includes(0)) return ext === '.md' || ext === '.markdown' ? 'text/markdown' : 'text/plain';
    throw new Error('此文件类型暂不支持成果展示');
}

function localTarget(href, workspace) {
    let value = href;
    if (/^file:/i.test(value)) {
        const url = new URL(value);
        if (url.hostname && url.hostname !== 'localhost') throw new Error('不允许读取网络共享路径');
        value = fileURLToPath(url);
    } else {
        // URL fragment/line hints are not part of the file name.
        value = decodeURIComponent(value.split('#')[0]);
        if (process.platform === 'win32' && /^\/[a-z]:\//i.test(value)) value = value.slice(1);
    }
    value = value.replace(/:(\d+)(?::\d+)?$/, '');
    if (!value || /[\u0000-\u001f\u007f]/.test(value) || value.startsWith('\\\\') || value.startsWith('//')) throw new Error('无效本地文件路径');
    // Do not expose Windows alternate data streams or device paths.
    if (process.platform === 'win32' && /:/.test(value.replace(/^[a-z]:/i, ''))) throw new Error('不支持备用数据流');
    return path.resolve(workspace, value);
}

async function readWorkspaceArtifact(host, href, remainingBytes) {
    const workspace = path.resolve(host.gateway.workspaceRoot);
    const requested = localTarget(href, workspace);
    const target = path.resolve(host.gateway.resolveToolPath(requested, workspace, 'path', {}));
    if (!within(workspace, target)) throw new Error('文件不在本次工作区内');
    const parts = path.relative(workspace, target).split(path.sep);
    if (parts.some(part => part.startsWith('.') || ['node_modules', '__pycache__'].includes(part))) throw new Error('不展示隐藏配置、依赖或内部文件');
    if (target === host.root || within(host.root, target)) throw new Error('不展示任务内部记录');
    // Refuse links/junctions at every component, not just the final file.
    let cursor = workspace;
    for (const part of parts) {
        cursor = path.join(cursor, part);
        if ((await fs.promises.lstat(cursor)).isSymbolicLink()) throw new Error('不展示符号链接或目录联接');
    }
    const realRoot = await fs.promises.realpath(workspace);
    const realTarget = await fs.promises.realpath(target);
    if (!within(realRoot, realTarget)) throw new Error('真实路径越出工作区');
    const handle = await fs.promises.open(target, fs.constants.O_RDONLY | (fs.constants.O_NOFOLLOW || 0));
    try {
        const before = await handle.stat();
        const current = await fs.promises.stat(target);
        if (!before.isFile() || before.nlink > 1 || before.ino !== current.ino || before.dev !== current.dev || await fs.promises.realpath(target) !== realTarget) throw new Error('文件不是独立的普通文件或路径已变化');
        if (before.size > MAX_FILE_BYTES) throw new Error('文件超过 16 MiB，请在工作区中查看原文件');
        if (before.size > remainingBytes) throw new Error('本次成果快照总量超过 64 MiB');
        // Bounded read: concurrent growth cannot allocate unbounded memory.
        const data = Buffer.alloc(before.size); let offset = 0;
        while (offset < data.length) {
            const { bytesRead } = await handle.read(data, offset, data.length - offset, offset);
            if (!bytesRead) throw new Error('文件读取期间发生变化');
            offset += bytesRead;
        }
        const after = await handle.stat();
        if (before.size !== after.size || before.mtimeMs !== after.mtimeMs || before.ctimeMs !== after.ctimeMs) throw new Error('文件仍在写入，未保存不完整快照');
        return { target, data, mime: resourceMime(target, data) };
    } finally { await handle.close(); }
}

async function registerFinalArtifacts(host, sessionId, runId, text) {
    if (!text.includes('[')) return;
    const { markdownResourceLinks } = await import('../shared/markdown.mjs');
    const references = markdownResourceLinks(text, MAX_FILES);
    let totalBytes = 0; const registered = new Map();
    for (const { href } of references) {
        let item;
        try {
            const requested = path.resolve(host.gateway.resolveToolPath(localTarget(href, host.gateway.workspaceRoot), host.gateway.workspaceRoot, 'path', {}));
            const existing = registered.get(requested);
            if (existing) { existing.hrefs.push(href); host.record(sessionId, { type: 'item', runId, item: existing }); continue; }
            const { target, data, mime } = await readWorkspaceArtifact(host, href, MAX_TOTAL_BYTES - totalBytes);
            const file = host.load(sessionId).runs.find(run => run.id === runId)?.items.findLast(item => item.kind === 'file' && path.resolve(item.path) === target);
            item = { id: file?.id || `artifact_${randomUUID()}`, kind: file ? 'file' : 'artifact',
                name: path.basename(target), hrefs: [href], artifactRef: host.resource(data, mime), artifactStatus: 'ready',
                artifactNote: '最终回复引用的文件快照；不代表此文件由本任务创建。' };
            totalBytes += data.length; registered.set(target, item);
        } catch (error) {
            item = { id: `artifact_${randomUUID()}`, kind: 'artifact', name: href, hrefs: [href], artifactStatus: 'unavailable',
                artifactError: error.code === 'ENOENT' ? '引用的文件不存在，未生成下载地址' : error.code ? '文件无法读取' : error.message };
        }
        host.record(sessionId, { type: 'item', runId, item });
    }
}

module.exports = { registerFinalArtifacts, resourceMime, readWorkspaceArtifact, MAX_FILE_BYTES, MAX_TOTAL_BYTES, MAX_FILES };
