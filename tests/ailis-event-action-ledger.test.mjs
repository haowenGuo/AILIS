import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const {
    AILISEventActionLedger,
    EVENT_ACTION_EXTRACTION_VERSION,
    EVENT_ACTION_LEDGER_FILE
} = require('../electron/ailis-event-action-ledger.cjs');
const {
    AILISMemoryStrategyEngine,
    MEMORY_STRATEGIES
} = require('../electron/ailis-memory-strategies.cjs');
const {
    AILISMemoryRuntime
} = require('../electron/ailis-memory-store.cjs');

async function temporaryDirectory(t, prefix) {
    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), prefix));
    t.after(() => fs.rm(rootDir, { recursive: true, force: true }));
    return rootDir;
}

function memoryEvent({
    id,
    sessionId,
    ts,
    userText,
    assistantText = '',
    source = 'conversation'
}) {
    return {
        id,
        sessionId,
        ts,
        source,
        userText,
        assistantText,
        tags: [],
        importance: 1
    };
}

function ledgerExtractionForCall(callIndex) {
    if (callIndex === 0) {
        return {
            records: [
                {
                    kind: 'action',
                    canonicalKey: 'navy_blazer_dry_cleaning_pickup',
                    entity: 'navy blue blazer',
                    entityType: 'object',
                    actionType: 'pickup',
                    status: 'pending',
                    summary: 'The user still needs to pick up the navy blue blazer from dry cleaning.',
                    evidenceEventIds: ['blazer'],
                    confidence: 0.99
                },
                {
                    kind: 'action',
                    canonicalKey: 'zara_old_boots_return',
                    entity: 'old Zara boots in the smaller size',
                    entityType: 'object',
                    actionType: 'return',
                    status: 'pending',
                    summary: 'The old, too-small Zara boots still need to be returned.',
                    occurredAt: '2025-02-05T00:00:00.000Z',
                    evidenceEventIds: ['exchange'],
                    confidence: 0.96
                },
                {
                    kind: 'action',
                    canonicalKey: 'zara_replacement_boots_pickup',
                    entity: 'replacement Zara boots in the larger size',
                    entityType: 'object',
                    actionType: 'pickup',
                    status: 'pending',
                    summary: 'The replacement Zara boots still need to be picked up.',
                    occurredAt: '2025-02-05T00:00:00.000Z',
                    evidenceEventIds: ['exchange'],
                    confidence: 0.98
                },
                {
                    kind: 'action',
                    canonicalKey: 'invented_record',
                    entity: 'invented object',
                    actionType: 'pickup',
                    status: 'pending',
                    summary: 'This record cites evidence that was never supplied.',
                    evidenceEventIds: ['invented-source'],
                    confidence: 1
                }
            ],
            rejectedEvidenceEventIds: []
        };
    }
    return {
        records: [{
            kind: 'action',
            canonicalKey: 'zara_replacement_boots_pickup',
            entity: 'replacement Zara boots in the larger size',
            entityType: 'object',
            actionType: 'pickup',
            status: 'pending',
            summary: 'The replacement Zara boots remain ready for pickup.',
            evidenceEventIds: ['replacement-reminder'],
            confidence: 0.99
        }],
        rejectedEvidenceEventIds: []
    };
}

