'use strict';

const {
    callIdOf,
    cloneJson,
    isCallItem,
    isOutputItem,
    normalizeText
} = require('./ailis-response-model.cjs');

const RUNTIME_PROTOCOL_SCHEMA = 'ailis.agent_runtime_protocol.v1';
const RUNTIME_EVENT_SCHEMA = 'ailis.runtime_event.v1';

const RUNTIME_LAYER = Object.freeze({
    TURN_CONTEXT: 'turn_context',
    MODEL_INPUT: 'model_input',
    RESPONSE_ITEM: 'response_item',
    TOOL_ROUTER: 'tool_router',
    TOOL_EXECUTOR: 'tool_executor',
    OBSERVATION_ARTIFACT: 'observation_artifact',
    APPROVAL_INTERRUPT: 'approval_interrupt',
    EVENT_PROTOCOL: 'event_protocol',
    AGENT_LAB: 'agent_lab'
});

const TURN_STATUS = Object.freeze({
    CREATED: 'created',
    IN_PROGRESS: 'in_progress',
    WAITING_APPROVAL: 'waiting_approval',
    INTERRUPTED: 'interrupted',
    FAILED: 'failed',
    COMPLETED: 'completed'
});

const SUPPORTED_RESPONSE_ITEM_TYPES = Object.freeze([
    'message',
    'reasoning',
    'local_shell_call',
    'function_call',
    'custom_tool_call',
    'tool_search_call',
    'function_call_output',
    'custom_tool_call_output',
    'tool_search_output',
    'web_search_call',
    'image_generation_call',
    'compaction',
    'compaction_trigger',
    'context_compaction',
    'other'
]);

const MODEL_VISIBLE_RESPONSE_ITEM_TYPES = Object.freeze([
    'message',
    'reasoning',
    'local_shell_call',
    'function_call',
    'custom_tool_call',
    'tool_search_call',
    'function_call_output',
    'custom_tool_call_output',
    'tool_search_output'
]);


function modelVisibleResponseItemTypes() {
    return MODEL_VISIBLE_RESPONSE_ITEM_TYPES.slice();
}

function isSupportedResponseItemType(type = '') {
    return SUPPORTED_RESPONSE_ITEM_TYPES.includes(normalizeText(type));
}

function responseItemProtocolRole(item = {}) {
    if (!item || typeof item !== 'object') {
        return 'invalid';
    }
    if (item.type === 'message' || item.type === 'reasoning') {
        return 'model_context';
    }
    if (isCallItem(item)) {
        return 'tool_call';
    }
    if (isOutputItem(item)) {
        return 'tool_output';
    }
    if (['compaction', 'compaction_trigger', 'context_compaction'].includes(item.type)) {
        return 'context_control';
    }
    return isSupportedResponseItemType(item.type) ? 'runtime_extension' : 'unsupported';
}

function validateSupportedResponseItem(item = {}) {
    const type = normalizeText(item?.type);
    const errors = [];
    if (!item || typeof item !== 'object' || Array.isArray(item)) {
        return {
            ok: false,
            schema: RUNTIME_PROTOCOL_SCHEMA,
            type: '',
            role: 'invalid',
            errors: ['response item must be an object']
        };
    }
    if (!isSupportedResponseItemType(type)) {
        errors.push(`unsupported response item type: ${type || '<empty>'}`);
    }
    if (type === 'message') {
        if (!normalizeText(item.role)) {
            errors.push('message.role is required');
        }
        if (!Array.isArray(item.content) || item.content.length === 0) {
            errors.push('message.content must be a non-empty array');
        }
    }
    if (type === 'function_call') {
        if (!normalizeText(item.name)) {
            errors.push('function_call.name is required');
        }
        if (!callIdOf(item)) {
            errors.push('function_call.call_id is required');
        }
        if (typeof item.arguments !== 'string') {
            errors.push('function_call.arguments must be a JSON string');
        }
    }
    if (type === 'custom_tool_call') {
        if (!normalizeText(item.name)) {
            errors.push('custom_tool_call.name is required');
        }
        if (!callIdOf(item)) {
            errors.push('custom_tool_call.call_id is required');
        }
    }
    if (type === 'local_shell_call') {
        if (!callIdOf(item)) {
            errors.push('local_shell_call.call_id is required');
        }
    }
    if (type === 'tool_search_call' && !callIdOf(item) && item.execution !== 'server') {
        errors.push('tool_search_call.call_id is required unless execution is server');
    }
    if (['function_call_output', 'custom_tool_call_output'].includes(type) && !callIdOf(item)) {
        errors.push(`${type}.call_id is required`);
    }
    if (type === 'tool_search_output' && !callIdOf(item) && item.execution !== 'server') {
        errors.push('tool_search_output.call_id is required unless execution is server');
    }
    return {
        ok: errors.length === 0,
        schema: RUNTIME_PROTOCOL_SCHEMA,
        type,
        role: responseItemProtocolRole(item),
        callId: callIdOf(item) || null,
        errors
    };
}

