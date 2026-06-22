const fs = require('fs');
const fsp = require('fs/promises');
const http = require('http');
const https = require('https');
const os = require('os');
const path = require('path');
const { spawn, spawnSync } = require('child_process');

const DEFAULT_ASR_MODEL_ID = 'openai/whisper-small';
const DEFAULT_COSYVOICE3_MODEL_DIRNAME = 'Fun-CosyVoice3-0.5B';
const DEFAULT_COSYVOICE3_MODEL_REPO = 'FunAudioLLM/Fun-CosyVoice3-0.5B-2512';
const DEFAULT_COSYVOICE_GIT_URL = 'https://github.com/FunAudioLLM/CosyVoice.git';
const DEFAULT_MATCHA_GIT_URL = 'https://github.com/shivammehta25/Matcha-TTS.git';
const DEFAULT_VOICE_PYTHON_VERSION = '3.12';
const DEFAULT_TIMEOUT_MS = 12000;
const INSTALL_TIMEOUT_MS = 30 * 60 * 1000;
const MAX_CAPTURE_CHARS = 24000;
const PACKAGED_ASR_RUNTIME_DIRNAME = 'ailis-asr-runtime';
const SPEECH_MODEL_DIRNAME = 'speech-models';

const BASE_VOICE_PACKAGES = Object.freeze([
    'numpy>=1.26,<3.0',
    'torch>=2.6,<3.0',
    'torchaudio>=2.6,<3.0',
    'transformers>=4.52,<6.0',
    'accelerate>=1.0,<2.0',
    'huggingface_hub>=0.24',
    'modelscope>=1.20',
    'onnxruntime>=1.18',
    'soundfile>=0.12',
    'librosa>=0.10',
    'HyperPyYAML>=1.2',
    'hydra-core>=1.3',
    'omegaconf>=2.3',
    'inflect>=7',
    'conformer==0.3.2',
    'diffusers>=0.29',
    'openai-whisper>=20231117',
    'rich>=13.7',
    'wget>=3.2'
]);

function normalizeString(value) {
    return String(value || '').trim();
}

function pathExists(filePath) {
    try {
        return Boolean(filePath && fs.existsSync(filePath));
    } catch {
        return false;
    }
}

function safeStat(filePath) {
    try {
        return fs.statSync(filePath);
    } catch {
        return null;
    }
}

function isDirectory(filePath) {
    const stat = safeStat(filePath);
    return Boolean(stat?.isDirectory());
}

function isFile(filePath) {
    const stat = safeStat(filePath);
    return Boolean(stat?.isFile());
}

function readJsonFile(filePath) {
    try {
        if (!isFile(filePath)) {
            return null;
        }
        return JSON.parse(fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, ''));
    } catch {
        return null;
    }
}

function normalizeRelativePath(rootDir, relativePath) {
    const rawPath = normalizeString(relativePath);
    if (!rawPath) {
        return '';
    }
    return path.isAbsolute(rawPath)
        ? rawPath
        : path.join(rootDir, rawPath);
}

function normalizeManifestPathList(rootDir, value) {
    const values = Array.isArray(value)
        ? value
        : normalizeString(value)
            ? String(value).split(path.delimiter)
            : [];
    return values
        .map((item) => normalizeRelativePath(rootDir, item))
        .filter(Boolean);
}

function buildRuntimeEnv(runtimeRoot, manifest = {}) {
    const pythonPathEntries = normalizeManifestPathList(runtimeRoot, manifest.pythonPath);
    const pathEntries = normalizeManifestPathList(runtimeRoot, manifest.pathAppend);
    const env = {};
    if (pythonPathEntries.length) {
        env.PYTHONPATH = [
            ...pythonPathEntries,
            process.env.PYTHONPATH || ''
        ].filter(Boolean).join(path.delimiter);
    }
    if (pathEntries.length) {
        env.PATH = [
            ...pathEntries,
            process.env.PATH || ''
        ].filter(Boolean).join(path.delimiter);
    }
    return env;
}

