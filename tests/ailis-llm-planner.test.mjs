import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { AILISGateway } = require('../electron/ailis-gateway.cjs');
const { AILISPlatformAdapter } = require('../electron/ailis-platform-adapter.cjs');
const {
    resolveAgentDecisionTimeoutMs,
    resolveAgentPromptProfile
} = require('../electron/ailis-agent-runner.cjs');
const { buildObservationLedgerPromptObject } = require('../electron/ailis-turn-items.cjs');

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

async function runAgent(baseUrl, payload) {
    return await jsonFetch(`${baseUrl}/agent/run`, {
        method: 'POST',
        body: JSON.stringify(payload)
    });
}

function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function decisionObjectToChatMessage(decision, callId = 'mock-tool-call') {
    if (!decision || typeof decision !== 'object' || Array.isArray(decision)) {
        return { content: typeof decision === 'string' ? decision : JSON.stringify(decision) };
    }
    if (decision.action === 'tool' && decision.tool_call?.tool) {
        return {
            content: decision.public_reasoning || decision.summary || '',
            tool_calls: [
                {
                    id: callId,
                    type: 'function',
                    function: {
                        name: decision.tool_call.tool,
                        arguments: JSON.stringify(decision.tool_call.args || {})
                    }
                }
            ]
        };
    }
    if (decision.action === 'load_context') {
        const request = decision.capability_request || {};
        const query = [
            ...(Array.isArray(request.skills) ? request.skills : []),
            ...(Array.isArray(request.tools) ? request.tools : []),
            ...(Array.isArray(request.mcp) ? request.mcp : []),
            request.reason || decision.summary || decision.intent || 'capability context'
        ].filter(Boolean).join(' ');
        return {
            content: decision.public_reasoning || decision.summary || '',
            tool_calls: [
                {
                    id: callId,
                    type: 'function',
                    function: {
                        name: 'tool_search',
                        arguments: JSON.stringify({
                            query,
                            limit: 8
                        })
                    }
                }
            ]
        };
    }
    if (decision.action === 'blocked') {
        return { content: decision.blocked_reason || decision.final_answer || decision.summary || '' };
    }
    if (decision.action === 'final') {
        return { content: decision.final_answer || decision.answer || decision.response || decision.summary || '' };
    }
    return { content: JSON.stringify(decision) };
}

function parseModelContextPayload(call) {
    const messages = call?.payload?.messages || [];
    for (const message of messages.filter((entry) => entry.role === 'user')) {
        try {
            const parsed = JSON.parse(message.content);
            if (parsed?.type === 'context') {
                return parsed;
            }
        } catch {
            // Ignore non-JSON user goal messages.
        }
    }
    return {};
}

async function waitFor(predicate, { timeoutMs = 2000, intervalMs = 25 } = {}) {
    const startedAt = Date.now();
    while (Date.now() - startedAt < timeoutMs) {
        if (await predicate()) {
            return true;
        }
        await delay(intervalMs);
    }
    return false;
}

test('Agent turn items mark successful web fetches with structured API evidence gaps', () => {
    const turnItems = buildObservationLedgerPromptObject({
        stepResults: [
            {
                id: 'clinical-web-fetch',
                title: 'Fetch ClinicalTrials page',
                tool: 'mcp__ailis_research__web_fetch',
                args: {
                    url: 'https://clinicaltrials.gov/study/NCT03411733',
                    extract_content: true
                },
                response: {
                    ok: true,
                    status: 'completed',
                    result: {
                        content: [
                            {
                                type: 'text',
                                text: 'ClinicalTrials.gov Study NCT03411733 Prevalence of H.Pylori in Patients With Acne Vulgaris'
                            }
                        ]
                    }
                }
            }
        ]
    });
    assert.equal(turnItems.latest_observation.evidence_gap, 'structured_api_preferred');
    assert.match(turnItems.latest_observation.preview, /ClinicalTrials\.gov|structured ClinicalTrials/);
    assert.match(JSON.stringify(turnItems.items), /structured_api_preferred|ClinicalTrials\.gov/);
});

test('Agent prompt profile uses compact budgets for Ollama without changing cloud providers', () => {
    const ollamaProfile = resolveAgentPromptProfile({ provider: 'ollama' });
    assert.equal(ollamaProfile.id, 'local_compact');
    assert.equal(ollamaProfile.compact, true);
    assert.ok(ollamaProfile.memoryChars < 5000);
    assert.ok(ollamaProfile.externalToolExposureLimit < 16);

    const cloudProfile = resolveAgentPromptProfile({ provider: 'openai-compatible' });
    assert.equal(cloudProfile.id, 'full');
    assert.equal(cloudProfile.compact, false);
    assert.ok(cloudProfile.memoryChars >= 20000);

    const exactAnswerProfile = resolveAgentPromptProfile(
        { provider: 'openai-compatible' },
        { exactAnswerMode: true }
    );
    assert.equal(exactAnswerProfile.id, 'local_compact');
    assert.equal(exactAnswerProfile.compact, true);
    assert.equal(exactAnswerProfile.reason, 'exact_answer_task');

    const artifactQuestionProfile = resolveAgentPromptProfile(
        { provider: 'openai-compatible' },
        { taskCompactPrompt: true }
    );
    assert.equal(artifactQuestionProfile.id, 'local_compact');
    assert.equal(artifactQuestionProfile.compact, true);
    assert.equal(artifactQuestionProfile.reason, 'artifact_answer_task');

    const explicitFullProfile = resolveAgentPromptProfile(
        { provider: 'openai-compatible' },
        { taskCompactPrompt: true, exactAnswerMode: true, agentPromptProfile: 'full' }
    );
    assert.equal(explicitFullProfile.id, 'full');
    assert.equal(explicitFullProfile.compact, false);
});

async function createMockChatCompletionsServer() {
    const calls = [];
    let agentDecisionCount = 0;
    const server = http.createServer(async (req, res) => {
        let raw = '';
        req.on('data', (chunk) => {
            raw += chunk;
        });
        req.on('end', () => {
            const payload = raw ? JSON.parse(raw) : {};
            const messages = payload.messages || [];
            const system = messages.find((message) => message.role === 'system')?.content || '';
            calls.push({ url: req.url, system, payload });

            agentDecisionCount += 1;
            const decisions = [
                {
                      mode: 'task',
                      intent: 'create_workspace_note',
                      summary: '创建目录并写入说明文件',
                      action: 'tool',
                      plan_update: ['先创建目标目录'],
                      tool_call: {
                          tool: 'computer',
                          title: '创建目标目录',
                          args: { action: 'mkdir', path: 'planner-output' }
                      }
                },
                {
                    mode: 'task',
                    intent: 'create_workspace_note',
                    summary: '创建目录并写入说明文件',
                    action: 'tool',
                    plan_update: ['目录已创建，写入说明文件'],
                    tool_call: {
                        tool: 'computer',
                        title: '写入说明文件',
                        args: {
                            action: 'write',
                            path: 'planner-output/README.txt',
                            content: 'Agentic Executor OK\n'
                        }
                    }
                },
                {
                    mode: 'task',
                    intent: 'create_workspace_note',
                    summary: '创建目录并写入说明文件',
                    action: 'tool',
                    plan_update: ['读取文件进行复核'],
                    tool_call: {
                        tool: 'computer',
                        title: '读取说明文件复核',
                        args: { action: 'read', path: 'planner-output/README.txt' }
                    }
                },
                {
                    mode: 'task',
                    intent: 'create_workspace_note',
                    summary: '创建目录并写入说明文件',
                    action: 'final',
                    final_answer: '**Agentic Executor 已完成**\n\n- 目录和 README.txt 已创建\n- 已读取复核通过'
                }
            ];
            const message = decisionObjectToChatMessage(
                decisions[Math.min(agentDecisionCount, decisions.length) - 1],
                `mock-agent-tool-${agentDecisionCount}`
            );

            res.writeHead(200, { 'content-type': 'application/json' });
            res.end(JSON.stringify({
                choices: [
                    {
                        message
                    }
                ],
                usage: { prompt_tokens: 10, completion_tokens: 10, total_tokens: 20 }
            }));
        });
    });

    await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
    const address = server.address();
    return {
        url: `http://127.0.0.1:${address.port}/v1`,
        calls,
        close: () => new Promise((resolve) => server.close(resolve))
    };
}

async function createScriptedChatCompletionsServer(decisionFactory) {
    const calls = [];
    let decisionCount = 0;
    const server = http.createServer(async (req, res) => {
        let raw = '';
        req.on('data', (chunk) => {
            raw += chunk;
        });
        req.on('end', () => {
            const payload = raw ? JSON.parse(raw) : {};
            const messages = payload.messages || [];
            const system = messages.find((message) => message.role === 'system')?.content || '';
            decisionCount += 1;
            calls.push({ url: req.url, system, payload, decisionCount });
            const decision = decisionFactory({ decisionCount, payload, messages, system });
            const message = decisionObjectToChatMessage(decision, `scripted-tool-${decisionCount}`);
            res.writeHead(200, { 'content-type': 'application/json' });
            res.end(JSON.stringify({
                choices: [
                    {
                        message
                    }
                ],
                usage: { prompt_tokens: 10, completion_tokens: 10, total_tokens: 20 }
            }));
        });
    });

    await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
    const address = server.address();
    return {
        url: `http://127.0.0.1:${address.port}/v1`,
        calls,
        close: () => new Promise((resolve) => server.close(resolve))
    };
}

async function createDelayedChatCompletionsServer(delayMs = 5000) {
    const calls = [];
    let closedByClient = 0;
    const server = http.createServer(async (req, res) => {
        let raw = '';
        req.on('data', (chunk) => {
            raw += chunk;
        });
        req.on('close', () => {
            if (!res.writableEnded) {
                closedByClient += 1;
            }
        });
        req.on('end', () => {
            const payload = raw ? JSON.parse(raw) : {};
            calls.push({ url: req.url, payload });
            setTimeout(() => {
                if (res.destroyed || res.writableEnded) {
                    return;
                }
                res.writeHead(200, { 'content-type': 'application/json' });
                res.end(JSON.stringify({
                    choices: [
                        {
                            message: {
                                content: JSON.stringify({
                                    mode: 'task',
                                    intent: 'slow_task',
                                    summary: 'This response should be interrupted.',
                                    action: 'final',
                                    final_answer: 'late answer'
                                })
                            }
                        }
                    ],
                    usage: { prompt_tokens: 10, completion_tokens: 5, total_tokens: 15 }
                }));
            }, delayMs);
        });
    });

    await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
    const address = server.address();
    return {
        url: `http://127.0.0.1:${address.port}/v1`,
        calls,
        get closedByClient() {
            return closedByClient;
        },
        close: () => new Promise((resolve) => server.close(resolve))
    };
}

