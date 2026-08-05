import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import {
    answerLongMemEvalQuestion,
    buildChronologicalSessions,
    buildLongMemEvalClockOverride,
    buildLongMemEvalQuestionPrompt,
    buildRetrievalDiagnostics,
    buildRetrievalDiagnosticsAsync,
    ingestLongMemEvalHistory,
    isolateLongMemEvalSyntheticUser,
    pairLongMemEvalSession,
    parseLongMemEvalTimestamp,
    prepareLongMemEvalQuestionState,
    readJsonArrayEntries,
    runLongMemEvalCognitionCuration,
    runLongMemEvalProfileCuration,
    validateLongMemEvalEntry,
    writeLongMemEvalIngestionCheckpoint
} from '../scripts/ailis-longmemeval-runtime.mjs';

const require = createRequire(import.meta.url);
const { AILISMemoryRuntime } = require('../electron/ailis-memory-store.cjs');
const { AILISRawMemoryLedger } = require('../electron/ailis-raw-memory-ledger.cjs');

test('LongMemEval question retry resumes isolated state unless restart is explicit', async (t) => {
    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-lme-resume-'));
    t.after(() => fs.rm(rootDir, { recursive: true, force: true }));
    const stateDir = path.join(rootDir, 'question-state');
    await fs.mkdir(stateDir, { recursive: true });
    const marker = path.join(stateDir, 'retained-checkpoint.json');
    await fs.writeFile(marker, '{"retained":170}\n', 'utf8');

    const resumed = await prepareLongMemEvalQuestionState({
        stateDir,
        resume: true
    });
    assert.equal(resumed.resumed, true);
    assert.equal(await fs.readFile(marker, 'utf8'), '{"retained":170}\n');

    let markerExistedBeforeReset = false;
    const restarted = await prepareLongMemEvalQuestionState({
        stateDir,
        resume: false,
        beforeReset: async () => {
            markerExistedBeforeReset = await fs.access(marker)
                .then(() => true)
                .catch(() => false);
        }
    });
    assert.equal(restarted.resumed, false);
    assert.equal(markerExistedBeforeReset, true);
    await assert.rejects(fs.access(marker));
});

test('LongMemEval resumes only after a matching completed-ingestion checkpoint', async (t) => {
    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-lme-checkpoint-'));
    t.after(() => fs.rm(rootDir, { recursive: true, force: true }));
    const stateDir = path.join(rootDir, 'question-state');
    const identity = {
        questionId: 'question-a',
        datasetPath: path.join(rootDir, 'shard.json'),
        sessionIds: ['session-1', 'session-2']
    };

    await fs.mkdir(stateDir, { recursive: true });
    await fs.writeFile(path.join(stateDir, 'partial-events.jsonl'), 'duplicate-risk\n');
    const incomplete = await prepareLongMemEvalQuestionState({
        stateDir,
        resume: true,
        checkpointIdentity: identity
    });
    assert.equal(incomplete.resumed, false);
    await assert.rejects(fs.access(path.join(stateDir, 'partial-events.jsonl')));

    const ingestion = { eventCount: 277, sessionCount: 48 };
    await writeLongMemEvalIngestionCheckpoint({
        stateDir,
        identity,
        syntheticUserIsolation: {
            ok: true,
            status: 'isolated'
        },
        ingestion
    });
    const marker = path.join(stateDir, 'retained-checkpoint.json');
    await fs.writeFile(marker, '{"retained":170}\n', 'utf8');
    const resumed = await prepareLongMemEvalQuestionState({
        stateDir,
        resume: true,
        checkpointIdentity: identity
    });
    assert.equal(resumed.resumed, true);
    assert.deepEqual(resumed.ingestionCheckpoint.ingestion, ingestion);
    assert.equal(resumed.ingestionCheckpoint.syntheticUserIsolation.ok, true);
    assert.equal(await fs.readFile(marker, 'utf8'), '{"retained":170}\n');

    const mismatch = await prepareLongMemEvalQuestionState({
        stateDir,
        resume: true,
        checkpointIdentity: {
            ...identity,
            questionId: 'question-b'
        }
    });
    assert.equal(mismatch.resumed, false);
    await assert.rejects(fs.access(marker));
});

