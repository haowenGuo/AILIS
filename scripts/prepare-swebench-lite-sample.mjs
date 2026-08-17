import fs from 'node:fs/promises';
import https from 'node:https';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const execFileAsync = promisify(execFile);

export const SWE_BENCH_DATASET = 'princeton-nlp/SWE-bench';
export const SWE_BENCH_LITE_DATASET = 'princeton-nlp/SWE-bench_Lite';
export const SWE_BENCH_PRO_DATASET = 'ScaleAI/SWE-bench_Pro';
const DATASET_FILE_PREFIXES = new Map([
    [SWE_BENCH_DATASET, 'swebench'],
    [SWE_BENCH_LITE_DATASET, 'swebench-lite'],
    [SWE_BENCH_PRO_DATASET, 'swebench-pro']
]);
const CONFIG = 'default';
const DEFAULT_SPLIT = 'test';
const DEFAULT_LIMIT = 10;
const DEFAULT_SCAN_STEP = 100;
const DEFAULT_MAX_SCAN_ROWS = 2500;

function parseArgs(argv = process.argv.slice(2)) {
    const args = {
        datasetName: SWE_BENCH_LITE_DATASET,
        split: DEFAULT_SPLIT,
        limit: DEFAULT_LIMIT,
        offset: 0,
        repo: '',
        scanStep: DEFAULT_SCAN_STEP,
        maxScanRows: DEFAULT_MAX_SCAN_ROWS,
        outputDir: path.join(projectRoot, 'evals', 'engineering')
    };
    for (let index = 0; index < argv.length; index += 1) {
        const arg = argv[index];
        if (arg === '--dataset-name') {
            args.datasetName = argv[++index] || args.datasetName;
        } else if (arg === '--split') {
            args.split = argv[++index] || args.split;
        } else if (arg === '--limit') {
            args.limit = Number(argv[++index] || args.limit);
        } else if (arg === '--offset') {
            args.offset = Number(argv[++index] || args.offset);
        } else if (arg === '--repo') {
            args.repo = argv[++index] || args.repo;
        } else if (arg === '--scan-step') {
            args.scanStep = Number(argv[++index] || args.scanStep);
        } else if (arg === '--max-scan-rows') {
            args.maxScanRows = Number(argv[++index] || args.maxScanRows);
        } else if (arg === '--output-dir') {
            args.outputDir = path.resolve(argv[++index] || args.outputDir);
        }
    }
    args.limit = Math.max(1, Math.min(Number.isFinite(args.limit) ? args.limit : DEFAULT_LIMIT, 100));
    args.offset = Math.max(0, Number.isFinite(args.offset) ? args.offset : 0);
    args.scanStep = Math.max(1, Math.min(Number.isFinite(args.scanStep) ? args.scanStep : DEFAULT_SCAN_STEP, 100));
    args.maxScanRows = Math.max(args.scanStep, Number.isFinite(args.maxScanRows) ? args.maxScanRows : DEFAULT_MAX_SCAN_ROWS);
    args.datasetName = resolveSweBenchDataset(args.datasetName);
    return args;
}

export function resolveSweBenchDataset(datasetName = SWE_BENCH_LITE_DATASET) {
    const normalized = String(datasetName || SWE_BENCH_LITE_DATASET).trim();
    if (!DATASET_FILE_PREFIXES.has(normalized)) {
        throw new Error(
            `Unsupported SWE-bench dataset: ${normalized}. ` +
            `Expected one of: ${[...DATASET_FILE_PREFIXES.keys()].join(', ')}.`
        );
    }
    return normalized;
}

export function sweBenchDatasetFilePrefix(datasetName = SWE_BENCH_LITE_DATASET) {
    return DATASET_FILE_PREFIXES.get(resolveSweBenchDataset(datasetName));
}

function fetchTextOverHttps(url, { timeoutMs = 60000 } = {}) {
    return new Promise((resolve, reject) => {
        const request = https.request(
            url,
            {
                method: 'GET',
                family: 4,
                timeout: timeoutMs,
                headers: {
                    accept: 'application/json',
                    'user-agent': 'AILIS-SWE-bench-smoke/1.0'
                }
            },
            (response) => {
                let body = '';
                response.setEncoding('utf8');
                response.on('data', (chunk) => {
                    body += chunk;
                });
                response.on('end', () => {
                    if (response.statusCode < 200 || response.statusCode >= 300) {
                        reject(new Error(`Fetch failed ${response.statusCode}: ${url}\n${body.slice(0, 400)}`));
                        return;
                    }
                    resolve(body);
                });
            }
        );
        request.on('timeout', () => {
            request.destroy(new Error(`Fetch timed out after ${timeoutMs}ms: ${url}`));
        });
        request.on('error', reject);
        request.end();
    });
}

