import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
const { sameExecutable } = createRequire(import.meta.url)('../scripts/native-path-identity.cjs');
test('executable identity resolves directory aliases but rejects another executable', () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'ailis-path-identity-'));
    try {
        const real = path.join(root, '真实 path');
        fs.mkdirSync(real);
        fs.writeFileSync(path.join(real, 'app'), 'one');
        fs.writeFileSync(path.join(real, 'other'), 'two');
        fs.symlinkSync(real, path.join(root, 'alias'), process.platform === 'win32' ? 'junction' : 'dir');
        assert.equal(sameExecutable(path.join(real, 'app'), path.join(root, 'alias/app')), true);
        assert.equal(sameExecutable(path.join(real, 'app'), path.join(real, 'other')), false);
        assert.throws(() => sameExecutable(path.join(real, 'app'), path.join(real, 'missing')));
    } finally { fs.rmSync(root, { recursive: true, force: true }); }
});
