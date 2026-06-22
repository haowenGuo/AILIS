import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

const require = createRequire(import.meta.url);
const { AILISMemoryRuntime } = require('../electron/ailis-memory-store.cjs');

test('AILIS memory runtime persists blocks, events, affinity, and redacted secret index', async () => {
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
    assert.ok(snapshot.blocks.some((block) => block.key === 'user' && /过度工具化/.test(block.value)));
    assert.ok(snapshot.blocks.some((block) => block.key === 'project' && /Letta/.test(block.value)));
    assert.ok(snapshot.secrets.some((entry) => entry.name === 'doubao-api-key' && entry.configured));

    const context = memory.compileContext({
        sessionId: 'memory-test',
        message: '继续做记忆系统'
    });
    assert.match(context, /AILIS 长期记忆上下文/);
    assert.match(context, /过度工具化/);
    assert.match(context, /doubao-api-key/);
    assert.equal(context.includes('test-secret-00000000-0000-4000-8000-000000000000'), false);

    const reloaded = new AILISMemoryRuntime({
        rootDir: path.join(rootDir, 'memory'),
        workspaceRoot
    });
    assert.equal(reloaded.getStatus().eventCount, 1);
    assert.ok((await fs.readFile(path.join(rootDir, 'memory', 'events.jsonl'), 'utf8')).includes('memory-test'));
});

test('AILIS memory affinity stages match AILIS relationship design', async () => {
    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-affinity-'));
    const memory = new AILISMemoryRuntime({
        rootDir: path.join(rootDir, 'memory'),
        workspaceRoot: rootDir
    });

    memory.resetAffinity(50);
    let context = memory.compileContext({ sessionId: 'affinity-test', message: '你好' });
    assert.match(context, /50\/100（familiarizing）/);
    assert.match(context, /温和、熟悉但不过分亲密/);

    memory.resetAffinity(70);
    context = memory.compileContext({ sessionId: 'affinity-test', message: '继续聊项目' });
    assert.match(context, /70\/100（trusted）/);
    assert.match(context, /更熟悉、更自然、更有陪伴感/);

    memory.resetAffinity(80);
    context = memory.compileContext({ sessionId: 'affinity-test', message: '陪我聊会儿' });
    assert.match(context, /80\/100（close）/);
    assert.match(context, /允许明显亲密、主动、轻微撒娇和更多默契表达/);
    assert.match(context, /不影响安全、隐私、事实准确性、工具审批/);
});

test('AILIS memory keeps explicit self-evolution preferences even when they mention tests', async () => {
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
    assert.ok(recorded.event.tags.includes('preference'));

    const snapshot = memory.getSnapshot({ includeEvents: true });
    const userBlock = snapshot.blocks.find((block) => block.key === 'user');
    assert.match(userBlock.value, /自我修改/);
    assert.match(userBlock.value, /开新分支/);
    assert.match(userBlock.value, /回滚方案/);
});

test('AILIS memory compiles larger structured context and clears memory while preserving secrets', async () => {
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

    let observedLimit = 0;
    const searchMemory = memory.searchMemory.bind(memory);
    memory.searchMemory = (query, options = {}) => {
        observedLimit = options.limit;
        return searchMemory(query, options);
    };

    const context = memory.compileContext({
        sessionId: 'large-context-test',
        message: 'memoryanchor'
    });
    assert.equal(observedLimit, 24);
    assert.ok(context.length > 7600);
    assert.match(context, /\n## 相关近期记忆\n/);

    const cleared = memory.clearMemory();
    assert.equal(cleared.ok, true);
    assert.equal(memory.getStatus().eventCount, 0);
    assert.equal(memory.getStatus().secretCount, 1);
    assert.equal((await fs.readFile(path.join(rootDir, 'memory', 'events.jsonl'), 'utf8')), '');
    assert.equal(memory.searchMemory('memoryanchor').events.length, 0);
    assert.ok(memory.listSecrets().secrets.some((secret) => secret.name === 'local-test-token'));
});
