import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const DEFAULT_OUTPUT_DIR = path.join(PROJECT_ROOT, 'eval-results', 'engineering', 'gaia-official');
const DEFAULT_DATASET_DIR = path.join(PROJECT_ROOT, 'build-cache', 'hf-datasets', 'gaia-benchmark-GAIA');
const DATASET_REPO = 'gaia-benchmark/GAIA';

function normalizeText(value, fallback = '') {
    if (typeof value === 'number' && Number.isFinite(value)) {
        return String(value);
    }
    if (typeof value !== 'string') {
        return fallback;
    }
    const trimmed = value.trim();
    return trimmed || fallback;
}

function safeFileSegment(value, fallback = 'item') {
    return normalizeText(value, fallback).replace(/[^A-Za-z0-9_.-]+/g, '_').slice(0, 180) || fallback;
}

function parseLevels(value) {
    const text = normalizeText(value, '1').toLowerCase();
    if (text === 'all') {
        return [1, 2, 3];
    }
    const levels = [...new Set(text.split(/[,+\s]+/).map((item) => Number(item)).filter((item) => [1, 2, 3].includes(item)))];
    if (!levels.length) {
        throw new Error(`Invalid --levels value: ${value}`);
    }
    return levels.sort((a, b) => a - b);
}

function parseArgs(argv = process.argv.slice(2)) {
    const now = new Date().toISOString().replace(/[:.]/g, '-');
    const args = {
        split: 'validation',
        levels: [1],
        outputDir: DEFAULT_OUTPUT_DIR,
        datasetDir: DEFAULT_DATASET_DIR,
        runId: '',
        username: 'AILIS-local-codex',
        taskIds: [],
        offset: 0,
        limit: 0,
        maxAgentSteps: 20,
        requestTimeoutMs: 300000,
        llmTimeoutMs: 120000,
        submitTimeoutMs: 120000,
        temperature: 0.2,
        taskRetries: 1,
        downloadOnly: false,
        skipDownload: false,
        localSubmit: null
    };
    for (let index = 0; index < argv.length; index += 1) {
        const token = argv[index];
        const next = () => argv[++index] || '';
        if (token === '--split') args.split = normalizeText(next(), args.split).toLowerCase();
        else if (token === '--levels') args.levels = parseLevels(next());
        else if (token === '--output-dir') args.outputDir = path.resolve(next());
        else if (token === '--dataset-dir') args.datasetDir = path.resolve(next());
        else if (token === '--run-id') args.runId = normalizeText(next(), args.runId);
        else if (token === '--username') args.username = normalizeText(next(), args.username);
        else if (token === '--task-ids') args.taskIds = next().split(/[,+\s]+/).map((item) => normalizeText(item)).filter(Boolean);
        else if (token === '--offset') args.offset = Math.max(0, Number(next()) || 0);
        else if (token === '--limit') args.limit = Math.max(0, Number(next()) || 0);
        else if (token === '--max-agent-steps') args.maxAgentSteps = Math.max(1, Math.min(Number(next()) || args.maxAgentSteps, 60));
        else if (token === '--request-timeout-ms') args.requestTimeoutMs = Math.max(30000, Number(next()) || args.requestTimeoutMs);
        else if (token === '--llm-timeout-ms') args.llmTimeoutMs = Math.max(30000, Number(next()) || args.llmTimeoutMs);
        else if (token === '--submit-timeout-ms') args.submitTimeoutMs = Math.max(1000, Number(next()) || args.submitTimeoutMs);
        else if (token === '--temperature') args.temperature = Math.min(Math.max(Number(next()) || args.temperature, 0), 2);
        else if (token === '--task-retries') {
            const parsed = Number(next());
            args.taskRetries = Math.max(0, Math.min(Number.isFinite(parsed) ? parsed : args.taskRetries, 3));
        }
        else if (token === '--download-only') args.downloadOnly = true;
        else if (token === '--skip-download') args.skipDownload = true;
        else if (token === '--local-submit') args.localSubmit = true;
        else if (token === '--no-local-submit') args.localSubmit = false;
    }
    if (!['validation', 'test'].includes(args.split)) {
        throw new Error(`Unsupported --split ${args.split}; expected validation or test.`);
    }
    const levelLabel = args.levels.join('-');
    if (!args.runId) {
        args.runId = `official-${args.split}-l${levelLabel}-${now}`;
    }
    args.outputDir = path.resolve(args.outputDir);
    args.datasetDir = path.resolve(args.datasetDir);
    args.stageFilesDir = path.join(args.outputDir, 'staged-files', args.runId);
    args.localSubmit = args.localSubmit ?? args.split === 'validation';
    args.benchmarkName = `gaia-official-${args.split}-l${levelLabel}`;
    return args;
}

