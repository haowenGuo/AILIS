import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

const require = createRequire(import.meta.url);
const { AILISMemoryRuntime } = require('../electron/ailis-memory-store.cjs');
const { AILISRawMemoryLedger } = require('../electron/ailis-raw-memory-ledger.cjs');
const { AILISRuntime } = require('../electron/ailis-runtime.cjs');

test('AILIS raw memory ledger stores untruncated chat payloads outside long-term memory clear', async () => {
    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-raw-memory-'));
    const workspaceRoot = path.join(rootDir, 'workspace');
    const ledger = new AILISRawMemoryLedger({
        rootDir: path.join(rootDir, 'raw-memory'),
        workspaceRoot
    });
    const memory = new AILISMemoryRuntime({
        rootDir: path.join(rootDir, 'memory'),
        workspaceRoot
    });
    const longText = '完整原始记忆 '.repeat(600);

    const recorded = ledger.recordChatTurn({
        sessionId: 'raw-chat',
        source: 'test_llm',
        requestPayload: {
            messages: [{ role: 'user', content: longText }],
            apiKey: 'should-not-be-written'
        },
        enrichedPayload: {
            messages: [
                { role: 'system', content: 'memory context' },
                { role: 'user', content: longText }
            ]
        },
        result: {
            content: `收到：${longText}`,
            totalTokens: 123
        },
        durationMs: 42
    });

    assert.equal(recorded.ok, true);
    const replay = ledger.replay({ sessionId: 'raw-chat', limit: 10 });
    assert.equal(replay.ok, true);
    assert.equal(replay.entries.length, 1);
    assert.equal(replay.entries[0].payload.requestPayload.messages[0].content, longText);
    assert.equal(replay.entries[0].payload.enrichedPayload.messages[1].content, longText);
    assert.equal(replay.entries[0].payload.requestPayload.apiKey, '__REDACTED__');
    assert.equal(replay.entries[0].payload.result.totalTokens, 123);

    memory.recordTurn({
        sessionId: 'raw-chat',
        userMessage: longText,
        assistantMessage: 'ack',
        source: 'test'
    });
    assert.equal(memory.getStatus().eventCount, 1);
    memory.clearMemory();
    assert.equal(memory.getStatus().eventCount, 0);
    assert.equal(ledger.replay({ sessionId: 'raw-chat', limit: 10 }).entries.length, 1);
});

test('AILIS runtime mirrors transcript items into raw memory ledger', async () => {
    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-raw-runtime-'));
    const ledger = new AILISRawMemoryLedger({
        rootDir: path.join(rootDir, 'raw-memory'),
        workspaceRoot: rootDir
    });
    const runtime = new AILISRuntime({
        auditDir: path.join(rootDir, 'audit'),
        workspaceRoot: rootDir,
        projectRoot: rootDir,
        rawMemoryLedger: ledger,
        builtinMcpServers: false,
        disableBuiltinAilisResearchMcp: true
    });

    await runtime.startRun({
        runId: 'raw-run-1',
        sessionId: 'raw-session',
        message: 'run this task',
        planner: 'test',
        mode: 'task',
        intent: 'raw_memory_test'
    });
    await runtime.appendItem('raw-run-1', {
        type: 'tool.result',
        sessionId: 'raw-session',
        payload: {
            tool: 'exec',
            stdout: '完整工具输出 '.repeat(300)
        }
    });

    const replay = ledger.replay({ runId: 'raw-run-1', limit: 10 });
    assert.equal(replay.ok, true);
    assert.ok(replay.entries.length >= 3);
    assert.ok(replay.entries.every((entry) => entry.type === 'agent.transcript.item'));
    assert.ok(replay.entries.some((entry) => entry.payload.payload?.stdout?.includes('完整工具输出')));
});