function fixture(overrides = {}) {
    return {
        question_id: 'fixture-question',
        question_type: 'single-session-user',
        question: 'Which tea do I always choose?',
        answer: 'GROUND_TRUTH_SENTINEL_DO_NOT_INGEST',
        question_date: '2023/04/10 (Mon) 23:07',
        answer_session_ids: ['session-evidence'],
        haystack_dates: [
            '2023/04/10 (Mon) 17:50',
            '2023/04/09 (Sun) 14:47'
        ],
        haystack_session_ids: [
            'session-filler',
            'session-evidence'
        ],
        haystack_sessions: [
            [
                { role: 'user', content: 'Let us discuss unrelated books.' },
                { role: 'assistant', content: 'Sure, I enjoy discussing books.' }
            ],
            [
                {
                    role: 'user',
                    content: 'I always choose jasmine tea.',
                    has_answer: true
                },
                { role: 'assistant', content: 'I will remember that.' }
            ]
        ],
        ...overrides
    };
}

test('LongMemEval timestamps are deterministic and Oracle sessions replay chronologically', () => {
    assert.equal(
        parseLongMemEvalTimestamp('2023/04/10 (Mon) 17:50'),
        '2023-04-10T17:50:00.000Z'
    );
    assert.equal(
        parseLongMemEvalTimestamp('2023/04/10 (Mon) 17:50', 1000),
        '2023-04-10T17:50:01.000Z'
    );
    assert.deepEqual(
        buildChronologicalSessions(fixture()).map((session) => session.sessionId),
        ['session-evidence', 'session-filler']
    );
});

test('LongMemEval session pairing preserves user/assistant content without label fields', () => {
    const pairs = pairLongMemEvalSession([
        { role: 'user', content: 'first', has_answer: true },
        { role: 'assistant', content: 'first reply' },
        { role: 'assistant', content: '' },
        { role: 'user', content: 'second' },
        { role: 'assistant', content: 'second reply' }
    ]);
    assert.deepEqual(pairs, [
        {
            userMessage: 'first',
            assistantMessage: 'first reply',
            messageIndexes: [0, 1]
        },
        {
            userMessage: 'second',
            assistantMessage: 'second reply',
            messageIndexes: [3, 4]
        }
    ]);
    assert.equal(JSON.stringify(pairs).includes('has_answer'), false);
});

test('LongMemEval streaming reader handles nested arrays and escaped strings', async () => {
    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-longmemeval-stream-'));
    const dataPath = path.join(rootDir, 'fixture.json');
    const entries = [
        fixture(),
        fixture({
            question_id: 'fixture-two',
            question: 'Which quoted value was used?',
            haystack_sessions: [[
                { role: 'user', content: 'The value is "{nested}".' },
                { role: 'assistant', content: 'Understood.' }
            ]],
            haystack_dates: ['2023/04/09 (Sun) 14:47'],
            haystack_session_ids: ['session-two'],
            answer_session_ids: ['session-two']
        })
    ];
    await fs.writeFile(dataPath, JSON.stringify(entries), 'utf8');
    const loaded = [];
    for await (const entry of readJsonArrayEntries(dataPath)) {
        loaded.push(entry);
    }
    assert.equal(loaded.length, 2);
    assert.equal(loaded[1].haystack_sessions[0][0].content, 'The value is "{nested}".');
});

test('LongMemEval replay uses native durable memory and excludes every ground-truth label', async () => {
    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-longmemeval-memory-'));
    const memoryRoot = path.join(rootDir, 'memory');
    const rawRoot = path.join(rootDir, 'raw-memory');
    const memoryRuntime = new AILISMemoryRuntime({
        rootDir: memoryRoot,
        workspaceRoot: rootDir
    });
    const rawMemoryLedger = new AILISRawMemoryLedger({
        rootDir: rawRoot,
        workspaceRoot: rootDir
    });
    const gateway = {
        memoryRuntime,
        rawMemoryLedger,
        searchMemory: (query, options) => memoryRuntime.searchMemory(query, options)
    };

    const entry = fixture();
    assert.deepEqual(validateLongMemEvalEntry(entry), []);
    const ingestion = await ingestLongMemEvalHistory({ gateway, entry });
    assert.equal(ingestion.recordedTurns, 2);
    assert.equal(ingestion.recordedRawEntries, 2);
    assert.equal(ingestion.retainedEventCount, 2);

    const memoryText = await fs.readFile(path.join(memoryRoot, 'events.jsonl'), 'utf8');
    const rawFiles = await fs.readdir(path.join(rawRoot, 'entries'));
    const rawText = (
        await Promise.all(
            rawFiles.map((name) => fs.readFile(path.join(rawRoot, 'entries', name), 'utf8'))
        )
    ).join('\n');
    const persisted = `${memoryText}\n${rawText}`;
    assert.equal(persisted.includes('GROUND_TRUTH_SENTINEL_DO_NOT_INGEST'), false);
    assert.equal(persisted.includes('has_answer'), false);
    assert.equal(persisted.includes('answer_session_ids'), false);
    assert.match(persisted, /I always choose jasmine tea/);
    assert.match(persisted, /2023-04-09T14:47:00.000Z/);

    const restartedMemory = new AILISMemoryRuntime({
        rootDir: memoryRoot,
        workspaceRoot: rootDir
    });
    const restartedGateway = {
        searchMemory: (query, options) => restartedMemory.searchMemory(query, options)
    };
    const diagnostics = buildRetrievalDiagnostics(restartedGateway, entry);
    assert.equal(restartedMemory.getStatus().eventCount, 2);
    assert.equal(diagnostics.firstEvidenceRank, 1);
    assert.equal(diagnostics.evidenceSessionRecallAt8, 1);
    assert.equal(diagnostics.firstEvidenceTurnRank, 1);
    assert.equal(diagnostics.evidenceTurnRecallAt8, 1);
});

