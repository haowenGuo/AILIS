import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
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

async function withHttpServer(handler) {
    const server = http.createServer(handler);
    await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
    const address = server.address();
    const baseUrl = `http://127.0.0.1:${address.port}`;
    return {
        baseUrl,
        close: () => new Promise((resolve, reject) => {
            server.close((error) => error ? reject(error) : resolve());
        })
    };
}

test('HumanClaw Gateway exposes health, tools, guarded tool calls, and audit', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'humanclaw-gateway-test-'));
    const gateway = new HumanClawGateway({
        port: 0,
        workspaceRoot,
        projectRoot: path.resolve('.'),
        auditDir: path.join(workspaceRoot, '.audit')
    });

    try {
        const status = await gateway.start();
        assert.equal(status.running, true);
        const baseUrl = status.url;

        const health = await jsonFetch(`${baseUrl}/health`);
        assert.equal(health.response.status, 200);
        assert.equal(health.body.ok, true);
        assert.equal(health.body.status.running, true);

        const tools = await jsonFetch(`${baseUrl}/tools`);
        assert.equal(tools.body.ok, true);
        assert.ok(tools.body.coreTools.some((tool) => tool.id === 'read'));
        assert.ok(tools.body.coreTools.some((tool) => tool.id === 'exec' && tool.needsApproval));
        assert.ok(tools.body.runtimeTools.some((tool) => tool.id === 'tool_search' && tool.spec));
        assert.ok(tools.body.localTools.some((tool) => tool.id === 'computer' && tool.spec));
        assert.equal(tools.body.localTools.some((tool) => tool.id === 'read'), false);
        assert.equal(tools.body.gateway.toolRuntime.model, 'codex_like_gateway_tool_registry');

        const searchTools = await jsonFetch(`${baseUrl}/tools/call`, {
            method: 'POST',
            body: JSON.stringify({
                tool: 'tool_search',
                args: { query: 'computer file write', includeMcp: false, limit: 5 },
                context: { workspace: workspaceRoot }
            })
        });
        assert.equal(searchTools.body.ok, true, searchTools.body.error);
        assert.match(JSON.stringify(searchTools.body.result), /computer/);

        const write = await jsonFetch(`${baseUrl}/tools/call`, {
            method: 'POST',
            body: JSON.stringify({
                tool: 'write',
                args: { path: 'note.txt', content: 'hello gateway\n' },
                context: { workspace: workspaceRoot }
            })
        });
        assert.equal(write.body.ok, true, write.body.error);
        assert.equal(write.body.status, 'completed');

        const read = await jsonFetch(`${baseUrl}/tools/call`, {
            method: 'POST',
            body: JSON.stringify({
                tool: 'read',
                args: { path: 'note.txt' },
                context: { workspace: workspaceRoot }
            })
        });
        assert.equal(read.body.ok, true, read.body.error);
        assert.match(JSON.stringify(read.body.result), /hello gateway/);

        const blocked = await jsonFetch(`${baseUrl}/tools/call`, {
            method: 'POST',
            body: JSON.stringify({
                tool: 'read',
                args: { path: '../outside.txt' },
                context: { workspace: workspaceRoot }
            })
        });
        assert.equal(blocked.body.ok, false);
        assert.equal(blocked.body.status, 'blocked');

        const approval = await jsonFetch(`${baseUrl}/tools/call`, {
            method: 'POST',
            body: JSON.stringify({
                tool: 'exec',
                args: { command: 'node -e "console.log(1)"' },
                context: { workspace: workspaceRoot }
            })
        });
        assert.equal(approval.body.ok, false);
        assert.equal(approval.body.status, 'needs_approval');

        const exec = await jsonFetch(`${baseUrl}/tools/call`, {
            method: 'POST',
            body: JSON.stringify({
                tool: 'exec',
                args: { command: 'node -e "console.log(\'GATEWAY_EXEC_OK\')"', timeout: 8 },
                context: { workspace: workspaceRoot, approved: true }
            })
        });
        assert.equal(exec.body.ok, true, exec.body.error);
        assert.match(JSON.stringify(exec.body.result), /GATEWAY_EXEC_OK/);

        const audit = await jsonFetch(`${baseUrl}/audit?limit=10`);
        assert.equal(audit.body.ok, true);
        assert.ok(audit.body.entries.length >= 4);
    } finally {
        await gateway.stop();
    }
});

