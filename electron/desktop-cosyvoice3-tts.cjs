const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const { getVenvPythonPath } = require('./voice-runtime-bootstrap.cjs');

const DEFAULT_TIMEOUT_MS = 240000;
const VOICE_RUNTIME_MANIFEST_FILENAME = 'voice-runtime-manifest.json';

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

function resolveAsarUnpackedPath(filePath) {
    const normalizedPath = normalizeString(filePath);
    if (!normalizedPath.includes(`${path.sep}app.asar${path.sep}`)) {
        return normalizedPath;
    }
    const unpackedPath = normalizedPath.replace(`${path.sep}app.asar${path.sep}`, `${path.sep}app.asar.unpacked${path.sep}`);
    return fs.existsSync(unpackedPath) ? unpackedPath : normalizedPath;
}

function isFile(filePath) {
    try {
        return Boolean(filePath && fs.existsSync(filePath) && fs.statSync(filePath).isFile());
    } catch {
        return false;
    }
}

function isDirectory(filePath) {
    try {
        return Boolean(filePath && fs.existsSync(filePath) && fs.statSync(filePath).isDirectory());
    } catch {
        return false;
    }
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
    return path.isAbsolute(rawPath) ? rawPath : path.join(rootDir, rawPath);
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

function findFileRecursive(rootDir, predicate, maxEntries = 20000) {
    if (!isDirectory(rootDir)) {
        return '';
    }
    const stack = [rootDir];
    let visited = 0;
    while (stack.length && visited < maxEntries) {
        const current = stack.pop();
        let entries = [];
        try {
            entries = fs.readdirSync(current, { withFileTypes: true });
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
    return findFileRecursive(venvDir, (filePath) =>
        path.basename(path.dirname(filePath)).toLowerCase() === 'site-packages'
    );
}

function buildRuntimeEnv(runtimeRoot, manifest = {}) {
    const voiceVenv = path.join(runtimeRoot, 'voice-venv');
    const sitePackagesDir = findSitePackagesDir(voiceVenv);
    const manifestPythonPathEntries = normalizeManifestPathList(runtimeRoot, manifest.pythonPath);
    const manifestPathEntries = normalizeManifestPathList(runtimeRoot, manifest.pathAppend);
    const fallbackPathEntries = [
        process.platform === 'win32' ? path.join(voiceVenv, 'Scripts') : path.join(voiceVenv, 'bin'),
        path.join(voiceVenv, 'Library', 'bin'),
        sitePackagesDir ? path.join(sitePackagesDir, 'torch', 'lib') : '',
        sitePackagesDir ? path.join(sitePackagesDir, 'torchaudio', 'lib') : ''
    ].filter((entry) => entry && isDirectory(entry));
    const pythonPathEntries = [
        ...manifestPythonPathEntries,
        sitePackagesDir
    ].filter(Boolean);
    const pathEntries = [
        ...manifestPathEntries,
        ...fallbackPathEntries
    ].filter(Boolean);
    return {
        ...(pythonPathEntries.length
            ? {
                PYTHONPATH: [
                    ...pythonPathEntries,
                    process.env.PYTHONPATH || ''
                ].filter(Boolean).join(path.delimiter)
            }
            : {}),
        ...(pathEntries.length
            ? {
                PATH: [
                    ...pathEntries,
                    process.env.PATH || ''
                ].filter(Boolean).join(path.delimiter)
            }
            : {})
    };
}

function resolvePythonRuntime(projectRoot, userDataPath = '', voiceRuntimeRoot = '') {
    const configuredPath = normalizeString(process.env.AILIS_COSYVOICE3_PYTHON);
    if (configuredPath) {
        return { pythonPath: configuredPath, env: {} };
    }

    const sharedVoicePython = normalizeString(process.env.AILIS_VOICE_PYTHON);
    if (sharedVoicePython) {
        return { pythonPath: sharedVoicePython, env: {} };
    }

    const runtimeRoot = normalizeString(voiceRuntimeRoot) ||
        (userDataPath ? path.join(userDataPath, 'local-runtimes') : '');
    if (runtimeRoot) {
        const manifest = readJsonFile(path.join(runtimeRoot, VOICE_RUNTIME_MANIFEST_FILENAME)) || {};
        const runtimeEnv = buildRuntimeEnv(runtimeRoot, manifest);
        const manifestPython = normalizeRelativePath(runtimeRoot, manifest.voicePython || manifest.python || '');
        if (isFile(manifestPython)) {
            return { pythonPath: manifestPython, env: runtimeEnv };
        }
        const privatePython = findPrivatePythonExecutable(runtimeRoot);
        if (isFile(privatePython)) {
            return { pythonPath: privatePython, env: runtimeEnv };
        }
        const privateVoiceVenv = getVenvPythonPath(path.join(runtimeRoot, 'voice-venv'), process.platform);
        if (isFile(privateVoiceVenv)) {
            return { pythonPath: privateVoiceVenv, env: runtimeEnv };
        }
    }

    const bundledVenvPython = getVenvPythonPath(
        path.join(projectRoot, 'build-cache', 'cosyvoice3-venv'),
        process.platform
    );
    if (isFile(bundledVenvPython)) {
        return { pythonPath: bundledVenvPython, env: {} };
    }

    return {
        pythonPath: process.platform === 'win32' ? 'python' : 'python3',
        env: {}
    };
}

function resolvePythonPath(projectRoot, userDataPath = '', voiceRuntimeRoot = '') {
    return resolvePythonRuntime(projectRoot, userDataPath, voiceRuntimeRoot).pythonPath;
}

class CosyVoice3TTSManager {
    constructor({
        projectRoot = getProjectRoot(),
        userDataPath = '',
        voiceRuntimeRoot = '',
        cosyVoiceRoot = '',
        cosyVoice3ModelDir = '',
        pythonPath = ''
    } = {}) {
        this.projectRoot = projectRoot;
        this.userDataPath = userDataPath;
        this.voiceRuntimeRoot = normalizeString(voiceRuntimeRoot);
        this.cosyVoiceRoot = normalizeString(cosyVoiceRoot);
        this.cosyVoice3ModelDir = normalizeString(cosyVoice3ModelDir);
        this.workerPath = resolveAsarUnpackedPath(path.join(projectRoot, 'electron', 'cosyvoice3_tts_worker.py'));
        this.pythonPath = normalizeString(pythonPath);
        this.child = null;
        this.stdoutBuffer = '';
        this.pendingRequests = new Map();
        this.nextRequestId = 1;
        this.warmupPromise = null;
        this.warmed = false;
    }

    configure({ projectRoot, userDataPath, voiceRuntimeRoot, cosyVoiceRoot, cosyVoice3ModelDir, pythonPath } = {}) {
        const previousRuntimeSignature = [
            this.projectRoot,
            this.userDataPath,
            this.voiceRuntimeRoot,
            this.cosyVoiceRoot,
            this.cosyVoice3ModelDir,
            this.pythonPath
        ].join('\n');
        if (projectRoot) {
            this.projectRoot = projectRoot;
            this.workerPath = resolveAsarUnpackedPath(path.join(projectRoot, 'electron', 'cosyvoice3_tts_worker.py'));
        }
        if (userDataPath) {
            this.userDataPath = userDataPath;
        }
        if (voiceRuntimeRoot !== undefined) {
            this.voiceRuntimeRoot = normalizeString(voiceRuntimeRoot);
        }
        if (cosyVoiceRoot !== undefined) {
            this.cosyVoiceRoot = normalizeString(cosyVoiceRoot);
        }
        if (cosyVoice3ModelDir !== undefined) {
            this.cosyVoice3ModelDir = normalizeString(cosyVoice3ModelDir);
        }
        if (pythonPath !== undefined) {
            this.pythonPath = normalizeString(pythonPath);
        }
        const nextRuntimeSignature = [
            this.projectRoot,
            this.userDataPath,
            this.voiceRuntimeRoot,
            this.cosyVoiceRoot,
            this.cosyVoice3ModelDir,
            this.pythonPath
        ].join('\n');
        if (previousRuntimeSignature !== nextRuntimeSignature) {
            this.close();
        }
    }

    ensureWorker() {
        if (this.child && !this.child.killed) {
            return this.child;
        }

        if (!fs.existsSync(this.workerPath)) {
            throw new Error(`CosyVoice3 worker 不存在：${this.workerPath}`);
        }

        const resolvedRuntime = resolvePythonRuntime(this.projectRoot, this.userDataPath, this.voiceRuntimeRoot);
        const pythonPath = this.pythonPath || resolvedRuntime.pythonPath;
        const runtimeRoot = this.voiceRuntimeRoot ||
            (this.userDataPath ? path.join(this.userDataPath, 'local-runtimes') : '');
        this.warmed = false;
        const childEnv = {
            ...process.env,
            ...(resolvedRuntime.env || {}),
            AILIS_PROJECT_ROOT: this.projectRoot,
            AILIS_USER_DATA: this.userDataPath || process.env.AILIS_USER_DATA || '',
            AILIS_VOICE_RUNTIME_ROOT: runtimeRoot || process.env.AILIS_VOICE_RUNTIME_ROOT || '',
            AILIS_COSYVOICE_ROOT: this.cosyVoiceRoot || process.env.AILIS_COSYVOICE_ROOT || '',
            AILIS_COSYVOICE3_MODEL_DIR:
                this.cosyVoice3ModelDir || process.env.AILIS_COSYVOICE3_MODEL_DIR || '',
            AILIS_COSYVOICE3_LOCAL_ONLY: process.env.AILIS_COSYVOICE3_LOCAL_ONLY || '1',
            AILIS_COSYVOICE3_DISABLE_REMOTE_TEXT_FRONTEND:
                process.env.AILIS_COSYVOICE3_DISABLE_REMOTE_TEXT_FRONTEND || '1',
            AILIS_COSYVOICE3_ACCELERATION: process.env.AILIS_COSYVOICE3_ACCELERATION || 'auto',
            PYTHONIOENCODING: 'utf-8',
            KMP_DUPLICATE_LIB_OK: 'TRUE'
        };
        if (
            normalizeString(childEnv.CUDA_VISIBLE_DEVICES) === '-1' &&
            normalizeString(childEnv.AILIS_COSYVOICE3_ACCELERATION).toLowerCase() !== 'cpu'
        ) {
            delete childEnv.CUDA_VISIBLE_DEVICES;
        }

        this.child = spawn(pythonPath, [this.workerPath], {
            cwd: this.projectRoot,
            stdio: ['pipe', 'pipe', 'pipe'],
            windowsHide: true,
            env: childEnv
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
            this.warmed = false;
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
            pendingRequest.onSuccess?.(payload);
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
                onSuccess: () => {
                    this.warmed = true;
                },
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

        if (this.warmed) {
            return Promise.resolve({
                ok: true,
                provider: 'cosyvoice3',
                type: 'warmup',
                alreadyWarm: true,
                skipped: true
            });
        }
        if (this.warmupPromise) {
            return this.warmupPromise;
        }

        const requestId = this.nextRequestId;
        this.nextRequestId += 1;
        const normalizedTimeoutMs = normalizeTimeoutMs(timeoutMs);

        const requestPromise = new Promise((resolve) => {
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
                onSuccess: () => {
                    this.warmed = true;
                },
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
        this.warmupPromise = requestPromise.finally(() => {
            this.warmupPromise = null;
        });
        return this.warmupPromise;
    }

    close() {
        if (!this.child || this.child.killed) {
            this.warmed = false;
            this.warmupPromise = null;
            return;
        }

        this.warmed = false;
        this.warmupPromise = null;
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
