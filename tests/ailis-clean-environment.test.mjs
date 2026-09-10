import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
const require = createRequire(import.meta.url);
const runtimeRoot = process.env.AILIS_TEST_RUNTIME_ROOT || path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../electron');
const { AILISGateway } = require(path.join(runtimeRoot, 'ailis-gateway.cjs'));
const { AILISCodeModeRuntime } = require(path.join(runtimeRoot, 'ailis-code-mode-runtime.cjs'));
const { createAILISPlatformAdapter } = require(path.join(runtimeRoot, 'ailis-platform-adapter.cjs'));
const { applyLocalPatch } = require(path.join(runtimeRoot, 'ailis-local-patch.cjs'));
const { executeCodeTool } = require(path.join(runtimeRoot, 'ailis-code-tool.cjs'));

async function fixture(t, { missing = false, owned = false } = {}) {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-clean-'));
    const workspace = path.join(root, 'workspace 中文 with spaces');
    if (!missing) await fs.mkdir(workspace);
    const gateway = new AILISGateway({ port: 0, projectRoot: path.resolve(runtimeRoot, '..'), workspaceRoot: workspace,
        initializeOwnedWorkspace: owned, auditDir: path.join(root, 'state'), mcpServers: [],
        disableBuiltinAilisResearchMcp: true, emberHarnessEnabled: false, profileCurationEnabled: false });
    t.after(async () => { await gateway.stop(); await fs.rm(root, { recursive: true, force: true, maxRetries: 8, retryDelay: 100 }); });
    const call = (tool, args, context = {}) => gateway.callTool({ tool, args, context: { approved: true,
        permissionProfile: 'workspace-write', ...context } });
    return { root, workspace, gateway, call };
}

test('owned first-run workspace is initialized before tools are ready', async t => {
    const f = await fixture(t, { missing: true, owned: true });
    await f.gateway.start();
    assert((await fs.stat(f.workspace)).isDirectory());
});
test('explicit missing workspace is not silently created', async t => {
    const f = await fixture(t, { missing: true });
    await f.gateway.start();
    await assert.rejects(fs.stat(f.workspace), { code: 'ENOENT' });
});
test('failed gateway envelopes without result reject instead of becoming empty output', () => {
    const runtime = new AILISCodeModeRuntime({ dispatchTool() {} });
    for (const tool of ['exec_command', 'write_stdin', 'apply_patch', 'read']) {
        for (const extra of [{}, { details: { path: '/invalid' } }]) {
            assert.throws(() => runtime.projectNestedToolResult(tool, { ok: false, callId: 'probe', tool,
                status: 'blocked', error: 'DIRECTORY_INVALID_PROBE', ...extra }), /DIRECTORY_INVALID_PROBE/);
        }
    }
});
test('PowerShell and POSIX PTYs use the selected shell argument dialect', () => {
    const win = createAILISPlatformAdapter({ platform: 'win32' });
    assert.deepEqual(win.ptySpawnOptions({ executable: 'C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe', command: 'echo ok' }).args,
        ['-NoLogo', '-NoProfile', '-NonInteractive', '-Command', 'echo ok']);
    assert.deepEqual(win.ptySpawnOptions({ executable: 'cmd.exe', command: 'echo ok' }).args, ['/d', '/s', '/c', 'echo ok']);
    for (const platform of ['linux', 'darwin']) {
        const adapter = createAILISPlatformAdapter({ platform });
        assert.deepEqual(adapter.ptySpawnOptions({ executable: '/bin/zsh', command: 'echo ok', login: false }).args, ['-c', 'echo ok']);
    }
});
test('printing patch text does not invoke apply_patch', async t => {
    const f = await fixture(t);
    const patch = '*** Begin Patch\n*** Add File: unwanted.txt\n+NEVER_WRITE\n*** End Patch';
    const cmd = process.platform === 'win32' ? `Write-Output @'\n${patch}\n'@` : `printf '%s\\n' '${patch}'`;
    let response = await f.call('exec_command', { cmd, yield_time_ms: 1000 });
    let output = response.result?.details?.output || '';
    while (response.result?.details?.session_id) {
        response = await f.call('write_stdin', { session_id: response.result.details.session_id, chars: '', yield_time_ms: 1000 });
        output += response.result?.details?.output || '';
    }
    assert.match(output, /\*\*\* Begin Patch/);
    await assert.rejects(fs.stat(path.join(f.workspace, 'unwanted.txt')), { code: 'ENOENT' });
});
test('patch preflight failure does not leave earlier file edits', async t => {
    const f = await fixture(t);
    const response = await f.call('apply_patch', { input: '*** Begin Patch\n*** Add File: partial.txt\n+FIRST\n*** Update File: missing.txt\n@@\n-old\n+new\n*** End Patch' });
    assert.equal(response.ok, false);
    await assert.rejects(fs.stat(path.join(f.workspace, 'partial.txt')), { code: 'ENOENT' });
});
test('patch cannot escape workspace through a directory link', async t => {
    const f = await fixture(t);
    const outside = path.join(f.root, 'owned-outside'); await fs.mkdir(outside);
    await fs.symlink(outside, path.join(f.workspace, 'linked'), process.platform === 'win32' ? 'junction' : 'dir');
    const response = await f.call('apply_patch', { input: '*** Begin Patch\n*** Add File: linked/escaped.txt\n+NO\n*** End Patch' });
    assert.equal(response.ok, false);
    await assert.rejects(fs.stat(path.join(outside, 'escaped.txt')), { code: 'ENOENT' });
});
test('apply_patch failure is preserved through real gateway and EXEC projection', async t => {
    const f = await fixture(t);
    const response = await f.call('apply_patch', { input: '*** Begin Patch\n*** Add File: forbidden.txt\n+NO\n*** End Patch' }, { permissionProfile: 'read-only' });
    assert.equal(response.ok, false);
    assert.throws(() => f.gateway.codeModeRuntime.projectNestedToolResult('apply_patch', response), /read_only/);
});

