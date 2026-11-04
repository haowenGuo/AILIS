'use strict';
// Only the transport boundary is new. The frozen Gateway owns the entire loop.
const fs = require('node:fs');
const path = require('node:path');
const readline = require('node:readline');
const sendRaw = process.stdout.write.bind(process.stdout);
// Dependencies must not write diagnostic text into the ACP JSONL channel.
process.stdout.write = process.stderr.write.bind(process.stderr);
const send = value => sendRaw(JSON.stringify(value) + '\n');
const root = process.env.AILIS_PROJECT_ROOT;
const out = process.env.AILIS_LOG_DIR;
const { AILISGateway } = require(path.join(root, 'electron/ailis-gateway.cjs'));
const { AILISPlatformAdapter } = require(path.join(root, 'electron/ailis-platform-adapter.cjs'));
class ContainerPlatform extends AILISPlatformAdapter {
    protectedRoots() { return []; }
}
class BenchmarkGateway extends AILISGateway {
    async executeGatewayToolSearch(args = {}) {
        return super.executeGatewayToolSearch({ ...args, includeMcp: false, includeExternal: false });
    }
}
const settings = {
    provider: process.env.AILIS_PROVIDER,
    baseUrl: process.env.OPENAI_BASE_URL,
    apiKey: process.env.OPENAI_API_KEY,
    model: 'gpt-6-luna', reasoningEffort: 'xhigh', timeoutMs: 600000
};
const context = {
    agentRole: 'unified_agent', unifiedAgent: true,
    directToolExecutor: true, nativeDirectTools: true, approved: true,
    workspace: '/', workspaceDir: '/', workspaceRoot: '/', permissionProfile: 'danger-full-access',
    enableWebTools: true, taskAgentRoutingOwned: true, deferTaskHandoff: false,
    llmSettings: settings, agentDecisionReasoningEffort: 'xhigh'
};
const gateway = new BenchmarkGateway({
    port: 0, projectRoot: root, workspaceRoot: '/',
    platformAdapter: new ContainerPlatform({ platform: 'linux' }),
    auditDir: path.join(out, 'audit'), initializeOwnedWorkspace: false,
    toolAllowlist: ['exec', 'exec_wait', 'exec_command', 'write_stdin', 'apply_patch', 'view_image', 'tool_search', 'web_run'],
    directLocalToolIds: ['exec_command', 'write_stdin', 'apply_patch', 'view_image'],
    profileCurationEnabled: false, emberHarnessEnabled: false, getDefaultContext: () => context
});
process.env.AILIS_CODEX_PROTOCOL_AUDIT_PATH = path.join(out, 'transport.jsonl');
process.env.AILIS_CODEX_PROTOCOL_AUDIT_MODE = 'metadata';
gateway.on('event', event => {
    if (['agent.llm_call.completed', 'tool.call.started', 'tool.call.finished',
        'agent.context.compacted'].includes(event.type)) {
        fs.appendFileSync(path.join(out, 'events.jsonl'), JSON.stringify(event) + '\n');
        send({ type: 'event', event });
    }
});
let active = false;
let turn = 0;
let abort = null;
let stopping = false;
async function shutdown() {
    if (stopping) return;
    stopping = true;
    abort?.abort();
    const forceExit = setTimeout(() => process.exit(1), 4000);
    try { await gateway.stop(); }
    finally { clearTimeout(forceExit); process.exit(0); }
}
process.once('SIGTERM', shutdown);
process.once('SIGINT', shutdown);
const input = readline.createInterface({ input: process.stdin, crlfDelay: Infinity });
input.on('line', async line => {
    if (active) { send({ type: 'error', error: 'A prompt is already running' }); return; }
    active = true;
    try {
        const request = JSON.parse(line);
        if (typeof request.message !== 'string') throw new Error('Text prompt required');
        const started = Date.now();
        abort = new AbortController();
        const result = await gateway.runAgent({
            sessionId: process.env.AILIS_SESSION_ID, message: request.message,
            agentRole: 'unified_agent', planner: 'llm', agentLoop: 'llm', llmSettings: settings,
            context, onTextDelta: () => {}, abortSignal: abort.signal,
            modelTransportRecoveryDeadlineMs: started + 28800000
        });
        turn += 1;
        fs.writeFileSync(path.join(out, `turn-${turn}.json`), JSON.stringify({
            startedAt: new Date(started).toISOString(), finishedAt: new Date().toISOString(), result
        }, null, 2));
        send({ type: 'result', result });
    } catch (error) {
        // Never forward provider exceptions (which may contain request credentials).
        console.error('AILIS worker turn failed:', error?.code || error?.name || 'Error');
        send({ type: 'error', error: 'AILIS worker turn failed; inspect private runtime diagnostics' });
    } finally { active = false; abort = null; }
});
input.on('close', shutdown);
send({ type: 'ready' });
