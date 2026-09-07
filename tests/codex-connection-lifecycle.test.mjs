import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import http from 'node:http';
import net from 'node:net';
import tls from 'node:tls';
import os from 'node:os';
import path from 'node:path';
import { EventEmitter } from 'node:events';
import Module, { createRequire } from 'node:module';
import { test } from 'node:test';

const require = createRequire(import.meta.url);
const { runCodexResponsesInference } = require('../electron/codex-model-bridge.cjs');

// All connections are simulated. No credentials, network, model calls or evals.
function connectionFixture(t, mode = 'tls-stall') {
    const sockets = [];
    const requests = [];
    const socket = () => {
        const value = new EventEmitter();
        value.destroyed = false;
        value.unshift = () => {};
        value.destroy = () => {
            if (!value.destroyed) {
                value.destroyed = true;
                queueMicrotask(() => value.emit('close'));
            }
        };
        sockets.push(value);
        return value;
    };
    t.mock.method(http, 'request', () => {
        const request = socket();
        requests.push(request);
        request.setTimeout = () => request;
        request.end = () => queueMicrotask(() => {
            const raw = socket();
            request.emit('socket', raw);
            raw.emit('connect');
            if (mode !== 'connect-stall') {
                request.emit('connect', { statusCode: mode === 'proxy-reject' ? 407 : 200 }, raw, Buffer.alloc(0));
            }
        });
        return request;
    });
    t.mock.method(tls, 'connect', ({ socket: raw }) => {
        const secure = socket();
        const destroy = secure.destroy;
        secure.destroy = () => { destroy(); raw.destroy(); };
        if (mode === 'tls-close') queueMicrotask(() => secure.emit('close'));
        if (mode === 'tls-success') queueMicrotask(() => secure.emit('secureConnect'));
        return secure;
    });
    return { sockets, requests };
}

async function auditFixture(t) {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-connection-test-'));
    t.after(() => fs.rm(dir, { recursive: true, force: true }));
    const file = path.join(dir, 'audit.jsonl');
    return { file, read: async () => (await fs.readFile(file, 'utf8')).trim().split('\n').map(JSON.parse) };
}

for (const mode of ['connect-stall', 'tls-stall']) {
    test(`${mode}: connection deadline cancels every socket before the model deadline`, async (t) => {
        const fixture = connectionFixture(t, mode);
        const audit = await auditFixture(t);
        let posts = 0;
        const result = await runCodexResponsesInference({
            proxyUrl: 'http://proxy-user:proxy-secret@127.0.0.1:17890',
            codexConnectTimeoutMs: 25
        }, { accessToken: 'credential-secret' }, { input: ['private-prompt'] }, {
            timeoutMs: 1000,
            protocolAuditPath: audit.file,
            requestImpl() { posts++; throw new Error('Must not send a POST'); }
        });
        assert.equal(result.code, 'timeout');
        assert.match(result.error, /25ms/);
        assert.equal(result.transportPhase, mode === 'tls-stall' ? 'tls_handshake' : 'proxy_connect');
        assert.equal(posts, 0);
        assert.ok(fixture.sockets.length >= 2);
        assert.ok(fixture.sockets.every(s => s.destroyed), 'including CONNECT request, raw and TLS sockets');
        const records = await audit.read();
        const stages = records.filter(r => r.event === 'transport');
        assert.ok(stages.some(r => r.stage === 'attempt_started'));
        assert.ok(stages.some(r => r.stage === 'attempt_finished' && r.code === 'timeout' && r.requestSent === false));
        assert.equal(new Set(stages.map(r => r.requestId)).size, 1);
        assert.equal(records.some(r => r.event === 'request'), false);
        assert.doesNotMatch(JSON.stringify(records), /proxy-secret|credential-secret|private-prompt|proxy-user/);
    });
}

