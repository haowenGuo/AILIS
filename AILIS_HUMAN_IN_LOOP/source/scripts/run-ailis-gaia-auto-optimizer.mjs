import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const DEFAULT_JOB_DIR = path.join(PROJECT_ROOT, 'longrun', 'jobs', 'ailis-gaia-auto-optimizer');

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

function stripJsonBom(text = '') {
    return typeof text === 'string' ? text.replace(/^\uFEFF/, '') : '';
}

function isoNow() {
    return new Date().toISOString();
}

function safeSegment(value, fallback = 'item') {
    return normalizeText(value, fallback).replace(/[^A-Za-z0-9_.-]+/g, '_').slice(0, 140) || fallback;
}

function resolveTaskRetries(policy = {}, args = {}) {
    if (args.taskRetries === null || args.taskRetries === undefined) {
        const configured = Number(policy.taskRetries);
        return Math.max(0, Math.min(Number.isFinite(configured) ? Math.round(configured) : 0, 3));
    }
    const override = Number(args.taskRetries);
    if (Number.isFinite(override)) {
        return Math.max(0, Math.min(Math.round(override), 3));
    }
    const configured = Number(policy.taskRetries);
    return Math.max(0, Math.min(Number.isFinite(configured) ? Math.round(configured) : 0, 3));
}

function shouldContinueAfterFailure(policy = {}) {
    if (policy.continueAfterFailure === true) {
        return true;
    }
    return !(Array.isArray(policy.stopWhen) && policy.stopWhen.includes('repair_required'));
}

function shouldContinueAfterVerdict(policy = {}, verdict = {}) {
    if (!shouldContinueAfterFailure(policy)) {
        return false;
    }
    // Environment/provider failures are systemic. Continuing would only turn
    // more tasks into duplicate empty-answer repair backlog entries.
    if (normalizeText(verdict.failureCategory) === 'environment') {
        return false;
    }
    return true;
}

function resolvePolicyNumber(value, fallback, { min = 0, max = Number.MAX_SAFE_INTEGER } = {}) {
    const parsed = Number(value);
    const effective = Number.isFinite(parsed) ? parsed : fallback;
    return Math.max(min, Math.min(effective, max));
}

function resolveSafetyPolicy(policy = {}) {
    const safety = typeof policy.safety === 'object' && policy.safety ? policy.safety : {};
    return {
        enabled: safety.enabled !== false && policy.safetyEnabled !== false,
        maxRepairBacklog: resolvePolicyNumber(safety.maxRepairBacklog ?? policy.maxRepairBacklog, 5, { min: 0, max: 200 }),
        maxConsecutiveFailures: resolvePolicyNumber(safety.maxConsecutiveFailures ?? policy.maxConsecutiveFailures, 3, { min: 0, max: 50 }),
        maxEmptyAnswerStreak: resolvePolicyNumber(safety.maxEmptyAnswerStreak ?? policy.maxEmptyAnswerStreak, 2, { min: 0, max: 50 }),
        maxSameTaskAttempts: resolvePolicyNumber(safety.maxSameTaskAttempts ?? policy.maxSameTaskAttempts, 2, { min: 0, max: 20 }),
        recentWindow: Math.round(resolvePolicyNumber(safety.recentWindow ?? policy.recentWindow, 8, { min: 1, max: 100 })),
        minRecentSample: Math.round(resolvePolicyNumber(safety.minRecentSample ?? policy.minRecentSample, 4, { min: 1, max: 100 })),
        minRecentPassRate: resolvePolicyNumber(safety.minRecentPassRate ?? policy.minRecentPassRate, 0.25, { min: 0, max: 1 }),
        stopOnEnvironmentFailure: safety.stopOnEnvironmentFailure !== false && policy.stopOnEnvironmentFailure !== false
    };
}

function isEmptyAnswerVerdict(verdict = {}) {
    const text = [
        verdict.summary,
        verdict.status,
        verdict.optimizationFocus,
        verdict.nextAction
    ].map((item) => normalizeText(item)).join(' ');
    return verdict.emptyAnswer === true ||
        /\(\s*empty\s*\)|empty answer|no submitted|missing_exact_answer|submitted answer \(\s*\)/i.test(text);
}

function ensureSafetyState(state = {}, policy = {}) {
    const safetyPolicy = resolveSafetyPolicy(policy);
    const existing = typeof state.safety === 'object' && state.safety ? state.safety : {};
    const recentVerdicts = Array.isArray(existing.recentVerdicts) ? existing.recentVerdicts : [];
    const taskAttemptCounts = typeof existing.taskAttemptCounts === 'object' && existing.taskAttemptCounts
        ? existing.taskAttemptCounts
        : {};
    state.safety = {
        consecutiveFailures: Math.max(0, Number(existing.consecutiveFailures) || 0),
        emptyAnswerStreak: Math.max(0, Number(existing.emptyAnswerStreak) || 0),
        taskAttemptCounts,
        recentVerdicts: recentVerdicts.slice(-Math.max(1, safetyPolicy.recentWindow)),
        lastSafetyBlock: existing.lastSafetyBlock || null
    };
    return state.safety;
}

function recordSafetyOutcome(state = {}, { task = {}, verdict = {}, policy = {} } = {}) {
    const safetyPolicy = resolveSafetyPolicy(policy);
    const safety = ensureSafetyState(state, policy);
    const taskId = normalizeText(task.taskId || verdict.taskId, 'unknown-task');
    safety.taskAttemptCounts[taskId] = Math.max(0, Number(safety.taskAttemptCounts[taskId]) || 0) + 1;
    const emptyAnswer = isEmptyAnswerVerdict(verdict);
    safety.consecutiveFailures = verdict.ok ? 0 : safety.consecutiveFailures + 1;
    safety.emptyAnswerStreak = verdict.ok ? 0 : (emptyAnswer ? safety.emptyAnswerStreak + 1 : 0);
    safety.recentVerdicts = [
        ...(Array.isArray(safety.recentVerdicts) ? safety.recentVerdicts : []),
        {
            at: isoNow(),
            taskId,
            ok: verdict.ok === true,
            failureCategory: normalizeText(verdict.failureCategory),
            optimizationFocus: normalizeText(verdict.optimizationFocus),
            emptyAnswer
        }
    ].slice(-Math.max(1, safetyPolicy.recentWindow));
    return safety;
}

function buildSafetyBlock(reason, summary, extra = {}) {
    return {
        block: true,
        reason,
        failureCategory: 'spend_safety',
        summary,
        nextAction: 'stop paid execution, inspect accumulated chain data offline, repair the generalized bottleneck, then resume with a tiny canary batch',
        ...extra
    };
}

