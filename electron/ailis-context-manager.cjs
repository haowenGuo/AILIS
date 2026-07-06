'use strict';

const {
    ContentItem,
    FunctionCallOutputPayload,
    ResponseItem,
    callIdOf,
    cloneJson,
    isCallItem,
    isOutputItem,
    responseItemOutputToText
} = require('./ailis-response-model.cjs');
const { summarizeForModel } = require('./ailis-runtime-budget.cjs');

const DEFAULT_TOOL_OUTPUT_CHARS = 24000;
const DEFAULT_RECENT_TOOL_OUTPUTS = 4;
const DEFAULT_PINNED_COMPLETE_OUTPUTS = 2;
const DEFAULT_STALE_TOOL_OUTPUT_CHARS = 900;
const DEFAULT_COMPACTION_TRIGGER_OUTPUTS = 6;
const DEFAULT_COMPACTION_TRIGGER_CHARS = 32000;
const IMAGE_CONTENT_OMITTED_PLACEHOLDER = 'image content omitted because you do not support image input';

function normalizeInputModalities(inputModalities = []) {
    return new Set((Array.isArray(inputModalities) ? inputModalities : [])
        .map((entry) => String(entry || '').toLowerCase()));
}

function supportsImages(inputModalities = []) {
    const modalities = normalizeInputModalities(inputModalities);
    return modalities.has('image') || modalities.has('vision') || modalities.has('input_image');
}

function truncateFunctionOutputPayload(payload = '', maxChars = DEFAULT_TOOL_OUTPUT_CHARS) {
    const normalized = FunctionCallOutputPayload.normalize(payload);
    if (normalized.body?.kind === 'content_items') {
        const items = normalized.body.value.map((item) => {
            if (item?.type !== 'input_text') {
                return cloneJson(item);
            }
            return {
                ...item,
                text: summarizeForModel(item.text || '', maxChars)
            };
        });
        return FunctionCallOutputPayload.fromContentItems(items, {
            success: normalized.success
        });
    }
    return FunctionCallOutputPayload.fromText(
        summarizeForModel(FunctionCallOutputPayload.toText(normalized), maxChars),
        { success: normalized.success }
    );
}

function stripImagesFromContentItems(content = []) {
    return (Array.isArray(content) ? content : [])
        .filter((item) => item?.type !== 'input_image')
        .map(cloneJson);
}

function stripImagesFromFunctionOutput(payload = '') {
    const normalized = FunctionCallOutputPayload.normalize(payload);
    if (normalized.body?.kind !== 'content_items') {
        return normalized;
    }
    const items = normalized.body.value.map((item) =>
        item?.type === 'input_image'
            ? ContentItem.inputText(IMAGE_CONTENT_OMITTED_PLACEHOLDER)
            : cloneJson(item)
    ).filter(Boolean);
    return FunctionCallOutputPayload.fromContentItems(items, {
        success: normalized.success
    });
}

function isToolOutputItem(item = {}) {
    return item?.type === 'function_call_output' || item?.type === 'custom_tool_call_output';
}

function isPinnedCompleteObservationText(text = '') {
    return /reasoning[_-]?ready\s*[:=]\s*true/i.test(text) ||
        /\bcomplete\s*[:=]\s*true\b/i.test(text) && /\btruncated\s*[:=]\s*false\b/i.test(text) ||
        /\boutputComplete\s*=\s*true\b/i.test(text) && /\boutputTruncatedForModel\s*=\s*false\b/i.test(text);
}

function extractObservationHeaderLines(text = '') {
    return String(text || '')
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => /^(Status|Error|DurationMs|OutputArtifact|OutputArtifactTools|OutputArtifactHint|exitCode|outputId|bytes|outputComplete|outputTruncatedForModel|modelHint)\b/i.test(line) ||
            /\b(reasoning[_-]?ready|complete|truncated)\s*[:=]/i.test(line))
        .slice(0, 18);
}

function compactToolOutputPayload(payload = '', maxChars = DEFAULT_STALE_TOOL_OUTPUT_CHARS) {
    const normalized = FunctionCallOutputPayload.normalize(payload);
    const text = FunctionCallOutputPayload.toText(normalized);
    if (!text || text.includes('OLDER_TOOL_OBSERVATION_COMPACTED') || text.length <= maxChars) {
        return normalized;
    }
    const headerLines = extractObservationHeaderLines(text);
    const compactedText = [
        'OLDER_TOOL_OBSERVATION_COMPACTED:',
        `originalTextChars=${text.length}`,
        'Reason: older exploratory tool output was compacted to keep the active task context focused.',
        'Use newer complete observations first; if this output exposes outputId, use output_read/output_tail/output_search for a focused slice.',
        headerLines.length ? '--- retained status lines ---' : '',
        ...headerLines,
        '--- compact preview ---',
        summarizeForModel(text, maxChars)
    ].filter(Boolean).join('\n');
    return FunctionCallOutputPayload.fromText(compactedText, {
        success: FunctionCallOutputPayload.success(normalized)
    });
}

