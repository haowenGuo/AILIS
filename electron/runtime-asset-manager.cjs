'use strict';

const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');

const RUNTIME_ASSET_DEFINITIONS = Object.freeze([
    {
        id: 'voice-runtime',
        label: 'CosyVoice3 / Voice Runtime',
        category: 'voice',
        relativePath: 'models/voice-runtime',
        risk: 'high',
        reinstallable: true,
        supportsMigration: true,
        preferredRoot: 'models',
        description: '本地语音源码、模型、私有 Python venv 和 ASR 缓存。删除后语音会回到未安装状态。'
    },
    {
        id: 'vllm-venv',
        label: 'vLLM Python Runtime',
        category: 'local_llm',
        relativePath: '.ailis-runtime/vllm-venv',
        risk: 'medium',
        reinstallable: true,
        preferredRoot: 'runtimes',
        description: '旧 vLLM 自动部署环境。当前策略已转向 Ollama，可按需删除或迁移。'
    },
    {
        id: 'asr-runtime',
        label: 'ASR Runtime Cache',
        category: 'asr',
        relativePath: '.ailis-runtime/asr-runtime',
        risk: 'medium',
        reinstallable: true,
        preferredRoot: 'models',
        description: '本地语音识别模型和运行缓存。删除后 ASR 需要重新安装或重新指定路径。'
    },
    {
        id: 'playwright-cache',
        label: 'Playwright Browser Cache',
        category: 'web',
        relativePath: '.ailis-runtime/ms-playwright',
        risk: 'low',
        reinstallable: true,
        preferredRoot: 'runtimes',
        description: '网页/浏览器自动化运行时浏览器缓存。删除后相关能力会按需重新下载。'
    },
    {
        id: 'crawl4ai-venv',
        label: 'Crawl4AI Python Runtime',
        category: 'web',
        relativePath: '.ailis-runtime/crawl4ai-venv',
        risk: 'low',
        reinstallable: true,
        preferredRoot: 'runtimes',
        description: 'Web/Search 相关 Python 环境。删除后网页抓取能力会按需重建。'
    },
    {
        id: 'searxng-venv',
        label: 'SearXNG Python Runtime',
        category: 'web',
        relativePath: '.ailis-runtime/searxng-venv',
        risk: 'low',
        reinstallable: true,
        preferredRoot: 'runtimes',
        description: '本地搜索运行环境。删除后本地搜索服务需要重新安装。'
    },
    {
        id: 'searxng-src',
        label: 'SearXNG Source Cache',
        category: 'web',
        relativePath: '.ailis-runtime/searxng-src',
        risk: 'low',
        reinstallable: true,
        preferredRoot: 'runtimes',
        description: '本地搜索源码缓存。删除后可通过 Web/Search runtime 重新获取。'
    },
    {
        id: 'uv-cache',
        label: 'uv Download Cache',
        category: 'dependency_cache',
        relativePath: '.ailis-runtime/uv-cache',
        risk: 'low',
        reinstallable: true,
        preferredRoot: 'cache',
        description: 'Python/依赖下载缓存。删除通常安全，只会让下次安装重新下载。'
    },
    {
        id: 'build-cache-asr',
        label: 'Build Cache: ASR Runtime',
        category: 'build_cache',
        relativePath: 'build-cache/ailis-asr-runtime',
        risk: 'low',
        reinstallable: true,
        preferredRoot: 'cache',
        description: '构建安装包时生成的 ASR runtime 缓存，不应长期堆在源码目录。'
    },
    {
        id: 'build-cache-web',
        label: 'Build Cache: Web/Search Runtime',
        category: 'build_cache',
        relativePath: 'build-cache/ailis-web-runtime',
        risk: 'low',
        reinstallable: true,
        preferredRoot: 'cache',
        description: '构建安装包时生成的 Web/Search runtime 缓存，可重新生成。'
    },
    {
        id: 'build-cache-ragflow-pydeps',
        label: 'Build Cache: Python Dependencies Probe',
        category: 'build_cache',
        relativePath: 'build-cache/ragflow-pydeps-test',
        risk: 'low',
        reinstallable: true,
        preferredRoot: 'cache',
        description: '历史 Python 依赖探测缓存。通常可删除。'
    },
    {
        id: 'build-cache-benchmarks',
        label: 'Build Cache: Benchmarks',
        category: 'benchmark',
        relativePath: 'build-cache/benchmarks',
        risk: 'low',
        reinstallable: true,
        preferredRoot: 'cache',
        description: '评测数据缓存。删除不会影响核心应用，但再次评测可能需要重新准备数据。'
    }
]);

const RISK_ORDER = Object.freeze({
    low: 1,
    medium: 2,
    high: 3
});

function normalizePathForCompare(value = '') {
    return path.resolve(String(value || '')).replace(/[\\/]+$/, '').toLowerCase();
}

