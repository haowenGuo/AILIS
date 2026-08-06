const OBSERVATION_CONTRACT_SCHEMA = 'ailis.observation_contract.v1';

const BLOCKED_STATUSES = new Set([
    'access_denied',
    'access_challenge',
    'blocked',
    'captcha',
    'forbidden',
    'rate_limited',
    'unauthorized'
]);

const FAILED_STATUSES = new Set([
    'adapter_not_implemented',
    'adapter_query_not_implemented',
    'error',
    'failed',
    'invalid_tool_args',
    'missing_dependency',
    'needs_config',
    'no_matching_adapter',
    'not_materialized',
    'provider_unavailable',
    'timeout',
    'tool_error',
    'unsupported_action',
    'unsupported_command',
    'unsupported_content_type'
]);

const NOT_READY_CODES = new Set([
    'adapter_not_implemented',
    'adapter_query_not_implemented',
    'configured_llm_provider_does_not_accept_image_url_parts',
    'missing_dependency',
    'needs_config',
    'no_matching_adapter',
    'not_materialized',
    'provider_unavailable'
]);

const PARTIAL_EVIDENCE_QUALITIES = new Set([
    'encoding_failure',
    'js_shell',
    'link_hub',
    'metadata_only',
    'off_target_evidence',
    'partial_evidence',
    'thin_content'
]);

function normalizeString(value, fallback = '') {
    if (typeof value !== 'string') {
        return fallback;
    }
    const trimmed = value.trim();
    return trimmed || fallback;
}

function normalizeStatus(value = '') {
    return normalizeString(value).toLowerCase().replace(/[\s-]+/g, '_');
}

function cloneJson(value) {
    try {
        return JSON.parse(JSON.stringify(value));
    } catch {
        return value;
    }
}

function firstObject(...values) {
    return values.find((value) => value && typeof value === 'object' && !Array.isArray(value)) || null;
}

function collectTextContent(output = {}) {
    return (Array.isArray(output.content) ? output.content : [])
        .filter((entry) => entry && typeof entry === 'object' && typeof entry.text === 'string')
        .map((entry) => entry.text)
        .join('\n')
        .trim();
}

function parseWholeJsonText(text = '') {
    const source = normalizeString(text);
    if (!source || !/^[{\[]/.test(source) || !/[}\]]$/.test(source)) {
        return null;
    }
    try {
        const parsed = JSON.parse(source);
        return parsed && typeof parsed === 'object' ? parsed : null;
    } catch {
        return null;
    }
}

function objectLayers(value, { maxDepth = 7, maxEntries = 160 } = {}) {
    const layers = [];
    const queue = [{ value, depth: 0 }];
    const seen = new Set();
    while (queue.length && layers.length < maxEntries) {
        const current = queue.shift();
        const entry = current?.value;
        if (!entry || typeof entry !== 'object' || seen.has(entry) || current.depth > maxDepth) {
            continue;
        }
        seen.add(entry);
        if (!Array.isArray(entry)) {
            layers.push(entry);
        }
        const children = Array.isArray(entry) ? entry : Object.values(entry);
        for (const child of children.slice(0, 80)) {
            if (child && typeof child === 'object') {
                queue.push({ value: child, depth: current.depth + 1 });
            }
        }
    }
    return layers;
}

function authoritativeObservationLayers(output = {}, parsedText = null) {
    const roots = [
        output,
        output.details,
        output.structuredContent,
        parsedText
    ];
    const layers = [];
    const seen = new Set();
    const append = (value) => {
        if (!value || typeof value !== 'object' || Array.isArray(value) || seen.has(value)) {
            return;
        }
        seen.add(value);
        layers.push(value);
    };
    for (const root of roots) {
        append(root);
        append(root?.result);
        append(root?.details);
        append(root?.structuredContent);
        append(root?.structured_content);
        append(root?.result?.details);
        append(root?.result?.structuredContent);
        append(root?.result?.structured_content);
    }
    return layers;
}

function observationLayerSignalsSuccess(value = {}) {
    const status = normalizeStatus(value.status);
    return value.ok === true ||
        value.isError === false ||
        value.is_error === false ||
        ['completed', 'ok', 'success', 'succeeded'].includes(status);
}

function failureFromHttpStatus(value) {
    const httpStatus = Number(
        value?.httpStatus ??
        value?.http_status ??
        value?.statusCode ??
        value?.status_code
    );
    if (httpStatus === 401) {
        return { status: 'blocked', errorCode: 'unauthorized' };
    }
    if (httpStatus === 403) {
        return { status: 'blocked', errorCode: 'access_denied' };
    }
    if (httpStatus === 429) {
        return { status: 'blocked', errorCode: 'rate_limited' };
    }
    if (Number.isFinite(httpStatus) && httpStatus >= 500) {
        return { status: 'failed', errorCode: `http_${httpStatus}` };
    }
    return null;
}

