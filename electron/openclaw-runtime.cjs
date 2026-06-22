const { EventEmitter } = require('events');
const fs = require('fs');
const net = require('net');
const path = require('path');
const { randomUUID } = require('crypto');
const { spawn, spawnSync } = require('child_process');
const { pathToFileURL } = require('url');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const EXTERNAL_RUNTIME_ROOT = 'F:\\AILIS\\AILIS\\build-cache\\openclaw-runtime';
const EXTERNAL_VENDOR_ROOT = 'F:\\AILIS\\AILIS\\build-cache\\openclaw-vendor';
const EXTERNAL_OPENCLAW_HOME = 'F:\\AILIS\\Runtime\\OpenClawHome';

const DEFAULT_GATEWAY_URL =
    process.env.AILIS_OPENCLAW_GATEWAY_URL ||
    process.env.OPENCLAW_GATEWAY_URL ||
    'ws://127.0.0.1:19011';
const DEFAULT_SESSION_KEY =
    process.env.AILIS_OPENCLAW_SESSION_KEY ||
    process.env.OPENCLAW_SESSION_KEY ||
    'main';
const DEFAULT_PROTOCOL_VERSION = 3;
const DEFAULT_GATEWAY_PORT = 19011;
const DEFAULT_CONNECT_TIMEOUT_MS = 12000;
const DEFAULT_REQUEST_TIMEOUT_MS = 30000;
const DEFAULT_BOOT_TIMEOUT_MS = 45000;
const DEFAULT_GATEWAY_URL_FALLBACKS = [
    'ws://127.0.0.1:19011',
    'ws://127.0.0.1:18789'
];

let gatewayRuntimePromise = null;

function normalizeOptionalString(value, fallback = '') {
    if (typeof value !== 'string') {
        return fallback;
    }
    const trimmed = value.trim();
    return trimmed || fallback;
}

function dedupeStrings(values) {
    const seen = new Set();
    const result = [];
    for (const value of values) {
        const normalized = normalizeOptionalString(value);
        if (!normalized || seen.has(normalized)) {
            continue;
        }
        seen.add(normalized);
        result.push(normalized);
    }
    return result;
}

function fileExists(targetPath) {
    try {
        return fs.existsSync(targetPath);
    } catch {
        return false;
    }
}

function resolveExistingPath(candidates) {
    for (const candidate of candidates) {
        const normalized = normalizeOptionalString(candidate);
        if (!normalized) {
            continue;
        }
        if (fileExists(normalized)) {
            return normalized;
        }
    }
    return '';
}

function toGatewayWsUrl(rawUrl) {
    const normalized = normalizeOptionalString(rawUrl);
    if (!normalized) {
        return '';
    }
    if (/^wss?:\/\//i.test(normalized)) {
        return normalized;
    }
    if (/^https?:\/\//i.test(normalized)) {
        return normalized.replace(/^http/i, 'ws');
    }
    return `ws://${normalized}`;
}

function buildGatewayUrlCandidates(rawUrl) {
    const explicitUrl = normalizeOptionalString(rawUrl);
    if (explicitUrl) {
        return [toGatewayWsUrl(explicitUrl)];
    }

    return dedupeStrings([
        toGatewayWsUrl(process.env.AILIS_OPENCLAW_GATEWAY_URL),
        toGatewayWsUrl(process.env.OPENCLAW_GATEWAY_URL),
        ...DEFAULT_GATEWAY_URL_FALLBACKS
    ]);
}

function isValidRuntimeRoot(rootPath) {
    if (!rootPath) {
        return false;
    }

    return [
        path.join(rootPath, 'openclaw.mjs'),
        path.join(rootPath, 'package.json'),
        path.join(rootPath, 'dist', 'entry.js'),
        path.join(rootPath, 'dist', 'plugin-sdk', 'gateway-runtime.js'),
        path.join(rootPath, 'node_modules')
    ].every((candidate) => fileExists(candidate));
}

function resolveRuntimeRootCandidates(app) {
    const appPath = app?.getAppPath?.() || PROJECT_ROOT;
    const resourceRoot = app?.isPackaged ? process.resourcesPath : appPath;
    const envRepoRoots = dedupeStrings([
        process.env.AILIS_OPENCLAW_REPO,
        process.env.OPENCLAW_REPO
    ]);

    return dedupeStrings([
        path.join(resourceRoot, 'openclaw-runtime'),
        path.join(appPath, 'build-cache', 'openclaw-runtime'),
        path.resolve(appPath, '..', 'build-cache', 'openclaw-runtime'),
        path.join(PROJECT_ROOT, 'build-cache', 'openclaw-runtime'),
        path.resolve(PROJECT_ROOT, '..', 'AILIS', 'AILIS', 'build-cache', 'openclaw-runtime'),
        EXTERNAL_RUNTIME_ROOT,
        ...envRepoRoots
    ]);
}