test('abort during TLS destroys the pending CONNECT and TLS sockets', async (t) => {
    const fixture = connectionFixture(t);
    const controller = new AbortController();
    const pending = runCodexResponsesInference({ proxyUrl: 'http://127.0.0.1:17890' }, {}, {}, {
        signal: controller.signal, timeoutMs: 1000,
        requestImpl() { throw new Error('Must not send a POST'); }
    });
    await new Promise(resolve => setImmediate(resolve));
    controller.abort();
    assert.equal((await pending).code, 'aborted');
    assert.ok(fixture.sockets.every(s => s.destroyed));
});

test('already aborted requests do not open a proxy connection', async (t) => {
    const fixture = connectionFixture(t);
    const controller = new AbortController();
    controller.abort();
    const result = await runCodexResponsesInference({ proxyUrl: 'http://127.0.0.1:17890' }, {}, {}, {
        signal: controller.signal, timeoutMs: 1000
    });
    assert.equal(result.code, 'aborted');
    assert.equal(fixture.requests.length, 0);
});

test('TLS close without an error fails immediately instead of waiting for the deadline', async (t) => {
    const fixture = connectionFixture(t, 'tls-close');
    const result = await runCodexResponsesInference({ proxyUrl: 'http://127.0.0.1:17890' }, {}, {}, { timeoutMs: 1000 });
    assert.equal(result.code, 'codex_network_error');
    assert.equal(result.transportPhase, 'tls_handshake');
    assert.match(result.error, /closed/i);
    assert.ok(fixture.sockets.every(s => s.destroyed));
});

test('proxy rejection closes its socket and never starts TLS', async (t) => {
    const fixture = connectionFixture(t, 'proxy-reject');
    const result = await runCodexResponsesInference({ proxyUrl: 'http://127.0.0.1:17890' }, {}, {}, { timeoutMs: 1000 });
    assert.equal(result.code, 'codex_network_error');
    assert.match(result.error, /407/);
    assert.equal(fixture.sockets.length, 2);
    assert.ok(fixture.sockets.every(s => s.destroyed));
});

test('hard timeout aborts pending agent creation; a late agent cannot send a POST', async () => {
    let complete;
    let setupSignal;
    let destroyed = 0;
    let posts = 0;
    const result = await runCodexResponsesInference({}, {}, {}, {
        timeoutMs: 25,
        createAgent: (_settings, _timeout, options) => {
            setupSignal = options?.signal;
            return new Promise(resolve => { complete = resolve; });
        },
        requestImpl() { posts++; }
    });
    assert.equal(result.code, 'timeout');
    assert.equal(setupSignal?.aborted, true);
    complete({ agent: { destroy() { destroyed++; } }, socket: { destroy() { destroyed++; } } });
    await new Promise(resolve => setImmediate(resolve));
    assert.equal(posts, 0);
    assert.equal(destroyed, 2);
});

test('consecutive failed attempts leave no earlier connection alive', async (t) => {
    const fixture = connectionFixture(t);
    for (let i = 0; i < 3; i++) {
        const result = await runCodexResponsesInference({
            proxyUrl: 'http://127.0.0.1:17890', codexConnectTimeoutMs: 15
        }, {}, {}, { timeoutMs: 1000 });
        assert.equal(result.code, 'timeout');
        assert.ok(fixture.sockets.every(s => s.destroyed));
    }
    assert.equal(fixture.requests.length, 3);
});

test('partial response abort is propagated immediately and logged without its body', async (t) => {
    const audit = await auditFixture(t);
    const response = new EventEmitter();
    response.statusCode = 200;
    response.headers = {};
    response.complete = false;
    response.setEncoding = () => {};
    let closed = 0;
    response.destroy = () => { closed++; };
    const request = new EventEmitter();
    request.setTimeout = () => {};
    request.destroy = () => { closed++; };
    const result = await runCodexResponsesInference({}, {}, {}, {
        timeoutMs: 1000, protocolAuditPath: audit.file,
        createAgent: async () => ({ agent: { destroy() {} }, proxy: '' }),
        requestImpl(_options, callback) {
            request.end = () => {
                callback(response);
                response.emit('data', 'private-response-fragment');
                response.emit('aborted');
                response.emit('close');
            };
            return request;
        }
    });
    assert.equal(result.code, 'codex_network_error');
    assert.equal(result.transportPhase, 'response_body');
    assert.ok(closed >= 2);
    const records = await audit.read();
    assert.equal(records.filter(r => r.event === 'transport' && r.stage === 'attempt_finished').length, 1);
    assert.doesNotMatch(JSON.stringify(records), /private-response-fragment/);
});

