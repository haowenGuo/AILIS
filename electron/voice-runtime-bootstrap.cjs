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
const DEFAULT_UV_PYTHON_INSTALL_MIRRORS = Object.freeze([
    'https://python-standalone.org/mirror/astral-sh/python-build-standalone',
    'https://mirrors.tuna.tsinghua.edu.cn/github-release/astral-sh/python-build-standalone',
    'https://mirror.nju.edu.cn/github-release/astral-sh/python-build-standalone',
    ''
]);
const DEFAULT_PIP_INDEX_URLS = Object.freeze([
    'https://pypi.tuna.tsinghua.edu.cn/simple',
    'https://mirrors.aliyun.com/pypi/simple',
    'https://mirror.nju.edu.cn/pypi/web/simple',
    'https://mirrors.ustc.edu.cn/pypi/simple',
    ''
]);
const DEFAULT_VOICE_PIP_EXTRA_INDEX_URLS = Object.freeze([
    'https://download.pytorch.org/whl/cu121'
]);
const DEFAULT_TIMEOUT_MS = 12000;
const INSTALL_TIMEOUT_MS = 30 * 60 * 1000;
const MAX_CAPTURE_CHARS = 24000;
const PACKAGED_ASR_RUNTIME_DIRNAME = 'ailis-asr-runtime';
const SPEECH_MODEL_DIRNAME = 'speech-models';
const VOICE_RUNTIME_INSTALLER_VERSION = 2;
const VOICE_RUNTIME_MANIFEST_FILENAME = 'voice-runtime-manifest.json';

const COSYVOICE_SOURCE_REQUIRED_GROUPS = Object.freeze([
    { id: 'cosyvoice_entry', label: 'CosyVoice 入口代码', anyOf: ['cosyvoice/cli/cosyvoice.py'] },
    { id: 'matcha_tts', label: 'Matcha-TTS 子模块', anyOf: ['third_party/Matcha-TTS'] },
    { id: 'prompt_wav', label: '默认参考音频', anyOf: ['asset/zero_shot_prompt.wav'] }
]);

const COSYVOICE3_MODEL_REQUIRED_GROUPS = Object.freeze([
    { id: 'config', label: 'CosyVoice3 配置', anyOf: ['cosyvoice3.yaml'] },
    { id: 'llm', label: 'LLM 权重', anyOf: ['llm.pt', 'llm.fp16.pt'] },
    { id: 'flow', label: 'Flow 权重', anyOf: ['flow.pt', 'flow.fp16.pt'] },
    { id: 'hift', label: 'HiFT 权重', anyOf: ['hift.pt', 'hift.fp16.pt'] },
    { id: 'speaker_encoder', label: '说话人编码器', anyOf: ['campplus.onnx'] },
    { id: 'speech_tokenizer', label: '语音 tokenizer', anyOf: ['speech_tokenizer_v3.batch.onnx', 'speech_tokenizer_v3.onnx'] },
    { id: 'blanken_model', label: 'BlankEN 文本模型', anyOf: ['CosyVoice-BlankEN/model.safetensors'] },
    { id: 'blanken_tokenizer', label: 'BlankEN tokenizer', anyOf: ['CosyVoice-BlankEN/tokenizer_config.json'] }
]);

const COSYVOICE3_MODEL_ALLOW_PATTERNS = Object.freeze([
    '*.json',
    '*.yaml',
    '*.yml',
    '*.pt',
    '*.onnx',
    'README.md',
    '.gitattributes',
    'asset/*',
    'CosyVoice-BlankEN/*'
]);

const ASR_MODEL_REQUIRED_GROUPS = Object.freeze([
    { id: 'config', label: 'ASR 配置', anyOf: ['config.json'] },
    { id: 'processor', label: 'ASR 预处理配置', anyOf: ['preprocessor_config.json'] },
    { id: 'tokenizer', label: 'ASR tokenizer', anyOf: ['tokenizer.json', 'vocab.json'] },
    { id: 'weights', label: 'ASR safetensors 权重', anyOf: ['model.safetensors'] }
]);

const ASR_MODEL_ALLOW_PATTERNS = Object.freeze([
    '*.json',
    '*.txt',
    '*.md',
    '.gitattributes',
    'model.safetensors',
    '*.safetensors'
]);

const ASR_MODEL_IGNORE_PATTERNS = Object.freeze([
    '*.bin',
    '*.msgpack',
    '*.h5',
    '*.onnx'
]);

const BASE_VOICE_PACKAGES = Object.freeze([
    'numpy==1.26.4',
    'torch==2.3.1',
    'torchaudio==2.3.1',
    'transformers==4.51.3',
    'accelerate>=1.0,<2.0',
    'huggingface_hub>=0.24',
    'modelscope==1.20.0',
    'onnxruntime==1.18.0',
    'soundfile==0.12.1',
    'librosa==0.10.2',
    'HyperPyYAML==1.2.3',
    'hydra-core==1.3.2',
    'omegaconf==2.3.0',
    'inflect==7.3.1',
    'conformer==0.3.2',
    'diffusers==0.29.0',
    'openai-whisper==20231117',
    'lightning==2.2.4',
    'matplotlib==3.7.5',
    'pyarrow==18.1.0',
    'pydantic==2.7.0',
    'protobuf==4.25.8',
    'pyworld==0.3.4',
    'x-transformers==2.11.24',
    'gdown==5.1.0',
    'rich==13.7.1',
    'wget==3.2'
]);

function normalizeString(value) {
    return String(value || '').trim();
}

function splitList(value) {
    return String(value || '')
        .split(/[;,\n]/)
        .map((entry) => normalizeString(entry))
        .filter(Boolean);
}

function normalizeMirrorUrl(value) {
    return normalizeString(value).replace(/\/+$/g, '');
}

function normalizeIndexUrl(value) {
    return normalizeString(value).replace(/\/+$/g, '');
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

function toPortablePath(filePath) {
    return normalizeString(filePath).replace(/\\/g, '/');
}

function fileExistsUnder(rootDir, relativePath) {
    const target = path.join(rootDir, ...toPortablePath(relativePath).split('/').filter(Boolean));
    return pathExists(target);
}

function findFilesRecursive(rootDir, predicate, { maxFiles = 50000 } = {}) {
    const matches = [];
    if (!isDirectory(rootDir)) {
        return matches;
    }
    const stack = [rootDir];
    let visited = 0;
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
            if (predicate(entryPath, entry)) {
                matches.push(entryPath);
            }
            if (visited >= maxFiles) {
                break;
            }
        }
    }
    return matches;
}

function checkRequiredGroups(rootDir, groups = []) {
    const present = [];
    const missing = [];
    if (!isDirectory(rootDir)) {
        return {
            ok: false,
            rootDir,
            present,
            missing: groups.map((group) => ({
                id: group.id,
                label: group.label,
                anyOf: group.anyOf
            }))
        };
    }

    for (const group of groups) {
        const found = (group.anyOf || []).find((candidate) => fileExistsUnder(rootDir, candidate));
        if (found) {
            present.push({
                id: group.id,
                label: group.label,
                path: found
            });
        } else {
            missing.push({
                id: group.id,
                label: group.label,
                anyOf: group.anyOf || []
            });
        }
    }

    return {
        ok: missing.length === 0,
        rootDir,
        present,
        missing
    };
}

function findIncompleteFiles(rootDir) {
    return findFilesRecursive(rootDir, (filePath) => /\.incomplete$/i.test(filePath), { maxFiles: 20000 });
}

