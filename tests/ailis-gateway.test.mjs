import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const {
    AILISGateway,
    attachSuggestedMcpToolsForDirectExposure,
    collectSuggestedMcpToolNames
} = require('../electron/ailis-gateway.cjs');
const { createExecToolSpec } = require('../electron/codex-code-mode-protocol.cjs');
const ExcelJS = require('exceljs');

test('AILIS Gateway uses the low-latency sensitive-word evaluator by default', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-safety-fast-path-'));
    const gateway = new AILISGateway({
        port: 0,
        workspaceRoot,
        projectRoot: path.resolve('.'),
        auditDir: path.join(workspaceRoot, '.audit'),
        emberHarnessEnabled: true,
        emberHarnessMode: 'enforce'
    });

    const status = await gateway.prepareLocalSafetyEvaluator('test');
    assert.equal(status.evaluatorRuntime.engine, 'aho_corasick_lexicon');
    assert.equal(status.evaluatorRuntime.estimatedDownloadBytes, 0);
    assert.equal(status.evaluatorRuntime.ready, true);

    const result = await gateway.emberHarness.check({
        runId: 'safety-fast-path',
        stage: 'input',
        boundary: 'before_model_input',
        text: '我 要 杀 了 你'
    });
    assert.equal(result.blocked, true);
    assert.equal(result.evaluatorDetails.engine, 'aho_corasick_lexicon');
    await gateway.localSafetyEvaluator.dispose();
});

test('AILIS Gateway exposes actionable web_run contract errors to the model', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-web-run-contract-'));
    const gateway = new AILISGateway({
        port: 0,
        workspaceRoot,
        projectRoot: path.resolve('.'),
        auditDir: path.join(workspaceRoot, '.audit')
    });

    const result = await gateway.callTool({
        tool: 'web_run',
        args: {
            search_query: [{ q: 'historical catalog' }],
            archive: [{ url: 'https://example.test/search?', mode: 'search' }]
        }
    });

    assert.equal(result.ok, false);
    assert.equal(result.status, 'invalid_tool_args');
    assert.match(result.error, /received search_query, archive/);
    assert.match(result.error, /separate follow-up calls/);
});

test('AILIS Gateway exposes Codex-style exec continuation and workspace-safe absolute patches', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-codex-core-tools-'));
    const gateway = new AILISGateway({
        port: 0,
        workspaceRoot,
        projectRoot: path.resolve('.'),
        auditDir: path.join(workspaceRoot, '.audit')
    });
    try {
        const execution = await gateway.callTool({
            tool: 'exec_command',
            args: {
                cmd: 'node -e "setTimeout(function(){console.log(\'CONTINUED_OK\')}, 500)"',
                yield_time_ms: 50,
                max_output_tokens: 1000
            },
            context: { workspace: workspaceRoot, approved: true }
        });
        assert.equal(execution.ok, true, execution.error);
        assert.ok(execution.result.details.session_id);

        let details = execution.result.details;
        let output = details.output || '';
        const deadline = Date.now() + 15_000;
        // A cold CI shell may take more than one poll to start and finish.
        while (details.session_id && details.exit_code == null && Date.now() < deadline) {
            const continued = await gateway.callTool({
                tool: 'write_stdin',
                args: {
                    session_id: details.session_id,
                    chars: '',
                    yield_time_ms: 1000,
                    max_output_tokens: 1000
                },
                context: { workspace: workspaceRoot }
            });
            assert.equal(continued.ok, true, continued.error);
            details = continued.result.details;
            output += details.output || '';
        }
        assert.equal(details.exit_code, 0, 'child process must complete within the test deadline');
        assert.match(output, /CONTINUED_OK/);

        const target = path.join(workspaceRoot, 'absolute-patch.txt');
        const applied = await gateway.callTool({
            tool: 'apply_patch',
            args: {
                input: `*** Begin Patch\n*** Add File: ${target}\n+absolute path accepted\n*** End Patch`
            },
            context: { workspace: workspaceRoot, approved: true }
        });
        assert.equal(applied.ok, true, applied.error);
        assert.equal(await fs.readFile(target, 'utf8'), 'absolute path accepted\n');

        const outside = path.join(os.tmpdir(), `ailis-outside-${Date.now()}.txt`);
        const rejected = await gateway.callTool({
            tool: 'apply_patch',
            args: {
                input: `*** Begin Patch\n*** Add File: ${outside}\n+must fail\n*** End Patch`
            },
            context: { workspace: workspaceRoot, approved: true }
        });
        assert.equal(rejected.ok, false);
        assert.match(rejected.error, /inside workspace/i);
    } finally {
        await gateway.stop();
        // Windows may release child-process working-directory handles late.
        await fs.rm(workspaceRoot, { recursive: true, force: true, maxRetries: 10, retryDelay: 100 });
    }
});

test('AILIS Gateway executes code-mode nested tools through the ordinary governed tool path', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-code-mode-gateway-'));
    await fs.writeFile(path.join(workspaceRoot, 'evidence.txt'), 'GATEWAY_NESTED_READ_OK', 'utf8');
    const gateway = new AILISGateway({
        port: 0,
        workspaceRoot,
        projectRoot: path.resolve('.'),
        auditDir: path.join(workspaceRoot, '.audit'),
        emberHarnessEnabled: false,
        profileCurationEnabled: false
    });
    try {
        const readSpec = gateway.gatewayToolRuntimeRegistry.definition('read').spec;
        const execSpec = createExecToolSpec([readSpec]);
        const result = await gateway.callTool({
            tool: 'exec',
            args: {
                input: 'const result = await tools.read({path: "evidence.txt"}); text(JSON.stringify(result).includes("GATEWAY_NESTED_READ_OK"));'
            },
            context: {
                workspace: workspaceRoot,
                sessionId: 'gateway-code-mode-test',
                codeModeProfileId: execSpec.x_ailis_code_mode_profile
            },
            timeoutMs: 30_000
        });
        assert.equal(result.ok, true, result.error);
        assert.match(JSON.stringify(result), /Script completed/);
        assert.match(JSON.stringify(result), /true/);

        const compactExecSpec = createExecToolSpec([
            gateway.gatewayToolRuntimeRegistry.definition('exec_command').spec,
            gateway.gatewayToolRuntimeRegistry.definition('write_stdin').spec
        ]);
        const compactExec = await gateway.callTool({
            tool: 'exec',
            args: {
                input: 'const result = await tools.exec_command({cmd: "node --version"}); text(JSON.stringify(result));'
            },
            context: {
                workspace: workspaceRoot,
                approved: true,
                sessionId: 'gateway-code-mode-compact-exec-test',
                codeModeProfileId: compactExecSpec.x_ailis_code_mode_profile
            },
            timeoutMs: 30_000
        });
        assert.equal(compactExec.ok, true, compactExec.error);
        const compactExecText = JSON.stringify(compactExec.result);
        assert.match(compactExecText, /\\"output\\":\\"v\d+/);
        assert.match(compactExecText, /\\"wall_time_seconds\\":/);
        assert.doesNotMatch(compactExecText, /gateway-call|\\"callId\\"|\\"details\\"|outputStore|\\"stdout\\"|\\"stderr\\"/);

        const legacyWithoutApproval = await gateway.callTool({
            tool: 'exec',
            args: { command: 'node --version' },
            context: { workspace: workspaceRoot }
        });
        assert.equal(legacyWithoutApproval.ok, false);
        assert.match(legacyWithoutApproval.error, /approval/i);
    } finally {
        await gateway.stop();
        await fs.rm(workspaceRoot, { recursive: true, force: true, maxRetries: 10, retryDelay: 100 });
    }
});

test('AILIS materializes structured MCP follow-up actions for the next model turn', async () => {
    const result = {
        structuredContent: {
            sources: [{
                open_page: {
                    tool: 'open_page',
                    args: { url: 'https://example.test/source', lineno: 1 }
                }
            }],
            suggestedNextCalls: [{
                tool: 'find_in_page',
                args: { url: 'https://example.test/source', pattern: 'needle' }
            }]
        }
    };
    assert.deepEqual(collectSuggestedMcpToolNames(result).sort(), ['find_in_page', 'open_page']);

    const attached = await attachSuggestedMcpToolsForDirectExposure(
        result,
        'mcp__ailis_research__web_research',
        {
            listToolSpecs: async () => [
                {
                    server: 'ailis_research',
                    tool: 'open_page',
                    name: 'open_page',
                    description: 'Open a page.',
                    inputSchema: { type: 'object', required: ['url'], properties: { url: { type: 'string' } }, additionalProperties: false }
                },
                {
                    server: 'ailis_research',
                    tool: 'find_in_page',
                    name: 'find_in_page',
                    description: 'Find in a page.',
                    inputSchema: { type: 'object', required: ['url', 'pattern'], properties: { url: { type: 'string' }, pattern: { type: 'string' } }, additionalProperties: false }
                }
            ]
        }
    );

    assert.equal(attached.length, 2);
    assert.deepEqual(
        result.__ailisSuggestedMcpTools.map((tool) => tool.id).sort(),
        ['mcp__ailis_research__find_in_page', 'mcp__ailis_research__open_page']
    );
    assert.equal(Object.keys(result).includes('__ailisSuggestedMcpTools'), false);
});

