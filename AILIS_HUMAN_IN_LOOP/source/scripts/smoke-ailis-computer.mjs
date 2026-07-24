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
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-computer-smoke-'));
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
        const write = await callTool(baseUrl, {
            tool: 'computer',
            args: { action: 'write', path: 'smoke.txt', content: 'hello computer smoke\n' },
            context: { workspace: workspaceRoot, approved: true }
        });
        const read = await callTool(baseUrl, {
            tool: 'computer',
            args: { action: 'read', path: 'smoke.txt' },
            context: { workspace: workspaceRoot }
        });
        const execApproval = await callTool(baseUrl, {
            tool: 'computer',
            args: { action: 'exec', command: 'node -e "console.log(1)"' },
            context: { workspace: workspaceRoot }
        });
        const exec = await callTool(baseUrl, {
            tool: 'computer',
            args: { action: 'exec', command: 'node -e "console.log(\'COMPUTER_SMOKE_OK\')"', timeoutMs: 10000 },
            context: { workspace: workspaceRoot, approved: true }
        });
        const classify = await runAgent(baseUrl, {
            sessionId: 'computer-smoke',
            message: '列出目录 .',
            classifyOnly: true
        });
        const audit = await jsonFetch(`${baseUrl}/audit?limit=20`);

        const ok =
            tools.ok &&
            tools.localTools?.some?.((tool) => tool.id === 'computer') &&
            write.ok &&
            read.ok &&
            /hello computer smoke/.test(read.result?.content?.[0]?.text || '') &&
            execApproval.status === 'needs_approval' &&
            exec.ok &&
            /COMPUTER_SMOKE_OK/.test(exec.result?.details?.stdout || '') &&
            classify.intent === 'computer_operation' &&
            audit.ok;

        console.log(
            JSON.stringify(
                {
                    ok,
                    gateway: status,
                    workspaceRoot,
                    checks: {
                        computerListed: tools.localTools?.some?.((tool) => tool.id === 'computer') || false,
                        write: write.status,
                        read: read.status,
                        execWithoutApproval: execApproval.status,
                        execWithApproval: exec.status,
                        agentIntent: classify.intent,
                        auditEntries: audit.entries?.length || 0
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
    console.error('[ailis-computer-smoke] failed');
    console.error(error instanceof Error ? error.stack || error.message : String(error));
    process.exitCode = 1;
});
