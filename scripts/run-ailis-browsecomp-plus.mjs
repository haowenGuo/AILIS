// BrowseComp-Plus dataset transport and fixed-corpus audit adapter. AILIS alone answers each query.
import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createHash, randomUUID } from 'node:crypto';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

import {
    configureResearchMcpLlmEnvironment,
    loadDesktopStateSettings
} from './ailis-eval-runtime-config.mjs';
import {
    buildBrowseCompPrompt,
    buildOfficialRunRecord,
    extractFinalResponse,
    extractTranscriptToolCalls,
    loadBrowseCompQueries,
    normalizeText,
    safeFileSegment
} from './browsecomp-plus/ailis-browsecomp-plus-lib.mjs';

const require = createRequire(import.meta.url);
const { AILISGateway } = require('../electron/ailis-gateway.cjs');
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const DEFAULT_DATASET = path.join(PROJECT_ROOT, 'eval-results', 'browsecomp-plus', 'data', 'browsecomp_plus_decrypted.jsonl');
const FIXTURE_DATASET = path.join(PROJECT_ROOT, 'evals', 'browsecomp-plus', 'fixtures', 'ground-truth.jsonl');
const FIXTURE_SERVER = path.join(PROJECT_ROOT, 'scripts', 'browsecomp-plus', 'fixture-mcp-server.cjs');

function parseBoolean(value, fallback = false) {
    const text = normalizeText(String(value || '')).toLowerCase();
    if (!text) return fallback;
    return /^(1|true|yes|on)$/.test(text);
}

function parseTimeout(value, fallback, minimum = 1000) {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) return fallback;
    if (parsed === 0) return 0;
    return Math.max(minimum, Math.floor(parsed));
}

function parseArgs(argv = process.argv.slice(2)) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const args = {
        dataset: DEFAULT_DATASET,
        outputDir: path.join(PROJECT_ROOT, 'eval-results', 'browsecomp-plus', 'ailis'),
        runId: `ailis-browsecomp-plus-${timestamp}`,
        offset: 0,
        limit: 0,
        queryIds: [],
        sampleSize: 0,
        sampleSeed: 'ailis-browsecomp-plus-random100-v1',
        resume: true,
        planOnly: false,
        preflightOnly: false,
        fixture: false,
        withGetDocument: true,
        retriever: 'unconfigured',
        mcpUrl: normalizeText(process.env.BROWSECOMP_PLUS_MCP_URL),
        mcpCommand: normalizeText(process.env.BROWSECOMP_PLUS_MCP_COMMAND),
        mcpArgs: [],
        bearerTokenEnvVar: normalizeText(process.env.BROWSECOMP_PLUS_MCP_BEARER_ENV),
        mcpTimeoutMs: 120000,
        requestTimeoutMs: 0,
        llmTimeoutMs: 180000,
        taskRetries: 1,
        temperature: 0,
        codexModelBridge: process.env.AILIS_EVAL_CODEX_MODEL_BRIDGE === undefined
            ? true
            : parseBoolean(process.env.AILIS_EVAL_CODEX_MODEL_BRIDGE),
        codexModel: normalizeText(process.env.AILIS_CODEX_MODEL, 'gpt-5.6-luna'),
        codexReasoningEffort: normalizeText(process.env.AILIS_CODEX_REASONING_EFFORT, 'medium'),
        workspaceRoot: path.join(os.tmpdir(), 'ailis-browsecomp-plus', randomUUID())
    };
    for (let index = 0; index < argv.length; index += 1) {
        const token = argv[index];
        const next = () => argv[++index] || '';
        if (token === '--dataset') args.dataset = path.resolve(next());
        else if (token === '--output-dir') args.outputDir = path.resolve(next());
        else if (token === '--run-id') args.runId = normalizeText(next(), args.runId);
        else if (token === '--offset') args.offset = Math.max(0, Number(next()) || 0);
        else if (token === '--limit') args.limit = Math.max(0, Number(next()) || 0);
        else if (token === '--query-id') args.queryIds.push(normalizeText(next()));
        else if (token === '--sample-size') args.sampleSize = Math.max(0, Number(next()) || 0);
        else if (token === '--sample-seed') args.sampleSeed = normalizeText(next(), args.sampleSeed);
        else if (token === '--resume') args.resume = true;
        else if (token === '--no-resume') args.resume = false;
        else if (token === '--plan-only') args.planOnly = true;
        else if (token === '--preflight-only') args.preflightOnly = true;
        else if (token === '--fixture') args.fixture = true;
        else if (token === '--search-only') args.withGetDocument = false;
        else if (token === '--with-get-document') args.withGetDocument = true;
        else if (token === '--retriever') args.retriever = normalizeText(next(), args.retriever);
        else if (token === '--mcp-url') args.mcpUrl = normalizeText(next());
        else if (token === '--mcp-command') args.mcpCommand = normalizeText(next());
        else if (token === '--mcp-arg') args.mcpArgs.push(next());
        else if (token === '--mcp-bearer-env') args.bearerTokenEnvVar = normalizeText(next());
        else if (token === '--mcp-timeout-ms') args.mcpTimeoutMs = parseTimeout(next(), args.mcpTimeoutMs);
        else if (token === '--request-timeout-ms') args.requestTimeoutMs = parseTimeout(next(), args.requestTimeoutMs);
        else if (token === '--llm-timeout-ms') args.llmTimeoutMs = parseTimeout(next(), args.llmTimeoutMs);
        else if (token === '--task-retries') args.taskRetries = Math.max(0, Math.min(Number(next()) || 0, 3));
        else if (token === '--codex-model') args.codexModel = normalizeText(next(), args.codexModel);
        else if (token === '--codex-reasoning-effort') args.codexReasoningEffort = normalizeText(next(), args.codexReasoningEffort);
        else if (token === '--no-codex-model-bridge') args.codexModelBridge = false;
        else if (token === '--workspace-root') args.workspaceRoot = path.resolve(next());
        else throw new Error(`Unknown argument: ${token}`);
    }
    if (args.fixture) {
        args.dataset = FIXTURE_DATASET;
        args.retriever = 'ailis_fixture_lexical';
        args.mcpUrl = '';
        args.mcpCommand = process.execPath;
        args.mcpArgs = [FIXTURE_SERVER];
    }
    args.outputDir = path.resolve(args.outputDir);
    args.rawDir = path.join(args.outputDir, args.runId, 'runs');
    args.auditDir = path.join(args.outputDir, args.runId, 'ailis-audit');
    args.summaryPath = path.join(args.outputDir, args.runId, 'summary.json');
    args.reportPath = path.join(args.outputDir, args.runId, 'report.md');
    args.manifestPath = path.join(args.outputDir, args.runId, 'run-manifest.json');
    return args;
}

