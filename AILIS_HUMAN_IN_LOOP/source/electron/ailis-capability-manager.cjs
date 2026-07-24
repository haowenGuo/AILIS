const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');
const { spawn } = require('child_process');
const { randomUUID } = require('crypto');
const { listToolContractSummaries, getToolContractPromptText } = require('./ailis-tool-contracts.cjs');
const { listAILISSkills } = require('./ailis-skills.cjs');
const { AILISToolAcquisitionGateway } = require('./ailis-tool-acquisition-gateway.cjs');

const CAPABILITY_MANAGER_ACTIONS = Object.freeze([
    'schema',
    'registry',
    'list_capabilities',
    'refresh_registry',
    'plan_install',
    'list_plans',
    'install_capability',
    'author_skill',
    'rollback',
    'execute_repair',
    'list_installations',
    'list_core_tools',
    'list_standard_tool_packs',
    'expose_standard_tool_packs',
    'search_tool_candidates',
    'plan_mcp_candidate',
    'build_smoke_profile',
    'smoke_mcp_candidate',
    'list_contract_sources',
    'compile_contract',
    'lint_contract',
    'intake_contracts',
    'list_contract_intake',
    'configure_external_auth_profile',
    'list_external_auth_profiles',
    'bulk_expose_external_tools',
    'list_exposed_external_tools',
    'execute_exposed_external_tool',
    'smoke_exposed_external_tool',
    'record_tool_outcome',
    'recommend_tools'
]);

const DEFAULT_COMMAND_TIMEOUT_MS = 120000;
const DEFAULT_INSTALL_TIMEOUT_MS = 180000;

function normalizeString(value, fallback = '') {
    if (typeof value !== 'string') {
        return fallback;
    }
    const trimmed = value.trim();
    return trimmed || fallback;
}

