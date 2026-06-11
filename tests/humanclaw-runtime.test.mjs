import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { HumanClawRuntime } = require('../electron/humanclaw-runtime.cjs');
const { HumanClawGateway } = require('../electron/humanclaw-gateway.cjs');

async function jsonFetch(url, options = {}) {
    const response = await fetch(url, {
        ...options,
        headers: {
            'content-type': 'application/json',
            ...(options.headers || {})
        }
    });
    const body = await response.json();
    return { response, body };
}

async function callTool(baseUrl, payload) {
    return await jsonFetch(`${baseUrl}/tools/call`, {
        method: 'POST',
        body: JSON.stringify(payload)
    });
}

test('HumanClaw runtime guards tool results and repairs incomplete transcripts', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'humanclaw-runtime-direct-'));
    const auditDir = path.join(workspaceRoot, '.audit');
    const runtime = new HumanClawRuntime({
        workspaceRoot,
        projectRoot: path.resolve('.'),
        auditDir
    });
    const runId = 'runtime-direct-run';

    const guarded = runtime.guardToolResult(
        {
            content: [{ type: 'text', text: `${'x'.repeat(13000)}secret` }],
            details: { status: 'completed', apiKey: 'test-secret' }
        },
        { toolId: 'read', callId: 'guard-call', maxTextChars: 128 }
    );
    assert.equal(guarded.content[0].truncated, true);
    assert.equal(guarded.details.apiKey, '__REDACTED__');
    assert.equal(guarded.details.guard.tool, 'read');

    await runtime.startRun({
        runId,
        sessionId: 'runtime-direct',
        message: 'repair missing tool result',
        planner: 'test'
    });
    await runtime.appendItem(runId, {
        type: 'tool.call',
        sessionId: 'runtime-direct',
        payload: {
            callId: 'missing-result-call',
            tool: 'read',
            args: { path: 'note.txt' }
        }
    });
    const completed = await runtime.completeRun(runId, {
        ok: true,
        status: 'completed',
        mode: 'task',
        planner: 'test',
        intent: 'runtime_repair_test',
        displayText: 'done',
        durationMs: 1
    });
    assert.equal(completed.repair.repaired, 1);

    const transcript = await runtime.readTranscript(runId);
    assert.equal(transcript.ok, true);
    assert.ok(transcript.items.some((item) => item.type === 'tool.result' && item.status === 'repaired_missing_result'));
    assert.ok(transcript.items.some((item) => item.type === 'transcript.repair'));
});

