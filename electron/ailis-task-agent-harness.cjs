const fs = require('fs');
const path = require('path');
const { randomUUID } = require('crypto');

const TASK_HARNESS_STATE_VERSION = 2;
const TASK_RESULT_SCHEMA = 'ailis.task_result.v1';
const LONG_HORIZON_TASK_OPTIMIZATION = '长程任务优化';
const MAX_PARENT_RUN_HANDOFFS = 256;
const DEFAULT_PROGRESS_HEARTBEAT_MS = 25_000;
const FINAL_STATUSES = new Set(['completed', 'completed_with_warnings', 'success', 'succeeded']);
const GOAL_STATUSES = new Set(['active', 'blocked', 'completed', 'replaced', 'cancelled']);

function normalizeString(value, fallback = '') {
    const text = typeof value === 'string' ? value.trim() : '';
    return text || fallback;
}

function cloneJson(value) {
    try {
        return JSON.parse(JSON.stringify(value));
    } catch {
        return null;
    }
}

function readJson(filePath, fallback) {
    try {
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch {
        return fallback;
    }
}

function atomicWriteJson(filePath, value) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    const temporaryPath = `${filePath}.${process.pid}.${Date.now()}.tmp`;
    fs.writeFileSync(temporaryPath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
    fs.renameSync(temporaryPath, filePath);
}

function uniqueStrings(values = [], limit = 80) {
    const result = [];
    for (const value of Array.isArray(values) ? values : []) {
        const text = normalizeString(value);
        if (text && !result.includes(text)) {
            result.push(text);
        }
        if (result.length >= limit) {
            break;
        }
    }
    return result;
}

function normalizeSourceRefs(values = []) {
    const refs = [];
    const seen = new Set();
    for (const value of Array.isArray(values) ? values : []) {
        if (!value || typeof value !== 'object' || Array.isArray(value)) {
            continue;
        }
        const url = normalizeString(value.url);
        if (!url || seen.has(url)) {
            continue;
        }
        try {
            const parsed = new URL(url);
            if (!['http:', 'https:'].includes(parsed.protocol)) {
                continue;
            }
        } catch {
            continue;
        }
        seen.add(url);
        refs.push({
            ref_id: normalizeString(value.ref_id || value.refId || value.id, url),
            title: normalizeString(value.title || value.name, url).slice(0, 240),
            url,
            ...(Number.isFinite(Number(value.lineno)) && Number(value.lineno) > 0
                ? { lineno: Number(value.lineno) }
                : {})
        });
        if (refs.length >= 24) {
            break;
        }
    }
    return refs;
}

function outputRefsFromCollectedData(collectedData = []) {
    const refs = [];
    for (const item of Array.isArray(collectedData) ? collectedData : []) {
        refs.push(item?.outputId, item?.artifactId);
    }
    return uniqueStrings(refs);
}

function normalizeGoal(raw = {}) {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
        return null;
    }
    const goalId = normalizeString(raw.goalId || raw.goal_id);
    const objective = normalizeString(raw.objective);
    if (!goalId || !objective) {
        return null;
    }
    const status = normalizeString(raw.status, 'active').toLowerCase();
    return {
        goalId,
        objective,
        status: GOAL_STATUSES.has(status) ? status : 'active',
        createdAt: normalizeString(raw.createdAt || raw.created_at, new Date().toISOString()),
        updatedAt: normalizeString(raw.updatedAt || raw.updated_at, new Date().toISOString()),
        completedAt: normalizeString(raw.completedAt || raw.completed_at),
        reason: normalizeString(raw.reason)
    };
}

function normalizeTurn(raw = {}, fallbackSessionId = '') {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
        return null;
    }
    const turnId = normalizeString(raw.turnId || raw.turn_id);
    const request = normalizeString(raw.request || raw.latestRequest || raw.current_request);
    if (!turnId || !request) {
        return null;
    }
    const createdAt = normalizeString(raw.createdAt || raw.created_at, new Date().toISOString());
    const inputs = (Array.isArray(raw.inputs) ? raw.inputs : [])
        .map((input) => {
            if (typeof input === 'string') {
                return {
                    inputId: `input_${randomUUID()}`,
                    message: normalizeString(input),
                    createdAt
                };
            }
            const message = normalizeString(input?.message || input?.text);
            return message ? {
                inputId: normalizeString(input?.inputId || input?.input_id, `input_${randomUUID()}`),
                message,
                createdAt: normalizeString(input?.createdAt || input?.created_at, createdAt)
            } : null;
        })
        .filter(Boolean);
    if (!inputs.length) {
        inputs.push({ inputId: `input_${randomUUID()}`, message: request, createdAt });
    }
    return {
        turnId,
        sessionId: normalizeString(raw.sessionId || raw.session_id, fallbackSessionId),
        runId: normalizeString(raw.runId || raw.run_id || raw.latestRunId),
        request: normalizeString(raw.request, inputs[0].message),
        latestRequest: normalizeString(raw.latestRequest || raw.current_request, inputs.at(-1).message),
        inputs,
        status: normalizeString(raw.status, 'incomplete').toLowerCase(),
        resultStatus: normalizeString(raw.resultStatus || raw.result_status),
        finalAnswer: normalizeString(raw.finalAnswer || raw.final_answer),
        traceRef: normalizeString(raw.traceRef || raw.trace_ref),
        createdAt,
        updatedAt: normalizeString(raw.updatedAt || raw.updated_at, createdAt),
        completedAt: normalizeString(raw.completedAt || raw.completed_at)
    };
}

