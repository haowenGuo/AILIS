const fs = require('fs');
const fsp = require('fs/promises');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const zlib = require('zlib');
const { execFile, spawn } = require('child_process');
const { randomUUID } = require('crypto');
const { createAILISPlatformAdapter, getDefaultPlatformAdapter } = require('./ailis-platform-adapter.cjs');
const { extractPdfDocument } = require('./ailis-pdf-document-engine.cjs');

const COMPUTER_TOOL_ID = 'computer';
const DEFAULT_MAX_BYTES = 128 * 1024;
const DEFAULT_TEXT_ARTIFACT_BYTES = 128 * 1024;
const DEFAULT_MAX_ARTIFACT_SOURCE_BYTES = 50 * 1024 * 1024;
const DEFAULT_SEARCH_LIMIT = 200;
const DEFAULT_TREE_LIMIT = 500;
const DEFAULT_PROCESS_BUFFER_BYTES = 256 * 1024;
const DEFAULT_EXEC_TIMEOUT_MS = 30000;
const DEFAULT_SESSION_TIMEOUT_MS = 12 * 60 * 60 * 1000;
const DEFAULT_BINARY_CHUNK_BYTES = 256 * 1024;
const DEFAULT_WATCH_BUFFER_EVENTS = 500;
const DEFAULT_ROLLBACK_LIMIT = 200;
const DEFAULT_EXEC_YIELD_TIME_MS = 1000;
const DEFAULT_EXEC_MAX_OUTPUT_TOKENS = 6000;
const MIN_EXEC_YIELD_TIME_MS = 50;
const MAX_EXEC_YIELD_TIME_MS = 30000;

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
    'exec_command',
    'session_start',
    'pty_start',
    'pty_write',
    'pty_kill',
    'process_write',
    'process_kill',
    'mouse_move',
    'mouse_click',
    'mouse_double_click',
    'mouse_right_click',
    'mouse_drag',
    'scroll',
    'keyboard_type',
    'keyboard_press',
    'keyboard_hotkey',
    'clipboard_write',
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
    'screen_screenshot',
    'clipboard_read',
    'wait',
    'pty_status',
    'pty_read',
    'pty_resize',
    'rollback_list',
    'process_list',
    'process_read',
    'write_stdin'
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

function normalizeCommandArgs(value) {
    if (!Array.isArray(value)) {
        return [];
    }
    return value
        .map((entry) => String(entry))
        .filter((entry) => entry.length > 0);
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

function getRuntimePlatform(runtime = {}) {
    return runtime.platformAdapter || getDefaultPlatformAdapter();
}

function isPathInside(rootPath, targetPath, platformAdapter = getDefaultPlatformAdapter()) {
    return platformAdapter.isPathInside(rootPath, targetPath);
}

function uniquePaths(paths, platformAdapter = getDefaultPlatformAdapter()) {
    return platformAdapter.uniquePaths(paths);
}

function maybePath(...parts) {
    if (parts.some((part) => !normalizeString(part))) {
        return '';
    }
    return path.join(...parts);
}

function commonUserRoots(runtime = {}) {
    const home = os.homedir();
    const platformAdapter = getRuntimePlatform(runtime);
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
    ], platformAdapter);
}

function protectedRoots(runtime = {}) {
    return getRuntimePlatform(runtime).protectedRoots();
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
    const platformAdapter = getRuntimePlatform(runtime);
    const insideCommon = commonRoots.some((root) => isPathInside(root, targetPath, platformAdapter));
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
    const protectedHit = protectedRoots(runtime).find((root) => isPathInside(root, targetPath, platformAdapter));
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

function isLikelyTextBuffer(buffer) {
    if (!Buffer.isBuffer(buffer) || buffer.length === 0) {
        return true;
    }
    const sample = buffer.subarray(0, Math.min(buffer.length, 8192));
    let control = 0;
    let nul = 0;
    for (const byte of sample) {
        if (byte === 0) {
            nul += 1;
        }
        const allowedWhitespace = byte === 9 || byte === 10 || byte === 12 || byte === 13;
        if (byte < 32 && !allowedWhitespace) {
            control += 1;
        }
    }
    const decoded = sample.toString('utf8');
    const replacementChars = (decoded.match(/\uFFFD/g) || []).length;
    return nul === 0 && control / sample.length < 0.02 && replacementChars / Math.max(1, decoded.length) < 0.02;
}

function getStructuredFileHint(filePath = '') {
    const ext = path.extname(filePath).toLowerCase();
    const hints = {
        '.docx': 'Word/DOCX document',
        '.doc': 'Word document',
        '.xlsx': 'Excel/XLSX spreadsheet',
        '.xls': 'Excel spreadsheet',
        '.pptx': 'PowerPoint/PPTX presentation',
        '.ppt': 'PowerPoint presentation',
        '.pdf': 'PDF document',
        '.zip': 'ZIP archive',
        '.7z': '7z archive',
        '.rar': 'RAR archive',
        '.png': 'PNG image',
        '.jpg': 'JPEG image',
        '.jpeg': 'JPEG image',
        '.webp': 'WebP image',
        '.gif': 'GIF image',
        '.mp3': 'audio file',
        '.wav': 'audio file',
        '.mp4': 'video file',
        '.mov': 'video file'
    };
    return hints[ext] || 'binary or structured file';
}

function isTextArtifactExtension(filePath = '') {
    return new Set([
        '.txt',
        '.log',
        '.md',
        '.markdown',
        '.json',
        '.jsonl',
        '.csv',
        '.tsv',
        '.xml',
        '.yaml',
        '.yml',
        '.toml'
    ]).has(path.extname(filePath).toLowerCase());
}

function isDocumentArtifactExtension(filePath = '') {
    return new Set(['.docx', '.pdf']).has(path.extname(filePath).toLowerCase());
}

function decodeXmlEntities(text = '') {
    return String(text || '')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'")
        .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
        .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCharCode(parseInt(code, 16)));
}

function normalizeExtractedDocumentText(text = '') {
    return String(text || '')
        .replace(/\r\n/g, '\n')
        .replace(/[ \t]+\n/g, '\n')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
}

function stripXmlToText(xml = '') {
    const withBreaks = String(xml || '')
        .replace(/<\/w:p>/g, '\n')
        .replace(/<\/w:tr>/g, '\n')
        .replace(/<\/w:tc>/g, '\t')
        .replace(/<w:tab\/>/g, '\t')
        .replace(/<w:br\/>/g, '\n');
    return normalizeExtractedDocumentText(decodeXmlEntities(withBreaks.replace(/<[^>]+>/g, '')));
}

function readZipEntries(buffer) {
    const eocdSignature = 0x06054b50;
    let eocdOffset = -1;
    for (let index = buffer.length - 22; index >= Math.max(0, buffer.length - 66000); index -= 1) {
        if (buffer.readUInt32LE(index) === eocdSignature) {
            eocdOffset = index;
            break;
        }
    }
    if (eocdOffset < 0) {
        throw new Error('zip_eocd_not_found');
    }
    const centralDirectorySize = buffer.readUInt32LE(eocdOffset + 12);
    const centralDirectoryOffset = buffer.readUInt32LE(eocdOffset + 16);
    const entries = new Map();
    let offset = centralDirectoryOffset;
    const end = centralDirectoryOffset + centralDirectorySize;
    while (offset < end && buffer.readUInt32LE(offset) === 0x02014b50) {
        const method = buffer.readUInt16LE(offset + 10);
        const compressedSize = buffer.readUInt32LE(offset + 20);
        const fileNameLength = buffer.readUInt16LE(offset + 28);
        const extraLength = buffer.readUInt16LE(offset + 30);
        const commentLength = buffer.readUInt16LE(offset + 32);
        const localHeaderOffset = buffer.readUInt32LE(offset + 42);
        const name = buffer.subarray(offset + 46, offset + 46 + fileNameLength).toString('utf8');
        const localNameLength = buffer.readUInt16LE(localHeaderOffset + 26);
        const localExtraLength = buffer.readUInt16LE(localHeaderOffset + 28);
        const dataOffset = localHeaderOffset + 30 + localNameLength + localExtraLength;
        const compressed = buffer.subarray(dataOffset, dataOffset + compressedSize);
        let content;
        if (method === 0) {
            content = compressed;
        } else if (method === 8) {
            content = zlib.inflateRawSync(compressed);
        } else {
            content = Buffer.alloc(0);
        }
        entries.set(name, content);
        offset += 46 + fileNameLength + extraLength + commentLength;
    }
    return entries;
}

function extractDocxDocument(buffer) {
    const entries = readZipEntries(buffer);
    const parts = [
        'word/document.xml',
        ...[...entries.keys()].filter((name) => /^word\/(?:header|footer|footnotes|endnotes)\d*\.xml$/i.test(name))
    ];
    const sections = [];
    for (const part of parts) {
        const xml = entries.get(part);
        if (!xml) {
            continue;
        }
        const text = stripXmlToText(xml.toString('utf8'));
        if (text) {
            sections.push({
                index: sections.length,
                title: part,
                text
            });
        }
    }
    const text = normalizeExtractedDocumentText(sections.map((section) => section.text).join('\n\n'));
    if (!text) {
        throw new Error('docx_no_text_extracted');
    }
    return {
        format: 'docx',
        parser: 'basic_docx_zip_xml',
        text,
        pages: [{ pageNumber: 1, text }],
        sections
    };
}