test('AILIS exposes Codex-style web_run and preserves refs across search and open turns', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-native-web-search-'));
    const gateway = new AILISGateway({
        port: 0,
        workspaceRoot,
        projectRoot: path.resolve('.'),
        auditDir: path.join(workspaceRoot, '.audit')
    });
    const bridgeRequests = [];
    const mcpBridgeResult = (content, structuredContent) => ({
        content: [{ type: 'text', text: content }],
        structuredContent: {
            status: 'completed',
            server: 'ailis_research',
            result: {
                content: [{ type: 'text', text: content }],
                structuredContent
            }
        },
        details: {
            status: 'completed',
            server: 'ailis_research',
            result: {
                content: [{ type: 'text', text: content }],
                structuredContent
            }
        }
    });
    gateway.runtime.executeMcpBridge = async (request) => {
        bridgeRequests.push(request);
        if (request.tool === 'pdf_extract_text') {
            return mcpBridgeResult('The quoted word is "fluffy".', {
                status: 'completed',
                url: request.args.url,
                contentType: 'application/pdf',
                pages: 1,
                extractedText: [
                    'The quoted word is "fluffy".',
                    'The fish transport bag has a volume of 0.1777 m3.',
                    'End of extracted source.'
                ].join('\n')
            });
        }
        if (request.tool === 'webpage_screenshot') {
            return mcpBridgeResult(`Captured screenshot at ${request.args.path}`, {
                status: 'completed',
                url: request.args.url,
                path: request.args.path,
                contentType: 'image/png',
                modelImage: {
                    image_url: request.args.path,
                    detail: request.args.detail
                }
            });
        }
        if (request.tool === 'web_find') {
            return mcpBridgeResult(`Find results for pattern: ${request.args.pattern}`, {
                status: 'completed',
                url: request.args.url,
                pattern: request.args.pattern,
                source: {
                    type: 'source_viewport',
                    url: request.args.url,
                    ref_id: request.args.url,
                    line_start: 40,
                    line_end: 43,
                    total_lines: 80,
                    lines: [
                        { lineno: 40, text: '## Studio albums' },
                        { lineno: 41, text: '2005' },
                        { lineno: 42, text: 'Corazon Libre' },
                        { lineno: 43, text: '2009' }
                    ]
                }
            });
        }
        if (request.tool === 'web_archive_lookup') {
            return mcpBridgeResult('Archived source viewport: Country: gt', {
                status: 'completed',
                kind: request.args.mode === 'open' ? 'web_archive_snapshot' : 'web_archive_captures',
                originalUrl: request.args.url,
                captures: request.args.mode === 'open' ? [] : [{
                    provider: 'internet_archive',
                    timestamp: '20241212025015',
                    originalUrl: request.args.url
                }]
            });
        }
        if (request.tool === 'web_fetch' || request.tool === 'render_page') {
            if (request.args.url.endsWith('.pdf')) {
                return mcpBridgeResult('PDF content requires extraction.', {
                    contentType: 'application/pdf',
                    url: request.args.url
                });
            }
            const isPdfView = request.args.url.endsWith('/pdf-view');
            const isSectionView = request.args.url.endsWith('/section-view');
            const isPagedView = request.args.url.endsWith('/paged-view');
            const isParentIndexView = request.args.url.endsWith('/rules');
            const isRefinedParentIndexView = request.args.url.endsWith('/collections/evidence');
            const isRuleChildView = request.args.url.endsWith('/rules/article-vi');
            return mcpBridgeResult('L1: opened source', {
                    contentType: 'text/html',
                    fetchBackend: 'crawl4ai_local',
                    observedRelevantLinks: [{
                        kind: 'pdf',
                        text: isPdfView ? 'Download PDF' : 'PDF',
                        url: isPdfView
                            ? 'https://example.test/article.pdf'
                            : 'https://example.test/pdf-view'
                    }],
                    ...(isPdfView ? {
                        suggestedNextCalls: [{
                            tool: 'pdf_extract_text',
                            args: {
                                url: 'https://example.test/article.pdf',
                                maxChars: 12000
                            }
                        }]
                    } : {}),
                    source: {
                        type: 'source_viewport',
                        url: request.args.url,
                        ref_id: request.args.url,
                        line_start: isPagedView ? 58 : 1,
                        line_end: isPagedView ? 105 : isParentIndexView || isRefinedParentIndexView ? 7 : isRuleChildView ? 4 : 1,
                        total_lines: isPagedView ? 175 : isParentIndexView || isRefinedParentIndexView ? 7 : isRuleChildView ? 4 : isSectionView ? 3 : 1,
                        has_more_after: isPagedView,
                        lines: isPagedView ? [
                            { lineno: 58, text: '1. ARTICLE I. GENERAL' },
                            { lineno: 105, text: '2. ARTICLE II. OTHER' }
                        ] : isParentIndexView || isRefinedParentIndexView ? [
                            { lineno: 1, text: '1. ARTICLE I. GENERAL' },
                            { lineno: 2, text: '2. ARTICLE VI. WITNESSES Rule 601. Competency to Testify in General' },
                            { lineno: 3, text: 'Rule 611. Mode and Order of Examining Witnesses' },
                            { lineno: 4, text: '' },
                            { lineno: 5, text: '3. ARTICLE VII. OPINIONS AND EXPERT TESTIMONY' },
                            { lineno: 6, text: 'Rule 701. Opinion Testimony by Lay Witnesses' },
                            { lineno: 7, text: 'Rule 702. Testimony by Expert Witnesses' }
                        ] : isRuleChildView ? [
                            { lineno: 1, text: 'Rule 603. Oath or Affirmation to Testify Truthfully' },
                            { lineno: 2, text: 'Rule 609. Impeachment by Evidence of a Criminal Conviction of Witnesses' },
                            { lineno: 3, text: 'Rule 610. Religious Beliefs or Opinions of Witnesses' },
                            { lineno: 4, text: 'Rule 615. Excluding Witnesses' }
                        ] : isSectionView ? [
                            { lineno: 1, text: '## Contents' },
                            { lineno: 2, text: '[Studio albums](https://example.test/section-view#Studio_albums)' },
                            { lineno: 3, text: '[Live albums](https://example.test/section-view#Live_albums)' }
                        ] : [{ lineno: 1, text: 'opened source' }]
                    }
                });
        }
        if (request.args.query.startsWith('no results fixture')) {
            return mcpBridgeResult('No results.', { results: [] });
        }
        if (request.args.query === 'bridge validation failure fixture') {
            return {
                content: [{ type: 'text', text: 'MCP tool arguments failed inputSchema validation.' }],
                isError: true,
                details: {
                    status: 'error',
                    error: 'MCP tool arguments failed inputSchema validation.',
                    details: {
                        status: 'invalid_mcp_tool_args',
                        errors: ['unexpected property: domains']
                    }
                }
            };
        }
        if (request.args.query === 'hanging search fixture') {
            return await new Promise(() => {});
        }
        if (request.args.query === 'github file fixture') {
            return mcpBridgeResult('GitHub file result.', {
                results: [{
                    title: 'Repository changelog',
                    url: 'https://github.com/example/project/blob/v1.2/docs/changelog.rst',
                    snippet: 'Official changelog source.'
                }],
                suggestedNextCalls: [{
                    tool: 'github_repo_read',
                    args: {
                        repo: 'example/project',
                        mode: 'file',
                        path: 'docs/changelog.rst',
                        ref: 'v1.2'
                    },
                    reason: 'Read the linked GitHub file through the repository API.'
                }]
            });
        }
        if (request.args.query === 'evaluation leak fixture') {
            return mcpBridgeResult('Evaluation leak fixture results.', {
                results: [
                    {
                        title: 'A benchmark paper',
                        url: 'https://example.test/benchmark.pdf',
                        snippet: 'Question: What was the actual enrollment count of the clinical trial on H. pylori in acne vulgaris patients from Jan-May 2018 as listed on the NIH website? Ground truth: 90'
                    },
                    {
                        title: 'GAIA Task instruction.md',
                        url: 'https://github.com/example/harbor-datasets/blob/main/datasets/gaia/task-id/instruction.md',
                        snippet: 'GAIA Task: What was the actual enrollment count of the clinical trial on H. pylori in acne vulgaris patients from Jan-May 2018 as listed on the NIH website? Output requirements: write only the final answer.'
                    },
                    {
                        title: 'Study Details | NCT03411733',
                        url: 'https://clinicaltrials.gov/study/NCT03411733',
                        snippet: 'Official ClinicalTrials.gov study record.'
                    }
                ]
            });
        }
        if (request.args.query === 'nested selector comparison fixture') {
            return mcpBridgeResult('Nested selector comparison results.', {
                results: [
                    {
                        title: 'ARTICLE VI',
                        url: 'https://example.test/article-vi',
                        snippet: 'Rule 611. | Rule 611. Examining Witnesses Rule 612. A Witness Rule 615. Excluding Witnesses'
                    },
                    {
                        title: 'ARTICLE VII',
                        url: 'https://example.test/article-vii',
                        snippet: 'Rule 701. Lay Witnesses Rule 702. Expert Witnesses Rule 706. Court Expert Witnesses'
                    },
                    {
                        title: 'ARTICLE VI mirror',
                        url: 'https://mirror.example.test/article-vi',
                        snippet: 'Rule 601. Competency to Testify'
                    }
                ]
            });
        }
        if (request.args.query === 'nested selector partial fixture') {
            return mcpBridgeResult('Partial nested selector results.', {
                results: [
                    {
                        title: 'ARTICLE VI',
                        url: 'https://example.test/rules/article-vi',
                        snippet: 'ARTICLE VI. WITNESSES Rule 601. A Witness'
                    },
                    {
                        title: 'Rules index',
                        url: 'https://example.test/rules',
                        snippet: 'All rule articles and their titles.'
                    },
                    {
                        title: 'Site home',
                        url: 'https://example.test',
                        snippet: 'General information.'
                    }
                ]
            });
        }
        if (request.args.query === 'nested selector index only fixture') {
            return mcpBridgeResult('Nested selector parent-index results.', {
                results: [
                    {
                        title: 'Rules overview',
                        url: 'https://example.test/rules',
                        snippet: 'Several rule collections.'
                    },
                    {
                        title: 'Evidence rules index',
                        url: 'https://example.test/rules/evidence',
                        snippet: 'ARTICLE I. GENERAL PROVISIONS Rule 101. Scope ARTICLE VI. WITNESSES Rule 601. Competency ARTICLE VII. OPINIONS Rule 701. Opinion Testimony by Lay Witnesses'
                    }
                ]
            });
        }
        if (request.args.query === 'nested selector refinable collection fixture') {
            return mcpBridgeResult('Nested selector collection results.', {
                results: [
                    {
                        title: 'ARTICLE VI',
                        url: 'https://example.test/collections/evidence/article-vi',
                        snippet: 'ARTICLE VI. WITNESSES Rule 601. Competency Rule 611. Examining Witnesses'
                    },
                    {
                        title: 'Collections index',
                        url: 'https://example.test/collections',
                        snippet: 'Choose a collection before comparing its articles.'
                    }
                ]
            });
        }
        return mcpBridgeResult(`Search result for ${request.args.query}`, {
                results: [{
                    title: request.args.query,
                    url: `https://example.test/${encodeURIComponent(request.args.query)}`,
                    snippet: `Evidence for ${request.args.query}`
                }]
            });
    };
    gateway.runtime.mcpManager.listToolSpecs = async () => [
        {
            server: 'ailis_research',
            tool: 'pdf_extract_text',
            name: 'pdf_extract_text',
            description: 'Extract text from a known PDF URL.',
            inputSchema: {
                type: 'object',
                required: ['url'],
                properties: {
                    url: { type: 'string' },
                    maxChars: { type: 'integer' }
                },
                additionalProperties: false
            }
        },
        {
            server: 'ailis_research',
            tool: 'github_repo_read',
            name: 'github_repo_read',
            description: 'Read a public GitHub repository file.',
            inputSchema: {
                type: 'object',
                required: ['repo', 'mode', 'path'],
                properties: {
                    repo: { type: 'string' },
                    mode: { type: 'string' },
                    path: { type: 'string' },
                    ref: { type: 'string' }
                },
                additionalProperties: false
            }
        }
    ];

    try {
        const firstTurnTools = gateway.gatewayToolRuntimeRegistry.modelVisibleSpecs();
        assert.equal(firstTurnTools.some((tool) => tool.name === 'web_run'), false);
        const webRun = gateway.gatewayToolRuntimeRegistry.definition('web_run')?.spec;
        const webRunDescription = (await fs.readFile(
            path.resolve('electron', 'ailis-web-run-description.md'),
            'utf8'
        )).replace(/\r\n/g, '\n').trim();
        assert.ok(webRun);
        assert.equal(webRun.description, webRunDescription);
        assert.match(webRun.description, /exactly one supported operation/i);
        assert.doesNotMatch(webRun.description, /empty query/i);
        assert.doesNotMatch(webRun.description, /image_query|finance|weather|sports/i);
        assert.doesNotMatch(webRun.description, /truncated for model budget/);
        assert.ok(webRun.parameters.properties.search_query);
        assert.equal(
            webRun.parameters.properties.search_query.description,
            'Query the internet search engine for a given list of queries.'
        );
        assert.equal(
            webRun.parameters.properties.search_query.items.properties.q.description,
            'One concise discovery query. Keep only verified discriminative entities and constraints; never concatenate previous queries or inject an unverified intermediate answer/entity inferred from memory.'
        );
        assert.equal(webRun.parameters.properties.search_query.maxItems, 4);
        assert.equal(webRun.parameters.properties.search_query.items.properties.q.minLength, 1);
        assert.equal(webRun.parameters.properties.search_query.items.properties.q.maxLength, 240);
        assert.equal(webRun.parameters.properties.search_query.items.properties.recency.minimum, 1);
        assert.match(webRun.parameters.properties.search_query.items.properties.recency.description, /explicitly asks for recent/i);
        assert.ok(webRun.parameters.properties.open);
        assert.ok(webRun.parameters.properties.find);
        assert.ok(webRun.parameters.properties.screenshot);
        assert.ok(webRun.parameters.properties.archive);
        assert.equal(webRun.parameters.properties.archive.items.properties.scanLimit.maximum, 10000);
        assert.equal(webRun.parameters.properties.find.description, 'Find one text pattern in one page.');
        assert.equal(
            webRun.parameters.properties.find.items.properties.pattern.description,
            'Text pattern to find.'
        );
        assert.equal(webRun.parameters.properties.open.items.properties.lineno.type, 'integer');
        assert.equal(webRun.parameters.properties.response_length.description, 'Set the length of the response to be returned.');
        assert.equal(webRun.parameters.properties.progress_note, undefined);
        assert.equal(webRun.parameters.properties.image_query, undefined);
        assert.equal(
            webRun.parameters.properties.screenshot.description,
            'Capture one browser-rendered screenshot and return it to the main model as visual input. The default primary viewport preserves readable detail; request fullPage only when lower-page context is required.'
        );
        assert.equal(webRun.parameters.properties.screenshot.items.properties.fullPage.type, 'boolean');
        assert.equal(webRun.parameters.properties.screenshot.items.properties.height.maximum, 16000);
        assert.equal(firstTurnTools.some((tool) => tool.name === 'web_search'), false);
        assert.equal(firstTurnTools.some((tool) => tool.name === 'mcp__ailis_research__open_page'), false);

        const emptyResponse = await gateway.callTool({
            tool: 'web_run',
            args: {},
            context: { workspace: workspaceRoot, runId: 'run-empty', sessionId: 'session-1', iteration: 0 }
        });
        assert.equal(emptyResponse.ok, false);
        assert.equal(emptyResponse.status, 'invalid_tool_args');

        const mixedResponse = await gateway.callTool({
            tool: 'web_run',
            args: {
                search_query: [{ q: 'one operation only' }],
                open: [{ ref_id: 'https://example.test' }]
            },
            context: { workspace: workspaceRoot, runId: 'run-mixed', sessionId: 'session-1', iteration: 0 }
        });
        assert.equal(mixedResponse.ok, false);
        assert.equal(mixedResponse.status, 'invalid_tool_args');

        const archiveResponse = await gateway.callTool({
            tool: 'web_run',
            args: {
                archive: [{
                    url: 'https://offline.example/Search/Results?',
                    mode: 'captures',
                    matchType: 'prefix',
                    contains: 'subject 2020'
                }]
            },
            context: { workspace: workspaceRoot, runId: 'run-archive', sessionId: 'session-archive', iteration: 0 }
        });
        assert.equal(archiveResponse.ok, true, JSON.stringify(archiveResponse));
        assert.equal(bridgeRequests.at(-1).tool, 'web_archive_lookup');
        assert.equal(bridgeRequests.at(-1).args.matchType, 'prefix');
        assert.match(archiveResponse.result.content[0].text, /Country: gt/);

        const neutralSearchResponse = await gateway.callTool({
            tool: 'web_run',
            args: {
                search_query: [{ q: 'nested selector comparison fixture' }],
                response_length: 'medium'
            },
            context: {
                workspace: workspaceRoot,
                runId: 'run-neutral-search',
                sessionId: 'session-neutral-search',
                iteration: 0,
                exactAnswerMode: true,
                currentUserMessage: 'Which article has "witnesses" in the most titles?'
            }
        });
        assert.equal(neutralSearchResponse.ok, true, JSON.stringify(neutralSearchResponse));
        const neutralSearch = neutralSearchResponse.result.structuredContent.search;
        assert.ok(Array.isArray(neutralSearch.results));
        assert.equal(Object.hasOwn(neutralSearch, 'selectionAudit'), false);
        assert.equal(Object.hasOwn(neutralSearch, 'selectionProtocol'), false);
        assert.equal(Object.hasOwn(neutralSearch, 'queryAssumptionAudit'), false);
        assert.equal(Object.hasOwn(neutralSearch, 'queryGuidance'), false);
        assert.equal(Object.hasOwn(neutralSearch, 'suggestedNextCalls'), false);

        const neutralOpenResponse = await gateway.callTool({
            tool: 'web_run',
            args: {
                open: [{ ref_id: 'https://example.test/collections/evidence', lineno: 1 }]
            },
            context: {
                workspace: workspaceRoot,
                runId: 'run-neutral-open',
                sessionId: 'session-neutral-open',
                iteration: 1,
                exactAnswerMode: true,
                currentUserMessage: 'Which article has "witnesses" in the most titles?'
            }
        });
        assert.equal(neutralOpenResponse.ok, true, JSON.stringify(neutralOpenResponse));
        assert.match(neutralOpenResponse.result.content[0].text, /opened source/i);
        assert.equal(Object.hasOwn(neutralOpenResponse.result.structuredContent, 'selectionProtocol'), false);
        assert.equal(Object.hasOwn(neutralOpenResponse.result.structuredContent, 'selectionDependencyAdvisory'), false);
        assert.equal(Object.hasOwn(neutralOpenResponse.result.structuredContent, 'suggestedNextCalls'), false);

        const noResultsResponse = await gateway.callTool({
            tool: 'web_run',
            args: {
                search_query: [{
                    q: 'no results fixture',
                    recency: 30,
                    domains: ['example.test']
                }],
                response_length: 'medium'
            },
            context: { workspace: workspaceRoot, runId: 'run-zero', sessionId: 'session-zero', iteration: 0 }
        });
        assert.equal(noResultsResponse.ok, true, JSON.stringify(noResultsResponse));
        assert.equal(noResultsResponse.result.structuredContent.search.status, 'empty');
        assert.match(noResultsResponse.result.content[0].text, /No search results/i);
        assert.equal(noResultsResponse.result.structuredContent.search.suggestedNextCalls, undefined);
        assert.equal(noResultsResponse.result.structuredContent.search.queryGuidance, undefined);
        const bloatedNoResultsResponse = await gateway.callTool({
            tool: 'web_run',
            args: {
                search_query: [{
                    q: `no results fixture ${Array.from({ length: 4 }, () => 'BASE 633 2020 unknown language country flag').join(' ')}`,
                    domains: ['base-search.net']
                }]
            },
            context: { workspace: workspaceRoot, runId: 'run-zero-bloated', sessionId: 'session-zero-bloated', iteration: 0 }
        });
        assert.equal(bloatedNoResultsResponse.ok, true, JSON.stringify(bloatedNoResultsResponse));
        assert.equal(bloatedNoResultsResponse.result.structuredContent.search.suggestedNextCalls, undefined);
        assert.equal(bloatedNoResultsResponse.result.structuredContent.search.queryGuidance, undefined);
        const broadNoResultsResponse = await gateway.callTool({
            tool: 'web_run',
            args: { search_query: [{ q: 'no results fixture' }] },
            context: { workspace: workspaceRoot, runId: 'run-zero-broad', sessionId: 'session-zero-broad', iteration: 0 }
        });
        assert.equal(broadNoResultsResponse.result.structuredContent.search.suggestedNextCalls, undefined);
        const historicalNoResultsResponse = await gateway.callTool({
            tool: 'web_run',
            args: {
                search_query: [{
                    q: 'no results fixture site:base-search.net/Search/Results 2020 DDC'
                }]
            },
            context: {
                workspace: workspaceRoot,
                runId: 'run-zero-historical',
                sessionId: 'session-zero-historical',
                iteration: 0,
                currentUserMessage: 'As of 2022, which country was listed in the public BASE database catalog record?'
            }
        });
        assert.equal(historicalNoResultsResponse.ok, true, JSON.stringify(historicalNoResultsResponse));
        assert.equal(historicalNoResultsResponse.result.structuredContent.search.queryGuidance, undefined);
        assert.equal(historicalNoResultsResponse.result.structuredContent.search.suggestedNextCalls, undefined);
        const failedSearchResponse = await gateway.callTool({
            tool: 'web_run',
            args: { search_query: [{ q: 'bridge validation failure fixture', domains: ['example.test'] }] },
            context: { workspace: workspaceRoot, runId: 'run-search-failed', sessionId: 'session-search-failed', iteration: 0 }
        });
        assert.equal(failedSearchResponse.ok, false, JSON.stringify(failedSearchResponse));
        assert.match(JSON.stringify(failedSearchResponse), /invalid_mcp_tool_args/);
        assert.match(JSON.stringify(failedSearchResponse), /unexpected property: domains/);
        bridgeRequests.length = 0;

        const searchResponse = await gateway.callTool({
            tool: 'web_run',
            args: {
                search_query: [
                    { q: 'Emily Midkiff Fafnir June 2014' },
                    { q: 'site:journal.finfar.org Midkiff dragons fluffy' }
                ],
                response_length: 'medium'
            },
            context: { workspace: workspaceRoot, runId: 'run-1', sessionId: 'session-1', iteration: 0 }
        });

        assert.equal(searchResponse.ok, true, JSON.stringify(searchResponse));
        assert.equal(bridgeRequests.length, 2);
        assert.deepEqual(bridgeRequests.map((request) => request.args.query), [
            'Emily Midkiff Fafnir June 2014',
            'site:journal.finfar.org Midkiff dragons fluffy'
        ]);
        const results = searchResponse.result.structuredContent.search.results;
        assert.deepEqual(results.map((result) => result.ref_id), ['turn0search0', 'turn0search1']);
        assert.equal(searchResponse.result.structuredContent.search.suggestedNextCalls, undefined);
        const partialStartedAt = Date.now();
        const partialSearchResponse = await gateway.executeWebRunSearch({
            search_query: [
                { q: 'fast partial result fixture' },
                { q: 'hanging search fixture' }
            ]
        }, {
            workspace: workspaceRoot,
            runId: 'run-partial',
            sessionId: 'session-partial',
            iteration: 0,
            webRunSearchTimeoutMs: 40
        });
        assert.ok(Date.now() - partialStartedAt < 1000);
        assert.equal(partialSearchResponse.isError, false, JSON.stringify(partialSearchResponse));
        assert.equal(partialSearchResponse.structuredContent.search.status, 'completed');
        assert.equal(partialSearchResponse.structuredContent.search.results.length, 1);
        assert.equal(partialSearchResponse.structuredContent.search.results[0].title, 'fast partial result fixture');
        assert.equal(partialSearchResponse.structuredContent.search.failures.length, 1);
        assert.equal(partialSearchResponse.structuredContent.search.failures[0].status, 'search_timeout');
        const githubSearchResponse = await gateway.callTool({
            tool: 'web_run',
            args: { search_query: [{ q: 'github file fixture' }] },
            context: { workspace: workspaceRoot, runId: 'run-github', sessionId: 'session-github', iteration: 0 }
        });
        assert.equal(githubSearchResponse.ok, true, JSON.stringify(githubSearchResponse));
        assert.equal(githubSearchResponse.result.structuredContent.search.suggestedNextCalls, undefined);
        assert.equal(githubSearchResponse.result.__ailisSuggestedMcpTools, undefined);

        const evaluationSearchResponse = await gateway.callTool({
            tool: 'web_run',
            args: { search_query: [{ q: 'evaluation leak fixture' }] },
            context: {
                workspace: workspaceRoot,
                runId: 'run-evaluation-leak',
                sessionId: 'session-evaluation-leak',
                iteration: 1,
                evaluationName: 'fixture_eval',
                currentUserMessage: 'What was the actual enrollment count of the clinical trial on H. pylori in acne vulgaris patients from Jan-May 2018 as listed on the NIH website?'
            }
        });
        const evaluationSearch = evaluationSearchResponse.result.structuredContent.search;
        assert.equal(evaluationSearch.results.length, 1);
        assert.equal(evaluationSearch.results[0].url, 'https://clinicaltrials.gov/study/NCT03411733');
        assert.equal(evaluationSearch.evaluationLeakAudit, undefined);
        assert.equal(evaluationSearch.suggestedNextCalls, undefined);

        const openResponse = await gateway.callTool({
            tool: 'web_run',
            args: { open: [{ ref_id: 'turn0search0' }] },
            context: {
                workspace: workspaceRoot,
                runId: 'run-1',
                sessionId: 'session-1',
                iteration: 1,
                currentUserMessage: 'Which row has the lowest total count?'
            }
        });
        assert.equal(openResponse.ok, true, JSON.stringify(openResponse));
        assert.equal(bridgeRequests.at(-1).tool, 'render_page');
        assert.equal(bridgeRequests.at(-1).args.url, results[0].url);
        assert.equal(bridgeRequests.at(-1).args.query, 'Which row has the lowest total count?');
        assert.equal(openResponse.result.structuredContent.ref_id, 'turn1view0');
        assert.equal(openResponse.result.structuredContent.source.ref_id, 'turn1view0');
        assert.deepEqual(openResponse.result.structuredContent.observedRelevantLinks.map((link) => link.id), [1]);

        const pdfLandingResponse = await gateway.callTool({
            tool: 'web_run',
            args: { open: [{ ref_id: 'https://example.test/pdf-view' }] },
            context: { workspace: workspaceRoot, runId: 'run-pdf-landing', sessionId: 'session-pdf-landing', iteration: 1 }
        });
        assert.ok(Array.isArray(pdfLandingResponse.result.__ailisSuggestedMcpTools));
        assert.equal(
            pdfLandingResponse.result.__ailisSuggestedMcpTools[0].id,
            'mcp__ailis_research__pdf_extract_text'
        );

        const continueResponse = await gateway.callTool({
            tool: 'web_run',
            args: { open: [{ ref_id: 'turn0search0', lineno: 2 }] },
            context: { workspace: workspaceRoot, runId: 'run-1', sessionId: 'session-1', iteration: 2 }
        });
        assert.equal(continueResponse.ok, true, JSON.stringify(continueResponse));
        assert.equal(bridgeRequests.at(-1).tool, 'render_page');
        assert.equal(bridgeRequests.at(-1).args.url, results[0].url);

        const clickResponse = await gateway.callTool({
            tool: 'web_run',
            args: { click: [{ ref_id: 'turn1view0', id: 1 }] },
            context: { workspace: workspaceRoot, runId: 'run-1', sessionId: 'session-1', iteration: 3 }
        });
        assert.equal(clickResponse.ok, true, JSON.stringify(clickResponse));
        assert.equal(bridgeRequests.at(-1).tool, 'pdf_extract_text');
        assert.equal(bridgeRequests.at(-1).args.url, 'https://example.test/article.pdf');
        assert.equal(clickResponse.result.structuredContent.ref_id, 'turn3view1');
        assert.match(clickResponse.result.structuredContent.sourceWindow.lines[0].text, /fluffy/);

        const directPdfResponse = await gateway.callTool({
            tool: 'web_run',
            args: { open: [{ ref_id: 'https://example.test/direct.pdf' }] },
            context: {
                workspace: workspaceRoot,
                runId: 'run-1',
                sessionId: 'session-1',
                iteration: 4,
                currentUserMessage: 'What is the volume in m3 of the fish transport bag?'
            }
        });
        assert.equal(directPdfResponse.ok, true, JSON.stringify(directPdfResponse));
        assert.deepEqual(bridgeRequests.slice(-2).map((request) => request.tool), [
            'render_page',
            'pdf_extract_text'
        ]);
        assert.equal(bridgeRequests.at(-1).args.url, 'https://example.test/direct.pdf');
        assert.equal(
            bridgeRequests.at(-1).args.query,
            'What is the volume in m3 of the fish transport bag?'
        );
        assert.match(directPdfResponse.result.structuredContent.sourceWindow.lines[0].text, /fluffy/);
        assert.equal(directPdfResponse.result.structuredContent.extractedText, undefined);

        const bridgeRequestCountBeforeCachedFind = bridgeRequests.length;
        const cachedPdfFindResponse = await gateway.callTool({
            tool: 'web_run',
            args: {
                find: [{
                    ref_id: directPdfResponse.result.structuredContent.ref_id,
                    pattern: '0.1777'
                }]
            },
            context: {
                workspace: workspaceRoot,
                runId: 'run-1',
                sessionId: 'session-1',
                iteration: 5
            }
        });
        assert.equal(cachedPdfFindResponse.ok, true, JSON.stringify(cachedPdfFindResponse));
        assert.equal(bridgeRequests.length, bridgeRequestCountBeforeCachedFind);
        assert.equal(cachedPdfFindResponse.result.structuredContent.cached, true);
        assert.match(cachedPdfFindResponse.result.content[0].text, /0\.1777 m3/);

        const screenshotResponse = await gateway.callTool({
            tool: 'web_run',
            args: {
                screenshot: [{
                    ref_id: 'https://example.test/layout',
                    detail: 'original',
                    fullPage: true,
                    width: 1200,
                    height: 2400
                }]
            },
            context: {
                workspace: workspaceRoot,
                runId: 'run-screenshot',
                sessionId: 'session-screenshot',
                iteration: 0,
                currentUserMessage: 'Which stanza contains indented lines?'
            }
        });
        assert.equal(screenshotResponse.ok, true, JSON.stringify(screenshotResponse));
        assert.equal(bridgeRequests.at(-1).tool, 'webpage_screenshot');
        assert.equal(bridgeRequests.at(-1).args.url, 'https://example.test/layout');
        assert.equal(bridgeRequests.at(-1).args.fullPage, true);
        assert.equal(bridgeRequests.at(-1).args.width, 1200);
        assert.equal(bridgeRequests.at(-1).args.height, 2400);
        assert.match(bridgeRequests.at(-1).args.path, /\.ailis-web-screenshots[\\/].+\.png$/);
        assert.equal(
            screenshotResponse.result.structuredContent.modelImage.image_url,
            bridgeRequests.at(-1).args.path
        );

        const sectionOpenResponse = await gateway.callTool({
            tool: 'web_run',
            args: { open: [{ ref_id: 'https://example.test/section-view' }] },
            context: { workspace: workspaceRoot, runId: 'run-section', sessionId: 'session-section', iteration: 0 }
        });
        assert.equal(sectionOpenResponse.ok, true, JSON.stringify(sectionOpenResponse));
        assert.equal(sectionOpenResponse.result.structuredContent.observedRelevantLinks[0].kind, 'section');
        assert.equal(sectionOpenResponse.result.structuredContent.observedRelevantLinks[0].text, 'Studio albums');
        const sectionClickResponse = await gateway.callTool({
            tool: 'web_run',
            args: { click: [{ ref_id: sectionOpenResponse.result.structuredContent.ref_id, id: 1 }] },
            context: { workspace: workspaceRoot, runId: 'run-section', sessionId: 'session-section', iteration: 1 }
        });
        assert.equal(sectionClickResponse.ok, true, JSON.stringify(sectionClickResponse));
        assert.equal(bridgeRequests.at(-1).tool, 'web_find');
        assert.equal(bridgeRequests.at(-1).args.pattern, 'Studio albums');
        assert.match(sectionClickResponse.result.content[0].text, /Find results for pattern: Studio albums/);
    } finally {
        await gateway.stop();
        await fs.rm(workspaceRoot, { recursive: true, force: true });
    }
});

