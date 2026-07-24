const { EventEmitter } = require('events');
const { spawn } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const DEFAULT_HOST = '127.0.0.1';
const DEFAULT_PORT = 11434;
const DEFAULT_MODEL = 'qwen2.5:1.5b';
const DEFAULT_READY_TIMEOUT_SEC = 1800;
const MAX_LOG_LINES = 180;
const MAX_LINE_LENGTH = 4000;
const MIN_LOCAL_IMPORT_OLLAMA_VERSION = '0.6.0';
const MIN_REMOTE_PULL_OLLAMA_VERSION = '0.6.0';
const MIN_NVIDIA_DRIVER_FOR_OLLAMA_GPU = '550.0';
const OLLAMA_TARGET_SOURCES = new Set(['installed', 'local_import', 'online_pull']);
const OLLAMA_TARGET_SOURCE_ALIASES = new Map([
    ['installed', 'installed'],
    ['existing', 'installed'],
    ['manual', 'installed'],
    ['local', 'local_import'],
    ['local_import', 'local_import'],
    ['local-import', 'local_import'],
    ['file', 'local_import'],
    ['online', 'online_pull'],
    ['online_pull', 'online_pull'],
    ['online-pull', 'online_pull'],
    ['remote', 'online_pull'],
    ['pull', 'online_pull']
]);
const SAFETENSORS_SUPPORTED_MODEL_TYPES = new Set([
    'llama',
    'mistral',
    'gemma',
    'gemma2',
    'gemma3',
    'phi3'
]);

function normalizeModelId(value = '') {
    return String(value || DEFAULT_MODEL).trim().slice(0, 200) || DEFAULT_MODEL;
}

function sanitizeModelName(value = '') {
    const normalized = String(value || '')
        .trim()
        .replace(/\\/g, '/')
        .split('/')
        .filter(Boolean)
        .pop() || 'local-model';
    return normalized
        .replace(/[_\s]+/g, '-')
        .replace(/[^a-zA-Z0-9:./-]+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
        .toLowerCase()
        .slice(0, 120) || 'local-model';
}

function inferLocalModelName(modelPath = '') {
    return `local-${sanitizeModelName(modelPath)}`.slice(0, 160);
}

function normalizeOllamaTargetSource(value = '') {
    const normalized = String(value || '').trim().toLowerCase();
    return OLLAMA_TARGET_SOURCE_ALIASES.get(normalized) || '';
}

function normalizeOllamaTarget(payload = {}) {
    const rawTarget = payload.target && typeof payload.target === 'object' ? payload.target : {};
    const legacySource = rawTarget.deploymentMode ||
        rawTarget.ollamaDeploymentMode ||
        payload.deploymentMode ||
        payload.ollamaDeploymentMode ||
        payload.mode;
    const requestedLocalPath = String(
        rawTarget.localPath ||
        rawTarget.localModelPath ||
        payload.localModelPath ||
        payload.modelPath ||
        ''
    ).trim();
    let source = normalizeOllamaTargetSource(rawTarget.source || payload.source || legacySource);
    if (!source) {
        source = requestedLocalPath ? 'local_import' : 'installed';
    }
    if (!OLLAMA_TARGET_SOURCES.has(source)) {
        source = 'installed';
    }

    const requestedModel = rawTarget.modelId ||
        rawTarget.model ||
        payload.modelId ||
        payload.model ||
        '';
    const remoteModelId = normalizeModelId(
        rawTarget.remoteModelId ||
        rawTarget.remoteModel ||
        payload.remoteModelId ||
        payload.remoteModel ||
        requestedModel ||
        DEFAULT_MODEL
    );
    const localPath = source === 'local_import' ? requestedLocalPath : '';
    const modelId = normalizeModelId(
        requestedModel ||
        (source === 'local_import' && localPath ? inferLocalModelName(localPath) : '') ||
        (source === 'online_pull' ? remoteModelId : '') ||
        DEFAULT_MODEL
    );

    return {
        source,
        modelId,
        localPath,
        remoteModelId: source === 'online_pull' ? remoteModelId : ''
    };
}

function parseOllamaVersion(value = '') {
    const match = String(value || '').match(/(\d+)\.(\d+)\.(\d+)/);
    if (!match) {
        return null;
    }
    return {
        major: Number(match[1]),
        minor: Number(match[2]),
        patch: Number(match[3]),
        raw: match[0]
    };
}

function compareVersions(a = '', b = '') {
    const left = parseOllamaVersion(a);
    const right = parseOllamaVersion(b);
    if (!left || !right) {
        return left ? 1 : right ? -1 : 0;
    }
    for (const key of ['major', 'minor', 'patch']) {
        if (left[key] !== right[key]) {
            return left[key] > right[key] ? 1 : -1;
        }
    }
    return 0;
}

function isOllamaVersionAtLeast(version = '', minimum = MIN_LOCAL_IMPORT_OLLAMA_VERSION) {
    return compareVersions(version, minimum) >= 0;
}

function isOllamaUpgradeRequiredOutput(output = '') {
    const text = String(output || '').toLowerCase();
    return /requires a newer version of ollama|download the latest version|pull model manifest:\s*412/.test(text);
}

function isOllamaCudaFailureOutput(output = '') {
    const text = String(output || '').toLowerCase();
    return /cuda error|device kernel image is invalid|llama-server process has terminated|0xc0000409|cublas|cudart/.test(text);
}

function isOllamaModelNotFoundOutput(output = '') {
    const text = String(output || '').toLowerCase();
    return /pull model manifest:\s*(404|.*not found)|model .*not found|not found.*model|repository .*not found|manifest .*not found/.test(text);
}

function shouldPreferVulkanForDeployment(diagnosis = {}) {
    return diagnosis.platform === 'win32' &&
        diagnosis.acceleration?.gpu?.available === true &&
        diagnosis.acceleration?.gpu?.driverTooOld === true;
}

function parseVersionNumbers(value = '') {
    const parts = String(value || '').match(/\d+/g);
    if (!parts || !parts.length) {
        return null;
    }
    return parts.slice(0, 4).map((part) => Number(part));
}

function compareNumericVersions(a = '', b = '') {
    const left = parseVersionNumbers(a);
    const right = parseVersionNumbers(b);
    if (!left || !right) {
        return left ? 1 : right ? -1 : 0;
    }
    const length = Math.max(left.length, right.length);
    for (let index = 0; index < length; index += 1) {
        const leftPart = left[index] || 0;
        const rightPart = right[index] || 0;
        if (leftPart !== rightPart) {
            return leftPart > rightPart ? 1 : -1;
        }
    }
    return 0;
}

function normalizePort(value = DEFAULT_PORT) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) {
        return DEFAULT_PORT;
    }
    return Math.max(1, Math.min(65535, Math.floor(numeric)));
}

function normalizeReadyTimeoutSec(value = DEFAULT_READY_TIMEOUT_SEC) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) {
        return DEFAULT_READY_TIMEOUT_SEC;
    }
    return Math.max(30, Math.min(7200, Math.floor(numeric)));
}

function getBaseUrl({ host = DEFAULT_HOST, port = DEFAULT_PORT } = {}) {
    const clientHost = host === '0.0.0.0' || host === '::' ? DEFAULT_HOST : host;
    return `http://${clientHost}:${normalizePort(port)}`;
}

function buildOllamaApiChatUrl(baseUrl = getBaseUrl()) {
    const normalized = String(baseUrl || getBaseUrl()).replace(/\/+$/, '');
    if (/\/api\/chat$/i.test(normalized)) {
        return normalized;
    }
    if (/\/api$/i.test(normalized)) {
        return `${normalized}/chat`;
    }
    return `${normalized}/api/chat`;
}

