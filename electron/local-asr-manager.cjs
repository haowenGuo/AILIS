const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { spawn, execFile } = require('child_process');
const { promisify } = require('util');
const { getVenvPythonPath } = require('./voice-runtime-bootstrap.cjs');
const execFileAsync = promisify(execFile);

const PACKAGED_ASR_RUNTIME_DIRNAME = 'ailis-asr-runtime';
const SPEECH_MODEL_DIRNAME = 'speech-models';

function normalizeString(value) {
    return String(value || '').trim();
}

function safeStat(filePath) {
    try {
        return fs.statSync(filePath);
    } catch {
        return null;
    }
}

function isDirectory(filePath) {
    return Boolean(safeStat(filePath)?.isDirectory());
}

function isFile(filePath) {
    return Boolean(safeStat(filePath)?.isFile());
}

function uniqueCandidates(candidates = []) {
    const seen = new Set();
    return candidates.filter((candidate) => {
        const key = path.resolve(normalizeString(candidate || '')).toLowerCase();
        if (!key || seen.has(key)) {
            return false;
        }
        seen.add(key);
        return true;
    });
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

async function probeAsrPython({ command, args = [], env = {} }) {
    const engine = String(process.env.AILIS_ASR_ENGINE || process.env.AILIS_ASR_PROVIDER || 'whisper').trim().toLowerCase();
    const probe = [
        'import sys, numpy, torch',
        ['sensevoice', 'sensevoice-small', 'funasr'].includes(engine)
            ? 'from funasr import AutoModel'
            : 'from transformers import AutoModelForSpeechSeq2Seq, AutoProcessor, pipeline; from torchaudio.functional import resample; import accelerate',
        'assert torch.zeros(1).sum().item() == 0',
        'print(sys.executable)'
    ].join('; ');
    try {
        await execFileAsync(command, [...args, '-c', probe], {
            windowsHide: true,
            timeout: 60000,
            maxBuffer: 1024 * 1024,
            encoding: 'utf8',
            env: { ...process.env, ...env, PYTHONIOENCODING: 'utf-8' }
        });
        return { ok: true };
    } catch (error) {
        const detail = String(error.stderr || error.message || error).trim();
        return { ok: false, error: error.killed ? 'Python dependency check timed out (60s)' : detail };
    }
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

function normalizeBinaryPayload(payload) {
    if (!payload) {
        return Buffer.alloc(0);
    }

    if (Buffer.isBuffer(payload)) {
        return payload;
    }

    if (payload instanceof Uint8Array) {
        return Buffer.from(payload);
    }

    if (ArrayBuffer.isView(payload)) {
        return Buffer.from(payload.buffer, payload.byteOffset, payload.byteLength);
    }

    if (payload instanceof ArrayBuffer) {
        return Buffer.from(payload);
    }

    if (Array.isArray(payload)) {
        return Buffer.from(payload);
    }

    if (payload.audioBytes) {
        return normalizeBinaryPayload(payload.audioBytes);
    }

    throw new Error('无法解析语音识别音频数据');
}

function isPlainTranscribePayload(payload) {
    return Boolean(
        payload &&
        typeof payload === 'object' &&
        !Buffer.isBuffer(payload) &&
        !(payload instanceof Uint8Array) &&
        !(payload instanceof ArrayBuffer) &&
        !ArrayBuffer.isView(payload) &&
        !Array.isArray(payload)
    );
}

function normalizeAsrPreset(value) {
    const normalizedValue = String(value || '').trim().toLowerCase();
    if (['fast', 'low-latency', 'low_latency', 'realtime'].includes(normalizedValue)) {
        return 'fast';
    }
    return 'balanced';
}

function getProjectRoot() {
    return path.resolve(__dirname, '..');
}

function normalizeTranscribePayload(payload) {
    const audioBytes = normalizeBinaryPayload(payload);
    const rawPreset = isPlainTranscribePayload(payload)
        ? payload.preset || payload.options?.preset || payload.asrPreset
        : '';
    return {
        audioBytes,
        preset: normalizeAsrPreset(rawPreset)
    };
}

class DesktopASRManager {
    constructor({ app, getRuntimePaths = () => null, probePython = probeAsrPython }) {
        this.app = app;
        this.getRuntimePaths = getRuntimePaths;
        this.probePython = probePython;
        this.generation = 0;
        this.workerStartPromise = null;
        this.child = null;
        this.pending = new Map();
        this.nextRequestId = 1;
        this.pythonCommand = null;
        this.warmupPromise = null;
    }

    getCacheDir() {
        return normalizeString(process.env.AILIS_ASR_CACHE_DIR) ||
            this.getRuntimePaths()?.asrCacheDir ||
            path.join(this.app.getPath('userData'), 'asr-cache');
    }

    getLegacyCacheDirs() {
        const appDataDir = this.app.getPath('appData');
        return [
            path.join(appDataDir, 'ailis', 'asr-cache'),
            path.join(appDataDir, 'AIGril', 'asr-cache')
        ].filter((candidate) => candidate !== this.getCacheDir());
    }

    cacheHasModel(cacheDir) {
        try {
            if (!cacheDir || !fs.existsSync(cacheDir)) {
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

    getPackagedAsrRuntimeRoots() {
        const candidates = [
            process.env.AILIS_ASR_RUNTIME_DIR,
            process.resourcesPath ? path.join(process.resourcesPath, PACKAGED_ASR_RUNTIME_DIRNAME) : '',
            path.join(getProjectRoot(), 'build-cache', PACKAGED_ASR_RUNTIME_DIRNAME),
            path.join(getProjectRoot(), '.ailis-runtime', 'asr-runtime')
        ];
        return uniqueCandidates(candidates).filter((candidate) => isDirectory(candidate));
    }

    getAsrRuntimeManifest(runtimeRoot) {
        return readJsonFile(path.join(runtimeRoot, 'manifest.json')) || {};
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
            path.join(getProjectRoot(), 'Resources', SPEECH_MODEL_DIRNAME, 'asr-cache'),
            path.join(getProjectRoot(), 'Resources', SPEECH_MODEL_DIRNAME),
            path.join(getProjectRoot(), 'dist', 'Resources', SPEECH_MODEL_DIRNAME, 'asr-cache'),
            path.join(getProjectRoot(), 'dist', 'Resources', SPEECH_MODEL_DIRNAME)
        ];
        return uniqueCandidates([...runtimeCacheDirs, ...speechModelDirs])
            .filter((candidate) => isDirectory(candidate));
    }

    resolveCacheDir() {
        const currentCacheDir = this.getCacheDir();
        if (this.cacheHasModel(currentCacheDir)) {
            return currentCacheDir;
        }

        const legacyCacheDir = this.getLegacyCacheDirs().find((candidate) => this.cacheHasModel(candidate));
        if (legacyCacheDir) {
            console.log(`[ASR] 当前缓存为空，复用旧模型缓存：${legacyCacheDir}`);
            return legacyCacheDir;
        }

        const packagedCacheDir = this.getPackagedAsrCacheDirs()
            .find((candidate) => this.cacheHasModel(candidate));
        if (packagedCacheDir) {
            console.log(`[ASR] 使用随包本地模型缓存：${packagedCacheDir}`);
            return packagedCacheDir;
        }

        return currentCacheDir;
    }

    getWorkerScriptPath() {
        if (this.app.isPackaged) {
            return path.join(process.resourcesPath, 'app.asar.unpacked', 'electron', 'desktop_asr_worker.py');
        }

        return path.join(__dirname, 'desktop_asr_worker.py');
    }

    async resolvePythonCommand() {
        if (this.pythonCommand) {
            return this.pythonCommand;
        }

        const projectRoot = getProjectRoot();
        const generation = this.generation;
        const runtimePaths = this.getRuntimePaths();
        const envPython = String(process.env.AILIS_PYTHON || '').trim();
        const envVoicePython = String(process.env.AILIS_VOICE_PYTHON || '').trim();
        const envAsrPython = String(process.env.AILIS_ASR_PYTHON || '').trim();
        const privateVoicePython = getVenvPythonPath(
            path.join(this.app.getPath('userData'), 'local-runtimes', 'voice-venv'),
            process.platform
        );
        const projectVoicePython = getVenvPythonPath(
            path.join(projectRoot, 'build-cache', 'cosyvoice3-venv'),
            process.platform
        );
        const candidates = [];

        if (envAsrPython) {
            candidates.push({
                source: 'AILIS_ASR_PYTHON',
                command: envAsrPython,
                args: []
            });
        }

        for (const runtimeRoot of this.getPackagedAsrRuntimeRoots()) {
            const manifest = this.getAsrRuntimeManifest(runtimeRoot);
            const runtimeEnv = buildRuntimeEnv(runtimeRoot, manifest);
            const manifestPython = normalizeRelativePath(runtimeRoot, manifest.asrPython || manifest.python);
            if (manifestPython) {
                candidates.push({
                    source: 'packaged-asr-runtime',
                    command: manifestPython,
                    args: [],
                    env: runtimeEnv
                });
            }

            const asrVenvDir = normalizeRelativePath(runtimeRoot, manifest.asrVenv || 'asr-venv');
            candidates.push({
                source: 'packaged-asr-runtime',
                command: getVenvPythonPath(asrVenvDir, process.platform),
                args: [],
                env: runtimeEnv
            });
        }

        if (runtimePaths?.voiceVenvPython) {
            candidates.push({
                source: 'configured-voice-runtime',
                command: runtimePaths.voiceVenvPython,
                args: [],
                env: { PYTHONNOUSERSITE: '1', PYTHONPATH: '' }
            });
        }

        if (envVoicePython) {
            candidates.push({
                source: 'AILIS_VOICE_PYTHON',
                command: envVoicePython,
                args: []
            });
        }

        if (envPython) {
            candidates.push({
                source: 'AILIS_PYTHON',
                command: envPython,
                args: []
            });
        }

        candidates.push(
            { source: 'voice-venv', command: privateVoicePython, args: [] },
            { source: 'cosyvoice3-venv', command: projectVoicePython, args: [] }
        );

        candidates.push(
            { source: 'python', command: 'python', args: [] },
            { source: 'py-3.12', command: 'py', args: ['-3.12'] },
            { source: 'py', command: 'py', args: [] }
        );

        const failures = [];
        const seen = new Set();
        for (const candidate of candidates) {
            if (!candidate.command) {
                continue;
            }
            if (
                path.isAbsolute(candidate.command) &&
                !fs.existsSync(candidate.command)
            ) {
                continue;
            }
            const key = JSON.stringify([candidate.command, candidate.args, candidate.env]);
            if (seen.has(key)) continue;
            seen.add(key);
            const result = await this.probePython(candidate);
            if (generation !== this.generation) throw new Error('ASR runtime configuration changed; retry the request');
            if (result.ok) {
                this.pythonCommand = candidate;
                console.log(`[ASR] Verified Python (${candidate.source}): ${candidate.command}`);
                return candidate;
            }
            console.warn(`[ASR] Rejected Python ${candidate.command}: ${result.error}`);
            const lastLine = String(result.error || 'Dependency import failed').split(/\r?\n/).filter(Boolean).at(-1);
            failures.push(`${candidate.command} ${candidate.args.join(' ')}: ${lastLine}`);
        }

        throw new Error(`本地语音识别运行环境不可用，请在控制面板检查语音安装目录并修复 ASR 依赖。\n${failures.join('\n')}`);
    }

    ensureWorker() {
        if (!this.workerStartPromise) {
            const promise = this.startWorker();
            this.workerStartPromise = promise;
            promise.finally(() => {
                if (this.workerStartPromise === promise) this.workerStartPromise = null;
            }).catch(() => {});
        }
        return this.workerStartPromise;
    }

    async startWorker() {
        if (this.child && !this.child.killed) {
            return this.child;
        }

        const workerScriptPath = this.getWorkerScriptPath();
        if (!fs.existsSync(workerScriptPath)) {
            throw new Error(`本地语音识别脚本不存在：${workerScriptPath}`);
        }

        const generation = this.generation;
        const python = await this.resolvePythonCommand();
        if (generation !== this.generation) throw new Error('ASR runtime configuration changed; retry the request');
        const cacheDir = this.resolveCacheDir();
        const child = spawn(
            python.command,
            [...python.args, '-u', workerScriptPath],
            {
                cwd: path.dirname(workerScriptPath),
                windowsHide: true,
                stdio: ['pipe', 'pipe', 'pipe'],
                env: {
                    ...process.env,
                    ...(python.env || {}),
                    PYTHONIOENCODING: 'utf-8',
                    AILIS_PROJECT_ROOT: getProjectRoot(),
                    AILIS_USER_DATA: this.app.getPath('userData'),
                    AILIS_ASR_MODEL_ID: process.env.AILIS_ASR_MODEL_ID || 'openai/whisper-small',
                    AILIS_ASR_MODEL_ENDPOINT: process.env.AILIS_ASR_MODEL_ENDPOINT || '',
                    AILIS_ASR_LOCAL_ONLY: process.env.AILIS_ASR_LOCAL_ONLY || '1',
                    AILIS_ASR_LANGUAGE: process.env.AILIS_ASR_LANGUAGE || 'zh',
                    AILIS_ASR_TASK: process.env.AILIS_ASR_TASK || 'transcribe',
                    AILIS_ASR_CHUNK_LENGTH_S: process.env.AILIS_ASR_CHUNK_LENGTH_S || '15',
                    AILIS_ASR_BATCH_SIZE: process.env.AILIS_ASR_BATCH_SIZE || '4',
                    AILIS_ASR_CACHE_DIR: cacheDir
                }
            }
        );

        const lineReader = readline.createInterface({
            input: child.stdout
        });

        lineReader.on('line', (line) => {
            const trimmedLine = String(line || '').trim();
            if (!trimmedLine) {
                return;
            }

            let payload = null;
            try {
                payload = JSON.parse(trimmedLine);
            } catch (error) {
                console.warn('[ASR] 无法解析 worker 输出：', trimmedLine);
                return;
            }

            if (!payload?.id) {
                if (payload?.type === 'ready') {
                    console.log('[ASR] 本地识别 worker 已启动');
                }
                return;
            }

            const pendingRequest = this.pending.get(String(payload.id));
            if (!pendingRequest) {
                return;
            }

            this.pending.delete(String(payload.id));
            clearTimeout(pendingRequest.timeoutId);

            if (payload.ok) {
                pendingRequest.resolve(payload.result || {});
                return;
            }

            pendingRequest.reject(new Error(payload.error || '本地语音识别失败'));
        });

        child.stderr.on('data', (chunk) => {
            const message = String(chunk || '').trim();
            if (message) {
                console.log(`[ASR] ${message}`);
            }
        });

        child.on('close', (code, signal) => {
            if (this.child === child) {
                this.child = null;
                this.warmupPromise = null;
            }

            const errorMessage = code === 0 && !signal
                ? '本地语音识别进程已退出'
                : `本地语音识别进程已退出（code=${code ?? 'null'}, signal=${signal ?? 'null'}）`;

            for (const [requestId, pendingRequest] of this.pending.entries()) {
                if (pendingRequest.child !== child) continue;
                clearTimeout(pendingRequest.timeoutId);
                pendingRequest.reject(new Error(errorMessage));
                this.pending.delete(requestId);
            }
        });

        child.on('error', (error) => {
            console.error('[ASR] 无法启动本地识别 worker：', error);
        });

        this.child = child;
        return child;
    }

    async sendRequest(action, payload = {}) {
        const child = await this.ensureWorker();
        const requestId = String(this.nextRequestId++);
        const requestPayload = {
            id: requestId,
            action,
            ...payload
        };

        return new Promise((resolve, reject) => {
            const timeoutId = setTimeout(() => {
                this.pending.delete(requestId);
                reject(new Error('本地语音识别请求超时'));
            }, 10 * 60 * 1000);

            this.pending.set(requestId, {
                child,
                resolve,
                reject,
                timeoutId
            });

            try {
                child.stdin.write(`${JSON.stringify(requestPayload)}\n`);
            } catch (error) {
                clearTimeout(timeoutId);
                this.pending.delete(requestId);
                reject(error);
            }
        });
    }

    async transcribeAudioBytes(payload) {
        const { audioBytes, preset } = normalizeTranscribePayload(payload);
        if (!audioBytes.length) {
            throw new Error('录音内容为空');
        }

        const startedAt = Date.now();
        const result = await this.sendRequest('transcribe', {
            audioBase64: audioBytes.toString('base64'),
            preset
        });
        return {
            ...(result || {}),
            preset: result?.preset || preset,
            manager_timing: {
                total_seconds: Number(((Date.now() - startedAt) / 1000).toFixed(3))
            }
        };
    }

    warmup() {
        if (this.warmupPromise) {
            return this.warmupPromise;
        }

        const promise = this.sendRequest('warmup')
            .catch((error) => {
                if (this.warmupPromise === promise) this.warmupPromise = null;
                throw error;
            });
        this.warmupPromise = promise;
        return promise;
    }

    close() {
        this.generation += 1;
        this.pythonCommand = null;
        this.warmupPromise = null;
        this.workerStartPromise = null;
        for (const pending of this.pending.values()) {
            clearTimeout(pending.timeoutId);
            pending.reject(new Error('本地语音识别运行时已关闭或配置已变更，请重新识别。'));
        }
        this.pending.clear();
        if (!this.child || this.child.killed) {
            return;
        }

        try {
            this.child.kill();
        } catch (error) {
            console.warn('[ASR] 关闭 worker 失败：', error);
        } finally {
            this.child = null;
        }
    }
}

module.exports = {
    DesktopASRManager,
    probeAsrPython
};