test('missing cwd reports the invalid directory, not a missing shell or empty output', async t => {
    const f = await fixture(t);
    const workdir = path.join(f.workspace, 'missing-directory');
    const result = await f.call('exec_command', { cmd: 'echo CWD_PROBE', workdir, yield_time_ms: 1000 });
    assert.equal(result.ok, false);
    assert.throws(() => f.gateway.codeModeRuntime.projectNestedToolResult('exec_command', result), /invalid working directory.*missing-directory/i);
});

test('missing executable is a startup failure with error preserved', async t => {
    const f = await fixture(t);
    const result = await f.call('exec_command', { cmd: 'echo EXE_PROBE', shell: path.join(f.workspace, 'no-such-shell'), yield_time_ms: 1000 });
    assert.equal(result.ok, false);
    assert.throws(() => f.gateway.codeModeRuntime.projectNestedToolResult('exec_command', result), /ENOENT|no-such-shell/);
});

test('real explicit shell executes in both pipe and PTY modes', async t => {
    const f = await fixture(t);
    const shell = process.platform === 'win32' ? path.join(process.env.SystemRoot, 'System32/WindowsPowerShell/v1.0/powershell.exe') : '/bin/sh';
    for (const tty of [false, true]) {
        let result = await f.call('exec_command', { cmd: 'echo SHELL_PROBE_OK', shell, tty, login: false, yield_time_ms: 1000 });
        assert.equal(result.ok, true, JSON.stringify(result));
        let output = result.result.details.output || '';
        for (let i = 0; result.result.details.session_id && i < 10; i++) {
            result = await f.call('write_stdin', { session_id: result.result.details.session_id, yield_time_ms: 1000 });
            output += result.result.details.output || '';
        }
        assert.equal(result.result.details.exit_code, 0, JSON.stringify(result));
        assert.match(output, /SHELL_PROBE_OK/);
    }
});

test('normal nonzero exit preserves the exit code and stderr for the model', async t => {
    const f = await fixture(t);
    const shell = process.platform === 'win32' ? 'cmd.exe' : '/bin/sh';
    const cmd = process.platform === 'win32' ? 'echo EXIT_PROBE_ERROR 1>&2 & exit 7' : 'echo EXIT_PROBE_ERROR >&2; exit 7';
    const result = await f.call('exec_command', { cmd, shell, login: false, yield_time_ms: 1000 });
    const projected = f.gateway.codeModeRuntime.projectNestedToolResult('exec_command', result);
    assert.equal(projected.exit_code, 7);
    assert.match(projected.output, /EXIT_PROBE_ERROR/);
});

test('a timed-out running command cannot become a successful empty EXEC result', async t => {
    const f = await fixture(t);
    const shell = process.platform === 'win32' ? path.join(process.env.SystemRoot, 'System32/WindowsPowerShell/v1.0/powershell.exe') : '/bin/sh';
    const cmd = process.platform === 'win32' ? "Write-Output 'BEFORE_TIMEOUT'; Start-Sleep -Seconds 3" : "echo BEFORE_TIMEOUT; exec sleep 3";
    // Use the computer API's existing configurable deadline; the public
    // exec_command schema intentionally does not expose timeoutMs.
    let result = await f.call('computer', { action: 'exec_command', cmd, shell, login: false, timeoutMs: 1000, yield_time_ms: 1000 });
    for (let i = 0; result.result?.details?.session_id && i < 5; i++) {
        result = await f.call('write_stdin', { session_id: result.result.details.session_id, yield_time_ms: 1000 });
    }
    assert.equal(result.ok, false, JSON.stringify(result));
    assert.equal(result.result.details.process_status, 'timeout');
    assert.throws(() => f.gateway.codeModeRuntime.projectNestedToolResult('exec_command', result), error => {
        assert.match(error.message, /timed out/i);
        assert.match(error.message, /BEFORE_TIMEOUT/);
        return true;
    });
});

