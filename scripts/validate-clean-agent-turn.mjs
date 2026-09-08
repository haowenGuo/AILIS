import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs/promises';
import net from 'node:net';
import os from 'node:os';
import path from 'node:path';

const MODEL_ENV_PATTERNS = [
    /^AILIS_(?:AGENT_)?LLM_/i,
    /^(?:OPENAI|DEEPSEEK|ARK|VOLCENGINE|DOUBAO|DASHSCOPE|QWEN|MOONSHOT|KIMI|ZHIPU|GLM|OPENROUTER|ANTHROPIC|CLAUDE|GEMINI|GOOGLE)_/i
];

function readOption(name, fallback = '') {
    const prefix = `--${name}=`;
    const inline = process.argv.slice(2).find((item) => item.startsWith(prefix));
    return inline ? inline.slice(prefix.length) : fallback;
}

function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function removeTreeAfterProcessExit(root) {
    let lastError = null;
    for (let attempt = 0; attempt < 12; attempt++) {
        try {
            await fs.rm(root, { recursive: true, force: true, maxRetries: 3, retryDelay: 250 });
            return;
        } catch (error) {
            lastError = error;
            if (!['EBUSY', 'EPERM', 'ENOTEMPTY'].includes(error?.code)) throw error;
            await delay(500 + attempt * 250);
        }
    }
    throw lastError;
}

async function findFreePort() {
    return await new Promise((resolve, reject) => {
        const server = net.createServer();
        server.once('error', reject);
        server.listen(0, '127.0.0.1', () => {
            const address = server.address();
            server.close(() => resolve(address.port));
        });
    });
}

async function fetchJson(url, timeoutMs = 2000) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.json();
    } finally {
        clearTimeout(timer);
    }
}

async function waitForDebugPage(port, timeoutMs = 60000) {
    const deadline = Date.now() + timeoutMs;
    let lastError = null;
    while (Date.now() < deadline) {
        try {
            const pages = await fetchJson(`http://127.0.0.1:${port}/json/list`);
            const page = pages.find((item) => /(?:chat|pet)\.html(?:$|\?)/i.test(item.url || '')) || pages[0];
            if (page?.webSocketDebuggerUrl) return { page, pages };
        } catch (error) {
            lastError = error;
        }
        await delay(500);
    }
    throw new Error(`Electron DevTools endpoint did not become ready: ${lastError?.message || 'timeout'}`);
}

class CdpClient {
    constructor(url) {
        this.url = url;
        this.socket = null;
        this.nextId = 1;
        this.pending = new Map();
    }

    async connect() {
        this.socket = new WebSocket(this.url);
        await new Promise((resolve, reject) => {
            const timer = setTimeout(() => reject(new Error('CDP WebSocket connection timed out')), 10000);
            this.socket.addEventListener('open', () => {
                clearTimeout(timer);
                resolve();
            }, { once: true });
            this.socket.addEventListener('error', () => {
                clearTimeout(timer);
                reject(new Error('CDP WebSocket connection failed'));
            }, { once: true });
        });
        this.socket.addEventListener('message', (event) => {
            const message = JSON.parse(String(event.data));
            if (!message.id) return;
            const pending = this.pending.get(message.id);
            if (!pending) return;
            this.pending.delete(message.id);
            clearTimeout(pending.timer);
            if (message.error) pending.reject(new Error(message.error.message || JSON.stringify(message.error)));
            else pending.resolve(message.result || {});
        });
    }

    async send(method, params = {}, timeoutMs = 120000) {
        const id = this.nextId++;
        const response = new Promise((resolve, reject) => {
            const timer = setTimeout(() => {
                this.pending.delete(id);
                reject(new Error(`${method} timed out after ${timeoutMs}ms`));
            }, timeoutMs);
            this.pending.set(id, { resolve, reject, timer });
        });
        this.socket.send(JSON.stringify({ id, method, params }));
        return await response;
    }

    async evaluate(expression, timeoutMs = 120000) {
        const response = await this.send('Runtime.evaluate', {
            expression,
            awaitPromise: true,
            returnByValue: true,
            userGesture: true
        }, timeoutMs);
        if (response.exceptionDetails) {
            throw new Error(response.exceptionDetails.exception?.description || 'Renderer evaluation failed');
        }
        return response.result?.value;
    }

    close() {
        this.socket?.close();
    }
}

