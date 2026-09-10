import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { createReadStream } from 'node:fs';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

// Build-time provisioning only. Never install anything on an end user's system.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const build = path.join(root, 'build-cache/asr-build');
const output = path.join(root, 'build-cache/ailis-asr-runtime');
const option = name => process.argv.find(a => a.startsWith(`--${name}=`))?.slice(name.length + 3);
const modelSource = option('model-source');
const uv = option('uv') || 'uv';
const revision = '973afd24965f72e36ca33b3055d56a652f456b4d';
const modelId = 'openai/whisper-small';
const pythonVersion = '3.12.10';
const privateRoot = path.join(build, 'managed-python');
const targetDeps = path.join(build, 'site-packages');
const lock = path.join(root, 'installer/asr-requirements-win-x64.lock');
const env = { ...process.env, UV_NO_CONFIG: '1', UV_CACHE_DIR: path.join(build, 'uv-cache'),
    UV_PYTHON_INSTALL_DIR: privateRoot, UV_LINK_MODE: 'copy', UV_PYTHON_PREFERENCE: 'only-managed',
    TEMP: path.join(build, 'temp'), TMP: path.join(build, 'temp'),
    PYTHONPATH: '', PYTHONHOME: '', PYTHONNOUSERSITE: '1', PYTHONIOENCODING: 'utf-8', PYTHONDONTWRITEBYTECODE: '1' };

