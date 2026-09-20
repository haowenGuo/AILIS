import { setMarkdownContent } from './markdown-renderer.js';
import { toAssistantPayload } from './ailis-chat-service.js';
import { submitTaskInput } from './task-interaction-client.js';
import { TaskResourcePresenter, resourceSize } from './task-resource-presenter.js';

export const taskSessionId = () => {
    let id = localStorage.getItem('session_id');
    if (!id) { id = `user_${crypto.randomUUID()}`; localStorage.setItem('session_id', id); }
    return id;
};
const labels = { starting: '正在启动', running: '正在运行', stopping: '正在停止…', stopped: '已停止',
    completed: '已完成', failed: '执行未完成', unknown: '需要确认', accepted: '已接收', queued: '待处理',
    included: '已带入模型请求', unprocessed: '未处理', rejected: '未接收', streaming: '生成中' };
const node = (tag, className, text) => {
    const element = document.createElement(tag); if (className) element.className = className;
    if (text !== undefined) element.textContent = text; return element;
};
const button = (label, action) => {
    const element = node('button', 'task-button', label); element.type = 'button'; element.addEventListener('click', action); return element;
};
const iconButton = (label, paths, action) => {
    const element = button('', action); element.classList.add('task-icon-button');
    element.title = label; element.setAttribute('aria-label', label);
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24'); svg.setAttribute('aria-hidden', 'true');
    for (const d of paths) { const path = document.createElementNS(svg.namespaceURI, 'path'); path.setAttribute('d', d); svg.append(path); }
    element.append(svg); return element;
};
const duration = run => {
    if (!Number.isFinite(run.startedAt) || !Number.isFinite(run.endedAt)) return '';
    const seconds = Math.max(0, Math.floor((run.endedAt - run.startedAt) / 1000));
    return seconds < 60 ? `${seconds} 秒` : `${Math.floor(seconds / 60)} 分 ${seconds % 60} 秒`;
};

