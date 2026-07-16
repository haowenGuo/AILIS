const { createHash, randomUUID } = require('crypto');

const DEFAULT_MAX_PREVIEW_CHARS = 480;
const DEFAULT_MAX_TEXT_CHARS = 12000;
const DEFAULT_MAX_RUN_RECORDS = 128;
const DEFAULT_MAX_TOTAL_RECORDS = 2048;

function normalizeString(value, fallback = '') {
    if (typeof value !== 'string') {
        return fallback;
    }
    const trimmed = value.trim();
    return trimmed || fallback;
}

function normalizeMode(value = '') {
    const mode = normalizeString(value, 'enforce').toLowerCase();
    return ['observe', 'enforce'].includes(mode) ? mode : 'enforce';
}

function normalizeStage(value = '') {
    const stage = normalizeString(value, 'unknown').toLowerCase();
    return stage.replace(/[^a-z0-9_.-]+/g, '_').slice(0, 80) || 'unknown';
}

function safeJsonStringify(value) {
    try {
        return JSON.stringify(value);
    } catch {
        return String(value);
    }
}

function textFromValue(value) {
    if (typeof value === 'string') {
        return value;
    }
    if (value === undefined || value === null) {
        return '';
    }
    if (Buffer.isBuffer(value)) {
        return value.toString('utf8');
    }
    return safeJsonStringify(value);
}

function truncateText(value, maxChars = DEFAULT_MAX_TEXT_CHARS) {
    const text = textFromValue(value).replace(/\s+/g, ' ').trim();
    if (text.length <= maxChars) {
        return text;
    }
    return `${text.slice(0, Math.max(0, maxChars - 24))}... [truncated]`;
}

function sha256(text = '') {
    return createHash('sha256').update(String(text)).digest('hex');
}

function approxTokenCount(text = '') {
    const compact = String(text || '').trim();
    if (!compact) {
        return 0;
    }
    const asciiChars = (compact.match(/[\x00-\x7F]/g) || []).length;
    const nonAsciiChars = compact.length - asciiChars;
    return Math.max(1, Math.ceil(asciiChars / 4 + nonAsciiChars / 1.8));
}

function normalizeRiskLevel(value = '') {
    const text = normalizeString(value, 'none').toLowerCase();
    if (['high', 'critical', 'block', 'blocked', '高风险', '严重'].includes(text)) {
        return 'high';
    }
    if (['medium', 'review', '中风险', '中等'].includes(text)) {
        return 'medium';
    }
    if (['low', '低风险', 'minor'].includes(text)) {
        return 'low';
    }
    return 'none';
}

function normalizeDecision(value = '', riskLevel = 'none') {
    const text = normalizeString(value).toLowerCase();
    if (['block', 'blocked', 'deny', 'reject', 'rollback', '阻断', '拒绝', '回退'].includes(text)) {
        return 'block';
    }
    if (['review', 'manual_review', 'revise', 'rewrite', 'needs_review', '复核', '改写'].includes(text)) {
        return 'review';
    }
    if (['allow', 'allowed', 'pass', 'accept', 'ok', '通过'].includes(text)) {
        return 'allow';
    }
    if (riskLevel === 'high') {
        return 'block';
    }
    if (riskLevel === 'medium') {
        return 'review';
    }
    return 'allow';
}

function normalizeRiskTypes(value) {
    if (Array.isArray(value)) {
        return value.map((item) => normalizeString(String(item))).filter(Boolean).slice(0, 16);
    }
    const text = normalizeString(String(value || ''));
    return text ? [text] : [];
}

function safePreview(text = '', maxChars = DEFAULT_MAX_PREVIEW_CHARS) {
    const compact = String(text || '').replace(/\s+/g, ' ').trim();
    return compact.length > maxChars ? `${compact.slice(0, maxChars - 3)}...` : compact;
}

function normalizeEvaluatorResult(value = {}) {
    const source = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
    const riskLevel = normalizeRiskLevel(
        source.riskLevel ||
        source.risk_level ||
        source.level ||
        source.severity ||
        source.risk
    );
    const decision = normalizeDecision(
        source.decision ||
        source.action ||
        source.status,
        riskLevel
    );
    return {
        decision,
        riskLevel,
        riskTypes: normalizeRiskTypes(source.riskTypes || source.risk_type || source.types),
        summary: normalizeString(source.summary || source.reason || source.message),
        suggestion: normalizeString(source.suggestion || source.rewriteSuggestion || source.rewrite_suggestion),
        rawStatus: normalizeString(source.status || source.decision || source.action)
    };
}

class AILISEmberHarness {
    constructor(options = {}) {
        const envEnabled = normalizeString(process.env.AILIS_EMBER_HARNESS, '1').toLowerCase();
        this.enabled = options.enabled !== undefined
            ? options.enabled !== false
            : !['0', 'false', 'off', 'disabled'].includes(envEnabled);
        this.mode = normalizeMode(options.mode || process.env.AILIS_EMBER_HARNESS_MODE || 'enforce');
        this.evaluator = typeof options.evaluator === 'function' ? options.evaluator : null;
        this.maxRunRecords = Math.max(16, Number(options.maxRunRecords || DEFAULT_MAX_RUN_RECORDS));
        this.maxTotalRecords = Math.max(128, Number(options.maxTotalRecords || DEFAULT_MAX_TOTAL_RECORDS));
        this.maxTextChars = Math.max(1000, Number(options.maxTextChars || DEFAULT_MAX_TEXT_CHARS));
        this.recordsByRun = new Map();
        this.stableSnapshotByRun = new Map();
        this.totalRecords = 0;
    }

