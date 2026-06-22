import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import http from 'node:http';
import { createRequire } from 'node:module';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

const require = createRequire(import.meta.url);
const { AILISGateway } = require('../electron/ailis-gateway.cjs');
const {
    buildAgentDirectToolSpecs,
    validateAgentToolLoopGuard,
    validateNativeDirectToolCall
} = require('../electron/ailis-agent-runner.cjs');
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
    normalizeAilisMcpToolArgs,
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
    AILISMcpManager
} = require('../electron/ailis-mcp-session.cjs');
const {
    webFetch
} = require('../scripts/mcp-ailis-research-server.cjs');

async function startLocalHttpServer(handler) {
    const server = http.createServer(handler);
    await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
    const address = server.address();
    return {
        server,
        url: `http://127.0.0.1:${address.port}`
    };
}

test('AILIS tool specs keep Codex-like shape without Codex naming', () => {
    assert.ok(AILIS_RUNTIME_TOOL_DEFINITIONS.some((tool) => tool.id === 'tool_search'));
    assert.ok(AILIS_RUNTIME_TOOL_DEFINITIONS.some((tool) => tool.id === 'artifact_compute'));
    assert.ok(AILIS_RUNTIME_TOOL_DEFINITIONS.some((tool) => tool.id === 'output_read'));
    assert.ok(AILIS_RUNTIME_TOOL_DEFINITIONS.some((tool) => tool.id === 'output_tail'));
    assert.ok(AILIS_RUNTIME_TOOL_DEFINITIONS.some((tool) => tool.id === 'output_search'));
    assert.equal(AILIS_RUNTIME_TOOL_DEFINITIONS.find((tool) => tool.id === 'output_read').exposure, AILIS_TOOL_EXPOSURE.DEFERRED);
    assert.equal(AILIS_RUNTIME_TOOL_DEFINITIONS.find((tool) => tool.id === 'output_tail').exposure, AILIS_TOOL_EXPOSURE.DEFERRED);
    assert.equal(AILIS_RUNTIME_TOOL_DEFINITIONS.find((tool) => tool.id === 'output_search').exposure, AILIS_TOOL_EXPOSURE.DEFERRED);

    const toolSearch = AILIS_RUNTIME_TOOL_DEFINITIONS.find((tool) => tool.id === 'tool_search');
    assert.equal(toolSearch.route, 'ailis-runtime');
    assert.equal(toolSearch.exposure, AILIS_TOOL_EXPOSURE.DIRECT);
    assert.match(toolSearch.description, /deferred .*tool metadata/i);

    const artifactCompute = AILIS_RUNTIME_TOOL_DEFINITIONS.find((tool) => tool.id === 'artifact_compute');
    assert.equal(artifactCompute.route, 'ailis-runtime');
    assert.equal(artifactCompute.exposure, AILIS_TOOL_EXPOSURE.DEFERRED);

    const spec = createAilisFunctionToolSpec(toolSearch);
    assert.equal(spec.type, 'function');
    assert.equal(spec.name, 'tool_search');
    assert.match(spec.description, /Tool discovery/i);
    assert.equal(spec.parameters.type, 'object');
    assert.deepEqual(spec.parameters.required, ['query']);
    assert.equal(spec.parameters.additionalProperties, false);
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

    const webSearchSpec = createAilisDirectMcpToolSpec({
        server: 'ailis_research',
        tool: 'web_search',
        description: 'Fallback broad public web search.',
        inputSchema: {
            type: 'object',
            properties: {
                query: { type: 'string' },
                maxResults: { type: 'number' }
            }
        }
    });
    assert.deepEqual(webSearchSpec.input_schema.required, ['query']);
    assert.equal(webSearchSpec.input_schema.properties.query.minLength, 1);
    assert.equal(webSearchSpec.input_schema.additionalProperties, false);
    assert.deepEqual(webSearchSpec.call_pattern.args, {
        query: '<query>',
        maxResults: '<maxResults>'
    });
    assert.equal(webSearchSpec.spec.name, 'mcp__ailis_research__web_search');
    assert.deepEqual(webSearchSpec.spec.parameters.required, ['query']);

    const webFetchSpec = createAilisDirectMcpToolSpec({
        server: 'ailis_research',
        tool: 'web_fetch',
        inputSchema: {
            type: 'object',
            properties: {
                url: { type: 'string' }
            }
        }
    });
    assert.deepEqual(webFetchSpec.input_schema.required, ['url']);
    assert.equal(webFetchSpec.input_schema.properties.url.minLength, 1);

    const describeImageSpec = createAilisDirectMcpToolSpec({
        server: 'ailis_research',
        tool: 'describe_image',
        inputSchema: {
            type: 'object',
            properties: {
                path: { type: 'string' },
                question: { type: 'string' }
            }
        }
    });
    assert.deepEqual(describeImageSpec.input_schema.required, ['path']);
    assert.equal(describeImageSpec.input_schema.properties.path.minLength, 1);

    const { toolArgs, meta } = normalizeAilisMcpCallArgs({
        text: 'hello',
        _meta: { reason: 'test' }
    });
    assert.deepEqual(toolArgs, { text: 'hello' });
    assert.deepEqual(meta, { reason: 'test' });

    const imageArgs = normalizeAilisMcpToolArgs({
        tool: 'describe_image',
        args: {
            image_path: 'C:\\tmp\\screen.png',
            question: 'What is shown?'
        }
    });
    assert.equal(imageArgs.path, 'C:\\tmp\\screen.png');
    assert.equal(imageArgs.image_path, 'C:\\tmp\\screen.png');

    const normalizedImageCall = normalizeAilisMcpCallArgs({
        imagePath: 'C:\\tmp\\screen-2.png',
        _meta: { reason: 'vision retry' }
    }, { tool: 'describe_image' });
    assert.equal(normalizedImageCall.toolArgs.path, 'C:\\tmp\\screen-2.png');
    assert.deepEqual(normalizedImageCall.meta, { reason: 'vision retry' });
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

test('AILIS tool routing prefers web_research for public current-information evidence tasks', () => {
    const candidates = [
        mcpTool('web_research', 'End-to-end public web research with search, fetch, evidence scoring, and clarification.'),
        mcpTool('web_search', 'Fallback broad public web search.'),
        mcpTool('web_fetch', 'Fetch a known HTML page URL.'),
        mcpTool('describe_image', 'Describe a local screenshot image.'),
        mcpTool('github_repo_read', 'Read a known GitHub repository.'),
        mcpTool('pdf_find_and_extract', 'Find and extract a paper or report PDF.'),
        mcpTool('read_document', 'Read Word DOCX documents.')
    ];

    const kaggleRanked = rankToolSearchResults(
        candidates,
        'Kaggle AI攻防比赛 2026 最新 competition 攻略',
        3
    );
    assert.equal(kaggleRanked[0].tool, 'web_research');
    assert.ok(kaggleRanked.some((tool) => tool.tool === 'web_research'));
    assert.ok(kaggleRanked.some((tool) => tool.tool === 'web_search'));

    const latestRanked = rankToolSearchResults(
        candidates,
        'latest adversarial machine learning challenge strategy guide',
        3
    );
    assert.equal(latestRanked[0].tool, 'web_research');
    assert.match(buildToolRoutingAdvice('latest adversarial machine learning challenge strategy guide', latestRanked), /web_research/);
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

test('AILIS MCP manager search uses tool routing before returning specs', async () => {
    const manager = new AILISMcpManager({});
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

    const publicWebSpecs = await manager.searchToolSpecs({
        query: 'Kaggle AI攻防比赛 2026 最新 competition 攻略',
        limit: 2
    });
    assert.equal(publicWebSpecs[0].tool, 'web_search');
    assert.ok(publicWebSpecs.some((tool) => tool.tool === 'web_fetch'));
});

test('AILIS Gateway exposes a small Codex-style core surface by default', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-tool-surface-'));
    const gateway = new AILISGateway({
        port: 0,
        workspaceRoot,
        projectRoot: path.resolve('.'),
        auditDir: path.join(workspaceRoot, '.audit')
    });

    const directNames = gateway.gatewayToolRuntimeRegistry.modelVisibleSpecs().map((tool) => tool.name);
    for (const expected of ['tool_search', 'update_plan', 'computer', 'read', 'write', 'exec', 'apply_patch', 'request_permissions']) {
        assert.ok(directNames.includes(expected), `${expected} should be a core direct tool`);
    }
    for (const deferred of ['read_xlsx_workbook', 'artifact_query', 'artifact_compute', 'github_pages', 'mcp_bridge', 'subagents']) {
        assert.equal(directNames.includes(deferred), false, `${deferred} should be loaded through tool_search`);
    }

    const initialSpecs = buildAgentDirectToolSpecs(gateway, {
        requestContext: { nativeDirectTools: true }
    });
    assert.equal(initialSpecs.some((tool) => tool.name === 'tool_search'), true);
    assert.equal(initialSpecs.some((tool) => tool.name === 'read_xlsx_workbook'), false);

    const searchResult = await gateway.executeGatewayToolSearch({
        query: 'xlsx spreadsheet workbook',
        includeMcp: false,
        includeExternal: false,
        limit: 5
    });
    assert.ok(searchResult.structuredContent.tools.some((tool) => tool.id === 'read_xlsx_workbook'));

    const nextSpecs = buildAgentDirectToolSpecs(gateway, {
        requestContext: { nativeDirectTools: true },
        stepResults: [{
            tool: 'tool_search',
            response: {
                ok: true,
                result: searchResult
            }
        }]
    });
    assert.equal(nextSpecs.some((tool) => tool.name === 'read_xlsx_workbook'), true);
    assert.equal(nextSpecs.some((tool) => tool.name === 'tool_search'), false);

    const repeatedSearchSpecs = buildAgentDirectToolSpecs(gateway, {
        requestContext: {
            nativeDirectTools: true,
            allowRepeatedToolSearchDirectTool: true
        },
        stepResults: [{
            tool: 'tool_search',
            response: {
                ok: true,
                result: searchResult
            }
        }]
    });
    assert.equal(repeatedSearchSpecs.some((tool) => tool.name === 'tool_search'), true);
});

test('AILIS suppresses repeated update_plan direct-tool loops without hiding other core tools', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-tool-plan-loop-'));
    const gateway = new AILISGateway({
        port: 0,
        workspaceRoot,
        projectRoot: path.resolve('.'),
        auditDir: path.join(workspaceRoot, '.audit')
    });
    const singlePlanSpecs = buildAgentDirectToolSpecs(gateway, {
        requestContext: { nativeDirectTools: true },
        stepResults: [{
            tool: 'update_plan',
            response: {
                ok: true,
                status: 'completed',
                result: { content: [{ type: 'text', text: 'plan 1' }] }
            }
        }]
    });
    assert.equal(singlePlanSpecs.some((tool) => tool.name === 'update_plan'), true);

    const repeatedPlanSteps = Array.from({ length: 2 }, (_, index) => ({
        tool: 'update_plan',
        response: {
            ok: true,
            status: 'completed',
            result: { content: [{ type: 'text', text: `plan ${index + 1}` }] }
        }
    }));

    const specs = buildAgentDirectToolSpecs(gateway, {
        requestContext: { nativeDirectTools: true },
        stepResults: repeatedPlanSteps
    });
    assert.equal(specs.some((tool) => tool.name === 'update_plan'), false);
    assert.equal(specs.some((tool) => tool.name === 'tool_search'), true);

    const overrideSpecs = buildAgentDirectToolSpecs(gateway, {
        requestContext: {
            nativeDirectTools: true,
            allowRepeatedUpdatePlanDirectTool: true
        },
        stepResults: repeatedPlanSteps
    });
    assert.equal(overrideSpecs.some((tool) => tool.name === 'update_plan'), true);
});

test('AILIS loop guard blocks repeated web_fetch after reasoning-ready evidence', () => {
    const previousFetch = {
        tool: 'mcp__ailis_research__web_fetch',
        args: { url: 'https://wiki.biligame.com/zzz/%E8%8E%B1%E7%89%B9' },
        response: {
            ok: true,
            status: 'completed',
            result: {
                details: {
                    evidenceQuality: 'sufficient_evidence',
                    isEvidence: true,
                    complete: true,
                    truncated: false,
                    reasoningReady: true,
                    observationContract: {
                        evidence_quality: 'sufficient_evidence',
                        reasoning_ready: true
                    }
                }
            }
        }
    };

    const guard = validateAgentToolLoopGuard({
        tool: 'mcp__ailis_research__web_fetch',
        args: { url: 'https://wiki.biligame.com/zzz/%E8%8E%B1%E7%89%B9#section' }
    }, [previousFetch]);

    assert.equal(guard.ok, false);
    assert.equal(guard.status, 'tool_loop_guard');
    assert.equal(guard.details.reason, 'repeated_ready_evidence');
});

test('AILIS loop guard blocks a third identical web_search query', () => {
    const previousSearches = Array.from({ length: 2 }, () => ({
        tool: 'mcp__ailis_research__web_search',
        args: { query: '绝区零 莱特 养成攻略 技能加点 配队 驱动盘' },
        response: {
            ok: true,
            status: 'completed',
            result: {
                content: [{ type: 'text', text: 'Evidence gap: Search results look off-target.' }],
                details: {
                    status: 'completed',
                    evidenceGap: 'Search results look off-target.'
                }
            }
        }
    }));

    const guard = validateAgentToolLoopGuard({
        tool: 'mcp__ailis_research__web_search',
        args: { query: '  绝区零 莱特 养成攻略 技能加点 配队 驱动盘  ' }
    }, previousSearches);

    assert.equal(guard.ok, false);
    assert.equal(guard.status, 'tool_loop_guard');
    assert.equal(guard.details.reason, 'repeated_web_tool_call');
});

test('AILIS tool_search returns strict direct MCP specs and native preflight blocks empty args', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-mcp-search-'));
    const gateway = new AILISGateway({
        port: 0,
        workspaceRoot,
        projectRoot: path.resolve('.'),
        auditDir: path.join(workspaceRoot, '.audit')
    });

    gateway.runtime.mcpManager.searchToolSpecs = async () => [
        createAilisDirectMcpToolSpec({
            server: 'ailis_research',
            tool: 'web_search',
            description: 'Fallback broad public web search.',
            inputSchema: {
                type: 'object',
                properties: {
                    query: { type: 'string' },
                    maxResults: { type: 'number' }
                }
            }
        }),
        createAilisDirectMcpToolSpec({
            server: 'ailis_research',
            tool: 'web_fetch',
            description: 'Fetch known web URL.',
            inputSchema: {
                type: 'object',
                properties: {
                    url: { type: 'string' }
                }
            }
        }),
        createAilisDirectMcpToolSpec({
            server: 'ailis_research',
            tool: 'describe_image',
            description: 'Describe a local image.',
            inputSchema: {
                type: 'object',
                properties: {
                    path: { type: 'string' }
                }
            }
        })
    ];

    const searchResult = await gateway.executeGatewayToolSearch({
        query: 'web search fetch describe image',
        includeExternal: false,
        limit: 10
    });
    const webSearch = searchResult.structuredContent.tools.find((tool) => tool.id === 'mcp__ailis_research__web_search');
    const webFetch = searchResult.structuredContent.tools.find((tool) => tool.id === 'mcp__ailis_research__web_fetch');
    const describeImage = searchResult.structuredContent.tools.find((tool) => tool.id === 'mcp__ailis_research__describe_image');
    assert.deepEqual(webSearch.spec.parameters.required, ['query']);
    assert.equal(webSearch.spec.parameters.additionalProperties, false);
    assert.deepEqual(webFetch.spec.parameters.required, ['url']);
    assert.deepEqual(describeImage.spec.parameters.required, ['path']);

    const compactedSearchResult = normalizeAilisToolOutput(searchResult, { toolId: 'tool_search' });
    const compactedWebSearch = compactedSearchResult.structuredContent.tools.find((tool) => tool.id === 'mcp__ailis_research__web_search');
    assert.deepEqual(compactedWebSearch.spec.parameters.required, ['query']);
    assert.equal(typeof compactedWebSearch.spec.parameters.properties, 'object');
    assert.equal(Array.isArray(compactedWebSearch.spec.parameters.properties), false);
    assert.equal(typeof compactedWebSearch.spec.parameters.properties.query, 'object');

    const nextSpecs = buildAgentDirectToolSpecs(gateway, {
        requestContext: { nativeDirectTools: true },
        stepResults: [{
            tool: 'tool_search',
            response: {
                ok: true,
                result: searchResult
            }
        }]
    });
    assert.ok(nextSpecs.some((tool) => tool.name === 'mcp__ailis_research__web_search'));
    assert.ok(nextSpecs.some((tool) => tool.name === 'mcp__ailis_research__web_fetch'));

    const invalidWebSearch = validateNativeDirectToolCall({
        name: 'mcp__ailis_research__web_search',
        arguments: {}
    }, nextSpecs);
    assert.equal(invalidWebSearch.ok, false);
    assert.match(invalidWebSearch.errors.join('\n'), /query is required|empty arguments/);

    const invalidWebFetch = validateNativeDirectToolCall({
        name: 'mcp__ailis_research__web_fetch',
        arguments: {}
    }, nextSpecs);
    assert.equal(invalidWebFetch.ok, false);
    assert.match(invalidWebFetch.errors.join('\n'), /url is required|empty arguments/);

    const invalidDescribeImage = validateNativeDirectToolCall({
        name: 'mcp__ailis_research__describe_image',
        arguments: {}
    }, nextSpecs);
    assert.equal(invalidDescribeImage.ok, false);
    assert.match(invalidDescribeImage.errors.join('\n'), /path is required|empty arguments/);

    const nextSpecsAfterVisionFailure = buildAgentDirectToolSpecs(gateway, {
        requestContext: { nativeDirectTools: true },
        stepResults: [{
            tool: 'tool_search',
            response: {
                ok: true,
                result: searchResult
            }
        }, {
            tool: 'mcp__ailis_research__describe_image',
            response: {
                ok: false,
                status: 'error',
                result: {
                    content: [{
                        type: 'text',
                        text: 'describe_image failed\nfailure_reason=configured_llm_provider_does_not_accept_image_url_parts'
                    }]
                }
            }
        }]
    });
    assert.equal(nextSpecsAfterVisionFailure.some((tool) => tool.name === 'mcp__ailis_research__describe_image'), false);
    assert.ok(nextSpecsAfterVisionFailure.some((tool) => tool.name === 'mcp__ailis_research__web_fetch'));

    const valid = validateNativeDirectToolCall({
        name: 'mcp__ailis_research__web_search',
        arguments: { query: 'Kaggle AI defense competition strategy', maxResults: 5 }
    }, nextSpecs);
    assert.equal(valid.ok, true, valid.errors.join('; '));
});

test('AILIS web_fetch falls back to Node fetch when python requests transport fails', async () => {
    const { server, url } = await startLocalHttpServer((request, response) => {
        response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
        response.end(`<!doctype html>
<html>
<head><title>Kaggle competitions</title></head>
<body>
<main>Kaggle AI security competition strategy page with leaderboard, rules, and practical defense notes.</main>
<a href="/rules">Competition rules</a>
</body>
</html>`);
    });
    const previous = process.env.AILIS_RESEARCH_TEST_FORCE_PYTHON_FETCH_FAIL;
    process.env.AILIS_RESEARCH_TEST_FORCE_PYTHON_FETCH_FAIL = '1';
    try {
        const result = await webFetch({
            url,
            query: 'Kaggle AI security competition strategy',
            maxChars: 2000
        });
        assert.equal(result.structuredContent.ok, true, result.content?.[0]?.text);
        assert.equal(result.details.fetchBackend, 'node_fetch');
        assert.equal(result.details.fallbackFrom, 'python_requests');
        assert.equal(result.details.primaryErrorCode, 'fetch_process_failed');
        assert.match(result.content[0].text, /Kaggle AI security competition strategy page/);
    } finally {
        if (previous === undefined) {
            delete process.env.AILIS_RESEARCH_TEST_FORCE_PYTHON_FETCH_FAIL;
        } else {
            process.env.AILIS_RESEARCH_TEST_FORCE_PYTHON_FETCH_FAIL = previous;
        }
        await new Promise((resolve) => server.close(resolve));
    }
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

test('AILIS tool routing ranks artifact_compute for managed artifact data-worker tasks', () => {
    const artifactTools = AILIS_RUNTIME_TOOL_DEFINITIONS
        .filter((tool) => ['artifact_query', 'artifact_compute'].includes(tool.id))
        .map((tool) => ({
            id: tool.id,
            type: 'runtime_tool',
            exposure: tool.exposure,
            spec: createAilisFunctionToolSpec(tool)
        }));

    const ranked = rankToolSearchResults(artifactTools, 'artifactId spreadsheet data worker find path grid compute', 2);
    assert.equal(ranked[0].id, 'artifact_compute');
    assert.match(buildToolRoutingAdvice('artifact compute path search', artifactTools), /artifact_compute/);
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
