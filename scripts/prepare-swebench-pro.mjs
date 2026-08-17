import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
    SWE_BENCH_PRO_DATASET,
    fetchHuggingFaceDatasetRevision,
    prepareSweBenchProSample
} from './prepare-swebench-lite-sample.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const DEFAULT_OUTPUT_DIR = path.join(projectRoot, 'build-cache', 'benchmarks', 'swebench-pro', 'data');
export const SWE_BENCH_PRO_DATASET_REVISION = '7ab5114912baf22bb098818e604c02fe7ad2c11f';
export const SWE_BENCH_PRO_PUBLIC_ROWS = 731;
export const SWE_BENCH_PRO_LEADERBOARD_ROWS = 730;
export const SWE_BENCH_PRO_LEADERBOARD_EXCLUSIONS = new Set([
    'instance_element-hq__element-web-ec0f940ef0e8e3b61078f145f34dc40d1938e6c5-vnan'
]);

function parseArgs(argv = process.argv.slice(2)) {
    const args = {
        split: 'test',
        limit: 3,
        offset: 0,
        repo: '',
        outputDir: DEFAULT_OUTPUT_DIR,
        allowDatasetRevisionChange: false
    };
    for (let index = 0; index < argv.length; index += 1) {
        const token = argv[index];
        const next = () => argv[++index] || '';
        if (token === '--split') args.split = next() || args.split;
        else if (token === '--limit') args.limit = Number(next() || args.limit);
        else if (token === '--offset') args.offset = Number(next() || args.offset);
        else if (token === '--repo') args.repo = next();
        else if (token === '--output-dir') args.outputDir = path.resolve(next() || args.outputDir);
        else if (token === '--full') args.limit = 731;
        else if (token === '--allow-dataset-revision-change') args.allowDatasetRevisionChange = true;
    }
    args.limit = Math.max(1, Math.min(Number.isFinite(args.limit) ? args.limit : 3, 731));
    args.offset = Math.max(0, Number.isFinite(args.offset) ? args.offset : 0);
    return args;
}

function listString(value) {
    if (typeof value === 'string' && value.trim()) {
        return value.trim();
    }
    return JSON.stringify(Array.isArray(value) ? value : []);
}

function serializedListHasItems(value) {
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value !== 'string') return false;
    const normalized = value.trim();
    return normalized.startsWith('[') && normalized.endsWith(']') && !/^\[\s*\]$/.test(normalized);
}

function selectEvenlyByRepo(rows, perRepo) {
    const byRepo = new Map();
    for (const row of rows) {
        const repo = row.repo || '';
        if (!byRepo.has(repo)) byRepo.set(repo, []);
        byRepo.get(repo).push(row);
    }
    return [...byRepo.values()].flatMap((repoRows) => {
        if (repoRows.length <= perRepo) return repoRows;
        if (perRepo === 1) return [repoRows[0]];
        const selected = [];
        for (let index = 0; index < perRepo; index += 1) {
            const rowIndex = Math.round((index * (repoRows.length - 1)) / (perRepo - 1));
            selected.push(repoRows[rowIndex]);
        }
        return selected;
    });
}

export function buildOfficialSweBenchProRow(row = {}) {
    return {
        repo: row.repo || '',
        instance_id: row.instance_id || '',
        base_commit: row.base_commit || '',
        patch: row.patch || '',
        test_patch: row.test_patch || '',
        problem_statement: row.problem_statement || '',
        requirements: row.requirements || '',
        interface: row.interface || '',
        repo_language: row.repo_language || '',
        fail_to_pass: listString(row.fail_to_pass),
        pass_to_pass: listString(row.pass_to_pass),
        issue_specificity: row.issue_specificity || '',
        issue_categories: listString(row.issue_categories),
        before_repo_set_cmd: row.before_repo_set_cmd || '',
        selected_test_files_to_run: listString(row.selected_test_files_to_run),
        dockerhub_tag: row.dockerhub_tag || ''
    };
}