    getStatus() {
        return {
            enabled: this.enabled,
            mode: this.mode,
            evaluatorConfigured: Boolean(this.evaluator),
            runCount: this.recordsByRun.size,
            totalRecords: this.totalRecords,
            maxRunRecords: this.maxRunRecords,
            maxTotalRecords: this.maxTotalRecords
        };
    }

    listRunRecords(runId = '', limit = 50) {
        const key = normalizeString(runId, 'global');
        const records = this.recordsByRun.get(key) || [];
        const bounded = Math.max(1, Math.min(Number(limit) || 50, this.maxRunRecords));
        return records.slice(-bounded);
    }

    appendRecord(runId = '', record = {}) {
        const key = normalizeString(runId, 'global');
        const records = this.recordsByRun.get(key) || [];
        records.push(record);
        while (records.length > this.maxRunRecords) {
            records.shift();
        }
        this.recordsByRun.set(key, records);
        this.totalRecords += 1;
        while (this.totalRecords > this.maxTotalRecords && this.recordsByRun.size) {
            const oldestKey = this.recordsByRun.keys().next().value;
            const oldest = this.recordsByRun.get(oldestKey) || [];
            const removed = oldest.shift();
            if (!oldest.length) {
                this.recordsByRun.delete(oldestKey);
            }
            if (removed) {
                this.totalRecords -= 1;
            } else {
                break;
            }
        }
    }

    createSnapshot({
        runId = '',
        sessionId = 'main',
        stage = 'unknown',
        boundary = 'unknown',
        text = '',
        metadata = {}
    } = {}) {
        const boundedText = truncateText(text, this.maxTextChars);
        const textHash = sha256(boundedText);
        const snapshotId = `ember-snap-${textHash.slice(0, 12)}-${randomUUID().slice(0, 8)}`;
        return {
            snapshotId,
            runId: normalizeString(runId, 'global'),
            sessionId: normalizeString(sessionId, 'main'),
            stage: normalizeStage(stage),
            boundary: normalizeStage(boundary),
            textHash,
            textChars: boundedText.length,
            approxTokens: approxTokenCount(boundedText),
            preview: safePreview(boundedText),
            metadata: metadata && typeof metadata === 'object' ? metadata : {},
            createdAt: Date.now()
        };
    }

    async check({
        runId = '',
        sessionId = 'main',
        stage = 'unknown',
        boundary = 'unknown',
        text = '',
        metadata = {},
        evaluator = null
    } = {}) {
        const normalizedRunId = normalizeString(runId, 'global');
        const normalizedSessionId = normalizeString(sessionId, 'main');
        const normalizedStage = normalizeStage(stage);
        const normalizedBoundary = normalizeStage(boundary);
        const checkId = `ember-check-${randomUUID()}`;
        if (!this.enabled) {
            return {
                ok: true,
                status: 'disabled',
                decision: 'allow',
                blocked: false,
                checkId,
                runId: normalizedRunId,
                sessionId: normalizedSessionId,
                stage: normalizedStage,
                boundary: normalizedBoundary,
                evaluatorConfigured: false
            };
        }

        const snapshot = this.createSnapshot({
            runId: normalizedRunId,
            sessionId: normalizedSessionId,
            stage: normalizedStage,
            boundary: normalizedBoundary,
            text,
            metadata
        });
        const activeEvaluator = typeof evaluator === 'function' ? evaluator : this.evaluator;
        let normalized = {
            decision: 'allow',
            riskLevel: 'none',
            riskTypes: [],
            summary: '',
            suggestion: '',
            rawStatus: ''
        };
        let evaluatorError = '';
        if (activeEvaluator) {
            try {
                normalized = normalizeEvaluatorResult(await activeEvaluator({
                    checkId,
                    runId: normalizedRunId,
                    sessionId: normalizedSessionId,
                    stage: normalizedStage,
                    boundary: normalizedBoundary,
                    text: truncateText(text, this.maxTextChars),
                    snapshot,
                    metadata
                }));
            } catch (error) {
                evaluatorError = error?.message || String(error);
                normalized = {
                    decision: 'review',
                    riskLevel: 'medium',
                    riskTypes: ['evaluator_error'],
                    summary: evaluatorError,
                    suggestion: 'retry_or_manual_review',
                    rawStatus: 'evaluator_error'
                };
            }
        }

        const blocked = normalized.decision === 'block' && this.mode === 'enforce';
        const status = blocked
            ? 'blocked'
            : normalized.decision === 'review'
                ? 'review'
                : activeEvaluator
                    ? 'allowed'
                    : 'observed';
        const rollbackTo = blocked
            ? this.stableSnapshotByRun.get(normalizedRunId) || null
            : null;
        const record = {
            schema: 'ailis.ember_harness.check.v1',
            checkId,
            runId: normalizedRunId,
            sessionId: normalizedSessionId,
            stage: normalizedStage,
            boundary: normalizedBoundary,
            mode: this.mode,
            status,
            decision: normalized.decision,
            blocked,
            riskLevel: normalized.riskLevel,
            riskTypes: normalized.riskTypes,
            summary: normalized.summary,
            suggestion: normalized.suggestion,
            evaluatorConfigured: Boolean(activeEvaluator),
            evaluatorError,
            snapshot,
            rollbackTo,
            checkedAt: Date.now()
        };
        if (!blocked) {
            this.stableSnapshotByRun.set(normalizedRunId, snapshot);
        }
        this.appendRecord(normalizedRunId, record);
        return record;
    }
}

module.exports = {
    AILISEmberHarness,
    normalizeEvaluatorResult,
    normalizeRiskLevel,
    normalizeDecision,
    approxTokenCount
};
