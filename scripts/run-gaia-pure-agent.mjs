// Dataset transport and scorer adapter. AILIS is the only component that answers.
import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

import {
    configureResearchMcpLlmEnvironment,
    loadDesktopStateSettings
} from './ailis-eval-runtime-config.mjs';

const require = createRequire(import.meta.url);
const { AILISGateway } = require('../electron/ailis-gateway.cjs');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const DEFAULT_OUTPUT_DIR = path.join(PROJECT_ROOT, 'eval-results', 'engineering', 'gaia-level1-lite-public');
const DEFAULT_SCORING_API = 'https://agents-course-unit4-scoring.hf.space';
const DEFAULT_FILE_MIRROR = 'https://huggingface.co/spaces/Shamik/unit_4_GAIA_challenge/resolve/main';

function normalizeText(value, fallback = '') {
    if (typeof value === 'number' && Number.isFinite(value)) {
        return String(value);
    }
    if (typeof value !== 'string') {
        return fallback;
    }
    const trimmed = value.trim();
    return trimmed || fallback;
}

function parseBoolEnv(value = '', fallback = false) {
    const text = normalizeText(String(value || '')).toLowerCase();
    if (!text) return fallback;
    return /^(1|true|yes|on)$/.test(text);
}

function safeFileSegment(value, fallback = 'item') {
    return normalizeText(value, fallback).replace(/[^A-Za-z0-9_.-]+/g, '_').slice(0, 180) || fallback;
}

function parseTimeout(value, fallback, minimum = 30000) {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) return fallback;
    if (parsed === 0) return 0;
    return Math.max(minimum, Math.floor(parsed));
}

