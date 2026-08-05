'use strict';

const MESSAGE_PHASE = Object.freeze({
    COMMENTARY: 'commentary',
    FINAL_ANSWER: 'final_answer'
});

const MESSAGE_ROLES = new Set(['user', 'assistant', 'system', 'developer']);

function normalizeText(value = '') {
    return String(value || '').trim();
}

function safeJsonStringify(value, fallback = '') {
    try {
        return JSON.stringify(value);
    } catch {
        return fallback;
    }
}

function cloneJson(value) {
    if (value == null) {
        return value;
    }
    try {
        return JSON.parse(JSON.stringify(value));
    } catch {
        return value;
    }
}

function normalizeProviderMetadata(providerMetadata = null) {
    return providerMetadata && typeof providerMetadata === 'object' && !Array.isArray(providerMetadata)
        ? cloneJson(providerMetadata)
        : null;
}

const ContentItem = Object.freeze({
    inputText(text = '') {
        const normalized = normalizeText(text);
        return normalized ? { type: 'input_text', text: normalized } : null;
    },

    outputText(text = '') {
        const normalized = normalizeText(text);
        return normalized ? { type: 'output_text', text: normalized } : null;
    },

    inputImage({ image_url: imageUrl = '', detail = null } = {}) {
        const normalizedImageUrl = normalizeText(imageUrl);
        if (!normalizedImageUrl) {
            return null;
        }
        return {
            type: 'input_image',
            image_url: normalizedImageUrl,
            ...(detail ? { detail } : {})
        };
    }
});

const FunctionCallOutputBody = Object.freeze({
    text(content = '') {
        return {
            kind: 'text',
            value: String(content || '')
        };
    },

    contentItems(items = []) {
        return {
            kind: 'content_items',
            value: Array.isArray(items) ? items.filter(Boolean).map(cloneJson) : []
        };
    },

    normalize(body = '') {
        if (body && typeof body === 'object' && !Array.isArray(body) && ['text', 'content_items'].includes(body.kind)) {
            return body.kind === 'content_items'
                ? this.contentItems(body.value)
                : this.text(body.value);
        }
        if (Array.isArray(body)) {
            return this.contentItems(body);
        }
        return this.text(body == null ? '' : String(body));
    },

    toWireValue(body = '') {
        const normalized = this.normalize(body);
        return normalized.kind === 'content_items'
            ? normalized.value.map(cloneJson)
            : String(normalized.value || '');
    },

    toText(body = '') {
        const normalized = this.normalize(body);
        if (normalized.kind === 'text') {
            return String(normalized.value || '');
        }
        return normalized.value
            .map((item) => item?.type === 'input_text' ? item.text : '')
            .filter((text) => normalizeText(text))
            .join('\n');
    }
});

const FunctionCallOutputPayload = Object.freeze({
    fromText(content = '', { success = null } = {}) {
        return {
            body: FunctionCallOutputBody.text(content),
            ...(typeof success === 'boolean' ? { success } : {})
        };
    },

    fromContentItems(contentItems = [], { success = null } = {}) {
        return {
            body: FunctionCallOutputBody.contentItems(contentItems),
            ...(typeof success === 'boolean' ? { success } : {})
        };
    },

    normalize(output = '', options = {}) {
        if (output && typeof output === 'object' && !Array.isArray(output) && output.body) {
            return {
                body: FunctionCallOutputBody.normalize(output.body),
                ...(typeof output.success === 'boolean' ? { success: output.success } : {}),
                ...(typeof options.success === 'boolean' ? { success: options.success } : {})
            };
        }
        const success = typeof options.success === 'boolean' ? options.success : null;
        return Array.isArray(output)
            ? this.fromContentItems(output, { success })
            : this.fromText(output, { success });
    },

    toWireValue(output = '') {
        return FunctionCallOutputBody.toWireValue(this.normalize(output).body);
    },

    toText(output = '') {
        return FunctionCallOutputBody.toText(this.normalize(output).body);
    },

    success(output = '') {
        const normalized = this.normalize(output);
        return typeof normalized.success === 'boolean' ? normalized.success : null;
    }
});

