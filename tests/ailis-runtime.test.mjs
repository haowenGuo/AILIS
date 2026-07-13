import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { AILISRuntime } = require('../electron/ailis-runtime.cjs');
const { AILISGateway } = require('../electron/ailis-gateway.cjs');
const {
    AgentPath,
    AgentStatus,
    InputQueue,
    InterAgentCommunication,
    SubagentNotification
} = require('../electron/ailis-agent-control.cjs');
const { CompactedItem } = require('../electron/ailis-prompt-model.cjs');
const { ResponseItem } = require('../electron/ailis-response-model.cjs');

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

test('AILIS agent protocol mirrors Codex mailbox and status object shapes', async () => {
    const childPath = new AgentPath('/root/mavuika_guide');
    const status = AgentStatus.Completed('verified answer');
    const notification = new SubagentNotification(childPath, status).render();
    assert.equal(childPath.parent().toString(), '/root');
    assert.match(notification, /^<subagent_notification>/);
    assert.match(notification, /"agent_path":"\/root\/mavuika_guide"/);
    assert.match(notification, /"completed":"verified answer"/);

    const communication = new InterAgentCommunication({
        author: childPath,
        recipient: childPath.parent(),
        content: notification
    });
    const item = communication.to_response_input_item();
    assert.equal(item.role, 'assistant');
    assert.equal(item.phase, 'commentary');
    assert.match(item.content[0].text, /"author":"\/root\/mavuika_guide"/);

    const queue = new InputQueue();
    const context = { runId: 'parent-run', sessionId: 'parent-session' };
    const waiting = queue.subscribe_mailbox(context, 1000);
    queue.enqueue_mailbox_communication(context, communication);
    assert.equal(await waiting, true);
    assert.equal(queue.get_pending_input(context).length, 1);
    assert.equal(queue.get_pending_input(context).length, 0);
});