function buildArtifactPreview(text = '', maxChars = 4000) {
    const source = String(text || '');
    if (source.length <= maxChars) {
        return { text: source, truncated: false };
    }
    return {
        text: `${source.slice(0, Math.max(0, maxChars - 120))}\n... [artifact preview truncated; use artifact_query for exact ranges/search] ...`,
        truncated: true
    };
}

async function createManagedTextArtifact({ target, stat, text, encoding = 'utf8', runtime = {}, context = {}, args = {} } = {}) {
    if (!runtime.contextArtifactStore?.createArtifact) {
        return null;
    }
    const lines = text.split(/\r?\n/);
    return await runtime.contextArtifactStore.createArtifact({
        kind: 'text',
        type: path.extname(target).slice(1).toLowerCase() || 'text',
        tool: COMPUTER_TOOL_ID,
        runId: context.runId,
        sessionId: context.sessionId || context.sessionKey,
        sourcePath: target,
        payload: {
            path: target,
            textArtifact: {
                path: target,
                encoding,
                type: path.extname(target).slice(1).toLowerCase() || 'text',
                bytes: stat.size,
                chars: text.length,
                lineCount: lines.length,
                text
            }
        },
        summary: `Text artifact ${path.basename(target)}: ${lines.length} lines, ${text.length} chars`,
        metadata: {
            size: stat.size,
            extension: path.extname(target).toLowerCase(),
            createdFrom: 'computer.read',
            requestedMaxBytes: args.maxBytes
        },
        modelView: {
            path: target,
            lineCount: lines.length,
            chars: text.length,
            queryTools: ['artifact_query:text_schema', 'artifact_query:text_range', 'artifact_query:text_search', 'artifact_query:text_tail']
        },
        queryHints: ['artifact_query summary', 'artifact_query text_range', 'artifact_query text_search', 'artifact_query text_tail']
    });
}

async function createManagedDocumentArtifact({ target, stat, document, runtime = {}, context = {} } = {}) {
    if (!runtime.contextArtifactStore?.createArtifact) {
        return null;
    }
    const lines = document.text.split(/\r?\n/);
    return await runtime.contextArtifactStore.createArtifact({
        kind: 'document',
        type: document.format || path.extname(target).slice(1).toLowerCase() || 'document',
        tool: COMPUTER_TOOL_ID,
        runId: context.runId,
        sessionId: context.sessionId || context.sessionKey,
        sourcePath: target,
        payload: {
            path: target,
            documentArtifact: {
                path: target,
                format: document.format,
                parser: document.parser,
                bytes: stat.size,
                chars: document.text.length,
                lineCount: lines.length,
                text: document.text,
                pages: document.pages || [],
                sections: document.sections || []
            }
        },
        summary: `Document artifact ${path.basename(target)}: ${document.format || 'document'}, ${document.text.length} chars`,
        metadata: {
            size: stat.size,
            extension: path.extname(target).toLowerCase(),
            parser: document.parser,
            createdFrom: 'computer.read'
        },
        modelView: {
            path: target,
            format: document.format,
            parser: document.parser,
            pages: document.pages?.length || 0,
            sections: document.sections?.length || 0,
            chars: document.text.length,
            queryTools: ['artifact_query:document_schema', 'artifact_query:document_search', 'artifact_query:document_page', 'artifact_query:document_section']
        },
        queryHints: ['artifact_query summary', 'artifact_query document_search', 'artifact_query document_page', 'artifact_query document_section']
    });
}

function artifactCreatedReadResult({ kind, record, target, stat, text = '', preview, actions = [] } = {}) {
    return createTextResult([
        `${kind === 'document' ? 'DOCUMENT_ARTIFACT_CREATED' : 'TEXT_ARTIFACT_CREATED'}`,
        `artifactId=${record.id}`,
        `path=${target}`,
        `bytes=${stat.size} payloadBytes=${record.payloadBytes}`,
        `queryWith=artifact_query actions ${actions.join(', ')}`,
        'observation_contract=complete:true truncated:false reasoning_ready:true',
        '--- preview ---',
        preview.text
    ].filter(Boolean).join('\n'), {
        status: 'completed',
        action: 'read',
        path: target,
        size: stat.size,
        sizeText: formatBytes(stat.size),
        artifactId: record.id,
        artifactKind: kind,
        payloadBytes: record.payloadBytes,
        previewTruncated: preview.truncated,
        complete: true,
        truncated: false,
        reasoningReady: true,
        suggestedNext: {
            tool: 'artifact_query',
            args: {
                artifactId: record.id,
                action: kind === 'document' ? 'document_search' : 'text_search',
                query: '<text>'
            }
        }
    });
}

function normalizeDocumentParseFailure(error) {
    return {
        code: normalizeString(error?.code || ''),
        message: error?.message || String(error || ''),
        details: error?.details && typeof error.details === 'object' ? error.details : {}
    };
}

function isScannedPdfNeedsOcrFailure(failure = {}) {
    return failure.code === 'scanned_pdf_needs_ocr' ||
        failure.code === 'pdf_no_text_extracted' ||
        /scanned_pdf_needs_ocr|pdf_no_text_extracted|no selectable text|scanned\/image-only/i.test(failure.message || '');
}

function scannedPdfNeedsOcrReadResult({ target, stat, bytesRead = 0, fileKind = 'PDF document', failure = {} } = {}) {
    return createErrorResult(
        'scanned_pdf_needs_ocr',
        `这个 PDF 没有可选中的文本，像是扫描件或图片型 PDF。read 不会把 PDF 图片流乱码当作正文；请通过 tool_search 查找 OCR / PDF page render / vision 工具，再把 OCR 结果保存为 document_artifact 后查询。`,
        {
            path: target,
            size: stat?.size || 0,
            sizeText: formatBytes(stat?.size || 0),
            bytesSampled: bytesRead,
            fileKind,
            documentParseError: failure.message || 'scanned_pdf_needs_ocr',
            documentParseCode: failure.code || 'scanned_pdf_needs_ocr',
            parseDetails: failure.details || {},
            suggestedNext: {
                tool: 'tool_search',
                query: 'OCR scanned PDF image-only PDF pdf_page_render ocr_document vision text extraction'
            },
            observationContract: {
                complete: false,
                truncated: false,
                reasoning_ready: false,
                needs_ocr: true
            },
            override: 'If raw bytes are needed for a custom OCR pipeline, use read_binary or render PDF pages to images first.'
        }
    );
}

function pickOutputStoreDirectTool(action = '') {
    const normalized = normalizeGuiAction(action);
    if (normalized === 'tail' || normalized === 'output_tail' || normalized === 'tail_output') {
        return 'output_tail';
    }
    if (normalized === 'search' || normalized === 'find' || normalized === 'output_search' || normalized === 'search_output') {
        return 'output_search';
    }
    if (normalized === 'read' || normalized === 'cat' || normalized === 'output_read' || normalized === 'read_output') {
        return 'output_read';
    }
    return '';
}

function outputStoreWrongSurfaceResult(args = {}, action = '') {
    const outputId = normalizeString(args.outputId || args.output_id || args.id);
    if (!outputId) {
        return null;
    }
    const normalizedAction = normalizeGuiAction(action);
    const hasFilesystemTarget = Boolean(normalizeString(args.path || args.source || args.target || args.workdir));
    const explicitOutputAction = /^output_(read|tail|search)$/.test(normalizedAction) || /_output$/.test(normalizedAction);
    if (hasFilesystemTarget && !explicitOutputAction) {
        return null;
    }
    if (!pickOutputStoreDirectTool(action)) {
        return null;
    }
    return createErrorResult(
        'wrong_tool_surface',
        `outputId 是执行日志标识，不是文件路径，也不是 computer action。请通过 tool_search 查询 output_read/output_tail/output_search，并用返回的 direct tool 按需读取、搜索或查看尾部；不要把 outputId 当 path 传给 computer.read。`,
        {
            action,
            outputId,
            wrongCall: {
                tool: 'computer',
                args: {
                    action,
                    outputId
                }
            },
            defaultSurface: 'deferred_output_store_tools',
            recovery: 'Call tool_search with a query like "exec output outputId search tail read", then call output_search/output_tail/output_read directly.'
        }
    );
}