function contentFromText(role = 'user', text = '') {
    const item = role === 'assistant'
        ? ContentItem.outputText(text)
        : ContentItem.inputText(text);
    return item ? [item] : [];
}

const ResponseItem = Object.freeze({
    message({ role = 'user', content = [], text = '', phase = null, id = null } = {}) {
        const rawRole = normalizeText(role).toLowerCase();
        const normalizedRole = MESSAGE_ROLES.has(rawRole) ? rawRole : 'user';
        const normalizedContent = Array.isArray(content) && content.length
            ? content.filter(Boolean).map(cloneJson)
            : contentFromText(normalizedRole, text);
        if (!normalizedContent.length) {
            return null;
        }
        return {
            type: 'message',
            ...(id ? { id } : {}),
            role: normalizedRole,
            content: normalizedContent,
            ...(phase ? { phase } : {})
        };
    },

    reasoning({ id = '', summary = [], content = null, encrypted_content: encryptedContent = null } = {}) {
        return {
            type: 'reasoning',
            ...(id ? { id } : {}),
            summary: Array.isArray(summary) ? summary : [],
            ...(content ? { content } : {}),
            ...(encryptedContent ? { encrypted_content: encryptedContent } : {})
        };
    },

    localShellCall({ call_id: callId = null, status = '', action = null, id = null } = {}) {
        return {
            type: 'local_shell_call',
            ...(id ? { id } : {}),
            ...(callId ? { call_id: callId } : {}),
            status,
            action: action || {}
        };
    },

    functionCall({
        name = '',
        arguments: rawArguments = {},
        call_id: callId = '',
        namespace = null,
        id = null,
        provider_metadata: providerMetadata = null
    } = {}) {
        const normalizedName = normalizeText(name);
        const normalizedCallId = normalizeText(callId);
        if (!normalizedName || !normalizedCallId) {
            return null;
        }
        const normalizedProviderMetadata = normalizeProviderMetadata(providerMetadata);
        return {
            type: 'function_call',
            ...(id ? { id } : {}),
            name: normalizedName,
            ...(namespace ? { namespace } : {}),
            arguments: typeof rawArguments === 'string'
                ? rawArguments
                : safeJsonStringify(rawArguments, '{}'),
            call_id: normalizedCallId,
            ...(normalizedProviderMetadata ? { provider_metadata: normalizedProviderMetadata } : {})
        };
    },

    toolSearchCall({
        call_id: callId = '',
        status = 'completed',
        execution = 'client',
        arguments: rawArguments = {},
        id = null,
        provider_metadata: providerMetadata = null
    } = {}) {
        const normalizedCallId = normalizeText(callId);
        const normalizedExecution = normalizeText(execution) || 'client';
        if (!normalizedCallId && normalizedExecution !== 'server') {
            return null;
        }
        const normalizedProviderMetadata = normalizeProviderMetadata(providerMetadata);
        return {
            type: 'tool_search_call',
            ...(id ? { id } : {}),
            ...(normalizedCallId ? { call_id: normalizedCallId } : {}),
            status,
            execution: normalizedExecution,
            ...(normalizedProviderMetadata ? { provider_metadata: normalizedProviderMetadata } : {}),
            arguments: rawArguments && typeof rawArguments === 'object' ? cloneJson(rawArguments) : {}
        };
    },

    functionCallOutput({ call_id: callId = '', output = '', success = null } = {}) {
        const normalizedCallId = normalizeText(callId);
        if (!normalizedCallId) {
            return null;
        }
        return {
            type: 'function_call_output',
            call_id: normalizedCallId,
            output: FunctionCallOutputPayload.normalize(output, { success })
        };
    },

    customToolCall({ call_id: callId = '', name = '', input = '', status = null, id = null } = {}) {
        const normalizedCallId = normalizeText(callId);
        const normalizedName = normalizeText(name);
        if (!normalizedCallId || !normalizedName) {
            return null;
        }
        return {
            type: 'custom_tool_call',
            ...(id ? { id } : {}),
            ...(status ? { status } : {}),
            call_id: normalizedCallId,
            name: normalizedName,
            input: String(input || '')
        };
    },

    customToolCallOutput({ call_id: callId = '', name = null, output = '', success = null } = {}) {
        const normalizedCallId = normalizeText(callId);
        if (!normalizedCallId) {
            return null;
        }
        return {
            type: 'custom_tool_call_output',
            call_id: normalizedCallId,
            ...(name ? { name } : {}),
            output: FunctionCallOutputPayload.normalize(output, { success })
        };
    },

    toolSearchOutput({ call_id: callId = '', status = 'completed', execution = 'client', tools = [] } = {}) {
        const normalizedCallId = normalizeText(callId);
        const normalizedExecution = normalizeText(execution) || 'client';
        if (!normalizedCallId && normalizedExecution !== 'server') {
            return null;
        }
        return {
            type: 'tool_search_output',
            ...(normalizedCallId ? { call_id: normalizedCallId } : {}),
            status,
            execution: normalizedExecution,
            tools: Array.isArray(tools) ? tools.map(cloneJson) : []
        };
    },

    webSearchCall({ id = null, status = null, action = null } = {}) {
        return {
            type: 'web_search_call',
            ...(id ? { id } : {}),
            ...(status ? { status } : {}),
            ...(action ? { action } : {})
        };
    },

    imageGenerationCall({ id = '', status = '', revised_prompt: revisedPrompt = null, result = '' } = {}) {
        return {
            type: 'image_generation_call',
            id,
            status,
            ...(revisedPrompt ? { revised_prompt: revisedPrompt } : {}),
            result
        };
    },

    compaction({ encrypted_content: encryptedContent = '' } = {}) {
        return {
            type: 'compaction',
            encrypted_content: encryptedContent
        };
    },

    compactionTrigger() {
        return { type: 'compaction_trigger' };
    },

    contextCompaction({ encrypted_content: encryptedContent = null } = {}) {
        return {
            type: 'context_compaction',
            ...(encryptedContent ? { encrypted_content: encryptedContent } : {})
        };
    },

    other(value = {}) {
        return {
            type: 'other',
            ...(value && typeof value === 'object' && !Array.isArray(value) ? cloneJson(value) : {})
        };
    }
});