export function buildSweBenchProAgentTask(row = {}) {
    return {
        benchmark: 'swebench-pro',
        dataset: SWE_BENCH_PRO_DATASET,
        instance_id: row.instance_id || '',
        repo: row.repo || '',
        base_commit: row.base_commit || '',
        problem_statement: row.problem_statement || '',
        requirements: row.requirements || '',
        interface: row.interface || '',
        repo_language: row.repo_language || '',
        issue_specificity: row.issue_specificity || '',
        issue_categories: Array.isArray(row.issue_categories) ? row.issue_categories : [],
        dockerhub_tag: row.dockerhub_tag || '',
        expected_output: 'Modify the repository and return a git-compatible patch. Do not use benchmark gold patches or hidden test patches.'
    };
}

function renderJsonl(rows) {
    return `${rows.map((row) => JSON.stringify(row)).join('\n')}\n`;
}

export async function prepareSweBenchProArtifacts(options = {}) {
    const args = {
        ...parseArgs([]),
        ...options
    };
    await fs.mkdir(args.outputDir, { recursive: true });
    const datasetVersion = await fetchHuggingFaceDatasetRevision(SWE_BENCH_PRO_DATASET);
    if (
        !args.allowDatasetRevisionChange &&
        datasetVersion.revision !== SWE_BENCH_PRO_DATASET_REVISION
    ) {
        throw new Error(
            `SWE-bench Pro dataset revision changed from ${SWE_BENCH_PRO_DATASET_REVISION} ` +
            `to ${datasetVersion.revision || 'unknown'}. Review the upstream change and update the source lock, ` +
            'or pass --allow-dataset-revision-change for an intentional exploratory run.'
        );
    }
    const prepared = await prepareSweBenchProSample({
        split: args.split,
        limit: args.limit,
        offset: args.offset,
        repo: args.repo,
        outputDir: args.outputDir
    });
    const sourceText = await fs.readFile(prepared.output, 'utf8');
    const rows = sourceText
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => JSON.parse(line));
    const stem = prepared.output.replace(/\.jsonl$/i, '');
    const officialDatasetPath = `${stem}.official.jsonl`;
    const agentTasksPath = `${stem}.tasks.jsonl`;
    const manifestPath = `${stem}.manifest.json`;
    const officialRows = rows.map(buildOfficialSweBenchProRow);
    const agentTasks = rows.map(buildSweBenchProAgentTask);
    const leaderboardRows = rows.filter(
        (row) => !SWE_BENCH_PRO_LEADERBOARD_EXCLUSIONS.has(row.instance_id)
    );
    const leaderboardOfficialRows = leaderboardRows.map(buildOfficialSweBenchProRow);
    const leaderboardAgentTasks = leaderboardRows.map(buildSweBenchProAgentTask);
    const leaderboardOfficialDatasetPath = `${stem}.leaderboard.official.jsonl`;
    const leaderboardAgentTasksPath = `${stem}.leaderboard.tasks.jsonl`;
    const subsetArtifacts = Object.fromEntries([
        { id: 'smoke-11', perRepo: 1 },
        { id: 'calibration-44', perRepo: 4 },
        { id: 'scale-110', perRepo: 10 }
    ].map(({ id, perRepo }) => {
        const selectedRows = selectEvenlyByRepo(leaderboardRows, perRepo);
        return [id, {
            id,
            perRepo,
            rows: selectedRows,
            officialDatasetPath: `${stem}.${id}.official.jsonl`,
            agentTasksPath: `${stem}.${id}.tasks.jsonl`
        }];
    }));
    const emptyFailToPass = officialRows
        .filter((row) => !serializedListHasItems(row.fail_to_pass))
        .map((row) => row.instance_id);
    const emptySelectedTestFiles = officialRows
        .filter((row) => !serializedListHasItems(row.selected_test_files_to_run))
        .map((row) => row.instance_id);
    if (emptyFailToPass.length || emptySelectedTestFiles.length) {
        throw new Error(
            'SWE-bench Pro integrity check failed: ' +
            `${emptyFailToPass.length} rows have empty fail_to_pass and ` +
            `${emptySelectedTestFiles.length} rows have empty selected_test_files_to_run.`
        );
    }
    if (rows.length === SWE_BENCH_PRO_PUBLIC_ROWS && leaderboardRows.length !== SWE_BENCH_PRO_LEADERBOARD_ROWS) {
        throw new Error(
            `SWE-bench Pro leaderboard set must contain ${SWE_BENCH_PRO_LEADERBOARD_ROWS} rows; ` +
            `prepared ${leaderboardRows.length}.`
        );
    }

    await Promise.all([
        fs.writeFile(officialDatasetPath, renderJsonl(officialRows), 'utf8'),
        fs.writeFile(agentTasksPath, renderJsonl(agentTasks), 'utf8'),
        fs.writeFile(leaderboardOfficialDatasetPath, renderJsonl(leaderboardOfficialRows), 'utf8'),
        fs.writeFile(leaderboardAgentTasksPath, renderJsonl(leaderboardAgentTasks), 'utf8'),
        ...Object.values(subsetArtifacts).flatMap((artifact) => [
            fs.writeFile(artifact.officialDatasetPath, renderJsonl(artifact.rows.map(buildOfficialSweBenchProRow)), 'utf8'),
            fs.writeFile(artifact.agentTasksPath, renderJsonl(artifact.rows.map(buildSweBenchProAgentTask)), 'utf8')
        ])
    ]);

    const manifest = {
        ok: true,
        generatedAt: new Date().toISOString(),
        dataset: SWE_BENCH_PRO_DATASET,
        datasetRevision: datasetVersion.revision,
        datasetLastModified: datasetVersion.lastModified,
        split: args.split,
        rowCount: rows.length,
        totalRows: prepared.totalRows,
        sourceSamplePath: prepared.output,
        officialDatasetPath,
        agentTasksPath,
        leaderboard: {
            rowCount: leaderboardRows.length,
            officialDatasetPath: leaderboardOfficialDatasetPath,
            agentTasksPath: leaderboardAgentTasksPath,
            excludedInstanceIds: [...SWE_BENCH_PRO_LEADERBOARD_EXCLUSIONS]
        },
        evaluationSubsets: Object.fromEntries(
            Object.entries(subsetArtifacts).map(([id, artifact]) => [id, {
                rowCount: artifact.rows.length,
                perRepo: artifact.perRepo,
                officialDatasetPath: artifact.officialDatasetPath,
                agentTasksPath: artifact.agentTasksPath,
                instanceIds: artifact.rows.map((row) => row.instance_id)
            }])
        ),
        dataIntegrity: {
            failToPassNonEmptyRows: officialRows.length,
            selectedTestFilesNonEmptyRows: officialRows.length,
            emptyFailToPass,
            emptySelectedTestFiles
        },
        goldDataIsolation: {
            agentTasksContainPatch: agentTasks.some((row) => Object.hasOwn(row, 'patch')),
            agentTasksContainTestPatch: agentTasks.some((row) => Object.hasOwn(row, 'test_patch'))
        },
        instances: rows.map((row) => ({
            instance_id: row.instance_id,
            repo: row.repo,
            repo_language: row.repo_language,
            dockerhub_tag: row.dockerhub_tag
        }))
    };
    await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
    return { ...manifest, manifestPath };
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
    prepareSweBenchProArtifacts(parseArgs())
        .then((report) => {
            const { instances, ...summary } = report;
            console.log(JSON.stringify({
                ...summary,
                instanceCount: instances.length,
                instancePreview: instances.slice(0, 5)
            }, null, 2));
        })
        .catch((error) => {
            console.error(error?.stack || error?.message || String(error));
            process.exitCode = 1;
        });
}
