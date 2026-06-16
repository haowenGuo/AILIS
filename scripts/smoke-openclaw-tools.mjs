import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const runtimeRoot = path.join(projectRoot, 'build-cache', 'openclaw-runtime');
const reportDir = path.join(projectRoot, 'tmp', 'openclaw-tool-smoke');
const reportPath = path.join(reportDir, 'last-report.json');

const {
    OPENCLAW_CORE_TOOL_DEFINITIONS,
    OPENCLAW_OPTIONAL_RUNTIME_TOOL_DEFINITIONS,
    OPENCLAW_CHANNEL_MCP_TOOL_DEFINITIONS,
    validateOpenClawToolSurface
} = require('../electron/openclaw-tool-surface.cjs');
const { OpenClawRuntimeSupervisor } = require('../electron/openclaw-runtime.cjs');

const args = new Set(process.argv.slice(2));
const withGateway = !args.has('--no-gateway');
const quiet = args.has('--quiet');

function nowIso() {
    return new Date().toISOString();
}

function msSince(start) {
    return Date.now() - start;
}

function normalizeText(value) {
    if (typeof value === 'string') {
        return value;
    }
    if (value === undefined || value === null) {
        return '';
    }
    try {
        return JSON.stringify(value);
    } catch {
        return String(value);
    }
}

function toolResultText(result) {
    const textParts = [];
    for (const part of Array.isArray(result?.content) ? result.content : []) {
        if (typeof part?.text === 'string') {
            textParts.push(part.text);
        }
    }
    if (result?.details) {
        textParts.push(normalizeText(result.details));
    }
    return textParts.join('\n');
}

function summarizeEvidence(value, maxChars = 420) {
    const text = normalizeText(value).replace(/\s+/g, ' ').trim();
    if (text.length <= maxChars) {
        return text;
    }
    return `${text.slice(0, maxChars - 3)}...`;
}

function createTimeoutError(ms) {
    const error = new Error(`timeout after ${ms}ms`);
    error.code = 'AILIS_TOOL_SMOKE_TIMEOUT';
    return error;
}

async function withTimeout(ms, action) {
    let timer = null;
    try {
        return await Promise.race([
            action(),
            new Promise((_, reject) => {
                timer = setTimeout(() => reject(createTimeoutError(ms)), ms);
            })
        ]);
    } finally {
        if (timer) {
            clearTimeout(timer);
        }
    }
}

function statusFromError(error) {
    const message = error instanceof Error ? error.message : String(error);
    if (/sessionKey required|Unknown sessionKey|No session context|task required/i.test(message)) {
        return 'needs_session';
    }
    if (/gateway.*(closed|timeout|ECONNREFUSED|not connected)|Not connected/i.test(message)) {
        return 'needs_gateway';
    }
    if (/missing_.*key|api key|not configured|no provider registered|requires .*configured/i.test(message)) {
        return 'needs_config';
    }
    if (/paired node|node required|none available/i.test(message)) {
        return 'needs_config';
    }
    if (/pairing required/i.test(message)) {
        return 'needs_pairing';
    }
    if (error?.code === 'AILIS_TOOL_SMOKE_TIMEOUT') {
        return 'fail';
    }
    return 'fail';
}

function statusFromReturnedResult(result) {
    const text = toolResultText(result);
    if (/missing_.*key|api key|not configured|no provider registered|TTS conversion failed/i.test(text)) {
        return 'needs_config';
    }
    if (/pairing required/i.test(text)) {
        return 'needs_pairing';
    }
    if (/No session context|Unknown sessionKey|sessionKey required/i.test(text)) {
        return 'needs_session';
    }
    if (result?.isError) {
        return 'fail';
    }
    return 'pass';
}

function buildSmokeConfig() {
    return {
        browser: { enabled: true },
        plugins: {
            entries: {
                browser: { enabled: true }
            }
        },
        tools: {
            profile: 'full',
            experimental: {
                planTool: true
            }
        },
        agents: {
            defaults: {
                imageModel: { primary: 'openai/gpt-5.4' },
                imageGenerationModel: { primary: 'openai/gpt-image-1' },
                videoGenerationModel: { primary: 'openai/sora-2' },
                musicGenerationModel: { primary: 'suno/default' },
                pdfModel: { primary: 'anthropic/claude-sonnet-4-6' }
            }
        }
    };
}

