import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const {
    VoiceRuntimeBootstrap,
    DEFAULT_COSYVOICE3_MODEL_DIRNAME,
    DEFAULT_VOICE_PYTHON_VERSION,
    getVenvPythonPath
} = require('../electron/voice-runtime-bootstrap.cjs');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const SOURCE_RUNTIME_ROOT = process.env.AILIS_VOICE_RUNTIME_ROOT
    ? path.resolve(process.env.AILIS_VOICE_RUNTIME_ROOT)
    : path.join(PROJECT_ROOT, 'models', 'voice-runtime');
const MANIFEST_FILENAME = 'voice-runtime-manifest.json';
const INSTALL_TIMEOUT_MS = 30 * 60 * 1000;

function executableName(name) {
    return process.platform === 'win32' ? `${name}.exe` : name;
}

function isFile(filePath) {
    try {
        return Boolean(filePath && fsSync.existsSync(filePath) && fsSync.statSync(filePath).isFile());
    } catch {
        return false;
    }
}

function isDirectory(filePath) {
    try {
        return Boolean(filePath && fsSync.existsSync(filePath) && fsSync.statSync(filePath).isDirectory());
    } catch {
        return false;
    }
}

function normalizeForCompare(filePath) {
    return path.resolve(String(filePath || '')).toLowerCase().replace(/\\/g, '/');
}

function portableRelative(targetPath) {
    if (!targetPath) {
        return '';
    }
    return path.relative(SOURCE_RUNTIME_ROOT, targetPath).replace(/\\/g, '/');
}

function parseArgs(argv = process.argv.slice(2)) {
    return {
        forceRebuild: argv.includes('--force-rebuild'),
        skipRebuild: argv.includes('--skip-rebuild'),
        allowVenvPython: argv.includes('--allow-venv-python')
    };
}

function findFileRecursive(rootDir, predicate, maxEntries = 60000) {
    if (!isDirectory(rootDir)) {
        return '';
    }
    const stack = [rootDir];
    let visited = 0;
    while (stack.length && visited < maxEntries) {
        const current = stack.pop();
        let entries = [];
        try {
            entries = fsSync.readdirSync(current, { withFileTypes: true });
        } catch {
            continue;
        }
        for (const entry of entries) {
            visited += 1;
            const entryPath = path.join(current, entry.name);
            if (entry.isDirectory()) {
                stack.push(entryPath);
                continue;
            }
            if (entry.isFile() && predicate(entryPath, entry.name)) {
                return entryPath;
            }
        }
    }
    return '';
}

function findPrivatePythonExecutable(runtimeRoot) {
    const pythonRoot = path.join(runtimeRoot, 'python');
    const directCandidates = process.platform === 'win32'
        ? [
            path.join(pythonRoot, 'python.exe'),
            path.join(pythonRoot, 'Scripts', 'python.exe')
        ]
        : [
            path.join(pythonRoot, 'bin', 'python3'),
            path.join(pythonRoot, 'bin', 'python')
        ];
    const directCandidate = directCandidates.find((candidate) => isFile(candidate));
    if (directCandidate) {
        return directCandidate;
    }
    const names = process.platform === 'win32'
        ? new Set(['python.exe'])
        : new Set(['python3.12', 'python3', 'python']);
    return findFileRecursive(pythonRoot, (_filePath, name) => names.has(String(name || '').toLowerCase()));
}

function findSitePackagesDir(venvDir) {
    const directCandidates = process.platform === 'win32'
        ? [path.join(venvDir, 'Lib', 'site-packages')]
        : [
            path.join(venvDir, 'lib', 'python3.12', 'site-packages'),
            path.join(venvDir, 'lib', 'python3.11', 'site-packages'),
            path.join(venvDir, 'lib', 'python3.10', 'site-packages')
        ];
    const directCandidate = directCandidates.find((candidate) => isDirectory(candidate));
    if (directCandidate) {
        return directCandidate;
    }
    return '';
}

function buildPathAppendEntries(voiceVenv, sitePackagesDir) {
    return [
        process.platform === 'win32'
            ? path.join(voiceVenv, 'Scripts')
            : path.join(voiceVenv, 'bin'),
        path.join(voiceVenv, 'Library', 'bin'),
        sitePackagesDir ? path.join(sitePackagesDir, 'torch', 'lib') : '',
        sitePackagesDir ? path.join(sitePackagesDir, 'torchaudio', 'lib') : ''
    ].filter((entry) => entry && isDirectory(entry));
}

function readJsonFile(filePath) {
    try {
        if (!isFile(filePath)) {
            return null;
        }
        return JSON.parse(fsSync.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, ''));
    } catch {
        return null;
    }
}

function buildProbeEnv({ sitePackagesDir, pathAppendEntries }) {
    const env = {
        ...process.env,
        PYTHONPATH: [
            sitePackagesDir,
            process.env.PYTHONPATH || ''
        ].filter(Boolean).join(path.delimiter),
        PATH: [
            ...pathAppendEntries,
            process.env.PATH || ''
        ].filter(Boolean).join(path.delimiter)
    };
    if (env.CUDA_VISIBLE_DEVICES === '-1') {
        delete env.CUDA_VISIBLE_DEVICES;
    }
    return env;
}

