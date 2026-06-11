const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');
const { spawn } = require('child_process');
const { randomUUID } = require('crypto');
const { listToolContractSummaries, getToolContractPromptText } = require('./humanclaw-tool-contracts.cjs');

const SCORECARD_RECENT_LIMIT = 40;
const DISCOVERY_DEFAULT_MAX_FILES = 500;
const DISCOVERY_DEFAULT_MAX_DEPTH = 4;
const DISCOVERY_README_MAX_CHARS = 20000;

const TOOL_DOCTOR_ACTIONS = Object.freeze([
    'schema',
    'health_check',
    'doctor',
    'run_eval',
    'eval_plan',
    'discover_mcp',
    'scorecard',
    'record_observation',
    'propose_repair',
    'list_repairs',
    'mark_repair'
]);

function normalizeString(value, fallback = '') {
    if (typeof value !== 'string') {
        return fallback;
    }
    const trimmed = value.trim();
    return trimmed || fallback;
}

function normalizeAction(value, fallback = 'health_check') {
    return normalizeString(value, fallback).toLowerCase().replace(/[-\s]+/g, '_');
}

function normalizeArray(value) {
    if (!value) {
        return [];
    }
    return Array.isArray(value) ? value : [value];
}

function isPlainObject(value) {
    return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

function cloneJson(value) {
    try {
        return JSON.parse(JSON.stringify(value));
    } catch {
        return value;
    }
}

function safeSegment(value, fallback = 'item') {
    return normalizeString(value, fallback)
        .replace(/[^a-zA-Z0-9._-]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 80) || fallback;
}

function clampText(value, maxChars = 20000) {
    const text = typeof value === 'string' ? value : JSON.stringify(value || '', null, 2);
    if (text.length <= maxChars) {
        return text;
    }
    return `${text.slice(0, maxChars)}\n...[truncated ${text.length - maxChars} chars]`;
}

function redactConfig(value) {
    if (Array.isArray(value)) {
        return value.map(redactConfig);
    }
    if (!isPlainObject(value)) {
        return value;
    }
    const result = {};
    for (const [key, entry] of Object.entries(value)) {
        if (/token|password|secret|api[_-]?key|authorization|credential|pass/i.test(key)) {
            result[key] = '__REDACTED__';
        } else {
            result[key] = redactConfig(entry);
        }
    }
    return result;
}

function toPublicPath(filePath, root = '') {
    const resolved = path.resolve(filePath);
    if (!root) {
        return resolved;
    }
    const base = path.resolve(root);
    const relative = path.relative(base, resolved);
    if (!relative.startsWith('..') && !path.isAbsolute(relative)) {
        return relative || '.';
    }
    return resolved;
}

async function readJsonFile(filePath, fallback) {
    try {
        const raw = await fsp.readFile(filePath, 'utf8');
        return JSON.parse(raw || '{}');
    } catch {
        return fallback;
    }
}

async function writeJsonFileAtomic(filePath, value) {
    await fsp.mkdir(path.dirname(filePath), { recursive: true });
    const tmpPath = `${filePath}.${process.pid}.${Date.now()}.tmp`;
    await fsp.writeFile(tmpPath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
    await fsp.rename(tmpPath, filePath);
}

function formatToolResult(payload, isError = false) {
    return {
        content: [
            {
                type: 'text',
                text: JSON.stringify(payload, null, 2)
            }
        ],
        details: payload,
        isError
    };
}

function normalizeObservationStatus(args = {}) {
    const raw = normalizeAction(args.status || args.result || args.outcome, args.ok === true ? 'success' : '');
    if (['success', 'completed', 'ok', 'passed', 'pass'].includes(raw)) {
        return 'success';
    }
    if (['timeout', 'timed_out'].includes(raw)) {
        return 'timeout';
    }
    if (['needs_approval', 'blocked', 'cancelled'].includes(raw)) {
        return raw;
    }
    if (raw) {
        return 'failed';
    }
    return args.ok === true ? 'success' : 'failed';
}

function updateRate(tool = {}) {
    const total = Math.max(0, Number(tool.total || 0));
    return {
        successRate: total ? Number(((tool.success || 0) / total).toFixed(4)) : 0,
        timeoutRate: total ? Number(((tool.timeout || 0) / total).toFixed(4)) : 0,
        failureRate: total ? Number(((tool.failed || 0) / total).toFixed(4)) : 0,
        averageLatencyMs: tool.latencyCount ? Math.round((tool.totalLatencyMs || 0) / tool.latencyCount) : 0
    };
}

function summarizeToolScore(tool = {}) {
    const commonErrors = Object.entries(tool.commonErrors || {})
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([code, count]) => ({ code, count }));
    return {
        tool: tool.tool,
        total: tool.total || 0,
        success: tool.success || 0,
        failed: tool.failed || 0,
        timeout: tool.timeout || 0,
        ...updateRate(tool),
        lastUsedAt: tool.lastUsedAt || '',
        commonErrors,
        recentRepairs: Array.isArray(tool.recentRepairs) ? tool.recentRepairs.slice(-8) : [],
        recent: Array.isArray(tool.recent) ? tool.recent.slice(-10) : []
    };
}

function discoverServerConfigsFromJson(parsed) {
    const results = [];
    const unwrap = parsed?.mcpServers || parsed?.servers || parsed?.mcp || parsed;
    if (!unwrap || typeof unwrap !== 'object') {
        return results;
    }
    if (unwrap.command || unwrap.url || unwrap.transport || unwrap.type) {
        results.push({
            name: normalizeString(unwrap.name || unwrap.id, 'default'),
            config: unwrap
        });
        return results;
    }
    for (const [name, config] of Object.entries(unwrap)) {
        if (config && typeof config === 'object' && (config.command || config.url || config.transport || config.type)) {
            results.push({
                name: normalizeString(config.name || config.id || name),
                config
            });
        }
    }
    return results;
}

function packageLooksLikeMcp(pkg = {}) {
    const text = [
        pkg.name,
        pkg.description,
        ...(Array.isArray(pkg.keywords) ? pkg.keywords : []),
        ...Object.keys(pkg.scripts || {}),
        ...Object.values(pkg.scripts || {}),
        ...Object.keys(pkg.dependencies || {}),
        ...Object.keys(pkg.devDependencies || {})
    ].join(' ').toLowerCase();
    return /modelcontextprotocol|model context protocol|\bmcp\b/.test(text);
}

function suggestedConfigFromPackage(pkg = {}, packageDir = '') {
    const name = normalizeString(pkg.name, path.basename(packageDir));
    const bin = pkg.bin;
    if (typeof bin === 'string') {
        return {
            transport: 'stdio',
            command: 'node',
            args: [path.join(packageDir, bin)]
        };
    }
    if (isPlainObject(bin)) {
        const first = Object.values(bin).find((entry) => typeof entry === 'string');
        if (first) {
            return {
                transport: 'stdio',
                command: 'node',
                args: [path.join(packageDir, first)]
            };
        }
    }
    if (name) {
        return {
            transport: 'stdio',
            command: 'npx',
            args: ['-y', name]
        };
    }
    return {};
}

function looksLikeGitHubRepo(value = '') {
    return /^https?:\/\/github\.com\/[^/\s]+\/[^/\s]+(?:\.git)?(?:\/)?$/i.test(value)
        || /^git@github\.com:[^/\s]+\/[^/\s]+(?:\.git)?$/i.test(value);
}

function repoCacheName(repo = '') {
    return safeSegment(
        repo
            .replace(/^https?:\/\/github\.com\//i, '')
            .replace(/^git@github\.com:/i, '')
            .replace(/\.git$/i, '')
            .replace(/[\\/]+$/g, '')
            .replace(/[\\/]/g, '__'),
        'github-repo'
    );
}

function runProcess(command, args = [], options = {}) {
    const startedAt = Date.now();
    return new Promise((resolve) => {
        const child = spawn(command, args, {
            cwd: options.cwd || process.cwd(),
            env: process.env,
            stdio: ['ignore', 'pipe', 'pipe'],
            windowsHide: true
        });
        let stdout = '';
        let stderr = '';
        const timeoutMs = Number(options.timeoutMs || 60000);
        const timer = setTimeout(() => {
            child.kill('SIGTERM');
        }, timeoutMs);
        child.stdout.on('data', (chunk) => {
            stdout += chunk.toString();
        });
        child.stderr.on('data', (chunk) => {
            stderr += chunk.toString();
        });
        child.on('close', (code, signal) => {
            clearTimeout(timer);
            resolve({
                ok: code === 0,
                code,
                signal,
                durationMs: Date.now() - startedAt,
                stdout: stdout.slice(-8000),
                stderr: stderr.slice(-8000)
            });
        });
        child.on('error', (error) => {
            clearTimeout(timer);
            resolve({
                ok: false,
                code: null,
                signal: '',
                durationMs: Date.now() - startedAt,
                stdout,
                stderr: error?.message || String(error)
            });
        });
    });
}

class HumanClawToolDoctor {
    constructor(options = {}) {
        this.workspaceRoot = path.resolve(options.workspaceRoot || process.cwd());
        this.projectRoot = path.resolve(options.projectRoot || this.workspaceRoot);
        this.auditDir = path.resolve(options.auditDir || path.join(this.projectRoot, 'tmp', 'humanclaw-gateway'));
        this.stateDir = path.resolve(options.stateDir || path.join(this.auditDir, 'tool-doctor'));
        this.scorecardPath = path.join(this.stateDir, 'scorecard.json');
        this.repairsPath = path.join(this.stateDir, 'repair-proposals.json');
        this.mcpManager = options.mcpManager || null;
        this.emitGatewayEvent = typeof options.emitGatewayEvent === 'function' ? options.emitGatewayEvent : () => {};
    }

    getStatus() {
        return {
            enabled: true,
            version: 1,
            stateDir: this.stateDir,
            scorecardPath: this.scorecardPath,
            repairsPath: this.repairsPath,
            actions: [...TOOL_DOCTOR_ACTIONS]
        };
    }

    async execute(args = {}, context = {}) {
        const action = normalizeAction(args.action || args.operation || args.intent, 'health_check');
        try {
            if (action === 'schema') {
                return formatToolResult(this.buildSchema());
            }
            if (['health_check', 'doctor'].includes(action)) {
                return formatToolResult(await this.healthCheck(args, context));
            }
            if (['run_eval', 'eval_plan'].includes(action)) {
                return formatToolResult(await this.buildEvalPlan(args, context));
            }
            if (['discover_mcp', 'discover'].includes(action)) {
                return formatToolResult(await this.discoverMcp(args, context));
            }
            if (action === 'scorecard') {
                return formatToolResult(await this.getScorecard(args));
            }
            if (action === 'record_observation') {
                return formatToolResult(await this.recordObservation(args, context));
            }
            if (action === 'propose_repair') {
                return formatToolResult(await this.proposeRepair(args, context));
            }
            if (action === 'list_repairs') {
                return formatToolResult(await this.listRepairs(args));
            }
            if (action === 'mark_repair') {
                return formatToolResult(await this.markRepair(args, context));
            }
            return formatToolResult({
                status: 'unsupported_action',
                action,
                supportedActions: [...TOOL_DOCTOR_ACTIONS]
            }, true);
        } catch (error) {
            return formatToolResult({
                status: 'error',
                action,
                error: error?.message || String(error)
            }, true);
        }
    }

    buildSchema() {
        return {
            status: 'completed',
            tool: 'tool_doctor',
            contract: getToolContractPromptText('tool_doctor') || '',
            responsibilities: [
                'Run read-only tool health checks and return repair recommendations.',
                'Discover candidate MCP servers from local config files, package metadata, local repos, or user-provided GitHub URLs.',
                'Maintain a local scorecard of tool success rate, timeout rate, common errors, and recent repair notes.',
                'Create self-repair proposals with evidence and validation commands; never apply patches directly.'
            ],
            actions: [...TOOL_DOCTOR_ACTIONS]
        };
    }

    async loadScorecard() {
        const state = await readJsonFile(this.scorecardPath, null);
        if (state && state.version === 1 && isPlainObject(state.tools)) {
            return state;
        }
        return {
            version: 1,
            createdAt: new Date().toISOString(),
            updatedAt: '',
            tools: {}
        };
    }

    async saveScorecard(state) {
        const next = {
            version: 1,
            createdAt: state.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            tools: state.tools || {}
        };
        await writeJsonFileAtomic(this.scorecardPath, next);
        return next;
    }

    async loadRepairs() {
        const state = await readJsonFile(this.repairsPath, null);
        if (state && state.version === 1 && Array.isArray(state.repairs)) {
            return state;
        }
        return {
            version: 1,
            createdAt: new Date().toISOString(),
            updatedAt: '',
            repairs: []
        };
    }

    async saveRepairs(state) {
        const next = {
            version: 1,
            createdAt: state.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            repairs: Array.isArray(state.repairs) ? state.repairs : []
        };
        await writeJsonFileAtomic(this.repairsPath, next);
        return next;
    }

    async healthCheck(args = {}, context = {}) {
        const startedAt = Date.now();
        const contracts = listToolContractSummaries();
        const scorecard = await this.getScorecard({ limit: args.limit || 20 });
        const mcpStatus = this.mcpManager?.getStatus ? this.mcpManager.getStatus() : null;
        const includeMcp = args.includeMcp !== false;
        let mcpHealth = [];
        if (includeMcp && this.mcpManager?.healthCheck && (mcpStatus?.serverCount || 0) > 0) {
            mcpHealth = await this.mcpManager.healthCheck(
                normalizeString(args.server || args.serverId),
                args.timeoutMs || context.timeoutMs || 5000
            );
        }
        const failedMcp = mcpHealth.filter((entry) => entry.ok === false);
        const weakTools = scorecard.tools
            .filter((tool) => tool.total >= 3 && (tool.successRate < 0.8 || tool.timeoutRate > 0.15))
            .slice(0, 8);
        const recommendations = [];
        if (!mcpStatus || mcpStatus.serverCount === 0) {
            recommendations.push({
                id: 'mcp_discovery_needed',
                severity: 'info',
                text: 'No MCP servers are configured. Run tool_doctor.discover_mcp on user-provided configs or local directories before relying on MCP tasks.'
            });
        }
        for (const entry of failedMcp) {
            recommendations.push({
                id: 'mcp_server_degraded',
                severity: 'high',
                server: entry.server,
                text: `MCP server ${entry.server} is ${entry.status || 'unhealthy'}: ${entry.error || 'unknown error'}`
            });
        }
        for (const tool of weakTools) {
            recommendations.push({
                id: 'tool_score_weak',
                severity: tool.timeoutRate > 0.25 ? 'high' : 'medium',
                tool: tool.tool,
                text: `${tool.tool} has successRate=${tool.successRate}, timeoutRate=${tool.timeoutRate}. Inspect commonErrors before expanding task coverage.`
            });
        }
        if (!recommendations.length) {
            recommendations.push({
                id: 'baseline_healthy',
                severity: 'info',
                text: 'Tool contracts, MCP status, and scorecard do not show a blocking health issue.'
            });
        }
        return {
            status: failedMcp.length || weakTools.length ? 'degraded' : 'completed',
            durationMs: Date.now() - startedAt,
            contractCount: contracts.length,
            contracts,
            mcpStatus,
            mcpHealth,
            scorecard: {
                updatedAt: scorecard.updatedAt,
                toolCount: scorecard.toolCount,
                weakTools
            },
            evalPlan: (await this.buildEvalPlan({ mode: args.mode || 'smoke' })).checks,
            recommendations
        };
    }

    async buildEvalPlan(args = {}) {
        const mode = normalizeAction(args.mode || args.depth, 'smoke');
        const checks = [
            {
                id: 'harness_contracts',
                command: 'pnpm humanclaw:validate-harness',
                purpose: 'Verify tool contracts, skills, typed evidence artifacts, and task graph records.'
            },
            {
                id: 'tool_contract_tests',
                command: 'pnpm test:humanclaw-tool-contracts',
                purpose: 'Catch schema drift before tools are exposed to the Agent.'
            },
            {
                id: 'tool_doctor_tests',
                command: 'pnpm test:humanclaw-tool-doctor',
                purpose: 'Verify MCP discovery, scorecard persistence, and repair proposal gate.'
            },
            {
                id: 'capability_manager_tests',
                command: 'pnpm test:humanclaw-capability-manager',
                purpose: 'Verify capability registry, MCP installation, skill auto-authoring, rollback, and repair execution.'
            },
            {
                id: 'mcp_soak',
                command: 'pnpm humanclaw:mcp-soak',
                purpose: 'Exercise stdio and HTTP MCP calls, schema validation, resources, prompts, timeout and recovery.'
            }
        ];
        if (['deep', 'release', 'full'].includes(mode)) {
            checks.push(
                {
                    id: 'gateway_regression',
                    command: 'pnpm humanclaw:validate-gateway',
                    purpose: 'Run the broader runtime, gateway, tool, memory, and smoke regression pack.'
                },
                {
                    id: 'humanlike_longitudinal_smoke',
                    command: 'pnpm eval:aigl-humanlike:longitudinal-agent:smoke',
                    purpose: 'Spot-check user-facing persona, low tool-feel, memory quality, and task progress.'
                }
            );
        }
        return {
            status: 'completed',
            mode,
            execution: args.execute === true ? 'external_runner_required' : 'plan_only',
            checks,
            scheduleRecommendation: {
                onStartup: ['harness_contracts'],
                afterToolChange: ['harness_contracts', 'tool_contract_tests', 'tool_doctor_tests', 'capability_manager_tests'],
                daily: ['harness_contracts', 'mcp_soak'],
                beforeRelease: checks.map((check) => check.id)
            }
        };
    }

    async discoverMcp(args = {}) {
        const startedAt = Date.now();
        const roots = [
            ...normalizeArray(args.paths || args.path),
            ...normalizeArray(args.roots || args.root),
            ...normalizeArray(args.localDirs || args.localDir)
        ].map((entry) => path.resolve(this.workspaceRoot, String(entry)));
        const configPaths = normalizeArray(args.configPaths || args.configPath)
            .map((entry) => path.resolve(this.workspaceRoot, String(entry)));
        const githubRepos = normalizeArray(args.githubRepos || args.githubRepo || args.repos || args.repo);
        if (!roots.length && !configPaths.length && !githubRepos.length && args.includeProject !== false) {
            roots.push(this.projectRoot);
        }
        const candidates = [];
        if (args.includeConfigured !== false && this.mcpManager?.listServers) {
            for (const server of this.mcpManager.listServers()) {
                candidates.push({
                    id: `configured:${server.name}`,
                    name: server.name,
                    sourceType: 'configured',
                    source: this.mcpManager.getStatus?.().configPath || 'runtime',
                    confidence: 1,
                    status: 'already_configured',
                    suggestedConfig: redactConfig(server),
                    reasons: ['MCP server is already registered in the runtime manager.']
                });
            }
        }
        for (const configPath of configPaths) {
            candidates.push(...await this.discoverFromConfigPath(configPath));
        }
        for (const root of roots) {
            candidates.push(...await this.discoverFromLocalRoot(root, args));
        }
        for (const repo of githubRepos) {
            const value = normalizeString(repo);
            if (!value) {
                continue;
            }
            if (fs.existsSync(value)) {
                candidates.push(...await this.discoverFromLocalRoot(path.resolve(value), args));
            } else if (looksLikeGitHubRepo(value) && (args.cloneGithub === true || args.allowNetwork === true)) {
                candidates.push(...await this.discoverFromGithubRepo(value, args));
            } else {
                candidates.push({
                    id: `github:${value}`,
                    name: value.split('/').filter(Boolean).pop()?.replace(/\.git$/i, '') || 'github-mcp-candidate',
                    sourceType: 'github_repo',
                    source: value,
                    confidence: 0.35,
                    status: 'needs_local_checkout',
                    suggestedConfig: {},
                    reasons: ['User provided a GitHub repository URL. Set cloneGithub=true/allowNetwork=true or provide a local checkout for deeper discovery.']
                });
            }
        }
        const deduped = this.dedupeCandidates(candidates)
            .sort((a, b) => b.confidence - a.confidence || a.name.localeCompare(b.name));
        return {
            status: 'completed',
            durationMs: Date.now() - startedAt,
            candidateCount: deduped.length,
            candidates: deduped,
            nextSteps: [
                'Review high-confidence candidates before registration.',
                'For stdio candidates, prefer pinning command/args/cwd explicitly rather than relying on shell PATH.',
                'After registration, run tool_doctor.health_check and mcp_bridge.health_check before exposing tools to Agent tasks.'
            ]
        };
    }

    async discoverFromGithubRepo(repoUrl, args = {}) {
        const cacheRoot = path.join(this.stateDir, 'mcp-discovery', 'github');
        const checkoutDir = path.join(cacheRoot, repoCacheName(repoUrl));
        await fsp.mkdir(cacheRoot, { recursive: true });
        let cloned = false;
        let cloneResult = null;
        try {
            await fsp.access(path.join(checkoutDir, '.git'));
        } catch {
            cloneResult = await runProcess('git', [
                'clone',
                '--depth',
                '1',
                '--filter=blob:none',
                repoUrl,
                checkoutDir
            ], {
                cwd: cacheRoot,
                timeoutMs: args.timeoutMs || 60000
            });
            cloned = cloneResult.ok;
        }
        if (cloneResult && !cloneResult.ok) {
            return [{
                id: `github-clone-error:${repoUrl}`,
                name: repoCacheName(repoUrl),
                sourceType: 'github_repo',
                source: repoUrl,
                confidence: 0,
                status: 'clone_error',
                suggestedConfig: {},
                reasons: [`GitHub clone failed: ${cloneResult.stderr || cloneResult.stdout || 'unknown error'}`]
            }];
        }
        const discovered = await this.discoverFromLocalRoot(checkoutDir, args);
        if (!discovered.length) {
            return [{
                id: `github:${repoUrl}`,
                name: repoCacheName(repoUrl),
                sourceType: 'github_repo',
                source: repoUrl,
                confidence: 0.2,
                status: cloned ? 'cloned_no_mcp_signal' : 'cached_no_mcp_signal',
                suggestedConfig: {},
                reasons: [`Repository scanned at ${checkoutDir}, but no strong MCP config/package signal was found.`]
            }];
        }
        return discovered.map((candidate) => ({
            ...candidate,
            sourceType: candidate.sourceType === 'github_repo' ? candidate.sourceType : `github_${candidate.sourceType}`,
            githubRepo: repoUrl,
            checkoutDir,
            status: candidate.status || (cloned ? 'cloned_candidate' : 'cached_candidate')
        }));
    }

    async discoverFromConfigPath(configPath) {
        try {
            const raw = await fsp.readFile(configPath, 'utf8');
            const parsed = JSON.parse(raw || '{}');
            return discoverServerConfigsFromJson(parsed).map((entry) => ({
                id: `config:${configPath}:${entry.name}`,
                name: entry.name,
                sourceType: 'mcp_config',
                source: configPath,
                confidence: 0.95,
                status: 'candidate',
                suggestedConfig: redactConfig(entry.config),
                reasons: ['Found MCP server config with command/url/transport fields.']
            }));
        } catch (error) {
            return [{
                id: `config-error:${configPath}`,
                name: path.basename(configPath),
                sourceType: 'mcp_config',
                source: configPath,
                confidence: 0,
                status: 'read_error',
                suggestedConfig: {},
                reasons: [`Cannot parse config: ${error?.message || String(error)}`]
            }];
        }
    }

    async discoverFromLocalRoot(root, args = {}) {
        const maxDepth = Number(args.maxDepth || DISCOVERY_DEFAULT_MAX_DEPTH);
        const maxFiles = Number(args.maxFiles || DISCOVERY_DEFAULT_MAX_FILES);
        const candidates = [];
        const queue = [{ dir: root, depth: 0 }];
        let inspected = 0;
        while (queue.length && inspected < maxFiles) {
            const current = queue.shift();
            let entries = [];
            try {
                entries = await fsp.readdir(current.dir, { withFileTypes: true });
            } catch {
                continue;
            }
            for (const entry of entries) {
                if (inspected >= maxFiles) {
                    break;
                }
                if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === 'dist' || entry.name === 'build') {
                    continue;
                }
                const fullPath = path.join(current.dir, entry.name);
                if (entry.isDirectory()) {
                    if (current.depth < maxDepth) {
                        queue.push({ dir: fullPath, depth: current.depth + 1 });
                    }
                    continue;
                }
                inspected += 1;
                const lower = entry.name.toLowerCase();
                if (['mcp.json', '.mcp.json', 'mcp-servers.json', 'claude_desktop_config.json'].includes(lower)) {
                    candidates.push(...await this.discoverFromConfigPath(fullPath));
                } else if (lower === 'package.json') {
                    const candidate = await this.discoverFromPackageJson(fullPath, root);
                    if (candidate) {
                        candidates.push(candidate);
                    }
                } else if (lower === 'readme.md' || lower === 'readme') {
                    const candidate = await this.discoverFromReadme(fullPath, root);
                    if (candidate) {
                        candidates.push(candidate);
                    }
                }
            }
        }
        return candidates;
    }

    async discoverFromPackageJson(filePath, root) {
        try {
            const pkg = JSON.parse(await fsp.readFile(filePath, 'utf8') || '{}');
            if (!packageLooksLikeMcp(pkg)) {
                return null;
            }
            const packageDir = path.dirname(filePath);
            const reasons = ['package.json contains MCP-related dependency, keyword, script, name, or description.'];
            if (pkg.dependencies?.['@modelcontextprotocol/sdk'] || pkg.devDependencies?.['@modelcontextprotocol/sdk']) {
                reasons.push('Uses @modelcontextprotocol/sdk.');
            }
            if (pkg.bin) {
                reasons.push('Package exposes a bin entry that can be wired as stdio MCP command.');
            }
            return {
                id: `package:${filePath}`,
                name: normalizeString(pkg.name, path.basename(packageDir)),
                sourceType: 'package_json',
                source: toPublicPath(filePath, root),
                confidence: pkg.bin ? 0.82 : 0.68,
                status: 'candidate',
                suggestedConfig: redactConfig(suggestedConfigFromPackage(pkg, packageDir)),
                reasons
            };
        } catch {
            return null;
        }
    }

    async discoverFromReadme(filePath, root) {
        try {
            const text = (await fsp.readFile(filePath, 'utf8')).slice(0, DISCOVERY_README_MAX_CHARS);
            if (!/model context protocol|mcp server|tools\/list|stdio mcp|http mcp/i.test(text)) {
                return null;
            }
            return {
                id: `readme:${filePath}`,
                name: path.basename(path.dirname(filePath)),
                sourceType: 'readme_hint',
                source: toPublicPath(filePath, root),
                confidence: 0.45,
                status: 'candidate',
                suggestedConfig: {},
                reasons: ['README mentions MCP server or MCP protocol terms. Inspect package/config before registration.']
            };
        } catch {
            return null;
        }
    }

    dedupeCandidates(candidates = []) {
        const seen = new Map();
        for (const candidate of candidates) {
            const key = `${candidate.sourceType}:${candidate.name}:${JSON.stringify(candidate.suggestedConfig || {})}`;
            const existing = seen.get(key);
            if (!existing || candidate.confidence > existing.confidence) {
                seen.set(key, candidate);
            }
        }
        return [...seen.values()].map((candidate) => ({
            ...candidate,
            id: candidate.id || `${safeSegment(candidate.sourceType)}:${safeSegment(candidate.name)}`
        }));
    }

    async getScorecard(args = {}) {
        const state = await this.loadScorecard();
        const toolFilter = normalizeString(args.tool || args.toolId);
        const tools = Object.values(state.tools || {})
            .filter((tool) => !toolFilter || tool.tool === toolFilter)
            .map(summarizeToolScore)
            .sort((a, b) => (b.total - a.total) || a.tool.localeCompare(b.tool));
        const limit = Number(args.limit || 0);
        return {
            status: 'completed',
            updatedAt: state.updatedAt || '',
            scorecardPath: this.scorecardPath,
            toolCount: tools.length,
            tools: limit > 0 ? tools.slice(0, limit) : tools
        };
    }

    async recordObservation(args = {}, context = {}) {
        const tool = normalizeString(args.tool || args.toolId || args.name);
        if (!tool) {
            return {
                status: 'invalid_tool_args',
                error: 'tool_doctor.record_observation requires tool/toolId/name'
            };
        }
        const state = await this.loadScorecard();
        const current = state.tools[tool] || {
            tool,
            total: 0,
            success: 0,
            failed: 0,
            timeout: 0,
            blocked: 0,
            needsApproval: 0,
            cancelled: 0,
            totalLatencyMs: 0,
            latencyCount: 0,
            commonErrors: {},
            recent: [],
            recentRepairs: []
        };
        const status = normalizeObservationStatus(args);
        const latencyMs = Number(args.latencyMs || args.durationMs || args.elapsedMs || 0);
        const errorCode = normalizeString(args.errorCode || args.code || args.error || args.reason);
        current.total += 1;
        if (status === 'success') {
            current.success += 1;
        } else if (status === 'timeout') {
            current.timeout += 1;
            current.failed += 1;
        } else if (status === 'blocked') {
            current.blocked += 1;
        } else if (status === 'needs_approval') {
            current.needsApproval += 1;
        } else if (status === 'cancelled') {
            current.cancelled += 1;
            current.failed += 1;
        } else {
            current.failed += 1;
        }
        if (latencyMs > 0) {
            current.totalLatencyMs += latencyMs;
            current.latencyCount += 1;
        }
        if (errorCode) {
            current.commonErrors[errorCode] = (current.commonErrors[errorCode] || 0) + 1;
        }
        const event = {
            id: randomUUID(),
            at: new Date().toISOString(),
            runId: normalizeString(args.runId || context.runId),
            status,
            latencyMs: latencyMs > 0 ? latencyMs : undefined,
            errorCode: errorCode || undefined,
            source: normalizeString(args.source || context.source, 'runtime'),
            summary: normalizeString(args.summary || args.message)
        };
        current.recent = [...(current.recent || []), event].slice(-SCORECARD_RECENT_LIMIT);
        current.lastUsedAt = event.at;
        state.tools[tool] = current;
        const saved = await this.saveScorecard(state);
        this.emitGatewayEvent('tool_doctor.scorecard.updated', {
            tool,
            status,
            scorecardPath: this.scorecardPath
        });
        return {
            status: 'completed',
            tool,
            observation: event,
            score: summarizeToolScore(saved.tools[tool])
        };
    }

    async proposeRepair(args = {}, context = {}) {
        const title = normalizeString(args.title || args.summary);
        if (!title) {
            return {
                status: 'invalid_tool_args',
                error: 'tool_doctor.propose_repair requires title/summary'
            };
        }
        const now = new Date().toISOString();
        const repair = {
            id: normalizeString(args.id, `repair-${safeSegment(title)}-${randomUUID().slice(0, 8)}`),
            status: 'proposed',
            createdAt: now,
            updatedAt: now,
            title,
            scope: normalizeString(args.scope || args.tool || args.area, 'tooling'),
            tool: normalizeString(args.tool || args.toolId),
            risk: normalizeString(args.risk, 'medium'),
            reason: normalizeString(args.reason || args.problem || ''),
            evidence: cloneJson(args.evidence || args.observations || []),
            candidateDiff: args.candidateDiff ? clampText(args.candidateDiff, 20000) : '',
            candidatePatchPath: normalizeString(args.candidatePatchPath || args.patchPath),
            validationCommands: normalizeArray(args.validationCommands || args.validate || args.tests).map(String),
            validationReport: args.validationReport ? clampText(args.validationReport, 12000) : '',
            runId: normalizeString(args.runId || context.runId),
            applied: false,
            gate: {
                status: 'proposal_only',
                rule: 'Self-Repair Gate can propose patches and validation reports, but patch application must go through the normal code/edit approval path.'
            }
        };
        const repairs = await this.loadRepairs();
        repairs.repairs.push(repair);
        await this.saveRepairs(repairs);
        if (repair.tool) {
            const scorecard = await this.loadScorecard();
            const current = scorecard.tools[repair.tool] || {
                tool: repair.tool,
                total: 0,
                success: 0,
                failed: 0,
                timeout: 0,
                totalLatencyMs: 0,
                latencyCount: 0,
                commonErrors: {},
                recent: [],
                recentRepairs: []
            };
            current.recentRepairs = [
                ...(current.recentRepairs || []),
                {
                    id: repair.id,
                    status: repair.status,
                    title: repair.title,
                    at: repair.createdAt
                }
            ].slice(-SCORECARD_RECENT_LIMIT);
            scorecard.tools[repair.tool] = current;
            await this.saveScorecard(scorecard);
        }
        this.emitGatewayEvent('tool_doctor.repair.proposed', {
            id: repair.id,
            title: repair.title,
            scope: repair.scope,
            tool: repair.tool
        });
        return {
            status: 'completed',
            repair,
            repairsPath: this.repairsPath
        };
    }

    async listRepairs(args = {}) {
        const state = await this.loadRepairs();
        const status = normalizeString(args.status);
        const tool = normalizeString(args.tool || args.toolId);
        const repairs = state.repairs
            .filter((repair) => !status || repair.status === status)
            .filter((repair) => !tool || repair.tool === tool)
            .slice(-(Number(args.limit || 50)));
        return {
            status: 'completed',
            updatedAt: state.updatedAt || '',
            repairsPath: this.repairsPath,
            repairCount: repairs.length,
            repairs
        };
    }

    async markRepair(args = {}, context = {}) {
        const id = normalizeString(args.id || args.repairId);
        const status = normalizeAction(args.status || args.nextStatus, '');
        if (!id || !status) {
            return {
                status: 'invalid_tool_args',
                error: 'tool_doctor.mark_repair requires id and status'
            };
        }
        const allowed = new Set(['accepted', 'rejected', 'verified', 'failed', 'closed', 'superseded']);
        if (!allowed.has(status)) {
            return {
                status: 'invalid_tool_args',
                error: `Unsupported repair status: ${status}`
            };
        }
        const state = await this.loadRepairs();
        const repair = state.repairs.find((entry) => entry.id === id);
        if (!repair) {
            return {
                status: 'not_found',
                id
            };
        }
        repair.status = status;
        repair.updatedAt = new Date().toISOString();
        repair.note = normalizeString(args.note || args.reason || repair.note);
        repair.validationReport = args.validationReport
            ? clampText(args.validationReport, 12000)
            : repair.validationReport || '';
        repair.markedByRunId = normalizeString(args.runId || context.runId || repair.markedByRunId);
        await this.saveRepairs(state);
        this.emitGatewayEvent('tool_doctor.repair.marked', {
            id,
            status,
            tool: repair.tool
        });
        return {
            status: 'completed',
            repair
        };
    }
}

module.exports = {
    HumanClawToolDoctor,
    TOOL_DOCTOR_ACTIONS
};