// A reader of host records. Never invokes a model, shell, or patch from a rendered link.
export class TaskInteractionView {
    constructor({ api, list, dock, onState, notice, restoreDraft }) {
        Object.assign(this, { api, list, onState, notice, restoreDraft });
        this.sessionId = taskSessionId(); this.snapshot = { runs: [], activeRunId: '', seq: -1 }; this.rows = new Map();
        this.strip = node('div', 'task-status-strip'); this.strip.setAttribute('role', 'status');
        dock.prepend(this.strip);
        this.viewer = node('dialog', 'task-viewer'); this.viewer.setAttribute('aria-label', '任务成果预览');
        document.body.append(this.viewer);
        this.resources = new TaskResourcePresenter({ api, session: () => this.sessionId,
            showViewer: (title, content) => this.showViewer(title, content), notice });
        this.viewer.addEventListener('close', () => { if (!this.viewer.open) this.viewer.replaceChildren(); });
        this.unsubscribe = api.onEvent(event => {
            if (event.sessionId !== this.sessionId && event.type !== 'session.select') return;
            if (event.type === 'storage-error') notice(event.error);
            if (!this.refreshTimer) this.refreshTimer = setTimeout(() => { this.refreshTimer = null; void this.refresh(); }, 120);
        });
        this.selectionChanged = () => {
            if (!document.getSelection()?.isCollapsed) return;
            for (const run of this.snapshot.runs) this.renderRun(run);
        };
        document.addEventListener('selectionchange', this.selectionChanged);
        void this.refresh();
    }
    async refresh() {
        const generation = this.refreshGeneration = (this.refreshGeneration || 0) + 1;
        try {
            const current = this.api.currentSession ? await this.api.currentSession({ sessionId: this.sessionId }) : { sessionId: this.sessionId };
            const data = await this.api.snapshot({ sessionId: current.sessionId });
            if (generation !== this.refreshGeneration) return;
            if (current.sessionId !== this.sessionId) {
                this.viewer.close(); this.resources.clear();
                this.sessionId = current.sessionId; localStorage.setItem('session_id', this.sessionId);
                this.rows.clear(); this.list.replaceChildren(); this.snapshot = { seq: -1, runs: [] };
            }
            if (data.seq < this.snapshot.seq) return;
            this.snapshot = data;
            for (const run of data.runs) this.renderRun(run);
            this.list.dataset.taskSeq = String(data.seq);
            this.renderStrip();
            this.onState(data);
        } catch (error) { this.notice(`读取任务记录失败：${error.message}`); }
    }
    renderStrip() {
        if (this.snapshot.storageError) {
            this.strip.hidden = false; this.strip.dataset.status = 'unknown';
            this.strip.textContent = this.snapshot.storageError; return;
        }
        // Normal progress belongs to its turn, not a second persistent composer banner.
        this.strip.hidden = true; this.strip.textContent = '';
    }
    renderRun(run) {
        let entry = this.rows.get(run.id);
        const fingerprint = JSON.stringify(run);
        if (entry?.fingerprint === fingerprint) return;
        const selection = document.getSelection();
        // Keep selected/copyable text stable while streaming; host/composer state keeps updating.
        // Apply the latest host snapshot when the selection is cleared.
        if (entry && selection && !selection.isCollapsed &&
            (entry.element.contains(selection.anchorNode) || entry.element.contains(selection.focusNode))) return;
        if (!entry) {
            entry = { element: node('section', 'task-run') };
            entry.element.dataset.runId = run.id; this.list.append(entry.element); this.rows.set(run.id, entry);
        }
        const fragment = document.createDocumentFragment();
        if (run.kind === 'history') {
            for (const item of run.items) {
                const element = node('div', `message-item ${item.kind === 'user' ? 'message-user task-user' : 'message-ai task-answer'}`);
                element.dataset.messageRole = item.kind; setMarkdownContent(element, item.text); fragment.append(element);
            }
            entry.element.replaceChildren(fragment); entry.fingerprint = fingerprint; return;
        }
        // Keep public progress and corrections in order. Raw tool records remain
        // in host logs, not in the conversation (including restored history).
        for (const item of run.items) {
            if (item.kind === 'tool') continue;
            if (item.kind === 'progress' && item.text) {
                const progress = node('div', 'message-item message-ai task-progress');
                progress.dataset.itemId = item.id; progress.dataset.messageRole = 'assistant';
                setMarkdownContent(progress, item.text); fragment.append(progress); continue;
            }
            if (item.kind !== 'user') continue;
            const message = node('div', 'message-item message-user task-user');
            message.dataset.itemId = item.id; message.dataset.messageRole = 'user'; message.append(node('div', '', item.text));
            if (['queued', 'unprocessed', 'rejected'].includes(item.status)) {
                const state = node('small', 'task-receipt', labels[item.status]);
                if (item.status === 'queued') state.title = '等待当前任务处理这条补充';
                message.append(state);
            }
            if (['unprocessed', 'rejected'].includes(item.status)) message.append(button('放回输入框', () => this.restoreDraft(item.text)));
            for (const attachment of item.attachments || []) {
                if (attachment.imageRef) this.addImage(message, run, attachment.imageRef, attachment.name);
                else message.append(node('small', 'task-attachment', attachment.name));
            }
            fragment.append(message);
        }
        const planItem = run.items.find(item => item.kind === 'plan');
        if (planItem?.plan?.length) {
            const plan = node('details', 'task-plan'); plan.dataset.itemId = planItem.id;
            plan.open = entry.element.querySelector('.task-plan')?.open ?? false;
            const completed = planItem.plan.filter(step => step.status === 'completed').length;
            const current = planItem.plan.find(step => step.status === 'in_progress');
            plan.append(node('summary', '', `计划 ${completed}/${planItem.plan.length}${current ? ` · ${current.step}` : ''}`));
            if (planItem.explanation) plan.append(node('p', '', planItem.explanation));
            const steps = node('ul', 'task-plan-steps');
            for (const step of planItem.plan) {
                const state = { completed: '已完成', in_progress: '进行中', pending: '待处理' }[step.status] || step.status;
                const row = node('li', '', `${state} · ${step.step}`); row.dataset.status = step.status; steps.append(row);
            }
            plan.append(steps); fragment.append(plan);
        }
        const tools = run.items.filter(item => item.kind === 'tool');
        const activeTool = tools.findLast(item => item.status === 'running');
        const active = ['starting', 'running'].includes(run.status);
        const elapsed = duration(run);
        const activity = activeTool ? '正在执行' :
            run.activity === '等待模型响应' ? 'AILIS正在思考' : run.activity || '思考中…';
        const summaryText = active ? activity : run.status === 'completed' ? (elapsed ? `已工作 ${elapsed}` : '查看执行过程') : labels[run.status] || run.status;
        if (run.status !== 'completed') {
            const status = node('p', 'task-activity', summaryText); status.dataset.status = run.status;
            if (run.status === 'stopping') status.title = '等待后台确认';
            if (run.status === 'stopped') status.title = '已产生的文件修改保留；未处理的追加消息不会自动执行';
            fragment.append(status);
        }
        const final = run.items.find(item => item.status === 'final' && item.kind === 'assistant');
        const draft = run.items.findLast(item => item.kind === 'draft' && item.status !== 'discarded' && item.text);
        if (final || draft) {
            const message = node('div', 'message-item message-ai task-answer'); message.dataset.messageRole = 'assistant';
            setMarkdownContent(message, toAssistantPayload((final || draft).text).display_text, this.resources.markdownOptions(run));
            if (!final && ['stopped', 'failed', 'unknown'].includes(run.status)) message.append(node('small', 'task-receipt', '未完成的输出'));
            fragment.append(message);
        }
        for (const item of run.items.filter(item => item.kind === 'file')) {
            const card = node('div', 'task-file-card');
            const title = node('div', 'task-file-title');
            title.append(node('strong', '', `${{ add: '已新增', edit: '已编辑', delete: '已删除', observed: '已写入' }[item.action]} ${item.name}`));
            if (Number.isFinite(item.added) && Number.isFinite(item.removed)) {
                const count = node('small', 'task-diff-count');
                count.append(node('span', 'task-added', `+${item.added}`), node('span', 'task-removed', `−${item.removed}`)); title.append(count);
            }
            card.append(title, button('查看改动', () => this.openFile(run, item)));
            if (item.artifactRef) card.append(...this.resources.actions(run, item));
            fragment.append(card);
        }
        for (const item of run.items.filter(item => item.kind === 'artifact')) {
            const card = node('div', 'task-file-card task-artifact-card'); card.dataset.itemId = item.id;
            const title = node('div', 'task-file-title'); title.append(node('strong', '', item.name));
            title.append(node('small', '', item.artifactRef ? `${item.artifactRef.mime} · ${resourceSize(item.artifactRef.bytes)}` : item.artifactError));
            card.append(title);
            if (item.artifactRef) card.append(...this.resources.actions(run, item));
            fragment.append(card);
        }
        for (const item of run.items.filter(item => item.kind === 'image')) this.addImage(fragment, run, item.imageRef, item.name || '工具返回的图片');
        if (run.error && run.error !== this.snapshot.storageError) fragment.append(node('div', 'task-error', typeof run.error === 'string' ? run.error : JSON.stringify(run.error)));
        if (run.status === 'unknown' && !run.storageError) fragment.append(button('确认旧任务已退出', async () => {
            if (!window.confirm('请先检查并确认旧任务及其命令进程已经退出。确认只会解除会话锁定，不会重跑消息或撤销文件。')) return;
            try {
                const result = await this.api.confirmRecovery({ sessionId: this.sessionId, expectedRunId: run.id, confirmedExited: true });
                if (!result.ok) throw new Error(result.error); await this.refresh();
            } catch (error) { this.notice(error.message); }
        }));
        const actions = node('div', 'task-turn-actions');
        if (final || draft) actions.append(iconButton('复制回答', ['M9 9h11v11H9z', 'M5 15H4V4h11v1'], () => navigator.clipboard.writeText((final || draft).text).catch(error => this.notice(error.message))));
        actions.append(iconButton('任务详情', ['M4 12h1', 'M11.5 12h1', 'M19 12h1'], () => {
            const details = node('div', 'task-metadata');
            details.append(node('pre', '', `会话：${this.sessionId}\n任务：${run.id}\n状态：${labels[run.status] || run.status}\n模型：${run.model || '尚无记录'}\n连接：${run.provider || '尚无记录'}`));
            for (const item of run.items.filter(item => item.kind === 'user')) details.append(node('p', 'task-receipt', `${labels[item.status] || item.status} · ${item.text}`));
            this.showViewer('任务详情', details);
        }));
        // No floating ellipsis under an unfinished, otherwise empty answer.
        if (!active) fragment.append(actions);
        entry.element.replaceChildren(fragment); entry.fingerprint = fingerprint;
    }
    async addImage(parent, run, ref, label) {
        if (!ref) return;
        const figure = node('figure', 'task-image'); parent.append(figure);
        try {
            const resource = await this.api.resource({ sessionId: this.sessionId, runId: run.id, resourceId: ref.id });
            const image = node('img'); image.src = resource.dataUrl; image.alt = label; image.loading = 'lazy';
            const enlarge = button('', () => this.showViewer(label, image.cloneNode()));
            enlarge.className = 'task-image-open'; enlarge.title = '放大图片'; enlarge.setAttribute('aria-label', `放大图片：${label}`);
            enlarge.append(image); figure.append(enlarge);
        } catch (error) { figure.textContent = `图片无法读取：${error.message}`; }
    }
    showViewer(title, content) {
        const close = button('关闭', () => this.viewer.close());
        this.viewer.classList.remove('task-viewer-expanded');
        const expand = button('放大', () => {
            const expanded = this.viewer.classList.toggle('task-viewer-expanded');
            expand.textContent = expanded ? '还原' : '放大';
        });
        const header = node('header'); header.append(node('strong', '', title), expand, close);
        this.viewer.replaceChildren(header, content);
        if (!this.viewer.open) this.viewer.showModal(); close.focus();
    }
    async openResource(run, ref, title) {
        try {
            const data = await this.api.resource({ sessionId: this.sessionId, runId: run.id, resourceId: ref.id });
            this.showViewer(title, node('pre', 'task-output', data.text));
        } catch (error) { this.notice(error.message); }
    }
    async openToolOutput(run, item, offset = 0) {
        try {
            const result = await this.api.toolOutput({ sessionId: this.sessionId, runId: run.id, itemId: item.id, offset });
            const content = node('div');
            content.append(node('small', 'task-receipt', `字节 ${result.offset}–${result.nextOffset} / ${result.totalBytes} · 原始存档，分页读取`), node('pre', 'task-output', result.text));
            if (offset > 0) content.append(button('上一页', () => this.openToolOutput(run, item, Math.max(0, offset - 16384))));
            if (result.hasMore) content.append(button('下一页', () => this.openToolOutput(run, item, result.nextOffset)));
            this.showViewer(`${item.tool} · 完整输出`, content);
        } catch (error) { this.notice(error.message); }
    }
    async openFile(run, item) {
        try {
            const read = ref => ref ? this.api.resource({ sessionId: this.sessionId, runId: run.id, resourceId: ref.id }) : Promise.resolve(null);
            const [before, after, diffResource] = await Promise.all([read(item.beforeRef), read(item.afterRef), read(item.diffRef)]);
            const content = node('div'); content.append(node('p', 'task-receipt', `${item.path}\n${item.note || ''}\n${item.afterBytes ?? 0} 字节 · ${item.uncertain ? '原内容未捕获' : '本次写入快照'}`));
            content.append(button('打开所在目录', async () => {
                try {
                    const result = await this.api.revealFile({ sessionId: this.sessionId, runId: run.id, itemId: item.id });
                    if (result.changedSince) this.notice('当前文件已变化；这里展示的仍是该次任务的快照。');
                } catch (error) { this.notice(error.message); }
            }));
            if (diffResource) {
                const diff = JSON.parse(diffResource.text);
                content.append(node('small', 'task-receipt', `新增 ${diff.added} 行 · 删除 ${diff.removed} 行${diff.trailingNewlineChanged ? ' · 文件末尾换行发生变化' : ''}`));
                const code = node('pre', 'task-unified-diff');
                for (const line of diff.entries) code.append(node('span', `task-diff-${line.type}`, `${line.oldLine || ' '}\t${line.newLine || ' '}\t${{ add: '+', remove: '−', same: ' ' }[line.type]} ${line.text}\n`));
                content.append(code);
            }
            const columns = node('div', 'task-diff');
            for (const [label, data, bytes] of [['写入前', before, item.beforeBytes], ['写入后', after, item.afterBytes]]) {
                const column = node('section'); column.append(node('h3', '', label), node('pre', '', data?.text ?? (bytes === null ? '文件不存在 / 未捕获' : '二进制或大文件，仅保存元数据'))); columns.append(column);
            }
            if (!diffResource) content.append(columns);
            this.showViewer(`${item.name} · 只读改动`, content);
        } catch (error) { this.notice(error.message); }
    }
    async send(text, attachments) {
        const result = await submitTaskInput({ api: this.api, sessionId: this.sessionId, expectedRunId: this.snapshot.activeRunId, text, attachments });
        await this.refresh(); return result;
    }
    async newConversation() { return this.selectConversation({ createNew: true }); }
    async selectConversation(target) {
        const result = await this.api.switchSession({ expectedSessionId: this.sessionId, ...target });
        if (!result.ok) throw new Error(result.error);
        this.viewer.close(); await this.refresh();
    }
    async showHistory() {
        try {
            const catalog = await this.api.sessionList();
            const content = node('div', 'task-session-list');
            for (const session of catalog.sessions) {
                const entry = button(`${session.sessionId === catalog.currentSessionId ? '当前 · ' : ''}${session.title}`, async () => {
                    try { await this.selectConversation({ targetSessionId: session.sessionId }); } catch (error) { this.notice(error.message); }
                });
                entry.title = session.sessionId;
                content.append(entry, node('small', 'task-receipt', `${session.runCount} 个任务${session.updatedAt ? ` · ${new Date(session.updatedAt).toLocaleString()}` : ''}`));
            }
            this.showViewer('历史会话', content);
        } catch (error) { this.notice(error.message); }
    }
    async stop() {
        const result = await this.api.stop({ sessionId: this.sessionId, expectedRunId: this.snapshot.activeRunId });
        if (!result.ok) throw new Error(result.error); await this.refresh();
    }
    dispose() { this.unsubscribe?.(); clearTimeout(this.refreshTimer); this.resources.dispose(); document.removeEventListener('selectionchange', this.selectionChanged); this.viewer.remove(); }
}
