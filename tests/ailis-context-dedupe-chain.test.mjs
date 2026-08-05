import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

const require = createRequire(import.meta.url);
const { buildModelInput } = require('../electron/ailis-model-input-builder.cjs');
const { AILISMemoryRuntime } = require('../electron/ailis-memory-store.cjs');

const CURRENT_TASK = 'CURRENT_TASK_MARKER solve this GAIA-style task with a verifier.';

function inputMessageTexts(input = []) {
    return input
        .filter((item) => item?.type === 'message')
        .map((item) => {
            if (Array.isArray(item.content)) {
                return item.content.map((part) => part?.text || part?.content || '').join('\n');
            }
            return String(item.content || '');
        })
        .filter(Boolean);
}

function countOccurrences(text = '', needle = CURRENT_TASK) {
    return String(text).split(needle).length - 1;
}

async function captureMemorySearchQuery({ message = CURRENT_TASK, messageHistory = [] } = {}) {
    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-context-dedupe-chain-'));
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
        sessionId: 'context-dedupe-chain',
        message,
        messageHistory
    });
    return observedQuery;
}

test('agent model input keeps the current user task once when history already ends with it', () => {
    const input = buildModelInput({
        message: CURRENT_TASK,
        messageHistory: [
            { role: 'user', content: 'prior user context' },
            { role: 'assistant', content: 'prior assistant context' },
            { role: 'user', content: CURRENT_TASK }
        ],
        memoryContext: 'memory context without the marker'
    });
    const texts = inputMessageTexts(input);

    assert.equal(countOccurrences(texts.join('\n')), 1);
    assert.equal(texts.at(-1), CURRENT_TASK);
    assert.match(texts.join('\n'), /prior user context/);
    assert.match(texts.join('\n'), /prior assistant context/);
});

test('agent model input keeps the current user task once when history does not include it', () => {
    const input = buildModelInput({
        message: CURRENT_TASK,
        messageHistory: [
            { role: 'user', content: 'previous question' },
            { role: 'assistant', content: 'previous answer' }
        ],
        memoryContext: 'memory context without the marker'
    });

    assert.equal(countOccurrences(inputMessageTexts(input).join('\n')), 1);
});

test('TaskAgent clean-context shape starts from a single current user task', () => {
    const input = buildModelInput({
        message: CURRENT_TASK,
        messageHistory: [],
        toolOutputs: [],
        memoryContext: 'task agent minimal memory without the marker'
    });
    const texts = inputMessageTexts(input);

    assert.equal(countOccurrences(texts.join('\n')), 1);
    assert.equal(texts.at(-1), CURRENT_TASK);
});

test('memory search query keeps the current user task once when history already ends with it', async () => {
    const query = await captureMemorySearchQuery({
        message: CURRENT_TASK,
        messageHistory: [
            { role: 'user', content: 'prior user memory context' },
            { role: 'assistant', content: 'prior assistant memory context' },
            { role: 'user', content: CURRENT_TASK }
        ]
    });

    assert.equal(countOccurrences(query), 1);
    assert.match(query, /prior user memory context/);
    assert.match(query, /prior assistant memory context/);
});

test('direct LLM memory-injection shape does not duplicate the current user task in memory query', async () => {
    const query = await captureMemorySearchQuery({
        message: CURRENT_TASK,
        messageHistory: [
            { role: 'user', content: 'screenshot context from prior turn' },
            { role: 'assistant', content: 'prior visual answer' },
            { role: 'user', content: CURRENT_TASK }
        ]
    });

    assert.equal(countOccurrences(query), 1);
    assert.match(query, /screenshot context from prior turn/);
    assert.match(query, /prior visual answer/);
});
