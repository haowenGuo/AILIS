const PROGRESS_MAX_FRAMES = 3;

const INTERNAL_PROGRESS_TOOLS = new Set([
    'update_plan',
    'load_context',
    'load_capability',
    'load_skill',
    'load_tool_schema'
]);

function normalizeText(value) {
    if (typeof value !== 'string') {
        return '';
    }
    return value.replace(/[ \t]+/g, ' ').trim();
}

function normalizeProgressText(value) {
    const text = normalizeText(value)
        .replace(/\b(tool_call|raw observation|approvalId|mcp_bridge|artifact_verifier|llm-agentic-executor)\b/gi, '')
        .replace(/[_`]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    if (!text || looksLikeInternalPayload(text)) {
        return '';
    }
    return text;
}

function normalizeToolId(value) {
    return normalizeText(value).toLowerCase();
}

function looksLikeInternalPayload(text = '') {
    const value = normalizeText(text);
    if (!value) {
        return false;
    }
    if ((value.startsWith('{') && value.endsWith('}')) || (value.startsWith('[') && value.endsWith(']'))) {
        return true;
    }
    return /\b(childRunId|subagentId|parentRunId|sessionId|runId|approvalId)\b/i.test(value) &&
        /["{}:[\],]/.test(value);
}

function buildSubagentProgressFrame(payload = {}) {
    const childType = normalizeText(payload.type);
    const status = normalizeText(payload.status).toLowerCase();
    const childPayload = payload.payload && typeof payload.payload === 'object' ? payload.payload : {};
    const modelText = normalizeProgressText(childPayload.text || childPayload.delta || childPayload.summary || payload.text);
    if ((childType === 'agent.progress.note' || childType === 'agent.reasoning.delta') && modelText) {
        return {
            phase: 'subagent_progress_note',
            text: modelText,
            bubbleText: modelText,
            taskState: 'thinking',
            gestureIntent: 'thinking',
            source: childPayload.source || payload.source || 'subagent_model_progress_note'
        };
    }
    if (childType === 'subagent.started' || status === 'queued' || status === 'running') {
        const task = normalizeProgressText(payload.message || childPayload.task);
        const text = task
            ? `我已经让任务代理开始处理：${task}`
            : '我已经让任务代理开始处理，会把关键进展同步给你。';
        return {
            phase: 'subagent_started',
            text,
            bubbleText: text,
            taskState: 'working',
            gestureIntent: 'thinking',
            source: 'subagent_lifecycle'
        };
    }
    if (childType === 'subagent.completed' && status === 'completed') {
        return null;
    }
    if (childType === 'subagent.completed' || ['failed', 'timeout', 'cancelled', 'interrupted'].includes(status)) {
        const text = normalizeProgressText(payload.message || childPayload.summary || childPayload.error);
        if (!text) {
            return null;
        }
        return {
            phase: status === 'completed' ? 'subagent_completed' : 'subagent_blocked',
            text,
            bubbleText: text,
            taskState: status === 'completed' ? 'working' : 'failed',
            gestureIntent: 'thinking',
            source: 'subagent_lifecycle'
        };
    }
    return null;
}

export function createPersonaProgressFrame(event = {}, options = {}) {
    const type = normalizeText(event.type);
    const payload = event.payload && typeof event.payload === 'object' ? event.payload : {};

    if (type === 'agent.run.started') {
        return null;
    }

    if (type === 'subagent.event') {
        return buildSubagentProgressFrame(payload);
    }

    if (type === 'agent.reasoning.delta' || type === 'agent.progress.note') {
        const text = normalizeProgressText(payload.text || payload.delta || payload.summary);
        if (!text) {
            return null;
        }
        return {
            phase: type === 'agent.progress.note' ? 'progress_note' : 'reasoning_delta',
            text,
            bubbleText: text,
            taskState: 'thinking',
            gestureIntent: 'thinking',
            source: payload.source || (type === 'agent.progress.note' ? 'model_progress_note' : 'model_public_reasoning')
        };
    }

    if (type === 'agent.message.delta') {
        const text = normalizeProgressText(payload.text || payload.delta);
        if (!text) {
            return null;
        }
        return {
            phase: 'message_delta',
            text,
            bubbleText: text,
            taskState: 'speaking',
            gestureIntent: 'none'
        };
    }

    if (type === 'agent.step.started') {
        return null;
    }

    if (type === 'agent.step.finished') {
        const tool = normalizeToolId(payload.tool);
        const text = normalizeProgressText(payload.progressNote || payload.progress_note || payload.text || payload.summary);
        if (INTERNAL_PROGRESS_TOOLS.has(tool) || !text) {
            return null;
        }
        return {
            phase: payload.ok === false ? 'step_blocked' : 'step_note',
            tool,
            text,
            bubbleText: text,
            taskState: payload.ok === false ? 'failed' : 'working',
            gestureIntent: 'thinking',
            source: payload.source || 'model_step_progress'
        };
    }

    return null;
}

export function renderPersonaProgressSurface(frames = []) {
    const visibleFrames = frames
        .filter((frame) => frame?.text)
        .slice(-PROGRESS_MAX_FRAMES);
    const text = visibleFrames.map((frame) => frame.text).join('\n');
    const latestFrame = visibleFrames.at(-1) || {};
    return {
        renderer: 'ailis-progress-surface',
        text,
        speechText: '',
        bubbleText: latestFrame.bubbleText || latestFrame.text || '我在处理。',
        expression: 'relaxed',
        action: 'thinking',
        emotion: latestFrame.phase === 'step_blocked' ? 'thinking' : 'focused',
        intensity: latestFrame.phase === 'task_started' ? 0.3 : 0.38,
        socialTone: 'soft',
        gestureIntent: latestFrame.gestureIntent || 'working',
        taskState: latestFrame.taskState || 'working',
        speechEnergy: 0.18,
        gazeTarget: 'screen',
        durationHint: 'short',
        source: 'persona_progress_surface',
        traceVisible: true
    };
}

export { PROGRESS_MAX_FRAMES };
