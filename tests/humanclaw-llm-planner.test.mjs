import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { HumanClawGateway } = require('../electron/humanclaw-gateway.cjs');
const { resolveAgentDecisionTimeoutMs } = require('../electron/humanclaw-agent-runner.cjs');

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
            const content = JSON.stringify(decisions[Math.min(agentDecisionCount, decisions.length) - 1]);

            res.writeHead(200, { 'content-type': 'application/json' });
            res.end(JSON.stringify({
                choices: [
                    {
                        message: { content }
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
            const content = typeof decision === 'string' ? decision : JSON.stringify(decision);
            res.writeHead(200, { 'content-type': 'application/json' });
            res.end(JSON.stringify({
                choices: [
                    {
                        message: { content }
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

test('Agentic Executor widens decision timeout after vision context is involved', () => {
    assert.equal(
        resolveAgentDecisionTimeoutMs({ timeoutMs: 25000 }, { events: [], stepResults: [] }),
        25000
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

test('Agentic Executor Loop asks confirmation, resumes, observes, and keeps calling tools until final', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'humanclaw-llm-planner-'));
    const llmServer = await createMockChatCompletionsServer();
    const llmSettings = {
        provider: 'openai-compatible',
        baseUrl: llmServer.url,
        apiKey: 'test-key',
        model: 'mock-planner',
        temperature: 0.1,
        timeoutMs: 10000
    };
    const gateway = new HumanClawGateway({
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
        assert.match(confirmed.body.displayText, /\*\*Agentic Executor 已完成\*\*/);
        assert.match(confirmed.body.displayText, /- 已读取复核通过/);

        const text = await fs.readFile(path.join(workspaceRoot, 'planner-output', 'README.txt'), 'utf8');
        assert.match(text, /Agentic Executor OK/);
        assert.equal(llmServer.calls.filter((call) => /HumanClaw Agentic Executor/.test(call.system)).length, 4);
        assert.match(llmServer.calls[0].system, /名字固定为AIGL/);
        assert.match(llmServer.calls[0].system, /具备人工智能/);
        assert.match(llmServer.calls[0].system, /不要依赖外部分类结果/);
        assert.doesNotMatch(llmServer.calls[0].system, /不具备任何人工智能/);
        assert.doesNotMatch(llmServer.calls[0].system, /邮箱 SKILL/);
        assert.match(llmServer.calls[0].system, /final_answer 字段是给用户看的 Markdown 字符串/);
        assert.equal(llmServer.calls[0].payload.messages[1].content.includes('"initial_plan_hint": null'), true);
    } finally {
        await gateway.stop();
        await llmServer.close();
    }
});

test('Agentic Executor restores pending approval from durable store after Gateway restart', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'humanclaw-pending-restore-'));
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
    let gateway = new HumanClawGateway({
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
        assert.equal(stored.pendingAgentApprovals[0].approvalId, approvalId);
        assert.equal(JSON.stringify(stored).includes('test-key'), false);

        await gateway.stop();

        gateway = new HumanClawGateway({
            port: 0,
            workspaceRoot,
            projectRoot: path.resolve('.'),
            auditDir
        });
        const restarted = await gateway.start();
        assert.equal(restarted.agentRunner.restoredPendingAgentApprovalCount, 1);

        const confirmed = await runAgent(restarted.url, {
            sessionId: 'pending-restore-test',
            message: '确认执行',
            llmSettings,
            context: { workspace: workspaceRoot }
        });
        assert.equal(confirmed.body.ok, true, confirmed.body.displayText);
        assert.equal(confirmed.body.status, 'completed');
        assert.match(confirmed.body.displayText, /Agentic Executor 已完成/);

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
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'humanclaw-vision-agent-'));
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
                summary: '需要视觉感知能力',
                action: 'load_context',
                capability_request: {
                    skills: ['vision'],
                    tools: ['vision.capture_context'],
                    mcp: [],
                    reason: '用户要求观察当前屏幕'
                }
            };
        }
        if (decisionCount === 2) {
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
    const gateway = new HumanClawGateway({
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
        assert.match(first.body.displayText, /可以看一眼屏幕吗/);
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
            llmServer.calls.some((call) => /VISION SKILL/.test(call.payload.messages?.[1]?.content || call.system))
        );
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
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'humanclaw-vision-full-control-'));
    const captured = [];
    let agentDecisionCount = 0;
    const llmServer = await createScriptedChatCompletionsServer(({ messages }) => {
        const hasImageInput = messages.some((message) =>
            Array.isArray(message.content) &&
            message.content.some((part) => part?.type === 'image_url')
        );
        if (hasImageInput) {
            return '我看到桌面上有 AIGL 聊天窗口和桌宠，截图链路正常。';
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
            final_answer: '我看到了当前屏幕，AIGL 聊天窗口和桌宠都在，视觉截图链路正常。'
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
            message: 'AIGL，直接看一下当前屏幕，判断视觉截图功能是否正常。',
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
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'humanclaw-max-step-'));
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
    const gateway = new HumanClawGateway({
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
        assert.match(result.body.displayText, /工具步数上限/);
        assert.doesNotMatch(result.body.displayText, /```|secret-ish line|Agentic Executor/);
        assert.match(result.body.displayText, /读取 note\.txt：完成/);
    } finally {
        await gateway.stop();
        await llmServer.close();
    }
});

test('Agentic Executor loads email skill on model request and normalizes new-mail actions', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'humanclaw-email-agent-skill-'));
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
    const gateway = new HumanClawGateway({
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
        assert.equal(result.body.plan[0].tool, 'email');
        assert.equal(result.body.plan[0].args.action, 'list');
        assert.equal(result.body.plan[0].args.filter, 'unread');
        assert.doesNotMatch(llmServer.calls[0].system, /邮箱 SKILL/);
        assert.match(JSON.stringify(llmServer.calls[0].payload.messages), /capability_catalog/);
        assert.match(JSON.stringify(llmServer.calls[1].payload.messages), /邮箱 SKILL/);
        assert.match(JSON.stringify(llmServer.calls[1].payload.messages), /不要用 computer\.exec/);
    } finally {
        await gateway.stop();
        await llmServer.close();
    }
});

test('Agentic Executor email loop observes mailbox results before final answer', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'humanclaw-email-agent-loop-'));
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
    const gateway = new HumanClawGateway({
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
        assert.match(JSON.stringify(llmServer.calls[1].payload.messages), /邮箱 SKILL/);
        assert.match(JSON.stringify(llmServer.calls[2].payload.messages), /0 封未读新邮件/);
    } finally {
        await gateway.stop();
        await llmServer.close();
    }
});