test('HumanClaw Gateway exposes runtime tools, update_plan, policy checks, and transcripts', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'humanclaw-runtime-gateway-'));
    const gateway = new HumanClawGateway({
        port: 0,
        workspaceRoot,
        projectRoot: path.resolve('.'),
        auditDir: path.join(workspaceRoot, '.audit')
    });

    try {
        const status = await gateway.start();
        const baseUrl = status.url;

        const tools = await jsonFetch(`${baseUrl}/tools`);
        assert.equal(tools.body.ok, true);
        assert.ok(tools.body.runtimeTools.some((tool) => tool.id === 'update_plan'));
        assert.ok(tools.body.coreTools.some((tool) => tool.id === 'update_plan' && tool.route === 'humanclaw-runtime'));

        const plan = await callTool(baseUrl, {
            tool: 'update_plan',
            args: {
                explanation: 'runtime acceptance',
                plan: [{ step: 'wire the runtime', status: 'in_progress' }]
            },
            context: {
                workspace: workspaceRoot,
                runId: 'runtime-gateway-run',
                sessionKey: 'runtime-gateway',
                approved: true
            }
        });
        assert.equal(plan.body.ok, true, plan.body.error);
        assert.equal(plan.body.status, 'completed');
        assert.equal(plan.body.result.details.plan[0].step, 'wire the runtime');

        const blocked = await callTool(baseUrl, {
            tool: 'write',
            args: { path: 'blocked.txt', content: 'should not write' },
            context: {
                workspace: workspaceRoot,
                permissionProfile: 'read-only'
            }
        });
        assert.equal(blocked.body.ok, false);
        assert.equal(blocked.body.status, 'blocked');
        await assert.rejects(() => fs.readFile(path.join(workspaceRoot, 'blocked.txt'), 'utf8'), /ENOENT/);

        const blockedByFileSystemField = await callTool(baseUrl, {
            tool: 'write',
            args: { path: 'blocked-by-field.txt', content: 'should not write' },
            context: {
                workspace: workspaceRoot,
                permissionProfile: {
                    fileSystem: 'read-only',
                    shell: 'none',
                    approvalPolicy: 'never'
                }
            }
        });
        assert.equal(blockedByFileSystemField.body.ok, false);
        assert.equal(blockedByFileSystemField.body.status, 'blocked');
        await assert.rejects(() => fs.readFile(path.join(workspaceRoot, 'blocked-by-field.txt'), 'utf8'), /ENOENT/);

        const permissionRequest = await callTool(baseUrl, {
            tool: 'request_permissions',
            args: {
                reason: 'Need to write one acceptance file.',
                permissions: {
                    file_system: {
                        write: ['granted.txt']
                    }
                }
            },
            context: {
                workspace: workspaceRoot,
                sessionKey: 'runtime-gateway',
                permissionProfile: 'read-only'
            }
        });
        assert.equal(permissionRequest.body.ok, false);
        assert.equal(permissionRequest.body.status, 'needs_approval');

        const granted = await callTool(baseUrl, {
            tool: 'request_permissions',
            args: {
                reason: 'Need to write one acceptance file.',
                permissions: {
                    file_system: {
                        write: ['granted.txt']
                    }
                }
            },
            context: {
                workspace: workspaceRoot,
                sessionKey: 'runtime-gateway',
                permissionProfile: 'read-only',
                approved: true
            }
        });
        assert.equal(granted.body.ok, true, granted.body.error);
        assert.equal(granted.body.result.details.grant.status, 'granted');

        const grantedWrite = await callTool(baseUrl, {
            tool: 'write',
            args: { path: 'granted.txt', content: 'permission grant worked' },
            context: {
                workspace: workspaceRoot,
                sessionKey: 'runtime-gateway',
                permissionProfile: 'read-only'
            }
        });
        assert.equal(grantedWrite.body.ok, true, grantedWrite.body.error);
        assert.equal(await fs.readFile(path.join(workspaceRoot, 'granted.txt'), 'utf8'), 'permission grant worked');

        const patch = await callTool(baseUrl, {
            tool: 'apply_patch',
            args: {
                input: [
                    '*** Begin Patch',
                    '*** Add File: patched.txt',
                    '+hello patch',
                    '*** End Patch'
                ].join('\n')
            },
            context: {
                workspace: workspaceRoot,
                sessionKey: 'runtime-gateway'
            }
        });
        assert.equal(patch.body.ok, true, patch.body.error);
        assert.equal(await fs.readFile(path.join(workspaceRoot, 'patched.txt'), 'utf8'), 'hello patch\n');

        const intercepted = await callTool(baseUrl, {
            tool: 'computer',
            args: {
                action: 'exec_command',
                cmd: [
                    'apply_patch <<PATCH',
                    '*** Begin Patch',
                    '*** Add File: intercepted.txt',
                    '+hello intercept',
                    '*** End Patch',
                    'PATCH'
                ].join('\n')
            },
            context: {
                workspace: workspaceRoot,
                sessionKey: 'runtime-gateway'
            }
        });
        assert.equal(intercepted.body.ok, true, intercepted.body.error);
        assert.equal(intercepted.body.result.details.action, 'apply_patch');
        assert.equal(await fs.readFile(path.join(workspaceRoot, 'intercepted.txt'), 'utf8'), 'hello intercept\n');

        const transcript = await jsonFetch(`${baseUrl}/transcript?runId=runtime-gateway-run`);
        assert.equal(transcript.body.ok, true);
        assert.ok(transcript.body.items.some((item) => item.type === 'tool.call'));
        assert.ok(transcript.body.items.some((item) => item.type === 'tool.event' && item.status === 'begin'));
        assert.ok(transcript.body.items.some((item) => item.type === 'tool.event' && ['success', 'failure'].includes(item.status)));
        assert.ok(transcript.body.items.some((item) => item.type === 'plan.updated'));
        assert.ok(transcript.body.items.some((item) => item.type === 'tool.result'));
    } finally {
        await gateway.stop();
    }
});

