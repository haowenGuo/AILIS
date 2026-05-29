import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { HumanClawGateway } = require('../electron/humanclaw-gateway.cjs');
const { resolveTargetPath, commonUserRoots } = require('../electron/humanclaw-computer-tool.cjs');

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

test('HumanClaw computer path helpers resolve workspace and common roots', () => {
    const workspaceRoot = path.resolve('.');
    assert.equal(resolveTargetPath('note.txt', { workspaceDir: workspaceRoot }), path.join(workspaceRoot, 'note.txt'));
    assert.ok(commonUserRoots({ workspaceRoot, workspaceDir: workspaceRoot }).some((entry) => entry === workspaceRoot));
});

test('HumanClaw computer tool provides filesystem and process control with approval gates', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'humanclaw-computer-test-'));
    const gateway = new HumanClawGateway({
        port: 0,
        workspaceRoot,
        projectRoot: path.resolve('.'),
        auditDir: path.join(workspaceRoot, '.audit')
    });

    try {
        const status = await gateway.start();
        const baseUrl = status.url;

        const tools = await jsonFetch(`${baseUrl}/tools`);
        assert.equal(tools.body.ok, true);
        assert.ok(tools.body.localTools.some((tool) => tool.id === 'computer'));

        const schema = await callTool(baseUrl, {
            tool: 'computer',
            args: { action: 'schema' },
            context: { workspace: workspaceRoot }
        });
        assert.equal(schema.body.ok, true, schema.body.error);
        assert.ok(schema.body.result.details.schema.actions.includes('session_start'));

        const writeBlocked = await callTool(baseUrl, {
            tool: 'computer',
            args: { action: 'write', path: 'note.txt', content: 'hello computer\n' },
            context: { workspace: workspaceRoot }
        });
        assert.equal(writeBlocked.body.ok, false);
        assert.equal(writeBlocked.body.status, 'needs_approval');

        const write = await callTool(baseUrl, {
            tool: 'computer',
            args: { action: 'write', path: 'note.txt', content: 'hello computer\n' },
            context: { workspace: workspaceRoot, approved: true }
        });
        assert.equal(write.body.ok, true, write.body.error);

        const read = await callTool(baseUrl, {
            tool: 'computer',
            args: { action: 'read', path: 'note.txt' },
            context: { workspace: workspaceRoot }
        });
        assert.equal(read.body.ok, true, read.body.error);
        assert.match(read.body.result.content[0].text, /hello computer/);

        const list = await callTool(baseUrl, {
            tool: 'computer',
            args: { action: 'list', path: '.' },
            context: { workspace: workspaceRoot }
        });
        assert.equal(list.body.ok, true, list.body.error);
        assert.ok(list.body.result.details.entries.some((entry) => entry.name === 'note.txt'));

        const search = await callTool(baseUrl, {
            tool: 'computer',
            args: { action: 'search', path: '.', name: '*.txt' },
            context: { workspace: workspaceRoot }
        });
        assert.equal(search.body.ok, true, search.body.error);
        assert.ok(search.body.result.details.results.some((entry) => entry.path.endsWith('note.txt')));

        const copyNeedsApproval = await callTool(baseUrl, {
            tool: 'computer',
            args: { action: 'copy', source: 'note.txt', target: 'copy.txt' },
            context: { workspace: workspaceRoot }
        });
        assert.equal(copyNeedsApproval.body.ok, false);
        assert.equal(copyNeedsApproval.body.status, 'needs_approval');

        const copy = await callTool(baseUrl, {
            tool: 'computer',
            args: { action: 'copy', source: 'note.txt', target: 'copy.txt' },
            context: { workspace: workspaceRoot, approved: true }
        });
        assert.equal(copy.body.ok, true, copy.body.error);

        const execNeedsApproval = await callTool(baseUrl, {
            tool: 'computer',
            args: { action: 'exec', command: 'node -e "console.log(1)"' },
            context: { workspace: workspaceRoot }
        });
        assert.equal(execNeedsApproval.body.ok, false);
        assert.equal(execNeedsApproval.body.status, 'needs_approval');

        const exec = await callTool(baseUrl, {
            tool: 'computer',
            args: { action: 'exec', command: 'node -e "console.log(\'COMPUTER_EXEC_OK\')"', timeoutMs: 10000 },
            context: { workspace: workspaceRoot, approved: true }
        });
        assert.equal(exec.body.ok, true, exec.body.error);
        assert.match(exec.body.result.details.stdout, /COMPUTER_EXEC_OK/);

        const session = await callTool(baseUrl, {
            tool: 'computer',
            args: {
                action: 'session_start',
                command: 'node -e "console.log(\'SESSION_READY\'); setTimeout(()=>{}, 30000)"',
                timeoutMs: 60000
            },
            context: { workspace: workspaceRoot, approved: true }
        });
        assert.equal(session.body.ok, true, session.body.error);
        const sessionId = session.body.result.details.session.id;

        let processRead = null;
        for (let attempt = 0; attempt < 10; attempt += 1) {
            await new Promise((resolve) => setTimeout(resolve, 500));
            processRead = await callTool(baseUrl, {
                tool: 'computer',
                args: { action: 'process_read', sessionId },
                context: { workspace: workspaceRoot }
            });
            if (/SESSION_READY/.test(processRead.body.result?.details?.session?.stdout || '')) {
                break;
            }
        }
        assert.equal(processRead.body.ok, true, processRead.body.error);
        assert.match(processRead.body.result.details.session.stdout, /SESSION_READY/);

        const processList = await callTool(baseUrl, {
            tool: 'computer',
            args: { action: 'process_list' },
            context: { workspace: workspaceRoot }
        });
        assert.equal(processList.body.ok, true, processList.body.error);
        assert.ok(processList.body.result.details.sessions.some((entry) => entry.id === sessionId));

        const killNeedsApproval = await callTool(baseUrl, {
            tool: 'computer',
            args: { action: 'process_kill', sessionId },
            context: { workspace: workspaceRoot }
        });
        assert.equal(killNeedsApproval.body.ok, false);
        assert.equal(killNeedsApproval.body.status, 'needs_approval');

        const killed = await callTool(baseUrl, {
            tool: 'computer',
            args: { action: 'process_kill', sessionId },
            context: { workspace: workspaceRoot, approved: true }
        });
        assert.equal(killed.body.ok, true, killed.body.error);

        const classifyList = await runAgent(baseUrl, {
            sessionId: 'computer-test',
            message: '列出目录 .',
            classifyOnly: true
        });
        assert.equal(classifyList.body.ok, true);
        assert.equal(classifyList.body.intent, 'computer_operation');
        assert.equal(classifyList.body.plan[0].tool, 'computer');

        const classifyProcess = await runAgent(baseUrl, {
            sessionId: 'computer-test',
            message: '后台运行 node -v',
            classifyOnly: true
        });
        assert.equal(classifyProcess.body.intent, 'computer_operation');
        assert.equal(classifyProcess.body.plan[0].args.action, 'session_start');
    } finally {
        await gateway.stop();
    }
});
