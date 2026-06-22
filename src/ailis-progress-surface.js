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
    return normalizeText(value)
        .replace(/\b(tool_call|raw observation|approvalId|mcp_bridge|artifact_verifier|llm-agentic-executor)\b/gi, '')
        .replace(/[_`]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function normalizeToolId(value) {
    return normalizeText(value).toLowerCase();
}

export function createPersonaProgressFrame(event = {}, options = {}) {
    const type = normalizeText(event.type);
    const payload = event.payload && typeof event.payload === 'object' ? event.payload : {};

    if (type === 'agent.run.started') {
        return null;
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
