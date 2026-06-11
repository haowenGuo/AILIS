import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const {
    CONTRACT_SOURCE_PROFILES,
    compileAndLintAiglContract,
    lintAiglContract
} = require('../electron/humanclaw-contract-compiler.cjs');
const { HumanClawToolAcquisitionGateway } = require('../electron/humanclaw-tool-acquisition-gateway.cjs');
const { HumanClawCapabilityManager } = require('../electron/humanclaw-capability-manager.cjs');

async function makeWorkspace(prefix) {
    return await fs.mkdtemp(path.join(os.tmpdir(), prefix));
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

test('AIGL contract compiler lists mature source profiles', () => {
    const ids = CONTRACT_SOURCE_PROFILES.map((entry) => entry.id);
    assert.ok(ids.includes('mcp_registry'));
    assert.ok(ids.includes('composio'));
    assert.ok(ids.includes('openapi'));
    assert.ok(ids.includes('langchain_pydantic'));
    assert.ok(ids.includes('codex_openhands'));
});

test('AIGL contract linter rejects thin tool menu schemas', () => {
    const result = compileAndLintAiglContract({
        name: 'thin_tool',
        description: 'Do thing.',
        inputSchema: {
            type: 'object',
            properties: {
                path: { type: 'string' }
            }
        }
    }, {
        sourceType: 'mcp_tool',
        minScore: 85
    });
    assert.equal(result.lint.approved, false);
    assert.ok(result.lint.issues.some((issue) => issue.code === 'missing_required'));
    assert.ok(result.lint.issues.some((issue) => issue.code === 'missing_error_recovery'));
});

test('AIGL contract compiler applies known recovery contract for run_python_file', () => {
    const result = compileAndLintAiglContract({
        name: 'run_python_file',
        description: 'Run a local Python file and return stdout/stderr.',
        inputSchema: {
            type: 'object',
            properties: {
                path: { type: 'string' },
                file: { type: 'string' },
                filePath: { type: 'string' },
                file_path: { type: 'string' },
                timeoutMs: { type: 'number' }
            }
        }
    }, {
        sourceType: 'mcp_tool',
        server: 'aigl_research'
    });
    assert.equal(result.lint.approved, true, JSON.stringify(result.lint.issues));
    assert.deepEqual(result.contract.inputSchema.required, ['path']);
    assert.equal(result.contract.inputSchema.additionalProperties, false);
    assert.match(JSON.stringify(result.contract.errors), /existing local \.py file/);
    assert.match(result.promptCard, /computer\.write/);
});

test('OpenAPI operation compiles into a canonical AIGL contract', () => {
    const result = compileAndLintAiglContract({
        operationId: 'gmailListMessages',
        method: 'get',
        path: '/gmail/v1/users/{userId}/messages',
        summary: 'List Gmail messages for a mailbox.',
        parameters: [
            { name: 'userId', required: true, schema: { type: 'string' }, description: 'Mailbox user id or me.' },
            { name: 'q', required: false, schema: { type: 'string' }, description: 'Gmail search query.' }
        ],
        whenToUse: ['Use for Gmail message listing after OAuth is configured.'],
        whenNotToUse: ['Do not use before OAuth token refresh succeeds.'],
        preconditions: ['Gmail OAuth access token is valid.'],
        examples: [{ userId: 'me', q: 'newer_than:1d' }],
        badExamples: [{ q: 'newer_than:1d' }],
        alternatives: ['Use IMAP inbox list when Gmail API is unavailable.'],
        errors: {
            auth_expired: {
                recoverable: true,
                nextActions: ['refresh OAuth token']
            }
        },
        permissions: ['gmail.readonly']
    }, {
        sourceType: 'openapi_operation'
    });
    assert.equal(result.lint.approved, true, JSON.stringify(result.lint.issues));
    assert.deepEqual(result.contract.inputSchema.required, ['userId']);
    assert.equal(result.contract.source.type, 'openapi_operation');
});

test('Tool Acquisition Gateway stores accepted and rejected compiled contracts', async () => {
    const workspaceRoot = await makeWorkspace('humanclaw-contract-intake-');
    const gateway = new HumanClawToolAcquisitionGateway({
        workspaceRoot,
        projectRoot: workspaceRoot,
        stateDir: path.join(workspaceRoot, '.state', 'tool-acquisition')
    });
    const intake = await gateway.intakeContracts({
        sourceType: 'mcp_tool',
        server: 'aigl_research',
        contracts: [
            {
                name: 'run_python_file',
                description: 'Run a local Python file and return stdout/stderr.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        path: { type: 'string' },
                        timeoutMs: { type: 'number' }
                    }
                }
            },
            {
                name: 'thin_tool',
                description: 'Do thing.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        value: { type: 'string' }
                    }
                }
            }
        ],
        minScore: 85
    });
    assert.equal(intake.status, 'completed');
    assert.equal(intake.accepted, 1);
    assert.equal(intake.rejected, 1);

    const listed = await gateway.listContractIntake({ limit: 10 });
    assert.equal(listed.contractCount, 2);
    assert.ok(listed.contracts.some((entry) => entry.status === 'approved'));
    assert.ok(listed.contracts.some((entry) => entry.status === 'rejected'));
});