function formatBytes(bytes) {
    const value = Number(bytes);
    if (!Number.isFinite(value) || value < 0) {
        return '';
    }
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = value;
    let index = 0;
    while (size >= 1024 && index < units.length - 1) {
        size /= 1024;
        index += 1;
    }
    return `${size.toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}

function directorySizeBytes(rootPath, { maxFiles = 20000 } = {}) {
    if (!isDirectory(rootPath)) {
        return 0;
    }
    let total = 0;
    let visited = 0;
    const stack = [rootPath];
    while (stack.length && visited < maxFiles) {
        const current = stack.pop();
        let entries = [];
        try {
            entries = fs.readdirSync(current, { withFileTypes: true });
        } catch {
            continue;
        }
        for (const entry of entries) {
            const entryPath = path.join(current, entry.name);
            if (entry.isDirectory()) {
                stack.push(entryPath);
                continue;
            }
            if (!entry.isFile()) {
                continue;
            }
            visited += 1;
            const stat = safeStat(entryPath);
            total += Number(stat?.size || 0);
            if (visited >= maxFiles) {
                break;
            }
        }
    }
    return total;
}

function trimCapture(value) {
    const text = String(value || '');
    if (text.length <= MAX_CAPTURE_CHARS) {
        return text;
    }
    return text.slice(text.length - MAX_CAPTURE_CHARS);
}

function runCommand(command, args = [], options = {}) {
    try {
        const result = spawnSync(command, args, {
            cwd: options.cwd,
            windowsHide: true,
            timeout: options.timeoutMs || DEFAULT_TIMEOUT_MS,
            encoding: 'utf8',
            env: {
                ...process.env,
                ...(options.env || {})
            }
        });
        return {
            ok: !result.error && result.status === 0,
            command,
            args,
            status: result.status,
            error: result.error?.message || '',
            stdout: normalizeString(result.stdout),
            stderr: normalizeString(result.stderr)
        };
    } catch (error) {
        return {
            ok: false,
            command,
            args,
            status: null,
            error: error?.message || String(error),
            stdout: '',
            stderr: ''
        };
    }
}

function runCommandAsync(command, args = [], options = {}) {
    return new Promise((resolve) => {
        const startedAt = Date.now();
        let stdout = '';
        let stderr = '';
        let settled = false;
        let timedOut = false;
        let child = null;

        const appendOutput = (streamName, chunk) => {
            const text = String(chunk || '');
            if (streamName === 'stdout') {
                stdout = trimCapture(stdout + text);
            } else {
                stderr = trimCapture(stderr + text);
            }
            options.onOutput?.({
                stream: streamName,
                text,
                command,
                args
            });
        };

        const finish = (payload) => {
            if (settled) {
                return;
            }
            settled = true;
            clearTimeout(timeoutId);
            resolve({
                command,
                args,
                cwd: options.cwd || '',
                durationMs: Date.now() - startedAt,
                stdout: normalizeString(stdout),
                stderr: normalizeString(stderr),
                ...payload
            });
        };

        const timeoutId = setTimeout(() => {
            timedOut = true;
            try {
                child?.kill?.();
            } catch {
                // Ignore cleanup failures.
            }
            finish({
                ok: false,
                status: null,
                error: `command_timeout_${options.timeoutMs || INSTALL_TIMEOUT_MS}ms`,
                timedOut
            });
        }, options.timeoutMs || INSTALL_TIMEOUT_MS);

        try {
            child = spawn(command, args, {
                cwd: options.cwd,
                windowsHide: true,
                stdio: ['ignore', 'pipe', 'pipe'],
                env: {
                    ...process.env,
                    ...(options.env || {})
                }
            });
        } catch (error) {
            finish({
                ok: false,
                status: null,
                error: error?.message || String(error),
                timedOut
            });
            return;
        }

        child.stdout?.setEncoding?.('utf8');
        child.stderr?.setEncoding?.('utf8');
        child.stdout?.on('data', (chunk) => appendOutput('stdout', chunk));
        child.stderr?.on('data', (chunk) => appendOutput('stderr', chunk));
        child.on('error', (error) => {
            finish({
                ok: false,
                status: null,
                error: error?.message || String(error),
                timedOut
            });
        });
        child.on('exit', (status, signal) => {
            finish({
                ok: !timedOut && status === 0,
                status,
                signal: signal || '',
                error: timedOut
                    ? `command_timeout_${options.timeoutMs || INSTALL_TIMEOUT_MS}ms`
                    : ''
            });
        });
    });
}

function inspectPython(command, args = [], env = {}) {
    const version = runCommand(command, [...args, '--version'], { env });
    if (!version.ok) {
        return {
            ok: false,
            command,
            args,
            error: version.error || version.stderr || version.stdout || 'python_not_found'
        };
    }

    const probe = `
import importlib.util, json, sys
info = {"python": sys.executable, "version": sys.version.split()[0]}
for name in ["pip", "numpy", "torch", "torchaudio", "transformers", "onnxruntime", "vllm", "tensorrt", "modelscope", "huggingface_hub", "funasr"]:
    info["has_" + name] = importlib.util.find_spec(name) is not None
try:
    import torch
    info["torch_version"] = torch.__version__
    info["torch_cuda_available"] = bool(torch.cuda.is_available())
    info["torch_cuda_version"] = str(getattr(torch.version, "cuda", "") or "")
    info["cuda_device_count"] = int(torch.cuda.device_count()) if torch.cuda.is_available() else 0
    info["cuda_devices"] = [torch.cuda.get_device_name(i) for i in range(torch.cuda.device_count())] if torch.cuda.is_available() else []
except Exception as exc:
    info["torch_error"] = str(exc)
try:
    import onnxruntime as ort
    info["onnxruntime_version"] = ort.__version__
    info["onnxruntime_providers"] = list(ort.get_available_providers())
except Exception as exc:
    info["onnxruntime_error"] = str(exc)
print(json.dumps(info, ensure_ascii=False))
`;
    const probeResult = runCommand(command, [...args, '-c', probe], { timeoutMs: 20000, env });
    let details = {};
    if (probeResult.ok && probeResult.stdout) {
        try {
            details = JSON.parse(probeResult.stdout);
        } catch {
            details = {
                parseError: probeResult.stdout.slice(0, 400)
            };
        }
    }

    return {
        ok: true,
        command,
        args,
        version: version.stdout || version.stderr,
        details,
        probeOk: probeResult.ok,
        probeError: probeResult.ok ? '' : (probeResult.error || probeResult.stderr || probeResult.stdout)
    };
}

function uniquePythonCandidates(candidates) {
    const seen = new Set();
    return candidates.filter((candidate) => {
        const key = [
            candidate.command,
            ...(candidate.args || []),
            candidate.env?.PYTHONPATH || '',
            candidate.env?.PATH || ''
        ].join('\u0000');
        if (!candidate.command || seen.has(key)) {
            return false;
        }
        seen.add(key);
        return true;
    });
}

function hasAsrModel(cacheDir) {
    try {
        if (!isDirectory(cacheDir)) {
            return false;
        }
        const candidateDirs = [
            cacheDir,
            path.join(cacheDir, 'hub'),
            path.join(cacheDir, 'transformers')
        ];
        return candidateDirs.some((candidateDir) => {
            if (!isDirectory(candidateDir)) {
                return false;
            }
            return fs.readdirSync(candidateDir, { withFileTypes: true })
                .some((entry) => entry.isDirectory() && /^models--/i.test(entry.name));
        });
    } catch {
        return false;
    }
}

function buildStep({
    id,
    title,
    reason,
    category,
    automatic = false,
    requiresNetwork = false,
    requiresApproval = true,
    mutatesSystem = false,
    estimatedSize = '',
    command = null,
    notes = []
}) {
    return {
        id,
        title,
        reason,
        category,
        automatic,
        requiresNetwork,
        requiresApproval,
        mutatesSystem,
        estimatedSize,
        command,
        notes
    };
}

function getExecutableName(baseName, platform = process.platform) {
    return platform === 'win32' ? `${baseName}.exe` : baseName;
}

function getVenvPythonPath(venvDir, platform = process.platform) {
    return platform === 'win32'
        ? path.join(venvDir, 'Scripts', 'python.exe')
        : path.join(venvDir, 'bin', 'python');
}

function getUvAsset(platform = process.platform, arch = process.arch) {
    const normalizedArch = arch === 'arm64' ? 'aarch64' : 'x86_64';
    if (platform === 'win32') {
        return {
            url: `https://github.com/astral-sh/uv/releases/latest/download/uv-${normalizedArch}-pc-windows-msvc.zip`,
            archiveName: 'uv.zip',
            binaryName: 'uv.exe',
            archiveType: 'zip'
        };
    }
    if (platform === 'darwin') {
        return {
            url: `https://github.com/astral-sh/uv/releases/latest/download/uv-${normalizedArch}-apple-darwin.tar.gz`,
            archiveName: 'uv.tar.gz',
            binaryName: 'uv',
            archiveType: 'tar.gz'
        };
    }
    if (platform === 'linux') {
        return {
            url: `https://github.com/astral-sh/uv/releases/latest/download/uv-${normalizedArch}-unknown-linux-gnu.tar.gz`,
            archiveName: 'uv.tar.gz',
            binaryName: 'uv',
            archiveType: 'tar.gz'
        };
    }
    return null;
}

function downloadFile(url, targetPath, options = {}) {
    const maxRedirects = 5;
    const requestOnce = (currentUrl, redirectsRemaining) => new Promise((resolve, reject) => {
        const parsed = new URL(currentUrl);
        const client = parsed.protocol === 'http:' ? http : https;
        const request = client.get(parsed, {
            headers: {
                'User-Agent': 'AILIS-runtime-bootstrap/1.0'
            },
            timeout: options.timeoutMs || INSTALL_TIMEOUT_MS
        }, (response) => {
            if (
                response.statusCode >= 300 &&
                response.statusCode < 400 &&
                response.headers.location &&
                redirectsRemaining > 0
            ) {
                response.resume();
                const nextUrl = new URL(response.headers.location, parsed).toString();
                resolve(requestOnce(nextUrl, redirectsRemaining - 1));
                return;
            }

            if (response.statusCode < 200 || response.statusCode >= 300) {
                response.resume();
                reject(new Error(`download_failed_http_${response.statusCode}`));
                return;
            }

            const totalBytes = Number(response.headers['content-length'] || 0);
            let receivedBytes = 0;
            const output = fs.createWriteStream(targetPath);
            response.on('data', (chunk) => {
                receivedBytes += chunk.length;
                options.onProgress?.({
                    receivedBytes,
                    totalBytes,
                    percent: totalBytes ? Math.round((receivedBytes / totalBytes) * 100) : null
                });
            });
            response.pipe(output);
            output.on('finish', () => {
                output.close(resolve);
            });
            output.on('error', reject);
        });

        request.on('timeout', () => {
            request.destroy(new Error(`download_timeout_${options.timeoutMs || INSTALL_TIMEOUT_MS}ms`));
        });
        request.on('error', reject);
    });

    return requestOnce(url, maxRedirects);
}

async function findFileRecursive(rootDir, predicate) {
    const stack = [rootDir];
    while (stack.length) {
        const current = stack.pop();
        let entries = [];
        try {
            entries = await fsp.readdir(current, { withFileTypes: true });
        } catch {
            continue;
        }
        for (const entry of entries) {
            const entryPath = path.join(current, entry.name);
            if (entry.isDirectory()) {
                stack.push(entryPath);
                continue;
            }
            if (entry.isFile() && predicate(entryPath, entry)) {
                return entryPath;
            }
        }
    }
    return '';
}

