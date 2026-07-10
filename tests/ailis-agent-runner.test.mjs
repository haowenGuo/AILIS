import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { AILISGateway } = require('../electron/ailis-gateway.cjs');
const {
    AILISAgentRunner,
    buildAgentDirectToolSpecs,
    buildLlmAgentDirectToolPrompt,
    buildToolObservationDigest,
    extractSubagentHandoffOutcome,
    isAgentLlmSettingsMissing,
    looksLikeLeakedAgentProtocol,
    splitNativeProgressNoteArgs,
    stripControlTags
} = require('../electron/ailis-agent-runner.cjs');

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

test('AILIS Agent Runner strips persona_output blocks from visible text', () => {
    const visibleText = stripControlTags(`我喜欢和你一起研究新东西。

<persona_output>
{"emotion":"joyful","gestureIntent":"open_hands","taskState":"listening"}
</persona_output>`);

    assert.equal(visibleText, '我喜欢和你一起研究新东西。');
    assert.doesNotMatch(visibleText, /persona_output|gestureIntent|taskState/);

    const embeddedJsonText = stripControlTags(`{好的啦～被你夸得有点小害羞呢。

{
"persona_output": {
"emotion": "happy",
"gestureIntent": "tilt_head_smile",
"taskState": "idle_listening"
}
}}`);

    assert.equal(embeddedJsonText, '好的啦～被你夸得有点小害羞呢。');
    assert.doesNotMatch(embeddedJsonText, /persona_output|gestureIntent|taskState/);
    assert.doesNotMatch(embeddedJsonText, /^\{|\}$/);

    const fullWidthTags = stripControlTags(
        '[expression:happy]【expression:surprised】【emotion:flustered】我没有把内部表情标签说出来。'
    );
    assert.equal(fullWidthTags, '我没有把内部表情标签说出来。');
});

test('AILIS parent Persona prompt stays conversational while TaskAgent keeps execution guidance', () => {
    const personaPrompt = buildLlmAgentDirectToolPrompt({
        message: '老婆，你的说话语气怎么有点冷漠',
        toolSummary: 'Persona orchestrator tools exposed: subagents only.'
    });
    assert.match(personaPrompt.instructions, /当前有效交互偏好/);
    assert.match(personaPrompt.instructions, /Keep ordinary conversation natural/);
    assert.match(personaPrompt.instructions, /authoritative host clock/);
    assert.match(personaPrompt.instructions, /Author the complete TaskAgent task yourself/);
    assert.match(personaPrompt.instructions, /same AILIS conversation/);
    assert.doesNotMatch(personaPrompt.instructions, /mcp__ailis_research__web_research|For local file and data tasks|When exec output is truncated/);

    const taskPrompt = buildLlmAgentDirectToolPrompt({
        message: '查找最新资料并验证结果',
        contextMode: 'task_agent',
        toolSummary: 'Direct tools are exposed.'
    });
    assert.match(taskPrompt.instructions, /mcp__ailis_research__web_research/);
    assert.match(taskPrompt.instructions, /For local file and data tasks/);
    assert.doesNotMatch(taskPrompt.instructions, /Keep ordinary conversation natural/);
});

