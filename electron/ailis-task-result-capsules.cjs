const fs = require('fs');
const path = require('path');
const { randomUUID } = require('crypto');

const CAPSULE_STORE_VERSION = 1;
const MAX_CAPSULES = 500;
const GENERIC_QUERY_TOKENS = new Set([
    '一下', '一个', '这个', '那个', '帮我', '看看', '请问', '怎么', '什么', '如何',
    '攻略', '结果', '内容', '任务', '问题', '资料', '信息', '分析', '介绍'
]);

function normalizeString(value, fallback = '') {
    const text = typeof value === 'string' ? value.trim() : '';
    return text || fallback;
}

function truncate(value, maxChars) {
    const text = sanitizeText(value);
    if (text.length <= maxChars) {
        return text;
    }
    return `${text.slice(0, Math.max(0, maxChars - 1))}…`;
}

function sanitizeText(value) {
    return normalizeString(value)
        .replace(/<\s*(persona_output|persona_surface)\b[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, '')
        .replace(/(?:\[\s*|【\s*)(?:action|expression|emotion|gestureIntent|socialTone|taskState|speechEnergy|gazeTarget|durationHint)\s*[:=：＝][^\]】\r\n]*(?:\]|】)/gi, '')
        .split(/\r?\n/)
        .filter((line) => !/(?:\|{2}|｜{2})\s*DSML|<\s*(?:tool_calls?|invoke|parameter)\b/i.test(line))
        .join('\n')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
}

function keywordSet(value) {
    const normalized = normalizeString(value).toLowerCase();
    const tokens = new Set(normalized.match(/[a-z0-9_]{2,}|[\u4e00-\u9fff]{2,}/g) || []);
    const chinese = normalized.replace(/[^\u4e00-\u9fff]/g, '');
    for (let index = 0; index < chinese.length - 1; index += 1) {
        tokens.add(chinese.slice(index, index + 2));
    }
    for (const token of GENERIC_QUERY_TOKENS) {
        tokens.delete(token);
    }
    return tokens;
}

