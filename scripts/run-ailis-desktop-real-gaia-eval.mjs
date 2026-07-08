import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { AILISGateway } = require('../electron/ailis-gateway.cjs');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const DEFAULT_GAIA_DIR = path.join(PROJECT_ROOT, 'eval-results', 'engineering', 'gaia-official');
const DEFAULT_OUTPUT_DIR = path.join(PROJECT_ROOT, 'eval-results', 'engineering', 'gaia-desktop-real');
const DEFAULT_SOURCE_JSONL = path.join(DEFAULT_GAIA_DIR, 'ailis-l1-full-current-20260707.jsonl');
const DEFAULT_SOURCE_SUMMARY = path.join(DEFAULT_GAIA_DIR, 'ailis-l1-full-current-20260707.summary.json');

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

function safeFileSegment(value, fallback = 'item') {
    return normalizeText(value, fallback).replace(/[^A-Za-z0-9_.-]+/g, '_').slice(0, 160) || fallback;
}

function timestampId() {
    return new Date().toISOString().replace(/[:.]/g, '-');
}

function parseBoolEnv(value = '') {
    return /^(1|true|yes|on)$/i.test(String(value || ''));
}

function parseArgs(argv = process.argv.slice(2)) {
    const args = {
        sourceJsonl: DEFAULT_SOURCE_JSONL,
        sourceSummary: DEFAULT_SOURCE_SUMMARY,
        outputDir: DEFAULT_OUTPUT_DIR,
        runId: `desktop-real-gaia-l1-${timestampId()}`,
        taskIds: [],
        offset: 0,
        limit: 0,
        maxAgentSteps: 20,
        requestTimeoutMs: 300000,
        llmTimeoutMs: 120000,
        temperature: 0.2,
        startGateway: true,
        gatewayUrl: '',
        workspaceRoot: '',
        isolatedWorkspace: false,
        directToolExecutor: true,
        agentRole: 'persona_orchestrator',
        planOnly: false,
        resume: true,
        costInputPerMillion: Number(process.env.AILIS_EVAL_INPUT_USD_PER_1M || 0),
        costOutputPerMillion: Number(process.env.AILIS_EVAL_OUTPUT_USD_PER_1M || 0)
    };

    for (let index = 0; index < argv.length; index += 1) {
        const token = argv[index];
        const next = () => argv[++index] || '';
        if (token === '--source-jsonl') args.sourceJsonl = path.resolve(next());
        else if (token === '--source-summary') args.sourceSummary = path.resolve(next());
        else if (token === '--output-dir') args.outputDir = path.resolve(next());
        else if (token === '--run-id') args.runId = normalizeText(next(), args.runId);
        else if (token === '--task-ids') args.taskIds = next().split(/[,+\s]+/).map((item) => normalizeText(item)).filter(Boolean);
        else if (token === '--offset') args.offset = Math.max(0, Number(next()) || 0);
        else if (token === '--limit') args.limit = Math.max(0, Number(next()) || 0);
        else if (token === '--max-agent-steps') args.maxAgentSteps = Math.max(1, Math.min(Number(next()) || args.maxAgentSteps, 80));
        else if (token === '--request-timeout-ms') args.requestTimeoutMs = Math.max(30000, Number(next()) || args.requestTimeoutMs);
        else if (token === '--llm-timeout-ms') args.llmTimeoutMs = Math.max(30000, Number(next()) || args.llmTimeoutMs);
        else if (token === '--temperature') args.temperature = Math.min(Math.max(Number(next()) || args.temperature, 0), 2);
        else if (token === '--gateway-url') {
            args.gatewayUrl = normalizeText(next()).replace(/\/+$/, '');
            args.startGateway = false;
        } else if (token === '--start-gateway') args.startGateway = true;
        else if (token === '--no-start-gateway') args.startGateway = false;
        else if (token === '--workspace-root') args.workspaceRoot = path.resolve(next());
        else if (token === '--isolated-workspace') args.isolatedWorkspace = true;
        else if (token === '--desktop-workspace') args.isolatedWorkspace = false;
        else if (token === '--direct-tool-executor') args.directToolExecutor = true;
        else if (token === '--no-direct-tool-executor') args.directToolExecutor = false;
        else if (token === '--agent-role') args.agentRole = normalizeText(next(), args.agentRole);
        else if (token === '--plan-only') args.planOnly = true;
        else if (token === '--resume') args.resume = true;
        else if (token === '--no-resume') args.resume = false;
        else if (token === '--cost-input-per-1m') args.costInputPerMillion = Number(next()) || 0;
        else if (token === '--cost-output-per-1m') args.costOutputPerMillion = Number(next()) || 0;
    }

    args.outputDir = path.resolve(args.outputDir);
    args.resultPath = path.join(args.outputDir, `${args.runId}.jsonl`);
    args.summaryPath = path.join(args.outputDir, `${args.runId}.summary.json`);
    args.reportPath = path.join(args.outputDir, `${args.runId}.report.md`);
    args.progressPath = path.join(args.outputDir, `${args.runId}.progress.jsonl`);
    args.auditDir = path.join(args.outputDir, 'gateway-audit', args.runId);
    args.workspaceRoot = args.isolatedWorkspace
        ? path.join(PROJECT_ROOT, 'tmp', `ailis-desktop-real-gaia-workspace-${safeFileSegment(args.runId)}`)
        : path.resolve(args.workspaceRoot || PROJECT_ROOT);
    args.workspaceMode = args.isolatedWorkspace ? 'isolated_temp_workspace' : 'desktop_project_workspace';
    return args;
}

async function readJson(filePath, fallback = null) {
    try {
        return JSON.parse((await fs.readFile(filePath, 'utf8')).replace(/^\uFEFF/, ''));
    } catch {
        return fallback;
    }
}

async function readJsonl(filePath) {
    const text = (await fs.readFile(filePath, 'utf8')).replace(/^\uFEFF/, '');
    return text
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line, index) => {
            try {
                return JSON.parse(line);
            } catch (error) {
                error.message = `${filePath}:${index + 1}: ${error.message}`;
                throw error;
            }
        });
}