test('HumanClaw Gateway default context can enable full computer control', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'humanclaw-full-control-test-'));
    const gateway = new HumanClawGateway({
        port: 0,
        workspaceRoot,
        projectRoot: path.resolve('.'),
        auditDir: path.join(workspaceRoot, '.audit'),
        defaultContext: {
            computerControlEnabled: true,
            permissionProfile: 'danger-full-access',
            approvalPolicy: 'auto',
            confirmationPolicy: 'auto',
            approved: true,
            autoConfirm: true,
            allowComputerWideAccess: true,
            allowSystemMutation: true
        }
    });

    try {
        const status = await gateway.start();
        assert.equal(status.defaultContext.computerControlEnabled, true);
        assert.equal(status.defaultContext.permissionProfile, 'danger-full-access');
        const baseUrl = status.url;

        const write = await jsonFetch(`${baseUrl}/tools/call`, {
            method: 'POST',
            body: JSON.stringify({
                tool: 'computer',
                args: { action: 'write', path: 'full-control.txt', content: 'enabled\n' },
                context: { workspace: workspaceRoot }
            })
        });
        assert.equal(write.body.ok, true, write.body.error);
        assert.equal(write.body.status, 'completed');

        const exec = await jsonFetch(`${baseUrl}/tools/call`, {
            method: 'POST',
            body: JSON.stringify({
                tool: 'exec',
                args: { command: 'node -e "console.log(\'FULL_CONTROL_EXEC_OK\')"', timeout: 8 },
                context: { workspace: workspaceRoot }
            })
        });
        assert.equal(exec.body.ok, true, exec.body.error);
        assert.match(JSON.stringify(exec.body.result), /FULL_CONTROL_EXEC_OK/);

        const readBack = await fs.readFile(path.join(workspaceRoot, 'full-control.txt'), 'utf8');
        assert.match(readBack, /enabled/);
    } finally {
        await gateway.stop();
    }
});

test('HumanClaw Gateway tool_search surfaces and executes external virtual direct tools', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'humanclaw-external-direct-test-'));
    const api = await withHttpServer((req, res) => {
        const url = new URL(req.url, 'http://127.0.0.1');
        res.setHeader('content-type', 'application/json');
        res.end(JSON.stringify({
            pathname: url.pathname,
            actualEnrollment: 90
        }));
    });
    const gateway = new HumanClawGateway({
        port: 0,
        workspaceRoot,
        projectRoot: path.resolve('.'),
        auditDir: path.join(workspaceRoot, '.audit')
    });

    try {
        const status = await gateway.start();
        const baseUrl = status.url;
        await gateway.runtime.capabilityManager.bulkExposeExternalTools({
            includeMcpRegistry: false,
            includeInstalledMcp: false,
            trustCallable: true,
            enableOpenApiAdapter: true,
            sourceName: 'clinicaltrials',
            openapiOperations: [
                {
                    operationId: 'clinicalTrialsGetStudy',
                    method: 'get',
                    path: '/api/v2/studies/{nctId}',
                    baseUrl: api.baseUrl,
                    summary: 'Get ClinicalTrials.gov enrollment by NCT id.',
                    parameters: [
                        { name: 'nctId', in: 'path', required: true, schema: { type: 'string' }, description: 'NCT id.' }
                    ],
                    whenToUse: ['Use for structured ClinicalTrials.gov enrollment lookup.'],
                    whenNotToUse: ['Do not use for broad web search.'],
                    preconditions: ['NCT id is known.'],
                    examples: [{ nctId: 'NCT03411733' }],
                    badExamples: [{}],
                    alternatives: ['Use web_fetch if API is unavailable.'],
                    errors: { not_found: { recoverable: false } },
                    permissions: ['clinicaltrials.read']
                }
            ]
        });

        const search = await jsonFetch(`${baseUrl}/tools/call`, {
            method: 'POST',
            body: JSON.stringify({
                tool: 'tool_search',
                args: { query: 'ClinicalTrials enrollment NCT API', includeMcp: false, limit: 5 },
                context: { workspace: workspaceRoot }
            })
        });
        assert.equal(search.body.ok, true, search.body.error);
        assert.match(JSON.stringify(search.body.result), /external__clinicaltrials__get_study/);

        const direct = await jsonFetch(`${baseUrl}/tools/call`, {
            method: 'POST',
            body: JSON.stringify({
                tool: 'external__clinicaltrials__get_study',
                args: { nctId: 'NCT03411733' },
                context: { workspace: workspaceRoot }
            })
        });
        assert.equal(direct.body.ok, true, direct.body.error);
        assert.equal(direct.body.status, 'completed');
        assert.match(JSON.stringify(direct.body.result), /actualEnrollment/);
        assert.match(JSON.stringify(direct.body.result), /90/);
    } finally {
        await gateway.stop();
        await api.close();
    }
});

