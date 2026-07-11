function normalize_string(value, fallback = '') {
    if (typeof value !== 'string') {
        return fallback;
    }
    const text = value.trim();
    return text || fallback;
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
    return ['completed', 'errored', 'shutdown', 'not_found'].includes(agent_status_kind(status));
}

function normalize_agent_status(status, final_message = '') {
    if (typeof status === 'string') {
        const normalized = status.trim().toLowerCase();
        if (normalized === 'completed') {
            return AgentStatus.Completed(final_message);
        }
        if (['pending_init', 'running', 'interrupted', 'shutdown', 'not_found'].includes(normalized)) {
            return normalized;
        }
        if (['failed', 'error', 'cancelled', 'timeout', 'max_steps_reached', 'max_loop'].includes(normalized)) {
            return normalized === 'max_steps_reached' || normalized === 'max_loop'
                ? AgentStatus.Interrupted
                : AgentStatus.Errored(final_message || normalized);
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
            JSON.stringify({
                agent_path: this.agent_reference,
                status: this.status
            }),
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
        const run_id = normalize_string(context.runId || context.run_id);
        if (run_id) {
            return `run:${run_id}`;
        }
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

class AgentControl {
    constructor({ runtime, input_queue = new InputQueue() } = {}) {
        this.runtime = runtime;
        this.input_queue = input_queue;
    }

    async spawn_agent_with_metadata(args = {}, context = {}) {
        return await this.runtime.spawn_agent_with_metadata(args, context);
    }

    async send_inter_agent_communication(context = {}, communication = {}) {
        return this.input_queue.enqueue_mailbox_communication(context, communication);
    }

    async followup_task(args = {}, context = {}) {
        return await this.runtime.followup_task(args, context);
    }

    async wait_agent(args = {}, context = {}) {
        const timeout_ms = Math.max(1, Number(args.timeout_ms || 30_000));
        const changed = await this.input_queue.subscribe_mailbox(context, timeout_ms);
        return {
            message: changed ? 'Wait completed.' : 'Wait timed out.',
            timed_out: !changed
        };
    }

    list_agents(args = {}, context = {}) {
        return this.runtime.list_agents(args, context);
    }

    async close_agent(args = {}, context = {}) {
        return await this.runtime.close_agent(args, context);
    }

    get_pending_input(context = {}) {
        return this.input_queue.get_pending_input(context);
    }

    async forward_child_completion_to_parent(subagent = {}, status = AgentStatus.NotFound) {
        const raw_child_path = subagent.agent_path || subagent.agentPath;
        if (!raw_child_path) {
            return null;
        }
        const child_path = new AgentPath(raw_child_path);
        const notification = new SubagentNotification(child_path, status).render();
        return await this.send_inter_agent_communication({
            runId: subagent.runId,
            sessionId: subagent.sessionId
        }, new InterAgentCommunication({
            author: child_path,
            recipient: child_path.parent(),
            other_recipients: [],
            content: notification,
            trigger_turn: false
        }));
    }
}

module.exports = {
    AgentControl,
    AgentPath,
    AgentStatus,
    InputQueue,
    InterAgentCommunication,
    SubagentNotification,
    agent_status_kind,
    is_final,
    normalize_agent_status
};
