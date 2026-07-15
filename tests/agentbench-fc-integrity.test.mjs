import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';

import { verifyAgentBenchFcCheckout } from '../evals/agentbench_fc/benchmark-integrity.mjs';

function git(root, ...args) {
    const result = spawnSync('git', args, { cwd: root, encoding: 'utf8' });
    assert.equal(result.status, 0, result.stderr);
    return result.stdout.trim();
}

test('FC integrity gate pins revision, critical hashes, and selected task data', async (t) => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-agentbench-fc-'));
    t.after(() => fs.rm(root, { recursive: true, force: true }));
    await fs.mkdir(path.join(root, 'configs'), { recursive: true });
    await fs.mkdir(path.join(root, 'data'), { recursive: true });
    await fs.writeFile(path.join(root, 'configs', 'task.yaml'), 'task: fc\n');
    await fs.writeFile(path.join(root, 'data', 'sample.json'), '{}\n');
    git(root, 'init');
    git(root, 'config', 'user.name', 'AILIS test');
    git(root, 'config', 'user.email', 'ailis-test@example.invalid');
    git(root, 'add', '.');
    git(root, 'commit', '-m', 'fixture');
    const revision = git(root, 'rev-parse', 'HEAD');
    const fileHash = crypto.createHash('sha256').update('task: fc\n').digest('hex');
    const manifest = {
        schema: 'test',
        repository: 'fixture',
        revision,
        files: { 'configs/task.yaml': fileHash },
        tasks: { 'dbbench-std': { requiredPaths: ['data/sample.json'] } }
    };
    assert.equal((await verifyAgentBenchFcCheckout({ root, manifest, task: 'dbbench-std' })).ok, true);
    await fs.writeFile(path.join(root, 'configs', 'task.yaml'), 'tampered\n');
    const tampered = await verifyAgentBenchFcCheckout({ root, manifest, task: 'dbbench-std' });
    assert.equal(tampered.ok, false);
    assert.ok(tampered.failures.some((failure) => failure.kind === 'critical_file_hash_mismatch'));
});
