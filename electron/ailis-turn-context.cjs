'use strict';

const DEFAULT_RUN_TIMEOUT_MS = 90000;

function cloneJson(value) {
    if (value == null || typeof value !== 'object') {
        return value;
    }
    try {
        return JSON.parse(JSON.stringify(value));
    } catch {
        return value;
    }
}

function normalizeText(value = '', fallback = '') {
    if (typeof value !== 'string') {
        return fallback;
    }
    const trimmed = value.trim();
    return trimmed || fallback;
}

function buildToolContext(requestContext = {}, fallbackWorkspace = '', sessionId = '', options = {}) {
    const context = {
        workspace: requestContext.workspace || fallbackWorkspace,
        sessionKey: requestContext.sessionKey || sessionId || 'main',
        timeoutMs: Number(requestContext.timeoutMs || options.defaultTimeoutMs || DEFAULT_RUN_TIMEOUT_MS)
    };

    if (requestContext.approved === true) {
        context.approved = true;
    }
    if (requestContext.executeExternal === true) {
        context.executeExternal = true;
    }
    for (const key of [
        'runId',
        'run_id',
        'sessionId',
        'agentRole',
        'agent_role',
        'contextMode',
        'context_mode',
        'contextRole',
        'context_role',
        'agent_path',
        'agentPath',
        'taskAgent',
        'taskAgentThreadId',
        'task_agent_thread_id',
        'taskAgentTurnId',
        'task_agent_turn_id',
        'taskAgentRoutePending',
        'taskAgentRoutingOwned',
        'parentSessionId',
        'parent_session_id',
        'personaOrchestrator',
        'mainAgent',
        'permissionProfile',
        'permissions',
        'policy',
        'sandbox',
        'approvalPolicy',
        'confirmationPolicy',
        'requireApprovalForMutations',
        'autoConfirm',
        'allowOutsideWorkspace',
        'allowComputerWideAccess',
        'allowSystemMutation',
        'computerControlEnabled',
        'visionApproved',
        'visionPermissionPolicy',
        'visionPolicy',
        'attachments',
        'fileAttachments',
        'parentUserGoal',
        'parent_user_goal',
        'answerOnly',
        'exactAnswer',
        'exactAnswerMode',
        'exact_answer_mode',
        'directToolExecutor',
        'nativeDirectTools',
        'directToolLimit',
        'requireTaskExecution',
        'requireExecutionEvidence',
        'desktopRealEval',
        'desktopRealEvalTaskId',
        'desktopRealEvalTaskText',
        'benchmarkName',
        'benchmarkScenario',
        'runtimeEnvironmentOverride',
        'executionProfile',
        'evaluationTaskId',
        'evaluationName',
        'memoryPolicy',
        'memory_policy'
    ]) {
        if (requestContext[key] !== undefined) {
            context[key] = requestContext[key];
        }
    }

    return context;
}

function buildAilisTurnContext({
    runId = '',
    sessionId = '',
    message = '',
    request = {},
    requestContext = {},
    workspaceRoot = '',
    runtimeEnvironment = null,
    modelSettings = null,
    tools = [],
    memoryContext = '',
    fileAttachments = [],
    iteration = null,
    status = 'in_progress'
} = {}) {
    const normalizedSessionId = normalizeText(sessionId, requestContext.sessionId || 'main');
    const toolContext = buildToolContext(requestContext, workspaceRoot, normalizedSessionId);
    return {
        schema: 'ailis.turn_context.v1',
        runId: normalizeText(runId, requestContext.runId || ''),
        sessionId: normalizedSessionId,
        status,
        ...(Number.isFinite(Number(iteration)) ? { iteration: Number(iteration) } : {}),
        message: normalizeText(message),
        workspace: toolContext.workspace,
        sessionKey: toolContext.sessionKey,
        timeoutMs: toolContext.timeoutMs,
        request: {
            dryRun: request.dryRun === true,
            maxAgentSteps: Number(request.maxAgentSteps || requestContext.maxAgentSteps || 0) || null
        },
        requestContext: cloneJson(requestContext || {}),
        permissions: {
            approved: toolContext.approved === true,
            executeExternal: toolContext.executeExternal === true,
            permissionProfile: toolContext.permissionProfile || '',
            approvalPolicy: toolContext.approvalPolicy || '',
            confirmationPolicy: toolContext.confirmationPolicy || ''
        },
        runtimeEnvironment: runtimeEnvironment ? cloneJson(runtimeEnvironment) : null,
        model: modelSettings ? {
            provider: modelSettings.provider || '',
            model: modelSettings.model || '',
            baseUrl: modelSettings.baseUrl || modelSettings.apiBase || ''
        } : null,
        tools: Array.isArray(tools) ? tools.map((tool) => ({
            name: tool?.name || tool?.function?.name || '',
            type: tool?.type || 'function'
        })).filter((tool) => tool.name) : [],
        memory: {
            hasContext: Boolean(memoryContext),
            chars: String(memoryContext || '').length
        },
        attachments: Array.isArray(fileAttachments) ? fileAttachments.map((attachment) => ({
            path: attachment?.path || attachment?.filePath || '',
            name: attachment?.name || '',
            type: attachment?.type || attachment?.mimeType || ''
        })).filter((attachment) => attachment.path || attachment.name) : [],
        toolContext
    };
}

function buildToolStepContext({
    toolContext = {},
    runId = '',
    sessionId = '',
    planner = '',
    step = {},
    iteration = null
} = {}) {
    return {
        ...toolContext,
        runId,
        sessionId: toolContext.sessionId || sessionId || toolContext.sessionKey,
        planner,
        stepId: step.id,
        ...(Number.isFinite(Number(iteration)) ? { iteration: Number(iteration) } : {}),
        phase: step.phase || 'execute',
        ...(step.context || {})
    };
}

module.exports = {
    DEFAULT_RUN_TIMEOUT_MS,
    buildAilisTurnContext,
    buildToolContext,
    buildToolStepContext
};
