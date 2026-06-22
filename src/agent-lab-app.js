const elements = {
    autoConfirmCheck: document.getElementById('auto-confirm-check'),
    closeBtn: document.getElementById('close-btn'),
    dryRunCheck: document.getElementById('dry-run-check'),
    findings: document.getElementById('findings'),
    maxStepsInput: document.getElementById('max-steps-input'),
    metrics: document.getElementById('metrics'),
    interruptRunBtn: document.getElementById('interrupt-run-btn'),
    nextRoundBtn: document.getElementById('next-round-btn'),
    openControlBtn: document.getElementById('open-control-btn'),
    refreshBtn: document.getElementById('refresh-btn'),
    roundDetail: document.getElementById('round-detail'),
    roundList: document.getElementById('round-list'),
    runDebugBtn: document.getElementById('run-debug-btn'),
    runFullBtn: document.getElementById('run-full-btn'),
    runList: document.getElementById('run-list'),
    runSummary: document.getElementById('run-summary'),
    sessionInput: document.getElementById('session-input'),
    statusText: document.getElementById('status-text'),
    taskInput: document.getElementById('task-input'),
    timeline: document.getElementById('timeline')
};

let runs = [];
let analysis = null;
let selectedRunId = '';
let selectedRoundIndex = 0;
let busy = false;
let refreshTimer = null;

function clear(element) {
    if (element) {
        element.innerHTML = '';
    }
}

function setStatus(text) {
    if (elements.statusText) {
        elements.statusText.textContent = text;
    }
}

function text(value, fallback = '') {
    return String(value ?? fallback).trim();
}

function compact(value, maxChars = 360) {
    const normalized = text(value).replace(/\s+/g, ' ');
    return normalized.length > maxChars ? `${normalized.slice(0, maxChars - 1)}…` : normalized;
}

function formatDuration(value) {
    const ms = Number(value);
    if (!Number.isFinite(ms) || ms < 0) {
        return '-';
    }
    if (ms < 1000) {
        return `${Math.round(ms)}ms`;
    }
    if (ms < 60000) {
        return `${(ms / 1000).toFixed(ms < 10000 ? 1 : 0)}s`;
    }
    return `${(ms / 60000).toFixed(1)}m`;
}

function formatTokens(value) {
    const tokens = Number(value);
    if (!Number.isFinite(tokens) || tokens < 0) {
        return '-';
    }
    if (tokens >= 1000000) {
        return `${(tokens / 1000000).toFixed(1)}M`;
    }
    if (tokens >= 1000) {
        return `${(tokens / 1000).toFixed(1)}K`;
    }
    return String(Math.round(tokens));
}

function formatBytes(value) {
    const bytes = Number(value);
    if (!Number.isFinite(bytes) || bytes < 0) {
        return '-';
    }
    if (bytes >= 1024 * 1024) {
        return `${(bytes / 1024 / 1024).toFixed(1)}MB`;
    }
    if (bytes >= 1024) {
        return `${(bytes / 1024).toFixed(1)}KB`;
    }
    return `${Math.round(bytes)}B`;
}

function formatOutputArtifact(outputStore = {}) {
    if (!outputStore?.outputId) {
        return '';
    }
    return [
        `完整输出 ${outputStore.outputId}`,
        `${formatBytes(outputStore.bytes)} / ${Number(outputStore.lineCount) || 0} 行`,
        outputStore.previewTruncated ? '预览已截断' : '预览完整',
        '可用 output_read / output_tail / output_search 继续分析'
    ].join(' · ');
}

function formatTime(value) {
    const date = value ? new Date(value) : null;
    return date && !Number.isNaN(date.getTime()) ? date.toLocaleString() : '';
}

function append(parent, className, content = '') {
    const node = document.createElement('div');
    node.className = className;
    node.textContent = content;
    parent?.appendChild(node);
    return node;
}

function createEmpty(message) {
    const node = document.createElement('div');
    node.className = 'empty';
    node.textContent = message;
    return node;
}

