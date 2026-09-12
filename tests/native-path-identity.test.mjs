import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
const { sameExecutable } = createRequire(import.meta.url)('../scripts/native-path-identity.cjs');
const { afterPack } = createRequire(import.meta.url)('../electron-builder.runtime.cjs');
test('Mac signing ignores only verified framework aliases and rejects real or escaping payloads', async () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'ailis-signing-layout-'));
    const framework = path.join(root, 'out/AILIS.app/Contents/Frameworks/Electron Framework.framework');
    const context = {electronPlatformName:'darwin', appOutDir:path.join(root,'out'), packager:{projectDir:root}};
    try {
        fs.mkdirSync(path.join(framework,'Versions/A/Libraries'),{recursive:true});
        fs.symlinkSync(path.join(framework,'Versions/A/Libraries'),path.join(framework,'Libraries'),process.platform==='win32'?'junction':'dir');
        await afterPack(context);
        fs.unlinkSync(path.join(framework,'Libraries'));
        fs.mkdirSync(path.join(framework,'Libraries'));
        await assert.rejects(afterPack(context), /Expected framework signing alias to be a symlink/);
        fs.rmdirSync(path.join(framework,'Libraries'));
        fs.symlinkSync(root,path.join(framework,'Libraries'),process.platform==='win32'?'junction':'dir');
        await assert.rejects(afterPack(context), /escapes bundle/);
        fs.unlinkSync(path.join(framework,'Libraries'));
    } finally { fs.rmSync(root,{recursive:true,force:true}); }
});
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
