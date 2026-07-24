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

async function main() {
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-gateway-smoke-'));
    const gateway = new AILISGateway({
        port: 0,
        workspaceRoot,
        projectRoot: path.resolve('.'),
        auditDir: path.join(workspaceRoot, '.audit')
    });

    try {
        const status = await gateway.start();
        const baseUrl = status.url;
        const health = await jsonFetch(`${baseUrl}/health`);
        const tools = await jsonFetch(`${baseUrl}/tools`);
        const write = await callTool(baseUrl, {
            tool: 'write',
            args: { path: 'gateway-smoke.txt', content: 'hello gateway\n' },
            context: { workspace: workspaceRoot }
        });
        const read = await callTool(baseUrl, {
            tool: 'read',
            args: { path: 'gateway-smoke.txt' },
            context: { workspace: workspaceRoot }
        });
        const approval = await callTool(baseUrl, {
            tool: 'exec',
            args: { command: 'node -e "console.log(1)"' },
            context: { workspace: workspaceRoot }
        });
        const exec = await callTool(baseUrl, {
            tool: 'exec',
            args: { command: 'node -e "console.log(\'AILIS_GATEWAY_OK\')"', timeout: 8 },
            context: { workspace: workspaceRoot, approved: true }
        });
        const audit = await jsonFetch(`${baseUrl}/audit?limit=20`);

        const ok =
            health.ok &&
            tools.ok &&
            write.ok &&
            read.ok &&
            approval.status === 'needs_approval' &&
            exec.ok &&
            audit.ok;

        console.log(
            JSON.stringify(
                {
                    ok,
                    gateway: status,
                    workspaceRoot,
                    toolCounts: {
                        core: tools.coreTools?.length || 0,
                        optionalRuntime: tools.optionalRuntimeTools?.length || 0,
                        channelMcp: tools.channelMcpTools?.length || 0
                    },
                    checks: {
                        health: health.ok,
                        toolsList: tools.ok,
                        write: write.status,
                        read: read.status,
                        execWithoutApproval: approval.status,
                        execWithApproval: exec.status,
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
    console.error('[ailis-gateway-smoke] failed');
    console.error(error instanceof Error ? error.stack || error.message : String(error));
    process.exitCode = 1;
});
