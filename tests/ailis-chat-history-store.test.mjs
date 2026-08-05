import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

const require = createRequire(import.meta.url);
const { AILISChatHistoryStore } = require('../electron/ailis-chat-history-store.cjs');

test('desktop chat history survives store restart and keeps only visible conversation', async () => {
    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-chat-history-'));
    let store = new AILISChatHistoryStore({ rootDir });

    const saved = store.saveSession('user-a', [
        { role: 'user', content: '记住这一轮', createdAt: '2026-07-17T01:00:00.000Z' },
        { role: 'assistant', content: '这会保存在聊天历史里。', createdAt: '2026-07-17T01:00:01.000Z' },
        { role: 'system', content: 'internal status must not persist' }
    ]);
    assert.equal(saved.messageCount, 2);

    store = new AILISChatHistoryStore({ rootDir });
    const restored = store.getSession('user-a');
    assert.equal(restored.status, 'loaded');
    assert.deepEqual(restored.messages.map((message) => message.role), ['user', 'assistant']);
    assert.match(restored.messages[0].content, /记住这一轮/);
});

test('desktop chat history is session scoped, bounded, and clearable', async () => {
    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-chat-history-bounded-'));
    const store = new AILISChatHistoryStore({ rootDir, maxMessages: 4 });
    const messages = Array.from({ length: 7 }, (_, index) => ({
        role: index % 2 ? 'assistant' : 'user',
        content: `message-${index}`
    }));

    store.saveSession('one', messages);
    store.saveSession('two', [{ role: 'user', content: 'separate session' }]);
    assert.deepEqual(
        store.getSession('one').messages.map((message) => message.content),
        ['message-3', 'message-4', 'message-5', 'message-6']
    );
    assert.equal(store.getSession('two').messages.length, 1);

    assert.equal(store.clearSession('one').status, 'cleared');
    assert.equal(store.getSession('one').status, 'empty');
    assert.equal(store.getSession('two').status, 'loaded');
});

test('desktop chat history restores valid JSON files with a UTF-8 BOM', async () => {
    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-chat-history-bom-'));
    await fs.mkdir(rootDir, { recursive: true });
    await fs.writeFile(path.join(rootDir, 'sessions.json'), `\uFEFF${JSON.stringify({
        version: 1,
        updatedAt: '2026-07-17T02:00:00.000Z',
        sessions: {
            'user-bom': {
                sessionId: 'user-bom',
                updatedAt: '2026-07-17T02:00:00.000Z',
                messages: [{ role: 'user', content: 'BOM 文件也要恢复。' }]
            }
        }
    })}`, 'utf8');

    const store = new AILISChatHistoryStore({ rootDir });
    assert.equal(store.getSession('user-bom').status, 'loaded');
    assert.equal(store.getSession('user-bom').messages[0].content, 'BOM 文件也要恢复。');
});
