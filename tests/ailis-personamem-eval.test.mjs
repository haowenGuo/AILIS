import test from 'node:test';
import assert from 'node:assert/strict';
import {
    PERSONAMEM_128K_TYPES,
    curatePersonaMemLedger,
    pairPersonaMemMessages,
    parseCsv,
    scorePersonaMemAnswer,
    selectBalancedPersonaMemSample,
    selectStratifiedPersonaMemSample,
    shardPersonaMemSample,
    slicePersonaMemContext
} from '../scripts/ailis-personamem-runtime.mjs';

test('PersonaMem Ledger curation consumes deterministic partial passes', async () => {
    const responses = [
        { ok: true, status: 'partial_completed', run: { processedEventCount: 100, evidenceCount: 80, batchCount: 100, supersededCount: 2, remainingEntryCount: 150 }, stateSummary: { recordCount: 12 } },
        { ok: true, status: 'partial_completed', run: { processedEventCount: 100, evidenceCount: 70, batchCount: 100, supersededCount: 1, remainingEntryCount: 50 }, stateSummary: { recordCount: 19 } },
        { ok: true, status: 'completed', run: { processedEventCount: 50, evidenceCount: 40, batchCount: 50, supersededCount: 0, remainingEntryCount: 0 }, stateSummary: { recordCount: 23 } }
    ];
    const calls = [];
    const memory = {
        getStatus: () => ({ eventCount: 250 }),
        curateMemoryLedger: async (options) => {
            calls.push(options);
            return responses.shift();
        }
    };
    const result = await curatePersonaMemLedger(memory, {
        eventLimit: 8,
        maxChars: 20_000,
        maxTokens: 5_000,
        timeoutMs: 180_000,
        modelAttempts: 3
    });
    assert.equal(result.ok, true);
    assert.equal(result.status, 'completed');
    assert.equal(result.passCount, 3);
    assert.equal(result.processedEventCount, 250);
    assert.equal(result.batchCount, 250);
    assert.equal(result.recordCount, 23);
    assert.equal(result.remainingEntryCount, 0);
    assert.equal(calls.length, 3);
    assert.ok(calls.every((call) => call.maxBatches === 100));
    assert.ok(calls.every((call) => call.eventLimit === 8));
});

test('PersonaMem Ledger curation retries transient no-progress model failures', async () => {
    const responses = [
        { ok: false, status: 'llm_failed', error: 'request timeout' },
        { ok: true, status: 'completed', run: { processedEventCount: 8, evidenceCount: 8, batchCount: 1, remainingEntryCount: 0 }, stateSummary: { recordCount: 2 } }
    ];
    const memory = {
        getStatus: () => ({ eventCount: 8 }),
        curateMemoryLedger: async () => responses.shift()
    };
    const result = await curatePersonaMemLedger(memory, {
        modelAttempts: 3,
        noProgressRetries: 2,
        noProgressRetryDelayMs: 0
    });
    assert.equal(result.ok, true);
    assert.equal(result.passCount, 2);
    assert.equal(result.processedEventCount, 8);
    assert.equal(result.remainingEntryCount, 0);
});

test('PersonaMem CSV parser preserves quoted option lists and embedded commas', () => {
    const rows = parseCsv([
        'question_id,all_options,correct_answer',
        'q1,"(a) tea, hot\\n(b) coffee\\n(c) water\\n(d) juice",(b)'
    ].join('\n'));
    assert.equal(rows.length, 1);
    assert.match(rows[0].all_options, /tea, hot/);
    assert.equal(rows[0].correct_answer, '(b)');
});

test('PersonaMem slicing matches official exclusive Python context[:end_index] semantics', () => {
    const contexts = new Map([['ctx', [
        { role: 'system', content: 'persona' },
        { role: 'user', content: 'included user' },
        { role: 'assistant', content: 'included assistant' },
        { role: 'user', content: 'must be excluded' }
    ]]]);
    const slice = slicePersonaMemContext({
        shared_context_id: 'ctx',
        end_index_in_shared_context: '3'
    }, contexts);
    assert.equal(slice.includedMessageCount, 3);
    assert.equal(slice.excludedMessageCount, 1);
    assert.equal(slice.includedLastMessage.content, 'included assistant');
    assert.equal(slice.excludedFirstMessage.content, 'must be excluded');
    assert.ok(!JSON.stringify(slice.messages).includes('must be excluded'));
});

test('PersonaMem negative end index matches official Python context[:-1] semantics', () => {
    const contexts = new Map([['ctx', [
        { role: 'system', content: 'persona' },
        { role: 'user', content: 'included' },
        { role: 'assistant', content: 'excluded tail' }
    ]]]);
    const slice = slicePersonaMemContext({
        shared_context_id: 'ctx',
        end_index_in_shared_context: '-1'
    }, contexts);
    assert.equal(slice.endIndex, -1);
    assert.equal(slice.resolvedEndIndex, 2);
    assert.equal(slice.includedMessageCount, 2);
    assert.equal(slice.excludedFirstMessage.content, 'excluded tail');
});