function normalizeStoredThread(raw = {}, fallbackSessionId = '') {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
        return null;
    }
    const threadId = normalizeString(raw.threadId || raw.thread_id);
    const sessionId = normalizeString(raw.sessionId || raw.session_id, fallbackSessionId);
    if (!threadId || !sessionId) {
        return null;
    }
    const turns = (Array.isArray(raw.turns) ? raw.turns : [])
        .map((turn) => normalizeTurn(turn, sessionId))
        .filter(Boolean);
    const requestedActiveTurnId = normalizeString(raw.activeTurnId || raw.active_turn_id);
    const activeTurn = turns.find((turn) => turn.turnId === requestedActiveTurnId);
    const activeGoal = normalizeGoal(raw.activeGoal || raw.active_goal);
    const checkpoint = raw.contextCheckpoint && typeof raw.contextCheckpoint === 'object'
        ? raw.contextCheckpoint
        : raw.context_checkpoint && typeof raw.context_checkpoint === 'object'
            ? raw.context_checkpoint
            : raw.historyCheckpoint && typeof raw.historyCheckpoint === 'object'
                ? raw.historyCheckpoint
                : raw.history_checkpoint && typeof raw.history_checkpoint === 'object'
                    ? raw.history_checkpoint
                    : null;
    return {
        threadId,
        sessionId,
        childSessionId: normalizeString(raw.childSessionId || raw.child_session_id, `${sessionId}:task-agent:${threadId}`),
        turns,
        activeTurnId: activeTurn?.status === 'running' ? activeTurn.turnId : '',
        activeGoal: activeGoal && ['active', 'blocked'].includes(activeGoal.status) ? activeGoal : null,
        goalHistory: (Array.isArray(raw.goalHistory || raw.goal_history) ? (raw.goalHistory || raw.goal_history) : [])
            .map(normalizeGoal)
            .filter(Boolean),
        contextCheckpoint: sanitizeContextCheckpoint(checkpoint),
        outputRefs: uniqueStrings(raw.outputRefs),
        sourceRefs: normalizeSourceRefs(raw.sourceRefs),
        unresolvedFields: uniqueStrings(raw.unresolvedFields, 24),
        traceRef: normalizeString(raw.traceRef || raw.latestRunId),
        createdAt: normalizeString(raw.createdAt, new Date().toISOString()),
        updatedAt: normalizeString(raw.updatedAt, new Date().toISOString())
    };
}

function migrateLegacyTask(raw = {}, fallbackSessionId = '') {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
        return null;
    }
    const legacyTaskId = normalizeString(raw.taskId);
    const sessionId = normalizeString(raw.sessionId, fallbackSessionId);
    const originalGoal = normalizeString(raw.originalGoal);
    const latestRequest = normalizeString(raw.latestRequest, originalGoal);
    if (!legacyTaskId || !sessionId || !latestRequest) {
        return null;
    }
    const now = new Date().toISOString();
    const status = normalizeString(raw.status, 'incomplete').toLowerCase();
    const turnId = `turn_legacy_${legacyTaskId.replace(/[^a-zA-Z0-9_-]/g, '_')}`;
    return normalizeStoredThread({
        threadId: `thread_${legacyTaskId}`,
        sessionId,
        childSessionId: normalizeString(raw.childSessionId, `${sessionId}:task-agent:thread_${legacyTaskId}`),
        turns: [{
            turnId,
            sessionId,
            runId: normalizeString(raw.latestRunId),
            request: latestRequest,
            latestRequest,
            status,
            resultStatus: status,
            traceRef: normalizeString(raw.traceRef || raw.latestRunId),
            createdAt: normalizeString(raw.createdAt, now),
            updatedAt: normalizeString(raw.updatedAt, now),
            completedAt: normalizeString(raw.updatedAt, now)
        }],
        activeTurnId: '',
        // v1 originalGoal was implicit first-request state, not an explicitly created Goal.
        // Preserve it in historical Turn/checkpoint data without granting it active authority.
        activeGoal: null,
        goalHistory: [],
        contextCheckpoint: raw.checkpoint && typeof raw.checkpoint === 'object' ? raw.checkpoint : null,
        outputRefs: raw.outputRefs,
        sourceRefs: raw.sourceRefs,
        unresolvedFields: raw.unresolvedFields,
        traceRef: raw.traceRef || raw.latestRunId,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt
    }, sessionId);
}

