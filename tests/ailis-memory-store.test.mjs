import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

const require = createRequire(import.meta.url);
const fsSync = require('node:fs');
const { AILISMemoryRuntime } = require('../electron/ailis-memory-store.cjs');

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
        const memory = new AILISMemoryRuntime({
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

test('AILIS memory runtime persists events and redacted secret index without legacy rule extraction', async () => {
    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-memory-'));
    const workspaceRoot = path.join(rootDir, 'workspace');
    const memory = new AILISMemoryRuntime({
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

    const context = memory.compileContext({
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

    const taskContext = memory.compileContext({
        sessionId: 'memory-test',
        message: '继续做记忆系统',
        contextMode: 'task_agent'
    });
    assert.match(taskContext, /doubao-api-key/);
    assert.doesNotMatch(taskContext, /## Persona/);
    assert.doesNotMatch(taskContext, /## Relationship/);

    const reloaded = new AILISMemoryRuntime({
        rootDir: path.join(rootDir, 'memory'),
        workspaceRoot
    });
    assert.equal(reloaded.getStatus().eventCount, 1);
    assert.ok((await fs.readFile(path.join(rootDir, 'memory', 'events.jsonl'), 'utf8')).includes('memory-test'));
});

test('AILIS memory v2 backs up and resets legacy auto-learned core blocks without deleting events or secrets', async () => {
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
        reflections: [],
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

    const memory = new AILISMemoryRuntime({ rootDir: memoryRoot, workspaceRoot: rootDir });
    const snapshot = memory.getSnapshot({ includeEvents: true });
    const blocks = Object.fromEntries(snapshot.blocks.map((block) => [block.key, block.value]));

    assert.equal(memory.getStatus().version, 'v2');
    assert.match(blocks.persona, /preserved persona/);
    assert.doesNotMatch(blocks.user, /legacy learned chat fragment/);
    assert.doesNotMatch(blocks.relationship, /legacy relationship transcript/);
    assert.doesNotMatch(blocks.project, /legacy non-project conversation/);
    assert.equal(snapshot.recentEvents[0].id, 'legacy-event');
    assert.equal(memory.getSecret('saved-secret').secret.value, 'secret-value');
    const backups = await fs.readdir(path.join(memoryRoot, 'backups'));
    assert.ok(backups.some((name) => /^memory-state\.v1\./.test(name)));
});

test('AILIS affinity reset updates the curated relationship state used by model context', async () => {
    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-affinity-'));
    const memory = new AILISMemoryRuntime({
        rootDir: path.join(rootDir, 'memory'),
        workspaceRoot: rootDir
    });

    memory.resetAffinity(80);
    const context = memory.compileContext({ sessionId: 'affinity-test', message: '陪我聊会儿' });
    assert.match(context, /## Relationship/);
    assert.match(context, /综合好感度：80\/100/);
    assert.match(context, /关系阶段：close/);
    assert.match(context, /不影响安全、隐私、事实准确性、工具审批/);
    assert.equal(memory.getStatus().affinityScore, 80);
    assert.equal(memory.getStatus().affinitySource, 'curated_capsule');
});

test('AILIS memory does not promote explicit self-evolution text through legacy regex rules', async () => {
    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-self-evolution-memory-'));
    const memory = new AILISMemoryRuntime({
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
    const memory = new AILISMemoryRuntime({
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
    const searchMemory = memory.searchMemory.bind(memory);
    memory.searchMemory = (query, options = {}) => {
        searchCalled = true;
        return searchMemory(query, options);
    };

    const context = memory.compileContext({
        sessionId: 'large-context-test',
        message: 'memoryanchor'
    });
    assert.equal(searchCalled, true);
    assert.ok(context.length < 20000);
    assert.match(context, /memoryanchor|## Relevant Memories/);

    const cleared = memory.clearMemory();
    assert.equal(cleared.ok, true);
    assert.equal(memory.getStatus().eventCount, 0);
    assert.equal(memory.getStatus().secretCount, 1);
    assert.equal((await fs.readFile(path.join(rootDir, 'memory', 'events.jsonl'), 'utf8')), '');
    assert.equal(memory.searchMemory('memoryanchor').events.length, 0);
    assert.ok(memory.listSecrets().secrets.some((secret) => secret.name === 'local-test-token'));
    const clearedUserProfile = JSON.parse(await fs.readFile(path.join(rootDir, 'memory', 'user-profile.json'), 'utf8'));
    const clearedRelationshipProfile = JSON.parse(await fs.readFile(path.join(rootDir, 'memory', 'relationship-profile.json'), 'utf8'));
    assert.equal(clearedUserProfile.items.length, 0);
    assert.equal(clearedRelationshipProfile.items.length, 0);
    assert.equal(memory.getStatus().affinityScore, 50);
});

test('AILIS Persona retrieval uses recent visible turns while keeping the current message once', async () => {
    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-memory-query-dedupe-'));
    const memory = new AILISMemoryRuntime({
        rootDir: path.join(rootDir, 'memory'),
        workspaceRoot: rootDir
    });
    let observedQuery = '';
    const searchMemory = memory.searchMemory.bind(memory);
    memory.searchMemory = (query, options = {}) => {
        observedQuery = query;
        return searchMemory(query, options);
    };

    memory.compileContext({
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

test('AILIS memory hybrid retrieval favors rare evidence and diversifies sessions', async () => {
    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-memory-hybrid-retrieval-'));
    const memory = new AILISMemoryRuntime({
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

    const result = memory.searchMemory(
        'Please answer based on past conversations: how many cardiologist appointments were in March?',
        { limit: 4 }
    );
    assert.equal(result.strategy, 'bm25_phrase_v1');
    assert.deepEqual(
        result.events.slice(0, 2).map((event) => event.sessionId).sort(),
        ['doctor-evidence-one', 'doctor-evidence-two']
    );
    assert.ok(
        result.events.filter((event) => event.sessionId === 'repeated-noise-session').length <= 2
    );
});

test('AILIS memory prompt centers long event snippets around the matched evidence', async () => {
    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-memory-snippet-'));
    const memory = new AILISMemoryRuntime({
        rootDir: path.join(rootDir, 'memory'),
        workspaceRoot: rootDir
    });
    memory.recordTurn({
        sessionId: 'long-shift-table',
        userMessage: 'Please remember the complete weekly shift rotation.',
        assistantMessage: `${'irrelevant shift filler '.repeat(45)} Admon Sunday 8 am - 4 pm Day Shift`,
        source: 'test'
    });

    const context = memory.compileContext({
        sessionId: 'new-session',
        message: 'What was the Sunday shift for Admon?'
    });
    assert.match(context, /Admon Sunday 8 am - 4 pm Day Shift/);
});

test('AILIS query-aware profile packing promotes a relevant late profile item', async () => {
    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-memory-profile-retrieval-'));
    const memoryRoot = path.join(rootDir, 'memory');
    const memory = new AILISMemoryRuntime({ rootDir: memoryRoot, workspaceRoot: rootDir });
    const unrelatedItems = Array.from({ length: 30 }, (_, index) => ({
        id: `unrelated-${index}`,
        category: 'decision_preferences',
        claim: `The user has a stable unrelated preference about generic topic ${index} and detailed choices.`,
        confidence: 0.99 - index * 0.001,
        stability: 'stable',
        status: 'active',
        evidenceIds: [`raw-unrelated-${index}`]
    }));
    await fs.writeFile(path.join(memoryRoot, 'user-profile.json'), JSON.stringify({
        version: 1,
        items: [
            ...unrelatedItems,
            {
                id: 'video-editing-target',
                category: 'aesthetic_style',
                claim: 'For video editing resources, the user prefers advanced Adobe Premiere Pro tutorials.',
                confidence: 0.71,
                stability: 'candidate',
                status: 'active',
                evidenceIds: ['raw-video-target']
            }
        ]
    }, null, 2));

    const context = memory.compileContext({
        sessionId: 'profile-retrieval',
        message: 'Recommend video editing resources for me.'
    });
    assert.match(context, /advanced Adobe Premiere Pro tutorials/);
    assert.doesNotMatch(context, /raw-video-target/);
});

test('AILIS explicitly empty core blocks remain empty after restart', async () => {
    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-memory-empty-block-'));
    const memoryRoot = path.join(rootDir, 'memory');
    const memory = new AILISMemoryRuntime({ rootDir: memoryRoot, workspaceRoot: rootDir });
    for (const key of ['user', 'relationship', 'project']) {
        assert.equal(memory.updateBlock(key, '').ok, true);
    }

    const restarted = new AILISMemoryRuntime({ rootDir: memoryRoot, workspaceRoot: rootDir });
    const blocks = Object.fromEntries(
        restarted.getSnapshot({ includeEvents: false }).blocks.map((block) => [block.key, block.value])
    );
    assert.equal(blocks.user, '');
    assert.equal(blocks.relationship, '');
    assert.equal(blocks.project, '');
    assert.ok(blocks.persona);
});

test('AILIS restores recent same-session memory after runtime restart', async () => {
    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-memory-restart-'));
    const memoryRoot = path.join(rootDir, 'memory');
    const sessionId = 'restart-session';
    const firstRuntime = new AILISMemoryRuntime({
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

    const restartedRuntime = new AILISMemoryRuntime({
        rootDir: memoryRoot,
        workspaceRoot: rootDir
    });
    const context = restartedRuntime.compileContext({
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
    assert.doesNotMatch(context, /这是另一个会话的内容/);
    assert.equal(snapshot.recentEvents.length, 1);
    assert.equal(snapshot.recentEvents[0].sessionId, sessionId);
});

test('AILIS memory prompt merges editable core blocks with curated raw-ledger capsules', async () => {
    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-curated-prompt-'));
    const memoryRoot = path.join(rootDir, 'memory');
    const memory = new AILISMemoryRuntime({
        rootDir: memoryRoot,
        workspaceRoot: rootDir
    });

    memory.updateBlock('user', 'MANUAL USER CORE BLOCK');
    memory.updateBlock('relationship', 'MANUAL RELATIONSHIP CORE BLOCK');
    memory.updateBlock('affinity', 'OLD AFFINITY BLOCK SHOULD NOT BE IN PROMPT');

    await fs.writeFile(path.join(memoryRoot, 'user-profile.json'), JSON.stringify({
        version: 1,
        items: [
            {
                id: 'profile-direct',
                category: 'communication_style',
                claim: '用户希望 AILIS 回答直接、具体，并基于证据。',
                confidence: 0.94,
                stability: 'stable',
                status: 'active',
                evidenceIds: ['raw-direct-style']
            },
            {
                id: 'profile-project-runtime',
                category: 'project_memory',
                claim: '当前项目采用结构化 ContextCompiler。',
                confidence: 0.93,
                stability: 'stable',
                status: 'active',
                evidenceIds: ['raw-project-runtime']
            }
        ]
    }, null, 2));
    await fs.writeFile(path.join(memoryRoot, 'relationship-profile.json'), JSON.stringify({
        version: 1,
        items: [
            {
                id: 'relationship-risk-first',
                claim: '当用户担心乱改代码时，AILIS 应先解释边界和风险。',
                confidence: 0.88,
                stability: 'stable',
                status: 'active',
                evidenceIds: ['raw-repair-signal']
            }
        ]
    }, null, 2));
    await fs.writeFile(path.join(memoryRoot, 'affinity-state.json'), JSON.stringify({
        version: 1,
        trust: 0.52,
        familiarity: 0.64,
        warmth: 0.58,
        friction: 0.31,
        repairState: 'recovering',
        relationshipStage: 'trusted',
        evidenceIds: ['raw-repair-signal']
    }, null, 2));
    await fs.writeFile(path.join(memoryRoot, 'profile-curation-state.json'), JSON.stringify({
        version: 1,
        lastRunDate: '2026-06-30',
        cursor: {
            lastProcessedIso: '2026-06-29T12:00:00.000Z',
            lastProcessedEntryId: 'raw-repair-signal'
        },
        lastRun: {
            iso: '2026-06-30T02:00:00.000Z'
        }
    }, null, 2));

    const context = memory.compileContext({
        sessionId: 'curated-prompt-test',
        message: '继续'
    });
    assert.match(context, /## User/);
    assert.match(context, /MANUAL USER CORE BLOCK/);
    assert.match(context, /用户希望 AILIS 回答直接、具体，并基于证据/);
    assert.match(context, /## Relationship/);
    assert.match(context, /MANUAL RELATIONSHIP CORE BLOCK/);
    assert.match(context, /先解释边界和风险/);
    assert.match(context, /trust=0\.52/);
    assert.match(context, /repairState|修复状态：recovering/);
    assert.equal(context.includes('OLD AFFINITY BLOCK SHOULD NOT BE IN PROMPT'), false);
    const sources = memory.getContextSources({ message: '继续' });
    assert.match(sources.projectText, /结构化 ContextCompiler/);
    assert.doesNotMatch(sources.userText, /结构化 ContextCompiler/);
    const snapshot = memory.getSnapshot({ includeEvents: false });
    assert.match(snapshot.blocks.find((block) => block.key === 'user').value, /用户希望 AILIS 回答直接/);
    assert.match(snapshot.blocks.find((block) => block.key === 'relationship').value, /先解释边界和风险/);
    assert.equal(snapshot.status.affinitySource, 'curated_capsule');
});

test('AILIS keeps relationship_tone in Persona relationship context and out of TaskAgent user context', async () => {
    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-memory-task-isolation-'));
    const memoryRoot = path.join(rootDir, 'memory');
    const memory = new AILISMemoryRuntime({ rootDir: memoryRoot, workspaceRoot: rootDir });
    await fs.writeFile(path.join(memoryRoot, 'user-profile.json'), JSON.stringify({
        version: 1,
        items: [
            {
                id: 'profile-work-style',
                category: 'work_style',
                claim: '用户希望复杂改动先核对真实执行链路。',
                confidence: 0.95,
                stability: 'stable',
                status: 'active',
                evidenceIds: ['raw-work']
            },
            {
                id: 'profile-relationship-tone',
                category: 'relationship_tone',
                claim: '用户采用伴侣式称呼。',
                confidence: 0.9,
                stability: 'stable',
                status: 'active',
                evidenceIds: ['raw-relationship']
            }
        ]
    }, null, 2));
    await fs.writeFile(path.join(memoryRoot, 'relationship-profile.json'), JSON.stringify({
        version: 1,
        items: [{
            id: 'relationship-one',
            claim: '用户采用伴侣式称呼。',
            confidence: 0.9,
            stability: 'stable',
            status: 'active',
            evidenceIds: ['raw-relationship']
        }]
    }, null, 2));
    await fs.writeFile(path.join(memoryRoot, 'profile-curation-state.json'), JSON.stringify({
        version: 1,
        cursor: { lastProcessedIso: '2026-07-17T00:00:00.000Z', lastProcessedEntryId: 'raw-relationship' }
    }, null, 2));

    const personaSources = memory.getContextSources({ message: '继续', contextMode: 'persona' });
    const taskSources = memory.getContextSources({ message: '继续', contextMode: 'task_agent' });

    assert.match(personaSources.userText, /真实执行链路/);
    assert.doesNotMatch(personaSources.userText, /伴侣式称呼/);
    assert.match(personaSources.relationshipText, /伴侣式称呼/);
    assert.match(taskSources.userText, /真实执行链路/);
    assert.doesNotMatch(taskSources.userText, /伴侣式称呼/);
    assert.equal(taskSources.relationshipText, '');
});

test('AILIS memory context reads curated capsule JSON files with a UTF-8 BOM', async () => {
    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-memory-curated-bom-'));
    const memoryRoot = path.join(rootDir, 'memory');
    const memory = new AILISMemoryRuntime({ rootDir: memoryRoot, workspaceRoot: rootDir });
    const writeBomJson = (name, value) => fs.writeFile(
        path.join(memoryRoot, name),
        `\uFEFF${JSON.stringify(value)}`,
        'utf8'
    );
    await Promise.all([
        writeBomJson('profile-curation-state.json', {
            version: 1,
            cursor: { lastProcessedIso: '2026-07-17T02:00:00.000Z' }
        }),
        writeBomJson('user-profile.json', {
            version: 1,
            items: [{
                id: 'profile-bom',
                category: 'work_style',
                claim: 'BOM capsule content must remain model-visible.',
                confidence: 0.9,
                stability: 'stable'
            }]
        }),
        writeBomJson('relationship-profile.json', { version: 1, items: [] }),
        writeBomJson('affinity-state.json', { version: 1, trust: 0.5 })
    ]);

    const context = memory.compileContext({
        sessionId: 'bom-test',
        message: 'check restored memory',
        contextMode: 'persona'
    });
    assert.match(context, /BOM capsule content must remain model-visible/);
});

test('AILIS Memory v3 compiles asynchronously while synchronous callers receive a sparse fallback', async () => {
    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-memory-v3-runtime-'));
    const memory = new AILISMemoryRuntime({
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

    const syncResult = memory.searchMemory('navy blazer', { limit: 4 });
    assert.equal(syncResult.strategy, 'bm25_phrase_v1');
    assert.equal(syncResult.requestedStrategy, 'hybrid_rrf_ledger_v3');
    assert.equal(syncResult.diagnostics.mode, 'sync_sparse_fallback');
    assert.match(memory.compileContext({ message: 'navy blazer' }), /navy blazer/i);

    await fs.rm(rootDir, { recursive: true, force: true });
});