async function moveDirectory(sourceDir, targetDir) {
    await fsp.rm(targetDir, { recursive: true, force: true });
    await fsp.mkdir(path.dirname(targetDir), { recursive: true });
    try {
        await fsp.rename(sourceDir, targetDir);
    } catch {
        await fsp.cp(sourceDir, targetDir, { recursive: true });
        await fsp.rm(sourceDir, { recursive: true, force: true });
    }
}

function inspectGpu(platform = process.platform) {
    const nvidia = runCommand('nvidia-smi', [
        '--query-gpu=name,memory.total,driver_version',
        '--format=csv,noheader'
    ], { timeoutMs: 8000 });

    const gpus = [];
    if (nvidia.ok && nvidia.stdout) {
        for (const line of nvidia.stdout.split(/\r?\n/).map((item) => item.trim()).filter(Boolean)) {
            const [name, memoryTotal, driverVersion] = line.split(',').map((item) => item.trim());
            gpus.push({
                vendor: 'nvidia',
                name,
                memoryTotal,
                driverVersion
            });
        }
    }

    const isAppleSilicon = platform === 'darwin' && process.arch === 'arm64';
    return {
        available: gpus.length > 0 || isAppleSilicon,
        nvidiaSmiAvailable: nvidia.ok,
        gpus,
        appleSilicon: isAppleSilicon,
        notes: [
            ...(nvidia.ok ? [] : ['nvidia_smi_unavailable']),
            ...(isAppleSilicon ? ['apple_silicon_detected'] : [])
        ]
    };
}

class VoiceRuntimeBootstrap {
    constructor({
        projectRoot,
        userDataPath,
        appDataPath,
        platform = process.platform
    } = {}) {
        this.projectRoot = path.resolve(projectRoot || path.join(__dirname, '..'));
        this.userDataPath = path.resolve(userDataPath || path.join(this.projectRoot, '.local', 'user-data'));
        this.appDataPath = path.resolve(appDataPath || path.dirname(this.userDataPath));
        this.platform = platform;
        this.cachedSnapshot = null;
        this.activeBootstrapRun = null;
        this.lastBootstrapRun = null;
    }

    getPackagedAsrRuntimeRoots() {
        const candidates = [
            process.env.AILIS_ASR_RUNTIME_DIR,
            process.resourcesPath ? path.join(process.resourcesPath, PACKAGED_ASR_RUNTIME_DIRNAME) : '',
            path.join(this.projectRoot, 'build-cache', PACKAGED_ASR_RUNTIME_DIRNAME),
            path.join(this.projectRoot, '.ailis-runtime', 'asr-runtime')
        ];
        const seen = new Set();
        return candidates
            .map((candidate) => normalizeString(candidate))
            .filter(Boolean)
            .filter((candidate) => {
                const key = path.resolve(candidate).toLowerCase();
                if (seen.has(key)) {
                    return false;
                }
                seen.add(key);
                return true;
            })
            .filter((candidate) => isDirectory(candidate));
    }

    getAsrRuntimeManifest(runtimeRoot) {
        return readJsonFile(path.join(runtimeRoot, 'manifest.json')) || {};
    }

    getPackagedAsrRuntimeInfo() {
        for (const runtimeRoot of this.getPackagedAsrRuntimeRoots()) {
            const manifest = this.getAsrRuntimeManifest(runtimeRoot);
            const asrVenv = normalizeRelativePath(runtimeRoot, manifest.asrVenv || 'asr-venv');
            const asrPython = normalizeRelativePath(runtimeRoot, manifest.asrPython || manifest.python) ||
                getVenvPythonPath(asrVenv, this.platform);
            const asrCache = normalizeRelativePath(runtimeRoot, manifest.asrCache) ||
                path.join(runtimeRoot, 'asr-cache');
            const env = buildRuntimeEnv(runtimeRoot, manifest);
            return {
                runtimeRoot,
                manifest,
                asrVenv,
                asrPython,
                asrCache,
                env
            };
        }
        return null;
    }

    getPackagedAsrCacheDirs() {
        const runtimeCacheDirs = this.getPackagedAsrRuntimeRoots()
            .flatMap((runtimeRoot) => {
                const manifest = this.getAsrRuntimeManifest(runtimeRoot);
                return [
                    normalizeRelativePath(runtimeRoot, manifest.asrCache),
                    path.join(runtimeRoot, 'asr-cache')
                ];
            });
        const speechModelDirs = [
            process.env.AILIS_ASR_BUNDLED_CACHE_DIR,
            process.resourcesPath ? path.join(process.resourcesPath, SPEECH_MODEL_DIRNAME, 'asr-cache') : '',
            process.resourcesPath ? path.join(process.resourcesPath, SPEECH_MODEL_DIRNAME) : '',
            path.join(this.projectRoot, 'Resources', SPEECH_MODEL_DIRNAME, 'asr-cache'),
            path.join(this.projectRoot, 'Resources', SPEECH_MODEL_DIRNAME),
            path.join(this.projectRoot, 'dist', 'Resources', SPEECH_MODEL_DIRNAME, 'asr-cache'),
            path.join(this.projectRoot, 'dist', 'Resources', SPEECH_MODEL_DIRNAME)
        ];
        const seen = new Set();
        return [...runtimeCacheDirs, ...speechModelDirs]
            .map((candidate) => normalizeString(candidate))
            .filter(Boolean)
            .filter((candidate) => {
                const key = path.resolve(candidate).toLowerCase();
                if (seen.has(key)) {
                    return false;
                }
                seen.add(key);
                return true;
            })
            .filter((candidate) => isDirectory(candidate));
    }

    resolveAsrCacheDir(paths = this.getPaths()) {
        if (hasAsrModel(paths.asrCacheDir)) {
            return paths.asrCacheDir;
        }
        return this.getPackagedAsrCacheDirs().find((candidate) => hasAsrModel(candidate)) ||
            paths.asrCacheDir;
    }

    getPaths() {
        const buildCacheRoot = path.join(this.projectRoot, 'build-cache');
        const localRuntimeRoot = path.join(this.userDataPath, 'local-runtimes');
        const downloadCacheDir = path.join(localRuntimeRoot, 'downloads');
        const uvRoot = path.join(localRuntimeRoot, 'uv');
        const uvBin = path.join(uvRoot, getExecutableName('uv', this.platform));
        const uvCacheDir = path.join(localRuntimeRoot, 'uv-cache');
        const pythonInstallDir = path.join(localRuntimeRoot, 'python');
        const voiceVenv = path.join(localRuntimeRoot, 'voice-venv');
        const voiceVenvPython = getVenvPythonPath(voiceVenv, this.platform);

        const projectCosyVoiceRoot = path.join(buildCacheRoot, 'CosyVoice');
        const localCosyVoiceRoot = path.join(localRuntimeRoot, 'CosyVoice');
        const cosyVoiceRoot = normalizeString(process.env.AILIS_COSYVOICE_ROOT) ||
            (isDirectory(projectCosyVoiceRoot) ? projectCosyVoiceRoot : localCosyVoiceRoot);
        const cosyVoice3ModelDir = normalizeString(process.env.AILIS_COSYVOICE3_MODEL_DIR) ||
            path.join(cosyVoiceRoot, 'pretrained_models', DEFAULT_COSYVOICE3_MODEL_DIRNAME);

        const cosyVoice3Venv = path.join(buildCacheRoot, 'cosyvoice3-venv');
        const cosyVoice3VenvPython = getVenvPythonPath(cosyVoice3Venv, this.platform);
        const asrCacheDir = normalizeString(process.env.AILIS_ASR_CACHE_DIR) ||
            path.join(this.userDataPath, 'asr-cache');
        const packagedAsrRuntime = this.getPackagedAsrRuntimeInfo();

        return {
            projectRoot: this.projectRoot,
            userDataPath: this.userDataPath,
            appDataPath: this.appDataPath,
            buildCacheRoot,
            localRuntimeRoot,
            downloadCacheDir,
            uvRoot,
            uvBin,
            uvCacheDir,
            pythonInstallDir,
            voiceVenv,
            voiceVenvPython,
            projectCosyVoiceRoot,
            localCosyVoiceRoot,
            cosyVoiceRoot,
            cosyVoice3ModelDir,
            cosyVoice3Venv,
            cosyVoice3VenvPython,
            asrCacheDir,
            packagedAsrRuntimeRoot: packagedAsrRuntime?.runtimeRoot || '',
            packagedAsrVenv: packagedAsrRuntime?.asrVenv || '',
            packagedAsrVenvPython: packagedAsrRuntime?.asrPython || '',
            packagedAsrCacheDir: packagedAsrRuntime?.asrCache || '',
            packagedAsrEnv: packagedAsrRuntime?.env || {}
        };
    }