function sanitizeContextCheckpoint(checkpoint = null) {
    if (!checkpoint || typeof checkpoint !== 'object' || Array.isArray(checkpoint)) {
        return null;
    }
    const sanitized = cloneJson(checkpoint) || {};
    sanitized.items = (Array.isArray(sanitized.items) ? sanitized.items : []).map((item) => {
        if (item?.type !== 'message' || !Array.isArray(item.content)) {
            return item;
        }
        const content = item.content.map((part) => {
            const text = typeof part?.text === 'string' ? part.text : '';
            const match = text.match(/<ailis_(context|session)_checkpoint>\s*([\s\S]*?)\s*<\/ailis_\1_checkpoint>/i);
            if (!match) {
                return part;
            }
            try {
                const prior = JSON.parse(match[2]);
                const priorTaskState = prior.taskState && typeof prior.taskState === 'object'
                    ? { ...prior.taskState }
                    : null;
                if (priorTaskState) {
                    delete priorTaskState.original_user_goal;
                    delete priorTaskState.originalUserGoal;
                    delete priorTaskState.original_goal;
                    delete priorTaskState.originalGoal;
                    delete priorTaskState.current_request;
                    delete priorTaskState.currentRequest;
                    delete priorTaskState.delegated_task;
                    delete priorTaskState.delegatedTask;
                    delete priorTaskState.active_goal;
                    delete priorTaskState.activeGoal;
                }
                const sessionCheckpoint = match[1].toLowerCase() === 'session'
                    ? {
                          ...prior,
                          schema: 'ailis.session_context_checkpoint.v2',
                          contextMode: 'task_agent_session',
                          activeGoal: null,
                          currentRequest: '',
                          taskState: priorTaskState,
                          instruction: 'This checkpoint is historical Session context. The latest Turn input and current model-managed active Goal are authoritative.'
                      }
                    : {
                          schema: 'ailis.session_context_checkpoint.v2',
                          contextMode: 'task_agent_session',
                          reason: prior.reason || 'legacy_migration',
                          activeGoal: null,
                          currentRequest: '',
                          constraints: prior.constraints || [],
                          currentPlan: prior.currentPlan || null,
                          unresolvedFields: prior.unresolvedFields || [],
                          taskState: priorTaskState,
                          outputRefs: prior.outputRefs || [],
                          droppedItemsManifest: prior.droppedItemsManifest || [],
                          instruction: 'This is prior Session history. The latest Turn input and current active Goal are authoritative.'
                      };
                return {
                    ...part,
                    text: `<ailis_session_checkpoint>\n${JSON.stringify(sessionCheckpoint)}\n</ailis_session_checkpoint>`
                };
            } catch {
                return part;
            }
        });
        return { ...item, role: item.role === 'user' ? 'developer' : item.role, content };
    });
    return sanitized;
}

function appendTurnCompletionToCheckpoint(checkpoint, thread, turn, packet) {
    const next = sanitizeContextCheckpoint(checkpoint) || {
        history_version: 0,
        token_info: null,
        reference_context_item: null,
        items: [{
            type: 'message',
            role: 'user',
            content: [{ type: 'input_text', text: turn.request }]
        }]
    };
    const finalText = normalizeString(packet.final_answer || packet.partial_answer || packet.display_text);
    const lastItem = next.items.at(-1);
    const lastText = lastItem?.type === 'message' && Array.isArray(lastItem.content)
        ? lastItem.content.map((part) => normalizeString(part?.text || part?.content)).filter(Boolean).join('\n')
        : '';
    if (finalText && !(lastItem?.role === 'assistant' && lastText === finalText)) {
        next.items.push({
            type: 'message',
            role: 'assistant',
            phase: 'final_answer',
            content: [{ type: 'output_text', text: finalText }]
        });
    }
    next.history_version = Number(next.history_version || 0) + 1;
    next.session_state = {
        thread_id: thread.threadId,
        last_turn_id: turn.turnId,
        turn_count: thread.turns.length
    };
    next.turn_index = thread.turns.slice(-40).map((entry) => ({
        turn_id: entry.turnId,
        request: entry.request,
        latest_request: entry.latestRequest,
        status: entry.resultStatus || entry.status,
        final_answer: entry.finalAnswer,
        trace_ref: entry.traceRef,
        created_at: entry.createdAt,
        completed_at: entry.completedAt
    }));
    return next;
}

