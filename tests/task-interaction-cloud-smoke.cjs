// Explicitly opt-in: uses the configured-in-source AILIS public service, no personal keys.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { AILISGateway } = require('../electron/ailis-gateway.cjs');
const { AILISTaskInteraction } = require('../electron/ailis-task-interaction.cjs');
const { DEFAULT_PROVIDER_BASE_URLS } = require('../electron/desktop-llm-provider.cjs');
if (process.env.AILIS_ALLOW_ONLINE_SMOKE !== '1') throw new Error('Online smoke requires explicit AILIS_ALLOW_ONLINE_SMOKE=1');
(async () => {
    const temp = path.resolve('tmp'); fs.mkdirSync(temp, { recursive: true });
    const root = fs.mkdtempSync(path.join(temp, 'task-cloud-smoke-'));
    const sessionId = path.basename(root); // Isolate provider-side cache/session keys as well as local files.
    const gateway = new AILISGateway({ port: 0, workspaceRoot: root, projectRoot: path.resolve('.'), auditDir: path.join(root, '.audit'),
        profileCurationEnabled: false, getDefaultContext: () => ({
            // Explicit test-only workspace policy; never grant the smoke access outside its temp root.
            permissionProfile: 'workspace-write', approvalPolicy: 'auto', confirmationPolicy: 'auto',
            approved: true, autoConfirm: true, executeExternal: true,
            allowOutsideWorkspace: false, allowComputerWideAccess: false, allowSystemMutation: false
        }) });
    const host = new AILISTaskInteraction({ rootDir: path.join(root, '.interaction'), gateway, getSettings: () => ({
        provider: 'ailis-cloud', baseUrl: DEFAULT_PROVIDER_BASE_URLS['ailis-cloud'], model: 'ailis-cloud', temperature: 0, timeoutMs: 60000
    }) });
    let deadline;
    try {
        const firstCall = new Promise(resolve => gateway.on('event', event => { if (event.type === 'agent.llm_call.started') resolve(); }));
        const text = process.argv.includes('--plain-request')
            ? '只在当前工作目录用 EXEC 编排调用 apply_patch 创建 interaction-smoke.txt，内容为 ready，然后读回验证。不要操作其他目录或访问网络。'
            : '这是开发者授权的本地交互烟测。只在当前工作目录用 EXEC 编排调用 apply_patch 创建 interaction-smoke.txt，内容一行 ready，然后读回验证。不要访问其他目录或网络，不要启动后台程序。最后简短报告结果。';
        const receipt = await host.submit({ sessionId, clientMessageId: 'cloud-smoke-first',
            text });
        assert.equal(receipt.ok, true);
        deadline = setTimeout(() => { void host.stop({ sessionId, expectedRunId: receipt.runId }).catch(() => {}); }, 150000);
        await Promise.race([firstCall, host.active.get(sessionId).promise]);
        const extra = await host.submit({ sessionId, expectedRunId: receipt.runId, clientMessageId: 'cloud-smoke-extra',
            text: '追加要求：保持文件内容为 ready；最终报告须包含“追加已收到”。' });
        await host.active.get(sessionId)?.promise;
        const run = host.snapshot(sessionId).runs[0];
        const tools = run.items.filter(item => item.kind === 'tool').map(item => ({ tool: item.tool, status: item.status }));
        const final = run.items.find(item => item.kind === 'assistant')?.text || '';
        const actual = fs.existsSync(path.join(root, 'interaction-smoke.txt')) ? fs.readFileSync(path.join(root, 'interaction-smoke.txt'), 'utf8').trim() : null;
        const artifact = run.items.find(item => item.kind === 'file' && item.name === 'interaction-smoke.txt');
        const ok = run.status === 'completed' && actual === 'ready' && Boolean(artifact) && tools.some(item => item.tool === 'exec') &&
            tools.some(item => item.tool === 'apply_patch') && extra.ok && run.items.find(item => item.id === 'cloud-smoke-extra')?.status === 'included' && final.includes('追加已收到');
        const summary = { ok, requestVariant: process.argv.includes('--plain-request') ? 'plain' : 'authorization-prefixed', provider: 'ailis-cloud', status: run.status, tools, fileVerified: actual === 'ready', artifactVerified: Boolean(artifact),
            appendStatus: run.items.find(item => item.id === 'cloud-smoke-extra')?.status, final, error: run.error || '', root };
        fs.writeFileSync(path.join(root, 'summary.json'), JSON.stringify(summary, null, 2));
        console.log(JSON.stringify(summary));
        if (!ok) process.exitCode = 1;
    } finally { clearTimeout(deadline); host.dispose(); await gateway.stop(); }
})().catch(error => { console.error(error.message); process.exitCode = 1; });