function stripAnsi(value = '') {
    return String(value || '').replace(/\x1B\[[0-?]*[ -/]*[@-~]/g, '');
}

function splitOutputLines(chunk = '') {
    return stripAnsi(chunk)
        .replace(/\r\n/g, '\n')
        .replace(/\r/g, '\n')
        .split('\n')
        .map((line) => line.trimEnd())
        .filter(Boolean);
}

function clipLine(line = '') {
    const text = String(line || '');
    return text.length > MAX_LINE_LENGTH ? `${text.slice(0, MAX_LINE_LENGTH)}...` : text;
}

function execFileText(command, args = [], { timeoutMs = 12000, env = process.env } = {}) {
    return new Promise((resolve, reject) => {
        const child = spawn(command, args, {
            env,
            windowsHide: true,
            shell: false
        });
        let stdout = '';
        let stderr = '';
        const timer = setTimeout(() => {
            try {
                child.kill();
            } catch {
                // Ignore kill races.
            }
            reject(new Error(`Command timed out after ${timeoutMs}ms: ${command}`));
        }, timeoutMs);
        child.stdout?.on?.('data', (chunk) => {
            stdout += String(chunk || '');
        });
        child.stderr?.on?.('data', (chunk) => {
            stderr += String(chunk || '');
        });
        child.on('error', (error) => {
            clearTimeout(timer);
            reject(error);
        });
        child.on('exit', (code) => {
            clearTimeout(timer);
            if (Number(code) === 0) {
                resolve([stdout, stderr].filter(Boolean).join('\n'));
                return;
            }
            reject(new Error(stderr || stdout || `${command} exited with code ${code}`));
        });
    });
}

function execFileSafe(command, args = [], options = {}) {
    return execFileText(command, args, options)
        .then((stdout) => ({ ok: true, stdout, error: '' }))
        .catch((error) => ({ ok: false, stdout: '', error: error.message || String(error) }));
}

function parseNvidiaSmiCsv(output = '') {
    const line = splitOutputLines(output)[0] || '';
    if (!line) {
        return null;
    }
    const [name = '', driverVersion = '', memoryTotal = '', memoryUsed = '', utilization = ''] = line
        .split(',')
        .map((part) => part.trim());
    return {
        name,
        driverVersion,
        memoryTotalMiB: Number.parseFloat(memoryTotal) || null,
        memoryUsedMiB: Number.parseFloat(memoryUsed) || null,
        utilizationGpuPercent: Number.parseFloat(utilization) || 0
    };
}

async function getNvidiaGpuState({ env = process.env } = {}) {
    const result = await execFileSafe('nvidia-smi', [
        '--query-gpu=name,driver_version,memory.total,memory.used,utilization.gpu',
        '--format=csv,noheader,nounits'
    ], {
        timeoutMs: 5000,
        env
    });
    if (!result.ok) {
        return {
            available: false,
            error: result.error || 'nvidia-smi unavailable'
        };
    }
    const gpu = parseNvidiaSmiCsv(result.stdout);
    if (!gpu) {
        return {
            available: false,
            error: 'nvidia-smi returned no GPU rows'
        };
    }
    const driverTooOld = gpu.driverVersion
        ? compareNumericVersions(gpu.driverVersion, MIN_NVIDIA_DRIVER_FOR_OLLAMA_GPU) < 0
        : false;
    return {
        available: true,
        ...gpu,
        minimumDriverVersion: MIN_NVIDIA_DRIVER_FOR_OLLAMA_GPU,
        driverTooOld
    };
}

function parseOllamaPsOutput(output = '') {
    return splitOutputLines(output)
        .filter((line) => !/^NAME\s+ID\s+SIZE\s+PROCESSOR/i.test(line))
        .map((line) => {
            const columns = line.split(/\s{2,}/).map((part) => part.trim()).filter(Boolean);
            return {
                name: columns[0] || '',
                id: columns[1] || '',
                size: columns[2] || '',
                processor: columns[3] || '',
                context: columns[4] || '',
                until: columns.slice(5).join(' ')
            };
        })
        .filter((entry) => entry.name);
}

async function getOllamaLoadedModelState(cli = {}, {
    baseUrl = getBaseUrl(),
    model = DEFAULT_MODEL,
    env = process.env
} = {}) {
    if (!cli?.ok || !cli.command) {
        return {
            ok: false,
            models: [],
            model: normalizeModelId(model),
            error: 'Ollama CLI unavailable'
        };
    }
    const result = await execFileSafe(cli.command, ['ps'], {
        timeoutMs: 5000,
        env: buildOllamaClientEnv(env, { baseUrl })
    });
    if (!result.ok) {
        return {
            ok: false,
            models: [],
            model: normalizeModelId(model),
            error: result.error
        };
    }
    const models = parseOllamaPsOutput(result.stdout);
    const normalizedModel = normalizeModelId(model).toLowerCase();
    const activeModel = models.find((entry) => String(entry.name || '').toLowerCase() === normalizedModel) || null;
    return {
        ok: true,
        models,
        model: normalizeModelId(model),
        activeModel,
        processor: activeModel?.processor || '',
        context: activeModel?.context || ''
    };
}

async function diagnoseOllamaAcceleration(cli = {}, {
    baseUrl = getBaseUrl(),
    model = DEFAULT_MODEL,
    env = process.env,
    smoke = null
} = {}) {
    const [gpu, loadedModel] = await Promise.all([
        getNvidiaGpuState({ env }),
        getOllamaLoadedModelState(cli, { baseUrl, model, env })
    ]);
    const processor = loadedModel.processor || '';
    const cpuOnly = /\bcpu\b/i.test(processor) && !/\bgpu\b/i.test(processor);
    const gpuActive = /\bgpu\b/i.test(processor);
    const warnings = [];
    if (gpu.available && gpu.driverTooOld) {
        warnings.push(`当前 NVIDIA 驱动 ${gpu.driverVersion} 可能影响 Ollama CUDA 后端；如果实际运行在 CPU，AILIS 会先尝试 Vulkan GPU 兼容模式，不把更新驱动作为前置条件。`);
    }
    if (cpuOnly) {
        warnings.push('当前 Ollama 模型实际运行在 CPU，长上下文和 Agent 决策会明显变慢。');
    }
    if (!gpu.available) {
        warnings.push('没有检测到可用 NVIDIA GPU，Ollama 会使用 CPU 或其他后端。');
    }
    return {
        status: gpuActive ? 'gpu' : cpuOnly ? 'cpu' : 'unknown',
        gpu,
        loadedModel,
        processor,
        context: loadedModel.context || '',
        cpuOnly,
        gpuActive,
        warnings,
        smokeMetrics: smoke?.metrics || null
    };
}

function sleep(ms = 0) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function extractOllamaVersionText(output = '') {
    const lines = splitOutputLines(output);
    const versionLine = lines.find((line) => /client\s+version/i.test(line) && parseOllamaVersion(line)) ||
        lines.find((line) => /^ollama\s+version/i.test(line) && parseOllamaVersion(line)) ||
        lines.find((line) => parseOllamaVersion(line)) ||
        '';
    return parseOllamaVersion(versionLine)?.raw || '';
}

function fileExists(filePath = '') {
    try {
        return Boolean(filePath) && fs.existsSync(filePath);
    } catch {
        return false;
    }
}

function uniqueList(values = []) {
    const seen = new Set();
    return values.filter((value) => {
        const key = String(value || '').toLowerCase();
        if (!key || seen.has(key)) {
            return false;
        }
        seen.add(key);
        return true;
    });
}

function getWindowsDriveOllamaCandidates() {
    if (process.platform !== 'win32') {
        return [];
    }
    const candidates = [];
    for (let code = 67; code <= 90; code += 1) {
        const drive = `${String.fromCharCode(code)}:\\`;
        candidates.push(path.join(drive, 'ollama', 'ollama.exe'));
        candidates.push(path.join(drive, 'Ollama', 'ollama.exe'));
    }
    return candidates;
}

async function findOllamaExecutable({ platform = process.platform, env = process.env } = {}) {
    const envPath = String(env.OLLAMA_PATH || env.AILIS_OLLAMA_PATH || '').trim();
    const candidates = [];
    if (envPath) {
        candidates.push(envPath);
    }
    candidates.push('ollama');

    if (platform === 'win32') {
        const localAppData = env.LOCALAPPDATA || '';
        const programFiles = env.ProgramFiles || 'C:\\Program Files';
        const programFilesX86 = env['ProgramFiles(x86)'] || 'C:\\Program Files (x86)';
        candidates.push(
            path.join(localAppData, 'Programs', 'Ollama', 'ollama.exe'),
            path.join(programFiles, 'Ollama', 'ollama.exe'),
            path.join(programFilesX86, 'Ollama', 'ollama.exe'),
            ...getWindowsDriveOllamaCandidates()
        );
    } else if (platform === 'darwin') {
        candidates.push('/usr/local/bin/ollama', '/opt/homebrew/bin/ollama');
    } else {
        candidates.push('/usr/local/bin/ollama', '/usr/bin/ollama');
    }

    const found = [];
    for (const candidate of uniqueList(candidates)) {
        if (candidate.includes(path.sep) || candidate.includes('/') || candidate.includes('\\')) {
            if (!fileExists(candidate)) {
                continue;
            }
            const result = await execFileSafe(candidate, ['--version'], { timeoutMs: 5000 });
            if (result.ok) {
                found.push({
                    ok: true,
                    command: candidate,
                    version: extractOllamaVersionText(result.stdout)
                });
            }
            continue;
        }
        const result = await execFileSafe(candidate, ['--version'], { timeoutMs: 5000 });
        if (result.ok) {
            found.push({
                ok: true,
                command: candidate,
                version: extractOllamaVersionText(result.stdout)
            });
        }
    }

    if (found.length) {
        if (envPath) {
            const explicit = found.find((entry) => path.resolve(entry.command) === path.resolve(envPath));
            if (explicit) {
                return explicit;
            }
        }
        found.sort((a, b) => {
            const versionCompare = compareVersions(b.version, a.version);
            if (versionCompare !== 0) {
                return versionCompare;
            }
            const aIsUserInstall = /AppData[\\/]+Local[\\/]+Programs[\\/]+Ollama/i.test(a.command) ? 1 : 0;
            const bIsUserInstall = /AppData[\\/]+Local[\\/]+Programs[\\/]+Ollama/i.test(b.command) ? 1 : 0;
            return bIsUserInstall - aIsUserInstall;
        });
        return found[0];
    }

    return {
        ok: false,
        command: '',
        version: '',
        error: 'Ollama CLI was not found.'
    };
}

async function getOllamaServiceState({ baseUrl = getBaseUrl(), model = DEFAULT_MODEL, timeoutMs = 4000 } = {}) {
    const normalizedModel = normalizeModelId(model);
    if (typeof globalThis.fetch !== 'function') {
        return {
            ok: false,
            baseUrl,
            model,
            modelPresent: false,
            models: [],
            error: 'fetch_unavailable'
        };
    }
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
        const response = await globalThis.fetch(`${String(baseUrl).replace(/\/+$/, '')}/api/tags`, {
            signal: controller.signal,
            headers: { accept: 'application/json' }
        });
        if (!response.ok) {
            return {
                ok: false,
                baseUrl,
                model: normalizedModel,
                modelPresent: false,
                models: [],
                error: `${response.status} ${response.statusText}`
            };
        }
        const payload = await response.json();
        const models = Array.isArray(payload?.models)
            ? payload.models
                .map((entry) => entry?.name || entry?.model || entry?.digest || '')
                .filter(Boolean)
            : [];
        const normalizedModelLower = normalizedModel.toLowerCase();
        return {
            ok: true,
            baseUrl,
            model: normalizedModel,
            modelPresent: models.some((name) => String(name || '').toLowerCase() === normalizedModelLower),
            models,
            error: ''
        };
    } catch (error) {
        return {
            ok: false,
            baseUrl,
            model: normalizedModel,
            modelPresent: false,
            models: [],
            error: error.message || String(error)
        };
    } finally {
        clearTimeout(timer);
    }
}

function buildInstallCommand({ platform = process.platform } = {}) {
    if (platform === 'win32') {
        return {
            command: 'winget',
            args: [
                'install',
                '--id',
                'Ollama.Ollama',
                '-e',
                '--accept-source-agreements',
                '--accept-package-agreements',
                '--force'
            ],
            label: 'winget install Ollama.Ollama --force'
        };
    }
    if (platform === 'darwin') {
        return {
            command: 'brew',
            args: ['install', 'ollama'],
            label: 'brew install ollama'
        };
    }
    return {
        command: 'sh',
        args: ['-c', 'curl -fsSL https://ollama.com/install.sh | sh'],
        label: 'curl -fsSL https://ollama.com/install.sh | sh'
    };
}

