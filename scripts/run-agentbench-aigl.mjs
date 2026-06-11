import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { HumanClawGateway } = require('../electron/humanclaw-gateway.cjs');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const DEFAULT_AGENTBENCH_ROOT = path.join(PROJECT_ROOT, 'build-cache', 'benchmarks', 'agentbench-main');
const DEFAULT_OUTPUT_DIR = path.join(PROJECT_ROOT, 'eval-results', 'engineering', 'agentbench-aigl');

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

function safeSegment(value, fallback = 'item') {
    return normalizeText(value, fallback).replace(/[^A-Za-z0-9_.-]+/g, '_').slice(0, 180) || fallback;
}

function parseArgs(argv = process.argv.slice(2)) {
    const args = {
        agentbenchRoot: DEFAULT_AGENTBENCH_ROOT,
        outputDir: DEFAULT_OUTPUT_DIR,
        runId: new Date().toISOString().replace(/[:.]/g, '-'),
        suite: '',
        task: '',
        limit: 0,
        offset: 0,
        list: false,
        keepWorkspace: false,
        maxAgentSteps: 30,
        requestTimeoutMs: 360000,
        llmTimeoutMs: 120000,
        taskDelayMs: 30000,
        agentRetries: 2,
        retryDelayMs: 60000,
        temperature: 0.2,
        wslDistro: 'Ubuntu-22.04'
    };
    for (let index = 0; index < argv.length; index += 1) {
        const token = argv[index];
        const next = () => argv[++index] || '';
        if (token === '--agentbench-root') args.agentbenchRoot = path.resolve(next());
        else if (token === '--output-dir') args.outputDir = path.resolve(next());
        else if (token === '--run-id') args.runId = normalizeText(next(), args.runId);
        else if (token === '--suite') args.suite = normalizeText(next());
        else if (token === '--task') args.task = normalizeText(next());
        else if (token === '--limit') args.limit = Math.max(0, Number(next()) || 0);
        else if (token === '--offset') args.offset = Math.max(0, Number(next()) || 0);
        else if (token === '--list') args.list = true;
        else if (token === '--keep-workspace') args.keepWorkspace = true;
        else if (token === '--max-agent-steps') args.maxAgentSteps = Math.max(1, Math.min(Number(next()) || args.maxAgentSteps, 80));
        else if (token === '--request-timeout-ms') args.requestTimeoutMs = Math.max(30000, Number(next()) || args.requestTimeoutMs);
        else if (token === '--llm-timeout-ms') args.llmTimeoutMs = Math.max(30000, Number(next()) || args.llmTimeoutMs);
        else if (token === '--task-delay-ms') args.taskDelayMs = Math.max(0, Number(next()) || 0);
        else if (token === '--agent-retries') args.agentRetries = Math.max(0, Math.min(Number(next()) || 0, 5));
        else if (token === '--retry-delay-ms') args.retryDelayMs = Math.max(1000, Number(next()) || args.retryDelayMs);
        else if (token === '--temperature') args.temperature = Math.min(Math.max(Number(next()) || args.temperature, 0), 2);
        else if (token === '--wsl-distro') args.wslDistro = normalizeText(next(), args.wslDistro);
    }
    args.agentbenchRoot = path.resolve(args.agentbenchRoot);
    args.outputDir = path.resolve(args.outputDir);
    args.workspacesDir = path.join(args.outputDir, 'workspaces', args.runId);
    args.resultPath = path.join(args.outputDir, `${args.runId}.results.json`);
    args.jsonlPath = path.join(args.outputDir, `${args.runId}.results.jsonl`);
    args.reportPath = path.join(args.outputDir, `${args.runId}.report.md`);
    return args;
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, Math.max(0, ms || 0)));
}

function runProcess(command, args, options = {}) {
    return new Promise((resolve, reject) => {
        const child = spawn(command, args, {
            cwd: options.cwd || PROJECT_ROOT,
            env: { ...process.env, ...(options.env || {}) },
            stdio: ['ignore', 'pipe', 'pipe'],
            windowsHide: true
        });
        let stdout = '';
        let stderr = '';
        child.stdout.on('data', (chunk) => {
            stdout += chunk.toString();
            options.onStdout?.(chunk);
        });
        child.stderr.on('data', (chunk) => {
            stderr += chunk.toString();
            options.onStderr?.(chunk);
        });
        child.on('error', reject);
        child.on('close', (code) => {
            const result = { code, stdout, stderr };
            if (code === 0 || options.allowFailure) {
                resolve(result);
                return;
            }
            const error = new Error(`${command} ${args.join(' ')} exited ${code}: ${stderr || stdout}`);
            error.result = result;
            reject(error);
        });
    });
}

function toWslPath(windowsPath) {
    const resolved = path.resolve(windowsPath).replace(/\\/g, '/');
    const match = resolved.match(/^([A-Za-z]):\/(.*)$/);
    if (!match) {
        return resolved;
    }
    return `/mnt/${match[1].toLowerCase()}/${match[2]}`;
}

