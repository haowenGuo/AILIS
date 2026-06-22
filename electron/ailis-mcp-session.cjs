const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const { validateAgainstSchema } = require('./ailis-tool-contracts.cjs');
const {
    buildAilisMcpToolCallArgs,
    buildAilisMcpToolDescriptionAddendum,
    createAilisDirectMcpToolSpec,
    enhanceAilisMcpToolSchema
} = require('./ailis-mcp-adapter.cjs');
const {
    rankToolSearchResults
} = require('./ailis-tool-routing.cjs');

const DEFAULT_MCP_PROTOCOL_VERSION = '2025-06-18';
const DEFAULT_MCP_TIMEOUT_MS = 30000;
const DEFAULT_STDERR_LINES = 40;

function normalizeString(value, fallback = '') {
    if (typeof value !== 'string') {
        return fallback;
    }
    const trimmed = value.trim();
    return trimmed || fallback;
}

function normalizeArray(value) {
    if (!value) {
        return [];
    }
    return Array.isArray(value) ? value : [value];
}

function normalizeObject(value) {
    return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
}

function parseJsonConfig(value) {
    if (!value || typeof value !== 'string') {
        return null;
    }
    try {
        return JSON.parse(value);
    } catch {
        return null;
    }
}

function redactEnv(env = {}) {
    const result = {};
    for (const [key, value] of Object.entries(env || {})) {
        if (/token|password|secret|api[_-]?key|authorization|credential|pass/i.test(key)) {
            result[key] = '__REDACTED__';
        } else {
            result[key] = String(value);
        }
    }
    return result;
}

function redactHeaders(headers = {}) {
    const result = {};
    for (const [key, value] of Object.entries(headers || {})) {
        if (/authorization|token|password|secret|api[_-]?key|credential/i.test(key)) {
            result[key] = '__REDACTED__';
        } else {
            result[key] = String(value);
        }
    }
    return result;
}

function normalizeMcpServerEntries(value) {
    const parsed = typeof value === 'string' ? parseJsonConfig(value) : value;
    if (!parsed) {
        return [];
    }
    if (Array.isArray(parsed)) {
        return parsed
            .map((entry, index) => ({
                name: normalizeString(entry?.name || entry?.id, `mcp-${index + 1}`),
                config: normalizeObject(entry)
            }))
            .filter((entry) => entry.name && entry.config);
    }
    if (typeof parsed === 'object') {
        if (parsed.command || parsed.transport || parsed.url) {
            return [
                {
                    name: normalizeString(parsed.name || parsed.id, 'default'),
                    config: normalizeObject(parsed)
                }
            ];
        }
        return Object.entries(parsed)
            .map(([name, config]) => ({
                name: normalizeString(config?.name || config?.id || name),
                config: normalizeObject(config)
            }))
            .filter((entry) => entry.name && entry.config);
    }
    return [];
}

function publicServerConfig(name, config = {}, session = null) {
    const transport = normalizeString(config.transport || config.type, config.url ? 'http' : 'stdio');
    return {
        name,
        transport,
        command: transport === 'stdio' ? normalizeString(config.command) : undefined,
        args: transport === 'stdio' ? normalizeArray(config.args).map(String) : undefined,
        cwd: transport === 'stdio' ? normalizeString(config.cwd) : undefined,
        url: transport !== 'stdio' ? normalizeString(config.url) : undefined,
        headers: transport !== 'stdio' && config.headers ? redactHeaders(config.headers) : undefined,
        bearerTokenEnvVar: transport !== 'stdio' ? normalizeString(config.bearerTokenEnvVar || config.bearer_token_env_var) : undefined,
        env: config.env ? redactEnv(config.env) : undefined,
        disabled: config.disabled === true,
        status: session?.status || 'configured',
        startedAt: session?.startedAt || 0,
        lastUsedAt: session?.lastUsedAt || 0,
        exitCode: session?.exitCode ?? null,
        error: session?.lastError || '',
        stderrTail: session?.stderrTail || []
    };
}

function schemaPropertyNames(schema = {}) {
    const properties = normalizeObject(schema.properties);
    return Object.keys(properties).filter(Boolean);
}

