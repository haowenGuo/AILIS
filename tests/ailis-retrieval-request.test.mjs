import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import test from 'node:test';

const require = createRequire(import.meta.url);
const {
    RETRIEVAL_REQUEST_SCHEMA,
    normalizeRetrievalRequest,
    resolveRetrievalRequest
} = require('../electron/ailis-retrieval-request.cjs');

test('RetrievalRequest keeps retrieval query separate from the model-facing message', () => {
    const request = normalizeRetrievalRequest({
        query: 'Which tea do I always choose?',
        referenceTime: '2023-04-10T23:07:00.000Z',
        source: 'benchmark_public_question'
    });

    assert.deepEqual(request, {
        schema: RETRIEVAL_REQUEST_SCHEMA,
        query: 'Which tea do I always choose?',
        referenceTime: '2023-04-10T23:07:00.000Z',
        source: 'benchmark_public_question',
        explicit: true
    });
});

test('RetrievalRequest resolves structured input before the legacy retrievalQuery field', () => {
    const resolved = resolveRetrievalRequest({
        retrievalRequest: {
            query: 'structured query',
            source: 'task_adapter'
        },
        retrievalQuery: 'legacy query'
    });

    assert.equal(resolved.query, 'structured query');
    assert.equal(resolved.source, 'task_adapter');
    assert.equal(resolved.explicit, true);
});

test('RetrievalRequest preserves the existing fallback when no explicit request exists', () => {
    assert.equal(resolveRetrievalRequest({}), null);
    assert.deepEqual(resolveRetrievalRequest({ retrievalQuery: 'legacy query' }), {
        schema: RETRIEVAL_REQUEST_SCHEMA,
        query: 'legacy query',
        referenceTime: '',
        source: 'legacy_retrieval_query',
        explicit: true
    });
});
