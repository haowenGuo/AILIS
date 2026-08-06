import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import test from 'node:test';

const require = createRequire(import.meta.url);

const {
    ResponseItem
} = require('../electron/ailis-response-model.cjs');
const {
    toolOutputToRuntimeEvent
} = require('../electron/ailis-agent-object-model.cjs');
const {
    RUNTIME_LAYER,
    inferRuntimeLayer,
    modelVisibleResponseItemTypes,
    normalizeRuntimeEvent,
    responseItemProtocolRole,
    runtimeEventMetadata,
    validateSupportedResponseItem
} = require('../electron/ailis-agent-runtime-protocol.cjs');
const {
    buildAilisTurnContext,
    buildToolContext
} = require('../electron/ailis-turn-context.cjs');
const {
    executeToolStep
} = require('../electron/ailis-tool-executor.cjs');

test('AILIS runtime protocol validates the Codex-like ResponseItem subset', () => {
    const functionCall = ResponseItem.functionCall({
        name: 'artifact_tools',
        arguments: { action: 'inspect' },
        call_id: 'call_1'
    });
    const toolSearchCall = ResponseItem.toolSearchCall({
        call_id: 'search_1',
        arguments: { query: 'xlsx reader' }
    });
    const customCall = ResponseItem.customToolCall({
        call_id: 'custom_1',
        name: 'shell_patch',
        input: 'apply patch'
    });
    const localShellCall = ResponseItem.localShellCall({
        call_id: 'shell_1',
        action: { command: 'echo ok' }
    });
    const serverToolSearchOutput = {
        type: 'tool_search_output',
        call_id: '',
        status: 'completed',
        execution: 'server',
        tools: [{ name: 'artifact_tools' }]
    };
    const serverToolSearchCall = ResponseItem.toolSearchCall({
        status: 'completed',
        execution: 'server',
        arguments: { query: 'artifact_tools' }
    });

    for (const item of [functionCall, toolSearchCall, customCall, localShellCall, serverToolSearchCall, serverToolSearchOutput]) {
        assert.equal(validateSupportedResponseItem(item).ok, true);
    }

    assert.equal(responseItemProtocolRole(functionCall), 'tool_call');
    assert.equal(responseItemProtocolRole(serverToolSearchOutput), 'tool_output');
    assert.ok(modelVisibleResponseItemTypes().includes('function_call_output'));
});

test('AILIS runtime protocol rejects malformed executable ResponseItems', () => {
    const invalidFunctionCall = {
        type: 'function_call',
        name: 'artifact_tools',
        arguments: { action: 'inspect' }
    };
    const result = validateSupportedResponseItem(invalidFunctionCall);

    assert.equal(result.ok, false);
    assert.match(result.errors.join('\n'), /call_id is required/);
    assert.match(result.errors.join('\n'), /arguments must be a JSON string/);
});

test('AILIS runtime protocol classifies events into runtime layers', () => {
    assert.equal(inferRuntimeLayer('agent.context_snapshot'), RUNTIME_LAYER.MODEL_INPUT);
    assert.equal(inferRuntimeLayer('tool_result'), RUNTIME_LAYER.TOOL_EXECUTOR);
    assert.equal(inferRuntimeLayer('approval.requested'), RUNTIME_LAYER.APPROVAL_INTERRUPT);

    const metadata = runtimeEventMetadata({
        type: 'agent.context_snapshot',
        payload: { runId: 'run_1', iteration: 2, status: 'captured' }
    });

    assert.equal(metadata.schema, 'ailis.runtime_event.v1');
    assert.equal(metadata.protocol, 'ailis.agent_runtime_protocol.v1');
    assert.equal(metadata.layer, RUNTIME_LAYER.MODEL_INPUT);
    assert.equal(metadata.category, 'context');
    assert.equal(metadata.runId, 'run_1');
    assert.equal(metadata.iteration, 2);
});

