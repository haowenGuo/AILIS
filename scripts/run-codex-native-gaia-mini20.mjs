import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn, execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath, pathToFileURL } from 'node:url';

const execFileAsync = promisify(execFile);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
let scoreVisibleAnswer;
const DEFAULT_MINI_ROOT = path.join(
    PROJECT_ROOT,
    'eval-results',
    'engineering',
    'gaia-desktop-real',
    'p0-p10-mini20-score-20260728'
);

function parseArgs(argv = process.argv.slice(2)) {
    const args = {
        miniRoot: DEFAULT_MINI_ROOT,
        outputDir: path.join(
            PROJECT_ROOT,
            'eval-results',
            'engineering',
            'gaia-desktop-real',
            'codex-native-mini20-gpt55m-20260728'
        ),
        model: 'gpt-5.5',
        reasoningEffort: 'medium',
        concurrency: 4,
        timeoutMs: 600_000,
        sourceJsonl: '',
        manifestPath: '',
        benchmark: 'gaia-mini-p0-p10-v2',
        expectedTasks: 20,
        scorerModule: path.join(__dirname, 'run-ailis-desktop-real-gaia-eval.mjs')
    };
    for (let index = 0; index < argv.length; index += 1) {
        const token = argv[index];
        const next = () => argv[++index] || '';
        if (token === '--mini-root') args.miniRoot = path.resolve(next());
        else if (token === '--output-dir') args.outputDir = path.resolve(next());
        else if (token === '--model') args.model = next() || args.model;
        else if (token === '--reasoning-effort') args.reasoningEffort = next() || args.reasoningEffort;
        else if (token === '--concurrency') args.concurrency = Math.max(1, Math.min(10, Number(next()) || 1));
        else if (token === '--timeout-ms') args.timeoutMs = Math.max(30_000, Number(next()) || args.timeoutMs);
        else if (token === '--source-jsonl') args.sourceJsonl = path.resolve(next());
        else if (token === '--manifest') args.manifestPath = path.resolve(next());
        else if (token === '--benchmark') args.benchmark = next() || args.benchmark;
        else if (token === '--expected-tasks') args.expectedTasks = Math.max(1, Number(next()) || args.expectedTasks);
        else if (token === '--scorer-module') args.scorerModule = path.resolve(next());
    }
    return args;
}

async function readJsonl(filePath) {
    const text = await fs.readFile(filePath, 'utf8');
    return text
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => JSON.parse(line));
}

function safeSegment(value) {
    return String(value || 'item').replace(/[^A-Za-z0-9_.-]+/g, '_').slice(0, 120);
}

function quoteToml(value) {
    return JSON.stringify(String(value));
}

function buildPrompt(task, attachmentName = '') {
    const attachment = attachmentName
        ? [
            '',
            `A task attachment is available in the workspace as: ${attachmentName}`,
            'Inspect that file with your normal generic file, image, spreadsheet, or command-line tools as needed.'
        ].join('\n')
        : '';
    return [
        'You are being evaluated as the native Codex general-purpose agent on one GAIA task.',
        'Solve the task end to end using your normal general tools. You may research the live web and run commands.',
        'Do not search local drives, repositories, prior evaluation runs, or benchmark datasets for this question or its answer.',
        'Use the task and independently gathered evidence. The task text itself is authoritative.',
        'At the end, return exactly one short line in this form: FINAL ANSWER: <answer>',
        'Do not put citations or explanation after the final-answer line.',
        attachment,
        '',
        'TASK:',
        task.question
    ].filter((line) => line !== undefined).join('\n');
}

function parseEvents(text) {
    const events = [];
    for (const rawLine of String(text || '').split(/\r?\n/)) {
        const line = rawLine.trim();
        if (!line.startsWith('{')) continue;
        try {
            events.push(JSON.parse(line));
        } catch {
            // Keep malformed output in the raw log without treating it as an event.
        }
    }
    return events;
}

