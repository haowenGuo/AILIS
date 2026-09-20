'use strict';
// Diagnostic only. Boot the unmodified Electron entry, then use its real preload/IPC.
// No synthetic provider response, forced tool choice, prompt patch or executor patch.
const { app, BrowserWindow } = require('electron');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { randomBytes, createHash } = require('node:crypto');
const sourceRoot = path.resolve(__dirname, '..');
const artifacts = path.join(sourceRoot, '.codex-memory');
fs.mkdirSync(artifacts, { recursive: true });
const runRoot = fs.mkdtempSync(path.join(artifacts, 'live-codex-exec-'));
const profile = path.join(runRoot, 'profile');
const audit = path.join(runRoot, 'audit');
fs.mkdirSync(profile);
app.setPath('userData', profile);
app.disableHardwareAcceleration();
process.env.AILIS_GATEWAY_PORT = '29843';
process.env.AILIS_PROFILE_CURATION_START_DELAY_MS = '86400000';
for (const key of Object.keys(process.env)) {
    if (/^(AILIS_(AGENT_)?LLM_|OPENAI_|DEEPSEEK_|ARK_|DOUBAO_|VOLCENGINE_)/i.test(key)) delete process.env[key];
}
delete process.env.AILIS_WORLD_SERVICE_ONLY;
delete process.env.AILIS_DESKTOP_DEV_URL;
const store = require('../electron/store.cjs');
// Register before main's ready callback: screen-dependent defaults need ready,
// and the isolated profile must exist before main loads its saved preferences.
app.whenReady().then(() => {
const state = store.getDefaultState();
Object.assign(state.preferences, { llmProvider: 'ailis-cloud',
    llmBaseUrl: 'https://101.133.239.56/api/llm/v1', llmModel: 'ailis-cloud',
    llmApiKey: '', llmApiKeyProfiles: {} });
state.preferences.ailisStateDir = audit;
state.preferences.speechMode = 'off';
state.preferences.autoChatMode = 'off';
state.controlWindow.visible = false;
store.saveDesktopState(app, state);
});
const challengeFile = path.join(runRoot, 'challenge.txt');
const challenge = randomBytes(48).toString('hex') + '\n';
fs.writeFileSync(challengeFile, challenge, { flag: 'wx' });
const expectedSha256 = createHash('sha256').update(challenge).digest('hex');
const report = { startedAt: new Date().toISOString(), pid: process.pid, sourceRoot,
    profile, audit, runRoot, entry: 'original Electron main + original preload + real gateway-agent-run IPC',
    chatUiClickTested: false, appVersion: JSON.parse(fs.readFileSync(path.join(sourceRoot, 'package.json'))).version,
    requests: [], expectedSha256, applicationTurnPassed: false };
