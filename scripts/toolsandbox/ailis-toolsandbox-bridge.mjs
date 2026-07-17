import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const projectRoot = path.resolve(process.env.AILIS_PROJECT_ROOT || path.join(import.meta.dirname, '..', '..'));
const { AILISGateway } = require(path.join(projectRoot, 'electron', 'ailis-gateway.cjs'));
const { AILISRuntimeTool } = require(path.join(projectRoot, 'electron', 'ailis-tool-runtime.cjs'));

const PROTOCOL_PREFIX = '@@AILIS_TOOL_SANDBOX@@';
const pendingToolCalls = new Map();
let gateway = null;
let bridgeConfig = null;
let toolCallCount = 0;

function send(payload) {
    process.stdout.write(`${PROTOCOL_PREFIX}${JSON.stringify(payload)}\n`);
}

function normalizeText(value, fallback = '') {
    const text = typeof value === 'string' ? value.trim() : '';
    return text || fallback;
}

function loadDesktopLlmSettings() {
    if (bridgeConfig?.provider === 'codex-model-bridge') {
        const reasoningEffort = normalizeText(bridgeConfig.codexReasoningEffort, 'low');
        process.env.AILIS_CODEX_REASONING_EFFORT = reasoningEffort;
        return {
            provider: 'codex-model-bridge',
            baseUrl: 'codex://chatgpt-oauth',
            model: normalizeText(bridgeConfig.codexModel, 'gpt-5.5'),
            apiKey: '',
            authMode: 'chatgpt_oauth',
            reasoningEffort,
            temperature: 0,
            timeoutMs: Number(bridgeConfig.llmTimeoutMs || 180000)
        };
    }
    const appData = process.env.APPDATA || path.join(process.env.USERPROFILE || '', 'AppData', 'Roaming');
    const candidates = [
        path.join(appData, 'ailis', 'desktop-state.json'),
        path.join(appData, 'AILIS', 'desktop-state.json')
    ];
    let preferences = {};
    for (const candidate of candidates) {
        if (!fs.existsSync(candidate)) continue;
        try {
            const state = JSON.parse(fs.readFileSync(candidate, 'utf8'));
            preferences = state.preferences || state.state?.preferences || {};
            break;
        } catch {}
    }
    return {
        provider: normalizeText(preferences.llmProvider || process.env.AILIS_AGENT_LLM_PROVIDER || process.env.AILIS_LLM_PROVIDER, 'openai-compatible'),
        baseUrl: normalizeText(preferences.llmBaseUrl || process.env.AILIS_AGENT_LLM_BASE_URL || process.env.AILIS_LLM_BASE_URL),
        model: normalizeText(preferences.llmModel || process.env.AILIS_AGENT_LLM_MODEL || process.env.AILIS_LLM_MODEL),
        apiKey: normalizeText(preferences.llmApiKey || process.env.AILIS_AGENT_LLM_API_KEY || process.env.AILIS_LLM_API_KEY),
        temperature: 0,
        timeoutMs: Number(process.env.AILIS_TOOL_SANDBOX_LLM_TIMEOUT_MS || 120000)
    };
}

function collectUsageCandidates(value, output = [], seen = new Set(), depth = 0) {
    if (!value || typeof value !== 'object' || seen.has(value) || depth > 10) return output;
    seen.add(value);
    const input = Number(value.input_tokens ?? value.inputTokens ?? value.prompt_tokens ?? value.promptTokens);
    const outputTokens = Number(value.output_tokens ?? value.outputTokens ?? value.completion_tokens ?? value.completionTokens);
    const total = Number(value.total_tokens ?? value.totalTokens);
    if (Number.isFinite(input) || Number.isFinite(outputTokens) || Number.isFinite(total)) {
        output.push({
            inputTokens: Number.isFinite(input) ? input : 0,
            outputTokens: Number.isFinite(outputTokens) ? outputTokens : 0,
            totalTokens: Number.isFinite(total) ? total : (Number.isFinite(input) ? input : 0) + (Number.isFinite(outputTokens) ? outputTokens : 0)
        });
    }
    for (const child of Array.isArray(value) ? value : Object.values(value)) {
        collectUsageCandidates(child, output, seen, depth + 1);
    }
    return output;
}

function extractDisplayText(response) {
    return normalizeText(
        response?.displayText ||
        response?.speechText ||
        response?.taskRunHandoff?.userVisibleSummary ||
        response?.result?.displayText ||
        response?.summary?.displayText ||
        response?.error,
        'AILIS completed the requested action.'
    );
}

function callOfficialTool(name, args) {
    const requestId = `toolsandbox-tool-${Date.now()}-${toolCallCount += 1}`;
    return new Promise((resolve, reject) => {
        pendingToolCalls.set(requestId, { resolve, reject });
        send({ type: 'tool_call', requestId, name, args: args || {} });
    });
}

function registerTool(spec) {
    const name = normalizeText(spec?.name);
    if (!name) return;
    const parameters = spec.parameters && typeof spec.parameters === 'object'
        ? spec.parameters
        : { type: 'object', properties: {}, required: [] };
    const runtimeTool = new AILISRuntimeTool({
        definition: {
            id: name,
            label: name,
            description: normalizeText(spec.description, name),
            sectionId: 'toolsandbox-official',
            route: 'toolsandbox-official',
            exposure: 'direct',
            strict: false,
            status: 'available',
            materialized: true
        },
        handle: async (args) => {
            const result = await callOfficialTool(name, args);
            return {
                ok: result.ok !== false,
                status: result.ok === false ? 'tool_error' : 'completed',
                text: normalizeText(result.content, result.error || 'Tool completed.'),
                structuredContent: result,
                details: result,
                isError: result.ok === false
            };
        }
    });
    runtimeTool.spec = () => ({
        type: 'function',
        name,
        description: normalizeText(spec.description, name),
        strict: false,
        parameters
    });
    gateway.gatewayToolRuntimeRegistry.register(runtimeTool);
}

