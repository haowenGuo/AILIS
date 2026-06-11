import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { callDesktopLlmProvider } = require('../electron/desktop-llm-provider.cjs');
const { HumanClawGateway } = require('../electron/humanclaw-gateway.cjs');
const {
    aggregateHumanlikeEvalResults,
    buildHumanlikeJudgeMessages,
    normalizeCandidateResponse,
    normalizeScenario,
    parseJudgeResponse,
    validateScenarioDataset
} = require('../electron/aigl-humanlike-eval.cjs');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const DEFAULT_SCENARIOS_PATH = path.join(PROJECT_ROOT, 'evals', 'aigl-humanlike', 'scenarios.jsonl');
const DEFAULT_OUTPUT_DIR = path.join(PROJECT_ROOT, 'eval-results', 'aigl-humanlike-real');

function normalizeText(value, fallback = '') {
    if (typeof value !== 'string') {
        return fallback;
    }
    const trimmed = value.trim();
    return trimmed || fallback;
}

function parseArgs(argv = process.argv.slice(2)) {
    const args = {
        scenarios: DEFAULT_SCENARIOS_PATH,
        outputDir: DEFAULT_OUTPUT_DIR,
        resultPath: '',
        summaryPath: '',
        reportPath: '',
        gatewayUrl: '',
        startGateway: true,
        runId: new Date().toISOString().replace(/[:.]/g, '-'),
        limit: 0,
        offset: 0,
        concurrency: 2,
        progressEvery: 10,
        judgeRetries: 3,
        maxAgentSteps: 50,
        candidateTimeoutMs: Number(process.env.AIGL_CANDIDATE_LLM_TIMEOUT_MS || 120000),
        judgeTimeoutMs: Number(process.env.AIGL_EVAL_LLM_TIMEOUT_MS || 120000),
        judgeBaseUrl: process.env.AIGL_EVAL_LLM_BASE_URL || process.env.OPENAI_BASE_URL || process.env.LLM_BASE_URL || '',
        judgeModel: process.env.AIGL_EVAL_LLM_MODEL || process.env.OPENAI_MODEL || process.env.LLM_MODEL || '',
        judgeApiKey: process.env.AIGL_EVAL_LLM_API_KEY || process.env.OPENAI_API_KEY || process.env.LLM_API_KEY || '',
        candidateBaseUrl: process.env.AIGL_CANDIDATE_LLM_BASE_URL || '',
        candidateModel: process.env.AIGL_CANDIDATE_LLM_MODEL || '',
        candidateApiKey: process.env.AIGL_CANDIDATE_LLM_API_KEY || ''
    };
    for (let index = 0; index < argv.length; index += 1) {
        const token = argv[index];
        const next = () => argv[++index] || '';
        if (token === '--scenarios') args.scenarios = path.resolve(next());
        else if (token === '--output-dir') args.outputDir = path.resolve(next());
        else if (token === '--result-path') args.resultPath = path.resolve(next());
        else if (token === '--summary-path') args.summaryPath = path.resolve(next());
        else if (token === '--report-path') args.reportPath = path.resolve(next());
        else if (token === '--gateway-url') {
            args.gatewayUrl = normalizeText(next()).replace(/\/+$/, '');
            args.startGateway = false;
        } else if (token === '--start-gateway') args.startGateway = true;
        else if (token === '--no-start-gateway') args.startGateway = false;
        else if (token === '--run-id') args.runId = normalizeText(next(), args.runId);
        else if (token === '--limit') args.limit = Number(next()) || 0;
        else if (token === '--offset') args.offset = Number(next()) || 0;
        else if (token === '--concurrency') args.concurrency = Math.max(1, Math.min(Number(next()) || 1, 8));
        else if (token === '--progress-every') args.progressEvery = Math.max(1, Number(next()) || args.progressEvery);
        else if (token === '--judge-retries') args.judgeRetries = Math.max(1, Math.min(Number(next()) || args.judgeRetries, 6));
        else if (token === '--max-agent-steps') args.maxAgentSteps = Math.max(1, Math.min(Number(next()) || args.maxAgentSteps, 50));
        else if (token === '--judge-base-url') args.judgeBaseUrl = next();
        else if (token === '--judge-model') args.judgeModel = next();
        else if (token === '--judge-api-key') args.judgeApiKey = next();
        else if (token === '--judge-timeout-ms') args.judgeTimeoutMs = Number(next()) || args.judgeTimeoutMs;
        else if (token === '--candidate-base-url') args.candidateBaseUrl = next();
        else if (token === '--candidate-model') args.candidateModel = next();
        else if (token === '--candidate-api-key') args.candidateApiKey = next();
        else if (token === '--candidate-timeout-ms') args.candidateTimeoutMs = Number(next()) || args.candidateTimeoutMs;
    }
    args.resultPath ||= path.join(args.outputDir, `${args.runId}.jsonl`);
    args.summaryPath ||= path.join(args.outputDir, `${args.runId}.summary.json`);
    args.reportPath ||= path.join(args.outputDir, `${args.runId}.report.md`);
    return args;
}

