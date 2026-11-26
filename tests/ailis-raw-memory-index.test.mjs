import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

const require = createRequire(import.meta.url);
const modulePath = require.resolve('../electron/ailis-raw-memory-ledger.cjs');
const { AILISRawMemoryLedger } = require(modulePath);
const iso = '2026-11-25T09:00:00.000Z';

async function ledger() {
    return new AILISRawMemoryLedger({ rootDir: await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-raw-index-')) });
}

test('raw appends leave the index alone; status checkpoints only complete journal lines', async () => {
    const first = await ledger();
    const second = new AILISRawMemoryLedger({ rootDir: first.rootDir });
    const { path: dayPath } = first.appendEntry({ id: 'a', iso, sessionId: 'session-a', runId: 'run-a' });
    assert.ok(dayPath);
    await assert.rejects(fs.access(first.indexPath), { code: 'ENOENT' });
    assert.equal(first.getStatus().entryCount, 1);
    const checkpoint = await fs.readFile(first.indexPath, 'utf8');
    const getPosition = contents => JSON.parse(contents).indexCheckpoint.files[path.basename(dayPath)];
    assert.equal(getPosition(checkpoint).offset, (await fs.stat(dayPath)).size);

    assert.equal(second.appendEntry({ id: 'b', iso, sessionId: 'session-b', runId: 'run-b', payload: { text: 'x'.repeat(100000) } }).ok, true);
    assert.equal(await fs.readFile(first.indexPath, 'utf8'), checkpoint);
    const record = JSON.stringify({ id: 'c', iso, sessionId: 'session-c', runId: 'run-c', type: 'raw.event' });
    await fs.appendFile(dayPath, record);
    const status = first.getStatus();
    assert.equal(status.entryCount, 2);
    assert.equal(status.sessionCount, 2);
    const partial = getPosition(await fs.readFile(first.indexPath, 'utf8'));
    assert.ok(partial.offset < partial.size);
    await fs.appendFile(dayPath, '\n');
    assert.equal(second.getStatus().entryCount, 3);
    assert.equal(first.getStatus().runCount, 3);
    assert.deepEqual(new Set(first.listSessions().sessions.map(s => s.sessionId)), new Set(['session-a', 'session-b', 'session-c']));
});

test('restart catches up journal writes without an index flush, including an old index', async () => {
    const original = await ledger();
    original.appendEntry({ id: 'before', iso, sessionId: 'existing-session' });
    assert.equal(original.getStatus().entryCount, 1);
    const checkpoint = await fs.readFile(original.indexPath, 'utf8');
    const child = spawnSync(process.execPath, ['-e', `
        const { AILISRawMemoryLedger } = require(process.argv[1]);
        const ledger = new AILISRawMemoryLedger({ rootDir: process.argv[2] });
        const result = ledger.appendEntry({ id: 'after', iso: '2026-11-25T10:00:00.000Z', sessionId: 'another-session' });
        process.exit(result.ok ? 19 : 1);
    `, modulePath, original.rootDir], { encoding: 'utf8' });
    assert.equal(child.status, 19, child.stderr);
    assert.equal(await fs.readFile(original.indexPath, 'utf8'), checkpoint);

    const reopened = new AILISRawMemoryLedger({ rootDir: original.rootDir });
    assert.equal(reopened.getStatus().entryCount, 2);
    assert.equal(reopened.getStatus().sessionCount, 2);
    await fs.writeFile(original.indexPath, JSON.stringify({ version: 1, rootDir: original.rootDir, entryCount: 999 }));
    const migrated = new AILISRawMemoryLedger({ rootDir: original.rootDir });
    assert.equal(migrated.getStatus().entryCount, 2);
    assert.deepEqual(migrated.replay({ tail: false }).entries.map(entry => entry.id), ['before', 'after']);
});

test('a checkpoint write failure never hides a committed journal entry', async () => {
    const original = await ledger();
    await fs.mkdir(original.indexPath);
    assert.equal(original.appendEntry({ id: 'committed' }).ok, true);
    const status = original.getStatus();
    assert.equal(status.entryCount, 1);
    assert.notEqual(status.indexError, '');
    assert.equal(original.replay().entries[0].id, 'committed');
    assert.equal((await fs.readdir(original.rootDir)).some(name => name.endsWith('.tmp')), false);
});

test('a replaced journal invalidates a cached checkpoint', async () => {
    const original = await ledger();
    const { path: file } = original.appendEntry({ id: 'old', iso, sessionId: 'old-session' });
    original.appendEntry({ id: 'extra', iso, sessionId: 'extra-session' });
    assert.equal(original.getStatus().entryCount, 2);
    await fs.writeFile(file, JSON.stringify({ id: 'replacement', iso, sessionId: 'other-session' }) + '\n');
    assert.equal(original.getStatus().entryCount, 1);
    assert.deepEqual(original.listSessions().sessions.map(s => s.sessionId), ['other-session']);
});