function probeVoicePython(pythonPath, env) {
    const code = `
import importlib.util, json, sys
mods = ["numpy", "torch", "torchaudio", "transformers", "onnxruntime", "modelscope", "huggingface_hub", "soundfile", "librosa"]
info = {"python": sys.executable, "version": sys.version.split()[0]}
for name in mods:
    info[name] = importlib.util.find_spec(name) is not None
try:
    import torch
    info["torch_version"] = torch.__version__
    info["torch_cuda_available"] = bool(torch.cuda.is_available())
    info["torch_cuda_version"] = str(getattr(torch.version, "cuda", "") or "")
except Exception as exc:
    info["torch_error"] = str(exc)
print(json.dumps(info, ensure_ascii=False))
`;
    const result = spawnSync(pythonPath, ['-c', code], {
        cwd: PROJECT_ROOT,
        env,
        encoding: 'utf8',
        windowsHide: true,
        timeout: 120000
    });
    if (result.error || result.status !== 0) {
        throw new Error([
            'voice runtime Python dependency probe failed',
            result.error?.message || '',
            result.stdout || '',
            result.stderr || ''
        ].filter(Boolean).join('\n'));
    }
    return JSON.parse(String(result.stdout || '{}').trim());
}

function assertRequiredRuntimeFiles(runtimeRoot) {
    const cosyRoot = path.join(runtimeRoot, 'CosyVoice');
    const modelRoot = path.join(cosyRoot, 'pretrained_models', DEFAULT_COSYVOICE3_MODEL_DIRNAME);
    const requiredFiles = [
        path.join(cosyRoot, 'cosyvoice', 'cli', 'cosyvoice.py'),
        path.join(modelRoot, 'cosyvoice3.yaml'),
        path.join(modelRoot, 'llm.pt'),
        path.join(modelRoot, 'flow.pt'),
        path.join(modelRoot, 'hift.pt'),
        path.join(modelRoot, 'campplus.onnx'),
        path.join(modelRoot, 'speech_tokenizer_v3.onnx'),
        path.join(modelRoot, 'CosyVoice-BlankEN', 'model.safetensors')
    ];
    const missing = requiredFiles.filter((filePath) => !isFile(filePath));
    if (missing.length) {
        throw new Error(`CosyVoice3 runtime is incomplete. Missing:\n${missing.join('\n')}`);
    }
}

async function readPyvenvConfig(venvDir) {
    return fs.readFile(path.join(venvDir, 'pyvenv.cfg'), 'utf8').catch(() => '');
}

async function isVenvTiedToRuntimePython(runtimeRoot, venvDir) {
    const cfg = await readPyvenvConfig(venvDir);
    if (!cfg) {
        return false;
    }
    const privatePythonRoot = normalizeForCompare(path.join(runtimeRoot, 'python'));
    const basePaths = cfg.split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => /^(home|executable)\s*=/i.test(line))
        .map((line) => line.replace(/^[^=]+=/, '').trim())
        .filter(Boolean)
        .map(normalizeForCompare);
    return basePaths.some((entry) => entry.startsWith(privatePythonRoot));
}

async function removeBackupIfSafe(backupDir) {
    if (!backupDir || !isDirectory(backupDir)) {
        return;
    }
    const normalizedBackup = normalizeForCompare(backupDir);
    const normalizedRuntime = normalizeForCompare(SOURCE_RUNTIME_ROOT);
    if (!normalizedBackup.startsWith(normalizedRuntime)) {
        throw new Error(`Refusing to remove backup outside voice runtime root: ${backupDir}`);
    }
    await fs.rm(backupDir, { recursive: true, force: true });
}

async function ensurePortablePythonRuntime(args) {
    const bootstrap = new VoiceRuntimeBootstrap({
        projectRoot: PROJECT_ROOT,
        userDataPath: path.join(PROJECT_ROOT, 'state', 'voice-release-user-data'),
        appDataPath: path.join(PROJECT_ROOT, 'state', 'voice-release-app-data'),
        runtimeRoot: SOURCE_RUNTIME_ROOT,
        platform: process.platform
    });
    const paths = bootstrap.getPaths();
    const venvTiedToPrivatePython = await isVenvTiedToRuntimePython(SOURCE_RUNTIME_ROOT, paths.voiceVenv);
    const privatePython = findPrivatePythonExecutable(SOURCE_RUNTIME_ROOT);
    const needsRebuild = args.forceRebuild || !isFile(privatePython) || !venvTiedToPrivatePython;
    if (!needsRebuild) {
        return { rebuilt: false, paths };
    }
    if (args.skipRebuild) {
        if (args.allowVenvPython && isFile(paths.voiceVenvPython)) {
            return { rebuilt: false, paths };
        }
        throw new Error('Voice runtime venv is not tied to bundled Python. Run without --skip-rebuild to prepare a portable release runtime.');
    }

    const backupDir = isDirectory(paths.voiceVenv)
        ? `${paths.voiceVenv}.backup-${Date.now()}`
        : '';
    if (backupDir) {
        console.log(`[AILIS Voice Release] Existing non-portable voice venv detected; moving it to ${backupDir}`);
        await fs.rename(paths.voiceVenv, backupDir);
    }

    try {
        const onOutput = ({ stream, text }) => {
            const target = stream === 'stderr' ? process.stderr : process.stdout;
            target.write(text);
        };
        await bootstrap.installPrivatePython({ paths, onOutput });
        await bootstrap.installVoicePackages({ paths, onOutput });
        try {
            await removeBackupIfSafe(backupDir);
        } catch (cleanupError) {
            console.warn(`[AILIS Voice Release] warning: backup cleanup skipped: ${cleanupError?.message || cleanupError}`);
        }
        return { rebuilt: true, paths };
    } catch (error) {
        if (backupDir && isDirectory(backupDir)) {
            await fs.rm(paths.voiceVenv, { recursive: true, force: true });
            await fs.rename(backupDir, paths.voiceVenv);
        }
        throw error;
    }
}

