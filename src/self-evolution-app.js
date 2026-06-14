const elements = {
    refreshBtn: document.getElementById('refresh-btn'),
    analyzeBtn: document.getElementById('analyze-btn'),
    closeBtn: document.getElementById('close-btn'),
    taskInput: document.getElementById('task-input'),
    taskAnalyzeBtn: document.getElementById('task-analyze-btn'),
    proposalList: document.getElementById('proposal-list'),
    detailBody: document.getElementById('detail-body'),
    applyBtn: document.getElementById('apply-btn'),
    approveBtn: document.getElementById('approve-btn'),
    rejectBtn: document.getElementById('reject-btn'),
    statusLine: document.getElementById('status-line'),
    metricActive: document.getElementById('metric-active'),
    metricTotal: document.getElementById('metric-total'),
    metricHigh: document.getElementById('metric-high')
};

let proposals = [];
let selectedProposalId = '';
let busy = false;

function setStatus(text) {
    if (elements.statusLine) {
        elements.statusLine.textContent = text || '';
    }
}

function setBusy(nextBusy) {
    busy = Boolean(nextBusy);
    for (const button of [elements.refreshBtn, elements.analyzeBtn, elements.taskAnalyzeBtn]) {
        if (button) {
            button.disabled = busy;
        }
    }
    updateActionButtons();
}

