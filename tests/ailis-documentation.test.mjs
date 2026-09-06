import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { verifyDocumentation } from '../scripts/verify-documentation.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
test('maintained manual links, source references and commands resolve', () => {
    const result = verifyDocumentation(root);
    assert.equal(result.documents, 34);
    assert.ok(result.links >= 218);
    assert.deepEqual(result.errors, []);
});

test('broken website documentation links and obsolete commands fail validation', t => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ailis-doc-check-'));
    t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
    fs.mkdirSync(path.join(dir, 'docs'));
    fs.writeFileSync(path.join(dir, 'package.json'), '{"scripts":{}}');
    fs.writeFileSync(path.join(dir, 'README.md'), '[missing](docs/retired.md)\n`pnpm retired:command`');
    fs.writeFileSync(path.join(dir, 'index.html'), '<a href="https://github.com/haowenGuo/AILIS/blob/main/docs/retired.md">old</a>');
    const result = verifyDocumentation(dir);
    assert.ok(result.errors.some(e => e.includes('README.md -> docs/retired.md')));
    assert.ok(result.errors.some(e => e.includes('index.html -> https://github.com')));
    assert.ok(result.errors.some(e => e.includes('Unknown pnpm command')));
    assert.ok(result.errors.some(e => e.includes('Missing manual index')));
});
