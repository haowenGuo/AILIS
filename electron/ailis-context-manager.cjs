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
const {
    buildContextBudgetReport,
    summarizeForModel
} = require('./ailis-runtime-budget.cjs');

const DEFAULT_TOOL_OUTPUT_CHARS = 24000;
const DEFAULT_MAX_INPUT_IMAGES = 8;
const IMAGE_CONTENT_OMITTED_PLACEHOLDER = 'image content omitted because you do not support image input';

function resolveToolOutputChars(value, fallback = DEFAULT_TOOL_OUTPUT_CHARS) {
    if (value === null || value === undefined || value === '') {
        return fallback;
    }
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
}

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
    return item?.type === 'function_call_output' ||
        item?.type === 'custom_tool_call_output' ||
        item?.type === 'tool_search_output';
}

function messageText(item = {}) {
    if (item?.type !== 'message') {
        return '';
    }
    return (Array.isArray(item.content) ? item.content : [])
        .map((part) => String(part?.text || part?.content || ''))
        .filter(Boolean)
        .join('\n')
        .trim();
}

function isRuntimeContextMessage(item = {}) {
    const text = messageText(item);
    return (item?.role === 'developer' && /<memory_context>/i.test(text)) ||
        // Current context envelopes use developer; restored older ledgers use user.
        // Preserve the original envelope and role in either case during compaction.
        ((item?.role === 'developer' || item?.role === 'user') && /"type"\s*:\s*"context"/.test(text));
}

function isSessionCheckpointMessage(item = {}) {
    return /<ailis_(?:context|session)_checkpoint>/i.test(messageText(item));
}

function uniqueMessages(items = []) {
    const seen = new Set();
    return (Array.isArray(items) ? items : []).filter((item) => {
        const key = `${item?.role || ''}:${messageText(item)}`;
        if (!messageText(item) || seen.has(key)) {
            return false;
        }
        seen.add(key);
        return true;
    });
}

function collectRecentVisibleMessages(items = [], maxChars = 16000) {
    const messages = uniqueMessages((Array.isArray(items) ? items : []).filter((item) =>
        item?.type === 'message' &&
        (item?.role === 'user' || item?.role === 'assistant') &&
        !isRuntimeContextMessage(item)
    ));
    const selected = [];
    let usedChars = 0;
    for (let index = messages.length - 1; index >= 0; index -= 1) {
        const item = messages[index];
        const size = JSON.stringify(item || {}).length;
        if (selected.length && usedChars + size > maxChars) {
            break;
        }
        selected.push(cloneJson(item));
        usedChars += size;
    }
    return selected.reverse();
}

function normalizeManifestList(value = [], maxItems = 16) {
    return (Array.isArray(value) ? value : [])
        .slice(-maxItems)
        .map((entry) => normalizeContextPackageValue(entry, 1200))
        .filter(Boolean);
}

function collectRecentCallOutputPairs(items = [], pairLimit = 4) {
    const calls = new Map();
    for (const item of Array.isArray(items) ? items : []) {
        if (isCallItem(item) && callIdOf(item)) {
            calls.set(callIdOf(item), item);
        }
    }
    const pairs = [];
    for (let index = items.length - 1; index >= 0 && pairs.length < pairLimit; index -= 1) {
        const output = items[index];
        if (!isOutputItem(output) || !callIdOf(output)) {
            continue;
        }
        const call = calls.get(callIdOf(output));
        if (call) {
            pairs.push([cloneJson(call), cloneJson(output)]);
        }
    }
    return pairs.reverse().flat();
}