function failureFromObject(value = {}) {
    const httpFailure = failureFromHttpStatus(value);
    if (httpFailure) {
        return {
            ...httpFailure,
            error: normalizeString(value.error || value.message)
        };
    }
    const status = normalizeStatus(
        value.errorCode ||
        value.error_code ||
        value.code ||
        value.status
    );
    const explicitFailure = value.ok === false || value.isError === true || value.is_error === true;
    if (BLOCKED_STATUSES.has(status) || status.endsWith('_blocked')) {
        return {
            status: 'blocked',
            errorCode: status,
            error: normalizeString(value.error || value.message)
        };
    }
    if (FAILED_STATUSES.has(status) || explicitFailure) {
        return {
            status: BLOCKED_STATUSES.has(status) ? 'blocked' : 'failed',
            errorCode: status || 'tool_error',
            error: normalizeString(value.error || value.message)
        };
    }
    return null;
}

function failureFromWholeJson(value) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
        return null;
    }
    const keys = Object.keys(value);
    const error = normalizeString(value.error || value.error_description || value.message);
    if (!error || !keys.some((key) => ['error', 'error_description'].includes(key))) {
        return null;
    }
    const normalized = error.toLowerCase();
    if (/access denied|forbidden|not authorized|unauthorized/.test(normalized)) {
        return { status: 'blocked', errorCode: 'access_denied', error };
    }
    if (/rate limit|too many requests/.test(normalized)) {
        return { status: 'blocked', errorCode: 'rate_limited', error };
    }
    return { status: 'failed', errorCode: 'remote_error_payload', error };
}

function inferSemanticLevel({ toolId = '', details = {}, text = '' } = {}) {
    const observationContract = firstObject(details.observationContract, details.observation_contract) || {};
    const explicit = normalizeStatus(
        observationContract.semantic_level ||
        observationContract.semanticLevel ||
        details.semanticLevel ||
        details.semantic_level ||
        details.understandingLevel ||
        details.understanding_level
    );
    if (explicit) {
        return explicit;
    }
    const tool = normalizeStatus(toolId);
    const action = normalizeStatus(details.action || details.operation);
    const format = normalizeStatus(details.format || details.observation?.format || details.inspection?.format);
    if (tool.includes('describe_image') || tool.includes('vision_observation')) {
        return 'semantic';
    }
    if (format === 'image' || ['png', 'jpg', 'jpeg', 'webp', 'tif', 'tiff'].includes(format)) {
        return 'metadata';
    }
    if (tool.includes('transcribe_audio') || details.transcript || details.segments) {
        return 'text';
    }
    if (action === 'aggregate' || details.aggregateResult || details.computation) {
        return 'computation';
    }
    if (
        tool.includes('read_document') ||
        tool.includes('read_presentation') ||
        tool.includes('read_spreadsheet') ||
        details.document ||
        details.workbook ||
        details.slides
    ) {
        return 'structure';
    }
    if (
        tool.includes('pdf_extract') ||
        tool.includes('web_fetch') ||
        tool.includes('open_page') ||
        details.source_window ||
        details.sourceWindow
    ) {
        return 'text';
    }
    if (tool.includes('web_search') || details.results || details.candidates) {
        return 'metadata';
    }
    return text ? 'text' : 'metadata';
}

function collectNextActions(details = {}) {
    const values = [
        details.nextActions,
        details.next_actions,
        details.suggestedNextCalls,
        details.suggested_next_calls,
        details.observationContract?.next_actions,
        details.observation_contract?.next_actions
    ];
    for (const value of values) {
        if (Array.isArray(value)) {
            return cloneJson(value.slice(0, 8));
        }
    }
    return [];
}