function buildUpgradeCommand({ platform = process.platform } = {}) {
    if (platform === 'win32') {
        return {
            command: 'winget',
            args: [
                'upgrade',
                '--id',
                'Ollama.Ollama',
                '-e',
                '--accept-source-agreements',
                '--accept-package-agreements'
            ],
            label: 'winget upgrade Ollama.Ollama'
        };
    }
    if (platform === 'darwin') {
        return {
            command: 'brew',
            args: ['upgrade', 'ollama'],
            label: 'brew upgrade ollama'
        };
    }
    return {
        command: 'sh',
        args: ['-c', 'curl -fsSL https://ollama.com/install.sh | sh'],
        label: 'curl -fsSL https://ollama.com/install.sh | sh'
    };
}

function getOllamaModelsDir({ env = process.env } = {}) {
    const configured = String(env.OLLAMA_MODELS || env.AILIS_OLLAMA_MODELS || '').trim();
    if (configured) {
        return configured;
    }
    return path.join(os.homedir(), '.ollama', 'models');
}

function getPathRootForStatFs(targetPath = '') {
    const resolved = path.resolve(targetPath || process.cwd());
    const parsed = path.parse(resolved);
    return parsed.root || resolved;
}

function getDiskFreeBytes(targetPath = '') {
    try {
        const stat = fs.statfsSync(getPathRootForStatFs(targetPath));
        return Number(stat.bavail || 0) * Number(stat.bsize || 0);
    } catch {
        return 0;
    }
}

function formatGiB(bytes = 0) {
    const numeric = Number(bytes) || 0;
    return Number((numeric / (1024 ** 3)).toFixed(2));
}

function getManagedModelsDirForRoot(root = '') {
    const parsedRoot = path.parse(path.resolve(root || process.cwd())).root;
    if (!parsedRoot) {
        return getOllamaModelsDir();
    }
    return path.join(parsedRoot, 'AILIS', 'Ollama', 'models');
}

function getWindowsDriveRoots() {
    if (process.platform !== 'win32') {
        return [path.parse(os.homedir()).root || '/'];
    }
    const roots = [];
    for (let code = 67; code <= 90; code += 1) {
        const root = `${String.fromCharCode(code)}:\\`;
        if (fileExists(root)) {
            roots.push(root);
        }
    }
    return roots;
}

function selectOllamaModelsDir({
    env = process.env,
    preferredPath = '',
    requiredBytes = 0
} = {}) {
    const explicit = String(env.OLLAMA_MODELS || env.AILIS_OLLAMA_MODELS || '').trim();
    if (explicit) {
        return {
            path: explicit,
            source: env.OLLAMA_MODELS ? 'env_OLLAMA_MODELS' : 'env_AILIS_OLLAMA_MODELS',
            freeBytes: getDiskFreeBytes(explicit),
            requiredBytes: Number(requiredBytes) || 0,
            autoSelected: false
        };
    }
    const defaultDir = getOllamaModelsDir({ env });
    const defaultFree = getDiskFreeBytes(defaultDir);
    const needed = Math.max(Number(requiredBytes) || 0, 0) * 1.35;
    if (!needed || defaultFree >= needed) {
        return {
            path: defaultDir,
            source: 'default',
            freeBytes: defaultFree,
            requiredBytes: Number(requiredBytes) || 0,
            autoSelected: false
        };
    }

    const candidates = [];
    const preferredRoot = preferredPath ? path.parse(path.resolve(preferredPath)).root : '';
    if (preferredRoot) {
        candidates.push(preferredRoot);
    }
    candidates.push(...getWindowsDriveRoots());
    const ranked = uniqueList(candidates)
        .map((root) => ({
            root,
            path: getManagedModelsDirForRoot(root),
            freeBytes: getDiskFreeBytes(root)
        }))
        .filter((entry) => entry.freeBytes >= needed)
        .sort((a, b) => b.freeBytes - a.freeBytes);
    if (ranked.length) {
        return {
            path: ranked[0].path,
            source: 'auto_large_disk',
            freeBytes: ranked[0].freeBytes,
            requiredBytes: Number(requiredBytes) || 0,
            autoSelected: true
        };
    }
    return {
        path: defaultDir,
        source: 'default_low_space',
        freeBytes: defaultFree,
        requiredBytes: Number(requiredBytes) || 0,
        autoSelected: false
    };
}

async function ensureDirectory(dirPath = '') {
    if (!dirPath) {
        return;
    }
    await fs.promises.mkdir(dirPath, { recursive: true });
}

function buildOllamaRuntimeEnv(baseEnv = process.env, localModel = null, {
    modelStore = null,
    requiredBytes = 0,
    forceCpu = false,
    forceVulkan = false
} = {}) {
    const env = { ...baseEnv };
    if (localModel?.ollamaModelsDir) {
        env.OLLAMA_MODELS = localModel.ollamaModelsDir;
    } else {
        const selectedStore = modelStore || (requiredBytes
            ? selectOllamaModelsDir({ env, requiredBytes })
            : null);
        if (selectedStore?.autoSelected || selectedStore?.source === 'auto_large_disk') {
            env.OLLAMA_MODELS = selectedStore.path;
        }
    }
    if (forceVulkan) {
        env.OLLAMA_LLM_LIBRARY = 'vulkan';
        delete env.CUDA_VISIBLE_DEVICES;
    } else if (forceCpu) {
        env.OLLAMA_LLM_LIBRARY = env.OLLAMA_LLM_LIBRARY || 'cpu_avx2';
        env.CUDA_VISIBLE_DEVICES = env.CUDA_VISIBLE_DEVICES || '-1';
    }
    return env;
}

function buildOllamaClientEnv(baseEnv = process.env, { baseUrl = getBaseUrl(), localModel = null } = {}) {
    return {
        ...buildOllamaRuntimeEnv(baseEnv, localModel),
        OLLAMA_HOST: baseUrl
    };
}

async function smokeTestOllamaModel({ baseUrl = getBaseUrl(), model = DEFAULT_MODEL, timeoutMs = 120000 } = {}) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
        const response = await fetch(buildOllamaApiChatUrl(baseUrl), {
            method: 'POST',
            headers: {
                'content-type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify({
                model: normalizeModelId(model),
                stream: false,
                think: false,
                messages: [
                    { role: 'user', content: 'Reply with OK.' }
                ],
                options: {
                    temperature: 0,
                    num_predict: 8
                }
            }),
            signal: controller.signal
        });
        const text = await response.text();
        if (!response.ok) {
            return {
                ok: false,
                status: response.status,
                error: text || response.statusText || 'Ollama smoke test failed.'
            };
        }
        const payload = JSON.parse(text || '{}');
        if (payload?.error) {
            return {
                ok: false,
                status: response.status,
                error: payload.error
            };
        }
        const content = String(payload?.message?.content || payload?.response || '').trim();
        const promptEvalCount = Number(payload?.prompt_eval_count || 0);
        const promptEvalDurationNs = Number(payload?.prompt_eval_duration || 0);
        const evalCount = Number(payload?.eval_count || 0);
        const evalDurationNs = Number(payload?.eval_duration || 0);
        return {
            ok: Boolean(content),
            status: response.status,
            content,
            metrics: {
                totalDurationMs: Number(payload?.total_duration || 0) / 1000000,
                loadDurationMs: Number(payload?.load_duration || 0) / 1000000,
                promptEvalCount,
                promptEvalDurationMs: promptEvalDurationNs / 1000000,
                promptTokensPerSecond: promptEvalDurationNs > 0
                    ? (promptEvalCount * 1000000000) / promptEvalDurationNs
                    : null,
                evalCount,
                evalDurationMs: evalDurationNs / 1000000,
                evalTokensPerSecond: evalDurationNs > 0
                    ? (evalCount * 1000000000) / evalDurationNs
                    : null
            },
            error: content ? '' : 'Ollama smoke test returned empty content.'
        };
    } catch (error) {
        return {
            ok: false,
            status: null,
            error: error?.name === 'AbortError'
                ? `Ollama smoke test timed out after ${timeoutMs}ms.`
                : error.message || String(error)
        };
    } finally {
        clearTimeout(timer);
    }
}

async function readJsonFile(filePath) {
    try {
        return JSON.parse(await fs.promises.readFile(filePath, 'utf8'));
    } catch {
        return null;
    }
}

async function sumFilesBytes(filePaths = []) {
    let total = 0;
    for (const filePath of filePaths) {
        try {
            const stat = await fs.promises.stat(filePath);
            if (stat.isFile()) {
                total += stat.size;
            }
        } catch {
            // Ignore files that disappear while inspecting.
        }
    }
    return total;
}

function buildLocalModelDescriptorBase(modelPath = '') {
    const normalizedPath = String(modelPath || '').trim();
    return {
        ok: false,
        path: normalizedPath,
        importPath: '',
        name: normalizedPath ? path.basename(normalizedPath) : '',
        suggestedModelName: inferLocalModelName(normalizedPath),
        sourceType: 'unknown',
        format: 'unknown',
        modelType: '',
        architecture: '',
        canImportOllama: false,
        complete: false,
        minimumOllamaVersion: MIN_LOCAL_IMPORT_OLLAMA_VERSION,
        weightFiles: [],
        sizeBytes: 0,
        sizeGiB: 0,
        ollamaModelsDir: getOllamaModelsDir(),
        ollamaModelsDirSource: 'default',
        ollamaModelsDirAutoSelected: false,
        ollamaModelsFreeBytes: getDiskFreeBytes(getOllamaModelsDir()),
        ollamaModelsFreeGiB: formatGiB(getDiskFreeBytes(getOllamaModelsDir())),
        blockers: [],
        warnings: []
    };
}