function childEnv() {
    const env = { ...process.env };
    if (!env.HF_TOKEN && env.HUGGINGFACE_HUB_TOKEN) {
        env.HF_TOKEN = env.HUGGINGFACE_HUB_TOKEN;
    }
    return env;
}

function runProcess(command, args, options = {}) {
    return new Promise((resolve, reject) => {
        const child = spawn(command, args, {
            cwd: options.cwd || PROJECT_ROOT,
            env: options.env || childEnv(),
            stdio: options.stdio || ['ignore', 'pipe', 'pipe'],
            windowsHide: true
        });
        let stdout = '';
        let stderr = '';
        if (child.stdout) {
            child.stdout.on('data', (chunk) => {
                stdout += chunk.toString();
                options.onStdout?.(chunk);
            });
        }
        if (child.stderr) {
            child.stderr.on('data', (chunk) => {
                stderr += chunk.toString();
                options.onStderr?.(chunk);
            });
        }
        child.on('error', reject);
        child.on('close', (code) => {
            if (code === 0) {
                resolve({ code, stdout, stderr });
                return;
            }
            const error = new Error(`${command} ${args.join(' ')} exited ${code}: ${stderr || stdout}`);
            error.code = code;
            error.stdout = stdout;
            error.stderr = stderr;
            reject(error);
        });
    });
}

async function hasHfAuth() {
    if (process.env.HF_TOKEN || process.env.HUGGINGFACE_HUB_TOKEN) {
        return true;
    }
    try {
        await runProcess('hf', ['auth', 'whoami']);
        return true;
    } catch {
        return false;
    }
}

async function ensureHfAuth() {
    if (await hasHfAuth()) {
        return;
    }
    throw new Error([
        `${DATASET_REPO} is gated and this machine is not logged in to Hugging Face.`,
        'Run one of these first:',
        '  hf auth login',
        'or set HF_TOKEN / HUGGINGFACE_HUB_TOKEN to a token that has accepted the GAIA dataset terms.'
    ].join('\n'));
}

async function downloadHubFile(args, repoPath) {
    const localPath = path.join(args.datasetDir, ...repoPath.split('/'));
    if (args.skipDownload && fsSync.existsSync(localPath)) {
        return localPath;
    }
    if (fsSync.existsSync(localPath) && fsSync.statSync(localPath).size > 0) {
        return localPath;
    }
    await fs.mkdir(args.datasetDir, { recursive: true });
    await runProcess('hf', [
        'download',
        DATASET_REPO,
        repoPath,
        '--repo-type',
        'dataset',
        '--local-dir',
        args.datasetDir,
        '--quiet'
    ]);
    if (!fsSync.existsSync(localPath)) {
        throw new Error(`Downloaded ${repoPath}, but expected local file is missing: ${localPath}`);
    }
    return localPath;
}

function metadataRepoPath(split, level) {
    return `2023/${split}/metadata.level${level}.parquet`;
}

async function readParquetRows(metadataPaths) {
    const py = [
        'import json, sys',
        'import pandas as pd',
        'rows=[]',
        'for p in sys.argv[1:]:',
        '    df=pd.read_parquet(p)',
        '    df=df.where(pd.notnull(df), None)',
        '    records=df.to_dict(orient="records")',
        '    for r in records:',
        '        r["_metadata_path"]=p',
        '        rows.append(r)',
        'print(json.dumps(rows, ensure_ascii=False))'
    ].join('\n');
    const result = await runProcess('python', ['-c', py, ...metadataPaths]);
    return JSON.parse(result.stdout || '[]');
}