test('AILIS Persona receives active preferences and active task state while TaskAgent stays isolated', async () => {
    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-persona-context-'));
    const gateway = new AILISGateway({
        projectRoot: rootDir,
        workspaceRoot: rootDir,
        auditDir: path.join(rootDir, 'audit'),
        profileCurationEnabled: false
    });
    gateway.preferenceState.append({
        slot: 'tone.response',
        operation: 'set',
        value: '自然简洁',
        scope: 'persistent',
        confidence: 0.98,
        observedAt: '2026-07-09T10:00:00.000Z',
        evidence: { messageId: 'pref-1', quote: '以后说得自然简洁' }
    }, { userMessage: '以后说得自然简洁' });
    gateway.taskResultCapsules.save({
        taskId: 'old-roxy-guide',
        sessionId: 'main',
        request: '做一套洛茜攻略',
        generatedAt: '2026-07-09T11:00:00.000Z',
        taskRunHandoff: {
            status: 'completed',
            finalAnswer: '洛茜的核心队伍结论已经整理完成。'
        }
    });
    const lookup = await gateway.executeGatewayLocalTool('task_results', {
        action: 'search',
        query: '洛茜配队',
        limit: 2
    }, { sessionId: 'main' });
    assert.equal(lookup.isError, false);
    assert.equal(lookup.structuredContent.results[0].taskId, 'old-roxy-guide');
    gateway.taskResultCapsules.recordExecution({
        sessionId: 'main',
        parentRunId: 'parent-roxy-guide',
        task: '继续完成洛茜攻略并核对配队',
        status: 'max_loop',
        ok: false,
        subagent: {
            id: 'roxy-worker',
            childRunId: 'roxy-child'
        },
        taskRunHandoff: {
            status: 'max_loop',
            partialAnswer: '已整理技能，配队仍待核验。',
            failureAnalysis: { bottleneck: '配队证据不足' },
            resume: { checkpointAvailable: true, contextManagerCheckpoint: { history_version: 1, items: [] } }
        }
    });
    const runner = gateway.ensureAgentRunner();
    const personaContext = runner.compileMemoryContext({
        sessionId: 'main',
        message: '洛茜配队怎么调整',
        request: {},
        contextMode: 'persona'
    });
    const taskContext = runner.compileMemoryContext({
        sessionId: 'main',
        message: '洛茜配队怎么调整',
        request: {},
        contextMode: 'task_agent'
    });

    assert.match(personaContext, /tone\.response: 自然简洁/);
    assert.match(personaContext, /当前活动任务状态/);
    assert.match(personaContext, /继续完成洛茜攻略并核对配队/);
    assert.doesNotMatch(personaContext, /洛茜的核心队伍结论/);
    assert.doesNotMatch(taskContext, /当前活动任务状态|tone\.response: 自然简洁/);
});

test('AILIS direct tool specs allow model-authored progress notes without passing them to tools', () => {
    const specs = buildAgentDirectToolSpecs({
        gatewayToolRuntimeRegistry: {
            modelVisibleSpecs: () => [{
                name: 'read',
                description: 'Read a file.',
                parameters: {
                    type: 'object',
                    additionalProperties: false,
                    required: ['path'],
                    properties: {
                        path: { type: 'string' }
                    }
                }
            }]
        }
    }, {
        requestContext: {
            directToolLimit: 4
        }
    });
    const readSpec = specs.find((spec) => spec.name === 'read');

    assert.ok(readSpec);
    assert.equal(readSpec.parameters.properties.progress_note.type, 'string');

    const split = splitNativeProgressNoteArgs({
        path: 'note.txt',
        progress_note: '我先确认这份文件里有没有可以直接引用的证据。'
    });

    assert.deepEqual(split.args, { path: 'note.txt' });
    assert.match(split.progressNote, /确认这份文件/);
});

test('AILIS Agent Runner rejects visible tool protocols', () => {
    const leaked = `<｜｜DSML｜｜tool_calls>
<｜｜DSML｜｜invoke name="mcp__ailis_research__web_research">
<｜｜DSML｜｜parameter name="query" string="true">Rossi guide</｜｜DSML｜｜parameter>
</｜｜DSML｜｜invoke>
</｜｜DSML｜｜tool_calls>`;
    assert.equal(looksLikeLeakedAgentProtocol(leaked), true);
    assert.equal(looksLikeLeakedAgentProtocol(JSON.stringify({
        tool_calls: [{ function: { name: 'web_search', arguments: '{}' } }]
    })), true);
    assert.equal(looksLikeLeakedAgentProtocol('已经整理好洛茜的技能、配队和培养建议。'), false);

    const handoff = extractSubagentHandoffOutcome({
        response: {
            ok: true,
            status: 'completed',
            result: {
                details: {
                    status: 'completed',
                    result: {
                        ok: true,
                        status: 'completed',
                        displayText: leaked,
                        finalAnswer: leaked
                    }
                }
            }
        }
    });
    assert.equal(handoff.ok, false);
    assert.equal(handoff.status, 'invalid_visible_agent_protocol');
    assert.doesNotMatch(handoff.displayText, /DSML|tool_calls|invoke/);
});

