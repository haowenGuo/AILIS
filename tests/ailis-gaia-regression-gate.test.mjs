import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import {
    compareGaiaRunCohorts,
    readGaiaRun,
    renderGaiaRegressionReport
} from '../scripts/compare-ailis-gaia-runs.mjs';

async function writeRun(root, name, rows) {
    const resultPath = path.join(root, `${name}.jsonl`);
    await fs.writeFile(
        resultPath,
        `${rows.map((row) => JSON.stringify({
            record_type: 'final',
            status: row.ok ? 'visible_correct' : row.status || 'answer_candidate_mismatch',
            durationMs: row.durationMs,
            usage: { totalTokens: row.totalTokens },
            ...row
        })).join('\n')}\n`,
        'utf8'
    );
    return await readGaiaRun(resultPath);
}

test('GAIA regression gate accepts a complete non-regressing paired cohort', async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-gaia-gate-pass-'));
    const baselineRows = [
        { task_id: 'a', ok: true, durationMs: 100, totalTokens: 1000 },
        { task_id: 'b', ok: true, durationMs: 200, totalTokens: 2000 },
        { task_id: 'c', ok: false, durationMs: 300, totalTokens: 3000 }
    ];
    const candidateRows = [
        { task_id: 'a', ok: true, durationMs: 105, totalTokens: 1050 },
        { task_id: 'b', ok: true, durationMs: 205, totalTokens: 2050 },
        { task_id: 'c', ok: false, durationMs: 295, totalTokens: 2950 }
    ];
    try {
        const baselineRuns = await Promise.all([
            writeRun(root, 'baseline-1', baselineRows),
            writeRun(root, 'baseline-2', baselineRows)
        ]);
        const candidateRuns = await Promise.all([
            writeRun(root, 'candidate-1', candidateRows),
            writeRun(root, 'candidate-2', candidateRows)
        ]);
        const comparison = compareGaiaRunCohorts({
            baselineRuns,
            candidateRuns,
            thresholds: { expectedTasks: 3 }
        });

        assert.equal(comparison.pass, true, comparison.gateFailures.join('\n'));
        assert.equal(comparison.counts.severeRegressions, 0);
        assert.match(renderGaiaRegressionReport(comparison), /Gate \| PASS/);
    } finally {
        await fs.rm(root, { recursive: true, force: true });
    }
});

test('GAIA regression gate rejects stable correctness loss and extra timeouts', async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-gaia-gate-fail-'));
    const baselineRows = [
        { task_id: 'a', ok: true, durationMs: 100, totalTokens: 1000 },
        { task_id: 'b', ok: true, durationMs: 200, totalTokens: 2000 }
    ];
    const candidateRows = [
        { task_id: 'a', ok: false, status: 'timeout', durationMs: 500, totalTokens: 1500 },
        { task_id: 'b', ok: true, durationMs: 200, totalTokens: 2000 }
    ];
    try {
        const baselineRuns = await Promise.all([
            writeRun(root, 'baseline-1', baselineRows),
            writeRun(root, 'baseline-2', baselineRows)
        ]);
        const candidateRuns = await Promise.all([
            writeRun(root, 'candidate-1', candidateRows),
            writeRun(root, 'candidate-2', candidateRows)
        ]);
        const comparison = compareGaiaRunCohorts({
            baselineRuns,
            candidateRuns,
            thresholds: { expectedTasks: 2 }
        });

        assert.equal(comparison.pass, false);
        assert.equal(comparison.counts.severeRegressions, 1);
        assert.ok(comparison.gateFailures.some((failure) =>
            failure.includes('severe stable regressions')
        ));
        assert.ok(comparison.gateFailures.some((failure) =>
            failure.includes('timeout rate delta')
        ));
    } finally {
        await fs.rm(root, { recursive: true, force: true });
    }
});

test('GAIA regression gate rejects incomplete or non-identical task sets', async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-gaia-gate-shape-'));
    try {
        const baselineRuns = [
            await writeRun(root, 'baseline', [
                { task_id: 'a', ok: true, durationMs: 100, totalTokens: 1000 },
                { task_id: 'b', ok: true, durationMs: 100, totalTokens: 1000 }
            ])
        ];
        const candidateRuns = [
            await writeRun(root, 'candidate', [
                { task_id: 'a', ok: true, durationMs: 100, totalTokens: 1000 }
            ])
        ];
        const comparison = compareGaiaRunCohorts({
            baselineRuns,
            candidateRuns,
            thresholds: { expectedTasks: 2 }
        });

        assert.equal(comparison.pass, false);
        assert.ok(comparison.gateFailures.some((failure) =>
            failure.includes('at least 2 runs')
        ));
        assert.ok(comparison.gateFailures.some((failure) =>
            failure.includes('task set mismatch')
        ));
    } finally {
        await fs.rm(root, { recursive: true, force: true });
    }
});