function defaultOutputForCall(call = {}) {
    const callId = callIdOf(call);
    if (!callId) {
        return null;
    }
    if (call.type === 'tool_search_call') {
        return ResponseItem.toolSearchOutput({
            call_id: callId,
            status: 'completed',
            execution: call.execution || 'client',
            tools: []
        });
    }
    if (call.type === 'local_shell_call') {
        return ResponseItem.functionCallOutput({
            call_id: callId,
            output: 'aborted',
            success: false
        });
    }
    if (call.type === 'custom_tool_call') {
        return ResponseItem.customToolCallOutput({
            call_id: callId,
            name: call.name,
            output: 'Status: aborted\nOutput:\nTool call did not produce an output.'
        });
    }
    return ResponseItem.functionCallOutput({
        call_id: callId,
        output: 'Status: aborted\nOutput:\nTool call did not produce an output.',
        success: false
    });
}

class ContextManager {
    constructor({
        items = [],
        history_version: historyVersion = 0,
        token_info: tokenInfo = null,
        reference_context_item: referenceContextItem = null,
        toolOutputChars = DEFAULT_TOOL_OUTPUT_CHARS
    } = {}) {
        this.items = [];
        this.history_version = Number(historyVersion || 0);
        this.token_info = tokenInfo;
        this.reference_context_item = referenceContextItem;
        this.toolOutputChars = Number(toolOutputChars || DEFAULT_TOOL_OUTPUT_CHARS);
        this.recordItems(items);
    }

    setReferenceContextItem(item = null) {
        this.reference_context_item = item ? cloneJson(item) : null;
    }

    referenceContextItem() {
        return this.reference_context_item ? cloneJson(this.reference_context_item) : null;
    }

    setTokenInfo(info = null) {
        this.token_info = info ? cloneJson(info) : null;
    }

    tokenInfo() {
        return this.token_info ? cloneJson(this.token_info) : null;
    }

    historyVersion() {
        return this.history_version;
    }

    rawItems() {
        return this.items.map(cloneJson);
    }

    replace(items = [], referenceContextItem = this.reference_context_item) {
        this.items = [];
        this.recordItems(items);
        this.setReferenceContextItem(referenceContextItem);
        this.history_version += 1;
    }

    replaceCompactedHistory(compactedItem = {}, referenceContextItem = this.reference_context_item) {
        const replacementHistory = Array.isArray(compactedItem.replacement_history)
            ? compactedItem.replacement_history
            : [];
        const fallbackMessage = String(compactedItem.message || '').trim()
            ? ResponseItem.message({
                  role: 'assistant',
                  content: [{ type: 'output_text', text: String(compactedItem.message || '') }]
              })
            : null;
        const nextHistory = replacementHistory.length
            ? replacementHistory
            : [fallbackMessage].filter(Boolean);
        this.replace(nextHistory, referenceContextItem);
        return this.toCheckpoint();
    }

    recordItems(items = [], policy = {}) {
        const maxChars = Number(policy.toolOutputChars || this.toolOutputChars || DEFAULT_TOOL_OUTPUT_CHARS);
        for (const item of Array.isArray(items) ? items : []) {
            if (!item || typeof item !== 'object') {
                continue;
            }
            this.items.push(this.processItem(item, { toolOutputChars: maxChars }));
        }
    }

    processItem(item = {}, policy = {}) {
        const maxChars = Number(policy.toolOutputChars || this.toolOutputChars || DEFAULT_TOOL_OUTPUT_CHARS);
        if (item.type === 'function_call_output') {
            return {
                ...cloneJson(item),
                output: truncateFunctionOutputPayload(item.output, maxChars)
            };
        }
        if (item.type === 'custom_tool_call_output') {
            return {
                ...cloneJson(item),
                output: truncateFunctionOutputPayload(item.output, maxChars)
            };
        }
        return cloneJson(item);
    }

    clone() {
        return new ContextManager({
            items: this.rawItems(),
            history_version: this.history_version,
            token_info: this.token_info,
            reference_context_item: this.reference_context_item,
            toolOutputChars: this.toolOutputChars
        });
    }

    forPrompt({ inputModalities = [] } = {}) {
        const clone = this.clone();
        clone.normalizeHistory(inputModalities);
        return clone.rawItems();
    }

    normalizeHistory(inputModalities = []) {
        this.ensureCallOutputsPresent();
        this.removeOrphanOutputs();
        this.compactStaleToolOutputs();
        if (!supportsImages(inputModalities)) {
            this.stripImagesWhenUnsupported();
        }
    }

