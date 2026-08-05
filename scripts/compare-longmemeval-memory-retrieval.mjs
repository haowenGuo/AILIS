import fs from 'node:fs';
import fsPromises from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import {
    buildRetrievalDiagnostics
} from './ailis-longmemeval-runtime.mjs';

const require = createRequire(import.meta.url);
const { AILISMemoryRuntime } = require('../electron/ailis-memory-store.cjs');
const { resolveMemoryStrategy } = require('../electron/ailis-memory-strategies.cjs');
const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPT_DIR, '..');
const DEFAULT_RUN_ID =
    'self-runtime-full500-parallel10-codex-gpt55-20260729-v1';

function parseArgs(argv) {
    const args = {
        runId: DEFAULT_RUN_ID,
        runDir: '',
        outputId: 'retrieval-bm25-phrase-v2',
        memoryStrategy: 'bm25_phrase_v2',
        limit: 0
    };
    for (let index = 0; index < argv.length; index += 1) {
        const token = argv[index];
        const next = argv[index + 1];
        if (token === '--run-id' && next) {
            args.runId = next;
            index += 1;
        } else if (token === '--run-dir' && next) {
            args.runDir = path.resolve(next);
            index += 1;
        } else if (token === '--output-id' && next) {
            args.outputId = next;
            index += 1;
        } else if (token === '--limit' && next) {
            args.limit = Math.max(0, Math.trunc(Number(next) || 0));
            index += 1;
        } else if (token === '--memory-strategy' && next) {
            args.memoryStrategy = resolveMemoryStrategy(next, '');
            if (!args.memoryStrategy) {
                throw new Error(`Unknown memory strategy: ${next}`);
            }
            index += 1;
        } else {
            throw new Error(`Unknown argument: ${token}`);
        }
    }
    return args;
}

function parseJsonl(raw) {
    return String(raw || '')
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => JSON.parse(line));
}

async function findStateRoots(shardsRoot) {
    const roots = new Map();
    const workers = (await fsPromises.readdir(shardsRoot, { withFileTypes: true }))
        .filter((entry) => entry.isDirectory() && entry.name.startsWith('worker-'));
    for (const worker of workers) {
        const stateRoot = path.join(shardsRoot, worker.name, 'state');
        const questionDirs = await fsPromises.readdir(stateRoot, { withFileTypes: true });
        for (const questionDir of questionDirs) {
            if (questionDir.isDirectory()) {
                roots.set(questionDir.name, path.join(stateRoot, questionDir.name));
            }
        }
    }
    return roots;
}

function fractionMetric(entries, metricName) {
    const values = entries
        .map((entry) => Number(entry?.[metricName]))
        .filter(Number.isFinite);
    const mean = values.length
        ? values.reduce((sum, value) => sum + value, 0) / values.length
        : null;
    return {
        n: values.length,
        meanFraction: mean,
        recallAny: values.length
            ? values.filter((value) => value > 0).length / values.length
            : null,
        recallAll: values.length
            ? values.filter((value) => value >= 1).length / values.length
            : null
    };
}

function percentile(values, fraction) {
    if (!values.length) return null;
    const sorted = [...values].sort((left, right) => left - right);
    const index = Math.min(
        sorted.length - 1,
        Math.max(0, Math.ceil(sorted.length * fraction) - 1)
    );
    return sorted[index];
}

function latencyMetric(entries) {
    const values = entries
        .map((entry) => Number(entry?.retrieval?.latencyMs))
        .filter((value) => Number.isFinite(value) && value >= 0);
    return {
        n: values.length,
        meanMs: values.length
            ? values.reduce((sum, value) => sum + value, 0) / values.length
            : null,
        p50Ms: percentile(values, 0.5),
        p95Ms: percentile(values, 0.95),
        maxMs: values.length ? Math.max(...values) : null,
        totalMs: values.length
            ? values.reduce((sum, value) => sum + value, 0)
            : null
    };
}

function summarize(entries) {
    const answerable = entries.filter((entry) => !entry.question_id.includes('_abs'));
    const ks = [1, 5, 8, 10, 20];
    const session = {};
    const turn = {};
    for (const k of ks) {
        session[`at${k}`] = fractionMetric(
            answerable.map((entry) => entry.retrieval),
            `evidenceSessionRecallAt${k}`
        );
        turn[`at${k}`] = fractionMetric(
            answerable.map((entry) => entry.retrieval),
            `evidenceTurnRecallAt${k}`
        );
    }
    const byQuestionType = {};
    for (const questionType of [...new Set(answerable.map((entry) => entry.question_type))]) {
        const rows = answerable.filter((entry) => entry.question_type === questionType);
        byQuestionType[questionType] = {
            n: rows.length,
            sessionAt8: fractionMetric(
                rows.map((entry) => entry.retrieval),
                'evidenceSessionRecallAt8'
            ),
            turnAt8: fractionMetric(
                rows.map((entry) => entry.retrieval),
                'evidenceTurnRecallAt8'
            )
        };
    }
    return {
        total: entries.length,
        answerable: answerable.length,
        latency: latencyMetric(answerable),
        session,
        turn,
        byQuestionType
    };
}