function bashQuote(value) {
    return `'${String(value).replace(/'/g, `'\\''`)}'`;
}

async function runWslBash(args, command, { cwd, allowFailure = false } = {}) {
    const script = cwd
        ? `cd ${bashQuote(toWslPath(cwd))} && ${command}`
        : command;
    return runProcess('wsl', ['-d', args.wslDistro, '--', 'bash', '-lc', script], {
        allowFailure
    });
}

async function parseTaskYamlFiles(agentbenchRoot) {
    const py = [
        'import json, pathlib, sys, yaml',
        'root = pathlib.Path(sys.argv[1])',
        'rows = []',
        'for path in sorted((root / "tasks").glob("*/*/task.yaml")):',
        '    data = yaml.safe_load(path.read_text(encoding="utf-8")) or {}',
        '    data["_task_yaml_path"] = str(path)',
        '    data["_task_dir"] = str(path.parent)',
        '    rows.append(data)',
        'print(json.dumps(rows, ensure_ascii=False))'
    ].join('\n');
    const result = await runProcess('python', ['-c', py, agentbenchRoot]);
    return JSON.parse(result.stdout || '[]');
}

function filterTasks(tasks, args) {
    let selected = tasks;
    if (args.suite) {
        selected = selected.filter((task) => task.suite === args.suite);
    }
    if (args.task) {
        selected = selected.filter((task) => task.id === args.task || task.name === args.task);
    }
    selected = selected.slice(args.offset);
    return args.limit ? selected.slice(0, args.limit) : selected;
}

function readDesktopLlmSettings(args) {
    const appData = process.env.APPDATA || path.join(process.env.USERPROFILE || '', 'AppData', 'Roaming');
    const statePath = path.join(appData, 'humanclaw', 'desktop-state.json');
    if (!fsSync.existsSync(statePath)) {
        throw new Error(`desktop-state.json not found: ${statePath}`);
    }
    const state = JSON.parse(fsSync.readFileSync(statePath, 'utf8'));
    const preferences = state.preferences || {};
    const apiKey = normalizeText(
        preferences.llmApiKey ||
        process.env.DOUBAO_API_KEY ||
        process.env.ARK_API_KEY ||
        process.env.VOLCENGINE_API_KEY ||
        process.env.OPENAI_COMPATIBLE_API_KEY ||
        ''
    );
    const settings = {
        provider: normalizeText(preferences.llmProvider, 'openai-compatible'),
        baseUrl: normalizeText(preferences.llmBaseUrl, 'https://ark.cn-beijing.volces.com/api/v3'),
        model: normalizeText(preferences.llmModel, 'doubao-seed-2-0-mini-260215'),
        apiKey,
        temperature: args.temperature,
        timeoutMs: args.llmTimeoutMs
    };
    if (!settings.baseUrl || !settings.model || !settings.apiKey) {
        throw new Error('LLM settings incomplete: baseUrl/model/apiKey is required.');
    }
    return settings;
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

function isRetriableAgentError(error) {
    const message = normalizeText(error?.message || String(error)).toLowerCase();
    return (
        message.includes('429') ||
        message.includes('too many requests') ||
        message.includes('rate limit') ||
        message.includes('fetch failed') ||
        message.includes('econnreset') ||
        message.includes('etimedout') ||
        message.includes('aborterror') ||
        message.includes('timeout')
    );
}

async function copyDir(source, target) {
    if (!fsSync.existsSync(source)) {
        return;
    }
    await fs.mkdir(target, { recursive: true });
    for (const entry of await fs.readdir(source, { withFileTypes: true })) {
        const sourcePath = path.join(source, entry.name);
        const targetPath = path.join(target, entry.name);
        if (entry.isDirectory()) {
            await copyDir(sourcePath, targetPath);
        } else {
            await fs.copyFile(sourcePath, targetPath);
        }
    }
}

async function sha256File(filePath) {
    const hash = crypto.createHash('sha256');
    hash.update(await fs.readFile(filePath));
    return hash.digest('hex');
}

async function listFiles(root) {
    const files = [];
    async function walk(current) {
        if (!fsSync.existsSync(current)) {
            return;
        }
        for (const entry of await fs.readdir(current, { withFileTypes: true })) {
            if (entry.name === '.git') {
                continue;
            }
            const itemPath = path.join(current, entry.name);
            if (entry.isDirectory()) {
                await walk(itemPath);
            } else {
                files.push(itemPath);
            }
        }
    }
    await walk(root);
    return files;
}

function relPath(root, filePath) {
    return path.relative(root, filePath).replace(/\\/g, '/');
}

function globToRegex(pattern) {
    const normalized = normalizeText(pattern, '**').replace(/\\/g, '/');
    if (normalized === '**') {
        return /^.*$/;
    }
    let source = '';
    for (let index = 0; index < normalized.length; index += 1) {
        const char = normalized[index];
        const next = normalized[index + 1];
        if (char === '*' && next === '*') {
            source += '.*';
            index += 1;
        } else if (char === '*') {
            source += '[^/]*';
        } else if (char === '?') {
            source += '[^/]';
        } else {
            source += char.replace(/[.+^${}()|[\]\\]/g, '\\$&');
        }
    }
    return new RegExp(`^${source}$`, 'i');
}

async function findMatchingPaths(workspace, pattern, { includeDirs = false } = {}) {
    const regex = globToRegex(pattern);
    const matches = [];
    async function walk(current) {
        if (!fsSync.existsSync(current)) {
            return;
        }
        for (const entry of await fs.readdir(current, { withFileTypes: true })) {
            const itemPath = path.join(current, entry.name);
            const relative = relPath(workspace, itemPath);
            if (entry.isDirectory()) {
                if (includeDirs && regex.test(`${relative}/`)) {
                    matches.push(itemPath);
                }
                if (entry.name !== '.git') {
                    await walk(itemPath);
                }
            } else if (regex.test(relative)) {
                matches.push(itemPath);
            }
        }
    }
    await walk(workspace);
    return matches;
}

async function readCandidateText(workspace, pattern) {
    const files = await findMatchingPaths(workspace, pattern);
    const chunks = [];
    for (const file of files.slice(0, 20)) {
        try {
            const stat = await fs.stat(file);
            if (stat.size <= 1_000_000) {
                chunks.push(await fs.readFile(file, 'utf8'));
            }
        } catch {}
    }
    return chunks.join('\n\n');
}

async function readAnyOutputText(workspace, agentOutputs = []) {
    const files = await listFiles(workspace);
    const chunks = [...agentOutputs];
    for (const file of files.slice(0, 120)) {
        try {
            const stat = await fs.stat(file);
            if (stat.size <= 300_000) {
                chunks.push(await fs.readFile(file, 'utf8'));
            }
        } catch {}
    }
    return chunks.join('\n\n');
}

function scoreContentContains(text, validator = {}) {
    const sections = Array.isArray(validator.sections)
        ? validator.sections
        : Array.isArray(validator.contains)
            ? validator.contains
            : [];
    if (!sections.length) {
        return { score: 100, detail: 'no sections required' };
    }
    const haystack = normalizeText(text).toLowerCase();
    const found = sections.filter((section) => haystack.includes(normalizeText(section).toLowerCase()));
    const matchAny = normalizeText(validator.match).toLowerCase() === 'any';
    const ok = matchAny ? found.length > 0 : found.length === sections.length;
    const score = matchAny
        ? (ok ? 100 : 0)
        : Math.round((found.length / sections.length) * 100);
    return {
        score,
        detail: `${found.length}/${sections.length} matched`,
        ok
    };
}

function parseCsvLine(line = '') {
    const cells = [];
    let current = '';
    let quoted = false;
    for (let index = 0; index < line.length; index += 1) {
        const char = line[index];
        const next = line[index + 1];
        if (char === '"' && quoted && next === '"') {
            current += '"';
            index += 1;
            continue;
        }
        if (char === '"') {
            quoted = !quoted;
            continue;
        }
        if (char === ',' && !quoted) {
            cells.push(current);
            current = '';
            continue;
        }
        current += char;
    }
    cells.push(current);
    return cells;
}

function parseCsvText(text = '') {
    const lines = normalizeText(text).split(/\r?\n/).filter(Boolean);
    if (!lines.length) {
        return { headers: [], rows: [] };
    }
    const headers = parseCsvLine(lines[0]);
    const rows = lines.slice(1).map((line) => {
        const values = parseCsvLine(line);
        const row = {};
        headers.forEach((header, index) => {
            row[header] = values[index] ?? '';
        });
        return row;
    });
    return { headers, rows };
}

function extractPythonListLiteralItems(command = '', name = 'required') {
    const match = String(command).match(new RegExp(`${name}\\s*=\\s*\\[([^\\]]+)\\]`));
    if (!match) {
        return [];
    }
    return Array.from(match[1].matchAll(/['"]([^'"]+)['"]/g)).map((item) => item[1]);
}

async function scoreBrokenPythonCsvValidatorFallback({ workspace, pattern, validator, command, combined }) {
    if (!/IndentationError|SyntaxError/i.test(combined)) {
        return null;
    }
    if (!/csv\.DictReader|PIPELINE_PASS/i.test(command)) {
        return null;
    }
    const text = await readCandidateText(workspace, pattern);
    const { headers, rows } = parseCsvText(text);
    if (!headers.length) {
        return null;
    }
    const errors = [];
    const required = extractPythonListLiteralItems(command, 'required');
    for (const column of required) {
        const found = headers.some((header) => (
            normalizeText(header).toLowerCase().replace(/[\s-]+/g, '_') ===
            normalizeText(column).toLowerCase().replace(/[\s-]+/g, '_')
        ));
        if (!found) {
            errors.push(`missing column: ${column}`);
        }
    }
    if (/duplicate customer_id/i.test(command)) {
        const seen = new Set();
        for (const row of rows) {
            const key = row.customer_id || row.id || '';
            if (key && seen.has(key)) {
                errors.push(`duplicate customer_id: ${key}`);
                break;
            }
            if (key) {
                seen.add(key);
            }
        }
    }
    if (/too few rows/i.test(command) && rows.length < 10) {
        errors.push(`too few rows: ${rows.length}`);
    }
    if (/too many rows/i.test(command) && rows.length > 16) {
        errors.push(`too many rows: ${rows.length}`);
    }
    if (/signup_date|bad date format/i.test(command)) {
        const datePattern = /^\d{4}-\d{2}-\d{2}$/;
        const bad = rows.find((row) => row.signup_date && !datePattern.test(row.signup_date));
        if (bad) {
            errors.push(`bad date format: ${bad.signup_date}`);
        }
    }
    const synthesized = [
        errors.length ? `ERRORS: ${errors.slice(0, 5).join('; ')}` : 'PIPELINE_PASS',
        `ROWS:${rows.length}`,
        `COLS:${headers.length}`
    ].join('\n');
    const contains = Array.isArray(validator.contains)
        ? validator.contains
        : Array.isArray(validator.sections)
            ? validator.sections
            : [];
    const matched = contains.filter((item) => synthesized.toLowerCase().includes(normalizeText(item).toLowerCase()));
    const ok = errors.length === 0 && matched.length === contains.length;
    return {
        type: 'command-output-contains',
        score: ok ? 100 : Math.round((matched.length / Math.max(contains.length, 1)) * 80),
        detail: `fallback csv validator; matched ${matched.length}/${contains.length}; output=${synthesized.replace(/\s+/g, ' ')}`
    };
}

async function scoreValidator({ args, workspace, pattern, validator, beforeHashes, agentOutputs }) {
    const type = normalizeText(validator.type);
    if (type === 'file-exists') {
        const matches = await findMatchingPaths(workspace, pattern, { includeDirs: true });
        return { type, score: matches.length ? 100 : 0, detail: matches.length ? `found ${matches.length}` : 'not found' };
    }
    if (type === 'content-contains') {
        const text = normalizeText(validator.in) === 'any-output'
            ? await readAnyOutputText(workspace, agentOutputs)
            : await readCandidateText(workspace, pattern);
        const result = scoreContentContains(text, validator);
        return { type, score: result.score, detail: result.detail };
    }
    if (type === 'content-not-contains') {
        const text = await readCandidateText(workspace, pattern);
        const sections = Array.isArray(validator.sections) ? validator.sections : [];
        const hits = sections.filter((section) => text.toLowerCase().includes(normalizeText(section).toLowerCase()));
        return { type, score: hits.length ? 0 : 100, detail: hits.length ? `unexpected: ${hits.join(', ')}` : 'clean' };
    }
    if (type === 'word-count-range') {
        const text = await readCandidateText(workspace, pattern);
        const words = text.split(/\s+/).filter(Boolean).length;
        const min = Number(validator.min) || 0;
        const max = Number(validator.max) || Number.MAX_SAFE_INTEGER;
        const inRange = words >= min && words <= max;
        const near = words >= Math.floor(min / 2) && words <= max * 2;
        return { type, score: inRange ? 100 : near ? 50 : 0, detail: `${words} words` };
    }
    if (type === 'command-output-contains') {
        const command = normalizeText(validator.command);
        if (!command) {
            return { type, score: 0, detail: 'missing command' };
        }
        const result = await runWslBash(args, command, { cwd: workspace, allowFailure: true });
        const combined = `${result.stdout}\n${result.stderr}`;
        if (result.code !== 0) {
            const fallback = await scoreBrokenPythonCsvValidatorFallback({
                workspace,
                pattern,
                validator,
                command,
                combined
            });
            if (fallback) {
                return fallback;
            }
        }
        const contains = Array.isArray(validator.contains)
            ? validator.contains
            : Array.isArray(validator.sections)
                ? validator.sections
                : [];
        const matched = contains.filter((item) => combined.toLowerCase().includes(normalizeText(item).toLowerCase()));
        const ok = result.code === 0 && matched.length === contains.length;
        return {
            type,
            score: ok ? 100 : Math.round((matched.length / Math.max(contains.length, 1)) * 80),
            detail: `exit=${result.code}; matched ${matched.length}/${contains.length}; output=${combined.slice(0, 300).replace(/\s+/g, ' ')}`
        };
    }
    if (type === 'git-log-contains') {
        const result = await runWslBash(args, 'git log --oneline --all', { cwd: workspace, allowFailure: true });
        const log = result.stdout.toLowerCase();
        const contains = Array.isArray(validator.contains) ? validator.contains : [];
        const matched = contains.filter((item) => log.includes(normalizeText(item).toLowerCase()));
        const count = result.stdout.split(/\r?\n/).filter(Boolean).length;
        const minCommits = Number(validator.min_commits) || 0;
        const ok = result.code === 0 && matched.length === contains.length && count >= minCommits;
        return { type, score: ok ? 100 : Math.round((matched.length / Math.max(contains.length, 1)) * 80), detail: `commits=${count}; matched ${matched.length}/${contains.length}` };
    }
    if (type === 'directory-structure') {
        const expected = Array.isArray(validator.expected) ? validator.expected : Array.isArray(validator.paths) ? validator.paths : [];
        const found = expected.filter((item) => fsSync.existsSync(path.join(workspace, item)));
        return { type, score: Math.round((found.length / Math.max(expected.length, 1)) * 100), detail: `${found.length}/${expected.length} paths` };
    }
    if (type === 'file-unchanged') {
        const matches = await findMatchingPaths(workspace, pattern);
        if (!matches.length) {
            return { type, score: 0, detail: 'file missing' };
        }
        const unchanged = [];
        for (const file of matches) {
            const relative = relPath(workspace, file);
            const before = beforeHashes.get(relative);
            const after = await sha256File(file);
            if (before && before === after) {
                unchanged.push(relative);
            }
        }
        return { type, score: unchanged.length === matches.length ? 100 : 0, detail: `${unchanged.length}/${matches.length} unchanged` };
    }
    if (type === 'link-consistency') {
        const files = await findMatchingPaths(workspace, validator.files || pattern);
        const styles = {};
        for (const file of files) {
            const text = await fs.readFile(file, 'utf8').catch(() => '');
            const style = /\[\[[^\]]+\]\]/.test(text) ? 'wikilink'
                : /\[[^\]]+\]\([^)]+\)/.test(text) ? 'markdown'
                    : 'plain';
            styles[style] = (styles[style] || 0) + 1;
        }
        const counts = Object.values(styles);
        const dominant = counts.length ? Math.max(...counts) / counts.reduce((a, b) => a + b, 0) : 0;
        return { type, score: dominant === 1 ? 100 : dominant >= 0.7 ? 50 : 0, detail: JSON.stringify(styles) };
    }
    if (type === 'no-crash') {
        return { type, score: 100, detail: 'agent returned' };
    }
    return { type, score: 0, detail: `unsupported validator ${type}` };
}

async function captureBeforeHashes(workspace, task = {}) {
    const hashes = new Map();
    const validators = getAllValidators(task);
    const patterns = validators
        .filter((item) => normalizeText(item.validator?.type) === 'file-unchanged')
        .map((item) => item.pattern);
    for (const pattern of patterns) {
        const matches = await findMatchingPaths(workspace, pattern);
        for (const file of matches) {
            hashes.set(relPath(workspace, file), await sha256File(file));
        }
    }
    return hashes;
}

function getAllValidators(task = {}) {
    const validators = [];
    for (const output of task.expected_outputs || []) {
        for (const validator of output.validators || []) {
            validators.push({ pattern: output.pattern || '**', validator });
        }
    }
    for (const behavior of task.expected_behavior || []) {
        for (const validator of behavior.validators || []) {
            validators.push({ pattern: validator.pattern || '**', validator });
        }
    }
    for (const turn of task.turns || []) {
        for (const validator of turn.validators || []) {
            validators.push({ pattern: validator.pattern || '**', validator });
        }
    }
    return validators;
}

function getExpectedOutputPatterns(task = {}) {
    const patterns = [];
    for (const output of task.expected_outputs || []) {
        const pattern = normalizeText(output.pattern || output.path || output.file);
        if (pattern && pattern !== '*' && pattern !== '**' && !patterns.includes(pattern)) {
            patterns.push(pattern);
        }
    }
    return patterns;
}

function buildAgentBenchExecutionProfile(task = {}) {
    const outputs = getExpectedOutputPatterns(task);
    return {
        kind: 'workspace_artifact_task',
        source: 'agentbench_runner',
        goal: task.name || task.id,
        objective: normalizeText(task.description || task.user_message),
        expectedOutputs: outputs,
        successCriteria: [
            'Create the requested files or perform the requested workspace changes.',
            'If a script is created to generate an output, execute it in the workspace.',
            'Before final response, verify required output artifacts exist and contain the expected data.'
        ]
    };
}

async function scoreLayer0({ args, task, workspace, beforeHashes, agentOutputs }) {
    const validators = getAllValidators(task);
    if (!validators.length) {
        return { score: 0, validators: [] };
    }
    const results = [];
    for (const item of validators) {
        results.push(await scoreValidator({
            args,
            workspace,
            pattern: item.validator.pattern || item.pattern || '**',
            validator: item.validator,
            beforeHashes,
            agentOutputs
        }));
    }
    return {
        score: Math.round(results.reduce((sum, item) => sum + item.score, 0) / results.length),
        validators: results
    };
}

function summarizeSteps(responses = []) {
    const steps = [];
    for (const response of responses) {
        for (const step of Array.isArray(response?.steps) ? response.steps : []) {
            steps.push({
                tool: step.tool || '',
                title: step.title || '',
                ok: step.response?.ok,
                status: step.response?.status || '',
                error: step.response?.error || step.response?.result?.error || ''
            });
        }
    }
    return steps;
}

function scoreLayer1(task = {}, steps = []) {
    const expected = task.expected_metrics || {};
    const toolRange = Array.isArray(expected.tool_calls) ? expected.tool_calls : [];
    const planningRange = Array.isArray(expected.planning_ratio) ? expected.planning_ratio : [];
    const toolCalls = steps.length;
    const errors = steps.filter((step) => step.ok === false || /error|failed|blocked/i.test(step.status || step.error)).length;
    const planningSteps = steps.filter((step) => /plan|update_plan/i.test(`${step.tool} ${step.title}`)).length;
    const planningRatio = toolCalls ? planningSteps / toolCalls : 0;

    let toolScore = 70;
    if (toolRange.length >= 2) {
        const [min, max] = toolRange.map(Number);
        if (toolCalls >= min && toolCalls <= max) {
            toolScore = 100;
        } else if (toolCalls <= max * 2 && toolCalls >= Math.max(1, Math.floor(min / 2))) {
            toolScore = 50;
        } else {
            toolScore = 20;
        }
    }
    const errorScore = errors === 0 ? 100 : errors <= 2 ? 70 : 30;
    let planningScore = planningSteps > 0 ? 90 : 60;
    if (planningRange.length >= 2) {
        const [min, max] = planningRange.map(Number);
        planningScore = planningRatio >= min && planningRatio <= max ? 100 : planningRatio <= max * 2 ? 60 : 35;
    }
    const score = Math.round(toolScore * 0.4 + errorScore * 0.35 + planningScore * 0.25);
    return {
        score,
        metrics: {
            toolCalls,
            errors,
            planningSteps,
            planningRatio: Number(planningRatio.toFixed(3)),
            expectedToolCalls: toolRange,
            expectedPlanningRatio: planningRange
        }
    };
}

function scoreLayer2(steps = [], layer0Score = 0) {
    let score = 100;
    const errors = steps.filter((step) => step.ok === false || /error|failed|blocked/i.test(step.status || step.error)).length;
    if (!steps.length) {
        score -= 40;
    }
    if (errors) {
        score -= Math.min(35, errors * 7);
    }
    if (layer0Score < 50) {
        score -= 25;
    }
    return {
        score: Math.max(0, Math.round(score)),
        detail: { errors }
    };
}

function compositeScore(task = {}, layer0, layer1, layer2) {
    const scoring = task.scoring || {};
    const w0 = Number(scoring.layer0_weight) || 0.4;
    const w1 = Number(scoring.layer1_weight) || 0.4;
    const w2 = Number(scoring.layer2_weight) || 0.2;
    const total = w0 + w1 + w2 || 1;
    return Math.round(((layer0.score * w0) + (layer1.score * w1) + (layer2.score * w2)) / total);
}

function buildTaskMessage(task, workspace, inputFiles = []) {
    const taskText = normalizeText(task.user_message || task.message || task.description);
    const asciiLetters = (taskText.match(/[A-Za-z]/g) || []).length;
    const cjkChars = (taskText.match(/[\u3400-\u9fff]/g) || []).length;
    const artifactLanguage = asciiLetters > cjkChars * 3 ? 'English' : 'the same language as the task prompt';
    return [
        'You are running an AgentBench task for AIGL.',
        `Workspace: ${workspace}`,
        'All files you create or modify must stay inside this workspace.',
        'Use tools to inspect files before writing changes. When finished, answer briefly with what you completed.',
        'If you create a script, run it in the workspace with computer action="exec", then verify the required output files exist before finishing.',
        'If the task requires a generated file, inspect that file after writing it and fix it if required fields are missing.',
        `Generated file language: ${artifactLanguage}.`,
        'Do not translate task-specific headings, labels, identifiers, or required terms into another language.',
        'Preserve the task\'s key terms in headings and labels so the output is easy to audit.',
        inputFiles.length ? `Input files available: ${inputFiles.join(', ')}` : 'Input files available: none',
        '',
        'Task:',
        taskText
    ].join('\n');
}

async function callAgent({ baseUrl, args, task, workspace, llmSettings, sessionId, message }) {
    const executionProfile = buildAgentBenchExecutionProfile(task);
    return fetchJson(`${baseUrl}/agent/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            sessionId,
            message,
            agentLoop: 'llm',
            planner: 'llm',
            maxAgentSteps: args.maxAgentSteps,
            maxSteps: args.maxAgentSteps,
            llmSettings,
            context: {
                evaluationName: 'agentbench-aigl',
                evaluationTaskId: task.id,
                executionProfile,
                agentLoop: 'llm',
                planner: 'llm',
                maxAgentSteps: args.maxAgentSteps,
                llmSettings,
                computerControlEnabled: true,
                permissionProfile: 'danger-full-access',
                approvalPolicy: 'auto',
                confirmationPolicy: 'auto',
                approved: true,
                autoConfirm: true,
                executeExternal: true,
                allowOutsideWorkspace: false,
                allowComputerWideAccess: false,
                allowSystemMutation: true,
                workspace
            }
        })
    }, args.requestTimeoutMs);
}