function buildMcpConfig(args) {
    if (args.mcpUrl) {
        return {
            transport: 'http',
            url: args.mcpUrl,
            ...(args.bearerTokenEnvVar ? { bearerTokenEnvVar: args.bearerTokenEnvVar } : {})
        };
    }
    if (args.mcpCommand) {
        return {
            transport: 'stdio',
            command: args.mcpCommand,
            args: args.mcpArgs,
            cwd: PROJECT_ROOT,
            env: process.execPath.toLowerCase().includes('electron') ? { ELECTRON_RUN_AS_NODE: '1' } : {}
        };
    }
    throw new Error('BrowseComp-Plus retriever MCP is not configured. Use --mcp-url, --mcp-command, or --fixture.');
}

function validateLlmSettings(settings = {}) {
    const provider = normalizeText(settings.provider).toLowerCase();
    if (!provider || !normalizeText(settings.model)) throw new Error('LLM provider and model are required.');
    const keyless = new Set(['codex-model-bridge', 'ollama', 'vllm']);
    if (!keyless.has(provider) && !normalizeText(settings.baseUrl)) throw new Error(`LLM baseUrl is required for ${provider}.`);
    if (!keyless.has(provider) && !normalizeText(settings.apiKey)) throw new Error(`LLM apiKey is required for ${provider}.`);
}

function redactMcpArgumentList(values = []) {
    const redacted = [];
    let redactNext = false;
    for (const rawValue of Array.isArray(values) ? values : []) {
        const value = String(rawValue);
        if (redactNext) {
            redacted.push('[REDACTED]');
            redactNext = false;
        } else if (/^--?(?:api[-_]?key|token|password|secret)$/i.test(value)) {
            redacted.push(value);
            redactNext = true;
        } else if (/^(--?(?:api[-_]?key|token|password|secret)=).+/i.test(value)) {
            redacted.push(value.replace(/=.*/, '=[REDACTED]'));
        } else {
            redacted.push(value);
        }
    }
    return redacted;
}

function fingerprintMcpUrl(value = '') {
    const url = normalizeText(value);
    if (!url) return { origin: '', sha256: '' };
    let origin = '';
    try {
        origin = new URL(url).origin;
    } catch {}
    return {
        origin,
        sha256: createHash('sha256').update(url).digest('hex')
    };
}

