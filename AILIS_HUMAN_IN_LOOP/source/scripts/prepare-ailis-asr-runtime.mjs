import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import http from 'node:http';
import https from 'node:https';
import path from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const SOURCE_RUNTIME_ROOT = path.join(PROJECT_ROOT, '.ailis-runtime');
const SOURCE_ASR_RUNTIME_DIR = path.join(SOURCE_RUNTIME_ROOT, 'asr-runtime');
const SOURCE_ASR_VENV = path.join(SOURCE_ASR_RUNTIME_DIR, 'asr-venv');
const SOURCE_ASR_CACHE = path.join(SOURCE_ASR_RUNTIME_DIR, 'asr-cache');
const SOURCE_PRIVATE_PYTHON_DIR = path.join(SOURCE_RUNTIME_ROOT, 'python');
const SOURCE_UV_DIR = path.join(SOURCE_RUNTIME_ROOT, 'uv');
const SOURCE_DOWNLOADS_DIR = path.join(SOURCE_RUNTIME_ROOT, 'downloads');
const SOURCE_UV_CACHE_DIR = path.join(SOURCE_RUNTIME_ROOT, 'uv-cache');
const OUTPUT_RUNTIME_DIR = process.env.AILIS_ASR_RUNTIME_OUTPUT_DIR
    ? path.resolve(process.env.AILIS_ASR_RUNTIME_OUTPUT_DIR)
    : path.join(PROJECT_ROOT, 'build-cache', 'ailis-asr-runtime');
const DEFAULT_PYTHON_VERSION = '3.12';
const DEFAULT_MODEL_ID = 'openai/whisper-small';
const INSTALL_TIMEOUT_MS = 45 * 60 * 1000;
const TORCH_CPU_INDEX_URL = 'https://download.pytorch.org/whl/cpu';

const ASR_BASE_PACKAGES = Object.freeze([
    'numpy>=1.26,<3.0',
    'transformers>=4.52,<6.0',
    'accelerate>=1.0,<2.0',
    'huggingface_hub>=0.24',
    'soundfile>=0.12',
    'librosa>=0.10'
]);

const SENSEVOICE_PACKAGES = Object.freeze([
    'funasr>=1.1.2',
    'modelscope>=1.20'
]);

function executableName(name) {
    return process.platform === 'win32' ? `${name}.exe` : name;
}

function venvPythonPath(venvDir) {
    return process.platform === 'win32'
        ? path.join(venvDir, 'Scripts', 'python.exe')
        : path.join(venvDir, 'bin', 'python');
}

function portableRelative(targetPath) {
    if (!targetPath) {
        return '';
    }
    return path.relative(OUTPUT_RUNTIME_DIR, targetPath).replace(/\\/g, '/');
}

function findDirectoryRecursiveSync(rootDir, predicate) {
    const stack = [rootDir];
    while (stack.length) {
        const current = stack.pop();
        let entries = [];
        try {
            entries = fsSync.readdirSync(current, { withFileTypes: true });
        } catch {
            continue;
        }
        for (const entry of entries) {
            if (!entry.isDirectory()) {
                continue;
            }
            const entryPath = path.join(current, entry.name);
            if (predicate(entryPath, entry.name)) {
                return entryPath;
            }
            stack.push(entryPath);
        }
    }
    return '';
}

function findPrivatePythonExecutable(rootDir) {
    const pythonRoot = path.join(rootDir, 'python');
    if (!fsSync.existsSync(pythonRoot)) {
        return '';
    }
    const directCandidates = process.platform === 'win32'
        ? [
            path.join(pythonRoot, 'python.exe'),
            path.join(pythonRoot, 'Scripts', 'python.exe')
        ]
        : [
            path.join(pythonRoot, 'bin', 'python3'),
            path.join(pythonRoot, 'bin', 'python')
        ];
    const directCandidate = directCandidates.find((candidate) => fsSync.existsSync(candidate));
    if (directCandidate) {
        return directCandidate;
    }
    const stack = [pythonRoot];
    const names = process.platform === 'win32'
        ? new Set(['python.exe'])
        : new Set(['python3.12', 'python3', 'python']);
    while (stack.length) {
        const current = stack.pop();
        let entries = [];
        try {
            entries = fsSync.readdirSync(current, { withFileTypes: true });
        } catch {
            continue;
        }
        for (const entry of entries) {
            const entryPath = path.join(current, entry.name);
            if (entry.isDirectory()) {
                stack.push(entryPath);
                continue;
            }
            if (entry.isFile() && names.has(entry.name.toLowerCase())) {
                return entryPath;
            }
        }
    }
    return '';
}

