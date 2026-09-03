'use strict';

const path = require('node:path');
const { fork } = require('node:child_process');
const { randomUUID } = require('node:crypto');

const {
    DEFAULT_EXEC_YIELD_TIME_MS,
    DEFAULT_MAX_OUTPUT_TOKENS_PER_EXEC_CALL,
    DEFAULT_WAIT_YIELD_TIME_MS,
    getCodeModeProfile,
    normalizeCodeModeIdentifier,
    parseExecSource
} = require('./codex-code-mode-protocol.cjs');

const MAX_LIVE_CELLS = 16;
const MAX_CELL_LIFETIME_MS = 30 * 60 * 1000;

function normalizeString(value, fallback = '') {
    const text = typeof value === 'string' ? value.trim() : '';
    return text || fallback;
}

function cloneJson(value) {
    try {
        return JSON.parse(JSON.stringify(value));
    } catch {
        return null;
    }
}

function sessionKeyOf(context = {}) {
    return normalizeString(context.sessionId || context.sessionKey || context.runId, 'main');
}

function toolDefinitions(specs = []) {
    return (Array.isArray(specs) ? specs : [])
        .map((spec) => {
            const name = normalizeString(spec?.name || spec?.function?.name);
            if (!name || ['exec', 'exec_wait'].includes(name)) return null;
            return {
                name,
                globalName: normalizeCodeModeIdentifier(name),
                dispatchName: normalizeString(spec.x_ailis_dispatch_tool, name),
                description: normalizeString(spec.description || spec.function?.description || name),
                kind: spec.type === 'custom' || spec.type === 'freeform' || name === 'apply_patch'
                    ? 'freeform'
                    : 'function'
            };
        })
        .filter(Boolean);
}

function outputText(item = {}) {
    if (item.kind === 'text') return String(item.value ?? '');
    if (item.kind === 'image') return `[image output: ${typeof item.value === 'string' ? item.value.slice(0, 120) : 'content'}]`;
    if (item.kind === 'audio') return '[audio output]';
    if (item.kind === 'generated_image') return '[generated image output]';
    return String(item.value ?? '');
}

function truncateText(text = '', maxTokens = DEFAULT_MAX_OUTPUT_TOKENS_PER_EXEC_CALL) {
    const tokenLimit = Math.max(1, Number.isFinite(Number(maxTokens)) ? Math.trunc(Number(maxTokens)) : DEFAULT_MAX_OUTPUT_TOKENS_PER_EXEC_CALL);
    const charLimit = tokenLimit * 4;
    const value = String(text || '');
    if (value.length <= charLimit) return value;
    const edge = Math.max(1, Math.floor((charLimit - 120) / 2));
    return `Warning: truncated output (approximate token limit: ${tokenLimit})\n\n${value.slice(0, edge)}…output truncated…${value.slice(-edge)}`;
}

function unwrapGatewayToolEnvelope(value) {
    if (
        value &&
        typeof value === 'object' &&
        !Array.isArray(value) &&
        Object.prototype.hasOwnProperty.call(value, 'result') &&
        ('callId' in value || 'durationMs' in value || 'tool' in value)
    ) {
        return { envelope: value, result: value.result };
    }
    return { envelope: null, result: value };
}

function textFromToolResult(value) {
    if (typeof value === 'string') return value;
    if (!value || typeof value !== 'object') return value == null ? '' : String(value);
    const blocks = Array.isArray(value.content) ? value.content : [];
    const text = blocks
        .filter((item) => item && item.type === 'text' && typeof item.text === 'string')
        .map((item) => item.text)
        .join('\n');
    return text || '';
}