    findPythonCandidates(paths = this.getPaths()) {
        const candidates = [
            { source: 'AILIS_COSYVOICE3_PYTHON', command: normalizeString(process.env.AILIS_COSYVOICE3_PYTHON), args: [] },
            { source: 'AILIS_VOICE_PYTHON', command: normalizeString(process.env.AILIS_VOICE_PYTHON), args: [] },
            { source: 'AILIS_ASR_PYTHON', command: normalizeString(process.env.AILIS_ASR_PYTHON), args: [] },
            { source: 'AILIS_PYTHON', command: normalizeString(process.env.AILIS_PYTHON), args: [] },
            { source: 'packaged-asr-runtime', command: paths.packagedAsrVenvPython, args: [], env: paths.packagedAsrEnv || {} },
            { source: 'voice-venv', command: paths.voiceVenvPython, args: [] },
            { source: 'cosyvoice3-venv', command: paths.cosyVoice3VenvPython, args: [] },
            { source: 'python', command: 'python', args: [] },
            { source: 'python3', command: 'python3', args: [] },
            { source: 'py-3.12', command: 'py', args: ['-3.12'] },
            { source: 'py', command: 'py', args: [] }
        ];
        return uniquePythonCandidates(candidates);
    }

    inspectPythonCandidates(paths = this.getPaths()) {
        return this.findPythonCandidates(paths)
            .map((candidate) => ({
                source: candidate.source,
                ...inspectPython(candidate.command, candidate.args, candidate.env)
            }));
    }

    chooseBestPython(inspections = []) {
        const privateSources = new Set([
            'AILIS_COSYVOICE3_PYTHON',
            'AILIS_VOICE_PYTHON',
            'voice-venv',
            'cosyvoice3-venv'
        ]);
        return inspections.find((entry) =>
            entry.ok &&
            privateSources.has(entry.source) &&
            entry.details?.has_torch &&
            entry.details?.has_transformers
        ) ||
            inspections.find((entry) => entry.ok && privateSources.has(entry.source)) ||
            inspections.find((entry) => entry.ok && entry.details?.has_torch && entry.details?.has_transformers) ||
            inspections.find((entry) => entry.ok) ||
            null;
    }

    chooseBestAsrPython(inspections = []) {
        const preferredSources = new Set([
            'packaged-asr-runtime',
            'AILIS_ASR_PYTHON',
            'AILIS_VOICE_PYTHON',
            'voice-venv',
            'cosyvoice3-venv'
        ]);
        return inspections.find((entry) =>
            entry.ok &&
            preferredSources.has(entry.source) &&
            entry.details?.has_torch &&
            entry.details?.has_transformers
        ) ||
            inspections.find((entry) =>
                entry.ok &&
                entry.details?.has_torch &&
                entry.details?.has_transformers
            ) ||
            inspections.find((entry) => entry.ok && preferredSources.has(entry.source)) ||
            inspections.find((entry) => entry.ok) ||
            null;
    }

    diagnose() {
        const startedAt = Date.now();
        const paths = this.getPaths();
        const python = this.inspectPythonCandidates(paths);
        const bestPython = this.chooseBestPython(python);
        const bestAsrPython = this.chooseBestAsrPython(python);
        const bestDetails = bestPython?.details || {};
        const bestAsrDetails = bestAsrPython?.details || {};
        const gpu = inspectGpu(this.platform);
        const cosyModelSizeBytes = directorySizeBytes(paths.cosyVoice3ModelDir, { maxFiles: 40000 });
        const resolvedAsrCacheDir = this.resolveAsrCacheDir(paths);
        const asrCacheSizeBytes = directorySizeBytes(resolvedAsrCacheDir, { maxFiles: 40000 });

        const cosyVoice3 = {
            ok: isDirectory(paths.cosyVoiceRoot) &&
                isDirectory(paths.cosyVoice3ModelDir) &&
                bestPython?.ok &&
                Boolean(bestDetails.has_torch && bestDetails.has_torchaudio),
            sourceExists: isDirectory(paths.cosyVoiceRoot),
            modelExists: isDirectory(paths.cosyVoice3ModelDir),
            localRuntimeExists: isDirectory(paths.localRuntimeRoot),
            voiceVenvExists: isDirectory(paths.voiceVenv),
            voiceVenvPythonExists: pathExists(paths.voiceVenvPython),
            projectVenvExists: isDirectory(paths.cosyVoice3Venv),
            projectVenvPythonExists: pathExists(paths.cosyVoice3VenvPython),
            modelDir: paths.cosyVoice3ModelDir,
            modelSizeBytes: cosyModelSizeBytes,
            modelSizeText: formatBytes(cosyModelSizeBytes),
            pythonSource: bestPython?.source || '',
            acceleration: {
                backend: bestDetails.torch_cuda_available
                    ? 'torch-cuda-fp16-capable'
                    : gpu.appleSilicon
                        ? 'apple-silicon-mps-capable'
                        : 'cpu-only',
                cudaAvailable: Boolean(bestDetails.torch_cuda_available),
                cudaDevices: bestDetails.cuda_devices || [],
                torchVersion: bestDetails.torch_version || '',
                torchCudaVersion: bestDetails.torch_cuda_version || '',
                onnxRuntimeProviders: bestDetails.onnxruntime_providers || [],
                hasVllm: Boolean(bestDetails.has_vllm),
                hasTensorRT: Boolean(bestDetails.has_tensorrt),
                gpu,
                notes: [
                    ...(bestDetails.torch_cuda_available && !(bestDetails.onnxruntime_providers || []).includes('CUDAExecutionProvider')
                        ? ['onnxruntime_cuda_provider_unavailable']
                        : []),
                    ...(!bestDetails.has_vllm ? ['vllm_not_installed'] : []),
                    ...(!bestDetails.has_tensorrt ? ['tensorrt_not_installed'] : []),
                    ...(gpu.available ? [] : ['gpu_not_detected'])
                ]
            }
        };

        const asr = {
            ok: Boolean(bestAsrPython?.ok && bestAsrDetails.has_transformers && bestAsrDetails.has_torch && hasAsrModel(resolvedAsrCacheDir)),
            cacheDir: resolvedAsrCacheDir,
            modelId: normalizeString(process.env.AILIS_ASR_MODEL_ID) || DEFAULT_ASR_MODEL_ID,
            modelCached: hasAsrModel(resolvedAsrCacheDir),
            cacheSizeBytes: asrCacheSizeBytes,
            cacheSizeText: formatBytes(asrCacheSizeBytes),
            pythonSource: bestAsrPython?.source || '',
            pythonCommand: bestAsrPython?.command || '',
            dependencies: {
                pip: Boolean(bestAsrDetails.has_pip),
                torch: Boolean(bestAsrDetails.has_torch),
                torchaudio: Boolean(bestAsrDetails.has_torchaudio),
                transformers: Boolean(bestAsrDetails.has_transformers),
                numpy: Boolean(bestAsrDetails.has_numpy),
                funasr: Boolean(bestAsrDetails.has_funasr)
            }
        };

        const snapshot = {
            ok: Boolean(cosyVoice3.ok && asr.ok),
            generatedAt: new Date().toISOString(),
            durationMs: Date.now() - startedAt,
            platform: {
                os: this.platform,
                arch: process.arch,
                release: os.release(),
                cpus: os.cpus()?.length || 0,
                totalMemoryBytes: os.totalmem(),
                totalMemoryText: formatBytes(os.totalmem())
            },
            paths,
            python,
            selectedPython: bestPython
                ? {
                    source: bestPython.source,
                    command: bestPython.command,
                    args: bestPython.args,
                    version: bestPython.version,
                    details: bestPython.details
                }
                : null,
            selectedAsrPython: bestAsrPython
                ? {
                    source: bestAsrPython.source,
                    command: bestAsrPython.command,
                    args: bestAsrPython.args,
                    version: bestAsrPython.version,
                    details: bestAsrPython.details
                }
                : null,
            cosyVoice3,
            asr
        };
        snapshot.installPlan = this.buildInstallPlan(snapshot);
        this.cachedSnapshot = snapshot;
        return snapshot;
    }

