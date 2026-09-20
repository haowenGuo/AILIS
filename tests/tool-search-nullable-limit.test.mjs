import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import test from 'node:test';

const require = createRequire(import.meta.url);
const { validateToolContract } = require('../electron/ailis-tool-contracts.cjs');
const { AILIS_RUNTIME_TOOL_DEFINITIONS, createAilisFunctionToolSpec } = require('../electron/ailis-tool-specs.cjs');
const { AILISRuntimeTool, createAILISToolRuntimeRegistry } = require('../electron/ailis-tool-runtime.cjs');
const { AILISGateway } = require('../electron/ailis-gateway.cjs');
const {
    validateNativeDirectToolCall,
    buildInvalidDecisionProgressRecord,
    detectInvalidDecisionNoProgress
} = require('../electron/agent-loop/index.cjs');

const definition = AILIS_RUNTIME_TOOL_DEFINITIONS.find((tool) => tool.id === 'tool_search');
const spec = createAilisFunctionToolSpec(definition);
const query = 'web search latest news headlines';
const fixtures = Array.from({ length: 20 }, (_, index) => ({
    id: `fixture_news_${index}`,
    exposure: 'deferred',
    spec: {
        name: `fixture_news_${index}`,
        description: 'Search latest news headlines',
        parameters: { type: 'object', properties: {}, additionalProperties: false }
    }
}));

test('tool_search limit accepts omission, null and valid numbers at both validation gates', () => {
    assert.deepEqual(spec.parameters.required, ['query']);
    assert.match(spec.parameters.properties.limit.description, /Omit or use null/);
    for (const args of [{ query }, ...[null, 1, 5, 50].map((limit) => ({ query, limit }))]) {
        assert.equal(validateToolContract('tool_search', args).ok, true);
        const native = validateNativeDirectToolCall({ name: 'tool_search', arguments: args }, [spec]);
        assert.equal(native.ok, true, JSON.stringify(native.errors));
        assert.deepEqual(native.args, args, 'validation must not strip or rewrite arguments');
    }
});

test('tool_search still rejects invalid types, ranges, missing query and unknown properties', () => {
    for (const args of [
        ...['5', '', false, true, [], {}, 0, -1, 51, NaN, Infinity].map((limit) => ({ query, limit })),
        { limit: null }, { query: null, limit: null }, { query: '', limit: null },
        { query, limit: null, unknown: null }
    ]) {
        assert.equal(validateToolContract('tool_search', args).ok, false, JSON.stringify(args));
        assert.equal(validateNativeDirectToolCall({ name: 'tool_search', arguments: args }, [spec]).ok, false);
    }
    // An unrelated tool's optional numeric field must not start accepting null.
    const other = { name: 'fixture_tool', parameters: {
        type: 'object', properties: { limit: { type: 'number' } }, additionalProperties: false
    } };
    assert.equal(validateNativeDirectToolCall({ name: other.name, arguments: { limit: null } }, [other]).ok, false);
});

test('runtime and Gateway tool_search preserve their defaults for omitted and null limits', async () => {
    const runtime = { artifactToolsRuntime: {} };
    const registry = createAILISToolRuntimeRegistry(runtime);
    registry.search = (_query, limit) => fixtures.slice(0, limit);
    const gateway = { runtime, gatewayToolRuntimeRegistry: registry };
    const gatewayTool = new AILISRuntimeTool({
        definition,
        handle: (args) => AILISGateway.prototype.executeGatewayToolSearch.call(gateway, args)
    });
    for (const [dispatch, defaultLimit] of [
        [(args) => registry.dispatch('tool_search', args), 8],
        [(args) => gatewayTool.dispatch(args), 12]
    ]) {
        const omitted = await dispatch({ query });
        const nullable = await dispatch({ query, limit: null });
        assert.notEqual(nullable.isError, true);
        assert.deepEqual(nullable.structuredContent, omitted.structuredContent);
        assert.equal(nullable.structuredContent.tools.length, defaultLimit);
        assert.equal((await dispatch({ query, limit: 5 })).structuredContent.tools.length, 5);
        for (const limit of ['5', false, [], 0, 51]) {
            assert.equal((await dispatch({ query, limit })).isError, true);
        }
    }
});

test('invalid tool_search calls retain the repeated-invalid-decision fuse', () => {
    const arguments_ = { query, limit: 'invalid' };
    const validation = validateNativeDirectToolCall({ name: 'tool_search', arguments: arguments_ }, [spec]);
    assert.equal(validation.ok, false);
    const decision = {
        ok: false,
        status: 'invalid_native_tool_args',
        error: validation.errors.join('; '),
        nativeToolCall: { name: 'tool_search', arguments: arguments_ },
        raw: { errors: validation.errors, schema: validation.schema }
    };
    assert.equal(detectInvalidDecisionNoProgress([
        buildInvalidDecisionProgressRecord(decision, 0),
        buildInvalidDecisionProgressRecord(decision, 1)
    ]), 'repeated_invalid_native_tool_call');
});