async function readJsonl(filePath) {
    const text = await fs.readFile(filePath, 'utf8');
    return text
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line, index) => {
            try {
                return JSON.parse(line);
            } catch (error) {
                error.message = `${filePath}:${index + 1} ${error.message}`;
                throw error;
            }
        });
}

async function readExistingResults(filePath) {
    if (!fsSync.existsSync(filePath)) {
        return [];
    }
    return await readJsonl(filePath);
}

function selectResumeRows(rows = []) {
    const byScenario = new Map();
    for (const row of rows) {
        const id = normalizeText(row?.scenario?.id || row?.scenario_id);
        if (!id) {
            continue;
        }
        const previous = byScenario.get(id);
        if (row?.judge?.ok) {
            byScenario.set(id, row);
        } else if (!previous) {
            byScenario.set(id, row);
        }
    }
    return [...byScenario.values()].filter((row) => row?.judge?.ok);
}

function normalizeEmailProfiles(rawProfiles = {}) {
    const source = rawProfiles && typeof rawProfiles === 'object' ? rawProfiles : {};
    const providers = ['qq', 'gmail', 'outlook'];
    return Object.fromEntries(
        providers.map((providerId) => {
            const profile = source[providerId] && typeof source[providerId] === 'object'
                ? source[providerId]
                : {};
            return [
                providerId,
                {
                    account: normalizeText(profile.account || profile.email),
                    secret: normalizeText(
                        profile.secret ||
                            profile.password ||
                            profile.appPassword ||
                            profile.authCode ||
                            profile.accessToken
                    ),
                    authType: normalizeText(profile.authType || profile.auth?.type, 'password').toLowerCase() === 'oauth2'
                        ? 'oauth2'
                        : 'password'
                }
            ];
        })
    );
}

function detectGithubCliStatus() {
    const lookup = spawnSync('gh', ['auth', 'status'], {
        encoding: 'utf8',
        windowsHide: true,
        timeout: 5000
    });
    if (lookup.error || lookup.status !== 0) {
        return {
            available: false,
            loggedIn: false,
            account: ''
        };
    }
    const output = `${lookup.stdout || ''}\n${lookup.stderr || ''}`;
    const accountMatch = output.match(/Logged in to github\.com account\s+([^\s]+)/i);
    return {
        available: true,
        loggedIn: true,
        account: normalizeText(accountMatch?.[1])
    };
}

function loadDesktopStateSettings() {
    const statePath = path.join(process.env.APPDATA || '', 'humanclaw', 'desktop-state.json');
    const mcpConfigPath = path.join(process.env.APPDATA || '', 'humanclaw', 'humanclaw-gateway', 'mcp-servers.json');
    const github = detectGithubCliStatus();
    const fallback = {
        baseUrl: '',
        model: '',
        apiKey: '',
        emailProfiles: normalizeEmailProfiles({}),
        mcpConfigPath: fsSync.existsSync(mcpConfigPath) ? mcpConfigPath : '',
        github
    };
    if (!statePath || !fsSync.existsSync(statePath)) {
        return fallback;
    }
    try {
        const state = JSON.parse(fsSync.readFileSync(statePath, 'utf8'));
        const preferences = state.preferences || {};
        return {
            baseUrl: normalizeText(preferences.llmBaseUrl),
            model: normalizeText(preferences.llmModel),
            apiKey: normalizeText(preferences.llmApiKey),
            emailProfiles: normalizeEmailProfiles(preferences.emailProfiles || {}),
            mcpConfigPath: fsSync.existsSync(mcpConfigPath) ? mcpConfigPath : '',
            github
        };
    } catch {
        return fallback;
    }
}