function makeMcpToolSpec(serverName, tool = {}) {
    const server = normalizeString(serverName);
    const toolName = normalizeString(tool?.name || tool?.id);
    const rawInputSchema = normalizeObject(tool?.inputSchema || tool?.input_schema);
    const inputSchema = enhanceAilisMcpToolSchema({
        server,
        tool: toolName,
        inputSchema: rawInputSchema
    });
    const schemaProperties = schemaPropertyNames(inputSchema);
    const descriptionAddendum = buildAilisMcpToolDescriptionAddendum({
        server,
        tool: toolName,
        inputSchema
    });
    return createAilisDirectMcpToolSpec({
        server,
        tool: toolName,
        name: `${server}.${toolName}`,
        title: normalizeString(tool?.title),
        description: normalizeString(tool?.description),
        inputSchema,
        schemaProperties,
        descriptionAddendum,
        callPattern: {
            args: buildAilisMcpToolCallArgs({
                tool: toolName,
                schemaProperties,
                inputSchema
            })
        }
    });
}

function buildMcpToolSearchText(spec = {}) {
    return [
        spec.id,
        spec.legacy_id,
        spec.name,
        spec.display_name,
        spec.namespace,
        spec.callable_name,
        spec.server,
        spec.tool,
        spec.title,
        spec.description,
        Array.isArray(spec.schema_properties)
            ? spec.schema_properties.join(' ')
            : Array.isArray(spec.schemaProperties)
                ? spec.schemaProperties.join(' ')
                : ''
    ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
}

function sanitizeServerConfig(config = {}) {
    const clean = normalizeObject(config);
    const next = { ...clean };
    delete next.status;
    delete next.startedAt;
    delete next.lastUsedAt;
    delete next.exitCode;
    delete next.error;
    delete next.stderrTail;
    return next;
}

function configFingerprint(config = {}) {
    return JSON.stringify({
        transport: config.transport || config.type || (config.url ? 'http' : 'stdio'),
        command: config.command || '',
        args: normalizeArray(config.args).map(String),
        cwd: config.cwd || '',
        url: config.url || '',
        headers: normalizeObject(config.headers),
        bearerTokenEnvVar: config.bearerTokenEnvVar || config.bearer_token_env_var || '',
        env: normalizeObject(config.env)
    });
}

function parseSseJson(text) {
    const events = [];
    let dataLines = [];
    for (const rawLine of String(text || '').split(/\r?\n/)) {
        const line = rawLine.trimEnd();
        if (!line) {
            if (dataLines.length) {
                events.push(dataLines.join('\n'));
                dataLines = [];
            }
            continue;
        }
        if (line.startsWith('data:')) {
            dataLines.push(line.slice(5).trimStart());
        }
    }
    if (dataLines.length) {
        events.push(dataLines.join('\n'));
    }
    for (const eventText of events) {
        try {
            return JSON.parse(eventText);
        } catch {}
    }
    return null;
}

function parseHttpJsonRpcResponse(text, contentType = '') {
    const raw = String(text || '').trim();
    if (!raw) {
        return null;
    }
    if (/text\/event-stream/i.test(contentType)) {
        return parseSseJson(raw);
    }
    try {
        return JSON.parse(raw);
    } catch {
        return parseSseJson(raw);
    }
}

class McpStdioSession {
    constructor({ name, config, workspaceRoot, projectRoot, emitGatewayEvent }) {
        this.name = name;
        this.config = config || {};
        this.workspaceRoot = workspaceRoot;
        this.projectRoot = projectRoot;
        this.emitGatewayEvent = typeof emitGatewayEvent === 'function' ? emitGatewayEvent : () => {};
        this.proc = null;
        this.stdoutBuffer = '';
        this.pending = new Map();
        this.requestSeq = 0;
        this.startPromise = null;
        this.initialized = false;
        this.status = 'configured';
        this.startedAt = 0;
        this.lastUsedAt = 0;
        this.exitCode = null;
        this.lastError = '';
        this.stderrTail = [];
        this.fingerprint = configFingerprint(config);
    }

    resolveCwd() {
        const cwd = normalizeString(this.config.cwd);
        if (!cwd) {
            return this.workspaceRoot || this.projectRoot || process.cwd();
        }
        return path.isAbsolute(cwd)
            ? path.resolve(cwd)
            : path.resolve(this.workspaceRoot || this.projectRoot || process.cwd(), cwd);
    }

    async ensureStarted() {
        if (this.proc && !this.proc.killed && this.initialized) {
            return this;
        }
        if (this.startPromise) {
            return await this.startPromise;
        }
        this.startPromise = this.start();
        try {
            await this.startPromise;
            return this;
        } finally {
            this.startPromise = null;
        }
    }

    async start() {
        const transport = normalizeString(this.config.transport || this.config.type, 'stdio');
        if (transport !== 'stdio') {
            throw new Error(`MCP server ${this.name} uses unsupported transport: ${transport}`);
        }
        const command = normalizeString(this.config.command);
        if (!command) {
            throw new Error(`MCP server ${this.name} is missing command`);
        }

        const args = normalizeArray(this.config.args).map(String);
        const cwd = this.resolveCwd();
        const env = {
            ...process.env,
            ...Object.fromEntries(
                Object.entries(normalizeObject(this.config.env)).map(([key, value]) => [key, String(value)])
            )
        };

        this.status = 'starting';
        this.lastError = '';
        this.emitGatewayEvent('mcp.server.starting', {
            server: this.name,
            command,
            args,
            cwd
        });

        const child = spawn(command, args, {
            cwd,
            env,
            stdio: ['pipe', 'pipe', 'pipe'],
            windowsHide: true
        });
        this.proc = child;
        this.startedAt = Date.now();
        this.exitCode = null;

        child.stdout.setEncoding('utf8');
        child.stderr.setEncoding('utf8');
        child.stdout.on('data', (chunk) => this.handleStdout(chunk));
        child.stderr.on('data', (chunk) => this.handleStderr(chunk));
        child.on('error', (error) => this.handleProcessError(error));
        child.on('exit', (code, signal) => this.handleExit(code, signal));

        await new Promise((resolve, reject) => {
            const onError = (error) => {
                child.off('spawn', onSpawn);
                reject(error);
            };
            const onSpawn = () => {
                child.off('error', onError);
                resolve();
            };
            child.once('error', onError);
            child.once('spawn', onSpawn);
        });

        const init = await this.sendRequest(
            'initialize',
            {
                protocolVersion: normalizeString(this.config.protocolVersion, DEFAULT_MCP_PROTOCOL_VERSION),
                capabilities: {},
                clientInfo: {
                    name: 'AILIS',
                    version: '1.0.1'
                }
            },
            Number(this.config.timeoutMs || DEFAULT_MCP_TIMEOUT_MS)
        );
        this.sendNotification('notifications/initialized', {});
        this.initialized = true;
        this.status = 'running';
        this.emitGatewayEvent('mcp.server.started', {
            server: this.name,
            protocolVersion: init?.protocolVersion || DEFAULT_MCP_PROTOCOL_VERSION,
            serverInfo: init?.serverInfo || null
        });
        return init;
    }

    handleStdout(chunk) {
        this.stdoutBuffer += chunk;
        let index = this.stdoutBuffer.indexOf('\n');
        while (index >= 0) {
            const line = this.stdoutBuffer.slice(0, index).trim();
            this.stdoutBuffer = this.stdoutBuffer.slice(index + 1);
            if (line) {
                this.handleMessageLine(line);
            }
            index = this.stdoutBuffer.indexOf('\n');
        }
    }

    handleStderr(chunk) {
        const lines = String(chunk)
            .split(/\r?\n/)
            .map((line) => line.trim())
            .filter(Boolean);
        this.stderrTail.push(...lines);
        if (this.stderrTail.length > DEFAULT_STDERR_LINES) {
            this.stderrTail = this.stderrTail.slice(-DEFAULT_STDERR_LINES);
        }
        if (lines.length) {
            this.emitGatewayEvent('mcp.server.stderr', {
                server: this.name,
                lines: lines.slice(-5)
            });
        }
    }

    handleMessageLine(line) {
        let message = null;
        try {
            message = JSON.parse(line);
        } catch {
            this.emitGatewayEvent('mcp.server.stdout.unparseable', {
                server: this.name,
                preview: line.slice(0, 500)
            });
            return;
        }

        if (message && Object.prototype.hasOwnProperty.call(message, 'id')) {
            const pending = this.pending.get(String(message.id));
            if (!pending) {
                return;
            }
            this.pending.delete(String(message.id));
            clearTimeout(pending.timer);
            if (message.error) {
                const error = new Error(message.error.message || 'MCP request failed');
                error.details = message.error;
                pending.reject(error);
            } else {
                pending.resolve(message.result);
            }
            return;
        }

        this.emitGatewayEvent('mcp.server.notification', {
            server: this.name,
            method: message?.method || '',
            params: message?.params || null
        });
    }

    handleProcessError(error) {
        this.status = 'error';
        this.lastError = error?.message || String(error);
        this.rejectPending(error);
        this.emitGatewayEvent('mcp.server.error', {
            server: this.name,
            error: this.lastError
        });
    }

    handleExit(code, signal) {
        this.status = 'exited';
        this.exitCode = code;
        this.initialized = false;
        this.proc = null;
        const error = new Error(`MCP server ${this.name} exited with code ${code ?? 'null'} signal ${signal || 'none'}`);
        this.rejectPending(error);
        this.emitGatewayEvent('mcp.server.exited', {
            server: this.name,
            code,
            signal
        });
    }

    rejectPending(error) {
        for (const [id, pending] of this.pending.entries()) {
            clearTimeout(pending.timer);
            pending.reject(error);
            this.pending.delete(id);
        }
    }

    async request(method, params = {}, timeoutMs = DEFAULT_MCP_TIMEOUT_MS) {
        await this.ensureStarted();
        return await this.sendRequest(method, params, timeoutMs);
    }

    sendRequest(method, params = {}, timeoutMs = DEFAULT_MCP_TIMEOUT_MS) {
        if (!this.proc?.stdin?.writable) {
            throw new Error(`MCP server ${this.name} is not writable`);
        }
        const id = String(++this.requestSeq);
        const message = {
            jsonrpc: '2.0',
            id,
            method,
            params
        };
        const boundedTimeout = Math.max(1000, Math.min(Number(timeoutMs) || DEFAULT_MCP_TIMEOUT_MS, 180000));
        this.lastUsedAt = Date.now();
        return new Promise((resolve, reject) => {
            const timer = setTimeout(() => {
                this.pending.delete(id);
                reject(new Error(`MCP ${this.name}.${method} timed out after ${boundedTimeout}ms`));
            }, boundedTimeout);
            this.pending.set(id, { resolve, reject, timer, method });
            this.proc.stdin.write(`${JSON.stringify(message)}\n`, 'utf8', (error) => {
                if (error) {
                    clearTimeout(timer);
                    this.pending.delete(id);
                    reject(error);
                }
            });
        });
    }

    sendNotification(method, params = {}) {
        if (!this.proc?.stdin?.writable) {
            return;
        }
        this.proc.stdin.write(`${JSON.stringify({ jsonrpc: '2.0', method, params })}\n`, 'utf8');
    }

    async shutdown() {
        if (!this.proc) {
            return;
        }
        const child = this.proc;
        this.status = 'closing';
        try {
            child.stdin.end();
        } catch {}
        try {
            child.kill();
        } catch {}
        this.proc = null;
        this.initialized = false;
    }
}

class McpHttpSession {
    constructor({ name, config, workspaceRoot, projectRoot, emitGatewayEvent }) {
        this.name = name;
        this.config = config || {};
        this.workspaceRoot = workspaceRoot;
        this.projectRoot = projectRoot;
        this.emitGatewayEvent = typeof emitGatewayEvent === 'function' ? emitGatewayEvent : () => {};
        this.requestSeq = 0;
        this.initialized = false;
        this.status = 'configured';
        this.startedAt = 0;
        this.lastUsedAt = 0;
        this.exitCode = null;
        this.lastError = '';
        this.stderrTail = [];
        this.sessionId = '';
        this.serverInfo = null;
        this.fingerprint = configFingerprint(config);
    }

    resolveUrl() {
        const url = normalizeString(this.config.url);
        if (!url) {
            throw new Error(`MCP HTTP server ${this.name} is missing url`);
        }
        return url;
    }

    buildHeaders() {
        const headers = {
            'Accept': 'application/json, text/event-stream',
            'Content-Type': 'application/json',
            'MCP-Protocol-Version': normalizeString(this.config.protocolVersion, DEFAULT_MCP_PROTOCOL_VERSION),
            ...Object.fromEntries(
                Object.entries(normalizeObject(this.config.headers)).map(([key, value]) => [key, String(value)])
            )
        };
        const bearerTokenEnvVar = normalizeString(this.config.bearerTokenEnvVar || this.config.bearer_token_env_var);
        const bearerToken = bearerTokenEnvVar ? normalizeString(process.env[bearerTokenEnvVar]) : '';
        if (bearerToken && !headers.Authorization && !headers.authorization) {
            headers.Authorization = `Bearer ${bearerToken}`;
        }
        if (this.sessionId) {
            headers['Mcp-Session-Id'] = this.sessionId;
        }
        return headers;
    }

    async ensureStarted() {
        if (this.initialized) {
            return this;
        }
        await this.start();
        return this;
    }

    async start() {
        const url = this.resolveUrl();
        this.status = 'starting';
        this.startedAt = Date.now();
        this.lastError = '';
        this.emitGatewayEvent('mcp.server.starting', {
            server: this.name,
            transport: normalizeString(this.config.transport || this.config.type, 'http'),
            url
        });
        const init = await this.sendRequest(
            'initialize',
            {
                protocolVersion: normalizeString(this.config.protocolVersion, DEFAULT_MCP_PROTOCOL_VERSION),
                capabilities: {},
                clientInfo: {
                    name: 'AILIS',
                    version: '1.0.1'
                }
            },
            Number(this.config.timeoutMs || this.config.startupTimeoutMs || DEFAULT_MCP_TIMEOUT_MS)
        );
        await this.sendNotification('notifications/initialized', {});
        this.initialized = true;
        this.status = 'running';
        this.serverInfo = init?.serverInfo || null;
        this.emitGatewayEvent('mcp.server.started', {
            server: this.name,
            transport: 'http',
            protocolVersion: init?.protocolVersion || DEFAULT_MCP_PROTOCOL_VERSION,
            serverInfo: this.serverInfo
        });
        return init;
    }

    async request(method, params = {}, timeoutMs = DEFAULT_MCP_TIMEOUT_MS) {
        await this.ensureStarted();
        return await this.sendRequest(method, params, timeoutMs);
    }

    async sendRequest(method, params = {}, timeoutMs = DEFAULT_MCP_TIMEOUT_MS) {
        const id = String(++this.requestSeq);
        const message = {
            jsonrpc: '2.0',
            id,
            method,
            params
        };
        return await this.postJsonRpc(message, timeoutMs);
    }

    async sendNotification(method, params = {}) {
        await this.postJsonRpc(
            {
                jsonrpc: '2.0',
                method,
                params
            },
            Number(this.config.timeoutMs || DEFAULT_MCP_TIMEOUT_MS),
            { notification: true }
        ).catch((error) => {
            this.emitGatewayEvent('mcp.server.notification_error', {
                server: this.name,
                method,
                error: error?.message || String(error)
            });
        });
    }

    async postJsonRpc(message, timeoutMs = DEFAULT_MCP_TIMEOUT_MS, { notification = false } = {}) {
        const boundedTimeout = Math.max(1000, Math.min(Number(timeoutMs) || DEFAULT_MCP_TIMEOUT_MS, 180000));
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), boundedTimeout);
        this.lastUsedAt = Date.now();
        try {
            const response = await fetch(this.resolveUrl(), {
                method: 'POST',
                headers: this.buildHeaders(),
                body: JSON.stringify(message),
                signal: controller.signal
            });
            const sessionId = response.headers.get('mcp-session-id') || response.headers.get('Mcp-Session-Id');
            if (sessionId) {
                this.sessionId = sessionId;
            }
            const text = await response.text().catch(() => '');
            if (notification && (response.status === 202 || !text.trim())) {
                return null;
            }
            if (!response.ok) {
                const error = new Error(`MCP HTTP ${this.name}.${message.method} failed with status ${response.status}`);
                error.details = {
                    status: response.status,
                    body: text.slice(0, 2000)
                };
                throw error;
            }
            const parsed = parseHttpJsonRpcResponse(text, response.headers.get('content-type') || '');
            if (!parsed) {
                if (notification) {
                    return null;
                }
                throw new Error(`MCP HTTP ${this.name}.${message.method} returned empty response`);
            }
            if (parsed.error) {
                const error = new Error(parsed.error.message || 'MCP request failed');
                error.details = parsed.error;
                throw error;
            }
            return parsed.result;
        } catch (error) {
            this.status = this.initialized ? 'running' : 'error';
            this.lastError = error?.name === 'AbortError'
                ? `MCP ${this.name}.${message.method} timed out after ${boundedTimeout}ms`
                : error?.message || String(error);
            throw new Error(this.lastError);
        } finally {
            clearTimeout(timer);
        }
    }

    async shutdown() {
        this.status = 'closed';
        this.initialized = false;
    }
}