function findSitePackagesDir(venvDir) {
    const directCandidates = process.platform === 'win32'
        ? [path.join(venvDir, 'Lib', 'site-packages')]
        : [
            path.join(venvDir, 'lib', `python${process.versions.python?.slice(0, 3) || DEFAULT_PYTHON_VERSION}`, 'site-packages')
        ];
    const directCandidate = directCandidates.find((candidate) => fsSync.existsSync(candidate));
    if (directCandidate) {
        return directCandidate;
    }
    return findDirectoryRecursiveSync(venvDir, (_entryPath, name) => name === 'site-packages');
}

function buildPathAppendEntries(venvDir, sitePackagesDir) {
    const entries = [
        process.platform === 'win32'
            ? path.join(venvDir, 'Scripts')
            : path.join(venvDir, 'bin')
    ];
    for (const packageDirName of ['torch', 'torchaudio']) {
        const packageLibDir = sitePackagesDir
            ? path.join(sitePackagesDir, packageDirName, 'lib')
            : '';
        if (packageLibDir && fsSync.existsSync(packageLibDir)) {
            entries.push(packageLibDir);
        }
    }
    return entries.filter((entry) => entry && fsSync.existsSync(entry));
}

function buildProbeEnv(pythonPathEntries = [], pathEntries = []) {
    return {
        PYTHONPATH: [
            ...pythonPathEntries,
            process.env.PYTHONPATH || ''
        ].filter(Boolean).join(path.delimiter),
        PATH: [
            ...pathEntries,
            process.env.PATH || ''
        ].filter(Boolean).join(path.delimiter)
    };
}

function parseArgs(argv = process.argv.slice(2)) {
    const args = {
        forceRebuild: false,
        skipInstall: false,
        skipModel: false,
        includeSenseVoice: false,
        pythonVersion: DEFAULT_PYTHON_VERSION,
        modelId: DEFAULT_MODEL_ID,
        torchIndex: 'cpu',
        hfEndpoint: ''
    };
    for (const token of argv) {
        if (token === '--force-rebuild') args.forceRebuild = true;
        if (token === '--skip-install') args.skipInstall = true;
        if (token === '--skip-model') args.skipModel = true;
        if (token === '--include-sensevoice') args.includeSenseVoice = true;
        if (token.startsWith('--python-version=')) {
            args.pythonVersion = token.slice('--python-version='.length).trim() || DEFAULT_PYTHON_VERSION;
        }
        if (token.startsWith('--model-id=')) {
            args.modelId = token.slice('--model-id='.length).trim() || DEFAULT_MODEL_ID;
        }
        if (token.startsWith('--torch-index=')) {
            args.torchIndex = token.slice('--torch-index='.length).trim() || 'cpu';
        }
        if (token.startsWith('--hf-endpoint=')) {
            args.hfEndpoint = token.slice('--hf-endpoint='.length).trim();
        }
    }
    return args;
}

function runProcess(command, args = [], options = {}) {
    return new Promise((resolve, reject) => {
        let settled = false;
        const child = spawn(command, args, {
            cwd: options.cwd || PROJECT_ROOT,
            stdio: 'inherit',
            windowsHide: true,
            env: {
                ...process.env,
                ...(options.env || {})
            }
        });
        const timeout = setTimeout(() => {
            if (settled) {
                return;
            }
            settled = true;
            try {
                child.kill();
            } catch {
                // Ignore cleanup failures.
            }
            reject(new Error(`${command} ${args.join(' ')} timed out after ${options.timeoutMs || INSTALL_TIMEOUT_MS}ms`));
        }, options.timeoutMs || INSTALL_TIMEOUT_MS);
        child.on('error', (error) => {
            if (settled) {
                return;
            }
            settled = true;
            clearTimeout(timeout);
            reject(error);
        });
        child.on('close', (code) => {
            if (settled) {
                return;
            }
            settled = true;
            clearTimeout(timeout);
            if (code === 0) {
                resolve();
                return;
            }
            reject(new Error(`${command} ${args.join(' ')} exited with ${code}`));
        });
    });
}