test('HumanClaw runtime can call a real stdio MCP server and read resources', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'humanclaw-mcp-runtime-'));
    const auditDir = path.join(workspaceRoot, '.audit');
    const serverPath = path.join(workspaceRoot, 'fixture-mcp-server.cjs');
    await fs.writeFile(
        serverPath,
        `
const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
function send(message) {
  process.stdout.write(JSON.stringify({ jsonrpc: '2.0', ...message }) + '\\n');
}
rl.on('line', (line) => {
  let request;
  try { request = JSON.parse(line); } catch { return; }
  if (!request.id) return;
  if (request.method === 'initialize') {
    send({ id: request.id, result: { protocolVersion: '2025-06-18', capabilities: { tools: {}, resources: {} }, serverInfo: { name: 'fixture', version: '1.0.0' } } });
    return;
  }
  if (request.method === 'tools/list') {
    send({ id: request.id, result: { tools: [{ name: 'echo', description: 'Echo input text', inputSchema: { type: 'object', properties: { text: { type: 'string' } } } }] } });
    return;
  }
  if (request.method === 'tools/call') {
    send({ id: request.id, result: { content: [{ type: 'text', text: 'echo:' + (request.params?.arguments?.text || '') }] } });
    return;
  }
  if (request.method === 'resources/list') {
    send({ id: request.id, result: { resources: [{ uri: 'fixture://note', name: 'note', mimeType: 'text/plain' }] } });
    return;
  }
  if (request.method === 'resources/templates/list') {
    send({ id: request.id, result: { resourceTemplates: [] } });
    return;
  }
  if (request.method === 'resources/read') {
    send({ id: request.id, result: { contents: [{ uri: request.params.uri, mimeType: 'text/plain', text: 'fixture resource body' }] } });
    return;
  }
  send({ id: request.id, error: { code: -32601, message: 'unknown method' } });
});
        `.trim(),
        'utf8'
    );
    const runtime = new HumanClawRuntime({
        workspaceRoot,
        projectRoot: path.resolve('.'),
        auditDir,
        mcpServers: {
            fixture: {
                command: process.execPath,
                args: [serverPath],
                cwd: workspaceRoot
            }
        }
    });

    try {
        const tools = await runtime.executeTool('mcp_bridge', { action: 'list_tools', server: 'fixture' }, { runId: 'mcp-run' });
        assert.equal(tools.details.status, 'completed');
        assert.equal(tools.details.tools[0].tools[0].name, 'echo');

        const call = await runtime.executeTool(
            'mcp_bridge',
            { action: 'call_tool', server: 'fixture', tool: 'echo', args: { text: 'hello' } },
            { runId: 'mcp-run' }
        );
        assert.equal(call.details.status, 'completed');
        assert.match(call.content[0].text, /echo:hello/);
        assert.equal(runtime.canExecuteTool('mcp__fixture__echo'), true);
        assert.equal(runtime.canExecuteTool('mcp:fixture:echo'), true);

        const directCall = await runtime.executeTool(
            'mcp__fixture__echo',
            { text: 'direct' },
            { runId: 'mcp-run' }
        );
        assert.equal(directCall.details.status, 'completed');
        assert.equal(directCall.details.server, 'fixture');
        assert.equal(directCall.details.tool, 'echo');
        assert.match(directCall.content[0].text, /echo:direct/);

        const searched = await runtime.executeTool(
            'tool_search',
            { query: 'echo fixture', limit: 8 },
            { runId: 'mcp-run' }
        );
        assert.equal(searched.details.status, 'completed');
        assert.ok(searched.details.tools.some((tool) => tool.id === 'mcp__fixture__echo'));

        const aliasCall = await runtime.executeTool(
            'mcp_bridge',
            { action: 'call_tool', server: 'fixture', tool_name: 'echo', tool_args: { text: 'alias' } },
            { runId: 'mcp-run' }
        );
        assert.equal(aliasCall.details.status, 'completed');
        assert.match(aliasCall.content[0].text, /echo:alias/);

        const topLevelArgCall = await runtime.executeTool(
            'mcp_bridge',
            { action: 'call_tool', server: 'fixture', tool: 'echo', text: 'top-level' },
            { runId: 'mcp-run' }
        );
        assert.equal(topLevelArgCall.details.status, 'completed');
        assert.match(topLevelArgCall.content[0].text, /echo:top-level/);

        const resource = await runtime.executeTool(
            'mcp_bridge',
            { action: 'read_resource', server: 'fixture', uri: 'fixture://note' },
            { runId: 'mcp-run' }
        );
        assert.equal(resource.details.status, 'completed');
        assert.equal(resource.details.result.contents[0].text, 'fixture resource body');
    } finally {
        await runtime.shutdown();
    }
});