async function readRowsFromResultCache(args, reason = '') {
    const entries = await fs.readdir(args.outputDir, { withFileTypes: true }).catch(() => []);
    const files = await Promise.all(entries
        .filter((entry) => entry.isFile() && /\.(jsonl|summary\.json)$/i.test(entry.name))
        .map(async (entry) => {
            const fullPath = path.join(args.outputDir, entry.name);
            const stat = await fs.stat(fullPath).catch(() => null);
            return { name: entry.name, fullPath, mtimeMs: stat?.mtimeMs || 0 };
        }));
    files.sort((a, b) => b.mtimeMs - a.mtimeMs || a.name.localeCompare(b.name));
    const goldByTaskId = new Map();
    for (const file of files.filter((entry) => /\.summary\.json$/i.test(entry.name))) {
        const summary = JSON.parse(await fs.readFile(file.fullPath, 'utf8').catch(() => '{}') || '{}');
        for (const item of summary?.score?.per_task || []) {
            const taskId = normalizeText(item.task_id);
            const finalAnswer = normalizeText(item.final_answer);
            if (taskId && finalAnswer && !goldByTaskId.has(taskId)) {
                goldByTaskId.set(taskId, finalAnswer);
            }
        }
    }
    const rowsByTaskId = new Map();
    for (const file of files.filter((entry) => /\.jsonl$/i.test(entry.name))) {
        const lines = (await fs.readFile(file.fullPath, 'utf8').catch(() => '')).split(/\r?\n/).filter(Boolean);
        for (const line of lines) {
            let item = null;
            try {
                item = JSON.parse(line);
            } catch {
                continue;
            }
            if (item?.record_type && item.record_type !== 'final') {
                continue;
            }
            const taskId = normalizeText(item.task_id);
            const question = normalizeText(item.question);
            if (!taskId || !question || rowsByTaskId.has(taskId)) {
                continue;
            }
            rowsByTaskId.set(taskId, {
                task_id: taskId,
                question,
                level: Number(item.level) || 1,
                final_answer: goldByTaskId.get(taskId) || normalizeText(item.final_answer),
                source_file_name: normalizeText(item.file_name),
                source_file_path: normalizeText(item.file_path),
                cached_file_path: normalizeText(item.file_path),
                metadata_path: `cache:${path.basename(file.fullPath)}`
            });
        }
    }
    let rows = [...rowsByTaskId.values()];
    if (args.taskIds.length) {
        const wanted = new Set(args.taskIds);
        rows = rows.filter((row) => wanted.has(row.task_id));
    }
    if (!rows.length) {
        throw new Error(`Unable to recover GAIA rows from local result cache after parquet read failed: ${reason}`);
    }
    const offsetRows = rows.slice(args.offset);
    return args.limit ? offsetRows.slice(0, args.limit) : offsetRows;
}

function firstPresent(row, keys) {
    for (const key of keys) {
        const value = row?.[key];
        const text = normalizeText(value);
        if (text) {
            return text;
        }
    }
    return '';
}

function inferLevelFromMetadataPath(metadataPath) {
    const match = normalizeText(metadataPath).match(/metadata\.level(\d+)\.parquet/i);
    return match ? Number(match[1]) : 0;
}

function repoPathFromRow(row, split) {
    const rawFilePath = firstPresent(row, ['file_path', 'File path', 'filePath']);
    const fileName = firstPresent(row, ['file_name', 'File name', 'filename']);
    const normalized = rawFilePath.replace(/\\/g, '/').replace(/^\/+/, '');
    if (normalized.startsWith('2023/')) {
        return normalized;
    }
    if (normalized.startsWith(`${split}/`)) {
        return `2023/${normalized}`;
    }
    if (normalized && normalized.includes('/')) {
        return normalized;
    }
    if (fileName) {
        return `2023/${split}/${fileName}`;
    }
    return '';
}

function normalizeRow(row, split) {
    const taskId = firstPresent(row, ['task_id', 'Task ID', 'taskId', 'id']);
    const question = firstPresent(row, ['Question', 'question', 'Prompt', 'prompt']);
    const level = Number(firstPresent(row, ['Level', 'level'])) || inferLevelFromMetadataPath(row._metadata_path);
    const finalAnswer = firstPresent(row, ['Final answer', 'final_answer', 'answer', 'Final Answer']);
    const fileName = firstPresent(row, ['file_name', 'File name', 'filename']);
    const repoFilePath = repoPathFromRow(row, split);
    return {
        task_id: taskId,
        question,
        level,
        final_answer: finalAnswer,
        source_file_name: fileName,
        source_file_path: repoFilePath,
        metadata_path: row._metadata_path || ''
    };
}