function parseArgs(argv = process.argv.slice(2)) {
    const args = {
        outputDir: DEFAULT_OUTPUT_DIR,
        runId: new Date().toISOString().replace(/[:.]/g, '-'),
        scoringApi: DEFAULT_SCORING_API,
        fileMirror: DEFAULT_FILE_MIRROR,
        username: 'AILIS-local-codex',
        submit: false,
        limit: 0,
        offset: 0,
        // Kept only so old launch commands remain valid. A6 terminates naturally.
        maxAgentSteps: 20,
        requestTimeoutMs: 0,
        downloadTimeoutMs: 120000,
        llmTimeoutMs: 120000,
        temperature: 0.2,
        taskRetries: 1,
        submitTimeoutMs: 90000,
        benchmarkName: 'gaia-level1-lite-public',
        agentCode: 'AILIS Agent through a neutral dataset transport adapter',
        directToolExecutor: process.env.AILIS_GAIA_DIRECT_TOOL_EXECUTOR === undefined
            ? true
            : parseBoolEnv(process.env.AILIS_GAIA_DIRECT_TOOL_EXECUTOR),
        agentRole: 'task_agent',
        codexModelBridge: process.env.AILIS_EVAL_CODEX_MODEL_BRIDGE === undefined
            ? true
            : parseBoolEnv(process.env.AILIS_EVAL_CODEX_MODEL_BRIDGE),
        codexModel: normalizeText(process.env.AILIS_CODEX_MODEL, 'gpt-5.6-luna'),
        codexReasoningEffort: normalizeText(process.env.AILIS_CODEX_REASONING_EFFORT, 'medium'),
        isolatedWorkspace: true,
        workspaceRoot: ''
    };

    for (let index = 0; index < argv.length; index += 1) {
        const token = argv[index];
        const next = () => argv[++index] || '';
        if (token === '--output-dir') args.outputDir = path.resolve(next());
        else if (token === '--run-id') args.runId = normalizeText(next(), args.runId);
        else if (token === '--scoring-api') args.scoringApi = normalizeText(next(), args.scoringApi).replace(/\/+$/, '');
        else if (token === '--file-mirror') args.fileMirror = normalizeText(next(), args.fileMirror).replace(/\/+$/, '');
        else if (token === '--username') args.username = normalizeText(next(), args.username);
        else if (token === '--submit') args.submit = true;
        else if (token === '--no-submit') args.submit = false;
        else if (token === '--limit') args.limit = Math.max(0, Number(next()) || 0);
        else if (token === '--offset') args.offset = Math.max(0, Number(next()) || 0);
        else if (token === '--max-agent-steps') args.maxAgentSteps = Math.max(1, Math.min(Number(next()) || args.maxAgentSteps, 1000));
        else if (token === '--request-timeout-ms') args.requestTimeoutMs = parseTimeout(next(), args.requestTimeoutMs);
        else if (token === '--download-timeout-ms') args.downloadTimeoutMs = parseTimeout(next(), args.downloadTimeoutMs, 1000);
        else if (token === '--llm-timeout-ms') args.llmTimeoutMs = parseTimeout(next(), args.llmTimeoutMs);
        else if (token === '--temperature') args.temperature = Math.min(Math.max(Number(next()) || args.temperature, 0), 2);
        else if (token === '--task-retries') {
            const parsed = Number(next());
            args.taskRetries = Math.max(0, Math.min(Number.isFinite(parsed) ? parsed : args.taskRetries, 3));
        } else if (token === '--submit-timeout-ms') {
            args.submitTimeoutMs = parseTimeout(next(), args.submitTimeoutMs, 1000);
        } else if (token === '--benchmark-name') {
            args.benchmarkName = normalizeText(next(), args.benchmarkName);
        } else if (token === '--agent-code') {
            args.agentCode = normalizeText(next(), args.agentCode);
        } else if (token === '--direct-tool-executor') {
            args.directToolExecutor = true;
        } else if (token === '--no-direct-tool-executor') {
            args.directToolExecutor = false;
        } else if (token === '--agent-role') {
            args.agentRole = normalizeText(next(), args.agentRole);
        } else if (token === '--codex-model-bridge') {
            args.codexModelBridge = true;
        } else if (token === '--no-codex-model-bridge') {
            args.codexModelBridge = false;
        } else if (token === '--codex-model') {
            args.codexModel = normalizeText(next(), args.codexModel);
        } else if (token === '--codex-reasoning-effort') {
            args.codexReasoningEffort = normalizeText(next(), args.codexReasoningEffort);
        } else if (token === '--workspace-root') {
            args.workspaceRoot = path.resolve(next());
        } else if (token === '--isolated-workspace') {
            args.isolatedWorkspace = true;
        } else if (token === '--desktop-workspace') {
            args.isolatedWorkspace = false;
        }
    }

    args.outputDir = path.resolve(args.outputDir);
    args.filesDir = path.join(args.outputDir, 'files');
    args.resultPath = path.join(args.outputDir, `${args.runId}.jsonl`);
    args.summaryPath = path.join(args.outputDir, `${args.runId}.summary.json`);
    args.reportPath = path.join(args.outputDir, `${args.runId}.report.md`);
    args.answerDir = path.join(args.outputDir, 'answers', args.runId);
    args.workspaceRoot = args.isolatedWorkspace
        ? path.resolve(args.workspaceRoot || path.join(os.tmpdir(), 'ailis-agent-runtime', randomUUID()))
        : path.resolve(args.workspaceRoot || PROJECT_ROOT);
    return args;
}

