import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const DEFAULT_JOB_DIR = path.join(PROJECT_ROOT, 'longrun', 'jobs', 'ailis-gaia-auto-optimizer');

function normalizeText(value, fallback = '') {
    if (typeof value !== 'string') {
        return fallback;
    }
    const trimmed = value.trim();
    return trimmed || fallback;
}

function parseArgs(argv = process.argv.slice(2)) {
    const args = {
        jobDir: DEFAULT_JOB_DIR,
        outputJson: '',
        outputMarkdown: ''
    };
    for (let index = 0; index < argv.length; index += 1) {
        const token = argv[index];
        const next = () => argv[++index] || '';
        if (token === '--job-dir') args.jobDir = path.resolve(next());
        else if (token === '--output-json') args.outputJson = path.resolve(next());
        else if (token === '--output-md' || token === '--output-markdown') args.outputMarkdown = path.resolve(next());
    }
    args.outputJson ||= path.join(args.jobDir, 'runtime-analysis.json');
    args.outputMarkdown ||= path.join(args.jobDir, 'runtime-analysis.md');
    return args;
}

async function readJson(filePath, fallback = null) {
    try {
        const text = await fs.readFile(filePath, 'utf8');
        return JSON.parse(text.replace(/^\uFEFF/, ''));
    } catch {
        return fallback;
    }
}

async function readJsonl(filePath) {
    const text = (await fs.readFile(filePath, 'utf8').catch(() => '')).replace(/^\uFEFF/, '');
    return text.split(/\r?\n/).filter(Boolean).map((line) => {
        try {
            return JSON.parse(line);
        } catch {
            return null;
        }
    }).filter(Boolean);
}

async function walkFiles(rootDir, predicate = () => true) {
    const found = [];
    async function walk(current) {
        const entries = await fs.readdir(current, { withFileTypes: true }).catch(() => []);
        for (const entry of entries) {
            const fullPath = path.join(current, entry.name);
            if (entry.isDirectory()) {
                await walk(fullPath);
            } else if (predicate(fullPath, entry)) {
                found.push(fullPath);
            }
        }
    }
    await walk(rootDir);
    return found;
}

function countBy(items, keyFn) {
    const counts = {};
    for (const item of items) {
        const key = normalizeText(keyFn(item), '(none)');
        counts[key] = (counts[key] || 0) + 1;
    }
    return counts;
}

function officialTaskIds(items = []) {
    return items.filter((taskId) => /^official-validation-l1-offset-\d+$/.test(normalizeText(taskId)));
}

function isPassedVerdict(verdict = {}) {
    return verdict.ok === true || (!normalizeText(verdict.failureCategory) && /^Task passed/i.test(normalizeText(verdict.summary)));
}

function isEmptyAnswer(item = {}) {
    const submitted = normalizeText(item.submitted_answer || item.submittedAnswer);
    const text = [
        submitted,
        item.status,
        item.summary,
        item.answer_gate?.status,
        item.raw_status?.status,
        item.raw_status?.error
    ].map((value) => normalizeText(value)).join(' ');
    return !submitted || /\(\s*empty\s*\)|missing_exact_answer|no submitted/i.test(text);
}

function groupTaskRuns(finalRows = []) {
    const grouped = new Map();
    for (const row of finalRows) {
        const taskId = normalizeText(row.task_id || row.taskId, 'unknown-task');
        const current = grouped.get(taskId) || {
            taskId,
            runs: 0,
            ok: 0,
            empty: 0,
            totalSteps: 0,
            maxSteps: 0,
            statuses: {}
        };
        const steps = Number(row.step_count) || 0;
        current.runs += 1;
        current.ok += row.ok === true ? 1 : 0;
        current.empty += isEmptyAnswer(row) ? 1 : 0;
        current.totalSteps += steps;
        current.maxSteps = Math.max(current.maxSteps, steps);
        const status = normalizeText(row.status || row.raw_status?.status, '(none)');
        current.statuses[status] = (current.statuses[status] || 0) + 1;
        grouped.set(taskId, current);
    }
    return [...grouped.values()].sort((a, b) => b.runs - a.runs || b.totalSteps - a.totalSteps || a.taskId.localeCompare(b.taskId));
}