test('configured stream idle deadline cancels the response and records its phase', async () => {
    const response = new EventEmitter();
    response.statusCode = 200;
    response.headers = {};
    response.setEncoding = () => {};
    let idleMs = 0;
    let onIdle;
    let destroyed = false;
    const request = new EventEmitter();
    request.setTimeout = (ms, callback) => { idleMs = ms; onIdle = callback; };
    request.destroy = () => { destroyed = true; };
    const result = await runCodexResponsesInference({ codexStreamIdleTimeoutMs: 75 }, {}, {}, {
        timeoutMs: 1000,
        createAgent: async () => ({ agent: { destroy() {} }, proxy: '' }),
        requestImpl(_options, callback) {
            request.end = () => { callback(response); onIdle(); };
            return request;
        }
    });
    assert.equal(idleMs, 75);
    assert.equal(result.code, 'timeout');
    assert.equal(result.transportPhase, 'response_body');
    assert.match(result.error, /idle for 75ms/);
    assert.equal(destroyed, true);
});

test('successful proxy TLS hands off to HTTP without changing the body or cache headers', async (t) => {
    const fixture = connectionFixture(t, 'tls-success');
    const audit = await auditFixture(t);
    const body = { model: 'fixture-model', input: [], prompt_cache_key: 'stable-key', client_metadata: { session_id: 'stable-session' } };
    let sent;
    let headers;
    const result = await runCodexResponsesInference({
        proxyUrl: 'http://127.0.0.1:17890', codexConnectTimeoutMs: 250
    }, { accessToken: 'test-token', accountId: 'test-account' }, body, {
        timeoutMs: 1000, protocolAuditPath: audit.file,
        transportContext: { callId: 'local-call', attempt: 2, maxAttempts: 3 },
        requestImpl(options, callback) {
            headers = options.headers;
            const request = new EventEmitter();
            request.setTimeout = () => {};
            request.destroy = () => {};
            request.end = value => {
                sent = value;
                request.emit('finish');
                const response = new EventEmitter();
                response.statusCode = 200;
                response.headers = {};
                response.complete = true;
                response.setEncoding = () => {};
                callback(response);
                response.emit('data', `data: ${JSON.stringify({ type: 'response.completed', response: { id: 'fixture-response', output: [], usage: {} } })}\n\n`);
                response.emit('end');
                response.emit('close');
            };
            return request;
        }
    });
    assert.equal(result.ok, true);
    assert.equal(result.requestSent, true);
    assert.equal(sent, JSON.stringify(body));
    assert.equal(headers['session-id'], 'stable-session');
    assert.equal(headers['thread-id'], 'stable-session');
    assert.ok(fixture.sockets.filter(s => !fixture.requests.includes(s)).every(s => s.destroyed));
    const stages = (await audit.read()).filter(r => r.event === 'transport');
    for (const stage of ['proxy_connect_started', 'proxy_connect_response', 'tls_handshake_started', 'tls_connected', 'request_created', 'request_sent', 'response_headers', 'response_end', 'attempt_finished']) {
        assert.ok(stages.some(r => r.stage === stage), stage);
    }
    assert.ok(stages.every(r => r.callId === 'local-call' && r.attempt === 2 && r.maxAttempts === 3));
});