function messageContent(message = {}) {
    const content = message.content;
    if (typeof content === 'string') {
        return content;
    }
    if (Array.isArray(content)) {
        return content.map((part) => {
            if (typeof part === 'string') {
                return part;
            }
            if (part?.text) {
                return part.text;
            }
            if (part?.type) {
                return `[${part.type}] ${compact(JSON.stringify(part), 220)}`;
            }
            return compact(JSON.stringify(part), 220);
        }).filter(Boolean).join('\n');
    }
    return compact(JSON.stringify(content || message), 500);
}

function roundDuration(round = {}) {
    const llm = (round.llmCalls || []).reduce((sum, call) => sum + (Number(call.durationMs) || 0), 0);
    const tools = (round.tools || []).reduce((sum, tool) => sum + (Number(tool.durationMs) || 0), 0);
    return { llm, tools, total: llm + tools };
}

function roundHealth(round = {}) {
    const failedTool = (round.tools || []).find((tool) => tool.ok === false);
    if (failedTool) {
        return { label: `工具失败：${failedTool.tool || failedTool.callId}`, severity: 'high' };
    }
    if (round.decision?.action === 'blocked' || round.decision?.error) {
        return { label: 'Agent 决策阻塞', severity: 'high' };
    }
    if (Number(round.approxInputTokens) > 24000) {
        return { label: '上下文过大', severity: 'medium' };
    }
    if (roundDuration(round).total > 20000) {
        return { label: '本轮耗时偏高', severity: 'medium' };
    }
    return { label: '正常', severity: 'low' };
}

function buildFindings(current = analysis) {
    if (!current) {
        return ['还没有分析数据。'];
    }
    const findings = [];
    const summary = current.summary || {};
    if (summary.primaryBottleneck) {
        findings.push(summary.primaryBottleneck);
    }
    if (summary.failedTools > 0) {
        findings.push(`有 ${summary.failedTools} 个工具调用失败，优先查看工具执行区的失败结果和输入参数。`);
    }
    if (summary.totalContextTokens > 24000) {
        findings.push(`累计上下文约 ${formatTokens(summary.totalContextTokens)} tokens，可能需要压缩历史、缩短工具 observation 或延迟加载能力契约。`);
    }
    const slowRound = [...(current.rounds || [])]
        .map((round) => ({ round, duration: roundDuration(round).total }))
        .sort((a, b) => b.duration - a.duration)[0];
    if (slowRound?.duration > 0) {
        findings.push(`最慢轮次是第 ${Number(slowRound.round.iteration) + 1} 轮，约 ${formatDuration(slowRound.duration)}，建议先看该轮 LLM 与工具耗时分解。`);
    }
    if (summary.debugPaused) {
        findings.push(`当前停在第 ${Number(summary.pausedAtIteration ?? 0) + 1} 轮后，下一步将进入第 ${Number(summary.nextIteration ?? 0) + 1} 轮。`);
    }
    if ((summary.status || current.status) === 'interrupted') {
        findings.push('本次运行已被用户强制中断。上下文、工具调用和中断前的耗时仍保留，可直接查看时间线定位卡点。');
    }
    return findings.length ? findings : ['暂未发现明显单点瓶颈，可以查看每轮上下文确认是否存在提示冗余或工具选择漂移。'];
}

function renderMetrics() {
    clear(elements.metrics);
    const summary = analysis?.summary || {};
    const metrics = [
        ['状态', summary.status || analysis?.status || '-'],
        ['总耗时', formatDuration(summary.durationMs)],
        ['轮次', String(summary.rounds ?? 0)],
        ['上下文 Token', formatTokens(summary.totalContextTokens)],
        ['LLM Token', formatTokens(summary.usage?.totalTokens)],
        ['工具调用', String(summary.toolCalls ?? 0)]
    ];
    metrics.forEach(([label, value]) => {
        const item = append(elements.metrics, 'metric');
        append(item, 'metric-value', value);
        append(item, 'metric-label', label);
    });
}

function renderRuns() {
    clear(elements.runList);
    if (!runs.length) {
        elements.runList?.appendChild(createEmpty('还没有 Agent 分析记录。'));
        return;
    }
    runs.slice(0, 40).forEach((run) => {
        const item = document.createElement('button');
        item.type = 'button';
        item.className = `run-item${run.runId === selectedRunId ? ' active' : ''}`;
        append(item, 'run-title', compact(run.message || run.intent || run.runId, 72));
        append(item, 'meta', [
            run.status || 'unknown',
            run.sessionId || 'main',
            formatDuration(run.durationMs),
            formatTime(run.iso)
        ].filter(Boolean).join(' | '));
        item.addEventListener('click', () => {
            void loadAnalysis(run.runId);
        });
        elements.runList?.appendChild(item);
    });
}

