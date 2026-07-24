import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { AILISGateway } = require('../electron/ailis-gateway.cjs');
const {
    AILISComputerTool,
    resolveTargetPath,
    commonUserRoots
} = require('../electron/ailis-computer-tool.cjs');
const { AILISPlatformAdapter } = require('../electron/ailis-platform-adapter.cjs');

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

test('AILIS computer path helpers resolve workspace and common roots', () => {
    const workspaceRoot = path.resolve('.');
    assert.equal(resolveTargetPath('note.txt', { workspaceDir: workspaceRoot }), path.join(workspaceRoot, 'note.txt'));
    assert.ok(commonUserRoots({ workspaceRoot, workspaceDir: workspaceRoot }).some((entry) => entry === workspaceRoot));
});

test('AILIS computer tool exposes OSWorld-style GUI actions through the platform adapter', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-computer-gui-test-'));
    const platformAdapter = new AILISPlatformAdapter({ platform: 'win32' });
    platformAdapter.desktopScreenshotCommand = ({ outputPath }) => ({
        supported: true,
        command: process.execPath,
        args: [
            '-e',
            `require('fs').mkdirSync(require('path').dirname(${JSON.stringify(outputPath)}), { recursive: true }); require('fs').writeFileSync(${JSON.stringify(outputPath)}, 'png'); console.log(JSON.stringify({ ok: true, path: ${JSON.stringify(outputPath)}, width: 2, height: 2 }));`
        ]
    });
    platformAdapter.guiInputCommand = ({ action }) => ({
        supported: true,
        command: process.execPath,
        args: ['-e', `console.log(JSON.stringify({ ok: true, action: ${JSON.stringify(action)} }))`]
    });
    platformAdapter.clipboardReadCommand = () => ({
        supported: true,
        command: process.execPath,
        args: ['-e', 'console.log(JSON.stringify({ ok: true, text: "clipboard text" }))']
    });
    platformAdapter.clipboardWriteCommand = ({ text }) => ({
        supported: true,
        command: process.execPath,
        args: ['-e', `console.log(JSON.stringify({ ok: true, bytes: ${Buffer.byteLength(text, 'utf8')} }))`]
    });

    const tool = new AILISComputerTool({
        workspaceRoot,
        platformAdapter
    });

    try {
        const schema = await tool.execute({ action: 'schema' }, {}, { workspaceRoot, platformAdapter });
        assert.ok(schema.details.schema.actions.includes('screen_screenshot'));
        assert.ok(schema.details.schema.actions.includes('mouse_click'));
        assert.equal(schema.details.schema.safety.guiInput, 'windows-powershell-user32');

        const screenshot = await tool.execute(
            { action: 'screen_screenshot', path: 'screen.png' },
            { workspace: workspaceRoot },
            { workspaceRoot, workspaceDir: workspaceRoot, platformAdapter }
        );
        assert.equal(screenshot.details.status, 'completed');
        assert.equal(screenshot.details.width, 2);
        assert.ok(screenshot.content.some((entry) => entry.type === 'image'));

        const clickNeedsApproval = await tool.execute(
            { action: 'mouse_click', x: 10, y: 12 },
            { workspace: workspaceRoot },
            { workspaceRoot, platformAdapter }
        );
        assert.equal(clickNeedsApproval.details.status, 'needs_approval');

        const click = await tool.execute(
            { action: 'click', x: 10, y: 12 },
            { workspace: workspaceRoot, approved: true },
            { workspaceRoot, platformAdapter }
        );
        assert.equal(click.details.status, 'completed');
        assert.equal(click.details.action, 'mouse_click');

        const clipboardRead = await tool.execute(
            { action: 'clipboard_read' },
            { workspace: workspaceRoot },
            { workspaceRoot, platformAdapter }
        );
        assert.equal(clipboardRead.details.text, 'clipboard text');

        const clipboardWrite = await tool.execute(
            { action: 'clipboard_write', text: 'hello' },
            { workspace: workspaceRoot, approved: true },
            { workspaceRoot, platformAdapter }
        );
        assert.equal(clipboardWrite.details.status, 'completed');
    } finally {
        await tool.shutdown();
    }
});

test('AILIS computer exec_command delegates process spawn through the platform adapter', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-computer-spawn-adapter-'));
    const platformAdapter = new AILISPlatformAdapter({
        platform: 'android',
        hostPlatform: process.platform
    });
    platformAdapter.commandSpawnSpec = (command, { cwd, env } = {}) => ({
        supported: true,
        command: process.execPath,
        args: ['-e', `console.log('ADAPTER_SPAWN:' + ${JSON.stringify(command)})`],
        options: {
            cwd,
            shell: false,
            windowsHide: process.platform === 'win32',
            env: {
                ...process.env,
                ...(env || {})
            }
        }
    });

    const tool = new AILISComputerTool({
        workspaceRoot,
        platformAdapter
    });

    try {
        const result = await tool.execute(
            { action: 'exec_command', command: 'echo from-device', yield_time_ms: 3000, max_output_tokens: 1000 },
            { workspace: workspaceRoot, approved: true },
            { workspaceRoot, workspaceDir: workspaceRoot, platformAdapter }
        );
        assert.equal(result.details.status, 'completed');
        assert.match(result.details.output, /ADAPTER_SPAWN:echo from-device/);
    } finally {
        await tool.shutdown();
    }
});

