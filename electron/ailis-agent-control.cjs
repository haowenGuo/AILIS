const { randomUUID } = require('crypto');

function normalize_string(value, fallback = '') {
    if (typeof value !== 'string') {
        return fallback;
    }
    const text = value.trim();
    return text || fallback;
}

function clone_json(value) {
    try {
        return JSON.parse(JSON.stringify(value));
    } catch {
        return null;
    }
}

function is_abort_error(error) {
    return error?.name === 'AbortError' || /aborted|cancelled|canceled/i.test(error?.message || '');
}

function race_with_abort(promise, signal) {
    if (!signal) {
        return promise;
    }
    if (signal.aborted) {
        const error = new Error('agent run aborted');
        error.name = 'AbortError';
        return Promise.reject(error);
    }
    return new Promise((resolve, reject) => {
        const on_abort = () => {
            const error = new Error('agent run aborted');
            error.name = 'AbortError';
            reject(error);
        };
        signal.addEventListener('abort', on_abort, { once: true });
        promise.then(
            (value) => {
                signal.removeEventListener('abort', on_abort);
                resolve(value);
            },
            (error) => {
                signal.removeEventListener('abort', on_abort);
                reject(error);
            }
        );
    });
}

function with_timeout(promise, timeout_ms, message) {
    const bounded = Math.max(1000, Math.min(Number(timeout_ms) || 30_000, 24 * 60 * 60 * 1000));
    let timer = null;
    return Promise.race([
        promise,
        new Promise((_, reject) => {
            timer = setTimeout(() => reject(new Error(message || `operation timed out after ${bounded}ms`)), bounded);
        })
    ]).finally(() => {
        if (timer) {
            clearTimeout(timer);
        }
    });
}

const AgentStatus = Object.freeze({
    PendingInit: 'pending_init',
    Running: 'running',
    Interrupted: 'interrupted',
    Shutdown: 'shutdown',
    NotFound: 'not_found',
    Completed(message = null) {
        const text = normalize_string(message);
        return { completed: text || null };
    },
    Errored(message = '') {
        return { errored: normalize_string(message, 'unknown agent error') };
    }
});

function agent_status_kind(status) {
    if (typeof status === 'string') {
        return status;
    }
    if (status && typeof status === 'object') {
        if (Object.prototype.hasOwnProperty.call(status, 'completed')) {
            return 'completed';
        }
        if (Object.prototype.hasOwnProperty.call(status, 'errored')) {
            return 'errored';
        }
    }
    return 'not_found';
}

function is_final(status) {
    return ['completed', 'errored', 'interrupted', 'shutdown', 'not_found'].includes(agent_status_kind(status));
}

function normalize_agent_status(status, final_message = '') {
    if (typeof status === 'string') {
        const normalized = status.trim().toLowerCase();
        if (normalized === 'completed') {
            return AgentStatus.Completed(final_message);
        }
        if (['pending_init', 'queued', 'running', 'interrupted', 'shutdown', 'not_found'].includes(normalized)) {
            return normalized === 'queued' ? AgentStatus.PendingInit : normalized;
        }
        if (['max_steps_reached', 'max_loop'].includes(normalized)) {
            return AgentStatus.Interrupted;
        }
        if (normalized) {
            return AgentStatus.Errored(final_message || normalized);
        }
    }
    if (status && typeof status === 'object') {
        const kind = agent_status_kind(status);
        if (kind === 'completed') {
            return AgentStatus.Completed(status.completed);
        }
        if (kind === 'errored') {
            return AgentStatus.Errored(status.errored);
        }
    }
    return AgentStatus.NotFound;
}

class AgentPath {
    constructor(value = '/root') {
        const normalized = normalize_string(value, '/root').replace(/\\/g, '/').replace(/\/+$/g, '');
        if (!/^\/root(?:\/[a-z0-9_]+)*$/.test(normalized)) {
            throw new Error(`invalid AgentPath: ${value}`);
        }
        this.value = normalized;
    }

    static root() {
        return new AgentPath('/root');
    }

