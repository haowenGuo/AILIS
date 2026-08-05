'use strict';

const RETRIEVAL_REQUEST_SCHEMA = 'ailis.retrieval_request.v1';

function normalizeText(value = '') {
    return typeof value === 'string' ? value.trim() : '';
}

function normalizeRetrievalRequest(value = null, defaults = {}) {
    const source = typeof value === 'string'
        ? { query: value }
        : value && typeof value === 'object'
            ? value
            : {};
    const query = normalizeText(
        source.query || source.text || source.searchQuery || defaults.query
    );
    const referenceTime = normalizeText(
        source.referenceTime || source.questionTime || defaults.referenceTime
    );
    return {
        schema: RETRIEVAL_REQUEST_SCHEMA,
        query,
        referenceTime,
        source: normalizeText(source.source || defaults.source || 'runtime'),
        explicit: Boolean(
            value &&
            (typeof value === 'string' || typeof value === 'object') &&
            normalizeText(source.query || source.text || source.searchQuery)
        )
    };
}

function resolveRetrievalRequest(request = {}, context = {}) {
    const candidates = [
        request?.retrievalRequest,
        request?.retrieval_request,
        context?.retrievalRequest,
        context?.retrieval_request
    ];
    const explicit = candidates.find((candidate) =>
        typeof candidate === 'string' ||
        (candidate && typeof candidate === 'object')
    );
    if (explicit !== undefined) {
        return normalizeRetrievalRequest(explicit);
    }
    const legacyQuery = normalizeText(
        request?.retrievalQuery ||
        request?.retrieval_query ||
        context?.retrievalQuery ||
        context?.retrieval_query
    );
    if (!legacyQuery) {
        return null;
    }
    return normalizeRetrievalRequest({
        query: legacyQuery,
        source: 'legacy_retrieval_query'
    });
}

module.exports = {
    RETRIEVAL_REQUEST_SCHEMA,
    normalizeRetrievalRequest,
    resolveRetrievalRequest
};