function resolveSettings(args, type) {
    const saved = loadDesktopStateSettings();
    const baseUrl = type === 'candidate' ? args.candidateBaseUrl || args.judgeBaseUrl : args.judgeBaseUrl;
    const model = type === 'candidate' ? args.candidateModel || args.judgeModel : args.judgeModel;
    const apiKey = type === 'candidate' ? args.candidateApiKey || args.judgeApiKey : args.judgeApiKey;
    return {
        provider: 'openai-compatible',
        baseUrl: normalizeText(baseUrl || saved.baseUrl),
        model: normalizeText(model || saved.model),
        apiKey: normalizeText(apiKey || saved.apiKey),
        temperature: type === 'candidate' ? 0.35 : 0.1,
        timeoutMs: type === 'candidate' ? args.candidateTimeoutMs : args.judgeTimeoutMs
    };
}

function buildEvalMemoryContext(scenario) {
    return {
        eval_relationship: {
            affinity_score: scenario.affinity_score,
            relationship_stage: scenario.relationship_stage,
            relationship_expectation: scenario.relationship_expectation
        },
        memory_context: scenario.memory_context || null,
        modalities: scenario.modalities || null,
        instruction: '这些是 AIGL 在真实产品中应拥有的本地记忆、关系状态和多模态偏好。可以用来调整语气和行为，但不要主动向用户暴露内部好感度数值、memory_context 字段名或评估信息。'
    };
}

async function startStandaloneGateway(args) {
    const desktopState = loadDesktopStateSettings();
    const auditDir = path.join(args.outputDir, '.gateway-audit');
    const gatewayOptions = {
        port: 0,
        workspaceRoot: PROJECT_ROOT,
        projectRoot: PROJECT_ROOT,
        auditDir,
        emailProfiles: desktopState.emailProfiles || {}
    };
    if (desktopState.mcpConfigPath) {
        gatewayOptions.mcpConfigPath = desktopState.mcpConfigPath;
    }
    const gateway = new HumanClawGateway(gatewayOptions);
    const status = await gateway.start();
    return { gateway, baseUrl: status.url, status };
}

async function fetchJsonWithTimeout(url, options = {}, timeoutMs = 120000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal,
            headers: {
                'content-type': 'application/json',
                ...(options.headers || {})
            }
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) {
            return {
                ok: false,
                status: `http_${response.status}`,
                error: result.error || result.message || `HTTP ${response.status}`,
                result
            };
        }
        return result;
    } catch (error) {
        return {
            ok: false,
            status: error?.name === 'AbortError' ? 'timeout' : 'network_error',
            error: error?.name === 'AbortError' ? `request timeout ${timeoutMs}ms` : error?.message || String(error)
        };
    } finally {
        clearTimeout(timeoutId);
    }
}

