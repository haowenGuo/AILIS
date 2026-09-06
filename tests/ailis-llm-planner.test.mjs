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
} = require('../electron/agent-loop/index.cjs');
const { buildObservationLedgerPromptObject } = require('../electron/ailis-turn-items.cjs');
const { ContextManager } = require('../electron/ailis-context-manager.cjs');
const {
    normalizeTimeoutMs
} = require('../electron/desktop-llm-provider.cjs');
const {
    resolveCodexNativeInstructions
} = require('../electron/codex-native-instructions.cjs');

test('desktop LLM provider preserves configured agent decision timeouts up to ten minutes', () => {
    assert.equal(normalizeTimeoutMs(360000), 360000);
    assert.equal(normalizeTimeoutMs(15 * 60 * 1000), 10 * 60 * 1000);
});

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
    for (const message of messages.filter((entry) => ['system', 'developer', 'user'].includes(entry.role))) {
        try {
            const parsed = JSON.parse(message.content);
            if (parsed?.type === 'context') return parsed;
        } catch {
            // Ignore non-JSON instructions and user goal messages.
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

test('Agent turn items keep successful web fetches as ordinary observations', () => {
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
    assert.equal(Object.hasOwn(turnItems.latest_observation, 'evidence_gap'), false);
    assert.match(turnItems.latest_observation.preview, /ClinicalTrials\.gov/);
    assert.doesNotMatch(JSON.stringify(turnItems.items), /structured_api_preferred/);
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

    const legacyExactAnswerProfile = resolveAgentPromptProfile(
        { provider: 'openai-compatible' },
        { exactAnswerMode: true }
    );
    assert.equal(legacyExactAnswerProfile.id, 'full');
    assert.equal(legacyExactAnswerProfile.compact, false);

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

test('TaskAgent main loop semantically compacts over-budget history and preserves durable task state', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-main-loop-semantic-compact-'));
    const originalGoal = 'Verify the release date and answer with the official source.';
    const items = [
        {
            type: 'message',
            role: 'user',
            content: [{ type: 'input_text', text: JSON.stringify({ type: 'context', attached_files: [{ path: 'release.pdf' }] }) }]
        },
        {
            type: 'message',
            role: 'user',
            content: [{ type: 'input_text', text: originalGoal }]
        }
    ];
    for (let index = 0; index < 16; index += 1) {
        items.push({
            type: 'function_call',
            call_id: `main-loop-call-${index}`,
            name: 'web_fetch',
            arguments: JSON.stringify({ url: `https://example.test/releases/${index}` })
        });
        items.push({
            type: 'function_call_output',
            call_id: `main-loop-call-${index}`,
            output: `Status: completed\noutputId=checkpoint-output-${index}\n${'release evidence '.repeat(420)}`
        });
    }
    const manager = new ContextManager({ items, toolOutputChars: 50000 });
    const llmServer = await createScriptedChatCompletionsServer(() => ({
        action: 'final',
        final_answer: 'The preserved evidence supports the release-date answer.'
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
            sessionId: 'main-loop-semantic-compact-test',
            message: originalGoal,
            agentLoop: 'llm',
            initialContextManagerCheckpoint: manager.toCheckpoint(),
            initialPlan: {
                intent: 'release_verification',
                steps: [{ step: 'Verify the official publication date', status: 'in_progress' }]
            },
            initialStepResults: [
                {
                    id: 'official-release-evidence',
                    tool: 'web_fetch',
                    title: 'Official release page',
                    evidenceArtifacts: [{
                        id: 'official-release-artifact',
                        type: 'WebEvidence',
                        summary: 'Official release date evidence.'
                    }],
                    response: {
                        ok: true,
                        status: 'completed',
                        result: {
                            content: [{ type: 'text', text: 'Official release date evidence.' }],
                            details: { outputId: 'official-release-output' }
                        }
                    }
                },
                {
                    id: 'missing-publication-field',
                    tool: 'web_fetch',
                    title: 'Publication metadata gap',
                    response: {
                        ok: false,
                        status: 'incomplete',
                        error: 'official publication date remains unresolved',
                        result: { details: { missing_fields: ['official publication date'] } }
                    }
                }
            ],
            llmSettings: {
                provider: 'openai-compatible',
                baseUrl: llmServer.url,
                apiKey: 'test-key',
                model: 'mock-semantic-compact',
                timeoutMs: 10000
            },
            context: {
                workspace: workspaceRoot,
                agentRole: 'task_agent',
                contextMode: 'task_agent',
                taskAgentInheritanceMode: 'checkpoint',
                contextWindowTokens: 9000,
                reservedOutputTokens: 1000,
                taskConstraints: ['Use the official source.']
            }
        });

        assert.equal(result.body.ok, true, result.body.displayText);
        const transcript = await gateway.runtime.readTranscript(result.body.runId, 200);
        const compacted = transcript.items.find((item) => item.type === 'agent.context_compaction');
        assert.ok(compacted, JSON.stringify(transcript.items.map((item) => item.type)));
        assert.equal(compacted.payload.historyVersion, 1);
        const checkpointText = JSON.stringify(compacted.payload.checkpoint);
        assert.match(checkpointText, /Verify the release date and answer with the official source/);
        assert.match(checkpointText, /Use the official source/);
        assert.match(checkpointText, /Verify the official publication date/);
        assert.match(checkpointText, /official publication date remains unresolved/);
        assert.doesNotMatch(checkpointText, /evidenceManifest|pinnedEvidenceManifest|evidenceRefs/);
        assert.match(checkpointText, /checkpoint-output-15/);
    } finally {
        await gateway.stop();
        await llmServer.close();
        await fs.rm(workspaceRoot, { recursive: true, force: true });
    }
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
                          tool: 'exec_command',
                          title: '创建目标目录',
                          args: { cmd: 'New-Item -ItemType Directory -Path planner-output -Force' }
                      }
                },
                {
                    mode: 'task',
                    intent: 'create_workspace_note',
                    summary: '创建目录并写入说明文件',
                    action: 'tool',
                    plan_update: ['目录已创建，写入说明文件'],
                    tool_call: {
                        tool: 'apply_patch',
                        title: '写入说明文件',
                        args: {
                            input: '*** Begin Patch\n*** Add File: planner-output/README.txt\n+Agentic Executor OK\n*** End Patch'
                        }
                    }
                },
                {
                    mode: 'task',
                    intent: 'create_workspace_note',
                    summary: '创建目录并写入说明文件',
                    action: 'final',
                    final_answer: '**Agentic Executor 已完成**\n\n- 目录和 README.txt 已创建'
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

async function createToolChoiceCompatibilityServer({ fallbackSucceeds = true } = {}) {
    const calls = [];
    const server = http.createServer(async (req, res) => {
        let raw = '';
        req.on('data', (chunk) => {
            raw += chunk;
        });
        req.on('end', () => {
            const payload = raw ? JSON.parse(raw) : {};
            calls.push({ url: req.url, payload });
            const isSpecificChoice = Boolean(
                payload.tool_choice &&
                typeof payload.tool_choice === 'object' &&
                payload.tool_choice !== null
            );
            if (isSpecificChoice || !fallbackSucceeds) {
                res.writeHead(400, { 'content-type': 'application/json' });
                res.end(JSON.stringify({
                    error: {
                        message: 'Thinking mode does not support this tool_choice',
                        type: 'invalid_request_error',
                        code: 'invalid_request_error'
                    }
                }));
                return;
            }
            res.writeHead(200, { 'content-type': 'application/json' });
            res.end(JSON.stringify({
                choices: [{
                    message: {
                        content: '',
                        tool_calls: [{
                            id: 'task-route-auto-fallback',
                            type: 'function',
                            function: {
                                name: 'task_route',
                                arguments: JSON.stringify({ mode: 'chat', progress_note: '' })
                            }
                        }]
                    }
                }],
                usage: { prompt_tokens: 10, completion_tokens: 4, total_tokens: 14 }
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

async function createSteerAwareChatCompletionsServer(firstResponseDelayMs = 250) {
    const calls = [];
    const server = http.createServer((req, res) => {
        let raw = '';
        req.on('data', (chunk) => {
            raw += chunk;
        });
        req.on('end', () => {
            const payload = raw ? JSON.parse(raw) : {};
            calls.push({ url: req.url, payload });
            const callNumber = calls.length;
            const respond = () => {
                const message = decisionObjectToChatMessage({
                    mode: 'task',
                    intent: 'turn_steer_probe',
                    action: 'final',
                    final_answer: callNumber === 1
                        ? '未看到补充要求时的旧答案'
                        : '已按英文 Wikipedia 核实：2000—2009 年共 3 张。'
                }, `steer-aware-${callNumber}`);
                res.writeHead(200, { 'content-type': 'application/json' });
                res.end(JSON.stringify({
                    choices: [{ message }],
                    usage: { prompt_tokens: 10, completion_tokens: 5, total_tokens: 15 }
                }));
            };
            if (callNumber === 1) {
                setTimeout(respond, firstResponseDelayMs);
            } else {
                respond();
            }
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

test('Agent prompts inject runtime_environment from the active platform adapter', async () => {
    const cases = [
        {
            platform: 'win32',
            env: { ComSpec: 'C:\\Windows\\System32\\cmd.exe' },
            expectedFamily: 'windows',
            expectedPathStyle: 'windows',
            expectedShellDialect: 'powershell'
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
            assert.match(userPayload.runtime_environment.current_date, /^\d{4}-\d{2}-\d{2}$/);
            assert.match(userPayload.runtime_environment.current_time, /^\d{2}:\d{2}:\d{2}$/);
            assert.ok(userPayload.runtime_environment.timezone);
            assert.match(userPayload.runtime_environment.utc_offset, /^[+-]\d{2}:\d{2}$/);
            assert.match(userPayload.runtime_environment.command_guidance, /Do not assume|not Linux by default|POSIX/);
            assert.match(JSON.stringify(llmServer.calls[0].payload.messages), /runtime_environment/);
            const contextMessages = llmServer.calls[0].payload.messages.filter((message) => {
                if (!['system', 'developer'].includes(message.role)) return false;
                try {
                    return JSON.parse(message.content)?.type === 'context';
                } catch {
                    return false;
                }
            });
            assert.equal(contextMessages.length, 1);
            assert.equal(
                llmServer.calls[0].payload.messages.filter((message) => message.role === 'user').length,
                1
            );
            assert.equal(llmServer.calls[0].system, resolveCodexNativeInstructions(`mock-${item.expectedFamily}`));
            assert.doesNotMatch(llmServer.calls[0].system, /当前桌面端优先 Windows|Windows 桌面端命令必须/);
        } finally {
            await gateway.stop();
            await llmServer.close();
            await fs.rm(workspaceRoot, { recursive: true, force: true });
        }
    }
});

test('Desktop real eval can pin only the runtime clock while preserving platform metadata', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-runtime-clock-'));
    const llmServer = await createScriptedChatCompletionsServer(() => ({
        mode: 'task',
        intent: 'runtime_clock_probe',
        summary: 'probe runtime clock',
        action: 'final',
        final_answer: 'runtime clock observed'
    }));
    const gateway = new AILISGateway({
        port: 0,
        workspaceRoot,
        projectRoot: path.resolve('.'),
        auditDir: path.join(workspaceRoot, '.audit'),
        platformAdapter: new AILISPlatformAdapter({
            platform: 'win32',
            hostPlatform: 'win32',
            env: { ComSpec: 'C:\\Windows\\System32\\cmd.exe' }
        })
    });

    try {
        const status = await gateway.start();
        const result = await runAgent(status.url, {
            sessionId: 'runtime-clock-override',
            message: 'Confirm the benchmark clock.',
            agentLoop: 'llm',
            directToolExecutor: false,
            llmSettings: {
                provider: 'openai-compatible',
                baseUrl: llmServer.url,
                apiKey: 'test-key',
                model: 'mock-runtime-clock',
                temperature: 0,
                timeoutMs: 10000
            },
            context: {
                workspace: workspaceRoot,
                directToolExecutor: false,
                nativeDirectTools: false,
                desktopRealEval: true,
                runtimeEnvironmentOverride: {
                    source: 'toolsandbox_benchmark_clock',
                    current_date: '2026-07-17',
                    current_time: '06:06:27',
                    current_datetime: '2026-07-17T06:06:27+08:00',
                    utc_offset: '+08:00'
                }
            }
        });

        assert.equal(result.body.ok, true, JSON.stringify(result.body));
        const runtimeEnvironment = parseModelContextPayload(
            llmServer.calls[0]
        ).runtime_environment;
        assert.equal(runtimeEnvironment.source, 'toolsandbox_benchmark_clock');
        assert.equal(runtimeEnvironment.current_date, '2026-07-17');
        assert.equal(runtimeEnvironment.current_time, '06:06:27');
        assert.equal(runtimeEnvironment.current_datetime, '2026-07-17T06:06:27+08:00');
        assert.equal(runtimeEnvironment.utc_offset, '+08:00');
        assert.equal(runtimeEnvironment.family, 'windows');
        assert.equal(runtimeEnvironment.path_style, 'windows');
        assert.equal(runtimeEnvironment.shell_dialect, 'powershell');
    } finally {
        await gateway.stop();
        await llmServer.close();
        await fs.rm(workspaceRoot, { recursive: true, force: true });
    }
});

test('Persona prompt stays in AILIS persona and exposes handoff plus read-only screen context', async () => {
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
        assert.match(llmServer.calls[0].system, /authoritative host clock/);
        assert.match(llmServer.calls[0].system, /call handoff_task exactly once/);
        assert.match(llmServer.calls[0].system, /transfers only execution control/);
        assert.match(llmServer.calls[0].system, /same canonical visible Session conversation/);
        assert.match(llmServer.calls[0].system, /TaskResult packet is the factual boundary/);
        assert.doesNotMatch(llmServer.calls[0].system, /continuation=/);
        const toolNames = (llmServer.calls[0].payload.tools || []).map((tool) => tool.function?.name || tool.name);
        assert.deepEqual(toolNames, ['handoff_task', 'vision_capture_context']);
        const handoffTool = llmServer.calls[0].payload.tools[0]?.function || llmServer.calls[0].payload.tools[0];
        assert.deepEqual(handoffTool?.parameters?.properties, {});
        const visionTool = llmServer.calls[0].payload.tools[1]?.function || llmServer.calls[0].payload.tools[1];
        assert.equal(visionTool?.name, 'vision_capture_context');
        assert.match(visionTool?.description || '', /user does not need to explicitly ask/i);
        const contextPayload = parseModelContextPayload(llmServer.calls[0]);
        const memoryMessage = llmServer.calls[0].payload.messages.find((message) =>
            (message.role === 'developer' || message.role === 'system') &&
            /<memory_context>/.test(String(message.content || ''))
        );
        assert.match(memoryMessage?.content || '', /<memory_context>/);
        assert.match(memoryMessage?.content || '', /## Persona/);
        assert.equal(contextPayload.memory_context, undefined);
        assert.equal(contextPayload.capability_catalog, undefined);
        assert.equal(contextPayload.external_tool_exposure, undefined);
        const rawTurns = gateway.rawMemoryLedger.replay({
            type: 'chat.llm_turn',
            sessionId: 'persona-orchestrator-test',
            includePayload: true,
            limit: 20
        });
        assert.ok(rawTurns.entries.some((entry) =>
            entry.payload?.requestPayload?.memoryUserMessage === '你好呀'
        ));
    } finally {
        await gateway.stop();
        await llmServer.close();
        await fs.rm(workspaceRoot, { recursive: true, force: true });
    }
});

test('Persona hands one exact request to the system TaskAgent and renders its compact result', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-system-task-handoff-'));
    const llmServer = await createScriptedChatCompletionsServer(({ decisionCount }) => {
        if (decisionCount === 1) {
            return {
                action: 'tool',
                summary: '开始处理。',
                tool_call: {
                    tool: 'handoff_task',
                    args: {}
                }
            };
        }
        throw new Error('Persona should not receive the TaskAgent result as a second model turn');
    });
    const gateway = new AILISGateway({
        port: 0,
        workspaceRoot,
        projectRoot: path.resolve('.'),
        auditDir: path.join(workspaceRoot, '.audit')
    });
    const taskCalls = [];
    gateway.taskAgentHarness.executeTaskAgent = async (payload) => {
        taskCalls.push(payload);
        return {
            ok: true,
            status: 'completed',
            runId: payload.agent.childRunId,
            displayText: 'BaseLabelPropagation',
            cost: {
                schema: 'ailis.run_cost.v1',
                run_id: payload.agent.childRunId,
                session_id: payload.agent.childSessionId,
                wall_clock_ms: 100,
                own: {
                    llm: {
                        calls: 1,
                        duration_ms: 80,
                        usage: {
                            promptTokens: 70,
                            completionTokens: 30,
                            totalTokens: 100,
                            reasoningTokens: 0,
                            cachedTokens: 40,
                            uncachedPromptTokens: 30
                        },
                        by_model: []
                    },
                    tools: { calls: 0, duration_ms: 0 }
                },
                nested: {
                    runs: 0,
                    child_wall_clock_ms: 0,
                    llm: { calls: 0, duration_ms: 0, usage: {}, by_model: [] },
                    tools: { calls: 0, duration_ms: 0 }
                },
                total: {
                    runs: 1,
                    llm: {
                        calls: 1,
                        duration_ms: 80,
                        usage: {
                            promptTokens: 70,
                            completionTokens: 30,
                            totalTokens: 100,
                            reasoningTokens: 0,
                            cachedTokens: 40,
                            uncachedPromptTokens: 30
                        },
                        by_model: []
                    },
                    tools: { calls: 0, duration_ms: 0 }
                }
            },
            steps: [{ private: 'not model visible' }],
            taskRunHandoff: {
                status: 'completed',
                finalAnswer: 'BaseLabelPropagation',
                partialAnswer: '',
                sourceRefs: [{ ref_id: 'source-1', title: 'Changelog', url: 'https://example.test/changelog' }],
                collectedData: [],
                traceRef: payload.agent.childRunId,
                resume: { contextManagerCheckpoint: { private: true }, checkpointAvailable: true }
            }
        };
    };

    try {
        const status = await gateway.start();
        const result = await runAgent(status.url, {
            sessionId: 'system-task-handoff-test',
            message: '核对官方资料并只给出类名。',
            agentLoop: 'llm',
            maxAgentSteps: 4,
            llmSettings: {
                provider: 'openai-compatible',
                baseUrl: llmServer.url,
                apiKey: 'test-key',
                model: 'mock-system-task-handoff',
                temperature: 0,
                timeoutMs: 10000
            },
            context: {
                workspace: workspaceRoot,
                agentLoop: 'llm',
                directToolExecutor: true,
                nativeDirectTools: true,
                directToolLimit: 35,
                maxAgentSteps: 4,
                agentRole: 'persona_orchestrator',
                requireTaskExecution: true,
                requireExecutionEvidence: true,
                desktopRealEval: true,
                benchmarkName: 'Apple ToolSandbox',
                benchmarkScenario: 'toolsandbox-scenario-1',
                runtimeEnvironmentOverride: {
                    source: 'toolsandbox_benchmark_clock',
                    current_date: '2026-07-17',
                    current_time: '06:06:27',
                    current_datetime: '2026-07-17T06:06:27+08:00',
                    utc_offset: '+08:00'
                }
            }
        });

        assert.equal(result.body.ok, true, JSON.stringify(result.body));
        assert.equal(result.body.displayText, 'BaseLabelPropagation');
        assert.equal(result.body.finalAnswer, 'BaseLabelPropagation');
        assert.equal(result.body.intent, 'persona_task_handoff_result');
        assert.equal(result.body.taskResult?.schema, 'ailis.task_result.v1');
        assert.equal(result.body.cost.schema, 'ailis.run_cost.v1');
        assert.equal(result.body.cost.own.llm.usage.totalTokens, 20);
        assert.equal(result.body.cost.nested.llm.usage.totalTokens, 100);
        assert.equal(result.body.cost.total.llm.usage.totalTokens, 120);
        assert.equal(result.body.cost.total.llm.usage.cachedTokens, 40);
        assert.equal(taskCalls.length, 1);
        assert.equal(taskCalls[0].agent.task, '核对官方资料并只给出类名。');
        assert.equal(taskCalls[0].context.originalUserGoal, undefined);
        assert.equal(taskCalls[0].context.currentTaskRequest, '核对官方资料并只给出类名。');
        assert.ok(taskCalls[0].context.taskAgentThreadId);
        assert.ok(taskCalls[0].context.taskAgentTurnId);
        assert.equal(taskCalls[0].context.desktopRealEval, true);
        assert.equal(taskCalls[0].context.benchmarkName, 'Apple ToolSandbox');
        assert.equal(taskCalls[0].context.benchmarkScenario, 'toolsandbox-scenario-1');
        assert.equal(taskCalls[0].context.directToolLimit, 35);
        assert.equal(Object.hasOwn(taskCalls[0].context, 'requireExecutionEvidence'), false);
        assert.deepEqual(taskCalls[0].context.runtimeEnvironmentOverride, {
            source: 'toolsandbox_benchmark_clock',
            current_date: '2026-07-17',
            current_time: '06:06:27',
            current_datetime: '2026-07-17T06:06:27+08:00',
            utc_offset: '+08:00'
        });
        assert.equal(llmServer.calls.length, 1);
        assert.notEqual(llmServer.calls[0].payload.tool_choice, 'auto');
        assert.match(JSON.stringify(llmServer.calls[0].payload.tool_choice), /handoff_task/);
        assert.match(llmServer.calls[0].system, /explicit task-execution contract/i);
    } finally {
        await gateway.stop();
        await llmServer.close();
        await fs.rm(workspaceRoot, { recursive: true, force: true });
    }
});

test.skip('legacy Persona mailbox transport is replaced by system handoff', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-persona-handoff-once-'));
    const llmServer = await createScriptedChatCompletionsServer(({ decisionCount }) => {
        if (decisionCount === 1) {
            return {
                action: 'tool',
                summary: '交给干净的 TaskAgent 执行。',
                tool_call: {
                    tool: 'spawn_agent',
                    args: {
                        task_name: 'sandrone_guide',
                        message: '核验截至当前日期《原神》“木偶”桑多涅是否已经实装；使用新鲜网页证据，若已实装则完成角色攻略。',
                        fork_turns: 'all'
                    }
                }
            };
        }
        if (decisionCount === 2) {
            return {
                action: 'tool',
                summary: '等待 TaskAgent 完成。',
                tool_call: {
                    tool: 'wait_agent',
                    args: { timeout_ms: 1000 }
                }
            };
        }
        return {
            action: 'final',
            final_answer: 'AILIS final answer: 42'
        };
    });
    const gateway = new AILISGateway({
        port: 0,
        workspaceRoot,
        projectRoot: path.resolve('.'),
        auditDir: path.join(workspaceRoot, '.audit')
    });
    const agentCalls = [];
    const gatewayToolCalls = [];
    const originalCallTool = gateway.callTool.bind(gateway);
    gateway.callTool = async (request) => {
        if (['spawn_agent', 'wait_agent'].includes(request?.tool)) {
            gatewayToolCalls.push({
                tool: request.tool,
                timeoutMs: request.timeoutMs,
                contextTimeoutMs: request.context?.timeoutMs,
                waitTimeoutMs: request.args?.timeout_ms
            });
        }
        return originalCallTool(request);
    };

    try {
        gateway.runtime.agent_control.execute_agent = async ({ agent, args, context }) => {
            agentCalls.push({ agent, args, context });
            await new Promise((resolve) => setTimeout(resolve, 50));
            return {
                ok: true,
                status: 'completed',
                displayText: 'TaskAgent 已核验当前资料并完成木偶攻略。',
                finalAnswer: '已核验并完成攻略'
            };
        };
        const status = await gateway.start();
        const result = await runAgent(status.url, {
            sessionId: 'persona-handoff-once-test',
            message: '已经实装了',
            messageHistory: [
                { role: 'user', content: '做一套木偶的攻略' },
                { role: 'assistant', content: '你说的是哪个作品里的木偶呀？' },
                { role: 'user', content: '原神的' },
                { role: 'assistant', content: '我记忆里她还没有实装。' },
                { role: 'user', content: '已经实装了' }
            ],
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
        assert.equal(result.body.planner, 'llm-agentic-executor');
        assert.equal(result.body.displayText, '已核验并完成攻略');
        assert.equal(result.body.finalAnswer, '已核验并完成攻略');
        assert.equal(llmServer.calls.length, 3);
        assert.equal(agentCalls.length, 1);
        assert.equal(
            agentCalls[0].args.message,
            '核验截至当前日期《原神》“木偶”桑多涅是否已经实装；使用新鲜网页证据，若已实装则完成角色攻略。'
        );
        assert.equal(agentCalls[0].context.maxAgentSteps, 4);
        assert.equal(agentCalls[0].context.cleanContext, false);
        assert.equal(agentCalls[0].context.taskAgentInheritanceMode, 'checkpoint');
        assert.ok(agentCalls[0].context.initialContextManagerCheckpoint);
        assert.equal(agentCalls[0].context.contextMode, 'task_agent');
        assert.deepEqual(gatewayToolCalls.map((call) => call.tool), ['spawn_agent', 'wait_agent']);
        assert.equal(gatewayToolCalls[1].waitTimeoutMs, 1000);
        assert.match(JSON.stringify(llmServer.calls[0].payload.messages), /原神的/);
        assert.match(JSON.stringify(llmServer.calls[0].payload.messages), /已经实装了/);
        assert.match(JSON.stringify(llmServer.calls[1].payload.messages), /root\/sandrone_guide/);
        assert.match(JSON.stringify(llmServer.calls[2].payload.messages), /subagent_notification/);
        assert.match(JSON.stringify(llmServer.calls[2].payload.messages), /TaskAgent 已核验当前资料并完成木偶攻略/);
        assert.match(JSON.stringify(llmServer.calls[2].payload.messages), /may_add_facts/);
    } finally {
        await gateway.stop();
        await llmServer.close();
        await fs.rm(workspaceRoot, { recursive: true, force: true });
    }
});

test.skip('legacy Persona round-budget mailbox finalization is replaced by system handoff', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-persona-budget-finalization-'));
    const llmServer = await createScriptedChatCompletionsServer(({ decisionCount }) => {
        if (decisionCount === 1) {
            return {
                action: 'tool',
                tool_call: {
                    tool: 'spawn_agent',
                    args: {
                        task_name: 'gaia_exact_answer',
                        message: 'Research the question and return the supported exact answer.',
                        fork_turns: 'all'
                    }
                }
            };
        }
        if (decisionCount === 2) {
            return {
                action: 'tool',
                tool_call: {
                    tool: 'wait_agent',
                    args: { timeout_ms: 1 }
                }
            };
        }
        if (decisionCount === 3) {
            return {
                action: 'tool',
                tool_call: {
                    tool: 'list_agents',
                    args: {}
                }
            };
        }
        if (decisionCount === 4) {
            return '{"tool_calls":[{"name":"task_results","arguments":{}}]}';
        }
        return {
            action: 'final',
            final_answer: 'The exact answer is 17.'
        };
    });
    const gateway = new AILISGateway({
        port: 0,
        workspaceRoot,
        projectRoot: path.resolve('.'),
        auditDir: path.join(workspaceRoot, '.audit')
    });

    try {
        gateway.runtime.agent_control.execute_agent = async () => {
            await delay(50);
            return {
                ok: true,
                status: 'completed',
                displayText: 'Verified calculation and sources. Final answer: 17.',
                finalAnswer: '17'
            };
        };
        const status = await gateway.start();
        const result = await runAgent(status.url, {
            sessionId: 'persona-budget-finalization-test',
            message: 'Calculate the requested value and give the exact answer.',
            agentLoop: 'llm',
            maxAgentSteps: 4,
            llmSettings: {
                provider: 'openai-compatible',
                baseUrl: llmServer.url,
                apiKey: 'test-key',
                model: 'mock-persona-budget-finalization',
                temperature: 0,
                timeoutMs: 10000
            },
            context: {
                workspace: workspaceRoot,
                agentLoop: 'llm',
                directToolExecutor: true,
                approved: true,
                agentRole: 'persona_orchestrator',
                agentWaitTimeoutMs: 1000
            }
        });

        assert.equal(result.body.ok, true, JSON.stringify(result.body));
        assert.equal(result.body.status, 'completed');
        assert.equal(result.body.displayText, '17');
        assert.equal(result.body.finalAnswer, '17');
        assert.equal(llmServer.calls.length, 5);
        assert.deepEqual(llmServer.calls[3].payload.tools || [], []);
        assert.deepEqual(llmServer.calls[4].payload.tools || [], []);
        assert.match(llmServer.calls[3].system, /user-facing AILIS final response layer/);
        const finalizationMessages = JSON.stringify(llmServer.calls[3].payload.messages);
        assert.match(finalizationMessages, /finalAnswer/);
        assert.match(finalizationMessages, /17/);
        assert.match(finalizationMessages, /may_add_facts/);
        assert.match(finalizationMessages, /ORIGINAL_USER_REQUEST/);
        assert.doesNotMatch(result.body.displayText, /tool_calls|subagent_notification|TaskAgent/);
    } finally {
        await gateway.stop();
        await llmServer.close();
        await fs.rm(workspaceRoot, { recursive: true, force: true });
    }
});

test.skip('legacy Persona live-child settlement is replaced by blocking system handoff', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-persona-early-final-'));
    const llmServer = await createScriptedChatCompletionsServer(({ decisionCount }) => {
        if (decisionCount === 1) {
            return {
                action: 'tool',
                summary: '交给 TaskAgent 核验攻略。',
                tool_call: {
                    tool: 'spawn_agent',
                    args: {
                        task_name: 'roxy_guide',
                        message: '核验并整理《明日方舟：终末地》洛茜攻略。',
                        fork_turns: 'all'
                    }
                }
            };
        }
        if (decisionCount === 2) {
            return {
                action: 'final',
                final_answer: '不应提前返回的旧攻略。'
            };
        }
        return {
            action: 'final',
            final_answer: '基于本轮 TaskAgent 结果整理的洛茜攻略。'
        };
    });
    const gateway = new AILISGateway({
        port: 0,
        workspaceRoot,
        projectRoot: path.resolve('.'),
        auditDir: path.join(workspaceRoot, '.audit')
    });
    const agentCalls = [];

    try {
        gateway.runtime.agent_control.execute_agent = async ({ agent, args, context }) => {
            agentCalls.push({ agent, args, context });
            await new Promise((resolve) => setTimeout(resolve, 100));
            return {
                ok: true,
                status: 'completed',
                displayText: '本轮 TaskAgent 已完成洛茜攻略。',
                finalAnswer: '洛茜攻略的新鲜证据与结论'
            };
        };
        const status = await gateway.start();
        const result = await runAgent(status.url, {
            sessionId: 'persona-early-final-test',
            message: '做一套洛茜的攻略，终末地的洛茜',
            agentLoop: 'llm',
            llmSettings: {
                provider: 'openai-compatible',
                baseUrl: llmServer.url,
                apiKey: 'test-key',
                model: 'mock-persona-early-final',
                temperature: 0,
                timeoutMs: 10000
            },
            context: {
                workspace: workspaceRoot,
                agentLoop: 'llm',
                directToolExecutor: true,
                approved: true,
                agentRole: 'persona_orchestrator',
                agentWaitTimeoutMs: 1000
            }
        });

        assert.equal(result.body.ok, true, JSON.stringify(result.body));
        assert.equal(result.body.displayText, '洛茜攻略的新鲜证据与结论');
        assert.equal(result.body.finalAnswer, '洛茜攻略的新鲜证据与结论');
        assert.equal(llmServer.calls.length, 3);
        assert.equal(agentCalls.length, 1);
        assert.doesNotMatch(result.body.displayText, /旧攻略/);
        assert.match(JSON.stringify(llmServer.calls[2].payload.messages), /subagent_notification/);
        assert.match(JSON.stringify(llmServer.calls[2].payload.messages), /本轮 TaskAgent 已完成洛茜攻略/);
    } finally {
        await gateway.stop();
        await llmServer.close();
        await fs.rm(workspaceRoot, { recursive: true, force: true });
    }
});

test.skip('legacy renamed spawn deduplication is replaced by Harness continuation state', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-persona-single-owner-'));
    const llmServer = await createScriptedChatCompletionsServer(({ decisionCount }) => {
        if (decisionCount === 1) {
            return {
                action: 'tool',
                tool_call: {
                    tool: 'spawn_agent',
                    args: { task_name: 'guide', message: 'research guide', fork_turns: 'none' }
                }
            };
        }
        if (decisionCount === 2) {
            return { action: 'tool', tool_call: { tool: 'wait_agent', args: { timeout_ms: 1000 } } };
        }
        if (decisionCount === 3) {
            return {
                action: 'tool',
                tool_call: {
                    tool: 'spawn_agent',
                    args: { task_name: 'guide_supplement', message: 'search missing details', fork_turns: 'none' }
                }
            };
        }
        return { action: 'final', final_answer: 'integrated original TaskAgent result' };
    });
    const gateway = new AILISGateway({
        port: 0,
        workspaceRoot,
        projectRoot: path.resolve('.'),
        auditDir: path.join(workspaceRoot, '.audit')
    });
    let childRuns = 0;
    try {
        gateway.runtime.agent_control.execute_agent = async () => {
            childRuns += 1;
            return { ok: true, status: 'completed', displayText: 'guide result' };
        };
        const status = await gateway.start();
        const result = await runAgent(status.url, {
            sessionId: 'persona-single-owner-test',
            message: 'make a guide',
            agentLoop: 'llm',
            maxAgentSteps: 5,
            llmSettings: {
                provider: 'openai-compatible',
                baseUrl: llmServer.url,
                apiKey: 'test-key',
                model: 'mock-persona-single-owner',
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

        assert.equal(result.body.displayText, 'guide result');
        assert.equal(childRuns, 2);
        assert.equal(gateway.runtime.agent_control.state.list({ sessionId: 'persona-single-owner-test' }).length, 1);
        const duplicate = result.body.steps.find((step) => step.args?.task_name === 'guide_supplement');
        assert.equal(duplicate.response.status, 'followup_queued');
        assert.equal(duplicate.response.result.structuredContent.status, 'followup_queued');
        assert.equal(duplicate.response.result.structuredContent.task_name, '/root/guide');
        assert.equal(duplicate.response.result.structuredContent.continued, true);
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
        assert.match(run.body.displayText, /已经中断/);
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

test('Mercedes Sosa TaskAgent run appends an active user steer before committing the final', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-turn-steer-test-'));
    const llmServer = await createSteerAwareChatCompletionsServer(300);
    const gateway = new AILISGateway({
        port: 0,
        workspaceRoot,
        projectRoot: path.resolve('.'),
        auditDir: path.join(workspaceRoot, '.audit')
    });
    const runId = 'active-turn-steer-run';
    const sessionId = 'active-turn-steer-session';

    try {
        const status = await gateway.start();
        const runPromise = runAgent(status.url, {
            runId,
            sessionId,
            message: '帮我查 Mercedes Sosa 在 2000—2009 年发行了多少张录音室专辑',
            agentLoop: 'llm',
            llmSettings: {
                provider: 'openai-compatible',
                baseUrl: llmServer.url,
                apiKey: 'test-key',
                model: 'mock-turn-steer',
                timeoutMs: 10000
            },
            context: {
                sessionId,
                agentRole: 'task_agent',
                taskAgentThreadId: 'thread-steer-test',
                taskAgentTurnId: 'turn-steer-test',
                currentTaskRequest: '帮我查 Mercedes Sosa 在 2000—2009 年发行了多少张录音室专辑'
            }
        });
        const reachedFirstDecision = await waitFor(() => llmServer.calls.length === 1, {
            timeoutMs: 2000
        });
        assert.equal(reachedFirstDecision, true);
        assert.equal(gateway.ensureAgentRunner().enqueueRunInput({
            runId,
            sessionId,
            message: '速度，先确认英文 Wikipedia'
        }), true);

        const result = await runPromise;
        assert.equal(result.body.status, 'completed');
        assert.equal(result.body.message, '速度，先确认英文 Wikipedia');
        assert.equal(result.body.displayText, '已按英文 Wikipedia 核实：2000—2009 年共 3 张。');
        assert.equal(llmServer.calls.length, 2);
        assert.deepEqual(
            llmServer.calls[1].payload.messages.slice(0, llmServer.calls[0].payload.messages.length),
            llmServer.calls[0].payload.messages
        );
        const secondInput = JSON.stringify(llmServer.calls[1].payload.messages);
        assert.equal(secondInput.match(/帮我查 Mercedes Sosa 在 2000—2009 年发行了多少张录音室专辑/g)?.length, 1);
        assert.equal(secondInput.match(/速度，先确认英文 Wikipedia/g)?.length, 1);
        assert.doesNotMatch(secondInput, /task_agent_session_state|shared_session_context|current_request/);
    } finally {
        await gateway.stop().catch(() => {});
        await llmServer.close().catch(() => {});
        await fs.rm(workspaceRoot, { recursive: true, force: true });
    }
});

test('model-authored task_goal persists through the real Gateway into the next Session Turn', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-task-goal-integration-'));
    const llmServer = await createScriptedChatCompletionsServer(({ decisionCount }) => {
        if (decisionCount === 1) {
            return {
                mode: 'task',
                intent: 'long_horizon_goal',
                action: 'tool',
                tool_call: {
                    tool: 'task_goal',
                    title: '建立跨 Turn 目标',
                    args: {
                        action: 'set',
                        objective: '完成木偶攻略'
                    }
                }
            };
        }
        return {
            mode: 'task',
            intent: 'long_horizon_goal',
            action: 'final',
            final_answer: decisionCount === 2 ? '目标已建立' : '继续完成木偶攻略'
        };
    });
    const gateway = new AILISGateway({
        port: 0,
        workspaceRoot,
        projectRoot: path.resolve('.'),
        auditDir: path.join(workspaceRoot, '.audit')
    });
    const llmSettings = {
        provider: 'openai-compatible',
        baseUrl: llmServer.url,
        apiKey: 'test-key',
        model: 'mock-task-goal',
        timeoutMs: 10000
    };

    try {
        await gateway.start();
        const first = await gateway.taskAgentHarness.handoff({}, {
            currentUserMessage: '建立一个长期木偶攻略目标',
            sessionId: 'task-goal-integration-session',
            runId: 'task-goal-parent-1',
            llmSettings,
            explicitPersistentGoal: true
        });
        const second = await gateway.taskAgentHarness.handoff({}, {
            currentUserMessage: '继续',
            sessionId: 'task-goal-integration-session',
            runId: 'task-goal-parent-2',
            llmSettings
        });

        assert.equal(first.original_goal, '完成木偶攻略');
        assert.equal(second.original_goal, '完成木偶攻略');
        assert.equal(first.thread_id, second.thread_id);
        assert.notEqual(first.turn_id, second.turn_id);
        assert.equal(llmServer.calls.length, 3);
        const firstToolNames = (llmServer.calls[0].payload.tools || [])
            .map((tool) => tool.function?.name || tool.name);
        assert.ok(firstToolNames.includes('task_goal'));
        const afterGoalTool = JSON.stringify(llmServer.calls[1].payload.messages);
        const nextTurn = JSON.stringify(llmServer.calls[2].payload.messages);
        assert.match(afterGoalTool, /task_goal/);
        assert.match(afterGoalTool, /完成木偶攻略/);
        assert.match(nextTurn, /task_goal/);
        assert.match(nextTurn, /完成木偶攻略/);
        assert.doesNotMatch(nextTurn, /task_agent_session_state|session_ledger/);
    } finally {
        await gateway.stop().catch(() => {});
        await llmServer.close().catch(() => {});
        await fs.rm(workspaceRoot, { recursive: true, force: true });
    }
});

test('dispatchTurn lets the same persistent TaskAgent route chat or continue execution in one run', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-task-route-integration-'));
    const llmServer = await createScriptedChatCompletionsServer(({ decisionCount }) => {
        if (decisionCount === 1) {
            return {
                action: 'tool',
                tool_call: { tool: 'task_route', args: { mode: 'chat', progress_note: '' } }
            };
        }
        if (decisionCount === 2) {
            return {
                action: 'tool',
                tool_call: {
                    tool: 'task_route',
                    args: {
                        mode: 'execute',
                        progress_note: '我已经接下这个任务，现在开始处理。'
                    }
                }
            };
        }
        return {
            action: 'final',
            final_answer: '同一个 TaskAgent 已继续执行并完成。'
        };
    });
    const gateway = new AILISGateway({
        port: 0,
        workspaceRoot,
        projectRoot: path.resolve('.'),
        auditDir: path.join(workspaceRoot, '.audit')
    });
    const llmSettings = {
        provider: 'openai-compatible',
        baseUrl: llmServer.url,
        apiKey: 'test-key',
        model: 'mock-task-route',
        timeoutMs: 10000
    };
    const publicEvents = [];
    const taskEvents = [];
    gateway.on('event', (event) => publicEvents.push(event));

    try {
        await gateway.start();
        const chat = await gateway.taskAgentHarness.dispatchTurn({
            currentUserMessage: '陪我聊两句',
            sessionId: 'task-route-chat-session',
            runId: 'task-route-chat-parent',
            llmSettings
        });
        const execute = await gateway.taskAgentHarness.dispatchTurn({
            currentUserMessage: '执行一个具体任务',
            sessionId: 'task-route-execute-session',
            runId: 'task-route-execute-parent',
            llmSettings,
            onTaskEvent: (event) => taskEvents.push(event)
        });

        assert.equal(chat.route, 'chat');
        assert.equal(chat.final_answer, '');
        assert.equal(execute.route, 'execute');
        assert.equal(execute.final_answer, '同一个 TaskAgent 已继续执行并完成。');
        assert.equal(llmServer.calls.length, 3);
        for (const call of llmServer.calls.slice(0, 2)) {
            const toolNames = (call.payload.tools || []).map((tool) => tool.function?.name || tool.name);
            assert.ok(toolNames.includes('task_route'));
            assert.ok(toolNames.length > 1);
            assert.match(JSON.stringify(call.payload.tool_choice), /task_route/);
            const routeToolEntry = call.payload.tools.find((tool) => (
                (tool.function?.name || tool.name) === 'task_route'
            ));
            const routeTool = routeToolEntry?.function || routeToolEntry;
            assert.ok(routeTool.parameters.required.includes('progress_note'));
        }
        assert.ok(taskEvents.some((event) => (
            event.type === 'agent.progress.note' &&
            /已经接下这个任务/.test(event.message || '')
        )));
        const executionToolNames = (llmServer.calls[2].payload.tools || [])
            .map((tool) => tool.function?.name || tool.name);
        assert.equal(executionToolNames.includes('task_route'), true);
        assert.deepEqual(llmServer.calls[2].payload.tools, llmServer.calls[1].payload.tools);
        assert.deepEqual(
            llmServer.calls[2].payload.messages.slice(0, llmServer.calls[1].payload.messages.length),
            llmServer.calls[1].payload.messages
        );
        const executionInput = JSON.stringify(llmServer.calls[2].payload.messages);
        assert.match(executionInput, /执行一个具体任务/);
        assert.doesNotMatch(executionInput, /task_agent_session_state|current_request|visible_history/);
        assert.equal(publicEvents.some((event) =>
            ['agent.message.completed', 'persona.surface', 'agent.progress.note'].includes(event.type) &&
            [chat.trace_ref, execute.trace_ref].includes(event.payload?.runId)
        ), false);
    } finally {
        await gateway.stop().catch(() => {});
        await llmServer.close().catch(() => {});
        await fs.rm(workspaceRoot, { recursive: true, force: true });
    }
});

test('dispatchTurn retries TaskAgent routing with auto when thinking mode rejects a specific tool_choice', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-task-route-tool-choice-fallback-'));
    const llmServer = await createToolChoiceCompatibilityServer();
    const gateway = new AILISGateway({
        port: 0,
        workspaceRoot,
        projectRoot: path.resolve('.'),
        auditDir: path.join(workspaceRoot, '.audit')
    });

    try {
        await gateway.start();
        const result = await gateway.taskAgentHarness.dispatchTurn({
            currentUserMessage: '你好，简单介绍一下你自己。',
            sessionId: 'task-route-tool-choice-fallback-session',
            runId: 'task-route-tool-choice-fallback-parent',
            llmSettings: {
                provider: 'openai-compatible',
                baseUrl: llmServer.url,
                apiKey: 'test-key',
                model: 'mock-thinking-mode',
                timeoutMs: 10000
            }
        });

        assert.equal(result.route, 'chat');
        assert.equal(result.final_answer, '');
        assert.equal(llmServer.calls.length, 2);
        assert.match(JSON.stringify(llmServer.calls[0].payload.tool_choice), /task_route/);
        assert.equal(llmServer.calls[1].payload.tool_choice, 'auto');
        const fallbackToolNames = (llmServer.calls[1].payload.tools || [])
            .map((tool) => tool.function?.name || tool.name);
        assert.ok(fallbackToolNames.includes('task_route'));
        assert.ok(fallbackToolNames.length > 1);
    } finally {
        await gateway.stop().catch(() => {});
        await llmServer.close().catch(() => {});
        await fs.rm(workspaceRoot, { recursive: true, force: true });
    }
});

test('dispatchTurn fails promptly when thinking mode rejects both specific and auto tool_choice', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-task-route-tool-choice-fail-fast-'));
    const llmServer = await createToolChoiceCompatibilityServer({ fallbackSucceeds: false });
    const gateway = new AILISGateway({
        port: 0,
        workspaceRoot,
        projectRoot: path.resolve('.'),
        auditDir: path.join(workspaceRoot, '.audit')
    });

    try {
        await gateway.start();
        const result = await gateway.taskAgentHarness.dispatchTurn({
            currentUserMessage: '你好',
            sessionId: 'task-route-tool-choice-fail-fast-session',
            runId: 'task-route-tool-choice-fail-fast-parent',
            llmSettings: {
                provider: 'openai-compatible',
                baseUrl: llmServer.url,
                apiKey: 'test-key',
                model: 'mock-thinking-mode',
                timeoutMs: 10000
            }
        });

        assert.equal(result.status, 'provider_error');
        assert.equal(llmServer.calls.length, 2);
        assert.match(JSON.stringify(llmServer.calls[0].payload.tool_choice), /task_route/);
        assert.equal(llmServer.calls[1].payload.tool_choice, 'auto');
    } finally {
        await gateway.stop().catch(() => {});
        await llmServer.close().catch(() => {});
        await fs.rm(workspaceRoot, { recursive: true, force: true });
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
                                            name: 'apply_patch',
                                            arguments: JSON.stringify({
                                                input: '*** Begin Patch\n*** Add File: direct-native-output.txt\n+direct native tool executor ok\n*** End Patch'
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

async function createVisibleProtocolRepairServer() {
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
            const content = turn === 1
                ? '<｜｜DSML｜｜tool_calls>\n<｜｜DSML｜｜invoke name="mcp__ailis_research__web_research">\n</｜｜DSML｜｜invoke>\n</｜｜DSML｜｜tool_calls>'
                : '已经根据现有证据整理出可直接展示的最终结果。';
            res.end(JSON.stringify({
                choices: [{ message: { content } }],
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

test('Agentic Executor keeps the configured 120s decision floor across recovery and vision context', () => {
    assert.equal(
        resolveAgentDecisionTimeoutMs({ timeoutMs: 25000 }, { events: [], stepResults: [] }),
        120000
    );
    assert.equal(
        resolveAgentDecisionTimeoutMs(
            { timeoutMs: 25000 },
            {
                events: [],
                stepResults: [{ response: { ok: false, status: 'error' } }]
            }
        ),
        120000
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
        120000
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
        120000
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
        120000
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
            maxAgentSteps: 1,
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
        assert.ok(llmServer.calls[0].payload.tools.some((tool) => tool.function?.name === 'apply_patch'));
        assert.equal(
            llmServer.calls[0].payload.tools.some((tool) => tool.function?.name === 'ailis_agent_decision'),
            false
        );
        assert.equal(llmServer.calls[0].payload.tool_choice, 'auto');
        assert.equal(llmServer.calls[1].payload.tool_choice, 'auto');
        assert.ok((llmServer.calls[1].payload.tools || []).length > 0);
        const directInstructions = llmServer.calls[0].payload.messages.find((message) => message.role === 'system')?.content;
        assert.equal(directInstructions, resolveCodexNativeInstructions('mock-direct-tools'));
        assert.match(directInstructions, /^You are Codex/);
        assert.doesNotMatch(directInstructions, /Responses-Compatible Tool Runtime|coding agent running in AILIS/);
        assert.equal(result.body.steps[0].tool, 'apply_patch');
    } finally {
        await gateway.stop();
        await llmServer.close();
        await fs.rm(workspaceRoot, { recursive: true, force: true });
    }
});

test('Agentic Executor repairs visible DSML protocol before it reaches the final response', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-protocol-repair-'));
    const llmServer = await createVisibleProtocolRepairServer();
    const gateway = new AILISGateway({
        port: 0,
        workspaceRoot,
        projectRoot: path.resolve('.'),
        auditDir: path.join(workspaceRoot, '.audit')
    });

    try {
        const status = await gateway.start();
        const result = await runAgent(status.url, {
            sessionId: 'visible-protocol-repair-test',
            message: '整理现有证据并直接回答',
            agentLoop: 'llm',
            llmSettings: {
                provider: 'openai-compatible',
                baseUrl: llmServer.url,
                apiKey: 'test-key',
                model: 'mock-protocol-repair',
                temperature: 0,
                timeoutMs: 10000
            },
            context: {
                workspace: workspaceRoot,
                directToolExecutor: true,
                permissionProfile: 'danger-full-access',
                approvalPolicy: 'auto',
                approved: true,
                autoConfirm: true
            }
        });

        assert.equal(result.body.ok, true, JSON.stringify(result.body));
        assert.match(result.body.displayText, /可直接展示的最终结果/);
        assert.doesNotMatch(result.body.displayText, /DSML|tool_calls|invoke/);
        assert.equal(llmServer.calls.length, 2);
        assert.match(llmServer.calls[1].payload.messages[0].content, /Protocol repair/);
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

test('Agentic Executor keeps registered external tool details out of the first decision payload', async () => {
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
        assert.equal(llmUserPayload.external_tool_exposure, undefined);
        assert.doesNotMatch(JSON.stringify(llmServer.calls[0].payload.messages), /githubGetRepo|GitHub repository metadata/);
        const firstTurnToolNames = (llmServer.calls[0].payload.tools || []).map((tool) => tool.function?.name || tool.name);
        assert.ok(firstTurnToolNames.includes('tool_search'));
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
                intent: 'native_decision_patch',
                summary: '使用原生 tool-call 决策写入文件',
                action: 'tool',
                tool_call: {
                    tool: 'apply_patch',
                    title: '写入 native-output.txt',
                    args: {
                        input: '*** Begin Patch\n*** Add File: native-output.txt\n+native tool-call decision ok\n*** End Patch'
                    }
                }
            };
        }
        return {
            mode: 'task',
            intent: 'native_decision_patch',
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
            call.payload.tools?.some((tool) => tool.name === 'apply_patch')
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

test('TaskAgent unrestricted mode executes mutating tools without approval or confirmation', async () => {
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
            context: {
                workspace: workspaceRoot,
                agentRole: 'task_agent',
                taskAgentPermissionMode: 'unrestricted'
            }
        });

        assert.equal(first.body.ok, true, JSON.stringify({
            status: first.body.status,
            steps: first.body.steps,
            calls: llmServer.calls.map((call) => (call.payload.tools || []).map((tool) => tool.function?.name || tool.name))
        }));
        assert.equal(first.body.status, 'completed');
        assert.equal(first.body.planner, 'llm-agentic-executor');
        assert.equal(first.body.confirmationRequired, undefined);
        assert.equal(first.body.approvalId, undefined);
        assert.equal(first.body.steps.length, 2);
        assert.ok(first.body.events.length >= 6);
        assert.match(first.body.displayText, /\*\*(Agentic Executor|任务执行流程) 已完成\*\*/);
        assert.match(first.body.displayText, /README\.txt 已创建/);

        const text = await fs.readFile(path.join(workspaceRoot, 'planner-output', 'README.txt'), 'utf8');
        assert.match(text, /Agentic Executor OK/);
        assert.equal(llmServer.calls.length, 3);
        assert.ok(llmServer.calls.every((call) => call.system === resolveCodexNativeInstructions('mock-planner')));
        assert.match(llmServer.calls[0].system, /^You are Codex/);
        assert.doesNotMatch(llmServer.calls[0].system, /Responses-Compatible Tool Runtime|coding agent running in AILIS/);
        assert.doesNotMatch(llmServer.calls[0].system, /名字固定为AILIS/);
        assert.doesNotMatch(llmServer.calls[0].system, /性格设定/);
        assert.doesNotMatch(llmServer.calls[0].system, /不具备任何人工智能/);
        assert.doesNotMatch(llmServer.calls[0].system, /邮箱 SKILL/);
        assert.doesNotMatch(llmServer.calls[0].system, /final_answer 字段是给用户看的 Markdown 字符串/);
        const firstPromptPayload = parseModelContextPayload(llmServer.calls[0]);
        assert.equal(firstPromptPayload.capability_catalog, undefined);
        const firstPromptTools = (llmServer.calls[0].payload.tools || []).map((tool) => tool.function?.name || tool.name);
        assert.ok(firstPromptTools.includes('tool_search'));
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
            context: { workspace: workspaceRoot, agentRole: 'task_agent' }
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

test('AILIS Persona autonomously requests read-only vision context when an implicit screen reference is missing from text', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-vision-agent-'));
    const captured = [];
    const llmServer = await createScriptedChatCompletionsServer(({ decisionCount, messages }) => {
        const hasImageInput = messages.some((message) =>
            Array.isArray(message.content) &&
            message.content.some((part) => part?.type === 'image_url')
        );
        if (hasImageInput) {
            return '我看到登录按钮呈灰色禁用状态，按钮上方还有一个必填输入框没有填写。';
        }
        if (decisionCount === 1) {
            return {
                mode: 'task',
                intent: 'vision_check',
                summary: '请求只读视觉上下文',
                action: 'tool',
                requires_confirmation: false,
                tool_call: {
                    tool: 'vision_capture_context',
                    title: '看一眼当前屏幕',
                    args: {
                        action: 'capture_context',
                        target: 'screen',
                        reason: '用户所说的“这个按钮”只能从当前屏幕确定',
                        question: '用户指的是哪个按钮，界面上是否有可见的禁用或报错状态？'
                    }
                }
            };
        }
        return {
            mode: 'task',
            intent: 'vision_check',
            summary: '已经获得视觉 observation',
            action: 'final',
            final_answer: '我看到登录按钮现在是灰色禁用状态，上方还有必填项没填；先补全那个输入框，按钮应该就能点了。'
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
            message: '这个按钮为什么点不了？',
            agentLoop: 'llm',
            llmSettings,
            context: {
                workspace: workspaceRoot,
                agentRole: 'persona_orchestrator'
            }
        });

        assert.equal(first.body.ok, true, JSON.stringify({
            status: first.body.status,
            steps: first.body.steps,
            calls: llmServer.calls.map((call) => (call.payload.tools || []).map((tool) => tool.function?.name || tool.name))
        }));
        assert.equal(first.body.status, 'completed');
        assert.equal(first.body.confirmationRequired, undefined);
        assert.equal(captured.length, 1, JSON.stringify({
            status: first.body.status,
            steps: first.body.steps,
            calls: llmServer.calls.map((call) => (call.payload.tools || []).map((tool) => tool.function?.name || tool.name))
        }));
        assert.equal(captured[0].target, 'screen');
        assert.match(first.body.displayText, /登录按钮.*灰色/);
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

test('Persona and TaskAgent share one visual observation for the same user Turn', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-shared-vision-turn-'));
    let captures = 0;
    let modelCalls = 0;
    const mainSettings = {
        provider: 'deepseek',
        baseUrl: 'https://api.deepseek.com',
        apiKey: 'main-secret',
        model: 'deepseek-v4-flash'
    };
    const auxiliarySettings = {
        enabled: true,
        provider: 'openai-compatible',
        baseUrl: 'https://vision.example/v1',
        apiKey: 'vision-secret',
        model: 'qwen2.5-vl-7b'
    };
    const gateway = new AILISGateway({
        port: 0,
        workspaceRoot,
        projectRoot: path.resolve('.'),
        auditDir: path.join(workspaceRoot, '.audit'),
        visionServices: {
            getLlmSettings: () => mainSettings,
            getVisionLlmSettings: () => auxiliarySettings,
            capture: async () => {
                captures += 1;
                await delay(20);
                return {
                    id: 'shared-turn-snapshot',
                    type: 'vision',
                    source: 'screen',
                    dataUrl: 'data:image/png;base64,AAAA',
                    imagePath: path.join(workspaceRoot, 'snapshot.png'),
                    mimeType: 'image/png',
                    width: 1280,
                    height: 720
                };
            },
            callLlm: async () => {
                modelCalls += 1;
                await delay(20);
                return {
                    ok: true,
                    content: '当前屏幕是同一个 AILIS 聊天界面。',
                    model: auxiliarySettings.model
                };
            }
        }
    });
    const turnEnvelope = {
        sessionId: 'shared-vision-session',
        userMessage: '这个界面有什么问题？',
        createdAt: '2026-08-25T00:00:00.000Z'
    };

    const [personaResult, taskAgentResult] = await Promise.all([
        gateway.executeGatewayLocalTool('vision.capture_context', {
            action: 'capture_context',
            target: 'screen',
            question: '这个界面有什么问题？'
        }, {
            sessionId: turnEnvelope.sessionId,
            turnEnvelope,
            agentRole: 'persona_orchestrator'
        }),
        gateway.executeGatewayLocalTool('vision.capture_context', {
            action: 'capture_context',
            target: 'screen',
            question: '描述当前屏幕。'
        }, {
            sessionId: turnEnvelope.sessionId,
            turnEnvelope,
            agentRole: 'task_agent'
        })
    ]);

    assert.equal(captures, 1);
    assert.equal(modelCalls, 1);
    assert.equal(personaResult.details.understanding, '当前屏幕是同一个 AILIS 聊天界面。');
    assert.equal(taskAgentResult.details.understanding, personaResult.details.understanding);
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
                summary: '发现只读视觉工具',
                action: 'tool',
                tool_call: {
                    tool: 'tool_search',
                    title: '查找只读视觉工具',
                    args: { query: 'vision.capture_context screen capture' }
                }
            };
        }
        if (agentDecisionCount === 2) {
            return {
                mode: 'task',
                intent: 'vision_full_control_check',
                summary: '完全控制下直接获取视觉上下文',
                action: 'tool',
                tool_call: {
                    tool: 'vision_capture_context',
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
        assert.equal(captured.length, 1, JSON.stringify({
            status: result.body.status,
            steps: result.body.steps,
            calls: llmServer.calls.map((call) => (call.payload.tools || []).map((tool) => tool.function?.name || tool.name))
        }));
        assert.equal(captured[0].target, 'screen');
        assert.match(result.body.displayText, /视觉截图链路正常/);
    } finally {
        await gateway.stop();
        await llmServer.close();
    }
});

test('TaskAgent ignores the legacy round cap, compacts canonical history, and ends on the model final', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-task-agent-natural-termination-'));
    await fs.writeFile(path.join(workspaceRoot, 'note.txt'), 'output\n', 'utf8');
    const llmServer = await createScriptedChatCompletionsServer(({ decisionCount }) => {
        if (decisionCount <= 10) {
            return {
                mode: 'task',
                intent: 'long_task',
                summary: `读取第 ${decisionCount} 份输出`,
                action: 'tool',
                tool_call: {
                    tool: 'exec_command',
                    title: `读取输出 ${decisionCount}`,
                    args: {
                        cmd: `powershell -NoProfile -Command "$value = 'output-${decisionCount} '; Write-Output ($value * 800)"`
                    }
                }
            };
        }
        return {
            mode: 'task',
            intent: 'long_task',
            summary: '任务已经完成',
            action: 'final',
            final_answer: 'Natural completion after ten tool rounds.'
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
            sessionId: 'task-agent-natural-termination-test',
            message: '读取 note.txt 并整理结果',
            agentLoop: 'llm',
            agentRole: 'task_agent',
            maxAgentSteps: 1,
            llmSettings: {
                provider: 'openai-compatible',
                baseUrl: llmServer.url,
                apiKey: 'test-key',
                model: 'mock-natural-termination-task-agent',
                timeoutMs: 10000
            },
            context: {
                workspace: workspaceRoot,
                agentRole: 'task_agent',
                approved: true,
                confirmationPolicy: 'auto',
                contextWindowTokens: 9000,
                reservedOutputTokens: 1000
            }
        });

        assert.equal(result.body.status, 'completed');
        assert.match(result.body.displayText, /Natural completion/);
        assert.equal(result.body.steps.length, 10);
        assert.equal(llmServer.calls.length, 11);
        assert.equal(
            llmServer.calls[0].system,
            resolveCodexNativeInstructions('mock-natural-termination-task-agent')
        );
        assert.doesNotMatch(llmServer.calls[0].system, /work-tool rounds|round total budget|finalization/i);
        assert.match(llmServer.calls[0].system, /^You are Codex/);
        assert.doesNotMatch(llmServer.calls[0].system, /web_run archive operation|exact-answer|evidence contract/i);
        assert.notEqual(llmServer.calls.at(-1).payload.tool_choice, 'none');
        assert.ok((llmServer.calls.at(-1).payload.tools || []).length > 0);
        assert.doesNotMatch(JSON.stringify(llmServer.calls.at(-1).payload.messages), /finalization package/i);
        assert.equal(result.body.events.some((event) => event.status === 'safety_finalization'), false);
        const transcript = await gateway.runtime.readTranscript(result.body.runId, 500);
        assert.ok(transcript.items.some((item) => item.type === 'agent.context_compaction'));
    } finally {
        await gateway.stop();
        await llmServer.close();
        await fs.rm(workspaceRoot, { recursive: true, force: true });
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
                workspace: workspaceRoot,
                agentRole: 'task_agent'
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

test('Agentic Executor stops repeated identical invalid native calls before they can run away', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-invalid-native-tool-fuse-'));
    const llmServer = await createScriptedChatCompletionsServer(({ decisionCount }) => {
        if (decisionCount <= 2) {
            return {
                action: 'tool',
                summary: '尝试写入文件。',
                tool_call: {
                    tool: 'write',
                    args: {}
                }
            };
        }
        return {
            action: 'final',
            final_answer: '无法在缺少必填参数时安全执行写入。'
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
            sessionId: 'invalid-native-tool-fuse-test',
            message: '创建一个文本文件。',
            agentLoop: 'llm',
            maxAgentSteps: 8,
            llmSettings: {
                provider: 'openai-compatible',
                baseUrl: llmServer.url,
                apiKey: 'test-key',
                model: 'mock-invalid-native-tool-fuse',
                temperature: 0,
                timeoutMs: 10000
            },
            context: {
                workspace: workspaceRoot,
                directToolExecutor: true,
                nativeDirectTools: true,
                agentRole: 'task_agent',
                approved: true,
                confirmationPolicy: 'auto'
            }
        });

        assert.equal(result.body.ok, false, JSON.stringify(result.body));
        assert.equal(result.body.status, 'stalled');
        assert.equal(result.body.taskRunHandoff.reason, 'repeated_invalid_native_tool_call');
        assert.equal(llmServer.calls.length, 2);
        assert.notEqual(llmServer.calls[1].payload.tool_choice, 'none');
        assert.ok((llmServer.calls[1].payload.tools || []).length > 0);
        assert.equal(
            result.body.events.filter((event) =>
                event.type === 'runtime_note' &&
                event.status === 'invalid_decision_observation'
            ).length,
            2
        );
        assert.equal(result.body.events.some((event) => event.status === 'safety_finalization'), false);
        assert.match(JSON.stringify(llmServer.calls[1].payload.messages), /required|path|content/i);
    } finally {
        await gateway.stop();
        await llmServer.close();
        await fs.rm(workspaceRoot, { recursive: true, force: true });
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
        assert.match(llmServer.calls[0].system, /^You are Codex/);
        assert.doesNotMatch(llmServer.calls[0].system, /Responses-Compatible Tool Runtime|ResponseItem objects/);
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
        assert.equal(llmServer.calls[0].system, resolveCodexNativeInstructions('mock-generic-doc-prompt-agent'));
        assert.equal(llmUserPayload.capability_catalog, undefined);
        const exposedToolNames = (llmServer.calls[0].payload.tools || []).map((tool) => tool.function?.name || tool.name);
        assert.ok(exposedToolNames.includes('tool_search'));
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
                summary: '查找本地文件读取能力',
                action: 'tool',
                tool_call: {
                    tool: 'tool_search',
                    title: '查找文件读取工具',
                    args: { query: 'read local markdown file' }
                }
            };
        }
        if (decisionCount === 2) {
            return {
                mode: 'task',
                intent: 'research_reading',
                summary: '补齐论文资料证据',
                action: 'tool',
                tool_call: {
                    tool: 'read',
                    title: '读取论文资料',
                    args: { path: 'paper.md' }
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
                workspace: workspaceRoot,
                agentRole: 'task_agent'
            }
        });

        assert.equal(result.body.ok, true, result.body.displayText);
        assert.equal(result.body.status, 'completed');
        assert.ok(result.body.steps.length >= 2);
        assert.match(result.body.displayText, /memory stream|reflection|planning|retrieval/);
        assert.ok(llmServer.calls.length >= 3);
        const finalMessages = JSON.stringify(llmServer.calls.at(-1).payload.messages);
        assert.match(finalMessages, /tool_calls/);
        assert.match(finalMessages, /tool_call_id/);
        assert.match(finalMessages, /memory stream|reflection|planning|retrieval/);
        assert.doesNotMatch(finalMessages, /runtime_diagnostics/);
        const transcript = await gateway.runtime.readTranscript(result.body.runId, 100);
        const snapshots = transcript.items.filter((item) => item.type === 'agent.context_snapshot');
        assert.equal(snapshots.length, 3);
        assert.equal(snapshots[0].payload.model_input_request.stats.context_history_items, 3);
        assert.equal(snapshots[1].payload.model_input_request.stats.context_history_items, 5);
        assert.equal(snapshots[2].payload.model_input_request.stats.context_history_items, 7);
        assert.equal(snapshots[0].payload.context_manager_checkpoint?.items.length, 3);
        assert.equal(snapshots[1].payload.context_manager_checkpoint?.items.length, 5);
        assert.equal(snapshots[2].payload.context_manager_checkpoint?.items.length, 7);
        assert.equal(snapshots[0].payload.context_manager_checkpoint.items[0].role, 'developer');
        assert.deepEqual(
            snapshots[2].payload.context_manager_checkpoint.items.map((item) => item.type).slice(-2),
            ['function_call', 'function_call_output']
        );
        assert.deepEqual(
            snapshots[2].payload.model_input_request.input.map((item) => item.type).slice(-2),
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

test('Agentic Executor ignores the removed execution-evidence flag', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-required-execution-evidence-'));
    const llmServer = await createScriptedChatCompletionsServer(() => ({
        mode: 'task',
        intent: 'create_reminder',
        summary: '提醒已经创建',
        action: 'final',
        final_answer: 'The reminder was created.'
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
            sessionId: 'required-execution-evidence-test',
            message: 'Remind me tomorrow at 5 PM.',
            agentLoop: 'llm',
            maxAgentSteps: 2,
            llmSettings: {
                provider: 'openai-compatible',
                baseUrl: llmServer.url,
                apiKey: 'test-key',
                model: 'mock-required-execution-evidence',
                temperature: 0,
                timeoutMs: 10000
            },
            context: {
                workspace: workspaceRoot,
                agentRole: 'task_agent',
                requireExecutionEvidence: true
            }
        });

        assert.equal(result.body.ok, true);
        assert.equal(result.body.status, 'completed');
        assert.equal(result.body.steps.length, 0);
        assert.equal(result.body.taskRunHandoff.status, 'completed');
        assert.match(result.body.displayText, /reminder was created/i);
        assert.doesNotMatch(llmServer.calls[0].system, /execution-evidence contract/i);
    } finally {
        await gateway.stop();
        await llmServer.close();
        await fs.rm(workspaceRoot, { recursive: true, force: true });
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
        assert.doesNotMatch(JSON.stringify(llmServer.calls[0].payload.messages), /capability_catalog/);
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
                summary: '发现邮箱工具',
                action: 'tool',
                tool_call: {
                    tool: 'tool_search',
                    title: '查找邮箱工具',
                    args: { query: 'email unread inbox' }
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
                summary: '发现邮箱工具',
                action: 'tool',
                tool_call: {
                    tool: 'tool_search',
                    title: '查找邮箱工具',
                    args: { query: 'email unread inbox' }
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
