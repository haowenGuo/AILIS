import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
const { applyLocalPatch } = createRequire(import.meta.url)('../electron/ailis-local-patch.cjs');
async function fixture(t) {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-patch-observer-'));
    t.after(() => fs.rm(root, { recursive: true, force: true }));
    return { root, resolveTarget: name => path.join(root, name), addText: body => body.join('\n'), updateText: () => { throw Error('bad hunk'); } };
}
test('patch evidence observes the committed before/after bytes once per file', async t => {
    const f = await fixture(t), observed = [];
    await fs.writeFile(path.join(f.root, 'a.txt'), 'old');
    const result = await applyLocalPatch({ ...f, operations: [
        { type: 'add', path: 'a.txt', body: ['new'] },
        { type: 'add', path: 'a.txt', body: ['final'] }
    ], onCommitted: async item => {
        assert.equal(await fs.readFile(item.target, 'utf8'), 'final');
        observed.push(item);
    } });
    assert.equal(result.details.status, 'completed');
    assert.equal(observed.length, 1);
    assert.equal(observed[0].before.toString(), 'old');
    assert.equal(observed[0].after.toString(), 'final');
});
test('failed patch preflight publishes no successful file evidence', async t => {
    const f = await fixture(t), observed = [];
    await assert.rejects(applyLocalPatch({ ...f, operations: [
        { type: 'add', path: 'a.txt', body: ['new'] },
        { type: 'update', path: 'missing.txt', body: [] }
    ], onCommitted: item => observed.push(item) }), /not found/);
    assert.equal(observed.length, 0);
    await assert.rejects(fs.stat(path.join(f.root, 'a.txt')), { code: 'ENOENT' });
});
test('observer failure does not mask or roll back a completed patch', async t => {
    const f = await fixture(t);
    const result = await applyLocalPatch({ ...f, operations: [{ type: 'add', path: 'a.txt', body: ['new'] }],
        onCommitted: () => { throw Error('journal unavailable'); } });
    assert.equal(result.details.status, 'completed');
    assert.equal(result.details.observationErrors[0].error, 'journal unavailable');
    assert.equal(await fs.readFile(path.join(f.root, 'a.txt'), 'utf8'), 'new');
});
