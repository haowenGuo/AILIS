import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));

test('release manifest identifies the source and checksums without building or touching an installed app', async () => {
    const output = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-release-manifest-'));
    try {
        execFileSync(process.execPath, [
            'scripts/build-ailis-release.mjs', '--profile', 'core', '--output-root', output,
            '--skip-frontend', '--skip-desktop', '--skip-runtime-packs'
        ], { cwd: root, windowsHide: true, stdio: 'pipe' });
        const pkg = JSON.parse(await fs.readFile(path.join(root, 'package.json'), 'utf8'));
        const name = `AILIS-Release-core-${pkg.version}.json`;
        const raw = await fs.readFile(path.join(output, 'core', name));
        const manifest = JSON.parse(raw);
        assert.equal(manifest.version, pkg.version);
        const expectedCommit = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8', windowsHide: true }).trim();
        assert.equal(manifest.source.commit, expectedCommit);
        assert.equal(typeof manifest.source.dirty, 'boolean');
        assert.deepEqual(manifest.commands, []);
        assert.deepEqual(manifest.artifacts, []);
        const sha = crypto.createHash('sha256').update(raw).digest('hex').toUpperCase();
        assert.equal(await fs.readFile(path.join(output, 'core', 'SHA256SUMS.txt'), 'utf8'), `${sha}  ${name}\n`);
    } finally {
        await fs.rm(output, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
    }
});
