import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import test from 'node:test';

const require = createRequire(import.meta.url);
const {
    attachObservationContract,
    buildObservationContract,
    compactObservationContract
} = require('../electron/ailis-observation-contract.cjs');

test('ObservationContract detects an error payload hidden inside successful transport text', () => {
    const contract = buildObservationContract({
        content: [{ type: 'text', text: '{"error":"Access denied by remote host"}' }],
        details: { status: 'completed' }
    }, { toolId: 'web_fetch' });

    assert.equal(contract.status, 'blocked');
    assert.equal(contract.transport_ok, true);
    assert.equal(contract.content_ok, false);
    assert.equal(contract.capability_ready, true);
    assert.equal(contract.error_code, 'access_denied');
});

test('ObservationContract separates unavailable capability from an ordinary tool failure', () => {
    const contract = buildObservationContract({
        isError: true,
        content: [{ type: 'text', text: 'No matching adapter.' }],
        details: {
            status: 'failed',
            nested: { ok: false, code: 'no_matching_adapter', error: 'No matching adapter.' }
        }
    }, { toolId: 'artifact_tools' });

    assert.equal(contract.status, 'failed');
    assert.equal(contract.capability_ready, false);
    assert.equal(contract.error_code, 'no_matching_adapter');
});

test('ObservationContract records metadata-only image inspection as partial understanding', () => {
    const contract = buildObservationContract({
        content: [{ type: 'text', text: 'image dimensions: 800x600' }],
        details: {
            status: 'partial',
            format: 'png',
            semanticLevel: 'metadata',
            complete: false
        }
    }, { toolId: 'artifact_tools' });

    assert.equal(contract.status, 'partial');
    assert.equal(contract.semantic_level, 'metadata');
    assert.equal(contract.complete, false);
});

test('ObservationContract attachment preserves original model-visible content', () => {
    const output = {
        content: [{ type: 'text', text: '{"rows":[1,2,3]}' }],
        details: { status: 'completed' }
    };
    attachObservationContract(output, { toolId: 'artifact_tools' });

    assert.equal(output.content.length, 1);
    assert.equal(output.content[0].text, '{"rows":[1,2,3]}');
    assert.equal(output.details.observationContract.status, 'completed');
    assert.equal(output.structuredContent.observationContract.status, 'completed');
    assert.equal(compactObservationContract(output.details.observationContract).reasoning_ready, undefined);
});

test('ObservationContract keeps a successful aggregate completed when one nested candidate failed', () => {
    const contract = buildObservationContract({
        isError: false,
        details: {
            status: 'completed',
            result: {
                isError: false,
                structuredContent: {
                    ok: true,
                    status: 'completed',
                    captures: [
                        { ok: false, status: 'failed', error: 'One archived candidate timed out.' },
                        { ok: true, status: 'completed', url: 'https://example.test/capture' }
                    ],
                    best_next_call: {
                        tool: 'web_archive_lookup',
                        args: { action: 'open' }
                    }
                }
            }
        }
    }, { toolId: 'web_archive_lookup' });

    assert.equal(contract.status, 'completed');
    assert.equal(contract.transport_ok, true);
    assert.equal(contract.content_ok, true);
    assert.equal(contract.error_code, undefined);
});

test('ObservationContract still honors an authoritative nested result failure', () => {
    const contract = buildObservationContract({
        isError: false,
        details: {
            status: 'completed',
            result: {
                isError: true,
                details: {
                    status: 'failed',
                    code: 'provider_unavailable',
                    error: 'Archive provider is unavailable.'
                }
            }
        }
    }, { toolId: 'web_archive_lookup' });

    assert.equal(contract.status, 'failed');
    assert.equal(contract.transport_ok, true);
    assert.equal(contract.content_ok, false);
    assert.equal(contract.capability_ready, false);
    assert.equal(contract.error_code, 'provider_unavailable');
});
