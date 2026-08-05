import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const {
    AILISMemoryStrategyEngine,
    DEFAULT_DENSE_REVISION,
    LocalEmbeddingRuntime,
    MEMORY_STRATEGIES,
    reciprocalRankFusion,
    resolveMemoryStrategy,
    strategyCatalog
} = require('../electron/ailis-memory-strategies.cjs');
const {
    AILISMemoryCognitionCurator
} = require('../electron/ailis-memory-cognition-curator.cjs');
const {
    AILISRawMemoryLedger
} = require('../electron/ailis-raw-memory-ledger.cjs');
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
    assistantText = ''
}) {
    return {
        id,
        sessionId,
        ts,
        source: 'conversation',
        userText,
        assistantText,
        tags: [],
        importance: 1
    };
}

test('AILIS separates full strategies from their historical prototypes', () => {
    assert.equal(strategyCatalog().length, 12);
    assert.deepEqual(
        new Set(strategyCatalog().map((entry) => entry.id)),
        new Set(Object.keys(MEMORY_STRATEGIES))
    );
    assert.equal(resolveMemoryStrategy('baseline'), 'bm25_phrase_v1');
    assert.equal(resolveMemoryStrategy('bm25'), 'bm25_phrase_v2');
    assert.equal(resolveMemoryStrategy('hybrid'), 'hybrid_crossencoder_v2');
    assert.equal(resolveMemoryStrategy('chronos'), 'chronos_full_v1');
    assert.equal(resolveMemoryStrategy('mastra'), 'mastra_observational_full_v1');
    assert.equal(
        resolveMemoryStrategy('mastra-adapter'),
        'mastra_observational_adapter_v1'
    );
    assert.equal(resolveMemoryStrategy('hindsight'), 'hindsight_official_v1');
    assert.equal(
        resolveMemoryStrategy('memory-v3'),
        'hybrid_rrf_ledger_v3'
    );
    assert.equal(
        resolveMemoryStrategy('chronos-prototype'),
        'chronos_dual_calendar_v1'
    );
    assert.ok(
        strategyCatalog()
            .filter((entry) => entry.maturity === 'prototype')
            .every((entry) => entry.label.includes('[Prototype]'))
    );
});

test('prototype dense runtime preserves the pinned model cache and offline configuration', () => {
    const cacheDir = path.join(os.tmpdir(), 'ailis-prototype-dense-cache');
    const runtime = new LocalEmbeddingRuntime({
        enabled: true,
        model: 'Xenova/multilingual-e5-small',
        revision: DEFAULT_DENSE_REVISION,
        allowRemoteModels: false,
        remoteHost: 'https://models.example/',
        cacheDir,
        embedder: async (texts) => texts.map(() => [1, 0])
    });
    const status = runtime.getStatus();
    assert.equal(status.revision, DEFAULT_DENSE_REVISION);
    assert.equal(status.allowRemoteModels, false);
    assert.equal(status.remoteHost, 'https://models.example');
    assert.equal(status.cacheDir, path.resolve(cacheDir));

    const engine = new AILISMemoryStrategyEngine({
        rootDir: os.tmpdir(),
        strategy: 'hybrid_rrf_v1',
        enableLocalEmbeddings: true,
        embeddingRevision: DEFAULT_DENSE_REVISION,
        allowRemoteModels: false,
        modelRemoteHost: 'https://models.example/',
        modelCacheDir: cacheDir,
        embedder: async (texts) => texts.map(() => [1, 0])
    });
    assert.deepEqual(
        engine.embeddingRuntime.getStatus(),
        status
    );
});

test('prototype dense runtime bounds text and embeds in memory-safe batches', async () => {
    const calls = [];
    const runtime = new LocalEmbeddingRuntime({
        enabled: true,
        batchSize: 2,
        maxTextChars: 256,
        embedder: async (texts) => {
            calls.push(texts);
            return texts.map((text, index) => [text.length, index + 1]);
        }
    });
    const vectors = await runtime.embed(
        Array.from({ length: 5 }, (_, index) =>
            `${index}:${'x'.repeat(2_000)}:${index}`
        )
    );
    assert.deepEqual(calls.map((batch) => batch.length), [2, 2, 1]);
    assert.ok(calls.flat().every((text) => text.length <= 256));
    assert.equal(vectors.length, 5);
    assert.equal(runtime.getStatus().batchSize, 2);
    assert.equal(runtime.getStatus().maxLength, 512);
    assert.equal(runtime.getStatus().maxTextChars, 256);
    assert.equal(runtime.getStatus().runtime, 'injected');
});

