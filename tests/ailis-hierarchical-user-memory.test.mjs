import assert from 'node:assert/strict';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { AILISHierarchicalUserMemory, USER_UNDERSTANDING_PROMPT } = require('../electron/ailis-hierarchical-user-memory.cjs');
const { AILISMemoryRuntime } = require('../electron/ailis-memory-store.cjs');
const { AILISGateway } = require('../electron/ailis-gateway.cjs');
const { AILISContextCompiler } = require('../electron/ailis-context-compiler.cjs');

async function fixture(t, options = {}) {
    const root = await fsp.mkdtemp(path.join(os.tmpdir(), 'ailis-hierarchical-test-'));
    t.after(() => fsp.rm(root, { recursive: true, force: true }));
    const calls = [];
    const llmClient = async input => { calls.push(input); return { ok: true, content: 'Known user understanding. '.repeat(6) }; };
    const store = new AILISHierarchicalUserMemory({ rootDir: path.join(root, 'hierarchy'), llmClient,
        maxPromptChars: 2000, mergeInputTokens: 100, nodeOutputChars: 200, ...options });
    return { root, store, calls };
}

const add = (store, id, text = 'past conversation '.repeat(25)) => store.appendCompaction({
    sessionId: 'one-user', sourceId: id, summary: text, at: `2026-10-${String(10 + Number(id.replace(/\D/g, '') || 0)).padStart(2, '0')}T00:00:00Z`
});

test('empty trial contains no inherited profile, does not call the LLM', async t => {
    const { store, calls } = await fixture(t);
    assert.equal(store.buildPromptContext(), '');
    assert.equal((await store.consolidate()).status, 'completed');
    assert.equal(calls.length, 0);
});

test('capture reuses existing compaction, is durable and idempotent', async t => {
    const { store, calls } = await fixture(t);
    assert.equal(add(store, '1').status, 'captured');
    assert.equal(add(store, '1').status, 'duplicate');
    assert.equal(calls.length, 0);
    const restored = new AILISHierarchicalUserMemory({ rootDir: store.rootDir, maxPromptChars: 2000 });
    assert.equal(restored.getStatus().capturedCount, 1);
    assert.match(restored.buildPromptContext(), /past conversation/);
});

test('same-layer summaries roll up recursively, children are archived not injected twice', async t => {
    const { store, calls } = await fixture(t);
    for (let i = 1; i <= 8; i++) { add(store, String(i)); await store.consolidate(); }
    assert.ok(store.getStatus().mergeCount >= 4);
    assert.ok(store.getStatus().layers.some(level => level >= 2));
    assert.ok(store.buildPromptContext().length <= store.maxPromptChars + 60);
    const activeIds = new Set(store.state.frontier.map(node => node.id));
    for (const node of store.state.frontier) for (const child of node.children) {
        assert.ok(!activeIds.has(child));
        assert.ok(fs.existsSync(path.join(store.nodesDir, `${child}.json`)));
    }
    assert.equal(add(store, '1').status, 'duplicate');
    assert.equal(calls[0].messages[0].content, USER_UNDERSTANDING_PROMPT);
    assert.match(USER_UNDERSTANDING_PROMPT, /家庭与重要社会关系/);
    assert.match(USER_UNDERSTANDING_PROMPT, /误解与修复/);
});

test('compaction archive orphan is recovered when a state write did not commit', async t => {
    const { store } = await fixture(t);
    store.save();
    const before = fs.readFileSync(store.statePath, 'utf8');
    add(store, '1');
    fs.writeFileSync(store.statePath, before);
    const restored = new AILISHierarchicalUserMemory({ rootDir: store.rootDir });
    assert.equal(add(restored, '1').status, 'captured');
    assert.equal(restored.state.frontier.length, 1);
});

for (const [label, response] of [
    ['empty', { ok: true, content: '' }],
    ['failed', { ok: false, error: 'synthetic failure' }],
    ['oversized', { ok: true, content: 'too long '.repeat(300) }],
    ['truncated', { ok: true, content: 'incomplete', finish_reason: 'length' }],
    ['tool call', { ok: true, content: 'not an answer', toolCalls: [{ name: 'exec' }] }]
]) test(`${label} LLM output never consumes original summaries`, async t => {
    const { store } = await fixture(t, { llmClient: async () => response });
    add(store, '1'); add(store, '2');
    const before = store.state.frontier.map(node => node.id);
    const result = await store.consolidate();
    assert.equal(result.ok, false);
    assert.deepEqual(store.state.frontier.map(node => node.id), before);
    assert.equal(store.state.mergeCount, 0);
    assert.ok(store.getStatus().lastError);
});

