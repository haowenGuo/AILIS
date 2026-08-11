// Clean OSWorld transport: the production AILIS Gateway is the only reasoning agent.
import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

import {
    configureResearchMcpLlmEnvironment,
    loadDesktopStateSettings
} from './ailis-eval-runtime-config.mjs';
import { OSWorldComputerBridgeTool } from './osworld/osworld-computer-bridge.mjs';

const require = createRequire(import.meta.url);
const { AILISGateway } = require('../electron/ailis-gateway.cjs');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');

function normalizeText(value, fallback = '') {
    return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

function parseArgs(argv = process.argv.slice(2)) {
    const args = {
        bridgeUrl: '',
        instructionFile: '',
        initialScreenshot: '',
        outputPath: '',
        artifactDir: '',
        workspaceRoot: '',
        codexModelBridge: true,
        codexModel: normalizeText(process.env.AILIS_CODEX_MODEL, 'gpt-5.6-luna'),
        codexReasoningEffort: normalizeText(process.env.AILIS_CODEX_REASONING_EFFORT, 'medium'),
        llmTimeoutMs: 120000,
        requestTimeoutMs: 0,
        temperature: 0.2
    };
    for (let index = 0; index < argv.length; index += 1) {
        const token = argv[index];
        const next = () => argv[++index] || '';
        if (token === '--bridge-url') args.bridgeUrl = normalizeText(next()).replace(/\/+$/, '');
        else if (token === '--instruction-file') args.instructionFile = path.resolve(next());
        else if (token === '--initial-screenshot') args.initialScreenshot = path.resolve(next());
        else if (token === '--output') args.outputPath = path.resolve(next());
        else if (token === '--artifact-dir') args.artifactDir = path.resolve(next());
        else if (token === '--workspace-root') args.workspaceRoot = path.resolve(next());
        else if (token === '--codex-model') args.codexModel = normalizeText(next(), args.codexModel);
        else if (token === '--codex-reasoning-effort') args.codexReasoningEffort = normalizeText(next(), args.codexReasoningEffort);
        else if (token === '--llm-timeout-ms') args.llmTimeoutMs = Math.max(30000, Number(next()) || args.llmTimeoutMs);
        else if (token === '--request-timeout-ms') args.requestTimeoutMs = Math.max(0, Number(next()) || 0);
        else if (token === '--temperature') args.temperature = Math.min(2, Math.max(0, Number(next()) || args.temperature));
        else if (token === '--no-codex-model-bridge') args.codexModelBridge = false;
    }
    if (!args.bridgeUrl) throw new Error('--bridge-url is required');
    if (!args.instructionFile || !fsSync.existsSync(args.instructionFile)) {
        throw new Error('--instruction-file must point to an existing file');
    }
    if (!args.initialScreenshot || !fsSync.existsSync(args.initialScreenshot)) {
        throw new Error('--initial-screenshot must point to an existing PNG');
    }
    args.outputPath ||= path.join(path.dirname(args.instructionFile), 'agent-result.json');
    args.artifactDir ||= path.join(path.dirname(args.outputPath), 'agent-observations');
    args.workspaceRoot ||= path.join(os.tmpdir(), 'ailis-osworld', randomUUID());
    return args;
}

function imageAttachment(filePath) {
    const stat = fsSync.statSync(filePath);
    return {
        type: 'image',
        id: `osworld-initial-${randomUUID()}`,
        source: 'osworld-observation',
        label: 'OSWorld initial desktop screenshot',
        name: path.basename(filePath),
        path: filePath,
        image_url: filePath,
        mimeType: 'image/png',
        size: stat.size,
        modifiedAt: stat.mtime.toISOString()
    };
}

function extractFinalAnswer(response = {}) {
    return normalizeText(
        response?.taskRunHandoff?.finalAnswer ||
        response?.task_run_handoff?.final_answer ||
        response?.final_answer ||
        response?.finalAnswer ||
        response?.displayText ||
        response?.answer ||
        response?.message
    );
}

async function runWithDeadline(gateway, payload, timeoutMs) {
    const promise = gateway.runAgent(payload);
    if (!timeoutMs) return { response: await promise, deadlineTriggered: false };
    let timer;
    const winner = await Promise.race([
        promise.then((response) => ({ response })),
        new Promise((resolve) => {
            timer = setTimeout(() => resolve({ timeout: true }), timeoutMs);
        })
    ]);
    clearTimeout(timer);
    if (!winner.timeout) return { response: winner.response, deadlineTriggered: false };
    const interruptResult = await gateway.interruptAgentRun({
        runId: payload.runId,
        sessionId: payload.sessionId,
        reason: 'osworld_configured_deadline',
        source: 'osworld_transport'
    });
    return { response: await promise, deadlineTriggered: true, interruptResult };
}

async function main() {
    const args = parseArgs();
    const instruction = normalizeText(await fs.readFile(args.instructionFile, 'utf8'));
    if (!instruction) throw new Error('OSWorld instruction is empty');
    await fs.mkdir(path.dirname(args.outputPath), { recursive: true });
    await fs.mkdir(args.artifactDir, { recursive: true });
    await fs.mkdir(args.workspaceRoot, { recursive: true });

    const runtimeSettings = loadDesktopStateSettings(args);
    const llmSettings = runtimeSettings.llmSettings;
    configureResearchMcpLlmEnvironment(llmSettings);
    const computerTool = new OSWorldComputerBridgeTool({
        bridgeUrl: args.bridgeUrl,
        artifactDir: args.artifactDir,
        timeoutMs: Math.max(args.llmTimeoutMs, 120000)
    });
    const gateway = new AILISGateway({
        host: '127.0.0.1',
        port: 0,
        projectRoot: PROJECT_ROOT,
        workspaceRoot: args.workspaceRoot,
        auditDir: path.join(path.dirname(args.outputPath), 'gateway-audit'),
        computerTool,
        directLocalToolIds: ['computer'],
        toolAllowlist: ['computer', 'tool_search', 'update_plan'],
        disableBuiltinAilisResearchMcp: true,
        emberHarnessEnabled: false,
        profileCurationEnabled: false,
        mcpServers: {}
    });

    const runId = randomUUID();
    const sessionId = randomUUID();
    const effectiveMessage = [
        'OSWorld desktop task:',
        instruction,
        '',
        'Complete the objective inside the isolated Ubuntu desktop shown in the attached screenshot.',
        'Use the computer GUI actions and inspect the fresh screenshot returned after each action.',
        'Do not merely explain how to do it. When the desktop objective is complete, return a normal final response.'
    ].join('\n');
    const payload = {
        runId,
        sessionId,
        message: effectiveMessage,
        messageHistory: [],
        attachments: [imageAttachment(args.initialScreenshot)],
        agentLoop: 'llm',
        planner: 'llm',
        memoryPolicy: 'disabled',
        llmSettings,
        directToolExecutor: true,
        nativeDirectTools: true,
        context: {
            runId,
            sessionId,
            workspace: args.workspaceRoot,
            memoryPolicy: 'disabled',
            agentLoop: 'llm',
            planner: 'llm',
            llmSettings,
            directToolExecutor: true,
            nativeDirectTools: true,
            directToolLimit: 4,
            agentRole: 'task_agent',
            computerControlEnabled: true,
            permissionProfile: 'danger-full-access',
            approvalPolicy: 'never',
            confirmationPolicy: 'never',
            visionPermissionPolicy: 'auto',
            approved: true,
            executeExternal: false,
            allowOutsideWorkspace: false,
            allowComputerWideAccess: false,
            allowSystemMutation: false,
            benchmarkEnvironment: 'osworld',
            benchmarkTransport: 'official_desktop_env_computer_13'
        }
    };

    const startedAt = Date.now();
    let execution;
    let stopStatus = null;
    try {
        await gateway.start();
        execution = await runWithDeadline(gateway, payload, args.requestTimeoutMs);
    } finally {
        stopStatus = await gateway.stop().catch((error) => ({
            ok: false,
            status: 'gateway_stop_failed',
            error: error?.message || String(error)
        }));
    }
    const result = {
        schema: 'ailis.osworld.task_agent_result.v1',
        protocol: 'clean-production-task-agent',
        runId,
        sessionId,
        instruction,
        durationMs: Date.now() - startedAt,
        deadlineTriggered: execution?.deadlineTriggered === true,
        interruptResult: execution?.interruptResult || null,
        finalAnswer: extractFinalAnswer(execution?.response),
        response: execution?.response || null,
        gatewayStopStatus: stopStatus,
        runtime: {
            provider: llmSettings.provider,
            model: llmSettings.model,
            reasoningEffort: llmSettings.reasoningEffort || args.codexReasoningEffort
        }
    };
    await fs.writeFile(args.outputPath, `${JSON.stringify(result, null, 2)}\n`, 'utf8');
    process.stdout.write(`${JSON.stringify({
        ok: execution?.response?.ok !== false && !result.deadlineTriggered,
        status: execution?.response?.status || 'completed',
        finalAnswer: result.finalAnswer,
        outputPath: args.outputPath
    })}\n`);
}

main().catch(async (error) => {
    const message = error?.stack || error?.message || String(error);
    console.error(message);
    process.exitCode = 1;
});

export { extractFinalAnswer, imageAttachment, parseArgs };