test('Tool Acquisition Gateway bulk exposes external Composio OpenAPI and live MCP specs', async () => {
    const workspaceRoot = await makeWorkspace('humanclaw-external-exposure-');
    const calls = [];
    const gateway = new HumanClawToolAcquisitionGateway({
        workspaceRoot,
        projectRoot: workspaceRoot,
        stateDir: path.join(workspaceRoot, '.state', 'tool-acquisition'),
        mcpManager: {
            async listToolSpecs() {
                return [
                    {
                        id: 'mcp__docs__search',
                        name: 'mcp__docs__search',
                        server: 'docs',
                        tool: 'search',
                        description: 'Search verified documentation pages.',
                        input_schema: {
                            type: 'object',
                            required: ['query'],
                            additionalProperties: false,
                            properties: {
                                query: { type: 'string', description: 'Specific documentation query.' }
                            }
                        }
                    }
                ];
            },
            async callTool(request) {
                calls.push(request);
                return {
                    content: [{ type: 'text', text: `searched:${request.args.query}` }]
                };
            }
        }
    });
    const exposed = await gateway.bulkExposeExternalTools({
        includeMcpRegistry: false,
        includeInstalledMcp: true,
        composioTools: [
            {
                name: 'gmail_send_email',
                description: 'Send an email using Gmail through Composio.',
                inputSchema: {
                    type: 'object',
                    required: ['to', 'subject', 'body'],
                    additionalProperties: false,
                    properties: {
                        to: { type: 'string', description: 'Recipient email address.' },
                        subject: { type: 'string', description: 'Email subject.' },
                        body: { type: 'string', description: 'Email body.' }
                    }
                },
                whenToUse: ['Use when Gmail OAuth is configured and the user asks to send an email.'],
                whenNotToUse: ['Do not send without user approval.'],
                preconditions: ['Gmail OAuth account is configured.'],
                examples: [{ to: 'user@example.com', subject: 'Hello', body: 'Hi' }],
                badExamples: [{ subject: 'Missing recipient' }],
                alternatives: ['Use email.draft for approval-first workflow.'],
                errors: { oauth_missing: { recoverable: true, nextActions: ['connect Gmail account'] } },
                permissions: ['gmail.send']
            }
        ],
        openapiOperations: [
            {
                operationId: 'githubGetRepo',
                method: 'get',
                path: '/repos/{owner}/{repo}',
                summary: 'Get GitHub repository metadata.',
                parameters: [
                    { name: 'owner', required: true, schema: { type: 'string' }, description: 'Repository owner.' },
                    { name: 'repo', required: true, schema: { type: 'string' }, description: 'Repository name.' }
                ],
                whenToUse: ['Use for official GitHub repository metadata.'],
                whenNotToUse: ['Do not use for local git status.'],
                preconditions: ['GitHub API is reachable.'],
                examples: [{ owner: 'openai', repo: 'codex' }],
                badExamples: [{ owner: 'openai' }],
                alternatives: ['Use code.git_status for local repositories.'],
                errors: { not_found: { recoverable: false } },
                permissions: ['github.read']
            }
        ]
    });
    assert.equal(exposed.status, 'completed');
    assert.equal(exposed.added, 3);
    assert.equal(exposed.callable, 1);
    assert.ok(exposed.exposures.some((entry) => entry.callable && entry.toolId === 'mcp__docs__search'));
    assert.ok(exposed.exposures.some((entry) => entry.source.type === 'composio_tool' && !entry.callable));
    assert.ok(exposed.exposures.some((entry) => entry.source.type === 'openapi_operation' && !entry.callable));

    const listed = await gateway.listExposedExternalTools({ limit: 10 });
    assert.equal(listed.total, 3);
    assert.equal(listed.callable, 1);

    const mcpResult = await gateway.executeExposedExternalTool({
        toolId: 'mcp__docs__search',
        args: { query: 'contract compiler' }
    });
    assert.equal(mcpResult.status, 'completed');
    assert.equal(calls.length, 1);
    assert.deepEqual(calls[0], {
        server: 'docs',
        tool: 'search',
        args: { query: 'contract compiler' },
        meta: undefined,
        timeoutMs: undefined
    });

    const nonCallable = await gateway.executeExposedExternalTool({
        toolId: 'githubGetRepo',
        args: { owner: 'openai', repo: 'codex' }
    });
    assert.equal(nonCallable.status, 'adapter_required');
    assert.equal(nonCallable.ok, false);
});