function getHfCacheRepoDir(cacheDir, modelId) {
    const repoName = `models--${normalizeString(modelId).replace(/[\\/]/g, '--')}`;
    return path.join(cacheDir, repoName);
}

function getHfSnapshotDirs(cacheDir, modelId) {
    const roots = [
        cacheDir,
        path.join(cacheDir, 'hub'),
        path.join(cacheDir, 'transformers')
    ];
    const dirs = [];
    const seen = new Set();
    for (const root of roots) {
        const repoDir = getHfCacheRepoDir(root, modelId);
        const snapshotsDir = path.join(repoDir, 'snapshots');
        if (!isDirectory(snapshotsDir)) {
            continue;
        }
        let entries = [];
        try {
            entries = fs.readdirSync(snapshotsDir, { withFileTypes: true });
        } catch {
            continue;
        }
        for (const entry of entries) {
            if (!entry.isDirectory()) {
                continue;
            }
            const snapshotDir = path.join(snapshotsDir, entry.name);
            const key = path.resolve(snapshotDir).toLowerCase();
            if (!seen.has(key)) {
                seen.add(key);
                dirs.push(snapshotDir);
            }
        }
    }
    return dirs;
}

function summarizeRequirementCheck(check) {
    return (check.missing || [])
        .map((item) => `${item.label || item.id}(${(item.anyOf || []).join(' 或 ')})`)
        .join('；');
}

function summarizeCommandFailure(result, fallbackMessage) {
    const rawLines = `${result?.stderr || ''}\n${result?.stdout || ''}\n${result?.error || ''}`
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);
    const signalLines = rawLines.filter((line) =>
        !/^Fetching\s+\d+\s+files:/i.test(line) &&
        !/^warnings\.warn/i.test(line) &&
        !/UserWarning:/i.test(line) &&
        !/resume_download.*deprecated/i.test(line) &&
        !/HF Hub.*symlinks/i.test(line) &&
        !/unauthenticated requests to the HF Hub/i.test(line)
    );
    const tail = (signalLines.length ? signalLines : rawLines).slice(-8).join('\n');
    return tail || fallbackMessage;
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
info = {"python": sys.executable, "version": sys.version.split()[0], "version_info": list(sys.version_info[:3])}
for name in ["pip", "numpy", "torch", "torchaudio", "transformers", "onnxruntime", "vllm", "tensorrt", "modelscope", "huggingface_hub", "funasr"]:
    info["has_" + name] = importlib.util.find_spec(name) is not None
info["has_venv"] = importlib.util.find_spec("venv") is not None
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

function checkAsrModelCache(cacheDir, modelId = DEFAULT_ASR_MODEL_ID) {
    const snapshots = getHfSnapshotDirs(cacheDir, modelId);
    const incompleteFiles = findIncompleteFiles(cacheDir);
    const checks = snapshots.map((snapshotDir) => ({
        snapshotDir,
        ...checkRequiredGroups(snapshotDir, ASR_MODEL_REQUIRED_GROUPS)
    }));
    const usable = checks.find((check) => check.ok) || null;
    return {
        ok: Boolean(usable),
        cacheDir,
        modelId,
        snapshotDir: usable?.snapshotDir || '',
        snapshots: checks,
        missing: usable ? [] : (checks[0]?.missing || ASR_MODEL_REQUIRED_GROUPS),
        incompleteFileCount: incompleteFiles.length,
        incompleteFiles: incompleteFiles.slice(0, 12)
    };
}

function hasAsrModel(cacheDir, modelId = DEFAULT_ASR_MODEL_ID) {
    return checkAsrModelCache(cacheDir, modelId).ok;
}

function checkCosyVoiceSource(rootDir) {
    const check = checkRequiredGroups(rootDir, COSYVOICE_SOURCE_REQUIRED_GROUPS);
    const incompleteFiles = findIncompleteFiles(rootDir);
    return {
        ...check,
        incompleteFileCount: incompleteFiles.length,
        incompleteFiles: incompleteFiles.slice(0, 12)
    };
}