async function analyzeGaiaRuntime(args = parseArgs()) {
    const state = await readJson(path.join(args.jobDir, 'state.json'), {});
    const progress = await readJson(path.join(args.jobDir, 'progress.json'), {});
    const verdictFiles = await walkFiles(path.join(args.jobDir, 'iterations'), (filePath) => path.basename(filePath) === 'verdict.json');
    const resultFiles = await walkFiles(path.join(args.jobDir, 'iterations'), (filePath) => /eval-results[\\/][^\\/]+\.jsonl$/i.test(filePath));
    const transcriptFiles = await walkFiles(path.join(args.jobDir, 'iterations'), (filePath) => /gateway-audit[\\/](.+)[\\/]transcripts[\\/].+\.jsonl$/i.test(filePath));

    const verdicts = [];
    for (const filePath of verdictFiles) {
        const verdict = await readJson(filePath, null);
        if (verdict) {
            verdicts.push({ ...verdict, path: filePath });
        }
    }

    const finalRows = [];
    for (const filePath of resultFiles) {
        const rows = await readJsonl(filePath);
        for (const row of rows) {
            if (!row.record_type || row.record_type === 'final') {
                finalRows.push({ ...row, path: filePath });
            }
        }
    }

    const transcriptStats = transcriptFiles.map((filePath) => ({
        path: filePath,
        bytes: fsSync.statSync(filePath).size
    })).sort((a, b) => b.bytes - a.bytes);

    const completedOfficial = officialTaskIds(Array.isArray(state.completedTaskIds) ? state.completedTaskIds : []);
    const failedOfficial = officialTaskIds(Array.isArray(state.failedTaskIds) ? state.failedTaskIds : []);
    const repairBacklog = Array.isArray(state.repairBacklog) ? state.repairBacklog : [];
    const taskRuns = groupTaskRuns(finalRows);
    const repeatedTasks = taskRuns.filter((item) => item.runs > 1);
    const passedVerdicts = verdicts.filter(isPassedVerdict);
    const failedVerdicts = verdicts.filter((item) => !isPassedVerdict(item));
    const emptyFinalRows = finalRows.filter(isEmptyAnswer);
    const totalTranscriptBytes = transcriptStats.reduce((sum, item) => sum + item.bytes, 0);

    const analysis = {
        generatedAt: new Date().toISOString(),
        jobDir: args.jobDir,
        state: {
            status: state.status || '',
            repairRequired: state.repairRequired === true,
            iteration: Number(state.iteration) || 0,
            officialCursor: Number(state.officialCursor) || 0,
            completedOfficial: completedOfficial.length,
            failedOfficial: failedOfficial.length,
            repairBacklog: repairBacklog.length,
            stopFlag: fsSync.existsSync(path.join(args.jobDir, 'stop.flag'))
        },
        progress: {
            status: progress.status || '',
            latestEvidence: progress.latestEvidence || '',
            nextAction: progress.nextAction || ''
        },
        score: {
            validationLevel1KnownTotal: 53,
            passedOfficial: completedOfficial.length,
            failedOfficial: failedOfficial.length,
            unattemptedOfficial: Math.max(0, 53 - completedOfficial.length - failedOfficial.length),
            passRateAllKnown: Number((completedOfficial.length / 53).toFixed(4)),
            passRateAttempted: completedOfficial.length + failedOfficial.length
                ? Number((completedOfficial.length / (completedOfficial.length + failedOfficial.length)).toFixed(4))
                : 0
        },
        verdicts: {
            total: verdicts.length,
            passed: passedVerdicts.length,
            failed: failedVerdicts.length,
            byFailureCategory: countBy(failedVerdicts, (item) => item.failureCategory),
            byOptimizationFocus: countBy(failedVerdicts, (item) => item.optimizationFocus)
        },
        resultRows: {
            finalRows: finalRows.length,
            ok: finalRows.filter((item) => item.ok === true).length,
            emptyAnswers: emptyFinalRows.length,
            totalSteps: finalRows.reduce((sum, item) => sum + (Number(item.step_count) || 0), 0),
            maxSteps: finalRows.reduce((max, item) => Math.max(max, Number(item.step_count) || 0), 0)
        },
        repeatedTasks: repeatedTasks.slice(0, 25),
        transcriptStats: {
            files: transcriptStats.length,
            totalBytes: totalTranscriptBytes,
            largest: transcriptStats.slice(0, 10)
        },
        recommendedSafetyPolicy: {
            safety: {
                enabled: true,
                maxRepairBacklog: 3,
                maxConsecutiveFailures: 2,
                maxEmptyAnswerStreak: 1,
                maxSameTaskAttempts: 1,
                recentWindow: 6,
                minRecentSample: 3,
                minRecentPassRate: 0.5,
                stopOnEnvironmentFailure: true
            },
            maxIterationsPerControllerRun: 3,
            maxAgentSteps: 12,
            taskRetries: 0,
            continueAfterFailure: false
        }
    };
    return analysis;
}

