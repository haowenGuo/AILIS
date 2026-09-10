const fs = require('node:fs/promises');
const path = require('node:path');
const crypto = require('node:crypto');
const { createReadStream } = require('node:fs');

async function assertBundledAsr(projectRoot, platform = process.platform, arch = process.arch) {
    // electron-builder's Arch.x64 enum is 1. Never mix target binaries.
    if (platform !== 'win32' || !['x64', 1].includes(arch)) throw new Error('Bundled ASR baseline supports Windows x64 only');
    const root = path.join(projectRoot, 'build-cache/ailis-asr-runtime');
    const manifest = JSON.parse(await fs.readFile(path.join(root, 'manifest.json'), 'utf8'));
    if (manifest.selfContained !== true || manifest.platform !== platform || manifest.arch !== 'x64' ||
        manifest.modelId !== 'openai/whisper-small' || manifest.device !== 'cpu') throw new Error('Invalid bundled ASR contract');
    const inventory = JSON.parse(await fs.readFile(path.join(root, 'files.sha256.json'), 'utf8'));
    const required = ['python/python.exe', 'python/python312.dll', 'site-packages/torch/__init__.py',
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