function summarizeEvents(events) {
    const completed = [...events].reverse().find((event) => event.type === 'turn.completed');
    const usage = completed?.usage || {};
    const itemTypes = {};
    let errorEvents = 0;
    for (const event of events) {
        if (event.type === 'error' || event.item?.type === 'error') errorEvents += 1;
        if (event.type === 'item.completed' && event.item?.type) {
            itemTypes[event.item.type] = (itemTypes[event.item.type] || 0) + 1;
        }
    }
    const toolCalls = Object.entries(itemTypes)
        .filter(([type]) => !['agent_message', 'reasoning', 'error'].includes(type))
        .reduce((total, [, count]) => total + count, 0);
    const inputTokens = Number(usage.input_tokens || 0);
    const outputTokens = Number(usage.output_tokens || 0);
    return {
        turnCompleted: Boolean(completed),
        inputTokens,
        cachedInputTokens: Number(usage.cached_input_tokens || 0),
        outputTokens,
        reasoningTokens: Number(usage.reasoning_output_tokens || 0),
        totalTokens: inputTokens + outputTokens,
        toolCalls,
        errorEvents,
        itemTypes
    };
}

async function terminateProcessTree(child) {
    if (!child?.pid) return;
    if (process.platform === 'win32') {
        try {
            await execFileAsync('taskkill.exe', ['/PID', String(child.pid), '/T', '/F'], {
                windowsHide: true,
                timeout: 15_000
            });
            return;
        } catch {
            // Fall through to the direct child kill.
        }
    }
    try {
        child.kill('SIGKILL');
    } catch {
        // Process already exited.
    }
}

