import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const {
    AILISChronosFullMemory
} = require('../electron/ailis-memory-chronos-full.cjs');
const {
    AILISHindsightOfficialMemory,
    purgeHindsightOfficialBankForState
} = require('../electron/ailis-memory-hindsight-official.cjs');
const {
    AILISHybridFullMemory,
    DEFAULT_DENSE_BATCH_SIZE,
    DEFAULT_DENSE_MAX_LENGTH,
    DEFAULT_DENSE_MAX_TEXT_CHARS,
    DEFAULT_EMBEDDING_REVISION,
    DEFAULT_RERANKER_BATCH_SIZE,
    DEFAULT_RERANKER_MAX_DOCUMENT_CHARS,
    DEFAULT_RERANKER_MAX_LENGTH,
    DEFAULT_RERANKER_REVISION,
    StrictCrossEncoderRuntime,
    StrictDenseRuntime,
    denseEmbeddingText,
    relevanceProbability,
    rerankerExcerpt,
    sequenceClassificationScores
} = require('../electron/ailis-memory-hybrid-full.cjs');
const {
    AILISMastraObservationalMemory
} = require('../electron/ailis-memory-observational-full.cjs');
const {
    AILISMastraOfficialMemory,
    threadIdForSession
} = require('../electron/ailis-memory-mastra-official.cjs');
const {
    AILISMemoryStrategyEngine
} = require('../electron/ailis-memory-strategies.cjs');
const {
    AILISContextCompiler
} = require('../electron/ailis-context-compiler.cjs');

async function temporaryDirectory(t, prefix) {
    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), prefix));
    t.after(() => fs.rm(rootDir, {
        recursive: true,
        force: true,
        maxRetries: 10,
        retryDelay: 100
    }));
    return rootDir;
}

function memoryEvent({
    id,
    sessionId = 'main',
    ts = '2025-01-01T00:00:00.000Z',
    userText = '',
    assistantText = '',
    source = 'conversation'
}) {
    return {
        id,
        sessionId,
        ts,
        userText,
        assistantText,
        source,
        tags: [],
        importance: 1
    };
}

test('full hybrid uses a real reranking stage and never substitutes hashed vectors', async () => {
    const rerankerCalls = [];
    const memory = new AILISHybridFullMemory({
        queryPlanner: async () => ({
            text: JSON.stringify({
                searchQueries: ['name of feline companion'],
                targetEntities: ['Miso'],
                timeRange: null,
                retrievalGuidance: 'Find the named animal.'
            })
        }),
        embedder: async (texts) => texts.map((text) =>
            /feline|cat named miso/i.test(text) ? [1, 0] : [0, 1]
        ),
        reranker: async ({ documents }) => {
            rerankerCalls.push(documents);
            return documents.map((document) => ({
                id: document.id,
                score: /Miso/i.test(document.text) ? 0.99 : 0.01
            }));
        }
    });
    const result = await memory.search({
        query: 'What is the name of my feline companion?',
        events: [
            memoryEvent({ id: 'notebook', userText: 'I bought a notebook.' }),
            memoryEvent({
                id: 'miso',
                ts: '2025-01-02T00:00:00.000Z',
                userText: 'My cat is named Miso.'
            })
        ],
        limit: 1
    });
    assert.equal(result.events[0]?.id, 'miso');
    assert.equal(result.diagnostics.dense.runtime, 'injected');
    assert.equal(result.diagnostics.crossEncoder.runtime, 'injected');
    assert.equal(rerankerCalls.length, 1);

    const unavailable = new AILISHybridFullMemory({
        enableLocalEmbeddings: false,
        reranker: async () => []
    });
    await assert.rejects(
        unavailable.search({
            query: 'anything',
            events: [memoryEvent({ id: 'one', userText: 'Anything.' })]
        }),
        (error) => error?.code === 'required_dense_model_unavailable'
    );
});