async function jsonFetch(url, options = {}) {
    const response = await fetch(url, {
        ...options,
        headers: {
            'content-type': 'application/json',
            ...(options.headers || {})
        }
    });
    const body = await response.json();
    return { response, body };
}

async function withHttpServer(handler) {
    const server = http.createServer(handler);
    await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
    const address = server.address();
    const baseUrl = `http://127.0.0.1:${address.port}`;
    return {
        baseUrl,
        close: () => new Promise((resolve, reject) => {
            server.close((error) => error ? reject(error) : resolve());
        })
    };
}

function buildSimplePdfWithText(text) {
    const escaped = String(text).replace(/[()\\]/g, '\\$&');
    const stream = `BT /F1 12 Tf 72 720 Td (${escaped}) Tj ET`;
    const objects = [
        '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n',
        '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n',
        '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n',
        '4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n',
        `5 0 obj\n<< /Length ${Buffer.byteLength(stream, 'latin1')} >>\nstream\n${stream}\nendstream\nendobj\n`
    ];
    let body = '%PDF-1.4\n';
    const offsets = [0];
    for (const object of objects) {
        offsets.push(Buffer.byteLength(body, 'latin1'));
        body += object;
    }
    const xrefOffset = Buffer.byteLength(body, 'latin1');
    body += `xref\n0 ${objects.length + 1}\n`;
    body += '0000000000 65535 f \n';
    for (let index = 1; index < offsets.length; index += 1) {
        body += `${String(offsets[index]).padStart(10, '0')} 00000 n \n`;
    }
    body += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;
    return Buffer.from(body, 'latin1');
}

