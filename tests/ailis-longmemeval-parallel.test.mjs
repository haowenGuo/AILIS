import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import {
    assertDenseWarmup,
    mergeLongMemEvalWorkerResults,
    officialHindsightEnvironment,
    parseParallelArgs,
    prepareLongMemEvalShards,
    readLatestJsonLines
} from '../scripts/run-ailis-longmemeval-parallel.mjs';

function entry(index) {
    return {
        question_id: `question-${String(index).padStart(2, '0')}`,
        question_type: index % 2 ? 'temporal-reasoning' : 'single-session-user',
        question: `Question ${index}?`,
        question_date: '2023/04/10 (Mon) 23:07',
        answer: `Answer ${index}`,
        answer_session_ids: [`session-${index}`],
        haystack_dates: ['2023/04/09 (Sun) 14:47'],
        haystack_session_ids: [`session-${index}`],
        haystack_sessions: [[
            { role: 'user', content: `Memory ${index}`, has_answer: true },
            { role: 'assistant', content: 'Understood.' }
        ]]
    };
}

function resultFor(source, overrides = {}) {
    return {
        question_id: source.question_id,
        question_type: source.question_type,
        completed: true,
        status: 'completed',
        hypothesis: `Hypothesis for ${source.question_id}`,
        syntheticUserIsolation: { ok: true },
        profileCuration: { attempted: true, ok: true, drained: true },
        retrieval: {
            evidenceSessionRecallAt8: 1,
            evidenceTurnRecallAt8: 1
        },
        invariants: {
            taskAgentStepCount: 0,
            questionTurnRecorded: false
        },
        ...overrides
    };
}

test('LongMemEval parallel runner propagates immutable model and offline settings', () => {
    const args = parseParallelArgs([
        '--memory-strategy', 'hybrid_crossencoder_v2',
        '--memory-embedding-model', 'dense/model',
        '--memory-embedding-revision', 'dense-sha',
        '--memory-reranker-model', 'reranker/model',
        '--memory-reranker-revision', 'reranker-sha',
        '--memory-model-endpoint', 'https://models.example/',
        '--memory-model-cache-dir', 'D:\\model-cache',
        '--memory-models-offline',
        '--memory-llm-provider', 'codex-model-bridge',
        '--memory-llm-base-url', 'codex://chatgpt-oauth',
        '--memory-llm-model', 'gpt-5.6-luna',
        '--memory-llm-timeout-ms', '600000'
    ]);
    assert.equal(args.memoryEmbeddingModel, 'dense/model');
    assert.equal(args.memoryEmbeddingRevision, 'dense-sha');
    assert.equal(args.memoryRerankerModel, 'reranker/model');
    assert.equal(args.memoryRerankerRevision, 'reranker-sha');
    assert.equal(args.memoryModelEndpoint, 'https://models.example/');
    assert.equal(args.memoryModelCacheDir, path.resolve('D:\\model-cache'));
    assert.equal(args.memoryModelsOffline, true);
    assert.equal(args.memoryLlmProvider, 'codex-model-bridge');
    assert.equal(args.memoryLlmBaseUrl, 'codex://chatgpt-oauth');
    assert.equal(args.memoryLlmModel, 'gpt-5.6-luna');
    assert.equal(args.memoryLlmTimeoutMs, 600000);
    assert.equal(args.allowDenseFallback, false);
    assert.equal(args.resumeQuestionState, true);
});

test('LongMemEval dense fidelity gate rejects silent fallback unless explicit', () => {
    const profile = {
        id: 'dense-test',
        requiresDense: true
    };
    assert.throws(
        () => assertDenseWarmup(profile, { status: 'fallback' }),
        /Dense-memory fidelity gate failed/
    );
    assert.equal(
        assertDenseWarmup(
            profile,
            { status: 'fallback' },
            { allowDenseFallback: true }
        ),
        true
    );
    assert.equal(assertDenseWarmup(profile, { status: 'ready' }), true);
    assert.equal(
        parseParallelArgs(['--allow-dense-fallback']).allowDenseFallback,
        true
    );
    assert.equal(
        parseParallelArgs(['--restart-question-state']).resumeQuestionState,
        false
    );
});

test('shared official Hindsight receives Codex and model-host environment without empty keys', (t) => {
    const previous = {
        CODEX_HOME: process.env.CODEX_HOME,
        HF_ENDPOINT: process.env.HF_ENDPOINT,
        HINDSIGHT_API_LLM_API_KEY: process.env.HINDSIGHT_API_LLM_API_KEY
    };
    t.after(() => {
        for (const [key, value] of Object.entries(previous)) {
            if (value === undefined) delete process.env[key];
            else process.env[key] = value;
        }
    });
    process.env.CODEX_HOME = 'D:\\codex-auth';
    delete process.env.HF_ENDPOINT;
    process.env.HINDSIGHT_API_LLM_API_KEY = '';
    const environment = officialHindsightEnvironment({
        memoryModelEndpoint: 'https://models.example/'
    });
    assert.equal(environment.CODEX_HOME, 'D:\\codex-auth');
    assert.equal(environment.HF_ENDPOINT, 'https://models.example/');
    assert.equal(environment.HF_HUB_DISABLE_XET, '1');
    assert.equal(environment.HINDSIGHT_API_LLM_PROVIDER, 'openai-codex');
    assert.ok(!Object.hasOwn(environment, 'HINDSIGHT_API_LLM_API_KEY'));
});