async function describeOllamaLocalModelPath(modelPath = '', { env = process.env } = {}) {
    const result = buildLocalModelDescriptorBase(modelPath);
    result.ollamaModelsDir = getOllamaModelsDir({ env });
    result.ollamaModelsDirSource = env.OLLAMA_MODELS ? 'env_OLLAMA_MODELS' : env.AILIS_OLLAMA_MODELS ? 'env_AILIS_OLLAMA_MODELS' : 'default';
    result.ollamaModelsDirAutoSelected = false;
    result.ollamaModelsFreeBytes = getDiskFreeBytes(result.ollamaModelsDir);
    result.ollamaModelsFreeGiB = formatGiB(result.ollamaModelsFreeBytes);
    if (!result.path) {
        result.blockers.push('没有选择本地模型文件或目录。');
        return result;
    }
    const stat = await fs.promises.stat(result.path).catch(() => null);
    if (!stat) {
        result.blockers.push('路径不存在。');
        return result;
    }
    if (stat.isFile()) {
        if (!/\.gguf$/i.test(result.path)) {
            result.blockers.push('Ollama 本地文件导入目前只支持 .gguf 文件；HF Safetensors 请选择模型目录。');
            return result;
        }
        result.sourceType = 'gguf_file';
        result.format = 'GGUF';
        result.importPath = result.path;
        result.canImportOllama = true;
        result.complete = true;
        result.weightFiles = [path.basename(result.path)];
        result.sizeBytes = stat.size;
        result.sizeGiB = formatGiB(stat.size);
        const modelStore = selectOllamaModelsDir({
            env,
            preferredPath: result.path,
            requiredBytes: result.sizeBytes
        });
        result.ollamaModelsDir = modelStore.path;
        result.ollamaModelsDirSource = modelStore.source;
        result.ollamaModelsDirAutoSelected = modelStore.autoSelected;
        result.ollamaModelsFreeBytes = modelStore.freeBytes;
        result.ollamaModelsFreeGiB = formatGiB(modelStore.freeBytes);
        if (modelStore.autoSelected) {
            result.warnings.push(`默认 C 盘 Ollama 仓库空间不足，AILIS 将自动使用 ${modelStore.path}。`);
        }
        result.ok = true;
        return result;
    }
    if (!stat.isDirectory()) {
        result.blockers.push('请选择 .gguf 文件或 HF Safetensors 模型目录。');
        return result;
    }

    const entries = await fs.promises.readdir(result.path, { withFileTypes: true }).catch(() => []);
    const fileNames = entries.filter((entry) => entry.isFile()).map((entry) => entry.name);
    const lowerNames = new Set(fileNames.map((name) => name.toLowerCase()));
    const ggufFiles = fileNames.filter((name) => /\.gguf$/i.test(name)).sort((a, b) => a.localeCompare(b));
    const safetensorFiles = fileNames.filter((name) => /\.safetensors$/i.test(name)).sort((a, b) => a.localeCompare(b));
    const hasConfig = lowerNames.has('config.json');
    const hasTokenizer = fileNames.some((name) => /^(tokenizer|vocab|merges|sentencepiece|spiece).*\.?(json|txt|model)?$/i.test(name));

    if (ggufFiles.length) {
        result.sourceType = 'gguf_file';
        result.format = 'GGUF';
        result.importPath = path.join(result.path, ggufFiles[0]);
        result.canImportOllama = true;
        result.complete = true;
        result.weightFiles = ggufFiles.slice(0, 12);
        result.sizeBytes = await sumFilesBytes([result.importPath]);
        result.sizeGiB = formatGiB(result.sizeBytes);
        const modelStore = selectOllamaModelsDir({
            env,
            preferredPath: result.importPath,
            requiredBytes: result.sizeBytes
        });
        result.ollamaModelsDir = modelStore.path;
        result.ollamaModelsDirSource = modelStore.source;
        result.ollamaModelsDirAutoSelected = modelStore.autoSelected;
        result.ollamaModelsFreeBytes = modelStore.freeBytes;
        result.ollamaModelsFreeGiB = formatGiB(modelStore.freeBytes);
        if (ggufFiles.length > 1) {
            result.warnings.push(`目录里有 ${ggufFiles.length} 个 GGUF，默认使用 ${ggufFiles[0]}。`);
        }
        if (modelStore.autoSelected) {
            result.warnings.push(`默认 C 盘 Ollama 仓库空间不足，AILIS 将自动使用 ${modelStore.path}。`);
        }
        result.ok = true;
        return result;
    }

    if (hasConfig && safetensorFiles.length) {
        const config = await readJsonFile(path.join(result.path, 'config.json'));
        result.sourceType = 'safetensors_dir';
        result.format = 'HF/ModelScope Safetensors';
        result.importPath = result.path;
        result.modelType = String(config?.model_type || '');
        result.architecture = Array.isArray(config?.architectures)
            ? config.architectures.join(', ')
            : String(config?.architectures || '');
        result.weightFiles = safetensorFiles.slice(0, 12);
        result.sizeBytes = await sumFilesBytes(safetensorFiles.map((name) => path.join(result.path, name)));
        result.sizeGiB = formatGiB(result.sizeBytes);
        const modelStore = selectOllamaModelsDir({
            env,
            preferredPath: result.path,
            requiredBytes: result.sizeBytes
        });
        result.ollamaModelsDir = modelStore.path;
        result.ollamaModelsDirSource = modelStore.source;
        result.ollamaModelsDirAutoSelected = modelStore.autoSelected;
        result.ollamaModelsFreeBytes = modelStore.freeBytes;
        result.ollamaModelsFreeGiB = formatGiB(modelStore.freeBytes);
        if (!hasTokenizer) {
            result.blockers.push('缺少 tokenizer/vocab/merges/sentencepiece 等分词器文件，请确认选择的是完整模型根目录。');
            return result;
        }
        result.canImportOllama = true;
        result.complete = true;
        if (result.modelType && !SAFETENSORS_SUPPORTED_MODEL_TYPES.has(result.modelType.toLowerCase())) {
            result.warnings.push(
                `这是 ${result.modelType} Safetensors。Ollama 对 Safetensors 的直接导入不是所有 HF 架构都支持；AILIS 会先升级 Ollama 后尝试导入，失败时建议换 GGUF。`
            );
        }
        if (modelStore.autoSelected) {
            result.warnings.push(`默认 C 盘 Ollama 仓库空间不足，AILIS 将自动使用 ${modelStore.path}。`);
        } else if (result.sizeBytes && result.ollamaModelsFreeBytes && result.ollamaModelsFreeBytes < result.sizeBytes * 1.25) {
            result.warnings.push(
                `Ollama 模型仓库可用空间约 ${result.ollamaModelsFreeGiB}GB，低于本地权重 ${result.sizeGiB}GB 的安全导入空间。建议先把 OLLAMA_MODELS 指到空间更大的磁盘。`
            );
        }
        result.ok = true;
        return result;
    }

    if (safetensorFiles.length) {
        result.sourceType = 'safetensors_dir';
        result.format = 'Safetensors 权重目录';
        result.weightFiles = safetensorFiles.slice(0, 12);
        result.blockers.push('检测到 safetensors 权重，但没有 config.json；请选择完整 HF/ModelScope 模型根目录。');
        return result;
    }

    result.blockers.push('没有检测到 .gguf 或 .safetensors 权重文件。');
    return result;
}

function buildModelfileContent({ localModel = {}, temperature = null, topP = null } = {}) {
    const importPath = localModel.importPath || localModel.path || '';
    const lines = [
        `FROM ${JSON.stringify(importPath)}`
    ];
    if (Number.isFinite(Number(temperature))) {
        lines.push(`PARAMETER temperature ${Number(temperature)}`);
    }
    if (Number.isFinite(Number(topP))) {
        lines.push(`PARAMETER top_p ${Number(topP)}`);
    }
    return `${lines.join('\n')}\n`;
}