function buildBlankPdfWithoutSelectableText() {
    const objects = [
        '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n',
        '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n',
        '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] >>\nendobj\n'
    ];
    let body = '%PDF-1.4\n';
    const offsets = [0];
    for (const object of objects) {
        offsets.push(Buffer.byteLength(body, 'latin1'));
        body += object;
    }
    const xrefOffset = Buffer.byteLength(body, 'latin1');
    body += `xref\n0 ${objects.length + 1}\n`;
    body += '0000000000 65535 f \n';
    for (let index = 1; index < offsets.length; index += 1) {
        body += `${String(offsets[index]).padStart(10, '0')} 00000 n \n`;
    }
    body += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;
    return Buffer.from(body, 'latin1');
}

test('EMBER-Harness records stage checks around tool execution', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-ember-harness-observe-'));
    const gateway = new AILISGateway({
        port: 0,
        workspaceRoot,
        projectRoot: path.resolve('.'),
        auditDir: path.join(workspaceRoot, '.audit'),
        emberHarnessEnabled: true,
        emberHarnessMode: 'observe',
        emberHarnessEvaluator: async () => ({
            decision: 'allow',
            riskLevel: 'none'
        })
    });
    await fs.writeFile(path.join(workspaceRoot, 'note.txt'), 'safe observation\n', 'utf8');

    try {
        const response = await gateway.callTool({
            tool: 'read',
            args: { path: 'note.txt' },
            context: { workspace: workspaceRoot, runId: 'ember-run-observe', sessionId: 'main' }
        });

        assert.equal(response.ok, true, response.error);
        const records = gateway.emberHarness.listRunRecords('ember-run-observe');
        assert.deepEqual(records.map((record) => record.stage), ['tool_call', 'tool_result']);
        assert.equal(records.every((record) => record.snapshot?.textHash), true);
        assert.equal(records.every((record) => record.blocked === false), true);

        const events = gateway.getEventsAfter(0, 20).filter((event) => event.type === 'ember.harness.check');
        assert.equal(events.length, 2);
        assert.deepEqual(events.map((event) => event.payload.boundary), [
            'tool_call_before_execution',
            'tool_result_enter_context'
        ]);

        const transcript = await gateway.runtime.readTranscript('ember-run-observe', 50);
        assert.equal(transcript.ok, true);
        assert.equal(transcript.items.filter((item) => item.type === 'ember.harness.check').length, 2);
    } finally {
        await gateway.stop();
        await fs.rm(workspaceRoot, { recursive: true, force: true });
    }
});

test('EMBER-Harness can block a tool result before it enters model context', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-ember-harness-block-'));
    const gateway = new AILISGateway({
        port: 0,
        workspaceRoot,
        projectRoot: path.resolve('.'),
        auditDir: path.join(workspaceRoot, '.audit'),
        emberHarnessEnabled: true,
        emberHarnessMode: 'enforce',
        emberHarnessEvaluator: async ({ stage }) => {
            if (stage === 'tool_result') {
                return {
                    decision: 'block',
                    riskLevel: 'high',
                    riskTypes: ['bias_payload'],
                    summary: 'simulated high-risk payload'
                };
            }
            return { decision: 'allow', riskLevel: 'none' };
        }
    });
    await fs.writeFile(path.join(workspaceRoot, 'note.txt'), 'blocked payload should not be echoed\n', 'utf8');

    try {
        const response = await gateway.callTool({
            tool: 'read',
            args: { path: 'note.txt' },
            context: { workspace: workspaceRoot, runId: 'ember-run-block', sessionId: 'main' }
        });

        assert.equal(response.ok, false);
        assert.equal(response.status, 'blocked');
        assert.equal(response.details.emberHarness.stage, 'tool_result');
        assert.equal(response.details.emberHarness.decision, 'block');
        assert.equal(response.details.emberHarness.snapshot.preview, undefined);
        assert.doesNotMatch(JSON.stringify(response), /blocked payload should not be echoed/);

        const records = gateway.emberHarness.listRunRecords('ember-run-block');
        assert.equal(records.length, 2);
        assert.equal(records[0].stage, 'tool_call');
        assert.equal(records[1].stage, 'tool_result');
        assert.equal(records[1].blocked, true);
        assert.equal(records[1].rollbackTo.snapshotId, records[0].snapshot.snapshotId);
    } finally {
        await gateway.stop();
        await fs.rm(workspaceRoot, { recursive: true, force: true });
    }
});

