const fsp = require('fs/promises');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFile } = require('child_process');
const { promisify } = require('util');

const execFileAsync = promisify(execFile);
const ARTIFACT_IMPORT_TOOL_ID = 'artifact_import';
const DEFAULT_WORKER_TIMEOUT_MS = 120000;

function normalizeString(value, fallback = '') {
    if (typeof value !== 'string') {
        return fallback;
    }
    const trimmed = value.trim();
    return trimmed || fallback;
}

function normalizeAction(value = '', fallback = 'import') {
    return normalizeString(value, fallback).toLowerCase().replace(/[-\s]+/g, '_');
}

function normalizeNumber(value, fallback, min, max) {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) {
        return fallback;
    }
    return Math.min(Math.max(Math.round(parsed), min), max);
}

function createTextResult(text, details = {}, structuredContent = undefined) {
    return {
        content: [{ type: 'text', text }],
        isError: details.ok === false || details.status === 'failed' || details.status === 'error',
        details,
        ...(structuredContent ? { structuredContent } : {})
    };
}

function createErrorResult(code, message, details = {}) {
    return createTextResult(message, {
        status: 'failed',
        ok: false,
        code,
        message,
        ...details
    });
}

function maybePath(...parts) {
    if (parts.some((part) => !normalizeString(part))) {
        return '';
    }
    return path.join(...parts);
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

function isPathInside(rootPath, targetPath) {
    const root = path.resolve(rootPath);
    const target = path.resolve(targetPath);
    const rootComparable = process.platform === 'win32' ? root.toLowerCase() : root;
    const targetComparable = process.platform === 'win32' ? target.toLowerCase() : target;
    return targetComparable === rootComparable || targetComparable.startsWith(`${rootComparable}${path.sep}`);
}

function getAllowedRoots(runtime = {}) {
    return uniquePaths([
        runtime.workspaceDir,
        runtime.workspaceRoot,
        runtime.projectRoot,
        os.tmpdir(),
        process.env.TEMP,
        process.env.TMP,
        maybePath(os.homedir(), 'Desktop'),
        maybePath(os.homedir(), 'Documents'),
        maybePath(os.homedir(), 'Downloads')
    ]);
}

function resolveUserPath(inputPath, runtime = {}) {
    const raw = normalizeString(inputPath);
    if (!raw) {
        return '';
    }
    if (path.isAbsolute(raw)) {
        return path.resolve(raw);
    }
    const base = runtime.workspaceDir || runtime.workspaceRoot || runtime.projectRoot || process.cwd();
    return path.resolve(base, raw);
}

function inferParserId(args = {}, resolvedPath = '') {
    const explicit = normalizeString(args.parserId || args.parser_id || args.parser || args.kind);
    if (explicit) {
        return explicit.toLowerCase();
    }
    const ext = path.extname(resolvedPath).toLowerCase();
    if (['.xlsx', '.xls', '.csv', '.txt', '.tsv'].includes(ext)) {
        return 'table';
    }
    return 'table';
}

function extractJsonObject(text = '') {
    const raw = String(text || '');
    const first = raw.indexOf('{');
    const last = raw.lastIndexOf('}');
    if (first < 0 || last < first) {
        throw new Error('Worker did not return a JSON object.');
    }
    return JSON.parse(raw.slice(first, last + 1));
}

function schemaResult() {
    return createTextResult(JSON.stringify({
        tool: ARTIFACT_IMPORT_TOOL_ID,
        purpose: 'Import a local file through extracted RAGFlow-lite artifact workers and register the output as an AILIS context artifact.',
        actions: ['schema', 'import', 'table'],
        args: {
            path: 'local file path',
            parserId: 'table for xlsx/csv/txt structured tables',
            language: 'Chinese|English',
            parserConfig: 'optional object passed to the worker'
        },
        output: {
            artifactId: 'queryable context artifact id',
            next: 'use artifact_query runtime_schema/chunk_search'
        }
    }, null, 2), {
        status: 'completed',
        ok: true,
        action: 'schema'
    });
}

async function executeArtifactImportTool(args = {}, context = {}, runtime = {}) {
    const action = normalizeAction(args.action || args.operation || args.intent, 'import');
    if (action === 'schema' || action === 'help') {
        return schemaResult();
    }

    const inputPath = normalizeString(args.path || args.file || args.filePath || args.file_path || args.target);
    if (!inputPath) {
        return createErrorResult('missing_path', 'artifact_import requires path/file/filePath.', { action });
    }

    const resolvedPath = resolveUserPath(inputPath, runtime);
    const allowedRoots = getAllowedRoots(runtime);
    if (!allowedRoots.some((root) => isPathInside(root, resolvedPath))) {
        return createErrorResult('path_outside_workspace', `Refusing to import path outside allowed roots: ${resolvedPath}`, {
            action,
            path: resolvedPath,
            allowedRoots
        });
    }

    const stat = await fsp.stat(resolvedPath).catch(() => null);
    if (!stat || !stat.isFile()) {
        return createErrorResult('file_not_found', `File not found: ${resolvedPath}`, { action, path: resolvedPath });
    }

    if (!runtime.contextArtifactStore?.createArtifact) {
        return createErrorResult('artifact_store_unavailable', 'artifact_import requires runtime.contextArtifactStore.', { action });
    }

    const parserId = inferParserId(args, resolvedPath);
    if (parserId !== 'table') {
        return createErrorResult('unsupported_parser', `artifact_import currently supports parserId=table, got ${parserId}.`, {
            action,
            parserId,
            supportedParsers: ['table']
        });
    }

    const projectRoot = runtime.projectRoot || path.resolve(__dirname, '..');
    const workerPath = path.join(projectRoot, 'scripts', 'ailis-ragflow-lite-worker.py');
    if (!fs.existsSync(workerPath)) {
        return createErrorResult('worker_not_found', `RAGFlow-lite worker not found: ${workerPath}`, { action, workerPath });
    }

    const parserConfig = args.parserConfig || args.parser_config || args.config || {};
    const language = normalizeString(args.language || args.lang, 'Chinese');
    const timeoutMs = normalizeNumber(args.timeoutMs || args.timeout_ms, DEFAULT_WORKER_TIMEOUT_MS, 1000, 10 * 60 * 1000);
    const python = normalizeString(args.python || process.env.AILIS_RAGFLOW_PYTHON || process.env.PYTHON, 'python');
    const pydeps = path.join(projectRoot, 'vendor', 'ragflow-lite', 'python-deps');
    const nltkData = path.join(projectRoot, 'vendor', 'ragflow-lite', 'nltk-data');
    const workerArgs = [
        workerPath,
        'table',
        '--path',
        resolvedPath,
        '--language',
        language,
        '--parser-config-json',
        JSON.stringify(parserConfig && typeof parserConfig === 'object' ? parserConfig : {})
    ];

    let workerResult;
    let stderr = '';
    try {
        const executed = await execFileAsync(python, workerArgs, {
            cwd: projectRoot,
            timeout: timeoutMs,
            maxBuffer: 16 * 1024 * 1024,
            env: {
                ...process.env,
                AILIS_RAGFLOW_PYDEPS: pydeps,
                AILIS_RAGFLOW_NLTK_DATA: nltkData
            }
        });
        stderr = executed.stderr || '';
        workerResult = extractJsonObject(executed.stdout);
    } catch (error) {
        const stdout = error?.stdout || '';
        stderr = error?.stderr || '';
        let parsed = null;
        try {
            parsed = extractJsonObject(stdout || stderr);
        } catch {
            // Preserve original error below.
        }
        return createErrorResult('worker_failed', parsed?.error || error?.message || String(error), {
            action,
            parserId,
            path: resolvedPath,
            workerPath,
            stderr: String(stderr || '').slice(0, 4000),
            worker: parsed
        });
    }

    if (workerResult?.status !== 'ready') {
        return createErrorResult('worker_failed', workerResult?.error || `RAGFlow-lite worker returned status=${workerResult?.status}`, {
            action,
            parserId,
            path: resolvedPath,
            worker: workerResult,
            stderr: String(stderr || '').slice(0, 4000)
        });
    }

    const record = await runtime.contextArtifactStore.createArtifact({
        kind: workerResult.kind || 'artifact',
        type: `ragflow_${parserId}`,
        tool: ARTIFACT_IMPORT_TOOL_ID,
        runId: context.runId,
        sessionId: context.sessionId,
        sourcePath: resolvedPath,
        summary: `RAGFlow-lite ${parserId} import: ${path.basename(resolvedPath)} chunks=${workerResult.chunkCount || workerResult.chunks?.length || 0}`,
        payload: {
            sourcePath: resolvedPath,
            artifactImport: {
                parserId,
                language,
                parserConfig,
                workerPath,
                stderr: String(stderr || '').slice(0, 2000)
            },
            ragflowLiteRuntime: workerResult
        },
        metadata: {
            parserId,
            language,
            ragflowLite: {
                source: workerResult.source,
                chunkCount: workerResult.chunkCount || workerResult.chunks?.length || 0,
                warnings: workerResult.warnings || [],
                fieldMap: workerResult.field_map || {},
                tableColumnNames: workerResult.table_column_names || []
            }
        },
        modelView: {
            ragflowLite: {
                parserId,
                source: workerResult.source,
                chunkCount: workerResult.chunkCount || workerResult.chunks?.length || 0,
                warnings: workerResult.warnings || []
            }
        },
        queryHints: ['runtime_schema', 'chunk_search', 'runtime_search', 'summary']
    });

    const chunkCount = workerResult.chunkCount || workerResult.chunks?.length || 0;
    const warnings = Array.isArray(workerResult.warnings) ? workerResult.warnings : [];
    const lines = [
        'ARTIFACT_IMPORT_COMPLETE',
        `artifactId=${record.id}`,
        `parserId=${parserId}`,
        `source=${resolvedPath}`,
        `chunks=${chunkCount}`,
        warnings.length ? `warnings=${warnings.join(' | ')}` : 'warnings=none',
        `next=artifact_query {"artifactId":"${record.id}","action":"runtime_schema"}`,
        `next=artifact_query {"artifactId":"${record.id}","action":"chunk_search","query":"..."}`
    ];

    return createTextResult(lines.join('\n'), {
        status: 'completed',
        ok: true,
        action: 'import',
        artifactId: record.id,
        parserId,
        path: resolvedPath,
        chunkCount,
        warnings,
        workerSource: workerResult.source,
        stderr: String(stderr || '').slice(0, 2000),
        complete: true,
        truncated: false,
        reasoningReady: true
    }, {
        artifact: {
            artifactId: record.id,
            kind: record.kind,
            type: record.type,
            summary: record.summary,
            queryHints: record.queryHints
        },
        ragflowLiteRuntime: {
            source: workerResult.source,
            parserType: workerResult.parserType,
            chunkCount,
            warnings,
            fieldMap: workerResult.field_map || {},
            tableColumnNames: workerResult.table_column_names || []
        }
    });
}

module.exports = {
    ARTIFACT_IMPORT_TOOL_ID,
    executeArtifactImportTool
};