async function appendJsonl(filePath, value) {
    await fs.appendFile(filePath, `${JSON.stringify(value)}\n`, 'utf8');
}

function loadDesktopStateSettings(args) {
    const appData = process.env.APPDATA || path.join(process.env.USERPROFILE || '', 'AppData', 'Roaming');
    const stateCandidates = [
        path.join(appData, 'ailis', 'desktop-state.json'),
        path.join(appData, 'AILIS', 'desktop-state.json')
    ];
    const mcpCandidates = [
        path.join(appData, 'ailis', 'ailis-gateway', 'mcp-servers.json'),
        path.join(appData, 'AILIS', 'ailis-gateway', 'mcp-servers.json'),
        path.join(PROJECT_ROOT, '.ailis-state', 'mcp-servers.json')
    ];
    let preferences = {};
    let statePath = '';
    for (const candidate of stateCandidates) {
        if (!fsSync.existsSync(candidate)) {
            continue;
        }
        try {
            const state = JSON.parse(fsSync.readFileSync(candidate, 'utf8'));
            preferences = state.preferences || state.state?.preferences || {};
            statePath = candidate;
            break;
        } catch {}
    }
    const mcpConfigPath = mcpCandidates.find((candidate) => fsSync.existsSync(candidate)) || '';
    const provider = normalizeText(
        preferences.llmProvider ||
            process.env.AILIS_AGENT_LLM_PROVIDER ||
            process.env.AILIS_LLM_PROVIDER ||
            'openai-compatible'
    );
    const baseUrl = normalizeText(
        preferences.llmBaseUrl ||
            process.env.AILIS_AGENT_LLM_BASE_URL ||
            process.env.AILIS_LLM_BASE_URL ||
            process.env.OPENAI_COMPATIBLE_BASE_URL ||
            ''
    );
    const model = normalizeText(
        preferences.llmModel ||
            process.env.AILIS_AGENT_LLM_MODEL ||
            process.env.AILIS_LLM_MODEL ||
            process.env.OPENAI_COMPATIBLE_MODEL ||
            ''
    );
    const apiKey = normalizeText(
        preferences.llmApiKey ||
            process.env.AILIS_AGENT_LLM_API_KEY ||
            process.env.AILIS_LLM_API_KEY ||
            process.env.OPENAI_COMPATIBLE_API_KEY ||
            ''
    );
    return {
        statePath,
        mcpConfigPath,
        llmSettings: {
            provider,
            baseUrl,
            model,
            apiKey,
            temperature: args.temperature,
            timeoutMs: args.llmTimeoutMs
        }
    };
}

function redactLlmSettings(settings = {}) {
    return {
        provider: settings.provider || '',
        baseUrl: settings.baseUrl || '',
        model: settings.model || '',
        temperature: settings.temperature,
        timeoutMs: settings.timeoutMs,
        apiKey: settings.apiKey ? `__REDACTED_${String(settings.apiKey).length}__` : ''
    };
}

async function loadGoldByTaskId(summaryPath) {
    const summary = await readJson(summaryPath, {});
    const map = new Map();
    for (const item of summary?.score?.per_task || []) {
        const taskId = normalizeText(item.task_id);
        const finalAnswer = normalizeText(item.final_answer);
        if (taskId && finalAnswer) {
            map.set(taskId, finalAnswer);
        }
    }
    return map;
}

function inferSummaryPath(sourceJsonl) {
    const direct = sourceJsonl.replace(/\.jsonl$/i, '.summary.json');
    return fsSync.existsSync(direct) ? direct : DEFAULT_SOURCE_SUMMARY;
}

async function loadTasks(args) {
    if (!fsSync.existsSync(args.sourceJsonl)) {
        throw new Error(`Source GAIA jsonl not found: ${args.sourceJsonl}`);
    }
    if (!fsSync.existsSync(args.sourceSummary)) {
        args.sourceSummary = inferSummaryPath(args.sourceJsonl);
    }
    const goldByTaskId = await loadGoldByTaskId(args.sourceSummary);
    const rows = await readJsonl(args.sourceJsonl);
    const seen = new Set();
    let tasks = rows
        .filter((row) => !row.record_type || row.record_type === 'final')
        .map((row, index) => {
            const taskId = normalizeText(row.task_id || row.taskId || row.id);
            const question = normalizeText(row.question || row.prompt);
            const filePath = normalizeText(row.file_path || row.cached_file_path);
            const fileName = normalizeText(row.file_name || (filePath ? path.basename(filePath) : ''));
            const finalAnswer = normalizeText(row.final_answer || row.expected_answer || goldByTaskId.get(taskId));
            return {
                index: Number.isFinite(Number(row.index)) ? Number(row.index) : index,
                task_id: taskId,
                question,
                file_name: fileName,
                file_path: filePath,
                final_answer: finalAnswer,
                source_record_type: row.record_type || ''
            };
        })
        .filter((task) => {
            if (!task.task_id || !task.question || seen.has(task.task_id)) {
                return false;
            }
            seen.add(task.task_id);
            return true;
        });
    if (args.taskIds.length) {
        const wanted = new Set(args.taskIds);
        tasks = tasks.filter((task) => wanted.has(task.task_id));
    }
    tasks = tasks.slice(args.offset);
    if (args.limit) {
        tasks = tasks.slice(0, args.limit);
    }
    return tasks;
}

function buildFileAttachment(task) {
    const filePath = normalizeText(task.file_path);
    if (!filePath || !path.isAbsolute(filePath) || !fsSync.existsSync(filePath)) {
        return null;
    }
    const stat = fsSync.statSync(filePath);
    const name = normalizeText(task.file_name, path.basename(filePath));
    return {
        type: 'file',
        id: `gaia-file-${task.task_id}`,
        source: 'gaia-local-file',
        label: name,
        name,
        path: filePath,
        extension: path.extname(name).toLowerCase(),
        kind: 'file',
        size: stat.size,
        modifiedAt: stat.mtime.toISOString()
    };
}

