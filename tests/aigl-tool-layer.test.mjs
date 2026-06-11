import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import test from 'node:test';

const require = createRequire(import.meta.url);
const {
    AIGL_RUNTIME_TOOL_DEFINITIONS,
    AIGL_TOOL_EXPOSURE,
    createAiglFunctionToolSpec
} = require('../electron/aigl-tool-specs.cjs');
const {
    makeAiglToolError,
    makeAiglToolResult,
    normalizeAiglToolOutput
} = require('../electron/aigl-tool-result.cjs');
const {
    createAiglDirectMcpToolSpec,
    normalizeAiglMcpCallArgs,
    parseAiglDirectMcpToolId
} = require('../electron/aigl-mcp-adapter.cjs');
const {
    approxTokenCount,
    compactToolSchema,
    truncateMiddleText
} = require('../electron/aigl-runtime-budget.cjs');
const {
    buildToolRoutingAdvice,
    rankToolSearchResults
} = require('../electron/aigl-tool-routing.cjs');
const {
    HumanClawMcpManager
} = require('../electron/humanclaw-mcp-session.cjs');

test('AIGL tool specs keep Codex-like shape without Codex naming', () => {
    assert.ok(AIGL_RUNTIME_TOOL_DEFINITIONS.some((tool) => tool.id === 'tool_search'));

    const toolSearch = AIGL_RUNTIME_TOOL_DEFINITIONS.find((tool) => tool.id === 'tool_search');
    assert.equal(toolSearch.route, 'humanclaw-runtime');
    assert.equal(toolSearch.exposure, AIGL_TOOL_EXPOSURE.DIRECT);

    const spec = createAiglFunctionToolSpec(toolSearch);
    assert.equal(spec.type, 'function');
    assert.equal(spec.name, 'tool_search');
    assert.equal(spec.parameters.type, 'object');
    assert.ok(spec.output_schema.properties.content);
    assert.equal(Object.prototype.hasOwnProperty.call(spec, 'metadata'), false);

    const mcpBridge = AIGL_RUNTIME_TOOL_DEFINITIONS.find((tool) => tool.id === 'mcp_bridge');
    const mcpBridgeSpec = createAiglFunctionToolSpec(mcpBridge);
    assert.equal(mcpBridgeSpec.defer_loading, true);
    assert.ok(mcpBridgeSpec.parameters.properties.action.enum.includes('health_check'));
    assert.ok(mcpBridgeSpec.parameters.properties.action.enum.includes('search_tools'));
    assert.equal(mcpBridgeSpec.parameters.properties.action.enum.includes('call_tool'), false);
    assert.equal(mcpBridgeSpec.parameters.properties.action.enum.includes('tool_call'), false);
});

test('AIGL tool result normalizes success and error payloads', () => {
    const success = makeAiglToolResult({
        status: 'completed',
        text: 'done',
        details: { value: 1 }
    });
    assert.equal(success.isError, false);
    assert.equal(success.content[0].text, 'done');
    assert.equal(success.details.status, 'completed');

    const error = makeAiglToolError({
        status: 'timeout',
        errorCode: 'search_backend_timeout',
        message: 'search timed out',
        retryable: true,
        details: { backend: 'duckduckgo_lite' }
    });
    assert.equal(error.isError, true);
    assert.equal(error.details.errorCode, 'search_backend_timeout');
    assert.equal(error.details.retryable, true);

    const normalized = normalizeAiglToolOutput('plain text', { toolId: 'demo' });
    assert.equal(normalized.content[0].text, 'plain text');
    assert.equal(normalized.details.toolRuntime.tool, 'demo');
});

test('AIGL MCP adapter parses direct MCP ids and creates stable specs', () => {
    assert.deepEqual(parseAiglDirectMcpToolId('mcp__aigl_research__web_search'), {
        id: 'mcp__aigl_research__web_search',
        legacyId: 'mcp:aigl_research:web_search',
        namespace: 'mcp__aigl_research__',
        callableName: 'web_search',
        server: 'aigl_research',
        tool: 'web_search'
    });
    assert.deepEqual(parseAiglDirectMcpToolId('mcp:aigl_research:web_search'), {
        id: 'mcp__aigl_research__web_search',
        legacyId: 'mcp:aigl_research:web_search',
        namespace: 'mcp__aigl_research__',
        callableName: 'web_search',
        server: 'aigl_research',
        tool: 'web_search'
    });
    assert.deepEqual(parseAiglDirectMcpToolId('mcp.aigl_research.web_fetch'), {
        id: 'mcp__aigl_research__web_fetch',
        legacyId: 'mcp:aigl_research:web_fetch',
        namespace: 'mcp__aigl_research__',
        callableName: 'web_fetch',
        server: 'aigl_research',
        tool: 'web_fetch'
    });

    const spec = createAiglDirectMcpToolSpec({
        server: 'fixture',
        tool: 'echo',
        description: 'Echo input',
        inputSchema: { type: 'object', required: ['text'], properties: { text: { type: 'string' } } },
        schemaProperties: ['text']
    });
    assert.equal(spec.id, 'mcp__fixture__echo');
    assert.equal(spec.legacy_id, 'mcp:fixture:echo');
    assert.equal(spec.namespace, 'mcp__fixture__');
    assert.equal(spec.callable_name, 'echo');
    assert.equal(spec.call_pattern.tool, 'mcp__fixture__echo');
    assert.deepEqual(spec.call_pattern.args, { text: '<text>' });

    const editSpec = createAiglDirectMcpToolSpec({
        server: 'filesystem_aigl',
        tool: 'edit_file',
        description: 'Edit a file',
        inputSchema: {
            type: 'object',
            properties: {
                path: { type: 'string' },
                edits: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            oldText: { type: 'string' },
                            newText: { type: 'string' }
                        }
                    }
                }
            }
        },
        schemaProperties: ['path', 'edits']
    });
    assert.match(editSpec.description, /whole-file output/);
    assert.deepEqual(editSpec.call_pattern.args.edits[0], {
        oldText: '<exact existing text>',
        newText: '<replacement text>'
    });

    const { toolArgs, meta } = normalizeAiglMcpCallArgs({
        text: 'hello',
        _meta: { reason: 'test' }
    });
    assert.deepEqual(toolArgs, { text: 'hello' });
    assert.deepEqual(meta, { reason: 'test' });
});