test('parallel runner gives first-time official Hindsight dependency setup enough time', () => {
    const defaults = parseParallelArgs([]);
    assert.equal(defaults.hindsightReadyTimeoutMs, 900_000);
    const overridden = parseParallelArgs([
        '--hindsight-ready-timeout-ms',
        '1200000'
    ]);
    assert.equal(overridden.hindsightReadyTimeoutMs, 1_200_000);
    const clamped = parseParallelArgs([
        '--hindsight-ready-timeout-ms',
        '1000'
    ]);
    assert.equal(clamped.hindsightReadyTimeoutMs, 180_000);
});

test('LongMemEval parallel sharding is balanced, complete, disjoint, and reusable', async () => {
    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-longmemeval-shards-'));
    const dataPath = path.join(rootDir, 'dataset.json');
    const outputDir = path.join(rootDir, 'output');
    const entries = Array.from({ length: 12 }, (_, index) => entry(index));
    await fs.writeFile(dataPath, JSON.stringify(entries), 'utf8');
    const args = {
        dataPath,
        outputDir,
        workers: 3,
        limit: 0,
        offset: 0
    };
    const manifest = await prepareLongMemEvalShards(args);
    assert.equal(manifest.selectedCount, 12);
    assert.deepEqual(manifest.counts, [4, 4, 4]);
    const observed = [];
    for (const shardPath of manifest.shardPaths) {
        const shard = JSON.parse(await fs.readFile(shardPath, 'utf8'));
        observed.push(...shard.map((item) => item.question_id));
    }
    assert.equal(new Set(observed).size, 12);
    assert.deepEqual(
        [...observed].sort(),
        entries.map((item) => item.question_id).sort()
    );
    const reused = await prepareLongMemEvalShards(args);
    assert.equal(reused.reused, true);
});

test('LongMemEval parallel sharding selects an explicit stratified question set', async () => {
    const rootDir = await fs.mkdtemp(path.join(
        os.tmpdir(),
        'ailis-longmemeval-question-ids-'
    ));
    const dataPath = path.join(rootDir, 'dataset.json');
    const outputDir = path.join(rootDir, 'output');
    const entries = Array.from({ length: 10 }, (_, index) => entry(index));
    await fs.writeFile(dataPath, JSON.stringify(entries), 'utf8');
    const args = {
        dataPath,
        outputDir,
        workers: 3,
        limit: 0,
        offset: 0,
        questionIds: ['question-01', 'question-04', 'question-09']
    };
    const manifest = await prepareLongMemEvalShards(args);
    assert.equal(manifest.selectedCount, 3);
    assert.deepEqual(manifest.counts, [1, 1, 1]);
    assert.deepEqual(
        manifest.entries.map((item) => item.question_id),
        ['question-01', 'question-04', 'question-09']
    );
    assert.deepEqual(manifest.questionIds, args.questionIds);
});

test('LongMemEval parallel merge keeps the latest attempt and restores source order', async () => {
    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-longmemeval-merge-'));
    const dataPath = path.join(rootDir, 'dataset.json');
    const outputDir = path.join(rootDir, 'output');
    const entries = Array.from({ length: 6 }, (_, index) => entry(index));
    await fs.writeFile(dataPath, JSON.stringify(entries), 'utf8');
    const args = {
        dataset: 's',
        dataPath,
        outputDir,
        runId: 'parallel-fixture',
        workers: 2,
        limit: 0,
        offset: 0,
        profileCuration: 'drain'
    };
    const shardManifest = await prepareLongMemEvalShards(args);
    for (let worker = 0; worker < args.workers; worker += 1) {
        const assigned = shardManifest.entries
            .filter((item) => item.worker === worker)
            .map((item) => entries[item.sourceIndex]);
        const workerDir = path.join(
            outputDir,
            'shards',
            `worker-${String(worker).padStart(2, '0')}`
        );
        await fs.mkdir(workerDir, { recursive: true });
        const rows = assigned.flatMap((source, index) => {
            if (worker === 0 && index === 0) {
                return [
                    resultFor(source, {
                        completed: false,
                        status: 'runner_error',
                        hypothesis: ''
                    }),
                    resultFor(source)
                ];
            }
            return [resultFor(source)];
        });
        await fs.writeFile(
            path.join(workerDir, 'results.jsonl'),
            `${rows.map((row) => JSON.stringify(row)).join('\n')}\n`,
            'utf8'
        );
    }

    const latestWorkerZero = await readLatestJsonLines(
        path.join(outputDir, 'shards', 'worker-00', 'results.jsonl')
    );
    assert.equal(latestWorkerZero.get('question-00').completed, true);

    const summary = await mergeLongMemEvalWorkerResults({ args, shardManifest });
    assert.equal(summary.results.expected, 6);
    assert.equal(summary.results.recorded, 6);
    assert.equal(summary.results.completed, 6);
    assert.equal(summary.results.missing, 0);
    assert.equal(summary.results.taskAgentViolationCount, 0);
    assert.equal(summary.results.syntheticUserIsolationViolationCount, 0);
    assert.equal(summary.results.profileDrainViolationCount, 0);
    const merged = (await fs.readFile(path.join(outputDir, 'results.jsonl'), 'utf8'))
        .trim()
        .split(/\r?\n/)
        .map((line) => JSON.parse(line));
    assert.deepEqual(
        merged.map((row) => row.question_id),
        entries.map((item) => item.question_id)
    );
    const hypotheses = (await fs.readFile(
        path.join(outputDir, 'hypotheses.jsonl'),
        'utf8'
    )).trim().split(/\r?\n/);
    assert.equal(hypotheses.length, 6);
});
