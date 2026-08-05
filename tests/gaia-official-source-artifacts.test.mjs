import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import {
    writeDesktopRealSourceArtifacts
} from '../scripts/run-gaia-official.mjs';

test('official GAIA staging emits desktop-real source and gold summary artifacts', async () => {
    const outputDir = await fs.mkdtemp(path.join(os.tmpdir(), 'gaia-desktop-source-'));
    const args = {
        outputDir,
        runId: 'validation-l2-smoke',
        benchmarkName: 'gaia-official-validation-l2'
    };
    const questions = [{
        task_id: 'task-l2-1',
        question: 'A Level 2 question.',
        level: 2,
        file_name: 'attachment.pdf',
        file_path: path.join(outputDir, 'attachment.pdf')
    }];
    const artifacts = await writeDesktopRealSourceArtifacts(
        args,
        questions,
        new Map([['task-l2-1', 'Exact answer']])
    );

    const sourceRows = (await fs.readFile(artifacts.sourceJsonlPath, 'utf8'))
        .trim()
        .split(/\r?\n/)
        .map(JSON.parse);
    const summary = JSON.parse(await fs.readFile(artifacts.sourceSummaryPath, 'utf8'));

    assert.equal(sourceRows[0].task_id, 'task-l2-1');
    assert.equal(sourceRows[0].level, 2);
    assert.equal(sourceRows[0].final_answer, 'Exact answer');
    assert.equal(summary.sourceOnly, true);
    assert.equal(summary.score.per_task[0].final_answer, 'Exact answer');
});