function buildTaskResultPacket(result = {}, state = {}) {
    const thread = state.thread || state;
    const turn = state.turn || state;
    const handoff = result.taskRunHandoff || result.task_run_handoff || result.handoff || {};
    const collectedData = Array.isArray(handoff.collectedData) ? handoff.collectedData : [];
    const finalAnswer = normalizeString(
        handoff.finalAnswer || result.finalAnswer || result.answer || result.displayText
    );
    const displayText = normalizeString(result.displayText || result.display_text || finalAnswer);
    const partialAnswer = normalizeString(handoff.partialAnswer);
    const status = normalizeString(handoff.status || result.status, result.ok === false ? 'failed' : 'completed').toLowerCase();
    const unresolvedFields = FINAL_STATUSES.has(status)
        ? []
        : uniqueStrings([
              ...(Array.isArray(handoff.unresolvedFields) ? handoff.unresolvedFields : []),
              ...(Array.isArray(handoff.unresolved_fields) ? handoff.unresolved_fields : []),
              ...(Array.isArray(result.unresolvedFields) ? result.unresolvedFields : []),
              ...(Array.isArray(result.unresolved_fields) ? result.unresolved_fields : []),
              handoff.failureAnalysis?.bottleneck,
              handoff.reason,
              handoff.nextStep?.recommendation
          ], 24);
    return {
        schema: TASK_RESULT_SCHEMA,
        optimization: LONG_HORIZON_TASK_OPTIMIZATION,
        thread_id: normalizeString(thread.threadId || thread.taskId),
        turn_id: normalizeString(turn.turnId || turn.taskId),
        task_id: normalizeString(turn.turnId || turn.taskId || thread.threadId || thread.taskId),
        status,
        // Kept for TaskResult v1 compatibility. It reflects only an explicit model-managed
        // Goal; the Session's first request is never promoted into an implicit fixed Goal.
        original_goal: normalizeString(thread.activeGoal?.objective),
        active_goal: thread.activeGoal ? cloneJson(thread.activeGoal) : null,
        current_request: normalizeString(turn.latestRequest || turn.currentRequest),
        final_answer: finalAnswer,
        display_text: displayText,
        partial_answer: partialAnswer,
        source_refs: normalizeSourceRefs(handoff.sourceRefs),
        output_refs: outputRefsFromCollectedData(collectedData),
        unresolved_fields: unresolvedFields,
        trace_ref: normalizeString(handoff.traceRef || result.runId || turn.runId || turn.latestRunId),
        checkpoint_available: Boolean(
            handoff.resume?.contextManagerCheckpoint ||
            handoff.resume?.context_manager_checkpoint ||
            thread.contextCheckpoint
        )
    };
}

class AILISSystemTaskAgentHarness {
    constructor(options = {}) {
        this.rootDir = path.resolve(options.rootDir || path.join(process.cwd(), '.ailis-state', 'task-agent-harness'));
        this.statePath = path.resolve(options.statePath || path.join(this.rootDir, 'state.json'));
        this.executeTaskAgent = typeof options.executeTaskAgent === 'function'
            ? options.executeTaskAgent
            : null;
        this.emitEvent = typeof options.emitEvent === 'function' ? options.emitEvent : () => {};
        this.taskResultCapsules = options.taskResultCapsules || null;
        this.progressHeartbeatMs = Math.max(
            5_000,
            Number(options.progressHeartbeatMs || DEFAULT_PROGRESS_HEARTBEAT_MS) || DEFAULT_PROGRESS_HEARTBEAT_MS
        );
        const loaded = readJson(this.statePath, {});
        const loadedVersion = Number(loaded.version || 1);
        this.state = {
            version: TASK_HARNESS_STATE_VERSION,
            optimization: LONG_HORIZON_TASK_OPTIMIZATION,
            updatedAt: normalizeString(loaded.updatedAt),
            sessions: Object.fromEntries(
                Object.entries(loaded.sessions && typeof loaded.sessions === 'object' ? loaded.sessions : {})
                    .map(([sessionId, value]) => [
                        sessionId,
                        loadedVersion >= 2 || value?.threadId || value?.thread_id
                            ? normalizeStoredThread(value, sessionId)
                            : migrateLegacyTask(value, sessionId)
                    ])
                    .filter(([, thread]) => Boolean(thread))
            )
        };
        let repairedInterruptedTurn = false;
        for (const thread of Object.values(this.state.sessions)) {
            if (!thread?.activeTurnId) {
                continue;
            }
            const turn = thread.turns.find((candidate) => candidate.turnId === thread.activeTurnId);
            if (turn) {
                turn.status = 'interrupted';
                turn.resultStatus = 'interrupted';
                turn.completedAt = new Date().toISOString();
                turn.updatedAt = turn.completedAt;
            }
            thread.activeTurnId = '';
            repairedInterruptedTurn = true;
        }
        this.inFlight = new Map();
        this.parentRunHandoffs = new Map();
        if ((loadedVersion < TASK_HARNESS_STATE_VERSION || repairedInterruptedTurn) && Object.keys(this.state.sessions).length) {
            this.persist();
        }
    }

    persist() {
        this.state.version = TASK_HARNESS_STATE_VERSION;
        this.state.optimization = LONG_HORIZON_TASK_OPTIMIZATION;
        this.state.updatedAt = new Date().toISOString();
        atomicWriteJson(this.statePath, this.state);
    }

    getThread(sessionId = '') {
        return this.state.sessions[normalizeString(sessionId, 'main')] || null;
    }