test('AILIS Gateway TaskAgent thread reuses parent LLM settings', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-agent-llm-'));
    const gateway = new AILISGateway({
        port: 0,
        workspaceRoot,
        projectRoot: path.resolve('.'),
        auditDir: path.join(workspaceRoot, '.audit')
    });
    const calls = [];
    gateway.ensureAgentRunner = () => ({
        runMessage: async (request) => {
            calls.push(request);
            return {
                ok: true,
                status: 'completed',
                runId: 'child-run',
                mode: 'task',
                intent: 'direct_tool_final',
                displayText: 'child done',
                durationMs: 1,
                cost: {
                    schema: 'ailis.run_cost.v1',
                    run_id: 'child-run',
                    total: {
                        runs: 1,
                        llm: { calls: 1, duration_ms: 1, usage: { totalTokens: 12 }, by_model: [] },
                        tools: { calls: 0, duration_ms: 0 }
                    }
                },
                steps: [],
                plan: []
            };
        }
    });
    const llmSettings = {
        provider: 'deepseek',
        baseUrl: 'https://api.deepseek.com',
        model: 'deepseek-chat',
        apiKey: 'test-key'
    };

    const result = await gateway.executeTaskAgent({
        agent: {
            id: 'agent-1',
            runId: 'parent-run',
            sessionId: 'parent-session',
            childRunId: 'child-run-request',
            childSessionId: 'child-session',
            label: 'TaskAgent',
            task: 'solve task'
        },
        args: { maxAgentSteps: 7 },
        context: {
            workspace: workspaceRoot,
            sessionId: 'parent-session',
            sessionKey: 'parent-session',
            llmSettings,
            permissionProfile: 'read-only',
            approvalPolicy: 'always',
            approved: false
        }
    });

    assert.equal(result.ok, true);
    assert.equal(calls.length, 1);
    assert.equal(calls[0].runId, 'child-run-request');
    assert.equal(calls[0].agentRole, 'task_agent');
    assert.deepEqual(calls[0].messageHistory, []);
    assert.equal(calls[0].context.cleanContext, true);
    assert.equal(calls[0].context.contextMode, 'task_agent');
    assert.equal(Object.hasOwn(calls[0], 'maxAgentSteps'), false);
    assert.equal(Object.hasOwn(calls[0].context, 'maxAgentSteps'), false);
    assert.deepEqual(calls[0].llmSettings, llmSettings);
    assert.deepEqual(calls[0].context.llmSettings, llmSettings);
    assert.equal(calls[0].context.taskAgentPermissionMode, 'unrestricted');
    assert.equal(calls[0].context.permissionProfile, 'danger-full-access');
    assert.equal(calls[0].context.approvalPolicy, 'never');
    assert.equal(calls[0].context.confirmationPolicy, 'never');
    assert.equal(calls[0].context.approved, true);
    assert.equal(calls[0].context.autoConfirm, false);
    assert.equal(calls[0].context.requireApprovalForMutations, false);
    assert.equal(calls[0].context.allowSystemMutation, true);
    assert.equal(result.cost.schema, 'ailis.run_cost.v1');
    assert.equal(result.cost.total.llm.usage.totalTokens, 12);
});

test('AILIS Gateway persists Persona as an append-only checkpoint across turns and restart', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-persona-checkpoint-'));
    const auditDir = path.join(workspaceRoot, '.audit');
    const runnerCalls = [];
    const installRunner = (gateway) => {
        gateway.ensureAgentRunner = () => ({
            runMessage: async (request) => {
                runnerCalls.push(request);
                const items = request.initialContextManagerCheckpoint
                    ? structuredClone(request.initialContextManagerCheckpoint.items)
                    : [{
                          type: 'message',
                          role: 'developer',
                          content: [{ type: 'input_text', text: 'Persona memory' }]
                      }];
                const lastItem = items.at(-1);
                const lastText = lastItem?.content?.[0]?.text || '';
                if (!(lastItem?.role === 'user' && lastText === request.message)) {
                    items.push({
                        type: 'message',
                        role: 'user',
                        content: [{ type: 'input_text', text: request.message }]
                    });
                }
                const inputCheckpoint = { history_version: items.length, items: structuredClone(items) };
                await request.onModelInputContextCheckpoint?.(inputCheckpoint, {
                    phase: 'before_first_model_decision'
                });
                const displayText = `回复：${request.message}`;
                items.push({
                    type: 'message',
                    role: 'assistant',
                    content: [{ type: 'output_text', text: displayText }]
                });
                return {
                    ok: true,
                    status: 'completed',
                    displayText,
                    taskRunHandoff: {
                        resume: {
                            contextManagerCheckpoint: { history_version: items.length, items }
                        }
                    }
                };
            },
            recordMemoryTurn: () => {}
        });
    };

    try {
        const firstGateway = new AILISGateway({
            port: 0,
            workspaceRoot,
            projectRoot: path.resolve('.'),
            auditDir,
            emberHarnessEnabled: false,
            profileCurationEnabled: false
        });
        installRunner(firstGateway);
        const first = await firstGateway.runPrivatePersonaTurn({
            input: { message: '第一轮' },
            sessionId: 'persona-session'
        });
        firstGateway.commitPrivatePersonaResult('persona-session', first, first.displayText);

        const second = await firstGateway.runPrivatePersonaTurn({
            input: { message: '第二轮' },
            sessionId: 'persona-session'
        });
        assert.deepEqual(
            runnerCalls[1].initialContextManagerCheckpoint.items.map((item) => ({
                role: item.role,
                text: item.content?.[0]?.text || ''
            })),
            [
                { role: 'developer', text: 'Persona memory' },
                { role: 'user', text: '第一轮' },
                { role: 'assistant', text: '回复：第一轮' }
            ]
        );
        firstGateway.commitPrivatePersonaResult('persona-session', second, second.displayText);

        const restartedGateway = new AILISGateway({
            port: 0,
            workspaceRoot,
            projectRoot: path.resolve('.'),
            auditDir,
            emberHarnessEnabled: false,
            profileCurationEnabled: false
        });
        installRunner(restartedGateway);
        await restartedGateway.runPrivatePersonaTurn({
            input: { message: '第三轮' },
            sessionId: 'persona-session'
        });
        const restoredItems = runnerCalls[2].initialContextManagerCheckpoint.items;
        assert.deepEqual(
            restoredItems.filter((item) => item.role === 'user').map((item) => item.content[0].text),
            ['第一轮', '第二轮']
        );
        assert.deepEqual(
            restoredItems.filter((item) => item.role === 'assistant').map((item) => item.content[0].text),
            ['回复：第一轮', '回复：第二轮']
        );
    } finally {
        await fs.rm(workspaceRoot, { recursive: true, force: true });
    }
});

test('AILIS Gateway exposes health, tools, guarded tool calls, and audit', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-gateway-test-'));
    const gateway = new AILISGateway({
        port: 0,
        workspaceRoot,
        projectRoot: path.resolve('.'),
        auditDir: path.join(workspaceRoot, '.audit')
    });

    try {
        const status = await gateway.start();
        assert.equal(status.running, true);
        const baseUrl = status.url;

        const health = await jsonFetch(`${baseUrl}/health`);
        assert.equal(health.response.status, 200);
        assert.equal(health.body.ok, true);
        assert.equal(health.body.status.running, true);

        const tools = await jsonFetch(`${baseUrl}/tools`);
        assert.equal(tools.body.ok, true);
        assert.ok(tools.body.coreTools.some((tool) => tool.id === 'read'));
        assert.ok(tools.body.coreTools.some((tool) => tool.id === 'exec' && tool.needsApproval));
        assert.ok(tools.body.runtimeTools.some((tool) => tool.id === 'tool_search' && tool.spec));
        assert.ok(tools.body.runtimeTools.some((tool) =>
            tool.id === 'spawn_agent' &&
            tool.spec?.parameters?.required?.includes('task_name') &&
            tool.spec?.parameters?.additionalProperties === false
        ));
        assert.ok(tools.body.localTools.some((tool) => tool.id === 'computer' && tool.spec));
        assert.equal(tools.body.localTools.some((tool) => tool.id === 'read'), false);
        assert.equal(tools.body.gateway.toolRuntime.model, 'ailis_gateway_tool_registry.v1');

        const searchTools = await jsonFetch(`${baseUrl}/tools/call`, {
            method: 'POST',
            body: JSON.stringify({
                tool: 'tool_search',
                args: { query: 'subagent task', limit: 5 },
                context: { workspace: workspaceRoot }
            })
        });
        assert.equal(searchTools.body.ok, true, searchTools.body.error);
        assert.ok(searchTools.body.result.details.tools.length > 0);
        assert.doesNotMatch(JSON.stringify(searchTools.body.result), /"id":"subagents"/);
        assert.equal(Object.hasOwn(searchTools.body.result.details, 'discovery'), false);
        assert.equal(Object.hasOwn(searchTools.body.result.details, 'searched_web'), false);
        assert.equal(Object.hasOwn(searchTools.body.result.details, 'note'), false);

        const write = await jsonFetch(`${baseUrl}/tools/call`, {
            method: 'POST',
            body: JSON.stringify({
                tool: 'write',
                args: { path: 'note.txt', content: 'hello gateway\n' },
                context: { workspace: workspaceRoot }
            })
        });
        assert.equal(write.body.ok, true, write.body.error);
        assert.equal(write.body.status, 'completed');

        const read = await jsonFetch(`${baseUrl}/tools/call`, {
            method: 'POST',
            body: JSON.stringify({
                tool: 'read',
                args: { path: 'note.txt' },
                context: { workspace: workspaceRoot }
            })
        });
        assert.equal(read.body.ok, true, read.body.error);
        assert.match(JSON.stringify(read.body.result), /hello gateway/);

        const blocked = await jsonFetch(`${baseUrl}/tools/call`, {
            method: 'POST',
            body: JSON.stringify({
                tool: 'read',
                args: { path: '../outside.txt' },
                context: { workspace: workspaceRoot }
            })
        });
        assert.equal(blocked.body.ok, false);
        assert.equal(blocked.body.status, 'blocked');

        const approval = await jsonFetch(`${baseUrl}/tools/call`, {
            method: 'POST',
            body: JSON.stringify({
                tool: 'exec',
                args: { command: 'node -e "console.log(1)"' },
                context: { workspace: workspaceRoot }
            })
        });
        assert.equal(approval.body.ok, false);
        assert.equal(approval.body.status, 'needs_approval');

        const exec = await jsonFetch(`${baseUrl}/tools/call`, {
            method: 'POST',
            body: JSON.stringify({
                tool: 'exec',
                args: { command: 'node -e "console.log(\'GATEWAY_EXEC_OK\')"', timeout: 8 },
                context: { workspace: workspaceRoot, approved: true }
            })
        });
        assert.equal(exec.body.ok, true, exec.body.error);
        assert.match(JSON.stringify(exec.body.result), /GATEWAY_EXEC_OK/);

        const execWithArgs = await jsonFetch(`${baseUrl}/tools/call`, {
            method: 'POST',
            body: JSON.stringify({
                tool: 'exec',
                args: {
                    command: process.execPath,
                    args: ['-e', "console.log('GATEWAY_EXEC_ARGS_OK')"],
                    timeout: 8
                },
                context: { workspace: workspaceRoot, approved: true }
            })
        });
        assert.equal(execWithArgs.body.ok, true, execWithArgs.body.error);
        assert.match(execWithArgs.body.result.details.stdout, /GATEWAY_EXEC_ARGS_OK/);

        if (process.platform === 'win32') {
            const recoveredPowerShellWrapper = await jsonFetch(`${baseUrl}/tools/call`, {
                method: 'POST',
                body: JSON.stringify({
                    tool: 'exec',
                    args: {
                        command: "Write-Output 'GATEWAY_EXEC_WRAPPER_RECOVERED'",
                        args: ['powershell', '-NoProfile', '-Command'],
                        timeout: 8
                    },
                    context: { workspace: workspaceRoot, approved: true }
                })
            });
            assert.equal(recoveredPowerShellWrapper.body.ok, true, recoveredPowerShellWrapper.body.error);
            assert.match(recoveredPowerShellWrapper.body.result.details.stdout, /GATEWAY_EXEC_WRAPPER_RECOVERED/);
        }

        const longExec = await jsonFetch(`${baseUrl}/tools/call`, {
            method: 'POST',
            body: JSON.stringify({
                tool: 'exec',
                args: {
                    command: process.execPath,
                    args: [
                        '-e',
                        [
                            "console.log('STORE_START')",
                            "for (let i = 0; i < 220; i += 1) console.log('STORE_LINE_' + i + ':' + 'x'.repeat(48))",
                            "console.log('STORE_NEEDLE_FINAL')"
                        ].join(';')
                    ],
                    timeout: 8,
                    maxOutputBytes: 1200
                },
                context: { workspace: workspaceRoot, approved: true }
            })
        });
        assert.equal(longExec.body.ok, true, longExec.body.error);
        const outputStore = longExec.body.result.details.outputStore;
        assert.ok(outputStore?.outputId);
        assert.equal(outputStore.previewTruncated, true);
        assert.ok(outputStore.bytes > 1200);
        const logStat = await fs.stat(outputStore.path);
        assert.equal(logStat.size, outputStore.bytes);
        assert.match(longExec.body.result.content[0].text, /fullOutput=stored_for_agent_lab/);
        assert.match(longExec.body.result.content[0].text, /tool_search query "exec output outputId search tail read"/);
        assert.match(longExec.body.result.content[0].text, /output_search\/output_tail\/output_read/);

        const outputSearch = await jsonFetch(`${baseUrl}/tools/call`, {
            method: 'POST',
            body: JSON.stringify({
                tool: 'output_search',
                args: { outputId: outputStore.outputId, query: 'STORE_NEEDLE_FINAL', contextLines: 0 },
                context: { workspace: workspaceRoot }
            })
        });
        assert.equal(outputSearch.body.ok, true, outputSearch.body.error);
        assert.equal(outputSearch.body.result.details.matchCount, 1);

        const outputTail = await jsonFetch(`${baseUrl}/tools/call`, {
            method: 'POST',
            body: JSON.stringify({
                tool: 'output_tail',
                args: { outputId: outputStore.outputId, lines: 3 },
                context: { workspace: workspaceRoot }
            })
        });
        assert.equal(outputTail.body.ok, true, outputTail.body.error);
        assert.match(outputTail.body.result.content[0].text, /STORE_NEEDLE_FINAL/);

        const outputRead = await jsonFetch(`${baseUrl}/tools/call`, {
            method: 'POST',
            body: JSON.stringify({
                tool: 'output_read',
                args: { outputId: outputStore.outputId, offset: 0, limit: 128 },
                context: { workspace: workspaceRoot }
            })
        });
        assert.equal(outputRead.body.ok, true, outputRead.body.error);
        assert.match(outputRead.body.result.content[0].text, /STORE_START/);
        assert.equal(outputRead.body.result.details.hasMore, true);

        const wrongOutputReadSurface = await jsonFetch(`${baseUrl}/tools/call`, {
            method: 'POST',
            body: JSON.stringify({
                tool: 'computer',
                args: { action: 'read', outputId: outputStore.outputId },
                context: { workspace: workspaceRoot }
            })
        });
        assert.equal(wrongOutputReadSurface.body.ok, false);
        assert.equal(wrongOutputReadSurface.body.status, 'wrong_tool_surface');
        assert.equal(wrongOutputReadSurface.body.result.details.defaultSurface, 'deferred_output_store_tools');
        assert.match(wrongOutputReadSurface.body.result.details.recovery, /tool_search/);

        const audit = await jsonFetch(`${baseUrl}/audit?limit=10`);
        assert.equal(audit.body.ok, true);
        assert.ok(audit.body.entries.length >= 4);
    } finally {
        await gateway.stop();
    }
});