test('tool output runtime events carry protocol metadata without losing old fields', () => {
    const event = toolOutputToRuntimeEvent({
        callId: 'call_tool_1',
        sourceId: 'step_1',
        title: 'Read workbook',
        toolName: 'artifact_tools',
        args: { action: 'query' },
        status: 'failed',
        ok: false,
        outputPreview: 'range missing',
        errorSummary: 'No sheet named Sheet1',
        durationMs: 42
    });

    assert.equal(event.schema, 'ailis.runtime_event.v1');
    assert.equal(event.protocol, 'ailis.agent_runtime_protocol.v1');
    assert.equal(event.layer, RUNTIME_LAYER.TOOL_EXECUTOR);
    assert.equal(event.category, 'tool');
    assert.equal(event.severity, 'error');
    assert.equal(event.type, 'tool_result');
    assert.equal(event.callId, 'call_tool_1');
    assert.equal(event.preview, 'range missing');
    assert.equal(event.errorSummary, 'No sheet named Sheet1');
});

test('normalizeRuntimeEvent keeps existing event payload while adding protocol metadata', () => {
    const event = normalizeRuntimeEvent({
        type: 'agent.step.finished',
        payload: { marker: 'done' },
        status: 'completed'
    });

    assert.equal(event.schema, 'ailis.runtime_event.v1');
    assert.equal(event.protocol, 'ailis.agent_runtime_protocol.v1');
    assert.equal(event.payload.marker, 'done');
    assert.equal(event.status, 'completed');
});

test('TurnContext builds the per-turn runtime envelope without leaking provider secrets', () => {
    const turnContext = buildAilisTurnContext({
        runId: 'run_1',
        sessionId: 'session_1',
        message: 'read the workbook',
        request: { maxAgentSteps: 3 },
        requestContext: {
            workspace: 'F:/workspace',
            approved: true,
            permissionProfile: 'workspace-write'
        },
        workspaceRoot: 'F:/fallback',
        runtimeEnvironment: { family: 'windows', default_shell: 'powershell' },
        modelSettings: {
            provider: 'deepseek',
            model: 'deepseek-chat',
            baseUrl: 'https://api.deepseek.com',
            apiKey: 'secret-key'
        },
        tools: [{ name: 'artifact_tools' }, { type: 'function', name: 'exec' }],
        memoryContext: 'known user preference',
        fileAttachments: [{ path: 'F:/workspace/task.xlsx', name: 'task.xlsx' }],
        iteration: 2
    });

    assert.equal(turnContext.schema, 'ailis.turn_context.v1');
    assert.equal(turnContext.workspace, 'F:/workspace');
    assert.equal(turnContext.permissions.approved, true);
    assert.equal(turnContext.runtimeEnvironment.family, 'windows');
    assert.deepEqual(turnContext.tools.map((tool) => tool.name), ['artifact_tools', 'exec']);
    assert.equal(turnContext.memory.hasContext, true);
    assert.equal(turnContext.model.provider, 'deepseek');
    assert.equal(Object.hasOwn(turnContext.model, 'apiKey'), false);
});

