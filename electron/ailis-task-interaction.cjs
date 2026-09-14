'use strict';
// Presentation/lifecycle records only. The Session context remains the sole model history.
const fs = require('node:fs');
const path = require('node:path');
const { createHash, randomUUID } = require('node:crypto');
const { EventEmitter } = require('node:events');
const { AILISSessionContextStore } = require('./ailis-session-context-store.cjs');
const { lineDiff } = require('./ailis-task-file-diff.cjs');
const hash = value => createHash('sha256').update(value).digest('hex');
const copy = value => JSON.parse(JSON.stringify(value));
const LIVE = new Set(['starting', 'running', 'stopping']);
const CATALOG = '__task_interaction_sessions_v1__';
const fail = (status, error) => ({ ok: false, status, error });

class AILISTaskInteraction extends EventEmitter {
    constructor({ rootDir, gateway, getSettings = () => ({}), getLegacyHistory = () => null }) {
        super();
        this.root = path.resolve(rootDir);
        this.gateway = gateway;
        this.getSettings = getSettings;
        this.getLegacyHistory = getLegacyHistory;
        this.sessions = new Map();
        this.active = new Map();
        this.serial = new Map();
        this.storageErrors = new Map();
        this.locks = new AILISSessionContextStore({ rootDir: path.join(this.root, 'owners') });
        this.listener = event => {
            const run = [...this.active.values()].find(run => run.id === event.payload?.runId);
            if (!run || this.storageErrors.has(run.sessionId)) return;
            try { this.observe(event); } catch (error) { this.storageFailure(run.sessionId, error); }
        };
        gateway.on('event', this.listener);
        // The gateway calls this only after its existing permission and safety gates.
        gateway.taskInteraction = this;
    }

    load(sessionId) {
        if (typeof sessionId !== 'string' || !sessionId.trim() || sessionId.length > 200) throw new Error('无效会话标识');
        if (this.sessions.has(sessionId)) return this.sessions.get(sessionId);
        const release = this.locks.acquireSession(sessionId);
        const file = path.join(this.root, `${hash(sessionId)}.jsonl`);
        const state = { sessionId, seq: 0, runs: [], receipts: {}, file, release };
        try {
            if (fs.existsSync(file)) {
                const data = fs.readFileSync(file, 'utf8');
                // Do not silently erase a damaged or interrupted journal write.
                for (const line of data.split('\n').filter(Boolean)) this.reduce(state, JSON.parse(line));
            }
            this.sessions.set(sessionId, state);
            if (state.seq === 0 && sessionId !== CATALOG) {
                const legacy = this.getLegacyHistory(sessionId)?.messages || [];
                if (legacy.length) this.record(sessionId, { type: 'run.add', run: {
                    id: `history_${hash(sessionId)}`, kind: 'history', status: 'completed',
                    startedAt: Date.now(), endedAt: Date.now(), items: legacy.filter(item => ['user', 'assistant'].includes(item.role)).map((item, index) => ({
                        id: `legacy_${index}`, kind: item.role, text: String(item.content || ''), status: item.role === 'user' ? 'included' : 'final',
                        attachments: (item.attachments || []).map(a => ({ name: a.name || a.label || '历史附件（原图未保存）', path: a.path || '' }))
                    }))
                } });
            }
            for (const run of state.runs.filter(run => LIVE.has(run.status))) {
                this.record(sessionId, { type: 'run.patch', runId: run.id,
                    patch: { status: 'unknown', endedAt: Date.now(), error: '宿主已重启，无法确认旧任务是否退出。未处理的追加没有自动重放。' } });
            }
            return state;
        } catch (error) { this.sessions.delete(sessionId); release(); throw error; }
    }

    reduce(state, event) {
        if (event.sessionId !== state.sessionId || event.seq !== state.seq + 1) throw new Error('任务记录序号不连续');
        if (event.type === 'run.add') state.runs.push(event.run);
        if (event.type === 'session.select') {
            state.currentSessionId = event.targetSessionId;
            state.sessionIds ||= [];
            if (!state.sessionIds.includes(event.targetSessionId)) state.sessionIds.push(event.targetSessionId);
        }
        if (event.type === 'receipt' || event.type === 'input') state.receipts[event.receipt.clientMessageId] = event.receipt;
        const run = state.runs.find(run => run.id === event.runId);
        if (run && event.type === 'run.patch') Object.assign(run, event.patch);
        if (run && (event.type === 'item' || event.type === 'input')) {
            const old = run.items.find(item => item.id === event.item.id);
            if (old) Object.assign(old, event.item); else run.items.push(event.item);
        }
        if (run && event.type === 'draft.delta') {
            let item = run.items.find(item => item.id === event.streamId);
            if (!item) { item = { id: event.streamId, kind: 'draft', text: '', status: 'streaming' }; run.items.push(item); }
            item.text += event.delta;
        }
        state.seq = event.seq;
    }