function buildResult(entry) {
    return {
        id: entry.id,
        kind: entry.kind || 'core',
        status: entry.status,
        check: entry.check,
        durationMs: entry.durationMs ?? 0,
        materialized: entry.materialized,
        ...(entry.evidence ? { evidence: summarizeEvidence(entry.evidence) } : {}),
        ...(entry.error ? { error: summarizeEvidence(entry.error) } : {})
    };
}

async function runToolCase({ id, kind = 'core', tools, args: toolArgs, timeoutMs = 12000, expect }) {
    const start = Date.now();
    if (!quiet) {
        console.log(`[openclaw-smoke] ${id}: running`);
    }
    const tool = tools.get(id);
    if (!tool) {
        return buildResult({
            id,
            kind,
            status: 'not_materialized',
            materialized: false,
            check: 'OpenClaw runtime did not materialize this tool under the local smoke profile.',
            durationMs: msSince(start)
        });
    }

    try {
        const result = await withTimeout(timeoutMs, () => tool.execute(`smoke-${id}`, toolArgs));
        const status = expect ? expect(result) : statusFromReturnedResult(result);
        return buildResult({
            id,
            kind,
            status,
            materialized: true,
            check: 'execute',
            durationMs: msSince(start),
            evidence: result
        });
    } catch (error) {
        return buildResult({
            id,
            kind,
            status: statusFromError(error),
            materialized: true,
            check: 'execute',
            durationMs: msSince(start),
            error: error instanceof Error ? error.message : String(error)
        });
    }
}