test('AILIS Gateway default context can enable full computer control', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-full-control-test-'));
    const outsideRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-full-control-outside-'));
    const gateway = new AILISGateway({
        port: 0,
        workspaceRoot,
        projectRoot: path.resolve('.'),
        auditDir: path.join(workspaceRoot, '.audit'),
        defaultContext: {
            computerControlEnabled: true,
            permissionProfile: 'danger-full-access',
            approvalPolicy: 'auto',
            confirmationPolicy: 'auto',
            approved: true,
            autoConfirm: true,
            allowComputerWideAccess: true,
            allowSystemMutation: true
        }
    });

    try {
        const status = await gateway.start();
        assert.equal(status.defaultContext.computerControlEnabled, true);
        assert.equal(status.defaultContext.permissionProfile, 'danger-full-access');
        const baseUrl = status.url;

        const write = await jsonFetch(`${baseUrl}/tools/call`, {
            method: 'POST',
            body: JSON.stringify({
                tool: 'computer',
                args: { action: 'write', path: 'full-control.txt', content: 'enabled\n' },
                context: { workspace: workspaceRoot }
            })
        });
        assert.equal(write.body.ok, true, write.body.error);
        assert.equal(write.body.status, 'completed');

        const exec = await jsonFetch(`${baseUrl}/tools/call`, {
            method: 'POST',
            body: JSON.stringify({
                tool: 'exec',
                args: { command: 'node -e "console.log(\'FULL_CONTROL_EXEC_OK\')"', timeout: 8 },
                context: { workspace: workspaceRoot }
            })
        });
        assert.equal(exec.body.ok, true, exec.body.error);
        assert.match(JSON.stringify(exec.body.result), /FULL_CONTROL_EXEC_OK/);

        const outsideExec = await jsonFetch(`${baseUrl}/tools/call`, {
            method: 'POST',
            body: JSON.stringify({
                tool: 'exec',
                args: {
                    command: process.execPath,
                    args: ['-e', "console.log('OUTSIDE_WORKDIR:' + process.cwd())"],
                    workdir: outsideRoot,
                    timeout: 8
                },
                context: { workspace: workspaceRoot }
            })
        });
        assert.equal(outsideExec.body.ok, true, outsideExec.body.error);
        assert.match(outsideExec.body.result.details.stdout, /OUTSIDE_WORKDIR:/);
        assert.equal(path.resolve(outsideExec.body.result.details.workdir), path.resolve(outsideRoot));

        if (process.platform === 'win32') {
            const protectedWorkdir = path.join(process.env.WINDIR || 'C:\\Windows', 'System32');
            const protectedExec = await jsonFetch(`${baseUrl}/tools/call`, {
                method: 'POST',
                body: JSON.stringify({
                    tool: 'exec',
                    args: {
                        command: process.execPath,
                        args: ['-e', "console.log('SHOULD_NOT_RUN')"],
                        workdir: protectedWorkdir,
                        timeout: 8
                    },
                    context: { workspace: workspaceRoot }
                })
            });
            assert.equal(protectedExec.body.ok, false);
            assert.equal(protectedExec.body.status, 'blocked');
            assert.match(protectedExec.body.error, /protected C drive system files/);
        }

        const readBack = await fs.readFile(path.join(workspaceRoot, 'full-control.txt'), 'utf8');
        assert.match(readBack, /enabled/);
    } finally {
        await gateway.stop();
        await fs.rm(outsideRoot, { recursive: true, force: true });
    }
});

test('AILIS Gateway tool_search surfaces and executes external virtual direct tools', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-external-direct-test-'));
    const api = await withHttpServer((req, res) => {
        const url = new URL(req.url, 'http://127.0.0.1');
        res.setHeader('content-type', 'application/json');
        res.end(JSON.stringify({
            pathname: url.pathname,
            actualEnrollment: 90
        }));
    });
    const gateway = new AILISGateway({
        port: 0,
        workspaceRoot,
        projectRoot: path.resolve('.'),
        auditDir: path.join(workspaceRoot, '.audit')
    });

    try {
        const status = await gateway.start();
        const baseUrl = status.url;
        await gateway.runtime.capabilityManager.bulkExposeExternalTools({
            includeMcpRegistry: false,
            includeInstalledMcp: false,
            trustCallable: true,
            enableOpenApiAdapter: true,
            sourceName: 'clinicaltrials',
            openapiOperations: [
                {
                    operationId: 'clinicalTrialsGetStudy',
                    method: 'get',
                    path: '/api/v2/studies/{nctId}',
                    baseUrl: api.baseUrl,
                    summary: 'Get ClinicalTrials.gov enrollment by NCT id.',
                    parameters: [
                        { name: 'nctId', in: 'path', required: true, schema: { type: 'string' }, description: 'NCT id.' }
                    ],
                    whenToUse: ['Use for structured ClinicalTrials.gov enrollment lookup.'],
                    whenNotToUse: ['Do not use for broad web search.'],
                    preconditions: ['NCT id is known.'],
                    examples: [{ nctId: 'NCT03411733' }],
                    badExamples: [{}],
                    alternatives: ['Use web_fetch if API is unavailable.'],
                    errors: { not_found: { recoverable: false } },
                    permissions: ['clinicaltrials.read']
                }
            ]
        });

        const search = await jsonFetch(`${baseUrl}/tools/call`, {
            method: 'POST',
            body: JSON.stringify({
                tool: 'tool_search',
                args: { query: 'ClinicalTrials enrollment NCT API', limit: 5 },
                context: { workspace: workspaceRoot }
            })
        });
        assert.equal(search.body.ok, true, search.body.error);
        assert.match(JSON.stringify(search.body.result), /external__clinicaltrials__get_study/);

        const direct = await jsonFetch(`${baseUrl}/tools/call`, {
            method: 'POST',
            body: JSON.stringify({
                tool: 'external__clinicaltrials__get_study',
                args: { nctId: 'NCT03411733' },
                context: { workspace: workspaceRoot }
            })
        });
        assert.equal(direct.body.ok, true, direct.body.error);
        assert.equal(direct.body.status, 'completed');
        assert.match(JSON.stringify(direct.body.result), /actualEnrollment/);
        assert.match(JSON.stringify(direct.body.result), /90/);
    } finally {
        await gateway.stop();
        await api.close();
    }
});

