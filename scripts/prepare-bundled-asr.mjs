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
const platformKey = `${process.platform}-${process.arch}`;
const platforms = JSON.parse(await fs.readFile(path.join(root, 'installer/asr-platforms.json'), 'utf8'));
const target = platforms[platformKey];
if (!target) throw new Error(`Unsupported native ASR target: ${platformKey}`);
const modelFiles = JSON.parse(await fs.readFile(path.join(root, 'installer/asr-model-files.json'), 'utf8'));
const uv = option('uv') || 'uv';
const revision = '973afd24965f72e36ca33b3055d56a652f456b4d';
const modelId = 'openai/whisper-small';
const pythonVersion = '3.12.10';
const privateRoot = path.join(build, 'managed-python');
const targetDeps = path.join(build, 'site-packages');
const lock = path.join(root, 'installer', target.lock);
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
    if (await exists(output)) throw new Error(`Refusing to overwrite runtime: ${output}`);
    await fs.mkdir(env.TEMP, { recursive: true });
    await run(uv, ['python', 'install', pythonVersion, '--install-dir', privateRoot, '--no-bin', ...(process.platform === 'win32' ? ['--no-registry'] : [])]);
    const installed = (await fs.readdir(privateRoot)).find(n => n.startsWith(`cpython-${pythonVersion}-`));
    if (!installed) throw new Error('Pinned private Python missing');
    const pythonRoot = path.join(privateRoot, installed);
    const python = path.join(pythonRoot, target.python);
    const wheelRoot = path.join(build, 'wheels');
    await fs.mkdir(wheelRoot, { recursive: true });
    const wheels = target.wheelsFile ? JSON.parse(await fs.readFile(path.join(root, 'installer', target.wheelsFile), 'utf8')) : { wheels: target.wheels };
    for (const wheel of wheels.wheels) {
        const target = path.join(wheelRoot, wheel.file);
        if (!(await exists(target)) || await hash(target) !== wheel.sha256) {
            await run(process.platform === 'win32' ? 'curl.exe' : 'curl', ['-fsSL', '--retry', '6', '--retry-all-errors', '--connect-timeout', '15',
                '--max-time', '900', '--continue-at', '-', '--output', target, wheel.url]);
        }
        if (await hash(target) !== wheel.sha256) throw new Error(`Official wheel checksum mismatch: ${wheel.file}`);
    }
    const indexArgs = ['--default-index', 'https://pypi.org/simple', '--find-links', wheelRoot];
    if (!(await exists(lock))) throw new Error('Frozen ASR dependency lock missing; do not resolve versions implicitly during release.');
    await run(uv, ['pip', 'sync', lock, '--python', python, '--target', targetDeps, '--require-hashes', '--no-build', ...indexArgs]);
    await run(python, ['-c', 'import torch, torchaudio, transformers, accelerate, numpy; assert torch.version.cuda is None; print("CPU ASR imports ready")'],
        { PYTHONPATH: targetDeps });
    await fs.mkdir(output, { recursive: true });
    await fs.cp(pythonRoot, path.join(output, 'python'), { recursive: true, dereference: true, errorOnExist: true, force: false,
        filter: file => copyFilter(pythonRoot, file) });
    await fs.cp(targetDeps, path.join(output, 'site-packages'), { recursive: true, dereference: true, errorOnExist: true, force: false,
        filter: file => copyFilter(targetDeps, file) });
    const repository = path.join(output, 'asr-cache/models--openai--whisper-small');
    const snapshot = path.join(repository, 'snapshots', revision);
    await fs.mkdir(snapshot, { recursive: true });
    for (const item of modelFiles.files) {
        const destination = path.join(snapshot, item.path);
        if (modelSource) await fs.copyFile(path.join(path.resolve(modelSource), item.path), destination);
        else await run(process.platform === 'win32' ? 'curl.exe' : 'curl', ['-fsSL', '--retry', '6', '--retry-all-errors',
            '--max-time', '900', '--output', destination, `https://huggingface.co/${modelId}/resolve/${revision}/${item.path}`]);
        if ((await fs.stat(destination)).size !== item.bytes || await hash(destination) !== item.sha256)
            throw new Error(`Frozen Whisper file mismatch: ${item.path}`);
    }
    await fs.mkdir(path.join(repository, 'refs'), { recursive: true });
    await fs.writeFile(path.join(repository, 'refs/main'), revision);
    await fs.copyFile(lock, path.join(output, 'requirements.lock'));
    for (const file of ['asr-third-party-notices.md', 'whisper-MIT-LICENSE.txt', 'whisper-Apache-2.0-LICENSE.txt', 'asr-platforms.json', 'asr-model-files.json']) {
        await fs.copyFile(path.join(root, 'installer', file), path.join(output, file));
    }
    const relativePython = path.posix.join('python', target.python);
    const dependencies = JSON.parse(await run(path.join(output, relativePython), ['-c',
        'import json,sys,importlib.metadata as m; print(json.dumps({"python":sys.version.split()[0],"packages":{d.metadata["Name"]:d.version for d in m.distributions()}}))'],
        { PYTHONPATH: path.join(output, 'site-packages') }));
    const manifest = { name: 'ailis-asr-runtime', version: 2, platform: process.platform, arch: process.arch,
        preparedAt: new Date().toISOString(), modelId, modelRevision: revision, device: 'cpu', selfContained: true,
        asrPython: relativePython, python: relativePython, pythonPath: ['site-packages'],
        pathAppend: [path.posix.dirname(relativePython), 'site-packages/torch/lib', 'site-packages/torchaudio/lib'], asrCache: 'asr-cache',
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