function runProcessCapture(command, args = [], options = {}) {
    const result = spawnSync(command, args, {
        cwd: options.cwd || PROJECT_ROOT,
        windowsHide: true,
        timeout: options.timeoutMs || 12000,
        encoding: 'utf8',
        env: {
            ...process.env,
            ...(options.env || {})
        }
    });
    return {
        ok: !result.error && result.status === 0,
        stdout: String(result.stdout || '').trim(),
        stderr: String(result.stderr || '').trim()
    };
}

function getUvAsset() {
    const arch = process.arch === 'arm64' ? 'aarch64' : 'x86_64';
    if (process.platform === 'win32') {
        return {
            url: `https://github.com/astral-sh/uv/releases/latest/download/uv-${arch}-pc-windows-msvc.zip`,
            archiveName: 'uv.zip',
            binaryName: 'uv.exe',
            archiveType: 'zip'
        };
    }
    if (process.platform === 'darwin') {
        return {
            url: `https://github.com/astral-sh/uv/releases/latest/download/uv-${arch}-apple-darwin.tar.gz`,
            archiveName: 'uv.tar.gz',
            binaryName: 'uv',
            archiveType: 'tar.gz'
        };
    }
    if (process.platform === 'linux') {
        return {
            url: `https://github.com/astral-sh/uv/releases/latest/download/uv-${arch}-unknown-linux-gnu.tar.gz`,
            archiveName: 'uv.tar.gz',
            binaryName: 'uv',
            archiveType: 'tar.gz'
        };
    }
    return null;
}

async function downloadFile(url, targetPath) {
    const maxRedirects = 5;
    const requestOnce = (currentUrl, redirectsRemaining) => new Promise((resolve, reject) => {
        const parsed = new URL(currentUrl);
        const client = parsed.protocol === 'http:' ? http : https;
        const request = client.get(parsed, {
            headers: { 'User-Agent': 'AILIS-asr-runtime-prepare/1.0' },
            timeout: INSTALL_TIMEOUT_MS
        }, (response) => {
            if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location && redirectsRemaining > 0) {
                response.resume();
                resolve(requestOnce(new URL(response.headers.location, parsed).toString(), redirectsRemaining - 1));
                return;
            }
            if (response.statusCode < 200 || response.statusCode >= 300) {
                response.resume();
                reject(new Error(`download_failed_http_${response.statusCode}`));
                return;
            }
            const output = fsSync.createWriteStream(targetPath);
            response.pipe(output);
            output.on('finish', () => output.close(resolve));
            output.on('error', reject);
        });
        request.on('timeout', () => request.destroy(new Error(`download_timeout_${INSTALL_TIMEOUT_MS}ms`)));
        request.on('error', reject);
    });
    await requestOnce(url, maxRedirects);
}

async function extractArchive(archivePath, targetDir, archiveType) {
    await fs.rm(targetDir, { recursive: true, force: true });
    await fs.mkdir(targetDir, { recursive: true });
    if (archiveType === 'zip' && process.platform === 'win32') {
        await runProcess('powershell.exe', [
            '-NoProfile',
            '-ExecutionPolicy',
            'Bypass',
            '-Command',
            'Expand-Archive -LiteralPath $args[0] -DestinationPath $args[1] -Force',
            archivePath,
            targetDir
        ]);
        return;
    }
    if (archiveType === 'zip') {
        await runProcess('unzip', ['-q', archivePath, '-d', targetDir]);
        return;
    }
    await runProcess('tar', ['-xzf', archivePath, '-C', targetDir]);
}