function compactUnifiedExecResult(value, { envelope = null, mapSessionId = null } = {}) {
    const details = value?.details && typeof value.details === 'object'
        ? value.details
        : value?.structuredContent && typeof value.structuredContent === 'object'
            ? value.structuredContent
            : value && typeof value === 'object'
                ? value
                : {};
    const output = typeof details.output === 'string'
        ? details.output
        : textFromToolResult(value);
    const compact = {
        wall_time_seconds: Number.isFinite(Number(details.wall_time_seconds))
            ? Number(details.wall_time_seconds)
            : Math.max(0, Number(envelope?.durationMs) || 0) / 1000,
        output
    };
    if (typeof details.chunk_id === 'string' && details.chunk_id) compact.chunk_id = details.chunk_id;
    if (Number.isFinite(Number(details.exit_code)) && details.exit_code !== null) {
        compact.exit_code = Number(details.exit_code);
    }
    if (Number.isFinite(Number(details.original_token_count))) {
        compact.original_token_count = Number(details.original_token_count);
    }
    const internalSessionId = details.session_id ?? details.sessionId;
    if (internalSessionId !== undefined && internalSessionId !== null && internalSessionId !== '') {
        const externalSessionId = typeof mapSessionId === 'function'
            ? mapSessionId(String(internalSessionId))
            : Number(internalSessionId);
        if (Number.isFinite(externalSessionId)) compact.session_id = Number(externalSessionId);
    }
    return compact;
}

class AILISCodeModeRuntime {
    constructor({ dispatchTool }) {
        this.dispatchTool = dispatchTool;
        this.cells = new Map();
        this.stores = new Map();
        this.unifiedExecSessions = new Map();
    }

    sessionStore(context = {}) {
        const key = sessionKeyOf(context);
        if (!this.stores.has(key)) this.stores.set(key, {});
        return this.stores.get(key);
    }

    unifiedExecSessionStore(context = {}) {
        const key = sessionKeyOf(context);
        if (!this.unifiedExecSessions.has(key)) {
            this.unifiedExecSessions.set(key, {
                nextId: 1,
                externalToInternal: new Map(),
                internalToExternal: new Map()
            });
        }
        return this.unifiedExecSessions.get(key);
    }

    exposeUnifiedExecSession(context = {}, internalSessionId = '') {
        const internal = String(internalSessionId || '');
        if (!internal) return null;
        const store = this.unifiedExecSessionStore(context);
        if (store.internalToExternal.has(internal)) return store.internalToExternal.get(internal);
        const external = store.nextId++;
        store.internalToExternal.set(internal, external);
        store.externalToInternal.set(external, internal);
        return external;
    }

    resolveUnifiedExecSession(context = {}, externalSessionId) {
        const external = Number(externalSessionId);
        if (!Number.isSafeInteger(external) || external <= 0) {
            throw new Error('write_stdin requires the numeric session_id returned by exec_command');
        }
        const internal = this.unifiedExecSessionStore(context).externalToInternal.get(external);
        if (!internal) throw new Error(`No running unified exec session found for session_id ${external}`);
        return internal;
    }

    projectNestedToolResult(toolName = '', value, context = {}) {
        const { envelope, result } = unwrapGatewayToolEnvelope(value);
        if (envelope?.ok === false && !result) {
            throw new Error(normalizeString(envelope.error, `${toolName} failed`));
        }
        if (toolName === 'exec_command' || toolName === 'write_stdin') {
            const details = result?.details && typeof result.details === 'object' ? result.details : {};
            const hasExecShape = 'output' in details || 'exit_code' in details || 'session_id' in details || 'sessionId' in details;
            if (envelope?.ok === false && !hasExecShape) {
                throw new Error(normalizeString(
                    envelope.error || textFromToolResult(result),
                    `${toolName} failed`
                ));
            }
            return compactUnifiedExecResult(result, {
                envelope,
                mapSessionId: (internalSessionId) => this.exposeUnifiedExecSession(context, internalSessionId)
            });
        }
        if (envelope?.ok === false || result?.isError === true) {
            throw new Error(normalizeString(
                envelope?.error || textFromToolResult(result),
                `${toolName} failed`
            ));
        }
        if (toolName === 'apply_patch') return textFromToolResult(result) || result?.structuredContent || result?.details || result;
        if (toolName === 'update_plan') return result?.structuredContent || result?.details || textFromToolResult(result) || result;
        return result;
    }

    reapExpiredCells() {
        const now = Date.now();
        for (const [cellId, cell] of this.cells) {
            if (now - cell.createdAt > MAX_CELL_LIFETIME_MS) {
                cell.child.kill();
                this.cells.delete(cellId);
            }
        }
    }