function resolveBundledOpenClawRoot(app) {
    return resolveRuntimeRootCandidates(app).find((candidate) => isValidRuntimeRoot(candidate)) || '';
}

function resolveGatewayRuntimeCandidates(app) {
    return dedupeStrings([
        process.env.AILIS_OPENCLAW_SDK_PATH,
        process.env.OPENCLAW_SDK_PATH,
        ...resolveRuntimeRootCandidates(app).map((rootPath) => (
            path.join(rootPath, 'dist', 'plugin-sdk', 'gateway-runtime.js')
        ))
    ]);
}

function resolveVendorNodePath(app) {
    const appPath = app?.getAppPath?.() || PROJECT_ROOT;
    const resourceRoot = app?.isPackaged ? process.resourcesPath : appPath;
    const nodeBinaryName = process.platform === 'win32' ? 'node.exe' : 'node';

    return resolveExistingPath([
        process.env.AILIS_OPENCLAW_NODE_PATH,
        process.env.OPENCLAW_NODE_PATH,
        path.join(resourceRoot, 'openclaw-vendor', nodeBinaryName),
        path.join(appPath, 'build-cache', 'openclaw-vendor', nodeBinaryName),
        path.resolve(appPath, '..', 'build-cache', 'openclaw-vendor', nodeBinaryName),
        path.join(PROJECT_ROOT, 'build-cache', 'openclaw-vendor', nodeBinaryName),
        path.resolve(PROJECT_ROOT, '..', 'AILIS', 'AILIS', 'build-cache', 'openclaw-vendor', nodeBinaryName),
        path.join(EXTERNAL_VENDOR_ROOT, nodeBinaryName)
    ]);
}

function resolveOpenClawHomeRoot(app) {
    const candidates = dedupeStrings([
        process.env.AILIS_OPENCLAW_HOME,
        process.env.OPENCLAW_HOME,
        process.env.AILIS_OPENCLAW_HOME,
        EXTERNAL_OPENCLAW_HOME,
        app?.getPath?.('userData') ? path.join(app.getPath('userData'), 'openclaw-home') : '',
        path.join(PROJECT_ROOT, 'tmp', 'openclaw-home')
    ]);

    for (const candidate of candidates) {
        if (
            fileExists(path.join(candidate, '.openclaw')) ||
            fileExists(path.join(candidate, 'openclaw.json')) ||
            fileExists(path.join(candidate, 'identity', 'device.json')) ||
            fileExists(path.join(candidate, 'devices', 'paired.json'))
        ) {
            return candidate;
        }
    }

    return candidates[0] || path.join(PROJECT_ROOT, 'tmp', 'openclaw-home');
}

async function loadGatewayRuntime(app) {
    if (!gatewayRuntimePromise) {
        gatewayRuntimePromise = (async () => {
            const openClawHome = resolveOpenClawHomeRoot(app);
            if (openClawHome && !normalizeOptionalString(process.env.OPENCLAW_HOME)) {
                process.env.OPENCLAW_HOME = openClawHome;
            }

            try {
                return await import('openclaw/plugin-sdk/gateway-runtime');
            } catch {}

            const runtimePath = resolveExistingPath(resolveGatewayRuntimeCandidates(app));
            if (!runtimePath) {
                throw new Error(
                    '未找到 OpenClaw Gateway runtime，请先准备 build-cache/openclaw-runtime 或设置 AILIS_OPENCLAW_REPO'
                );
            }

            return await import(pathToFileURL(runtimePath).href);
        })();
    }

    return await gatewayRuntimePromise;
}

function createTimeoutError(message) {
    const error = new Error(message);
    error.code = 'AILIS_TIMEOUT';
    return error;
}

function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function canConnect(host, port, timeoutMs = 600) {
    return new Promise((resolve) => {
        const socket = net.connect({
            host,
            port,
            timeout: timeoutMs
        });

        let settled = false;
        const finish = (value) => {
            if (settled) {
                return;
            }
            settled = true;
            socket.destroy();
            resolve(value);
        };

        socket.once('connect', () => finish(true));
        socket.once('timeout', () => finish(false));
        socket.once('error', () => finish(false));
    });
}