test('Agent prompts inject runtime_environment from the active platform adapter', async () => {
    const cases = [
        {
            platform: 'win32',
            env: { ComSpec: 'C:\\Windows\\System32\\cmd.exe' },
            expectedFamily: 'windows',
            expectedPathStyle: 'windows',
            expectedShellDialect: 'cmd'
        },
        {
            platform: 'linux',
            env: { SHELL: '/bin/bash' },
            expectedFamily: 'linux',
            expectedPathStyle: 'posix',
            expectedShellDialect: 'posix-shell'
        }
    ];

    for (const item of cases) {
        const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), `ailis-runtime-env-${item.expectedFamily}-`));
        const llmServer = await createScriptedChatCompletionsServer(() => ({
            mode: 'task',
            intent: 'runtime_environment_probe',
            summary: 'probe runtime environment',
            action: 'final',
            final_answer: 'runtime environment observed'
        }));
        const gateway = new AILISGateway({
            port: 0,
            workspaceRoot,
            projectRoot: path.resolve('.'),
            auditDir: path.join(workspaceRoot, '.audit'),
            platformAdapter: new AILISPlatformAdapter({
                platform: item.platform,
                hostPlatform: item.platform,
                env: item.env
            })
        });

        try {
            const status = await gateway.start();
            const result = await runAgent(status.url, {
                sessionId: `runtime-env-${item.expectedFamily}`,
                message: '只确认当前运行环境，不要执行命令',
                agentLoop: 'llm',
                directToolExecutor: false,
                llmSettings: {
                    provider: 'openai-compatible',
                    baseUrl: llmServer.url,
                    apiKey: 'test-key',
                    model: `mock-${item.expectedFamily}`,
                    temperature: 0,
                    timeoutMs: 10000
                },
                context: {
                    workspace: workspaceRoot,
                    directToolExecutor: false,
                    nativeDirectTools: false
                }
            });

            assert.equal(result.body.ok, true, JSON.stringify(result.body));
            const userPayload = parseModelContextPayload(llmServer.calls[0]);
            assert.equal(userPayload.runtime_environment.family, item.expectedFamily);
            assert.equal(userPayload.runtime_environment.path_style, item.expectedPathStyle);
            assert.equal(userPayload.runtime_environment.shell_dialect, item.expectedShellDialect);
            assert.match(userPayload.runtime_environment.command_guidance, /Do not assume|not Linux by default|POSIX/);
            assert.match(JSON.stringify(llmServer.calls[0].payload.messages), /runtime_environment/);
            assert.match(llmServer.calls[0].system, /Runtime environment/);
            assert.doesNotMatch(llmServer.calls[0].system, /当前桌面端优先 Windows|Windows 桌面端命令必须/);
        } finally {
            await gateway.stop();
            await llmServer.close();
            await fs.rm(workspaceRoot, { recursive: true, force: true });
        }
    }
});

test('Persona orchestrator prompt stays in AILIS persona and only exposes subagent handoff', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-persona-orchestrator-'));
    const llmServer = await createScriptedChatCompletionsServer(() => ({
        action: 'final',
        final_answer: '你好呀～我在这里。'
    }));
    const gateway = new AILISGateway({
        port: 0,
        workspaceRoot,
        projectRoot: path.resolve('.'),
        auditDir: path.join(workspaceRoot, '.audit')
    });

    try {
        const status = await gateway.start();
        const result = await runAgent(status.url, {
            sessionId: 'persona-orchestrator-test',
            message: '你好呀',
            agentLoop: 'llm',
            llmSettings: {
                provider: 'openai-compatible',
                baseUrl: llmServer.url,
                apiKey: 'test-key',
                model: 'mock-persona-orchestrator',
                temperature: 0,
                timeoutMs: 10000
            },
            context: {
                workspace: workspaceRoot,
                agentLoop: 'llm',
                directToolExecutor: true,
                agentRole: 'persona_orchestrator'
            }
        });

        assert.equal(result.body.ok, true, JSON.stringify(result.body));
        assert.equal(result.body.intent, 'direct_conversation_final');
        assert.equal(llmServer.calls.length, 1);
        assert.doesNotMatch(llmServer.calls[0].system, /AILIS TaskAgent|coding agent running in AILIS/);
        assert.match(llmServer.calls[0].system, /可爱的虚拟助手，名字固定为AILIS/);
        assert.match(llmServer.calls[0].system, /关系表达协议/);
        const toolNames = (llmServer.calls[0].payload.tools || []).map((tool) => tool.function?.name || tool.name);
        assert.deepEqual(toolNames, ['subagents']);
        const contextPayload = parseModelContextPayload(llmServer.calls[0]);
        assert.match(contextPayload.memory_context || '', /AILIS 长期记忆上下文/);
        assert.equal(contextPayload.capability_catalog?.model, 'persona_orchestrator_capability_index');
        assert.equal(contextPayload.external_tool_exposure, undefined);
    } finally {
        await gateway.stop();
        await llmServer.close();
        await fs.rm(workspaceRoot, { recursive: true, force: true });
    }
});

test('Persona orchestrator stops after one TaskAgent handoff result', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-persona-handoff-once-'));
    const llmServer = await createScriptedChatCompletionsServer(({ decisionCount }) => {
        if (decisionCount === 1) {
            return {
                action: 'tool',
                summary: '交给干净的 TaskAgent 执行。',
                tool_call: {
                    tool: 'subagents',
                    args: {
                        action: 'spawn',
                        task: 'Solve the attached benchmark task and return the final answer.',
                        wait: true
                    }
                }
            };
        }
        return {
            action: 'final',
            final_answer: 'SHOULD_NOT_NEED_SECOND_LLM_CALL'
        };
    });
    const gateway = new AILISGateway({
        port: 0,
        workspaceRoot,
        projectRoot: path.resolve('.'),
        auditDir: path.join(workspaceRoot, '.audit')
    });
    const subagentCalls = [];
    const gatewayToolCalls = [];
    const originalCallTool = gateway.callTool.bind(gateway);
    gateway.callTool = async (request) => {
        if (request?.tool === 'subagents') {
            gatewayToolCalls.push({
                timeoutMs: request.timeoutMs,
                contextTimeoutMs: request.context?.timeoutMs,
                waitTimeoutMs: request.args?.waitTimeoutMs
            });
        }
        return originalCallTool(request);
    };

    try {
        gateway.runtime.subagentExecutor = async ({ subagent, args, context }) => {
            subagentCalls.push({ subagent, args, context });
            return {
                ok: true,
                status: 'completed',
                displayText: 'TaskAgent final answer: 42',
                finalAnswer: '42'
            };
        };
        const status = await gateway.start();
        const result = await runAgent(status.url, {
            sessionId: 'persona-handoff-once-test',
            message: '请执行一个需要工具的任务',
            agentLoop: 'llm',
            llmSettings: {
                provider: 'openai-compatible',
                baseUrl: llmServer.url,
                apiKey: 'test-key',
                model: 'mock-persona-handoff',
                temperature: 0,
                timeoutMs: 10000
            },
            context: {
                workspace: workspaceRoot,
                agentLoop: 'llm',
                directToolExecutor: true,
                approved: true,
                agentRole: 'persona_orchestrator'
            }
        });

        assert.equal(result.body.ok, true, JSON.stringify(result.body));
        assert.equal(result.body.planner, 'persona-taskagent-handoff');
        assert.match(result.body.displayText, /TaskAgent final answer: 42/);
        assert.equal(result.body.finalAnswer, '42');
        assert.equal(llmServer.calls.length, 1);
        assert.equal(subagentCalls.length, 1);
        assert.equal(subagentCalls[0].args.wait, true);
        assert.equal(subagentCalls[0].args.maxAgentSteps, 30);
        assert.ok(subagentCalls[0].args.waitTimeoutMs >= 180000);
        assert.equal(subagentCalls[0].context.cleanContext, true);
        assert.equal(subagentCalls[0].context.contextMode, 'task_agent');
        assert.equal(gatewayToolCalls.length, 1);
        assert.ok(gatewayToolCalls[0].waitTimeoutMs >= 180000);
        assert.ok(gatewayToolCalls[0].timeoutMs >= gatewayToolCalls[0].waitTimeoutMs + 5000);
        assert.equal(gatewayToolCalls[0].contextTimeoutMs, gatewayToolCalls[0].timeoutMs);
    } finally {
        await gateway.stop();
        await llmServer.close();
        await fs.rm(workspaceRoot, { recursive: true, force: true });
    }
});

test('AILIS Agent run can be interrupted while preserving transcript data', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-interrupt-test-'));
    const llmServer = await createDelayedChatCompletionsServer(5000);
    const gateway = new AILISGateway({
        port: 0,
        workspaceRoot,
        projectRoot: path.resolve('.'),
        auditDir: path.join(workspaceRoot, '.audit')
    });

    try {
        const status = await gateway.start();
        const runPromise = runAgent(status.url, {
            sessionId: 'interrupt-session',
            message: '请执行一个会等待模型的慢任务',
            agentLoop: 'llm',
            llmSettings: {
                provider: 'openai-compatible',
                baseUrl: llmServer.url,
                apiKey: 'test-key',
                model: 'mock-model',
                timeoutMs: 30000
            },
            context: {
                sessionId: 'interrupt-session',
                agentLoop: 'llm'
            }
        });

        const becameActive = await waitFor(() =>
            gateway.ensureAgentRunner().activeRuns.size === 1
        );
        assert.equal(becameActive, true);
        const reachedLlm = await waitFor(() => llmServer.calls.length === 1, { timeoutMs: 2000 });
        assert.equal(reachedLlm, true);

        const interrupt = await jsonFetch(`${status.url}/agent/interrupt`, {
            method: 'POST',
            body: JSON.stringify({
                sessionId: 'interrupt-session',
                reason: 'test_interrupt'
            })
        });
        assert.equal(interrupt.body.ok, true, interrupt.body.error);

        const run = await runPromise;
        assert.equal(run.body.status, 'interrupted');
        assert.match(run.body.displayText, /已中断/);
        assert.equal(gateway.ensureAgentRunner().activeRuns.size, 0);

        const transcript = await gateway.runtime.readTranscript(run.body.runId, 100);
        const itemTypes = transcript.items.map((item) => item.type);
        assert.ok(itemTypes.includes('agent.interrupt_requested'));
        assert.ok(itemTypes.includes('agent.interrupted'));
        assert.ok(itemTypes.includes('turn.completed'));

        const analysis = await gateway.analyzeAgentRun(run.body.runId);
        assert.equal(analysis.summary.status, 'interrupted');
    } finally {
        await gateway.stop().catch(() => {});
        await llmServer.close().catch(() => {});
    }
});

