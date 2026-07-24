import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { AILISGateway } = require('../electron/ailis-gateway.cjs');

async function jsonFetch(url, options = {}) {
    const response = await fetch(url, {
        ...options,
        headers: {
            'content-type': 'application/json',
            ...(options.headers || {})
        }
    });
    return await response.json();
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

async function main() {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-email-smoke-'));
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
        const providers = await callTool(baseUrl, {
            tool: 'email',
            args: { action: 'providers' },
            context: { workspace: workspaceRoot }
        });
        const draft = await callTool(baseUrl, {
            tool: 'email',
            args: {
                action: 'draft',
                to: 'friend@example.com',
                subject: 'AILIS smoke',
                text: 'This is a local draft smoke.'
            },
            context: { workspace: workspaceRoot }
        });
        const sendDryRun = await callTool(baseUrl, {
            tool: 'email',
            args: {
                action: 'send',
                provider: 'qq',
                account: 'smoke@qq.com',
                secret: 'smoke-secret',
                to: 'friend@example.com',
                subject: 'AILIS smoke',
                text: 'This is a dry run.',
                dryRun: true
            },
            context: { workspace: workspaceRoot }
        });
        const agentClassify = await runAgent(baseUrl, {
            sessionId: 'email-smoke',
            message: '查看今天的邮件',
            classifyOnly: true
        });
        const audit = await jsonFetch(`${baseUrl}/audit?limit=20`);

        const ok =
            tools.ok &&
            tools.localTools?.some?.((tool) => tool.id === 'email') &&
            providers.ok &&
            draft.ok &&
            sendDryRun.ok &&
            agentClassify.intent === 'email_management' &&
            audit.ok &&
            !JSON.stringify(audit.entries || []).includes('smoke-secret');

        console.log(
            JSON.stringify(
                {
                    ok,
                    gateway: status,
                    workspaceRoot,
                    checks: {
                        toolsList: tools.ok,
                        emailToolListed: tools.localTools?.some?.((tool) => tool.id === 'email') || false,
                        providers: providers.status,
                        draft: draft.status,
                        sendDryRun: sendDryRun.status,
                        agentIntent: agentClassify.intent,
                        auditRedacted: !JSON.stringify(audit.entries || []).includes('smoke-secret')
                    }
                },
                null,
                2
            )
        );

        if (!ok) {
            process.exitCode = 1;
        }
    } finally {
        await gateway.stop();
    }
}

main().catch((error) => {
    console.error('[ailis-email-smoke] failed');
    console.error(error instanceof Error ? error.stack || error.message : String(error));
    process.exitCode = 1;
});
