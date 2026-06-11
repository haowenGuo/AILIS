import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { HumanClawGateway } = require('../electron/humanclaw-gateway.cjs');

const PROJECT_ROOT = path.resolve(new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));
const LOG_DIR = path.join(PROJECT_ROOT, 'logs');
const TMP_DIR = path.join(PROJECT_ROOT, 'tmp');
const MCP_CONFIG_PATH = path.join(PROJECT_ROOT, '.humanclaw-state', 'mcp-servers.json');

function timestampId() {
    return new Date().toISOString().replace(/[:.]/g, '-');
}

function readDesktopLlmSettings() {
    const appData = process.env.APPDATA || '';
    const candidates = [
        path.join(appData, 'humanclaw', 'desktop-state.json'),
        path.join(appData, 'AIGril', 'desktop-state.json')
    ];
    for (const filePath of candidates) {
        if (!fsSync.existsSync(filePath)) {
            continue;
        }
        try {
            const state = JSON.parse(fsSync.readFileSync(filePath, 'utf8'));
            const preferences = state.preferences || state.state?.preferences || {};
            if (preferences.llmBaseUrl && preferences.llmModel && preferences.llmApiKey) {
                return {
                    provider: preferences.llmProvider || 'openai-compatible',
                    baseUrl: preferences.llmBaseUrl,
                    apiKey: preferences.llmApiKey,
                    model: preferences.llmModel,
                    temperature: preferences.llmTemperature ?? 0.2,
                    timeoutMs: Math.max(90000, Number(preferences.llmRequestTimeoutMs || 120000))
                };
            }
        } catch {}
    }
    return {
        provider: process.env.HUMANCLAW_AGENT_LLM_PROVIDER || 'openai-compatible',
        baseUrl: process.env.HUMANCLAW_AGENT_LLM_BASE_URL || process.env.AIGRIL_LLM_BASE_URL || '',
        apiKey: process.env.HUMANCLAW_AGENT_LLM_API_KEY || process.env.AIGRIL_LLM_API_KEY || '',
        model: process.env.HUMANCLAW_AGENT_LLM_MODEL || process.env.AIGRIL_LLM_MODEL || '',
        temperature: 0.2,
        timeoutMs: 120000
    };
}

function redactLlmSettings(settings = {}) {
    return {
        provider: settings.provider,
        baseUrl: settings.baseUrl,
        model: settings.model,
        temperature: settings.temperature,
        timeoutMs: settings.timeoutMs,
        apiKey: settings.apiKey ? `__REDACTED_${String(settings.apiKey).length}__` : ''
    };
}

const TASKS = [
    {
        taskId: 'playwright_waiting_comparison',
        output: 'playwright-waiting-comparison.md',
        message: 'AIGL，帮我查 Playwright 官方文档，对比 locator.waitFor、expect(locator).toBeVisible、page.waitForSelector 三种等待方式。输出 playwright-waiting-comparison.md，要求说明推荐用法、timeout 设置、常见误区，每个结论都要说明来自哪个官方页面。'
    },
    {
        taskId: 'transformer_paper_code_card',
        output: 'transformer-paper-code-card.md',
        message: 'AIGL，帮我读论文 https://arxiv.org/abs/1706.03762，并查找它是否有官方或高质量复现代码。输出 transformer-paper-code-card.md，包含论文核心方法、代码仓库结构、我如果要复现最小实验应该看哪些文件。不要编造，必须区分论文证据和代码证据。'
    },
    {
        taskId: 'playwright_repo_map',
        output: 'playwright-repo-map.md',
        message: 'AIGL，帮我分析 microsoft/playwright 这个 GitHub 项目。不要全量读完，先找 README、docs、packages 结构，输出 playwright-repo-map.md。要求说明核心模块、测试入口、贡献指南、如果我要改 locator 相关功能应该从哪里开始。'
    }
];