    join(task_name = '') {
        const segment = normalize_string(task_name).toLowerCase();
        if (!/^[a-z0-9_]+$/.test(segment)) {
            throw new Error('task_name must use lowercase letters, digits, and underscores');
        }
        return new AgentPath(`${this.value}/${segment}`);
    }

    parent() {
        if (this.value === '/root') {
            return AgentPath.root();
        }
        return new AgentPath(this.value.slice(0, this.value.lastIndexOf('/')));
    }

    toString() {
        return this.value;
    }
}

class InterAgentCommunication {
    constructor({ author, recipient, other_recipients = [], content = '', trigger_turn = false } = {}) {
        this.author = String(author instanceof AgentPath ? author : new AgentPath(author || '/root'));
        this.recipient = String(recipient instanceof AgentPath ? recipient : new AgentPath(recipient || '/root'));
        this.other_recipients = Array.isArray(other_recipients)
            ? other_recipients.map((entry) => String(entry instanceof AgentPath ? entry : new AgentPath(entry)))
            : [];
        this.content = normalize_string(content);
        this.trigger_turn = trigger_turn === true;
    }

    to_response_input_item() {
        return {
            type: 'message',
            role: 'assistant',
            content: [{ type: 'output_text', text: JSON.stringify(this) }],
            phase: 'commentary'
        };
    }
}

class SubagentNotification {
    constructor(agent_reference = '', status = AgentStatus.NotFound) {
        this.agent_reference = String(agent_reference instanceof AgentPath
            ? agent_reference
            : new AgentPath(agent_reference || '/root'));
        this.status = normalize_agent_status(status);
    }

    render() {
        return [
            '<subagent_notification>',
            JSON.stringify({ agent_path: this.agent_reference, status: this.status }),
            '</subagent_notification>'
        ].join('\n');
    }
}

class InputQueue {
    constructor() {
        this.mailbox_pending_mails = new Map();
        this.mailbox_waiters = new Map();
        this.idle_pending_input = new Map();
    }

    mailbox_key(context = {}) {
        return `session:${normalize_string(context.sessionId || context.session_id || context.sessionKey, 'main')}`;
    }

    subscribe_mailbox(context = {}, timeout_ms = 30_000) {
        const key = this.mailbox_key(context);
        if ((this.mailbox_pending_mails.get(key) || []).length) {
            return Promise.resolve(true);
        }
        return new Promise((resolve) => {
            const waiters = this.mailbox_waiters.get(key) || new Set();
            let timer = null;
            const finish = (changed) => {
                if (timer) {
                    clearTimeout(timer);
                }
                waiters.delete(finish);
                if (!waiters.size) {
                    this.mailbox_waiters.delete(key);
                }
                resolve(changed);
            };
            waiters.add(finish);
            this.mailbox_waiters.set(key, waiters);
            timer = setTimeout(() => finish(false), Math.max(1, Number(timeout_ms || 30_000)));
        });
    }

    enqueue_mailbox_communication(context = {}, communication = {}) {
        const key = this.mailbox_key(context);
        const mail = communication instanceof InterAgentCommunication
            ? communication
            : new InterAgentCommunication(communication);
        const pending = this.mailbox_pending_mails.get(key) || [];
        pending.push(mail);
        this.mailbox_pending_mails.set(key, pending);
        for (const waiter of [...(this.mailbox_waiters.get(key) || [])]) {
            waiter(true);
        }
        return mail;
    }

    drain_mailbox_input_items(context = {}) {
        const key = this.mailbox_key(context);
        const pending = this.mailbox_pending_mails.get(key) || [];
        this.mailbox_pending_mails.delete(key);
        return pending.map((mail) => mail.to_response_input_item());
    }

    get_pending_input(context = {}) {
        const key = this.mailbox_key(context);
        const idle = this.idle_pending_input.get(key) || [];
        this.idle_pending_input.delete(key);
        return [...idle, ...this.drain_mailbox_input_items(context)];
    }
}

class AgentRegistry {
    constructor() {
        this.trees = new Map();
    }

    tree_key(context = {}) {
        return normalize_string(context.sessionId || context.session_id || context.sessionKey, 'main');
    }

