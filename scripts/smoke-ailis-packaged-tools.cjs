'use strict';

// Run with Node: node scripts/smoke-ailis-packaged-tools.cjs <win-unpacked>.
// Uses the packaged Electron executable and ASAR modules, a loopback fake model,
// and a disposable workspace. No provider requests or live user profile writes.
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const http = require('node:http');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

async function runProbe(packageDir) {
    const packageRoot = path.resolve(packageDir);
    const moduleRoot = path.join(packageRoot, 'resources', 'app.asar', 'electron');
    const { AILISGateway } = require(path.join(moduleRoot, 'ailis-gateway.cjs'));
    const { resolveCodeModeWorkerLaunch } = require(path.join(moduleRoot, 'ailis-code-mode-runtime.cjs'));
    const launch = resolveCodeModeWorkerLaunch();
    assert.match(launch.workerPath, /app\.asar\.unpacked/);
    assert.equal(launch.options.env.ELECTRON_RUN_AS_NODE, '1');
    assert.ok(launch.options.execArgv.includes('--permission'));
    const workspace = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-packaged-smoke-'));
    assert.equal(path.dirname(workspace), path.resolve(os.tmpdir()));
    const requests = [];
    const answer = ['JSON / exec / mkdir / AILIS_PROJECT_ROOT',
        '```powershell', "$exts = '*.cjs', '*.mjs', '*.json';", 'if ($true) {',
        '    Write-Output "exec JSON mkdir"', '}', '```'].join('\n');
    const readCommand = `$p = '${launch.workerPath.replace(/'/g, "''")}'; Get-Item -LiteralPath $p | Select-Object Name; (Get-Content -LiteralPath $p | Measure-Object -Line).Lines; Write-Output 'PACKAGED_READ_OK'`;
    const code = `text(await tools.exec_command(${JSON.stringify({ cmd: readCommand, workdir: workspace, max_output_tokens: 512 })}));\n` +
        `text(await tools.apply_patch(${JSON.stringify('*** Begin Patch\n*** Add File: packaged-probe.txt\n+JSON exec mkdir\n*** End Patch')}));`;
    const server = http.createServer(async (request, response) => {
        try {
            let body = ''; for await (const chunk of request) body += chunk;
            requests.push(JSON.parse(body));
            const first = requests.length === 1;
            response.writeHead(200, { 'content-type': 'application/json' });
            response.end(JSON.stringify({ choices: [{ message: first ? {
                role: 'assistant', content: '', tool_calls: [{ id: 'packaged-probe', type: 'function',
                    function: { name: 'exec', arguments: JSON.stringify({ input: code }) } }]
            } : { role: 'assistant', content: answer }, finish_reason: first ? 'tool_calls' : 'stop' }],
            usage: { prompt_tokens: 100, completion_tokens: 10, total_tokens: 110 } }));
        } catch (error) {
            response.writeHead(500); response.end('Local probe request failed');
        }
    });
    let gateway;
    try {
        await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
        gateway = new AILISGateway({ workspaceRoot: workspace, projectRoot: path.dirname(moduleRoot),
            auditDir: path.join(workspace, '.audit'), port: 0, disableBuiltinAilisResearchMcp: true,
            emberHarnessEnabled: false, profileCurationEnabled: false });
        const context = { agentRole: 'unified_agent', agentLoop: 'llm', directToolExecutor: true,
            approved: true, allowOutsideWorkspace: true,
            llmSettings: { provider: 'openai-compatible', baseUrl: `http://127.0.0.1:${server.address().port}/v1`,
                apiKey: 'local-test-only', model: 'test-model', temperature: 0, timeoutMs: 15000 } };
        const result = await gateway.runAgent({ message: 'Run the isolated packaged tool probe.', sessionId: 'packaged-smoke', context });
        assert.equal(result.status, 'completed', result.error || result.displayText);
        assert.equal(requests.length, 2);
        const observations = requests[1].messages.filter(m => m.role === 'tool').map(m => m.content).join('\n');
        assert.match(observations, /PACKAGED_READ_OK/);
        assert.doesNotMatch(observations, /write EPIPE|Script failed/);
        assert.equal((await fs.readFile(path.join(workspace, 'packaged-probe.txt'), 'utf8')).trim(), 'JSON exec mkdir');
        assert.equal(result.displayText, answer);
        assert.equal(result.surface.text, answer);
        await gateway.runAgent({ message: 'Recall the previous result.', sessionId: 'packaged-smoke', context });
        assert.equal(requests.length, 3);
        assert.ok(requests[2].messages.some(m => m.role === 'assistant' && m.content === answer));
        assert.ok(requests[2].messages.some(m => m.role === 'tool' && m.content.includes('PACKAGED_READ_OK')));
        console.log(JSON.stringify({ ok: true, electron: process.versions.electron,
            workerPath: launch.workerPath, checks: ['packaged exec', 'shell command', 'file read',
                'scratch apply_patch', 'verbatim final answer', 'follow-up context'], realProviderCalls: 0 }));
    } finally {
        await gateway?.stop();
        await new Promise(resolve => { server.close(resolve); server.closeAllConnections(); });
        await fs.rm(workspace, { recursive: true, force: true, maxRetries: 10, retryDelay: 100 });
    }
}

module.exports = { runProbe };
if (require.main === module) {
    const packageDir = process.argv[2];
    if (!packageDir) throw new Error('Usage: node scripts/smoke-ailis-packaged-tools.cjs <win-unpacked>');
    const root = path.resolve(packageDir);
    const exe = path.join(root, 'AILIS.exe');
    const code = `require(${JSON.stringify(__filename)}).runProbe(${JSON.stringify(root)}).then(()=>process.exit(0)).catch(e=>{console.error(e.stack);process.exit(1);});`;
    const result = spawnSync(exe, ['-e', code], { env: { ...process.env, ELECTRON_RUN_AS_NODE: '1' },
        windowsHide: true, encoding: 'utf8', timeout: 60000, maxBuffer: 2 * 1024 * 1024 });
    if (result.stdout) process.stdout.write(result.stdout);
    if (result.stderr) process.stderr.write(result.stderr);
    if (result.error) console.error(result.error.message);
    process.exitCode = result.status ?? 1;
}
