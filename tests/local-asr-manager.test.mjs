import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, test } from 'node:test';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { DesktopASRManager, probeAsrPython } = require('../electron/local-asr-manager.cjs');

let tempRoot;
let oldRuntimeDir;
let oldCacheDir;
let oldBundledCacheDir;

beforeEach(() => {
    tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'ailis-local-asr-'));
    oldRuntimeDir = process.env.AILIS_ASR_RUNTIME_DIR;
    oldCacheDir = process.env.AILIS_ASR_CACHE_DIR;
    oldBundledCacheDir = process.env.AILIS_ASR_BUNDLED_CACHE_DIR;
    delete process.env.AILIS_ASR_RUNTIME_DIR;
    delete process.env.AILIS_ASR_CACHE_DIR;
    delete process.env.AILIS_ASR_BUNDLED_CACHE_DIR;
});

afterEach(() => {
    if (oldRuntimeDir === undefined) {
        delete process.env.AILIS_ASR_RUNTIME_DIR;
    } else {
        process.env.AILIS_ASR_RUNTIME_DIR = oldRuntimeDir;
    }
    if (oldCacheDir === undefined) {
        delete process.env.AILIS_ASR_CACHE_DIR;
    } else {
        process.env.AILIS_ASR_CACHE_DIR = oldCacheDir;
    }
    if (oldBundledCacheDir === undefined) {
        delete process.env.AILIS_ASR_BUNDLED_CACHE_DIR;
    } else {
        process.env.AILIS_ASR_BUNDLED_CACHE_DIR = oldBundledCacheDir;
    }
    fs.rmSync(tempRoot, { recursive: true, force: true });
});

function createFakeApp() {
    return {
        isPackaged: true,
        getPath(name) {
            if (name === 'userData') {
                return path.join(tempRoot, 'user-data');
            }
            if (name === 'appData') {
                return path.join(tempRoot, 'app-data');
            }
            return tempRoot;
        }
    };
}

test('DesktopASRManager probes packaged ASR runtime before system Python, even with a ready manifest', async () => {
    const runtimeRoot = path.join(tempRoot, 'ailis-asr-runtime');
    fs.mkdirSync(runtimeRoot, { recursive: true });
    fs.writeFileSync(path.join(runtimeRoot, 'manifest.json'), JSON.stringify({
        asrPython: process.execPath,
        asrDependenciesReady: true,
        dependencies: {
            numpy: true,
            torch: true,
            transformers: true
        }
    }), 'utf8');
    process.env.AILIS_ASR_RUNTIME_DIR = runtimeRoot;

    const probes = [];
    const manager = new DesktopASRManager({ app: createFakeApp(), probePython: async (candidate) => {
        probes.push(candidate.command);
        return { ok: true };
    } });
    const resolved = await manager.resolvePythonCommand();

    assert.equal(path.resolve(resolved.command), path.resolve(process.execPath));
    assert.equal(resolved.source, 'packaged-asr-runtime');
    assert.deepEqual(probes, [process.execPath]);
});

test('configured voice runtime and ASR cache are reused instead of global Python', async () => {
    const paths = { voiceVenvPython: process.execPath, asrCacheDir: path.join(tempRoot, 'saved-cache') };
    const manager = new DesktopASRManager({
        app: createFakeApp(),
        getRuntimePaths: () => paths,
        probePython: async () => ({ ok: true })
    });
    const python = await manager.resolvePythonCommand();
    assert.equal(python.source, 'configured-voice-runtime');
    assert.equal(python.env.PYTHONNOUSERSITE, '1');
    assert.equal(python.env.PYTHONPATH, '');
    assert.equal(manager.resolveCacheDir(), paths.asrCacheDir);
});

test('a working --version is not enough: broken DLL candidates are rejected', async () => {
    const probes = [];
    const manager = new DesktopASRManager({ app: createFakeApp(), probePython: async (candidate) => {
        probes.push(candidate.source);
        return candidate.source === 'py-3.12' ? { ok: true } : { ok: false, error: 'ImportError: DLL load failed while importing _C' };
    } });
    const python = await manager.resolvePythonCommand();
    assert.equal(python.source, 'py-3.12');
    assert.ok(probes.includes('python'));
});