function normalizeGuiAction(action = '') {
    const normalized = normalizeString(action).toLowerCase().replace(/[-\s]+/g, '_');
    const aliases = {
        screenshot: 'screen_screenshot',
        capture_screen: 'screen_screenshot',
        click: 'mouse_click',
        double_click: 'mouse_double_click',
        right_click: 'mouse_right_click',
        drag: 'mouse_drag',
        mouse_scroll: 'scroll',
        type: 'keyboard_type',
        type_text: 'keyboard_type',
        press_key: 'keyboard_press',
        hotkey: 'keyboard_hotkey',
        read_clipboard: 'clipboard_read',
        write_clipboard: 'clipboard_write',
        sleep: 'wait',
        shell: 'exec_command',
        shell_exec: 'exec_command',
        command: 'exec_command',
        poll: 'write_stdin',
        process_poll: 'write_stdin',
        stdin: 'write_stdin'
    };
    return aliases[normalized] || normalized;
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
    return path.join(getWorkspaceRoot(runtime), '.ailis-rollback');
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

async function runAdapterCommand(commandSpec = {}, options = {}) {
    const steps = Array.isArray(commandSpec.steps) && commandSpec.steps.length
        ? commandSpec.steps
        : [{ command: commandSpec.command, args: commandSpec.args || [], windowsHide: commandSpec.windowsHide }];
    const stdoutParts = [];
    const stderrParts = [];
    let lastExitCode = 0;
    for (let index = 0; index < steps.length; index++) {
        const step = steps[index] || {};
        const result = await runExecFile(step.command, step.args || [], {
            ...options,
            windowsHide: step.windowsHide ?? commandSpec.windowsHide ?? options.windowsHide
        });
        lastExitCode = result.exitCode;
        if (result.stdout) {
            stdoutParts.push(result.stdout);
        }
        if (result.stderr) {
            stderrParts.push(result.stderr);
        }
        if (!result.ok && !step.optional) {
            return {
                ...result,
                stepIndex: index,
                stepCommand: step.command,
                stdout: stdoutParts.join('\n'),
                stderr: stderrParts.join('\n') || result.stderr
            };
        }
    }
    return {
        ok: true,
        exitCode: lastExitCode,
        stdout: stdoutParts.join('\n'),
        stderr: stderrParts.join('\n'),
        error: ''
    };
}

function parseJsonObject(text = '') {
    const trimmed = normalizeString(text);
    if (!trimmed) {
        return null;
    }
    try {
        return JSON.parse(trimmed);
    } catch {
        const line = trimmed
            .split(/\r?\n/)
            .reverse()
            .find((entry) => entry.trim().startsWith('{') && entry.trim().endsWith('}'));
        if (!line) {
            return null;
        }
        try {
            return JSON.parse(line);
        } catch {
            return null;
        }
    }
}

function defaultScreenshotPath(runtime = {}) {
    const root = runtime.screenshotDir ||
        path.join(os.tmpdir(), 'ailis-screenshots');
    return path.join(root, `screen-${Date.now()}-${crypto.randomBytes(3).toString('hex')}.png`);
}

async function actionWait(args = {}) {
    const durationMs = normalizeNumber(args.durationMs || args.ms || args.timeoutMs, 1000, 0, 60000);
    await new Promise((resolve) => setTimeout(resolve, durationMs));
    return createTextResult(`wait completed: ${durationMs}ms`, {
        status: 'completed',
        action: 'wait',
        durationMs
    });
}

async function actionScreenScreenshot(args, context, runtime) {
    const platformAdapter = getRuntimePlatform(runtime);
    const targetPath = resolveTargetPath(args.path || args.outputPath || defaultScreenshotPath(runtime), runtime);
    const guard = guardPath(targetPath, 'write', context, runtime);
    if (guard) {
        return guard;
    }
    const command = platformAdapter.desktopScreenshotCommand?.({ outputPath: targetPath });
    if (!command?.supported) {
        return createErrorResult('not_supported', command?.reason || 'screen_screenshot is not supported by this platform adapter.', {
            action: 'screen_screenshot',
            platform: platformAdapter.getStatus()
        });
    }
    await fsp.mkdir(path.dirname(targetPath), { recursive: true }).catch(() => {});
    const result = await runAdapterCommand(command, {
        timeout: normalizeNumber(args.timeoutMs, 15000, 1000, 120000),
        windowsHide: command.windowsHide !== false
    });
    if (!result.ok) {
        return createErrorResult('computer_exec_failed', '屏幕截图失败。', {
            action: 'screen_screenshot',
            ...result
        });
    }
    const parsed = parseJsonObject(result.stdout) || {};
    const stat = await safeStat(targetPath);
    return {
        content: [
            { type: 'text', text: `screen_screenshot saved: ${targetPath}` },
            { type: 'image', uri: targetPath, mimeType: 'image/png' }
        ],
        details: {
            status: 'completed',
            action: 'screen_screenshot',
            path: targetPath,
            width: parsed.width || null,
            height: parsed.height || null,
            size: stat?.size || null,
            sizeText: stat ? formatBytes(stat.size) : 'unknown',
            stdout: result.stdout,
            stderr: result.stderr
        }
    };
}

async function actionClipboardRead(args, context, runtime) {
    const platformAdapter = getRuntimePlatform(runtime);
    const command = platformAdapter.clipboardReadCommand?.();
    if (!command?.supported) {
        return createErrorResult('not_supported', command?.reason || 'clipboard_read is not supported by this platform adapter.', {
            action: 'clipboard_read',
            platform: platformAdapter.getStatus()
        });
    }
    const result = await runAdapterCommand(command, {
        timeout: normalizeNumber(args.timeoutMs, 10000, 1000, 60000),
        windowsHide: command.windowsHide !== false
    });
    if (!result.ok) {
        return createErrorResult('computer_exec_failed', '读取剪贴板失败。', {
            action: 'clipboard_read',
            ...result
        });
    }
    const parsed = parseJsonObject(result.stdout);
    const text = parsed && typeof parsed.text === 'string' ? parsed.text : result.stdout;
    return createTextResult(text, {
        status: 'completed',
        action: 'clipboard_read',
        text,
        bytes: Buffer.byteLength(text, 'utf8')
    });
}

async function actionClipboardWrite(args, context, runtime) {
    const action = 'clipboard_write';
    const guard = approvalRequired(action, args, context);
    if (guard) {
        return guard;
    }
    const platformAdapter = getRuntimePlatform(runtime);
    const text = typeof args.text === 'string' ? args.text : String(args.content || '');
    const command = platformAdapter.clipboardWriteCommand?.({ text });
    if (!command?.supported) {
        return createErrorResult('not_supported', command?.reason || 'clipboard_write is not supported by this platform adapter.', {
            action,
            platform: platformAdapter.getStatus()
        });
    }
    const result = await runAdapterCommand(command, {
        timeout: normalizeNumber(args.timeoutMs, 10000, 1000, 60000),
        windowsHide: command.windowsHide !== false
    });
    if (!result.ok) {
        return createErrorResult('computer_exec_failed', '写入剪贴板失败。', {
            action,
            ...result
        });
    }
    return createTextResult('clipboard_write completed', {
        status: 'completed',
        action,
        bytes: Buffer.byteLength(text, 'utf8'),
        stdout: result.stdout,
        stderr: result.stderr
    });
}

async function actionGuiInput(args, context, runtime) {
    const action = normalizeGuiAction(args.action || args.operation || args.intent);
    const guard = approvalRequired(action, args, context);
    if (guard) {
        return guard;
    }
    const platformAdapter = getRuntimePlatform(runtime);
    const command = platformAdapter.guiInputCommand?.({ ...args, action });
    if (!command?.supported) {
        return createErrorResult('not_supported', command?.reason || `${action} is not supported by this platform adapter.`, {
            action,
            platform: platformAdapter.getStatus()
        });
    }
    const result = await runAdapterCommand(command, {
        timeout: normalizeNumber(args.timeoutMs, 10000, 1000, 120000),
        windowsHide: command.windowsHide !== false
    });
    if (!result.ok) {
        return createErrorResult('computer_exec_failed', `${action} 执行失败。`, {
            action,
            ...result
        });
    }
    const parsed = parseJsonObject(result.stdout) || {};
    return createTextResult(`${action} completed`, {
        status: 'completed',
        action,
        observation: parsed,
        stdout: result.stdout,
        stderr: result.stderr
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
    const artifactRecord = await runtime.contextArtifactStore?.findByPath?.(target).catch(() => null);
    if (artifactRecord?.payloadPath && path.resolve(artifactRecord.payloadPath) === path.resolve(target)) {
        return runtime.contextArtifactStore.guardReadResult(artifactRecord, target);
    }
    const stat = await safeStat(target);
    if (!stat || !stat.isFile()) {
        return createErrorResult('not_found', `文件不存在：${target}`, { path: target });
    }
    const maxBytes = normalizeNumber(args.maxBytes, DEFAULT_MAX_BYTES, 1, 5 * 1024 * 1024);
    const maxArtifactBytes = normalizeNumber(args.maxArtifactBytes || args.max_artifact_bytes, DEFAULT_MAX_ARTIFACT_SOURCE_BYTES, 1, 100 * 1024 * 1024);
    const handle = await fsp.open(target, 'r');
    try {
        const buffer = Buffer.alloc(Math.min(stat.size, maxBytes));
        const { bytesRead } = await handle.read(buffer, 0, buffer.length, 0);
        const chunk = buffer.subarray(0, bytesRead);
        const forceText = args.forceText === true || args.allowBinaryText === true;
        if (!forceText && isDocumentArtifactExtension(target)) {
            let documentParseError = '';
            let documentParseFailure = null;
            if (stat.size <= maxArtifactBytes && runtime.contextArtifactStore?.createArtifact) {
                try {
                    const fullBuffer = stat.size === bytesRead ? chunk : await fsp.readFile(target);
                    const ext = path.extname(target).toLowerCase();
                    const document = ext === '.docx'
                        ? extractDocxDocument(fullBuffer)
                        : await extractPdfDocument(fullBuffer);
                    const record = await createManagedDocumentArtifact({
                        target,
                        stat,
                        document,
                        runtime,
                        context
                    });
                    if (record?.id) {
                        const preview = buildArtifactPreview(document.text, normalizeNumber(args.previewChars || args.preview_chars, 4000, 1000, 20000));
                        return artifactCreatedReadResult({
                            kind: 'document',
                            record,
                            target,
                            stat,
                            text: document.text,
                            preview,
                            actions: ['summary', 'document_schema', 'document_search', 'document_page', 'document_section']
                        });
                    }
                } catch (error) {
                    documentParseFailure = normalizeDocumentParseFailure(error);
                    documentParseError = documentParseFailure.message;
                }
            } else {
                documentParseError = stat.size > maxArtifactBytes
                    ? `document_too_large:${formatBytes(stat.size)} > ${formatBytes(maxArtifactBytes)}`
                    : 'context_artifact_store_unavailable';
            }
            const fileKind = getStructuredFileHint(target);
            if (isScannedPdfNeedsOcrFailure(documentParseFailure)) {
                return scannedPdfNeedsOcrReadResult({
                    target,
                    stat,
                    bytesRead,
                    fileKind,
                    failure: documentParseFailure
                });
            }
            return createErrorResult(
                'binary_file',
                `read 不能直接把 ${fileKind} 的原始内容放进模型上下文；${target} 未能解析为 document_artifact。请使用 tool_search 查找 DOCX/PDF 专用解析工具，或 read_binary 读取原始字节。`,
                {
                    path: target,
                    size: stat.size,
                    sizeText: formatBytes(stat.size),
                    bytesSampled: bytesRead,
                    fileKind,
                    documentParseError,
                    suggestedNext: {
                        tool: 'tool_search',
                        query: `${fileKind} document_artifact document_search pdf docx extract text`
                    },
                    override: 'If raw text decoding is truly intended, call read with forceText=true.'
                }
            );
        }
        if (!forceText && !isLikelyTextBuffer(chunk)) {
            let documentParseError = '';
            let documentParseFailure = null;
            if (
                isDocumentArtifactExtension(target) &&
                stat.size <= maxArtifactBytes &&
                runtime.contextArtifactStore?.createArtifact
            ) {
                try {
                    const fullBuffer = stat.size === bytesRead ? chunk : await fsp.readFile(target);
                    const ext = path.extname(target).toLowerCase();
                    const document = ext === '.docx'
                        ? extractDocxDocument(fullBuffer)
                        : await extractPdfDocument(fullBuffer);
                    const record = await createManagedDocumentArtifact({
                        target,
                        stat,
                        document,
                        runtime,
                        context
                    });
                    if (record?.id) {
                        const preview = buildArtifactPreview(document.text, normalizeNumber(args.previewChars || args.preview_chars, 4000, 1000, 20000));
                        return artifactCreatedReadResult({
                            kind: 'document',
                            record,
                            target,
                            stat,
                            text: document.text,
                            preview,
                            actions: ['summary', 'document_schema', 'document_search', 'document_page', 'document_section']
                        });
                    }
                } catch (error) {
                    documentParseFailure = normalizeDocumentParseFailure(error);
                    documentParseError = documentParseFailure.message;
                }
            }
            const fileKind = getStructuredFileHint(target);
            if (isScannedPdfNeedsOcrFailure(documentParseFailure)) {
                return scannedPdfNeedsOcrReadResult({
                    target,
                    stat,
                    bytesRead,
                    fileKind,
                    failure: documentParseFailure
                });
            }
            const structuredQuery = /Excel|XLSX|spreadsheet/i.test(fileKind)
                ? 'read_xlsx_workbook xlsx workbook cell values fill colors formulas merged ranges'
                : `${fileKind} extract text tables content artifact_query document_search`;
            return createErrorResult(
                'binary_file',
                `read 只能读取普通文本文件；${target} 看起来是 ${fileKind}。请使用专用解析工具、tool_search，或 read_binary 读取原始字节，不要把二进制内容当文本上下文。`,
                {
                    path: target,
                    size: stat.size,
                    sizeText: formatBytes(stat.size),
                    bytesSampled: bytesRead,
                    fileKind,
                    suggestedNext: {
                        tool: 'tool_search',
                        query: structuredQuery
                    },
                    ...(documentParseError ? { documentParseError } : {}),
                    override: 'If raw text decoding is truly intended, call read with forceText=true.'
                }
            );
        }
        const text = chunk.toString(args.encoding || 'utf8');
        const shouldCreateTextArtifact = (
            args.asArtifact === true ||
            args.artifact === true ||
            (stat.size > maxBytes && isTextArtifactExtension(target))
        ) && stat.size <= maxArtifactBytes && runtime.contextArtifactStore?.createArtifact;
        if (shouldCreateTextArtifact) {
            const fullText = stat.size === bytesRead
                ? text
                : await fsp.readFile(target, args.encoding || 'utf8');
            const record = await createManagedTextArtifact({
                target,
                stat,
                text: fullText,
                encoding: args.encoding || 'utf8',
                runtime,
                context,
                args
            });
            if (record?.id) {
                const preview = buildArtifactPreview(fullText, normalizeNumber(args.previewChars || args.preview_chars, 4000, 1000, 20000));
                return artifactCreatedReadResult({
                    kind: 'text',
                    record,
                    target,
                    stat,
                    text: fullText,
                    preview,
                    actions: ['summary', 'text_schema', 'text_range', 'text_search', 'text_tail']
                });
            }
        }
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
            args.trashDir || path.join(runtime.workspaceRoot || runtime.workspaceDir || process.cwd(), 'tmp', 'ailis-computer-trash'),
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
    const platformAdapter = getRuntimePlatform(runtime);
    const aclCommand = platformAdapter.aclReadCommand(target);
    const result = await runExecFile(aclCommand.command, aclCommand.args);
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
        platform: platformAdapter.getStatus(),
        stdout: result.stdout
    });
}

async function actionAclSet(args, context, runtime) {
    const target = resolveTargetPath(args.path, runtime);
    const guard = guardPath(target, 'acl_set', context, runtime) || approvalRequired('acl_set', args, context);
    if (guard) {
        return guard;
    }
    const platformAdapter = getRuntimePlatform(runtime);
    const icaclsArgs = Array.isArray(args.icaclsArgs)
        ? args.icaclsArgs.map((entry) => normalizeString(entry)).filter(Boolean)
        : [];
    const aclCommand = platformAdapter.aclSetCommand(target, icaclsArgs);
    if (!aclCommand.supported) {
        return createErrorResult('not_supported', 'acl_set 当前只实现了 Windows icacls 安全封装。', {
            action: 'acl_set',
            platform: platformAdapter.getStatus(),
            reason: aclCommand.reason
        });
    }
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
    const result = await runExecFile(aclCommand.command, aclCommand.args);
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

function estimateTokenCount(text = '') {
    return Math.ceil(String(text).length / 4);
}

function truncateByApproxTokens(text = '', maxTokens = DEFAULT_EXEC_MAX_OUTPUT_TOKENS) {
    const source = String(text || '');
    const limit = normalizeNumber(maxTokens, DEFAULT_EXEC_MAX_OUTPUT_TOKENS, 256, 100000);
    const maxChars = limit * 4;
    if (source.length <= maxChars) {
        return source;
    }
    return `${source.slice(0, Math.max(0, maxChars - 160))}\n...[truncated: original_token_count=${estimateTokenCount(source)}, max_output_tokens=${limit}]`;
}

function hasShellNewline(command = '') {
    return /\r|\n/.test(String(command || ''));
}

function buildCommandDiagnostics({ command = '', args = [], platformAdapter = null } = {}) {
    const diagnostics = {
        shellString: !normalizeCommandArgs(args).length,
        containsNewline: hasShellNewline(command),
        platform: platformAdapter?.getStatus ? platformAdapter.getStatus() : null,
        warnings: []
    };
    if (
        diagnostics.shellString &&
        diagnostics.containsNewline &&
        typeof platformAdapter?.isWindows === 'function' &&
        platformAdapter.isWindows()
    ) {
        diagnostics.warnings.push({
            code: 'windows_cmd_multiline_shell_string',
            message: 'Windows cmd shell strings with embedded newlines are fragile. Prefer command+args, or write complex Python/PowerShell/Node logic to a script file and run that file.'
        });
    }
    return diagnostics;
}

function annotateExecDetails(details = {}, { command = '', args = [], platformAdapter = null } = {}) {
    const stdout = typeof details.stdout === 'string' ? details.stdout : '';
    const stderr = typeof details.stderr === 'string' ? details.stderr : '';
    const outputEmpty = stdout.length === 0 && stderr.length === 0;
    return {
        ...details,
        outputEmpty,
        evidence: {
            stdoutBytes: Buffer.byteLength(stdout, 'utf8'),
            stderrBytes: Buffer.byteLength(stderr, 'utf8'),
            hasStdout: stdout.length > 0,
            hasStderr: stderr.length > 0,
            exitCode: details.exitCode ?? details.exit_code ?? null
        },
        commandDiagnostics: buildCommandDiagnostics({ command, args, platformAdapter })
    };
}

function formatExecContent(details = {}) {
    if (details.outputStore?.outputId) {
        const outputStore = details.outputStore;
        const previewTruncated = outputStore.previewTruncated === true;
        const lines = [
            `exitCode=${details.exitCode ?? details.exit_code}`,
            `bytes=${outputStore.bytes ?? 0} lines=${outputStore.lineCount ?? 0} stdoutBytes=${outputStore.stdoutBytes ?? 0} stderrBytes=${outputStore.stderrBytes ?? 0}`,
            `outputComplete=${previewTruncated ? 'false' : 'true'}`,
            `outputTruncatedForModel=${previewTruncated ? 'true' : 'false'}`
        ];
        if (previewTruncated) {
            lines.push(
                'fullOutput=stored_for_agent_lab',
                'modelHint=Visible output is incomplete. Use tool_search query "exec output outputId search tail read" to load output_search/output_tail/output_read, then inspect only the needed slice. Do not rerun the command just to recover truncated output.'
            );
        } else {
            lines.push('modelHint=Visible stdout/stderr below is complete for this command.');
        }
        if (outputStore.preview) {
            lines.push(previewTruncated ? '--- stdout/stderr preview ---' : '--- stdout/stderr complete ---', outputStore.preview);
        } else {
            lines.push('stdout=<empty>', 'stderr=<empty>');
        }
        const warnings = Array.isArray(details.commandDiagnostics?.warnings)
            ? details.commandDiagnostics.warnings
            : [];
        if (warnings.length) {
            lines.push(`diagnostic=${warnings.map((warning) => warning.code).join(',')}`);
            lines.push(warnings.map((warning) => warning.message).join(' '));
        }
        return lines.join('\n');
    }
    if (details.stdout) {
        return details.stdout;
    }
    if (details.stderr) {
        return details.stderr;
    }
    const lines = [
        `exitCode=${details.exitCode ?? details.exit_code}`,
        'stdout=<empty>',
        'stderr=<empty>'
    ];
    const warnings = Array.isArray(details.commandDiagnostics?.warnings)
        ? details.commandDiagnostics.warnings
        : [];
    if (warnings.length) {
        lines.push(`diagnostic=${warnings.map((warning) => warning.code).join(',')}`);
        lines.push(warnings.map((warning) => warning.message).join(' '));
    } else {
        lines.push('diagnostic=no stdout/stderr was produced; if output files were expected, verify them with stat/read instead of assuming they exist.');
    }
    return lines.join('\n');
}

function collectSessionText(record = {}) {
    return [record.stdout || '', record.stderr || ''].filter(Boolean).join(record.stdout && record.stderr ? '\n' : '');
}

function collectPtyText(record = {}) {
    return record.output || '';
}

async function createExecOutputCapture({ args = {}, context = {}, runtime = {}, action = 'exec', command = '', commandArgs = [], workdir = '' } = {}) {
    const store = runtime?.outputStore || context?.outputStore;
    if (!store?.createCapture || args.storeOutput === false || args.captureOutput === false) {
        return null;
    }
    const callId = normalizeString(context.callId || args.callId || args.outputId, randomUUID());
    const previewChars = normalizeNumber(
        args.previewChars || args.outputPreviewChars || args.maxPreviewChars,
        6000,
        256,
        100000
    );
    try {
        return await store.createCapture({
            outputId: args.outputId || callId,
            callId,
            previewChars,
            metadata: {
                action,
                tool: COMPUTER_TOOL_ID,
                command,
                args: commandArgs,
                workdir,
                runId: normalizeString(context.runId),
                sessionId: normalizeString(context.sessionId || context.sessionKey),
                iteration: Number.isFinite(Number(context.iteration)) ? Number(context.iteration) : null
            }
        });
    } catch {
        return null;
    }
}

function summarizeExecOutputCapture(outputCapture) {
    if (!outputCapture?.summary) {
        return null;
    }
    try {
        return outputCapture.summary();
    } catch {
        return null;
    }
}

async function finalizeExecOutputCapture(outputCapture, extra = {}) {
    if (!outputCapture?.finalize) {
        return null;
    }
    try {
        return await outputCapture.finalize(extra);
    } catch (error) {
        return {
            status: 'store_error',
            error: error?.message || String(error)
        };
    }
}

async function summarizeRecordOutputStore(record = {}, extra = {}) {
    if (record.outputStore) {
        return record.outputStore;
    }
    if (!record.outputCapture) {
        return null;
    }
    if (record.status && record.status !== 'running') {
        record.outputStore = await finalizeExecOutputCapture(record.outputCapture, {
            status: record.status === 'exited' && record.exitCode === 0 ? 'completed' : record.status,
            exitCode: record.exitCode,
            signal: record.signal,
            ...extra
        });
        return record.outputStore;
    }
    return summarizeExecOutputCapture(record.outputCapture);
}

function attachOutputStoreDetails(details = {}, outputStore = null) {
    if (!outputStore?.outputId) {
        return details;
    }
    return {
        ...details,
        outputId: outputStore.outputId,
        outputPreview: outputStore.preview || '',
        outputPreviewTruncated: outputStore.previewTruncated === true,
        outputBytes: outputStore.bytes ?? outputStore.combinedBytes ?? null,
        outputLineCount: outputStore.lineCount ?? null,
        outputStore
    };
}

class ComputerRuntime {
    constructor(options = {}) {
        this.sessions = new Map();
        this.ptySessions = new Map();
        this.watchers = new Map();
        this.workspaceRoot = options.workspaceRoot || process.cwd();
        this.platformAdapter = createAILISPlatformAdapter(options.platformAdapter || options.platform || {});
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

    createSessionRecord({ command, workdir, child, timeoutMs, outputCapture = null }) {
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
            timeout: null,
            outputCapture,
            outputStore: summarizeExecOutputCapture(outputCapture)
        };
        child.stdout?.on('data', (chunk) => {
            record.stdout = appendBounded(record.stdout, chunk);
            record.outputCapture?.append('stdout', chunk);
            record.updatedAt = Date.now();
        });
        child.stderr?.on('data', (chunk) => {
            record.stderr = appendBounded(record.stderr, chunk);
            record.outputCapture?.append('stderr', chunk);
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
            finalizeExecOutputCapture(record.outputCapture, {
                status: code === 0 ? 'completed' : 'error',
                exitCode: code,
                signal
            }).then((summary) => {
                if (summary) {
                    record.outputStore = summary;
                }
            }).catch(() => {});
        });
        child.on('error', (error) => {
            record.status = 'error';
            record.stderr = appendBounded(record.stderr, `\n${error.message || error}`);
            record.outputCapture?.append('stderr', `\n${error.message || error}`);
            record.updatedAt = Date.now();
            finalizeExecOutputCapture(record.outputCapture, {
                status: 'error',
                error: error?.message || String(error)
            }).then((summary) => {
                if (summary) {
                    record.outputStore = summary;
                }
            }).catch(() => {});
        });
        record.timeout = setTimeout(() => {
            if (record.status === 'running') {
                record.status = 'timeout';
                child.kill('SIGTERM');
                finalizeExecOutputCapture(record.outputCapture, {
                    status: 'timeout'
                }).then((summary) => {
                    if (summary) {
                        record.outputStore = summary;
                    }
                }).catch(() => {});
            }
        }, timeoutMs);
        this.sessions.set(id, record);
        return record;
    }

    async waitForProcessSnapshot(record, yieldTimeMs = DEFAULT_EXEC_YIELD_TIME_MS) {
        const waitMs = normalizeNumber(yieldTimeMs, DEFAULT_EXEC_YIELD_TIME_MS, MIN_EXEC_YIELD_TIME_MS, MAX_EXEC_YIELD_TIME_MS);
        const deadline = Date.now() + waitMs;
        let lastLength = Buffer.byteLength(collectSessionText(record), 'utf8');
        while (Date.now() < deadline) {
            if (record.status !== 'running') {
                break;
            }
            await new Promise((resolve) => setTimeout(resolve, 25));
            const nextLength = Buffer.byteLength(collectSessionText(record), 'utf8');
            if (nextLength !== lastLength) {
                lastLength = nextLength;
            }
        }
        return this.buildUnifiedExecDetails(record, { yieldTimeMs: waitMs });
    }

    async waitForPtySnapshot(record, yieldTimeMs = DEFAULT_EXEC_YIELD_TIME_MS) {
        const waitMs = normalizeNumber(yieldTimeMs, DEFAULT_EXEC_YIELD_TIME_MS, MIN_EXEC_YIELD_TIME_MS, MAX_EXEC_YIELD_TIME_MS);
        const deadline = Date.now() + waitMs;
        while (Date.now() < deadline) {
            if (record.status !== 'running') {
                break;
            }
            await new Promise((resolve) => setTimeout(resolve, 25));
        }
        return this.buildUnifiedPtyDetails(record, { yieldTimeMs: waitMs });
    }

    buildUnifiedExecDetails(record, options = {}) {
        const outputText = collectSessionText(record);
        const maxOutputTokens = normalizeNumber(options.maxOutputTokens || options.max_output_tokens, DEFAULT_EXEC_MAX_OUTPUT_TOKENS, 256, 100000);
        const originalTokenCount = estimateTokenCount(outputText);
        const output = truncateByApproxTokens(outputText, maxOutputTokens);
        const running = record.status === 'running';
        const outputStore = record.outputStore || summarizeExecOutputCapture(record.outputCapture);
        return {
            status: 'completed',
            action: options.action || 'exec_command',
            command: record.command,
            workdir: record.workdir,
            pid: record.pid,
            session_id: running ? record.id : undefined,
            sessionId: running ? record.id : undefined,
            exit_code: running ? null : record.exitCode,
            exitCode: running ? null : record.exitCode,
            signal: record.signal,
            process_status: record.status,
            running,
            chunk_id: randomUUID(),
            wall_time_seconds: Math.max(0, (Date.now() - record.startedAt) / 1000),
            original_token_count: originalTokenCount,
            max_output_tokens: maxOutputTokens,
            output,
            stdout: truncateByApproxTokens(record.stdout || '', maxOutputTokens),
            stderr: truncateByApproxTokens(record.stderr || '', maxOutputTokens),
            outputId: outputStore?.outputId,
            outputStore,
            session: this.publicSession(record)
        };
    }

    buildUnifiedPtyDetails(record, options = {}) {
        const outputText = collectPtyText(record);
        const maxOutputTokens = normalizeNumber(options.maxOutputTokens || options.max_output_tokens, DEFAULT_EXEC_MAX_OUTPUT_TOKENS, 256, 100000);
        const originalTokenCount = estimateTokenCount(outputText);
        const output = truncateByApproxTokens(outputText, maxOutputTokens);
        const running = record.status === 'running';
        return {
            status: 'completed',
            action: options.action || 'exec_command',
            command: record.command,
            workdir: record.workdir,
            pid: record.pid,
            tty: true,
            session_id: running ? record.id : undefined,
            sessionId: running ? record.id : undefined,
            exit_code: running ? null : record.exitCode,
            exitCode: running ? null : record.exitCode,
            signal: record.signal,
            process_status: record.status,
            running,
            chunk_id: randomUUID(),
            wall_time_seconds: Math.max(0, (Date.now() - record.startedAt) / 1000),
            original_token_count: originalTokenCount,
            max_output_tokens: maxOutputTokens,
            output,
            stdout: output,
            stderr: '',
            session: this.publicPty(record)
        };
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
        const cols = normalizeNumber(args.cols, 100, 20, 400);
        const rows = normalizeNumber(args.rows, 30, 5, 200);
        const ptySpec = getRuntimePlatform(runtime).ptySpawnOptions({
            command,
            executable: args.executable || args.shell,
            args: args.args,
            cwd: workdir,
            env: args.env,
            term: normalizeString(args.term, 'xterm-256color'),
            cols,
            rows,
            useConpty: args.useConpty,
            useConptyDll: args.useConptyDll
        });
        const terminal = ptyLoad.pty.spawn(ptySpec.executable, ptySpec.args, ptySpec.options);
        const record = {
            id: randomUUID(),
            command,
            executable: ptySpec.executable,
            args: ptySpec.args,
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
        const outputStore = record.outputStore || summarizeExecOutputCapture(record.outputCapture);
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
            ...(outputStore ? { outputId: outputStore.outputId, outputStore } : {}),
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
        const commandArgs = normalizeCommandArgs(args.args || args.arguments);
        const commandForDisplay = commandArgs.length ? [command, ...commandArgs].join(' ') : command;
        const workdir = resolveWorkdir(args, context, runtime);
        const guard = guardPath(workdir, 'read', context, runtime) || commandNeedsApproval({ ...args, action: 'exec', command: commandForDisplay }, context);
        if (guard) {
            return guard;
        }
        if (args.dryRun === true) {
            return createTextResult(JSON.stringify({ action: 'exec', dryRun: true, command, args: commandArgs, workdir }, null, 2), {
                status: 'completed',
                action: 'exec',
                dryRun: true,
                command,
                args: commandArgs,
                workdir
            });
        }
        const timeoutMs = normalizeNumber(args.timeoutMs || args.timeout, DEFAULT_EXEC_TIMEOUT_MS, 1000, 10 * 60 * 1000);
        const maxOutputTokens = normalizeNumber(args.max_output_tokens || args.maxOutputTokens, DEFAULT_EXEC_MAX_OUTPUT_TOKENS, 256, 100000);
        const startedAt = Date.now();
        const platformAdapter = getRuntimePlatform(runtime);
        const spawnSpec = platformAdapter.commandSpawnSpec
            ? platformAdapter.commandSpawnSpec(command, { args: commandArgs, cwd: workdir, env: args.env })
            : {
                  supported: true,
                  command,
                  args: commandArgs,
                  options: platformAdapter.shellSpawnOptions({ cwd: workdir, env: args.env })
              };
        if (!spawnSpec.supported) {
            return createErrorResult('not_supported', spawnSpec.reason || 'Command execution is not supported by this platform adapter.', {
                action: 'exec',
                command,
                args: commandArgs,
                workdir,
                platform: platformAdapter.getStatus()
            });
        }
        const outputCapture = await createExecOutputCapture({ args, context, runtime, action: 'exec', command, commandArgs, workdir });
        let child;
        try {
            child = spawn(spawnSpec.command, spawnSpec.args || [], spawnSpec.options || platformAdapter.shellSpawnOptions({
                cwd: workdir,
                env: args.env
            }));
        } catch (error) {
            const outputStore = await finalizeExecOutputCapture(outputCapture, {
                status: 'error',
                error: error?.message || String(error)
            });
            const details = attachOutputStoreDetails(annotateExecDetails({
                status: 'error',
                action: 'exec',
                command,
                args: commandArgs,
                workdir,
                exitCode: null,
                stdout: '',
                stderr: error?.message || String(error),
                durationMs: Date.now() - startedAt
            }, { command, args: commandArgs, platformAdapter }), outputStore);
            return {
                content: [{ type: 'text', text: formatExecContent(details) }],
                isError: true,
                details
            };
        }
        return await new Promise((resolve) => {
            let settled = false;
            let timedOut = false;
            let stdout = '';
            let stderr = '';
            const maxOutputBytes = normalizeNumber(args.maxOutputBytes, DEFAULT_PROCESS_BUFFER_BYTES, 1024, 5 * 1024 * 1024);
            let timer = null;
            const finish = async ({ status, exitCode = null, signal = null, error = '' } = {}) => {
                if (settled) {
                    return;
                }
                settled = true;
                if (timer) {
                    clearTimeout(timer);
                    timer = null;
                }
                const outputStore = await finalizeExecOutputCapture(outputCapture, {
                    status,
                    exitCode,
                    signal,
                    error,
                    durationMs: Date.now() - startedAt
                });
                const outputText = [stdout, stderr].filter(Boolean).join(stdout && stderr ? '\n' : '');
                const details = attachOutputStoreDetails(annotateExecDetails({
                    status,
                    action: 'exec',
                    command,
                    args: commandArgs,
                    workdir,
                    exitCode,
                    signal,
                    output: truncateByApproxTokens(outputText, maxOutputTokens),
                    stdout: truncateByApproxTokens(stdout, maxOutputTokens),
                    stderr: truncateByApproxTokens(stderr || error, maxOutputTokens),
                    durationMs: Date.now() - startedAt,
                    error
                }, { command, args: commandArgs, platformAdapter }), outputStore);
                resolve({
                    content: [{ type: 'text', text: formatExecContent(details) }],
                    isError: status !== 'completed',
                    details
                });
            };
            timer = setTimeout(() => {
                timedOut = true;
                platformAdapter.killProcessTree(child, 'SIGTERM').finally(() => {
                    finish({
                        status: 'timeout',
                        signal: 'SIGTERM',
                        error: `命令超时：${command}`
                    });
                });
            }, timeoutMs);
            child.stdout?.on('data', (chunk) => {
                stdout = appendBounded(stdout, chunk, maxOutputBytes);
                outputCapture?.append('stdout', chunk);
            });
            child.stderr?.on('data', (chunk) => {
                stderr = appendBounded(stderr, chunk, maxOutputBytes);
                outputCapture?.append('stderr', chunk);
            });
            child.on('error', (error) => {
                const message = error?.message || String(error);
                stderr = appendBounded(stderr, `\n${message}`, maxOutputBytes);
                outputCapture?.append('stderr', `\n${message}`);
                finish({
                    status: 'error',
                    error: message
                });
            });
            child.on('exit', (exitCode, signal) => {
                finish({
                    status: timedOut ? 'timeout' : exitCode === 0 ? 'completed' : 'error',
                    exitCode,
                    signal,
                    error: timedOut ? `命令超时：${command}` : ''
                });
            });
        });
    }

    async execCommand(args, context, runtime) {
        const command = normalizeString(args.cmd || args.command);
        if (!command) {
            return createErrorResult('needs_config', 'exec_command 需要 cmd 或 command 参数。');
        }
        const commandArgs = normalizeCommandArgs(args.args || args.arguments);
        const commandForDisplay = commandArgs.length ? [command, ...commandArgs].join(' ') : command;
        const workdir = resolveWorkdir(args, context, runtime);
        const guard = guardPath(workdir, 'read', context, runtime) || commandNeedsApproval({ ...args, action: 'exec_command', command: commandForDisplay }, context);
        if (guard) {
            return guard;
        }
        const yieldTimeMs = normalizeNumber(args.yield_time_ms || args.yieldTimeMs, DEFAULT_EXEC_YIELD_TIME_MS, MIN_EXEC_YIELD_TIME_MS, MAX_EXEC_YIELD_TIME_MS);
        const maxOutputTokens = normalizeNumber(args.max_output_tokens || args.maxOutputTokens, DEFAULT_EXEC_MAX_OUTPUT_TOKENS, 256, 100000);
        if (args.dryRun === true) {
            const details = {
                status: 'completed',
                action: 'exec_command',
                dryRun: true,
                command,
                cmd: command,
                args: commandArgs,
                workdir,
                yield_time_ms: yieldTimeMs,
                max_output_tokens: maxOutputTokens
            };
            return createTextResult(JSON.stringify(details, null, 2), details);
        }
        if (normalizeBoolean(args.tty, false)) {
            const ptyResult = await this.ptyStart({ ...args, command, action: 'pty_start' }, context, runtime);
            if (ptyResult.isError) {
                return ptyResult;
            }
            const record = this.ptySessions.get(ptyResult.details?.session?.id);
            if (!record) {
                return createErrorResult('session_not_found', 'exec_command PTY 会话创建后无法读取。', { action: 'exec_command' });
            }
            const details = await this.waitForPtySnapshot(record, yieldTimeMs);
            details.max_output_tokens = maxOutputTokens;
            details.output = truncateByApproxTokens(details.output, maxOutputTokens);
            details.stdout = details.output;
            return createTextResult(details.output || JSON.stringify(details, null, 2), details);
        }
        const timeoutMs = normalizeNumber(args.timeoutMs || args.timeout, DEFAULT_SESSION_TIMEOUT_MS, 1000, 24 * 60 * 60 * 1000);
        const platformAdapter = getRuntimePlatform(runtime);
        const spawnSpec = platformAdapter.commandSpawnSpec
            ? platformAdapter.commandSpawnSpec(command, { args: commandArgs, cwd: workdir, env: args.env })
            : {
                  supported: true,
                  command,
                  args: commandArgs,
                  options: platformAdapter.shellSpawnOptions({ cwd: workdir, env: args.env })
              };
        if (!spawnSpec.supported) {
            return createErrorResult('not_supported', spawnSpec.reason || 'Command execution is not supported by this platform adapter.', {
                action: 'exec_command',
                command,
                workdir,
                platform: platformAdapter.getStatus()
            });
        }
        const outputCapture = await createExecOutputCapture({ args, context, runtime, action: 'exec_command', command, commandArgs, workdir });
        let child;
        try {
            child = spawn(spawnSpec.command, spawnSpec.args || [], spawnSpec.options || platformAdapter.shellSpawnOptions({
                cwd: workdir,
                env: args.env
            }));
        } catch (error) {
            const outputStore = await finalizeExecOutputCapture(outputCapture, {
                status: 'error',
                error: error?.message || String(error)
            });
            const details = attachOutputStoreDetails(annotateExecDetails({
                status: 'error',
                action: 'exec_command',
                command,
                args: commandArgs,
                workdir,
                exitCode: null,
                stdout: '',
                stderr: error?.message || String(error)
            }, { command, args: commandArgs, platformAdapter }), outputStore);
            return {
                content: [{ type: 'text', text: formatExecContent(details) }],
                isError: true,
                details
            };
        }
        const record = this.createSessionRecord({ command, workdir, child, timeoutMs, outputCapture });
        const details = await this.waitForProcessSnapshot(record, yieldTimeMs);
        details.max_output_tokens = maxOutputTokens;
        details.output = truncateByApproxTokens(collectSessionText(record), maxOutputTokens);
        details.stdout = truncateByApproxTokens(record.stdout || '', maxOutputTokens);
        details.stderr = truncateByApproxTokens(record.stderr || '', maxOutputTokens);
        const outputStore = await summarizeRecordOutputStore(record, {
            durationMs: Math.max(0, Date.now() - record.startedAt)
        });
        const annotatedDetails = attachOutputStoreDetails(
            annotateExecDetails(details, { command, args: commandArgs, platformAdapter }),
            outputStore
        );
        return createTextResult(formatExecContent(annotatedDetails), annotatedDetails);
    }

    async sessionStart(args, context, runtime) {
        const command = normalizeString(args.command || args.cmd);
        if (!command) {
            return createErrorResult('needs_config', 'session_start 需要 command 参数。');
        }
        const commandArgs = normalizeCommandArgs(args.args || args.arguments);
        const commandForDisplay = commandArgs.length ? [command, ...commandArgs].join(' ') : command;
        const workdir = resolveWorkdir(args, context, runtime);
        const guard = guardPath(workdir, 'read', context, runtime) || commandNeedsApproval({ ...args, action: 'session_start', command: commandForDisplay }, context);
        if (guard) {
            return guard;
        }
        if (args.dryRun === true) {
            return createTextResult(JSON.stringify({ action: 'session_start', dryRun: true, command, args: commandArgs, workdir }, null, 2), {
                status: 'completed',
                action: 'session_start',
                dryRun: true,
                command,
                args: commandArgs,
                workdir
            });
        }
        const timeoutMs = normalizeNumber(args.timeoutMs || args.timeout, DEFAULT_SESSION_TIMEOUT_MS, 1000, 24 * 60 * 60 * 1000);
        const platformAdapter = getRuntimePlatform(runtime);
        const spawnSpec = platformAdapter.commandSpawnSpec
            ? platformAdapter.commandSpawnSpec(command, { args: commandArgs, cwd: workdir, env: args.env })
            : {
                  supported: true,
                  command,
                  args: commandArgs,
                  options: platformAdapter.shellSpawnOptions({ cwd: workdir, env: args.env })
              };
        if (!spawnSpec.supported) {
            return createErrorResult('not_supported', spawnSpec.reason || 'Command execution is not supported by this platform adapter.', {
                action: 'session_start',
                command,
                args: commandArgs,
                workdir,
                platform: platformAdapter.getStatus()
            });
        }
        const outputCapture = await createExecOutputCapture({ args, context, runtime, action: 'session_start', command, commandArgs, workdir });
        let child;
        try {
            child = spawn(spawnSpec.command, spawnSpec.args || [], spawnSpec.options || platformAdapter.shellSpawnOptions({
                cwd: workdir,
                env: args.env
            }));
        } catch (error) {
            const outputStore = await finalizeExecOutputCapture(outputCapture, {
                status: 'error',
                error: error?.message || String(error)
            });
            const details = attachOutputStoreDetails({
                status: 'error',
                action: 'session_start',
                command,
                args: commandArgs,
                workdir,
                error: error?.message || String(error)
            }, outputStore);
            return createErrorResult('error', error?.message || String(error), details);
        }
        const record = this.createSessionRecord({ command, workdir, child, timeoutMs, outputCapture });
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

    async writeStdin(args, context) {
        const id = normalizeString(args.session_id || args.sessionId || args.id);
        const input = typeof args.chars === 'string'
            ? args.chars
            : typeof args.input === 'string'
                ? args.input
                : '';
        const yieldTimeMs = normalizeNumber(args.yield_time_ms || args.yieldTimeMs, DEFAULT_EXEC_YIELD_TIME_MS, MIN_EXEC_YIELD_TIME_MS, MAX_EXEC_YIELD_TIME_MS);
        const maxOutputTokens = normalizeNumber(args.max_output_tokens || args.maxOutputTokens, DEFAULT_EXEC_MAX_OUTPUT_TOKENS, 256, 100000);
        if (!id) {
            return createErrorResult('needs_config', 'write_stdin 需要 session_id 或 sessionId 参数。');
        }
        const processRecord = this.sessions.get(id);
        const ptyRecord = this.ptySessions.get(id);
        if (!processRecord && !ptyRecord) {
            return createErrorResult('not_found', `没有找到 unified exec 会话：${id}`, { sessionId: id });
        }
        if (input) {
            const approval = approvalRequired('write_stdin', args, context);
            if (approval) {
                return approval;
            }
        }
        if (processRecord) {
            if (input && processRecord.status !== 'running') {
                return createErrorResult('error', `进程会话不是 running：${processRecord.status}`, { sessionId: id, status: processRecord.status });
            }
            if (input) {
                processRecord.child.stdin?.write(input);
            }
            if (input && (args.submit === true || args.enter === true)) {
                processRecord.child.stdin?.write(os.EOL);
            }
            const details = await this.waitForProcessSnapshot(processRecord, yieldTimeMs);
            details.action = 'write_stdin';
            details.max_output_tokens = maxOutputTokens;
            details.output = truncateByApproxTokens(collectSessionText(processRecord), maxOutputTokens);
            details.stdout = truncateByApproxTokens(processRecord.stdout || '', maxOutputTokens);
            details.stderr = truncateByApproxTokens(processRecord.stderr || '', maxOutputTokens);
            details.bytes_written = Buffer.byteLength(input);
            const outputStore = await summarizeRecordOutputStore(processRecord);
            const withOutputStore = attachOutputStoreDetails(details, outputStore);
            return createTextResult(formatExecContent(withOutputStore), withOutputStore);
        }
        if (input && ptyRecord.status !== 'running') {
            return createErrorResult('error', `PTY 会话不是 running：${ptyRecord.status}`, { sessionId: id, status: ptyRecord.status });
        }
        if (input) {
            ptyRecord.terminal.write(input);
        }
        if (input && (args.submit === true || args.enter === true)) {
            ptyRecord.terminal.write(os.EOL);
        }
        const details = await this.waitForPtySnapshot(ptyRecord, yieldTimeMs);
        details.action = 'write_stdin';
        details.max_output_tokens = maxOutputTokens;
        details.output = truncateByApproxTokens(collectPtyText(ptyRecord), maxOutputTokens);
        details.stdout = details.output;
        details.bytes_written = Buffer.byteLength(input);
        return createTextResult(details.output || JSON.stringify(details, null, 2), details);
    }

    async processKill(args, context) {
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
        const killed = await this.platformAdapter.killProcessTree(record.child, signal);
        record.status = record.status === 'running' ? 'killed' : record.status;
        record.updatedAt = Date.now();
        record.outputStore = await summarizeRecordOutputStore(record, {
            status: 'killed',
            signal
        });
        return createTextResult(`killed ${id}`, {
            status: 'completed',
            action: 'process_kill',
            sessionId: id,
            signal,
            platform: this.platformAdapter.getStatus(),
            kill: killed,
            outputId: record.outputStore?.outputId,
            outputStore: record.outputStore
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
                    await this.platformAdapter.killProcessTree(record.child, 'SIGTERM');
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
            'screen_screenshot',
            'mouse_move',
            'mouse_click',
            'mouse_double_click',
            'mouse_right_click',
            'mouse_drag',
            'scroll',
            'keyboard_type',
            'keyboard_press',
            'keyboard_hotkey',
            'clipboard_read',
            'clipboard_write',
            'wait',
            'acl_get',
            'acl_set',
            'watch_start',
            'watch_poll',
            'watch_list',
            'watch_stop',
            'exec',
            'exec_command',
            'write_stdin',
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
            protectedRoots: protectedRoots(runtime),
            platform: getRuntimePlatform(runtime).getStatus(),
            mutationsRequireApproval: true,
            outsideWorkspaceRequires: 'context.allowOutsideWorkspace=true',
            protectedMutationRequires: 'context.allowSystemMutation=true plus approval',
            deleteDefault: 'trash/quarantine; permanent delete requires allowPermanentDelete=true and dangerous=true',
            rollbackJournal: rollbackJournalPath(runtime),
            ptyOptional: loadNodePty().ok,
            guiInput: getRuntimePlatform(runtime).getStatus().capabilities.guiInput,
            screenCapture: getRuntimePlatform(runtime).getStatus().capabilities.screenCapture,
            clipboard: getRuntimePlatform(runtime).getStatus().capabilities.clipboard
        },
        directTools: {
            execOutputStore: {
                status: 'runtime_artifact_only_by_default',
                useWhen: 'computer.exec/exec_command/session_start returns outputId, bytes, lineCount, or previewTruncated.',
                defaultAgentBehavior: 'Use returned stdout/stderr/preview. If more evidence is needed, rerun a narrower command or write the needed data to a normal file and read that file.',
                doNotCall: 'Do not treat outputId as a filesystem path or computer action.'
            }
        }
    };
    return createTextResult(JSON.stringify(schema, null, 2), {
        status: 'completed',
        action: 'schema',
        schema
    });
}

class AILISComputerTool {
    constructor(options = {}) {
        this.runtime = new ComputerRuntime(options);
    }

    async shutdown() {
        await this.runtime.shutdown();
    }

    async execute(args = {}, context = {}, runtime = {}) {
        const action = normalizeGuiAction(args.action || args.operation || args.intent || 'schema');
        const effectiveRuntime = {
            ...runtime,
            platformAdapter: runtime.platformAdapter || this.runtime.platformAdapter
        };
        const outputStoreSurfaceError = outputStoreWrongSurfaceResult(args, action);
        if (outputStoreSurfaceError) {
            return outputStoreSurfaceError;
        }
        if (action === 'schema' || action === 'help') {
            return schemaResult(effectiveRuntime);
        }
        if (action === 'ls' || action === 'list') {
            return await actionList(args, context, effectiveRuntime);
        }
        if (action === 'tree') {
            return await actionTree(args, context, effectiveRuntime);
        }
        if (action === 'stat') {
            return await actionStat(args, context, effectiveRuntime);
        }
        if (action === 'read' || action === 'cat') {
            return await actionRead(args, context, effectiveRuntime);
        }
        if (action === 'read_binary') {
            return await actionReadBinary(args, context, effectiveRuntime);
        }
        if (action === 'write') {
            return await actionWrite(args, context, effectiveRuntime, false);
        }
        if (action === 'write_binary') {
            return await actionWriteBinary(args, context, effectiveRuntime);
        }
        if (action === 'append') {
            return await actionWrite(args, context, effectiveRuntime, true);
        }
        if (action === 'mkdir') {
            return await actionMkdir(args, context, effectiveRuntime);
        }
        if (action === 'copy' || action === 'cp') {
            return await actionCopyMove(args, context, effectiveRuntime, false);
        }
        if (action === 'move' || action === 'rename' || action === 'mv') {
            return await actionCopyMove(args, context, effectiveRuntime, true);
        }
        if (action === 'delete' || action === 'rm' || action === 'trash') {
            return await actionDelete(args, context, effectiveRuntime);
        }
        if (action === 'search' || action === 'find') {
            return await actionSearch(args, context, effectiveRuntime);
        }
        if (action === 'hash' || action === 'checksum') {
            return await actionHash(args, context, effectiveRuntime);
        }
        if (action === 'du' || action === 'disk_usage') {
            return await actionDu(args, context, effectiveRuntime);
        }
        if (action === 'wait') {
            return await actionWait(args);
        }
        if (action === 'screen_screenshot') {
            return await actionScreenScreenshot(args, context, effectiveRuntime);
        }
        if (action === 'clipboard_read') {
            return await actionClipboardRead(args, context, effectiveRuntime);
        }
        if (action === 'clipboard_write') {
            return await actionClipboardWrite(args, context, effectiveRuntime);
        }
        if (
            [
                'mouse_move',
                'mouse_click',
                'mouse_double_click',
                'mouse_right_click',
                'mouse_drag',
                'scroll',
                'keyboard_type',
                'keyboard_press',
                'keyboard_hotkey'
            ].includes(action)
        ) {
            return await actionGuiInput({ ...args, action }, context, effectiveRuntime);
        }
        if (action === 'acl_get') {
            return await actionAclGet(args, context, effectiveRuntime);
        }
        if (action === 'acl_set') {
            return await actionAclSet(args, context, effectiveRuntime);
        }
        if (action === 'watch_start') {
            return this.runtime.watchStart(args, context, effectiveRuntime);
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
            return await actionRollbackList(args, context, effectiveRuntime);
        }
        if (action === 'rollback_restore') {
            return await actionRollbackRestore(args, context, effectiveRuntime);
        }
        if (action === 'exec' || action === 'run') {
            return await this.runtime.exec({ ...args, action }, context, effectiveRuntime);
        }
        if (action === 'exec_command') {
            return await this.runtime.execCommand({ ...args, action }, context, effectiveRuntime);
        }
        if (action === 'write_stdin') {
            return await this.runtime.writeStdin({ ...args, action }, context, effectiveRuntime);
        }
        if (action === 'session_start' || action === 'spawn') {
            return await this.runtime.sessionStart({ ...args, action }, context, effectiveRuntime);
        }
        if (action === 'pty_status') {
            return this.runtime.ptyStatus();
        }
        if (action === 'pty_start') {
            return await this.runtime.ptyStart({ ...args, action }, context, effectiveRuntime);
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
            return await this.runtime.processKill(args, context);
        }
        return createErrorResult('needs_config', `不支持的 computer action：${action}`, {
            supportedActions: schemaResult(effectiveRuntime).details.schema.actions
        });
    }
}

module.exports = {
    COMPUTER_TOOL_ID,
    AILISComputerTool,
    ComputerRuntime,
    commonUserRoots,
    protectedRoots,
    resolveTargetPath,
    getRuntimePlatform
};