test('HumanClaw Gateway event stream keeps cursor-addressable replay history', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'humanclaw-events-test-'));
    const gateway = new HumanClawGateway({
        port: 0,
        workspaceRoot,
        projectRoot: path.resolve('.'),
        auditDir: path.join(workspaceRoot, '.audit'),
        eventLogLimit: 20
    });

    try {
        const status = await gateway.start();
        const baseUrl = status.url;
        const firstSeq = gateway.eventSeq;
        gateway.emitGatewayEvent('agent.step.started', { marker: 'one' });
        const cursor = gateway.eventSeq;
        gateway.emitGatewayEvent('agent.step.finished', { marker: 'two' });

        const recent = await jsonFetch(`${baseUrl}/events/recent?cursor=${cursor}`);
        assert.equal(recent.body.ok, true);
        assert.ok(recent.body.events.every((event) => event.seq > cursor));
        assert.ok(recent.body.events.some((event) => event.type === 'agent.step.finished'));

        const allRecent = await jsonFetch(`${baseUrl}/events/recent?cursor=${firstSeq}`);
        assert.ok(allRecent.body.events.some((event) => event.type === 'agent.step.started'));
        assert.ok(allRecent.body.events.some((event) => event.delivery === 'lossless'));
        assert.equal(gateway.getStatus().events.buffered >= 2, true);
    } finally {
        await gateway.stop();
    }
});

