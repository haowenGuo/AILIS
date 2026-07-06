'use strict';

const { randomUUID } = require('crypto');

const {
    ResponseItem,
    cloneJson
} = require('./ailis-response-model.cjs');

const BaseInstructions = Object.freeze({
    create(text = '') {
        return {
            text: String(text || '')
        };
    }
});

const Prompt = Object.freeze({
    create({
        input = [],
        tools = [],
        parallel_tool_calls: parallelToolCalls = false,
        base_instructions: baseInstructions = null,
        instructions = '',
        personality = null,
        output_schema: outputSchema = null,
        output_schema_strict: outputSchemaStrict = true
    } = {}) {
        const normalizedBaseInstructions = baseInstructions && typeof baseInstructions === 'object'
            ? { text: String(baseInstructions.text || '') }
            : BaseInstructions.create(instructions);
        return {
            input: Array.isArray(input) ? input.filter(Boolean).map(cloneJson) : [],
            tools: Array.isArray(tools) ? tools.filter(Boolean).map(cloneJson) : [],
            parallel_tool_calls: parallelToolCalls === true,
            base_instructions: normalizedBaseInstructions,
            ...(personality ? { personality: cloneJson(personality) } : {}),
            ...(outputSchema ? { output_schema: cloneJson(outputSchema) } : {}),
            output_schema_strict: outputSchemaStrict !== false
        };
    },

    getFormattedInput(prompt = {}) {
        return Array.isArray(prompt.input) ? prompt.input.map(cloneJson) : [];
    },

    toRequestPayload(prompt = {}, {
        tool_choice: toolChoice = 'auto',
        includePromptObject = false
    } = {}) {
        const normalized = this.create(prompt);
        const payload = {
            instructions: String(normalized.base_instructions.text || ''),
            input: this.getFormattedInput(normalized),
            tools: normalized.tools,
            tool_choice: toolChoice,
            parallel_tool_calls: normalized.parallel_tool_calls
        };
        if (normalized.output_schema) {
            payload.output_schema = cloneJson(normalized.output_schema);
            payload.output_schema_strict = normalized.output_schema_strict;
        }
        if (normalized.personality) {
            payload.personality = cloneJson(normalized.personality);
        }
        if (includePromptObject) {
            payload.prompt = normalized;
        }
        return payload;
    }
});

const CompactedItem = Object.freeze({
    create({ message = '', replacement_history: replacementHistory = null } = {}) {
        return {
            message: String(message || ''),
            ...(Array.isArray(replacementHistory)
                ? { replacement_history: replacementHistory.filter(Boolean).map(cloneJson) }
                : {})
        };
    },

    toResponseItem(compactedItem = {}) {
        const message = String(compactedItem.message || '');
        return ResponseItem.message({
            role: 'assistant',
            content: [{ type: 'output_text', text: message }]
        });
    }
});

const RolloutItem = Object.freeze({
    compacted(compactedItem = {}) {
        return {
            type: 'compacted',
            payload: CompactedItem.create(compactedItem)
        };
    },

    turnContext(turnContextItem = null) {
        return {
            type: 'turn_context',
            payload: turnContextItem ? cloneJson(turnContextItem) : null
        };
    },

    responseItem(responseItem = null) {
        return {
            type: 'response_item',
            payload: responseItem ? cloneJson(responseItem) : null
        };
    }
});

const TurnContextItem = Object.freeze({
    create(value = {}) {
        return value && typeof value === 'object' && !Array.isArray(value)
            ? cloneJson(value)
            : {};
    }
});

const ContextCompactionItem = Object.freeze({
    create({ id = null } = {}) {
        return {
            id: id ? String(id) : randomUUID()
        };
    }
});

module.exports = {
    BaseInstructions,
    CompactedItem,
    ContextCompactionItem,
    Prompt,
    RolloutItem,
    TurnContextItem
};