function buildObservationContract(output = {}, { toolId = '' } = {}) {
    const text = collectTextContent(output);
    const parsedText = parseWholeJsonText(text);
    const layers = objectLayers({
        details: output.details,
        structuredContent: output.structuredContent,
        parsedText
    });
    const authoritativeLayers = authoritativeObservationLayers(output, parsedText);
    const details = authoritativeLayers.reduce((merged, entry) => ({ ...merged, ...entry }), {});
    const existing = firstObject(
        output.details?.observationContract,
        output.details?.observation_contract,
        output.structuredContent?.observationContract,
        output.structuredContent?.observation_contract
    ) || {};
    const genericFailureCodes = new Set(['', 'error', 'failed', 'tool_error']);
    const selectFailure = (candidates = []) => (
        candidates.find((entry) => !genericFailureCodes.has(entry.errorCode)) ||
        candidates[0] ||
        null
    );
    const authoritativeFailures = authoritativeLayers.map(failureFromObject).filter(Boolean);
    const nestedFailures = layers.map(failureFromObject).filter(Boolean);
    const authoritativeSuccess = authoritativeLayers.some(observationLayerSignalsSuccess);
    let failure = selectFailure(authoritativeFailures) || failureFromWholeJson(parsedText);
    if (output.isError === true && (!failure || genericFailureCodes.has(failure.errorCode))) {
        failure = selectFailure(nestedFailures) || failure || {
            status: 'failed',
            errorCode: normalizeStatus(output.details?.status) || 'tool_error',
            error: normalizeString(output.details?.error)
        };
    } else if (!failure && !authoritativeSuccess) {
        failure = selectFailure(nestedFailures);
    }

    const evidenceQuality = normalizeStatus(
        existing.evidence_quality ||
        existing.evidenceQuality ||
        details.evidenceQuality ||
        details.evidence_quality
    );
    const sourceStatus = normalizeStatus(
        existing.status ||
        details.status ||
        output.details?.status
    );
    const searchStatus = normalizeStatus(
        details.search?.status ||
        details.webSearchOutput?.search?.status
    );
    const partial = PARTIAL_EVIDENCE_QUALITIES.has(evidenceQuality) ||
        ['empty', 'partial', 'partial_evidence'].includes(searchStatus) ||
        ['partial', 'degraded'].includes(sourceStatus);
    const status = failure?.status || (partial ? 'partial' : 'completed');
    const errorCode = normalizeStatus(
        failure?.errorCode ||
        existing.error_code ||
        existing.errorCode ||
        details.errorCode ||
        details.error_code
    );
    const capabilityReady = existing.capability_ready === false ||
        existing.capabilityReady === false ||
        NOT_READY_CODES.has(errorCode)
        ? false
        : true;
    const truncated = existing.truncated === true ||
        details.truncated === true ||
        details.textTruncated === true ||
        details.modelBudget?.truncated === true;
    const complete = status === 'completed' && !truncated && (
        existing.complete !== false &&
        details.complete !== false
    );
    const reasoningReady = existing.reasoning_ready === true ||
        existing.reasoningReady === true ||
        details.reasoningReady === true ||
        details.reasoning_ready === true ||
        (status === 'completed' && complete && evidenceQuality === 'sufficient_evidence');
    const matchMode = normalizeStatus(
        existing.match_mode ||
        existing.matchMode ||
        details.matchMode ||
        details.match_mode
    );
    const coverage = firstObject(
        existing.coverage,
        details.coverage,
        details.evidence?.coverage
    );
    return {
        ...cloneJson(existing),
        schema: OBSERVATION_CONTRACT_SCHEMA,
        status,
        transport_ok: output.isError !== true,
        content_ok: !failure,
        capability_ready: capabilityReady,
        semantic_level: inferSemanticLevel({ toolId, details, text }),
        evidence_quality: evidenceQuality || (reasoningReady ? 'sufficient_evidence' : ''),
        complete,
        truncated,
        reasoning_ready: reasoningReady,
        ...(matchMode ? { match_mode: matchMode } : {}),
        ...(coverage ? { coverage: cloneJson(coverage) } : {}),
        ...(errorCode ? { error_code: errorCode } : {}),
        ...(failure?.error ? { error: failure.error } : {}),
        next_actions: collectNextActions(details)
    };
}

function compactObservationContract(contract = {}) {
    return {
        schema: contract.schema || OBSERVATION_CONTRACT_SCHEMA,
        status: contract.status,
        transport_ok: contract.transport_ok,
        content_ok: contract.content_ok,
        capability_ready: contract.capability_ready,
        semantic_level: contract.semantic_level,
        complete: contract.complete,
        truncated: contract.truncated,
        match_mode: contract.match_mode || undefined,
        coverage: contract.coverage || undefined,
        error_code: contract.error_code || undefined,
        error: contract.error || undefined,
        next_actions: Array.isArray(contract.next_actions) && contract.next_actions.length
            ? contract.next_actions
            : undefined
    };
}

function shouldPrependContract(contract = {}) {
    return contract.status !== 'completed' ||
        contract.semantic_level === 'metadata' ||
        contract.semantic_level === 'structure' ||
        contract.semantic_level === 'computation' ||
        Boolean(contract.match_mode);
}

function attachObservationContract(output = {}, { toolId = '', prepend = false } = {}) {
    if (!output || typeof output !== 'object' || Array.isArray(output)) {
        return output;
    }
    if (!output.details || typeof output.details !== 'object' || Array.isArray(output.details)) {
        output.details = {};
    }
    if (!output.structuredContent || typeof output.structuredContent !== 'object' || Array.isArray(output.structuredContent)) {
        output.structuredContent = {};
    }
    const contract = buildObservationContract(output, { toolId });
    output.details.observationContract = contract;
    output.structuredContent.observationContract = cloneJson(contract);
    if (prepend && shouldPrependContract(contract)) {
        if (!Array.isArray(output.content)) {
            output.content = [];
        }
        const marker = 'OBSERVATION_CONTRACT ';
        const hasMarker = output.content.some((entry) => (
            entry?.type === 'text' &&
            normalizeString(entry.text).startsWith(marker)
        ));
        if (!hasMarker) {
            output.content.unshift({
                type: 'text',
                text: `${marker}${JSON.stringify(compactObservationContract(contract))}`
            });
        }
    }
    return output;
}

module.exports = {
    OBSERVATION_CONTRACT_SCHEMA,
    attachObservationContract,
    buildObservationContract,
    compactObservationContract
};