    record(sessionId, body) {
        if (this.storageErrors.has(sessionId)) throw new Error(this.storageErrors.get(sessionId));
        const state = this.load(sessionId);
        const event = { ...body, sessionId, seq: state.seq + 1, ts: Date.now() };
        // Durable before broadcast/receipt. A journal error must not look like acceptance.
        try {
            fs.mkdirSync(this.root, { recursive: true });
            const fd = fs.openSync(state.file, 'a');
            try { fs.writeFileSync(fd, `${JSON.stringify(event)}\n`); fs.fsyncSync(fd); } finally { fs.closeSync(fd); }
        } catch (error) { this.storageFailure(sessionId, error); throw error; }
        this.reduce(state, copy(event));
        this.emit('event', event);
        return event;
    }

    storageFailure(sessionId, error) {
        if (this.storageErrors.has(sessionId)) return;
        const message = `任务记录写入失败：${error.message}。已关闭后续执行入口；请检查磁盘和旧进程，修复后重启。现有文件修改不会回滚。`;
        this.storageErrors.set(sessionId, message);
        const run = this.active.get(sessionId);
        if (run) {
            clearTimeout(run.timer); run.timer = null; run.stopping = true;
            run.controller.abort('task_storage_failure');
            void Promise.resolve().then(() => this.gateway.interruptAgentRun({ runId: run.id, sessionId, source: 'task-storage-failure' })).catch(() => {});
            void Promise.resolve().then(() => this.gateway.computerTool?.runtime?.stopOwnedRun?.(run.id)).catch(() => {});
        }
        // This is explicitly an in-memory fault, not a successfully persisted terminal event.
        this.emit('storage-error', { sessionId, error: message });
    }

    snapshot(sessionId) {
        const { seq, runs } = this.load(sessionId);
        const storageError = this.storageErrors.get(sessionId) || '';
        const snapshot = copy({ sessionId, seq, runs, activeRunId: this.active.get(sessionId)?.id || '', storageError });
        if (storageError) for (const run of snapshot.runs.filter(run => LIVE.has(run.status))) {
            Object.assign(run, { status: 'unknown', storageError, error: storageError });
        }
        return snapshot;
    }

    receipt({ sessionId, clientMessageId }) {
        if (this.storageErrors.has(sessionId)) return fail('storage_error', this.storageErrors.get(sessionId));
        return copy(this.load(sessionId).receipts[clientMessageId] || { ok: false, status: 'not_received' });
    }

    currentSession({ sessionId } = {}) {
        return this.exclusive(CATALOG, () => {
            const catalog = this.load(CATALOG);
            if (!catalog.currentSessionId) {
                const target = sessionId && sessionId !== CATALOG ? sessionId : `user_${randomUUID()}`;
                this.load(target);
                this.record(CATALOG, { type: 'session.select', targetSessionId: target });
            }
            return { sessionId: catalog.currentSessionId };
        });
    }

    sessionList() {
        const catalog = this.load(CATALOG);
        return { currentSessionId: catalog.currentSessionId || '', sessions: [...(catalog.sessionIds || [])].reverse().map(sessionId => {
            const { runs } = this.snapshot(sessionId);
            return { sessionId, title: runs.flatMap(run => run.items).find(item => item.kind === 'user')?.text.slice(0, 70) || '新对话',
                updatedAt: runs.at(-1)?.endedAt || runs.at(-1)?.startedAt || 0, runCount: runs.filter(run => run.kind !== 'history').length };
        }) };
    }