    buildInstallPlan(snapshot = this.cachedSnapshot || {}) {
        const paths = snapshot.paths || this.getPaths();
        const selectedPython = snapshot.selectedPython;
        const details = selectedPython?.details || {};
        const privatePythonReady = pathExists(paths.voiceVenvPython) || pathExists(paths.cosyVoice3VenvPython);
        const steps = [];

        if (!selectedPython || !privatePythonReady) {
            steps.push(buildStep({
                id: 'install_portable_python',
                title: '安装 AILIS 私有 Python runtime',
                reason: selectedPython
                    ? '检测到系统 Python，但产品运行不应依赖用户全局环境；需要创建 AILIS 私有语音 venv。'
                    : '未检测到可用 Python。产品不应要求用户手动安装系统 Python。',
                category: 'python',
                automatic: true,
                requiresNetwork: true,
                mutatesSystem: false,
                estimatedSize: '约 100-250 MB',
                command: {
                    tool: 'uv',
                    args: ['venv', paths.voiceVenv, '--python', DEFAULT_VOICE_PYTHON_VERSION, '--seed']
                },
                notes: [
                    `目标目录：${paths.voiceVenv}`,
                    '通过 uv managed Python 创建私有 venv，不写入系统 PATH。',
                    'uv 本身也会安装到 AILIS 私有 local-runtimes 目录。'
                ]
            }));
        }

        if (!details.has_pip || !details.has_torch || !details.has_torchaudio || !details.has_transformers) {
            steps.push(buildStep({
                id: 'install_voice_python_packages',
                title: '安装语音运行所需 Python 包',
                reason: '缺少 pip/torch/torchaudio/transformers 等本地语音运行依赖。',
                category: 'python-packages',
                automatic: true,
                requiresNetwork: true,
                mutatesSystem: false,
                estimatedSize: '约 2-6 GB，取决于 CUDA/CPU wheel',
                command: {
                    tool: 'python',
                    args: ['-m', 'pip', 'install', '--upgrade', ...BASE_VOICE_PACKAGES]
                },
                notes: [
                    '安装到 AILIS 私有 voice-venv，而不是系统 Python。',
                    'pip 会按当前平台选择 CPU/CUDA/MPS 可用 wheel；检测到 GPU 后再尝试安装可选加速包。'
                ]
            }));
        }

        if (!snapshot.cosyVoice3?.sourceExists) {
            steps.push(buildStep({
                id: 'install_cosyvoice_source',
                title: '安装 CosyVoice3 源码运行时',
                reason: '缺少 CosyVoice 源码目录，CosyVoice3 worker 无法启动。',
                category: 'cosyvoice3',
                automatic: true,
                requiresNetwork: true,
                mutatesSystem: false,
                estimatedSize: '约 100-300 MB',
                command: {
                    tool: 'git',
                    args: ['clone', '--recursive', '--depth', '1', DEFAULT_COSYVOICE_GIT_URL, paths.cosyVoiceRoot]
                },
                notes: [
                    `目标目录：${paths.cosyVoiceRoot}`,
                    '优先使用 git clone --recursive；无 git 时回退 GitHub zip 下载。'
                ]
            }));
        }

        if (!snapshot.cosyVoice3?.modelExists) {
            steps.push(buildStep({
                id: 'install_cosyvoice3_model',
                title: '安装 CosyVoice3 本地模型',
                reason: '缺少 Fun-CosyVoice3-0.5B 模型目录。',
                category: 'cosyvoice3-model',
                automatic: true,
                requiresNetwork: true,
                mutatesSystem: false,
                estimatedSize: '约 7-8 GB',
                command: {
                    tool: 'huggingface_hub.snapshot_download',
                    repo: normalizeString(process.env.AILIS_COSYVOICE3_MODEL_REPO) || DEFAULT_COSYVOICE3_MODEL_REPO
                },
                notes: [
                    `目标目录：${paths.cosyVoice3ModelDir}`,
                    '下载完成前不应切到 CosyVoice3 语音模式。'
                ]
            }));
        }

        if (!snapshot.asr?.modelCached) {
            steps.push(buildStep({
                id: 'install_asr_model',
                title: '安装本地 ASR 模型',
                reason: '缺少本地 Whisper/SenseVoice ASR 模型缓存。',
                category: 'asr-model',
                automatic: true,
                requiresNetwork: true,
                mutatesSystem: false,
                estimatedSize: '约 1-2 GB',
                command: {
                    tool: 'huggingface_hub.snapshot_download',
                    repo: snapshot.asr?.modelId || DEFAULT_ASR_MODEL_ID
                },
                notes: [
                    `目标缓存：${paths.asrCacheDir}`,
                    '默认离线运行；只有安装阶段在用户允许后联网。'
                ]
            }));
        }

        if (
            snapshot.cosyVoice3?.acceleration?.cudaAvailable &&
            !snapshot.cosyVoice3?.acceleration?.onnxRuntimeProviders?.includes('CUDAExecutionProvider')
        ) {
            steps.push(buildStep({
                id: 'install_onnxruntime_gpu',
                title: '安装 ONNX Runtime GPU 加速',
                reason: '检测到 GPU，但 ONNX Runtime 没有 CUDAExecutionProvider，部分语音前端仍在 CPU 上跑。',
                category: 'performance',
                automatic: true,
                requiresNetwork: true,
                mutatesSystem: false,
                estimatedSize: '约 200-500 MB',
                command: {
                    tool: 'python',
                    args: ['-m', 'pip', 'install', '--upgrade', 'onnxruntime-gpu']
                },
                notes: [
                    '需要匹配 CUDA/驱动版本；失败时应回退到 CPU provider。',
                    '这是性能优化，不应阻塞基本语音功能。'
                ]
            }));
        }

        return {
            ok: steps.length === 0,
            generatedAt: new Date().toISOString(),
            canAutoInstall: steps.some((step) => step.automatic),
            requiresNetwork: steps.some((step) => step.requiresNetwork),
            requiresApproval: steps.some((step) => step.requiresApproval),
            steps
        };
    }

