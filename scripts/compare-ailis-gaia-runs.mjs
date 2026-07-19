import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const DEFAULT_THRESHOLDS = Object.freeze({
    minRuns: 2,
    expectedTasks: 0,
    maxSuccessRateDrop: 0,
    maxTimeoutRateIncrease: 0,
    maxP95DurationIncrease: 0.15,
    maxMeanTokenIncrease: 0.1,
    maxSevereRegressions: 0
});

function finiteNumber(value) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
}

function quantile(values, fraction) {
    const sorted = values
        .map(finiteNumber)
        .filter((value) => value !== null)
        .sort((left, right) => left - right);
    if (!sorted.length) return 0;
    const index = Math.min(
        sorted.length - 1,
        Math.max(0, Math.ceil(sorted.length * fraction) - 1)
    );
    return sorted[index];
}

function mean(values) {
    const numeric = values
        .map(finiteNumber)
        .filter((value) => value !== null);
    if (!numeric.length) return 0;
    return numeric.reduce((total, value) => total + value, 0) / numeric.length;
}

function ratioIncrease(candidate, baseline) {
    if (baseline <= 0) return candidate <= 0 ? 0 : Number.POSITIVE_INFINITY;
    return candidate / baseline - 1;
}

function isVisibleSuccess(row = {}) {
    return row.ok === true ||
        row.status === 'visible_correct' ||
        row.visible_score?.ok === true;
}

function isTimeout(row = {}) {
    return row.status === 'timeout' ||
        row.raw_status === 'timeout' ||
        row.response_status === 'timeout';
}

function totalTokens(row = {}) {
    return finiteNumber(
        row.usage?.totalTokens ??
        row.usage?.total_tokens ??
        row.totalTokens
    );
}

export async function readGaiaRun(resultPath) {
    const resolvedPath = path.resolve(resultPath);
    const raw = await fs.readFile(resolvedPath, 'utf8');
    const parsedRows = raw
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line, index) => {
            try {
                return JSON.parse(line);
            } catch (error) {
                throw new Error(
                    `Invalid JSONL at ${resolvedPath}:${index + 1}: ${error.message}`
                );
            }
        });
    const rows = parsedRows.filter((row) =>
        row?.task_id &&
        (!row.record_type || row.record_type === 'final')
    );
    const byTask = new Map();
    for (const row of rows) {
        const taskId = String(row.task_id);
        if (byTask.has(taskId)) {
            throw new Error(`Duplicate task_id ${taskId} in ${resolvedPath}`);
        }
        byTask.set(taskId, {
            taskId,
            success: isVisibleSuccess(row),
            timeout: isTimeout(row),
            durationMs: finiteNumber(row.durationMs) || 0,
            totalTokens: totalTokens(row),
            status: String(row.status || row.raw_status || '')
        });
    }
    return {
        path: resolvedPath,
        rows: [...byTask.values()],
        byTask,
        taskIds: [...byTask.keys()].sort()
    };
}

function compareTaskSets(referenceIds, candidateIds) {
    const reference = new Set(referenceIds);
    const candidate = new Set(candidateIds);
    return {
        missing: referenceIds.filter((taskId) => !candidate.has(taskId)),
        extra: candidateIds.filter((taskId) => !reference.has(taskId))
    };
}

function summarizeCohort(runs) {
    const rows = runs.flatMap((run) => run.rows);
    return {
        runCount: runs.length,
        taskCountPerRun: runs[0]?.rows.length || 0,
        observationCount: rows.length,
        successRate: rows.length
            ? rows.filter((row) => row.success).length / rows.length
            : 0,
        timeoutRate: rows.length
            ? rows.filter((row) => row.timeout).length / rows.length
            : 0,
        p95DurationMs: quantile(rows.map((row) => row.durationMs), 0.95),
        meanDurationMs: mean(rows.map((row) => row.durationMs)),
        meanTokens: mean(rows.map((row) => row.totalTokens))
    };
}

function taskStability(runs, taskId) {
    const observations = runs
        .map((run) => run.byTask.get(taskId))
        .filter(Boolean);
    const successes = observations.filter((row) => row.success).length;
    return {
        observations: observations.length,
        successes,
        successRate: observations.length ? successes / observations.length : 0,
        timeouts: observations.filter((row) => row.timeout).length
    };
}