    getTask(sessionId = '') {
        return this.getThread(sessionId);
    }

    isRunning(sessionId = '') {
        return this.inFlight.has(normalizeString(sessionId, 'main'));
    }

    getSessionSnapshot(sessionId = '') {
        const normalizedSessionId = normalizeString(sessionId, 'main');
        const thread = this.getThread(normalizedSessionId);
        const running = this.inFlight.get(normalizedSessionId);
        const latestTurn = thread?.turns?.at?.(-1) || null;
        return {
            schema: 'ailis.task_agent_session_snapshot.v1',
            session_id: normalizedSessionId,
            running: Boolean(running),
            thread_id: normalizeString(thread?.threadId),
            active_turn_id: normalizeString(running?.turn?.turnId || thread?.activeTurnId),
            active_goal: thread?.activeGoal ? cloneJson(thread.activeGoal) : null,
            latest_turn: latestTurn ? {
                turn_id: normalizeString(latestTurn.turnId),
                status: normalizeString(latestTurn.status),
                request: normalizeString(latestTurn.latestRequest || latestTurn.request)
            } : null
        };
    }

    createThread(sessionId) {
        const now = new Date().toISOString();
        return {
            threadId: `thread_${randomUUID()}`,
            sessionId,
            childSessionId: '',
            turns: [],
            activeTurnId: '',
            activeGoal: null,
            goalHistory: [],
            contextCheckpoint: null,
            outputRefs: [],
            sourceRefs: [],
            unresolvedFields: [],
            traceRef: '',
            createdAt: now,
            updatedAt: now
        };
    }

    createTurn(thread, message) {
        const now = new Date().toISOString();
        const turn = {
            turnId: `turn_${randomUUID()}`,
            sessionId: thread.sessionId,
            runId: `task_run_${randomUUID()}`,
            request: message,
            latestRequest: message,
            inputs: [{ inputId: `input_${randomUUID()}`, message, createdAt: now }],
            status: 'running',
            resultStatus: '',
            finalAnswer: '',
            traceRef: '',
            createdAt: now,
            updatedAt: now,
            completedAt: ''
        };
        thread.turns.push(turn);
        thread.activeTurnId = turn.turnId;
        thread.updatedAt = now;
        return turn;
    }

    steerTurn(thread, turn, message) {
        const now = new Date().toISOString();
        turn.inputs.push({ inputId: `input_${randomUUID()}`, message, createdAt: now });
        turn.latestRequest = message;
        turn.status = 'running';
        turn.updatedAt = now;
        turn.completedAt = '';
        thread.activeTurnId = turn.turnId;
        thread.updatedAt = now;
        return turn;
    }

    findThreadForGoalContext(context = {}) {
        const explicitThreadId = normalizeString(context.taskAgentThreadId || context.task_agent_thread_id);
        const parentSessionId = normalizeString(context.parentSessionId || context.parent_session_id);
        if (explicitThreadId) {
            return Object.values(this.state.sessions).find((thread) => thread.threadId === explicitThreadId) || null;
        }
        return parentSessionId ? this.getThread(parentSessionId) : null;
    }