test('web source viewport prompt digest uses only canonical Codex/OAI names', () => {
    const [digest] = buildToolObservationDigest([{
        id: 'fetch-1',
        tool: 'mcp__ailis_research__web_fetch',
        title: 'web_fetch',
        args: { url: 'https://example.test/page', lineno: 10 },
        response: {
            ok: true,
            status: 'completed',
            result: {
                content: [{
                    type: 'text',
                    text: 'Source viewport:\nL10: answer bearing line'
                }],
                structuredContent: {
                    sourceWindow: {
                        type: 'source_viewport',
                        action: {
                            type: 'web_fetch',
                            url: 'https://example.test/page',
                            lineno: 10
                        },
                        url: 'https://example.test/page',
                        contentType: 'text/html',
                        totalLines: 20,
                        lineStart: 10,
                        lineEnd: 11,
                        hasMoreBefore: true,
                        hasMoreAfter: false,
                        lines: [
                            { lineNumber: 10, line_number: 10, lineno: 10, text: 'answer bearing line' }
                        ]
                    },
                    sourceViewport: { type: 'source_viewport' },
                    modelVisibleMode: 'source_viewport',
                    sourceRetrievalComplete: true
                }
            }
        }
    }]);

    assert.match(digest.structuredContent, /"source_viewport"/);
    assert.match(digest.structuredContent, /"type":"open_page"/);
    assert.match(digest.structuredContent, /"lineno":10/);
    assert.doesNotMatch(digest.structuredContent, /sourceWindow|sourceViewport|modelVisibleMode|sourceRetrievalComplete/);
    assert.doesNotMatch(digest.structuredContent, /lineNumber|line_number|web_fetch/);
});

test('AILIS Agent Runner passes parent LLM settings only to subagent tool calls', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-subagent-tool-context-'));
    const calls = [];
    const gateway = {
        workspaceRoot,
        auditDir: path.join(workspaceRoot, '.audit'),
        runtime: {},
        emitGatewayEvent() {},
        async callTool(request) {
            calls.push(request);
            return {
                ok: true,
                status: 'completed',
                content: [],
                details: { status: 'completed' }
            };
        }
    };
    const runner = new AILISAgentRunner({
        gateway,
        workspaceRoot,
        pendingStorePath: path.join(workspaceRoot, 'pending-agent-state.json')
    });
    const llmSettings = {
        provider: 'deepseek',
        baseUrl: 'https://api.deepseek.com',
        model: 'deepseek-chat',
        apiKey: 'test-key'
    };

    await runner.executeAgentToolStep({
        runId: 'run-parent',
        step: {
            id: 'step-subagent',
            title: 'Spawn task agent',
            tool: 'subagents',
            args: { action: 'spawn', task: 'solve task', wait: true }
        },
        toolContext: { workspace: workspaceRoot, sessionKey: 'main' },
        request: { llmSettings },
        iteration: 0
    });

    assert.deepEqual(calls[0].context.llmSettings, llmSettings);

    calls.length = 0;
    await runner.executeAgentToolStep({
        runId: 'run-parent',
        step: {
            id: 'step-exec',
            title: 'Run command',
            tool: 'exec',
            args: { command: 'echo ok' }
        },
        toolContext: { workspace: workspaceRoot, sessionKey: 'main' },
        request: { llmSettings },
        iteration: 1
    });

    assert.equal(calls[0].context.llmSettings, undefined);
});