function evaluateSafetyGate(policy = {}, state = {}, { verdict = null, task = null } = {}) {
    const safetyPolicy = resolveSafetyPolicy(policy);
    if (!safetyPolicy.enabled) {
        return { block: false, reason: 'disabled' };
    }
    const safety = ensureSafetyState(state, policy);
    const repairBacklogCount = Array.isArray(state.repairBacklog) ? state.repairBacklog.length : 0;
    if (safetyPolicy.maxRepairBacklog > 0 && repairBacklogCount >= safetyPolicy.maxRepairBacklog) {
        return buildSafetyBlock(
            'max_repair_backlog',
            `Repair backlog reached ${repairBacklogCount}, limit ${safetyPolicy.maxRepairBacklog}.`
        );
    }
    if (verdict && safetyPolicy.stopOnEnvironmentFailure && normalizeText(verdict.failureCategory) === 'environment') {
        return buildSafetyBlock(
            'environment_failure',
            `Environment/provider failure is terminal for paid runs: ${normalizeText(verdict.summary, 'provider/environment failure')}`,
            { failureCategory: 'environment' }
        );
    }
    if (safetyPolicy.maxConsecutiveFailures > 0 && safety.consecutiveFailures >= safetyPolicy.maxConsecutiveFailures) {
        return buildSafetyBlock(
            'max_consecutive_failures',
            `Consecutive failures reached ${safety.consecutiveFailures}, limit ${safetyPolicy.maxConsecutiveFailures}.`
        );
    }
    if (safetyPolicy.maxEmptyAnswerStreak > 0 && safety.emptyAnswerStreak >= safetyPolicy.maxEmptyAnswerStreak) {
        return buildSafetyBlock(
            'max_empty_answer_streak',
            `Empty-answer streak reached ${safety.emptyAnswerStreak}, limit ${safetyPolicy.maxEmptyAnswerStreak}.`
        );
    }
    const taskId = normalizeText(task?.taskId || verdict?.taskId);
    const taskAttempts = taskId ? Math.max(0, Number(safety.taskAttemptCounts?.[taskId]) || 0) : 0;
    if (taskId && safetyPolicy.maxSameTaskAttempts > 0 && taskAttempts >= safetyPolicy.maxSameTaskAttempts) {
        return buildSafetyBlock(
            'max_same_task_attempts',
            `Task ${taskId} reached ${taskAttempts} attempts, limit ${safetyPolicy.maxSameTaskAttempts}.`
        );
    }
    const recent = Array.isArray(safety.recentVerdicts) ? safety.recentVerdicts.slice(-safetyPolicy.recentWindow) : [];
    if (recent.length >= safetyPolicy.minRecentSample) {
        const passRate = recent.filter((item) => item.ok === true).length / recent.length;
        if (passRate < safetyPolicy.minRecentPassRate) {
            return buildSafetyBlock(
                'low_recent_pass_rate',
                `Recent pass rate ${passRate.toFixed(2)} over ${recent.length} runs is below ${safetyPolicy.minRecentPassRate}.`
            );
        }
    }
    return { block: false, reason: 'ok' };
}

function parseArgs(argv = process.argv.slice(2)) {
    const args = {
        jobDir: DEFAULT_JOB_DIR,
        source: '',
        dryRun: false,
        loop: false,
        once: false,
        smoke: false,
        clearRepair: false,
        taskId: '',
        maxIterations: 0,
        maxAgentSteps: 0,
        taskRetries: null,
        timeoutMs: 900000,
        datasetDir: ''
    };
    for (let index = 0; index < argv.length; index += 1) {
        const token = argv[index];
        const next = () => argv[++index] || '';
        if (token === '--job-dir') args.jobDir = path.resolve(next());
        else if (token === '--source') args.source = normalizeText(next()).toLowerCase();
        else if (token === '--dry-run') args.dryRun = true;
        else if (token === '--smoke') {
            args.smoke = true;
            args.dryRun = true;
            args.once = true;
        } else if (token === '--loop') args.loop = true;
        else if (token === '--once') args.once = true;
        else if (token === '--clear-repair') args.clearRepair = true;
        else if (token === '--task-id') args.taskId = normalizeText(next());
        else if (token === '--max-iterations') args.maxIterations = Math.max(0, Number(next()) || 0);
        else if (token === '--max-agent-steps') args.maxAgentSteps = Math.max(0, Number(next()) || 0);
        else if (token === '--task-retries') args.taskRetries = Math.max(0, Math.min(Number(next()) || 0, 3));
        else if (token === '--timeout-ms') args.timeoutMs = Math.max(30000, Number(next()) || args.timeoutMs);
        else if (token === '--dataset-dir') args.datasetDir = path.resolve(next());
    }
    return args;
}

async function readJson(filePath, fallback) {
    try {
        return JSON.parse(stripJsonBom(await fs.readFile(filePath, 'utf8')));
    } catch {
        return fallback;
    }
}

