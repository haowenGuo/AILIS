import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { mergeCheckpoint } = require('../electron/ailis-persona-context-store.cjs');

function message(role, text) {
    return {
        type: 'message',
        role,
        content: [{ type: role === 'assistant' ? 'output_text' : 'input_text', text }]
    };
}

test('Persona checkpoint merge accepts a semantic-compaction rewrite from the current base', () => {
    const base = {
        history_version: 0,
        items: [
            message('user', 'Original request'),
            message('assistant', 'Work in progress'),
            message('user', 'Keep going')
        ]
    };
    const compacted = {
        history_version: 1,
        items: [
            message('developer', '<ailis_semantic_task_memory>Readable continuation memory</ailis_semantic_task_memory>'),
            message('user', 'Keep going')
        ]
    };

    const merged = mergeCheckpoint(base, base, compacted);

    assert.deepEqual(merged, compacted);
    assert.doesNotMatch(JSON.stringify(merged), /Work in progress/);
});

test('Persona checkpoint merge still appends a concurrent ordinary delta', () => {
    const base = {
        history_version: 0,
        items: [message('user', 'Original request')]
    };
    const current = {
        history_version: 0,
        items: [
            ...base.items,
            message('assistant', 'Concurrent visible reply')
        ]
    };
    const candidate = {
        history_version: 0,
        items: [
            ...base.items,
            message('assistant', 'Candidate visible reply')
        ]
    };

    const merged = mergeCheckpoint(current, base, candidate);

    assert.match(JSON.stringify(merged), /Concurrent visible reply/);
    assert.match(JSON.stringify(merged), /Candidate visible reply/);
});
