import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import test from 'node:test';

const require = createRequire(import.meta.url);
const {
    AILIS_RUNTIME_TOOL_DEFINITIONS,
    AILIS_TOOL_EXPOSURE,
    createAilisFunctionToolSpec
} = require('../electron/ailis-tool-specs.cjs');
const {
    makeAilisToolError,
    makeAilisToolResult,
    normalizeAilisToolOutput
} = require('../electron/ailis-tool-result.cjs');
const {
    createAilisDirectMcpToolSpec,
    normalizeAilisMcpCallArgs,
    parseAilisDirectMcpToolId
} = require('../electron/ailis-mcp-adapter.cjs');
const {
    approxTokenCount,
    compactToolResultForModel,
    compactToolSchema,
    truncateMiddleText
} = require('../electron/ailis-runtime-budget.cjs');
const {
    buildToolRoutingAdvice,
    rankToolSearchResults
} = require('../electron/ailis-tool-routing.cjs');
const {
    HumanClawMcpManager
} = require('../electron/humanclaw-mcp-session.cjs');

test('AILIS tool specs keep Codex-like shape without Codex naming', () => {
    assert.ok(AILIS_RUNTIME_TOOL_DEFINITIONS.some((tool) => tool.id === 'tool_search'));
    assert.ok(AILIS_RUNTIME_TOOL_DEFINITIONS.some((tool) => tool.id === 'output_read'));
    assert.ok(AILIS_RUNTIME_TOOL_DEFINITIONS.some((tool) => tool.id === 'output_tail'));
    assert.ok(AILIS_RUNTIME_TOOL_DEFINITIONS.some((tool) => tool.id === 'output_search'));
    assert.equal(AILIS_RUNTIME_TOOL_DEFINITIONS.find((tool) => tool.id === 'output_read').exposure, AILIS_TOOL_EXPOSURE.HIDDEN);
    assert.equal(AILIS_RUNTIME_TOOL_DEFINITIONS.find((tool) => tool.id === 'output_tail').exposure, AILIS_TOOL_EXPOSURE.HIDDEN);
    assert.equal(AILIS_RUNTIME_TOOL_DEFINITIONS.find((tool) => tool.id === 'output_search').exposure, AILIS_TOOL_EXPOSURE.HIDDEN);

    const toolSearch = AILIS_RUNTIME_TOOL_DEFINITIONS.find((tool) => tool.id === 'tool_search');
    assert.equal(toolSearch.route, 'humanclaw-runtime');
    assert.equal(toolSearch.exposure, AILIS_TOOL_EXPOSURE.DIRECT);

    const spec = createAilisFunctionToolSpec(toolSearch);
    assert.equal(spec.type, 'function');
    assert.equal(spec.name, 'tool_search');
    assert.equal(spec.parameters.type, 'object');
    assert.ok(spec.output_schema.properties.content);
    assert.equal(Object.prototype.hasOwnProperty.call(spec, 'metadata'), false);

    const mcpBridge = AILIS_RUNTIME_TOOL_DEFINITIONS.find((tool) => tool.id === 'mcp_bridge');
    const mcpBridgeSpec = createAilisFunctionToolSpec(mcpBridge);
    assert.equal(mcpBridgeSpec.defer_loading, true);
    assert.ok(mcpBridgeSpec.parameters.properties.action.enum.includes('health_check'));
    assert.ok(mcpBridgeSpec.parameters.properties.action.enum.includes('search_tools'));
    assert.equal(mcpBridgeSpec.parameters.properties.action.enum.includes('call_tool'), false);
    assert.equal(mcpBridgeSpec.parameters.properties.action.enum.includes('tool_call'), false);
});

test('AILIS tool result normalizes success and error payloads', () => {
    const success = makeAilisToolResult({
        status: 'completed',
        text: 'done',
        details: { value: 1 }
    });
    assert.equal(success.isError, false);
    assert.equal(success.content[0].text, 'done');
    assert.equal(success.details.status, 'completed');

    const error = makeAilisToolError({
        status: 'timeout',
        errorCode: 'search_backend_timeout',
        message: 'search timed out',
        retryable: true,
        details: { backend: 'duckduckgo_lite' }
    });
    assert.equal(error.isError, true);
    assert.equal(error.details.errorCode, 'search_backend_timeout');
    assert.equal(error.details.retryable, true);

    const normalized = normalizeAilisToolOutput('plain text', { toolId: 'demo' });
    assert.equal(normalized.content[0].text, 'plain text');
    assert.equal(normalized.details.toolRuntime.tool, 'demo');
});