test('LongMemEval synthetic-user isolation clears product defaults but preserves Persona', async () => {
    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-longmemeval-identity-'));
    const memoryRuntime = new AILISMemoryRuntime({
        rootDir: path.join(rootDir, 'memory'),
        workspaceRoot: rootDir
    });
    const gateway = {
        memoryRuntime,
        updateMemoryBlock: (key, value) => memoryRuntime.updateBlock(key, value),
        getMemorySnapshot: (options) => memoryRuntime.getSnapshot(options)
    };
    const before = memoryRuntime.getSnapshot({ includeEvents: false });
    assert.ok(before.blocks.find((block) => block.key === 'user')?.value);
    assert.ok(before.blocks.find((block) => block.key === 'project')?.value);

    const isolation = isolateLongMemEvalSyntheticUser(gateway);
    const after = memoryRuntime.getSnapshot({ includeEvents: false });
    assert.equal(isolation.ok, true);
    assert.equal(isolation.personaPreserved, true);
    for (const key of ['user', 'relationship', 'project']) {
        assert.equal(after.blocks.find((block) => block.key === key)?.value, '');
    }
    assert.ok(after.blocks.find((block) => block.key === 'persona')?.value);

    const restartedRuntime = new AILISMemoryRuntime({
        rootDir: path.join(rootDir, 'memory'),
        workspaceRoot: rootDir
    });
    const restarted = restartedRuntime.getSnapshot({ includeEvents: false });
    for (const key of ['user', 'relationship', 'project']) {
        assert.equal(restarted.blocks.find((block) => block.key === key)?.value, '');
    }
    assert.ok(restarted.blocks.find((block) => block.key === 'persona')?.value);
});

test('LongMemEval profile curation drain repeats native bounded runs until the cursor catches up', async () => {
    const calls = [];
    const responses = [
        {
            ok: true,
            status: 'partial_completed',
            run: {
                status: 'partial_completed',
                processedEntryCount: 80,
                remainingEntryCount: 25,
                batchCount: 4,
                evidenceCount: 40
            }
        },
        {
            ok: true,
            status: 'completed',
            run: {
                status: 'completed',
                processedEntryCount: 25,
                remainingEntryCount: 0,
                batchCount: 2,
                evidenceCount: 12
            }
        }
    ];
    const gateway = {
        async curateUserProfile(options) {
            calls.push(options);
            return responses.shift();
        }
    };
    const result = await runLongMemEvalProfileCuration({
        gateway,
        mode: 'drain',
        nowIso: '2023-04-10T23:07:00.000Z'
    });
    assert.equal(calls.length, 2);
    assert.deepEqual(calls[0], {
        force: true,
        nowIso: '2023-04-10T23:07:00.000Z'
    });
    assert.equal(result.ok, true);
    assert.equal(result.drained, true);
    assert.equal(result.passCount, 2);
    assert.equal(result.processedEntryCount, 105);
    assert.equal(result.batchCount, 6);
    assert.equal(result.evidenceCount, 52);
});