async function runCodexTask({ task, manifestTask, args, codexPath }) {
    const taskName = `${String(task.index).padStart(2, '0')}-${safeSegment(task.task_id)}`;
    const workspace = path.join(args.outputDir, 'workspaces', taskName);
    const logDir = path.join(args.outputDir, 'logs');
    await fs.mkdir(workspace, { recursive: true });
    await fs.mkdir(logDir, { recursive: true });

    let attachmentName = '';
    let attachmentPath = '';
    if (task.file_path) {
        const extension = path.extname(task.file_path);
        attachmentName = `attachment${extension}`;
        attachmentPath = path.join(workspace, attachmentName);
        await fs.copyFile(task.file_path, attachmentPath);
    }

    const stdoutPath = path.join(logDir, `${taskName}.stdout.jsonl`);
    const stderrPath = path.join(logDir, `${taskName}.stderr.log`);
    const lastMessagePath = path.join(logDir, `${taskName}.last-message.txt`);
    const prompt = buildPrompt(task, attachmentName);
    const cliArgs = [
        'exec',
        '--ephemeral',
        '--skip-git-repo-check',
        '--ignore-rules',
        '--dangerously-bypass-approvals-and-sandbox',
        '--color',
        'never',
        '--json',
        '--model',
        args.model,
        '-c',
        `model_reasoning_effort=${quoteToml(args.reasoningEffort)}`,
        '-c',
        'model_provider="ailis-chatgpt-http"',
        '-c',
        'model_providers.ailis-chatgpt-http.name="AILIS ChatGPT OAuth HTTPS"',
        '-c',
        'model_providers.ailis-chatgpt-http.base_url="https://chatgpt.com/backend-api/codex"',
        '-c',
        'model_providers.ailis-chatgpt-http.wire_api="responses"',
        '-c',
        'model_providers.ailis-chatgpt-http.requires_openai_auth=true',
        '-c',
        'model_providers.ailis-chatgpt-http.supports_websockets=false',
        '-C',
        workspace
    ];
    if (attachmentPath && /\.(png|jpe?g|gif|webp)$/i.test(attachmentPath)) {
        cliArgs.push('--image', attachmentPath);
    }
    cliArgs.push('-o', lastMessagePath, prompt);

    const startedAt = Date.now();
    const env = { ...process.env, NO_COLOR: '1' };
    delete env.CODEX_THREAD_ID;
    const child = spawn(codexPath, cliArgs, {
        cwd: workspace,
        env,
        windowsHide: true,
        stdio: ['ignore', 'pipe', 'pipe']
    });
    let stdout = '';
    let stderr = '';
    child.stdout.setEncoding('utf8');
    child.stderr.setEncoding('utf8');
    child.stdout.on('data', (chunk) => {
        stdout += chunk;
    });
    child.stderr.on('data', (chunk) => {
        stderr += chunk;
    });

    let timedOut = false;
    const timeout = setTimeout(async () => {
        timedOut = true;
        await terminateProcessTree(child);
    }, args.timeoutMs);

    const exit = await new Promise((resolve) => {
        child.once('error', (error) => resolve({ code: null, signal: null, spawnError: error.message }));
        child.once('exit', (code, signal) => resolve({ code, signal, spawnError: '' }));
    });
    clearTimeout(timeout);

    const durationMs = Date.now() - startedAt;
    const [lastMessage] = await Promise.all([
        fs.readFile(lastMessagePath, 'utf8').catch(() => '')
    ]);
    await Promise.all([
        fs.writeFile(stdoutPath, stdout),
        fs.writeFile(stderrPath, stderr)
    ]);
    const events = parseEvents(stdout);
    const eventSummary = summarizeEvents(events);
    const responseOk = !timedOut && exit.code === 0 && eventSummary.turnCompleted && Boolean(lastMessage.trim());
    const visibleScore = responseOk
        ? scoreVisibleAnswer({
            response: { displayText: lastMessage },
            gold: task.final_answer,
            question: task.question
        })
        : {
            ok: false,
            status: timedOut ? 'timeout' : 'codex_process_incomplete',
            source: '',
            answer: '',
            candidates: []
        };

    return {
        record_type: 'final',
        index: task.index,
        task_id: task.task_id,
        level: manifestTask.level,
        stratum: manifestTask.stratum,
        has_attachment: Boolean(task.file_path),
        model: args.model,
        reasoning_effort: args.reasoningEffort,
        durationMs,
        timeoutMs: args.timeoutMs,
        timedOut,
        exit,
        responseOk,
        status: visibleScore.ok ? 'visible_correct' : visibleScore.status,
        visible_score: visibleScore,
        final_response: lastMessage.trim(),
        expected_answer: task.final_answer,
        usage: {
            inputTokens: eventSummary.inputTokens,
            cachedInputTokens: eventSummary.cachedInputTokens,
            outputTokens: eventSummary.outputTokens,
            reasoningTokens: eventSummary.reasoningTokens,
            totalTokens: eventSummary.totalTokens
        },
        toolCalls: eventSummary.toolCalls,
        eventErrors: eventSummary.errorEvents,
        eventItemTypes: eventSummary.itemTypes,
        stderrBytes: Buffer.byteLength(stderr),
        stdoutPath,
        stderrPath,
        lastMessagePath,
        workspace
    };
}

function percentile(values, fraction) {
    if (!values.length) return 0;
    const sorted = [...values].sort((left, right) => left - right);
    return sorted[Math.min(sorted.length - 1, Math.ceil(sorted.length * fraction) - 1)];
}

function countBy(rows, key, value, predicate) {
    const selected = rows.filter((row) => row[key] === value);
    return {
        correct: selected.filter(predicate).length,
        total: selected.length
    };
}

function formatRatio(value) {
    return value.total ? `${value.correct}/${value.total} (${(100 * value.correct / value.total).toFixed(2)}%)` : '0/0';
}

