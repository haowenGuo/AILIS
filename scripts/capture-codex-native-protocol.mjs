import fs from 'node:fs';
import fsPromises from 'node:fs/promises';
import http from 'node:http';
import https from 'node:https';
import path from 'node:path';
import tls from 'node:tls';
import { createHash } from 'node:crypto';

function parseArgs(argv) {
    const options = { host: '127.0.0.1', port: 0, target: 'https://chatgpt.com', output: '', upstreamProxy: '' };
    for (let index = 0; index < argv.length; index += 1) {
        const arg = argv[index];
        if (arg === '--host') options.host = argv[++index];
        else if (arg === '--port') options.port = Number(argv[++index]);
        else if (arg === '--target') options.target = argv[++index];
        else if (arg === '--output') options.output = argv[++index];
        else if (arg === '--upstream-proxy') options.upstreamProxy = argv[++index];
        else throw new Error(`Unknown argument: ${arg}`);
    }
    if (!options.output) throw new Error('--output <directory> is required');
    return options;
}

function normalizeProxyUrl(value = '') {
    if (!value) return '';
    return /^[a-z][a-z0-9+.-]*:\/\//i.test(value) ? value : `http://${value}`;
}

function connectThroughProxy(proxyUrl, targetHost, targetPort) {
    return new Promise((resolve, reject) => {
        const proxy = new URL(normalizeProxyUrl(proxyUrl));
        const requestModule = proxy.protocol === 'https:' ? https : http;
        const request = requestModule.request({
            host: proxy.hostname,
            port: Number(proxy.port) || (proxy.protocol === 'https:' ? 443 : 80),
            method: 'CONNECT',
            path: `${targetHost}:${targetPort}`,
            headers: { Host: `${targetHost}:${targetPort}` }
        });
        request.setTimeout(30000, () => request.destroy(new Error('Upstream proxy CONNECT timed out.')));
        request.once('connect', (response, socket, head) => {
            if (response.statusCode !== 200) {
                socket.destroy();
                reject(new Error(`Upstream proxy CONNECT failed with status ${response.statusCode}.`));
                return;
            }
            if (head?.length) socket.unshift(head);
            const secureSocket = tls.connect({ socket, servername: targetHost });
            secureSocket.once('secureConnect', () => resolve(secureSocket));
            secureSocket.once('error', reject);
        });
        request.once('error', reject);
        request.end();
    });
}

function sha256(value) {
    return createHash('sha256').update(value).digest('hex');
}

function protectedHeader(name, value) {
    const lower = name.toLowerCase();
    if (lower === 'authorization') return '[redacted]';
    if (lower === 'chatgpt-account-id' || lower === 'x-codex-turn-state') {
        const text = String(value || '');
        return text ? `[sha256:${sha256(text)} bytes:${Buffer.byteLength(text)}]` : '';
    }
    return value;
}

function safeHeaders(headers = {}) {
    return Object.fromEntries(Object.entries(headers).map(([name, value]) => [
        name.toLowerCase(),
        protectedHeader(name, Array.isArray(value) ? value.join(', ') : value)
    ]));
}

function requestSummary(requestBody, body) {
    const input = Array.isArray(requestBody?.input) ? requestBody.input : [];
    const tools = Array.isArray(requestBody?.tools) ? requestBody.tools : [];
    return {
        model: String(requestBody?.model || ''),
        promptCacheKey: String(requestBody?.prompt_cache_key || ''),
        topLevelKeys: Object.keys(requestBody || {}),
        bodyBytes: Buffer.byteLength(body),
        bodySha256: sha256(body),
        instructionsBytes: Buffer.byteLength(String(requestBody?.instructions || '')),
        instructionsSha256: sha256(String(requestBody?.instructions || '')),
        toolCount: tools.length,
        toolsSha256: sha256(JSON.stringify(tools)),
        inputItemCount: input.length,
        inputItemHashes: input.map((item) => sha256(JSON.stringify(item))),
        inputItemTypes: input.map((item) => String(item?.type || '')),
        reasoning: requestBody?.reasoning || null,
        store: requestBody?.store === true,
        stream: requestBody?.stream === true,
        hasPreviousResponseId: Boolean(requestBody?.previous_response_id),
        clientMetadataKeys: Object.keys(requestBody?.client_metadata || {}).sort()
    };
}

function parseCompletedResponse(raw) {
    let completed = null;
    for (const line of raw.split(/\r?\n/)) {
        if (!line.startsWith('data:')) continue;
        const data = line.slice(5).trim();
        if (!data || data === '[DONE]') continue;
        try {
            const event = JSON.parse(data);
            if (event.type === 'response.completed') completed = event.response || event;
        } catch {}
    }
    return completed;
}

