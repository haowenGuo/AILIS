import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { AILISComputerTool } = require('../electron/ailis-computer-tool.cjs');

test('AILIS computer advanced layer covers binary, rollback, watch, ACL, and optional PTY', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-computer-advanced-'));
    const tool = new AILISComputerTool({ workspaceRoot });
    const runtime = { workspaceRoot, workspaceDir: workspaceRoot };

    try {
        const schema = await tool.execute({ action: 'schema' }, {}, runtime);
        assert.equal(schema.details.status, 'completed');
        assert.ok(schema.details.schema.actions.includes('read_binary'));
        assert.ok(schema.details.schema.actions.includes('watch_start'));
        assert.ok(schema.details.schema.actions.includes('rollback_restore'));

        const binaryBlocked = await tool.execute({
            action: 'write_binary',
            path: 'bin.dat',
            dataBase64: Buffer.from('hello-binary').toString('base64')
        }, {}, runtime);
        assert.equal(binaryBlocked.details.status, 'needs_approval');

        const binaryWrite = await tool.execute({
            action: 'write_binary',
            path: 'bin.dat',
            dataBase64: Buffer.from('hello-binary').toString('base64')
        }, { approved: true }, runtime);
        assert.equal(binaryWrite.details.status, 'completed');

        const binaryRead = await tool.execute({ action: 'read_binary', path: 'bin.dat', length: 5 }, {}, runtime);
        assert.equal(binaryRead.details.status, 'completed');
        assert.equal(Buffer.from(binaryRead.details.dataBase64, 'base64').toString('utf8'), 'hello');

        await tool.execute({ action: 'write', path: 'note.txt', content: 'before' }, { approved: true }, runtime);
        const changed = await tool.execute({ action: 'write', path: 'note.txt', content: 'after' }, { approved: true }, runtime);
        const rollbackId = changed.details.rollback.id;
        assert.ok(rollbackId);

        const rollbackList = await tool.execute({ action: 'rollback_list' }, {}, runtime);
        assert.ok(rollbackList.details.entries.some((entry) => entry.id === rollbackId));

        const restored = await tool.execute({ action: 'rollback_restore', id: rollbackId }, { approved: true }, runtime);
        assert.equal(restored.details.status, 'completed');
        const restoredText = await fs.readFile(path.join(workspaceRoot, 'note.txt'), 'utf8');
        assert.equal(restoredText, 'before');

        const watch = await tool.execute({ action: 'watch_start', path: '.', maxEvents: 50 }, {}, runtime);
        assert.equal(watch.details.status, 'completed');
        const watchId = watch.details.watcher.id;
        await fs.writeFile(path.join(workspaceRoot, 'watched.txt'), 'watch-me', 'utf8');
        await new Promise((resolve) => setTimeout(resolve, 700));
        const polled = await tool.execute({ action: 'watch_poll', id: watchId }, {}, runtime);
        assert.equal(polled.details.status, 'completed');
        assert.ok(polled.details.events.some((event) => String(event.filename || event.path).includes('watched.txt')));
        const watchStopBlocked = await tool.execute({ action: 'watch_stop', id: watchId }, {}, runtime);
        assert.equal(watchStopBlocked.details.status, 'needs_approval');
        const watchStop = await tool.execute({ action: 'watch_stop', id: watchId }, { approved: true }, runtime);
        assert.equal(watchStop.details.status, 'completed');

        const acl = await tool.execute({ action: 'acl_get', path: 'note.txt' }, {}, runtime);
        assert.equal(acl.details.status, 'completed');
        assert.ok(acl.details.stdout);

        const ptyStatus = await tool.execute({ action: 'pty_status' }, {}, runtime);
        assert.equal(ptyStatus.details.status, 'completed');
        assert.equal(typeof ptyStatus.details.available, 'boolean');
        const ptyDryRun = await tool.execute({ action: 'pty_start', command: 'node -v', dryRun: true }, { approved: true }, runtime);
        assert.ok(['completed', 'not_available'].includes(ptyDryRun.details.status));
    } finally {
        await tool.shutdown();
    }
});