async function writeReleaseManifest({ paths }) {
    const voiceVenv = path.join(SOURCE_RUNTIME_ROOT, 'voice-venv');
    const privatePython = findPrivatePythonExecutable(SOURCE_RUNTIME_ROOT);
    const venvPython = getVenvPythonPath(voiceVenv, process.platform);
    const voicePython = privatePython || venvPython;
    if (!privatePython && !isFile(venvPython)) {
        throw new Error('No bundled voice Python was found.');
    }
    const sitePackagesDir = findSitePackagesDir(voiceVenv);
    const pathAppendEntries = buildPathAppendEntries(voiceVenv, sitePackagesDir);
    const probeEnv = buildProbeEnv({ sitePackagesDir, pathAppendEntries });
    const dependencies = probeVoicePython(voicePython, probeEnv);
    const missingDependencies = ['torch', 'torchaudio', 'transformers', 'modelscope', 'huggingface_hub']
        .filter((name) => !dependencies[name]);
    if (missingDependencies.length) {
        throw new Error(`Voice runtime dependency probe missing: ${missingDependencies.join(', ')}`);
    }

    const manifestPath = path.join(SOURCE_RUNTIME_ROOT, MANIFEST_FILENAME);
    const previousManifest = readJsonFile(manifestPath) || {};
    const manifest = {
        ...previousManifest,
        schema: 'ailis.voiceRuntimeManifest',
        installerVersion: Number(previousManifest.installerVersion || 2),
        packagedRuntime: true,
        portableRuntime: Boolean(privatePython),
        preparedForReleaseAt: new Date().toISOString(),
        pythonVersion: DEFAULT_VOICE_PYTHON_VERSION,
        runtimeRoot: SOURCE_RUNTIME_ROOT,
        voiceVenv: 'voice-venv',
        voicePython: portableRelative(voicePython),
        python: privatePython ? portableRelative(privatePython) : '',
        pythonPath: sitePackagesDir ? [portableRelative(sitePackagesDir)] : [],
        pathAppend: pathAppendEntries.map(portableRelative),
        cosyVoiceRoot: 'CosyVoice',
        cosyVoice3ModelDir: `CosyVoice/pretrained_models/${DEFAULT_COSYVOICE3_MODEL_DIRNAME}`,
        asrCache: isDirectory(path.join(SOURCE_RUNTIME_ROOT, 'asr-cache')) ? 'asr-cache' : '',
        uv: isFile(path.join(SOURCE_RUNTIME_ROOT, 'uv', executableName('uv')))
            ? `uv/${executableName('uv')}`
            : '',
        dependencies,
        components: previousManifest.components && typeof previousManifest.components === 'object'
            ? previousManifest.components
            : {},
        notes: [
            'Prepared for bundled AILIS release.',
            'Runtime lookup prefers process.resourcesPath/models/voice-runtime in packaged builds.',
            'pip-cache, downloads and uv-cache are intentionally excluded from release artifacts.'
        ]
    };
    await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
    return manifest;
}

async function main() {
    const args = parseArgs();
    assertRequiredRuntimeFiles(SOURCE_RUNTIME_ROOT);
    const prepareResult = await ensurePortablePythonRuntime(args);
    const manifest = await writeReleaseManifest(prepareResult);
    console.log(`[AILIS Voice Release] Prepared voice runtime: ${SOURCE_RUNTIME_ROOT}`);
    console.log(`[AILIS Voice Release] Python: ${manifest.voicePython}`);
    console.log(`[AILIS Voice Release] CUDA available: ${Boolean(manifest.dependencies?.torch_cuda_available)}`);
    console.log('[AILIS Voice Release] Release packaging will exclude pip-cache/downloads/uv-cache.');
}

main().catch((error) => {
    console.error('[AILIS Voice Release] failed');
    console.error(error instanceof Error ? error.stack || error.message : String(error));
    process.exitCode = 1;
});
