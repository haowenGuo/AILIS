import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { DesktopASRManager } = require('../electron/local-asr-manager.cjs');
const { assertBundledAsr } = require('../scripts/bundled-asr-contract.cjs');

test('default installer has a fixed bundled ASR payload and no optional component page', () => {
    const script = fs.readFileSync(new URL('../installer/ailis-runtime-components.nsh', import.meta.url), 'utf8');
    assert.doesNotMatch(script, /Page custom|NSD_CreateCheckbox|CopyFiles|FileWrite/);
    const config = fs.readFileSync(new URL('../electron-builder.yml', import.meta.url), 'utf8');
    assert.match(config, /ailisBundledAsr: true/);
    assert.match(config, /from: build-cache\/ailis-asr-runtime/);
    const profiles = JSON.parse(fs.readFileSync(new URL('../installer/ailis-release-profiles.json', import.meta.url)));
    assert.deepEqual(profiles.profiles.core.runtimeComponents, []);
    assert.deepEqual(profiles.profiles.core.bundledRuntimeComponents, ['asr-runtime']);
});

test('packaged ASR isolates Python and model imports from developer environment', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ailis-bundled-asr-'));
    const old = Object.fromEntries(['AILIS_ASR_RUNTIME_DIR','AILIS_ASR_PYTHON','PYTHONHOME','PYTHONPATH','HF_HOME','HF_HUB_CACHE'].map(k => [k, process.env[k]]));
    try {
        fs.writeFileSync(path.join(dir, 'manifest.json'), JSON.stringify({ selfContained: true,
            asrPython: process.execPath, pythonPath: ['site-packages'], asrCache: 'asr-cache' }));
        Object.assign(process.env, { AILIS_ASR_RUNTIME_DIR: dir, PYTHONPATH: 'must-not-inherit', PYTHONHOME: 'broken-python', HF_HOME: 'wrong-models' });
        delete process.env.AILIS_ASR_PYTHON;
        const manager = new DesktopASRManager({ app: { isPackaged: true, getPath: () => dir }, probePython: async () => ({ ok: true }) });
        const resolved = await manager.resolvePythonCommand();
        assert.equal(resolved.source, 'packaged-asr-runtime');
        assert.equal(resolved.env.PYTHONPATH, path.join(dir, 'site-packages'));
        assert.equal(resolved.env.PYTHONHOME, '');
        assert.equal(resolved.env.PYTHONNOUSERSITE, '1');
        assert.equal(resolved.env.HF_HOME, path.join(dir, 'asr-cache'));
        assert.equal(resolved.env.HF_HUB_OFFLINE, '1');
        manager.close();
    } finally {
        for (const [key, value] of Object.entries(old)) if (value === undefined) delete process.env[key]; else process.env[key] = value;
        fs.rmSync(dir, { recursive: true, force: true });
    }
});

test('build gate rejects absent runtime and mismatched target platform', async () => {
    await assert.rejects(assertBundledAsr('missing-project', 'darwin', 'arm64'), /Windows x64 only/);
    await assert.rejects(assertBundledAsr('missing-project', 'win32', 'x64'), /ENOENT/);
});

test('build gate verifies complete payload bytes and rejects tampering', async () => {
    const project = fs.mkdtempSync(path.join(os.tmpdir(), 'ailis-asr-build-gate-'));
    const root = path.join(project, 'build-cache/ailis-asr-runtime');
    try {
        fs.mkdirSync(root, { recursive: true });
        fs.writeFileSync(path.join(root, 'manifest.json'), JSON.stringify({ selfContained: true,
            platform: 'win32', arch: 'x64', modelId: 'openai/whisper-small', device: 'cpu', modelRevision: 'test' }));
        const names = ['python/python.exe', 'python/python312.dll', 'site-packages/torch/__init__.py',
            'asr-cache/models--openai--whisper-small/snapshots/test/model.safetensors'];
        const data = Buffer.from('fixture');
        const files = names.map(name => {
            fs.mkdirSync(path.dirname(path.join(root, name)), { recursive: true });
            fs.writeFileSync(path.join(root, name), data);
            return { path: name, bytes: data.length, sha256: crypto.createHash('sha256').update(data).digest('hex') };
        });
        fs.writeFileSync(path.join(root, 'files.sha256.json'), JSON.stringify({ files, totalBytes: files.length * data.length }));
        assert.equal((await assertBundledAsr(project, 'win32', 1)).files, 4);
        fs.writeFileSync(path.join(root, names[0]), 'changed');
        await assert.rejects(assertBundledAsr(project, 'win32', 'x64'), /checksum mismatch/);
    } finally { fs.rmSync(project, { recursive: true, force: true }); }
});
