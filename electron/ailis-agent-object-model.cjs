'use strict';

const { summarizeForModel } = require('./ailis-runtime-budget.cjs');
const {
    FunctionCallOutputPayload,
    ResponseItem,
    normalizeText,
    safeJsonStringify
} = require('./ailis-response-model.cjs');
const {
    RUNTIME_LAYER,
    normalizeRuntimeEvent
} = require('./ailis-agent-runtime-protocol.cjs');

const DEFAULT_TOOL_OUTPUT_CHARS = 24000;
const DEFAULT_THREAD_ITEM_PREVIEW_CHARS = 1200;

function cloneJson(value) {
    if (value == null || typeof value !== 'object') {
        return value;
    }
    return JSON.parse(JSON.stringify(value));
}

function extractText(value) {
    if (value == null) {
        return '';
    }
    if (typeof value === 'string') {
        return value;
    }
    if (typeof value.text === 'string') {
        return value.text;
    }
    if (typeof value.content === 'string') {
        return value.content;
    }
    if (Array.isArray(value.content)) {
        const text = value.content
            .map((part) => (typeof part?.text === 'string' ? part.text : ''))
            .filter(Boolean)
            .join('\n');
        if (text.trim()) {
            return text;
        }
    }
    if (typeof value.stdout === 'string') {
        return value.stdout;
    }
    if (typeof value.preview === 'string') {
        return value.preview;
    }
    return safeJsonStringify(value, '');
}

function canonicalCallId(input = {}, index = 0) {
    return normalizeText(
        input.callId ||
            input.call_id ||
            input.nativeToolCall?.call_id ||
            input.nativeToolCall?.id ||
            input.id ||
            `call_${index + 1}`
    ).replace(/[^A-Za-z0-9_-]/g, '_');
}

function normalizeProviderMetadata(input = {}) {
    const providerMetadata =
        input.providerMetadata ||
        input.provider_metadata ||
        input.nativeToolCall?.providerMetadata ||
        input.nativeToolCall?.provider_metadata ||
        null;
    return providerMetadata && typeof providerMetadata === 'object' && !Array.isArray(providerMetadata)
        ? cloneJson(providerMetadata)
        : null;
}

function normalizeToolOutput(input = {}, index = 0, options = {}) {
    const response = input.response || input.result || {};
    const result = response.result ?? input.output ?? response.output ?? null;
    const details = response.details || response.result?.details || response.result?.structuredContent || {};
    const ok = response.ok === true || input.ok === true;
    const errorSummary = normalizeText(
        response.error ||
            input.error ||
            details.errorSummary ||
            details.error ||
            ''
    );
    const rawText = extractText(result) || errorSummary || extractText(response);
    const startedAt = Number(input.startedAt ?? input.started_at ?? 0) || null;
    const finishedAt = Number(input.finishedAt ?? input.finished_at ?? 0) || null;
    const durationMs = Number(
        input.durationMs ??
            input.duration_ms ??
            response.durationMs ??
            response.duration_ms ??
            details.durationMs ??
            details.duration_ms
    );

    return {
        schema: 'ailis.tool_output.v1',
        callId: canonicalCallId(input, index),
        sourceId: input.id || null,
        toolName: normalizeText(input.tool || input.name || input.nativeToolCall?.name),
        title: normalizeText(input.title || input.tool || input.name || 'tool'),
        args: cloneJson(input.args || input.nativeToolCall?.arguments || {}),
        status: normalizeText(response.status || input.status || (ok ? 'completed' : 'failed')),
        ok,
        outputText: rawText,
        outputPreview: summarizeForModel(rawText, options.previewChars || DEFAULT_THREAD_ITEM_PREVIEW_CHARS),
        errorSummary,
        evidenceRefs: Array.isArray(input.evidenceRefs) ? input.evidenceRefs.slice() : [],
        evidenceArtifacts: Array.isArray(input.evidenceArtifacts) ? cloneJson(input.evidenceArtifacts) : [],
        providerMetadata: normalizeProviderMetadata(input),
        details: cloneJson(details || {}),
        startedAt,
        finishedAt,
        durationMs: Number.isFinite(durationMs) ? durationMs : null,
        original: options.keepOriginal === true ? cloneJson(input) : undefined
    };
}

function normalizeOutputStoreDetails(details = {}) {
    const outputStore = details && typeof details.outputStore === 'object' ? details.outputStore : {};
    const outputId = normalizeText(details.outputId || outputStore.outputId);
    if (!outputId) {
        return null;
    }
    const bytes = details.outputBytes ?? outputStore.bytes ?? outputStore.combinedBytes ?? null;
    const lineCount = details.outputLineCount ?? outputStore.lineCount ?? null;
    const previewTruncated = details.outputPreviewTruncated === true || outputStore.previewTruncated === true;
    return {
        outputId,
        bytes: Number.isFinite(Number(bytes)) ? Number(bytes) : null,
        lineCount: Number.isFinite(Number(lineCount)) ? Number(lineCount) : null,
        previewTruncated
    };
}