function buildInstallPlan(diagnosis = {}) {
    const steps = [];
    const target = normalizeOllamaTarget({
        target: diagnosis.target,
        source: diagnosis.targetSource,
        modelId: diagnosis.model,
        localModelPath: diagnosis.localModel?.path || ''
    });
    const source = target.source;
    const isInstalledTarget = source === 'installed';
    const isLocalImportTarget = source === 'local_import';
    const isOnlinePullTarget = source === 'online_pull';
    const serviceOk = Boolean(diagnosis.service?.ok);
    const modelPresent = Boolean(diagnosis.service?.modelPresent);
    const localModel = diagnosis.localModel || null;
    const hasLocalModelRequest = isLocalImportTarget && Boolean(localModel?.path || target.localPath);
    const useLocalModel = Boolean(isLocalImportTarget && localModel?.ok && localModel?.canImportOllama);
    const cliVersion = diagnosis.cli?.version || '';
    const needsLocalImportUpgrade = useLocalModel &&
        (!diagnosis.cli?.ok || !isOllamaVersionAtLeast(cliVersion, localModel.minimumOllamaVersion || MIN_LOCAL_IMPORT_OLLAMA_VERSION));
    const needsRemotePullUpgrade = isOnlinePullTarget &&
        !modelPresent &&
        diagnosis.cli?.ok &&
        cliVersion &&
        !isOllamaVersionAtLeast(cliVersion, MIN_REMOTE_PULL_OLLAMA_VERSION);
    const needsRemoteStoreRestart = isOnlinePullTarget &&
        !modelPresent &&
        Boolean(diagnosis.remoteModelStore?.autoSelected);
    const cliNeeded = !serviceOk || (isOnlinePullTarget && !modelPresent) || (isLocalImportTarget && !modelPresent);
    if (hasLocalModelRequest && !useLocalModel) {
        steps.push({
            id: 'local_model_not_importable',
            title: '本地模型不可导入',
            severity: 'blocking',
            requiresNetwork: false,
            requiresSystemChange: false,
            description: [
                ...(localModel.blockers || []),
                ...(localModel.warnings || [])
            ].filter(Boolean).join(' ') || '当前本地模型路径不能被 Ollama 直接导入。'
        });
        return {
            ok: false,
            steps,
            requiresNetwork: false,
            requiresSystemChange: false,
            blockingSteps: steps
        };
    }
    if (isInstalledTarget && serviceOk && !modelPresent) {
        steps.push({
            id: 'installed_model_missing',
            title: `本机缺少已安装模型 ${diagnosis.model || DEFAULT_MODEL}`,
            severity: 'blocking',
            requiresNetwork: false,
            requiresSystemChange: false,
            description: '当前选择的是“已有模型名”模式。AILIS 只检查并启用本机已安装模型，不会自动下载；请先选择一个 ollama list 中存在的模型，或切换到“在线搜索下载”。'
        });
        return {
            ok: false,
            steps,
            requiresNetwork: false,
            requiresSystemChange: false,
            blockingSteps: steps
        };
    }
    if (!diagnosis.cli?.ok && cliNeeded) {
        steps.push({
            id: 'install_ollama',
            title: '安装 Ollama 本地运行时',
            severity: 'required',
            requiresNetwork: true,
            requiresSystemChange: true,
            description: diagnosis.platform === 'win32'
                ? '将优先通过 winget 安装 Ollama。安装器可能打开系统安装界面或要求用户确认。'
                : '将通过系统包管理器或 Ollama 官方安装脚本安装本地运行时。'
        });
    } else if (needsLocalImportUpgrade) {
        steps.push({
            id: 'upgrade_ollama',
            title: '升级 Ollama 本地运行时',
            severity: 'required',
            requiresNetwork: true,
            requiresSystemChange: true,
            description: `本地模型导入建议 Ollama ${localModel.minimumOllamaVersion || MIN_LOCAL_IMPORT_OLLAMA_VERSION}+。当前版本：${cliVersion || '未知'}。`
        });
    } else if (needsRemotePullUpgrade) {
        steps.push({
            id: 'upgrade_ollama',
            title: '升级 Ollama 本地运行时',
            severity: 'required',
            requiresNetwork: true,
            requiresSystemChange: true,
            description: `当前 Ollama 版本较旧（${cliVersion}），新模型可能拒绝下载。AILIS 会先升级 Ollama，再下载模型。`
        });
    }
    if (!diagnosis.service?.ok) {
        steps.push({
            id: 'start_service',
            title: '启动 Ollama 服务',
            severity: 'required',
            description: '将运行 ollama serve，并等待 http://127.0.0.1:11434/api/tags 可访问。'
        });
    } else if (needsLocalImportUpgrade || needsRemotePullUpgrade || useLocalModel || needsRemoteStoreRestart) {
        steps.push({
            id: 'restart_ollama_service',
            title: '重启 Ollama 服务',
            severity: 'required',
            requiresSystemChange: true,
            description: needsRemoteStoreRestart
                ? '下载模型前需要重启本机 Ollama 服务，以确保模型写入自动选择的大磁盘仓库。'
                : needsLocalImportUpgrade || needsRemotePullUpgrade
                ? '升级 Ollama 后需要重启本地服务，否则导入请求可能仍然打到旧服务。'
                : '本地模型导入前需要重启本机 Ollama 服务，以确保模型仓库路径和运行环境生效。'
        });
    }
    if (useLocalModel && !modelPresent) {
        steps.push({
            id: 'import_local_model',
            title: `导入本地模型 ${diagnosis.model || DEFAULT_MODEL}`,
            severity: 'required',
            requiresNetwork: false,
            requiresSystemChange: true,
            description: localModel.sourceType === 'safetensors_dir'
                ? '将通过 ollama create 从 HF Safetensors 目录导入；如果当前架构不被 Ollama 支持，会返回真实错误并建议改用 GGUF。'
                : '将通过 ollama create 从本地 GGUF 文件导入。'
        });
    } else if (isOnlinePullTarget && diagnosis.service?.ok && !diagnosis.service?.modelPresent) {
        steps.push({
            id: 'pull_model',
            title: `下载模型 ${diagnosis.model || DEFAULT_MODEL}`,
            severity: 'required',
            requiresNetwork: true,
            description: '将执行 ollama pull 下载模型。模型大小可能较大，请保持网络连接。'
        });
    } else if (isOnlinePullTarget && !diagnosis.service?.ok) {
        steps.push({
            id: 'pull_model',
            title: `下载模型 ${diagnosis.model || DEFAULT_MODEL}`,
            severity: 'required',
            requiresNetwork: true,
            description: '服务启动后将执行 ollama pull 下载模型。'
        });
    }
    if (useLocalModel && localModel.warnings?.length) {
        steps.push({
            id: 'local_model_warning',
            title: '本地模型兼容性提示',
            severity: 'warning',
            description: localModel.warnings.join(' ')
        });
    }
    if (isOnlinePullTarget && !modelPresent && diagnosis.remoteModelStore?.autoSelected) {
        steps.push({
            id: 'ollama_model_store_auto_select',
            title: '自动选择模型仓库',
            severity: 'warning',
            requiresSystemChange: true,
            description: `默认 C 盘 Ollama 仓库空间不足，AILIS 将把模型下载到 ${diagnosis.remoteModelStore.path}。`
        });
    } else if (isOnlinePullTarget && diagnosis.remoteModelStore?.source === 'default_low_space') {
        steps.push({
            id: 'ollama_model_store_low_space',
            title: '模型仓库空间可能不足',
            severity: 'warning',
            description: `默认 Ollama 仓库可用空间约 ${formatGiB(diagnosis.remoteModelStore.freeBytes)}GB，可能不足以下载当前模型。建议清理空间或设置 OLLAMA_MODELS 到更大的磁盘。`
        });
    }
    if (diagnosis.acceleration?.gpu?.driverTooOld) {
        steps.push({
            id: 'ollama_gpu_driver_warning',
            title: 'CUDA 后端兼容提醒',
            severity: 'warning',
            description: `检测到 NVIDIA 驱动 ${diagnosis.acceleration.gpu.driverVersion}；如果 Ollama CUDA 后端不可用或模型实际运行在 CPU，AILIS 会优先尝试 Vulkan GPU 兼容模式，再考虑 CPU 回退。`
        });
    }
    const blockingSteps = steps.filter((step) => step.severity === 'blocking');
    return {
        ok: blockingSteps.length === 0,
        steps,
        requiresNetwork: steps.some((step) => step.requiresNetwork),
        requiresSystemChange: steps.some((step) => step.requiresSystemChange),
        blockingSteps
    };
}

function summarizeFailure(lines = [], exitCode = null) {
    const text = lines.join('\n').toLowerCase();
    if (isOllamaUpgradeRequiredOutput(text)) {
        return {
            code: 'ollama_upgrade_required',
            message: '当前 Ollama 版本过旧，选中的模型要求新版 Ollama。AILIS 会尝试自动升级后重试；如果仍失败，请检查系统安装器或网络。'
        };
    }
    if (isOllamaCudaFailureOutput(text)) {
        return {
            code: 'ollama_gpu_backend_failed',
            message: 'Ollama GPU 后端在推理或部署验证时崩溃。AILIS 会优先重启到 Vulkan GPU 兼容模式并重试；如果仍失败，再考虑 CPU 回退或更小模型。'
        };
    }
    if (isOllamaModelNotFoundOutput(text)) {
        return {
            code: 'model_not_found',
            message: 'Ollama 没有找到这个模型名，请换成 ollama.com/library 中存在的模型，例如 llama3.2 或 qwen2.5:7b。'
        };
    }
    if (/unsupported|unknown architecture|model_type|safetensors/.test(text)) {
        return {
            code: 'local_model_unsupported',
            message: 'Ollama 无法直接导入这个本地 Safetensors 模型，通常是模型架构暂不支持。建议换对应 GGUF/量化版，或使用 Transformers/vLLM 路线。'
        };
    }
    if (/winget.*not recognized|enoent|command not found|executable file not found/.test(text)) {
        return {
            code: 'installer_missing',
            message: '未找到可用的 Ollama 自动安装器。Windows 建议安装 winget，或手动安装 Ollama 后重试。'
        };
    }
    if (/requires administrator|access is denied|permission|sudo/.test(text)) {
        return {
            code: 'permission_required',
            message: 'Ollama 安装或启动需要系统权限，请按安装器提示授权后重试。'
        };
    }
    if (/connection|network|tls|ssl|proxy|timed out|timeout/.test(text)) {
        return {
            code: 'network_or_download',
            message: 'Ollama 安装或模型下载失败，可能是网络、代理或下载源问题。'
        };
    }
    if (/no space|disk|insufficient/.test(text)) {
        return {
            code: 'disk_space',
            message: '磁盘空间不足，无法完成 Ollama 模型下载。'
        };
    }
    return {
        code: 'process_failed',
        message: `Ollama 自动部署进程失败${exitCode === null ? '' : `（exitCode=${exitCode}）`}。请查看日志摘要。`
    };
}

class OllamaLocalRuntime extends EventEmitter {
    constructor({
        platform = process.platform,
        processFactory = spawn,
        env = process.env
    } = {}) {
        super();
        this.platform = platform;
        this.processFactory = processFactory;
        this.env = env;
        this.child = null;
        this.serveChild = null;
        this.deploymentToken = 0;
        this.status = this.createIdleStatus();
    }

    createIdleStatus() {
        return {
            ok: true,
            status: 'idle',
            running: false,
            phase: '',
            modelId: '',
            baseUrl: getBaseUrl(),
            startedAt: '',
            endedAt: '',
            exitCode: null,
            failure: null,
            diagnosis: null,
            installPlan: null,
            logLines: []
        };
    }

    getStatus() {
        return {
            ...this.status,
            logLines: [...(this.status.logLines || [])]
        };
    }

    appendLog(chunk) {
        const nextLines = splitOutputLines(chunk).map(clipLine);
        if (!nextLines.length) {
            return;
        }
        this.status.logLines.push(...nextLines);
        if (this.status.logLines.length > MAX_LOG_LINES) {
            this.status.logLines = this.status.logLines.slice(-MAX_LOG_LINES);
        }
        this.emit('status', this.getStatus());
    }

    setPhase(phase, message = '') {
        this.status = {
            ...this.status,
            phase
        };
        if (message) {
            this.appendLog(`[AILIS Ollama] ${message}`);
        } else {
            this.emit('status', this.getStatus());
        }
    }

    async diagnose(payload = {}) {
        const host = payload.host || DEFAULT_HOST;
        const port = normalizePort(payload.port || DEFAULT_PORT);
        const target = normalizeOllamaTarget(payload);
        const localModelPath = target.source === 'local_import' ? target.localPath : '';
        const localModel = localModelPath
            ? await describeOllamaLocalModelPath(localModelPath, { env: this.env })
            : null;
        const remoteModelSizeBytes = target.source === 'online_pull'
            ? Math.max(0, Number(payload.remoteModelSizeBytes || payload.modelSizeBytes || 0) || 0)
            : 0;
        const remoteModelStore = remoteModelSizeBytes
            ? selectOllamaModelsDir({
                env: this.env,
                requiredBytes: remoteModelSizeBytes
            })
            : null;
        const model = target.modelId;
        const normalizedTarget = {
            ...target,
            modelId: model
        };
        const baseUrl = payload.baseUrl || getBaseUrl({ host, port });
        const cli = await findOllamaExecutable({
            platform: this.platform,
            env: this.env
        });
        const service = await getOllamaServiceState({ baseUrl, model });
        const gpu = await getNvidiaGpuState({ env: this.env });
        const accelerationWarnings = [];
        if (gpu.available && gpu.driverTooOld) {
            accelerationWarnings.push(`NVIDIA 驱动 ${gpu.driverVersion} 低于 Ollama GPU 建议的 ${gpu.minimumDriverVersion}+，可能导致 Ollama 使用 CPU。`);
        }
        const installCommand = buildInstallCommand({ platform: this.platform });
        const upgradeCommand = buildUpgradeCommand({ platform: this.platform });
        const diagnosis = {
            ok: service.ok && service.modelPresent,
            platform: this.platform,
            checkedAt: new Date().toISOString(),
            model,
            target: normalizedTarget,
            targetSource: normalizedTarget.source,
            baseUrl,
            cli,
            service,
            installCommand,
            upgradeCommand,
            localModel,
            remoteModelSizeBytes,
            remoteModelStore,
            acceleration: {
                status: 'not_measured',
                gpu,
                warnings: accelerationWarnings
            },
            installPlan: null
        };
        diagnosis.installPlan = buildInstallPlan(diagnosis);
        this.status = {
            ...this.status,
            diagnosis,
            installPlan: diagnosis.installPlan,
            modelId: model,
            baseUrl
        };
        return diagnosis;
    }

