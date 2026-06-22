import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { AILISGateway } = require('../electron/ailis-gateway.cjs');
const ExcelJS = require('exceljs');

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
        assert.ok(tools.body.localTools.some((tool) => tool.id === 'computer' && tool.spec));
        assert.equal(tools.body.localTools.some((tool) => tool.id === 'read'), false);
        assert.equal(tools.body.gateway.toolRuntime.model, 'codex_like_gateway_tool_registry');

        const searchTools = await jsonFetch(`${baseUrl}/tools/call`, {
            method: 'POST',
            body: JSON.stringify({
                tool: 'tool_search',
                args: { query: 'computer file write', includeMcp: false, limit: 5 },
                context: { workspace: workspaceRoot }
            })
        });
        assert.equal(searchTools.body.ok, true, searchTools.body.error);
        assert.match(JSON.stringify(searchTools.body.result), /computer/);
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
                    maxPreviewChars: 1200
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

        const readBack = await fs.readFile(path.join(workspaceRoot, 'full-control.txt'), 'utf8');
        assert.match(readBack, /enabled/);
    } finally {
        await gateway.stop();
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
                args: { query: 'ClinicalTrials enrollment NCT API', includeMcp: false, limit: 5 },
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

test('AILIS Gateway tool_search ranks specific MCP artifact tools before web_search', async () => {
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
        gateway.runtime.mcpManager.searchToolSpecs = async () => [
            mcpTool('web_search', 'Fallback broad public web search.'),
            mcpTool('read_presentation', 'Read PowerPoint PPTX slides.'),
            mcpTool('read_document', 'Read Word DOCX documents with paragraphs and tables.'),
            mcpTool('youtube_transcript', 'Read YouTube video transcripts.')
        ];

        const result = await gateway.executeGatewayToolSearch({
            query: 'attached pptx PowerPoint slides evidence web search',
            includeExternal: false,
            limit: 1
        });

        assert.equal(result.details.tools.length, 1);
        assert.equal(Object.hasOwn(result.details, 'discovery'), false);
        assert.equal(Object.hasOwn(result.details, 'searched_content'), false);
        assert.equal(result.details.tools[0].tool, 'read_presentation');
        assert.match(result.details.routing_advice, /read_presentation/);

        const docxResult = await gateway.executeGatewayToolSearch({
            query: 'DOCX word document extract text content',
            includeExternal: false,
            limit: 1
        });

        assert.equal(docxResult.details.tools.length, 1);
        assert.equal(docxResult.details.tools[0].tool, 'read_document');
        assert.notEqual(docxResult.details.tools[0].id, 'artifact_verifier');
        assert.match(docxResult.details.routing_advice, /read_document/);

        const xlsxResult = await gateway.executeGatewayToolSearch({
            query: 'attached xlsx spreadsheet cell colors fill formulas merged map',
            includeExternal: false,
            includeMcp: false,
            limit: 3
        });

        assert.ok(xlsxResult.details.tools.some((tool) => tool.id === 'read_xlsx_workbook'));
        assert.equal(xlsxResult.details.tools[0].id, 'read_xlsx_workbook');
        assert.match(xlsxResult.details.routing_advice, /read_xlsx_workbook/);

        const artifactQueryResult = await gateway.executeGatewayToolSearch({
            query: 'artifact_query artifactId fullJsonPath payload range grid search',
            includeExternal: false,
            includeMcp: false,
            limit: 3
        });

        assert.ok(artifactQueryResult.details.tools.some((tool) => tool.id === 'artifact_query'));
        assert.equal(artifactQueryResult.details.tools[0].id, 'artifact_query');
        assert.match(artifactQueryResult.details.routing_advice, /artifact_query/);
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
        assert.ok(search.details.tools.some((tool) => tool.id === 'mcp__ailis_research__web_search'));

        const fetched = await gateway.runtime.executeTool(
            'mcp__ailis_research__web_fetch',
            { url: page.baseUrl, maxChars: 2000 },
            { runId: 'builtin-research-mcp-run', workspace: workspaceRoot, timeoutMs: 30000 }
        );
        assert.equal(fetched.details.status, 'completed');
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
    const workbookPath = path.join(workspaceRoot, 'map.xlsx');

    try {
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Map');
        sheet.getCell('A1').value = 'START';
        sheet.getCell('B1').fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF0099FF' }
        };
        sheet.getCell('C2').value = 'END';
        await workbook.xlsx.writeFile(workbookPath);

        const status = await gateway.start();
        const baseUrl = status.url;

        const xlsx = await jsonFetch(`${baseUrl}/tools/call`, {
            method: 'POST',
            body: JSON.stringify({
                tool: 'read_xlsx_workbook',
                args: {
                    path: workbookPath,
                    sheet: 'Map',
                    maxRows: 4,
                    maxCols: 4,
                    includeStyles: true
                },
                context: { workspace: workspaceRoot, runId: 'artifact-run-1', sessionId: 'artifact-session-1' }
            })
        });
        assert.equal(xlsx.body.ok, true, xlsx.body.error);
        const artifactId = xlsx.body.result.details.artifactId;
        assert.ok(artifactId);
        assert.doesNotMatch(xlsx.body.result.content[0].text, /fullJsonPath/);
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

        const record = await gateway.runtime.contextArtifactStore.getRecord(artifactId);
        assert.ok(record.payloadPath);
        const rawRead = await jsonFetch(`${baseUrl}/tools/call`, {
            method: 'POST',
            body: JSON.stringify({
                tool: 'read',
                args: { path: record.payloadPath },
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
        assert.equal(readScannedPdf.body.result.details.observationContract.needs_ocr, true);
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
            displayText: 'done'
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
        assert.equal(analysis.summary.usage.totalTokens, 120);
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