function buildSummary(rows, args, startedAt) {
    const correct = (row) => Boolean(row.visible_score?.ok);
    const durations = rows.map((row) => row.durationMs);
    const responseOk = rows.filter((row) => row.responseOk).length;
    const totalTokens = rows.reduce((sum, row) => sum + row.usage.totalTokens, 0);
    const total = { correct: rows.filter(correct).length, total: rows.length };
    return {
        benchmark: args.benchmark,
        agent: 'native-codex-cli',
        model: args.model,
        reasoningEffort: args.reasoningEffort,
        startedAt,
        completedAt: new Date().toISOString(),
        concurrency: args.concurrency,
        timeoutMs: args.timeoutMs,
        totals: {
            tasks: rows.length,
            uniqueTaskIds: new Set(rows.map((row) => row.task_id)).size,
            visibleCorrect: total.correct,
            visibleAccuracy: total.total ? total.correct / total.total : 0,
            responseOk,
            responseOkRate: rows.length ? responseOk / rows.length : 0,
            timeouts: rows.filter((row) => row.timedOut).length,
            totalTokens,
            totalToolCalls: rows.reduce((sum, row) => sum + row.toolCalls, 0)
        },
        levels: Object.fromEntries(['L1', 'L2', 'L3'].map((level) => [
            level,
            countBy(rows, 'level', level, correct)
        ])),
        strata: Object.fromEntries(['anchor', 'hash_random'].map((stratum) => [
            stratum,
            countBy(rows, 'stratum', stratum, correct)
        ])),
        latencyMs: {
            mean: rows.length ? Math.round(durations.reduce((sum, value) => sum + value, 0) / rows.length) : 0,
            p50: percentile(durations, 0.5),
            p90: percentile(durations, 0.9),
            p95: percentile(durations, 0.95),
            max: durations.length ? Math.max(...durations) : 0
        }
    };
}

function buildReport(rows, summary) {
    const lines = [
        `# Native Codex ${summary.benchmark} Result`,
        '',
        'This is a native Codex evaluation over the immutable task manifest named below.',
        '',
        `- Agent: native Codex CLI`,
        `- Model: \`${summary.model}\``,
        `- Reasoning: \`${summary.reasoningEffort}\``,
        `- Overall: ${summary.totals.visibleCorrect}/${summary.totals.tasks} (${(summary.totals.visibleAccuracy * 100).toFixed(2)}%)`,
        `- Response OK: ${summary.totals.responseOk}/${summary.totals.tasks}`,
        `- Timeouts: ${summary.totals.timeouts}`,
        `- L1: ${formatRatio(summary.levels.L1)}`,
        `- L2: ${formatRatio(summary.levels.L2)}`,
        `- L3: ${formatRatio(summary.levels.L3)}`,
        `- Anchor: ${formatRatio(summary.strata.anchor)}`,
        `- Blind: ${formatRatio(summary.strata.hash_random)}`,
        `- Tokens: ${summary.totals.totalTokens}`,
        `- Tool calls: ${summary.totals.totalToolCalls}`,
        `- Mean latency: ${summary.latencyMs.mean} ms`,
        `- P95 latency: ${summary.latencyMs.p95} ms`,
        '',
        '| # | Level | Stratum | Correct | Response | Duration | Tokens | Final response |',
        '|---:|:---:|:---|:---:|:---:|---:|---:|:---|'
    ];
    for (const row of rows) {
        const response = row.final_response.replace(/\s+/g, ' ').replace(/\|/g, '\\|').slice(0, 160);
        lines.push(
            `| ${row.index} | ${row.level} | ${row.stratum} | ${row.visible_score.ok ? 'yes' : 'no'} | ${row.responseOk ? 'OK' : row.status} | ${row.durationMs} | ${row.usage.totalTokens} | ${response} |`
        );
    }
    return `${lines.join('\n')}\n`;
}

