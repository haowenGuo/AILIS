import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const OUTPUT_DIR = path.join(PROJECT_ROOT, 'evals', 'core-smoke');
const BENCHMARK_ROOT = path.join(PROJECT_ROOT, 'build-cache', 'benchmarks');
const HF_DATASET_ROOT = path.join(PROJECT_ROOT, 'build-cache', 'hf-datasets');

const REQUESTED_COUNTS = Object.freeze({
    gaia: 10,
    terminalBench: 10,
    locomoSamples: 2,
    locomoQaPerSample: 20
});

const TERMINAL_BENCH_TASK_IDS = Object.freeze([
    'hello-world',
    'csv-to-parquet',
    'fix-git',
    'heterogeneous-dates',
    'analyze-access-logs',
    'jsonl-aggregator',
    'log-summary',
    'broken-python',
    'fix-permissions',
    'extract-safely'
]);

function normalizeText(value, fallback = '') {
    if (typeof value === 'number' && Number.isFinite(value)) return String(value);
    if (typeof value !== 'string') return fallback;
    const trimmed = value.trim();
    return trimmed || fallback;
}

function roughTokens(value) {
    const text = typeof value === 'string' ? value : JSON.stringify(value ?? '');
    return Math.ceil(text.length / 3.5);
}

async function pathExists(target) {
    try {
        await fs.access(target);
        return true;
    } catch {
        return false;
    }
}

async function readJson(target, fallback = null) {
    try {
        return JSON.parse(await fs.readFile(target, 'utf8'));
    } catch {
        return fallback;
    }
}