async function generateCandidate({ args, baseUrl, scenario, settings }) {
    const startedAt = Date.now();
    const response = await fetchJsonWithTimeout(`${baseUrl}/agent/run`, {
        method: 'POST',
        body: JSON.stringify({
            sessionId: `humanlike-real-eval-${args.runId}-${scenario.id}`,
            message: scenario.user_message,
            messageHistory: scenario.conversation,
            memoryContext: buildEvalMemoryContext(scenario),
            agentLoop: 'llm',
            planner: 'llm',
            maxAgentSteps: args.maxAgentSteps,
            llmSettings: settings,
            context: {
                agentLoop: 'llm',
                planner: 'llm',
                maxAgentSteps: args.maxAgentSteps,
                llmSettings: settings,
                evalScenarioId: scenario.id,
                evalMemoryContext: buildEvalMemoryContext(scenario)
            }
        })
    }, settings.timeoutMs);
    const visibleText = normalizeText(response.displayText || response.finalAnswer || response.blockedReason);
    if (!response.ok && !visibleText) {
        return {
            candidate: normalizeCandidateResponse({
                text: response.displayText || response.error || 'candidate generation failed',
                trace_summary: JSON.stringify({
                    status: response.status || 'failed',
                    error: response.error || ''
                })
            }),
            ok: false,
            status: response.status || 'candidate_failed',
            error: response.error || 'candidate generation failed',
            durationMs: Date.now() - startedAt
        };
    }
    return {
        candidate: normalizeCandidateResponse({
            text: visibleText,
            speech_text: response.speechText || response.speech_text || '',
            expression: response.expression || '',
            action: response.action || '',
            tts_style: response.ttsStyle || response.tts_style || '',
            bubble_text: response.bubbleText || response.bubble_text || '',
            trace_summary: JSON.stringify({
                status: response.status,
                planner: response.planner,
                intent: response.intent,
                steps: response.steps || []
            })
        }),
        ok: true,
        responseOk: response.ok === true,
        status: response.status || 'completed',
        durationMs: Date.now() - startedAt
    };
}

async function judgeCandidate({ args, scenario, candidate, settings }) {
    const startedAt = Date.now();
    const response = await callDesktopLlmProvider(settings, {
        messages: buildHumanlikeJudgeMessages({ scenario, candidate }),
        temperature: 0.1,
        timeoutMs: args.judgeTimeoutMs
    });
    if (!response.ok) {
        return {
            ok: false,
            status: response.code || 'judge_error',
            error: response.error || 'judge failed',
            durationMs: Date.now() - startedAt
        };
    }
    return {
        ...parseJudgeResponse(response.content),
        model: response.model,
        usage: response.usage || null,
        durationMs: Date.now() - startedAt
    };
}

async function judgeCandidateWithRetry({ args, scenario, candidate, settings }) {
    const attempts = Math.max(1, Number(args.judgeRetries || 3));
    let last = null;
    for (let attempt = 1; attempt <= attempts; attempt += 1) {
        const result = await judgeCandidate({ args, scenario, candidate, settings });
        last = {
            ...result,
            attempt
        };
        if (result.ok) {
            return last;
        }
        if (!['invalid_judge_json', 'timeout', 'network_error', 'provider_error', 'empty_response'].includes(result.status || result.code)) {
            return last;
        }
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
    }
    return last || {
        ok: false,
        status: 'judge_failed',
        error: 'judge failed without result',
        attempt: attempts
    };
}

function table(headers, rows) {
    return [
        `| ${headers.join(' | ')} |`,
        `| ${headers.map(() => '---').join(' | ')} |`,
        ...rows.map((row) => `| ${row.join(' | ')} |`)
    ].join('\n');
}

function formatPercent(value) {
    return `${(Number(value || 0) * 100).toFixed(1)}%`;
}