test('Event/Action Ledger is a provenance-only sidecar that splits and merges lifecycle actions', async (t) => {
    const rootDir = await temporaryDirectory(t, 'ailis-event-ledger-');
    const events = [
        memoryEvent({
            id: 'blazer',
            sessionId: 'closet-one',
            ts: '2025-02-15T06:30:00.000Z',
            userText: 'I still need to pick up my dry cleaning for the navy blue blazer.'
        }),
        memoryEvent({
            id: 'exchange',
            sessionId: 'closet-two',
            ts: '2025-02-15T11:13:00.000Z',
            userText: 'I need to return the small Zara boots and pick up the larger replacement.'
        }),
        memoryEvent({
            id: 'replacement-reminder',
            sessionId: 'closet-three',
            ts: '2025-02-15T16:19:00.000Z',
            userText: 'I still need to pick up the new pair of Zara boots.'
        }),
        memoryEvent({
            id: 'executor-trace',
            sessionId: 'main:task-agent:1',
            ts: '2025-02-15T16:20:00.000Z',
            userText: 'Internal TaskAgent action must never become Persona memory.',
            source: 'task-agent'
        })
    ];
    const originalEvents = structuredClone(events);
    let callCount = 0;
    const ledger = new AILISEventActionLedger({
        rootDir,
        llmClient: async () => ({
            ok: true,
            content: JSON.stringify(ledgerExtractionForCall(callCount++))
        })
    });

    const result = await ledger.curate({
        events,
        eventLimit: 2,
        maxBatches: 10,
        nowIso: '2025-02-15T23:50:00.000Z'
    });
    assert.equal(result.ok, true);
    assert.equal(result.status, 'completed');
    assert.equal(result.run.processedEventCount, 4);
    assert.equal(result.run.recordCount, 3);
    assert.equal(result.run.mergedRecordCount, 1);
    assert.equal(result.run.rejectedRecordCount, 1);
    assert.deepEqual(events, originalEvents);

    const records = ledger.listRecords();
    assert.equal(records.length, 3);
    assert.deepEqual(
        records.map((record) => `${record.actionType}:${record.entity}`).sort(),
        [
            'pickup:navy blue blazer',
            'pickup:replacement Zara boots in the larger size',
            'return:old Zara boots in the smaller size'
        ]
    );
    const replacement = records.find(
        (record) => record.canonicalKey === 'zara_replacement_boots_pickup'
    );
    const oldBoots = records.find(
        (record) => record.canonicalKey === 'zara_old_boots_return'
    );
    assert.equal(
        oldBoots.occurredAt,
        '',
        'a model-resolved date without a verbatim temporal anchor must be rejected'
    );
    assert.deepEqual(
        replacement.sourceEventIds.sort(),
        ['exchange', 'replacement-reminder']
    );
    assert.deepEqual(
        replacement.sourceSessionIds.sort(),
        ['closet-three', 'closet-two']
    );
    assert.equal(replacement.extractionVersion, EVENT_ACTION_EXTRACTION_VERSION);
    assert.ok(records.every((record) =>
        record.sourceEventIds.every((id) => id !== 'invented-source')
    ));
    assert.ok(records.every((record) =>
        record.sourceEventIds.every((id) => id !== 'executor-trace')
    ));
    assert.deepEqual(
        JSON.parse(await fs.readFile(path.join(rootDir, EVENT_ACTION_LEDGER_FILE), 'utf8'))
            .records
            .map((record) => record.id)
            .sort(),
        records.map((record) => record.id).sort()
    );
});

test('Memory v3 retrieves through BM25, multilingual E5, temporal, and entity channels while preserving raw anchors', async (t) => {
    const rootDir = await temporaryDirectory(t, 'ailis-memory-v3-search-');
    const events = [
        memoryEvent({
            id: 'blazer',
            sessionId: 'closet-one',
            ts: '2025-02-15T06:30:00.000Z',
            userText: 'I still need to pick up my dry cleaning for the navy blue blazer.'
        }),
        memoryEvent({
            id: 'exchange',
            sessionId: 'closet-two',
            ts: '2025-02-15T11:13:00.000Z',
            userText: 'I need to return the small Zara boots and pick up the larger replacement.'
        }),
        memoryEvent({
            id: 'replacement-reminder',
            sessionId: 'closet-three',
            ts: '2025-02-15T16:19:00.000Z',
            userText: 'I still need to pick up the new pair of Zara boots.'
        }),
        memoryEvent({
            id: 'noise',
            sessionId: 'unrelated',
            ts: '2025-02-14T00:00:00.000Z',
            userText: 'I read a book about garden design.'
        })
    ];
    let extractionCall = 0;
    const ledger = new AILISEventActionLedger({
        rootDir,
        llmClient: async () => ({
            ok: true,
            content: JSON.stringify(ledgerExtractionForCall(extractionCall++))
        })
    });
    await ledger.curate({
        events: events.slice(0, 3),
        eventLimit: 2,
        maxBatches: 10,
        nowIso: '2025-02-15T23:50:00.000Z'
    });

    const queryPlanner = async () => ({
        ok: true,
        content: JSON.stringify({
            searchQueries: [
                'clothing items the user needs to pick up or return',
                'pending pickup return clothing'
            ],
            targetEntities: [
                'navy blue blazer',
                'old Zara boots',
                'replacement Zara boots'
            ],
            targetActionTypes: ['pickup', 'return'],
            targetStates: ['pending'],
            targetRecordKinds: ['action'],
            semanticKeys: ['pending_clothing_actions'],
            includeLanes: ['event'],
            needsCoverage: true,
            needsLatestState: false,
            reasoningHint: 'Retrieve every distinct active pickup and return action.'
        })
    });
    const embedder = async (texts) => texts.map((text) => {
        const normalized = text.toLowerCase();
        return normalized.includes('clothing') ||
            normalized.includes('blazer') ||
            normalized.includes('boots')
            ? [1, 0, 0]
            : [0, 1, 0];
    });
    const engine = new AILISMemoryStrategyEngine({
        rootDir,
        strategy: 'hybrid_rrf_ledger_v3',
        queryPlanner,
        embedder,
        eventActionLedger: ledger
    });
    const result = await engine.search({
        query: 'How many items of clothing do I need to pick up or return from a store?',
        events,
        limit: 8,
        questionTime: '2025-02-15T23:50:00.000Z',
        maxContextChars: 20_000
    });

    assert.equal(result.ok, true);
    assert.equal(result.strategy, 'hybrid_rrf_ledger_v3');
    assert.deepEqual(
        Object.keys(result.diagnostics.channels),
        ['bm25', 'multilingual_e5', 'temporal', 'entity']
    );
    assert.equal(result.diagnostics.selectedLedgerRecordCount, 3);
    assert.match(result.contextText, /navy blue blazer/);
    assert.match(result.contextText, /old, too-small Zara boots/);
    assert.match(result.contextText, /replacement Zara boots/);
    assert.match(result.contextText, /provenance: eventIds=/);
    assert.match(result.contextText, /Retrieved immutable raw conversation evidence/);
    assert.deepEqual(
        new Set(result.events.slice(0, 3).map((event) => event.id)),
        new Set(['exchange', 'blazer', 'replacement-reminder'])
    );
    assert.ok(result.events.every((event) => event.userText));
    assert.equal(
        MEMORY_STRATEGIES.hybrid_rrf_ledger_v3.fidelity,
        'native_ailis_full_implementation'
    );
});

