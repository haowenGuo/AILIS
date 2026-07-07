'use strict';

const { summarizeForModel } = require('./ailis-runtime-budget.cjs');
const { ContextManager } = require('./ailis-context-manager.cjs');
const {
    FunctionCallOutputPayload,
    ResponseItem,
    normalizeText,
    responseItemOutputToText,
    safeJsonStringify
} = require('./ailis-response-model.cjs');
const {
    normalizeToolOutput,
    toolOutputToResponseItems
} = require('./ailis-agent-object-model.cjs');
const { dropTrailingDuplicateUserMessage } = require('./ailis-message-history.cjs');

function textContent(text = '') {
    const normalized = normalizeText(text);
    return normalized ? [{ type: 'input_text', text: normalized }] : [];
}

function outputTextContent(text = '') {
    const normalized = normalizeText(text);
    return normalized ? [{ type: 'output_text', text: normalized }] : [];
}

function responseMessage(role, text, options = {}) {
    return ResponseItem.message({
        role,
        content: role === 'assistant' ? outputTextContent(text) : textContent(text),
        phase: options.phase
    });
}

function functionCall({
    name,
    arguments: rawArguments = {},
    call_id: callId,
    namespace = null,
    provider_metadata: providerMetadata = null
} = {}) {
    return ResponseItem.functionCall({
        name,
        arguments: rawArguments,
        call_id: callId,
        namespace,
        provider_metadata: providerMetadata
    });
}

function functionCallOutput({ call_id: callId, output = '', success = null } = {}) {
    return ResponseItem.functionCallOutput({
        call_id: callId,
        output: FunctionCallOutputPayload.normalize(output, { success })
    });
}

function toolSearchCall({ call_id: callId, arguments: rawArguments = {} } = {}) {
    return ResponseItem.toolSearchCall({
        call_id: callId,
        status: 'completed',
        execution: 'client',
        arguments: rawArguments
    });
}

function toolSearchOutput({ call_id: callId, tools = [] } = {}) {
    return ResponseItem.toolSearchOutput({
        call_id: callId,
        status: 'completed',
        execution: 'client',
        tools
    });
}

function toolOutputToModelInputItems(toolOutputLike = {}, index = 0, options = {}) {
    const toolOutput = normalizeToolOutput(toolOutputLike, index, {
        previewChars: options.previewChars,
        keepOriginal: false
    });
    if (!toolOutput.toolName) {
        return [];
    }
    return toolOutputToResponseItems(toolOutput, {
        toolOutputChars: options.toolOutputChars || 24000
    }).filter(Boolean);
}

function conversationToResponseItems(messageHistory = [], options = {}) {
    const maxItems = Number(options.maxItems || 6);
    return (Array.isArray(messageHistory) ? messageHistory : [])
        .slice(-maxItems)
        .map((entry) => {
            const role = entry?.role === 'assistant' ? 'assistant' : 'user';
            return responseMessage(role, entry?.content || entry?.text || entry?.message || '');
        })
        .filter(Boolean);
}

function buildContextMessage({
    memoryContext = '',
    fileAttachments = [],
    runtimeEnvironment = null,
    capabilityCatalog = null,
    externalToolExposure = null
} = {}) {
    const context = {};
    if (memoryContext) {
        context.memory_context = summarizeForModel(memoryContext, 4000);
    }
    if (Array.isArray(fileAttachments) && fileAttachments.length) {
        context.attached_files = fileAttachments;
    }
    if (runtimeEnvironment) {
        context.runtime_environment = runtimeEnvironment;
    }
    if (capabilityCatalog) {
        context.capability_catalog = capabilityCatalog;
    }
    if (externalToolExposure?.tools?.length) {
        context.external_tool_exposure = externalToolExposure;
    }
    if (!Object.keys(context).length) {
        return null;
    }
    return responseMessage('user', safeJsonStringify({
        type: 'context',
        ...context
    }, '{}'));
}

function buildModelInput({
    message = '',
    messageHistory = [],
    toolOutputs = [],
    memoryContext = '',
    fileAttachments = [],
    runtimeEnvironment = null,
    capabilityCatalog = null,
    externalToolExposure = null,
    toolOutputChars = 24000
} = {}) {
    const history = buildModelInputContextManager({
        message,
        messageHistory,
        toolOutputs,
        memoryContext,
        fileAttachments,
        runtimeEnvironment,
        capabilityCatalog,
        externalToolExposure,
        toolOutputChars
    });
    return history.forPrompt();
}