async function writeJson(filePath, value) {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

async function appendEvent(jobDir, event) {
    const payload = {
        at: isoNow(),
        jobId: 'ailis-gaia-auto-optimizer',
        ...event
    };
    await fs.mkdir(jobDir, { recursive: true });
    await fs.appendFile(path.join(jobDir, 'event-log.jsonl'), `${JSON.stringify(payload)}\n`, 'utf8');
}

async function updateProgress(jobDir, patch) {
    const progressPath = path.join(jobDir, 'progress.json');
    const previous = await readJson(progressPath, {});
    const lastUpdateAt = isoNow();
    await writeJson(progressPath, {
        jobId: 'ailis-gaia-auto-optimizer',
        ...previous,
        ...patch,
        lastUpdateAt,
        lastUpdateAgeSeconds: 0
    });
}

function buildPracticeTasks() {
    return [
        {
            source: 'practice',
            taskId: 'cffe0e32-c9a6-4c52-9877-78ceb4aaa9fb',
            title: 'Secret Santa DOCX',
            question: [
                'An office held a Secret Santa gift exchange where each of its twelve employees was assigned one other employee in the group to present with a gift.',
                'Each employee filled out a profile including three likes or hobbies.',
                'On the day of the gift exchange, only eleven gifts were given, each one specific to one of the recipient\'s interests.',
                'Based on the information in the attached document, who did not give a gift?',
                '',
                'Please read the attached DOCX completely, extract the people, interests, gifts, and constraints, then reason through the matching.',
                'Return only the name as the final answer.'
            ].join('\n'),
            fileName: 'task1-secret-santa.docx',
            filePath: path.join(PROJECT_ROOT, 'gaia-practice-tasks', 'task1-secret-santa.docx'),
            expectedAnswer: 'Fred',
            capabilityClass: 'document_reading_and_constraint_reasoning'
        },
        {
            source: 'practice',
            taskId: '65afbc8a-89ca-4ad5-8d62-355bb401f61d',
            title: 'Excel Map Path',
            question: [
                'You are given the attached Excel file as a map. You start on the START cell and move toward the END cell.',
                'You are allowed to move two cells per turn, and you may move up, down, left, or right.',
                'You may not move fewer than two cells, and you may not move backward. You must avoid moving onto any blue cells.',
                '',
                'On the eleventh turn, what is the 6-digit hex code, without prefix, of the color of the cell where you land after moving?',
                '',
                'Please inspect the full spreadsheet, including cell colors. Do not rely on a first-rows preview.',
                'Return only the 6-digit hex code as the final answer.'
            ].join('\n'),
            fileName: 'task2-excel-map.xlsx',
            filePath: path.join(PROJECT_ROOT, 'gaia-practice-tasks', 'task2-excel-map.xlsx'),
            expectedAnswer: 'F478A7',
            capabilityClass: 'spreadsheet_grid_color_path_reasoning'
        }
    ];
}

function normalizeAnswer(value = '') {
    return normalizeText(value)
        .replace(/^final\s*answer\s*[:：]\s*/i, '')
        .replace(/^answer\s*[:：]\s*/i, '')
        .replace(/^答案\s*(?:是|为)?\s*[:：]?\s*/i, '')
        .replace(/^["'“”‘’]+|["'“”‘’]+$/g, '')
        .replace(/\s+/g, ' ')
        .trim()
        .toLowerCase();
}

function discoverOfficialDatasetDir(explicitDir = '') {
    const candidates = [
        explicitDir,
        path.join(PROJECT_ROOT, 'build-cache', 'hf-datasets', 'gaia-benchmark-GAIA'),
        'F:\\AIGril\\build-cache\\hf-datasets\\gaia-benchmark-GAIA',
        'F:\\AILIS\\build-cache\\hf-datasets\\gaia-benchmark-GAIA',
        'F:\\AIGril_self_evolution_runtime\\build-cache\\hf-datasets\\gaia-benchmark-GAIA'
    ].filter(Boolean);
    return candidates.find((candidate) => fsSync.existsSync(path.join(candidate, '2023', 'validation'))) || '';
}

function selectNextTask({ state = {}, policy = {}, args = {} } = {}) {
    const source = args.source || policy.taskSource || 'practice_then_official';
    const practiceTasks = buildPracticeTasks();
    if (args.taskId) {
        const practice = practiceTasks.find((task) => task.taskId === args.taskId);
        if (practice) {
            return practice;
        }
        return {
            source: 'official',
            taskId: args.taskId,
            offset: 0,
            title: `Official GAIA task ${args.taskId}`
        };
    }
    if (source === 'practice' || source === 'practice_then_official' || source === 'auto') {
        const cursor = Math.max(0, Number(state.practiceCursor) || 0);
        if (cursor < practiceTasks.length) {
            return practiceTasks[cursor];
        }
        if (source === 'practice') {
            return null;
        }
    }
    if (source === 'official' || source === 'practice_then_official' || source === 'auto') {
        const datasetDir = discoverOfficialDatasetDir(args.datasetDir);
        if (!datasetDir) {
            return {
                source: 'blocked',
                taskId: 'official-dataset-missing',
                title: 'Official GAIA dataset missing',
                failureCategory: 'environment',
                error: 'No local GAIA official dataset directory found.'
            };
        }
        const offset = Math.max(0, Number(state.officialCursor) || 0);
        return {
            source: 'official',
            taskId: `official-validation-l1-offset-${offset}`,
            offset,
            datasetDir,
            title: `Official GAIA validation level 1 offset ${offset}`
        };
    }
    return null;
}

function runProcess(command, args, options = {}) {
    return new Promise((resolve) => {
        const startedAt = Date.now();
        const child = spawn(command, args, {
            cwd: options.cwd || PROJECT_ROOT,
            env: { ...process.env, ...(options.env || {}) },
            stdio: ['ignore', 'pipe', 'pipe'],
            windowsHide: true
        });
        let stdout = '';
        let stderr = '';
        const timeoutMs = Math.max(30000, Number(options.timeoutMs) || 900000);
        const timer = setTimeout(() => {
            try {
                child.kill();
            } catch {}
        }, timeoutMs);
        child.stdout?.on('data', (chunk) => {
            stdout += chunk.toString();
            options.onStdout?.(chunk);
        });
        child.stderr?.on('data', (chunk) => {
            stderr += chunk.toString();
            options.onStderr?.(chunk);
        });
        child.on('error', (error) => {
            clearTimeout(timer);
            resolve({ ok: false, exitCode: 1, stdout, stderr, error: error?.message || String(error), durationMs: Date.now() - startedAt });
        });
        child.on('close', (code) => {
            clearTimeout(timer);
            resolve({ ok: code === 0, exitCode: code ?? 0, stdout, stderr, durationMs: Date.now() - startedAt });
        });
    });
}

async function createPracticeScoringServer(task) {
    const server = http.createServer(async (request, response) => {
        try {
            const url = new URL(request.url || '/', 'http://127.0.0.1');
            if (request.method === 'GET' && url.pathname === '/questions') {
                response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                response.end(JSON.stringify([{
                    task_id: task.taskId,
                    question: task.question,
                    file_name: task.fileName
                }]));
                return;
            }
            if (request.method === 'GET' && url.pathname.startsWith('/files/')) {
                const requested = decodeURIComponent(url.pathname.slice('/files/'.length));
                if (requested !== task.fileName || !fsSync.existsSync(task.filePath)) {
                    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
                    response.end('file not found');
                    return;
                }
                response.writeHead(200, { 'Content-Type': 'application/octet-stream' });
                fsSync.createReadStream(task.filePath).pipe(response);
                return;
            }
            if (request.method === 'POST' && url.pathname === '/submit') {
                const chunks = [];
                for await (const chunk of request) {
                    chunks.push(Buffer.from(chunk));
                }
                const payload = JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
                const answers = Array.isArray(payload.answers) ? payload.answers : [];
                const submitted = normalizeText(answers[0]?.submitted_answer);
                const correct = normalizeAnswer(submitted) === normalizeAnswer(task.expectedAnswer);
                response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                response.end(JSON.stringify({
                    username: payload.username || 'AILIS-local-codex',
                    score: correct ? 100 : 0,
                    correct_count: correct ? 1 : 0,
                    total_attempted: 1,
                    message: `Practice local score: ${correct ? 1 : 0}/1`,
                    per_task: [{
                        task_id: task.taskId,
                        correct,
                        submitted_answer: submitted,
                        final_answer: task.expectedAnswer
                    }]
                }));
                return;
            }
            response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
            response.end('not found');
        } catch (error) {
            response.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
            response.end(error?.stack || error?.message || String(error));
        }
    });
    return new Promise((resolve) => {
        server.listen(0, '127.0.0.1', () => {
            const address = server.address();
            resolve({ server, baseUrl: `http://127.0.0.1:${address.port}` });
        });
    });
}

async function runPracticeTask({ task, iterationDir, runId, policy, args }) {
    const outputDir = path.join(iterationDir, 'eval-results');
    await fs.mkdir(outputDir, { recursive: true });
    const { server, baseUrl } = await createPracticeScoringServer(task);
    try {
        const commandArgs = [
            'scripts/run-gaia-level1-lite.mjs',
            '--output-dir', outputDir,
            '--run-id', runId,
            '--scoring-api', baseUrl,
            '--file-mirror', `${baseUrl}/files`,
            '--submit',
            '--limit', '1',
            '--task-retries', String(resolveTaskRetries(policy, args)),
            '--max-agent-steps', String(args.maxAgentSteps || policy.maxAgentSteps || 20),
            '--request-timeout-ms', '300000',
            '--llm-timeout-ms', '120000',
            '--submit-timeout-ms', '90000',
            '--benchmark-name', 'ailis-gaia-practice-auto-optimizer'
        ];
        if (/^(1|true|yes|on)$/i.test(process.env.AILIS_GAIA_DIRECT_TOOL_EXECUTOR || '')) {
            commandArgs.push('--direct-tool-executor');
        }
        const processResult = await runProcess('node', commandArgs, {
            timeoutMs: args.timeoutMs,
            onStdout: (chunk) => process.stdout.write(chunk),
            onStderr: (chunk) => process.stderr.write(chunk)
        });
        return { outputDir, processResult };
    } finally {
        await new Promise((resolve) => server.close(resolve));
    }
}

async function runOfficialTask({ task, iterationDir, runId, policy, args }) {
    const outputDir = path.join(iterationDir, 'eval-results');
    await fs.mkdir(outputDir, { recursive: true });
    const requestTimeoutMs = Math.max(300000, Number(args.timeoutMs) || Number(policy.requestTimeoutMs) || 600000);
    const llmTimeoutMs = Math.max(120000, Number(policy.llmTimeoutMs) || 120000);
    const submitTimeoutMs = Math.max(90000, Number(policy.submitTimeoutMs) || 90000);
    const commandArgs = [
        'scripts/run-gaia-official.mjs',
        '--split', 'validation',
        '--levels', '1',
        '--output-dir', outputDir,
        '--run-id', runId,
        '--dataset-dir', task.datasetDir || discoverOfficialDatasetDir(args.datasetDir),
        '--skip-download',
        '--limit', '1',
        '--offset', String(Math.max(0, Number(task.offset) || 0)),
        '--max-agent-steps', String(args.maxAgentSteps || policy.maxAgentSteps || 20),
        '--task-retries', String(resolveTaskRetries(policy, args)),
        '--request-timeout-ms', String(requestTimeoutMs),
        '--llm-timeout-ms', String(llmTimeoutMs),
        '--submit-timeout-ms', String(submitTimeoutMs)
    ];
    if (task.taskId && !/^official-validation-l1-offset-/.test(task.taskId)) {
        commandArgs.push('--task-ids', task.taskId);
    }
    const processResult = await runProcess('node', commandArgs, {
        timeoutMs: Math.max(Number(args.timeoutMs) || 0, requestTimeoutMs + llmTimeoutMs + submitTimeoutMs + 60000),
        onStdout: (chunk) => process.stdout.write(chunk),
        onStderr: (chunk) => process.stderr.write(chunk)
    });
    return { outputDir, processResult };
}

async function readJsonIfExists(filePath) {
    if (!filePath || !fsSync.existsSync(filePath)) {
        return null;
    }
    return JSON.parse(stripJsonBom(await fs.readFile(filePath, 'utf8')));
}

async function readJsonlIfExists(filePath) {
    if (!filePath || !fsSync.existsSync(filePath)) {
        return [];
    }
    const lines = stripJsonBom(await fs.readFile(filePath, 'utf8')).split(/\r?\n/).filter(Boolean);
    return lines.map((line) => {
        try {
            return JSON.parse(line);
        } catch {
            return null;
        }
    }).filter(Boolean);
}

function summarizeStep(step = {}, index = 0) {
    const response = step.response || {};
    const result = response.result || {};
    const details = result.structuredContent || result.details || result.structured_content || {};
    const nested = details.result?.structuredContent || details.result?.details || {};
    const mergedDetails = { ...details, ...nested };
    return {
        index,
        tool: step.tool || '',
        title: step.title || '',
        args: step.args || {},
        ok: response.ok === true,
        status: response.status || mergedDetails.status || '',
        error: normalizeText(response.error || mergedDetails.error).slice(0, 500),
        evidenceQuality: normalizeText(mergedDetails.evidenceQuality || mergedDetails.evidence_quality || mergedDetails.observationContract?.evidence_quality),
        reasoningReady: mergedDetails.reasoningReady ?? mergedDetails.reasoning_ready ?? mergedDetails.observationContract?.reasoning_ready,
        preview: normalizeText(
            result.content?.[0]?.text ||
            mergedDetails.evidenceGap ||
            mergedDetails.recoveryHint ||
            ''
        ).replace(/\s+/g, ' ').slice(0, 900)
    };
}

function extractExecutionChain({ task, result = {}, processResult = {}, summary = null } = {}) {
    const steps = Array.isArray(result.steps) ? result.steps.map(summarizeStep) : [];
    const toolCounts = {};
    const perTask = findScorePerTask({ task, result, summary });
    for (const step of steps) {
        const key = step.tool || '(unknown)';
        toolCounts[key] = (toolCounts[key] || 0) + 1;
    }
    return {
        taskId: task.taskId,
        resultTaskId: result.task_id || '',
        source: task.source,
        title: task.title,
        question: normalizeText(task.question || result.question),
        fileName: normalizeText(task.fileName || result.file_name),
        filePath: normalizeText(task.filePath || result.file_path),
        expectedAnswer: task.expectedAnswer || perTask?.final_answer || '',
        submittedAnswer: result.submitted_answer || '',
        answerGate: result.answer_gate || null,
        finalizer: result.finalizer || null,
        ok: result.ok === true,
        status: result.status || '',
        durationMs: result.durationMs || processResult.durationMs || 0,
        stepCount: Number(result.step_count) || steps.length,
        toolCounts,
        steps,
        rawStatus: result.raw_status || null,
        score: summary?.score || null,
        process: {
            ok: processResult.ok === true,
            exitCode: processResult.exitCode,
            durationMs: processResult.durationMs || 0,
            stderrTail: normalizeText(processResult.stderr).slice(-2000)
        }
    };
}

function enrichTaskFromGaiaResult(task = {}, result = {}) {
    const enriched = { ...task };
    const question = normalizeText(result.question);
    const fileName = normalizeText(result.file_name);
    const filePath = normalizeText(result.file_path);
    const resultTaskId = normalizeText(result.task_id);
    if (question && !normalizeText(enriched.question)) {
        enriched.question = question;
    }
    if (fileName && !normalizeText(enriched.fileName)) {
        enriched.fileName = fileName;
    }
    if (filePath && !normalizeText(enriched.filePath)) {
        enriched.filePath = filePath;
    }
    if (resultTaskId && resultTaskId !== normalizeText(enriched.taskId)) {
        enriched.gaiaTaskId = resultTaskId;
    }
    if (result.answer_gate) {
        enriched.lastAnswerGate = result.answer_gate;
    }
    if (result.finalizer) {
        enriched.lastFinalizer = result.finalizer;
    }
    return enriched;
}

function findScorePerTask({ task = {}, result = {}, summary = null } = {}) {
    const perTaskItems = Array.isArray(summary?.score?.per_task) ? summary.score.per_task : [];
    if (!perTaskItems.length) {
        return null;
    }
    const ids = [
        task.taskId,
        task.gaiaTaskId,
        result.task_id,
        result.taskId
    ].map((item) => normalizeText(item)).filter(Boolean);
    const byId = perTaskItems.find((item) => ids.includes(normalizeText(item.task_id)));
    if (byId) {
        return byId;
    }
    const submitted = normalizeAnswer(result.submitted_answer);
    const bySubmittedAnswer = submitted
        ? perTaskItems.filter((item) => normalizeAnswer(item.submitted_answer) === submitted)
        : [];
    if (bySubmittedAnswer.length === 1) {
        return bySubmittedAnswer[0];
    }
    return perTaskItems.length === 1 ? perTaskItems[0] : null;
}

function classifyGaiaResult({ task = {}, result = {}, chain = {}, processResult = {}, summary = null } = {}) {
    const perTask = findScorePerTask({ task, result, summary });
    const expected = task.expectedAnswer || perTask?.final_answer || '';
    const correct = perTask
        ? perTask.correct === true
        : expected
            ? normalizeAnswer(result.submitted_answer) === normalizeAnswer(expected)
            : result.ok === true;
    const stepText = JSON.stringify(chain.steps || []);
    const statusText = `${result.status || ''} ${result.raw_status?.status || ''} ${result.raw_status?.error || ''} ${processResult.stderr || ''} ${stepText}`;
    if (result.ok === true && correct) {
        const highLoop = Number(chain.stepCount) >= 10;
        return {
            ok: true,
            status: highLoop ? 'passed_efficiency_review_needed' : 'passed',
            failureCategory: '',
            optimizationFocus: highLoop ? 'efficiency' : 'none',
            generalizedCapability: task.capabilityClass || 'gaia_task_execution',
            summary: highLoop
                ? `Task passed, but used ${chain.stepCount} steps. Optimize loop efficiency without reducing reliability.`
                : 'Task passed with acceptable local verdict.',
            nextAction: highLoop ? 'analyze redundant steps and reduce loop count' : 'advance to next task',
            emptyAnswer: false
        };
    }
    if (/LLM settings incomplete|desktop-state\.json|api.?key|provider_error|auth|token|overdue|past due|unpaid|quota|billing|balance|欠费|余额不足|额度/i.test(statusText)) {
        return {
            ok: false,
            status: 'failed',
            failureCategory: 'environment',
            optimizationFocus: 'configuration_and_provider_readiness',
            generalizedCapability: 'llm_provider_and_dataset_environment',
            summary: 'Task could not run because local provider, auth, or dataset environment is incomplete.',
            nextAction: 'repair environment detection and readiness reporting before rerunning',
            emptyAnswer: !normalizeText(result.submitted_answer)
        };
    }
    if (perTask && perTask.correct !== true) {
        const submitted = normalizeText(perTask.submitted_answer || result.submitted_answer || '(empty)');
        const finalAnswer = normalizeText(perTask.final_answer || expected || '(unknown)');
        if (/web_fetch|web_search|js_shell|thin_content|HTTP 403|HTTP 404|access_challenge|miyoushe|crawl4ai/i.test(statusText)) {
            return {
                ok: false,
                status: 'failed',
                failureCategory: 'web_retrieval_mcp',
                optimizationFocus: 'web_search_web_fetch_mcp',
                generalizedCapability: 'robust_web_retrieval_and_rendered_extraction',
                summary: `Local GAIA scorer rejected web-derived answer (${submitted}); expected ${finalAnswer}. The failed chain should be repaired at the retrieval/evidence layer before finalization.`,
                nextAction: 'patch generalized web_search/web_fetch evidence selection, source following, or rendered extraction before rerunning',
                emptyAnswer: normalizeAnswer(submitted) === normalizeAnswer('(empty)')
            };
        }
        if (/describe_image|read_document|read_spreadsheet|read_presentation|pdf_extract|pdf_find|transcribe_audio|download_file/i.test(statusText)) {
            return {
                ok: false,
                status: 'failed',
                failureCategory: 'tools_mcp',
                optimizationFocus: /describe_image/i.test(statusText) ? 'vision_artifact_extraction_mcp' : 'artifact_tools_mcp',
                generalizedCapability: /describe_image/i.test(statusText) ? 'robust_image_ocr_and_visual_extraction' : (task.capabilityClass || 'artifact_reading_tools'),
                summary: `Local GAIA scorer rejected tool-derived answer (${submitted}); expected ${finalAnswer}. The failed chain used artifact/MCP tools, so repair extraction/schema/evidence quality before changing the agent.`,
                nextAction: 'patch the relevant MCP/tool contract, extraction quality, or evidence handoff and add a focused regression',
                emptyAnswer: normalizeAnswer(submitted) === normalizeAnswer('(empty)')
            };
        }
        return {
            ok: false,
            status: 'failed',
            failureCategory: 'harness_finalization',
            optimizationFocus: 'exact_answer_finalization',
            generalizedCapability: 'benchmark_final_answer_and_evidence_gate',
            summary: `Local GAIA scorer rejected the submitted answer (${submitted}); expected ${finalAnswer}.`,
            nextAction: 'repair exact-answer reasoning, unit conversion, and scorer verdict handling before advancing',
            emptyAnswer: normalizeAnswer(submitted) === normalizeAnswer('(empty)')
        };
    }
    if (/web_fetch|web_search|js_shell|thin_content|HTTP 403|HTTP 404|access_challenge|miyoushe|crawl4ai/i.test(statusText)) {
        return {
            ok: false,
            status: 'failed',
            failureCategory: 'web_retrieval_mcp',
            optimizationFocus: 'web_search_web_fetch_mcp',
            generalizedCapability: 'robust_web_retrieval_and_rendered_extraction',
            summary: 'Failure chain involves web discovery/fetch quality, blocked pages, JS shell, or source-followup behavior.',
            nextAction: 'patch generalized web_search/web_fetch evidence selection or rendered extraction',
            emptyAnswer: !normalizeText(result.submitted_answer)
        };
    }
    if (/read_document|read_spreadsheet|read_presentation|pdf_extract|pdf_find|transcribe_audio|describe_image|download_file/i.test(statusText)) {
        return {
            ok: false,
            status: 'failed',
            failureCategory: 'tools_mcp',
            optimizationFocus: 'artifact_tools_mcp',
            generalizedCapability: task.capabilityClass || 'artifact_reading_tools',
            summary: 'Failure chain involves artifact-specific tool or MCP behavior.',
            nextAction: 'patch the artifact tool/MCP contract and add a focused regression',
            emptyAnswer: !normalizeText(result.submitted_answer)
        };
    }
    if (/missing_exact_answer|rejected_visible_prose|finalizer|answer_gate|exact answer|no submitted/i.test(statusText) || !normalizeText(result.submitted_answer)) {
        return {
            ok: false,
            status: 'failed',
            failureCategory: 'harness_finalization',
            optimizationFocus: 'exact_answer_finalization',
            generalizedCapability: 'benchmark_final_answer_and_evidence_gate',
            summary: 'The agent did not produce an acceptable exact answer or the answer gate rejected it.',
            nextAction: 'repair exact-answer finalization and evidence digest handling',
            emptyAnswer: !normalizeText(result.submitted_answer)
        };
    }
    if (Number(chain.stepCount) >= 15 || /loop_guard|repeated|same .* tried twice|tool_search/i.test(statusText)) {
        return {
            ok: false,
            status: 'failed',
            failureCategory: 'agent_architecture',
            optimizationFocus: 'agent_stopping_and_tool_choice',
            generalizedCapability: 'agent_loop_control_and_ready_evidence_stopping',
            summary: 'The chain suggests poor stopping behavior, repeated tool calls, or bad tool choice.',
            nextAction: 'patch Agent/Harness only if Tools/MCP evidence is already sufficient',
            emptyAnswer: !normalizeText(result.submitted_answer)
        };
    }
    return {
        ok: false,
        status: 'failed',
        failureCategory: 'model_reasoning',
        optimizationFocus: 'reasoning_from_evidence',
        generalizedCapability: task.capabilityClass || 'gaia_reasoning',
        summary: 'Evidence may have been available, but the final answer was wrong or absent without a clearer tool failure.',
        nextAction: 'inspect chain and decide whether evidence extraction or reasoning prompt needs generalized repair',
        emptyAnswer: !normalizeText(result.submitted_answer)
    };
}

function buildRepairTicket({ task, chain, verdict }) {
    return [
        `# GAIA Repair Ticket: ${task.taskId}`,
        '',
        `- Source: ${task.source}`,
        `- Title: ${task.title}`,
        task.question ? `- Question: ${normalizeText(task.question).slice(0, 1000)}` : null,
        task.fileName ? `- File: ${task.fileName}` : null,
        task.filePath ? `- File path: ${task.filePath}` : null,
        `- Failure category: ${verdict.failureCategory || '(none)'}`,
        `- Optimization focus: ${verdict.optimizationFocus || '(none)'}`,
        `- Generalized capability: ${verdict.generalizedCapability || '(none)'}`,
        `- Submitted answer: ${chain.submittedAnswer || '(empty)'}`,
        `- Expected answer: ${chain.expectedAnswer || '(unknown)'}`,
        `- Step count: ${chain.stepCount}`,
        '',
        '## Diagnosis',
        '',
        verdict.summary || '',
        '',
        '## Required Repair Policy',
        '',
        '- Do not hard-code this task, its answer, or one-off strings.',
        '- Prefer a Tools/MCP fix if the first wrong turn is parser, fetcher, reader, schema, extraction, or source ranking.',
        '- Touch Agent/Harness only when the chain proves stopping, finalization, loop control, or evidence handoff is the generalized bottleneck.',
        '- Add or update a regression test that protects a class of similar tasks.',
        '',
        '## Execution Chain',
        '',
        ...(chain.steps || []).map((step) => [
            `### ${step.index + 1}. ${step.tool || '(unknown tool)'}`,
            '',
            `- ok: ${step.ok}`,
            `- status: ${step.status || '(none)'}`,
            `- evidenceQuality: ${step.evidenceQuality || '(none)'}`,
            `- error: ${step.error || '(none)'}`,
            `- preview: ${step.preview || '(none)'}`,
            ''
        ].join('\n')),
        ''
    ].filter((line) => line !== null).join('\n');
}

async function analyzeRun({ task, iterationDir, runId, outputDir, processResult }) {
    const summaryPath = path.join(outputDir, `${runId}.summary.json`);
    const resultPath = path.join(outputDir, `${runId}.jsonl`);
    const summary = await readJsonIfExists(summaryPath);
    const rows = await readJsonlIfExists(resultPath);
    const result = [...rows].reverse().find((row) => row.record_type === 'final') || rows[rows.length - 1] || {
        ok: false,
        status: processResult.ok ? 'missing_result_jsonl' : 'runner_error',
        error: processResult.error || processResult.stderr || 'result jsonl missing'
    };
    const enrichedTask = enrichTaskFromGaiaResult(task, result);
    const chain = extractExecutionChain({ task: enrichedTask, result, processResult, summary });
    const verdict = classifyGaiaResult({ task: enrichedTask, result, chain, processResult, summary });
    const chainPath = path.join(iterationDir, 'chain.json');
    const verdictPath = path.join(iterationDir, 'verdict.json');
    const repairTicketPath = path.join(iterationDir, 'repair-ticket.md');
    await writeJson(path.join(iterationDir, 'task.json'), enrichedTask);
    await writeJson(chainPath, chain);
    await writeJson(verdictPath, {
        ...verdict,
        taskId: enrichedTask.taskId,
        source: enrichedTask.source,
        gaiaTaskId: enrichedTask.gaiaTaskId || '',
        question: enrichedTask.question || '',
        fileName: enrichedTask.fileName || '',
        filePath: enrichedTask.filePath || '',
        chainPath,
        summaryPath: fsSync.existsSync(summaryPath) ? summaryPath : '',
        resultPath: fsSync.existsSync(resultPath) ? resultPath : ''
    });
    if (!verdict.ok || verdict.optimizationFocus === 'efficiency') {
        await fs.writeFile(repairTicketPath, buildRepairTicket({ task: enrichedTask, chain, verdict }), 'utf8');
    }
    return { chain, verdict, paths: { chainPath, verdictPath, repairTicketPath, summaryPath, resultPath } };
}

async function executeTask({ task, iterationDir, runId, policy, args }) {
    if (args.dryRun) {
        const processResult = { ok: true, exitCode: 0, stdout: '', stderr: '', durationMs: 0 };
        const result = {
            ok: false,
            status: 'dry_run_planned',
            submitted_answer: '',
            step_count: 0,
            steps: []
        };
        const chain = extractExecutionChain({ task, result, processResult, summary: null });
        const verdict = {
            ok: false,
            status: 'planned',
            failureCategory: '',
            optimizationFocus: 'dry_run',
            generalizedCapability: task.capabilityClass || 'gaia_task_execution',
            summary: 'Dry run planned the next task without executing the benchmark.',
            nextAction: 'run without --dry-run to execute this task'
        };
        const chainPath = path.join(iterationDir, 'chain.json');
        const verdictPath = path.join(iterationDir, 'verdict.json');
        await writeJson(chainPath, chain);
        await writeJson(verdictPath, { ...verdict, taskId: task.taskId, source: task.source, chainPath });
        return { chain, verdict, paths: { chainPath, verdictPath } };
    }
    const runResult = task.source === 'practice'
        ? await runPracticeTask({ task, iterationDir, runId, policy, args })
        : await runOfficialTask({ task, iterationDir, runId, policy, args });
    return await analyzeRun({
        task,
        iterationDir,
        runId,
        outputDir: runResult.outputDir,
        processResult: runResult.processResult
    });
}

async function loadStateAndPolicy(jobDir) {
    const policy = await readJson(path.join(jobDir, 'loop-policy.json'), {});
    const state = await readJson(path.join(jobDir, 'state.json'), {
        jobId: 'ailis-gaia-auto-optimizer',
        status: 'created',
        iteration: 0,
        practiceCursor: 0,
        officialCursor: 0,
        completedTaskIds: [],
        failedTaskIds: [],
        repairRequired: false
    });
    return { policy, state };
}

async function saveState(jobDir, state) {
    await writeJson(path.join(jobDir, 'state.json'), {
        ...state,
        updatedAt: isoNow()
    });
}

async function blockForSafetyGate(jobDir, state, gate, { iteration = 0, policy = {} } = {}) {
    ensureSafetyState(state, policy);
    state.status = 'repair_required';
    state.repairRequired = true;
    state.safety.lastSafetyBlock = {
        at: isoNow(),
        reason: gate.reason,
        summary: gate.summary
    };
    await saveState(jobDir, state);
    await updateProgress(jobDir, {
        status: 'repair_required',
        currentAction: `safety gate blocked: ${gate.reason}`,
        activeAgentRuns: 0,
        latestArtifactPath: state.lastVerdictPath || '',
        latestEvidence: gate.summary,
        nextAction: gate.nextAction,
        risk: gate.failureCategory === 'environment' ? 'environment' : `spend_safety:${gate.reason}`
    });
    await appendEvent(jobDir, {
        type: 'JOB_BLOCKED',
        iteration,
        summary: gate.summary,
        failureCategory: gate.failureCategory || 'spend_safety'
    });
}

async function runController(args = parseArgs()) {
    const jobDir = args.jobDir;
    await fs.mkdir(path.join(jobDir, 'iterations'), { recursive: true });
    let { policy, state } = await loadStateAndPolicy(jobDir);
    ensureSafetyState(state, policy);
    if (args.clearRepair) {
        state.repairRequired = false;
        state.status = 'ready_after_repair';
        state.safety.lastSafetyBlock = null;
        await saveState(jobDir, state);
        await appendEvent(jobDir, {
            type: 'REPAIR_CLEARED',
            iteration: state.iteration || 0,
            summary: 'repairRequired cleared by --clear-repair for a validation retry'
        });
    }
    await appendEvent(jobDir, {
        type: 'CONTROLLER_STARTED',
        iteration: state.iteration || 0,
        summary: args.dryRun ? 'controller started in dry-run mode' : 'controller started'
    });
    const maxIterations = args.maxIterations || (args.loop ? Number(policy.maxIterationsPerControllerRun) || 1 : 1);
    for (let count = 0; count < maxIterations; count += 1) {
        if (fsSync.existsSync(path.join(jobDir, 'stop.flag'))) {
            state.status = 'stopped';
            await saveState(jobDir, state);
            await appendEvent(jobDir, { type: 'JOB_STOPPED', iteration: state.iteration || 0, summary: 'stop.flag present' });
            break;
        }
        if (state.repairRequired && !args.dryRun && !shouldContinueAfterFailure(policy)) {
            const previousProgress = await readJson(path.join(jobDir, 'progress.json'), {});
            await updateProgress(jobDir, {
                status: 'repair_required',
                currentAction: 'paused_before_duplicate_retry',
                latestArtifactPath: state.lastVerdictPath || '',
                latestEvidence: previousProgress.latestEvidence || 'previous iteration requires generalized repair',
                nextAction: 'Codex heartbeat/current session should patch the generalized bottleneck, run focused tests, then resume with --clear-repair; do not rerun the same failing task before repair.',
                risk: previousProgress.risk || 'repair_required'
            });
            await appendEvent(jobDir, { type: 'JOB_BLOCKED', iteration: state.iteration || 0, summary: 'repair required before next task', failureCategory: 'blocked' });
            break;
        }
        const preRunSafetyGate = evaluateSafetyGate(policy, state);
        if (!args.dryRun && preRunSafetyGate.block) {
            await blockForSafetyGate(jobDir, state, preRunSafetyGate, { iteration: state.iteration || 0, policy });
            break;
        }
        const task = selectNextTask({ state, policy, args });
        if (!task) {
            state.status = 'completed';
            await saveState(jobDir, state);
            await updateProgress(jobDir, {
                status: 'completed',
                currentAction: 'all configured tasks completed',
                nextAction: 'review report or enable official source',
                risk: 'none'
            });
            await appendEvent(jobDir, { type: 'JOB_COMPLETED', iteration: state.iteration || 0, summary: 'all configured tasks completed' });
            break;
        }
        if (task.source === 'blocked') {
            state.status = 'blocked';
            state.repairRequired = true;
            await saveState(jobDir, state);
            await updateProgress(jobDir, {
                status: 'blocked',
                currentAction: task.title,
                latestEvidence: task.error,
                nextAction: 'configure local GAIA dataset path or run practice source only',
                risk: 'environment'
            });
            await appendEvent(jobDir, { type: 'JOB_BLOCKED', iteration: state.iteration || 0, summary: task.error, failureCategory: task.failureCategory });
            break;
        }
        const iteration = Math.max(0, Number(state.iteration) || 0) + 1;
        const iterName = `iter-${String(iteration).padStart(3, '0')}-${safeSegment(task.taskId)}`;
        const iterationDir = path.join(jobDir, 'iterations', iterName);
        const runId = `${iterName}-${new Date().toISOString().replace(/[:.]/g, '-')}`;
        await fs.mkdir(iterationDir, { recursive: true });
        await writeJson(path.join(iterationDir, 'task.json'), task);
        await appendEvent(jobDir, {
            type: 'ITERATION_STARTED',
            iteration,
            summary: `selected ${task.source} task ${task.taskId}`,
            artifactPaths: [path.join(iterationDir, 'task.json')]
        });
        await updateProgress(jobDir, {
            status: args.dryRun ? 'dry_run' : 'executing_iteration',
            iteration,
            currentAction: `running ${task.source} task ${task.taskId}`,
            activeAgentRuns: args.dryRun ? 0 : 1,
            latestArtifactPath: path.join(iterationDir, 'task.json'),
            latestEvidence: task.title || task.taskId,
            nextAction: 'extract execution chain and classify verdict',
            risk: 'none'
        });
        const { verdict, paths } = await executeTask({ task, iterationDir, runId, policy, args });
        await appendEvent(jobDir, {
            type: 'VERDICT_CREATED',
            iteration,
            summary: verdict.summary,
            artifactPaths: [paths.chainPath, paths.verdictPath].filter(Boolean),
            failureCategory: verdict.failureCategory || null
        });
        state.iteration = iteration;
        state.lastVerdictPath = paths.verdictPath;
        state.status = verdict.ok ? 'running' : (args.dryRun ? 'dry_run' : 'repair_required');
        state.completedTaskIds = Array.isArray(state.completedTaskIds) ? state.completedTaskIds : [];
        state.failedTaskIds = Array.isArray(state.failedTaskIds) ? state.failedTaskIds : [];
        state.repairBacklog = Array.isArray(state.repairBacklog) ? state.repairBacklog : [];
        recordSafetyOutcome(state, { task, verdict, policy });
        const postVerdictSafetyGate = !verdict.ok && !args.dryRun
            ? evaluateSafetyGate(policy, state, { verdict, task })
            : { block: false, reason: 'ok' };
        const canContinueAfterVerdict = !verdict.ok && !postVerdictSafetyGate.block && shouldContinueAfterVerdict(policy, verdict);
        if (verdict.ok) {
            if (!state.completedTaskIds.includes(task.taskId)) {
                state.completedTaskIds.push(task.taskId);
            }
            state.failedTaskIds = state.failedTaskIds.filter((taskId) => taskId !== task.taskId);
            state.repairBacklog = state.repairBacklog.filter((item) => item.taskId !== task.taskId);
            if (task.source === 'practice') state.practiceCursor = Math.max(Number(state.practiceCursor) || 0, buildPracticeTasks().findIndex((item) => item.taskId === task.taskId) + 1);
            if (task.source === 'official') state.officialCursor = Math.max(Number(state.officialCursor) || 0, Number(task.offset) + 1);
            state.repairRequired = false;
        } else if (!args.dryRun) {
            if (!state.failedTaskIds.includes(task.taskId)) {
                state.failedTaskIds.push(task.taskId);
            }
            state.repairBacklog = [
                ...state.repairBacklog.filter((item) => item.taskId !== task.taskId),
                {
                    taskId: task.taskId,
                    source: task.source,
                    offset: task.offset,
                    verdictPath: paths.verdictPath,
                    failureCategory: verdict.failureCategory || '',
                    optimizationFocus: verdict.optimizationFocus || '',
                    summary: verdict.summary,
                    queuedAt: isoNow()
                }
            ].slice(-200);
            if (canContinueAfterVerdict) {
                if (task.source === 'practice') state.practiceCursor = Math.max(Number(state.practiceCursor) || 0, buildPracticeTasks().findIndex((item) => item.taskId === task.taskId) + 1);
                if (task.source === 'official') state.officialCursor = Math.max(Number(state.officialCursor) || 0, Number(task.offset) + 1);
                state.status = 'running_with_repair_backlog';
                state.repairRequired = false;
                await appendEvent(jobDir, {
                    type: 'REPAIR_QUEUED',
                    iteration,
                    summary: `queued repair for ${task.taskId} and continuing to the next task`,
                    artifactPaths: [paths.verdictPath].filter(Boolean),
                    failureCategory: verdict.failureCategory || null
                });
            } else {
                state.repairRequired = true;
                if (postVerdictSafetyGate.block) {
                    state.safety.lastSafetyBlock = {
                        at: isoNow(),
                        reason: postVerdictSafetyGate.reason,
                        summary: postVerdictSafetyGate.summary
                    };
                }
            }
        }
        await saveState(jobDir, state);
        await updateProgress(jobDir, {
            status: state.status,
            iteration,
            currentAction: args.dryRun
                ? 'dry run planned'
                : (verdict.ok
                    ? 'iteration accepted'
                    : (postVerdictSafetyGate.block ? `safety gate blocked: ${postVerdictSafetyGate.reason}` : (canContinueAfterVerdict ? 'repair ticket queued; continuing' : 'repair ticket created'))),
            activeAgentRuns: 0,
            completedSteps: state.completedTaskIds.length,
            failedSteps: state.failedTaskIds.length,
            latestArtifactPath: paths.verdictPath,
            latestEvidence: postVerdictSafetyGate.block ? postVerdictSafetyGate.summary : verdict.summary,
            nextAction: verdict.ok
                ? verdict.nextAction
                : (postVerdictSafetyGate.block ? postVerdictSafetyGate.nextAction : (canContinueAfterVerdict ? 'continue with next task while repair backlog remains open' : verdict.nextAction)),
            risk: verdict.ok
                ? 'none'
                : (postVerdictSafetyGate.block
                    ? (postVerdictSafetyGate.failureCategory === 'environment' ? 'environment' : `spend_safety:${postVerdictSafetyGate.reason}`)
                    : (canContinueAfterVerdict ? `repair_backlog:${verdict.failureCategory || 'unknown'}` : (verdict.failureCategory || 'none')))
        });
        if (!verdict.ok && !args.dryRun && !canContinueAfterVerdict) {
            await appendEvent(jobDir, {
                type: 'JOB_BLOCKED',
                iteration,
                summary: postVerdictSafetyGate.block ? postVerdictSafetyGate.summary : verdict.nextAction,
                artifactPaths: [paths.verdictPath].filter(Boolean),
                failureCategory: postVerdictSafetyGate.block ? (postVerdictSafetyGate.failureCategory || 'spend_safety') : (verdict.failureCategory || 'blocked')
            });
        }
        if (!verdict.ok && !args.dryRun && (policy.stopWhen || []).includes('repair_required') && !canContinueAfterVerdict) {
            break;
        }
    }
    return await readJson(path.join(jobDir, 'progress.json'), {});
}

const isDirectRun = (() => {
    const entryPath = process.argv[1] ? path.resolve(process.argv[1]) : '';
    return Boolean(entryPath && path.resolve(fileURLToPath(import.meta.url)) === entryPath);
})();

if (isDirectRun) {
    runController().then((progress) => {
        console.log(JSON.stringify(progress, null, 2));
    }).catch((error) => {
        console.error(error?.stack || error?.message || String(error));
        process.exitCode = 1;
    });
}

export {
    buildPracticeTasks,
    classifyGaiaResult,
    discoverOfficialDatasetDir,
    enrichTaskFromGaiaResult,
    ensureSafetyState,
    evaluateSafetyGate,
    extractExecutionChain,
    isEmptyAnswerVerdict,
    normalizeAnswer,
    parseArgs,
    recordSafetyOutcome,
    resolveSafetyPolicy,
    resolveTaskRetries,
    runController,
    shouldContinueAfterFailure,
    shouldContinueAfterVerdict,
    selectNextTask
};