test('HumanClaw runtime can call a basic HTTP MCP server', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'humanclaw-http-mcp-runtime-'));
    const auditDir = path.join(workspaceRoot, '.audit');
    const http = await import('node:http');
    const requests = [];
    const server = http.createServer((req, res) => {
        let body = '';
        req.setEncoding('utf8');
        req.on('data', (chunk) => {
            body += chunk;
        });
        req.on('end', () => {
            const request = JSON.parse(body || '{}');
            requests.push({
                method: request.method,
                sessionId: req.headers['mcp-session-id'] || ''
            });
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Mcp-Session-Id', 'session-http-fixture');
            if (!request.id) {
                res.statusCode = 202;
                res.end('');
                return;
            }
            if (request.method === 'initialize') {
                res.end(JSON.stringify({
                    jsonrpc: '2.0',
                    id: request.id,
                    result: {
                        protocolVersion: '2025-06-18',
                        capabilities: { tools: {}, resources: {} },
                        serverInfo: { name: 'http-fixture', version: '1.0.0' }
                    }
                }));
                return;
            }
            if (request.method === 'tools/list') {
                res.end(JSON.stringify({
                    jsonrpc: '2.0',
                    id: request.id,
                    result: {
                        tools: [
                            {
                                name: 'echo_http',
                                description: 'Echo over HTTP',
                                inputSchema: {
                                    type: 'object',
                                    required: ['text'],
                                    properties: { text: { type: 'string' } }
                                }
                            }
                        ]
                    }
                }));
                return;
            }
            if (request.method === 'tools/call') {
                res.end(JSON.stringify({
                    jsonrpc: '2.0',
                    id: request.id,
                    result: {
                        content: [
                            {
                                type: 'text',
                                text: `http:${request.params?.arguments?.text || ''}`
                            }
                        ]
                    }
                }));
                return;
            }
            if (request.method === 'prompts/list') {
                res.end(JSON.stringify({
                    jsonrpc: '2.0',
                    id: request.id,
                    result: {
                        prompts: [
                            {
                                name: 'explain',
                                description: 'Explain the fixture state'
                            }
                        ]
                    }
                }));
                return;
            }
            if (request.method === 'prompts/get') {
                res.end(JSON.stringify({
                    jsonrpc: '2.0',
                    id: request.id,
                    result: {
                        messages: [
                            {
                                role: 'user',
                                content: {
                                    type: 'text',
                                    text: `prompt:${request.params?.name || ''}`
                                }
                            }
                        ]
                    }
                }));
                return;
            }
            res.end(JSON.stringify({
                jsonrpc: '2.0',
                id: request.id,
                error: { code: -32601, message: 'unknown method' }
            }));
        });
    });
    await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
    const address = server.address();
    const runtime = new HumanClawRuntime({
        workspaceRoot,
        projectRoot: path.resolve('.'),
        auditDir,
        mcpServers: {
            fixture_http: {
                transport: 'http',
                url: `http://127.0.0.1:${address.port}/mcp`
            }
        }
    });

    try {
        const tools = await runtime.executeTool('mcp_bridge', { action: 'list_tools', server: 'fixture_http' }, { runId: 'mcp-http-run' });
        assert.equal(tools.details.status, 'completed');
        assert.equal(tools.details.tools[0].tools[0].name, 'echo_http');

        const call = await runtime.executeTool(
            'mcp_bridge',
            { action: 'call_tool', server: 'fixture_http', tool: 'echo_http', args: { text: 'hello' } },
            { runId: 'mcp-http-run' }
        );
        assert.equal(call.details.status, 'completed');
        assert.match(call.content[0].text, /http:hello/);

        const invalidCall = await runtime.executeTool(
            'mcp_bridge',
            { action: 'call_tool', server: 'fixture_http', tool: 'echo_http', args: {} },
            { runId: 'mcp-http-run' }
        );
        assert.equal(invalidCall.isError, true);
        assert.equal(invalidCall.details.status, 'error');
        assert.equal(invalidCall.details.details.status, 'invalid_mcp_tool_args');

        const health = await runtime.executeTool(
            'mcp_bridge',
            { action: 'health_check', server: 'fixture_http', timeoutMs: 2000 },
            { runId: 'mcp-http-run' }
        );
        assert.equal(health.details.status, 'completed');
        assert.equal(health.details.health[0].ok, true);

        const prompts = await runtime.executeTool(
            'mcp_bridge',
            { action: 'list_prompts', server: 'fixture_http' },
            { runId: 'mcp-http-run' }
        );
        assert.equal(prompts.details.prompts[0].prompts[0].name, 'explain');

        const prompt = await runtime.executeTool(
            'mcp_bridge',
            { action: 'get_prompt', server: 'fixture_http', prompt: 'explain' },
            { runId: 'mcp-http-run' }
        );
        assert.match(JSON.stringify(prompt.details.result), /prompt:explain/);

        assert.ok(requests.some((request) => request.method === 'notifications/initialized'));
        assert.ok(requests.some((request) => request.method === 'tools/list' && request.sessionId === 'session-http-fixture'));
    } finally {
        await runtime.shutdown();
        await new Promise((resolve) => server.close(resolve));
    }
});