test('Event/Action Ledger retries a transient model failure without advancing accepted evidence early', async (t) => {
    const rootDir = await temporaryDirectory(t, 'ailis-event-ledger-retry-');
    const events = [memoryEvent({
        id: 'degree',
        sessionId: 'education',
        ts: '2025-02-15T10:00:00.000Z',
        userText: 'My degree is in Business Administration.'
    })];
    let attempts = 0;
    const ledger = new AILISEventActionLedger({
        rootDir,
        llmClient: async () => {
            attempts += 1;
            if (attempts === 1) {
                throw new Error('temporary model transport failure');
            }
            return {
                ok: true,
                content: JSON.stringify({
                    records: [{
                        kind: 'state',
                        canonicalKey: 'user_degree',
                        entity: 'user degree',
                        status: 'completed',
                        summary: 'The user has a degree in Business Administration.',
                        stateChanges: [{
                            field: 'degree',
                            from: '',
                            to: 'Business Administration',
                            rawText: 'degree is in Business Administration'
                        }],
                        evidenceEventIds: ['degree'],
                        confidence: 1
                    }]
                })
            };
        }
    });

    const result = await ledger.curate({ events, maxBatches: 1 });
    assert.equal(result.ok, true);
    assert.equal(attempts, 2);
    assert.equal(ledger.listRecords().length, 1);
    assert.deepEqual(
        ledger.listRecords()[0].sourceEventIds,
        ['degree']
    );
});

test('forget and clear remove only derived ledger data through MemoryRuntime lifecycle', async (t) => {
    const rootDir = await temporaryDirectory(t, 'ailis-memory-v3-lifecycle-');
    const memory = new AILISMemoryRuntime({
        rootDir,
        memoryStrategy: 'hybrid_rrf_ledger_v3',
        memoryQueryPlanner: async () => ({
            ok: true,
            content: JSON.stringify({
                records: [{
                    kind: 'measurement',
                    canonicalKey: 'five_k_personal_best',
                    entity: '5K personal best',
                    status: 'completed',
                    summary: 'The user set a 5K personal best of 25:50.',
                    quantities: [{
                        kind: 'duration',
                        value: '25:50',
                        unit: 'minutes:seconds',
                        rawText: '5K PB is 25:50'
                    }],
                    evidenceEventIds: ['pb-event'],
                    confidence: 1
                }]
            })
        }),
        enableLocalEmbeddings: false
    });
    memory.state.events.push(memoryEvent({
        id: 'pb-event',
        sessionId: 'running',
        ts: '2025-02-15T10:00:00.000Z',
        userText: 'My new 5K PB is 25:50.'
    }));
    const curated = await memory.curateMemoryLedger({ maxBatches: 2 });
    assert.equal(curated.ok, true);
    const savedLedger = JSON.parse(
        await fs.readFile(path.join(rootDir, EVENT_ACTION_LEDGER_FILE), 'utf8')
    );
    assert.equal(savedLedger.records[0].quantities[0].value, '25:50');
    assert.equal(savedLedger.records[0].quantities[0].rawText, '5K PB is 25:50');
    assert.equal(savedLedger.records[0].quantities[0].rawTextVerified, true);
    assert.equal(
        memory.getStatus().memoryStrategyStatus.eventActionLedger.recordCount,
        1
    );

    assert.equal(memory.forgetMemory({ id: 'pb-event' }).ok, true);
    assert.equal(
        memory.getStatus().memoryStrategyStatus.eventActionLedger.recordCount,
        0
    );

    memory.state.events.push(memoryEvent({
        id: 'pb-event',
        sessionId: 'running',
        ts: '2025-02-15T10:00:00.000Z',
        userText: 'My new 5K PB is 25:50.'
    }));
    await memory.curateMemoryLedger({ maxBatches: 2 });
    assert.equal(
        memory.getStatus().memoryStrategyStatus.eventActionLedger.recordCount,
        1
    );
    memory.clearMemory();
    assert.equal(memory.getStatus().eventCount, 0);
    assert.equal(
        memory.getStatus().memoryStrategyStatus.eventActionLedger.recordCount,
        0
    );
});
