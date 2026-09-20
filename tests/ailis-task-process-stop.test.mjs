import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { AILISComputerTool } = require('../electron/ailis-computer-tool.cjs');

// Real OS child processes owned exclusively by this test. No shell profile or network.
test('stopping one task closes its real command process without touching another task', { timeout: 20000 }, async () => {
    const workspaceRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'ailis-task-stop-'));
    const tool = new AILISComputerTool({ workspaceRoot });
    const context = runId => ({ runId, workspace: workspaceRoot, approved: true });
    const args = { command: process.execPath, args: ['-e', 'console.log("ready"); setInterval(() => {}, 1000)'], timeoutMs: 15000 };
    const runtime = { workspaceRoot, workspaceDir: workspaceRoot };
    let owned;
    try {
        owned = tool.execute({ action: 'exec', ...args }, context('task-stop-owned'), runtime);
        const until = Date.now() + 3000;
        while (!tool.runtime.runChildren?.size && Date.now() < until) await new Promise(resolve => setTimeout(resolve, 20));
        const record = [...(tool.runtime.runChildren?.values() || [])].find(item => item.runId === 'task-stop-owned');
        assert.ok(record?.child.pid, 'real synchronous command is registered with its task');
        const foreign = await tool.execute({ action: 'exec_command', ...args, yield_time_ms: 250 }, context('task-stop-foreign'), runtime);
        assert.notEqual(foreign.isError, true);
        const foreignRecord = [...tool.runtime.sessions.values()].find(item => item.runId === 'task-stop-foreign');
        assert.ok(foreignRecord?.child.pid, 'separate task owns its own child');
        assert.equal(await tool.runtime.stopOwnedRun('task-stop-owned'), true);
        await owned;
        assert.ok(record.child.exitCode !== null || record.child.signalCode !== null, 'stop confirms actual exit');
        assert.equal(foreignRecord.child.exitCode, null);
        assert.equal(foreignRecord.child.signalCode, null);
        assert.doesNotThrow(() => process.kill(foreignRecord.child.pid, 0), 'other task is still alive');
        assert.equal(await tool.runtime.stopOwnedRun('nonexistent-task'), true);
        assert.equal(foreignRecord.child.exitCode, null);
    } finally {
        await tool.runtime.stopOwnedRun('task-stop-owned');
        await tool.runtime.stopOwnedRun('task-stop-foreign');
        await owned;
        await tool.shutdown();
        fs.rmSync(workspaceRoot, { recursive: true, force: true });
    }
});
