import crypto from 'node:crypto';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';

const campaignRoot = process.argv[2]
    ? path.resolve(process.argv[2])
    : 'F:\\AILIS_self_evolution_runtime\\eval-results\\engineering\\gaia-desktop-real\\p1-vs-codex-validation165-20260728';
const shardCount = Math.max(1, Number(process.argv[3]) || 4);
const l1Source = 'F:\\AILIS_self_evolution_runtime\\eval-results\\engineering\\gaia-official\\ailis-l1-full-current-20260707.jsonl';
const l1Summary = 'F:\\AILIS_self_evolution_runtime\\eval-results\\engineering\\gaia-official\\ailis-l1-full-current-20260707.summary.json';
const l23Root = 'F:\\AILIS_self_evolution_runtime\\eval-results\\engineering\\gaia-desktop-real\\p0-gaia-l23-8ebc1e5-20260725';
const sources = [
    {
        level: 'L1',
        sourceJsonl: l1Source,
        sourceSummary: l1Summary
    },
    {
        level: 'L2',
        sourceJsonl: path.join(
            l23Root,
            'gaia-l2-p0-full-source-8ebc1e5-20260725.desktop-source.jsonl'
        )
    },
    {
        level: 'L3',
        sourceJsonl: path.join(
            l23Root,
            'gaia-l3-p0-full-source-8ebc1e5-20260725.desktop-source.jsonl'
        )
    }
];

function readJsonl(filePath) {
    return fs.readFileSync(filePath, 'utf8')
        .replace(/^\uFEFF/, '')
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => JSON.parse(line));
}

function taskIdOf(row) {
    return String(row.task_id || row.taskId || row.id || '').trim();
}

function sha256(text) {
    return crypto.createHash('sha256').update(text).digest('hex');
}

function canonicalTask(row, level, finalAnswer, index) {
    const filePath = String(row.file_path || row.cached_file_path || '').trim();
    return {
        record_type: 'final',
        index,
        source_index: Number.isFinite(Number(row.index)) ? Number(row.index) : null,
        task_id: taskIdOf(row),
        level: Number(level.slice(1)),
        question: String(row.question || row.prompt || '').trim(),
        file_name: String(row.file_name || (filePath ? path.basename(filePath) : '')).trim(),
        file_path: filePath,
        final_answer: finalAnswer
    };
}

const l1Gold = new Map(
    (JSON.parse(fs.readFileSync(l1Summary, 'utf8').replace(/^\uFEFF/, ''))?.score?.per_task || [])
        .map((entry) => [
            String(entry.task_id || '').trim(),
            String(entry.final_answer || '').trim()
        ])
);

const tasks = [];
const manifestTasks = [];
const seen = new Set();
const attachmentErrors = [];
for (const source of sources) {
    const rows = readJsonl(source.sourceJsonl);
    for (const row of rows) {
        const taskId = taskIdOf(row);
        const finalAnswer = String(
            row.final_answer ||
            row.expected_answer ||
            (source.level === 'L1' ? l1Gold.get(taskId) : '') ||
            ''
        ).trim();
        if (!taskId || seen.has(taskId)) {
            throw new Error(`Missing or duplicate task ID: ${taskId || '<empty>'}`);
        }
        if (!finalAnswer) {
            throw new Error(`Gold answer is missing for ${source.level} task ${taskId}`);
        }
        const index = tasks.length;
        const task = canonicalTask(row, source.level, finalAnswer, index);
        if (!task.question) {
            throw new Error(`Question is missing for ${source.level} task ${taskId}`);
        }
        if (task.file_path && !fs.existsSync(task.file_path)) {
            attachmentErrors.push({ task_id: taskId, file_path: task.file_path });
        }
        seen.add(taskId);
        tasks.push(task);
        manifestTasks.push({
            full_index: index,
            task_id: taskId,
            level: source.level,
            stratum: 'full_validation',
            source_index: task.source_index,
            source_jsonl: source.sourceJsonl,
            has_attachment: Boolean(task.file_path),
            attachment_name: task.file_name,
            question_sha256: sha256(task.question)
        });
    }
}