const originalFetch = global.fetch;
const observations = [];
global.fetch = async (url, options = {}) => {
    const target = new URL(String(url));
    if (!target.pathname.startsWith('/api/llm/')) return originalFetch(url, options);
    let requestBody = {};
    try { requestBody = JSON.parse(options.body || '{}'); } catch {}
    const row = { host: target.host, path: target.pathname, method: options.method || 'GET',
        requestedModelAlias: requestBody.model, startedAt: new Date().toISOString(),
        topLevelTools: (requestBody.tools || []).map(t => t.function?.name || t.name).filter(Boolean) };
    report.requests.push(row);
    console.log(JSON.stringify({ event: 'provider_request', host: row.host, path: row.path, tools: row.topLevelTools }));
    const start = Date.now();
    try {
        const response = await originalFetch(url, options);
        row.httpStatus = response.status;
        if (target.pathname.endsWith('/chat/completions')) {
            observations.push(response.clone().text().then(body => {
                const frames = response.headers.get('content-type')?.includes('text/event-stream')
                    ? body.split(/\r?\n/).filter(line => line.startsWith('data: ') && !line.includes('[DONE]')).map(line => { try { return JSON.parse(line.slice(6)); } catch { return {}; } })
                    : [JSON.parse(body)];
                row.responseIds = [...new Set(frames.map(f => f.id).filter(Boolean))];
                row.reportedModels = [...new Set(frames.map(f => f.model).filter(Boolean))];
                row.usage = frames.map(f => f.usage).filter(Boolean).at(-1) || null;
                row.publicErrors = frames.map(f => f.error?.message).filter(Boolean);
                row.elapsedMs = Date.now() - start;
            }).catch(error => { row.observationError = error.message; }));
        }
        return response;
    } catch (error) { row.error = error.message; row.elapsedMs = Date.now() - start; throw error; }
};
// Keep the isolated application's windows hidden; never touch the user's running app.
app.on('browser-window-created', (_event, window) => {
    window.on('show', () => window.hide());
});
const deadline = setTimeout(() => { report.error = 'Live probe exceeded 330-second bound'; finish(1); }, 330000);
let finishing = false;
async function finish(code) {
    if (finishing) return;
    finishing = true;
    clearTimeout(deadline);
    await Promise.race([Promise.allSettled(observations), new Promise(resolve => setTimeout(resolve, 5000))]);
    report.finishedAt = new Date().toISOString();
    fs.writeFileSync(path.join(runRoot, 'report.json'), JSON.stringify(report, null, 2));
    console.log(JSON.stringify({ event: 'probe_finished', report: path.join(runRoot, 'report.json'),
        status: report.result?.status, passed: report.applicationTurnPassed, error: report.error }));
    global.fetch = originalFetch;
    process.exitCode = code;
    app.quit();
    setTimeout(() => app.exit(code), 5000).unref();
}
require('../electron/main.cjs');
app.whenReady().then(async () => {
    const probe = new BrowserWindow({ show: false, webPreferences: {
        preload: path.join(sourceRoot, 'electron/preload.cjs'), contextIsolation: true, sandbox: false } });
    await probe.loadURL('about:blank');
    let preferences;
    for (let attempt = 0; attempt < 100; attempt++) {
        try { preferences = await probe.webContents.executeJavaScript('window.ailisDesktop.getPreferences()'); break; }
        catch { await new Promise(resolve => setTimeout(resolve, 100)); }
    }
    assert.ok(preferences, 'Original preference IPC did not become ready');
    report.effectiveConnection = { provider: preferences.llmProvider, baseUrl: preferences.llmBaseUrl,
        configuredModelAlias: preferences.llmModel, keyConfigured: Boolean(preferences.llmApiKeyConfigured) };
    assert.equal(preferences.llmProvider, 'ailis-cloud');
    assert.equal(preferences.llmBaseUrl, 'https://150.109.13.189/api/llm/v1');
    const sessionId = 'v143-codex-exec-' + Date.now();
    const message = `请实际运行 Python，计算 1 到 10000 的连续求和，并读取本地文件 ${challengeFile} 的原始字节，计算它的 SHA256。请把实际运行输出中的总和与完整 SHA256 都告诉我。`;
    report.sessionId = sessionId;
    report.testMessage = message;
    const payload = { sessionId, message, messageHistory: [], attachments: [],
        agentLoop: 'llm', directToolExecutor: true,
        context: { agentRole: 'unified_agent', unifiedAgent: true, runtimeKind: 'desktop' } };
    const start = Date.now();
    const result = await probe.webContents.executeJavaScript(`window.ailisDesktop.gateway.runAgent(${JSON.stringify(payload)})`);
    const reply = result.displayText || result.finalAnswer || result.answer || result.message || '';
    report.result = { ok: result.ok, status: result.status, runId: result.runId,
        reply, elapsedMs: Date.now() - start, resultKeys: Object.keys(result) };
    report.applicationTurnPassed = result.ok === true && result.status === 'completed'
        && reply.includes('50005000') && reply.includes(expectedSha256)
        && report.requests.filter(r => r.path.endsWith('/chat/completions')).length >= 2
        && report.requests.every(r => r.host === '150.109.13.189');
    await finish(report.applicationTurnPassed ? 0 : 1);
}).catch(async error => { report.error = error.message; await finish(1); });