function buildDesktopRealEvalTaskText(task, attachments = []) {
    const lines = [task.question];
    const fileLines = attachments
        .filter((attachment) => attachment?.path)
        .map((attachment, index) => (
            `${index + 1}. ${attachment.name || path.basename(attachment.path)} | path=${attachment.path} | kind=${attachment.kind || 'file'} | size=${attachment.size || 0}`
        ));
    if (fileLines.length) {
        lines.push('', 'Attached files available to the task:', ...fileLines);
    }
    return lines.join('\n');
}

function buildDesktopRealPayload({ args, task, llmSettings }) {
    const attachments = [buildFileAttachment(task)].filter(Boolean);
    const desktopRealEvalTaskText = buildDesktopRealEvalTaskText(task, attachments);
    return {
        sessionId: `desktop-real-gaia-${args.runId}-${task.task_id}`,
        message: task.question,
        messageHistory: [],
        attachments,
        agentLoop: 'llm',
        planner: 'llm',
        maxAgentSteps: args.maxAgentSteps,
        maxSteps: args.maxAgentSteps,
        llmSettings,
        directToolExecutor: args.directToolExecutor,
        nativeDirectTools: args.directToolExecutor,
        context: {
            workspace: args.workspaceRoot,
            agentLoop: 'llm',
            planner: 'llm',
            maxAgentSteps: args.maxAgentSteps,
            llmSettings,
            directToolExecutor: args.directToolExecutor,
            nativeDirectTools: args.directToolExecutor,
            agentRole: args.agentRole,
            desktopRealEval: true,
            desktopRealEvalTaskId: task.task_id,
            desktopRealEvalTaskText,
            desktopRealEvalWorkspaceMode: args.workspaceMode,
            approved: true,
            autoConfirm: true,
            approvalPolicy: 'auto',
            confirmationPolicy: 'auto',
            visionPermissionPolicy: 'auto',
            computerControlEnabled: true,
            executeExternal: true,
            allowOutsideWorkspace: true,
            allowComputerWideAccess: true
        }
    };
}

async function fetchJsonWithTimeout(url, options = {}, timeoutMs = 120000) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal,
            headers: {
                'Content-Type': 'application/json',
                ...(options.headers || {})
            }
        });
        const body = await response.json().catch(() => ({}));
        if (!response.ok) {
            return {
                ok: false,
                status: `http_${response.status}`,
                error: body.error || body.message || `HTTP ${response.status}`,
                body
            };
        }
        return body;
    } catch (error) {
        return {
            ok: false,
            status: error?.name === 'AbortError' ? 'timeout' : 'network_error',
            error: error?.name === 'AbortError' ? `request timeout ${timeoutMs}ms` : error?.message || String(error)
        };
    } finally {
        clearTimeout(timeout);
    }
}

async function callAgent({ args, gateway, baseUrl, task, llmSettings }) {
    const payload = buildDesktopRealPayload({ args, task, llmSettings });
    const startedAt = Date.now();
    if (gateway) {
        try {
            const response = await gateway.runAgent(payload);
            return {
                response,
                durationMs: Date.now() - startedAt,
                payloadPreview: {
                    sessionId: payload.sessionId,
                    directToolExecutor: payload.directToolExecutor,
                    agentRole: payload.context.agentRole,
                    attachments: payload.attachments.length
                }
            };
        } catch (error) {
            return {
                response: {
                    ok: false,
                    status: 'gateway_error',
                    error: error?.message || String(error)
                },
                durationMs: Date.now() - startedAt,
                payloadPreview: {
                    sessionId: payload.sessionId,
                    directToolExecutor: payload.directToolExecutor,
                    agentRole: payload.context.agentRole,
                    attachments: payload.attachments.length
                }
            };
        }
    }
    const response = await fetchJsonWithTimeout(`${baseUrl}/agent/run`, {
        method: 'POST',
        body: JSON.stringify(payload)
    }, args.requestTimeoutMs);
    return {
        response,
        durationMs: Date.now() - startedAt,
        payloadPreview: {
            sessionId: payload.sessionId,
            directToolExecutor: payload.directToolExecutor,
            agentRole: payload.context.agentRole,
            attachments: payload.attachments.length
        }
    };
}