async function findFileRecursive(rootDir, predicate) {
    const stack = [rootDir];
    while (stack.length) {
        const current = stack.pop();
        let entries = [];
        try {
            entries = await fs.readdir(current, { withFileTypes: true });
        } catch {
            continue;
        }
        for (const entry of entries) {
            const entryPath = path.join(current, entry.name);
            if (entry.isDirectory()) {
                stack.push(entryPath);
                continue;
            }
            if (entry.isFile() && predicate(entryPath)) {
                return entryPath;
            }
        }
    }
    return '';
}

async function ensureUv(args) {
    const uvBin = path.join(SOURCE_UV_DIR, executableName('uv'));
    if (fsSync.existsSync(uvBin)) {
        return uvBin;
    }
    await fs.mkdir(SOURCE_UV_DIR, { recursive: true });

    const systemUv = runProcessCapture('uv', ['--version']);
    if (systemUv.ok) {
        const locator = process.platform === 'win32'
            ? runProcessCapture('where.exe', ['uv'])
            : runProcessCapture('which', ['uv']);
        const sourceUv = locator.stdout.split(/\r?\n/).map((item) => item.trim()).find(Boolean);
        if (sourceUv && fsSync.existsSync(sourceUv)) {
            await fs.copyFile(sourceUv, uvBin);
            if (process.platform !== 'win32') {
                await fs.chmod(uvBin, 0o755).catch(() => {});
            }
            return uvBin;
        }
        return 'uv';
    }

    if (args.skipInstall) {
        throw new Error('uv is missing and --skip-install was provided.');
    }
    const asset = getUvAsset();
    if (!asset) {
        throw new Error(`Unsupported platform for automatic uv bootstrap: ${process.platform}/${process.arch}`);
    }
    await fs.mkdir(SOURCE_DOWNLOADS_DIR, { recursive: true });
    const archivePath = path.join(SOURCE_DOWNLOADS_DIR, asset.archiveName);
    console.log(`[AILIS ASR Runtime] Downloading uv: ${asset.url}`);
    await downloadFile(asset.url, archivePath);
    const extractDir = path.join(SOURCE_DOWNLOADS_DIR, `uv-asr-extract-${Date.now()}`);
    await extractArchive(archivePath, extractDir, asset.archiveType);
    const extractedUv = await findFileRecursive(extractDir, (filePath) =>
        path.basename(filePath).toLowerCase() === asset.binaryName.toLowerCase()
    );
    if (!extractedUv) {
        throw new Error('uv archive extracted, but uv executable was not found.');
    }
    await fs.copyFile(extractedUv, uvBin);
    if (process.platform !== 'win32') {
        await fs.chmod(uvBin, 0o755).catch(() => {});
    }
    await fs.rm(extractDir, { recursive: true, force: true });
    return uvBin;
}

function hasAsrModel(cacheDir) {
    const dirs = [
        cacheDir,
        path.join(cacheDir, 'hub'),
        path.join(cacheDir, 'transformers')
    ];
    return dirs.some((dir) => {
        try {
            return fsSync.readdirSync(dir, { withFileTypes: true })
                .some((entry) => entry.isDirectory() && /^models--/i.test(entry.name));
        } catch {
            return false;
        }
    });
}

function probeDependencies(python, env = {}) {
    const code = `
import importlib.util, json, sys
mods = ["numpy", "torch", "torchaudio", "transformers", "accelerate", "huggingface_hub", "soundfile", "librosa", "funasr", "modelscope"]
info = {"python": sys.executable}
for name in mods:
    info[name] = importlib.util.find_spec(name) is not None
print(json.dumps(info, ensure_ascii=False))
`;
    const result = runProcessCapture(python, ['-c', code], { timeoutMs: 30000, env });
    if (!result.ok) {
        return {};
    }
    try {
        return JSON.parse(result.stdout);
    } catch {
        return {};
    }
}