test('abort after HTTP headers closes the response as well as the request', async () => {
    const controller = new AbortController();
    const response = new EventEmitter();
    response.statusCode = 200;
    response.headers = {};
    response.setEncoding = () => {};
    let responseDestroyed = false;
    let requestDestroyed = false;
    response.destroy = () => { responseDestroyed = true; };
    const request = new EventEmitter();
    request.setTimeout = () => {};
    request.destroy = () => { requestDestroyed = true; };
    const result = await runCodexResponsesInference({}, {}, {}, {
        timeoutMs: 1000, signal: controller.signal,
        createAgent: async () => ({ agent: { destroy() {} }, proxy: '' }),
        requestImpl(_options, callback) {
            request.end = () => { callback(response); controller.abort(); };
            return request;
        }
    });
    assert.equal(result.code, 'aborted');
    assert.equal(responseDestroyed, true);
    assert.equal(requestDestroyed, true);
});

test('loopback proxy observes the actual TCP socket close after a stalled TLS handshake', async (t) => {
    const sockets = new Set();
    let sawClientHello = false;
    let peerClosed;
    const closed = new Promise(resolve => { peerClosed = resolve; });
    const server = net.createServer(socket => {
        sockets.add(socket);
        let header = Buffer.alloc(0);
        let connected = false;
        socket.on('error', () => {});
        socket.on('close', () => { sockets.delete(socket); peerClosed(); });
        socket.on('data', chunk => {
            if (connected) {
                sawClientHello ||= chunk[0] === 22; // TLS handshake record, not a model POST.
                return;
            }
            header = Buffer.concat([header, chunk]);
            if (header.includes('\r\n\r\n')) {
                connected = true;
                socket.write('HTTP/1.1 200 Connection Established\r\n\r\n');
            }
        });
    });
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    t.after(async () => {
        for (const socket of sockets) socket.destroy();
        await new Promise(resolve => server.close(resolve));
    });
    const result = await runCodexResponsesInference({
        proxyUrl: `http://127.0.0.1:${server.address().port}`,
        codexConnectTimeoutMs: 500
    }, {}, {}, { timeoutMs: 2000 });
    assert.equal(result.code, 'timeout');
    assert.equal(result.transportPhase, 'tls_handshake');
    assert.equal(result.requestSent, false);
    assert.equal(sawClientHello, true);
    let guard;
    try {
        await Promise.race([closed, new Promise((_, reject) => {
            guard = setTimeout(() => reject(new Error('Proxy peer did not observe cancellation')), 1000);
        })]);
    } finally { clearTimeout(guard); }
    assert.equal(sockets.size, 0);
});

test('provider entrypoint preserves connection budgets and audit settings for inference and native compaction', async () => {
    const file = require.resolve('../electron/desktop-llm-provider.cjs');
    const providerModule = new Module(file);
    providerModule.filename = file;
    providerModule.paths = Module._nodeModulePaths(path.dirname(file));
    const originalRequire = providerModule.require.bind(providerModule);
    const received = [];
    providerModule.require = id => {
        const value = originalRequire(id);
        if (id !== './codex-model-bridge.cjs') return value;
        const capture = async settings => { received.push(settings); return { ok: true }; };
        return { ...value, callCodexModelBridge: capture, compactCodexModelBridge: capture };
    };
    providerModule._compile(await fs.readFile(file, 'utf8'), file);
    const options = {
        provider: 'codex-model-bridge', model: 'fixture-model', timeoutMs: 300000,
        codexConnectTimeoutMs: 30000, codexStreamIdleTimeoutMs: 90000,
        codexProtocolAuditPath: 'fixture-audit.jsonl', codexProtocolAuditMode: 'summary'
    };
    await providerModule.exports.callDesktopLlmProvider(options, { input: [] });
    await providerModule.exports.compactDesktopLlmProvider(options, { input: [], compactionMode: 'native' });
    assert.equal(received.length, 2);
    for (const settings of received) {
        for (const key of Object.keys(options)) assert.equal(settings[key], options[key], key);
    }
});