test('MemoryRuntime defaults to lexical v2, preserves explicit v1, and persists strategy selection', async (t) => {
    const rootDir = await temporaryDirectory(t, 'ailis-runtime-strategy-');
    const baseline = new AILISMemoryRuntime({
        rootDir,
        enableLocalEmbeddings: false
    });
    baseline.recordTurn({
        sessionId: 'main',
        userMessage: 'My favorite flower is the iris.',
        assistantMessage: 'I will remember your favorite flower.'
    });
    assert.equal(
        baseline.searchMemory('favorite flower', { limit: 1 }).strategy,
        'bm25_phrase_v2'
    );
    assert.equal(
        baseline.searchMemory('favorite flower', {
            limit: 1,
            strategy: 'bm25_phrase_v1'
        }).strategy,
        'bm25_phrase_v1'
    );
    assert.equal(
        baseline.setMemoryStrategy('hybrid-prototype').strategy,
        'hybrid_rrf_v1'
    );
    const hybridResult = await baseline.searchMemoryAsync('favorite bloom', {
        limit: 1
    });
    assert.equal(hybridResult.strategy, 'hybrid_rrf_v1');
    const restarted = new AILISMemoryRuntime({
        rootDir,
        enableLocalEmbeddings: false
    });
    assert.equal(restarted.getStatus().memoryStrategy, 'hybrid_rrf_v1');
});

test('reciprocal-rank fusion combines independent retrieval channels deterministically', () => {
    const first = { id: 'first' };
    const second = { id: 'second' };
    const fused = reciprocalRankFusion([
        [
            { document: first, rank: 1 },
            { document: second, rank: 2 }
        ],
        [
            { document: second, rank: 1 },
            { document: first, rank: 2 }
        ]
    ]);
    assert.deepEqual(fused.map((entry) => entry.document.id), ['first', 'second']);
    assert.equal(fused[0].score, fused[1].score);
});

test('hybrid strategy can retrieve a paraphrase through an injected semantic embedder', async (t) => {
    const rootDir = await temporaryDirectory(t, 'ailis-hybrid-');
    const engine = new AILISMemoryStrategyEngine({
        rootDir,
        strategy: 'hybrid_rrf_v1',
        embedder: async (texts) => texts.map((text) => {
            const normalized = text.toLowerCase();
            return normalized.includes('feline') || normalized.includes('cat named miso')
                ? [1, 0]
                : [0, 1];
        })
    });
    const events = [
        memoryEvent({
            id: 'irrelevant',
            sessionId: 's1',
            ts: '2025-01-01T00:00:00.000Z',
            userText: 'I bought a blue notebook.'
        }),
        memoryEvent({
            id: 'semantic-match',
            sessionId: 's2',
            ts: '2025-01-02T00:00:00.000Z',
            userText: 'My cat named Miso sleeps on the sofa.'
        })
    ];
    const result = await engine.search({
        query: 'What is the name of my feline companion?',
        events,
        limit: 1
    });
    assert.equal(result.strategy, 'hybrid_rrf_v1');
    assert.equal(result.events[0]?.id, 'semantic-match');
    assert.equal(result.diagnostics.embedding.runtime, 'injected');
});