test('owned workspace initialization fails explicitly when its path is a file', async t => {
    const f = await fixture(t, { missing: true, owned: true });
    await fs.writeFile(f.workspace, 'NOT_A_DIRECTORY');
    await assert.rejects(f.gateway.start(), error => {
        assert.equal(error.code, 'workspace_initialization_failed');
        assert.match(error.message, /Cannot initialize AILIS workspace/);
        return true;
    });
    assert.equal(f.gateway.server, null);
});

test('patch commit rollback preserves and reports concurrent edits', async t => {
    const f = await fixture(t);
    const first = path.join(f.workspace, 'first.txt');
    await fs.writeFile(first, 'ORIGINAL');
    const io = { ...fs, async rename(from, to) {
        if (to === path.join(f.workspace, 'second.txt')) {
            await fs.writeFile(first, 'EXTERNAL_EDIT');
            throw new Error('INJECTED_SECOND_COMMIT_FAILURE');
        }
        return fs.rename(from, to);
    } };
    await assert.rejects(applyLocalPatch({
        operations: [{ type: 'add', path: 'first.txt', body: 'NEW' }, { type: 'add', path: 'second.txt', body: 'SECOND' }],
        resolveTarget: p => path.join(f.workspace, p), addText: text => text, updateText: text => text, io
    }), error => {
        assert.deepEqual(error.details.restored, []);
        assert.equal(error.details.rollbackFailed[0].path, first);
        assert.match(error.details.rollbackFailed[0].error, /concurrent change/);
        return true;
    });
    assert.equal(await fs.readFile(first, 'utf8'), 'EXTERNAL_EDIT');
});

test('atomic patch replacement does not bypass a read-only target file', async t => {
    const f = await fixture(t);
    const target = path.join(f.workspace, 'readonly.txt');
    await fs.writeFile(target, 'ORIGINAL\n');
    await fs.chmod(target, 0o444);
    try {
        const result = await f.call('apply_patch', { input: '*** Begin Patch\n*** Update File: readonly.txt\n@@\n-ORIGINAL\n+UNEXPECTED\n*** End Patch' });
        assert.equal(result.ok, false, JSON.stringify(result));
        assert.equal(await fs.readFile(target, 'utf8'), 'ORIGINAL\n');
    } finally { await fs.chmod(target, 0o644); }
});

test('patch commit failure restores already replaced files', async t => {
    const f = await fixture(t);
    const first = path.join(f.workspace, 'first.txt');
    await fs.writeFile(first, 'ORIGINAL');
    const io = { ...fs, async rename(from, to) {
        if (to === path.join(f.workspace, 'second.txt')) throw new Error('INJECTED_RENAME_FAILURE');
        return fs.rename(from, to);
    } };
    await assert.rejects(applyLocalPatch({
        operations: [{ type: 'add', path: 'first.txt', body: 'NEW' }, { type: 'add', path: 'second.txt', body: 'SECOND' }],
        resolveTarget: p => path.join(f.workspace, p), addText: text => text, updateText: text => text, io
    }), error => { assert.match(error.message, /INJECTED_RENAME_FAILURE/); assert.equal(error.details.restored.length, 1); assert.deepEqual(error.details.rollbackFailed, []); return true; });
    assert.equal(await fs.readFile(first, 'utf8'), 'ORIGINAL');
    assert.deepEqual(await fs.readdir(f.workspace), ['first.txt']);
});

test('patch add, update and delete preserve successful behavior', async t => {
    const f = await fixture(t);
    for (const input of [
        '*** Begin Patch\n*** Add File: lifecycle.txt\n+old\n*** End Patch',
        '*** Begin Patch\n*** Update File: lifecycle.txt\n@@\n-old\n+new\n*** End Patch'
    ]) assert.equal((await f.call('apply_patch', { input })).ok, true);
    assert.equal(await fs.readFile(path.join(f.workspace, 'lifecycle.txt'), 'utf8'), 'new\n');
    assert.equal((await f.call('apply_patch', { input: '*** Begin Patch\n*** Delete File: lifecycle.txt\n*** End Patch' })).ok, true);
    await assert.rejects(fs.stat(path.join(f.workspace, 'lifecycle.txt')), { code: 'ENOENT' });
});