async function writeJson(target, value) {
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.writeFile(target, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function runProcess(command, args, options = {}) {
    return new Promise((resolve) => {
        const child = spawn(command, args, {
            cwd: options.cwd || PROJECT_ROOT,
            env: { ...process.env, ...(options.env || {}) },
            stdio: ['ignore', 'pipe', 'pipe'],
            windowsHide: true
        });
        let stdout = '';
        let stderr = '';
        const limit = options.captureLimit || 20000;
        const append = (current, chunk) => {
            const next = current + chunk.toString();
            return next.length > limit ? next.slice(-limit) : next;
        };
        child.stdout?.on('data', (chunk) => { stdout = append(stdout, chunk); });
        child.stderr?.on('data', (chunk) => { stderr = append(stderr, chunk); });
        child.on('error', (error) => resolve({ code: -1, stdout, stderr, error: error.message }));
        child.on('close', (code) => resolve({ code, stdout, stderr }));
    });
}

function uniqueExistingPaths(paths) {
    const seen = new Set();
    return paths
        .map((item) => path.resolve(item))
        .filter((item) => {
            const key = item.toLowerCase();
            if (seen.has(key) || !fsSync.existsSync(item)) return false;
            seen.add(key);
            return true;
        });
}

function gaiaHistoryDirs() {
    const driveRoot = path.parse(PROJECT_ROOT).root;
    return uniqueExistingPaths([
        path.join(PROJECT_ROOT, 'eval-results', 'engineering', 'gaia-level1-lite-public'),
        path.join(driveRoot, 'AIGril', 'eval-results', 'engineering', 'gaia-level1-lite-public'),
        path.join(driveRoot, 'AIGril', 'AIGrilClaw', 'eval-results', 'engineering', 'gaia-level1-lite-public'),
        path.join(driveRoot, 'AIGril_self_evolution_runtime', 'eval-results', 'engineering', 'gaia-level1-lite-public')
    ]);
}

function dedentBlock(block) {
    const lines = String(block || '').replace(/\r\n/g, '\n').split('\n');
    const nonEmpty = lines.filter((line) => line.trim());
    const indent = nonEmpty.length
        ? Math.min(...nonEmpty.map((line) => line.match(/^\s*/)?.[0]?.length ?? 0))
        : 0;
    return lines.map((line) => line.slice(indent)).join('\n').trim();
}

function yamlScalar(text, field) {
    const match = String(text || '').match(new RegExp(`^${field}:\\s*(.*)$`, 'm'));
    return normalizeText(match?.[1] || '').replace(/^['"]|['"]$/g, '');
}

function yamlBlock(text, field) {
    const lines = String(text || '').replace(/\r\n/g, '\n').split('\n');
    const startIndex = lines.findIndex((line) => new RegExp(`^${field}:\\s*(?:\\|-?|>)?\\s*$`).test(line));
    if (startIndex < 0) return '';
    const body = [];
    for (let index = startIndex + 1; index < lines.length; index += 1) {
        const line = lines[index];
        if (/^[A-Za-z_][A-Za-z0-9_ -]*:\s*/.test(line)) break;
        body.push(line);
    }
    return dedentBlock(body.join('\n'));
}

function yamlList(text, field) {
    const pattern = new RegExp(`^${field}:\\s*\\r?\\n([\\s\\S]*?)(?=\\r?\\n[a-zA-Z_][A-Za-z0-9_ -]*:\\s|$)`, 'm');
    const match = String(text || '').match(pattern);
    if (!match) return [];
    return match[1]
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line.startsWith('- '))
        .map((line) => line.slice(2).trim())
        .filter(Boolean);
}

async function collectGaia() {
    const officialDir = path.join(HF_DATASET_ROOT, 'gaia-benchmark-GAIA');
    const level1Path = path.join(officialDir, '2023', 'validation', 'metadata.level1.parquet');
    if (await pathExists(level1Path)) {
        const py = [
            'import json, sys',
            'import pandas as pd',
            'rows=[]',
            'for p in sys.argv[1:]:',
            '    df=pd.read_parquet(p).where(pd.notnull(pd.read_parquet(p)), None)',
            '    for r in df.head(10).to_dict(orient="records"):',
            '        rows.append(r)',
            'print(json.dumps(rows, ensure_ascii=False))'
        ].join('\n');
        const result = await runProcess('python', ['-c', py, level1Path], { captureLimit: 100000 });
        if (result.code === 0) {
            const rows = JSON.parse(result.stdout || '[]').slice(0, REQUESTED_COUNTS.gaia).map((row, index) => ({
                benchmark: 'gaia',
                smokeId: `gaia-${String(index + 1).padStart(2, '0')}`,
                source: 'official_gaia_validation_level1',
                taskId: normalizeText(row.task_id || row.Task || row.id || row.question_id, `gaia-${index + 1}`),
                question: normalizeText(row.Question || row.question || row.prompt),
                fileName: normalizeText(row.file_name || row.fileName),
                level: Number(row.Level || row.level || 1),
                raw: row
            }));
            return {
                status: rows.length >= REQUESTED_COUNTS.gaia ? 'ready' : 'partial',
                requested: REQUESTED_COUNTS.gaia,
                available: rows.length,
                sourcePath: level1Path,
                tasks: rows
            };
        }
        return {
            status: 'blocked_reader_error',
            requested: REQUESTED_COUNTS.gaia,
            available: 0,
            sourcePath: level1Path,
            error: normalizeText(result.stderr || result.stdout || result.error, 'Failed to read GAIA parquet.')
        };
    }

    const historyDirs = gaiaHistoryDirs();
    const files = historyDirs.flatMap((historyDir) => (
        fsSync.readdirSync(historyDir)
            .filter((name) => name.endsWith('.jsonl'))
            .map((name) => path.join(historyDir, name))
    )).sort((left, right) => {
        const leftScore = fsSync.statSync(left).mtimeMs + (path.basename(left).startsWith('full-20') ? 10_000_000_000 : 0);
        const rightScore = fsSync.statSync(right).mtimeMs + (path.basename(right).startsWith('full-20') ? 10_000_000_000 : 0);
        return rightScore - leftScore;
    });
    const seen = new Set();
    const tasks = [];
    for (const file of files) {
        const lines = (await fs.readFile(file, 'utf8').catch(() => '')).split(/\r?\n/).filter(Boolean);
        for (const line of lines) {
            const row = JSON.parse(line);
            const question = normalizeText(row.question);
            const taskId = normalizeText(row.task_id);
            if (!question || seen.has(taskId || question)) continue;
            seen.add(taskId || question);
            tasks.push({
                benchmark: 'gaia',
                smokeId: `gaia-history-${String(tasks.length + 1).padStart(2, '0')}`,
                source: 'local_history_fallback',
                taskId,
                question,
                fileName: normalizeText(row.file_name),
                historicalStatus: normalizeText(row.status),
                historicalSteps: Number(row.step_count || 0),
                historicalDurationMs: Number(row.durationMs || 0),
                sourcePath: file
            });
            if (tasks.length >= REQUESTED_COUNTS.gaia) break;
        }
        if (tasks.length >= REQUESTED_COUNTS.gaia) break;
    }
    if (tasks.length >= REQUESTED_COUNTS.gaia) {
        return {
            status: 'ready_from_local_history',
            requested: REQUESTED_COUNTS.gaia,
            available: tasks.length,
            sourcePath: officialDir,
            fallbackSources: historyDirs,
            note: 'Official GAIA parquet is not cached, but local GAIA-lite history has enough real task records for low-cost smoke.',
            tasks
        };
    }
    return {
        status: 'blocked_auth_required',
        requested: REQUESTED_COUNTS.gaia,
        available: tasks.length,
        sourcePath: officialDir,
        fallbackSources: historyDirs,
        note: 'Official GAIA is gated and not cached. These are local historical GAIA-lite examples only; run hf auth login and pnpm bench:core:prepare to prepare official 10.',
        tasks
    };
}

async function collectTerminalBench() {
    const root = path.join(BENCHMARK_ROOT, 'terminal-bench', 'original-tasks');
    const tasks = [];
    for (const taskId of TERMINAL_BENCH_TASK_IDS) {
        const taskDir = path.join(root, taskId);
        const taskYamlPath = path.join(taskDir, 'task.yaml');
        if (!await pathExists(taskYamlPath)) continue;
        const text = await fs.readFile(taskYamlPath, 'utf8');
        tasks.push({
            benchmark: 'terminal-bench',
            smokeId: `terminal-${String(tasks.length + 1).padStart(2, '0')}`,
            taskId,
            sourcePath: taskYamlPath,
            taskDir,
            difficulty: yamlScalar(text, 'difficulty') || 'easy',
            category: yamlScalar(text, 'category'),
            tags: yamlList(text, 'tags'),
            parserName: yamlScalar(text, 'parser_name'),
            maxAgentTimeoutSec: Number(yamlScalar(text, 'max_agent_timeout_sec') || 0),
            instruction: yamlBlock(text, 'instruction'),
            estimatedBudget: {
                maxAgentSteps: 8,
                maxInputTokens: 80000,
                maxOutputTokens: 8000
            }
        });
    }
    return {
        status: tasks.length === REQUESTED_COUNTS.terminalBench ? 'ready' : 'partial',
        requested: REQUESTED_COUNTS.terminalBench,
        available: tasks.length,
        sourcePath: root,
        tasks
    };
}

async function collectLoCoMo() {
    const sourcePath = path.join(BENCHMARK_ROOT, 'locomo', 'data', 'locomo10.json');
    const rows = await readJson(sourcePath, []);
    const samples = rows.slice(0, REQUESTED_COUNTS.locomoSamples).map((sample, sampleIndex) => {
        const conversation = sample.conversation || {};
        const qa = Array.isArray(sample.qa) ? sample.qa : [];
        const selectedQa = qa.slice(0, REQUESTED_COUNTS.locomoQaPerSample).map((item, qaIndex) => ({
            smokeId: `locomo-${String(sampleIndex + 1).padStart(2, '0')}-qa-${String(qaIndex + 1).padStart(2, '0')}`,
            question: normalizeText(item.question),
            answer: item.answer,
            evidence: item.evidence || [],
            category: item.category
        }));
        return {
            benchmark: 'locomo',
            sampleId: normalizeText(sample.sample_id, `locomo-sample-${sampleIndex + 1}`),
            sourcePath,
            speakers: {
                speakerA: normalizeText(conversation.speaker_a),
                speakerB: normalizeText(conversation.speaker_b)
            },
            contextStats: {
                chars: JSON.stringify(sample).length,
                roughTokens: roughTokens(sample),
                qaCount: qa.length,
                selectedQaCount: selectedQa.length
            },
            evaluationMode: 'Load this sample into Raw Memory Ledger/artifact memory once, then answer selected QA. Do not stuff full sample into every QA prompt.',
            selectedQa
        };
    });
    return {
        status: samples.length === REQUESTED_COUNTS.locomoSamples ? 'ready' : 'partial',
        requestedSamples: REQUESTED_COUNTS.locomoSamples,
        requestedQaPerSample: REQUESTED_COUNTS.locomoQaPerSample,
        availableSamples: samples.length,
        availableQa: samples.reduce((sum, sample) => sum + sample.selectedQa.length, 0),
        sourcePath,
        samples
    };
}

function summarizeCosts(collections) {
    const lowCostPlan = {
        model: 'deepseek-v4-flash',
        pricingReference: {
            inputCacheMissUsdPerMillion: 0.14,
            outputUsdPerMillion: 0.28
        },
        intendedUse: 'Smoke only. Stop on repeated loop failures; do not use full benchmark budgets until adapters are stable.',
        roughUpperBounds: {
            gaia10: { inputTokens: 800000, outputTokens: 80000 },
            terminalBench10: { inputTokens: 800000, outputTokens: 80000 },
            locomo40Qa: { inputTokens: 800000, outputTokens: 80000 }
        }
    };
    const totals = Object.values(lowCostPlan.roughUpperBounds).reduce((acc, item) => {
        acc.inputTokens += item.inputTokens;
        acc.outputTokens += item.outputTokens;
        return acc;
    }, { inputTokens: 0, outputTokens: 0 });
    lowCostPlan.totalRoughUpperBound = {
        ...totals,
        usdNoCache: Number(((totals.inputTokens / 1_000_000) * 0.14 + (totals.outputTokens / 1_000_000) * 0.28).toFixed(3))
    };
    lowCostPlan.availableTaskCounts = {
        gaia: collections.gaia.tasks.length,
        terminalBench: collections.terminalBench.tasks.length,
        locomoQa: collections.locomo.availableQa
    };
    return lowCostPlan;
}

async function main() {
    const collections = {
        gaia: await collectGaia(),
        terminalBench: await collectTerminalBench(),
        locomo: await collectLoCoMo()
    };

    await fs.mkdir(OUTPUT_DIR, { recursive: true });
    await writeJson(path.join(OUTPUT_DIR, 'gaia-10.json'), collections.gaia);
    await writeJson(path.join(OUTPUT_DIR, 'terminal-bench-10.json'), collections.terminalBench);
    await writeJson(path.join(OUTPUT_DIR, 'locomo-2x20qa.json'), collections.locomo);

    const manifest = {
        version: 1,
        updatedAt: new Date().toISOString(),
        outputDir: OUTPUT_DIR,
        requestedCounts: REQUESTED_COUNTS,
        files: {
            gaia: path.join(OUTPUT_DIR, 'gaia-10.json'),
            terminalBench: path.join(OUTPUT_DIR, 'terminal-bench-10.json'),
            locomo: path.join(OUTPUT_DIR, 'locomo-2x20qa.json')
        },
        statuses: Object.fromEntries(Object.entries(collections).map(([key, value]) => [key, value.status])),
        counts: {
            gaia: collections.gaia.tasks.length,
            terminalBench: collections.terminalBench.tasks.length,
            locomoSamples: collections.locomo.availableSamples,
            locomoQa: collections.locomo.availableQa
        },
        costPlan: summarizeCosts(collections)
    };
    await writeJson(path.join(OUTPUT_DIR, 'manifest.json'), manifest);
    console.log(JSON.stringify({
        ok: true,
        outputDir: OUTPUT_DIR,
        statuses: manifest.statuses,
        counts: manifest.counts,
        roughNoCacheUsdUpperBound: manifest.costPlan.totalRoughUpperBound.usdNoCache
    }, null, 2));
}

main().catch((error) => {
    console.error(error?.stack || error?.message || String(error));
    process.exit(1);
});