function normalizeGatewayAddress(rawUrl) {
    const normalized = normalizeOptionalString(rawUrl, DEFAULT_GATEWAY_URL);
    let candidate = normalized;

    if (/^\d+$/.test(candidate)) {
        candidate = `ws://127.0.0.1:${candidate}`;
    } else if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(candidate)) {
        candidate = `ws://${candidate}`;
    }

    try {
        const resolvedUrl = new URL(candidate);
        const host = normalizeOptionalString(resolvedUrl.hostname, '127.0.0.1');
        const port = Number.parseInt(resolvedUrl.port || '', 10) || DEFAULT_GATEWAY_PORT;
        const managed = isLoopbackHost(host);
        return {
            url: `ws://${managed ? '127.0.0.1' : host}:${port}`,
            displayUrl: `${resolvedUrl.protocol}//${host}:${port}`,
            host,
            probeHost: host === '::1' ? '::1' : '127.0.0.1',
            port,
            managed
        };
    } catch {
        return {
            url: DEFAULT_GATEWAY_URL,
            displayUrl: DEFAULT_GATEWAY_URL,
            host: '127.0.0.1',
            probeHost: '127.0.0.1',
            port: DEFAULT_GATEWAY_PORT,
            managed: true
        };
    }
}

function isLoopbackHost(hostname) {
    const normalized = normalizeOptionalString(hostname).toLowerCase();
    return (
        !normalized ||
        normalized === '127.0.0.1' ||
        normalized === 'localhost' ||
        normalized === '::1'
    );
}

function isChildAlive(child) {
    return Boolean(child && child.exitCode === null && !child.killed);
}

class OpenClawGatewayManager extends EventEmitter {
    constructor(options = {}) {
        super();

        const token =
            normalizeOptionalString(options.token) ||
            normalizeOptionalString(process.env.AILIS_OPENCLAW_GATEWAY_TOKEN) ||
            normalizeOptionalString(process.env.OPENCLAW_GATEWAY_TOKEN);
        const password =
            normalizeOptionalString(options.password) ||
            normalizeOptionalString(process.env.AILIS_OPENCLAW_GATEWAY_PASSWORD) ||
            normalizeOptionalString(process.env.OPENCLAW_GATEWAY_PASSWORD);
        const sessionKey = normalizeOptionalString(options.sessionKey) || DEFAULT_SESSION_KEY;
        const gatewayUrls = buildGatewayUrlCandidates(options.gatewayUrl);

        this.app = options.app;
        this.config = {
            enabled: options.enabled !== false,
            gatewayUrls: gatewayUrls.length > 0 ? gatewayUrls : [DEFAULT_GATEWAY_URL],
            token,
            password,
            sessionKey,
            clientVersion: options.clientVersion || 'dev'
        };

        this.client = null;
        this.connectPromise = null;
        this.connected = false;
        this.connectedAt = 0;
        this.lastError = '';
        this.sessionKey = sessionKey;
        this.sessionSubscriptionsReady = false;
        this.historyCache = [];
        this.messageIds = new Set();
        this.closedManually = false;
        this.activeGatewayUrl = this.config.gatewayUrls[0];
    }

    getStatus() {
        return {
            enabled: this.config.enabled,
            connected: this.connected,
            connecting: Boolean(this.connectPromise),
            gatewayUrl: this.activeGatewayUrl,
            gatewayCandidates: [...this.config.gatewayUrls],
            sessionKey: this.sessionKey,
            lastError: this.lastError,
            connectedAt: this.connectedAt,
            authMode: this.config.token ? 'token' : this.config.password ? 'password' : 'none',
            protocolVersion: DEFAULT_PROTOCOL_VERSION
        };
    }

    emitStatus() {
        this.emit('status', this.getStatus());
    }

    async ensureConnected() {
        if (!this.config.enabled) {
            throw new Error('OpenClaw 助手桥接未启用');
        }

        if (this.connected) {
            if (!this.sessionSubscriptionsReady) {
                await this.ensureSessionSubscriptions();
            }
            return this.getStatus();
        }

        if (this.connectPromise) {
            await this.connectPromise;
            return this.getStatus();
        }

        this.connectPromise = this.connectWithFallback().finally(() => {
            this.connectPromise = null;
        });
        await this.connectPromise;
        return this.getStatus();
    }

