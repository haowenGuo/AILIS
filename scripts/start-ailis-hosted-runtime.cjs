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

async function readJson(req) {
    const chunks = [];
    let total = 0;
    for await (const chunk of req) {
        total += chunk.length;
        if (total > 4 * 1024 * 1024) {
            throw Object.assign(new Error('payload_too_large'), { statusCode: 413 });
        }
        chunks.push(chunk);
    }
    if (!chunks.length) {
        return {};
    }
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
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
        if (url.pathname === '/agent/run' && req.method === 'POST') {
            const body = await readJson(req);
            sendJson(res, 200, await manager.runAgent(body.tenantId, body.payload || {}));
            return;
        }
        if (url.pathname === '/agent/interrupt' && req.method === 'POST') {
            const body = await readJson(req);
            sendJson(res, 200, await manager.interruptAgentRun(body.tenantId, body.payload || {}));
            return;
        }
        sendJson(res, 404, { ok: false, status: 'not_found' });
    } catch (error) {
        sendJson(res, error.statusCode || 500, {
            ok: false,
            status: error.message === 'tenant_id_invalid' ? 'tenant_id_invalid' : 'hosted_runtime_error',
            error: error.message || String(error)
        });
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
