import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const buildCacheRoot = path.join(projectRoot, 'build-cache');
const runtimeTarget = path.join(buildCacheRoot, 'openclaw-runtime');
const vendorTarget = path.join(buildCacheRoot, 'openclaw-vendor');
const refreshRequested = process.argv.includes('--refresh');

function log(message) {
    console.log(`[openclaw-runtime] ${message}`);
}

function normalizeOptionalString(value) {
    return typeof value === 'string' ? value.trim() : '';
}

function fileExists(targetPath) {
    try {
        return fs.existsSync(targetPath);
    } catch {
        return false;
    }
}

function isValidRuntimeRoot(rootPath) {
    if (!rootPath) {
        return false;
    }

    return [
        path.join(rootPath, 'openclaw.mjs'),
        path.join(rootPath, 'package.json'),
        path.join(rootPath, 'dist', 'entry.js'),
        path.join(rootPath, 'dist', 'plugin-sdk', 'gateway-runtime.js'),
        path.join(rootPath, 'node_modules')
    ].every((candidate) => fileExists(candidate));
}

function ensureCleanDirectory(targetPath) {
    fs.rmSync(targetPath, { recursive: true, force: true });
    fs.mkdirSync(targetPath, { recursive: true });
}

function copyDirectory(sourcePath, targetPath) {
    fs.rmSync(targetPath, { recursive: true, force: true });
    fs.mkdirSync(path.dirname(targetPath), { recursive: true });
    fs.cpSync(sourcePath, targetPath, {
        recursive: true,
        force: true,
        dereference: true
    });
}

function resolveRuntimeSourceCandidates() {
    return [
        normalizeOptionalString(process.env.AILIS_OPENCLAW_DEPLOY_DIR),
        path.join(projectRoot, 'tmp', 'openclaw-deploy-test'),
        path.resolve(projectRoot, '..', 'AILIS', 'AILIS', 'build-cache', 'openclaw-runtime'),
        'F:\\AILIS\\AILIS\\build-cache\\openclaw-runtime'
    ].filter(Boolean);
}

function resolveOpenClawRepoCandidates() {
    return [
        normalizeOptionalString(process.env.AILIS_OPENCLAW_REPO),
        normalizeOptionalString(process.env.OPENCLAW_REPO),
        path.resolve(projectRoot, '..', 'AILIS', 'OPENCLAW_Lobster'),
        'F:\\AILIS\\OPENCLAW_Lobster'
    ].filter(Boolean);
}

function resolveExistingOpenClawRepo() {
    return resolveOpenClawRepoCandidates().find((candidate) => (
        fileExists(path.join(candidate, 'openclaw.mjs')) &&
        fileExists(path.join(candidate, 'package.json'))
    )) || '';
}

function runDeploy(repoRoot) {
    log(`未命中现成 deploy 缓存，改为从 ${repoRoot} 执行 pnpm deploy`);
    fs.rmSync(runtimeTarget, { recursive: true, force: true });

    const result = spawnSync(
        'pnpm',
        ['--filter', 'openclaw', 'deploy', '--legacy', '--prod', runtimeTarget],
        {
            cwd: repoRoot,
            stdio: 'inherit',
            shell: true,
            env: process.env
        }
    );

    if (result.status !== 0) {
        throw new Error(`pnpm deploy 失败，退出码 ${result.status || 1}`);
    }
}

function stageRuntimeBundle() {
    if (!refreshRequested && isValidRuntimeRoot(runtimeTarget)) {
        log(`复用现有 runtime 缓存：${runtimeTarget}`);
        return runtimeTarget;
    }

    for (const candidate of resolveRuntimeSourceCandidates()) {
        if (!isValidRuntimeRoot(candidate)) {
            continue;
        }
        log(`复用已有 OpenClaw deploy 目录：${candidate}`);
        copyDirectory(candidate, runtimeTarget);
        if (!isValidRuntimeRoot(runtimeTarget)) {
            throw new Error(`从 ${candidate} 复制 runtime 后校验失败`);
        }
        return runtimeTarget;
    }

    const repoRoot = resolveExistingOpenClawRepo();
    if (!repoRoot) {
        throw new Error(
            '找不到 OpenClaw 源码目录，请设置 AILIS_OPENCLAW_REPO 或先准备现成 deploy 目录。'
        );
    }

    runDeploy(repoRoot);

    if (!isValidRuntimeRoot(runtimeTarget)) {
        throw new Error('pnpm deploy 已执行，但 build-cache/openclaw-runtime 校验失败');
    }

    return runtimeTarget;
}

function stageVendorNode() {
    const nodeBinaryName = process.platform === 'win32' ? 'node.exe' : 'node';
    const vendorNodePath = path.join(vendorTarget, nodeBinaryName);

    ensureCleanDirectory(vendorTarget);
    fs.copyFileSync(process.execPath, vendorNodePath);

    if (process.platform !== 'win32') {
        fs.chmodSync(vendorNodePath, 0o755);
    }

    fs.writeFileSync(
        path.join(vendorTarget, 'manifest.json'),
        JSON.stringify(
            {
                preparedAt: new Date().toISOString(),
                nodeVersion: process.version,
                sourcePath: process.execPath,
                platform: process.platform,
                arch: process.arch
            },
            null,
            2
        ),
        'utf8'
    );

    log(`已写入 vendor Node：${vendorNodePath}`);
}

function main() {
    fs.mkdirSync(buildCacheRoot, { recursive: true });
    const runtimeRoot = stageRuntimeBundle();
    stageVendorNode();
    log(`OpenClaw runtime 已就绪：${runtimeRoot}`);
}

main();
