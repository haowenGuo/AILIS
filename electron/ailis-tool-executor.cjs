'use strict';

const {
    buildToolStepContext
} = require('./ailis-turn-context.cjs');

function emitGatewayEvent(gateway, type, payload = {}) {
    gateway?.emitGatewayEvent?.(type, payload);
}

async function executeToolStep({
    gateway,
    runId = '',
    sessionId = '',
    step = {},
    toolContext = {},
    request = {},
    iteration = null,
    planner = 'llm-agentic-executor',
    decorateStepResult = null,
    finishedPayload = null
} = {}) {
    const phase = step.phase || 'execute';
    const iterationValue = Number.isFinite(Number(iteration)) ? Number(iteration) : null;
    const baseEvent = {
        runId,
        stepId: step.id,
        title: step.title,
        tool: step.tool,
        args: step.args,
        planner,
        phase,
        ...(iterationValue != null ? { iteration: iterationValue } : {})
    };

    emitGatewayEvent(gateway, 'agent.step.started', baseEvent);

    const response = await gateway.callTool({
        tool: step.tool,
        args: step.args,
        context: buildToolStepContext({
            toolContext,
            runId,
            sessionId,
            planner,
            step,
            iteration: iterationValue
        }),
        timeoutMs: request.timeoutMs
    });

    const baseStepResult = {
        id: step.id,
        title: step.title,
        tool: step.tool,
        args: step.args,
        ...(step.providerMetadata ? { providerMetadata: step.providerMetadata } : {}),
        ...(step.provider_metadata ? { provider_metadata: step.provider_metadata } : {}),
        ...(step.nativeToolCall ? { nativeToolCall: step.nativeToolCall } : {}),
        phase,
        ...(iterationValue != null ? { iteration: iterationValue } : {}),
        response
    };
    const stepResult = typeof decorateStepResult === 'function'
        ? await decorateStepResult(baseStepResult)
        : baseStepResult;
    const extraFinishedPayload = typeof finishedPayload === 'function'
        ? finishedPayload(stepResult)
        : (finishedPayload && typeof finishedPayload === 'object' ? finishedPayload : {});

    emitGatewayEvent(gateway, 'agent.step.finished', {
        runId,
        stepId: step.id,
        tool: step.tool,
        status: response.status,
        ok: response.ok,
        ...extraFinishedPayload,
        planner,
        phase,
        ...(iterationValue != null ? { iteration: iterationValue } : {})
    });

    return stepResult;
}

module.exports = {
    executeToolStep
};