    async inspectInstalledModels(payload = {}) {
        const host = payload.host || DEFAULT_HOST;
        const port = normalizePort(payload.port || DEFAULT_PORT);
        const model = normalizeModelId(payload.modelId || payload.model || DEFAULT_MODEL);
        const baseUrl = payload.baseUrl || getBaseUrl({ host, port });
        const readyTimeoutSec = normalizeReadyTimeoutSec(payload.readyTimeoutSec || 90);
        const cli = await findOllamaExecutable({
            platform: this.platform,
            env: this.env
        });
        let service = await getOllamaServiceState({ baseUrl, model, timeoutMs: 4000 });
        let startedService = false;
        if (!service.ok && cli?.ok && payload.startService !== false) {
            try {
                service = await this.ensureService(cli, {
                    baseUrl,
                    model,
                    readyTimeoutSec,
                    env: this.env
                });
                startedService = true;
            } catch (error) {
                service = {
                    ok: false,
                    baseUrl,
                    model,
                    modelPresent: false,
                    models: [],
                    error: error.message || String(error)
                };
            }
        }
        return {
            ok: Boolean(service.ok),
            checkedAt: new Date().toISOString(),
            baseUrl,
            model,
            modelPresent: Boolean(service.modelPresent),
            models: Array.isArray(service.models) ? service.models : [],
            startedService,
            cli,
            error: service.error || ''
        };
    }

    spawnStep(command, args = [], { label = command, wait = true, env = this.env } = {}) {
        this.appendLog(`[AILIS Ollama] ${label}`);
        const child = this.processFactory(command, args, {
            env,
            windowsHide: true,
            shell: false,
            detached: false
        });
        if (!wait) {
            child.stdout?.on?.('data', (chunk) => this.appendLog(chunk));
            child.stderr?.on?.('data', (chunk) => this.appendLog(chunk));
            child.on?.('error', (error) => this.appendLog(`[AILIS Ollama] ${error.message || error}`));
            return Promise.resolve({ code: 0, child });
        }
        this.child = child;
        let output = '';
        const collectOutput = (chunk) => {
            output += String(chunk || '');
            this.appendLog(chunk);
        };
        child.stdout?.on?.('data', collectOutput);
        child.stderr?.on?.('data', collectOutput);
        return new Promise((resolve, reject) => {
            child.on?.('error', (error) => {
                this.child = null;
                reject(error);
            });
            child.on?.('exit', (code) => {
                this.child = null;
                resolve({ code: Number.isFinite(Number(code)) ? Number(code) : null, child, output });
            });
        });
    }

    async ensureInstalled(diagnosis) {
        if (diagnosis.cli?.ok) {
            return diagnosis.cli;
        }
        const command = diagnosis.installCommand || buildInstallCommand({ platform: this.platform });
        const result = await this.spawnStep(command.command, command.args, {
            label: `安装 Ollama：${command.label || command.command}`
        });
        if (Number(result.code) !== 0) {
            throw Object.assign(new Error(`Ollama installer exited with code ${result.code}`), {
                exitCode: result.code
            });
        }
        const cli = await findOllamaExecutable({
            platform: this.platform,
            env: this.env
        });
        if (!cli.ok) {
            throw new Error('Ollama 安装命令已完成，但仍未找到 ollama CLI。');
        }
        return cli;
    }

    async upgradeOllamaRuntime(diagnosis = {}, { minimum = '', reason = '升级 Ollama' } = {}) {
        const command = diagnosis.upgradeCommand || buildUpgradeCommand({ platform: this.platform });
        let result = await this.spawnStep(command.command, command.args, {
            label: `${reason}：${command.label || command.command}`
        });
        if (Number(result.code) !== 0) {
            const installCommand = diagnosis.installCommand || buildInstallCommand({ platform: this.platform });
            this.appendLog('[AILIS Ollama] 升级命令未完成，尝试使用安装命令安装/覆盖到最新版...');
            result = await this.spawnStep(installCommand.command, installCommand.args, {
                label: `安装/升级 Ollama：${installCommand.label || installCommand.command}`
            });
            if (Number(result.code) !== 0) {
                throw Object.assign(new Error(`Ollama upgrade/install exited with code ${result.code}`), {
                    exitCode: result.code
                });
            }
        }
        let upgradedCli = await findOllamaExecutable({
            platform: this.platform,
            env: this.env
        });
        if (minimum && upgradedCli.ok && !isOllamaVersionAtLeast(upgradedCli.version, minimum)) {
            const installCommand = diagnosis.installCommand || buildInstallCommand({ platform: this.platform });
            this.appendLog(`[AILIS Ollama] 升级后仍是旧版本（${upgradedCli.version || '未知'}），尝试安装/覆盖到最新版...`);
            result = await this.spawnStep(installCommand.command, installCommand.args, {
                label: `安装/覆盖 Ollama：${installCommand.label || installCommand.command}`
            });
            if (Number(result.code) !== 0) {
                throw Object.assign(new Error(`Ollama install exited with code ${result.code}`), {
                    exitCode: result.code
                });
            }
            upgradedCli = await findOllamaExecutable({
                platform: this.platform,
                env: this.env
            });
        }
        if (!upgradedCli.ok) {
            throw new Error('Ollama 升级命令已完成，但仍未找到 ollama CLI。');
        }
        if (minimum && !isOllamaVersionAtLeast(upgradedCli.version, minimum)) {
            throw new Error(`Ollama 升级后版本仍低于 ${minimum}：${upgradedCli.version || '未知版本'}。`);
        }
        return upgradedCli;
    }

    async ensureUpgraded(cli, diagnosis) {
        const target = normalizeOllamaTarget({
            target: diagnosis.target,
            source: diagnosis.targetSource,
            modelId: diagnosis.model,
            localModelPath: diagnosis.localModel?.path || ''
        });
        const localModel = diagnosis.localModel || null;
        const useLocalModel = Boolean(target.source === 'local_import' && localModel?.ok && localModel?.canImportOllama);
        const modelPresent = Boolean(diagnosis.service?.modelPresent);
        const minimum = useLocalModel
            ? (localModel.minimumOllamaVersion || MIN_LOCAL_IMPORT_OLLAMA_VERSION)
            : MIN_REMOTE_PULL_OLLAMA_VERSION;
        const needsRemotePullUpgrade = target.source === 'online_pull' &&
            !modelPresent &&
            cli?.ok &&
            cli.version &&
            !isOllamaVersionAtLeast(cli.version, MIN_REMOTE_PULL_OLLAMA_VERSION);
        const needsLocalImportUpgrade = useLocalModel &&
            (!cli?.ok || !isOllamaVersionAtLeast(cli.version, minimum));
        if (!needsLocalImportUpgrade && !needsRemotePullUpgrade) {
            return { cli, upgraded: false };
        }
        const upgradedCli = await this.upgradeOllamaRuntime(diagnosis, {
            minimum,
            reason: '升级 Ollama'
        });
        return { cli: upgradedCli, upgraded: true };
    }

    async restartServiceAfterUpgrade({ reason = '重启 Ollama 服务', env = this.env } = {}) {
        this.appendLog(`[AILIS Ollama] ${reason}...`);
        if (env?.OLLAMA_MODELS) {
            this.appendLog(`[AILIS Ollama] Ollama 模型仓库：${env.OLLAMA_MODELS}`);
        }
        if (this.platform === 'win32') {
            const result = await this.spawnStep('taskkill', ['/IM', 'ollama.exe', '/F'], {
                label: '停止旧 Ollama 服务：taskkill /IM ollama.exe /F',
                env
            }).catch((error) => ({ code: 1, error }));
            if (Number(result.code) !== 0) {
                this.appendLog('[AILIS Ollama] 没有停止到旧 Ollama 进程，继续尝试启动新服务。');
            }
            const runnerResult = await this.spawnStep('taskkill', ['/IM', 'llama-server.exe', '/F'], {
                label: '停止旧 Ollama 推理进程：taskkill /IM llama-server.exe /F',
                env
            }).catch((error) => ({ code: 1, error }));
            if (Number(runnerResult.code) !== 0) {
                this.appendLog('[AILIS Ollama] 没有停止到旧 llama-server 进程，继续。');
            }
        } else {
            const result = await this.spawnStep('pkill', ['-f', 'ollama serve'], {
                label: '停止旧 Ollama 服务：pkill -f "ollama serve"',
                env
            }).catch((error) => ({ code: 1, error }));
            if (Number(result.code) !== 0) {
                this.appendLog('[AILIS Ollama] 没有停止到旧 Ollama 进程，继续尝试启动新服务。');
            }
            const runnerResult = await this.spawnStep('pkill', ['-f', 'llama-server'], {
                label: '停止旧 Ollama 推理进程：pkill -f "llama-server"',
                env
            }).catch((error) => ({ code: 1, error }));
            if (Number(runnerResult.code) !== 0) {
                this.appendLog('[AILIS Ollama] 没有停止到旧 llama-server 进程，继续。');
            }
        }
        await sleep(1200);
    }