    get_tree(context = {}) {
        const key = this.tree_key(context);
        let tree = this.trees.get(key);
        if (!tree) {
            tree = { session_id: key, by_path: new Map(), by_id: new Map() };
            this.trees.set(key, tree);
        }
        return tree;
    }

    find(target = '', context = {}) {
        const requested = normalize_string(target);
        if (!requested) {
            return null;
        }
        const tree = this.get_tree(context);
        if (tree.by_id.has(requested)) {
            return tree.by_id.get(requested);
        }
        const parent = new AgentPath(context.agent_path || context.agentPath || '/root');
        const path = requested.startsWith('/') ? requested : String(parent.join(requested));
        return tree.by_path.get(path) || null;
    }

    insert(agent, context = {}) {
        const tree = this.get_tree(context);
        tree.by_path.set(agent.agent_path, agent);
        tree.by_id.set(agent.id, agent);
        return agent;
    }

    list(context = {}) {
        return [...this.get_tree(context).by_path.values()];
    }

    count() {
        let total = 0;
        for (const tree of this.trees.values()) {
            total += tree.by_path.size;
        }
        return total;
    }
}

class AgentControl {
    constructor({
        execute_agent = null,
        build_agent_context = null,
        emit_agent_event = null,
        build_error_result = null,
        input_queue = new InputQueue(),
        max_threads_per_session = 1,
        run_timeout_ms = 15 * 60 * 1000
    } = {}) {
        this.execute_agent = typeof execute_agent === 'function' ? execute_agent : null;
        this.build_agent_context = typeof build_agent_context === 'function' ? build_agent_context : ((agent, _args, context) => ({ ...context }));
        this.emit_agent_event = typeof emit_agent_event === 'function' ? emit_agent_event : async () => {};
        this.build_error_result = typeof build_error_result === 'function' ? build_error_result : null;
        this.input_queue = input_queue;
        this.state = new AgentRegistry();
        this.max_threads_per_session = Math.max(1, Number(max_threads_per_session) || 1);
        this.run_timeout_ms = Math.max(1000, Number(run_timeout_ms) || 15 * 60 * 1000);
    }

    public_agent(agent = {}) {
        const status = agent.agent_status || normalize_agent_status(agent.status, agent.result?.displayText || '');
        return clone_json({
            id: agent.id,
            label: agent.label,
            nickname: agent.nickname || null,
            runId: agent.parent_run_id,
            sessionId: agent.parent_session_id,
            childRunId: agent.thread_id,
            childSessionId: agent.thread_session_id,
            task: agent.task,
            originalTask: agent.original_task,
            last_task_message: agent.last_task_message,
            task_name: agent.task_name,
            agent_path: agent.agent_path,
            parent_agent_path: agent.parent_agent_path,
            inheritanceMode: agent.inheritance_mode,
            status: agent.status,
            agent_status: status,
            ok: agent.ok,
            error: agent.error || '',
            createdAt: agent.created_at,
            startedAt: agent.started_at || null,
            finishedAt: agent.finished_at || null,
            durationMs: agent.duration_ms || 0,
            result: agent.result || null,
            events: agent.events || []
        });
    }

    async emit(agent, event = {}) {
        const entry = {
            id: randomUUID(),
            ts: Date.now(),
            iso: new Date().toISOString(),
            type: normalize_string(event.type, 'agent.event'),
            status: normalize_string(event.status, agent.status),
            message: normalize_string(event.message),
            payload: clone_json(event.payload || {}) || {}
        };
        agent.events.push(entry);
        if (agent.events.length > 200) {
            agent.events = agent.events.slice(-200);
        }
        await this.emit_agent_event(this.public_agent(agent), entry);
        return entry;
    }

    register_input_handler(agent, handler) {
        if (typeof handler !== 'function') {
            return () => {};
        }
        agent.input_handler = handler;
        const pending = agent.pending_inputs.splice(0);
        for (const message of pending) {
            Promise.resolve(handler(message)).catch(() => {});
        }
        return () => {
            if (agent.input_handler === handler) {
                agent.input_handler = null;
            }
        };
    }