function extractOutputRefsFromText(text = '') {
    const refs = [];
    const seen = new Set();
    const patterns = [
        /\b(?:outputId|output_id|OutputArtifact|artifactId)\s*[:=]\s*([A-Za-z0-9._:-]+)/gi,
        /\boutputRef\.?outputId\s*[:=]\s*([A-Za-z0-9._:-]+)/gi
    ];
    for (const pattern of patterns) {
        for (const match of String(text || '').matchAll(pattern)) {
            const outputId = String(match?.[1] || '').trim();
            if (!outputId || seen.has(outputId)) {
                continue;
            }
            seen.add(outputId);
            refs.push({
                outputId,
                readTools: ['output_read', 'output_tail', 'output_search']
            });
        }
    }
    return refs;
}

function collectAvailableOutputRefs(items = []) {
    const refs = [];
    const seen = new Set();
    for (const item of Array.isArray(items) ? items : []) {
        if (!isToolOutputItem(item) && item?.type !== 'tool_search_output') {
            continue;
        }
        const text = responseItemOutputToText(item);
        for (const ref of extractOutputRefsFromText(text)) {
            if (seen.has(ref.outputId)) {
                continue;
            }
            seen.add(ref.outputId);
            refs.push({
                ...ref,
                callId: callIdOf(item) || null,
                sourceType: item.type
            });
        }
    }
    return refs;
}

function buildDroppedItemsManifest(items = []) {
    let compactedToolObservations = 0;
    let imageOmissions = 0;
    for (const item of Array.isArray(items) ? items : []) {
        const text = item?.type === 'message'
            ? JSON.stringify(item.content || [])
            : responseItemOutputToText(item);
        if (String(text || '').includes('OLDER_TOOL_OBSERVATION_COMPACTED')) {
            compactedToolObservations += 1;
        }
        if (String(text || '').includes(IMAGE_CONTENT_OMITTED_PLACEHOLDER)) {
            imageOmissions += 1;
        }
    }
    return {
        compactedToolObservations,
        imageOmissions
    };
}