class AILISMcpManager {
    constructor({ workspaceRoot, projectRoot, emitGatewayEvent, builtinServers, defaultServers, configPath } = {}) {
        this.workspaceRoot = workspaceRoot;
        this.projectRoot = projectRoot;
        this.emitGatewayEvent = typeof emitGatewayEvent === 'function' ? emitGatewayEvent : () => {};
        this.serverConfigs = new Map();
        this.sessions = new Map();
        this.toolSchemaCache = new Map();
        this.configPath = normalizeString(configPath || process.env.AILIS_MCP_CONFIG_PATH);
        this.configStoreStatus = this.configPath ? 'not_loaded' : 'disabled';
        this.configStoreError = '';
        this.registerServers(builtinServers);
        this.loadConfigFile();
        this.registerServers(process.env.AILIS_MCP_SERVERS_JSON || process.env.AILIS_MCP_SERVERS);
        this.registerServers(defaultServers);
    }

    loadConfigFile() {
        if (!this.configPath) {
            return;
        }
        this.configStoreStatus = 'missing';
        try {
            if (!fs.existsSync(this.configPath)) {
                return;
            }
            const raw = fs.readFileSync(this.configPath, 'utf8');
            const state = JSON.parse(raw || '{}');
            this.registerServers(state.servers || state.mcpServers || state, { persist: false });
            this.configStoreStatus = 'loaded';
            this.configStoreError = '';
        } catch (error) {
            this.configStoreStatus = 'load_error';
            this.configStoreError = error?.message || String(error);
            this.emitGatewayEvent('mcp.config.error', {
                action: 'load',
                path: this.configPath,
                error: this.configStoreError
            });
        }
    }