    getPreferredVoicePythonPath() {
        const paths = this.getPaths();
        if (pathExists(paths.voiceVenvPython)) {
            return paths.voiceVenvPython;
        }
        if (pathExists(paths.cosyVoice3VenvPython)) {
            return paths.cosyVoice3VenvPython;
        }
        const selected = this.cachedSnapshot?.selectedPython;
        if (selected?.source === 'packaged-asr-runtime') {
            return '';
        }
        return selected?.command || '';
    }

    getPreferredAsrPythonPath() {
        const paths = this.getPaths();
        const selectedAsr = this.cachedSnapshot?.selectedAsrPython;
        if (selectedAsr?.command) {
            return selectedAsr.command;
        }
        if (pathExists(paths.packagedAsrVenvPython)) {
            return paths.packagedAsrVenvPython;
        }
        if (pathExists(paths.voiceVenvPython)) {
            return paths.voiceVenvPython;
        }
        if (pathExists(paths.cosyVoice3VenvPython)) {
            return paths.cosyVoice3VenvPython;
        }
        return '';
    }

    getUvEnv(paths = this.getPaths()) {
        return {
            UV_CACHE_DIR: paths.uvCacheDir,
            UV_PYTHON_INSTALL_DIR: paths.pythonInstallDir,
            UV_LINK_MODE: 'copy'
        };
    }

    async extractArchive(archivePath, targetDir, archiveType, onOutput) {
        await fsp.rm(targetDir, { recursive: true, force: true });
        await fsp.mkdir(targetDir, { recursive: true });

        let result;
        if (archiveType === 'zip' && this.platform === 'win32') {
            result = await runCommandAsync('powershell.exe', [
                '-NoProfile',
                '-ExecutionPolicy',
                'Bypass',
                '-Command',
                'Expand-Archive -LiteralPath $args[0] -DestinationPath $args[1] -Force',
                archivePath,
                targetDir
            ], { timeoutMs: INSTALL_TIMEOUT_MS, onOutput });
        } else if (archiveType === 'zip') {
            result = await runCommandAsync('unzip', ['-q', archivePath, '-d', targetDir], {
                timeoutMs: INSTALL_TIMEOUT_MS,
                onOutput
            });
        } else {
            result = await runCommandAsync('tar', ['-xzf', archivePath, '-C', targetDir], {
                timeoutMs: INSTALL_TIMEOUT_MS,
                onOutput
            });
        }
        if (!result.ok) {
            throw new Error(result.stderr || result.error || `解压失败：${archivePath}`);
        }
        return result;
    }

    async ensureUv({ paths = this.getPaths(), onOutput } = {}) {
        if (isFile(paths.uvBin)) {
            return paths.uvBin;
        }

        const systemUv = runCommand('uv', ['--version'], { timeoutMs: 8000 });
        if (systemUv.ok) {
            return 'uv';
        }

        const asset = getUvAsset(this.platform, process.arch);
        if (!asset) {
            throw new Error(`当前平台暂不支持自动安装 uv：${this.platform}/${process.arch}`);
        }

        await fsp.mkdir(paths.downloadCacheDir, { recursive: true });
        await fsp.mkdir(paths.uvRoot, { recursive: true });
        const archivePath = path.join(paths.downloadCacheDir, asset.archiveName);
        onOutput?.({
            stream: 'stdout',
            text: `[AILIS runtime] downloading uv: ${asset.url}\n`
        });
        await downloadFile(asset.url, archivePath, {
            timeoutMs: INSTALL_TIMEOUT_MS,
            onProgress: (progress) => {
                if (progress.percent !== null && progress.percent % 10 === 0) {
                    onOutput?.({
                        stream: 'stdout',
                        text: `[AILIS runtime] uv download ${progress.percent}%\n`
                    });
                }
            }
        });

        const extractDir = path.join(paths.downloadCacheDir, `uv-extract-${Date.now()}`);
        await this.extractArchive(archivePath, extractDir, asset.archiveType, onOutput);
        const extractedUv = await findFileRecursive(extractDir, (filePath) =>
            path.basename(filePath).toLowerCase() === asset.binaryName.toLowerCase()
        );
        if (!extractedUv) {
            throw new Error('uv 下载完成但未找到可执行文件');
        }
        await fsp.copyFile(extractedUv, paths.uvBin);
        if (this.platform !== 'win32') {
            await fsp.chmod(paths.uvBin, 0o755).catch(() => {});
        }
        await fsp.rm(extractDir, { recursive: true, force: true });
        return paths.uvBin;
    }

    async installPrivatePython({ paths = this.getPaths(), onOutput } = {}) {
        await fsp.mkdir(paths.localRuntimeRoot, { recursive: true });
        const uv = await this.ensureUv({ paths, onOutput });
        const env = this.getUvEnv(paths);

        const pythonInstall = await runCommandAsync(uv, [
            'python',
            'install',
            '--install-dir',
            paths.pythonInstallDir,
            DEFAULT_VOICE_PYTHON_VERSION
        ], {
            cwd: this.projectRoot,
            env,
            timeoutMs: INSTALL_TIMEOUT_MS,
            onOutput
        });
        if (!pythonInstall.ok) {
            throw new Error(pythonInstall.stderr || pythonInstall.error || 'AILIS 私有 Python 下载/安装失败');
        }

        const venv = await runCommandAsync(uv, [
            'venv',
            paths.voiceVenv,
            '--python',
            DEFAULT_VOICE_PYTHON_VERSION,
            '--managed-python',
            '--seed'
        ], {
            cwd: this.projectRoot,
            env,
            timeoutMs: INSTALL_TIMEOUT_MS,
            onOutput
        });
        if (!venv.ok) {
            throw new Error(venv.stderr || venv.error || 'AILIS 私有 Python venv 创建失败');
        }
        if (!isFile(paths.voiceVenvPython)) {
            throw new Error(`AILIS 私有 Python 创建后仍未找到：${paths.voiceVenvPython}`);
        }

        const pip = await runCommandAsync(paths.voiceVenvPython, [
            '-m',
            'pip',
            'install',
            '--upgrade',
            'pip',
            'setuptools',
            'wheel'
        ], {
            cwd: this.projectRoot,
            timeoutMs: INSTALL_TIMEOUT_MS,
            onOutput
        });
        if (!pip.ok) {
            throw new Error(pip.stderr || pip.error || 'pip 初始化失败');
        }
        return paths.voiceVenvPython;
    }

    async getInstallPython({ paths = this.getPaths(), onOutput } = {}) {
        if (isFile(paths.voiceVenvPython)) {
            return paths.voiceVenvPython;
        }
        if (isFile(paths.cosyVoice3VenvPython)) {
            return paths.cosyVoice3VenvPython;
        }
        return this.installPrivatePython({ paths, onOutput });
    }

    async installVoicePackages({ paths = this.getPaths(), onOutput } = {}) {
        const python = await this.getInstallPython({ paths, onOutput });
        const result = await runCommandAsync(python, [
            '-m',
            'pip',
            'install',
            '--upgrade',
            ...BASE_VOICE_PACKAGES
        ], {
            cwd: this.projectRoot,
            timeoutMs: INSTALL_TIMEOUT_MS,
            onOutput
        });
        if (!result.ok) {
            throw new Error(result.stderr || result.error || '语音 Python 依赖安装失败');
        }
        return result;
    }