test('AILIS MCP adapter parses direct MCP ids and creates stable specs', () => {
    assert.deepEqual(parseAilisDirectMcpToolId('mcp__ailis_research__web_search'), {
        id: 'mcp__ailis_research__web_search',
        legacyId: 'mcp:ailis_research:web_search',
        namespace: 'mcp__ailis_research__',
        callableName: 'web_search',
        server: 'ailis_research',
        tool: 'web_search'
    });
    assert.deepEqual(parseAilisDirectMcpToolId('mcp:ailis_research:web_search'), {
        id: 'mcp__ailis_research__web_search',
        legacyId: 'mcp:ailis_research:web_search',
        namespace: 'mcp__ailis_research__',
        callableName: 'web_search',
        server: 'ailis_research',
        tool: 'web_search'
    });
    assert.deepEqual(parseAilisDirectMcpToolId('mcp.ailis_research.web_fetch'), {
        id: 'mcp__ailis_research__web_fetch',
        legacyId: 'mcp:ailis_research:web_fetch',
        namespace: 'mcp__ailis_research__',
        callableName: 'web_fetch',
        server: 'ailis_research',
        tool: 'web_fetch'
    });

    const spec = createAilisDirectMcpToolSpec({
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

    const editSpec = createAilisDirectMcpToolSpec({
        server: 'filesystem_ailis',
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

    const { toolArgs, meta } = normalizeAilisMcpCallArgs({
        text: 'hello',
        _meta: { reason: 'test' }
    });
    assert.deepEqual(toolArgs, { text: 'hello' });
    assert.deepEqual(meta, { reason: 'test' });
});

function mcpTool(name, description = '') {
    return {
        id: `mcp__ailis_research__${name}`,
        type: 'mcp_tool',
        server: 'ailis_research',
        tool: name,
        name: `mcp__ailis_research__${name}`,
        description,
        schema_properties: ['path', 'url', 'query', 'title']
    };
}

test('AILIS tool routing prefers artifact-specific MCP tools over broad web_search', () => {
    const candidates = [
        mcpTool('web_search', 'Fallback broad public web search.'),
        mcpTool('web_fetch', 'Fetch a known HTML page URL.'),
        mcpTool('pdf_find_and_extract', 'Find and extract a paper or report PDF.'),
        mcpTool('read_document', 'Read Word DOCX documents with paragraphs and tables.'),
        mcpTool('read_presentation', 'Read PowerPoint PPTX slides.'),
        mcpTool('youtube_video_search', 'Search YouTube videos by title or channel with yt-dlp.'),
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
        rankToolSearchResults(candidates, 'YouTube video transcript question with known title but no URL', 2)[0].tool,
        'youtube_video_search'
    );
    assert.equal(
        rankToolSearchResults(candidates, 'https://www.youtube.com/watch?v=L1vXCYZAYYM transcript evidence', 2)[0].tool,
        'youtube_transcript'
    );
    assert.match(buildToolRoutingAdvice('attached docx Word document table', candidates), /read_document/);
});

test('AILIS tool routing can rank output store tools when an experimental surface provides them', () => {
    const outputTools = AILIS_RUNTIME_TOOL_DEFINITIONS
        .filter((tool) => ['output_read', 'output_tail', 'output_search'].includes(tool.id))
        .map((tool) => ({
            id: tool.id,
            type: 'runtime_tool',
            exposure: tool.exposure,
            spec: createAilisFunctionToolSpec(tool)
        }));

    const ranked = rankToolSearchResults(outputTools, 'exec outputId previewTruncated full stdout output', 3);
    assert.equal(ranked[0].id, 'output_read');
    assert.ok(ranked.some((tool) => tool.id === 'output_tail'));
    assert.ok(ranked.some((tool) => tool.id === 'output_search'));
});

test('HumanClaw MCP manager search uses tool routing before returning specs', async () => {
    const manager = new HumanClawMcpManager({});
    manager.listToolSpecs = async () => [
        mcpTool('web_search', 'Fallback broad public web search.'),
        mcpTool('web_fetch', 'Fetch a known HTML page URL.'),
        mcpTool('read_document', 'Read Word DOCX documents with paragraphs and tables.'),
        mcpTool('youtube_video_search', 'Search YouTube videos by title or channel with yt-dlp.'),
        mcpTool('youtube_transcript', 'Read YouTube video transcripts.')
    ];

    const documentSpecs = await manager.searchToolSpecs({
        query: 'attached docx document table evidence search web',
        limit: 1
    });
    assert.equal(documentSpecs[0].tool, 'read_document');

    const videoSpecs = await manager.searchToolSpecs({
        query: 'youtube video title BBC Earth no URL',
        limit: 1
    });
    assert.equal(videoSpecs[0].tool, 'youtube_video_search');

    const knownUrlSpecs = await manager.searchToolSpecs({
        query: 'https://www.youtube.com/watch?v=L1vXCYZAYYM transcript evidence',
        limit: 1
    });
    assert.equal(knownUrlSpecs[0].tool, 'youtube_transcript');
});

test('AILIS runtime budget compacts large schemas and tool text for model context', () => {
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

test('AILIS runtime budget preserves primary tool text beyond structured string budget', () => {
    const text = `${'x'.repeat(3000)}TAIL`;
    const compacted = compactToolResultForModel({
        content: [{ type: 'text', text }],
        details: { stdout: text }
    }, {
        maxTextChars: 6000,
        maxStructuredStringChars: 1200
    });

    assert.equal(compacted.content[0].text, text);
    assert.equal(compacted.content[0].originalTextChars, text.length);
    assert.equal(compacted.content[0].truncated, false);
    assert.equal(compacted.details.stdout.length < text.length, true);
});

test('AILIS direct MCP specs expose compact model-facing schema', () => {
    const spec = createAilisDirectMcpToolSpec({
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
