'use strict';

const { createHash } = require('crypto');

const TRUE_VALUES = new Set(['1', 'true', 'yes', 'on', 'enabled']);
const QUERY_KEYS = new Set(['q', 'query', 'contains', 'pattern', 'find_pattern', 'findpattern']);
const RECORD_PROJECTION_KEYS = new Set(['recordFieldProjections', 'record_field_projections']);
const MAX_SHADOW_ITEMS = 240;

function normalizeText(value = '') {
    if (value === null || value === undefined) return '';
    return String(value).trim();
}

function parseShadowBoolean(value) {
    if (typeof value === 'boolean') return value;
    return TRUE_VALUES.has(normalizeText(value).toLowerCase());
}

function firstDefined(...values) {
    return values.find((value) => value !== undefined && value !== null);
}

function resolveOptimizationShadowFlags(request = {}, requestContext = {}, env = process.env) {
    const master = parseShadowBoolean(firstDefined(
        request.optimizationShadow,
        request.optimization_shadow,
        requestContext.optimizationShadow,
        requestContext.optimization_shadow,
        env.AILIS_OPTIMIZATION_SHADOW
    ));
    const feature = (camelName, snakeName, envName) => master || parseShadowBoolean(firstDefined(
        request[camelName],
        request[snakeName],
        requestContext[camelName],
        requestContext[snakeName],
        env[envName]
    ));
    const flags = {
        contextDelta: feature(
            'contextDeltaShadow',
            'context_delta_shadow',
            'AILIS_CONTEXT_DELTA_SHADOW'
        ),
        artifactDedup: feature(
            'artifactDedupShadow',
            'artifact_dedup_shadow',
            'AILIS_ARTIFACT_DEDUP_SHADOW'
        ),
        toolArgLint: feature(
            'toolArgLintShadow',
            'tool_arg_lint_shadow',
            'AILIS_TOOL_ARG_LINT_SHADOW'
        ),
        evidenceMatrix: feature(
            'evidenceMatrixShadow',
            'evidence_matrix_shadow',
            'AILIS_EVIDENCE_MATRIX_SHADOW'
        ),
        noProgress: feature(
            'noProgressShadow',
            'no_progress_shadow',
            'AILIS_NO_PROGRESS_ADVISORY_SHADOW'
        )
    };
    return {
        enabled: Object.values(flags).some(Boolean),
        master,
        ...flags
    };
}

function serializeForShadow(value) {
    const seen = new WeakSet();
    try {
        return JSON.stringify(value, (_key, nested) => {
            if (!nested || typeof nested !== 'object') return nested;
            if (seen.has(nested)) return '[Circular]';
            seen.add(nested);
            return nested;
        });
    } catch {
        return normalizeText(value);
    }
}

function hashText(value = '') {
    return createHash('sha256').update(String(value)).digest('hex').slice(0, 20);
}

function duplicateSummary(entries = []) {
    const groups = new Map();
    for (const entry of entries.slice(0, MAX_SHADOW_ITEMS)) {
        const text = normalizeText(entry?.text);
        if (!text) continue;
        const key = hashText(text);
        const current = groups.get(key) || {
            count: 0,
            chars: text.length
        };
        current.count += 1;
        current.chars = Math.max(current.chars, text.length);
        groups.set(key, current);
    }
    const duplicates = [...groups.values()].filter((entry) => entry.count > 1);
    return {
        uniqueItems: groups.size,
        duplicateGroups: duplicates.length,
        duplicateItems: duplicates.reduce((total, entry) => total + entry.count - 1, 0),
        duplicateChars: duplicates.reduce(
            (total, entry) => total + (entry.count - 1) * entry.chars,
            0
        )
    };
}