async function fetchJsonWithPowerShell(url) {
    const { stdout } = await execFileAsync(
        'powershell',
        [
            '-NoProfile',
            '-ExecutionPolicy',
            'Bypass',
            '-Command',
            `$ProgressPreference='SilentlyContinue'; Invoke-RestMethod -Uri ${JSON.stringify(url)} | ConvertTo-Json -Depth 100`
        ],
        {
            windowsHide: true,
            maxBuffer: 50 * 1024 * 1024,
            timeout: 120000
        }
    );
    return JSON.parse(stdout);
}

async function fetchJson(url, { attempts = 3 } = {}) {
    let lastError = null;
    if (process.platform === 'win32') {
        try {
            return await fetchJsonWithPowerShell(url);
        } catch (error) {
            lastError = error;
        }
    }
    for (let attempt = 1; attempt <= attempts; attempt += 1) {
        try {
            const text = await fetchTextOverHttps(url);
            return JSON.parse(text);
        } catch (error) {
            lastError = error;
            if (attempt < attempts) {
                await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
            }
        }
    }
    if (process.platform !== 'win32') throw lastError;
    try {
        return await fetchJsonWithPowerShell(url);
    } catch (fallbackError) {
        fallbackError.cause = lastError;
        throw fallbackError;
    }
}

function safeJsonParse(value, fallback = []) {
    if (Array.isArray(value)) {
        return value;
    }
    if (!value || typeof value !== 'string') {
        return fallback;
    }
    try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : fallback;
    } catch {
        return fallback;
    }
}

export function normalizeSweBenchRow(rowEntry = {}, datasetName = SWE_BENCH_LITE_DATASET) {
    const row = rowEntry.row || rowEntry;
    const isPro = datasetName === SWE_BENCH_PRO_DATASET;
    const dockerhubTag = row.dockerhub_tag || '';
    return {
        row_idx: rowEntry.row_idx ?? null,
        dataset: datasetName,
        config: CONFIG,
        split: rowEntry.split || DEFAULT_SPLIT,
        repo: row.repo,
        instance_id: row.instance_id,
        base_commit: row.base_commit,
        problem_statement: row.problem_statement,
        hints_text: row.hints_text || '',
        test_patch: row.test_patch || '',
        patch: row.patch || '',
        fail_to_pass: isPro
            ? preserveSerializedList(row.FAIL_TO_PASS ?? row.fail_to_pass)
            : safeJsonParse(row.FAIL_TO_PASS ?? row.fail_to_pass),
        pass_to_pass: isPro
            ? preserveSerializedList(row.PASS_TO_PASS ?? row.pass_to_pass)
            : safeJsonParse(row.PASS_TO_PASS ?? row.pass_to_pass),
        version: row.version || '',
        created_at: row.created_at || '',
        environment_setup_commit: row.environment_setup_commit || '',
        ...(isPro ? {
            requirements: row.requirements || '',
            interface: row.interface || '',
            repo_language: row.repo_language || '',
            issue_specificity: row.issue_specificity || '',
            issue_categories: safeJsonParse(row.issue_categories),
            before_repo_set_cmd: row.before_repo_set_cmd || '',
            selected_test_files_to_run: preserveSerializedList(row.selected_test_files_to_run),
            dockerhub_tag: dockerhubTag,
            docker_image: dockerhubTag ? `jefzda/sweap-images:${dockerhubTag}` : ''
        } : {})
    };
}

function preserveSerializedList(value) {
    if (Array.isArray(value)) return JSON.stringify(value);
    if (typeof value !== 'string') return '[]';
    return value.trim() || '[]';
}

export async function fetchHuggingFaceDatasetRevision(datasetName) {
    const normalized = String(datasetName || '').trim();
    if (!normalized) throw new Error('Hugging Face dataset name is required.');
    const payload = await fetchJson(`https://huggingface.co/api/datasets/${normalized}`);
    return {
        dataset: normalized,
        revision: String(payload.sha || ''),
        lastModified: payload.lastModified || null
    };
}

