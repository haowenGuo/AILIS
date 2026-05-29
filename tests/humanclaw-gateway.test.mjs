import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { HumanClawGateway } = require('../electron/humanclaw-gateway.cjs');

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

test('HumanClaw Gateway exposes health, tools, guarded tool calls, and audit', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'humanclaw-gateway-test-'));
    const gateway = new HumanClawGateway({
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

        const audit = await jsonFetch(`${baseUrl}/audit?limit=10`);
        assert.equal(audit.body.ok, true);
        assert.ok(audit.body.entries.length >= 4);
    } finally {
        await gateway.stop();
    }
});

test('HumanClaw Gateway default context can enable full computer control', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'humanclaw-full-control-test-'));
    const gateway = new HumanClawGateway({
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

test('HumanClaw Gateway event stream keeps cursor-addressable replay history', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'humanclaw-events-test-'));
    const gateway = new HumanClawGateway({
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
