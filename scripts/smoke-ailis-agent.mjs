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

async function runAgent(baseUrl, payload) {
    return await jsonFetch(`${baseUrl}/agent/run`, {
        method: 'POST',
        body: JSON.stringify(payload)
    });
}

async function main() {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-agent-smoke-'));
    const gateway = new AILISGateway({
        port: 0,
        workspaceRoot,
        projectRoot: path.resolve('.'),
        auditDir: path.join(workspaceRoot, '.audit')
    });

    try {
        const status = await gateway.start();
        const baseUrl = status.url;
        const chat = await runAgent(baseUrl, {
            sessionId: 'agent-smoke',
            message: '你好'
        });
        const write = await runAgent(baseUrl, {
            sessionId: 'agent-smoke',
            message: '/write smoke.txt hello ailis agent'
        });
        const read = await runAgent(baseUrl, {
            sessionId: 'agent-smoke',
            message: '读取 smoke.txt'
        });
        const approval = await runAgent(baseUrl, {
            sessionId: 'agent-smoke',
            message: '/exec node -e "console.log(1)"'
        });
        const audit = await jsonFetch(`${baseUrl}/audit?limit=30`);

        const ok =
            chat.ok &&
            write.ok &&
            read.ok &&
            /hello ailis agent/.test(read.displayText || '') &&
            approval.status === 'needs_approval' &&
            audit.ok &&
            audit.entries?.some?.((entry) => entry.type === 'agent.run');

        console.log(
            JSON.stringify(
                {
                    ok,
                    gateway: status,
                    workspaceRoot,
                    checks: {
                        chat: chat.status,
                        write: write.status,
                        read: read.status,
                        execWithoutApproval: approval.status,
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
    console.error('[ailis-agent-smoke] failed');
    console.error(error instanceof Error ? error.stack || error.message : String(error));
    process.exitCode = 1;
});