function inferRuntimeLayer(type = '') {
    const normalized = normalizeText(type);
    if (/^(turn\.|agent\.run\.)/.test(normalized)) {
        return RUNTIME_LAYER.TURN_CONTEXT;
    }
    if (/context_snapshot|model_input|prompt/.test(normalized)) {
        return RUNTIME_LAYER.MODEL_INPUT;
    }
    if (/llm_call|decision|reasoning|final|blocked/.test(normalized)) {
        return RUNTIME_LAYER.RESPONSE_ITEM;
    }
    if (/tool\.call|tool_call|tool_search/.test(normalized)) {
        return RUNTIME_LAYER.TOOL_ROUTER;
    }
    if (/tool\.result|tool_result|tool\.finished|tool\.failure|tool\.success/.test(normalized)) {
        return RUNTIME_LAYER.TOOL_EXECUTOR;
    }
    if (/artifact|observation|ledger/.test(normalized)) {
        return RUNTIME_LAYER.OBSERVATION_ARTIFACT;
    }
    if (/approval|interrupt|aborted|cancel/.test(normalized)) {
        return RUNTIME_LAYER.APPROVAL_INTERRUPT;
    }
    if (/lab|analysis|debug/.test(normalized)) {
        return RUNTIME_LAYER.AGENT_LAB;
    }
    return RUNTIME_LAYER.EVENT_PROTOCOL;
}

function inferRuntimeCategory(type = '', layer = '') {
    const normalized = normalizeText(type);
    if (layer === RUNTIME_LAYER.TOOL_ROUTER || layer === RUNTIME_LAYER.TOOL_EXECUTOR) {
        return 'tool';
    }
    if (layer === RUNTIME_LAYER.APPROVAL_INTERRUPT) {
        return 'control';
    }
    if (layer === RUNTIME_LAYER.MODEL_INPUT || layer === RUNTIME_LAYER.OBSERVATION_ARTIFACT) {
        return 'context';
    }
    if (/final|blocked|completed/.test(normalized)) {
        return 'result';
    }
    if (/llm|decision|reasoning/.test(normalized)) {
        return 'agent';
    }
    return 'runtime';
}

function inferRuntimeSeverity(event = {}) {
    const type = normalizeText(event.type);
    const status = normalizeText(event.status || event.payload?.status);
    if (event.ok === false || /fail|error|blocked|invalid/.test(type) || /fail|error|blocked|invalid/.test(status)) {
        return 'error';
    }
    if (/approval|waiting|interrupt|cancel/.test(type) || /waiting|pending|interrupted/.test(status)) {
        return 'warning';
    }
    return 'info';
}

function firstDefined(...values) {
    return values.find((value) => value !== undefined && value !== null && value !== '');
}

function normalizeRuntimeEvent(event = {}, defaults = {}) {
    const base = event && typeof event === 'object' && !Array.isArray(event) ? cloneJson(event) : {};
    const payload = base.payload && typeof base.payload === 'object' && !Array.isArray(base.payload)
        ? base.payload
        : {};
    const type = normalizeText(firstDefined(base.type, defaults.type, 'runtime.event'));
    const layer = normalizeText(firstDefined(base.layer, defaults.layer, inferRuntimeLayer(type)));
    const category = normalizeText(firstDefined(base.category, defaults.category, inferRuntimeCategory(type, layer)));
    const status = normalizeText(firstDefined(base.status, payload.status, defaults.status));
    const runId = normalizeText(firstDefined(base.runId, payload.runId, payload.context?.runId, defaults.runId));
    const callId = normalizeText(firstDefined(base.callId, base.call_id, payload.callId, payload.call_id, defaults.callId));
    const iteration = firstDefined(base.iteration, payload.iteration, defaults.iteration);

    return {
        ...base,
        schema: base.schema || RUNTIME_EVENT_SCHEMA,
        protocol: base.protocol || RUNTIME_PROTOCOL_SCHEMA,
        type,
        layer,
        category,
        severity: base.severity || inferRuntimeSeverity({ ...base, type, status }),
        ...(status ? { status } : {}),
        ...(runId ? { runId } : {}),
        ...(callId ? { callId } : {}),
        ...(Number.isFinite(Number(iteration)) ? { iteration: Number(iteration) } : {})
    };
}

function runtimeEventMetadata({ type = '', payload = {}, status = '' } = {}) {
    const normalized = normalizeRuntimeEvent({ type, payload, status });
    const metadata = {
        schema: normalized.schema,
        protocol: normalized.protocol,
        layer: normalized.layer,
        category: normalized.category,
        severity: normalized.severity
    };
    for (const key of ['status', 'runId', 'callId', 'iteration']) {
        if (normalized[key] !== undefined && normalized[key] !== null && normalized[key] !== '') {
            metadata[key] = normalized[key];
        }
    }
    return metadata;
}

module.exports = {
    MODEL_VISIBLE_RESPONSE_ITEM_TYPES,
    RESPONSE_ITEM_TYPES: SUPPORTED_RESPONSE_ITEM_TYPES,
    RUNTIME_EVENT_SCHEMA,
    RUNTIME_LAYER,
    RUNTIME_PROTOCOL_SCHEMA,
    TURN_STATUS,
    inferRuntimeCategory,
    inferRuntimeLayer,
    modelVisibleResponseItemTypes,
    normalizeRuntimeEvent,
    responseItemProtocolRole,
    runtimeEventMetadata,
    validateSupportedResponseItem
};