function buildContextDeltaShadow(modelInputRequest = {}, promptBudget = {}) {
    const input = Array.isArray(modelInputRequest.input) ? modelInputRequest.input : [];
    const serializedItems = input.slice(0, MAX_SHADOW_ITEMS).map((item) => ({
        text: serializeForShadow(item),
        type: normalizeText(item?.type),
        role: normalizeText(item?.role)
    }));
    const inputChars = serializedItems.reduce((total, entry) => total + entry.text.length, 0);
    const instructionsChars = normalizeText(modelInputRequest.instructions).length;
    const toolsChars = serializeForShadow(modelInputRequest.tools || []).length;
    const retainedIndexes = new Set();
    serializedItems.forEach((entry, index) => {
        if (
            entry.type === 'message' &&
            ['system', 'developer', 'user'].includes(entry.role)
        ) {
            retainedIndexes.add(index);
        }
    });
    for (
        let index = Math.max(0, serializedItems.length - 4);
        index < serializedItems.length;
        index += 1
    ) {
        retainedIndexes.add(index);
    }
    const estimatedDeltaInputChars = [...retainedIndexes]
        .reduce((total, index) => total + serializedItems[index].text.length, 0);
    return {
        estimateOnly: true,
        itemCount: input.length,
        measuredItemCount: serializedItems.length,
        instructionsChars,
        inputChars,
        toolsChars,
        currentTotalChars: Number(promptBudget.total_chars) ||
            instructionsChars + inputChars + toolsChars,
        estimatedDeltaInputChars,
        estimatedPotentialSavingsChars: Math.max(0, inputChars - estimatedDeltaInputChars),
        exactInputDuplicates: duplicateSummary(serializedItems)
    };
}

function collectNestedScalarValues(value, acceptedKeys, output = [], depth = 0, seen = new WeakSet()) {
    if (
        value === null ||
        value === undefined ||
        depth > 14 ||
        output.length >= MAX_SHADOW_ITEMS
    ) {
        return output;
    }
    if (Array.isArray(value)) {
        for (const entry of value) {
            collectNestedScalarValues(entry, acceptedKeys, output, depth + 1, seen);
        }
        return output;
    }
    if (typeof value !== 'object') return output;
    if (seen.has(value)) return output;
    seen.add(value);
    for (const [key, nested] of Object.entries(value)) {
        if (
            acceptedKeys.has(key.toLowerCase()) &&
            ['string', 'number'].includes(typeof nested) &&
            normalizeText(nested)
        ) {
            output.push(normalizeText(nested));
        }
        collectNestedScalarValues(nested, acceptedKeys, output, depth + 1, seen);
    }
    return output;
}

function buildArtifactDedupShadow(stepResults = []) {
    const observations = [];
    const sourceIdentities = [];
    for (const step of (Array.isArray(stepResults) ? stepResults : []).slice(0, MAX_SHADOW_ITEMS)) {
        if (step?.response?.ok !== true) continue;
        const result = step.response.result ?? step.result ?? step.response;
        observations.push({ text: serializeForShadow(result) });
        const urls = collectNestedScalarValues(
            result,
            new Set(['url', 'ref_id', 'refid', 'sourceurl', 'canonicalurl'])
        );
        for (const url of urls) {
            sourceIdentities.push({
                text: `${normalizeText(step.tool).toLowerCase()}|${url}`
            });
        }
    }
    return {
        successfulObservationCount: observations.length,
        exactObservationDuplicates: duplicateSummary(observations),
        repeatedSourceIdentities: duplicateSummary(sourceIdentities)
    };
}

function queryTokenStats(value = '') {
    const tokens = normalizeText(value).toLowerCase().match(/[\p{L}\p{N}]+/gu) || [];
    const uniqueTokens = new Set(tokens);
    return {
        chars: normalizeText(value).length,
        tokens: tokens.length,
        duplicateTokenRatio: tokens.length
            ? Number((1 - uniqueTokens.size / tokens.length).toFixed(4))
            : 0
    };
}

