import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

const require = createRequire(import.meta.url);
const fsSync = require('node:fs');
const { AILISMemoryRuntime } = require('../electron/ailis-memory-store.cjs');
const {
    AILISMemoryStrategyEngine,
    selectCoverageEntries
} = require('../electron/ailis-memory-strategies.cjs');

function createTestEmbedding(text) {
    const vector = new Array(64).fill(0);
    for (const token of String(text || '').toLowerCase().match(/[a-z0-9]+|[\u3400-\u9fff]/g) || []) {
        let hash = 2166136261;
        for (const character of token) {
            hash ^= character.codePointAt(0);
            hash = Math.imul(hash, 16777619);
        }
        vector[(hash >>> 0) % vector.length] += 1;
    }
    const norm = Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0)) || 1;
    return vector.map((value) => value / norm);
}

function createMemory(options = {}) {
    return new AILISMemoryRuntime({
        memoryEmbedder: async (texts) => texts.map(createTestEmbedding),
        ...options
    });
}

test('AILIS memory runtime retries transient Windows atomic rename failures', async () => {
    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-memory-rename-retry-'));
    const originalRenameSync = fsSync.renameSync;
    let injectedFailures = 2;
    fsSync.renameSync = (...args) => {
        if (injectedFailures > 0) {
            injectedFailures -= 1;
            throw Object.assign(new Error('injected Windows file lock'), { code: 'EPERM' });
        }
        return originalRenameSync(...args);
    };
    try {
    const memory = createMemory({
            rootDir: path.join(rootDir, 'memory'),
            workspaceRoot: path.join(rootDir, 'workspace')
        });
        assert.equal(memory.getStatus().loaded, true);
        assert.equal(injectedFailures, 0);
    } finally {
        fsSync.renameSync = originalRenameSync;
        await fs.rm(rootDir, { recursive: true, force: true });
    }
});