function stripControlTags(value = '') {
    return normalizeText(value)
        .replace(/\[(?:expression|action|tts|bubble|style|emotion|gesture)[^\]]*]/gi, '')
        .replace(/<[^>\n]{1,80}>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function normalizeAnswerForScore(value = '') {
    return stripControlTags(value)
        .replace(/^final\s*answer\s*[:：]\s*/i, '')
        .replace(/^answer\s*[:：]\s*/i, '')
        .replace(/^the\s+answer\s+is\s+/i, '')
        .replace(/^答案\s*(?:是|为)?\s*[:：]?\s*/i, '')
        .replace(/^最终答案\s*(?:是|为)?\s*[:：]?\s*/i, '')
        .replace(/^["'“”‘’]+|["'“”‘’]+$/g, '')
        .replace(/[。.!！~～]+$/g, '')
        .replace(/\s+/g, ' ')
        .trim()
        .toLowerCase();
}

function parseNumber(value = '') {
    const normalized = normalizeAnswerForScore(value).replace(/,/g, '');
    if (!/^[+-]?(?:\d+\.?\d*|\.\d+)$/.test(normalized)) {
        return null;
    }
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : null;
}

function splitListAnswer(value = '') {
    const normalized = normalizeAnswerForScore(value);
    if (!normalized || !/[;,，、]/.test(normalized)) {
        return [];
    }
    return normalized
        .split(/[;,，、]/)
        .map((item) => item.trim())
        .filter(Boolean)
        .sort();
}

function answersEquivalent(candidate = '', gold = '') {
    const left = normalizeAnswerForScore(candidate);
    const right = normalizeAnswerForScore(gold);
    if (!left || !right) {
        return false;
    }
    if (left === right) {
        return true;
    }
    const leftNumber = parseNumber(left);
    const rightNumber = parseNumber(right);
    if (leftNumber !== null && rightNumber !== null) {
        return Math.abs(leftNumber - rightNumber) <= Math.max(1e-9, Math.abs(rightNumber) * 1e-9);
    }
    const leftList = splitListAnswer(left);
    const rightList = splitListAnswer(right);
    if (leftList.length >= 2 && rightList.length >= 2 && leftList.length === rightList.length) {
        return leftList.every((item, index) => item === rightList[index]);
    }
    return false;
}

function parseVisibleNumber(value = '') {
    const normalized = normalizeAnswerForScore(value).replace(/,/g, '');
    const match = normalized.match(/[+-]?(?:\d+\.?\d*|\.\d+)/);
    if (!match) {
        return null;
    }
    const parsed = Number(match[0]);
    return Number.isFinite(parsed) ? parsed : null;
}

function isCountQuestion(question = '') {
    const text = normalizeText(question).toLowerCase();
    return /\bhow\s+many\b|\bnumber\s+of\b|\bcount\b|多少|几个|几位|数量/.test(text);
}

function getQuestionNumericScale(question = '') {
    const text = normalizeText(question).toLowerCase();
    if (/\bhow\s+many\s+thousand\b|\bin\s+thousands\b|\bthousand\s+(?:hours?|kilometers?|metres?|meters?|dollars?|people|years?)\b/.test(text)) {
        return 1000;
    }
    if (/\bhow\s+many\s+million\b|\bin\s+millions\b|\bmillion\s+(?:hours?|kilometers?|metres?|meters?|dollars?|people|years?)\b/.test(text)) {
        return 1_000_000;
    }
    if (/\bhow\s+many\s+billion\b|\bin\s+billions\b|\bbillion\s+(?:hours?|kilometers?|metres?|meters?|dollars?|people|years?)\b/.test(text)) {
        return 1_000_000_000;
    }
    return 0;
}

function answersEquivalentForQuestion(candidate = '', gold = '', question = '') {
    if (answersEquivalent(candidate, gold)) {
        return true;
    }
    const goldNumber = parseNumber(gold);
    const candidateNumber = parseVisibleNumber(candidate);
    if (
        isCountQuestion(question) &&
        goldNumber !== null &&
        candidateNumber !== null &&
        Math.abs(candidateNumber - goldNumber) <= Math.max(1e-9, Math.abs(goldNumber) * 1e-9)
    ) {
        return true;
    }
    const scale = getQuestionNumericScale(question);
    if (!scale) {
        return false;
    }
    if (candidateNumber === null || goldNumber === null) {
        return false;
    }
    const expected = goldNumber * scale;
    return Math.abs(candidateNumber - expected) <= Math.max(1e-9, Math.abs(expected) * 1e-9);
}

function isIncompleteStatus(status = '') {
    return /\b(?:subagent_running|running|queued|pending|incomplete|timeout|timed_out)\b/i.test(normalizeText(status));
}

function cleanCandidateLine(value = '') {
    return stripControlTags(value)
        .replace(/^[-*>\s]+/, '')
        .replace(/[`*_]+/g, '')
        .replace(/\s+/g, ' ')
        .trim()
        .replace(/[。.!！]+$/g, '');
}

function isLikelyIdentifierNoise(value = '') {
    const text = cleanCandidateLine(value);
    if (!text) {
        return true;
    }
    if (/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(text)) {
        return true;
    }
    if (/^[a-z0-9]{6,}(?:-[a-z0-9]{4,}){2,}$/i.test(text)) {
        return true;
    }
    return false;
}

function pushAnswerCandidate(candidates, source, rawAnswer, maxLength = 240) {
    const answer = cleanCandidateLine(rawAnswer).slice(0, maxLength);
    if (!answer || isLikelyIdentifierNoise(answer)) {
        return;
    }
    candidates.push({ source, answer });
}

function extractAnswerCandidatesFromVisibleText(text = '') {
    const visible = String(text || '');
    const candidates = [];
    const patterns = [
        /(?:^|\n)\s*(?:final\s+answer|final\s+result|result|answer|the\s+answer|答案|结果|最终答案|最终结果)\s*(?:is|=|:|：|为|是)?\s*([^\n\r]+)/gi,
        /(?:\bfinal\s+answer\b|\bfinal\s+result\b|\bthe\s+answer\b|\banswer\b|答案|最终答案|最终结果)\s*(?:is|=|:|：|为|是)?\s*([^\n\r。.!；;]+)/gi,
        /(?:^|\n)\s*(?:therefore|so)\s*,?\s*(?:the\s+answer\s+is)?\s*([^\n\r]+)/gi
    ];
    for (const pattern of patterns) {
        let match;
        while ((match = pattern.exec(visible)) !== null) {
            pushAnswerCandidate(candidates, 'visible_answer_line', match[1], 240);
        }
    }
    const compact = visible.replace(/\s+/g, ' ');
    const contextualPatterns = [
        /(?:highest|best|top|winner|choose|pick|selected|maximum|maximize|最高|最佳|最优|第一|第\s*1|选择|应选|选)\D{0,60}(?:#|ball|球|球号)?\s*([A-Za-z0-9_.-]{1,40})/gi,
        /(?:#|ball|球|球号)\s*([A-Za-z0-9_.-]{1,40})\D{0,60}(?:highest|best|top|winner|maximum|最高|最佳|最优|第一)/gi,
        /\|\s*(?:1|#?1|rank\s*1|top\s*1|第一)?\s*\|\s*(?:\*\*)?(?:#|ball|球|球号)?\s*([A-Za-z0-9_.-]{1,40})(?:\*\*)?\s*\|/gi
    ];
    for (const pattern of contextualPatterns) {
        let match;
        while ((match = pattern.exec(compact)) !== null) {
            pushAnswerCandidate(candidates, 'visible_contextual_answer', match[1], 120);
        }
    }
    return candidates;
}

function looksLikeStructuredAnswerShape(value = '') {
    const text = cleanCandidateLine(value);
    if (!text) {
        return false;
    }
    if (text.length > 320) {
        return false;
    }
    if (/[|{}<>]|\b```/.test(text)) {
        return false;
    }
    return true;
}

function extractStructuredAnswerCandidates(response = {}) {
    const direct = [
        ['exact_answer_submission', response.exactAnswerSubmission?.answer || response.exact_answer_submission?.answer],
        ['final_answer', response.final_answer],
        ['finalAnswer', response.finalAnswer],
        ['answer', response.answer]
    ];
    return direct
        .map(([source, answer]) => ({ source, answer: cleanCandidateLine(answer || '') }))
        .filter((item) => looksLikeStructuredAnswerShape(item.answer))
        .filter((item) => item.answer);
}

function scoreVisibleAnswer({ response = {}, gold = '', question = '' } = {}) {
    const displayText = normalizeText(response.displayText || response.display_text || response.message || response.speechText || '');
    const candidates = [
        ...extractStructuredAnswerCandidates(response),
        ...extractAnswerCandidatesFromVisibleText(displayText)
    ];
    for (const candidate of candidates) {
        if (answersEquivalentForQuestion(candidate.answer, gold, question)) {
            return {
                ok: true,
                status: 'visible_answer_match',
                source: candidate.source,
                answer: candidate.answer,
                candidates
            };
        }
    }
    const normalizedGold = normalizeAnswerForScore(gold);
    const normalizedVisible = normalizeAnswerForScore(displayText);
    const shortGold = normalizedGold.length <= 3 || parseNumber(normalizedGold) !== null;
    if (normalizedGold && !shortGold && normalizedVisible.includes(normalizedGold)) {
        return {
            ok: true,
            status: 'visible_contains_gold',
            source: 'visible_text_contains_gold',
            answer: gold,
            candidates
        };
    }
    const goldParts = splitListAnswer(gold);
    if (goldParts.length >= 2 && goldParts.every((part) => normalizedVisible.includes(part))) {
        return {
            ok: true,
            status: 'visible_contains_all_list_parts',
            source: 'visible_text_list_parts',
            answer: gold,
            candidates
        };
    }
    return {
        ok: false,
        status: candidates.length ? 'answer_candidate_mismatch' : 'no_visible_answer_candidate',
        source: '',
        answer: candidates[0]?.answer || '',
        candidates,
        needsManualReview: Boolean(normalizedGold && normalizedVisible)
    };
}

function usageNumber(usage = {}, keys = []) {
    for (const key of keys) {
        const value = key.split('.').reduce((acc, part) => acc?.[part], usage);
        const number = Number(value);
        if (Number.isFinite(number)) {
            return number;
        }
    }
    return 0;
}

function summarizeUsage(usage = {}) {
    if (!usage || typeof usage !== 'object') {
        return { promptTokens: 0, completionTokens: 0, totalTokens: 0, reasoningTokens: 0, cachedTokens: 0 };
    }
    const promptTokens = usageNumber(usage, ['promptTokens', 'prompt_tokens', 'input_tokens', 'promptTokenCount']);
    const completionTokens = usageNumber(usage, ['completionTokens', 'completion_tokens', 'output_tokens', 'candidatesTokenCount']);
    const totalTokens = usageNumber(usage, ['totalTokens', 'total_tokens', 'totalTokenCount']) || promptTokens + completionTokens;
    const reasoningTokens = usageNumber(usage, [
        'reasoningTokens',
        'completion_tokens_details.reasoning_tokens',
        'output_tokens_details.reasoning_tokens'
    ]);
    const cachedTokens = usageNumber(usage, [
        'cachedTokens',
        'prompt_tokens_details.cached_tokens',
        'input_tokens_details.cached_tokens'
    ]);
    return { promptTokens, completionTokens, totalTokens, reasoningTokens, cachedTokens };
}

function addUsage(left, right) {
    return {
        promptTokens: (left.promptTokens || 0) + (right.promptTokens || 0),
        completionTokens: (left.completionTokens || 0) + (right.completionTokens || 0),
        totalTokens: (left.totalTokens || 0) + (right.totalTokens || 0),
        reasoningTokens: (left.reasoningTokens || 0) + (right.reasoningTokens || 0),
        cachedTokens: (left.cachedTokens || 0) + (right.cachedTokens || 0)
    };
}

function summarizeEvents(events = []) {
    const typeCounts = {};
    const toolCalls = [];
    const llmCalls = [];
    const tokenUsageEvents = [];
    const completedLlmCalls = [];
    for (const event of events) {
        const type = normalizeText(event.type, '(none)');
        typeCounts[type] = (typeCounts[type] || 0) + 1;
        const payload = event.payload || {};
        if (/tool\.call|mcp\.tool\.call/i.test(type)) {
            toolCalls.push({
                type,
                tool: payload.tool || payload.toolName || payload.name || '',
                ok: payload.ok,
                status: payload.status || '',
                durationMs: Number(payload.durationMs) || 0,
                error: payload.error || ''
            });
        }
        if (/agent\.llm_call\.completed/i.test(type)) {
            const callUsage = summarizeUsage(payload.usage || {});
            const call = {
                type,
                phase: payload.phase || '',
                provider: payload.provider || '',
                model: payload.model || '',
                status: payload.status || '',
                ok: payload.ok,
                durationMs: Number(payload.durationMs) || 0,
                usage: callUsage
            };
            llmCalls.push(call);
            completedLlmCalls.push(call);
        } else if (/agent\.token_usage/i.test(type)) {
            tokenUsageEvents.push(summarizeUsage(payload.usage || {}));
        }
    }
    const usageSource = tokenUsageEvents.length
        ? tokenUsageEvents
        : completedLlmCalls.map((call) => call.usage);
    const usage = usageSource.reduce(
        (acc, item) => addUsage(acc, item),
        { promptTokens: 0, completionTokens: 0, totalTokens: 0, reasoningTokens: 0, cachedTokens: 0 }
    );
    const finishedToolCalls = toolCalls.filter((item) => /finished|result|failure|success/i.test(item.type));
    const toolErrors = toolCalls.filter((item) => item.ok === false || /error|failed|invalid/i.test(`${item.status} ${item.error}`));
    return {
        typeCounts: Object.fromEntries(Object.entries(typeCounts).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))),
        llmCallCount: completedLlmCalls.length,
        toolCallCount: toolCalls.length,
        finishedToolCallCount: finishedToolCalls.length,
        toolErrorCount: toolErrors.length,
        llmDurationMs: completedLlmCalls.reduce((sum, item) => sum + (Number(item.durationMs) || 0), 0),
        toolDurationMs: finishedToolCalls.reduce((sum, item) => sum + (Number(item.durationMs) || 0), 0),
        usage,
        toolCalls: toolCalls.slice(0, 80),
        llmCalls: llmCalls.slice(0, 40)
    };
}

function quantile(values = [], q = 0.5) {
    const sorted = values.filter((value) => Number.isFinite(value)).sort((a, b) => a - b);
    if (!sorted.length) {
        return 0;
    }
    const index = Math.min(sorted.length - 1, Math.max(0, Math.ceil(sorted.length * q) - 1));
    return sorted[index];
}

function formatPercent(numerator, denominator) {
    return denominator ? `${((numerator / denominator) * 100).toFixed(2)}%` : '0.00%';
}

function estimateCostUsd(usage, args) {
    const input = (Number(usage.promptTokens) || 0) * (Number(args.costInputPerMillion) || 0) / 1_000_000;
    const output = (Number(usage.completionTokens) || 0) * (Number(args.costOutputPerMillion) || 0) / 1_000_000;
    return Number((input + output).toFixed(6));
}

async function readExistingCompleted(resultPath) {
    if (!fsSync.existsSync(resultPath)) {
        return new Map();
    }
    const rows = await readJsonl(resultPath).catch(() => []);
    const completed = new Map();
    for (const row of rows) {
        if (row?.record_type === 'final' && row.task_id) {
            completed.set(row.task_id, row);
        }
    }
    return completed;
}

function buildTaskResult({ args, task, response, durationMs, eventSummary, payloadPreview }) {
    const visibleScore = scoreVisibleAnswer({ response, gold: task.final_answer, question: task.question });
    const responseOk = response?.ok === true;
    const status = normalizeText(response?.status, responseOk ? 'completed' : 'unknown');
    const steps = Array.isArray(response?.steps) ? response.steps : [];
    const usage = addUsage(eventSummary.usage, summarizeUsage(response?.usage || {}));
    return {
        record_type: 'final',
        run_id: args.runId,
        task_id: task.task_id,
        index: task.index,
        question: task.question,
        file_name: task.file_name || '',
        file_path: task.file_path || '',
        final_answer: task.final_answer || '',
        submitted_answer: visibleScore.answer || '',
        visible_score: visibleScore,
        ok: responseOk && visibleScore.ok,
        response_ok: responseOk,
        status: visibleScore.ok ? 'visible_correct' : (responseOk ? visibleScore.status : status),
        raw_status: status,
        error: response?.error || response?.blockedReason || '',
        durationMs,
        usage,
        estimatedCostUsd: estimateCostUsd(usage, args),
        planner: response?.planner || '',
        intent: response?.intent || '',
        step_count: steps.length,
        event_summary: eventSummary,
        payload_preview: payloadPreview,
        display_text_preview: stripControlTags(response?.displayText || response?.speechText || response?.message || '').slice(0, 1600),
        speech_text_preview: stripControlTags(response?.speechText || '').slice(0, 600)
    };
}

function aggregateSummary({ args, results, startedAt, finishedAt, runtimeSettings }) {
    const total = results.length;
    const responseOk = results.filter((row) => row.response_ok).length;
    const visibleCorrect = results.filter((row) => row.visible_score?.ok).length;
    const incomplete = results.filter((row) => !row.visible_score?.ok && isIncompleteStatus(row.raw_status || row.status)).length;
    const failed = Math.max(0, total - visibleCorrect - incomplete);
    const manualReview = results.filter((row) => row.visible_score?.needsManualReview && !row.visible_score?.ok).length;
    const durations = results.map((row) => Number(row.durationMs) || 0);
    const usage = results.reduce(
        (acc, row) => addUsage(acc, row.usage || {}),
        { promptTokens: 0, completionTokens: 0, totalTokens: 0, reasoningTokens: 0, cachedTokens: 0 }
    );
    const statusCounts = {};
    const rawStatusCounts = {};
    for (const row of results) {
        statusCounts[row.status || 'unknown'] = (statusCounts[row.status || 'unknown'] || 0) + 1;
        rawStatusCounts[row.raw_status || 'unknown'] = (rawStatusCounts[row.raw_status || 'unknown'] || 0) + 1;
    }
    return {
        runId: args.runId,
        benchmark: 'gaia-desktop-real',
        startedAt,
        finishedAt,
        sourceJsonl: args.sourceJsonl,
        sourceSummary: args.sourceSummary,
        resultPath: args.resultPath,
        summaryPath: args.summaryPath,
        reportPath: args.reportPath,
        auditDir: args.auditDir,
        workspaceRoot: args.workspaceRoot,
        mode: {
            desktopRealPayload: true,
            workspaceMode: args.workspaceMode,
            directToolExecutor: args.directToolExecutor,
            agentRole: args.agentRole,
            answerPolicy: 'visible answer counts when it matches the gold answer; short numeric answers require an answer line or structured answer candidate'
        },
        runtime: {
            desktopStatePath: runtimeSettings.statePath,
            mcpConfigPath: runtimeSettings.mcpConfigPath,
            llm: redactLlmSettings(runtimeSettings.llmSettings)
        },
        totals: {
            total,
            responseOk,
            visibleCorrect,
            failed,
            incomplete,
            notCorrect: total - visibleCorrect,
            manualReview,
            responseOkRate: formatPercent(responseOk, total),
            visibleSuccessRate: formatPercent(visibleCorrect, total)
        },
        statusCounts: Object.fromEntries(Object.entries(statusCounts).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))),
        rawStatusCounts: Object.fromEntries(Object.entries(rawStatusCounts).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))),
        performance: {
            totalDurationMs: durations.reduce((sum, value) => sum + value, 0),
            avgDurationMs: total ? Math.round(durations.reduce((sum, value) => sum + value, 0) / total) : 0,
            p50DurationMs: quantile(durations, 0.5),
            p90DurationMs: quantile(durations, 0.9),
            p95DurationMs: quantile(durations, 0.95),
            maxDurationMs: durations.length ? Math.max(...durations) : 0
        },
        cost: {
            usage,
            inputUsdPer1M: args.costInputPerMillion,
            outputUsdPer1M: args.costOutputPerMillion,
            estimatedCostUsd: estimateCostUsd(usage, args)
        }
    };
}