function renderDiagnostics() {
    clear(elements.findings);
    clear(elements.timeline);
    buildFindings().forEach((finding, index) => {
        const node = append(elements.findings, `finding ${index === 0 ? 'medium' : 'low'}`, finding);
        node.title = finding;
    });
    const items = Array.isArray(analysis?.timeline) ? analysis.timeline.slice(-16) : [];
    if (!items.length) {
        elements.timeline?.appendChild(createEmpty('暂无时间线。'));
        return;
    }
    items.forEach((entry) => {
        const severity = entry.ok === false ? 'high' : entry.kind === 'tool' ? 'medium' : 'low';
        const line = [
            entry.title || entry.type,
            entry.status ? `状态 ${entry.status}` : '',
            entry.durationMs ? `耗时 ${formatDuration(entry.durationMs)}` : '',
            entry.preview ? compact(entry.preview, 120) : ''
        ].filter(Boolean).join(' · ');
        append(elements.timeline, `finding ${severity}`, line);
    });
}

function renderRoundList() {
    clear(elements.roundList);
    const rounds = Array.isArray(analysis?.rounds) ? analysis.rounds : [];
    if (!rounds.length) {
        elements.roundList?.appendChild(createEmpty('暂无轮次。运行一次任务后会按轮次展示。'));
        return;
    }
    rounds.forEach((round, index) => {
        const health = roundHealth(round);
        const duration = roundDuration(round);
        const item = document.createElement('button');
        item.type = 'button';
        item.className = `round-item${index === selectedRoundIndex ? ' active' : ''}`;
        append(item, 'round-title', `${round.label || `第 ${index + 1} 轮`} · ${health.label}`);
        append(item, 'meta', [
            `上下文 ${formatTokens(round.approxInputTokens)}`,
            `LLM ${formatDuration(duration.llm)}`,
            `工具 ${formatDuration(duration.tools)}`,
            `动作 ${round.decision?.action || '-'}`
        ].join(' | '));
        item.addEventListener('click', () => {
            selectedRoundIndex = index;
            renderRoundList();
            renderRoundDetail();
        });
        elements.roundList?.appendChild(item);
    });
}

function renderMessages(round) {
    const card = append(elements.roundDetail, 'detail-card');
    const head = append(card, 'panel-head');
    append(head, 'panel-title', '本轮完整对话上下文');
    append(head, 'panel-copy', `模型在这一轮实际看到 ${round.messages?.length || 0} 条消息。`);
    const body = append(card, 'detail-body');
    const messages = Array.isArray(round.messages) ? round.messages : [];
    if (!messages.length) {
        body.appendChild(createEmpty('该轮没有捕获到上下文快照。'));
        return;
    }
    messages.forEach((message) => {
        const item = append(body, 'message');
        append(item, 'message-role', message.role || 'message');
        append(item, 'message-text', messageContent(message));
    });
}

function renderTools(round) {
    const card = append(elements.roundDetail, 'detail-card');
    const head = append(card, 'panel-head');
    append(head, 'panel-title', '工具执行情况');
    append(head, 'panel-copy', '这里按工具输入、状态、耗时和 observation 摘要展开。');
    const body = append(card, 'detail-body tool-table');
    const tools = Array.isArray(round.tools) ? round.tools : [];
    if (!tools.length) {
        body.appendChild(createEmpty('本轮没有执行工具，可能只是加载能力上下文或生成最终回答。'));
        return;
    }
    tools.forEach((tool) => {
        const row = append(body, 'tool-row');
        append(row, '', tool.tool || tool.callId || 'tool');
        const status = append(row, `badge ${tool.ok === false ? 'fail' : tool.ok === true ? 'ok' : ''}`, tool.status || 'started');
        status.title = tool.callId || '';
        append(row, '', formatDuration(tool.durationMs));
        const preview = append(row, 'tool-preview');
        append(preview, '', compact(tool.resultPreview || JSON.stringify(tool.args || {}), 260));
        const outputArtifact = formatOutputArtifact(tool.outputStore);
        if (outputArtifact) {
            const artifact = append(preview, 'output-artifact', outputArtifact);
            artifact.title = tool.outputStore?.path || outputArtifact;
        }
    });
}