    async connectWithFallback() {
        const runtime = await loadGatewayRuntime(this.app);
        const GatewayClient = runtime?.GatewayClient;
        if (!GatewayClient) {
            throw new Error('OpenClaw Gateway runtime 未导出 GatewayClient');
        }

        let lastFailure = null;
        const failures = [];

        for (const gatewayUrl of this.config.gatewayUrls) {
            try {
                await this.connectSingle(GatewayClient, gatewayUrl);
                this.activeGatewayUrl = gatewayUrl;
                this.lastError = '';
                await this.ensureSessionSubscriptions();
                return;
            } catch (error) {
                lastFailure = error instanceof Error ? error : new Error(String(error));
                failures.push(`${gatewayUrl}: ${lastFailure.message}`);
                this.lastError = lastFailure.message;
                this.emitStatus();
                await this.teardownClient();
            }
        }

        const attempts = failures.length > 0 ? failures.join(' | ') : this.config.gatewayUrls.join(', ');
        throw new Error(
            `OpenClaw Gateway 连接失败（已尝试：${attempts}${lastFailure?.message ? `；最后错误：${lastFailure.message}` : ''}）`
        );
    }

    async connectSingle(GatewayClient, gatewayUrl) {
        await this.teardownClient();
        this.closedManually = false;
        this.connected = false;
        this.connectedAt = 0;
        this.sessionSubscriptionsReady = false;
        this.emitStatus();

        await new Promise((resolve, reject) => {
            let settled = false;
            const timer = setTimeout(() => {
                finishReject(createTimeoutError('连接 OpenClaw Gateway 超时'));
            }, DEFAULT_CONNECT_TIMEOUT_MS);

            const finishResolve = () => {
                if (settled) {
                    return;
                }
                settled = true;
                clearTimeout(timer);
                this.connected = true;
                this.connectedAt = Date.now();
                this.lastError = '';
                this.activeGatewayUrl = gatewayUrl;
                this.emitStatus();
                resolve();
            };

            const finishReject = (error) => {
                const resolvedError = error instanceof Error ? error : new Error(String(error));
                if (settled) {
                    this.connected = false;
                    this.connectedAt = 0;
                    this.lastError = resolvedError.message;
                    this.sessionSubscriptionsReady = false;
                    this.emitStatus();
                    return;
                }

                settled = true;
                clearTimeout(timer);
                this.connected = false;
                this.connectedAt = 0;
                this.lastError = resolvedError.message;
                this.sessionSubscriptionsReady = false;
                this.emitStatus();
                reject(resolvedError);
            };

            this.client = new GatewayClient({
                url: gatewayUrl,
                token: this.config.token || undefined,
                password: this.config.password || undefined,
                clientName: 'gateway-client',
                clientDisplayName: 'AILIS Desktop',
                clientVersion: this.config.clientVersion || 'dev',
                platform: process.platform,
                mode: 'backend',
                role: 'operator',
                scopes: ['operator.read', 'operator.write'],
                requestTimeoutMs: DEFAULT_REQUEST_TIMEOUT_MS,
                onHelloOk: () => {
                    finishResolve();
                },
                onEvent: (frame) => {
                    this.handleGatewayFrame(frame);
                },
                onConnectError: (error) => {
                    finishReject(error);
                },
                onClose: (_code, reason) => {
                    this.connected = false;
                    this.connectedAt = 0;
                    this.sessionSubscriptionsReady = false;
                    if (!this.closedManually) {
                        this.lastError = normalizeOptionalString(reason) || 'OpenClaw Gateway 连接已断开';
                    }
                    this.emitStatus();
                }
            });

            try {
                this.client.start();
            } catch (error) {
                finishReject(error);
            }
        });
    }

    async teardownClient() {
        if (!this.client) {
            return;
        }

        const client = this.client;
        this.client = null;

        try {
            if (typeof client.stopAndWait === 'function') {
                await client.stopAndWait({ timeoutMs: 3000 });
            } else if (typeof client.stop === 'function') {
                client.stop();
            }
        } catch {}

        this.connected = false;
        this.connectedAt = 0;
        this.sessionSubscriptionsReady = false;
    }

    async request(method, params, timeoutMs = DEFAULT_REQUEST_TIMEOUT_MS) {
        await this.ensureConnected();
        return await this.requestDirect(method, params, timeoutMs);
    }

    async requestDirect(method, params, timeoutMs = DEFAULT_REQUEST_TIMEOUT_MS) {
        if (!this.client) {
            throw new Error('OpenClaw Gateway 尚未连接');
        }

        try {
            return await this.client.request(method, params, { timeoutMs });
        } catch (error) {
            this.lastError = error instanceof Error ? error.message : String(error);
            this.emitStatus();
            throw error;
        }
    }