    switchSession({ expectedSessionId, targetSessionId, createNew = false }) {
        return this.exclusive(CATALOG, () => {
            const catalog = this.load(CATALOG);
            if (!catalog.currentSessionId || expectedSessionId !== catalog.currentSessionId) return fail('session_conflict', '会话已切换，请刷新后重试');
            const current = this.snapshot(expectedSessionId);
            if (this.active.size || this.gateway.activeUnifiedTurns?.size || current.storageError || current.runs.some(run => run.status === 'unknown'))
                return fail('session_busy', '请先等待当前任务结束，或停止并确认退出，再切换会话');
            const target = createNew ? `user_${randomUUID()}` : targetSessionId;
            if (!createNew && !(catalog.sessionIds || []).includes(target)) return fail('invalid_session', '目标不在本地会话列表中');
            this.load(target);
            this.record(CATALOG, { type: 'session.select', targetSessionId: target });
            return { ok: true, sessionId: target };
        });
    }

    exclusive(sessionId, operation) {
        const prior = this.serial.get(sessionId) || Promise.resolve();
        const next = prior.catch(() => {}).then(operation);
        this.serial.set(sessionId, next);
        next.finally(() => { if (this.serial.get(sessionId) === next) this.serial.delete(sessionId); }).catch(() => {});
        return next;
    }