function normalizeAction(value, fallback = 'registry') {
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

function redactObject(value) {
    if (Array.isArray(value)) {
        return value.map(redactObject);
    }
    if (!isPlainObject(value)) {
        return value;
    }
    const result = {};
    for (const [key, entry] of Object.entries(value)) {
        if (/token|password|secret|api[_-]?key|authorization|credential|pass/i.test(key)) {
            result[key] = '__REDACTED__';
        } else {
            result[key] = redactObject(entry);
        }
    }
    return result;
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

async function pathExists(filePath) {
    try {
        await fsp.access(filePath);
        return true;
    } catch {
        return false;
    }
}

function resolveInside(root, value, label = 'path') {
    const base = path.resolve(root);
    const resolved = path.isAbsolute(String(value || ''))
        ? path.resolve(String(value || ''))
        : path.resolve(base, String(value || ''));
    const relative = path.relative(base, resolved);
    if (relative.startsWith('..') || path.isAbsolute(relative)) {
        throw new Error(`${label} is outside allowed root: ${resolved}`);
    }
    return resolved;
}

function runCommand(command, options = {}) {
    const startedAt = Date.now();
    const isWindows = process.platform === 'win32';
    return new Promise((resolve) => {
        let settled = false;
        let timedOut = false;
        const child = spawn(isWindows ? 'cmd.exe' : 'sh', isWindows ? ['/d', '/s', '/c', command] : ['-lc', command], {
            cwd: options.cwd || process.cwd(),
            env: {
                ...process.env,
                ...(options.env || {})
            },
            stdio: ['ignore', 'pipe', 'pipe'],
            windowsHide: true
        });
        let stdout = '';
        let stderr = '';
        const finish = (payload) => {
            if (settled) {
                return;
            }
            settled = true;
            clearTimeout(timer);
            resolve(payload);
        };
        const killTree = () => {
            timedOut = true;
            if (isWindows && child.pid) {
                const killer = spawn('taskkill.exe', ['/PID', String(child.pid), '/T', '/F'], {
                    stdio: 'ignore',
                    windowsHide: true
                });
                killer.on('error', () => child.kill('SIGTERM'));
                return;
            }
            child.kill('SIGTERM');
        };
        const timeoutMs = Number(options.timeoutMs || DEFAULT_COMMAND_TIMEOUT_MS);
        const timer = setTimeout(killTree, timeoutMs);
        child.stdout.on('data', (chunk) => {
            stdout += chunk.toString();
        });
        child.stderr.on('data', (chunk) => {
            stderr += chunk.toString();
        });
        child.on('close', (code, signal) => {
            finish({
                command,
                ok: code === 0 && !timedOut,
                code,
                signal,
                timedOut,
                durationMs: Date.now() - startedAt,
                stdout: stdout.slice(-12000),
                stderr: timedOut
                    ? `${stderr.slice(-11000)}\n[capability_manager] timed out after ${timeoutMs}ms`
                    : stderr.slice(-12000)
            });
        });
        child.on('error', (error) => {
            finish({
                command,
                ok: false,
                code: null,
                signal: '',
                timedOut,
                durationMs: Date.now() - startedAt,
                stdout,
                stderr: error?.message || String(error)
            });
        });
    });
}

function packageNodeModulesPath(projectRoot, packageName) {
    const parts = packageName.split('/').filter(Boolean);
    return path.join(projectRoot, 'node_modules', ...parts);
}

async function readPackageManifest(projectRoot, packageName) {
    const manifestPath = path.join(packageNodeModulesPath(projectRoot, packageName), 'package.json');
    const raw = await fsp.readFile(manifestPath, 'utf8');
    return {
        manifestPath,
        packageDir: path.dirname(manifestPath),
        manifest: JSON.parse(raw || '{}')
    };
}

function getPackageSpec(name, version = '') {
    const pkg = normalizeString(name);
    if (!pkg) {
        return '';
    }
    const ver = normalizeString(version);
    if (!ver || pkg.includes('@') && !pkg.startsWith('@')) {
        return pkg;
    }
    return `${pkg}@${ver}`;
}

function dependencyAlreadyInstalled(packageJson = {}, packageName = '') {
    return Boolean(
        packageJson.dependencies?.[packageName] ||
            packageJson.devDependencies?.[packageName] ||
            packageJson.optionalDependencies?.[packageName]
    );
}

function pickPackageBin(manifest = {}, preferredBin = '') {
    const bin = manifest.bin;
    if (preferredBin && isPlainObject(bin) && bin[preferredBin]) {
        return bin[preferredBin];
    }
    if (typeof bin === 'string') {
        return bin;
    }
    if (isPlainObject(bin)) {
        return Object.values(bin).find((entry) => typeof entry === 'string') || '';
    }
    return '';
}

function renderSkillMarkdown({
    skillId,
    label,
    description,
    when,
    triggers = [],
    mcpServerName = '',
    mcpTools = [],
    capabilityId = ''
}) {
    const triggerLines = normalizeArray(triggers)
        .map((entry) => `  - ${String(entry).replace(/\r?\n/g, ' ')}`)
        .join('\n');
    const toolLines = mcpTools
        .map((tool) => {
            const name = normalizeString(tool.name || tool.id);
            const desc = normalizeString(tool.description);
            return name ? `- ${name}${desc ? `: ${desc}` : ''}` : '';
        })
        .filter(Boolean)
        .join('\n');
    return `---
id: ${skillId}
label: ${label}
description: ${description}
when: ${when}
tools:
  - mcp_bridge
triggers:
${triggerLines || '  - MCP capability request'}
---

# ${label}

${description}

## When To Use

${when}

## MCP Server

- server: ${mcpServerName || 'unknown'}
- capability: ${capabilityId || skillId}

## Available MCP Tools

${toolLines || '- Unknown until mcp_bridge.list_tools succeeds.'}

## Operating Rules

- First call \`mcp_bridge.health_check\` if the server status is unknown or stale.
- Use \`mcp_bridge.list_tools\` before the first task so the Agent sees the current input schemas.
- Call only the smallest MCP tool needed for the task.
- Do not claim the capability succeeded unless the MCP tool result or validation output proves it.
- If the server is unavailable, explain that the capability needs repair instead of fabricating results.
`;
}

function normalizePatchPath(value = '') {
    return normalizeString(value)
        .replace(/^a\//, '')
        .replace(/^b\//, '')
        .replace(/\\/g, '/');
}

function parseUnifiedPatch(patchText = '') {
    const lines = String(patchText || '').split(/\r?\n/);
    const files = [];
    let currentFile = null;
    let currentHunk = null;
    for (const line of lines) {
        if (line.startsWith('diff --git ')) {
            currentFile = null;
            currentHunk = null;
            continue;
        }
        if (line.startsWith('--- ')) {
            const oldPath = normalizePatchPath(line.slice(4).trim());
            currentFile = {
                oldPath,
                newPath: oldPath,
                hunks: []
            };
            files.push(currentFile);
            currentHunk = null;
            continue;
        }
        if (line.startsWith('+++ ') && currentFile) {
            currentFile.newPath = normalizePatchPath(line.slice(4).trim());
            continue;
        }
        if (line.startsWith('@@ ') && currentFile) {
            const match = line.match(/^@@\s+-(\d+)(?:,(\d+))?\s+\+(\d+)(?:,(\d+))?\s+@@/);
            if (!match) {
                throw new Error(`Unsupported hunk header: ${line}`);
            }
            currentHunk = {
                oldStart: Number(match[1]),
                oldCount: Number(match[2] || 1),
                newStart: Number(match[3]),
                newCount: Number(match[4] || 1),
                oldLines: [],
                newLines: []
            };
            currentFile.hunks.push(currentHunk);
            continue;
        }
        if (!currentHunk) {
            continue;
        }
        if (line === '\\ No newline at end of file') {
            continue;
        }
        const prefix = line[0];
        const body = [' ', '+', '-'].includes(prefix) ? line.slice(1) : line;
        if (prefix === ' ') {
            currentHunk.oldLines.push(body);
            currentHunk.newLines.push(body);
        } else if (prefix === '-') {
            currentHunk.oldLines.push(body);
        } else if (prefix === '+') {
            currentHunk.newLines.push(body);
        }
    }
    return files.filter((file) => file.hunks.length);
}

function findLineSequence(lines = [], sequence = [], preferredIndex = 0) {
    if (!sequence.length) {
        return Math.max(0, Math.min(preferredIndex, lines.length));
    }
    const matchesAt = (index) => sequence.every((line, offset) => lines[index + offset] === line);
    const start = Math.max(0, Math.min(preferredIndex, lines.length - sequence.length));
    if (matchesAt(start)) {
        return start;
    }
    for (let radius = 1; radius <= Math.max(lines.length, 1); radius += 1) {
        const before = start - radius;
        if (before >= 0 && matchesAt(before)) {
            return before;
        }
        const after = start + radius;
        if (after <= lines.length - sequence.length && matchesAt(after)) {
            return after;
        }
    }
    return -1;
}

class AILISCapabilityManager {
    constructor(options = {}) {
        this.workspaceRoot = path.resolve(options.workspaceRoot || process.cwd());
        this.projectRoot = path.resolve(options.projectRoot || this.workspaceRoot);
        this.auditDir = path.resolve(options.auditDir || path.join(this.projectRoot, '.ailis-state'));
        this.stateDir = path.resolve(options.stateDir || path.join(this.auditDir, 'capabilities'));
        this.registryPath = path.join(this.stateDir, 'capability-registry.json');
        this.plansPath = path.join(this.stateDir, 'install-plans.json');
        this.installationsPath = path.join(this.stateDir, 'installations.json');
        this.backupRoot = path.join(this.stateDir, 'backups');
        this.skillRoot = path.resolve(options.skillRoot || path.join(__dirname, 'skills'));
        this.mcpManager = options.mcpManager || null;
        this.toolDoctor = options.toolDoctor || null;
        this.emitGatewayEvent = typeof options.emitGatewayEvent === 'function' ? options.emitGatewayEvent : () => {};
        this.toolAcquisitionGateway = options.toolAcquisitionGateway || new AILISToolAcquisitionGateway({
            workspaceRoot: this.workspaceRoot,
            projectRoot: this.projectRoot,
            stateDir: path.join(this.auditDir, 'tool-acquisition'),
            registryUrl: options.registryUrl,
            registryFetcher: options.registryFetcher,
            mcpManager: this.mcpManager,
            emitGatewayEvent: this.emitGatewayEvent
        });
    }

    getStatus() {
        return {
            enabled: true,
            version: 1,
            stateDir: this.stateDir,
            registryPath: this.registryPath,
            plansPath: this.plansPath,
            installationsPath: this.installationsPath,
            toolAcquisition: this.toolAcquisitionGateway?.getStatus?.() || null,
            skillRoot: this.skillRoot,
            actions: [...CAPABILITY_MANAGER_ACTIONS]
        };
    }

    async execute(args = {}, context = {}) {
        const action = normalizeAction(args.action || args.operation || args.intent, 'registry');
        try {
            if (action === 'schema') {
                return formatToolResult(this.buildSchema());
            }
            if (['registry', 'list_capabilities'].includes(action)) {
                return formatToolResult(await this.getRegistry(args));
            }
            if (action === 'refresh_registry') {
                return formatToolResult(await this.refreshRegistry(args));
            }
            if (action === 'plan_install') {
                return formatToolResult(await this.planInstall(args, context));
            }
            if (action === 'list_plans') {
                return formatToolResult(await this.listPlans(args));
            }
            if (action === 'install_capability') {
                return formatToolResult(await this.installCapability(args, context));
            }
            if (action === 'author_skill') {
                return formatToolResult(await this.authorSkill(args, context));
            }
            if (action === 'rollback') {
                return formatToolResult(await this.rollback(args, context));
            }
            if (action === 'execute_repair') {
                return formatToolResult(await this.executeRepair(args, context));
            }
            if (action === 'list_installations') {
                return formatToolResult(await this.listInstallations(args));
            }
            if (action === 'list_core_tools') {
                return formatToolResult(await this.listCoreTools(args));
            }
            if (action === 'list_standard_tool_packs') {
                return formatToolResult(await this.listStandardToolPacks(args));
            }
            if (action === 'expose_standard_tool_packs') {
                return formatToolResult(await this.exposeStandardToolPacks(args));
            }
            if (action === 'search_tool_candidates') {
                return formatToolResult(await this.searchToolCandidates(args));
            }
            if (action === 'plan_mcp_candidate') {
                return formatToolResult(await this.planMcpCandidate(args, context));
            }
            if (action === 'build_smoke_profile') {
                return formatToolResult(await this.buildSmokeProfile(args));
            }
            if (action === 'smoke_mcp_candidate') {
                return formatToolResult(await this.smokeMcpCandidate(args, context));
            }
            if (action === 'list_contract_sources') {
                return formatToolResult(await this.listContractSources(args));
            }
            if (action === 'compile_contract') {
                return formatToolResult(await this.compileContract(args));
            }
            if (action === 'lint_contract') {
                return formatToolResult(await this.lintContract(args));
            }
            if (action === 'intake_contracts') {
                return formatToolResult(await this.intakeContracts(args));
            }
            if (action === 'list_contract_intake') {
                return formatToolResult(await this.listContractIntake(args));
            }
            if (action === 'configure_external_auth_profile') {
                return formatToolResult(await this.configureExternalAuthProfile(args));
            }
            if (action === 'list_external_auth_profiles') {
                return formatToolResult(await this.listExternalAuthProfiles(args));
            }
            if (action === 'bulk_expose_external_tools') {
                return formatToolResult(await this.bulkExposeExternalTools(args));
            }
            if (action === 'list_exposed_external_tools') {
                return formatToolResult(await this.listExposedExternalTools(args));
            }
            if (action === 'execute_exposed_external_tool') {
                const result = await this.executeExposedExternalTool(args, context);
                return formatToolResult(result, result.ok === false || !['completed'].includes(result.status));
            }
            if (action === 'smoke_exposed_external_tool') {
                const result = await this.smokeExposedExternalTool(args, context);
                return formatToolResult(result, result.ok === false || !['completed'].includes(result.status));
            }
            if (action === 'record_tool_outcome') {
                return formatToolResult(await this.recordToolOutcome(args));
            }
            if (action === 'recommend_tools') {
                return formatToolResult(await this.recommendTools(args));
            }
            return formatToolResult({
                status: 'unsupported_action',
                action,
                supportedActions: [...CAPABILITY_MANAGER_ACTIONS]
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
            tool: 'capability_manager',
            contract: getToolContractPromptText('capability_manager') || '',
            responsibilities: [
                'Capability Registry: record available built-in tools, MCP servers, skills, health, and task coverage.',
                'Capability Installer: turn requested capabilities into explicit install plans with rollback and validation.',
                'Tool Acquisition Gateway: discover core tools and MCP Registry candidates without exposing unverified tools to the Agent.',
                'Standard Tool Packs: expose vetted email, document, web, academic, and media backends as contract-checked callable/non-callable tools.',
                'Contract Compiler: import mature schemas from MCP Registry, Composio, OpenAPI, LangChain/Pydantic, and Codex/OpenHands-style specs into one AILIS contract shape.',
                'Contract Linter: reject tools missing required fields, when-not-to-use guidance, examples, error recovery, or smoke profiles.',
                'External Auth Profiles: store only env-var references, base URLs, and account scope; never persist raw API keys.',
                'External Tool Exposure: bulk expose Composio/OpenAPI/MCP Registry/MCP contracts to the Agent with callable/non-callable verification metadata and execute verified callable entries through one audited auth/approval path.',
                'MCP Intake Gate: every new MCP must pass initialize/tools-list/direct-spec smoke checks before registry exposure.',
                'Task-Tool Learning Table: remember which verified tools worked for similar tasks and recommend them first next time.',
                'Skill Auto-Authoring: generate SKILL.md packages after MCP installation so Agent routing stays capability-driven.',
                'Repair Executor: apply approved repair patches, run validation, and roll back on failure.'
            ],
            actions: [...CAPABILITY_MANAGER_ACTIONS]
        };
    }

    async listCoreTools() {
        return {
            status: 'completed',
            coreTools: this.toolAcquisitionGateway.listCoreTools()
        };
    }

    async listStandardToolPacks(args = {}) {
        return {
            status: 'completed',
            standardToolPacks: this.toolAcquisitionGateway.listStandardToolPacks(args)
        };
    }

    async exposeStandardToolPacks(args = {}) {
        return await this.toolAcquisitionGateway.exposeStandardToolPacks(args);
    }

    async searchToolCandidates(args = {}) {
        return await this.toolAcquisitionGateway.searchCandidates(args);
    }

    async planMcpCandidate(args = {}, context = {}) {
        const planned = await this.toolAcquisitionGateway.planMcpCandidate(args);
        if (planned.status !== 'completed') {
            return planned;
        }
        const plan = await this.planInstall(planned.planArgs, context);
        return {
            status: plan.status,
            candidate: planned.candidate,
            smokeProfile: planned.smokeProfile,
            plan: plan.plan,
            plansPath: plan.plansPath
        };
    }

    async buildSmokeProfile(args = {}) {
        return await this.toolAcquisitionGateway.buildSmokeProfile(args);
    }

    async smokeMcpCandidate(args = {}, context = {}) {
        return await this.toolAcquisitionGateway.smokeMcpCandidate({
            ...args,
            approved: args.approved === true || context.approved === true
        });
    }

    async listContractSources() {
        return {
            status: 'completed',
            sources: this.toolAcquisitionGateway.listContractSources()
        };
    }

    async compileContract(args = {}) {
        return this.toolAcquisitionGateway.compileContract(args);
    }

    async lintContract(args = {}) {
        return this.toolAcquisitionGateway.lintContract(args);
    }

    async intakeContracts(args = {}) {
        return await this.toolAcquisitionGateway.intakeContracts(args);
    }

    async listContractIntake(args = {}) {
        return await this.toolAcquisitionGateway.listContractIntake(args);
    }

    async configureExternalAuthProfile(args = {}) {
        return await this.toolAcquisitionGateway.configureExternalAuthProfile(args);
    }

    async listExternalAuthProfiles(args = {}) {
        return await this.toolAcquisitionGateway.listExternalAuthProfiles(args);
    }

    async bulkExposeExternalTools(args = {}) {
        return await this.toolAcquisitionGateway.bulkExposeExternalTools(args);
    }

    async listExposedExternalTools(args = {}) {
        return await this.toolAcquisitionGateway.listExposedExternalTools(args);
    }

    async searchExternalToolEntries(args = {}) {
        return await this.toolAcquisitionGateway.searchExternalToolEntries(args);
    }

    async executeExposedExternalTool(args = {}, context = {}) {
        return await this.toolAcquisitionGateway.executeExposedExternalTool(args, context);
    }

    async executeVirtualExternalTool(toolId = '', params = {}, context = {}) {
        return await this.toolAcquisitionGateway.executeVirtualExternalTool(toolId, params, context);
    }

    async smokeExposedExternalTool(args = {}, context = {}) {
        return await this.toolAcquisitionGateway.smokeExposedExternalTool(args, context);
    }

    async recordToolOutcome(args = {}) {
        return await this.toolAcquisitionGateway.recordToolOutcome(args);
    }

    async recommendTools(args = {}) {
        return await this.toolAcquisitionGateway.recommendTools(args);
    }

    async loadRegistry() {
        const state = await readJsonFile(this.registryPath, null);
        if (state && state.version === 1 && Array.isArray(state.capabilities)) {
            return state;
        }
        return {
            version: 1,
            createdAt: new Date().toISOString(),
            updatedAt: '',
            capabilities: []
        };
    }

    async saveRegistry(state) {
        const next = {
            version: 1,
            createdAt: state.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            capabilities: Array.isArray(state.capabilities) ? state.capabilities : []
        };
        await writeJsonFileAtomic(this.registryPath, next);
        return next;
    }

    async loadPlans() {
        const state = await readJsonFile(this.plansPath, null);
        if (state && state.version === 1 && Array.isArray(state.plans)) {
            return state;
        }
        return {
            version: 1,
            createdAt: new Date().toISOString(),
            updatedAt: '',
            plans: []
        };
    }

    async savePlans(state) {
        const next = {
            version: 1,
            createdAt: state.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            plans: Array.isArray(state.plans) ? state.plans : []
        };
        await writeJsonFileAtomic(this.plansPath, next);
        return next;
    }

    async loadInstallations() {
        const state = await readJsonFile(this.installationsPath, null);
        if (state && state.version === 1 && Array.isArray(state.installations)) {
            return state;
        }
        return {
            version: 1,
            createdAt: new Date().toISOString(),
            updatedAt: '',
            installations: []
        };
    }

    async saveInstallations(state) {
        const next = {
            version: 1,
            createdAt: state.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            installations: Array.isArray(state.installations) ? state.installations : []
        };
        await writeJsonFileAtomic(this.installationsPath, next);
        return next;
    }

    async getRegistry(args = {}) {
        const state = await this.loadRegistry();
        const type = normalizeString(args.type);
        const query = normalizeString(args.query).toLowerCase();
        const capabilities = state.capabilities
            .filter((capability) => !type || capability.type === type)
            .filter((capability) => !query || JSON.stringify(capability).toLowerCase().includes(query));
        return {
            status: 'completed',
            registryPath: this.registryPath,
            updatedAt: state.updatedAt || '',
            capabilityCount: capabilities.length,
            capabilities
        };
    }

    async refreshRegistry(args = {}) {
        const includeHealth = args.includeHealth !== false;
        const capabilities = [];
        for (const contract of listToolContractSummaries()) {
            capabilities.push({
                id: `tool:${contract.id}`,
                type: 'tool',
                label: contract.id,
                source: 'builtin_tool_contract',
                health: 'available',
                risk: contract.risk,
                mutates: contract.mutates,
                approval: contract.approval,
                canDo: [contract.experience?.userFacingVerb || contract.id],
                toolIds: [contract.id],
                actions: contract.actions || [],
                updatedAt: new Date().toISOString()
            });
        }
        for (const skill of listAILISSkills()) {
            capabilities.push({
                id: `skill:${skill.id}`,
                type: 'skill',
                label: skill.label || skill.id,
                source: skill.source || 'skill',
                sourcePath: skill.sourcePath || '',
                health: skill.source === 'skill_file' ? 'available' : 'fallback',
                canDo: [skill.when || skill.description || skill.id].filter(Boolean),
                toolIds: skill.tools || [],
                updatedAt: new Date().toISOString()
            });
        }
        for (const core of this.toolAcquisitionGateway.listCoreTools()) {
            capabilities.push({
                id: core.id,
                type: 'core_tool_bundle',
                label: core.label,
                source: core.source,
                health: core.health,
                category: core.category,
                canDo: [core.description, ...(core.keywords || [])].filter(Boolean).slice(0, 12),
                toolIds: core.toolIds || [],
                availableToolIds: core.availableToolIds || [],
                skillIds: core.skillIds || [],
                smokeProfile: core.smokeProfile,
                updatedAt: new Date().toISOString()
            });
        }
        const externalExposure = await this.toolAcquisitionGateway.listExposedExternalTools({
            limit: Number(args.externalLimit || 50)
        }).catch(() => null);
        for (const exposure of externalExposure?.exposures || []) {
            capabilities.push({
                id: exposure.id,
                type: exposure.callable ? 'external_callable_tool' : 'external_contract_tool',
                label: exposure.title || exposure.name || exposure.id,
                source: exposure.source?.type || 'external_tool_exposure',
                health: exposure.callable ? 'callable' : 'visible_not_callable',
                risk: exposure.risk,
                mutates: exposure.mutates,
                approval: exposure.approval,
                callable: exposure.callable,
                verified: exposure.verified,
                verification: exposure.verification,
                toolIds: exposure.toolId ? [exposure.toolId] : [],
                canDo: [
                    exposure.contract?.purpose,
                    exposure.callableReason,
                    ...(exposure.notes || [])
                ].filter(Boolean).slice(0, 8),
                modelFacing: exposure.modelFacing,
                updatedAt: exposure.exposedAt || new Date().toISOString()
            });
        }
        if (this.mcpManager?.listServers) {
            const servers = this.mcpManager.listServers();
            let health = [];
            if (includeHealth && servers.length && this.mcpManager.healthCheck) {
                health = await this.mcpManager.healthCheck(
                    normalizeString(args.server || args.serverId),
                    args.timeoutMs || 5000
                );
            }
            const healthByServer = new Map(health.map((entry) => [entry.server, entry]));
            for (const server of servers) {
                let tools = [];
                if (includeHealth && this.mcpManager.listTools) {
                    const listed = await this.mcpManager.listTools(server.name, args.timeoutMs || 15000).catch(() => []);
                    tools = listed?.[0]?.tools || [];
                }
                const serverHealth = healthByServer.get(server.name);
                capabilities.push({
                    id: `mcp:${server.name}`,
                    type: 'mcp_server',
                    label: server.name,
                    source: 'mcp_config',
                    health: serverHealth ? (serverHealth.ok ? 'healthy' : 'degraded') : server.status || 'configured',
                    lastHealthCheck: serverHealth || null,
                    mcpServerName: server.name,
                    transport: server.transport,
                    command: server.command,
                    url: server.url,
                    canDo: tools.map((tool) => normalizeString(tool.description || tool.name)).filter(Boolean).slice(0, 12),
                    mcpTools: tools.map((tool) => ({
                        name: tool.name || tool.id,
                        description: tool.description || '',
                        inputSchema: tool.inputSchema || tool.input_schema || {}
                    })),
                    updatedAt: new Date().toISOString()
                });
            }
        }
        const previous = await this.loadRegistry();
        const installed = previous.capabilities.filter((entry) => entry.source === 'capability_installer');
        const deduped = new Map();
        for (const capability of [...capabilities, ...installed]) {
            deduped.set(capability.id, capability);
        }
        const saved = await this.saveRegistry({
            ...previous,
            capabilities: [...deduped.values()].sort((a, b) => a.id.localeCompare(b.id))
        });
        this.emitGatewayEvent('capability.registry.updated', {
            capabilityCount: saved.capabilities.length,
            registryPath: this.registryPath
        });
        return {
            status: 'completed',
            registryPath: this.registryPath,
            capabilityCount: saved.capabilities.length,
            capabilities: saved.capabilities
        };
    }

    async planInstall(args = {}, context = {}) {
        const requested = normalizeString(args.request || args.capability || args.name || args.title);
        const capabilityId = safeSegment(args.capabilityId || args.id || requested || args.npmPackage || args.mcpServerName, 'capability');
        const sourceKind = normalizeAction(args.sourceKind || args.source || (args.npmPackage ? 'npm_mcp' : args.githubRepo ? 'github_mcp' : args.mcpConfig ? 'mcp_config' : 'local_skill'), 'local_skill');
        const mcpServerName = safeSegment(args.mcpServerName || args.server || capabilityId, capabilityId);
        const skillId = safeSegment(args.skillId || `${capabilityId}_skill`, `${capabilityId}_skill`);
        const risk = normalizeString(args.risk, sourceKind.includes('github') ? 'high' : 'medium');
        const validationCommands = normalizeArray(args.validationCommands || args.validate || [
            'pnpm ailis:validate-harness',
            'pnpm test:ailis-skills'
        ]).map(String);
        const plan = {
            id: normalizeString(args.planId, `install-${capabilityId}-${randomUUID().slice(0, 8)}`),
            status: 'planned',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            requested,
            capabilityId,
            label: normalizeString(args.label || args.displayName, requested || capabilityId),
            description: normalizeString(args.description, requested || capabilityId),
            sourceKind,
            risk,
            requiresApproval: true,
            requestedByRunId: normalizeString(args.runId || context.runId),
            source: {
                npmPackage: normalizeString(args.npmPackage),
                version: normalizeString(args.version),
                githubRepo: normalizeString(args.githubRepo),
                localPath: normalizeString(args.localPath),
                mcpConfig: cloneJson(args.mcpConfig || args.serverConfig || null)
            },
            mcp: {
                serverName: mcpServerName,
                args: normalizeArray(args.mcpArgs).map(String),
                preferredBin: normalizeString(args.bin || args.preferredBin)
            },
            skill: {
                id: skillId,
                label: normalizeString(args.skillLabel || args.label, `${capabilityId} Skill`),
                description: normalizeString(args.skillDescription || args.description, `Capability package for ${capabilityId}.`),
                when: normalizeString(args.when, `用户需要 ${requested || capabilityId} 能力时。`),
                triggers: normalizeArray(args.triggers || requested || capabilityId).map(String)
            },
            steps: this.buildInstallSteps({
                sourceKind,
                npmPackage: args.npmPackage,
                githubRepo: args.githubRepo,
                mcpConfig: args.mcpConfig || args.serverConfig,
                skillId,
                validationCommands
            }),
            rollback: [
                'restore backed up package/config/skill files',
                'unregister MCP server from runtime manager',
                'mark installation failed or rolled_back'
            ],
            validationCommands
        };
        const plans = await this.loadPlans();
        plans.plans.push(plan);
        await this.savePlans(plans);
        return {
            status: 'completed',
            plan,
            plansPath: this.plansPath
        };
    }

    buildInstallSteps({ sourceKind, npmPackage, githubRepo, mcpConfig, skillId, validationCommands }) {
        const steps = [
            { id: 'backup_state', title: 'Backup package, lock, MCP config, and target skill file.', mutates: false }
        ];
        if (sourceKind.includes('github') && githubRepo) {
            steps.push({ id: 'clone_github', title: 'Clone GitHub source into capability cache.', mutates: true });
        }
        if (sourceKind.includes('npm') && npmPackage) {
            steps.push({ id: 'install_npm_package', title: `Install npm package ${npmPackage}.`, mutates: true });
        }
        if (mcpConfig || sourceKind.includes('mcp')) {
            steps.push({ id: 'register_mcp_server', title: 'Register MCP server config and persist it.', mutates: true });
            steps.push({ id: 'validate_mcp_server', title: 'Start MCP server, run health check, and import tool schemas.', mutates: false });
        }
        if (skillId) {
            steps.push({ id: 'author_skill', title: `Generate or update SKILL.md for ${skillId}.`, mutates: true });
        }
        if (validationCommands.length) {
            steps.push({ id: 'run_validation', title: 'Run validation commands.', mutates: false });
        }
        steps.push({ id: 'refresh_registry', title: 'Refresh Capability Registry.', mutates: true });
        return steps;
    }

    async listPlans(args = {}) {
        const state = await this.loadPlans();
        const status = normalizeString(args.status);
        const plans = state.plans
            .filter((plan) => !status || plan.status === status)
            .slice(-(Number(args.limit || 50)));
        return {
            status: 'completed',
            plansPath: this.plansPath,
            planCount: plans.length,
            plans
        };
    }

    async findPlan(args = {}) {
        if (args.plan && isPlainObject(args.plan)) {
            return cloneJson(args.plan);
        }
        const planId = normalizeString(args.planId || args.id);
        const plans = await this.loadPlans();
        const plan = plans.plans.find((entry) => entry.id === planId);
        if (plan) {
            return cloneJson(plan);
        }
        if (args.request || args.capability || args.name || args.npmPackage || args.mcpConfig || args.serverConfig) {
            const result = await this.planInstall(args);
            return result.plan;
        }
        throw new Error('install_capability requires planId or install request fields');
    }

    async installCapability(args = {}, context = {}) {
        const plan = await this.findPlan(args);
        if (args.dryRun === true) {
            return {
                status: 'planned',
                dryRun: true,
                plan
            };
        }
        if (args.approved !== true && context.approved !== true) {
            return {
                status: 'needs_approval',
                plan,
                approvalText: `Install capability ${plan.label || plan.capabilityId}? This may modify package files, MCP config, and Skill files.`
            };
        }
        const installation = {
            id: `cap-install-${plan.capabilityId}-${randomUUID().slice(0, 8)}`,
            planId: plan.id,
            capabilityId: plan.capabilityId,
            startedAt: new Date().toISOString(),
            completedAt: '',
            status: 'running',
            steps: [],
            backups: [],
            validationResults: [],
            registryEntry: null
        };
        try {
            installation.backups = await this.backupInstallTargets(plan, installation.id);
            await this.executeInstallPlan(plan, installation, args);
            installation.status = 'completed';
            installation.completedAt = new Date().toISOString();
            await this.recordInstallation(installation);
            await this.markPlanStatus(plan.id, 'installed', { installationId: installation.id });
            this.emitGatewayEvent('capability.installed', {
                capabilityId: plan.capabilityId,
                installationId: installation.id
            });
            return {
                status: 'completed',
                installation,
                registry: await this.refreshRegistry({ includeHealth: true, timeoutMs: args.timeoutMs || 15000 })
            };
        } catch (error) {
            installation.status = 'failed';
            installation.error = error?.message || String(error);
            installation.completedAt = new Date().toISOString();
            if (installation.mcpServerName && this.mcpManager?.removeServer) {
                this.mcpManager.removeServer(installation.mcpServerName, { persist: true });
            }
            const rollback = await this.restoreBackups(installation.backups);
            installation.rollback = rollback;
            await this.recordInstallation(installation);
            await this.markPlanStatus(plan.id, 'failed', { installationId: installation.id, error: installation.error });
            return {
                status: 'failed',
                error: installation.error,
                installation,
                rollback
            };
        }
    }

    async executeInstallPlan(plan, installation, args = {}) {
        if (plan.source.githubRepo) {
            const clone = await this.cloneGithubSource(plan, args);
            installation.steps.push({ id: 'clone_github', status: clone.ok ? 'completed' : 'failed', result: clone });
            if (!clone.ok) {
                throw new Error(`GitHub clone failed: ${clone.stderr || clone.stdout || 'unknown error'}`);
            }
        }
        if (plan.source.npmPackage) {
            const install = await this.ensureNpmPackage(plan);
            installation.steps.push({ id: 'install_npm_package', status: install.ok ? 'completed' : 'failed', result: install });
            if (!install.ok) {
                throw new Error(`npm install failed: ${install.stderr || install.stdout || 'unknown error'}`);
            }
        }
        let mcpTools = [];
        if (plan.source.mcpConfig || plan.source.npmPackage || plan.sourceKind.includes('mcp')) {
            const config = await this.resolveMcpConfig(plan);
            if (!this.mcpManager?.registerServers) {
                throw new Error('Capability Manager requires mcpManager to register MCP servers');
            }
            const registered = this.mcpManager.registerServers({ [plan.mcp.serverName]: config }, { persist: true });
            installation.mcpServerName = plan.mcp.serverName;
            installation.steps.push({
                id: 'register_mcp_server',
                status: 'completed',
                result: { registered, config: redactObject(config) }
            });
            const health = await this.mcpManager.healthCheck(plan.mcp.serverName, args.timeoutMs || 30000);
            installation.steps.push({
                id: 'validate_mcp_server',
                status: health.every((entry) => entry.ok) ? 'completed' : 'failed',
                result: health
            });
            if (!health.every((entry) => entry.ok)) {
                throw new Error(`MCP health check failed for ${plan.mcp.serverName}`);
            }
            const listed = await this.mcpManager.listTools(plan.mcp.serverName, args.timeoutMs || 30000);
            mcpTools = listed?.[0]?.tools || [];
        }
        const skill = await this.writeSkillForPlan(plan, mcpTools);
        installation.steps.push({
            id: 'author_skill',
            status: 'completed',
            result: skill
        });
        for (const command of plan.validationCommands || []) {
            const result = await runCommand(command, {
                cwd: this.projectRoot,
                timeoutMs: args.validationTimeoutMs || DEFAULT_COMMAND_TIMEOUT_MS
            });
            installation.validationResults.push(result);
            if (!result.ok) {
                throw new Error(`Validation failed: ${command}`);
            }
        }
        installation.registryEntry = {
            id: `installed:${plan.capabilityId}`,
            type: 'installed_capability',
            label: plan.label,
            source: 'capability_installer',
            health: 'healthy',
            capabilityId: plan.capabilityId,
            mcpServerName: plan.mcp.serverName,
            skillId: plan.skill.id,
            canDo: [plan.description, plan.skill.when].filter(Boolean),
            installedAt: new Date().toISOString(),
            installationId: installation.id
        };
        await this.upsertRegistryEntry(installation.registryEntry);
    }

    async backupInstallTargets(plan, installationId) {
        const backupDir = path.join(this.backupRoot, safeSegment(installationId));
        const targets = [
            path.join(this.projectRoot, 'package.json'),
            path.join(this.projectRoot, 'pnpm-lock.yaml')
        ];
        if (this.mcpManager?.configPath) {
            targets.push(this.mcpManager.configPath);
        }
        targets.push(path.join(this.skillRoot, plan.skill.id, 'SKILL.md'));
        const backups = [];
        for (const target of targets) {
            const resolved = path.resolve(target);
            const existed = await pathExists(resolved);
            const backupPath = path.join(backupDir, safeSegment(path.relative(this.projectRoot, resolved) || path.basename(resolved)));
            if (existed) {
                await fsp.mkdir(path.dirname(backupPath), { recursive: true });
                await fsp.copyFile(resolved, backupPath);
            }
            backups.push({ path: resolved, existed, backupPath: existed ? backupPath : '' });
        }
        return backups;
    }

    async restoreBackups(backups = []) {
        const restored = [];
        for (const backup of backups) {
            try {
                if (backup.existed && backup.backupPath) {
                    await fsp.mkdir(path.dirname(backup.path), { recursive: true });
                    await fsp.copyFile(backup.backupPath, backup.path);
                    restored.push({ path: backup.path, status: 'restored' });
                } else if (!backup.existed && await pathExists(backup.path)) {
                    await fsp.rm(backup.path, { force: true });
                    restored.push({ path: backup.path, status: 'removed_created_file' });
                } else {
                    restored.push({ path: backup.path, status: 'unchanged' });
                }
            } catch (error) {
                restored.push({ path: backup.path, status: 'restore_failed', error: error?.message || String(error) });
            }
        }
        return restored;
    }

    async ensureNpmPackage(plan) {
        const packageName = plan.source.npmPackage;
        const packageJsonPath = path.join(this.projectRoot, 'package.json');
        const packageJson = JSON.parse(await fsp.readFile(packageJsonPath, 'utf8'));
        if (dependencyAlreadyInstalled(packageJson, packageName)) {
            return {
                ok: true,
                skipped: true,
                command: '',
                stdout: `${packageName} already present in package.json`,
                stderr: '',
                durationMs: 0
            };
        }
        const spec = getPackageSpec(packageName, plan.source.version);
        return await runCommand(`pnpm add -D ${spec}`, {
            cwd: this.projectRoot,
            timeoutMs: DEFAULT_INSTALL_TIMEOUT_MS
        });
    }

    async resolveMcpConfig(plan) {
        if (plan.source.mcpConfig) {
            return cloneJson(plan.source.mcpConfig);
        }
        if (!plan.source.npmPackage) {
            throw new Error('Cannot resolve MCP config without mcpConfig or npmPackage');
        }
        const { manifest, packageDir } = await readPackageManifest(this.projectRoot, plan.source.npmPackage);
        const bin = pickPackageBin(manifest, plan.mcp.preferredBin);
        if (!bin) {
            throw new Error(`Package ${plan.source.npmPackage} does not expose a bin entry`);
        }
        return {
            transport: 'stdio',
            command: process.execPath,
            args: [
                path.join(packageDir, bin),
                ...normalizeArray(plan.mcp.args).map(String)
            ],
            cwd: this.projectRoot,
            timeoutMs: 30000
        };
    }

    async cloneGithubSource(plan, args = {}) {
        const repo = normalizeString(plan.source.githubRepo);
        if (!repo) {
            return { ok: true, skipped: true };
        }
        const target = path.join(this.stateDir, 'sources', safeSegment(plan.capabilityId));
        if (await pathExists(path.join(target, '.git'))) {
            return { ok: true, skipped: true, target };
        }
        await fsp.mkdir(path.dirname(target), { recursive: true });
        return await runCommand(`git clone --depth 1 --filter=blob:none ${repo} "${target}"`, {
            cwd: this.projectRoot,
            timeoutMs: args.timeoutMs || DEFAULT_INSTALL_TIMEOUT_MS
        });
    }

    async writeSkillForPlan(plan, mcpTools = []) {
        return await this.writeSkill({
            skillId: plan.skill.id,
            label: plan.skill.label,
            description: plan.skill.description,
            when: plan.skill.when,
            triggers: plan.skill.triggers,
            mcpServerName: plan.mcp.serverName,
            mcpTools,
            capabilityId: plan.capabilityId
        });
    }

    async writeSkill(args = {}) {
        const skillId = safeSegment(args.skillId || args.id || args.capabilityId, 'capability_skill');
        const targetDir = path.join(this.skillRoot, skillId);
        const targetPath = path.join(targetDir, 'SKILL.md');
        await fsp.mkdir(targetDir, { recursive: true });
        const markdown = normalizeString(args.markdown) || renderSkillMarkdown({
            skillId,
            label: normalizeString(args.label, skillId),
            description: normalizeString(args.description, `Capability package for ${skillId}.`),
            when: normalizeString(args.when, `用户需要 ${skillId} 能力时。`),
            triggers: normalizeArray(args.triggers || skillId).map(String),
            mcpServerName: normalizeString(args.mcpServerName || args.server),
            mcpTools: normalizeArray(args.mcpTools),
            capabilityId: normalizeString(args.capabilityId, skillId)
        });
        await fsp.writeFile(targetPath, markdown, 'utf8');
        return {
            status: 'completed',
            skillId,
            path: targetPath
        };
    }

    async authorSkill(args = {}, context = {}) {
        if (args.approved !== true && context.approved !== true) {
            return {
                status: 'needs_approval',
                approvalText: 'Generate or update a local SKILL.md package?',
                skillId: safeSegment(args.skillId || args.id || args.capabilityId, 'capability_skill')
            };
        }
        const result = await this.writeSkill(args);
        await this.refreshRegistry({ includeHealth: false });
        return result;
    }

    async upsertRegistryEntry(entry) {
        const state = await this.loadRegistry();
        const next = state.capabilities.filter((capability) => capability.id !== entry.id);
        next.push(entry);
        await this.saveRegistry({ ...state, capabilities: next.sort((a, b) => a.id.localeCompare(b.id)) });
    }

    async recordInstallation(installation) {
        const state = await this.loadInstallations();
        state.installations.push(installation);
        await this.saveInstallations(state);
    }

    async listInstallations(args = {}) {
        const state = await this.loadInstallations();
        const status = normalizeString(args.status);
        const installations = state.installations
            .filter((entry) => !status || entry.status === status)
            .slice(-(Number(args.limit || 50)));
        return {
            status: 'completed',
            installationsPath: this.installationsPath,
            installationCount: installations.length,
            installations
        };
    }

    async markPlanStatus(planId, status, patch = {}) {
        const state = await this.loadPlans();
        const plan = state.plans.find((entry) => entry.id === planId);
        if (plan) {
            plan.status = status;
            plan.updatedAt = new Date().toISOString();
            Object.assign(plan, patch);
            await this.savePlans(state);
        }
    }

    async rollback(args = {}, context = {}) {
        if (args.approved !== true && context.approved !== true) {
            return {
                status: 'needs_approval',
                approvalText: 'Rollback an installed capability by restoring backed up files?'
            };
        }
        const installationId = normalizeString(args.installationId || args.id);
        const state = await this.loadInstallations();
        const installation = state.installations.find((entry) => entry.id === installationId);
        if (!installation) {
            return {
                status: 'not_found',
                installationId
            };
        }
        if (installation.mcpServerName && this.mcpManager?.removeServer) {
            this.mcpManager.removeServer(installation.mcpServerName, { persist: false });
        }
        const rollback = await this.restoreBackups(installation.backups || []);
        installation.status = 'rolled_back';
        installation.rolledBackAt = new Date().toISOString();
        installation.rollback = rollback;
        await this.saveInstallations(state);
        await this.refreshRegistry({ includeHealth: false });
        return {
            status: 'completed',
            installation,
            rollback
        };
    }

    async loadRepair(args = {}) {
        if (args.repair && isPlainObject(args.repair)) {
            return cloneJson(args.repair);
        }
        const repairId = normalizeString(args.repairId || args.id);
        if (!repairId) {
            return null;
        }
        const repairsPath = path.join(this.auditDir, 'tool-doctor', 'repair-proposals.json');
        const state = await readJsonFile(repairsPath, null);
        return state?.repairs?.find((repair) => repair.id === repairId) || null;
    }

    async applyBuiltinUnifiedPatch(patchText, options = {}) {
        const reverse = options.reverse === true;
        const dryRun = options.dryRun === true;
        const files = parseUnifiedPatch(patchText);
        if (!files.length) {
            const error = new Error('No supported unified-diff file hunks found');
            error.status = 'unsupported_patch';
            throw error;
        }
        const touched = [];
        for (const file of files) {
            if (file.oldPath === '/dev/null' || file.newPath === '/dev/null') {
                const error = new Error('Create/delete file patches require git fallback');
                error.status = 'unsupported_patch';
                throw error;
            }
            const patchPath = reverse ? file.newPath : file.oldPath;
            const targetPath = resolveInside(this.workspaceRoot, patchPath, 'patch target');
            const text = await fsp.readFile(targetPath, 'utf8');
            const lines = text.split(/\r?\n/);
            let searchOffset = 0;
            for (const hunk of file.hunks) {
                const expected = reverse ? hunk.newLines : hunk.oldLines;
                const replacement = reverse ? hunk.oldLines : hunk.newLines;
                const preferred = Math.max(0, (reverse ? hunk.newStart : hunk.oldStart) - 1 + searchOffset);
                const index = findLineSequence(lines, expected, preferred);
                if (index < 0) {
                    const error = new Error(`Patch hunk did not match ${patchPath} near line ${preferred + 1}`);
                    error.status = 'patch_mismatch';
                    throw error;
                }
                if (!dryRun) {
                    lines.splice(index, expected.length, ...replacement);
                    searchOffset += replacement.length - expected.length;
                }
            }
            if (!dryRun) {
                await fsp.writeFile(targetPath, lines.join('\n'), 'utf8');
            }
            touched.push({
                path: targetPath,
                hunks: file.hunks.length
            });
        }
        return {
            ok: true,
            engine: 'builtin_unified_diff',
            dryRun,
            reverse,
            files: touched
        };
    }

    async checkRepairPatch(candidateDiff, patchFile, args = {}) {
        try {
            return await this.applyBuiltinUnifiedPatch(candidateDiff, { dryRun: true });
        } catch (error) {
            const builtin = {
                ok: false,
                engine: 'builtin_unified_diff',
                status: error.status || 'patch_rejected',
                error: error?.message || String(error)
            };
            if (builtin.status !== 'unsupported_patch' || args.allowGitFallback !== true) {
                return builtin;
            }
            const gitCheck = await runCommand(`git apply --check "${patchFile}"`, {
                cwd: this.workspaceRoot,
                timeoutMs: Math.min(Number(args.timeoutMs || 30000), 30000)
            });
            return {
                ...gitCheck,
                engine: 'git_apply',
                fallbackFrom: builtin
            };
        }
    }

    async applyRepairPatch(candidateDiff, patchFile, engine, args = {}) {
        if (engine === 'builtin_unified_diff') {
            return await this.applyBuiltinUnifiedPatch(candidateDiff, { dryRun: false });
        }
        return await runCommand(`git apply "${patchFile}"`, {
            cwd: this.workspaceRoot,
            timeoutMs: Math.min(Number(args.timeoutMs || 30000), 30000)
        });
    }

    async rollbackRepairPatch(candidateDiff, patchFile, engine, args = {}) {
        if (engine === 'builtin_unified_diff') {
            return await this.applyBuiltinUnifiedPatch(candidateDiff, { dryRun: false, reverse: true })
                .catch((error) => ({
                    ok: false,
                    engine: 'builtin_unified_diff',
                    status: error.status || 'rollback_failed',
                    error: error?.message || String(error)
                }));
        }
        return await runCommand(`git apply -R "${patchFile}"`, {
            cwd: this.workspaceRoot,
            timeoutMs: Math.min(Number(args.timeoutMs || 30000), 30000)
        });
    }

    async executeRepair(args = {}, context = {}) {
        const repair = await this.loadRepair(args);
        const candidatePatchPath = normalizeString(args.candidatePatchPath || args.patchPath || repair?.candidatePatchPath);
        let candidateDiff = normalizeString(args.candidateDiff || repair?.candidateDiff);
        if (candidatePatchPath) {
            const patchPath = resolveInside(this.workspaceRoot, candidatePatchPath, 'candidatePatchPath');
            candidateDiff = await fsp.readFile(patchPath, 'utf8');
        }
        if (!candidateDiff) {
            return {
                status: 'invalid_tool_args',
                error: 'execute_repair requires candidateDiff, candidatePatchPath, or repairId with patch data'
            };
        }
        const patchFile = path.join(this.stateDir, 'repairs', `${safeSegment(repair?.id || args.repairId || 'repair')}-${Date.now()}.patch`);
        await fsp.mkdir(path.dirname(patchFile), { recursive: true });
        await fsp.writeFile(patchFile, candidateDiff, 'utf8');
        const check = await this.checkRepairPatch(candidateDiff, patchFile, args);
        if (!check.ok) {
            return {
                status: 'patch_rejected',
                patchFile,
                check
            };
        }
        if (args.dryRun === true) {
            return {
                status: 'validated',
                dryRun: true,
                patchFile,
                check
            };
        }
        if (args.approved !== true && context.approved !== true) {
            return {
                status: 'needs_approval',
                patchFile,
                approvalText: 'Apply approved self-repair patch and run validation?'
            };
        }
        const apply = await this.applyRepairPatch(candidateDiff, patchFile, check.engine, args);
        if (!apply.ok) {
            return {
                status: 'apply_failed',
                patchFile,
                apply
            };
        }
        const validationCommands = normalizeArray(args.validationCommands || repair?.validationCommands || []).map(String);
        const validationResults = [];
        for (const command of validationCommands) {
            const result = await runCommand(command, {
                cwd: this.workspaceRoot,
                timeoutMs: args.validationTimeoutMs || DEFAULT_COMMAND_TIMEOUT_MS
            });
            validationResults.push(result);
            if (!result.ok) {
                const reverse = await this.rollbackRepairPatch(candidateDiff, patchFile, check.engine, args);
                return {
                    status: 'validation_failed_rolled_back',
                    patchFile,
                    failedCommand: command,
                    validationResults,
                    rollback: reverse
                };
            }
        }
        if (this.toolDoctor?.execute && repair?.id) {
            await this.toolDoctor.execute({
                action: 'mark_repair',
                id: repair.id,
                status: 'verified',
                validationReport: JSON.stringify(validationResults, null, 2)
            }, context);
        }
        await this.refreshRegistry({ includeHealth: false });
        return {
            status: 'completed',
            patchFile,
            apply,
            validationResults
        };
    }
}

module.exports = {
    AILISCapabilityManager,
    CAPABILITY_MANAGER_ACTIONS
};