    saveConfigFile(reason = 'update') {
        if (!this.configPath) {
            return {
                ok: false,
                status: 'config_store_disabled'
            };
        }
        try {
            fs.mkdirSync(path.dirname(this.configPath), { recursive: true });
            const servers = {};
            for (const [name, config] of this.serverConfigs.entries()) {
                servers[name] = sanitizeServerConfig(config);
            }
            const state = {
                version: 1,
                reason,
                updatedAt: Date.now(),
                updatedAtIso: new Date().toISOString(),
                servers
            };
            const tmpPath = `${this.configPath}.${process.pid}.${Date.now()}.tmp`;
            fs.writeFileSync(tmpPath, `${JSON.stringify(state, null, 2)}\n`, 'utf8');
            fs.renameSync(tmpPath, this.configPath);
            this.configStoreStatus = 'saved';
            this.configStoreError = '';
            this.emitGatewayEvent('mcp.config.saved', {
                path: this.configPath,
                serverCount: this.serverConfigs.size,
                reason
            });
            return {
                ok: true,
                status: 'saved',
                path: this.configPath
            };
        } catch (error) {
            this.configStoreStatus = 'save_error';
            this.configStoreError = error?.message || String(error);
            this.emitGatewayEvent('mcp.config.error', {
                action: 'save',
                path: this.configPath,
                error: this.configStoreError
            });
            return {
                ok: false,
                status: 'save_error',
                error: this.configStoreError
            };
        }
    }