function renderProgressNotes(round) {
    const notes = Array.isArray(round.progressNotes) ? round.progressNotes.filter((note) => note?.text) : [];
    if (!notes.length && !round.decision?.publicReasoning) {
        return;
    }
    const card = append(elements.roundDetail, 'detail-card');
    const head = append(card, 'panel-head');
    append(head, 'panel-title', '模型公开进展');
    append(head, 'panel-copy', '这里展示模型主动给用户看的关键进展，不展示隐藏推理链。');
    const body = append(card, 'detail-body');
    const visibleNotes = notes.length
        ? notes
        : [{
              text: round.decision.publicReasoning,
              source: round.decision.progressNoteSource || 'model_public_reasoning',
              action: round.decision.action || '',
              intent: round.decision.intent || ''
          }];
    visibleNotes.forEach((note) => {
        const item = append(body, 'summary-line');
        append(item, 'message-role', [
            note.source || 'model_progress',
            note.action ? `action=${note.action}` : '',
            note.intent ? `intent=${note.intent}` : ''
        ].filter(Boolean).join(' | '));
        append(item, 'message-text', note.text);
    });
}

function renderRoundDetail() {
    clear(elements.roundDetail);
    const rounds = Array.isArray(analysis?.rounds) ? analysis.rounds : [];
    const round = rounds[selectedRoundIndex] || rounds[0];
    if (!round) {
        elements.roundDetail?.appendChild(createEmpty('请选择一个 run。'));
        return;
    }
    const health = roundHealth(round);
    const duration = roundDuration(round);
    const summaryCard = append(elements.roundDetail, 'detail-card');
    const head = append(summaryCard, 'panel-head');
    append(head, 'panel-title', `${round.label || `第 ${Number(round.iteration) + 1} 轮`} 分析`);
    append(head, 'panel-copy', `本轮状态：${health.label}`);
    const body = append(summaryCard, 'detail-body');
    append(body, 'summary-line', `Agent 决策：${round.decision?.summary || round.decision?.publicReasoning || '未记录决策摘要。'}`);
    append(body, 'summary-line', `动作：${round.decision?.action || '-'}，意图：${round.decision?.intent || '-'}，风险：${round.decision?.riskLevel || '-'}`);
    append(body, 'summary-line', `耗时拆解：LLM ${formatDuration(duration.llm)}，工具 ${formatDuration(duration.tools)}，本轮合计 ${formatDuration(duration.total)}。`);
    append(body, 'summary-line', `上下文规模：约 ${formatTokens(round.approxInputTokens)} tokens，${round.promptBudget?.total_chars ? `${round.promptBudget.total_chars} chars` : '字符数未知'}。`);
    const targetTool = round.decision?.toolCall;
    if (targetTool) {
        append(body, 'summary-line', `计划调用工具：${targetTool.tool || '-'}，标题：${targetTool.title || '-'}。`);
    }
    renderProgressNotes(round);
    renderTools(round);
    renderMessages(round);
}

function renderAnalysis() {
    const summary = analysis?.summary || {};
    const isRunning = (summary.status || analysis?.status) === 'running' || runs.some((run) =>
        run.runId === selectedRunId && run.status === 'running'
    );
    elements.runSummary.textContent = analysis
        ? [
            `runId ${analysis.runId}`,
            `session ${analysis.sessionId || 'main'}`,
            summary.debugPaused ? `停在第 ${Number(summary.pausedAtIteration ?? 0) + 1} 轮后` : ''
        ].filter(Boolean).join(' | ')
        : '选择或运行一个 Agent 任务后显示。';
    elements.nextRoundBtn.disabled = busy || !summary.debugPaused || !summary.debugSessionId;
    if (elements.interruptRunBtn) {
        elements.interruptRunBtn.disabled = !busy && (!selectedRunId || !isRunning);
    }
    renderMetrics();
    renderDiagnostics();
    renderRoundList();
    renderRoundDetail();
    renderRuns();
}

