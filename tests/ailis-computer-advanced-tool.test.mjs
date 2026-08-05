import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { AILISComputerTool } = require('../electron/ailis-computer-tool.cjs');
const { AILISOutputStore } = require('../electron/ailis-output-store.cjs');

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

test('AILIS computer exec stores workbench script output in output store', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-computer-output-store-'));
    const tool = new AILISComputerTool({ workspaceRoot });
    const outputStore = new AILISOutputStore({
        rootDir: path.join(workspaceRoot, '.ailis-state', 'output-store')
    });
    const workbenchRoot = path.join(workspaceRoot, '.ailis-state', 'workbench', 'run-output-store');
    const scriptsDir = path.join(workbenchRoot, 'scripts');
    const outputsDir = path.join(workbenchRoot, 'outputs');
    const inputsDir = path.join(workbenchRoot, 'inputs');
    const runtime = { workspaceRoot, workspaceDir: workspaceRoot, outputStore };

    try {
        await fs.mkdir(scriptsDir, { recursive: true });
        await fs.mkdir(outputsDir, { recursive: true });
        await fs.mkdir(inputsDir, { recursive: true });
        const inputPath = path.join(inputsDir, 'matrixRows.json');
        const scriptPath = path.join(scriptsDir, 'workbench-script.mjs');
        const answerPath = path.join(outputsDir, 'answer.json');
        await fs.writeFile(inputPath, JSON.stringify({
            schema: 'ailis.workbench.materialized_input.v1',
            matrixRows: [{ rowNumber: 1, values: ['START'], fills: ['F478A7'] }]
        }, null, 2), 'utf8');
        await fs.writeFile(scriptPath, `
import fs from 'node:fs';
const input = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
for (let i = 0; i < 180; i += 1) console.log('WORKBENCH_TRACE_' + i + ':' + 'x'.repeat(48));
const answer = input.matrixRows[0].fills[0];
fs.writeFileSync(process.argv[3], JSON.stringify({ answer }, null, 2));
console.log('WORKBENCH_FINAL=' + answer);
`, 'utf8');

        const executed = await tool.execute({
            action: 'exec',
            command: process.execPath,
            args: [scriptPath, inputPath, answerPath],
            workdir: workbenchRoot,
            timeout: 8,
            maxPreviewChars: 900
        }, { approved: true }, runtime);

        assert.equal(executed.details.status, 'completed');
        assert.ok(executed.details.outputStore?.outputId);
        assert.equal(executed.details.outputStore.previewTruncated, true);
        const searched = await outputStore.search({
            outputId: executed.details.outputStore.outputId,
            query: 'WORKBENCH_FINAL=F478A7',
            contextLines: 0
        });
        assert.equal(searched.ok, true);
        assert.equal(searched.matchCount, 1);
        const answer = JSON.parse(await fs.readFile(answerPath, 'utf8'));
        assert.equal(answer.answer, 'F478A7');
    } finally {
        await tool.shutdown();
        await fs.rm(workspaceRoot, { recursive: true, force: true });
    }
});

test('AILIS computer exec projects repeated JSON records before a truncated raw preview', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-computer-json-preview-'));
    const tool = new AILISComputerTool({ workspaceRoot });
    const outputStore = new AILISOutputStore({
        rootDir: path.join(workspaceRoot, '.ailis-state', 'output-store')
    });
    const runtime = { workspaceRoot, workspaceDir: workspaceRoot, outputStore };
    const scriptPath = path.join(workspaceRoot, 'emit-records.mjs');

    try {
        await fs.writeFile(scriptPath, `
const rows = Array.from({ length: 40 }, (_, index) => ({
    entity: { type: 'uri', value: 'https://example.test/entity/' + index },
    entityLabel: { type: 'literal', value: index === 28 ? 'TARGET_CITY' : 'Entity ' + index, 'xml:lang': 'en' },
    place: { type: 'uri', value: 'https://example.test/place/' + index },
    placeLabel: { type: 'literal', value: 'Place ' + index, 'xml:lang': 'en' },
    coordinate: { type: 'literal', value: 'Point(' + index + ' ' + (index + 1) + ')' }
}));
process.stdout.write(JSON.stringify(rows, null, 2));
`, 'utf8');

        const executed = await tool.execute({
            action: 'exec',
            command: process.execPath,
            args: [scriptPath],
            workdir: workspaceRoot,
            timeout: 8,
            maxPreviewChars: 900
        }, { approved: true }, runtime);

        assert.equal(executed.details.status, 'completed');
        assert.equal(executed.details.outputStore.previewTruncated, true);
        assert.equal(executed.details.outputStore.structuredPreviewPath, '$');
        assert.equal(executed.details.outputStore.structuredRowCount, 40);
        assert.match(executed.details.outputStore.structuredPreview, /columns: entityLabel \| placeLabel \| coordinate/);
        assert.match(executed.details.outputStore.structuredPreview, /\[29\] TARGET_CITY \| Place 28 \| Point\(28 29\)/);
        assert.match(executed.content[0].text, /--- structured JSON records preview ---/);
        assert.match(executed.content[0].text, /\[29\] TARGET_CITY \| Place 28 \| Point\(28 29\)/);
        assert.match(executed.content[0].text, /outputId=/);
    } finally {
        await tool.shutdown();
        await fs.rm(workspaceRoot, { recursive: true, force: true });
    }
});