function relevanceScore(capsule, query) {
    const queryTokens = keywordSet(query);
    if (!queryTokens.size) {
        return 0;
    }
    const capsuleTokens = keywordSet([
        capsule.request,
        capsule.summary,
        capsule.answer,
        ...(capsule.claims || [])
    ].join('\n'));
    let matches = 0;
    let matchedTokenCount = 0;
    let strongestMatch = 0;
    for (const token of queryTokens) {
        if (capsuleTokens.has(token)) {
            matches += token.length >= 4 ? 2 : 1;
            matchedTokenCount += 1;
            if (/^[a-z0-9_]+$/i.test(token) && token.length >= 3) {
                strongestMatch = Math.max(strongestMatch, 0.35);
            } else if (/^[\u4e00-\u9fff]{2}$/.test(token)) {
                strongestMatch = Math.max(strongestMatch, 0.18);
            } else if (token.length >= 4) {
                strongestMatch = Math.max(strongestMatch, 0.4);
            }
        }
    }
    if (matchedTokenCount >= 2) {
        strongestMatch = Math.max(strongestMatch, 0.3);
    }
    return Math.max(matches / Math.max(1, queryTokens.size), strongestMatch);
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

function collectRefs(items = []) {
    const refs = [];
    for (const item of Array.isArray(items) ? items : []) {
        for (const value of [
            ...(Array.isArray(item?.evidenceRefs) ? item.evidenceRefs : []),
            item?.outputId,
            item?.artifactId
        ]) {
            const ref = normalizeString(value);
            if (ref && !refs.includes(ref)) {
                refs.push(ref);
            }
        }
    }
    return refs.slice(0, 80);
}

function buildCapsule(input = {}) {
    const handoff = input.taskRunHandoff && typeof input.taskRunHandoff === 'object'
        ? input.taskRunHandoff
        : {};
    const childResult = input.childResult && typeof input.childResult === 'object'
        ? input.childResult
        : {};
    const generatedAt = normalizeString(input.generatedAt, new Date().toISOString());
    const answer = truncate(
        handoff.finalAnswer || childResult.finalAnswer || childResult.answer || childResult.displayText,
        16000
    );
    const summary = truncate(
        input.summary || handoff.partialAnswer || handoff.finalAnswer || childResult.summary || answer || handoff.failureAnalysis?.bottleneck,
        2400
    );
    const collectedData = Array.isArray(handoff.collectedData) ? handoff.collectedData : [];
    const outputRefs = collectRefs(collectedData);
    return {
        version: CAPSULE_STORE_VERSION,
        id: normalizeString(input.id, `task_result_${randomUUID()}`),
        taskId: normalizeString(input.taskId || input.childRunId || childResult.runId || handoff.runId),
        sessionId: normalizeString(input.sessionId || handoff.sessionId),
        generatedAt,
        status: normalizeString(input.status || handoff.status || childResult.status, childResult.ok === false ? 'failed' : 'completed'),
        request: truncate(input.request || handoff.task, 2400),
        answer,
        summary,
        claims: collectedData.map((item) => truncate(item.summary || item.title, 500)).filter(Boolean).slice(0, 24),
        evidenceRefs: collectRefs(collectedData),
        outputRefs,
        unresolvedFields: (Array.isArray(input.unresolvedFields)
            ? input.unresolvedFields
            : [handoff.failureAnalysis?.bottleneck, handoff.nextStep?.recommendation]
        ).map((value) => truncate(value, 300)).filter(Boolean).slice(0, 24),
        source: 'task_agent_public_result'
    };
}

function normalizeStoredCapsule(raw = {}) {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
        return null;
    }
    const normalizeRefs = (values) => Array.from(new Set(
        (Array.isArray(values) ? values : []).map((value) => normalizeString(value)).filter(Boolean)
    )).slice(0, 80);
    return {
        version: CAPSULE_STORE_VERSION,
        id: normalizeString(raw.id, `task_result_${randomUUID()}`),
        taskId: normalizeString(raw.taskId),
        sessionId: normalizeString(raw.sessionId),
        generatedAt: normalizeString(raw.generatedAt, new Date().toISOString()),
        status: normalizeString(raw.status, 'completed'),
        request: truncate(raw.request, 2400),
        answer: truncate(raw.answer, 16000),
        summary: truncate(raw.summary || raw.answer, 2400),
        claims: (Array.isArray(raw.claims) ? raw.claims : []).map((value) => truncate(value, 500)).filter(Boolean).slice(0, 24),
        evidenceRefs: normalizeRefs(raw.evidenceRefs),
        outputRefs: normalizeRefs(raw.outputRefs),
        unresolvedFields: (Array.isArray(raw.unresolvedFields) ? raw.unresolvedFields : [])
            .map((value) => truncate(value, 300)).filter(Boolean).slice(0, 24),
        source: 'task_agent_public_result'
    };
}

class AILISTaskResultCapsuleStore {
    constructor(options = {}) {
        this.rootDir = path.resolve(options.rootDir || path.join(process.cwd(), '.ailis-state', 'task-results'));
        this.statePath = path.resolve(options.statePath || path.join(this.rootDir, 'capsules.json'));
        const loaded = readJson(this.statePath, { version: CAPSULE_STORE_VERSION, capsules: [] });
        this.state = {
            version: CAPSULE_STORE_VERSION,
            updatedAt: normalizeString(loaded?.updatedAt),
            capsules: Array.isArray(loaded?.capsules)
                ? loaded.capsules.map((capsule) => normalizeStoredCapsule(capsule)).filter(Boolean).slice(-MAX_CAPSULES)
                : []
        };
    }

    save(input = {}) {
        const capsule = buildCapsule(input);
        const existingIndex = this.state.capsules.findIndex((entry) =>
            (capsule.taskId && entry.taskId === capsule.taskId) || entry.id === capsule.id
        );
        if (existingIndex >= 0) {
            capsule.id = this.state.capsules[existingIndex].id;
            this.state.capsules.splice(existingIndex, 1, capsule);
        } else {
            this.state.capsules.push(capsule);
        }
        this.state.capsules = this.state.capsules.slice(-MAX_CAPSULES);
        this.state.updatedAt = new Date().toISOString();
        atomicWriteJson(this.statePath, this.state);
        return capsule;
    }