async function initialize(command) {
    bridgeConfig = command;
    const outputDir = path.resolve(command.outputDir);
    const auditDir = path.join(outputDir, 'ailis-audit');
    const workspaceRoot = path.join(outputDir, 'workspace');
    fs.mkdirSync(auditDir, { recursive: true });
    fs.mkdirSync(workspaceRoot, { recursive: true });
    gateway = new AILISGateway({
        port: 0,
        workspaceRoot,
        projectRoot,
        auditDir
    });
    const benchmarkToolNames = (command.tools || []).map((spec) => normalizeText(spec?.name)).filter(Boolean);
    for (const spec of command.tools || []) registerTool(spec);
    // AILIS intentionally caps the default TaskAgent surface to the first direct tools.
    // Put this scenario's official tools first without changing the production router.
    const registeredTools = gateway.gatewayToolRuntimeRegistry.tools;
    gateway.gatewayToolRuntimeRegistry.tools = new Map([
        ...benchmarkToolNames
            .filter((name) => registeredTools.has(name))
            .map((name) => [name, registeredTools.get(name)]),
        ...[...registeredTools.entries()].filter(([name]) => !benchmarkToolNames.includes(name))
    ]);
    const status = await gateway.start();
    send({
        type: 'initialized',
        requestId: command.requestId,
        status: status?.url ? 'ready' : 'started',
        provider: command.provider || 'desktop',
        model: command.provider === 'codex-model-bridge' ? command.codexModel : '',
        toolCount: (command.tools || []).length,
        firstDirectTools: gateway.gatewayToolRuntimeRegistry
            .modelVisibleSpecs()
            .slice(0, 8)
            .map((spec) => spec.name || spec.function?.name)
    });
}

async function runAgent(command) {
    const llmSettings = loadDesktopLlmSettings();
    const providerNeedsApiKey = !['codex-model-bridge', 'vllm', 'ollama'].includes(
        normalizeText(llmSettings.provider).toLowerCase()
    );
    if (!llmSettings.baseUrl || !llmSettings.model || (providerNeedsApiKey && !llmSettings.apiKey)) {
        throw new Error('Missing AILIS desktop LLM settings.');
    }
    const maxAgentSteps = Math.max(1, Math.min(Number(bridgeConfig.maxAgentSteps || 7), 20));
    const startedAt = Date.now();
    const response = await gateway.runAgent({
        sessionId: bridgeConfig.sessionId,
        message: command.message,
        messageHistory: [],
        attachments: [],
        agentLoop: 'llm',
        planner: 'llm',
        maxAgentSteps,
        maxSteps: maxAgentSteps,
        llmSettings,
        directToolExecutor: true,
        nativeDirectTools: true,
        context: {
            workspace: path.join(path.resolve(bridgeConfig.outputDir), 'workspace'),
            agentLoop: 'llm',
            planner: 'llm',
            maxAgentSteps,
            llmSettings,
            directToolExecutor: true,
            nativeDirectTools: true,
            agentRole: 'persona_orchestrator',
            desktopRealEval: true,
            desktopRealEvalTaskId: bridgeConfig.scenarioName,
            desktopRealEvalTaskText: bridgeConfig.originalTask,
            benchmarkName: 'Apple ToolSandbox',
            benchmarkScenario: bridgeConfig.scenarioName,
            approved: true,
            autoConfirm: true,
            approvalPolicy: 'auto',
            confirmationPolicy: 'auto',
            executeExternal: true,
            allowOutsideWorkspace: false,
            allowComputerWideAccess: false
        }
    });
    const responsePath = path.join(path.resolve(bridgeConfig.outputDir), `ailis-response-${command.turn}.json`);
    fs.writeFileSync(responsePath, `${JSON.stringify(response, null, 2)}\n`, 'utf8');
    send({
        type: 'run_result',
        requestId: command.requestId,
        ok: response?.ok !== false,
        status: response?.status || (response?.ok === false ? 'failed' : 'completed'),
        text: extractDisplayText(response),
        durationMs: Date.now() - startedAt,
        provider: llmSettings.provider,
        model: llmSettings.model,
        toolCallCount,
        usageCandidates: collectUsageCandidates(response),
        responsePath
    });
}

async function shutdown(command) {
    if (gateway) await gateway.stop().catch(() => {});
    send({ type: 'shutdown_complete', requestId: command.requestId });
    process.exit(0);
}

const rl = readline.createInterface({ input: process.stdin, crlfDelay: Infinity });
rl.on('line', (line) => {
    let command;
    try {
        command = JSON.parse(line);
    } catch (error) {
        send({ type: 'protocol_error', error: error.message });
        return;
    }
    if (command.type === 'tool_result') {
        const pending = pendingToolCalls.get(command.requestId);
        if (pending) {
            pendingToolCalls.delete(command.requestId);
            pending.resolve(command.result || {});
        }
        return;
    }
    const operation = command.type === 'initialize'
        ? initialize(command)
        : command.type === 'run'
            ? runAgent(command)
            : command.type === 'shutdown'
                ? shutdown(command)
                : Promise.reject(new Error(`Unknown bridge command: ${command.type}`));
    operation.catch((error) => send({
        type: 'bridge_error',
        requestId: command.requestId,
        error: error?.stack || error?.message || String(error)
    }));
});

process.on('uncaughtException', (error) => send({ type: 'bridge_error', error: error?.stack || String(error) }));
process.on('unhandledRejection', (error) => send({ type: 'bridge_error', error: error?.stack || String(error) }));
