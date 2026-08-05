import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';

const campaignRoot = process.argv[2]
    ? path.resolve(process.argv[2])
    : 'F:\\AILIS_self_evolution_runtime\\eval-results\\engineering\\gaia-desktop-real\\p1-vs-codex-validation165-20260728';
const expectedTasks = 165;

function readJsonl(filePath) {
    return fs.readFileSync(filePath, 'utf8')
        .replace(/^\uFEFF/, '')
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => JSON.parse(line));
}

function percentile(values, fraction) {
    if (!values.length) return 0;
    const sorted = [...values].sort((left, right) => left - right);
    return sorted[Math.min(sorted.length - 1, Math.ceil(sorted.length * fraction) - 1)];
}

function tokenCount(row) {
    return Number(row.usage?.totalTokens || row.usage?.total_tokens || 0);
}

function responseOk(row) {
    return row.responseOk === true || row.response_ok === true;
}

function timedOut(row) {
    return row.timedOut === true || /timeout/i.test(String(row.status || row.raw_status || ''));
}

function levelOf(row, manifestById) {
    return manifestById.get(row.task_id)?.level || (
        Number(row.level) ? `L${Number(row.level)}` : String(row.level || '')
    );
}

function summarize(agent, rows, manifestById) {
    const durations = rows.map((row) => Number(row.durationMs || 0));
    const correct = rows.filter((row) => row.visible_score?.ok === true).length;
    const levels = Object.fromEntries(['L1', 'L2', 'L3'].map((level) => {
        const selected = rows.filter((row) => levelOf(row, manifestById) === level);
        const levelCorrect = selected.filter((row) => row.visible_score?.ok === true).length;
        return [level, {
            correct: levelCorrect,
            total: selected.length,
            accuracy: selected.length ? levelCorrect / selected.length : 0
        }];
    }));
    return {
        agent,
        tasks: rows.length,
        uniqueTaskIds: new Set(rows.map((row) => row.task_id)).size,
        visibleCorrect: correct,
        visibleAccuracy: rows.length ? correct / rows.length : 0,
        responseOk: rows.filter(responseOk).length,
        responseOkRate: rows.length ? rows.filter(responseOk).length / rows.length : 0,
        timeouts: rows.filter(timedOut).length,
        totalTokens: rows.reduce((sum, row) => sum + tokenCount(row), 0),
        totalToolCalls: rows.reduce(
            (sum, row) => sum + Number(row.toolCalls || row.event_summary?.toolCallCount || 0),
            0
        ),
        levels,
        latencyMs: {
            mean: rows.length ? Math.round(durations.reduce((sum, value) => sum + value, 0) / rows.length) : 0,
            p50: percentile(durations, 0.5),
            p90: percentile(durations, 0.9),
            p95: percentile(durations, 0.95),
            max: durations.length ? Math.max(...durations) : 0
        }
    };
}

function ratio(metric) {
    return `${metric.correct}/${metric.total} (${(100 * metric.accuracy).toFixed(2)}%)`;
}

const manifestPath = path.join(campaignRoot, 'gaia-validation165.manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8').replace(/^\uFEFF/, ''));
const manifestById = new Map(manifest.tasks.map((task) => [task.task_id, task]));
const p1Rows = [];
for (let shard = 1; shard <= manifest.shardCount; shard += 1) {
    p1Rows.push(...readJsonl(path.join(
        campaignRoot,
        'p1',
        `shard-${shard}`,
        `gaia-validation165-p1-shard-${shard}-20260728.jsonl`
    )));
}
const codexRows = readJsonl(path.join(campaignRoot, 'codex', 'results.jsonl'));

for (const [name, rows] of [['P1', p1Rows], ['Codex', codexRows]]) {
    if (rows.length !== expectedTasks || new Set(rows.map((row) => row.task_id)).size !== expectedTasks) {
        throw new Error(
            `${name} is incomplete: rows=${rows.length}, unique=${new Set(rows.map((row) => row.task_id)).size}`
        );
    }
    const unexpected = rows.filter((row) => !manifestById.has(row.task_id));
    if (unexpected.length) {
        throw new Error(`${name} contains ${unexpected.length} task IDs outside the immutable manifest.`);
    }
}