    async ensureSessionSubscriptions() {
        if (this.sessionSubscriptionsReady) {
            return;
        }

        await this.requestDirect('sessions.subscribe', {}, DEFAULT_REQUEST_TIMEOUT_MS);
        const subscription = await this.requestDirect(
            'sessions.messages.subscribe',
            { key: this.sessionKey },
            DEFAULT_REQUEST_TIMEOUT_MS
        );
        const canonicalKey = normalizeOptionalString(subscription?.key);
        if (canonicalKey) {
            this.sessionKey = canonicalKey;
        }
        this.sessionSubscriptionsReady = true;
        this.emitStatus();
    }

    async getHistory(limit = 200) {
        const payload = await this.request('chat.history', {
            sessionKey: this.sessionKey,
            limit
        });
        this.historyCache = Array.isArray(payload?.messages) ? payload.messages : [];
        this.rebuildHistoryIndex();
        return payload;
    }

    rebuildHistoryIndex() {
        this.messageIds.clear();
        for (const message of this.historyCache) {
            const key = this.buildMessageIdentity(message);
            if (key) {
                this.messageIds.add(key);
            }
        }
    }

    buildMessageIdentity(message) {
        if (!message || typeof message !== 'object') {
            return '';
        }

        const role = normalizeOptionalString(message.role).toLowerCase();
        const timestamp = Number.isFinite(message.timestamp) ? String(message.timestamp) : '';
        const text = Array.isArray(message.content)
            ? message.content
                .map((item) => normalizeOptionalString(item?.text))
                .filter(Boolean)
                .join('\n')
            : normalizeOptionalString(message.content);

        return [role, timestamp, text].filter(Boolean).join('|');
    }

    appendHistoryMessage(message) {
        const identity = this.buildMessageIdentity(message);
        if (!identity || this.messageIds.has(identity)) {
            return false;
        }
        this.messageIds.add(identity);
        this.historyCache.push(message);
        return true;
    }

    async sendMessage(content, options = {}) {
        const message = normalizeOptionalString(content);
        if (!message) {
            throw new Error('消息不能为空');
        }

        return await this.request(
            'chat.send',
            {
                sessionKey: this.sessionKey,
                message,
                idempotencyKey: randomUUID()
            },
            Number(options.timeoutMs) || DEFAULT_REQUEST_TIMEOUT_MS
        );
    }

    async abortRun(runId) {
        return await this.request('chat.abort', {
            sessionKey: this.sessionKey,
            runId: normalizeOptionalString(runId) || undefined
        });
    }

    async listSessions(limit = 20) {
        return await this.request('sessions.list', { limit });
    }

    async setSessionKey(nextSessionKey) {
        const normalized = normalizeOptionalString(nextSessionKey);
        if (!normalized || normalized === this.sessionKey) {
            return this.getStatus();
        }

        const previous = this.sessionKey;
        this.sessionKey = normalized;
        this.historyCache = [];
        this.messageIds.clear();

        if (this.connected) {
            try {
                await this.request('sessions.messages.unsubscribe', { key: previous });
            } catch {}
            this.sessionSubscriptionsReady = false;
            await this.ensureSessionSubscriptions();
        }

        this.emit('event', {
            type: 'session.switched',
            payload: {
                previousSessionKey: previous,
                sessionKey: this.sessionKey
            }
        });
        return this.getStatus();
    }

    async patchSession(patch = {}) {
        return await this.request('sessions.patch', {
            key: this.sessionKey,
            ...patch
        });
    }

    matchesSessionKey(nextSessionKey) {
        return normalizeOptionalString(nextSessionKey) === this.sessionKey;
    }

    handleGatewayFrame(frame) {
        if (!frame || frame.type !== 'event') {
            return;
        }

        const eventName = normalizeOptionalString(frame.event);
        const payload = frame.payload || {};

        if (eventName === 'tick') {
            this.emitStatus();
            return;
        }

        if (eventName === 'chat') {
            if (!this.matchesSessionKey(payload.sessionKey)) {
                return;
            }
            this.emit('event', { type: 'chat', payload });
            return;
        }

        if (eventName === 'session.message') {
            if (!this.matchesSessionKey(payload.sessionKey)) {
                return;
            }
            if (payload.message) {
                this.appendHistoryMessage(payload.message);
            }
            this.emit('event', { type: 'session.message', payload });
            return;
        }

        if (eventName === 'session.tool') {
            if (!this.matchesSessionKey(payload.sessionKey)) {
                return;
            }
            this.emit('event', { type: 'session.tool', payload });
            return;
        }

        if (eventName === 'sessions.changed') {
            if (payload.sessionKey && !this.matchesSessionKey(payload.sessionKey)) {
                return;
            }
            this.emit('event', { type: 'sessions.changed', payload });
        }
    }