async function createDirectToolCallChatCompletionsServer() {
    const calls = [];
    let turn = 0;
    const server = http.createServer(async (req, res) => {
        let raw = '';
        req.on('data', (chunk) => {
            raw += chunk;
        });
        req.on('end', () => {
            const payload = raw ? JSON.parse(raw) : {};
            turn += 1;
            calls.push({ url: req.url, payload, turn });
            res.writeHead(200, { 'content-type': 'application/json' });
            if (turn === 1) {
                res.end(JSON.stringify({
                    choices: [
                        {
                            message: {
                                content: '',
                                tool_calls: [
                                    {
                                        id: 'direct-write-1',
                                        type: 'function',
                                        function: {
                                            name: 'write',
                                            arguments: JSON.stringify({
                                                path: 'direct-native-output.txt',
                                                content: 'direct native tool executor ok\n'
                                            })
                                        }
                                    }
                                ]
                            }
                        }
                    ],
                    usage: { prompt_tokens: 20, completion_tokens: 10, total_tokens: 30 }
                }));
                return;
            }
            res.end(JSON.stringify({
                choices: [
                    {
                        message: {
                            content: '**Direct native executor 完成**\n\n- 已写入 direct-native-output.txt\n- 工具结果已经回灌给下一轮'
                        }
                    }
                ],
                usage: { prompt_tokens: 20, completion_tokens: 10, total_tokens: 30 }
            }));
        });
    });

    await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
    const address = server.address();
    return {
        url: `http://127.0.0.1:${address.port}/v1`,
        calls,
        close: () => new Promise((resolve) => server.close(resolve))
    };
}

async function createProviderErrorChatCompletionsServer({ status = 402, message = 'Insufficient Balance' } = {}) {
    const calls = [];
    const server = http.createServer(async (req, res) => {
        let raw = '';
        req.on('data', (chunk) => {
            raw += chunk;
        });
        req.on('end', () => {
            const payload = raw ? JSON.parse(raw) : {};
            calls.push({ url: req.url, payload });
            res.writeHead(status, { 'content-type': 'application/json' });
            res.end(JSON.stringify({
                error: {
                    message,
                    type: 'billing_error',
                    code: 'insufficient_balance'
                }
            }));
        });
    });
    await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
    const address = server.address();
    return {
        url: `http://127.0.0.1:${address.port}`,
        calls,
        close: () => new Promise((resolve) => server.close(resolve))
    };
}

async function createToolSearchDirectExposureServer() {
    const calls = [];
    let turn = 0;
    const server = http.createServer(async (req, res) => {
        let raw = '';
        req.on('data', (chunk) => {
            raw += chunk;
        });
        req.on('end', () => {
            const payload = raw ? JSON.parse(raw) : {};
            turn += 1;
            calls.push({ url: req.url, payload, turn });
            res.writeHead(200, { 'content-type': 'application/json' });
            if (turn === 1) {
                res.end(JSON.stringify({
                    choices: [
                        {
                            message: {
                                content: '',
                                tool_calls: [
                                    {
                                        id: 'search-tools-1',
                                        type: 'function',
                                        function: {
                                            name: 'tool_search',
                                            arguments: JSON.stringify({ query: 'GitHub repository metadata external OpenAPI tool' })
                                        }
                                    }
                                ]
                            }
                        }
                    ],
                    usage: { prompt_tokens: 20, completion_tokens: 10, total_tokens: 30 }
                }));
                return;
            }
            res.end(JSON.stringify({
                choices: [
                    {
                        message: {
                            content: 'dynamic direct tool exposure ok'
                        }
                    }
                ],
                usage: { prompt_tokens: 20, completion_tokens: 10, total_tokens: 30 }
            }));
        });
    });

    await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
    const address = server.address();
    return {
        url: `http://127.0.0.1:${address.port}/v1`,
        calls,
        close: () => new Promise((resolve) => server.close(resolve))
    };
}

async function createNativeResponsesDecisionServer(decisionFactory) {
    const calls = [];
    let decisionCount = 0;
    const server = http.createServer(async (req, res) => {
        let raw = '';
        req.on('data', (chunk) => {
            raw += chunk;
        });
        req.on('end', () => {
            const payload = raw ? JSON.parse(raw) : {};
            calls.push({ url: req.url, payload });
            res.writeHead(200, { 'content-type': 'application/json' });
            if (Array.isArray(payload.tools) && payload.tools.length) {
                decisionCount += 1;
                const decision = decisionFactory({ decisionCount, payload });
                if (decision?.action === 'tool' && decision.tool_call?.tool) {
                    res.end(JSON.stringify({
                        output: [
                            {
                                type: 'function_call',
                                call_id: `native-call-${decisionCount}`,
                                name: decision.tool_call.tool,
                                arguments: JSON.stringify(decision.tool_call.args || {})
                            }
                        ],
                        usage: { input_tokens: 10, output_tokens: 10, total_tokens: 20 }
                    }));
                    return;
                }
                res.end(JSON.stringify({
                    output_text: decision?.final_answer || decision?.blocked_reason || decision?.summary || '',
                    usage: { input_tokens: 10, output_tokens: 10, total_tokens: 20 }
                }));
                return;
            }
            res.end(JSON.stringify({
                output_text: JSON.stringify({
                    ok: true,
                    final_answer: 'Native review OK',
                    issues: []
                }),
                usage: { input_tokens: 8, output_tokens: 8, total_tokens: 16 }
            }));
        });
    });

    await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
    const address = server.address();
    return {
        url: `http://127.0.0.1:${address.port}/v1`,
        calls,
        close: () => new Promise((resolve) => server.close(resolve))
    };
}

test('Agentic Executor widens decision timeout after vision context is involved', () => {
    assert.equal(
        resolveAgentDecisionTimeoutMs({ timeoutMs: 25000 }, { events: [], stepResults: [] }),
        45000
    );
    assert.equal(
        resolveAgentDecisionTimeoutMs(
            { timeoutMs: 25000 },
            {
                events: [],
                stepResults: [{ response: { ok: false, status: 'error' } }]
            }
        ),
        60000
    );
    assert.equal(
        resolveAgentDecisionTimeoutMs(
            { timeoutMs: 25000 },
            {
                events: [
                    {
                        type: 'capability_context',
                        loaded: { skills: ['vision'], tools: [] },
                        request: { skills: ['vision'], tools: [] }
                    }
                ],
                stepResults: []
            }
        ),
        90000
    );
    assert.equal(
        resolveAgentDecisionTimeoutMs(
            { timeoutMs: 25000 },
            {
                events: [
                    {
                        type: 'tool_result',
                        tool: 'vision.capture_context',
                        status: 'completed',
                        ok: true
                    }
                ],
                stepResults: []
            }
        ),
        90000
    );
    assert.equal(
        resolveAgentDecisionTimeoutMs(
            { timeoutMs: 30000 },
            {
                events: [{ type: 'tool_result', tool: 'vision.capture_context', status: 'completed' }],
                stepResults: [],
                requestContext: { visionAgentDecisionTimeoutMs: 65000 }
            }
        ),
        65000
    );
});

test('Agentic Executor can execute real native direct tool calls before JSON planner fallback', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-direct-tools-agent-'));
    const llmServer = await createDirectToolCallChatCompletionsServer();
    const gateway = new AILISGateway({
        port: 0,
        workspaceRoot,
        projectRoot: path.resolve('.'),
        auditDir: path.join(workspaceRoot, '.audit')
    });

    try {
        const status = await gateway.start();
        const result = await runAgent(status.url, {
            sessionId: 'direct-native-tool-agent-test',
            message: '写入 direct-native-output.txt 并复核',
            agentLoop: 'llm',
            llmSettings: {
                provider: 'openai-compatible',
                baseUrl: llmServer.url,
                apiKey: 'test-key',
                model: 'mock-direct-tools',
                temperature: 0,
                timeoutMs: 10000
            },
            context: {
                workspace: workspaceRoot,
                directToolExecutor: true,
                computerControlEnabled: true,
                permissionProfile: 'danger-full-access',
                approvalPolicy: 'auto',
                approved: true,
                autoConfirm: true
            }
        });

        assert.equal(result.body.ok, true, JSON.stringify(result.body));
        assert.equal(result.body.status, 'completed');
        assert.equal(result.body.planner, 'llm-agentic-executor');
        assert.match(result.body.displayText, /Direct native executor 完成/);
        assert.equal(await fs.readFile(path.join(workspaceRoot, 'direct-native-output.txt'), 'utf8'), 'direct native tool executor ok\n');
        assert.equal(llmServer.calls.length, 2);
        assert.ok(llmServer.calls[0].payload.tools.some((tool) => tool.function?.name === 'write'));
        assert.equal(
            llmServer.calls[0].payload.tools.some((tool) => tool.function?.name === 'ailis_agent_decision'),
            false
        );
        assert.equal(llmServer.calls[0].payload.tool_choice, 'auto');
        assert.match(llmServer.calls[0].payload.messages[0].content, /Responses-Compatible Tool Runtime/);
        assert.equal(result.body.steps[0].tool, 'write');
    } finally {
        await gateway.stop();
        await llmServer.close();
        await fs.rm(workspaceRoot, { recursive: true, force: true });
    }
});