function markdownTable(headers, rows) {
    return [
        `| ${headers.join(' | ')} |`,
        `| ${headers.map(() => '---').join(' | ')} |`,
        ...rows.map((row) => `| ${row.map((cell) => String(cell ?? '').replace(/\|/g, '\\|')).join(' | ')} |`)
    ].join('\n');
}

function buildMarkdownReport(summary, results) {
    const failures = results
        .filter((row) => !row.visible_score?.ok && !isIncompleteStatus(row.raw_status || row.status))
        .slice(0, 20);
    const incomplete = results
        .filter((row) => !row.visible_score?.ok && isIncompleteStatus(row.raw_status || row.status))
        .slice(0, 20);
    const taskRows = results.map((row) => [
        row.index,
        `\`${row.task_id}\``,
        row.visible_score?.ok ? 'yes' : 'no',
        row.raw_status,
        row.status,
        row.step_count,
        row.durationMs,
        row.usage?.totalTokens || 0,
        row.submitted_answer || '(empty)',
        row.final_answer || '(missing)'
    ]);
    const failureRows = failures.map((row) => [
        row.index,
        `\`${row.task_id}\``,
        row.status,
        row.visible_score?.answer || '(none)',
        row.final_answer || '(missing)',
        row.error || row.display_text_preview.slice(0, 180)
    ]);
    const incompleteRows = incomplete.map((row) => [
        row.index,
        `\`${row.task_id}\``,
        row.status,
        row.visible_score?.answer || '(none)',
        row.final_answer || '(missing)',
        row.error || row.display_text_preview.slice(0, 180)
    ]);
    return [
        `# AILIS Desktop Real GAIA Eval - ${summary.runId}`,
        '',
        '## Scope',
        '',
        '- This runner evaluates the AILIS desktop-style agent path, not the strict GAIA exact-answer submission path.',
        `- Workspace mode: ${summary.mode.workspaceMode}`,
        `- Workspace root: \`${summary.workspaceRoot}\``,
        `- Direct tool executor: ${summary.mode.directToolExecutor}`,
        `- Agent role: ${summary.mode.agentRole}`,
        `- Source: \`${summary.sourceJsonl}\``,
        '',
        '## Headline',
        '',
        markdownTable(
            ['Metric', 'Value'],
            [
                ['Tasks', summary.totals.total],
                ['Visible success', `${summary.totals.visibleCorrect}/${summary.totals.total} (${summary.totals.visibleSuccessRate})`],
                ['Response OK', `${summary.totals.responseOk}/${summary.totals.total} (${summary.totals.responseOkRate})`],
                ['Current true failures', summary.totals.failed],
                ['Incomplete / still running', summary.totals.incomplete],
                ['Manual review candidates', summary.totals.manualReview],
                ['Avg duration ms', summary.performance.avgDurationMs],
                ['P95 duration ms', summary.performance.p95DurationMs],
                ['Total tokens', summary.cost.usage.totalTokens],
                ['Estimated cost USD', summary.cost.estimatedCostUsd]
            ]
        ),
        '',
        '## Status Counts',
        '',
        markdownTable(['Status', 'Count'], Object.entries(summary.statusCounts)),
        '',
        '## Per Task',
        '',
        markdownTable(
            ['Index', 'Task', 'Correct', 'Raw Status', 'Eval Status', 'Steps', 'Ms', 'Tokens', 'Extracted', 'Gold'],
            taskRows
        ),
        '',
        '## Current True Failure / Review Samples',
        '',
        failures.length
            ? markdownTable(['Index', 'Task', 'Status', 'Extracted', 'Gold', 'Preview'], failureRows)
            : 'No current true failed samples.',
        '',
        '## Incomplete / Still Running Samples',
        '',
        incomplete.length
            ? markdownTable(['Index', 'Task', 'Status', 'Extracted', 'Gold', 'Preview'], incompleteRows)
            : 'No incomplete samples.',
        '',
        '## Artifacts',
        '',
        `- Result JSONL: \`${summary.resultPath}\``,
        `- Summary JSON: \`${summary.summaryPath}\``,
        `- Gateway audit: \`${summary.auditDir}\``
    ].join('\n');
}