test('all rejected runtimes report the interpreter and actual dependency error', async () => {
    const manager = new DesktopASRManager({ app: createFakeApp(), probePython: async () => ({
        ok: false, error: 'ImportError: DLL load failed while importing _C'
    }) });
    await assert.rejects(manager.resolvePythonCommand(), /python.*DLL load failed/);
    assert.equal(manager.pythonCommand, null);
});

test('a ready packaged manifest cannot bypass a failed native import', async () => {
    const runtimeRoot = path.join(tempRoot, 'broken-packaged');
    fs.mkdirSync(runtimeRoot, { recursive: true });
    fs.writeFileSync(path.join(runtimeRoot, 'manifest.json'), JSON.stringify({
        asrPython: process.execPath, asrDependenciesReady: true
    }));
    process.env.AILIS_ASR_RUNTIME_DIR = runtimeRoot;
    const manager = new DesktopASRManager({
        app: createFakeApp(),
        probePython: async (candidate) => candidate.source === 'packaged-asr-runtime'
            ? { ok: false, error: 'ImportError: native library missing' }
            : { ok: true }
    });
    assert.notEqual((await manager.resolvePythonCommand()).source, 'packaged-asr-runtime');
});

test('close rejects pending work immediately and resets warmup and selection', async () => {
    const manager = new DesktopASRManager({ app: createFakeApp() });
    let killed = false;
    manager.child = { killed: false, kill: () => { killed = true; } };
    manager.pythonCommand = { command: 'old-python' };
    manager.warmupPromise = Promise.resolve({ status: 'old' });
    const pending = new Promise((resolve, reject) => manager.pending.set('1', {
        resolve, reject, child: manager.child, timeoutId: setTimeout(() => {}, 10000)
    }));
    manager.close();
    await assert.rejects(pending, /已关闭或配置已变更/);
    assert.equal(killed, true);
    assert.equal(manager.child, null);
    assert.equal(manager.pythonCommand, null);
    assert.equal(manager.warmupPromise, null);
    assert.equal(manager.pending.size, 0);
});

test('runtime path changes invalidate cached selection and cancel an in-flight probe', async () => {
    let release;
    const manager = new DesktopASRManager({
        app: createFakeApp(),
        getRuntimePaths: () => ({ voiceVenvPython: process.execPath }),
        probePython: () => new Promise((resolve) => { release = resolve; })
    });
    const selection = manager.resolvePythonCommand();
    manager.close();
    release({ ok: true });
    await assert.rejects(selection, /configuration changed/);
    assert.equal(manager.pythonCommand, null);
    manager.probePython = async () => ({ ok: true });
    assert.equal((await manager.resolvePythonCommand()).command, process.execPath);
});

test('simultaneous warmup and recognition share worker startup', async () => {
    let starts = 0;
    let release;
    const manager = new DesktopASRManager({ app: createFakeApp() });
    manager.startWorker = () => {
        starts += 1;
        return new Promise((resolve) => { release = resolve; });
    };
    const first = manager.ensureWorker();
    const second = manager.ensureWorker();
    assert.equal(first, second);
    release({ pid: 42 });
    await first;
    assert.equal(starts, 1);
});

test('real async probe returns spawn errors without blocking or trusting a manifest', async () => {
    const result = await probeAsrPython({ command: path.join(tempRoot, 'missing-python.exe') });
    assert.equal(result.ok, false);
    assert.match(result.error, /ENOENT/);
});

test('DesktopASRManager resolves packaged HuggingFace ASR cache with hub layout', () => {
    const runtimeRoot = path.join(tempRoot, 'ailis-asr-runtime');
    const modelDir = path.join(runtimeRoot, 'asr-cache', 'hub', 'models--openai--whisper-small');
    fs.mkdirSync(modelDir, { recursive: true });
    fs.writeFileSync(path.join(runtimeRoot, 'manifest.json'), JSON.stringify({
        asrPython: process.execPath,
        asrCache: 'asr-cache',
        asrDependenciesReady: true
    }), 'utf8');
    process.env.AILIS_ASR_RUNTIME_DIR = runtimeRoot;

    const manager = new DesktopASRManager({ app: createFakeApp() });

    assert.equal(path.resolve(manager.resolveCacheDir()), path.resolve(path.join(runtimeRoot, 'asr-cache')));
});