function repoSlug(repo = '') {
    return String(repo || '')
        .trim()
        .replace(/[^a-z0-9_.-]+/gi, '-')
        .replace(/^-+|-+$/g, '')
        .toLowerCase();
}

async function fetchRowsPage({ datasetName, split, offset, length }) {
    const params = new URLSearchParams({
        dataset: datasetName,
        config: CONFIG,
        split,
        offset: String(offset),
        length: String(length)
    });
    const url = `https://datasets-server.huggingface.co/rows?${params.toString()}`;
    const payload = await fetchJson(url);
    return {
        payload,
        rows: (payload.rows || []).map((entry) =>
            normalizeSweBenchRow({ ...entry, split }, datasetName)
        )
    };
}

async function fetchRows(args) {
    if (!args.repo) {
        const rows = [];
        const scanOffsets = [];
        let totalRows = null;
        for (let offset = args.offset; rows.length < args.limit; offset += args.scanStep) {
            const length = Math.min(args.scanStep, args.limit - rows.length);
            const page = await fetchRowsPage({
                datasetName: args.datasetName,
                split: args.split,
                offset,
                length
            });
            totalRows = page.payload.num_rows_total ?? totalRows;
            scanOffsets.push(offset);
            rows.push(...page.rows);
            if (!page.rows.length || (totalRows !== null && offset + page.rows.length >= totalRows)) break;
        }
        return {
            rows,
            totalRows,
            scannedRows: rows.length,
            scanOffsets
        };
    }

    const targetRepo = args.repo.toLowerCase();
    const matchedRows = [];
    const scanOffsets = [];
    let totalRows = null;
    let scannedRows = 0;
    for (let offset = args.offset; scannedRows < args.maxScanRows; offset += args.scanStep) {
        const { payload, rows } = await fetchRowsPage({
            datasetName: args.datasetName,
            split: args.split,
            offset,
            length: args.scanStep
        });
        totalRows = payload.num_rows_total ?? totalRows;
        scanOffsets.push(offset);
        scannedRows += rows.length;
        for (const row of rows) {
            if (String(row.repo || '').toLowerCase() === targetRepo) {
                matchedRows.push(row);
                if (matchedRows.length >= args.limit) {
                    return { rows: matchedRows, totalRows, scannedRows, scanOffsets };
                }
            }
        }
        if (!rows.length || (totalRows !== null && offset + rows.length >= totalRows)) {
            break;
        }
    }
    return { rows: matchedRows, totalRows, scannedRows, scanOffsets };
}

export async function prepareSweBenchSample(options = {}) {
    const args = {
        ...parseArgs([]),
        ...options
    };
    args.datasetName = resolveSweBenchDataset(args.datasetName);
    await fs.mkdir(args.outputDir, { recursive: true });
    const { rows, totalRows, scannedRows, scanOffsets } = await fetchRows(args);
    const suffix = args.repo ? `${repoSlug(args.repo)}.sample` : 'sample';
    const filePrefix = sweBenchDatasetFilePrefix(args.datasetName);
    const jsonlPath = path.join(args.outputDir, `${filePrefix}.${args.split}.${suffix}.jsonl`);
    const summaryPath = path.join(args.outputDir, `${filePrefix}.${args.split}.${suffix}.summary.json`);
    await fs.writeFile(jsonlPath, `${rows.map((row) => JSON.stringify(row)).join('\n')}\n`, 'utf8');
    const summary = {
        ok: true,
        dataset: args.datasetName,
        config: CONFIG,
        split: args.split,
        offset: args.offset,
        repo: args.repo || null,
        requestedLimit: args.limit,
        rowCount: rows.length,
        totalRows,
        scannedRows,
        scanOffsets,
        output: jsonlPath,
        repos: [...new Set(rows.map((row) => row.repo))],
        instances: rows.map((row) => row.instance_id)
    };
    await fs.writeFile(summaryPath, `${JSON.stringify(summary, null, 2)}\n`, 'utf8');
    return {
        ...summary,
        summaryPath
    };
}

export async function prepareSweBenchLiteSample(options = {}) {
    return await prepareSweBenchSample({
        ...options,
        datasetName: SWE_BENCH_LITE_DATASET
    });
}

export async function prepareSweBenchProSample(options = {}) {
    return await prepareSweBenchSample({
        ...options,
        datasetName: SWE_BENCH_PRO_DATASET
    });
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
    const report = await prepareSweBenchSample(parseArgs());
    console.log(JSON.stringify(report, null, 2));
}