test('Tool Acquisition Gateway executes trusted read-only OpenAPI exposure', async () => {
    const workspaceRoot = await makeWorkspace('humanclaw-openapi-executor-');
    const server = await withHttpServer((req, res) => {
        const url = new URL(req.url, 'http://127.0.0.1');
        res.setHeader('content-type', 'application/json');
        res.end(JSON.stringify({
            method: req.method,
            pathname: url.pathname,
            q: url.searchParams.get('q')
        }));
    });
    try {
        const gateway = new HumanClawToolAcquisitionGateway({
            workspaceRoot,
            projectRoot: workspaceRoot,
            stateDir: path.join(workspaceRoot, '.state', 'tool-acquisition')
        });
        const exposed = await gateway.bulkExposeExternalTools({
            includeMcpRegistry: false,
            includeInstalledMcp: false,
            trustCallable: true,
            openapiOperations: [
                {
                    operationId: 'lookupThing',
                    method: 'get',
                    path: '/things/{id}',
                    baseUrl: server.baseUrl,
                    callable: true,
                    summary: 'Lookup a thing by id.',
                    parameters: [
                        { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Thing id.' },
                        { name: 'q', in: 'query', required: false, schema: { type: 'string' }, description: 'Search hint.' }
                    ],
                    whenToUse: ['Use for read-only thing lookup.'],
                    whenNotToUse: ['Do not use for mutation.'],
                    preconditions: ['Local test API is running.'],
                    examples: [{ id: 'abc', q: 'hello' }],
                    badExamples: [{ q: 'missing id' }],
                    alternatives: ['Use local fixture if API is down.'],
                    errors: { not_found: { recoverable: false } },
                    permissions: ['things.read']
                }
            ]
        });
        assert.equal(exposed.callable, 1);
        const result = await gateway.executeExposedExternalTool({
            toolId: 'lookupThing',
            args: { id: 'abc', q: 'hello' }
        });
        assert.equal(result.status, 'completed');
        assert.equal(result.http.status, 200);
        assert.equal(result.body.pathname, '/things/abc');
        assert.equal(result.body.q, 'hello');
    } finally {
        await server.close();
    }
});

test('Tool Acquisition Gateway exposes callable OpenAPI adapters as virtual direct tools', async () => {
    const workspaceRoot = await makeWorkspace('humanclaw-openapi-virtual-direct-');
    const server = await withHttpServer((req, res) => {
        const url = new URL(req.url, 'http://127.0.0.1');
        res.setHeader('content-type', 'application/json');
        res.end(JSON.stringify({
            pathname: url.pathname,
            protocolSection: {
                designModule: {
                    enrollmentInfo: {
                        count: 90
                    }
                }
            }
        }));
    });
    try {
        const gateway = new HumanClawToolAcquisitionGateway({
            workspaceRoot,
            projectRoot: workspaceRoot,
            stateDir: path.join(workspaceRoot, '.state', 'tool-acquisition')
        });
        await gateway.bulkExposeExternalTools({
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
                    baseUrl: server.baseUrl,
                    summary: 'Get a ClinicalTrials.gov study record by NCT id, including actual enrollment count.',
                    parameters: [
                        { name: 'nctId', in: 'path', required: true, schema: { type: 'string' }, description: 'NCT id.' }
                    ],
                    whenToUse: ['Use for ClinicalTrials.gov structured enrollment fields.'],
                    whenNotToUse: ['Do not use for broad web search.'],
                    preconditions: ['NCT id is known.'],
                    examples: [{ nctId: 'NCT03411733' }],
                    badExamples: [{}],
                    alternatives: ['Use web_fetch only if the API is unavailable.'],
                    errors: { not_found: { recoverable: false } },
                    permissions: ['clinicaltrials.read']
                }
            ]
        });

        const searched = await gateway.searchExternalToolEntries({
            query: 'ClinicalTrials API NCT enrollment',
            limit: 5
        });
        const direct = searched.tools.find((entry) => entry.id === 'external__clinicaltrials__get_study');
        assert.ok(direct, JSON.stringify(searched.tools, null, 2));
        assert.equal(direct.callable, true);
        assert.equal(direct.call_pattern.tool, 'external__clinicaltrials__get_study');

        const result = await gateway.executeVirtualExternalTool('external__clinicaltrials__get_study', {
            nctId: 'NCT03411733'
        });
        assert.equal(result.status, 'completed');
        assert.equal(result.body.protocolSection.designModule.enrollmentInfo.count, 90);
    } finally {
        await server.close();
    }
});