test('strict model runtimes pin immutable revisions and score one-logit cross encoders with sigmoid', () => {
    const dense = new StrictDenseRuntime({
        enabled: true,
        allowRemoteModels: false,
        remoteHost: 'https://models.example/',
        cacheDir: 'D:\\models'
    });
    const crossEncoder = new StrictCrossEncoderRuntime({
        allowRemoteModels: false,
        remoteHost: 'https://models.example/',
        cacheDir: 'D:\\models'
    });
    assert.equal(dense.getStatus().revision, DEFAULT_EMBEDDING_REVISION);
    assert.equal(crossEncoder.getStatus().revision, DEFAULT_RERANKER_REVISION);
    assert.equal(dense.getStatus().allowRemoteModels, false);
    assert.equal(crossEncoder.getStatus().allowRemoteModels, false);
    assert.equal(relevanceProbability([0]), 0.5);
    assert.ok(relevanceProbability([8]) > 0.999);
    assert.ok(relevanceProbability([-8]) < 0.001);
    assert.deepEqual(
        sequenceClassificationScores({
            logits: {
                data: new Float32Array([0, 2, -2]),
                dims: [3, 1]
            }
        }, {}, 3),
        [0.5, relevanceProbability([2]), relevanceProbability([-2])]
    );
});

test('strict dense runtime serializes bounded memory-safe batches', async () => {
    const runtime = new StrictDenseRuntime({
        enabled: true,
        allowRemoteModels: false
    });
    const observedBatches = [];
    runtime.ensurePipeline = async () => async (texts, options) => {
        observedBatches.push({
            count: texts.length,
            maxLength: options.max_length,
            textLengths: texts.map((text) => text.length)
        });
        return texts.map((_, index) => [1, index]);
    };
    const vectors = await runtime.embed(Array.from(
        { length: 11 },
        (_, index) => `passage: head-${index} ${'middle '.repeat(4_000)} tail-${index}`
    ));
    assert.equal(vectors.length, 11);
    assert.deepEqual(
        observedBatches.map((batch) => batch.count),
        [4, 4, 3]
    );
    assert.ok(observedBatches.every(
        (batch) => batch.maxLength === DEFAULT_DENSE_MAX_LENGTH
    ));
    assert.ok(observedBatches.every(
        (batch) => batch.textLengths.every(
            (length) => length <= DEFAULT_DENSE_MAX_TEXT_CHARS
        )
    ));
    assert.equal(runtime.getStatus().batchSize, DEFAULT_DENSE_BATCH_SIZE);
    assert.match(
        denseEmbeddingText(`head ${'middle '.repeat(1_000)} tail`),
        /head[\s\S]*tail/
    );
});

test('strict cross-encoder bounds long documents and executes memory-safe batches', async () => {
    const runtime = new StrictCrossEncoderRuntime({
        allowRemoteModels: false
    });
    const observedBatches = [];
    const model = Object.assign(
        async ({ batchSize }) => ({
            logits: {
                data: Float32Array.from(
                    { length: batchSize },
                    (_, index) => index
                ),
                dims: [batchSize, 1]
            }
        }),
        { config: {} }
    );
    runtime.ensurePipeline = async () => ({
        tokenizer(queries, options) {
            observedBatches.push({
                count: queries.length,
                maxLength: options.max_length,
                documentLengths: options.text_pair.map((text) => text.length)
            });
            return { batchSize: queries.length };
        },
        model
    });
    const entries = Array.from({ length: 11 }, (_, index) => ({
        score: 1 / (index + 1),
        document: {
            id: `document-${index}`,
            text: [
                'Session metadata.',
                'irrelevant '.repeat(4_000),
                'The coffee creamer coupon was redeemed at Green Market.',
                'trailing '.repeat(4_000)
            ].join(' ')
        }
    }));
    const ranked = await runtime.rerank(
        'Where was the coffee creamer coupon redeemed?',
        entries,
        8
    );
    assert.equal(ranked.length, 8);
    assert.deepEqual(
        observedBatches.map((batch) => batch.count),
        [4, 4, 3]
    );
    assert.ok(observedBatches.every(
        (batch) => batch.maxLength === DEFAULT_RERANKER_MAX_LENGTH
    ));
    assert.ok(observedBatches.every(
        (batch) => batch.documentLengths.every(
            (length) => length <= DEFAULT_RERANKER_MAX_DOCUMENT_CHARS
        )
    ));
    assert.equal(runtime.getStatus().batchSize, DEFAULT_RERANKER_BATCH_SIZE);
    assert.match(
        rerankerExcerpt(
            'Where was the coffee creamer coupon redeemed?',
            entries[0].document.text
        ),
        /Green Market/
    );
});

