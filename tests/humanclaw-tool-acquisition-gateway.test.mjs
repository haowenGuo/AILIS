import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const {
    HumanClawToolAcquisitionGateway,
    buildRegistryCandidate,
    stableTaskSignature
} = require('../electron/humanclaw-tool-acquisition-gateway.cjs');
const { HumanClawCapabilityManager } = require('../electron/humanclaw-capability-manager.cjs');

async function makeWorkspace(prefix) {
    return await fs.mkdtemp(path.join(os.tmpdir(), prefix));
}

function fakeRegistryPayload() {
    return {
        servers: [
            {
                server: {
                    name: 'io.example/docs-mcp',
                    title: 'Example Docs MCP',
                    description: 'Search and read product documentation pages.',
                    version: '1.2.3',
                    repository: {
                        source: 'github',
                        url: 'https://github.com/example/docs-mcp'
                    },
                    remotes: [
                        {
                            type: 'streamable-http',
                            url: 'https://example.test/mcp'
                        }
                    ]
                },
                _meta: {
                    'io.modelcontextprotocol.registry/official': {
                        isLatest: true,
                        status: 'active'
                    }
                }
            },
            {
                server: {
                    name: 'io.example/secure-mail',
                    title: 'Secure Mail MCP',
                    description: 'Manage mail with a required bearer token.',
                    version: '2.0.0',
                    remotes: [
                        {
                            type: 'streamable-http',
                            url: 'https://mail.example.test/mcp',
                            headers: [
                                {
                                    name: 'Authorization',
                                    isRequired: true,
                                    isSecret: true,
                                    description: 'Bearer token'
                                }
                            ]
                        }
                    ]
                },
                _meta: {
                    'io.modelcontextprotocol.registry/official': {
                        isLatest: true,
                        status: 'active'
                    }
                }
            }
        ],
        metadata: {
            count: 2
        }
    };
}

test('Tool Acquisition Gateway searches core bundles and official MCP Registry candidates', async () => {
    const workspaceRoot = await makeWorkspace('humanclaw-tool-acquisition-');
    const gateway = new HumanClawToolAcquisitionGateway({
        workspaceRoot,
        projectRoot: workspaceRoot,
        stateDir: path.join(workspaceRoot, '.state', 'tool-acquisition'),
        registryFetcher: async () => fakeRegistryPayload()
    });

    const core = gateway.listCoreTools();
    assert.ok(core.some((entry) => entry.id === 'core:file_system'));
    assert.ok(core.some((entry) => entry.id === 'core:ocr'));

    const search = await gateway.searchCandidates({
        query: 'documentation search docs',
        limit: 5
    });
    assert.equal(search.details?.status || search.status, 'completed');
    assert.ok(search.candidates.some((candidate) => candidate.name === 'io.example/docs-mcp'));

    const secure = buildRegistryCandidate(fakeRegistryPayload().servers[1]);
    assert.equal(secure.install.authEnvVar, 'HUMANCLAW_MCP_IO_EXAMPLE_SECURE_MAIL_TOKEN');
    assert.equal(secure.install.mcpConfig.bearerTokenEnvVar, 'HUMANCLAW_MCP_IO_EXAMPLE_SECURE_MAIL_TOKEN');

    const plan = await gateway.planMcpCandidate({
        query: 'docs',
        validationCommands: []
    });
    assert.equal(plan.status, 'completed');
    assert.equal(plan.planArgs.sourceKind, 'mcp_config');
    assert.equal(plan.planArgs.mcpConfig.url, 'https://example.test/mcp');
    assert.ok(plan.smokeProfile.checks.some((check) => check.id === 'mcp_tools_list'));
});

test('Tool Acquisition Gateway records task-tool outcomes and recommends verified tools', async () => {
    const workspaceRoot = await makeWorkspace('humanclaw-tool-learning-');
    const gateway = new HumanClawToolAcquisitionGateway({
        workspaceRoot,
        projectRoot: workspaceRoot,
        stateDir: path.join(workspaceRoot, '.state', 'tool-acquisition'),
        registryFetcher: async () => fakeRegistryPayload()
    });

    const signature = stableTaskSignature('read a pdf and extract OCR text');
    const recorded = await gateway.recordToolOutcome({
        taskText: 'read a pdf and extract OCR text',
        taskSignature: signature,
        toolId: 'mcp__ocr_docs__extract_text',
        success: true,
        score: 1,
        evidence: 'smoke and task passed'
    });
    assert.equal(recorded.status, 'completed');

    const recommendations = await gateway.recommendTools({
        taskText: 'please OCR text from this PDF',
        limit: 5
    });
    assert.equal(recommendations.status, 'completed');
    assert.ok(recommendations.recommendations.some((entry) => entry.toolId === 'mcp__ocr_docs__extract_text'));
});

test('Capability Manager plans MCP Registry candidates through the Tool Acquisition Gateway', async () => {
    const workspaceRoot = await makeWorkspace('humanclaw-capability-acquisition-');
    await fs.writeFile(path.join(workspaceRoot, 'package.json'), JSON.stringify({ name: 'fixture-app', version: '1.0.0' }), 'utf8');
    await fs.writeFile(path.join(workspaceRoot, 'pnpm-lock.yaml'), 'lockfileVersion: 9.0\n', 'utf8');
    const manager = new HumanClawCapabilityManager({
        workspaceRoot,
        projectRoot: workspaceRoot,
        auditDir: path.join(workspaceRoot, '.state'),
        skillRoot: path.join(workspaceRoot, 'skills'),
        registryFetcher: async () => fakeRegistryPayload()
    });

    const searched = await manager.execute({
        action: 'search_tool_candidates',
        query: 'docs search',
        limit: 5
    });
    assert.equal(searched.details.status, 'completed');
    assert.ok(searched.details.candidates.some((candidate) => candidate.name === 'io.example/docs-mcp'));

    const planned = await manager.execute({
        action: 'plan_mcp_candidate',
        query: 'docs search',
        validationCommands: []
    });
    assert.equal(planned.details.status, 'completed');
    assert.equal(planned.details.plan.sourceKind, 'mcp_config');
    assert.equal(planned.details.plan.source.mcpConfig.url, 'https://example.test/mcp');
    assert.ok(planned.details.smokeProfile.checks.some((check) => check.id === 'mcp_initialize'));
});