function collectToolArgLint(value, path = [], output = [], depth = 0) {
    if (
        value === null ||
        value === undefined ||
        depth > 10 ||
        output.length >= MAX_SHADOW_ITEMS
    ) {
        return output;
    }
    if (Array.isArray(value)) {
        value.forEach((entry, index) =>
            collectToolArgLint(entry, [...path, String(index)], output, depth + 1)
        );
        return output;
    }
    if (typeof value !== 'object') return output;
    for (const [key, nested] of Object.entries(value)) {
        const normalizedKey = key.toLowerCase();
        if (typeof nested === 'string' && QUERY_KEYS.has(normalizedKey)) {
            const stats = queryTokenStats(nested);
            if (
                stats.chars > 300 ||
                (stats.tokens >= 8 && stats.duplicateTokenRatio >= 0.25)
            ) {
                output.push({
                    code: stats.chars > 300
                        ? 'query_too_long'
                        : 'query_token_repetition',
                    path: [...path, key].join('.'),
                    ...stats
                });
            }
        }
        collectToolArgLint(nested, [...path, key], output, depth + 1);
    }
    return output;
}

function buildToolArgLintShadow(stepResults = []) {
    const findings = [];
    for (const step of (Array.isArray(stepResults) ? stepResults : []).slice(0, MAX_SHADOW_ITEMS)) {
        const tool = normalizeText(step?.tool);
        const toolFindings = collectToolArgLint(step?.args || {}).map((finding) => ({
            ...finding,
            tool
        }));
        findings.push(...toolFindings);
        const timeoutMs = Number(step?.args?.timeoutMs ?? step?.args?.timeout_ms);
        if (
            Number.isFinite(timeoutMs) &&
            timeoutMs > 0 &&
            timeoutMs < 10000 &&
            /(?:web|archive|page|fetch|search|crawl)/i.test(tool)
        ) {
            findings.push({
                code: 'network_timeout_below_shadow_floor',
                tool,
                path: 'timeoutMs',
                timeoutMs,
                suggestedMinimumMs: 10000
            });
        }
    }
    return {
        findingCount: findings.length,
        findings: findings.slice(0, 40)
    };
}

function normalizeFieldLabel(value = '') {
    return normalizeText(value).toLowerCase().replace(/[\s_-]+/g, ' ');
}

function collectRecordProjections(value, output = [], depth = 0, seen = new WeakSet()) {
    if (
        !value ||
        typeof value !== 'object' ||
        depth > 16 ||
        output.length >= MAX_SHADOW_ITEMS
    ) {
        return output;
    }
    if (seen.has(value)) return output;
    seen.add(value);
    if (Array.isArray(value)) {
        value.forEach((entry) => collectRecordProjections(entry, output, depth + 1, seen));
        return output;
    }
    for (const [key, nested] of Object.entries(value)) {
        if (RECORD_PROJECTION_KEYS.has(key) && Array.isArray(nested)) {
            for (const row of nested) {
                if (!row || typeof row !== 'object' || !Array.isArray(row.fields)) continue;
                output.push({
                    titleHash: hashText(normalizeText(row.title)),
                    fields: row.fields.map((field) => ({
                        label: normalizeFieldLabel(field?.label || field?.name),
                        hasValue: Boolean(normalizeText(field?.value))
                    })).filter((field) => field.label)
                });
            }
            continue;
        }
        collectRecordProjections(nested, output, depth + 1, seen);
    }
    return output;
}

function inferRequestedRecordFields(message = '') {
    const text = normalizeText(message);
    const fields = [];
    if (/\blanguage\b|语言/i.test(text)) fields.push('language');
    if (/\b(?:document|resource)\s+type\b|\barticle\b|\bthesis\b|\breport\b|文献类型|文章|论文|报告/i.test(text)) {
        fields.push('document type');
    }
    if (/\bcountry\b|\bflag\b|国家|国旗/i.test(text)) fields.push('country');
    if (/\bcontent provider\b|内容提供者/i.test(text)) fields.push('content provider');
    if (/\bpublisher\b|出版者|出版社/i.test(text)) fields.push('publisher');
    return [...new Set(fields)];
}