test('Mastra AILIS-boundary adapter runs the official Observer parser, keeps a raw tail, and excludes TaskAgent', async (t) => {
    const rootDir = await temporaryDirectory(t, 'ailis-mastra-full-');
    const calls = [];
    const memory = new AILISMastraObservationalMemory({
        rootDir,
        messageTokens: 1_000,
        observationTokens: 10_000,
        maxTokensPerBatch: 1_000,
        previousObserverTokens: 200,
        rawTailTokens: 250,
        llmClient: async ({ messages }) => {
            calls.push(messages);
            return {
                text: [
                    '<observations>',
                    'Date: Jan 1, 2025',
                    '* 🔴 (08:00) User stated their favorite drink is unsweetened tea.',
                    '</observations>'
                ].join('\n')
            };
        }
    });
    const verbose = Array.from(
        { length: 220 },
        (_, index) => `preference-detail-${index}`
    ).join(' ');
    const events = Array.from({ length: 8 }, (_, index) => memoryEvent({
        id: `persona-${index}`,
        ts: `2025-01-0${index + 1}T00:00:00.000Z`,
        userText: `I prefer unsweetened tea. ${verbose}`,
        assistantText: 'I will remember that preference.'
    }));
    events.push(memoryEvent({
        id: 'executor-secret',
        sessionId: 'main:task-agent:1',
        source: 'task-agent',
        userText: 'Hidden executor trace.'
    }));

    const curated = await memory.curate({ events, maxBatches: 12 });
    assert.equal(curated.ok, true);
    assert.ok(curated.run.processedEntryCount > 0);
    assert.ok(calls.length > 0);

    const context = await memory.buildContext({ events, maxChars: 100_000 });
    assert.match(context.contextText, /unsweetened tea/);
    assert.doesNotMatch(context.contextText, /Hidden executor trace/);
    assert.ok(context.diagnostics.rawTailTokens >= 0);
    assert.ok(
        context.documents.every((document) =>
            !document.sourceEventIds?.includes('executor-secret')
        )
    );

    const restarted = new AILISMastraObservationalMemory({
        rootDir,
        llmClient: async () => {
            throw new Error('no repeat observation expected');
        }
    });
    assert.equal(
        restarted.getStatus().observedEventCount,
        memory.getStatus().observedEventCount
    );
});

