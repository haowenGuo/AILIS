const fsp = require('fs/promises');
const path = require('path');
const { createHash, randomUUID } = require('crypto');

const SELF_EVOLUTION_SCHEMA_VERSION = 1;
const DEFAULT_RECENT_EVENT_LIMIT = 40;
const DEFAULT_PROPOSAL_LIMIT = 80;
const ACTIVE_PROPOSAL_STATUSES = new Set(['proposed', 'approved', 'needs_review']);

function nowIso() {
    return new Date().toISOString();
}

function normalizeString(value, fallback = '') {
    if (typeof value !== 'string') {
        return fallback;
    }
    const trimmed = value.trim();
    return trimmed || fallback;
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

function truncateText(value, maxChars = 900) {
    const text = typeof value === 'string' ? value : JSON.stringify(value || '', null, 2);
    const normalized = normalizeString(text.replace(/\s+/g, ' '));
    if (normalized.length <= maxChars) {
        return normalized;
    }
    return `${normalized.slice(0, Math.max(0, maxChars - 1))}…`;
}

function safeSegment(value, fallback = 'item') {
    return normalizeString(value, fallback)
        .replace(/[^a-zA-Z0-9._-]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 90) || fallback;
}

function stableId(...parts) {
    const hash = createHash('sha1')
        .update(parts.map((part) => String(part || '')).join('\n'))
        .digest('hex')
        .slice(0, 12);
    return `evo-${hash}`;
}

function publicRiskLabel(risk = 'medium') {
    const normalized = normalizeString(risk, 'medium').toLowerCase();
    if (normalized === 'low') {
        return '低风险';
    }
    if (normalized === 'high' || normalized === 'critical') {
        return '高风险';
    }
    return '中风险';
}

async function readJsonFile(filePath, fallback) {
    try {
        const raw = await fsp.readFile(filePath, 'utf8');
        return JSON.parse(raw || 'null') ?? fallback;
    } catch {
        return fallback;
    }
}

async function writeJsonFileAtomic(filePath, value) {
    await fsp.mkdir(path.dirname(filePath), { recursive: true });
    const tempPath = `${filePath}.${process.pid}.${Date.now()}.tmp`;
    await fsp.writeFile(tempPath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
    await fsp.rename(tempPath, filePath);
}

function createDefaultState() {
    const createdAt = nowIso();
    return {
        version: SELF_EVOLUTION_SCHEMA_VERSION,
        createdAt,
        updatedAt: createdAt,
        proposals: [],
        runs: []
    };
}

function normalizeState(raw) {
    if (!raw || typeof raw !== 'object') {
        return createDefaultState();
    }
    return {
        version: SELF_EVOLUTION_SCHEMA_VERSION,
        createdAt: raw.createdAt || nowIso(),
        updatedAt: raw.updatedAt || nowIso(),
        proposals: Array.isArray(raw.proposals) ? raw.proposals : [],
        runs: Array.isArray(raw.runs) ? raw.runs : []
    };
}

function summarizeMemoryEvent(event = {}) {
    return truncateText(event.summary || event.userText || event.assistantText || '', 520);
}

function buildPreferenceBullet(event = {}) {
    const source = summarizeMemoryEvent(event);
    if (!source) {
        return '';
    }
    if (/用户偏好|用户希望|用户不喜欢|用户喜欢/.test(source)) {
        return `- ${source.replace(/^[-\s]+/, '')}`;
    }
    return `- 用户偏好线索：${source}`;
}

function proposalSort(left = {}, right = {}) {
    const statusWeight = (proposal) => ACTIVE_PROPOSAL_STATUSES.has(proposal.status) ? 1 : 0;
    return statusWeight(right) - statusWeight(left) ||
        Date.parse(right.updatedAt || right.createdAt || '') - Date.parse(left.updatedAt || left.createdAt || '') ||
        String(left.id).localeCompare(String(right.id));
}

class AilisSelfEvolutionRuntime {
    constructor(options = {}) {
        this.workspaceRoot = path.resolve(options.workspaceRoot || process.cwd());
        this.projectRoot = path.resolve(options.projectRoot || this.workspaceRoot);
        this.auditDir = path.resolve(options.auditDir || path.join(this.projectRoot, '.ailis-state'));
        this.stateDir = path.resolve(options.stateDir || path.join(this.auditDir, 'self-evolution'));
        this.statePath = path.join(this.stateDir, 'evolution-state.json');
        this.memoryRuntime = options.memoryRuntime || null;
        this.runtime = options.runtime || null;
        this.toolDoctor = options.toolDoctor || this.runtime?.toolDoctor || null;
        this.capabilityManager = options.capabilityManager || this.runtime?.capabilityManager || null;
        this.selfDebugger = options.selfDebugger || this.runtime?.selfDebugger || null;
        this.emitGatewayEvent = typeof options.emitGatewayEvent === 'function' ? options.emitGatewayEvent : () => {};
        this.state = null;
        this.loaded = false;
        this.lastError = '';
    }

    async initialize() {
        try {
            await fsp.mkdir(this.stateDir, { recursive: true });
            this.state = normalizeState(await readJsonFile(this.statePath, null));
            this.loaded = true;
            this.lastError = '';
            await this.persist('initialize');
        } catch (error) {
            this.state = createDefaultState();
            this.loaded = false;
            this.lastError = error?.message || String(error);
        }
        return this.getStatus();
    }

    async ensureLoaded() {
        if (!this.state) {
            await this.initialize();
        }
        return this.state;
    }

    async persist(reason = 'update') {
        if (!this.state) {
            return;
        }
        this.state.updatedAt = nowIso();
        this.state.proposals = normalizeArray(this.state.proposals)
            .sort(proposalSort)
            .slice(0, 500);
        await writeJsonFileAtomic(this.statePath, this.state);
        this.emitGatewayEvent('self_evolution.state.updated', {
            reason,
            proposalCount: this.state.proposals.length,
            activeProposalCount: this.state.proposals.filter((proposal) => ACTIVE_PROPOSAL_STATUSES.has(proposal.status)).length
        });
    }

    getStatus() {
        const proposals = normalizeArray(this.state?.proposals);
        return {
            enabled: true,
            version: `v${SELF_EVOLUTION_SCHEMA_VERSION}`,
            loaded: this.loaded,
            stateDir: this.stateDir,
            statePath: this.statePath,
            proposalCount: proposals.length,
            activeProposalCount: proposals.filter((proposal) => ACTIVE_PROPOSAL_STATUSES.has(proposal.status)).length,
            lastError: this.lastError
        };
    }

    async listProposals(args = {}) {
        await this.ensureLoaded();
        const status = normalizeString(args.status);
        const type = normalizeString(args.type);
        const limit = Math.max(1, Math.min(Number(args.limit || DEFAULT_PROPOSAL_LIMIT), 300));
        const proposals = normalizeArray(this.state.proposals)
            .filter((proposal) => !status || proposal.status === status)
            .filter((proposal) => !type || proposal.type === type)
            .sort(proposalSort)
            .slice(0, limit);
        return {
            ok: true,
            status: 'completed',
            proposals,
            proposalCount: proposals.length,
            statePath: this.statePath
        };
    }

    async getProposal(id = '') {
        await this.ensureLoaded();
        const proposalId = normalizeString(id);
        return normalizeArray(this.state.proposals).find((proposal) => proposal.id === proposalId) || null;
    }

    async upsertProposal(proposal = {}) {
        await this.ensureLoaded();
        const id = normalizeString(proposal.id, `evo-${randomUUID().slice(0, 12)}`);
        const now = nowIso();
        const existing = this.state.proposals.find((entry) => entry.id === id);
        const next = {
            ...(existing || {}),
            ...cloneJson(proposal),
            id,
            status: proposal.status || existing?.status || 'proposed',
            createdAt: existing?.createdAt || proposal.createdAt || now,
            updatedAt: now
        };
        if (existing && !ACTIVE_PROPOSAL_STATUSES.has(existing.status)) {
            return existing;
        }
        this.state.proposals = [
            ...this.state.proposals.filter((entry) => entry.id !== id),
            next
        ];
        return next;
    }

    async analyze(args = {}) {
        await this.ensureLoaded();
        const startedAt = Date.now();
        const generated = [];
        generated.push(...await this.collectPreferenceProposals(args));
        generated.push(...await this.collectToolBottleneckProposals(args));
        generated.push(...await this.collectCapabilityLearningProposals(args));
        for (const proposal of generated) {
            await this.upsertProposal(proposal);
        }
        const run = {
            id: `evo-run-${randomUUID().slice(0, 8)}`,
            at: nowIso(),
            durationMs: Date.now() - startedAt,
            generated: generated.map((proposal) => proposal.id)
        };
        this.state.runs = [...normalizeArray(this.state.runs), run].slice(-120);
        await this.persist('analyze');
        const listed = await this.listProposals({ limit: args.limit || DEFAULT_PROPOSAL_LIMIT });
        return {
            ok: true,
            status: 'completed',
            run,
            summary: this.buildSummary(listed.proposals),
            ...listed
        };
    }

    buildSummary(proposals = []) {
        const active = proposals.filter((proposal) => ACTIVE_PROPOSAL_STATUSES.has(proposal.status));
        const byType = {};
        for (const proposal of proposals) {
            byType[proposal.type] = (byType[proposal.type] || 0) + 1;
        }
        const highRisk = active.filter((proposal) => proposal.risk === 'high' || proposal.risk === 'critical').length;
        return {
            total: proposals.length,
            active: active.length,
            highRisk,
            byType,
            headline: active.length
                ? `发现 ${active.length} 个可处理的自我进化提案，其中 ${highRisk} 个高风险需要人工审查。`
                : '暂未发现需要处理的自我进化提案。'
        };
    }

    async collectPreferenceProposals(args = {}) {
        if (!this.memoryRuntime?.getSnapshot) {
            return [];
        }
        const snapshot = this.memoryRuntime.getSnapshot({ includeEvents: true });
        const blocks = Array.isArray(snapshot?.blocks) ? snapshot.blocks : [];
        const userBlock = blocks.find((block) => block.key === 'user') || {};
        const existingUserText = normalizeString(userBlock.value);
        const events = normalizeArray(snapshot?.recentEvents)
            .slice(-Math.max(1, Math.min(Number(args.memoryEventLimit || DEFAULT_RECENT_EVENT_LIMIT), 100)))
            .filter((event) => normalizeArray(event.tags).some((tag) => ['preference', 'relationship', 'project'].includes(tag)))
            .filter((event) => Number(event.importance || 0) >= 5);
        const proposals = [];
        for (const event of events) {
            const bullet = buildPreferenceBullet(event);
            if (!bullet || existingUserText.includes(bullet.replace(/^-\s*/, '').slice(0, 80))) {
                continue;
            }
            const id = stableId('preference_consolidation', event.id || bullet);
            const nextValue = [
                existingUserText,
                '',
                bullet
            ].filter(Boolean).join('\n').trim();
            proposals.push({
                id,
                type: 'preference_consolidation',
                title: '沉淀新的用户偏好线索',
                status: 'proposed',
                risk: 'low',
                riskLabel: publicRiskLabel('low'),
                source: 'memory_runtime',
                summary: `从近期互动中提取到可长期保留的偏好：${bullet.replace(/^-\s*/, '')}`,
                evidence: [
                    {
                        type: 'memory_event',
                        id: event.id || '',
                        at: event.ts || '',
                        tags: event.tags || [],
                        importance: event.importance,
                        preview: summarizeMemoryEvent(event)
                    }
                ],
                target: {
                    kind: 'memory_block',
                    key: 'user'
                },
                candidatePatch: {
                    operation: 'append_bullet',
                    currentValue: existingUserText,
                    nextValue,
                    bullet
                },
                safetyGate: {
                    requiresApproval: true,
                    rollback: '可以在记忆面板删除该 bullet，或恢复 previousValue。',
                    checks: ['不写入密钥明文', '只写入稳定偏好，不写入一次性任务文件名']
                },
                recommendedAction: 'approve_and_apply'
            });
        }
        return proposals;
    }

    async collectToolBottleneckProposals(args = {}) {
        if (!this.toolDoctor?.execute) {
            return [];
        }
        const scorecardResult = await this.toolDoctor.execute({
            action: 'scorecard',
            limit: args.toolLimit || 80
        }, { source: 'self_evolution' }).catch((error) => ({
            details: null,
            error: error?.message || String(error)
        }));
        const tools = normalizeArray(scorecardResult?.details?.tools || scorecardResult?.tools);
        const proposals = [];
        for (const tool of tools) {
            const total = Number(tool.total || 0);
            const failureRate = Number(tool.failureRate || 0);
            const timeoutRate = Number(tool.timeoutRate || 0);
            const latency = Number(tool.averageLatencyMs || 0);
            if (total < Number(args.minToolSamples || 3)) {
                continue;
            }
            if (failureRate < 0.35 && timeoutRate < 0.2 && latency < 15000) {
                continue;
            }
            const toolId = normalizeString(tool.tool, 'unknown_tool');
            const id = stableId('tool_bottleneck', toolId);
            proposals.push({
                id,
                type: 'tool_bottleneck_repair',
                title: `修复或优化工具：${toolId}`,
                status: 'proposed',
                risk: failureRate >= 0.6 || timeoutRate >= 0.35 ? 'high' : 'medium',
                riskLabel: publicRiskLabel(failureRate >= 0.6 || timeoutRate >= 0.35 ? 'high' : 'medium'),
                source: 'tool_doctor',
                summary: `工具 ${toolId} 近期成功率偏低或耗时偏高：失败率 ${(failureRate * 100).toFixed(1)}%，超时率 ${(timeoutRate * 100).toFixed(1)}%，平均耗时 ${latency || 0}ms。`,
                evidence: [
                    {
                        type: 'tool_scorecard',
                        tool: toolId,
                        total,
                        successRate: tool.successRate,
                        failureRate,
                        timeoutRate,
                        averageLatencyMs: latency,
                        commonErrors: tool.commonErrors || [],
                        recent: normalizeArray(tool.recent).slice(-5)
                    }
                ],
                target: {
                    kind: 'tool_or_mcp',
                    tool: toolId
                },
                candidatePatch: {
                    operation: 'open_self_debug_case',
                    affectedCapability: toolId,
                    bugReport: `Tool ${toolId} has failureRate=${failureRate}, timeoutRate=${timeoutRate}, averageLatencyMs=${latency}.`,
                    validationCommands: this.inferValidationCommands(toolId)
                },
                safetyGate: {
                    requiresApproval: true,
                    rollback: '该操作只打开诊断 case，不直接修改代码；后续 patch 仍需单独审批。',
                    checks: ['收集 transcript/audit/source evidence', '生成最小修复 diff', 'dry-run patch', '验证失败自动回滚']
                },
                recommendedAction: 'open_debug_case'
            });
        }
        return proposals;
    }

    async collectCapabilityLearningProposals(args = {}) {
        if (!this.capabilityManager?.recommendTools) {
            return [];
        }
        const taskText = normalizeString(args.taskText || args.query || '');
        if (!taskText) {
            return [];
        }
        const recommendation = await this.capabilityManager.recommendTools({
            taskText,
            limit: 6
        }).catch(() => null);
        const tools = normalizeArray(recommendation?.recommendations || recommendation?.tools);
        return tools
            .filter((entry) => entry.source !== 'core_catalog' || entry.successRate < 1)
            .slice(0, 3)
            .map((entry) => {
                const toolId = normalizeString(entry.toolId || entry.id || entry.candidate?.id, 'candidate_tool');
                return {
                    id: stableId('capability_recommendation', taskText, toolId),
                    type: 'capability_acquisition',
                    title: `为任务补齐能力：${toolId}`,
                    status: 'proposed',
                    risk: 'medium',
                    riskLabel: publicRiskLabel('medium'),
                    source: 'capability_learning',
                    summary: `针对“${truncateText(taskText, 160)}”，历史学习表或核心能力目录建议评估 ${toolId}。`,
                    evidence: [{ type: 'tool_recommendation', recommendation: entry }],
                    target: { kind: 'capability', toolId },
                    candidatePatch: {
                        operation: 'plan_or_install_capability',
                        taskText,
                        toolId
                    },
                    safetyGate: {
                        requiresApproval: true,
                        rollback: '能力安装必须有 installation record；安装失败或验证失败可以回滚。',
                        checks: ['来源可信度', 'schema lint', 'smoke test', '权限面最小化']
                    },
                    recommendedAction: 'review_capability'
                };
            });
    }

    inferValidationCommands(toolId = '') {
        const normalized = toolId.toLowerCase();
        if (normalized.includes('mcp')) {
            return ['pnpm ailis:mcp-soak', 'pnpm test:ailis-runtime'];
        }
        if (normalized.includes('capability') || normalized.includes('skill')) {
            return ['pnpm test:ailis-capability-manager', 'pnpm test:ailis-skills'];
        }
        if (normalized.includes('agent')) {
            return ['pnpm test:ailis-agent'];
        }
        return ['pnpm ailis:validate-harness', 'pnpm ailis:tool-doctor:plan'];
    }

    async markProposal(args = {}) {
        await this.ensureLoaded();
        const id = normalizeString(args.id || args.proposalId);
        const status = normalizeString(args.status);
        const allowed = new Set(['approved', 'rejected', 'needs_review', 'superseded', 'closed']);
        if (!id || !allowed.has(status)) {
            return {
                ok: false,
                status: 'invalid_args',
                error: 'markProposal requires proposal id and supported status'
            };
        }
        const proposal = await this.getProposal(id);
        if (!proposal) {
            return { ok: false, status: 'not_found', id };
        }
        proposal.status = status;
        proposal.updatedAt = nowIso();
        proposal.review = {
            ...(proposal.review || {}),
            note: normalizeString(args.note || args.reason),
            reviewer: normalizeString(args.reviewer || args.source, 'user'),
            reviewedAt: nowIso()
        };
        await this.persist('mark_proposal');
        return { ok: true, status: 'completed', proposal };
    }

    async applyProposal(args = {}, context = {}) {
        await this.ensureLoaded();
        const id = normalizeString(args.id || args.proposalId);
        const proposal = await this.getProposal(id);
        if (!proposal) {
            return { ok: false, status: 'not_found', id };
        }
        if (args.approved !== true && context.approved !== true && proposal.status !== 'approved') {
            return {
                ok: false,
                status: 'needs_approval',
                proposal,
                approvalText: `Apply self-evolution proposal ${proposal.title || proposal.id}?`
            };
        }
        let result = null;
        if (proposal.type === 'preference_consolidation') {
            result = await this.applyPreferenceProposal(proposal);
        } else if (proposal.type === 'tool_bottleneck_repair') {
            result = await this.applyToolRepairProposal(proposal, args, context);
        } else {
            result = {
                status: 'needs_manual_review',
                message: 'This proposal is advisory in the current MVP and must be handled by the developer.'
            };
        }
        proposal.status = result.status === 'completed' ? 'applied' : result.status;
        proposal.updatedAt = nowIso();
        proposal.applyResult = result;
        await this.persist('apply_proposal');
        return {
            ok: result.status === 'completed',
            status: result.status,
            proposal,
            result
        };
    }

    async applyPreferenceProposal(proposal) {
        if (!this.memoryRuntime?.updateBlock) {
            return { status: 'blocked', reason: 'memory_runtime_not_available' };
        }
        const blockKey = proposal.target?.key || 'user';
        const nextValue = normalizeString(proposal.candidatePatch?.nextValue);
        if (!nextValue) {
            return { status: 'invalid_proposal', reason: 'missing next memory value' };
        }
        const update = this.memoryRuntime.updateBlock(blockKey, nextValue);
        return {
            status: update?.ok === false ? 'failed' : 'completed',
            blockKey,
            update
        };
    }

    async applyToolRepairProposal(proposal, args = {}, context = {}) {
        if (!this.selfDebugger?.execute) {
            return { status: 'blocked', reason: 'self_debugger_not_available' };
        }
        const patch = proposal.candidatePatch || {};
        const opened = await this.selfDebugger.execute({
            action: 'open_case',
            affectedCapability: patch.affectedCapability || proposal.target?.tool || 'tooling',
            bugReport: patch.bugReport || proposal.summary,
            symptoms: proposal.evidence || [],
            risk: proposal.risk || 'medium',
            sourceHints: normalizeArray(args.sourceHints || patch.sourceHints),
            recentRunId: normalizeString(args.recentRunId || proposal.evidence?.[0]?.recent?.[0]?.runId)
        }, { ...context, source: 'self_evolution' });
        return {
            status: 'completed',
            debugCase: opened.details?.case || opened.case || opened.details || opened
        };
    }
}

module.exports = {
    AilisSelfEvolutionRuntime,
    SELF_EVOLUTION_SCHEMA_VERSION
};