function buildEvidenceMatrixShadow(stepResults = [], message = '') {
    const rawRows = [];
    for (const step of Array.isArray(stepResults) ? stepResults : []) {
        if (step?.response?.ok !== true) continue;
        collectRecordProjections(step.response.result ?? step.result ?? step, rawRows);
    }
    const dedupedRows = new Map();
    for (const row of rawRows) {
        const key = `${row.titleHash}|${row.fields
            .map((field) => `${field.label}:${field.hasValue}`)
            .sort()
            .join('|')}`;
        dedupedRows.set(key, row);
    }
    const rows = [...dedupedRows.values()];
    const fieldCoverage = {};
    for (const row of rows) {
        for (const field of row.fields) {
            if (!field.hasValue) continue;
            fieldCoverage[field.label] = (fieldCoverage[field.label] || 0) + 1;
        }
    }
    const requestedFields = inferRequestedRecordFields(message);
    const rowsCoveringAllRequestedFields = requestedFields.length
        ? rows.filter((row) => {
              const available = new Set(
                  row.fields.filter((field) => field.hasValue).map((field) => field.label)
              );
              return requestedFields.every((field) => available.has(field));
          }).length
        : 0;
    return {
        projectedRecordCount: rows.length,
        requestedFields,
        fieldCoverage,
        rowsCoveringAllRequestedFields,
        missingRequestedFields: requestedFields.filter((field) => !fieldCoverage[field])
    };
}

function buildNoProgressShadow(taskState = {}) {
    const research = taskState?.research || {};
    const attempts = Array.isArray(research.attempts) ? research.attempts : [];
    const signatures = attempts.map((attempt) => ({
        text: serializeForShadow({
            operation: attempt.operation || '',
            queries: attempt.queries || [],
            targets: attempt.targets || [],
            status: attempt.status || ''
        })
    }));
    return {
        researchAttemptCount: attempts.length,
        searchAttempts: attempts.filter((attempt) => attempt.operation === 'search').length,
        archiveAttempts: attempts.filter((attempt) => attempt.operation === 'archive').length,
        repeatedAttemptSignatures: duplicateSummary(signatures),
        noProgressReason: normalizeText(research.noProgressReason),
        strategyAlertCodes: (Array.isArray(research.strategyAlerts)
            ? research.strategyAlerts
            : [])
            .map((alert) => normalizeText(alert?.code))
            .filter(Boolean)
    };
}

function buildOptimizationShadowTelemetry({
    flags = {},
    iteration = 0,
    message = '',
    promptBudget = {},
    modelInputRequest = {},
    stepResults = [],
    taskState = {}
} = {}) {
    if (flags.enabled !== true) return null;
    return {
        schema: 'ailis.optimization_shadow.v1',
        mode: 'shadow_only',
        iteration,
        invariants: {
            modelInputMutation: false,
            toolArgMutation: false,
            toolChoiceMutation: false,
            answerGateMutation: false
        },
        flags: {
            contextDelta: flags.contextDelta === true,
            artifactDedup: flags.artifactDedup === true,
            toolArgLint: flags.toolArgLint === true,
            evidenceMatrix: flags.evidenceMatrix === true,
            noProgress: flags.noProgress === true
        },
        ...(flags.contextDelta === true
            ? { contextDelta: buildContextDeltaShadow(modelInputRequest, promptBudget) }
            : {}),
        ...(flags.artifactDedup === true
            ? { artifactDedup: buildArtifactDedupShadow(stepResults) }
            : {}),
        ...(flags.toolArgLint === true
            ? { toolArgLint: buildToolArgLintShadow(stepResults) }
            : {}),
        ...(flags.evidenceMatrix === true
            ? { evidenceMatrix: buildEvidenceMatrixShadow(stepResults, message) }
            : {}),
        ...(flags.noProgress === true
            ? { noProgress: buildNoProgressShadow(taskState) }
            : {})
    };
}

module.exports = {
    buildOptimizationShadowTelemetry,
    resolveOptimizationShadowFlags
};