function mcpTool(name, description = '') {
    return {
        id: `mcp__aigl_research__${name}`,
        type: 'mcp_tool',
        server: 'aigl_research',
        tool: name,
        name: `mcp__aigl_research__${name}`,
        description,
        schema_properties: ['path', 'url', 'query', 'title']
    };
}

test('AIGL tool routing prefers artifact-specific MCP tools over broad web_search', () => {
    const candidates = [
        mcpTool('web_search', 'Fallback broad public web search.'),
        mcpTool('web_fetch', 'Fetch a known HTML page URL.'),
        mcpTool('pdf_find_and_extract', 'Find and extract a paper or report PDF.'),
        mcpTool('read_document', 'Read Word DOCX documents with paragraphs and tables.'),
        mcpTool('read_presentation', 'Read PowerPoint PPTX slides.'),
        mcpTool('youtube_transcript', 'Read YouTube video transcripts.')
    ];

    assert.equal(
        rankToolSearchResults(candidates, 'attached docx Word document table evidence web search', 2)[0].tool,
        'read_document'
    );
    assert.equal(
        rankToolSearchResults(candidates, 'PowerPoint pptx slides that mention a category', 2)[0].tool,
        'read_presentation'
    );
    assert.equal(
        rankToolSearchResults(candidates, 'exact paper title report PDF find answer field', 2)[0].tool,
        'pdf_find_and_extract'
    );
    assert.equal(
        rankToolSearchResults(candidates, 'YouTube video transcript question', 2)[0].tool,
        'youtube_transcript'
    );
    assert.match(buildToolRoutingAdvice('attached docx Word document table', candidates), /read_document/);
});

test('HumanClaw MCP manager search uses tool routing before returning specs', async () => {
    const manager = new HumanClawMcpManager({});
    manager.listToolSpecs = async () => [
        mcpTool('web_search', 'Fallback broad public web search.'),
        mcpTool('web_fetch', 'Fetch a known HTML page URL.'),
        mcpTool('read_document', 'Read Word DOCX documents with paragraphs and tables.'),
        mcpTool('youtube_transcript', 'Read YouTube video transcripts.')
    ];

    const documentSpecs = await manager.searchToolSpecs({
        query: 'attached docx document table evidence search web',
        limit: 1
    });
    assert.equal(documentSpecs[0].tool, 'read_document');

    const videoSpecs = await manager.searchToolSpecs({
        query: 'youtube video transcript evidence',
        limit: 1
    });
    assert.equal(videoSpecs[0].tool, 'youtube_transcript');
});

test('AIGL runtime budget compacts large schemas and tool text for model context', () => {
    const schema = {
        type: 'object',
        description: 'large schema',
        properties: {
            query: { type: 'string', description: 'search query' },
            nested: {
                type: 'object',
                description: 'nested details',
                properties: Object.fromEntries(
                    Array.from({ length: 80 }, (_, index) => [
                        `field_${index}`,
                        {
                            type: 'object',
                            description: 'deep field description',
                            properties: {
                                value: { type: 'string', description: 'value description' }
                            }
                        }
                    ])
                )
            }
        },
        $defs: {
            unused: {
                type: 'object',
                description: 'unused'
            }
        }
    };
    const compacted = compactToolSchema(schema, { maxBytes: 900, maxDepth: 2 });
    assert.equal(compacted.type, 'object');
    assert.equal('$defs' in compacted, false);
    assert.ok(Buffer.byteLength(JSON.stringify(compacted), 'utf8') < Buffer.byteLength(JSON.stringify(schema), 'utf8'));

    const truncated = truncateMiddleText(`${'a'.repeat(2000)}TAIL`, 200);
    assert.match(truncated, /truncated for model budget/);
    assert.match(truncated, /TAIL$/);
    assert.ok(approxTokenCount(truncated) < approxTokenCount(`${'a'.repeat(2000)}TAIL`));
});

test('AIGL direct MCP specs expose compact model-facing schema', () => {
    const spec = createAiglDirectMcpToolSpec({
        server: 'research',
        tool: 'deep_tool',
        description: 'x'.repeat(3000),
        inputSchema: {
            type: 'object',
            description: 'large input',
            properties: {
                root: {
                    type: 'object',
                    description: 'root',
                    properties: Object.fromEntries(
                        Array.from({ length: 120 }, (_, index) => [
                            `param_${index}`,
                            {
                                type: 'object',
                                description: 'verbose param',
                                properties: {
                                    text: { type: 'string', description: 'verbose text' }
                                }
                            }
                        ])
                    )
                }
            }
        },
        schemaProperties: ['root']
    });
    assert.equal(spec.description.length <= 1200, true);
    assert.equal(spec.input_schema.type, 'object');
    assert.ok(Buffer.byteLength(JSON.stringify(spec.input_schema), 'utf8') < 4500);
});