test('HumanClaw Gateway builds agent analysis snapshots from transcript, audit, and events', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'humanclaw-analysis-test-'));
    const gateway = new HumanClawGateway({
        port: 0,
        workspaceRoot,
        projectRoot: path.resolve('.'),
        auditDir: path.join(workspaceRoot, '.audit'),
        eventLogLimit: 50
    });
    const runId = 'analysis-run-1';
    const sessionId = 'analysis-session';

    try {
        const status = await gateway.start();
        await gateway.runtime.startRun({
            runId,
            sessionId,
            message: 'debug this agent loop',
            planner: 'llm-agentic-executor',
            mode: 'task',
            intent: 'llm_agent'
        });
        await gateway.runtime.appendItem(runId, {
            sessionId,
            type: 'agent.context_snapshot',
            status: 'captured',
            payload: {
                iteration: 0,
                promptBudget: {
                    model: 'aigl_prompt_budget',
                    total_chars: 321,
                    approx_input_tokens: 123
                },
                messages: [
                    { role: 'system', content: 'system context' },
                    { role: 'user', content: 'debug this agent loop' }
                ]
            }
        });
        await gateway.runtime.appendItem(runId, {
            sessionId,
            type: 'agent.llm_call',
            status: 'completed',
            payload: {
                iteration: 0,
                callId: `${runId}:agent_decision:0`,
                provider: 'openai-compatible',
                model: 'test-model',
                durationMs: 44,
                ok: true,
                status: 'tool',
                action: 'tool',
                usage: {
                    promptTokens: 100,
                    completionTokens: 20,
                    totalTokens: 120
                }
            }
        });
        await gateway.runtime.appendItem(runId, {
            sessionId,
            type: 'agent.decision',
            status: 'tool',
            payload: {
                iteration: 0,
                ok: true,
                action: 'tool',
                intent: 'inspect_file',
                summary: 'Read the target file.',
                publicReasoning: 'Need one observation.',
                toolCall: {
                    id: 'step-1',
                    title: 'Read note',
                    tool: 'read',
                    args: { path: 'note.txt' }
                }
            }
        });
        await gateway.runtime.appendItem(runId, {
            sessionId,
            type: 'tool.call',
            status: 'started',
            payload: {
                callId: 'call-read-1',
                tool: 'read',
                args: { path: 'note.txt' },
                context: { iteration: 0 }
            }
        });
        await gateway.runtime.appendItem(runId, {
            sessionId,
            type: 'tool.result',
            status: 'completed',
            payload: {
                callId: 'call-read-1',
                tool: 'read',
                ok: true,
                status: 'completed',
                durationMs: 17,
                result: {
                    content: [{ type: 'text', text: 'file contents' }]
                }
            }
        });
        await gateway.runtime.completeRun(runId, {
            ok: true,
            status: 'completed',
            mode: 'task',
            planner: 'llm-agentic-executor',
            intent: 'inspect_file',
            durationMs: 88,
            displayText: 'done'
        });
        await gateway.appendAudit({
            runId,
            type: 'agent.run',
            status: 'completed',
            ok: true,
            durationMs: 88,
            mode: 'task',
            planner: 'llm-agentic-executor',
            intent: 'inspect_file',
            args: {
                message: 'debug this agent loop',
                sessionId
            },
            resultPreview: 'done'
        });
        gateway.emitGatewayEvent('agent.llm_call.completed', {
            runId,
            sessionId,
            iteration: 0,
            durationMs: 44,
            status: 'tool'
        });
        await gateway.runtime.appendItem(runId, {
            sessionId,
            type: 'agent.debug.paused',
            status: 'debug_paused',
            payload: {
                iteration: 0,
                nextIteration: 1,
                debugSessionId: 'debug-session-1',
                reason: 'tool_completed'
            }
        });

        const analysis = await gateway.analyzeAgentRun(runId);
        assert.equal(analysis.ok, true);
        assert.equal(analysis.summary.rounds, 1);
        assert.equal(analysis.summary.llmCalls, 1);
        assert.equal(analysis.summary.toolCalls, 1);
        assert.equal(analysis.summary.usage.totalTokens, 120);
        assert.equal(analysis.rounds[0].messages[1].content, 'debug this agent loop');
        assert.equal(analysis.toolCalls[0].durationMs, 17);
        assert.match(analysis.summary.primaryBottleneck, /LLM|read|上下文/);
        assert.equal(analysis.summary.debugPaused, true);
        assert.equal(analysis.summary.debugSessionId, 'debug-session-1');
        assert.equal(analysis.summary.nextIteration, 1);

        const runs = await gateway.listAgentAnalysisRuns(5);
        assert.equal(runs.ok, true);
        assert.ok(runs.runs.some((run) => run.runId === runId));
        assert.ok(runs.runs.some((run) => run.runId === runId && run.debugPaused));

        const viaHttp = await jsonFetch(`${status.url}/agent/analysis?runId=${runId}`);
        assert.equal(viaHttp.body.ok, true);
        assert.equal(viaHttp.body.runId, runId);

        const listViaHttp = await jsonFetch(`${status.url}/agent/analysis/runs?limit=5`);
        assert.equal(listViaHttp.body.ok, true);
        assert.ok(listViaHttp.body.runs.some((run) => run.runId === runId));
    } finally {
        await gateway.stop();
    }
});