    spawnCell({ code, profileId, context = {}, maxOutputTokens }) {
        this.reapExpiredCells();
        if (this.cells.size >= MAX_LIVE_CELLS) throw new Error(`exec live-cell limit reached (${MAX_LIVE_CELLS})`);
        const specs = getCodeModeProfile(profileId);
        if (!specs.length) throw new Error('exec nested-tool profile is missing or expired');
        const definitions = toolDefinitions(specs);
        const allowed = new Map(definitions.map((tool) => [tool.name, tool]));
        const workerPath = path.join(__dirname, 'ailis-code-mode-worker.cjs');
        const child = fork(workerPath, [], {
            cwd: __dirname,
            execArgv: [
                '--permission',
                '--experimental-vm-modules',
                `--allow-fs-read=${workerPath}`
            ],
            stdio: ['ignore', 'ignore', 'pipe', 'ipc'],
            windowsHide: true
        });
        const cellId = `cell-${randomUUID()}`;
        const cell = {
            id: cellId,
            child,
            context: cloneJson(context) || {},
            allowed,
            createdAt: Date.now(),
            outputs: [],
            delivered: 0,
            completed: false,
            terminated: false,
            error: '',
            stderr: '',
            listeners: new Set(),
            maxOutputTokens
        };
        this.cells.set(cellId, cell);
        child.stderr?.setEncoding('utf8');
        child.stderr?.on('data', (chunk) => { cell.stderr = `${cell.stderr}${chunk}`.slice(-8000); });
        child.on('message', (message) => void this.handleWorkerMessage(cell, message));
        child.on('error', (error) => {
            cell.completed = true;
            cell.error = error?.message || String(error);
            this.signal(cell, 'complete');
        });
        child.on('exit', (codeValue, signal) => {
            if (!cell.completed && !cell.terminated) {
                cell.completed = true;
                cell.error = cell.stderr || `exec isolate exited unexpectedly (code ${codeValue ?? 'unknown'}, signal ${signal || 'none'})`;
            }
            this.signal(cell, 'complete');
        });
        child.send({
            type: 'start',
            source: code,
            tools: definitions,
            store: cloneJson(this.sessionStore(context)) || {}
        });
        return cell;
    }

    async handleWorkerMessage(cell, message = {}) {
        if (!message || typeof message !== 'object') return;
        if (message.type === 'output' && message.item) {
            cell.outputs.push(cloneJson(message.item) || message.item);
            return;
        }
        if (message.type === 'store') {
            this.sessionStore(cell.context)[String(message.key)] = cloneJson(message.value);
            return;
        }
        if (message.type === 'yield') {
            this.signal(cell, 'yield');
            return;
        }
        if (message.type === 'complete' || message.type === 'terminated') {
            cell.completed = message.type === 'complete';
            cell.terminated = message.type === 'terminated';
            cell.error = normalizeString(message.error);
            this.signal(cell, message.type);
            return;
        }
        if (message.type === 'async_error') {
            cell.completed = true;
            cell.error = normalizeString(message.error, 'exec asynchronous callback failed');
            cell.child.kill();
            this.signal(cell, 'complete');
            return;
        }
        if (message.type !== 'tool_call') return;
        const definition = cell.allowed.get(normalizeString(message.name));
        if (!definition) {
            cell.child.send({ type: 'tool_result', id: message.id, error: `tool \`${message.name || ''}\` is not enabled for this exec cell` });
            return;
        }
        try {
            const args = definition.kind === 'freeform'
                ? { input: typeof message.input === 'string' ? message.input : '' }
                : message.input && typeof message.input === 'object' && !Array.isArray(message.input)
                    ? message.input
                    : {};
            const dispatchArgs = { ...args };
            if (definition.name === 'write_stdin') {
                dispatchArgs.session_id = this.resolveUnifiedExecSession(cell.context, args.session_id);
            }
            const result = await this.dispatchTool({
                tool: definition.dispatchName,
                args: dispatchArgs,
                context: {
                    ...cell.context,
                    codeModeCellId: cell.id,
                    codeModeNested: true
                }
            });
            const projected = this.projectNestedToolResult(definition.name, result, cell.context);
            cell.child.send({ type: 'tool_result', id: message.id, result: cloneJson(projected) || projected });
        } catch (error) {
            cell.child.send({ type: 'tool_result', id: message.id, error: error?.message || String(error) });
        }
    }

