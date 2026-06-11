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

    if (type === 'agent.reasoning.delta') {
        const text = normalizeProgressText(payload.text || payload.delta || payload.summary);
        if (!text) {
            return null;
        }
        return {
            phase: 'reasoning_delta',
            text,
            bubbleText: text,
            taskState: 'thinking',
            gestureIntent: 'thinking'
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
        if (INTERNAL_PROGRESS_TOOLS.has(tool)) {
            return null;
        }
        if (payload.ok === false) {
            return {
                phase: 'step_blocked',
                tool,
                text: '有一步没有顺利通过，我会换个更稳的办法确认。',
                bubbleText: '我换个办法确认。',
                taskState: 'failed',
                gestureIntent: 'thinking'
            };
        }
        return null;
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
        renderer: 'aigl-progress-surface',
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
