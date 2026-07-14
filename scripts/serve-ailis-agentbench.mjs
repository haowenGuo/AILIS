import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { AILISGateway } = require('../electron/ailis-gateway.cjs');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');

function parseArgs(argv = process.argv.slice(2)) {
    const args = {
        host: '0.0.0.0',
        port: 5128,
        auditDir: path.join(PROJECT_ROOT, 'eval-results', 'agentbench-official', 'bridge-audit')
    };
    for (let index = 0; index < argv.length; index += 1) {
        if (argv[index] === '--host') args.host = argv[++index] || args.host;
        else if (argv[index] === '--port') args.port = Math.max(1, Number(argv[++index]) || args.port);
        else if (argv[index] === '--audit-dir') args.auditDir = path.resolve(argv[++index] || args.auditDir);
    }
    return args;
}

function normalizeText(value, fallback = '') {
    return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

function readDesktopLlmSettings() {
    const appData = process.env.APPDATA || path.join(process.env.USERPROFILE || '', 'AppData', 'Roaming');
    const statePath = path.join(appData, 'ailis', 'desktop-state.json');
    if (!fs.existsSync(statePath)) throw new Error(`desktop-state.json not found: ${statePath}`);
    const preferences = JSON.parse(fs.readFileSync(statePath, 'utf8')).preferences || {};
    const settings = {
        provider: normalizeText(preferences.llmProvider, 'openai-compatible'),
        baseUrl: normalizeText(preferences.llmBaseUrl),
        model: normalizeText(preferences.llmModel),
        apiKey: normalizeText(preferences.llmApiKey),
        temperature: 0.2,
        timeoutMs: 180000
    };
    if (!settings.baseUrl || !settings.model || !settings.apiKey) {
        throw new Error('AILIS desktop LLM settings are incomplete');
    }
    return settings;
}

function readJsonRequest(request, maxBytes = 4 * 1024 * 1024) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        let size = 0;
        request.on('data', (chunk) => {
            size += chunk.length;
            if (size > maxBytes) {
                reject(Object.assign(new Error('request body too large'), { statusCode: 413 }));
                request.destroy();
                return;
            }
            chunks.push(chunk);
        });
        request.on('end', () => {
            try {
                resolve(JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}'));
            } catch (error) {
                reject(Object.assign(error, { statusCode: 400 }));
            }
        });
        request.on('error', reject);
    });
}

function writeJson(response, statusCode, payload) {
    response.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
    response.end(`${JSON.stringify(payload)}\n`);
}

function normalizeHistory(history) {
    return (Array.isArray(history) ? history : []).map((item) => ({
        role: item?.role === 'assistant' || item?.role === 'agent' ? 'assistant' : 'user',
        content: normalizeText(item?.content)
    }));
}

function summarizeUsage(result) {
    const usage = { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 };
    const seen = new Set();
    for (const event of Array.isArray(result?.events) ? result.events : []) {
        if (event?.type !== 'agent.llm_call' && event?.type !== 'llm_call') continue;
        const key = event?.payload?.callId || event?.callId || JSON.stringify(event);
        if (seen.has(key)) continue;
        seen.add(key);
        const item = event?.payload?.usage || event?.usage || {};
        usage.prompt_tokens += Number(item.promptTokens || item.prompt_tokens || 0);
        usage.completion_tokens += Number(item.completionTokens || item.completion_tokens || 0);
        usage.total_tokens += Number(item.totalTokens || item.total_tokens || 0);
    }
    if (!usage.total_tokens) usage.total_tokens = usage.prompt_tokens + usage.completion_tokens;
    return usage;
}

function chatCompletionsUrl(baseUrl) {
    const normalized = normalizeText(baseUrl).replace(/\/+$/, '');
    if (normalized.endsWith('/chat/completions')) return normalized;
    return `${normalized}/chat/completions`;
}

function appendJsonLine(file, value) {
    fs.appendFileSync(file, `${JSON.stringify(value)}\n`, 'utf8');
}

export function buildAgentBenchRunRequest(payload, llmSettings) {
    const history = normalizeHistory(payload?.history);
    if (!history.length) throw Object.assign(new Error('history is required'), { statusCode: 400 });
    const transcript = history
        .map((item) => `${item.role === 'assistant' ? 'AGENT' : 'USER'}:\n${item.content}`)
        .join('\n\n');
    const message = [
        'Act as the agent in this official AgentBench external environment.',
        'The transcript below is authoritative. Follow its environment protocol and constraints exactly.',
        'Return only the next AGENT message. Do not summarize the transcript or answer in a different format.',
        'Produce exactly one environment action for this turn, then stop.',
        'Never invent, simulate, or append USER or environment feedback, or a later AGENT turn.',
        'Do not include role labels such as USER: or AGENT: in the output.',
        'Match the current environment output grammar exactly, including every required delimiter and line break.',
        'When the protocol uses a fenced code block, put both fences on their own lines.',
        '',
        transcript
    ].join('\n');
    const sessionId = normalizeText(payload?.session_id, `agentbench-${Date.now()}`);
    const turn = Math.max(1, Number(payload?.turn) || 1);
    return {
        runId: `${sessionId}:turn:${turn}`,
        sessionId,
        message,
        messageHistory: [],
        agentLoop: 'llm',
        planner: 'llm',
        maxAgentSteps: 1,
        llmSettings,
        context: {
            evaluationName: 'agentbench-official-v0.2',
            executionProfile: 'official_external_environment',
            externalEnvironmentProtocol: true,
            agentRole: 'task_agent',
            contextMode: 'task_agent',
            cleanContext: true,
            directToolExecutor: false,
            nativeDirectTools: false,
            includeExternalToolExposureInPrompt: false,
            computerControlEnabled: false,
            maxAgentSteps: 1,
            llmSettings
        }
    };
}