test('Tool Acquisition Gateway includes accepted contract intake in external search', async () => {
    const workspaceRoot = await makeWorkspace('humanclaw-contract-intake-search-');
    const gateway = new HumanClawToolAcquisitionGateway({
        workspaceRoot,
        projectRoot: workspaceRoot,
        stateDir: path.join(workspaceRoot, '.state', 'tool-acquisition')
    });
    await gateway.intakeContracts({
        sourceType: 'openapi_operation',
        rawContracts: [
            {
                operationId: 'leicesterPaperLookup',
                summary: 'Lookup University of Leicester paper facts and calculated volume values.',
                inputSchema: {
                    type: 'object',
                    required: ['title'],
                    additionalProperties: false,
                    properties: {
                        title: { type: 'string', description: 'Paper title.' }
                    }
                },
                whenToUse: ['Use when a task needs the Leicester paper calculated volume.'],
                whenNotToUse: ['Do not use for unrelated university pages.'],
                preconditions: ['Paper title is known.'],
                examples: [{ title: 'Can Hiccup Supply Enough Fish?' }],
                badExamples: [{}],
                alternatives: ['Use PDF extract text if no structured tool is available.'],
                errors: { not_found: { recoverable: true, nextActions: ['try PDF parser'] } },
                permissions: ['web.read']
            }
        ]
    });
    const searched = await gateway.searchExternalToolEntries({
        query: 'Leicester fish bag volume paper',
        limit: 5
    });
    const candidate = searched.tools.find((entry) => entry.type === 'external_contract_intake');
    assert.ok(candidate, JSON.stringify(searched.tools, null, 2));
    assert.equal(candidate.callable, false);
    assert.match(JSON.stringify(candidate), /leicesterPaperLookup|Leicester paper/);
});

test('Tool Acquisition Gateway includes built-in public OpenAPI tools in external search without prior exposure', async () => {
    const workspaceRoot = await makeWorkspace('humanclaw-builtin-openapi-search-');
    const gateway = new HumanClawToolAcquisitionGateway({
        workspaceRoot,
        projectRoot: workspaceRoot,
        stateDir: path.join(workspaceRoot, '.state', 'tool-acquisition')
    });
    const searched = await gateway.searchExternalToolEntries({
        query: 'ClinicalTrials NCT actual enrollment API',
        limit: 5
    });
    const direct = searched.tools.find((entry) => entry.id === 'external__clinicaltrials__get_study');
    assert.ok(direct, JSON.stringify(searched.tools, null, 2));
    assert.equal(direct.callable, true);
    assert.equal(direct.verification, 'builtin_public_readonly');
    assert.equal(direct.call_pattern.tool, 'external__clinicaltrials__get_study');
});