test('AILIS Gateway tool_search ranks strict MCP readers before broad web_search', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-tool-routing-test-'));
    const gateway = new AILISGateway({
        port: 0,
        workspaceRoot,
        projectRoot: path.resolve('.'),
        auditDir: path.join(workspaceRoot, '.audit')
    });
    const mcpTool = (name, description = '') => ({
        id: `mcp__ailis_research__${name}`,
        type: 'mcp_tool',
        server: 'ailis_research',
        tool: name,
        name: `mcp__ailis_research__${name}`,
        description,
        inputSchema: {
            type: 'object',
            required: ['path'],
            additionalProperties: false,
            properties: {
                path: { type: 'string' },
                query: { type: 'string' },
                title: { type: 'string' }
            }
        },
        schemaProperties: ['path', 'query', 'title'],
        callPattern: {
            args: { path: '<path>' }
        }
    });

    try {
        let latestMcpRetrievalLimit = 0;
        gateway.runtime.mcpManager.searchToolSpecs = async ({ limit = 0 } = {}) => {
            latestMcpRetrievalLimit = limit;
            return [
                mcpTool('web_search', 'Fallback broad public web search.'),
                mcpTool('read_presentation', 'Read PowerPoint PPTX slides.'),
                mcpTool('read_document', 'Read Word DOCX documents with paragraphs and tables.'),
                mcpTool('read_spreadsheet', 'Read XLSX spreadsheets values.'),
                mcpTool('youtube_transcript', 'Read YouTube video transcripts.'),
                mcpTool('web_archive_lookup', 'Recover historical database, catalog, academic-index, and search-engine result records when a live site, API, or OAI endpoint is unavailable. Use for archived records filtered by classification codes such as DDC, year, language, document type, country, or flags.')
            ];
        };

        const result = await gateway.executeGatewayToolSearch({
            query: 'attached pptx PowerPoint slides evidence web search',
            includeExternal: false,
            limit: 1
        });

        assert.equal(result.details.tools.length, 1);
        assert.equal(Object.hasOwn(result.details, 'discovery'), false);
        assert.equal(Object.hasOwn(result.details, 'searched_content'), false);
        assert.equal(result.details.tools[0].id, 'mcp__ailis_research__read_presentation');
        assert.equal(result.details.tools[0].callable, true);
        assert.equal(result.details.tools[0].availability, 'available');
        assert.equal(result.details.recommended_tool.id, result.details.tools[0].id);
        assert.equal(result.details.recommended_tool.callable, true);
        assert.doesNotMatch(result.details.routing_advice, /artifact_tools/);

        const docxResult = await gateway.executeGatewayToolSearch({
            query: 'DOCX word document extract text content',
            includeExternal: false,
            limit: 1
        });

        assert.equal(docxResult.details.tools.length, 1);
        assert.equal(docxResult.details.tools[0].id, 'mcp__ailis_research__read_document');
        assert.equal(docxResult.details.recommended_tool.id, docxResult.details.tools[0].id);
        assert.notEqual(docxResult.details.tools[0].id, 'artifact_verifier');
        assert.doesNotMatch(docxResult.details.routing_advice, /artifact_tools/);

        const xlsxResult = await gateway.executeGatewayToolSearch({
            query: 'attached xlsx spreadsheet cell colors fill formulas merged map',
            includeExternal: false,
            limit: 3
        });

        assert.equal(xlsxResult.details.tools[0].id, 'mcp__ailis_research__read_spreadsheet');
        assert.equal(xlsxResult.details.tools.some((tool) => tool.id === 'read_xlsx_workbook'), false);
        assert.doesNotMatch(xlsxResult.details.routing_advice, /artifact_tools/);

        const archiveResult = await gateway.executeGatewayToolSearch({
            query: 'Academic Search Engine API OAI search records DDC 633 year 2020 language unknown country flag',
            includeExternal: false,
            limit: 5
        });

        assert.equal(archiveResult.details.tools[0].id, 'mcp__ailis_research__web_archive_lookup');
        assert.ok(latestMcpRetrievalLimit > 5);

        const artifactQueryResult = await gateway.executeGatewayToolSearch({
            query: 'artifact_query artifactId fullJsonPath payload range grid search',
            includeExternal: false,
            includeMcp: false,
            limit: 3
        });

        assert.equal(artifactQueryResult.details.tools.some((tool) => tool.id === 'artifact_query'), true);
        assert.equal(artifactQueryResult.details.tools.find((tool) => tool.id === 'artifact_query').spec, undefined);

        const artifactImportResult = await gateway.executeGatewayToolSearch({
            query: 'artifact_import ragflow lite table parser import local file chunks',
            includeExternal: false,
            includeMcp: false,
            limit: 5
        });

        assert.equal(artifactImportResult.details.tools.some((tool) => tool.id === 'artifact_import'), true);
        assert.equal(artifactImportResult.details.tools.find((tool) => tool.id === 'artifact_import').spec, undefined);
    } finally {
        await gateway.stop();
        await fs.rm(workspaceRoot, { recursive: true, force: true });
    }
});

test('AILIS Gateway registers built-in AILIS research MCP for web search and direct fetch', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-builtin-research-mcp-'));
    const gateway = new AILISGateway({
        port: 0,
        workspaceRoot,
        projectRoot: path.resolve('.'),
        auditDir: path.join(workspaceRoot, '.audit')
    });
    const page = await withHttpServer((_request, response) => {
        response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
        response.end('<html><body><h1>AILIS direct fetch smoke page</h1></body></html>');
    });

    try {
        const servers = gateway.runtime.mcpManager.listServers();
        assert.ok(servers.some((server) => server.name === 'ailis_research'));

        const search = await gateway.executeGatewayToolSearch({
            query: 'web search',
            includeExternal: false,
            limit: 10,
            timeoutMs: 30000
        });
        assert.ok(
            search.details.tools.some((tool) => tool.id === 'mcp__ailis_research__web_search'),
            JSON.stringify(search.details)
        );

        const fetched = await gateway.runtime.executeTool(
            'mcp__ailis_research__web_fetch',
            { url: page.baseUrl, maxLines: 80 },
            { runId: 'builtin-research-mcp-run', workspace: workspaceRoot, timeoutMs: 30000 }
        );
        assert.equal(fetched.details.status, 'completed', JSON.stringify(fetched));
        assert.match(fetched.content[0].text, /AILIS direct fetch smoke page/);
    } finally {
        await page.close();
        await gateway.stop();
        await fs.rm(workspaceRoot, { recursive: true, force: true });
    }
});

test('AILIS Gateway exposes context artifact query and guards raw payload reads', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-context-artifact-test-'));
    const gateway = new AILISGateway({
        port: 0,
        workspaceRoot,
        projectRoot: path.resolve('.'),
        auditDir: path.join(workspaceRoot, '.audit')
    });

    try {
        const status = await gateway.start();
        const baseUrl = status.url;
        const artifactRecord = await gateway.runtime.contextArtifactStore.createArtifact({
            kind: 'spreadsheet',
            type: 'test_spreadsheet',
            tool: 'test_fixture',
            runId: 'artifact-run-1',
            sessionId: 'artifact-session-1',
            sourcePath: path.join(workspaceRoot, 'map-fixture.xlsx'),
            summary: 'Test spreadsheet map fixture',
            payload: {
                workbook: {
                    sheets: [{
                        name: 'Map',
                        dimensions: {
                            inspectedRange: 'A1:C2',
                            rowCount: 2,
                            columnCount: 3
                        },
                        grids: {
                            display: [
                                ['START', '', ''],
                                ['', '', 'END']
                            ],
                            fills: [
                                ['', '0099FF', ''],
                                ['', '', '']
                            ],
                            rowNumbers: [1, 2],
                            columns: ['A', 'B', 'C']
                        },
                        cells: [
                            { address: 'A1', value: 'START', text: 'START' },
                            { address: 'B1', value: '', text: '', fill: { fgRgb: '0099FF' } },
                            { address: 'C2', value: 'END', text: 'END' }
                        ],
                        nonEmptyCells: [
                            { address: 'A1', value: 'START', fill: '' },
                            { address: 'B1', value: '', fill: '0099FF' },
                            { address: 'C2', value: 'END', fill: '' }
                        ],
                        colorLegend: [{ rgb: '0099FF', count: 1 }],
                        formulas: [],
                        mergedRanges: [],
                        completeness: { allRequestedCellsIncluded: true }
                    }]
                }
            },
            queryHints: ['summary', 'grid', 'range', 'search']
        });
        const artifactId = artifactRecord.id;
        assert.ok(artifactId);
        assert.ok(gateway.eventLog.some((event) =>
            event.type === 'context_artifact.created' &&
            event.payload?.artifactId === artifactId &&
            event.payload?.runId === 'artifact-run-1'
        ));

        const query = await jsonFetch(`${baseUrl}/tools/call`, {
            method: 'POST',
            body: JSON.stringify({
                tool: 'artifact_query',
                args: {
                    action: 'range',
                    artifactId,
                    sheet: 'Map',
                    range: 'A1:C2'
                },
                context: { workspace: workspaceRoot }
            })
        });
        assert.equal(query.body.ok, true, query.body.error);
        assert.match(query.body.result.content[0].text, /START/);
        assert.match(query.body.result.content[0].text, /0099FF/);

        const compute = await jsonFetch(`${baseUrl}/tools/call`, {
            method: 'POST',
            body: JSON.stringify({
                tool: 'artifact_compute',
                args: {
                    action: 'find_path',
                    artifactId,
                    sheet: 'Map',
                    startValue: 'START',
                    endValue: 'END',
                    blockedFills: ['0099FF']
                },
                context: { workspace: workspaceRoot }
            })
        });
        assert.equal(compute.body.ok, true, compute.body.error);
        assert.match(compute.body.result.content[0].text, /ARTIFACT_COMPUTE_FIND_PATH/);
        assert.equal(compute.body.result.details.result.pathFound, true);

        const storedRecord = await gateway.runtime.contextArtifactStore.getRecord(artifactId);
        assert.ok(storedRecord.payloadPath);
        const rawRead = await jsonFetch(`${baseUrl}/tools/call`, {
            method: 'POST',
            body: JSON.stringify({
                tool: 'read',
                args: { path: storedRecord.payloadPath },
                context: { workspace: workspaceRoot }
            })
        });
        assert.equal(rawRead.body.ok, false);
        assert.equal(rawRead.body.status, 'blocked');
        assert.equal(rawRead.body.result.details.code, 'context_artifact_raw_read_blocked');
        assert.equal(rawRead.body.result.details.suggestedNext.tool, 'artifact_query');
    } finally {
        await gateway.stop();
        await fs.rm(workspaceRoot, { recursive: true, force: true });
    }
});

test('AILIS Gateway imports RAGFlow-lite worker output into queryable artifacts', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-artifact-import-gateway-'));
    const gateway = new AILISGateway({
        port: 0,
        workspaceRoot,
        projectRoot: path.resolve('.'),
        auditDir: path.join(workspaceRoot, '.audit')
    });
    const workbookPath = path.join(workspaceRoot, 'inventory.xlsx');

    try {
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Inventory');
        sheet.addRow(['Product', 'Color', 'Stock']);
        sheet.addRow(['Widget', 'Red', 12]);
        sheet.addRow(['Gadget', 'Blue', 5]);
        await workbook.xlsx.writeFile(workbookPath);

        const status = await gateway.start();
        const baseUrl = status.url;

        const imported = await jsonFetch(`${baseUrl}/tools/call`, {
            method: 'POST',
            body: JSON.stringify({
                tool: 'artifact_import',
                args: {
                    path: workbookPath,
                    parserId: 'table',
                    language: 'English'
                },
                context: { workspace: workspaceRoot, runId: 'artifact-import-run-1', sessionId: 'artifact-import-session-1' }
            })
        });
        const importError = imported.body.error
            || imported.body.result?.details?.message
            || imported.body.result?.details?.stderr
            || JSON.stringify(imported.body.result?.details || imported.body);
        assert.equal(imported.body.ok, true, importError);
        assert.match(imported.body.result.content[0].text, /ARTIFACT_IMPORT_COMPLETE/);
        assert.ok(imported.body.result.details.artifactId);
        assert.ok(imported.body.result.details.chunkCount >= 2);

        const search = await jsonFetch(`${baseUrl}/tools/call`, {
            method: 'POST',
            body: JSON.stringify({
                tool: 'artifact_query',
                args: {
                    action: 'chunk_search',
                    artifactId: imported.body.result.details.artifactId,
                    query: 'Widget',
                    limit: 5
                },
                context: { workspace: workspaceRoot }
            })
        });
        assert.equal(search.body.ok, true, search.body.error);
        assert.match(search.body.result.content[0].text, /ARTIFACT_CHUNK_SEARCH/);
        assert.match(search.body.result.content[0].text, /Widget/);
    } finally {
        await gateway.stop();
        await fs.rm(workspaceRoot, { recursive: true, force: true });
    }
});