    async shutdown() {
        this.closedManually = true;
        await this.teardownClient();
        this.emitStatus();
    }
}

class OpenClawRuntimeSupervisor extends EventEmitter {
    constructor(options = {}) {
        super();

        this.app = options.app;
        this.gatewayUrl = DEFAULT_GATEWAY_URL;
        this.address = normalizeGatewayAddress(DEFAULT_GATEWAY_URL);
        this.bundleRoot = '';
        this.vendorNodePath = '';
        this.homeRoot = resolveOpenClawHomeRoot(this.app);
        this.logsDir = path.join(this.homeRoot, 'logs');
        this.stdoutLogPath = path.join(this.logsDir, 'gateway.out.log');
        this.stderrLogPath = path.join(this.logsDir, 'gateway.err.log');
        this.child = null;
        this.childStdoutStream = null;
        this.childStderrStream = null;
        this.recentOutput = {
            stdout: '',
            stderr: ''
        };
        this.pendingRestart = false;
        this.closedManually = false;
        this.health = 'idle';
        this.lastError = '';
        this.lastStartedAt = 0;
        this.startPromise = null;

        this.configure(options);
    }

    configure(options = {}) {
        const previousSignature = this.getLaunchSignature();
        this.gatewayUrl = normalizeOptionalString(options.gatewayUrl, this.gatewayUrl || DEFAULT_GATEWAY_URL);
        this.address = normalizeGatewayAddress(this.gatewayUrl);
        this.homeRoot = normalizeOptionalString(options.homeRoot, resolveOpenClawHomeRoot(this.app));
        this.logsDir = path.join(this.homeRoot, 'logs');
        this.stdoutLogPath = path.join(this.logsDir, 'gateway.out.log');
        this.stderrLogPath = path.join(this.logsDir, 'gateway.err.log');
        this.bundleRoot = resolveBundledOpenClawRoot(this.app);
        this.vendorNodePath = resolveVendorNodePath(this.app);

        if (previousSignature && previousSignature !== this.getLaunchSignature()) {
            this.pendingRestart = true;
        }

        this.applyEnvironment();
        this.emitStatus();
        return this.getStatus();
    }

    getLaunchSignature() {
        return [
            this.address.host,
            this.address.port,
            this.bundleRoot,
            this.vendorNodePath,
            this.homeRoot
        ].join('|');
    }

    getSdkPath() {
        return this.bundleRoot
            ? path.join(this.bundleRoot, 'dist', 'plugin-sdk', 'gateway-runtime.js')
            : '';
    }

    isBundleReady() {
        return isValidRuntimeRoot(this.bundleRoot);
    }

    isVendorReady() {
        return Boolean(this.vendorNodePath && fileExists(this.vendorNodePath));
    }

    getStatus() {
        return {
            enabled: true,
            managedLocalGateway: this.address.managed,
            bundleReady: this.isBundleReady(),
            vendorReady: this.isVendorReady(),
            bundleRoot: this.bundleRoot,
            vendorNodePath: this.vendorNodePath,
            gatewayUrl: this.address.displayUrl,
            port: this.address.port,
            homeRoot: this.homeRoot,
            logsDir: this.logsDir,
            stdoutLogPath: this.stdoutLogPath,
            stderrLogPath: this.stderrLogPath,
            running: isChildAlive(this.child),
            pid: isChildAlive(this.child) ? this.child.pid : 0,
            health: this.health,
            lastError: this.lastError,
            lastStartedAt: this.lastStartedAt
        };
    }

    emitStatus() {
        this.emit('status', this.getStatus());
    }

    applyEnvironment() {
        if (!this.bundleRoot) {
            return;
        }

        const sdkPath = this.getSdkPath();
        process.env.OPENCLAW_HOME = this.homeRoot;
        process.env.AILIS_OPENCLAW_HOME = this.homeRoot;
        process.env.OPENCLAW_REPO = this.bundleRoot;
        process.env.AILIS_OPENCLAW_REPO = this.bundleRoot;
        process.env.OPENCLAW_SDK_PATH = sdkPath;
        process.env.AILIS_OPENCLAW_SDK_PATH = sdkPath;
        process.env.OPENCLAW_GATEWAY_URL = this.address.url;
        process.env.AILIS_OPENCLAW_GATEWAY_URL = this.address.url;
    }

    ensureHomeStructure() {
        fs.mkdirSync(this.homeRoot, { recursive: true });
        fs.mkdirSync(path.join(this.homeRoot, '.openclaw'), { recursive: true });
        fs.mkdirSync(this.logsDir, { recursive: true });
    }