    live_children(context = {}) {
        const parent_path = String(new AgentPath(context.agent_path || context.agentPath || '/root'));
        return this.state.list(context).filter((agent) =>
            agent.parent_agent_path === parent_path && !is_final(agent.agent_status)
        );
    }

    delegated_child_for_parent_run(context = {}) {
        const parent_path = String(new AgentPath(context.agent_path || context.agentPath || '/root'));
        const parent_run_id = normalize_string(context.runId || context.run_id);
        const role = normalize_string(context.agentRole || context.agent_role || context.contextMode).toLowerCase();
        if (!parent_run_id || !['persona_orchestrator', 'persona'].includes(role)) {
            return null;
        }
        return this.state.list(context).find((agent) =>
            agent.parent_agent_path === parent_path && agent.parent_run_id === parent_run_id
        ) || null;
    }

    async spawn_agent_with_metadata(args = {}, context = {}) {
        const task_name = normalize_string(args.task_name);
        const message = normalize_string(args.message);
        const parent_path = new AgentPath(context.agent_path || context.agentPath || '/root');
        let child_path;
        try {
            child_path = parent_path.join(task_name);
        } catch (error) {
            return { ok: false, status: 'invalid_task_name', error: error?.message || String(error), isError: true };
        }
        const canonical_path = String(child_path);
        const existing = this.state.find(canonical_path, context);
        if (existing) {
            return {
                ok: false,
                status: 'agent_path_conflict',
                error: `agent ${canonical_path} already exists; use followup_task`,
                target: canonical_path,
                isError: true
            };
        }
        const delegated = this.delegated_child_for_parent_run(context);
        if (delegated) {
            return {
                ok: false,
                status: 'agent_task_already_delegated',
                error: `this parent run already delegated its user task to ${delegated.agent_path}; use followup_task for additional work or answer from its completed result`,
                target: delegated.agent_path,
                agent_status: clone_json(delegated.agent_status),
                result_available: is_final(delegated.agent_status),
                isError: true
            };
        }
        const live = this.live_children({ ...context, agent_path: String(parent_path) });
        if (live.length >= this.max_threads_per_session) {
            return {
                ok: false,
                status: 'agent_thread_limit_reached',
                error: `agent thread limit reached; continue or wait for ${live[0].agent_path}`,
                target: live[0].agent_path,
                isError: true
            };
        }
        const fork_turns = normalize_string(args.fork_turns, 'all').toLowerCase();
        const checkpoint = fork_turns === 'none'
            ? null
            : context.forked_context_checkpoint || context.forkedContextCheckpoint || null;
        const parent_session_id = normalize_string(context.sessionId || context.sessionKey, 'main');
        const agent = {
            id: `agent-${randomUUID()}`,
            label: task_name,
            nickname: null,
            parent_run_id: normalize_string(context.runId || context.run_id),
            parent_session_id,
            thread_id: `thread-${randomUUID()}`,
            thread_session_id: `${parent_session_id}:agent:${randomUUID()}`,
            task: message,
            original_task: message,
            last_task_message: message,
            task_name,
            agent_path: canonical_path,
            parent_agent_path: String(parent_path),
            inheritance_mode: checkpoint ? 'checkpoint' : 'clean',
            context_checkpoint: checkpoint,
            status: 'queued',
            agent_status: AgentStatus.PendingInit,
            ok: null,
            error: '',
            result: null,
            events: [],
            pending_inputs: [],
            input_handler: null,
            controller: null,
            run_promise: null,
            created_at: Date.now(),
            started_at: null,
            finished_at: null,
            duration_ms: 0,
            base_args: {
                ...(clone_json(args) || {}),
                inheritanceMode: checkpoint ? 'checkpoint' : 'clean',
                contextManagerCheckpoint: checkpoint
            },
            base_context: { ...context }
        };
        this.state.insert(agent, context);
        await this.emit(agent, {
            type: 'subagent.spawned',
            status: 'queued',
            message,
            payload: this.public_agent(agent)
        });
        this.start_agent_turn(agent, agent.base_args, agent.base_context);
        return { task_name: canonical_path, nickname: agent.nickname };
    }