function buildModelVisibleToolMetadata(toolOutput = {}) {
    const outputStore = normalizeOutputStoreDetails(toolOutput.details || {});
    if (!outputStore) {
        return [];
    }
    const readArgs = { outputId: outputStore.outputId };
    const tailArgs = { outputId: outputStore.outputId };
    const searchArgs = { outputId: outputStore.outputId, query: '<text>' };
    return [
        [
            `OutputArtifact: outputId=${outputStore.outputId}`,
            outputStore.bytes != null ? `bytes=${outputStore.bytes}` : '',
            outputStore.lineCount != null ? `lines=${outputStore.lineCount}` : '',
            `previewTruncated=${outputStore.previewTruncated ? 'true' : 'false'}`
        ].filter(Boolean).join(' '),
        outputStore.previewTruncated
            ? `OutputArtifactTools: output_read ${safeJsonStringify(readArgs, '{}')} | output_tail ${safeJsonStringify(tailArgs, '{}')} | output_search ${safeJsonStringify(searchArgs, '{}')}`
            : '',
        outputStore.previewTruncated
            ? 'OutputArtifactHint: full stdout/stderr is stored by outputId; inspect only the needed slice instead of rerunning the same command to recover truncated text.'
            : ''
    ].filter(Boolean);
}

function toolOutputToResponseItems(toolOutput = {}, options = {}) {
    const toolName = normalizeText(toolOutput.toolName);
    if (!toolName) {
        return [];
    }
    const callId = canonicalCallId(toolOutput);
    if (toolName === 'tool_search') {
        const tools = Array.isArray(toolOutput.details?.tools) ? toolOutput.details.tools : [];
        return [
            ResponseItem.toolSearchCall({
                call_id: callId,
                status: 'completed',
                execution: 'client',
                provider_metadata: toolOutput.providerMetadata || null,
                arguments: toolOutput.args || {}
            }),
            ResponseItem.toolSearchOutput({
                call_id: callId,
                status: 'completed',
                execution: 'client',
                tools
            })
        ];
    }
    const metadataLines = buildModelVisibleToolMetadata(toolOutput);
    const output = [
        toolOutput.ok ? 'Status: completed' : `Status: ${toolOutput.status || 'failed'}`,
        toolOutput.errorSummary ? `Error: ${toolOutput.errorSummary}` : '',
        toolOutput.durationMs != null ? `DurationMs: ${toolOutput.durationMs}` : '',
        ...metadataLines,
        'Output:',
        summarizeForModel(toolOutput.outputText || '', options.toolOutputChars || DEFAULT_TOOL_OUTPUT_CHARS)
    ].filter(Boolean).join('\n');
    return [
        ResponseItem.functionCall({
            name: toolName,
            arguments: toolOutput.args || {},
            provider_metadata: toolOutput.providerMetadata || null,
            call_id: callId
        }),
        ResponseItem.functionCallOutput({
            call_id: callId,
            output: FunctionCallOutputPayload.normalize(output, {
                success: toolOutput.ok === true ? true : toolOutput.ok === false ? false : null
            })
        })
    ];
}

function toolOutputToRuntimeEvent(toolOutput = {}) {
    return normalizeRuntimeEvent({
        type: 'tool_result',
        id: toolOutput.sourceId || toolOutput.callId,
        callId: toolOutput.callId,
        title: toolOutput.title,
        tool: toolOutput.toolName,
        args: cloneJson(toolOutput.args || {}),
        status: toolOutput.status || 'unknown',
        ok: toolOutput.ok === true,
        preview: toolOutput.outputPreview || '',
        errorSummary: toolOutput.errorSummary || '',
        evidenceRefs: Array.isArray(toolOutput.evidenceRefs) ? toolOutput.evidenceRefs.slice() : [],
        evidenceArtifacts: Array.isArray(toolOutput.evidenceArtifacts) ? cloneJson(toolOutput.evidenceArtifacts) : [],
        durationMs: toolOutput.durationMs
    }, {
        layer: RUNTIME_LAYER.TOOL_EXECUTOR,
        status: toolOutput.status || 'unknown'
    });
}

function toolOutputToThreadItem(toolOutput = {}) {
    return {
        schema: 'ailis.thread_item.v1',
        type: 'tool_result',
        status: toolOutput.ok ? 'completed' : 'failed',
        id: toolOutput.sourceId || toolOutput.callId,
        callId: toolOutput.callId,
        title: toolOutput.title || toolOutput.toolName || 'tool result',
        tool: toolOutput.toolName || null,
        ok: toolOutput.ok === true,
        result_status: toolOutput.status || 'unknown',
        preview: toolOutput.outputPreview || '',
        error_summary: toolOutput.errorSummary || null,
        evidence_refs: Array.isArray(toolOutput.evidenceRefs) ? toolOutput.evidenceRefs.slice() : [],
        duration_ms: toolOutput.durationMs
    };
}

function makeRolloutItem(kind, payload = {}) {
    return {
        schema: 'ailis.rollout_item.v1',
        type: kind,
        payload: cloneJson(payload),
        recordedAt: new Date().toISOString()
    };
}

module.exports = {
    DEFAULT_THREAD_ITEM_PREVIEW_CHARS,
    DEFAULT_TOOL_OUTPUT_CHARS,
    extractText,
    makeRolloutItem,
    normalizeToolOutput,
    toolOutputToResponseItems,
    toolOutputToRuntimeEvent,
    toolOutputToThreadItem
};