    appendRecentOutput(kind, chunk) {
        const text = chunk ? String(chunk) : '';
        if (!text) {
            return;
        }
        this.recentOutput[kind] = `${this.recentOutput[kind]}${text}`.slice(-24000);
    }

    readFailureContext() {
        const stderr = normalizeOptionalString(this.recentOutput.stderr);
        const stdout = normalizeOptionalString(this.recentOutput.stdout);
        const blocks = [];

        if (stderr) {
            blocks.push(`stderr:\n${stderr.split(/\r?\n/).slice(-16).join('\n')}`);
        }
        if (stdout) {
            blocks.push(`stdout:\n${stdout.split(/\r?\n/).slice(-16).join('\n')}`);
        }

        return blocks.length > 0 ? `\n\n${blocks.join('\n\n')}` : '';
    }

    buildSpawnEnvironment() {
        const env = {
            ...process.env,
            OPENCLAW_HOME: this.homeRoot,
            AILIS_OPENCLAW_HOME: this.homeRoot,
            OPENCLAW_REPO: this.bundleRoot,
            AILIS_OPENCLAW_REPO: this.bundleRoot,
            OPENCLAW_SDK_PATH: this.getSdkPath(),
            AILIS_OPENCLAW_SDK_PATH: this.getSdkPath(),
            OPENCLAW_GATEWAY_URL: this.address.url,
            AILIS_OPENCLAW_GATEWAY_URL: this.address.url
        };

        if (!this.isVendorReady()) {
            env.ELECTRON_RUN_AS_NODE = '1';
        }

        return env;
    }

    buildLaunchArgs(reset = false) {
        const args = [
            path.join(this.bundleRoot, 'openclaw.mjs'),
            'gateway',
            '--dev',
            '--force',
            '--allow-unconfigured',
            '--bind',
            'loopback',
            '--auth',
            'none',
            '--port',
            String(this.address.port),
            '--verbose'
        ];

        if (reset) {
            args.push('--reset');
        }

        args.push('run');
        return args;
    }

    spawnGatewayProcess(reset = false) {
        this.ensureHomeStructure();
        this.recentOutput.stdout = '';
        this.recentOutput.stderr = '';
        this.closedManually = false;

        const nodeBinary = this.isVendorReady() ? this.vendorNodePath : process.execPath;
        const child = spawn(nodeBinary, this.buildLaunchArgs(reset), {
            cwd: this.bundleRoot,
            env: this.buildSpawnEnvironment(),
            stdio: ['ignore', 'pipe', 'pipe'],
            windowsHide: true
        });

        this.child = child;
        this.childStdoutStream = fs.createWriteStream(this.stdoutLogPath, { flags: 'a' });
        this.childStderrStream = fs.createWriteStream(this.stderrLogPath, { flags: 'a' });
        this.lastStartedAt = Date.now();

        child.stdout.on('data', (chunk) => {
            this.appendRecentOutput('stdout', chunk);
            this.childStdoutStream?.write(chunk);
        });
        child.stderr.on('data', (chunk) => {
            this.appendRecentOutput('stderr', chunk);
            this.childStderrStream?.write(chunk);
        });

        child.on('error', (error) => {
            this.lastError = error instanceof Error ? error.message : String(error);
            this.health = 'error';
            this.emitStatus();
        });

        child.on('close', (code, signal) => {
            this.childStdoutStream?.end();
            this.childStderrStream?.end();
            this.childStdoutStream = null;
            this.childStderrStream = null;

            if (this.child === child) {
                this.child = null;
            }

            if (!this.closedManually) {
                this.lastError = this.lastError || `OpenClaw Gateway 已退出 (${code ?? signal ?? 'unknown'})`;
                if (this.health === 'running') {
                    this.health = 'stopped';
                } else if (this.health !== 'external') {
                    this.health = 'error';
                }
                this.emitStatus();
            }
        });
    }

    async waitForTcpPort(timeoutMs = DEFAULT_BOOT_TIMEOUT_MS) {
        const deadline = Date.now() + timeoutMs;

        while (Date.now() < deadline) {
            if (await canConnect(this.address.probeHost, this.address.port, 800)) {
                return true;
            }
            if (this.child && this.child.exitCode !== null) {
                return false;
            }
            await delay(350);
        }

        return false;
    }