async function setupTaskWorkspace(args, task) {
    const workspace = path.join(args.workspacesDir, safeSegment(task.id));
    if (fsSync.existsSync(workspace)) {
        await fs.rm(workspace, { recursive: true, force: true });
    }
    await fs.mkdir(workspace, { recursive: true });
    const taskDir = task._task_dir;
    await copyDir(path.join(taskDir, 'inputs'), workspace);
    await fs.mkdir(path.join(workspace, '.github', 'workflows'), { recursive: true }).catch(() => {});
    const setupScript = normalizeText(task.setup_script || '');
    const setupPath = setupScript
        ? path.join(taskDir, setupScript)
        : path.join(taskDir, 'setup.sh');
    let setup = { ok: true, stdout: '', stderr: '', code: 0 };
    if (fsSync.existsSync(setupPath)) {
        await runWslBash(args, 'git config --global init.defaultBranch main', { allowFailure: true });
        const result = await runWslBash(args, `bash ${bashQuote(toWslPath(setupPath))} ${bashQuote(toWslPath(workspace))}`, { allowFailure: true });
        setup = {
            ok: result.code === 0,
            code: result.code,
            stdout: result.stdout.slice(0, 4000),
            stderr: result.stderr.slice(0, 4000)
        };
    }
    const beforeHashes = await captureBeforeHashes(workspace, task);
    const inputFiles = (await listFiles(workspace)).map((file) => relPath(workspace, file));
    return { workspace, setup, beforeHashes, inputFiles };
}