async function fetchJson(url, options = {}, timeoutMs = 60000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    try {
        const response = await fetch(url, { ...options, signal: controller.signal });
        const text = await response.text();
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${text.slice(0, 500)}`);
        }
        return text ? JSON.parse(text) : null;
    } finally {
        clearTimeout(timeoutId);
    }
}

async function downloadFile(url, targetPath, timeoutMs = 120000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    try {
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) {
            const text = await response.text().catch(() => '');
            throw new Error(`HTTP ${response.status}: ${text.slice(0, 300)}`);
        }
        const buffer = Buffer.from(await response.arrayBuffer());
        await fs.mkdir(path.dirname(targetPath), { recursive: true });
        await fs.writeFile(targetPath, buffer);
        return { ok: true, path: targetPath, bytes: buffer.length };
    } finally {
        clearTimeout(timeoutId);
    }
}

async function ensureQuestionFile(args, question) {
    const fileName = normalizeText(question.file_name);
    if (!fileName) return null;
    const localName = safeFileSegment(path.basename(fileName), 'attachment.bin');
    const targetPath = path.join(args.filesDir, localName);
    if (fsSync.existsSync(targetPath) && fsSync.statSync(targetPath).size > 0) {
        return targetPath;
    }
    const url = `${args.fileMirror}/${encodeURIComponent(fileName)}`;
    await downloadFile(url, targetPath, args.downloadTimeoutMs);
    return targetPath;
}

async function prepareTaskWorkspace(args, question, sourceFilePath = '') {
    if (!args.isolatedWorkspace) {
        return {
            workspaceDir: args.workspaceRoot,
            filePath: sourceFilePath || '',
            displayName: sourceFilePath
                ? normalizeText(question.file_name, path.basename(sourceFilePath))
                : ''
        };
    }
    const workspaceDir = path.join(args.workspaceRoot, randomUUID());
    await fs.mkdir(workspaceDir, { recursive: true });
    if (!sourceFilePath) {
        return { workspaceDir, filePath: '', displayName: '' };
    }
    const extension = path.extname(sourceFilePath).toLowerCase();
    const displayName = `attachment${extension}`;
    const filePath = path.join(workspaceDir, displayName);
    await fs.copyFile(sourceFilePath, filePath);
    return { workspaceDir, filePath, displayName };
}

function validateLlmSettings(settings = {}) {
    const provider = normalizeText(settings.provider).toLowerCase();
    if (!provider || !normalizeText(settings.model)) {
        throw new Error('LLM settings incomplete: provider and model are required.');
    }
    const keylessProviders = new Set(['codex-model-bridge', 'ollama', 'vllm']);
    if (!keylessProviders.has(provider) && !normalizeText(settings.baseUrl)) {
        throw new Error(`LLM settings incomplete for ${provider}: baseUrl is required.`);
    }
    if (!keylessProviders.has(provider) && !normalizeText(settings.apiKey)) {
        throw new Error(`LLM settings incomplete for ${provider}: apiKey is required.`);
    }
}

function buildQuestionAttachment({ filePath = '', displayName = '' } = {}) {
    if (!filePath || !fsSync.existsSync(filePath)) return null;
    const stat = fsSync.statSync(filePath);
    const name = normalizeText(displayName, path.basename(filePath));
    return {
        type: 'file',
        id: `file-${randomUUID()}`,
        source: 'user-attachment',
        label: name,
        name,
        path: filePath,
        extension: path.extname(name).toLowerCase(),
        kind: 'file',
        size: stat.size,
        modifiedAt: stat.mtime.toISOString()
    };
}

function buildPureAgentPayload({
    args,
    question,
    filePath = '',
    displayName = '',
    workspaceDir,
    llmSettings,
    runId = randomUUID(),
    sessionId = randomUUID()
}) {
    const attachment = buildQuestionAttachment({ filePath, displayName });
    const attachments = attachment ? [attachment] : [];
    return {
        runId,
        sessionId,
        message: normalizeText(question.question),
        messageHistory: [],
        attachments,
        agentLoop: 'llm',
        planner: 'llm',
        memoryPolicy: 'disabled',
        llmSettings,
        directToolExecutor: args.directToolExecutor,
        nativeDirectTools: args.directToolExecutor,
        context: {
            runId,
            sessionId,
            workspace: workspaceDir,
            memoryPolicy: 'disabled',
            agentLoop: 'llm',
            planner: 'llm',
            llmSettings,
            directToolExecutor: args.directToolExecutor,
            nativeDirectTools: args.directToolExecutor,
            agentRole: args.agentRole,
            computerControlEnabled: true,
            permissionProfile: 'danger-full-access',
            approvalPolicy: 'never',
            confirmationPolicy: 'never',
            visionPermissionPolicy: 'auto',
            approved: true,
            autoConfirm: false,
            executeExternal: true,
            allowOutsideWorkspace: !args.isolatedWorkspace,
            allowComputerWideAccess: !args.isolatedWorkspace,
            allowSystemMutation: true
        }
    };
}

function extractAgentFinalAnswer(response = {}) {
    const candidates = [
        ['task_result_final_answer', response.taskRunHandoff?.finalAnswer || response.task_run_handoff?.final_answer],
        ['final_answer', response.final_answer],
        ['finalAnswer', response.finalAnswer]
    ];
    for (const [source, value] of candidates) {
        const answer = normalizeText(value);
        if (answer) return { answer, source };
    }
    return { answer: '', source: '' };
}

async function writeAnswerArtifact(args, question, answer) {
    const targetPath = path.join(args.answerDir, `${safeFileSegment(question.task_id)}.txt`);
    await fs.mkdir(path.dirname(targetPath), { recursive: true });
    await fs.writeFile(targetPath, `${answer}\n`, 'utf8');
    return targetPath;
}

async function fetchQuestions(args) {
    const questions = await fetchJson(`${args.scoringApi}/questions`, {}, 60000);
    if (!Array.isArray(questions) || !questions.length) {
        throw new Error(`No questions returned from ${args.scoringApi}/questions`);
    }
    const offsetQuestions = questions.slice(args.offset);
    return args.limit ? offsetQuestions.slice(0, args.limit) : offsetQuestions;
}

async function runWithConfiguredDeadline({ gateway, payload, timeoutMs = 0 }) {
    const runPromise = gateway.runAgent(payload);
    if (!timeoutMs) {
        return { response: await runPromise, deadlineTriggered: false, interruptResult: null };
    }

    let timeoutId = null;
    const deadline = new Promise((resolve) => {
        timeoutId = setTimeout(() => resolve({ deadline: true }), timeoutMs);
    });
    const first = await Promise.race([
        runPromise.then((response) => ({ response })),
        deadline
    ]);
    if (timeoutId) clearTimeout(timeoutId);
    if (!first.deadline) {
        return { response: first.response, deadlineTriggered: false, interruptResult: null };
    }

    const interruptResult = await gateway.interruptAgentRun({
        runId: payload.runId,
        sessionId: payload.sessionId,
        reason: 'configured_run_deadline',
        source: 'dataset_transport_adapter'
    });
    const response = await runPromise;
    return { response, deadlineTriggered: true, interruptResult };
}

async function callAgent({ gateway, args, question, taskWorkspace, llmSettings }) {
    const payload = buildPureAgentPayload({
        args,
        question,
        filePath: taskWorkspace.filePath,
        displayName: taskWorkspace.displayName,
        workspaceDir: taskWorkspace.workspaceDir,
        llmSettings,
        runId: randomUUID(),
        sessionId: randomUUID()
    });
    const startedAt = Date.now();
    const execution = await runWithConfiguredDeadline({
        gateway,
        payload,
        timeoutMs: args.requestTimeoutMs
    });
    const extracted = extractAgentFinalAnswer(execution.response);
    return {
        response: execution.response,
        submittedAnswer: extracted.answer,
        answerSource: extracted.source,
        durationMs: Date.now() - startedAt,
        deadlineTriggered: execution.deadlineTriggered,
        interruptResult: execution.interruptResult,
        runId: payload.runId,
        sessionId: payload.sessionId
    };
}

function shouldRetryTask(result = {}) {
    if (normalizeText(result.submitted_answer)) return false;
    const statusText = [
        result.status,
        result.error,
        result.raw_status?.status,
        result.raw_status?.error
    ].filter(Boolean).join(' ');
    return /runner_error|provider_error|timeout|timed_out|aborted|interrupted|fetch failed|network_error|transient_network_error/i.test(statusText);
}

async function submitAnswers(args, answers) {
    return fetchJson(`${args.scoringApi}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username: args.username,
            agent_code: args.agentCode,
            answers
        })
    }, args.submitTimeoutMs);
}

