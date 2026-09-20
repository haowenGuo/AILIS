import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const files = ['electron/desktop-llm-provider.cjs', 'electron/store.cjs',
    'src/control-panel-app.js', 'src/config.js'];
const baseline = file => execFileSync('git', ['show', `v1.4.3:${file}`], { cwd: root, encoding: 'utf8' }).replaceAll('\r\n', '\n');
test('production changes are exactly the managed-server address migration', () => {
    let count = 0;
    for (const file of files) {
        const original = baseline(file);
        count += original.split('101.133.239.56').length - 1;
        assert.equal(fs.readFileSync(path.join(root, file), 'utf8').replaceAll('\r\n', '\n'),
            original.replaceAll('101.133.239.56', '150.109.13.189'), file);
    }
    assert.equal(count, 5);
});
test('v1.4.3 execution, instructions, schemas and other tracked files remain unchanged', () => {
    const allowed = [...files, 'tests/ailis-render-profiles.test.mjs',
        'tests/llm-connection-profiles.test.mjs', 'tests/llm-connection-panel-smoke.cjs',
        'tests/v143-endpoint-only.test.mjs', 'scripts/live-v143-codex-exec-probe.cjs'];
    const changed = execFileSync('git', ['-c', 'core.safecrlf=false', 'diff', '--name-only', 'v1.4.3'],
        { cwd: root, encoding: 'utf8' }).trim().split(/\r?\n/).filter(Boolean);
    assert.deepEqual(changed.filter(file => !allowed.includes(file)), []);
});