test('Agentic Executor fails fast on terminal LLM provider billing errors', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-provider-error-agent-'));
    const llmServer = await createProviderErrorChatCompletionsServer({
        message: 'The request failed because your account has an overdue balance.'
    });
    const gateway = new AILISGateway({
        port: 0,
        workspaceRoot,
        projectRoot: path.resolve('.'),
        auditDir: path.join(workspaceRoot, '.audit')
    });

    try {
        const status = await gateway.start();
        const result = await runAgent(status.url, {
            sessionId: 'provider-error-fail-fast-test',
            message: '读取一个文档并回答问题',
            agentLoop: 'llm',
            maxAgentSteps: 5,
            llmSettings: {
                provider: 'openai-compatible',
                baseUrl: llmServer.url,
                apiKey: 'test-key',
                model: 'mock-provider-error',
                temperature: 0,
                timeoutMs: 10000
            },
            context: {
                workspace: workspaceRoot,
                directToolExecutor: true,
                nativeDirectTools: true,
                computerControlEnabled: true,
                permissionProfile: 'danger-full-access',
                approvalPolicy: 'auto',
                approved: true,
                autoConfirm: true
            }
        });

        assert.equal(result.body.ok, false, JSON.stringify(result.body));
        assert.equal(result.body.status, 'provider_error');
        assert.equal(result.body.intent, 'llm_provider_unavailable');
        assert.match(result.body.displayText, /overdue balance/);
        assert.equal(result.body.steps.length, 0);
        assert.equal(llmServer.calls.length, 1);
        assert.equal(
            result.body.events.some((event) => event.type === 'agent.invalid_decision_observation'),
            false
        );
    } finally {
        await gateway.stop();
        await llmServer.close();
        await fs.rm(workspaceRoot, { recursive: true, force: true });
    }
});

test('Agentic Executor fails fast when the LLM decision request times out upstream', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-provider-timeout-agent-'));
    const llmServer = await createProviderErrorChatCompletionsServer({
        status: 504,
        message: 'upstream model request timed out'
    });
    const gateway = new AILISGateway({
        port: 0,
        workspaceRoot,
        projectRoot: path.resolve('.'),
        auditDir: path.join(workspaceRoot, '.audit')
    });

    try {
        const status = await gateway.start();
        const result = await runAgent(status.url, {
            sessionId: 'provider-timeout-fail-fast-test',
            message: '你好',
            agentLoop: 'llm',
            maxAgentSteps: 5,
            llmSettings: {
                provider: 'openai-compatible',
                baseUrl: llmServer.url,
                apiKey: 'test-key',
                model: 'mock-provider-timeout',
                temperature: 0,
                timeoutMs: 10000
            },
            context: {
                workspace: workspaceRoot,
                directToolExecutor: true,
                nativeDirectTools: true,
                computerControlEnabled: true,
                permissionProfile: 'danger-full-access',
                approvalPolicy: 'auto',
                approved: true,
                autoConfirm: true
            }
        });

        assert.equal(result.body.ok, false, JSON.stringify(result.body));
        assert.equal(result.body.status, 'provider_error');
        assert.equal(result.body.intent, 'llm_provider_unavailable');
        assert.match(result.body.displayText, /timed out/);
        assert.equal(result.body.steps.length, 0);
        assert.equal(llmServer.calls.length, 1);
        assert.equal(result.body.events.some((event) => event.type === 'agent.invalid_decision_observation'), false);
        assert.notEqual(result.body.status, 'max_steps_reached');
    } finally {
        await gateway.stop();
        await llmServer.close();
        await fs.rm(workspaceRoot, { recursive: true, force: true });
    }
});

test('Agentic Executor turns tool_search results into valid dynamic native tool specs', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-direct-tool-search-'));
    const llmServer = await createToolSearchDirectExposureServer();
    const gateway = new AILISGateway({
        port: 0,
        workspaceRoot,
        projectRoot: path.resolve('.'),
        auditDir: path.join(workspaceRoot, '.audit')
    });

    try {
        const status = await gateway.start();
        await gateway.runtime.capabilityManager.bulkExposeExternalTools({
            includeInstalledMcp: false,
            includeMcpRegistry: false,
            openapiOperations: [
                {
                    operationId: 'githubGetRepo',
                    method: 'get',
                    path: '/repos/{owner}/{repo}',
                    summary: 'Get GitHub repository metadata.',
                    parameters: [
                        { name: 'owner', required: true, schema: { type: 'string' }, description: 'Repository owner.' },
                        { name: 'repo', required: true, schema: { type: 'string' }, description: 'Repository name.' }
                    ],
                    whenToUse: ['Use for official GitHub repository metadata.'],
                    examples: [{ owner: 'openai', repo: 'codex' }]
                }
            ]
        });
        const result = await runAgent(status.url, {
            sessionId: 'direct-tool-search-agent-test',
            message: '搜索 web_search 工具并结束',
            agentLoop: 'llm',
            llmSettings: {
                provider: 'openai-compatible',
                baseUrl: llmServer.url,
                apiKey: 'test-key',
                model: 'mock-direct-tools',
                temperature: 0,
                timeoutMs: 10000
            },
            context: {
                workspace: workspaceRoot,
                directToolExecutor: true,
                computerControlEnabled: true,
                permissionProfile: 'danger-full-access',
                approvalPolicy: 'auto',
                approved: true,
                autoConfirm: true
            }
        });

        assert.equal(result.body.ok, true, JSON.stringify(result.body));
        assert.equal(llmServer.calls.length, 2);
        const secondTools = llmServer.calls[1].payload.tools.map((tool) => tool.function || tool);
        const externalSpec = secondTools.find((tool) => /^external__/.test(tool.name));
        assert.ok(externalSpec, 'callable external tools should become native callable tools after tool_search');
        assert.equal(externalSpec.parameters.type, 'object');
        assert.equal(Array.isArray(externalSpec.parameters.required), true);
        assert.equal(typeof externalSpec.parameters.properties, 'object');
        assert.equal(secondTools.some((tool) => tool.name === 'mcp_bridge'), false);
    } finally {
        await gateway.stop();
        await llmServer.close();
        await fs.rm(workspaceRoot, { recursive: true, force: true });
    }
});

test('Agentic Executor injects directly exposed external tools into decision payload', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-external-tools-agent-'));
    const llmServer = await createScriptedChatCompletionsServer(() => ({
        mode: 'task',
        intent: 'inspect_external_tool_exposure',
        summary: '已看到外部工具面',
        action: 'final',
        final_answer: 'external tools visible'
    }));
    const gateway = new AILISGateway({
        port: 0,
        workspaceRoot,
        projectRoot: path.resolve('.'),
        auditDir: path.join(workspaceRoot, '.audit')
    });

    try {
        const status = await gateway.start();
        const exposed = await gateway.runtime.capabilityManager.bulkExposeExternalTools({
            includeInstalledMcp: false,
            includeMcpRegistry: false,
            openapiOperations: [
                {
                    operationId: 'githubGetRepo',
                    method: 'get',
                    path: '/repos/{owner}/{repo}',
                    summary: 'Get GitHub repository metadata.',
                    parameters: [
                        { name: 'owner', required: true, schema: { type: 'string' }, description: 'Repository owner.' },
                        { name: 'repo', required: true, schema: { type: 'string' }, description: 'Repository name.' }
                    ],
                    whenToUse: ['Use for official GitHub repository metadata.'],
                    whenNotToUse: ['Do not use for local git status.'],
                    preconditions: ['GitHub API is reachable.'],
                    examples: [{ owner: 'openai', repo: 'codex' }],
                    badExamples: [{ owner: 'openai' }],
                    alternatives: ['Use code.git_status for local repositories.'],
                    errors: { not_found: { recoverable: false } },
                    permissions: ['github.read']
                }
            ]
        });
        assert.equal(exposed.status, 'completed');
        assert.equal(exposed.added, 1);

        const result = await runAgent(status.url, {
            sessionId: 'external-tool-exposure-agent-test',
            message: '查看 GitHub 仓库 metadata 能力是否可用',
            agentLoop: 'llm',
            llmSettings: {
                provider: 'openai-compatible',
                baseUrl: llmServer.url,
                apiKey: 'test-key',
                model: 'mock-planner',
                temperature: 0,
                timeoutMs: 10000
            },
            context: {
                workspace: workspaceRoot,
                computerControlEnabled: true,
                permissionProfile: 'danger-full-access',
                approvalPolicy: 'auto',
                approved: true,
                autoConfirm: true
            }
        });

        assert.equal(result.body.ok, true);
        const llmUserPayload = parseModelContextPayload(llmServer.calls[0]);
        assert.equal(llmUserPayload.external_tool_exposure.status, 'completed');
        assert.equal(llmUserPayload.external_tool_exposure.tools.length, 1);
        assert.equal(llmUserPayload.external_tool_exposure.tools[0].source.type, 'openapi_operation');
        assert.equal(llmUserPayload.external_tool_exposure.tools[0].callable, false);
        assert.match(JSON.stringify(llmUserPayload.external_tool_exposure), /githubGetRepo|GitHub repository metadata/);
    } finally {
        await gateway.stop();
        await llmServer.close();
        await fs.rm(workspaceRoot, { recursive: true, force: true });
    }
});

