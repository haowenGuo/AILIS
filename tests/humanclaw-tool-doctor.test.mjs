import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { HumanClawRuntime } = require('../electron/humanclaw-runtime.cjs');
const { HumanClawToolDoctor } = require('../electron/humanclaw-tool-doctor.cjs');

async function makeWorkspace(prefix) {
    return await fs.mkdtemp(path.join(os.tmpdir(), prefix));
}

test('Tool Doctor discovers MCP candidates from configs and local packages', async () => {
    const workspaceRoot = await makeWorkspace('humanclaw-tool-doctor-discovery-');
    const packageDir = path.join(workspaceRoot, 'sample-mcp');
    await fs.mkdir(packageDir, { recursive: true });
    await fs.writeFile(
        path.join(workspaceRoot, '.mcp.json'),
        JSON.stringify({
            mcpServers: {
                fixture_http: {
                    transport: 'http',
                    url: 'http://127.0.0.1:9999/mcp',
                    headers: { authorization: 'Bearer secret-token' }
                }
            }
        }),
        'utf8'
    );
    await fs.writeFile(
        path.join(packageDir, 'package.json'),
        JSON.stringify({
            name: '@local/sample-mcp-server',
            description: 'Sample MCP server for tests',
            bin: { 'sample-mcp': 'bin/server.cjs' },
            dependencies: { '@modelcontextprotocol/sdk': '^1.0.0' }
        }),
        'utf8'
    );

    const doctor = new HumanClawToolDoctor({
        workspaceRoot,
        projectRoot: workspaceRoot,
        auditDir: path.join(workspaceRoot, '.audit')
    });
    const result = await doctor.execute({
        action: 'discover_mcp',
        paths: [workspaceRoot],
        githubRepos: ['https://github.com/example/example-mcp.git'],
        includeConfigured: false
    });

    assert.equal(result.details.status, 'completed');
    assert.ok(result.details.candidates.some((candidate) => candidate.name === 'fixture_http'));
    assert.ok(result.details.candidates.some((candidate) => candidate.name === '@local/sample-mcp-server'));
    assert.ok(result.details.candidates.some((candidate) => candidate.status === 'needs_local_checkout'));
    assert.ok(JSON.stringify(result.details.candidates).includes('__REDACTED__'));
    assert.ok(!JSON.stringify(result.details.candidates).includes('secret-token'));
});

test('Tool Doctor records scorecards and gates repair proposals without applying patches', async () => {
    const workspaceRoot = await makeWorkspace('humanclaw-tool-doctor-scorecard-');
    const doctor = new HumanClawToolDoctor({
        workspaceRoot,
        projectRoot: workspaceRoot,
        auditDir: path.join(workspaceRoot, '.audit')
    });

    const ok = await doctor.execute({
        action: 'record_observation',
        tool: 'mcp_bridge',
        status: 'success',
        latencyMs: 120
    });
    assert.equal(ok.details.status, 'completed');

    const timeout = await doctor.execute({
        action: 'record_observation',
        tool: 'mcp_bridge',
        status: 'timeout',
        latencyMs: 25000,
        errorCode: 'timeout'
    });
    assert.equal(timeout.details.status, 'completed');

    const scorecard = await doctor.execute({ action: 'scorecard', tool: 'mcp_bridge' });
    assert.equal(scorecard.details.tools[0].total, 2);
    assert.equal(scorecard.details.tools[0].timeout, 1);
    assert.equal(scorecard.details.tools[0].commonErrors[0].code, 'timeout');

    const repair = await doctor.execute({
        action: 'propose_repair',
        tool: 'mcp_bridge',
        title: 'Add timeout recovery for MCP calls',
        reason: 'Scorecard shows repeated timeouts.',
        candidateDiff: 'diff --git a/file b/file',
        validationCommands: ['pnpm humanclaw:mcp-soak']
    });
    assert.equal(repair.details.status, 'completed');
    assert.equal(repair.details.repair.applied, false);
    assert.equal(repair.details.repair.gate.status, 'proposal_only');

    const marked = await doctor.execute({
        action: 'mark_repair',
        id: repair.details.repair.id,
        status: 'verified',
        validationReport: 'mcp soak passed'
    });
    assert.equal(marked.details.repair.status, 'verified');
});

test('HumanClaw runtime exposes Tool Doctor as a runtime tool', async () => {
    const workspaceRoot = await makeWorkspace('humanclaw-tool-doctor-runtime-');
    const runtime = new HumanClawRuntime({
        workspaceRoot,
        projectRoot: workspaceRoot,
        auditDir: path.join(workspaceRoot, '.audit')
    });

    try {
        assert.equal(runtime.canExecuteTool('tool_doctor'), true);
        assert.ok(runtime.getStatus().capabilities.includes('tool_doctor_health_checks'));

        const health = await runtime.executeTool('tool_doctor', { action: 'health_check', includeMcp: false }, {
            runId: 'doctor-run',
            sessionId: 'main'
        });
        assert.equal(health.details.status, 'completed');
        assert.ok(health.details.contractCount >= 10);

        const classification = runtime.classifyToolCall({
            toolId: 'tool_doctor',
            args: { action: 'propose_repair' }
        });
        assert.equal(classification.class, 'tool_health');
        assert.equal(classification.mutates, true);
        assert.equal(classification.requiresApprovalCapable, false);
    } finally {
        await runtime.shutdown();
    }
});