const expectedCounts = { L1: 53, L2: 86, L3: 26 };
const levelCounts = Object.fromEntries(
    Object.keys(expectedCounts).map((level) => [
        level,
        manifestTasks.filter((task) => task.level === level).length
    ])
);
if (
    tasks.length !== 165 ||
    Object.entries(expectedCounts).some(([level, count]) => levelCounts[level] !== count)
) {
    throw new Error(`Unexpected task counts: total=${tasks.length}, levels=${JSON.stringify(levelCounts)}`);
}
if (attachmentErrors.length) {
    throw new Error(`Missing attachments: ${JSON.stringify(attachmentErrors, null, 2)}`);
}

await fsp.mkdir(campaignRoot, { recursive: true });
const sourcePath = path.join(campaignRoot, 'gaia-validation165.source.jsonl');
const summaryPath = path.join(campaignRoot, 'gaia-validation165.source-summary.json');
const manifestPath = path.join(campaignRoot, 'gaia-validation165.manifest.json');
const sourceText = `${tasks.map((task) => JSON.stringify(task)).join('\n')}\n`;
const sourceSummary = {
    benchmark: 'gaia-validation165',
    runId: 'gaia-validation165-source-20260728',
    sourceOnly: true,
    questionCount: tasks.length,
    score: {
        per_task: tasks.map((task) => ({
            task_id: task.task_id,
            final_answer: task.final_answer
        }))
    }
};
const manifest = {
    benchmark: 'gaia-validation165',
    createdAt: new Date().toISOString(),
    questionCount: tasks.length,
    levelCounts,
    shardCount,
    sourceSha256: sha256(sourceText),
    purpose: 'Full public GAIA validation evaluation for P1 and native Codex under one immutable manifest.',
    tasks: manifestTasks
};
await Promise.all([
    fsp.writeFile(sourcePath, sourceText, 'utf8'),
    fsp.writeFile(summaryPath, `${JSON.stringify(sourceSummary, null, 2)}\n`, 'utf8'),
    fsp.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8')
]);

const shards = Array.from({ length: shardCount }, () => []);
for (const task of tasks) {
    shards[task.index % shardCount].push(task);
}
for (let shardIndex = 0; shardIndex < shards.length; shardIndex += 1) {
    const shardTasks = shards[shardIndex];
    const number = shardIndex + 1;
    await Promise.all([
        fsp.writeFile(
            path.join(campaignRoot, `gaia-validation165.shard-${number}.source.jsonl`),
            `${shardTasks.map((task) => JSON.stringify(task)).join('\n')}\n`,
            'utf8'
        ),
        fsp.writeFile(
            path.join(campaignRoot, `gaia-validation165.shard-${number}.source-summary.json`),
            `${JSON.stringify({
                benchmark: 'gaia-validation165',
                runId: `gaia-validation165-source-shard-${number}-20260728`,
                sourceOnly: true,
                questionCount: shardTasks.length,
                score: {
                    per_task: shardTasks.map((task) => ({
                        task_id: task.task_id,
                        final_answer: task.final_answer
                    }))
                }
            }, null, 2)}\n`,
            'utf8'
        )
    ]);
}

console.log(JSON.stringify({
    ok: true,
    campaignRoot,
    taskCount: tasks.length,
    uniqueTaskIds: seen.size,
    levelCounts,
    attachmentCount: tasks.filter((task) => task.file_path).length,
    sourcePath,
    summaryPath,
    manifestPath,
    sourceSha256: manifest.sourceSha256,
    shards: shards.map((shard, index) => ({
        shard: index + 1,
        taskCount: shard.length,
        levels: Object.fromEntries(
            Object.keys(expectedCounts).map((level) => [
                level,
                shard.filter((task) => `L${task.level}` === level).length
            ])
        )
    }))
}, null, 2));