    registerServers(raw, options = {}) {
        const entries = normalizeMcpServerEntries(raw);
        for (const { name, config } of entries) {
            if (config.disabled === true) {
                continue;
            }
            this.serverConfigs.set(name, {
                ...config,
                name
            });
            this.toolSchemaCache.delete(name);
        }
        if (entries.length && options.persist === true) {
            this.saveConfigFile('register_servers');
        }
        return entries.map((entry) => entry.name);
    }

    removeServer(serverName, options = {}) {
        const name = normalizeString(serverName);
        if (!name) {
            return false;
        }
        const removed = this.serverConfigs.delete(name);
        this.toolSchemaCache.delete(name);
        const session = this.sessions.get(name);
        if (session) {
            session.shutdown().catch(() => {});
            this.sessions.delete(name);
        }
        if (removed && options.persist === true) {
            this.saveConfigFile('remove_server');
        }
        return removed;
    }

    registerRuntimeConfigs(args = {}, context = {}) {
        this.registerServers(context.mcpServers || context.mcp || context.mcpServerConfigs);
        this.registerServers(args.servers || args.mcpServers || args.mcp || args.serverConfigs);
    }

    getStatus() {
        return {
            serverCount: this.serverConfigs.size,
            activeSessionCount: this.sessions.size,
            configPath: this.configPath || '',
            configStoreStatus: this.configStoreStatus,
            configStoreError: this.configStoreError,
            servers: [...this.serverConfigs.entries()].map(([name, config]) =>
                publicServerConfig(name, config, this.sessions.get(name))
            )
        };
    }