async function main() {
    const args = parseArgs();
    ({ scoreVisibleAnswer } = await import(pathToFileURL(args.scorerModule).href));
    if (typeof scoreVisibleAnswer !== 'function') {
        throw new Error(`scoreVisibleAnswer was not exported by ${args.scorerModule}`);
    }
    const sourcePath = args.sourceJsonl || path.join(args.miniRoot, 'gaia-mini-p0-p10-v2.source.jsonl');
    const manifestPath = args.manifestPath || path.join(args.miniRoot, 'sample-manifest.json');
    const [tasks, manifest] = await Promise.all([
        readJsonl(sourcePath),
        fs.readFile(manifestPath, 'utf8').then(JSON.parse)
    ]);
    if (tasks.length !== args.expectedTasks || manifest.tasks.length !== args.expectedTasks) {
        throw new Error(
            `Expected the immutable ${args.expectedTasks}-task set, got source=${tasks.length}, manifest=${manifest.tasks.length}.`
        );
    }
    if (new Set(tasks.map((task) => task.task_id)).size !== args.expectedTasks) {
        throw new Error(`The source does not contain ${args.expectedTasks} unique task IDs.`);
    }
    const manifestByTaskId = new Map(manifest.tasks.map((task) => [task.task_id, task]));
    for (const task of tasks) {
        if (!manifestByTaskId.has(task.task_id)) {
            throw new Error(`Task ${task.task_id} is missing from the sample manifest.`);
        }
        if (task.file_path && !fsSync.existsSync(task.file_path)) {
            throw new Error(`Attachment is missing for task ${task.task_id}: ${task.file_path}`);
        }
    }

    if (fsSync.existsSync(path.join(args.outputDir, 'results.jsonl'))) {
        throw new Error(`Refusing to overwrite an existing completed/partial run: ${args.outputDir}`);
    }
    await fs.mkdir(args.outputDir, { recursive: true });
    const codexPath = process.env.CODEX_CLI_PATH || (process.platform === 'win32' ? 'codex.cmd' : 'codex');
    const startedAt = new Date().toISOString();
    await fs.writeFile(path.join(args.outputDir, 'run-config.json'), `${JSON.stringify({
        benchmark: args.benchmark,
        sourceJsonl: sourcePath,
        sourceManifest: manifestPath,
        taskCount: tasks.length,
        model: args.model,
        reasoningEffort: args.reasoningEffort,
        concurrency: args.concurrency,
        timeoutMs: args.timeoutMs,
        codexPath,
        startedAt,
        scoring: 'AILIS desktop-real scoreVisibleAnswer',
        scorerModule: args.scorerModule,
        localDataPolicy: 'Only the per-task attachment is copied into each workspace.'
    }, null, 2)}\n`);

    const queue = [...tasks];
    const rows = [];
    async function worker(workerIndex) {
        while (queue.length) {
            const task = queue.shift();
            if (!task) return;
            const manifestTask = manifestByTaskId.get(task.task_id);
            process.stdout.write(
                `[worker ${workerIndex}] start ${task.index}/${tasks.length - 1} ${task.task_id} ${manifestTask.level}\n`
            );
            const row = await runCodexTask({ task, manifestTask, args, codexPath });
            rows.push(row);
            await fs.appendFile(path.join(args.outputDir, 'progress.jsonl'), `${JSON.stringify({
                ts: new Date().toISOString(),
                index: row.index,
                task_id: row.task_id,
                level: row.level,
                status: row.status,
                responseOk: row.responseOk,
                visibleCorrect: row.visible_score.ok,
                durationMs: row.durationMs,
                totalTokens: row.usage.totalTokens
            })}\n`);
            process.stdout.write(
                `[worker ${workerIndex}] done ${task.index}/${tasks.length - 1} status=${row.status} correct=${row.visible_score.ok} durationMs=${row.durationMs}\n`
            );
        }
    }
    await Promise.all(Array.from(
        { length: Math.min(args.concurrency, tasks.length) },
        (_, index) => worker(index + 1)
    ));

    rows.sort((left, right) => left.index - right.index);
    const summary = buildSummary(rows, args, startedAt);
    await Promise.all([
        fs.writeFile(path.join(args.outputDir, 'results.jsonl'), rows.map((row) => JSON.stringify(row)).join('\n') + '\n'),
        fs.writeFile(path.join(args.outputDir, 'summary.json'), `${JSON.stringify(summary, null, 2)}\n`),
        fs.writeFile(path.join(args.outputDir, 'report.md'), buildReport(rows, summary))
    ]);
    process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
}

main().catch((error) => {
    console.error(error?.stack || error?.message || String(error));
    process.exitCode = 1;
});