function isSubPath(parent, child) {
    const normalizedParent = normalizePathForCompare(parent);
    const normalizedChild = normalizePathForCompare(child);
    return normalizedChild === normalizedParent ||
        normalizedChild.startsWith(`${normalizedParent}${path.sep}`.toLowerCase());
}

function getDefaultExternalRoot(projectRoot, kind = 'runtimes') {
    const parsed = path.parse(path.resolve(projectRoot || process.cwd()));
    const driveRoot = parsed.root || process.cwd();
    if (kind === 'models') {
        return path.join(driveRoot, 'AILIS', 'models');
    }
    if (kind === 'cache') {
        return path.join(driveRoot, 'AILIS', 'cache');
    }
    return path.join(driveRoot, 'AILIS', 'runtimes');
}

function formatIsoTime(timeMs = 0) {
    if (!Number.isFinite(timeMs) || timeMs <= 0) {
        return '';
    }
    return new Date(timeMs).toISOString();
}

async function measurePath(targetPath, options = {}) {
    const root = path.resolve(targetPath);
    try {
        await fsp.lstat(root);
    } catch (error) {
        if (error?.code === 'ENOENT') {
            return {
                exists: false,
                bytes: 0,
                fileCount: 0,
                directoryCount: 0,
                latestModifiedAt: '',
                error: ''
            };
        }
        return {
            exists: false,
            bytes: 0,
            fileCount: 0,
            directoryCount: 0,
            latestModifiedAt: '',
            error: error?.message || String(error)
        };
    }

    const concurrency = Math.max(4, Math.min(96, Number(options.concurrency) || 48));
    const queue = [root];
    let bytes = 0;
    let fileCount = 0;
    let directoryCount = 0;
    let latestModifiedMs = 0;
    let error = '';

    await new Promise((resolve) => {
        let active = 0;
        const pump = () => {
            while (active < concurrency && queue.length) {
                const fullPath = queue.pop();
                active += 1;
                void (async () => {
                    try {
                        const stat = await fsp.lstat(fullPath);
                        latestModifiedMs = Math.max(latestModifiedMs, stat.mtimeMs || 0);
                        if (stat.isSymbolicLink()) {
                            fileCount += 1;
                            bytes += stat.size || 0;
                            return;
                        }
                        if (stat.isDirectory()) {
                            directoryCount += 1;
                            let children = [];
                            try {
                                children = await fsp.readdir(fullPath, { withFileTypes: true });
                            } catch (readError) {
                                error = error || readError?.message || String(readError);
                                return;
                            }
                            for (const child of children) {
                                queue.push(path.join(fullPath, child.name));
                            }
                            return;
                        }
                        fileCount += 1;
                        bytes += stat.size || 0;
                    } catch (entryError) {
                        error = error || entryError?.message || String(entryError);
                    } finally {
                        active -= 1;
                        if (!queue.length && active === 0) {
                            resolve();
                            return;
                        }
                        pump();
                    }
                })();
            }
            if (!queue.length && active === 0) {
                resolve();
            }
        };
        pump();
    });

    return {
        exists: true,
        bytes,
        fileCount,
        directoryCount,
        latestModifiedAt: formatIsoTime(latestModifiedMs),
        error
    };
}

class RuntimeAssetManager {
    constructor(options = {}) {
        this.projectRoot = path.resolve(options.projectRoot || process.cwd());
        this.definitions = options.definitions || RUNTIME_ASSET_DEFINITIONS;
    }

    getRoots() {
        return {
            projectRoot: this.projectRoot,
            recommended: {
                models: getDefaultExternalRoot(this.projectRoot, 'models'),
                runtimes: getDefaultExternalRoot(this.projectRoot, 'runtimes'),
                cache: getDefaultExternalRoot(this.projectRoot, 'cache')
            }
        };
    }

    resolveAssetPath(definition) {
        return path.resolve(this.projectRoot, definition.relativePath);
    }

    getDefinition(assetId) {
        const id = String(assetId || '').trim();
        return this.definitions.find((definition) => definition.id === id) || null;
    }

    assertManagedAsset(definition) {
        if (!definition) {
            throw new Error('unknown_runtime_asset');
        }
        const targetPath = this.resolveAssetPath(definition);
        if (!isSubPath(this.projectRoot, targetPath)) {
            throw new Error(`refuse_to_manage_outside_project:${targetPath}`);
        }
        return targetPath;
    }