    async installGitHubZip({ url, targetDir, name, onOutput }) {
        const paths = this.getPaths();
        await fsp.mkdir(paths.downloadCacheDir, { recursive: true });
        const archivePath = path.join(paths.downloadCacheDir, `${name}-${Date.now()}.zip`);
        await downloadFile(url, archivePath, { timeoutMs: INSTALL_TIMEOUT_MS });
        const extractDir = path.join(paths.downloadCacheDir, `${name}-extract-${Date.now()}`);
        await this.extractArchive(archivePath, extractDir, 'zip', onOutput);
        const entries = await fsp.readdir(extractDir, { withFileTypes: true });
        const firstDirectory = entries.find((entry) => entry.isDirectory());
        if (!firstDirectory) {
            throw new Error(`GitHub zip 解压后没有目录：${url}`);
        }
        await moveDirectory(path.join(extractDir, firstDirectory.name), targetDir);
        await fsp.rm(extractDir, { recursive: true, force: true });
    }

    async installCosyVoiceSource({ paths = this.getPaths(), onOutput } = {}) {
        if (isDirectory(paths.cosyVoiceRoot)) {
            return { ok: true, skipped: true, reason: 'cosyvoice_source_exists' };
        }

        await fsp.mkdir(path.dirname(paths.cosyVoiceRoot), { recursive: true });
        const git = runCommand('git', ['--version'], { timeoutMs: 8000 });
        if (git.ok) {
            const clone = await runCommandAsync('git', [
                'clone',
                '--recursive',
                '--depth',
                '1',
                DEFAULT_COSYVOICE_GIT_URL,
                paths.cosyVoiceRoot
            ], {
                cwd: path.dirname(paths.cosyVoiceRoot),
                timeoutMs: INSTALL_TIMEOUT_MS,
                onOutput
            });
            if (!clone.ok) {
                await fsp.rm(paths.cosyVoiceRoot, { recursive: true, force: true });
                throw new Error(clone.stderr || clone.error || 'CosyVoice 源码 clone 失败');
            }

            const matchaDir = path.join(paths.cosyVoiceRoot, 'third_party', 'Matcha-TTS');
            if (!isDirectory(matchaDir)) {
                await fsp.mkdir(path.dirname(matchaDir), { recursive: true });
                const matcha = await runCommandAsync('git', [
                    'clone',
                    '--depth',
                    '1',
                    DEFAULT_MATCHA_GIT_URL,
                    matchaDir
                ], {
                    cwd: path.dirname(matchaDir),
                    timeoutMs: INSTALL_TIMEOUT_MS,
                    onOutput
                });
                if (!matcha.ok) {
                    throw new Error(matcha.stderr || matcha.error || 'Matcha-TTS 子模块安装失败');
                }
            }
            return clone;
        }

        await this.installGitHubZip({
            url: 'https://github.com/FunAudioLLM/CosyVoice/archive/refs/heads/main.zip',
            targetDir: paths.cosyVoiceRoot,
            name: 'CosyVoice',
            onOutput
        });
        await this.installGitHubZip({
            url: 'https://github.com/shivammehta25/Matcha-TTS/archive/refs/heads/main.zip',
            targetDir: path.join(paths.cosyVoiceRoot, 'third_party', 'Matcha-TTS'),
            name: 'Matcha-TTS',
            onOutput
        });
        return { ok: true, fallback: 'github_zip' };
    }

    async installCosyVoice3Model({ paths = this.getPaths(), onOutput } = {}) {
        const python = await this.getInstallPython({ paths, onOutput });
        await fsp.mkdir(path.dirname(paths.cosyVoice3ModelDir), { recursive: true });
        const repoId = normalizeString(process.env.AILIS_COSYVOICE3_MODEL_REPO) || DEFAULT_COSYVOICE3_MODEL_REPO;
        const code = [
            'from huggingface_hub import snapshot_download',
            `snapshot_download(${JSON.stringify(repoId)}, local_dir=${JSON.stringify(paths.cosyVoice3ModelDir)}, local_dir_use_symlinks=False, resume_download=True)`
        ].join('\n');
        const result = await runCommandAsync(python, ['-c', code], {
            cwd: this.projectRoot,
            timeoutMs: INSTALL_TIMEOUT_MS,
            onOutput
        });
        if (!result.ok) {
            throw new Error(result.stderr || result.error || 'CosyVoice3 模型下载失败');
        }
        return result;
    }

    async installAsrModel({ paths = this.getPaths(), onOutput } = {}) {
        const python = await this.getInstallPython({ paths, onOutput });
        await fsp.mkdir(paths.asrCacheDir, { recursive: true });
        const modelId = normalizeString(process.env.AILIS_ASR_MODEL_ID) || DEFAULT_ASR_MODEL_ID;
        const code = [
            'from huggingface_hub import snapshot_download',
            `snapshot_download(${JSON.stringify(modelId)}, cache_dir=${JSON.stringify(paths.asrCacheDir)}, resume_download=True)`
        ].join('\n');
        const result = await runCommandAsync(python, ['-c', code], {
            cwd: this.projectRoot,
            timeoutMs: INSTALL_TIMEOUT_MS,
            onOutput
        });
        if (!result.ok) {
            throw new Error(result.stderr || result.error || 'ASR 模型下载失败');
        }
        return result;
    }

    async installOnnxRuntimeGpu({ paths = this.getPaths(), onOutput } = {}) {
        const python = await this.getInstallPython({ paths, onOutput });
        const result = await runCommandAsync(python, [
            '-m',
            'pip',
            'install',
            '--upgrade',
            'onnxruntime-gpu'
        ], {
            cwd: this.projectRoot,
            timeoutMs: INSTALL_TIMEOUT_MS,
            onOutput
        });
        if (!result.ok) {
            throw new Error(result.stderr || result.error || 'ONNX Runtime GPU 安装失败');
        }
        return result;
    }

    async runInstallStep(step, { run, dryRun = false } = {}) {
        const paths = this.getPaths();
        const stepRun = {
            id: step.id,
            title: step.title,
            status: dryRun ? 'dry_run' : 'running',
            startedAt: new Date().toISOString(),
            logs: []
        };
        run.steps.push(stepRun);

        const onOutput = ({ stream, text }) => {
            const cleanText = String(text || '');
            if (!cleanText) {
                return;
            }
            stepRun.logs.push({
                at: new Date().toISOString(),
                stream,
                text: cleanText.slice(-1200)
            });
            if (stepRun.logs.length > 80) {
                stepRun.logs.splice(0, stepRun.logs.length - 80);
            }
        };

        if (dryRun) {
            stepRun.finishedAt = new Date().toISOString();
            stepRun.result = {
                ok: true,
                dryRun: true,
                command: step.command || null
            };
            return stepRun;
        }

        try {
            let result;
            if (step.id === 'install_portable_python') {
                result = await this.installPrivatePython({ paths, onOutput });
            } else if (step.id === 'install_voice_python_packages') {
                result = await this.installVoicePackages({ paths, onOutput });
            } else if (step.id === 'install_cosyvoice_source') {
                result = await this.installCosyVoiceSource({ paths, onOutput });
            } else if (step.id === 'install_cosyvoice3_model') {
                result = await this.installCosyVoice3Model({ paths, onOutput });
            } else if (step.id === 'install_asr_model') {
                result = await this.installAsrModel({ paths, onOutput });
            } else if (step.id === 'install_onnxruntime_gpu') {
                result = await this.installOnnxRuntimeGpu({ paths, onOutput });
            } else {
                throw new Error(`未知安装步骤：${step.id}`);
            }
            stepRun.status = 'completed';
            stepRun.result = {
                ok: true,
                value: typeof result === 'string' ? result : undefined,
                stdout: result?.stdout || '',
                stderr: result?.stderr || '',
                durationMs: result?.durationMs || undefined
            };
        } catch (error) {
            stepRun.status = 'failed';
            stepRun.error = error?.message || String(error);
            stepRun.result = {
                ok: false,
                error: stepRun.error
            };
            throw error;
        } finally {
            stepRun.finishedAt = new Date().toISOString();
        }
        return stepRun;
    }