    start_agent_turn(agent, args = {}, context = {}) {
        const controller = new AbortController();
        agent.controller = controller;
        const timeout_ms = Math.max(1000, Math.min(Number(args.runTimeoutMs || args.timeoutMs) || this.run_timeout_ms, 24 * 60 * 60 * 1000));
        const executor = this.execute_agent || (async ({ agent: current }) => ({
            ok: true,
            status: 'completed',
            displayText: `Agent accepted task: ${current.task}`
        }));
        const run_promise = (async () => {
            agent.status = 'running';
            agent.agent_status = AgentStatus.Running;
            agent.started_at = Date.now();
            await this.emit(agent, { type: 'subagent.started', status: 'running', message: agent.task });
            try {
                const result = await with_timeout(
                    race_with_abort(Promise.resolve(executor({
                        agent: this.public_agent(agent),
                        args: clone_json(args) || {},
                        context: this.build_agent_context(this.public_agent(agent), args, context),
                        signal: controller.signal,
                        registerInputHandler: (handler) => this.register_input_handler(agent, handler),
                        onEvent: async (event) => await this.emit(agent, event)
                    })), controller.signal),
                    timeout_ms,
                    `agent ${agent.agent_path} timed out after ${timeout_ms}ms`
                );
                agent.status = normalize_string(result?.status, 'completed');
                agent.ok = result?.ok !== false && agent.status === 'completed';
                agent.finished_at = Date.now();
                agent.duration_ms = agent.finished_at - agent.started_at;
                agent.result = clone_json(result || {}) || {};
                const final_text = normalize_string(result?.displayText || result?.finalAnswer || result?.speechText);
                agent.agent_status = normalize_agent_status(agent.status, final_text);
                await this.emit(agent, {
                    type: 'subagent.completed',
                    status: agent.status,
                    message: final_text || normalize_string(result?.summary, 'agent completed'),
                    payload: { ok: agent.ok, durationMs: agent.duration_ms, result: agent.result }
                });
            } catch (error) {
                agent.status = is_abort_error(error) ? 'cancelled' : /timed out/i.test(error?.message || '') ? 'timeout' : 'failed';
                agent.ok = false;
                agent.finished_at = Date.now();
                agent.duration_ms = agent.started_at ? agent.finished_at - agent.started_at : 0;
                agent.error = error?.message || String(error);
                agent.result = this.build_error_result
                    ? this.build_error_result(this.public_agent(agent), agent.status, agent.error, agent.duration_ms)
                    : { ok: false, status: agent.status, error: agent.error, displayText: agent.error };
                agent.agent_status = AgentStatus.Errored(agent.error);
                await this.emit(agent, {
                    type: 'subagent.completed',
                    status: agent.status,
                    message: agent.result?.displayText || agent.error,
                    payload: { ok: false, durationMs: agent.duration_ms, error: agent.error, result: agent.result }
                });
            } finally {
                agent.input_handler = null;
                agent.controller = null;
                await this.forward_child_completion_to_parent(agent, agent.agent_status);
            }
            return agent.result;
        })();
        agent.run_promise = run_promise;
        run_promise.catch(() => {});
        return run_promise;
    }

    async followup_task(args = {}, context = {}) {
        const agent = this.state.find(args.target, context);
        if (!agent) {
            return { ok: false, status: 'agent_not_found', error: `agent ${normalize_string(args.target)} not found`, isError: true };
        }
        const message = normalize_string(args.message);
        agent.last_task_message = message;
        await this.emit(agent, { type: 'subagent.input', status: 'queued', message });
        if (!is_final(agent.agent_status)) {
            if (agent.input_handler) {
                await agent.input_handler(message);
            } else {
                agent.pending_inputs.push(message);
            }
            return '';
        }
        const previous = agent.result && typeof agent.result === 'object' ? agent.result : {};
        const checkpoint = previous.taskRunHandoff?.resume?.contextManagerCheckpoint ||
            previous.task_run_handoff?.resume?.contextManagerCheckpoint || null;
        agent.thread_id = `thread-${randomUUID()}`;
        agent.task = message;
        agent.status = 'queued';
        agent.agent_status = AgentStatus.PendingInit;
        agent.ok = null;
        agent.error = '';
        agent.result = null;
        agent.started_at = null;
        agent.finished_at = null;
        agent.inheritance_mode = checkpoint ? 'checkpoint' : 'recent';
        agent.context_checkpoint = checkpoint;
        this.start_agent_turn(agent, {
            ...agent.base_args,
            task: message,
            inheritanceMode: agent.inheritance_mode,
            contextManagerCheckpoint: checkpoint,
            initialStepResults: Array.isArray(previous.steps) ? previous.steps : []
        }, { ...agent.base_context, ...context });
        return '';
    }