    async ensureService(cli, { baseUrl, model, readyTimeoutSec, env = this.env }) {
        let service = await getOllamaServiceState({ baseUrl, model });
        if (service.ok) {
            return service;
        }
        this.appendLog('[AILIS Ollama] 启动 Ollama 服务...');
        if (env?.OLLAMA_MODELS) {
            this.appendLog(`[AILIS Ollama] 使用模型仓库：${env.OLLAMA_MODELS}`);
            await ensureDirectory(env.OLLAMA_MODELS);
        }
        const child = this.processFactory(cli.command, ['serve'], {
            env,
            windowsHide: true,
            shell: false,
            detached: false
        });
        this.serveChild = child;
        child.stdout?.on?.('data', (chunk) => this.appendLog(chunk));
        child.stderr?.on?.('data', (chunk) => this.appendLog(chunk));
        child.on?.('error', (error) => this.appendLog(`[AILIS Ollama] serve error: ${error.message || error}`));
        child.on?.('exit', (code) => {
            if (this.serveChild === child) {
                this.serveChild = null;
            }
            this.appendLog(`[AILIS Ollama] serve exited with code ${code}`);
        });

        const deadline = Date.now() + normalizeReadyTimeoutSec(readyTimeoutSec) * 1000;
        while (Date.now() < deadline) {
            service = await getOllamaServiceState({ baseUrl, model, timeoutMs: 3000 });
            if (service.ok) {
                return service;
            }
            await new Promise((resolve) => setTimeout(resolve, 1500));
        }
        throw new Error(`Ollama 服务没有在 ${readyTimeoutSec}s 内就绪：${service.error || 'unknown'}`);
    }

    async pullModel(cli, { baseUrl, model, env = this.env }) {
        this.setPhase('pulling', `开始下载或续传 Ollama 模型：${model}`);
        return this.spawnStep(cli.command, ['pull', model], {
            label: `下载 Ollama 模型：${model}`,
            env: buildOllamaClientEnv(env, { baseUrl })
        });
    }

    async ensureModel(cli, { baseUrl, model, readyTimeoutSec, env = this.env, diagnosis = {} }) {
        let service = await getOllamaServiceState({ baseUrl, model });
        if (service.ok && service.modelPresent) {
            return { service, cli };
        }
        let activeCli = cli;
        let activeEnv = env;
        let result = await this.pullModel(activeCli, { baseUrl, model, env: activeEnv });
        if (Number(result.code) !== 0 && isOllamaUpgradeRequiredOutput(result.output)) {
            this.appendLog('[AILIS Ollama] 当前 Ollama 版本过旧，自动升级后重试下载...');
            activeCli = await this.upgradeOllamaRuntime(diagnosis, {
                minimum: MIN_REMOTE_PULL_OLLAMA_VERSION,
                reason: '模型要求新版，升级 Ollama'
            });
            await this.restartServiceAfterUpgrade({
                reason: '升级后重启 Ollama 服务',
                env: activeEnv
            });
            await this.ensureService(activeCli, { baseUrl, model, readyTimeoutSec, env: activeEnv });
            result = await this.pullModel(activeCli, { baseUrl, model, env: activeEnv });
        }
        if (Number(result.code) !== 0 && isOllamaCudaFailureOutput(result.output)) {
            this.appendLog('[AILIS Ollama] 下载期间检测到 Ollama CUDA 后端崩溃，切换 Vulkan GPU 兼容模式后续传下载...');
            this.setPhase('switching_backend', '下载期间后端崩溃，切换 Vulkan GPU 兼容模式...');
            activeEnv = buildOllamaRuntimeEnv(this.env, diagnosis.localModel?.ok ? diagnosis.localModel : null, {
                modelStore: diagnosis.remoteModelStore,
                requiredBytes: diagnosis.remoteModelSizeBytes,
                forceVulkan: true
            });
            await this.restartServiceAfterUpgrade({
                reason: '下载期间后端崩溃，切换 Vulkan GPU 兼容模式',
                env: activeEnv
            });
            await this.ensureService(activeCli, { baseUrl, model, readyTimeoutSec, env: activeEnv });
            result = await this.pullModel(activeCli, { baseUrl, model, env: activeEnv });
        }
        if (Number(result.code) !== 0) {
            throw Object.assign(new Error(`ollama pull exited with code ${result.code}`), {
                exitCode: result.code
            });
        }
        const deadline = Date.now() + normalizeReadyTimeoutSec(readyTimeoutSec) * 1000;
        while (Date.now() < deadline) {
            service = await getOllamaServiceState({ baseUrl, model, timeoutMs: 3000 });
            if (service.ok && service.modelPresent) {
                return { service, cli: activeCli, env: activeEnv };
            }
            await new Promise((resolve) => setTimeout(resolve, 1500));
        }
        throw new Error(`模型 ${model} 下载后没有出现在 Ollama 模型列表中。`);
    }