export function compareGaiaRunCohorts({
    baselineRuns,
    candidateRuns,
    thresholds = {}
}) {
    const policy = {
        ...DEFAULT_THRESHOLDS,
        ...thresholds
    };
    const structuralFailures = [];
    if (baselineRuns.length < policy.minRuns) {
        structuralFailures.push(
            `baseline requires at least ${policy.minRuns} runs; found ${baselineRuns.length}`
        );
    }
    if (candidateRuns.length < policy.minRuns) {
        structuralFailures.push(
            `candidate requires at least ${policy.minRuns} runs; found ${candidateRuns.length}`
        );
    }

    const referenceTaskIds = baselineRuns[0]?.taskIds || [];
    for (const [cohortName, runs] of [
        ['baseline', baselineRuns],
        ['candidate', candidateRuns]
    ]) {
        runs.forEach((run, index) => {
            if (policy.expectedTasks > 0 && run.rows.length !== policy.expectedTasks) {
                structuralFailures.push(
                    `${cohortName} run ${index + 1} has ${run.rows.length} tasks; expected ${policy.expectedTasks}`
                );
            }
            const mismatch = compareTaskSets(referenceTaskIds, run.taskIds);
            if (mismatch.missing.length || mismatch.extra.length) {
                structuralFailures.push(
                    `${cohortName} run ${index + 1} task set mismatch: ` +
                    `${mismatch.missing.length} missing, ${mismatch.extra.length} extra`
                );
            }
        });
    }

    const baseline = summarizeCohort(baselineRuns);
    const candidate = summarizeCohort(candidateRuns);
    const perTask = referenceTaskIds.map((taskId) => {
        const baselineTask = taskStability(baselineRuns, taskId);
        const candidateTask = taskStability(candidateRuns, taskId);
        return {
            taskId,
            baseline: baselineTask,
            candidate: candidateTask,
            delta: candidateTask.successRate - baselineTask.successRate,
            severeRegression:
                baselineTask.successRate === 1 &&
                candidateTask.successRate === 0,
            stableImprovement:
                baselineTask.successRate === 0 &&
                candidateTask.successRate === 1
        };
    });
    const severeRegressions = perTask.filter((task) => task.severeRegression);
    const stableImprovements = perTask.filter((task) => task.stableImprovement);
    const regressions = perTask.filter((task) => task.delta < 0);
    const improvements = perTask.filter((task) => task.delta > 0);
    const metrics = {
        successRateDelta: candidate.successRate - baseline.successRate,
        timeoutRateDelta: candidate.timeoutRate - baseline.timeoutRate,
        p95DurationIncrease: ratioIncrease(
            candidate.p95DurationMs,
            baseline.p95DurationMs
        ),
        meanTokenIncrease: ratioIncrease(
            candidate.meanTokens,
            baseline.meanTokens
        ),
        pairedTaskMeanDelta: mean(perTask.map((task) => task.delta))
    };
    const gateFailures = [...structuralFailures];
    if (metrics.successRateDelta < -policy.maxSuccessRateDrop) {
        gateFailures.push(
            `success rate delta ${metrics.successRateDelta.toFixed(4)} is below ` +
            `-${policy.maxSuccessRateDrop.toFixed(4)}`
        );
    }
    if (metrics.timeoutRateDelta > policy.maxTimeoutRateIncrease) {
        gateFailures.push(
            `timeout rate delta ${metrics.timeoutRateDelta.toFixed(4)} exceeds ` +
            policy.maxTimeoutRateIncrease.toFixed(4)
        );
    }
    if (metrics.p95DurationIncrease > policy.maxP95DurationIncrease) {
        gateFailures.push(
            `P95 duration increase ${metrics.p95DurationIncrease.toFixed(4)} exceeds ` +
            policy.maxP95DurationIncrease.toFixed(4)
        );
    }
    if (metrics.meanTokenIncrease > policy.maxMeanTokenIncrease) {
        gateFailures.push(
            `mean token increase ${metrics.meanTokenIncrease.toFixed(4)} exceeds ` +
            policy.maxMeanTokenIncrease.toFixed(4)
        );
    }
    if (severeRegressions.length > policy.maxSevereRegressions) {
        gateFailures.push(
            `${severeRegressions.length} severe stable regressions exceed ` +
            policy.maxSevereRegressions
        );
    }
    return {
        schema: 'ailis.gaia_regression_gate.v1',
        pass: gateFailures.length === 0,
        policy,
        baseline,
        candidate,
        metrics,
        taskSets: {
            referenceTaskCount: referenceTaskIds.length,
            identical: structuralFailures.every((failure) =>
                !failure.includes('task set mismatch') &&
                !failure.includes('tasks; expected')
            )
        },
        counts: {
            regressions: regressions.length,
            improvements: improvements.length,
            severeRegressions: severeRegressions.length,
            stableImprovements: stableImprovements.length
        },
        gateFailures,
        perTask
    };
}

function percent(value) {
    return `${(value * 100).toFixed(2)}%`;
}

function signedPercent(value) {
    const sign = value > 0 ? '+' : '';
    return `${sign}${(value * 100).toFixed(2)}%`;
}