test('AILIS runtime guards tool results and repairs incomplete transcripts', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-runtime-direct-'));
    const auditDir = path.join(workspaceRoot, '.audit');
    const runtime = new AILISRuntime({
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
    assert.equal(guarded.details.modelVisibleContent.status, 'model_visible_truncated');

    const guardedWorkbenchRead = runtime.guardToolResult(
        {
            content: [{ type: 'text', text: `${'{"row":1}\n'.repeat(2000)}`, originalTextChars: 18000 }],
            details: {
                status: 'completed',
                action: 'read',
                path: path.join(workspaceRoot, '.ailis-state', 'workbench', 'run-map', 'inputs', 'matrixRows.json'),
                bytesRead: 18000,
                size: 18000,
                truncated: false
            }
        },
        { toolId: 'read', callId: 'guard-workbench-read', maxTextChars: 512 }
    );
    assert.equal(guardedWorkbenchRead.content[0].modelVisibleTruncated, true);
    assert.match(guardedWorkbenchRead.content[0].text, /MODEL_VISIBLE_CONTENT_TRUNCATED/);
    assert.match(guardedWorkbenchRead.content[0].text, /truncationScope=model_visible_tool_result_text/);
    assert.equal(guardedWorkbenchRead.details.modelVisibleContent.fullFileReadTruncated, false);
    assert.equal(
        guardedWorkbenchRead.details.modelVisibleContent.semantics.contentTruncatedMeansModelVisibleProjectionTruncation,
        true
    );

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

test('AILIS runtime persists ContextCompaction rollout items and reference context', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-runtime-compaction-'));
    const auditDir = path.join(workspaceRoot, '.audit');
    const runtime = new AILISRuntime({
        workspaceRoot,
        projectRoot: path.resolve('.'),
        auditDir
    });
    const runId = 'runtime-compaction-run';
    const sessionId = 'runtime-compaction';
    const replacementHistory = [
        ResponseItem.message({ role: 'user', text: 'current task summary' }),
        ResponseItem.message({ role: 'assistant', text: 'Known fact: START=A1.' })
    ];
    const compactedItem = CompactedItem.create({
        message: 'Compacted task state.',
        replacement_history: replacementHistory
    });

    await runtime.startRun({
        runId,
        sessionId,
        message: 'compact this run',
        planner: 'test'
    });
    const written = await runtime.appendContextCompaction(runId, {
        sessionId,
        compactedItem,
        referenceContextItem: {
            cwd: workspaceRoot,
            model: 'test-model'
        },
        contextManagerCheckpoint: {
            history_version: 1,
            items: replacementHistory
        },
        reason: 'test_compaction'
    });

    assert.equal(written.length, 2);

    const transcript = await runtime.readTranscript(runId);
    const compaction = transcript.items.find((item) => item.type === 'agent.context_compaction');
    const turnContext = transcript.items.find((item) => item.type === 'agent.turn_context');

    assert.equal(compaction.status, 'installed');
    assert.equal(compaction.payload.rollout_item.type, 'compacted');
    assert.deepEqual(compaction.payload.compacted_item.replacement_history, replacementHistory);
    assert.equal(compaction.payload.context_manager_checkpoint.history_version, 1);
    assert.equal(turnContext.status, 'captured');
    assert.equal(turnContext.payload.rollout_item.type, 'turn_context');
    assert.equal(turnContext.payload.reference_context_item.model, 'test-model');
});

test('AILIS Gateway exposes runtime tools, update_plan, policy checks, and transcripts', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-runtime-gateway-'));
    const gateway = new AILISGateway({
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
        assert.ok(tools.body.coreTools.some((tool) => tool.id === 'update_plan' && tool.route === 'ailis-runtime'));

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
        assert.equal(plan.body.result.details.completion_scope, 'progress_recorded_only');
        assert.equal(plan.body.result.details.semantic_role, 'progress_ui_only');
        assert.equal(plan.body.result.details.produces_evidence, false);
        assert.equal(plan.body.result.details.task_advanced, false);
        assert.match(plan.body.result.content[0].text, /did not inspect files/);
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

test('AILIS runtime can call a real stdio MCP server and read resources', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-mcp-runtime-'));
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
    send({ id: request.id, result: { tools: [{ name: 'echo', description: 'Echo input text', inputSchema: { type: 'object', required: ['text'], additionalProperties: false, properties: { text: { type: 'string' } } } }] } });
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
    const runtime = new AILISRuntime({
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

test('AILIS runtime can call a basic HTTP MCP server', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-http-mcp-runtime-'));
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
    const runtime = new AILISRuntime({
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

test('AILIS runtime persists MCP server registry to local config', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-mcp-config-'));
    const mcpConfigPath = path.join(workspaceRoot, '.state', 'mcp-servers.json');
    let runtime = new AILISRuntime({
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

    runtime = new AILISRuntime({
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

test('AILIS Codex-style Agent tree delivers completion through the session mailbox', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-agent-tree-runtime-'));
    const childContexts = [];
    const runtime = new AILISRuntime({
        workspaceRoot,
        projectRoot: path.resolve('.'),
        auditDir: path.join(workspaceRoot, '.audit'),
        agentExecutor: async ({ agent, context }) => {
            childContexts.push(context);
            await new Promise((resolve) => setTimeout(resolve, 20));
            return {
                ok: true,
                status: 'completed',
                displayText: `answer:${agent.task}`,
                taskRunHandoff: {
                    status: 'completed',
                    resume: {
                        contextManagerCheckpoint: {
                            history_version: 2,
                            items: []
                        }
                    }
                }
            };
        }
    });
    const context = {
        runId: 'parent-run',
        sessionId: 'session-a',
        agent_path: '/root',
        attachments: [{
            type: 'file',
            name: 'input.xlsx',
            path: path.join(workspaceRoot, '.ailis-runtime', 'attachments', 'input.xlsx')
        }],
        parentUserGoal: 'calculate the complete workbook total',
        forked_context_checkpoint: {
            history_version: 2,
            items: [{ type: 'message', role: 'user', content: [{ type: 'input_text', text: 'original request' }] }]
        }
    };

    const spawned = await runtime.executeTool('spawn_agent', {
        task_name: 'guide',
        message: 'Research the guide.',
        fork_turns: 'all'
    }, context);
    assert.equal(spawned.structuredContent.task_name, '/root/guide');

    const waited = await runtime.executeTool('wait_agent', { timeout_ms: 1000 }, context);
    assert.equal(waited.structuredContent.timed_out, false);
    const mailbox = runtime.drain_mailbox_input_items({ sessionId: 'session-a', runId: 'a-different-run' });
    assert.equal(mailbox.length, 1);
    assert.match(JSON.stringify(mailbox), /answer:Research the guide/);
    assert.equal(childContexts.length, 1);
    assert.equal(childContexts[0].taskAgentInheritanceMode, 'checkpoint');
    assert.deepEqual(childContexts[0].initialContextManagerCheckpoint, context.forked_context_checkpoint);
    assert.deepEqual(childContexts[0].attachments, context.attachments);
    assert.equal(childContexts[0].parentUserGoal, context.parentUserGoal);
    await runtime.shutdown();
});

test('AILIS Agent tree queues followup input into a running thread', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-agent-input-runtime-'));
    const runtime = new AILISRuntime({
        workspaceRoot,
        projectRoot: path.resolve('.'),
        auditDir: path.join(workspaceRoot, '.audit'),
        agentExecutor: async ({ registerInputHandler }) => await new Promise((resolve) => {
            registerInputHandler((message) => resolve({
                ok: true,
                status: 'completed',
                displayText: `received:${message}`
            }));
        })
    });
    const context = { runId: 'parent-input', sessionId: 'session-input', agent_path: '/root' };
    await runtime.executeTool('spawn_agent', {
        task_name: 'worker',
        message: 'initial',
        fork_turns: 'none'
    }, context);
    await runtime.executeTool('followup_task', {
        target: 'worker',
        message: 'corrected input'
    }, context);
    await runtime.executeTool('wait_agent', { timeout_ms: 1000 }, context);
    assert.match(JSON.stringify(runtime.drain_mailbox_input_items(context)), /received:corrected input/);
    await runtime.shutdown();
});

test('AILIS Agent tree resumes a completed thread from its checkpoint', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-agent-resume-runtime-'));
    const contexts = [];
    const checkpoint = {
        history_version: 2,
        items: [{ type: 'message', role: 'user', content: [{ type: 'input_text', text: 'checkpoint' }] }]
    };
    const runtime = new AILISRuntime({
        workspaceRoot,
        projectRoot: path.resolve('.'),
        auditDir: path.join(workspaceRoot, '.audit'),
        agentExecutor: async ({ agent, context }) => {
            contexts.push(context);
            return {
                ok: true,
                status: 'completed',
                displayText: agent.task,
                taskRunHandoff: { status: 'completed', resume: { contextManagerCheckpoint: checkpoint } }
            };
        }
    });
    const context = { runId: 'parent-resume', sessionId: 'session-resume', agent_path: '/root' };
    await runtime.executeTool('spawn_agent', {
        task_name: 'worker',
        message: 'first',
        fork_turns: 'none'
    }, context);
    await runtime.executeTool('wait_agent', { timeout_ms: 1000 }, context);
    runtime.drain_mailbox_input_items(context);
    const stableId = runtime.agent_control.state.list(context)[0].id;

    await runtime.executeTool('followup_task', { target: 'worker', message: 'second' }, context);
    await runtime.executeTool('wait_agent', { timeout_ms: 1000 }, context);
    assert.equal(contexts.length, 2);
    assert.equal(runtime.agent_control.state.list(context)[0].id, stableId);
    assert.equal(contexts[1].taskAgentInheritanceMode, 'checkpoint');
    assert.deepEqual(contexts[1].initialContextManagerCheckpoint, checkpoint);
    await runtime.shutdown();
});

test('Persona parent run converts duplicate spawn into followup on the persistent TaskAgent', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-persona-agent-owner-'));
    const tasks = [];
    const runtime = new AILISRuntime({
        workspaceRoot,
        projectRoot: path.resolve('.'),
        auditDir: path.join(workspaceRoot, '.audit'),
        agentExecutor: async ({ agent }) => {
            tasks.push(agent.task);
            return { ok: true, status: 'completed', displayText: `answer:${agent.task}` };
        }
    });
    const context = {
        runId: 'persona-parent-run',
        sessionId: 'persona-owner-session',
        agent_path: '/root',
        agentRole: 'persona_orchestrator'
    };
    await runtime.executeTool('spawn_agent', {
        task_name: 'guide',
        message: 'research the guide',
        fork_turns: 'none'
    }, context);
    await runtime.executeTool('wait_agent', { timeout_ms: 1000 }, context);
    runtime.drain_mailbox_input_items(context);

    const duplicate = await runtime.executeTool('spawn_agent', {
        task_name: 'guide_supplement',
        message: 'search for missing guide details',
        fork_turns: 'none'
    }, context);

    assert.equal(duplicate.isError, false);
    assert.equal(duplicate.structuredContent.status, 'followup_queued');
    assert.equal(duplicate.structuredContent.task_name, '/root/guide');
    assert.equal(duplicate.structuredContent.continued, true);
    assert.equal(duplicate.structuredContent.result_available, true);
    await runtime.executeTool('wait_agent', { timeout_ms: 1000 }, context);
    assert.equal(runtime.agent_control.state.list(context).length, 1);
    assert.deepEqual(tasks, ['research the guide', 'search for missing guide details']);
    await runtime.shutdown();
});

test('Subagent notification carries a source-only Persona evidence boundary', () => {
    const rendered = new SubagentNotification(
        '/root/research',
        AgentStatus.Completed('supported answer'),
        {
            final_answer: 'supported answer',
            source_refs: [{ url: 'https://example.test/source' }],
            evidence_boundary: {
                mode: 'source_only',
                may_add_facts: false
            }
        }
    ).render();
    assert.match(rendered, /"final_answer":"supported answer"/);
    assert.match(rendered, /"mode":"source_only"/);
    assert.match(rendered, /"may_add_facts":false/);
});

test('AILIS Agent trees are session scoped and enforce one live direct child', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-agent-isolation-runtime-'));
    let release;
    const gate = new Promise((resolve) => {
        release = resolve;
    });
    const runtime = new AILISRuntime({
        workspaceRoot,
        projectRoot: path.resolve('.'),
        auditDir: path.join(workspaceRoot, '.audit'),
        agentExecutor: async ({ agent }) => {
            await gate;
            return { ok: true, status: 'completed', displayText: agent.task };
        }
    });
    const sessionA = { runId: 'run-a', sessionId: 'session-a', agent_path: '/root' };
    const sessionB = { runId: 'run-b', sessionId: 'session-b', agent_path: '/root' };
    await runtime.executeTool('spawn_agent', { task_name: 'one', message: 'one', fork_turns: 'none' }, sessionA);
    const duplicate = await runtime.executeTool('spawn_agent', { task_name: 'two', message: 'two', fork_turns: 'none' }, sessionA);
    assert.equal(duplicate.isError, true);
    assert.equal(duplicate.structuredContent.status, 'agent_thread_limit_reached');
    await runtime.executeTool('spawn_agent', { task_name: 'one', message: 'other session', fork_turns: 'none' }, sessionB);
    assert.deepEqual(runtime.agent_control.list_agents({}, sessionA).agents.map((entry) => entry.agent_name), ['/root/one']);
    assert.deepEqual(runtime.agent_control.list_agents({}, sessionB).agents.map((entry) => entry.agent_name), ['/root/one']);
    release();
    await Promise.all([
        runtime.agent_control.await_live_children(sessionA, 1000),
        runtime.agent_control.await_live_children(sessionB, 1000)
    ]);
    await runtime.shutdown();
});

test('AILIS Agent failures remain Errored and preserve a parent handoff', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-agent-error-runtime-'));
    const runtime = new AILISRuntime({
        workspaceRoot,
        projectRoot: path.resolve('.'),
        auditDir: path.join(workspaceRoot, '.audit'),
        agentExecutor: async () => {
            throw new Error('fixture provider failure');
        }
    });
    const context = { runId: 'parent-error', sessionId: 'session-error', agent_path: '/root' };
    await runtime.executeTool('spawn_agent', {
        task_name: 'worker',
        message: 'solve task',
        fork_turns: 'none'
    }, context);
    await runtime.executeTool('wait_agent', { timeout_ms: 1000 }, context);
    const listed = runtime.agent_control.list_agents({}, context).agents;
    assert.equal(listed.length, 1);
    assert.deepEqual(listed[0].agent_status, { errored: 'fixture provider failure' });
    assert.match(JSON.stringify(runtime.drain_mailbox_input_items(context)), /fixture provider failure/);
    const agent = runtime.agent_control.state.list(context)[0];
    assert.equal(agent.result.taskRunHandoff.status, 'failed');
    await runtime.shutdown();
});
test('AILIS runtime exposes self_evolution as a conversation-driven agent tool', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-self-evolution-tool-'));
    const runtime = new AILISRuntime({
        workspaceRoot,
        projectRoot: path.resolve('.'),
        auditDir: path.join(workspaceRoot, '.audit')
    });
    const proposal = {
        id: 'proposal-preference-1',
        type: 'preference_consolidation',
        title: '沉淀新的用户偏好',
        status: 'proposed',
        risk: 'low',
        riskLabel: '低风险',
        summary: '用户希望 AILIS 通过对话学习偏好，而不是进入控制面板。',
        evidence: [{ type: 'memory_event', preview: '不要放控制面板' }],
        target: { kind: 'memory_block', key: 'user' },
        recommendedAction: 'approve_and_apply'
    };

    runtime.setSelfEvolutionRuntime({
        getStatus: () => ({ enabled: true, loaded: true, proposalCount: 1 }),
        ensureLoaded: async () => ({}),
        analyze: async (args = {}) => ({
            ok: true,
            status: 'completed',
            summary: {
                headline: `发现 1 个可处理的自我进化提案：${args.taskText}`
            },
            proposals: [proposal]
        }),
        listProposals: async () => ({
            ok: true,
            status: 'completed',
            proposals: [proposal]
        }),
        getProposal: async (id) => id === proposal.id ? proposal : null,
        markProposal: async (args = {}) => ({
            ok: true,
            status: 'completed',
            proposal: { ...proposal, status: args.status }
        }),
        applyProposal: async () => ({
            ok: false,
            status: 'needs_approval',
            proposal,
            approvalText: 'Apply self-evolution proposal?'
        })
    });

    try {
        assert.equal(runtime.canExecuteTool('self_evolution'), true);
        assert.ok(runtime.getStatus().capabilities.includes('self_evolution_loop'));
        assert.ok(runtime.getRuntimeToolDefinitions().some((tool) => tool.id === 'self_evolution'));

        const analyzed = await runtime.executeTool('self_evolution', {
            action: 'analyze',
            taskText: '优化 AILIS 自己'
        });
        assert.equal(analyzed.details.status, 'completed');
        assert.match(analyzed.content[0].text, /发现 1 个可处理的自我进化提案/);
        assert.match(analyzed.content[0].text, /沉淀新的用户偏好/);
        assert.match(analyzed.content[0].text, /不是进入控制面板/);

        const classification = runtime.classifyToolCall({
            toolId: 'self_evolution',
            args: { action: 'apply_proposal' }
        });
        assert.equal(classification.class, 'self_evolution');
        assert.equal(classification.mutates, true);
        assert.equal(classification.requiresApprovalCapable, true);

        const apply = await runtime.executeTool('self_evolution', {
            action: 'apply_proposal',
            id: proposal.id
        });
        assert.equal(apply.details.status, 'needs_approval');
        assert.match(apply.content[0].text, /需要用户确认/);
    } finally {
        await runtime.shutdown();
    }
});