test('PersonaMem replay pairs role-prefixed messages without dropping consecutive user turns', () => {
    const paired = pairPersonaMemMessages([
        { role: 'system', content: 'Current user persona: 1' },
        { role: 'user', content: 'User: first preference' },
        { role: 'user', content: 'User: second preference' },
        { role: 'assistant', content: 'Assistant: acknowledged' }
    ]);
    assert.equal(paired.systemMessages.length, 1);
    assert.equal(paired.turns.length, 2);
    assert.equal(paired.turns[0].userMessage, 'first preference');
    assert.equal(paired.turns[0].assistantMessage, '');
    assert.equal(paired.turns[1].userMessage, 'second preference');
    assert.equal(paired.turns[1].assistantMessage, 'acknowledged');
});

test('PersonaMem replay deduplicates repeated identical system persona declarations only', () => {
    const paired = pairPersonaMemMessages([
        { role: 'system', content: 'Current user persona: Ada' },
        { role: 'user', content: 'User: first' },
        { role: 'assistant', content: 'Assistant: ok' },
        { role: 'system', content: 'Current user persona: Ada' },
        { role: 'user', content: 'User: second' }
    ]);
    assert.equal(paired.sourceSystemMessageCount, 2);
    assert.equal(paired.systemMessages.length, 1);
    assert.equal(paired.turns.length, 2);
});

test('PersonaMem 128K sampler returns exactly N rows for each of seven categories', () => {
    const contexts = new Map();
    const rows = [];
    for (let groupIndex = 0; groupIndex < 3; groupIndex += 1) {
        const contextId = `ctx-${groupIndex}`;
        contexts.set(contextId, [
            { role: 'system', content: `persona ${groupIndex}` },
            { role: 'user', content: `history ${groupIndex}` }
        ]);
        for (const [typeIndex, type] of PERSONAMEM_128K_TYPES.entries()) {
            rows.push({
                persona_id: String(groupIndex),
                question_id: `q-${groupIndex}-${typeIndex}`,
                question_type: type,
                shared_context_id: contextId,
                end_index_in_shared_context: '2'
            });
        }
    }
    const sample = selectStratifiedPersonaMemSample(rows, contexts, {
        perType: 3,
        seed: 'test-seed'
    });
    assert.equal(sample.selectedRows.length, 21);
    assert.equal(sample.targetTypes.length, 7);
    assert.equal(sample.personaCount, 3);
    for (const type of PERSONAMEM_128K_TYPES) {
        assert.equal(sample.selectedRows.filter((row) => row.question_type === type).length, 3);
    }
});

test('PersonaMem answer scoring follows the official single-option rule', () => {
    assert.equal(
        scorePersonaMemAnswer('Reasoning\n<final_answer>(c)</final_answer>', '(c)').correct,
        true
    );
    assert.equal(scorePersonaMemAnswer('(a) or (c)', '(c)').correct, false);
    assert.equal(scorePersonaMemAnswer('final answer c', '(c)').correct, true);
});

test('PersonaMem balanced sampler selects one row per persona and query type', () => {
    const contexts = new Map();
    const rows = [];
    for (let persona = 0; persona < 2; persona += 1) {
        const contextId = `balanced-${persona}`;
        contexts.set(contextId, [
            { role: 'system', content: `persona ${persona}` },
            { role: 'user', content: `history ${persona}` }
        ]);
        for (const [index, type] of PERSONAMEM_128K_TYPES.entries()) {
            rows.push({
                persona_id: String(persona),
                question_id: `balanced-q-${persona}-${index}`,
                question_type: type,
                shared_context_id: contextId,
                end_index_in_shared_context: '2'
            });
        }
    }
    const sample = selectBalancedPersonaMemSample(rows, contexts, { seed: 'balanced-test' });
    assert.equal(sample.selectedRows.length, 14);
    assert.equal(sample.selectedGroups.length, 2);
    assert.equal(sample.personaCount, 2);
    for (const persona of ['0', '1']) {
        for (const type of PERSONAMEM_128K_TYPES) {
            assert.equal(sample.selectedRows.filter((row) =>
                row.persona_id === persona && row.question_type === type).length, 1);
        }
    }
});

test('PersonaMem shards are deterministic, disjoint, and complete', () => {
    const groups = Array.from({ length: 6 }, (_, index) => ({
        key: `group-${index}`,
        slice: { messages: [{ role: 'user', content: `history ${index}` }] },
        selectedRows: [{ question_id: `q-${index}`, persona_id: String(index % 2) }]
    }));
    const sample = {
        seed: 'shard-test',
        targetTypes: PERSONAMEM_128K_TYPES,
        selectedGroups: groups,
        selectedRows: groups.flatMap((group) => group.selectedRows),
        personaCount: 2
    };
    const shards = [0, 1, 2].map((shardIndex) =>
        shardPersonaMemSample(sample, { shardIndex, shardCount: 3 }));
    const ids = shards.flatMap((shard) => shard.selectedRows.map((row) => row.question_id));
    assert.equal(ids.length, 6);
    assert.equal(new Set(ids).size, 6);
    assert.deepEqual([...ids].sort(), sample.selectedRows.map((row) => row.question_id).sort());
});