test('Agentic Executor consumes native provider tool-call decisions and keeps runtime tool execution local', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-native-agent-'));
    const llmServer = await createNativeResponsesDecisionServer(({ decisionCount }) => {
        if (decisionCount === 1) {
            return {
                mode: 'task',
                intent: 'native_decision_write',
                summary: '使用原生 tool-call 决策写入文件',
                action: 'tool',
                tool_call: {
                    tool: 'computer',
                    title: '写入 native-output.txt',
                    args: {
                        action: 'write',
                        path: 'native-output.txt',
                        content: 'native tool-call decision ok\n'
                    }
                }
            };
        }
        return {
            mode: 'task',
            intent: 'native_decision_write',
            summary: '文件已经写入',
            action: 'final',
            final_answer: '**Native decision 完成**'
        };
    });
    const gateway = new AILISGateway({
        port: 0,
        workspaceRoot,
        projectRoot: path.resolve('.'),
        auditDir: path.join(workspaceRoot, '.audit')
    });

    try {
        const status = await gateway.start();
        const result = await runAgent(status.url, {
            sessionId: 'native-tool-call-agent-test',
            message: '写入 native-output.txt',
            agentLoop: 'llm',
            llmSettings: {
                provider: 'openai-responses',
                baseUrl: llmServer.url,
                apiKey: 'test-openai-key',
                model: 'gpt-native-test',
                temperature: 0,
                timeoutMs: 10000
            },
            context: {
                workspace: workspaceRoot,
                computerControlEnabled: true,
                permissionProfile: 'danger-full-access',
                approvalPolicy: 'auto',
                approved: true,
                autoConfirm: true
            }
        });

        assert.equal(result.body.ok, true, result.body.displayText);
        assert.equal(result.body.status, 'completed');
        assert.match(result.body.displayText, /Native decision 完成/);
        const written = await fs.readFile(path.join(workspaceRoot, 'native-output.txt'), 'utf8');
        assert.match(written, /native tool-call decision ok/);
        const nativeDecisionCalls = llmServer.calls.filter((call) =>
            call.payload.tools?.some((tool) => tool.name === 'computer')
        );
        assert.equal(nativeDecisionCalls.length, 2);
        assert.equal(nativeDecisionCalls[0].payload.tool_choice, 'auto');
        assert.equal(nativeDecisionCalls[0].payload.tools.some((tool) => tool.name === 'ailis_agent_decision'), false);
    } finally {
        await gateway.stop();
        await llmServer.close();
        await fs.rm(workspaceRoot, { recursive: true, force: true });
    }
});

test('Agentic Executor Loop asks confirmation, resumes, observes, and keeps calling tools until final', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-llm-planner-'));
    const llmServer = await createMockChatCompletionsServer();
    const llmSettings = {
        provider: 'openai-compatible',
        baseUrl: llmServer.url,
        apiKey: 'test-key',
        model: 'mock-planner',
        temperature: 0.1,
        timeoutMs: 10000
    };
    const gateway = new AILISGateway({
        port: 0,
        workspaceRoot,
        projectRoot: path.resolve('.'),
        auditDir: path.join(workspaceRoot, '.audit')
    });

    try {
        const status = await gateway.start();
        const baseUrl = status.url;
        const first = await runAgent(baseUrl, {
            sessionId: 'llm-planner-test',
            message: '帮我创建一个 planner-output 目录，并写入 README.txt',
            agentLoop: 'llm',
            llmSettings,
            context: { workspace: workspaceRoot }
        });

        assert.equal(first.body.ok, false);
        assert.equal(first.body.status, 'needs_approval');
        assert.equal(first.body.planner, 'llm-agentic-executor');
        assert.equal(first.body.confirmationRequired, true);
        assert.equal(first.body.approvalType, 'agent_tool_call');
        assert.ok(first.body.approvalId);
        assert.doesNotMatch(first.body.displayText, /Agentic Executor Loop|确认编号/);
        assert.equal(first.body.plan.length, 1);
        assert.equal(first.body.plan[0].args.action, 'mkdir');
        await assert.rejects(
            () => fs.readFile(path.join(workspaceRoot, 'planner-output', 'README.txt'), 'utf8'),
            /ENOENT/
        );

        const classifyConfirm = await runAgent(baseUrl, {
            sessionId: 'llm-planner-test',
            message: '确认执行',
            classifyOnly: true,
            context: { workspace: workspaceRoot }
        });
        assert.equal(classifyConfirm.body.intent, 'agent_action_confirmation');
        assert.equal(classifyConfirm.body.mode, 'task');
        assert.equal(classifyConfirm.body.approvalId, first.body.approvalId);

        const directWithoutApproval = await runAgent(baseUrl, {
            sessionId: 'llm-planner-test',
            message: 'api direct confirm',
            confirmApprovalId: first.body.approvalId,
            llmSettings,
            context: { workspace: workspaceRoot }
        });
        assert.equal(directWithoutApproval.body.status, 'needs_approval');

        const confirmed = await runAgent(baseUrl, {
            sessionId: 'llm-planner-test',
            message: '确认执行',
            llmSettings,
            context: { workspace: workspaceRoot }
        });
        assert.equal(confirmed.body.ok, true, confirmed.body.displayText);
        assert.equal(confirmed.body.status, 'completed');
        assert.equal(confirmed.body.planner, 'llm-agentic-executor');
        assert.equal(confirmed.body.steps.length, 3);
        assert.ok(confirmed.body.events.length >= 6);
        assert.match(confirmed.body.displayText, /\*\*(Agentic Executor|任务执行流程) 已完成\*\*/);
        assert.match(confirmed.body.displayText, /- 已读取复核通过/);

        const text = await fs.readFile(path.join(workspaceRoot, 'planner-output', 'README.txt'), 'utf8');
        assert.match(text, /Agentic Executor OK/);
        assert.equal(llmServer.calls.filter((call) => /Responses-Compatible Tool Runtime/.test(call.system)).length, 4);
        assert.match(llmServer.calls[0].system, /You are a coding agent running in AILIS/);
        assert.match(llmServer.calls[0].system, /PersonaPresenter handles user-facing character presentation/);
        assert.match(llmServer.calls[0].system, /OpenAI Responses object model/);
        assert.doesNotMatch(llmServer.calls[0].system, /名字固定为AILIS/);
        assert.doesNotMatch(llmServer.calls[0].system, /性格设定/);
        assert.doesNotMatch(llmServer.calls[0].system, /不具备任何人工智能/);
        assert.doesNotMatch(llmServer.calls[0].system, /邮箱 SKILL/);
        assert.doesNotMatch(llmServer.calls[0].system, /final_answer 字段是给用户看的 Markdown 字符串/);
        const firstPromptPayload = parseModelContextPayload(llmServer.calls[0]);
        assert.equal(firstPromptPayload.capability_catalog.tool_contracts, undefined);
        assert.equal(firstPromptPayload.capability_catalog.deferred_contracts, true);
        assert.ok(firstPromptPayload.capability_catalog.tools.every((tool) => tool.contract === 'deferred'));
        assert.doesNotMatch(JSON.stringify(firstPromptPayload.capability_catalog), /TOOL CONTRACT|input_schema|return_schema/);
    } finally {
        await gateway.stop();
        await llmServer.close();
    }
});

test('Agentic Executor restores pending approval from durable store after Gateway restart', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-pending-restore-'));
    const auditDir = path.join(workspaceRoot, '.audit');
    const llmServer = await createMockChatCompletionsServer();
    const llmSettings = {
        provider: 'openai-compatible',
        baseUrl: llmServer.url,
        apiKey: 'test-key',
        model: 'mock-planner',
        temperature: 0.1,
        timeoutMs: 10000
    };
    let gateway = new AILISGateway({
        port: 0,
        workspaceRoot,
        projectRoot: path.resolve('.'),
        auditDir
    });

    try {
        const status = await gateway.start();
        const first = await runAgent(status.url, {
            sessionId: 'pending-restore-test',
            message: '帮我创建一个 planner-output 目录，并写入 README.txt',
            agentLoop: 'llm',
            llmSettings,
            context: { workspace: workspaceRoot }
        });
        assert.equal(first.body.status, 'needs_approval');
        const approvalId = first.body.approvalId;
        const storePath = path.join(auditDir, 'pending-agent-state.json');
        const stored = JSON.parse(await fs.readFile(storePath, 'utf8'));
        const storedApprovals = Array.isArray(stored.pendingAgentApprovals)
            ? stored.pendingAgentApprovals
            : Object.values(stored.pendingAgentApprovals || {});
        assert.equal(storedApprovals[0].approvalId, approvalId);
        assert.equal(storedApprovals[0].contextManagerCheckpoint?.schema, undefined);
        assert.ok(storedApprovals[0].contextManagerCheckpoint.items.length >= 2);
        assert.equal(JSON.stringify(stored).includes('test-key'), false);

        await gateway.stop();

        gateway = new AILISGateway({
            port: 0,
            workspaceRoot,
            projectRoot: path.resolve('.'),
            auditDir
        });
        const restarted = await gateway.start();

        const confirmed = await runAgent(restarted.url, {
            sessionId: 'pending-restore-test',
            message: '确认执行',
            llmSettings,
            context: { workspace: workspaceRoot }
        });
        assert.equal(confirmed.body.ok, true, confirmed.body.displayText);
        assert.equal(confirmed.body.status, 'completed');
        assert.match(confirmed.body.displayText, /(Agentic Executor|任务执行流程) 已完成/);

        const text = await fs.readFile(path.join(workspaceRoot, 'planner-output', 'README.txt'), 'utf8');
        assert.match(text, /Agentic Executor OK/);
        const cleared = JSON.parse(await fs.readFile(storePath, 'utf8'));
        assert.equal(cleared.pendingAgentApprovals.length, 0);
    } finally {
        await gateway.stop().catch(() => {});
        await llmServer.close();
    }
});

