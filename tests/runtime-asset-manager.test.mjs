import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { RuntimeAssetManager } = require('../electron/runtime-asset-manager.cjs');

async function makeProject() {
    return await mkdtemp(path.join(os.tmpdir(), 'ailis-runtime-assets-'));
}

test('RuntimeAssetManager scans known assets and reports totals', async () => {
    const projectRoot = await makeProject();
    try {
        await mkdir(path.join(projectRoot, 'build-cache', 'benchmarks'), { recursive: true });
        await writeFile(path.join(projectRoot, 'build-cache', 'benchmarks', 'sample.txt'), 'hello');
        const manager = new RuntimeAssetManager({
            projectRoot,
            definitions: [
                {
                    id: 'bench',
                    label: 'Bench Cache',
                    category: 'build_cache',
                    relativePath: 'build-cache/benchmarks',
                    risk: 'low',
                    reinstallable: true,
                    preferredRoot: 'cache'
                }
            ]
        });

        const scan = await manager.scan();
        assert.equal(scan.ok, true);
        assert.equal(scan.totals.assetCount, 1);
        assert.equal(scan.totals.existingCount, 1);
        assert.equal(scan.assets[0].exists, true);
        assert.equal(scan.assets[0].bytes, 5);
        assert.equal(scan.assets[0].deletable, true);
    } finally {
        await rm(projectRoot, { recursive: true, force: true });
    }
});

test('RuntimeAssetManager deletes only registered runtime assets', async () => {
    const projectRoot = await makeProject();
    try {
        const assetDir = path.join(projectRoot, '.ailis-runtime', 'uv-cache');
        await mkdir(assetDir, { recursive: true });
        await writeFile(path.join(assetDir, 'cache.bin'), 'cache');
        const manager = new RuntimeAssetManager({
            projectRoot,
            definitions: [
                {
                    id: 'uv-cache',
                    label: 'uv Cache',
                    category: 'dependency_cache',
                    relativePath: '.ailis-runtime/uv-cache',
                    risk: 'low',
                    reinstallable: true
                }
            ]
        });

        const result = await manager.deleteAsset('uv-cache');
        assert.equal(result.ok, true);
        assert.equal(result.deleted, true);
        assert.equal(result.bytesFreed, 5);

        const scan = await manager.scan();
        assert.equal(scan.assets[0].exists, false);
        await assert.rejects(() => manager.deleteAsset('unknown'), /unknown_runtime_asset/);
    } finally {
        await rm(projectRoot, { recursive: true, force: true });
    }
});

test('RuntimeAssetManager migrates a registered asset to an explicit target root', async () => {
    const projectRoot = await makeProject();
    const targetRoot = await makeProject();
    try {
        const sourceDir = path.join(projectRoot, 'models', 'voice-runtime');
        await mkdir(sourceDir, { recursive: true });
        await writeFile(path.join(sourceDir, 'manifest.txt'), 'voice');
        const manager = new RuntimeAssetManager({
            projectRoot,
            definitions: [
                {
                    id: 'voice-runtime',
                    label: 'Voice Runtime',
                    category: 'voice',
                    relativePath: 'models/voice-runtime',
                    risk: 'high',
                    reinstallable: true,
                    supportsMigration: true,
                    preferredRoot: 'models'
                }
            ]
        });

        const result = await manager.migrateAsset('voice-runtime', targetRoot);
        assert.equal(result.migrated, true);
        assert.equal(result.preferencePatch.voiceRuntimeRoot, result.targetPath);
        assert.equal(await readFile(path.join(result.targetPath, 'manifest.txt'), 'utf8'), 'voice');

        const scan = await manager.scan();
        assert.equal(scan.assets[0].exists, false);
    } finally {
        await rm(projectRoot, { recursive: true, force: true });
        await rm(targetRoot, { recursive: true, force: true });
    }
});

test('RuntimeAssetManager refuses migration for assets without a path preference', async () => {
    const projectRoot = await makeProject();
    const targetRoot = await makeProject();
    try {
        await mkdir(path.join(projectRoot, '.ailis-runtime', 'vllm-venv'), { recursive: true });
        const manager = new RuntimeAssetManager({
            projectRoot,
            definitions: [
                {
                    id: 'vllm-venv',
                    label: 'vLLM Runtime',
                    category: 'local_llm',
                    relativePath: '.ailis-runtime/vllm-venv',
                    risk: 'medium',
                    reinstallable: true
                }
            ]
        });

        const scan = await manager.scan();
        assert.equal(scan.assets[0].migratable, false);
        await assert.rejects(
            () => manager.migrateAsset('vllm-venv', targetRoot),
            /asset_migration_not_supported/
        );
    } finally {
        await rm(projectRoot, { recursive: true, force: true });
        await rm(targetRoot, { recursive: true, force: true });
    }
});

test('RuntimeAssetManager refuses definitions outside the project root', async () => {
    const projectRoot = await makeProject();
    try {
        const manager = new RuntimeAssetManager({
            projectRoot,
            definitions: [
                {
                    id: 'outside',
                    label: 'Outside',
                    category: 'unsafe',
                    relativePath: '../outside',
                    risk: 'high',
                    reinstallable: true
                }
            ]
        });
        await assert.rejects(() => manager.scan(), /refuse_to_manage_outside_project/);
    } finally {
        await rm(projectRoot, { recursive: true, force: true });
    }
});
