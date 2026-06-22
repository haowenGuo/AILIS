import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { AILISGateway } = require('../electron/ailis-gateway.cjs');
const { getProfileTargets } = require('../electron/ailis-file-manager-tool.cjs');

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

async function callTool(baseUrl, payload) {
    return await jsonFetch(`${baseUrl}/tools/call`, {
        method: 'POST',
        body: JSON.stringify(payload)
    });
}

async function runAgent(baseUrl, payload) {
    return await jsonFetch(`${baseUrl}/agent/run`, {
        method: 'POST',
        body: JSON.stringify(payload)
    });
}

test('AILIS file manager profiles expose safe C drive cleanup targets', () => {
    const targets = getProfileTargets('c_drive_safe', {
        workspaceRoot: path.resolve('.'),
        workspaceDir: path.resolve('.')
    });
    assert.ok(targets.length >= 1);
    assert.ok(!targets.some((target) => /^[A-Za-z]:\\?$/i.test(target)));
});

test('AILIS Gateway scans, plans, quarantines, and organizes files safely', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-file-manager-test-'));
    const gateway = new AILISGateway({
        port: 0,
        workspaceRoot,
        projectRoot: path.resolve('.'),
        auditDir: path.join(workspaceRoot, '.audit')
    });

    const junkFile = path.join(workspaceRoot, 'old.tmp');
    const photoFile = path.join(workspaceRoot, 'photo.jpg');
    await fs.writeFile(junkFile, 'junk');
    await fs.writeFile(photoFile, 'image');

    try {
        const status = await gateway.start();
        const baseUrl = status.url;

        const tools = await jsonFetch(`${baseUrl}/tools`);
        assert.equal(tools.body.ok, true);
        assert.ok(tools.body.localTools.some((tool) => tool.id === 'file_manager'));

        const schema = await callTool(baseUrl, {
            tool: 'file_manager',
            args: { action: 'schema' },
            context: { workspace: workspaceRoot }
        });
        assert.equal(schema.body.ok, true, schema.body.error);
        assert.match(JSON.stringify(schema.body.result.details), /schema/);

        const scan = await callTool(baseUrl, {
            tool: 'file_manager',
            args: { action: 'scan', target: workspaceRoot, minAgeDays: 0 },
            context: { workspace: workspaceRoot }
        });
        assert.equal(scan.body.ok, true, scan.body.error);
        assert.ok(scan.body.result.details.candidates.some((candidate) => candidate.path.endsWith('old.tmp')));

        const cleanPlan = await callTool(baseUrl, {
            tool: 'file_manager',
            args: { action: 'clean', target: workspaceRoot, minAgeDays: 0, dryRun: true },
            context: { workspace: workspaceRoot }
        });
        assert.equal(cleanPlan.body.ok, true, cleanPlan.body.error);
        assert.equal(cleanPlan.body.result.details.dryRun, true);

        const cleanNeedsApproval = await callTool(baseUrl, {
            tool: 'file_manager',
            args: { action: 'clean', target: workspaceRoot, minAgeDays: 0, dryRun: false },
            context: { workspace: workspaceRoot }
        });
        assert.equal(cleanNeedsApproval.body.ok, false);
        assert.equal(cleanNeedsApproval.body.status, 'needs_approval');

        const clean = await callTool(baseUrl, {
            tool: 'file_manager',
            args: {
                action: 'clean',
                target: workspaceRoot,
                minAgeDays: 0,
                dryRun: false,
                quarantineDir: path.join(workspaceRoot, '.quarantine')
            },
            context: { workspace: workspaceRoot, approved: true }
        });
        assert.equal(clean.body.ok, true, clean.body.error);
        assert.equal(clean.body.result.details.mode, 'quarantine');
        await assert.rejects(() => fs.access(junkFile));
        assert.equal(clean.body.result.details.moved.length, 1);

        const organizePlan = await callTool(baseUrl, {
            tool: 'file_manager',
            args: { action: 'organize', source: workspaceRoot, destination: path.join(workspaceRoot, 'Organized'), dryRun: true },
            context: { workspace: workspaceRoot }
        });
        assert.equal(organizePlan.body.ok, true, organizePlan.body.error);
        assert.equal(organizePlan.body.result.details.dryRun, true);
        assert.ok(organizePlan.body.result.details.plan.some((item) => item.bucket === 'Images'));

        const classifyCleanup = await runAgent(baseUrl, {
            sessionId: 'file-manager-test',
            message: '清理 C盘垃圾文件',
            classifyOnly: true
        });
        assert.equal(classifyCleanup.body.ok, true);
        assert.equal(classifyCleanup.body.intent, 'file_management');
        assert.equal(classifyCleanup.body.plan[0].tool, 'file_manager');
        assert.equal(classifyCleanup.body.plan[0].args.profile, 'c_drive_safe');
        assert.equal(classifyCleanup.body.plan[0].args.dryRun, true);

        const audit = await jsonFetch(`${baseUrl}/audit?limit=30`);
        assert.equal(audit.body.ok, true);
        assert.ok(audit.body.entries.some((entry) => entry.tool === 'file_manager'));
    } finally {
        await gateway.stop();
    }
});