function buildMarkdownReport({ args, summary, results, startedAt, finishedAt }) {
    const judged = results.filter((entry) => entry.judge?.ok);
    const hardFlags = {};
    for (const entry of judged) {
        for (const [flag, enabled] of Object.entries(entry.judge.hard_fail_flags || {})) {
            if (enabled) hardFlags[flag] = (hardFlags[flag] || 0) + 1;
        }
    }
    const worst = [...judged]
        .sort((left, right) => Number(left.judge.weighted_score || 0) - Number(right.judge.weighted_score || 0))
        .slice(0, 12)
        .map((entry) => [
            `\`${entry.scenario.id}\``,
            entry.scenario.category,
            String(entry.scenario.affinity_score),
            String(entry.judge.weighted_score),
            entry.judge.hard_fail ? 'yes' : 'no',
            (entry.judge.overall_comment || '').replace(/\|/g, '/')
        ]);
    const categoryRows = Object.entries(summary.by_category || {}).map(([category, value]) => [
        `\`${category}\``,
        String(value.count),
        String(value.average_weighted_score),
        formatPercent(value.pass_rate)
    ]);
    const stageRows = Object.entries(summary.by_relationship_stage || {}).map(([stage, value]) => [
        `\`${stage}\``,
        String(value.count),
        String(value.average_weighted_score),
        formatPercent(value.pass_rate)
    ]);
    const metricRows = Object.entries(summary.metric_averages || {}).map(([metric, value]) => [
        `\`${metric}\``,
        String(value)
    ]);
    const flagRows = Object.entries(hardFlags).map(([flag, count]) => [`\`${flag}\``, String(count)]);
    return [
        '# AIGL Humanlike Real Eval Report',
        '',
        `Run ID: \`${args.runId}\``,
        `Started: ${new Date(startedAt).toISOString()}`,
        `Finished: ${new Date(finishedAt).toISOString()}`,
        `Result JSONL: \`${args.resultPath}\``,
        `Summary JSON: \`${args.summaryPath}\``,
        '',
        '## Summary',
        '',
        `- Total: ${summary.total}`,
        `- Judged: ${summary.judged}`,
        `- Missing or failed: ${summary.missing_or_failed}`,
        `- Average weighted score: ${summary.average_weighted_score}`,
        `- Pass rate: ${formatPercent(summary.pass_rate)}`,
        `- Hard fail count: ${summary.hard_fail_count}`,
        '',
        '## Metric Averages',
        '',
        table(['Metric', 'Average 1-5'], metricRows),
        '',
        '## By Category',
        '',
        table(['Category', 'Count', 'Avg Score', 'Pass Rate'], categoryRows),
        '',
        '## By Relationship Stage',
        '',
        table(['Stage', 'Count', 'Avg Score', 'Pass Rate'], stageRows),
        '',
        '## Hard Fail Flags',
        '',
        flagRows.length ? table(['Flag', 'Count'], flagRows) : 'No hard fail flags.',
        '',
        '## Worst Samples',
        '',
        worst.length ? table(['Scenario', 'Category', 'Affinity', 'Score', 'Hard Fail', 'Comment'], worst) : 'No judged samples.',
        '',
        '## Interpretation',
        '',
        '这份报告是真实 Agent 回复经过 LLM-as-judge 打分后的结果，不是数据集覆盖报告。候选回复来自 HumanClaw Gateway 的 Agent Loop，Judge 使用同一套 AIGL 拟人化体验 rubric。分数低的样例应优先查看 candidate、judge.issues、hard_fail_flags 和 better_answer_direction。'
    ].join('\n');
}

async function writeSummaryAndReport({ args, startedAt, results }) {
    const summary = aggregateHumanlikeEvalResults(results);
    const finishedAt = Date.now();
    await fs.mkdir(args.outputDir, { recursive: true });
    await fs.writeFile(args.summaryPath, `${JSON.stringify(summary, null, 2)}\n`, 'utf8');
    await fs.writeFile(args.reportPath, `${buildMarkdownReport({ args, summary, results, startedAt, finishedAt })}\n`, 'utf8');
    return summary;
}

async function appendJsonlSerialized(filePath, row, state) {
    state.writeChain = state.writeChain.then(async () => {
        await fs.appendFile(filePath, `${JSON.stringify(row)}\n`, 'utf8');
    });
    return await state.writeChain;
}