test('Mastra full strategy executes the official ObservationalMemory engine and LibSQL storage', async (t) => {
    const rootDir = await temporaryDirectory(t, 'ailis-mastra-official-');
    const calls = [];
    const verbosePreference = Array.from(
        { length: 1_500 },
        (_, index) => `preference-context-${index}`
    ).join(' ');
    const llmClient = async ({ messages }) => {
        calls.push(messages);
        return {
            text: [
                '<observations>',
                `<thread id="${threadIdForSession('main')}">`,
                'Date: Jan 1, 2025',
                '* \u{1F534} (08:00) User stated their favorite drink is unsweetened tea.',
                '</thread>',
                '</observations>'
            ].join('\n')
        };
    };
    const memory = new AILISMastraOfficialMemory({
        rootDir,
        llmClient,
        messageTokens: 1_000,
        observationTokens: 10_000,
        maxTokensPerBatch: 1_000,
        bufferTokens: false,
        rawTailTokens: 250
    });
    const curated = await memory.curate({
        events: [
            memoryEvent({
                id: 'tea',
                userText: `My favorite drink is unsweetened tea. ${verbosePreference}`
            }),
            memoryEvent({
                id: 'executor-secret',
                source: 'task-agent',
                sessionId: 'main:task-agent:1',
                userText: 'Hidden executor trace.'
            })
        ]
    });
    assert.equal(curated.ok, true);
    assert.equal(curated.run.processedEntryCount, 1);
    assert.equal(calls.length, 1);
    assert.match(calls[0][0].content, /memory consciousness/i);
    const storedRaw = await memory.store.stores.memory.listMessagesById({
        messageIds: ['tea:user']
    });
    assert.equal(storedRaw.messages.length, 1);

    const context = await memory.buildContext({
        events: [
            memoryEvent({
                id: 'tea',
                userText: `My favorite drink is unsweetened tea. ${verbosePreference}`
            })
        ],
        maxChars: 100_000
    });
    assert.match(context.contextText, /unsweetened tea/i);
    assert.doesNotMatch(context.contextText, /Hidden executor trace/);
    assert.ok(context.sourceEventIds.includes('tea'));
    assert.equal(
        memory.getStatus().upstream.fidelity,
        'official_runtime_integration'
    );
    assert.equal(
        memory.getStatus().upstream.packageVersion,
        '1.24.0'
    );
    assert.ok(memory.getStatus().databasePath.endsWith('.db'));
    await memory.shutdown();

    const restarted = new AILISMastraOfficialMemory({
        rootDir,
        llmClient: async () => {
            throw new Error('persisted official observations should not require a model call');
        },
        bufferTokens: false
    });
    const restartedContext = await restarted.buildContext({
        events: [memoryEvent({ id: 'tea', userText: 'ignored raw copy' })]
    });
    assert.match(restartedContext.contextText, /unsweetened tea/i);
    assert.equal(restarted.getStatus().observedEventCount, 1);
    await restarted.shutdown();
});

test('Mastra official raw tail is a completed memory state below the Observer threshold', async (t) => {
    const rootDir = await temporaryDirectory(t, 'ailis-mastra-raw-tail-');
    let modelCallCount = 0;
    const memory = new AILISMastraOfficialMemory({
        rootDir,
        llmClient: async () => {
            modelCallCount += 1;
            throw new Error('short raw-tail memory must not invoke the Observer');
        },
        messageTokens: 1_000,
        bufferTokens: false,
        rawTailTokens: 1_000
    });
    const events = [memoryEvent({
        id: 'short-preference',
        userText: 'I prefer quiet cafés.',
        assistantText: 'I will remember that.'
    })];
    const curated = await memory.curate({ events });
    assert.equal(curated.ok, true);
    assert.equal(curated.status, 'completed');
    assert.equal(curated.run.status, 'completed');
    assert.equal(curated.run.processedEntryCount, 1);
    assert.equal(curated.run.pendingEntryCount, 1);
    assert.equal(curated.run.rawTailEntryCount, 1);
    assert.equal(curated.run.remainingEntryCount, 0);
    assert.equal(memory.getStatus().ingestedEventCount, 1);
    assert.equal(memory.getStatus().observedEventCount, 0);
    assert.equal(modelCallCount, 0);

    const context = await memory.buildContext({ events });
    assert.match(context.contextText, /quiet cafés/i);
    assert.equal(context.diagnostics.rawTailEventCount, 1);
    await memory.shutdown();
});