const options = parseArgs(process.argv.slice(2));
const target = new URL(options.target);
const outputDir = path.resolve(options.output);
const auditPath = path.join(outputDir, 'protocol-audit.jsonl');
await fsPromises.mkdir(outputDir, { recursive: true });
let sequence = 0;

function appendAudit(event) {
    fs.appendFileSync(auditPath, `${JSON.stringify({
        schema: 'ailis.codex_protocol_audit.v1',
        timestamp: new Date().toISOString(),
        source: 'native-codex-reverse-proxy',
        ...event
    })}\n`, 'utf8');
}

const server = http.createServer((incoming, outgoing) => {
    const chunks = [];
    let bytes = 0;
    incoming.on('data', (chunk) => {
        bytes += chunk.length;
        if (bytes > 64 * 1024 * 1024) {
            incoming.destroy(new Error('Request body exceeded 64 MiB capture limit.'));
            return;
        }
        chunks.push(chunk);
    });
    incoming.on('end', async () => {
        const bodyBuffer = Buffer.concat(chunks);
        const body = bodyBuffer.toString('utf8');
        const requestId = `native-${process.pid}-${Date.now()}-${++sequence}`;
        let requestBody = null;
        try { requestBody = body ? JSON.parse(body) : null; } catch {}
        appendAudit({
            event: 'request',
            requestId,
            endpoint: `${target.origin}${incoming.url}`,
            method: incoming.method,
            headers: safeHeaders(incoming.headers),
            ...(requestBody ? requestSummary(requestBody, body) : {
                bodyBytes: bodyBuffer.length,
                bodySha256: sha256(bodyBuffer)
            }),
            requestBody
        });

        const forwardedHeaders = { ...incoming.headers, host: target.host, 'content-length': bodyBuffer.length };
        let agent;
        try {
            if (options.upstreamProxy) {
                const socket = await connectThroughProxy(options.upstreamProxy, target.hostname, Number(target.port) || 443);
                agent = new https.Agent({ keepAlive: false });
                agent.createConnection = () => socket;
            }
        } catch (error) {
            appendAudit({ event: 'response', requestId, ok: false, status: 0, error: error.message });
            outgoing.writeHead(502, { 'content-type': 'application/json' });
            outgoing.end(JSON.stringify({ error: { message: 'Diagnostic reverse proxy CONNECT failure.' } }));
            return;
        }
        const upstream = https.request({
            protocol: target.protocol,
            hostname: target.hostname,
            port: target.port || 443,
            method: incoming.method,
            path: incoming.url,
            headers: forwardedHeaders,
            agent
        }, (response) => {
            outgoing.writeHead(response.statusCode || 502, response.headers);
            const responseChunks = [];
            response.on('data', (chunk) => {
                responseChunks.push(chunk);
                outgoing.write(chunk);
            });
            response.on('end', async () => {
                outgoing.end();
                const rawBuffer = Buffer.concat(responseChunks);
                const raw = rawBuffer.toString('utf8');
                const completed = parseCompletedResponse(raw);
                const rawPath = path.join(outputDir, `${String(sequence).padStart(3, '0')}-${requestId}.response.sse`);
                await fsPromises.writeFile(rawPath, rawBuffer);
                appendAudit({
                    event: 'response',
                    requestId,
                    ok: Number(response.statusCode) >= 200 && Number(response.statusCode) < 300,
                    status: Number(response.statusCode) || 0,
                    headers: safeHeaders(response.headers),
                    responseId: String(completed?.id || ''),
                    usage: completed?.usage || null,
                    responseBytes: rawBuffer.length,
                    responseSha256: sha256(rawBuffer),
                    responseCapture: rawPath
                });
            });
        });
        upstream.on('error', (error) => {
            appendAudit({ event: 'response', requestId, ok: false, status: 0, error: error.message });
            if (!outgoing.headersSent) outgoing.writeHead(502, { 'content-type': 'application/json' });
            outgoing.end(JSON.stringify({ error: { message: 'Diagnostic reverse proxy upstream failure.' } }));
        });
        upstream.end(bodyBuffer);
    });
});

server.listen(options.port, options.host, () => {
    const address = server.address();
    process.stdout.write(`READY ${JSON.stringify({
        host: options.host,
        port: typeof address === 'object' ? address.port : options.port,
        auditPath,
        target: target.origin,
        upstreamProxy: options.upstreamProxy ? '[configured]' : ''
    })}\n`);
});

for (const signal of ['SIGINT', 'SIGTERM']) {
    process.on(signal, () => server.close(() => process.exit(0)));
}