    signal(cell, reason) {
        for (const listener of [...cell.listeners]) listener(reason);
    }

    waitForSignal(cell, yieldTimeMs) {
        if (cell.completed || cell.terminated) return Promise.resolve('complete');
        return new Promise((resolve) => {
            const finish = (reason) => {
                clearTimeout(timer);
                cell.listeners.delete(finish);
                resolve(reason);
            };
            const timer = setTimeout(() => finish('timeout'), Math.max(0, Number(yieldTimeMs) || 0));
            timer.unref?.();
            cell.listeners.add(finish);
        });
    }

    formatResponse(cell, { maxTokens, wallTimeMs, closeCompleted = true } = {}) {
        const fresh = cell.outputs.slice(cell.delivered);
        cell.delivered = cell.outputs.length;
        const body = fresh.map(outputText).filter(Boolean).join('\n');
        const status = cell.terminated
            ? 'Script terminated'
            : cell.completed
                ? cell.error ? 'Script failed' : 'Script completed'
                : `Script running with cell ID ${cell.id}`;
        const errorText = cell.error ? `${body ? `${body}\n` : ''}Script error:\n${cell.error}` : body;
        const output = truncateText(`${status}\nWall time ${(Math.max(0, wallTimeMs) / 1000).toFixed(1)} seconds\nOutput:\n${errorText}`, maxTokens ?? cell.maxOutputTokens);
        if (closeCompleted && (cell.completed || cell.terminated)) {
            this.cells.delete(cell.id);
            if (cell.child.connected) cell.child.disconnect();
        }
        return {
            ok: !cell.error,
            status: cell.error ? 'failed' : cell.terminated ? 'terminated' : cell.completed ? 'completed' : 'running',
            text: output,
            details: {
                cell_id: cell.id,
                running: !cell.completed && !cell.terminated,
                completed: cell.completed,
                terminated: cell.terminated
            }
        };
    }

    async execute({ input = '', profileId = '', context = {} } = {}) {
        const parsed = parseExecSource(input);
        const startedAt = Date.now();
        const yieldTimeMs = parsed.yield_time_ms ?? DEFAULT_EXEC_YIELD_TIME_MS;
        const maxOutputTokens = parsed.max_output_tokens ?? DEFAULT_MAX_OUTPUT_TOKENS_PER_EXEC_CALL;
        const cell = this.spawnCell({ code: parsed.code, profileId, context, maxOutputTokens });
        await this.waitForSignal(cell, yieldTimeMs);
        return this.formatResponse(cell, { maxTokens: maxOutputTokens, wallTimeMs: Date.now() - startedAt });
    }

    async wait({ cell_id: cellId = '', yield_time_ms: yieldTimeMs = DEFAULT_WAIT_YIELD_TIME_MS, max_tokens: maxTokens = DEFAULT_MAX_OUTPUT_TOKENS_PER_EXEC_CALL, terminate = false } = {}) {
        const startedAt = Date.now();
        const cell = this.cells.get(normalizeString(cellId));
        if (!cell) {
            return {
                ok: false,
                status: 'missing_cell',
                text: `Script failed\nWall time 0.0 seconds\nOutput:\nScript error:\nNo running exec cell found for ${normalizeString(cellId, '<empty>')}`,
                details: { cell_id: normalizeString(cellId), running: false }
            };
        }
        if (terminate && !cell.completed && !cell.terminated) {
            cell.terminated = true;
            cell.child.send({ type: 'terminate' });
            setTimeout(() => cell.child.kill(), 250).unref?.();
        } else if (!cell.completed && !cell.terminated) {
            await this.waitForSignal(cell, Math.max(0, Number(yieldTimeMs) || DEFAULT_WAIT_YIELD_TIME_MS));
        }
        return this.formatResponse(cell, { maxTokens, wallTimeMs: Date.now() - startedAt });
    }
}

module.exports = {
    AILISCodeModeRuntime,
    compactUnifiedExecResult,
    textFromToolResult,
    toolDefinitions,
    truncateText,
    unwrapGatewayToolEnvelope
};