test('Chronos full reproduces extraction, dual calendars, initial reranking, and iterative tools', async (t) => {
    const rootDir = await temporaryDirectory(t, 'ailis-chronos-full-');
    const modelCalls = [];
    const llmClient = async ({ messages }) => {
        const system = messages[0].content;
        const user = JSON.parse(messages[1].content);
        modelCalls.push(system);
        if (system.includes('temporal event extractor')) {
            if (!user.turns.some((turn) => /Kyoto/i.test(turn.user))) {
                return { text: JSON.stringify({ events: [] }) };
            }
            return {
                text: JSON.stringify({
                    events: [{
                        subject: 'User',
                        verb: 'visited',
                        object: 'Kyoto',
                        startDatetime: '2025-04-02T00:00:00.000Z',
                        endDatetime: '2025-04-05T23:59:59.000Z',
                        aliases: [
                            'traveled to the Japanese cultural capital',
                            'took a spring trip to Kansai'
                        ],
                        sourceEventIds: [user.turns[0].sourceEventId],
                        confidence: 0.97
                    }]
                })
            };
        }
        if (system.includes('dynamic retrieval guidance')) {
            return {
                text: JSON.stringify({
                    targets: {
                        entities: ['User', 'Kyoto'],
                        attributes: ['travel destination'],
                        operations: ['retrieve latest matching trip'],
                        timeRange: {
                            start: '2025-04-01T00:00:00.000Z',
                            end: '2025-04-30T23:59:59.000Z'
                        }
                    },
                    bullets: [
                        'Retrieve spring travel events and verify them against raw dialogue.'
                    ]
                })
            };
        }
        if (system.includes('iterative ReAct-style loop')) {
            return {
                text: JSON.stringify({
                    action: 'finish',
                    selectedIds: [],
                    evidenceGap: '',
                    rationale: 'The initially reranked raw turn is sufficient.'
                })
            };
        }
        throw new Error(`Unexpected Chronos prompt: ${system.slice(0, 80)}`);
    };
    const memory = new AILISChronosFullMemory({
        rootDir,
        llmClient,
        embedder: async (texts) => texts.map((text) =>
            /Kyoto|spring trip/i.test(text) ? [1, 0] : [0, 1]
        ),
        reranker: async ({ documents }) => documents.map((document) => ({
            id: document.id,
            score: /Kyoto/i.test(document.text) ? 0.99 : 0.01
        })),
        maxAgentSteps: 4
    });
    const events = [
        memoryEvent({
            id: 'trip',
            sessionId: 'travel-session',
            ts: '2025-04-10T00:00:00.000Z',
            userText: 'I returned from a spring trip to Kyoto.',
            assistantText: 'Kyoto sounds wonderful.'
        }),
        memoryEvent({
            id: 'unrelated',
            sessionId: 'notes',
            ts: '2025-04-11T00:00:00.000Z',
            userText: 'I bought a notebook.'
        })
    ];
    const curated = await memory.curate({ events });
    assert.equal(curated.ok, true);
    assert.equal(memory.getStatus().extractedEventCount, 1);

    const result = await memory.search({
        query: 'Where did I travel during the spring?',
        questionTime: '2025-05-01T00:00:00.000Z',
        events,
        limit: 8
    });
    assert.match(result.contextText, /Kyoto/);
    assert.ok(result.events.some((event) => event.id === 'trip'));
    assert.equal(result.actionHistory.at(-1)?.action, 'finish');
    assert.ok(modelCalls.some((prompt) => prompt.includes('temporal event extractor')));
    assert.ok(modelCalls.some((prompt) => prompt.includes('dynamic retrieval guidance')));
    assert.ok(modelCalls.some((prompt) => prompt.includes('iterative ReAct-style loop')));
});

