import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
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
const assetsToCopy = [
    {
        source: resolve(projectRoot, 'Resources', 'AiGril.vrm'),
        target: resolve(distRoot, 'Resources', 'AiGril.vrm')
    }
];

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
