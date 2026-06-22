import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { AILISCapabilityManager } = require('../electron/ailis-capability-manager.cjs');
const { AILISMcpManager } = require('../electron/ailis-mcp-session.cjs');
const { AILISRuntime } = require('../electron/ailis-runtime.cjs');

async function makeWorkspace(prefix) {
    return await fs.mkdtemp(path.join(os.tmpdir(), prefix));
}

async function writeFixtureMcpServer(serverPath) {
    await fs.writeFile(
        serverPath,
        `
const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
function send(message) {
  process.stdout.write(JSON.stringify({ jsonrpc: '2.0', ...message }) + '\\n');
}
rl.on('line', (line) => {
  let request;
  try { request = JSON.parse(line); } catch { return; }
  if (!request.id) return;
  if (request.method === 'initialize') {
    send({ id: request.id, result: { protocolVersion: '2025-06-18', capabilities: { tools: {} }, serverInfo: { name: 'fixture-capability', version: '1.0.0' } } });
    return;
  }
  if (request.method === 'tools/list') {
    send({ id: request.id, result: { tools: [{ name: 'say_hello', description: 'Say hello from an installed capability', inputSchema: { type: 'object', properties: { name: { type: 'string' } } } }] } });
    return;
  }
  if (request.method === 'tools/call') {
    send({ id: request.id, result: { content: [{ type: 'text', text: 'hello:' + (request.params?.arguments?.name || 'AILIS') }] } });
    return;
  }
  send({ id: request.id, error: { code: -32601, message: 'unknown method' } });
});
        `.trim(),
        'utf8'
    );
}

test('Capability Manager installs an explicit MCP config, authors a skill, refreshes registry, and rolls back', async () => {
    const workspaceRoot = await makeWorkspace('ailis-capability-install-');
    await fs.writeFile(path.join(workspaceRoot, 'package.json'), JSON.stringify({ name: 'fixture-app', version: '1.0.0' }), 'utf8');
    await fs.writeFile(path.join(workspaceRoot, 'pnpm-lock.yaml'), 'lockfileVersion: 9.0\n', 'utf8');
    const stateDir = path.join(workspaceRoot, '.state');
    const skillRoot = path.join(workspaceRoot, 'skills');
    const serverPath = path.join(workspaceRoot, 'fixture-mcp-server.cjs');
    await writeFixtureMcpServer(serverPath);
    const mcpConfigPath = path.join(stateDir, 'mcp-servers.json');
    const mcpManager = new AILISMcpManager({
        workspaceRoot,
        projectRoot: workspaceRoot,
        configPath: mcpConfigPath
    });
    const manager = new AILISCapabilityManager({
        workspaceRoot,
        projectRoot: workspaceRoot,
        auditDir: stateDir,
        skillRoot,
        mcpManager
    });

    try {
        const planned = await manager.execute({
            action: 'plan_install',
            request: 'install fixture MCP',
            capabilityId: 'fixture_capability',
            sourceKind: 'mcp_config',
            mcpServerName: 'fixture_capability',
            skillId: 'fixture_capability',
            mcpConfig: {
                transport: 'stdio',
                command: process.execPath,
                args: [serverPath],
                cwd: workspaceRoot
            },
            validationCommands: []
        });
        assert.equal(planned.details.status, 'completed');
        assert.ok(planned.details.plan.steps.some((step) => step.id === 'register_mcp_server'));

        const blocked = await manager.execute({
            action: 'install_capability',
            planId: planned.details.plan.id
        });
        assert.equal(blocked.details.status, 'needs_approval');

        const installed = await manager.execute({
            action: 'install_capability',
            planId: planned.details.plan.id,
            approved: true,
            timeoutMs: 5000
        });
        assert.equal(installed.details.status, 'completed', installed.content[0].text);
        assert.equal(installed.details.installation.mcpServerName, 'fixture_capability');
        assert.match(await fs.readFile(mcpConfigPath, 'utf8'), /fixture_capability/);
        assert.match(await fs.readFile(path.join(skillRoot, 'fixture_capability', 'SKILL.md'), 'utf8'), /say_hello/);

        const call = await mcpManager.callTool({
            server: 'fixture_capability',
            tool: 'say_hello',
            args: { name: 'test' },
            timeoutMs: 5000
        });
        assert.equal(call.content[0].text, 'hello:test');

        const registry = await manager.execute({ action: 'registry' });
        assert.ok(registry.details.capabilities.some((capability) => capability.id === 'mcp:fixture_capability'));
        assert.ok(registry.details.capabilities.some((capability) => capability.id === 'installed:fixture_capability'));

        const rolledBack = await manager.execute({
            action: 'rollback',
            installationId: installed.details.installation.id,
            approved: true
        });
        assert.equal(rolledBack.details.status, 'completed');
        await assert.rejects(() => fs.readFile(mcpConfigPath, 'utf8'), /ENOENT/);
        await assert.rejects(() => fs.readFile(path.join(skillRoot, 'fixture_capability', 'SKILL.md'), 'utf8'), /ENOENT/);
    } finally {
        await mcpManager.shutdown().catch(() => {});
    }
});