async function writeSummaryAndReport({ args, results, startedAt, finishedAt, runtimeSettings }) {
    const summary = aggregateSummary({ args, results, startedAt, finishedAt, runtimeSettings });
    await fs.writeFile(args.summaryPath, `${JSON.stringify(summary, null, 2)}\n`, 'utf8');
    await fs.writeFile(args.reportPath, buildMarkdownReport(summary, results), 'utf8');
    return summary;
}

async function startGateway(args, runtimeSettings) {
    if (!args.startGateway) {
        return { gateway: null, baseUrl: args.gatewayUrl };
    }
    const options = {
        port: 0,
        workspaceRoot: args.workspaceRoot,
        projectRoot: PROJECT_ROOT,
        auditDir: args.auditDir
    };
    if (runtimeSettings.mcpConfigPath) {
        options.mcpConfigPath = runtimeSettings.mcpConfigPath;
    }
    const gateway = new AILISGateway(options);
    const status = await gateway.start();
    return { gateway, baseUrl: status.url };
}

async function withTimeout(promise, timeoutMs, timeoutValue) {
    let timer = null;
    try {
        return await Promise.race([
            promise,
            new Promise((resolve) => {
                timer = setTimeout(() => resolve(timeoutValue), timeoutMs);
            })
        ]);
    } finally {
        if (timer) {
            clearTimeout(timer);
        }
    }
}