test('AILIS computer tool provides filesystem and process control with approval gates', async () => {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-computer-test-'));
    const gateway = new AILISGateway({
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
        assert.equal(schema.body.result.details.schema.safety.platform.capabilities.pty, true);
        assert.equal(schema.body.result.details.schema.safety.platform.capabilities.shell, true);

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

        await fs.writeFile(path.join(workspaceRoot, 'sample.docx'), Buffer.from([0x50, 0x4b, 0x03, 0x04, 0x00, 0x00, 0x00, 0x00]));
        const binaryRead = await callTool(baseUrl, {
            tool: 'computer',
            args: { action: 'read', path: 'sample.docx' },
            context: { workspace: workspaceRoot }
        });
        assert.equal(binaryRead.body.ok, false);
        assert.equal(binaryRead.body.status, 'binary_file');
        assert.match(binaryRead.body.result.details.suggestedNext.query, /Word\/DOCX document/);

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

        const execWithArgs = await callTool(baseUrl, {
            tool: 'computer',
            args: {
                action: 'exec',
                command: process.execPath,
                args: ['-e', "console.log('COMPUTER_EXEC_ARGS_OK')"],
                timeoutMs: 10000
            },
            context: { workspace: workspaceRoot, approved: true }
        });
        assert.equal(execWithArgs.body.ok, true, execWithArgs.body.error);
        assert.match(execWithArgs.body.result.details.stdout, /COMPUTER_EXEC_ARGS_OK/);

        const silentExec = await callTool(baseUrl, {
            tool: 'computer',
            args: {
                action: 'exec',
                command: process.execPath,
                args: ['-e', 'process.exit(0)'],
                timeoutMs: 10000
            },
            context: { workspace: workspaceRoot, approved: true }
        });
        assert.equal(silentExec.body.ok, true, silentExec.body.error);
        assert.equal(silentExec.body.result.details.outputEmpty, true);
        assert.match(silentExec.body.result.content[0].text, /stdout=<empty>/);

        const session = await callTool(baseUrl, {
            tool: 'computer',
            args: {
                action: 'session_start',
                command: 'node -e "console.log(\'SESSION_READY\'); setTimeout(function(){}, 30000)"',
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

        const unifiedNeedsApproval = await callTool(baseUrl, {
            tool: 'computer',
            args: { action: 'exec_command', cmd: 'node -e "console.log(1)"', yield_time_ms: 100 },
            context: { workspace: workspaceRoot }
        });
        assert.equal(unifiedNeedsApproval.body.ok, false);
        assert.equal(unifiedNeedsApproval.body.status, 'needs_approval');

        const unifiedExec = await callTool(baseUrl, {
            tool: 'computer',
            args: {
                action: 'exec_command',
                cmd: 'node -e "console.log(\'UNIFIED_READY\'); setTimeout(function(){}, 30000)"',
                yield_time_ms: 300,
                max_output_tokens: 2000
            },
            context: { workspace: workspaceRoot, approved: true }
        });
        assert.equal(unifiedExec.body.ok, true, unifiedExec.body.error);
        assert.ok(unifiedExec.body.result.details.session_id);
        assert.equal(unifiedExec.body.result.details.exit_code, null);
        assert.equal(typeof unifiedExec.body.result.details.original_token_count, 'number');

        let unifiedPoll = null;
        for (let attempt = 0; attempt < 10; attempt += 1) {
            unifiedPoll = await callTool(baseUrl, {
                tool: 'computer',
                args: {
                    action: 'write_stdin',
                    session_id: unifiedExec.body.result.details.session_id,
                    chars: '',
                    yield_time_ms: 300,
                    max_output_tokens: 2000
                },
                context: { workspace: workspaceRoot }
            });
            if (/UNIFIED_READY/.test(unifiedPoll.body.result?.details?.output || '')) {
                break;
            }
        }
        assert.equal(unifiedPoll.body.ok, true, unifiedPoll.body.error);
        assert.match(unifiedPoll.body.result.details.output, /UNIFIED_READY/);

        const unifiedKilled = await callTool(baseUrl, {
            tool: 'computer',
            args: { action: 'process_kill', sessionId: unifiedExec.body.result.details.session_id },
            context: { workspace: workspaceRoot, approved: true }
        });
        assert.equal(unifiedKilled.body.ok, true, unifiedKilled.body.error);

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
