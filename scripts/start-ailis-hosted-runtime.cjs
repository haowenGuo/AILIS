'use strict';

const http = require('http');
const { AILISHostedRuntimeManager } = require('../electron/ailis-hosted-runtime.cjs');

const host = process.env.AILIS_HOSTED_RUNTIME_HOST || '127.0.0.1';
const port = Math.max(1, Math.min(Number(process.env.AILIS_HOSTED_RUNTIME_PORT) || 18777, 65535));
const internalToken = String(process.env.AILIS_HOSTED_RUNTIME_INTERNAL_TOKEN || '').trim();
const manager = new AILISHostedRuntimeManager();

function sendJson(res, statusCode, payload) {
    const body = Buffer.from(JSON.stringify(payload));
    res.writeHead(statusCode, {
        'content-type': 'application/json; charset=utf-8',
        'content-length': body.length,
        'cache-control': 'no-store'
    });
    res.end(body);
}

function acceptsEventStream(req) {
    return /(?:^|,)\s*text\/event-stream(?:\s*;|\s*,|$)/i.test(
        String(req.headers.accept || '')
    );
}

function startEventStream(res) {
    res.writeHead(200, {
        'content-type': 'text/event-stream; charset=utf-8',
        'cache-control': 'no-cache, no-transform',
        connection: 'keep-alive',
        'x-accel-buffering': 'no'
    });
    res.flushHeaders?.();
}

function writeEventStream(res, event, payload) {
    if (res.destroyed || res.writableEnded) {
        return false;
    }
    res.write(`event: ${event}\ndata: ${JSON.stringify(payload)}\n\n`);
    return true;
}

async function readBody(req, maxBytes = 4 * 1024 * 1024) {
    const chunks = [];
    let total = 0;
    for await (const chunk of req) {
        total += chunk.length;
        if (total > maxBytes) {
            throw Object.assign(new Error('payload_too_large'), { statusCode: 413 });
        }
        chunks.push(chunk);
    }
    return chunks.length ? Buffer.concat(chunks) : Buffer.alloc(0);
}

async function readJson(req) {
    const body = await readBody(req);
    if (!body.length) {
        return {};
    }
    return JSON.parse(body.toString('utf8'));
}

function authorize(req) {
    if (!internalToken) {
        return true;
    }
    return String(req.headers['x-ailis-internal-token'] || '') === internalToken;
}

const server = http.createServer(async (req, res) => {
    try {
        const url = new URL(req.url || '/', `http://${host}`);
        if (url.pathname === '/health' && req.method === 'GET') {
            sendJson(res, 200, manager.getStatus());
            return;
        }
        if (!authorize(req)) {
            sendJson(res, 401, { ok: false, status: 'unauthorized' });
            return;
        }
        if (url.pathname === '/tenant/status' && req.method === 'GET') {
            sendJson(res, 200, await manager.getTenantStatus(url.searchParams.get('tenantId') || ''));
            return;
        }
        if (url.pathname === '/events/recent' && req.method === 'GET') {
            sendJson(res, 200, manager.getEvents(url.searchParams.get('tenantId') || '', {
                cursor: url.searchParams.get('cursor'),
                limit: url.searchParams.get('limit')
            }));
            return;
        }
        if (url.pathname === '/attachments/upload' && req.method === 'POST') {
            const maxBytes = manager.maxAttachmentBytes + 1;
            const bytes = await readBody(req, maxBytes);
            sendJson(res, 200, await manager.storeAttachment(
                url.searchParams.get('tenantId') || '',
                {
                    sessionId: url.searchParams.get('sessionId') || 'main',
                    name: url.searchParams.get('filename') || 'attachment.bin',
                    mimeType: url.searchParams.get('mimeType') || req.headers['content-type'],
                    bytes
                }
            ));
            return;
        }
        if (url.pathname === '/agent/run' && req.method === 'POST') {
            const body = await readJson(req);
            if (!acceptsEventStream(req)) {
                sendJson(res, 200, await manager.runAgent(body.tenantId, body.payload || {}));
                return;
            }

            startEventStream(res);
            let sequence = 0;
            writeEventStream(res, 'response.started', {
                sequence,
                runtime: 'ailis-hosted'
            });
            const keepAlive = setInterval(() => {
                if (!res.destroyed && !res.writableEnded) {
                    res.write(': keep-alive\n\n');
                }
            }, 15000);
            keepAlive.unref?.();
            try {
                const result = await manager.runAgentEventStream(
                    body.tenantId,
                    body.payload || {},
                    {
                        onTextDelta: (delta, metadata = {}) => {
                            sequence += 1;
                            writeEventStream(res, 'response.output_text.delta', {
                                sequence,
                                delta,
                                metadata
                            });
                        },
                        onTextStreamEvent: (streamEvent = {}) => {
                            const eventType = String(streamEvent.type || '');
                            if (![
                                'response.output_text.started',
                                'response.output_text.committed',
                                'response.output_text.discarded'
                            ].includes(eventType)) {
                                return;
                            }
                            sequence += 1;
                            writeEventStream(res, eventType, {
                                sequence,
                                ...streamEvent
                            });
                        }
                    }
                );
                sequence += 1;
                writeEventStream(res, 'response.completed', {
                    sequence,
                    result
                });
            } finally {
                clearInterval(keepAlive);
            }
            res.end();
            return;
        }
        if (url.pathname === '/agent/interrupt' && req.method === 'POST') {
            const body = await readJson(req);
            sendJson(res, 200, await manager.interruptAgentRun(body.tenantId, body.payload || {}));
            return;
        }
        sendJson(res, 404, { ok: false, status: 'not_found' });
    } catch (error) {
        const payload = {
            ok: false,
            status: error.message === 'tenant_id_invalid' ? 'tenant_id_invalid' : 'hosted_runtime_error',
            error: error.message || String(error)
        };
        if (res.headersSent) {
            writeEventStream(res, 'response.error', payload);
            res.end();
            return;
        }
        sendJson(res, error.statusCode || 500, payload);
    }
});

const evictionTimer = setInterval(() => {
    void manager.evictIdleRuntimes();
}, 60000);
evictionTimer.unref?.();

async function shutdown() {
    clearInterval(evictionTimer);
    await manager.close();
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(1), 5000).unref?.();
}

process.on('SIGINT', () => void shutdown());
process.on('SIGTERM', () => void shutdown());

server.listen(port, host, () => {
    process.stdout.write(`AILIS hosted runtime listening on http://${host}:${port}\n`);
});