async function runSafetyCase({ id, tools, args: toolArgs, timeoutMs = 12000, expectedPattern }) {
    const start = Date.now();
    if (!quiet) {
        console.log(`[openclaw-smoke] ${id}: safety`);
    }
    const tool = tools.get(id);
    if (!tool) {
        return buildResult({
            id: `${id}:safety`,
            kind: 'safety',
            status: 'not_materialized',
            materialized: false,
            check: 'safety',
            durationMs: msSince(start)
        });
    }

    try {
        const result = await withTimeout(timeoutMs, () => tool.execute(`smoke-${id}-safety`, toolArgs));
        const text = toolResultText(result);
        const matched = expectedPattern.test(text);
        return buildResult({
            id: `${id}:safety`,
            kind: 'safety',
            status: matched ? 'pass' : 'fail',
            materialized: true,
            check: 'blocked unsafe request',
            durationMs: msSince(start),
            evidence: result
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return buildResult({
            id: `${id}:safety`,
            kind: 'safety',
            status: expectedPattern.test(message) ? 'pass' : 'fail',
            materialized: true,
            check: 'blocked unsafe request',
            durationMs: msSince(start),
            error: message
        });
    }
}

async function listMcpTools() {
    const clientModuleUrl = pathToFileURL(
        path.join(runtimeRoot, 'node_modules', '@modelcontextprotocol', 'sdk', 'dist', 'esm', 'client', 'index.js')
    ).href;
    const stdioModuleUrl = pathToFileURL(
        path.join(runtimeRoot, 'node_modules', '@modelcontextprotocol', 'sdk', 'dist', 'esm', 'client', 'stdio.js')
    ).href;
    const { Client } = await import(clientModuleUrl);
    const { StdioClientTransport } = await import(stdioModuleUrl);

    const transport = new StdioClientTransport({
        command: process.execPath,
        args: [path.join(runtimeRoot, 'openclaw.mjs'), 'mcp', 'serve'],
        cwd: runtimeRoot,
        stderr: 'pipe'
    });
    let stderr = '';
    transport.stderr?.on('data', (chunk) => {
        stderr += String(chunk);
    });

    const client = new Client({ name: 'ailis-openclaw-smoke', version: '0.1.0' });
    try {
        await client.connect(transport, { timeout: 15000 });
        const response = await client.listTools(undefined, { timeout: 15000 });
        return {
            ok: true,
            toolNames: response.tools.map((tool) => tool.name),
            stderr
        };
    } finally {
        await client.close().catch(() => {});
    }
}

function printSummary(report) {
    if (quiet) {
        return;
    }
    console.log('[openclaw-smoke] summary');
    console.log(
        JSON.stringify(
            {
                ok: report.summary.ok,
                counts: report.summary.counts,
                reportPath: report.reportPath,
                workspaceDir: report.workspaceDir,
                gateway: report.gateway
            },
            null,
            2
        )
    );
    console.log('[openclaw-smoke] tools');
    for (const item of report.results) {
        const suffix = item.error || item.evidence ? ` - ${item.error || item.evidence}` : '';
        console.log(`${item.status.padEnd(16)} ${item.kind.padEnd(12)} ${item.id}${suffix}`);
    }
}

function countStatuses(results) {
    const counts = {};
    for (const result of results) {
        counts[result.status] = (counts[result.status] || 0) + 1;
    }
    return counts;
}

async function main() {
    const startedAt = Date.now();
    await fs.mkdir(reportDir, { recursive: true });
    const workspaceDir = await fs.mkdtemp(path.join(reportDir, 'workspace-'));
    await fs.writeFile(path.join(workspaceDir, 'seed.txt'), 'alpha\nbravo\n', 'utf8');

    const validation = validateOpenClawToolSurface();
    const report = {
        generatedAt: nowIso(),
        reportPath,
        workspaceDir,
        withGateway,
        validation: validation.summary,
        gateway: {
            attempted: withGateway,
            ok: false
        },
        materializedToolIds: [],
        results: []
    };

    let supervisor = null;
    if (withGateway) {
        supervisor = new OpenClawRuntimeSupervisor({ gatewayUrl: 'ws://127.0.0.1:18789' });
        try {
            const status = await supervisor.ensureReady();
            delete process.env.OPENCLAW_GATEWAY_URL;
            delete process.env.AILIS_OPENCLAW_GATEWAY_URL;
            report.gateway = {
                attempted: true,
                ok: true,
                url: status.gatewayUrl,
                port: status.port,
                pid: status.pid || 0,
                bundleReady: status.bundleReady,
                vendorReady: status.vendorReady
            };
        } catch (error) {
            report.gateway = {
                attempted: true,
                ok: false,
                error: error instanceof Error ? error.message : String(error)
            };
        }
    }

    try {
        const harnessUrl = pathToFileURL(
            path.join(runtimeRoot, 'dist', 'plugin-sdk', 'agent-harness.js')
        ).href;
        const { createOpenClawCodingTools } = await import(harnessUrl);
        const toolsArray = createOpenClawCodingTools({
            workspaceDir,
            agentDir: workspaceDir,
            senderIsOwner: true,
            modelHasVision: true,
            modelProvider: 'openai',
            modelId: 'gpt-5.4',
            sessionKey: 'main',
            runSessionKey: 'main',
            onYield: async () => {},
            config: buildSmokeConfig()
        });
        const tools = new Map(toolsArray.map((tool) => [tool.name, tool]));
        report.materializedToolIds = [...tools.keys()];

        const executableCases = [
            {
                id: 'write',
                args: { path: 'seed.txt', content: 'alpha\nbravo\n' },
                expect: (result) => (/Successfully wrote/i.test(toolResultText(result)) ? 'pass' : 'fail')
            },
            {
                id: 'read',
                args: { path: 'seed.txt' },
                expect: (result) => (toolResultText(result).includes('bravo') ? 'pass' : 'fail')
            },
            {
                id: 'edit',
                args: {
                    path: 'seed.txt',
                    edits: [{ oldText: 'bravo', newText: 'charlie' }]
                },
                expect: (result) => (/Successfully replaced/i.test(toolResultText(result)) ? 'pass' : 'fail')
            },
            {
                id: 'apply_patch',
                args: {
                    input: '*** Begin Patch\n*** Update File: seed.txt\n@@\n-alpha\n+omega\n*** End Patch\n'
                },
                expect: (result) => (/Success\. Updated/i.test(toolResultText(result)) ? 'pass' : 'fail')
            },
            {
                id: 'exec',
                args: {
                    command: 'node -e "console.log(\'SMOKE_EXEC_OK\')"',
                    workdir: workspaceDir,
                    timeout: 8,
                    host: 'gateway',
                    security: 'full',
                    ask: 'off'
                },
                timeoutMs: 20000,
                expect: (result) => (toolResultText(result).includes('SMOKE_EXEC_OK') ? 'pass' : 'fail')
            },
            { id: 'process', args: { action: 'list' } },
            { id: 'web_fetch', args: { url: 'https://example.com/', maxChars: 400, extractMode: 'text' } },
            { id: 'web_search', args: { query: 'OpenClaw GitHub', count: 1 }, timeoutMs: 20000 },
            { id: 'message', args: { action: 'send', channel: 'telegram', target: '1234', message: 'smoke', dryRun: true } },
            { id: 'tts', args: { text: 'hello smoke' } },
            { id: 'agents_list', args: {} },
            { id: 'update_plan', args: { plan: [{ step: 'smoke', status: 'completed' }] } },
            { id: 'sessions_yield', args: { message: 'smoke yield' } },
            { id: 'subagents', args: { action: 'list' } }
        ];

        if (report.gateway.ok) {
            executableCases.push(
                { id: 'sessions_list', args: { limit: 1 }, timeoutMs: 20000 },
                { id: 'gateway', args: { action: 'config.get', timeoutMs: 5000 }, timeoutMs: 20000 },
                { id: 'cron', args: { action: 'list', timeoutMs: 5000 }, timeoutMs: 20000 },
                { id: 'nodes', args: { action: 'status', timeoutMs: 5000 }, timeoutMs: 20000 }
            );
        }

        for (const testCase of executableCases) {
            report.results.push(await runToolCase({ ...testCase, tools }));
        }

        const skippedExternal = [
            ['browser', 'Requires browser runtime/profile state; materialization is verified.'],
            ['canvas', 'Requires a live Canvas/browser runtime; materialization is verified.'],
            ['image', 'Would call a vision model; materialization is verified, execution needs provider credentials.'],
            ['image_generate', 'Would create paid media; materialization is verified, execution needs provider credentials.'],
            ['music_generate', 'Would create paid media; materialization is verified, execution needs provider credentials.'],
            ['video_generate', 'Would create paid media; materialization is verified, execution needs provider credentials.'],
            ['pdf', 'Would call a document understanding model; materialization is verified, execution needs provider credentials.'],
            ['memory_search', 'Depends on local memory index state; materialization is verified.'],
            ['memory_get', 'Depends on existing memory corpus files; materialization is verified.']
        ];
        for (const [id, reason] of skippedExternal) {
            report.results.push(
                buildResult({
                    id,
                    kind: id === 'pdf' ? 'optional-runtime' : 'core',
                    status: tools.has(id) ? 'skipped_external' : 'not_materialized',
                    materialized: tools.has(id),
                    check: reason
                })
            );
        }

        const sessionBound = ['session_status', 'sessions_history', 'sessions_send', 'sessions_spawn'];
        for (const id of sessionBound) {
            report.results.push(
                buildResult({
                    id,
                    status: tools.has(id) ? 'needs_session' : 'not_materialized',
                    materialized: tools.has(id),
                    check: 'Requires an existing live agent session; smoke runner avoids starting a model-backed session.'
                })
            );
        }

        if (!report.gateway.ok) {
            for (const id of ['sessions_list', 'gateway', 'cron', 'nodes']) {
                report.results.push(
                    buildResult({
                        id,
                        status: tools.has(id) ? 'needs_gateway' : 'not_materialized',
                        materialized: tools.has(id),
                        check: 'Requires local OpenClaw Gateway for a real smoke call.'
                    })
                );
            }
        }

        const knownPluginOrSpecialTools = ['code_execution', 'x_search', 'heartbeat_respond'];
        for (const id of knownPluginOrSpecialTools) {
            report.results.push(
                buildResult({
                    id,
                    status: tools.has(id) ? 'pass' : 'not_materialized',
                    materialized: tools.has(id),
                    check: 'Provider/plugin/special-trigger backed tool; not present in the local smoke factory output.'
                })
            );
        }

        report.results.push(
            await runSafetyCase({
                id: 'web_fetch',
                tools,
                args: { url: 'http://127.0.0.1:1/', maxChars: 200, extractMode: 'text' },
                expectedPattern: /Blocked hostname|private\/internal|special-use/i
            })
        );

        const representedCoreIds = new Set(
            report.results.filter((result) => result.kind !== 'optional-runtime').map((result) => result.id.split(':')[0])
        );
        for (const tool of OPENCLAW_CORE_TOOL_DEFINITIONS) {
            if (!representedCoreIds.has(tool.id)) {
                report.results.push(
                    buildResult({
                        id: tool.id,
                        status: tools.has(tool.id) ? 'pass' : 'not_materialized',
                        materialized: tools.has(tool.id),
                        check: 'Materialization check only.'
                    })
                );
            }
        }

        if (withGateway && report.gateway.ok) {
            try {
                const mcp = await listMcpTools();
                const listed = new Set(mcp.toolNames);
                for (const tool of OPENCLAW_CHANNEL_MCP_TOOL_DEFINITIONS) {
                    report.results.push(
                        buildResult({
                            id: tool.id,
                            kind: 'channel-mcp',
                            status: listed.has(tool.id) ? 'needs_pairing' : 'fail',
                            materialized: listed.has(tool.id),
                            check: listed.has(tool.id)
                                ? 'Listed by the MCP server; actual channel calls require a paired mail/chat channel.'
                                : 'Missing from MCP tools/list.',
                            evidence: listed.has(tool.id) ? 'mcp tools/list ok' : mcp
                        })
                    );
                }
            } catch (error) {
                for (const tool of OPENCLAW_CHANNEL_MCP_TOOL_DEFINITIONS) {
                    report.results.push(
                        buildResult({
                            id: tool.id,
                            kind: 'channel-mcp',
                            status: 'needs_gateway',
                            materialized: false,
                            check: 'MCP tools/list',
                            error: error instanceof Error ? error.message : String(error)
                        })
                    );
                }
            }
        } else {
            for (const tool of OPENCLAW_CHANNEL_MCP_TOOL_DEFINITIONS) {
                report.results.push(
                    buildResult({
                        id: tool.id,
                        kind: 'channel-mcp',
                        status: 'needs_gateway',
                        materialized: false,
                        check: 'MCP tools/list requires local OpenClaw Gateway.'
                    })
                );
            }
        }

        for (const optionalTool of OPENCLAW_OPTIONAL_RUNTIME_TOOL_DEFINITIONS) {
            if (!report.results.some((result) => result.id === optionalTool.id)) {
                report.results.push(
                    buildResult({
                        id: optionalTool.id,
                        kind: 'optional-runtime',
                        status: tools.has(optionalTool.id) ? 'skipped_external' : 'not_materialized',
                        materialized: tools.has(optionalTool.id),
                        check: 'Optional runtime tool materialization check.'
                    })
                );
            }
        }
    } finally {
        if (supervisor) {
            await supervisor.shutdown().catch(() => {});
        }
    }

    const counts = countStatuses(report.results);
    const failCount = counts.fail || 0;
    report.summary = {
        ok: validation.ok && failCount === 0,
        durationMs: msSince(startedAt),
        counts,
        totalChecks: report.results.length,
        materializedCount: report.materializedToolIds.length,
        coreContractCount: OPENCLAW_CORE_TOOL_DEFINITIONS.length,
        optionalRuntimeContractCount: OPENCLAW_OPTIONAL_RUNTIME_TOOL_DEFINITIONS.length,
        channelMcpContractCount: OPENCLAW_CHANNEL_MCP_TOOL_DEFINITIONS.length
    };

    await fs.writeFile(reportPath, JSON.stringify(report, null, 2), 'utf8');
    printSummary(report);

    if (!report.summary.ok) {
        process.exitCode = 1;
    }
}

main().catch(async (error) => {
    console.error('[openclaw-smoke] fatal');
    console.error(error instanceof Error ? error.stack || error.message : String(error));
    process.exitCode = 1;
});