test('Chronos full repairs malformed extracted events without weakening source schema', async (t) => {
    const rootDir = await temporaryDirectory(t, 'ailis-chronos-repair-');
    let extractionCalls = 0;
    const memory = new AILISChronosFullMemory({
        rootDir,
        llmClient: async ({ messages }) => {
            const system = messages[0].content;
            const user = JSON.parse(messages[1].content);
            if (system.includes('temporal event extractor')) {
                extractionCalls += 1;
                return {
                    text: JSON.stringify({
                        events: [{
                            subject: 'User',
                            verb: 'visited',
                            object: 'Kyoto',
                            startDatetime: '2025-04-02',
                            endDatetime: '2025-04-05',
                            aliases: ['spring trip'],
                            sourceEventIds: ['invented-source']
                        }]
                    })
                };
            }
            if (system.includes('repair Chronos temporal events')) {
                extractionCalls += 1;
                assert.deepEqual(user.allowedSourceEventIds, ['trip']);
                assert.equal(user.invalidEvents[0].sourceEventIds[0], 'invented-source');
                return {
                    text: JSON.stringify({
                        events: [{
                            subject: 'User',
                            verb: 'visited',
                            object: 'Kyoto',
                            startTime: '2025-04-02T00:00:00.000Z',
                            end_time: '2025-04-05T23:59:59.000Z',
                            lexicalAliases: [
                                'traveled to the Japanese cultural capital',
                                'took a spring trip to Kansai'
                            ],
                            sourceEventId: 'trip',
                            confidence: 0.97
                        }]
                    })
                };
            }
            throw new Error(`Unexpected Chronos prompt: ${system.slice(0, 80)}`);
        }
    });
    const curated = await memory.curate({
        events: [memoryEvent({
            id: 'trip',
            sessionId: 'travel-session',
            ts: '2025-04-10T00:00:00.000Z',
            userText: 'I returned from a spring trip to Kyoto.'
        })]
    });
    assert.equal(curated.ok, true);
    assert.equal(curated.status, 'completed');
    assert.equal(extractionCalls, 2);
    assert.equal(memory.getStatus().extractedEventCount, 1);
});

test('Hindsight reset purges late backend writes before local state is rebuilt', async (t) => {
    const rootDir = await temporaryDirectory(t, 'ailis-hindsight-purge-');
    await fs.writeFile(path.join(rootDir, 'hindsight-official-v1.json'), `${JSON.stringify({
        bankId: 'benchmark-question-bank',
        baseUrl: 'http://127.0.0.1:9999'
    })}\n`, 'utf8');
    const totals = [3, 0, 0];
    const deleted = [];
    const result = await purgeHindsightOfficialBankForState({
        rootDir,
        quietPasses: 2,
        pollMs: 0,
        maxWaitMs: 1_000,
        client: {
            async deleteBank(bankId) {
                deleted.push(bankId);
            },
            async listMemories() {
                return { total: totals.shift() ?? 0 };
            }
        }
    });

    assert.equal(result.ok, true);
    assert.equal(result.status, 'purged');
    assert.equal(result.bankId, 'benchmark-question-bank');
    assert.deepEqual(deleted, [
        'benchmark-question-bank',
        'benchmark-question-bank'
    ]);
});