async function refreshRuns({ silent = false, selectLatest = false } = {}) {
    if (!window.ailisDesktop?.agentLab?.listRuns) {
        setStatus('当前环境不支持 Electron Agent Lab IPC；请从桌面端打开。');
        renderAnalysis();
        return;
    }
    if (!silent) {
        setStatus('正在刷新运行记录...');
    }
    const result = await window.ailisDesktop.agentLab.listRuns({ limit: 60 });
    runs = Array.isArray(result?.runs) ? result.runs : [];
    const next = selectLatest ? runs[0]?.runId : selectedRunId || runs[0]?.runId;
    renderRuns();
    if (next) {
        await loadAnalysis(next, { silent: true });
    } else {
        renderAnalysis();
    }
    if (!silent) {
        setStatus('运行记录已刷新。');
    }
}

async function loadAnalysis(runId, { silent = false } = {}) {
    if (!runId || !window.ailisDesktop?.agentLab?.getRunAnalysis) {
        return;
    }
    selectedRunId = runId;
    if (!silent) {
        setStatus('正在读取 run 分析...');
    }
    const result = await window.ailisDesktop.agentLab.getRunAnalysis({
        runId,
        transcriptLimit: 4000
    });
    if (result?.ok) {
        analysis = result;
        selectedRoundIndex = Math.min(selectedRoundIndex, Math.max(0, (analysis.rounds?.length || 1) - 1));
        if (analysis.summary?.debugPaused && Number.isFinite(Number(analysis.summary.pausedAtIteration))) {
            selectedRoundIndex = Math.max(0, Number(analysis.summary.pausedAtIteration));
        }
        renderAnalysis();
        setStatus(analysis.summary?.debugPaused ? '已暂停，可以点击下一轮继续。' : '分析已加载。');
    } else {
        setStatus(`读取分析失败：${result?.error || result?.status || 'unknown'}`);
    }
}

function buildRunPayload({ stepMode = false } = {}) {
    const sessionId = elements.sessionInput.value.trim() || 'agent-lab';
    const maxAgentSteps = Math.max(1, Math.min(Number(elements.maxStepsInput.value || 12), 80));
    const autoConfirm = elements.autoConfirmCheck.checked === true;
    return {
        message: elements.taskInput.value.trim(),
        sessionId,
        agentLoop: 'llm',
        planner: 'llm',
        maxAgentSteps,
        dryRun: elements.dryRunCheck.checked === true && !stepMode,
        autoConfirm,
        debugBreakAfterRound: stepMode,
        analysis: { transcriptLimit: 4000 },
        context: {
            sessionId,
            sessionKey: sessionId,
            agentLoop: 'llm',
            planner: 'llm',
            maxAgentSteps,
            autoConfirm,
            approved: autoConfirm,
            confirmationPolicy: autoConfirm ? 'auto' : 'manual',
            debugBreakAfterRound: stepMode,
            agentLabStepMode: stepMode,
            source: 'agent-analysis-lab'
        }
    };
}

async function runTask({ stepMode = false } = {}) {
    if (!window.ailisDesktop?.agentLab?.runTask) {
        setStatus('当前环境不支持 Agent Lab IPC。');
        return;
    }
    const payload = buildRunPayload({ stepMode });
    if (!payload.message) {
        setStatus('请先输入一个测试任务。');
        elements.taskInput.focus();
        return;
    }
    busy = true;
    renderAnalysis();
    setStatus(stepMode ? '正在启动逐轮调试...' : '正在运行完整 Agent Loop...');
    try {
        const result = await window.ailisDesktop.agentLab.runTask(payload);
        analysis = result?.analysis || null;
        selectedRunId = result?.runId || analysis?.runId || selectedRunId;
        selectedRoundIndex = Math.max(0, (analysis?.rounds?.length || 1) - 1);
        await refreshRuns({ silent: true, selectLatest: true });
        if (selectedRunId) {
            await loadAnalysis(selectedRunId, { silent: true });
        }
        setStatus(analysis?.summary?.debugPaused ? '第一个断点已命中，可以分析后继续下一轮。' : '任务运行完成。');
    } catch (error) {
        setStatus(`运行失败：${error.message || error}`);
    } finally {
        busy = false;
        renderAnalysis();
    }
}