test('Tool Acquisition Gateway executes approved OpenAPI adapter with env auth profile', async () => {
    const workspaceRoot = await makeWorkspace('humanclaw-openapi-adapter-auth-');
    const previousToken = process.env.AIGL_TEST_OPENAPI_TOKEN;
    process.env.AIGL_TEST_OPENAPI_TOKEN = 'openapi-secret';
    const server = await withHttpServer((req, res) => {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk;
        });
        req.on('end', () => {
            const url = new URL(req.url, 'http://127.0.0.1');
            res.setHeader('content-type', 'application/json');
            res.end(JSON.stringify({
                method: req.method,
                pathname: url.pathname,
                auth: req.headers.authorization,
                body: body ? JSON.parse(body) : null
            }));
        });
    });
    try {
        const gateway = new HumanClawToolAcquisitionGateway({
            workspaceRoot,
            projectRoot: workspaceRoot,
            stateDir: path.join(workspaceRoot, '.state', 'tool-acquisition')
        });
        const profile = await gateway.configureExternalAuthProfile({
            authProfileId: 'local-openapi',
            provider: 'openapi',
            authType: 'bearer_env',
            envVar: 'AIGL_TEST_OPENAPI_TOKEN'
        });
        assert.equal(profile.status, 'completed');
        assert.equal(profile.profile.envPresent, true);
        assert.equal(JSON.stringify(profile).includes('openapi-secret'), false);

        await gateway.bulkExposeExternalTools({
            includeMcpRegistry: false,
            includeInstalledMcp: false,
            trustCallable: true,
            enableOpenApiAdapter: true,
            authProfileId: 'local-openapi',
            openapiOperations: [
                {
                    operationId: 'createThing',
                    method: 'post',
                    path: '/things',
                    baseUrl: server.baseUrl,
                    summary: 'Create a thing.',
                    parameters: [],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['name'],
                                    properties: {
                                        name: { type: 'string', description: 'Thing name.' }
                                    }
                                }
                            }
                        }
                    },
                    whenToUse: ['Use for approved test creation.'],
                    whenNotToUse: ['Do not use without user approval.'],
                    preconditions: ['Auth profile configured.'],
                    examples: [{ body: { name: 'alpha' } }],
                    badExamples: [{}],
                    alternatives: ['Use read-only lookup.'],
                    errors: { auth_required: { recoverable: true } },
                    permissions: ['things.write']
                }
            ]
        });
        const needsApproval = await gateway.executeExposedExternalTool({
            toolId: 'createThing',
            args: { body: { name: 'alpha' } }
        });
        assert.equal(needsApproval.status, 'needs_approval');

        const result = await gateway.executeExposedExternalTool({
            toolId: 'createThing',
            args: { body: { name: 'alpha' } },
            approved: true
        });
        assert.equal(result.status, 'completed');
        assert.equal(result.body.method, 'POST');
        assert.equal(result.body.auth, 'Bearer openapi-secret');
        assert.deepEqual(result.body.body, { name: 'alpha' });
        assert.equal(result.request.headers.Authorization, '__REDACTED__');
    } finally {
        if (previousToken === undefined) {
            delete process.env.AIGL_TEST_OPENAPI_TOKEN;
        } else {
            process.env.AIGL_TEST_OPENAPI_TOKEN = previousToken;
        }
        await server.close();
    }
});

test('Tool Acquisition Gateway executes approved Composio adapter with scoped env auth', async () => {
    const workspaceRoot = await makeWorkspace('humanclaw-composio-adapter-auth-');
    const previousToken = process.env.AIGL_TEST_COMPOSIO_KEY;
    process.env.AIGL_TEST_COMPOSIO_KEY = 'composio-secret';
    const requests = [];
    const server = await withHttpServer((req, res) => {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk;
        });
        req.on('end', () => {
            requests.push({
                method: req.method,
                url: req.url,
                headers: req.headers,
                body: body ? JSON.parse(body) : null
            });
            res.setHeader('content-type', 'application/json');
            res.end(JSON.stringify({ ok: true, data: { id: 'email-1' } }));
        });
    });
    try {
        const gateway = new HumanClawToolAcquisitionGateway({
            workspaceRoot,
            projectRoot: workspaceRoot,
            stateDir: path.join(workspaceRoot, '.state', 'tool-acquisition')
        });
        await gateway.configureExternalAuthProfile({
            authProfileId: 'local-composio',
            provider: 'composio',
            authType: 'composio_api_key_env',
            envVar: 'AIGL_TEST_COMPOSIO_KEY',
            baseUrl: `${server.baseUrl}/api/v3`,
            userId: 'user-1'
        });
        await gateway.bulkExposeExternalTools({
            includeMcpRegistry: false,
            includeInstalledMcp: false,
            trustCallable: true,
            enableComposioAdapter: true,
            authProfileId: 'local-composio',
            composioTools: [
                {
                    name: 'gmail_send_email',
                    toolSlug: 'gmail_send_email',
                    description: 'Send an email using Gmail through Composio.',
                    inputSchema: {
                        type: 'object',
                        required: ['to', 'subject', 'body'],
                        additionalProperties: false,
                        properties: {
                            to: { type: 'string', description: 'Recipient email address.' },
                            subject: { type: 'string', description: 'Email subject.' },
                            body: { type: 'string', description: 'Email body.' }
                        }
                    },
                    whenToUse: ['Use when Gmail OAuth is configured and the user approves sending.'],
                    whenNotToUse: ['Do not send without user approval.'],
                    preconditions: ['Composio auth profile is configured.'],
                    examples: [{ to: 'user@example.com', subject: 'Hello', body: 'Hi' }],
                    badExamples: [{ subject: 'Missing recipient' }],
                    alternatives: ['Use email.draft for approval-first workflow.'],
                    errors: { oauth_missing: { recoverable: true, nextActions: ['connect Gmail account'] } },
                    permissions: ['gmail.send']
                }
            ]
        });
        const smoke = await gateway.smokeExposedExternalTool({ toolId: 'gmail_send_email' });
        assert.equal(smoke.status, 'completed');

        const needsApproval = await gateway.executeExposedExternalTool({
            toolId: 'gmail_send_email',
            args: { to: 'user@example.com', subject: 'Hello', body: 'Hi' }
        });
        assert.equal(needsApproval.status, 'needs_approval');

        const result = await gateway.executeExposedExternalTool({
            toolId: 'gmail_send_email',
            args: { to: 'user@example.com', subject: 'Hello', body: 'Hi' },
            approved: true
        });
        assert.equal(result.status, 'completed');
        assert.equal(requests.length, 1);
        assert.equal(requests[0].method, 'POST');
        assert.equal(requests[0].url, '/api/v3/tools/execute/gmail_send_email');
        assert.equal(requests[0].headers['x-api-key'], 'composio-secret');
        assert.deepEqual(requests[0].body, {
            arguments: { to: 'user@example.com', subject: 'Hello', body: 'Hi' },
            user_id: 'user-1'
        });
        assert.equal(result.request.headers['x-api-key'], '__REDACTED__');
    } finally {
        if (previousToken === undefined) {
            delete process.env.AIGL_TEST_COMPOSIO_KEY;
        } else {
            process.env.AIGL_TEST_COMPOSIO_KEY = previousToken;
        }
        await server.close();
    }
});