function buildModelInputContextManager({
    message = '',
    messageHistory = [],
    toolOutputs = [],
    memoryContext = '',
    fileAttachments = [],
    runtimeEnvironment = null,
    capabilityCatalog = null,
    externalToolExposure = null,
    toolOutputChars = 24000
} = {}) {
    const history = new ContextManager({ toolOutputChars });
    const priorMessageHistory = dropTrailingDuplicateUserMessage(messageHistory, message);
    history.recordItems(conversationToResponseItems(priorMessageHistory));
    const contextMessage = buildContextMessage({
        memoryContext,
        fileAttachments,
        runtimeEnvironment,
        capabilityCatalog,
        externalToolExposure
    });
    if (contextMessage) {
        history.recordItems([contextMessage]);
    }
    const userMessage = responseMessage('user', message);
    if (userMessage) {
        history.recordItems([userMessage]);
    }
    for (const [index, toolOutput] of (Array.isArray(toolOutputs) ? toolOutputs : []).entries()) {
        history.recordItems(toolOutputToModelInputItems(toolOutput, index, { toolOutputChars }));
    }
    return history;
}

function recordToolOutputToContextManager(contextManager, toolOutput = {}, index = 0, options = {}) {
    if (!contextManager || typeof contextManager.recordItems !== 'function') {
        return [];
    }
    const items = toolOutputToModelInputItems(toolOutput, index, options);
    contextManager.recordItems(items, options);
    return items;
}

function restoreModelInputContextManagerFromCheckpoint(checkpoint = null, options = {}) {
    return ContextManager.fromCheckpoint(checkpoint, options);
}

function responseItemsToChatMessages({ instructions = '', input = [] } = {}) {
    const messages = [];
    if (normalizeText(instructions)) {
        messages.push({ role: 'system', content: instructions });
    }
    for (const item of Array.isArray(input) ? input : []) {
        if (item?.type === 'message') {
            const content = Array.isArray(item.content)
                ? item.content.map((part) => part?.text || part?.content || '').filter(Boolean).join('\n')
                : normalizeText(item.content);
            if (content) {
                messages.push({ role: item.role === 'assistant' ? 'assistant' : 'user', content });
            }
            continue;
        }
        if (item?.type === 'function_call' || item?.type === 'custom_tool_call') {
            messages.push({
                role: 'assistant',
                content: '',
                ...(item.provider_metadata ? { providerMetadata: item.provider_metadata } : {}),
                tool_calls: [{
                    id: item.call_id,
                    type: 'function',
                    function: {
                        name: item.name,
                        arguments: typeof item.arguments === 'string' ? item.arguments : safeJsonStringify(item.arguments, '{}')
                    }
                }]
            });
            continue;
        }
        if (item?.type === 'tool_search_call') {
            messages.push({
                role: 'assistant',
                content: '',
                ...(item.provider_metadata ? { providerMetadata: item.provider_metadata } : {}),
                tool_calls: [{
                    id: item.call_id,
                    type: 'function',
                    function: {
                        name: 'tool_search',
                        arguments: safeJsonStringify(item.arguments || {}, '{}')
                    }
                }]
            });
            continue;
        }
        if (item?.type === 'function_call_output' || item?.type === 'custom_tool_call_output') {
            messages.push({
                role: 'tool',
                tool_call_id: item.call_id,
                content: responseItemOutputToText(item)
            });
            continue;
        }
        if (item?.type === 'tool_search_output') {
            messages.push({
                role: 'tool',
                tool_call_id: item.call_id,
                content: safeJsonStringify({
                    status: item.status,
                    execution: item.execution,
                    tools: item.tools || []
                }, '{}')
            });
        }
    }
    return messages;
}

module.exports = {
    buildModelInput,
    buildModelInputContextManager,
    functionCall,
    functionCallOutput,
    recordToolOutputToContextManager,
    restoreModelInputContextManagerFromCheckpoint,
    responseItemsToChatMessages,
    responseMessage,
    toolOutputToModelInputItems,
    toolSearchCall,
    toolSearchOutput
};