test('AILIS Memory v3 persists events and a redacted secret index without heuristic auto-learning', async () => {
    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-memory-'));
    const workspaceRoot = path.join(rootDir, 'workspace');
    const memory = createMemory({
        rootDir: path.join(rootDir, 'memory'),
        workspaceRoot
    });

    assert.equal(memory.getStatus().loaded, true);
    assert.equal(memory.getStatus().affinityScore, 50);

    const secret = memory.saveSecret({
        name: 'doubao-api-key',
        kind: 'llm_api_key',
        provider: 'doubao',
        description: '默认大模型接口',
        value: 'test-secret-00000000-0000-4000-8000-000000000000'
    });
    assert.equal(secret.ok, true);
    assert.equal(JSON.stringify(secret).includes('test-secret-00000000'), false);

    const recorded = memory.recordTurn({
        sessionId: 'memory-test',
        userMessage: '以后记住，我不喜欢过度工具化 UI，AILIS 要拟人一些，记忆架构参考 Letta/MemGPT 和 Generative Agents。',
        assistantMessage: '我记住了，会把拟人体验放在表层，把稳定 Agent 架构放在底层。',
        source: 'test'
    });
    assert.equal(recorded.ok, true);

    const snapshot = memory.getSnapshot({ includeEvents: true });
    assert.equal(snapshot.ok, true);
    assert.deepEqual(recorded.event.tags, []);
    assert.equal(recorded.event.importance, 1);
    assert.ok(snapshot.recentEvents.some((event) => event.id === recorded.event.id));
    assert.ok(snapshot.blocks.every((block) => !/过度工具化 UI/.test(block.value)));
    assert.ok(snapshot.secrets.some((entry) => entry.name === 'doubao-api-key' && entry.configured));
    assert.equal(memory.getStatus().affinityScore, 50);

    const context = await memory.compileContextAsync({
        sessionId: 'memory-test',
        message: '继续做记忆系统'
    });
    assert.match(context, /<memory_context>/);
    assert.match(context, /## Persona/);
    assert.match(context, /## User/);
    assert.match(context, /## Relevant Memories/);
    assert.match(context, /不喜欢过度工具化 UI/);
    assert.match(context, /doubao-api-key/);
    assert.equal(context.includes('test-secret-00000000-0000-4000-8000-000000000000'), false);

    const taskContext = await memory.compileContextAsync({
        sessionId: 'memory-test',
        message: '继续做记忆系统',
        contextMode: 'task_agent'
    });
    assert.match(taskContext, /doubao-api-key/);
    assert.doesNotMatch(taskContext, /## Persona/);
    assert.doesNotMatch(taskContext, /## Relationship/);

    const reloaded = createMemory({
        rootDir: path.join(rootDir, 'memory'),
        workspaceRoot
    });
    assert.equal(reloaded.getStatus().eventCount, 1);
    assert.ok((await fs.readFile(path.join(rootDir, 'memory', 'events.jsonl'), 'utf8')).includes('memory-test'));
});

test('AILIS Memory v3 imports only raw events and secrets from a pre-v3 state', async () => {
    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-memory-v2-migration-'));
    const memoryRoot = path.join(rootDir, 'memory');
    await fs.mkdir(memoryRoot, { recursive: true });
    await fs.writeFile(path.join(memoryRoot, 'memory-state.json'), JSON.stringify({
        version: 1,
        createdAt: '2026-07-01T00:00:00.000Z',
        updatedAt: '2026-07-08T00:00:00.000Z',
        blocks: {
            persona: { key: 'persona', label: 'Persona', kind: 'core', value: '- preserved persona' },
            user: { key: 'user', label: 'User', kind: 'core', value: '- legacy learned chat fragment' },
            relationship: { key: 'relationship', label: 'Relationship', kind: 'core', value: '- legacy relationship transcript' },
            project: { key: 'project', label: 'Project', kind: 'project', value: '- legacy non-project conversation' }
        },
        events: [{ id: 'legacy-event', ts: '2026-07-08T00:00:00.000Z', sessionId: 'main', userText: 'keep event' }],
        affinity: { score: 65, events: [] },
        secrets: [{
            id: 'secret-1',
            name: 'saved-secret',
            kind: 'generic',
            protection: 'local-file-base64',
            valueBase64: Buffer.from('secret-value').toString('base64')
        }],
        stats: { turnCount: 1 }
    }, null, 2));

    const memory = createMemory({ rootDir: memoryRoot, workspaceRoot: rootDir });
    const snapshot = memory.getSnapshot({ includeEvents: true });
    const blocks = Object.fromEntries(snapshot.blocks.map((block) => [block.key, block.value]));

    assert.equal(memory.getStatus().version, 'v3');
    assert.doesNotMatch(blocks.persona, /preserved persona/);
    assert.doesNotMatch(blocks.user, /legacy learned chat fragment/);
    assert.doesNotMatch(blocks.relationship, /legacy relationship transcript/);
    assert.doesNotMatch(blocks.project, /legacy non-project conversation/);
    assert.equal(snapshot.recentEvents[0].id, 'legacy-event');
    assert.equal(memory.getSecret('saved-secret').secret.value, 'secret-value');
    await assert.rejects(fs.access(path.join(memoryRoot, 'backups')));
});

test('AILIS affinity reset updates the v3 relationship block used by model context', async () => {
    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-affinity-'));
    const memory = createMemory({
        rootDir: path.join(rootDir, 'memory'),
        workspaceRoot: rootDir
    });

    memory.resetAffinity(80);
    const context = await memory.compileContextAsync({ sessionId: 'affinity-test', message: '陪我聊会儿' });
    assert.match(context, /## Relationship/);
    assert.match(context, /当前好感度：80\/100（close）/);
    assert.match(context, /不影响安全、隐私、事实准确性、工具审批/);
    assert.equal(memory.getStatus().affinityScore, 80);
    assert.equal(memory.getStatus().affinitySource, 'memory_state');
});

test('AILIS Memory v3 does not auto-promote explicit self-evolution text', async () => {
    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-self-evolution-memory-'));
    const memory = createMemory({
        rootDir: path.join(rootDir, 'memory'),
        workspaceRoot: rootDir
    });

    const recorded = memory.recordTurn({
        sessionId: 'self-evolution-memory-test',
        userMessage: '以后记住，我希望 AILIS 做自我修改时必须开新分支、先跑测试、展示风险和回滚方案，不要偷偷改主分支。',
        assistantMessage: '我会把自我修改放进可审计的分支、测试、审批和回滚流程。',
        source: 'test'
    });
    assert.equal(recorded.ok, true);
    assert.deepEqual(recorded.event.tags, []);
    assert.equal(recorded.event.importance, 1);

    const snapshot = memory.getSnapshot({ includeEvents: true });
    const userBlock = snapshot.blocks.find((block) => block.key === 'user');
    assert.doesNotMatch(userBlock.value, /自我修改/);
    assert.doesNotMatch(userBlock.value, /开新分支/);
    assert.doesNotMatch(userBlock.value, /回滚方案/);
    assert.ok(snapshot.recentEvents.some((event) => event.id === recorded.event.id));
});

test('AILIS Persona memory retrieves bounded relevant turns and clears memory while preserving secrets', async () => {
    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-memory-clear-'));
    const memory = createMemory({
        rootDir: path.join(rootDir, 'memory'),
        workspaceRoot: rootDir
    });

    memory.saveSecret({
        name: 'local-test-token',
        kind: 'test_secret',
        value: 'secret-value-that-should-survive-clear'
    });

    const filler = 'detail '.repeat(90);
    for (let index = 0; index < 30; index += 1) {
        memory.recordTurn({
            sessionId: 'large-context-test',
            userMessage: `memoryanchor ${index} ${filler}`,
            assistantMessage: `ack memoryanchor ${index} ${filler}`,
            source: 'test'
        });
    }

    let searchCalled = false;
    const searchMemory = memory.searchMemoryAsync.bind(memory);
    memory.searchMemoryAsync = (query, options = {}) => {
        searchCalled = true;
        return searchMemory(query, options);
    };

    const context = await memory.compileContextAsync({
        sessionId: 'large-context-test',
        message: 'memoryanchor'
    });
    assert.equal(searchCalled, true);
    assert.ok(context.length < 60000);
    assert.match(context, /memoryanchor|## Relevant Memories/);

    const cleared = memory.clearMemory();
    assert.equal(cleared.ok, true);
    assert.equal(memory.getStatus().eventCount, 0);
    assert.equal(memory.getStatus().secretCount, 1);
    assert.equal((await fs.readFile(path.join(rootDir, 'memory', 'events.jsonl'), 'utf8')), '');
    assert.equal((await memory.searchMemoryAsync('memoryanchor')).events.length, 0);
    assert.ok(memory.listSecrets().secrets.some((secret) => secret.name === 'local-test-token'));
    assert.equal(memory.getStatus().affinityScore, 50);
});

test('AILIS Persona retrieval uses recent visible turns while keeping the current message once', async () => {
    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-memory-query-dedupe-'));
    const memory = createMemory({
        rootDir: path.join(rootDir, 'memory'),
        workspaceRoot: rootDir
    });
    let observedQuery = '';
    const searchMemory = memory.searchMemoryAsync.bind(memory);
    memory.searchMemoryAsync = (query, options = {}) => {
        observedQuery = query;
        return searchMemory(query, options);
    };

    await memory.compileContextAsync({
        sessionId: 'query-dedupe-test',
        message: 'Solve this long GAIA task with a verifier.',
        messageHistory: [
            { role: 'user', content: '你好' },
            { role: 'assistant', content: '你好，我在。' },
            { role: 'user', content: 'Solve this long GAIA task with a verifier.' }
        ]
    });

    assert.match(observedQuery, /user: 你好/);
    assert.match(observedQuery, /assistant: 你好，我在。/);
    assert.equal(observedQuery.split('Solve this long GAIA task with a verifier.').length - 1, 1);
});

test('AILIS Memory v3 retrieval favors rare evidence across sessions', async () => {
    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-memory-hybrid-retrieval-'));
    const memory = createMemory({
        rootDir: path.join(rootDir, 'memory'),
        workspaceRoot: rootDir
    });
    for (let index = 0; index < 8; index += 1) {
        memory.recordTurn({
            sessionId: 'repeated-noise-session',
            userMessage: `I had an ordinary appointment discussion number ${index}.`,
            assistantMessage: 'We discussed a general calendar and ordinary plans.',
            source: 'test',
            occurredAt: `2026-07-${String(index + 1).padStart(2, '0')}T00:00:00.000Z`
        });
    }
    memory.recordTurn({
        sessionId: 'doctor-evidence-one',
        userMessage: 'My March cardiologist appointment was on Monday.',
        assistantMessage: 'That was the first cardiologist visit in March.',
        source: 'test',
        occurredAt: '2026-06-01T00:00:00.000Z'
    });
    memory.recordTurn({
        sessionId: 'doctor-evidence-two',
        userMessage: 'I returned to the cardiologist for another March appointment.',
        assistantMessage: 'That makes a second specialist visit.',
        source: 'test',
        occurredAt: '2026-06-02T00:00:00.000Z'
    });

    const result = await memory.searchMemoryAsync(
        'Please answer based on past conversations: how many cardiologist appointments were in March?',
        { limit: 4 }
    );
    assert.equal(result.strategy, 'hybrid_rrf_ledger_v3');
    assert.deepEqual(
        result.events.slice(0, 2).map((event) => event.sessionId).sort(),
        ['doctor-evidence-one', 'doctor-evidence-two']
    );
    assert.ok(
        result.events.filter((event) => event.sessionId === 'repeated-noise-session').length <= 2
    );
});

test('AILIS Memory v3 coverage selection reserves distinct evidence facets', () => {
    const ranked = [
        {
            document: { id: 'noise', rawEvent: { sessionId: 'noise-session' } },
            score: 4,
            rank: 1
        },
        {
            document: { id: 'alpha', rawEvent: { sessionId: 'alpha-session' } },
            score: 3,
            rank: 2
        },
        {
            document: { id: 'alpha-duplicate', rawEvent: { sessionId: 'alpha-session' } },
            score: 2,
            rank: 3
        },
        {
            document: { id: 'beta', rawEvent: { sessionId: 'beta-session' } },
            score: 1,
            rank: 4
        }
    ];
    const selected = selectCoverageEntries(ranked, [
        {
            name: 'coverage1',
            query: 'alpha evidence',
            entries: [
                { document: ranked[1].document, score: 5 },
                { document: ranked[2].document, score: 4 }
            ]
        },
        {
            name: 'coverage2',
            query: 'beta evidence',
            entries: [{ document: ranked[3].document, score: 5 }]
        }
    ], { limit: 2 });

    assert.deepEqual(
        selected.map((entry) => entry.document.id),
        ['alpha', 'beta']
    );
    assert.ok(selected.every((entry) => entry.coverage?.selected === true));
});

test('AILIS Memory v3 uses soft planned time ranges without losing expanded-query evidence', async () => {
    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-memory-soft-time-'));
    let timeRangeMode;
    const memory = createMemory({
        rootDir: path.join(rootDir, 'memory'),
        workspaceRoot: rootDir,
        memoryQueryPlanner: async () => ({
            ok: true,
            content: JSON.stringify({
                searchQueries: ['cobalt violin recital'],
                timeRange: {
                    start: '2026-07-01T00:00:00.000Z',
                    end: '2026-07-31T23:59:59.000Z'
                },
                timeRangeMode
            })
        })
    });
    memory.recordTurn({
        sessionId: 'outside-planned-range',
        userMessage: 'The cobalt violin recital was the event I meant.',
        assistantMessage: 'I will keep that recital as evidence.',
        source: 'test',
        occurredAt: '2026-06-10T00:00:00.000Z'
    });
    memory.recordTurn({
        sessionId: 'inside-planned-range',
        userMessage: 'Recall the opaque event discussion later.',
        assistantMessage: 'This is unrelated calendar noise.',
        source: 'test',
        occurredAt: '2026-07-10T00:00:00.000Z'
    });

    const soft = await memory.searchMemoryAsync('Recall the opaque event.', {
        limit: 1,
        questionTime: '2026-08-01T00:00:00.000Z'
    });
    assert.equal(soft.plan.timeRangeMode, 'soft');
    assert.match(soft.contextText, /cobalt violin recital/i);

    timeRangeMode = 'hard';
    const hard = await memory.searchMemoryAsync('Recall the opaque event.', {
        limit: 1,
        questionTime: '2026-08-01T00:00:00.000Z'
    });
    assert.equal(hard.plan.timeRangeMode, 'hard');
    assert.doesNotMatch(hard.contextText, /cobalt violin recital/i);

    await fs.rm(rootDir, { recursive: true, force: true });
});

test('AILIS Memory v3 promotes coverage-selected Ledger provenance into raw evidence', async () => {
    const events = [
        {
            id: 'cardiology-event',
            sessionId: 'cardiology-session',
            ts: '2026-03-12T10:00:00.000Z',
            userText: 'My cardiologist visit was in March.',
            assistantText: 'That visit is recorded.'
        },
        {
            id: 'dermatology-event',
            sessionId: 'dermatology-session',
            ts: '2026-04-18T10:00:00.000Z',
            userText: 'My dermatologist visit was in April.',
            assistantText: 'That visit is recorded.'
        },
        {
            id: 'dentist-event',
            sessionId: 'dentist-session',
            ts: '2026-05-21T10:00:00.000Z',
            userText: 'My dentist visit was in May.',
            assistantText: 'That visit is recorded.'
        }
    ];
    const records = events.map((event, index) => ({
        id: `visit-record-${index + 1}`,
        kind: 'event',
        canonicalKey: `${event.sessionId}:visit`,
        entity: event.sessionId.replace('-session', ''),
        actionType: 'visit',
        status: 'completed',
        summary: event.userText,
        occurredAt: event.ts,
        sourceEventIds: [event.id],
        sourceSessionIds: [event.sessionId],
        sourceRefs: [{
            eventId: event.id,
            sessionId: event.sessionId,
            occurredAt: event.ts
        }]
    }));
    const engine = new AILISMemoryStrategyEngine({
        rootDir: os.tmpdir(),
        embedder: async (texts) => texts.map(createTestEmbedding),
        eventActionLedger: {
            loadStateSync: () => ({ records }),
            getStatus: () => ({ recordCount: records.length })
        },
        queryPlanner: async () => ({
            ok: true,
            content: JSON.stringify({
                searchQueries: [
                    'cardiologist March visit',
                    'dermatologist April visit',
                    'dentist May visit'
                ],
                semanticKeys: records.map((record) => record.canonicalKey),
                needsCoverage: true
            })
        })
    });

    const result = await engine.search({
        query: 'How many different medical visits did I have?',
        events,
        limit: 3
    });
    assert.deepEqual(
        new Set(result.events.slice(0, 3).map((event) => event.id)),
        new Set(events.map((event) => event.id))
    );
    assert.ok(result.diagnostics.coverage.ledgerSeedCount >= 3);
    assert.match(result.contextText, /visit-record-1/);
    assert.match(result.contextText, /cardiology-event/);
});

test('AILIS Memory v3 returns coverage-selected raw evidence in retrieval order', async () => {
    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-memory-coverage-plan-'));
    const memory = createMemory({
        rootDir: path.join(rootDir, 'memory'),
        workspaceRoot: rootDir,
        memoryQueryPlanner: async () => ({
            ok: true,
            content: JSON.stringify({
                searchQueries: [
                    'cardiologist March visit',
                    'dermatologist April visit',
                    'dentist May visit'
                ],
                semanticKeys: [
                    'cardiologist_visit',
                    'dermatologist_visit',
                    'dentist_visit'
                ],
                needsCoverage: true
            })
        })
    });
    const visits = [
        ['cardiologist-session', 'My cardiologist visit was in March.'],
        ['dermatologist-session', 'My dermatologist visit was in April.'],
        ['dentist-session', 'My dentist visit was in May.']
    ];
    for (const [sessionId, userMessage] of visits) {
        memory.recordTurn({
            sessionId,
            userMessage,
            assistantMessage: 'That visit is recorded.',
            source: 'test'
        });
    }
    for (let index = 0; index < 6; index += 1) {
        memory.recordTurn({
            sessionId: 'repeated-medical-noise',
            userMessage: `General medical visit discussion ${index}.`,
            assistantMessage: 'No named doctor appears in this note.',
            source: 'test'
        });
    }

    const result = await memory.searchMemoryAsync(
        'How many different medical visits did I have?',
        { limit: 4 }
    );
    const firstSessions = new Set(
        result.events.slice(0, 4).map((event) => event.sessionId)
    );
    for (const [sessionId] of visits) {
        assert.ok(firstSessions.has(sessionId), `${sessionId} should receive coverage`);
    }
    assert.equal(result.diagnostics.coverage.requested, true);
    assert.ok(result.diagnostics.coverage.selectedRawSeedCount >= 3);

    await fs.rm(rootDir, { recursive: true, force: true });
});

test('AILIS memory prompt centers long event snippets around the matched evidence', async () => {
    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-memory-snippet-'));
    const memory = createMemory({
        rootDir: path.join(rootDir, 'memory'),
        workspaceRoot: rootDir
    });
    memory.recordTurn({
        sessionId: 'long-shift-table',
        userMessage: 'Please remember the complete weekly shift rotation.',
        assistantMessage: `${'irrelevant shift filler '.repeat(45)} Admon Sunday 8 am - 4 pm Day Shift`,
        source: 'test'
    });

    const context = await memory.compileContextAsync({
        sessionId: 'new-session',
        message: 'What was the Sunday shift for Admon?'
    });
    assert.match(context, /Admon Sunday 8 am - 4 pm Day Shift/);
});

test('AILIS explicitly empty core blocks remain empty after restart', async () => {
    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-memory-empty-block-'));
    const memoryRoot = path.join(rootDir, 'memory');
    const memory = createMemory({ rootDir: memoryRoot, workspaceRoot: rootDir });
    for (const key of ['user', 'relationship', 'project']) {
        assert.equal(memory.updateBlock(key, '').ok, true);
    }

    const restarted = createMemory({ rootDir: memoryRoot, workspaceRoot: rootDir });
    const blocks = Object.fromEntries(
        restarted.getSnapshot({ includeEvents: false }).blocks.map((block) => [block.key, block.value])
    );
    assert.equal(blocks.user, '');
    assert.equal(blocks.relationship, '');
    assert.equal(blocks.project, '');
    assert.ok(blocks.persona);
});

test('AILIS restores global Memory v3 evidence after restart while snapshots stay session-scoped', async () => {
    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-memory-restart-'));
    const memoryRoot = path.join(rootDir, 'memory');
    const sessionId = 'restart-session';
    const firstRuntime = createMemory({
        rootDir: memoryRoot,
        workspaceRoot: rootDir
    });

    firstRuntime.recordTurn({
        sessionId,
        userMessage: '记住我们刚才决定先把 Persona Memory Runtime 的读取链路补完整。',
        assistantMessage: '好的，下一轮继续检查 Context Compiler。',
        source: 'test'
    });
    firstRuntime.recordTurn({
        sessionId: 'another-session',
        userMessage: '这是另一个会话的内容，不应该进入当前会话最近记录。',
        assistantMessage: '另一个会话。',
        source: 'test'
    });

    const restartedRuntime = createMemory({
        rootDir: memoryRoot,
        workspaceRoot: rootDir
    });
    const context = await restartedRuntime.compileContextAsync({
        sessionId,
        message: '继续',
        maxChars: 12000
    });
    const snapshot = restartedRuntime.getSnapshot({
        includeEvents: true,
        sessionId,
        eventLimit: 10
    });

    assert.match(context, /Persona Memory Runtime 的读取链路/);
    assert.match(context, /下一轮继续检查 Context Compiler/);
    assert.match(context, /这是另一个会话的内容/);
    assert.equal(snapshot.recentEvents.length, 1);
    assert.equal(snapshot.recentEvents[0].sessionId, sessionId);
});

test('AILIS Memory v3 uses one asynchronous retrieval path', async () => {
    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-memory-v3-runtime-'));
    const memory = createMemory({
        rootDir: path.join(rootDir, 'memory'),
        workspaceRoot: rootDir,
        memoryStrategy: 'hybrid_rrf_ledger_v3',
        memoryQueryPlanner: async () => ({
            ok: true,
            content: JSON.stringify({
                searchQueries: ['navy blazer dry cleaning pickup'],
                targetEntities: ['navy blazer'],
                targetActionTypes: ['pickup'],
                targetStates: ['pending'],
                targetRecordKinds: ['action'],
                needsCoverage: true,
                needsLatestState: true
            })
        }),
        memoryEmbedder: async (texts) => texts.map((text) => [
            /blazer|dry cleaning|pickup/i.test(text) ? 1 : 0,
            /unrelated/i.test(text) ? 1 : 0
        ])
    });
    memory.recordTurn({
        sessionId: 'closet-memory',
        userMessage: 'I still need to pick up my navy blazer from dry cleaning.',
        assistantMessage: 'I will remember the pending blazer pickup.',
        source: 'test',
        occurredAt: '2026-08-02T10:00:00.000Z'
    });

    const asyncContext = await memory.compileContextAsync({
        sessionId: 'main',
        message: 'What clothing pickup is still pending?',
        questionTime: '2026-08-03T00:00:00.000Z'
    });
    assert.match(asyncContext, /navy blazer/i);
    assert.equal(memory.getStatus().memoryStrategy, 'hybrid_rrf_ledger_v3');
    assert.equal(
        memory.getStatus().memoryStrategyStatus.embedding.runtime,
        'injected'
    );

    const searchResult = await memory.searchMemoryAsync('navy blazer', { limit: 4 });
    assert.equal(searchResult.strategy, 'hybrid_rrf_ledger_v3');
    assert.match(await memory.compileContextAsync({ message: 'navy blazer' }), /navy blazer/i);

    await fs.rm(rootDir, { recursive: true, force: true });
});
