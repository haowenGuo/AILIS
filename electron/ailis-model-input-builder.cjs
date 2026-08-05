'use strict';

const fs = require('fs');
const path = require('path');
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

function modelInputImageUrl(value = '') {
    const source = normalizeText(value);
    if (!source || /^(?:data:|https?:\/\/)/i.test(source)) {
        return source;
    }
    let filePath = source;
    if (source.startsWith('file://')) {
        try {
            filePath = decodeURIComponent(new URL(source).pathname.replace(/^\/([A-Za-z]:)/, '$1'));
        } catch {
            return source;
        }
    }
    const resolved = path.resolve(filePath);
    const stat = (() => {
        try {
            return fs.statSync(resolved);
        } catch {
            return null;
        }
    })();
    if (!stat?.isFile() || stat.size > 20 * 1024 * 1024) {
        return source;
    }
    const extension = path.extname(resolved).toLowerCase();
    const mimeType = extension === '.jpg' || extension === '.jpeg'
        ? 'image/jpeg'
        : extension === '.webp'
        ? 'image/webp'
        : extension === '.gif'
        ? 'image/gif'
        : 'image/png';
    return `data:${mimeType};base64,${fs.readFileSync(resolved).toString('base64')}`;
}

function responseItemOutputImages(item = {}) {
    if (item?.type !== 'function_call_output' && item?.type !== 'custom_tool_call_output') {
        return [];
    }
    const output = FunctionCallOutputPayload.normalize(item.output);
    if (output.body?.kind !== 'content_items') {
        return [];
    }
    return output.body.value
        .filter((part) => part?.type === 'input_image')
        .map((part) => ({
            type: 'image_url',
            image_url: {
                url: modelInputImageUrl(part.image_url || part.url)
            },
            detail: normalizeText(part.detail) || 'original'
        }))
        .filter((part) => part.image_url.url);
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

function memoryContextToText(memoryContext = '') {
    if (!memoryContext) {
        return '';
    }
    if (typeof memoryContext.asDeveloperInstruction === 'function') {
        return normalizeText(memoryContext.asDeveloperInstruction());
    }
    return normalizeText(memoryContext);
}

function buildMemoryDeveloperMessage(memoryContext = '') {
    const text = memoryContextToText(memoryContext);
    if (!text) {
        return null;
    }
    const wrapped = /<memory_context>/i.test(text)
        ? text
        : [
              '<memory_context>',
              'This is local background memory. The current user message is authoritative if there is any conflict.',
              text,
              '</memory_context>'
          ].join('\n');
    return responseMessage('developer', wrapped);
}

function buildContextMessage({
    fileAttachments = [],
    modelImageAttachments = [],
    runtimeEnvironment = null,
    capabilityCatalog = null,
    externalToolExposure = null
} = {}) {
    const context = {};
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
    const content = textContent(safeJsonStringify({
        type: 'context',
        ...context
    }, '{}'));
    for (const attachment of Array.isArray(modelImageAttachments) ? modelImageAttachments : []) {
        const imageUrl = normalizeText(
            attachment?.image_url ||
            attachment?.imageUrl ||
            attachment?.url ||
            attachment?.path
        );
        if (!imageUrl) {
            continue;
        }
        content.push({
            type: 'input_image',
            image_url: imageUrl,
            detail: normalizeText(attachment?.detail) || 'original'
        });
    }
    return ResponseItem.message({ role: 'user', content });
}

function buildModelInput({
    message = '',
    messageHistory = [],
    toolOutputs = [],
    memoryContext = '',
    fileAttachments = [],
    modelImageAttachments = [],
    inputModalities = [],
    runtimeEnvironment = null,
    capabilityCatalog = null,
    externalToolExposure = null,
    toolOutputChars = 24000,
    ephemeralDeveloperMessage = '',
    suppressCurrentUserMessage = false
} = {}) {
    const history = buildModelInputContextManager({
        message,
        messageHistory,
        toolOutputs,
        memoryContext,
        fileAttachments,
        modelImageAttachments,
        runtimeEnvironment,
        capabilityCatalog,
        externalToolExposure,
        toolOutputChars,
        ephemeralDeveloperMessage,
        suppressCurrentUserMessage
    });
    return history.forPrompt({ inputModalities });
}

function buildModelInputContextManager({
    message = '',
    messageHistory = [],
    toolOutputs = [],
    memoryContext = '',
    fileAttachments = [],
    modelImageAttachments = [],
    runtimeEnvironment = null,
    capabilityCatalog = null,
    externalToolExposure = null,
    toolOutputChars = 24000,
    ephemeralDeveloperMessage = '',
    suppressCurrentUserMessage = false
} = {}) {
    const history = new ContextManager({ toolOutputChars });
    const priorMessageHistory = dropTrailingDuplicateUserMessage(messageHistory, message);
    const memoryMessage = buildMemoryDeveloperMessage(memoryContext);
    if (memoryMessage) {
        history.recordItems([memoryMessage]);
    }
    history.recordItems(conversationToResponseItems(priorMessageHistory));
    const contextMessage = buildContextMessage({
        fileAttachments,
        modelImageAttachments,
        runtimeEnvironment,
        capabilityCatalog,
        externalToolExposure
    });
    if (contextMessage) {
        history.recordItems([contextMessage]);
    }
    if (suppressCurrentUserMessage !== true) {
        const userMessage = responseMessage('user', message);
        if (userMessage) {
            history.recordItems([userMessage]);
        }
    }
    const developerMessage = responseMessage('developer', ephemeralDeveloperMessage);
    if (developerMessage) {
        history.recordItems([developerMessage]);
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

function recordModelImageAttachmentsToContextManager(contextManager, modelImageAttachments = []) {
    if (!contextManager || typeof contextManager.recordItems !== 'function') {
        return 0;
    }
    const requested = (Array.isArray(modelImageAttachments) ? modelImageAttachments : [])
        .map((attachment) => ({
            image_url: normalizeText(
                attachment?.image_url ||
                attachment?.imageUrl ||
                attachment?.url ||
                attachment?.path
            ),
            detail: normalizeText(attachment?.detail) || 'original'
        }))
        .filter((attachment) => attachment.image_url);
    if (!requested.length) {
        return 0;
    }
    const existing = new Set(
        (contextManager.rawItems?.() || [])
            .flatMap((item) => Array.isArray(item?.content) ? item.content : [])
            .filter((part) => part?.type === 'input_image')
            .map((part) => normalizeText(part.image_url))
            .filter(Boolean)
    );
    const fresh = requested.filter((attachment) => !existing.has(attachment.image_url));
    if (!fresh.length) {
        return 0;
    }
    contextManager.recordItems([ResponseItem.message({
        role: 'user',
        content: fresh.map((attachment) => ({
            type: 'input_image',
            image_url: attachment.image_url,
            detail: attachment.detail
        }))
    })]);
    return fresh.length;
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
            const contentParts = (Array.isArray(item.content) ? item.content : [])
                .map((part) => {
                    if (part?.type === 'input_image') {
                        const imageUrl = normalizeText(part.image_url || part.url);
                        return imageUrl ? {
                            type: 'image_url',
                            image_url: { url: imageUrl },
                            detail: normalizeText(part.detail) || 'original'
                        } : null;
                    }
                    const text = normalizeText(part?.text || part?.content);
                    return text ? { type: 'text', text } : null;
                })
                .filter(Boolean);
            const hasImage = contentParts.some((part) => part.type === 'image_url');
            const content = Array.isArray(item.content)
                ? hasImage
                    ? contentParts
                    : contentParts.map((part) => part.text).filter(Boolean).join('\n')
                : normalizeText(item.content);
            if (content) {
                const role = ['system', 'developer', 'user', 'assistant'].includes(item.role)
                    ? item.role
                    : 'user';
                messages.push({ role, content });
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
            const outputImages = responseItemOutputImages(item);
            if (outputImages.length) {
                messages.push({
                    role: 'user',
                    content: [
                        {
                            type: 'text',
                            text: 'Visual artifact returned by the immediately preceding tool call. Inspect this image as tool evidence for the current request; it is not a new user request.'
                        },
                        ...outputImages
                    ]
                });
            }
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
    buildMemoryDeveloperMessage,
    buildModelInput,
    buildModelInputContextManager,
    functionCall,
    functionCallOutput,
    recordModelImageAttachmentsToContextManager,
    recordToolOutputToContextManager,
    restoreModelInputContextManagerFromCheckpoint,
    responseItemOutputImages,
    responseItemsToChatMessages,
    responseMessage,
    toolOutputToModelInputItems,
    toolSearchCall,
    toolSearchOutput
};