    async scan() {
        const assets = [];
        for (const definition of this.definitions) {
            const targetPath = this.assertManagedAsset(definition);
            const measurement = await measurePath(targetPath);
            const preferredRoot = definition.preferredRoot || 'runtimes';
            const recommendedRoot = this.getRoots().recommended[preferredRoot] || this.getRoots().recommended.runtimes;
            const recommendedPath = path.join(recommendedRoot, path.basename(targetPath));
            const deletable = Boolean(measurement.exists && definition.reinstallable);
            assets.push({
                id: definition.id,
                label: definition.label,
                category: definition.category,
                path: targetPath,
                relativePath: definition.relativePath,
                exists: measurement.exists,
                bytes: measurement.bytes,
                fileCount: measurement.fileCount,
                directoryCount: measurement.directoryCount,
                latestModifiedAt: measurement.latestModifiedAt,
                risk: definition.risk || 'medium',
                riskRank: RISK_ORDER[definition.risk || 'medium'] || 2,
                managed: true,
                deletable,
                reinstallable: Boolean(definition.reinstallable),
                migratable: Boolean(measurement.exists && definition.supportsMigration),
                recommendedPath,
                recommendedAction: this.getRecommendedAction(definition, measurement),
                description: definition.description || '',
                error: measurement.error || ''
            });
        }

        const existing = assets.filter((asset) => asset.exists);
        const totalBytes = existing.reduce((sum, asset) => sum + asset.bytes, 0);
        const reclaimableBytes = existing
            .filter((asset) => asset.deletable && asset.risk !== 'high')
            .reduce((sum, asset) => sum + asset.bytes, 0);
        return {
            ok: true,
            scannedAt: new Date().toISOString(),
            roots: this.getRoots(),
            totals: {
                assetCount: assets.length,
                existingCount: existing.length,
                totalBytes,
                reclaimableBytes
            },
            assets: assets.sort((a, b) => {
                if (b.exists !== a.exists) {
                    return Number(b.exists) - Number(a.exists);
                }
                return b.bytes - a.bytes;
            })
        };
    }

    getRecommendedAction(definition, measurement) {
        if (!measurement.exists) {
            return 'not_installed';
        }
        if (definition.category === 'build_cache' || definition.category === 'benchmark') {
            return 'delete_if_not_building_or_evaluating';
        }
        if (definition.risk === 'high') {
            return 'keep_or_migrate_after_confirming_feature_disabled';
        }
        return 'migrate_or_delete_when_not_in_use';
    }

    async deleteAsset(assetId, options = {}) {
        const definition = this.getDefinition(assetId);
        const targetPath = this.assertManagedAsset(definition);
        const measurement = await measurePath(targetPath);
        if (!measurement.exists) {
            return {
                ok: true,
                deleted: false,
                assetId: definition.id,
                path: targetPath,
                bytesFreed: 0,
                message: 'asset_not_found'
            };
        }
        if (!definition.reinstallable) {
            throw new Error(`asset_not_deletable:${definition.id}`);
        }
        if (options.dryRun) {
            return {
                ok: true,
                dryRun: true,
                deleted: false,
                assetId: definition.id,
                path: targetPath,
                bytesFreed: measurement.bytes
            };
        }
        await fsp.rm(targetPath, { recursive: true, force: true });
        return {
            ok: true,
            deleted: true,
            assetId: definition.id,
            path: targetPath,
            bytesFreed: measurement.bytes
        };
    }

    async planMigration(assetId, targetRoot) {
        const definition = this.getDefinition(assetId);
        const sourcePath = this.assertManagedAsset(definition);
        if (!definition.supportsMigration) {
            throw new Error(`asset_migration_not_supported:${definition.id}`);
        }
        const measurement = await measurePath(sourcePath);
        const normalizedTargetRoot = path.resolve(String(targetRoot || '').trim());
        if (!measurement.exists) {
            throw new Error(`asset_missing:${definition.id}`);
        }
        if (!String(targetRoot || '').trim()) {
            throw new Error('target_root_required');
        }
        if (isSubPath(sourcePath, normalizedTargetRoot)) {
            throw new Error('target_root_inside_source');
        }
        const targetPath = path.join(normalizedTargetRoot, path.basename(sourcePath));
        return {
            ok: true,
            assetId: definition.id,
            sourcePath,
            targetRoot: normalizedTargetRoot,
            targetPath,
            bytes: measurement.bytes,
            needsPreferenceUpdate: definition.id === 'voice-runtime',
            preferencePatch: definition.id === 'voice-runtime'
                ? { voiceRuntimeRoot: targetPath }
                : {}
        };
    }

    async migrateAsset(assetId, targetRoot, options = {}) {
        const plan = await this.planMigration(assetId, targetRoot);
        const targetExists = await measurePath(plan.targetPath);
        if (targetExists.exists && !options.overwrite) {
            throw new Error(`target_already_exists:${plan.targetPath}`);
        }
        if (options.dryRun) {
            return {
                ...plan,
                dryRun: true,
                migrated: false
            };
        }
        await fsp.mkdir(path.dirname(plan.targetPath), { recursive: true });
        if (targetExists.exists && options.overwrite) {
            await fsp.rm(plan.targetPath, { recursive: true, force: true });
        }
        await fsp.rename(plan.sourcePath, plan.targetPath);
        return {
            ...plan,
            migrated: true
        };
    }
}

module.exports = {
    RuntimeAssetManager,
    RUNTIME_ASSET_DEFINITIONS,
    getDefaultExternalRoot,
    isSubPath,
    measurePath
};