async function main() {
    const artifact = path.resolve(readOption('artifact'));
    const expectedVersion = readOption('expected-version', '');
    const keepRoot = readOption('keep-root', '') === 'true';
    if (!artifact || !(await fs.stat(artifact).catch(() => null))?.isFile()) {
        throw new Error('Pass an existing installer or portable executable with --artifact=...');
    }

    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-clean-agent-turn-'));
    const appData = path.join(root, 'AppData', 'Roaming');
    const localAppData = path.join(root, 'AppData', 'Local');
    const userData = path.join(root, 'electron-user-data');
    const temp = path.join(root, 'Temp');
    await Promise.all([appData, localAppData, userData, temp].map((entry) => fs.mkdir(entry, { recursive: true })));

    const env = { ...process.env };
    for (const key of Object.keys(env)) {
        if (MODEL_ENV_PATTERNS.some((pattern) => pattern.test(key))) delete env[key];
    }
    Object.assign(env, {
        APPDATA: appData,
        LOCALAPPDATA: localAppData,
        USERPROFILE: root,
        HOME: root,
        TEMP: temp,
        TMP: temp
    });

    const port = await findFreePort();
    const stdoutPath = path.join(root, 'app.stdout.log');
    const stderrPath = path.join(root, 'app.stderr.log');
    const stdoutHandle = await fs.open(stdoutPath, 'w');
    const stderrHandle = await fs.open(stderrPath, 'w');
    const child = spawn(artifact, [
        `--remote-debugging-port=${port}`,
        `--user-data-dir=${userData}`,
        '--enable-logging'
    ], {
        env,
        windowsHide: true,
        stdio: ['ignore', stdoutHandle.fd, stderrHandle.fd]
    });

    let cdp = null;
    let report = null;
    try {
        const { page, pages } = await waitForDebugPage(port);
        cdp = new CdpClient(page.webSocketDebuggerUrl);
        await cdp.connect();
        await cdp.send('Runtime.enable');

        const preferences = await cdp.evaluate('window.ailisDesktop.getPreferences()');
        const nonce = `clean-${Date.now().toString(36)}`;
        const startedAt = Date.now();
        const result = await cdp.evaluate(`window.ailisDesktop.gateway.runAgent(${JSON.stringify({
            sessionId: `release-clean-${nonce}`,
            message: `请只回复这个校验码：${nonce}`,
            agentLoop: 'llm',
            directToolExecutor: true,
            context: {
                agentLoop: 'llm',
                directToolExecutor: true,
                agentRole: 'unified_agent',
                unifiedAgent: true,
                taskAgentRoutingOwned: false
            }
        })})`, 180000);
        const displayText = String(result?.displayText || result?.speechText || result?.finalAnswer || '').trim();
        const configError = result?.status === 'needs_llm_config' || /可用的大模型配置|API Base、模型和 Key/.test(displayText);
        const ok = !configError && result?.ok !== false && displayText.length > 0;
        report = {
            schemaVersion: 1,
            ok,
            artifact,
            expectedVersion,
            isolatedRoot: root,
            page: { title: page.title, url: page.url },
            pageCount: pages.length,
            preferences: {
                llmProvider: preferences?.llmProvider || '',
                llmBaseUrl: preferences?.llmBaseUrl || '',
                llmModel: preferences?.llmModel || '',
                llmApiKeyConfigured: Boolean(preferences?.llmApiKeyConfigured)
            },
            agentTurn: {
                ok: result?.ok === true,
                status: result?.status || '',
                durationMs: Date.now() - startedAt,
                displayText,
                nonceMatched: displayText.includes(nonce),
                configError
            },
            logs: { stdoutPath, stderrPath }
        };
        await fs.writeFile(path.join(root, 'clean-agent-turn-report.json'), `${JSON.stringify(report, null, 2)}\n`);
        console.log(JSON.stringify(report, null, 2));
        if (!ok) process.exitCode = 1;
    } finally {
        cdp?.close();
        if (child.pid) spawnSync('taskkill', ['/PID', String(child.pid), '/T', '/F'], { windowsHide: true, stdio: 'ignore' });
        await Promise.allSettled([stdoutHandle.close(), stderrHandle.close()]);
        if (!keepRoot && report?.ok) {
            await delay(1000);
            await removeTreeAfterProcessExit(root);
        }
    }
}

main().catch((error) => {
    console.error(error?.stack || error);
    process.exitCode = 1;
});