export function renderGaiaRegressionReport(comparison) {
    const rows = [
        ['Gate', comparison.pass ? 'PASS' : 'FAIL'],
        ['Baseline runs', comparison.baseline.runCount],
        ['Candidate runs', comparison.candidate.runCount],
        ['Tasks per run', comparison.baseline.taskCountPerRun],
        ['Baseline success', percent(comparison.baseline.successRate)],
        ['Candidate success', percent(comparison.candidate.successRate)],
        ['Success delta', signedPercent(comparison.metrics.successRateDelta)],
        ['Timeout delta', signedPercent(comparison.metrics.timeoutRateDelta)],
        ['P95 duration increase', signedPercent(comparison.metrics.p95DurationIncrease)],
        ['Mean token increase', signedPercent(comparison.metrics.meanTokenIncrease)],
        ['Severe regressions', comparison.counts.severeRegressions],
        ['Stable improvements', comparison.counts.stableImprovements]
    ];
    const report = [
        '# AILIS GAIA Regression Gate',
        '',
        '| Metric | Value |',
        '| --- | ---: |',
        ...rows.map(([label, value]) => `| ${label} | ${value} |`),
        '',
        '## Decision',
        '',
        comparison.pass
            ? 'The candidate satisfies every configured admission gate.'
            : 'The candidate is rejected and must remain disabled.',
        ''
    ];
    if (comparison.gateFailures.length) {
        report.push(
            '## Gate Failures',
            '',
            ...comparison.gateFailures.map((failure) => `- ${failure}`),
            ''
        );
    }
    const changedTasks = comparison.perTask.filter((task) => task.delta !== 0);
    if (changedTasks.length) {
        report.push(
            '## Changed Tasks',
            '',
            '| Task | Baseline stability | Candidate stability | Delta |',
            '| --- | ---: | ---: | ---: |',
            ...changedTasks.map((task) =>
                `| \`${task.taskId}\` | ${percent(task.baseline.successRate)} | ` +
                `${percent(task.candidate.successRate)} | ${signedPercent(task.delta)} |`
            ),
            ''
        );
    }
    return `${report.join('\n')}\n`;
}

function parseListValue(target, value) {
    target.push(...String(value || '')
        .split(',')
        .map((entry) => entry.trim())
        .filter(Boolean));
}

function parseCliArgs(argv) {
    const config = {
        baseline: [],
        candidate: [],
        output: '',
        thresholds: { ...DEFAULT_THRESHOLDS }
    };
    for (let index = 0; index < argv.length; index += 1) {
        const arg = argv[index];
        const value = argv[index + 1];
        if (arg === '--baseline') {
            parseListValue(config.baseline, value);
            index += 1;
        } else if (arg === '--candidate') {
            parseListValue(config.candidate, value);
            index += 1;
        } else if (arg === '--output') {
            config.output = value;
            index += 1;
        } else if (arg === '--min-runs') {
            config.thresholds.minRuns = Number(value);
            index += 1;
        } else if (arg === '--expected-tasks') {
            config.thresholds.expectedTasks = Number(value);
            index += 1;
        } else if (arg === '--max-success-rate-drop') {
            config.thresholds.maxSuccessRateDrop = Number(value);
            index += 1;
        } else if (arg === '--max-timeout-rate-increase') {
            config.thresholds.maxTimeoutRateIncrease = Number(value);
            index += 1;
        } else if (arg === '--max-p95-duration-increase') {
            config.thresholds.maxP95DurationIncrease = Number(value);
            index += 1;
        } else if (arg === '--max-mean-token-increase') {
            config.thresholds.maxMeanTokenIncrease = Number(value);
            index += 1;
        } else if (arg === '--max-severe-regressions') {
            config.thresholds.maxSevereRegressions = Number(value);
            index += 1;
        } else {
            throw new Error(`Unknown argument: ${arg}`);
        }
    }
    if (!config.baseline.length || !config.candidate.length) {
        throw new Error(
            'Provide at least one --baseline result.jsonl and one --candidate result.jsonl.'
        );
    }
    return config;
}

async function main() {
    const config = parseCliArgs(process.argv.slice(2));
    const baselineRuns = await Promise.all(config.baseline.map(readGaiaRun));
    const candidateRuns = await Promise.all(config.candidate.map(readGaiaRun));
    const comparison = compareGaiaRunCohorts({
        baselineRuns,
        candidateRuns,
        thresholds: config.thresholds
    });
    const report = renderGaiaRegressionReport(comparison);
    if (config.output) {
        const outputPath = path.resolve(config.output);
        await fs.mkdir(path.dirname(outputPath), { recursive: true });
        await fs.writeFile(outputPath, report, 'utf8');
        await fs.writeFile(
            outputPath.replace(/\.md$/i, '.json'),
            `${JSON.stringify(comparison, null, 2)}\n`,
            'utf8'
        );
    }
    process.stdout.write(report);
    process.exitCode = comparison.pass ? 0 : 1;
}

if (import.meta.url === pathToFileURL(process.argv[1] || '').href) {
    await main();
}