    submit(input = {}) {
        return this.exclusive(input.sessionId, async () => {
            const { sessionId, clientMessageId, expectedRunId = '' } = input;
            if (sessionId === CATALOG) return fail('invalid_session', '不能在会话目录中执行任务');
            const selected = this.sessions.get(CATALOG)?.currentSessionId;
            if (selected && selected !== sessionId) return fail('session_conflict', '会话已切换，消息未执行，草稿已保留');
            if (this.storageErrors.has(sessionId)) return fail('storage_error', this.storageErrors.get(sessionId));
            const state = this.load(sessionId);
            if (typeof clientMessageId !== 'string' || !/^[\w-]{8,100}$/.test(clientMessageId)) return fail('invalid_input', '缺少消息标识');
            const text = typeof input.text === 'string' ? input.text.trim() : '';
            const attachments = Array.isArray(input.attachments) ? input.attachments : [];
            if (!text || text.length > 200000) return fail('invalid_input', '消息为空或超过 200,000 字符');
            const fingerprint = hash(JSON.stringify({ text, attachments, expectedRunId, kind: input.kind || 'task', ephemeralDeveloperMessage: input.ephemeralDeveloperMessage || '' }));
            const old = state.receipts[clientMessageId];
            if (old) return old.fingerprint === fingerprint ? copy(old) : fail('message_id_conflict', '消息标识已用于其他内容');
            const active = this.active.get(sessionId);
            const proactive = input.kind === 'proactive';
            if (proactive && (active || expectedRunId)) return fail('session_busy', '用户任务正在执行，本次主动搭话已跳过');
            if (active && (active.id !== expectedRunId || active.stopping)) return fail('run_conflict', '任务状态已改变，草稿已保留，请刷新后重试');
            if (active && attachments.length) return fail('attachments_while_running', '运行中仅支持追加文字；附件和草稿已保留');
            let savedAttachments;
            try { savedAttachments = attachments.map(a => this.persistAttachment(a)); }
            catch (error) { return fail('invalid_attachment', error.message); }
            if (!active && this.gateway.activeUnifiedTurns?.has(sessionId)) return fail('session_busy', '此会话已有其他入口正在执行，请等待其结束');
            // Unknown recovery requires explicit user confirmation, never side-effect replay.
            if (!active && state.runs.some(run => run.status === 'unknown')) return fail('recovery_required', '旧任务状态未知，请先确认旧任务及其进程已经退出');
            const id = active?.id || `agent_${randomUUID()}`;
            const receipt = { ok: true, status: active ? 'queued' : 'accepted', sessionId, runId: id,
                clientMessageId, fingerprint, startsNewRun: !active, followedEndedRun: !active && Boolean(expectedRunId) };
            if (!active) this.record(sessionId, { type: 'run.add', run: { id, kind: proactive ? 'proactive' : 'task', status: 'starting', startedAt: Date.now(), items: [] } });
            // Message body and receipt are one durable record: a lost IPC reply
            // can never acknowledge an input whose body was not persisted.
            this.record(sessionId, { type: 'input', receipt, runId: id, item: { id: clientMessageId, kind: proactive ? 'progress' : 'user', text: proactive ? '主动搭话 · 使用当前会话' : text,
                status: active ? 'queued' : 'accepted', attachments: savedAttachments, createdAt: Date.now() } });
            const request = { sessionId, runId: id, message: text, attachments: attachments.map(({ dataUrl, ...metadata }) => metadata),
                modelImageAttachments: attachments.filter(a => /^data:image\//.test(a.dataUrl || '')).map(a => ({ image_url: a.dataUrl, detail: 'original' })),
                agentLoop: 'llm', directToolExecutor: true,
                context: { workspace: this.gateway.workspaceRoot, runtimeKind: 'desktop', agentLoop: 'llm',
                    directToolExecutor: true, agentRole: 'unified_agent', unifiedAgent: true, taskAgentRoutingOwned: false },
                llmSettings: this.getSettings() };
            if (proactive) {
                request.suppressCurrentUserMessage = true;
                request.ephemeralDeveloperMessage = String(input.ephemeralDeveloperMessage || '');
                Object.assign(request.context, { suppressCurrentUserMessage: true, ephemeralDeveloperMessage: request.ephemeralDeveloperMessage });
            }
            if (active) {
                let result;
                try { result = await this.gateway.runAgent({ ...request, expectedRunId: id, clientMessageId }); }
                catch (error) { result = fail('rejected', error.message); }
                if (!result?.steerAccepted) {
                    const rejected = { ...receipt, ...fail('rejected', result?.displayText || result?.error || '此轮已关闭追加入口，消息未执行') };
                    this.record(sessionId, { type: 'input', receipt: rejected, runId: id, item: { id: clientMessageId, status: 'rejected', error: rejected.error } });
                    return rejected;
                }
                return receipt;
            }
            const running = { id, sessionId, stopping: false, controller: new AbortController(), tools: new Set() };
            this.active.set(sessionId, running);
            running.promise = Promise.resolve().then(async () => {
                let result;
                try {
                    result = await this.gateway.runAgent({ ...request, interactionStart: true, abortSignal: running.controller.signal,
                        onTextDelta: (delta, metadata) => this.delta(running, delta, metadata),
                        onTextStreamEvent: event => this.stream(running, event) });
                } catch (error) { result = fail('failed', error.message); }
                if (running.stopping) {
                    // A wrapper timeout is not proof that the underlying operation exited.
                    while (running.tools.size) await Promise.allSettled([...running.tools]);
                    try { running.exitConfirmed = await this.gateway.computerTool?.runtime?.stopOwnedRun?.(id) ?? true; }
                    catch { running.exitConfirmed = false; }
                }
                this.flush(running);
                const stopped = running.stopping || result?.status === 'interrupted';
                const status = stopped ? (running.exitConfirmed === false ? 'unknown' : 'stopped') : result?.ok === true && result?.status === 'completed' ? 'completed' : 'failed';
                const finalText = result?.displayText || result?.text || '';
                if (!stopped && finalText) this.record(sessionId, { type: 'item', runId: id,
                    item: { id: `${id}:final`, kind: 'assistant', text: finalText, status: 'final', speechText: result.speechText || finalText } });
                for (const item of this.load(sessionId).runs.find(run => run.id === id).items.filter(item => item.kind === 'user' && ['queued', 'accepted'].includes(item.status))) {
                    this.record(sessionId, { type: 'item', runId: id, item: { id: item.id, status: 'unprocessed' } });
                }
                this.active.delete(sessionId);
                this.record(sessionId, { type: 'run.patch', runId: id, patch: { status, endedAt: Date.now(),
                    error: status === 'unknown' ? '无法确认本任务的命令进程已经退出，请人工检查。' : status === 'failed' ? result?.error?.message || result?.error || finalText || `执行未完成：${result?.status || 'unknown'}` : '' } });
            }).catch(error => {
                // Keep ownership blocked if durable terminal-state recording fails.
                this.active.set(sessionId, running);
                this.storageFailure(sessionId, error);
            });
            return receipt;
        });
    }

    async proactive(input) {
        // Same pre-existing proactive context, gates and unified Agent; no user-message forgery.
        const receipt = await this.submit({ ...input, kind: 'proactive', text: input.message, expectedRunId: '' });
        if (!receipt.ok) return receipt;
        await this.active.get(input.sessionId)?.promise;
        const run = this.snapshot(input.sessionId).runs.find(run => run.id === receipt.runId);
        const final = run?.items.find(item => item.kind === 'assistant' && item.status === 'final');
        return { ok: run?.status === 'completed', status: run?.status, text: final?.text || '', displayText: final?.text || '',
            model: run?.model || '', hostOwned: true, error: run?.error || '' };
    }

    stop({ sessionId, expectedRunId }) {
        return this.exclusive(sessionId, async () => {
            const run = this.active.get(sessionId);
            if (!run || !expectedRunId || run.id !== expectedRunId) return fail('run_conflict', '目标任务已经改变，未停止其他任务');
            if (!run.stopping) {
                this.record(sessionId, { type: 'run.patch', runId: run.id, patch: { status: 'stopping' } });
                run.stopping = true;
                run.controller.abort('user_interrupt');
                await this.gateway.interruptAgentRun({ runId: run.id, sessionId, source: 'task-interaction' });
                void this.gateway.computerTool?.runtime?.stopOwnedRun?.(run.id).catch(() => {});
            }
            return { ok: true, status: 'stopping', runId: run.id };
        });
    }
    confirmRecovery({ sessionId, expectedRunId, confirmedExited }) {
        return this.exclusive(sessionId, () => {
            if (this.storageErrors.has(sessionId)) return fail('storage_error', this.storageErrors.get(sessionId));
            const run = this.load(sessionId).runs.find(run => run.id === expectedRunId);
            if (confirmedExited !== true || run?.status !== 'unknown' || this.active.has(sessionId) || this.gateway.activeUnifiedTurns?.has(sessionId)) return fail('run_conflict', '无法确认此任务的恢复状态');
            this.record(sessionId, { type: 'run.patch', runId: run.id, patch: { status: 'stopped', recoveredByUser: true,
                error: '用户确认旧进程已退出。未处理消息没有重放。' } });
            return { ok: true };
        });
    }

    observe({ type, payload = {} }) {
        const run = [...this.active.values()].find(run => run.id === payload.runId);
        if (!run) return;
        const record = body => this.record(run.sessionId, { runId: run.id, ...body });
        if (type === 'agent.run.started') {
            if (run.stopping) { void this.gateway.interruptAgentRun({ runId: run.id, sessionId: run.sessionId }); return; }
            record({ type: 'run.patch', patch: { status: 'running' } });
        }
        if (type === 'agent.llm_call.started') {
            record({ type: 'run.patch', patch: { activity: '等待模型响应', model: payload.model || '', provider: payload.provider || '' } });
            const first = this.load(run.sessionId).runs.find(r => r.id === run.id).items.find(item => item.kind === 'user' && item.status === 'accepted');
            if (first) record({ type: 'item', item: { id: first.id, status: 'included' } });
        }
        if (type === 'agent.input.included') for (const id of payload.clientMessageIds || []) record({ type: 'item', item: { id, status: 'included' } });
        if (type === 'agent.progress.note') {
            this.flush(run);
            record({ type: 'item', item: { id: payload.streamId || randomUUID(), kind: 'progress', text: payload.note || payload.text || '', status: 'observed' } });
        }
        if (type === 'agent.plan.updated') record({ type: 'item', item: {
            id: `${run.id}:plan`, kind: 'plan', plan: payload.plan || [], explanation: payload.explanation || ''
        } });
        if (type === 'tool.call.started') record({ type: 'item', item: { id: payload.callId, kind: 'tool', tool: payload.tool, status: 'running', startedAt: Date.now() } });
        if (type === 'tool.call.finished') {
            const ref = this.resource(Buffer.from(JSON.stringify(payload, null, 2)), 'application/json');
            record({ type: 'item', item: { id: payload.callId, kind: 'tool', tool: payload.tool,
                status: payload.ok ? 'completed' : 'failed', durationMs: payload.durationMs, outputRef: ref,
                fullOutputId: payload.result?.details?.outputId || payload.result?.details?.outputStore?.outputId || payload.result?.outputId || '',
                error: payload.ok ? '' : payload.error?.message || payload.error || '工具执行失败' } });
            for (const content of payload.result?.content || []) {
                if (content.type !== 'image' || !content.data) continue;
                try {
                    const attachment = this.persistAttachment({ dataUrl: `data:${content.mimeType};base64,${content.data}` });
                    if (attachment.imageRef) record({ type: 'item', item: { id: randomUUID(), kind: 'image', imageRef: attachment.imageRef, name: payload.tool } });
                } catch (error) { record({ type: 'item', item: { id: randomUUID(), kind: 'progress', text: `图片未保存：${error.message}` } }); }
            }
        }
    }

    trackTool(context, execute) {
        const run = [...this.active.values()].find(run => run.id === context.runId);
        if (!run) return execute();
        if (run.stopping) throw new Error('任务正在停止，未启动后续工具调用');
        const pending = Promise.resolve().then(execute);
        run.tools.add(pending);
        pending.finally(() => run.tools.delete(pending)).catch(() => {});
        return pending;
    }

    delta(run, delta, metadata = {}) {
        if (run.stopping || !delta) return;
        const id = metadata.streamId || `${run.id}:buffered`;
        if (run.discardedStreams?.has(id)) return;
        try {
            if (run.streamId !== id) { this.flush(run); run.streamId = id; }
            run.pendingText = (run.pendingText || '') + String(delta);
            if (!run.timer) run.timer = setTimeout(() => {
                try { this.flush(run); } catch (error) { this.storageFailure(run.sessionId, error); }
            }, 100);
        } catch (error) { this.storageFailure(run.sessionId, error); }
    }
    flush(run) {
        clearTimeout(run.timer); run.timer = null;
        if (run.pendingText && run.streamId) {
            this.record(run.sessionId, { type: 'draft.delta', runId: run.id, streamId: run.streamId, delta: run.pendingText });
            run.pendingText = '';
        }
    }
    stream(run, event) {
        if (event.type === 'response.output_text.progress') {
            const id = event.streamId || run.streamId;
            if (!id || run.stopping || run.discardedStreams?.has(id)) return;
            try {
                this.flush(run);
                this.record(run.sessionId, { type: 'item', runId: run.id,
                    item: { id, kind: 'progress', text: event.text || '', status: 'observed' } });
            } catch (error) { this.storageFailure(run.sessionId, error); }
        }
        if (event.type === 'response.output_text.discarded') {
            const id = event.streamId || run.streamId;
            if (!id) return;
            (run.discardedStreams ||= new Set()).add(id);
            if (run.streamId === id) { clearTimeout(run.timer); run.timer = null; run.pendingText = ''; }
            try { this.record(run.sessionId, { type: 'item', runId: run.id, item: { id, kind: 'draft', text: '', status: 'discarded' } }); }
            catch (error) { this.storageFailure(run.sessionId, error); }
        }
    }

    resource(bytes, mime = 'text/plain') {
        const id = hash(bytes);
        const dir = path.join(this.root, 'resources'); fs.mkdirSync(dir, { recursive: true });
        const file = path.join(dir, id);
        if (!fs.existsSync(file)) fs.writeFileSync(file, bytes, { flag: 'wx' });
        return { id, mime, bytes: bytes.length };
    }
    readBeforeWrite(context, target) {
        if (![...this.active.values()].some(run => run.id === context.runId)) return null;
        try {
            const stat = fs.lstatSync(target);
            if (!stat.isFile() || stat.isSymbolicLink() || stat.size > 2 * 1024 * 1024) return { data: null, uncertain: true };
            return { data: fs.readFileSync(target), uncertain: false };
        } catch (error) { return { data: null, uncertain: error.code !== 'ENOENT' }; }
    }
    fileChange(context, { target, before, after, uncertain = false }) {
        const run = [...this.active.values()].find(run => run.id === context.runId);
        if (!run) return;
        try {
            const textRef = bytes => bytes !== null && bytes.length <= 2 * 1024 * 1024 && !bytes.includes(0) ? this.resource(bytes, 'text/plain') : null;
            const beforeRef = uncertain ? null : textRef(before), afterRef = textRef(after);
            const diff = !uncertain && (before === null || beforeRef) && (after === null || afterRef)
                ? lineDiff(before?.toString('utf8') ?? null, after?.toString('utf8') ?? null) : null;
            this.record(run.sessionId, { type: 'item', runId: run.id, item: {
                id: `file_${randomUUID()}`, kind: 'file', path: target, name: path.basename(target),
                action: uncertain ? 'observed' : before === null ? 'add' : after === null ? 'delete' : 'edit',
                beforeHash: before === null ? null : hash(before), afterHash: after === null ? null : hash(after),
                beforeRef, afterRef, diffRef: diff ? this.resource(Buffer.from(JSON.stringify(diff)), 'application/json') : null,
                added: diff?.added ?? null, removed: diff?.removed ?? null,
                beforeBytes: before?.length ?? null, afterBytes: after?.length ?? null, uncertain,
                note: '仅表示本次受控写入，不包含此前已有的修改；任意命令产生的文件不自动归属。'
            } });
            const mime = after?.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10])) ? 'image/png'
                : after?.[0] === 255 && after?.[1] === 216 && after?.[2] === 255 ? 'image/jpeg'
                : after?.subarray(0, 4).toString() === 'RIFF' && after?.subarray(8, 12).toString() === 'WEBP' ? 'image/webp' : '';
            if (mime && after.length <= 12 * 1024 * 1024) this.record(run.sessionId, { type: 'item', runId: run.id,
                item: { id: `image_${randomUUID()}`, kind: 'image', imageRef: this.resource(after, mime), name: path.basename(target) } });
        } catch (error) {
            // A recording failure must never turn an already completed write into an apparent rollback.
            this.emit('storage-error', { sessionId: run.sessionId, error: `文件已写入，但成果记录失败：${error.message}` });
        }
    }
    locateFile({ sessionId, runId, itemId }) {
        const item = this.load(sessionId).runs.find(run => run.id === runId)?.items.find(item => item.id === itemId && item.kind === 'file');
        if (!item) throw new Error('文件不属于此任务');
        // Resolve using the existing workspace permission policy; no arbitrary renderer path.
        const target = this.gateway.resolveToolPath(item.path, this.gateway.workspaceRoot, 'path', {});
        const stat = fs.lstatSync(target);
        if (!stat.isFile() || stat.isSymbolicLink()) throw new Error('文件已不存在或已变成链接');
        return { path: target, changedSince: stat.size > 2 * 1024 * 1024 || hash(fs.readFileSync(target)) !== item.afterHash };
    }
    persistAttachment(attachment) {
        const safe = { name: String(attachment.name || attachment.label || '附件'), path: String(attachment.path || '') };
        const match = /^data:(image\/(?:png|jpeg|webp));base64,([A-Za-z0-9+/=\r\n]+)$/.exec(attachment.dataUrl || '');
        if (match) {
            const bytes = Buffer.from(match[2], 'base64');
            if (bytes.length > 12 * 1024 * 1024) throw new Error('图片超过 12 MiB');
            const valid = match[1] === 'image/png' ? bytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]))
                : match[1] === 'image/jpeg' ? bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255
                : bytes.subarray(0, 4).toString() === 'RIFF' && bytes.subarray(8, 12).toString() === 'WEBP';
            if (!valid) throw new Error('图片内容与声明格式不符');
            safe.imageRef = this.resource(bytes, match[1]);
        }
        return safe;
    }
    readResource({ sessionId, runId, resourceId }) {
        if (!/^[a-f0-9]{64}$/.test(resourceId || '')) throw new Error('无效资源标识');
        const run = this.load(sessionId).runs.find(run => run.id === runId);
        const refs = run ? run.items.flatMap(item => [item.outputRef, item.beforeRef, item.afterRef, item.diffRef, item.imageRef, ...(item.attachments || []).map(a => a.imageRef)]).filter(Boolean) : [];
        const ref = refs.find(ref => ref.id === resourceId);
        if (!ref) throw new Error('资源不属于此任务');
        const data = fs.readFileSync(path.join(this.root, 'resources', resourceId));
        if (hash(data) !== resourceId) throw new Error('资源校验失败');
        if (data.length > 16 * 1024 * 1024) throw new Error('此资源过大，不能内联预览');
        return { ...ref, ...(ref.mime.startsWith('image/') ? { dataUrl: `data:${ref.mime};base64,${data.toString('base64')}` } : { text: data.toString('utf8') }) };
    }
    async readToolOutput({ sessionId, runId, itemId, offset = 0 }) {
        const item = this.load(sessionId).runs.find(run => run.id === runId)?.items.find(item => item.id === itemId && item.kind === 'tool');
        if (!item?.fullOutputId) throw new Error('此工具没有完整输出存档');
        const store = this.gateway.runtime.outputStore;
        const metadata = await store.loadMetadata(item.fullOutputId);
        if (!metadata || (metadata.callId !== item.id && metadata.runId !== runId)) throw new Error('输出存档与任务的归属不符');
        const result = await store.read({ outputId: item.fullOutputId, offset, limit: 16384 });
        if (!result.ok) throw new Error(result.error);
        return { text: result.text, offset: result.offset, nextOffset: result.nextOffset, hasMore: result.hasMore, totalBytes: result.totalBytes };
    }
    dispose() {
        if (this.disposed) return;
        this.disposed = true;
        this.gateway.off('event', this.listener);
        for (const run of this.active.values()) clearTimeout(run.timer);
        for (const state of this.sessions.values()) state.release();
    }
}
module.exports = { AILISTaskInteraction };
