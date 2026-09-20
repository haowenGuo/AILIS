const fs = require('node:fs/promises');
const path = require('node:path');
const crypto = require('node:crypto');
const { createReadStream } = require('node:fs');

async function assertBundledAsr(projectRoot, platform = process.platform, arch = process.arch) {
    // electron-builder Arch.x64=1, Arch.arm64=3. Never cross-package binaries.
    const normalizedArch = ({ 1: 'x64', 3: 'arm64' })[arch] || arch;
    const targets = require('../installer/asr-platforms.json');
    const target = targets[`${platform}-${normalizedArch}`];
    if (!target) throw new Error('Unsupported bundled ASR target');
    const root = path.join(projectRoot, 'build-cache/ailis-asr-runtime');
    const manifest = JSON.parse(await fs.readFile(path.join(root, 'manifest.json'), 'utf8'));
    if (manifest.selfContained !== true || manifest.platform !== platform || manifest.arch !== normalizedArch ||
        manifest.modelId !== 'openai/whisper-small' || manifest.device !== 'cpu') throw new Error('Invalid bundled ASR contract');
    const inventory = JSON.parse(await fs.readFile(path.join(root, 'files.sha256.json'), 'utf8'));
    const required = [`python/${target.python}`, ...(platform === 'win32' ? ['python/python312.dll'] : []), 'site-packages/torch/__init__.py',
        `asr-cache/models--openai--whisper-small/snapshots/${manifest.modelRevision}/model.safetensors`];
    for (const file of required) if (!inventory.files.some(row => row.path === file)) throw new Error(`Missing bundled ASR file: ${file}`);
    for (const row of inventory.files) {
        const file = path.resolve(root, row.path);
        if (!file.startsWith(path.resolve(root) + path.sep)) throw new Error('Runtime inventory path escapes its root');
        if ((await fs.stat(file)).size !== row.bytes) throw new Error(`Runtime file size changed: ${row.path}`);
        const h = crypto.createHash('sha256');
        for await (const chunk of createReadStream(file)) h.update(chunk);
        if (h.digest('hex') !== row.sha256) throw new Error(`Runtime checksum mismatch: ${row.path}`);
    }
    return { files: inventory.files.length, bytes: inventory.totalBytes, model: manifest.modelId };
}
module.exports = { assertBundledAsr };