test('Hindsight full delegates Retain, Recall, and Reflect to the official client surface', async (t) => {
    const rootDir = await temporaryDirectory(t, 'ailis-hindsight-official-');
    const calls = [];
    const client = {
        async createBank(bankId, options) {
            calls.push({ operation: 'createBank', bankId, options });
            return { bank_id: bankId };
        },
        async retainBatch(bankId, items) {
            calls.push({ operation: 'retainBatch', bankId, items });
            return { success: true };
        },
        async recall(bankId, query) {
            calls.push({ operation: 'recall', bankId, query });
            return {
                results: [{
                    id: 'fact-1',
                    text: 'The user prefers unsweetened tea.',
                    type: 'world',
                    occurred_start: '2025-01-01T00:00:00.000Z',
                    metadata: {
                        ailis_event_id: 'tea',
                        ailis_session_id: 'main'
                    },
                    scores: {
                        final: 0.99,
                        reranker: 0.98,
                        semantic: 0.9,
                        keyword: 3.1
                    }
                }],
                entities: {},
                chunks: {}
            };
        },
        async reflect(bankId, query) {
            calls.push({ operation: 'reflect', bankId, query });
            return {
                text: 'Recommend unsweetened tea based on the durable preference.',
                based_on: { memories: [] },
                trace: {
                    tool_calls: [{ tool: 'recall', input: {}, duration_ms: 1 }]
                }
            };
        }
    };
    const memory = new AILISHindsightOfficialMemory({
        rootDir,
        client,
        autoStart: false
    });
    const events = [
        memoryEvent({ id: 'tea', userText: 'I prefer unsweetened tea.' }),
        memoryEvent({
            id: 'task',
            source: 'task-agent',
            sessionId: 'main:task-agent:1',
            userText: 'Executor-only material.'
        })
    ];
    const curated = await memory.curate({ events });
    assert.equal(curated.ok, true);
    const retain = calls.find((call) => call.operation === 'retainBatch');
    assert.equal(retain.items.length, 1);
    assert.equal(retain.items[0].metadata.ailis_event_id, 'tea');

    const result = await memory.search({
        query: 'What should I drink?',
        questionTime: '2025-02-01T00:00:00.000Z'
    });
    assert.match(result.contextText, /unsweetened tea/);
    assert.match(result.contextText, /Reflect synthesis/);
    assert.deepEqual(result.sourceEventIds, ['tea']);
    assert.ok(calls.some((call) => call.operation === 'recall'));
    assert.ok(calls.some((call) => call.operation === 'reflect'));

    client.reflect = async () => {
        throw new Error('Reflect operation timed out after 300 seconds.');
    };
    const recallFallback = await memory.search({
        query: 'What should I drink when reflection is unavailable?',
        questionTime: '2025-02-01T00:00:00.000Z'
    });
    assert.equal(recallFallback.ok, true);
    assert.match(recallFallback.contextText, /unsweetened tea/);
    assert.doesNotMatch(recallFallback.contextText, /Reflect synthesis/);
    assert.equal(recallFallback.reflection, null);
    assert.equal(recallFallback.diagnostics.reflectStatus, 'failed');
    assert.match(recallFallback.diagnostics.reflectError, /timed out/);
    assert.match(memory.getStatus().diagnostics.lastReflectError, /timed out/);
});

test('Hindsight full bounds synchronous official Retain batches for long histories', async (t) => {
    const rootDir = await temporaryDirectory(t, 'ailis-hindsight-batches-');
    const batchSizes = [];
    const memory = new AILISHindsightOfficialMemory({
        rootDir,
        client: {
            async createBank() {},
            async retainBatch(_bankId, items) {
                batchSizes.push(items.length);
                return { success: true };
            }
        },
        autoStart: false
    });
    const curated = await memory.curate({
        events: Array.from({ length: 23 }, (_, index) => memoryEvent({
            id: `event-${index}`,
            userText: `Remember item ${index}.`
        }))
    });
    assert.equal(curated.ok, true);
    assert.equal(curated.status, 'completed');
    assert.deepEqual(batchSizes, [10, 10, 3]);
    assert.equal(memory.getStatus().retainBatchSize, 10);
    assert.equal(memory.getStatus().retainedEventCount, 23);
});

test('Hindsight retries transient Retain failures without advancing the checkpoint early', async (t) => {
    const rootDir = await temporaryDirectory(t, 'ailis-hindsight-retry-');
    let retainAttempts = 0;
    const memory = new AILISHindsightOfficialMemory({
        rootDir,
        transientRetryAttempts: 3,
        transientRetryDelayMs: 0,
        client: {
            async createBank() {},
            async retainBatch() {
                retainAttempts += 1;
                if (retainAttempts < 3) {
                    throw new Error('Fact extraction failed: ConnectError');
                }
                return { success: true };
            }
        },
        autoStart: false
    });
    const curated = await memory.curate({
        events: [memoryEvent({
            id: 'retry-event',
            userText: 'Remember this after a transient outage.'
        })]
    });

    assert.equal(curated.ok, true);
    assert.equal(retainAttempts, 3);
    assert.equal(memory.getStatus().retainedEventCount, 1);
});