test('AILIS persona exposes subagent handoff while TaskAgent keeps Codex core by default', () => {
    const taskResultsSpec = {
        name: 'task_results',
        description: 'Read prior public task results.',
        parameters: {
            type: 'object',
            additionalProperties: false,
            required: ['action'],
            properties: {
                action: { type: 'string', enum: ['search', 'get'] },
                query: { type: 'string' },
                id: { type: 'string' }
            }
        }
    };
    const subagentSpec = {
        name: 'subagents',
        description: 'Spawn child task agents.',
        parameters: {
            type: 'object',
            properties: {
                action: { type: 'string' },
                task: { type: 'string' },
                wait: { type: 'boolean' }
            }
        }
    };
    const gateway = {
        gatewayToolRuntimeRegistry: {
            modelVisibleSpecs: () => [
                {
                    name: 'read',
                    description: 'Read a file.',
                    parameters: { type: 'object', properties: { path: { type: 'string' } } }
                },
                {
                    name: 'exec',
                    description: 'Run a command.',
                    parameters: { type: 'object', properties: { command: { type: 'string' } } }
                }
            ],
            definition: (toolId) => {
                if (toolId === 'subagents') return { spec: subagentSpec };
                if (toolId === 'task_results') return { spec: taskResultsSpec };
                return null;
            }
        }
    };

    const personaSpecs = buildAgentDirectToolSpecs(gateway, {
        requestContext: {
            agentRole: 'persona_orchestrator'
        }
    });
    assert.deepEqual(personaSpecs.map((spec) => spec.name), ['task_results', 'subagents']);
    const personaDelegateSpec = personaSpecs.find((spec) => spec.name === 'subagents');
    assert.deepEqual(personaDelegateSpec.parameters.required, ['action', 'task']);
    assert.deepEqual(personaDelegateSpec.parameters.properties.action.enum, ['spawn']);
    assert.equal(personaDelegateSpec.parameters.properties.wait, undefined);
    assert.equal(personaDelegateSpec.parameters.properties.subagentId, undefined);

    const taskSpecs = buildAgentDirectToolSpecs(gateway, {
        requestContext: {
            agentRole: 'task_agent'
        }
    });
    assert.ok(taskSpecs.some((spec) => spec.name === 'read'));
    assert.ok(taskSpecs.some((spec) => spec.name === 'exec'));
    assert.equal(taskSpecs.some((spec) => spec.name === 'subagents'), false);

    const explicitTaskSpecs = buildAgentDirectToolSpecs(gateway, {
        requestContext: {
            agentRole: 'task_agent',
            exposeSubagentsDirectTool: true
        }
    });
    assert.ok(explicitTaskSpecs.some((spec) => spec.name === 'subagents'));
});

test('AILIS Agent Runner accepts local vLLM and Ollama settings without API keys', () => {
    assert.equal(isAgentLlmSettingsMissing({
        provider: 'vllm',
        baseUrl: 'http://127.0.0.1:8000/v1',
        model: 'Qwen/Qwen2-0.5B-Instruct',
        apiKey: ''
    }), false);

    assert.equal(isAgentLlmSettingsMissing({
        provider: 'ollama',
        baseUrl: 'http://127.0.0.1:11434',
        model: 'llama3.2',
        apiKey: ''
    }), false);

    assert.equal(isAgentLlmSettingsMissing({
        provider: 'openai-compatible',
        baseUrl: 'https://api.example.test/v1',
        model: 'demo-model',
        apiKey: ''
    }), true);
});