test('Chronos maps evidence-grounded temporal units back to the original raw turn', async (t) => {
    const rootDir = await temporaryDirectory(t, 'ailis-chronos-');
    await fs.writeFile(path.join(rootDir, 'memory-cognition.json'), JSON.stringify({
        version: 1,
        units: [{
            id: 'unit-trip',
            lane: 'event',
            semanticKey: 'kyoto_trip',
            statement: 'The user visited Kyoto during the spring holiday.',
            aliases: ['Japan vacation'],
            mentionAt: '2025-04-10T00:00:00.000Z',
            eventStart: '2025-04-02T00:00:00.000Z',
            confidence: 0.95,
            importance: 0.8,
            status: 'active',
            sources: [{
                evidenceId: 'raw-1',
                sessionId: 'trip-session',
                occurredAt: '2025-04-10T00:00:00.000Z'
            }]
        }],
        observations: [],
        mentalModels: []
    }), 'utf8');
    const engine = new AILISMemoryStrategyEngine({
        rootDir,
        strategy: 'chronos_dual_calendar_v1',
        embedder: async (texts) => texts.map((text) =>
            text.toLowerCase().includes('kyoto') ? [1, 0] : [0, 1]
        ),
        queryPlanner: async () => ({
            text: JSON.stringify({
                searchQueries: ['Where did the user travel during spring holiday? Kyoto'],
                targetEntities: ['user'],
                semanticKeys: ['kyoto_trip'],
                includeLanes: ['event'],
                timeRange: {
                    start: '2025-04-01T00:00:00.000Z',
                    end: '2025-04-30T23:59:59.000Z'
                },
                needsCoverage: false,
                needsLatestState: false
            })
        })
    });
    const result = await engine.search({
        query: 'Where did I go during the spring holiday?',
        questionTime: '2025-05-01T00:00:00.000Z',
        events: [memoryEvent({
            id: 'turn-trip',
            sessionId: 'trip-session',
            ts: '2025-04-10T00:00:00.000Z',
            userText: 'I just returned from Kyoto.'
        })],
        limit: 3
    });
    assert.equal(result.plan.source, 'model');
    assert.ok(result.documents.some((entry) => entry.id === 'unit:unit-trip'));
    assert.equal(result.events[0]?.id, 'turn-trip');
    assert.match(result.contextText, /Kyoto/);
});

test('observational memory exposes a stable dated context without TaskAgent material', async (t) => {
    const rootDir = await temporaryDirectory(t, 'ailis-observational-');
    await fs.writeFile(path.join(rootDir, 'memory-cognition.json'), JSON.stringify({
        version: 1,
        units: [],
        observations: [{
            id: 'obs-1',
            semanticKey: 'drink_preference',
            text: 'The user prefers unsweetened tea.',
            observedAt: '2025-01-03T00:00:00.000Z',
            priority: 0.8,
            confidence: 0.9,
            status: 'active',
            sources: [{
                evidenceId: 'raw-1',
                sessionId: 'main',
                occurredAt: '2025-01-03T00:00:00.000Z'
            }]
        }],
        mentalModels: [{
            id: 'mental-1',
            lane: 'preference',
            semanticKey: 'drink_model',
            text: 'Avoid recommending sugary drinks.',
            updatedAt: '2025-01-04T00:00:00.000Z',
            confidence: 0.9,
            importance: 0.8,
            status: 'active',
            sources: [{
                evidenceId: 'raw-1',
                sessionId: 'main',
                occurredAt: '2025-01-03T00:00:00.000Z'
            }]
        }]
    }), 'utf8');
    const engine = new AILISMemoryStrategyEngine({
        rootDir,
        strategy: 'observational_memory_v1'
    });
    const result = await engine.search({
        query: 'What should I drink?',
        events: [memoryEvent({
            id: 'tea-turn',
            sessionId: 'main',
            ts: '2025-01-03T00:00:00.000Z',
            userText: 'I prefer unsweetened tea.'
        })],
        limit: 8
    });
    assert.match(result.contextText, /unsweetened tea/);
    assert.match(result.contextText, /Avoid recommending sugary drinks/);
    assert.deepEqual(result.events.map((entry) => entry.id), ['tea-turn']);
});

test('Hindsight can retrieve an older superseded state for a historical question', async (t) => {
    const rootDir = await temporaryDirectory(t, 'ailis-hindsight-');
    await fs.writeFile(path.join(rootDir, 'memory-cognition.json'), JSON.stringify({
        version: 1,
        units: [{
            id: 'old-city',
            lane: 'world',
            semanticKey: 'home_city',
            statement: 'The user lived in Paris.',
            mentionAt: '2024-01-01T00:00:00.000Z',
            validFrom: '2024-01-01T00:00:00.000Z',
            validUntil: '2025-01-01T00:00:00.000Z',
            supersededBy: 'new-city',
            status: 'superseded',
            sources: [{
                sessionId: 'old-home',
                occurredAt: '2024-01-01T00:00:00.000Z'
            }]
        }, {
            id: 'new-city',
            lane: 'world',
            semanticKey: 'home_city',
            statement: 'The user now lives in Berlin.',
            mentionAt: '2025-01-01T00:00:00.000Z',
            validFrom: '2025-01-01T00:00:00.000Z',
            status: 'active',
            sources: [{
                sessionId: 'new-home',
                occurredAt: '2025-01-01T00:00:00.000Z'
            }]
        }],
        observations: [],
        mentalModels: []
    }), 'utf8');
    const engine = new AILISMemoryStrategyEngine({
        rootDir,
        strategy: 'hindsight_cognitive_v1',
        embedder: async (texts) => texts.map((text) =>
            text.toLowerCase().includes('paris') || text.toLowerCase().includes('before berlin')
                ? [1, 0]
                : [0, 1]
        ),
        queryPlanner: async () => ({
            text: JSON.stringify({
                searchQueries: ['Where did the user live before Berlin? Paris'],
                includeLanes: ['world'],
                needsCoverage: false,
                needsLatestState: false
            })
        })
    });
    const events = [
        memoryEvent({
            id: 'old-turn',
            sessionId: 'old-home',
            ts: '2024-01-01T00:00:00.000Z',
            userText: 'I live in Paris.'
        }),
        memoryEvent({
            id: 'new-turn',
            sessionId: 'new-home',
            ts: '2025-01-01T00:00:00.000Z',
            userText: 'I moved to Berlin.'
        })
    ];
    const result = await engine.search({
        query: 'Where did I live before Berlin?',
        questionTime: '2025-03-01T00:00:00.000Z',
        events,
        limit: 4
    });
    assert.ok(result.documents.some((entry) => entry.id === 'unit:old-city'));
    assert.ok(result.events.some((entry) => entry.id === 'old-turn'));
});