test('Agentic Executor can request approved read-only vision context', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-vision-agent-'));
    const captured = [];
    const llmServer = await createScriptedChatCompletionsServer(({ decisionCount, messages }) => {
        const hasImageInput = messages.some((message) =>
            Array.isArray(message.content) &&
            message.content.some((part) => part?.type === 'image_url')
        );
        if (hasImageInput) {
            return '我看到截图里有一个桌面端聊天窗口，界面没有明显崩溃。';
        }
        if (decisionCount === 1) {
            return {
                mode: 'task',
                intent: 'vision_check',
                summary: '请求只读视觉上下文',
                action: 'tool',
                tool_call: {
                    tool: 'vision.capture_context',
                    title: '看一眼当前屏幕',
                    args: {
                        action: 'capture_context',
                        target: 'screen',
                        reason: '用户要求判断桌面端视觉截图功能是否正常',
                        question: '当前聊天窗口、桌宠窗口和控制台是否正常运行？'
                    }
                }
            };
        }
        return {
            mode: 'task',
            intent: 'vision_check',
            summary: '已经获得视觉 observation',
            action: 'final',
            final_answer: '我看到了当前界面：聊天窗口存在，未发现明显崩溃；如果要更精确，需要你框选异常区域。'
        };
    });
    const llmSettings = {
        provider: 'openai-compatible',
        baseUrl: llmServer.url,
        apiKey: 'test-key',
        model: 'mock-vision-agent',
        temperature: 0.1,
        timeoutMs: 10000
    };
    const gateway = new AILISGateway({
        port: 0,
        workspaceRoot,
        projectRoot: path.resolve('.'),
        auditDir: path.join(workspaceRoot, '.audit'),
        visionServices: {
            permissionPolicy: 'manual',
            getLlmSettings: () => llmSettings,
            capture: async ({ target, reason }) => {
                captured.push({ target, reason });
                return {
                    type: 'vision',
                    id: 'snapshot-test',
                    source: target,
                    label: '屏幕截图',
                    imagePath: path.join(workspaceRoot, 'snapshot.png'),
                    thumbnailPath: path.join(workspaceRoot, 'snapshot.thumb.png'),
                    dataUrl: 'data:image/png;base64,AAAA',
                    thumbnailDataUrl: 'data:image/png;base64,BBBB',
                    mimeType: 'image/png',
                    width: 1280,
                    height: 720,
                    createdAt: new Date(0).toISOString()
                };
            }
        }
    });

    try {
        const status = await gateway.start();
        const baseUrl = status.url;
        const first = await runAgent(baseUrl, {
            sessionId: 'vision-agent-test',
            message: '帮我观察当前屏幕，判断聊天窗口和桌宠是否正常。',
            agentLoop: 'llm',
            llmSettings,
            context: { workspace: workspaceRoot }
        });

        assert.equal(first.body.ok, false);
        assert.equal(first.body.status, 'needs_approval');
        assert.equal(first.body.approvalType, 'vision_capture_context');
        assert.equal(first.body.plan[0].tool, 'vision.capture_context');
        assert.match(first.body.displayText, /先得到你的确认/);
        assert.match(first.body.displayText, /看一眼当前画面|看一眼屏幕/);
        assert.doesNotMatch(first.body.displayText, /确认编号|Agentic Executor/);
        assert.equal(captured.length, 0);

        const confirmed = await runAgent(baseUrl, {
            sessionId: 'vision-agent-test',
            message: '确认执行',
            llmSettings,
            context: { workspace: workspaceRoot }
        });

        assert.equal(confirmed.body.ok, true, confirmed.body.displayText);
        assert.equal(confirmed.body.status, 'completed');
        assert.equal(captured.length, 1);
        assert.equal(captured[0].target, 'screen');
        assert.match(confirmed.body.displayText, /聊天窗口存在/);
        assert.ok(
            llmServer.calls.some((call) =>
                call.payload.messages?.some((message) =>
                    Array.isArray(message.content) &&
                    message.content.some((part) => part?.type === 'image_url')
                )
            )
        );
    } finally {
        await gateway.stop();
        await llmServer.close();
    }
});

test('Agentic Executor skips vision confirmation when full computer control is enabled', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-vision-full-control-'));
    const captured = [];
    let agentDecisionCount = 0;
    const llmServer = await createScriptedChatCompletionsServer(({ messages }) => {
        const hasImageInput = messages.some((message) =>
            Array.isArray(message.content) &&
            message.content.some((part) => part?.type === 'image_url')
        );
        if (hasImageInput) {
            return '我看到桌面上有 AILIS 聊天窗口和桌宠，截图链路正常。';
        }
        agentDecisionCount += 1;
        if (agentDecisionCount === 1) {
            return {
                mode: 'task',
                intent: 'vision_full_control_check',
                summary: '完全控制下直接获取视觉上下文',
                action: 'tool',
                tool_call: {
                    tool: 'vision.capture_context',
                    title: '看一眼当前屏幕',
                    args: {
                        action: 'capture_context',
                        target: 'screen',
                        reason: '用户已开启完全控制能力，排查视觉功能状态',
                        question: '当前视觉功能是否正常？'
                    }
                }
            };
        }
        return {
            mode: 'task',
            intent: 'vision_full_control_check',
            summary: '视觉检查完成',
            action: 'final',
            final_answer: '我看到了当前屏幕，AILIS 聊天窗口和桌宠都在，视觉截图链路正常。'
        };
    });
    const llmSettings = {
        provider: 'openai-compatible',
        baseUrl: llmServer.url,
        apiKey: 'test-key',
        model: 'mock-vision-full-control-agent',
        temperature: 0.1,
        timeoutMs: 10000
    };
    const gateway = new AILISGateway({
        port: 0,
        workspaceRoot,
        projectRoot: path.resolve('.'),
        auditDir: path.join(workspaceRoot, '.audit'),
        defaultContext: {
            computerControlEnabled: true,
            permissionProfile: 'danger-full-access',
            approvalPolicy: 'auto',
            confirmationPolicy: 'auto',
            visionPermissionPolicy: 'manual',
            approved: true,
            autoConfirm: true,
            allowComputerWideAccess: true,
            allowSystemMutation: true
        },
        visionServices: {
            permissionPolicy: 'manual',
            getLlmSettings: () => llmSettings,
            capture: async ({ target, reason }) => {
                captured.push({ target, reason });
                return {
                    type: 'vision',
                    id: 'snapshot-full-control-test',
                    source: target,
                    label: '屏幕截图',
                    imagePath: path.join(workspaceRoot, 'snapshot.png'),
                    thumbnailPath: path.join(workspaceRoot, 'snapshot.thumb.png'),
                    dataUrl: 'data:image/png;base64,AAAA',
                    thumbnailDataUrl: 'data:image/png;base64,BBBB',
                    mimeType: 'image/png',
                    width: 1280,
                    height: 720,
                    createdAt: new Date(0).toISOString()
                };
            }
        }
    });

    try {
        const status = await gateway.start();
        const result = await runAgent(status.url, {
            sessionId: 'vision-full-control-test',
            message: 'AILIS，直接看一下当前屏幕，判断视觉截图功能是否正常。',
            agentLoop: 'llm',
            llmSettings,
            context: { workspace: workspaceRoot }
        });

        assert.equal(result.body.ok, true, result.body.displayText);
        assert.equal(result.body.status, 'completed');
        assert.equal(result.body.confirmationRequired, undefined);
        assert.equal(captured.length, 1);
        assert.equal(captured[0].target, 'screen');
        assert.match(result.body.displayText, /视觉截图链路正常/);
    } finally {
        await gateway.stop();
        await llmServer.close();
    }
});