    listServers() {
        return [...this.serverConfigs.entries()].map(([name, config]) =>
            publicServerConfig(name, config, this.sessions.get(name))
        );
    }

    resolveServerName(value) {
        const server = normalizeString(value);
        if (server) {
            return server;
        }
        if (this.serverConfigs.size === 1) {
            return [...this.serverConfigs.keys()][0];
        }
        return '';
    }

    async getSession(serverName) {
        const name = this.resolveServerName(serverName);
        if (!name) {
            throw new Error('mcp_bridge requires server when multiple MCP servers are configured');
        }
        const config = this.serverConfigs.get(name);
        if (!config) {
            throw new Error(`MCP server is not configured: ${name}`);
        }
        const fingerprint = configFingerprint(config);
        let session = this.sessions.get(name);
        if (session && session.fingerprint !== fingerprint) {
            await session.shutdown().catch(() => {});
            this.sessions.delete(name);
            session = null;
        }
        if (!session) {
            const transport = normalizeString(config.transport || config.type, config.url ? 'http' : 'stdio');
            const SessionClass = transport === 'stdio' ? McpStdioSession : McpHttpSession;
            session = new SessionClass({
                name,
                config,
                workspaceRoot: this.workspaceRoot,
                projectRoot: this.projectRoot,
                emitGatewayEvent: this.emitGatewayEvent
            });
            this.sessions.set(name, session);
        }
        await session.ensureStarted();
        return session;
    }