async function buildRunManifest(args, queries, llmSettings, mcpConfig) {
    const stat = await fs.stat(args.dataset);
    const querySetHash = createHash('sha256')
        .update(queries.map((query) => `${query.query_id}\t${query.query}`).join('\n'))
        .digest('hex');
    const mcpUrl = fingerprintMcpUrl(mcpConfig.url);
    return {
        protocol: 'browsecomp_plus_fixed_corpus_v1',
        runId: args.runId,
        dataset: {
            path: path.resolve(args.dataset),
            bytes: stat.size,
            modifiedAtMs: Math.round(stat.mtimeMs),
            querySetSha256: querySetHash,
            selected: queries.length
        },
        selection: args.sampleSize > 0
            ? { mode: 'deterministic_sha256_sample', sampleSize: args.sampleSize, sampleSeed: args.sampleSeed }
            : args.queryIds.length
                ? { mode: 'query_ids', queryIds: [...args.queryIds] }
                : { mode: 'range', offset: args.offset, limit: args.limit },
        model: llmSettings.model,
        provider: llmSettings.provider,
        reasoningEffort: llmSettings.reasoningEffort || args.codexReasoningEffort,
        temperature: Number(llmSettings.temperature) || 0,
        retriever: args.retriever,
        queryTemplate: args.withGetDocument ? 'QUERY_TEMPLATE' : 'QUERY_TEMPLATE_NO_GET_DOCUMENT',
        mcp: {
            transport: mcpConfig.transport,
            urlOrigin: mcpUrl.origin,
            urlSha256: mcpUrl.sha256,
            command: normalizeText(mcpConfig.command),
            args: redactMcpArgumentList(mcpConfig.args),
            bearerTokenEnvVar: normalizeText(mcpConfig.bearerTokenEnvVar)
        }
    };
}