test('Agentic Executor max-step fallback does not expose raw tool logs to the user', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-max-step-'));
    await fs.writeFile(path.join(workspaceRoot, 'note.txt'), 'secret-ish line\n'.repeat(80), 'utf8');
    const llmServer = await createScriptedChatCompletionsServer(() => ({
        mode: 'task',
        intent: 'read_until_limit',
        summary: '检查本地 note 文件',
        action: 'tool',
        tool_call: {
            tool: 'read',
            title: '读取 note.txt',
            args: { path: 'note.txt' }
        }
    }));
    const llmSettings = {
        provider: 'openai-compatible',
        baseUrl: llmServer.url,
        apiKey: 'test-key',
        model: 'mock-max-step-agent',
        temperature: 0.1,
        timeoutMs: 10000
    };
    const gateway = new AILISGateway({
        port: 0,
        workspaceRoot,
        projectRoot: path.resolve('.'),
        auditDir: path.join(workspaceRoot, '.audit')
    });

    try {
        const status = await gateway.start();
        const result = await runAgent(status.url, {
            sessionId: 'max-step-test',
            message: '检查 note.txt',
            agentLoop: 'llm',
            maxAgentSteps: 1,
            llmSettings,
            context: { workspace: workspaceRoot }
        });
        assert.equal(result.body.ok, false);
        assert.equal(result.body.status, 'max_steps_reached');
        assert.match(result.body.displayText, /先停住|还没有形成足够稳的结论/);
        assert.doesNotMatch(result.body.displayText, /```|secret-ish line|Agentic Executor|我已经做过这些步骤|读取 note\.txt：完成/);
        assert.equal(result.body.surface.source, 'agent_max_steps');
        assert.equal(result.body.surface.bubbleText, '我先停住，避免越跑越乱。');
        assert.equal(result.body.steps.length, 1);
    } finally {
        await gateway.stop();
        await llmServer.close();
    }
});

test('Agentic Executor feeds invalid decisions back as observations instead of stopping early', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-invalid-decision-observation-'));
    const llmServer = await createScriptedChatCompletionsServer(({ decisionCount }) => {
        if (decisionCount <= 2) {
            return {
                mode: 'task',
                intent: 'clinical_trials_lookup',
                summary: '需要先查询结构化临床试验数据',
                plan_update: ['搜索 ClinicalTrials API', '读取 enrollment 字段']
            };
        }
        return {
            mode: 'task',
            intent: 'clinical_trials_lookup',
            summary: '非法决策已修复',
            action: 'final',
            final_answer: '90'
        };
    });
    const llmSettings = {
        provider: 'openai-compatible',
        baseUrl: llmServer.url,
        apiKey: 'test-key',
        model: 'mock-invalid-decision-observation-agent',
        temperature: 0.1,
        timeoutMs: 10000
    };
    const gateway = new AILISGateway({
        port: 0,
        workspaceRoot,
        projectRoot: path.resolve('.'),
        auditDir: path.join(workspaceRoot, '.audit')
    });

    try {
        const status = await gateway.start();
        const result = await runAgent(status.url, {
            sessionId: 'invalid-decision-observation-test',
            message: '查询 NCT03411733 的 actual enrollment count。',
            agentLoop: 'llm',
            maxAgentSteps: 3,
            llmSettings,
            context: {
                workspace: workspaceRoot
            }
        });

        assert.equal(result.body.ok, true, result.body.displayText);
        assert.equal(result.body.status, 'completed');
        assert.match(result.body.displayText, /90/);
        assert.equal(llmServer.calls.length, 3);
        assert.ok(result.body.events.some((event) =>
            event.type === 'runtime_note' &&
            event.status === 'invalid_decision_observation' &&
            event.protocol_error === 'model_input_custom_json_decision'
        ));
    } finally {
        await gateway.stop();
        await llmServer.close();
    }
});

test('Agentic Executor keeps deprecated task layers out of the model prompt', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-model-input-turn-prompt-'));
    const llmServer = await createScriptedChatCompletionsServer(() => ({
        mode: 'task',
        intent: 'research_reading',
        summary: '给论文做概要分析',
        action: 'blocked',
        blocked_reason: '我现在还没有读取到论文原文，所以不能把概要说成已经完成。'
    }));
    const llmSettings = {
        provider: 'openai-compatible',
        baseUrl: llmServer.url,
        apiKey: 'test-key',
        model: 'mock-evidence-gate-agent',
        temperature: 0.1,
        timeoutMs: 10000
    };
    const gateway = new AILISGateway({
        port: 0,
        workspaceRoot,
        projectRoot: path.resolve('.'),
        auditDir: path.join(workspaceRoot, '.audit')
    });

    try {
        const status = await gateway.start();
        const result = await runAgent(status.url, {
            sessionId: 'model-input-turn-prompt-test',
            message: '读一下这篇论文《Generative Agents: Interactive Simulacra of Human Behavior》，给我一个概要分析。',
            agentLoop: 'llm',
            maxAgentSteps: 3,
            llmSettings,
            memoryContext: {
                memory_context: {
                    current_dialogue: {
                        type: 'research_reading'
                    }
                }
            },
            context: {
                workspace: workspaceRoot,
                memoryContext: {
                    memory_context: {
                        current_dialogue: {
                            type: 'research_reading'
                        }
                    }
                }
            }
        });

        assert.equal(result.body.ok, true);
        assert.equal(result.body.status, 'completed');
        assert.equal(result.body.taskSpec, undefined);
        assert.equal(result.body.evidenceLedger, undefined);
        assert.equal(result.body.taskGraph, undefined);
        assert.match(result.body.displayText, /没有读取到论文原文|不能把概要说成已经完成/);
        assert.equal(result.body.surface.renderer, 'ailis-persona-renderer');
        assert.equal(llmServer.calls.length, 1);
        const llmUserPayload = parseModelContextPayload(llmServer.calls[0]);
        assert.equal(llmUserPayload.task_brief, undefined);
        assert.equal(llmUserPayload.task_spec, undefined);
        assert.equal(llmUserPayload.evidence_ledger, undefined);
        assert.equal(llmUserPayload.task_graph, undefined);
        assert.equal(llmUserPayload.recent_turn_items, undefined);
        assert.equal(llmUserPayload.runtime_diagnostics, undefined);
        assert.doesNotMatch(llmServer.calls[0].system, /task_brief|TaskSpec|Evidence Ledger|Task Graph/);
        assert.match(llmServer.calls[0].system, /ResponseItem objects/);
        assert.doesNotMatch(llmServer.calls[0].system, /runtime_diagnostics/);
    } finally {
        await gateway.stop();
        await llmServer.close();
    }
});

test('Agentic Executor keeps generic official-doc tasks on the AILIS model-input path', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-generic-doc-prompt-'));
    const llmServer = await createScriptedChatCompletionsServer(() => ({
        mode: 'task',
        intent: 'browser_documentation',
        summary: '需要先查官方文档',
        action: 'final',
        final_answer: '我会先查官方文档，再写 browser-wait-example.md。'
    }));
    const llmSettings = {
        provider: 'openai-compatible',
        baseUrl: llmServer.url,
        apiKey: 'test-key',
        model: 'mock-generic-doc-prompt-agent',
        temperature: 0.1,
        timeoutMs: 10000
    };
    const gateway = new AILISGateway({
        port: 0,
        workspaceRoot,
        projectRoot: path.resolve('.'),
        auditDir: path.join(workspaceRoot, '.audit')
    });

    try {
        const status = await gateway.start();
        const result = await runAgent(status.url, {
            sessionId: 'generic-doc-prompt-test',
            message: 'AILIS，帮我查一下 Playwright 里如何等待元素出现，然后给我写一个最小可运行的 JS 示例，保存成 browser-wait-example.md。要求说明 timeout 怎么设置',
            agentLoop: 'llm',
            maxAgentSteps: 1,
            llmSettings,
            context: {
                workspace: workspaceRoot
            }
        });

        assert.equal(result.body.taskSpec, undefined);
        assert.equal(result.body.evidenceLedger, undefined);
        assert.equal(result.body.taskGraph, undefined);
        assert.equal(llmServer.calls.length, 1);
        const llmUserPayload = parseModelContextPayload(llmServer.calls[0]);
        assert.equal(llmUserPayload.task_brief, undefined);
        assert.equal(llmUserPayload.recent_turn_items, undefined);
        assert.match(llmServer.calls[0].system, /Responses-Compatible Tool Runtime/);
        assert.match(JSON.stringify(llmUserPayload.capability_catalog), /官方技术文档|API 用法|PDF/);
    } finally {
        await gateway.stop();
        await llmServer.close();
    }
});

test('Agentic Executor feeds tool results back through Responses model input items', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-evidence-recovery-'));
    await fs.writeFile(
        path.join(workspaceRoot, 'paper.md'),
        'Generative Agents paper notes: memory stream, reflection, planning, and retrieval are the main pieces.',
        'utf8'
    );
    const llmServer = await createScriptedChatCompletionsServer(({ decisionCount }) => {
        if (decisionCount === 1) {
            return {
                mode: 'task',
                intent: 'research_reading',
                summary: '补齐论文资料证据',
                action: 'tool',
                tool_call: {
                    tool: 'computer',
                    title: '读取论文资料',
                    args: { action: 'read', path: 'paper.md' }
                }
            };
        }
        return {
            mode: 'task',
            intent: 'research_reading',
            summary: '基于读取证据总结',
            action: 'final',
            final_answer: '我这次是基于读到的 paper.md 来说：它主要围绕 memory stream、reflection、planning 和 retrieval 组织智能体行为。'
        };
    });
    const llmSettings = {
        provider: 'openai-compatible',
        baseUrl: llmServer.url,
        apiKey: 'test-key',
        model: 'mock-evidence-recovery-agent',
        temperature: 0.1,
        timeoutMs: 10000
    };
    const gateway = new AILISGateway({
        port: 0,
        workspaceRoot,
        projectRoot: path.resolve('.'),
        auditDir: path.join(workspaceRoot, '.audit')
    });

    try {
        const status = await gateway.start();
        const result = await runAgent(status.url, {
            sessionId: 'evidence-recovery-test',
            message: '读一下 paper.md，给我一个概要分析。',
            agentLoop: 'llm',
            maxAgentSteps: 4,
            llmSettings,
            context: {
                workspace: workspaceRoot
            }
        });

        assert.equal(result.body.ok, true, result.body.displayText);
        assert.equal(result.body.status, 'completed');
        assert.equal(result.body.steps.length, 1);
        assert.match(result.body.displayText, /memory stream|reflection|planning|retrieval/);
        assert.equal(llmServer.calls.length, 2);
        const secondMessages = JSON.stringify(llmServer.calls[1].payload.messages);
        assert.match(secondMessages, /tool_calls/);
        assert.match(secondMessages, /tool_call_id/);
        assert.match(secondMessages, /memory stream|reflection|planning|retrieval/);
        assert.doesNotMatch(secondMessages, /runtime_diagnostics/);
        const transcript = await gateway.runtime.readTranscript(result.body.runId, 100);
        const snapshots = transcript.items.filter((item) => item.type === 'agent.context_snapshot');
        assert.equal(snapshots.length, 2);
        assert.equal(snapshots[0].payload.model_input_request.stats.context_history_items, 2);
        assert.equal(snapshots[1].payload.model_input_request.stats.context_history_items, 4);
        assert.equal(snapshots[0].payload.context_manager_checkpoint?.items.length, 2);
        assert.equal(snapshots[1].payload.context_manager_checkpoint?.items.length, 4);
        assert.deepEqual(
            snapshots[1].payload.context_manager_checkpoint.items.map((item) => item.type).slice(-2),
            ['function_call', 'function_call_output']
        );
        assert.deepEqual(
            snapshots[1].payload.model_input_request.input.map((item) => item.type).slice(-2),
            ['function_call', 'function_call_output']
        );
    } finally {
        await gateway.stop();
        await llmServer.close();
    }
});

test('Agentic Executor allows zero-observation final answers without evidence warnings', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-final-deferral-'));
    await fs.writeFile(path.join(workspaceRoot, 'paper.md'), 'Observed paper evidence from a local file.', 'utf8');
    const llmServer = await createScriptedChatCompletionsServer(({ decisionCount }) => {
        if (decisionCount === 1) {
            return {
                mode: 'task',
                intent: 'research_reading',
                summary: '直接总结论文',
                action: 'final',
                final_answer: '我已经读完并总结好了。'
            };
        }
        if (decisionCount === 2) {
            return {
                mode: 'task',
                intent: 'research_reading',
                summary: '先读取证据',
                action: 'tool',
                tool_call: {
                    tool: 'computer',
                    title: '读取论文证据',
                    args: { action: 'read', path: 'paper.md' }
                }
            };
        }
        return {
            mode: 'task',
            intent: 'research_reading',
            summary: '基于证据总结',
            action: 'final',
            final_answer: '基于读取到的 paper.md 证据，可以继续写概要。'
        };
    });
    const llmSettings = {
        provider: 'openai-compatible',
        baseUrl: llmServer.url,
        apiKey: 'test-key',
        model: 'mock-final-deferral-agent',
        temperature: 0.1,
        timeoutMs: 10000
    };
    const gateway = new AILISGateway({
        port: 0,
        workspaceRoot,
        projectRoot: path.resolve('.'),
        auditDir: path.join(workspaceRoot, '.audit')
    });

    try {
        const status = await gateway.start();
        const result = await runAgent(status.url, {
            sessionId: 'final-deferral-test',
            message: '读一下 paper.md，给我一个概要分析。',
            agentLoop: 'llm',
            maxAgentSteps: 4,
            llmSettings,
            context: {
                workspace: workspaceRoot
            }
        });

        assert.equal(result.body.ok, true, result.body.displayText);
        assert.equal(result.body.status, 'completed');
        assert.equal(llmServer.calls.length, 1);
        assert.equal(result.body.steps.length, 0);
        assert.equal(result.body.events.some((event) => event.status === 'final_without_observation_warning'), false);
        assert.match(result.body.displayText, /我已经读完并总结好了/);
    } finally {
        await gateway.stop();
        await llmServer.close();
    }
});

test('Agentic Executor treats missing command failures as observations for the next decision', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-tool-failure-observation-'));
    const llmServer = await createScriptedChatCompletionsServer(({ decisionCount }) => {
        if (decisionCount === 1) {
            return {
                mode: 'task',
                intent: 'research_reading',
                summary: '尝试用外部解析器读取页面',
                action: 'tool',
                tool_call: {
                    tool: 'exec',
                    title: '尝试外部 HTML 解析器',
                    args: {
                        cmd: '__ailis_missing_parser_tool__ --version',
                        reason: '模拟一个缺失的解析依赖'
                    }
                }
            };
        }
        return {
            mode: 'task',
            intent: 'research_reading',
            summary: '外部解析器不可用，换稳定路径',
            action: 'final',
            final_answer: '这个外部解析器不可用。下一步应该换成内置 web/pdf 读取工具，而不是卡在这一步。'
        };
    });
    const llmSettings = {
        provider: 'openai-compatible',
        baseUrl: llmServer.url,
        apiKey: 'test-key',
        model: 'mock-tool-failure-observation-agent',
        temperature: 0.1,
        timeoutMs: 10000
    };
    const gateway = new AILISGateway({
        port: 0,
        workspaceRoot,
        projectRoot: path.resolve('.'),
        auditDir: path.join(workspaceRoot, '.audit')
    });

    try {
        const status = await gateway.start();
        const result = await runAgent(status.url, {
            sessionId: 'tool-failure-observation-test',
            message: '读一下 https://arxiv.org/abs/1706.03762，先拿页面证据。',
            agentLoop: 'llm',
            maxAgentSteps: 3,
            llmSettings,
            context: {
                workspace: workspaceRoot,
                approved: true,
                confirmationPolicy: 'auto'
            }
        });

        assert.equal(llmServer.calls.length, 2);
        assert.match(result.body.displayText, /外部解析器不可用|换成内置/);
    } finally {
        await gateway.stop();
        await llmServer.close();
    }
});

test('Agentic Executor loads email skill on model request and normalizes new-mail actions', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-email-agent-skill-'));
    const llmServer = await createScriptedChatCompletionsServer(({ decisionCount }) => {
        if (decisionCount === 1) {
            return {
                mode: 'task',
                intent: 'email_management',
                summary: '需要邮箱能力',
                action: 'load_context',
                capability_request: {
                    skills: ['email'],
                    tools: ['email'],
                    mcp: [],
                    reason: '需要检查新邮件'
                }
            };
        }
        return {
            mode: 'task',
            intent: 'email_management',
            summary: '检查新邮件',
            action: 'tool',
            tool_call: {
                tool: 'email',
                title: '检查新邮件',
                args: { action: 'check_new' }
            }
        };
    });
    const llmSettings = {
        provider: 'openai-compatible',
        baseUrl: llmServer.url,
        apiKey: 'test-key',
        model: 'mock-email-agent',
        temperature: 0.1,
        timeoutMs: 10000
    };
    const gateway = new AILISGateway({
        port: 0,
        workspaceRoot,
        projectRoot: path.resolve('.'),
        auditDir: path.join(workspaceRoot, '.audit'),
        emailProfiles: {
            qq: {
                account: 'saved@qq.com',
                secret: 'secret-for-test'
            }
        }
    });

    try {
        const status = await gateway.start();
        const result = await runAgent(status.url, {
            sessionId: 'email-agent-skill-test',
            message: '你好，帮我检查一下邮件有没有新的',
            agentLoop: 'llm',
            dryRun: true,
            llmSettings,
            context: { workspace: workspaceRoot }
        });

        assert.equal(result.body.ok, true, result.body.displayText);
        assert.equal(result.body.status, 'planned');
        assert.equal(result.body.plan[0].tool, 'tool_search');
        assert.match(result.body.plan[0].args.query, /email|邮件/);
        assert.doesNotMatch(llmServer.calls[0].system, /邮箱 SKILL/);
        assert.match(JSON.stringify(llmServer.calls[0].payload.messages), /capability_catalog/);
    } finally {
        await gateway.stop();
        await llmServer.close();
    }
});

test('Agentic Executor email loop observes mailbox results before final answer', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-email-agent-loop-'));
    const llmServer = await createScriptedChatCompletionsServer(({ decisionCount }) => {
        if (decisionCount === 1) {
            return {
                mode: 'task',
                intent: 'email_management',
                summary: '需要邮箱能力',
                action: 'load_context',
                capability_request: {
                    skills: ['email'],
                    tools: ['email'],
                    mcp: [],
                    reason: '需要读取邮箱'
                }
            };
        }
        if (decisionCount === 2) {
            return {
                mode: 'task',
                intent: 'email_management',
                summary: '检查未读邮件',
                action: 'tool',
                tool_call: {
                    tool: 'email',
                    title: '检查未读邮件',
                    args: { action: 'list', filter: 'unread', limit: 10 }
                }
            };
        }
        return {
            mode: 'task',
            intent: 'email_management',
            summary: '已检查未读邮件',
            action: 'final',
            final_answer: '我检查过了，目前没有未读新邮件。'
        };
    });
    const llmSettings = {
        provider: 'openai-compatible',
        baseUrl: llmServer.url,
        apiKey: 'test-key',
        model: 'mock-email-agent',
        temperature: 0.1,
        timeoutMs: 10000
    };
    const gateway = new AILISGateway({
        port: 0,
        workspaceRoot,
        projectRoot: path.resolve('.'),
        auditDir: path.join(workspaceRoot, '.audit')
    });
    const emailCalls = [];

    try {
        const status = await gateway.start();
        const originalCallTool = gateway.callTool.bind(gateway);
        gateway.callTool = async (request) => {
            if (request.tool === 'email') {
                emailCalls.push(request);
                return {
                    ok: true,
                    callId: 'mock-email-call',
                    tool: 'email',
                    status: 'completed',
                    durationMs: 1,
                    result: {
                        content: [
                            {
                                type: 'text',
                                text: '邮件列表：0 封未读新邮件。'
                            }
                        ],
                        details: {
                            messages: []
                        }
                    }
                };
            }
            return await originalCallTool(request);
        };

        const result = await runAgent(status.url, {
            sessionId: 'email-agent-loop-test',
            message: '检查一下我的邮箱有没有新的',
            agentLoop: 'llm',
            llmSettings,
            context: {
                workspace: workspaceRoot,
                approved: true,
                confirmationPolicy: 'auto'
            }
        });

        assert.equal(result.body.ok, true, result.body.displayText);
        assert.equal(result.body.status, 'completed');
        assert.equal(emailCalls.length, 1);
        assert.equal(emailCalls[0].args.action, 'list');
        assert.equal(emailCalls[0].args.filter, 'unread');
        assert.match(result.body.displayText, /没有未读新邮件/);
        assert.match(JSON.stringify(llmServer.calls[1].payload.messages), /tool_search|email/);
        assert.match(JSON.stringify(llmServer.calls[2].payload.messages), /0 封未读新邮件/);
    } finally {
        await gateway.stop();
        await llmServer.close();
    }
});

test('Agentic Executor renders email tool failures through persona surface instead of raw tool text', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-email-agent-failure-'));
    const llmServer = await createScriptedChatCompletionsServer(({ decisionCount }) => {
        if (decisionCount === 1) {
            return {
                mode: 'task',
                intent: 'email_management',
                summary: '需要邮箱能力',
                action: 'load_context',
                capability_request: {
                    skills: ['email'],
                    tools: ['email'],
                    mcp: [],
                    reason: '需要读取未读邮件'
                }
            };
        }
        if (decisionCount === 2) {
            return {
                mode: 'task',
                intent: 'email_management',
                summary: '检查未读邮件',
                action: 'tool',
                tool_call: {
                    tool: 'email',
                    title: '检查未读邮件',
                    args: { action: 'list', filter: 'unread', limit: 10 }
                }
            };
        }
        return {
            mode: 'task',
            intent: 'email_management',
            summary: '邮箱没有配置',
            action: 'final',
            final_answer: '邮箱账号还没配置好，所以这次没法读取新邮件。'
        };
    });
    const llmSettings = {
        provider: 'openai-compatible',
        baseUrl: llmServer.url,
        apiKey: 'test-key',
        model: 'mock-email-failure-agent',
        temperature: 0.1,
        timeoutMs: 10000
    };
    const gateway = new AILISGateway({
        port: 0,
        workspaceRoot,
        projectRoot: path.resolve('.'),
        auditDir: path.join(workspaceRoot, '.audit')
    });
    const emailCalls = [];

    try {
        const status = await gateway.start();
        const originalCallTool = gateway.callTool.bind(gateway);
        gateway.callTool = async (request) => {
            if (request.tool === 'email') {
                emailCalls.push(request);
                return {
                    ok: false,
                    callId: 'mock-email-needs-config',
                    tool: 'email',
                    status: 'needs_config',
                    durationMs: 1,
                    error: 'email 工具需要 account/email 参数，或设置 AILIS_EMAIL_<PROVIDER>_ACCOUNT。'
                };
            }
            return await originalCallTool(request);
        };

        const result = await runAgent(status.url, {
            sessionId: 'email-agent-failure-test',
            message: '帮我看看有没有 GitHub 的新邮件',
            agentLoop: 'llm',
            llmSettings,
            context: {
                workspace: workspaceRoot,
                approved: true,
                confirmationPolicy: 'auto'
            }
        });

        assert.equal(result.body.ok, true);
        assert.equal(result.body.status, 'completed');
        assert.equal(emailCalls.length, 1);
        assert.match(result.body.displayText, /邮箱账号还没配置/);
        assert.doesNotMatch(result.body.displayText, /AILIS_EMAIL|<PROVIDER>|tool_call|raw observation/);
        assert.doesNotMatch(result.body.speechText, /AILIS_EMAIL|<PROVIDER>|tool_call|raw observation/);
    } finally {
        await gateway.stop();
        await llmServer.close();
    }
});