test('Capability Manager executes an approved repair patch and rolls back on validation failure', async () => {
    const workspaceRoot = await makeWorkspace('ailis-capability-repair-');
    await fs.writeFile(path.join(workspaceRoot, 'hello.txt'), 'old\n', 'utf8');
    const manager = new AILISCapabilityManager({
        workspaceRoot,
        projectRoot: workspaceRoot,
        auditDir: path.join(workspaceRoot, '.state'),
        skillRoot: path.join(workspaceRoot, 'skills')
    });

    const patch = [
        'diff --git a/hello.txt b/hello.txt',
        '--- a/hello.txt',
        '+++ b/hello.txt',
        '@@ -1 +1 @@',
        '-old',
        '+new',
        ''
    ].join('\n');

    const dryRun = await manager.execute({
        action: 'execute_repair',
        candidateDiff: patch,
        dryRun: true
    });
    assert.equal(dryRun.details.status, 'validated');
    assert.equal(await fs.readFile(path.join(workspaceRoot, 'hello.txt'), 'utf8'), 'old\n');

    const failed = await manager.execute({
        action: 'execute_repair',
        candidateDiff: patch,
        approved: true,
        validationCommands: [`"${process.execPath}" "${path.join(workspaceRoot, 'missing-validation-file.js')}"`]
    });
    assert.equal(failed.details.status, 'validation_failed_rolled_back');
    assert.equal(await fs.readFile(path.join(workspaceRoot, 'hello.txt'), 'utf8'), 'old\n');

    const applied = await manager.execute({
        action: 'execute_repair',
        candidateDiff: patch,
        approved: true,
        validationCommands: ['echo ok']
    });
    assert.equal(applied.details.status, 'completed');
    assert.equal(await fs.readFile(path.join(workspaceRoot, 'hello.txt'), 'utf8'), 'new\n');
});

test('AILIS runtime exposes Capability Manager lifecycle classification', async () => {
    const workspaceRoot = await makeWorkspace('ailis-capability-runtime-');
    const runtime = new AILISRuntime({
        workspaceRoot,
        projectRoot: workspaceRoot,
        auditDir: path.join(workspaceRoot, '.state')
    });

    try {
        assert.equal(runtime.canExecuteTool('capability_manager'), true);
        assert.ok(runtime.getStatus().capabilities.includes('capability_installer'));

        const registry = await runtime.executeTool('capability_manager', { action: 'refresh_registry', includeHealth: false }, {
            runId: 'capability-runtime'
        });
        assert.equal(registry.details.status, 'completed');
        assert.ok(registry.details.capabilityCount >= 10);

        const classification = runtime.classifyToolCall({
            toolId: 'capability_manager',
            args: { action: 'install_capability' }
        });
        assert.equal(classification.class, 'capability_lifecycle');
        assert.equal(classification.mutates, true);
        assert.equal(classification.requiresApprovalCapable, true);
    } finally {
        await runtime.shutdown();
    }
});
