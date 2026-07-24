const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');
const { randomUUID } = require('crypto');
const { getToolContractPromptText } = require('./ailis-tool-contracts.cjs');

const SELF_DEBUGGER_ACTIONS = Object.freeze([
    'schema',
    'open_case',
    'create_case',
    'list_cases',
    'get_case',
    'collect_evidence',
    'diagnose',
    'propose_patch',
    'validate_patch',
    'apply_patch',
    'run_loop',
    'mark_case',
    'close_case'
]);

const DEFAULT_MAX_FILE_CHARS = 18000;
const DEFAULT_MAX_TRANSCRIPT_ITEMS = 80;
const DEFAULT_MAX_LOG_CHARS = 20000;

function normalizeString(value, fallback = '') {
    if (typeof value !== 'string') {
        return fallback;
    }
    const trimmed = value.trim();
    return trimmed || fallback;
}

function normalizeAction(value, fallback = 'open_case') {
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

function safeSegment(value, fallback = 'case') {
    return normalizeString(value, fallback)
        .replace(/[^a-zA-Z0-9._-]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 90) || fallback;
}

function clampText(value, maxChars = DEFAULT_MAX_FILE_CHARS) {
    const text = typeof value === 'string' ? value : JSON.stringify(value || '', null, 2);
    if (text.length <= maxChars) {
        return text;
    }
    return `${text.slice(0, maxChars)}\n...[truncated ${text.length - maxChars} chars]`;
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

function redactText(text = '') {
    return String(text || '')
        .replace(/(api[_-]?key|token|password|secret|authorization|credential)(["'\s:=]+)([^\s"',}]+)/gi, '$1$2__REDACTED__')
        .replace(/Bearer\s+[A-Za-z0-9._~+/=-]+/g, 'Bearer __REDACTED__');
}

function inferValidationCommands({ affectedCapability = '', sourceHints = [] } = {}) {
    const cap = normalizeString(affectedCapability).toLowerCase();
    const files = normalizeArray(sourceHints).join(' ').toLowerCase();
    if (cap.includes('vision') || files.includes('vision')) {
        return ['pnpm test:ailis-agent', 'pnpm ailis:tool-doctor:plan'];
    }
    if (cap.includes('mcp') || files.includes('mcp')) {
        return ['pnpm ailis:mcp-soak', 'pnpm test:ailis-runtime'];
    }
    if (cap.includes('capability') || files.includes('capability')) {
        return ['pnpm test:ailis-capability-manager', 'pnpm ailis:tool-doctor:plan'];
    }
    if (cap.includes('skill') || files.includes('skill')) {
        return ['pnpm test:ailis-skills', 'pnpm ailis:validate-harness'];
    }
    return ['pnpm ailis:validate-harness', 'pnpm ailis:tool-doctor:plan'];
}

function buildSourceHints({ affectedCapability = '', bugReport = '', sourceHints = [] } = {}) {
    const hints = new Set(normalizeArray(sourceHints).map(String).filter(Boolean));
    const text = `${affectedCapability} ${bugReport}`.toLowerCase();
    if (/vision|截图|screen|capture/.test(text)) {
        hints.add('electron/ailis-agent-runner.cjs');
        hints.add('electron/ailis-gateway.cjs');
        hints.add('src/ailis-chat-service.js');
    }
    if (/mcp|server|tool/.test(text)) {
        hints.add('electron/ailis-mcp-session.cjs');
        hints.add('electron/ailis-runtime.cjs');
        hints.add('electron/ailis-tool-contracts.cjs');
    }
    if (/capability|安装|skill|repair|修复/.test(text)) {
        hints.add('electron/ailis-capability-manager.cjs');
        hints.add('electron/ailis-tool-doctor.cjs');
        hints.add('electron/ailis-skills.cjs');
    }
    if (/agent|loop|执行|任务/.test(text)) {
        hints.add('electron/ailis-agent-runner.cjs');
        hints.add('electron/ailis-runtime.cjs');
    }
    return [...hints];
}

async function walkFiles(root, options = {}) {
    const maxFiles = Number(options.maxFiles || 400);
    const maxDepth = Number(options.maxDepth || 5);
    const results = [];
    const queue = [{ dir: root, depth: 0 }];
    while (queue.length && results.length < maxFiles) {
        const current = queue.shift();
        let entries = [];
        try {
            entries = await fsp.readdir(current.dir, { withFileTypes: true });
        } catch {
            continue;
        }
        for (const entry of entries) {
            if (results.length >= maxFiles) {
                break;
            }
            if (['node_modules', '.git', 'dist', 'release', 'build-cache'].includes(entry.name)) {
                continue;
            }
            const fullPath = path.join(current.dir, entry.name);
            if (entry.isDirectory()) {
                if (current.depth < maxDepth) {
                    queue.push({ dir: fullPath, depth: current.depth + 1 });
                }
                continue;
            }
            results.push(fullPath);
        }
    }
    return results;
}

class AILISSelfDebugger {
    constructor(options = {}) {
        this.workspaceRoot = path.resolve(options.workspaceRoot || process.cwd());
        this.projectRoot = path.resolve(options.projectRoot || this.workspaceRoot);
        this.auditDir = path.resolve(options.auditDir || path.join(this.projectRoot, '.ailis-state'));
        this.stateDir = path.resolve(options.stateDir || path.join(this.auditDir, 'self-debug'));
        this.casesPath = path.join(this.stateDir, 'cases.json');
        this.transcriptDir = path.join(this.auditDir, 'transcripts');
        this.toolDoctor = options.toolDoctor || null;
        this.capabilityManager = options.capabilityManager || null;
        this.emitGatewayEvent = typeof options.emitGatewayEvent === 'function' ? options.emitGatewayEvent : () => {};
    }

    getStatus() {
        return {
            enabled: true,
            version: 1,
            stateDir: this.stateDir,
            casesPath: this.casesPath,
            actions: [...SELF_DEBUGGER_ACTIONS]
        };
    }

    async execute(args = {}, context = {}) {
        const action = normalizeAction(args.action || args.operation || args.intent, 'open_case');
        try {
            if (action === 'schema') {
                return formatToolResult(this.buildSchema());
            }
            if (['open_case', 'create_case'].includes(action)) {
                return formatToolResult(await this.openCase(args, context));
            }
            if (action === 'list_cases') {
                return formatToolResult(await this.listCases(args));
            }
            if (action === 'get_case') {
                return formatToolResult(await this.getCaseResult(args));
            }
            if (action === 'collect_evidence') {
                return formatToolResult(await this.collectEvidence(args, context));
            }
            if (action === 'diagnose') {
                return formatToolResult(await this.diagnose(args, context));
            }
            if (action === 'propose_patch') {
                return formatToolResult(await this.proposePatch(args, context));
            }
            if (action === 'validate_patch') {
                return formatToolResult(await this.validatePatch(args, context));
            }
            if (action === 'apply_patch') {
                return formatToolResult(await this.applyPatch(args, context));
            }
            if (action === 'run_loop') {
                return formatToolResult(await this.runLoop(args, context));
            }
            if (['mark_case', 'close_case'].includes(action)) {
                return formatToolResult(await this.markCase(args, context));
            }
            return formatToolResult({
                status: 'unsupported_action',
                action,
                supportedActions: [...SELF_DEBUGGER_ACTIONS]
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
            tool: 'self_debugger',
            contract: getToolContractPromptText('self_debugger') || '',
            protocol: [
                'Open a self-debug case from user bug feedback.',
                'Collect trace, log, source, registry, and health evidence before patching.',
                'Create a diagnosis packet and patch proposal instead of guessing.',
                'Validate/apply repair patches only through Capability Manager, with rollback on validation failure.',
                'Return a user-facing summary separately from raw evidence.'
            ],
            actions: [...SELF_DEBUGGER_ACTIONS]
        };
    }

    async loadCases() {
        const state = await readJsonFile(this.casesPath, null);
        if (state && state.version === 1 && Array.isArray(state.cases)) {
            return state;
        }
        return {
            version: 1,
            createdAt: new Date().toISOString(),
            updatedAt: '',
            cases: []
        };
    }

    async saveCases(state) {
        const next = {
            version: 1,
            createdAt: state.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            cases: Array.isArray(state.cases) ? state.cases : []
        };
        await writeJsonFileAtomic(this.casesPath, next);
        return next;
    }

    async upsertCase(debugCase) {
        const state = await this.loadCases();
        const next = state.cases.filter((entry) => entry.id !== debugCase.id);
        next.push(debugCase);
        await this.saveCases({ ...state, cases: next.sort((a, b) => a.createdAt.localeCompare(b.createdAt)) });
        return debugCase;
    }

    async getCase(caseId) {
        const id = normalizeString(caseId);
        if (!id) {
            return null;
        }
        const state = await this.loadCases();
        return state.cases.find((entry) => entry.id === id) || null;
    }

    async openCase(args = {}, context = {}) {
        const bugReport = normalizeString(args.bugReport || args.report || args.message || args.summary);
        if (!bugReport) {
            return {
                status: 'invalid_tool_args',
                error: 'self_debugger.open_case requires bugReport/report/message'
            };
        }
        const now = new Date().toISOString();
        const affectedCapability = normalizeString(args.affectedCapability || args.capability || args.area || '');
        const sourceHints = buildSourceHints({
            affectedCapability,
            bugReport,
            sourceHints: args.sourceHints || args.files
        });
        const debugCase = {
            id: normalizeString(args.caseId || args.id, `debug-${safeSegment(affectedCapability || bugReport)}-${randomUUID().slice(0, 8)}`),
            status: 'open',
            phase: 'case_opened',
            createdAt: now,
            updatedAt: now,
            bugReport,
            affectedCapability,
            recentRunId: normalizeString(args.recentRunId || args.runId || context.runId),
            sessionId: normalizeString(args.sessionId || context.sessionId || context.sessionKey),
            sourceHints,
            symptoms: normalizeArray(args.symptoms).map(String),
            risk: normalizeString(args.risk, 'high'),
            evidence: [],
            diagnosis: null,
            repairProposal: null,
            validation: null,
            repairResult: null
        };
        await this.upsertCase(debugCase);
        this.emitGatewayEvent('self_debug.case.opened', {
            caseId: debugCase.id,
            affectedCapability: debugCase.affectedCapability
        });
        return {
            status: 'completed',
            case: debugCase,
            nextAction: 'collect_evidence'
        };
    }

    async listCases(args = {}) {
        const state = await this.loadCases();
        const status = normalizeString(args.status);
        const cases = state.cases
            .filter((entry) => !status || entry.status === status)
            .slice(-(Number(args.limit || 50)));
        return {
            status: 'completed',
            casesPath: this.casesPath,
            caseCount: cases.length,
            cases
        };
    }

    async getCaseResult(args = {}) {
        const debugCase = await this.getCase(args.caseId || args.id);
        if (!debugCase) {
            return {
                status: 'not_found',
                caseId: normalizeString(args.caseId || args.id)
            };
        }
        return {
            status: 'completed',
            case: debugCase
        };
    }

    async locateTranscript(runId = '') {
        const id = normalizeString(runId);
        if (!id || !(await pathExists(this.transcriptDir))) {
            return '';
        }
        const files = await walkFiles(this.transcriptDir, { maxFiles: 1000, maxDepth: 4 });
        return files.find((file) => path.basename(file) === `${safeSegment(id, id)}.jsonl`) || '';
    }

    async readTranscriptEvidence(runId, maxItems = DEFAULT_MAX_TRANSCRIPT_ITEMS) {
        const transcriptPath = await this.locateTranscript(runId);
        if (!transcriptPath) {
            return null;
        }
        const raw = await fsp.readFile(transcriptPath, 'utf8');
        const items = raw
            .split(/\r?\n/)
            .map((line) => line.trim())
            .filter(Boolean)
            .map((line) => {
                try {
                    return JSON.parse(line);
                } catch {
                    return { raw: line };
                }
            })
            .slice(-maxItems);
        return {
            id: `transcript:${runId}`,
            type: 'transcript',
            path: transcriptPath,
            itemCount: items.length,
            preview: items.map((item) => ({
                type: item.type,
                status: item.status,
                tool: item.payload?.tool || item.payload?.toolCall?.tool || '',
                summary: item.payload?.summary || item.payload?.message || item.payload?.displayText || ''
            })),
            items
        };
    }

    async readLogEvidence(args = {}) {
        const candidates = [
            path.join(this.auditDir, 'audit.jsonl'),
            path.join(this.projectRoot, 'tmp', 'ailis-gateway', 'audit.jsonl')
        ];
        const logs = [];
        for (const candidate of candidates) {
            if (!(await pathExists(candidate))) {
                continue;
            }
            const raw = await fsp.readFile(candidate, 'utf8');
            logs.push({
                id: `log:${path.basename(candidate)}`,
                type: 'log',
                path: candidate,
                preview: redactText(raw.slice(-Number(args.maxLogChars || DEFAULT_MAX_LOG_CHARS)))
            });
        }
        return logs;
    }

    async readSourceEvidence(debugCase, args = {}) {
        const hints = buildSourceHints({
            affectedCapability: debugCase.affectedCapability,
            bugReport: debugCase.bugReport,
            sourceHints: normalizeArray(args.sourceHints || args.files || debugCase.sourceHints)
        });
        const evidence = [];
        for (const hint of hints.slice(0, Number(args.maxFiles || 12))) {
            try {
                const filePath = resolveInside(this.projectRoot, hint, 'source hint');
                if (!(await pathExists(filePath))) {
                    evidence.push({
                        id: `source-missing:${hint}`,
                        type: 'source_missing',
                        path: filePath,
                        summary: 'Source hint does not exist.'
                    });
                    continue;
                }
                const stat = await fsp.stat(filePath);
                if (stat.isDirectory()) {
                    continue;
                }
                const text = await fsp.readFile(filePath, 'utf8');
                evidence.push({
                    id: `source:${path.relative(this.projectRoot, filePath)}`,
                    type: 'source',
                    path: filePath,
                    bytes: stat.size,
                    preview: redactText(clampText(text, Number(args.maxFileChars || DEFAULT_MAX_FILE_CHARS)))
                });
            } catch (error) {
                evidence.push({
                    id: `source-error:${hint}`,
                    type: 'source_error',
                    path: hint,
                    error: error?.message || String(error)
                });
            }
        }
        return evidence;
    }

    async collectEvidence(args = {}, context = {}) {
        let debugCase = await this.getCase(args.caseId || args.id);
        if (!debugCase) {
            const opened = await this.openCase(args, context);
            debugCase = opened.case;
        }
        const evidence = [];
        const transcript = await this.readTranscriptEvidence(
            normalizeString(args.recentRunId || debugCase.recentRunId),
            Number(args.maxTranscriptItems || DEFAULT_MAX_TRANSCRIPT_ITEMS)
        );
        if (transcript) {
            evidence.push(transcript);
        }
        evidence.push(...await this.readLogEvidence(args));
        evidence.push(...await this.readSourceEvidence(debugCase, args));
        if (this.toolDoctor?.execute) {
            const health = await this.toolDoctor.execute({
                action: 'health_check',
                includeMcp: true,
                timeoutMs: args.timeoutMs || 5000
            }, context);
            evidence.push({
                id: 'tool_doctor:health_check',
                type: 'tool_health',
                status: health.details?.status || 'unknown',
                preview: health.details
            });
        }
        if (this.capabilityManager?.execute) {
            const registry = await this.capabilityManager.execute({
                action: 'refresh_registry',
                includeHealth: false
            }, context);
            evidence.push({
                id: 'capability_manager:registry',
                type: 'capability_registry',
                status: registry.details?.status || 'unknown',
                capabilityCount: registry.details?.capabilityCount || 0,
                preview: registry.details?.capabilities || []
            });
        }
        debugCase.evidence = evidence;
        debugCase.phase = 'evidence_collected';
        debugCase.updatedAt = new Date().toISOString();
        await this.upsertCase(debugCase);
        return {
            status: 'completed',
            caseId: debugCase.id,
            phase: debugCase.phase,
            evidenceCount: evidence.length,
            evidence,
            nextAction: 'diagnose'
        };
    }

    async diagnose(args = {}, context = {}) {
        let debugCase = await this.getCase(args.caseId || args.id);
        if (!debugCase) {
            const collected = await this.collectEvidence(args, context);
            debugCase = await this.getCase(collected.caseId);
        }
        if (!debugCase.evidence?.length) {
            await this.collectEvidence({ ...args, caseId: debugCase.id }, context);
            debugCase = await this.getCase(debugCase.id);
        }
        const validationCommands = normalizeArray(args.validationCommands).length
            ? normalizeArray(args.validationCommands).map(String)
            : inferValidationCommands({
                affectedCapability: debugCase.affectedCapability,
                sourceHints: debugCase.sourceHints
            });
        const missingEvidence = [];
        if (!debugCase.evidence.some((entry) => entry.type === 'source')) {
            missingEvidence.push('source_excerpt');
        }
        if (!debugCase.evidence.some((entry) => entry.type === 'transcript')) {
            missingEvidence.push('recent_transcript');
        }
        const diagnosis = {
            id: `diagnosis-${randomUUID().slice(0, 8)}`,
            status: missingEvidence.length ? 'needs_more_evidence' : 'ready_for_patch_proposal',
            createdAt: new Date().toISOString(),
            bugReport: debugCase.bugReport,
            affectedCapability: debugCase.affectedCapability,
            evidenceIds: debugCase.evidence.map((entry) => entry.id),
            missingEvidence,
            suspectedFiles: debugCase.evidence
                .filter((entry) => entry.type === 'source')
                .map((entry) => entry.path),
            validationCommands,
            repairProtocol: [
                'Do not patch until evidence supports the suspected module.',
                'Generate a minimal unified diff candidate patch.',
                'Call self_debugger.validate_patch before applying.',
                'Call self_debugger.apply_patch only with approval; validation failure must roll back.'
            ],
            promptForPatchAuthor: [
                'Use the evidence previews to propose the smallest patch.',
                'Do not edit unrelated behavior.',
                'Include tests or focused validation commands when possible.'
            ].join('\n')
        };
        debugCase.diagnosis = diagnosis;
        debugCase.phase = diagnosis.status;
        debugCase.updatedAt = new Date().toISOString();
        await this.upsertCase(debugCase);
        return {
            status: 'completed',
            caseId: debugCase.id,
            diagnosis,
            nextAction: diagnosis.status === 'ready_for_patch_proposal' ? 'propose_patch' : 'collect_evidence'
        };
    }

    async proposePatch(args = {}, context = {}) {
        let debugCase = await this.getCase(args.caseId || args.id);
        if (!debugCase) {
            const diagnosed = await this.diagnose(args, context);
            debugCase = await this.getCase(diagnosed.caseId);
        }
        const candidateDiff = normalizeString(args.candidateDiff || args.patch);
        const candidatePatchPath = normalizeString(args.candidatePatchPath || args.patchPath);
        if (!candidateDiff && !candidatePatchPath) {
            debugCase.phase = 'needs_patch_proposal';
            debugCase.updatedAt = new Date().toISOString();
            await this.upsertCase(debugCase);
            return {
                status: 'needs_patch_proposal',
                caseId: debugCase.id,
                diagnosis: debugCase.diagnosis,
                requiredPatchFormat: 'unified diff',
                validationCommands: debugCase.diagnosis?.validationCommands || []
            };
        }
        const validationCommands = normalizeArray(args.validationCommands || debugCase.diagnosis?.validationCommands).map(String);
        let repairProposal = null;
        if (this.toolDoctor?.execute) {
            const repair = await this.toolDoctor.execute({
                action: 'propose_repair',
                tool: 'self_debugger',
                title: normalizeString(args.title, `Self debug repair for ${debugCase.affectedCapability || debugCase.id}`),
                reason: debugCase.bugReport,
                evidence: debugCase.evidence,
                candidateDiff,
                candidatePatchPath,
                validationCommands,
                risk: normalizeString(args.risk, 'high')
            }, context);
            repairProposal = repair.details?.repair || repair.details || null;
        } else {
            repairProposal = {
                id: `repair-${debugCase.id}-${randomUUID().slice(0, 8)}`,
                status: 'proposed',
                candidateDiff,
                candidatePatchPath,
                validationCommands
            };
        }
        debugCase.repairProposal = repairProposal;
        debugCase.phase = 'patch_proposed';
        debugCase.updatedAt = new Date().toISOString();
        await this.upsertCase(debugCase);
        return {
            status: 'completed',
            caseId: debugCase.id,
            repairProposal,
            nextAction: 'validate_patch'
        };
    }

    async validatePatch(args = {}, context = {}) {
        const debugCase = await this.getCase(args.caseId || args.id);
        const proposal = debugCase?.repairProposal || {};
        const candidateDiff = normalizeString(args.candidateDiff || proposal.candidateDiff);
        const candidatePatchPath = normalizeString(args.candidatePatchPath || args.patchPath || proposal.candidatePatchPath);
        if (!this.capabilityManager?.execute) {
            return {
                status: 'blocked',
                reason: 'capability_manager_not_available'
            };
        }
        const validation = await this.capabilityManager.execute({
            action: 'execute_repair',
            repair: proposal,
            candidateDiff,
            candidatePatchPath,
            validationCommands: normalizeArray(args.validationCommands || proposal.validationCommands).map(String),
            dryRun: true,
            allowGitFallback: args.allowGitFallback === true
        }, context);
        if (debugCase) {
            debugCase.validation = validation.details;
            debugCase.phase = validation.details?.status === 'validated' ? 'patch_validated' : 'patch_validation_failed';
            debugCase.updatedAt = new Date().toISOString();
            await this.upsertCase(debugCase);
        }
        return {
            status: validation.details?.status === 'validated' ? 'completed' : 'failed',
            caseId: debugCase?.id || '',
            validation: validation.details,
            nextAction: validation.details?.status === 'validated' ? 'apply_patch' : 'propose_patch'
        };
    }

    async applyPatch(args = {}, context = {}) {
        const debugCase = await this.getCase(args.caseId || args.id);
        const proposal = debugCase?.repairProposal || {};
        if (args.approved !== true && context.approved !== true) {
            return {
                status: 'needs_approval',
                caseId: debugCase?.id || '',
                approvalText: 'Apply self-debug repair patch and run validation?'
            };
        }
        if (!this.capabilityManager?.execute) {
            return {
                status: 'blocked',
                reason: 'capability_manager_not_available'
            };
        }
        const result = await this.capabilityManager.execute({
            action: 'execute_repair',
            repair: proposal,
            candidateDiff: normalizeString(args.candidateDiff || proposal.candidateDiff),
            candidatePatchPath: normalizeString(args.candidatePatchPath || args.patchPath || proposal.candidatePatchPath),
            validationCommands: normalizeArray(args.validationCommands || proposal.validationCommands).map(String),
            approved: true,
            allowGitFallback: args.allowGitFallback === true
        }, context);
        if (debugCase) {
            debugCase.repairResult = result.details;
            debugCase.phase = result.details?.status === 'completed' ? 'repair_verified' : result.details?.status || 'repair_failed';
            debugCase.status = result.details?.status === 'completed' ? 'fixed' : 'open';
            debugCase.updatedAt = new Date().toISOString();
            await this.upsertCase(debugCase);
        }
        return {
            status: result.details?.status === 'completed' ? 'completed' : 'failed',
            caseId: debugCase?.id || '',
            repairResult: result.details
        };
    }

    async runLoop(args = {}, context = {}) {
        const opened = await this.openCase(args, context);
        const collected = await this.collectEvidence({ ...args, caseId: opened.case.id }, context);
        const diagnosed = await this.diagnose({ ...args, caseId: opened.case.id }, context);
        if (!normalizeString(args.candidateDiff || args.patch || args.candidatePatchPath || args.patchPath)) {
            return {
                status: 'needs_patch_proposal',
                caseId: opened.case.id,
                evidenceCount: collected.evidenceCount,
                diagnosis: diagnosed.diagnosis,
                nextAction: 'Agent should generate a minimal candidateDiff, then call self_debugger.propose_patch.'
            };
        }
        const proposed = await this.proposePatch({ ...args, caseId: opened.case.id }, context);
        const validated = await this.validatePatch({ ...args, caseId: opened.case.id }, context);
        if (args.approved === true || context.approved === true) {
            const applied = await this.applyPatch({ ...args, caseId: opened.case.id, approved: true }, context);
            return {
                status: applied.status,
                caseId: opened.case.id,
                evidenceCount: collected.evidenceCount,
                diagnosis: diagnosed.diagnosis,
                repairProposal: proposed.repairProposal,
                validation: validated.validation,
                repairResult: applied.repairResult
            };
        }
        return {
            status: 'validated_needs_approval',
            caseId: opened.case.id,
            evidenceCount: collected.evidenceCount,
            diagnosis: diagnosed.diagnosis,
            repairProposal: proposed.repairProposal,
            validation: validated.validation
        };
    }

    async markCase(args = {}, context = {}) {
        const debugCase = await this.getCase(args.caseId || args.id);
        if (!debugCase) {
            return {
                status: 'not_found',
                caseId: normalizeString(args.caseId || args.id)
            };
        }
        const status = normalizeString(args.status, args.action === 'close_case' ? 'closed' : debugCase.status);
        debugCase.status = status;
        debugCase.phase = normalizeString(args.phase, status === 'closed' ? 'closed' : debugCase.phase);
        debugCase.note = normalizeString(args.note || args.summary || debugCase.note);
        debugCase.updatedAt = new Date().toISOString();
        debugCase.markedByRunId = normalizeString(args.runId || context.runId || debugCase.markedByRunId);
        await this.upsertCase(debugCase);
        return {
            status: 'completed',
            case: debugCase
        };
    }
}

module.exports = {
    AILISSelfDebugger,
    SELF_DEBUGGER_ACTIONS
};
