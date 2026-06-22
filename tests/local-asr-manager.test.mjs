import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, test } from 'node:test';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { DesktopASRManager } = require('../electron/local-asr-manager.cjs');

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

test('DesktopASRManager prefers packaged ASR runtime before system Python', () => {
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

    const manager = new DesktopASRManager({ app: createFakeApp() });
    const resolved = manager.resolvePythonCommand();

    assert.equal(path.resolve(resolved.command), path.resolve(process.execPath));
    assert.equal(resolved.source, 'packaged-asr-runtime');
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