function summarizeEvents(events = []) {
    const promptBudgets = events
        .filter((event) => event.type === 'agent.prompt_budget')
        .map((event) => ({
            ts: event.ts,
            iteration: event.payload?.iteration,
            approx_input_tokens: event.payload?.approx_input_tokens,
            total_chars: event.payload?.total_chars,
            system_chars: event.payload?.system_chars,
            user_chars: event.payload?.user_chars
        }));
    const tokenUsage = events
        .filter((event) => event.type === 'agent.token_usage')
        .map((event) => ({
            ts: event.ts,
            iteration: event.payload?.iteration,
            usage: event.payload?.usage || null,
            promptBudget: event.payload?.promptBudget || null,
            repaired: event.payload?.repaired === true
        }));
    const toolFinished = events
        .filter((event) => event.type === 'tool.call.finished')
        .map((event) => ({
            ts: event.ts,
            tool: event.payload?.tool,
            status: event.payload?.status,
            ok: event.payload?.ok === true,
            durationMs: Number(event.payload?.durationMs || 0)
        }));
    const llmCalls = events
        .filter((event) => event.type === 'agent.llm_call.completed')
        .map((event) => ({
            ts: event.ts,
            iteration: event.payload?.iteration,
            phase: event.payload?.phase,
            durationMs: Number(event.payload?.durationMs || 0),
            ok: event.payload?.ok === true,
            status: event.payload?.status || '',
            model: event.payload?.model || '',
            provider: event.payload?.provider || '',
            usage: event.payload?.usage || null,
            repaired: event.payload?.repaired === true,
            repairAttempted: event.payload?.repairAttempted === true
        }));
    const waits = promptBudgets.map((budget) => {
        const done = tokenUsage.find((entry) => entry.iteration === budget.iteration && entry.ts >= budget.ts);
        return {
            iteration: budget.iteration,
            waitMs: done ? done.ts - budget.ts : null,
            approx_input_tokens: budget.approx_input_tokens
        };
    });
    const tokenValues = promptBudgets
        .map((entry) => Number(entry.approx_input_tokens))
        .filter((value) => Number.isFinite(value));
    const toolMs = toolFinished.reduce((sum, entry) => sum + (Number(entry.durationMs) || 0), 0);
    const llmCallMs = llmCalls.reduce((sum, entry) => sum + (Number(entry.durationMs) || 0), 0);
    const modelWaitMs = waits.reduce((sum, entry) => sum + (Number(entry.waitMs) || 0), 0);
    return {
        promptBudgetCount: promptBudgets.length,
        firstApproxInputTokens: tokenValues[0] || null,
        maxApproxInputTokens: tokenValues.length ? Math.max(...tokenValues) : null,
        avgApproxInputTokens: tokenValues.length
            ? Math.round(tokenValues.reduce((sum, value) => sum + value, 0) / tokenValues.length)
            : null,
        lastApproxInputTokens: tokenValues.length ? tokenValues[tokenValues.length - 1] : null,
        modelWaitMs,
        llmCallMs,
        toolMs,
        promptBudgets,
        tokenUsage,
        decisionWaits: waits,
        llmCalls,
        toolFinished
    };
}

async function appendJsonl(filePath, value) {
    await fs.appendFile(filePath, `${JSON.stringify(value)}\n`, 'utf8');
}

async function readPreviousBaseline() {
    const filePath = path.join(LOG_DIR, 'aigl-speed-bench-2026-06-06T11-35-00-090Z.json');
    try {
        const report = JSON.parse(await fs.readFile(filePath, 'utf8'));
        return {
            path: filePath,
            tasks: (report.tasks || []).map((task) => ({
                taskId: task.taskId,
                ok: task.ok,
                status: task.status,
                requestDurationMs: task.requestDurationMs,
                stepsCount: task.stepsCount,
                transcriptTypeCounts: task.transcript?.typeCounts || {}
            }))
        };
    } catch {
        return null;
    }
}

