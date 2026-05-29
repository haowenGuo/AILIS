const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { spawn, spawnSync } = require('child_process');

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

        const envPython = String(process.env.AIGRIL_PYTHON || '').trim();
        const candidates = [];

        if (envPython) {
            candidates.push({
                command: envPython,
                args: []
            });
        }

        candidates.push(
            { command: 'python', args: [] },
            { command: 'py', args: ['-3.12'] },
            { command: 'py', args: [] }
        );

        for (const candidate of candidates) {
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

        throw new Error('未找到可用的 Python 运行时，请安装 Python 3.12 或设置 AIGRIL_PYTHON');
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
        const child = spawn(
            python.command,
            [...python.args, '-u', workerScriptPath],
            {
                cwd: path.dirname(workerScriptPath),
                windowsHide: true,
                stdio: ['pipe', 'pipe', 'pipe'],
                env: {
                    ...process.env,
                    AIGRIL_ASR_MODEL_ID: process.env.AIGRIL_ASR_MODEL_ID || 'openai/whisper-small',
                    AIGRIL_ASR_MODEL_ENDPOINT: process.env.AIGRIL_ASR_MODEL_ENDPOINT || 'https://hf-mirror.com',
                    AIGRIL_ASR_LANGUAGE: process.env.AIGRIL_ASR_LANGUAGE || 'zh',
                    AIGRIL_ASR_TASK: process.env.AIGRIL_ASR_TASK || 'transcribe',
                    AIGRIL_ASR_CACHE_DIR: this.getCacheDir()
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
        const audioBytes = normalizeBinaryPayload(payload);
        if (!audioBytes.length) {
            throw new Error('录音内容为空');
        }

        return this.sendRequest('transcribe', {
            audioBase64: audioBytes.toString('base64')
        });
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