test('AILIS Agent Runner plans chat and executes file tasks through the Gateway', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-agent-test-'));
    const gateway = new AILISGateway({
        port: 0,
        workspaceRoot,
        projectRoot: path.resolve('.'),
        auditDir: path.join(workspaceRoot, '.audit')
    });

    try {
        const status = await gateway.start();
        const baseUrl = status.url;

        const chat = await runAgent(baseUrl, {
            sessionId: 'agent-test',
            message: '你好'
        });
        assert.equal(chat.response.status, 200);
        assert.equal(chat.body.ok, true);
        assert.equal(chat.body.mode, 'conversation');
        assert.equal(chat.body.intent, 'emotional_chat');
        assert.equal(chat.body.executionRequired, false);
        assert.equal(chat.body.steps.length, 0);
        assert.match(chat.body.displayText, /统一的 AILIS Agent 链路/);

        const classifyConversation = await runAgent(baseUrl, {
            sessionId: 'agent-test',
            message: '我今天有点累',
            classifyOnly: true
        });
        assert.equal(classifyConversation.body.ok, true);
        assert.equal(classifyConversation.body.status, 'classified');
        assert.equal(classifyConversation.body.mode, 'conversation');
        assert.equal(classifyConversation.body.executionRequired, false);

        const classifyTask = await runAgent(baseUrl, {
            sessionId: 'agent-test',
            message: '/read note.txt',
            classifyOnly: true
        });
        assert.equal(classifyTask.body.ok, true);
        assert.equal(classifyTask.body.status, 'classified');
        assert.equal(classifyTask.body.mode, 'task');
        assert.equal(classifyTask.body.executionRequired, true);
        assert.equal(classifyTask.body.plan[0].tool, 'read');

        const emotional = await runAgent(baseUrl, {
            sessionId: 'agent-test',
            message: '我今天有点累'
        });
        assert.equal(emotional.body.ok, true);
        assert.equal(emotional.body.mode, 'conversation');
        assert.equal(emotional.body.intent, 'emotional_chat');
        assert.equal(emotional.body.steps.length, 0);
        assert.match(emotional.body.displayText, /慢一点/);

        const taskClarification = await runAgent(baseUrl, {
            sessionId: 'agent-test',
            message: '帮我开发一个网站'
        });
        assert.equal(taskClarification.body.ok, true);
        assert.equal(taskClarification.body.mode, 'task');
        assert.equal(taskClarification.body.intent, 'task_clarification');
        assert.equal(taskClarification.body.executionRequired, false);
        assert.equal(taskClarification.body.steps.length, 0);
        assert.match(taskClarification.body.displayText, /识别成任务请求/);

        const write = await runAgent(baseUrl, {
            sessionId: 'agent-test',
            message: '/write note.txt hello runner'
        });
        assert.equal(write.body.ok, true, write.body.displayText);
        assert.equal(write.body.status, 'completed');
        assert.equal(write.body.mode, 'task');
        assert.equal(write.body.executionRequired, true);
        assert.equal(write.body.intent, 'write_file');
        assert.equal(write.body.steps[0].tool, 'write');

        const read = await runAgent(baseUrl, {
            sessionId: 'agent-test',
            message: '请读取 note.txt'
        });
        assert.equal(read.body.ok, true, read.body.displayText);
        assert.equal(read.body.intent, 'read_file');
        assert.equal(read.body.steps[0].tool, 'read');
        assert.match(read.body.displayText, /hello runner/);

        const approval = await runAgent(baseUrl, {
            sessionId: 'agent-test',
            message: '/exec node -e "console.log(1)"'
        });
        assert.equal(approval.body.ok, false);
        assert.equal(approval.body.status, 'needs_approval');
        assert.match(approval.body.displayText, /需要.*确认/);

        const rpc = await jsonFetch(`${baseUrl}/rpc`, {
            method: 'POST',
            body: JSON.stringify({
                method: 'agent.run',
                params: {
                    sessionId: 'agent-test',
                    message: '/read note.txt'
                }
            })
        });
        assert.equal(rpc.body.ok, true, rpc.body.displayText);
        assert.match(rpc.body.displayText, /hello runner/);

        const audit = await jsonFetch(`${baseUrl}/audit?limit=20`);
        assert.equal(audit.body.ok, true);
        assert.ok(audit.body.entries.some((entry) => entry.type === 'agent.run'));
    } finally {
        await gateway.stop();
    }
});

test('AILIS Agent Runner restores durable pending plans after Gateway restart', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-pending-plan-test-'));
    const auditDir = path.join(workspaceRoot, '.audit');
    let gateway = new AILISGateway({
        port: 0,
        workspaceRoot,
        projectRoot: path.resolve('.'),
        auditDir
    });

    try {
        await gateway.start();
        const runner = gateway.ensureAgentRunner();
        runner.storePendingPlan({
            planId: 'plan-restore',
            sessionId: 'durable-plan-session',
            message: '需要确认的计划',
            createdAt: Date.now(),
            expiresAt: Date.now() + 60000,
            planner: 'llm-computer-planner',
            intent: 'durable_plan_test',
            summary: '持久化计划',
            riskLevel: 'medium',
            model: 'mock',
            steps: [],
            verificationSteps: [],
            raw: {}
        });
        assert.equal(runner.getStatus().pendingPlanCount, 1);

        await gateway.stop();

        gateway = new AILISGateway({
            port: 0,
            workspaceRoot,
            projectRoot: path.resolve('.'),
            auditDir
        });
        await gateway.start();
        const restoredRunner = gateway.ensureAgentRunner();
        assert.equal(restoredRunner.getStatus().restoredPendingPlanCount, 1);
        const restored = restoredRunner.findPendingPlanForSession('durable-plan-session');
        assert.equal(restored.planId, 'plan-restore');
    } finally {
        await gateway.stop().catch(() => {});
    }
});