function clearElement(element) {
    if (!element) {
        return;
    }
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

function append(parent, className = '', text = '', tag = 'div') {
    const node = document.createElement(tag);
    if (className) {
        node.className = className;
    }
    if (text !== undefined && text !== null) {
        node.textContent = String(text);
    }
    parent.appendChild(node);
    return node;
}

function compact(value, maxChars = 360) {
    const text = typeof value === 'string' ? value : JSON.stringify(value || '', null, 2);
    const normalized = String(text || '').replace(/\s+/g, ' ').trim();
    if (normalized.length <= maxChars) {
        return normalized;
    }
    return `${normalized.slice(0, maxChars - 1)}…`;
}

function typeLabel(type = '') {
    const labels = {
        preference_consolidation: '偏好沉淀',
        tool_bottleneck_repair: '工具修复',
        capability_acquisition: '能力补齐'
    };
    return labels[type] || type || '提案';
}

function statusLabel(status = '') {
    const labels = {
        proposed: '待审查',
        approved: '已批准',
        applied: '已应用',
        rejected: '已拒绝',
        needs_review: '需复核',
        needs_approval: '需审批',
        needs_manual_review: '人工处理',
        blocked: '阻塞',
        failed: '失败'
    };
    return labels[status] || status || '未知';
}

function riskLabel(proposal = {}) {
    if (proposal.riskLabel) {
        return proposal.riskLabel;
    }
    if (proposal.risk === 'low') {
        return '低风险';
    }
    if (proposal.risk === 'high' || proposal.risk === 'critical') {
        return '高风险';
    }
    return '中风险';
}

function activeProposal(proposal = {}) {
    return ['proposed', 'approved', 'needs_review'].includes(proposal.status);
}

function selectedProposal() {
    return proposals.find((proposal) => proposal.id === selectedProposalId) || proposals[0] || null;
}

function updateMetrics(summary = {}) {
    const active = proposals.filter(activeProposal).length;
    const high = proposals.filter((proposal) => activeProposal(proposal) && ['high', 'critical'].includes(proposal.risk)).length;
    elements.metricActive.textContent = String(summary.active ?? active);
    elements.metricTotal.textContent = String(summary.total ?? proposals.length);
    elements.metricHigh.textContent = String(summary.highRisk ?? high);
}

function renderBadges(parent, proposal = {}) {
    const row = append(parent, 'badge-row', '');
    append(row, `badge ${proposal.status || ''}`, statusLabel(proposal.status));
    append(row, `badge ${proposal.risk || 'medium'}`, riskLabel(proposal));
    append(row, 'badge medium', typeLabel(proposal.type));
}

function renderProposalList() {
    clearElement(elements.proposalList);
    if (!proposals.length) {
        append(elements.proposalList, 'empty', '还没有提案。点击“重新分析”让 AIGRIL 从记忆、工具评分和能力学习表里寻找可以进化的地方。');
        return;
    }
    for (const proposal of proposals) {
        const item = append(
            elements.proposalList,
            `proposal-card${proposal.id === selectedProposalId ? ' active' : ''}`,
            '',
            'button'
        );
        item.type = 'button';
        item.addEventListener('click', () => {
            selectedProposalId = proposal.id;
            render();
        });
        append(item, 'proposal-title', proposal.title || proposal.id);
        append(item, 'proposal-summary', compact(proposal.summary || proposal.recommendedAction || '', 220));
        renderBadges(item, proposal);
    }
}

function renderEvidence(parent, evidence = []) {
    const section = append(parent, 'detail-section', '');
    append(section, '', '证据', 'h2');
    if (!evidence.length) {
        append(section, '', '暂无证据。这个提案需要更多运行记录或工具评分。', 'p');
        return;
    }
    const list = append(section, '', '', 'ul');
    for (const entry of evidence) {
        const text = [
            entry.type ? `类型：${entry.type}` : '',
            entry.tool ? `工具：${entry.tool}` : '',
            entry.failureRate !== undefined ? `失败率：${Math.round(Number(entry.failureRate || 0) * 100)}%` : '',
            entry.timeoutRate !== undefined ? `超时率：${Math.round(Number(entry.timeoutRate || 0) * 100)}%` : '',
            entry.averageLatencyMs ? `平均耗时：${entry.averageLatencyMs}ms` : '',
            entry.preview ? `摘要：${compact(entry.preview, 240)}` : ''
        ].filter(Boolean).join('；');
        append(list, '', text || compact(entry, 280), 'li');
    }
}

function renderCandidatePatch(parent, proposal = {}) {
    const patch = proposal.candidatePatch || {};
    const section = append(parent, 'detail-section', '');
    append(section, '', '候选变更', 'h2');
    if (!Object.keys(patch).length) {
        append(section, '', '当前提案没有可自动执行的候选变更，只作为研发建议。', 'p');
        return;
    }
    if (patch.operation === 'append_bullet') {
        append(section, '', `操作：向 ${proposal.target?.key || 'user'} 记忆块追加一条偏好。`, 'p');
        append(section, 'codebox', patch.bullet || '');
        return;
    }
    if (patch.operation === 'open_self_debug_case') {
        append(section, '', `操作：为 ${patch.affectedCapability || proposal.target?.tool || '相关能力'} 打开自修复诊断 case。`, 'p');
        append(section, '', `问题描述：${patch.bugReport || proposal.summary || '-'}`, 'p');
        append(section, '', `建议验证：${(patch.validationCommands || []).join('；') || '由 self_debugger 自动推断'}`, 'p');
        return;
    }
    append(section, 'codebox', JSON.stringify(patch, null, 2));
}

function renderSafetyGate(parent, gate = {}) {
    const section = append(parent, 'detail-section', '');
    append(section, '', '安全门禁', 'h2');
    append(section, '', gate.requiresApproval ? '需要人工审批：是' : '需要人工审批：否', 'p');
    append(section, '', `回滚方式：${gate.rollback || '暂无明确回滚路径。'}`, 'p');
    const checks = Array.isArray(gate.checks) ? gate.checks : [];
    if (checks.length) {
        const list = append(section, '', '', 'ul');
        checks.forEach((check) => append(list, '', check, 'li'));
    }
}

function renderDetail() {
    clearElement(elements.detailBody);
    const proposal = selectedProposal();
    if (!proposal) {
        append(elements.detailBody, 'empty', '选择一个提案后，这里会显示它为什么出现、证据是什么、会修改哪里、需要哪些安全门禁。');
        updateActionButtons();
        return;
    }
    const hero = append(elements.detailBody, 'detail-section', '');
    append(hero, '', proposal.title || proposal.id, 'h2');
    append(hero, '', proposal.summary || '暂无摘要。', 'p');
    renderBadges(hero, proposal);
    renderEvidence(elements.detailBody, proposal.evidence || []);
    renderCandidatePatch(elements.detailBody, proposal);
    renderSafetyGate(elements.detailBody, proposal.safetyGate || {});
    if (proposal.applyResult) {
        const applied = append(elements.detailBody, 'detail-section', '');
        append(applied, '', '执行结果', 'h2');
        append(applied, 'codebox', JSON.stringify(proposal.applyResult, null, 2));
    }
    updateActionButtons();
}

function updateActionButtons() {
    const proposal = selectedProposal();
    const disabled = busy || !proposal || !activeProposal(proposal);
    elements.applyBtn.disabled = disabled;
    elements.approveBtn.disabled = disabled || proposal?.status === 'approved';
    elements.rejectBtn.disabled = disabled;
}

function render(summary = {}) {
    if (!selectedProposalId && proposals[0]) {
        selectedProposalId = proposals[0].id;
    }
    updateMetrics(summary);
    renderProposalList();
    renderDetail();
}

async function refreshProposals() {
    if (!window.aigrilDesktop?.selfEvolution?.listProposals) {
        setStatus('当前环境不支持自我进化 IPC。');
        return;
    }
    setBusy(true);
    setStatus('读取提案中...');
    try {
        const result = await window.aigrilDesktop.selfEvolution.listProposals({ limit: 120 });
        proposals = Array.isArray(result?.proposals) ? result.proposals : [];
        if (selectedProposalId && !proposals.some((proposal) => proposal.id === selectedProposalId)) {
            selectedProposalId = proposals[0]?.id || '';
        }
        render();
        setStatus(`已读取 ${proposals.length} 个提案。`);
    } catch (error) {
        setStatus(`读取失败：${error.message || error}`);
    } finally {
        setBusy(false);
    }
}

async function analyze(taskText = '') {
    if (!window.aigrilDesktop?.selfEvolution?.analyze) {
        setStatus('当前环境不支持自我进化分析。');
        return;
    }
    setBusy(true);
    setStatus('正在分析记忆、工具评分和能力学习表...');
    try {
        const result = await window.aigrilDesktop.selfEvolution.analyze({
            limit: 120,
            taskText
        });
        proposals = Array.isArray(result?.proposals) ? result.proposals : [];
        if (selectedProposalId && !proposals.some((proposal) => proposal.id === selectedProposalId)) {
            selectedProposalId = proposals[0]?.id || '';
        }
        render(result?.summary || {});
        setStatus(result?.summary?.headline || `分析完成，生成 ${result?.run?.generated?.length || 0} 个新提案。`);
    } catch (error) {
        setStatus(`分析失败：${error.message || error}`);
    } finally {
        setBusy(false);
    }
}

async function markSelected(status) {
    const proposal = selectedProposal();
    if (!proposal) {
        return;
    }
    setBusy(true);
    setStatus(status === 'rejected' ? '正在拒绝提案...' : '正在标记提案...');
    try {
        await window.aigrilDesktop.selfEvolution.markProposal({
            id: proposal.id,
            status,
            source: 'self-evolution-lab'
        });
        await refreshProposals();
    } catch (error) {
        setStatus(`操作失败：${error.message || error}`);
    } finally {
        setBusy(false);
    }
}

async function applySelected() {
    const proposal = selectedProposal();
    if (!proposal) {
        return;
    }
    setBusy(true);
    setStatus('正在执行已审批提案...');
    try {
        const result = await window.aigrilDesktop.selfEvolution.applyProposal({
            id: proposal.id,
            approved: true,
            source: 'self-evolution-lab'
        });
        setStatus(result?.status === 'completed' ? '执行完成。' : `执行结果：${result?.status || 'unknown'}`);
        await refreshProposals();
    } catch (error) {
        setStatus(`执行失败：${error.message || error}`);
    } finally {
        setBusy(false);
    }
}

elements.refreshBtn?.addEventListener('click', () => void refreshProposals());
elements.analyzeBtn?.addEventListener('click', () => void analyze());
elements.taskAnalyzeBtn?.addEventListener('click', () => void analyze(elements.taskInput?.value.trim() || ''));
elements.approveBtn?.addEventListener('click', () => void markSelected('approved'));
elements.rejectBtn?.addEventListener('click', () => void markSelected('rejected'));
elements.applyBtn?.addEventListener('click', () => void applySelected());
elements.closeBtn?.addEventListener('click', () => {
    void window.aigrilDesktop?.closeCurrentWindow?.();
});

window.aigrilDesktop?.gateway?.onEvent?.((event = {}) => {
    if (/^self_evolution\./.test(event.type || '')) {
        void refreshProposals();
    }
});

window.addEventListener('DOMContentLoaded', () => {
    void analyze();
});