async function rebuildSourceRuntime(args, uv) {
    const env = {
        UV_CACHE_DIR: SOURCE_UV_CACHE_DIR,
        UV_PYTHON_INSTALL_DIR: SOURCE_PRIVATE_PYTHON_DIR,
        UV_LINK_MODE: 'copy'
    };
    await fs.mkdir(SOURCE_ASR_RUNTIME_DIR, { recursive: true });
    await fs.mkdir(SOURCE_PRIVATE_PYTHON_DIR, { recursive: true });

    console.log(`[AILIS ASR Runtime] Installing private Python ${args.pythonVersion} via uv`);
    await runProcess(uv, [
        'python',
        'install',
        '--install-dir',
        SOURCE_PRIVATE_PYTHON_DIR,
        args.pythonVersion
    ], { env });

    console.log('[AILIS ASR Runtime] Rebuilding ASR venv');
    await fs.rm(SOURCE_ASR_VENV, { recursive: true, force: true });
    await runProcess(uv, [
        'venv',
        SOURCE_ASR_VENV,
        '--python',
        args.pythonVersion,
        '--managed-python',
        '--seed'
    ], { env });

    const python = venvPythonPath(SOURCE_ASR_VENV);
    if (!fsSync.existsSync(python)) {
        throw new Error(`ASR venv Python not found after rebuild: ${python}`);
    }
    await runProcess(python, ['-m', 'pip', 'install', '--upgrade', 'pip', 'setuptools', 'wheel']);

    if (args.torchIndex === 'cpu') {
        await runProcess(python, [
            '-m',
            'pip',
            'install',
            '--upgrade',
            '--index-url',
            TORCH_CPU_INDEX_URL,
            'torch>=2.6,<3.0',
            'torchaudio>=2.6,<3.0'
        ]);
    } else {
        await runProcess(python, ['-m', 'pip', 'install', '--upgrade', 'torch>=2.6,<3.0', 'torchaudio>=2.6,<3.0']);
    }

    await runProcess(python, ['-m', 'pip', 'install', '--upgrade', ...ASR_BASE_PACKAGES]);
    if (args.includeSenseVoice) {
        await runProcess(python, ['-m', 'pip', 'install', '--upgrade', ...SENSEVOICE_PACKAGES]);
    }
    await runProcess(python, ['-c', 'import numpy, torch, transformers; print("asr runtime import ok")'], {
        timeoutMs: 60000
    });
}

async function ensureSourceRuntime(args) {
    const sourcePython = venvPythonPath(SOURCE_ASR_VENV);
    if (args.skipInstall) {
        if (!fsSync.existsSync(sourcePython)) {
            throw new Error(`ASR source runtime is missing: ${sourcePython}`);
        }
        return;
    }
    const uv = await ensureUv(args);
    if (!fsSync.existsSync(sourcePython) || args.forceRebuild) {
        await rebuildSourceRuntime(args, uv);
    }
}

async function ensureModelCache(args) {
    if (args.skipModel) {
        return;
    }
    const python = venvPythonPath(SOURCE_ASR_VENV);
    await fs.mkdir(SOURCE_ASR_CACHE, { recursive: true });
    const code = [
        'import os',
        'from huggingface_hub import snapshot_download',
        args.hfEndpoint ? `os.environ["HF_ENDPOINT"] = ${JSON.stringify(args.hfEndpoint)}` : '',
        `snapshot_download(${JSON.stringify(args.modelId)}, cache_dir=${JSON.stringify(SOURCE_ASR_CACHE)}, resume_download=True)`
    ].filter(Boolean).join('\n');
    await runProcess(python, ['-c', code], {
        env: {
            HF_HUB_DISABLE_SYMLINKS_WARNING: '1',
            ...(args.hfEndpoint ? { HF_ENDPOINT: args.hfEndpoint } : {})
        }
    });
}