function isCallItem(item = {}) {
    return ['function_call', 'custom_tool_call', 'tool_search_call', 'local_shell_call'].includes(item?.type);
}

function isOutputItem(item = {}) {
    return ['function_call_output', 'custom_tool_call_output', 'tool_search_output'].includes(item?.type);
}

function callIdOf(item = {}) {
    return normalizeText(item.call_id || item.callId || item.id);
}

function responseItemOutputToText(item = {}) {
    if (item?.type === 'function_call_output' || item?.type === 'custom_tool_call_output') {
        return FunctionCallOutputPayload.toText(item.output);
    }
    if (item?.type === 'tool_search_output') {
        return safeJsonStringify({
            status: item.status,
            execution: item.execution,
            tools: item.tools || []
        }, '{}');
    }
    return '';
}

function responseItemToWireItem(item = {}) {
    const cloned = cloneJson(item);
    if (!cloned || typeof cloned !== 'object') {
        return cloned;
    }
    if (Object.prototype.hasOwnProperty.call(cloned, 'provider_metadata')) {
        delete cloned.provider_metadata;
    }
    if (cloned.type === 'function_call_output' || cloned.type === 'custom_tool_call_output') {
        const payload = FunctionCallOutputPayload.normalize(cloned.output);
        cloned.output = FunctionCallOutputPayload.toWireValue(payload);
        if (Object.prototype.hasOwnProperty.call(cloned, 'success')) {
            delete cloned.success;
        }
    }
    return cloned;
}

function responseItemsToWireItems(items = []) {
    return (Array.isArray(items) ? items : [])
        .map(responseItemToWireItem)
        .filter(Boolean);
}

module.exports = {
    ContentItem,
    FunctionCallOutputBody,
    FunctionCallOutputPayload,
    MESSAGE_PHASE,
    ResponseItem,
    callIdOf,
    cloneJson,
    isCallItem,
    isOutputItem,
    normalizeText,
    responseItemOutputToText,
    responseItemToWireItem,
    responseItemsToWireItems,
    safeJsonStringify
};