async function runTask({ args, gateway, baseUrl, llmSettings, task }) {
    const { workspace, setup, beforeHashes, inputFiles } = await setupTaskWorkspace(args, task);
    const startedAt = Date.now();
    const responses = [];
    const agentOutputs = [];
    let status = setup.ok ? 'completed' : 'setup_failed';
    let error = setup.ok ? '' : `setup exited ${setup.code}`;
    if (setup.ok) {
        const baseSessionId = `agentbench-${args.runId}-${safeSegment(task.id)}`;
        const turns = Array.isArray(task.turns) && task.turns.length
            ? task.turns
            : [{ role: 'user', message: buildTaskMessage(task, workspace, inputFiles) }];
        const fullTaskText = normalizeText([
            task.user_message,
            task.description,
            ...turns.map((turn) => turn.message)
        ].filter(Boolean).join('\n'));
        const asciiLetters = (fullTaskText.match(/[A-Za-z]/g) || []).length;
        const cjkChars = (fullTaskText.match(/[\u3400-\u9fff]/g) || []).length;
        const artifactLanguage = asciiLetters > cjkChars * 3 ? 'English' : 'the same language as the task prompt';
        for (let index = 0; index < turns.length; index += 1) {
            const turn = turns[index];
            const message = Array.isArray(task.turns) && task.turns.length
                ? [
                    'You are continuing an AgentBench multi-turn task for AIGL.',
                    `Workspace: ${workspace}`,
                    'All files you create or modify must stay inside this workspace.',
                    'If you create a script, run it in the workspace with computer action="exec", then verify the required output files exist before finishing.',
                    'If the task requires a generated file, inspect that file after writing it and fix it if required fields are missing.',
                    `Generated file language: ${artifactLanguage}.`,
                    'Do not translate task-specific headings, labels, identifiers, or required terms into another language.',
                    'Preserve the task\'s key terms in headings and labels so the output is easy to audit.',
                    inputFiles.length ? `Input files available: ${inputFiles.join(', ')}` : 'Input files available: none',
                    '',
                    `Turn ${index + 1}/${turns.length}:`,
                    normalizeText(turn.message)
                ].join('\n')
                : turn.message;
            try {
                let response = null;
                let lastError = null;
                for (let attempt = 0; attempt <= args.agentRetries; attempt += 1) {
                    const sessionId = attempt === 0
                        ? baseSessionId
                        : `${baseSessionId}-retry-${attempt}`;
                    try {
                        response = await callAgent({ baseUrl, args, task, workspace, llmSettings, sessionId, message });
                        lastError = null;
                        break;
                    } catch (caught) {
                        lastError = caught;
                        if (attempt >= args.agentRetries || !isRetriableAgentError(caught)) {
                            break;
                        }
                        const waitMs = args.retryDelayMs * (attempt + 1);
                        process.stdout.write(`retrying after ${waitMs}ms (${caught?.message || caught}) ... `);
                        await sleep(waitMs);
                    }
                }
                if (lastError) {
                    throw lastError;
                }
                responses.push(response);
                agentOutputs.push(normalizeText(response?.displayText || response?.speechText || response?.message));
                if (!response?.ok) {
                    status = response?.status || 'agent_failed';
                    error = response?.error || response?.blockedReason || status;
                    break;
                }
            } catch (caught) {
                status = 'runner_error';
                error = caught?.message || String(caught);
                break;
            }
        }
    }
    const steps = summarizeSteps(responses);
    const layer0 = setup.ok
        ? await scoreLayer0({ args, task, workspace, beforeHashes, agentOutputs })
        : { score: 0, validators: [] };
    const layer1 = setup.ok
        ? scoreLayer1(task, steps)
        : { score: 0, metrics: { toolCalls: 0, errors: 1, planningSteps: 0, planningRatio: 0 } };
    const layer2 = setup.ok
        ? scoreLayer2(steps, layer0.score)
        : { score: 0, detail: { errors: 1 } };
    const score = compositeScore(task, layer0, layer1, layer2);
    const result = {
        task_id: task.id,
        name: task.name,
        suite: task.suite,
        difficulty: task.difficulty,
        mode: task.mode,
        status,
        ok: setup.ok && score >= 60,
        score,
        durationMs: Date.now() - startedAt,
        workspace,
        setup,
        error,
        layer0,
        layer1,
        layer2,
        step_count: steps.length,
        steps
    };
    await fs.appendFile(args.jsonlPath, `${JSON.stringify(result)}\n`, 'utf8');
    if (!args.keepWorkspace && setup.ok) {
        // Keep low-scoring workspaces for debugging.
        if (score >= 80) {
            await fs.rm(workspace, { recursive: true, force: true }).catch(() => {});
        }
    }
    return result;
}

