import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { AILISRuntime } = require('../electron/ailis-runtime.cjs');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function makeHttpMcpServer() {
    const requests = [];
    const server = http.createServer((req, res) => {
        let body = '';
        req.setEncoding('utf8');
        req.on('data', (chunk) => {
            body += chunk;
        });
        req.on('end', () => {
            let request = {};
            try {
                request = JSON.parse(body || '{}');
            } catch {}
            requests.push({
                method: request.method,
                sessionId: req.headers['mcp-session-id'] || ''
            });
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Mcp-Session-Id', 'ailis-http-soak-session');
            if (!request.id) {
                res.statusCode = 202;
                res.end('');
                return;
            }
            const send = (payload) => {
                res.end(JSON.stringify({ jsonrpc: '2.0', id: request.id, ...payload }));
            };
            if (request.method === 'initialize') {
                send({
                    result: {
                        protocolVersion: '2025-06-18',
                        capabilities: { tools: {}, resources: {}, prompts: {} },
                        serverInfo: { name: 'ailis-mcp-soak-http', version: '1.0.0' }
                    }
                });
                return;
            }
            if (request.method === 'tools/list') {
                send({
                    result: {
                        tools: [
                            {
                                name: 'echo_http',
                                description: 'Echo input text over HTTP',
                                inputSchema: {
                                    type: 'object',
                                    required: ['text'],
                                    properties: { text: { type: 'string', minLength: 1 } },
                                    additionalProperties: false
                                }
                            },
                            {
                                name: 'fail_http',
                                description: 'Return a tool-level failure',
                                inputSchema: {
                                    type: 'object',
                                    properties: { reason: { type: 'string' } },
                                    additionalProperties: true
                                }
                            }
                        ]
                    }
                });
                return;
            }
            if (request.method === 'tools/call') {
                if (request.params?.name === 'echo_http') {
                    send({
                        result: {
                            content: [{ type: 'text', text: `http:${request.params?.arguments?.text || ''}` }]
                        }
                    });
                    return;
                }
                if (request.params?.name === 'fail_http') {
                    send({
                        result: {
                            isError: true,
                            content: [{ type: 'text', text: `http-failed:${request.params?.arguments?.reason || 'fixture'}` }]
                        }
                    });
                    return;
                }
                send({ error: { code: -32602, message: `unknown tool: ${request.params?.name || ''}` } });
                return;
            }
            if (request.method === 'resources/list') {
                send({
                    result: {
                        resources: [{ uri: 'soak://http-note', name: 'http note', mimeType: 'text/plain' }]
                    }
                });
                return;
            }
            if (request.method === 'resources/templates/list') {
                send({
                    result: {
                        resourceTemplates: [{ uriTemplate: 'soak://http/{name}', name: 'http template', mimeType: 'text/plain' }]
                    }
                });
                return;
            }
            if (request.method === 'resources/read') {
                send({
                    result: {
                        contents: [{ uri: request.params?.uri || 'soak://http-note', mimeType: 'text/plain', text: 'http resource body for AILIS MCP soak' }]
                    }
                });
                return;
            }
            if (request.method === 'prompts/list') {
                send({
                    result: {
                        prompts: [{ name: 'diagnose_http', description: 'Diagnose HTTP MCP soak state' }]
                    }
                });
                return;
            }
            if (request.method === 'prompts/get') {
                send({
                    result: {
                        messages: [
                            {
                                role: 'user',
                                content: { type: 'text', text: `http prompt:${request.params?.name || ''}` }
                            }
                        ]
                    }
                });
                return;
            }
            send({ error: { code: -32601, message: `unknown method: ${request.method || ''}` } });
        });
    });
    return { server, requests };
}

async function listen(server) {
    await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
    return server.address();
}

async function closeServer(server) {
    await new Promise((resolve) => server.close(resolve));
}

async function record(checks, name, fn) {
    const startedAt = Date.now();
    try {
        const details = await fn();
        checks.push({
            name,
            ok: true,
            durationMs: Date.now() - startedAt,
            details: details || {}
        });
    } catch (error) {
        checks.push({
            name,
            ok: false,
            durationMs: Date.now() - startedAt,
            error: error?.message || String(error),
            details: error?.details || null
        });
    }
}