async function loadOfficialRows(args) {
    const metadataPaths = [];
    const metadataRepoPaths = args.levels.map((level) => metadataRepoPath(args.split, level));
    const hasLocalMetadata = args.skipDownload && metadataRepoPaths.every((repoPath) => {
        const localPath = path.join(args.datasetDir, ...repoPath.split('/'));
        return fsSync.existsSync(localPath) && fsSync.statSync(localPath).size > 0;
    });
    if (!hasLocalMetadata) {
        await ensureHfAuth();
    }
    for (const repoPath of metadataRepoPaths) {
        metadataPaths.push(await downloadHubFile(args, repoPath));
    }
    let rawRows = [];
    try {
        rawRows = await readParquetRows(metadataPaths);
    } catch (error) {
        if (!args.skipDownload) {
            throw error;
        }
        console.warn(`WARNING: parquet read failed; recovering GAIA rows from local result cache. ${error?.message || String(error)}`);
        return await readRowsFromResultCache(args, error?.message || String(error));
    }
    let rows = rawRows.map((row) => normalizeRow(row, args.split))
        .filter((row) => row.task_id && row.question);
    if (args.taskIds.length) {
        const wanted = new Set(args.taskIds);
        rows = rows.filter((row) => wanted.has(row.task_id));
    }
    const offsetRows = rows.slice(args.offset);
    return args.limit ? offsetRows.slice(0, args.limit) : offsetRows;
}

async function stageQuestions(args, rows) {
    await fs.mkdir(args.stageFilesDir, { recursive: true });
    const staged = [];
    const goldByTaskId = new Map();
    const fileByName = new Map();
    for (const row of rows) {
        let stagedFileName = '';
        let stagedFilePath = '';
        if (row.source_file_path || row.source_file_name) {
            const cachedPath = normalizeText(row.cached_file_path || row.source_file_path);
            const repoPath = row.source_file_path || repoPathFromRow(row, args.split);
            const localPath = cachedPath && path.isAbsolute(cachedPath) && fsSync.existsSync(cachedPath)
                ? cachedPath
                : await downloadHubFile(args, repoPath);
            const baseName = path.basename(row.source_file_name || repoPath);
            stagedFileName = `${safeFileSegment(row.task_id)}-${safeFileSegment(baseName, 'attachment')}`;
            stagedFilePath = path.join(args.stageFilesDir, stagedFileName);
            if (!fsSync.existsSync(stagedFilePath) || fsSync.statSync(stagedFilePath).size !== fsSync.statSync(localPath).size) {
                await fs.copyFile(localPath, stagedFilePath);
            }
            fileByName.set(stagedFileName, stagedFilePath);
        }
        const question = {
            task_id: row.task_id,
            question: row.question,
            level: row.level,
            file_name: stagedFileName,
            file_path: stagedFilePath
        };
        staged.push(question);
        if (row.final_answer) {
            goldByTaskId.set(row.task_id, row.final_answer);
        }
    }
    return { questions: staged, goldByTaskId, fileByName };
}