function redactRuntime(llmSettings = {}) {
    return {
        provider: llmSettings.provider || '',
        baseUrl: llmSettings.baseUrl || '',
        model: llmSettings.model || '',
        authMode: llmSettings.authMode || (llmSettings.apiKey ? 'api_key' : ''),
        reasoningEffort: llmSettings.reasoningEffort || '',
        temperature: llmSettings.temperature,
        timeoutMs: llmSettings.timeoutMs
    };
}

function buildReport({ args, questions, results, score, llmSettings, gatewayStopStatus }) {
    const completed = results.filter((item) => item.ok).length;
    const failed = results.length - completed;
    const scoredLine = score
        ? `- Public scorer: ${score.score}% (${score.correct_count}/${score.total_attempted})`
        : '- Public scorer: not submitted';
    const rows = results.map((item, index) => {
        const status = item.ok ? 'ok' : item.status || 'failed';
        return `${index + 1}. ${item.task_id} | ${status} | ${item.durationMs}ms | ${item.submitted_answer || '(empty)'}`;
    });
    return [
        `# ${args.benchmarkName} Clean AILIS Agent Run`,
        '',
        '- The adapter only transports dataset questions/files and submits the natural final response emitted by AILIS.',
        '- There is no benchmark prompt, exact-answer protocol, answer finalizer, deterministic solver, evidence gate, answer repair, or gold-answer lookup.',
        '- AILIS runs with its production TaskAgent loop; the legacy max-agent-steps option is accepted but not enforced.',
        `- Runtime: ${llmSettings.provider} / ${llmSettings.model} / reasoning=${llmSettings.reasoningEffort || 'default'}`,
        `- Termination: ${args.requestTimeoutMs === 0 ? 'natural Agent termination' : `explicit ${args.requestTimeoutMs}ms deadline with Agent interrupt`}`,
        `- Workspace: ${args.isolatedWorkspace ? 'anonymous isolated workspace per task' : 'configured desktop workspace'}`,
        `- Gateway stop: ${gatewayStopStatus.status}`,
        `- Run id: ${args.runId}`,
        `- Questions: ${questions.length}`,
        `- AILIS answers produced: ${completed}/${results.length}`,
        `- No answer / runtime failure: ${failed}`,
        scoredLine,
        `- Result JSONL: ${args.resultPath}`,
        '',
        '## Answers',
        '',
        ...rows,
        ''
    ].join('\n');
}