function metricDelta(baseline, optimized) {
    const output = {};
    for (const family of ['session', 'turn']) {
        output[family] = {};
        for (const at of Object.keys(optimized[family])) {
            output[family][at] = {};
            for (const metric of ['meanFraction', 'recallAny', 'recallAll']) {
                output[family][at][metric] =
                    Number(optimized[family][at][metric]) -
                    Number(baseline[family][at][metric]);
            }
        }
    }
    return output;
}

async function main() {
    const args = parseArgs(process.argv.slice(2));
    const runDir = args.runDir || path.join(
        REPO_ROOT,
        'eval-results',
        'longmemeval-ailis',
        args.runId
    );
    const manifest = JSON.parse(
        await fsPromises.readFile(path.join(runDir, 'manifest.json'), 'utf8')
    );
    const dataset = JSON.parse(await fsPromises.readFile(manifest.datasetPath, 'utf8'));
    const baselineRows = parseJsonl(
        await fsPromises.readFile(path.join(runDir, 'results.jsonl'), 'utf8')
    );
    const baselineById = new Map(
        baselineRows.map((entry) => [entry.question_id, entry])
    );
    const stateRoots = await findStateRoots(path.join(runDir, 'shards'));
    const selected = args.limit ? dataset.slice(0, args.limit) : dataset;
    const diagnostics = [];
    for (let index = 0; index < selected.length; index += 1) {
        const entry = selected[index];
        const stateRoot = stateRoots.get(entry.question_id);
        if (!stateRoot) {
            throw new Error(`Missing preserved AILIS state for ${entry.question_id}`);
        }
        const memoryRuntime = new AILISMemoryRuntime({
            rootDir: path.join(stateRoot, 'memory'),
            workspaceRoot: REPO_ROOT,
            memoryStrategy: args.memoryStrategy
        });
        const startedAt = process.hrtime.bigint();
        const retrieval = buildRetrievalDiagnostics({
            searchMemory: (query, options) => memoryRuntime.searchMemory(query, options)
        }, entry);
        retrieval.latencyMs = Number(process.hrtime.bigint() - startedAt) / 1e6;
        diagnostics.push({
            question_id: entry.question_id,
            question_type: entry.question_type,
            retrieval
        });
        if ((index + 1) % 25 === 0 || index + 1 === selected.length) {
            console.log(`[retrieval] ${index + 1}/${selected.length}`);
        }
    }

    const baselineComparable = selected.map((entry) => ({
        question_id: entry.question_id,
        question_type: entry.question_type,
        retrieval: baselineById.get(entry.question_id)?.retrieval || {}
    }));
    const baseline = summarize(baselineComparable);
    const optimized = summarize(diagnostics);
    const optimizedById = new Map(
        diagnostics.map((entry) => [entry.question_id, entry])
    );
    const perQuestion = selected
        .filter((entry) => !entry.question_id.includes('_abs'))
        .map((entry) => {
            const before = baselineById.get(entry.question_id)?.retrieval || {};
            const after = optimizedById.get(entry.question_id)?.retrieval || {};
            return {
                question_id: entry.question_id,
                question_type: entry.question_type,
                sessionAt8Before: Number(before.evidenceSessionRecallAt8) || 0,
                sessionAt8After: Number(after.evidenceSessionRecallAt8) || 0,
                turnAt8Before: Number(before.evidenceTurnRecallAt8) || 0,
                turnAt8After: Number(after.evidenceTurnRecallAt8) || 0
            };
        });
    const output = {
        benchmark: 'LongMemEval',
        sourceRunId: args.runDir ? path.basename(runDir) : args.runId,
        retrievalStrategy: args.memoryStrategy,
        generatedAt: new Date().toISOString(),
        baseline,
        optimized,
        delta: metricDelta(baseline, optimized),
        questionMovementAt8: {
            sessionImproved: perQuestion.filter(
                (entry) => entry.sessionAt8After > entry.sessionAt8Before
            ).length,
            sessionRegressed: perQuestion.filter(
                (entry) => entry.sessionAt8After < entry.sessionAt8Before
            ).length,
            turnImproved: perQuestion.filter(
                (entry) => entry.turnAt8After > entry.turnAt8Before
            ).length,
            turnRegressed: perQuestion.filter(
                (entry) => entry.turnAt8After < entry.turnAt8Before
            ).length
        }
    };
    const outputDir = path.join(runDir, args.outputId);
    if (fs.existsSync(outputDir)) {
        throw new Error(`Output already exists: ${outputDir}`);
    }
    await fsPromises.mkdir(outputDir, { recursive: true });
    await Promise.all([
        fsPromises.writeFile(
            path.join(outputDir, 'summary.json'),
            `${JSON.stringify(output, null, 2)}\n`,
            'utf8'
        ),
        fsPromises.writeFile(
            path.join(outputDir, 'diagnostics.jsonl'),
            diagnostics.map((entry) => JSON.stringify(entry)).join('\n') + '\n',
            'utf8'
        )
    ]);
    console.log(JSON.stringify(output, null, 2));
}

main().catch((error) => {
    console.error(error?.stack || error?.message || String(error));
    process.exitCode = 1;
});
