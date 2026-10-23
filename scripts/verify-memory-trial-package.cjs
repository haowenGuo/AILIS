'use strict';
// Run with the actual packaged Electron executable and ELECTRON_RUN_AS_NODE=1.
const fs = require('node:fs');
const fsp = require('node:fs/promises');
const path = require('node:path');
const os = require('node:os');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const { createRequire } = require('node:module');

async function main() {
    const packageDir = path.resolve(process.argv[2]);
    const sourceDir = path.resolve(process.argv[3]);
    const reportPath = path.resolve(process.argv[4]);
    assert.equal(path.resolve(process.execPath).toLowerCase(), path.join(packageDir, 'AILIS Memory Trial.exe').toLowerCase());
    const root = path.join(packageDir, 'resources', 'app.asar');
    const packagedRequire = createRequire(path.join(root, 'package.json'));
    const metadata = packagedRequire('./package.json');
    assert.equal(metadata.ailisHierarchicalMemoryTrial, true);
    assert.equal(metadata.name, 'ailis');
    const files = ['electron/main.cjs', 'electron/ailis-gateway.cjs', 'electron/agent-loop/runner.cjs',
        'electron/desktop-llm-provider.cjs', 'electron/ailis-memory-store.cjs',
        'electron/ailis-hierarchical-user-memory.cjs'];
    const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
    const identities = files.map(file => {
        const expected = sha(path.join(sourceDir, file)), actual = sha(path.join(root, file));
        assert.equal(actual, expected, `Packaged source differs: ${file}`);
        return { file, sha256: actual };
    });
    const { AILISHierarchicalUserMemory, USER_UNDERSTANDING_PROMPT, DEFAULT_MERGE_INPUT_TOKENS } = packagedRequire('./electron/ailis-hierarchical-user-memory.cjs');
    const { AILISMemoryRuntime } = packagedRequire('./electron/ailis-memory-store.cjs');
    const { AILISContextCompiler } = packagedRequire('./electron/ailis-context-compiler.cjs');
    const scratch = await fsp.mkdtemp(path.join(os.tmpdir(), 'ailis-memory-package-'));
    assert.equal(DEFAULT_MERGE_INPUT_TOKENS, 460800);
    const baseline = new AILISHierarchicalUserMemory({ rootDir: path.join(scratch, 'baseline'),
        llmClient: async () => { throw new Error('8192 tokens or preview overflow must not trigger a default rollup'); } });
    baseline.appendCompaction({ sessionId: 'synthetic-package-test', sourceId: 'baseline', summary: 'A synthetic remembered fact. '.repeat(2000) });
    assert.equal((await baseline.consolidate()).merges, 0);
    assert.equal(baseline.getStatus().mergeInputTokens, 460800);
    const longSummary = 'Synthetic complete user understanding with family, interests and relationship changes. '.repeat(120).trim();
    let longCalls = 0;
    const uncapped = new AILISHierarchicalUserMemory({ rootDir: path.join(scratch, 'uncapped'), mergeInputTokens: 100,
        llmClient: async payload => {
            longCalls++;
            assert.equal(Object.hasOwn(JSON.parse(payload.messages[1].content), 'outputMaxCharacters'), false);
            assert.equal(Object.hasOwn(payload, 'max_tokens'), false);
            return { ok: true, content: longSummary, finishReason: 'stop' };
        } });
    for (let i = 0; i < 2; i++) uncapped.appendCompaction({ sessionId: 'synthetic', sourceId: String(i), summary: 'Source material. '.repeat(50) });
    assert.equal((await uncapped.consolidate()).merges, 1);
    assert.equal(longCalls, 1);
    assert.equal(uncapped.state.frontier[0].text, longSummary);
    const uncappedRestored = new AILISHierarchicalUserMemory({ rootDir: uncapped.rootDir });
    assert.equal(uncappedRestored.state.frontier[0].text, longSummary);
    let calls = 0;
    const store = new AILISHierarchicalUserMemory({ rootDir: path.join(scratch, 'hierarchy'),
        mergeInputTokens: 100, maxPromptChars: 2000,
        llmClient: async payload => {
            calls++;
            assert.equal(payload.messages[0].content, USER_UNDERSTANDING_PROMPT);
            return { ok: true, content: 'The user prefers precise explanations and revisable understanding. '.repeat(2) };
        } });
    assert.equal(store.buildPromptContext(), '');
    for (let i = 0; i < 8; i++) {
        store.appendCompaction({ sessionId: 'synthetic-package-test', sourceId: String(i),
            summary: 'A synthetic conversation summary with family, education, preferences and relationship context. '.repeat(6) });
        assert.equal((await store.consolidate()).ok, true);
    }
    assert.ok(calls > 0);
    assert.ok(store.getStatus().layers.some(level => level >= 2));
    const memory = new AILISMemoryRuntime({ rootDir: path.join(scratch, 'memory'), hierarchicalUserMemory: store });
    const context = new AILISContextCompiler({ memoryRuntime: memory }).compile({ agentMode: 'unified', maxChars: 20000 });
    assert.match(context.asDeveloperInstruction(), /precise explanations/);
    assert.doesNotMatch(context.asDeveloperInstruction(), /综合好感度|用户偏好直接、细致/);
    assert.equal(context.sections.find(section => section.id === 'user').truncated, false);
    const restored = new AILISHierarchicalUserMemory({ rootDir: store.rootDir });
    assert.equal(restored.buildPromptContext(), store.buildPromptContext());
    const result = { ok: true, version: metadata.version, executable: process.execPath,
        sourceIdentities: identities, hierarchicalStatus: store.getStatus(),
        verified: ['packaged source identity', 'empty initial user profile', 'real packaged modules load',
            'same 460800-token baseline as conversation compaction', 'no preview-triggered early rollup',
            'uncapped complete rollup persisted intact', 'no single-parent self-recompression',
            'recursive rollup with synthetic LLM', 'bounded context injection', 'restart restore'],
        notVerified: ['long-term subjective benefit', 'real model summary quality', 'microphone hardware', 'other platforms'] };
    await fsp.mkdir(path.dirname(reportPath), { recursive: true });
    await fsp.writeFile(reportPath, JSON.stringify(result, null, 2));
    assert.equal(path.dirname(scratch), os.tmpdir());
    assert.ok(path.basename(scratch).startsWith('ailis-memory-package-'));
    await fsp.rm(scratch, { recursive: true, force: true });
    console.log(JSON.stringify({ ok: true, version: metadata.version, files: identities.length, calls, reportPath }));
}
main().catch(error => { console.error(error.stack || error); process.exitCode = 1; });