function normalizeContextPackageValue(value, maxChars = 4000) {
    if (value == null || value === '') {
        return null;
    }
    if (typeof value === 'string') {
        return summarizeForModel(value, maxChars);
    }
    try {
        const text = JSON.stringify(value);
        if (text.length <= maxChars) {
            return cloneJson(value);
        }
    } catch {
        return String(value);
    }
    return summarizeForModel(value, maxChars);
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
        this.toolOutputChars = resolveToolOutputChars(toolOutputChars);
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
        // The provider token count belongs to the pre-compaction request. Keeping
        // it would immediately classify the compacted ledger as over budget again.
        this.setTokenInfo(null);
        return this.toCheckpoint();
    }

    recordItems(items = [], policy = {}) {
        const maxChars = resolveToolOutputChars(policy.toolOutputChars, this.toolOutputChars);
        for (const item of Array.isArray(items) ? items : []) {
            if (!item || typeof item !== 'object') {
                continue;
            }
            this.items.push(this.processItem(item, { toolOutputChars: maxChars }));
        }
    }

    processItem(item = {}, policy = {}) {
        const maxChars = resolveToolOutputChars(policy.toolOutputChars, this.toolOutputChars);
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

    forPrompt(options = {}) {
        const { inputModalities = [] } = options || {};
        const clone = this.clone();
        clone.normalizeHistory(inputModalities);
        clone.compactForBudget(options);
        clone.limitInputImages(options.maxInputImages);
        return clone.rawItems();
    }

    forPromptPackage(options = {}) {
        const { inputModalities = [] } = options || {};
        const clone = this.clone();
        clone.normalizeHistory(inputModalities);
        clone.compactForBudget(options);
        clone.limitInputImages(options.maxInputImages);
        return clone.buildContextPackage(options);
    }

    contextBudgetReport(options = {}) {
        return buildContextBudgetReport({
            staticPrefix: options.staticPrefix || '',
            instructions: options.instructions || '',
            goal: options.goal || '',
            runtimeEnvironment: options.runtimeEnvironment || null,
            taskState: options.taskState || null,
            referenceContextItem: this.reference_context_item,
            tokenInfo: this.token_info,
            recentResponseItems: this.items,
            toolSummary: options.toolSummary || null,
            toolSchemas: options.toolSchemas || options.tools || null,
            availableOutputRefs: collectAvailableOutputRefs(this.items)
        }, options.budgetConfig || options.contextBudget || {});
    }

    compactForBudget(options = {}) {
        const report = this.contextBudgetReport(options);
        this.last_context_budget_report = report;
        return report;
    }

    buildContextPackage(options = {}) {
        const items = this.rawItems();
        const budgetReport = this.last_context_budget_report || this.contextBudgetReport(options);
        return {
            schema: 'ailis.context_package.v1',
            historyVersion: this.history_version,
            goal: normalizeContextPackageValue(options.goal || '', 2000),
            runtimeEnvironment: normalizeContextPackageValue(options.runtimeEnvironment || null, 3000),
            taskState: normalizeContextPackageValue(options.taskState || null, 3000),
            referenceContextItem: this.reference_context_item ? cloneJson(this.reference_context_item) : null,
            recentResponseItems: items,
            toolSummary: normalizeContextPackageValue(options.toolSummary || null, 4000),
            availableOutputRefs: collectAvailableOutputRefs(items),
            droppedItemsManifest: buildDroppedItemsManifest(items),
            budgetReport
        };
    }

    buildSemanticCompactedItem(options = {}) {
        const packageBefore = this.buildContextPackage(options);
        const contextMode = String(options.contextMode || 'task_agent').trim().toLowerCase();
        const personaMode = contextMode === 'persona';
        const persistentTaskAgentSession = contextMode === 'task_agent_session';
        const contextMessages = this.items
            .filter((item) => persistentTaskAgentSession
                ? isRuntimeContextMessage(item) && !isSessionCheckpointMessage(item)
                : isRuntimeContextMessage(item))
            .slice(-4);
        const userMessages = uniqueMessages(this.items.filter((item) =>
            item?.type === 'message' && item?.role === 'user' &&
            !isRuntimeContextMessage(item) &&
            (!persistentTaskAgentSession || !isSessionCheckpointMessage(item))
        ));
        const currentRequestText = String(
            options.taskState?.current_request || messageText(userMessages.at(-1)) || ''
        ).trim();
        const activeGoal = options.taskState?.active_goal && typeof options.taskState.active_goal === 'object'
            ? cloneJson(options.taskState.active_goal)
            : String(options.goal || '').trim()
                ? { objective: String(options.goal).trim(), status: 'active' }
                : null;
        const originalTaskText = personaMode || !persistentTaskAgentSession
            ? String(options.goal || messageText(userMessages[0]) || '').trim()
            : '';
        const originalTask = originalTaskText
            ? ResponseItem.message({
                  role: 'user',
                  content: [{ type: 'input_text', text: originalTaskText }]
              })
            : null;
        const recentUserMessages = userMessages
            .filter((item) => messageText(item) !== originalTaskText)
            .slice(-2)
            .map(cloneJson);
        const checkpoint = personaMode
            ? {
                  schema: 'ailis.semantic_context_checkpoint.v1',
                  contextMode,
                  reason: String(options.compactionReason || packageBefore.budgetReport.level || 'context_budget'),
                  originalGoalPreservedVerbatim: Boolean(originalTaskText),
                  originalGoal: originalTaskText,
                  constraints: normalizeManifestList(options.constraints || options.taskState?.constraints || [], 24),
                  currentPlan: normalizeContextPackageValue(
                      options.currentPlan || options.taskState?.currentPlan || options.taskState?.plan || null,
                      5000
                  ),
                  unresolvedFields: normalizeManifestList(
                      options.unresolvedFields || options.taskState?.unresolvedFields || [],
                      24
                  ),
                  taskState: normalizeContextPackageValue(options.taskState || null, 5000),
                  outputRefs: packageBefore.availableOutputRefs.slice(-24),
                  droppedItemsManifest: packageBefore.droppedItemsManifest,
                  instruction: 'Continue the same visible conversation. Use the active task state and recent user/assistant turns as context; do not invent missing history.'
              }
            : persistentTaskAgentSession
                ? {
                  schema: 'ailis.session_context_checkpoint.v2',
                  contextMode,
                  reason: String(options.compactionReason || packageBefore.budgetReport.level || 'context_budget'),
                  activeGoal,
                  currentRequest: currentRequestText,
                  constraints: normalizeManifestList(options.constraints || options.taskState?.constraints || [], 24),
                  currentPlan: normalizeContextPackageValue(
                      options.currentPlan || options.taskState?.currentPlan || options.taskState?.plan || null,
                      5000
                  ),
                  unresolvedFields: normalizeManifestList(
                      options.unresolvedFields || options.taskState?.unresolvedFields || [],
                      24
                  ),
                  taskState: normalizeContextPackageValue(options.taskState || null, 5000),
                  outputRefs: packageBefore.availableOutputRefs.slice(-24),
                  droppedItemsManifest: packageBefore.droppedItemsManifest,
                  instruction: 'Continue the persistent Session. The latest Turn input is authoritative; activeGoal is optional durable context. Completed Turn commands and stale tool errors are history, not current instructions.'
              }
                : {
                  schema: 'ailis.semantic_context_checkpoint.v1',
                  contextMode,
                  reason: String(options.compactionReason || packageBefore.budgetReport.level || 'context_budget'),
                  originalGoalPreservedVerbatim: Boolean(originalTaskText),
                  originalGoal: originalTaskText,
                  constraints: normalizeManifestList(options.constraints || options.taskState?.constraints || [], 24),
                  currentPlan: normalizeContextPackageValue(
                      options.currentPlan || options.taskState?.currentPlan || options.taskState?.plan || null,
                      5000
                  ),
                  unresolvedFields: normalizeManifestList(
                      options.unresolvedFields || options.taskState?.unresolvedFields || [],
                      24
                  ),
                  taskState: normalizeContextPackageValue(options.taskState || null, 5000),
                  outputRefs: packageBefore.availableOutputRefs.slice(-24),
                  droppedItemsManifest: packageBefore.droppedItemsManifest,
                  instruction: 'Continue the same task from this checkpoint. Do not repeat completed work. Use the preserved original task and constraints as the authority.'
              };
        const checkpointMessage = ResponseItem.message({
            role: persistentTaskAgentSession ? 'developer' : 'user',
            content: [{
                type: 'input_text',
                text: persistentTaskAgentSession
                    ? `<ailis_session_checkpoint>\n${JSON.stringify(checkpoint)}\n</ailis_session_checkpoint>`
                    : `<ailis_context_checkpoint>\n${JSON.stringify(checkpoint)}\n</ailis_context_checkpoint>`
            }]
        });
        const recentPairs = collectRecentCallOutputPairs(
            packageBefore.recentResponseItems,
            Number(options.recentToolPairs || (personaMode ? 2 : 4))
        );
        const personaVisibleBudget = Math.max(
            6000,
            Math.min(
                Number(options.personaVisibleHistoryChars) ||
                    Number(options.budgetConfig?.effectiveInputLimitTokens || 0) * 2,
                30000
            )
        );
        const recentVisibleMessages = personaMode || persistentTaskAgentSession
            ? collectRecentVisibleMessages(
                  this.items,
                  personaMode ? personaVisibleBudget : Math.max(8000, Math.min(personaVisibleBudget, 24000))
              )
            : [];
        const replacementHistory = personaMode
            ? [
                  ...contextMessages.map(cloneJson),
                  ...recentVisibleMessages,
                  checkpointMessage,
                  ...recentPairs
              ].filter(Boolean)
            : persistentTaskAgentSession
                ? [
                  ...contextMessages.map(cloneJson),
                  checkpointMessage,
                  ...recentVisibleMessages,
                  ...recentPairs
              ].filter(Boolean)
                : [
                  ...contextMessages.map(cloneJson),
                  originalTask,
                  ...recentUserMessages,
                  checkpointMessage,
                  ...recentPairs
              ].filter(Boolean);
        return {
            message: `Semantic context checkpoint created for: ${summarizeForModel(
                persistentTaskAgentSession
                    ? currentRequestText || activeGoal?.objective || 'persistent Session'
                    : originalTaskText,
                240
            )}`,
            replacement_history: replacementHistory,
            checkpoint,
            packageBefore
        };
    }

    semanticCompact(options = {}) {
        this.normalizeHistory(options.inputModalities || []);
        const packageBefore = this.forPromptPackage(options);
        const shouldCompact = options.force === true ||
            packageBefore.budgetReport.level === 'hard' ||
            packageBefore.budgetReport.level === 'stop';
        if (!shouldCompact) {
            return {
                compacted: false,
                packageBefore,
                packageAfter: packageBefore,
                historyVersion: this.history_version
            };
        }
        const compactedItem = this.buildSemanticCompactedItem({
            ...options,
            compactionReason: options.compactionReason || packageBefore.budgetReport.level
        });
        this.replaceCompactedHistory(compactedItem, this.reference_context_item);
        const packageAfter = this.forPromptPackage(options);
        return {
            compacted: true,
            reason: compactedItem.checkpoint.reason,
            checkpoint: compactedItem.checkpoint,
            packageBefore,
            packageAfter,
            historyVersion: this.history_version
        };
    }

    normalizeHistory(inputModalities = []) {
        this.ensureCallOutputsPresent();
        this.removeOrphanOutputs();
        if (!supportsImages(inputModalities)) {
            this.stripImagesWhenUnsupported();
        }
    }

    limitInputImages(maxImages = DEFAULT_MAX_INPUT_IMAGES) {
        const configured = Number(maxImages);
        const limit = Number.isFinite(configured)
            ? Math.max(0, Math.min(DEFAULT_MAX_INPUT_IMAGES, Math.trunc(configured)))
            : DEFAULT_MAX_INPUT_IMAGES;
        let kept = 0;
        const keepNewestImages = (content = []) => {
            const next = [];
            for (let index = (Array.isArray(content) ? content.length : 0) - 1; index >= 0; index -= 1) {
                const part = content[index];
                if (part?.type !== 'input_image') {
                    next.unshift(cloneJson(part));
                    continue;
                }
                if (kept < limit) {
                    kept += 1;
                    next.unshift(cloneJson(part));
                }
            }
            return next.filter(Boolean);
        };
        for (let index = this.items.length - 1; index >= 0; index -= 1) {
            const item = this.items[index];
            if (item?.type === 'function_call_output' || item?.type === 'custom_tool_call_output') {
                const normalized = FunctionCallOutputPayload.normalize(item.output);
                if (normalized.body?.kind === 'content_items') {
                    this.items[index] = {
                        ...cloneJson(item),
                        output: FunctionCallOutputPayload.fromContentItems(
                            keepNewestImages(normalized.body.value),
                            { success: normalized.success }
                        )
                    };
                }
                continue;
            }
            if (item?.type === 'message' && Array.isArray(item.content)) {
                const content = keepNewestImages(item.content);
                this.items[index] = {
                    ...cloneJson(item),
                    content: content.length
                        ? content
                        : [ContentItem.inputText('older image omitted from the current model view')].filter(Boolean)
                };
            }
        }
        return kept;
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
            tool_output_chars: this.toolOutputChars,
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
            toolOutputChars: resolveToolOutputChars(
                options.toolOutputChars,
                resolveToolOutputChars(
                    checkpoint.tool_output_chars,
                    resolveToolOutputChars(checkpoint.toolOutputChars)
                )
            )
        });
    }
}

module.exports = {
    ContextManager,
    DEFAULT_TOOL_OUTPUT_CHARS,
    truncateFunctionOutputPayload
};