test('Capability Manager exposes contract compiler actions', async () => {
    const workspaceRoot = await makeWorkspace('humanclaw-contract-capability-');
    const manager = new HumanClawCapabilityManager({
        workspaceRoot,
        projectRoot: workspaceRoot,
        auditDir: path.join(workspaceRoot, '.state'),
        skillRoot: path.join(workspaceRoot, 'skills')
    });
    const sources = await manager.execute({ action: 'list_contract_sources' });
    assert.equal(sources.details.status, 'completed');
    assert.ok(sources.details.sources.some((entry) => entry.id === 'openapi'));

    const compiled = await manager.execute({
        action: 'compile_contract',
        sourceType: 'mcp_tool',
        server: 'aigl_research',
        rawContract: {
            name: 'run_python_file',
            description: 'Run a local Python file and return stdout/stderr.',
            inputSchema: {
                type: 'object',
                properties: {
                    path: { type: 'string' },
                    timeoutMs: { type: 'number' }
                }
            }
        }
    });
    assert.equal(compiled.details.status, 'completed');
    assert.equal(compiled.details.lint.approved, true, JSON.stringify(compiled.details.lint.issues));

    const exposed = await manager.execute({
        action: 'bulk_expose_external_tools',
        includeInstalledMcp: false,
        includeMcpRegistry: false,
        openapiOperations: [
            {
                operationId: 'githubGetRepo',
                method: 'get',
                path: '/repos/{owner}/{repo}',
                summary: 'Get GitHub repository metadata.',
                parameters: [
                    { name: 'owner', required: true, schema: { type: 'string' }, description: 'Repository owner.' },
                    { name: 'repo', required: true, schema: { type: 'string' }, description: 'Repository name.' }
                ],
                whenToUse: ['Use for official GitHub repository metadata.'],
                whenNotToUse: ['Do not use for local git status.'],
                preconditions: ['GitHub API is reachable.'],
                examples: [{ owner: 'openai', repo: 'codex' }],
                badExamples: [{ owner: 'openai' }],
                alternatives: ['Use code.git_status for local repositories.'],
                errors: { not_found: { recoverable: false } },
                permissions: ['github.read']
            }
        ]
    });
    assert.equal(exposed.details.status, 'completed');
    assert.equal(exposed.details.added, 1);

    const listed = await manager.execute({ action: 'list_exposed_external_tools' });
    assert.equal(listed.details.status, 'completed');
    assert.equal(listed.details.total, 1);
});
