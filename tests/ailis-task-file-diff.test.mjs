import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const { lineDiff } = createRequire(import.meta.url)('../electron/ailis-task-file-diff.cjs');
test('line diff preserves old edits and locates separated changes', () => {
    const diff = lineDiff('user edit\na\nb\nc\n', 'user edit\nA\nb\nC\n');
    assert.equal(diff.added, 2); assert.equal(diff.removed, 2);
    assert.equal(diff.entries.filter(e => e.type !== 'add').map(e => e.text).join('\n'), 'user edit\na\nb\nc');
    assert.equal(diff.entries.filter(e => e.type !== 'remove').map(e => e.text).join('\n'), 'user edit\nA\nb\nC');
});
test('new/deleted/empty files and newline-only changes have honest counts', () => {
    assert.equal(lineDiff(null, 'one\ntwo\n').added, 2); assert.equal(lineDiff('one\n', null).removed, 1);
    assert.equal(lineDiff('', '').entries.length, 0); assert.equal(lineDiff('one', 'one\n').trailingNewlineChanged, true);
});
test('large diffs fall back instead of blocking the host with quadratic work', () => {
    assert.equal(lineDiff('line\n'.repeat(1000), 'new\n'.repeat(1000)), null);
});
