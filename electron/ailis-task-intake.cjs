'use strict';

const {
    callDesktopLlmProvider
} = require('./desktop-llm-provider.cjs');

const TASK_INTAKE_TOOL_NAME = 'task_intake_decision';
const TASK_INTAKE_TRANSCRIPT_LIMIT = 80;

const TASK_INTAKE_TOOL_SPEC = Object.freeze({
    name: TASK_INTAKE_TOOL_NAME,
    description: 'Record whether the persistent TaskAgent should execute the current user turn.',
    parameters: {
        type: 'object',
        additionalProperties: false,
        required: ['action'],
        properties: {
            action: {
                type: 'string',
                enum: ['observe', 'execute'],
                description: 'observe lets Persona answer conversationally; execute enters or steers the TaskAgent execution loop.'
            },
            reason: {
                type: 'string',
                description: 'A short internal explanation of the semantic decision.'
            }
        }
    }
});

function normalizeString(value, fallback = '') {
    const text = typeof value === 'string' ? value.trim() : '';
    return text || fallback;
}

function cloneJson(value, fallback = null) {
    try {
        return JSON.parse(JSON.stringify(value));
    } catch {
        return fallback;
    }
}

function normalizeVisibleTranscript(messageHistory = [], currentMessage = '') {
    const turns = (Array.isArray(messageHistory) ? messageHistory : [])
        .filter((entry) => entry && ['user', 'assistant'].includes(entry.role))
        .map((entry) => ({
            role: entry.role,
            content: normalizeString(entry.content)
        }))
        .filter((entry) => entry.content)
        .slice(-TASK_INTAKE_TRANSCRIPT_LIMIT);
    const current = normalizeString(currentMessage);
    const last = turns.at(-1);
    if (current && !(last?.role === 'user' && last.content === current)) {
        turns.push({ role: 'user', content: current });
    }
    return turns.slice(-TASK_INTAKE_TRANSCRIPT_LIMIT);
}

function buildTaskIntakeMessages({ message = '', messageHistory = [], taskState = null } = {}) {
    const visibleTranscript = normalizeVisibleTranscript(messageHistory, message);
    return [
        {
            role: 'system',
            content: [
                'You are the intake phase of the single persistent AILIS TaskAgent.',
                'You receive every user turn independently of Persona. Decide semantically whether the current turn should enter the TaskAgent execution loop.',
                'Choose execute when the user expects concrete work, current-information retrieval, computation, tool use, file or computer action, or a continuation/correction/steer of task work.',
                'Choose observe only when Persona can fully handle the turn as ordinary social conversation without promising later work or performing an external task.',
                'Use the visible transcript and task state only as context. Do not rewrite the request, create a task summary, choose tools, plan execution, or answer the user.',
                `Call ${TASK_INTAKE_TOOL_NAME} exactly once.`
            ].join('\n')
        },
        {
            role: 'user',
            content: JSON.stringify({
                current_user_message: normalizeString(message),
                visible_transcript: visibleTranscript,
                task_state: taskState && typeof taskState === 'object' ? cloneJson(taskState, {}) : null
            })
        }
    ];
}

function parseTaskIntakeDecision(response = {}) {
    if (!response?.ok) {
        return {
            ok: false,
            status: response?.code || 'provider_error',
            error: response?.error || 'TaskAgent intake model call failed.'
        };
    }
    const calls = Array.isArray(response.toolCalls) ? response.toolCalls : [];
    const call = calls.find((candidate) => normalizeString(candidate?.name) === TASK_INTAKE_TOOL_NAME);
    const args = call?.arguments && typeof call.arguments === 'object' && !Array.isArray(call.arguments)
        ? call.arguments
        : {};
    const action = normalizeString(args.action).toLowerCase();
    if (!['observe', 'execute'].includes(action)) {
        return {
            ok: false,
            status: 'invalid_task_intake_decision',
            error: `TaskAgent intake must call ${TASK_INTAKE_TOOL_NAME} with action observe or execute.`
        };
    }
    return {
        ok: true,
        status: 'decided',
        action,
        executionRequired: action === 'execute',
        reason: normalizeString(args.reason),
        usage: response.usage || null
    };
}

async function decideTaskAgentIntake({
    message = '',
    messageHistory = [],
    taskState = null,
    llmSettings = {},
    llmClient = callDesktopLlmProvider
} = {}) {
    const messages = buildTaskIntakeMessages({ message, messageHistory, taskState });
    const payload = {
        messages,
        tools: [TASK_INTAKE_TOOL_SPEC],
        toolChoice: { name: TASK_INTAKE_TOOL_NAME, required: true },
        preferNativeToolCalls: true,
        parallel_tool_calls: false,
        jsonMode: false,
        expectJson: false,
        maxTokens: 160,
        temperature: 0
    };
    let response = await llmClient(llmSettings, payload);
    let decision = parseTaskIntakeDecision(response);
    if (!decision.ok && response?.ok) {
        response = await llmClient(llmSettings, {
            ...payload,
            messages: [
                ...messages,
                {
                    role: 'system',
                    content: `Protocol repair: return exactly one native ${TASK_INTAKE_TOOL_NAME} call. Do not answer in prose.`
                }
            ]
        });
        decision = parseTaskIntakeDecision(response);
    }
    return {
        ...decision,
        transcript: normalizeVisibleTranscript(messageHistory, message)
    };
}

module.exports = {
    TASK_INTAKE_TOOL_NAME,
    TASK_INTAKE_TOOL_SPEC,
    TASK_INTAKE_TRANSCRIPT_LIMIT,
    buildTaskIntakeMessages,
    decideTaskAgentIntake,
    normalizeVisibleTranscript,
    parseTaskIntakeDecision
};