    async listTools(serverName = '', timeoutMs = DEFAULT_MCP_TIMEOUT_MS) {
        const names = serverName ? [serverName] : [...this.serverConfigs.keys()];
        const results = [];
        for (const name of names) {
            const session = await this.getSession(name);
            const result = await session.request('tools/list', {}, timeoutMs);
            const tools = Array.isArray(result?.tools) ? result.tools : [];
            this.cacheToolSchemas(name, tools);
            results.push({
                server: name,
                tools
            });
        }
        return results;
    }

    async listToolSpecs(serverName = '', timeoutMs = DEFAULT_MCP_TIMEOUT_MS) {
        const grouped = await this.listTools(serverName, timeoutMs);
        return grouped.flatMap((entry) =>
            (Array.isArray(entry.tools) ? entry.tools : [])
                .map((tool) => makeMcpToolSpec(entry.server, tool))
                .filter((spec) => spec.server && spec.tool)
        );
    }

    async searchToolSpecs({ query = '', server = '', limit = 8, timeoutMs = DEFAULT_MCP_TIMEOUT_MS } = {}) {
        const specs = await this.listToolSpecs(server, timeoutMs);
        const needle = normalizeString(query).toLowerCase();
        const boundedLimit = Math.max(1, Math.min(Number(limit) || 8, 50));
        if (!needle) {
            return rankToolSearchResults(specs, 'specific document pdf media file api tool', boundedLimit);
        }
        return rankToolSearchResults(specs, query, boundedLimit);
    }

    cacheToolSchemas(serverName, tools = []) {
        const name = normalizeString(serverName);
        if (!name) {
            return;
        }
        const cache = new Map();
        for (const tool of Array.isArray(tools) ? tools : []) {
            const toolName = normalizeString(tool?.name || tool?.id);
            if (toolName) {
                cache.set(toolName, tool?.inputSchema || tool?.input_schema || {});
            }
        }
        this.toolSchemaCache.set(name, cache);
    }

    async getToolInputSchema(serverName, toolName, timeoutMs = DEFAULT_MCP_TIMEOUT_MS) {
        const server = this.resolveServerName(serverName);
        const tool = normalizeString(toolName);
        if (!server || !tool) {
            return null;
        }
        let cache = this.toolSchemaCache.get(server);
        if (!cache || !cache.has(tool)) {
            await this.listTools(server, timeoutMs).catch(() => []);
            cache = this.toolSchemaCache.get(server);
        }
        return cache?.get(tool) || null;
    }