    async waitForGatewayProcessReady(timeoutMs = DEFAULT_BOOT_TIMEOUT_MS) {
        const portReady = await this.waitForTcpPort(timeoutMs);
        if (portReady) {
            return;
        }

        if (this.child && this.child.exitCode !== null) {
            throw new Error(
                `OpenClaw Gateway 启动后提前退出 (${this.child.exitCode ?? 'unknown'})${this.readFailureContext()}`
            );
        }

        throw new Error(
            `等待 OpenClaw Gateway 监听 ${this.address.port} 超时${this.readFailureContext()}`
        );
    }

    async probeGatewayProtocol(timeoutMs = 8000) {
        const deadline = Date.now() + timeoutMs;
        while (Date.now() < deadline) {
            const tcpReady = await this.waitForTcpPort(1200);
            if (!tcpReady) {
                await delay(400);
                continue;
            }

            const probeClient = new OpenClawGatewayManager({
                app: this.app,
                clientVersion: 'ailis-openclaw-probe',
                enabled: true,
                gatewayUrl: this.address.url
            });

            try {
                await probeClient.ensureConnected();
                await probeClient.request('sessions.list', { limit: 1 }, 8000);
                await probeClient.shutdown().catch(() => {});
                return true;
            } catch (error) {
                this.lastError = error instanceof Error ? error.message : String(error);
                await probeClient.shutdown().catch(() => {});
                await delay(600);
            }
        }

        return false;
    }

    async stopChild() {
        if (!isChildAlive(this.child)) {
            this.child = null;
            return;
        }

        const child = this.child;
        this.closedManually = true;

        try {
            child.kill();
        } catch {}

        const deadline = Date.now() + 6000;
        while (Date.now() < deadline) {
            if (child.exitCode !== null) {
                break;
            }
            await delay(200);
        }

        if (child.exitCode === null && process.platform === 'win32' && child.pid) {
            spawnSync('taskkill', ['/PID', String(child.pid), '/T', '/F'], {
                stdio: 'ignore',
                shell: true
            });
        }

        this.child = null;
    }

    async spawnAndVerify(reset = false) {
        await this.stopChild();
        this.health = reset ? 'repairing' : 'bootstrapping';
        this.lastError = '';
        this.emitStatus();
        this.spawnGatewayProcess(reset);
        await this.waitForGatewayProcessReady(reset ? 90000 : DEFAULT_BOOT_TIMEOUT_MS);

        const protocolReady = await this.probeGatewayProtocol(reset ? 12000 : 8000);
        if (!protocolReady) {
            throw new Error(
                `${reset ? 'OpenClaw Gateway 重置后仍未通过握手检查' : 'OpenClaw Gateway 握手检查失败'}${this.readFailureContext()}`
            );
        }

        this.health = 'running';
        this.lastError = '';
        this.emitStatus();
    }

    async ensureReady() {
        const existingGatewayHealthy = await this.probeGatewayProtocol(2500);
        if (existingGatewayHealthy) {
            this.health = 'running';
            this.lastError = '';
            this.emitStatus();
            return this.getStatus();
        }

        if (!this.address.managed) {
            this.health = 'external';
            this.lastError = '当前 Gateway 地址不是本机回环地址，已切换为外部 Gateway 模式。';
            this.emitStatus();
            return this.getStatus();
        }

        if (!this.isBundleReady()) {
            this.health = 'error';
            this.lastError = '未找到 OpenClaw runtime，请先执行 pnpm openclaw:prepare-runtime。';
            this.emitStatus();
            throw new Error(this.lastError);
        }

        if (this.startPromise) {
            await this.startPromise;
            return this.getStatus();
        }

        this.startPromise = (async () => {
            this.applyEnvironment();
            this.ensureHomeStructure();

            if (this.pendingRestart) {
                await this.stopChild();
                this.pendingRestart = false;
            }

            const alreadyHealthy = await this.probeGatewayProtocol(4000);
            if (alreadyHealthy) {
                this.health = 'running';
                this.lastError = '';
                this.emitStatus();
                return;
            }

            try {
                await this.spawnAndVerify(false);
            } catch (error) {
                this.lastError = error instanceof Error ? error.message : String(error);
                this.health = 'repairing';
                this.emitStatus();
                await this.spawnAndVerify(true);
            }
        })().finally(() => {
            this.startPromise = null;
        });

        await this.startPromise;
        return this.getStatus();
    }

    async shutdown() {
        this.pendingRestart = false;
        await this.stopChild();
        this.health = 'stopped';
        this.emitStatus();
        return this.getStatus();
    }
}

module.exports = {
    DEFAULT_GATEWAY_URL,
    DEFAULT_SESSION_KEY,
    OpenClawGatewayManager,
    OpenClawRuntimeSupervisor,
    toGatewayWsUrl
};