    applyGoalAction(args = {}, context = {}) {
        const action = normalizeString(args.action, 'get').toLowerCase();
        const thread = this.findThreadForGoalContext(context);
        if (!thread) {
            return { ok: false, status: 'thread_not_found', error: 'No TaskAgent thread is bound to this goal operation.' };
        }
        const turnId = normalizeString(context.taskAgentTurnId || context.task_agent_turn_id);
        if (action !== 'get' && (!turnId || thread.activeTurnId !== turnId)) {
            return {
                ok: false,
                status: 'stale_turn',
                error: 'Goal mutation rejected because the requesting Turn is no longer active.',
                thread_id: thread.threadId,
                active_turn_id: thread.activeTurnId
            };
        }
        const expectedGoalId = normalizeString(args.expected_goal_id || args.expectedGoalId);
        const currentGoal = thread.activeGoal;
        if (action === 'get') {
            return {
                ok: true,
                status: 'completed',
                thread_id: thread.threadId,
                turn_id: turnId,
                active_goal: currentGoal ? cloneJson(currentGoal) : null
            };
        }
        if (currentGoal && expectedGoalId && expectedGoalId !== currentGoal.goalId) {
            return {
                ok: false,
                status: 'goal_conflict',
                error: 'Goal mutation rejected because expected_goal_id does not match the active Goal.',
                active_goal: cloneJson(currentGoal)
            };
        }
        if (!currentGoal && expectedGoalId) {
            return {
                ok: false,
                status: 'goal_conflict',
                error: 'No active Goal matches expected_goal_id.',
                active_goal: null
            };
        }
        const now = new Date().toISOString();
        const objective = normalizeString(args.objective).slice(0, 4000);
        if (action === 'set') {
            if (!objective) {
                return { ok: false, status: 'invalid_goal', error: 'objective is required to set a Goal.' };
            }
            if (currentGoal && currentGoal.objective === objective) {
                thread.activeGoal = {
                    ...currentGoal,
                    status: 'active',
                    reason: normalizeString(args.reason, currentGoal.reason),
                    updatedAt: now,
                    completedAt: ''
                };
            } else {
                if (currentGoal) {
                    thread.goalHistory.push({
                        ...currentGoal,
                        status: 'replaced',
                        reason: normalizeString(args.reason, 'replaced_by_model_goal_transition'),
                        updatedAt: now,
                        completedAt: now
                    });
                }
                thread.activeGoal = {
                    goalId: `goal_${randomUUID()}`,
                    objective,
                    status: 'active',
                    reason: normalizeString(args.reason),
                    createdAt: now,
                    updatedAt: now,
                    completedAt: ''
                };
            }
        } else if (['complete', 'clear'].includes(action)) {
            if (!currentGoal) {
                return { ok: false, status: 'goal_not_found', active_goal: null };
            }
            thread.goalHistory.push({
                ...currentGoal,
                status: action === 'complete' ? 'completed' : 'cancelled',
                reason: normalizeString(args.reason),
                updatedAt: now,
                completedAt: now
            });
            thread.activeGoal = null;
        } else {
            return { ok: false, status: 'invalid_action', error: `Unsupported task_goal action: ${action}` };
        }
        thread.updatedAt = now;
        this.persist();
        this.emitEvent('task_agent.goal.updated', {
            optimization: LONG_HORIZON_TASK_OPTIMIZATION,
            sessionId: thread.sessionId,
            threadId: thread.threadId,
            turnId,
            action,
            activeGoal: thread.activeGoal ? cloneJson(thread.activeGoal) : null
        });
        return {
            ok: true,
            status: 'completed',
            action,
            thread_id: thread.threadId,
            turn_id: turnId,
            active_goal: thread.activeGoal ? cloneJson(thread.activeGoal) : null
        };
    }

