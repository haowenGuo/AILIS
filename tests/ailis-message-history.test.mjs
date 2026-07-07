import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import test from 'node:test';

const require = createRequire(import.meta.url);
const {
    buildMessageHistorySearchText,
    dropTrailingDuplicateUserMessage
} = require('../electron/ailis-message-history.cjs');

test('dropTrailingDuplicateUserMessage removes only the current trailing user turn', () => {
    const history = [
        { role: 'user', content: 'first' },
        { role: 'assistant', content: 'second' },
        { role: 'user', content: 'Solve\nthis task.' }
    ];

    const deduped = dropTrailingDuplicateUserMessage(history, 'Solve this task.');

    assert.equal(deduped.length, 2);
    assert.equal(history.length, 3);
});

test('buildMessageHistorySearchText keeps prior context while deduping current task', () => {
    const query = buildMessageHistorySearchText('current task', [
        { role: 'user', content: 'prior user' },
        { role: 'assistant', content: 'prior assistant' },
        { role: 'user', content: 'current task' }
    ]);

    assert.equal(query.split('current task').length - 1, 1);
    assert.match(query, /prior user/);
    assert.match(query, /prior assistant/);
});
