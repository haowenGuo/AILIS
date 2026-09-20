import { mkdir, writeFile, copyFile, readFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import catalog from '../electron/wake-word-catalog.cjs';
const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const name = 'sherpa-onnx-kws-zipformer-zh-en-3M-2025-12-20';
const cache = join(root, 'build-cache', 'wake-download');
const dest = join(root, 'build-cache', 'ailis-wake-model');
await mkdir(cache, { recursive: true });
await mkdir(dest, { recursive: true });
const archive = join(cache, `${name}.tar.bz2`);
const url = `https://github.com/k2-fsa/sherpa-onnx/releases/download/kws-models/${name}.tar.bz2`;
if (!process.argv.includes('--cached')) {
    const response = await fetch(url, { signal: AbortSignal.timeout(180000) });
    if (!response.ok) throw new Error(`Download failed: ${response.status}`);
    await writeFile(archive, new Uint8Array(await response.arrayBuffer()));
}
execFileSync('tar', ['-xf', archive, '-C', cache]);
const files = ['encoder-epoch-13-avg-2-chunk-8-left-64.int8.onnx', 'decoder-epoch-13-avg-2-chunk-8-left-64.onnx', 'joiner-epoch-13-avg-2-chunk-8-left-64.int8.onnx', 'tokens.txt'];
const hashes = {};
for (const file of files) {
    await copyFile(join(cache, name, file), join(dest, file));
    hashes[file] = createHash('sha256').update(await readFile(join(dest, file))).digest('hex');
}
await writeFile(join(dest, 'keywords.txt'), catalog.keywordText());
await writeFile(join(dest, 'source.json'), JSON.stringify({ url, hashes }, null, 2));
console.log(dest);