export async function runAILISMcpSoak() {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-mcp-soak-'));
    const auditDir = path.join(workspaceRoot, '.audit');
    const stdioServerPath = path.join(__dirname, 'fixtures', 'ailis-mcp-soak-server.cjs');
    const { server: httpServer, requests } = makeHttpMcpServer();
    const address = await listen(httpServer);
    const runtime = new AILISRuntime({
        workspaceRoot,
        projectRoot: path.resolve('.'),
        auditDir,
        mcpServers: {
            stdio_soak: {
                transport: 'stdio',
                command: process.execPath,
                args: [stdioServerPath],
                cwd: workspaceRoot,
                timeoutMs: 5000
            },
            http_soak: {
                transport: 'http',
                url: `http://127.0.0.1:${address.port}/mcp`,
                timeoutMs: 5000
            }
        }
    });

    const checks = [];
    try {
        await record(checks, 'list configured servers', async () => {
            const result = await runtime.executeTool('mcp_bridge', { action: 'list_servers' }, { runId: 'mcp-soak' });
            assert.equal(result.details.status, 'completed');
            assert.equal(result.details.servers.length, 2);
            return { servers: result.details.servers.map((server) => server.name) };
        });

        await record(checks, 'health check stdio and http', async () => {
            const result = await runtime.executeTool('mcp_bridge', { action: 'health_check', timeoutMs: 3000 }, { runId: 'mcp-soak' });
            assert.equal(result.details.status, 'completed');
            assert.equal(result.details.health.every((entry) => entry.ok), true, JSON.stringify(result.details.health));
            return { health: result.details.health };
        });

        await record(checks, 'stdio list and call tool', async () => {
            const tools = await runtime.executeTool('mcp_bridge', { action: 'list_tools', server: 'stdio_soak' }, { runId: 'mcp-soak' });
            assert.equal(tools.details.tools[0].tools.some((tool) => tool.name === 'echo'), true);
            const call = await runtime.executeTool(
                'mcp_bridge',
                { action: 'call_tool', server: 'stdio_soak', tool: 'echo', args: { text: 'hello' } },
                { runId: 'mcp-soak' }
            );
            assert.equal(call.details.status, 'completed');
            assert.match(call.content[0].text, /stdio:hello/);
            return { toolCount: tools.details.tools[0].tools.length };
        });

        await record(checks, 'http list and call tool', async () => {
            const tools = await runtime.executeTool('mcp_bridge', { action: 'list_tools', server: 'http_soak' }, { runId: 'mcp-soak' });
            assert.equal(tools.details.tools[0].tools.some((tool) => tool.name === 'echo_http'), true);
            const call = await runtime.executeTool(
                'mcp_bridge',
                { action: 'call_tool', server: 'http_soak', tool: 'echo_http', args: { text: 'hello' } },
                { runId: 'mcp-soak' }
            );
            assert.equal(call.details.status, 'completed');
            assert.match(call.content[0].text, /http:hello/);
            assert.ok(requests.some((request) => request.method === 'tools/list' && request.sessionId === 'ailis-http-soak-session'));
            return { httpRequests: requests.length };
        });

        await record(checks, 'input schema validation rejects invalid args', async () => {
            const invalid = await runtime.executeTool(
                'mcp_bridge',
                { action: 'call_tool', server: 'stdio_soak', tool: 'echo', args: {} },
                { runId: 'mcp-soak' }
            );
            assert.equal(invalid.isError, true);
            assert.equal(invalid.details.details.status, 'invalid_mcp_tool_args');
            return { status: invalid.details.details.status };
        });

        await record(checks, 'resources and prompts work on both transports', async () => {
            const stdioResource = await runtime.executeTool(
                'mcp_bridge',
                { action: 'read_resource', server: 'stdio_soak', uri: 'soak://stdio-note' },
                { runId: 'mcp-soak' }
            );
            assert.match(JSON.stringify(stdioResource.details.result), /stdio resource body/);
            const httpResource = await runtime.executeTool(
                'mcp_bridge',
                { action: 'read_resource', server: 'http_soak', uri: 'soak://http-note' },
                { runId: 'mcp-soak' }
            );
            assert.match(JSON.stringify(httpResource.details.result), /http resource body/);
            const prompts = await runtime.executeTool('mcp_bridge', { action: 'list_prompts', server: 'stdio_soak' }, { runId: 'mcp-soak' });
            assert.equal(prompts.details.prompts[0].prompts[0].name, 'diagnose');
            const prompt = await runtime.executeTool(
                'mcp_bridge',
                { action: 'get_prompt', server: 'http_soak', prompt: 'diagnose_http' },
                { runId: 'mcp-soak' }
            );
            assert.match(JSON.stringify(prompt.details.result), /http prompt:diagnose_http/);
            return { resourceTransports: ['stdio', 'http'], promptTransports: ['stdio', 'http'] };
        });

        await record(checks, 'tool timeout is bounded and session remains healthy', async () => {
            const slow = await runtime.executeTool(
                'mcp_bridge',
                { action: 'call_tool', server: 'stdio_soak', tool: 'slow_wait', args: { delayMs: 1500 }, timeoutMs: 1000 },
                { runId: 'mcp-soak' }
            );
            assert.equal(slow.isError, true);
            assert.match(slow.details.error, /timed out/i);
            const health = await runtime.executeTool(
                'mcp_bridge',
                { action: 'health_check', server: 'stdio_soak', timeoutMs: 3000 },
                { runId: 'mcp-soak' }
            );
            assert.equal(health.details.health[0].ok, true);
            return { timeoutStatus: slow.details.status, recovered: true };
        });
    } finally {
        await runtime.shutdown();
        await closeServer(httpServer);
    }

    const failed = checks.filter((check) => !check.ok);
    return {
        ok: failed.length === 0,
        workspaceRoot,
        checks,
        summary: {
            total: checks.length,
            passed: checks.length - failed.length,
            failed: failed.length,
            transports: ['stdio', 'http']
        }
    };
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
    const report = await runAILISMcpSoak();
    console.log(JSON.stringify(report, null, 2));
    if (!report.ok) {
        process.exitCode = 1;
    }
}