test('later correction is supplied intact and can replace an earlier assumption', async t => {
    const { store } = await fixture(t, { llmClient: async input => {
        const payload = JSON.parse(input.messages[1].content);
        assert.match(payload.summaries[0].text, /old assumption/);
        assert.match(payload.summaries[1].text, /explicit correction/);
        return { ok: true, content: 'User prefers detailed reasoning, not repetitive filler.' };
    } });
    add(store, '1', 'old assumption: short replies always. '.repeat(12));
    add(store, '2', 'explicit correction: detailed reasoning, no repetitive filler. '.repeat(9));
    assert.equal((await store.consolidate()).ok, true);
    assert.doesNotMatch(store.buildPromptContext(), /short replies always/);
    assert.match(store.buildPromptContext(), /detailed reasoning/);
});

test('concurrent new capture survives a pending consolidation', async t => {
    let release;
    const { store } = await fixture(t, { llmClient: () => new Promise(resolve => { release = resolve; }) });
    add(store, '1'); add(store, '2');
    const pending = store.consolidate();
    const third = add(store, '3', 'recent explicit change');
    release({ ok: true, content: 'Earlier user understanding.' });
    assert.equal((await pending).ok, true);
    assert.ok(store.state.frontier.some(node => node.id === third.id));
});

test('clear during an LLM call cannot resurrect forgotten active memory', async t => {
    let release;
    const { store } = await fixture(t, { llmClient: () => new Promise(resolve => { release = resolve; }) });
    add(store, '1'); add(store, '2');
    const pending = store.consolidate(); store.reset();
    release({ ok: true, content: 'Old private profile.' });
    assert.equal((await pending).status, 'reset_during_consolidation');
    assert.equal(store.buildPromptContext(), '');
    assert.equal(store.getStatus().capturedCount, 0);
});

test('context ceiling triggers complete-node rollup instead of string truncation', async t => {
    const { store } = await fixture(t, { maxPromptChars: 450, nodeOutputChars: 140,
        mergeInputTokens: 8192, llmClient: async () => ({ ok: true, content: 'A compact complete user understanding.' }) });
    add(store, '1', 'x'.repeat(340)); add(store, '2', 'y'.repeat(340));
    assert.equal((await store.consolidate()).ok, true);
    assert.ok(store.buildPromptContext().length <= 510);
    assert.match(store.buildPromptContext(), /complete user understanding/);
});

test('trial memory context excludes old seeded user/relationship/affinity blocks', async t => {
    const { root, store } = await fixture(t);
    const memory = new AILISMemoryRuntime({ rootDir: path.join(root, 'memory'), hierarchicalUserMemory: store });
    memory.updateBlock('user', 'OLD DEVELOPER USER ASSUMPTION');
    memory.updateBlock('relationship', 'OLD ASSUMED RELATIONSHIP');
    add(store, '1', 'The user explicitly described their family and current goals.');
    const compiled = new AILISContextCompiler({ memoryRuntime: memory }).compile({ agentMode: 'unified', maxChars: 20000 });
    assert.match(compiled.asDeveloperInstruction(), /family and current goals/);
    assert.doesNotMatch(compiled.asDeveloperInstruction(), /OLD DEVELOPER|OLD ASSUMED|综合好感度/);
    assert.equal(compiled.sections.find(section => section.id === 'user').truncated, false);
    memory.clearMemory();
    assert.equal(store.buildPromptContext(), '');
});

test('trial gateway scheduler bypasses old structured curator', async t => {
    const { root } = await fixture(t);
    let oldCalls = 0;
    const gateway = new AILISGateway({ auditDir: path.join(root, 'gateway'), workspaceRoot: root,
        hierarchicalMemoryEnabled: true, emberHarnessEnabled: false,
        userProfileCurator: { runDailyCuration: () => { oldCalls++; throw new Error('Old writer must not run'); } } });
    t.after(() => gateway.stop());
    assert.equal((await gateway.runScheduledProfileCuration()).ok, true);
    assert.equal(oldCalls, 0);
    assert.equal(gateway.memoryRuntime.state.blocks.user.value, '');
});

test('trial build has a distinct application and uninstall identity', () => {
    const config = require('../electron-builder.memory-trial.cjs');
    assert.equal(config.appId, 'com.ailis.desktop.memorytrial');
    assert.equal(config.productName, 'AILIS Memory Trial');
    assert.equal(config.nsis.deleteAppDataOnUninstall, false);
    const main = fs.readFileSync(new URL('../electron/main.cjs', import.meta.url), 'utf8');
    assert.match(main, /app\.getPath\('appData'\), 'ailis-memory-trial'/);
    assert.match(main, /hierarchicalMemoryEnabled: true, port: 19877/);
});