async function stopGateway(gateway) {
    let timeoutId = null;
    try {
        return await Promise.race([
            gateway.stop()
                .then(() => ({ ok: true, status: 'stopped' }))
                .catch((error) => ({ ok: false, status: 'stop_error', error: error?.message || String(error) })),
            new Promise((resolve) => {
                timeoutId = setTimeout(() => resolve({ ok: false, status: 'stop_timeout' }), 15000);
            })
        ]);
    } finally {
        if (timeoutId) clearTimeout(timeoutId);
    }
}

async function main() {
    const args = parseArgs();
    await fs.mkdir(args.outputDir, { recursive: true });
    await fs.mkdir(args.filesDir, { recursive: true });
    await fs.mkdir(args.workspaceRoot, { recursive: true });

    const runtimeSettings = loadDesktopStateSettings(args);
    const llmSettings = runtimeSettings.llmSettings;
    validateLlmSettings(llmSettings);
    configureResearchMcpLlmEnvironment(llmSettings);
    const questions = await fetchQuestions(args);
    const gatewayOptions = {
        host: '127.0.0.1',
        port: 0,
        workspaceDir: args.workspaceRoot,
        auditDir: path.join(args.outputDir, 'gateway-audit', args.runId)
    };
    if (runtimeSettings.mcpConfigPath) {
        gatewayOptions.mcpConfigPath = runtimeSettings.mcpConfigPath;
    }
    const gateway = new AILISGateway(gatewayOptions);
    await gateway.start();
    const results = [];
    let gatewayStopStatus = { ok: false, status: 'not_stopped' };

    try {
        for (let index = 0; index < questions.length; index += 1) {
            const question = questions[index];
            const sourceFilePath = await ensureQuestionFile(args, question);
            const taskWorkspace = await prepareTaskWorkspace(args, question, sourceFilePath || '');
            process.stdout.write(`[${index + 1}/${questions.length}] ${question.task_id} ... `);
            const startedAt = Date.now();
            let finalResult = null;
            for (let attempt = 0; attempt <= args.taskRetries; attempt += 1) {
                try {
                    const agentResult = await callAgent({ gateway, args, question, taskWorkspace, llmSettings });
                    const hasAnswer = Boolean(agentResult.submittedAnswer);
                    const answerArtifactPath = hasAnswer
                        ? await writeAnswerArtifact(args, question, agentResult.submittedAnswer)
                        : '';
                    finalResult = {
                        record_type: attempt < args.taskRetries ? 'attempt' : 'final',
                        attempt,
                        index,
                        task_id: question.task_id,
                        question: question.question,
                        file_name: question.file_name || '',
                        answer_artifact_path: answerArtifactPath,
                        durationMs: Date.now() - startedAt,
                        attemptDurationMs: agentResult.durationMs,
                        submitted_answer: agentResult.submittedAnswer,
                        answer_source: agentResult.answerSource,
                        run_id: agentResult.runId,
                        session_id: agentResult.sessionId,
                        configured_deadline_triggered: agentResult.deadlineTriggered,
                        raw_status: {
                            ok: agentResult.response?.ok,
                            status: agentResult.deadlineTriggered
                                ? 'configured_timeout_interrupted'
                                : agentResult.response?.status,
                            error: agentResult.response?.error || '',
                            blockedReason: agentResult.response?.blockedReason || '',
                            interruptStatus: agentResult.interruptResult?.status || ''
                        },
                        ok: hasAnswer && !agentResult.deadlineTriggered && agentResult.response?.ok !== false,
                        status: agentResult.deadlineTriggered
                            ? 'configured_timeout_interrupted'
                            : hasAnswer
                                ? normalizeText(agentResult.response?.status, 'completed')
                                : normalizeText(agentResult.response?.status || agentResult.response?.error, 'missing_agent_final_answer')
                    };
                } catch (error) {
                    finalResult = {
                        record_type: attempt < args.taskRetries ? 'attempt' : 'final',
                        attempt,
                        index,
                        task_id: question.task_id,
                        question: question.question,
                        file_name: question.file_name || '',
                        answer_artifact_path: '',
                        durationMs: Date.now() - startedAt,
                        submitted_answer: '',
                        answer_source: '',
                        ok: false,
                        status: 'runner_error',
                        error: error?.message || String(error),
                        raw_status: {
                            ok: false,
                            status: 'runner_error',
                            error: error?.message || String(error),
                            blockedReason: ''
                        }
                    };
                }
                const retry = shouldRetryTask(finalResult) && attempt < args.taskRetries;
                finalResult.record_type = retry ? 'attempt' : 'final';
                await fs.appendFile(args.resultPath, `${JSON.stringify(finalResult)}\n`, 'utf8');
                if (!retry) break;
                process.stdout.write(`${finalResult.status || 'retry'} -> retry ${attempt + 1}/${args.taskRetries} ... `);
            }
            finalResult.record_type = 'final';
            results.push(finalResult);
            process.stdout.write(`${finalResult.ok ? 'ok' : finalResult.status || 'done'} | ${finalResult.submitted_answer.slice(0, 120) || '(empty)'}\n`);
        }
    } finally {
        gatewayStopStatus = await stopGateway(gateway);
    }

    const answers = results.map((item) => ({
        task_id: item.task_id,
        submitted_answer: item.submitted_answer
    }));
    let score = null;
    let submitError = '';
    if (args.submit) {
        try {
            score = await submitAnswers(args, answers);
        } catch (error) {
            submitError = error?.message || String(error);
        }
    }
    const summary = {
        benchmark: args.benchmarkName,
        protocol: 'clean_ailis_agent_v2',
        runId: args.runId,
        questionCount: questions.length,
        completed: results.filter((item) => item.ok).length,
        failed: results.filter((item) => !item.ok).length,
        submitted: args.submit,
        submitError,
        score,
        runtime: redactRuntime(llmSettings),
        execution: {
            agentRole: args.agentRole,
            directToolExecutor: args.directToolExecutor,
            naturalTermination: args.requestTimeoutMs === 0,
            requestTimeoutMs: args.requestTimeoutMs,
            legacyMaxAgentSteps: args.maxAgentSteps,
            legacyMaxAgentStepsEnforced: false,
            isolatedWorkspace: args.isolatedWorkspace
        },
        gatewayStopStatus,
        resultPath: args.resultPath,
        summaryPath: args.summaryPath,
        reportPath: args.reportPath
    };
    await fs.writeFile(args.summaryPath, `${JSON.stringify(summary, null, 2)}\n`, 'utf8');
    await fs.writeFile(args.reportPath, buildReport({
        args,
        questions,
        results,
        score,
        llmSettings,
        gatewayStopStatus
    }), 'utf8');
    console.log(JSON.stringify(summary, null, 2));
}

const isDirectRun = (() => {
    const entryPath = process.argv[1] ? path.resolve(process.argv[1]) : '';
    return Boolean(entryPath && path.resolve(fileURLToPath(import.meta.url)) === entryPath);
})();

if (isDirectRun) {
    main().catch((error) => {
        console.error(error?.stack || error?.message || String(error));
        process.exitCode = 1;
    });
}

export {
    buildPureAgentPayload,
    callAgent,
    extractAgentFinalAnswer,
    normalizeText,
    parseArgs,
    prepareTaskWorkspace,
    runWithConfiguredDeadline,
    shouldRetryTask
};