test('cognition curator keeps only evidence-bound Persona memories and supersedes changed slots', async (t) => {
    const rootDir = await temporaryDirectory(t, 'ailis-curator-');
    const rawRoot = path.join(rootDir, 'raw-memory');
    const ledger = new AILISRawMemoryLedger({ rootDir: rawRoot });
    const first = ledger.recordChatTurn({
        sessionId: 'main',
        source: 'conversation',
        iso: '2025-01-01T00:00:00.000Z',
        requestPayload: { memoryUserMessage: 'I live in Paris.' },
        result: { content: 'I will remember that.' }
    }).entry;
    ledger.recordChatTurn({
        sessionId: 'main:task-agent:1',
        source: 'task-agent',
        iso: '2025-01-02T00:00:00.000Z',
        requestPayload: { memoryUserMessage: 'Hidden executor trace.' },
        result: { content: 'Task finished.' }
    });
    const outputs = [{
        units: [{
            lane: 'world',
            semanticKey: 'home_city',
            statement: 'The user lives in Paris.',
            evidenceIds: [first.id],
            replacesPrior: false
        }, {
            lane: 'world',
            semanticKey: 'unsupported',
            statement: 'This must be rejected.',
            evidenceIds: ['not-real']
        }, {
            lane: 'world',
            semanticKey: 'credential',
            statement: 'The token is sk1234567890123456789012.',
            evidenceIds: [first.id]
        }],
        observations: [],
        mentalModels: []
    }];
    const curator = new AILISMemoryCognitionCurator({
        rootDir,
        rawMemoryLedger: ledger,
        llmClient: async () => ({ text: JSON.stringify(outputs.shift()) })
    });
    const firstRun = await curator.curate({ nowIso: '2025-01-03T00:00:00.000Z' });
    assert.equal(firstRun.ok, true);
    let state = JSON.parse(await fs.readFile(path.join(rootDir, 'memory-cognition.json'), 'utf8'));
    assert.equal(state.units.length, 1);
    assert.equal(state.units[0].statement, 'The user lives in Paris.');

    const second = ledger.recordChatTurn({
        sessionId: 'main',
        source: 'conversation',
        iso: '2025-02-01T00:00:00.000Z',
        requestPayload: { memoryUserMessage: 'I moved to Berlin.' },
        result: { content: 'I hope the move went well.' }
    }).entry;
    outputs.push({
        units: [{
            lane: 'world',
            semanticKey: 'home_city',
            statement: 'The user now lives in Berlin.',
            evidenceIds: [second.id],
            replacesPrior: true
        }],
        observations: [],
        mentalModels: []
    });
    const secondRun = await curator.curate({ nowIso: '2025-02-02T00:00:00.000Z' });
    assert.equal(secondRun.ok, true);
    state = JSON.parse(await fs.readFile(path.join(rootDir, 'memory-cognition.json'), 'utf8'));
    const paris = state.units.find((entry) => entry.statement.includes('Paris'));
    const berlin = state.units.find((entry) => entry.statement.includes('Berlin'));
    assert.equal(paris.status, 'superseded');
    assert.equal(paris.supersededBy, berlin.id);
    assert.equal(berlin.status, 'active');
    assert.ok(state.units.every((entry) => !entry.statement.includes('executor')));
});