async function continueRound() {
    const summary = analysis?.summary || {};
    if (!summary.debugSessionId || !selectedRunId) {
        setStatus('当前 run 没有可继续的断点。');
        return;
    }
    busy = true;
    renderAnalysis();
    setStatus(`正在进入第 ${Number(summary.nextIteration ?? 0) + 1} 轮...`);
    try {
        const result = await window.ailisDesktop.agentLab.continueTask({
            runId: selectedRunId,
            debugSessionId: summary.debugSessionId,
            debugBreakAfterRound: true,
            analysis: { transcriptLimit: 4000 },
            context: {
                runId: selectedRunId,
                debugSessionId: summary.debugSessionId,
                approved: elements.autoConfirmCheck.checked === true,
                autoConfirm: elements.autoConfirmCheck.checked === true,
                agentLabStepMode: true,
                debugBreakAfterRound: true
            }
        });
        analysis = result?.analysis || analysis;
        selectedRoundIndex = Math.max(0, (analysis?.rounds?.length || 1) - 1);
        await loadAnalysis(selectedRunId, { silent: true });
        setStatus(analysis?.summary?.debugPaused ? '下一轮已执行并暂停。' : '调试任务已结束。');
    } catch (error) {
        setStatus(`继续失败：${error.message || error}`);
    } finally {
        busy = false;
        renderAnalysis();
    }
}

async function interruptRun() {
    if (!window.ailisDesktop?.agentLab?.interruptTask) {
        setStatus('当前环境不支持 Agent 中断 IPC。');
        return;
    }
    const sessionId = elements.sessionInput.value.trim() || analysis?.sessionId || 'agent-lab';
    const targetRunId = selectedRunId || analysis?.runId || '';
    setStatus(targetRunId ? '正在中断当前 run...' : '正在按 session 中断当前任务...');
    try {
        const result = await window.ailisDesktop.agentLab.interruptTask({
            runId: targetRunId,
            sessionId,
            reason: 'agent_lab_user_interrupt',
            source: 'agent-analysis-lab'
        });
        if (!result?.ok) {
            setStatus(`中断失败：${result?.error || result?.status || '没有找到正在运行的任务'}`);
            return;
        }
        selectedRunId = result.runId || selectedRunId;
        await refreshRuns({ silent: true });
        if (selectedRunId) {
            await loadAnalysis(selectedRunId, { silent: true });
        }
        setStatus('已发送中断请求，已产生的数据会保留在当前 run。');
    } catch (error) {
        setStatus(`中断失败：${error.message || error}`);
    } finally {
        renderAnalysis();
    }
}

function scheduleRefresh(runId) {
    if (!runId || runId !== selectedRunId) {
        return;
    }
    if (refreshTimer) {
        clearTimeout(refreshTimer);
    }
    refreshTimer = setTimeout(() => {
        refreshTimer = null;
        void loadAnalysis(runId, { silent: true });
    }, 700);
}

elements.runDebugBtn?.addEventListener('click', () => void runTask({ stepMode: true }));
elements.runFullBtn?.addEventListener('click', () => void runTask({ stepMode: false }));
elements.nextRoundBtn?.addEventListener('click', () => void continueRound());
elements.interruptRunBtn?.addEventListener('click', () => void interruptRun());
elements.refreshBtn?.addEventListener('click', () => void refreshRuns());
elements.openControlBtn?.addEventListener('click', () => void window.ailisDesktop?.showControlPanel?.());
elements.closeBtn?.addEventListener('click', () => void window.ailisDesktop?.closeCurrentWindow?.());

window.ailisDesktop?.gateway?.onEvent?.((event = {}) => {
    const runId = event.payload?.runId || event.runId || '';
    if (/^(agent|tool|runtime)\./.test(event.type || '')) {
        scheduleRefresh(runId);
    }
    if (event.type === 'agent.run.finished' || event.type === 'agent.run.started') {
        void refreshRuns({ silent: true });
    }
});

window.addEventListener('DOMContentLoaded', () => {
    renderAnalysis();
    void refreshRuns({ silent: true });
});