test('AILIS Gateway turns large text and parsed documents into queryable artifacts', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-text-artifact-test-'));
    const gateway = new AILISGateway({
        port: 0,
        workspaceRoot,
        projectRoot: path.resolve('.'),
        auditDir: path.join(workspaceRoot, '.audit')
    });

    try {
        const largeLog = Array.from({ length: 420 }, (_, index) =>
            `LOG_LINE_${index + 1}: ${index === 317 ? 'NEEDLE_BIG_TEXT_ARTIFACT' : 'ordinary line'} ${'x'.repeat(80)}`
        ).join('\n');
        await fs.writeFile(path.join(workspaceRoot, 'large.log'), largeLog, 'utf8');
        await fs.writeFile(
            path.join(workspaceRoot, 'paper.pdf'),
            buildSimplePdfWithText('PDF artifact evidence includes AWARD-42 and document search should find it.')
        );
        await fs.writeFile(
            path.join(workspaceRoot, 'scan.pdf'),
            buildBlankPdfWithoutSelectableText()
        );

        const status = await gateway.start();
        const baseUrl = status.url;

        const readLog = await jsonFetch(`${baseUrl}/tools/call`, {
            method: 'POST',
            body: JSON.stringify({
                tool: 'computer',
                args: { action: 'read', path: 'large.log', maxBytes: 1024 },
                context: { workspace: workspaceRoot }
            })
        });
        assert.equal(readLog.body.ok, true, readLog.body.error);
        assert.match(readLog.body.result.content[0].text, /TEXT_ARTIFACT_CREATED/);
        const textArtifactId = readLog.body.result.details.artifactId;
        assert.ok(textArtifactId);
        assert.doesNotMatch(readLog.body.result.content[0].text, /LOG_LINE_420/);

        const textSearch = await jsonFetch(`${baseUrl}/tools/call`, {
            method: 'POST',
            body: JSON.stringify({
                tool: 'artifact_query',
                args: {
                    artifactId: textArtifactId,
                    action: 'text_search',
                    query: 'NEEDLE_BIG_TEXT_ARTIFACT',
                    contextLines: 0
                },
                context: { workspace: workspaceRoot }
            })
        });
        assert.equal(textSearch.body.ok, true, textSearch.body.error);
        assert.equal(textSearch.body.result.details.matchCount, 1);

        const textTail = await jsonFetch(`${baseUrl}/tools/call`, {
            method: 'POST',
            body: JSON.stringify({
                tool: 'artifact_query',
                args: {
                    artifactId: textArtifactId,
                    action: 'text_tail',
                    lines: 2
                },
                context: { workspace: workspaceRoot }
            })
        });
        assert.equal(textTail.body.ok, true, textTail.body.error);
        assert.match(textTail.body.result.content[0].text, /LOG_LINE_420/);

        const readPdf = await jsonFetch(`${baseUrl}/tools/call`, {
            method: 'POST',
            body: JSON.stringify({
                tool: 'computer',
                args: { action: 'read', path: 'paper.pdf' },
                context: { workspace: workspaceRoot }
            })
        });
        assert.equal(readPdf.body.ok, true, readPdf.body.error);
        assert.match(readPdf.body.result.content[0].text, /DOCUMENT_ARTIFACT_CREATED/);
        const documentArtifactId = readPdf.body.result.details.artifactId;
        assert.ok(documentArtifactId);

        const documentSearch = await jsonFetch(`${baseUrl}/tools/call`, {
            method: 'POST',
            body: JSON.stringify({
                tool: 'artifact_query',
                args: {
                    artifactId: documentArtifactId,
                    action: 'document_search',
                    query: 'AWARD-42',
                    contextLines: 0
                },
                context: { workspace: workspaceRoot }
            })
        });
        assert.equal(documentSearch.body.ok, true, documentSearch.body.error);
        assert.equal(documentSearch.body.result.details.matchCount, 1);

        const documentPage = await jsonFetch(`${baseUrl}/tools/call`, {
            method: 'POST',
            body: JSON.stringify({
                tool: 'artifact_query',
                args: {
                    artifactId: documentArtifactId,
                    action: 'document_page',
                    page: 1
                },
                context: { workspace: workspaceRoot }
            })
        });
        assert.equal(documentPage.body.ok, true, documentPage.body.error);
        assert.match(documentPage.body.result.content[0].text, /AWARD-42/);

        const readScannedPdf = await jsonFetch(`${baseUrl}/tools/call`, {
            method: 'POST',
            body: JSON.stringify({
                tool: 'computer',
                args: { action: 'read', path: 'scan.pdf' },
                context: { workspace: workspaceRoot }
            })
        });
        assert.equal(readScannedPdf.body.ok, false);
        assert.equal(readScannedPdf.body.status, 'scanned_pdf_needs_ocr');
        assert.equal(readScannedPdf.body.result.details.documentParseCode, 'scanned_pdf_needs_ocr');
        assert.equal(Object.hasOwn(readScannedPdf.body.result.details.observationContract, 'reasoning_ready'), false);
        assert.equal(readScannedPdf.body.result.details.suggestedNext.tool, 'tool_search');
        assert.doesNotMatch(readScannedPdf.body.result.content[0].text, /DOCUMENT_ARTIFACT_CREATED/);
        assert.equal(readScannedPdf.body.result.details.artifactId, undefined);
    } finally {
        await gateway.stop();
        await fs.rm(workspaceRoot, { recursive: true, force: true });
    }
});

test('AILIS Gateway event stream keeps cursor-addressable replay history', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-events-test-'));
    const gateway = new AILISGateway({
        port: 0,
        workspaceRoot,
        projectRoot: path.resolve('.'),
        auditDir: path.join(workspaceRoot, '.audit'),
        eventLogLimit: 20
    });

    try {
        const status = await gateway.start();
        const baseUrl = status.url;
        const firstSeq = gateway.eventSeq;
        gateway.emitGatewayEvent('agent.step.started', { marker: 'one' });
        const cursor = gateway.eventSeq;
        gateway.emitGatewayEvent('agent.step.finished', { marker: 'two' });

        const recent = await jsonFetch(`${baseUrl}/events/recent?cursor=${cursor}`);
        assert.equal(recent.body.ok, true);
        assert.ok(recent.body.events.every((event) => event.seq > cursor));
        assert.ok(recent.body.events.some((event) => event.type === 'agent.step.finished'));

        const allRecent = await jsonFetch(`${baseUrl}/events/recent?cursor=${firstSeq}`);
        assert.ok(allRecent.body.events.some((event) => event.type === 'agent.step.started'));
        assert.ok(allRecent.body.events.some((event) => event.delivery === 'lossless'));
        assert.equal(gateway.getStatus().events.buffered >= 2, true);
    } finally {
        await gateway.stop();
    }
});

test('AILIS Gateway builds agent analysis snapshots from transcript, audit, and events', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-analysis-test-'));
    const gateway = new AILISGateway({
        port: 0,
        workspaceRoot,
        projectRoot: path.resolve('.'),
        auditDir: path.join(workspaceRoot, '.audit'),
        eventLogLimit: 50
    });
    const runId = 'analysis-run-1';
    const sessionId = 'analysis-session';

    try {
        const status = await gateway.start();
        await gateway.runtime.startRun({
            runId,
            sessionId,
            message: 'debug this agent loop',
            planner: 'llm-agentic-executor',
            mode: 'task',
            intent: 'llm_agent'
        });
        await gateway.runtime.appendItem(runId, {
            sessionId,
            type: 'agent.context_snapshot',
            status: 'captured',
            payload: {
                iteration: 0,
                promptBudget: {
                    model: 'ailis_prompt_budget',
                    total_chars: 321,
                    approx_input_tokens: 123
                },
                messages: [
                    { role: 'system', content: 'system context' },
                    { role: 'user', content: 'debug this agent loop' }
                ]
            }
        });
        await gateway.runtime.appendItem(runId, {
            sessionId,
            type: 'agent.llm_call',
            status: 'completed',
            payload: {
                iteration: 0,
                callId: `${runId}:agent_decision:0`,
                provider: 'openai-compatible',
                model: 'test-model',
                durationMs: 44,
                ok: true,
                status: 'tool',
                action: 'tool',
                usage: {
                    promptTokens: 100,
                    completionTokens: 20,
                    totalTokens: 120
                }
            }
        });
        await gateway.runtime.appendItem(runId, {
            sessionId,
            type: 'agent.decision',
            status: 'tool',
            payload: {
                iteration: 0,
                ok: true,
                action: 'tool',
                intent: 'inspect_file',
                summary: 'Read the target file.',
                publicReasoning: 'Need one observation.',
                toolCall: {
                    id: 'step-1',
                    title: 'Read note',
                    tool: 'read',
                    args: { path: 'note.txt' }
                }
            }
        });
        await gateway.runtime.appendItem(runId, {
            sessionId,
            type: 'tool.call',
            status: 'started',
            payload: {
                callId: 'call-read-1',
                tool: 'read',
                args: { path: 'note.txt' },
                context: { iteration: 0 }
            }
        });
        await gateway.runtime.appendItem(runId, {
            sessionId,
            type: 'tool.result',
            status: 'completed',
            payload: {
                callId: 'call-read-1',
                tool: 'read',
                ok: true,
                status: 'completed',
                durationMs: 17,
                result: {
                    content: [{ type: 'text', text: 'file contents' }],
                    details: {
                        outputStore: {
                            outputId: 'output-call-read-1',
                            path: path.join(workspaceRoot, '.audit', 'output-store', 'output-call-read-1.log'),
                            bytes: 1234,
                            lineCount: 12,
                            previewTruncated: true
                        }
                    }
                }
            }
        });
        await gateway.runtime.appendItem(runId, {
            sessionId,
            type: 'agent.progress_note',
            status: 'delta',
            payload: {
                iteration: 0,
                text: '我已经读到目标文件，接下来会基于里面的证据收敛答案。',
                source: 'model_tool_progress_note',
                action: 'tool',
                intent: 'inspect_file'
            }
        });
        await gateway.runtime.completeRun(runId, {
            ok: true,
            status: 'completed',
            mode: 'task',
            planner: 'llm-agentic-executor',
            intent: 'inspect_file',
            durationMs: 88,
            displayText: 'done',
            cost: {
                schema: 'ailis.run_cost.v1',
                run_id: runId,
                wall_clock_ms: 88,
                total: {
                    runs: 2,
                    llm: {
                        calls: 2,
                        duration_ms: 70,
                        usage: {
                            promptTokens: 180,
                            completionTokens: 40,
                            totalTokens: 220,
                            reasoningTokens: 0,
                            cachedTokens: 60
                        },
                        by_model: []
                    },
                    tools: { calls: 2, duration_ms: 30 }
                }
            }
        });
        await gateway.appendAudit({
            runId,
            type: 'agent.run',
            status: 'completed',
            ok: true,
            durationMs: 88,
            mode: 'task',
            planner: 'llm-agentic-executor',
            intent: 'inspect_file',
            args: {
                message: 'debug this agent loop',
                sessionId
            },
            resultPreview: 'done'
        });
        gateway.emitGatewayEvent('agent.llm_call.completed', {
            runId,
            sessionId,
            iteration: 0,
            durationMs: 44,
            status: 'tool'
        });
        await gateway.runtime.appendItem(runId, {
            sessionId,
            type: 'agent.debug.paused',
            status: 'debug_paused',
            payload: {
                iteration: 0,
                nextIteration: 1,
                debugSessionId: 'debug-session-1',
                reason: 'tool_completed'
            }
        });

        const analysis = await gateway.analyzeAgentRun(runId);
        assert.equal(analysis.ok, true);
        assert.equal(analysis.summary.rounds, 1);
        assert.equal(analysis.summary.llmCalls, 1);
        assert.equal(analysis.summary.toolCalls, 1);
        assert.equal(analysis.summary.usage.totalTokens, 220);
        assert.equal(analysis.summary.ownUsage.totalTokens, 120);
        assert.equal(analysis.summary.cost.schema, 'ailis.run_cost.v1');
        assert.equal(analysis.summary.aggregateRuns, 2);
        assert.equal(analysis.summary.aggregateLlmCalls, 2);
        assert.equal(analysis.summary.aggregateToolCalls, 2);
        assert.equal(analysis.rounds[0].messages[1].content, 'debug this agent loop');
        assert.equal(analysis.rounds[0].progressNotes[0].source, 'model_tool_progress_note');
        assert.match(analysis.rounds[0].progressNotes[0].text, /目标文件/);
        assert.equal(analysis.toolCalls[0].durationMs, 17);
        assert.equal(analysis.toolCalls[0].outputStore.outputId, 'output-call-read-1');
        assert.equal(analysis.outputArtifacts[0].outputId, 'output-call-read-1');
        assert.match(analysis.summary.primaryBottleneck, /LLM|read|上下文/);
        assert.equal(analysis.summary.debugPaused, true);
        assert.equal(analysis.summary.debugSessionId, 'debug-session-1');
        assert.equal(analysis.summary.nextIteration, 1);

        const runs = await gateway.listAgentAnalysisRuns(5);
        assert.equal(runs.ok, true);
        assert.ok(runs.runs.some((run) => run.runId === runId));
        assert.ok(runs.runs.some((run) => run.runId === runId && run.debugPaused));

        const viaHttp = await jsonFetch(`${status.url}/agent/analysis?runId=${runId}`);
        assert.equal(viaHttp.body.ok, true);
        assert.equal(viaHttp.body.runId, runId);

        const listViaHttp = await jsonFetch(`${status.url}/agent/analysis/runs?limit=5`);
        assert.equal(listViaHttp.body.ok, true);
        assert.ok(listViaHttp.body.runs.some((run) => run.runId === runId));
    } finally {
        await gateway.stop();
    }
});