    async listResources(serverName = '', timeoutMs = DEFAULT_MCP_TIMEOUT_MS) {
        const names = serverName ? [serverName] : [...this.serverConfigs.keys()];
        const results = [];
        for (const name of names) {
            const session = await this.getSession(name);
            const resourcesResult = await session.request('resources/list', {}, timeoutMs).catch((error) => ({
                resources: [],
                error: error.message || String(error)
            }));
            const templatesResult = await session.request('resources/templates/list', {}, timeoutMs).catch(() => ({
                resourceTemplates: []
            }));
            results.push({
                server: name,
                resources: Array.isArray(resourcesResult?.resources) ? resourcesResult.resources : [],
                resourceTemplates: Array.isArray(templatesResult?.resourceTemplates)
                    ? templatesResult.resourceTemplates
                    : [],
                error: resourcesResult?.error || ''
            });
        }
        return results;
    }

    async readResource({ server, uri, timeoutMs }) {
        const session = await this.getSession(server);
        return await session.request('resources/read', { uri }, timeoutMs || DEFAULT_MCP_TIMEOUT_MS);
    }

    async listPrompts(serverName = '', timeoutMs = DEFAULT_MCP_TIMEOUT_MS) {
        const names = serverName ? [serverName] : [...this.serverConfigs.keys()];
        const results = [];
        for (const name of names) {
            const session = await this.getSession(name);
            const result = await session.request('prompts/list', {}, timeoutMs).catch((error) => ({
                prompts: [],
                error: error.message || String(error)
            }));
            results.push({
                server: name,
                prompts: Array.isArray(result?.prompts) ? result.prompts : [],
                error: result?.error || ''
            });
        }
        return results;
    }

    async getPrompt({ server, prompt, args, timeoutMs }) {
        const session = await this.getSession(server);
        return await session.request(
            'prompts/get',
            {
                name: prompt,
                arguments: args || {}
            },
            timeoutMs || DEFAULT_MCP_TIMEOUT_MS
        );
    }

    async healthCheck(serverName = '', timeoutMs = 5000) {
        const names = serverName ? [serverName] : [...this.serverConfigs.keys()];
        const results = [];
        for (const name of names) {
            const startedAt = Date.now();
            try {
                const session = await this.getSession(name);
                const tools = await session.request('tools/list', {}, timeoutMs).catch((error) => ({
                    tools: [],
                    error: error.message || String(error)
                }));
                results.push({
                    server: name,
                    ok: !tools?.error,
                    status: tools?.error ? 'degraded' : 'healthy',
                    latencyMs: Date.now() - startedAt,
                    transport: normalizeString(session.config.transport || session.config.type, session.config.url ? 'http' : 'stdio'),
                    toolCount: Array.isArray(tools?.tools) ? tools.tools.length : 0,
                    error: tools?.error || ''
                });
            } catch (error) {
                results.push({
                    server: name,
                    ok: false,
                    status: 'error',
                    latencyMs: Date.now() - startedAt,
                    error: error?.message || String(error)
                });
            }
        }
        return results;
    }

    async callTool({ server, tool, args, meta, timeoutMs }) {
        const session = await this.getSession(server);
        const inputSchema = await this.getToolInputSchema(server, tool, timeoutMs || DEFAULT_MCP_TIMEOUT_MS);
        if (inputSchema && Object.keys(inputSchema).length) {
            const errors = validateAgainstSchema(args || {}, inputSchema);
            if (errors.length) {
                const error = new Error(`MCP tool arguments failed inputSchema validation: ${errors.join('; ')}`);
                error.details = {
                    status: 'invalid_mcp_tool_args',
                    server,
                    tool,
                    errors,
                    inputSchema
                };
                throw error;
            }
        }
        const params = {
            name: tool,
            arguments: args || {}
        };
        if (meta !== undefined) {
            params._meta = meta;
        }
        return await session.request('tools/call', params, timeoutMs || DEFAULT_MCP_TIMEOUT_MS);
    }

    async shutdown(serverName = '') {
        const names = serverName ? [serverName] : [...this.sessions.keys()];
        for (const name of names) {
            const session = this.sessions.get(name);
            if (session) {
                await session.shutdown().catch(() => {});
                this.sessions.delete(name);
            }
        }
    }
}

module.exports = {
    AILISMcpManager,
    normalizeMcpServerEntries
};
