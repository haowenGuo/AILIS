import { cpSync, existsSync, mkdirSync, readdirSync, rmSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
    getLoadableMotionFiles,
    listMotionIntakeEntries
} from '../src/character/motion-intake-catalog.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, '..');
const distRoot = resolve(projectRoot, 'dist');

// 只复制前端实际会访问到的 VRM 与 VRMA 资源，避免把无关的大文件一起打进 Pages 产物。
const resourcesRoot = resolve(projectRoot, 'Resources');
const safeVrmFiles = new Set(['ailis.vrm']);
const assetsToCopy = [
    {
        source: resolve(projectRoot, 'Resources', 'Emotes'),
        target: resolve(distRoot, 'Resources', 'Emotes'),
        replaceExisting: true
    }
];

if (existsSync(resourcesRoot)) {
    for (const entry of readdirSync(resourcesRoot, { withFileTypes: true })) {
        if (!entry.isFile() || !entry.name.toLowerCase().endsWith('.vrm')) {
            continue;
        }
        if (!safeVrmFiles.has(entry.name.toLowerCase())) {
            const staleTarget = resolve(distRoot, 'Resources', entry.name);
            rmSync(staleTarget, { force: true });
            console.log(`[build] skipped unsafe/unapproved VRM asset: ${entry.name}`);
            continue;
        }
        assetsToCopy.push({
            source: resolve(resourcesRoot, entry.name),
            target: resolve(distRoot, 'Resources', entry.name)
        });
    }
}

const loadableMotionTargets = new Set(
    getLoadableMotionFiles().map((motionFile) => resolve(distRoot, motionFile.path))
);
for (const entry of listMotionIntakeEntries()) {
    if (!entry.localPath) {
        continue;
    }
    const target = resolve(distRoot, entry.localPath);
    if (loadableMotionTargets.has(target) || !existsSync(target)) {
        continue;
    }
    rmSync(target, { force: true });
    console.log(`[build] removed stale motion asset: ${target}`);
}

for (const motionFile of getLoadableMotionFiles()) {
    assetsToCopy.push({
        source: resolve(projectRoot, motionFile.path),
        target: resolve(distRoot, motionFile.path)
    });
}

for (const asset of assetsToCopy) {
    if (!existsSync(asset.source)) {
        console.warn(`[build] skipped missing asset: ${asset.source}`);
        continue;
    }

    if (existsSync(asset.target) && asset.replaceExisting) {
        rmSync(asset.target, { recursive: true, force: true });
    }

    if (existsSync(asset.target)) {
        console.log(`[build] kept existing asset: ${asset.target}`);
        continue;
    }

    mkdirSync(dirname(asset.target), { recursive: true });
    try {
        cpSync(asset.source, asset.target, { recursive: true });
        console.log(`[build] copied: ${asset.source} -> ${asset.target}`);
    } catch (error) {
        console.warn(`[build] skipped asset copy due to ${error.code || error.name}: ${asset.target}`);
    }
}