async function main() {
    const args = parseArgs();
    await fs.mkdir(args.outputDir, { recursive: true });
    await fs.mkdir(args.auditDir, { recursive: true });
    await fs.mkdir(args.workspaceRoot, { recursive: true });

    const tasks = await loadTasks(args);
    const runtimeSettings = loadDesktopStateSettings(args);
    if (!runtimeSettings.llmSettings.baseUrl || !runtimeSettings.llmSettings.model || !runtimeSettings.llmSettings.apiKey) {
        throw new Error('Missing desktop LLM settings. Configure AILIS desktop-state.json or AILIS_AGENT_LLM_* env vars.');
    }
    const plan = {
        runId: args.runId,
        taskCount: tasks.length,
        sourceJsonl: args.sourceJsonl,
        sourceSummary: args.sourceSummary,
        outputDir: args.outputDir,
        resultPath: args.resultPath,
        summaryPath: args.summaryPath,
        reportPath: args.reportPath,
        mode: {
            directToolExecutor: args.directToolExecutor,
            agentRole: args.agentRole,
            startGateway: args.startGateway,
            workspaceMode: args.workspaceMode
        },
        workspaceRoot: args.workspaceRoot,
        runtime: {
            desktopStatePath: runtimeSettings.statePath,
            mcpConfigPath: runtimeSettings.mcpConfigPath,
            llm: redactLlmSettings(runtimeSettings.llmSettings)
        },
        sampleTasks: tasks.slice(0, 5).map((task) => ({
            index: task.index,
            task_id: task.task_id,
            hasGold: Boolean(task.final_answer),
            hasFile: Boolean(task.file_path),
            fileExists: task.file_path ? fsSync.existsSync(task.file_path) : false,
            questionPreview: task.question.slice(0, 120)
        }))
    };
    await fs.writeFile(path.join(args.outputDir, `${args.runId}.plan.json`), `${JSON.stringify(plan, null, 2)}\n`, 'utf8');
    if (args.planOnly) {
        console.log(JSON.stringify(plan, null, 2));
        return;
    }

    const startedAt = new Date().toISOString();
    const existing = args.resume ? await readExistingCompleted(args.resultPath) : new Map();
    const results = [...existing.values()];
    const { gateway, baseUrl } = await startGateway(args, runtimeSettings);
    let gatewayStopStatus = { ok: true, status: 'not_started' };

    try {
        for (const task of tasks) {
            if (existing.has(task.task_id)) {
                process.stdout.write(`[skip] ${task.task_id}\n`);
                continue;
            }
            process.stdout.write(`[${results.length + 1}/${tasks.length}] ${task.task_id} ... `);
            const taskEvents = [];
            const listener = (event) => taskEvents.push(event);
            gateway?.on?.('event', listener);
            await appendJsonl(args.progressPath, {
                ts: new Date().toISOString(),
                type: 'task.started',
                task_id: task.task_id,
                index: task.index
            });
            let agentResult;
            try {
                agentResult = await callAgent({ args, gateway, baseUrl, task, llmSettings: runtimeSettings.llmSettings });
            } finally {
                gateway?.off?.('event', listener);
            }
            const eventSummary = summarizeEvents(taskEvents);
            const result = buildTaskResult({
                args,
                task,
                response: agentResult.response,
                durationMs: agentResult.durationMs,
                eventSummary,
                payloadPreview: agentResult.payloadPreview
            });
            results.push(result);
            await appendJsonl(args.resultPath, result);
            await appendJsonl(args.progressPath, {
                ts: new Date().toISOString(),
                type: 'task.finished',
                task_id: task.task_id,
                ok: result.ok,
                response_ok: result.response_ok,
                status: result.status,
                raw_status: result.raw_status,
                durationMs: result.durationMs,
                totalTokens: result.usage.totalTokens,
                estimatedCostUsd: result.estimatedCostUsd
            });
            await writeSummaryAndReport({
                args,
                results,
                startedAt,
                finishedAt: new Date().toISOString(),
                runtimeSettings
            });
            process.stdout.write(`${result.ok ? 'ok' : result.status} | ${result.submitted_answer || '(empty)'}\n`);
        }
    } finally {
        if (gateway) {
            gatewayStopStatus = await withTimeout(
                gateway.stop()
                    .then(() => ({ ok: true, status: 'stopped' }))
                    .catch((error) => ({
                        ok: false,
                        status: 'stop_error',
                        error: error?.message || String(error)
                    })),
                15000,
                {
                    ok: false,
                    status: 'stop_timeout',
                    error: 'gateway.stop timed out after 15000ms'
                }
            );
            if (!gatewayStopStatus.ok) {
                await appendJsonl(args.progressPath, {
                    ts: new Date().toISOString(),
                    type: 'gateway.stop.warning',
                    ...gatewayStopStatus
                }).catch(() => {});
            }
        }
    }

    const summary = await writeSummaryAndReport({
        args,
        results,
        startedAt,
        finishedAt: new Date().toISOString(),
        runtimeSettings
    });
    console.log(JSON.stringify({
        ok: summary.totals.visibleCorrect === summary.totals.total,
        runId: args.runId,
        total: summary.totals.total,
        visibleCorrect: summary.totals.visibleCorrect,
        visibleSuccessRate: summary.totals.visibleSuccessRate,
        responseOkRate: summary.totals.responseOkRate,
        avgDurationMs: summary.performance.avgDurationMs,
        p95DurationMs: summary.performance.p95DurationMs,
        totalTokens: summary.cost.usage.totalTokens,
        estimatedCostUsd: summary.cost.estimatedCostUsd,
        gatewayStopStatus,
        resultPath: args.resultPath,
        summaryPath: args.summaryPath,
        reportPath: args.reportPath
    }, null, 2));
    if (gatewayStopStatus.status === 'stop_timeout') {
        process.exit(0);
    }
}

export {
    answersEquivalent,
    answersEquivalentForQuestion,
    isIncompleteStatus,
    normalizeAnswerForScore,
    scoreVisibleAnswer,
    summarizeEvents
};

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
    main().catch((error) => {
        console.error(error?.stack || error?.message || String(error));
        process.exitCode = 1;
    });
}