p1Rows.sort((left, right) => Number(left.index) - Number(right.index));
codexRows.sort((left, right) => Number(left.index) - Number(right.index));
const p1Summary = summarize('AILIS P1', p1Rows, manifestById);
const codexSummary = summarize('Native Codex', codexRows, manifestById);
const paired = manifest.tasks.map((task) => {
    const p1 = p1Rows.find((row) => row.task_id === task.task_id);
    const codex = codexRows.find((row) => row.task_id === task.task_id);
    return {
        index: task.full_index,
        task_id: task.task_id,
        level: task.level,
        p1Correct: p1.visible_score?.ok === true,
        codexCorrect: codex.visible_score?.ok === true,
        p1Status: p1.status,
        codexStatus: codex.status,
        p1DurationMs: Number(p1.durationMs || 0),
        codexDurationMs: Number(codex.durationMs || 0),
        p1Tokens: tokenCount(p1),
        codexTokens: tokenCount(codex)
    };
});
const comparison = {
    benchmark: manifest.benchmark,
    generatedAt: new Date().toISOString(),
    manifestPath,
    sourceSha256: manifest.sourceSha256,
    p1Commit: '7ba2cf77628f793ad70abb5bd9577d5d41c1ba0b',
    protocol: {
        model: 'gpt-5.5',
        reasoningEffort: 'medium',
        timeoutMs: 600000,
        maxAgentStepsP1: 20,
        isolatedPerTaskWorkspace: true,
        noResume: true
    },
    summaries: {
        p1: p1Summary,
        codex: codexSummary
    },
    pairedCounts: {
        bothCorrect: paired.filter((row) => row.p1Correct && row.codexCorrect).length,
        p1Only: paired.filter((row) => row.p1Correct && !row.codexCorrect).length,
        codexOnly: paired.filter((row) => !row.p1Correct && row.codexCorrect).length,
        bothWrong: paired.filter((row) => !row.p1Correct && !row.codexCorrect).length
    },
    paired
};

const report = [
    '# P1 vs Native Codex: GAIA Validation 165',
    '',
    `- Immutable source SHA-256: \`${manifest.sourceSha256}\``,
    `- P1 commit: \`${comparison.p1Commit}\``,
    '- Model/reasoning: `gpt-5.5` / `medium`',
    '- Hard timeout: 600000 ms per task',
    '',
    '| Agent | Overall | L1 | L2 | L3 | Response OK | Timeouts | Tokens | Mean ms | P95 ms |',
    '|:---|---:|---:|---:|---:|---:|---:|---:|---:|---:|',
    `| AILIS P1 | ${p1Summary.visibleCorrect}/${p1Summary.tasks} (${(100 * p1Summary.visibleAccuracy).toFixed(2)}%) | ${ratio(p1Summary.levels.L1)} | ${ratio(p1Summary.levels.L2)} | ${ratio(p1Summary.levels.L3)} | ${p1Summary.responseOk}/${p1Summary.tasks} | ${p1Summary.timeouts} | ${p1Summary.totalTokens} | ${p1Summary.latencyMs.mean} | ${p1Summary.latencyMs.p95} |`,
    `| Native Codex | ${codexSummary.visibleCorrect}/${codexSummary.tasks} (${(100 * codexSummary.visibleAccuracy).toFixed(2)}%) | ${ratio(codexSummary.levels.L1)} | ${ratio(codexSummary.levels.L2)} | ${ratio(codexSummary.levels.L3)} | ${codexSummary.responseOk}/${codexSummary.tasks} | ${codexSummary.timeouts} | ${codexSummary.totalTokens} | ${codexSummary.latencyMs.mean} | ${codexSummary.latencyMs.p95} |`,
    '',
    '## Paired Outcomes',
    '',
    `- Both correct: ${comparison.pairedCounts.bothCorrect}`,
    `- P1 only: ${comparison.pairedCounts.p1Only}`,
    `- Codex only: ${comparison.pairedCounts.codexOnly}`,
    `- Both wrong: ${comparison.pairedCounts.bothWrong}`,
    ''
].join('\n');

await Promise.all([
    fsp.writeFile(path.join(campaignRoot, 'p1', 'results.jsonl'), `${p1Rows.map(JSON.stringify).join('\n')}\n`),
    fsp.writeFile(path.join(campaignRoot, 'comparison.json'), `${JSON.stringify(comparison, null, 2)}\n`),
    fsp.writeFile(path.join(campaignRoot, 'comparison.md'), `${report}\n`)
]);
console.log(JSON.stringify(comparison.summaries, null, 2));