async function copyRuntime(args) {
    await fs.rm(OUTPUT_RUNTIME_DIR, { recursive: true, force: true });
    await fs.mkdir(OUTPUT_RUNTIME_DIR, { recursive: true });
    await fs.cp(SOURCE_ASR_VENV, path.join(OUTPUT_RUNTIME_DIR, 'asr-venv'), {
        recursive: true,
        force: true,
        dereference: true
    });

    if (fsSync.existsSync(SOURCE_PRIVATE_PYTHON_DIR)) {
        await fs.cp(SOURCE_PRIVATE_PYTHON_DIR, path.join(OUTPUT_RUNTIME_DIR, 'python'), {
            recursive: true,
            force: true,
            dereference: true
        });
    }

    const uvSource = path.join(SOURCE_UV_DIR, executableName('uv'));
    if (fsSync.existsSync(uvSource)) {
        const uvOutputDir = path.join(OUTPUT_RUNTIME_DIR, 'uv');
        await fs.mkdir(uvOutputDir, { recursive: true });
        await fs.copyFile(uvSource, path.join(uvOutputDir, executableName('uv')));
    }

    if (fsSync.existsSync(SOURCE_ASR_CACHE)) {
        await fs.cp(SOURCE_ASR_CACHE, path.join(OUTPUT_RUNTIME_DIR, 'asr-cache'), {
            recursive: true,
            force: true,
            dereference: true
        });
    }

    const outputVenv = path.join(OUTPUT_RUNTIME_DIR, 'asr-venv');
    const outputVenvPython = venvPythonPath(outputVenv);
    const outputPrivatePython = findPrivatePythonExecutable(OUTPUT_RUNTIME_DIR);
    const outputSitePackages = findSitePackagesDir(outputVenv);
    const outputPathAppend = buildPathAppendEntries(outputVenv, outputSitePackages);
    const outputPython = outputPrivatePython || outputVenvPython;
    const pythonPathEntries = outputPrivatePython && outputSitePackages
        ? [outputSitePackages]
        : [];
    const probeEnv = outputPrivatePython
        ? buildProbeEnv(pythonPathEntries, outputPathAppend)
        : {};
    const dependencies = probeDependencies(outputPython, probeEnv);
    if (!dependencies.numpy || !dependencies.torch || !dependencies.transformers) {
        throw new Error([
            'Packaged ASR runtime dependency probe failed.',
            `python=${outputPython}`,
            `numpy=${Boolean(dependencies.numpy)}`,
            `torch=${Boolean(dependencies.torch)}`,
            `transformers=${Boolean(dependencies.transformers)}`
        ].join(' '));
    }
    const manifest = {
        name: 'ailis-asr-runtime',
        version: 1,
        preparedAt: new Date().toISOString(),
        modelId: args.modelId,
        asrVenv: 'asr-venv',
        asrPython: portableRelative(outputPython),
        asrCache: 'asr-cache',
        python: portableRelative(outputPrivatePython),
        pythonPath: pythonPathEntries.map(portableRelative),
        pathAppend: outputPathAppend.map(portableRelative),
        uv: fsSync.existsSync(path.join(OUTPUT_RUNTIME_DIR, 'uv', executableName('uv')))
            ? `uv/${executableName('uv')}`
            : '',
        dependencies,
        asrDependenciesReady: Boolean(dependencies.numpy && dependencies.torch && dependencies.transformers),
        modelCached: hasAsrModel(path.join(OUTPUT_RUNTIME_DIR, 'asr-cache')),
        notes: [
            'Packaged as an application-private runtime for local ASR.',
            'DesktopASRManager prefers this runtime before user/system Python.',
            'This runtime is intentionally separate from Crawl4AI so web extraction does not need torch.'
        ]
    };
    await fs.writeFile(path.join(OUTPUT_RUNTIME_DIR, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
}

async function main() {
    const args = parseArgs();
    await ensureSourceRuntime(args);
    await ensureModelCache(args);
    await copyRuntime(args);
    console.log(`[AILIS ASR Runtime] Prepared ${OUTPUT_RUNTIME_DIR}`);
    console.log(`[AILIS ASR Runtime] ASR Python: ${findPrivatePythonExecutable(OUTPUT_RUNTIME_DIR) || venvPythonPath(path.join(OUTPUT_RUNTIME_DIR, 'asr-venv'))}`);
    console.log(`[AILIS ASR Runtime] Model cache: ${path.join(OUTPUT_RUNTIME_DIR, 'asr-cache')}`);
}

main().catch((error) => {
    console.error('[AILIS ASR Runtime] failed');
    console.error(error instanceof Error ? error.stack || error.message : String(error));
    process.exitCode = 1;
});