    async handoff(_args = {}, context = {}) {
        const message = normalizeString(context.currentUserMessage);
        if (!message) {
            throw new Error('handoff_task requires the immutable current user message from the Agent Harness');
        }
        if (!this.executeTaskAgent) {
            throw new Error('System TaskAgent executor is not available');
        }
        const sessionId = normalizeString(context.sessionId || context.sessionKey, 'main');
        const parentRunId = normalizeString(context.runId || context.parentRunId);
        const parentRunKey = parentRunId ? `${sessionId}:${parentRunId}` : '';
        const existingHandoff = parentRunKey ? this.parentRunHandoffs.get(parentRunKey) : null;
        if (existingHandoff?.promise) {
            this.emitEvent('task_agent.handoff.reused', {
                optimization: LONG_HORIZON_TASK_OPTIMIZATION,
                sessionId,
                threadId: existingHandoff.threadId,
                turnId: existingHandoff.turnId,
                runId: existingHandoff.runId,
                parentRunId
            });
            return await existingHandoff.promise;
        }
        const running = this.inFlight.get(sessionId);
        if (running) {
            const expectedTurnId = normalizeString(
                context.expectedTaskAgentTurnId || context.expected_task_agent_turn_id
            );
            if (expectedTurnId && expectedTurnId !== running.turn.turnId) {
                throw new Error(`TaskAgent Turn mismatch: expected ${expectedTurnId}, active ${running.turn.turnId}`);
            }
            if (typeof running.inputHandler === 'function') {
                await running.inputHandler(message);
            } else {
                running.pendingInputs.push(message);
            }
            this.steerTurn(running.thread, running.turn, message);
            this.state.sessions[sessionId] = running.thread;
            this.persist();
            this.emitEvent('task_agent.handoff.queued', {
                optimization: LONG_HORIZON_TASK_OPTIMIZATION,
                sessionId,
                threadId: running.thread.threadId,
                turnId: running.turn.turnId,
                runId: running.turn.runId
            });
            this.emitEvent('subagent.event', {
                type: 'agent.progress.note',
                status: 'running',
                sessionId,
                parentRunId,
                childRunId: running.turn.runId,
                payload: {
                    runId: running.turn.runId,
                    text: '已收到你的补充，正在当前任务中继续处理。',
                    source: 'task_agent_steer_accepted'
                }
            });
            if (context.returnAfterSteer === true) {
                return {
                    schema: 'ailis.task_steer.v1',
                    status: 'accepted',
                    final_answer: '已收到你的补充，我会在当前任务中按新要求继续。',
                    thread_id: running.thread.threadId,
                    turn_id: running.turn.turnId,
                    trace_ref: running.turn.runId
                };
            }
            return await running.promise;
        }

        let thread = this.getThread(sessionId);
        const threadExisted = Boolean(thread);
        if (!thread) {
            thread = this.createThread(sessionId);
            thread.childSessionId = `${sessionId}:task-agent:${thread.threadId}`;
        }
        const expectedTurnId = normalizeString(
            context.expectedTaskAgentTurnId || context.expected_task_agent_turn_id
        );
        if (expectedTurnId) {
            throw new Error(`TaskAgent Turn mismatch: expected ${expectedTurnId}, but the Session has no active Turn.`);
        }
        const turn = this.createTurn(thread, message);
        this.state.sessions[sessionId] = thread;
        this.persist();
        this.emitEvent('task_agent.handoff.started', {
            optimization: LONG_HORIZON_TASK_OPTIMIZATION,
            sessionId,
            threadId: thread.threadId,
            turnId: turn.turnId,
            goalId: thread.activeGoal?.goalId || '',
            runId: turn.runId,
            threadState: threadExisted ? 'resumed' : 'created',
            turnState: 'created'
        });
        this.emitEvent('subagent.event', {
            type: 'subagent.started',
            status: 'running',
            sessionId,
            parentRunId,
            childRunId: turn.runId,
            payload: {
                runId: turn.runId,
                sessionId,
                taskState: 'working'
            }
        });

        const inFlight = {
            thread,
            turn,
            inputHandler: null,
            pendingInputs: [],
            promise: null
        };
        const registerInputHandler = (handler) => {
            inFlight.inputHandler = handler;
            const pending = inFlight.pendingInputs.splice(0);
            for (const input of pending) {
                Promise.resolve(handler(input)).catch(() => {});
            }
            return () => {
                if (inFlight.inputHandler === handler) {
                    inFlight.inputHandler = null;
                }
            };
        };
        const inheritanceMode = thread.contextCheckpoint ? 'checkpoint' : 'clean';
        const visibleMessages = (Array.isArray(context.taskAgentVisibleHistory)
            ? context.taskAgentVisibleHistory
            : Array.isArray(context.visibleConversation)
                ? context.visibleConversation
                : [])
            .filter((entry) => entry && ['user', 'assistant'].includes(entry.role) && normalizeString(entry.content))
            .map((entry) => ({ role: entry.role, content: normalizeString(entry.content) }))
            .slice(-240);
        const runPromise = (async () => {
            let lastPublicProgressAt = Date.now();
            const heartbeatTimer = setInterval(() => {
                if (Date.now() - lastPublicProgressAt < this.progressHeartbeatMs) {
                    return;
                }
                lastPublicProgressAt = Date.now();
                this.emitEvent('subagent.event', {
                    type: 'agent.progress.note',
                    status: 'running',
                    sessionId,
                    parentRunId,
                    childRunId: turn.runId,
                    payload: {
                        runId: turn.runId,
                        text: '任务仍在继续处理，当前没有中断。有新的关键结果时我会继续同步。',
                        source: 'task_agent_heartbeat'
                    }
                });
            }, this.progressHeartbeatMs);
            heartbeatTimer.unref?.();
            try {
                const result = await this.executeTaskAgent({
                    agent: {
                        id: thread.threadId,
                        label: 'TaskAgent',
                        runId: normalizeString(context.runId),
                        sessionId,
                        childRunId: turn.runId,
                        childSessionId: thread.childSessionId,
                        task: turn.latestRequest,
                        originalTask: turn.request,
                        agent_path: '/root/task_agent'
                    },
                    args: {
                        task: turn.latestRequest,
                        inheritanceMode,
                        contextManagerCheckpoint: thread.contextCheckpoint,
                        recentMessages: visibleMessages,
                        llmSettings: context.llmSettings || context.llm || null
                    },
                    context: {
                        ...context,
                        sessionId: thread.childSessionId,
                        sessionKey: thread.childSessionId,
                        parentSessionId: sessionId,
                        taskAgentOptimization: LONG_HORIZON_TASK_OPTIMIZATION,
                        task_agent_optimization: LONG_HORIZON_TASK_OPTIMIZATION,
                        taskAgentThreadId: thread.threadId,
                        task_agent_thread_id: thread.threadId,
                        taskAgentTurnId: turn.turnId,
                        task_agent_turn_id: turn.turnId,
                        taskAgentActiveGoal: thread.activeGoal ? cloneJson(thread.activeGoal) : null,
                        task_agent_active_goal: thread.activeGoal ? cloneJson(thread.activeGoal) : null,
                        currentTaskRequest: turn.latestRequest,
                        current_task_request: turn.latestRequest,
                        priorUnresolvedFields: [],
                        prior_unresolved_fields: [],
                        taskAgentInheritanceMode: inheritanceMode,
                        initialContextManagerCheckpoint: thread.contextCheckpoint
                    },
                    signal: context.signal,
                    registerInputHandler,
                    onEvent: async (event) => {
                        lastPublicProgressAt = Date.now();
                        this.emitEvent('task_agent.event', {
                            optimization: LONG_HORIZON_TASK_OPTIMIZATION,
                            sessionId,
                            threadId: thread.threadId,
                            turnId: turn.turnId,
                            runId: turn.runId,
                            event: cloneJson(event) || {}
                        });
                        this.emitEvent('subagent.event', {
                            type: normalizeString(event?.type, 'agent.progress.note'),
                            status: normalizeString(event?.status, 'running'),
                            sessionId,
                            parentRunId,
                            childRunId: turn.runId,
                            message: normalizeString(event?.message),
                            payload: {
                                ...(event?.payload && typeof event.payload === 'object' ? cloneJson(event.payload) : {}),
                                runId: turn.runId,
                                source: normalizeString(event?.payload?.source || event?.source, 'task_agent_event')
                            }
                        });
                    }
                });
                const packet = buildTaskResultPacket(result, { thread, turn });
                const handoff = result.taskRunHandoff || result.task_run_handoff || result.handoff || {};
                const now = new Date().toISOString();
                turn.status = packet.status;
                turn.resultStatus = packet.status;
                turn.finalAnswer = packet.final_answer;
                turn.traceRef = packet.trace_ref;
                turn.updatedAt = now;
                turn.completedAt = now;
                const nextCheckpoint = handoff.resume?.contextManagerCheckpoint || handoff.resume?.context_manager_checkpoint;
                thread.contextCheckpoint = appendTurnCompletionToCheckpoint(
                    nextCheckpoint && typeof nextCheckpoint === 'object' ? nextCheckpoint : thread.contextCheckpoint,
                    thread,
                    turn,
                    packet
                );
                thread.outputRefs = packet.output_refs;
                thread.sourceRefs = packet.source_refs;
                thread.unresolvedFields = packet.unresolved_fields;
                thread.traceRef = packet.trace_ref;
                thread.updatedAt = now;
                thread.activeTurnId = '';
                this.state.sessions[sessionId] = thread;
                this.persist();
                this.taskResultCapsules?.recordExecution?.({
                    sessionId,
                    parentRunId: normalizeString(context.runId),
                    action: inheritanceMode === 'checkpoint' ? 'resume' : 'spawn',
                    task: turn.request,
                    ok: FINAL_STATUSES.has(packet.status),
                    status: packet.status,
                    subagent: {
                        id: thread.threadId,
                        childRunId: turn.runId,
                        sessionId,
                        threadId: thread.threadId,
                        turnId: turn.turnId,
                        originalTask: turn.request,
                        task: turn.latestRequest,
                        status: packet.status
                    },
                    childResult: result,
                    taskRunHandoff: handoff,
                    unresolvedFields: packet.unresolved_fields
                });
                this.emitEvent('task_agent.handoff.finished', {
                    optimization: LONG_HORIZON_TASK_OPTIMIZATION,
                    sessionId,
                    threadId: thread.threadId,
                    turnId: turn.turnId,
                    goalId: thread.activeGoal?.goalId || '',
                    runId: turn.runId,
                    status: packet.status,
                    traceRef: packet.trace_ref
                });
                this.emitEvent('subagent.event', {
                    type: 'subagent.completed',
                    status: packet.status,
                    sessionId,
                    parentRunId,
                    childRunId: turn.runId,
                    payload: {
                        runId: turn.runId,
                        ok: FINAL_STATUSES.has(packet.status),
                        status: packet.status
                    }
                });
                return packet;
            } catch (error) {
                const now = new Date().toISOString();
                turn.status = 'failed';
                turn.resultStatus = 'failed';
                turn.updatedAt = now;
                turn.completedAt = now;
                thread.activeTurnId = '';
                thread.updatedAt = now;
                this.state.sessions[sessionId] = thread;
                this.persist();
                throw error;
            } finally {
                clearInterval(heartbeatTimer);
            }
        })();
        inFlight.promise = runPromise;
        this.inFlight.set(sessionId, inFlight);
        if (parentRunKey) {
            this.parentRunHandoffs.set(parentRunKey, {
                promise: runPromise,
                threadId: thread.threadId,
                turnId: turn.turnId,
                runId: turn.runId
            });
            while (this.parentRunHandoffs.size > MAX_PARENT_RUN_HANDOFFS) {
                this.parentRunHandoffs.delete(this.parentRunHandoffs.keys().next().value);
            }
        }
        try {
            return await runPromise;
        } finally {
            if (this.inFlight.get(sessionId) === inFlight) {
                this.inFlight.delete(sessionId);
            }
        }
    }

    getStatus() {
        return {
            ok: true,
            version: TASK_HARNESS_STATE_VERSION,
            optimization: LONG_HORIZON_TASK_OPTIMIZATION,
            statePath: this.statePath,
            sessionCount: Object.keys(this.state.sessions).length,
            inFlightCount: this.inFlight.size,
            parentRunHandoffCount: this.parentRunHandoffs.size,
            updatedAt: this.state.updatedAt
        };
    }
}

module.exports = {
    AILISSystemTaskAgentHarness,
    TASK_HARNESS_STATE_VERSION,
    TASK_RESULT_SCHEMA,
    LONG_HORIZON_TASK_OPTIMIZATION,
    buildTaskResultPacket
};
