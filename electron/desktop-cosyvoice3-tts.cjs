const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const { getVenvPythonPath } = require('./voice-runtime-bootstrap.cjs');

const DEFAULT_TIMEOUT_MS = 240000;

function normalizeString(value) {
    return String(value || '').trim();
}

function normalizeTimeoutMs(value) {
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue)) {
        return DEFAULT_TIMEOUT_MS;
    }
    return Math.round(Math.min(Math.max(numericValue, 15000), 600000));
}

function getProjectRoot() {
    return path.resolve(__dirname, '..');
}

function resolvePythonPath(projectRoot, userDataPath = '') {
    const configuredPath = normalizeString(process.env.AILIS_COSYVOICE3_PYTHON);
    if (configuredPath) {
        return configuredPath;
    }

    const sharedVoicePython = normalizeString(process.env.AILIS_VOICE_PYTHON);
    if (sharedVoicePython) {
        return sharedVoicePython;
    }

    const privateVoiceVenv = userDataPath
        ? getVenvPythonPath(path.join(userDataPath, 'local-runtimes', 'voice-venv'), process.platform)
        : '';
    if (privateVoiceVenv && fs.existsSync(privateVoiceVenv)) {
        return privateVoiceVenv;
    }

    const bundledVenvPython = getVenvPythonPath(
        path.join(projectRoot, 'build-cache', 'cosyvoice3-venv'),
        process.platform
    );
    if (fs.existsSync(bundledVenvPython)) {
        return bundledVenvPython;
    }

    return process.platform === 'win32' ? 'python' : 'python3';
}

class CosyVoice3TTSManager {
    constructor({ projectRoot = getProjectRoot(), userDataPath = '', pythonPath = '' } = {}) {
        this.projectRoot = projectRoot;
        this.userDataPath = userDataPath;
        this.workerPath = path.join(projectRoot, 'electron', 'cosyvoice3_tts_worker.py');
        this.pythonPath = normalizeString(pythonPath);
        this.child = null;
        this.stdoutBuffer = '';
        this.pendingRequests = new Map();
        this.nextRequestId = 1;
    }

    configure({ projectRoot, userDataPath, pythonPath } = {}) {
        if (projectRoot) {
            this.projectRoot = projectRoot;
            this.workerPath = path.join(projectRoot, 'electron', 'cosyvoice3_tts_worker.py');
        }
        if (userDataPath) {
            this.userDataPath = userDataPath;
        }
        if (pythonPath !== undefined) {
            this.pythonPath = normalizeString(pythonPath);
        }
    }

    ensureWorker() {
        if (this.child && !this.child.killed) {
            return this.child;
        }

        if (!fs.existsSync(this.workerPath)) {
            throw new Error(`CosyVoice3 worker 不存在：${this.workerPath}`);
        }

        const pythonPath = this.pythonPath || resolvePythonPath(this.projectRoot, this.userDataPath);
        this.child = spawn(pythonPath, [this.workerPath], {
            cwd: this.projectRoot,
            stdio: ['pipe', 'pipe', 'pipe'],
            windowsHide: true,
            env: {
                ...process.env,
                AILIS_PROJECT_ROOT: this.projectRoot,
                AILIS_USER_DATA: this.userDataPath || process.env.AILIS_USER_DATA || '',
                AILIS_COSYVOICE3_LOCAL_ONLY: process.env.AILIS_COSYVOICE3_LOCAL_ONLY || '1',
                AILIS_COSYVOICE3_DISABLE_REMOTE_TEXT_FRONTEND:
                    process.env.AILIS_COSYVOICE3_DISABLE_REMOTE_TEXT_FRONTEND || '1',
                AILIS_COSYVOICE3_ACCELERATION: process.env.AILIS_COSYVOICE3_ACCELERATION || 'auto',
                PYTHONIOENCODING: 'utf-8',
                KMP_DUPLICATE_LIB_OK: 'TRUE'
            }
        });

        this.child.stdout.setEncoding('utf8');
        this.child.stderr.setEncoding('utf8');

        this.child.stdout.on('data', (chunk) => this.handleStdout(chunk));
        this.child.stderr.on('data', (chunk) => {
            const message = String(chunk || '').trim();
            if (message) {
                console.warn('[cosyvoice3]', message);
            }
        });
        this.child.on('error', (error) => this.rejectAll(error));
        this.child.on('exit', (code, signal) => {
            const error = new Error(`CosyVoice3 worker 已退出（code=${code}, signal=${signal || 'none'}）`);
            this.child = null;
            this.rejectAll(error);
        });

        return this.child;
    }