    backfillFromMemoryEvents(events = [], options = {}) {
        const limit = Math.max(1, Math.min(Number(options.limit) || 500, 2000));
        const existingTaskIds = new Set(this.state.capsules.map((capsule) => capsule.taskId).filter(Boolean));
        let imported = 0;
        for (const event of (Array.isArray(events) ? events : []).slice(-limit)) {
            const intent = normalizeString(event?.resultIntent).toLowerCase();
            const status = normalizeString(event?.resultStatus, 'completed').toLowerCase();
            const userText = normalizeString(event?.userText);
            const assistantText = normalizeString(event?.assistantText);
            const taskId = event?.id ? `legacy_memory_${event.id}` : '';
            if (
                !taskId ||
                existingTaskIds.has(taskId) ||
                !intent.includes('subagents') ||
                !['completed', 'success', 'succeeded'].includes(status) ||
                !userText ||
                !assistantText
            ) {
                continue;
            }
            const capsule = buildCapsule({
                id: `task_result_${event.id}`,
                taskId,
                sessionId: event.sessionId,
                generatedAt: event.ts,
                status: 'completed',
                request: userText,
                summary: assistantText,
                childResult: { answer: assistantText }
            });
            this.state.capsules.push(capsule);
            existingTaskIds.add(taskId);
            imported += 1;
        }
        if (imported) {
            this.state.capsules = this.state.capsules.slice(-MAX_CAPSULES);
            this.state.updatedAt = new Date().toISOString();
            atomicWriteJson(this.statePath, this.state);
        }
        return {
            ok: true,
            imported,
            capsuleCount: this.state.capsules.length
        };
    }

    get(id = '') {
        const normalizedId = normalizeString(id);
        return this.state.capsules.find((capsule) => capsule.id === normalizedId || capsule.taskId === normalizedId) || null;
    }

    search(query = '', options = {}) {
        const sessionId = normalizeString(options.sessionId);
        const limit = Math.max(1, Math.min(Number(options.limit) || 4, 20));
        const results = this.state.capsules
            .map((capsule, index) => {
                const relevance = relevanceScore(capsule, query);
                const sameSession = sessionId && capsule.sessionId === sessionId ? 0.2 : 0;
                const recency = index / Math.max(1, this.state.capsules.length) * 0.1;
                return { capsule, relevance, score: relevance + sameSession + recency };
            })
            .filter((entry) => entry.relevance >= 0.16 && entry.capsule.status !== 'running')
            .sort((left, right) => right.score - left.score)
            .slice(0, limit)
            .map((entry) => ({ ...entry.capsule, retrievalScore: Number(entry.score.toFixed(4)) }));
        return results;
    }

    buildPersonaContext(query = '', options = {}) {
        const capsules = this.search(query, options);
        if (!capsules.length) {
            return '';
        }
        const maxChars = Math.max(1200, Math.min(Number(options.maxChars) || 2800, 6000));
        const sections = [
            '【可复用的既往任务结果】',
            '这些是 AILIS 以前完成任务后保存的公开结果，不代表本轮重新执行。若内容足够覆盖当前问题且时效仍合适，可以直接回答；若缺字段、已过时或需要真实操作，再调用执行工具补齐。不要向用户提及内部执行器。'
        ];
        for (const capsule of capsules) {
            const block = [
                `- capsule_id: ${capsule.id}`,
                `  generated_at: ${capsule.generatedAt}`,
                `  status: ${capsule.status}`,
                `  original_request: ${truncate(capsule.request, 400)}`,
                `  summary: ${truncate(capsule.summary, 700)}`,
                capsule.answer ? `  answer_preview: ${truncate(capsule.answer, 1000)}` : '',
                `  full_result: use task_results action=get with id=${capsule.id}`,
                capsule.evidenceRefs.length ? `  evidence_refs: ${capsule.evidenceRefs.slice(0, 8).join(', ')}` : '',
                capsule.outputRefs.length ? `  output_refs: ${capsule.outputRefs.slice(0, 8).join(', ')}` : '',
                capsule.unresolvedFields.length ? `  unresolved_fields: ${truncate(capsule.unresolvedFields.join('；'), 500)}` : ''
            ].filter(Boolean).join('\n');
            if (sections.join('\n').length + block.length > maxChars) {
                if (sections.length === 2) {
                    const remaining = Math.max(400, maxChars - sections.join('\n').length - 2);
                    sections.push(truncate(block, remaining));
                }
                break;
            }
            sections.push(block);
        }
        return sections.join('\n');
    }

    getStatus() {
        return {
            ok: true,
            version: CAPSULE_STORE_VERSION,
            statePath: this.statePath,
            capsuleCount: this.state.capsules.length,
            updatedAt: this.state.updatedAt
        };
    }
}

module.exports = {
    AILISTaskResultCapsuleStore,
    buildTaskResultCapsule: buildCapsule,
    sanitizeTaskResultText: sanitizeText
};