    compactStaleToolOutputs() {
        const outputIndices = this.items
            .map((item, index) => (isToolOutputItem(item) ? index : -1))
            .filter((index) => index >= 0);
        if (outputIndices.length <= DEFAULT_COMPACTION_TRIGGER_OUTPUTS &&
            this.totalModelVisibleChars() <= DEFAULT_COMPACTION_TRIGGER_CHARS) {
            return;
        }
        const recent = new Set(outputIndices.slice(-DEFAULT_RECENT_TOOL_OUTPUTS));
        const pinned = new Set();
        for (const index of outputIndices.slice().reverse()) {
            if (pinned.size >= DEFAULT_PINNED_COMPLETE_OUTPUTS) {
                break;
            }
            if (recent.has(index)) {
                continue;
            }
            const text = FunctionCallOutputPayload.toText(this.items[index]?.output || '');
            if (isPinnedCompleteObservationText(text)) {
                pinned.add(index);
            }
        }
        this.items = this.items.map((item, index) => {
            if (!isToolOutputItem(item) || recent.has(index) || pinned.has(index)) {
                return cloneJson(item);
            }
            return {
                ...cloneJson(item),
                output: compactToolOutputPayload(item.output, DEFAULT_STALE_TOOL_OUTPUT_CHARS)
            };
        });
    }

    ensureCallOutputsPresent() {
        const outputIds = new Set(this.items.filter(isOutputItem).map(callIdOf).filter(Boolean));
        const insertions = [];
        for (const [index, item] of this.items.entries()) {
            if (!isCallItem(item)) {
                continue;
            }
            const callId = callIdOf(item);
            if (!callId || outputIds.has(callId)) {
                continue;
            }
            const output = defaultOutputForCall(item);
            if (output) {
                insertions.push({ index, output });
                outputIds.add(callId);
            }
        }
        for (const insertion of insertions.reverse()) {
            this.items.splice(insertion.index + 1, 0, insertion.output);
        }
    }

    removeOrphanOutputs() {
        const functionCallIds = new Set(
            this.items
                .filter((item) => item?.type === 'function_call' || item?.type === 'local_shell_call')
                .map(callIdOf)
                .filter(Boolean)
        );
        const customCallIds = new Set(
            this.items
                .filter((item) => item?.type === 'custom_tool_call')
                .map(callIdOf)
                .filter(Boolean)
        );
        const toolSearchCallIds = new Set(
            this.items
                .filter((item) => item?.type === 'tool_search_call')
                .map(callIdOf)
                .filter(Boolean)
        );
        this.items = this.items.filter((item) => {
            if (!isOutputItem(item)) {
                return true;
            }
            if (item.type === 'tool_search_output' && (item.execution === 'server' || !callIdOf(item))) {
                return true;
            }
            const callId = callIdOf(item);
            if (item.type === 'function_call_output') {
                return Boolean(callId && functionCallIds.has(callId));
            }
            if (item.type === 'custom_tool_call_output') {
                return Boolean(callId && customCallIds.has(callId));
            }
            if (item.type === 'tool_search_output') {
                return Boolean(callId && toolSearchCallIds.has(callId));
            }
            return true;
        });
    }

    stripImagesWhenUnsupported() {
        this.items = this.items.map((item) => {
            if (item?.type === 'message') {
                const content = (Array.isArray(item.content) ? item.content : [])
                    .map((part) => part?.type === 'input_image'
                        ? ContentItem.inputText(IMAGE_CONTENT_OMITTED_PLACEHOLDER)
                        : cloneJson(part))
                    .filter(Boolean);
                return {
                    ...cloneJson(item),
                    content: content.length ? content : [ContentItem.inputText(IMAGE_CONTENT_OMITTED_PLACEHOLDER)].filter(Boolean)
                };
            }
            if (item?.type === 'function_call_output' || item?.type === 'custom_tool_call_output') {
                return {
                    ...cloneJson(item),
                    output: stripImagesFromFunctionOutput(item.output)
                };
            }
            if (item?.type === 'image_generation_call') {
                return {
                    ...cloneJson(item),
                    result: ''
                };
            }
            return cloneJson(item);
        });
    }

    totalModelVisibleChars() {
        return this.items.reduce((sum, item) => {
            if (item?.type === 'function_call_output' || item?.type === 'custom_tool_call_output' || item?.type === 'tool_search_output') {
                return sum + responseItemOutputToText(item).length;
            }
            return sum + JSON.stringify(item || {}).length;
        }, 0);
    }

    toCheckpoint() {
        return {
            history_version: this.history_version,
            token_info: this.token_info ? cloneJson(this.token_info) : null,
            reference_context_item: this.reference_context_item ? cloneJson(this.reference_context_item) : null,
            items: this.rawItems()
        };
    }

    static fromCheckpoint(checkpoint = null, options = {}) {
        if (!checkpoint || typeof checkpoint !== 'object' || Array.isArray(checkpoint)) {
            return null;
        }
        const items = Array.isArray(checkpoint.items) ? checkpoint.items : [];
        return new ContextManager({
            items,
            history_version: checkpoint.history_version,
            token_info: checkpoint.token_info,
            reference_context_item: checkpoint.reference_context_item,
            toolOutputChars: options.toolOutputChars || checkpoint.tool_output_chars || checkpoint.toolOutputChars || DEFAULT_TOOL_OUTPUT_CHARS
        });
    }
}

module.exports = {
    ContextManager,
    DEFAULT_TOOL_OUTPUT_CHARS,
    truncateFunctionOutputPayload
};