test('ToolContext keeps approval and sandbox policy in one reusable object', () => {
    const context = buildToolContext({
        workspace: 'F:/repo',
        sessionKey: 'main',
        runId: 'persona_run_1',
        sessionId: 'persona_session_1',
        agentRole: 'persona_orchestrator',
        contextMode: 'persona',
        agent_path: '/root',
        parentSessionId: 'persona_session_1',
        taskAgentThreadId: 'thread_1',
        taskAgentTurnId: 'turn_1',
        approved: true,
        allowOutsideWorkspace: true,
        permissionProfile: 'full-access',
        answerOnly: true,
        exactAnswerMode: true,
        directToolExecutor: true,
        nativeDirectTools: true,
        directToolLimit: 35,
        requireTaskExecution: true,
        requireExecutionEvidence: true,
        desktopRealEval: true,
        desktopRealEvalTaskId: 'toolsandbox-scenario-1',
        desktopRealEvalTaskText: 'Run the official scenario.',
        benchmarkName: 'Apple ToolSandbox',
        benchmarkScenario: 'toolsandbox-scenario-1',
        runtimeEnvironmentOverride: {
            source: 'toolsandbox_benchmark_clock',
            current_date: '2026-07-17'
        },
        executionProfile: { kind: 'exact_answer_eval' },
        evaluationTaskId: 'gaia-task-1',
        evaluationName: 'gaia_desktop_real',
        memoryPolicy: 'disabled',
        timeoutMs: 1234
    }, 'F:/fallback', 'session_1');

    assert.equal(context.workspace, 'F:/repo');
    assert.equal(context.sessionKey, 'main');
    assert.equal(context.runId, 'persona_run_1');
    assert.equal(context.sessionId, 'persona_session_1');
    assert.equal(context.agentRole, 'persona_orchestrator');
    assert.equal(context.contextMode, 'persona');
    assert.equal(context.agent_path, '/root');
    assert.equal(context.parentSessionId, 'persona_session_1');
    assert.equal(context.taskAgentThreadId, 'thread_1');
    assert.equal(context.taskAgentTurnId, 'turn_1');
    assert.equal(context.approved, true);
    assert.equal(context.allowOutsideWorkspace, true);
    assert.equal(context.permissionProfile, 'full-access');
    assert.equal(context.answerOnly, true);
    assert.equal(context.exactAnswerMode, true);
    assert.equal(context.directToolExecutor, true);
    assert.equal(context.nativeDirectTools, true);
    assert.equal(context.directToolLimit, 35);
    assert.equal(context.requireTaskExecution, true);
    assert.equal(context.requireExecutionEvidence, true);
    assert.equal(context.desktopRealEval, true);
    assert.equal(context.desktopRealEvalTaskId, 'toolsandbox-scenario-1');
    assert.equal(context.desktopRealEvalTaskText, 'Run the official scenario.');
    assert.equal(context.benchmarkName, 'Apple ToolSandbox');
    assert.equal(context.benchmarkScenario, 'toolsandbox-scenario-1');
    assert.deepEqual(context.runtimeEnvironmentOverride, {
        source: 'toolsandbox_benchmark_clock',
        current_date: '2026-07-17'
    });
    assert.deepEqual(context.executionProfile, { kind: 'exact_answer_eval' });
    assert.equal(context.evaluationTaskId, 'gaia-task-1');
    assert.equal(context.evaluationName, 'gaia_desktop_real');
    assert.equal(context.memoryPolicy, 'disabled');
    assert.equal(context.timeoutMs, 1234);
});

test('ToolExecutor executes one step and lets AgentRunner decorate the result', async () => {
    const events = [];
    const calls = [];
    const gateway = {
        emitGatewayEvent(type, payload) {
            events.push({ type, payload });
        },
        async callTool(request) {
            calls.push(request);
            return {
                ok: true,
                status: 'completed',
                result: { content: [{ type: 'text', text: 'ok' }] }
            };
        }
    };

    const result = await executeToolStep({
        gateway,
        runId: 'run_1',
        sessionId: 'session_1',
        step: {
            id: 'step_1',
            title: 'Read file',
            tool: 'read',
            args: { path: 'task.txt' }
        },
        toolContext: {
            workspace: 'F:/repo',
            sessionKey: 'session_1',
            approved: true,
            timeoutMs: 90000
        },
        request: { timeoutMs: 5000 },
        iteration: 1,
        planner: 'llm-agentic-executor',
        decorateStepResult(stepResult) {
            return {
                ...stepResult,
                evidenceArtifacts: [{ id: 'ev_1' }]
            };
        },
        finishedPayload(stepResult) {
            return {
                evidenceRefs: stepResult.evidenceArtifacts.map((artifact) => artifact.id)
            };
        }
    });

    assert.equal(result.response.ok, true);
    assert.deepEqual(result.evidenceArtifacts, [{ id: 'ev_1' }]);
    assert.equal(calls.length, 1);
    assert.equal(calls[0].tool, 'read');
    assert.equal(calls[0].timeoutMs, 5000);
    assert.equal(calls[0].context.timeoutMs, 90000);
    assert.equal(calls[0].context.runId, 'run_1');
    assert.equal(calls[0].context.sessionId, 'session_1');
    assert.equal(calls[0].context.iteration, 1);
    assert.deepEqual(events.map((event) => event.type), ['agent.step.started', 'agent.step.finished']);
    assert.deepEqual(events[1].payload.evidenceRefs, ['ev_1']);
});