async function main() {
    const runId = timestampId();
    const workspaceRoot = path.join(TMP_DIR, `aigl-speed-bench-workspace-${runId}`);
    const auditDir = path.join(LOG_DIR, `aigl-speed-bench-audit-${runId}`);
    const reportPath = path.join(LOG_DIR, `aigl-speed-bench-${runId}.json`);
    const progressPath = path.join(LOG_DIR, `aigl-speed-bench-${runId}.progress.jsonl`);
    await fs.mkdir(workspaceRoot, { recursive: true });
    await fs.mkdir(auditDir, { recursive: true });
    await fs.mkdir(LOG_DIR, { recursive: true });

    const llmSettings = readDesktopLlmSettings();
    if (!llmSettings.baseUrl || !llmSettings.model || !llmSettings.apiKey) {
        throw new Error('Missing LLM settings. Configure desktop-state.json or HUMANCLAW_AGENT_LLM_* env vars.');
    }

    const gateway = new HumanClawGateway({
        port: 0,
        workspaceRoot,
        projectRoot: PROJECT_ROOT,
        auditDir,
        mcpConfigPath: MCP_CONFIG_PATH
    });

    const report = {
        runId,
        startedAt: new Date().toISOString(),
        workspaceRoot,
        auditDir,
        progressPath,
        reportPath,
        llm: redactLlmSettings(llmSettings),
        previousBaseline: await readPreviousBaseline(),
        tasks: []
    };

    const allEvents = [];
    gateway.on('event', (event) => {
        allEvents.push(event);
    });

    try {
        await gateway.start();
        for (const task of TASKS) {
            const taskRunId = `${runId}-${task.taskId}`;
            const taskEvents = [];
            const listener = (event) => {
                taskEvents.push(event);
            };
            gateway.on('event', listener);
            const started = Date.now();
            await appendJsonl(progressPath, {
                ts: new Date().toISOString(),
                type: 'task.started',
                taskId: task.taskId
            });
            let body = null;
            let error = '';
            try {
                body = await gateway.runAgent({
                    sessionId: `speed-bench-${runId}-${task.taskId}`,
                    runId: taskRunId,
                    message: task.message,
                    agentLoop: 'llm',
                    planner: 'llm',
                    maxAgentSteps: 20,
                    context: {
                        workspace: workspaceRoot,
                        approved: true,
                        autoConfirm: true,
                        confirmationPolicy: 'auto',
                        computerControlEnabled: true,
                        maxAgentSteps: 20,
                        timeoutMs: 120000,
                        llmSettings
                    }
                });
            } catch (runError) {
                error = runError?.message || String(runError);
            } finally {
                gateway.off('event', listener);
            }
            const durationMs = Date.now() - started;
            const outputPath = path.join(workspaceRoot, task.output);
            const outputExists = fsSync.existsSync(outputPath);
            const outputBytes = outputExists ? fsSync.statSync(outputPath).size : 0;
            const eventSummary = summarizeEvents(taskEvents);
            const entry = {
                taskId: task.taskId,
                output: task.output,
                outputPath,
                outputExists,
                outputBytes,
                durationMs,
                ok: body?.ok === true,
                status: body?.status || (error ? 'error' : ''),
                error,
                stepsCount: Array.isArray(body?.steps) ? body.steps.length : 0,
                displayTextPreview: String(body?.displayText || '').slice(0, 600),
                eventSummary
            };
            report.tasks.push(entry);
            await fs.writeFile(reportPath, JSON.stringify(report, null, 2), 'utf8');
            await appendJsonl(progressPath, {
                ts: new Date().toISOString(),
                type: 'task.finished',
                taskId: task.taskId,
                ok: entry.ok,
                status: entry.status,
                durationMs,
                promptBudgetCount: eventSummary.promptBudgetCount,
                firstApproxInputTokens: eventSummary.firstApproxInputTokens,
                maxApproxInputTokens: eventSummary.maxApproxInputTokens,
                avgApproxInputTokens: eventSummary.avgApproxInputTokens,
                modelWaitMs: eventSummary.modelWaitMs,
                toolMs: eventSummary.toolMs
            });
        }
    } finally {
        await gateway.stop().catch(() => {});
    }

    report.completedAt = new Date().toISOString();
    report.ok = report.tasks.every((task) => task.ok);
    report.eventTypeCounts = allEvents.reduce((acc, event) => {
        acc[event.type] = (acc[event.type] || 0) + 1;
        return acc;
    }, {});
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2), 'utf8');
    console.log(JSON.stringify({
        ok: report.ok,
        reportPath,
        progressPath,
        tasks: report.tasks.map((task) => ({
            taskId: task.taskId,
            ok: task.ok,
            status: task.status,
            durationMs: task.durationMs,
            promptBudgetCount: task.eventSummary.promptBudgetCount,
            firstApproxInputTokens: task.eventSummary.firstApproxInputTokens,
            maxApproxInputTokens: task.eventSummary.maxApproxInputTokens,
            avgApproxInputTokens: task.eventSummary.avgApproxInputTokens,
            modelWaitMs: task.eventSummary.modelWaitMs,
            toolMs: task.eventSummary.toolMs
        }))
    }, null, 2));
}

main().catch((error) => {
    console.error(error?.stack || error?.message || String(error));
    process.exitCode = 1;
});