test('Agent Loop -> EXEC worker -> local tools -> model-visible receipt works without a real provider', async t => {
    const f = await fixture(t, { missing: true, owned: true });
    await f.gateway.start();
    let scenario;
    const server = http.createServer(async (req, res) => {
        let body = ''; for await (const chunk of req) body += chunk;
        const request = JSON.parse(body); scenario.requests.push(request);
        const first = scenario.requests.length === 1;
        res.writeHead(200, { 'content-type': 'application/json' });
        res.end(JSON.stringify({ choices: [{ message: first ? {
            role: 'assistant', content: '', tool_calls: [{ id: 'isolated-exec-probe', type: 'function',
                function: { name: 'exec', arguments: JSON.stringify({ input: scenario.code }) } }]
        } : { role: 'assistant', content: 'LOCAL_TEST_COMPLETE' }, finish_reason: first ? 'tool_calls' : 'stop' }],
        usage: { prompt_tokens: 100, completion_tokens: 10, total_tokens: 110 } }));
    });
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    t.after(() => new Promise(resolve => server.close(resolve)));
    const patch = '*** Begin Patch\n*** Add File: via-exec.txt\n+EXEC_PATCH_OK\n*** End Patch';
    const cases = [
        // Shell startup may legitimately yield a live session on a busy clean VM.
        // The deterministic provider fixture must consume that session, just as
        // a caller would, before asserting the final stdout. No runtime timeout
        // or model instruction is changed by this test-only lifecycle handling.
        { name: 'success', code: `let r=await tools.exec_command({cmd:"echo EXEC_COMMAND_OK"});text(r);for(let n=0;r.session_id&&n<30;n++){r=await tools.write_stdin({session_id:r.session_id,chars:"",yield_time_ms:1000});text(r);}if(r.session_id)throw Error("Probe shell did not finish");text(await tools.apply_patch(${JSON.stringify(patch)}));`, expected: /EXEC_COMMAND_OK/, permission: 'workspace-write' },
        { name: 'invalid-cwd', code: `text(await tools.exec_command({cmd:"echo NEVER",workdir:${JSON.stringify(path.join(f.workspace, 'missing-directory'))}}));`, expected: /Invalid working directory/, permission: 'workspace-write' },
        { name: 'denied-patch', code: `text(await tools.apply_patch(${JSON.stringify(patch)}));`, expected: /read_only/, permission: 'read-only' }
    ];
    for (const c of cases) {
        scenario = { ...c, requests: [] };
        const result = await f.gateway.runAgent({ message: 'Run isolated contract probe.', sessionId: `clean-${c.name}`,
            context: { agentRole: 'unified_agent', agentLoop: 'llm', directToolExecutor: true,
                approved: true, permissionProfile: c.permission,
                llmSettings: { provider: 'openai-compatible', baseUrl: `http://127.0.0.1:${server.address().port}/v1`,
                    apiKey: 'loopback-fixture-not-a-real-key', model: 'local-fixture', temperature: 0, timeoutMs: 15000 } } });
        assert.equal(result.status, 'completed', JSON.stringify(result));
        assert.equal(scenario.requests.length, 2);
        const observation = scenario.requests[1].messages.filter(m => m.role === 'tool').map(m => m.content).join('\n');
        assert.match(observation, c.expected);
        if (c.name === 'success') assert.equal(await fs.readFile(path.join(f.workspace, 'via-exec.txt'), 'utf8'), 'EXEC_PATCH_OK\n');
    }
});

test('project TypeScript diagnostics use the bundled compiler without npx on PATH', async t => {
    const f = await fixture(t);
    await fs.writeFile(path.join(f.workspace, 'tsconfig.json'), JSON.stringify({ compilerOptions: { noEmit: true, types: [] }, files: ['input.ts'] }));
    await fs.writeFile(path.join(f.workspace, 'input.ts'), 'const value: number = "bad";\n');
    const result = await executeCodeTool({ action: 'lsp_diagnostics', path: f.workspace }, { approved: true }, { workspaceRoot: f.workspace });
    assert.equal(result.details.exitCode, 2, JSON.stringify(result));
    assert.match(result.details.stdout, /TS2322/);
});

test('LSP availability detects the application dependency, not a global CLI', async t => {
    const f = await fixture(t);
    const result = await executeCodeTool({ action: 'lsp_status', cwd: f.workspace }, {}, { workspaceRoot: f.workspace });
    assert.equal(result.details.typescriptLanguageServerAvailable, true);
});

test('missing optional Python runtime is identified without blaming the shell or provider', async t => {
    const f = await fixture(t);
    await fs.writeFile(path.join(f.workspace, 'sample.csv'), 'name,value\nprobe,1\n');
    const result = await f.call('artifact_import', { path: 'sample.csv', parserId: 'table', python: path.join(f.workspace, 'missing-python') });
    assert.equal(result.ok, false);
    assert.equal(result.result?.details?.code, 'dependency_unavailable', JSON.stringify(result));
    assert.equal(result.result.details.dependency, 'python');
    assert.match(result.result.details.cause, /ENOENT/);
});