async function run(command, args, extra = {}) {
    const child = spawn(command, args, { cwd: root, env: { ...env, ...extra }, windowsHide: true,
        stdio: ['ignore', 'pipe', 'pipe'] });
    let stdout = '';
    child.stdout.on('data', data => { stdout += data; if (!args.includes('compile')) process.stdout.write(data); });
    child.stderr.on('data', data => process.stderr.write(data));
    const timer = setTimeout(() => child.kill(), 30 * 60 * 1000);
    try {
        await new Promise((resolve, reject) => {
            child.on('error', reject);
            child.on('close', code => code === 0 ? resolve() : reject(new Error(`${path.basename(command)} exited ${code}`)));
        });
    } finally { clearTimeout(timer); }
    return stdout.trim();
}
async function exists(file) { return fs.access(file).then(() => true, () => false); }
async function hash(file) {
    const h = crypto.createHash('sha256');
    for await (const chunk of createReadStream(file)) h.update(chunk);
    return h.digest('hex');
}
async function inventory(directory, relative = '') {
    const rows = [];
    for (const entry of await fs.readdir(path.join(directory, relative), { withFileTypes: true })) {
        const rel = path.posix.join(relative, entry.name);
        if (entry.isSymbolicLink()) throw new Error(`Non-portable link in runtime: ${rel}`);
        if (entry.isDirectory()) rows.push(...await inventory(directory, rel));
        else if (entry.isFile()) rows.push({ path: rel, bytes: (await fs.stat(path.join(directory, rel))).size,
            sha256: await hash(path.join(directory, rel)) });
    }
    return rows;
}
function copyFilter(sourceRoot, file) {
    const rel = path.relative(sourceRoot, file).replaceAll('\\', '/');
    if (rel.split('/').some(n => ['__pycache__', '.git', '.cache'].includes(n))) return false;
    if (/\.(pyc|pyo|incomplete)$/.test(rel)) return false;
    // Only C++ build inputs. Keep all DLLs, Python sources and license metadata.
    if (/^torch\/include\//.test(rel) || /^torch\/lib\/.*\.lib$/i.test(rel)) return false;
    return true;
}

async function main() {
    if (process.platform !== 'win32' || process.arch !== 'x64') throw new Error('This frozen release baseline is Windows x64 only.');
    if (await exists(output)) throw new Error(`Refusing to overwrite runtime: ${output}`);
    if (!modelSource) throw new Error('Provide --model-source=<Whisper Small snapshot directory>. No implicit full-model downloads.');
    await fs.mkdir(env.TEMP, { recursive: true });
    await run(uv, ['python', 'install', pythonVersion, '--install-dir', privateRoot, '--no-bin', '--no-registry']);
    const installed = (await fs.readdir(privateRoot)).find(n => n.startsWith(`cpython-${pythonVersion}-windows-x86_64`));
    if (!installed) throw new Error('Pinned private Python missing');
    const pythonRoot = path.join(privateRoot, installed);
    const python = path.join(pythonRoot, 'python.exe');
    const wheelRoot = path.join(build, 'wheels');
    await fs.mkdir(wheelRoot, { recursive: true });
    const wheels = JSON.parse(await fs.readFile(path.join(root, 'installer/asr-wheels.json'), 'utf8'));
    for (const wheel of wheels.wheels) {
        const target = path.join(wheelRoot, wheel.file);
        if (!(await exists(target)) || await hash(target) !== wheel.sha256) {
            await run('curl.exe', ['-fsSL', '--retry', '6', '--retry-all-errors', '--connect-timeout', '15',
                '--max-time', '900', '--continue-at', '-', '--output', target, wheel.url]);
        }
        if (await hash(target) !== wheel.sha256) throw new Error(`Official wheel checksum mismatch: ${wheel.file}`);
    }
    const indexArgs = ['--default-index', 'https://pypi.org/simple', '--find-links', wheelRoot];
    if (!(await exists(lock))) throw new Error('Frozen ASR dependency lock missing; do not resolve versions implicitly during release.');
    await run(uv, ['pip', 'sync', lock, '--python', python, '--target', targetDeps, '--require-hashes', ...indexArgs]);
    await run(python, ['-c', 'import torch, torchaudio, transformers, accelerate, numpy; assert torch.version.cuda is None; print("CPU ASR imports ready")'],
        { PYTHONPATH: targetDeps });
    await fs.mkdir(output, { recursive: true });
    await fs.cp(pythonRoot, path.join(output, 'python'), { recursive: true, errorOnExist: true, force: false,
        filter: file => copyFilter(pythonRoot, file) });
    await fs.cp(targetDeps, path.join(output, 'site-packages'), { recursive: true, errorOnExist: true, force: false,
        filter: file => copyFilter(targetDeps, file) });
    const repository = path.join(output, 'asr-cache/models--openai--whisper-small');
    const snapshot = path.join(repository, 'snapshots', revision);
    await fs.mkdir(snapshot, { recursive: true });
    const required = ['config.json', 'generation_config.json', 'preprocessor_config.json', 'tokenizer.json',
        'tokenizer_config.json', 'special_tokens_map.json', 'vocab.json', 'merges.txt', 'normalizer.json',
        'added_tokens.json', 'model.safetensors'];
    for (const name of required) await fs.copyFile(path.join(path.resolve(modelSource), name), path.join(snapshot, name));
    if ((await fs.stat(path.join(snapshot, 'model.safetensors'))).size !== 966995080) throw new Error('Unexpected Whisper Small weight size');
    await fs.mkdir(path.join(repository, 'refs'), { recursive: true });
    await fs.writeFile(path.join(repository, 'refs/main'), revision);
    await fs.copyFile(lock, path.join(output, 'requirements-win-x64.lock'));
    for (const file of ['asr-third-party-notices.md', 'whisper-MIT-LICENSE.txt', 'whisper-Apache-2.0-LICENSE.txt', 'asr-wheels.json']) {
        await fs.copyFile(path.join(root, 'installer', file), path.join(output, file));
    }
    const dependencies = JSON.parse(await run(path.join(output, 'python/python.exe'), ['-c',
        'import json,sys,importlib.metadata as m; print(json.dumps({"python":sys.version.split()[0],"packages":{d.metadata["Name"]:d.version for d in m.distributions()}}))'],
        { PYTHONPATH: path.join(output, 'site-packages') }));
    const manifest = { name: 'ailis-asr-runtime', version: 2, platform: 'win32', arch: 'x64',
        preparedAt: new Date().toISOString(), modelId, modelRevision: revision, device: 'cpu', selfContained: true,
        asrPython: 'python/python.exe', python: 'python/python.exe', pythonPath: ['site-packages'],
        pathAppend: ['python', 'site-packages/torch/lib', 'site-packages/torchaudio/lib'], asrCache: 'asr-cache',
        asrDependenciesReady: true, modelCached: true, dependencies,
        notes: ['Whisper Small only; no CosyVoice, CUDA, pip cache or system Python dependency.',
            'Runtime still requires actual relocated offline recognition acceptance, not just this import probe.'] };
    await fs.writeFile(path.join(output, 'manifest.json'), JSON.stringify(manifest, null, 2));
    const files = await inventory(output);
    const report = { files, totalBytes: files.reduce((n, f) => n + f.bytes, 0) };
    await fs.writeFile(path.join(output, 'files.sha256.json'), JSON.stringify(report, null, 2));
    console.log(JSON.stringify({ prepared: output, files: files.length, bytes: report.totalBytes }));
}
main().catch(error => { console.error(error); process.exitCode = 1; });