    handleStdout(chunk) {
        this.stdoutBuffer += chunk;

        while (this.stdoutBuffer.includes('\n')) {
            const lineEnd = this.stdoutBuffer.indexOf('\n');
            const line = this.stdoutBuffer.slice(0, lineEnd).trim();
            this.stdoutBuffer = this.stdoutBuffer.slice(lineEnd + 1);
            if (!line) {
                continue;
            }
            this.handleJsonLine(line);
        }
    }

    handleJsonLine(line) {
        let payload;
        try {
            payload = JSON.parse(line);
        } catch (error) {
            console.warn('[cosyvoice3] 无法解析 worker 输出：', line);
            return;
        }

        if (payload.type === 'ready') {
            return;
        }

        const requestId = payload.id;
        const pendingRequest = this.pendingRequests.get(requestId);
        if (!pendingRequest) {
            return;
        }

        clearTimeout(pendingRequest.timeoutId);
        this.pendingRequests.delete(requestId);

        if (payload.ok) {
            pendingRequest.resolve(payload);
            return;
        }

        pendingRequest.reject(new Error(payload.error || 'CosyVoice3 合成失败'));
    }

    rejectAll(error) {
        for (const pendingRequest of this.pendingRequests.values()) {
            clearTimeout(pendingRequest.timeoutId);
            pendingRequest.reject(error);
        }
        this.pendingRequests.clear();
    }

    synthesize(payload = {}) {
        const text = normalizeString(payload.text || payload.input);
        if (!text) {
            return Promise.resolve({
                ok: false,
                provider: 'cosyvoice3',
                error: '缺少需要合成的文本。'
            });
        }

        let child;
        try {
            child = this.ensureWorker();
        } catch (error) {
            return Promise.resolve({
                ok: false,
                provider: 'cosyvoice3',
                error: error.message || String(error)
            });
        }

        const requestId = this.nextRequestId;
        this.nextRequestId += 1;
        const timeoutMs = normalizeTimeoutMs(payload.timeoutMs);

        return new Promise((resolve) => {
            const timeoutId = setTimeout(() => {
                this.pendingRequests.delete(requestId);
                resolve({
                    ok: false,
                    provider: 'cosyvoice3',
                    error: `CosyVoice3 合成超时（${timeoutMs}ms）`
                });
            }, timeoutMs);

            this.pendingRequests.set(requestId, {
                timeoutId,
                resolve,
                reject: (error) => {
                    resolve({
                        ok: false,
                        provider: 'cosyvoice3',
                        error: error.message || String(error)
                    });
                }
            });

            child.stdin.write(`${JSON.stringify({
                id: requestId,
                text,
                speed: Number(payload.speed) || 0.92,
                preset: payload.preset || 'anime_shy_soft'
            })}\n`);
        });
    }

    warmup({ timeoutMs = DEFAULT_TIMEOUT_MS } = {}) {
        let child;
        try {
            child = this.ensureWorker();
        } catch (error) {
            return Promise.resolve({
                ok: false,
                provider: 'cosyvoice3',
                error: error.message || String(error)
            });
        }

        const requestId = this.nextRequestId;
        this.nextRequestId += 1;
        const normalizedTimeoutMs = normalizeTimeoutMs(timeoutMs);

        return new Promise((resolve) => {
            const timeoutId = setTimeout(() => {
                this.pendingRequests.delete(requestId);
                resolve({
                    ok: false,
                    provider: 'cosyvoice3',
                    error: `CosyVoice3 预热超时（${normalizedTimeoutMs}ms）`
                });
            }, normalizedTimeoutMs);

            this.pendingRequests.set(requestId, {
                timeoutId,
                resolve,
                reject: (error) => {
                    resolve({
                        ok: false,
                        provider: 'cosyvoice3',
                        error: error.message || String(error)
                    });
                }
            });

            child.stdin.write(`${JSON.stringify({
                id: requestId,
                type: 'warmup'
            })}\n`);
        });
    }

    close() {
        if (!this.child || this.child.killed) {
            return;
        }

        try {
            this.child.stdin.write(`${JSON.stringify({ type: 'shutdown' })}\n`);
            this.child.stdin.end();
        } catch (error) {
            console.warn('[cosyvoice3] 关闭 worker 失败：', error.message || error);
        }
    }
}

const defaultManager = new CosyVoice3TTSManager();

function configureCosyVoice3TTS(options = {}) {
    defaultManager.configure(options);
}

async function synthesizeCosyVoice3Speech(_settings = {}, payload = {}) {
    return defaultManager.synthesize(payload);
}

async function warmupCosyVoice3TTS(options = {}) {
    return defaultManager.warmup(options);
}

function closeCosyVoice3TTS() {
    defaultManager.close();
}

module.exports = {
    CosyVoice3TTSManager,
    closeCosyVoice3TTS,
    configureCosyVoice3TTS,
    synthesizeCosyVoice3Speech,
    warmupCosyVoice3TTS
};