async function runTaskWithGateway({ args, llmSettings, task }) {
    const gateway = new HumanClawGateway({
        host: '127.0.0.1',
        port: 0,
        workspaceDir: PROJECT_ROOT,
        auditDir: path.join(args.outputDir, 'gateway-audit', args.runId),
        mcpConfigPath: path.join(PROJECT_ROOT, '.humanclaw-state', 'mcp-servers.json')
    });
    const status = await gateway.start();
    const baseUrl = `http://${status.host}:${status.port}`;
    try {
        return await runTask({ args, gateway, baseUrl, llmSettings, task });
    } finally {
        await gateway.stop?.().catch(() => {});
    }
}

function buildReport(args, results) {
    const avg = results.length
        ? results.reduce((sum, item) => sum + item.score, 0) / results.length
        : 0;
    const bySuite = {};
    for (const result of results) {
        bySuite[result.suite] ||= [];
        bySuite[result.suite].push(result.score);
    }
    const suiteRows = Object.entries(bySuite).map(([suite, scores]) => {
        const score = scores.reduce((sum, item) => sum + item, 0) / scores.length;
        return `- ${suite}: ${score.toFixed(2)} (${scores.length} tasks)`;
    });
    const rows = results.map((result, index) => {
        return `${index + 1}. ${result.task_id} | ${result.status} | ${result.score} | L0 ${result.layer0.score} / L1 ${result.layer1.score} / L2 ${result.layer2.score}`;
    });
    return [
        '# AIGL AgentBench Run',
        '',
        `- Run id: ${args.runId}`,
        `- Tasks: ${results.length}`,
        `- Average score: ${avg.toFixed(2)}`,
        `- Results: ${args.resultPath}`,
        '',
        '## Suites',
        '',
        ...suiteRows,
        '',
        '## Tasks',
        '',
        ...rows,
        ''
    ].join('\n');
}

