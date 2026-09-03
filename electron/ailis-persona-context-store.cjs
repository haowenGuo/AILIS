const fs = require('fs');
const path = require('path');

const PERSONA_CONTEXT_STATE_VERSION = 1;

function normalizeString(value, fallback = '') {
    const text = typeof value === 'string' ? value.trim() : '';
    return text || fallback;
}

function cloneJson(value) {
    try {
        return JSON.parse(JSON.stringify(value));
    } catch {
        return null;
    }
}

function readJson(filePath, fallback) {
    try {
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch {
        return fallback;
    }
}

function atomicWriteJson(filePath, value) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    const temporaryPath = `${filePath}.${process.pid}.${Date.now()}.tmp`;
    fs.writeFileSync(temporaryPath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
    fs.renameSync(temporaryPath, filePath);
}

function normalizeCheckpoint(checkpoint = null) {
    if (!checkpoint || typeof checkpoint !== 'object' || Array.isArray(checkpoint)) {
        return null;
    }
    const normalized = cloneJson(checkpoint) || {};
    normalized.items = Array.isArray(normalized.items) ? normalized.items : [];
    return normalized;
}

function itemFingerprint(item) {
    try {
        return JSON.stringify(item);
    } catch {
        return '';
    }
}

function commonPrefixLength(left = [], right = []) {
    const limit = Math.min(left.length, right.length);
    let index = 0;
    while (index < limit && itemFingerprint(left[index]) === itemFingerprint(right[index])) {
        index += 1;
    }
    return index;
}

function mergeCheckpoint(currentCheckpoint, baseCheckpoint, candidateCheckpoint) {
    const current = normalizeCheckpoint(currentCheckpoint);
    const base = normalizeCheckpoint(baseCheckpoint);
    const candidate = normalizeCheckpoint(candidateCheckpoint);
    if (!candidate) {
        return current;
    }
    if (!current) {
        return candidate;
    }

    const currentItems = current.items;
    const baseItems = base?.items || [];
    const candidateItems = candidate.items;
    const baseIsCandidatePrefix = base && commonPrefixLength(baseItems, candidateItems) === baseItems.length;
    const currentIsBase = base && commonPrefixLength(currentItems, baseItems) === currentItems.length && currentItems.length === baseItems.length;
    const candidateReplacesBase = base &&
        Number(candidate.history_version || 0) > Number(base.history_version || 0) &&
        !baseIsCandidatePrefix;
    if (currentIsBase && candidateReplacesBase) {
        return candidate;
    }
    if (baseIsCandidatePrefix && currentIsBase) {
        return candidate;
    }

    const deltaStart = baseIsCandidatePrefix
        ? baseItems.length
        : commonPrefixLength(currentItems, candidateItems);
    const deltaItems = candidateItems.slice(deltaStart);
    if (!deltaItems.length) {
        return current;
    }
    const merged = {
        ...current,
        history_version: Math.max(
            Number(current.history_version || 0),
            Number(candidate.history_version || 0)
        ) + 1,
        token_info: candidate.token_info || current.token_info || null,
        reference_context_item: candidate.reference_context_item || current.reference_context_item || null,
        tool_output_chars: candidate.tool_output_chars ?? current.tool_output_chars,
        items: [...currentItems, ...deltaItems]
    };
    return merged;
}

function replaceFinalAssistantText(checkpoint, displayText = '') {
    const normalized = normalizeCheckpoint(checkpoint);
    const text = normalizeString(displayText);
    if (!normalized || !text) {
        return normalized;
    }
    const item = normalized.items.at(-1);
    if (item?.type === 'message' && item.role === 'assistant') {
        item.phase = item.phase || 'final_answer';
        item.content = [{ type: 'output_text', text }];
        return normalized;
    }
    normalized.items.push({
        type: 'message',
        role: 'assistant',
        phase: 'final_answer',
        content: [{ type: 'output_text', text }]
    });
    return normalized;
}

class AILISPersonaContextStore {
    constructor(options = {}) {
        this.rootDir = path.resolve(options.rootDir || path.join(process.cwd(), '.ailis-state', 'persona-context'));
        this.statePath = path.resolve(options.statePath || path.join(this.rootDir, 'state.json'));
        const loaded = readJson(this.statePath, {});
        this.state = {
            version: PERSONA_CONTEXT_STATE_VERSION,
            updatedAt: normalizeString(loaded.updatedAt),
            sessions: Object.fromEntries(
                Object.entries(loaded.sessions && typeof loaded.sessions === 'object' ? loaded.sessions : {})
                    .map(([sessionId, value]) => [
                        sessionId,
                        {
                            checkpoint: normalizeCheckpoint(value?.checkpoint),
                            updatedAt: normalizeString(value?.updatedAt)
                        }
                    ])
                    .filter(([, value]) => Boolean(value.checkpoint))
            )
        };
    }

    getCheckpoint(sessionId = '') {
        const key = normalizeString(sessionId, 'main');
        return cloneJson(this.state.sessions[key]?.checkpoint) || null;
    }

    commitCheckpoint(sessionId = '', candidateCheckpoint = null, options = {}) {
        const key = normalizeString(sessionId, 'main');
        const candidate = replaceFinalAssistantText(candidateCheckpoint, options.displayText);
        if (!candidate) {
            return this.getCheckpoint(key);
        }
        const current = this.state.sessions[key]?.checkpoint || null;
        const merged = mergeCheckpoint(current, options.baseCheckpoint, candidate);
        const now = new Date().toISOString();
        this.state.sessions[key] = { checkpoint: merged, updatedAt: now };
        this.state.version = PERSONA_CONTEXT_STATE_VERSION;
        this.state.updatedAt = now;
        atomicWriteJson(this.statePath, this.state);
        return cloneJson(merged);
    }

    appendAssistantText(sessionId = '', displayText = '') {
        const key = normalizeString(sessionId, 'main');
        const text = normalizeString(displayText);
        if (!text) {
            return this.getCheckpoint(key);
        }
        const current = normalizeCheckpoint(this.state.sessions[key]?.checkpoint) || {
            history_version: 0,
            token_info: null,
            reference_context_item: null,
            items: []
        };
        const lastItem = current.items.at(-1);
        const lastText = lastItem?.type === 'message' && lastItem.role === 'assistant'
            ? (lastItem.content || []).map((part) => normalizeString(part?.text)).filter(Boolean).join('\n')
            : '';
        if (lastText !== text) {
            current.items.push({
                type: 'message',
                role: 'assistant',
                phase: 'final_answer',
                content: [{ type: 'output_text', text }]
            });
            current.history_version = Number(current.history_version || 0) + 1;
        }
        const now = new Date().toISOString();
        this.state.sessions[key] = { checkpoint: current, updatedAt: now };
        this.state.updatedAt = now;
        atomicWriteJson(this.statePath, this.state);
        return cloneJson(current);
    }

    getStatus() {
        return {
            ok: true,
            version: PERSONA_CONTEXT_STATE_VERSION,
            statePath: this.statePath,
            sessionCount: Object.keys(this.state.sessions).length,
            updatedAt: this.state.updatedAt
        };
    }
}

module.exports = {
    AILISPersonaContextStore,
    PERSONA_CONTEXT_STATE_VERSION,
    mergeCheckpoint,
    replaceFinalAssistantText
};