    async bootstrap(options = {}) {
        if (this.activeBootstrapRun?.status === 'running') {
            return {
                ...this.activeBootstrapRun,
                ok: false,
                error: 'bootstrap_already_running'
            };
        }

        const dryRun = Boolean(options.dryRun);
        const allowNetwork = Boolean(options.allowNetwork);
        const snapshot = this.diagnose();
        const requestedStepIds = Array.isArray(options.stepIds)
            ? new Set(options.stepIds.map((id) => String(id || '').trim()).filter(Boolean))
            : null;
        const steps = snapshot.installPlan.steps.filter((step) =>
            !requestedStepIds || requestedStepIds.has(step.id)
        );
        const run = {
            id: `voice-runtime-bootstrap-${Date.now()}`,
            ok: false,
            status: 'running',
            dryRun,
            allowNetwork,
            startedAt: new Date().toISOString(),
            steps: [],
            initialSnapshot: snapshot
        };
        this.activeBootstrapRun = run;
        this.lastBootstrapRun = run;

        try {
            if (!steps.length) {
                run.status = 'completed';
                run.ok = true;
                run.message = '本地语音运行时已经就绪。';
                return run;
            }

            const blockedNetworkStep = steps.find((step) => step.requiresNetwork && !allowNetwork && !dryRun);
            if (blockedNetworkStep) {
                run.status = 'blocked';
                run.ok = false;
                run.error = `安装步骤需要联网授权：${blockedNetworkStep.title}`;
                return run;
            }

            for (const step of steps) {
                await this.runInstallStep(step, { run, dryRun });
            }

            run.finalSnapshot = dryRun ? snapshot : this.diagnose();
            run.status = run.finalSnapshot?.ok || dryRun ? 'completed' : 'completed_with_warnings';
            run.ok = Boolean(dryRun || run.finalSnapshot?.ok);
            if (!run.ok) {
                run.error = '安装流程完成，但诊断仍显示运行时未完全就绪。';
            }
            return run;
        } catch (error) {
            run.status = 'failed';
            run.ok = false;
            run.error = error?.message || String(error);
            return run;
        } finally {
            run.finishedAt = new Date().toISOString();
            this.activeBootstrapRun = null;
        }
    }

    getBootstrapStatus() {
        return this.activeBootstrapRun || this.lastBootstrapRun || {
            ok: false,
            status: 'not_started',
            message: '尚未执行本地语音运行时自动安装。'
        };
    }

    getFastSummary() {
        const paths = this.getPaths();
        const preferredPython = this.getPreferredVoicePythonPath();
        const preferredAsrPython = this.getPreferredAsrPythonPath();
        const cosyModelSizeBytes = directorySizeBytes(paths.cosyVoice3ModelDir, { maxFiles: 4000 });
        const resolvedAsrCacheDir = this.resolveAsrCacheDir(paths);
        const asrCacheSizeBytes = directorySizeBytes(resolvedAsrCacheDir, { maxFiles: 4000 });
        const cachedAcceleration = this.cachedSnapshot?.cosyVoice3?.acceleration;
        const cachedDependencies = this.cachedSnapshot?.asr?.dependencies;
        const cosyVoice3 = {
            ok: Boolean(preferredPython && isDirectory(paths.cosyVoiceRoot) && isDirectory(paths.cosyVoice3ModelDir)),
            sourceExists: isDirectory(paths.cosyVoiceRoot),
            modelExists: isDirectory(paths.cosyVoice3ModelDir),
            modelDir: paths.cosyVoice3ModelDir,
            modelSizeBytes: cosyModelSizeBytes,
            modelSizeText: formatBytes(cosyModelSizeBytes),
            acceleration: cachedAcceleration || {
                backend: 'not_diagnosed',
                cudaAvailable: false,
                cudaDevices: [],
                onnxRuntimeProviders: [],
                hasVllm: false,
                hasTensorRT: false,
                notes: ['full_diagnosis_not_run']
            }
        };
        const asr = {
            ok: Boolean(preferredAsrPython && hasAsrModel(resolvedAsrCacheDir)),
            cacheDir: resolvedAsrCacheDir,
            modelId: normalizeString(process.env.AILIS_ASR_MODEL_ID) || DEFAULT_ASR_MODEL_ID,
            modelCached: hasAsrModel(resolvedAsrCacheDir),
            cacheSizeBytes: asrCacheSizeBytes,
            cacheSizeText: formatBytes(asrCacheSizeBytes),
            pythonCommand: preferredAsrPython,
            dependencies: cachedDependencies || {}
        };
        const snapshot = {
            ok: Boolean(cosyVoice3.ok && asr.ok),
            generatedAt: new Date().toISOString(),
            platform: {
                os: this.platform,
                arch: process.arch
            },
            paths,
            selectedPython: preferredPython
                ? {
                    source: 'fast-path',
                    command: preferredPython,
                    args: [],
                    version: '',
                    details: {
                        has_pip: true,
                        has_torch: true,
                        has_torchaudio: true,
                        has_transformers: true
                    }
                }
                : null,
            selectedAsrPython: preferredAsrPython
                ? {
                    source: 'fast-asr-path',
                    command: preferredAsrPython,
                    args: [],
                    version: '',
                    details: {
                        has_pip: true,
                        has_torch: true,
                        has_torchaudio: true,
                        has_transformers: true
                    }
                }
                : null,
            cosyVoice3,
            asr
        };
        snapshot.installPlan = this.cachedSnapshot?.installPlan || this.buildInstallPlan(snapshot);
        return {
            ok: snapshot.ok,
            status: snapshot.ok ? 'ready' : 'needs_setup',
            generatedAt: snapshot.generatedAt,
            platform: snapshot.platform,
            cosyVoice3: snapshot.cosyVoice3,
            asr: snapshot.asr,
            preferredPython,
            preferredAsrPython,
            installStepCount: snapshot.installPlan.steps.length,
            installPlan: snapshot.installPlan,
            bootstrap: this.getBootstrapStatus(),
            fast: true
        };
    }

    getCachedSummary() {
        if (!this.cachedSnapshot) {
            return {
                ok: false,
                status: 'not_diagnosed',
                message: '本地语音运行时尚未诊断。'
            };
        }
        return {
            ok: this.cachedSnapshot.ok,
            status: this.cachedSnapshot.ok ? 'ready' : 'needs_setup',
            generatedAt: this.cachedSnapshot.generatedAt,
            platform: this.cachedSnapshot.platform,
            cosyVoice3: {
                ok: this.cachedSnapshot.cosyVoice3.ok,
                sourceExists: this.cachedSnapshot.cosyVoice3.sourceExists,
                modelExists: this.cachedSnapshot.cosyVoice3.modelExists,
                acceleration: this.cachedSnapshot.cosyVoice3.acceleration
            },
            asr: {
                ok: this.cachedSnapshot.asr.ok,
                modelCached: this.cachedSnapshot.asr.modelCached,
                dependencies: this.cachedSnapshot.asr.dependencies,
                pythonCommand: this.cachedSnapshot.asr.pythonCommand || ''
            },
            preferredPython: this.getPreferredVoicePythonPath(),
            preferredAsrPython: this.getPreferredAsrPythonPath(),
            installStepCount: this.cachedSnapshot.installPlan.steps.length,
            installPlan: this.cachedSnapshot.installPlan,
            bootstrap: this.getBootstrapStatus()
        };
    }
}

module.exports = {
    VoiceRuntimeBootstrap,
    DEFAULT_ASR_MODEL_ID,
    DEFAULT_COSYVOICE3_MODEL_DIRNAME,
    DEFAULT_COSYVOICE3_MODEL_REPO,
    DEFAULT_VOICE_PYTHON_VERSION,
    BASE_VOICE_PACKAGES,
    getVenvPythonPath
};
