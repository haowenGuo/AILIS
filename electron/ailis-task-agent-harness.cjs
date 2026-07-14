const fs = require('fs');
const path = require('path');
const { randomUUID } = require('crypto');

const TASK_HARNESS_STATE_VERSION = 1;
const TASK_RESULT_SCHEMA = 'ailis.task_result.v1';
const TASK_AGENT_MAX_MODEL_ROUNDS = 7;
const MAX_PARENT_RUN_HANDOFFS = 256;
const CONTINUATION_MODES = new Set(['auto', 'continue', 'new']);
const FINAL_STATUSES = new Set(['completed', 'success', 'succeeded']);

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

function refsFromCollectedData(collectedData = [], key = 'evidenceRefs') {
    const refs = [];
    for (const item of Array.isArray(collectedData) ? collectedData : []) {
        if (key === 'outputRefs') {
            refs.push(item?.outputId, item?.artifactId);
        } else {
            refs.push(...(Array.isArray(item?.evidenceRefs) ? item.evidenceRefs : []));
        }
    }
    return uniqueStrings(refs);
}

function normalizeStoredTask(raw = {}) {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
        return null;
    }
    const taskId = normalizeString(raw.taskId);
    const sessionId = normalizeString(raw.sessionId);
    const originalGoal = normalizeString(raw.originalGoal);
    if (!taskId || !sessionId || !originalGoal) {
        return null;
    }
    return {
        taskId,
        sessionId,
        originalGoal,
        latestRequest: normalizeString(raw.latestRequest, originalGoal),
        status: normalizeString(raw.status, 'incomplete').toLowerCase(),
        childSessionId: normalizeString(raw.childSessionId, `${sessionId}:task-agent:${taskId}`),
        latestRunId: normalizeString(raw.latestRunId),
        checkpoint: raw.checkpoint && typeof raw.checkpoint === 'object' ? raw.checkpoint : null,
        evidenceRefs: uniqueStrings(raw.evidenceRefs),
        outputRefs: uniqueStrings(raw.outputRefs),
        sourceRefs: normalizeSourceRefs(raw.sourceRefs),
        unresolvedFields: uniqueStrings(raw.unresolvedFields, 24),
        traceRef: normalizeString(raw.traceRef || raw.latestRunId),
        createdAt: normalizeString(raw.createdAt, new Date().toISOString()),
        updatedAt: normalizeString(raw.updatedAt, new Date().toISOString())
    };
}

