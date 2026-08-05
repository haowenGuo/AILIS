import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';

const campaignRoot = process.argv[2]
    ? path.resolve(process.argv[2])
    : 'F:\\AILIS_self_evolution_runtime\\eval-results\\engineering\\gaia-desktop-real\\p1-vs-codex-validation165-20260728';
const outputDir = process.argv[3]
    ? path.resolve(process.argv[3])
    : path.join(campaignRoot, 'codex-network-retry-round1');
const inputResultsPath = process.argv[4]
    ? path.resolve(process.argv[4])
    : path.join(campaignRoot, 'codex', 'results.jsonl');
const expectedAffected = Math.max(1, Number(process.argv[5]) || 103);
const selectionMode = process.argv[6] || 'broad-network';
const sourcePath = path.join(campaignRoot, 'gaia-validation165.source.jsonl');
const manifestPath = path.join(campaignRoot, 'gaia-validation165.manifest.json');

function readJsonl(filePath) {
    return fs.readFileSync(filePath, 'utf8')
        .replace(/^\uFEFF/, '')
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => JSON.parse(line));
}

function hasNetworkFailure(row) {
    if (row.responseOk === true) return false;
    let stderr = '';
    try {
        stderr = fs.readFileSync(row.stderrPath, 'utf8');
    } catch {
        return false;
    }
    if (selectionMode === 'sampling-stream') {
        return /codex_core::responses_retry.*stream disconnected|backend-api\/codex\/responses.*(?:error sending request|network error|error decoding response body)|idle timeout waiting for SSE/i.test(stderr);
    }
    return /stream disconnected|error sending request|network error|error decoding response body|connection (?:reset|closed|aborted|failed)|\b429\b|too many requests|rate.?limit/i.test(stderr);
}

const [sourceRows, originalRows] = [readJsonl(sourcePath), readJsonl(inputResultsPath)];
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8').replace(/^\uFEFF/, ''));
const sourceById = new Map(sourceRows.map((row) => [row.task_id, row]));
const manifestById = new Map(manifest.tasks.map((row) => [row.task_id, row]));
const affected = originalRows.filter(hasNetworkFailure);
const affectedIds = new Set(affected.map((row) => row.task_id));
if (affected.length !== expectedAffected || affectedIds.size !== expectedAffected) {
    throw new Error(
        `Expected ${expectedAffected} unique network-affected tasks, got rows=${affected.length}, unique=${affectedIds.size}`
    );
}

const retrySource = affected
    .map((row) => sourceById.get(row.task_id))
    .sort((left, right) => Number(left.index) - Number(right.index));
const retryManifestTasks = retrySource.map((row) => manifestById.get(row.task_id));
if (retrySource.some((row) => !row) || retryManifestTasks.some((row) => !row)) {
    throw new Error('A network-affected task is missing from the immutable source or manifest.');
}

await fsp.mkdir(outputDir, { recursive: true });
if (fs.existsSync(path.join(outputDir, 'results.jsonl'))) {
    throw new Error(`Retry output already contains results: ${outputDir}`);
}
await Promise.all([
    fsp.writeFile(
        path.join(outputDir, 'source.jsonl'),
        `${retrySource.map((row) => JSON.stringify(row)).join('\n')}\n`,
        'utf8'
    ),
    fsp.writeFile(
        path.join(outputDir, 'manifest.json'),
        `${JSON.stringify({
            benchmark: 'gaia-validation165-codex-network-retry',
            createdAt: new Date().toISOString(),
            questionCount: retryManifestTasks.length,
            parentManifest: manifestPath,
            sourceSha256: manifest.sourceSha256,
            selectionRule: 'Original native Codex row had no valid response and its stderr contained a network/stream failure marker.',
            tasks: retryManifestTasks
        }, null, 2)}\n`,
        'utf8'
    ),
    fsp.writeFile(
        path.join(outputDir, 'classification.json'),
        `${JSON.stringify({
            excludedOriginalRows: true,
            replaceOnlyAfterValidRetryResponse: true,
            inputResultsPath,
            selectionMode,
            counts: {
                affected: affected.length,
                timeout: affected.filter((row) => row.timedOut).length,
                processIncomplete: affected.filter((row) => row.status === 'codex_process_incomplete').length
            },
            tasks: affected.map((row) => ({
                index: row.index,
                task_id: row.task_id,
                level: row.level,
                originalStatus: row.status,
                originalDurationMs: row.durationMs,
                originalExitCode: row.exit?.code ?? null
            }))
        }, null, 2)}\n`,
        'utf8'
    )
]);

console.log(JSON.stringify({
    ok: true,
    outputDir,
    affectedTasks: affected.length,
    timeouts: affected.filter((row) => row.timedOut).length,
    processIncomplete: affected.filter((row) => row.status === 'codex_process_incomplete').length
}, null, 2));
