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
    const workspaceRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'ailis-file-manager-smoke-'));
    await fs.writeFile(path.join(workspaceRoot, 'cache.tmp'), 'temporary cache');
    await fs.writeFile(path.join(workspaceRoot, 'report.pdf'), 'fake pdf');

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
        const scan = await callTool(baseUrl, {
            tool: 'file_manager',
            args: { action: 'scan', target: workspaceRoot, minAgeDays: 0 },
            context: { workspace: workspaceRoot }
        });
        const cleanPlan = await callTool(baseUrl, {
            tool: 'file_manager',
            args: { action: 'clean', target: workspaceRoot, minAgeDays: 0, dryRun: true },
            context: { workspace: workspaceRoot }
        });
        const organizePlan = await callTool(baseUrl, {
            tool: 'file_manager',
            args: { action: 'organize', source: workspaceRoot, dryRun: true },
            context: { workspace: workspaceRoot }
        });
        const agentClassify = await runAgent(baseUrl, {
            sessionId: 'file-manager-smoke',
            message: '整理下载目录',
            classifyOnly: true
        });
        const audit = await jsonFetch(`${baseUrl}/audit?limit=20`);

        const ok =
            tools.ok &&
            tools.localTools?.some?.((tool) => tool.id === 'file_manager') &&
            scan.ok &&
            cleanPlan.ok &&
            cleanPlan.result?.details?.dryRun === true &&
            organizePlan.ok &&
            agentClassify.intent === 'file_management' &&
            audit.ok;

        console.log(
            JSON.stringify(
                {
                    ok,
                    gateway: status,
                    workspaceRoot,
                    checks: {
                        fileManagerListed: tools.localTools?.some?.((tool) => tool.id === 'file_manager') || false,
                        scan: scan.status,
                        candidates: scan.result?.details?.candidates?.length || 0,
                        cleanPlan: cleanPlan.status,
                        organizePlan: organizePlan.status,
                        agentIntent: agentClassify.intent,
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
    console.error('[ailis-file-manager-smoke] failed');
    console.error(error instanceof Error ? error.stack || error.message : String(error));
    process.exitCode = 1;
});