function buildTaskResultPacket(result = {}, task = {}) {
    const handoff = result.taskRunHandoff || result.task_run_handoff || result.handoff || {};
    const collectedData = Array.isArray(handoff.collectedData) ? handoff.collectedData : [];
    const finalAnswer = normalizeString(
        handoff.finalAnswer || result.finalAnswer || result.answer || result.displayText
    );
    const partialAnswer = normalizeString(handoff.partialAnswer);
    const status = normalizeString(handoff.status || result.status, result.ok === false ? 'failed' : 'completed').toLowerCase();
    const unresolvedFields = FINAL_STATUSES.has(status)
        ? []
        : uniqueStrings([
              handoff.failureAnalysis?.bottleneck,
              handoff.nextStep?.recommendation
          ], 24);
    return {
        schema: TASK_RESULT_SCHEMA,
        task_id: task.taskId,
        status,
        original_goal: task.originalGoal,
        current_request: task.latestRequest,
        final_answer: finalAnswer,
        partial_answer: partialAnswer,
        source_refs: normalizeSourceRefs(handoff.sourceRefs),
        evidence_refs: refsFromCollectedData(collectedData, 'evidenceRefs'),
        output_refs: refsFromCollectedData(collectedData, 'outputRefs'),
        unresolved_fields: unresolvedFields,
        trace_ref: normalizeString(handoff.traceRef || result.runId || task.latestRunId),
        checkpoint_available: Boolean(
            handoff.resume?.contextManagerCheckpoint ||
            handoff.resume?.context_manager_checkpoint
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
        this.maxAgentSteps = Math.max(2, Math.min(
            Number(options.maxAgentSteps) || TASK_AGENT_MAX_MODEL_ROUNDS,
            TASK_AGENT_MAX_MODEL_ROUNDS
        ));
        const loaded = readJson(this.statePath, {});
        this.state = {
            version: TASK_HARNESS_STATE_VERSION,
            updatedAt: normalizeString(loaded.updatedAt),
            sessions: Object.fromEntries(
                Object.entries(loaded.sessions && typeof loaded.sessions === 'object' ? loaded.sessions : {})
                    .map(([sessionId, task]) => [sessionId, normalizeStoredTask(task)])
                    .filter(([, task]) => Boolean(task))
            )
        };
        this.inFlight = new Map();
        this.parentRunHandoffs = new Map();
    }

    persist() {
        this.state.version = TASK_HARNESS_STATE_VERSION;
        this.state.updatedAt = new Date().toISOString();
        atomicWriteJson(this.statePath, this.state);
    }

    getTask(sessionId = '') {
        return this.state.sessions[normalizeString(sessionId, 'main')] || null;
    }

    selectPriorTask(sessionId, continuation) {
        const prior = this.getTask(sessionId);
        if (!prior || continuation === 'new') {
            return null;
        }
        if (continuation === 'continue') {
            return prior;
        }
        return FINAL_STATUSES.has(prior.status) ? null : prior;
    }

    createTask({ sessionId, message, prior = null }) {
        const taskId = prior?.taskId || `task_${randomUUID()}`;
        const now = new Date().toISOString();
        return {
            taskId,
            sessionId,
            originalGoal: prior?.originalGoal || message,
            latestRequest: message,
            status: 'running',
            childSessionId: prior?.childSessionId || `${sessionId}:task-agent:${taskId}`,
            latestRunId: `task_run_${randomUUID()}`,
            checkpoint: prior?.checkpoint || null,
            evidenceRefs: prior?.evidenceRefs || [],
            outputRefs: prior?.outputRefs || [],
            sourceRefs: prior?.sourceRefs || [],
            unresolvedFields: prior?.unresolvedFields || [],
            traceRef: prior?.traceRef || '',
            createdAt: prior?.createdAt || now,
            updatedAt: now
        };
    }

    async handoff(args = {}, context = {}) {
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
                sessionId,
                taskId: existingHandoff.taskId,
                runId: existingHandoff.runId,
                parentRunId
            });
            return await existingHandoff.promise;
        }
        const requestedContinuation = normalizeString(args.continuation, 'auto').toLowerCase();
        const continuation = CONTINUATION_MODES.has(requestedContinuation) ? requestedContinuation : 'auto';
        const running = this.inFlight.get(sessionId);
        if (running) {
            running.task.latestRequest = message;
            running.task.updatedAt = new Date().toISOString();
            this.state.sessions[sessionId] = running.task;
            this.persist();
            if (typeof running.inputHandler === 'function') {
                await running.inputHandler(message);
            } else {
                running.pendingInputs.push(message);
            }
            this.emitEvent('task_agent.handoff.queued', {
                sessionId,
                taskId: running.task.taskId,
                runId: running.task.latestRunId
            });
            return await running.promise;
        }

        const prior = this.selectPriorTask(sessionId, continuation);
        const task = this.createTask({ sessionId, message, prior });
        this.state.sessions[sessionId] = task;
        this.persist();
        this.emitEvent('task_agent.handoff.started', {
            sessionId,
            taskId: task.taskId,
            runId: task.latestRunId,
            continuation: prior ? 'continued' : 'new'
        });

        const inFlight = {
            task,
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
        const inheritanceMode = prior?.checkpoint ? 'checkpoint' : 'clean';
        const runPromise = (async () => {
            const result = await this.executeTaskAgent({
                agent: {
                    id: task.taskId,
                    label: 'TaskAgent',
                    runId: normalizeString(context.runId),
                    sessionId,
                    childRunId: task.latestRunId,
                    childSessionId: task.childSessionId,
                    task: message,
                    originalTask: task.originalGoal,
                    agent_path: '/root/task_agent'
                },
                args: {
                    task: message,
                    inheritanceMode,
                    contextManagerCheckpoint: prior?.checkpoint || null,
                    maxAgentSteps: this.maxAgentSteps,
                    llmSettings: context.llmSettings || context.llm || null
                },
                context: {
                    ...context,
                    sessionId: task.childSessionId,
                    sessionKey: task.childSessionId,
                    parentSessionId: sessionId,
                    originalUserGoal: task.originalGoal,
                    original_user_goal: task.originalGoal,
                    taskAgentInheritanceMode: inheritanceMode,
                    initialContextManagerCheckpoint: prior?.checkpoint || null,
                    maxAgentSteps: this.maxAgentSteps
                },
                signal: context.signal,
                registerInputHandler,
                onEvent: async (event) => {
                    this.emitEvent('task_agent.event', {
                        sessionId,
                        taskId: task.taskId,
                        runId: task.latestRunId,
                        event: cloneJson(event) || {}
                    });
                }
            });
            const packet = buildTaskResultPacket(result, task);
            const handoff = result.taskRunHandoff || result.task_run_handoff || result.handoff || {};
            task.status = packet.status;
            task.checkpoint = handoff.resume?.contextManagerCheckpoint || handoff.resume?.context_manager_checkpoint || null;
            task.evidenceRefs = packet.evidence_refs;
            task.outputRefs = packet.output_refs;
            task.sourceRefs = packet.source_refs;
            task.unresolvedFields = packet.unresolved_fields;
            task.traceRef = packet.trace_ref;
            task.updatedAt = new Date().toISOString();
            this.state.sessions[sessionId] = task;
            this.persist();
            this.taskResultCapsules?.recordExecution?.({
                sessionId,
                parentRunId: normalizeString(context.runId),
                action: prior ? 'resume' : 'spawn',
                task: task.originalGoal,
                ok: FINAL_STATUSES.has(packet.status),
                status: packet.status,
                subagent: {
                    id: task.taskId,
                    childRunId: task.taskId,
                    sessionId,
                    originalTask: task.originalGoal,
                    task: task.latestRequest,
                    status: packet.status
                },
                childResult: result,
                taskRunHandoff: handoff,
                unresolvedFields: packet.unresolved_fields
            });
            this.emitEvent('task_agent.handoff.finished', {
                sessionId,
                taskId: task.taskId,
                runId: task.latestRunId,
                status: packet.status,
                traceRef: packet.trace_ref
            });
            return packet;
        })();
        inFlight.promise = runPromise;
        this.inFlight.set(sessionId, inFlight);
        if (parentRunKey) {
            this.parentRunHandoffs.set(parentRunKey, {
                promise: runPromise,
                taskId: task.taskId,
                runId: task.latestRunId
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
    buildTaskResultPacket
};
