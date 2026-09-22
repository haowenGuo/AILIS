'use strict';

const { AsyncLocalStorage } = require('node:async_hooks');
const { randomUUID } = require('node:crypto');
const { performance } = require('node:perf_hooks');
const scope = new AsyncLocalStorage();

// Transport diagnostics are an audit lane, never model input or HTTP payload.
function withProviderDiagnostics(payload, fn) {
    return scope.run({ onEvent: payload?.onProviderRequestEvent }, fn);
}

function safeText(value, secrets = [], limit = 320) {
    if (typeof value !== 'string') return '';
    let text = value;
    for (const secret of secrets) {
        if (typeof secret === 'string' && secret) text = text.split(secret).join('[REDACTED]');
    }
    return text
        .replace(/https?:\/\/[^\s"'<>]+/gi, '[URL]')
        .replace(/Bearer\s+[^\s"',;]+/gi, 'Bearer [REDACTED]')
        .replace(/((?:api[_-]?key|access[_-]?token|refresh[_-]?token|authorization|password|secret)\s*[=:]\s*)(?:"[^"]*"|'[^']*'|[^\s,;]+)/gi, '$1[REDACTED]')
        .replace(/\b(?:sk-|hf_)[A-Za-z0-9_-]+/g, '[REDACTED]')
        .replace(/\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b/g, '[REDACTED]')
        .replace(/[\r\n\x00-\x1f]+/g, ' ').slice(0, limit);
}

function sanitizeProviderDetails(details, secrets = []) {
    if (!details || typeof details !== 'object') return null;
    const out = {};
    for (const key of ['requestId', 'endpointKind', 'method', 'phase', 'event', 'abortSource',
        'name', 'code', 'causeCode', 'causeMessage', 'message', 'serverRequestId']) {
        if (typeof details[key] === 'string') out[key] = safeText(details[key], secrets);
    }
    for (const key of ['timeoutMs', 'elapsedMs', 'httpStatus', 'receivedBytes']) {
        if (Number.isFinite(details[key])) out[key] = details[key];
    }
    if (Array.isArray(details.causes)) {
        out.causes = details.causes.slice(0, 4).map(e => ({
            name: safeText(e?.name, secrets, 80), code: safeText(e?.code, secrets, 80),
            message: safeText(e?.message, secrets)
        }));
    }
    return out;
}

function createProviderRequestTrace(url, options, timeoutMs) {
    const onEvent = scope.getStore()?.onEvent;
    const secrets = [];
    // Collect only values for redaction; headers themselves are never emitted.
    try {
        new Headers(options?.headers).forEach((value, name) => {
            if (/authorization|key|token|cookie/i.test(name)) {
                secrets.push(value, value.replace(/^Bearer\s+/i, ''));
            }
        });
    } catch {}
    let endpointKind = 'provider_http';
    try {
        const u = new URL(url);
        secrets.push(u.username, u.password, ...u.searchParams.values());
        const route = u.pathname;
        if (route.endsWith('/session')) endpointKind = 'cloud_session';
        else if (route.endsWith('/chat/completions')) endpointKind = 'chat_completions';
        else if (route.endsWith('/responses/compact')) endpointKind = 'responses_compact';
        else if (route.endsWith('/responses')) endpointKind = 'responses';
        else if (route.endsWith('/messages')) endpointKind = 'messages';
        else if (route.endsWith('/api/chat')) endpointKind = 'ollama_chat';
        else if (route.includes(':generateContent')) endpointKind = 'generate_content';
    } catch {}
    const started = performance.now();
    const base = { requestId: randomUUID(), endpointKind,
        method: options?.method === 'GET' ? 'GET' : 'POST', timeoutMs };
    let phase = 'awaiting_headers', httpStatus = null, serverRequestId = '', receivedBytes = 0;
    const details = extra => sanitizeProviderDetails({ ...base, phase, httpStatus, serverRequestId,
        elapsedMs: Math.round(performance.now() - started), receivedBytes, ...extra }, secrets);
    const emit = async (event, extra = {}) => {
        const value = details({ event, ...extra });
        try { if (typeof onEvent === 'function') await onEvent(value); } catch {
            // An audit/UI failure must not change the request outcome or cause a retry.
        }
        return value;
    };
    return {
        emit,
        setPhase(value) { phase = value; },
        addBytes(value) { receivedBytes += value; },
        async headers(response) {
            httpStatus = response.status;
            serverRequestId = safeText(response.headers?.get?.('x-request-id') || '', secrets, 128);
            phase = 'response_headers';
            await emit('response_headers');
        },
        async fail(error, code, abortSource = '') {
            const causes = [];
            const seen = new Set();
            let current = error;
            while (current && !seen.has(current) && causes.length < 4) {
                seen.add(current);
                // JSON parser errors may quote the response body (or echoed user text).
                const message = current.name === 'SyntaxError' && phase === 'response_body'
                    ? 'Invalid JSON response' : current.message;
                causes.push({ name: current.name, code: current.code, message });
                current = current.cause || (Array.isArray(current.errors) ? current.errors[0] : null);
            }
            return emit('failed', { code, abortSource, name: error?.name || 'HTTPError',
                message: causes[0]?.message || '', causeCode: causes[1]?.code || '',
                causeMessage: causes[1]?.message || '', causes });
        }
    };
}

module.exports = { withProviderDiagnostics, createProviderRequestTrace, sanitizeProviderDetails };