    list_agents(args = {}, context = {}) {
        const prefix = normalize_string(args.path_prefix);
        const agents = this.state.list(context)
            .filter((agent) => !prefix || agent.agent_path.startsWith(prefix))
            .map((agent) => ({
                agent_name: agent.agent_path,
                agent_status: agent.agent_status,
                last_task_message: agent.last_task_message || null
            }));
        return { agents };
    }

    async wait_agent(args = {}, context = {}) {
        const timeout_ms = Math.max(1, Number(args.timeout_ms || 30_000));
        const changed = await this.input_queue.subscribe_mailbox(context, timeout_ms);
        return { message: changed ? 'Wait completed.' : 'Wait timed out.', timed_out: !changed };
    }

    async await_live_children(context = {}, timeout_ms = 30_000) {
        const live = this.live_children(context).filter((agent) => agent.run_promise);
        if (!live.length) {
            return { waited: false, timed_out: false, count: 0 };
        }
        try {
            await with_timeout(Promise.allSettled(live.map((agent) => agent.run_promise)), timeout_ms, 'agent children wait timed out');
            return { waited: true, timed_out: false, count: live.length };
        } catch (error) {
            return { waited: true, timed_out: true, count: live.length, error: error?.message || String(error) };
        }
    }

    async close_agent(args = {}, context = {}) {
        const agent = this.state.find(args.target, context);
        if (!agent) {
            return { previous_status: AgentStatus.NotFound };
        }
        const previous_status = agent.agent_status;
        const descendants = this.state.list(context).filter((candidate) =>
            candidate.agent_path === agent.agent_path || candidate.agent_path.startsWith(`${agent.agent_path}/`)
        );
        for (const candidate of descendants) {
            candidate.controller?.abort();
            if (!is_final(candidate.agent_status)) {
                candidate.status = 'cancelled';
                candidate.agent_status = AgentStatus.Shutdown;
            }
            await this.emit(candidate, { type: 'subagent.closed', status: candidate.status, message: 'close_agent' });
        }
        return { previous_status };
    }

    get_pending_input(context = {}) {
        return this.input_queue.get_pending_input(context);
    }

    async send_inter_agent_communication(context = {}, communication = {}) {
        return this.input_queue.enqueue_mailbox_communication(context, communication);
    }

    async forward_child_completion_to_parent(agent = {}, status = AgentStatus.NotFound) {
        if (!agent.agent_path) {
            return null;
        }
        const child_path = new AgentPath(agent.agent_path);
        const notification = new SubagentNotification(child_path, status).render();
        return await this.send_inter_agent_communication({ sessionId: agent.parent_session_id }, new InterAgentCommunication({
            author: child_path,
            recipient: child_path.parent(),
            other_recipients: [],
            content: notification,
            trigger_turn: false
        }));
    }

    count_agents() {
        return this.state.count();
    }

    async shutdown() {
        const pending = [];
        for (const tree of this.state.trees.values()) {
            for (const agent of tree.by_path.values()) {
                agent.controller?.abort();
                if (agent.run_promise) {
                    pending.push(agent.run_promise);
                }
            }
        }
        await Promise.allSettled(pending);
    }
}

module.exports = {
    AgentControl,
    AgentPath,
    AgentRegistry,
    AgentStatus,
    InputQueue,
    InterAgentCommunication,
    SubagentNotification,
    agent_status_kind,
    is_final,
    normalize_agent_status
};
