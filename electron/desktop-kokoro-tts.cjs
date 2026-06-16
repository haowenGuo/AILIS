const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const DEFAULT_TIMEOUT_MS = 120000;
const DEFAULT_KOKORO_VOICE = process.env.AILIS_KOKORO_VOICE || 'zf_003';
const DEFAULT_KOKORO_SPEED = Number(process.env.AILIS_KOKORO_SPEED) || 0.98;

function normalizeString(value) {
    return String(value || '').trim();
}

function normalizeTimeoutMs(value) {
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue)) {
        return DEFAULT_TIMEOUT_MS;
    }
    return Math.round(Math.min(Math.max(numericValue, 5000), 300000));
}

function getProjectRoot() {
    return path.resolve(__dirname, '..');
}

function resolvePythonPath(projectRoot) {
    const configuredPath = normalizeString(process.env.AILIS_KOKORO_PYTHON);
    if (configuredPath) {
        return configuredPath;
    }

    const sampleVenvPython = path.join(
        projectRoot,
        'build-cache',
        'tts-sample-venv',
        'Scripts',
        'python.exe'
    );
    if (fs.existsSync(sampleVenvPython)) {
        return sampleVenvPython;
    }

    return process.platform === 'win32' ? 'python' : 'python3';
}

function resolveHfHome(projectRoot) {
    const configuredPath = normalizeString(process.env.HF_HOME);
    if (configuredPath) {
        return configuredPath;
    }

    const driveRoot = path.parse(projectRoot).root;
    const sharedCache = path.join(driveRoot, 'huggingface_cache');
    if (fs.existsSync(sharedCache)) {
        return sharedCache;
    }

    return '';
}

class KokoroTTSManager {
    constructor({ projectRoot = getProjectRoot() } = {}) {
        this.projectRoot = projectRoot;
        this.workerPath = path.join(projectRoot, 'electron', 'kokoro_tts_worker.py');
        this.pythonPath = resolvePythonPath(projectRoot);
        this.hfHome = resolveHfHome(projectRoot);
        this.child = null;
        this.stdoutBuffer = '';
        this.pendingRequests = new Map();
        this.nextRequestId = 1;
        this.warmedUp = false;
        this.warmupPromise = null;
    }

    ensureWorker() {
        if (this.child && !this.child.killed) {
            return this.child;
        }

        if (!fs.existsSync(this.workerPath)) {
            throw new Error(`Kokoro worker 不存在：${this.workerPath}`);
        }

        this.child = spawn(this.pythonPath, [this.workerPath], {
            cwd: this.projectRoot,
            stdio: ['pipe', 'pipe', 'pipe'],
            windowsHide: true,
            env: {
                ...process.env,
                ...(this.hfHome ? { HF_HOME: this.hfHome } : {}),
                AILIS_PROJECT_ROOT: this.projectRoot,
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
                console.warn('[kokoro]', message);
            }
        });
        this.child.on('error', (error) => this.rejectAll(error));
        this.child.on('exit', (code, signal) => {
            const error = new Error(`Kokoro worker 已退出（code=${code}, signal=${signal || 'none'}）`);
            this.child = null;
            this.warmedUp = false;
            this.warmupPromise = null;
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
            console.warn('[kokoro] 无法解析 worker 输出：', line);
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

        pendingRequest.reject(new Error(payload.error || 'Kokoro 合成失败'));
    }

    rejectAll(error) {
        for (const pendingRequest of this.pendingRequests.values()) {
            clearTimeout(pendingRequest.timeoutId);
            pendingRequest.reject(error);
        }
        this.pendingRequests.clear();
    }

    request(payload = {}) {
        let child;
        try {
            child = this.ensureWorker();
        } catch (error) {
            return Promise.resolve({
                ok: false,
                provider: 'kokoro',
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
                    provider: 'kokoro',
                    error: `Kokoro 合成超时（${timeoutMs}ms）`
                });
            }, timeoutMs);

            this.pendingRequests.set(requestId, {
                timeoutId,
                resolve,
                reject: (error) => {
                    resolve({
                        ok: false,
                        provider: 'kokoro',
                        error: error.message || String(error)
                    });
                }
            });

            child.stdin.write(`${JSON.stringify({
                ...payload,
                id: requestId
            })}\n`);
        });
    }

    synthesize(payload = {}) {
        const text = normalizeString(payload.text || payload.input);
        if (!text) {
            return Promise.resolve({
                ok: false,
                provider: 'kokoro',
                error: '缺少需要合成的文本。'
            });
        }

        return this.request({
            text,
            voice: payload.voice || DEFAULT_KOKORO_VOICE,
            speed: Number(payload.speed) || DEFAULT_KOKORO_SPEED,
            timeoutMs: payload.timeoutMs
        }).then((result) => {
            if (result?.ok) {
                this.warmedUp = true;
            }
            return result;
        });
    }

    warmup({ timeoutMs = DEFAULT_TIMEOUT_MS, voice = DEFAULT_KOKORO_VOICE, speed = DEFAULT_KOKORO_SPEED } = {}) {
        if (this.warmedUp) {
            return Promise.resolve({
                ok: true,
                provider: 'kokoro',
                voice,
                type: 'warmup',
                skipped: true,
                elapsedSeconds: 0
            });
        }

        if (this.warmupPromise) {
            return this.warmupPromise;
        }

        this.warmupPromise = this.request({
            type: 'warmup',
            timeoutMs,
            voice,
            speed
        }).then((result) => {
            if (result?.ok) {
                this.warmedUp = true;
            }
            return result;
        }).finally(() => {
            this.warmupPromise = null;
        });

        return this.warmupPromise;
    }

    close() {
        if (!this.child || this.child.killed) {
            return;
        }

        try {
            this.child.stdin.write(`${JSON.stringify({ type: 'shutdown' })}\n`);
            this.child.stdin.end();
            this.warmedUp = false;
            this.warmupPromise = null;
        } catch (error) {
            console.warn('[kokoro] 关闭 worker 失败：', error.message || error);
        }
    }
}

const defaultManager = new KokoroTTSManager();

async function synthesizeKokoroSpeech(_settings = {}, payload = {}) {
    return defaultManager.synthesize(payload);
}

async function warmupKokoroTTS(options = {}) {
    return defaultManager.warmup(options);
}

function closeKokoroTTS() {
    defaultManager.close();
}

module.exports = {
    KokoroTTSManager,
    closeKokoroTTS,
    synthesizeKokoroSpeech,
    warmupKokoroTTS
};
