const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { spawn, spawnSync } = require('child_process');
const { getVenvPythonPath } = require('./voice-runtime-bootstrap.cjs');

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
    constructor({ app }) {
        this.app = app;
        this.child = null;
        this.pending = new Map();
        this.nextRequestId = 1;
        this.pythonCommand = null;
        this.warmupPromise = null;
    }

    getCacheDir() {
        return path.join(this.app.getPath('userData'), 'asr-cache');
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
            const entries = fs.readdirSync(cacheDir, { withFileTypes: true });
            return entries.some((entry) => entry.isDirectory() && /^models--/i.test(entry.name));
        } catch {
            return false;
        }
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

        return currentCacheDir;
    }

    getWorkerScriptPath() {
        if (this.app.isPackaged) {
            return path.join(process.resourcesPath, 'app.asar.unpacked', 'electron', 'desktop_asr_worker.py');
        }

        return path.join(__dirname, 'desktop_asr_worker.py');
    }

    resolvePythonCommand() {
        if (this.pythonCommand) {
            return this.pythonCommand;
        }

        const projectRoot = getProjectRoot();
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
                command: envAsrPython,
                args: []
            });
        }

        if (envVoicePython) {
            candidates.push({
                command: envVoicePython,
                args: []
            });
        }

        if (envPython) {
            candidates.push({
                command: envPython,
                args: []
            });
        }

        candidates.push(
            { command: privateVoicePython, args: [] },
            { command: projectVoicePython, args: [] }
        );

        candidates.push(
            { command: 'python', args: [] },
            { command: 'py', args: ['-3.12'] },
            { command: 'py', args: [] }
        );

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
            try {
                const result = spawnSync(candidate.command, [...candidate.args, '--version'], {
                    windowsHide: true,
                    timeout: 10000,
                    encoding: 'utf8'
                });

                if (!result.error && result.status === 0) {
                    this.pythonCommand = candidate;
                    return candidate;
                }
            } catch (error) {
                console.warn('[ASR] Python 探测失败：', error);
            }
        }

        throw new Error('未找到 AILIS 可用的 Python 运行时；请在控制面板执行“本地语音运行时诊断/一键修复”，或设置 AILIS_ASR_PYTHON / AILIS_VOICE_PYTHON。');
    }

    ensureWorker() {
        if (this.child && !this.child.killed) {
            return this.child;
        }

        const workerScriptPath = this.getWorkerScriptPath();
        if (!fs.existsSync(workerScriptPath)) {
            throw new Error(`本地语音识别脚本不存在：${workerScriptPath}`);
        }

        const python = this.resolvePythonCommand();
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

        child.on('exit', (code, signal) => {
            if (this.child === child) {
                this.child = null;
            }

            const errorMessage = code === 0 && !signal
                ? '本地语音识别进程已退出'
                : `本地语音识别进程已退出（code=${code ?? 'null'}, signal=${signal ?? 'null'}）`;

            for (const [requestId, pendingRequest] of this.pending.entries()) {
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

    sendRequest(action, payload = {}) {
        const child = this.ensureWorker();
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

        this.warmupPromise = this.sendRequest('warmup')
            .catch((error) => {
                this.warmupPromise = null;
                throw error;
            });

        return this.warmupPromise;
    }

    close() {
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
    DesktopASRManager
};