    async ensureLocalModel(cli, { baseUrl, model, localModel, readyTimeoutSec, env = this.env }) {
        let service = await getOllamaServiceState({ baseUrl, model });
        if (service.ok && service.modelPresent) {
            return service;
        }
        if (!localModel?.ok || !localModel?.canImportOllama) {
            throw new Error((localModel?.blockers || []).join('；') || '本地模型路径不可导入。');
        }
        if (localModel.ollamaModelsDir) {
            await ensureDirectory(localModel.ollamaModelsDir);
            this.appendLog(`[AILIS Ollama] 本地模型导入，不下载权重；目标模型仓库：${localModel.ollamaModelsDir}`);
        }
        const tempDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'ailis-ollama-'));
        const modelfilePath = path.join(tempDir, 'Modelfile');
        await fs.promises.writeFile(modelfilePath, buildModelfileContent({
            localModel,
            temperature: localModel.temperature,
            topP: localModel.topP
        }), 'utf8');
        this.appendLog(`[AILIS Ollama] 导入本地模型：${localModel.importPath || localModel.path}`);
        this.appendLog(`[AILIS Ollama] Modelfile：${modelfilePath}`);
        const result = await this.spawnStep(cli.command, ['create', model, '-f', modelfilePath], {
            label: `导入本地模型到 Ollama：${model}`,
            env: buildOllamaClientEnv(env, { baseUrl, localModel })
        });
        if (Number(result.code) !== 0) {
            throw Object.assign(new Error(`ollama create exited with code ${result.code}`), {
                exitCode: result.code
            });
        }
        const deadline = Date.now() + normalizeReadyTimeoutSec(readyTimeoutSec) * 1000;
        while (Date.now() < deadline) {
            service = await getOllamaServiceState({ baseUrl, model, timeoutMs: 3000 });
            if (service.ok && service.modelPresent) {
                return service;
            }
            await new Promise((resolve) => setTimeout(resolve, 1500));
        }
        throw new Error(`本地模型 ${model} 导入后没有出现在 Ollama 模型列表中。`);
    }

    async runDeployment({ diagnosis, baseUrl, model, readyTimeoutSec, token }) {
        try {
            const target = normalizeOllamaTarget({
                target: diagnosis.target,
                source: diagnosis.targetSource,
                modelId: model,
                localModelPath: diagnosis.localModel?.path || ''
            });
            const isLocalImportTarget = target.source === 'local_import';
            const isOnlinePullTarget = target.source === 'online_pull';
            const isInstalledTarget = target.source === 'installed';
            if (isLocalImportTarget && diagnosis.localModel?.path && (!diagnosis.localModel.ok || !diagnosis.localModel.canImportOllama)) {
                throw new Error(
                    [
                        ...(diagnosis.localModel.blockers || []),
                        ...(diagnosis.localModel.warnings || [])
                    ].filter(Boolean).join('；') || '本地模型路径不可导入。'
                );
            }
            const localModel = isLocalImportTarget && diagnosis.localModel?.ok ? diagnosis.localModel : null;
            const preferVulkan = shouldPreferVulkanForDeployment(diagnosis);
            let runtimeEnv = buildOllamaRuntimeEnv(this.env, localModel, {
                modelStore: isOnlinePullTarget ? diagnosis.remoteModelStore : null,
                requiredBytes: isOnlinePullTarget ? diagnosis.remoteModelSizeBytes : 0,
                forceVulkan: preferVulkan
            });
            if (preferVulkan) {
                this.appendLog('[AILIS Ollama] 当前 Windows/CUDA 后端风险较高，部署阶段直接使用 Vulkan GPU 兼容模式。');
            }
            if (localModel?.ollamaModelsDir) {
                await ensureDirectory(localModel.ollamaModelsDir);
            }
            this.setPhase('preparing', '检查并准备 Ollama 本地运行时...');
            let cli = await this.ensureInstalled(diagnosis);
            const upgradeResult = await this.ensureUpgraded(cli, diagnosis);
            cli = upgradeResult.cli;
            const shouldRestartForLocalImport = Boolean(isLocalImportTarget && localModel?.canImportOllama && !diagnosis.service?.modelPresent);
            const shouldRestartForRemoteStore = Boolean(isOnlinePullTarget && diagnosis.remoteModelStore?.autoSelected && !diagnosis.service?.modelPresent);
            const shouldRestartForPreferredBackend = Boolean(preferVulkan && diagnosis.service?.ok);
            if (upgradeResult.upgraded || shouldRestartForLocalImport || shouldRestartForRemoteStore || shouldRestartForPreferredBackend) {
                await this.restartServiceAfterUpgrade({
                    reason: upgradeResult.upgraded
                        ? '升级后重启 Ollama 服务'
                        : shouldRestartForRemoteStore
                            ? '切换模型仓库后重启 Ollama 服务'
                            : shouldRestartForPreferredBackend
                                ? '切换 Vulkan GPU 兼容模式后重启 Ollama 服务'
                                : '本地模型导入前重启 Ollama 服务',
                    env: runtimeEnv
                });
            }
            this.setPhase('starting_service', '启动或复用 Ollama 服务...');
            await this.ensureService(cli, { baseUrl, model, readyTimeoutSec, env: runtimeEnv });
            let service = null;
            if (isLocalImportTarget) {
                this.setPhase('importing', `导入本地 Ollama 模型：${model}`);
                service = await this.ensureLocalModel(cli, {
                    baseUrl,
                    model,
                    localModel: diagnosis.localModel,
                    readyTimeoutSec,
                    env: runtimeEnv
                });
            } else if (isOnlinePullTarget) {
                const modelResult = await this.ensureModel(cli, {
                    baseUrl,
                    model,
                    readyTimeoutSec,
                    env: runtimeEnv,
                    diagnosis
                });
                service = modelResult.service;
                cli = modelResult.cli || cli;
                runtimeEnv = modelResult.env || runtimeEnv;
            } else if (isInstalledTarget) {
                service = await getOllamaServiceState({ baseUrl, model, timeoutMs: 5000 });
                if (!service.ok || !service.modelPresent) {
                    throw new Error(
                        `本机 Ollama 没有已安装模型 ${model}。请选择 ollama list 中存在的模型，或切换到“在线搜索下载”后再下载。`
                    );
                }
            }
            this.setPhase('verifying', '验证模型推理可用性...');
            this.appendLog('[AILIS Ollama] 验证模型推理可用性...');
            let smoke = await smokeTestOllamaModel({ baseUrl, model });
            let cpuFallback = false;
            let gpuFallback = '';
            if (!smoke.ok && isOllamaCudaFailureOutput(smoke.error)) {
                this.appendLog('[AILIS Ollama] CUDA 推理失败，先自动切换到 Vulkan GPU 兼容模式后重试...');
                this.setPhase('switching_backend', 'CUDA 推理失败，切换 Vulkan GPU 兼容模式...');
                runtimeEnv = buildOllamaRuntimeEnv(this.env, localModel, {
                    modelStore: isOnlinePullTarget ? diagnosis.remoteModelStore : null,
                    requiredBytes: isOnlinePullTarget ? diagnosis.remoteModelSizeBytes : 0,
                    forceVulkan: true
                });
                await this.restartServiceAfterUpgrade({
                    reason: 'CUDA 推理失败，切换 Vulkan GPU 兼容模式',
                    env: runtimeEnv
                });
                service = await this.ensureService(cli, { baseUrl, model, readyTimeoutSec, env: runtimeEnv });
                smoke = await smokeTestOllamaModel({ baseUrl, model });
                gpuFallback = smoke.ok ? 'vulkan' : '';
            }
            if (!smoke.ok && gpuFallback === '') {
                this.appendLog('[AILIS Ollama] Vulkan GPU 兼容模式仍失败，自动切换到 CPU 兼容模式后重试...');
                this.setPhase('switching_backend', 'Vulkan 验证失败，切换 CPU 兼容模式...');
                runtimeEnv = buildOllamaRuntimeEnv(this.env, localModel, {
                    modelStore: isOnlinePullTarget ? diagnosis.remoteModelStore : null,
                    requiredBytes: isOnlinePullTarget ? diagnosis.remoteModelSizeBytes : 0,
                    forceCpu: true
                });
                await this.restartServiceAfterUpgrade({
                    reason: 'GPU 推理失败，切换 CPU 兼容模式',
                    env: runtimeEnv
                });
                service = await this.ensureService(cli, { baseUrl, model, readyTimeoutSec, env: runtimeEnv });
                smoke = await smokeTestOllamaModel({ baseUrl, model });
                cpuFallback = true;
            }
            if (!smoke.ok) {
                throw new Error(`Ollama 模型已安装，但推理验证失败：${smoke.error || 'unknown error'}`);
            }
            let acceleration = await diagnoseOllamaAcceleration(cli, {
                baseUrl,
                model,
                env: runtimeEnv,
                smoke
            });
            if (acceleration.cpuOnly && acceleration.gpu?.available && gpuFallback !== 'vulkan') {
                this.appendLog('[AILIS Ollama] 检测到当前模型实际运行在 CPU，自动切换到 Vulkan GPU 兼容模式后重试...');
                this.setPhase('switching_backend', '检测到 CPU 运行，切换 Vulkan GPU 兼容模式...');
                runtimeEnv = buildOllamaRuntimeEnv(this.env, localModel, {
                    modelStore: isOnlinePullTarget ? diagnosis.remoteModelStore : null,
                    requiredBytes: isOnlinePullTarget ? diagnosis.remoteModelSizeBytes : 0,
                    forceVulkan: true
                });
                await this.restartServiceAfterUpgrade({
                    reason: '当前模型运行在 CPU，切换 Vulkan GPU 兼容模式',
                    env: runtimeEnv
                });
                service = await this.ensureService(cli, { baseUrl, model, readyTimeoutSec, env: runtimeEnv });
                smoke = await smokeTestOllamaModel({ baseUrl, model });
                if (smoke.ok) {
                    gpuFallback = 'vulkan';
                    cpuFallback = false;
                    acceleration = await diagnoseOllamaAcceleration(cli, {
                        baseUrl,
                        model,
                        env: runtimeEnv,
                        smoke
                    });
                } else {
                    this.appendLog('[AILIS Ollama] Vulkan GPU 兼容模式未通过，回退到 CPU 兼容模式...');
                    this.setPhase('switching_backend', 'Vulkan GPU 兼容模式未通过，切换 CPU 兼容模式...');
                    runtimeEnv = buildOllamaRuntimeEnv(this.env, localModel, {
                        modelStore: isOnlinePullTarget ? diagnosis.remoteModelStore : null,
                        requiredBytes: isOnlinePullTarget ? diagnosis.remoteModelSizeBytes : 0,
                        forceCpu: true
                    });
                    await this.restartServiceAfterUpgrade({
                        reason: 'Vulkan GPU 兼容模式失败，切换 CPU 兼容模式',
                        env: runtimeEnv
                    });
                    service = await this.ensureService(cli, { baseUrl, model, readyTimeoutSec, env: runtimeEnv });
                    smoke = await smokeTestOllamaModel({ baseUrl, model });
                    cpuFallback = true;
                    if (!smoke.ok) {
                        throw new Error(`Ollama 模型已安装，但推理验证失败：${smoke.error || 'unknown error'}`);
                    }
                    acceleration = await diagnoseOllamaAcceleration(cli, {
                        baseUrl,
                        model,
                        env: runtimeEnv,
                        smoke
                    });
                }
            }
            for (const warning of acceleration.warnings || []) {
                this.appendLog(`[AILIS Ollama] 性能提示：${warning}`);
            }
            if (token !== this.deploymentToken) {
                return;
            }
            const nextDiagnosis = {
                ...diagnosis,
                ok: true,
                cli,
                service,
                cpuFallback,
                gpuFallback,
                acceleration,
                installPlan: buildInstallPlan({
                    ...diagnosis,
                    cli,
                    service
                })
            };
            this.status = {
                ...this.status,
                ok: true,
                status: 'ready',
                running: false,
                phase: 'ready',
                endedAt: new Date().toISOString(),
                exitCode: 0,
                failure: null,
                diagnosis: nextDiagnosis,
                installPlan: nextDiagnosis.installPlan
            };
            this.appendLog(`[AILIS Ollama] 部署完成：${baseUrl}，模型：${model}`);
            this.emit('status', this.getStatus());
        } catch (error) {
            if (token !== this.deploymentToken) {
                return;
            }
            const exitCode = Number.isFinite(Number(error.exitCode)) ? Number(error.exitCode) : null;
            this.status = {
                ...this.status,
                ok: false,
                status: 'failed',
                running: false,
                phase: 'failed',
                endedAt: new Date().toISOString(),
                exitCode,
                failure: summarizeFailure([
                    ...(this.status.logLines || []),
                    error.message || String(error)
                ], exitCode)
            };
            this.appendLog(`[AILIS Ollama] 失败：${error.message || error}`);
            this.emit('status', this.getStatus());
        }
    }

    async start(payload = {}) {
        if (this.status.status === 'running') {
            return {
                ...this.getStatus(),
                ok: false,
                error: '已有 Ollama 部署任务正在运行。'
            };
        }
        const host = payload.host || DEFAULT_HOST;
        const port = normalizePort(payload.port || DEFAULT_PORT);
        const target = normalizeOllamaTarget(payload);
        const localModelPath = target.source === 'local_import' ? target.localPath : '';
        const remoteModelSizeBytes = target.source === 'online_pull'
            ? Math.max(0, Number(payload.remoteModelSizeBytes || payload.modelSizeBytes || 0) || 0)
            : 0;
        const model = target.modelId;
        const baseUrl = payload.baseUrl || getBaseUrl({ host, port });
        const readyTimeoutSec = normalizeReadyTimeoutSec(payload.readyTimeoutSec || DEFAULT_READY_TIMEOUT_SEC);
        const diagnosis = await this.diagnose({
            host,
            port,
            modelId: model,
            baseUrl,
            target,
            localModelPath,
            remoteModelSizeBytes
        });

        this.status = {
            ok: true,
            status: 'running',
            running: true,
            phase: 'diagnosing',
            modelId: model,
            baseUrl,
            startedAt: new Date().toISOString(),
            endedAt: '',
            exitCode: null,
            failure: null,
            diagnosis,
            installPlan: diagnosis.installPlan,
            logLines: [
                `[AILIS Ollama] 自动配置已启动：${model}`,
                `[AILIS Ollama] 部署方式：${target.source}`,
                `[AILIS Ollama] API Base：${baseUrl}`,
                localModelPath ? `[AILIS Ollama] 本地模型路径：${localModelPath}` : '',
                diagnosis.remoteModelStore?.autoSelected
                    ? `[AILIS Ollama] 模型仓库空间自动选择：${diagnosis.remoteModelStore.path}`
                    : ''
            ].filter(Boolean)
        };
        this.emit('status', this.getStatus());

        const token = ++this.deploymentToken;
        void this.runDeployment({ diagnosis, baseUrl, model, readyTimeoutSec, token });
        return this.getStatus();
    }

    cancel() {
        this.deploymentToken += 1;
        if (this.child) {
            try {
                this.child.kill();
            } catch {
                // Ignore kill races.
            }
            this.child = null;
        }
        if (this.serveChild) {
            try {
                this.serveChild.kill();
            } catch {
                // Ignore kill races.
            }
            this.serveChild = null;
        }
        this.status = {
            ...this.status,
            ok: false,
            status: 'cancelled',
            running: false,
            phase: 'cancelled',
            endedAt: new Date().toISOString(),
            failure: {
                code: 'cancelled',
                message: '用户已取消 Ollama 自动配置任务。'
            }
        };
        this.emit('status', this.getStatus());
        return this.getStatus();
    }
}

module.exports = {
    OllamaLocalRuntime,
    buildInstallCommand,
    buildInstallPlan,
    buildOllamaRuntimeEnv,
    buildModelfileContent,
    buildUpgradeCommand,
    compareVersions,
    compareNumericVersions,
    describeOllamaLocalModelPath,
    diagnoseOllamaAcceleration,
    extractOllamaVersionText,
    findOllamaExecutable,
    getBaseUrl,
    getNvidiaGpuState,
    getOllamaServiceState,
    inferLocalModelName,
    isOllamaCudaFailureOutput,
    isOllamaUpgradeRequiredOutput,
    isOllamaVersionAtLeast,
    normalizeModelId,
    normalizeOllamaTarget,
    normalizeOllamaTargetSource,
    parseOllamaPsOutput,
    parseOllamaVersion,
    summarizeFailure
};