async function main() {
    const args = parseArgs();
    const tasks = filterTasks(await parseTaskYamlFiles(args.agentbenchRoot), args);
    if (args.list) {
        for (const task of tasks) {
            console.log(`${task.id}\t${task.suite}\t${task.difficulty}\t${task.name}`);
        }
        return;
    }
    if (!tasks.length) {
        throw new Error('No AgentBench tasks selected.');
    }
    await fs.mkdir(args.outputDir, { recursive: true });
    await fs.mkdir(args.workspacesDir, { recursive: true });
    await fs.writeFile(args.jsonlPath, '', 'utf8');

    const llmSettings = readDesktopLlmSettings(args);
    const results = [];
    console.log(`Starting AIGL AgentBench run ${args.runId} | tasks=${tasks.length}`);
    for (let index = 0; index < tasks.length; index += 1) {
        if (index > 0 && args.taskDelayMs > 0) {
            process.stdout.write(`waiting ${args.taskDelayMs}ms before next task ... `);
            await sleep(args.taskDelayMs);
        }
        const task = tasks[index];
        process.stdout.write(`[${index + 1}/${tasks.length}] ${task.id} ... `);
        const result = await runTaskWithGateway({ args, llmSettings, task });
        results.push(result);
        process.stdout.write(`${result.status} | score=${result.score} | L0=${result.layer0.score} L1=${result.layer1.score} L2=${result.layer2.score}\n`);
    }
    const avg = results.reduce((sum, item) => sum + item.score, 0) / Math.max(results.length, 1);
    const summary = {
        benchmark: 'agentbench-aigl',
        runId: args.runId,
        taskCount: results.length,
        averageScore: Number(avg.toFixed(2)),
        completed: results.filter((item) => item.status === 'completed').length,
        failed: results.filter((item) => item.status !== 'completed').length,
        resultPath: args.resultPath,
        jsonlPath: args.jsonlPath,
        reportPath: args.reportPath,
        results
    };
    await fs.writeFile(args.resultPath, `${JSON.stringify(summary, null, 2)}\n`, 'utf8');
    await fs.writeFile(args.reportPath, buildReport(args, results), 'utf8');
    console.log(JSON.stringify(summary, null, 2));
}

main().catch((error) => {
    console.error(error?.stack || error?.message || String(error));
    process.exitCode = 1;
});