async function ensureRunManifest(args, manifest) {
    if (fsSync.existsSync(args.manifestPath)) {
        const existing = JSON.parse(await fs.readFile(args.manifestPath, 'utf8'));
        if (JSON.stringify(existing) !== JSON.stringify(manifest)) {
            throw new Error(`Run manifest mismatch at ${args.manifestPath}; choose a new --run-id or restore the frozen configuration.`);
        }
        return { resumed: true, manifest };
    }
    await fs.writeFile(args.manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
    return { resumed: false, manifest };
}

function buildAgentPayload({ args, query, llmSettings, workspace, runId, sessionId }) {
    return {
        runId,
        sessionId,
        message: buildBrowseCompPrompt(query.query, { withGetDocument: args.withGetDocument }),
        messageHistory: [],
        attachments: [],
        agentLoop: 'llm',
        planner: 'llm',
        memoryPolicy: 'disabled',
        llmSettings,
        directToolExecutor: true,
        nativeDirectTools: true,
        context: {
            runId,
            sessionId,
            workspace,
            evaluationName: 'browsecomp-plus',
            memoryPolicy: 'disabled',
            agentLoop: 'llm',
            planner: 'llm',
            llmSettings,
            directToolExecutor: true,
            nativeDirectTools: true,
            agentRole: 'task_agent',
            computerControlEnabled: false,
            permissionProfile: 'danger-full-access',
            approvalPolicy: 'never',
            confirmationPolicy: 'never',
            approved: true,
            autoConfirm: false,
            executeExternal: true,
            allowOutsideWorkspace: false,
            allowComputerWideAccess: false,
            allowSystemMutation: false
        }
    };
}

async function runWithDeadline(gateway, payload, timeoutMs) {
    const running = gateway.runAgent(payload);
    if (!timeoutMs) return { response: await running, deadlineTriggered: false };
    let timeoutId;
    const first = await Promise.race([
        running.then((response) => ({ response })),
        new Promise((resolve) => { timeoutId = setTimeout(() => resolve({ deadline: true }), timeoutMs); })
    ]);
    if (timeoutId) clearTimeout(timeoutId);
    if (!first.deadline) return { response: first.response, deadlineTriggered: false };
    await gateway.interruptAgentRun({
        runId: payload.runId,
        sessionId: payload.sessionId,
        reason: 'browsecomp_plus_configured_deadline',
        source: 'browsecomp_plus_dataset_adapter'
    });
    return { response: await running, deadlineTriggered: true };
}

async function preflightRetriever(gateway, args) {
    const specs = await gateway.runtime.mcpManager.listToolSpecs('browsecomp_plus', args.mcpTimeoutMs);
    const names = new Set(specs.map((spec) => spec.tool));
    if (!names.has('search')) throw new Error('BrowseComp-Plus MCP must expose a search tool.');
    if (args.withGetDocument && !names.has('get_document')) {
        throw new Error('This run requires BrowseComp-Plus MCP get_document; use --search-only if unavailable.');
    }
    return {
        ok: true,
        transport: args.mcpUrl ? 'http' : 'stdio',
        tools: specs.map((spec) => ({ server: spec.server, tool: spec.tool, description: spec.description || '' }))
    };
}

async function stopGateway(gateway) {
    let timeoutId;
    try {
        return await Promise.race([
            gateway.stop().then(() => ({ ok: true, status: 'stopped' })).catch((error) => ({ ok: false, status: 'stop_error', error: error.message })),
            new Promise((resolve) => { timeoutId = setTimeout(() => resolve({ ok: false, status: 'stop_timeout' }), 15000); })
        ]);
    } finally {
        if (timeoutId) clearTimeout(timeoutId);
    }
}

function buildReport(summary) {
    return `# AILIS BrowseComp-Plus run\n\n` +
        `- Run: \`${summary.runId}\`\n` +
        `- Dataset: \`${summary.dataset}\`\n` +
        `- Retriever: \`${summary.retriever}\`\n` +
        `- Model: \`${summary.model}\` (${summary.reasoningEffort})\n` +
        `- Selected: ${summary.selected}\n` +
        `- Completed: ${summary.completed}\n` +
        `- Fixed-corpus valid: ${summary.fixedCorpusValid}\n` +
        `- Failed: ${summary.failed}\n` +
        `- Policy violations: ${summary.policyViolations}\n` +
        `- Search calls: ${summary.toolCalls.search}\n` +
        `- get_document calls: ${summary.toolCalls.get_document}\n` +
        `- Mean duration: ${summary.latency.meanMs ?? 'n/a'} ms\n\n` +
        `This file is an execution summary, not an official score. Use the upstream Qwen3-32B evaluator on the \`runs\` directory.\n`;
}

async function main() {
    const args = parseArgs();
    const queries = await loadBrowseCompQueries(args.dataset, args);
    const plan = {
        benchmark: 'BrowseComp-Plus',
        dataset: path.resolve(args.dataset),
        selected: queries.length,
        selection: args.sampleSize > 0
            ? { mode: 'deterministic_sha256_sample', sampleSize: args.sampleSize, sampleSeed: args.sampleSeed }
            : args.queryIds.length
                ? { mode: 'query_ids', count: args.queryIds.length }
                : { mode: 'range', offset: args.offset, limit: args.limit },
        runId: args.runId,
        retriever: args.retriever,
        template: args.withGetDocument ? 'QUERY_TEMPLATE' : 'QUERY_TEMPLATE_NO_GET_DOCUMENT',
        model: args.codexModelBridge ? args.codexModel : 'desktop-state',
        reasoningEffort: args.codexReasoningEffort,
        transport: args.fixture ? 'fixture-stdio' : args.mcpUrl ? 'http' : args.mcpCommand ? 'stdio' : 'missing',
        officialJudgeRun: false
    };
    if (args.planOnly) {
        console.log(JSON.stringify(plan, null, 2));
        return;
    }
    const mcpConfig = buildMcpConfig(args);
    await fs.mkdir(args.rawDir, { recursive: true });
    await fs.mkdir(args.workspaceRoot, { recursive: true });
    const gateway = new AILISGateway({
        host: '127.0.0.1',
        port: 0,
        projectRoot: PROJECT_ROOT,
        workspaceRoot: args.workspaceRoot,
        auditDir: args.auditDir,
        disableBuiltinAilisResearchMcp: true,
        toolAllowlist: ['tool_search', 'update_plan', 'mcp_bridge'],
        mcpServers: { browsecomp_plus: mcpConfig }
    });
    await gateway.start();
    let gatewayStopStatus = { ok: false, status: 'not_stopped' };
    try {
        const preflight = await preflightRetriever(gateway, args);
        if (args.preflightOnly) {
            console.log(JSON.stringify({ ...plan, preflight }, null, 2));
            return;
        }
        const runtimeSettings = loadDesktopStateSettings(args);
        const llmSettings = runtimeSettings.llmSettings;
        validateLlmSettings(llmSettings);
        configureResearchMcpLlmEnvironment(llmSettings);
        const manifestStatus = await ensureRunManifest(
            args,
            await buildRunManifest(args, queries, llmSettings, mcpConfig)
        );
        const results = [];
        for (let index = 0; index < queries.length; index += 1) {
            const query = queries[index];
            const rawPath = path.join(args.rawDir, `${safeFileSegment(query.query_id)}.json`);
            if (args.resume && fsSync.existsSync(rawPath)) {
                const existing = JSON.parse(await fs.readFile(rawPath, 'utf8'));
                results.push(existing);
                process.stdout.write(`[${index + 1}/${queries.length}] ${query.query_id} resumed\n`);
                continue;
            }
            process.stdout.write(`[${index + 1}/${queries.length}] ${query.query_id} ... `);
            let record;
            for (let attempt = 0; attempt <= args.taskRetries; attempt += 1) {
                const runId = randomUUID();
                const sessionId = randomUUID();
                const workspace = path.join(args.workspaceRoot, safeFileSegment(query.query_id), runId);
                await fs.mkdir(workspace, { recursive: true });
                try {
                    const execution = await runWithDeadline(
                        gateway,
                        buildAgentPayload({ args, query, llmSettings, workspace, runId, sessionId }),
                        args.requestTimeoutMs
                    );
                    const responseText = extractFinalResponse(execution.response);
                    const analysis = await gateway.analyzeAgentRun(runId, { transcriptLimit: 4000 });
                    const transcript = await gateway.runtime.readTranscript(runId, 4000);
                    analysis.toolCalls = extractTranscriptToolCalls(transcript.items || []);
                    record = buildOfficialRunRecord({
                        query,
                        responseText,
                        response: execution.response,
                        analysis,
                        model: llmSettings.model,
                        reasoningEffort: llmSettings.reasoningEffort || args.codexReasoningEffort,
                        retriever: args.retriever,
                        withGetDocument: args.withGetDocument
                    });
                    record.ailis_audit.deadline_triggered = execution.deadlineTriggered;
                    record.ailis_audit.attempt = attempt;
                    if (execution.deadlineTriggered) record.status = 'failed';
                } catch (error) {
                    record = {
                        metadata: { model: llmSettings.model, retriever: args.retriever, ailis_fixed_corpus_valid: true },
                        query_id: query.query_id,
                        tool_call_counts: {},
                        usage: {},
                        status: 'failed',
                        retrieved_docids: [],
                        result: [],
                        ailis_audit: { fixed_corpus_valid: true, attempt, runner_error: error?.message || String(error) }
                    };
                }
                if (record.status === 'completed' || attempt >= args.taskRetries) break;
            }
            await fs.writeFile(rawPath, `${JSON.stringify(record, null, 2)}\n`, 'utf8');
            results.push(record);
            process.stdout.write(`${record.status}${record.ailis_audit?.fixed_corpus_valid === false ? ' policy-invalid' : ''}\n`);
        }
        const durations = results.map((item) => Number(item.ailis_audit?.duration_ms)).filter((value) => value > 0);
        const summary = {
            ...plan,
            protocol: 'browsecomp_plus_fixed_corpus_v1',
            selected: results.length,
            completed: results.filter((item) => item.status === 'completed').length,
            fixedCorpusValid: results.filter((item) => item.ailis_audit?.fixed_corpus_valid !== false).length,
            failed: results.filter((item) => item.status !== 'completed').length,
            policyViolations: results.reduce((sum, item) => sum + (item.ailis_audit?.violations?.length || 0), 0),
            toolCalls: {
                search: results.reduce((sum, item) => sum + (Number(item.tool_call_counts?.search) || 0), 0),
                get_document: results.reduce((sum, item) => sum + (Number(item.tool_call_counts?.get_document) || 0), 0)
            },
            latency: {
                meanMs: durations.length ? Math.round(durations.reduce((sum, value) => sum + value, 0) / durations.length) : null,
                sampleCount: durations.length
            },
            officialJudgeRun: false,
            rawRunDir: args.rawDir,
            summaryPath: args.summaryPath,
            reportPath: args.reportPath,
            preflight,
            manifest: manifestStatus.manifest
        };
        await fs.writeFile(args.summaryPath, `${JSON.stringify(summary, null, 2)}\n`, 'utf8');
        await fs.writeFile(args.reportPath, buildReport(summary), 'utf8');
        console.log(JSON.stringify(summary, null, 2));
    } finally {
        gatewayStopStatus = await stopGateway(gateway);
        if (!gatewayStopStatus.ok) console.error(`Gateway stop status: ${JSON.stringify(gatewayStopStatus)}`);
    }
}

const directRun = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));
if (directRun) {
    main().catch((error) => {
        console.error(error?.stack || error?.message || String(error));
        process.exitCode = 1;
    });
}

export {
    buildAgentPayload,
    buildMcpConfig,
    buildRunManifest,
    ensureRunManifest,
    parseArgs,
    preflightRetriever,
    runWithDeadline
};