async function main() {
    const args = parseArgs();
    await fs.mkdir(args.outputDir, { recursive: true });
    const allScenarios = (await readJsonl(args.scenarios)).map(normalizeScenario);
    const selected = allScenarios.slice(args.offset, args.limit > 0 ? args.offset + args.limit : undefined);
    const validation = validateScenarioDataset(selected);
    if (!validation.ok) {
        console.error(JSON.stringify(validation, null, 2));
        process.exitCode = 1;
        return;
    }
    const candidateSettings = resolveSettings(args, 'candidate');
    const judgeSettings = resolveSettings(args, 'judge');
    if (!candidateSettings.baseUrl || !candidateSettings.model || !candidateSettings.apiKey || !judgeSettings.baseUrl || !judgeSettings.model || !judgeSettings.apiKey) {
        throw new Error('Missing candidate or judge LLM settings. Configure desktop LLM settings or pass AIGL_* env vars.');
    }

    const rawExisting = await readExistingResults(args.resultPath);
    const existing = selectResumeRows(rawExisting);
    const completed = new Set(existing.map((entry) => entry.scenario?.id || entry.scenario_id));
    const results = [...existing];
    const pending = selected.filter((scenario) => !completed.has(scenario.id));
    let gateway = null;
    let baseUrl = args.gatewayUrl;
    const startedAt = Date.now();

    if (args.startGateway) {
        const started = await startStandaloneGateway(args);
        gateway = started.gateway;
        baseUrl = started.baseUrl;
    }
    if (!baseUrl) {
        throw new Error('No gateway URL available. Pass --gateway-url or use --start-gateway.');
    }

    console.log(JSON.stringify({
        ok: true,
        status: 'started',
        runId: args.runId,
        selected: selected.length,
        existing: existing.length,
        rawExisting: rawExisting.length,
        pending: pending.length,
        concurrency: args.concurrency,
        resultPath: args.resultPath,
        summaryPath: args.summaryPath,
        reportPath: args.reportPath,
        gatewayUrl: baseUrl,
        model: {
            candidate: candidateSettings.model,
            judge: judgeSettings.model
        }
    }, null, 2));

    const state = { writeChain: Promise.resolve(), completedCount: existing.length };
    let nextIndex = 0;
    let completedSinceSummary = 0;

    async function worker(workerId) {
        while (nextIndex < pending.length) {
            const scenario = pending[nextIndex++];
            const scenarioStartedAt = Date.now();
            const candidateResult = await generateCandidate({ args, baseUrl, scenario, settings: candidateSettings });
            const judge = candidateResult.ok
                ? await judgeCandidateWithRetry({ args, scenario, candidate: candidateResult.candidate, settings: judgeSettings })
                : {
                      ok: false,
                      status: candidateResult.status,
                      error: candidateResult.error
                  };
            const row = {
                scenario,
                candidate: candidateResult.candidate,
                candidate_status: candidateResult.status,
                candidate_response_ok: candidateResult.responseOk === true,
                durations: {
                    total_ms: Date.now() - scenarioStartedAt,
                    candidate_ms: candidateResult.durationMs,
                    judge_ms: judge.durationMs || 0
                },
                judge,
                workerId
            };
            results.push(row);
            await appendJsonlSerialized(args.resultPath, row, state);
            state.completedCount += 1;
            completedSinceSummary += 1;
            console.log(`${state.completedCount}/${selected.length} ${scenario.id}: ${judge.ok ? judge.weighted_score : judge.status}`);
            if (completedSinceSummary >= args.progressEvery || state.completedCount === selected.length) {
                completedSinceSummary = 0;
                const summary = await writeSummaryAndReport({ args, startedAt, results });
                console.log(JSON.stringify({
                    status: 'progress',
                    completed: state.completedCount,
                    total: selected.length,
                    average_weighted_score: summary.average_weighted_score,
                    pass_rate: summary.pass_rate,
                    hard_fail_count: summary.hard_fail_count
                }));
            }
        }
    }

    try {
        await Promise.all(Array.from({ length: Math.min(args.concurrency, pending.length || 1) }, (_, index) => worker(index + 1)));
        await state.writeChain;
        const summary = await writeSummaryAndReport({ args, startedAt, results });
        console.log(JSON.stringify({
            ok: true,
            status: 'completed',
            resultPath: args.resultPath,
            summaryPath: args.summaryPath,
            reportPath: args.reportPath,
            summary
        }, null, 2));
    } finally {
        if (gateway) {
            await gateway.stop();
        }
    }
}

main().catch((error) => {
    console.error(error?.stack || error?.message || String(error));
    process.exitCode = 1;
});