function checkCosyVoice3ModelDir(modelDir) {
    const check = checkRequiredGroups(modelDir, COSYVOICE3_MODEL_REQUIRED_GROUPS);
    const incompleteFiles = findIncompleteFiles(modelDir);
    return {
        ...check,
        incompleteFileCount: incompleteFiles.length,
        incompleteFiles: incompleteFiles.slice(0, 12)
    };
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
    optional = false,
    componentId = '',
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
        optional,
        componentId,
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
        runtimeRoot,
        platform = process.platform
    } = {}) {
        this.projectRoot = path.resolve(projectRoot || path.join(__dirname, '..'));
        this.userDataPath = path.resolve(userDataPath || path.join(this.projectRoot, '.local', 'user-data'));
        this.appDataPath = path.resolve(appDataPath || path.dirname(this.userDataPath));
        this.runtimeRoot = normalizeString(runtimeRoot) ? path.resolve(runtimeRoot) : '';
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
        const configuredRuntimeRoot = normalizeString(process.env.AILIS_VOICE_RUNTIME_ROOT) || this.runtimeRoot;
        const runtimeRootConfigured = Boolean(configuredRuntimeRoot);
        const localRuntimeRoot = runtimeRootConfigured
            ? path.resolve(configuredRuntimeRoot)
            : path.join(this.userDataPath, 'local-runtimes');
        const downloadCacheDir = path.join(localRuntimeRoot, 'downloads');
        const pipCacheDir = path.join(localRuntimeRoot, 'pip-cache');
        const manifestPath = path.join(localRuntimeRoot, VOICE_RUNTIME_MANIFEST_FILENAME);
        const uvRoot = path.join(localRuntimeRoot, 'uv');
        const uvBin = path.join(uvRoot, getExecutableName('uv', this.platform));
        const uvCacheDir = path.join(localRuntimeRoot, 'uv-cache');
        const pythonInstallDir = path.join(localRuntimeRoot, 'python');
        const voiceVenv = path.join(localRuntimeRoot, 'voice-venv');
        const voiceVenvPython = getVenvPythonPath(voiceVenv, this.platform);

        const projectCosyVoiceRoot = path.join(buildCacheRoot, 'CosyVoice');
        const localCosyVoiceRoot = path.join(localRuntimeRoot, 'CosyVoice');
        const cosyVoiceRoot = normalizeString(process.env.AILIS_COSYVOICE_ROOT) ||
            (runtimeRootConfigured
                ? localCosyVoiceRoot
                : (isDirectory(projectCosyVoiceRoot) ? projectCosyVoiceRoot : localCosyVoiceRoot));
        const cosyVoice3ModelDir = normalizeString(process.env.AILIS_COSYVOICE3_MODEL_DIR) ||
            path.join(cosyVoiceRoot, 'pretrained_models', DEFAULT_COSYVOICE3_MODEL_DIRNAME);

        const cosyVoice3Venv = path.join(buildCacheRoot, 'cosyvoice3-venv');
        const cosyVoice3VenvPython = getVenvPythonPath(cosyVoice3Venv, this.platform);
        const asrCacheDir = normalizeString(process.env.AILIS_ASR_CACHE_DIR) ||
            (runtimeRootConfigured
                ? path.join(localRuntimeRoot, 'asr-cache')
                : path.join(this.userDataPath, 'asr-cache'));
        const packagedAsrRuntime = this.getPackagedAsrRuntimeInfo();

        return {
            projectRoot: this.projectRoot,
            userDataPath: this.userDataPath,
            appDataPath: this.appDataPath,
            buildCacheRoot,
            runtimeRootConfigured,
            localRuntimeRoot,
            downloadCacheDir,
            pipCacheDir,
            manifestPath,
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

    createRuntimeManifest(paths = this.getPaths()) {
        return {
            schema: 'ailis.voiceRuntimeManifest',
            installerVersion: VOICE_RUNTIME_INSTALLER_VERSION,
            runtimeRoot: paths.localRuntimeRoot,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            components: {}
        };
    }

    readRuntimeManifest(paths = this.getPaths()) {
        const manifest = readJsonFile(paths.manifestPath) || this.createRuntimeManifest(paths);
        return {
            ...manifest,
            installerVersion: Number(manifest.installerVersion || 1),
            runtimeRoot: manifest.runtimeRoot || paths.localRuntimeRoot,
            components: manifest.components && typeof manifest.components === 'object'
                ? manifest.components
                : {}
        };
    }

    async writeRuntimeManifest(paths = this.getPaths(), manifest = {}) {
        const nextManifest = {
            ...this.createRuntimeManifest(paths),
            ...(manifest || {}),
            schema: 'ailis.voiceRuntimeManifest',
            installerVersion: VOICE_RUNTIME_INSTALLER_VERSION,
            runtimeRoot: paths.localRuntimeRoot,
            updatedAt: new Date().toISOString(),
            components: manifest.components && typeof manifest.components === 'object'
                ? manifest.components
                : {}
        };
        await fsp.mkdir(path.dirname(paths.manifestPath), { recursive: true });
        await fsp.writeFile(paths.manifestPath, JSON.stringify(nextManifest, null, 2), 'utf8');
        return nextManifest;
    }

    async updateRuntimeComponent(paths = this.getPaths(), componentId, patch = {}) {
        const manifest = this.readRuntimeManifest(paths);
        const previous = manifest.components?.[componentId] || {};
        const nextComponent = {
            ...previous,
            ...patch,
            id: componentId,
            updatedAt: new Date().toISOString()
        };
        return this.writeRuntimeManifest(paths, {
            ...manifest,
            components: {
                ...(manifest.components || {}),
                [componentId]: nextComponent
            }
        });
    }

    buildRuntimeComponents({ paths, manifest, selectedPython, selectedAsrPython, cosySourceCheck, cosyModelCheck, asrModelCheck }) {
        const details = selectedPython?.details || {};
        const asrDetails = selectedAsrPython?.details || {};
        const manifestVoicePython = normalizeRelativePath(paths.localRuntimeRoot, manifest.voicePython || manifest.python || '');
        const privatePythonReady = pathExists(paths.voiceVenvPython) ||
            pathExists(manifestVoicePython) ||
            (!paths.runtimeRootConfigured && pathExists(paths.cosyVoice3VenvPython));
        const voicePackagesReady = Boolean(
            details.has_pip &&
            details.has_torch &&
            details.has_torchaudio &&
            details.has_transformers &&
            details.has_huggingface_hub
        );
        const ttsSmoke = manifest.components?.cosyvoice3_smoke || {};
        const asrSmoke = manifest.components?.asr_smoke || {};
        const ttsSmokeVerified = ttsSmoke.status === 'verified' &&
            ttsSmoke.modelDir === paths.cosyVoice3ModelDir &&
            ttsSmoke.sourceDir === paths.cosyVoiceRoot;
        const asrSmokeVerified = asrSmoke.status === 'verified' &&
            asrSmoke.modelId === (asrModelCheck.modelId || DEFAULT_ASR_MODEL_ID) &&
            asrSmoke.cacheDir === asrModelCheck.cacheDir;

        return {
            python: {
                id: 'python',
                title: 'AILIS 私有 Python',
                requiredFor: ['tts', 'asr'],
                ok: Boolean(privatePythonReady && selectedPython?.ok !== false),
                status: privatePythonReady ? 'ready' : 'missing',
                detail: privatePythonReady ? '私有 Python venv 已存在' : '需要创建私有 Python venv'
            },
            voice_packages: {
                id: 'voice_packages',
                title: '语音 Python 依赖',
                requiredFor: ['tts', 'asr'],
                ok: voicePackagesReady,
                status: voicePackagesReady ? 'ready' : 'missing',
                detail: voicePackagesReady ? 'torch/torchaudio/transformers 已可用' : '缺少语音运行依赖'
            },
            cosyvoice_source: {
                id: 'cosyvoice_source',
                title: 'CosyVoice 源码',
                requiredFor: ['tts'],
                ok: cosySourceCheck.ok,
                status: cosySourceCheck.ok ? 'ready' : 'missing',
                detail: cosySourceCheck.ok ? '源码完整' : summarizeRequirementCheck(cosySourceCheck),
                check: cosySourceCheck
            },
            cosyvoice3_model: {
                id: 'cosyvoice3_model',
                title: 'CosyVoice3 模型',
                requiredFor: ['tts'],
                ok: cosyModelCheck.ok,
                status: cosyModelCheck.ok ? 'ready' : 'incomplete',
                detail: cosyModelCheck.ok ? '必需模型文件完整' : summarizeRequirementCheck(cosyModelCheck),
                check: cosyModelCheck
            },
            cosyvoice3_smoke: {
                id: 'cosyvoice3_smoke',
                title: 'CosyVoice3 真实验证',
                requiredFor: ['tts'],
                ok: Boolean(ttsSmokeVerified),
                status: ttsSmokeVerified ? 'verified' : 'pending',
                detail: ttsSmokeVerified ? '已完成本地合成预热验证' : '需要真实加载模型并合成短音频'
            },
            asr_model: {
                id: 'asr_model',
                title: '本地 ASR 模型',
                requiredFor: ['asr'],
                optional: true,
                ok: asrModelCheck.ok,
                status: asrModelCheck.ok ? 'ready' : 'missing',
                detail: asrModelCheck.ok ? 'ASR 最小模型文件完整' : summarizeRequirementCheck(asrModelCheck),
                check: asrModelCheck
            },
            asr_smoke: {
                id: 'asr_smoke',
                title: 'ASR 真实验证',
                requiredFor: ['asr'],
                optional: true,
                ok: Boolean(asrSmokeVerified && asrDetails.has_torch && asrDetails.has_transformers),
                status: asrSmokeVerified ? 'verified' : 'pending',
                detail: asrSmokeVerified ? '已完成本地 ASR 模型加载验证' : '需要真实加载 ASR 模型'
            }
        };
    }

    findPythonCandidates(paths = this.getPaths()) {
        const voiceRuntimeManifest = this.readRuntimeManifest(paths);
        const packagedVoicePython = normalizeRelativePath(
            paths.localRuntimeRoot,
            voiceRuntimeManifest.voicePython || voiceRuntimeManifest.python || ''
        );
        const packagedVoiceEnv = buildRuntimeEnv(paths.localRuntimeRoot, voiceRuntimeManifest);
        const candidates = [
            { source: 'AILIS_COSYVOICE3_PYTHON', command: normalizeString(process.env.AILIS_COSYVOICE3_PYTHON), args: [] },
            { source: 'AILIS_VOICE_PYTHON', command: normalizeString(process.env.AILIS_VOICE_PYTHON), args: [] },
            { source: 'AILIS_ASR_PYTHON', command: normalizeString(process.env.AILIS_ASR_PYTHON), args: [] },
            { source: 'AILIS_PYTHON', command: normalizeString(process.env.AILIS_PYTHON), args: [] },
            { source: 'packaged-voice-runtime', command: packagedVoicePython, args: [], env: packagedVoiceEnv },
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
            'packaged-voice-runtime',
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
            'packaged-voice-runtime',
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

    canSeedPrivateVenvFromPython(candidate = null) {
        if (!candidate || candidate.ok === false || !candidate.command) {
            return false;
        }
        const privateSources = new Set([
            'packaged-asr-runtime',
            'packaged-voice-runtime',
            'voice-venv',
            'cosyvoice3-venv'
        ]);
        if (privateSources.has(candidate.source)) {
            return false;
        }
        const details = candidate.details || {};
        if (details.has_venv === false) {
            return false;
        }
        const versionInfo = Array.isArray(details.version_info)
            ? details.version_info.map((part) => Number(part))
            : [];
        if (versionInfo.length >= 2 && Number.isFinite(versionInfo[0]) && Number.isFinite(versionInfo[1])) {
            return versionInfo[0] > 3 || (versionInfo[0] === 3 && versionInfo[1] >= 10);
        }
        const versionText = String(details.version || candidate.version || '');
        const match = versionText.match(/(\d+)\.(\d+)/);
        if (!match) {
            return true;
        }
        const major = Number(match[1]);
        const minor = Number(match[2]);
        return major > 3 || (major === 3 && minor >= 10);
    }

    getPrivateVenvSeedPython(snapshot = this.cachedSnapshot || {}) {
        const selected = snapshot.selectedPython;
        if (this.canSeedPrivateVenvFromPython(selected)) {
            return selected;
        }
        return null;
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
        const manifest = this.readRuntimeManifest(paths);
        const cosySourceCheck = checkCosyVoiceSource(paths.cosyVoiceRoot);
        const cosyModelCheck = checkCosyVoice3ModelDir(paths.cosyVoice3ModelDir);
        const cosyModelSizeBytes = directorySizeBytes(paths.cosyVoice3ModelDir, { maxFiles: 40000 });
        const resolvedAsrCacheDir = this.resolveAsrCacheDir(paths);
        const asrModelId = normalizeString(process.env.AILIS_ASR_MODEL_ID) || DEFAULT_ASR_MODEL_ID;
        const asrModelCheck = checkAsrModelCache(resolvedAsrCacheDir, asrModelId);
        const asrCacheSizeBytes = directorySizeBytes(resolvedAsrCacheDir, { maxFiles: 40000 });
        const components = this.buildRuntimeComponents({
            paths,
            manifest,
            selectedPython: bestPython,
            selectedAsrPython: bestAsrPython,
            cosySourceCheck,
            cosyModelCheck,
            asrModelCheck
        });
        const ttsReady = Boolean(
            components.python.ok &&
            components.voice_packages.ok &&
            components.cosyvoice_source.ok &&
            components.cosyvoice3_model.ok &&
            components.cosyvoice3_smoke.ok
        );
        const asrReady = Boolean(
            components.python.ok &&
            components.voice_packages.ok &&
            components.asr_model.ok &&
            components.asr_smoke.ok
        );

        const cosyVoice3 = {
            ok: ttsReady,
            playable: ttsReady,
            sourceExists: cosySourceCheck.ok,
            sourceDirExists: isDirectory(paths.cosyVoiceRoot),
            sourceCheck: cosySourceCheck,
            modelExists: cosyModelCheck.ok,
            modelDirExists: isDirectory(paths.cosyVoice3ModelDir),
            modelCheck: cosyModelCheck,
            smokeVerified: components.cosyvoice3_smoke.ok,
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
            ok: asrReady,
            cacheDir: resolvedAsrCacheDir,
            modelId: asrModelId,
            modelCached: asrModelCheck.ok,
            modelCheck: asrModelCheck,
            smokeVerified: components.asr_smoke.ok,
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
            ok: Boolean(cosyVoice3.ok),
            generatedAt: new Date().toISOString(),
            durationMs: Date.now() - startedAt,
            installerVersion: VOICE_RUNTIME_INSTALLER_VERSION,
            platform: {
                os: this.platform,
                arch: process.arch,
                release: os.release(),
                cpus: os.cpus()?.length || 0,
                totalMemoryBytes: os.totalmem(),
                totalMemoryText: formatBytes(os.totalmem())
            },
            paths,
            manifest,
            components,
            capabilities: {
                tts: {
                    ok: Boolean(cosyVoice3.ok),
                    provider: 'cosyvoice3'
                },
                asr: {
                    ok: Boolean(asr.ok),
                    optional: true,
                    provider: 'whisper'
                }
            },
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
        const components = snapshot.components || {};
        const selectedPython = snapshot.selectedPython;
        const details = selectedPython?.details || {};
        const privatePythonReady = components.python?.ok ?? (
            pathExists(paths.voiceVenvPython) ||
            (!paths.runtimeRootConfigured && pathExists(paths.cosyVoice3VenvPython))
        );
        const venvSeedPython = this.getPrivateVenvSeedPython(snapshot);
        const voiceDependenciesReady = components.voice_packages?.ok ?? Boolean(
            details.has_pip &&
            details.has_torch &&
            details.has_torchaudio &&
            details.has_transformers &&
            details.has_huggingface_hub
        );
        const steps = [];

        if (!selectedPython || !privatePythonReady) {
            steps.push(buildStep({
                id: 'install_portable_python',
                title: venvSeedPython ? '创建 AILIS 私有 Python venv' : '安装 AILIS 私有 Python runtime',
                reason: venvSeedPython
                    ? `检测到可用 Python（${venvSeedPython.command}），将用它创建 AILIS 私有语音 venv，不下载 portable Python。`
                    : selectedPython
                        ? '检测到 Python，但它不能稳定创建 venv；需要下载 AILIS 私有 portable Python。'
                        : '未检测到可用 Python。产品不应要求用户手动安装系统 Python。',
                category: 'python',
                automatic: true,
                requiresNetwork: !venvSeedPython,
                mutatesSystem: false,
                componentId: 'python',
                estimatedSize: venvSeedPython ? '通常小于 50 MB（不含后续依赖）' : '约 100-250 MB',
                command: {
                    tool: venvSeedPython ? venvSeedPython.command : 'uv',
                    args: venvSeedPython
                        ? [...(venvSeedPython.args || []), '-m', 'venv', '--clear', paths.voiceVenv]
                        : ['venv', paths.voiceVenv, '--python', DEFAULT_VOICE_PYTHON_VERSION, '--seed']
                },
                notes: [
                    `目标目录：${paths.voiceVenv}`,
                    venvSeedPython
                        ? '优先复用本机 Python 创建隔离 venv，不写入系统 PATH，也不修改系统 Python。'
                        : '通过 uv managed Python 创建私有 venv，不写入系统 PATH。',
                    venvSeedPython
                        ? '只有完全没有可用 Python 时，才会下载 portable Python。'
                        : 'uv 本身也会安装到当前语音运行时目录。'
                ]
            }));
        }

        if (!privatePythonReady || !voiceDependenciesReady) {
            steps.push(buildStep({
                id: 'install_voice_python_packages',
                title: '安装语音运行所需 Python 包',
                reason: privatePythonReady
                    ? '缺少 pip/torch/torchaudio/transformers/huggingface_hub 等本地语音运行依赖。'
                    : '将创建新的 AILIS 私有语音 venv，需要把 torch/torchaudio/transformers/huggingface_hub 等依赖安装进去。',
                category: 'python-packages',
                automatic: true,
                requiresNetwork: true,
                mutatesSystem: false,
                componentId: 'voice_packages',
                estimatedSize: '约 2-6 GB，取决于 CUDA/CPU wheel',
                command: {
                    tool: 'python',
                    args: [
                        '-m',
                        'pip',
                        'install',
                        '--upgrade',
                        '--prefer-binary',
                        '--timeout',
                        '120',
                        '--retries',
                        '10',
                        '--cache-dir',
                        paths.pipCacheDir,
                        ...BASE_VOICE_PACKAGES
                    ]
                },
                notes: [
                    '安装到 AILIS 私有 voice-venv，而不是系统 Python。',
                    'pip 会优先尝试清华/阿里/南大/中科大镜像，失败后自动换源，最后才回退 PyPI 官方源。',
                    '下载的大 wheel 会进入 AILIS pip-cache，后续重试可以复用缓存，避免每次从头下载。'
                ]
            }));
        }

        if (!(components.cosyvoice_source?.ok ?? snapshot.cosyVoice3?.sourceExists)) {
            steps.push(buildStep({
                id: 'install_cosyvoice_source',
                title: '安装 CosyVoice3 源码运行时',
                reason: '缺少 CosyVoice 源码目录，CosyVoice3 worker 无法启动。',
                category: 'cosyvoice3',
                automatic: true,
                requiresNetwork: true,
                mutatesSystem: false,
                componentId: 'cosyvoice_source',
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

        if (!(components.cosyvoice3_model?.ok ?? snapshot.cosyVoice3?.modelExists)) {
            steps.push(buildStep({
                id: 'install_cosyvoice3_model',
                title: '安装 CosyVoice3 本地模型',
                reason: '缺少 Fun-CosyVoice3-0.5B 模型目录。',
                category: 'cosyvoice3-model',
                automatic: true,
                requiresNetwork: true,
                mutatesSystem: false,
                componentId: 'cosyvoice3_model',
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

        const canVerifyTts = Boolean(
            (components.python?.ok ?? privatePythonReady) &&
            (components.voice_packages?.ok ?? voiceDependenciesReady) &&
            (components.cosyvoice_source?.ok ?? snapshot.cosyVoice3?.sourceExists) &&
            (components.cosyvoice3_model?.ok ?? snapshot.cosyVoice3?.modelExists)
        );
        if (canVerifyTts && !(components.cosyvoice3_smoke?.ok ?? snapshot.cosyVoice3?.smokeVerified)) {
            steps.push(buildStep({
                id: 'verify_cosyvoice3_runtime',
                title: '验证 CosyVoice3 本地合成',
                reason: '模型文件存在后，需要真实加载模型并合成短音频，避免目录存在但运行失败。',
                category: 'verification',
                automatic: true,
                requiresNetwork: false,
                mutatesSystem: false,
                componentId: 'cosyvoice3_smoke',
                estimatedSize: '无需下载',
                command: {
                    tool: 'python',
                    args: ['electron/cosyvoice3_tts_worker.py', 'warmup']
                },
                notes: [
                    '这一步会真实加载 CosyVoice3 模型；首次可能较慢，但通过后会写入 manifest。',
                    '未通过时不会假装语音已就绪。'
                ]
            }));
        }

        if (!(components.asr_model?.ok ?? snapshot.asr?.modelCached)) {
            steps.push(buildStep({
                id: 'install_asr_model',
                title: '安装本地 ASR 模型',
                reason: '缺少本地 Whisper/SenseVoice ASR 模型缓存。',
                category: 'asr-model',
                automatic: true,
                requiresNetwork: true,
                mutatesSystem: false,
                optional: true,
                componentId: 'asr_model',
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
                optional: true,
                estimatedSize: '约 200-500 MB',
                command: {
                    tool: 'python',
                    args: [
                        '-m',
                        'pip',
                        'install',
                        '--upgrade',
                        '--prefer-binary',
                        '--timeout',
                        '120',
                        '--retries',
                        '10',
                        '--cache-dir',
                        paths.pipCacheDir,
                        'onnxruntime-gpu'
                    ]
                },
                notes: [
                    '需要匹配 CUDA/驱动版本；失败时应回退到 CPU provider，安装时同样使用镜像和本地 pip-cache。',
                    '这是性能优化，不应阻塞基本语音功能。'
                ]
            }));
        }

        const canVerifyAsr = Boolean(
            (components.python?.ok ?? privatePythonReady) &&
            (components.voice_packages?.ok ?? voiceDependenciesReady) &&
            (components.asr_model?.ok ?? snapshot.asr?.modelCached)
        );
        if (canVerifyAsr && !(components.asr_smoke?.ok ?? snapshot.asr?.smokeVerified)) {
            steps.push(buildStep({
                id: 'verify_asr_runtime',
                title: '验证本地 ASR 模型加载',
                reason: 'ASR 模型缓存存在后，需要真实加载一次，避免半下载缓存被误判成功。',
                category: 'verification',
                automatic: true,
                requiresNetwork: false,
                mutatesSystem: false,
                optional: true,
                componentId: 'asr_smoke',
                estimatedSize: '无需下载',
                command: {
                    tool: 'python',
                    args: ['electron/desktop_asr_worker.py', 'load-model']
                },
                notes: [
                    'ASR 是可选能力；验证失败不会阻塞 CosyVoice3 语音播放。'
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
        const manifest = this.readRuntimeManifest(paths);
        const manifestVoicePython = normalizeRelativePath(paths.localRuntimeRoot, manifest.voicePython || manifest.python || '');
        if (pathExists(manifestVoicePython)) {
            return manifestVoicePython;
        }
        if (pathExists(paths.voiceVenvPython)) {
            return paths.voiceVenvPython;
        }
        if (paths.runtimeRootConfigured) {
            return '';
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

    getUvPythonInstallMirrorCandidates() {
        const configured = [
            ...splitList(process.env.AILIS_UV_PYTHON_INSTALL_MIRRORS),
            ...splitList(process.env.AILIS_PYTHON_INSTALL_MIRRORS),
            normalizeString(process.env.AILIS_UV_PYTHON_INSTALL_MIRROR),
            normalizeString(process.env.UV_PYTHON_INSTALL_MIRROR)
        ].filter(Boolean);
        const seen = new Set();
        return [...configured, ...DEFAULT_UV_PYTHON_INSTALL_MIRRORS]
            .map((entry) => normalizeMirrorUrl(entry))
            .filter((entry) => {
                const key = entry || '<default>';
                if (seen.has(key)) {
                    return false;
                }
                seen.add(key);
                return true;
            });
    }

    getPipIndexUrlCandidates() {
        const explicit = [
            ...splitList(process.env.AILIS_PIP_INDEX_URLS),
            normalizeString(process.env.AILIS_PIP_INDEX_URL)
        ].filter(Boolean);
        const environment = [normalizeString(process.env.PIP_INDEX_URL)].filter(Boolean);
        const seen = new Set();
        return [...explicit, ...DEFAULT_PIP_INDEX_URLS, ...environment]
            .map((entry) => normalizeIndexUrl(entry))
            .filter((entry) => {
                const key = entry || '<default>';
                if (seen.has(key)) {
                    return false;
                }
                seen.add(key);
                return true;
            });
    }

    pipSupportsResumeRetries(python) {
        const result = runCommand(python, ['-m', 'pip', 'install', '--help'], {
            cwd: this.projectRoot,
            timeoutMs: 15000
        });
        return Boolean(result.ok && /--resume-retries/.test(`${result.stdout}\n${result.stderr}`));
    }

    buildPipInstallArgs({ paths = this.getPaths(), indexUrl = '', extraIndexUrls = [], packages = [], resumeRetries = false } = {}) {
        const normalizedExtraIndexUrls = extraIndexUrls
            .map((entry) => normalizeIndexUrl(entry))
            .filter(Boolean);
        const noBuildIsolation = packages.some((item) => /^openai-whisper(?:==|>=|<=|~=|$)/i.test(String(item || '').trim()));
        return [
            '-m',
            'pip',
            'install',
            '--upgrade',
            '--prefer-binary',
            ...(noBuildIsolation ? ['--no-build-isolation'] : []),
            '--disable-pip-version-check',
            '--progress-bar',
            'off',
            '--timeout',
            '120',
            '--retries',
            '10',
            ...(resumeRetries ? ['--resume-retries', '20'] : []),
            '--cache-dir',
            paths.pipCacheDir,
            ...(indexUrl ? ['--index-url', indexUrl] : []),
            ...normalizedExtraIndexUrls.flatMap((url) => ['--extra-index-url', url]),
            ...packages
        ];
    }

    async installPipPackages({ paths = this.getPaths(), python, packages = [], extraIndexUrls = [], description = 'Python packages', onOutput } = {}) {
        const installPython = normalizeString(python);
        if (!installPython) {
            throw new Error(`缺少 Python，无法安装 ${description}`);
        }
        await fsp.mkdir(paths.pipCacheDir, { recursive: true });
        const indexes = this.getPipIndexUrlCandidates();
        const resumeRetries = this.pipSupportsResumeRetries(installPython);
        let lastError = '';
        for (const indexUrl of indexes) {
            const sourceLabel = indexUrl || 'PyPI 官方源';
            onOutput?.({
                stream: 'stdout',
                text: `[AILIS runtime] installing ${description} from ${sourceLabel}\n`
            });
            const result = await runCommandAsync(installPython, this.buildPipInstallArgs({
                paths,
                indexUrl,
                extraIndexUrls,
                packages,
                resumeRetries
            }), {
                cwd: this.projectRoot,
                timeoutMs: INSTALL_TIMEOUT_MS,
                onOutput
            });
            if (result.ok) {
                return result;
            }
            lastError = [
                lastError,
                `[${sourceLabel}] ${result.stderr || result.error || `${description} 安装失败`}`
            ].filter(Boolean).join('\n');
            onOutput?.({
                stream: 'stderr',
                text: `[AILIS runtime] pip install failed from ${sourceLabel}; trying next source if available.\n`
            });
        }
        throw new Error(`${description} 安装失败，已尝试 ${indexes.length} 个 pip 源。\n${lastError}`);
    }

    getUvEnv(paths = this.getPaths(), options = {}) {
        const mirror = normalizeMirrorUrl(options.pythonInstallMirror);
        return {
            UV_CACHE_DIR: paths.uvCacheDir,
            UV_PYTHON_INSTALL_DIR: paths.pythonInstallDir,
            ...(mirror ? { UV_PYTHON_INSTALL_MIRROR: mirror } : {}),
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
        const seedPython = this.getPrivateVenvSeedPython();
        if (seedPython) {
            onOutput?.({
                stream: 'stdout',
                text: `[AILIS runtime] creating voice venv with existing Python: ${seedPython.command}\n`
            });
            const venv = await runCommandAsync(seedPython.command, [
                ...(seedPython.args || []),
                '-m',
                'venv',
                '--clear',
                paths.voiceVenv
            ], {
                cwd: this.projectRoot,
                timeoutMs: INSTALL_TIMEOUT_MS,
                onOutput
            });
            if (venv.ok && isFile(paths.voiceVenvPython)) {
                await this.installPipPackages({
                    paths,
                    python: paths.voiceVenvPython,
                    packages: ['pip', 'setuptools<81', 'wheel'],
                    description: 'pip bootstrap packages',
                    onOutput
                });
                return paths.voiceVenvPython;
            }
            onOutput?.({
                stream: 'stderr',
                text: `[AILIS runtime] existing Python venv creation failed; falling back to uv managed Python.\n${venv.stderr || venv.error || ''}\n`
            });
        }

        const uv = await this.ensureUv({ paths, onOutput });
        const mirrors = this.getUvPythonInstallMirrorCandidates();
        let env = this.getUvEnv(paths);
        let lastPythonInstallError = '';
        for (const mirror of mirrors) {
            const sourceLabel = mirror || 'uv 默认源（GitHub）';
            const attemptEnv = this.getUvEnv(paths, { pythonInstallMirror: mirror });
            const args = [
                'python',
                'install',
                '--install-dir',
                paths.pythonInstallDir,
                ...(mirror ? ['--mirror', mirror] : []),
                DEFAULT_VOICE_PYTHON_VERSION
            ];
            onOutput?.({
                stream: 'stdout',
                text: `[AILIS runtime] installing managed Python from ${sourceLabel}\n`
            });
            const pythonInstall = await runCommandAsync(uv, args, {
                cwd: this.projectRoot,
                env: attemptEnv,
                timeoutMs: INSTALL_TIMEOUT_MS,
                onOutput
            });
            if (pythonInstall.ok) {
                env = attemptEnv;
                lastPythonInstallError = '';
                break;
            }
            lastPythonInstallError = [
                lastPythonInstallError,
                `[${sourceLabel}] ${pythonInstall.stderr || pythonInstall.error || 'AILIS 私有 Python 下载/安装失败'}`
            ].filter(Boolean).join('\n');
            onOutput?.({
                stream: 'stderr',
                text: `[AILIS runtime] managed Python install failed from ${sourceLabel}; trying next source if available.\n`
            });
        }
        if (lastPythonInstallError) {
            throw new Error(`AILIS 私有 Python 下载/安装失败，已尝试 ${mirrors.length} 个源。\n${lastPythonInstallError}`);
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

        await this.installPipPackages({
            paths,
            python: paths.voiceVenvPython,
            packages: ['pip', 'setuptools<81', 'wheel'],
            description: 'pip bootstrap packages',
            onOutput
        });
        return paths.voiceVenvPython;
    }

    async getInstallPython({ paths = this.getPaths(), onOutput } = {}) {
        if (isFile(paths.voiceVenvPython)) {
            return paths.voiceVenvPython;
        }
        if (!paths.runtimeRootConfigured && isFile(paths.cosyVoice3VenvPython)) {
            return paths.cosyVoice3VenvPython;
        }
        return this.installPrivatePython({ paths, onOutput });
    }

    async installVoicePackages({ paths = this.getPaths(), onOutput } = {}) {
        const python = await this.getInstallPython({ paths, onOutput });
        return this.installPipPackages({
            paths,
            python,
            packages: BASE_VOICE_PACKAGES,
            extraIndexUrls: DEFAULT_VOICE_PIP_EXTRA_INDEX_URLS,
            description: 'voice runtime Python packages',
            onOutput
        });
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
            'import os',
            'os.environ.setdefault("HF_HUB_DISABLE_SYMLINKS_WARNING", "1")',
            'from huggingface_hub import snapshot_download',
            `snapshot_download(${JSON.stringify(repoId)}, local_dir=${JSON.stringify(paths.cosyVoice3ModelDir)}, local_dir_use_symlinks=False, allow_patterns=${JSON.stringify(COSYVOICE3_MODEL_ALLOW_PATTERNS)}, max_workers=4)`
        ].join('\n');
        const result = await runCommandAsync(python, ['-c', code], {
            cwd: this.projectRoot,
            timeoutMs: INSTALL_TIMEOUT_MS,
            onOutput,
            env: {
                HF_HUB_DISABLE_SYMLINKS_WARNING: '1'
            }
        });
        if (!result.ok) {
            throw new Error(summarizeCommandFailure(result, 'CosyVoice3 模型下载失败'));
        }
        const check = checkCosyVoice3ModelDir(paths.cosyVoice3ModelDir);
        if (!check.ok) {
            throw new Error(`CosyVoice3 模型下载后仍不完整：${summarizeRequirementCheck(check)}`);
        }
        return result;
    }

    async installAsrModel({ paths = this.getPaths(), onOutput } = {}) {
        const python = await this.getInstallPython({ paths, onOutput });
        await fsp.mkdir(paths.asrCacheDir, { recursive: true });
        const modelId = normalizeString(process.env.AILIS_ASR_MODEL_ID) || DEFAULT_ASR_MODEL_ID;
        const code = [
            'import os',
            'os.environ.setdefault("HF_HUB_DISABLE_SYMLINKS_WARNING", "1")',
            'from huggingface_hub import snapshot_download',
            `snapshot_download(${JSON.stringify(modelId)}, cache_dir=${JSON.stringify(paths.asrCacheDir)}, allow_patterns=${JSON.stringify(ASR_MODEL_ALLOW_PATTERNS)}, ignore_patterns=${JSON.stringify(ASR_MODEL_IGNORE_PATTERNS)}, max_workers=4)`
        ].join('\n');
        const result = await runCommandAsync(python, ['-c', code], {
            cwd: this.projectRoot,
            timeoutMs: INSTALL_TIMEOUT_MS,
            onOutput,
            env: {
                HF_HUB_DISABLE_SYMLINKS_WARNING: '1'
            }
        });
        if (!result.ok) {
            throw new Error(summarizeCommandFailure(result, 'ASR 模型下载失败'));
        }
        const check = checkAsrModelCache(paths.asrCacheDir, modelId);
        if (!check.ok) {
            throw new Error(`ASR 模型下载后仍不完整：${summarizeRequirementCheck(check)}`);
        }
        return result;
    }

    async verifyCosyVoice3Runtime({ paths = this.getPaths(), onOutput } = {}) {
        const python = await this.getInstallPython({ paths, onOutput });
        const code = [
            'import importlib.util, json, os',
            `worker_path = ${JSON.stringify(path.join(this.projectRoot, 'electron', 'cosyvoice3_tts_worker.py'))}`,
            'spec = importlib.util.spec_from_file_location("ailis_cosyvoice3_tts_worker", worker_path)',
            'module = importlib.util.module_from_spec(spec)',
            'spec.loader.exec_module(module)',
            'result = module.warmup()',
            'print(json.dumps({"ok": True, "result": result}, ensure_ascii=False))'
        ].join('\n');
        const result = await runCommandAsync(python, ['-c', code], {
            cwd: this.projectRoot,
            timeoutMs: INSTALL_TIMEOUT_MS,
            onOutput,
            env: {
                AILIS_PROJECT_ROOT: this.projectRoot,
                AILIS_VOICE_RUNTIME_ROOT: paths.localRuntimeRoot,
                AILIS_COSYVOICE_ROOT: paths.cosyVoiceRoot,
                AILIS_COSYVOICE3_MODEL_DIR: paths.cosyVoice3ModelDir,
                AILIS_COSYVOICE3_LOCAL_ONLY: '1',
                AILIS_COSYVOICE3_DISABLE_REMOTE_TEXT_FRONTEND: '1',
                KMP_DUPLICATE_LIB_OK: 'TRUE',
                HF_HUB_OFFLINE: '1',
                TRANSFORMERS_OFFLINE: '1',
                HF_DATASETS_OFFLINE: '1',
                MODELSCOPE_OFFLINE: '1'
            }
        });
        if (!result.ok) {
            throw new Error(summarizeCommandFailure(result, 'CosyVoice3 真实验证失败'));
        }
        await this.updateRuntimeComponent(paths, 'cosyvoice3_smoke', {
            status: 'verified',
            modelDir: paths.cosyVoice3ModelDir,
            sourceDir: paths.cosyVoiceRoot,
            verifiedAt: new Date().toISOString(),
            durationMs: result.durationMs || 0
        });
        return result;
    }

    async verifyAsrRuntime({ paths = this.getPaths(), onOutput } = {}) {
        const python = await this.getInstallPython({ paths, onOutput });
        const modelId = normalizeString(process.env.AILIS_ASR_MODEL_ID) || DEFAULT_ASR_MODEL_ID;
        const cacheDir = this.resolveAsrCacheDir(paths);
        const code = [
            'import importlib.util, json',
            `worker_path = ${JSON.stringify(path.join(this.projectRoot, 'electron', 'desktop_asr_worker.py'))}`,
            'spec = importlib.util.spec_from_file_location("ailis_desktop_asr_worker", worker_path)',
            'module = importlib.util.module_from_spec(spec)',
            'spec.loader.exec_module(module)',
            'module.ensure_pipeline()',
            'print(json.dumps({"ok": True, "model": module.MODEL_ID}, ensure_ascii=False))'
        ].join('\n');
        const result = await runCommandAsync(python, ['-c', code], {
            cwd: this.projectRoot,
            timeoutMs: INSTALL_TIMEOUT_MS,
            onOutput,
            env: {
                AILIS_ASR_MODEL_ID: modelId,
                AILIS_ASR_CACHE_DIR: cacheDir,
                AILIS_ASR_LOCAL_ONLY: '1',
                HF_HUB_OFFLINE: '1',
                TRANSFORMERS_OFFLINE: '1',
                HF_DATASETS_OFFLINE: '1'
            }
        });
        if (!result.ok) {
            throw new Error(summarizeCommandFailure(result, 'ASR 真实验证失败'));
        }
        await this.updateRuntimeComponent(paths, 'asr_smoke', {
            status: 'verified',
            modelId,
            cacheDir,
            verifiedAt: new Date().toISOString(),
            durationMs: result.durationMs || 0
        });
        return result;
    }

    async installOnnxRuntimeGpu({ paths = this.getPaths(), onOutput } = {}) {
        const python = await this.getInstallPython({ paths, onOutput });
        return this.installPipPackages({
            paths,
            python,
            packages: ['onnxruntime-gpu'],
            description: 'ONNX Runtime GPU',
            onOutput
        });
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
            if (step.componentId) {
                await this.updateRuntimeComponent(paths, step.componentId, {
                    status: step.id.startsWith('verify_') ? 'verifying' : 'installing',
                    stepId: step.id,
                    title: step.title,
                    startedAt: stepRun.startedAt
                });
            }
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
            } else if (step.id === 'verify_cosyvoice3_runtime') {
                result = await this.verifyCosyVoice3Runtime({ paths, onOutput });
            } else if (step.id === 'verify_asr_runtime') {
                result = await this.verifyAsrRuntime({ paths, onOutput });
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
            if (step.componentId) {
                await this.updateRuntimeComponent(paths, step.componentId, {
                    status: step.id.startsWith('verify_') ? 'verified' : 'installed',
                    stepId: step.id,
                    title: step.title,
                    completedAt: new Date().toISOString(),
                    durationMs: result?.durationMs || undefined
                });
            }
        } catch (error) {
            stepRun.status = 'failed';
            stepRun.error = error?.message || String(error);
            stepRun.result = {
                ok: false,
                error: stepRun.error
            };
            if (step.componentId) {
                await this.updateRuntimeComponent(paths, step.componentId, {
                    status: 'failed',
                    stepId: step.id,
                    title: step.title,
                    failedAt: new Date().toISOString(),
                    error: stepRun.error
                });
            }
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
        const includeOptional = Boolean(options.includeOptional);
        const requestedStepIds = Array.isArray(options.stepIds)
            ? new Set(options.stepIds.map((id) => String(id || '').trim()).filter(Boolean))
            : null;
        const selectRunnableSteps = (currentSnapshot, completedStepIds = new Set()) =>
            (currentSnapshot.installPlan?.steps || []).filter((step) => {
                if (completedStepIds.has(step.id)) {
                    return false;
                }
                if (requestedStepIds) {
                    return requestedStepIds.has(step.id);
                }
                return includeOptional || !step.optional;
            });

        let snapshot = this.diagnose();
        let steps = selectRunnableSteps(snapshot);
        const completedStepIds = new Set();
        const isStepInScope = (step) => {
            if (requestedStepIds) {
                return requestedStepIds.has(step.id);
            }
            return includeOptional || !step.optional;
        };
        const run = {
            id: `voice-runtime-bootstrap-${Date.now()}`,
            ok: false,
            status: 'running',
            dryRun,
            allowNetwork,
            includeOptional,
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

            for (let pass = 0; pass < 6; pass += 1) {
                steps = selectRunnableSteps(snapshot, completedStepIds);
                if (!steps.length) {
                    break;
                }

                const blockedNetworkStep = steps.find((step) => step.requiresNetwork && !allowNetwork && !dryRun);
                if (blockedNetworkStep) {
                    run.status = 'blocked';
                    run.ok = false;
                    run.error = `安装步骤需要联网授权：${blockedNetworkStep.title}`;
                    return run;
                }

                for (const step of steps) {
                    try {
                        await this.runInstallStep(step, { run, dryRun });
                        completedStepIds.add(step.id);
                    } catch (error) {
                        if (!step.optional) {
                            throw error;
                        }
                        completedStepIds.add(step.id);
                        run.warnings = [
                            ...(run.warnings || []),
                            `${step.title} 未完成：${error?.message || error}`
                        ];
                    }
                }

                if (dryRun || requestedStepIds) {
                    break;
                }

                snapshot = this.diagnose();
                const nextRequiredSteps = (snapshot.installPlan?.steps || [])
                    .filter((step) => isStepInScope(step) && !completedStepIds.has(step.id));
                if (!nextRequiredSteps.length) {
                    break;
                }
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
        const manifest = this.readRuntimeManifest(paths);
        const cosySourceCheck = checkCosyVoiceSource(paths.cosyVoiceRoot);
        const cosyModelCheck = checkCosyVoice3ModelDir(paths.cosyVoice3ModelDir);
        const cosyModelSizeBytes = directorySizeBytes(paths.cosyVoice3ModelDir, { maxFiles: 4000 });
        const resolvedAsrCacheDir = this.resolveAsrCacheDir(paths);
        const asrModelId = normalizeString(process.env.AILIS_ASR_MODEL_ID) || DEFAULT_ASR_MODEL_ID;
        const asrModelCheck = checkAsrModelCache(resolvedAsrCacheDir, asrModelId);
        const asrCacheSizeBytes = directorySizeBytes(resolvedAsrCacheDir, { maxFiles: 4000 });
        const cachedAcceleration = this.cachedSnapshot?.cosyVoice3?.acceleration;
        const cachedDependencies = this.cachedSnapshot?.asr?.dependencies;
        const fastPython = preferredPython
            ? {
                ok: true,
                source: 'fast-path',
                command: preferredPython,
                args: [],
                details: {
                    has_pip: true,
                    has_torch: true,
                    has_torchaudio: true,
                    has_transformers: true,
                    has_huggingface_hub: true
                }
            }
            : null;
        const fastAsrPython = preferredAsrPython
            ? {
                ok: true,
                source: 'fast-asr-path',
                command: preferredAsrPython,
                args: [],
                details: {
                    has_pip: true,
                    has_torch: true,
                    has_torchaudio: true,
                    has_transformers: true,
                    has_huggingface_hub: true
                }
            }
            : fastPython;
        const components = this.buildRuntimeComponents({
            paths,
            manifest,
            selectedPython: fastPython,
            selectedAsrPython: fastAsrPython,
            cosySourceCheck,
            cosyModelCheck,
            asrModelCheck
        });
        const ttsReady = Boolean(
            components.python.ok &&
            components.voice_packages.ok &&
            components.cosyvoice_source.ok &&
            components.cosyvoice3_model.ok &&
            components.cosyvoice3_smoke.ok
        );
        const asrReady = Boolean(
            components.python.ok &&
            components.voice_packages.ok &&
            components.asr_model.ok &&
            components.asr_smoke.ok
        );
        const cosyVoice3 = {
            ok: ttsReady,
            playable: ttsReady,
            sourceExists: cosySourceCheck.ok,
            sourceDirExists: isDirectory(paths.cosyVoiceRoot),
            sourceCheck: cosySourceCheck,
            modelExists: cosyModelCheck.ok,
            modelDirExists: isDirectory(paths.cosyVoice3ModelDir),
            modelCheck: cosyModelCheck,
            smokeVerified: components.cosyvoice3_smoke.ok,
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
            ok: asrReady,
            cacheDir: resolvedAsrCacheDir,
            modelId: asrModelId,
            modelCached: asrModelCheck.ok,
            modelCheck: asrModelCheck,
            smokeVerified: components.asr_smoke.ok,
            cacheSizeBytes: asrCacheSizeBytes,
            cacheSizeText: formatBytes(asrCacheSizeBytes),
            pythonCommand: preferredAsrPython,
            dependencies: cachedDependencies || {}
        };
        const snapshot = {
            ok: Boolean(cosyVoice3.ok),
            generatedAt: new Date().toISOString(),
            installerVersion: VOICE_RUNTIME_INSTALLER_VERSION,
            platform: {
                os: this.platform,
                arch: process.arch
            },
            paths,
            manifest,
            components,
            capabilities: {
                tts: {
                    ok: Boolean(cosyVoice3.ok),
                    provider: 'cosyvoice3'
                },
                asr: {
                    ok: Boolean(asr.ok),
                    optional: true,
                    provider: 'whisper'
                }
            },
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
                        has_transformers: true,
                        has_huggingface_hub: true
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
                        has_transformers: true,
                        has_huggingface_hub: true
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
            components: snapshot.components,
            capabilities: snapshot.capabilities,
            installerVersion: snapshot.installerVersion,
            preferredPython,
            preferredAsrPython,
            paths,
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
            installerVersion: this.cachedSnapshot.installerVersion || VOICE_RUNTIME_INSTALLER_VERSION,
            platform: this.cachedSnapshot.platform,
            paths: this.cachedSnapshot.paths,
            components: this.cachedSnapshot.components || {},
            capabilities: this.cachedSnapshot.capabilities || {
                tts: { ok: Boolean(this.cachedSnapshot.cosyVoice3?.ok), provider: 'cosyvoice3' },
                asr: { ok: Boolean(this.cachedSnapshot.asr?.ok), optional: true, provider: 'whisper' }
            },
            cosyVoice3: {
                ok: this.cachedSnapshot.cosyVoice3.ok,
                sourceExists: this.cachedSnapshot.cosyVoice3.sourceExists,
                modelExists: this.cachedSnapshot.cosyVoice3.modelExists,
                smokeVerified: this.cachedSnapshot.cosyVoice3.smokeVerified,
                acceleration: this.cachedSnapshot.cosyVoice3.acceleration
            },
            asr: {
                ok: this.cachedSnapshot.asr.ok,
                modelCached: this.cachedSnapshot.asr.modelCached,
                smokeVerified: this.cachedSnapshot.asr.smokeVerified,
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