function markdownTable(rows, columns) {
    if (!rows.length) {
        return '_None._';
    }
    const header = `| ${columns.map((column) => column.label).join(' | ')} |`;
    const sep = `| ${columns.map(() => '---').join(' | ')} |`;
    const body = rows.map((row) => `| ${columns.map((column) => normalizeText(String(column.value(row)))).join(' | ')} |`);
    return [header, sep, ...body].join('\n');
}

function buildMarkdownReport(analysis) {
    const repeatedTable = markdownTable(analysis.repeatedTasks.slice(0, 12), [
        { label: 'Task', value: (row) => row.taskId },
        { label: 'Runs', value: (row) => row.runs },
        { label: 'OK', value: (row) => row.ok },
        { label: 'Empty', value: (row) => row.empty },
        { label: 'Steps', value: (row) => row.totalSteps }
    ]);
    const transcriptTable = markdownTable(analysis.transcriptStats.largest.slice(0, 8), [
        { label: 'Bytes', value: (row) => row.bytes },
        { label: 'Path', value: (row) => row.path }
    ]);
    return [
        '# AILIS GAIA Runtime Analysis',
        '',
        `Generated: ${analysis.generatedAt}`,
        '',
        '## Score Snapshot',
        '',
        `- Official validation Level 1 passed: ${analysis.score.passedOfficial}/${analysis.score.validationLevel1KnownTotal} (${(analysis.score.passRateAllKnown * 100).toFixed(1)}%)`,
        `- Attempted: ${analysis.score.passedOfficial + analysis.score.failedOfficial}/${analysis.score.validationLevel1KnownTotal}`,
        `- Failed/backlog: ${analysis.score.failedOfficial}`,
        `- Unattempted: ${analysis.score.unattemptedOfficial}`,
        `- Current status: ${analysis.state.status}`,
        `- Stop flag: ${analysis.state.stopFlag}`,
        '',
        '## Waste Signals',
        '',
        `- Final rows: ${analysis.resultRows.finalRows}`,
        `- Empty final answers: ${analysis.resultRows.emptyAnswers}`,
        `- Repeated task ids: ${analysis.repeatedTasks.length}`,
        `- Transcript audit bytes: ${analysis.transcriptStats.totalBytes}`,
        '',
        '## Repeated Tasks',
        '',
        repeatedTable,
        '',
        '## Largest Transcripts',
        '',
        transcriptTable,
        '',
        '## Recommended Safety Policy',
        '',
        '```json',
        JSON.stringify(analysis.recommendedSafetyPolicy, null, 2),
        '```',
        '',
        '## Operational Rule',
        '',
        'Do not resume paid GAIA execution until provider billing is healthy and the safety policy above is active. Resume with a tiny canary batch only.',
        ''
    ].join('\n');
}

async function main() {
    const args = parseArgs();
    const analysis = await analyzeGaiaRuntime(args);
    await fs.mkdir(path.dirname(args.outputJson), { recursive: true });
    await fs.writeFile(args.outputJson, `${JSON.stringify(analysis, null, 2)}\n`, 'utf8');
    await fs.writeFile(args.outputMarkdown, buildMarkdownReport(analysis), 'utf8');
    console.log(JSON.stringify({
        status: 'ok',
        outputJson: args.outputJson,
        outputMarkdown: args.outputMarkdown,
        score: analysis.score,
        wasteSignals: {
            finalRows: analysis.resultRows.finalRows,
            emptyAnswers: analysis.resultRows.emptyAnswers,
            repeatedTasks: analysis.repeatedTasks.length,
            transcriptBytes: analysis.transcriptStats.totalBytes
        }
    }, null, 2));
}

const isDirectRun = (() => {
    const entryPath = process.argv[1] ? path.resolve(process.argv[1]) : '';
    return Boolean(entryPath && path.resolve(fileURLToPath(import.meta.url)) === entryPath);
})();

if (isDirectRun) {
    main().catch((error) => {
        console.error(error?.stack || error?.message || String(error));
        process.exitCode = 1;
    });
}

export {
    analyzeGaiaRuntime,
    buildMarkdownReport,
    groupTaskRuns,
    isEmptyAnswer,
    parseArgs
};