test('HumanClaw runtime persists MCP server registry to local config', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'humanclaw-mcp-config-'));
    const mcpConfigPath = path.join(workspaceRoot, '.state', 'mcp-servers.json');
    let runtime = new HumanClawRuntime({
        workspaceRoot,
        projectRoot: path.resolve('.'),
        auditDir: path.join(workspaceRoot, '.audit'),
        mcpConfigPath
    });

    try {
        const registered = await runtime.executeTool(
            'mcp_bridge',
            {
                action: 'register_server',
                server: 'persisted_http',
                config: {
                    persisted_http: {
                        transport: 'http',
                        url: 'http://127.0.0.1:9/mcp'
                    }
                }
            },
            { runId: 'mcp-config-run' }
        );
        assert.equal(registered.details.status, 'completed');
        assert.match(await fs.readFile(mcpConfigPath, 'utf8'), /persisted_http/);
    } finally {
        await runtime.shutdown();
    }

    runtime = new HumanClawRuntime({
        workspaceRoot,
        projectRoot: path.resolve('.'),
        auditDir: path.join(workspaceRoot, '.audit2'),
        mcpConfigPath
    });
    try {
        const listed = await runtime.executeTool('mcp_bridge', { action: 'list_servers' }, { runId: 'mcp-config-run-2' });
        assert.equal(listed.details.status, 'completed');
        assert.ok(listed.details.servers.some((server) => server.name === 'persisted_http'));
    } finally {
        await runtime.shutdown();
    }
});

test('HumanClaw runtime subagents execute child runner lifecycle and retain logs', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'humanclaw-subagent-runtime-'));
    const runtime = new HumanClawRuntime({
        workspaceRoot,
        projectRoot: path.resolve('.'),
        auditDir: path.join(workspaceRoot, '.audit'),
        subagentExecutor: async ({ subagent, onEvent }) => {
            await onEvent({
                type: 'subagent.progress',
                status: 'running',
                message: 'reading task'
            });
            return {
                ok: true,
                status: 'completed',
                displayText: `done:${subagent.task}`
            };
        }
    });

    const spawned = await runtime.executeTool(
        'subagents',
        { action: 'spawn', subagentId: 'worker-1', task: 'summarize repo', wait: true, waitTimeoutMs: 2000 },
        { runId: 'subagent-run', sessionId: 'main' }
    );
    assert.equal(spawned.details.subagent.status, 'completed');
    assert.match(spawned.details.subagent.result.displayText, /done:summarize repo/);

    const log = await runtime.executeTool(
        'subagents',
        { action: 'log', subagentId: 'worker-1' },
        { runId: 'subagent-run', sessionId: 'main' }
    );
    assert.equal(log.details.status, 'completed');
    assert.ok(log.details.events.some((event) => event.type === 'subagent.progress'));
    assert.ok(log.details.events.some((event) => event.type === 'subagent.completed'));
});