async function main() {
    const args = parseArgs();
    const llmSettings = readDesktopLlmSettings();
    fs.mkdirSync(args.auditDir, { recursive: true });
    const gateway = new AILISGateway({
        host: '127.0.0.1',
        port: 0,
        workspaceDir: PROJECT_ROOT,
        auditDir: args.auditDir,
        mcpConfigPath: path.join(PROJECT_ROOT, '.ailis-state', 'mcp-servers.json')
    });
    await gateway.start();
    const usageByRun = new Map();
    gateway.on('event', (event) => {
        if (event?.type !== 'agent.llm_call.completed') return;
        const payload = event.payload || {};
        if (!payload.runId) return;
        const usage = payload.usage || {};
        usageByRun.set(payload.runId, {
            prompt_tokens: Number(usage.promptTokens || usage.prompt_tokens || 0),
            completion_tokens: Number(usage.completionTokens || usage.completion_tokens || 0),
            total_tokens: Number(usage.totalTokens || usage.total_tokens || 0)
        });
    });
    const server = http.createServer(async (request, response) => {
        if (request.method === 'GET' && request.url === '/health') {
            writeJson(response, 200, {
                ok: true,
                provider: llmSettings.provider,
                model: llmSettings.model
            });
            return;
        }
        if (request.method === 'POST' && request.url === '/v1/chat/completions') {
            const evaluatorStartedAt = Date.now();
            try {
                const payload = await readJsonRequest(request);
                const upstream = await fetch(chatCompletionsUrl(llmSettings.baseUrl), {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json',
                        authorization: `Bearer ${llmSettings.apiKey}`
                    },
                    body: JSON.stringify({
                        ...payload,
                        model: llmSettings.model,
                        temperature: 0
                    }),
                    signal: AbortSignal.timeout(llmSettings.timeoutMs)
                });
                const text = await upstream.text();
                let responsePayload;
                try {
                    responsePayload = JSON.parse(text);
                } catch {
                    responsePayload = { error: { message: text || 'invalid evaluator response' } };
                }
                appendJsonLine(path.join(args.auditDir, 'evaluator-usage.jsonl'), {
                    at: new Date().toISOString(),
                    ok: upstream.ok,
                    status: upstream.status,
                    duration_ms: Date.now() - evaluatorStartedAt,
                    model: llmSettings.model,
                    usage: responsePayload?.usage || null
                });
                writeJson(response, upstream.status, responsePayload);
            } catch (error) {
                appendJsonLine(path.join(args.auditDir, 'evaluator-usage.jsonl'), {
                    at: new Date().toISOString(),
                    ok: false,
                    duration_ms: Date.now() - evaluatorStartedAt,
                    model: llmSettings.model,
                    error: error?.message || String(error)
                });
                writeJson(response, error?.statusCode || 502, { error: { message: error?.message || String(error) } });
            }
            return;
        }
        if (request.method !== 'POST' || request.url !== '/inference') {
            writeJson(response, 404, { error: 'not_found' });
            return;
        }
        const startedAt = Date.now();
        try {
            const payload = await readJsonRequest(request);
            const runRequest = buildAgentBenchRunRequest(payload, llmSettings);
            const result = await gateway.runAgent(runRequest);
            const content = normalizeText(result?.displayText || result?.speechText || result?.message);
            if (!content) throw new Error(`AILIS returned no action (${result?.status || 'unknown'})`);
            writeJson(response, 200, {
                content,
                metrics: {
                    ok: result?.ok === true,
                    status: result?.status || '',
                    duration_ms: Date.now() - startedAt,
                    usage: usageByRun.get(runRequest.runId) || summarizeUsage(result)
                }
            });
            usageByRun.delete(runRequest.runId);
        } catch (error) {
            writeJson(response, error?.statusCode || 500, { error: error?.message || String(error) });
        }
    });
    await new Promise((resolve) => server.listen(args.port, args.host, resolve));
    console.log(JSON.stringify({
        ok: true,
        host: args.host,
        port: args.port,
        provider: llmSettings.provider,
        model: llmSettings.model
    }));
    const shutdown = async () => {
        server.close();
        await gateway.stop?.().catch(() => {});
        process.exit(0);
    };
    process.once('SIGINT', shutdown);
    process.once('SIGTERM', shutdown);
}

if (path.resolve(process.argv[1] || '') === fileURLToPath(import.meta.url)) {
    main().catch((error) => {
        console.error(error?.stack || error?.message || String(error));
        process.exitCode = 1;
    });
}