function normalizeAnswerForScore(value) {
    return normalizeText(value)
        .replace(/\[(?:expression|action|tts|bubble|style):[^\]]+\]/gi, '')
        .replace(/^final\s*answer\s*[:：]\s*/i, '')
        .replace(/^answer\s*[:：]\s*/i, '')
        .replace(/^答案\s*(?:是|为)?\s*[:：]?\s*/i, '')
        .replace(/^the\s+answer\s+is\s+/i, '')
        .replace(/[。.!！~～\s]*(?:哦|呢|呀)$/i, '')
        .replace(/^["'“”‘’]+|["'“”‘’]+$/g, '')
        .replace(/\s+/g, ' ')
        .trim()
        .toLowerCase();
}

async function readRequestBody(request) {
    const chunks = [];
    for await (const chunk of request) {
        chunks.push(Buffer.from(chunk));
    }
    return Buffer.concat(chunks).toString('utf8');
}

function createLocalScoringServer({ args, questions, goldByTaskId, fileByName }) {
    const server = http.createServer(async (request, response) => {
        try {
            const url = new URL(request.url || '/', 'http://127.0.0.1');
            if (request.method === 'GET' && url.pathname === '/questions') {
                response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                response.end(JSON.stringify(questions.map((question) => ({
                    task_id: question.task_id,
                    question: question.question,
                    level: question.level,
                    file_name: question.file_name || ''
                }))));
                return;
            }
            if (request.method === 'POST' && url.pathname === '/submit') {
                const payload = JSON.parse(await readRequestBody(request) || '{}');
                const answers = Array.isArray(payload.answers) ? payload.answers : [];
                const perTask = answers.map((answer) => {
                    const taskId = normalizeText(answer.task_id);
                    const gold = goldByTaskId.get(taskId) || '';
                    const submitted = normalizeText(answer.submitted_answer);
                    const correct = Boolean(gold) && normalizeAnswerForScore(submitted) === normalizeAnswerForScore(gold);
                    return {
                        task_id: taskId,
                        correct,
                        submitted_answer: submitted,
                        final_answer: gold
                    };
                });
                const correctCount = perTask.filter((item) => item.correct).length;
                const totalAttempted = answers.length;
                response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                response.end(JSON.stringify({
                    username: payload.username || args.username,
                    score: totalAttempted ? Number(((correctCount / totalAttempted) * 100).toFixed(2)) : 0,
                    correct_count: correctCount,
                    total_attempted: totalAttempted,
                    message: `Local GAIA validation score: ${correctCount}/${totalAttempted}`,
                    benchmark: args.benchmarkName,
                    per_task: perTask
                }));
                return;
            }
            if (request.method === 'GET' && url.pathname.startsWith('/files/')) {
                const requested = decodeURIComponent(url.pathname.slice('/files/'.length));
                const filePath = fileByName.get(requested);
                if (!filePath || !fsSync.existsSync(filePath)) {
                    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
                    response.end('file not found');
                    return;
                }
                response.writeHead(200, { 'Content-Type': 'application/octet-stream' });
                fsSync.createReadStream(filePath).pipe(response);
                return;
            }
            response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
            response.end('not found');
        } catch (error) {
            response.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
            response.end(error?.stack || error?.message || String(error));
        }
    });
    return new Promise((resolve) => {
        server.listen(0, '127.0.0.1', () => {
            const address = server.address();
            resolve({
                server,
                baseUrl: `http://127.0.0.1:${address.port}`
            });
        });
    });
}

async function runLiteRunner(args, baseUrl) {
    const liteArgs = [
        'scripts/run-gaia-level1-lite.mjs',
        '--output-dir', args.outputDir,
        '--run-id', args.runId,
        '--scoring-api', baseUrl,
        '--file-mirror', `${baseUrl}/files`,
        '--username', args.username,
        '--max-agent-steps', String(args.maxAgentSteps),
        '--request-timeout-ms', String(args.requestTimeoutMs),
        '--llm-timeout-ms', String(args.llmTimeoutMs),
        '--submit-timeout-ms', String(args.submitTimeoutMs),
        '--temperature', String(args.temperature),
        '--task-retries', String(args.taskRetries),
        '--benchmark-name', args.benchmarkName,
        '--agent-code', `AILIS local AILIS Gateway ${args.benchmarkName} runner`
    ];
    if (/^(1|true|yes|on)$/i.test(process.env.AILIS_GAIA_DIRECT_TOOL_EXECUTOR || '')) {
        liteArgs.push('--direct-tool-executor');
    }
    if (args.localSubmit) {
        liteArgs.push('--submit');
    } else {
        liteArgs.push('--no-submit');
    }
    await runProcess('node', liteArgs, {
        cwd: PROJECT_ROOT,
        stdio: ['ignore', 'pipe', 'pipe'],
        onStdout: (chunk) => process.stdout.write(chunk),
        onStderr: (chunk) => process.stderr.write(chunk)
    });
}

async function writeDatasetManifest(args, questions, goldByTaskId) {
    const manifest = {
        benchmark: args.benchmarkName,
        dataset: DATASET_REPO,
        split: args.split,
        levels: args.levels,
        questionCount: questions.length,
        questionsWithGold: [...goldByTaskId.keys()].length,
        stagedFilesDir: args.stageFilesDir,
        outputDir: args.outputDir,
        runId: args.runId
    };
    await fs.mkdir(args.outputDir, { recursive: true });
    const manifestPath = path.join(args.outputDir, `${args.runId}.dataset-manifest.json`);
    await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
    return manifestPath;
}

async function main() {
    const args = parseArgs();
    await fs.mkdir(args.outputDir, { recursive: true });
    const rows = await loadOfficialRows(args);
    const { questions, goldByTaskId, fileByName } = await stageQuestions(args, rows);
    const manifestPath = await writeDatasetManifest(args, questions, goldByTaskId);
    console.log(JSON.stringify({
        status: 'dataset_ready',
        benchmark: args.benchmarkName,
        split: args.split,
        levels: args.levels,
        questions: questions.length,
        questionsWithGold: goldByTaskId.size,
        attachments: fileByName.size,
        manifestPath
    }, null, 2));
    if (args.downloadOnly) {
        return;
    }
    const { server, baseUrl } = await createLocalScoringServer({ args, questions, goldByTaskId, fileByName });
    try {
        await runLiteRunner(args, baseUrl);
    } finally {
        await new Promise((resolve) => server.close(resolve));
    }
}

main().catch((error) => {
    console.error(error?.stack || error?.message || String(error));
    process.exitCode = 1;
});