test('Hindsight isolates persisted state when an explicit bank or profile changes', async (t) => {
    const rootDir = await temporaryDirectory(t, 'ailis-hindsight-identity-');
    const first = new AILISHindsightOfficialMemory({
        rootDir,
        profile: 'profile-a',
        bankId: 'bank-a',
        client: {
            async createBank() {},
            async retainBatch() {
                return { success: true };
            }
        },
        autoStart: false
    });
    await first.curate({
        events: [memoryEvent({ id: 'bank-a-event', userText: 'Remember me.' })]
    });
    assert.equal(first.getStatus().retainedEventCount, 1);

    const second = new AILISHindsightOfficialMemory({
        rootDir,
        profile: 'profile-b',
        bankId: 'bank-b',
        client: {},
        autoStart: false
    });
    assert.equal(second.getStatus().profile, 'profile-b');
    assert.equal(second.getStatus().bankId, 'bank-b');
    assert.equal(second.getStatus().retainedEventCount, 0);
    assert.equal(second.getStatus().bankCreated, false);
});

test('Hindsight daemon forwards Codex auth location and filters empty environment values', async (t) => {
    const rootDir = await temporaryDirectory(t, 'ailis-hindsight-env-');
    const previous = {
        CODEX_HOME: process.env.CODEX_HOME,
        UV_PYTHON: process.env.UV_PYTHON,
        HINDSIGHT_API_LLM_API_KEY: process.env.HINDSIGHT_API_LLM_API_KEY
    };
    t.after(() => {
        for (const [key, value] of Object.entries(previous)) {
            if (value === undefined) delete process.env[key];
            else process.env[key] = value;
        }
    });
    process.env.CODEX_HOME = 'D:\\isolated-codex-home';
    delete process.env.UV_PYTHON;
    process.env.HINDSIGHT_API_LLM_API_KEY = '';
    const memory = new AILISHindsightOfficialMemory({
        rootDir,
        client: {},
        autoStart: false
    });
    const environment = memory.daemonEnvironment();
    assert.equal(environment.CODEX_HOME, 'D:\\isolated-codex-home');
    assert.equal(environment.UV_PYTHON, '3.12');
    assert.equal(environment.HINDSIGHT_API_LLM_PROVIDER, 'openai-codex');
    assert.ok(!Object.hasOwn(environment, 'HINDSIGHT_API_LLM_API_KEY'));
});

test('full strategies reject the synchronous prototype fallback path', async (t) => {
    const rootDir = await temporaryDirectory(t, 'ailis-full-sync-');
    const engine = new AILISMemoryStrategyEngine({
        rootDir,
        strategy: 'chronos_full_v1',
        queryPlanner: async () => ({ text: '{}' }),
        embedder: async () => [[1, 0]],
        reranker: async () => []
    });
    assert.throws(
        () => engine.searchSync({
            query: 'memory question',
            events: [],
            strategy: 'chronos_full_v1'
        }),
        (error) => error?.code === 'async_full_memory_required'
    );
});

test('ContextCompiler preserves the large explicit budget required by full observational memory', () => {
    const longObservation = Array.from(
        { length: 12_000 },
        (_, index) => `* 🔴 durable observation ${index}`
    ).join('\n');
    const context = new AILISContextCompiler().compile({
        memorySources: {
            relevantMemoriesText: longObservation,
            memoryStrategy: 'mastra_observational_full_v1'
        },
        sectionBudgets: {
            relevant_memories: 70_000
        },
        maxChars: 312_000
    });
    const relevant = context.sections.find(
        (section) => section.id === 'relevant_memories'
    );
    assert.equal(relevant.budgetTokens, 70_000);
    assert.ok(relevant.text.length > 32_000);
});