test('LongMemEval cognition drain repeats bounded evidence-grounded runs until caught up', async () => {
    const calls = [];
    const responses = [{
        ok: true,
        status: 'partial_completed',
        run: {
            processedEntryCount: 60,
            remainingEntryCount: 10,
            batchCount: 12,
            unitCount: 9
        }
    }, {
        ok: true,
        status: 'completed',
        run: {
            processedEntryCount: 10,
            remainingEntryCount: 0,
            batchCount: 2,
            unitCount: 3
        }
    }];
    const result = await runLongMemEvalCognitionCuration({
        gateway: {
            async curateMemoryCognition(options) {
                calls.push(options);
                return responses.shift();
            }
        },
        mode: 'drain',
        nowIso: '2023-04-10T23:07:00.000Z'
    });
    assert.equal(calls.length, 2);
    assert.equal(calls[0].maxBatches, 12);
    assert.equal(result.ok, true);
    assert.equal(result.drained, true);
    assert.equal(result.processedEntryCount, 70);
    assert.equal(result.unitCount, 12);
});

test('LongMemEval async retrieval records the selected strategy without exposing answer labels', async () => {
    let captured = null;
    const entry = fixture();
    const diagnostics = await buildRetrievalDiagnosticsAsync({
        async searchMemoryAsync(query, options) {
            captured = { query, options };
            return {
                strategy: 'chronos_dual_calendar_v1',
                diagnostics: { queryPlanSource: 'model' },
                events: [{
                    id: 'evidence-turn',
                    sessionId: 'session-evidence',
                    ts: '2023-04-09T14:47:00.000Z'
                }]
            };
        }
    }, entry);
    assert.equal(diagnostics.memoryStrategy, 'chronos_dual_calendar_v1');
    assert.equal(diagnostics.evidenceSessionRecallAt8, 1);
    assert.equal(captured.options.questionTime, '2023-04-10T23:07:00.000Z');
    assert.equal(captured.query, entry.question);
    assert.equal(captured.query.includes('GROUND_TRUTH_SENTINEL_DO_NOT_INGEST'), false);
    assert.equal(captured.query.includes('session-evidence'), false);
});

test('LongMemEval final question is read-only, starts without short-term history, and disables TaskAgent', async () => {
    let capturedRequest = null;
    const gateway = {
        async runAgent(request) {
            capturedRequest = request;
            return {
                ok: true,
                status: 'completed',
                displayText: 'You prefer jasmine tea.',
                steps: []
            };
        }
    };
    const entry = fixture();
    const answer = await answerLongMemEvalQuestion({
        gateway,
        entry,
        llmSettings: {
            provider: 'test-provider',
            model: 'test-model'
        }
    });
    assert.equal(answer.ok, true);
    assert.equal(answer.hypothesis, 'You prefer jasmine tea.');
    assert.deepEqual(capturedRequest.messageHistory, []);
    assert.equal(capturedRequest.memoryPolicy, 'read_only');
    assert.equal(capturedRequest.agentRole, 'persona_orchestrator');
    assert.equal(capturedRequest.maxAgentSteps, undefined);
    assert.equal(capturedRequest.context.maxAgentSteps, undefined);
    assert.equal(capturedRequest.context.directToolExecutor, false);
    assert.equal(capturedRequest.context.nativeDirectTools, false);
    assert.equal(capturedRequest.context.requireTaskExecution, false);
    assert.equal(capturedRequest.context.desktopRealEval, true);
    assert.deepEqual(capturedRequest.retrievalRequest, {
        query: entry.question,
        referenceTime: '2023-04-10T23:07:00.000Z',
        source: 'longmemeval_public_question'
    });
    assert.deepEqual(capturedRequest.context.retrievalRequest, capturedRequest.retrievalRequest);
    assert.equal(
        capturedRequest.context.runtimeEnvironmentOverride.current_datetime,
        '2023-04-10T23:07:00.000+00:00'
    );
    assert.equal(capturedRequest.evaluationName, undefined);
    assert.equal(capturedRequest.answerOnly, undefined);
});

test('LongMemEval question prompt contains only public question fields', () => {
    const prompt = buildLongMemEvalQuestionPrompt(fixture());
    assert.match(prompt, /Current Date: 2023\/04\/10 \(Mon\) 23:07/);
    assert.match(prompt, /Question: Which tea do I always choose\?/);
    assert.equal(prompt.includes('GROUND_TRUTH_SENTINEL_DO_NOT_INGEST'), false);
    assert.equal(prompt.includes('session-evidence'), false);
    assert.equal(prompt.includes('has_answer'), false);
    assert.deepEqual(buildLongMemEvalClockOverride(fixture()), {
        source: 'longmemeval_benchmark_clock',
        current_date: '2023-04-10',
        current_time: '23:07:00',
        current_datetime: '2023-04-10T23:07:00.000+00:00',
        timezone: 'UTC',
        utc_offset: '+00:00'
    });
});
